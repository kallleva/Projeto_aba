import { useEffect, useState } from 'react'
import ApiService from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Edit, Trash2, FileText, ArrowUp, ArrowDown } from 'lucide-react'

export default function Formularios() {
  const [formularios, setFormularios] = useState([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingFormulario, setEditingFormulario] = useState(null)

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    categoria: 'avaliacao',
    perguntas: []
  })

  // ==== Load inicial ====
  useEffect(() => {
    fetchFormularios()
  }, [])

  const fetchFormularios = async () => {
    try {
      const data = await ApiService.getFormularios()
      setFormularios(data)
    } catch (err) {
      console.error('Erro ao buscar formulários:', err)
    }
  }

  // ==== CRUD Formulário ====
  const handleSaveFormulario = async (e) => {
    e.preventDefault()
    if (!formData.nome) return

    // Garantir que os tipos das perguntas estejam em maiúsculo e compatíveis
    const payload = {
      ...formData,
      perguntas: formData.perguntas.map(p => ({
        ...p,
        tipo: p.tipo.toUpperCase() // TEXTO, NUMERO, BOOLEANO, MULTIPLA
      }))
    }

    try {
      if (editingFormulario) {
        const updated = await ApiService.updateFormulario(editingFormulario.id, payload)
        setFormularios(formularios.map(f => f.id === updated.id ? updated : f))
      } else {
        const created = await ApiService.createFormulario(payload)
        setFormularios([...formularios, created])
      }
      resetForm()
      setDialogOpen(false)
    } catch (err) {
      console.error('Erro ao salvar formulário:', err)
    }
  }

  const handleEditFormulario = (formulario) => {
    setEditingFormulario(formulario)
    setFormData({
      nome: formulario.nome,
      descricao: formulario.descricao || '',
      categoria: formulario.categoria,
      perguntas: formulario.perguntas || []
    })
    setDialogOpen(true)
  }

  const handleDeleteFormulario = async (id) => {
    try {
      await ApiService.deleteFormulario(id)
      setFormularios(formularios.filter(f => f.id !== id))
    } catch (err) {
      console.error('Erro ao deletar formulário:', err)
    }
  }

  const resetForm = () => {
    setFormData({ nome: '', descricao: '', categoria: 'avaliacao', perguntas: [] })
    setEditingFormulario(null)
  }

  // ==== CRUD Perguntas ====
  const addPergunta = () => {
    const novaPergunta = {
      id: Date.now(),
      ordem: formData.perguntas.length + 1,
      texto: 'Nova pergunta',
      tipo: 'TEXTO',
      obrigatoria: false
    }
    setFormData(prev => ({ ...prev, perguntas: [...prev.perguntas, novaPergunta] }))
  }

  const deletePergunta = (id) => {
    const novas = formData.perguntas.filter(p => p.id !== id)
    setFormData(prev => ({ ...prev, perguntas: novas.map((p, i) => ({ ...p, ordem: i + 1 })) }))
  }

  const movePergunta = (index, direction) => {
    const novas = [...formData.perguntas]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= novas.length) return
    ;[novas[index], novas[targetIndex]] = [novas[targetIndex], novas[index]]
    setFormData(prev => ({ ...prev, perguntas: novas.map((p, i) => ({ ...p, ordem: i + 1 })) }))
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Formulários</h2>
          <p className="text-muted-foreground">
            Cadastre modelos de formulários apenas com perguntas estruturadas.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Formulário
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[900px]">
            <DialogHeader>
              <DialogTitle>{editingFormulario ? 'Editar Formulário' : 'Novo Formulário'}</DialogTitle>
              <DialogDescription>Defina os metadados do formulário e organize suas perguntas.</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSaveFormulario} className="space-y-6">
              {/* Nome e Categoria */}
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <div>
                  <Label htmlFor="nome">Nome do Formulário</Label>
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

                {/* Descrição */}
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="descricao">Descrição</Label>
                    <span className="text-xs text-muted-foreground">{formData.descricao.length}/400</span>
                  </div>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value.slice(0, 400) })}
                    rows={4}
                    placeholder="Contextualize o objetivo do formulário..."
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

                {formData.perguntas.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">Nenhuma pergunta adicionada ainda.</div>
                ) : (
                  <Table>
                    <TableHeader>
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
                                <SelectItem value="TEXTO">Texto Livre</SelectItem>
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
                              <Button type="button" variant="outline" size="sm" onClick={() => movePergunta(index, 'up')} disabled={index === 0}>
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                              <Button type="button" variant="outline" size="sm" onClick={() => movePergunta(index, 'down')} disabled={index === formData.perguntas.length - 1}>
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
                )}
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                <Button type="submit">{editingFormulario ? 'Atualizar' : 'Salvar'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Formulários */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Formulários</CardTitle>
          <CardDescription>Visualize e gerencie os modelos criados</CardDescription>
        </CardHeader>
        <CardContent>
          {formularios.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Nenhum formulário criado ainda.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Perguntas</TableHead>
                  <TableHead>Última atualização</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formularios.map((form) => (
                  <TableRow key={form.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{form.nome}</span>
                      </div>
                    </TableCell>
                    <TableCell>{form.categoria}</TableCell>
                    <TableCell><div className="max-w-xs truncate" title={form.descricao}>{form.descricao || '-'}</div></TableCell>
                    <TableCell>{form.perguntas.length}</TableCell>
                    <TableCell>{form.atualizadoEm ? new Date(form.atualizadoEm).toLocaleDateString('pt-BR') : '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditFormulario(form)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteFormulario(form.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
