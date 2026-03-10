import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { Plus, Edit, Trash2, User, UserCheck, Search, AlertCircle, FileText, HelpCircle } from 'lucide-react'
import ApiService from '@/lib/api'
import PlanosTerapeuticosAjuda from './PlanosTerapeuticosAjuda'

export default function PlanosTerapeuticos() {
  const navigate = useNavigate()
  const [planos, setPlanos] = useState([])
  const [pacientes, setPacientes] = useState([])
  const [profissionais, setProfissionais] = useState([])
  const [loading, setLoading] = useState(true)
  const [ajudaOpen, setAjudaOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [planosData, pacientesData, profissionaisData] = await Promise.all([
        ApiService.getPlanosTerapeuticos(),
        ApiService.getPacientes(),
        ApiService.getProfissionais()
      ])
      setPlanos(planosData)
      setPacientes(pacientesData)
      setProfissionais(profissionaisData)
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao carregar dados: ' + error.message,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este plano terapêutico?')) {
      try {
        await ApiService.deletePlanoTerapeutico(id)
        toast({
          title: 'Sucesso',
          description: 'Plano terapêutico excluído com sucesso!'
        })
        loadData()
      } catch (error) {
        toast({
          title: 'Erro',
          description: error.message,
          variant: 'destructive'
        })
      }
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const [ano, mes, dia] = dateString.split('T')[0].split('-')
    return `${dia}/${mes}/${ano}`
  }

  // 🔎 filtra os planos com base no termo digitado
  const filteredPlanos = planos.filter((plano) =>
    plano.paciente_nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plano.profissional_nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plano.objetivo_geral?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-section">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="page-title">Planos Terapêuticos</h1>
            <p className="page-subtitle">
              Gerencie os planos terapêuticos dos pacientes
            </p>
          </div>
          <div className="flex gap-2 flex-wrap w-full md:w-auto">
            <Button 
              onClick={() => setAjudaOpen(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <HelpCircle className="h-4 w-4" />
              Ajuda
            </Button>
            <Button 
              onClick={() => navigate('/planos-terapeuticos/edit/novo')}
              style={{ backgroundColor: '#0ea5e9', color: 'white' }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Plano
            </Button>
          </div>
        </div>
      </div>

      <PlanosTerapeuticosAjuda open={ajudaOpen} onOpenChange={setAjudaOpen} />

      {/* Card Principal - Lista de Planos */}
      <div className="card-spacing">
        <div className="section-header mb-6">
          <FileText size={18} className="color-info-icon" />
          <h2 className="section-header-title">Lista de Planos Terapêuticos</h2>
        </div>
        <p className="card-text mb-6">Visualize e gerencie todos os planos terapêuticos cadastrados</p>

        {/* Campo de busca */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
          <Search size={18} className="color-neutral-icon flex-shrink-0 mt-1 sm:mt-0" />
          <Input
            className="flex-1 w-full sm:w-auto"
            placeholder="Buscar por paciente, profissional ou objetivo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Tabela ou Loading */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-4 mx-auto" style={{borderColor: 'var(--color-info-200)', borderTopColor: 'var(--color-info-500)'}}></div>
            <p className="mt-4 card-text font-medium">Carregando planos terapêuticos...</p>
          </div>
        ) : filteredPlanos.length === 0 ? (
          <div className="alert alert-info">
            <AlertCircle size={18} />
            <div className="alert-content">
              <p className="font-medium">Nenhum plano encontrado</p>
              {searchTerm && <p className="text-sm mt-1">Tente ajustar seus critérios de busca</p>}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th className="hidden sm:table-cell">Profissional</th>
                  <th className="hidden md:table-cell">Objetivo Geral</th>
                  <th className="hidden lg:table-cell">Data de Criação</th>
                  <th className="text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlanos.map((plano) => (
                  <tr key={plano.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <User size={16} className="color-info-icon flex-shrink-0" />
                        <span className="font-semibold">{plano.paciente_nome}</span>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <UserCheck size={16} className="color-success-icon flex-shrink-0" />
                        <span>{plano.profissional_nome}</span>
                      </div>
                    </td>
                    <td className="hidden md:table-cell">
                      <div 
                        className="max-w-xs truncate text-sm" 
                        title={plano.objetivo_geral}
                        style={{color: 'var(--color-neutral-700)'}}
                      >
                        {plano.objetivo_geral}
                      </div>
                    </td>
                    <td className="hidden lg:table-cell">
                      <span className="text-sm font-medium" style={{color: 'var(--color-neutral-600)'}}>
                        {formatDate(plano.data_criacao)}
                      </span>
                    </td>
                    <td>
                      <div className="flex justify-end gap-2 flex-wrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/planos-terapeuticos/edit/${plano.id}`)}
                          className="h-9 w-9 p-0"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(plano.id)}
                          className="h-9 w-9 p-0"
                          title="Deletar"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
