
import './style.css'
import * as THREE from 'three'

// JARVIS 3D CORE
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
)

camera.position.z = 7

const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true
})

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(window.innerWidth, window.innerHeight)

document.querySelector('#jarvis-core').appendChild(renderer.domElement)

// Main glowing sphere
const geometry = new THREE.IcosahedronGeometry(1.15, 2)

const material = new THREE.MeshBasicMaterial({
  color: 0x16cfff,
  wireframe: true,
  transparent: true,
  opacity: 0.8
})

const core = new THREE.Mesh(geometry, material)
scene.add(core)

// Outer rings
const rings = []

for (let i = 0; i < 3; i++) {
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.5 + i * 0.22, 0.008, 8, 120),
    new THREE.MeshBasicMaterial({
      color: 0x16cfff,
      transparent: true,
      opacity: 0.5 - i * 0.1
    })
  )

  ring.rotation.x = Math.PI / 2 + i * 0.4
  ring.rotation.y = i * 0.7

  scene.add(ring)
  rings.push(ring)
}

// Animation
function animate() {
  requestAnimationFrame(animate)

  core.rotation.x += 0.002
  core.rotation.y += 0.004

  rings.forEach((ring, index) => {
    ring.rotation.z += 0.002 * (index + 1)
  })

  renderer.render(scene, camera)
}

animate()

// Responsive 3D canvas
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
})

// LIVE CLOCK
function updateClock() {
  const now = new Date()

  document.querySelector('#clock').textContent =
    now.toLocaleTimeString('en-IN')

  document.querySelector('#date').textContent =
    now.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    })
}

updateClock()
setInterval(updateClock, 1000)

// TASK INTERACTION
document.querySelector('#add-task').addEventListener('click', () => {
  const input = document.querySelector('#task-input')
  const value = input.value.trim()

  if (!value) return

  const task = document.createElement('div')
  task.className = 'task'
  task.textContent = value

  document.querySelector('#task-list').appendChild(task)

  input.value = ''
})

// DEMO VOICE BUTTON
document.querySelector('#voice-button').addEventListener('click', () => {
  const message = document.querySelector('#assistant-message')

  message.textContent = 'JARVIS is listening...'

  if (!('webkitSpeechRecognition' in window ||
        'SpeechRecognition' in window)) {
    message.textContent = 'Voice recognition is not supported in this browser.'
    return
  }

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition

  const recognition = new SpeechRecognition()

  recognition.lang = 'en-IN'
  recognition.start()

  recognition.onresult = (event) => {
    message.textContent = event.results[0][0].transcript
  }

  recognition.onerror = () => {
    message.textContent = 'Could not hear you. Please try again.'
  }
})
