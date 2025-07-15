import { useNavigate } from "react-router-dom"
import { useContext } from "react";
import { UserContext } from "../context/userContext";

// Components
import Header from "../components/shared/Header";
import Footer from "../components/shared/Footer";

// Assets
import HERO_IMG from "../assets/hero-img.png"
import PATTERN_BG from "../assets/pattern-bg.svg"

const LandingPage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleCta = () => {
    if (!user) {
      navigate('/auth/login');
    } else {
      navigate('/dashboard');
    }
  }

  return (
    <div className="w-full min-h-full bg-white">
      <div className="container mx-auto px-4 py-6">

        {/* Header */}
        <Header />

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 pr-4 mb-8 md:mb-0 ml-0 md:ml-5">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Build Your{" "}
              <span className="text-transparent bg-clip-text bg-[radial-gradient(circle,_#7182ff_0%,_#3cff52_100%)] bg-[length:200%_200%] animate-text-shine">
                Resume Effortlessly
              </span>
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Craft a standout resume in minutes with our smart and intuitive resume builder.
            </p>
            
            <button className="btn-get-started" onClick={handleCta}>
              <span className="text-container">
                <span className="text">Get Started</span>
              </span>
            </button>

          </div>
          <div className="w-full md:w-1/2">
            <img
              src={HERO_IMG}
              alt="Hero Image"
              className="w-full rounded-lg"
            />
          </div>
        </div>

        {/* Feature Section */}
        <section
          className="mt-24 py-16 px-4 rounded-3xl"
          style={{
            backgroundImage: `url(${PATTERN_BG})`,
            backgroundRepeat: "repeat",
            backgroundSize: "auto",
          }}
        >
          <h2 className="text-3xl font-bold text-center mb-12">
            Features That Make You Shine
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-lg font-semibold mb-3">Easy Editing</h3>
              <p className="text-gray-600">
                Update your resume sections with live preview and instant
                formatting.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-lg font-semibold mb-3">Beautiful Templates</h3>
              <p className="text-gray-600">
                Choose from modern, professional templates that are easy to
                customize.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-lg font-semibold mb-3">One-Click Export</h3>
              <p className="text-gray-600">
                Download your resume instantly as a high-quality PDF with one
                click.
              </p>
            </div>
          </div>
        </section>

      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default LandingPage
