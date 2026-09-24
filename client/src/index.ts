import App from './framework/App';

// views
import HomeView from './views/HomeView';
import ResumeView from './views/ResumeView';
import AboutView from './views/AboutView';
import Sidebar from './views/Sidebar';

// styles
import '../styles/index.scss';

// templates
import mainTemplate from '../templates/main.html?raw';
import resumeTemplate from '../templates/resume.html?raw';
import aboutTemplate from '../templates/about.html?raw';
import notFoundTemplate from '../templates/404.html?raw';

// webgl
import * as webgl from './webgl/main';
import * as logo from './webgl/logo';

function init(): void {
  // init webgl
  webgl.init();

  const resize = (anim = false): void => {
    // get sidebar width
    const measures = (
      document.querySelector('aside') as HTMLElement
    ).getBoundingClientRect();

    // position logo
    logo.positionLogo(measures, anim);
  };

  resize(true);

  window.addEventListener('resize', () => resize());

  if (window.innerWidth <= 540) {
    document.querySelector('.menu-btn')?.addEventListener('click', () => {
      Sidebar.toggleMobileNav();
    });
  }

  new App({
    root: document.querySelector('#app') as HTMLElement,
    routes: {
      index: {
        className: 'home-page',
        path: '/',
        template: mainTemplate,
        component: HomeView,
      },
      tag: {
        className: 'tag-page',
        path: '/tag/:tag',
        template: mainTemplate,
        component: HomeView,
      },
      project: {
        className: 'project-page',
        path: '/project/:projectId',
        template: mainTemplate,
        component: HomeView,
      },
      resume: {
        className: 'resume-page',
        path: '/resume',
        template: resumeTemplate,
        component: ResumeView,
      },
      about: {
        className: 'about-page',
        path: '/about',
        template: aboutTemplate,
        component: AboutView,
      },
      404: {
        template: notFoundTemplate,
        className: 'page-404',
      },
    },
    addRootClass: true,
    onChange: (loc) => {
      Sidebar.setActiveButton(loc.pathname);
    },
  });

  // set active button if any
  Sidebar.setActiveButton(document.location.pathname);
}

function ready(callback: () => void): void {
  const state = document.readyState;

  if (state === 'complete' || state === 'interactive') {
    setTimeout(callback, 0);
    return;
  }

  document.addEventListener('DOMContentLoaded', function onLoad() {
    callback();
  });
}

ready(init);

if (import.meta.hot) {
  import.meta.hot.accept();
}
