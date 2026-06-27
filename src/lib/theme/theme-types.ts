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

export type Theme = {
  colors?: ThemeColors;
  terminology?: ThemeTerminology;
  menus?: ThemeMenus;
};

export type ThemeResponse = {
  theme?: Theme;
} & Theme;

export type ThemeRequest = {
  user_id: number;
  role: RoleId;
};
