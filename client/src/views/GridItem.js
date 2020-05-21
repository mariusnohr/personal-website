import { router } from '../framework/App';
import { TEMPLATE } from '../config/constants';
import noteIcon from '../icons/memo.js';

export default class GridItem {
  constructor({ project, target, isotope }) {
    const onComplete = (el) => {
      isotope.insert(el);
    };
    const onClick = (evt, el) => {
      evt.preventDefault();
      const href = el.getAttribute('href');
      router.navigate(href);
    };
    const el = this.createItem(project, target, onClick, onComplete);

    // observer.observe(el);
  }

  createItem(obj, target, onClick, onComplete) {
    const { tags, id, image, title } = obj;
    const container = document.createElement('a');
    const classes = tags.map((tag) => tag.toLowerCase());
    container.classList.add('item', ...classes);
    container.setAttribute('href', `/project/${id}`);
    container.setAttribute('data-route', '');

    const contentContainer = document.createElement('div');
    contentContainer.classList.add('content-container');
    container.appendChild(contentContainer);

    // load image
    if (image) {
      const img = new Image();
      img.onload = () => {
        onComplete(container);
      };
      img.src = image;

      contentContainer.appendChild(img);
      // manually override click listener since
      // the element is added after the image has loaded
      // thus the router doesn't detect it immediately
      container.addEventListener('click', (evt) => {
        onClick(evt, container);
      });
    } else {
      onComplete(container);
    }

    // add bg to note
    if (obj.template === TEMPLATE.NOTE) {
      const { background, theme } = obj.thumbnail;
      const iconContainer = document.createElement('div');
      iconContainer.classList.add('icon');
      container.style.background = background;
      iconContainer.innerHTML = noteIcon;
      iconContainer.classList.add(...theme.split(' '));
      contentContainer.appendChild(iconContainer);
    }

    // add tags and title
    const titleContainer = document.createElement('div');
    const h4 = document.createElement('h4');
    h4.textContent = title;
    titleContainer.classList.add('title');
    titleContainer.appendChild(h4);
    container.appendChild(titleContainer);

    tags.forEach((tag) => {
      const span = document.createElement('span');
      span.classList.add('tag');
      span.textContent = tag;
      titleContainer.appendChild(span);
    });

    return container;
  }
}
