import gsap from 'gsap';
import View from '../framework/View';
import { animateStagger } from '../utils/utils';

export default class AboutView extends View {
  constructor(options) {
    super(options);
    this.children = this.el.querySelector('.content').children;
  }

  show() {
    animateStagger(this.children, {
      method: 'from',
      delayBetween: 0.1,
      complete: this.showComplete,
      props: {
        duration: 0.6,
        opacity: 0,
        y: 15,
        ease: 'power2.out',
      },
    });
  }

  hide() {
    animateStagger(this.children, {
      method: 'to',
      delayBetween: 0.08,
      complete: this.hideComplete,
      props: {
        duration: 0.4,
        opacity: 0,
      },
    });
  }
}
