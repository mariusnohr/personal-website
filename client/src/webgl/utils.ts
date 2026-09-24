import type { PerspectiveCamera } from 'three';

// get the visible viewport height at a certain depth in 3D space
export function visibleHeightAtZDepth(
  depth: number,
  camera: PerspectiveCamera,
): number {
  // compensate for cameras not positioned at z=0
  const cameraOffset = camera.position.z;
  if (depth < cameraOffset) depth -= cameraOffset;
  else depth += cameraOffset;

  // vertical fov in radians
  const vFOV = (camera.fov * Math.PI) / 180;

  // Math.abs to ensure the result is always positive
  return 2 * Math.tan(vFOV / 2) * Math.abs(depth);
}

export function visibleWidthAtZDepth(
  depth: number,
  camera: PerspectiveCamera,
): number {
  const height = visibleHeightAtZDepth(depth, camera);
  return height * camera.aspect;
}
