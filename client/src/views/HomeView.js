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

    const msnryContainer = this.el.querySelector('.masonry-container');

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

    this.iso = new Isotope(msnryContainer, {
      // options
      percentPosition: true,
      itemSelector: '.item',
      columnWidth: '.grid-sizer',
      stagger: 50,
    });
    this.createGridItems(msnryContainer, this.iso);
  }

  createGridItems(target, isotope, observer) {
    projects.forEach((project) => {
      new GridItem({
        project,
        target,
        isotope,
      });
    });
  }

  paramChange(param) {
    const projectId = param?.projectId;
    const tag = param?.tag;

    console.log('PARAM CAHNGE', projectId);

    if (this.projectPage) {
      this.projectPage.destroy();
      this.projectPage = null;
      webgl.closeProject();
      if (!projectId) Sidebar.showNav();
    }

    if (projectId) {
      const project = projects.find((project) => project.id === projectId);
      const { title, description, published_at } = project;
      this.projectPage = new ProjectPage(project, this.el);
      Sidebar.showSidebar(title, description, published_at);
      webgl.openProject();
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

    gsap.from(this.el, { duration: 1, opacity: 0 });
  }

  hide() {
    gsap.to(this.el, {
      duration: 1,
      opacity: 0,
      onComplete: this.hideComplete,
    });
  }
}
