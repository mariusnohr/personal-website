import gsap from 'gsap';
import { marked } from 'marked';

import { TEMPLATE } from '../config/constants';
import type { IframeProject, NoteProject, Project } from '../data/sitedata';

import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import 'highlight.js/styles/hybrid.css';

hljs.registerLanguage('javascript', javascript);

export default class ProjectPage {
  target: HTMLElement;
  el!: HTMLElement;

  constructor(project: Project, target: HTMLElement) {
    this.target = target;

    switch (project.template) {
      case TEMPLATE.IFRAME:
        this.createIframeTemplate(project, target);
        break;

      case TEMPLATE.NOTE:
        this.createNoteTemplate(project, target);
        break;

      default:
        break;
    }
  }

  createNoteTemplate(project: NoteProject, target: HTMLElement): void {
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
      contentContainer.innerHTML = marked.parse(content) as string;
      this.el.appendChild(container);

      document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
      });

      gsap.from(container, { duration: 0.7, y: 15, opacity: 0 });
      window.scrollTo(0, 0);

      const iframes = contentContainer.querySelectorAll('iframe');
      iframes.forEach((iframe) => {
        const src = iframe.getAttribute('data-src');
        if (src) iframe.setAttribute('src', src);
      });
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
  }

  createIframeTemplate(project: IframeProject, target: HTMLElement): void {
    const iframe = document.createElement('iframe');
    // Point at the explicit entry file. Vite serves publicDir by exact path
    // in dev (unlike the production static server), so a bare directory URL
    // would fall back to the app shell instead of the experiment.
    iframe.src = `${project.data.src}/index.html`;

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
        iframe.contentWindow?.focus();
        gsap.from(iframe, { duration: 1, opacity: 0 });
      },
    });

    gsap.from(this.el, { duration: 0.45, opacity: 0 });
  }

  onIframeResize = (): void => {
    // measure target width
    const measure = this.target.getBoundingClientRect();
    this.el.style.width = `${measure.width}px`;
    this.el.style.height = `${window.innerHeight}px`;
  };

  destroy(): void {
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
        this.el.remove();
      },
    });
  }
}
