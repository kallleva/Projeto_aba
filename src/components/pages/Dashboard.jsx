import { useState, useEffect } from 'react'
import { Users, UserCheck, Target, ClipboardList, AlertCircle, CheckCircle2, Clock, TrendingUp, Calendar, User } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/AuthContext'
import ApiService from '@/lib/api'

export default function Dashboard() {
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState(null)
  const [metasData, setMetasData] = useState([])
  const [loading, setLoading] = useState(true)
  const [pacientes, setPacientes] = useState([])
  const [proximosAgendamentos, setProximosAgendamentos] = useState([])
  const { toast } = useToast()

  useEffect(() => {
    carregarDados()
  }, [user])

  const carregarDados = async () => {
    try {
      setLoading(true)
      
      // Admin e Profissional veem dashboard completo
      // Responsável vê apenas seus pacientes
      if (user?.tipo_usuario === 'PROFISSIONAL' || user?.tipo_usuario === 'ADMIN') {
        const [dashboard, metas] = await Promise.all([
          ApiService.request('/relatorios/dashboard'),
          ApiService.getMetasTerapeuticas()
        ])
        setDashboardData(dashboard)
        setMetasData(metas)
      } else if (user?.tipo_usuario === 'RESPONSAVEL') {
        // Para responsáveis, backend já retorna apenas seus pacientes autorizados
        const pacs = await ApiService.getPacientes()
        setPacientes(pacs)

        // Buscar agendamentos dos pacientes e calcular próximos compromissos
        const listas = await Promise.all(
          pacs.map(p => ApiService.getAgendamentos({ paciente_id: p.id }))
        )
        const todos = listas.flat()
        const agora = new Date()
        const proximos = todos
          .filter(a => {
            const d = new Date(a.data_hora)
            return !isNaN(d) && d >= agora
          })
          .sort((a, b) => new Date(a.data_hora) - new Date(b.data_hora))
          .slice(0, 5)
        setProximosAgendamentos(proximos)
        // Preenche estrutura mínima para compatibilidade, mas não será usada na UI do responsável
        setDashboardData({ resumo: { total_pacientes: pacs.length } })
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao carregar dados do dashboard: ' + error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="center-flex h-screen">
        <div className="text-lg animate-pulse text-color-neutral-600">Carregando dados...</div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="center-flex h-screen">
        <div className="alert alert-warning">
          <AlertCircle className="alert-icon" />
          <div className="alert-content">
            <strong>Sem dados disponíveis</strong>
            <p>Nenhuma informação para exibir no dashboard</p>
          </div>
        </div>
      </div>
    )
  }

  // Renderização específica para RESPONSAVEL (pais)
  if (user?.tipo_usuario === 'RESPONSAVEL') {
    return (
      <div className="page-section">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="page-title text-2xl md:text-3xl">Meu Painel</h1>
          <p className="page-subtitle text-sm md:text-base">Acompanhe seus(as) filhos(as), consultas e presença</p>
        </div>

        {/* Meus Pacientes */}
        <div className="card-spacing mb-6 md:mb-8">
          <div className="section-header">
            <Users size={18} className="color-info-icon" />
            <h2 className="section-header-title text-lg md:text-xl">Meus Pacientes</h2>
          </div>
          {pacientes.length > 0 ? (
            <div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-2">
              {pacientes.map(p => (
                <div key={p.id} className="border rounded-lg p-3 md:p-4 bg-white hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 md:gap-3 mb-2">
                    <User size={16} className="text-gray-500" />
                    <div className="font-semibold text-gray-900 text-sm md:text-base">{p.nome}</div>
                  </div>
                  <div className="text-xs md:text-sm text-gray-700 space-y-1">
                    <div><strong>Diagnóstico:</strong> {p.diagnostico || '-'}</div>
                    <div><strong>Nascimento:</strong> {new Date(p.data_nascimento).toLocaleDateString('pt-BR')}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-info mt-4">
              <AlertCircle className="alert-icon" />
              <div className="alert-content">Nenhum paciente vinculado ao seu usuário.</div>
            </div>
          )}
        </div>

        {/* Próximos Agendamentos */}
        <div className="card-spacing">
          <div className="section-header">
            <Calendar size={18} className="color-info-icon" />
            <h2 className="section-header-title text-lg md:text-xl">Próximos Agendamentos</h2>
          </div>
          {proximosAgendamentos.length > 0 ? (
            <div className="space-y-2 md:space-y-3">
              {proximosAgendamentos.map(a => (
                <div key={a.id} className="border rounded-lg p-3 md:p-4 bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0 hover:shadow-md transition-shadow">
                  <div className="space-y-1 flex-1">
                    <div className="font-medium text-gray-900 text-sm md:text-base">{new Date(a.data_hora).toLocaleString('pt-BR')}</div>
                    <div className="text-xs md:text-sm text-gray-700">
                      <strong>Profissional:</strong> {a.profissional?.nome || '-'}
                      {a.profissional?.especialidade ? ` - ${a.profissional.especialidade}` : ''}
                    </div>
                    {a.observacoes && (
                      <div className="text-xs text-gray-600">Obs: {a.observacoes}</div>
                    )}
                  </div>
                  <span className={`badge badge-sm whitespace-nowrap ${
                    (a.status || '').toUpperCase() === 'CONFIRMADO' ? 'badge-info' :
                    (a.status || '').toUpperCase() === 'REALIZADO' ? 'badge-success' :
                    (a.status || '').toUpperCase() === 'CANCELADO' ? 'badge-error' :
                    (a.status || '').toUpperCase() === 'FALTOU' ? 'badge-warning' : 'badge-neutral'
                  }`}>
                    {(a.status || 'AGENDADO').toString().replace(/_/g, ' ')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-info mt-4">
              <AlertCircle className="alert-icon" />
              <div className="alert-content">Nenhum agendamento futuro encontrado.</div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const { resumo, distribuicao_diagnosticos, distribuicao_metas } = dashboardData

  const stats = [
    {
      title: 'Total de Pacientes',
      value: resumo.total_pacientes,
      description: 'Pacientes cadastrados no sistema',
      icon: Users,
      colorClass: 'color-info'
    },
    {
      title: 'Profissionais',
      value: resumo.total_profissionais,
      description: 'Profissionais cadastrados',
      icon: UserCheck,
      colorClass: 'color-success'
    },
    {
      title: 'Metas Ativas',
      value: resumo.total_metas_ativas,
      description: 'Metas em andamento',
      icon: Target,
      colorClass: 'color-warning'
    },
    {
      title: 'Registros Hoje',
      value: resumo.registros_hoje,
      description: 'Registros diários feitos hoje',
      icon: ClipboardList,
      colorClass: 'color-success'
    }
  ]

  return (
    <div className="page-section">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="page-title text-2xl md:text-3xl">Dashboard</h1>
        <p className="page-subtitle text-sm md:text-base">
          Visão geral e evolução do sistema de acompanhamento terapêutico
        </p>
      </div>

      {/* Cards de estatísticas principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className={`stat-card ${stat.colorClass} p-3 md:p-4 rounded-lg border`}>
              <div className="stat-card-icon mb-2 md:mb-3 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-lg" style={{
                backgroundColor: stat.colorClass === 'color-info' ? '#bae6fd' :
                                stat.colorClass === 'color-success' ? '#d1fae5' :
                                stat.colorClass === 'color-warning' ? '#fef3c7' :
                                '#fee2e2'
              }}>
                <Icon size={20} className="md:w-6 md:h-6" style={{
                  color: stat.colorClass === 'color-info' ? '#0ea5e9' :
                         stat.colorClass === 'color-success' ? '#22c55e' :
                         stat.colorClass === 'color-warning' ? '#f59e0b' :
                         '#ef4444'
                }} />
              </div>
              <div className="stat-card-content">
                <div className="stat-card-label text-xs md:text-sm text-gray-600">{stat.title}</div>
                <div className="stat-card-value text-2xl md:text-3xl font-bold">{stat.value}</div>
                <p className="stat-card-desc text-xs md:text-sm text-gray-500 mt-1">{stat.description}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Grid de Distribuição e Status */}
      <div className="grid gap-4 md:gap-6 mb-6 md:mb-8 grid-cols-1 lg:grid-cols-3">
        {/* Distribuição de Diagnósticos */}
        <div className="card-spacing animate-fade-in lg:col-span-2">
          <div className="section-header">
            <TrendingUp size={18} className="color-info-icon" />
            <h2 className="section-header-title text-lg md:text-xl">Distribuição de Diagnósticos</h2>
          </div>
          
          <div className="space-y-3 md:space-y-4">
            {distribuicao_diagnosticos && distribuicao_diagnosticos.length > 0 ? (
              distribuicao_diagnosticos.map((item, index) => {
                const maxCount = Math.max(...distribuicao_diagnosticos.map(d => d.count)) || 1
                const percentage = (item.count / maxCount) * 100
                
                return (
                  <div key={index} className="flex flex-col gap-1 md:gap-2">
                    <div className="flex justify-between items-center">
                      <span className="label text-xs md:text-sm">{item.diagnostico}</span>
                      <span className="badge badge-info text-xs">{item.count}</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="alert alert-warning">
                <AlertCircle className="alert-icon" />
                <p className="alert-content">Nenhum diagnóstico registrado</p>
              </div>
            )}
          </div>
        </div>

        {/* Status das Metas */}
        <div className="card-spacing animate-fade-in lg:col-span-1" style={{ animationDelay: '0.1s' }}>
          <div className="section-header">
            <CheckCircle2 size={18} className="color-success-icon" />
            <h2 className="section-header-title text-lg md:text-xl">Status das Metas</h2>
          </div>

          <div className="space-y-2 md:space-y-3">
            {distribuicao_metas && distribuicao_metas.length > 0 ? (
              distribuicao_metas.map((item, index) => {
                let badgeClass = 'badge-info'
                let statusColor = 'color-info'
                let icon = <Clock size={16} />

                if (item.status === 'EM_ANDAMENTO') {
                  badgeClass = 'badge-warning'
                  statusColor = 'color-warning'
                  icon = <Clock size={16} />
                } else if (item.status === 'CONCLUIDA') {
                  badgeClass = 'badge-success'
                  statusColor = 'color-success'
                  icon = <CheckCircle2 size={16} />
                } else if (item.status === 'PAUSADA') {
                  badgeClass = 'badge-error'
                  statusColor = 'color-error'
                  icon = <AlertCircle size={16} />
                }

                return (
                  <div key={index} className="flex items-center justify-between p-2 md:p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className={statusColor}>{icon}</span>
                      <span className="card-text text-xs md:text-sm">
                        {item.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <span className={`badge badge-sm md:badge-base ${badgeClass}`}>{item.count}</span>
                  </div>
                )
              })
            ) : (
              <div className="alert alert-info">
                <AlertCircle className="alert-icon" />
                <p className="alert-content">Nenhuma meta registrada</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Metas com Melhor Desempenho */}
      <div className="card-spacing animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="section-header">
          <TrendingUp size={18} className="color-success-icon" />
          <h2 className="section-header-title text-lg md:text-xl">Metas com Melhor Desempenho</h2>
        </div>

        {metasData && metasData.length > 0 ? (
          <div className="overflow-x-auto -mx-3 md:mx-0">
            <table className="table w-full text-xs md:text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left">Paciente</th>
                  <th className="text-left hidden sm:table-cell">Profissional</th>
                  <th className="text-left">Meta</th>
                  <th className="text-left">Progresso</th>
                  <th className="text-left hidden md:table-cell">Status</th>
                </tr>
              </thead>
              <tbody>
                {metasData.slice(0, 5).map((meta, index) => {
                  // Dados do backend já trazem progresso, paciente e profissional
                  const progresso = meta.progresso || 0;
                  const nomePaciente = meta.paciente?.nome || '-';
                  const nomeProfissional = meta.profissional?.nome || '-';
                  
                  // Determinar cor do progresso
                  let corProgresso = '#22c55e'; // Verde
                  if (progresso < 50) corProgresso = '#ef4444'; // Vermelho
                  else if (progresso < 75) corProgresso = '#f59e0b'; // Amarelo
                  
                  return (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="font-medium text-gray-900 py-2 md:py-3 text-xs md:text-sm">{nomePaciente}</td>
                      <td className="text-gray-700 py-2 md:py-3 hidden sm:table-cell text-xs md:text-sm">{nomeProfissional}</td>
                      <td className="text-gray-700 py-2 md:py-3 text-xs md:text-sm" style={{maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis'}}>{meta.descricao || '-'}</td>
                      <td className="py-2 md:py-3">
                        <div className="flex items-center gap-1 md:gap-2">
                          <div className="progress-bar" style={{ width: '50px', minWidth: '50px' }}>
                            <div 
                              className="progress-fill" 
                              style={{ width: `${progresso}%`, backgroundColor: corProgresso }}
                            />
                          </div>
                          <span className="text-xs md:text-sm font-semibold text-gray-700 whitespace-nowrap">{Math.round(progresso)}%</span>
                        </div>
                      </td>
                      <td className="py-2 md:py-3 hidden md:table-cell">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          meta.status === 'Concluida' ? 'bg-green-100 text-green-800' : 
                          meta.status === 'EmAndamento' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {meta.status?.replace(/([A-Z])/g, ' $1').trim() || 'N/A'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="alert alert-info">
            <AlertCircle className="alert-icon" />
            <p className="alert-content">Nenhuma meta disponível</p>
          </div>
        )}
      </div>
    </div>
  )
}

