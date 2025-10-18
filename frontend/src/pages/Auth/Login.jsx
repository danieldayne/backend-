import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Mail } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showResendOption, setShowResendOption] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const { signIn, resendConfirmation, testLogin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setShowResendOption(false);

    const result = await signIn(formData.email, formData.password);
    
    if (result.success) {
      // Navigate to appropriate dashboard based on user role or default route
      const redirectTo = from !== '/' ? from : '/patient/dashboard';
      navigate(redirectTo, { replace: true });
    } else if (result.error && result.error.toLowerCase().includes('email not confirmed')) {
      setShowResendOption(true);
    }
    
    setIsLoading(false);
  };

  const handleResendConfirmation = async () => {
    if (!formData.email) {
      alert('Please enter your email address first');
      return;
    }
    
    setIsResending(true);
    await resendConfirmation(formData.email);
    setIsResending(false);
  };

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };


  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-blue-600 p-8 rounded-lg shadow-lg text-white">
        <div className="text-center">
            <div className="text-6xl mb-4">🦷</div>
          <h2 className="text-3xl font-bold text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-gray-200">
            Welcome back! Please enter your details.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
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
                className="input text-black"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
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
                  autoComplete="current-password"
                  required
                  className="input pr-10 text-black"
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
            </div>
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
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          {/* Email Confirmation Resend Option */}
          {showResendOption && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-yellow-600 mr-2" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Email Not Confirmed
                  </h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Please check your email and click the confirmation link. Didn't receive it?
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleResendConfirmation}
                disabled={isResending}
                className="mt-3 w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 disabled:opacity-50 text-sm"
              >
                {isResending ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  'Resend Confirmation Email'
                )}
              </button>
            </div>
          )}

          <div className="text-center">
            <p className="text-white">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-white hover:text-gray-200 underline"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </form>


      </div>
    </div>
  );
};

export default Login;
