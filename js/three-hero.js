/**
 * 3D Interactive Hero Canvas
 * Lightweight, high-performance WebGL geometry reacting to cursor movement.
 */

export function initHero3D() {
  const container = document.getElementById('hero-3d-wrapper');
  if (!container || !window.THREE) return;

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 4.2;

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Group for rotation
  const mainGroup = new THREE.Group();
  scene.add(mainGroup);

  // 1. Inner Wireframe Icosahedron
  const icoGeometry = new THREE.IcosahedronGeometry(1.6, 2);
  const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0x9333ea,
    wireframe: true,
    transparent: true,
    opacity: 0.35
  });
  const icoMesh = new THREE.Mesh(icoGeometry, wireframeMaterial);
  mainGroup.add(icoMesh);

  // 2. Outer Point Cloud / Constellation
  const particleCount = 280;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const color1 = new THREE.Color(0xa855f7); // Purple
  const color2 = new THREE.Color(0x06b6d4); // Cyan
  const color3 = new THREE.Color(0x3b82f6); // Blue

  for (let i = 0; i < particleCount; i++) {
    const radius = 1.9 + Math.random() * 0.9;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);

    // Mixed glowing colors
    const ratio = Math.random();
    let pickedColor = color1;
    if (ratio > 0.66) pickedColor = color2;
    else if (ratio > 0.33) pickedColor = color3;

    colors[i * 3] = pickedColor.r;
    colors[i * 3 + 1] = pickedColor.g;
    colors[i * 3 + 2] = pickedColor.b;
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.045,
    vertexColors: true,
    transparent: true,
    opacity: 0.85
  });

  const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
  mainGroup.add(particleSystem);

  // 3. Glowing Torus Ring
  const ringGeometry = new THREE.TorusGeometry(2.4, 0.02, 16, 100);
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0x06b6d4,
    transparent: true,
    opacity: 0.35
  });
  const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
  ringMesh.rotation.x = Math.PI / 3;
  mainGroup.add(ringMesh);

  // Mouse Parallax
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  const onMouseMove = (event) => {
    mouseX = (event.clientX - windowHalfX) * 0.001;
    mouseY = (event.clientY - windowHalfY) * 0.001;
  };

  window.addEventListener('mousemove', onMouseMove, { passive: true });

  // Resize Handler
  const onWindowResize = () => {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };

  window.addEventListener('resize', onWindowResize);

  // Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Constant subtle ambient rotation
    icoMesh.rotation.y = elapsedTime * 0.12;
    icoMesh.rotation.x = elapsedTime * 0.08;

    particleSystem.rotation.y = -elapsedTime * 0.06;
    ringMesh.rotation.z = elapsedTime * 0.15;

    // Smooth cursor interpolation
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    mainGroup.rotation.y = targetX * 1.2 + elapsedTime * 0.08;
    mainGroup.rotation.x = targetY * 1.2;

    renderer.render(scene, camera);
  }

  animate();
}
