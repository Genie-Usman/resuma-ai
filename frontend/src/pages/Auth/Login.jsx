import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Utils
import { validateEmail } from '../../utils/helper';
import { UserContext } from '../../context/userContext';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const Login = () => {
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});


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

    // login API Call
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email: formData.email,
        password: formData.password
      });

      const { token } = response.data;

      if (token) {
        localStorage.setItem('token', token);
        updateUser(response.data);
        navigate('/dashboard');
      }

    } catch (error) {
      if (error.response && error.response.data.message) {
        console.error(error.response.data.message);
      } else {
        console.error('Something went wrong. Please try again.');
      }
    }

  };

  // Show Password Function
  const [showPassword, setShowPassword] = useState(false);

  const handleKeyDown = (e) => {
    if (e.ctrlKey) {
      setShowPassword(true);
    }
  };

  const handleKeyUp = (e) => {
    if (!e.ctrlKey) {
      setShowPassword(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-1.5">
        <h2 className="text-2xl font-semibold tracking-tight">Sign in to your account</h2>
        <p className="text-sm text-gray-600">
          Don't have an account?
          <Link to="/auth/sign-up" className="text-black font-bold hover:underline ml-1">
            Create one now →
          </Link>
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-y-4">
        <div className="flex flex-col">
          <label htmlFor="email" className="mb-1 font-semibold text-sm">Email</label>
          <input
            type="text"
            name="email"
            id="email"
            value={formData.email}
            onChange={onChange}
            placeholder="john.doe@example.com"
            className="border border-gray-300 rounded px-3 py-2 lowercase"
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
            className="border border-gray-300 rounded px-3 py-2"
          />
          {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
        </div>

        <div className="mt-4 flex items-center gap-x-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors cursor-pointer"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <Link to="/auth/forgot-password" className="text-sm text-black font-semibold hover:underline">
            Forgot Password?
          </Link>
        </div>

      </form>
    </div>
  );
};

export default Login;
