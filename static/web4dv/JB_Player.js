import WEB4DS from './web4dvImporter.js'

let renderer
const canvas = document.getElementById('canvas4D')
const container = document.getElementById('D3container')

/**
 * Renderer
 */
const context = canvas.getContext('webgl')
renderer = new THREE.WebGLRenderer({
    canvas,
    context
})
// Shadow Settings
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * Scene
 */
let scene = new THREE.Scene()
scene.background = new THREE.Color(0xefede4)

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
    50,
    container.offsetWidth / container.offsetHeight,
    0.1, 1000
)
// Position
camera.position.set(3,1,0)
scene.add(camera)

/**
 * OrbitControls
 */
const controls = new THREE.OrbitControls(camera, canvas)
controls.enableDamping = true

// Mouse Events
controls.mouseButtons = {
    LEFT: THREE.MOUSE.ROTATE,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: false
}

// Zoom Events
controls.maxDistance = 5 // Max Zoom
controls.minDistance = 2 // Min Zoom
controls.maxPolarAngle = Math.PI / 2 // Max Rotate

// Set Renderer dimensions & append to HTML
renderer.setSize(container.offsetWidth, container.offsetHeight);
container.appendChild(renderer.domElement);

/**
 * Create JB_Player
 */
export default class JB_Player {
    constructor(url, urlM = null, position = [0, -1, 0]){
        this.urlD = url
        this.position = position
        this.urlM = urlM

        return this.playURL()
    }

    playURL() {
        let model = new WEB4DS('mainModel', this.urlD, this.urlM, null, this.position, renderer, scene, camera)

        model.load(true, false)
        model.keepsChunksInCache(true)

        return model
    }
}

// Resize Event
window.addEventListener('resize', () => {
    camera.aspect = container.offsetWidth / container.offsetHeight;
	camera.updateProjectionMatrix()

	renderer.setSize(container.offsetWidth, container.offsetHeight);
})

// Loop
function animate() {
    renderer.render(scene, camera);
    controls.update();
    
    window.requestAnimationFrame(animate);
}

animate();