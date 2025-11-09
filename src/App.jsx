import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import Login from '@/components/Login'
import Layout from '@/components/Layout'
import Dashboard from '@/components/pages/Dashboard'
import DesignSystemExample from '@/components/pages/DesignSystemExample'
import Usuarios from '@/components/pages/Usuarios'
import Pacientes from '@/components/pages/Pacientes'
import PacienteDetalhes from '@/components/pages/PacienteDetalhes'
import Profissionais from '@/components/pages/Profissionais'
import PlanosTerapeuticos from '@/components/pages/PlanosTerapeuticos'
import MetasTerapeuticas from '@/components/pages/MetasTerapeuticas'
import RegistroDiario from '@/components/pages/RegistroDiario'
import RegistroDiarioGrid from '@/components/pages/RegistroDiarioGrid'
import RegistroDiarioEdit from '@/components/pages/RegistroDiarioEdit'
import RegistroDiarioExportImport from '@/components/pages/RegistroDiarioExportImport'
import Relatorios from '@/components/pages/Relatorios'
import Formulario from '@/components/pages/Formulario'
import FormularioEditor from '@/components/pages/FormularioEditor'
import Pergunta from '@/components/pages/Pergunta'
import Resposta from '@/components/pages/Resposta'
import Empresas from '@/components/pages/Empresas'
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
                    <Route path="/design-system" element={<DesignSystemExample />} />
                    
                    {/* ADMIN - Gestão de Usuários */}
                    <Route path="/usuarios" element={
                      <ProtectedRoute requireRole={['ADMIN', 'PROFISSIONAL']}>
                        <Usuarios />
                      </ProtectedRoute>
                    } />
                    
                    {/* PROFISSIONAL + ADMIN - Pacientes e relacionados */}
                    <Route path="/pacientes" element={
                      <ProtectedRoute requireRole={['PROFISSIONAL', 'ADMIN']}>
                        <Pacientes />
                      </ProtectedRoute>
                    } />
                    <Route path="/pacientes/:id" element={
                      <ProtectedRoute requireRole={['PROFISSIONAL', 'ADMIN']}>
                        <PacienteDetalhes />
                      </ProtectedRoute>
                    } />
                    
                    {/* PROFISSIONAL + ADMIN - Profissionais */}
                    <Route path="/profissionais" element={
                      <ProtectedRoute requireRole={['PROFISSIONAL', 'ADMIN']}>
                        <Profissionais />
                      </ProtectedRoute>
                    } />
                    
                    {/* PROFISSIONAL + ADMIN - Planos e Metas */}
                    <Route path="/planos-terapeuticos" element={
                      <ProtectedRoute requireRole={['PROFISSIONAL', 'ADMIN']}>
                        <PlanosTerapeuticos />
                      </ProtectedRoute>
                    } />
                    <Route path="/metas-terapeuticas" element={
                      <ProtectedRoute requireRole={['PROFISSIONAL', 'ADMIN']}>
                        <MetasTerapeuticas />
                      </ProtectedRoute>
                    } />
                    
                    {/* PROFISSIONAL + ADMIN - Registro Diário */}
                    <Route path="/registro-diario" element={
                      <ProtectedRoute requireRole={['PROFISSIONAL', 'ADMIN']}>
                        <RegistroDiarioGrid />
                      </ProtectedRoute>
                    } />
                    <Route path="/registro-diario/edit/:id" element={
                      <ProtectedRoute requireRole={['PROFISSIONAL', 'ADMIN']}>
                        <RegistroDiarioEdit />
                      </ProtectedRoute>
                    } />
                    <Route path="/registro-diario/export-import" element={
                      <ProtectedRoute requireRole={['PROFISSIONAL', 'ADMIN']}>
                        <RegistroDiarioExportImport />
                      </ProtectedRoute>
                    } />
                    
                    {/* PROFISSIONAL + ADMIN - Protocolos */}
                    <Route path="/Protocolo" element={
                      <ProtectedRoute requireRole={['PROFISSIONAL', 'ADMIN']}>
                        <Formulario />
                      </ProtectedRoute>
                    } />
                    <Route path="/Protocolo/novo" element={
                      <ProtectedRoute requireRole={['PROFISSIONAL', 'ADMIN']}>
                        <FormularioEditor />
                      </ProtectedRoute>
                    } />
                    <Route path="/Protocolo/:id" element={
                      <ProtectedRoute requireRole={['PROFISSIONAL', 'ADMIN']}>
                        <FormularioEditor />
                      </ProtectedRoute>
                    } />
                    
                    {/* PROFISSIONAL + ADMIN - Perguntas e Respostas */}
                    <Route path="/pergunta" element={
                      <ProtectedRoute requireRole={['PROFISSIONAL', 'ADMIN']}>
                        <Pergunta />
                      </ProtectedRoute>
                    } />
                    <Route path="/resposta" element={
                      <ProtectedRoute requireRole={['PROFISSIONAL', 'ADMIN']}>
                        <Resposta />
                      </ProtectedRoute>
                    } />
                    
                    {/* PROFISSIONAL + ADMIN + RESPONSAVEL - Relatórios */}
                    <Route path="/relatorios" element={
                      <ProtectedRoute requireRole={['PROFISSIONAL', 'RESPONSAVEL', 'ADMIN']}>
                        <Relatorios />
                      </ProtectedRoute>
                    } />
                    
                    {/* ADMIN - Gestão de Empresas */}
                    <Route path="/empresas" element={
                      <ProtectedRoute requireRole={['ADMIN']}>
                        <Empresas />
                      </ProtectedRoute>
                    } />
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
