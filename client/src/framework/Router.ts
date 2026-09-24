import { createBrowserHistory } from 'history';
import type { Action, BrowserHistory, Location } from 'history';
import { pathToRegexp } from 'path-to-regexp';
import type { Key } from 'path-to-regexp';

import type { RouteMatch, RouteParam, Routes } from './types';

export type RouteChangeCallback = (location: Location, action: Action) => void;

export default class Router {
  routes: Routes;
  history: BrowserHistory;
  routeKeys: string[];

  constructor(routes: Routes, onRouteChange: RouteChangeCallback) {
    // set routes
    this.routes = routes;
    // generate regexes for the routes
    this.createRegexes(routes);
    // create history
    this.history = createBrowserHistory();
    // listen for changes
    this.history.listen(({ location, action }) => {
      onRouteChange(location, action);
    });
    // init
    this.routeKeys = Object.keys(routes);
  }

  getCurrentLocation(): Location {
    return this.history.location;
  }

  getMatchingRoute(search: string): RouteMatch {
    let match: Routes[string] | null = null;
    let param: RouteParam | undefined;

    this.routeKeys.forEach((key) => {
      const obj = this.routes[key];
      if (obj.regEx) {
        const re = obj.regEx;
        const isMatching = re.test(search);

        if (isMatching) {
          if (obj.keys) {
            const value = re.exec(search)?.[1] ?? '';
            const name = obj.keys.name;
            param = {
              [name]: value,
            };
          }
          match = obj;
        }
      }
    });

    if (!match) {
      match = this.routes[404];
      if (!match) {
        console.warn('No 404 route specified');
      }
      return { match };
    }

    return { match, param };
  }

  createRegexes(routes: Routes): void {
    Object.keys(routes).forEach((route) => {
      const obj = routes[route];
      const keys: Key[] = [];
      obj.regEx = obj.path ? pathToRegexp(obj.path, keys) : null;
      if (keys.length) {
        obj.keys = keys[0];
      }
    });
  }

  navigate(path: string, state?: unknown): void {
    this.history.push(path, state);
  }
}
