/* ============================================================
   Réalisations — affichage public (lecture seule)
   Charge les réalisations depuis Supabase et les affiche.
   Si Supabase n'est pas configuré, affiche un message neutre.
   ============================================================ */

(function () {
  const container = document.getElementById("works");
  if (!container) return;

  function escapeHtml(s) {
    return (s || "").replace(/[&<>"']/g, c => (
      { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]
    ));
  }

  function showEmpty(msg) {
    container.innerHTML =
      '<div class="works-empty"><div class="ic">🗂️</div><p>' +
      escapeHtml(msg) + "</p></div>";
  }

  function render(items) {
    if (!items || items.length === 0) {
      showEmpty("Les réalisations seront bientôt disponibles. Revenez vite !");
      return;
    }
    container.innerHTML = items.map(w => {
      const titre = escapeHtml(w.titre);
      const desc = escapeHtml(w.description || "");
      const lien = escapeHtml(w.lien);
      const img = w.image_url
        ? `<img src="${escapeHtml(w.image_url)}" alt="${titre}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="ph" style="display:none">🌐</div>`
        : `<div class="ph">🌐</div>`;
      const linkRow = lien
        ? `<a class="w-link" href="${lien}" target="_blank" rel="noopener">Visiter le site <span class="arr">→</span></a>`
        : "";
      return `
      <article class="work reveal">
        <div class="thumb">${img}</div>
        <div class="w-body">
          <h3>${titre}</h3>
          <p>${desc}</p>
          ${linkRow}
        </div>
      </article>`;
    }).join("");

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); } });
    }, { threshold: .12 });
    container.querySelectorAll(".reveal").forEach(el => obs.observe(el));
  }

  if (typeof SUPABASE_READY === "undefined" || !SUPABASE_READY) {
    showEmpty("Les réalisations seront bientôt disponibles. Revenez vite !");
    return;
  }

  const url = `${SUPABASE_URL}/rest/v1/realisations?select=*&order=created_at.desc`;
  fetch(url, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`
    }
  })
    .then(r => r.ok ? r.json() : Promise.reject(r.status))
    .then(render)
    .catch(() => showEmpty("Les réalisations seront bientôt disponibles. Revenez vite !"));
})();
