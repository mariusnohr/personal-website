import App from './framework/App';

// views
import HomeView from './views/HomeView';
import ResumeView from './views/ResumeView';
import AboutView from './views/AboutView';
import Sidebar from './views/Sidebar';

// templates
import indexTemplate from '../templates/index.html';
import resumeTemplate from '../templates/resume.html';
import aboutTemplate from '../templates/about.html';
import notFoundTemplate from '../templates/404.html';

// projects
import { projects } from './data/sitedata';

// webgl
import * as webgl from './webgl/main';
import * as logo from './webgl/logo';

function init() {
  // init webgl
  webgl.init();

  const resize = (evt, anim = false) => {
    // get sidebar width
    const measures = document.querySelector('aside').getBoundingClientRect();

    // position logo
    logo.positionLogo(measures, anim);
  };

  resize(null, true);

  window.addEventListener('resize', resize);

  new App({
    root: document.querySelector('#app'),
    routes: {
      index: {
        className: 'home-page',
        path: '/',
        template: indexTemplate,
        component: HomeView,
      },
      tag: {
        className: 'tag-page',
        path: '/tag/:tag',
        template: indexTemplate,
        component: HomeView,
      },
      project: {
        className: 'project-page',
        path: '/project/:projectId',
        template: indexTemplate,
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
    onChange: (loc, action, match) => {
      Sidebar.setActiveButton(loc.pathname);
    },
  });

  // set active button if any
  Sidebar.setActiveButton(document.location.pathname);
}

function ready(callback) {
  const state = document.readyState;

  if (state === 'complete' || state === 'interactive') {
    return setTimeout(callback, 0);
  }

  document.addEventListener('DOMContentLoaded', function onLoad() {
    callback();
  });
}

ready(init);

if (module.hot) {
  module.hot.accept();
}
