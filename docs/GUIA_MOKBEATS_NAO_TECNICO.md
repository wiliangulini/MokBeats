Guia rápido (não técnico) — MokBeats

Este guia explica, passo a passo, como baixar e rodar o projeto MokBeats no seu computador sem precisar entender de programação.

1) O que você precisa
- Um computador com internet (Windows 10/11, macOS 11+ ou Linux).
- Navegador (Chrome, Edge, Safari ou Firefox).
- Permissão para instalar programas (o script instala automaticamente as ferramentas necessárias).

2) Baixar o projeto
- Opção A (ZIP):
  1. Clique no botão de download do repositório (Download ZIP).
  2. Extraia o arquivo ZIP em uma pasta fácil (ex.: Desktop/MokBeats).
- Opção B (Git):
  1. Instale o Git (se não tiver).
  2. Abra um terminal e rode: `git clone <URL_DO_REPO>`

3) Abrir um terminal na pasta do projeto
- Windows:
  - Recomendado: abra o “Git Bash” (instalado junto com o Git) e navegue até a pasta do projeto (ex.: `cd ~/Desktop/MokBeats`).
  - Alternativa: use o Windows Subsystem for Linux (WSL) e abra a pasta do projeto pelo WSL.
- macOS ou Linux: abra o app “Terminal”, depois `cd` até a pasta do projeto.

4) Rodar automaticamente com o script start.sh (recomendado)
- No Terminal (macOS/Linux):
  1. Dê permissão ao script uma única vez: `chmod +x start.sh`
  2. Execute: `./start.sh`
- No Windows (Git Bash):
 - Execute: `bash start.sh`

4.1) Rodar no Windows (CMD ou PowerShell) — start.bat / start.ps1
- O projeto inclui scripts próprios para Windows que não exigem permissões de administrador.
- Opção A — CMD (Prompt de Comando):
  1. Abra o Prompt de Comando.
  2. Vá até a pasta do projeto (ex.: `cd C:\Users\SeuUsuario\Desktop\MokBeats`).
  3. Execute: `start.bat`
- Opção B — PowerShell:
  1. Abra o PowerShell.
  2. Vá até a pasta do projeto: `cd .\MokBeats`.
  3. Se aparecer aviso de política de execução de scripts, rode apenas para esta sessão: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`
  4. Execute: `./start.ps1`

O que os scripts do Windows fazem
- Baixam e usam o Node.js 16.20.2 de forma portátil (sem instalar para o sistema) caso você não tenha Node 16.
- Instalam automaticamente as dependências do frontend (raiz) e backend (`server/`).
- Sobem a API (`node server/src/index.js`) e o site (`npm run start`).
- Abrem o navegador em http://localhost:4200.
- Mantêm os processos rodando até você apertar Enter (no PowerShell). No CMD, apenas rode o `start.bat` — ele chama o PowerShell internamente.

Como parar no Windows
- Se executou `start.ps1` no PowerShell: volte à janela e pressione Enter para encerrar.
- Se usou `start.bat` no CMD: feche as janelas abertas ou encerre os processos conforme solicitado pelo PowerShell.

O que o script faz por você
- Instala o NVM (gerenciador de versões do Node.js).
- Instala e usa o Node.js v16.20.2 (compatível com o projeto).
- Instala o Angular CLI 14 e o PM2 (gerenciador de processos) quando necessário.
- Instala as dependências do projeto (frontend e backend).
- Sobe o backend (API) com PM2 e o frontend (site) com o Angular.
- (Opcional) Se você tiver o `audiowaveform` instalado, rode `./start.sh --generate-peaks` para criar as formas de onda reais das músicas (`server/data/musicas.json`).

Como acessar
- Site (frontend): http://localhost:4200
- API (backend): http://localhost:3100

Como parar
- Volte ao terminal onde rodou o script e pressione Ctrl + C (o script desliga o backend e o frontend).

5) Rodar manualmente (alternativa ao start.sh)
- Passo 1 — Instalar Node.js 16 (ou usar NVM):
  - Com NVM: `nvm install 16.20.2 && nvm use 16.20.2`
- Passo 2 — Instalar dependências do projeto (frontend):
  - Na pasta raiz do projeto: `npm install`
- Passo 3 — Instalar dependências do backend:
  - `cd server && npm install && cd ..`
- Passo 4 — Subir o backend (API):
  - `cd server && npm start` (deixa esse terminal aberto)
- Passo 5 — Subir o frontend (site):
 - Em outro terminal (na raiz do projeto): `npm run start`
- Acessar: http://localhost:4200

6) Login de teste (apenas para desenvolvimento)
- O backend aceita qualquer e-mail válido e uma senha com pelo menos 8 caracteres; ele gera um token fictício para destravar o front-end.
- Se preferir um exemplo pronto, você pode usar o e-mail `test@mokbeats.com` com a senha `test12345`.

7) Dicas de uso (resumo)
- Página Inicial (Home):
  - Mostra as últimas faixas sem repetir produtor, com duração real e BPM.
- Filtro (Filter):
  - O campo de busca filtra gêneros em tempo real (digite “rock”, “pop”, etc.).
  - O componente usa os endpoints do backend para listar gêneros e humores.
- Gênero e Humor:
  - Gênero mostra (grupo → subgêneros) consumindo a API.
  - Humor exibe a lista de humores e oculta o campo de busca.
- Produtores (Envio de músicas):
  - Duas opções exclusivas: 
    - “Música sem Stems” (1 arquivo) ou “Música com Stems” (1 música + de 1 a 4 stems).
  - Loops obrigatórios: 15s, 30s e 60s. O formulário calcula a duração e o backend valida (±200 ms).
  - ISRC/UPC obrigatórios; um campo opcional “Registro adicional” (ISRC | UPC | HASH | OUTROS) com validação.
  - Redes Sociais (opcional): Facebook, Instagram, WhatsApp (normalizado para wa.me), LinkedIn, Spotify, Google/YouTube e outro link.
  - Botão “Registro blockchain (API)” está presente, mas desabilitado (em breve).
- Player:
  - Reproduz a faixa, carrega e sincroniza stems, permite mutar/ajustar volume por stem e minimizar o player (o estado é lembrado).
- Rodapé (WhatsApp):
  - O botão abre uma conversa no WhatsApp com o número configurado no backend.

8) Solução de problemas (FAQ curto)
- “Permissão negada” ao executar start.sh (macOS/Linux):
  - Rode `chmod +x start.sh` e tente de novo com `./start.sh`.
- “Comando não encontrado: pm2/ng”:
  - O start.sh instala automaticamente; feche e reabra o terminal e execute novamente.
- Portas ocupadas (4200 ou 3100):
  - Feche outras janelas que estejam rodando o projeto e tente novamente.
  - Backend com PM2: `pm2 stop mok-backend && pm2 delete mok-backend` (apenas se o script não encerrou).
- Windows sem WSL:
  - Opção 1: Use o “Git Bash” para rodar `bash start.sh`.
  - Opção 2 (recomendado): use `start.bat` (CMD) ou `start.ps1` (PowerShell), conforme explicado em 4.1.

9) Como atualizar ou reinstalar
- Se houver mudanças no projeto, basta repetir o processo:
  - `./start.sh` (ele atualizará dependências se necessário).
- Para reinstalar dependências manualmente:
  - Na raiz: `rm -rf node_modules && npm install`
  - No backend: `cd server && rm -rf node_modules && npm install && cd ..`

10) Sobre o backend (para referência)
- Endpoints principais:
  - `GET /api/genres-full` (aceita `?q=...` para filtrar — gênero → subgêneros)
  - `GET /api/tracks/latest-unique-by-producer?limit=N` (sem repetir produtor, ordenado por data)
  - `GET /api/tracks/:id/stems` (stems da música)
  - `POST /api/producers/track` (upload com validações — ISRC, UPC, HASH, loops, stems)
  - `POST /api/auth/login` (stub para login de teste)
  - `GET /api/config` (número de WhatsApp)

Precisa de ajuda?
- Se algo não funcionar, tire um print do erro e compartilhe com a equipe. Este guia foi pensado para evitar etapas técnicas, mas estamos por perto para ajudar.
