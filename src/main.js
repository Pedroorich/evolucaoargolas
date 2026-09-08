// ==========================================================================
// EVOLUÇÃO ARGOLAS - MOTOR DE INTERAÇÃO & COTAÇÃO COMERCIAL B2B
// ==========================================================================

import { initAnimatedGradient } from './animated-gradient.js';

document.addEventListener('DOMContentLoaded', () => {

  const OFFICIAL_WHATSAPP = '5511943884222';
  const BASE_CTA_TEXT = 'Ol%C3%A1%2C+gostaria+de+solicitar+um+or%C3%A7amento+de+argolas+no+atacado.';

  // 0. Initialize Spell-UI Animated Gradient WebGL2 Hero Effect
  const gradientContainer = document.getElementById('gradient-container');
  if (gradientContainer) {
    initAnimatedGradient(gradientContainer, {
      preset: "Prism",
      color1: "#2e221a",
      color2: "#3e2616",
      color3: "#ff7817",
      rotation: 45,
      speed: 25,
      swirl: 60,
    });
  }

  // 1. Navbar Dynamic Transparency on Scroll (Transparent over Hero -> Solid White on scroll)
  const navbar = document.getElementById('navbar');
  const heroSection = document.getElementById('hero');

  function handleNavbarScroll() {
    if (!navbar) return;
    const heroHeight = heroSection ? heroSection.offsetHeight - 80 : 400;
    if (window.scrollY > heroHeight) {
      navbar.classList.add('navbar-scrolled');
      navbar.classList.remove('navbar-transparent');
    } else {
      navbar.classList.add('navbar-transparent');
      navbar.classList.remove('navbar-scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  // 1.1 Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // 1.2 Smooth Scroll Reveal Effects for Sections & Cards
  const revealElements = document.querySelectorAll('[data-scroll-reveal], .product-card, .diff-card, .segment-card, .step-item, .faq-item, .quote-form-card');
  
  revealElements.forEach((el, idx) => {
    el.classList.add('reveal-item');
    if (!el.style.transitionDelay) {
      el.style.transitionDelay = `${(idx % 4) * 0.08}s`;
    }
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // 2. Interactive Volume & Price Estimator Calculator (Tabela Real Evolução Argolas)
  const volSelect = document.getElementById('vol-select');
  const price16 = document.getElementById('price-card-16');
  const badge16 = document.getElementById('badge-card-16');
  const price19 = document.getElementById('price-card-19');
  const badge19 = document.getElementById('badge-card-19');
  const price22 = document.getElementById('price-card-22');
  const badge22 = document.getElementById('badge-card-22');
  const price25 = document.getElementById('price-card-25');
  const badge25 = document.getElementById('badge-card-25');

  const priceTiers = {
    "100": {
      p16: "R$ 22,00 / mil",
      b16: "Lote Inicial (a partir 100 un)",
      p19: "R$ 27,00 / mil",
      b19: "Lote Inicial",
      p22: "R$ 38,00 / mil",
      b22: "Lote Inicial",
      p25: "R$ 48,00 / mil",
      b25: "Lote Inicial"
    },
    "5000": {
      p16: "R$ 20,90 / mil",
      b16: "5% OFF Atacado",
      p19: "R$ 25,60 / mil",
      b19: "5% OFF Atacado",
      p22: "R$ 36,10 / mil",
      b22: "5% OFF Atacado",
      p25: "R$ 45,60 / mil",
      b25: "5% OFF Atacado"
    },
    "10000": {
      p16: "R$ 19,80 / mil",
      b16: "10% OFF Escala",
      p19: "R$ 24,30 / mil",
      b19: "10% OFF Escala",
      p22: "R$ 34,20 / mil",
      b22: "10% OFF Escala",
      p25: "R$ 43,20 / mil",
      b25: "10% OFF Escala"
    },
    "50000": {
      p16: "R$ 18,00 / mil",
      b16: "Granel Industrial",
      p19: "R$ 22,00 / mil",
      b19: "Granel Industrial",
      p22: "R$ 31,00 / mil",
      b22: "Granel Industrial",
      p25: "R$ 39,00 / mil",
      b25: "Granel Industrial"
    }
  };

  function updatePrices(qty) {
    const tier = priceTiers[qty] || priceTiers["100"];
    if (price16) price16.textContent = tier.p16;
    if (badge16) badge16.textContent = tier.b16;
    if (price19) price19.textContent = tier.p19;
    if (badge19) badge19.textContent = tier.b19;
    if (price22) price22.textContent = tier.p22;
    if (badge22) badge22.textContent = tier.b22;
    if (price25) price25.textContent = tier.p25;
    if (badge25) badge25.textContent = tier.b25;
  }

  if (volSelect) {
    volSelect.addEventListener('change', (e) => {
      updatePrices(e.target.value);
    });
    updatePrices(volSelect.value);
  }

  // 3. Catalog Filter Tabs
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      productCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter || card.dataset.format?.includes(filter)) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });

  // 4. FAQ Accordion Logic
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const isActive = item.classList.contains('active');

      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 5. Interactive Quote Modal & WhatsApp Manifest Generator
  const modalOverlay = document.getElementById('quote-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalProductTitle = document.getElementById('modal-product-title');
  const modalSizeSelect = document.getElementById('modal-size-select');
  const modalFormatSelect = document.getElementById('modal-format-select');
  const modalQtyInput = document.getElementById('modal-qty-input');
  const modalCompanyInput = document.getElementById('modal-company-input');
  const msgPreviewText = document.getElementById('msg-preview-text');
  const modalSendWaBtn = document.getElementById('modal-send-wa-btn');

  function updateWhatsAppLink() {
    const size = modalSizeSelect ? modalSizeSelect.value : 'Argola 19mm';
    const format = modalFormatSelect ? modalFormatSelect.value : 'Argola Solta';
    const qty = modalQtyInput ? modalQtyInput.value : '5.000 un';
    const company = modalCompanyInput && modalCompanyInput.value.trim() !== '' 
      ? ` Empresa: ${modalCompanyInput.value.trim()}.` 
      : '';

    const textMsg = `Ol%C3%A1%2C+gostaria+de+solicitar+um+or%C3%A7amento+de+argolas+no+atacado.%0A%0A*Produto%3A*+${encodeURIComponent(size)}+(${encodeURIComponent(format)})%0A*Quantidade%3A*+${encodeURIComponent(qty)}${encodeURIComponent(company)}%0A*F%C3%A1brica%3A*+Evolu%C3%A7%C3%A3o+Argolas`;
    
    const waUrl = `https://wa.me/${OFFICIAL_WHATSAPP}?text=${textMsg}`;
    
    if (modalSendWaBtn) modalSendWaBtn.href = waUrl;
    if (msgPreviewText) msgPreviewText.textContent = `Olá, gostaria de solicitar um orçamento de argolas no atacado.\n\nProduto: ${size} (${format})\nQuantidade: ${qty}${company}\nFábrica: Evolução Argolas`;
  }

  // Open Modal Buttons
  document.querySelectorAll('.open-quote-modal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const prodName = btn.dataset.product || 'Argola 19mm';
      if (modalProductTitle) modalProductTitle.textContent = `Cotar: ${prodName}`;
      
      if (modalSizeSelect) {
        for (let i = 0; i < modalSizeSelect.options.length; i++) {
          if (prodName.includes(modalSizeSelect.options[i].text) || modalSizeSelect.options[i].text.includes(prodName)) {
            modalSizeSelect.selectedIndex = i;
            break;
          }
        }
      }

      updateWhatsAppLink();
      if (modalOverlay) modalOverlay.classList.remove('hidden');
    });
  });

  if (modalCloseBtn && modalOverlay) {
    modalCloseBtn.addEventListener('click', () => modalOverlay.classList.add('hidden'));
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) modalOverlay.classList.add('hidden');
    });
  }

  if (modalSizeSelect) modalSizeSelect.addEventListener('change', updateWhatsAppLink);
  if (modalFormatSelect) modalFormatSelect.addEventListener('change', updateWhatsAppLink);
  if (modalQtyInput) modalQtyInput.addEventListener('change', updateWhatsAppLink);
  if (modalCompanyInput) modalCompanyInput.addEventListener('input', updateWhatsAppLink);

  // 6. Form Field Input Masks (CNPJ & Phone)
  const cnpjInput = document.getElementById('form-cnpj');
  const phoneInput = document.getElementById('form-phone');

  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length > 11) v = v.substring(0, 11);

      if (v.length > 10) {
        e.target.value = v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
      } else if (v.length > 6) {
        e.target.value = v.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
      } else if (v.length > 2) {
        e.target.value = v.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
      } else {
        e.target.value = v;
      }
    });
  }

  if (cnpjInput) {
    cnpjInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length > 14) v = v.substring(0, 14);

      if (v.length > 12) {
        e.target.value = v.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
      } else if (v.length > 8) {
        e.target.value = v.replace(/^(\d{2})(\d{3})(\d{3})(\d{0,4})$/, '$1.$2.$3/$4');
      } else if (v.length > 5) {
        e.target.value = v.replace(/^(\d{2})(\d{3})(\d{0,3})$/, '$1.$2.$3');
      } else if (v.length > 2) {
        e.target.value = v.replace(/^(\d{2})(\d{0,3})$/, '$1.$2');
      } else {
        e.target.value = v;
      }
    });
  }

  // 7. Corporate Form Submission (Hardened with Input Sanitization)
  const b2bForm = document.getElementById('b2b-quote-form');
  const toast = document.getElementById('form-toast');

  // Input sanitizer: strips script injections, non-printable characters and limits payload size
  function sanitizeInput(str, maxLength = 250) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/[<>'"`;\\]/g, '') // remove dangerous characters
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // strip control chars
      .trim()
      .substring(0, maxLength);
  }

  if (b2bForm) {
    b2bForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('form-name');
      const phoneInput = document.getElementById('form-phone');
      const cnpjInput = document.getElementById('form-cnpj');
      const volumeInput = document.getElementById('form-volume');
      const messageInput = document.getElementById('form-message');

      const name = sanitizeInput(nameInput ? nameInput.value : '', 80);
      const phone = sanitizeInput(phoneInput ? phoneInput.value : '', 30);
      const cnpj = sanitizeInput(cnpjInput ? cnpjInput.value : '', 30);
      const volume = sanitizeInput(volumeInput ? volumeInput.value : '', 100);
      const message = sanitizeInput(messageInput ? messageInput.value : '', 300);

      if (toast) toast.classList.remove('hidden');

      if (window.gtag) {
        window.gtag('event', 'generate_lead', {
          event_category: 'B2B Form',
          event_label: volume
        });
      }

      setTimeout(() => {
        const textMsg = `*OR%C3%87AMENTO+CORPORATIVO+B2B+-+EVOLU%C3%87%C3%83O+ARGOLAS*%0A%0A*Solicitante%3A*+${encodeURIComponent(name)}%0A*WhatsApp%3A*+${encodeURIComponent(phone)}%0A*CNPJ%2FCPF%3A*+${encodeURIComponent(cnpj)}%0A*Volume+Estimado%3A*+${encodeURIComponent(volume)}%0A*Observa%C3%A7%C3%B5es%3A*+${encodeURIComponent(message || 'Sem observações adicionais')}`;
        
        window.open(`https://wa.me/${OFFICIAL_WHATSAPP}?text=${textMsg}`, '_blank', 'noopener,noreferrer');
        if (toast) toast.classList.add('hidden');
        b2bForm.reset();
      }, 1200);
    });
  }

  // 8. PDF Download Catalog Button Interaction
  const pdfBtn = document.getElementById('btn-download-pdf');
  if (pdfBtn) {
    pdfBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.open(`https://wa.me/${OFFICIAL_WHATSAPP}?text=Ol%C3%A1!+Gostaria+de+receber+o+Cat%C3%A1logo+T%C3%A9cnico+em+PDF+completo+da+Evolu%C3%A7%C3%A3o+Argolas.`, '_blank');
    });
  }

});
