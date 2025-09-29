import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import GoogleLoginButton from '@/components/GoogleLoginButton'
import { Code2, Sparkles, Rocket, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function LoginPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div
          className="absolute w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse"
          style={{
            top: '10%',
            left: '10%',
            animationDuration: '4s'
          }}
        />
        <div
          className="absolute w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"
          style={{
            bottom: '10%',
            right: '10%',
            animationDuration: '6s',
            animationDelay: '1s'
          }}
        />

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-accent/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          />
        ))}

        {/* Interactive Gradient Following Mouse */}
        <div
          className="absolute w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl transition-all duration-1000 ease-out pointer-events-none"
          style={{
            left: mousePosition.x - 250,
            top: mousePosition.y - 250,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-6 max-w-3xl animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Code2 className="w-12 h-12 text-accent animate-pulse" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent animate-gradient">
              Claudia Kosylak
            </h1>
            <Sparkles className="w-12 h-12 text-primary animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Full-Stack Developer Extraordinaire
          </h2>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Crafting elegant solutions with cutting-edge technology.
            Experience the fusion of creativity and engineering excellence.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            {[
              { icon: Rocket, text: 'Lightning Fast', delay: '0s' },
              { icon: Zap, text: 'Modern Tech Stack', delay: '0.1s' },
              { icon: Code2, text: 'Clean Architecture', delay: '0.2s' },
              { icon: Sparkles, text: 'Pixel Perfect', delay: '0.3s' }
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-accent/20 hover:border-accent/50 transition-all duration-300 hover:scale-105 animate-slide-up"
                style={{ animationDelay: item.delay }}
              >
                <item.icon className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Login Card */}
        <Card className="w-full max-w-md backdrop-blur-sm bg-card/80 border-accent/20 shadow-2xl animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome</CardTitle>
            <CardDescription className="text-center">
              Sign in to experience this demo masterpiece
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <GoogleLoginButton />
            <p className="text-xs text-center text-muted-foreground">
              Built with React, TypeScript and FastAPI
            </p>
          </CardContent>
        </Card>

        {/* Footer CTA */}
        <div className="text-center space-y-2 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <p className="text-sm text-muted-foreground">
            Impressed? Let's build something amazing together.
          </p>
          <div className="flex items-center justify-center gap-2 text-accent font-semibold">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>Available for hire</span>
            <Sparkles className="w-4 h-4 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
        </div>
      </div>
    </div>
  )
}
