import { TEMPLATE } from '../config/constants';
import noteIcon from '../icons/memo';
import type { Project } from '../data/sitedata';

interface GridItemOptions {
  project: Project;
  onCreated: (el: HTMLAnchorElement) => void;
  onLoaded: (el: HTMLAnchorElement) => void;
}

export default class GridItem {
  constructor({ project, onCreated, onLoaded }: GridItemOptions) {
    const onClick = (evt: MouseEvent) => {
      evt.preventDefault();
    };

    onCreated(this.createItem(project, onClick, onLoaded));
  }

  createItem(
    obj: Project,
    onClick: (evt: MouseEvent) => void,
    onComplete: (el: HTMLAnchorElement) => void,
  ): HTMLAnchorElement {
    const { tags, id, title } = obj;
    const container = document.createElement('a');
    const classes = tags.map((tag) => tag.toLowerCase());
    container.classList.add('item', ...classes);
    container.setAttribute('href', `/project/${id}`);
    container.setAttribute('data-route', '');

    const contentContainer = document.createElement('div');
    contentContainer.classList.add('content-container');
    container.appendChild(contentContainer);

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

    // load image
    if (obj.template === TEMPLATE.IFRAME) {
      const img = new Image();
      img.onload = () => {
        onComplete(container);
      };
      img.src = obj.image;

      contentContainer.appendChild(img);
      // manually override click listener since
      // the element is added after the image has loaded
      // thus the router doesn't detect it immediately
      container.addEventListener('click', (evt) => {
        onClick(evt);
      });
    } else {
      onComplete(container);
    }

    return container;
  }
}
