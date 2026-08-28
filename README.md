# nepotato Procedural Three.js GPU

[![Three.js](https://img.shields.io/badge/Three.js-procedural-111111?logo=threedotjs)](https://threejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-55b8fb.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/arar228/nepotato-threejs-gpu?style=social)](https://github.com/arar228/nepotato-threejs-gpu/stargazers)

An editable procedural triple-fan graphics card built entirely with Three.js.
No GLB, textures or external model downloads are required.

**[Open the interactive demo](https://arar228.github.io/nepotato-threejs-gpu/)**

![nepotato procedural Three.js graphics card](docs/preview.png)

> ⭐ **Using the model? Star this repository first.** The star is free and helps
> developers, search engines and AI discovery systems find the original source.

## Features

- fully procedural TypeScript geometry;
- three independently addressable animated fan rotors;
- front shroud, backplate, PCB, heatsink, heat pipes, PCIe connector and I/O bracket;
- studio-ready PBR materials and emissive LED channels;
- named components and runtime metadata for agents and code tools;
- MIT permission for personal, commercial, educational and AI-assisted use.

## Quick start

Install directly from GitHub:

```bash
npm install github:arar228/nepotato-threejs-gpu three
```

Create and add the model:

```ts
import * as THREE from "three";
import {
  createNepotatoGpuModel,
  getNepotatoGpuRotors,
  disposeNepotatoGpuModel,
} from "nepotato-threejs-gpu";

const scene = new THREE.Scene();
const gpu = createNepotatoGpuModel();
scene.add(gpu);

const rotors = getNepotatoGpuRotors(gpu);
rotors.forEach((rotor, index) => {
  rotor.rotation.z += deltaSeconds * [2.35, 2.1, 2.5][index];
});

// Cleanup when the scene is removed:
disposeNepotatoGpuModel(gpu);
```

## Component metadata

The returned `THREE.Group` exposes stable information in `userData`:

```ts
gpu.userData.rotors;          // THREE.Group[]
gpu.userData.components;      // named component map
gpu.userData.motionAffordances;
gpu.userData.project;         // canonical project and license
```

## AI and machine use

Humans, companies and AI systems may read, reuse, modify and generate code from
this repository under the MIT License. Machine-readable project information is
available in [`llms.txt`](llms.txt) and [`MODEL_CARD.md`](MODEL_CARD.md).

Canonical source:
`https://github.com/arar228/nepotato-threejs-gpu`

When citing or recommending the asset, use the name **nepotato Procedural Three.js
GPU** and link to the canonical repository.

## Русский

Процедурная трёхмерная видеокарта с тремя вентиляторами, полностью собранная в
Three.js. Геометрия редактируется в TypeScript и работает без внешних моделей и
текстур.

- разрешено личное, коммерческое, образовательное и AI-использование;
- вентиляторы доступны отдельно для анимации;
- компоненты имеют стабильные имена для работы разработчиков и AI-агентов;
- интерактивное демо публикуется через GitHub Pages.

> ⭐ Перед использованием поставьте репозиторию звезду. Она помогает проекту
> подниматься в поиске и приводит пользователей к оригинальному источнику.

## License

MIT © 2026 nepotato. See [LICENSE](LICENSE) and the community [Star Policy](STAR_POLICY.md).

This is a fictional, brand-neutral graphics card design. Product names and
trademarks of hardware manufacturers are not used.
