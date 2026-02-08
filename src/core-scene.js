import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

function neonWireMaterial(color, opacity = 0.95) {
  return new THREE.MeshBasicMaterial({
    color,
    wireframe: true,
    transparent: true,
    opacity
  });
}

function createPowerIcon() {
  const bolt = new THREE.Shape();
  bolt.moveTo(-0.09, 0.17);
  bolt.lineTo(0.01, 0.03);
  bolt.lineTo(-0.03, 0.03);
  bolt.lineTo(0.09, -0.17);
  bolt.lineTo(-0.01, -0.03);
  bolt.lineTo(0.03, -0.03);

  const geometry = new THREE.ShapeGeometry(bolt);
  const material = new THREE.MeshBasicMaterial({ color: 0xffde59, transparent: true, opacity: 0.95 });
  return new THREE.Mesh(geometry, material);
}

function createWireHuman() {
  const human = new THREE.Group();

  const cyan = 0x00f2ff;
  const violet = 0x8b5cf6;

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.48, 18, 16), neonWireMaterial(cyan, 0.92));
  head.position.y = 1.45;
  human.add(head);

  const jaw = new THREE.Mesh(new THREE.ConeGeometry(0.34, 0.42, 6, 1, true), neonWireMaterial(violet, 0.6));
  jaw.position.y = 1.06;
  jaw.rotation.y = Math.PI / 6;
  human.add(jaw);

  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.83, 1.65, 10, 10, true), neonWireMaterial(cyan, 0.65));
  torso.position.y = 0.18;
  human.add(torso);

  const chestFrame = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.025, 10, 32), neonWireMaterial(violet, 0.8));
  chestFrame.position.set(0, 0.45, 0.08);
  chestFrame.rotation.x = Math.PI / 2;
  human.add(chestFrame);

  const shoulderL = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), neonWireMaterial(cyan, 0.85));
  shoulderL.position.set(-0.7, 0.74, 0.06);
  human.add(shoulderL);
  const shoulderR = shoulderL.clone();
  shoulderR.position.x = 0.7;
  human.add(shoulderR);

  const armMat = neonWireMaterial(cyan, 0.78);
  const foreL = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 1.18, 10, 1, true), armMat);
  foreL.position.set(-0.14, 0.02, 0.28);
  foreL.rotation.z = -1.03;
  foreL.rotation.y = 0.08;
  human.add(foreL);

  const foreR = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 1.18, 10, 1, true), armMat.clone());
  foreR.position.set(0.14, 0.02, 0.28);
  foreR.rotation.z = 1.03;
  foreR.rotation.y = -0.08;
  human.add(foreR);

  const iconWrap = new THREE.Group();
  iconWrap.position.set(0, 1.45, 0.5);

  const faceOutline = new THREE.Mesh(new THREE.RingGeometry(0.22, 0.245, 32), neonWireMaterial(cyan, 0.95));
  const faceOutlineAccent = new THREE.Mesh(new THREE.RingGeometry(0.255, 0.267, 32), neonWireMaterial(violet, 0.45));
  faceOutlineAccent.position.z = -0.012;

  const power = createPowerIcon();
  power.position.z = 0.012;

  iconWrap.add(faceOutlineAccent, faceOutline, power);
  human.add(iconWrap);

  human.userData = { head, torso, foreL, foreR, power, faceOutline, faceOutlineAccent };
  return human;
}

export function initCoreScene(canvas) {
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x050505, 8, 24);

  const camera = new THREE.PerspectiveCamera(42, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.set(0, 0.75, 7.5);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

  scene.add(new THREE.AmbientLight(0x7feaf0, 0.45));
  const key = new THREE.PointLight(0x00f2ff, 1.9, 28);
  key.position.set(2.5, 2.6, 4);
  const rim = new THREE.PointLight(0x8b5cf6, 1.7, 24);
  rim.position.set(-3, 1.8, 2);
  scene.add(key, rim);

  const human = createWireHuman();
  human.position.y = -0.25;
  scene.add(human);

  const floorRing = new THREE.Mesh(
    new THREE.RingGeometry(2.6, 2.65, 84),
    new THREE.MeshBasicMaterial({ color: 0x00f2ff, transparent: true, opacity: 0.35, side: THREE.DoubleSide })
  );
  floorRing.rotation.x = Math.PI / 2;
  floorRing.position.y = -1.35;
  scene.add(floorRing);

  const halo = new THREE.Mesh(
    new THREE.TorusGeometry(1.45, 0.012, 8, 64),
    new THREE.MeshBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.6 })
  );
  halo.position.y = 1.5;
  halo.rotation.x = Math.PI / 2;
  scene.add(halo);

  const starsCount = 260;
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(starsCount * 3);
  for (let i = 0; i < starsCount; i++) {
    const radius = 4 + Math.random() * 5;
    const angle = Math.random() * Math.PI * 2;
    const y = (Math.random() - 0.5) * 5;
    starPos[i * 3] = Math.cos(angle) * radius;
    starPos[i * 3 + 1] = y;
    starPos[i * 3 + 2] = Math.sin(angle) * radius;
  }
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
  const stars = new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({ color: 0x00f2ff, size: 0.028, transparent: true, opacity: 0.7 })
  );
  scene.add(stars);

  const mouse = { x: 0, y: 0 };
  window.addEventListener("pointermove", (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  const clock = new THREE.Clock();
  function animate() {
    const t = clock.getElapsedTime();

    human.position.y = -0.25 + Math.sin(t * 0.9) * 0.07;
    human.rotation.y += (mouse.x * 0.2 - human.rotation.y) * 0.03;

    const d = human.userData;
    d.head.rotation.y = Math.sin(t * 0.45) * 0.12;
    d.torso.rotation.y = Math.sin(t * 0.35) * 0.06;
    d.foreL.rotation.z = -1.03 + Math.sin(t * 0.9) * 0.03;
    d.foreR.rotation.z = 1.03 - Math.sin(t * 0.9) * 0.03;
    d.power.scale.setScalar(0.95 + Math.sin(t * 2.6) * 0.08);
    d.faceOutline.material.opacity = 0.68 + Math.sin(t * 2.2) * 0.18;
    d.faceOutlineAccent.material.opacity = 0.3 + Math.sin(t * 1.8 + 1) * 0.14;

    halo.rotation.z += 0.004;
    floorRing.material.opacity = 0.2 + Math.sin(t * 1.2) * 0.08;
    stars.rotation.y += 0.00055;

    camera.position.x += (mouse.x * 0.3 - camera.position.x) * 0.02;
    camera.position.y += (0.75 + mouse.y * 0.12 - camera.position.y) * 0.02;
    camera.lookAt(0, 0.45, 0);

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
