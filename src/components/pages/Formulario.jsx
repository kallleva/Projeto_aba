import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ApiService from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Edit, Trash2, FileText } from 'lucide-react'

export default function Formularios() {
  const [formularios, setFormularios] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchFormularios()
  }, [])

  const fetchFormularios = async () => {
    try {
      const data = await ApiService.getFormularios()
      setFormularios(data)
    } catch (err) {
      console.error('Erro ao buscar Protocolo:', err)
    }
  }

  const handleDeleteFormulario = async (id) => {
    try {
      await ApiService.deleteFormulario(id)
      setFormularios(formularios.filter(f => f.id !== id))
    } catch (err) {
      console.error('Erro ao deletar Protocolo:', err)
    }
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Protocolo</h2>
          <p className="text-muted-foreground">
            Cadastre modelos de Protocolo apenas com perguntas estruturadas.
          </p>
        </div>
        <Button onClick={() => navigate("/protocolo/novo")}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Protocolo
        </Button>
      </div>

      {/* Lista de Protocolo */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Protocolo</CardTitle>
          <CardDescription>Visualize e gerencie os modelos criados</CardDescription>
        </CardHeader>
        <CardContent>
          {formularios.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Nenhum Protocolo criado ainda.</div>
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
                    <TableCell>
                      <div className="max-w-xs truncate" title={form.descricao}>
                        {form.descricao || '-'}
                      </div>
                    </TableCell>
                    <TableCell>{form.perguntas.length}</TableCell>
                    <TableCell>{form.atualizadoEm ? new Date(form.atualizadoEm).toLocaleDateString('pt-BR') : '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => navigate(`/protocolo/${form.id}`)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteFormulario(form.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
