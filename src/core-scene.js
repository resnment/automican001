import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

export function initCoreScene(canvas) {
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x050505, 6, 22);

  const camera = new THREE.PerspectiveCamera(
    50,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 7);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

  // Lights
  const ambient = new THREE.AmbientLight(0x66ffff, 0.35);
  scene.add(ambient);

  const pointTeal = new THREE.PointLight(0x00f2ff, 2.4, 30);
  pointTeal.position.set(2, 2, 4);
  scene.add(pointTeal);

  const pointViolet = new THREE.PointLight(0x8b5cf6, 1.8, 30);
  pointViolet.position.set(-3, -1, 3);
  scene.add(pointViolet);

  // Core sphere
  const coreGeo = new THREE.IcosahedronGeometry(1.4, 7);
  const coreMat = new THREE.MeshPhysicalMaterial({
    color: 0x0ff8ff,
    emissive: 0x00bcd4,
    emissiveIntensity: 0.6,
    metalness: 0.5,
    roughness: 0.1,
    transmission: 0.4,
    transparent: true,
    opacity: 0.9
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  scene.add(core);

  // Wire shell
  const shellGeo = new THREE.IcosahedronGeometry(1.8, 2);
  const shellMat = new THREE.MeshBasicMaterial({
    color: 0x8b5cf6,
    wireframe: true,
    transparent: true,
    opacity: 0.45
  });
  const shell = new THREE.Mesh(shellGeo, shellMat);
  scene.add(shell);

  // Particle field
  const count = 1200;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 16;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const pMat = new THREE.PointsMaterial({
    color: 0x00f2ff,
    size: 0.018,
    transparent: true,
    opacity: 0.85
  });
  const points = new THREE.Points(pGeo, pMat);
  scene.add(points);

  // Mouse interaction
  const mouse = { x: 0, y: 0 };
  window.addEventListener("pointermove", (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  const clock = new THREE.Clock();
  function animate() {
    const t = clock.getElapsedTime();

    core.rotation.y += 0.003;
    core.rotation.x += 0.0015;
    shell.rotation.y -= 0.002;
    points.rotation.y += 0.0006;

    // Pulse
    const pulse = 1 + Math.sin(t * 2.2) * 0.03;
    core.scale.setScalar(pulse);

    // Parallax
    core.rotation.y += mouse.x * 0.001;
    core.rotation.x += mouse.y * 0.001;
    camera.position.x += (mouse.x * 0.35 - camera.position.x) * 0.04;
    camera.position.y += (mouse.y * 0.2 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);

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
