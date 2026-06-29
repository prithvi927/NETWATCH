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

  globe
  .ringColor(() => "#00ffff")
  .ringMaxRadius(2)
  .ringPropagationSpeed(1)
  .ringRepeatPeriod(1200)
  .ringAltitude(0.01)

  globe
  .arcColor(() => [
    "rgba(43, 143, 243, 1.0)" ,  // Faint cyan for the base residual line path
    "rgba(255, 255, 255, 1.0)" // Intense solid white for the traveling packet tip
  ])
  // .arcColor(() => [
  // "rgba(130,180,255,0.42)",
  // "rgba(225,238,252,0.90)"
  // ])
  .arcStroke(0.6)
  // .arcStroke(1.2)       
  .arcAltitude(0.22)

  .arcDashLength(0.15)          // Length of your traveling packet
  .arcDashGap(1)                // Leaves a massive gap so only 1 packet travels at a time
  .arcDashAnimateTime(2000)     // Speed of the packet (2 seconds per cycle)


  // // globe.hexPolygonsData([])
  // // globe
  // //   .hexPolygonsData(landPolygons)
  // //   .hexPolygonResolution(4)
  // //   .hexPolygonMargin(0.22)
  // //   .hexPolygonColor(() => "#6fb6ff")

let animationId
let targetZoomOutTimeout = null
let rotationResumeTimeout = null
let targetZoomInTimeout = null
function animate() {

  if (journeyActive) {

    journeyProgress += 0.01

    if (
      journeyProgress >= 1 &&
      !targetZoomTriggered
    ) {

      targetZoomTriggered = true

      journeyProgress = 1

      globe.arcsData([
        {
          startLat: NETWATCH_LOCATION.lat,
          startLng: NETWATCH_LOCATION.lng,
          endLat: result.latitude,
          endLng: result.longitude
        }
      ])

      journeyActive = false

      // showArc = false

      showTargetMarker = true


      globe.ringsData([
        {
          lat: NETWATCH_LOCATION.lat,
          lng: NETWATCH_LOCATION.lng
        },
        {
          lat: result.latitude,
          lng: result.longitude
        }
      
      ])

      console.log("TARGET FOCUS START")

      targetZoomInTimeout = setTimeout(() => {

        globe.pointOfView(
        {
          lat: result.latitude,
          lng: result.longitude,
          altitude: 1.2
        },
        1200
      )

      targetZoomOutTimeout = setTimeout(() => {

        globe.pointOfView(
          {
            lat: result.latitude,
            lng: result.longitude,
            altitude: 2.5
          },
          1200
        )

      }, 1500)

    }, 3000)
      // globe.pointOfView(
      //   {
      //     lat: result.latitude,
      //     lng: result.longitude,
      //     altitude: 1.2
      //   },
      //   1500
      // )

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


// const markers = []

// if (showUsaMarker) {

//   markers.push({
//     lat: NETWATCH_LOCATION.lat,
//     lng: NETWATCH_LOCATION.lng,
//     size: 1
//   })
// }

// if (showTargetMarker) {

//   markers.push({
//     lat: result.latitude,
//     lng: result.longitude,
//     size: 1
//   })
// }

// // globe
// //   .pointsData(markers)
// //   .pointLat(d => d.lat)
// //   .pointLng(d => d.lng)
// //   .pointAltitude(0.08)
// //   .pointRadius(d => d.size)
// //   .pointColor(() => "#00ffff")


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


console.count("ARC UPDATE")
if (journeyActive) {
  console.count("ARC UPDATE")
  globe.arcsData(arcs)
}


 if (journeyActive) {

  animationId =
    requestAnimationFrame(animate)

}

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

   globe.ringsData([
  {
    lat: NETWATCH_LOCATION.lat,
    lng: NETWATCH_LOCATION.lng
  }
])


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

}, 4000)

const targetPhase = setTimeout(() => {

  showArc = true

  globe.pointOfView(
    {
      lat: 20,
      lng: result.longitude,
      altitude: 2.5
    },
    5000
  )

  journeyProgress = 0

  journeyActive = true

  animate() 

}, 6000)

rotationResumeTimeout = setTimeout(() => {

  globe.controls().autoRotate = true
  globe.controls().autoRotateSpeed = 1.2

},  14000)
 

return () => {

   console.log("EFFECT CLEANUP")

  clearTimeout(usaFocus)

  clearTimeout(usaPhase)

  clearTimeout(usaZoomOut)

  clearTimeout(targetPhase)

  clearTimeout(targetZoomInTimeout)

  clearTimeout(targetZoomOutTimeout)

  clearTimeout(rotationResumeTimeout)

  cancelAnimationFrame(animationId)


  // 2. Unbind data layers explicitly to drop geographic VRAM allocation
      if (globe) {
        if (globe.controls() && typeof globe.controls().dispose === "function") {
          globe.controls().dispose()
        }

        globe
          .polygonsData([])
          .arcsData([])
          .ringsData([])
          .pointsData([])
          .labelsData([])
          .pathsData([])
          .hexBinPointsData([])
          .customLayerData([])

        // 3. Command Three.js to destroy contexts, scenes, textures, & event listeners
        if (typeof globe._destructor === "function") {
          globe._destructor()
        }
      }

      // 4. Force empty the DOM wrapper element to wipe residual canvas frames
      if (globeRef.current) {
        globeRef.current.innerHTML = ""
      }
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