import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2, CheckCircle, Calendar, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import ApiService from "@/lib/api"

export default function MetasTerapeuticasKanban() {
  const [metas, setMetas] = useState([])
  const [planos, setPlanos] = useState([])
  const [formularios, setFormularios] = useState([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingMeta, setEditingMeta] = useState(null)
  const [selectedFormularios, setSelectedFormularios] = useState([])
  const [formData, setFormData] = useState({
    plano_id: "",
    descricao: "",
    data_inicio: "",
    data_previsao_termino: "",
    status: "EmAndamento"
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
        ApiService.getFormularios()
      ])
      setMetas(metasData)
      setPlanos(planosData)
      setFormularios(formulariosData)
    } catch (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" })
    }
  }

  const resetForm = () => {
    setFormData({ plano_id: "", descricao: "", data_inicio: "", data_previsao_termino: "", status: "EmAndamento" })
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
      status: meta.status
    })
    setSelectedFormularios(meta.formularios.map(f => f.id))
    setDialogOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = { ...formData, plano_id: parseInt(formData.plano_id), formularios: selectedFormularios }
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
    const hoje = new Date(), i = new Date(inicio), t = new Date(termino)
    const totalDias = (t - i) / (1000 * 60 * 60 * 24)
    const diasDecorridos = (hoje - i) / (1000 * 60 * 60 * 24)
    if (totalDias <= 0) return 100
    return Math.round(Math.min(100, Math.max(0, (diasDecorridos / totalDias) * 100)))
  }

  const getPlanoInfo = (id) => {
    const plano = planos.find(p => p.id === id)
    return plano ? `${plano.paciente_nome} - ${plano.profissional_nome}` : "Plano não encontrado"
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Metas Terapêuticas</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}><Plus className="mr-2 h-4 w-4"/>Nova Meta</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingMeta ? "Editar Meta" : "Nova Meta"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Plano Terapêutico</Label>
                <Select value={formData.plano_id} onValueChange={v => setFormData({...formData, plano_id: v})} required>
                  <SelectTrigger><SelectValue placeholder="Selecione o plano"/></SelectTrigger>
                  <SelectContent>
                    {planos.map(p => <SelectItem key={p.id} value={p.id.toString()}>{p.paciente_nome} - {p.profissional_nome}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Descrição</Label>
                <Textarea value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})} rows={3} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Data Início</Label>
                  <Input type="date" value={formData.data_inicio} onChange={e => setFormData({...formData,data_inicio:e.target.value})} required/>
                </div>
                <div className="grid gap-2">
                  <Label>Previsão Término</Label>
                  <Input type="date" value={formData.data_previsao_termino} onChange={e => setFormData({...formData,data_previsao_termino:e.target.value})} required/>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={v => setFormData({...formData,status:v})}>
                  <SelectTrigger><SelectValue/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EmAndamento">Em Andamento</SelectItem>
                    <SelectItem value="Concluida">Concluída</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Formulários</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                  {formularios.map(f => {
                    const selected = selectedFormularios.includes(f.id)
                    return (
                      <div key={f.id} onClick={() => {
                        if(selected) setSelectedFormularios(selectedFormularios.filter(id => id !== f.id))
                        else setSelectedFormularios([...selectedFormularios, f.id])
                      }}
                      className={`p-2 border rounded cursor-pointer ${selected ? 'bg-yellow-200 border-yellow-400':'hover:bg-gray-100'}`}>
                        {f.nome}
                      </div>
                    )
                  })}
                </div>
              </div>
              <DialogFooter className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                <Button type="submit">{editingMeta ? "Atualizar" : "Criar"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {['EmAndamento','Concluida'].map(status => (
          <div key={status}>
            <h3 className="text-xl font-bold mb-2">{status === 'EmAndamento' ? 'Em Andamento' : 'Concluídas'}</h3>
            <div className="space-y-2">
              {metas.filter(m => m.status === status).map(meta => (
                <Card key={meta.id} className="border">
                  <CardHeader>
                    <CardTitle>{getPlanoInfo(meta.plano_id)}</CardTitle>
                    <CardDescription>{meta.descricao}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm"><Calendar className="w-4 h-4"/> {meta.data_inicio} - {meta.data_previsao_termino}</div>
                    <Progress value={calcularProgresso(meta.data_inicio, meta.data_previsao_termino)} className="mt-2"/>
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {meta.formularios.map(f => <Badge key={f.id}>{f.nome}</Badge>)}
                    </div>
                    <div className="flex justify-end gap-2 mt-2">
                      {meta.status==='EmAndamento' && <Button size="sm" variant="outline" onClick={() => handleConcluir(meta.id)}><CheckCircle className="w-4 h-4"/></Button>}
                      <Button size="sm" variant="outline" onClick={() => handleEdit(meta)}><Edit className="w-4 h-4"/></Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(meta.id)}><Trash2 className="w-4 h-4"/></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
