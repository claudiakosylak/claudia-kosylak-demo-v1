import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { userApi } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export default function RegisterPage() {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: ''
  })
  const [errors, setErrors] = useState({
    first_name: '',
    last_name: ''
  })

  // Pre-populate with Google profile data if available
  useEffect(() => {
    if (user?.google_first_name || user?.google_last_name) {
      setFormData({
        first_name: user.google_first_name || '',
        last_name: user.google_last_name || ''
      })
    }
  }, [user])

  const validateField = (name: string, value: string): string => {
    const trimmedValue = value.trim()

    if (!trimmedValue) {
      return 'This field is required'
    }

    if (trimmedValue.length < 2) {
      return 'Must be at least 2 characters long'
    }

    if (trimmedValue.length > 30) {
      return 'Must not exceed 30 characters'
    }

    if (!/^[a-zA-Z\s]+$/.test(trimmedValue)) {
      return 'Must contain only alphabetical characters'
    }

    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    // Validate all fields
    const firstNameError = validateField('first_name', formData.first_name)
    const lastNameError = validateField('last_name', formData.last_name)

    setErrors({
      first_name: firstNameError,
      last_name: lastNameError
    })

    // Don't submit if there are errors
    if (firstNameError || lastNameError) {
      return
    }

    setLoading(true)

    try {
      const updatedUser = await userApi.updateUser(user.id, {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim()
      })

      updateUser(updatedUser)
      toast.success('Profile completed successfully!')

      // Redirect based on role
      const redirectPath = user.role === 'admin' ? '/admin/dashboard' : '/dashboard'
      navigate(redirectPath, { replace: true })
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Validate on change
    const error = validateField(name, value)
    setErrors(prev => ({
      ...prev,
      [name]: error
    }))
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const error = validateField(name, value)
    setErrors(prev => ({
      ...prev,
      [name]: error
    }))
  }

  const isFormValid = !errors.first_name && !errors.last_name &&
                      formData.first_name.trim() && formData.last_name.trim()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 space-y-6">
      <h1 className="absolute top-5 left-5 text-2xl font-bold tracking-tight">Claudia K Demo</h1>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Complete Your Profile</CardTitle>
          <CardDescription className="text-center">
            Please confirm your name to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                name="first_name"
                type="text"
                value={formData.first_name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your first name"
                disabled={loading}
                autoFocus
                className={errors.first_name ? 'border-red-500' : ''}
              />
              {errors.first_name && (
                <p className="text-sm text-red-500">{errors.first_name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                name="last_name"
                type="text"
                value={formData.last_name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your last name"
                disabled={loading}
                className={errors.last_name ? 'border-red-500' : ''}
              />
              {errors.last_name && (
                <p className="text-sm text-red-500">{errors.last_name}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !isFormValid}
            >
              {loading ? 'Saving...' : 'Continue'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
