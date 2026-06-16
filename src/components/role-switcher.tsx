import { Check, ChevronDown, ArrowLeftRight, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRole } from "@/lib/role-context";
import { useAuth } from "@/lib/auth-context";
import { ROLES, type RoleId } from "@/lib/roles";
import { useI18n } from "@/lib/i18n";

type Props = {
  /** When the shell already shows the role label, hide it from the trigger */
  compact?: boolean;
};

/**
 * Centralized RoleSwitcher used by every workspace shell. Reads the active
 * role and the (mock) list of permitted roles from the RoleProvider so the
 * same component works for student, teacher, supervisor, parent and admin.
 */
export function RoleSwitcher({ compact = false }: Props) {
  const { activeRole, availableRoles, setActiveRole } = useRole();
  const { user, logout } = useAuth();
  const { lang } = useI18n();
  const fa = lang === "fa";

  const current = activeRole ? ROLES[activeRole] : null;
  const CurrentIcon = current?.icon ?? ArrowLeftRight;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full h-9 gap-1.5 px-3"
          aria-label={fa ? "تغییر نقش" : "Switch role"}
        >
          <CurrentIcon className="h-4 w-4" />
          {!compact && current ? (
            <span className="hidden sm:inline text-xs font-semibold">
              {fa ? current.labelFa : current.labelEn}
            </span>
          ) : null}
          <ChevronDown className="h-3.5 w-3.5 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="text-xs">
          {fa ? "تغییر فضای کاری" : "Switch workspace"}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {availableRoles.map((id: RoleId) => {
          const r = ROLES[id];
          const Icon = r.icon;
          const isActive = id === activeRole;
          return (
            <DropdownMenuItem
              key={id}
              onSelect={(e) => {
                e.preventDefault();
                if (!isActive) setActiveRole(id);
              }}
              className="gap-3 py-2.5"
            >
              <div
                className={`h-8 w-8 rounded-md grid place-items-center text-white bg-gradient-to-br ${r.accent}`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-tight">
                  {fa ? r.labelFa : r.labelEn}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {fa ? r.descriptionFa : r.descriptionEn}
                </p>
              </div>
              {isActive ? <Check className="h-4 w-4 text-primary" /> : null}
            </DropdownMenuItem>
          );
        })}
        {user ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                logout();
              }}
              className="gap-2 py-2.5 text-destructive focus:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-medium">
                {fa ? "خروج از حساب" : "Sign out"}
              </span>
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
