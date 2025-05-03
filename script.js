// ===== [1] VARIÁVEIS GLOBAIS =====
const musica = document.getElementById("musica");
const musicToggle = document.getElementById("music-toggle");
const themeToggle = document.getElementById("themeToggle");
const sliderWrapper = document.querySelector(".slides-wrapper");
const slides = document.querySelectorAll(".slide");

// Configurações do Slider
let currentIndex = 0;
let autoSlideInterval;
let pauseTimeout;
let touchStartX = 0;
const SLIDE_INTERVAL = 3000; // 3 segundos entre slides automáticos
const PAUSE_DURATION = 5000; // 5 segundos de pausa após interação

// ===== [2] FUNÇÕES DO SLIDER =====
function showSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    sliderWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
}

function startAutoSlide() {
    clearInterval(autoSlideInterval);
    clearTimeout(pauseTimeout);
    
    autoSlideInterval = setInterval(() => {
        showSlide(currentIndex + 1);
    }, SLIDE_INTERVAL);
}

function handleManualInteraction(direction) {
    clearInterval(autoSlideInterval);
    clearTimeout(pauseTimeout);
    
    showSlide(currentIndex + direction);
    
    pauseTimeout = setTimeout(() => {
        startAutoSlide();
    }, PAUSE_DURATION);
}

// ===== [3] EVENTOS DE TOUCH/SWIPE =====
sliderWrapper.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    clearInterval(autoSlideInterval);
}, { passive: true });

sliderWrapper.addEventListener("touchend", (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > 50) {
        handleManualInteraction(diff > 0 ? 1 : -1);
    } else {
        startAutoSlide();
    }
}, { passive: true });

// ===== [4] CONTROLE DE MÚSICA =====
musicToggle.addEventListener("change", function() {
    if (this.checked) {
        musica.play();
    } else {
        musica.pause();
    }
});

// ===== [5] CORAÇÕES ANIMADOS =====
function criarCoracao() {
    const coracao = document.createElement("div");
    coracao.innerHTML = "💜";
    coracao.classList.add("coracao");
    
    if (document.body.classList.contains("tema-claro")) {
        coracao.style.color = "black";
    }
    
    coracao.style.left = Math.random() * 100 + "vw";
    coracao.style.animationDuration = Math.random() * 2 + 3 + "s";
    document.body.appendChild(coracao);
    
    setTimeout(() => coracao.remove(), 5000);
}

// ===== [6] CONTADOR DE TEMPO =====
function atualizarContador() {
    const inicio = new Date("June 06, 2009 10:25:00").getTime();
    const agora = new Date().getTime();
    const diferenca = agora - inicio;
    
    const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferenca % (1000 * 60)) / 1000);
    
    document.getElementById("contador").innerText =
        `${dias} dias, ${horas} horas, ${minutos} minutos e ${segundos} segundos`;
}

// ===== [7] CONTROLE DO TEMA =====
themeToggle.addEventListener("change", function() {
    document.body.classList.toggle("tema-claro");
    localStorage.setItem("tema", this.checked ? "claro" : "escuro");
    
    document.querySelectorAll(".coracao").forEach(coracao => {
        coracao.style.color = this.checked ? "black" : "";
    });
});

// ===== [8] INICIALIZAÇÃO =====
document.addEventListener("DOMContentLoaded", function() {
    // Tema
    if (localStorage.getItem("tema") === "claro") {
        themeToggle.checked = true;
        document.body.classList.add("tema-claro");
    }
    
    // Contador
    atualizarContador();
    setInterval(atualizarContador, 1000);
    
    // Slider
    startAutoSlide();
    
    // Corações
    setInterval(criarCoracao, 200);
    
    // Pausa slider quando mouse está sobre ele
    sliderWrapper.addEventListener("mouseenter", () => {
        clearInterval(autoSlideInterval);
    });
    
    sliderWrapper.addEventListener("mouseleave", () => {
        startAutoSlide();
    });
});

// ===== [9] TELA INICIAL =====
document.getElementById("botao-entrada").addEventListener("click", function() {
    document.getElementById("tela-inicial").style.display = "none";
    document.getElementById("conteudo").style.display = "block";
    document.querySelector(".theme-toggle-container").style.display = "block";
    
    // Inicia música com fade-in
    musica.volume = 0;
    musica.play();
    
    let volume = 0;
    const fadeIn = setInterval(() => {
        if (volume < 1) {
            volume += 0.01;
            musica.volume = Math.min(volume, 1);
        } else {
            clearInterval(fadeIn);
        }
    }, 200);
    
    musicToggle.checked = true;
});