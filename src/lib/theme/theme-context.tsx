import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "../auth-context";
import type { RoleId } from "../roles";
import type { Theme, ThemeResponse } from "./theme-types";

/**
 * Atomia Theme Engine integration.
 *
 * Fetches POST https://x8ki-letl-twmt.n7.xano.io/api:theme/current with
 * { user_id, role } and exposes:
 *   - theme.menus  → sidebar items (resolved to Lucide icons by callers)
 *   - theme.colors → applied to CSS custom properties on <html>
 *   - theme.terminology → exam / study_time / ...
 *
 * On failure (e.g. endpoint not yet deployed) the provider keeps `theme`
 * null and callers gracefully fall back to the existing hardcoded UI.
 */

const THEME_ENDPOINT = "https://x8ki-letl-twmt.n7.xano.io/api:theme/current";

type ThemeContextValue = {
  theme: Theme | null;
  loading: boolean;
  error: string | null;
  /** Lookup helper: `t("exam", "چکاب")` returns theme value or fallback. */
  t: (key: string, fallback: string) => string;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function normalize(res: ThemeResponse | null | undefined): Theme | null {
  if (!res) return null;
  // Accept either { theme: {...} } or a flat object.
  const inner = (res.theme ?? res) as Theme;
  if (!inner || typeof inner !== "object") return null;
  return inner;
}

function applyColorVars(colors?: Theme["colors"]) {
  if (typeof document === "undefined" || !colors) return;
  const root = document.documentElement;
  const map: Record<string, string | undefined> = {
    "--primary": colors.primary,
    "--secondary": colors.secondary,
    "--accent": colors.accent,
    "--background": colors.background,
  };
  for (const [name, value] of Object.entries(map)) {
    if (value && typeof value === "string") {
      root.style.setProperty(name, value);
    }
  }
}

function readCachedTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem("atomia_theme");
    if (!raw) return null;
    return normalize(JSON.parse(raw) as ThemeResponse);
  } catch {
    return null;
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [theme, setTheme] = useState<Theme | null>(() => {
    const cached = readCachedTheme();
    if (cached) applyColorVars(cached.colors);
    return cached;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setTheme(null);
      return;
    }
    // Per spec: avoid a network call on every render — only fetch when no
    // cached theme exists in localStorage.
    if (typeof window !== "undefined" && window.localStorage.getItem("atomia_theme")) {
      const cached = readCachedTheme();
      if (cached) {
        setTheme(cached);
        applyColorVars(cached.colors);
        return;
      }
    }

      setTheme(null);
      return;
    }
    let cancelled = false;
    const controller = new AbortController();

    const userIdNum = Number(user.id);
    const body = {
      user_id: Number.isFinite(userIdNum) ? userIdNum : 1,
      role: user.role as RoleId,
    };

    setLoading(true);
    setError(null);

    fetch(THEME_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Theme API ${res.status}`);
        }
        return (await res.json()) as ThemeResponse;
      })
      .then((json) => {
        if (cancelled) return;
        const t = normalize(json);
        setTheme(t);
        applyColorVars(t?.colors);
        try {
          window.localStorage.setItem("atomia_theme", JSON.stringify(json));
        } catch {
          /* ignore */
        }
      })
      .catch((err) => {
        if (cancelled || err?.name === "AbortError") return;
        // eslint-disable-next-line no-console
        console.warn("[theme] failed to load, using fallback:", err?.message ?? err);
        setError(err?.message ?? String(err));
        setTheme(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [user?.id, user?.role]);

  const value = useMemo<ThemeContextValue>(() => {
    const terminology = theme?.terminology ?? {};
    return {
      theme,
      loading,
      error,
      t: (key, fallback) => {
        const v = terminology[key];
        return typeof v === "string" && v.length ? v : fallback;
      },
    };
  }, [theme, loading, error]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>");
  return ctx;
}
