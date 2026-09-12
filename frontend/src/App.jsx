import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Components
import EditResume from './pages/ResumeUpdate/EditResume';
import PublicResumeView from './pages/PublicView/PublicResumeView';
import PrintResume from './pages/Print/PrintResume';
import AuthLayout from "./components/layouts/AuthLayout"
import Dashboard from './pages/Home/Dashboard';
import LandingPage from "./pages/LandingPage"
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import UserProvider from "./context/userContext";
import { startKeepAliveHeartbeat } from "./utils/keepAlive";

const App = () => {
  useEffect(() => {
    const cleanup = startKeepAliveHeartbeat();
    return cleanup;
  }, []);
  return (
    <UserProvider>
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

            {/* Dedicated Headless Vector PDF Print Routes */}
            <Route path='/print/:resumeId' element={<PrintResume />} />
            <Route path='/print/public/:slug' element={<PrintResume isPublic={true} />} />

            {/* Public Shareable Recruiter Routes */}
            <Route path='/view/:slug' element={<PublicResumeView />} />
            <Route path='/r/:slug' element={<PublicResumeView />} />
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
    </UserProvider>
  )
}

export default App
