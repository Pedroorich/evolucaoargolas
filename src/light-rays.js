import * as THREE from 'three';

const RAY_Y_POSITION_1 = -0.4;
const RAY_Y_POSITION_2 = -0.5;

const VERTEX_SHADER = `
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FRAGMENT_SHADER = `
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform vec4 u_colors[2];
uniform float u_intensity;
uniform float u_rays;
uniform float u_reach;
uniform vec2 u_rayPos1;
uniform vec2 u_rayPos2;

float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord, float seedA, float seedB, float speed) {
    vec2 sourceToCoord = coord - raySource;
    float cosAngle = dot(normalize(sourceToCoord), rayRefDirection);
    float diagonal = length(u_resolution);

    return clamp(
        (.45 + 0.15 * sin(cosAngle * seedA + u_time * speed)) +
        (0.3 + 0.2 * cos(-cosAngle * seedB + u_time * speed)),
        u_reach, 1.0) *
        clamp((diagonal - length(sourceToCoord)) / diagonal, u_reach, 1.0);
}

void main() {
    vec2 coord = vec2(gl_FragCoord.x, u_resolution.y - gl_FragCoord.y);
    float speed = u_rays * 10.0;

    vec2 rayPos1 = u_rayPos1;
    vec2 rayRefDir1 = normalize(vec2(1.0, -0.116));
    float raySeedA1 = 36.2214 * speed;
    float raySeedB1 = 21.11349 * speed;
    float raySpeed1 = 1.5 * speed;

    vec2 rayPos2 = u_rayPos2;
    vec2 rayRefDir2 = normalize(vec2(1.0, 0.241));
    float raySeedA2 = 22.39910 * speed;
    float raySeedB2 = 18.0234 * speed;
    float raySpeed2 = 1.1 * speed;

    float strength1 = rayStrength(rayPos1, rayRefDir1, coord, raySeedA1, raySeedB1, raySpeed1);
    float strength2 = rayStrength(rayPos2, rayRefDir2, coord, raySeedA2, raySeedB2, raySpeed2);

    float brightness = 1.0 * u_reach - (coord.y / u_resolution.y);
    float attenuation = clamp(brightness + (0.5 + u_intensity), 0.0, 1.0);

    float alpha1 = strength1 * attenuation * u_colors[0].a;
    float alpha2 = strength2 * attenuation * u_colors[1].a;

    vec3 premultColor1 = u_colors[0].rgb * alpha1;
    vec3 premultColor2 = u_colors[1].rgb * alpha2;

    vec3 blendedColor = premultColor1 + premultColor2;
    float blendedAlpha = alpha1 + alpha2 * (1.0 - alpha1);

    vec3 finalRGB = blendedColor / max(blendedAlpha, 0.0001);

    gl_FragColor = vec4(finalRGB * blendedAlpha, blendedAlpha);
}
`;

function hexToRgb(hex) {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map(x => x + x).join('');
  }
  const num = parseInt(c, 16);
  return [
    ((num >> 16) & 255) / 255,
    ((num >> 8) & 255) / 255,
    (num & 255) / 255
  ];
}

function mapRange(value, fromLow, fromHigh, toLow, toHigh) {
  return toLow + ((value - fromLow) / (fromHigh - fromLow)) * (toHigh - toLow);
}

export function initLightRays(containerSelector, options = {}) {
  const container = typeof containerSelector === 'string'
    ? document.querySelector(containerSelector)
    : containerSelector;

  if (!container) return null;

  const config = {
    intensity: options.intensity ?? 13,
    rays: options.rays ?? 32,
    reach: options.reach ?? 16,
    position: options.position ?? 50,
    speed: options.speed ?? 10,
    color1: options.color1 ?? '#ff8e2b',
    color2: options.color2 ?? '#ffffff',
    ...options
  };

  const c1 = hexToRgb(config.color1);
  const c2 = hexToRgb(config.color2);

  const scene = new THREE.Scene();
  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || 500;

  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({
    preserveDrawingBuffer: true,
    premultipliedAlpha: true,
    alpha: true,
    antialias: true,
    precision: 'highp',
    powerPreference: 'high-performance',
  });

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.inset = '0';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.pointerEvents = 'none';
  renderer.domElement.style.zIndex = '0';

  container.appendChild(renderer.domElement);

  const geometry = new THREE.PlaneGeometry(1024, 1024);
  const material = new THREE.ShaderMaterial({
    fragmentShader: FRAGMENT_SHADER,
    vertexShader: VERTEX_SHADER,
    uniforms: {
      u_colors: {
        value: [
          new THREE.Vector4(c1[0], c1[1], c1[2], 1),
          new THREE.Vector4(c2[0], c2[1], c2[2], 1),
        ],
      },
      u_intensity: { value: mapRange(config.intensity, 0, 100, 0, 0.5) },
      u_rays: { value: mapRange(config.rays, 0, 100, 0, 0.3) },
      u_reach: { value: mapRange(config.reach, 0, 100, 0, 0.5) },
      u_time: { value: Math.random() * 10000 },
      u_mouse: { value: [0, 0] },
      u_resolution: { value: [width, height] },
      u_rayPos1: {
        value: [
          (config.position / 100) * width,
          RAY_Y_POSITION_1 * height,
        ],
      },
      u_rayPos2: {
        value: [
          (config.position / 100 + 0.02) * width,
          RAY_Y_POSITION_2 * height,
        ],
      },
    },
    wireframe: false,
    dithering: false,
    side: THREE.DoubleSide,
    transparent: true,
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  let animFrameId;
  let lastTime = performance.now();

  function animate(now) {
    const delta = now - lastTime;
    lastTime = now;

    if (material && material.uniforms) {
      material.uniforms.u_time.value += (delta * config.speed) / 1000 / 10;
    }

    renderer.render(scene, camera);
    animFrameId = requestAnimationFrame(animate);
  }

  animFrameId = requestAnimationFrame(animate);

  function handleResize() {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || 500;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    if (material && material.uniforms) {
      material.uniforms.u_resolution.value = [w, h];
      material.uniforms.u_rayPos1.value = [
        (config.position / 100) * w,
        RAY_Y_POSITION_1 * h,
      ];
      material.uniforms.u_rayPos2.value = [
        (config.position / 100 + 0.02) * w,
        RAY_Y_POSITION_2 * h,
      ];
    }
  }

  window.addEventListener('resize', handleResize);

  return {
    destroy() {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    }
  };
}
