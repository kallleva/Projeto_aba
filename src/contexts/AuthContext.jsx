import { createContext, useContext, useState, useEffect } from 'react'
import ApiService from '@/lib/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))
  
  // Debug: Mostrar variáveis de ambiente
  console.log('🔵 [AuthContext] VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL)
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://auroraclin.com.br/api'
  console.log('🔵 [AuthContext] API_BASE_URL Final:', API_BASE_URL)
  useEffect(() => {
    if (token) {
      verifyToken()
    } else {
      setLoading(false)
    }
  }, [token])

  const verifyToken = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-token`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.usuario)
      } else {
        // Token inválido, remover
        logout()
      }
    } catch (error) {
      console.error('Erro ao verificar token:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, senha) => {
    try {
      console.log('🟢 [LOGIN] Iniciando login...')
      console.log('📧 [LOGIN] Email:', email)
      console.log('🔗 [LOGIN] URL da API:', API_BASE_URL)
      console.log('📍 [LOGIN] Endpoint completo:', `${API_BASE_URL}/auth/login`)
      
      const loginUrl = `${API_BASE_URL}/auth/login`
      console.log('🚀 [LOGIN] Fazendo requisição POST para:', loginUrl)
      
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, senha })
      })

      console.log('✅ [LOGIN] Resposta recebida com status:', response.status)
      console.log('📄 [LOGIN] Content-Type:', response.headers.get('content-type'))

      const data = await response.json()
      console.log('📦 [LOGIN] Dados da resposta:', data)

      if (response.ok) {
        console.log('✨ [LOGIN] Login bem-sucedido!')
        setToken(data.token)
        setUser(data.usuario)
        localStorage.setItem('token', data.token)
        return { success: true }
      } else {
        console.log('❌ [LOGIN] Erro na resposta:', data.erro)
        return { success: false, error: data.erro }
      }
    } catch (error) {
      console.error('💥 [LOGIN] Erro de conexão:', error)
      console.error('❌ [LOGIN] Mensagem:', error.message)
      return { success: false, error: 'Erro de conexão' }
    }
  }

  const register = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })

      const data = await response.json()

      if (response.ok) {
        return { success: true, data }
      } else {
        return { success: false, error: data.erro }
      }
    } catch (error) {
      return { success: false, error: 'Erro de conexão' }
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
  }

  const changePassword = async (senhaAtual, novaSenha) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          senha_atual: senhaAtual,
          nova_senha: novaSenha
        })
      })

      const data = await response.json()

      if (response.ok) {
        return { success: true }
      } else {
        return { success: false, error: data.erro }
      }
    } catch (error) {
      return { success: false, error: 'Erro de conexão' }
    }
  }

  // Funções de verificação de permissões
  const isProfissional = () => {
    return user?.tipo_usuario === 'PROFISSIONAL'
  }

  const isResponsavel = () => {
    return user?.tipo_usuario === 'RESPONSAVEL'
  }

  const canEdit = () => {
    return isProfissional()
  }

  const canCreatePlans = () => {
    return isProfissional()
  }

  const canRegisterProgress = () => {
    return isProfissional()
  }

  const canAccessPatient = (patientId) => {
    if (isProfissional()) {
      return true // Profissionais podem acessar todos os pacientes
    }
    if (isResponsavel()) {
      return user?.paciente_id === patientId
    }
    return false
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    changePassword,
    isProfissional,
    isResponsavel,
    canEdit,
    canCreatePlans,
    canRegisterProgress,
    canAccessPatient
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

