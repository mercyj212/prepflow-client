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
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
document.getElementById('root').appendChild(renderer.domElement);

// Audio System
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let engineOsc, windNoise, masterGain;
const GAME_AUDIO_LEVEL = 0.16;

function setGameAudioActive(active) {
  if (!masterGain || audioCtx.state === 'closed') return;
  const target = active ? GAME_AUDIO_LEVEL : 0.0001;
  masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
  masterGain.gain.setTargetAtTime(target, audioCtx.currentTime, active ? 0.12 : 0.03);
}

function stopGameAudioNow() {
  if (!masterGain || audioCtx.state === 'closed') return;
  masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
  masterGain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
}
window.stopGameAudioNow = stopGameAudioNow;

function initAudio() {
  if (masterGain) return;
  masterGain = audioCtx.createGain();
  const compressor = audioCtx.createDynamicsCompressor();
  compressor.threshold.value = -28;
  compressor.knee.value = 24;
  compressor.ratio.value = 6;
  compressor.attack.value = 0.008;
  compressor.release.value = 0.18;
  masterGain.connect(compressor);
  compressor.connect(audioCtx.destination);
  masterGain.gain.value = 0.0001;
  engineOsc = audioCtx.createOscillator();
  engineOsc.type = 'triangle';
  const engineBodyOsc = audioCtx.createOscillator();
  engineBodyOsc.type = 'sine';
  const engineGain = audioCtx.createGain();
  const engineBodyGain = audioCtx.createGain();
  const engineFilter = audioCtx.createBiquadFilter();
  engineFilter.type = 'lowpass';
  engineFilter.frequency.value = 220;
  engineFilter.Q.value = 0.45;
  engineOsc.connect(engineFilter);
  engineBodyOsc.connect(engineBodyGain);
  engineFilter.connect(engineGain);
  engineGain.connect(masterGain);
  engineBodyGain.connect(masterGain);
  engineGain.gain.value = 0.045;
  engineBodyGain.gain.value = 0.035;
  engineOsc.start();
  engineBodyOsc.start();
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
  windGain.gain.value = 0.015;
  windNoise.start();
  window.audioData = { engineBodyOsc, engineFilter, engineGain, engineOsc, windFilter, windGain };
}

function playSFX(freq, type, duration) {
  if (!masterGain) return;
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();
  osc.type = type === 'square' || type === 'sawtooth' ? 'triangle' : type;
  filter.type = 'lowpass';
  filter.frequency.value = type === 'sawtooth' ? 360 : 1400;
  filter.Q.value = 0.5;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq * 0.45), audioCtx.currentTime + duration);
  g.gain.setValueAtTime(type === 'sawtooth' || type === 'square' ? 0.075 : 0.09, audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
  osc.connect(filter);
  filter.connect(g);
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
const urlStartLevel = Number(new URLSearchParams(window.location.search).get('level'));
let currentLevel = Number.isInteger(urlStartLevel) && urlStartLevel >= 1 ? Math.min(urlStartLevel, 5) : 1;
let currentScore = 0;
let levelAnswers = 0;
let lives = 3;
let zenMode = true; // Default to true for this standalone mode
const questionsPerLevel = [10, 10, 10, 10, 10];
const levelThemes = [
    { sky: 0x87b8d8, fog: 0xc8dde8, ground: 0x6b7a5a, road: 0x222222, car: 0x43E8B1 },
    { sky: 0xff7f54, fog: 0xffd0a3, ground: 0x2d5a3d, road: 0x242326, car: 0xffc857 },
    { sky: 0x0a1028, fog: 0x1b2a4a, ground: 0x141820, road: 0x111116, car: 0x6c63ff },
    { sky: 0xb9f6ff, fog: 0xe0fbff, ground: 0xb7c7a3, road: 0x3b3a36, car: 0x2f6690 },
    { sky: 0x160f29, fog: 0x302b63, ground: 0x0b132b, road: 0x09090b, car: 0xf72585 }
];

const carGroup = new THREE.Group();
carGroup.position.set(0, 0, 10);
scene.add(carGroup);

function applyLevelTheme(level) {
    const theme = levelThemes[(Math.max(1, level) - 1) % levelThemes.length];
    scene.background = new THREE.Color(theme.sky);
    if (scene.fog) scene.fog.color.setHex(theme.fog);
    roadMaterial.color.setHex(theme.road);
    grassMaterial.color.setHex(theme.ground);
    carGroup.traverse((node) => {
        if (node.isMesh && node.material && node.geometry?.type === 'BoxGeometry') {
            node.material.color.setHex(theme.car);
        }
    });
}

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
const pedalAccel = document.getElementById('pedal-accel');
const pedalBrake = document.getElementById('pedal-brake');
const nitroBtn = document.getElementById('nitro-btn');
const steeringZone = document.getElementById('steering-zone');
const joystickKnob = document.getElementById('joystick-knob');
const steeringWheelIcon = document.getElementById('steering-wheel-icon');

// Controls
const keys = { w: false, a: false, s: false, d: false, space: false };
let joystickActive = false;
let joystickSteer = 0;
let tiltSteer = 0;
let tiltNeutral = 0;
let tiltCalibrated = false;
let tiltControlsEnabled = false;
const JOYSTICK_DEADZONE = 10;
const TILT_DEADZONE = 3;
const TILT_FULL_LOCK = 22;

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function updateSteeringVisual(steer) {
    const clampedSteer = clamp(steer, -1, 1);
    if (steeringWheelIcon) steeringWheelIcon.style.transform = `rotate(${clampedSteer * 95}deg)`;
    if (joystickKnob && steeringZone) {
        const maxTravel = steeringZone.getBoundingClientRect().width * 0.28;
        joystickKnob.style.transform = `translate(-50%, -50%) translateX(${clampedSteer * maxTravel}px)`;
    }
}

function getLateralTilt(event) {
    const orientation = screen.orientation?.angle ?? window.orientation ?? 0;
    if (Math.abs(orientation) === 90) {
        return orientation > 0 ? event.beta : -event.beta;
    }
    return event.gamma;
}

function handleDeviceTilt(event) {
    const lateralTilt = getLateralTilt(event);
    if (typeof lateralTilt !== 'number' || Number.isNaN(lateralTilt)) return;

    if (!tiltCalibrated) {
        tiltNeutral = lateralTilt;
        tiltCalibrated = true;
    }

    const delta = lateralTilt - tiltNeutral;
    const absDelta = Math.abs(delta);
    const rawSteer = absDelta <= TILT_DEADZONE
        ? 0
        : Math.sign(delta) * clamp((absDelta - TILT_DEADZONE) / (TILT_FULL_LOCK - TILT_DEADZONE), 0, 1);

    tiltSteer = THREE.MathUtils.lerp(tiltSteer, rawSteer, 0.28);
}

async function enableTiltControls() {
    if (tiltControlsEnabled || typeof window.DeviceOrientationEvent === 'undefined') return;

    try {
        if (typeof window.DeviceOrientationEvent.requestPermission === 'function') {
            const permission = await window.DeviceOrientationEvent.requestPermission();
            if (permission !== 'granted') return;
        }

        window.addEventListener('deviceorientation', handleDeviceTilt, true);
        tiltControlsEnabled = true;
    } catch (error) {
        console.warn('Tilt controls unavailable:', error);
    }
}

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

function getJoystickDelta(clientX) {
    if (!steeringZone) return 0;
    const rect = steeringZone.getBoundingClientRect();
    const maxTravel = Math.max(36, rect.width * 0.38);
    const centerX = rect.left + rect.width / 2;
    return clamp(clientX - centerX, -maxTravel, maxTravel);
}

function applyJoystick(delta) {
    const rect = steeringZone?.getBoundingClientRect();
    const maxTravel = Math.max(36, (rect?.width || 120) * 0.38);
    joystickSteer = clamp(delta / maxTravel, -1, 1);
    updateSteeringVisual(joystickSteer);

    if (Math.abs(delta) < JOYSTICK_DEADZONE) {
        keys.a = false;
        keys.d = false;
    } else if (delta < 0) {
        keys.a = true;
        keys.d = false;
    } else {
        keys.d = true;
        keys.a = false;
    }
}

function resetJoystick() {
    joystickActive = false;
    joystickSteer = 0;
    updateSteeringVisual(tiltSteer);
    keys.a = false;
    keys.d = false;
}

pedalAccel?.addEventListener('touchstart', (e) => { e.preventDefault(); keys.w = true; pedalAccel.classList.add('active'); }, { passive: false });
pedalAccel?.addEventListener('touchend', () => { keys.w = false; pedalAccel.classList.remove('active'); });
pedalBrake?.addEventListener('touchstart', (e) => { e.preventDefault(); keys.s = true; pedalBrake.classList.add('active'); }, { passive: false });
pedalBrake?.addEventListener('touchend', () => { keys.s = false; pedalBrake.classList.remove('active'); });
nitroBtn?.addEventListener('touchstart', (e) => { e.preventDefault(); keys.space = true; nitroBtn.classList.add('active'); }, { passive: false });
nitroBtn?.addEventListener('touchend', () => { keys.space = false; nitroBtn.classList.remove('active'); });
pedalAccel?.addEventListener('mousedown', () => { keys.w = true; pedalAccel.classList.add('active'); });
pedalBrake?.addEventListener('mousedown', () => { keys.s = true; pedalBrake.classList.add('active'); });
nitroBtn?.addEventListener('mousedown', () => { keys.space = true; nitroBtn.classList.add('active'); });
window.addEventListener('mouseup', () => {
    keys.w = false;
    keys.s = false;
    keys.space = false;
    pedalAccel?.classList.remove('active');
    pedalBrake?.classList.remove('active');
    nitroBtn?.classList.remove('active');
    if (joystickActive) resetJoystick();
});
steeringZone?.addEventListener('touchstart', (e) => { e.preventDefault(); joystickActive = true; applyJoystick(getJoystickDelta(e.touches[0].clientX)); }, { passive: false });
steeringZone?.addEventListener('touchmove', (e) => { e.preventDefault(); if (joystickActive) applyJoystick(getJoystickDelta(e.touches[0].clientX)); }, { passive: false });
steeringZone?.addEventListener('touchend', resetJoystick);
steeringZone?.addEventListener('touchcancel', resetJoystick);
steeringZone?.addEventListener('mousedown', (e) => { joystickActive = true; applyJoystick(getJoystickDelta(e.clientX)); });
window.addEventListener('mousemove', (e) => { if (joystickActive) applyJoystick(getJoystickDelta(e.clientX)); });

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
    if (!isGameActive) {
        setGameAudioActive(false);
        composer.render();
        return;
    }
    setGameAudioActive(true);
    
    // Physics
    if (keys.w) carSpeed = Math.min(carSpeed + 0.005, 0.7);
    else if (keys.s) carSpeed = Math.max(carSpeed - 0.015, 0);
    else carSpeed = Math.max(carSpeed - 0.002, 0);

    const keyboardSteer = keys.a ? -1 : keys.d ? 1 : 0;
    const activeSteer = keyboardSteer || joystickSteer || tiltSteer;
    updateSteeringVisual(activeSteer);
    if (Math.abs(activeSteer) > 0.04) sideVelocity = clamp(sideVelocity + 0.005 * activeSteer, -0.05, 0.05);
    else sideVelocity *= 0.9;

    carGroup.position.x += sideVelocity * 10;
    carGroup.position.x = Math.max(-7, Math.min(7, carGroup.position.x));
    carGroup.position.z -= carSpeed * 5;
    carGroup.rotation.z = THREE.MathUtils.lerp(carGroup.rotation.z, -sideVelocity * 1.4 - activeSteer * 0.04, 0.12);
    carGroup.rotation.y = THREE.MathUtils.lerp(carGroup.rotation.y, -sideVelocity * 0.8, 0.12);

    if (window.audioData) {
        const { engineBodyOsc, engineOsc, engineFilter, engineGain, windFilter, windGain } = window.audioData;
        const freq = 48 + carSpeed * 82 + (keys.space ? 18 : 0);
        engineOsc.frequency.setTargetAtTime(freq, audioCtx.currentTime, 0.1);
        engineBodyOsc.frequency.setTargetAtTime(freq * 0.5, audioCtx.currentTime, 0.1);
        engineFilter.frequency.setTargetAtTime(180 + carSpeed * 360, audioCtx.currentTime, 0.14);
        engineGain.gain.setTargetAtTime(keys.w ? 0.06 : 0.032, audioCtx.currentTime, 0.2);
        windFilter.frequency.setTargetAtTime(160 + carSpeed * 620, audioCtx.currentTime, 0.14);
        windGain.gain.setTargetAtTime(carSpeed * 0.04, audioCtx.currentTime, 0.16);
    }

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
            success: true,
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
applyLevelTheme(currentLevel);

// Start
startBtn.onclick = () => {
    initAudio();
    enableTiltControls();
    startOverlay.style.display = 'none';
    isGameActive = true;
    setGameAudioActive(true);
};
startBtn.style.display = 'block';
loadingStatus.textContent = 'SYSTEM READY';

// Messaging
window.addEventListener('message', (e) => {
    if (e.data.type === 'INIT_GAME') {
        console.log("ZEN ENGINE: Received INIT_GAME", e.data);
        currentLevel = e.data.startLevel || 1;
        applyLevelTheme(currentLevel);
        
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

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener('visibilitychange', () => {
    if (document.hidden) stopGameAudioNow();
});
window.addEventListener('pagehide', stopGameAudioNow);
window.addEventListener('beforeunload', stopGameAudioNow);
