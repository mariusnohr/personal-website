import type { Key } from 'path-to-regexp';
import type View from './View';

export interface RouteConfig {
  className?: string;
  path?: string;
  template: string;
  component?: new (options: { el: HTMLElement }) => View;
  regEx?: RegExp | null;
  keys?: Key;
}

export type Routes = Record<string, RouteConfig>;

export interface RouteParam {
  [key: string]: string;
}

export interface RouteMatch {
  match: RouteConfig;
  param?: RouteParam;
}
