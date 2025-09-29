import { useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'

declare global {
  interface Window {
    google: any
  }
}

interface GoogleLoginButtonProps {
  onSuccess?: () => void
  onError?: () => void
}

export default function GoogleLoginButton({ onSuccess, onError }: GoogleLoginButtonProps) {
  const { login } = useAuth()
  const buttonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google && buttonRef.current) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          // Explicitly disable FedCM
          use_fedcm_for_prompt: false,
        })

        // Render the Google button directly
        window.google.accounts.id.renderButton(
          buttonRef.current,
          {
            theme: "outline",
            size: "large",
            width: buttonRef.current.offsetWidth,
            text: "continue_with",
            shape: "rectangular"
          }
        )
      }
    }

    const handleCredentialResponse = async (response: any) => {
      try {
        const success = await login(response.credential)
        if (success) {
          onSuccess?.()
        } else {
          onError?.()
        }
      } catch (error) {
        console.error('Login error:', error)
        onError?.()
      }
    }

    if (window.google) {
      initializeGoogleSignIn()
    } else {
      // Wait for Google script to load
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.onload = initializeGoogleSignIn
      document.head.appendChild(script)
    }
  }, [login, onSuccess, onError])

  return (
    <div ref={buttonRef} className="w-full min-h-[44px]" />
  )
}
