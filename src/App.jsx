import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import Login from '@/components/Login'
import Layout from '@/components/Layout'
import Dashboard from '@/components/pages/Dashboard'
import Pacientes from '@/components/pages/Pacientes'
import Profissionais from '@/components/pages/Profissionais'
import PlanosTerapeuticos from '@/components/pages/PlanosTerapeuticos'
import MetasTerapeuticas from '@/components/pages/MetasTerapeuticas'
import RegistroDiario from '@/components/pages/RegistroDiario'
import Relatorios from '@/components/pages/Relatorios'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/pacientes" element={
                      <ProtectedRoute requireProfissional={true}>
                        <Pacientes />
                      </ProtectedRoute>
                    } />
                    <Route path="/profissionais" element={
                      <ProtectedRoute requireProfissional={true}>
                        <Profissionais />
                      </ProtectedRoute>
                    } />
                    <Route path="/planos-terapeuticos" element={
                      <ProtectedRoute requireProfissional={true}>
                        <PlanosTerapeuticos />
                      </ProtectedRoute>
                    } />
                    <Route path="/metas-terapeuticas" element={
                      <ProtectedRoute requireProfissional={true}>
                        <MetasTerapeuticas />
                      </ProtectedRoute>
                    } />
                    <Route path="/registro-diario" element={
                      <ProtectedRoute requireProfissional={true}>
                        <RegistroDiario />
                      </ProtectedRoute>
                    } />
                    <Route path="/relatorios" element={<Relatorios />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App

