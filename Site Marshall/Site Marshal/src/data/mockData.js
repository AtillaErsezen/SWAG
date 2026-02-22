// ============================================================
// Site Marshall — Mock Data Layer
// ============================================================

export const languages = [
    { code: 'en', name: 'English', native: 'English', flag: 'GB' },
    { code: 'tr', name: 'Turkish', native: 'Türkçe', flag: 'TR' },
    { code: 'ar', name: 'Arabic', native: 'العربية', flag: 'SA' },
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
// This file defines the structured training content for all
// machines in the fleet. Each machine contains Units (training
// modules) which contain Sections (individual safety topics).
// ============================================================

export const translations = {
    en: { welcome: "Welcome to Site Marshall", identify_machine: "Identify Machine", push_to_speak: "Push To Speak", enter_academy: "Enter the Academy" },
    tr: { welcome: "Site Marshall'a Hoş Geldiniz", identify_machine: "Makineyi Tanımla", push_to_speak: "Konuşmak İçin Basın", enter_academy: "Akademiye Gir" },
    ar: { welcome: "مرحبًا بكم في Site Marshall", identify_machine: "التعرف على الآلة", push_to_speak: "اضغط للتحدث", enter_academy: "دخول الأكاديمية" },
    pl: { welcome: "Witamy w Site Marshall", identify_machine: "Zidentyfikuj maszynę", push_to_speak: "Naciśnij, aby mówić", enter_academy: "Wejdź do Akademii" },
    ro: { welcome: "Bine ați venit la Site Marshall", identify_machine: "Identificați mașina", push_to_speak: "Apăsați pentru a vorbi", enter_academy: "Intrați în Academie" },
    pt: { welcome: "Bem-vindo ao Site Marshall", identify_machine: "Identificar Máquina", push_to_speak: "Pressione para Falar", enter_academy: "Entrar na Academia" },
    es: { welcome: "Bienvenido a Site Marshall", identify_machine: "Identificar Máquina", push_to_speak: "Presione para Hablar", enter_academy: "Entrar a la Academia" },
    fr: { welcome: "Bienvenue sur Site Marshall", identify_machine: "Identifier la Machine", push_to_speak: "Appuyez pour Parler", enter_academy: "Entrer dans l'Académie" },
    de: { welcome: "Willkommen bei Site Marshall", identify_machine: "Maschine Identifizieren", push_to_speak: "Zum Sprechen Drücken", enter_academy: "Akademie Betreten" },
    it: { welcome: "Benvenuto su Site Marshall", identify_machine: "Identificare la Macchina", push_to_speak: "Premi per Parlare", enter_academy: "Entra nell'Accademia" },
    nl: { welcome: "Welkom bij Site Marshall", identify_machine: "Machine Identificeren", push_to_speak: "Druk om te Spreken", enter_academy: "Ga naar de Academie" },
    el: { welcome: "Καλώς ήρθατε στο Site Marshall", identify_machine: "Αναγνώριση Μηχανήματος", push_to_speak: "Πατήστε για Ομιλία", enter_academy: "Είσοδος στην Ακαδημία" },
    hu: { welcome: "Üdvözöljük a Site Marshall-ban", identify_machine: "Gép Azonosítása", push_to_speak: "Nyomja meg a Beszédhez", enter_academy: "Belépés az Akadémiára" },
    cs: { welcome: "Vítejte v Site Marshall", identify_machine: "Identifikovat Stroj", push_to_speak: "Stiskněte pro Mluvení", enter_academy: "Vstupte do Akademie" },
    bg: { welcome: "Добре дошли в Site Marshall", identify_machine: "Идентифициране на Машина", push_to_speak: "Натиснете за Говорене", enter_academy: "Влезте в Академията" },
    uk: { welcome: "Ласкаво просимо до Site Marshall", identify_machine: "Ідентифікувати Машину", push_to_speak: "Натисніть, щоб Говорити", enter_academy: "Увійти до Академії" },
    sr: { welcome: "Добродошли у Site Marshall", identify_machine: "Идентификовати Машину", push_to_speak: "Притисните за Говор", enter_academy: "Уђите у Академију" },
    hi: { welcome: "Site Marshall में आपका स्वागत है", identify_machine: "मशीन की पहचान करें", push_to_speak: "बोलने के लिए दबाएं", enter_academy: "अकादमी में प्रवेश करें" },
    bn: { welcome: "Site Marshall-এ স্বাগতম", identify_machine: "মেশিন শনাক্ত করুন", push_to_speak: "কথা বলতে চাপুন", enter_academy: "একাডেমিতে প্রবেশ করুন" },
    ur: { welcome: "Site Marshall میں خوش آمدید", identify_machine: "مشین کی شناخت کریں", push_to_speak: "بولنے کے لیے دبائیں", enter_academy: "اکیڈمی میں داخل ہوں" },
    id: { welcome: "Selamat Datang di Site Marshall", identify_machine: "Identifikasi Mesin", push_to_speak: "Tekan untuk Berbicara", enter_academy: "Masuk ke Akademi" },
};

export const machineDB = [
    {
        id: "m-1",
        model: "Caterpillar 320",
        type: "Excavator",
        image: "https://images.unsplash.com/photo-1541888081698-fa327429177a?auto=format&fit=crop&q=80&w=800",
        manualUrl: "cat_320.json",
        confidence: 0.94,
        trainingProgress: 55,
        units: [
            {
                id: "unit-1",
                title: "Pre-Operation Safety Checks",
                completed: true,
                progress: 100,
                sections: [
                    {
                        id: "1.1",
                        title: "Emergency Shut-Down Procedures",
                        criticality: "rust-red",
                        completed: true,
                        progress: 100,
                        content: "In the event of any emergency, immediately press the engine stop button located on the right side of the operator's console. If the engine does not stop, use the fuel shut-off valve located behind the cab. Never attempt to exit the cab while the machine is still in motion or the boom is elevated.",
                        qChatContext: "Explain the difference between a normal shutdown sequence and an emergency shutdown, and why exiting a moving excavator is fatal.",
                        summary: "Use the engine stop button for emergencies. Fuel shut-off is the backup. Never exit while the machine is moving or boom is up.",
                        learnCards: [
                            { q: "Where is the emergency engine stop button?", a: "Right side of the operator's console." },
                            { q: "What is the backup shutdown method?", a: "The fuel shut-off valve behind the cab." },
                            { q: "Can you exit the cab during an emergency with boom elevated?", a: "Never. The boom must be lowered first." }
                        ]
                    },
                    {
                        id: "1.2",
                        title: "Hydraulic System Integrity Check",
                        criticality: "safety-orange",
                        completed: true,
                        progress: 100,
                        content: "Before each shift, visually inspect all hydraulic hoses, fittings, and cylinders for leaks, cracks, abrasion, or bulging. Check the hydraulic oil level using the sight gauge on the tank. Oil should be between the minimum and maximum marks when the machine is on level ground with all cylinders retracted.",
                        qChatContext: "Discuss why hydraulic system failure is the most common cause of excavator accidents and how a simple visual check prevents 80% of incidents.",
                        summary: "Inspect hoses, fittings, cylinders for damage. Check oil level via sight gauge on level ground with cylinders retracted.",
                        learnCards: [
                            { q: "How do you check hydraulic oil level?", a: "Sight gauge on the tank, machine on level ground, cylinders retracted." },
                            { q: "What should you look for on hoses?", a: "Leaks, cracks, abrasion, or bulging." }
                        ]
                    },
                    {
                        id: "1.3",
                        title: "Daily Walkaround Inspection",
                        criticality: "sage-green",
                        completed: true,
                        progress: 100,
                        content: "Perform a 360-degree walkaround inspection before every shift. Check tire/track condition, mirror alignment, lighting functionality, and ensure no personnel or obstacles are within the machine's swing radius. Document findings on the inspection form.",
                        qChatContext: "Explain the concept of the 'exclusion zone' and why a walkaround must be performed even if the previous operator just finished their shift.",
                        summary: "360-degree check: tracks, mirrors, lights, swing radius clear. Document everything.",
                        learnCards: [
                            { q: "When must a walkaround be performed?", a: "Before every shift, regardless of who operated previously." },
                            { q: "What is the minimum number of directions to inspect?", a: "360 degrees — all sides including top and underneath." }
                        ]
                    }
                ]
            },
            {
                id: "unit-2",
                title: "Excavation Operations",
                completed: false,
                progress: 50,
                sections: [
                    {
                        id: "2.1",
                        title: "Trench Collapse Prevention",
                        criticality: "rust-red",
                        completed: true,
                        progress: 100,
                        content: "Never position the excavator at the edge of an unshored trench. Maintain a minimum setback distance equal to the depth of the trench. Soil type, moisture content, and vibration from the excavator itself can trigger sudden collapse. Trenches deeper than 1.5 meters require shoring, sloping, or a trench shield.",
                        qChatContext: "Discuss the OSHA fatal four and how trench collapse incidents account for a disproportionate number of construction fatalities. Explain why clay soil is more treacherous than sandy soil in this context.",
                        summary: "Keep distance from unshored trenches equal to trench depth. Trenches over 1.5m need shoring or shields.",
                        learnCards: [
                            { q: "What is the minimum setback from an unshored trench?", a: "Equal to the depth of the trench." },
                            { q: "At what depth does a trench require shoring?", a: "1.5 meters (5 feet)." },
                            { q: "What factors can trigger trench collapse?", a: "Soil type, moisture content, and machine vibration." }
                        ]
                    },
                    {
                        id: "2.2",
                        title: "Underground Services Detection",
                        criticality: "rust-red",
                        completed: false,
                        progress: 40,
                        content: "Before any excavation, obtain and review utility maps. Use a Cable Avoidance Tool (CAT) and signal generator to scan the dig area. Hand-dig trial holes within 500mm of any detected utility. Striking a gas line or high-voltage cable is immediately fatal and can cause secondary explosions affecting the entire site.",
                        qChatContext: "Explain the difference between a CAT scan and a GPR scan, and why both are sometimes necessary. Discuss what happens physically when an excavator bucket hits a 33kV cable.",
                        summary: "Review utility maps. CAT-scan the area. Hand-dig within 500mm of detected services. Striking cables is fatal.",
                        learnCards: [
                            { q: "What must be done before excavating near utilities?", a: "Review maps, CAT-scan, and hand-dig trial holes within 500mm." },
                            { q: "What tool detects buried cables?", a: "Cable Avoidance Tool (CAT) with a signal generator." }
                        ]
                    },
                    {
                        id: "2.3",
                        title: "Spoil Pile Management",
                        criticality: "sage-green",
                        completed: false,
                        progress: 0,
                        content: "Place spoil piles at least 1 meter from the edge of any excavation. Material must be placed on the side opposite to the access point. Do not stack spoil higher than 2 meters unless it is battered back at a safe angle. Contaminated soil must be segregated and stored on impermeable sheeting.",
                        qChatContext: "Discuss the surcharge loading effect of spoil piles on trench walls and why placement on the access side is dangerous.",
                        summary: "Spoil 1m from edge, opposite side from access. Max 2m high unless battered. Contaminated soil on sheeting.",
                        learnCards: [
                            { q: "How far from a trench edge must spoil be placed?", a: "At least 1 meter." },
                            { q: "Where should spoil be placed relative to the access point?", a: "On the opposite side." }
                        ]
                    }
                ]
            },
            {
                id: "unit-3",
                title: "Load Handling and Lifting",
                completed: false,
                progress: 20,
                sections: [
                    {
                        id: "3.1",
                        title: "Rated Capacity and Load Charts",
                        criticality: "rust-red",
                        completed: false,
                        progress: 40,
                        content: "The CAT 320 has a maximum rated lifting capacity that varies with boom extension, arm angle, and machine orientation. Always consult the load chart before any lift. The load chart assumes firm, level ground and no wind. Actual capacity is reduced by soft ground, slopes, and wind loads. Never exceed 80% of rated capacity for routine lifts.",
                        qChatContext: "Explain the relationship between the radius of the load, boom angle, and the tipping line. Discuss moment arm physics in simple terms.",
                        summary: "Consult load chart before every lift. Max 80% of rated capacity for routine work. Capacity drops with extension and slope.",
                        learnCards: [
                            { q: "What percentage of rated capacity should routine lifts stay under?", a: "80%." },
                            { q: "What factors reduce actual lifting capacity below rated?", a: "Soft ground, slopes, wind, and boom extension." }
                        ]
                    },
                    {
                        id: "3.2",
                        title: "Sling and Rigging Inspection",
                        criticality: "safety-orange",
                        completed: false,
                        progress: 0,
                        content: "Inspect all slings, shackles, and lifting accessories before each use. Reject any sling with visible damage, corrosion, or missing identification tags. Wire rope slings must be discarded if they show more than 6 broken wires in one lay length. Synthetic slings must be discarded if they show cuts, burns, or UV degradation.",
                        qChatContext: "Discuss the concept of Working Load Limit (WLL) versus breaking strength, and the safety factor of 5:1 used in construction lifting.",
                        summary: "Inspect all slings and rigging before use. Reject damaged, corroded, or tag-less items. 6+ broken wires = discard.",
                        learnCards: [
                            { q: "When must a wire rope sling be discarded?", a: "When it shows more than 6 broken wires in one lay length." },
                            { q: "What must every sling have to be used?", a: "A visible, legible identification tag." }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: "m-2",
        model: "Komatsu PC210",
        type: "Excavator",
        image: "https://images.unsplash.com/photo-1590487988256-9ed24133863e?auto=format&fit=crop&q=80&w=800",
        manualUrl: "kom_pc210.json",
        confidence: 0.76,
        trainingProgress: 40,
        units: [
            {
                id: "unit-1",
                title: "Hydraulic System Safety",
                completed: false,
                progress: 75,
                sections: [
                    {
                        id: "1.1",
                        title: "High-Pressure Line Rupture Protocol",
                        criticality: "rust-red",
                        completed: true,
                        progress: 100,
                        content: "Never attempt to locate a hydraulic leak by running your hand over suspected lines. A pinhole leak in a high-pressure hydraulic line (operating at 3,000+ PSI) can inject fluid through the skin, causing tissue necrosis and potential amputation. Use a piece of cardboard or a thermal imaging device to detect leaks from a safe distance.",
                        qChatContext: "Discuss the dangers of hydraulic injection injuries and why they are often initially painless despite being life-threatening.",
                        summary: "High-pressure hydraulic lines can inject fluid through skin. Never hand-test for leaks. Use cardboard or thermal imaging.",
                        learnCards: [
                            { q: "Why should you never run your hand along a hydraulic line?", a: "A pinhole leak can inject fluid through skin at 3,000+ PSI, causing tissue death." },
                            { q: "What is the safe method to locate a hydraulic leak?", a: "Use a piece of cardboard or a thermal/UV detection kit." }
                        ]
                    },
                    {
                        id: "1.2",
                        title: "Accumulator Bleed-Down Procedure",
                        criticality: "safety-orange",
                        completed: false,
                        progress: 50,
                        content: "Before performing any maintenance on the hydraulic system, ensure the engine is off and that all accumulators have been properly bled down. Residual stored energy in hydraulic accumulators can cause sudden, violent movement of hydraulic cylinders even after the engine is stopped. Follow the manufacturer's bleed-down procedure precisely.",
                        qChatContext: "Explain the concept of stored energy in hydraulic accumulators and why bleed-down must be verified before maintenance begins.",
                        summary: "Bleed all accumulators before hydraulic maintenance. Residual pressure causes uncontrolled cylinder movement.",
                        learnCards: [
                            { q: "What must be done before hydraulic maintenance?", a: "Engine off and all accumulators bled down to zero pressure." },
                            { q: "Why are accumulators dangerous after engine shutdown?", a: "They store residual energy that can cause sudden cylinder movement." }
                        ]
                    }
                ]
            },
            {
                id: "unit-2",
                title: "Boom and Arm Operation",
                completed: false,
                progress: 25,
                sections: [
                    {
                        id: "2.1",
                        title: "Overhead Power Line Clearance",
                        criticality: "rust-red",
                        completed: false,
                        progress: 25,
                        content: "Maintain a minimum clearance of 10 feet (3.05m) from overhead power lines rated at 50kV or less. For lines above 50kV, add 4 inches of clearance for every additional 10kV. Contact with energized lines causes immediate electrocution. Even proximity without contact can cause arcing at high voltages.",
                        qChatContext: "Discuss the physics of electrical arcing and why clearance distances increase with voltage. Explain the concept of step potential and why rubber-tyred machines are not immune.",
                        summary: "Minimum 10ft clearance from power lines at 50kV or less. Add 4 inches per additional 10kV. Fatal on contact or arc.",
                        learnCards: [
                            { q: "What is the minimum clearance from power lines at 50kV?", a: "10 feet (3.05 meters)." },
                            { q: "What happens to clearance requirements above 50kV?", a: "Add 4 inches for every additional 10kV." },
                            { q: "Is contact required for electrocution near power lines?", a: "No. Arcing can occur at high voltages without physical contact." }
                        ]
                    },
                    {
                        id: "2.2",
                        title: "Swing Radius Hazard Zone",
                        criticality: "rust-red",
                        completed: false,
                        progress: 30,
                        content: "The rear of the excavator superstructure extends beyond the track width when the machine swings. This creates a crush zone between the counterweight and any fixed object (walls, vehicles, other machinery). Barricade the swing radius with cones, tape, or a designated banksman. No personnel should be allowed within the swing radius during operation.",
                        qChatContext: "Discuss the concept of 'pinch points' in excavator operation and why the rear counterweight swing is the most dangerous zone on any excavator.",
                        summary: "The counterweight extends past tracks during swing, creating a crush zone. Barricade and use a banksman. No personnel inside swing radius.",
                        learnCards: [
                            { q: "Where is the most dangerous zone on a swinging excavator?", a: "Between the rear counterweight and any fixed object." },
                            { q: "How should the swing radius be controlled?", a: "Barricades, cones, tape, and a designated banksman." }
                        ]
                    },
                    {
                        id: "2.3",
                        title: "Load Chart Compliance",
                        criticality: "sage-green",
                        completed: false,
                        progress: 0,
                        content: "Always consult the machine's load chart before lifting operations. The rated lift capacity decreases as the boom extends and as the load radius increases. Ground conditions, slope angle, and wind loads further reduce actual safe lifting capacity below the chart values.",
                        qChatContext: "Explain how boom length, radius, and ground conditions affect the actual safe lifting capacity versus the rated capacity.",
                        summary: "Consult load charts before every lift. Capacity decreases with extension, radius, slope, and wind.",
                        learnCards: [
                            { q: "What document must be consulted before any lift?", a: "The machine-specific load chart." },
                            { q: "Besides boom extension, what reduces lifting capacity?", a: "Ground conditions, slope, and wind." }
                        ]
                    }
                ]
            },
            {
                id: "unit-3",
                title: "Environmental and Site Awareness",
                completed: false,
                progress: 15,
                sections: [
                    {
                        id: "3.1",
                        title: "Working Near Water Bodies",
                        criticality: "rust-red",
                        completed: false,
                        progress: 30,
                        content: "When operating within 10 meters of any water body (rivers, canals, retention ponds), additional precautions are mandatory. The ground near water bodies is inherently unstable due to saturation. Use geotechnical data to confirm bearing capacity. Ensure rescue equipment (life rings, throw lines) is available on site. The machine must be positioned with its tracks perpendicular to the water's edge for maximum stability.",
                        qChatContext: "Explain the relationship between soil saturation, bearing capacity, and machine stability near water. Discuss why toppling into water is almost always fatal for the operator.",
                        summary: "Within 10m of water: verify ground bearing, position tracks perpendicular, have rescue equipment. Saturated soil fails without warning.",
                        learnCards: [
                            { q: "How should apparatus track orientation be relative to water?", a: "Perpendicular to the water's edge for maximum stability." },
                            { q: "What rescue equipment must be available near water?", a: "Life rings and throw lines." }
                        ]
                    },
                    {
                        id: "3.2",
                        title: "Dust and Airborne Hazard Control",
                        criticality: "safety-orange",
                        completed: false,
                        progress: 0,
                        content: "Excavation in dry conditions generates significant airborne dust, including silica particles that cause irreversible lung disease (silicosis). Use water suppression systems to dampen the work area. If silica-bearing rock or concrete is being broken, RPE (Respiratory Protective Equipment) rated FFP3 or higher is mandatory for all personnel within 50 meters.",
                        qChatContext: "Discuss the latency period of silicosis and why construction workers often do not realize they have the disease until it is advanced and irreversible.",
                        summary: "Dry excavation creates silica dust causing silicosis. Water suppression mandatory. FFP3 RPE within 50m of silica work.",
                        learnCards: [
                            { q: "What lung disease does silica dust cause?", a: "Silicosis — irreversible lung scarring." },
                            { q: "What RPE grade is needed for silica exposure?", a: "FFP3 or higher." }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: "m-3",
        model: "Liebherr LTM 11200-9.1",
        type: "Mobile Crane",
        image: "https://images.unsplash.com/photo-1601700676451-b9b5f5d6f125?auto=format&fit=crop&q=80&w=800",
        manualUrl: null,
        confidence: 0.81,
        trainingProgress: 30,
        units: [
            {
                id: "unit-1",
                title: "Outrigger Deployment and Ground Bearing",
                completed: false,
                progress: 55,
                sections: [
                    {
                        id: "1.1",
                        title: "Ground Bearing Pressure Assessment",
                        criticality: "rust-red",
                        completed: true,
                        progress: 100,
                        content: "Before deploying outriggers, assess the ground bearing capacity. The LTM 11200-9.1 exerts up to 32 tonnes per outrigger pad. Soft ground, buried utilities, voids, or recent backfill can cause catastrophic tip-over. Use timber mats rated for the imposed load. A geotechnical survey may be required for lifts exceeding 100 tonnes.",
                        qChatContext: "Explain how ground bearing pressure is calculated and why soil type classification (granular vs. cohesive) matters for crane stability.",
                        summary: "Check ground capacity before outrigger deployment. Up to 32t per pad. Use rated timber mats on soft ground.",
                        learnCards: [
                            { q: "What is the max outrigger pad pressure on the LTM 11200?", a: "Up to 32 tonnes per pad." },
                            { q: "What must be placed under outriggers on soft ground?", a: "Timber mats rated for the imposed load." },
                            { q: "When is a geotechnical survey required?", a: "For lifts exceeding 100 tonnes." }
                        ]
                    },
                    {
                        id: "1.2",
                        title: "Level Indicator Monitoring",
                        criticality: "safety-orange",
                        completed: false,
                        progress: 40,
                        content: "The crane must be leveled within 0.5 degrees before any lift. Continuously monitor the cab-mounted level indicator during operations. Changes in ground settlement under load can shift the crane out of level mid-lift, catastrophically altering the load moment calculation.",
                        qChatContext: "Discuss how even a 1-degree tilt affects the load moment and stability envelope of a mobile crane at full boom extension.",
                        summary: "Level to within 0.5 degrees. Monitor continuously. Ground settlement shifts level mid-lift.",
                        learnCards: [
                            { q: "What is the maximum allowable tilt for the crane?", a: "0.5 degrees from level." },
                            { q: "What causes mid-lift level changes?", a: "Ground settlement under load." }
                        ]
                    },
                    {
                        id: "1.3",
                        title: "Outrigger Retraction Sequence",
                        criticality: "sage-green",
                        completed: false,
                        progress: 0,
                        content: "Never retract outriggers while the boom is elevated or extended. Ensure the boom is fully telescoped in and lowered to the storage rack before beginning outrigger retraction. Follow the manufacturer's prescribed sequence: rear outriggers first, then front.",
                        qChatContext: "Explain the center of gravity shift that occurs when outriggers are retracted and why boom position matters.",
                        summary: "Boom must be fully retracted and stored before retracting outriggers. Rear first, then front.",
                        learnCards: [
                            { q: "When can outriggers be retracted?", a: "Only after the boom is fully telescoped and stored on the rack." },
                            { q: "What is the outrigger retraction sequence?", a: "Rear outriggers first, then front." }
                        ]
                    }
                ]
            },
            {
                id: "unit-2",
                title: "Wind Speed and Environmental Limits",
                completed: false,
                progress: 15,
                sections: [
                    {
                        id: "2.1",
                        title: "Maximum Wind Speed Thresholds",
                        criticality: "rust-red",
                        completed: false,
                        progress: 30,
                        content: "All lifting operations must cease when sustained wind speed exceeds 20 mph (9 m/s) or gusts exceed 30 mph (13 m/s). At full boom extension (100m), wind loads can exceed the crane's structural margin within seconds. A calibrated anemometer must be mounted at boom tip height and monitored continuously.",
                        qChatContext: "Discuss the relationship between wind load, boom length, and the crane's structural safety factor. Explain why gusts are more dangerous than sustained winds due to dynamic amplification.",
                        summary: "Stop all lifts at sustained 20mph or gusts at 30mph. Anemometer required at boom tip height.",
                        learnCards: [
                            { q: "At what sustained wind speed must operations cease?", a: "20 mph (9 m/s)." },
                            { q: "Where must the anemometer be mounted?", a: "At boom tip height." }
                        ]
                    },
                    {
                        id: "2.2",
                        title: "Lightning and Electrical Storm Protocol",
                        criticality: "rust-red",
                        completed: false,
                        progress: 0,
                        content: "When a thunderstorm is detected within 10 miles (16 km) of the site, all crane operations must cease immediately. The boom must be lowered to its minimum elevation. All personnel must evacuate the crane and move to a designated shelter. The crane is the tallest structure on most sites and acts as a lightning rod.",
                        qChatContext: "Discuss why the 30-30 rule applies to cranes and what happens to a crane operator when lightning strikes the boom.",
                        summary: "Storms within 10 miles: cease operations, lower boom, evacuate crane. The crane is a lightning rod.",
                        learnCards: [
                            { q: "At what distance must operations cease for lightning?", a: "10 miles (16 km)." },
                            { q: "What must be done with the boom?", a: "Lowered to minimum elevation." }
                        ]
                    },
                    {
                        id: "2.3",
                        title: "Temperature Extremes and Steel Fatigue",
                        criticality: "safety-orange",
                        completed: false,
                        progress: 0,
                        content: "Below -20 degrees Celsius, structural steel becomes brittle and fracture risk increases dramatically. The crane's rated capacity must be reduced by 10% for every 10 degrees below -10 C. Pre-heat boom sections per the manufacturer's cold weather protocol before operations. Above +40 C, hydraulic oil viscosity drops, reducing system efficiency and increasing leak risk.",
                        qChatContext: "Explain the concept of ductile-to-brittle transition temperature in structural steel and why cold weather crane failures occur without warning.",
                        summary: "Below -20 C: steel becomes brittle. Reduce capacity 10% per 10 degrees below -10 C. Above +40 C: hydraulic risk increases.",
                        learnCards: [
                            { q: "At what temperature does steel become brittle?", a: "Below -20 degrees Celsius." },
                            { q: "How much is capacity reduced in cold weather?", a: "10% for every 10 degrees below -10 C." }
                        ]
                    }
                ]
            },
            {
                id: "unit-3",
                title: "Rigging and Lift Planning",
                completed: false,
                progress: 10,
                sections: [
                    {
                        id: "3.1",
                        title: "Lift Plan Documentation",
                        criticality: "safety-orange",
                        completed: false,
                        progress: 20,
                        content: "Every lift exceeding 10 tonnes or classified as 'complex' requires a written lift plan signed by the appointed person. The plan must include: load weight, center of gravity, sling configuration, crane capacity at the required radius, ground conditions, weather constraints, and exclusion zone dimensions. All personnel must be briefed on the plan before the lift commences.",
                        qChatContext: "Discuss what constitutes a 'complex lift' and why the center of gravity calculation is frequently the source of critical errors in lift planning.",
                        summary: "Lifts over 10t or complex: written lift plan required. Must cover weight, CoG, slings, capacity, ground, weather, exclusion zones.",
                        learnCards: [
                            { q: "When is a written lift plan required?", a: "For lifts exceeding 10 tonnes or classified as complex." },
                            { q: "What is the most common error in lift planning?", a: "Incorrect center of gravity calculation." }
                        ]
                    },
                    {
                        id: "3.2",
                        title: "Tandem Lifting Procedures",
                        criticality: "rust-red",
                        completed: false,
                        progress: 0,
                        content: "Tandem lifts (two cranes lifting a single load simultaneously) are classified as high-risk operations. Each crane must not exceed 75% of its rated capacity at the planned radius. Both cranes must be operated by experienced operators in direct radio communication. A lift supervisor must maintain visual contact with both cranes at all times.",
                        qChatContext: "Explain why tandem lifts are exponentially more dangerous than single crane lifts due to dynamic load sharing, differential settlement, and communication lag.",
                        summary: "Tandem lifts are high-risk. Max 75% capacity each. Experienced operators with radio. Lift supervisor with visual contact.",
                        learnCards: [
                            { q: "What is the maximum capacity each crane can use in a tandem lift?", a: "75% of rated capacity." },
                            { q: "What communication method is required for tandem lifts?", a: "Direct radio communication between operators." }
                        ]
                    }
                ]
            }
        ]
    }
];

// ============================================================
// Worker Registry — Per-Worker Training and Compliance Data
// ============================================================

export const workerRegistry = [
    {
        id: "W-4821",
        name: "Mehmet Yilmaz",
        language: "tr",
        assignedMachines: ["m-1", "m-2"],
        preShiftCompleted: { "m-1": true, "m-2": false },
        completedSections: ["m-1:1.1", "m-1:1.2", "m-1:1.3", "m-1:2.1", "m-2:1.1"],
        totalSections: 14,
        lastActive: "14:32"
    },
    {
        id: "W-1105",
        name: "Piotr Kowalski",
        language: "pl",
        assignedMachines: ["m-3"],
        preShiftCompleted: { "m-3": true },
        completedSections: ["m-3:1.1"],
        totalSections: 8,
        lastActive: "14:18"
    },
    {
        id: "W-3390",
        name: "Ahmed Al-Farsi",
        language: "ar",
        assignedMachines: ["m-2"],
        preShiftCompleted: { "m-2": true },
        completedSections: ["m-2:1.1", "m-2:2.1"],
        totalSections: 8,
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
        assignedMachines: ["m-1", "m-3"],
        preShiftCompleted: { "m-1": false, "m-3": false },
        completedSections: ["m-1:1.1"],
        totalSections: 16,
        lastActive: "11:45"
    },
    {
        id: "W-6629",
        name: "Carlos Silva",
        language: "pt",
        assignedMachines: ["m-2", "m-3"],
        preShiftCompleted: { "m-2": true, "m-3": false },
        completedSections: ["m-2:1.1", "m-2:1.2", "m-2:2.1", "m-3:1.1", "m-3:1.2"],
        totalSections: 16,
        lastActive: "10:30"
    }
];
