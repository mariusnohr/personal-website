import gsap from 'gsap';
import { TEMPLATE } from '../config/constants';

import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
hljs.registerLanguage('javascript', javascript);
import 'highlight.js/styles/github.css';

export default class ProjectPage {
  constructor(project, target) {
    console.log('new item', project, target);

    const { template } = project;
    this.target = target;

    switch (template) {
      case TEMPLATE.IFRAME:
        console.log('we have an iframe');
        this.createIframeTemplate(project, target);
        break;

      case TEMPLATE.NOTE:
        console.log('we have a note');
        this.createNoteTemplate(project, target);

      default:
        break;
    }
  }

  createNoteTemplate(project, target) {
    const { title, content } = project;
    const onAnimComplete = () => {
      const container = document.createElement('div');
      const contentContainer = document.createElement('div');
      const h1 = document.createElement('h1');

      h1.textContent = title;
      container.classList.add('content');
      container.appendChild(h1);
      container.appendChild(contentContainer);

      // add content
      contentContainer.innerHTML = content;
      this.el.appendChild(container);

      // setTimeout(() => {
      //   hljs.initHighlightingOnLoad();
      // }, 1000);
      // console.log('yo');

      document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightBlock(block);
      });

      gsap.from(container, { duration: 0.7, y: 15, opacity: 0 });
    };

    this.el = document.createElement('div');
    this.el.classList.add('project-note');
    target.appendChild(this.el);

    gsap.from(this.el, {
      duration: 0.6,
      scale: 0.5,
      ease: 'power4.inOut',
      onComplete: onAnimComplete,
    });

    gsap.from(this.el, { duration: 0.3, opacity: 0 });
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
        gsap.from(iframe, { duration: 1, opacity: 0 });
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
