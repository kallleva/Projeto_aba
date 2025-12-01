import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2, CheckCircle, Calendar, AlertCircle, Target, HelpCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import ApiService from "@/lib/api"
import MetasTerapeuticasAjuda from "./MetasTerapeuticasAjuda"

export default function MetasTerapeuticasKanban() {
  const [metas, setMetas] = useState([])
  const [planos, setPlanos] = useState([])
  const [formularios, setFormularios] = useState([])

  // Controle do modal
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingMeta, setEditingMeta] = useState(null)
  const [ajudaOpen, setAjudaOpen] = useState(false)

  // Filtros
  const [search, setSearch] = useState("")
  const [planoFiltro, setPlanoFiltro] = useState("all")
  const [statusFiltro, setStatusFiltro] = useState("all")

  const [selectedFormularios, setSelectedFormularios] = useState([])
  const [formData, setFormData] = useState({
    plano_id: "",
    descricao: "",
    data_inicio: "",
    data_previsao_termino: "",
    status: "EmAndamento",
  })

  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [metasData, planosData, formulariosData] = await Promise.all([
        ApiService.getMetasTerapeuticas(),
        ApiService.getPlanosTerapeuticos(),
        ApiService.getFormularios(),
      ])
      setMetas(metasData)
      setPlanos(planosData)
      setFormularios(formulariosData)
    } catch (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" })
    }
  }

  const resetForm = () => {
    setFormData({
      plano_id: "",
      descricao: "",
      data_inicio: "",
      data_previsao_termino: "",
      status: "EmAndamento",
    })
    setSelectedFormularios([])
    setEditingMeta(null)
  }

  const handleEdit = (meta) => {
    setEditingMeta(meta)
    setFormData({
      plano_id: meta.plano_id.toString(),
      descricao: meta.descricao,
      data_inicio: meta.data_inicio,
      data_previsao_termino: meta.data_previsao_termino,
      status: meta.status,
    })
    setSelectedFormularios(meta.formularios.map((f) => f.id))
    setDialogOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...formData,
        plano_id: parseInt(formData.plano_id),
        formularios: selectedFormularios,
      }
      if (editingMeta) {
        await ApiService.updateMetaTerapeutica(editingMeta.id, payload)
        toast({ title: "Sucesso", description: "Meta atualizada com sucesso!" })
      } else {
        await ApiService.createMetaTerapeutica(payload)
        toast({ title: "Sucesso", description: "Meta criada com sucesso!" })
      }
      setDialogOpen(false)
      resetForm()
      loadData()
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

  const calcularProgresso = (inicio, termino) => {
    if (!inicio || !termino) return 0
    const hoje = new Date(),
      i = new Date(inicio),
      t = new Date(termino)
    const totalDias = (t - i) / (1000 * 60 * 60 * 24)
    const diasDecorridos = (hoje - i) / (1000 * 60 * 60 * 24)
    if (totalDias <= 0) return 100
    return Math.round(Math.min(100, Math.max(0, (diasDecorridos / totalDias) * 100)))
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
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={resetForm}
                  style={{ backgroundColor: '#0ea5e9', color: 'white' }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Meta
                </Button>
              </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{editingMeta ? "Editar Meta Terapêutica" : "Criar Nova Meta Terapêutica"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Plano Terapêutico</Label>
                  <Select value={formData.plano_id} onValueChange={(v) => setFormData({ ...formData, plano_id: v })} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o plano" />
                    </SelectTrigger>
                    <SelectContent>
                      {planos.map((p) => (
                        <SelectItem key={p.id} value={p.id.toString()}>
                          {p.paciente_nome} - {p.profissional_nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Descrição</Label>
                  <Textarea
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    rows={3}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Data Início</Label>
                    <Input
                      type="date"
                      value={formData.data_inicio}
                      onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Previsão Término</Label>
                    <Input
                      type="date"
                      value={formData.data_previsao_termino}
                      onChange={(e) => setFormData({ ...formData, data_previsao_termino: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EmAndamento">Em Andamento</SelectItem>
                      <SelectItem value="Concluida">Concluída</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Formulários Relacionados</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto border rounded-lg p-3" style={{backgroundColor: 'var(--color-neutral-50)', borderColor: 'var(--color-neutral-200)'}}>
                    {formularios.length > 0 ? (
                      formularios.map((f) => {
                        const selected = selectedFormularios.includes(f.id)
                        return (
                          <div
                            key={f.id}
                            onClick={() => {
                              if (selected) setSelectedFormularios(selectedFormularios.filter((id) => id !== f.id))
                              else setSelectedFormularios([...selectedFormularios, f.id])
                            }}
                            className={`p-3 border rounded-lg cursor-pointer transition-all ${
                              selected 
                                ? 'bg-gradient-to-br from-blue-100 to-blue-50 border-blue-400 font-semibold' 
                                : 'hover:bg-gray-100 border-gray-200'
                            }`}
                          >
                            {f.nome}
                          </div>
                        )
                      })
                    ) : (
                      <p className="text-sm text-gray-500 col-span-full">Nenhum formulário disponível</p>
                    )}
                  </div>
                </div>
                <DialogFooter className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    type="submit"
                    style={{ backgroundColor: '#0ea5e9', color: 'white' }}
                  >
                    {editingMeta ? "Atualizar Meta" : "Criar Meta"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
            </Dialog>
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
                          {getPlanoInfo(meta.plano_id)}
                        </h3>
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

                      {/* Barra de Progresso */}
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-medium" style={{color: 'var(--color-neutral-600)'}}>Progresso</span>
                          <span className="text-xs font-bold" style={{color: 'var(--color-info-600)'}}>
                            {calcularProgresso(meta.data_inicio, meta.data_previsao_termino)}%
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-bar-fill"
                            style={{
                              width: `${calcularProgresso(meta.data_inicio, meta.data_previsao_termino)}%`,
                              backgroundColor: status === "EmAndamento" ? 'var(--color-warning-500)' : 'var(--color-success-500)'
                            }}
                          />
                        </div>
                      </div>

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
                          onClick={() => handleEdit(meta)}
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
