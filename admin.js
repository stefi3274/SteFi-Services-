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
      loadEntreprises().then(loadDashboard);
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

  // ============================================================
  //  TABLEAU DE BORD — données des sites clients
  //  (entreprises + newsletter + messages)
  // ============================================================
  let entreprisesMap = {};   // id -> nom

  async function loadEntreprises() {
    const { data, error } = await db.from("entreprises").select("id,nom").order("nom");
    if (error) return;
    entreprisesMap = {};
    const sel = $("dashEntreprise");
    const cur = sel.value;
    sel.innerHTML = '<option value="">Toutes les entreprises</option>';
    (data || []).forEach(e => {
      entreprisesMap[e.id] = e.nom;
      const o = document.createElement("option");
      o.value = e.id; o.textContent = e.nom;
      sel.appendChild(o);
    });
    sel.value = cur;
  }

  function nomEntreprise(id) { return entreprisesMap[id] || "—"; }
  function dateFr(s) { return s ? new Date(s).toLocaleString("fr-FR") : ""; }

  async function loadDashboard() {
    const filtre = $("dashEntreprise").value;
    const stt = $("dashStatus"); clearStatus(stt);

    // Newsletter
    let nq = db.from("newsletter").select("*").order("date_inscription", { ascending: false });
    if (filtre) nq = nq.eq("entreprise_id", filtre);
    const { data: news, error: e1 } = await nq;
    const nEl = $("dashNewsletter");
    if (e1) { nEl.innerHTML = ""; status(stt, "Erreur newsletter : " + e1.message, "err"); }
    else if (!news || !news.length) { nEl.innerHTML = '<p class="sub">Aucune inscription.</p>'; }
    else {
      nEl.innerHTML = `<table class="dash-table"><thead><tr><th>Entreprise</th><th>Email</th><th>Date</th></tr></thead><tbody>${
        news.map(r => `<tr><td>${escapeHtml(nomEntreprise(r.entreprise_id))}</td><td>${escapeHtml(r.email)}</td><td>${escapeHtml(dateFr(r.date_inscription))}</td></tr>`).join("")
      }</tbody></table>`;
    }

    // Messages
    let mq = db.from("messages").select("*").order("date_envoi", { ascending: false });
    if (filtre) mq = mq.eq("entreprise_id", filtre);
    const { data: msgs, error: e2 } = await mq;
    const mEl = $("dashMessages");
    if (e2) { mEl.innerHTML = ""; status(stt, "Erreur messages : " + e2.message, "err"); }
    else if (!msgs || !msgs.length) { mEl.innerHTML = '<p class="sub">Aucun message.</p>'; }
    else {
      mEl.innerHTML = msgs.map(r => `
        <div class="dash-msg">
          <div class="dash-msg-head">
            <b>${escapeHtml(r.nom || "—")}</b>
            <span class="dash-ent">${escapeHtml(nomEntreprise(r.entreprise_id))}</span>
          </div>
          <div class="dash-msg-meta">${escapeHtml(r.email || "")} ${r.telephone ? "· " + escapeHtml(r.telephone) : ""} · ${escapeHtml(dateFr(r.date_envoi))}</div>
          <p class="dash-msg-body">${escapeHtml(r.message || "")}</p>
        </div>`).join("");
    }
  }

  const refBtn = $("refreshData");
  if (refBtn) refBtn.addEventListener("click", async () => { await loadEntreprises(); loadDashboard(); });
  const dashSel = $("dashEntreprise");
  if (dashSel) dashSel.addEventListener("change", loadDashboard);

  // Démarrage
  refreshAuth();
})();
