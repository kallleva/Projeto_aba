import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useAuth } from '@/contexts/AuthContext'
import { 
  Menu, 
  X,
  Home, 
  Users, 
  UserCheck, 
  FileText, 
  Target, 
  Calendar, 
  BarChart3,
  Heart,
  LogOut,
  Settings,
  ChevronRight,
  Building2
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home, allowedFor: ['PROFISSIONAL', 'RESPONSAVEL', 'ADMIN'] },
  { name: 'Usuários', href: '/usuarios', icon: UserCheck, allowedFor: ['ADMIN', 'PROFISSIONAL'] },
  { name: 'Pacientes', href: '/pacientes', icon: Users, allowedFor: ['PROFISSIONAL', 'ADMIN'] },
  { name: 'Profissionais', href: '/profissionais', icon: UserCheck, allowedFor: ['PROFISSIONAL', 'ADMIN'] },
  { name: 'Planos Terapêuticos', href: '/planos-terapeuticos', icon: FileText, allowedFor: ['PROFISSIONAL', 'ADMIN'] },
  { name: 'Metas Terapêuticas', href: '/metas-terapeuticas', icon: Target, allowedFor: ['PROFISSIONAL', 'ADMIN'] },
  { name: 'Registro Diário', href: '/registro-diario', icon: Calendar, allowedFor: ['PROFISSIONAL', 'ADMIN'] },
  { name: 'Relatórios', href: '/relatorios', icon: BarChart3, allowedFor: ['PROFISSIONAL', 'RESPONSAVEL', 'ADMIN'] },
  { name: 'Protocolo', href: '/protocolo', icon: FileText, allowedFor: ['PROFISSIONAL', 'ADMIN'] },
  { name: 'Empresas', href: '/empresas', icon: Building2, allowedFor: ['ADMIN'] },
]

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const filteredNavigation = navigation.filter(item => 
    item.allowedFor.includes(user?.tipo_usuario)
  )

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Desktop - com toggle de recolhimento */}
      <div className={`hidden md:flex md:flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'md:w-20' : 'md:w-64'
      } bg-white border-r border-gray-200`}>
        {/* Header do Sidebar */}
        <div className={`flex items-center justify-between h-20 px-4 border-b border-gray-100 ${
          sidebarCollapsed ? 'flex-col gap-2' : ''
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
              <Heart className="h-6 w-6 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900">Aurora</span>
                <span className="text-xs text-gray-500">Clínica</span>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className={`h-4 w-4 transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`} />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-6 space-y-1 overflow-y-auto">
          {filteredNavigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 border-l-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                title={sidebarCollapsed ? item.name : ''}
              >
                <item.icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                {!sidebarCollapsed && (
                  <span className="text-sm font-medium">{item.name}</span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer do Sidebar */}
        <div className={`border-t border-gray-100 p-4 ${sidebarCollapsed ? 'flex flex-col items-center gap-2' : ''}`}>
          <div className={`text-xs text-gray-500 ${sidebarCollapsed ? 'hidden' : 'block'}`}>
            Conectado como
          </div>
          <div className={`text-xs font-medium text-gray-700 ${sidebarCollapsed ? 'hidden' : 'block'} truncate`}>
            {user?.nome}
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex flex-col flex-1 overflow-visible">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between h-20 px-4 md:px-6">
            {/* Left side - Menu mobile + Logo */}
            <div className="flex items-center gap-4">
              {/* Menu mobile */}
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden h-10 w-10 p-0">
                    {sidebarOpen ? (
                      <X className="h-5 w-5" />
                    ) : (
                      <Menu className="h-5 w-5" />
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <div className="flex flex-col h-full">
                    {/* Mobile Sidebar Header */}
                    <div className="flex items-center gap-3 h-20 px-4 border-b border-gray-100">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                        <Heart className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">Aurora</span>
                        <span className="text-xs text-gray-500">Clínica</span>
                      </div>
                    </div>

                    {/* Mobile Navigation */}
                    <nav className="flex-1 px-2 py-4 space-y-1">
                      {filteredNavigation.map((item) => {
                        const isActive = location.pathname === item.href
                        return (
                          <Link
                            key={item.name}
                            to={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                              isActive
                                ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 border-l-4 border-blue-600'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <item.icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                            <span className="text-sm font-medium">{item.name}</span>
                          </Link>
                        )
                      })}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Logo Mobile */}
              <div className="flex md:hidden items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-bold text-gray-900">Aurora</span>
              </div>
            </div>

            {/* Right side - User menu */}
            <div className="flex items-center gap-4">
              {/* Empresa info */}
              {user?.empresa && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
                  <Building2 className="h-4 w-4 text-blue-600" />
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-600">Empresa</span>
                    <span className="text-sm font-semibold text-blue-600">{user.empresa}</span>
                  </div>
                </div>
              )}

              {/* User info desktop */}
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-medium text-gray-900">{user?.nome}</span>
                <span className="text-xs text-gray-500">{user?.tipo_usuario}</span>
              </div>

              {/* User dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="h-10 w-10 rounded-full p-0 bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700"
                  >
                    <span className="text-sm font-medium text-white">
                      {user?.nome ? getInitials(user.nome) : 'U'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-2">
                      <p className="text-sm font-semibold text-gray-900">{user?.nome}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                      <div className="flex items-center gap-2 pt-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                          {user?.tipo_usuario}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4 text-gray-400" />
                    <span>Configurações</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Conteúdo da página */}
        <main className="flex-1 overflow-visible">
          <div className="p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

