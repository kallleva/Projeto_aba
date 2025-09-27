import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import ApiService from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, ArrowUp, ArrowDown, Trash2, X } from "lucide-react"

export default function FormularioEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    nome: "",
    categoria: "",
    descricao: "",
    perguntas: [],
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchFormulario = async () => {
      if (!id) return
      setLoading(true)
      try {
        const data = await ApiService.getFormulario(id)
        setFormData(data)
      } catch (err) {
        console.error("Erro ao carregar Protocolo:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchFormulario()
  }, [id])

  const addPergunta = () => {
    setFormData((prev) => ({
      ...prev,
      perguntas: [
        ...prev.perguntas,
        {
          id: Date.now(),
          ordem: prev.perguntas.length + 1,
          texto: "Nova pergunta",
          tipo: "TEXTO",
          obrigatoria: false,
        },
      ],
    }))
  }

  const deletePergunta = (idPergunta) => {
    const novas = formData.perguntas.filter((p) => p.id !== idPergunta)
    setFormData((prev) => ({
      ...prev,
      perguntas: novas.map((p, i) => ({ ...p, ordem: i + 1 })),
    }))
  }

  const movePergunta = (index, direction) => {
    const novas = [...formData.perguntas]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= novas.length) return
    ;[novas[index], novas[targetIndex]] = [novas[targetIndex], novas[index]]
    setFormData((prev) => ({
      ...prev,
      perguntas: novas.map((p, i) => ({ ...p, ordem: i + 1 })),
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = { ...formData, perguntas: formData.perguntas.map(p => ({ ...p, tipo: p.tipo.toUpperCase() })) }
      if (id) {
        await ApiService.updateFormulario(id, payload)
      } else {
        await ApiService.createFormulario(payload)
      }
      alert("Protocolo salvo com sucesso!")
      navigate(-1) // volta para a lista
    } catch (err) {
      console.error("Erro ao salvar Protocolo:", err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-6">Carregando Protocolo...</div>

  return (
    <div className="p-6 bg-white min-h-screen space-y-6">
      {/* Topo: Título + Botão Fechar */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">{id ? "Editar Protocolo" : "Novo Protocolo"}</h2>
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <X className="h-4 w-4 mr-1" />
          Fechar
        </Button>
      </div>

      {/* Nome, Categoria e Descrição */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <div>
          <Label htmlFor="nome">Nome do Protocolo</Label>
          <Input
            id="nome"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            placeholder="Ex: Avaliação Inicial"
            required
          />
        </div>
        <div>
          <Label htmlFor="categoria">Categoria</Label>
          <Select
            value={formData.categoria}
            onValueChange={(value) => setFormData({ ...formData, categoria: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="avaliacao">Avaliação Inicial</SelectItem>
              <SelectItem value="evolucao">Evolução de Sessão</SelectItem>
              <SelectItem value="pei">PEI</SelectItem>
              <SelectItem value="relatorio">Relatório Final</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="descricao">Descrição</Label>
          <Textarea
            id="descricao"
            value={formData.descricao}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            rows={4}
            placeholder="Contextualize o objetivo do Protocolo..."
          />
        </div>
      </div>

      {/* Perguntas */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold">Perguntas</h4>
          <Button type="button" onClick={addPergunta} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Pergunta
          </Button>
        </div>

        <div className="overflow-auto max-h-[60vh] border border-gray-200 rounded-md bg-white">
          <Table className="min-w-[600px] bg-white">
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow>
                <TableHead>Ordem</TableHead>
                <TableHead>Pergunta</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Obrigatória</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formData.perguntas.map((p, index) => (
                <TableRow key={p.id}>
                  <TableCell>{p.ordem}</TableCell>
                  <TableCell>
                    <Input
                      value={p.texto}
                      onChange={(e) => {
                        const novas = [...formData.perguntas]
                        novas[index].texto = e.target.value
                        setFormData({ ...formData, perguntas: novas })
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={p.tipo}
                      onValueChange={(value) => {
                        const novas = [...formData.perguntas]
                        novas[index].tipo = value.toUpperCase()
                        setFormData({ ...formData, perguntas: novas })
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TEXTO">Texto</SelectItem>
                        <SelectItem value="NUMERO">Número</SelectItem>
                        <SelectItem value="BOOLEANO">Sim/Não</SelectItem>
                        <SelectItem value="MULTIPLA">Múltipla Escolha</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={p.obrigatoria}
                      onCheckedChange={(checked) => {
                        const novas = [...formData.perguntas]
                        novas[index].obrigatoria = !!checked
                        setFormData({ ...formData, perguntas: novas })
                      }}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => movePergunta(index, "up")} disabled={index === 0}>
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => movePergunta(index, "down")} disabled={index === formData.perguntas.length - 1}>
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => deletePergunta(p.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Botão Salvar */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Salvando..." : id ? "Atualizar" : "Salvar"}
        </Button>
      </div>
    </div>
  )
}
