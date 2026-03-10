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
      <CardHeader className="pb-3 md:pb-6">
        <CardTitle className="text-lg md:text-xl">Editar Informações do Paciente</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Atualize as informações pessoais do paciente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-xs md:text-sm">Nome</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                className="text-xs md:text-sm"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="data_nascimento" className="text-xs md:text-sm">Data de Nascimento</Label>
              <Input
                id="data_nascimento"
                type="date"
                value={formData.data_nascimento}
                onChange={(e) => setFormData({...formData, data_nascimento: e.target.value})}
                className="text-xs md:text-sm"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="responsavel" className="text-xs md:text-sm">Responsável</Label>
              <Input
                id="responsavel"
                value={formData.responsavel}
                onChange={(e) => setFormData({...formData, responsavel: e.target.value})}
                className="text-xs md:text-sm"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contato" className="text-xs md:text-sm">Contato</Label>
              <Input
                id="contato"
                value={formData.contato}
                onChange={(e) => setFormData({...formData, contato: e.target.value})}
                placeholder="Telefone ou email"
                className="text-xs md:text-sm"
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="diagnostico" className="text-xs md:text-sm">Diagnóstico</Label>
              <Select 
                value={formData.diagnostico} 
                onValueChange={(value) => setFormData({...formData, diagnostico: value})}
                required
              >
                <SelectTrigger className="text-xs md:text-sm">
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

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 md:gap-4 pt-2 md:pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/pacientes')}
              className="text-xs md:text-sm"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={saving} className="text-xs md:text-sm">
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 md:h-4 md:w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-3 w-3 md:h-4 md:w-4" />
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
