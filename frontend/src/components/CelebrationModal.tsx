import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles, Trophy, Star, Rocket, X } from 'lucide-react'

interface CelebrationModalProps {
  isOpen: boolean
  onClose: () => void
  userName: string
}

export default function CelebrationModal({ isOpen, onClose, userName }: CelebrationModalProps) {
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; delay: number; duration: number }>>([])

  useEffect(() => {
    if (isOpen) {
      // Generate confetti pieces
      const pieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2
      }))
      setConfetti(pieces)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Confetti */}
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute top-0 w-2 h-2 animate-confetti"
          style={{
            left: `${piece.left}%`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            backgroundColor: ['#25ABDF', '#9459E5', '#FFD700', '#FF69B4'][Math.floor(Math.random() * 4)]
          }}
        />
      ))}

      {/* Modal Card */}
      <Card className="relative z-10 w-full max-w-lg bg-card/95 backdrop-blur-md border-accent/30 shadow-2xl animate-scale-in my-10">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </Button>

        <CardHeader className="text-center space-y-4 pt-8">
          {/* Trophy Animation */}
          <div className="flex justify-center">
            <div className="relative">
              <Trophy className="w-24 h-24 text-accent animate-bounce" />
              <Star className="absolute -top-2 -right-2 w-8 h-8 text-yellow-400 animate-spin-slow" />
              <Star className="absolute -bottom-2 -left-2 w-6 h-6 text-yellow-400 animate-spin-slow" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
              🎉 Congratulations! 🎉
            </h2>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pb-8">
          <div className="text-center space-y-3">
            <p className="text-lg text-muted-foreground">
              You've successfully registered for this demo application!
            </p>

            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-center gap-2 text-accent font-semibold">
                <Sparkles className="w-5 h-5" />
                <span>This is just the beginning</span>
                <Sparkles className="w-5 h-5" />
              </div>
              <p className="text-sm text-muted-foreground">
                You're experiencing a showcase of modern web development built by
              </p>
              <p className="text-lg font-bold text-foreground">
                Claudia Kosylak
              </p>
            </div>
          </div>


              <p className="text-sm text-accent font-semibold mt-1">
                Let's create something extraordinary. ✨
              </p>


          <Button
            onClick={onClose}
            className="w-full gradient-accent hover:gradient-accent-hover text-white text-lg py-6"
          >
            Start Exploring
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
