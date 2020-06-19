import gsap from 'gsap';
import Isotope from 'isotope-layout';

import View from '../framework/View';
import Sidebar from './Sidebar';
import { projects } from '../data/sitedata';
import ProjectPage from './ProjectPage';
import GridItem from './GridItem';

import * as webgl from '../webgl/main';

export default class HomeView extends View {
  constructor(options) {
    super(options);

    this.msnryContainer = this.el.querySelector('.masonry-container');

    // TODO: Maybe later
    // let onIntersect = (entries, observer) => {
    //   // console.log('intersecgted', evt);
    //   // // observer
    // };

    // let observer = new IntersectionObserver(onIntersect, {
    //   root: msnryContainer,
    //   rootMargin: '0px',
    //   threshold: 1.0,
    // });

    this.iso = new Isotope(this.msnryContainer, {
      // options
      percentPosition: true,
      itemSelector: '.item',
      columnWidth: '.grid-sizer',
      stagger: 50,
      transitionDuration: 0,
    });

    this.createGridItems(this.msnryContainer, this.iso);
  }

  createGridItems(target, isotope, observer) {
    let numLoaded = 0;
    let tweens = [];

    projects.forEach((project, index) => {
      new GridItem({
        project,
        target,
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
            })
          );
        },
        // element is loaded
        onLoaded: (el) => {
          numLoaded++;
          if (numLoaded >= projects.length) {
            isotope.layout();
            tweens.forEach((tween) => tween.play());
            this.iso.options.transitionDuration = '0.45s';
          }
        },
      });
    });
  }

  paramChange(param) {
    const projectId = param?.projectId;
    const tag = param?.tag;

    if (this.projectPage) {
      this.projectPage.destroy();
      this.projectPage = null;
      webgl.closeProject();
      if (!projectId) Sidebar.showNav();
    }

    if (projectId) {
      const project = projects.find((project) => project.id === projectId);
      this.projectPage = new ProjectPage(project, this.el);
      Sidebar.showSidebar(project);
      webgl.openProject();

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

  show(param) {
    this.paramChange(param);
    this.showComplete();
  }

  hide() {
    gsap.to(this.el, {
      duration: 0.35,
      opacity: 0,
      onComplete: this.hideComplete,
    });
  }
}
