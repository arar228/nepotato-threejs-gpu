import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

/**
 * Creates an editable procedural triple-fan graphics card.
 *
 * The returned THREE.Group contains named components and fan rotor references
 * in userData.rotors. No textures or external model files are required.
 */
function roundedBox(width: number, height: number, depth: number, radius = 0.08) {
  return new RoundedBoxGeometry(width, height, depth, 4, radius);
}

function buildFan(
  frameMaterial: THREE.Material,
  bladeMaterial: THREE.Material,
  hubMaterial: THREE.Material,
) {
  const fan = new THREE.Group();
  const rotor = new THREE.Group();
  fan.name = "fan-assembly";
  rotor.name = "fan-rotor";

  const well = new THREE.Mesh(
    new THREE.CircleGeometry(0.92, 64),
    new THREE.MeshStandardMaterial({ color: 0x05080b, roughness: 0.82 }),
  );
  well.position.z = -0.05;
  fan.add(well);

  const outerRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.01, 0.055, 12, 72),
    frameMaterial,
  );
  outerRing.position.z = 0.06;
  fan.add(outerRing);

  const innerRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.9, 0.022, 8, 64),
    new THREE.MeshStandardMaterial({ color: 0x111820, metalness: 0.25, roughness: 0.45 }),
  );
  innerRing.position.z = 0.085;
  fan.add(innerRing);

  const bladeShape = new THREE.Shape();
  bladeShape.moveTo(0.255, -0.02);
  bladeShape.bezierCurveTo(0.4, -0.06, 0.62, -0.24, 0.81, -0.41);
  bladeShape.bezierCurveTo(0.89, -0.46, 0.95, -0.35, 0.91, -0.22);
  bladeShape.bezierCurveTo(0.78, -0.09, 0.53, 0.045, 0.32, 0.15);
  bladeShape.bezierCurveTo(0.265, 0.17, 0.245, 0.065, 0.255, -0.02);
  bladeShape.closePath();
  const bladeGeometry = new THREE.ExtrudeGeometry(bladeShape, {
    depth: 0.06,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 0.012,
    bevelThickness: 0.012,
    curveSegments: 10,
  });
  const bladePositions = bladeGeometry.getAttribute("position");
  for (let vertex = 0; vertex < bladePositions.count; vertex += 1) {
    const x = bladePositions.getX(vertex);
    const y = bladePositions.getY(vertex);
    const radial = Math.hypot(x, y);
    bladePositions.setZ(vertex, bladePositions.getZ(vertex) + (radial - 0.25) * 0.065 - y * 0.025);
  }
  bladePositions.needsUpdate = true;
  bladeGeometry.computeVertexNormals();

  for (let index = 0; index < 11; index += 1) {
    const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
    blade.rotation.z = (index / 11) * Math.PI * 2 + 0.16;
    blade.position.z = 0.082;
    rotor.add(blade);
  }

  const hub = new THREE.Mesh(
    new THREE.CylinderGeometry(0.29, 0.32, 0.16, 48),
    hubMaterial,
  );
  hub.rotation.x = Math.PI / 2;
  hub.position.z = 0.14;
  rotor.add(hub);

  const hubCap = new THREE.Mesh(
    new THREE.CircleGeometry(0.245, 48),
    new THREE.MeshPhysicalMaterial({
      color: 0x69737d,
      metalness: 0.9,
      roughness: 0.4,
      clearcoat: 0.14,
      clearcoatRoughness: 0.36,
    }),
  );
  hubCap.position.z = 0.225;
  rotor.add(hubCap);

  fan.add(rotor);
  fan.userData.rotor = rotor;
  return fan;
}

export function createNepotatoGpuModel() {
  const card = new THREE.Group();
  card.name = "gpu-card-root";

  const coatedMetal = new THREE.MeshPhysicalMaterial({
    color: 0x1b242d,
    metalness: 0.48,
    roughness: 0.34,
    clearcoat: 0.16,
    clearcoatRoughness: 0.58,
  });
  const darkPanel = new THREE.MeshPhysicalMaterial({
    color: 0x121920,
    metalness: 0.12,
    roughness: 0.56,
    clearcoat: 0.08,
  });
  const blackPolymer = new THREE.MeshStandardMaterial({
    color: 0x070a0e,
    metalness: 0.04,
    roughness: 0.43,
  });
  const bladeMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x121820,
    metalness: 0.05,
    roughness: 0.4,
    clearcoat: 0.2,
    clearcoatRoughness: 0.42,
  });
  const bareMetal = new THREE.MeshStandardMaterial({
    color: 0x929ba2,
    metalness: 0.9,
    roughness: 0.28,
  });
  const hubMetal = new THREE.MeshPhysicalMaterial({
    color: 0x69737d,
    metalness: 0.9,
    roughness: 0.3,
    clearcoat: 0.18,
    clearcoatRoughness: 0.3,
  });
  const gold = new THREE.MeshStandardMaterial({
    color: 0xc58b20,
    metalness: 0.92,
    roughness: 0.24,
  });
  const rearAssembly = new THREE.Group();
  rearAssembly.name = "gpu-rear-assembly";
  card.add(rearAssembly);
  const backplate = new THREE.Mesh(roundedBox(7.18, 2.72, 0.22, 0.12), darkPanel);
  backplate.position.z = -0.53;
  backplate.name = "gpu-backplate";
  rearAssembly.add(backplate);

  const rearInsetMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x303944,
    metalness: 0.62,
    roughness: 0.32,
    clearcoat: 0.18,
  });
  const rearInset = new THREE.Mesh(roundedBox(6.58, 2.18, 0.045, 0.08), rearInsetMaterial);
  rearInset.position.set(-0.08, 0, -0.665);
  rearAssembly.add(rearInset);
  const rearSeamGeometry = roundedBox(2.05, 0.045, 0.022, 0.012);
  [
    [-2.02, 0.62, 0.24],
    [-0.2, 0.08, -0.18],
    [1.62, -0.62, 0.22],
  ].forEach(([x, y, rotation]) => {
    const seam = new THREE.Mesh(rearSeamGeometry, coatedMetal);
    seam.position.set(x, y, -0.7);
    seam.rotation.z = rotation;
    rearAssembly.add(seam);
  });
  for (let index = 0; index < 7; index += 1) {
    const vent = new THREE.Mesh(roundedBox(0.62, 0.055, 0.025, 0.012), blackPolymer);
    vent.position.set(2.35, -0.63 + index * 0.21, -0.705);
    vent.rotation.z = -0.2;
    rearAssembly.add(vent);
  }
  const rearScrewGeometry = new THREE.CylinderGeometry(0.055, 0.055, 0.04, 20);
  [[-2.9, 0.86], [-2.9, -0.86], [2.92, 0.86], [2.92, -0.86], [0, 0.92], [0, -0.92]].forEach(([x, y]) => {
    const screw = new THREE.Mesh(rearScrewGeometry, bareMetal);
    screw.rotation.x = Math.PI / 2;
    screw.position.set(x, y, -0.71);
    rearAssembly.add(screw);
  });

  const pcb = new THREE.Mesh(
    roundedBox(6.72, 2.3, 0.1, 0.055),
    new THREE.MeshStandardMaterial({ color: 0x101b18, metalness: 0.08, roughness: 0.7 }),
  );
  pcb.position.set(-0.16, -0.05, -0.39);
  pcb.name = "gpu-pcb";
  card.add(pcb);

  const heatsink = new THREE.Group();
  const finGeometry = new THREE.BoxGeometry(0.055, 2.42, 0.72);
  for (let index = 0; index < 58; index += 1) {
    const fin = new THREE.Mesh(finGeometry, bareMetal);
    fin.position.set(-3.22 + index * 0.113, 0, -0.15);
    heatsink.add(fin);
  }
  card.add(heatsink);

  const heatPipes = new THREE.Group();
  heatPipes.name = "gpu-heat-pipe-bank";
  const copper = new THREE.MeshStandardMaterial({ color: 0x9c5b2d, metalness: 0.88, roughness: 0.24 });
  [-0.72, -0.24, 0.24, 0.72].forEach((y, index) => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.8, y, -0.52),
      new THREE.Vector3(-1.25, y + 0.08 * (index % 2 ? 1 : -1), -0.56),
      new THREE.Vector3(0.5, y - 0.06, -0.55),
      new THREE.Vector3(2.75, y, -0.5),
    ]);
    const pipe = new THREE.Mesh(new THREE.TubeGeometry(curve, 72, 0.045, 10, false), copper);
    heatPipes.add(pipe);
  });
  card.add(heatPipes);

  const frontCore = new THREE.Mesh(roundedBox(7.22, 2.68, 0.34, 0.13), blackPolymer);
  frontCore.position.z = 0.14;
  frontCore.name = "gpu-front-core";
  card.add(frontCore);

  const shroudShape = new THREE.Shape();
  shroudShape.moveTo(-3.58, -0.94);
  shroudShape.lineTo(-3.29, -1.25);
  shroudShape.lineTo(-2.76, -1.35);
  shroudShape.lineTo(-2.44, -1.24);
  shroudShape.lineTo(-1.35, -1.24);
  shroudShape.lineTo(-1.1, -1.36);
  shroudShape.lineTo(0.83, -1.3);
  shroudShape.lineTo(1.08, -1.2);
  shroudShape.lineTo(2.15, -1.18);
  shroudShape.lineTo(2.42, -1.27);
  shroudShape.lineTo(3.22, -1.12);
  shroudShape.lineTo(3.56, -0.78);
  shroudShape.lineTo(3.55, 0.75);
  shroudShape.lineTo(3.25, 1.08);
  shroudShape.lineTo(2.5, 1.19);
  shroudShape.lineTo(2.18, 1.29);
  shroudShape.lineTo(1.18, 1.22);
  shroudShape.lineTo(0.95, 1.34);
  shroudShape.lineTo(-0.78, 1.34);
  shroudShape.lineTo(-1.02, 1.23);
  shroudShape.lineTo(-2.2, 1.23);
  shroudShape.lineTo(-2.5, 1.35);
  shroudShape.lineTo(-3.34, 1.23);
  shroudShape.lineTo(-3.61, 0.92);
  shroudShape.closePath();
  [
    { x: -2.38, radius: 1.07 },
    { x: 0.02, radius: 1.07 },
    { x: 2.32, radius: 1.07 },
  ].forEach(({ x, radius }) => {
    const hole = new THREE.Path();
    hole.absarc(x, 0, radius, 0, Math.PI * 2, true);
    shroudShape.holes.push(hole);
  });
  const shroudGeometry = new THREE.ExtrudeGeometry(shroudShape, {
    depth: 0.24,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: 0.07,
    bevelThickness: 0.055,
    curveSegments: 48,
  });
  shroudGeometry.translate(0, 0, 0.27);
  const shroud = new THREE.Mesh(shroudGeometry, coatedMetal);
  shroud.name = "gpu-front-shroud";
  card.add(shroud);

  const panelMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x2c3540,
    metalness: 0.46,
    roughness: 0.3,
    clearcoat: 0.15,
  });
  const panelGeometry = roundedBox(0.13, 2.08, 0.065, 0.025);
  const panelPairs: Array<[number, number, number]> = [
    [-1.22, 0, -0.24], [1.19, 0, 0.24],
  ];
  panelPairs.forEach(([x, y, rotation]) => {
    const seam = new THREE.Mesh(panelGeometry, panelMaterial);
    seam.position.set(x, y, 0.53);
    seam.rotation.z = rotation;
    card.add(seam);
  });

  const facetGeometry = roundedBox(1.62, 0.18, 0.09, 0.028);
  [
    [-2.38, 1.08, 0.035], [0.02, 1.1, -0.025], [2.3, 1.02, -0.08],
    [-2.38, -1.08, -0.035], [0.02, -1.1, 0.025], [2.3, -1.02, 0.08],
  ].forEach(([x, y, rotation]) => {
    const facet = new THREE.Mesh(facetGeometry, darkPanel);
    facet.position.set(x, y, 0.565);
    facet.rotation.z = rotation;
    card.add(facet);
  });

  const fanFrameMaterial = new THREE.MeshStandardMaterial({
    color: 0x29323b,
    metalness: 0.66,
    roughness: 0.27,
  });
  const rotors: THREE.Group[] = [];
  const fanAssemblies: THREE.Group[] = [];
  [
    { x: -2.38, scale: 1.02, componentId: "gpu-fan-left" },
    { x: 0.02, scale: 1.02, componentId: "gpu-fan-center" },
    { x: 2.32, scale: 1.02, componentId: "gpu-fan-right" },
  ].forEach(({ x, scale, componentId }, index) => {
    const fan = buildFan(fanFrameMaterial, bladeMaterial, hubMetal);
    fan.position.set(x, 0, 0.55);
    fan.scale.setScalar(scale);
    fan.name = `fan-assembly-${index + 1}`;
    (fan.userData.rotor as THREE.Group).name = componentId;
    card.add(fan);
    fanAssemblies.push(fan);
    rotors.push(fan.userData.rotor as THREE.Group);
  });

  const fanFastenerGeometry = new THREE.CylinderGeometry(0.048, 0.048, 0.055, 20);
  [-2.38, 0.02, 2.32].forEach((fanX) => {
    [Math.PI * 0.24, Math.PI * 0.76, Math.PI * 1.24, Math.PI * 1.76].forEach((angle) => {
      const fastener = new THREE.Mesh(fanFastenerGeometry, bareMetal);
      fastener.rotation.x = Math.PI / 2;
      fastener.position.set(fanX + Math.cos(angle) * 1.04, Math.sin(angle) * 1.04, 0.61);
      card.add(fastener);
      const slot = new THREE.Mesh(new THREE.BoxGeometry(0.052, 0.012, 0.012), blackPolymer);
      slot.position.set(fastener.position.x, fastener.position.y, 0.645);
      slot.rotation.z = angle * 0.35;
      card.add(slot);
    });
  });

  const powerSocketMaterial = new THREE.MeshStandardMaterial({
    color: 0x0b0e12,
    metalness: 0.08,
    roughness: 0.55,
  });
  [1.72, 2.36].forEach((x) => {
    const socket = new THREE.Mesh(roundedBox(0.54, 0.3, 0.42, 0.035), powerSocketMaterial);
    socket.position.set(x, 1.33, -0.18);
    card.add(socket);
    for (let pin = 0; pin < 8; pin += 1) {
      const pinWell = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.06, 0.02), blackPolymer);
      pinWell.position.set(x - 0.16 + (pin % 4) * 0.105, 1.49, -0.3 + Math.floor(pin / 4) * 0.1);
      card.add(pinWell);
    }
  });

  const railSegments: Array<[number, number, number, number, number]> = [
    [-2.35, 1.4, 2.1, 0.2, 0.03],
    [-0.15, 1.46, 2.25, 0.18, -0.02],
    [2.2, 1.29, 2.35, 0.2, -0.1],
    [-2.25, -1.34, 2.25, 0.22, 0.04],
    [0.1, -1.31, 2.35, 0.18, 0],
    [2.35, -1.22, 1.95, 0.22, 0.11],
  ];
  railSegments.forEach(([x, y, width, height, rotation]) => {
    const rail = new THREE.Mesh(roundedBox(width, height, 0.36, 0.04), coatedMetal);
    rail.position.set(x, y, 0.35);
    rail.rotation.z = rotation;
    card.add(rail);
  });

  const ledChannels = new THREE.Group();
  ledChannels.name = "gpu-led-channel-system";
  const ledRecessMaterial = new THREE.MeshStandardMaterial({
    color: 0x071018,
    metalness: 0.18,
    roughness: 0.46,
  });
  const ledCoreMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x52c8f2,
    emissive: 0x0078b4,
    emissiveIntensity: 1.25,
    metalness: 0,
    roughness: 0.3,
    clearcoat: 0.38,
    clearcoatRoughness: 0.24,
  });
  const ledPaths: Array<{ id: string; points: Array<[number, number]> }> = [
    { id: "top-left", points: [[-1.72, 1.02], [-1.31, 0.93], [-0.88, 1.04]] },
    { id: "top-right", points: [[0.78, 1.0], [1.18, 0.91], [1.61, 1.0]] },
    { id: "bottom-left", points: [[-1.72, -1.02], [-1.31, -0.93], [-0.88, -1.04]] },
    { id: "bottom-right", points: [[0.78, -1.0], [1.18, -0.91], [1.61, -1.0]] },
  ];
  ledPaths.forEach(({ id, points }) => {
    const createAngularPath = (z: number) => {
      const vectors = points.map(([x, y]) => new THREE.Vector3(x, y, z));
      const path = new THREE.CurvePath<THREE.Vector3>();
      for (let index = 0; index < vectors.length - 1; index += 1) {
        path.add(new THREE.LineCurve3(vectors[index], vectors[index + 1]));
      }
      return path;
    };
    const recessPath = createAngularPath(0.558);
    const corePath = createAngularPath(0.592);
    const channel = new THREE.Group();
    channel.name = `gpu-led-channel-${id}`;
    const recess = new THREE.Mesh(new THREE.TubeGeometry(recessPath, 28, 0.038, 8, false), ledRecessMaterial);
    recess.name = `${channel.name}-recess`;
    channel.add(recess);
    const core = new THREE.Mesh(new THREE.TubeGeometry(corePath, 28, 0.018, 8, false), ledCoreMaterial);
    core.name = `${channel.name}-core`;
    channel.add(core);
    ledChannels.add(channel);
  });
  card.add(ledChannels);

  const screwGeometry = new THREE.CylinderGeometry(0.065, 0.065, 0.07, 24);
  const screwPositions: Array<[number, number]> = [
    [-3.28, 1.03], [-3.28, -1.03], [3.27, 1.02], [3.27, -1.02],
  ];
  screwPositions.forEach(([x, y]) => {
    const screw = new THREE.Mesh(screwGeometry, bareMetal);
    screw.rotation.x = Math.PI / 2;
    screw.position.set(x, y, 0.58);
    card.add(screw);
  });

  const bracketOutline = new THREE.Shape();
  bracketOutline.moveTo(-0.16, 1.82);
  bracketOutline.lineTo(0.25, 1.82);
  bracketOutline.lineTo(0.25, 1.58);
  bracketOutline.lineTo(0.48, 1.58);
  bracketOutline.lineTo(0.48, -1.45);
  bracketOutline.lineTo(0.23, -1.45);
  bracketOutline.lineTo(0.23, -1.82);
  bracketOutline.lineTo(-0.2, -1.82);
  bracketOutline.lineTo(-0.2, -1.56);
  bracketOutline.lineTo(-0.4, -1.56);
  bracketOutline.lineTo(-0.4, 1.55);
  bracketOutline.lineTo(-0.16, 1.55);
  bracketOutline.closePath();
  const bracketGeometry = new THREE.ExtrudeGeometry(bracketOutline, {
    depth: 0.88,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 0.025,
    bevelThickness: 0.025,
    curveSegments: 2,
  });
  bracketGeometry.translate(0, 0, -0.44);
  const bracket = new THREE.Mesh(bracketGeometry, bareMetal);
  bracket.position.set(-3.72, -0.18, -0.03);
  bracket.rotation.y = Math.PI / 2;
  bracket.name = "gpu-io-bracket";
  card.add(bracket);

  const portBank = new THREE.Group();
  portBank.name = "gpu-bracket-port-bank";
  card.add(portBank);
  [0.7, 0.18, -0.34, -0.86].forEach((y) => {
    const portTrim = new THREE.Mesh(roundedBox(0.1, 0.44, 0.44, 0.025), darkPanel);
    portTrim.position.set(-4.18, y, -0.03);
    portBank.add(portTrim);
    const port = new THREE.Mesh(roundedBox(0.115, 0.3, 0.32, 0.018), blackPolymer);
    port.position.set(-4.25, y, -0.03);
    portBank.add(port);
  });

  const ventGrid = new THREE.Group();
  ventGrid.name = "gpu-bracket-vent-grid";
  card.add(ventGrid);
  [-0.29, 0.24].forEach((z) => {
    for (let row = 0; row < 6; row += 1) {
      const vent = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.04, 6), blackPolymer);
      vent.rotation.z = Math.PI / 2;
      vent.rotation.x = Math.PI / 6;
      vent.position.set(-4.23, -1.18 + row * 0.21, z);
      ventGrid.add(vent);
    }
  });
  card.updateMatrixWorld(true);
  bracket.attach(portBank);
  bracket.attach(ventGrid);

  const connectorShoulder = new THREE.Mesh(
    roundedBox(2.75, 0.3, 0.18, 0.025),
    blackPolymer,
  );
  connectorShoulder.position.set(-0.72, -1.49, -0.18);
  connectorShoulder.name = "gpu-pcie-shoulder";
  card.add(connectorShoulder);

  const connector = new THREE.Mesh(roundedBox(2.55, 0.15, 0.13, 0.025), gold);
  connector.position.set(-0.72, -1.65, -0.08);
  connector.name = "gpu-pcie-connector";
  card.add(connector);
  const connectorCut = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.23, 0.16), blackPolymer);
  connectorCut.position.set(0.22, -1.65, -0.07);
  card.add(connectorCut);

  const rightEndFrame = new THREE.Group();
  rightEndFrame.name = "gpu-right-end-radiator";
  const rightEndCap = new THREE.Mesh(roundedBox(0.22, 2.36, 1.02, 0.045), darkPanel);
  rightEndCap.position.set(3.48, 0, -0.04);
  rightEndFrame.add(rightEndCap);
  const endFinGeometry = new THREE.BoxGeometry(0.255, 0.055, 0.78);
  for (let fin = 0; fin < 22; fin += 1) {
    const rib = new THREE.Mesh(endFinGeometry, coatedMetal);
    rib.position.set(3.6, -1.04 + fin * 0.099, -0.04);
    rightEndFrame.add(rib);
  }
  const endRailGeometry = roundedBox(0.29, 0.12, 1.08, 0.025);
  [-1.14, 1.14].forEach((y) => {
    const rail = new THREE.Mesh(endRailGeometry, blackPolymer);
    rail.position.set(3.59, y, -0.04);
    rightEndFrame.add(rail);
  });
  card.add(rightEndFrame);

  const undersideRail = new THREE.Mesh(roundedBox(6.55, 0.17, 0.5, 0.04), darkPanel);
  undersideRail.position.set(0.05, -1.42, -0.22);
  undersideRail.name = "gpu-underside-rail";
  card.add(undersideRail);

  card.position.x = -0.2;
  card.rotation.set(-0.11, 0.28, -0.075);
  card.userData.rotors = rotors;
  card.userData.explodedParts = {
    rearAssembly,
    pcb,
    heatsink,
    heatPipes,
    frontCore,
    shroud,
    fanAssemblies,
    bracket,
  };
  card.userData.sculptRuntime = {
    components: {
      root: card.name,
      shroud: shroud.name,
      backplate: backplate.name,
      pcb: pcb.name,
      ioBracket: bracket.name,
      connector: connector.name,
      rotors: rotors.map((rotor) => rotor.name),
    },
    motionAffordances: rotors.map((rotor, index) => ({
      id: `gpu-fan-${["left", "center", "right"][index]}-spin`,
      componentId: rotor.name,
      behavior: "continuous-rotation",
      pivot: [0, 0, 0],
      axis: [0, 0, 1],
      rate: [2.35, 2.1, 2.5][index],
      source: "user",
      confidence: 1,
      enabledByDefault: true,
    })),
  };
  card.userData.materials = [
    coatedMetal, darkPanel, blackPolymer, bladeMaterial, bareMetal, hubMetal, gold,
    ledRecessMaterial, ledCoreMaterial,
  ];
  card.userData.project = {
    name: "nepotato Procedural Triple-Fan GPU",
    repository: "https://github.com/arar228/nepotato-threejs-gpu",
    license: "MIT",
  };
  return card;
}


export function getNepotatoGpuRotors(model: THREE.Object3D): THREE.Group[] {
  return (model.userData.rotors as THREE.Group[] | undefined) ?? [];
}

export function disposeNepotatoGpuModel(model: THREE.Object3D): void {
  const disposedMaterials = new Set<THREE.Material>();
  model.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    object.geometry.dispose();
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    materials.forEach((material) => {
      if (disposedMaterials.has(material)) return;
      material.dispose();
      disposedMaterials.add(material);
    });
  });
}

