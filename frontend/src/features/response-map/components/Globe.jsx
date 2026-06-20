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
  globe.controls().autoRotate = true
  globe.controls().autoRotateSpeed = 1.2

  globe.globeImageUrl(null)

  globe.showAtmosphere(true)

  globe.atmosphereColor("#2563eb")
  globe.atmosphereAltitude(0.18)

  const material = globe.globeMaterial()

  material.color.set("#0b1220")
  material.emissive.set("#071426")
  material.emissiveIntensity = 0.4

  const landPolygons =
  topojson.feature(
    countries,
    countries.objects.countries
  ).features

  globe
    .hexPolygonsData(landPolygons)
    .hexPolygonResolution(4)
    .hexPolygonMargin(0.08)
    .hexPolygonColor(() => "#5b8cff")

}, [])

  return (
  <div
    ref={globeRef}
    style={{
      width: "600px",
      height: "600px",
      background: "#030712"
    }}
  />
)
}

export default Globe