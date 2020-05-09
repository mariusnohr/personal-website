import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as interactions from './interactions';
// import { projects } from 'data/sitedata';
import * as logo from './logo';

const CAMERA_FOV = 75;
const CAMERA_NEAR = 0.1;
const CAMERA_FAR = 1000;

let scene;
let camera;
let renderer;
let controls;
let width;
let height;
let mouse;
let raycaster;
let time;
let isAnimating;

function animate() {
  if (isAnimating) requestAnimationFrame(animate);

  // update time
  time += 0.01;

  // raycast
  raycast();

  // update logo
  logo.update();

  // render scene
  renderer.render(scene, camera);
}

function start() {
  isAnimating = true;
  animate();
}

function stop() {
  isAnimating = false;
}

function raycast() {
  // do raycast
  const mouseNDC = interactions.getMouse().ndc;
  mouse.x = mouseNDC[0];
  mouse.y = mouseNDC[1];

  // update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObject(logo.getMesh(), true);

  if (intersects.length) {
    logo.mouseover();
    if (interactions.mouseDown()) {
      logo.click();
    }
    return;
  }

  logo.mouseout();
}

function onResize() {
  width = window.innerWidth;
  height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

export function openProject() {
  logo.setInactive();
}

export function closeProject() {
  logo.setActive();
}

export function init(location) {
  // init all threejs stuff
  width = window.innerWidth;
  height = window.innerHeight;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    CAMERA_FOV,
    width / height,
    CAMERA_NEAR,
    CAMERA_FAR
  );
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#canvas'),
    antialias: true,
  });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(new THREE.Color('#ffffff'));
  renderer.setSize(width, height);

  renderer.render(scene, camera);

  mouse = new THREE.Vector2();
  raycaster = new THREE.Raycaster();

  window.addEventListener('resize', onResize, false);

  // init interactions
  interactions.init();

  // init logo
  logo.init({ scene, camera });

  // set time
  time = 0;

  // start engine
  // start();
}
