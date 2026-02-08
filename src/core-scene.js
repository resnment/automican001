import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

function createPowerIcon() {
  const bolt = new THREE.Shape();
  bolt.moveTo(-0.08, 0.16);
  bolt.lineTo(0.01, 0.03);
  bolt.lineTo(-0.02, 0.03);
  bolt.lineTo(0.08, -0.16);
  bolt.lineTo(-0.01, -0.03);
  bolt.lineTo(0.02, -0.03);

  const geometry = new THREE.ShapeGeometry(bolt);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffde59,
    transparent: true,
    opacity: 0.95,
    side: THREE.DoubleSide
  });

  return new THREE.Mesh(geometry, material);
}

function createFaceOutline(color, scale = 1) {
  const points = [
    new THREE.Vector3(-0.48, 0.34, 0),
    new THREE.Vector3(-0.28, 0.58, 0),
    new THREE.Vector3(0.28, 0.58, 0),
    new THREE.Vector3(0.48, 0.34, 0),
    new THREE.Vector3(0.42, -0.28, 0),
    new THREE.Vector3(0, -0.58, 0),
    new THREE.Vector3(-0.42, -0.28, 0)
  ];

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.LineLoop(
    geometry,
    new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.85
    })
  );
  line.scale.setScalar(scale);
  return line;
}

function createPortrait({ x = 0, tint = 0x00f2ff, accent = 0x8b5cf6, phase = 0 }) {
  const portrait = new THREE.Group();
  portrait.position.set(x, 0.1, 0);

  const torso = new THREE.Mesh(
    new THREE.BoxGeometry(1.1, 1.3, 0.45),
    new THREE.MeshPhysicalMaterial({
      color: 0x0a1a22,
      emissive: tint,
      emissiveIntensity: 0.15,
      transparent: true,
      opacity: 0.75,
      metalness: 0.65,
      roughness: 0.25
    })
  );
  torso.position.y = -0.15;
  portrait.add(torso);

  const shoulderL = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 14, 10),
    new THREE.MeshBasicMaterial({ color: tint, transparent: true, opacity: 0.8 })
  );
  shoulderL.position.set(-0.62, 0.38, 0.03);
  portrait.add(shoulderL);

  const shoulderR = shoulderL.clone();
  shoulderR.position.x = 0.62;
  portrait.add(shoulderR);

  const armMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x0e2a33,
    emissive: accent,
    emissiveIntensity: 0.12,
    metalness: 0.6,
    roughness: 0.32,
    transparent: true,
    opacity: 0.8
  });

  const leftForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 1, 10), armMaterial);
  leftForearm.rotation.z = -1.02;
  leftForearm.position.set(-0.16, -0.2, 0.19);
  portrait.add(leftForearm);

  const rightForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 1, 10), armMaterial.clone());
  rightForearm.rotation.z = 1.02;
  rightForearm.position.set(0.16, -0.2, 0.21);
  portrait.add(rightForearm);

  const faceGroup = new THREE.Group();
  faceGroup.position.set(0, 0.95, 0.28);

  const frontGlow = createFaceOutline(tint, 1);
  const rearGlow = createFaceOutline(accent, 1.05);
  rearGlow.position.z = -0.025;
  rearGlow.material.opacity = 0.45;

  const powerIcon = createPowerIcon();
  powerIcon.position.z = 0.01;

  faceGroup.add(rearGlow, frontGlow, powerIcon);
  portrait.add(faceGroup);

  portrait.userData = {
    phase,
    torso,
    faceGroup,
    frontGlow,
    rearGlow,
    powerIcon
  };

  return portrait;
}

export function initCoreScene(canvas) {
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x050505, 9, 22);

  const camera = new THREE.PerspectiveCamera(42, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.set(0, 0.65, 8);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

  const ambient = new THREE.AmbientLight(0x9ad9e0, 0.5);
  const keyLight = new THREE.PointLight(0x00f2ff, 1.8, 24);
  keyLight.position.set(2.8, 2.2, 4.4);
  const rimLight = new THREE.PointLight(0x8b5cf6, 1.6, 24);
  rimLight.position.set(-3.2, 1.7, 2.4);
  scene.add(ambient, keyLight, rimLight);

  const portraits = [
    createPortrait({ x: -1.35, tint: 0x00f2ff, accent: 0x8b5cf6, phase: 0 }),
    createPortrait({ x: 1.35, tint: 0x8b5cf6, accent: 0x00f2ff, phase: Math.PI * 0.65 })
  ];

  portraits[0].rotation.y = 0.12;
  portraits[1].rotation.y = -0.12;
  portraits.forEach((p) => scene.add(p));

  const aura = new THREE.Mesh(
    new THREE.RingGeometry(3.4, 3.42, 96),
    new THREE.MeshBasicMaterial({ color: 0x00f2ff, transparent: true, opacity: 0.25, side: THREE.DoubleSide })
  );
  aura.rotation.x = Math.PI / 2;
  aura.position.y = -1.35;
  scene.add(aura);

  const mouse = { x: 0, y: 0 };
  window.addEventListener("pointermove", (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  const clock = new THREE.Clock();

  function animate() {
    const t = clock.getElapsedTime();

    portraits.forEach((portrait, idx) => {
      const d = portrait.userData;
      const drift = Math.sin(t * 0.8 + d.phase) * 0.08;
      portrait.position.y = 0.1 + drift;
      portrait.rotation.y += (((idx === 0 ? 0.14 : -0.14) + mouse.x * 0.06) - portrait.rotation.y) * 0.04;

      d.torso.scale.y = 1 + Math.sin(t * 1.2 + d.phase) * 0.02;
      d.frontGlow.material.opacity = 0.62 + Math.sin(t * 2.4 + d.phase) * 0.18;
      d.rearGlow.material.opacity = 0.32 + Math.sin(t * 2.1 + d.phase + 1.1) * 0.12;
      d.powerIcon.scale.setScalar(0.96 + Math.sin(t * 2.8 + d.phase) * 0.05);
    });

    aura.material.opacity = 0.18 + Math.sin(t * 1.1) * 0.06;

    camera.position.x += (mouse.x * 0.2 - camera.position.x) * 0.02;
    camera.position.y += (0.65 + mouse.y * 0.1 - camera.position.y) * 0.02;
    camera.lookAt(0, 0.3, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();

  function onResize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }

  window.addEventListener("resize", onResize);

  return { scene, camera, renderer };
}
