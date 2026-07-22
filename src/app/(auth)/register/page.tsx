"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { signIn } from "next-auth/react"
import { toast } from "sonner"
import { ArrowRight, Loader2, ShieldAlert } from "lucide-react"
import { FcGoogle } from "react-icons/fc"
import logoImg from "@/../public/logo.png"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [tokenError, setTokenError] = useState<string | null>("Validando invitación...")

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      setTokenError("Esta plataforma es privada. Solo puedes registrarte si un administrador te envió un enlace de invitación.");
      return;
    }

    // Validate token
    fetch(`/api/invitations/${tokenParam}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setTokenError(data.error);
        } else {
          setToken(tokenParam);
          setTokenError(null);
          setFormData(prev => ({ ...prev, email: data.email }));
        }
      })
      .catch(() => setTokenError("Error de conexión al validar el enlace de invitación."));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, token }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message || "Error al registrar usuario")
        setIsLoading(false)
        return
      }

      toast.success("Cuenta creada exitosamente. Ahora puedes iniciar sesión.")
      router.push("/login")
    } catch (error) {
      toast.error("Ocurrió un error inesperado")
      setIsLoading(false)
    }
  }

  if (tokenError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-700 text-center">
          <div className="mx-auto h-16 w-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
            {tokenError === "Validando invitación..." ? (
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            ) : (
              <ShieldAlert className="h-8 w-8 text-red-600 dark:text-red-400" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {tokenError === "Validando invitación..." ? "Validando..." : "Acceso Restringido"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {tokenError}
          </p>
          {tokenError !== "Validando invitación..." && (
            <Link href="/login" className="mt-6 inline-block w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-colors">
              Ir a Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 dark:bg-purple-500/5 blur-[120px] pointer-events-none" />
      
      <div className="max-w-md w-full space-y-8 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-[0_8px_40px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_40px_rgb(0,0,0,0.2)] border border-white/40 dark:border-zinc-800/60 relative z-10 transition-all duration-300">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center mb-6 w-32 h-32 bg-white rounded-full overflow-hidden p-4 drop-shadow-md hover:scale-105 transition-transform duration-300">
            <Image 
              src={logoImg} 
              alt="Mi Cassa Logo" 
              className="object-contain w-full h-full"
              priority
            />
          </div>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Crear cuenta
          </h2>
          <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">
            Únete a Mi Cassa para gestionar tus propiedades
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nombre Completo
              </label>
              <input
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="appearance-none block w-full px-4 py-3 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm dark:text-white transition-all"
                placeholder="Juan Pérez"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Correo Electrónico (Pre-asignado)
              </label>
              <input
                name="email"
                type="email"
                required
                disabled
                value={formData.email}
                className="appearance-none block w-full px-4 py-3 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-sm text-gray-500 sm:text-sm bg-gray-100/50 dark:bg-zinc-800/50 backdrop-blur-sm dark:text-gray-400 cursor-not-allowed transition-all"
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Contraseña
              </label>
              <input
                name="password"
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                className="appearance-none block w-full px-4 py-3 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm dark:text-white transition-all"
                placeholder="Mínimo 6 caracteres"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-primary/25 text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Crear Cuenta
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-zinc-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white/70 dark:bg-zinc-900 text-gray-500 dark:text-gray-400 font-medium backdrop-blur-md">
                O regístrate con
              </span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => {
                setIsLoading(true);
                signIn("google", { callbackUrl: "/admin" });
              }}
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3.5 px-4 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-sm bg-white dark:bg-zinc-800 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-700 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all duration-200 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              <FcGoogle className="w-5 h-5 mr-2" />
              Google
            </button>
            <p className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
              Asegúrate de usar la misma cuenta de Google a la que llegó esta invitación.
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="font-bold text-primary hover:text-primary/80 transition-colors hover:underline">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
