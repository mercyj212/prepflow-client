import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export class PrepDriveEngine {
    constructor(container, callbacks) {
        this.container = container;
        this.callbacks = callbacks;
        
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.composer = null;
        this.isGameActive = false;
        
        this.carGroup = new THREE.Group();
        this.carSpeed = 0;
        this.currentLane = 1;
        this.targetX = 0;
        this.lanePositions = [-4.5, -1.5, 1.5, 4.5];
        
        this.trafficVehicles = [];
        this.trafficTemplates = [];
        this.buildings = null;
        this.barriers = null;
        this.cyberFlora = null;
        this.celebrationActive = false;
        
        this.checkpointDistance = 300;
        this.roundStartZ = 0;
        this.isCheckpointTriggered = false;
        
        this.clock = new THREE.Clock();
        this.loader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
        this.loader.setDRACOLoader(dracoLoader);
        
        this.init();
    }

    async init() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x020205);
        this.scene.fog = new THREE.FogExp2(0x020205, 0.003);

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
        this.camera.position.set(0, 5, 12);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ReinhardToneMapping;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.container.appendChild(this.renderer.domElement);

        // Post Processing
        const renderScene = new RenderPass(this.scene, this.camera);
        const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
        bloomPass.threshold = 0.25;
        bloomPass.strength = 1.2;
        bloomPass.radius = 0.6;

        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(renderScene);
        this.composer.addPass(bloomPass);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        this.scene.add(ambientLight);

        const mainLight = new THREE.DirectionalLight(0x6C63FF, 2);
        mainLight.position.set(20, 50, 20);
        this.scene.add(mainLight);

        // Environment Map (RoomEnvironment for realistic reflections)
        const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
        pmremGenerator.compileEquirectangularShader();
        this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

        // Assets
        await this.loadAssets();
        this.createRoad();
        this.createEnvironment();
        this.createCyberFlora();
        
        this.scene.add(this.carGroup);

        this.animate();
        
        window.addEventListener('resize', () => this.onResize());
    }

    async loadAssets() {
        // Load Player Car — fall back to a procedural box if GLB fails
        try {
            const carData = await this.loader.loadAsync('/assets/drive/models/Car.glb');
            const playerModel = carData.scene;
            this.normalizeModel(playerModel, 3);
            this.carGroup.add(playerModel);
        } catch (e) {
            console.warn('Player car GLB failed, using fallback geometry:', e.message);
            const fallbackGeo = new THREE.BoxGeometry(2, 1, 4);
            const fallbackMat = new THREE.MeshStandardMaterial({ color: 0x6C63FF, metalness: 0.8, roughness: 0.2 });
            const fallbackMesh = new THREE.Mesh(fallbackGeo, fallbackMat);
            fallbackMesh.position.y = 0.5;
            this.carGroup.add(fallbackMesh);
        }

        // Load Traffic Templates — each loaded independently so one failure doesn't block others
        const trafficPaths = [
            '/assets/drive/models/CAR Model.glb',
        ];
        for (const path of trafficPaths) {
            try {
                const data = await this.loader.loadAsync(path);
                const model = data.scene;
                this.normalizeModel(model, 3);
                this.trafficTemplates.push(model);
            } catch (e) {
                console.warn(`Traffic model failed (${path}), using fallback:`, e.message);
                const g = new THREE.BoxGeometry(2, 1.2, 4);
                const m = new THREE.MeshStandardMaterial({ color: 0x334455, metalness: 0.6, roughness: 0.3 });
                const mesh = new THREE.Mesh(g, m);
                mesh.position.y = 0.6;
                const fallback = new THREE.Group();
                fallback.add(mesh);
                this.trafficTemplates.push(fallback);
            }
        }
    }

    normalizeModel(group, targetWidth) {
        const box = new THREE.Box3().setFromObject(group);
        const size = box.getSize(new THREE.Vector3());
        const scale = targetWidth / size.x;
        group.scale.set(scale, scale, scale);
        
        // Center bottom
        const newBox = new THREE.Box3().setFromObject(group);
        const center = newBox.getCenter(new THREE.Vector3());
        group.position.y -= center.y - (newBox.max.y - newBox.min.y)/2;
        
        // Unified EnvMap (handle single and multi-material meshes)
        group.traverse(child => {
            if (child.isMesh) {
                const mats = Array.isArray(child.material) ? child.material : [child.material];
                mats.forEach(mat => {
                    mat.envMap = this.scene.environment;
                    mat.needsUpdate = true;
                });
            }
        });
    }

    createRoad() {
        const roadWidth = 24;
        const roadLength = 10000;
        
        const roadGeo = new THREE.PlaneGeometry(roadWidth, roadLength, 1, 100);
        const roadMat = new THREE.MeshStandardMaterial({ 
            color: 0x050505,
            roughness: 0.2,
            metalness: 0.9
        });
        const road = new THREE.Mesh(roadGeo, roadMat);
        road.rotation.x = -Math.PI / 2;
        road.position.z = -roadLength / 2 + 50;
        this.scene.add(road);

        // Glowing Lane Markers
        for (let i = 0; i < 5; i++) {
            const x = (i - 2) * 6;
            const lineGeo = new THREE.PlaneGeometry(0.15, roadLength);
            const lineMat = new THREE.MeshBasicMaterial({ color: i === 0 || i === 4 ? 0x6C63FF : 0x222222 });
            const line = new THREE.Mesh(lineGeo, lineMat);
            line.rotation.x = -Math.PI / 2;
            line.position.set(x, 0.05, road.position.z);
            this.scene.add(line);
        }
    }

    createEnvironment() {
        // Buildings (InstancedMesh)
        const buildingCount = 200;
        const buildingGeo = new THREE.BoxGeometry(10, 50, 10);
        const buildingMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.1 });
        this.buildings = new THREE.InstancedMesh(buildingGeo, buildingMat, buildingCount);
        
        const dummy = new THREE.Object3D();
        for (let i = 0; i < buildingCount; i++) {
            const side = Math.random() > 0.5 ? 1 : -1;
            dummy.position.set(side * (30 + Math.random() * 50), 25, -i * 50);
            dummy.scale.set(1, 1 + Math.random() * 2, 1);
            dummy.updateMatrix();
            this.buildings.setMatrixAt(i, dummy.matrix);
        }
        this.scene.add(this.buildings);
    }

    createCyberFlora() {
        const count = 500;
        const geo = new THREE.PlaneGeometry(0.5, 0.5);
        const mat = new THREE.MeshStandardMaterial({ 
            color: 0x6C63FF, 
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8,
            emissive: 0x6C63FF,
            emissiveIntensity: 2
        });
        this.cyberFlora = new THREE.InstancedMesh(geo, mat, count);
        this.cyberFlora.visible = false;
        
        this.floraData = [];
        const dummy = new THREE.Object3D();
        for (let i = 0; i < count; i++) {
            this.floraData.push({
                velocity: new THREE.Vector3((Math.random() - 0.5) * 0.5, Math.random() * 0.5, (Math.random() - 0.5) * 0.5),
                rotationSpeed: new THREE.Vector3(Math.random() * 0.1, Math.random() * 0.1, Math.random() * 0.1)
            });
            dummy.position.set(0, -100, 0); // Hide initially
            dummy.updateMatrix();
            this.cyberFlora.setMatrixAt(i, dummy.matrix);
        }
        this.scene.add(this.cyberFlora);
    }

    triggerCelebration() {
        this.celebrationActive = true;
        this.cyberFlora.visible = true;
        this.cyberFlora.position.copy(this.carGroup.position);
        this.cyberFlora.position.y += 2;
        
        const dummy = new THREE.Object3D();
        for (let i = 0; i < this.cyberFlora.count; i++) {
            dummy.position.set(0, 0, 0);
            dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
            dummy.updateMatrix();
            this.cyberFlora.setMatrixAt(i, dummy.matrix);
        }
    }

    animate() {
        if (!this.renderer) return;
        requestAnimationFrame(() => this.animate());
        
        const delta = this.clock.getDelta();

        if (this.isGameActive) {
            this.carSpeed = THREE.MathUtils.lerp(this.carSpeed, 1.2, 0.02); // Smooth ignition
            this.carGroup.position.z -= this.carSpeed;
            
            // Camera follow
            const targetCamPos = new THREE.Vector3(
                this.carGroup.position.x * 0.5,
                this.carGroup.position.y + 6,
                this.carGroup.position.z + 15
            );
            this.camera.position.lerp(targetCamPos, 0.1);
            this.camera.lookAt(this.carGroup.position.x, 2, this.carGroup.position.z - 10);

            // Steering
            this.carGroup.position.x = THREE.MathUtils.lerp(this.carGroup.position.x, this.targetX, 0.1);
            this.carGroup.rotation.y = THREE.MathUtils.lerp(this.carGroup.rotation.y, (this.targetX - this.carGroup.position.x) * 0.2, 0.1);
            this.carGroup.rotation.z = THREE.MathUtils.lerp(this.carGroup.rotation.z, (this.carGroup.position.x - this.targetX) * 0.1, 0.1);

            // Traffic
            this.updateTraffic();
            
            // Cyber Flora update
            if (this.celebrationActive) {
                const dummy = new THREE.Object3D();
                const mat4 = new THREE.Matrix4();
                for (let i = 0; i < this.cyberFlora.count; i++) {
                    this.cyberFlora.getMatrixAt(i, mat4);
                    dummy.position.setFromMatrixPosition(mat4);
                    dummy.rotation.setFromRotationMatrix(mat4);
                    
                    const data = this.floraData[i];
                    dummy.position.add(data.velocity);
                    dummy.rotation.x += data.rotationSpeed.x;
                    dummy.rotation.y += data.rotationSpeed.y;
                    
                    data.velocity.y -= 0.005; // Gravity
                    
                    dummy.updateMatrix();
                    this.cyberFlora.setMatrixAt(i, dummy.matrix);
                }
                this.cyberFlora.instanceMatrix.needsUpdate = true;
            }
            
            // Checkpoints
            this.checkCollisions();
        }

        this.composer.render();
    }

    updateTraffic() {
        if (Math.random() < 0.02 && this.trafficVehicles.length < 15) {
            this.spawnTraffic();
        }
        
        for (let i = this.trafficVehicles.length - 1; i >= 0; i--) {
            const v = this.trafficVehicles[i];
            v.position.z -= 0.6; // Traffic speed
            
            if (v.position.z > this.carGroup.position.z + 50) {
                this.scene.remove(v);
                this.trafficVehicles.splice(i, 1);
            }
        }
    }

    spawnTraffic() {
        if (this.trafficTemplates.length === 0) return;
        const template = this.trafficTemplates[Math.floor(Math.random() * this.trafficTemplates.length)];
        const v = template.clone();
        const laneIdx = Math.floor(Math.random() * 4);
        v.position.set(this.lanePositions[laneIdx], 0, this.carGroup.position.z - 200 - Math.random() * 100);
        this.scene.add(v);
        this.trafficVehicles.push(v);
    }

    checkCollisions() {
        // Simple distance check for now, can be improved to bounding boxes
        this.trafficVehicles.forEach(v => {
            const dist = this.carGroup.position.distanceTo(v.position);
            if (dist < 4) {
                // Collision!
                this.carSpeed *= 0.5;
            }
        });
        
        // Distance-based checkpoint trigger
        const distanceTraveled = this.roundStartZ - this.carGroup.position.z;
        if (distanceTraveled >= this.checkpointDistance && !this.isCheckpointTriggered) {
            this.isCheckpointTriggered = true;
            this.callbacks.onCheckpoint(this.currentLane);
            this.stop();
        }
    }

    setLane(lane) {
        this.currentLane = lane;
        this.targetX = this.lanePositions[lane];
    }

    start() {
        this.roundStartZ = this.carGroup.position.z;
        this.isCheckpointTriggered = false;
        this.isGameActive = true;
    }

    stop() {
        this.isGameActive = false;
        this.carSpeed = 0;
    }

    reset() {
        this.carGroup.position.set(0, 0, 0);
        this.carSpeed = 0;
        this.isGameActive = false;
        this.celebrationActive = false;
        this.isCheckpointTriggered = false;
        this.roundStartZ = 0;
        this.currentLane = 1;
        this.targetX = this.lanePositions[1];
        if (this.cyberFlora) this.cyberFlora.visible = false;
        
        this.trafficVehicles.forEach(v => this.scene.remove(v));
        this.trafficVehicles = [];
        
        this.camera.position.set(0, 5, 12);
        this.camera.lookAt(0, 0, -10);
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.composer.setSize(window.innerWidth, window.innerHeight);
    }

    dispose() {
        this.isGameActive = false;
        if (this.renderer) {
            this.renderer.dispose();
            this.container.removeChild(this.renderer.domElement);
        }
        window.removeEventListener('resize', () => this.onResize());
    }
}
