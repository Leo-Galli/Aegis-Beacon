import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export type DeviceButton = 'mode' | 'sel' | 'up' | 'dn'

export interface AegisDevice3DOptions {
  container: HTMLElement
  oledCanvas: HTMLCanvasElement
  onButtonPress?: (key: DeviceButton) => void
}

interface PartGroup {
  name: string
  group: THREE.Group
  base: THREE.Vector3
  explode: THREE.Vector3
}

interface LabelTarget {
  name: string
  object: THREE.Object3D
  offsetY: number
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

export class AegisDevice3D {
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private controls: OrbitControls
  private oledTexture: THREE.CanvasTexture
  private parts: PartGroup[] = []
  private shellMats: THREE.MeshPhysicalMaterial[] = []
  private ledTx: THREE.Mesh
  private ledRx: THREE.Mesh
  private raycaster = new THREE.Raycaster()
  private pointer = new THREE.Vector2()
  private buttonMeshes: THREE.Mesh[] = []
  private explode = 0
  private xray = 0
  private raf = 0
  private labelTargets: LabelTarget[] = []
  private labelMap = new Map<string, HTMLElement>()

  constructor(private opts: AegisDevice3DOptions) {
    const { container, oledCanvas } = opts
    const w = container.clientWidth || 480
    const h = container.clientHeight || 420

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0xeef1f5)
    this.scene.fog = new THREE.Fog(0xeef1f5, 14, 28)

    this.camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 100)
    this.camera.position.set(5.8, 3.4, 8.8)

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(w, h)
    this.renderer.shadowMap.enabled = true
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    container.appendChild(this.renderer.domElement)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.06
    this.controls.minDistance = 4.5
    this.controls.maxDistance = 17
    this.controls.target.set(0, 0.85, 0)

    this.oledTexture = new THREE.CanvasTexture(oledCanvas)
    this.oledTexture.colorSpace = THREE.SRGBColorSpace
    this.oledTexture.minFilter = THREE.LinearFilter
    this.oledTexture.magFilter = THREE.LinearFilter

    const labelsRoot = container.querySelector('.device-labels')
    if (labelsRoot) {
      labelsRoot.querySelectorAll('[data-part]').forEach(el => {
        this.labelMap.set(el.getAttribute('data-part')!, el as HTMLElement)
      })
    }

    this.addLights()
    const leds = this.buildDevice()
    this.ledTx = leds.tx
    this.ledRx = leds.rx

    this.renderer.domElement.addEventListener('pointerdown', this.handlePointer)
    window.addEventListener('resize', this.handleResize)
    this.animate()
  }

  private addLights() {
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.5))
    const key = new THREE.DirectionalLight(0xfff6ee, 1.15)
    key.position.set(7, 11, 9)
    key.castShadow = true
    key.shadow.mapSize.set(1024, 1024)
    this.scene.add(key)
    const fill = new THREE.DirectionalLight(0xb8c8f0, 0.5)
    fill.position.set(-6, 5, -4)
    this.scene.add(fill)
    this.scene.add(new THREE.HemisphereLight(0xf0f4fa, 0x404858, 0.4))
  }

  private shellMat() {
    const m = new THREE.MeshPhysicalMaterial({
      color: 0xd4dce6,
      metalness: 0.03,
      roughness: 0.1,
      transmission: 0.32,
      thickness: 0.55,
      transparent: true,
      opacity: 0.93,
      ior: 1.47,
      side: THREE.DoubleSide,
    })
    this.shellMats.push(m)
    return m
  }

  private box(w: number, h: number, d: number, mat: THREE.Material, cast = true) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
    m.castShadow = cast
    m.receiveShadow = true
    return m
  }

  private registerLabel(name: string, object: THREE.Object3D, offsetY: number) {
    this.labelTargets.push({ name, object, offsetY })
  }

  private addPart(name: string, group: THREE.Group, base: THREE.Vector3, explode: THREE.Vector3) {
    group.position.copy(base)
    this.parts.push({ name, group, base, explode })
    this.scene.add(group)
  }

  private buildDevice() {
    const pcbMat = new THREE.MeshStandardMaterial({ color: 0x1a5536, roughness: 0.88 })
    const copperMat = new THREE.MeshStandardMaterial({ color: 0xb07830, metalness: 0.65, roughness: 0.4 })
    const chipMat = new THREE.MeshStandardMaterial({ color: 0x262626, metalness: 0.45, roughness: 0.45 })
    const silvMat = new THREE.MeshStandardMaterial({ color: 0x909090, metalness: 0.82, roughness: 0.28 })
    const battWrap = new THREE.MeshStandardMaterial({ color: 0x356840, roughness: 0.72 })
    const battCell = new THREE.MeshStandardMaterial({ color: 0x5a7890, metalness: 0.2, roughness: 0.58 })
    const btnMat = new THREE.MeshStandardMaterial({ color: 0x343940, roughness: 0.68 })
    const btnCap = new THREE.MeshStandardMaterial({ color: 0x525860, roughness: 0.42 })

    const pcb = new THREE.Group()
    pcb.add(this.box(6.2, 0.12, 9.6, pcbMat))
    for (let i = 0; i < 9; i++) {
      const t = this.box(0.07, 0.14, 9.0, copperMat, false)
      t.position.set(-3.0 + i * 0.75, 0.08, 0)
      pcb.add(t)
    }

    const esp = new THREE.Group()
    esp.add(this.box(1.8, 0.32, 4.0, chipMat))
    const espChip = this.box(0.85, 0.06, 0.85, silvMat, false)
    espChip.position.y = 0.18
    esp.add(espChip)
    esp.position.set(-1.4, 0.72, -1.4)
    pcb.add(esp)
    this.registerLabel('esp32', esp, 0.55)

    const radio = new THREE.Group()
    radio.add(this.box(1.55, 0.26, 1.85, chipMat))
    const rfShield = this.box(0.4, 0.5, 0.4, silvMat, false)
    radio.add(rfShield)
    radio.position.set(1.45, 0.7, 1.8)
    pcb.add(radio)
    this.registerLabel('sx1262', radio, 0.5)

    const gps = this.box(1.15, 0.16, 1.15, chipMat)
    gps.position.set(-1.15, 0.66, 2.6)
    pcb.add(gps)
    this.registerLabel('gps', gps, 0.4)

    const tp4056 = this.box(0.85, 0.07, 1.0, chipMat, false)
    tp4056.position.set(1.95, 0.66, -2.3)
    pcb.add(tp4056)
    this.registerLabel('charger', tp4056, 0.35)

    const speaker = this.box(2.0, 0.1, 0.75, new THREE.MeshStandardMaterial({ color: 0x181818, roughness: 0.9 }))
    speaker.position.set(0, 0.64, 3.0)
    pcb.add(speaker)

    this.addPart('pcb', pcb, new THREE.Vector3(0, 0.52, 0), new THREE.Vector3(0, 0.45, 0))

    const battery = new THREE.Group()
    const cell = new THREE.Mesh(new THREE.CylinderGeometry(0.82, 0.82, 5.6, 28), battCell)
    cell.rotation.z = Math.PI / 2
    battery.add(cell)
    const wrap = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 5.75, 28), battWrap)
    wrap.rotation.z = Math.PI / 2
    battery.add(wrap)
    const labelRing = this.box(0.15, 0.9, 1.2, new THREE.MeshStandardMaterial({ color: 0xf0f0f0 }), false)
    labelRing.position.x = 2.5
    battery.add(labelRing)
    this.addPart('battery', battery, new THREE.Vector3(0, 0.38, -0.15), new THREE.Vector3(0, -0.35, -3.0))
    this.registerLabel('battery', battery, 0.95)

    const bottom = new THREE.Group()
    bottom.add(this.box(7.0, 0.52, 11.6, this.shellMat()))
    const tray = this.box(5.8, 0.12, 6.0, new THREE.MeshStandardMaterial({ color: 0x3a424c, roughness: 0.85 }), false)
    tray.position.set(0, 0.28, -0.4)
    bottom.add(tray)
    this.addPart('bottom', bottom, new THREE.Vector3(0, 0.26, 0), new THREE.Vector3(0, -1.55, 0))

    const top = new THREE.Group()
    top.add(this.box(7.0, 0.42, 11.6, this.shellMat()))
    this.addPart('top', top, new THREE.Vector3(0, 1.34, 0), new THREE.Vector3(0, 1.75, 0.35))

    const face = new THREE.Group()
    face.position.set(0, 0.08, 5.72)
    top.add(face)

    const oledMod = new THREE.Group()
    oledMod.add(this.box(3.35, 0.32, 1.85, new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.55 }), false))
    const oledScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(3.1, 1.55),
      new THREE.MeshBasicMaterial({ map: this.oledTexture }),
    )
    oledScreen.position.set(0, 0.16, 0.93)
    oledMod.add(oledScreen)
    oledMod.position.set(0, 0.55, 0)
    oledMod.rotation.x = -0.08
    face.add(oledMod)
    this.registerLabel('oled', oledMod, 0.45)

    const keys: DeviceButton[] = ['mode', 'sel', 'up', 'dn']
    keys.forEach((key, i) => {
      const g = new THREE.Group()
      const base = this.box(0.92, 0.16, 0.92, btnMat)
      const cap = this.box(0.76, 0.1, 0.76, btnCap)
      cap.position.y = 0.11
      g.add(base, cap)
      g.position.set(-1.6 + i * 1.08, -0.42, 0)
      base.userData.key = key
      this.buttonMeshes.push(base)
      face.add(g)
    })

    const ledTx = this.box(0.16, 0.16, 0.16, new THREE.MeshStandardMaterial({ color: 0x551111, emissive: 0x000000 }))
    ledTx.position.set(-2.75, 0.15, 0.55)
    face.add(ledTx)

    const ledRx = this.box(0.16, 0.16, 0.16, new THREE.MeshStandardMaterial({ color: 0x111855, emissive: 0x000000 }))
    ledRx.position.set(-2.42, 0.15, 0.55)
    face.add(ledRx)

    for (let i = 0; i < 16; i++) {
      const slot = this.box(0.07, 0.05, 0.22, new THREE.MeshStandardMaterial({ color: 0x0e0e0e }), false)
      slot.position.set(-1.45 + i * 0.19, 0.12, -0.35)
      face.add(slot)
    }

    const screwMat = new THREE.MeshStandardMaterial({ color: 0xc48840, metalness: 0.88, roughness: 0.28 })
    ;[[-3.15, 0.05, 5.55], [3.15, 0.05, 5.55], [-3.15, -0.05, -5.55], [3.15, -0.05, -5.55]].forEach(([x, y, z]) => {
      const s = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.07, 12), screwMat)
      s.rotation.x = Math.PI / 2
      s.position.set(x, y, z)
      top.add(s)
    })

    const antenna = new THREE.Group()
    antenna.add(this.box(0.42, 0.42, 0.42, silvMat))
    const whip = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.05, 2.0, 10), silvMat)
    whip.position.y = 1.18
    antenna.add(whip)
    this.addPart('antenna', antenna, new THREE.Vector3(2.35, 1.62, -4.75), new THREE.Vector3(0.4, 2.6, -0.3))
    this.registerLabel('antenna', antenna, 1.4)

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(10, 64),
      new THREE.MeshStandardMaterial({ color: 0xdce1e8, roughness: 0.96 }),
    )
    floor.rotation.x = -Math.PI / 2
    floor.position.y = -0.02
    floor.receiveShadow = true
    this.scene.add(floor)

    const grid = new THREE.GridHelper(14, 20, 0xc8d0da, 0xd8dee6)
    grid.position.y = -0.01
    ;(grid.material as THREE.Material).opacity = 0.35
    ;(grid.material as THREE.Material).transparent = true
    this.scene.add(grid)

    return { tx: ledTx, rx: ledRx }
  }

  setExplode(t: number) {
    this.explode = clamp01(t)
    this.applyTransforms()
  }

  setXray(t: number) {
    this.xray = clamp01(t)
    const transmission = lerp(0.18, 0.82, this.xray)
    const opacity = lerp(0.94, 0.38, this.xray)
    this.shellMats.forEach(m => {
      m.transmission = transmission
      m.opacity = opacity
    })
  }

  setLeds(tx: boolean, rx: boolean) {
    const txMat = this.ledTx.material as THREE.MeshStandardMaterial
    const rxMat = this.ledRx.material as THREE.MeshStandardMaterial
    txMat.emissive.setHex(tx ? 0xff3333 : 0x000000)
    txMat.emissiveIntensity = tx ? 2 : 0
    rxMat.emissive.setHex(rx ? 0x3388ff : 0x000000)
    rxMat.emissiveIntensity = rx ? 1.8 : 0
  }

  updateOledTexture() {
    this.oledTexture.needsUpdate = true
  }

  private applyTransforms() {
    for (const p of this.parts) {
      p.group.position.set(
        p.base.x + p.explode.x * this.explode,
        p.base.y + p.explode.y * this.explode,
        p.base.z + p.explode.z * this.explode,
      )
    }
  }

  private updateLabels() {
    const show = this.explode > 0.08 || this.xray > 0.2
    for (const t of this.labelTargets) {
      const el = this.labelMap.get(t.name)
      if (!el) continue
      const pos = new THREE.Vector3(0, t.offsetY, 0)
      t.object.localToWorld(pos)
      pos.project(this.camera)
      const rect = this.renderer.domElement.getBoundingClientRect()
      const x = (pos.x * 0.5 + 0.5) * rect.width
      const y = (-pos.y * 0.5 + 0.5) * rect.height
      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -115%)`
      el.style.opacity = show && pos.z < 1 ? '1' : '0'
      el.style.pointerEvents = 'none'
    }
  }

  private handlePointer = (ev: PointerEvent) => {
    const rect = this.renderer.domElement.getBoundingClientRect()
    this.pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1
    this.pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1
    this.raycaster.setFromCamera(this.pointer, this.camera)
    const hits = this.raycaster.intersectObjects(this.buttonMeshes, false)
    if (hits.length) this.opts.onButtonPress?.(hits[0].object.userData.key as DeviceButton)
  }

  private handleResize = () => {
    const w = this.opts.container.clientWidth
    const h = this.opts.container.clientHeight
    if (!w || !h) return
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(w, h)
  }

  private animate = () => {
    this.raf = requestAnimationFrame(this.animate)
    this.controls.update()
    this.updateLabels()
    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    cancelAnimationFrame(this.raf)
    window.removeEventListener('resize', this.handleResize)
    this.renderer.domElement.removeEventListener('pointerdown', this.handlePointer)
    this.renderer.dispose()
    this.opts.container.removeChild(this.renderer.domElement)
  }
}
