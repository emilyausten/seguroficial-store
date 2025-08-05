
document.addEventListener("DOMContentLoaded", function () {
  const cpfInput = document.getElementById("cpf");
  const btnLogin = document.getElementById("btnLogin");
  const loadingScreen = document.getElementById("loadingScreen");
  const loadingMessage = document.getElementById("loadingMessage");

  cpfInput.addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, "");

    value = value.slice(0, 11);

    if (value.length > 0) {
      value = value.replace(/^(\d{3})(\d)/, "$1.$2");
      if (value.length > 4) {
        value = value.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
        if (value.length > 8) {
          value = value.replace(
            /^(\d{3})\.(\d{3})\.(\d{3})(\d)/,
            "$1.$2.$3-$4"
          );
        }
      }
    }

    e.target.value = value;
  });

  const userData = localStorage.getItem("userData");
  if (userData) {
    const currentParams = window.location.search;
    const baseUrl = "./dash";
    const finalUrl = currentParams
      ? `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}${currentParams.slice(1)}`
      : baseUrl;

    window.location.href = finalUrl;
  }

  btnLogin.addEventListener("click", processLogin);
  cpfInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      processLogin();
    }
  });

  function processLogin() {
    const cpf = cpfInput.value.replace(/\D/g, "").trim();

    if (cpf.length < 5) {
      alert("Digite pelo menos 5 números no CPF.");
      return;
    }

    loadingScreen.classList.remove("d-none");

    consultarCPF(cpf);
  }

  function consultarCPF(cpf) {
    // Função para buscar dados do usuário usando configuração da API
    const buscarDadosUsuario = async (cpf) => {
      for (const apiConfig of API_CONFIG.apis) {
        try {
          const url = formatApiUrl(apiConfig.url, cpf);
          
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), apiConfig.timeout);
          
          const response = await fetch(url, {
            method: 'GET',
            headers: apiConfig.headers,
            signal: controller.signal
          });

          clearTimeout(timeoutId);

          if (response.ok) {
            const data = await response.json();
            
            // Verificar se a resposta contém dados válidos
            if (data && (data[apiConfig.dataMapping.nome] || data.nome || data.nome_completo)) {
              const mappedData = mapApiResponse(data, apiConfig.dataMapping);
              return {
                ...mappedData,
                cpf: cpf
              };
            }
          }
        } catch (error) {
          console.log(`Erro na API ${apiConfig.name}:`, error);
          continue; // Tentar próxima API
        }
      }

      // Se nenhuma API funcionar, retornar dados padrão
      return {
        nome: API_CONFIG.fallbackData.nome,
        nome_mae: API_CONFIG.fallbackData.nome_mae,
        cpf: cpf
      };
    };

    // Executar a busca de dados
    buscarDadosUsuario(cpf)
      .then(userData => {
        localStorage.setItem("userData", JSON.stringify(userData));
        loadingMessage.textContent = `Olá, ${userData.nome}!`;

        setTimeout(() => {
          const currentParams = window.location.search;
          const baseUrl = "./dash";
          const finalUrl = currentParams
            ? `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}${currentParams.slice(1)}`
            : baseUrl;

          window.location.href = finalUrl;
        }, 2000);
      })
      .catch(error => {
        console.error('Erro geral na busca de dados:', error);
        
        // Fallback final com dados padrão
        const fallbackData = {
          nome: API_CONFIG.fallbackData.nome,
          nome_mae: API_CONFIG.fallbackData.nome_mae,
          cpf: cpf
        };

        localStorage.setItem("userData", JSON.stringify(fallbackData));
        loadingMessage.textContent = `Olá, ${fallbackData.nome}!`;

        setTimeout(() => {
          const currentParams = window.location.search;
          const baseUrl = "./dash";
          const finalUrl = currentParams
            ? `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}${currentParams.slice(1)}`
            : baseUrl;

          window.location.href = finalUrl;
        }, 2000);
      });
  }

  const homeSlider = document.getElementById("homeCardSlider");
  if (homeSlider) {
    const carousel = new bootstrap.Carousel(homeSlider, {
      interval: 5000,
      ride: "carousel",
      pause: false,
      wrap: true,
      touch: true,
    });

    homeSlider.addEventListener("slide.bs.carousel", function (e) {
      const activeItem = this.querySelector(".carousel-item.active");
      const nextItem = e.relatedTarget;
      const direction = e.direction;

      if (direction === "left") {
        nextItem.style.animation = "slideInRight 0.8s forwards";
        activeItem.style.animation = "slideOutLeft 0.8s forwards";
      } else {
        nextItem.style.animation = "slideInRight 0.8s reverse forwards";
        activeItem.style.animation = "slideOutLeft 0.8s reverse forwards";
      }
    });

    const cards = homeSlider.querySelectorAll(".home-slider-card");
    cards.forEach((card) => {
      card.addEventListener("mouseenter", function () {
        this.style.transform = "scale(1.02)";
        this.style.boxShadow = "0 15px 30px rgba(0, 104, 255, 0.2)";
      });

      card.addEventListener("mouseleave", function () {
        const isActive =
          this.closest(".carousel-item").classList.contains("active");
        if (isActive) {
          this.style.transform = "scale(1)";
        } else {
          this.style.transform = "scale(0.9)";
        }
        this.style.boxShadow = isActive
          ? "0 12px 24px rgba(0, 104, 255, 0.15)"
          : "0 8px 20px rgba(0, 0, 0, 0.12)";
      });
    });

    const slideImages = homeSlider.querySelectorAll(".carousel-item img");
    slideImages.forEach((img) => {
      const imgSrc = img.getAttribute("src");
      if (imgSrc) {
        const preloadImg = new Image();
        preloadImg.src = imgSrc;
      }
    });
  }
});
