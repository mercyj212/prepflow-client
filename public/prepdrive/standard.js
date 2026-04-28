import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// Scene Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87b8d8);
scene.fog = new THREE.Fog(0xc8dde8, 80, 280);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 300);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
document.getElementById('root').appendChild(renderer.domElement);

// Audio System
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let engineOsc, windNoise, masterGain;

function initAudio() {
  if (masterGain) return;
  masterGain = audioCtx.createGain();
  masterGain.connect(audioCtx.destination);
  masterGain.gain.value = 0.3;
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

// Post Processing
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.15, 0.05, 0.92);
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

// Environment
const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9, metalness: 0.1 });
const grassMaterial = new THREE.MeshStandardMaterial({ color: 0x6b7a5a, roughness: 1.0 });

const roadLength = 10000;
const roadWidth = 16;
const roadGeo = new THREE.PlaneGeometry(roadWidth, roadLength);
const road = new THREE.Mesh(roadGeo, roadMaterial);
road.rotation.x = -Math.PI / 2;
road.position.set(0, 0, -roadLength/2 + 50);
scene.add(road);

const groundGeo = new THREE.PlaneGeometry(400, 1200);
const ground = new THREE.Mesh(groundGeo, grassMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.set(0, -0.05, -100);
scene.add(ground);

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.8));
const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight.position.set(100, 150, 80);
scene.add(dirLight);

// Game State
let isGameActive = false;
let carSpeed = 0;
let sideVelocity = 0;
let currentLevel = 1;
let currentScore = 0;
let levelAnswers = 0;
let lives = 3;
let zenMode = true; // Default to true for this standalone mode
const questionsPerLevel = [10, 10, 10, 10, 10];

const carGroup = new THREE.Group();
carGroup.position.set(0, 0, 10);
scene.add(carGroup);

// HUD Elements
const statScore = document.getElementById('stat-score');
const statLevel = document.getElementById('stat-level');
const statUnitCurrent = document.getElementById('stat-unit-current');
const statUnitTotal = document.getElementById('stat-unit-total');
const statTime = document.getElementById('stat-time');
const speedoValue = document.getElementById('speedo-value');
const progressBar = document.getElementById('progress-bar');
const startOverlay = document.getElementById('start-overlay');
const startBtn = document.getElementById('start-btn');
const loadingStatus = document.getElementById('loading-status');

// Controls
const keys = { w: false, a: false, s: false, d: false, space: false };
window.addEventListener('keydown', (e) => {
    if (e.key === 'w' || e.key === 'ArrowUp') keys.w = true;
    if (e.key === 's' || e.key === 'ArrowDown') keys.s = true;
    if (e.key === 'a' || e.key === 'ArrowLeft') keys.a = true;
    if (e.key === 'd' || e.key === 'ArrowRight') keys.d = true;
    if (e.key === ' ') keys.space = true;
});
window.addEventListener('keyup', (e) => {
    if (e.key === 'w' || e.key === 'ArrowUp') keys.w = false;
    if (e.key === 's' || e.key === 'ArrowDown') keys.s = false;
    if (e.key === 'a' || e.key === 'ArrowLeft') keys.a = false;
    if (e.key === 'd' || e.key === 'ArrowRight') keys.d = false;
    if (e.key === ' ') keys.space = false;
});

// Checkpoints
const checkpointPositions = [];
for (let i = 1; i <= 20; i++) checkpointPositions.push(-i * 350);
const passedCheckpoints = new Set();

const checkpointNotify = document.createElement('div');
checkpointNotify.className = 'checkpoint-notify';
checkpointNotify.style.display = 'none';
document.body.appendChild(checkpointNotify);

function onCheckpointPassed(idx) {
    passedCheckpoints.add(idx);
    currentScore += 1500;
    levelAnswers++;
    
    checkpointNotify.textContent = "CHECKPOINT REACHED // ZEN FLOW ACTIVE";
    checkpointNotify.style.display = 'block';
    setTimeout(() => checkpointNotify.style.display = 'none', 2000);

    if (levelAnswers >= questionsPerLevel[currentLevel - 1]) {
        spawnFinishZone(carGroup.position.z - 150);
        checkpointNotify.textContent = "DESTINATION LOCKED // PROCEED TO ARRIVAL ZONE";
    }
}

let finishZone = null;
function spawnFinishZone(z) {
    if (finishZone) return;
    const geo = new THREE.PlaneGeometry(16, 20);
    const mat = new THREE.MeshBasicMaterial({ color: 0x43E8B1, transparent: true, opacity: 0.3, side: THREE.DoubleSide });
    finishZone = new THREE.Mesh(geo, mat);
    finishZone.rotation.x = -Math.PI / 2;
    finishZone.position.set(0, 0.05, z);
    scene.add(finishZone);
}

// Game Loop
function animate() {
    if (!isGameActive) return;
    
    // Physics
    if (keys.w) carSpeed = Math.min(carSpeed + 0.005, 0.7);
    else if (keys.s) carSpeed = Math.max(carSpeed - 0.015, 0);
    else carSpeed = Math.max(carSpeed - 0.002, 0);

    if (keys.a) sideVelocity = Math.max(sideVelocity - 0.005, -0.05);
    else if (keys.d) sideVelocity = Math.min(sideVelocity + 0.005, 0.05);
    else sideVelocity *= 0.9;

    carGroup.position.x += sideVelocity * 10;
    carGroup.position.x = Math.max(-7, Math.min(7, carGroup.position.x));
    carGroup.position.z -= carSpeed * 5;

    // Checkpoints
    checkpointPositions.forEach((z, idx) => {
        if (!passedCheckpoints.has(idx) && carGroup.position.z < z) {
            onCheckpointPassed(idx);
        }
    });

    // Finish Check
    if (finishZone && carGroup.position.z < finishZone.position.z) {
        completeLevel();
    }

    // HUD Update
    if (statScore) statScore.textContent = Math.floor(currentScore).toString().padStart(6, '0');
    if (speedoValue) speedoValue.textContent = Math.floor(carSpeed * 200);
    if (statUnitCurrent) statUnitCurrent.textContent = levelAnswers;
    if (progressBar) progressBar.style.width = `${(levelAnswers / 10) * 100}%`;

    composer.render();
}
renderer.setAnimationLoop(animate);

function completeLevel() {
    isGameActive = false;
    checkpointNotify.textContent = "MISSION COMPLETE // DATA SYNCED";
    checkpointNotify.style.display = 'block';
    
    setTimeout(() => {
        window.parent.postMessage({
            type: 'GAME_OVER',
            score: currentScore,
            awards: 5,
            failedQuestions: []
        }, '*');
    }, 3000);
}

// Assets (Using fallback car for simplicity in this standalone mode)
function createFallbackCar() {
    const group = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(2, 0.5, 4.5), new THREE.MeshStandardMaterial({ color: 0x43E8B1 }));
    body.position.set(0, 0.4, 0);
    group.add(body);
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.6, 2), new THREE.MeshStandardMaterial({ color: 0x111111 }));
    cabin.position.set(0, 0.9, -0.2);
    group.add(cabin);
    carGroup.add(group);
}
createFallbackCar();

// Start
startBtn.onclick = () => {
    initAudio();
    startOverlay.style.display = 'none';
    isGameActive = true;
};
startBtn.style.display = 'block';
loadingStatus.textContent = 'SYSTEM READY';

// Messaging
window.addEventListener('message', (e) => {
    if (e.data.type === 'INIT_GAME') {
        console.log("ZEN ENGINE: Received INIT_GAME", e.data);
        currentLevel = e.data.startLevel || 1;
        
        // Update HUD
        if (statLevel) statLevel.textContent = currentLevel;
        if (statUnitTotal) statUnitTotal.textContent = questionsPerLevel[currentLevel - 1];
        if (statUnitCurrent) statUnitCurrent.textContent = "0";
        if (progressBar) progressBar.style.width = "0%";
        
        // Reset state for new level
        levelAnswers = 0;
        currentScore = 0;
        if (statScore) statScore.textContent = "0";
        passedCheckpoints.clear();
    }
});
