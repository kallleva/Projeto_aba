import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Edit, Trash2, MessageSquare } from 'lucide-react'

export default function Pergunta({ onSubmit }) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPergunta, setEditingPergunta] = useState(null)
  const [perguntas, setPerguntas] = useState([])
  const [formData, setFormData] = useState({
    texto: '',
    tipo: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.texto || !formData.tipo) return

    if (editingPergunta) {
      // edição
      setPerguntas(perguntas.map(p => p.id === editingPergunta.id ? { ...editingPergunta, ...formData } : p))
    } else {
      // criação
      const novaPergunta = { id: Date.now(), ...formData }
      setPerguntas([...perguntas, novaPergunta])
      onSubmit?.(novaPergunta)
    }
    resetForm()
    setDialogOpen(false)
  }

  const handleEdit = (pergunta) => {
    setEditingPergunta(pergunta)
    setFormData({ texto: pergunta.texto, tipo: pergunta.tipo })
    setDialogOpen(true)
  }

  const handleDelete = (id) => {
    setPerguntas(perguntas.filter(p => p.id !== id))
  }

  const resetForm = () => {
    setFormData({ texto: '', tipo: '' })
    setEditingPergunta(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Perguntas</h2>
          <p className="text-muted-foreground">
            Gerencie as perguntas do formulário
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Pergunta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingPergunta ? 'Editar Pergunta' : 'Nova Pergunta'}
              </DialogTitle>
              <DialogDescription>
                {editingPergunta
                  ? 'Edite os dados da pergunta abaixo.'
                  : 'Preencha os dados da nova pergunta abaixo.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="texto">Texto da Pergunta</Label>
                  <Input
                    id="texto"
                    value={formData.texto}
                    onChange={(e) => setFormData({ ...formData, texto: e.target.value })}
                    placeholder="Digite a pergunta..."
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tipo">Tipo da Pergunta</Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(value) => setFormData({ ...formData, tipo: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TEXTO">Texto</SelectItem>
                      <SelectItem value="NUMERO">Número</SelectItem>
                      <SelectItem value="BOOLEANO">Sim/Não</SelectItem>
                      <SelectItem value="MULTIPLA">Múltipla escolha</SelectItem>
                      <SelectItem value="FORMULA">Fórmula</SelectItem>
                      <SelectItem value="PERCENTUAL">Percentual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingPergunta ? 'Atualizar' : 'Adicionar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Perguntas</CardTitle>
          <CardDescription>
            Visualize e gerencie as perguntas cadastradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {perguntas.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma pergunta cadastrada ainda.
            </div>
          ) : (
            <ul className="divide-y">
              {perguntas.map((pergunta) => (
                <li key={pergunta.id} className="flex justify-between items-center py-3">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{pergunta.texto}</p>
                      <p className="text-sm text-muted-foreground">Tipo: {pergunta.tipo}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(pergunta)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(pergunta.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
