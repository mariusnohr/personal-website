import View from './View';
import { subscribe } from './dispatcher';

export default class DisplayManager {
  constructor({ rootNode, onRender }) {
    this.current = null;
    this.next = null;
    this.working = false;
    this.currentNode = null;
    this.view = null;
    this.prevMatch = null;

    this.onRender = onRender;
    this.rootNode = rootNode;
  }

  renderView(item) {
    this.rootNode.innerHTML = item.template;
    this.currentNode = this.rootNode.firstChild;
  }

  show(obj) {
    // no routing matches
    if (!obj) return;

    const item = obj.match;
    const param = obj.param;

    // if not working
    if (!this.working) {
      // if no current view, show this one
      if (!this.current) {
        // set current
        this.current = obj;
        // get view constructor
        let ViewComponent = item.component || View;
        // render template
        this.renderView(item);
        // create view
        this.view = new ViewComponent({ el: this.currentNode });
        this.onRender();
        // add view callback
        subscribe('showComplete', this.onShowComplete);
        // show view
        this.view.show(param);
      } else {
        // if there is a current, find out if we should
        // just update the current one if routing is the same
        if (
          item.path === this.current.match.path ||
          this.view.constructor === item.component
        ) {
          this.view.paramChange(param);
        } else {
          // hide current, set next
          this.next = obj;
          // add hide callback
          subscribe('hideComplete', this.onHideComplete);
          // hide view
          this.view.hide();
        }
      }
    }
  }

  onShowComplete = () => {
    this.working = false;
  };

  onHideComplete = () => {
    // set working to false
    this.working = false;
    // destroy current view
    this.view.destroy();
    // null out current view
    this.view = null;
    this.current = null;
    // show next
    this.show(this.next);
  };
}
