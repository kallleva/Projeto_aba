import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ApiService from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/AuthContext'
import { Plus, Trash2, Save, BarChart3, Folder } from 'lucide-react'

export default function TabulacaoEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useAuth()
  
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    categoria: '',
    topicos: []
  })

  const [loading, setLoading] = useState(id ? true : false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (id) {
      loadTabulacao(id)
    }
  }, [id])

  const loadTabulacao = async (tabulacaoId) => {
    try {
      setLoading(true)
      const data = await ApiService.getTabulacao(tabulacaoId)
      
      // Reorganizar itens por tópico
      const topicosMap = {}
      if (data.itens) {
        data.itens.forEach(item => {
          const topico = item.topico || 'Sem tópico'
          if (!topicosMap[topico]) {
            topicosMap[topico] = {
              id: null,
              nome: topico,
              ordem: Object.keys(topicosMap).length,
              itens: []
            }
          }
          topicosMap[topico].itens.push({
            id: item.id,
            codigo: item.codigo,
            descricao: item.descricao,
            ordem: item.ordem || topicosMap[topico].itens.length
          })
        })
      }

      setFormData({
        nome: data.nome || '',
        descricao: data.descricao || '',
        categoria: data.categoria || '',
        topicos: Object.values(topicosMap)
      })
    } catch (err) {
      console.error('Erro ao carregar tabulação:', err)
      toast({
        title: 'Erro',
        description: 'Erro ao carregar tabulação: ' + err.message,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const addTopico = () => {
    setFormData({
      ...formData,
      topicos: [
        ...formData.topicos,
        {
          id: null,
          nome: '',
          ordem: formData.topicos.length,
          itens: []
        }
      ]
    })
  }

  const deleteTopico = (topicoIndex) => {
    setFormData({
      ...formData,
      topicos: formData.topicos.filter((_, i) => i !== topicoIndex)
    })
  }

  const updateTopico = (topicoIndex, field, value) => {
    const newTopicos = [...formData.topicos]
    newTopicos[topicoIndex] = {
      ...newTopicos[topicoIndex],
      [field]: value
    }
    setFormData({
      ...formData,
      topicos: newTopicos
    })
  }

  const addItemToTopico = (topicoIndex) => {
    const newTopicos = [...formData.topicos]
    newTopicos[topicoIndex].itens.push({
      id: null,
      codigo: '',
      descricao: '',
      ordem: newTopicos[topicoIndex].itens.length
    })
    setFormData({
      ...formData,
      topicos: newTopicos
    })
  }

  const deleteItemFromTopico = (topicoIndex, itemIndex) => {
    const newTopicos = [...formData.topicos]
    newTopicos[topicoIndex].itens = newTopicos[topicoIndex].itens.filter((_, i) => i !== itemIndex)
    setFormData({
      ...formData,
      topicos: newTopicos
    })
  }

  const updateItemInTopico = (topicoIndex, itemIndex, field, value) => {
    const newTopicos = [...formData.topicos]
    newTopicos[topicoIndex].itens[itemIndex] = {
      ...newTopicos[topicoIndex].itens[itemIndex],
      [field]: value
    }
    setFormData({
      ...formData,
      topicos: newTopicos
    })
  }

  const handleSave = async () => {
    try {
      // Validações
      if (!formData.nome.trim()) {
        toast({
          title: 'Erro',
          description: 'Nome da tabulação é obrigatório',
          variant: 'destructive'
        })
        return
      }

      // Validar se tem pelo menos um tópico com itens
      const totalItens = formData.topicos.reduce((sum, t) => sum + t.itens.length, 0)
      if (totalItens === 0) {
        toast({
          title: 'Erro',
          description: 'Adicione pelo menos um item à tabulação',
          variant: 'destructive'
        })
        return
      }

      setSaving(true)

      // Converter tópicos e itens para o formato esperado pela API
      const itens = []
      let ordemGlobal = 0
      formData.topicos.forEach(topico => {
        topico.itens.forEach(item => {
          itens.push({
            id: item.id,  // Importante: enviar o ID para itens existentes
            topico: topico.nome,
            descricao: item.descricao,
            codigo: item.codigo,
            ordem: ordemGlobal++
          })
        })
      })

      const payload = {
        nome: formData.nome,
        descricao: formData.descricao,
        categoria: formData.categoria,
        empresa_id: user?.empresa_id,
        itens: itens
      }

      let result
      if (id) {
        result = await ApiService.updateTabulacao(id, payload)
      } else {
        result = await ApiService.createTabulacao(payload)
      }

      toast({
        title: 'Sucesso',
        description: id ? 'Tabulação atualizada com sucesso!' : 'Tabulação criada com sucesso!'
      })

      navigate('/tabulacao')
    } catch (err) {
      console.error('Erro ao salvar tabulação:', err)
      
      // Tratamento especial para erro de itens com respostas
      if (err.response?.status === 400 && err.response?.data?.itens_com_respostas) {
        const itensComRespostas = err.response.data.itens_com_respostas
        const listaItens = itensComRespostas
          .map(item => `• ${item.codigo} (${item.respostas} resposta${item.respostas > 1 ? 's' : ''})`)
          .join('\n')
        
        toast({
          title: 'Não é possível deletar esses itens',
          description: `Os seguintes itens possuem respostas registradas:\n${listaItens}`,
          variant: 'destructive'
        })
      } else {
        toast({
          title: 'Erro',
          description: 'Erro ao salvar tabulação: ' + (err.response?.data?.erro || err.message),
          variant: 'destructive'
        })
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 mx-auto" style={{borderColor: 'var(--color-info-200)', borderTopColor: 'var(--color-info-500)'}}></div>
          <p className="mt-4 card-text font-medium">Carregando tabulação...</p>
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
            <h1 className="page-title">{id ? 'Editar Tabulação' : 'Nova Tabulação'}</h1>
            <p className="page-subtitle">
              {id ? 'Atualize o template de tabulação' : 'Crie um novo template de tabulação com os itens a serem avaliados'}
            </p>
          </div>
        </div>
      </div>

      {/* Dados Gerais */}
      <div className="card-spacing">
        <div className="section-header mb-6">
          <BarChart3 size={18} className="color-info-icon" />
          <h2 className="section-header-title">Dados do Template</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nome */}
          <div>
            <Label htmlFor="nome" className="font-semibold mb-2 block">Nome do Template *</Label>
            <Input
              id="nome"
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
              placeholder="Ex: GMFM - Avaliação Motora"
              className="h-10"
            />
          </div>

          {/* Categoria */}
          <div>
            <Label htmlFor="categoria" className="font-semibold mb-2 block">Categoria</Label>
            <Select
              value={formData.categoria}
              onValueChange={(value) => setFormData({...formData, categoria: value})}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gmfm">GMFM</SelectItem>
                <SelectItem value="avaliacao">Avaliação</SelectItem>
                <SelectItem value="terapia">Terapia</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Descrição */}
          <div className="md:col-span-2">
            <Label htmlFor="descricao" className="font-semibold mb-2 block">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({...formData, descricao: e.target.value})}
              placeholder="Descrição detalhada da tabulação"
              rows={3}
              className="resize-none"
            />
          </div>
        </div>
      </div>

      {/* Tópicos e Itens */}
      <div className="card-spacing">
        <div className="section-header mb-6">
          <Folder size={18} className="color-info-icon" />
          <h2 className="section-header-title">Tópicos e Itens de Avaliação</h2>
        </div>

        <Button 
          onClick={addTopico}
          className="mb-6"
          style={{ backgroundColor: '#0ea5e9', color: 'white' }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Tópico
        </Button>

        {formData.topicos.length === 0 ? (
          <div className="alert alert-info">
            <BarChart3 size={18} />
            <div className="alert-content">
              <p className="font-medium">Nenhum tópico adicionado</p>
              <p className="text-sm mt-1">Adicione tópicos para agrupar os itens de avaliação</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {formData.topicos.map((topico, topicoIndex) => (
              <div key={topicoIndex} className="rounded-lg border-2 p-5" style={{borderColor: 'var(--color-info-200)'}}>
                {/* Header do Tópico */}
                <div className="flex justify-between items-start mb-5">
                  <div className="flex-1">
                    <Label className="text-sm mb-2 block font-semibold">Nome do Tópico *</Label>
                    <Input
                      type="text"
                      value={topico.nome}
                      onChange={(e) => updateTopico(topicoIndex, 'nome', e.target.value)}
                      placeholder="Ex: Jogos, Motricidade Fina, Coordenação"
                      className="h-10 font-semibold text-base"
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => deleteTopico(topicoIndex)}
                    className="h-10 w-10 p-0 ml-2 flex-shrink-0"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>

                {/* Itens do Tópico */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-sm">Itens</h4>
                    <Button 
                      onClick={() => addItemToTopico(topicoIndex)}
                      size="sm"
                      style={{ backgroundColor: '#10b981', color: 'white' }}
                    >
                      <Plus size={14} className="mr-1" />
                      Adicionar Item
                    </Button>
                  </div>

                  {topico.itens.length === 0 ? (
                    <div className="text-center py-6" style={{color: 'var(--color-neutral-500)'}}>
                      <p className="text-sm">Nenhum item neste tópico</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {topico.itens.map((item, itemIndex) => (
                        <div key={itemIndex} className="border rounded-lg p-4" style={{backgroundColor: 'white', borderColor: 'var(--color-neutral-200)'}}>
                          <div className="flex justify-between items-start mb-3">
                            <div className="text-xs text-gray-500 font-medium">Item {itemIndex + 1}</div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => deleteItemFromTopico(topicoIndex, itemIndex)}
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Código */}
                            <div>
                              <Label className="text-xs font-semibold mb-1 block">Código *</Label>
                              <Input
                                type="text"
                                value={item.codigo}
                                onChange={(e) => updateItemInTopico(topicoIndex, itemIndex, 'codigo', e.target.value)}
                                placeholder="Ex: E01"
                                className="h-9 text-sm"
                              />
                            </div>

                            {/* Descrição */}
                            <div className="md:col-span-2">
                              <Label className="text-xs font-semibold mb-1 block">Descrição</Label>
                              <Textarea
                                value={item.descricao}
                                onChange={(e) => updateItemInTopico(topicoIndex, itemIndex, 'descricao', e.target.value)}
                                placeholder="Descrição detalhada do item"
                                className="text-sm resize"
                                rows={3}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botões de Ação */}
      <div className="card-spacing flex justify-end gap-3">
        <Button 
          onClick={() => navigate('/tabulacao')}
          variant="outline"
          disabled={saving}
          className="h-10 font-medium"
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSave}
          disabled={saving}
          style={{ backgroundColor: '#10b981', color: 'white' }}
          className="h-10 font-medium flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Salvando...' : 'Salvar Tabulação'}
        </Button>
      </div>
    </div>
  )
}
