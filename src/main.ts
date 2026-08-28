import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { createNepotatoGpuModel, getNepotatoGpuRotors } from "./createNepotatoGpuModel";
import "./style.css";

const canvas = document.querySelector<HTMLCanvasElement>("#gpu-canvas");
const viewport = document.querySelector<HTMLElement>("#viewer");

if (!canvas || !viewport) {
  throw new Error("nepotato GPU demo canvas is missing");
}

const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true,
  powerPreference: "high-performance",
});
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.94;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf7fafc);

const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
camera.position.set(7.8, 3.5, 10.8);

scene.add(new THREE.HemisphereLight(0xeef8ff, 0x101820, 0.92));

const keyLight = new THREE.DirectionalLight(0xffffff, 2.65);
keyLight.position.set(4.5, 7, 8);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(2048, 2048);
scene.add(keyLight);

const rimLight = new THREE.DirectionalLight(0x66c8ff, 2.2);
rimLight.position.set(-7, 1.5, -5);
scene.add(rimLight);

const warmFill = new THREE.DirectionalLight(0xfff2df, 0.58);
warmFill.position.set(-3, -1, 6);
scene.add(warmFill);

const model = createNepotatoGpuModel();
model.rotation.set(-0.08, 0.18, -0.045);
model.position.y = 0.25;
model.traverse((object) => {
  if (!(object instanceof THREE.Mesh)) return;
  object.castShadow = true;
  object.receiveShadow = true;
});
scene.add(model);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(30, 30),
  new THREE.ShadowMaterial({ color: 0x1a2b36, opacity: 0.16 }),
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1.48;
floor.receiveShadow = true;
scene.add(floor);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 7.5;
controls.maxDistance = 17;
controls.target.set(0, 0.1, 0);

const rotors = getNepotatoGpuRotors(model);
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let visible = true;
let previousTime = performance.now();

const resize = () => {
  const width = Math.max(viewport.clientWidth, 1);
  const height = Math.max(viewport.clientHeight, 1);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
};

new ResizeObserver(resize).observe(viewport);
new IntersectionObserver(([entry]) => {
  visible = entry.isIntersecting;
}).observe(viewport);
resize();

const animate = (time: number) => {
  requestAnimationFrame(animate);
  if (!visible) return;
  const delta = Math.min((time - previousTime) / 1000, 0.05);
  previousTime = time;
  if (!reducedMotion) {
    rotors.forEach((rotor, index) => {
      rotor.rotation.z += delta * [2.35, 2.1, 2.5][index];
    });
  }
  controls.update();
  renderer.render(scene, camera);
};

requestAnimationFrame(animate);
