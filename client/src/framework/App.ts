import type { Action, Location } from 'history';

import Router from './Router';
import DisplayManager from './DisplayManager';
import type { RouteMatch, Routes } from './types';

const noop = (): void => {};

export let router: Router;

interface AppOptions {
  root?: HTMLElement;
  routes: Routes;
  addRootClass?: boolean;
  onChange?: (location: Location, action: Action, match: RouteMatch) => void;
}

export default class App {
  rootElement: HTMLElement;
  onChangeCallback: (
    location: Location,
    action: Action,
    match: RouteMatch,
  ) => void;
  addRootClass: boolean;
  displayManager: DisplayManager;

  constructor(options: AppOptions) {
    this.rootElement = options.root || this.createRootElement();
    this.onChangeCallback = options.onChange || noop;
    this.addRootClass = options.addRootClass || false;

    router = new Router(options.routes, this.onRouteChange);

    // show initial view
    const currentLocation = router.getCurrentLocation();
    const currentItem = router.getMatchingRoute(currentLocation.pathname);

    this.displayManager = new DisplayManager({
      rootNode: this.rootElement,
      onRender: this.onRender,
    });

    // scan document for global links
    const linkElements = document.querySelectorAll('a[data-route]');
    linkElements.forEach((el) => {
      this.createLink(el);
    });

    // init display manager
    this.displayManager.show(currentItem);
  }

  onRender = (updateRefs = true): void => {
    const currentLocation = router.getCurrentLocation();
    const currentItem = router.getMatchingRoute(currentLocation.pathname);

    if (updateRefs) {
      const linkElements = this.rootElement.querySelectorAll('a[data-route]');
      linkElements.forEach((el) => {
        this.createLink(el);
      });
    }

    if (this.addRootClass) {
      const { match } = currentItem;
      this.rootElement.className = '';
      if (match.className) this.rootElement.classList.add(match.className);
    }
  };

  onRouteChange = (location: Location, action: Action): void => {
    const match = router.getMatchingRoute(location.pathname);
    this.displayManager.show(match);
    this.onChangeCallback(location, action, match);
  };

  createLink(el: Element): void {
    const href = el.getAttribute('href');
    el.addEventListener('click', (evt) => {
      evt.preventDefault();
      if (href) router.navigate(href);
    });
  }

  createRootElement(): HTMLElement {
    const el = document.createElement('div');
    document.body.appendChild(el);
    return el;
  }
}
