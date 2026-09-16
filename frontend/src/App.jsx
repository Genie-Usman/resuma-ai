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
import TemplatesPage from "./pages/TemplatesPage/TemplatesPage";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";
import UserProvider from "./context/userContext";
import { startKeepAliveHeartbeat } from "./utils/keepAlive";
import ErrorBoundary from "./components/shared/ErrorBoundary";

const App = () => {
  useEffect(() => {
    const cleanup = startKeepAliveHeartbeat();
    return cleanup;
  }, []);
  return (
    <UserProvider>
      <ErrorBoundary>
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
            <Route path='/templates' element={<TemplatesPage />} />

            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/resume/:resumeId' element={<EditResume />} />

            {/* Dedicated Headless Vector PDF Print Routes */}
            <Route path='/print/:resumeId' element={<PrintResume />} />
            <Route path='/print/public/:slug' element={<PrintResume isPublic={true} />} />

            {/* Public Shareable Recruiter Routes */}
            <Route path='/p/:slug' element={<PublicResumeView />} />
            <Route path='/view/:slug' element={<PublicResumeView />} />
            <Route path='/r/:slug' element={<PublicResumeView />} />

            {/* Privacy Policy Routes */}
            <Route path='/privacy' element={<PrivacyPolicy />} />
            <Route path='/privacy-policy' element={<PrivacyPolicy />} />
          </Routes>
        </Router>
        </div>
      </ErrorBoundary>

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
