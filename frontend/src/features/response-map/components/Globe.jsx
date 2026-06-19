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

  globe.globeImageUrl(null)

  globe.showAtmosphere(true)

  globe.atmosphereColor("#00aaff")

  globe.atmosphereAltitude(0.25)

  globe.globeMaterial().color.set("#050b16")

  const landPolygons =
  topojson.feature(
    countries,
    countries.objects.countries
  ).features

  globe
    .hexPolygonsData(landPolygons)
    .hexPolygonResolution(3)
    .hexPolygonMargin(0.2)
    .hexPolygonColor(() => "#3aa6ff")

}, [])

  return (
  <div
    ref={globeRef}
    style={{
      width: "600px",
      height: "600px",
      background: "black"
    }}
  />
)
}

export default Globe