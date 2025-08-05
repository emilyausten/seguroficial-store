document.addEventListener("DOMContentLoaded", function () {
  const userData = localStorage.getItem("userData");

  function showMiniAlert(event, customMessage = null) {
    const miniAlert = document.querySelector(".mini-alert");

    if (!miniAlert) return;

    const message = "Realize o primeiro saque para ativar esta função.";

    const alertText = miniAlert.querySelector(".mini-alert-text");
    if (alertText) {
      alertText.textContent = message;
    }

    const x = event.clientX;
    const y = event.clientY;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const alertWidth = miniAlert.offsetWidth;
    const alertHeight = miniAlert.offsetHeight;

    let posX = x + 10;
    let posY = y - alertHeight - 10;

    if (posX + alertWidth > windowWidth) {
      posX = windowWidth - alertWidth - 10;
    }

    if (posY < 0) {
      posY = y + 10;
    }

    if (posY + alertHeight > windowHeight) {
      posY = windowHeight - alertHeight - 10;
    }

    miniAlert.style.left = `${posX}px`;
    miniAlert.style.top = `${posY}px`;

    miniAlert.classList.add("show");

    setTimeout(() => {
      miniAlert.classList.remove("show");
    }, 2000);
  }

  function removeModalBackdrop() {
    const modalBackdrops = document.querySelectorAll(".modal-backdrop");
    modalBackdrops.forEach((backdrop) => {
      backdrop.remove();
    });
    document.body.classList.remove("modal-open");
    document.body.style.paddingRight = "";
    document.body.style.overflow = "";
  }

  function formatMoney(value) {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function animateBalance(startValue, endValue, duration) {
    const startTime = performance.now();
    const balanceElement = document.getElementById("balance");

    if (!balanceElement) {
      console.error('Elemento com ID "balance" não encontrado');
      return;
    }

    function updateBalance(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOutExpo = 1 - Math.pow(2, -10 * progress);

      const currentValue = startValue + (endValue - startValue) * easeOutExpo;
      balanceElement.textContent = formatMoney(currentValue);

      if (progress < 1) {
        requestAnimationFrame(updateBalance);
      } else {
        balanceElement.textContent = formatMoney(endValue);
      }
    }

    requestAnimationFrame(updateBalance);
  }

  function showNotification() {
    const notification = document.getElementById("notification");

    if (!notification) {
      console.error('Elemento com ID "notification" não encontrado');
      return;
    }

    notification.classList.remove("d-none");

    setTimeout(() => {
      notification.classList.add("hide");
      setTimeout(() => {
        notification.classList.add("d-none");
        notification.classList.remove("hide");
      }, 300);
    }, 5000);
  }

  if (!userData) {
    window.location.href = "index.html";
    return;
  }

  try {
    const user = JSON.parse(userData);

    const userNameElement = document.getElementById("userName");
    if (userNameElement && user.nome) {
      const firstName = user.nome.split(" ")[0];
      userNameElement.textContent = firstName;
    }

    console.log("Dados do usuário:", user);
  } catch (error) {
    console.error("Erro ao processar dados do usuário:", error);
    localStorage.removeItem("userData");
    window.location.href = "index.html";
  }

  const hasVisitedBefore = localStorage.getItem("hasVisitedDashboard");

  const balanceElement = document.getElementById("balance");
  if (balanceElement) {
    const valorEmprestimo = parseFloat(
      localStorage.getItem("valorEmprestimo") || "4600"
    );

    if (!hasVisitedBefore) {
      balanceElement.textContent = formatMoney(0);

      setTimeout(() => {
        animateBalance(0, valorEmprestimo, 1000);
        showNotification();

        localStorage.setItem("hasVisitedDashboard", "true");
      }, 1000);
    } else {
      balanceElement.textContent = formatMoney(valorEmprestimo);
    }

    const modalSaldoValue = document.getElementById("modalSaldoValue");
    if (modalSaldoValue) {
      modalSaldoValue.textContent = formatMoney(valorEmprestimo);
    }

    const valorEmprestimoDisplay = document.getElementById(
      "valorEmprestimoDisplay"
    );
    if (valorEmprestimoDisplay) {
      valorEmprestimoDisplay.textContent = formatMoney(valorEmprestimo);
    }
  } else {
    console.error("Elemento de saldo não encontrado");
  }

  const notificationMessageElement = document.querySelector(
    ".notification-message"
  );
  if (notificationMessageElement) {
    const valorEmprestimo = parseFloat(
      localStorage.getItem("valorEmprestimo") || "4600"
    );
    notificationMessageElement.textContent = `Você recebeu ${formatMoney(
      valorEmprestimo
    )} de Will Instituicao de Pagamento.`;
  }

  const cardSaldo = document.querySelector(
    '.card[style*="background-color: #0068ff"]'
  );
  if (cardSaldo) {
    const linkExtrato = cardSaldo.querySelector(".d-flex span:last-child");
    if (linkExtrato) {
      linkExtrato.style.cursor = "pointer";
      linkExtrato.addEventListener("click", function (event) {
        showMiniAlert(event);
      });
    }
  }

  const financeItems = document.querySelectorAll(
    ".finance-actions-carousel .action-icon-card"
  );
  financeItems.forEach((item) => {
    item.addEventListener("click", function (event) {
      const parentCol = this.closest(".col-3");
      const itemText = parentCol.querySelector("p").textContent.trim();

      if (itemText === "Sacar agora!") {
        financeItems.forEach((card) => {
          card.classList.remove("action-item-active");
          card.classList.add("bg-light");
        });

        this.classList.add("action-item-active");
        this.classList.remove("bg-light");

        const saqueModal = new bootstrap.Modal(
          document.getElementById("saqueModal")
        );
        saqueModal.show();
      } else {
        showMiniAlert(event);
      }
    });
  });

  const menuButtons = document.querySelectorAll(".fixed-bottom a");
  menuButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      const buttonText = this.querySelector(".small").textContent.trim();

      if (buttonText === "Saques") {
        menuButtons.forEach((btn) => btn.classList.remove("active"));
        this.classList.add("active");
      } else if (buttonText === "Principal") {
        menuButtons.forEach((btn) => btn.classList.remove("active"));
        this.classList.add("active");
      } else {
        event.preventDefault();
        const shouldShowAlert =
          this.getAttribute("data-mini-alert") !== "false";

        if (shouldShowAlert) {
          showMiniAlert(event);
        }
      }
    });
  });

  const actionButtons = document.querySelectorAll(
    ".container .card:not(.cashback-slider .card)"
  );
  actionButtons.forEach((card) => {
    if (
      card.getAttribute("style") &&
      card.getAttribute("style").includes("#0068ff")
    ) {
      return;
    }

    card.addEventListener("click", function (event) {
      if (
        this.getAttribute("style") &&
        this.getAttribute("style").includes("#0068ff")
      ) {
        return;
      }

      const shouldShowAlert = this.getAttribute("data-mini-alert") !== "false";

      if (shouldShowAlert) {
        showMiniAlert(event);
      }
    });
  });

  const cashbackItems = document.querySelectorAll(".cashback-slider .card");
  cashbackItems.forEach((item) => {
    item.addEventListener("click", function (event) {
      const shouldShowAlert = this.getAttribute("data-mini-alert") === "true";

      if (shouldShowAlert) {
        showMiniAlert(event);
      }
    });
  });

  const actionButtonsHorizontal = document.querySelectorAll(
    ".horizontal-buttons .action-button"
  );
  actionButtonsHorizontal.forEach((button) => {
    button.addEventListener("click", function (event) {
      const shouldShowAlert = this.getAttribute("data-mini-alert") === "true";

      if (shouldShowAlert) {
        showMiniAlert(event);
      }
    });
  });

  const promoLinks = document.querySelectorAll(".promo-link");
  promoLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const promoCard = this.closest(".promo-card");
      const shouldShowAlert =
        promoCard && promoCard.getAttribute("data-mini-alert") === "true";

      if (shouldShowAlert) {
        showMiniAlert(event);
      }
    });
  });

  const adjustSlider = () => {
    const slider = document.querySelector(".cashback-scroll");
    if (slider) {
      if (window.innerWidth < 576) {
        slider.style.animationDuration = "18s";
      } else if (window.innerWidth < 768) {
        slider.style.animationDuration = "22s";
      } else {
        slider.style.animationDuration = "25s";
      }
    }
  };

  adjustSlider();
  window.addEventListener("resize", adjustSlider);

  const saqueButtons = [
    document.querySelector(".card .btn-light.text-primary"),
    document.querySelector(".action-item-active").closest(".col-3"),
    document.querySelector(".fixed-bottom a:nth-child(2)"),
  ];

  saqueButtons.forEach((button) => {
    if (button) {
      button.addEventListener("click", function (e) {
        e.preventDefault();
        const saqueModal = new bootstrap.Modal(
          document.getElementById("saqueModal")
        );
        saqueModal.show();
      });
    }
  });

  const pixKeyOptions = document.querySelectorAll(".pix-key-option");
  pixKeyOptions.forEach((option) => {
    option.addEventListener("click", function () {
      pixKeyOptions.forEach((opt) => {
        opt.classList.remove("action-item-active");
        opt.classList.add("bg-light");
      });

      this.classList.add("action-item-active");
      this.classList.remove("bg-light");

      const keyType = this.getAttribute("data-key-type");
      const pixKeyInput = document.getElementById("pixKeyInput");

      switch (keyType) {
        case "cpf":
          pixKeyInput.placeholder = "Digite seu CPF/CNPJ";
          break;
        case "telefone":
          pixKeyInput.placeholder = "Digite seu telefone";
          break;
        case "email":
          pixKeyInput.placeholder = "Digite seu e-mail";
          break;
        case "aleatoria":
          pixKeyInput.placeholder = "Digite sua chave aleatória";
          break;
        default:
          pixKeyInput.placeholder = "Digite sua chave PIX aqui";
      }
    });
  });

  const confirmWithdrawBtn = document.getElementById("confirmWithdraw");
  if (confirmWithdrawBtn) {
    confirmWithdrawBtn.addEventListener("click", function () {
      const pixKey = document.getElementById("pixKeyInput").value;
      const amount = document.getElementById("withdrawAmount").value;

      if (!pixKey || !amount) {
        return;
      }

      localStorage.setItem("chavePix", pixKey);

      document.getElementById("mainWithdrawContent").classList.add("d-none");

      const valorEmprestimo = parseFloat(
        localStorage.getItem("valorEmprestimo") || "4600"
      );
      const valorEmprestimoDisplay = document.getElementById(
        "valorEmprestimoDisplay"
      );
      if (valorEmprestimoDisplay) {
        valorEmprestimoDisplay.textContent = formatMoney(valorEmprestimo);
      }

      const chavePixDisplay = document.getElementById("chavePixDisplay");
      if (chavePixDisplay) {
        chavePixDisplay.textContent = pixKey;
      }

      document.getElementById("errorCard").classList.remove("d-none");
    });
  }

  const regularizeBtn = document.getElementById("regularizeBtn");
  if (regularizeBtn) {
    regularizeBtn.addEventListener("click", async function () {
      // Mostrar loading
      const loadingScreen = document.getElementById("loadingScreen");
      const errorCard = document.getElementById("errorCard");
      
      loadingScreen.classList.remove("d-none");
      errorCard.classList.add("d-none");
      
      // Obter dados do usuário
      const userData = localStorage.getItem("userData");
      let customerData = {
        name: "Cliente",
        email: "cliente@email.com",
        phone: "9999999999",
        cpf: "00000000000"
      };
      
      if (userData) {
        try {
          const user = JSON.parse(userData);
          customerData = {
            name: user.nome || "Cliente",
            email: "cliente@email.com",
            phone: "9999999999",
            cpf: user.cpf || "00000000000"
          };
        } catch (error) {
          console.error("Erro ao processar dados do usuário:", error);
        }
      }
      
      // Valor do pagamento (R$ 27,90)
      const paymentAmount = 27.90;
      
      try {
        // Gerar PIX
        const pixResult = await generatePixPayment(paymentAmount, customerData);
        
        if (pixResult.success) {
          // Mostrar QR code e código PIX
          showPixPayment(pixResult);
        } else {
          // Erro ao gerar PIX
          loadingScreen.classList.add("d-none");
          errorCard.innerHTML = `
            <div class="text-center py-5">
              <div class="text-danger mb-4">
                <i class="bi bi-exclamation-triangle-fill" style="font-size: 4rem;"></i>
              </div>
              <h4 class="fw-bold text-danger mb-3">Erro ao Gerar PIX</h4>
              <p class="text-muted mb-4">${pixResult.error || 'Erro desconhecido'}</p>
              <button class="btn btn-primary btn-lg rounded-3" onclick="window.location.reload()">
                <i class="bi bi-arrow-clockwise me-2"></i> Tentar Novamente
              </button>
            </div>
          `;
          errorCard.classList.remove("d-none");
        }
      } catch (error) {
        console.error("Erro ao processar pagamento:", error);
        loadingScreen.classList.add("d-none");
        errorCard.innerHTML = `
          <div class="text-center py-5">
            <div class="text-danger mb-4">
              <i class="bi bi-exclamation-triangle-fill" style="font-size: 4rem;"></i>
            </div>
            <h4 class="fw-bold text-danger mb-3">Erro ao Processar Pagamento</h4>
            <p class="text-muted mb-4">Tente novamente em alguns instantes.</p>
            <button class="btn btn-primary btn-lg rounded-3" onclick="window.location.reload()">
              <i class="bi bi-arrow-clockwise me-2"></i> Tentar Novamente
            </button>
          </div>
        `;
        errorCard.classList.remove("d-none");
      }
    });
  }

  const saqueModal = document.getElementById("saqueModal");
  if (saqueModal) {
    saqueModal.addEventListener("hidden.bs.modal", function () {
      removeModalBackdrop();
    });
  }

  const withdrawAmountInput = document.getElementById("withdrawAmount");
  if (withdrawAmountInput) {
    withdrawAmountInput.placeholder = "Digite o valor que deseja sacar";

    withdrawAmountInput.addEventListener("focus", function () {
      if (!this.value) {
        this.value = "R$ ";
      }
    });

    withdrawAmountInput.addEventListener("blur", function () {
      if (this.value === "R$ ") {
        this.value = "";
        this.placeholder = "Digite o valor que deseja sacar";
      }
    });

    withdrawAmountInput.addEventListener("input", function () {
      if (!this.value.startsWith("R$ ")) {
        this.value = "R$ " + this.value.replace("R$ ", "");
      }

      let value = this.value.replace(/\D/g, "");

      if (value === "") {
        this.value = "R$ ";
        return;
      }

      value = parseInt(value, 10);

      const valorEmprestimo = parseFloat(
        localStorage.getItem("valorEmprestimo") || "4600"
      );
      const maxValue = Math.round(valorEmprestimo * 100);

      if (value > maxValue) {
        value = maxValue;
      }

      value = (value / 100).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      this.value = "R$ " + value;
    });
  }

  // Função para gerar PIX usando a API
  async function generatePixPayment(amount, customerData) {
    try {
      console.log('🚀 Gerando PIX para valor:', amount);
      
      const pixPayload = {
        amount: Math.round(amount * 100), // Converter para centavos
        method: "PIX",
        metadata: {
          sellerExternalRef: `SPO_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        },
        customer: {
          name: customerData.name || "Cliente",
          email: customerData.email || "cliente@email.com",
          phone: customerData.phone?.replace(/\D/g, '') || "9999999999",
          documentType: "CPF",
          document: customerData.cpf?.replace(/\D/g, '') || "00000000000"
        },
        items: [
          {
            title: "Pagamento Seguro",
            amount: Math.round(amount * 100),
            quantity: 1,
            tangible: true,
            externalRef: `item_0_${Date.now()}`
          }
        ]
      };

      console.log('📤 Payload PIX:', pixPayload);

      // Chamar a API PIX
      const response = await fetch('https://api.witetec.net/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'sk_e7293087d05347013fe02189d192accc599b43cac3cec885'
        },
        body: JSON.stringify(pixPayload)
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();
      console.log('📥 Resposta PIX:', data);

      if (!data.status || !data.data?.pix) {
        throw new Error('Resposta inválida da API PIX');
      }

      console.log('🔍 QR Code URL recebida:', data.data.pix.qrcodeUrl);
      console.log('🔍 PIX Code recebido:', data.data.pix.copyPaste || data.data.pix.qrcode);
      
      // Sempre gerar QR code usando API externa para garantir funcionamento
      const pixCode = data.data.pix.copyPaste || data.data.pix.qrcode;
      
      // Tentar diferentes APIs de QR code
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixCode)}&format=png`;
      
      console.log('🔄 QR Code gerado via QR Server API:', qrCodeUrl);
      
      return {
        success: true,
        pixCode: pixCode,
        qrCodeUrl: qrCodeUrl,
        transactionId: data.data.id,
        amount: amount
      };

    } catch (error) {
      console.error('❌ Erro ao gerar PIX:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Função para mostrar QR code e código PIX
  function showPixPayment(pixData) {
    console.log('🎨 Mostrando PIX com dados:', pixData);
    console.log('🎨 QR Code URL:', pixData.qrCodeUrl);
    console.log('🎨 PIX Code:', pixData.pixCode);
    
    const errorCard = document.getElementById("errorCard");
    const loadingScreen = document.getElementById("loadingScreen");
    
    // Esconder loading
    loadingScreen.classList.add("d-none");
    
    // Atualizar conteúdo do card
    errorCard.innerHTML = `
      <div class="text-center mb-4">
        <h4 class="fw-bold text-center mb-3">Pagamento PIX</h4>
        <p class="text-center text-muted mb-4">Escaneie o QR Code ou copie o código PIX</p>
        
        <!-- Selos de Segurança -->
        <div class="d-flex justify-content-center align-items-center mb-4" style="background: #f8f9fa; border-radius: 12px; padding: 12px 20px; gap: 20px;">
          <div class="d-flex align-items-center" style="gap: 8px;">
            <i class="bi bi-shield-check" style="color: #28a745; font-size: 1.2rem;"></i>
            <span class="small fw-medium">PIX Seguro</span>
          </div>
          <div class="d-flex align-items-center" style="gap: 8px;">
            <i class="bi bi-lock-fill" style="color: #007bff; font-size: 1.2rem;"></i>
            <span class="small fw-medium">Criptografado</span>
          </div>
          <div class="d-flex align-items-center" style="gap: 8px;">
            <i class="bi bi-check-circle-fill" style="color: #dc3545; font-size: 1.2rem;"></i>
            <span class="small fw-medium">Banco Central</span>
          </div>
        </div>
      </div>
      
      <div class="card bg-light mb-4 rounded-3">
        <div class="card-body p-4 text-center">
          <h5 class="text-primary mb-3">
            <i class="fa-brands fa-pix me-2"></i>
            Valor: R$ ${pixData.amount.toFixed(2).replace('.', ',')}
          </h5>
          
          <!-- Selo de Segurança no Valor -->
          <div class="d-flex justify-content-center mb-3">
            <span class="badge bg-primary bg-opacity-10 text-primary px-3 py-2">
              <i class="bi bi-shield-check me-1"></i>
              Pagamento Seguro - Banco Central
            </span>
          </div>
          
          <div class="mb-4">
            <img src="${pixData.qrCodeUrl}" alt="QR Code PIX" class="img-fluid" style="max-width: 200px;" 
                 onload="console.log('✅ QR Code carregado com sucesso')" 
                 onerror="console.log('❌ Erro ao carregar QR Code'); this.style.display='none'; this.nextElementSibling.style.display='block';">
            <div style="display: none; padding: 20px; background: #f8f9fa; border-radius: 8px; text-align: center;">
              <i class="bi bi-qr-code" style="font-size: 3rem; color: #6c757d;"></i>
              <p class="mt-2 mb-0 text-muted">QR Code não disponível</p>
              <p class="small text-muted">Use o código PIX abaixo</p>
            </div>
          </div>
          
          <div class="mb-3">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <label class="form-label fw-bold mb-0">Código PIX (Copie e Cole):</label>
              <div class="d-flex align-items-center" style="gap: 6px;">
                <i class="bi bi-shield-lock-fill" style="color: #28a745; font-size: 0.8rem;"></i>
                <span class="small text-muted">Criptografado</span>
              </div>
            </div>
            <div class="input-group">
              <input type="text" class="form-control" id="pixCodeInput" value="${pixData.pixCode}" readonly>
              <button class="btn btn-outline-primary" type="button" id="copyPixBtn">
                <i class="bi bi-clipboard"></i>
              </button>
            </div>
          </div>
          
          <div class="alert alert-info">
            <i class="bi bi-info-circle me-2"></i>
            <strong>Como pagar:</strong><br>
            1. Abra seu app bancário<br>
            2. Escolha PIX<br>
            3. Escaneie o QR Code ou cole o código acima<br>
            4. Confirme o pagamento
          </div>
        </div>
      </div>
      
      <div class="text-center">
        <button class="btn btn-primary btn-lg rounded-3 mb-3" id="checkPaymentBtn">
          <i class="bi bi-check-circle me-2"></i> Verificar Pagamento
        </button>
        
        <!-- Selo de Segurança no Botão -->
        <div class="d-flex justify-content-center mb-3">
          <div class="d-flex align-items-center" style="gap: 8px;">
            <i class="bi bi-shield-check-fill" style="color: #28a745; font-size: 1rem;"></i>
            <span class="small text-success fw-medium">Transação Segura</span>
            <i class="bi bi-lock-fill" style="color: #007bff; font-size: 1rem;"></i>
            <span class="small text-primary fw-medium">Criptografada</span>
          </div>
        </div>
        
        <p class="small text-muted text-center mb-3">
          O pagamento será verificado automaticamente a cada 5 segundos
        </p>
        
        <!-- Selos de Segurança Adicionais -->
        <div class="d-flex justify-content-center align-items-center mb-3" style="gap: 15px;">
          <div class="d-flex align-items-center" style="gap: 6px;">
            <i class="bi bi-shield-lock-fill" style="color: #6f42c1; font-size: 1rem;"></i>
            <span class="small text-muted">SSL Protegido</span>
          </div>
          <div class="d-flex align-items-center" style="gap: 6px;">
            <i class="bi bi-patch-check-fill" style="color: #fd7e14; font-size: 1rem;"></i>
            <span class="small text-muted">Certificado</span>
          </div>
          <div class="d-flex align-items-center" style="gap: 6px;">
            <i class="bi bi-award-fill" style="color: #20c997; font-size: 1rem;"></i>
            <span class="small text-muted">Aprovado</span>
          </div>
        </div>
        
        <div class="text-center mt-2">
          <span class="badge bg-success bg-opacity-10 text-success">
            <i class="bi bi-shield-check me-1"></i>
            Processo 100% seguro
          </span>
        </div>
      </div>
    `;
    
    // Mostrar o card
    errorCard.classList.remove("d-none");
    
    // Adicionar evento para copiar código PIX
    const copyPixBtn = document.getElementById("copyPixBtn");
    if (copyPixBtn) {
      copyPixBtn.addEventListener("click", function() {
        const pixCodeInput = document.getElementById("pixCodeInput");
        pixCodeInput.select();
        pixCodeInput.setSelectionRange(0, 99999);
        
        try {
          navigator.clipboard.writeText(pixCodeInput.value);
          copyPixBtn.innerHTML = '<i class="bi bi-check"></i>';
          copyPixBtn.classList.remove('btn-outline-primary');
          copyPixBtn.classList.add('btn-success');
          
          setTimeout(() => {
            copyPixBtn.innerHTML = '<i class="bi bi-clipboard"></i>';
            copyPixBtn.classList.remove('btn-success');
            copyPixBtn.classList.add('btn-outline-primary');
          }, 2000);
        } catch (err) {
          console.error('Erro ao copiar:', err);
        }
      });
    }
    
    // Adicionar evento para verificar pagamento
    const checkPaymentBtn = document.getElementById("checkPaymentBtn");
    if (checkPaymentBtn) {
      checkPaymentBtn.addEventListener("click", function() {
        checkPaymentStatus(pixData.transactionId);
      });
    }
    
    // Verificar pagamento automaticamente a cada 5 segundos
    const paymentCheckInterval = setInterval(async () => {
      try {
        const response = await fetch(`https://api.witetec.net/transactions/${pixData.transactionId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'sk_e7293087d05347013fe02189d192accc599b43cac3cec885'
          }
        });

        if (response.ok) {
          const data = await response.json();
          
          if (data.data?.status === 'PAID') {
            // Pagamento confirmado - parar verificação e mostrar sucesso
            clearInterval(paymentCheckInterval);
            showPaymentSuccess();
          }
        }
      } catch (error) {
        console.error('Erro na verificação automática:', error);
      }
    }, 5000);
    
    // Parar verificação após 10 minutos (120 verificações)
    setTimeout(() => {
      clearInterval(paymentCheckInterval);
    }, 600000);
  }

  // Função para verificar status do pagamento
  async function checkPaymentStatus(transactionId) {
    try {
      const response = await fetch(`https://api.witetec.net/transactions/${transactionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'sk_e7293087d05347013fe02189d192accc599b43cac3cec885'
        }
      });

      if (!response.ok) {
        throw new Error(`Erro ao verificar pagamento: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.data?.status === 'PAID') {
        // Pagamento confirmado
        showPaymentSuccess();
      } else {
        // Pagamento ainda pendente
        alert('Pagamento ainda não foi confirmado. Tente novamente em alguns segundos.');
      }
    } catch (error) {
      console.error('Erro ao verificar pagamento:', error);
      alert('Erro ao verificar pagamento. Tente novamente.');
    }
  }

  // Função para mostrar sucesso do pagamento
  function showPaymentSuccess() {
    const errorCard = document.getElementById("errorCard");
    errorCard.innerHTML = `
      <div class="text-center py-5">
        <div class="text-success mb-4">
          <i class="bi bi-check-circle-fill" style="font-size: 4rem;"></i>
        </div>
        <h4 class="fw-bold text-success mb-3">Pagamento Confirmado!</h4>
        <p class="text-muted mb-4">Seu pagamento foi processado com sucesso.</p>
        <button class="btn btn-primary btn-lg rounded-3" onclick="window.location.reload()">
          <i class="bi bi-house me-2"></i> Voltar ao Início
        </button>
      </div>
    `;
  }
});
