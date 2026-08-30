import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'
import { useAuth } from '@contexts/AuthContext'
import { userService } from '@services/index'

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormValues = z.infer<typeof loginSchema>

const Login: React.FC = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const { data: user } = await userService.login(values)
      login(user, user.token!)
      const redirectTo = (location.state as { from?: string } | null)?.from || '/movies'
      navigate(redirectTo, { replace: true })
    } catch (err) {
      const message =
        (err as AxiosError<{ detail?: string }>).response?.data?.detail || 'Invalid email or password'
      setError('root', { message })
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <h1 className="text-3xl">Welcome back</h1>
          <p className="mt-1 text-sm text-text-muted">Log in to keep watching.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="field-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="input-field"
                placeholder="you@example.com"
                {...register('email')}
              />
              {errors.email && <p className="field-error">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="field-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className="input-field"
                placeholder="••••••••"
                {...register('password')}
              />
              {errors.password && <p className="field-error">{errors.password.message}</p>}
            </div>

            {errors.root && <p className="field-error">{errors.root.message}</p>}

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
              {isSubmitting ? 'Logging in…' : 'Log in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-text-muted">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-medium text-accent hover:text-accent-hover">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
