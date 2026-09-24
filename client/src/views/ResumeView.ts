import View from '../framework/View';
import { animateStagger } from '../utils/utils';
import { randomInt } from '../utils/math';

const EMAIL = ['marius', 'nohr', '@', 'gmail', '.com'].join('');
const PHONE = ['+47', '932', '44', '394'].join('');

type ContactField = 'phoneEl' | 'emailEl';

export default class ResumeView extends View {
  children: HTMLCollection;
  phoneEl: HTMLAnchorElement;
  emailEl: HTMLAnchorElement;

  constructor(options: { el: HTMLElement }) {
    super(options);
    this.children = (this.el.querySelector('.content') as HTMLElement).children;
    this.phoneEl = this.el.querySelector('#phone') as HTMLAnchorElement;
    this.emailEl = this.el.querySelector('#email') as HTMLAnchorElement;

    const onLinkClick = (
      evt: MouseEvent,
      type: ContactField,
      label: string,
    ) => {
      const el = evt.currentTarget as HTMLAnchorElement;
      if (el.textContent !== label) {
        evt.preventDefault();
        this.showAlert(type, el.getAttribute('data-str') ?? '');
      }
    };

    this.phoneEl.addEventListener('click', (evt) => {
      onLinkClick(evt, 'phoneEl', PHONE);
    });
    this.emailEl.addEventListener('click', (evt) => {
      onLinkClick(evt, 'emailEl', EMAIL);
    });
  }

  showAlert(type: ContactField, label: string): void {
    const num1 = randomInt(2, 10);
    const num2 = randomInt(2, 10);
    const sum = num1 + num2;

    const str = `
      I just wanted to make sure that you are a human.
      The million dollar question. What is ${num1} + ${num2}?
      If you answer correct, you will unlock my ${label}.
    `;

    const answer = window.prompt(str);

    if (answer) {
      const parsed = parseInt(answer.trim(), 10);

      if (parsed === sum) {
        const text = type === 'phoneEl' ? PHONE : EMAIL;
        const href = type === 'phoneEl' ? `tel:${PHONE}` : `mailto:${EMAIL}`;
        this[type].textContent = text;
        this[type].setAttribute('href', href);
        window.alert('Superb. You made it!');
      } else {
        window.alert('Sorry, that was wrong. Try again.');
      }
    }
  }

  override show(): void {
    animateStagger(this.children, {
      method: 'from',
      delayBetween: 0.1,
      complete: this.showComplete,
      props: {
        duration: 0.6,
        opacity: 0,
        y: 15,
        ease: 'power2.out',
      },
    });
  }

  override hide(): void {
    animateStagger(this.children, {
      method: 'to',
      delayBetween: 0.08,
      complete: this.hideComplete,
      props: {
        duration: 0.4,
        opacity: 0,
      },
    });
  }
}
