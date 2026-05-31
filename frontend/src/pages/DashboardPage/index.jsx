import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { setWebsiteUrl } from "../../app/state/website"

function DashboardPage() {

  const [url, setUrl] = useState("")

  const navigate = useNavigate()

  function handleResponseMapFeature() {

    setWebsiteUrl(url)

    navigate("/response-map")
  }

  return (
    <div>

      <h1>NetWatch Dashboard</h1>

      <input
        type="text"
        placeholder="Enter website URL"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
      />

      <div style={{ marginTop: "20px" }}>

        <button onClick={handleResponseMapFeature}>
          Response Map Feature
        </button>

      </div>

    </div>
  )
}

export default DashboardPage