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

let ctx, canvas, mesh, mat, canvasTexture, cam, mScale, time, clicked, inactive;

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

  if (animation) {
    gsap.from(mesh.scale, {
      duration: 1,
      x: 0.5,
      y: 0.5,
      delay: 1,
      ease: 'elastic.out',
    });
    gsap.from(uniforms.opacity, { duration: 1, value: 0, delay: 1 });
  }
}

export function mouseover() {
  const mouseOver = uniforms.mouseover.value;

  if (!mouseOver) {
    uniforms.mouseover.value = true;
    if (!inactive) {
      gsap.to(uniforms.darken, { duration: 0.6, value: 0.8 });
      gsap.to(uniforms.amp, { duration: 0.6, value: 0.2 });
      gsap.to(timeStep, { duration: 0.6, value: 1.3 });
    }
    gsap.to(mesh.scale, {
      duration: 0.9,
      x: mScale.x + 0.1,
      y: mScale.y + 0.1,
      ease: 'elastic.out',
    });

    // document.body.classList.add('mouseover');
  }
}

export function mouseout() {
  const mouseOver = uniforms.mouseover.value;

  if (mouseOver) {
    uniforms.mouseover.value = false;

    if (!inactive) {
      gsap.to(uniforms.darken, { duration: 0.6, value: 1 });
      gsap.to(uniforms.amp, { duration: 0.6, value: 0.1 });
      gsap.to(timeStep, { duration: 0.6, value: 1 });
    }
    gsap.to(mesh.scale, {
      duration: 0.7,
      x: mScale.x,
      y: mScale.y,
      ease: 'elastic.out',
    });

    // document.body.classList.remove('mouseover');
  }
}

export function click() {
  if (!clicked) {
    clicked = true;
    router.navigate('/');
    setTimeout(() => {
      clicked = false;
    }, 100);
  }
}

export function setInactive() {
  inactive = true;

  gsap.killTweensOf(uniforms.opacity);
  gsap.killTweensOf(mesh.scale);

  uniforms.opacity.value = 1;
  mesh.scale.copy(mScale);

  gsap.to(uniforms.amp, { duration: 0.6, value: 0 });
  gsap.to(uniforms.saturation, { duration: 0.6, value: 1 });
  gsap.to(uniforms.darken, { duration: 0.6, value: 0.92 });
}

export function setActive() {
  inactive = false;

  gsap.to(uniforms.amp, { duration: 0.6, value: 0.1 });
  gsap.to(uniforms.saturation, { duration: 0.6, value: 0 });
  gsap.to(uniforms.darken, { duration: 0.6, value: 1 });
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
  inactive = false;

  scene.add(mesh);
}
