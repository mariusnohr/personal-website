import gsap from 'gsap';

type EaseMethod = 'from' | 'to';

export interface StaggerOptions {
  method: EaseMethod;
  props: gsap.TweenVars;
  complete: () => void;
  delayBetween: number;
}

export function animateStagger(
  children: ArrayLike<Element>,
  options: StaggerOptions,
): void {
  const { method, props, complete, delayBetween } = options;

  let index = 0;
  let count = 0;

  for (const child of Array.from(children)) {
    const delay = index++ * delayBetween;
    const vars: gsap.TweenVars = {
      ...props,
      delay,
      onComplete: () => {
        count++;
        if (count >= children.length) {
          complete();
        }
      },
    };

    if (method === 'from') {
      gsap.from(child, vars);
    } else {
      gsap.to(child, vars);
    }
  }
}
