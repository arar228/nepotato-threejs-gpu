import * as THREE from 'three';

declare function createNepotatoGpuModel(): THREE.Group<THREE.Object3DEventMap>;
declare function getNepotatoGpuRotors(model: THREE.Object3D): THREE.Group[];
declare function disposeNepotatoGpuModel(model: THREE.Object3D): void;

export { createNepotatoGpuModel, disposeNepotatoGpuModel, getNepotatoGpuRotors };
