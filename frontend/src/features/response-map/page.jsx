import { useEffect, useState } from "react"
import { getWebsiteUrl } from "../../app/state/website"
import { analyzeWebsite } from "./api/analyze"
import Globe from "./components/Globe"

function ResponseMapPage() {

  const websiteUrl = getWebsiteUrl()

  const [result, setResult] = useState(null)

  useEffect(() => {

    async function runAnalysis() {

      const data = await analyzeWebsite(websiteUrl)

      setResult(data)
    }

    runAnalysis()

  }, [])

  return (
    <div>

      <h1>Response Map Feature</h1>

      <h2>
        Website: {websiteUrl}
      </h2>

      <Globe result={result} />
      <pre>
        {JSON.stringify(result, null, 2)}
      </pre>

    </div>
  )
}

export default ResponseMapPage