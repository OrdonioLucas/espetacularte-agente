# Agente Espetacularte 🎭

Chatbot de atendimento ao cliente da Espetacularte, usando Gemini (gratuito) + Vercel (gratuito).

## Como publicar (passo a passo)

### ETAPA 1 — Subir o código no GitHub

1. Acesse **github.com** e faça login
2. Clique no botão **"+"** no canto superior direito → **"New repository"**
3. Nome do repositório: `espetacularte-agente`
4. Deixe como **Public**
5. Clique em **"Create repository"**
6. Na próxima tela, clique em **"uploading an existing file"**
7. Arraste os arquivos desta pasta para a área de upload
8. Clique em **"Commit changes"**

### ETAPA 2 — Publicar no Vercel

1. Acesse **vercel.com** e faça login com GitHub
2. Clique em **"Add New Project"**
3. Selecione o repositório `espetacularte-agente`
4. Clique em **"Deploy"** — aguarde ~1 minuto

### ETAPA 3 — Adicionar a chave do Gemini

1. No painel do Vercel, vá em **Settings → Environment Variables**
2. Clique em **"Add New"**
3. Name: `GEMINI_API_KEY`
4. Value: (cole sua chave aqui)
5. Clique em **"Save"**
6. Vá em **Deployments → clique nos 3 pontinhos → Redeploy**

### Pronto! 🎉

Seu link público estará disponível no formato:
`https://espetacularte-agente.vercel.app`

Compartilhe com qualquer pessoa!
