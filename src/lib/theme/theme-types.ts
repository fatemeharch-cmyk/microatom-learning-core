import type { RoleId } from "../roles";

export type ThemeColors = {
  primary?: string;
  secondary?: string;
  accent?: string;
  background?: string;
};

export type ThemeTerminology = {
  exam?: string;
  study_time?: string;
  [key: string]: string | undefined;
};

export type ThemeMenuItem = {
  title: string;
  url: string;
  icon?: string;
};

export type ThemeMenus = {
  sidebar?: ThemeMenuItem[];
};

export type ThemeDashboardConfig = {
  title?: string;
  greeting?: string;
  summary_title?: string;
  [key: string]: string | undefined;
};

export type Theme = {
  colors?: ThemeColors;
  terminology?: ThemeTerminology;
  menus?: ThemeMenus;
  /** Dashboard-level copy (title, greeting, summary heading). */
  dashboard_config?: ThemeDashboardConfig;
  /** Optional override for the post-login landing route (e.g. "/student"). */
  dashboard_route?: string;
  /** Optional welcome text shown on the login / role-selection screen. */
  login_welcome?: string;
  /** Optional human-readable theme/brand name. */
  name?: string;
};

export type ThemeResponse = {
  theme?: Theme;
} & Theme;

export type ThemeRequest = {
  user_id: number;
  role: RoleId;
};
