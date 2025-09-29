import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import GoogleLoginButton from '@/components/GoogleLoginButton'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Welcome</CardTitle>
          <CardDescription className="text-center">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <GoogleLoginButton />
        </CardContent>
      </Card>
    </div>
  )
}