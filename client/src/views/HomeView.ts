import gsap from 'gsap';
import Isotope from 'isotope-layout';

import View from '../framework/View';
import Sidebar from './Sidebar';
import { projects } from '../data/sitedata';
import ProjectPage from './ProjectPage';
import GridItem from './GridItem';

import * as webgl from '../webgl/main';
import type { RouteParam } from '../framework/types';

/**
 * Isotope exposes the active options object on the instance at runtime,
 * which is how the transition duration gets updated once all items loaded.
 * The shipped types don't declare it, so we add it here.
 */
type IsotopeWithOptions = Isotope & {
  options: { transitionDuration?: number | string };
};

export default class HomeView extends View {
  msnryContainer: HTMLElement;
  iso: IsotopeWithOptions;
  projectPage: ProjectPage | null = null;

  constructor(options: { el: HTMLElement }) {
    super(options);

    this.msnryContainer = this.el.querySelector(
      '.masonry-container',
    ) as HTMLElement;

    const isotopeOptions = {
      // options
      percentPosition: true,
      itemSelector: '.item',
      columnWidth: '.grid-sizer',
      stagger: 50,
      transitionDuration: 0,
    };

    this.iso = new Isotope(
      this.msnryContainer,
      isotopeOptions,
    ) as IsotopeWithOptions;

    this.createGridItems(this.iso);
  }

  createGridItems(isotope: IsotopeWithOptions): void {
    let numLoaded = 0;
    const tweens: gsap.core.Tween[] = [];

    projects.forEach((project, index) => {
      new GridItem({
        project,
        // element is created
        onCreated: (el) => {
          isotope.insert(el);
          // get tween ready
          tweens.push(
            gsap.from(el, {
              duration: 0.9,
              scale: 0.5,
              opacity: 0,
              delay: 0.1 + index * 0.07,
              ease: 'expo.out',
              paused: true,
            }),
          );
        },
        // element is loaded
        onLoaded: () => {
          numLoaded++;
          if (numLoaded >= projects.length) {
            isotope.layout();
            tweens.forEach((tween) => tween.play());
            isotope.options.transitionDuration = '0.45s';
          }
        },
      });
    });
  }

  override paramChange(param?: RouteParam): void {
    const projectId = param?.projectId;
    const tag = param?.tag;

    if (this.projectPage) {
      this.projectPage.destroy();
      this.projectPage = null;
      webgl.closeProject();
      if (!projectId) Sidebar.showNav();
    }

    if (projectId) {
      const project = projects.find((item) => item.id === projectId);
      if (project) {
        this.projectPage = new ProjectPage(project, this.el);
        Sidebar.showSidebar(project);
        webgl.openProject();
      }

      gsap.to(this.msnryContainer, { duration: 0.45, opacity: 0 });
    } else {
      gsap.to(this.msnryContainer, { duration: 0.35, opacity: 1 });
    }

    if (tag) {
      this.iso.arrange({ filter: `.${tag}` });
      Sidebar.setActiveFilter(tag);
    }

    if (!param) {
      this.iso.arrange({ filter: '*' });
      Sidebar.setActiveFilter(null);
    }
  }

  override show(param?: RouteParam): void {
    this.paramChange(param);
    this.showComplete();
  }

  override hide(): void {
    gsap.to(this.el, {
      duration: 0.35,
      opacity: 0,
      onComplete: this.hideComplete,
    });
  }
}
