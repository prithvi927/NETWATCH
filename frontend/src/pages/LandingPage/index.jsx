import { useNavigate } from "react-router-dom"

import Button from "../../shared/ui/Button"

function LandingPage() {

  const navigate = useNavigate()

  function handleStart() {
    navigate("/dashboard")
  }

  return (
    <div>
      <h1>NetWatch Landing Page</h1>

      <Button onClick={handleStart}>
        Start Now
      </Button>
    </div>
  )
}

export default LandingPage