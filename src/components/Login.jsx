import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/contexts/AuthContext'
import { Sun, Moon, Star, Heart, Loader2, Sparkles } from 'lucide-react'
import auroraImage from '@/assets/aurora-antartica-illustration-svg-download-png-7000168.webp'

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { login, user } = useAuth()

  if (user) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    console.log('='.repeat(50))
    console.log('🎯 [LOGIN FORM] Protocolo submetido')
    console.log('📝 Dados do protocolo:', formData)
    console.log('🌍 Variáveis de ambiente:', {
      VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
      NODE_ENV: import.meta.env.NODE_ENV
    })
    console.log('='.repeat(50))

    const result = await login(formData.email, formData.senha)

    console.log('📌 [LOGIN FORM] Resultado do login:', result)

    if (!result.success) {
      console.log('❌ [LOGIN FORM] Erro:', result.error)
      setError(result.error)
    } else {
      console.log('✅ [LOGIN FORM] Login realizado com sucesso!')
    }

    setLoading(false)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen flex overflow-hidden bg-white">
      {/* VERSÃO MOBILE - Aurora e elementos visuais */}
      <div className="lg:hidden w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 relative overflow-hidden flex flex-col min-h-screen">
        {/* Fundo noturno base mobile */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, #030617ff 0%, #0a0a20ff 20%, #23143eff 40%, #111f42ff 60%, #0c1e33ff 80%, #020810ff 100%)',
            pointerEvents: 'none'
          }}
        />
        
        {/* Imagem Aurora Antártica Mobile */}
        <div 
          className="absolute w-full bottom-0"
          style={{
            left: 0,
            height: '50%',
            backgroundImage: `url(${auroraImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'bottom center',
            backgroundRepeat: 'no-repeat',
            pointerEvents: 'none',
            opacity: 0.12,
            mixBlendMode: 'screen'
          }}
        />
        
        {/* Camada Aurora Antártica 1 - Mobile */}
        <div 
          className="absolute w-full bottom-0"
          style={{
            left: 0,
            height: '40%',
            background: 'radial-gradient(ellipse 200% 80% at 50% 100%, rgba(0, 200, 150, 0.3) 0%, rgba(0, 180, 140, 0.15) 15%, transparent 50%)',
            pointerEvents: 'none',
            filter: 'blur(35px)',
            mixBlendMode: 'screen'
          }}
        />
        
        {/* Camada Aurora Antártica 2 - Mobile */}
        <div 
          className="absolute w-full bottom-0"
          style={{
            left: 0,
            height: '35%',
            background: 'radial-gradient(ellipse 180% 70% at 50% 100%, rgba(100, 220, 180, 0.25) 0%, rgba(80, 200, 160, 0.12) 20%, transparent 55%)',
            pointerEvents: 'none',
            filter: 'blur(40px)',
            mixBlendMode: 'screen'
          }}
        />
        
        {/* Lua se movimentando - Mobile */}
        <div 
          className="absolute w-20 h-20 rounded-full opacity-80"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #fef3c7, #fcd34d 40%, #f59e0b 100%)',
            boxShadow: '0 0 30px rgba(252, 211, 77, 0.3)',
            animation: 'moon-float 12s ease-in-out infinite',
            top: '5%',
            right: '10%',
            zIndex: 5
          }}
        />
        
        {/* Estrelas Mobile - Poucas */}
        <div className="absolute top-12 left-8 w-1 h-1 bg-white rounded-full opacity-70 animate-pulse" style={{ boxShadow: '0 0 3px rgba(255, 255, 255, 0.6)', zIndex: 5 }} />
        <div className="absolute top-20 right-12 w-1.5 h-1.5 bg-cyan-300 rounded-full opacity-60 animate-pulse" style={{ animationDelay: '0.8s', boxShadow: '0 0 4px rgba(34, 211, 238, 0.6)', zIndex: 5 }} />
        <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-white rounded-full opacity-50 animate-pulse" style={{ animationDelay: '1s', zIndex: 5 }} />
        
        {/* Conteúdo Mobile - Sem fundo branco */}
        <div className="relative z-10 flex flex-col justify-start h-full pt-8 pb-12 px-6">
          {/* Logo e Branding */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-3">
              <div className="relative">
                <Sun className="w-16 h-16 text-yellow-200 animate-spin" style={{ animationDuration: '20s' }} />
                <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-purple-200" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-1 tracking-tight text-white">Aurora</h1>
            <p className="text-sm font-light text-purple-200">Do amanhecer ao dia perfeito</p>
          </div>

          {/* Protocolo Mobile - Sem card branco */}
          <div className="w-full max-w-sm mx-auto space-y-5">
            <div className="text-center mb-5">
              <h2 className="text-2xl font-bold text-white mb-0.5">Bem-vindo(a)</h2>
              <p className="text-purple-200 text-xs">Acesse sua conta</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-3 flex gap-2">
                  <div className="text-red-300 mt-0.5">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-red-200">{error}</p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="block text-xs font-semibold text-purple-200">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="seu@email.com"
                  className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha" className="block text-xs font-semibold text-purple-200">Senha</Label>
                <Input
                  id="senha"
                  name="senha"
                  type="password"
                  value={formData.senha}
                  onChange={handleChange}
                  required
                  placeholder="Sua senha"
                  className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all text-sm"
                />
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all shadow-lg text-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  <span>Entrar</span>
                )}
              </Button>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-3.5 h-3.5 rounded border-white/30 bg-white/10" />
                  <span className="text-purple-200">Lembrar</span>
                </label>
                <a href="#" className="text-cyan-300 hover:text-cyan-200 font-medium">Recuperar</a>
              </div>
            </form>

            <div className="text-center pt-4 border-t border-white/10">
              <p className="text-xs text-purple-300">
                Não tem uma conta? <a href="#" className="text-cyan-300 hover:text-cyan-200 font-semibold">Contate admin</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* LADO ESQUERDO - Desktop (original) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 relative overflow-hidden items-center justify-center">
        {/* Fundo noturno escuro */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-slate-900" />
        
        {/* Conteúdo do lado esquerdo - CENTRADO E ELEVADO */}
        <div className="relative z-10 px-8 text-white max-w-md text-center -translate-y-20">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <Sun className="w-20 h-20 text-yellow-200 animate-spin" style={{ animationDuration: '20s' }} />
              <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-purple-200" />
            </div>
          </div>

          <h1 className="text-5xl font-bold mb-4 tracking-tight">Aurora</h1>
          <p className="text-xl font-light mb-6 text-purple-100">Do amanhecer ao dia perfeito</p>

          <div className="space-y-4 text-purple-100">
            <p className="text-base leading-relaxed">
              Um sistema integrado para acompanhamento terapêutico que ilumina o caminho de cada criança, desde os primeiros passos até o desenvolvimento pleno.
            </p>
            
            <div className="pt-6 space-y-3">
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 mt-1 text-pink-300 flex-shrink-0" />
                <span className="text-sm">Acompanhamento personalizado e humanizado</span>
              </div>
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 mt-1 text-yellow-300 flex-shrink-0" />
                <span className="text-sm">Progresso contínuo e evolução visível</span>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 mt-1 text-purple-300 flex-shrink-0" />
                <span className="text-sm">Ferramenta essencial para clínicas e terapeutas</span>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-xs text-purple-200">Especializado em TEA, TDAH e desenvolvimento infantil</p>
          </div>
        </div>
        
        {/* Camadas de animação - Cometas e Estrelas no topo */}
        <div className="absolute inset-0">
          {/* Cometas passando */}
          <div 
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: '20%',
              left: '10%',
              boxShadow: '0 0 10px 2px rgba(255, 255, 255, 0.8)',
              animation: 'comet-fly 8s linear infinite'
            }}
          />
          <div 
            className="absolute w-0.5 h-0.5 bg-cyan-300 rounded-full"
            style={{
              top: '40%',
              right: '15%',
              boxShadow: '0 0 8px 1px rgba(34, 211, 238, 0.6)',
              animation: 'comet-fly 10s linear infinite',
              animationDelay: '2s'
            }}
          />
          <div 
            className="absolute w-0.5 h-0.5 bg-purple-300 rounded-full"
            style={{
              top: '50%',
              left: '20%',
              boxShadow: '0 0 8px 1px rgba(196, 181, 253, 0.6)',
              animation: 'comet-fly 12s linear infinite',
              animationDelay: '4s'
            }}
          />
        </div>
        
        {/* Estrelas piscando - Topo */}
        <div className="absolute top-10 left-10 w-1.5 h-1.5 bg-white rounded-full opacity-80 animate-pulse" style={{ boxShadow: '0 0 4px rgba(255, 255, 255, 0.8)', zIndex: 5 }} />
        <div className="absolute top-20 right-20 w-1 h-1 bg-white rounded-full opacity-60 animate-pulse" style={{ animationDelay: '0.5s', boxShadow: '0 0 3px rgba(255, 255, 255, 0.6)', zIndex: 5 }} />
        <div className="absolute top-32 left-1/4 w-1.5 h-1.5 bg-cyan-300 rounded-full opacity-70 animate-pulse" style={{ animationDelay: '1s', boxShadow: '0 0 5px rgba(34, 211, 238, 0.7)', zIndex: 5 }} />
        <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-purple-300 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '1.5s', boxShadow: '0 0 3px rgba(196, 181, 253, 0.5)', zIndex: 5 }} />
        <div className="absolute top-1/3 left-1/3 w-1 h-1 bg-white rounded-full opacity-70 animate-pulse" style={{ animationDelay: '0.8s', zIndex: 5 }} />
        <div className="absolute bottom-32 right-1/3 w-1.5 h-1.5 bg-cyan-300 rounded-full opacity-60 animate-pulse" style={{ animationDelay: '1.2s', zIndex: 5 }} />
        
        {/* Lua se movimentando - Topo direito */}
        <div 
          className="absolute w-32 h-32 rounded-full opacity-90"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #fef3c7, #fcd34d 40%, #f59e0b 100%)',
            boxShadow: '0 0 40px rgba(252, 211, 77, 0.4), inset -5px -5px 15px rgba(0, 0, 0, 0.3)',
            animation: 'moon-float 12s ease-in-out infinite',
            top: '10%',
            right: '15%',
            zIndex: 5
          }}
        >
          <div className="absolute w-3 h-3 bg-gray-700 rounded-full opacity-40" style={{ top: '30%', left: '35%' }} />
          <div className="absolute w-2 h-2 bg-gray-700 rounded-full opacity-30" style={{ top: '50%', left: '55%' }} />
          <div className="absolute w-2.5 h-2.5 bg-gray-700 rounded-full opacity-35" style={{ bottom: '25%', left: '40%' }} />
        </div>
        
        {/* Fundo noturno base */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, #030617ff 0%, #0a0a20ff 20%, #23143eff 40%, #111f42ff 60%, #0c1e33ff 80%, #020810ff 100%)',
            pointerEvents: 'none'
          }}
        />
        
        {/* Imagem Aurora Antártica - Fundo com Opacidade */}
        <div 
          className="absolute w-full"
          style={{
            bottom: 0,
            left: 0,
            height: '100%',
            backgroundImage: `url(${auroraImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'bottom center',
            backgroundRepeat: 'no-repeat',
            pointerEvents: 'none',
            opacity: 0.10,
            mixBlendMode: 'screen'
          }}
        />
        
        {/* Camada Aurora Antártica 1 - Verde/Cyan */}
        <div 
          className="absolute w-full"
          style={{
            bottom: '5%',
            left: 0,
            height: '45%',
            background: 'radial-gradient(ellipse 200% 80% at 50% 100%, rgba(0, 200, 150, 0.4) 0%, rgba(0, 180, 140, 0.25) 15%, transparent 50%)',
            pointerEvents: 'none',
            filter: 'blur(40px)',
            mixBlendMode: 'screen'
          }}
        />
        
        {/* Camada Aurora Antártica 2 - Verde Claro */}
        <div 
          className="absolute w-full"
          style={{
            bottom: '10%',
            left: 0,
            height: '40%',
            background: 'radial-gradient(ellipse 180% 70% at 50% 100%, rgba(100, 220, 180, 0.35) 0%, rgba(80, 200, 160, 0.2) 20%, transparent 55%)',
            pointerEvents: 'none',
            filter: 'blur(50px)',
            mixBlendMode: 'screen'
          }}
        />
        
        {/* Camada Aurora Antártica 3 - Azul/Roxo */}
        <div 
          className="absolute w-full"
          style={{
            bottom: '15%',
            left: 0,
            height: '35%',
            background: 'radial-gradient(ellipse 190% 75% at 50% 100%, rgba(120, 160, 220, 0.3) 0%, rgba(100, 140, 200, 0.18) 25%, transparent 60%)',
            pointerEvents: 'none',
            filter: 'blur(55px)',
            mixBlendMode: 'screen'
          }}
        />
        
        {/* Camada Aurora Antártica 4 - Rosa/Magenta Suave */}
        <div 
          className="absolute w-full"
          style={{
            bottom: '20%',
            left: 0,
            height: '30%',
            background: 'radial-gradient(ellipse 170% 65% at 50% 100%, rgba(180, 140, 200, 0.25) 0%, rgba(160, 120, 180, 0.15) 30%, transparent 65%)',
            pointerEvents: 'none',
            filter: 'blur(60px)',
            mixBlendMode: 'screen'
          }}
        />
        
        {/* Camada Aurora Antártica 5 - Roxo Escuro */}
        <div 
          className="absolute w-full"
          style={{
            bottom: '25%',
            left: 0,
            height: '25%',
            background: 'radial-gradient(ellipse 150% 60% at 50% 100%, rgba(100, 80, 160, 0.2) 0%, rgba(80, 60, 140, 0.1) 35%, transparent 70%)',
            pointerEvents: 'none',
            filter: 'blur(65px)',
            mixBlendMode: 'screen'
          }}
        />

      </div>

      {/* LADO DIREITO - Protocolo de Login Desktop Apenas */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-6 sm:px-12 lg:px-16 bg-white">
                {/* Protocolo Desktop */}
        <div className="max-w-sm w-full mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Bem-vindo(a)</h2>
            <p className="text-gray-600 text-sm">Acesse sua conta para continuar acompanhando o progresso</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                  <div className="text-red-600 mt-0.5">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-red-900">{error}</p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="seu@email.com"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha" className="block text-sm font-semibold text-gray-700">Senha</Label>
                <Input
                  id="senha"
                  name="senha"
                  type="password"
                  value={formData.senha}
                  onChange={handleChange}
                  required
                  placeholder="Sua senha"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                />
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  <span>Entrar</span>
                )}
              </Button>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                  <span className="text-gray-600">Lembrar minha conta</span>
                </label>
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Recuperar senha</a>
              </div>
            </form>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Não tem uma conta?{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">Entre em contato com o administrador</a>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-center text-gray-500">
              🌍 Especializado em TEA, TDAH e desenvolvimento infantil<br />
              💙 Sistema seguro e confiável para profissionais de saúde
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes moon-float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-40px) translateX(20px); }
          50% { transform: translateY(-60px) translateX(0px); }
          75% { transform: translateY(-40px) translateX(-20px); }
        }

        @keyframes comet-fly {
          0% { transform: translateX(-50px) translateY(0px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(100vw) translateY(100vh); opacity: 0; }
        }



        @media (max-width: 1024px) {
          @keyframes moon-float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
        }
      `}</style>
    </div>
  )
}