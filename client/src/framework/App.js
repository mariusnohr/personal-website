import Router from './Router';
import DisplayManager from './DisplayManager';

const noop = () => {};

export let router;

export default class App {
  constructor(options) {
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

  onRender = (updateRefs = true) => {
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
      this.rootElement.classList.add(match.className);
    }
  };

  onRouteChange = (location, action) => {
    let match = router.getMatchingRoute(location.pathname);
    this.displayManager.show(match);
    this.onChangeCallback(location, action, match);
  };

  createLink(el) {
    const href = el.getAttribute('href');
    el.addEventListener('click', (evt) => {
      evt.preventDefault();
      router.navigate(href);
    });
  }

  createRootElement() {
    let el = document.createElement('div');
    document.appendChild(el);
    return el;
  }
}
