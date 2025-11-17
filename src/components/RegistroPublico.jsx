import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Building2, User, Mail, Lock, Phone, MapPin, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function RegistroPublico({ onClose }) {
  const [etapa, setEtapa] = useState(1); // 1: dados empresa, 2: dados admin, 3: sucesso
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Empresa
    nome_empresa: '',
    email_empresa: '',
    telefone_empresa: '',
    cnpj: '',
    cidade: '',
    estado: '',
    // Admin
    nome_admin: '',
    email_admin: '',
    senha_admin: '',
    confirmar_senha: ''
  });
  const [erros, setErros] = useState({});
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (campo, valor) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
    // Limpar erro do campo ao digitar
    if (erros[campo]) {
      setErros(prev => ({ ...prev, [campo]: null }));
    }
  };

  const validarEtapa1 = () => {
    const novosErros = {};
    
    if (!formData.nome_empresa.trim()) {
      novosErros.nome_empresa = 'Nome da empresa é obrigatório';
    }
    
    if (!formData.email_empresa.trim()) {
      novosErros.email_empresa = 'Email da empresa é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_empresa)) {
      novosErros.email_empresa = 'Email inválido';
    }
    
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const validarEtapa2 = () => {
    const novosErros = {};
    
    if (!formData.nome_admin.trim()) {
      novosErros.nome_admin = 'Nome do administrador é obrigatório';
    }
    
    if (!formData.email_admin.trim()) {
      novosErros.email_admin = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_admin)) {
      novosErros.email_admin = 'Email inválido';
    }
    
    if (!formData.senha_admin) {
      novosErros.senha_admin = 'Senha é obrigatória';
    } else if (formData.senha_admin.length < 6) {
      novosErros.senha_admin = 'Senha deve ter no mínimo 6 caracteres';
    }
    
    if (formData.senha_admin !== formData.confirmar_senha) {
      novosErros.confirmar_senha = 'As senhas não coincidem';
    }
    
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const avancarEtapa = () => {
    if (etapa === 1 && validarEtapa1()) {
      setEtapa(2);
    }
  };

  const voltarEtapa = () => {
    if (etapa === 2) {
      setEtapa(1);
    }
  };

  const finalizarRegistro = async () => {
    if (!validarEtapa2()) return;

    try {
      setLoading(true);
      
      const response = await fetch('http://localhost:5000/api/registro-publico', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || 'Erro ao criar conta');
      }

      // Cookie HttpOnly é armazenado automaticamente
      // Não é necessário salvar manualmente no localStorage

      setEtapa(3);
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate('/');
        window.location.reload(); // Recarregar para atualizar contexto de auth
      }, 2000);

    } catch (error) {
      toast({
        title: 'Erro no registro',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-3xl text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X size={24} />
          </button>
          
          <h2 className="text-3xl font-bold mb-2">Comece Grátis Agora!</h2>
          <p className="opacity-90">Configure sua conta em 2 passos simples</p>
          
          {/* Progress */}
          <div className="flex items-center gap-2 mt-6">
            <div className={`flex-1 h-2 rounded-full ${etapa >= 1 ? 'bg-white' : 'bg-white/30'}`} />
            <div className={`flex-1 h-2 rounded-full ${etapa >= 2 ? 'bg-white' : 'bg-white/30'}`} />
            <div className={`flex-1 h-2 rounded-full ${etapa >= 3 ? 'bg-white' : 'bg-white/30'}`} />
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Etapa 1: Dados da Empresa */}
          {etapa === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-3">
                  <Building2 className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Dados da Empresa</h3>
                <p className="text-gray-600">Informações sobre sua clínica ou consultório</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="nome_empresa">Nome da Empresa *</Label>
                  <Input
                    id="nome_empresa"
                    value={formData.nome_empresa}
                    onChange={(e) => handleChange('nome_empresa', e.target.value)}
                    placeholder="Ex: Clínica ABA Crescer"
                    className={erros.nome_empresa ? 'border-red-500' : ''}
                  />
                  {erros.nome_empresa && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {erros.nome_empresa}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email_empresa">Email da Empresa *</Label>
                  <Input
                    id="email_empresa"
                    type="email"
                    value={formData.email_empresa}
                    onChange={(e) => handleChange('email_empresa', e.target.value)}
                    placeholder="contato@clinica.com.br"
                    className={erros.email_empresa ? 'border-red-500' : ''}
                  />
                  {erros.email_empresa && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {erros.email_empresa}
                    </p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="telefone_empresa">Telefone</Label>
                    <Input
                      id="telefone_empresa"
                      value={formData.telefone_empresa}
                      onChange={(e) => handleChange('telefone_empresa', e.target.value)}
                      placeholder="(11) 98765-4321"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cnpj">CNPJ (opcional)</Label>
                    <Input
                      id="cnpj"
                      value={formData.cnpj}
                      onChange={(e) => handleChange('cnpj', e.target.value)}
                      placeholder="00.000.000/0000-00"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input
                      id="cidade"
                      value={formData.cidade}
                      onChange={(e) => handleChange('cidade', e.target.value)}
                      placeholder="São Paulo"
                    />
                  </div>

                  <div>
                    <Label htmlFor="estado">Estado</Label>
                    <Input
                      id="estado"
                      value={formData.estado}
                      onChange={(e) => handleChange('estado', e.target.value.toUpperCase())}
                      placeholder="SP"
                      maxLength={2}
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={avancarEtapa}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-6"
              >
                Continuar
              </Button>
            </div>
          )}

          {/* Etapa 2: Dados do Administrador */}
          {etapa === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
                  <User className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Dados do Administrador</h3>
                <p className="text-gray-600">Quem será o responsável pela conta</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="nome_admin">Nome Completo *</Label>
                  <Input
                    id="nome_admin"
                    value={formData.nome_admin}
                    onChange={(e) => handleChange('nome_admin', e.target.value)}
                    placeholder="João da Silva"
                    className={erros.nome_admin ? 'border-red-500' : ''}
                  />
                  {erros.nome_admin && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {erros.nome_admin}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email_admin">Email de Acesso *</Label>
                  <Input
                    id="email_admin"
                    type="email"
                    value={formData.email_admin}
                    onChange={(e) => handleChange('email_admin', e.target.value)}
                    placeholder="joao@clinica.com.br"
                    className={erros.email_admin ? 'border-red-500' : ''}
                  />
                  {erros.email_admin && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {erros.email_admin}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="senha_admin">Senha *</Label>
                  <Input
                    id="senha_admin"
                    type="password"
                    value={formData.senha_admin}
                    onChange={(e) => handleChange('senha_admin', e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className={erros.senha_admin ? 'border-red-500' : ''}
                  />
                  {erros.senha_admin && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {erros.senha_admin}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirmar_senha">Confirmar Senha *</Label>
                  <Input
                    id="confirmar_senha"
                    type="password"
                    value={formData.confirmar_senha}
                    onChange={(e) => handleChange('confirmar_senha', e.target.value)}
                    placeholder="Digite a senha novamente"
                    className={erros.confirmar_senha ? 'border-red-500' : ''}
                  />
                  {erros.confirmar_senha && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {erros.confirmar_senha}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={voltarEtapa}
                  variant="outline"
                  className="flex-1"
                  disabled={loading}
                >
                  Voltar
                </Button>
                <Button
                  onClick={finalizarRegistro}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" size={20} />
                      Criando...
                    </>
                  ) : (
                    'Criar Conta'
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Etapa 3: Sucesso */}
          {etapa === 3 && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">Conta Criada com Sucesso!</h3>
              <p className="text-lg text-gray-600 mb-6">
                Sua empresa <strong>{formData.nome_empresa}</strong> foi cadastrada.
              </p>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
                <p className="text-blue-900 font-semibold mb-2">Redirecionando para o sistema...</p>
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
              </div>
              <p className="text-sm text-gray-500">
                Você será automaticamente logado em instantes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
