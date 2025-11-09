import { useState, useEffect } from 'react'
import { Users, UserCheck, Target, ClipboardList, AlertCircle, CheckCircle2, Clock, TrendingUp } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/AuthContext'
import ApiService from '@/lib/api'

export default function Dashboard() {
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState(null)
  const [metasData, setMetasData] = useState([])
  const [loading, setLoading] = useState(true)
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
        // Para responsáveis, mostrar apenas seus pacientes
        const pacientes = await ApiService.getPacientes()
        // Filtrar apenas pacientes vinculados a este responsável
        const meusPacientes = pacientes.filter(p => 
          p.responsavel_usuario?.id === user.id
        )
        setDashboardData({
          resumo: {
            total_pacientes: meusPacientes.length,
            total_profissionais: 0,
            total_metas_ativas: 0,
            metas_em_atraso: 0
          }
        })
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
      <div className="mb-8">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">
          Visão geral e evolução do sistema de acompanhamento terapêutico
        </p>
      </div>

      {/* Cards de estatísticas principais */}
      <div className="card-grid mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className={`stat-card ${stat.colorClass}`}>
              <div className="stat-card-icon" style={{
                backgroundColor: stat.colorClass === 'color-info' ? '#bae6fd' :
                                stat.colorClass === 'color-success' ? '#d1fae5' :
                                stat.colorClass === 'color-warning' ? '#fef3c7' :
                                '#fee2e2'
              }}>
                <Icon size={24} style={{
                  color: stat.colorClass === 'color-info' ? '#0ea5e9' :
                         stat.colorClass === 'color-success' ? '#22c55e' :
                         stat.colorClass === 'color-warning' ? '#f59e0b' :
                         '#ef4444'
                }} />
              </div>
              <div className="stat-card-content">
                <div className="stat-card-label">{stat.title}</div>
                <div className="stat-card-value">{stat.value}</div>
                <p className="stat-card-desc">{stat.description}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Grid de Distribuição e Status */}
      <div className="grid gap-6 mb-8" style={{ gridTemplateColumns: '2fr 1fr' }}>
        {/* Distribuição de Diagnósticos */}
        <div className="card-spacing animate-fade-in">
          <div className="section-header">
            <TrendingUp size={18} className="color-info-icon" />
            <h2 className="section-header-title">Distribuição de Diagnósticos</h2>
          </div>
          
          <div className="space-y-4">
            {distribuicao_diagnosticos && distribuicao_diagnosticos.length > 0 ? (
              distribuicao_diagnosticos.map((item, index) => {
                const maxCount = Math.max(...distribuicao_diagnosticos.map(d => d.count)) || 1
                const percentage = (item.count / maxCount) * 100
                
                return (
                  <div key={index} className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="label">{item.diagnostico}</span>
                      <span className="badge badge-info">{item.count}</span>
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
        <div className="card-spacing animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="section-header">
            <CheckCircle2 size={18} className="color-success-icon" />
            <h2 className="section-header-title">Status das Metas</h2>
          </div>

          <div className="space-y-3">
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
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className={statusColor}>{icon}</span>
                      <span className="card-text" style={{ fontSize: '0.875rem' }}>
                        {item.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <span className={`badge ${badgeClass}`}>{item.count}</span>
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
          <h2 className="section-header-title">Metas com Melhor Desempenho</h2>
        </div>

        {metasData && metasData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>Profissional</th>
                  <th>Meta</th>
                  <th>Progresso</th>
                  <th>Status</th>
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
                    <tr key={index}>
                      <td className="font-medium text-gray-900">{nomePaciente}</td>
                      <td className="text-gray-700">{nomeProfissional}</td>
                      <td className="text-gray-700" style={{maxWidth: '200px'}}>{meta.descricao || '-'}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="progress-bar" style={{ width: '80px' }}>
                            <div 
                              className="progress-fill" 
                              style={{ width: `${progresso}%`, backgroundColor: corProgresso }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-gray-700">{Math.round(progresso)}%</span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${meta.status === 'Concluida' ? 'badge-success' : meta.status === 'EmAndamento' ? 'badge-warning' : 'badge-error'}`}>
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

