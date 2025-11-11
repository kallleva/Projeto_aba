#!/bin/sh

echo "🔐 Verificando certificados SSL..."

# Criar diretório de certificados se não existir
mkdir -p /etc/nginx/certs

# Verificar se certificados já existem (gerados pelo Traefik)
if [ ! -f /etc/nginx/certs/cert.pem ] || [ ! -f /etc/nginx/certs/key.pem ]; then
    echo "⚠️ Certificado não encontrado. Gerando auto-assinado como fallback..."
    
    # Gerar certificado auto-assinado de fallback
    openssl req -x509 -newkey rsa:2048 -keyout /etc/nginx/certs/key.pem -out /etc/nginx/certs/cert.pem -days 365 -nodes \
        -subj "/C=BR/ST=SP/L=SP/O=Aurora/CN=auroraclin.com.br" 2>/dev/null || true
    
    echo "✅ Certificado auto-assinado criado"
else
    echo "✅ Certificado encontrado"
fi

echo "🚀 Iniciando nginx..."

# Iniciar nginx em foreground
exec nginx -g "daemon off;"
