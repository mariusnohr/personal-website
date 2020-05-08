#pragma glslify: noise = require(./noise.glsl)

varying vec2 vUv;
uniform float uTime;
uniform float opacity;
uniform float darken;
uniform float amp;
uniform float saturation;

float circle(vec2 uv, vec2 center, float radius, float antialias) {
  vec2 dist = uv - center;
  float aa = radius * antialias;
  float shape = smoothstep(radius - aa, radius + aa, dot(dist, dist) * 4.0);
	return shape;
}

void main() {
  // convert uv to -0.5 -> 0.5
	vec2 uv = -0.5 + vUv;

  float radius = 0.7 + noise(vUv + uTime) * amp;
  float mask = circle(uv, vec2(0.0), radius, 0.01);
  vec3 bg = vec3(1.0);

  // colors
  vec3 col1 = vec3(0.4, 0.7, 1.0);
  vec3 col2 = vec3(0.7, 0.3, 1.0);
  vec3 col3 = vec3(0.6, 0.7, 0.9);
  vec3 col4 = vec3(0.9, 0.7, 0.6);

  vec3 first = mix(col1, col2, 0.5 + sin(uTime + vUv.x * 3.5) * 0.5);
  vec3 second = mix(col3, col4, 0.5 + cos(uTime + vUv.y * 2.3) * 0.5);

  vec3 grad = mix(first, second, 0.5 + sin(uTime * 0.5) * 0.5);

  // compute noise
  float nx = uTime * 0.356 - sin(vUv.x);
  float ny = uTime * 0.6182 + cos(vUv.y);
  float n = 0.2 + noise(vec2(nx, ny)) * 0.2;

  grad += n;

  vec3 greyscale = vec3((grad.r + grad.g + grad.b) / 3.0);
  vec3 color = mix(grad, greyscale, saturation);
  vec3 final = mix(color * darken, bg, mask);

	gl_FragColor = vec4(final, opacity);
}
