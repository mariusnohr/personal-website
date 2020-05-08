import { createBrowserHistory } from 'history';
import { pathToRegexp } from 'path-to-regexp';

export default class Router {
  constructor(routes, onRouteChange) {
    // set routes
    this.routes = routes;
    // generate regexes for the routes
    this.getRegexes = this.createRegexes(routes);
    // create history
    this.history = createBrowserHistory();
    // listen for changes
    this.history.listen((location, action) => {
      onRouteChange(location, action);
    });
    // init
    this.routeKeys = Object.keys(routes);
  }

  getCurrentLocation() {
    return this.history.location;
  }

  getMatchingRoute(search) {
    let match = null;
    let param = null;

    this.routeKeys.forEach((key) => {
      const obj = this.routes[key];
      if (obj.regEx) {
        const re = obj.regEx;
        const isMatching = re.test(search);

        if (isMatching) {
          if (obj.keys) {
            const value = re.exec(search)[1];
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

  createRegexes(routes) {
    Object.keys(routes).forEach((route) => {
      const obj = routes[route];
      const keys = [];
      obj.regEx = obj.path ? pathToRegexp(obj.path, keys) : null;
      if (keys.length) {
        obj.keys = keys[0];
      }
    });
    return routes;
  }

  navigate(path, state) {
    this.history.push(path, state);
  }
}
