import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, EyeOff, Eye, Loader2 } from 'lucide-react'
import { apiRequest } from '../config/api'
import { saveSession } from '../lib/session'
import { ROUTES } from '../config/routes'
import { ENDPOINTS } from '../config/endpoints'
import { AUTH_TEXT, COMMON_TEXT } from '../texts'
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
      const res = await apiRequest(ENDPOINTS.login, {
        method: 'POST',
        body: JSON.stringify({ emailOrPhone: email, password }),
      })

      if (res.success && res.data?.role === 'ADMIN') {
        saveSession(res.data)
        navigate(ROUTES.home)
      } else if (res.success && res.data?.role !== 'ADMIN') {
        setError(AUTH_TEXT.accessDenied)
      } else {
        setError(res.message || AUTH_TEXT.loginFailed)
      }
    } catch {
      setError(AUTH_TEXT.networkError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center"
      style={{ backgroundColor: '#ECF5FF' }}
    >
      {/* Background pattern image */}
      <img
        src={bgImage}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-10"
      />

      {/* Center content */}
      <div className="relative z-10 flex w-full flex-col items-center gap-6 px-4 py-8 sm:gap-10">
        {/* Logo */}
        <img
          src={logo}
          alt={COMMON_TEXT.brandName}
          className="h-24 w-24 object-contain sm:h-[163px] sm:w-[163px]"
        />

        {/* Card */}
        <div
          className="flex w-full max-w-[792px] items-center justify-center rounded-[24px] p-6 sm:rounded-[44px] sm:p-8"
          style={{ backgroundColor: '#FEFEFE' }}
        >
          <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-[728px] flex-col gap-8 sm:gap-12"
          >
            {/* Heading */}
            <div className="flex flex-col items-center gap-4">
              <h1
                className="text-center text-3xl leading-tight sm:text-[40px] sm:leading-[40px]"
                style={{ fontWeight: 800, color: '#0F0F0F' }}
              >
                {AUTH_TEXT.title}
              </h1>
              <p
                className="text-center"
                style={{ fontSize: '20px', fontWeight: 600, color: '#6A6A6A', lineHeight: '20px' }}
              >
                {AUTH_TEXT.subtitle}
              </p>
            </div>

            {/* Fields + Button */}
            <div className="flex flex-col gap-6">
              {/* Error message */}
              {error && (
                <div
                  className="rounded-xl px-4 py-3 text-sm font-medium"
                  style={{
                    backgroundColor: '#FEF2F2',
                    color: '#DC2626',
                    border: '1px solid #FECACA',
                  }}
                >
                  {error}
                </div>
              )}

              {/* Input fields */}
              <div className="flex flex-col gap-4">
                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="signin-email"
                    className=""
                    style={{ fontSize: '16px', fontWeight: 500, color: '#0F0F0F' }}
                  >
                    {AUTH_TEXT.emailLabel}
                  </label>
                  <div
                    className="flex items-center gap-3 rounded-xl border px-3 py-2"
                    style={{ borderColor: '#D9D9D9', height: '56px' }}
                  >
                    <input
                      id="signin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={AUTH_TEXT.emailPlaceholder}
                      required
                      className="flex-1 bg-transparent text-sm outline-none"
                      style={{ color: '#0F0F0F', fontSize: '14px' }}
                    />
                    <Mail className="h-6 w-6 flex-shrink-0" style={{ color: '#6A6A6A' }} />
                  </div>
                </div>

                {/* Password */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="signin-password"
                    className=""
                    style={{ fontSize: '16px', fontWeight: 500, color: '#0F0F0F' }}
                  >
                    {AUTH_TEXT.passwordLabel}
                  </label>
                  <div
                    className="flex items-center gap-3 rounded-xl border px-3 py-2"
                    style={{ borderColor: '#D9D9D9', height: '56px' }}
                  >
                    <Lock className="h-6 w-6 flex-shrink-0" style={{ color: '#6A6A6A' }} />
                    <input
                      id="signin-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={AUTH_TEXT.passwordPlaceholder}
                      required
                      className="flex-1 bg-transparent text-sm outline-none"
                      style={{ color: '#0F0F0F', fontSize: '14px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="flex-shrink-0"
                    >
                      {showPassword ? (
                        <Eye className="h-6 w-6" style={{ color: '#6A6A6A' }} />
                      ) : (
                        <EyeOff className="h-6 w-6" style={{ color: '#6A6A6A' }} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl disabled:opacity-70"
                style={{
                  backgroundColor: '#0067DE',
                  height: '56px',
                  fontSize: '18px',
                  fontWeight: 800,
                  color: '#FEFEFE',
                }}
              >
                {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                {loading ? AUTH_TEXT.submitting : AUTH_TEXT.submit}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
