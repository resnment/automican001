import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

export function initCoreScene(canvas) {
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x050505, 8, 28);

  const camera = new THREE.PerspectiveCamera(
    45,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 1, 9);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

  // ===== LIGHTING =====
  const ambient = new THREE.AmbientLight(0x66ffff, 0.4);
  scene.add(ambient);

  const keyLight = new THREE.PointLight(0x00f2ff, 2.8, 35);
  keyLight.position.set(3, 4, 5);
  scene.add(keyLight);

  const rimLight = new THREE.PointLight(0x8b5cf6, 2.2, 30);
  rimLight.position.set(-4, 2, -2);
  scene.add(rimLight);

  const fillLight = new THREE.PointLight(0x00f2ff, 1.2, 25);
  fillLight.position.set(0, -2, 3);
  scene.add(fillLight);

  // ===== AGENT GROUP =====
  const agent = new THREE.Group();
  agent.position.y = -0.5;
  scene.add(agent);

  // --- HEAD ---
  const headGeo = new THREE.BoxGeometry(0.7, 0.8, 0.7);
  const headMat = new THREE.MeshPhysicalMaterial({
    color: 0x0ff8ff,
    emissive: 0x00bcd4,
    emissiveIntensity: 0.3,
    metalness: 0.7,
    roughness: 0.2,
    transmission: 0.2,
    transparent: true,
    opacity: 0.85
  });
  const head = new THREE.Mesh(headGeo, headMat);
  head.position.y = 1.8;
  agent.add(head);

  // Head wireframe overlay
  const headWireGeo = new THREE.OctahedronGeometry(0.55, 0);
  const headWireMat = new THREE.MeshBasicMaterial({
    color: 0x8b5cf6,
    wireframe: true,
    transparent: true,
    opacity: 0.4
  });
  const headWire = new THREE.Mesh(headWireGeo, headWireMat);
  headWire.position.y = 1.8;
  agent.add(headWire);

  // Face accent (glowing line)
  const faceLineGeo = new THREE.PlaneGeometry(0.45, 0.08);
  const faceLineMat = new THREE.MeshBasicMaterial({
    color: 0x00f2ff,
    transparent: true,
    opacity: 0.9,
    side: THREE.DoubleSide
  });
  const faceLine = new THREE.Mesh(faceLineGeo, faceLineMat);
  faceLine.position.set(0, 1.75, 0.36);
  agent.add(faceLine);

  // Eyes (two small glowing spheres)
  const eyeGeo = new THREE.SphereGeometry(0.06, 8, 8);
  const eyeMat = new THREE.MeshBasicMaterial({
    color: 0x00f2ff,
    transparent: true,
    opacity: 1
  });
  const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
  eyeL.position.set(-0.15, 1.85, 0.36);
  agent.add(eyeL);
  const eyeR = new THREE.Mesh(eyeGeo, eyeMat.clone());
  eyeR.position.set(0.15, 1.85, 0.36);
  agent.add(eyeR);

  // --- NECK ---
  const neckGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.35, 6);
  const neckMat = new THREE.MeshPhysicalMaterial({
    color: 0x0dd4e0,
    metalness: 0.8,
    roughness: 0.3,
    emissive: 0x00bcd4,
    emissiveIntensity: 0.15
  });
  const neck = new THREE.Mesh(neckGeo, neckMat);
  neck.position.y = 1.2;
  agent.add(neck);

  // --- TORSO ---
  const torsoGeo = new THREE.BoxGeometry(1.1, 1.4, 0.5);
  const torsoMat = new THREE.MeshPhysicalMaterial({
    color: 0x0ff8ff,
    emissive: 0x00bcd4,
    emissiveIntensity: 0.25,
    metalness: 0.6,
    roughness: 0.25,
    transmission: 0.15,
    transparent: true,
    opacity: 0.9
  });
  const torso = new THREE.Mesh(torsoGeo, torsoMat);
  torso.position.y = 0.35;
  agent.add(torso);

  // Chest core (glowing centerpiece)
  const coreGeo = new THREE.SphereGeometry(0.15, 12, 12);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0x00f2ff,
    transparent: true,
    opacity: 0.95
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  core.position.set(0, 0.45, 0.26);
  agent.add(core);

  // Torso wireframe accent
  const torsoWireGeo = new THREE.BoxGeometry(1.2, 1.5, 0.55);
  const torsoWireMat = new THREE.MeshBasicMaterial({
    color: 0x8b5cf6,
    wireframe: true,
    transparent: true,
    opacity: 0.3
  });
  const torsoWire = new THREE.Mesh(torsoWireGeo, torsoWireMat);
  torsoWire.position.y = 0.35;
  agent.add(torsoWire);

  // --- SHOULDERS ---
  const shoulderGeo = new THREE.SphereGeometry(0.22, 8, 8);
  const shoulderMat = new THREE.MeshPhysicalMaterial({
    color: 0x0dd4e0,
    metalness: 0.75,
    roughness: 0.25,
    emissive: 0x00bcd4,
    emissiveIntensity: 0.2
  });
  const shoulderL = new THREE.Mesh(shoulderGeo, shoulderMat);
  shoulderL.position.set(-0.65, 0.85, 0);
  agent.add(shoulderL);
  const shoulderR = new THREE.Mesh(shoulderGeo, shoulderMat.clone());
  shoulderR.position.set(0.65, 0.85, 0);
  agent.add(shoulderR);

  // --- ARMS ---
  const upperArmGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.75, 6);
  const armMat = new THREE.MeshPhysicalMaterial({
    color: 0x0ff8ff,
    metalness: 0.7,
    roughness: 0.3,
    emissive: 0x00bcd4,
    emissiveIntensity: 0.15,
    transparent: true,
    opacity: 0.85
  });

  // Left arm group
  const leftArm = new THREE.Group();
  leftArm.position.set(-0.65, 0.85, 0);
  agent.add(leftArm);

  const upperArmL = new THREE.Mesh(upperArmGeo, armMat);
  upperArmL.position.y = -0.4;
  leftArm.add(upperArmL);

  const elbowL = new THREE.Mesh(new THREE.SphereGeometry(0.13, 8, 8), shoulderMat);
  elbowL.position.y = -0.78;
  leftArm.add(elbowL);

  const foreArmL = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.09, 0.7, 6), armMat);
  foreArmL.position.y = -1.15;
  leftArm.add(foreArmL);

  const handL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.25, 0.12), armMat);
  handL.position.y = -1.55;
  leftArm.add(handL);

  // Right arm group
  const rightArm = new THREE.Group();
  rightArm.position.set(0.65, 0.85, 0);
  agent.add(rightArm);

  const upperArmR = new THREE.Mesh(upperArmGeo, armMat.clone());
  upperArmR.position.y = -0.4;
  rightArm.add(upperArmR);

  const elbowR = new THREE.Mesh(new THREE.SphereGeometry(0.13, 8, 8), shoulderMat.clone());
  elbowR.position.y = -0.78;
  rightArm.add(elbowR);

  const foreArmR = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.09, 0.7, 6), armMat.clone());
  foreArmR.position.y = -1.15;
  rightArm.add(foreArmR);

  const handR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.25, 0.12), armMat.clone());
  handR.position.y = -1.55;
  rightArm.add(handR);

  // ===== HOLOGRAPHIC UI PANELS =====
  const uiPanels = [];
  const panelConfigs = [
    { pos: [2.2, 2.5, 0], size: [0.7, 0.5], color: 0x00f2ff, icon: 'task' },
    { pos: [-2.0, 2.2, 0.5], size: [0.6, 0.6], color: 0x8b5cf6, icon: 'data' },
    { pos: [2.5, 0.8, -0.5], size: [0.8, 0.4], color: 0x00f2ff, icon: 'code' },
    { pos: [-2.3, 0.5, 0], size: [0.5, 0.7], color: 0x8b5cf6, icon: 'network' },
    { pos: [1.8, -0.5, 1], size: [0.6, 0.5], color: 0x00f2ff, icon: 'process' },
    { pos: [-1.9, -0.8, 0.8], size: [0.7, 0.6], color: 0x8b5cf6, icon: 'status' }
  ];

  panelConfigs.forEach((config, i) => {
    const panelGroup = new THREE.Group();
    panelGroup.position.set(...config.pos);
    
    // Main panel (translucent plane)
    const panelGeo = new THREE.PlaneGeometry(config.size[0], config.size[1]);
    const panelMat = new THREE.MeshBasicMaterial({
      color: config.color,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide
    });
    const panel = new THREE.Mesh(panelGeo, panelMat);
    panelGroup.add(panel);

    // Panel border
    const borderGeo = new THREE.EdgesGeometry(panelGeo);
    const borderMat = new THREE.LineBasicMaterial({
      color: config.color,
      transparent: true,
      opacity: 0.8
    });
    const border = new THREE.LineSegments(borderGeo, borderMat);
    panelGroup.add(border);

    // Icon representation (small geometric shapes)
    let icon;
    if (config.icon === 'task') {
      icon = new THREE.Mesh(
        new THREE.BoxGeometry(0.15, 0.15, 0.02),
        new THREE.MeshBasicMaterial({ color: config.color, transparent: true, opacity: 0.9 })
      );
    } else if (config.icon === 'data') {
      icon = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 0.15, 6),
        new THREE.MeshBasicMaterial({ color: config.color, transparent: true, opacity: 0.9 })
      );
      icon.rotation.x = Math.PI / 2;
    } else if (config.icon === 'code') {
      const codeGeo = new THREE.BufferGeometry();
      const vertices = new Float32Array([
        -0.1, 0.05, 0,  -0.05, 0, 0,  -0.1, -0.05, 0,
        0.1, 0.05, 0,  0.05, 0, 0,  0.1, -0.05, 0
      ]);
      codeGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      icon = new THREE.Line(
        codeGeo,
        new THREE.LineBasicMaterial({ color: config.color, transparent: true, opacity: 0.9 })
      );
    } else {
      icon = new THREE.Mesh(
        new THREE.TorusGeometry(0.06, 0.02, 8, 12),
        new THREE.MeshBasicMaterial({ color: config.color, transparent: true, opacity: 0.9 })
      );
    }
    icon.position.z = 0.02;
    panelGroup.add(icon);

    // Progress bar
    const progressBg = new THREE.Mesh(
      new THREE.PlaneGeometry(config.size[0] * 0.7, 0.03),
      new THREE.MeshBasicMaterial({ color: 0x333333, transparent: true, opacity: 0.6 })
    );
    progressBg.position.set(0, -config.size[1] / 2 + 0.08, 0.01);
    panelGroup.add(progressBg);

    const progressFill = new THREE.Mesh(
      new THREE.PlaneGeometry(config.size[0] * 0.7 * (0.3 + Math.random() * 0.7), 0.03),
      new THREE.MeshBasicMaterial({ color: config.color, transparent: true, opacity: 0.9 })
    );
    progressFill.position.set(0, -config.size[1] / 2 + 0.08, 0.02);
    panelGroup.add(progressFill);

    // Store references
    panelGroup.userData = {
      basePos: config.pos.slice(),
      orbitSpeed: 0.08 + Math.random() * 0.15,
      orbitRadius: 0.15 + Math.random() * 0.2,
      phase: Math.random() * Math.PI * 2,
      panel,
      border,
      icon,
      progressFill
    };

    scene.add(panelGroup);
    uiPanels.push(panelGroup);
  });

  // ===== PARTICLE STREAMS =====
  const particleStreams = [];
  
  for (let i = 0; i < 3; i++) {
    const streamCount = 40;
    const positions = new Float32Array(streamCount * 3);
    const colors = new Float32Array(streamCount * 3);
    
    for (let j = 0; j < streamCount; j++) {
      positions[j * 3] = 0;
      positions[j * 3 + 1] = 0;
      positions[j * 3 + 2] = 0;
      
      const c = i % 2 === 0 ? new THREE.Color(0x00f2ff) : new THREE.Color(0x8b5cf6);
      colors[j * 3] = c.r;
      colors[j * 3 + 1] = c.g;
      colors[j * 3 + 2] = c.b;
    }
    
    const streamGeo = new THREE.BufferGeometry();
    streamGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    streamGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const streamMat = new THREE.PointsMaterial({
      size: 0.04,
      transparent: true,
      opacity: 0.7,
      vertexColors: true,
      blending: THREE.AdditiveBlending
    });
    
    const stream = new THREE.Points(streamGeo, streamMat);
    scene.add(stream);
    particleStreams.push({ points: stream, positions });
  }

  // ===== AMBIENT PARTICLE FIELD =====
  const ambientCount = 800;
  const ambientPositions = new Float32Array(ambientCount * 3);
  for (let i = 0; i < ambientCount * 3; i++) {
    ambientPositions[i] = (Math.random() - 0.5) * 20;
  }
  const ambientGeo = new THREE.BufferGeometry();
  ambientGeo.setAttribute('position', new THREE.BufferAttribute(ambientPositions, 3));
  const ambientMat = new THREE.PointsMaterial({
    color: 0x00f2ff,
    size: 0.02,
    transparent: true,
    opacity: 0.5
  });
  const ambientParticles = new THREE.Points(ambientGeo, ambientMat);
  scene.add(ambientParticles);

  // ===== MOUSE INTERACTION =====
  const mouse = { x: 0, y: 0 };
  window.addEventListener("pointermove", (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // ===== ANIMATION LOOP =====
  const clock = new THREE.Clock();
  
  function animate() {
    const t = clock.getElapsedTime();

    // Agent breathing
    const breathe = 1 + Math.sin(t * 1.5) * 0.015;
    torso.scale.y = breathe;
    torso.scale.x = 1 / Math.sqrt(breathe);

    // Head look-around (subtle)
    head.rotation.y = Math.sin(t * 0.3) * 0.15;
    head.rotation.x = Math.sin(t * 0.4) * 0.08;
    headWire.rotation.y = head.rotation.y;
    headWire.rotation.x = head.rotation.x;

    // Eye glow pulse
    const eyePulse = 0.8 + Math.sin(t * 3) * 0.2;
    eyeL.material.opacity = eyePulse;
    eyeR.material.opacity = eyePulse;

    // Core glow
    const corePulse = 0.85 + Math.sin(t * 2.2) * 0.15;
    core.scale.setScalar(corePulse);

    // Arm animations (reaching gestures)
    leftArm.rotation.x = Math.sin(t * 0.6) * 0.2 - 0.15;
    leftArm.rotation.z = Math.sin(t * 0.5) * 0.1;
    
    rightArm.rotation.x = Math.sin(t * 0.6 + 0.5) * 0.2 - 0.1;
    rightArm.rotation.z = -Math.sin(t * 0.5 + 0.3) * 0.1;

    // UI Panels orbit and pulse
    uiPanels.forEach((panel, i) => {
      const data = panel.userData;
      const orbitAngle = t * data.orbitSpeed + data.phase;
      
      panel.position.x = data.basePos[0] + Math.cos(orbitAngle) * data.orbitRadius;
      panel.position.y = data.basePos[1] + Math.sin(orbitAngle * 0.7) * data.orbitRadius * 0.5;
      panel.position.z = data.basePos[2] + Math.sin(orbitAngle) * data.orbitRadius * 0.3;
      
      // Rotate to face camera
      panel.lookAt(camera.position);
      
      // Pulse effect
      const pulse = 0.9 + Math.sin(t * 2 + i) * 0.1;
      data.border.material.opacity = 0.6 + Math.sin(t * 1.5 + i) * 0.2;
      data.icon.rotation.z = t * 0.5;
      
      // Progress bar animation
      const progress = (Math.sin(t * 0.4 + i) + 1) * 0.5;
      data.progressFill.scale.x = 0.3 + progress * 0.7;
    });

    // Particle streams (from hands to UI panels)
    particleStreams.forEach((stream, streamIdx) => {
      const positions = stream.positions;
      const hand = streamIdx === 0 ? handL : (streamIdx === 1 ? handR : handL);
      const handWorldPos = new THREE.Vector3();
      hand.getWorldPosition(handWorldPos);
      
      const targetPanel = uiPanels[streamIdx * 2] || uiPanels[0];
      const targetPos = targetPanel.position;
      
      for (let i = 0; i < 40; i++) {
        const progress = i / 40;
        const wave = Math.sin(t * 3 + i * 0.3) * 0.15;
        
        positions[i * 3] = THREE.MathUtils.lerp(handWorldPos.x, targetPos.x, progress) + wave;
        positions[i * 3 + 1] = THREE.MathUtils.lerp(handWorldPos.y, targetPos.y, progress) + wave * 0.5;
        positions[i * 3 + 2] = THREE.MathUtils.lerp(handWorldPos.z, targetPos.z, progress) + wave * 0.3;
      }
      
      stream.points.geometry.attributes.position.needsUpdate = true;
      stream.points.material.opacity = 0.5 + Math.sin(t * 2 + streamIdx) * 0.2;
    });

    // Ambient particles rotation
    ambientParticles.rotation.y += 0.0003;

    // Mouse parallax (subtle)
    camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.03;
    camera.position.y += (mouse.y * 0.3 + 1 - camera.position.y) * 0.03;
    camera.lookAt(0, 0.5, 0);

    // Agent body follows mouse slightly
    agent.rotation.y += (mouse.x * 0.1 - agent.rotation.y) * 0.02;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  // ===== RESPONSIVE RESIZE =====
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
