// ============================================================
// Site Marshall â€” Mock Data Layer
// ============================================================

export const languages = [
    { code: 'en', name: 'English', native: 'English', flag: 'GB' },
    { code: 'tr', name: 'Turkish', native: 'TÃ¼rkÃ§e', flag: 'TR' },
    { code: 'ar', name: 'Arabic', native: 'Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©', flag: 'SA' },
    { code: 'pl', name: 'Polish', native: 'Polski', flag: 'PL' },
    { code: 'ro', name: 'Romanian', native: 'RomÃ¢nÄƒ', flag: 'RO' },
    { code: 'pt', name: 'Portuguese', native: 'PortuguÃªs', flag: 'BR' },
    { code: 'es', name: 'Spanish', native: 'EspaÃ±ol', flag: 'ES' },
    { code: 'fr', name: 'French', native: 'FranÃ§ais', flag: 'FR' },
    { code: 'de', name: 'German', native: 'Deutsch', flag: 'DE' },
    { code: 'it', name: 'Italian', native: 'Italiano', flag: 'IT' },
    { code: 'nl', name: 'Dutch', native: 'Nederlands', flag: 'NL' },
    { code: 'el', name: 'Greek', native: 'Î•Î»Î»Î·Î½Î¹ÎºÎ¬', flag: 'GR' },
    { code: 'hu', name: 'Hungarian', native: 'Magyar', flag: 'HU' },
    { code: 'cs', name: 'Czech', native: 'ÄŒeÅ¡tina', flag: 'CZ' },
    { code: 'bg', name: 'Bulgarian', native: 'Ğ‘ÑŠĞ»Ğ³Ğ°Ñ€ÑĞºĞ¸', flag: 'BG' },
    { code: 'uk', name: 'Ukrainian', native: 'Ğ£ĞºÑ€Ğ°Ñ—Ğ½ÑÑŒĞºĞ°', flag: 'UA' },
    { code: 'sr', name: 'Serbian', native: 'Ğ¡Ñ€Ğ¿ÑĞºĞ¸', flag: 'RS' },
    { code: 'hi', name: 'Hindi', native: 'à¤¹à¤¿à¤¨à¥à¤¦à¥€', flag: 'IN' },
    { code: 'bn', name: 'Bengali', native: 'à¦¬à¦¾à¦‚à¦²à¦¾', flag: 'BD' },
    { code: 'ur', name: 'Urdu', native: 'Ø§Ø±Ø¯Ùˆ', flag: 'PK' },
    { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia', flag: 'ID' },
];
// ─── Training content templates (shared within category) ────────────────────

const EXCAVATION_UNITS = [
    {
        id: "excavation-1", title: "Excavation & Loading Safety", completed: false, progress: 0,
        sections: [
            {
                id: "1.1", title: "Hydraulic System Integrity", criticality: "rust-red",
                completed: false, progress: 0,
                content: "High-pressure hydraulic leaks can cause fatal injection injuries. Never use hands to check for leaks — use a piece of cardboard. If a hose bursts, lower the attachment to the ground immediately and shut down the engine.",
                qChatContext: "Explain why hydraulic injection is a medical emergency and what pressure thresholds are involved.",
                summary: "Hydraulic leaks — use cardboard, not hands. Lower attachment if hose bursts. Medical emergency.",
                learnCards: [
                    { q: "How should you check for a hydraulic leak?", a: "Use a piece of cardboard or wood.", options: ["Feel with your hand.", "Wait for a pool to form.", "Use a piece of cardboard or wood.", "Use a flashlight only."], correct: 2 },
                    { q: "First action if a hydraulic hose bursts?", a: "Lower attachment to ground and shut down engine.", options: ["Keep working carefully.", "Lower attachment to ground and shut down engine.", "Call maintenance while running.", "Tighten the fitting."], correct: 1 },
                    { q: "Why is a pinhole hydraulic leak dangerous?", a: "It can inject oil under the skin (injection surgery).", options: ["It might stain the ground.", "It can inject oil under the skin (injection surgery).", "It reduces fuel efficiency.", "It is a slip hazard."], correct: 1 }
                ]
            },
            {
                id: "1.2", title: "Swing Radius & Undergrounds", criticality: "safety-orange",
                completed: false, progress: 0,
                content: "Maintain a 360-degree exclusion zone around the machine's swing radius. Always confirm underground service cable locations (dial before you dig) before breaking ground. Use a spotter for tight spaces.",
                qChatContext: "What are the common color codes for underground utilities and what is the 'safety hand' technique for spotters?",
                summary: "360-degree swing zone. Confirm undergrounds before digging. Use spotters.",
                learnCards: [
                    { q: "Minimum safety zone for a working excavator?", a: "Full swing radius plus 2 metres.", options: ["5 metres.", "Full swing radius plus 2 metres.", "Inside the tracks.", "10 metres."], correct: 1 },
                    { q: "What must be done before the first dig?", a: "Verify underground utility maps.", options: ["Check fuel level.", "Sound horn twice.", "Verify underground utility maps.", "Grease the bucket."], correct: 2 },
                    { q: "Excavator spotter's primary role?", a: "Maintaining clear lines of sight and ensuring the exclusion zone.", options: ["Checking the time.", "Directing traffic only.", "Maintaining clear lines of sight and ensuring the exclusion zone.", "Cleaning the windows."], correct: 2 }
                ]
            }
        ]
    }
];

const PAVING_UNITS = [
    {
        id: "paving-1", title: "Paving & Material Handling", completed: false, progress: 0,
        sections: [
            {
                id: "1.1", title: "Thermal and Crushing Hazards", criticality: "rust-red",
                completed: false, progress: 0,
                content: "Asphalt is laid at temperatures exceeding 150°C. Contact causes severe burns. Stay clear of the hopper and conveyor zones where crushing hazards are high. Never step on a moving screed.",
                qChatContext: "Why is asphalt steam hazardous and what are the specific PPE requirements for paving crews?",
                summary: "Hot asphalt (>150°C). Crushing hazards in hopper. No stepping on moving screed.",
                learnCards: [
                    { q: "Operating temperature of hot-mix asphalt?", a: "Exceeding 150°C.", options: ["50°C.", "80°C.", "150°C.", "Exceeding 150°C."], correct: 3 },
                    { q: "Where is the main crushing hazard on a paver?", a: "The hopper and conveyor mechanisms.", options: ["The fuel tank.", "The driver's seat.", "The hopper and conveyor mechanisms.", "The front tires."], correct: 2 },
                    { q: "Can you ride on the screed during operation?", a: "Only if configured with a dedicated platform and PPE.", options: ["Yes, anywhere.", "No — strictly prohibited while moving.", "Only if configured with a dedicated platform and PPE.", "Only when reversing."], correct: 2 }
                ]
            },
            {
                id: "1.2", title: "Compactor Visibility", criticality: "safety-orange",
                completed: false, progress: 0,
                content: "Rollers have significant blind spots. Always maintain eye contact with the paving crew. Use backup cameras and audible alarms. Never reverse without checking the path behind the drum fully.",
                qChatContext: "What is the 'circle of safety' and how does it apply to compaction rollers in a tight urban site?",
                summary: "Blind spots on rollers. Maintain eye contact. Check path before reversing.",
                learnCards: [
                    { q: "Primary cause of roller accidents?", a: "Poor visibility and blind spots.", options: ["Engine failure.", "Poor visibility and blind spots.", "Low fuel.", "Tire blowouts."], correct: 1 },
                    { q: "What should a roller driver do if they lose sight of ground crew?", a: "Stop immediately.", options: ["Keep moving slowly.", "Sound horn and continue.", "Stop immediately.", "Radio the supervisor."], correct: 2 },
                    { q: "Essential daily check for a roller?", a: "Backup alarm and camera functionality.", options: ["Paint quality.", "Backup alarm and camera functionality.", "Stereo system.", "Air conditioning."], correct: 1 }
                ]
            }
        ]
    }
];

const LIFTING_UNITS = [
    {
        id: "lifting-1", title: "Crane & Piling Stability", completed: false, progress: 0,
        sections: [
            {
                id: "1.1", title: "LMI and Load Charts", criticality: "rust-red",
                completed: false, progress: 0,
                content: "The Load Moment Indicator (LMI) is the primary safety device. Overriding the LMI is a grounds-for-dismissal offense. Always cross-reference the LMI reading with the physical load chart for the current boom/jib configuration.",
                qChatContext: "Why does the center of gravity shift during a piling operation compared to a standard vertical crane lift?",
                summary: "Never override LMI. Cross-reference LMI with physical load chart.",
                learnCards: [
                    { q: "What does LMI stand for?", a: "Load Moment Indicator.", options: ["Large Machine Inspection.", "Lift Movement Interval.", "Load Moment Indicator.", "Lateral Motion Index."], correct: 2 },
                    { q: "Can you lift a load if the LMI is in alarm?", a: "No — reduce load or change configuration.", options: ["Yes, if careful.", "No — reduce load or change configuration.", "Only with supervisor override.", "If the ground is solid."], correct: 1 },
                    { q: "What must be checked before a piling rig mast is raised?", a: "Ground stability and overhead hazards.", options: ["Ground stability and overhead hazards.", "Hydraulic oil color.", "Operator's lunch break.", "Paint on the mast."], correct: 0 }
                ]
            },
            {
                id: "1.2", title: "Ground Bearing & Rigging", criticality: "rust-red",
                completed: false, progress: 0,
                content: "Soft ground is the leading cause of crane tip-overs. Outrigger pads must be used on all surfaces. Inspect all slings, chains, and D-shackles before every shift for wear, stretching, or nicks.",
                qChatContext: "What is the calculation for pressure under an outrigger pad and how do different soils react?",
                summary: "Soft ground risk. Mandatory outrigger pads. Pre-shift rigging inspection.",
                learnCards: [
                    { q: "What should be used under outrigger feet?", a: "Appropriately sized engineered pads/mats.", options: ["Loose rocks.", "Small wooden blocks.", "Appropriately sized engineered pads/mats.", "Nothing if concrete."], correct: 2 },
                    { q: "When should rigging be inspected?", a: "Before every shift.", options: ["Monthly.", "Weekly.", "Before every shift.", "After a heavy lift only."], correct: 2 },
                    { q: "Sign of a failed wire rope?", a: "Bird-caging, broken wires, or kinking.", options: ["Dust on surface.", "Oil on surface.", "Bird-caging, broken wires, or kinking.", "Shiny appearance."], correct: 2 }
                ]
            }
        ]
    }
];

const MARITIME_UNITS = [
    {
        id: "maritime-1", title: "Heavy Marine Lifting (Svanen)", completed: false, progress: 0,
        sections: [
            {
                id: "1.1", title: "Ballast & Marine Stability", criticality: "rust-red",
                completed: false, progress: 0,
                content: "The Svanen uses complex ballast management to maintain stability during 8,000-tonne lifts. Shifting ballast during a lift is a precision operation. Never bypass ballast alarms. Open water conditions must be monitored for swell/wind limits.",
                qChatContext: "Explain the metacentric height (GM) and how it changes when lifting heavy offshore foundations.",
                summary: "Ballast tank management is critical. Swell/wind limits apply for offshore lifting.",
                learnCards: [
                    { q: "Primary stability control on the Svanen?", a: "Precision ballast tank management.", options: ["Anchor chains.", "Precision ballast tank management.", "Speed of the engines.", "Height of the waves."], correct: 1 },
                    { q: "What stops a lift on a heavy lift vessel?", a: "Exceeding wind or wave height (swell) limits.", options: ["Rain.", "Sunset.", "Exceeding wind or wave height (swell) limits.", "Fuel low."], correct: 2 },
                    { q: "Why is swell more dangerous than wind for marine cranes?", a: "It causes un-damped oscillation of the load.", options: ["It makes the deck wet.", "It causes un-damped oscillation of the load.", "It reduces engine power.", "It makes workers seasick."], correct: 1 }
                ]
            }
        ]
    }
];

// ─── Helper to build a machine entry ─────────────────────────────────────────
const img = {
    loader: "https://images.unsplash.com/photo-1590483734731-50e59c5d2634?auto=format&fit=crop&q=80&w=800",
    excavator: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800",
    paver: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=800",
    piling: "https://images.unsplash.com/photo-1517456793574-270fb673323a?auto=format&fit=crop&q=80&w=800",
    crane: "https://images.unsplash.com/photo-1547619292-8816ee7cdd50?auto=format&fit=crop&q=80&w=800",
    roller: "https://images.unsplash.com/photo-1618220044234-fc82500096c4?auto=format&fit=crop&q=80&w=800",
    vessel: "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?auto=format&fit=crop&q=80&w=800",
};

export const machineDB = [
    { id: "wheel_loader", model: "Volvo L70H / L90H", type: "Wheel Loader", image: img.loader, confidence: 0.94, trainingProgress: 45, units: EXCAVATION_UNITS },
    { id: "crawler_excavator", model: "Caterpillar 323 MST", type: "Crawler Excavator", image: img.excavator, confidence: 0.88, trainingProgress: 60, units: EXCAVATION_UNITS },
    { id: "asphalt_paver", model: "Vögele SUPER 1800-3i", type: "Asphalt Paver", image: img.paver, confidence: 0.91, trainingProgress: 30, units: PAVING_UNITS },
    { id: "piling_rig", model: "Junttan PM20LC / PM25", type: "Piling Rig", image: img.piling, confidence: 0.85, trainingProgress: 15, units: LIFTING_UNITS },
    { id: "crawler_crane", model: "Liebherr HS 855 HD", type: "Crawler Crane", image: img.crane, confidence: 0.92, trainingProgress: 50, units: LIFTING_UNITS },
    { id: "tower_crane", model: "Potain MDT 389 / MDT 489", type: "Tower Crane", image: img.crane, confidence: 0.89, trainingProgress: 25, units: LIFTING_UNITS },
    { id: "three_wheel_roller", model: "Hamm HW 90", type: "Three-Wheel Roller", image: img.roller, confidence: 0.87, trainingProgress: 20, units: PAVING_UNITS },
    { id: "mobile_excavator", model: "Hitachi ZX140W", type: "Mobile Excavator", image: img.excavator, confidence: 0.84, trainingProgress: 40, units: EXCAVATION_UNITS },
    { id: "electric_paver", model: "Dynapac SD25 80C e", type: "Electric Paver", image: img.paver, confidence: 0.90, trainingProgress: 10, units: PAVING_UNITS },
    { id: "heavy_lift_vessel", model: "Svanen", type: "Heavy Lift Vessel", image: img.vessel, confidence: 0.95, trainingProgress: 75, units: MARITIME_UNITS },
];

export const checklistDB = {
    "Wheel Loader": [
        { id: 'c1', label: 'Hydraulic steering response verified', critical: true },
        { id: 'c2', label: 'Bucket locking pins secured', critical: true },
        { id: 'c3', label: 'Brake test (service and parking) passed', critical: true },
        { id: 'c4', label: 'Tire inflation and tread depth OK', critical: false },
        { id: 'c5', label: 'Reverse alarm and beacon verified', critical: true },
    ],
    "Crawler Excavator": [
        { id: 'c1', label: 'Track tension within spec', critical: false },
        { id: 'c2', label: 'Hydraulic fluid level verified', critical: true },
        { id: 'c3', label: 'Swing lock mechanism functional', critical: true },
        { id: 'c4', label: 'Attachment quick-hitch locked', critical: true },
        { id: 'c5', label: 'Fire extinguisher present/charged', critical: true },
    ],
    "Asphalt Paver": [
        { id: 'c1', label: 'Screed heating system operational', critical: true },
        { id: 'c2', label: 'Conveyor chains and slats inspected', critical: true },
        { id: 'c3', label: 'Auger protection guards in place', critical: true },
        { id: 'c4', label: 'Hopper wing locks functional', critical: false },
        { id: 'c5', label: 'Grade and slope sensors calibrated', critical: true },
    ],
    "Piling Rig": [
        { id: 'c1', label: 'Mast hoist cables/chains inspected', critical: true },
        { id: 'c2', label: 'Hammer/drill head oil levels OK', critical: true },
        { id: 'c3', label: 'Outrigger pads seated on solid ground', critical: true },
        { id: 'c4', label: 'Winch limit switches tested', critical: true },
        { id: 'c5', label: 'Drill verticality sensor functional', critical: false },
    ],
    "Crawler Crane": [
        { id: 'c1', label: 'Load Moment Indicator (LMI) zeroed', critical: true },
        { id: 'c2', label: 'Boom hoist wire rope condition OK', critical: true },
        { id: 'c3', label: 'Counterweight locking bolts secured', critical: true },
        { id: 'c4', label: 'Anti-two-block sensor operational', critical: true },
        { id: 'c5', label: 'Anemometer (wind gauge) functional', critical: true },
    ],
    "Tower Crane": [
        { id: 'c1', label: 'Trolley and hoist limit switches tested', critical: true },
        { id: 'c2', label: 'Brake torque for hoist motor verified', critical: true },
        { id: 'c3', label: 'Wind/Aviation lights operational', critical: false },
        { id: 'c4', label: 'Sling/shackle inventory inspected', critical: true },
        { id: 'c5', label: 'Radio communication link tested', critical: true },
    ],
    "Three-Wheel Roller": [
        { id: 'c1', label: 'Water spray system nozzle check', critical: false },
        { id: 'c2', label: 'Scraper bars adjusted to drum', critical: false },
        { id: 'c3', label: 'Drum drive hydraulic test', critical: true },
        { id: 'c4', label: 'Neutral-safety-start functional', critical: true },
        { id: 'c5', label: 'Articulated joint locking pin removed', critical: true },
    ],
    "Mobile Excavator": [
        { id: 'c1', label: 'Stabilizer leg deployment check', critical: true },
        { id: 'c2', label: 'Brake/Transmission lock functional', critical: true },
        { id: 'c3', label: 'Steering axle oscillation lock tested', critical: true },
        { id: 'c4', label: 'Road light and indicator test', critical: false },
        { id: 'c5', label: 'Mirror/Camera visibility verified', critical: true },
    ],
    "Electric Paver": [
        { id: 'c1', label: 'Battery charge level > 80%', critical: true },
        { id: 'c2', label: 'Electric motor cooling system check', critical: true },
        { id: 'c3', label: 'High-voltage cable integrity check', critical: true },
        { id: 'c4', label: 'Charge port cover locked', critical: false },
        { id: 'c5', label: 'Silent-operation beacon functional', critical: true },
    ],
    "Heavy Lift Vessel": [
        { id: 'c1', label: 'Ballast pump / Valve sequence test', critical: true },
        { id: 'c2', label: 'Main hoist winch hydraulic pressure', critical: true },
        { id: 'c3', label: 'Marine VHF radio check confirmed', critical: true },
        { id: 'c4', label: 'Life-saving appliances inspected', critical: true },
        { id: 'c5', label: 'Dynamic Positioning (DP) zeroing', critical: true },
    ],
};

export const translations = {
    en: { welcome: "Welcome to Site Marshall", identify_machine: "Identify Machine", push_to_speak: "Push To Speak", enter_academy: "Enter the Academy" },
    tr: { welcome: "Site Marshall'a HoÅŸ Geldiniz", identify_machine: "Makineyi TanÄ±mla", push_to_speak: "KonuÅŸmak Ä°Ã§in BasÄ±n", enter_academy: "Akademiye Gir" },
    ar: { welcome: "Ù…Ø±Ø­Ø¨Ù‹Ø§ Ø¨ÙƒÙ… ÙÙŠ Site Marshall", identify_machine: "Ø§Ù„ØªØ¹Ø±Ù Ø¹Ù„Ù‰ Ø§Ù„Ø¢Ù„Ø©", push_to_speak: "Ø§Ø¶ØºØ· Ù„Ù„ØªØ­Ø¯Ø«", enter_academy: "Ø¯Ø®ÙˆÙ„ Ø§Ù„Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠØ©" },
    pl: { welcome: "Witamy w Site Marshall", identify_machine: "Zidentyfikuj maszynÄ™", push_to_speak: "NaciÅ›nij, aby mÃ³wiÄ‡", enter_academy: "WejdÅº do Akademii" },
    ro: { welcome: "Bine aÈ›i venit la Site Marshall", identify_machine: "IdentificaÈ›i maÈ™ina", push_to_speak: "ApÄƒsaÈ›i pentru a vorbi", enter_academy: "IntraÈ›i Ã®n Academie" },
    pt: { welcome: "Bem-vindo ao Site Marshall", identify_machine: "Identificar MÃ¡quina", push_to_speak: "Pressione para Falar", enter_academy: "Entrar na Academia" },
    es: { welcome: "Bienvenido a Site Marshall", identify_machine: "Identificar MÃ¡quina", push_to_speak: "Presione para Hablar", enter_academy: "Entrar a la Academia" },
    fr: { welcome: "Bienvenue sur Site Marshall", identify_machine: "Identifier la Machine", push_to_speak: "Appuyez pour Parler", enter_academy: "Entrer dans l'AcadÃ©mie" },
    de: { welcome: "Willkommen bei Site Marshall", identify_machine: "Maschine Identifizieren", push_to_speak: "Zum Sprechen DrÃ¼cken", enter_academy: "Akademie Betreten" },
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
export const constructionSites = [
    { id: 'site-1', name: 'Zuidas Tower Project', location: 'Amsterdam Zuid', activeWorkers: 14, alerts: 1, machines: ['tower_crane', 'crawler_excavator', 'piling_rig'] },
    { id: 'site-2', name: 'A10 Ring Road Extension', location: 'Diemen', activeWorkers: 9, alerts: 0, machines: ['wheel_loader', 'three_wheel_roller'] },
    { id: 'site-3', name: 'Port Expansion Block 7', location: 'IJmuiden', activeWorkers: 21, alerts: 2, machines: ['heavy_lift_vessel', 'crawler_crane', 'mobile_excavator'] },
];

export const detailedChecklistDB = {
    "Wheel Loader": [
        {
            category: "STRUCTURAL",
            items: [
                { id: 'wl-s1', label: 'Bucket locking pins secured', critical: true },
                { id: 'wl-s2', label: 'Loader arms & linkage inspected for cracks', critical: true },
                { id: 'wl-s3', label: 'Quick-coupler safety lock engaged', critical: true },
            ]
        },
        {
            category: "HYDRAULIC",
            items: [
                { id: 'wl-h1', label: 'Hydraulic fluid level within range', critical: true },
                { id: 'wl-h2', label: 'Hydraulic hoses — no leaks or chafing', critical: true },
                { id: 'wl-h3', label: 'Steering response verified (full lock both ways)', critical: true },
            ]
        },
        {
            category: "DRIVETRAIN",
            items: [
                { id: 'wl-d1', label: 'Tyre inflation and tread depth OK', critical: false },
                { id: 'wl-d2', label: 'Service brake test passed', critical: true },
                { id: 'wl-d3', label: 'Parking brake holds on grade', critical: true },
                { id: 'wl-d4', label: 'Transmission fluid level OK', critical: false },
            ]
        },
        {
            category: "SAFETY SYSTEMS",
            items: [
                { id: 'wl-ss1', label: 'Reverse alarm and beacon operational', critical: true },
                { id: 'wl-ss2', label: 'Fire extinguisher present and charged', critical: true },
                { id: 'wl-ss3', label: 'ROPS/FOPS structure undamaged', critical: true },
            ]
        },
    ],
    "Crawler Excavator": [
        {
            category: "STRUCTURAL",
            items: [
                { id: 'ce-s1', label: 'Track tension within spec', critical: false },
                { id: 'ce-s2', label: 'Track shoes and sprockets inspected', critical: false },
                { id: 'ce-s3', label: 'Swing lock mechanism functional', critical: true },
                { id: 'ce-s4', label: 'Attachment quick-hitch safety-locked', critical: true },
            ]
        },
        {
            category: "HYDRAULIC",
            items: [
                { id: 'ce-h1', label: 'Hydraulic fluid level checked', critical: true },
                { id: 'ce-h2', label: 'Hydraulic hoses — no leaks or swelling', critical: true },
                { id: 'ce-h3', label: 'Boom, stick and bucket cylinder seals OK', critical: true },
            ]
        },
        {
            category: "ENGINE",
            items: [
                { id: 'ce-e1', label: 'Engine oil level and coolant checked', critical: true },
                { id: 'ce-e2', label: 'Air filter indicator in green zone', critical: false },
                { id: 'ce-e3', label: 'No abnormal engine noise on startup', critical: true },
            ]
        },
        {
            category: "SAFETY SYSTEMS",
            items: [
                { id: 'ce-ss1', label: 'Fire extinguisher present and charged', critical: true },
                { id: 'ce-ss2', label: 'Camera/proximity warning operational', critical: true },
                { id: 'ce-ss3', label: 'Operator restraint bar functional', critical: true },
            ]
        },
    ],
    "Asphalt Paver": [
        {
            category: "SCREED & HEATING",
            items: [
                { id: 'ap-sh1', label: 'Screed heating system operational', critical: true },
                { id: 'ap-sh2', label: 'Screed plates undamaged and flush', critical: true },
                { id: 'ap-sh3', label: 'Screed extensions locked in position', critical: false },
            ]
        },
        {
            category: "MATERIAL HANDLING",
            items: [
                { id: 'ap-mh1', label: 'Conveyor chains and slats inspected', critical: true },
                { id: 'ap-mh2', label: 'Auger protection guards in place', critical: true },
                { id: 'ap-mh3', label: 'Hopper wing locks functional', critical: false },
                { id: 'ap-mh4', label: 'Push-roller bolts torqued', critical: false },
            ]
        },
        {
            category: "CONTROL SYSTEMS",
            items: [
                { id: 'ap-cs1', label: 'Grade and slope sensors calibrated', critical: true },
                { id: 'ap-cs2', label: 'Automatic screed levelling tested', critical: true },
                { id: 'ap-cs3', label: 'Emergency stop buttons functional', critical: true },
            ]
        },
        {
            category: "SAFETY",
            items: [
                { id: 'ap-ss1', label: 'Crew hot-surface PPE briefed', critical: true },
                { id: 'ap-ss2', label: 'Reverse alarm operational', critical: true },
                { id: 'ap-ss3', label: 'Fire extinguisher present and charged', critical: true },
            ]
        },
    ],
    "Piling Rig": [
        {
            category: "STRUCTURAL",
            items: [
                { id: 'pr-s1', label: 'Mast hoist cables/chains inspected', critical: true },
                { id: 'pr-s2', label: 'Mast base pin locks secured', critical: true },
                { id: 'pr-s3', label: 'Leader guide frame alignment verified', critical: false },
            ]
        },
        {
            category: "HYDRAULIC & DRIVE",
            items: [
                { id: 'pr-hd1', label: 'Hammer/drill head oil levels OK', critical: true },
                { id: 'pr-hd2', label: 'Hydraulic lines — no leaks', critical: true },
                { id: 'pr-hd3', label: 'Winch limit switches tested', critical: true },
            ]
        },
        {
            category: "GROUND STABILITY",
            items: [
                { id: 'pr-gs1', label: 'Outrigger pads seated on solid ground', critical: true },
                { id: 'pr-gs2', label: 'Ground bearing capacity confirmed', critical: true },
                { id: 'pr-gs3', label: 'Level indicator within tolerance', critical: true },
            ]
        },
        {
            category: "SAFETY SYSTEMS",
            items: [
                { id: 'pr-ss1', label: 'Drill verticality sensor functional', critical: false },
                { id: 'pr-ss2', label: 'Exclusion zone marked and enforced', critical: true },
                { id: 'pr-ss3', label: 'Emergency stop accessible and tested', critical: true },
                { id: 'pr-ss4', label: 'Fire extinguisher present and charged', critical: true },
            ]
        },
    ],
    "Crawler Crane": [
        {
            category: "STRUCTURAL",
            items: [
                { id: 'cc-s1', label: 'Check boom assembly for cracks', critical: true },
                { id: 'cc-s2', label: 'Inspect lattice sections — no bent members', critical: true },
                { id: 'cc-s3', label: 'Counterweight locking bolts secured', critical: true },
            ]
        },
        {
            category: "HYDRAULIC & RIGGING",
            items: [
                { id: 'cc-h1', label: 'Hydraulic fluid level checked', critical: true },
                { id: 'cc-h2', label: 'Boom hoist wire rope condition OK', critical: true },
                { id: 'cc-h3', label: 'All slings, chains and D-shackles inspected', critical: true },
                { id: 'cc-h4', label: 'Hook block swivel moves freely', critical: false },
            ]
        },
        {
            category: "SAFETY SYSTEMS",
            items: [
                { id: 'cc-ss1', label: 'Load Moment Indicator (LMI) zeroed', critical: true },
                { id: 'cc-ss2', label: 'Anti-two-block sensor operational', critical: true },
                { id: 'cc-ss3', label: 'Anemometer (wind gauge) functional', critical: true },
            ]
        },
        {
            category: "GROUND & OPERATIONAL",
            items: [
                { id: 'cc-o1', label: 'Outrigger pads seated on rated surfaces', critical: true },
                { id: 'cc-o2', label: 'Swing lock released before operation', critical: true },
                { id: 'cc-o3', label: 'Communication radio tested', critical: true },
                { id: 'cc-o4', label: 'Fire extinguisher present and charged', critical: true },
            ]
        },
    ],
    "Tower Crane": [
        {
            category: "STRUCTURAL",
            items: [
                { id: 'tc-s1', label: 'Mast section bolts torqued', critical: true },
                { id: 'tc-s2', label: 'Jib and counter-jib connections secure', critical: true },
                { id: 'tc-s3', label: 'Tie-in anchors to building verified', critical: true },
            ]
        },
        {
            category: "HOISTING",
            items: [
                { id: 'tc-h1', label: 'Trolley and hoist limit switches tested', critical: true },
                { id: 'tc-h2', label: 'Brake torque for hoist motor verified', critical: true },
                { id: 'tc-h3', label: 'Hoist rope reeving and condition OK', critical: true },
                { id: 'tc-h4', label: 'Hook block latch operational', critical: false },
            ]
        },
        {
            category: "SAFETY SYSTEMS",
            items: [
                { id: 'tc-ss1', label: 'Anemometer and wind alarm functional', critical: true },
                { id: 'tc-ss2', label: 'Aviation/obstruction lights operational', critical: false },
                { id: 'tc-ss3', label: 'Slew brake confirmed operational', critical: true },
            ]
        },
        {
            category: "OPERATIONAL",
            items: [
                { id: 'tc-o1', label: 'Sling/shackle inventory inspected', critical: true },
                { id: 'tc-o2', label: 'Radio communication link tested', critical: true },
                { id: 'tc-o3', label: 'Load chart posted in cab', critical: false },
            ]
        },
    ],
    "Three-Wheel Roller": [
        {
            category: "DRUM & DRIVE",
            items: [
                { id: 'wr-d1', label: 'Drum drive hydraulic test passed', critical: true },
                { id: 'wr-d2', label: 'Scraper bars adjusted to drum surface', critical: false },
                { id: 'wr-d3', label: 'Articulated joint locking pin removed', critical: true },
            ]
        },
        {
            category: "WATER SYSTEM",
            items: [
                { id: 'wr-w1', label: 'Water tank level sufficient', critical: false },
                { id: 'wr-w2', label: 'Water spray nozzles cleared and tested', critical: false },
            ]
        },
        {
            category: "SAFETY SYSTEMS",
            items: [
                { id: 'wr-ss1', label: 'Neutral-safety-start system functional', critical: true },
                { id: 'wr-ss2', label: 'Reverse alarm and beacon operational', critical: true },
                { id: 'wr-ss3', label: 'Backup camera view unobstructed', critical: true },
                { id: 'wr-ss4', label: 'ROPS structure undamaged', critical: true },
            ]
        },
        {
            category: "ENGINE",
            items: [
                { id: 'wr-e1', label: 'Engine oil and coolant levels OK', critical: true },
                { id: 'wr-e2', label: 'No fluid leaks on ground under machine', critical: false },
                { id: 'wr-e3', label: 'Fire extinguisher present and charged', critical: true },
            ]
        },
    ],
    "Mobile Excavator": [
        {
            category: "STRUCTURAL",
            items: [
                { id: 'me-s1', label: 'Stabiliser leg deployment checked', critical: true },
                { id: 'me-s2', label: 'Attachment quick-hitch safety-locked', critical: true },
                { id: 'me-s3', label: 'Boom and stick pins/bushings inspected', critical: false },
            ]
        },
        {
            category: "DRIVETRAIN",
            items: [
                { id: 'me-d1', label: 'Brake and transmission lock functional', critical: true },
                { id: 'me-d2', label: 'Steering axle oscillation lock tested', critical: true },
                { id: 'me-d3', label: 'Tyre pressure and condition checked', critical: false },
            ]
        },
        {
            category: "HYDRAULIC",
            items: [
                { id: 'me-h1', label: 'Hydraulic fluid level verified', critical: true },
                { id: 'me-h2', label: 'No hydraulic leaks on hoses or cylinders', critical: true },
            ]
        },
        {
            category: "SAFETY SYSTEMS",
            items: [
                { id: 'me-ss1', label: 'Road lights and indicators tested', critical: false },
                { id: 'me-ss2', label: 'Mirror and camera visibility verified', critical: true },
                { id: 'me-ss3', label: 'Reverse alarm operational', critical: true },
                { id: 'me-ss4', label: 'Fire extinguisher present and charged', critical: true },
            ]
        },
    ],
    "Electric Paver": [
        {
            category: "ELECTRICAL",
            items: [
                { id: 'ep-e1', label: 'Battery charge level > 80%', critical: true },
                { id: 'ep-e2', label: 'High-voltage cable integrity checked', critical: true },
                { id: 'ep-e3', label: 'Charge port cover locked', critical: false },
                { id: 'ep-e4', label: 'BMS fault codes — none present', critical: true },
            ]
        },
        {
            category: "COOLING & DRIVE",
            items: [
                { id: 'ep-cd1', label: 'Electric motor cooling system operational', critical: true },
                { id: 'ep-cd2', label: 'Inverter cooling fans functional', critical: true },
                { id: 'ep-cd3', label: 'Conveyor and auger drive test passed', critical: true },
            ]
        },
        {
            category: "SCREED",
            items: [
                { id: 'ep-sc1', label: 'Electric screed heating elements active', critical: true },
                { id: 'ep-sc2', label: 'Screed plates flush and undamaged', critical: false },
                { id: 'ep-sc3', label: 'Grade sensor calibrated', critical: true },
            ]
        },
        {
            category: "SAFETY SYSTEMS",
            items: [
                { id: 'ep-ss1', label: 'Silent-mode proximity beacon functional', critical: true },
                { id: 'ep-ss2', label: 'Emergency stop tested', critical: true },
                { id: 'ep-ss3', label: 'Fire extinguisher present and charged', critical: true },
            ]
        },
    ],
    "Heavy Lift Vessel": [
        {
            category: "BALLAST & STABILITY",
            items: [
                { id: 'hlv-b1', label: 'Ballast pump and valve sequence tested', critical: true },
                { id: 'hlv-b2', label: 'Ballast tank levels verified pre-lift', critical: true },
                { id: 'hlv-b3', label: 'Draft readings recorded and within limits', critical: true },
            ]
        },
        {
            category: "CRANE & RIGGING",
            items: [
                { id: 'hlv-c1', label: 'Main hoist winch hydraulic pressure OK', critical: true },
                { id: 'hlv-c2', label: 'Wire rope and sheave condition inspected', critical: true },
                { id: 'hlv-c3', label: 'All rigging gear load-tested and certified', critical: true },
                { id: 'hlv-c4', label: 'Hook block swivel and latch operational', critical: false },
            ]
        },
        {
            category: "NAVIGATION & COMMS",
            items: [
                { id: 'hlv-n1', label: 'Dynamic Positioning (DP) zeroing confirmed', critical: true },
                { id: 'hlv-n2', label: 'Marine VHF radio check confirmed', critical: true },
                { id: 'hlv-n3', label: 'AIS and radar operational', critical: false },
            ]
        },
        {
            category: "SAFETY & MARINE",
            items: [
                { id: 'hlv-ss1', label: 'Life-saving appliances inspected', critical: true },
                { id: 'hlv-ss2', label: 'Swell and wind within operational limits', critical: true },
                { id: 'hlv-ss3', label: 'Fire suppression system armed', critical: true },
            ]
        },
    ],
};

export const workerRegistry = [
    {
        id: "W-4821",
        name: "Mehmet Yilmaz",
        language: "tr",
        assignedMachines: ["wheel_loader", "crawler_excavator"],
        preShiftCompleted: { "wheel_loader": true, "crawler_excavator": false },
        completedSections: ["wheel_loader:1.1", "wheel_loader:1.2", "crawler_excavator:1.1"],
        totalSections: 12,
        lastActive: "14:32"
    },
    {
        id: "W-1105",
        name: "Piotr Kowalski",
        language: "pl",
        assignedMachines: ["asphalt_paver", "three_wheel_roller"],
        preShiftCompleted: { "asphalt_paver": true, "three_wheel_roller": false },
        completedSections: ["asphalt_paver:1.1", "three_wheel_roller:1.1"],
        totalSections: 8,
        lastActive: "14:18"
    },
    {
        id: "W-3390",
        name: "Ahmed Al-Farsi",
        language: "ar",
        assignedMachines: ["crawler_excavator", "heavy_lift_vessel"],
        preShiftCompleted: { "crawler_excavator": true, "heavy_lift_vessel": false },
        completedSections: ["crawler_excavator:1.1", "crawler_excavator:1.2", "heavy_lift_vessel:1.1"],
        totalSections: 10,
        lastActive: "13:41"
    }
];
