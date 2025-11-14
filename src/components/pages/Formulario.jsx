import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ApiService from '@/lib/api'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Plus, Edit, Trash2, FileText, Clock, AlertCircle } from 'lucide-react'

export default function Formularios() {
  const [formularios, setFormularios] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    fetchFormularios()
  }, [])

  const fetchFormularios = async () => {
    try {
      setLoading(true)
      const data = await ApiService.getFormularios()
      setFormularios(data)
    } catch (err) {
      console.error('Erro ao buscar Protocolos:', err)
      toast({
        title: 'Erro',
        description: 'Erro ao carregar Protocolos: ' + err.message,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteFormulario = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este formulário?')) return
    
    try {
      await ApiService.deleteFormulario(id)
      setFormularios(formularios.filter(f => f.id !== id))
      toast({
        title: 'Sucesso',
        description: 'Formulário excluído com sucesso!'
      })
    } catch (err) {
      console.error('Erro ao deletar formulário:', err)
      toast({
        title: 'Erro',
        description: 'Erro ao excluir formulário: ' + err.message,
        variant: 'destructive'
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-section">
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <div>
            <h1 className="page-title">Protocolo</h1>
            <p className="page-subtitle">
              Cadastre modelos de Protocolo com perguntas estruturadas para checklists diários
            </p>
          </div>
          <Button 
            onClick={() => navigate("/protocolo/novo")}
            style={{ backgroundColor: '#0ea5e9', color: 'white' }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Formulário
          </Button>
        </div>
      </div>

      {/* Lista de Protocolos */}
      <div className="card-spacing">
        <div className="section-header mb-6">
          <FileText size={18} className="color-info-icon" />
          <h2 className="section-header-title">Lista de Protocolo</h2>
        </div>
        <p className="card-text mb-6">Visualize e gerencie os Protocolos criados para checklists diários</p>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-4 mx-auto" style={{borderColor: 'var(--color-info-200)', borderTopColor: 'var(--color-info-500)'}}></div>
            <p className="mt-4 card-text font-medium">Carregando Protocolos...</p>
          </div>
        ) : formularios.length === 0 ? (
          <div className="alert alert-info">
            <FileText size={18} />
            <div className="alert-content">
              <p className="font-medium">Nenhum formulário criado ainda</p>
              <p className="text-sm mt-1">Crie o primeiro formulário para começar a gerenciar checklists</p>
              <Button 
                onClick={() => navigate("/protocolo/novo")}
                className="mt-3"
                style={{ backgroundColor: '#0ea5e9', color: 'white' }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeiro Formulário
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Categoria</th>
                  <th>Descrição</th>
                  <th>Perguntas</th>
                  <th>Tipos</th>
                  <th>Última Atualização</th>
                  <th className="text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {formularios.map((form) => {
                  const tiposPerguntas = form.perguntas ? [...new Set(form.perguntas.map(p => p.tipo))] : []
                  const temFormula = tiposPerguntas.includes('FORMULA')
                  const temPercentual = tiposPerguntas.includes('PERCENTUAL')
                  
                  return (
                    <tr key={form.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="color-info-icon flex-shrink-0" />
                          <span className="font-semibold">{form.nome}</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-info text-xs">
                          {form.categoria || 'Sem categoria'}
                        </span>
                      </td>
                      <td>
                        <div 
                          className="max-w-xs truncate text-sm"
                          title={form.descricao}
                          style={{color: 'var(--color-neutral-700)'}}
                        >
                          {form.descricao || '-'}
                        </div>
                      </td>
                      <td>
                        <span className="font-semibold text-sm">{form.perguntas?.length || 0}</span>
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {temFormula && (
                            <span className="badge badge-warning text-xs" title="Com Fórmulas">
                              📐 Fórmula
                            </span>
                          )}
                          {temPercentual && (
                            <span className="badge badge-success text-xs" title="Com Percentuais">
                              📊 Percentual
                            </span>
                          )}
                          {!temFormula && !temPercentual && (
                            <span style={{color: 'var(--color-neutral-400)', fontSize: '0.875rem'}}>-</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-1 text-sm" style={{color: 'var(--color-neutral-600)'}}>
                          <Clock size={14} />
                          {form.atualizadoEm || form.atualizado_em ? 
                            new Date(form.atualizadoEm || form.atualizado_em).toLocaleDateString('pt-BR') : 
                            (form.criadoEm || form.criado_em ? 
                              new Date(form.criadoEm || form.criado_em).toLocaleDateString('pt-BR') : 
                              '-'
                            )
                          }
                        </div>
                      </td>
                      <td>
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => navigate(`/protocolo/${form.id}`)}
                            className="h-9 w-9 p-0"
                            title="Editar formulário"
                          >
                            <Edit size={16} />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDeleteFormulario(form.id)}
                            className="h-9 w-9 p-0"
                            title="Excluir formulário"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
