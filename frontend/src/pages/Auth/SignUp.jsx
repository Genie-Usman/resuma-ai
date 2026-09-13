import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { UserContext } from '../../context/userContext';

// Utils
import { validateEmail } from '../../utils/helper.jsx';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import uploadImage from '../../utils/uploadImage';

// Components
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import SocialAuthButtons from '../../components/Auth/SocialAuthButtons';

const SignUp = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { updateUser } = useContext(UserContext);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    profileImageURL: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [profilePic, setProfilePic] = useState(null);

  // Handle OAuth Redirect Error notifications (clean URL after displaying once)
  useEffect(() => {
    const oauthError = searchParams.get('oauth_error');
    if (oauthError) {
      // Clean query parameter from URL immediately
      navigate('/auth/sign-up', { replace: true });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.name) newErrors.name = 'Please enter your name.';
    if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email address.';
    if (!formData.password) newErrors.password = 'Please enter your password.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      let uploadedProfileImageUrl = formData.profileImageURL;
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        uploadedProfileImageUrl = imgUploadRes.imageUrl || "";
      }

      // Backend automatically sets HttpOnly 'token' cookie on success
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        profileImageURL: uploadedProfileImageUrl,
      });

      updateUser(response.data);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(message);
      setErrors({ form: message });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey) setShowPassword(true);
  };

  const handleKeyUp = (e) => {
    if (!e.ctrlKey) setShowPassword(false);
  };

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <h2 className="text-2xl font-semibold tracking-tight">Create a new account</h2>
        <div className="text-sm text-gray-600">
          Already have an account?
          <Link to="/auth/login" className="text-black font-bold hover:underline ml-1">
            Sign in now →
          </Link>
        </div>
      </div>

      {/* Social OAuth Sign-Up (Google & LinkedIn) */}
      <SocialAuthButtons mode="sign-up" />

      <form
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        className="flex flex-col gap-y-3.5"
      >
        {errors.form && (
          <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
            {errors.form}
          </div>
        )}

        <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

        <div>
          <label className="block mb-1 font-semibold text-sm">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:outline-hidden focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
          />
          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block mb-1 font-semibold text-sm">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john.doe@example.com"
            className="w-full border border-gray-300 px-3 py-2 rounded lowercase text-sm focus:outline-hidden focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
          />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block mb-1 font-semibold text-sm">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:outline-hidden focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
          />
          <p className="text-xs text-gray-500 mt-1">
            Hold <code className="text-xs font-bold">Ctrl</code> to display your password temporarily.
          </p>
          {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-black text-white py-2.5 px-4 rounded-xl font-semibold text-sm hover:bg-gray-800 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 mt-1"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
};

export default SignUp;
