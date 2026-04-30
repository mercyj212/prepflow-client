import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// Scene Setup — Daytime City Highway
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87b8d8); // Clear daylight sky
scene.fog = new THREE.Fog(0xc8dde8, 80, 280); // Linear depth fog

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 300);

// Performance-first renderer — minimal WebGL context footprint
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: 'high-performance',
  failIfMajorPerformanceCaveat: false 
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
const root = document.getElementById('root') ?? document.body;
root.appendChild(renderer.domElement);

// Procedural Audio System
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let engineOsc, windNoise, masterGain;

function initAudio() {
  if (masterGain) return;
  masterGain = audioCtx.createGain();
  masterGain.connect(audioCtx.destination);
  masterGain.gain.value = 0.3;

  // Engine Drone
  engineOsc = audioCtx.createOscillator();
  engineOsc.type = 'sawtooth';
  const engineGain = audioCtx.createGain();
  const engineFilter = audioCtx.createBiquadFilter();
  engineFilter.type = 'lowpass';
  engineFilter.frequency.value = 400;
  
  engineOsc.connect(engineFilter);
  engineFilter.connect(engineGain);
  engineGain.connect(masterGain);
  engineGain.gain.value = 0.1;
  engineOsc.start();

  // Wind Noise
  const bufferSize = 2 * audioCtx.sampleRate,
  noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate),
  output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) { output[i] = Math.random() * 2 - 1; }
  
  windNoise = audioCtx.createBufferSource();
  windNoise.buffer = noiseBuffer;
  windNoise.loop = true;
  const windFilter = audioCtx.createBiquadFilter();
  windFilter.type = 'lowpass';
  windFilter.frequency.value = 500;
  const windGain = audioCtx.createGain();
  
  windNoise.connect(windFilter);
  windFilter.connect(windGain);
  windGain.connect(masterGain);
  windGain.gain.value = 0.05;
  windNoise.start();
  
  window.audioData = { engineFilter, engineGain, engineOsc, windFilter, windGain };
}

function playSFX(freq, type, duration) {
  if (!masterGain) return;
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(10, audioCtx.currentTime + duration);
  g.gain.setValueAtTime(0.2, audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
  osc.connect(g);
  g.connect(masterGain);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

// WebGL context loss recovery
renderer.domElement.addEventListener('webglcontextlost', (e) => {
  e.preventDefault();
  console.warn('WebGL context lost — close other WebGL tabs and refresh.');
  const msg = document.createElement('div');
  msg.style.cssText = 'position:fixed;inset:0;background:#000;color:#fff;display:flex;align-items:center;justify-content:center;z-index:9999;font-family:monospace;font-size:1.2rem;text-align:center;padding:2rem;';
  msg.innerHTML = '<div><b style="color:#ff4444">WEBGL CONTEXT LOST</b><br><br>Close other browser tabs then<br><br><button onclick="location.reload()" style="padding:1rem 2rem;background:#fff;color:#000;border:none;cursor:pointer;font-weight:900;font-size:1rem;">RELOAD GAME</button></div>';
  document.body.appendChild(msg);
}, false);
renderer.domElement.addEventListener('webglcontextrestored', () => {
  console.log('WebGL context restored.');
  renderer.setAnimationLoop(animate);
}, false);

// Post-processing — Clean Cinematic Polish
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.15, // Subtle Strength for a clean look
  0.05, // Tight Radius
  0.92  // High Threshold to only catch bright highlights
);

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

// Procedural Asphalt Texture — Grounded & Realistic
function createAsphaltTexture() {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Base asphalt gray
    ctx.fillStyle = '#2a2a2d';
    ctx.fillRect(0, 0, size, size);
    
    // Grain noise
    for (let i = 0; i < 40000; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const v = Math.random() * 15;
        ctx.fillStyle = `rgb(${35+v},${35+v},${38+v})`;
        ctx.fillRect(x, y, 1, 1);
    }
    
    // Subtle lane wear (darker streaks where tires go)
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(size * 0.1, 0, size * 0.25, size);
    ctx.fillRect(size * 0.65, 0, size * 0.25, size);
    
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 1000); 
    return tex;
}

// Road: Dark asphalt with noise
const roadMaterial = new THREE.MeshStandardMaterial({ 
  map: createAsphaltTexture(),
  color: 0xffffff,
  roughness: 0.9,
  metalness: 0.05
});
// Urban concrete ground
const grassMaterial = new THREE.MeshStandardMaterial({ color: 0x6b7a5a, roughness: 1.0 });

// Modern Daytime Cityscape — InstancedMesh for performance
function createCityscape() {
  const geo = new THREE.BoxGeometry(1, 1, 1);
  const count = 50;

  // Three layers of instanced buildings with different materials
  const mats = [
    new THREE.MeshStandardMaterial({ color: 0xc8c4bc, roughness: 0.8 }), // concrete
    new THREE.MeshStandardMaterial({ color: 0x9ab0c4, roughness: 0.2, metalness: 0.5 }), // glass
    new THREE.MeshStandardMaterial({ color: 0xddd8d0, roughness: 0.9 }), // light stone
  ];

  mats.forEach((mat, mi) => {
    const inst = new THREE.InstancedMesh(geo, mat, Math.ceil(count / 3));
    inst.frustumCulled = true;
    const dummy = new THREE.Object3D();
    const perMat = Math.ceil(count / 3);
    for (let i = 0; i < perMat; i++) {
      const w = 12 + Math.random() * 22;
      const h = 20 + Math.random() * 60;
      const d = 12 + Math.random() * 22;
      const side = (i + mi) % 2 === 0 ? 1 : -1;
      dummy.position.set(
        side * (55 + Math.random() * 80),
        h / 2,
        -100 - mi * 60 - i * 35
      );
      dummy.scale.set(w, h, d);
      dummy.updateMatrix();
      inst.setMatrixAt(i, dummy.matrix);
    }
    inst.instanceMatrix.needsUpdate = true;
    scene.add(inst);
  });
}
createCityscape();


// Grounded Daylight Lighting
const ambientLight = new THREE.AmbientLight(0xe8f0f8, 0.8); // Softer fill
scene.add(ambientLight);

const hemiLight = new THREE.HemisphereLight(0xd8e8f8, 0x3d3d2d, 0.6); // Sky to Ground gradient
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xfff5e6, 1.8); // Warm morning sun
dirLight.position.set(100, 150, 80);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 1024;
dirLight.shadow.mapSize.height = 1024;
dirLight.shadow.camera.left = -50;
dirLight.shadow.camera.right = 50;
dirLight.shadow.camera.top = 50;
dirLight.shadow.camera.bottom = -50;
scene.add(dirLight);

const fillLight = new THREE.DirectionalLight(0xaac8e8, 0.4); // Cool side fill
fillLight.position.set(-40, 20, -30);
scene.add(fillLight);

// Ground — urban grass median
const groundGeo = new THREE.PlaneGeometry(400, 1200);
const ground = new THREE.Mesh(groundGeo, grassMaterial);
ground.name = 'ground';
ground.rotation.x = -Math.PI / 2;
ground.position.set(0, -0.05, -100);
scene.add(ground);

// Road
const roadLength = 6000; // Expanded for 60-question campaign
const roadWidth = 16; // Wider for 4 lanes + shoulders
const roadGeo = new THREE.PlaneGeometry(roadWidth, roadLength);
const road = new THREE.Mesh(roadGeo, roadMaterial);
road.name = 'road';
road.rotation.x = -Math.PI / 2;
road.position.set(0, 0.01, -roadLength / 2 + 50);
road.receiveShadow = true;
scene.add(road);

// Road Shoulders (Breakdown lanes)
const shoulderMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1c, roughness: 1.0 });
const shoulderGeo = new THREE.PlaneGeometry(1.5, roadLength);
[-1, 1].forEach(s => {
    const shoulder = new THREE.Mesh(shoulderGeo, shoulderMat);
    shoulder.rotation.x = -Math.PI / 2;
    shoulder.position.set(s * (roadWidth / 2 + 0.75), 0.005, -roadLength / 2 + 50);
    scene.add(shoulder);
});

// Improved Jersey Barriers (Instanced for performance)
const barrierMat = new THREE.MeshStandardMaterial({ color: 0x9c9890, roughness: 0.85 });
const barrierGeo = new THREE.BoxGeometry(0.5, 1.1, 4);
const barrierCount = 750;
const barriersInst = new THREE.InstancedMesh(barrierGeo, barrierMat, barrierCount * 2);
const dummyB = new THREE.Object3D();

for (let i = 0; i < barrierCount; i++) {
  for (let s = -1; s <= 1; s += 2) {
    dummyB.position.set(s * (roadWidth / 2 + 0.3), 0.55, -i * 4);
    dummyB.updateMatrix();
    barriersInst.setMatrixAt(i * 2 + (s === 1 ? 1 : 0), dummyB.matrix);
  }
}
barriersInst.instanceMatrix.needsUpdate = true;
scene.add(barriersInst);

// Road Markings (Technical Real-world Highway Pattern)
const laneMarkingsGroup = new THREE.Group();
scene.add(laneMarkingsGroup);

const markerMatWhite = new THREE.MeshBasicMaterial({ color: 0xffffff });
const markerMatYellow = new THREE.MeshBasicMaterial({ color: 0xffd700 });

// Left Edge (Yellow Median)
const leftEdgeGeo = new THREE.PlaneGeometry(0.2, roadLength);
const leftEdge = new THREE.Mesh(leftEdgeGeo, markerMatYellow);
leftEdge.rotation.x = -Math.PI / 2;
leftEdge.position.set(-roadWidth / 2 + 0.4, 0.06, -roadLength / 2 + 50);
laneMarkingsGroup.add(leftEdge);

// Right Edge (Solid White Shoulder)
const rightEdgeGeo = new THREE.PlaneGeometry(0.2, roadLength);
const rightEdge = new THREE.Mesh(rightEdgeGeo, markerMatWhite);
rightEdge.rotation.x = -Math.PI / 2;
rightEdge.position.set(roadWidth / 2 - 0.4, 0.06, -roadLength / 2 + 50);
laneMarkingsGroup.add(rightEdge);

// 4 Lanes (3 Dash Lines)
const lanePositions = [-4, 0, 4];
lanePositions.forEach((xPos, idx) => {
    const dashCount = 150;
    for (let i = 0; i < dashCount; i++) {
        const dashGeo = new THREE.PlaneGeometry(0.15, 6);
        const dash = new THREE.Mesh(dashGeo, markerMatWhite);
        dash.rotation.x = -Math.PI / 2;
        dash.position.set(xPos, 0.05, 50 - i * 20);
        laneMarkingsGroup.add(dash);
        
        // Add reflective cat's eyes every other dash
        if (i % 2 === 0) {
            const eyeGeo = new THREE.BoxGeometry(0.12, 0.08, 0.12);
            const eyeMat = new THREE.MeshBasicMaterial({ color: idx === 0 ? 0xffd700 : 0xffffff });
            const eye = new THREE.Mesh(eyeGeo, eyeMat);
            eye.position.set(xPos, 0.08, 50 - i * 20 + 3.5);
            laneMarkingsGroup.add(eye);
        }
    }
});

// Refined Streetlights (Instanced Mesh)
const poleGeo = new THREE.CylinderGeometry(0.1, 0.15, 8, 8);
const poleMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.8, roughness: 0.2 });
const armGeo = new THREE.BoxGeometry(2, 0.1, 0.1);
const lampGeo = new THREE.BoxGeometry(0.6, 0.2, 0.4);
const lampMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
const glowMat = new THREE.MeshBasicMaterial({ color: 0xffffee });
const glowGeo = new THREE.PlaneGeometry(0.5, 0.3);

const lightPoleInst = new THREE.InstancedMesh(poleGeo, poleMat, 150);
const lightArmInst = new THREE.InstancedMesh(armGeo, poleMat, 150);
const lightLampInst = new THREE.InstancedMesh(lampGeo, lampMat, 150);

const dummyL = new THREE.Object3D();

for (let i = 0; i < 75; i++) {
    // Alternate sides
    const side = (i % 2 === 0) ? -1 : 1;
    const z = -i * 40;
    
    // Pole
    dummyL.position.set(side * (roadWidth / 2 + 2.5), 4, z);
    dummyL.updateMatrix();
    lightPoleInst.setMatrixAt(i, dummyL.matrix);
    
    // Arm
    dummyL.position.set(side * (roadWidth / 2 + 1.6), 8, z);
    dummyL.rotation.z = 0;
    dummyL.updateMatrix();
    lightArmInst.setMatrixAt(i, dummyL.matrix);
    
    // Lamp
    dummyL.position.set(side * (roadWidth / 2 + 0.7), 7.9, z);
    dummyL.updateMatrix();
    lightLampInst.setMatrixAt(i, dummyL.matrix);
    
    // Real light glow (visual only)
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.rotation.x = Math.PI / 2;
    glow.position.set(side * (roadWidth / 2 + 0.7), 7.75, z);
    scene.add(glow);
}
lightPoleInst.instanceMatrix.needsUpdate = true;
lightArmInst.instanceMatrix.needsUpdate = true;
lightLampInst.instanceMatrix.needsUpdate = true;
scene.add(lightPoleInst, lightArmInst, lightLampInst);

// Overhead Highway Signs
const signPostGeo = new THREE.BoxGeometry(0.4, 12, 0.4);
const signBoardGeo = new THREE.PlaneGeometry(8, 3);
const signMat = new THREE.MeshStandardMaterial({ color: 0x004d26, roughness: 0.5 }); // Highway Green

for (let i = 0; i < 10; i++) {
    const z = -450 - i * 600;
    const postL = new THREE.Mesh(signPostGeo, poleMat);
    postL.position.set(-roadWidth / 2 - 2, 6, z);
    scene.add(postL);
    
    const postR = postL.clone();
    postR.position.x = roadWidth / 2 + 2;
    scene.add(postR);
    
    const beamGeo = new THREE.BoxGeometry(roadWidth + 4, 0.3, 0.3);
    const beam = new THREE.Mesh(beamGeo, poleMat);
    beam.position.set(0, 11, z);
    scene.add(beam);
    
    const board = new THREE.Mesh(signBoardGeo, signMat);
    board.position.set(0, 9, z + 0.2);
    scene.add(board);
}



// Checkpoint zones on road (Scaled for 3000m road)
// Educational Question Pool (SAT/Prep Style)
const questionPool = {
    basic: [
        { q: "Solve: 15 + 27", a: ["32", "42", "45", "52"], c: 1 },
        { q: "Which word is a synonym for 'Happy'?", a: ["Gloomy", "Cheerful", "Bored", "Angry"], c: 1 },
        { q: "What is 10% of 500?", a: ["5", "50", "100", "500"], c: 1 },
        { q: "Identify the noun: 'The blue car drove fast.'", a: ["Blue", "Fast", "Car", "Drove"], c: 2 },
        { q: "Complete: 2, 4, 8, 16, ...", a: ["24", "32", "20", "64"], c: 1 },
        { q: "What is 3 squared plus 4 squared?", a: ["7", "12", "25", "49"], c: 2 },
        { q: "Which of these is an even number?", a: ["13", "27", "42", "55"], c: 2 },
        { q: "Antonym of 'Hot'?", a: ["Warm", "Cold", "Burning", "Spicy"], c: 1 },
        { q: "How many sides does a hexagon have?", a: ["5", "6", "7", "8"], c: 1 },
        { q: "Identify the verb: 'She jumped over the fence.'", a: ["Fence", "Jumped", "Over", "She"], c: 1 },
        { q: "Simplify: 40 / 5 + 2", a: ["8", "10", "6", "12"], c: 1 }
    ],
    advanced: [
        { q: "If x + 7 = 15, what is the value of x^2?", a: ["64", "49", "81", "121"], c: 0 },
        { q: "Which word is a synonym for 'Abundant'?", a: ["Scarce", "Plentiful", "Sparse", "Rare"], c: 1 },
        { q: "What is the area of a circle with radius 3? (Approx)", a: ["18.8", "28.3", "9.4", "12.6"], c: 1 },
        { q: "Complete the analogy: Book is to Read as Fork is to...", a: ["Drink", "Cut", "Eat", "Wash"], c: 2 },
        { q: "Which of these is a prime number?", a: ["15", "21", "29", "33"], c: 2 },
        { q: "What is the square root of 225?", a: ["13", "14", "15", "16"], c: 2 },
        { q: "Solve for y: 3y - 9 = 21", a: ["8", "10", "12", "6"], c: 1 },
        { q: "Who wrote 'Hamlet'?", a: ["Dickens", "Twain", "Shakespeare", "Homer"], c: 2 },
        { q: "What is the chemical symbol for Gold?", a: ["Ag", "Fe", "Au", "Pb"], c: 2 },
        { q: "Convert 2/5 to a percentage.", a: ["20%", "40%", "50%", "25%"], c: 1 },
        { q: "What is the slope of the line y = 3x - 5?", a: ["-5", "3", "-3", "5"], c: 1 },
        { q: "Which word means 'to move away from'?", a: ["Accede", "Recede", "Proceed", "Concede"], c: 1 },
        { q: "If a triangle has angles 40 and 60, what is the third angle?", a: ["80", "90", "100", "70"], c: 0 },
        { q: "What is the main gas in Earth's atmosphere?", a: ["Oxygen", "Nitrogen", "Carbon", "Argon"], c: 1 },
        { q: "Solve: 2^4 - 2^3", a: ["8", "16", "4", "12"], c: 0 },
        { q: "Identify the figure of speech: 'The wind whispered.'", a: ["Simile", "Metaphor", "Personification", "Hyperbole"], c: 2 }
    ]
};

const checkpointColors = [0x6C63FF, 0xFF6584, 0x43E8B1, 0xFFBE0B, 0x3A86FF, 0x00d4ff, 0xff0055, 0x6C63FF, 0xFFBE0B, 0x43E8B1];
// 20 Checkpoints spaced every 280m
const checkpointPositions = [];
for (let i = 1; i <= 20; i++) checkpointPositions.push(-i * 280);
const checkpoints = [];

checkpointPositions.forEach((zPos, idx) => {
  // Side marker pillars
  const pillarGeo = new THREE.BoxGeometry(0.8, 4.5, 0.8);
  const pillarMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.1 });
  const pillarL = new THREE.Mesh(pillarGeo, pillarMat);
  pillarL.name = `checkpointPillarLeft_${idx}`;
  pillarL.position.set(-roadWidth / 2 - 1.2, 2.25, zPos);
  scene.add(pillarL);

  const pillarR = pillarL.clone();
  pillarR.name = `checkpointPillarRight_${idx}`;
  pillarR.position.set(roadWidth / 2 + 1.2, 2.25, zPos);
  scene.add(pillarR);

  // TOP ARCH
  const archGeo = new THREE.BoxGeometry(roadWidth + 3.5, 0.6, 1.2);
  const archMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 1.0, roughness: 0.05 });
  const arch = new THREE.Mesh(archGeo, archMat);
  arch.name = `checkpointArch_${idx}`;
  arch.position.set(0, 4.5, zPos);
  scene.add(arch);

  // DATA CURTAIN (Visual Feedback)
  const curtainGeo = new THREE.PlaneGeometry(roadWidth - 0.8, 4.5);
  const curtainMat = new THREE.MeshBasicMaterial({ 
    color: checkpointColors[idx % checkpointColors.length], 
    transparent: true, 
    opacity: 0.15, 
    side: THREE.DoubleSide 
  });
  const curtain = new THREE.Mesh(curtainGeo, curtainMat);
  curtain.position.set(0, 2.25, zPos);
  scene.add(curtain);

  checkpoints.push({ arch, z: zPos, color: checkpointColors[idx % checkpointColors.length], curtain });
});

// Loading Manager UI
const loadingStatus = document.getElementById('loading-status');
const startBtn = document.getElementById('start-btn');
const startOverlay = document.getElementById('start-overlay');
const crashOverlay = document.getElementById('crash-overlay');

const loadingManager = new THREE.LoadingManager();
loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    const progress = Math.round((itemsLoaded / itemsTotal) * 100);
    if (loadingStatus) loadingStatus.textContent = `LOADING ASSETS: ${progress}%`;
};
loadingManager.onLoad = () => {
    if (loadingStatus) loadingStatus.textContent = "SYSTEMS ONLINE";
    if (startBtn) startBtn.style.display = "block";
};

const carGroup = new THREE.Group();
carGroup.name = 'car';
carGroup.position.set(0, 0, 10);
scene.add(carGroup);

// Speed Ground Trails (Motion Blur Planes)
const trails = [];
for (let i = 0; i < 20; i++) {
    const tGeo = new THREE.PlaneGeometry(0.1, 5);
    const tMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 });
    const t = new THREE.Mesh(tGeo, tMat);
    t.rotation.x = -Math.PI / 2;
    t.position.set((Math.random() - 0.5) * roadWidth, 0.08, carGroup.position.z - Math.random() * 200);
    scene.add(t);
    trails.push(t);
}

// Load Sports Car Model
const loader = new GLTFLoader(loadingManager);
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
loader.setDRACOLoader(dracoLoader);

let carModel = null;
const carUrl = 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/ferrari.glb';

loader.load(carUrl, (gltf) => {
  carModel = gltf.scene;
  carModel.rotation.y = 0; // REVERTED TO DEFAULT (Facing forward into -Z)
  carModel.scale.set(1, 1, 1);

  // High-Fidelity Lights for Main Car (Visibility Fix)
  const headL = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.15, 0.1), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1.0 }));
  headL.position.set(0.8, 0.5, -2.2);
  carModel.add(headL);
  const headR = headL.clone(); headR.position.x = -0.8;
  carModel.add(headR);

  // REAL LIGHT BEAMS (Subtle for Reading)
  const headlight = new THREE.SpotLight(0xfff5e6, 12, 60, Math.PI / 4, 0.3, 1);
  headlight.position.set(0, 0.5, -2.2);
  headlight.target.position.set(0, 0, -20);
  carModel.add(headlight);
  carModel.add(headlight.target);

  // NEON UNDERGLOW (Toned Down)
  // NO UNDERGLOW for grounded look

  const tailL = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.2, 0.1), new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 1.0 }));
  tailL.position.set(0.8, 0.5, 2.2);
  carModel.add(tailL);
  const tailR = tailL.clone(); tailR.position.x = -0.8;
  carModel.add(tailR);

  // EXHAUST FLAMES (Arcade Pulse)
  const exhaustGeo = new THREE.CylinderGeometry(0.1, 0, 1.5, 8);
  const exhaustMat = new THREE.MeshStandardMaterial({ 
    color: 0xffaa00, 
    emissive: 0xffaa00, 
    emissiveIntensity: 0.5,
    transparent: true,
    opacity: 0.8
  });
  
  const exhL = new THREE.Mesh(exhaustGeo, exhaustMat);
  exhL.position.set(0.6, 0.4, 2.5);
  exhL.rotation.x = -Math.PI / 2;
  exhL.name = 'exhaust_left';
  carModel.add(exhL);
  
  const exhR = exhL.clone();
  exhR.position.x = -0.6;
  exhR.name = 'exhaust_right';
  carModel.add(exhR);
  carModel.traverse((node) => {
    if (node.isMesh) {
      node.castShadow = true;
      node.receiveShadow = true;
      if (node.name.includes('body')) {
        node.material = new THREE.MeshStandardMaterial({
          color: 0xaa0000, // Deep Premium Red
          metalness: 1.0,
          roughness: 0.02,
          envMapIntensity: 2.5
        });
      }
    }
  });
  carGroup.add(carModel);
  carModel.name = 'playerMesh'; // Tag for swapping
  // Optimization: Cache parts for animation
  carGroup.userData.exhL = exhL;
  carGroup.userData.exhR = exhR;
  carGroup.userData.body = carModel.getObjectByName('carBody') || carModel;
  console.log('Main Car Loaded');
});

// Load Custom Traffic Model Templates
const trafficTemplates = [];
const modelPaths = [
  'prepdrive-assets/models/Car.glb',
  'prepdrive-assets/models/CAR Model.glb',
  'prepdrive-assets/models/jeep wrangler adventure rubicon001.glb'
];

const levelThemes = [
  {
    sky: 0x87b8d8,
    fog: 0xc8dde8,
    ground: 0x6b7a5a,
    road: 0x2a2a2d,
    sign: 0x004d26,
    trafficColors: [0x0a0a0a, 0x8a8d8f, 0xffffff, 0x0a1c3b],
    trafficTypes: ['sedan', 'hatchback', 'premium'],
    buildings: [0xc8c4bc, 0x9ab0c4, 0xddd8d0]
  },
  {
    sky: 0xff7f54,
    fog: 0xffd0a3,
    ground: 0x2d5a3d,
    road: 0x242326,
    sign: 0x763400,
    trafficColors: [0xffc857, 0xff6b35, 0x2ec4b6, 0xf7fff7],
    trafficTypes: ['hatchback', 'sedan', 'premium'],
    buildings: [0xd9a066, 0xffc857, 0x8d6e63]
  },
  {
    sky: 0x0a1028,
    fog: 0x1b2a4a,
    ground: 0x141820,
    road: 0x111116,
    sign: 0x1e3a8a,
    trafficColors: [0x6c63ff, 0x43e8b1, 0xff2e63, 0xeef2ff],
    trafficTypes: ['premium', 'suv', 'sedan'],
    buildings: [0x1e293b, 0x334155, 0x0f766e]
  },
  {
    sky: 0xb9f6ff,
    fog: 0xe0fbff,
    ground: 0xb7c7a3,
    road: 0x3b3a36,
    sign: 0x26532b,
    trafficColors: [0x2f6690, 0xf2c14e, 0xf78154, 0x4f772d],
    trafficTypes: ['suv', 'hatchback', 'sedan'],
    buildings: [0x8ecae6, 0x219ebc, 0xffb703]
  },
  {
    sky: 0x160f29,
    fog: 0x302b63,
    ground: 0x0b132b,
    road: 0x09090b,
    sign: 0x3a0ca3,
    trafficColors: [0xf72585, 0x7209b7, 0x4cc9f0, 0xffffff],
    trafficTypes: ['premium', 'premium', 'suv'],
    buildings: [0x240046, 0x5a189a, 0x4cc9f0]
  }
];

let levelCityGroup = null;
let activeTrafficColors = null;
let activeTrafficTypes = null;

function applyLevelTheme(level) {
  const theme = levelThemes[(level - 1) % levelThemes.length];
  activeTrafficColors = theme.trafficColors;
  activeTrafficTypes = theme.trafficTypes;

  scene.background = new THREE.Color(theme.sky);
  if (scene.fog) scene.fog.color.setHex(theme.fog);
  roadMaterial.color.setHex(theme.road);
  grassMaterial.color.setHex(theme.ground);
  signMat.color.setHex(theme.sign);

  if (levelCityGroup) scene.remove(levelCityGroup);
  levelCityGroup = new THREE.Group();
  levelCityGroup.name = `level-city-${level}`;

  const buildingGeo = new THREE.BoxGeometry(1, 1, 1);
  for (let i = 0; i < 36; i++) {
    const side = i % 2 === 0 ? -1 : 1;
    const height = 18 + ((i + level) % 7) * 8;
    const width = 10 + ((i + level) % 4) * 4;
    const depth = 10 + ((i + level) % 3) * 6;
    const color = theme.buildings[i % theme.buildings.length];
    const building = new THREE.Mesh(
      buildingGeo,
      new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: level >= 3 ? 0.35 : 0.1 })
    );
    building.position.set(side * (55 + (i % 5) * 12), height / 2, -80 - i * 45);
    building.scale.set(width, height, depth);
    levelCityGroup.add(building);
  }

  scene.add(levelCityGroup);
}

function setPlayerCar(level) {
    // Remove existing model
    carGroup.children.forEach(child => {
        if (child.name === 'playerMesh') carGroup.remove(child);
    });

    let playerMesh;
    const colors = activeTrafficColors || [0xaa0000, 0x8a8d8f, 0x0a0a0a, 0x0a1c3b, 0x3a3d40];
    const types = ['premium', 'sedan', 'suv', 'premium', 'hatchback'];
    
    if (level === 1 && carModel) {
        playerMesh = carModel.clone();
    } else {
        // Create high-end procedural version for player
        const type = types[(level - 1) % types.length];
        playerMesh = createTrafficVehicle(type);
        
        // Upgrade to "Player Grade" materials
        playerMesh.traverse(node => {
            if (node.isMesh && node.material) {
                node.material = new THREE.MeshStandardMaterial({
                    color: colors[(level - 1) % colors.length],
                    metalness: 1.0,
                    roughness: 0.05,
                    envMap: scene.environment,
                    envMapIntensity: 2.0
                });
            }
        });
    }

    playerMesh.name = 'playerMesh';
    carGroup.add(playerMesh);
    
    // Update animation references
    const exhL = playerMesh.getObjectByName('exhaust_left') || playerMesh.userData.wheels?.[0];
    const exhR = playerMesh.getObjectByName('exhaust_right') || playerMesh.userData.wheels?.[1];
    carGroup.userData.exhL = exhL;
    carGroup.userData.exhR = exhR;
}

// Optimization: EnvMap support for traffic models
trafficTemplates.forEach(model => {
    model.traverse(node => {
      if (node.isMesh && node.material) {
        node.material.envMap = scene.environment;
        node.material.envMapIntensity = 1.5;
      }
    });
});

// Start Game Handler
let isGameActive = false;
let correctAnswers = 0;
startBtn.onclick = () => {
    initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    startOverlay.style.display = 'none';
    isGameActive = true;
    startTime = Date.now();
};

function resetGame(keepScore = false) {
    // Comprehensive State Cleanup
    isGameActive = false;
    isLevelFinishing = false;
    carSpeed = 0;
    sideVelocity = 0;
    carGroup.position.set(0, 0, 10);
    carGroup.rotation.set(0, 0, 0);
    checkpointCount = 1;

    applyLevelTheme(currentLevel);
    // Swap Vehicle for Level Variety
    setPlayerCar(currentLevel);
    
    // Reset Timer
    timeRemaining = timePerLevel[currentLevel - 1];

    // Reset Camera
    cameraOffset.set(0, 6, 14);

    // Remove Visual Remnants
    if (finishZone) {
        scene.remove(finishZone);
        finishZone = null;
    }
    if (celebrationParticles) {
        scene.remove(celebrationParticles);
        celebrationParticles = null;
    }
    document.querySelectorAll('div').forEach(div => {
        if (div.textContent === "CONGRATULATIONS" || div.textContent === "MISSION COMPLETE") div.remove();
    });

    if (!keepScore) {
        currentScore = 0;
        correctAnswers = 0;
        currentLevel = 1;
    }
    levelAnswers = 0; 
    levelMistakes = 0;
    lives = 3;
    passedCheckpoints.clear();
    
    // Reposition traffic with granular difficulty scaling
    const speedScale = 1 + (currentLevel - 1) * 0.12;
    const poolScale = Math.min(6 + (currentLevel - 1), 12);
    
    trafficCars.forEach(tc => scene.remove(tc.mesh));
    trafficCars.length = 0;
    for (let i = 0; i < poolScale; i++) spawnTraffic(-100 - i * 40);

    trafficCars.forEach((tc) => {
        tc.speed *= speedScale;
    });

    // Reset HUD
    updateLivesHUD();
    updateMasteryBadges();
    statScore.textContent = keepScore ? currentScore.toLocaleString() : '0';
    if (statLevel) statLevel.textContent = currentLevel;
    if (statUnitCurrent) statUnitCurrent.textContent = levelAnswers;
    if (statUnitTotal) statUnitTotal.textContent = questionsPerLevel[currentLevel - 1];
    if (progressBar) progressBar.style.width = '0%';
    
    // Remove Overlays
    const gameOverOverlay = document.getElementById('game-over-overlay');
    if (gameOverOverlay) gameOverOverlay.remove();
    const winOverlay = document.getElementById('win-overlay');
    if (winOverlay) winOverlay.remove();
    
    crashOverlay.style.display = 'none';

    // Start with a slight delay to allow rendering to catch up
    setTimeout(() => {
        isGameActive = true;
        startTime = Date.now();
    }, 100);
}

// Modern daytime streetlights — silver aluminum poles
function createStreetlight() {
  const group = new THREE.Group();
  const poleMat = new THREE.MeshStandardMaterial({ color: 0x9c9c9c, metalness: 0.8, roughness: 0.3 });
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, 9, 6), poleMat);
  pole.position.y = 4.5;
  group.add(pole);
  // Curved arm
  const arm = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.1, 0.1), poleMat);
  arm.position.set(1.25, 8.8, 0);
  group.add(arm);
  // Luminaire housing
  const lumMat = new THREE.MeshStandardMaterial({ color: 0xe8e8e0, roughness: 0.3 });
  const lum = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.2, 0.4), lumMat);
  lum.position.set(2.5, 8.75, 0);
  group.add(lum);
  return group;
}

// Place streetlights every 40m on alternating sides (Cover full 3000m)
for (let i = 0; i < 75; i++) {
  const side = i % 2 === 0 ? -1 : 1;
  const sl = createStreetlight();
  sl.position.set(side * ((roadWidth / 2) + 4.5), 0, -i * 40 - 10);
  if (side === 1) sl.rotation.y = Math.PI;
  scene.add(sl);
}

// Clean modern billboards (white structures)
function createBillboard() {
  const group = new THREE.Group();
  const structMat = new THREE.MeshStandardMaterial({ color: 0x888880, roughness: 0.7 });
  const pole = new THREE.Mesh(new THREE.BoxGeometry(0.3, 10, 0.3), structMat);
  pole.position.y = 5;
  group.add(pole);
  const board = new THREE.Mesh(new THREE.BoxGeometry(8, 4, 0.3), structMat);
  board.position.y = 10.5;
  group.add(board);
  // White face
  const faceMat = new THREE.MeshStandardMaterial({ color: 0xf5f0eb, roughness: 0.8 });
  const face = new THREE.Mesh(new THREE.PlaneGeometry(7.8, 3.8), faceMat);
  face.position.set(0, 10.5, 0.16);
  group.add(face);
  return group;
}

// 6 billboards set back from the road
[-90, -180, -270, -360, -450, -540].forEach((z, i) => {
  const side = i % 2 === 0 ? -1 : 1;
  const bb = createBillboard();
  bb.position.set(side * 28, 0, z);
  bb.rotation.y = side === 1 ? -0.3 : 0.3;
  scene.add(bb);
});

// Distant rolling hills for depth
const hillMat = new THREE.MeshStandardMaterial({ color: 0x6b8c5a, roughness: 1.0 });
for (let i = 0; i < 12; i++) {
  const r = 35 + Math.random() * 25;
  const hillGeo = new THREE.SphereGeometry(r, 12, 8);
  const hill = new THREE.Mesh(hillGeo, hillMat);
  const side = i % 2 === 0 ? 1 : -1;
  hill.position.set(side * (120 + Math.random() * 80), -r + 5, -200 - i * 120);
  scene.add(hill);
}

// Add Environment Map for Realism
const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();
const envTexture = new THREE.CubeTextureLoader()
  .setPath('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/cube/Park3Med/')
  .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'], (tex) => {
      scene.environment = tex;
      scene.background = tex;
      scene.backgroundBlurriness = 0.5;
  });

// Realistic Game State
let zenMode = false;
const keys = { w: false, a: false, s: false, d: false, space: false };
let carSpeed = 0;
const maxNormalSpeed = 0.72; // Reduced for better reaction time
const maxNitroSpeed = 1.15; // Balanced boost
const normalAcceleration = 0.008; // Smoother build-up
const nitroAcceleration = 0.018;
const deceleration = 0.004;
const brakePower = 0.02;
const turnSpeed = 0.025;
const turnAccel = 0.004; // Softer steering momentum
const sideFriction = 0.85; // Faster damping for stability
let sideVelocity = 0;
const maxSideSpeed = 0.1; // Reduced max side velocity
const roadMinX = -roadWidth / 2 + 1.2;
const roadMaxX = roadWidth / 2 - 1.2;
let steeringAngle = 0; // Current visual rotation of wheel
const maxSteeringAngle = 120; // Max degrees for visual wheel
isGameActive = true;

// DOM Elements Refined
const speedoValue = document.getElementById('speedo-value');
const statGear = document.getElementById('stat-gear');
const statScore = document.getElementById('stat-score');
const statTime = document.getElementById('stat-time');
const statLevel = document.getElementById('stat-level');
const statUnitCurrent = document.getElementById('stat-unit-current');
const statUnitTotal = document.getElementById('stat-unit-total');
const progressBar = document.getElementById('progress-bar');
const pedalAccel = document.getElementById('pedal-accel');
const pedalBrake = document.getElementById('pedal-brake');

// Level Progression State (150 Questions Total over 5 Levels)
let currentLevel = 1;
const questionsPerLevel = [10, 20, 30, 40, 50]; 
const timePerLevel = [120, 300, 600, 900, 1200]; // Seconds: 2m, 5m, 10m, 15m, 20m
let levelAnswers = 0;
let levelMistakes = 0;

// Reset Game Metrics
let currentScore = 0;
let startTime = Date.now();
let timeRemaining = 0;
let checkpointCount = 1;
let lives = 3;
let isLevelFinishing = false;
let finishZone = null;
let celebrationParticles = null;

// Input Handling
window.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  if (key === 'w' || key === 'arrowup') { keys.w = true; pedalAccel.classList.add('active'); }
  if (key === 's' || key === 'arrowdown') { keys.s = true; pedalBrake.classList.add('active'); }
  if (key === 'a' || key === 'arrowleft') keys.a = true;
  if (key === 'd' || key === 'arrowright') keys.d = true;
  if (key === ' ' || key === 'space') keys.space = true;
});

window.addEventListener('keyup', (e) => {
  const key = e.key.toLowerCase();
  if (key === 'w' || key === 'arrowup') { keys.w = false; pedalAccel.classList.remove('active'); }
  if (key === 's' || key === 'arrowdown') { keys.s = false; pedalBrake.classList.remove('active'); }
  if (key === 'a' || key === 'arrowleft') keys.a = false;
  if (key === 'd' || key === 'arrowright') keys.d = false;
  if (key === ' ' || key === 'space') keys.space = false;
});

// Touch Handling
pedalAccel.addEventListener('touchstart', (e) => { e.preventDefault(); keys.w = true; pedalAccel.classList.add('active'); });
pedalAccel.addEventListener('touchend', () => { keys.w = false; pedalAccel.classList.remove('active'); });
pedalBrake.addEventListener('touchstart', (e) => { e.preventDefault(); keys.s = true; pedalBrake.classList.add('active'); });
pedalBrake.addEventListener('touchend', () => { keys.s = false; pedalBrake.classList.remove('active'); });

// Joystick Steering
const steeringZone = document.getElementById('steering-zone');
const joystickKnob = document.getElementById('joystick-knob');
const steeringWheelIcon = document.getElementById('steering-wheel-icon');
let joystickActive = false;
let joystickOriginX = 0;
const JOYSTICK_DEADZONE = 10;
const JOYSTICK_MAX = 55;

function getJoystickDelta(clientX) {
  return Math.max(-JOYSTICK_MAX, Math.min(JOYSTICK_MAX, clientX - joystickOriginX));
}

function applyJoystick(delta) {
  joystickKnob.style.transform = `translate(calc(-50% + ${delta}px), -50%)`;
  // Rotate visual wheel icon
  const rotation = (delta / JOYSTICK_MAX) * 90; 
  steeringWheelIcon.style.transform = `rotate(${rotation}deg)`;

  if (Math.abs(delta) < JOYSTICK_DEADZONE) {
    keys.a = false; keys.d = false;
  } else if (delta < 0) {
    keys.a = true; keys.d = false;
  } else {
    keys.d = true; keys.a = false;
  }
}

function resetJoystick() {
  joystickActive = false;
  joystickKnob.style.transform = 'translate(-50%, -50%)';
  steeringWheelIcon.style.transform = 'rotate(0deg)';
  keys.a = false; keys.d = false;
}

// Touch controls for steering
steeringZone.addEventListener('touchstart', (e) => { e.preventDefault(); joystickActive = true; joystickOriginX = e.touches[0].clientX; applyJoystick(0); }, { passive: false });
steeringZone.addEventListener('touchmove', (e) => { e.preventDefault(); if (joystickActive) applyJoystick(getJoystickDelta(e.touches[0].clientX)); }, { passive: false });
steeringZone.addEventListener('touchend', resetJoystick);
steeringZone.addEventListener('touchcancel', resetJoystick);

// Mouse fallback for desktop
steeringZone.addEventListener('mousedown', (e) => { joystickActive = true; joystickOriginX = e.clientX; applyJoystick(0); });
window.addEventListener('mousemove', (e) => { if (joystickActive) applyJoystick(getJoystickDelta(e.clientX)); });
window.addEventListener('mouseup', () => { if (joystickActive) resetJoystick(); });

// Boost button — touch AND mouse
const nitroBtn = document.getElementById('nitro-btn');
nitroBtn.addEventListener('touchstart', (e) => { e.preventDefault(); keys.space = true; nitroBtn.classList.add('active'); });
nitroBtn.addEventListener('touchend', () => { keys.space = false; nitroBtn.classList.remove('active'); });
nitroBtn.addEventListener('mousedown', () => { keys.space = true; nitroBtn.classList.add('active'); });
nitroBtn.addEventListener('mouseup', () => { keys.space = false; nitroBtn.classList.remove('active'); });

// Pedal mouse fallback
pedalAccel.addEventListener('mousedown', () => { keys.w = true; pedalAccel.classList.add('active'); });
pedalBrake.addEventListener('mousedown', () => { keys.s = true; pedalBrake.classList.add('active'); });
window.addEventListener('mouseup', () => { keys.w = false; keys.s = false; pedalAccel.classList.remove('active'); pedalBrake.classList.remove('active'); });

// Traffic Palette & System (Modern Real-world Colors)
const trafficCars = [];
const sharedCabinMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.1, metalness: 1.0 });
const sharedWheelMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
const sharedHeadMat  = new THREE.MeshBasicMaterial({ color: 0xffffff }); // LED White
const sharedTailMat  = new THREE.MeshBasicMaterial({ color: 0xaa0000 }); // LED Red
const sharedWheelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.28, 8);

const realCarColors = {
  black:  0x0a0a0a,
  silver: 0x8a8d8f,
  white:  0xfafafa,
  grey:   0x3a3d40,
  blue:   0x0a1c3b,
  red:    0x4a0a0a
};

const carColorPool = Object.values(realCarColors);

function createTrafficVehicle(type = 'sedan') {
  const car = new THREE.Group();
  let w = 2.0, h = 0.8, l = 4.0, cabinH = 0.6, cabinL = 2.0, cabinZ = -0.2, slope = 0.4;
  
  if (type === 'premium') { w = 2.1; h = 0.7; l = 4.6; cabinH = 0.5; cabinL = 2.2; cabinZ = -0.1; slope = 0.6; }
  else if (type === 'suv') { w = 2.2; h = 1.1; l = 4.8; cabinH = 0.7; cabinL = 2.6; cabinZ = 0.2; slope = 0.2; }
  else if (type === 'hatchback') { w = 1.9; h = 0.9; l = 3.6; cabinH = 0.6; cabinL = 2.0; cabinZ = 0.4; slope = 0.3; }

  const colorPool = activeTrafficColors || carColorPool;
  const color = colorPool[Math.floor(Math.random() * colorPool.length)];
  const bodyMat = new THREE.MeshStandardMaterial({ 
      color: color, 
      metalness: 0.9, 
      roughness: 0.2, 
      envMapIntensity: 1.0 
  });

  // Main Body
  const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, l), bodyMat);
  body.position.set(0, h / 2 + 0.3, 0);
  car.add(body);

  // Cabin with slight slant for windshield
  const cabinGeo = new THREE.BoxGeometry(w * 0.85, cabinH, cabinL);
  // Manual slant simulation: tilt the cabin slightly or just offset
  const cabin = new THREE.Mesh(cabinGeo, sharedCabinMat);
  cabin.position.set(0, h + 0.3 + cabinH / 2 - 0.05, cabinZ);
  car.add(cabin);

  // 4 wheels
  const wheelGroups = [];
  const wheelPos = [
    { x: w/2,  y: 0.35, z:  l/2 - 0.7 },
    { x: -w/2, y: 0.35, z:  l/2 - 0.7 },
    { x: w/2,  y: 0.35, z: -l/2 + 0.7 },
    { x: -w/2, y: 0.35, z: -l/2 + 0.7 }
  ];
  wheelPos.forEach(p => {
    const wg = new THREE.Group();
    const wm = new THREE.Mesh(sharedWheelGeo, sharedWheelMat);
    wm.rotation.z = Math.PI / 2;
    wg.add(wm);
    wg.position.set(p.x, p.y, p.z);
    car.add(wg);
    wheelGroups.push(wg);
  });

  // LED Lighting signatures
  const headL = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.1), sharedHeadMat);
  headL.position.set(w / 2 - 0.35, h * 0.8 + 0.3, -l / 2 - 0.01);
  car.add(headL);
  const headR = headL.clone(); headR.position.x *= -1; car.add(headR);

  const tailL = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.12), sharedTailMat);
  tailL.position.set(w / 2 - 0.4, h * 0.8 + 0.3, l / 2 + 0.01);
  car.add(tailL);
  const tailR = tailL.clone(); tailR.position.x *= -1; car.add(tailR);

  car.userData = { type, width: w, length: l, wheels: wheelGroups };
  return car;
}

const TRAFFIC_POOL_SIZE = 8; // Hard cap for performance

function spawnTraffic(zPos) {
  const lanes = [-5.25, -1.75, 1.75, 5.25];
  const lane = lanes[Math.floor(Math.random() * lanes.length)];
  
  let vehicle;
  let type = 'sedan';
  
  // Hybrid Pool: 50% GLTF Model, 50% Procedural for guaranteed variety
    

    if (questions && questions.length > 0 && Math.random() > 0.5) {
    const template = trafficTemplates[Math.floor(Math.random() * trafficTemplates.length)];
    vehicle = template.clone();
    type = template.userData.type || 'sedan';
    vehicle.rotation.y = Math.PI;
  } else {
    const types = activeTrafficTypes || ['sedan', 'suv', 'hatchback', 'premium'];
    type = types[Math.floor(Math.random() * types.length)];
    vehicle = createTrafficVehicle(type);
  }
  
  vehicle.position.set(lane, 0, zPos);
  scene.add(vehicle);

  let speed = 0.12 + Math.random() * 0.1;
  if (type === 'suv') speed *= 0.7;
  if (type === 'premium') speed *= 1.2;

  trafficCars.push({ mesh: vehicle, speed, isStatic: false, type });
}

// Seed pool with 8 cars staggered ahead
for (let i = 0; i < TRAFFIC_POOL_SIZE; i++) spawnTraffic(-40 - i * 40);

// Tunnel (visual shell only — no PointLights for performance)
const tunnelG = new THREE.Group();
const tunnelLength = 80;
const outerGeo = new THREE.CylinderGeometry(8, 8, tunnelLength, 8, 1, true, 0, Math.PI);
const outerMat = new THREE.MeshBasicMaterial({ color: 0x1a1a1a, side: THREE.BackSide });
const tunnelMesh = new THREE.Mesh(outerGeo, outerMat);
tunnelMesh.rotation.z = Math.PI / 2;
tunnelMesh.rotation.y = Math.PI / 2;
tunnelG.add(tunnelMesh);
tunnelG.position.set(0, 0, -150);
scene.add(tunnelG);

// Camera and State Lerpers
const cameraOffset = new THREE.Vector3(0, 6, 14);
const cameraLookOffset = new THREE.Vector3(0, 2, -10);
const cameraPosLerp = new THREE.Vector3();
const cameraLookLerp = new THREE.Vector3();

const passedCheckpoints = new Set();
let time = 0;

// Optimization: Pre-allocate vectors to avoid GC in animate loop
const tempVecTarget = new THREE.Vector3();
const tempVecLook = new THREE.Vector3();
const lastUpdate = { score: -1, time: '', progress: -1 };

// Optimization: Single persistent notification element
const checkpointNotify = document.createElement('div');
checkpointNotify.className = 'checkpoint-notify';
checkpointNotify.style.display = 'none';
document.body.appendChild(checkpointNotify);

function animate() {
  if (!isGameActive) return;
  time += 0.016;

  // Car Physics (Nitro Enhanced)
  const isNitro = keys.space && carSpeed > 0.1;
  let currentMax = isNitro ? maxNitroSpeed : maxNormalSpeed;
  const currentAccel = isNitro ? nitroAcceleration : normalAcceleration;

  // Level Finish Speed Cap (Cinematic Pacing)
  if (isLevelFinishing) currentMax = 0.35;

  if (keys.w) {
    carSpeed = Math.min(carSpeed + currentAccel, currentMax);
  } else if (keys.s) {
    carSpeed = Math.max(carSpeed - brakePower, 0);
  } else {
    carSpeed = Math.max(carSpeed - deceleration, 0);
  }

  // Smooth Speed Bleed-off during celebration (Refined Glide)
  if (celebrationParticles && !isLevelFinishing) {
      carSpeed = Math.max(carSpeed * 0.985, 0.1);
  }

  // Refined Steering & Momentum Logic
  let targetTilt = 0;
  if (keys.a) {
    sideVelocity = Math.max(sideVelocity - turnAccel, -maxSideSpeed);
    steeringAngle = THREE.MathUtils.lerp(steeringAngle, -maxSteeringAngle, 0.12);
  } else if (keys.d) {
    sideVelocity = Math.min(sideVelocity + turnAccel, maxSideSpeed);
    steeringAngle = THREE.MathUtils.lerp(steeringAngle, maxSteeringAngle, 0.12);
  } else {
    sideVelocity *= sideFriction; // Natural damping
    steeringAngle = THREE.MathUtils.lerp(steeringAngle, 0, 0.08);
  }

  // Apply Movement & Tilt
  carGroup.position.x += sideVelocity * (carSpeed * 1.2 + 0.6) * 6;
  carGroup.position.x = THREE.MathUtils.clamp(carGroup.position.x, roadMinX, roadMaxX);
  
  // Proportional weight-based tilt
  targetTilt = -sideVelocity * 0.45;
  carGroup.rotation.z = THREE.MathUtils.lerp(carGroup.rotation.z, targetTilt, 0.1);
  carGroup.rotation.y = THREE.MathUtils.lerp(carGroup.rotation.y, -sideVelocity * 0.25, 0.1);
  carGroup.position.z -= carSpeed * 2;

  // Seamless Road Looping (Allows for high-question levels)
  if (carGroup.position.z < -6000) {
      carGroup.position.z = 10;
      passedCheckpoints.clear(); // Re-activate gateways for the next "lap"
  }

  // Dynamic Camera FOV (Nitro stretch)
  const targetFOV = isNitro ? 72 : 60;
  if (Math.abs(camera.fov - targetFOV) > 0.1) {
    camera.fov = THREE.MathUtils.lerp(camera.fov, targetFOV, 0.08);
    camera.updateProjectionMatrix();
  }

  // Update HUD Visuals
  const displaySpeed = Math.round(carSpeed * 240);
  speedoValue.textContent = displaySpeed.toString().padStart(1, '0');
  statGear.textContent = carSpeed > 0.01 ? (carSpeed > 0.6 ? '5' : '3') : 'N';
  
  // Update Audio
  if (window.audioData) {
      const { engineOsc, engineFilter, engineGain, windFilter, windGain } = window.audioData;
      const freq = 40 + carSpeed * 120 + (isNitro ? 40 : 0);
      engineOsc.frequency.setTargetAtTime(freq, audioCtx.currentTime, 0.1);
      engineFilter.frequency.setTargetAtTime(400 + carSpeed * 800, audioCtx.currentTime, 0.1);
      engineGain.gain.setTargetAtTime(keys.w ? 0.15 : 0.08, audioCtx.currentTime, 0.2);
      
      windFilter.frequency.setTargetAtTime(100 + carSpeed * 1500, audioCtx.currentTime, 0.1);
      windGain.gain.setTargetAtTime(carSpeed * 0.15, audioCtx.currentTime, 0.1);
  }

  // Update Time (Countdown)
  const elapsedSinceStart = (Date.now() - startTime) / 1000;
  const currentRemaining = Math.max(0, timePerLevel[currentLevel - 1] - elapsedSinceStart);
  
  if (currentRemaining <= 0 && isGameActive) {
      isGameActive = false;
      showGameOver("MISSION FAILED // TIME EXPIRED");
      return;
  }

  const mins = Math.floor(currentRemaining / 60).toString().padStart(2, '0');
  const secs = Math.floor(currentRemaining % 60).toString().padStart(2, '0');
  const timeStr = `${mins}:${secs}`;
  if (lastUpdate.time !== timeStr) {
      statTime.textContent = timeStr;
      statTime.style.color = currentRemaining < 30 ? '#ff0033' : '#fff';
      if (currentRemaining < 10) statTime.style.animation = 'pulse 0.5s infinite';
      else statTime.style.animation = 'none';
      lastUpdate.time = timeStr;
  }
  
  // Update Progress (Based on road length) - Throttled
  const progress = Math.min(Math.abs(carGroup.position.z) / roadLength * 100, 100);
  const pInt = Math.floor(progress);
  if (lastUpdate.progress !== pInt) {
      progressBar.style.width = `${progress}%`;
      lastUpdate.progress = pInt;
  }
  
  if (lastUpdate.score !== currentScore) {
      statScore.textContent = currentScore.toLocaleString();
      lastUpdate.score = currentScore;
  }
  // Progress Throttling already handled above
  if (statLevel) statLevel.textContent = currentLevel;

  // Win Condition check
  if (progress >= 100) {
      showWinScreen();
      return; // Stop animation loop updates
  }

  // Pulse Exhaust (Using Cached References)
  const exhL = carGroup.userData.exhL;
  const exhR = carGroup.userData.exhR;
  if (exhL && exhR) {
    const isNitro = keys.space && carSpeed > 0.1;
    const pulse = keys.w ? (1.0 + Math.sin(time * 30) * 0.3) * (isNitro ? 2.0 : 1.0) : 0.2;
    exhL.scale.set(pulse, pulse, pulse);
    exhR.scale.set(pulse, pulse, pulse);
    
    // Clean "High-Octane" blue instead of neon cyan
    const flameColor = isNitro ? 0x88ccff : 0xffaa00;
    if (exhL.userData.lastColor !== flameColor) {
        exhL.material.color.setHex(flameColor);
        exhR.material.color.setHex(flameColor);
        exhL.material.emissive.setHex(flameColor);
        exhR.material.emissive.setHex(flameColor);
        exhL.userData.lastColor = flameColor;
    }

    exhL.material.emissiveIntensity = keys.w ? (isNitro ? 4 : 2) + Math.sin(time * 50) * 0.5 : 0.5;
    exhR.material.emissiveIntensity = exhL.material.emissiveIntensity;
  }

  // Traffic Movement & Collision
  trafficCars.forEach(car => {
    car.mesh.position.z -= car.speed;
    
    // Wheel spin only (no body bounce for performance)
    if (car.mesh.userData.wheels && car.speed > 0) {
      const ws = car.speed * 2;
      for (let i = 0; i < car.mesh.userData.wheels.length; i++) {
        car.mesh.userData.wheels[i].children[0].rotation.x += ws;
      }
    }

    // Recycle car behind player
    if (car.mesh.position.z > carGroup.position.z + 25) {
      car.mesh.position.z = carGroup.position.z - 300;
      
      // Don't spawn traffic too close to the next checkpoint
      const nextCP = checkpoints.find(cp => !passedCheckpoints.has(checkpoints.indexOf(cp)));
      if (nextCP && Math.abs(car.mesh.position.z - nextCP.z) < 40) {
          car.mesh.position.z -= 60; // Push further away
      }

      const lanes = [-5.25, -1.75, 1.75, 5.25];
      car.mesh.position.x = lanes[Math.floor(Math.random() * lanes.length)];
    }
    
    // Collision detection
    const dx = Math.abs(carGroup.position.x - car.mesh.position.x);
    const dz = Math.abs(carGroup.position.z - car.mesh.position.z);
    const tW = car.mesh.userData.width || 2;
    const tL = car.mesh.userData.length || 4;

    if (dx < (2.0 + tW) / 2 - 0.2 && dz < (4.4 + tL) / 2 - 0.2) {
      isGameActive = false;
      playSFX(100, 'square', 0.5); // Crash Sound
      lives--;
      updateLivesHUD();
      if (lives <= 0) {
        showGameOver();
      } else {
        crashOverlay.style.display = 'flex';
        setTimeout(() => {
          carGroup.position.x = 0;
          carSpeed = 0;
          isGameActive = true;
          crashOverlay.style.display = 'none';
        }, 2000);
      }
    }
  });

  // Checkpoints
  checkpoints.forEach((cp, idx) => {
    if (!passedCheckpoints.has(idx) && Math.abs(carGroup.position.z - cp.z) < 5) {
      onCheckpointPassed(idx);
    }
    // Technical Pulse for Curtain
    if (cp.curtain) {
        cp.curtain.material.opacity = 0.05 + Math.sin(time * 8 + idx) * 0.05;
    }
  });

  // Animate Speed Trails
  trails.forEach(t => {
    t.position.z += carSpeed * 5;
    if (t.position.z > carGroup.position.z + 20) {
        t.position.z = carGroup.position.z - 200;
        t.position.x = (Math.random() - 0.5) * (roadWidth - 2);
    }
    t.scale.y = carSpeed * 5 + 0.1;
    t.material.opacity = carSpeed * 0.3;
  });

  // Score accumulation based on speed
  if (carSpeed > 0.1) {
    currentScore += Math.floor(carSpeed * 5);
  }

  // Camera Shake & Offset Logic
  let shakeX = 0, shakeY = 0;
  if (isGameActive) {
    // High-speed vibration
    if (carSpeed > 1.2) {
      shakeX = (Math.random() - 0.5) * (carSpeed * 0.05);
      shakeY = (Math.random() - 0.5) * (carSpeed * 0.05);
    }
    // Impact shake
    if (crashOverlay.style.display === 'flex') {
      shakeX = (Math.random() - 0.5) * 0.6;
      shakeY = (Math.random() - 0.5) * 0.6;
    }
  }

  // Camera Follow
  tempVecTarget.set(
    carGroup.position.x * 0.5 + shakeX,
    carGroup.position.y + cameraOffset.y + shakeY,
    carGroup.position.z + cameraOffset.z
  );
  tempVecLook.set(
    carGroup.position.x * 0.7,
    carGroup.position.y + cameraLookOffset.y,
    carGroup.position.z + cameraLookOffset.z
  );

  cameraPosLerp.lerp(tempVecTarget, 0.08);
  cameraLookLerp.lerp(tempVecLook, 0.12);
  camera.position.copy(cameraPosLerp);
  camera.lookAt(cameraLookLerp);

  // Score accumulation based on speed
  if (carSpeed > 0.1) {
    currentScore += Math.floor(carSpeed * 5);
  }

  // Check Finish Zone Collision
  if (isLevelFinishing && finishZone) {
      const dist = Math.abs(carGroup.position.z - finishZone.position.z);
      if (dist < 12) { // Increased threshold for reliability
          triggerCelebration();
      }
  }

  // Animate Premium Petals
  if (celebrationParticles && celebrationParticles.userData.states) {
      const states = celebrationParticles.userData.states;
      const matrix = new THREE.Matrix4();
      const quat = new THREE.Quaternion();
      const scale = new THREE.Vector3(1, 1, 1);
      
      states.forEach((s, i) => {
          s.pos.y -= s.speed;
          s.rot.x += s.spin;
          s.rot.y += s.spin;
          s.pos.x += Math.sin(time + s.wobble) * 0.04; // Slightly more sway
          s.pos.z += Math.cos(time + s.wobble) * 0.02; // Depth drift
          
          if (s.pos.y < 0) s.pos.y = 25;
          
          quat.setFromEuler(s.rot);
          matrix.compose(s.pos, quat, scale);
          celebrationParticles.setMatrixAt(i, matrix);
      });
      celebrationParticles.instanceMatrix.needsUpdate = true;
  }

  composer.render();
}

function spawnFinishZone(z) {
    if (finishZone) scene.remove(finishZone);
    
    const group = new THREE.Group();
    
    // Tactical Brutalist Gateway
    const pillarGeo = new THREE.BoxGeometry(2, 12, 2);
    const trussGeo = new THREE.BoxGeometry(roadWidth + 4, 1.5, 2);
    const structureMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2, metalness: 0.8 });
    
    const pL = new THREE.Mesh(pillarGeo, structureMat);
    pL.position.set(-roadWidth/2 - 1, 6, 0);
    group.add(pL);
    
    const pR = new THREE.Mesh(pillarGeo, structureMat);
    pR.position.set(roadWidth/2 + 1, 6, 0);
    group.add(pR);
    
    const truss = new THREE.Mesh(trussGeo, structureMat);
    truss.position.set(0, 11, 0);
    group.add(truss);

    // Architectural Truss Detail (Prevents "Black Bar" distraction)
    const detailGeo = new THREE.BoxGeometry(roadWidth + 4, 0.5, 0.5);
    const detailMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8 });
    for (let i = 0; i < 3; i++) {
        const d = new THREE.Mesh(detailGeo, detailMat);
        d.position.set(0, 10 + i * 1, 0.3);
        group.add(d);
    }

    // Modern Backlit Sign with Glow
    const signGeo = new THREE.PlaneGeometry(roadWidth - 2, 1.2);
    const signMat = new THREE.MeshBasicMaterial({ color: 0x43E8B1, transparent: true, opacity: 0.95 });
    const sign = new THREE.Mesh(signGeo, signMat);
    sign.position.set(0, 11, 1.05);
    group.add(sign);

    // Roadside Bollards
    const bollardGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.5);
    const bollardMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const lightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    
    for (let i = 0; i < 5; i++) {
        const bL = new THREE.Mesh(bollardGeo, bollardMat);
        bL.position.set(-roadWidth/2 - 0.5, 0.75, -10 - i * 8);
        group.add(bL);
        
        const bR = new THREE.Mesh(bollardGeo, bollardMat);
        bR.position.set(roadWidth/2 + 0.5, 0.75, -10 - i * 8);
        group.add(bR);
        
        // Small light on top
        const l = new THREE.Mesh(new THREE.SphereGeometry(0.1), lightMat);
        l.position.set(0, 0.8, 0);
        bL.add(l.clone());
        bR.add(l.clone());
    }

    // Finish Strips
    const stripGeo = new THREE.PlaneGeometry(roadWidth, 0.4);
    const stripMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
    for (let i = 0; i < 3; i++) {
        const strip = new THREE.Mesh(stripGeo, stripMat);
        strip.rotation.x = -Math.PI / 2;
        strip.position.set(0, 0.06, -5 + i * 1.5); // Just before the gate
        group.add(strip);
    }

    // Finish Floor Focus
    const floorGeo = new THREE.PlaneGeometry(roadWidth, 60);
    const floorMat = new THREE.MeshBasicMaterial({ color: 0x43E8B1, transparent: true, opacity: 0.08, side: THREE.DoubleSide });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0.05, -10);
    group.add(floor);

    group.position.set(0, 0, z);
    scene.add(group);
    finishZone = group;
    isLevelFinishing = true;

    // Clear Traffic Ahead
    trafficCars.forEach(tc => {
        if (tc.mesh.position.z < carGroup.position.z && tc.mesh.position.z > z - 50) {
            scene.remove(tc.mesh);
            tc.mesh.position.y = -100; // Hide
        }
    });
}

function triggerCelebration() {
    if (!isLevelFinishing) return;
    isLevelFinishing = false;
    
    playSFX(660, 'sine', 0.3);
    setTimeout(() => playSFX(880, 'sine', 0.3), 150);
    setTimeout(() => playSFX(1100, 'sine', 0.3), 300);

    // Premium "Cyber-Flora" Petals (Instanced for Performance)
    const count = 200;
    const geo = new THREE.PlaneGeometry(0.12, 0.2); // Slightly smaller for elegance
    const mat = new THREE.MeshBasicMaterial({ 
        color: 0xf0fff4, // Soft Mint White (more prestigious)
        side: THREE.DoubleSide, 
        transparent: true, 
        opacity: 0.6,
        blending: THREE.AdditiveBlending 
    });
    
    const instMesh = new THREE.InstancedMesh(geo, mat, count);
    const matrix = new THREE.Matrix4();
    const pos = new THREE.Vector3();
    const rot = new THREE.Euler();
    const quat = new THREE.Quaternion();
    const scale = new THREE.Vector3(1, 1, 1);

    const petalStates = [];

    for (let i = 0; i < count; i++) {
        pos.set(
            (Math.random() - 0.5) * 40,
            15 + Math.random() * 20,
            carGroup.position.z - 30 + (Math.random() - 0.5) * 40
        );
        rot.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        quat.setFromEuler(rot);
        matrix.compose(pos, quat, scale);
        instMesh.setMatrixAt(i, matrix);
        
        petalStates.push({
            pos: pos.clone(),
            rot: rot.clone(),
            speed: 0.05 + Math.random() * 0.1,
            spin: (Math.random() - 0.5) * 0.1,
            wobble: Math.random() * Math.PI
        });
    }
    
    instMesh.instanceMatrix.needsUpdate = true;
    scene.add(instMesh);
    celebrationParticles = instMesh;
    celebrationParticles.userData.states = petalStates;

    // World Text / Overlay
    const celebrationMsg = document.createElement('div');
    celebrationMsg.style.cssText = 'position:fixed; top:40%; left:50%; transform:translate(-50%, -50%); color:#fff; font-weight:900; font-size:4rem; letter-spacing:10px; text-transform:uppercase; z-index:3000; animation: pulse 1.2s infinite; text-shadow: 0 0 30px #43E8B1; pointer-events:none; opacity: 0; transition: opacity 0.8s;';
    celebrationMsg.textContent = "CONGRATULATIONS";
    document.body.appendChild(celebrationMsg);
    
    // Smooth Fade-in
    requestAnimationFrame(() => {
        celebrationMsg.style.opacity = '1';
    });

    // Cinematic Camera Zoom
    const originalOffset = cameraOffset.z;
    const zoomInterval = setInterval(() => {
        cameraOffset.z = Math.min(cameraOffset.z + 0.1, 22); // Zoom out
        cameraOffset.y = Math.min(cameraOffset.y + 0.05, 9);  // Lift up
    }, 16);

    setTimeout(() => {
        celebrationMsg.style.opacity = '0';
        celebrationMsg.style.transition = 'opacity 1.5s';
        
        // Restore camera
        clearInterval(zoomInterval);
        const resetInterval = setInterval(() => {
            cameraOffset.z = Math.max(cameraOffset.z - 0.2, 14);
            cameraOffset.y = Math.max(cameraOffset.y - 0.1, 6);
            if (cameraOffset.z === 14 && cameraOffset.y === 6) clearInterval(resetInterval);
        }, 16);
        
        setTimeout(() => {
            celebrationMsg.remove();
            if (celebrationParticles) {
                scene.remove(celebrationParticles);
                celebrationParticles = null;
            }
            if (finishZone) {
                scene.remove(finishZone);
                finishZone = null;
            }
            showLevelComplete();
        }, 1500);
    }, 2000);
}

// Initial Sync
cameraPosLerp.copy(carGroup.position).add(cameraOffset);
cameraLookLerp.copy(carGroup.position).add(cameraLookOffset);

renderer.setAnimationLoop(animate);

function onCheckpointPassed(idx) {
    passedCheckpoints.add(idx);
    checkpointCount = Math.max(checkpointCount, idx + 2);
    playSFX(880, 'sine', 0.2); // Checkpoint Ding
    
    // Gradual Question Complexity Scaling
    const advancedChance = Math.min(0.2 + (currentLevel - 1) * 0.15, 0.7);
    const useAdvanced = Math.random() < advancedChance;
    const pool = useAdvanced ? questionPool.advanced : questionPool.basic;
    const qData = pool[Math.floor(Math.random() * pool.length)];
    
    if (zenMode) {
        // In Zen Mode, just pass the checkpoint and progress
        currentScore += 1500;
        levelAnswers++;
        checkpointNotify.textContent = "CHECKPOINT REACHED // ZEN FLOW ACTIVE";
        checkpointNotify.style.color = "#43E8B1";
        checkpointNotify.style.display = 'block';
        setTimeout(() => checkpointNotify.style.display = 'none', 2000);

        if (levelAnswers >= questionsPerLevel[currentLevel - 1]) {
            spawnFinishZone(carGroup.position.z - 150);
            checkpointNotify.textContent = "DESTINATION LOCKED // PROCEED TO ARRIVAL ZONE";
        }
        return;
    }
    
    showQuestionModal(idx, qData);
}

function showQuestionModal(idx, qData) {
    isGameActive = false;
    
    const modal = document.createElement('div');
    modal.id = 'question-modal';
    modal.className = 'overlay-active';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;z-index:2000;';
    
    let optionsHtml = '';
    qData.a.forEach((opt, i) => {
        optionsHtml += `<button class="answer-btn" data-idx="${i}" style="width:100%; padding:1.5rem; margin:0.5rem 0; background:#111; color:#fff; border:2px solid #333; font-size:1.2rem; cursor:pointer; font-weight:900; text-align:left;">${opt}</button>`;
    });

    modal.innerHTML = `
        <div class="brutalist-panel" style="width: 90%; max-width: 600px; padding: 2.5rem; border-color: #${checkpointColors[idx % checkpointColors.length].toString(16).padStart(6, '0')};">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; border-bottom:2px solid rgba(255,255,255,0.1); padding-bottom:0.5rem;">
                <span style="font-size:0.8rem; font-weight:900; color:#6C63FF; letter-spacing:2px;">GATEWAY // DATA VALIDATION</span>
                <span style="font-size:0.8rem; font-weight:900; color:rgba(255,255,255,0.5);">CHECKPOINT ${idx + 1}</span>
            </div>
            <h2 style="color:#fff; font-size:1.6rem; margin-bottom:2rem; font-family:'Inter', sans-serif; line-height:1.4;">${qData.q}</h2>
            <div style="display:grid; grid-template-columns:1fr; gap:0.8rem;">
                ${optionsHtml}
            </div>
            <div style="margin-top:2rem; font-size:0.7rem; color:rgba(255,255,255,0.3); font-weight:900; letter-spacing:1px; text-align:center;">
                SELECT CORRECT RESPONSE TO RESUME MISSION
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const btns = modal.querySelectorAll('.answer-btn');
    btns.forEach(btn => {
        btn.onclick = () => {
            const selected = parseInt(btn.getAttribute('data-idx'));
            if (selected === qData.c) {
                // Correct
                btn.style.background = '#43E8B1';
                btn.style.color = '#000';
                currentScore += 2500;
                correctAnswers++;
                levelAnswers++;
                playSFX(1200, 'sine', 0.3);
                
                // Update HUD Progress
                if (statUnitCurrent) statUnitCurrent.textContent = levelAnswers;
                if (progressBar) {
                    const goal = questionsPerLevel[currentLevel - 1];
                    progressBar.style.width = `${Math.min(100, (levelAnswers / goal) * 100)}%`;
                }

                // Visual Success
                checkpointNotify.textContent = "CORRECT // MISSION RESUMED";
                checkpointNotify.style.color = "#43E8B1";
                carSpeed = 0.4;
                
                // Check Level Completion Sequence
                if (levelAnswers >= questionsPerLevel[currentLevel - 1]) {
                    setTimeout(() => {
                        modal.remove();
                        spawnFinishZone(carGroup.position.z - 150);
                        checkpointNotify.textContent = "FINAL UNIT VALIDATED // PROCEED TO ARRIVAL ZONE";
                        checkpointNotify.style.color = "#43E8B1";
                        checkpointNotify.style.display = 'block';
                        
                        // Critical Fix: Re-activate game so player can drive to finish
                        isGameActive = true; 
                        
                        setTimeout(() => checkpointNotify.style.display = 'none', 3000);
                    }, 1000);
                    return;
                }
            } else {
                // Incorrect
                btn.style.background = '#ff0033';
                currentScore -= 500;
                lives--;
                levelMistakes++;
                updateLivesHUD();
                playSFX(150, 'sawtooth', 0.4);
                
                checkpointNotify.textContent = "INCORRECT // REDUCED SPEED MODE";
                checkpointNotify.style.color = "#ff0033";
                carSpeed = 0.1; // Gentle penalty for better recovery
            }
            
            checkpointNotify.style.display = 'block';
            setTimeout(() => {
                modal.remove();
                if (lives <= 0) {
                    showGameOver();
                } else {
                    isGameActive = true;
                }
                setTimeout(() => checkpointNotify.style.display = 'none', 2000);
            }, 1000);
        };
    });
}

function showWinScreen() {
    isGameActive = false;
    const overlay = document.createElement('div');
    overlay.id = 'win-overlay';
    overlay.className = 'overlay-active';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:1000;';
    overlay.innerHTML = `
        <div class="brutalist-panel" style="padding: 3rem; text-align: center; border-color: #43E8B1; max-width: 500px;">
            <h1 style="color: #43E8B1; font-size: 3rem; margin: 0;">CAMPAIGN COMPLETE</h1>
            <div style="margin: 2rem 0; text-align: left; background: rgba(255,255,255,0.05); padding: 1.5rem; border: 1px solid rgba(255,255,255,0.1);">
                <p style="color: #6C63FF; font-size: 0.8rem; font-weight: 900; letter-spacing: 2px; margin-bottom: 0.5rem;">GLOBAL MASTERY DATA</p>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span style="color: #fff; font-weight: 900;">TOTAL SCORE</span>
                    <span style="color: #fff; font-family: monospace;">${currentScore.toLocaleString()}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span style="color: #fff; font-weight: 900;">UNITS VALIDATED</span>
                    <span style="color: #43E8B1; font-family: monospace;">150 / 150</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: #fff; font-weight: 900;">TOTAL ACCURACY</span>
                    <span style="color: #43E8B1; font-family: monospace;">${Math.round((correctAnswers / (correctAnswers + levelMistakes)) * 100)}%</span>
                </div>
            </div>
            <p style="color: #fff; font-size: 0.9rem; opacity: 0.7; margin-bottom: 2rem;">You have successfully navigated the entire 150-unit academic loop. You are a Master Driver and a Top Scholar.</p>
            <button onclick="location.reload()" style="padding: 1rem 2rem; background: #fff; color: #000; border: none; cursor: pointer; font-weight: 900; letter-spacing: 2px; width: 100%;">RESTART CAMPAIGN</button>
        </div>
    `;
    document.body.appendChild(overlay);
}

function showLevelComplete() {
    isGameActive = false;
    const overlay = document.createElement('div');
    overlay.id = 'level-complete-overlay';
    overlay.className = 'overlay-active';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.92);display:flex;align-items:center;justify-content:center;z-index:2500;';
    
    overlay.innerHTML = `
        <div class="brutalist-panel" style="padding: 3rem; text-align: center; border-color: #43E8B1; max-width: 550px;">
            <p style="color: #43E8B1; font-weight: 900; letter-spacing: 4px; margin: 0; font-size: 0.8rem; text-transform: uppercase;">Mission Debrief // Level ${currentLevel}</p>
            <h1 style="color: #fff; font-size: 3rem; margin: 0.5rem 0 2rem 0;">LEVEL COMPLETE</h1>
            
            <div style="margin-bottom: 2.5rem; text-align: left; background: rgba(255,255,255,0.05); padding: 2rem; border: 1px solid rgba(255,255,255,0.1);">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                    <div>
                        <span style="color: rgba(255,255,255,0.5); font-size: 0.7rem; font-weight: 900; display: block; margin-bottom: 0.3rem;">CORRECT UNITS</span>
                        <span style="color: #43E8B1; font-family: monospace; font-weight: 900; font-size: 1.4rem;">${levelAnswers}</span>
                    </div>
                    <div>
                        <span style="color: rgba(255,255,255,0.5); font-size: 0.7rem; font-weight: 900; display: block; margin-bottom: 0.3rem;">MISSION MISTAKES</span>
                        <span style="color: #ff0033; font-family: monospace; font-weight: 900; font-size: 1.4rem;">${levelMistakes}</span>
                    </div>
                </div>
                
                <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <span style="color: rgba(255,255,255,0.5); font-size: 0.7rem; font-weight: 900;">LEVEL COMPLETION BONUS</span>
                        <span style="color: #6C63FF; font-family: monospace; font-weight: 900;">+${(currentLevel * 1000).toLocaleString()}</span>
                    </div>
                    ${levelMistakes === 0 ? `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <span style="color: #43E8B1; font-size: 0.7rem; font-weight: 900;">PERFECT MISSION MULTIPLIER</span>
                        <span style="color: #43E8B1; font-family: monospace; font-weight: 900;">+5,000</span>
                    </div>
                    ` : ''}
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 1rem;">
                        <span style="color: #fff; font-size: 0.8rem; font-weight: 900;">TOTAL DATA MASTERY</span>
                        <span style="color: #fff; font-family: monospace; font-weight: 900; font-size: 1.5rem;">${(currentScore + (currentLevel * 1000) + (levelMistakes === 0 ? 5000 : 0)).toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div style="display: flex; gap: 1rem;">
                <button id="replay-level-btn" style="flex: 1; padding: 1rem; background: transparent; color: #fff; border: 2px solid #fff; cursor: pointer; font-weight: 900; letter-spacing: 1px; font-size: 0.9rem;">REPLAY MISSION</button>
                <button id="next-level-btn" style="flex: 2; padding: 1.2rem; background: #6C63FF; color: #fff; border: none; cursor: pointer; font-weight: 900; letter-spacing: 2px; font-size: 1.1rem;">PROCEED TO LEVEL ${currentLevel + 1}</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    
    document.getElementById('replay-level-btn').onclick = () => {
        overlay.remove();
        resetGame(true);
    };

    document.getElementById('next-level-btn').onclick = () => {
        // Apply Bonuses
        currentScore += (currentLevel * 1000);
        if (levelMistakes === 0) currentScore += 5000;
        
        overlay.remove();
        if (currentLevel >= 5) {
            showWinScreen();
        } else {
            currentLevel++;
            resetGame(true);
        }
    };
}

function updateLivesHUD() {
    const hearts = document.querySelectorAll('.lives-container .heart');
    hearts.forEach((h, i) => {
        if (i >= lives) h.classList.add('lost');
        else h.classList.remove('lost');
    });
}

function updateMasteryBadges() {
    const badges = document.querySelectorAll('#mastery-badges .heart');
    badges.forEach((b, i) => {
        // Levels are 1-indexed. Completed levels are those less than currentLevel (unless at level 5 win)
        if (i < currentLevel - 1) {
            b.style.opacity = '1';
            b.style.background = '#43E8B1';
            b.style.boxShadow = '0 0 10px #43E8B1';
        } else {
            b.style.opacity = '0.2';
            b.style.background = '#fff';
            b.style.boxShadow = 'none';
        }
    });
}

function showGameOver() {
    isGameActive = false;
    const overlay = document.createElement('div');
    overlay.id = 'game-over-overlay';
    overlay.className = 'overlay-active';
    overlay.innerHTML = `
        <div class="brutalist-panel" style="padding: 3rem; text-align: center;">
            <h1 style="color: #ff0033; font-size: 3rem; margin: 0;">MISSION FAILED</h1>
            <p style="color: #fff; margin: 1rem 0;">FINAL SCORE: ${currentScore}</p>
            <button id="retry-btn" style="padding: 1rem 2rem; background: #6C63FF; color: #fff; border: none; cursor: pointer; font-weight: 900;">RETRY MISSION</button>
        </div>
    `;
    document.body.appendChild(overlay);
    
    document.getElementById('retry-btn').onclick = () => {
        resetGame();
    };
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

// Start Animation Loop
renderer.setAnimationLoop(animate);// Message Handling for Platform Integration
window.addEventListener('message', (e) => {
    const data = e.data;
    if (data.type === 'INIT_GAME') {
        console.log(" ENGINE: Received INIT_GAME payload\, data);
 if (data.questions) {
 // Update question pool if provided
 if (typeof questionPool !== 'undefined') {
 questionPool.basic = data.questions;
 questionPool.advanced = data.questions;
 }
 }
 if (data.startLevel) {
 currentLevel = data.startLevel;
 if (typeof statLevel !== 'undefined' && statLevel) statLevel.textContent = currentLevel;
 // Reset state for new starting level
 levelAnswers = 0;
 levelMistakes = 0;
 currentScore = 0;
 }
 if (data.zenMode !== undefined) {
 zenMode = data.zenMode;
 if (zenMode) {
 console.log(\ENGINE: ZEN MODE ENABLED via INIT_GAME\);
 const statusEl = document.getElementById('loading-status');
 if (statusEl) statusEl.textContent = \ZEN MODE: FREE DRIVE ACTIVE\;
 }
 }
 }
});
