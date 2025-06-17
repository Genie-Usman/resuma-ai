import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Components
import EditResume from './pages/ResumeUpdate/EditResume';
import AuthLayout from "./components/layouts/AuthLayout"
import Dashboard from './pages/Home/Dashboard';
import LandingPage from "./pages/LandingPage"
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";

const App = () => {
  return (
    <>
      <div>
        <Router>
          <Routes>
            {/* Auth Routes */}
            <Route
              path="/auth/login"
              element={
                <AuthLayout>
                  <Login />
                </AuthLayout>
              }
            />
            <Route
              path="/auth/sign-up"
              element={
                <AuthLayout>
                  <SignUp />
                </AuthLayout>
              }
            />

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
