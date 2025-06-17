import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Components
import EditResume from './pages/ResumeUpdate/EditResume';
import Dashboard from './pages/Home/Dashboard';
import LandingPage from "./pages/LandingPage"

const App = () => {
  return (
    <>
      <div>
        <Router>
          <Routes>
            {/* Default Route */}
            <Route path='/' element={<LandingPage />} />

            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/resume/:resumeId' element={<EditResume />} />
          </Routes>
        </Router>
      </div>

      <Toaster
        toastOptions={{
          className: "",
          styles: {
            fontSize: "13px",
          },
        }}
      />
    </>
  )
}

export default App
