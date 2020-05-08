import gsap from 'gsap';
import { TEMPLATE } from '../config/constants';

export default class ProjectPage {
  constructor(project, target) {
    console.log('new item', project, target);

    this.target = target;

    const { template } = project;

    switch (template) {
      case TEMPLATE.IFRAME:
        console.log('we have an iframe');
        this.createIframeTemplate(project, target);
        break;

      default:
        break;
    }
  }

  createIframeTemplate(project, target) {
    const iframe = document.createElement('iframe');
    iframe.src = `${project.data.src}/`;

    this.el = document.createElement('div');
    this.el.classList.add('project-iframe');
    this.el.style.background = project.background;
    this.onIframeResize();

    target.appendChild(this.el);
    window.addEventListener('resize', this.onIframeResize);

    gsap.from(this.el, {
      duration: 0.6,
      scale: 0.5,
      ease: 'power4.inOut',
      onComplete: () => {
        this.el.appendChild(iframe);
        iframe.contentWindow.focus();
      },
    });

    gsap.from(this.el, { duration: 0.3, opacity: 0 });
  }

  onIframeResize = () => {
    // measure target width
    const measure = this.target.getBoundingClientRect();
    this.el.style.width = `${measure.width}px`;
    this.el.style.height = `${window.innerHeight}px`;
  };

  destroy() {
    window.removeEventListener('resize', this.onIframeResize);

    gsap.to(this.el, {
      duration: 0.6,
      scale: 0.5,
      ease: 'power4.inOut',
    });

    gsap.to(this.el, {
      duration: 0.3,
      opacity: 0,
      delay: 0.3,
      onComplete: () => {
        this.target.removeChild(this.el);
        this.el = null;
        this.target = null;
      },
    });
  }
}
