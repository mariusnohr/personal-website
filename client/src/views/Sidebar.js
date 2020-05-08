import gsap from 'gsap';

const NAV_IN_DELAY = 0.5;

class Sidebar {
  constructor() {
    this.el = document.querySelector('aside');
    this.nav = this.el.querySelector('nav');
    this.navButtons = this.nav.querySelectorAll('a');
    this.filterButtons = this.nav.querySelectorAll('.filter-menu a');
    this.sidebarEl = null;

    this.animateNav();
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

  showSidebar(title, description, date) {
    this.nav.classList.add('hide');
    this.sidebarEl = document.createElement('div');

    const h3 = document.createElement('h3');
    const p = document.createElement('p');
    const dateEl = document.createElement('p');

    dateEl.classList.add('publish-date');
    h3.textContent = title;
    p.textContent = description;
    dateEl.textContent = date;

    this.sidebarEl.classList.add('sidebar');
    this.sidebarEl.appendChild(h3);
    this.sidebarEl.appendChild(p);
    this.sidebarEl.appendChild(dateEl);

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
