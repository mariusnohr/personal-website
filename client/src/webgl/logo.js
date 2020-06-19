import * as THREE from 'three';
import gsap from 'gsap';
import { visibleHeightAtZDepth, visibleWidthAtZDepth, clamp } from './utils';

import { router } from '../framework/App';

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

let ctx, canvas, mesh, mat, canvasTexture, cam, mScale, time, clicked, active;

const LOGO_IN_DELAY = 0.5;

export function positionLogo(measure, animation = false) {
  mesh.position.z = 0;
  // uniforms.opacity.value = 1;

  const visibleHeight = visibleHeightAtZDepth(mesh.position.z, cam);
  const visibleWidth = visibleWidthAtZDepth(mesh.position.z, cam);

  const pxToUnits = visibleWidth / window.innerWidth;
  const leftCol = pxToUnits * measure.width;

  const aspect = window.innerWidth / window.innerHeight;
  const scale = clamp(aspect * 0.5, 0.7, 0.8);
  mesh.scale.set(scale, scale, 1);

  mesh.position.x = -visibleWidth * 0.5 + leftCol * 0.5;
  mesh.position.y = visibleHeight * 0.5 - scale - 0.25;

  mScale.copy(mesh.scale);
}

function mouseOverState() {
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

function mouseOutState(onComplete, isAnimating) {
  const darken = isAnimating ? 0.8 : 1;
  const amp = isAnimating ? 0.1 : 0;

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

export function mouseover() {
  const mouseOver = uniforms.mouseover.value;

  if (!mouseOver) {
    uniforms.mouseover.value = true;
    mouseOverState();
  }
}

export function mouseout(onComplete, isAnimating) {
  const mouseOver = uniforms.mouseover.value;

  if (mouseOver) {
    uniforms.mouseover.value = false;
    console.log(onComplete);
    mouseOutState(onComplete, isAnimating);
  }
}

export function toggleActive(toggle, cb) {
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

export function update(time) {
  uniforms.uTime.value += 0.01 * timeStep.value;
}

export function getMesh() {
  return mesh;
}

export function init({ scene, camera }) {
  cam = camera;

  const geom = new THREE.PlaneBufferGeometry(2, 2);

  mat = new THREE.ShaderMaterial({
    vertexShader: vs,
    fragmentShader: fs,
    uniforms,
    transparent: true,
  });

  mesh = new THREE.Mesh(geom, mat);

  mScale = new THREE.Vector3();
  time = 0;
  clicked = false;
  active = true;

  scene.add(mesh);
}
