import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'

export default function ProtectedRoute({ children, requireRole = null, requireProfissional = false }) {
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

  // ADMIN tem acesso a tudo
  if (user.tipo_usuario === 'ADMIN') {
    return children
  }

  // Suporta tanto novo sistema (requireRole) quanto antigo (requireProfissional)
  let hasAccess = true

  if (requireRole) {
    if (Array.isArray(requireRole)) {
      // Se for array, verifica se o usuário está em algum dos roles
      hasAccess = requireRole.includes(user.tipo_usuario)
    } else {
      // Se for string, verifica exatamente
      hasAccess = user.tipo_usuario === requireRole
    }
  } else if (requireProfissional) {
    // Compatibilidade com antigo sistema
    hasAccess = user.tipo_usuario === 'PROFISSIONAL'
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Acesso Negado</h2>
          <p className="mt-2 text-gray-600">
            Você não tem permissão para acessar esta página.
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {requireRole && (
              `Esta funcionalidade é restrita para: ${Array.isArray(requireRole) ? requireRole.join(', ') : requireRole}`
            )}
          </p>
        </div>
      </div>
    )
  }

  return children
}

