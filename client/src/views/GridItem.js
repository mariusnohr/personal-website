import { router } from '../framework/App';
import { TEMPLATE } from '../config/constants';

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
    const { tags, id, image } = obj;
    const container = document.createElement('a');
    const classes = tags.map((tag) => tag.toLowerCase());
    container.classList.add('item', ...classes);
    container.setAttribute('href', `/project/${id}`);
    container.setAttribute('data-route', '');

    // load image
    if (image) {
      const img = new Image();
      img.onload = () => {
        onComplete(container);
      };
      img.src = image;
      container.appendChild(img);
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
      const { background } = obj.thumbnail;
      container.style.background = background;
    }

    return container;
  }
}
