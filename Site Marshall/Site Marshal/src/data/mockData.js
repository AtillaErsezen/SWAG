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

const TAMPING_UNITS = [
    {
        id: "unit-1", title: "On-Track Safety & Protection", completed: false, progress: 0,
        sections: [
            {
                id: "1.1", title: "Line Blockage & Exclusion Zones", criticality: "rust-red",
                completed: false, progress: 0,
                content: "A tamping machine must NEVER enter an unprotected line. A formal Engineering Possession must be confirmed before any on-track movement. Exclusion zones extend min 50 m each side of the work site, protected by detonators or signals.",
                qChatContext: "Explain the difference between a line blockage and a possession, and why verbal-only permission is insufficient for tamping operations.",
                summary: "Formal possession required before on-track work. 50m exclusion zones each side. No verbal-only permission.",
                learnCards: [
                    { q: "What must be confirmed before a tamping machine moves on-track?", a: "A formal Engineering Possession.", options: ["Verbal approval from a site supervisor.", "A formal Engineering Possession.", "The nearest signal showing green.", "Track cleared of ballast."], correct: 1 },
                    { q: "Minimum exclusion zone either side of a tamping site?", a: "50 metres.", options: ["10 m.", "25 m.", "50 metres.", "100 m."], correct: 2 },
                    { q: "Can a tamping machine move on verbal permission only?", a: "No — written blockage authority is required.", options: ["Yes, if the supervisor is on site.", "No — written blockage authority is required.", "Yes, during daylight hours only.", "Yes, below 5 km/h."], correct: 1 }
                ]
            },
            {
                id: "1.2", title: "Tamping Tine Safety", criticality: "safety-orange",
                completed: false, progress: 0,
                content: "Tamping tines vibrate at high frequency and penetrate ballast to 450 mm depth. Never reach into the tamping zone while powered. Raise the tamping unit fully before travelling. Inspect tines for wear before each working cycle.",
                qChatContext: "Why is contact with a vibrating tamping tine at operating frequency fatal, and what guarding prevents it?",
                summary: "Never enter tamping zone while powered. Raise unit before travel. Inspect tines before each cycle.",
                learnCards: [
                    { q: "Ballast penetration depth of tamping tines?", a: "Up to 450 mm.", options: ["100 mm.", "200 mm.", "Up to 450 mm.", "600 mm."], correct: 2 },
                    { q: "When must tamping tines be inspected?", a: "Before every working cycle.", options: ["Weekly.", "Monthly.", "Before every working cycle.", "After blockage ends."], correct: 2 },
                    { q: "What must be done before travelling between working positions?", a: "Tamping unit fully raised and locked.", options: ["Reduce to idle.", "Tamping unit fully raised and locked.", "Sound horn twice.", "Confirm with PIC."], correct: 1 }
                ]
            }
        ]
    }
];

const CRANE_UNITS = [
    {
        id: "unit-1", title: "Railway Crane Safety", completed: false, progress: 0,
        sections: [
            {
                id: "1.1", title: "Outrigger Deployment", criticality: "rust-red",
                completed: false, progress: 0,
                content: "All outriggers must be fully extended and locked before any lift. Ground-bearing pads are mandatory under each foot. A competent person must assess ground-bearing capacity — railway ballast and embankments require engineered pads.",
                qChatContext: "How does uneven outrigger settlement cause overload during a railway crane lift?",
                summary: "Outriggers fully extended and locked. Ground pads mandatory. Competent person assesses ground.",
                learnCards: [
                    { q: "Outrigger position before any lift?", a: "Fully extended and mechanically locked.", options: ["Half extended.", "Fully extended and mechanically locked.", "Ballast surface only.", "Retracted for on-track lifts."], correct: 1 },
                    { q: "Can a lift proceed with one outrigger not fully deployed?", a: "No — all outriggers must be fully deployed.", options: ["Yes, under 5 t.", "Yes, for side lifts.", "No — all outriggers must be fully deployed.", "Only for tandem lifts."], correct: 2 },
                    { q: "Who assesses ground-bearing capacity?", a: "A competent person.", options: ["The crane operator.", "Any team member.", "A competent person.", "The network controller."], correct: 2 }
                ]
            },
            {
                id: "1.2", title: "Load Moment Indicator (LMI)", criticality: "rust-red",
                completed: false, progress: 0,
                content: "The LMI must be active at all times. If the alarm triggers, stop all boom and slew movement immediately. Never bypass the LMI. On-track recovery lifts require a formal lift plan per the Network's Vehicle Recovery Procedure.",
                qChatContext: "Why is bypassing the LMI on a railway crane particularly dangerous compared to a road crane?",
                summary: "LMI always active. Stop immediately on alarm. Never bypass. Formal lift plan for recovery lifts.",
                learnCards: [
                    { q: "If LMI alarm activates, first action?", a: "Stop all boom and slew movements.", options: ["Lower load immediately.", "Override and continue.", "Stop all boom and slew movements.", "Radio network controller."], correct: 2 },
                    { q: "Can the LMI be bypassed for a critical recovery lift?", a: "No — bypassing LMI is prohibited.", options: ["Yes, in emergency.", "Supervisor approval required.", "Only at night.", "No — bypassing LMI is prohibited."], correct: 3 },
                    { q: "What document is needed before a vehicle recovery lift?", a: "Formal lift plan signed by appointed person.", options: ["Email from operations.", "Verbal briefing from PIC.", "Formal lift plan signed by appointed person.", "Daily inspection form only."], correct: 2 }
                ]
            }
        ]
    }
];

const GRINDING_UNITS = [
    {
        id: "unit-1", title: "Rail Grinding Safety", completed: false, progress: 0,
        sections: [
            {
                id: "1.1", title: "Spark & Fire Risk", criticality: "rust-red",
                completed: false, progress: 0,
                content: "Rail grinding generates intense sparks that ignite lineside vegetation. A fire watch person must be posted in fire-risk conditions. Water suppression must be operational before work starts. A 30-minute post-work fire patrol is mandatory.",
                qChatContext: "Why is rail grinding classified as a high fire-risk activity and what seasonal restrictions apply?",
                summary: "Sparks ignite vegetation. Fire watch required. Water suppression active. 30-min fire patrol after work.",
                learnCards: [
                    { q: "Duration of mandatory post-work fire patrol?", a: "30 minutes minimum.", options: ["5 min.", "15 min.", "30 minutes minimum.", "60 min."], correct: 2 },
                    { q: "What system must be operational before grinding?", a: "On-board water suppression.", options: ["Track circuit.", "On-board water suppression.", "Adjacent line warning.", "GPS tracking."], correct: 1 },
                    { q: "Highest fire risk condition for grinding?", a: "Dry weather, low humidity, dense vegetation.", options: ["Wet/windy weather.", "Below 5°C.", "Dry weather, low humidity, dense vegetation.", "Night operations."], correct: 2 }
                ]
            },
            {
                id: "1.2", title: "Grinding Stone Inspection", criticality: "safety-orange",
                completed: false, progress: 0,
                content: "Inspect all grinding stones before each shift for cracks or chips. A cracked stone can explode at operating speed. Never exceed the max RPM rating. Discard stones worn below minimum diameter. Store dry and shock-free.",
                qChatContext: "What is the physics of a grinding stone failure at operating speed and what PPE does not protect against it?",
                summary: "Inspect stones before each shift. Never exceed max RPM. Discard at minimum diameter. Store dry.",
                learnCards: [
                    { q: "Consequence of operating a cracked grinding stone?", a: "The stone can explode causing fatal injuries.", options: ["Increased vibration.", "Reduced effectiveness.", "The stone can explode causing fatal injuries.", "Machine stops automatically."], correct: 2 },
                    { q: "When must grinding stones be discarded?", a: "Worn to minimum permitted diameter.", options: ["After every shift.", "Worn to minimum permitted diameter.", "After 100 km grinding.", "Only when visibly cracked."], correct: 1 },
                    { q: "How often must grinding stones be inspected?", a: "Before each shift.", options: ["Weekly.", "Monthly.", "Before each shift.", "When machine slows unexpectedly."], correct: 2 }
                ]
            }
        ]
    }
];

const RENEWAL_UNITS = [
    {
        id: "unit-1", title: "Track Renewal Safety", completed: false, progress: 0,
        sections: [
            {
                id: "1.1", title: "Machine Train Formation", criticality: "rust-red",
                completed: false, progress: 0,
                content: "Renewal machines operate as multi-unit trains. All units must be coupled per the manufacturer's sequence before movement. Never uncouple a wagon on a gradient without applying the handbrake first.",
                qChatContext: "Explain what a runaway wagon event is and how improper handbrake procedures cause them.",
                summary: "Couple per manufacturer sequence. Apply wagon handbrakes before uncoupling on gradients.",
                learnCards: [
                    { q: "Before uncoupling on a gradient?", a: "Apply the wagon handbrake.", options: ["Chain between wagons.", "Apply the wagon handbrake.", "Wooden chocks under wheels.", "Machine emergency brake."], correct: 1 },
                    { q: "What is a runaway wagon?", a: "An uncoupled wagon rolling uncontrolled on a gradient.", options: ["Wagon exceeding speed limit.", "An uncoupled wagon rolling uncontrolled on a gradient.", "Wagon derailing during coupling.", "Wagon vibrating excessively."], correct: 1 },
                    { q: "Can the train travel with a wagon brake defect?", a: "No — all brakes must be in working order.", options: ["Yes, reduced speed.", "Yes, one wagon OK.", "No — all brakes must be in working order.", "Gradient <1% OK."], correct: 2 }
                ]
            },
            {
                id: "1.2", title: "Silica Dust Control", criticality: "safety-orange",
                completed: false, progress: 0,
                content: "Ballast renewal generates crystalline silica dust causing silicosis. FFP3 RPE is mandatory. Water suppression or dust extraction must be operational. Formal dust monitoring is required for operations exceeding 30 minutes.",
                qChatContext: "Why is crystalline silica dust more dangerous than ordinary dust, and why is monitoring mandatory?",
                summary: "Silica dust — FFP3 RPE mandatory. Water suppression required. Monitor dust for operations >30 min.",
                learnCards: [
                    { q: "What substance in ballast dust causes silicosis?", a: "Crystalline silica (quartz).", options: ["Limestone dust.", "Iron oxide.", "Crystalline silica (quartz).", "Granite aggregate."], correct: 2 },
                    { q: "Minimum RPE for ballast renewal work?", a: "FFP3 filtering facepiece.", options: ["FFP1.", "FFP2.", "FFP3 filtering facepiece.", "Full airline set."], correct: 2 },
                    { q: "When is formal silica dust monitoring required?", a: "Operations exceeding 30 minutes.", options: [">2 hours.", ">1 hour.", "Operations exceeding 30 minutes.", "Always, regardless of duration."], correct: 2 }
                ]
            }
        ]
    }
];

const LOCO_UNITS = [
    {
        id: "unit-1", title: "Traction & Electrical Safety", completed: false, progress: 0,
        sections: [
            {
                id: "1.1", title: "Overhead Line Equipment (OLE)", criticality: "rust-red",
                completed: false, progress: 0,
                content: "OLE operates at 25 kV AC or 15 kV AC — instantly fatal on contact. Minimum approach distance is 600 mm. OLE can only be touched after a formal Line Isolation and Earthing certificate is issued and confirmed.",
                qChatContext: "Why can OLE become re-energised without warning even after an isolation has been confirmed?",
                summary: "OLE 25kV/15kV — instantly fatal. Min 600mm approach. Only touch after Line Isolation & Earthing certificate.",
                learnCards: [
                    { q: "Minimum approach distance to live OLE?", a: "600 mm.", options: ["100 mm.", "300 mm.", "600 mm.", "1 metre."], correct: 2 },
                    { q: "When can OLE be physically touched?", a: "Only after Line Isolation and Earthing certificate confirmed.", options: ["Pantograph lowered.", "Substation visually off.", "Only after Line Isolation and Earthing certificate confirmed.", "10 min no train movement."], correct: 2 },
                    { q: "Why is OLE dangerous even when believed isolated?", a: "Voltage can be re-introduced by automatic switching.", options: ["Static build-up.", "Voltage can be re-introduced by automatic switching.", "Wire stays warm.", "Other workers unaware."], correct: 1 }
                ]
            },
            {
                id: "1.2", title: "Brake Testing Before Departure", criticality: "safety-orange",
                completed: false, progress: 0,
                content: "A full brake test is mandatory before any movement. Brake pipe must be charged to 5 bar. A continuity test must confirm all wagon brakes are connected. Departure checklist must be signed before the train moves.",
                qChatContext: "Explain the difference between the automatic brake and independent brake and why both must be tested.",
                summary: "Full brake test before movement. Brake pipe 5 bar. All wagon brakes confirmed. Checklist signed.",
                learnCards: [
                    { q: "Required brake pipe pressure before departure?", a: "5 bar.", options: ["2 bar.", "3.5 bar.", "5 bar.", "7 bar."], correct: 2 },
                    { q: "What confirms all wagon brakes are functional?", a: "The brake continuity test.", options: ["Independent brake application.", "The brake continuity test.", "Visual walk-around.", "Low-speed braking test."], correct: 1 },
                    { q: "If the brake test fails, what happens?", a: "Fault must be rectified before any movement.", options: ["Move at half speed.", "Fault must be rectified before any movement.", "Report and proceed.", "Only automatic brake is mandatory."], correct: 1 }
                ]
            }
        ]
    }
];

// ─── Helper to build a machine entry ─────────────────────────────────────────
const img = {
    rail: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800",
    crane: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800",
    grind: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80&w=800",
    loco: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80&w=800",
};

export const machineDB = [
    // ── Track Tamping Machines ─────────────────────────────────────────────────
    { id: "08-275_Unimat", model: "Plasser 08-275 Unimat", type: "Track Tamping Machine", image: img.rail, confidence: 0.90, trainingProgress: 20, units: TAMPING_UNITS },
    { id: "09-16_CAT", model: "Plasser 09-16 CAT", type: "Track Tamping Machine", image: img.rail, confidence: 0.88, trainingProgress: 15, units: TAMPING_UNITS },
    { id: "09-32_CSM", model: "Plasser 09-32 CSM", type: "Track Tamping Machine", image: img.rail, confidence: 0.85, trainingProgress: 10, units: TAMPING_UNITS },
    { id: "09-3X_Dynamic", model: "Plasser 09-3X Dynamic", type: "Track Tamping Machine", image: img.rail, confidence: 0.87, trainingProgress: 25, units: TAMPING_UNITS },
    { id: "Beaver_Lightweight_Tamper", model: "Beaver Lightweight Tamper", type: "Track Tamping Machine", image: img.rail, confidence: 0.82, trainingProgress: 30, units: TAMPING_UNITS },
    { id: "UnimatExpress_2X-4x4_Dynamic", model: "Unimat Express 2X-4x4 Dynamic", type: "Track Tamping Machine", image: img.rail, confidence: 0.91, trainingProgress: 40, units: TAMPING_UNITS },
    { id: "Unimat_08-475_4S", model: "Unimat 08-475 4S", type: "Track Tamping Machine", image: img.rail, confidence: 0.94, trainingProgress: 60, units: TAMPING_UNITS },
    { id: "Unimat_09-4x4_4S_Dynamic_E\u00c2\u00b3", model: "Unimat 09-4x4/4S Dynamic E\u00b3", type: "Track Tamping Machine", image: img.rail, confidence: 0.89, trainingProgress: 35, units: TAMPING_UNITS },

    // ── Railway Cranes ─────────────────────────────────────────────────────────
    { id: "EDK_1000", model: "EDK 1000 Railway Crane", type: "Railway Crane", image: img.crane, confidence: 0.88, trainingProgress: 30, units: CRANE_UNITS },
    { id: "EDK_750", model: "EDK 750 Railway Crane", type: "Railway Crane", image: img.crane, confidence: 0.85, trainingProgress: 20, units: CRANE_UNITS },
    { id: "Kirow_GPC", model: "Kirow GPC", type: "Railway Crane", image: img.crane, confidence: 0.86, trainingProgress: 25, units: CRANE_UNITS },
    { id: "Kirow_KRC_1200", model: "Kirow KRC 1200", type: "Railway Crane", image: img.crane, confidence: 0.90, trainingProgress: 40, units: CRANE_UNITS },
    { id: "Kirow_KRC_1600", model: "Kirow KRC 1600", type: "Railway Crane", image: img.crane, confidence: 0.92, trainingProgress: 45, units: CRANE_UNITS },
    { id: "Kirow_KRC_400", model: "Kirow KRC 400", type: "Railway Crane", image: img.crane, confidence: 0.84, trainingProgress: 15, units: CRANE_UNITS },
    { id: "Kirow_KRC_810", model: "Kirow KRC 810", type: "Railway Crane", image: img.crane, confidence: 0.88, trainingProgress: 45, units: CRANE_UNITS },
    { id: "Kirow_KRC_910", model: "Kirow KRC 910", type: "Railway Crane", image: img.crane, confidence: 0.87, trainingProgress: 35, units: CRANE_UNITS },

    // ── Rail Grinding Machines ─────────────────────────────────────────────────
    { id: "HSG-city", model: "HSG-city Rail Grinder", type: "Rail Grinding Machine", image: img.grind, confidence: 0.83, trainingProgress: 20, units: GRINDING_UNITS },
    { id: "MG_31_Rail_Grinding_Machine", model: "MG 31 Rail Grinding Machine", type: "Rail Grinding Machine", image: img.grind, confidence: 0.87, trainingProgress: 30, units: GRINDING_UNITS },
    { id: "SF_03_Rail_Milling_Machine", model: "SF 03 Rail Milling Machine", type: "Rail Milling Machine", image: img.grind, confidence: 0.85, trainingProgress: 25, units: GRINDING_UNITS },
    { id: "Speno_RR_48", model: "Speno RR-48", type: "Rail Grinding Machine", image: img.grind, confidence: 0.82, trainingProgress: 35, units: GRINDING_UNITS },

    // ── Track Renewal & Maintenance ────────────────────────────────────────────
    { id: "BDS_2000", model: "BDS 2000 Ballast Distribution", type: "Ballast Distribution System", image: img.rail, confidence: 0.80, trainingProgress: 15, units: RENEWAL_UNITS },
    { id: "DGS_62_N", model: "DGS 62 N Dynamic Stabilizer", type: "Dynamic Track Stabilizer", image: img.rail, confidence: 0.83, trainingProgress: 20, units: RENEWAL_UNITS },
    { id: "MFS_100", model: "MFS 100 Material Feeder", type: "Material Feeder / Storage", image: img.rail, confidence: 0.81, trainingProgress: 10, units: RENEWAL_UNITS },
    { id: "MFS_40", model: "MFS 40 Material Feeder", type: "Material Feeder / Storage", image: img.rail, confidence: 0.79, trainingProgress: 10, units: RENEWAL_UNITS },
    { id: "Multi_Tasker_100", model: "Multi Tasker 100", type: "Track Renewal Machine", image: img.rail, confidence: 0.82, trainingProgress: 15, units: RENEWAL_UNITS },
    { id: "Multi_Tasker_160", model: "Multi Tasker 160", type: "Track Renewal Machine", image: img.rail, confidence: 0.84, trainingProgress: 20, units: RENEWAL_UNITS },
    { id: "Plasser_StabilizingTrailer", model: "Plasser Stabilizing Trailer", type: "Dynamic Track Stabilizer", image: img.rail, confidence: 0.80, trainingProgress: 10, units: RENEWAL_UNITS },
    { id: "Plasser_TMT", model: "Plasser TMT", type: "Track Maintenance Train", image: img.rail, confidence: 0.85, trainingProgress: 25, units: RENEWAL_UNITS },
    { id: "PM_1000", model: "PM 1000 Production Tamper", type: "Track Tamping Machine", image: img.rail, confidence: 0.87, trainingProgress: 30, units: RENEWAL_UNITS },
    { id: "RM_800", model: "RM 800 Renewal Machine", type: "Track Renewal Machine", image: img.rail, confidence: 0.86, trainingProgress: 20, units: RENEWAL_UNITS },
    { id: "RM_95-800_W", model: "RM 95-800 W Renewal Machine", type: "Track Renewal Machine", image: img.rail, confidence: 0.84, trainingProgress: 25, units: RENEWAL_UNITS },
    { id: "RPM_900", model: "RPM 900 Renewal Machine", type: "Track Renewal Machine", image: img.rail, confidence: 0.82, trainingProgress: 15, units: RENEWAL_UNITS },
    { id: "RU_800_S", model: "RU 800 S Renewal Machine", type: "Track Renewal Machine", image: img.rail, confidence: 0.80, trainingProgress: 10, units: RENEWAL_UNITS },
    { id: "SSP_110_SW", model: "SSP 110 SW Switch Renewal", type: "Switch & Crossing Renewal", image: img.rail, confidence: 0.83, trainingProgress: 20, units: RENEWAL_UNITS },

    // ── Locomotives & Multi-Purpose Vehicles ───────────────────────────────────
    { id: "Alstom_Prima_H3", model: "Alstom Prima H3", type: "Hybrid Locomotive", image: img.loco, confidence: 0.86, trainingProgress: 40, units: LOCO_UNITS },
    { id: "Bombardier_TRAXX", model: "Bombardier TRAXX", type: "Electric Locomotive", image: img.loco, confidence: 0.90, trainingProgress: 50, units: LOCO_UNITS },
    { id: "BR_711.1", model: "DB BR 711.1", type: "Track Inspection Vehicle", image: img.loco, confidence: 0.85, trainingProgress: 30, units: LOCO_UNITS },
    { id: "BR_714", model: "DB BR 714", type: "Track Inspection Vehicle", image: img.loco, confidence: 0.83, trainingProgress: 25, units: LOCO_UNITS },
    { id: "CatenaryCrafter_15.4_E\u00c2\u00b3", model: "Catenary Crafter 15.4 E\u00b3", type: "Catenary Maintenance Vehicle", image: img.loco, confidence: 0.81, trainingProgress: 20, units: LOCO_UNITS },
    { id: "Class_218", model: "DB Class 218", type: "Diesel Locomotive", image: img.loco, confidence: 0.87, trainingProgress: 35, units: LOCO_UNITS },
    { id: "Class_232", model: "DB Class 232", type: "Diesel Locomotive", image: img.loco, confidence: 0.85, trainingProgress: 30, units: LOCO_UNITS },
    { id: "Class_290_V_90", model: "DB Class 290 V90", type: "Shunting Locomotive", image: img.loco, confidence: 0.83, trainingProgress: 25, units: LOCO_UNITS },
    { id: "Class_333_335", model: "Class 333 / 335", type: "Diesel Locomotive", image: img.loco, confidence: 0.82, trainingProgress: 20, units: LOCO_UNITS },
    { id: "G_1206", model: "G 1206", type: "Diesel-Electric Locomotive", image: img.loco, confidence: 0.84, trainingProgress: 30, units: LOCO_UNITS },
    { id: "ROBEL_Mobile_Maintenance_Unit", model: "ROBEL Mobile Maintenance Unit", type: "Multi-Purpose Vehicle", image: img.loco, confidence: 0.80, trainingProgress: 15, units: LOCO_UNITS },
    { id: "Siemens_Vectron", model: "Siemens Vectron", type: "Electric Locomotive", image: img.loco, confidence: 0.92, trainingProgress: 55, units: LOCO_UNITS },
    { id: "Vossloh_DM_20-BDD", model: "Vossloh DM 20 BDD", type: "Diesel-Hydraulic Shunter", image: img.loco, confidence: 0.83, trainingProgress: 25, units: LOCO_UNITS },
    { id: "Vossloh_Gravita", model: "Vossloh Gravita", type: "Diesel Locomotive", image: img.loco, confidence: 0.86, trainingProgress: 35, units: LOCO_UNITS },
    { id: "Windhoff_MPV", model: "Windhoff MPV", type: "Multi-Purpose Vehicle", image: img.loco, confidence: 0.84, trainingProgress: 30, units: LOCO_UNITS },
    { id: "ZPW_4.5", model: "ZPW 4.5 Track Circuit", type: "Track Circuit Equipment", image: img.loco, confidence: 0.79, trainingProgress: 10, units: LOCO_UNITS },
];
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
