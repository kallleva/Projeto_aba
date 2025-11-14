import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ApiService from '@/lib/api';

export default function TabEditarPaciente({ paciente, onUpdate }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    nome: paciente?.nome || '',
    data_nascimento: paciente?.data_nascimento || '',
    responsavel: paciente?.responsavel || '',
    contato: paciente?.contato || '',
    diagnostico: paciente?.diagnostico || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await ApiService.updatePaciente(paciente.id, formData);
      toast({
        title: 'Sucesso',
        description: 'Informações do paciente atualizadas com sucesso!'
      });
      if (onUpdate) {
        const pacienteData = await ApiService.getPaciente(paciente.id);
        onUpdate(pacienteData);
      }
    } catch (error) {
      console.error('Erro ao atualizar paciente:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar as informações do paciente.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editar Informações do Paciente</CardTitle>
        <CardDescription>
          Atualize as informações pessoais do paciente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="data_nascimento">Data de Nascimento</Label>
              <Input
                id="data_nascimento"
                type="date"
                value={formData.data_nascimento}
                onChange={(e) => setFormData({...formData, data_nascimento: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="responsavel">Responsável</Label>
              <Input
                id="responsavel"
                value={formData.responsavel}
                onChange={(e) => setFormData({...formData, responsavel: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contato">Contato</Label>
              <Input
                id="contato"
                value={formData.contato}
                onChange={(e) => setFormData({...formData, contato: e.target.value})}
                placeholder="Telefone ou email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="diagnostico">Diagnóstico</Label>
              <Select 
                value={formData.diagnostico} 
                onValueChange={(value) => setFormData({...formData, diagnostico: value})}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o diagnóstico" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TEA">TEA (Transtorno do Espectro Autista)</SelectItem>
                  <SelectItem value="TDAH">TDAH (Transtorno do Déficit de Atenção)</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/pacientes')}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
