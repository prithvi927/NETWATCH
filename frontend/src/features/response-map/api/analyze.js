export async function analyzeWebsite(url) {

  const response = await fetch(
    "http://127.0.0.1:8000/analyze",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url: url
      })
    }
  )

  const data = await response.json()

  return data
}