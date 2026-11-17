import React, { useEffect, useRef, useState } from 'react'

/*
 * Interactive 3D archery target. Three.js is loaded on demand so it never
 * weighs on the first paint. The target leans toward the pointer and a click
 * on its face fires an arrow at that spot.
 *
 * Motion budget: this is the hero, seen once per visit — the delight tier.
 * Reduced motion keeps the model but drops idle float, pointer lean and flight.
 */

const RING_COLORS = ['#f4f1ea', '#f4f1ea', '#1b1d1c', '#1b1d1c', '#2a6fb8', '#2a6fb8', '#d6423a', '#d6423a', '#e8b73a', '#e8b73a']
const MAX_ARROWS = 10
const FLIGHT_MS = 320
const easeOut = (t) => 1 - Math.pow(1 - t, 4)

const makeFaceTexture = (THREE) => {
  const size = 1024
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')
  const c = size / 2

  ctx.fillStyle = '#c9a46a'
  ctx.fillRect(0, 0, size, size)

  RING_COLORS.forEach((color, i) => {
    const r = c * (1 - i / RING_COLORS.length) * 0.98
    ctx.beginPath()
    ctx.arc(c, c, r, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
    ctx.lineWidth = 3
    ctx.strokeStyle = i < 2 || i > 7 ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.35)'
    ctx.stroke()
  })

  // X in the center
  ctx.strokeStyle = 'rgba(0,0,0,0.45)'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(c - 10, c - 10); ctx.lineTo(c + 10, c + 10)
  ctx.moveTo(c + 10, c - 10); ctx.lineTo(c - 10, c + 10)
  ctx.stroke()

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  return texture
}

const makeArrow = (THREE) => {
  const arrow = new THREE.Group()

  const shaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.018, 0.018, 1.5, 10),
    new THREE.MeshStandardMaterial({ color: '#2b2b2b', roughness: 0.4, metalness: 0.3 }),
  )
  shaft.rotation.x = Math.PI / 2
  shaft.position.z = 0.75
  arrow.add(shaft)

  const fletchMat = new THREE.MeshStandardMaterial({ color: '#c09a45', roughness: 0.6, side: THREE.DoubleSide })
  const fletchShape = new THREE.Shape()
  fletchShape.moveTo(0, 0)
  fletchShape.lineTo(0.28, 0)
  fletchShape.lineTo(0.22, 0.09)
  fletchShape.lineTo(0.04, 0.09)
  fletchShape.closePath()
  const fletchGeo = new THREE.ShapeGeometry(fletchShape)

  for (let i = 0; i < 3; i += 1) {
    const f = new THREE.Mesh(fletchGeo, i === 0 ? new THREE.MeshStandardMaterial({ color: '#f3f7f4', side: THREE.DoubleSide }) : fletchMat)
    const holder = new THREE.Group()
    f.rotation.y = -Math.PI / 2
    f.position.set(0, 0.012, 1.18)
    holder.add(f)
    holder.rotation.z = (i * Math.PI * 2) / 3
    arrow.add(holder)
  }

  const nock = new THREE.Mesh(
    new THREE.CylinderGeometry(0.024, 0.024, 0.05, 10),
    new THREE.MeshStandardMaterial({ color: '#1a5c3a' }),
  )
  nock.rotation.x = Math.PI / 2
  nock.position.z = 1.5
  arrow.add(nock)

  return arrow
}

const HeroTarget = () => {
  const mountRef = useRef(null)
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [hits, setHits] = useState(0)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return undefined

    let disposed = false
    let cleanup = () => {}

    import('three').then((THREE) => {
      if (disposed) return

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      let renderer
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      } catch (e) {
        setStatus('error')
        return
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.outputColorSpace = THREE.SRGBColorSpace
      mount.appendChild(renderer.domElement)

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50)
      camera.position.set(0, 0.2, 8.4)

      scene.add(new THREE.HemisphereLight('#ffffff', '#0e2a1d', 1.4))
      const key = new THREE.DirectionalLight('#fff4dd', 2.2)
      key.position.set(3, 4, 6)
      scene.add(key)
      const rim = new THREE.DirectionalLight('#7fdca6', 0.8)
      rim.position.set(-4, 1, -3)
      scene.add(rim)

      // Target (boss + face)
      const rig = new THREE.Group()
      scene.add(rig)
      const target = new THREE.Group()
      rig.add(target)

      const faceTexture = makeFaceTexture(THREE)
      const boss = new THREE.Mesh(
        new THREE.CylinderGeometry(1.6, 1.6, 0.42, 96),
        [
          new THREE.MeshStandardMaterial({ color: '#b48b52', roughness: 1 }),
          new THREE.MeshStandardMaterial({ map: faceTexture, roughness: 0.85 }),
          new THREE.MeshStandardMaterial({ color: '#8f6b3a', roughness: 1 }),
        ],
      )
      boss.rotation.x = Math.PI / 2
      target.add(boss)
      const FACE_Z = 0.21

      // Easel legs
      const wood = new THREE.MeshStandardMaterial({ color: '#6b4a26', roughness: 0.9 })
      const legGeo = new THREE.BoxGeometry(0.09, 4.2, 0.09)
      ;[-0.9, 0.9].forEach((x) => {
        const leg = new THREE.Mesh(legGeo, wood)
        leg.position.set(x, -1.2, -0.35)
        leg.rotation.z = x > 0 ? -0.14 : 0.14
        leg.rotation.x = -0.08
        rig.add(leg)
      })
      const back = new THREE.Mesh(legGeo, wood)
      back.position.set(0, -1.3, -1.1)
      back.rotation.x = 0.38
      rig.add(back)
      rig.position.y = 0.35

      // Arrows
      const arrows = []
      const flights = []
      const wobbles = []

      const stick = (point, instant) => {
        const arrow = makeArrow(THREE)
        target.add(arrow)
        arrows.push(arrow)
        if (arrows.length > MAX_ARROWS) {
          const old = arrows.shift()
          target.remove(old)
        }
        const final = new THREE.Vector3(point.x, point.y, FACE_Z - 0.12)
        const tilt = new THREE.Euler((Math.random() - 0.5) * 0.12, (Math.random() - 0.5) * 0.12, Math.random() * Math.PI)
        if (instant) {
          arrow.position.copy(final)
          arrow.rotation.copy(tilt)
          return
        }
        arrow.position.set(final.x * 0.4, final.y * 0.4 + 0.3, 7)
        arrow.rotation.copy(tilt)
        flights.push({ arrow, from: arrow.position.clone(), to: final, start: performance.now(), tilt })
      }

      // Pre-placed arrows so the scene reads instantly
      stick({ x: 0.06, y: 0.1 }, true)
      stick({ x: -0.42, y: -0.3 }, true)
      stick({ x: 0.55, y: 0.48 }, true)

      // Pointer lean
      const pointer = { x: 0, y: 0 }
      const lean = { x: 0, y: 0 }
      const onPointerMove = (e) => {
        const r = mount.getBoundingClientRect()
        pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1
        pointer.y = ((e.clientY - r.top) / r.height) * 2 - 1
      }
      const onPointerLeave = () => { pointer.x = 0; pointer.y = 0 }

      // Click to shoot
      const raycaster = new THREE.Raycaster()
      const ndc = new THREE.Vector2()
      const onClick = (e) => {
        const r = renderer.domElement.getBoundingClientRect()
        ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
        raycaster.setFromCamera(ndc, camera)
        const hit = raycaster.intersectObject(boss)[0]
        if (!hit) return
        const local = target.worldToLocal(hit.point.clone())
        if (Math.hypot(local.x, local.y) > 1.55) return
        stick(local, reduceMotion)
        setHits((h) => h + 1)
      }

      const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
      if (!reduceMotion && canHover) {
        mount.addEventListener('pointermove', onPointerMove)
        mount.addEventListener('pointerleave', onPointerLeave)
      }
      renderer.domElement.addEventListener('click', onClick)

      // Size
      const resize = () => {
        const { width, height } = mount.getBoundingClientRect()
        if (!width || !height) return
        renderer.setSize(width, height, false)
        camera.aspect = width / height
        camera.position.z = width < 420 ? 10 : 8.4
        camera.updateProjectionMatrix()
      }
      const ro = new ResizeObserver(resize)
      ro.observe(mount)
      resize()

      // Render loop, paused off-screen or in a background tab
      let visible = true
      let raf = 0
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting
        if (visible && !raf) raf = requestAnimationFrame(tick)
      })
      io.observe(mount)

      const t0 = performance.now()
      function tick(now) {
        raf = 0
        if (!visible || document.hidden) return

        if (!reduceMotion) {
          const t = (now - t0) / 1000
          lean.x += (pointer.y * 0.22 - lean.x) * 0.08
          lean.y += (pointer.x * 0.32 - lean.y) * 0.08
          rig.rotation.x = 0.1 + lean.x + Math.sin(t * 0.8) * 0.02
          rig.rotation.y = -0.55 + lean.y + Math.sin(t * 0.5) * 0.04
          rig.position.y = 0.35 + Math.sin(t * 1.1) * 0.04
        } else {
          rig.rotation.y = -0.55; rig.rotation.x = 0.1
        }

        for (let i = flights.length - 1; i >= 0; i -= 1) {
          const f = flights[i]
          const p = Math.min((now - f.start) / FLIGHT_MS, 1)
          f.arrow.position.lerpVectors(f.from, f.to, easeOut(p))
          if (p === 1) {
            flights.splice(i, 1)
            wobbles.push({ arrow: f.arrow, start: now, tilt: f.tilt })
          }
        }

        // Damped wobble on impact
        for (let i = wobbles.length - 1; i >= 0; i -= 1) {
          const w = wobbles[i]
          const t = (now - w.start) / 1000
          const amp = 0.09 * Math.exp(-t * 6) * Math.sin(t * 38)
          w.arrow.rotation.x = w.tilt.x + amp
          w.arrow.rotation.y = w.tilt.y + amp * 0.6
          if (t > 0.9) {
            w.arrow.rotation.x = w.tilt.x
            w.arrow.rotation.y = w.tilt.y
            wobbles.splice(i, 1)
          }
        }

        renderer.render(scene, camera)
        raf = requestAnimationFrame(tick)
      }

      const onVisibility = () => { if (!document.hidden && visible && !raf) raf = requestAnimationFrame(tick) }
      document.addEventListener('visibilitychange', onVisibility)

      raf = requestAnimationFrame(tick)
      setStatus('ready')

      cleanup = () => {
        cancelAnimationFrame(raf)
        io.disconnect()
        ro.disconnect()
        document.removeEventListener('visibilitychange', onVisibility)
        mount.removeEventListener('pointermove', onPointerMove)
        mount.removeEventListener('pointerleave', onPointerLeave)
        renderer.domElement.removeEventListener('click', onClick)
        scene.traverse((obj) => {
          if (obj.geometry) obj.geometry.dispose()
          const mats = Array.isArray(obj.material) ? obj.material : obj.material ? [obj.material] : []
          mats.forEach((m) => { if (m.map) m.map.dispose(); m.dispose() })
        })
        renderer.dispose()
        renderer.domElement.remove()
      }
    }).catch(() => setStatus('error'))

    return () => {
      disposed = true
      cleanup()
    }
  }, [])

  if (status === 'error') return null

  return (
    <div className={`hero-target ${status === 'ready' ? 'is-ready' : ''}`}>
      <div ref={mountRef} className="hero-target-canvas" aria-label="Diana 3D interactiva: haz clic para disparar una flecha" role="img" />
      <div className="hero-target-hint" aria-live="polite">
        {hits === 0 ? 'Haz clic en la diana para disparar' : <><span className="tabular">{hits}</span> {hits === 1 ? 'flecha' : 'flechas'} disparadas</>}
      </div>
    </div>
  )
}

export default HeroTarget
