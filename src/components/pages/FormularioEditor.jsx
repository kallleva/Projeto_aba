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
import { useToast } from "@/hooks/use-toast"
import { Plus, ArrowUp, ArrowDown, Trash2, X, AlertCircle } from "lucide-react"

export default function FormularioEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
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
        console.log('Formulário carregado:', data)
        setFormData(data)
      } catch (err) {
        console.error("Erro ao carregar formulário:", err)
        toast({
          title: 'Erro',
          description: 'Erro ao carregar formulário: ' + err.message,
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }
    fetchFormulario()
  }, [id, toast])

  const addPergunta = () => {
    setFormData((prev) => {
      // Gerar ID único baseado no timestamp e um número aleatório
      const novoId = Date.now() + Math.floor(Math.random() * 1000)
      const novaPergunta =         {
          //id: novoId,
          ordem: prev.perguntas.length + 1,
          texto: "Nova pergunta",
          tipo: "TEXTO",
          obrigatoria: false,
          formula: null,
          opcoes: []
        }
      
      console.log('Adicionando nova pergunta:', novaPergunta)
      
      return {
        ...prev,
        perguntas: [...prev.perguntas, novaPergunta]
      }
    })
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
      // Validações básicas
      if (!formData.nome || formData.nome.trim() === '') {
        toast({
          title: 'Erro de validação',
          description: 'O nome do formulário é obrigatório',
          variant: 'destructive'
        })
        setSaving(false)
        return
      }

      if (!formData.perguntas || formData.perguntas.length === 0) {
        toast({
          title: 'Erro de validação',
          description: 'Adicione pelo menos uma pergunta ao formulário',
          variant: 'destructive'
        })
        setSaving(false)
        return
      }

      // Validar perguntas do tipo FORMULA
      const perguntasFormula = formData.perguntas.filter(p => p.tipo === 'FORMULA')
      const formulasInvalidas = perguntasFormula.filter(p => !p.formula || p.formula.trim() === '')
      
      if (formulasInvalidas.length > 0) {
        toast({
          title: 'Fórmulas inválidas',
          description: `Perguntas do tipo Fórmula devem ter uma fórmula definida: ${formulasInvalidas.map(p => p.texto).join(', ')}`,
          variant: 'destructive'
        })
        setSaving(false)
        return
      }

      // Validar perguntas do tipo MULTIPLA
      const perguntasMultipla = formData.perguntas.filter(p => p.tipo === 'MULTIPLA')
      const opcoesInvalidas = perguntasMultipla.filter(p => !p.opcoes || p.opcoes.length < 2)
      
      if (opcoesInvalidas.length > 0) {
        toast({
          title: 'Opções inválidas',
          description: `Perguntas de Múltipla Escolha devem ter pelo menos 2 opções: ${opcoesInvalidas.map(p => p.texto).join(', ')}`,
          variant: 'destructive'
        })
        setSaving(false)
        return
      }

      // Validar textos das perguntas
      const perguntasVazias = formData.perguntas.filter(p => !p.texto || p.texto.trim() === '')
      if (perguntasVazias.length > 0) {
        toast({
          title: 'Perguntas inválidas',
          description: 'Todas as perguntas devem ter um texto definido',
          variant: 'destructive'
        })
        setSaving(false)
        return
      }

      // Preparar payload para envio conforme documentação
      const payload = {
        nome: formData.nome.trim(),
        descricao: formData.descricao?.trim() || "",
        categoria: formData.categoria || "avaliacao",
        perguntas: formData.perguntas.map((p, index) => {
          const pergunta = {
            texto: p.texto.trim(),
            tipo: p.tipo.toUpperCase(),
            obrigatoria: p.obrigatoria || false
          }
          
          // Adicionar campos específicos por tipo
          if (p.tipo === 'FORMULA') {
            pergunta.formula = p.formula?.trim() || null
          }
          
          if (p.tipo === 'MULTIPLA') {
            pergunta.opcoes = p.opcoes || []
          }
          
          // Se estiver editando, manter o ID
          if (p.id && !p.id.toString().startsWith('temp_')) {
            pergunta.id = p.id
          }
          
          return pergunta
        })
      }

      console.log('Payload sendo enviado:', payload)

      let resultado
      if (id) {
        resultado = await ApiService.updateFormulario(id, payload)
        toast({
          title: 'Sucesso',
          description: 'Formulário atualizado com sucesso!'
        })
      } else {
        resultado = await ApiService.createFormulario(payload)
        toast({
          title: 'Sucesso',
          description: 'Formulário criado com sucesso!'
        })
      }

      console.log('Resultado da API:', resultado)
      navigate(-1) // volta para a lista
    } catch (err) {
      console.error("Erro ao salvar formulário:", err)
      toast({
        title: 'Erro ao salvar',
        description: 'Erro ao salvar formulário: ' + err.message,
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="p-6 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Carregando formulário...</p>
      </div>
    </div>
  )

  return (
    <div className="p-6 bg-white min-h-screen space-y-6">
      {/* Topo: Título + Botão Fechar */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {id ? "Editar Formulário" : "Novo Formulário"}
          </h2>
          <p className="text-muted-foreground">
            {id ? "Atualize as informações do formulário" : "Crie um novo formulário para checklists diários"}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <X className="h-4 w-4 mr-1" />
          Fechar
        </Button>
      </div>

      {/* Nome, Categoria e Descrição */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <div>
          <Label htmlFor="nome">Nome do Formulário *</Label>
          <Input
            id="nome"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            placeholder="Ex: Avaliação de Coordenação Motora"
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
            placeholder="Descreva o objetivo e contexto deste formulário..."
          />
        </div>
      </div>

      {/* Perguntas */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-semibold">Perguntas do Formulário</h4>
            <p className="text-sm text-muted-foreground">
              {formData.perguntas.length === 0 
                ? "Adicione perguntas para criar o formulário"
                : `${formData.perguntas.length} pergunta${formData.perguntas.length > 1 ? 's' : ''} adicionada${formData.perguntas.length > 1 ? 's' : ''}`
              }
            </p>
          </div>
          <Button type="button" onClick={addPergunta} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Pergunta
          </Button>
        </div>

        {formData.perguntas.length === 0 ? (
          <div className="space-y-6">
            <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center">
              <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma pergunta adicionada</h3>
              <p className="text-gray-500 mb-4">
                Adicione perguntas para criar seu formulário de checklist diário.
              </p>
              <Button onClick={addPergunta} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Primeira Pergunta
              </Button>
            </div>
            
            {/* Guia de tipos de pergunta */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-3">Tipos de Pergunta Disponíveis:</h4>
              <div className="grid gap-2 text-sm">
                <div><strong>TEXTO:</strong> Campo de texto livre para respostas abertas</div>
                <div><strong>NUMERO:</strong> Campo numérico para valores quantitativos</div>
                <div><strong>BOOLEANO:</strong> Pergunta Sim/Não ou Verdadeiro/Falso</div>
                <div><strong>MULTIPLA:</strong> Lista de opções predefinidas para escolha</div>
                <div><strong>FORMULA:</strong> Cálculo automático baseado em outras perguntas</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="overflow-auto max-h-[60vh] border border-gray-200 rounded-md bg-white">
            <Table className="min-w-[600px] bg-white">
              <TableHeader className="sticky top-0 bg-white z-10">
                <TableRow>
                  <TableHead>Ordem</TableHead>
                  <TableHead>Pergunta</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Fórmula/Opções</TableHead>
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
                        // Limpar campos desnecessários ao mudar tipo
                        if (value.toUpperCase() !== 'FORMULA') {
                          novas[index].formula = ''
                        }
                        if (value.toUpperCase() !== 'MULTIPLA') {
                          novas[index].opcoes = []
                        }
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
                        <SelectItem value="FORMULA">Fórmula</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {p.tipo === 'FORMULA' ? (
                      <div className="space-y-2">
                        <Input
                          placeholder="Ex: pergunta_1 + pergunta_2"
                          value={p.formula || ''}
                          onChange={(e) => {
                            const novas = [...formData.perguntas]
                            novas[index].formula = e.target.value
                            setFormData({ ...formData, perguntas: novas })
                          }}
                        />
                        <div className="text-xs text-gray-500 space-y-1">
                          <div>Use pergunta_1, pergunta_2, etc. para referenciar outras perguntas</div>
                          <div className="font-mono text-xs">
                            Exemplos: pergunta_1 + pergunta_2 | (pergunta_1 + pergunta_2) / 2 | pergunta_3 ? 10 : 0
                          </div>
                        </div>
                      </div>
                    ) : p.tipo === 'MULTIPLA' ? (
                      <div className="space-y-2">
                        <Input
                          placeholder="Baixo, Médio, Alto"
                          value={p.opcoes ? p.opcoes.join(', ') : ''}
                          onChange={(e) => {
                            const novas = [...formData.perguntas]
                            novas[index].opcoes = e.target.value.split(',').map(o => o.trim()).filter(o => o)
                            setFormData({ ...formData, perguntas: novas })
                          }}
                        />
                        <div className="text-xs text-gray-500">
                          Separe as opções por vírgula (ex: Sim, Não, Talvez)
                        </div>
                        {p.opcoes && p.opcoes.length > 0 && (
                          <div className="text-xs text-blue-600">
                            Opções: {p.opcoes.map((op, i) => `"${op}"`).join(', ')}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={p.obrigatoria}
                      disabled={p.tipo === 'FORMULA'}
                      onCheckedChange={(checked) => {
                        const novas = [...formData.perguntas]
                        novas[index].obrigatoria = !!checked
                        setFormData({ ...formData, perguntas: novas })
                      }}
                    />
                    {p.tipo === 'FORMULA' && (
                      <div className="text-xs text-gray-500 mt-1">
                        Fórmulas são sempre calculadas
                      </div>
                    )}
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
        )}
      </div>

      {/* Botão Salvar */}
      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          disabled={saving}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSave} 
          disabled={saving || !formData.nome || formData.perguntas.length === 0}
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Salvando...
            </>
          ) : (
            <>
              {id ? "Atualizar Formulário" : "Criar Formulário"}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
