import { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Placeholder for login logic
    setTimeout(() => {
      console.log('Login submitted:', formData);
      setLoading(false);
    }, 1000);
  };

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
          <label htmlFor="identifier" className="mb-1 font-semibold text-sm">Email</label>
          <input
            type="text"
            name="identifier"
            id="identifier"
            value={formData.identifier}
            onChange={onChange}
            placeholder="john.doe@example.com"
            className="border border-gray-300 rounded px-3 py-2 lowercase"
          />
          <p className="text-xs text-gray-500 mt-1">
            You can also enter your username.
          </p>
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
          <p className="text-xs text-gray-500 mt-1">
            Hold <kbd className="font-bold">Ctrl</kbd> to display your password temporarily.
          </p>
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
