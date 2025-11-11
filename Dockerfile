# Estágio 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Force rebuild - updated 2025-11-09

# Copiar package.json e pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Instalar pnpm e dependências
RUN npm install -g pnpm && pnpm install

# Copiar código da aplicação
COPY . .

# Build da aplicação
RUN pnpm build

# Estágio 2: Runtime (Nginx)
FROM nginx:alpine

# Remover configuração padrão do nginx
RUN rm -rf /etc/nginx/conf.d /etc/nginx/conf.d.default

# Copiar configuração do Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar arquivos buildados do estágio anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Criar diretório para scripts
RUN mkdir -p /app/scripts

# Copiar entrypoint
COPY entrypoint.sh /app/scripts/entrypoint.sh
RUN chmod +x /app/scripts/entrypoint.sh

# Expor porta
EXPOSE 80

# Comando padrão
CMD ["/app/scripts/entrypoint.sh"]
