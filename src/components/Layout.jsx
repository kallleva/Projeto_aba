import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useAuth } from '@/contexts/AuthContext'
import { 
  Menu, 
  Home, 
  Users, 
  UserCheck, 
  FileText, 
  Target, 
  Calendar, 
  BarChart3,
  Heart,
  LogOut,
  Settings
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home, allowedFor: ['Profissional', 'Responsavel'] },
  { name: 'Pacientes', href: '/pacientes', icon: Users, allowedFor: ['Profissional'] },
  { name: 'Profissionais', href: '/profissionais', icon: UserCheck, allowedFor: ['Profissional'] },
  { name: 'Planos Terapêuticos', href: '/planos-terapeuticos', icon: FileText, allowedFor: ['Profissional'] },
  { name: 'Metas Terapêuticas', href: '/metas-terapeuticas', icon: Target, allowedFor: ['Profissional'] },
  { name: 'Registro Diário', href: '/registro-diario', icon: Calendar, allowedFor: ['Profissional'] },
  { name: 'Relatórios', href: '/relatorios', icon: BarChart3, allowedFor: ['Profissional', 'Responsavel'] },
  { name: 'Protocolo', href: '/protocolo', icon: FileText, allowedFor: ['Profissional'] }, // novo
  { name: 'Pergunta', href: '/pergunta', icon: Target, allowedFor: ['Profissional'] },      // novo
  { name: 'Resposta', href: '/resposta', icon: Calendar, allowedFor: ['Profissional'] },    // novo
]

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar para desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto border-r">
          <div className="flex items-center flex-shrink-0 px-4">
            <Heart className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-semibold text-gray-900">Projeto Aurora</span>
          </div>
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {filteredNavigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 flex-shrink-0 h-5 w-5 ${
                        isActive ? 'text-primary-foreground' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center">
              {/* Botão do menu mobile */}
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center h-16 px-4 border-b">
                      <Heart className="h-6 w-6 text-primary" />
                      <span className="ml-2 text-lg font-semibold">Projeto Aurora</span>
                    </div>
                    <nav className="flex-1 px-2 py-4 space-y-1">
                      {filteredNavigation.map((item) => {
                        const isActive = location.pathname === item.href
                        return (
                          <Link
                            key={item.name}
                            to={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                              isActive
                                ? 'bg-primary text-primary-foreground'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                          >
                            <item.icon className="mr-3 h-5 w-5" />
                            {item.name}
                          </Link>
                        )
                      })}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Logo mobile */}
              <div className="flex items-center md:hidden ml-2">
                <Heart className="h-6 w-6 text-primary" />
                <span className="ml-2 text-lg font-semibold">Projeto Aurora</span>
              </div>
            </div>

            {/* Menu do usuário */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:block text-sm text-gray-700">
                <span className="font-medium">{user?.nome}</span>
                <span className="ml-2 text-gray-500">({user?.tipo_usuario})</span>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user?.nome ? getInitials(user.nome) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.nome}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.tipo_usuario}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Conteúdo da página */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

