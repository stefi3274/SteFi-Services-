/* ============================================================
   SteFi Services — interactions (v3)
   Le contenu (menu, footer) est écrit en dur dans chaque page
   pour un meilleur référencement. Ce fichier gère uniquement
   les interactions : menu mobile, animations, formulaire.

   👉 Pour changer le numéro WhatsApp partout, modifiez la
      constante WHATSAPP ci-dessous ET les liens dans les pages.
   ============================================================ */

const WHATSAPP = "50955108873"; // format international, sans + ni espaces

document.addEventListener("DOMContentLoaded", () => {

  // Année courante (footer)
  document.querySelectorAll("#year, .year").forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // Date de mise à jour (mentions légales)
  const maj = document.getElementById("maj");
  if (maj) maj.textContent = new Date().toLocaleDateString("fr-FR", { year:"numeric", month:"long", day:"numeric" });

  // Ombre du header au défilement
  const header = document.querySelector("header");
  if (header) {
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive:true });
  }

  // Menu mobile
  const burger = document.getElementById("burger");
  const menu = document.getElementById("menu");
  if (burger && menu) {
    burger.addEventListener("click", () => {
      menu.classList.toggle("open");
      burger.classList.toggle("open");
    });
    menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
      menu.classList.remove("open");
      burger.classList.remove("open");
    }));
  }

  // Animations d'apparition au défilement
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); } });
  }, { threshold:.12 });
  window.__revealObserver = obs;
  document.querySelectorAll(".reveal").forEach(el => obs.observe(el));

  // Formulaire de contact -> WhatsApp
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const nom = document.getElementById("nom").value.trim();
      const contact = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();
      const texte = `Bonjour SteFi Services !\n\nNom : ${nom}\nContact : ${contact}\n\n${message}`;
      window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texte)}`, "_blank");
    });
  }
});
