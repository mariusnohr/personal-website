import * as THREE from 'three';
import * as logo from './logo';

const CAMERA_FOV = 75;
const CAMERA_NEAR = 0.1;
const CAMERA_FAR = 1000;

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let width = 0;
let height = 0;
let isAnimating = false;

function animate(): void {
  if (isAnimating) requestAnimationFrame(animate);

  // update logo
  logo.update();

  // render scene
  renderer.render(scene, camera);
}

function start(): void {
  if (!isAnimating) {
    isAnimating = true;
    animate();
  }
}

function stop(): void {
  isAnimating = false;
}

function onResize(): void {
  width = window.innerWidth;
  height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

export function logoHover(toggle: boolean): void {
  if (toggle) {
    start();
    logo.mouseover();
  } else {
    // stop when out anim is complete
    logo.mouseout((active) => {
      if (!active) stop();
    });
  }
}

export function openProject(): void {
  logo.toggleActive(false, () => {
    stop();
  });
}

export function closeProject(): void {
  start();
  logo.toggleActive(true);
}

export function init(): void {
  // init all threejs stuff
  width = window.innerWidth;
  height = window.innerHeight;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    CAMERA_FOV,
    width / height,
    CAMERA_NEAR,
    CAMERA_FAR,
  );
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#canvas') as HTMLCanvasElement,
    antialias: false,
    powerPreference: 'high-performance',
  });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(new THREE.Color('#ffffff'));
  renderer.setSize(width, height);

  renderer.render(scene, camera);

  window.addEventListener('resize', onResize, false);

  // init logo
  logo.init({ scene, camera });

  // start engine
  start();
}
