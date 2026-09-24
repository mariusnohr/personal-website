import gsap from 'gsap';

import View from '../framework/View';
import { animateStagger } from '../utils/utils';

export default class AboutView extends View {
  children: HTMLCollection;

  constructor(options: { el: HTMLElement }) {
    super(options);
    this.children = (this.el.querySelector('.content') as HTMLElement).children;

    const interactiveButtons = [
      this.el.querySelector('#interactivity'),
      this.el.querySelector('#physics'),
    ].filter((btn): btn is HTMLElement => btn instanceof HTMLElement);

    interactiveButtons.forEach((btn) => {
      btn.addEventListener('click', (evt) => {
        evt.preventDefault();
        this.makeInteractiveButton(evt.currentTarget as HTMLElement);
      });
    });
  }

  makeInteractiveButton(el: HTMLElement): void {
    const accThreshold = 0.02;
    const accThresholdLimit = 10;
    const origin = el.getAttribute('data-origin');

    let angVel = 0;
    let angAcc = 0;
    let currentAngle = 0;
    const damping = 0.976;
    let falling = false;
    let accThresholdCount = 0;
    const gravity = 0.02;
    let vel = 0;
    let acc = 0;
    let y = 0;
    let animID = 0;
    const margin = 200;

    // get current button page offset
    const offsetTop = el.getBoundingClientRect().top;
    const bounds = window.innerHeight - offsetTop;

    const animate = () => {
      animID = requestAnimationFrame(animate);

      if (!falling) {
        if (origin === 'right') {
          angAcc = (90 + currentAngle) * 0.01;
          angVel -= angAcc;
        } else {
          angAcc = (90 - currentAngle) * 0.01;
          angVel += angAcc;
        }

        currentAngle += angVel;
        angVel *= damping;

        if (Math.abs(angAcc) < accThreshold) {
          accThresholdCount++;
          if (accThresholdCount > accThresholdLimit) {
            falling = true;
          }
        }
      } else {
        currentAngle += angVel;
        acc += gravity;
        vel += acc;
        y += vel;
      }

      if (y > bounds + margin) {
        y = -offsetTop - margin;
        cancelAnimationFrame(animID);
        gsap.to(el, {
          duration: 2.7,
          x: 0,
          y: 0,
          rotation: 0,
          clearProps: 'all',
          ease: 'bounce.out',
        });
      }

      el.style.transform = `translate(0, ${y}px) rotate(${currentAngle}deg)`;
    };

    animate();
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
