import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ApiService from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { Plus, Edit, Trash2, BarChart3, Search } from 'lucide-react'

export default function Tabulacoes() {
  const [tabulacoes, setTabulacoes] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('')
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    fetchTabulacoes()
  }, [])

  const fetchTabulacoes = async () => {
    try {
      setLoading(true)
      const data = await ApiService.getTabulacoes()
      setTabulacoes(data)
    } catch (err) {
      console.error('Erro ao buscar Tabulações:', err)
      toast({
        title: 'Erro',
        description: 'Erro ao carregar Tabulações: ' + err.message,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTabulacao = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta Tabulação?')) return
    
    try {
      await ApiService.deleteTabulacao(id)
      setTabulacoes(tabulacoes.filter(t => t.id !== id))
      toast({
        title: 'Sucesso',
        description: 'Tabulação excluída com sucesso!'
      })
    } catch (err) {
      console.error('Erro ao deletar Tabulação:', err)
      toast({
        title: 'Erro',
        description: 'Erro ao excluir Tabulação: ' + err.message,
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
            <h1 className="page-title">Tabulação de Execuções</h1>
            <p className="page-subtitle">
              Registre observações de execuções do paciente durante atendimentos com tabulação de desempenho
            </p>
          </div>
          <Button 
            onClick={() => navigate("/tabulacao/nova")}
            style={{ backgroundColor: '#0ea5e9', color: 'white' }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nova Tabulação
          </Button>
        </div>
      </div>

      {/* Lista de Tabulações */}
      <div className="card-spacing">
        <div className="section-header mb-6">
          <BarChart3 size={18} className="color-info-icon" />
          <h2 className="section-header-title">Lista de Tabulações</h2>
        </div>

        {!loading && tabulacoes.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 relative">
              <Search size={18} className="absolute left-3" style={{color: 'var(--color-neutral-400)'}} />
              <Input
                type="text"
                placeholder="Buscar por nome..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="h-10 pl-10"
              />
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-4 mx-auto" style={{borderColor: 'var(--color-info-200)', borderTopColor: 'var(--color-info-500)'}}></div>
            <p className="mt-4 card-text font-medium">Carregando Tabulações...</p>
          </div>
        ) : tabulacoes.length === 0 ? (
          <div className="alert alert-info">
            <BarChart3 size={18} />
            <div className="alert-content">
              <p className="font-medium">Nenhuma Tabulação criada ainda</p>
              <p className="text-sm mt-1">Crie a primeira Tabulação para começar a registrar avaliações</p>
              <Button 
                onClick={() => navigate("/tabulacao/nova")}
                className="mt-3"
                style={{ backgroundColor: '#0ea5e9', color: 'white' }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeira Tabulação
              </Button>
            </div>
          </div>
        ) : (
          <>
            {tabulacoes.filter(t => 
              t.nome.toLowerCase().includes(filtro.toLowerCase()) ||
              (t.descricao && t.descricao.toLowerCase().includes(filtro.toLowerCase())) ||
              (t.categoria && t.categoria.toLowerCase().includes(filtro.toLowerCase()))
            ).length === 0 ? (
              <div className="text-center py-8" style={{color: 'var(--color-neutral-500)'}}>
                <p className="text-sm">Nenhuma tabulação encontrada com "{filtro}"</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Descrição</th>
                      <th>Categoria</th>
                      <th>Itens</th>
                      <th className="text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tabulacoes.filter(t => 
                      t.nome.toLowerCase().includes(filtro.toLowerCase()) ||
                      (t.descricao && t.descricao.toLowerCase().includes(filtro.toLowerCase())) ||
                      (t.categoria && t.categoria.toLowerCase().includes(filtro.toLowerCase()))
                    ).map((tab) => (
                      <tr key={tab.id}>
                        <td>
                          <div className="flex items-center gap-2">
                            <BarChart3 size={16} className="color-info-icon flex-shrink-0" />
                            <span className="font-semibold">{tab.nome}</span>
                          </div>
                        </td>
                        <td>
                          <div className="text-sm max-w-xs truncate" style={{color: 'var(--color-neutral-600)'}}>
                            {tab.descricao || '-'}
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-info text-xs">
                            {tab.categoria || 'Padrão'}
                          </span>
                        </td>
                        <td>
                          <span className="font-semibold text-sm">{tab.itens?.length || 0}</span>
                        </td>
                        <td>
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => navigate(`/tabulacao/${tab.id}`)}
                              className="h-9 w-9 p-0"
                              title="Editar Tabulação"
                            >
                              <Edit size={16} />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDeleteTabulacao(tab.id)}
                              className="h-9 w-9 p-0"
                              title="Excluir Tabulação"
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
          </>
        )}
      </div>
    </div>
  )
}
