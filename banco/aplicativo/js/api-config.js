// Configuração das APIs para consulta de dados do usuário
const API_CONFIG = {
  // URLs das APIs disponíveis (substitua pelas URLs reais)
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
    },
    {
      name: "API Secundária", 
      url: "https://sua-api-secundaria.com/consulta/{cpf}",
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 3000,
      dataMapping: {
        nome: 'nome_completo',
        nome_mae: 'mae'
      }
    }
  ],
  
  // Dados padrão em caso de falha
  fallbackData: {
    nome: "Usuário",
    nome_mae: "Mãe"
  }
};

// Função para substituir placeholders na URL
function formatApiUrl(url, cpf) {
  return url.replace('{cpf}', cpf);
}

// Função para mapear dados da resposta da API
function mapApiResponse(data, mapping) {
  return {
    nome: data[mapping.nome] || API_CONFIG.fallbackData.nome,
    nome_mae: data[mapping.nome_mae] || API_CONFIG.fallbackData.nome_mae
  };
} 