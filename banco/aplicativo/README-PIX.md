# Funcionalidade PIX - Dashboard Bancário

## 📋 Resumo da Implementação

A funcionalidade PIX foi implementada para substituir o redirecionamento externo por uma experiência integrada no dashboard. Agora, ao invés de redirecionar para `https://go.paradisepagbr.com/0nr15kiyg2`, o sistema gera um PIX diretamente no modal e exibe o QR code e código copia e cola.

## 🔧 Configuração da API

### API Witetec PIX
- **URL Base**: `https://api.witetec.net/transactions`
- **API Key**: `sk_e7293087d05347013fe02189d192accc599b43cac3cec885`
- **Método**: POST para criar transação, GET para verificar status

### Headers Necessários
```javascript
{
  'Content-Type': 'application/json',
  'x-api-key': 'sk_e7293087d05347013fe02189d192accc599b43cac3cec885'
}
```

## 🚀 Fluxo de Funcionamento

### 1. Geração do PIX
Quando o usuário clica em "Gerar PIX":

1. **Coleta de Dados**: O sistema coleta os dados do usuário do localStorage
2. **Preparação do Payload**: Cria o payload para a API Witetec
3. **Chamada da API**: Envia requisição para gerar o PIX
4. **Processamento da Resposta**: Extrai QR code e código PIX

### 2. Exibição do PIX
Após gerar o PIX com sucesso:

1. **QR Code**: Exibe a imagem do QR code gerada pela API
2. **Código Copia e Cola**: Mostra o código PIX em um campo de texto
3. **Botão de Copiar**: Permite copiar o código com um clique
4. **Instruções**: Exibe passo a passo de como pagar

### 3. Verificação Automática
O sistema verifica automaticamente o status do pagamento:

1. **Intervalo**: A cada 5 segundos
2. **Duração**: Por até 10 minutos
3. **Status**: Verifica se o pagamento foi confirmado
4. **Sucesso**: Mostra tela de confirmação quando pago

## 📁 Arquivos Modificados

### 1. `banco/aplicativo/dash/js/dashboard.js`
- Adicionada função `generatePixPayment()`
- Adicionada função `showPixPayment()`
- Adicionada função `checkPaymentStatus()`
- Adicionada função `showPaymentSuccess()`
- Modificado evento do botão "Gerar PIX"

### 2. `banco/aplicativo/dash/index.htm`
- Atualizado texto do botão de "Pagar agora" para "Gerar PIX"

## 🔄 Estrutura do Payload

### Payload Enviado para API
```javascript
{
  "amount": 2790, // Valor em centavos (R$ 27,90)
  "method": "PIX",
  "metadata": {
    "sellerExternalRef": "SPO_1753905762345_av0rrl8hj"
  },
  "customer": {
    "name": "Nome do Cliente",
    "email": "cliente@email.com",
    "phone": "9999999999",
    "documentType": "CPF",
    "document": "12345678901"
  },
  "items": [
    {
      "title": "Pagamento Seguro",
      "amount": 2790,
      "quantity": 1,
      "tangible": true,
      "externalRef": "item_0_1753905762345"
    }
  ]
}
```

### Resposta da API
```javascript
{
  "status": true,
  "data": {
    "id": "58973897-8a48-437e-9225-e327655e403f",
    "pix": {
      "qrcode": "00020101021226880014br.gov.bcb.pix...",
      "qrcodeUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
      "copyPaste": "00020101021226880014br.gov.bcb.pix...",
      "expirationDate": "2025-06-28T03:00:00.000Z"
    }
  }
}
```

## 🎨 Interface do Usuário

### Tela de PIX
- **QR Code**: Imagem centralizada, máximo 200px
- **Código PIX**: Campo de texto readonly com botão de copiar
- **Instruções**: Passo a passo de como pagar
- **Verificação**: Botão para verificar pagamento manualmente
- **Status**: Verificação automática a cada 5 segundos

### Tela de Sucesso
- **Ícone**: Check verde grande
- **Mensagem**: "Pagamento Confirmado!"
- **Botão**: "Voltar ao Início" que recarrega a página

### Tela de Erro
- **Ícone**: Triângulo de aviso vermelho
- **Mensagem**: Erro específico ou genérico
- **Botão**: "Tentar Novamente" que recarrega a página

## 🔒 Segurança

### Validações Implementadas
1. **CPF**: Validação de formato e comprimento
2. **Valor**: Mínimo de R$ 5,00 (500 centavos)
3. **Dados**: Fallback para dados padrão se não disponíveis
4. **API**: Tratamento de erros de conectividade

### Tratamento de Erros
- **Erro de API**: Mostra mensagem específica
- **Erro de Rede**: Mensagem genérica com opção de tentar novamente
- **Dados Inválidos**: Fallback para valores padrão
- **Timeout**: Para verificação automática após 10 minutos

## 📱 Funcionalidades

### Copiar Código PIX
- Seleciona automaticamente o código
- Copia para área de transferência
- Feedback visual (ícone muda para check)
- Volta ao estado original após 2 segundos

### Verificação Manual
- Botão "Verificar Pagamento"
- Consulta status na API
- Feedback imediato ao usuário
- Não interfere na verificação automática

### Verificação Automática
- Intervalo de 5 segundos
- Duração máxima de 10 minutos
- Para automaticamente quando pagamento confirmado
- Logs de erro no console para debug

## 🛠️ Manutenção

### Logs de Debug
O sistema gera logs detalhados no console:
- `🚀 Gerando PIX para valor: X`
- `📤 Payload PIX: {...}`
- `📥 Resposta PIX: {...}`
- `❌ Erro ao gerar PIX: ...`
- `Erro na verificação automática: ...`

### Monitoramento
- Verificar logs do console para debug
- Monitorar status das transações na API
- Verificar se QR codes estão sendo gerados corretamente
- Confirmar se verificação automática está funcionando

## 🔄 Próximos Passos

### Melhorias Sugeridas
1. **Webhook**: Implementar webhook para notificação instantânea
2. **Histórico**: Salvar transações no localStorage
3. **Valores Dinâmicos**: Permitir diferentes valores de pagamento
4. **Múltiplas APIs**: Implementar fallback para outras APIs PIX
5. **Analytics**: Adicionar tracking de conversão

### Configurações Avançadas
1. **Timeout**: Configurar tempo de verificação automática
2. **Intervalo**: Ajustar frequência de verificação
3. **Retry**: Implementar retry automático em caso de erro
4. **Cache**: Cachear QR codes para evitar regeneração 