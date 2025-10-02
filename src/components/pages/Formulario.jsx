import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ApiService from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Plus, Edit, Trash2, FileText, Clock } from 'lucide-react'

export default function Formularios() {
  const [formularios, setFormularios] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    fetchFormularios()
  }, [])

  const fetchFormularios = async () => {
    try {
      setLoading(true)
      const data = await ApiService.getFormularios()
      setFormularios(data)
    } catch (err) {
      console.error('Erro ao buscar formulários:', err)
      toast({
        title: 'Erro',
        description: 'Erro ao carregar formulários: ' + err.message,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteFormulario = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este formulário?')) return
    
    try {
      await ApiService.deleteFormulario(id)
      setFormularios(formularios.filter(f => f.id !== id))
      toast({
        title: 'Sucesso',
        description: 'Formulário excluído com sucesso!'
      })
    } catch (err) {
      console.error('Erro ao deletar formulário:', err)
      toast({
        title: 'Erro',
        description: 'Erro ao excluir formulário: ' + err.message,
        variant: 'destructive'
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Formulários</h2>
          <p className="text-muted-foreground">
            Cadastre modelos de formulários com perguntas estruturadas para checklists diários.
          </p>
        </div>
        <Button onClick={() => navigate("/protocolo/novo")}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Formulário
        </Button>
      </div>

      {/* Lista de Formulários */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Formulários</CardTitle>
          <CardDescription>Visualize e gerencie os formulários criados para checklists diários</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Carregando formulários...</p>
            </div>
          ) : formularios.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum formulário criado ainda.</p>
              <Button 
                onClick={() => navigate("/protocolo/novo")}
                className="mt-4"
              >
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeiro Formulário
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Perguntas</TableHead>
                  <TableHead>Tipos de Pergunta</TableHead>
                  <TableHead>Última atualização</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formularios.map((form) => {
                  const tiposPerguntas = form.perguntas ? [...new Set(form.perguntas.map(p => p.tipo))] : []
                  const temFormula = tiposPerguntas.includes('FORMULA')
                  
                  return (
                    <TableRow key={form.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{form.nome}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {form.categoria || 'Sem categoria'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate" title={form.descricao}>
                          {form.descricao || '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{form.perguntas?.length || 0}</span>
                          {temFormula && (
                            <Badge variant="secondary" className="text-xs">
                              Com Fórmulas
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {tiposPerguntas.slice(0, 3).map(tipo => (
                            <Badge key={tipo} variant="outline" className="text-xs">
                              {tipo}
                            </Badge>
                          ))}
                          {tiposPerguntas.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{tiposPerguntas.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {form.atualizadoEm || form.atualizado_em ? 
                            new Date(form.atualizadoEm || form.atualizado_em).toLocaleDateString('pt-BR') : 
                            (form.criadoEm || form.criado_em ? 
                              new Date(form.criadoEm || form.criado_em).toLocaleDateString('pt-BR') : 
                              '-'
                            )
                          }
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => navigate(`/protocolo/${form.id}`)}
                            title="Editar formulário"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDeleteFormulario(form.id)}
                            title="Excluir formulário"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
