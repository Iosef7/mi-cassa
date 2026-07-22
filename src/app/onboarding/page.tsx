"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { UserCircle2, Phone, AlignLeft, ArrowRight, Loader2 } from "lucide-react"

export default function OnboardingPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    phone: "",
    bio: "",
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.phone.trim() || !formData.bio.trim()) {
      toast.error("Por favor completa todos los campos.")
      return
    }

    if (!session?.user?.id) {
      toast.error("Sesión no encontrada.")
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch(`/api/users/${session.user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formData.phone,
          bio: formData.bio
        })
      });

      if (res.ok) {
        toast.success("¡Perfil completado con éxito!")
        // Forzar recarga completa para que el layout.tsx detecte los cambios
        window.location.href = "/admin"
      } else {
        const errorData = await res.json()
        toast.error(errorData.error || "Ocurrió un error al guardar tu perfil.")
        setIsLoading(false)
      }
    } catch (error) {
      toast.error("Ocurrió un error inesperado de conexión.")
      setIsLoading(false)
    }
  }

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 dark:bg-purple-500/5 blur-[120px] pointer-events-none" />
      
      <div className="max-w-xl w-full space-y-8 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-[0_8px_40px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_40px_rgb(0,0,0,0.2)] border border-white/40 dark:border-zinc-800/60 relative z-10 transition-all duration-300">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center mb-6 w-20 h-20 bg-primary/10 rounded-full overflow-hidden p-4 drop-shadow-md">
            <UserCircle2 className="w-12 h-12 text-primary" />
          </div>
          <h2 className="mt-2 text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            ¡Bienvenido, {session?.user?.name || 'Agente'}!
          </h2>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 font-medium">
            Antes de entrar al panel, necesitamos un par de datos para configurar tu perfil.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div className="relative group">
              <label htmlFor="phone" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 ml-1">
                Teléfono de Contacto
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-gray-400 group-focus-within:text-primary transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className="block w-full pl-12 pr-4 py-4 bg-white/50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 shadow-sm"
                  placeholder="+52 55 1234 5678"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="relative group">
              <label htmlFor="bio" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 ml-1">
                Biografía Corta
              </label>
              <div className="relative flex items-start">
                <div className="absolute left-4 top-4 text-gray-400 group-focus-within:text-primary transition-colors">
                  <AlignLeft className="w-5 h-5" />
                </div>
                <textarea
                  id="bio"
                  name="bio"
                  required
                  rows={4}
                  className="block w-full pl-12 pr-4 py-4 bg-white/50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 shadow-sm resize-none"
                  placeholder="Soy un experto en bienes raíces con más de 5 años de experiencia..."
                  value={formData.bio}
                  onChange={handleChange}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2 ml-1">Esta información será visible para tus prospectos e integraciones.</p>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || !formData.phone.trim() || !formData.bio.trim()}
              className="group relative w-full flex justify-center items-center py-4 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Completar Perfil y Entrar
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
