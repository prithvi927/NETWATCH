import { useEffect, useRef} from "react"
import createGlobe from "cobe"


function Globe({ result }) {



  const canvasRef = useRef(null)

  useEffect(() => {

    if (!canvasRef.current) return

    let phi = 0
    let targetPhi = 0
    let shouldRotate = false

    const width = canvasRef.current.offsetWidth

    const NETWATCH_LOCATION = [37.751, -97.822]

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,

      width: width,
      height: width,

      phi: 0,
      theta: 0.3,

      dark: 1,

      diffuse: 1.5,

      mapSamples: 16000,
      mapBrightness: 8,

      baseColor: [0.08, 0.12, 0.18],
      markerColor: [0, 1, 1],
      glowColor: [0, 0.35, 0.7],
      arcColor: [0, 1, 1],
      arcWidth: 0.8,
      arcHeight: 0.5,
      markerElevation: 0.02,

    markers: result?.latitude && result?.longitude
  ? [
      {
        location: NETWATCH_LOCATION,
        size: 0.05
      },
      {
        location: [
          result.latitude,
          result.longitude
        ],
        size: 0.06
      }
    ]
  : [],


  arcs: result?.latitude && result?.longitude
  ? [
      {
        from: NETWATCH_LOCATION,
        to: [
          result.latitude,
          result.longitude
        ]
      }
    ]
  : [],

      opacity: 0.7
    })

  

  let animationId

  function animate() {

  if (shouldRotate) {

    if (Math.abs(targetPhi - phi) > 0.01) {

      phi += (targetPhi - phi) * 0.05

    } else {

      shouldRotate = false

    }

  } else {

  phi = targetPhi
  targetPhi = Infinity
  shouldRotate = false

}

  globe.update({
    phi
  })

  animationId = requestAnimationFrame(animate)
}

  animate()

const startAnimationTimeout = setTimeout(() => {
  targetPhi = 3.5
  shouldRotate = true
}, 3000)

  return () => {
  clearTimeout(startAnimationTimeout)
  cancelAnimationFrame(animationId)
  globe.destroy()
}

  }, [result])

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "600px",
        height: "600px",
        maxWidth: "100%"
      }}
    />
  )
}

export default Globe