export async function analyzeWebsite(url) {

  const response = await fetch(
    "https://netwatch-backend.vercel.app/analyze",
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