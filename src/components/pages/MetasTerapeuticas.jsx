import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Plus, Edit, Trash2, CheckCircle, Calendar, AlertCircle, Target, HelpCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import ApiService from "@/lib/api"
import MetasTerapeuticasAjuda from "./MetasTerapeuticasAjuda"

export default function MetasTerapeuticasKanban() {
  const navigate = useNavigate()
  const [metas, setMetas] = useState([])
  const [planos, setPlanos] = useState([])

  // Controle da ajuda
  const [ajudaOpen, setAjudaOpen] = useState(false)

  // Filtros
  const [search, setSearch] = useState("")
  const [planoFiltro, setPlanoFiltro] = useState("all")
  const [statusFiltro, setStatusFiltro] = useState("all")

  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [metasData, planosData] = await Promise.all([
        ApiService.getMetasTerapeuticas(),
        ApiService.getPlanosTerapeuticos(),
      ])
      setMetas(metasData)
      setPlanos(planosData)
    } catch (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" })
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja realmente excluir esta meta?")) return
    try {
      await ApiService.deleteMetaTerapeutica(id)
      toast({ title: "Sucesso", description: "Meta excluída!" })
      loadData()
    } catch (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" })
    }
  }

  const handleConcluir = async (id) => {
    try {
      await ApiService.concluirMeta(id)
      toast({ title: "Sucesso", description: "Meta concluída!" })
      loadData()
    } catch (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" })
    }
  }

  const calcularProgresso = (meta) => {
    // Calcula baseado em objetivos concluídos
    if (!meta.objetivos || meta.objetivos.length === 0) return 0
    const concluidos = meta.objetivos.filter(obj => obj.status === 'Concluido').length
    return Math.round((concluidos / meta.objetivos.length) * 100)
  }

  const getPlanoInfo = (id) => {
    const plano = planos.find((p) => p.id === id)
    return plano ? `${plano.paciente_nome} - ${plano.profissional_nome}` : "Plano não encontrado"
  }

  // Filtragem
  const metasFiltradas = metas.filter((m) => {
    const planoInfo = getPlanoInfo(m.plano_id).toLowerCase()
    const descricao = m.descricao.toLowerCase()
    const filtroTexto = search.toLowerCase()
    const filtroPlano = planoFiltro === "all" ? true : m.plano_id.toString() === planoFiltro
    const filtroStatus = statusFiltro === "all" ? true : m.status === statusFiltro
    return (planoInfo.includes(filtroTexto) || descricao.includes(filtroTexto)) && filtroPlano && filtroStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-section">
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <div>
            <h1 className="page-title">Metas Terapêuticas</h1>
            <p className="page-subtitle">Planeje e acompanhe os objetivos terapêuticos dos pacientes</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => setAjudaOpen(true)}
              variant="outline"
              size="icon"
              title="Abrir guia de ajuda"
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
            <Button 
              onClick={() => navigate('/metas-terapeuticas/edit/novo')}
              style={{ backgroundColor: '#0ea5e9', color: 'white' }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova Meta
            </Button>
          </div>
        </div>
      </div>

      <MetasTerapeuticasAjuda open={ajudaOpen} onOpenChange={setAjudaOpen} />

      {/* Filtros */}
      <div className="card-spacing">
        <div className="section-header mb-4">
          <Target size={18} className="color-info-icon" />
          <h2 className="section-header-title">Filtros</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-xs font-semibold mb-2 block">Buscar</Label>
            <Input 
              placeholder="Buscar por plano ou descrição..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
            />
          </div>

          <div>
            <Label className="text-xs font-semibold mb-2 block">Filtrar por Plano</Label>
            <Select value={planoFiltro} onValueChange={setPlanoFiltro}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os planos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os planos</SelectItem>
                {planos.map((p) => (
                  <SelectItem key={p.id} value={p.id.toString()}>
                    {p.paciente_nome} - {p.profissional_nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs font-semibold mb-2 block">Filtrar por Status</Label>
            <Select value={statusFiltro} onValueChange={setStatusFiltro}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="EmAndamento">Em Andamento</SelectItem>
                <SelectItem value="Concluida">Concluída</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      {metasFiltradas.length === 0 ? (
        <div className="alert alert-info">
          <AlertCircle size={18} />
          <div className="alert-content">
            <p className="font-medium">Nenhuma meta encontrada</p>
            <p className="text-sm mt-1">Tente ajustar seus filtros ou crie uma nova meta</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {["EmAndamento", "Concluida"].map((status) => (
            <div key={status}>
              <div className="mb-4">
                <h2 className="section-header-title flex items-center gap-2">
                  {status === "EmAndamento" ? (
                    <>
                      <div className="w-3 h-3 rounded-full" style={{backgroundColor: 'var(--color-warning-500)'}}></div>
                      Em Andamento
                    </>
                  ) : (
                    <>
                      <div className="w-3 h-3 rounded-full" style={{backgroundColor: 'var(--color-success-500)'}}></div>
                      Concluídas
                    </>
                  )}
                </h2>
              </div>
              <div className="space-y-3">
                {metasFiltradas
                  .filter((m) => m.status === status)
                  .map((meta) => (
                    <div 
                      key={meta.id} 
                      className="card-spacing border-l-4 transition-all hover:shadow-md"
                      style={{borderLeftColor: status === "EmAndamento" ? 'var(--color-warning-500)' : 'var(--color-success-500)'}}
                    >
                      <div className="mb-3">
                        <h3 className="font-semibold" style={{color: 'var(--color-neutral-900)'}}>
                          {meta.titulo}
                        </h3>
                        <p className="text-xs mb-1" style={{color: 'var(--color-neutral-600)'}}>
                          {getPlanoInfo(meta.plano_id)}
                        </p>
                        <p className="text-sm mt-1" style={{color: 'var(--color-neutral-700)'}}>
                          {meta.descricao}
                        </p>
                      </div>

                      {/* Datas */}
                      <div className="flex items-center gap-2 text-xs mb-3" style={{color: 'var(--color-neutral-600)'}}>
                        <Calendar size={14} />
                        <span>{meta.data_inicio}</span>
                        <span>→</span>
                        <span>{meta.data_previsao_termino}</span>
                      </div>

                      {/* Barra de Progresso baseada em Objetivos */}
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-medium" style={{color: 'var(--color-neutral-600)'}}>
                            Objetivos: {meta.objetivos?.filter(o => o.status === 'Concluido').length || 0}/{meta.objetivos?.length || 0}
                          </span>
                          <span className="text-xs font-bold" style={{color: 'var(--color-info-600)'}}>
                            {calcularProgresso(meta)}%
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-bar-fill"
                            style={{
                              width: `${calcularProgresso(meta)}%`,
                              backgroundColor: status === "EmAndamento" ? 'var(--color-warning-500)' : 'var(--color-success-500)'
                            }}
                          />
                        </div>
                      </div>

                      {/* Lista de Objetivos */}
                      {meta.objetivos && meta.objetivos.length > 0 && (
                        <div className="mb-3 bg-gray-50 rounded-lg p-2">
                          <p className="text-xs font-semibold mb-2" style={{color: 'var(--color-neutral-700)'}}>Objetivos:</p>
                          <div className="space-y-1 max-h-24 overflow-y-auto">
                            {meta.objetivos.map((obj) => (
                              <div key={obj.id} className="text-xs p-1 rounded" style={{
                                backgroundColor: obj.status === 'Concluido' ? 'var(--color-success-100)' : obj.status === 'EmAndamento' ? 'var(--color-warning-100)' : 'var(--color-neutral-100)',
                                color: obj.status === 'Concluido' ? 'var(--color-success-700)' : obj.status === 'EmAndamento' ? 'var(--color-warning-700)' : 'var(--color-neutral-700)'
                              }}>
                                <span style={{textDecoration: obj.status === 'Concluido' ? 'line-through' : 'none'}}>
                                  {obj.titulo}
                                </span>
                                <span className="text-xs ml-1">({obj.status})</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Badges de Formulários */}
                      {meta.formularios.length > 0 && (
                        <div className="flex gap-1 flex-wrap mb-3">
                          {meta.formularios.map((f) => (
                            <span key={f.id} className="badge badge-sm badge-info">
                              {f.nome}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Botões de Ação */}
                      <div className="flex justify-end gap-2 pt-3 border-t" style={{borderTopColor: 'var(--color-neutral-200)'}}>
                        {meta.status === "EmAndamento" && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleConcluir(meta.id)}
                            className="h-8 px-3"
                            title="Marcar como concluída"
                          >
                            <CheckCircle size={16} className="mr-1" />
                            Concluir
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => navigate(`/metas-terapeuticas/edit/${meta.id}`)}
                          className="h-8 w-8 p-0"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDelete(meta.id)}
                          className="h-8 w-8 p-0"
                          title="Deletar"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
