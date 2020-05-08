import { trigger } from './dispatcher';

export default class View {
  constructor(options) {
    this.el = options.el;
  }

  show() {
    // do something before calling show complete
    this.showComplete();
  }

  hide() {
    // do something before calling hide complete
    this.hideComplete();
  }

  paramChange() {}

  showComplete() {
    trigger('showComplete');
  }

  hideComplete() {
    trigger('hideComplete');
  }

  destroy() {
    let parent = this.el.parentNode;
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
    this.el = null;
  }
}
