import { BrowserRouter, Routes, Route } from "react-router-dom"
import ResponseMapPage from "../../features/response-map/page"

import LandingPage from "../../pages/LandingPage"
import DashboardPage from "../../pages/DashboardPage"

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="/response-map" element={<ResponseMapPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router