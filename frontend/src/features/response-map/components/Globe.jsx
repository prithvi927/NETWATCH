import { useEffect, useRef } from "react"
import GlobeGL from "globe.gl"
import * as topojson from "topojson-client"
import countries from "world-atlas/countries-110m.json"


function Globe({ result }) {

  console.log("RESULT:", JSON.stringify(result))

  const globeRef = useRef(null)

  useEffect(() => {

  console.log("EFFECT STARTED")


  if (!globeRef.current || !result) return

  const globe = GlobeGL()(globeRef.current)
  console.log("GLOBE CREATED")

  globe.pointOfView(
  {
    lat: 20,
    lng: 0,
    altitude: 2.5
  },
  0
)

const NETWATCH_LOCATION = {
  lat: 37.751,
  lng: -97.822
}

let showUsaMarker = false
let showTargetMarker = false
let showArc = false

let currentLat = NETWATCH_LOCATION.lat
let currentLng = NETWATCH_LOCATION.lng

let journeyProgress = 0
let journeyActive = false

let targetZoomTriggered = false

  // globe.camera().position.z = 250
  globe.controls().autoRotate = true
  globe.controls().autoRotateSpeed = 1.2

  globe.globeImageUrl(null)

  globe.showAtmosphere(true)

  globe.atmosphereColor("#0088ff")
  globe.atmosphereAltitude(0.12)

  const material = globe.globeMaterial()

  material.color.set("#02060d")
  material.emissive.set("#061a3a")
  material.emissiveIntensity = 0.25

  const landPolygons =
  topojson.feature(
    countries,
    countries.objects.countries
  ).features


  globe
  .polygonsData(landPolygons)

  .polygonCapColor(() => "#143d82")

  .polygonSideColor(() => "#0a244d")

  .polygonStrokeColor(() => "#2d7ce8")

  .polygonAltitude(0.003)


  // // globe.hexPolygonsData([])
  // // globe
  // //   .hexPolygonsData(landPolygons)
  // //   .hexPolygonResolution(4)
  // //   .hexPolygonMargin(0.22)
  // //   .hexPolygonColor(() => "#6fb6ff")

  let animationId
let targetZoomOutTimeout = null
let rotationResumeTimeout = null
function animate() {

  if (journeyActive) {

    journeyProgress += 0.01

    if (
      journeyProgress >= 1 &&
      !targetZoomTriggered
    ) {

      targetZoomTriggered = true

      journeyProgress = 1

      journeyActive = false

      // showTargetMarker = true
      
      console.log("TARGET FOCUS START")
      globe.pointOfView(
        {
          lat: result.latitude,
          lng: result.longitude,
          altitude: 1.2
        },
        1500
      )

//       targetZoomOutTimeout = setTimeout(() => {

//   globe.pointOfView(
//     {
//       lat: result.latitude,
//       lng: result.longitude,
//       altitude: 2.5
//     },
//     1500
//   )

 
// }, 1000)
    }

    currentLat =
      NETWATCH_LOCATION.lat +
      (
        result.latitude -
        NETWATCH_LOCATION.lat
      ) *
      journeyProgress

    currentLng =
      NETWATCH_LOCATION.lng +
      (
        result.longitude -
        NETWATCH_LOCATION.lng
      ) *
      journeyProgress
  }


const markers = []

if (showUsaMarker) {

  markers.push({
    lat: NETWATCH_LOCATION.lat,
    lng: NETWATCH_LOCATION.lng,
    size: 0.5
  })
}

if (showTargetMarker) {

  markers.push({
    lat: result.latitude,
    lng: result.longitude,
    size: 0.5
  })
}

globe
  .pointsData(markers)
  .pointLat(d => d.lat)
  .pointLng(d => d.lng)
  .pointAltitude(0.02)
  .pointRadius(d => d.size)
  .pointColor(() => "#00ffff")


  const arcs = []

if (showArc) {

  arcs.push({

    startLat:
      NETWATCH_LOCATION.lat,

    startLng:
      NETWATCH_LOCATION.lng,

    endLat:
      currentLat,

    endLng:
      currentLng
  })
}

globe
  .arcsData(arcs)
  .arcColor(() => "#00ffff")
  .arcStroke(0.8)
  .arcAltitude(0.25)


  animationId =
  requestAnimationFrame(animate)

}

animate()

const usaFocus = setTimeout(() => {

  globe.controls().autoRotate = false

  globe.pointOfView(
    {
      lat: 37.751,
      lng: -97.822,
      altitude: 1.2
    },
    1500
  )

}, 2000)

const usaPhase = setTimeout(() => {

  showUsaMarker = true

}, 3000)


const usaZoomOut = setTimeout(() => {

  globe.pointOfView(
    {
      lat: 37.751,
      lng: -97.822,
      altitude: 2.5
    },
    1500
  )

}, 5000)

const targetPhase = setTimeout(() => {

  showArc = true

  journeyProgress = 0

  journeyActive = true

}, 6000)

rotationResumeTimeout = setTimeout(() => {

  globe.controls().autoRotate = true
  globe.controls().autoRotateSpeed = 1.2

}, 10500)
 

return () => {

   console.log("EFFECT CLEANUP")

  clearTimeout(usaFocus)

  clearTimeout(usaPhase)

  clearTimeout(usaZoomOut)

  clearTimeout(targetPhase)

  clearTimeout(targetZoomOutTimeout)

  clearTimeout(rotationResumeTimeout)

  cancelAnimationFrame(animationId)
}

}, [result])

  return (
  <div
    ref={globeRef}
    style={{
      width: "600px",
      height: "600px",
      background: "#000000"
    }}
  />
)
}

export default Globe