# Configuração Correta do Apache para MokBeats

## Estrutura de Diretórios na VPS

```
/var/www/mokbeats/
├── index.html          # Frontend Angular (build)
├── main.js
├── polyfills.js
├── runtime.js
├── styles.css
├── assets/
│   ├── images/
│   ├── audios/
│   └── ...
└── (outros arquivos do build Angular)

/var/www/mokbeats/server/     # Backend Node.js
├── src/
│   └── index.js
├── package.json
└── node_modules/
```

---

## Arquivo 1: mokbeats-le-ssl.conf (HTTPS - Porta 443)

**Localização:** `/etc/apache2/sites-available/mokbeats-le-ssl.conf`

```apache
<IfModule mod_ssl.c>
<VirtualHost *:443>
    ServerAdmin admin@mokbeats.com
    ServerName mokbeats.com
    ServerAlias www.mokbeats.com

    # Diretório do frontend Angular (arquivos do build)
    DocumentRoot /var/www/mokbeats

    # ===== PROXY REVERSO PARA API (Backend Node.js na porta 3100) =====
    ProxyPreserveHost On
    ProxyPass /api http://localhost:3100/api
    ProxyPassReverse /api http://localhost:3100/api

    # ===== Configuração do diretório do frontend =====
    <Directory /var/www/mokbeats>
        # -Indexes: Não listar diretórios (segurança)
        # +FollowSymLinks: Permitir links simbólicos
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted

        # Suporte para Angular SPA routing
        # Redireciona todas as rotas para index.html, exceto arquivos reais e /api
        RewriteEngine On
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteCond %{REQUEST_URI} !^/api
        RewriteRule ^ index.html [L]
    </Directory>

    # ===== Logs =====
    ErrorLog ${APACHE_LOG_DIR}/mokbeats_error.log
    CustomLog ${APACHE_LOG_DIR}/mokbeats_access.log combined

    # ===== SSL (Let's Encrypt) =====
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/mokbeats.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/mokbeats.com/privkey.pem
    Include /etc/letsencrypt/options-ssl-apache.conf
</VirtualHost>
</IfModule>
```

---

## Arquivo 2: mokbeats.conf (HTTP - Porta 80)

**Localização:** `/etc/apache2/sites-available/mokbeats.conf`

### Opção A: Redirect HTTP → HTTPS (RECOMENDADO)

```apache
<VirtualHost *:80>
    ServerName mokbeats.com
    ServerAlias www.mokbeats.com

    # Redirecionar automaticamente HTTP → HTTPS
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}$1 [R=301,L]

    # Logs
    ErrorLog ${APACHE_LOG_DIR}/mokbeats-error.log
    CustomLog ${APACHE_LOG_DIR}/mokbeats-access.log combined
</VirtualHost>
```

### Opção B: Servir conteúdo também via HTTP (Não recomendado)

```apache
<VirtualHost *:80>
    ServerName mokbeats.com
    ServerAlias www.mokbeats.com

    DocumentRoot /var/www/mokbeats

    # Proxy para API
    ProxyPreserveHost On
    ProxyPass /api http://localhost:3100/api
    ProxyPassReverse /api http://localhost:3100/api

    # Configuração do frontend
    <Directory /var/www/mokbeats>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted

        # SPA routing
        RewriteEngine On
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteCond %{REQUEST_URI} !^/api
        RewriteRule ^ index.html [L]
    </Directory>

    # Logs
    ErrorLog ${APACHE_LOG_DIR}/mokbeats-error.log
    CustomLog ${APACHE_LOG_DIR}/mokbeats-access.log combined
</VirtualHost>
```

---

## Comandos para Aplicar na VPS

### 1. Conectar na VPS

```bash
ssh root@147.79.87.156
```

### 2. Fazer backup das configurações atuais

```bash
# Backup do arquivo HTTPS
cp /etc/apache2/sites-available/mokbeats-le-ssl.conf /etc/apache2/sites-available/mokbeats-le-ssl.conf.backup

# Backup do arquivo HTTP
cp /etc/apache2/sites-available/mokbeats.conf /etc/apache2/sites-available/mokbeats.conf.backup
```

### 3. Habilitar módulos necessários do Apache

```bash
a2enmod proxy
a2enmod proxy_http
a2enmod rewrite
a2enmod ssl

# Verificar módulos habilitados
apache2ctl -M | grep -E '(proxy|rewrite|ssl)'
```

### 4. Editar arquivo HTTPS (mokbeats-le-ssl.conf)

```bash
nano /etc/apache2/sites-available/mokbeats-le-ssl.conf
```

**Cole a configuração completa mostrada acima** (Arquivo 1)

**Teclas:**
- `Ctrl + O` → Salvar
- `Enter` → Confirmar
- `Ctrl + X` → Sair

### 5. Editar arquivo HTTP (mokbeats.conf) - Opcional

```bash
nano /etc/apache2/sites-available/mokbeats.conf
```

**Cole a configuração** (Opção A ou B do Arquivo 2)

### 6. Testar configuração do Apache

```bash
apache2ctl configtest
```

**Resultado esperado:** `Syntax OK`

Se aparecer algum erro, verifique:
- Falta de ponto e vírgula
- Tags não fechadas
- Diretivas duplicadas

### 7. Recarregar Apache

```bash
systemctl reload apache2

# OU reiniciar completamente
systemctl restart apache2
```

### 8. Verificar status do Apache

```bash
systemctl status apache2
```

---

## Verificar se Backend está Rodando

### Verificar processos PM2

```bash
pm2 list
```

**Deve aparecer:** `mok-backend` com status `online`

### Se não estiver rodando, iniciar:

```bash
cd /var/www/mokbeats/server
pm2 start src/index.js --name mok-backend
pm2 save
```

### Verificar logs do backend

```bash
pm2 logs mok-backend
```

---

## Testar a Configuração

### 1. Testar backend diretamente (localhost)

```bash
curl http://localhost:3100/api/favoritos
```

**Deve retornar:** JSON com os favoritos

### 2. Testar através do domínio (HTTPS)

```bash
curl https://mokbeats.com/api/favoritos
```

**Deve retornar:** O mesmo JSON

### 3. Testar através do domínio (HTTP - deve redirecionar)

```bash
curl -I http://mokbeats.com/api/favoritos
```

**Deve retornar:** `301 Moved Permanently` ou `302 Found` (se configurou redirect)

### 4. Testar no navegador

Abra o navegador e acesse:
- https://mokbeats.com
- https://mokbeats.com/api/favoritos
- https://mokbeats.com/api/musicas

---

## Verificar Logs em Caso de Erro

### Logs do Apache (erros)

```bash
tail -f /var/log/apache2/mokbeats_error.log
```

### Logs do Apache (acessos)

```bash
tail -f /var/log/apache2/mokbeats_access.log
```

### Logs do Backend (PM2)

```bash
pm2 logs mok-backend
```

### Logs gerais do Apache

```bash
tail -f /var/log/apache2/error.log
```

---

## Solução de Problemas Comuns

### Problema 1: 404 na API

**Causa:** Proxy não configurado ou módulo proxy não habilitado

**Solução:**
```bash
# Verificar módulos
apache2ctl -M | grep proxy

# Se não aparecer, habilitar:
a2enmod proxy
a2enmod proxy_http
systemctl restart apache2
```

### Problema 2: 500 Internal Server Error

**Causa:** Backend não está rodando ou porta errada

**Solução:**
```bash
# Verificar backend
pm2 list
curl http://localhost:3100/api/favoritos

# Se não responder, reiniciar backend
pm2 restart mok-backend

# Verificar logs
pm2 logs mok-backend
```

### Problema 3: Angular routes retornam 404

**Causa:** RewriteRule não configurado ou mod_rewrite não habilitado

**Solução:**
```bash
# Habilitar mod_rewrite
a2enmod rewrite
systemctl restart apache2

# Verificar se RewriteEngine On está dentro do <Directory>
nano /etc/apache2/sites-available/mokbeats-le-ssl.conf
```

### Problema 4: CORS Error no frontend

**Causa:** Backend não está configurando headers CORS corretamente

**Solução:** Verificar se o backend tem:
```javascript
const cors = require('cors');
app.use(cors({ origin: '*' }));
```

---

## Comandos Úteis para Manutenção

### Reiniciar serviços

```bash
# Apache
systemctl restart apache2

# Backend
pm2 restart mok-backend

# Todos os processos PM2
pm2 restart all
```

### Ver status

```bash
# Apache
systemctl status apache2

# PM2
pm2 status
pm2 monit  # Monitoramento em tempo real
```

### Limpar logs

```bash
# PM2
pm2 flush

# Apache (cuidado, isso apaga os logs!)
> /var/log/apache2/mokbeats_error.log
> /var/log/apache2/mokbeats_access.log
```

---

## Checklist Final

- [ ] Módulos habilitados: `proxy`, `proxy_http`, `rewrite`, `ssl`
- [ ] Arquivo `mokbeats-le-ssl.conf` atualizado com:
  - [ ] ProxyPass /api
  - [ ] ProxyPassReverse /api
  - [ ] RewriteEngine On
  - [ ] RewriteRule para SPA
  - [ ] SSLEngine on
- [ ] Arquivo `mokbeats.conf` com redirect HTTP → HTTPS
- [ ] Configuração testada: `apache2ctl configtest` → `Syntax OK`
- [ ] Apache recarregado: `systemctl reload apache2`
- [ ] Backend rodando: `pm2 list` → `mok-backend online`
- [ ] API responde localmente: `curl http://localhost:3100/api/favoritos` ✅
- [ ] API responde via domínio: `curl https://mokbeats.com/api/favoritos` ✅
- [ ] Frontend carrega: https://mokbeats.com ✅
- [ ] Rotas Angular funcionam: https://mokbeats.com/sobre, etc. ✅

---

## Estrutura Final das Requisições

```
Cliente (navegador)
    ↓
https://mokbeats.com/api/favoritos
    ↓
Apache (porta 443) - mokbeats-le-ssl.conf
    ↓
ProxyPass /api → http://localhost:3100/api
    ↓
Backend Node.js (porta 3100)
    ↓
Resposta JSON
    ↓
Cliente recebe dados
```

```
Cliente (navegador)
    ↓
https://mokbeats.com/
    ↓
Apache (porta 443) - mokbeats-le-ssl.conf
    ↓
DocumentRoot /var/www/mokbeats
    ↓
Serve index.html
    ↓
Angular carrega e faz routing no cliente
```

---

## Diferenças Principais da Configuração Anterior

### ❌ SUA CONFIGURAÇÃO ATUAL:
```apache
<Directory /var/www/mokbeats>
    Options Indexes FollowSymLinks    # ❌ "Indexes" expõe listagem
    AllowOverride All
    Require all granted
</Directory>
# ❌ FALTANDO: ProxyPass
# ❌ FALTANDO: RewriteRule para SPA
# ❌ FALTANDO: SSLEngine on
```

### ✅ CONFIGURAÇÃO CORRETA:
```apache
# ✅ ADICIONADO: Proxy para API
ProxyPreserveHost On
ProxyPass /api http://localhost:3100/api
ProxyPassReverse /api http://localhost:3100/api

<Directory /var/www/mokbeats>
    Options -Indexes +FollowSymLinks  # ✅ Seguro
    AllowOverride All
    Require all granted

    # ✅ ADICIONADO: SPA routing
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} !^/api
    RewriteRule ^ index.html [L]
</Directory>

# ✅ ADICIONADO: SSL Engine
SSLEngine on
```

---

## Suporte Adicional

Se continuar com problemas:

1. **Verificar permissões dos arquivos:**
```bash
ls -la /var/www/mokbeats/index.html
chown -R www-data:www-data /var/www/mokbeats
chmod -R 755 /var/www/mokbeats
```

2. **Verificar se porta 3100 está escutando:**
```bash
netstat -tlnp | grep 3100
# OU
lsof -i :3100
```

3. **Verificar configuração do backend:**
```bash
cat /var/www/mokbeats/server/src/index.js | grep "listen"
# Deve mostrar: app.listen(3100, ...)
```

---

**Última atualização:** 2025-10-12
**Estrutura validada:** ✅ `/var/www/mokbeats` contém arquivos do build Angular
