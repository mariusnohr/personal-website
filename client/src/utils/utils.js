import gsap from 'gsap';

export function animateStagger(children, options) {
  const { method, props, complete, delayBetween } = options;

  let index = 0;
  let count = 0;

  for (let child of children) {
    const delay = index++ * delayBetween;
    gsap[method](child, {
      ...props,
      delay,
      onComplete: () => {
        count++;
        if (count >= children.length) {
          complete();
        }
      },
    });
  }
}
