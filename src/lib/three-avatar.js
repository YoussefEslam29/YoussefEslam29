import * as THREE from "three";

/**
 * Creates an immersive 3D avatar scene with a geometric humanoid figure,
 * floating particles, and glow effects in the XIXYA purple brand palette.
 */
export function createAvatarScene(canvas) {
  // ---- Renderer ----
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  renderer.setClearColor(0x000000, 0);

  // ---- Scene ----
  const scene = new THREE.Scene();

  // ---- Camera ----
  const camera = new THREE.PerspectiveCamera(
    55,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 0.5, 5);

  const updateCameraX = () => {
    const w = canvas.clientWidth;
    if (w === 0) return;
    if (w > 1024) {
      camera.position.x = -1.5; // Shift camera left -> subject moves right
      camera.position.y = 0.5;
      camera.position.z = 5;
    } else if (w > 768) {
      camera.position.x = -0.9; // Shift camera left -> subject moves right
      camera.position.y = 0.5;
      camera.position.z = 5.2;
    } else {
      camera.position.x = 0;
      camera.position.y = -0.3; // Center-bottom on mobile
      camera.position.z = 6.2;  // Push camera back to scale down avatar
    }
  };
  updateCameraX();

  // ---- Lights ----
  const ambientLight = new THREE.AmbientLight(0x6c2bd9, 0.4);
  scene.add(ambientLight);

  const purpleLight = new THREE.PointLight(0xa855f7, 2.5, 15);
  purpleLight.position.set(2, 3, 4);
  scene.add(purpleLight);

  const blueLight = new THREE.PointLight(0x6c2bd9, 1.5, 12);
  blueLight.position.set(-3, -1, 3);
  scene.add(blueLight);

  const accentLight = new THREE.PointLight(0xb794f6, 1, 10);
  accentLight.position.set(0, -2, 5);
  scene.add(accentLight);

  // ---- Central Figure: Geometric Wireframe Human ----
  // Torso (tall octahedron)
  const torsoGeo = new THREE.OctahedronGeometry(0.8, 1);
  const wireframeMat = new THREE.MeshBasicMaterial({
    color: 0xa855f7,
    wireframe: true,
    transparent: true,
    opacity: 0.6,
  });
  const torso = new THREE.Mesh(torsoGeo, wireframeMat);
  torso.scale.set(1, 1.5, 1);
  torso.position.set(0, 0.2, 0);
  scene.add(torso);

  // Head (icosahedron)
  const headGeo = new THREE.IcosahedronGeometry(0.45, 1);
  const headMat = new THREE.MeshBasicMaterial({
    color: 0xb794f6,
    wireframe: true,
    transparent: true,
    opacity: 0.7,
  });
  const head = new THREE.Mesh(headGeo, headMat);
  head.position.set(0, 1.8, 0);
  scene.add(head);

  // Inner core glow
  const coreGeo = new THREE.IcosahedronGeometry(0.35, 2);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0x6c2bd9,
    transparent: true,
    opacity: 0.15,
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  core.position.set(0, 0.2, 0);
  scene.add(core);

  // ---- Orbiting Rings ----
  const ringGeo = new THREE.TorusGeometry(1.6, 0.015, 8, 100);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xa855f7,
    transparent: true,
    opacity: 0.3,
  });

  const ring1 = new THREE.Mesh(ringGeo, ringMat);
  ring1.rotation.x = Math.PI / 3;
  ring1.position.y = 0.5;
  scene.add(ring1);

  const ring2 = new THREE.Mesh(ringGeo, ringMat.clone());
  ring2.material.opacity = 0.2;
  ring2.rotation.x = -Math.PI / 4;
  ring2.rotation.y = Math.PI / 6;
  ring2.position.y = 0.3;
  scene.add(ring2);

  // ---- Particle Cloud ----
  const particleCount = 600;
  const particlePositions = new Float32Array(particleCount * 3);
  const particleSizes = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 1.5 + Math.random() * 3;

    particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
    particlePositions[i * 3 + 2] = r * Math.cos(phi);

    particleSizes[i] = Math.random() * 3 + 1;
  }

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
  particleGeo.setAttribute("size", new THREE.BufferAttribute(particleSizes, 1));

  const particleMat = new THREE.PointsMaterial({
    color: 0xb794f6,
    size: 0.04,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // ---- Floating Diamond Accents ----
  const diamondGeo = new THREE.OctahedronGeometry(0.12, 0);
  const diamondMat = new THREE.MeshBasicMaterial({
    color: 0xa855f7,
    wireframe: true,
    transparent: true,
    opacity: 0.5,
  });

  const diamonds = [];
  for (let i = 0; i < 8; i++) {
    const diamond = new THREE.Mesh(diamondGeo, diamondMat.clone());
    const angle = (i / 8) * Math.PI * 2;
    const r = 2 + Math.random();
    diamond.position.set(
      Math.cos(angle) * r,
      (Math.random() - 0.5) * 3,
      Math.sin(angle) * r
    );
    diamond.userData = { angle, radius: r, speed: 0.2 + Math.random() * 0.3, yOff: diamond.position.y };
    scene.add(diamond);
    diamonds.push(diamond);
  }

  // ---- Mouse tracking ----
  const mouse = { x: 0, y: 0 };

  const handleMouseMove = (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  };
  window.addEventListener("mousemove", handleMouseMove);

  // ---- Resize handling ----
  const handleResize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w === 0 || h === 0) return; // Prevent division by zero and aspect ratio crashes
    camera.aspect = w / h;
    updateCameraX();
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false); // Pass false to prevent overriding responsive CSS styles
  };
  window.addEventListener("resize", handleResize);

  // ---- Animation Loop ----
  const clock = new THREE.Clock();
  let animationId;

  function animate() {
    animationId = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Torso breathing
    torso.rotation.y = t * 0.15;
    torso.scale.y = 1.5 + Math.sin(t * 0.8) * 0.05;

    // Head subtle movement
    head.rotation.y = t * 0.2;
    head.rotation.x = Math.sin(t * 0.5) * 0.1;
    head.position.y = 1.8 + Math.sin(t) * 0.05;

    // Core pulse
    core.scale.setScalar(1 + Math.sin(t * 1.5) * 0.15);
    core.rotation.y = -t * 0.3;
    core.rotation.x = t * 0.2;

    // Ring rotation
    ring1.rotation.z = t * 0.12;
    ring2.rotation.z = -t * 0.08;
    ring1.rotation.y = t * 0.05;

    // Particles slow rotation
    particles.rotation.y = t * 0.03;
    particles.rotation.x = Math.sin(t * 0.1) * 0.05;

    // Diamonds orbit
    diamonds.forEach((d) => {
      const a = d.userData.angle + t * d.userData.speed;
      d.position.x = Math.cos(a) * d.userData.radius;
      d.position.z = Math.sin(a) * d.userData.radius;
      d.position.y = d.userData.yOff + Math.sin(t + d.userData.angle) * 0.3;
      d.rotation.x = t * 0.5;
      d.rotation.z = t * 0.3;
    });

    // Mouse parallax on the whole group
    const targetRotY = mouse.x * 0.3;
    const targetRotX = mouse.y * 0.15;
    scene.rotation.y += (targetRotY - scene.rotation.y) * 0.04;
    scene.rotation.x += (targetRotX - scene.rotation.x) * 0.04;

    // Light follow mouse subtly
    purpleLight.position.x = 2 + mouse.x * 2;
    purpleLight.position.y = 3 + mouse.y * 1;

    renderer.render(scene, camera);
  }

  animate();

  // ---- Cleanup ----
  return () => {
    cancelAnimationFrame(animationId);
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("resize", handleResize);
    renderer.dispose();
    scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else {
          obj.material.dispose();
        }
      }
    });
  };
}
