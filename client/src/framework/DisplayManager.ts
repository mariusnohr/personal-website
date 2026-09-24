import View from './View';
import { subscribe } from './dispatcher';
import type { RouteConfig, RouteMatch } from './types';

type RenderCallback = (updateRefs?: boolean) => void;

export default class DisplayManager {
  current: RouteMatch | null = null;
  next: RouteMatch | null = null;
  working = false;
  currentNode: ChildNode | null = null;
  view: View | null = null;
  prevMatch: RouteConfig | null = null;

  onRender: RenderCallback;
  rootNode: HTMLElement;

  constructor({
    rootNode,
    onRender,
  }: {
    rootNode: HTMLElement;
    onRender: RenderCallback;
  }) {
    this.onRender = onRender;
    this.rootNode = rootNode;
  }

  renderView(item: RouteConfig): void {
    this.rootNode.innerHTML = item.template;
    this.currentNode = this.rootNode.firstChild;
  }

  show(obj?: RouteMatch | null): void {
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
        const ViewComponent = item.component || View;
        // render template
        this.renderView(item);
        // create view
        this.view = new ViewComponent({ el: this.currentNode as HTMLElement });
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
          (this.view && this.view.constructor === item.component)
        ) {
          this.view?.paramChange(param);
          this.onRender(false);
        } else {
          // hide current, set next
          this.next = obj;
          // add hide callback
          subscribe('hideComplete', this.onHideComplete);
          // hide view
          this.view?.hide();
        }
      }
    }
  }

  onShowComplete = (): void => {
    this.working = false;
  };

  onHideComplete = (): void => {
    // set working to false
    this.working = false;
    // destroy current view
    this.view?.destroy();
    // null out current view
    this.view = null;
    this.current = null;
    // show next
    this.show(this.next);
  };
}
