// ============================================================
// Site Marshall — Mock Data Layer
// ============================================================

import { localizedMachineUnits } from './localizedUnits';

export const languages = [
    { code: 'en', name: 'English', native: 'English', flag: 'GB' },
    { code: 'tr', name: 'Turkish', native: 'Türkçe', flag: 'TR' },
    { code: 'ar', name: 'Arabic', native: 'الْعَرَبِيَّة', flag: 'SA' },
    { code: 'pl', name: 'Polish', native: 'Polski', flag: 'PL' },
    { code: 'ro', name: 'Romanian', native: 'Română', flag: 'RO' },
    { code: 'pt', name: 'Portuguese', native: 'Português', flag: 'BR' },
    { code: 'es', name: 'Spanish', native: 'Español', flag: 'ES' },
    { code: 'fr', name: 'French', native: 'Français', flag: 'FR' },
    { code: 'de', name: 'German', native: 'Deutsch', flag: 'DE' },
    { code: 'it', name: 'Italian', native: 'Italiano', flag: 'IT' },
    { code: 'nl', name: 'Dutch', native: 'Nederlands', flag: 'NL' },
    { code: 'el', name: 'Greek', native: 'Ελληνικά', flag: 'GR' },
    { code: 'hu', name: 'Hungarian', native: 'Magyar', flag: 'HU' },
    { code: 'cs', name: 'Czech', native: 'Čeština', flag: 'CZ' },
    { code: 'bg', name: 'Bulgarian', native: 'Български', flag: 'BG' },
    { code: 'uk', name: 'Ukrainian', native: 'Українська', flag: 'UA' },
    { code: 'sr', name: 'Serbian', native: 'Српски', flag: 'RS' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: 'IN' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: 'BD' },
    { code: 'ur', name: 'Urdu', native: 'اردو', flag: 'PK' },
    { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia', flag: 'ID' },
];
// ─── Training content templates (shared within category) ────────────────────
// These are now fetched dynamically via getLocalizedUnits based on the user's selected language.
export const getLocalizedUnits = (categoryStr, langCode = 'en') => {
    // Fallback to English if the language isn't found
    const langData = localizedMachineUnits[langCode] || localizedMachineUnits['en'];

    // Return the specific category (e.g. 'TAMPING_UNITS')
    return langData[categoryStr] || [];
};



// ─── Helper to build a machine entry ─────────────────────────────────────────
const img = {
    rail: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800",
    crane: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800",
    grind: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80&w=800",
    loco: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80&w=800",
};

export const machineDB = [
    // ── Track Tamping Machines ─────────────────────────────────────────────────
    { id: "08-275_Unimat", model: "Plasser 08-275 Unimat", type: "Track Tamping Machine", image: img.rail, confidence: 0.90, trainingProgress: 20, unitCategory: "TAMPING_UNITS" },
    { id: "09-16_CAT", model: "Plasser 09-16 CAT", type: "Track Tamping Machine", image: img.rail, confidence: 0.88, trainingProgress: 15, unitCategory: "TAMPING_UNITS" },
    { id: "09-32_CSM", model: "Plasser 09-32 CSM", type: "Track Tamping Machine", image: img.rail, confidence: 0.85, trainingProgress: 10, unitCategory: "TAMPING_UNITS" },
    { id: "09-3X_Dynamic", model: "Plasser 09-3X Dynamic", type: "Track Tamping Machine", image: img.rail, confidence: 0.87, trainingProgress: 25, unitCategory: "TAMPING_UNITS" },
    { id: "Beaver_Lightweight_Tamper", model: "Beaver Lightweight Tamper", type: "Track Tamping Machine", image: img.rail, confidence: 0.82, trainingProgress: 30, unitCategory: "TAMPING_UNITS" },
    { id: "UnimatExpress_2X-4x4_Dynamic", model: "Unimat Express 2X-4x4 Dynamic", type: "Track Tamping Machine", image: img.rail, confidence: 0.91, trainingProgress: 40, unitCategory: "TAMPING_UNITS" },
    { id: "Unimat_08-475_4S", model: "Unimat 08-475 4S", type: "Track Tamping Machine", image: img.rail, confidence: 0.94, trainingProgress: 60, unitCategory: "TAMPING_UNITS" },
    { id: "Unimat_09-4x4_4S_Dynamic_E\u00c2\u00b3", model: "Unimat 09-4x4/4S Dynamic E\u00b3", type: "Track Tamping Machine", image: img.rail, confidence: 0.89, trainingProgress: 35, unitCategory: "TAMPING_UNITS" },

    // ── Railway Cranes ─────────────────────────────────────────────────────────
    { id: "EDK_1000", model: "EDK 1000 Railway Crane", type: "Railway Crane", image: img.crane, confidence: 0.88, trainingProgress: 30, unitCategory: "CRANE_UNITS" },
    { id: "EDK_750", model: "EDK 750 Railway Crane", type: "Railway Crane", image: img.crane, confidence: 0.85, trainingProgress: 20, unitCategory: "CRANE_UNITS" },
    { id: "Kirow_GPC", model: "Kirow GPC", type: "Railway Crane", image: img.crane, confidence: 0.86, trainingProgress: 25, unitCategory: "CRANE_UNITS" },
    { id: "Kirow_KRC_1200", model: "Kirow KRC 1200", type: "Railway Crane", image: img.crane, confidence: 0.90, trainingProgress: 40, unitCategory: "CRANE_UNITS" },
    { id: "Kirow_KRC_1600", model: "Kirow KRC 1600", type: "Railway Crane", image: img.crane, confidence: 0.92, trainingProgress: 45, unitCategory: "CRANE_UNITS" },
    { id: "Kirow_KRC_400", model: "Kirow KRC 400", type: "Railway Crane", image: img.crane, confidence: 0.84, trainingProgress: 15, unitCategory: "CRANE_UNITS" },
    { id: "Kirow_KRC_810", model: "Kirow KRC 810", type: "Railway Crane", image: img.crane, confidence: 0.88, trainingProgress: 45, unitCategory: "CRANE_UNITS" },
    { id: "Kirow_KRC_910", model: "Kirow KRC 910", type: "Railway Crane", image: img.crane, confidence: 0.87, trainingProgress: 35, unitCategory: "CRANE_UNITS" },

    // ── Rail Grinding Machines ─────────────────────────────────────────────────
    { id: "HSG-city", model: "HSG-city Rail Grinder", type: "Rail Grinding Machine", image: img.grind, confidence: 0.83, trainingProgress: 20, unitCategory: "GRINDING_UNITS" },
    { id: "MG_31_Rail_Grinding_Machine", model: "MG 31 Rail Grinding Machine", type: "Rail Grinding Machine", image: img.grind, confidence: 0.87, trainingProgress: 30, unitCategory: "GRINDING_UNITS" },
    { id: "SF_03_Rail_Milling_Machine", model: "SF 03 Rail Milling Machine", type: "Rail Milling Machine", image: img.grind, confidence: 0.85, trainingProgress: 25, unitCategory: "GRINDING_UNITS" },
    { id: "Speno_RR_48", model: "Speno RR-48", type: "Rail Grinding Machine", image: img.grind, confidence: 0.82, trainingProgress: 35, unitCategory: "GRINDING_UNITS" },

    // ── Track Renewal & Maintenance ────────────────────────────────────────────
    { id: "BDS_2000", model: "BDS 2000 Ballast Distribution", type: "Ballast Distribution System", image: img.rail, confidence: 0.80, trainingProgress: 15, unitCategory: "RENEWAL_UNITS" },
    { id: "DGS_62_N", model: "DGS 62 N Dynamic Stabilizer", type: "Dynamic Track Stabilizer", image: img.rail, confidence: 0.83, trainingProgress: 20, unitCategory: "RENEWAL_UNITS" },
    { id: "MFS_100", model: "MFS 100 Material Feeder", type: "Material Feeder / Storage", image: img.rail, confidence: 0.81, trainingProgress: 10, unitCategory: "RENEWAL_UNITS" },
    { id: "MFS_40", model: "MFS 40 Material Feeder", type: "Material Feeder / Storage", image: img.rail, confidence: 0.79, trainingProgress: 10, unitCategory: "RENEWAL_UNITS" },
    { id: "Multi_Tasker_100", model: "Multi Tasker 100", type: "Track Renewal Machine", image: img.rail, confidence: 0.82, trainingProgress: 15, unitCategory: "RENEWAL_UNITS" },
    { id: "Multi_Tasker_160", model: "Multi Tasker 160", type: "Track Renewal Machine", image: img.rail, confidence: 0.84, trainingProgress: 20, unitCategory: "RENEWAL_UNITS" },
    { id: "Plasser_StabilizingTrailer", model: "Plasser Stabilizing Trailer", type: "Dynamic Track Stabilizer", image: img.rail, confidence: 0.80, trainingProgress: 10, unitCategory: "RENEWAL_UNITS" },
    { id: "Plasser_TMT", model: "Plasser TMT", type: "Track Maintenance Train", image: img.rail, confidence: 0.85, trainingProgress: 25, unitCategory: "RENEWAL_UNITS" },
    { id: "PM_1000", model: "PM 1000 Production Tamper", type: "Track Tamping Machine", image: img.rail, confidence: 0.87, trainingProgress: 30, unitCategory: "RENEWAL_UNITS" },
    { id: "RM_800", model: "RM 800 Renewal Machine", type: "Track Renewal Machine", image: img.rail, confidence: 0.86, trainingProgress: 20, unitCategory: "RENEWAL_UNITS" },
    { id: "RM_95-800_W", model: "RM 95-800 W Renewal Machine", type: "Track Renewal Machine", image: img.rail, confidence: 0.84, trainingProgress: 25, unitCategory: "RENEWAL_UNITS" },
    { id: "RPM_900", model: "RPM 900 Renewal Machine", type: "Track Renewal Machine", image: img.rail, confidence: 0.82, trainingProgress: 15, unitCategory: "RENEWAL_UNITS" },
    { id: "RU_800_S", model: "RU 800 S Renewal Machine", type: "Track Renewal Machine", image: img.rail, confidence: 0.80, trainingProgress: 10, unitCategory: "RENEWAL_UNITS" },
    { id: "SSP_110_SW", model: "SSP 110 SW Switch Renewal", type: "Switch & Crossing Renewal", image: img.rail, confidence: 0.83, trainingProgress: 20, unitCategory: "RENEWAL_UNITS" },

    // ── Locomotives & Multi-Purpose Vehicles ───────────────────────────────────
    { id: "Alstom_Prima_H3", model: "Alstom Prima H3", type: "Hybrid Locomotive", image: img.loco, confidence: 0.86, trainingProgress: 40, unitCategory: "LOCO_UNITS" },
    { id: "Bombardier_TRAXX", model: "Bombardier TRAXX", type: "Electric Locomotive", image: img.loco, confidence: 0.90, trainingProgress: 50, unitCategory: "LOCO_UNITS" },
    { id: "BR_711.1", model: "DB BR 711.1", type: "Track Inspection Vehicle", image: img.loco, confidence: 0.85, trainingProgress: 30, unitCategory: "LOCO_UNITS" },
    { id: "BR_714", model: "DB BR 714", type: "Track Inspection Vehicle", image: img.loco, confidence: 0.83, trainingProgress: 25, unitCategory: "LOCO_UNITS" },
    { id: "CatenaryCrafter_15.4_E\u00c2\u00b3", model: "Catenary Crafter 15.4 E\u00b3", type: "Catenary Maintenance Vehicle", image: img.loco, confidence: 0.81, trainingProgress: 20, unitCategory: "LOCO_UNITS" },
    { id: "Class_218", model: "DB Class 218", type: "Diesel Locomotive", image: img.loco, confidence: 0.87, trainingProgress: 35, unitCategory: "LOCO_UNITS" },
    { id: "Class_232", model: "DB Class 232", type: "Diesel Locomotive", image: img.loco, confidence: 0.85, trainingProgress: 30, unitCategory: "LOCO_UNITS" },
    { id: "Class_290_V_90", model: "DB Class 290 V90", type: "Shunting Locomotive", image: img.loco, confidence: 0.83, trainingProgress: 25, unitCategory: "LOCO_UNITS" },
    { id: "Class_333_335", model: "Class 333 / 335", type: "Diesel Locomotive", image: img.loco, confidence: 0.82, trainingProgress: 20, unitCategory: "LOCO_UNITS" },
    { id: "G_1206", model: "G 1206", type: "Diesel-Electric Locomotive", image: img.loco, confidence: 0.84, trainingProgress: 30, unitCategory: "LOCO_UNITS" },
    { id: "ROBEL_Mobile_Maintenance_Unit", model: "ROBEL Mobile Maintenance Unit", type: "Multi-Purpose Vehicle", image: img.loco, confidence: 0.80, trainingProgress: 15, unitCategory: "LOCO_UNITS" },
    { id: "Siemens_Vectron", model: "Siemens Vectron", type: "Electric Locomotive", image: img.loco, confidence: 0.92, trainingProgress: 55, unitCategory: "LOCO_UNITS" },
    { id: "Vossloh_DM_20-BDD", model: "Vossloh DM 20 BDD", type: "Diesel-Hydraulic Shunter", image: img.loco, confidence: 0.83, trainingProgress: 25, unitCategory: "LOCO_UNITS" },
    { id: "Vossloh_Gravita", model: "Vossloh Gravita", type: "Diesel Locomotive", image: img.loco, confidence: 0.86, trainingProgress: 35, unitCategory: "LOCO_UNITS" },
    { id: "Windhoff_MPV", model: "Windhoff MPV", type: "Multi-Purpose Vehicle", image: img.loco, confidence: 0.84, trainingProgress: 30, unitCategory: "LOCO_UNITS" },
    { id: "ZPW_4.5", model: "ZPW 4.5 Track Circuit", type: "Track Circuit Equipment", image: img.loco, confidence: 0.79, trainingProgress: 10, unitCategory: "LOCO_UNITS" },
];
export const translations = {
    en: { welcome: "Welcome to Site Marshall", identify_machine: "Identify Machine", push_to_speak: "Push To Speak", enter_academy: "Enter the Academy", quiz_confirm: "Confirm Answer", quiz_next: "Next Question \u2192", quiz_question: "Question", quiz_score_so_far: "Score so far:", quiz_see_results: "See Results", quiz_keep_studying: "Keep studying", quiz_well_done: "Well done!", quiz_of: "of", quiz_correct: "correct", quiz_retake: "RETAKE QUIZ", knowledge_check: "Knowledge Check", next_card: "NEXT CARD", restart_deck: "RESTART DECK", marshall_ai_greeting: "I am Marshall AI. Press and hold the microphone, or open the keyboard, to ask me about this machine.", ask_marshall_ai: "Ask Marshall AI...", marshall_ai_listening: "Marshall AI Listening...", processing: "Processing...", marshall_ai_active: "Marshall AI Active", reply_to_marshall_ai: "Reply to Marshall AI...", marshall_ai_welcome_prefix: "Marshall AI: Welcome to your training session on", marshall_ai_welcome_suffix: "What aspect of this topic would you like to explore first?", marshall_ai_insightful: "Marshall AI: That's an insightful question about", marshall_ai_affect: "How does this affect your approach to safe machine operation?", academy_title: "The Academy", pre_shift: "PRE-SHIFT", sidebar_active_machines: "My Active Machines", sidebar_earned_certs: "Earned Certifications", sidebar_cert_instruction: "Complete all sections in a unit to earn a certification badge.", sidebar_settings: "Settings & Profile", sidebar_login_prompt: "Please log in to view your assigned fleet.", fleet_drawer: "Fleet Drawer", cv_title: "Identify a Machine", cv_subtitle: "Take a photo or select one from your library", cv_take_photo: "TAKE PHOTO", cv_upload: "UPLOAD", cv_waiting: "WAITING FOR IMAGE", cv_detecting: "DETECTING...", cv_complete: "DETECTION COMPLETE", cv_frame: "FRAME MACHINE", cv_starting_cam: "Starting camera...", cv_go_back: "Go Back", cv_proximity: "PROXIMITY ALERT", cv_person_detected: "person detected in swing radius", cv_multiple: "MULTIPLE MATCHES \u2014 select one", cv_tap_open: "tap to open", cv_match: "match", cv_matches: "matches", enter_id: "Enter your Worker ID to begin", login: "Login", settings_title: "System Settings", preferences: "Preferences", notifications: "Notifications", logout_worker: "LOG OUT WORKER", training_verified: "Training logged and verified!", confirm_understanding: "I CONFIRM UNDERSTANDING", quick_summary: "Quick Summary", full_manual_excerpt: "Full Manual Excerpt" },
    tr: { welcome: "Site Marshall'a HoÅŸ Geldiniz", identify_machine: "Makineyi TanÄ±mla", push_to_speak: "KonuÅŸmak Ä°Ã§in BasÄ±n", enter_academy: "Akademiye Gir" },
    ar: { welcome: "Ù…Ø±Ø­Ø¨Ù‹Ø§ Ø¨ÙƒÙ… ÙÙŠ Site Marshall", identify_machine: "Ø§Ù„ØªØ¹Ø±Ù Ø¹Ù„Ù‰ Ø§Ù„Ø¢Ù„Ø©", push_to_speak: "Ø§Ø¶ØºØ· Ù„Ù„ØªØ­Ø¯Ø«", enter_academy: "Ø¯Ø®ÙˆÙ„ Ø§Ù„Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠØ©" },
    pl: { welcome: "Witamy w Site Marshall", identify_machine: "Zidentyfikuj maszynÄ™", push_to_speak: "NaciÅ›nij, aby mÃ³wiÄ‡", enter_academy: "WejdÅº do Akademii" },
    ro: { welcome: "Bine aÈ›i venit la Site Marshall", identify_machine: "IdentificaÈ›i maÈ™ina", push_to_speak: "ApÄƒsaÈ›i pentru a vorbi", enter_academy: "IntraÈ›i Ã®n Academie" },
    pt: { welcome: "Bem-vindo ao Site Marshall", identify_machine: "Identificar MÃ¡quina", push_to_speak: "Pressione para Falar", enter_academy: "Entrar na Academia" },
    es: { welcome: "Bienvenido a Site Marshall", identify_machine: "Identificar MÃ¡quina", push_to_speak: "Presione para Hablar", enter_academy: "Entrar a la Academia" },
    fr: { welcome: "Bienvenue sur Site Marshall", identify_machine: "Identifier la Machine", push_to_speak: "Appuyez pour Parler", enter_academy: "Entrer dans l'AcadÃ©mie" },
    de: { welcome: "Willkommen bei Site Marshall", identify_machine: "Maschine Identifizieren", push_to_speak: "Zum Sprechen Dr\u00fccken", enter_academy: "Akademie Betreten", quiz_confirm: "Antwort best\u00e4tigen", quiz_next: "N\u00e4chste Frage \u2192", quiz_question: "Frage", quiz_score_so_far: "Bisheriges Ergebnis:", quiz_see_results: "Ergebnisse anzeigen", quiz_keep_studying: "Weiterlernen", quiz_well_done: "Gut gemacht!", quiz_of: "von", quiz_correct: "richtig", quiz_retake: "QUIZ WIEDERHOLEN", knowledge_check: "Wissens\u00fcberpr\u00fcfung", next_card: "N\u00c4CHSTE KARTE", restart_deck: "DECK NEU STARTEN", marshall_ai_greeting: "Ich bin Marshall AI. Halten Sie das Mikrofon gedr\u00fcckt oder \u00f6ffnen Sie die Tastatur, um mich \u00fcber diese Maschine zu fragen.", ask_marshall_ai: "Fragen Sie Marshall AI...", marshall_ai_listening: "Marshall AI h\u00f6rt zu...", processing: "Verarbeitung...", marshall_ai_active: "Marshall AI Aktiv", reply_to_marshall_ai: "Antwort an Marshall AI...", marshall_ai_welcome_prefix: "Marshall AI: Willkommen zu Ihrer Schulungseinheit \u00fcber", marshall_ai_welcome_suffix: "Welchen Aspekt dieses Themas m\u00f6chten Sie zuerst untersuchen?", marshall_ai_insightful: "Marshall AI: Das ist eine aufschlussreiche Frage zu", marshall_ai_affect: "Wie wirkt sich das auf Ihre Herangehensweise an den sicheren Maschinenbetrieb aus?", academy_title: "Die Akademie", pre_shift: "SCHICHTBEGINN", sidebar_active_machines: "Meine aktiven Maschinen", sidebar_earned_certs: "Erhaltene Zertifikate", sidebar_cert_instruction: "Schlie\u00dfen Sie alle Abschnitte einer Einheit ab, um ein Zertifizierungsabzeichen zu erhalten.", sidebar_settings: "Einstellungen & Profil", sidebar_login_prompt: "Bitte melden Sie sich an, um Ihren zugewiesenen Fuhrpark zu sehen.", fleet_drawer: "Fuhrpark", cv_title: "Maschine Identifizieren", cv_subtitle: "Machen Sie ein Foto oder w\u00e4hlen Sie eines aus Ihrer Galerie", cv_take_photo: "FOTO MACHEN", cv_upload: "HOCHLADEN", cv_waiting: "WARTE AUF BILD", cv_detecting: "ERKENNUNG L\u00c4UFT...", cv_complete: "ERKENNUNG ABGESCHLOSSEN", cv_frame: "MASCHINE EINRAHMEN", cv_starting_cam: "Kamera wird gestartet...", cv_go_back: "Zur\u00fcck", cv_proximity: "N\u00c4HERUNGSALARM", cv_person_detected: "Person im Schwenkbereich erkannt", cv_multiple: "MEHRERE TREFFER \u2014 w\u00e4hlen Sie einen", cv_tap_open: "zum \u00d6ffnen tippen", cv_match: "Treffer", cv_matches: "Treffer", enter_id: "Geben Sie Ihre Arbeiter-ID ein, um zu beginnen", login: "Anmelden", settings_title: "Systemeinstellungen", preferences: "Pr\u00e4ferenzen", notifications: "Benachrichtigungen", logout_worker: "ARBEITER ABMELDEN", training_verified: "Schulung protokolliert und verifiziert!", confirm_understanding: "ICH BESTÄTIGE DAS VERSTÄNDNIS", quick_summary: "Kurze Zusammenfassung", full_manual_excerpt: "Vollständiger Handbuchauszug" },
    it: { welcome: "Benvenuto su Site Marshall", identify_machine: "Identificare la Macchina", push_to_speak: "Premi per Parlare", enter_academy: "Entra nell'Accademia" },
    nl: { welcome: "Welkom bij Site Marshall", identify_machine: "Machine Identificeren", push_to_speak: "Druk om te Spreken", enter_academy: "Ga naar de Academie" },
    el: { welcome: "ÎšÎ±Î»ÏÏ‚ Î®ÏÎ¸Î±Ï„Îµ ÏƒÏ„Î¿ Site Marshall", identify_machine: "Î‘Î½Î±Î³Î½ÏÏÎ¹ÏƒÎ· ÎœÎ·Ï‡Î±Î½Î®Î¼Î±Ï„Î¿Ï‚", push_to_speak: "Î Î±Ï„Î®ÏƒÏ„Îµ Î³Î¹Î± ÎŸÎ¼Î¹Î»Î¯Î±", enter_academy: "Î•Î¯ÏƒÎ¿Î´Î¿Ï‚ ÏƒÏ„Î·Î½ Î‘ÎºÎ±Î´Î·Î¼Î¯Î±" },
    hu: { welcome: "ÃœdvÃ¶zÃ¶ljÃ¼k a Site Marshall-ban", identify_machine: "GÃ©p AzonosÃ­tÃ¡sa", push_to_speak: "Nyomja meg a BeszÃ©dhez", enter_academy: "BelÃ©pÃ©s az AkadÃ©miÃ¡ra" },
    cs: { welcome: "VÃ­tejte v Site Marshall", identify_machine: "Identifikovat Stroj", push_to_speak: "StisknÄ›te pro MluvenÃ­", enter_academy: "Vstupte do Akademie" },
    bg: { welcome: "Ğ”Ğ¾Ğ±Ñ€Ğµ Ğ´Ğ¾ÑˆĞ»Ğ¸ Ğ² Site Marshall", identify_machine: "Ğ˜Ğ´ĞµĞ½Ñ‚Ğ¸Ñ„Ğ¸Ñ†Ğ¸Ñ€Ğ°Ğ½Ğµ Ğ½Ğ° ĞœĞ°ÑˆĞ¸Ğ½Ğ°", push_to_speak: "ĞĞ°Ñ‚Ğ¸ÑĞ½ĞµÑ‚Ğµ Ğ·Ğ° Ğ“Ğ¾Ğ²Ğ¾Ñ€ĞµĞ½Ğµ", enter_academy: "Ğ’Ğ»ĞµĞ·Ñ‚Ğµ Ğ² ĞĞºĞ°Ğ´ĞµĞ¼Ğ¸ÑÑ‚Ğ°" },
    uk: { welcome: "Ğ›Ğ°ÑĞºĞ°Ğ²Ğ¾ Ğ¿Ñ€Ğ¾ÑĞ¸Ğ¼Ğ¾ Ğ´Ğ¾ Site Marshall", identify_machine: "Ğ†Ğ´ĞµĞ½Ñ‚Ğ¸Ñ„Ñ–ĞºÑƒĞ²Ğ°Ñ‚Ğ¸ ĞœĞ°ÑˆĞ¸Ğ½Ñƒ", push_to_speak: "ĞĞ°Ñ‚Ğ¸ÑĞ½Ñ–Ñ‚ÑŒ, Ñ‰Ğ¾Ğ± Ğ“Ğ¾Ğ²Ğ¾Ñ€Ğ¸Ñ‚Ğ¸", enter_academy: "Ğ£Ğ²Ñ–Ğ¹Ñ‚Ğ¸ Ğ´Ğ¾ ĞĞºĞ°Ğ´ĞµĞ¼Ñ–Ñ—" },
    sr: { welcome: "Ğ”Ğ¾Ğ±Ñ€Ğ¾Ğ´Ğ¾ÑˆĞ»Ğ¸ Ñƒ Site Marshall", identify_machine: "Ğ˜Ğ´ĞµĞ½Ñ‚Ğ¸Ñ„Ğ¸ĞºĞ¾Ğ²Ğ°Ñ‚Ğ¸ ĞœĞ°ÑˆĞ¸Ğ½Ñƒ", push_to_speak: "ĞŸÑ€Ğ¸Ñ‚Ğ¸ÑĞ½Ğ¸Ñ‚Ğµ Ğ·Ğ° Ğ“Ğ¾Ğ²Ğ¾Ñ€", enter_academy: "Ğ£Ñ’Ğ¸Ñ‚Ğµ Ñƒ ĞĞºĞ°Ğ´ĞµĞ¼Ğ¸Ñ˜Ñƒ" },
    hi: { welcome: "Site Marshall à¤®à¥‡à¤‚ à¤†à¤ªà¤•à¤¾ à¤¸à¥à¤µà¤¾à¤—à¤¤ à¤¹à¥ˆ", identify_machine: "à¤®à¤¶à¥€à¤¨ à¤•à¥€ à¤ªà¤¹à¤šà¤¾à¤¨ à¤•à¤°à¥‡à¤‚", push_to_speak: "à¤¬à¥‹à¤²à¤¨à¥‡ à¤•à¥‡ à¤²à¤¿à¤ à¤¦à¤¬à¤¾à¤à¤‚", enter_academy: "à¤…à¤•à¤¾à¤¦à¤®à¥€ à¤®à¥‡à¤‚ à¤ªà¥à¤°à¤µà¥‡à¤¶ à¤•à¤°à¥‡à¤‚" },
    bn: { welcome: "Site Marshall-à¦ à¦¸à§à¦¬à¦¾à¦—à¦¤à¦®", identify_machine: "à¦®à§‡à¦¶à¦¿à¦¨ à¦¶à¦¨à¦¾à¦•à§à¦¤ à¦•à¦°à§à¦¨", push_to_speak: "à¦•à¦¥à¦¾ à¦¬à¦²à¦¤à§‡ à¦šà¦¾à¦ªà§à¦¨", enter_academy: "à¦à¦•à¦¾à¦¡à§‡à¦®à¦¿à¦¤à§‡ à¦ªà§à¦°à¦¬à§‡à¦¶ à¦•à¦°à§à¦¨" },
    ur: { welcome: "Site Marshall Ù…ÛŒÚº Ø®ÙˆØ´ Ø¢Ù…Ø¯ÛŒØ¯", identify_machine: "Ù…Ø´ÛŒÙ† Ú©ÛŒ Ø´Ù†Ø§Ø®Øª Ú©Ø±ÛŒÚº", push_to_speak: "Ø¨ÙˆÙ„Ù†Û’ Ú©Û’ Ù„ÛŒÛ’ Ø¯Ø¨Ø§Ø¦ÛŒÚº", enter_academy: "Ø§Ú©ÛŒÚˆÙ…ÛŒ Ù…ÛŒÚº Ø¯Ø§Ø®Ù„ ÛÙˆÚº" },
    id: { welcome: "Selamat Datang di Site Marshall", identify_machine: "Identifikasi Mesin", push_to_speak: "Tekan untuk Berbicara", enter_academy: "Masuk ke Akademi" },
};
export const workerRegistry = [
    {
        id: "W-4821",
        name: "Mehmet Yilmaz",
        language: "tr",
        assignedMachines: ["m-1", "m-2"],
        preShiftCompleted: { "m-1": true, "m-2": false },
        completedSections: ["m-1:1.1", "m-1:1.2", "m-1:2.1", "m-2:1.1"],
        totalSections: 12,
        lastActive: "14:32"
    },
    {
        id: "W-1105",
        name: "Piotr Kowalski",
        language: "pl",
        assignedMachines: ["m-3", "m-4"],
        preShiftCompleted: { "m-3": true, "m-4": false },
        completedSections: ["m-3:1.1", "m-4:1.1"],
        totalSections: 8,
        lastActive: "14:18"
    },
    {
        id: "W-3390",
        name: "Ahmed Al-Farsi",
        language: "ar",
        assignedMachines: ["m-2", "m-5"],
        preShiftCompleted: { "m-2": true, "m-5": false },
        completedSections: ["m-2:1.1", "m-2:1.2", "m-5:1.1"],
        totalSections: 10,
        lastActive: "13:41"
    },
    {
        id: "W-7742",
        name: "Dmytro Koval",
        language: "uk",
        assignedMachines: ["m-1"],
        preShiftCompleted: { "m-1": true },
        completedSections: ["m-1:1.1", "m-1:1.2", "m-1:2.1", "m-1:2.2"],
        totalSections: 8,
        lastActive: "12:58"
    },
    {
        id: "W-5501",
        name: "Rudi Hartono",
        language: "id",
        assignedMachines: ["m-4", "m-5"],
        preShiftCompleted: { "m-4": false, "m-5": false },
        completedSections: ["m-4:1.1"],
        totalSections: 12,
        lastActive: "11:45"
    },
    {
        id: "W-6629",
        name: "Carlos Silva",
        language: "pt",
        assignedMachines: ["m-3", "m-5"],
        preShiftCompleted: { "m-3": true, "m-5": false },
        completedSections: ["m-3:1.1", "m-3:1.2", "m-5:1.1", "m-5:1.2"],
        totalSections: 12,
        lastActive: "10:30"
    }
];
