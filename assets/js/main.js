document.addEventListener("DOMContentLoaded", () => {
  /* ====== FILTRAGE DU PORTFOLIO ====== */
  const filterButtons = document.querySelectorAll(".filter-btn");
  const items = document.querySelectorAll(".portfolio-item");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");

      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      items.forEach((item) => {
        const category = item.getAttribute("data-category");

        if (filter === "all" || category === filter) {
          item.style.display = "";
        } else {
          item.style.display = "none";
        }
      });
    });
  });

  /* ====== AUTO-PLAY DES VIGNETTES VIDÉO (si le navigateur l'autorise) ====== */
  const thumbVideos = document.querySelectorAll(".thumb-video");
  thumbVideos.forEach((video) => {
    // certains navigateurs bloquent l'autoplay, donc on ignore les erreurs
    video.play().catch(() => {});
  });

  /* ====== LIGHTBOX IMAGES + VIDÉOS ====== */
  const lightbox = document.querySelector("#lightbox");
  const lightboxInner = lightbox ? lightbox.querySelector(".lightbox-inner") : null;
  const lightboxClose = lightbox ? lightbox.querySelector(".lightbox-close") : null;

  if (!lightbox || !lightboxInner || !lightboxClose) return;

  function closeLightbox() {
    // stoppe la vidéo si besoin
    const currentVideo = lightboxInner.querySelector("video");
    if (currentVideo) {
      currentVideo.pause();
      currentVideo.currentTime = 0;
    }

    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxInner.innerHTML = "";
  }

  function openLightboxFromItem(item) {
    const img = item.querySelector("img");
    const thumbVideo = item.querySelector("video");

    lightboxInner.innerHTML = "";

    if (thumbVideo) {
      // On récupère le src de la vignette vidéo
      const sourceEl = thumbVideo.querySelector("source");
      const src =
        (sourceEl && sourceEl.getAttribute("src")) ||
        thumbVideo.getAttribute("src");

      const video = document.createElement("video");
      video.controls = true;
      video.autoplay = true;
      video.innerHTML = `<source src="${src}" type="video/mp4">`;

      lightboxInner.appendChild(video);

      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");

      // on relance proprement la lecture
      video.addEventListener("loadeddata", () => {
        video.play().catch(() => {});
      });

      // plein écran sur clic utilisateur dans la vidéo (plus fiable)
      video.addEventListener("click", () => {
        const requestFs =
          video.requestFullscreen ||
          video.webkitRequestFullscreen ||
          video.mozRequestFullScreen ||
          video.msRequestFullscreen;

        if (requestFs) {
          requestFs.call(video).catch(() => {});
        }
      });
    } else if (img) {
      // Image : on l'affiche en grand
      const bigImg = document.createElement("img");
      bigImg.src = img.getAttribute("src");
      bigImg.alt = img.getAttribute("alt") || "";
      lightboxInner.appendChild(bigImg);

      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
    }
  }

  // Clic sur les cartes du portfolio
  const portfolioLinks = document.querySelectorAll(".portfolio-link");
  portfolioLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault(); // évite le scroll vers le haut
      const item = link.closest(".portfolio-item");
      if (!item) return;
      openLightboxFromItem(item);
    });
  });

  // Fermeture lightbox
  lightboxClose.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLightbox();
    }
  });
});

// ---------- PAGE LOADER ----------
window.addEventListener('load', () => {
  const loader = document.querySelector('.page-loader');
  if (loader) {
    loader.classList.add('is-hidden');
    setTimeout(() => loader.remove(), 700);
  }
});

// ---------- SCROLL REVEAL ----------
const revealElements = document.querySelectorAll('.reveal, .portfolio-item');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15
});

revealElements.forEach(el => revealObserver.observe(el));

// ---------- SIMPLE HERO PARALLAX ----------
const heroSection = document.querySelector('.hero');

if (heroSection) {
  window.addEventListener('scroll', () => {
    const offset = window.scrollY * 0.35;
    heroSection.style.backgroundPositionY = `${-offset}px`;
  });
}

// ---------- THEME TOGGLE ----------
const themeToggle = document.querySelector('.theme-toggle');

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('theme-light');
    themeToggle.classList.toggle('is-on');
  });
}
