import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'

export default function ProtectedRoute({ children, requireProfissional = false }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-2 text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requireProfissional && user.tipo_usuario !== 'Profissional') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Acesso Negado</h2>
          <p className="mt-2 text-gray-600">
            Você não tem permissão para acessar esta página.
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Esta funcionalidade é restrita a profissionais.
          </p>
        </div>
      </div>
    )
  }

  return children
}

