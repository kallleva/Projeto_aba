import { useEffect, useState } from "react"
import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Save, AlertCircle, Plus, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import ApiService from "@/lib/api"

// Componente de card da meta reutilizável
function MetaCard({ meta, onEdit, onDelete }) {
  const progresso = meta.objetivos && meta.objetivos.length > 0
    ? Math.round((meta.objetivos.filter(o => o.status === 'Concluido').length / meta.objetivos.length) * 100)
    : 0

  return (
    <div 
      className="card-spacing border-l-4 transition-all hover:shadow-md"
      style={{borderLeftColor: meta.status === "EmAndamento" ? 'var(--color-warning-500)' : 'var(--color-success-500)'}}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold" style={{color: 'var(--color-neutral-900)'}}>
            {meta.titulo}
          </h3>
          <p className="text-sm mt-1" style={{color: 'var(--color-neutral-700)'}}>
            {meta.descricao}
          </p>
        </div>
        <div className="flex gap-2 ml-4 flex-shrink-0">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onEdit(meta.id)}
            className="h-8 w-8 p-0"
            title="Editar"
          >
            <Edit size={16} />
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onDelete(meta.id)}
            className="h-8 w-8 p-0"
            title="Deletar"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      {/* Progresso */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium" style={{color: 'var(--color-neutral-600)'}}>
            {meta.status === "EmAndamento" ? "Em Andamento" : "Concluída"}
          </span>
          <span className="text-xs font-bold" style={{color: 'var(--color-info-600)'}}>
            {progresso}% de objetivos
          </span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-bar-fill"
            style={{
              width: `${progresso}%`,
              backgroundColor: meta.status === "EmAndamento" ? 'var(--color-warning-500)' : 'var(--color-success-500)'
            }}
          />
        </div>
      </div>

      {/* Datas */}
      <div className="flex items-center gap-4 text-xs flex-wrap" style={{color: 'var(--color-neutral-600)'}}>
        <span>Início: {meta.data_inicio || '-'}</span>
        <span>Término: {meta.data_previsao_termino || '-'}</span>
      </div>
    </div>
  )
}

export default function PlanosTerapeuticosEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { toast } = useToast()
  
  const [loading, setLoading] = useState(id && id !== 'novo')
  const [saving, setSaving] = useState(false)
  const [pacientes, setPacientes] = useState([])
  const [profissionais, setProfissionais] = useState([])
  const [metas, setMetas] = useState([])
  const [activeTabMetas, setActiveTabMetas] = useState("ativas") // "ativas" | "concluidas"
  
  const [formData, setFormData] = useState({
    paciente_id: "",
    profissional_id: "",
    objetivo_geral: "",
    data_criacao: "",
  })

  useEffect(() => {
    loadData()
    if (id && id !== 'novo') {
      loadPlano(id)
    }
  }, [id])

  const loadData = async () => {
    try {
      const [pacientesData, profissionaisData] = await Promise.all([
        ApiService.getPacientes(),
        ApiService.getProfissionais(),
      ])
      setPacientes(pacientesData)
      setProfissionais(profissionaisData)
    } catch (error) {
      toast({ title: "Erro", description: "Erro ao carregar dados", variant: "destructive" })
    }
  }

  const loadPlano = async (planoId) => {
    try {
      setLoading(true)
      const plano = await ApiService.getPlanoTerapeutico(planoId)
      
      setFormData({
        paciente_id: plano.paciente_id.toString(),
        profissional_id: plano.profissional_id.toString(),
        objetivo_geral: plano.objetivo_geral,
        data_criacao: plano.data_criacao,
      })
      
      // Carregar metas vinculadas ao plano
      const metasData = await ApiService.getMetasTerapeuticas()
      const metasFiltered = metasData.filter(m => m.plano_id.toString() === planoId)
      setMetas(metasFiltered)
    } catch (error) {
      toast({ title: "Erro", description: "Erro ao carregar plano", variant: "destructive" })
      navigate('/planos-terapeuticos')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validações
    if (!formData.paciente_id) {
      toast({
        title: "Erro",
        description: "Paciente é obrigatório",
        variant: "destructive"
      })
      return
    }

    if (!formData.profissional_id) {
      toast({
        title: "Erro",
        description: "Profissional é obrigatório",
        variant: "destructive"
      })
      return
    }

    if (!formData.objetivo_geral.trim()) {
      toast({
        title: "Erro",
        description: "Objetivo geral é obrigatório",
        variant: "destructive"
      })
      return
    }

    try {
      setSaving(true)
      
      const payload = {
        ...formData,
        paciente_id: parseInt(formData.paciente_id),
        profissional_id: parseInt(formData.profissional_id),
      }

      if (id && id !== 'novo') {
        await ApiService.updatePlanoTerapeutico(id, payload)
        toast({ title: "Sucesso", description: "Plano atualizado com sucesso!" })
      } else {
        await ApiService.createPlanoTerapeutico(payload)
        toast({ title: "Sucesso", description: "Plano criado com sucesso!" })
      }

      navigate('/planos-terapeuticos')
    } catch (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const handleAddMeta = () => {
    navigate(`/metas-terapeuticas/edit/novo?planoId=${id}`)
  }

  const handleEditMeta = (metaId) => {
    navigate(`/metas-terapeuticas/edit/${metaId}`)
  }

  const handleDeleteMeta = async (metaId) => {
    if (!window.confirm("Deseja realmente excluir esta meta?")) return
    try {
      await ApiService.deleteMetaTerapeutica(metaId)
      toast({ title: "Sucesso", description: "Meta excluída!" })
      // Recarregar metas
      if (id && id !== 'novo') {
        loadPlano(id)
      }
    } catch (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" })
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 mx-auto" style={{borderColor: 'var(--color-info-200)', borderTopColor: 'var(--color-info-500)'}}></div>
          <p className="mt-4 card-text font-medium">Carregando plano...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-section">
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <div>
            <h1 className="page-title">{id && id !== 'novo' ? 'Editar Plano Terapêutico' : 'Novo Plano Terapêutico'}</h1>
            <p className="page-subtitle">
              {id && id !== 'novo' ? 'Gerencie informações e metas do plano' : 'Crie um novo plano terapêutico para o paciente'}
            </p>
          </div>
        </div>
      </div>

      {/* Informações Básicas */}
      <div className="card-spacing">
        <div className="section-header mb-6">
          <AlertCircle size={18} className="color-info-icon" />
          <h2 className="section-header-title">Informações do Plano Terapêutico</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="grid gap-2">
            <Label>Paciente *</Label>
            <Select 
              value={formData.paciente_id} 
              onValueChange={(v) => setFormData({ ...formData, paciente_id: v })} 
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Selecione o paciente" />
              </SelectTrigger>
              <SelectContent>
                {pacientes.map((p) => (
                  <SelectItem key={p.id} value={p.id.toString()}>
                    {p.nome} - {p.diagnostico}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Profissional *</Label>
            <Select 
              value={formData.profissional_id} 
              onValueChange={(v) => setFormData({ ...formData, profissional_id: v })} 
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Selecione o profissional" />
              </SelectTrigger>
              <SelectContent>
                {profissionais.map((p) => (
                  <SelectItem key={p.id} value={p.id.toString()}>
                    {p.nome} - {p.especialidade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="lg:col-span-2 grid gap-2">
            <Label>Objetivo Geral *</Label>
            <Textarea
              value={formData.objetivo_geral}
              onChange={(e) => setFormData({ ...formData, objetivo_geral: e.target.value })}
              rows={4}
              placeholder="Descreva o objetivo geral do plano terapêutico"
              className="resize-none"
            />
          </div>

          <div className="grid gap-2">
            <Label>Data de Criação</Label>
            <Input
              type="date"
              value={formData.data_criacao}
              onChange={(e) => setFormData({ ...formData, data_criacao: e.target.value })}
              className="h-10"
            />
          </div>
        </div>
      </div>

      {/* Metas - Aparecem apenas ao editar */}
      {id && id !== 'novo' && (
        <div className="card-spacing">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="section-header-title">Metas Terapêuticas do Plano</h2>
              <p className="page-subtitle mt-1">Gerencie as metas e seus objetivos</p>
            </div>
            <Button
              onClick={handleAddMeta}
              style={{ backgroundColor: '#0ea5e9', color: 'white' }}
              className="h-10 px-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Meta
            </Button>
          </div>

          {/* Abas de Metas */}
          <div className="flex gap-0 border-b mb-6" style={{borderColor: 'var(--color-neutral-200)'}}>
            <button
              onClick={() => setActiveTabMetas("ativas")}
              className={`px-6 py-3 font-medium transition-all border-b-2 text-sm ${
                activeTabMetas === "ativas"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-neutral-600 hover:text-neutral-900"
              }`}
            >
              Metas Ativas ({metas.filter(m => m.status === "EmAndamento").length})
            </button>
            <button
              onClick={() => setActiveTabMetas("concluidas")}
              className={`px-6 py-3 font-medium transition-all border-b-2 text-sm ${
                activeTabMetas === "concluidas"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-neutral-600 hover:text-neutral-900"
              }`}
            >
              Metas Concluídas ({metas.filter(m => m.status === "Concluida").length})
            </button>
          </div>

          {/* Conteúdo das Abas */}
          {activeTabMetas === "ativas" && (
            <>
              {metas.filter(m => m.status === "EmAndamento").length === 0 ? (
                <div className="alert alert-info">
                  <AlertCircle size={18} />
                  <div className="alert-content">
                    <p className="font-medium">Nenhuma meta em andamento</p>
                    <p className="text-sm mt-1">Clique em "Adicionar Meta" para criar uma nova meta para este plano</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {metas.filter(m => m.status === "EmAndamento").map((meta) => (
                    <MetaCard 
                      key={meta.id} 
                      meta={meta} 
                      onEdit={handleEditMeta} 
                      onDelete={handleDeleteMeta} 
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {activeTabMetas === "concluidas" && (
            <>
              {metas.filter(m => m.status === "Concluida").length === 0 ? (
                <div className="alert alert-info">
                  <AlertCircle size={18} />
                  <div className="alert-content">
                    <p className="font-medium">Nenhuma meta concluída</p>
                    <p className="text-sm mt-1">As metas concluídas aparecerão aqui</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {metas.filter(m => m.status === "Concluida").map((meta) => (
                    <MetaCard 
                      key={meta.id} 
                      meta={meta} 
                      onEdit={handleEditMeta} 
                      onDelete={handleDeleteMeta} 
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Botões de Ação */}
      <div className="card-spacing flex justify-end gap-3">
        <Button 
          onClick={() => navigate('/planos-terapeuticos')}
          variant="outline"
          disabled={saving}
          className="h-10 font-medium"
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={saving}
          style={{ backgroundColor: '#0ea5e9', color: 'white' }}
          className="h-10 font-medium flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Salvando...' : 'Salvar Plano'}
        </Button>
      </div>
    </div>
  )
}
