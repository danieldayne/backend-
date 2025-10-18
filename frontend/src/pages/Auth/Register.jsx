import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    role: searchParams.get('role') || 'patient',
    specialization: '',
    qualifications: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { signUp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const roleFromUrl = searchParams.get('role');
    if (roleFromUrl && ['patient', 'dentist'].includes(roleFromUrl)) {
      setFormData(prev => ({ ...prev, role: roleFromUrl }));
    }
  }, [searchParams]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.full_name) {
      newErrors.full_name = 'Full name is required';
    }

    if (formData.role === 'dentist') {
      if (!formData.specialization) {
        newErrors.specialization = 'Specialization is required for dentists';
      }
      if (!formData.qualifications) {
        newErrors.qualifications = 'Qualifications are required for dentists';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    const result = await signUp(formData);
    
    if (result.success) {
      if (result.confirmationSent) {
        // Email confirmation required - show message and redirect to login
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        // Immediate login - redirect to dashboard
        navigate('/dashboard');
      }
    }
    
    setIsLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-blue-600 p-8 rounded-lg shadow-lg text-white">
        <div className="text-center">
          <div className="text-6xl mb-4">🦷</div>
          <h2 className="text-3xl font-bold text-white">
            Create your account
          </h2>
          <p className="mt-2 text-gray-200">
            Join our dental care platform today
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">I am a:</label>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center text-white">
                <input
                  type="radio"
                  name="role"
                  value="patient"
                  checked={formData.role === 'patient'}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span>Patient</span>
              </label>
              <label className="flex items-center text-white">
                <input
                  type="radio"
                  name="role"
                  value="dentist"
                  checked={formData.role === 'dentist'}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span>Dentist</span>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-white mb-2">
                Full Name
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                autoComplete="name"
                required
                className={`input text-black ${errors.full_name ? 'border-red-500' : ''}`}
                placeholder="Enter your full name"
                value={formData.full_name}
                onChange={handleChange}
              />
              {errors.full_name && (
                <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`input text-black ${errors.email ? 'border-red-500' : ''}`}
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className={`input pr-10 text-black ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className={`input pr-10 text-black ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Dentist-specific fields */}
            {formData.role === 'dentist' && (
              <>
                <div>
                  <label htmlFor="specialization" className="block text-sm font-medium text-white mb-2">
                    Specialization
                  </label>
                  <input
                    id="specialization"
                    name="specialization"
                    type="text"
                    autoComplete="organization-title"
                    required
                    className={`input text-black ${errors.specialization ? 'border-red-500' : ''}`}
                    placeholder="e.g., General Dentistry, Orthodontics"
                    value={formData.specialization}
                    onChange={handleChange}
                  />
                  {errors.specialization && (
                    <p className="text-red-500 text-sm mt-1">{errors.specialization}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="qualifications" className="block text-sm font-medium text-white mb-2">
                    Qualifications
                  </label>
                  <textarea
                    id="qualifications"
                    name="qualifications"
                    required
                    rows={3}
                    className={`input text-black ${errors.qualifications ? 'border-red-500' : ''}`}
                    placeholder="Enter your qualifications and certifications"
                    value={formData.qualifications}
                    onChange={handleChange}
                  />
                  {errors.qualifications && (
                    <p className="text-red-500 text-sm mt-1">{errors.qualifications}</p>
                  )}
                </div>
              </>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black py-3 text-lg rounded-md font-medium hover:bg-gray-100 transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                  Creating account...
                </div>
              ) : (
                'Create account'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-white">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-white hover:text-gray-200 underline"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
