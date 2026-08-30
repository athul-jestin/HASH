import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'
import { useAuth } from '@contexts/AuthContext'
import { userService } from '@services/index'

const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Enter your full name'),
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

const Register: React.FC = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) })

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      const { data: user } = await userService.register({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
      })
      login(user, user.token!)
      navigate('/movies', { replace: true })
    } catch (err) {
      const message =
        (err as AxiosError<{ detail?: string }>).response?.data?.detail || 'Could not create your account'
      setError('root', { message })
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <h1 className="text-3xl">Create your account</h1>
          <p className="mt-1 text-sm text-text-muted">Join HASH to start watching.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
              <label htmlFor="fullName" className="field-label">
                Full name
              </label>
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                className="input-field"
                placeholder="Jane Doe"
                {...register('fullName')}
              />
              {errors.fullName && <p className="field-error">{errors.fullName.message}</p>}
            </div>

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
                autoComplete="new-password"
                className="input-field"
                placeholder="At least 8 characters"
                {...register('password')}
              />
              {errors.password && <p className="field-error">{errors.password.message}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="field-label">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                className="input-field"
                placeholder="Re-enter your password"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && <p className="field-error">{errors.confirmPassword.message}</p>}
            </div>

            {errors.root && <p className="field-error">{errors.root.message}</p>}

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
              {isSubmitting ? 'Creating account…' : 'Sign up'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-text-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-accent hover:text-accent-hover">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
