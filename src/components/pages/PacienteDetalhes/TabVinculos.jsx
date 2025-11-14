import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ApiService from '@/lib/api';

const tiposAtendimento = [
  'Terapia ABA',
  'Psicologia',
  'Fonoaudiologia',
  'Terapia Ocupacional',
  'Fisioterapia',
  'Psicopedagogia',
  'Outro'
];

const getStatusVinculoBadgeVariant = (status) => {
  switch (status) {
    case 'ATIVO': return 'success';
    case 'INATIVO': return 'secondary';
    case 'PAUSADO': return 'outline';
    default: return 'default';
  }
};

const getStatusVinculoLabel = (status) => {
  const labels = {
    'ATIVO': 'Ativo',
    'INATIVO': 'Inativo',
    'PAUSADO': 'Pausado'
  };
  return labels[status] || status;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const dt = new Date(dateStr);
    if (!isNaN(dt)) return dt.toLocaleDateString('pt-BR');
  } catch {}
  return dateStr;
};

export default function TabVinculos({ pacienteId, vinculos, profissionais, onUpdate }) {
  const { toast } = useToast();
  const [showVinculoForm, setShowVinculoForm] = useState(false);
  const [editingVinculo, setEditingVinculo] = useState(null);
  
  const [vinculoForm, setVinculoForm] = useState({
    profissional_id: '',
    tipo_atendimento: '',
    data_inicio: new Date().toISOString().split('T')[0],
    frequencia_semanal: 2,
    duracao_sessao: 45,
    observacoes: ''
  });

  const resetVinculoForm = () => {
    setVinculoForm({
      profissional_id: '',
      tipo_atendimento: '',
      data_inicio: new Date().toISOString().split('T')[0],
      frequencia_semanal: 2,
      duracao_sessao: 45,
      observacoes: ''
    });
    setEditingVinculo(null);
    setShowVinculoForm(false);
  };

  const handleVinculoSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...vinculoForm, paciente_id: parseInt(pacienteId) };
      if (editingVinculo) {
        await ApiService.updateVinculoPaciente(pacienteId, editingVinculo.id, dataToSend);
        toast({ title: 'Sucesso', description: 'Vínculo atualizado!' });
      } else {
        await ApiService.createVinculoPaciente(pacienteId, dataToSend);
        toast({ title: 'Sucesso', description: 'Vínculo criado!' });
      }
      if (onUpdate) await onUpdate();
      resetVinculoForm();
    } catch (error) {
      console.error('Erro ao salvar vínculo:', error);
      toast({ title: 'Erro', description: 'Não foi possível salvar o vínculo.', variant: 'destructive' });
    }
  };

  const handleEditVinculo = (vinculo) => {
    setVinculoForm({
      profissional_id: vinculo.profissional_id?.toString() || '',
      tipo_atendimento: vinculo.tipo_atendimento || '',
      data_inicio: vinculo.data_inicio || '',
      frequencia_semanal: vinculo.frequencia_semanal || 2,
      duracao_sessao: vinculo.duracao_sessao || 45,
      observacoes: vinculo.observacoes || ''
    });
    setEditingVinculo(vinculo);
    setShowVinculoForm(true);
  };

  const handleDeleteVinculo = async (vinculoId) => {
    if (!confirm('Tem certeza que deseja excluir este vínculo?')) return;
    try {
      await ApiService.deleteVinculoPaciente(pacienteId, vinculoId);
      toast({ title: 'Sucesso', description: 'Vínculo excluído!' });
      if (onUpdate) await onUpdate();
    } catch (error) {
      console.error('Erro ao excluir vínculo:', error);
      toast({ title: 'Erro', description: 'Não foi possível excluir o vínculo.', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Profissionais Vinculados</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie os profissionais que atendem este paciente
          </p>
        </div>
        <Button onClick={() => setShowVinculoForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Vínculo
        </Button>
      </div>

      {showVinculoForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingVinculo ? 'Editar Vínculo' : 'Novo Vínculo'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVinculoSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="profissional_id">Profissional</Label>
                  <Select
                    value={vinculoForm.profissional_id}
                    onValueChange={(value) => setVinculoForm({...vinculoForm, profissional_id: value})}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o profissional" />
                    </SelectTrigger>
                    <SelectContent>
                      {profissionais.map(prof => (
                        <SelectItem key={prof.id} value={prof.id.toString()}>
                          {prof.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo_atendimento">Tipo de Atendimento</Label>
                  <Select
                    value={vinculoForm.tipo_atendimento}
                    onValueChange={(value) => setVinculoForm({...vinculoForm, tipo_atendimento: value})}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposAtendimento.map(tipo => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data_inicio">Data de Início</Label>
                  <Input
                    id="data_inicio"
                    type="date"
                    value={vinculoForm.data_inicio}
                    onChange={(e) => setVinculoForm({...vinculoForm, data_inicio: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequencia_semanal">Frequência Semanal</Label>
                  <Input
                    id="frequencia_semanal"
                    type="number"
                    min="1"
                    value={vinculoForm.frequencia_semanal}
                    onChange={(e) => setVinculoForm({...vinculoForm, frequencia_semanal: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duracao_sessao">Duração da Sessão (min)</Label>
                  <Input
                    id="duracao_sessao"
                    type="number"
                    min="15"
                    value={vinculoForm.duracao_sessao}
                    onChange={(e) => setVinculoForm({...vinculoForm, duracao_sessao: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Input
                    id="observacoes"
                    value={vinculoForm.observacoes}
                    onChange={(e) => setVinculoForm({...vinculoForm, observacoes: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetVinculoForm}>
                  Cancelar
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Salvar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {vinculos.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                Nenhum vínculo cadastrado
              </p>
            </CardContent>
          </Card>
        ) : (
          vinculos.map(vinculo => (
            <Card key={vinculo.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{vinculo.profissional_nome || 'Profissional'}</h4>
                      <Badge variant={getStatusVinculoBadgeVariant(vinculo.status)}>
                        {getStatusVinculoLabel(vinculo.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {vinculo.tipo_atendimento} • {vinculo.frequencia_semanal}x/semana • {vinculo.duracao_sessao} min
                    </p>
                    <p className="text-sm">
                      Início: {formatDate(vinculo.data_inicio)}
                    </p>
                    {vinculo.observacoes && (
                      <p className="text-sm text-muted-foreground">{vinculo.observacoes}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditVinculo(vinculo)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteVinculo(vinculo.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
