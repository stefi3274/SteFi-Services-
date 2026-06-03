/* ============================================================
   CONFIGURATION SUPABASE
   ------------------------------------------------------------
   Remplacez les deux valeurs ci-dessous par celles de votre
   projet Supabase. Voir le guide : GUIDE-SUPABASE.md

   Où les trouver :
   Supabase → votre projet → Project Settings → API
     • URL                → "Project URL"
     • Clé publique (anon) → "Project API keys" → "anon public"

   ⚠️ La clé "anon" est faite pour être publique : elle peut
      figurer ici sans danger. Ne mettez JAMAIS la clé "service_role".
   ============================================================ */

const SUPABASE_URL = "https://darzhfamxnycdglcglgg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhcnpoZmFteG55Y2RnbGNnbGdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzNDUzNjcsImV4cCI6MjA5NTkyMTM2N30.uHMDHR4df8oYGIqLonLwAgEDzzdu1s7yj7VWtp3KUBQ";

// Ne pas modifier en dessous —————————————————————————————
const SUPABASE_READY =
  SUPABASE_URL && SUPABASE_ANON_KEY &&
  !SUPABASE_URL.includes("VOTRE_") &&
  !SUPABASE_ANON_KEY.includes("VOTRE_");
