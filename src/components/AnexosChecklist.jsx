import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import ApiService from '@/lib/api';
import { Upload, Trash2, Download, FileText, Image, Video, Music, File, AlertCircle } from 'lucide-react';

export default function AnexosChecklist({ checklistId }) {
  const [anexos, setAnexos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [descricao, setDescricao] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (checklistId && checklistId !== 'novo') {
      loadAnexos();
    }
  }, [checklistId]);

  const loadAnexos = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getAnexosChecklist(checklistId);
      setAnexos(data);
    } catch (error) {
      console.error('Erro ao carregar anexos:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar anexos: ' + error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (event) => {
    const arquivo = event.target.files[0];
    if (!arquivo) return;

    // Validar tamanho (50MB)
    if (arquivo.size > 50 * 1024 * 1024) {
      toast({
        title: 'Erro',
        description: 'Arquivo muito grande. Máximo: 50MB',
        variant: 'destructive',
      });
      return;
    }

    try {
      setUploading(true);
      await ApiService.uploadAnexoChecklist(checklistId, arquivo, descricao);
      toast({
        title: 'Sucesso',
        description: 'Arquivo enviado com sucesso!',
      });
      setDescricao('');
      event.target.value = ''; // Limpar input
      loadAnexos();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao enviar arquivo: ' + error.message,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (anexoId) => {
    if (!window.confirm('Tem certeza que deseja deletar este anexo?')) {
      return;
    }

    try {
      await ApiService.deleteAnexoChecklist(anexoId);
      toast({
        title: 'Sucesso',
        description: 'Anexo deletado com sucesso!',
      });
      loadAnexos();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao deletar anexo: ' + error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDownload = (anexo) => {
    const token = localStorage.getItem('token');
    const url = `${ApiService.getAnexoDownloadUrl(anexo.id)}`;
    
    // Criar link temporário com token
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', anexo.nome_arquivo);
    
    // Adicionar token ao header via fetch
    fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.blob())
      .then(blob => {
        const blobUrl = window.URL.createObjectURL(blob);
        link.href = blobUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      })
      .catch(error => {
        toast({
          title: 'Erro',
          description: 'Erro ao fazer download: ' + error.message,
          variant: 'destructive',
        });
      });
  };

  const getIconeArquivo = (tipoArquivo, nomeArquivo) => {
    const extensao = nomeArquivo.split('.').pop().toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extensao)) {
      return <Image size={20} className="text-purple-600" />;
    }
    if (['mp4', 'avi', 'mov', 'wmv'].includes(extensao)) {
      return <Video size={20} className="text-red-600" />;
    }
    if (['mp3', 'wav', 'ogg'].includes(extensao)) {
      return <Music size={20} className="text-green-600" />;
    }
    if (['pdf', 'doc', 'docx', 'txt'].includes(extensao)) {
      return <FileText size={20} className="text-blue-600" />;
    }
    return <File size={20} className="text-gray-600" />;
  };

  if (checklistId === 'novo') {
    return (
      <div className="alert alert-info">
        <AlertCircle size={18} />
        <p className="alert-content">Salve o registro primeiro para poder adicionar anexos.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload */}
      <div className="border-2 border-dashed rounded-lg p-6" style={{borderColor: 'var(--color-neutral-300)'}}>
        <div className="space-y-4">
          <div className="form-group">
            <Label className="font-semibold mb-2 block">Descrição do Anexo (opcional)</Label>
            <Input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Foto da atividade, vídeo da sessão..."
              disabled={uploading}
            />
          </div>

          <div className="form-group">
            <Label htmlFor="file-upload" className="font-semibold mb-2 block">
              Selecionar Arquivo
            </Label>
            <Input
              id="file-upload"
              type="file"
              onChange={handleFileSelect}
              disabled={uploading}
              accept=".png,.jpg,.jpeg,.gif,.pdf,.doc,.docx,.xls,.xlsx,.mp4,.avi,.mov,.mp3,.wav,.zip,.rar,.txt"
            />
            <p className="text-xs mt-2" style={{color: 'var(--color-neutral-500)'}}>
              Tipos permitidos: Imagens, PDFs, Vídeos, Áudios, Documentos. Máximo: 50MB
            </p>
          </div>

          {uploading && (
            <div className="flex items-center gap-2 text-blue-600">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
              <span className="text-sm font-medium">Enviando arquivo...</span>
            </div>
          )}
        </div>
      </div>

      {/* Lista de Anexos */}
      <div>
        <h3 className="section-header-title mb-4">Anexos do Registro ({anexos.length})</h3>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 mx-auto" style={{borderColor: 'var(--color-info-200)', borderTopColor: 'var(--color-info-500)'}}></div>
            <p className="mt-3 text-sm text-gray-600">Carregando anexos...</p>
          </div>
        ) : anexos.length === 0 ? (
          <div className="alert alert-info">
            <Upload size={18} />
            <p className="alert-content">Nenhum anexo adicionado ainda. Use o formulário acima para enviar arquivos.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {anexos.map((anexo) => (
              <div
                key={anexo.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                style={{borderColor: 'var(--color-neutral-200)'}}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex-shrink-0">
                    {getIconeArquivo(anexo.tipo_arquivo, anexo.nome_arquivo)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{anexo.nome_arquivo}</p>
                    {anexo.descricao && (
                      <p className="text-xs text-gray-600 mt-1">{anexo.descricao}</p>
                    )}
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-500">{anexo.tamanho_formatado}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(anexo.criado_em).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(anexo)}
                    className="h-9 w-9 p-0"
                    title="Download"
                  >
                    <Download size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(anexo.id)}
                    className="h-9 w-9 p-0"
                    title="Deletar"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
