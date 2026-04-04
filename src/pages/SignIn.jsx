import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, EyeOff, Eye, Loader2 } from 'lucide-react'
import { apiRequest } from '../config/api'
import logo from '../assets/logo.png'
import bgImage from '../assets/signin-bg.png'

export default function SignIn() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await apiRequest('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({ emailOrPhone: email, password }),
      })

      if (res.success && res.data?.role === 'ADMIN') {
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data))
        navigate('/home')
      } else if (res.success && res.data?.role !== 'ADMIN') {
        setError('Access denied. Admin privileges required.')
      } else {
        setError(res.message || 'Login failed. Please check your credentials.')
      }
    } catch (err) {
      setError('Unable to connect to server. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center"
      style={{ backgroundColor: '#ECF5FF' }}
    >
      {/* Background pattern image */}
      <img
        src={bgImage}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none"
      />

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center gap-10">
        {/* Logo */}
        <img src={logo} alt="Rushr" className="w-[163px] h-[163px] object-contain" />

        {/* Card */}
        <div
          className="w-[792px] rounded-[44px] flex items-center justify-center"
          style={{ backgroundColor: '#FEFEFE', padding: '32px' }}
        >
          <form onSubmit={handleSubmit} className="w-[728px] flex flex-col gap-12">
            {/* Heading */}
            <div className="flex flex-col items-center gap-4">
              <h1
                className="font-montserrat text-center leading-[40px]"
                style={{ fontSize: '40px', fontWeight: 800, color: '#0F0F0F' }}
              >
                Welcome Back!
              </h1>
              <p
                className="font-montserrat text-center"
                style={{ fontSize: '20px', fontWeight: 600, color: '#6A6A6A', lineHeight: '20px' }}
              >
                Sign In To Your Account
              </p>
            </div>

            {/* Fields + Button */}
            <div className="flex flex-col gap-6">
              {/* Error message */}
              {error && (
                <div className="px-4 py-3 rounded-xl text-sm font-montserrat font-medium" style={{ backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>
                  {error}
                </div>
              )}

              {/* Input fields */}
              <div className="flex flex-col gap-4">
                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label
                    className="font-montserrat"
                    style={{ fontSize: '16px', fontWeight: 500, color: '#0F0F0F' }}
                  >
                    Email
                  </label>
                  <div
                    className="flex items-center gap-3 rounded-xl border px-3 py-2"
                    style={{ borderColor: '#D9D9D9', height: '56px' }}
                  >
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="flex-1 outline-none bg-transparent font-montserrat text-sm"
                      style={{ color: '#0F0F0F', fontSize: '14px' }}
                    />
                    <Mail className="w-6 h-6 flex-shrink-0" style={{ color: '#6A6A6A' }} />
                  </div>
                </div>

                {/* Password */}
                <div className="flex flex-col gap-2">
                  <label
                    className="font-montserrat"
                    style={{ fontSize: '16px', fontWeight: 500, color: '#0F0F0F' }}
                  >
                    Password
                  </label>
                  <div
                    className="flex items-center gap-3 rounded-xl border px-3 py-2"
                    style={{ borderColor: '#D9D9D9', height: '56px' }}
                  >
                    <Lock className="w-6 h-6 flex-shrink-0" style={{ color: '#6A6A6A' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="flex-1 outline-none bg-transparent font-montserrat text-sm"
                      style={{ color: '#0F0F0F', fontSize: '14px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="flex-shrink-0"
                    >
                      {showPassword ? (
                        <Eye className="w-6 h-6" style={{ color: '#6A6A6A' }} />
                      ) : (
                        <EyeOff className="w-6 h-6" style={{ color: '#6A6A6A' }} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl font-montserrat flex items-center justify-center gap-2 disabled:opacity-70"
                style={{
                  backgroundColor: '#0067DE',
                  height: '56px',
                  fontSize: '18px',
                  fontWeight: 800,
                  color: '#FEFEFE',
                }}
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
