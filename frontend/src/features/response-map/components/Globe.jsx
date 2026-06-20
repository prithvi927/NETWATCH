import { useEffect, useRef } from "react"
import GlobeGL from "globe.gl"
import * as topojson from "topojson-client"
import countries from "world-atlas/countries-110m.json"


function Globe({ result }) {

  console.log("RESULT:", JSON.stringify(result))

  const globeRef = useRef(null)

  useEffect(() => {

  if (!globeRef.current) return

  const globe = GlobeGL()(globeRef.current)
  // globe.camera().position.z = 250
  globe.controls().autoRotate = true
  globe.controls().autoRotateSpeed = 1.2

  globe.globeImageUrl(null)

  globe.showAtmosphere(true)

  globe.atmosphereColor("#0088ff")
  globe.atmosphereAltitude(0.12)

  const material = globe.globeMaterial()

  material.color.set("#03060b")
  material.emissive.set("#001122")
  material.emissiveIntensity = 0.15

  const landPolygons =
  topojson.feature(
    countries,
    countries.objects.countries
  ).features

  globe
    .hexPolygonsData(landPolygons)
    .hexPolygonResolution(4)
    .hexPolygonMargin(0.22)
    .hexPolygonColor(() => "#6fb6ff")

}, [])

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