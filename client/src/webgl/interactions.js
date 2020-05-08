import touches from 'touches';
import { screenToNDC } from './utils';

let emitter = null;
let isDown = false;
let mouse = [-1000, -1000];
let mouseNDC = [-1, -1];

function start(evt, pos) {
  isDown = true;
}

function move(evt, pos) {
  mouse = pos;
  mouseNDC = screenToNDC(pos);
}

function end() {
  isDown = false;
}

export function init() {
  emitter = touches(window, { preventSimulated: false });

  emitter.on('start', start);
  emitter.on('move', move);
  emitter.on('end', end);
}

export function getMouse() {
  return {
    screen: mouse,
    ndc: mouseNDC,
  };
}

export function enable() {
  emitter.enable();
}

export function disable() {
  emitter.disable();
}

export function mouseDown() {
  return isDown;
}
