# Consertar persistência das atualizações

## Diagnóstico

O HTML já tem Firebase Firestore configurado (`sj-quakes-draft`) e chama `fbSaveSoon()` em todas as ações. As escritas não persistem por dois motivos prováveis:

1. **Regras do Firestore** estão em modo "locked" (padrão), bloqueando leitura/escrita sem autenticação.
2. **Iframe `srcdoc`** roda em origem `null`, e os erros do Firebase não aparecem no console do app pai — falhas estão acontecendo silenciosamente.

## Plano

### 1. Verificar o motivo real
- Abrir o app e ler o console **de dentro do iframe** via `browser--read_console_logs` para confirmar a mensagem de erro do Firebase (`permission-denied`, `unavailable`, etc.).

### 2. Corrigir as regras do Firestore (ação do usuário)
Como as regras vivem no Console do Firebase (fora do código), vou pedir ao usuário para colar estas regras em `Firestore Database → Rules`:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /draft/state {
      allow read, write: if true;
    }
  }
}
```

Isso libera apenas o documento `draft/state` (sem expor outras coleções). Aceitável aqui porque a "API key" do Firebase já é pública e o app não tem login.

### 3. Reforço no código (em `src/original-index.html`)
- Tornar erros do Firebase visíveis: já existe `alert` em `fbSave`, mas garantir que erros de **carregamento inicial** (`onSnapshot`/`get`) também sejam logados/alertados de forma clara.
- Adicionar **fallback localStorage**: a cada `fbSave` bem-sucedido ou falho, salvar também uma cópia em `localStorage['sj_quakes_state']`. No boot, se o Firebase falhar ou demorar, aplicar o estado do localStorage para o usuário ver as últimas alterações dele.
- Garantir que o boot espere o `applyFbState` antes de assumir estado vazio (evita "salvar por cima" com estado limpo se a leitura inicial falhar).

### 4. Validar
- Recarregar, fazer uma alteração num card, recarregar de novo e confirmar que persiste.
- Abrir em outro navegador para confirmar sincronização via Firebase.

## Detalhes técnicos

Arquivo único alterado: `src/original-index.html` (bloco `═══ FIREBASE ═══`, ~linhas 358–460, e o trecho que chama `applyFbState` no boot).

Nenhuma mudança em rotas, build ou outros arquivos. Não é necessário ativar Lovable Cloud já que vamos manter o Firebase existente.
