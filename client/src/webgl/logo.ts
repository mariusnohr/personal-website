import * as THREE from 'three';
import gsap from 'gsap';

import { clamp } from '../utils/math';
import { visibleHeightAtZDepth, visibleWidthAtZDepth } from './utils';

import vs from './shaders/logo.vert';
import fs from './shaders/logo.frag';

const uniforms = {
  uTime: { value: 0 },
  opacity: { value: 1 },
  mouseover: { value: false },
  darken: { value: 1 },
  amp: { value: 0.1 },
  saturation: { value: 0 },
};

const timeStep = {
  value: 1,
};

let mesh: THREE.Mesh;
let cam: THREE.PerspectiveCamera;
let mScale: THREE.Vector3;
let active = true;

export function positionLogo(measure: DOMRect, _animation = false): void {
  mesh.position.z = 0;
  // uniforms.opacity.value = 1;

  const visibleHeight = visibleHeightAtZDepth(mesh.position.z, cam);
  const visibleWidth = visibleWidthAtZDepth(mesh.position.z, cam);

  const pxToUnits = visibleWidth / window.innerWidth;
  const pxToUnits2 = visibleHeight / window.innerHeight;
  const leftCol = pxToUnits * measure.width;

  const aspect = window.innerWidth / window.innerHeight;
  let scale = clamp(aspect * 0.65, 0.6, 0.8);

  if (window.innerWidth <= 540) {
    scale = pxToUnits2 * 65;
  }

  mesh.scale.set(scale, scale, 1);

  mesh.position.x = -visibleWidth * 0.5 + leftCol * 0.5;
  mesh.position.y = visibleHeight * 0.5 - scale - 0.25;

  mScale.copy(mesh.scale);
}

function mouseOverState(): void {
  gsap.to(uniforms.darken, { duration: 0.6, value: 0.8 });
  gsap.to(timeStep, { duration: 0.6, value: 1.3 });
  gsap.to(uniforms.amp, { duration: 0.6, value: 0.25 });
  gsap.to(mesh.scale, {
    duration: 0.9,
    x: mScale.x + 0.1,
    y: mScale.y + 0.1,
    ease: 'elastic.out',
  });
}

function mouseOutState(onComplete: (active: boolean) => void): void {
  const amp = active ? 0.1 : 0;

  gsap.to(uniforms.darken, { duration: 0.6, value: 1 });
  gsap.to(uniforms.amp, { duration: 0.6, value: amp });
  gsap.to(timeStep, { duration: 0.6, value: 1 });

  gsap.to(mesh.scale, {
    duration: 0.7,
    x: mScale.x,
    y: mScale.y,
    ease: 'elastic.out',
    onComplete: () => {
      onComplete(active);
    },
  });
}

export function mouseover(): void {
  const mouseOver = uniforms.mouseover.value;

  if (!mouseOver) {
    uniforms.mouseover.value = true;
    mouseOverState();
  }
}

export function mouseout(onComplete: (active: boolean) => void): void {
  const mouseOver = uniforms.mouseover.value;

  if (mouseOver) {
    uniforms.mouseover.value = false;
    mouseOutState(onComplete);
  }
}

export function toggleActive(toggle: boolean, cb?: () => void): void {
  active = toggle;

  if (!active) {
    gsap.to(uniforms.amp, { duration: 0.6, value: 0 });
    gsap.to(uniforms.saturation, { duration: 0.6, value: 1 });
    gsap.to(uniforms.darken, {
      duration: 0.6,
      value: 0.96,
      onComplete: cb,
    });
  } else {
    gsap.to(uniforms.amp, { duration: 0.6, value: 0.1 });
    gsap.to(uniforms.saturation, { duration: 0.6, value: 0 });
    gsap.to(uniforms.darken, { duration: 0.6, value: 1 });
    gsap.to(uniforms.opacity, {
      duration: 1,
      value: 1,
    });
  }
}

export function update(): void {
  uniforms.uTime.value += 0.01 * timeStep.value;
}

export function init({
  scene,
  camera,
}: {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
}): void {
  cam = camera;

  const geom = new THREE.PlaneGeometry(2, 2);

  const material = new THREE.ShaderMaterial({
    vertexShader: vs,
    fragmentShader: fs,
    uniforms,
    transparent: true,
  });

  mesh = new THREE.Mesh(geom, material);

  mScale = new THREE.Vector3();
  active = true;

  scene.add(mesh);
}
