import { useState } from 'react';
import { Link } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log('Submitted:', formData);
      // You can handle actual submission later
    }
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey) setShowPassword(true);
  };

  const handleKeyUp = (e) => {
    if (!e.ctrlKey) setShowPassword(false);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <h2 className="text-2xl font-semibold tracking-tight">Create a new account</h2>
        <h6>
          <span className="opacity-75">Already have an account?</span>
          <button className="px-1.5 text-black font-bold hover:underline">
            <Link to="/auth/login">
              Sign in now <span className="ml-1">→</span>
            </Link>
          </button>
        </h6>
      </div>

      <form
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        className="flex flex-col gap-y-3"
      >
        <div>
          <label className="block mb-1 font-semibold text-sm">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full border border-gray-300 px-3 py-1.5 rounded"
          />
          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block mb-1 font-semibold text-sm">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="john.doe"
            className="w-full border border-gray-300 px-3 py-1.5 rounded lowercase"
          />
          {errors.username && <p className="text-sm text-red-500 mt-1">{errors.username}</p>}
        </div>

        <div>
          <label className="block mb-1 font-semibold text-sm">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john.doe@example.com"
            className="w-full border border-gray-300 px-3 py-1.5 rounded lowercase"
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
            className="w-full border border-gray-300 px-3 py-1.5 rounded"
          />
          <p className="text-xs text-gray-500 mt-1">
            Hold <code className="text-xs font-bold">Ctrl</code> to display your password temporarily.
          </p>
          {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
        </div>

        <button
          type="submit"
          className="flex-1 bg-black text-white py-1.5 px-4 rounded hover:bg-gray-800 transition-colors cursor-pointer"
        >
          Sign up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
