import { useEffect, useRef } from "react"
import createGlobe from "cobe"


function Globe({ result }) {

  console.log("RESULT:", JSON.stringify(result))

  const canvasRef = useRef(null)

  useEffect(() => {

    if (!result) return

    console.log("EFFECT START")

    if (!canvasRef.current) return
    
    canvasRef.current.style.transform = "scale(1)"

    let phi = 4.7
    console.log("PHI INIT", phi)
    let zoom = 1
    let targetZoom = 1
    let targetPhi = 0
    // let usaTargetPhi = 0.2
    let shouldRotate = false
    let showArc = false
    let showMarker = false
    // let arcTimerStarted = false

    const width = canvasRef.current.offsetWidth

    const NETWATCH_LOCATION = [37.751, -97.822]

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,

      width: width,
      height: width,

      phi: 4.7,
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



    markers:
      showMarker && result?.latitude && result?.longitude
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

    arcs: [],

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

    phi += 0.003

  }


  if (Math.abs(targetZoom - zoom) > 0.01) {

  zoom += (targetZoom - zoom) * 0.05

  canvasRef.current.style.transform = `scale(${zoom})`

  }

  globe.update({
  phi,
  
  markers:
    showMarker && result?.latitude && result?.longitude
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


  arcs: showArc
    ? [
        {
          from: NETWATCH_LOCATION,
          to: [
            result.latitude,
            result.longitude
          ]
        }
      ]
    : []
})

animationId = requestAnimationFrame(animate)

}

animate()


const usaPhase = setTimeout(() => {

  console.log("USA PHASE START")
  console.log("PHI DURING USA", phi)

  targetPhi = 0.2
  shouldRotate = true


}, 2000)


const usaZoomPhase = setTimeout(() => {

  targetZoom = 1.35

}, 2000)

const markerPhase = setTimeout(() => {

  showMarker = true

}, 3000)

const arcPhase = setTimeout(() => {

  showArc = true

}, 4000)

const indiaPhase = setTimeout(() => {

  targetPhi = 3.5
  shouldRotate = true

}, 6000)

const indiaZoomPhase = setTimeout(() => {

  targetZoom = 1.7

}, 6000)

return () => {
  clearTimeout(usaPhase)
  clearTimeout(arcPhase)
  clearTimeout(indiaPhase)
  clearTimeout(markerPhase)
  clearTimeout(usaZoomPhase)
  clearTimeout(indiaZoomPhase)
  cancelAnimationFrame(animationId)

  console.log("EFFECT CLEANUP")
  globe.destroy()
}
  }, [result])

  return (
  <canvas
    ref={canvasRef}
    style={{
      width: "600px",
      height: "600px",
      maxWidth: "100%",
      transformOrigin: "center center"
    }}
  />
)
}

export default Globe