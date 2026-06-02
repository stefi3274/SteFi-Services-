/* ============================================================
   Admin — gestion des réalisations (Supabase Auth + CRUD)
   - Connexion par email / mot de passe (compte créé dans Supabase)
   - Ajout et suppression de réalisations
   La sécurité réelle est assurée côté Supabase par les règles RLS :
   lecture publique, écriture réservée aux utilisateurs connectés.
   ============================================================ */

(function () {
  const setupNote = document.getElementById("setupNote");
  const loginCard = document.getElementById("loginCard");
  const panel = document.getElementById("panel");

  // 1) Supabase non configuré → on guide l'admin
  if (typeof SUPABASE_READY === "undefined" || !SUPABASE_READY) {
    if (setupNote) setupNote.style.display = "block";
    return;
  }
  // 2) SDK Supabase chargé ?
  if (!window.supabase || !window.supabase.createClient) {
    if (setupNote) {
      setupNote.style.display = "block";
      setupNote.innerHTML = "⚠️ La librairie Supabase n'a pas pu être chargée (vérifiez votre connexion internet).";
    }
    return;
  }

  const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const $ = id => document.getElementById(id);
  const escapeHtml = s => (s || "").replace(/[&<>"']/g, c => (
    { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));

  function status(el, msg, type) {
    el.textContent = msg;
    el.className = "admin-status " + (type || "ok");
  }
  function clearStatus(el) { el.className = "admin-status"; el.textContent = ""; }

  // ---------- Affichage selon l'état de connexion ----------
  async function refreshAuth() {
    const { data } = await db.auth.getSession();
    if (data.session) {
      loginCard.style.display = "none";
      panel.style.display = "block";
      loadList();
    } else {
      loginCard.style.display = "block";
      panel.style.display = "none";
    }
  }

  // ---------- Connexion ----------
  $("loginForm").addEventListener("submit", async e => {
    e.preventDefault();
    const st = $("loginStatus");
    clearStatus(st);
    const email = $("adminEmail").value.trim();
    const password = $("adminPass").value;
    const { error } = await db.auth.signInWithPassword({ email, password });
    if (error) {
      status(st, "Connexion impossible : " + error.message, "err");
    } else {
      refreshAuth();
    }
  });

  // ---------- Déconnexion ----------
  $("logoutBtn").addEventListener("click", async () => {
    await db.auth.signOut();
    refreshAuth();
  });

  // ---------- Ajout ----------
  $("addForm").addEventListener("submit", async e => {
    e.preventDefault();
    const st = $("addStatus");
    clearStatus(st);
    const row = {
      titre: $("wTitre").value.trim(),
      lien: $("wLien").value.trim(),
      description: $("wDesc").value.trim(),
      image_url: $("wImg").value.trim()
    };
    const { error } = await db.from("realisations").insert([row]);
    if (error) {
      status(st, "Erreur : " + error.message, "err");
    } else {
      status(st, "✓ Réalisation ajoutée !", "ok");
      $("addForm").reset();
      loadList();
    }
  });

  // ---------- Liste + suppression ----------
  async function loadList() {
    const listEl = $("adminList");
    const st = $("listStatus");
    clearStatus(st);
    const { data, error } = await db
      .from("realisations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      listEl.innerHTML = "";
      status(st, "Erreur de chargement : " + error.message, "err");
      return;
    }
    if (!data || data.length === 0) {
      listEl.innerHTML = '<p class="sub">Aucune réalisation pour le moment.</p>';
      return;
    }
    listEl.innerHTML = data.map(w => `
      <div class="admin-row">
        <div class="ar-info">
          ${w.image_url ? `<img class="ar-thumb" src="${escapeHtml(w.image_url)}" alt="" onerror="this.style.visibility='hidden'">` : `<div class="ar-thumb"></div>`}
          <div class="ar-txt">
            <b>${escapeHtml(w.titre)}</b>
            <span>${escapeHtml(w.lien)}</span>
          </div>
        </div>
        <button class="btn-del" data-id="${w.id}">Supprimer</button>
      </div>`).join("");

    listEl.querySelectorAll(".btn-del").forEach(btn => {
      btn.addEventListener("click", async () => {
        if (!confirm("Supprimer cette réalisation ?")) return;
        const id = btn.getAttribute("data-id");
        const { error } = await db.from("realisations").delete().eq("id", id);
        if (error) {
          status($("listStatus"), "Erreur : " + error.message, "err");
        } else {
          loadList();
        }
      });
    });
  }

  // Démarrage
  refreshAuth();
})();
