# Configuração da API para Dados do Usuário

Este documento explica como configurar as APIs para buscar dados reais do usuário no aplicativo.

## Arquivo de Configuração

O arquivo `js/api-config.js` contém a configuração das APIs que serão usadas para buscar dados do usuário.

## Como Configurar

### 1. Editar o arquivo `js/api-config.js`

Substitua as URLs de exemplo pelas URLs reais das suas APIs:

```javascript
const API_CONFIG = {
  apis: [
    {
      name: "API Principal",
      url: "https://sua-api-principal.com/usuario/{cpf}",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer SEU_TOKEN_AQUI'
      },
      timeout: 5000,
      dataMapping: {
        nome: 'nome',
        nome_mae: 'nome_mae'
      }
    }
  ]
};
```

### 2. Configurar Headers de Autenticação

Se sua API requer autenticação, adicione os headers necessários:

```javascript
headers: {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer SEU_TOKEN_AQUI',
  'X-API-Key': 'SUA_CHAVE_API'
}
```

### 3. Mapear Campos da Resposta

Configure o mapeamento dos campos da resposta da API:

```javascript
dataMapping: {
  nome: 'nome_completo',        // Campo na API que contém o nome
  nome_mae: 'nome_da_mae'       // Campo na API que contém o nome da mãe
}
```

## Estrutura da Resposta da API

A API deve retornar um JSON com pelo menos um dos seguintes campos:

```json
{
  "nome": "João Silva",
  "nome_completo": "João Silva Santos",
  "nome_mae": "Maria Silva",
  "mae": "Maria Silva Santos"
}
```

## Múltiplas APIs

Você pode configurar múltiplas APIs para redundância. O sistema tentará cada API em ordem até encontrar uma que funcione:

```javascript
apis: [
  {
    name: "API Principal",
    url: "https://api1.com/usuario/{cpf}",
    // ... configuração
  },
  {
    name: "API Secundária", 
    url: "https://api2.com/consulta/{cpf}",
    // ... configuração
  }
]
```

## Fallback

Se nenhuma API funcionar, o sistema usará os dados padrão definidos em:

```javascript
fallbackData: {
  nome: "Usuário",
  nome_mae: "Mãe"
}
```

## Exemplo de API Simples

Para uma API que retorna dados no formato padrão:

```javascript
{
  name: "API Simples",
  url: "https://api.exemplo.com/cpf/{cpf}",
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 5000,
  dataMapping: {
    nome: 'nome',
    nome_mae: 'nome_mae'
  }
}
```

## Testando a Configuração

1. Configure as URLs das APIs no arquivo `js/api-config.js`
2. Abra o aplicativo no navegador
3. Digite um CPF válido
4. Verifique se o nome do usuário aparece corretamente no dashboard

## Logs de Debug

Para debugar problemas com as APIs, abra o console do navegador (F12) e verifique os logs que mostram:
- Tentativas de conexão com cada API
- Erros específicos de cada API
- Dados recebidos das APIs

## Segurança

- Nunca exponha tokens de API no código frontend em produção
- Use HTTPS para todas as chamadas de API
- Considere implementar rate limiting nas APIs
- Valide sempre os dados recebidos das APIs 