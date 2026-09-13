import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

// Utils & Components
import { validateEmail } from '../../utils/helper.jsx';
import { UserContext } from '../../context/userContext';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import SocialAuthButtons from '../../components/Auth/SocialAuthButtons';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { updateUser } = useContext(UserContext);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Handle OAuth Redirect Error notifications (clean URL after displaying once)
  useEffect(() => {
    const oauthError = searchParams.get('oauth_error');
    if (oauthError) {
      // Clean query parameter from URL immediately
      navigate('/auth/login', { replace: true });

      if (oauthError.includes('credentials_missing')) {
        const provider = oauthError.includes('google') ? 'Google' : 'LinkedIn';
        toast.error(
          `${provider} OAuth credentials are not set. Add ${provider.toUpperCase()}_CLIENT_ID and ${provider.toUpperCase()}_CLIENT_SECRET to backend/.env`,
          { id: 'oauth-error', duration: 6000 }
        );
      } else if (oauthError === 'access_denied') {
        toast.error('Authentication was canceled.', { id: 'oauth-error' });
      } else {
        const cleanMsg = oauthError
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&amp;/g, '&');
        toast.error(`Authentication failed (${cleanMsg}).`, { id: 'oauth-error' });
      }
    }
  }, [searchParams, navigate]);

  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Form Submission Function
  const onSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email address.';
    if (!formData.password) newErrors.password = 'Please enter your password.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      // Backend automatically sets HttpOnly 'token' cookie on success
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email: formData.email,
        password: formData.password,
      });

      updateUser(response.data);
      toast.success('Signed in successfully!');
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Invalid email or password. Please try again.';
      toast.error(message);
      setErrors({ form: message });
    } finally {
      setLoading(false);
    }
  };

  // Show Password Function
  const [showPassword, setShowPassword] = useState(false);

  const handleKeyDown = (e) => {
    if (e.ctrlKey) setShowPassword(true);
  };

  const handleKeyUp = (e) => {
    if (!e.ctrlKey) setShowPassword(false);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h2 className="text-2xl font-semibold tracking-tight">Sign in to your account</h2>
        <p className="text-sm text-gray-600">
          Don't have an account?
          <Link to="/auth/sign-up" className="text-black font-bold hover:underline ml-1">
            Create one now →
          </Link>
        </p>
      </div>

      {/* Social OAuth Sign-In (Google & LinkedIn) */}
      <SocialAuthButtons mode="sign-in" />

      <form onSubmit={onSubmit} className="flex flex-col gap-y-4">
        {errors.form && (
          <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
            {errors.form}
          </div>
        )}

        <div className="flex flex-col">
          <label htmlFor="email" className="mb-1 font-semibold text-sm">Email</label>
          <input
            type="text"
            name="email"
            id="email"
            value={formData.email}
            onChange={onChange}
            placeholder="john.doe@example.com"
            className="border border-gray-300 rounded px-3 py-2 lowercase text-sm focus:outline-hidden focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
          />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
        </div>

        <div className="flex flex-col">
          <label htmlFor="password" className="mb-1 font-semibold text-sm">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            value={formData.password}
            onChange={onChange}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
          />
          {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
        </div>

        <div className="mt-2 flex items-center gap-x-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-black text-white py-2.5 px-4 rounded-xl font-semibold text-sm hover:bg-gray-800 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <Link to="/auth/forgot-password" className="text-xs text-slate-600 hover:text-black font-semibold hover:underline">
            Forgot Password?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
