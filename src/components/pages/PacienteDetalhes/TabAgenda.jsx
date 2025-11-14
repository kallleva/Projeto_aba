import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Clock, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ApiService from '@/lib/api';

const getStatusBadgeVariant = (status) => {
  switch (status) {
    case 'AGENDADO': return 'default';
    case 'CONFIRMADO': return 'secondary';
    case 'REALIZADO': return 'success';
    case 'CANCELADO': return 'destructive';
    default: return 'outline';
  }
};

const getStatusLabel = (status) => {
  const labels = {
    'AGENDADO': 'Agendado',
    'CONFIRMADO': 'Confirmado',
    'REALIZADO': 'Realizado',
    'CANCELADO': 'Cancelado'
  };
  return labels[status] || status;
};

const getPresencaLabel = (presente) => {
  if (presente === true) return 'Presente';
  if (presente === false) return 'Faltou';
  return 'Não registrado';
};

const getPresencaBadgeVariant = (presente) => {
  if (presente === true) return 'success';
  if (presente === false) return 'destructive';
  return 'outline';
};

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString('pt-BR');
};

export default function TabAgenda({ pacienteId, agendamentos, profissionais, onUpdate }) {
  const { toast } = useToast();
  const [showAgendamentoForm, setShowAgendamentoForm] = useState(false);
  const [editingAgendamento, setEditingAgendamento] = useState(null);
  
  const [agendamentoForm, setAgendamentoForm] = useState({
    data_hora: '',
    duracao_minutos: 60,
    observacoes: '',
    status: 'AGENDADO',
    presente: null,
    profissional_id: ''
  });

  const resetAgendamentoForm = () => {
    setAgendamentoForm({
      data_hora: '',
      duracao_minutos: 60,
      observacoes: '',
      status: 'AGENDADO',
      presente: null,
      profissional_id: ''
    });
    setEditingAgendamento(null);
    setShowAgendamentoForm(false);
  };

  const handleAgendamentoSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...agendamentoForm, paciente_id: parseInt(pacienteId) };
      if (editingAgendamento) {
        await ApiService.updateAgendamento(editingAgendamento.id, dataToSend);
        toast({ title: 'Sucesso', description: 'Agendamento atualizado!' });
      } else {
        await ApiService.createAgendamento(dataToSend);
        toast({ title: 'Sucesso', description: 'Agendamento criado!' });
      }
      if (onUpdate) await onUpdate();
      resetAgendamentoForm();
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error);
      toast({ title: 'Erro', description: 'Não foi possível salvar o agendamento.', variant: 'destructive' });
    }
  };

  const handleEditAgendamento = (agendamento) => {
    setAgendamentoForm({
      data_hora: agendamento.data_hora || '',
      duracao_minutos: agendamento.duracao_minutos || 60,
      observacoes: agendamento.observacoes || '',
      status: agendamento.status || 'AGENDADO',
      presente: agendamento.presente,
      profissional_id: agendamento.profissional_id?.toString() || ''
    });
    setEditingAgendamento(agendamento);
    setShowAgendamentoForm(true);
  };

  const handleDeleteAgendamento = async (agendamentoId) => {
    if (!confirm('Tem certeza que deseja excluir este agendamento?')) return;
    try {
      await ApiService.deleteAgendamento(agendamentoId);
      toast({ title: 'Sucesso', description: 'Agendamento excluído!' });
      if (onUpdate) await onUpdate();
    } catch (error) {
      console.error('Erro ao excluir agendamento:', error);
      toast({ title: 'Erro', description: 'Não foi possível excluir o agendamento.', variant: 'destructive' });
    }
  };

  const handleUpdatePresenca = async (agendamentoId, presente) => {
    try {
      await ApiService.updateAgendamento(agendamentoId, { presente });
      toast({ title: 'Sucesso', description: 'Presença registrada!' });
      if (onUpdate) await onUpdate();
    } catch (error) {
      console.error('Erro ao registrar presença:', error);
      toast({ title: 'Erro', description: 'Não foi possível registrar a presença.', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Agendamentos</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie os agendamentos deste paciente
          </p>
        </div>
        <Button onClick={() => setShowAgendamentoForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Agendamento
        </Button>
      </div>

      {showAgendamentoForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingAgendamento ? 'Editar Agendamento' : 'Novo Agendamento'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAgendamentoSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="data_hora">Data e Hora</Label>
                  <Input
                    id="data_hora"
                    type="datetime-local"
                    value={agendamentoForm.data_hora}
                    onChange={(e) => setAgendamentoForm({...agendamentoForm, data_hora: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duracao_minutos">Duração (minutos)</Label>
                  <Input
                    id="duracao_minutos"
                    type="number"
                    min="15"
                    value={agendamentoForm.duracao_minutos}
                    onChange={(e) => setAgendamentoForm({...agendamentoForm, duracao_minutos: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profissional_agendamento">Profissional</Label>
                  <Select
                    value={agendamentoForm.profissional_id}
                    onValueChange={(value) => setAgendamentoForm({...agendamentoForm, profissional_id: value})}
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
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={agendamentoForm.status}
                    onValueChange={(value) => setAgendamentoForm({...agendamentoForm, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AGENDADO">Agendado</SelectItem>
                      <SelectItem value="CONFIRMADO">Confirmado</SelectItem>
                      <SelectItem value="REALIZADO">Realizado</SelectItem>
                      <SelectItem value="CANCELADO">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="observacoes_agendamento">Observações</Label>
                  <Input
                    id="observacoes_agendamento"
                    value={agendamentoForm.observacoes}
                    onChange={(e) => setAgendamentoForm({...agendamentoForm, observacoes: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetAgendamentoForm}>
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
        {agendamentos.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                Nenhum agendamento cadastrado
              </p>
            </CardContent>
          </Card>
        ) : (
          agendamentos.map(agendamento => (
            <Card key={agendamento.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className="font-semibold">{formatDateTime(agendamento.data_hora)}</span>
                      <Badge variant={getStatusBadgeVariant(agendamento.status)}>
                        {getStatusLabel(agendamento.status)}
                      </Badge>
                      {agendamento.presente !== null && (
                        <Badge variant={getPresencaBadgeVariant(agendamento.presente)}>
                          {getPresencaLabel(agendamento.presente)}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Duração: {agendamento.duracao_minutos} min
                      {agendamento.profissional_nome && ` • Com: ${agendamento.profissional_nome}`}
                    </p>
                    {agendamento.observacoes && (
                      <p className="text-sm">{agendamento.observacoes}</p>
                    )}
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdatePresenca(agendamento.id, true)}
                        disabled={agendamento.presente === true}
                      >
                        Presente
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdatePresenca(agendamento.id, false)}
                        disabled={agendamento.presente === false}
                      >
                        Faltou
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditAgendamento(agendamento)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteAgendamento(agendamento.id)}
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
