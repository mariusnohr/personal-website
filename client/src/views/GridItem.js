import { router } from '../framework/App';

export default class GridItem {
  constructor({ project, target, isotope }) {
    const onImageLoaded = (el) => {
      isotope.insert(el);
    };
    const onClick = (evt, el) => {
      evt.preventDefault();
      const href = el.getAttribute('href');
      router.navigate(href);
    };
    const el = this.createItem(project, target, onClick, onImageLoaded);

    // observer.observe(el);
  }

  createItem(obj, target, onClick, onImgLoaded) {
    const { tags, id, image } = obj;
    const container = document.createElement('a');
    const classes = tags.map((tag) => tag.toLowerCase());
    container.classList.add('item', 'hidden', ...classes);
    container.setAttribute('href', `/project/${id}`);
    container.setAttribute('data-route', '');

    // load image
    const img = new Image();
    img.onload = () => {
      onImgLoaded(container);
    };
    img.src = image;
    container.appendChild(img);
    container.addEventListener('click', (evt) => {
      onClick(evt, container);
    });

    return container;
  }
}
