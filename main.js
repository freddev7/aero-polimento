import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 5000);
camera.position.set(800, 100, 300);

let object;
let controls;
let canvasClickable = true;

const loader = new GLTFLoader();

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

document.getElementById("container3D").appendChild(renderer.domElement);

const hlight = new THREE.AmbientLight(0x404040, 3);
scene.add(hlight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
directionalLight.position.set(0, 1, 0);
directionalLight.castShadow = true;
scene.add(directionalLight);

const light = new THREE.PointLight(0xc4c4c4, 1);
light.position.set(0, 300, 500);
scene.add(light);

const light2 = new THREE.PointLight(0xc4c4c4, 1);
light2.position.set(500, 100, 0);
scene.add(light2);

const light3 = new THREE.PointLight(0xc4c4c4, 1);
light3.position.set(0, 100, -500);
scene.add(light3);

const light4 = new THREE.PointLight(0xc4c4c4, 1);
light4.position.set(-500, 300, 500);
scene.add(light4);

controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = true;
controls.enablePan = false;
controls.minPolarAngle = 0;
controls.maxPolarAngle = Math.PI;
controls.target.set(0, 0, 0);

loader.load(`scene.gltf`, function (gltf) {
    object = gltf.scene;
    object.getObjectByName('Layer0_Material_#25_0').material.color.setHex(0x110821);

    // Centralize o objeto na origem
    const box = new THREE.Box3().setFromObject(object);
    const center = new THREE.Vector3();
    box.getCenter(center);
    object.position.sub(center);

    scene.add(object);

});

const colorPicker = document.getElementById('colorPicker');
colorPicker.addEventListener('input', function (event) {
    const newColor = new THREE.Color(event.target.value);
    // Certifique-se de que o objeto foi carregado antes de tentar acessar seu material
    if (object && object.getObjectByName('Layer0_Material_#25_0')) {
        // Aplique a nova cor ao material do objeto
        object.getObjectByName('Layer0_Material_#25_0').material.color.copy(newColor);
    }
});

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// Substituir o seletor de cores por um modal personalizado em dispositivos móveis
if (isMobile) {
    colorPicker.addEventListener('click', () => {
        // Implemente aqui a lógica para abrir um modal personalizado
        alert('Abrir modal personalizado para escolher a cor');
    });
}

// Adiciona event listener para teclas de seta
document.addEventListener('keydown', function (event) {
    switch (event.key) {
        case 'ArrowLeft':
            rotateObject(-0.05); // Rotaciona para a esquerda
            break;
        case 'ArrowRight':
            rotateObject(0.05); // Rotaciona para a direita
            break;
    }
});

function rotateObject(angle) {
    if (object) {
        object.rotation.y += angle;
    }
}

function animate() {
    requestAnimationFrame(animate);


    controls.update();
    renderer.render(scene, camera);
}

window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
