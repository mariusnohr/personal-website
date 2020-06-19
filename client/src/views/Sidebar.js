import gsap from 'gsap';
import { TEMPLATE } from '../config/constants';
import backIcon from '../icons/back';
import clockIcon from '../icons/clock';
import { router } from '../framework/App';
import * as webgl from '../webgl/main';

const NAV_IN_DELAY = 0.5;

class Sidebar {
  constructor() {
    this.el = document.querySelector('aside');
    this.nav = this.el.querySelector('nav');
    this.navButtons = this.nav.querySelectorAll('a');
    this.filterButtons = this.nav.querySelectorAll('.filter-menu a');
    this.logo = this.el.querySelector('.logo');

    this.logo.addEventListener('mouseover', () => {
      webgl.logoHover(true);
    });

    this.logo.addEventListener('mouseout', () => {
      webgl.logoHover(false);
    });

    this.sidebarEl = null;
    this.animateNav();

    this.el.classList.add('show');
  }

  animateNav() {
    const lis = this.nav.querySelectorAll('li');
    lis.forEach((el, index) => {
      const delay = NAV_IN_DELAY + 0.1 * index;
      gsap.from(el, {
        duration: 0.6,
        alpha: 0,
        x: -15,
        delay,
        ease: 'power4.out',
      });
    });
  }

  showSidebar(project) {
    const { title, description, published_at, template } = project;

    this.nav.classList.add('hide');
    this.sidebarEl = document.createElement('div');
    this.sidebarEl.classList.add('sidebar');

    if (template === TEMPLATE.NOTE) {
      const { content } = project;
      const len = content.split(' ').length;
      const readingTime = Math.ceil(len / 200);
      const clockEl = document.createElement('div');
      const label = document.createElement('span');
      clockEl.innerHTML = clockIcon;
      clockEl.appendChild(label);
      clockEl.classList.add('time');
      label.textContent = `${readingTime} minute read`;
      this.sidebarEl.appendChild(clockEl);
    } else {
      const h3 = document.createElement('h3');
      const p = document.createElement('p');

      h3.textContent = title;
      p.textContent = description;

      this.sidebarEl.appendChild(h3);
      this.sidebarEl.appendChild(p);
    }

    // date
    const dateEl = document.createElement('p');
    dateEl.classList.add('publish-date');
    dateEl.textContent = published_at;
    this.sidebarEl.appendChild(dateEl);

    // back button
    const backBtn = document.createElement('button');
    backBtn.innerHTML = backIcon;
    backBtn.classList.add('back-btn');
    this.sidebarEl.appendChild(backBtn);
    backBtn.addEventListener('click', () => {
      router.navigate('/');
    });

    this.el.appendChild(this.sidebarEl);

    setTimeout(() => {
      this.sidebarEl.classList.add('show');
    }, 150);
  }

  showNav() {
    // remove sidebar if visible
    let delay = 0;
    if (this.sidebarEl) {
      delay = 150;
      this.sidebarEl.classList.remove('show');
    }

    setTimeout(() => {
      this.nav.classList.remove('hide');
      if (this.sidebarEl) {
        this.el.removeChild(this.sidebarEl);
      }
    }, delay);
  }

  setActiveButton(pathname) {
    // get last segment of pathname
    const id = pathname.substring(pathname.lastIndexOf('/') + 1);

    this.navButtons.forEach((el) => {
      if (el.getAttribute('data-id') === id) el.classList.add('active');
      else el.classList.remove('active');
    });

    if (id === 'about' || id === 'resume') this.setActiveFilter(null);
  }

  setActiveFilter(id) {
    this.filterButtons.forEach((el) => {
      if (id) {
        if (el.getAttribute('data-id') === id) {
          el.classList.add('active');
        } else {
          el.classList.add('inactive');
        }
      } else {
        el.classList.remove('active', 'inactive');
      }
    });
  }
}

const sidebar = new Sidebar();
export default sidebar;
