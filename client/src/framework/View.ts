import { trigger } from './dispatcher';
import type { RouteParam } from './types';

export default class View {
  el: HTMLElement;

  constructor(options: { el: HTMLElement }) {
    this.el = options.el;
  }

  show(_param?: RouteParam): void {
    // do something before calling show complete
    this.showComplete();
  }

  hide(): void {
    // do something before calling hide complete
    this.hideComplete();
  }

  paramChange(_param?: RouteParam): void {}

  showComplete(): void {
    trigger('showComplete');
  }

  hideComplete(): void {
    trigger('hideComplete');
  }

  destroy(): void {
    this.el.remove();
  }
}
