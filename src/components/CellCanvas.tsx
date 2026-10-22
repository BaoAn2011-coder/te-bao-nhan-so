import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { CELL_PARTS } from '../data/cellData';
import { CellPartInfo } from '../types';

interface CellCanvasProps {
  selectedPart: CellPartInfo | null;
  onSelectPart: (part: CellPartInfo | null) => void;
  visibleParts: Record<string, boolean>;
  cellMode: 'cutaway' | 'intact' | 'exploded';
  crossSectionEnabled: boolean;
  flagellaAnimated: boolean;
  autoRotate: boolean;
  focusMode: boolean;
  onUserInteract: () => void;
}

export const CellCanvas: React.FC<CellCanvasProps> = ({
  selectedPart,
  onSelectPart,
  visibleParts,
  cellMode,
  crossSectionEnabled,
  flagellaAnimated,
  autoRotate,
  focusMode,
  onUserInteract,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cellGroupRef = useRef<THREE.Group | null>(null);

  const meshesRef = useRef<Record<string, THREE.Object3D>>({});
  const flagellaCurvesRef = useRef<{ curve: THREE.CatmullRomCurve3; tube: THREE.Mesh }[]>([]);
  const clockRef = useRef(new THREE.Clock());
  const clippingPlanesRef = useRef<THREE.Plane[]>([]);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf8fafc);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(5.5, 4.5, 7.5);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.localClippingEnabled = true;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Studio Environment & Lighting
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight.position.set(12, 16, 12);
    dirLight.castShadow = !isSoftwareGl;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.7);
    fillLight.position.set(-12, -6, -10);
    scene.add(fillLight);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.rotateSpeed = 0.75;
    controls.minDistance = 4;
    controls.maxDistance = 18;
    controls.minPolarAngle = Math.PI * 0.15;
    controls.maxPolarAngle = Math.PI * 0.85;
    controls.addEventListener('start', () => {
      onUserInteract();
    });
    controlsRef.current = controls;

    // Clipping planes for Cutaway window
    const plane1 = new THREE.Plane(new THREE.Vector3(-0.707, -0.707, 0).normalize(), 0.15);
    const plane2 = new THREE.Plane(new THREE.Vector3(0, -0.4, -0.916).normalize(), 0.15);
    clippingPlanesRef.current = [plane1, plane2];

    // Cell Group with textbook 3/4 angle tilt
    const cellGroup = new THREE.Group();
    cellGroup.rotation.z = Math.PI / 12;
    cellGroup.rotation.y = Math.PI / 5;
    scene.add(cellGroup);
    cellGroupRef.current = cellGroup;

    const radius = 1.55;
    const length = 3.1;

    // --- 1. OUTER MEMBRANE (Màng ngoài) ---
    const outerGeo = new THREE.CapsuleGeometry(radius, length, 24, 48);
    const outerMat = new THREE.MeshPhysicalMaterial({
      color: 0x0891b2,
      roughness: 0.22,
      metalness: 0.12,
      transmission: isSoftwareGl ? 0 : 0.45,
      transparent: true,
      opacity: 0.82,
      ior: 1.45,
      side: THREE.DoubleSide,
      clippingPlanes: clippingPlanesRef.current,
      clipShadows: true,
      depthWrite: false,
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    outerMesh.userData = { id: 'outerMembrane', name: 'Màng ngoài' };
    cellGroup.add(outerMesh);
    meshesRef.current['outerMembrane'] = outerMesh;

    // --- 2. CELL WALL (Thành tế bào) ---
    const wallGeo = new THREE.CapsuleGeometry(radius - 0.16, length, 24, 48);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x047857,
      roughness: 0.45,
      metalness: 0.1,
      transparent: true,
      opacity: 0.95,
      clippingPlanes: clippingPlanesRef.current,
      clipShadows: true,
    });
    const wallMesh = new THREE.Mesh(wallGeo, wallMat);
    wallMesh.userData = { id: 'cellWall', name: 'Thành tế bào' };
    cellGroup.add(wallMesh);
    meshesRef.current['cellWall'] = wallMesh;

    // --- 3. PLASMA MEMBRANE (Màng tế bào) ---
    const plasmaGeo = new THREE.CapsuleGeometry(radius - 0.32, length, 24, 48);
    const plasmaMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.35,
      metalness: 0.15,
      transparent: true,
      opacity: 0.95,
      clippingPlanes: clippingPlanesRef.current,
      clipShadows: true,
    });
    const plasmaMesh = new THREE.Mesh(plasmaGeo, plasmaMat);
    plasmaMesh.userData = { id: 'plasmaMembrane', name: 'Màng tế bào' };
    cellGroup.add(plasmaMesh);
    meshesRef.current['plasmaMembrane'] = plasmaMesh;

    // --- 4. CYTOPLASM (Tế bào chất) ---
    const cytoGeo = new THREE.CapsuleGeometry(radius - 0.4, length - 0.1, 24, 48);
    const cytoMat = new THREE.MeshPhysicalMaterial({
      color: 0xfef08a,
      roughness: 0.25,
      transmission: 0.6,
      transparent: true,
      opacity: 0.88,
      ior: 1.35,
    });
    const cytoMesh = new THREE.Mesh(cytoGeo, cytoMat);
    cytoMesh.userData = { id: 'cytoplasm', name: 'Tế bào chất' };
    cellGroup.add(cytoMesh);
    meshesRef.current['cytoplasm'] = cytoMesh;

    // --- 5. NUCLEOID DNA (Vùng nhân chứa DNA) ---
    const dnaGroup = new THREE.Group();
    dnaGroup.userData = { id: 'nucleoid', name: 'Vùng nhân chứa DNA' };
    const dnaMat = new THREE.MeshStandardMaterial({
      color: 0x7e22ce,
      roughness: 0.28,
      metalness: 0.35,
    });

    const dnaPoints = [];
    for (let i = 0; i < 48; i++) {
      const t = i / 48;
      const angle = t * Math.PI * 9;
      const x = Math.sin(angle) * 0.48 + (Math.random() - 0.5) * 0.1;
      const y = (t - 0.5) * 1.3 + Math.cos(angle * 2) * 0.22;
      const z = Math.cos(angle) * 0.48 + (Math.random() - 0.5) * 0.1;
      dnaPoints.push(new THREE.Vector3(x, y, z));
    }
    const dnaCurve = new THREE.CatmullRomCurve3(dnaPoints);
    const dnaTubeGeo = new THREE.TubeGeometry(dnaCurve, 120, 0.085, 8, false);
    const dnaMesh = new THREE.Mesh(dnaTubeGeo, dnaMat);
    dnaMesh.userData = { id: 'nucleoid', name: 'Vùng nhân chứa DNA' };
    dnaGroup.add(dnaMesh);
    cellGroup.add(dnaGroup);
    meshesRef.current['nucleoid'] = dnaGroup;

    // --- 6. RIBOSOME ---
    const riboGroup = new THREE.Group();
    riboGroup.userData = { id: 'ribosome', name: 'Ribosome' };
    const riboGeo = new THREE.SphereGeometry(0.048, 8, 8);
    const riboMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      roughness: 0.35,
      metalness: 0.1,
    });
    const riboCount = 110;
    const instancedRibo = new THREE.InstancedMesh(riboGeo, riboMat, riboCount);
    const dummy = new THREE.Object3D();

    for (let i = 0; i < riboCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random()) * 0.8;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta) * 1.05;
      const z = r * Math.cos(phi);

      dummy.position.set(x, y, z);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      instancedRibo.setMatrixAt(i, dummy.matrix);
    }
    instancedRibo.instanceMatrix.needsUpdate = true;
    instancedRibo.userData = { id: 'ribosome', name: 'Ribosome' };
    riboGroup.add(instancedRibo);
    cellGroup.add(riboGroup);
    meshesRef.current['ribosome'] = riboGroup;

    // --- 7. PLASMID ---
    const plasmidGroup = new THREE.Group();
    plasmidGroup.userData = { id: 'plasmid', name: 'Plasmid' };
    const plasmidMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      roughness: 0.25,
      metalness: 0.2,
    });
    for (let p = 0; p < 2; p++) {
      const pPoints = [];
      for (let i = 0; i <= 16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        pPoints.push(new THREE.Vector3(
          Math.cos(angle) * 0.2,
          (p === 0 ? 0.65 : -0.65) + Math.sin(angle * 2) * 0.04,
          Math.sin(angle) * 0.2 + (p === 0 ? 0.45 : -0.45)
        ));
      }
      const pCurve = new THREE.CatmullRomCurve3(pPoints, true);
      const pGeo = new THREE.TubeGeometry(pCurve, 32, 0.035, 6, true);
      const pMesh = new THREE.Mesh(pGeo, plasmidMat);
      pMesh.userData = { id: 'plasmid', name: 'Plasmid' };
      plasmidGroup.add(pMesh);
    }
    cellGroup.add(plasmidGroup);
    meshesRef.current['plasmid'] = plasmidGroup;

    // --- 8. PILI (Lông) ---
    const piliGroup = new THREE.Group();
    piliGroup.userData = { id: 'pili', name: 'Lông (Pili)' };
    const piliMat = new THREE.MeshStandardMaterial({
      color: 0x16a34a,
      roughness: 0.45,
    });
    const piliCount = 28;
    for (let i = 0; i < piliCount; i++) {
      const theta = (i / piliCount) * Math.PI * 2 + Math.random() * 0.2;
      const phi = Math.PI * 0.35 + Math.random() * Math.PI * 0.4;
      
      if (Math.sin(theta) > 0.2 && Math.cos(theta) > 0.2) continue;

      const sx = radius * Math.sin(phi) * Math.cos(theta);
      const sy = radius * Math.sin(phi) * Math.sin(theta) * 1.2;
      const sz = radius * Math.cos(phi);

      const start = new THREE.Vector3(sx, sy, sz);
      const dir = start.clone().normalize();
      const end = start.clone().add(dir.multiplyScalar(0.28));

      const pCurve = new THREE.QuadraticBezierCurve3(start, start.clone().add(dir.clone().multiplyScalar(0.18)), end);
      const pTube = new THREE.TubeGeometry(pCurve, 8, 0.018, 5, false);
      const pMesh = new THREE.Mesh(pTube, piliMat);
      pMesh.userData = { id: 'pili', name: 'Lông (Pili)' };
      piliGroup.add(pMesh);
    }
    cellGroup.add(piliGroup);
    meshesRef.current['pili'] = piliGroup;

    // --- 9. FLAGELLA (Roi) ---
    const flagellaGroup = new THREE.Group();
    flagellaGroup.userData = { id: 'flagella', name: 'Roi (Flagellum)' };
    const flagellaMat = new THREE.MeshStandardMaterial({
      color: 0x15803d,
      roughness: 0.35,
    });
    flagellaCurvesRef.current = [];

    const polePos = new THREE.Vector3(0, -radius * 1.1, 0);
    for (let f = 0; f < 2; f++) {
      const fPoints = [];
      const sign = f === 0 ? 1 : -1;
      for (let i = 0; i < 22; i++) {
        const t = i / 21;
        const pt = new THREE.Vector3(
          polePos.x + t * 3.6 * sign + Math.sin(t * Math.PI * 3) * 0.45,
          polePos.y - t * 2.6 - Math.cos(t * Math.PI * 2) * 0.35,
          polePos.z + Math.sin(t * Math.PI * 4) * 0.55
        );
        fPoints.push(pt);
      }
      const curve = new THREE.CatmullRomCurve3(fPoints);
      const tubeGeo = new THREE.TubeGeometry(curve, 40, 0.048, 8, false);
      const tubeMesh = new THREE.Mesh(tubeGeo, flagellaMat);
      tubeMesh.userData = { id: 'flagella', name: 'Roi (Flagellum)' };
      flagellaGroup.add(tubeMesh);
      flagellaCurvesRef.current.push({ curve, tube: tubeMesh });
    }
    cellGroup.add(flagellaGroup);
    meshesRef.current['flagella'] = flagellaGroup;

    // Raycasting (only on visible objects)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      // Only intersect visible meshes
      const visibleChildren = cellGroup.children.filter(c => c.visible);
      const intersects = raycaster.intersectObjects(visibleChildren, true);

      if (intersects.length > 0) {
        let hitObj: THREE.Object3D | null = intersects[0].object;
        while (hitObj && hitObj !== cellGroup && !hitObj.userData?.id) {
          hitObj = hitObj.parent;
        }
        if (hitObj && hitObj.userData?.id) {
          const matchedPart = CELL_PARTS.find(p => p.id === hitObj!.userData.id);
          if (matchedPart) {
            onSelectPart(matchedPart);
          }
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);

    // Resize
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (flagellaAnimated) {
        const time = clockRef.current.getElapsedTime() * 4.5;
        flagellaCurvesRef.current.forEach(({ curve, tube }) => {
          const pts = curve.points;
          for (let i = 1; i < pts.length; i++) {
            const t = i / pts.length;
            pts[i].z += Math.sin(time + t * 9) * 0.012;
            pts[i].x += Math.cos(time * 0.8 + t * 7) * 0.008;
          }
          tube.geometry.dispose();
          tube.geometry = new THREE.TubeGeometry(curve, 40, 0.048, 8, false);
        });
      }

      if (autoRotate && cellGroupRef.current) {
        cellGroupRef.current.rotation.y += 0.003;
      }

      if (controlsRef.current) {
        controlsRef.current.update();
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      container.innerHTML = '';
    };
  }, []);

  // Update visibility, exploded view, and Focus Mode
  useEffect(() => {
    const outer = meshesRef.current['outerMembrane'] as THREE.Mesh;
    const wall = meshesRef.current['cellWall'] as THREE.Mesh;
    const plasma = meshesRef.current['plasmaMembrane'] as THREE.Mesh;

    const activePlanes = cellMode === 'intact' ? [] : clippingPlanesRef.current;
    const explodeOffset = cellMode === 'exploded' ? 0.32 : 0;

    if (outer) {
      if (outer.material instanceof THREE.MeshPhysicalMaterial) {
        outer.material.clippingPlanes = activePlanes;
      }
      outer.scale.set(1 + explodeOffset * 0.8, 1 + explodeOffset * 0.8, 1 + explodeOffset * 0.8);
    }
    if (wall) {
      if (wall.material instanceof THREE.MeshStandardMaterial) {
        wall.material.clippingPlanes = activePlanes;
      }
      wall.scale.set(1 + explodeOffset * 0.4, 1 + explodeOffset * 0.4, 1 + explodeOffset * 0.4);
    }
    if (plasma) {
      if (plasma.material instanceof THREE.MeshStandardMaterial) {
        plasma.material.clippingPlanes = activePlanes;
      }
      plasma.scale.set(1 + explodeOffset * 0.15, 1 + explodeOffset * 0.15, 1 + explodeOffset * 0.15);
    }

    if (outer && outer.material instanceof THREE.MeshPhysicalMaterial) {
      outer.material.opacity = crossSectionEnabled ? 0.22 : (cellMode === 'intact' ? 0.9 : 0.82);
    }

    // Apply Visibility & Focus Mode
    CELL_PARTS.forEach((part) => {
      const obj = meshesRef.current[part.id];
      if (obj) {
        if (focusMode) {
          // In focus mode, only show the selected part
          obj.visible = selectedPart?.id === part.id;
        } else {
          // Normal mode respects manual visibility
          const userVisible = visibleParts[part.id] ?? true;
          obj.visible = userVisible;
        }
      }
    });
  }, [cellMode, crossSectionEnabled, visibleParts, focusMode, selectedPart]);

  // Selection highlight
  useEffect(() => {
    Object.values(meshesRef.current).forEach((obj) => {
      if (obj && obj instanceof THREE.Mesh && obj.material) {
        if ('emissive' in obj.material) {
          (obj.material as THREE.MeshStandardMaterial).emissive.setHex(0x000000);
        }
      }
    });

    if (selectedPart && meshesRef.current[selectedPart.id]) {
      const obj = meshesRef.current[selectedPart.id];
      if (obj instanceof THREE.Mesh && obj.material && 'emissive' in obj.material) {
        (obj.material as THREE.MeshStandardMaterial).emissive.setHex(0x333333);
      } else if (obj instanceof THREE.Group) {
        obj.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material && 'emissive' in child.material) {
            (child.material as THREE.MeshStandardMaterial).emissive.setHex(0x442244);
          }
        });
      }
    }
  }, [selectedPart]);

  return <div ref={mountRef} className="w-full h-full relative cursor-grab active:cursor-grabbing" />;
};
