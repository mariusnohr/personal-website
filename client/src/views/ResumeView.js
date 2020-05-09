import gsap from 'gsap';
import View from '../framework/View';
import { animateStagger, randomInt } from '../utils/utils';

const EMAIL = ['marius', 'nohr', '@', 'gmail', '.com'].join('');
const PHONE = ['+47', '932', '44', '394'].join('');

export default class ResumeView extends View {
  constructor(options) {
    super(options);
    this.children = this.el.querySelector('.content').children;
    this.phoneEl = this.el.querySelector('#phone');
    this.emailEl = this.el.querySelector('#email');

    const onLinkClick = (evt, type, label) => {
      const el = evt.target;
      if (el.textContent !== label) {
        evt.preventDefault();
        this.showAlert(type, el.getAttribute('data-str'));
      }
    };

    this.phoneEl.addEventListener('click', (evt) => {
      onLinkClick(evt, 'phoneEl', PHONE);
    });
    this.emailEl.addEventListener('click', (evt) => {
      onLinkClick(evt, 'emailEl', EMAIL);
    });
  }

  showAlert(type, label) {
    const num1 = randomInt(2, 10);
    const num2 = randomInt(2, 10);
    const sum = num1 + num2;

    const str = `
      I just wanted to make sure that you are a human.
      The million dollar question. What is ${num1} + ${num2}?
      If you answer correct, you will unlock my ${label}.
    `;

    let answer = window.prompt(str);

    if (answer) {
      answer = parseInt(answer.trim(), 10);

      if (answer === sum) {
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

  show() {
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

  hide() {
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
