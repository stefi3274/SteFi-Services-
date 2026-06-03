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

const SUPABASE_URL = "VOTRE_URL_SUPABASE";       // ex. https://abcd1234.supabase.co
const SUPABASE_ANON_KEY = "VOTRE_CLE_ANON";      // longue chaîne commençant par "eyJ..."

// Ne pas modifier en dessous —————————————————————————————
const SUPABASE_READY =
  SUPABASE_URL && SUPABASE_ANON_KEY &&
  !SUPABASE_URL.includes("VOTRE_") &&
  !SUPABASE_ANON_KEY.includes("VOTRE_");
