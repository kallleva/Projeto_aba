import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Save, X, ArrowLeft, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import ApiService from "@/lib/api"

export default function MetasTerapeuticasEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const [loading, setLoading] = useState(id && id !== 'novo')
  const [saving, setSaving] = useState(false)
  const [planos, setPlanos] = useState([])
  const [formularios, setFormularios] = useState([])
  
  const [selectedFormularios, setSelectedFormularios] = useState([])
  const [objetivos, setObjetivos] = useState([])
  const [formData, setFormData] = useState({
    plano_id: "",
    titulo: "",
    descricao: "",
    data_inicio: "",
    data_previsao_termino: "",
    status: "EmAndamento",
  })

  useEffect(() => {
    loadPlanos()
    loadFormularios()
    if (id && id !== 'novo') {
      loadMeta(id)
    }
  }, [id])

  const loadPlanos = async () => {
    try {
      const data = await ApiService.getPlanosTerapeuticos()
      setPlanos(data)
    } catch (error) {
      toast({ title: "Erro", description: "Erro ao carregar planos", variant: "destructive" })
    }
  }

  const loadFormularios = async () => {
    try {
      const data = await ApiService.getFormularios()
      setFormularios(data)
    } catch (error) {
      toast({ title: "Erro", description: "Erro ao carregar formulários", variant: "destructive" })
    }
  }

  const loadMeta = async (metaId) => {
    try {
      setLoading(true)
      const meta = await ApiService.getMetaTerapeutica(metaId)
      
      setFormData({
        plano_id: meta.plano_id.toString(),
        titulo: meta.titulo,
        descricao: meta.descricao,
        data_inicio: meta.data_inicio,
        data_previsao_termino: meta.data_previsao_termino,
        status: meta.status,
      })
      setSelectedFormularios(meta.formularios.map((f) => f.id))
      setObjetivos(meta.objetivos || [])
    } catch (error) {
      toast({ title: "Erro", description: "Erro ao carregar meta", variant: "destructive" })
      navigate('/metas-terapeuticas')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validações
    if (!formData.titulo.trim()) {
      toast({
        title: "Erro",
        description: "Título é obrigatório",
        variant: "destructive"
      })
      return
    }

    if (!formData.descricao.trim()) {
      toast({
        title: "Erro",
        description: "Descrição é obrigatória",
        variant: "destructive"
      })
      return
    }

    if (!formData.plano_id) {
      toast({
        title: "Erro",
        description: "Plano é obrigatório",
        variant: "destructive"
      })
      return
    }

    try {
      setSaving(true)
      
      // Limpar _tempId dos objetivos antes de enviar
      const objetivosLimpos = objetivos.map(obj => {
        const { _tempId, ...rest } = obj
        return rest
      })
      
      const payload = {
        ...formData,
        plano_id: parseInt(formData.plano_id),
        formularios: selectedFormularios,
        objetivos: objetivosLimpos,
      }

      if (id && id !== 'novo') {
        await ApiService.updateMetaTerapeutica(id, payload)
        toast({ title: "Sucesso", description: "Meta atualizada com sucesso!" })
      } else {
        await ApiService.createMetaTerapeutica(payload)
        toast({ title: "Sucesso", description: "Meta criada com sucesso!" })
      }

      navigate('/metas-terapeuticas')
    } catch (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 mx-auto" style={{borderColor: 'var(--color-info-200)', borderTopColor: '#0ea5e9'}}></div>
          <p className="mt-4 card-text font-medium">Carregando meta...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{backgroundColor: 'var(--color-neutral-50)'}}>
      {/* Header */}
      <div className="sticky top-0 z-10 border-b" style={{backgroundColor: 'white', borderColor: 'var(--color-neutral-200)'}}>
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/metas-terapeuticas')}
              className="h-10 w-10"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="page-title">{id && id !== 'novo' ? 'Editar Meta Terapêutica' : 'Nova Meta Terapêutica'}</h1>
              <p className="page-subtitle">
                {id && id !== 'novo' ? 'Atualize informações e objetivos da meta' : 'Crie uma nova meta terapêutica para o paciente'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate('/metas-terapeuticas')}
              className="h-10 px-4"
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={saving}
              style={{ backgroundColor: '#0ea5e9', color: 'white' }}
              className="h-10 px-4"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Meta
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Seção 1: Informações Básicas */}
          <div className="card-spacing">
            <div className="section-header mb-6">
              <AlertCircle size={20} className="color-info-icon" />
              <h2 className="section-header-title">Informações Básicas</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="grid gap-2">
                <Label>Plano Terapêutico *</Label>
                <Select 
                  value={formData.plano_id} 
                  onValueChange={(v) => setFormData({ ...formData, plano_id: v })} 
                  required
                >
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

              <div className="lg:col-span-2 grid gap-2">
                <Label>Título da Meta *</Label>
                <Input
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  placeholder="Ex: Melhorar coordenação motora fina"
                  required
                  className="h-10"
                />
              </div>

              <div className="lg:col-span-2 grid gap-2">
                <Label>Descrição *</Label>
                <Textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  rows={4}
                  required
                  placeholder="Descreva os detalhes e objetivos gerais da meta"
                />
              </div>

              <div className="grid gap-2">
                <Label>Data Início *</Label>
                <Input
                  type="date"
                  value={formData.data_inicio}
                  onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
                  required
                  className="h-10"
                />
              </div>

              <div className="grid gap-2">
                <Label>Previsão Término *</Label>
                <Input
                  type="date"
                  value={formData.data_previsao_termino}
                  onChange={(e) => setFormData({ ...formData, data_previsao_termino: e.target.value })}
                  required
                  className="h-10"
                />
              </div>
            </div>
          </div>

          {/* Seção 2: Objetivos */}
          <div className="card-spacing">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="section-header-title">Objetivos/Itens</h2>
                <p className="page-subtitle mt-1">Adicione os objetivos específicos para esta meta</p>
              </div>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  const novoObjetivo = {
                    id: null,
                    _tempId: Math.random(),
                    meta_id: id && id !== 'novo' ? parseInt(id) : null,
                    titulo: '',
                    descricao: '',
                    status: 'Pendente',
                    ordem: objetivos.length
                  }
                  setObjetivos([...objetivos, novoObjetivo])
                }}
                style={{ backgroundColor: '#0ea5e9', color: 'white' }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Objetivo
              </Button>
            </div>

            {objetivos.length === 0 ? (
              <div className="alert alert-info">
                <AlertCircle size={18} />
                <div className="alert-content">
                  <p className="font-medium">Nenhum objetivo adicionado</p>
                  <p className="text-sm mt-1">Clique em "Adicionar Objetivo" para começar</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {objetivos.map((obj, idx) => (
                  <div key={`obj-${obj._tempId || obj.id}`} className="border rounded-lg p-4" style={{borderColor: 'var(--color-neutral-300)', backgroundColor: 'var(--color-neutral-50)'}}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="font-semibold" style={{color: 'var(--color-neutral-700)'}}>Objetivo {idx + 1}</div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setObjetivos(objetivos.filter((_, i) => i !== idx))}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="lg:col-span-2 grid gap-2">
                        <Label>Título do Objetivo *</Label>
                        <Input
                          placeholder="Ex: Aumentar força de preensão"
                          value={obj.titulo}
                          onChange={(e) => {
                            const novos = [...objetivos]
                            novos[idx].titulo = e.target.value
                            setObjetivos(novos)
                          }}
                          required
                          className="h-10"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label>Status</Label>
                        <Select 
                          value={obj.status}
                          onValueChange={(v) => {
                            const novos = [...objetivos]
                            novos[idx].status = v
                            setObjetivos(novos)
                          }}
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pendente">Pendente</SelectItem>
                            <SelectItem value="EmAndamento">Em Andamento</SelectItem>
                            <SelectItem value="Concluido">Concluído</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="lg:col-span-3 grid gap-2">
                        <Label>Descrição (opcional)</Label>
                        <Textarea
                          placeholder="Detalhes adicionais sobre este objetivo"
                          value={obj.descricao || ''}
                          onChange={(e) => {
                            const novos = [...objetivos]
                            novos[idx].descricao = e.target.value
                            setObjetivos(novos)
                          }}
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Seção 3: Formulários Relacionados */}
          <div className="card-spacing">
            <div>
              <h2 className="section-header-title mb-6">Formulários Relacionados</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
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
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selected 
                            ? 'bg-gradient-to-br from-blue-100 to-blue-50 border-blue-400 font-semibold' 
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        style={{
                          borderColor: selected ? '#0ea5e9' : 'var(--color-neutral-200)',
                          backgroundColor: selected ? '#dbeafe' : 'white'
                        }}
                      >
                        <div className="text-sm">{f.nome}</div>
                        <div className="text-xs mt-1" style={{color: 'var(--color-neutral-500)'}}>
                          {f.categoria}
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-sm text-gray-500 col-span-full">Nenhum formulário disponível</p>
                )}
              </div>
            </div>
          </div>

          {/* Botões de Ação - Sticky Footer */}
          <div className="sticky bottom-0 border-t" style={{backgroundColor: 'white', borderColor: 'var(--color-neutral-200)'}}>
            <div className="max-w-6xl mx-auto px-4 py-4 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/metas-terapeuticas')}
                className="h-10 px-4"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={saving}
                style={{ backgroundColor: '#0ea5e9', color: 'white' }}
                className="h-10 px-4"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {id && id !== 'novo' ? 'Atualizar Meta' : 'Criar Meta'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
