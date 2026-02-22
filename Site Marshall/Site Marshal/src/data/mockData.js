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
                            {
                                q: "Where is the primary emergency engine stop button?",
                                a: "Right side of the operator's console.",
                                options: ["Left side of the operator's console.", "Right side of the operator's console.", "Below the seat on the floor.", "On the external ladder panel."],
                                correct: 1
                            },
                            {
                                q: "What is the backup shutdown method if the cab switch fails?",
                                a: "The fuel shut-off valve behind the cab.",
                                options: ["The hydraulic pressure release valve.", "The battery isolation switch under the seat.", "The fuel shut-off valve behind the cab.", "Disconnecting the engine ECU harness."],
                                correct: 2
                            },
                            {
                                q: "Can you exit the cab during an emergency with the boom elevated?",
                                a: "Never. The boom must be lowered first.",
                                options: ["Yes, if there is immediate danger of fire.", "Yes, if the swing brake is engaged.", "Only if the outriggers are deployed.", "Never. The boom must be lowered first."],
                                correct: 3
                            },
                            {
                                q: "What color is the standardized emergency stop control?",
                                a: "Red button with a yellow background.",
                                options: ["Bright orange for high visibility.", "Red button with a yellow background.", "Solid black with a white 'ISO' symbol.", "Blue to distinguish from fire alarms."],
                                correct: 1
                            },
                            {
                                q: "What should be the first action if an engine fire is detected?",
                                a: "Immediately trigger the emergency stop.",
                                options: ["Immediately trigger the emergency stop.", "Lower the boom to the ground first.", "Notify the site supervisor via radio.", "Discharge the cabin fire extinguisher."],
                                correct: 0
                            },
                            {
                                q: "Where is the external emergency stop located on a CAT 320?",
                                a: "On the left side near the entry ladder.",
                                options: ["Behind the counterweight.", "Next to the hydraulic tank cap.", "On the left side near the entry ladder.", "Inside the engine bay door."],
                                correct: 2
                            },
                            {
                                q: "What position must the hydraulic lock lever be in during shutdown?",
                                a: "Raised (Locked) position.",
                                options: ["Lowered (Active) position.", "Neutral middle position.", "Raised (Locked) position.", "Position does not matter during shutdown."],
                                correct: 2
                            },
                            {
                                q: "What remains a hazard even after the engine has successfully stopped?",
                                a: "Stored energy in hydraulic accumulators.",
                                options: ["Engine cooling fan inertia.", "Residual fuel in the injector lines.", "Stored energy in hydraulic accumulators.", "Electrical discharge from the alternator."],
                                correct: 2
                            },
                            {
                                q: "What is the policy for exiting a moving excavator in an emergency?",
                                a: "Never exit while the machine is in motion.",
                                options: ["Jump clear of the tracks immediately.", "Never exit while the machine is in motion.", "Exit only if the speed is under 2km/h.", "Exit through the rear window secondary escape."],
                                correct: 1
                            },
                            {
                                q: "What is mandatory before restarting after an emergency stop use?",
                                a: "Full mechanical inspection and authorized reset.",
                                options: ["Simply reset the button and restart.", "Wait 5 minutes for the ECU to cycle.", "Full mechanical inspection and authorized reset.", "Refill the fire suppression canister."],
                                correct: 2
                            }
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
                            {
                                q: "How do you check hydraulic oil level on a CAT 320?",
                                a: "Sight gauge on the tank, machine on level ground, cylinders retracted.",
                                options: ["Dipstick inside the hydraulic pump housing.", "Digital readout on the dashboard display.", "Sight gauge on the tank, machine on level ground, cylinders retracted.", "Drain plug test at the bottom of the reservoir."],
                                correct: 2
                            },
                            {
                                q: "What should you look for on hydraulic hoses during inspection?",
                                a: "Leaks, cracks, abrasion, or bulging.",
                                options: ["Discolouration and temperature difference only.", "Leaks, cracks, abrasion, or bulging.", "Only visible oil stains on the ground.", "Loose end fittings and connector clips."],
                                correct: 1
                            },
                            {
                                q: "What indicates air has entered the hydraulic system?",
                                a: "Foaming oil in the sight glass and 'spongy' controls.",
                                options: ["Oil turning a dark black color.", "Foaming oil in the sight glass and 'spongy' controls.", "Increased engine RPM at idle.", "A high-pitched whistling from the exhaust."],
                                correct: 1
                            },
                            {
                                q: "What is the primary danger of hydraulic oil contamination?",
                                a: "Accelerated wear of precision pump and valve components.",
                                options: ["Increased risk of hydraulic fire.", "Accelerated wear of precision pump and valve components.", "Reducing the lifting capacity by 50%.", "Causing the engine to overheat."],
                                correct: 1
                            },
                            {
                                q: "How should you verify the temperature of a hydraulic line?",
                                a: "Use a non-contact infrared thermometer.",
                                options: ["Quickly tap with the back of your hand.", "Use a non-contact infrared thermometer.", "Apply a drop of water and watch for steam.", "There is no need to check line temperature."],
                                correct: 1
                            },
                            {
                                q: "What is the first step before opening the hydraulic tank filler cap?",
                                a: "Clean the cap and surrounding area thoroughly.",
                                options: ["Release tank pressure using the relief valve.", "Clean the cap and surrounding area thoroughly.", "Ensure the engine is running to maintain pressure.", "Drain at least 5 liters of oil first."],
                                correct: 1
                            },
                            {
                                q: "What does 'milky' hydraulic oil usually signify?",
                                a: "Water contamination in the system.",
                                options: ["Air bubbles trapped in the oil.", "Water contamination in the system.", "Overheating of the hydraulic fluid.", "Mixing of two different oil brands."],
                                correct: 1
                            },
                            {
                                q: "What is the purpose of the hydraulic return filter?",
                                a: "To catch wear particles before they reach the tank.",
                                options: ["To pressurize the oil for the pump.", "To cool the oil before it is reused.", "To catch wear particles before they reach the tank.", "To remove water from the hydraulic fluid."],
                                correct: 2
                            },
                            {
                                q: "When should hydraulic filters be changed?",
                                a: "Per the service interval or if the restriction indicator triggers.",
                                options: ["Only when a leak is detected.", "Every 1,000 engine hours regardless of condition.", "Per the service interval or if the restriction indicator triggers.", "Only when changing the hydraulic pump."],
                                correct: 2
                            },
                            {
                                q: "What is the correct procedure for depressurizing the hydraulic system?",
                                a: "Shut off engine and cycle all joysticks in all directions.",
                                options: ["Unscrew the main pressure line slowly.", "Shut off engine and cycle all joysticks in all directions.", "Open the tank vent for 10 minutes.", "Run the engine in 'Eco' mode for 5 minutes."],
                                correct: 1
                            }
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
                            {
                                q: "When must a daily walkaround inspection be performed?",
                                a: "Before every shift, regardless of who operated previously.",
                                options: ["Only after the machine has sat idle overnight.", "Before every shift, regardless of who operated previously.", "Once a week per site safety schedule.", "Only when required by the site supervisor."],
                                correct: 1
                            },
                            {
                                q: "What is the minimum inspection coverage required during a walkaround?",
                                a: "360 degrees — all sides including top and underneath.",
                                options: ["Front and rear only — the two primary hazard zones.", "Left and right sides where personnel typically walk.", "360 degrees — all sides including top and underneath.", "Undercarriage only — the most common failure point."],
                                correct: 2
                            },
                            {
                                q: "What are you checking for on the track links during a walkaround?",
                                a: "Loose bolts, cracked links, and correct tension.",
                                options: ["Excessive mud buildup only.", "Loose bolts, cracked links, and correct tension.", "Color of the metal to detect overheating.", "Number of hours since the last wash."],
                                correct: 1
                            },
                            {
                                q: "Why check mirror alignment before starting work?",
                                a: "To ensure maximum visibility of the 'blind spots'.",
                                options: ["To comply with site vanity regulations.", "To ensure maximum visibility of the 'blind spots'.", "To prevent glare from the afternoon sun.", "To check for cracks in the glass only."],
                                correct: 1
                            },
                            {
                                q: "What should you do if you find a leak during the walkaround?",
                                a: "Report it and do not start the machine until inspected.",
                                options: ["Continue work and monitor the level.", "Wipe it off and check if it reappears in an hour.", "Report it and do not start the machine until inspected.", "Top up the fluid and continue the shift."],
                                correct: 2
                            },
                            {
                                q: "What is a 'pinch point' on an excavator?",
                                a: "Any area where a body part can be caught between moving parts.",
                                options: ["The tip of the bucket teeth.", "Any area where a body part can be caught between moving parts.", "The point where the tracks touch the ground.", "The fuel tank filler neck."],
                                correct: 1
                            },
                            {
                                q: "What should you check regarding the swing bearing?",
                                a: "Presence of grease and lack of unusual debris.",
                                options: ["The temperature of the bearing metal.", "Presence of grease and lack of unusual debris.", "The number of rotations performed yesterday.", "The color of the paint on the bearing."],
                                correct: 1
                            },
                            {
                                q: "Why must lighting functionality be checked?",
                                a: "For safety during low light and to signal to other workers.",
                                options: ["Lighting is optional during daylight hours.", "To preserve the battery life by avoiding use.", "For safety during low light and to signal to other workers.", "To ensure the internal cabin lights are bright enough."],
                                correct: 2
                            },
                            {
                                q: "What is the 'exclusion zone' during an excavator inspection?",
                                a: "The area around the machine that must be clear of personnel.",
                                options: ["The area where the machine is restricted from digging.", "The area around the machine that must be clear of personnel.", "The interior of the engine compartment.", "The specific depth limit for the day's dig."],
                                correct: 1
                            },
                            {
                                q: "What is the final step of a daily walkaround?",
                                a: "Documenting all findings on the inspection form.",
                                options: ["Starting the engine to warm it up.", "Documenting all findings on the inspection form.", "Radioing the supervisor that you are ready.", "Cleaning the windows of the cab."],
                                correct: 1
                            }
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
                            {
                                q: "What is the minimum setback distance from an unshored trench?",
                                a: "Equal to the depth of the trench.",
                                options: ["1.5 meters fixed, regardless of depth.", "Half the depth of the trench.", "Equal to the depth of the trench.", "2 meters fixed minimum."],
                                correct: 2
                            },
                            {
                                q: "At what depth does a trench require shoring or shields?",
                                a: "1.5 meters (5 feet).",
                                options: ["0.5 meters (18 inches).", "1.0 meter (3 feet).", "2.0 meters (6.5 feet).", "1.5 meters (5 feet)."],
                                correct: 3
                            },
                            {
                                q: "Which factors can trigger a trench collapse?",
                                a: "Soil type, moisture content, and machine vibration.",
                                options: ["Wind speed and ambient temperature only.", "Soil type, moisture content, and machine vibration.", "Proximity to overhead power lines.", "Type of shoring material used."],
                                correct: 1
                            },
                            {
                                q: "What is 'sloping' in the context of trench safety?",
                                a: "Cutting back the trench wall at an angle inclined away from the excavation.",
                                options: ["The natural angle at which soil falls into the pit.", "Cutting back the trench wall at an angle inclined away from the excavation.", "Reinforcing the trench with vertical timber planks.", "Creating a drainage path for rainwater away from the site."],
                                correct: 1
                            },
                            {
                                q: "Why is 'Type C' soil the most dangerous for trenching?",
                                a: "It is the least stable and has the highest risk of cave-in.",
                                options: ["It contains sharp rocks that damage machines.", "It is the least stable and has the highest risk of cave-in.", "It is too hard to dig without specialized teeth.", "It retains heat and can cause tool expansion."],
                                correct: 1
                            },
                            {
                                q: "What is the 'line of influence' of an excavator near a trench?",
                                a: "The area where the machine's weight puts pressure on the trench wall.",
                                options: ["The furthest distance the bucket can reach.", "The radius of the swing counterweight.", "The area where the machine's weight puts pressure on the trench wall.", "The depth at which the bucket begins to struggle."],
                                correct: 2
                            },
                            {
                                q: "What is a 'trench box' or 'shield' designed to do?",
                                a: "Protect workers from the pressure of a cave-in.",
                                options: ["Prevent the trench from ever collapsing.", "Store tools securely overnight.", "Protect workers from the pressure of a cave-in.", "Provide a level surface for the excavator tracks."],
                                correct: 2
                            },
                            {
                                q: "How should workers enter or exit a trench deeper than 1.2 meters?",
                                a: "Using a secured ladder that extends 1 meter above the top.",
                                options: ["By climbing the shoring timber.", "Using a secured ladder that extends 1 meter above the top.", "Riding in the excavator bucket.", "Jumping down if the soil is soft."],
                                correct: 1
                            },
                            {
                                q: "What is 'fissuring' in trench walls a sign of?",
                                a: "Immediate danger of a tension crack leading to collapse.",
                                options: ["Good drainage in the soil.", "Immediate danger of a tension crack leading to collapse.", "Presence of underground rock layers.", "Optimal moisture content for digging."],
                                correct: 1
                            },
                            {
                                q: "When should a trench inspection be performed?",
                                a: "Daily, before anyone enters, and after any weather event.",
                                options: ["Once at the start of the project.", "Weekly by the site safety officer.", "Daily, before anyone enters, and after any weather event.", "Only if a worker reports a small collapse."],
                                correct: 2
                            }
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
                            {
                                q: "What must be completed before excavating near utilities?",
                                a: "Review maps, CAT-scan, and hand-dig trial holes within 500mm.",
                                options: ["Only obtain verbal clearance from the site manager.", "Review maps, CAT-scan, and hand-dig trial holes within 500mm.", "Proceed slowly with a reduced-speed bucket pass.", "Mark the dig area with cones and begin work."],
                                correct: 1
                            },
                            {
                                q: "What tool is used to detect buried cables?",
                                a: "Cable Avoidance Tool (CAT) with a signal generator.",
                                options: ["Ground Penetrating Radar (GPR) scanner.", "Standard metal detector device.", "Cable Avoidance Tool (CAT) with a signal generator.", "Thermal imaging camera."],
                                correct: 2
                            },
                            {
                                q: "How close can you use a machine to a known utility line?",
                                a: "Stay at least 500mm away (hand-dig zone).",
                                options: ["Within 100mm if using a smooth bucket.", "Stay at least 500mm away (hand-dig zone).", "Machine digging is allowed up to 1 meter.", "Machine digging is forbidden within 5 meters."],
                                correct: 1
                            },
                            {
                                q: "What should you do if you strike an underground power cable?",
                                a: "Stay in the cab, warn others away, and radio for power isolation.",
                                options: ["Jump out immediately and run.", "Stay in the cab, warn others away, and radio for power isolation.", "Try to pull the cable out with the bucket.", "Check the cable for damage with your hand."],
                                correct: 1
                            },
                            {
                                q: "What color marker tape usually indicates an underground electric line?",
                                a: "Yellow.",
                                options: ["Blue (Water).", "Yellow.", "Red (Electric).", "Orange (Gas)."],
                                correct: 2
                            },
                            {
                                q: "Why use a 'smooth edge' bucket when digging near services?",
                                a: "To reduce the risk of snagging or puncturing lines.",
                                options: ["To dig through hard soil more easily.", "To reduce the risk of snagging or puncturing lines.", "Because it creates a narrower trench.", "It is purely for aesthetic reasons."],
                                correct: 1
                            },
                            {
                                q: "What is a 'Genny' used for in cable detection?",
                                a: "To apply a detectable signal to a pipe or cable.",
                                options: ["To provide emergency power to the site.", "To apply a detectable signal to a pipe or cable.", "To measure the depth of the excavaton.", "To test the soil moisture content."],
                                correct: 1
                            },
                            {
                                q: "What feature of a gas line strike makes it different from electric?",
                                a: "Risk of secondary explosion through gas accumulation.",
                                options: ["Immediate electrocution of the operator.", "Risk of secondary explosion through gas accumulation.", "Corrosion of the excavator bucket.", "Loss of hydraulic pressure."],
                                correct: 1
                            },
                            {
                                q: "What should be done if an unidentified service is found?",
                                a: "Stop work immediately and notify the supervisor.",
                                options: ["Dig around it and keep going.", "Destroy it to see if it leaks fluid.", "Stop work immediately and notify the supervisor.", "Cover it back up and move the site."],
                                correct: 2
                            },
                            {
                                q: "Which utility is most commonly missed by standard CAT scanners?",
                                a: "Plastic water pipes (non-conductive).",
                                options: ["High-voltage electric cables.", "Plastic water pipes (non-conductive).", "Fibre optic cables with metal tracing.", "Cast iron gas mains."],
                                correct: 1
                            }
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
                            {
                                q: "How far from a trench edge must a spoil pile be placed?",
                                a: "At least 1 meter.",
                                options: ["At least 500mm (half a meter).", "At least 1 meter.", "At least 2 meters.", "Equal to the pile height."],
                                correct: 1
                            },
                            {
                                q: "Where should spoil be placed relative to the access point?",
                                a: "On the opposite side.",
                                options: ["Directly beside the access point for ease of removal.", "On the opposite side.", "Evenly distributed on both sides.", "Downhill from the excavation edge."],
                                correct: 1
                            },
                            {
                                q: "What is the maximum height for a spoil pile without 'battering' (sloping)?",
                                a: "2 meters.",
                                options: ["1 meter.", "2 meters.", "3 meters.", "No limit as long as the base is wide."],
                                correct: 1
                            },
                            {
                                q: "Why is water runoff from a spoil pile dangerous?",
                                a: "It can undermine the trench edge or cause slope failure.",
                                options: ["It makes the site too muddy for trucks.", "It can undermine the trench edge or cause slope failure.", "It washes away the valuable topsoil.", "It attracts unwanted local wildlife."],
                                correct: 1
                            },
                            {
                                q: "What does 'surcharge loading' mean in spoil management?",
                                a: "The extra pressure on trench walls from the weight of the pile.",
                                options: ["The cost of transporting the soil off-site.", "The extra pressure on trench walls from the weight of the pile.", "Overloading the excavator bucket with spoil.", "The depth charge needed for rock blasting."],
                                correct: 1
                            },
                            {
                                q: "How should contaminated soil be stored on site?",
                                a: "On impermeable sheeting to prevent ground leaching.",
                                options: ["Mixed with clean soil to dilute the hazard.", "On impermeable sheeting to prevent ground leaching.", "Inside the trench during the night.", "Piled as high as possible to reduce footprint."],
                                correct: 1
                            },
                            {
                                q: "What is 'battering' of a spoil pile?",
                                a: "Sloping the sides to prevent sliding or collapse.",
                                options: ["Flattening the top with the excavator bucket.", "Sloping the sides to prevent sliding or collapse.", "Tamping the soil down with a vibratory plate.", "Covering the pile with a protective tarp."],
                                correct: 1
                            },
                            {
                                q: "Where should large rocks be placed in a spoil pile?",
                                a: "At the bottom/base to prevent them from rolling down.",
                                options: ["At the very top for easy access later.", "At the bottom/base to prevent them from rolling down.", "They should be removed from the site immediately.", "Scattered randomly throughout the pile."],
                                correct: 1
                            },
                            {
                                q: "Why is frozen spoil a hazard when it thaws?",
                                a: "It can become a liquid slurry and flow into the trench.",
                                options: ["It is too hard to dig when frozen.", "It can become a liquid slurry and flow into the trench.", "It damages the excavator bucket teeth.", "It causes the ground to heave up."],
                                correct: 1
                            },
                            {
                                q: "What is the safest way to move a large spoil pile?",
                                a: "Working in layers from top to bottom.",
                                options: ["Undercutting the base with the excavator.", "Working in layers from top to bottom.", "Pushing it with a bulldozer from the rear.", "Using a high-pressure water jet."],
                                correct: 1
                            }
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
                            {
                                q: "What percentage of rated capacity must routine lifts stay under?",
                                a: "80%.",
                                options: ["100% — rated capacity is safe.", "90% — a 10% safety margin.", "80%.", "75% — to match tandem lift rules."],
                                correct: 2
                            },
                            {
                                q: "What factors reduce actual lifting capacity below rated?",
                                a: "Soft ground, slopes, wind, and boom extension.",
                                options: ["Operator experience and time of day.", "Fuel level and engine temperature.", "Track width and counterweight configuration.", "Soft ground, slopes, wind, and boom extension."],
                                correct: 3
                            },
                            {
                                q: "What is the 'radius' of the load in a load chart?",
                                a: "The horizontal distance from the center of swing to the center of the load.",
                                options: ["The length of the boom from pin to tip.", "The vertical height from the ground to the hook.", "The horizontal distance from the center of swing to the center of the load.", "The width of the tracks during the lift."],
                                correct: 2
                            },
                            {
                                q: "How does 10-degree machine tilt affect lifting capacity?",
                                a: "It can reduce capacity by more than 50% due to side-loading.",
                                options: ["It reduces capacity by exactly 10%.", "It has no effect if the load is light.", "It can reduce capacity by more than 50% due to side-loading.", "It only affects the engine power, not the lift."],
                                correct: 2
                            },
                            {
                                q: "What position is the most stable for lifting on a CAT 320?",
                                a: "Over the front or rear of the tracks.",
                                options: ["Directly over the side of the tracks.", "Over the front or rear of the tracks.", "At a 45-degree angle to the tracks.", "Stability is identical in all 360 degrees."],
                                correct: 1
                            },
                            {
                                q: "What is 'dynamic loading' in lifting?",
                                a: "Sudden increase in load force due to movement or wind.",
                                options: ["The weight of the machine's counterweight.", "The weight of the hydraulic oil in the cylinders.", "Sudden increase in load force due to movement or wind.", "The friction of the boom pivot pins."],
                                correct: 2
                            },
                            {
                                q: "Where can the official load chart for your machine be found?",
                                a: "Inside the cab, usually near the side window or on the visor.",
                                options: ["In the site manager's office.", "Inside the cab, usually near the side window or on the visor.", "Stamped on the side of the boom.", "Under the counterweight cover."],
                                correct: 1
                            },
                            {
                                q: "When is a lift classified as 'critical'?",
                                a: "When it exceeds 75% of rated capacity or uses two machines.",
                                options: ["When it takes longer than 30 minutes.", "When it exceeds 75% of rated capacity or uses two machines.", "Whenever the load is made of steel.", "If the site owner is watching."],
                                correct: 1
                            },
                            {
                                q: "What should you do if the load begins to sway?",
                                a: "Smoothly stop all movements and lower the load if safe.",
                                options: ["Swing in the opposite direction to counter it.", "Speed up the lift to get it on the ground faster.", "Smoothly stop all movements and lower the load if safe.", "Disconnect the winch brake immediately."],
                                correct: 2
                            },
                            {
                                q: "What information is NOT required to use a load chart?",
                                a: "The age of the excavator.",
                                options: ["The weight of the load.", "The boom angle or radius.", "The machine configuration (blade up/down).", "The age of the excavator."],
                                correct: 3
                            }
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
                            {
                                q: "When must a wire rope sling be discarded?",
                                a: "When it shows more than 6 broken wires in one lay length.",
                                options: ["When any surface rust is visible.", "When it shows more than 6 broken wires in one lay length.", "When the diameter is reduced by more than 20%.", "After every 50 lifts regardless of condition."],
                                correct: 1
                            },
                            {
                                q: "What must every sling have to be legally used?",
                                a: "A visible, legible identification tag.",
                                options: ["A colour-coded sleeve matching the load class.", "A visible, legible identification tag.", "A recent load test certificate dated within 6 months.", "An inspector's chalk mark on the hook end."],
                                correct: 1
                            },
                            {
                                q: "What is the standard 'Safety Factor' for general rigging gear?",
                                a: "5:1 (Breaking point is 5x the WLL).",
                                options: ["2:1.", "5:1 (Breaking point is 5x the WLL).", "10:1.", "1.25:1."],
                                correct: 1
                            },
                            {
                                q: "What does 'WLL' stand for on a shackle?",
                                a: "Working Load Limit.",
                                options: ["Weight Leverage Limit.", "Working Load Limit.", "Wire Length Logging.", "Wind Load Level."],
                                correct: 1
                            },
                            {
                                q: "Why is a knot in a synthetic sling dangerous?",
                                a: "It can reduce the strength of the sling by over 50%.",
                                options: ["It makes the sling too short for the lift.", "It can reduce the strength of the sling by over 50%.", "It makes the sling impossible to clean.", "Nodes in the fabric cause chemical breakdown."],
                                correct: 1
                            },
                            {
                                q: "How should shackles be tightened before a lift?",
                                a: "Screw the pin until hand-tight, then back it off 1/4 turn.",
                                options: ["Use a wrench to tighten as hard as possible.", "Screw the pin until hand-tight, then back it off 1/4 turn.", "Leave it loose so it can rotate freely.", "Weld the pin in place for security."],
                                correct: 1
                            },
                            {
                                q: "What is a 'choker hitch' and how does it affect capacity?",
                                a: "Sliding the sling through its own eye; reduces capacity to 75%.",
                                options: ["Wrapping a chain around a rock; has no effect.", "Sliding the sling through its own eye; reduces capacity to 75%.", "Using two slings on one hook; doubles capacity.", "A knot used to shorten a wire rope; triples capacity."],
                                correct: 1
                            },
                            {
                                q: "If a sling tag is missing but the sling looks new, can you use it?",
                                a: "Never. No tag means no lift.",
                                options: ["Yes, if you weigh the load first.", "Only if it is a synthetic round-sling.", "Never. No tag means no lift.", "Only for lifts under 1 tonne."],
                                correct: 2
                            },
                            {
                                q: "What indicates a synthetic sling has been exposed to extreme heat?",
                                a: "Hard or brittle areas, charring, or melted fibers.",
                                options: ["The color changes from green to yellow.", "The sling becomes more flexible.", "Hard or brittle areas, charring, or melted fibers.", "It emits a high-pitched sound when loaded."],
                                correct: 2
                            },
                            {
                                q: "Who is responsible for inspecting rigging before a lift?",
                                a: "The person performing the rigging (Slinger/Banksman).",
                                options: ["The site manager only.", "The manufacturer of the machine.", "The person performing the rigging (Slinger/Banksman).", "The crane manufacturer's service agent."],
                                correct: 2
                            }
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
                            {
                                q: "Why should you never run your hand along a hydraulic line?",
                                a: "A pinhole leak can inject fluid through skin at 3,000+ PSI, causing tissue death.",
                                options: ["The line may be hot enough to cause burns.", "You may disturb a pressure valve and lose system pressure.", "A pinhole leak can inject fluid through skin at 3,000+ PSI, causing tissue death.", "Touching the line can introduce contamination."],
                                correct: 2
                            },
                            {
                                q: "What is the safe method to locate a hydraulic leak?",
                                a: "Use a piece of cardboard or a thermal/UV detection kit.",
                                options: ["Use a damp cloth to feel for moisture.", "Inspect by touch after depressurising the system.", "Use a piece of cardboard or a thermal/UV detection kit.", "Apply chalk dust along the line and observe staining."],
                                correct: 2
                            },
                            {
                                q: "What should you do if you suspect you have a hydraulic injection injury?",
                                a: "Seek immediate emergency surgical medical attention.",
                                options: ["Wash the area with soap and water and monitor.", "Apply a cold compress and return to work.", "Seek immediate emergency surgical medical attention.", "Squeeze the site to remove any injected oil."],
                                correct: 2
                            },
                            {
                                q: "Why are injection injuries often initially 'painless'?",
                                a: "The speed and pressure numb the nerve endings temporarily.",
                                options: ["The hydraulic oil acts as a local anesthetic.", "The speed and pressure numb the nerve endings temporarily.", "Because the injury is superficial and not deep.", "The body enters a state of shock immediately."],
                                correct: 1
                            },
                            {
                                q: "At what pressure can hydraulic fluid penetrate human skin?",
                                a: "As low as 100 PSI.",
                                options: ["Only above 3,000 PSI.", "At least 1,000 PSI.", "As low as 100 PSI.", "5,000 PSI minimum."],
                                correct: 2
                            },
                            {
                                q: "What is 'compartment syndrome' in context of injection injuries?",
                                a: "Internal pressure buildup that cuts off blood flow to a limb.",
                                options: ["A fault in the hydraulic tank partitions.", "The feeling of being trapped in the cab during a leak.", "Internal pressure buildup that cuts off blood flow to a limb.", "When the engine bay doors become stuck shut."],
                                correct: 2
                            },
                            {
                                q: "What type of PPE provides protection against high-pressure injection?",
                                a: "No standard gloves or clothing can stop a high-pressure jet.",
                                options: ["Standard leather work gloves.", "Double-layered rubber gauntlets.", "No standard gloves or clothing can stop a high-pressure jet.", "Steel-reinforced Kevlar sleeves."],
                                correct: 2
                            },
                            {
                                q: "What is the purpose of a burst-guard sleeve on a hydraulic hose?",
                                a: "To deflect and dissipate a high-pressure jet if a hose bursts.",
                                options: ["To keep the hose warm in winter conditions.", "To deflect and dissipate a high-pressure jet if a hose bursts.", "To prevent external debris from scratching the hose.", "To identify the high-pressure lines from low-pressure."],
                                correct: 1
                            },
                            {
                                q: "What indicates a hose is near failure during visual inspection?",
                                a: "Bubbling or blistering on the outer cover.",
                                options: ["The hose color turning slightly darker.", "Bubbling or blistering on the outer cover.", "The hose feeling slightly warmer than the others.", "Dust accumulation on the surface."],
                                correct: 1
                            },
                            {
                                q: "What is the 'line of fire' in hydraulic maintenance?",
                                a: "The path a fluid jet would take if a connection failed.",
                                options: ["The temperature at which hydraulic oil ignites.", "The path a fluid jet would take if a connection failed.", "The distance from the engine exhaust pipe.", "The maximum reach of the excavator arm."],
                                correct: 1
                            }
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
                            {
                                q: "What must be done before hydraulic maintenance?",
                                a: "Engine off and all accumulators bled down to zero pressure.",
                                options: ["Engine at idle and hydraulic lines clamped.", "Engine off and hydraulic filter replaced.", "Engine off and all accumulators bled down to zero pressure.", "Park on level ground and apply travel lock."],
                                correct: 2
                            },
                            {
                                q: "Why are accumulators dangerous after engine shutdown?",
                                a: "They store residual energy that can cause sudden cylinder movement.",
                                options: ["They may back-feed voltage into the control system.", "They retain hot hydraulic fluid that can cause burns.", "They store residual energy that can cause sudden cylinder movement.", "They release trapped air that can ignite near hot surfaces."],
                                correct: 2
                            },
                            {
                                q: "How do you verify an accumulator is fully bled?",
                                a: "Check the secondary pressure gauge if fitted, or cycle controls until zero movement.",
                                options: ["Listen for the absence of a humming sound.", "Check the secondary pressure gauge if fitted, or cycle controls until zero movement.", "Visual inspection of the accumulator bladder.", "Touch the exterior to check if it has cooled down."],
                                correct: 1
                            },
                            {
                                q: "What is stored inside a typical hydraulic accumulator?",
                                a: "Pressurized Nitrogen gas separated from the oil by a bladder.",
                                options: ["Compressed air from the engine turbocharger.", "High-voltage electricity in a capacitor.", "Pressurized Nitrogen gas separated from the oil by a bladder.", "Vacuum energy created by the hydraulic pump."],
                                correct: 2
                            },
                            {
                                q: "What safety device is usually found on an accumulator housing?",
                                a: "A pressure relief valve or fuse plug.",
                                options: ["A bright green blinking light.", "A pressure relief valve or fuse plug.", "An automatic fire suppression nozzle.", "A mechanical lock-out padlock."],
                                correct: 1
                            },
                            {
                                q: "Can an accumulator move the boom even with the engine missing?",
                                a: "Yes, it provides enough energy for several cycles or E-stops.",
                                options: ["No, it requires the pump to create the flow.", "Only if the electrical system is still connected.", "Yes, it provides enough energy for several cycles or E-stops.", "Only if the machine is on a slope."],
                                correct: 2
                            },
                            {
                                q: "Where is the accumulator bleed-down procedure documented?",
                                a: "The manufacturer's Service or Maintenance Manual.",
                                options: ["On the side of the hydraulic tank.", "The manufacturer's Service or Maintenance Manual.", "On the dashboard display menu.", "In the local site safety induction booklet."],
                                correct: 1
                            },
                            {
                                q: "What is 'energy isolation' (LOTO) for hydraulics?",
                                a: "Locking out the engine and bleeding all stored hydraulic energy.",
                                options: ["Unplugging the battery only.", "Locking out the engine and bleeding all stored hydraulic energy.", "Applying the swing brake and parking brake.", "Closing all windows and doors of the cab."],
                                correct: 1
                            },
                            {
                                q: "What indicates an accumulator might be failing?",
                                a: "Jerky or 'stiff' pilot control response.",
                                options: ["The engine is consuming more fuel.", "Smoke coming from the hydraulic pump.", "Jerky or 'stiff' pilot control response.", "The radio stops working during dig cycles."],
                                correct: 2
                            },
                            {
                                q: "Who is authorized to recharge a nitrogen accumulator?",
                                a: "Only trained technicians using specialized equipment.",
                                options: ["Any operator with a standard air compressor.", "Only trained technicians using specialized equipment.", "The site manager using a gas cylinder.", "The machine's daily operator."],
                                correct: 1
                            }
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
                            {
                                q: "What is the minimum clearance from overhead power lines at 50kV?",
                                a: "10 feet (3.05 meters).",
                                options: ["3 feet (0.9 meters) — the physical contact zone.", "6 feet (1.8 meters) — the standard PPE exclusion zone.", "10 feet (3.05 meters).", "15 feet (4.5 meters) — the OSHA general minimum."],
                                correct: 2
                            },
                            {
                                q: "What happens to clearance requirements for lines above 50kV?",
                                a: "Add 4 inches for every additional 10kV.",
                                options: ["Double the base clearance requirement.", "Add 1 foot for every additional 10kV.", "Add 4 inches for every additional 10kV.", "No change — 10ft covers all voltage levels."],
                                correct: 2
                            },
                            {
                                q: "Is physical contact required for electrocution near power lines?",
                                a: "No. Arcing can occur at high voltages without physical contact.",
                                options: ["Yes — the circuit must be completed by direct contact.", "Only in wet weather conditions.", "No. Arcing can occur at high voltages without physical contact.", "Only if the machine is not earthed."],
                                correct: 2
                            },
                            {
                                q: "What is 'Step Potential' during a power line strike?",
                                a: "Voltage difference in the ground that can kill anyone walking nearby.",
                                options: ["The maximum climbing grade of the excavator.", "The voltage needed to jump one foot through the air.", "Voltage difference in the ground that can kill anyone walking nearby.", "The power needed to move the heaviest lift."],
                                correct: 2
                            },
                            {
                                q: "If you hit a power line, what is the best way to exit if you MUST?",
                                a: "Jump clear of the machine and land with both feet together.",
                                options: ["Climb down the ladder slowly to maintain balance.", "Jump clear of the machine and land with both feet together.", "Slide down the boom arm to the ground.", "Exit normally; the tracks provide a ground path."],
                                correct: 1
                            },
                            {
                                q: "Why shouldn't you walk normally away from a struck machine?",
                                a: "Voltage between your separated feet can cause electrocution.",
                                options: ["You might trip on the power line on the ground.", "Voltage between your separated feet can cause electrocution.", "The machine might explode behind you.", "The ground is likely too hot to touch with one foot."],
                                correct: 1
                            },
                            {
                                q: "What is the safest distance to maintain from a struck machine?",
                                a: "At least 10 meters (30 feet).",
                                options: ["2 meters (height of a man).", "5 meters.", "At least 10 meters (30 feet).", "Distance doesn't matter once you're off the machine."],
                                correct: 2
                            },
                            {
                                q: "What role does a 'spotter' play near power lines?",
                                a: "Monitoring the boom distance and warning the operator.",
                                options: ["Ensuring the power company is notified.", "Monitoring the boom distance and warning the operator.", "Checking for birds sitting on the lines.", "Filming the operation for site records."],
                                correct: 1
                            },
                            {
                                q: "Does a lower voltage (e.g. 240V) require an exclusion zone?",
                                a: "Yes, any voltage can be fatal and requires clearance.",
                                options: ["No, low voltage is safe to work around.", "Only if the cables are visibly frayed.", "Yes, any voltage can be fatal and requires clearance.", "Only if working in standing water."],
                                correct: 2
                            },
                            {
                                q: "What is the danger of arcing in high humidity?",
                                a: "Electricity can jump further through moist air.",
                                options: ["The power lines become heavier and sag lower.", "Electricity can jump further through moist air.", "The operator's vision is reduced.", "The cab's electronics are more likely to short out."],
                                correct: 1
                            }
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
                            {
                                q: "Where is the most dangerous crush zone on a swinging excavator?",
                                a: "Between the rear counterweight and any fixed object.",
                                options: ["Under the front bucket during a dig cycle.", "Between the cab door and the track frame.", "Directly in front of the boom during extension.", "Between the rear counterweight and any fixed object."],
                                correct: 3
                            },
                            {
                                q: "How must the excavator's swing radius be controlled?",
                                a: "Barricades, cones, tape, and a designated banksman.",
                                options: ["The operator monitors the area from the cab.", "A verbal warning system is used before swinging.", "Barricades, cones, tape, and a designated banksman.", "CCTV cameras covering all angles."],
                                correct: 2
                            },
                            {
                                q: "What is 'tail swing' on an excavator?",
                                a: "The distance the rear of the machine extends beyond the tracks.",
                                options: ["The length of the hydraulic lines on the boom.", "The distance the rear of the machine extends beyond the tracks.", "The weight of the heavy soil in the bucket.", "The speed at which the machine can rotate."],
                                correct: 1
                            },
                            {
                                q: "Why is tail swing especially dangerous near walls?",
                                a: "A person can be crushed between the machine and the wall.",
                                options: ["The machine might scratch the wall's paint.", "A person can be crushed between the machine and the wall.", "Dust from the wall can enter the engine intake.", "The machine's exhaust will bounce back and heat the cab."],
                                correct: 1
                            },
                            {
                                q: "What should you check before starting a swing maneuver?",
                                a: "The entire 360-degree radius is clear of personnel.",
                                options: ["The mirrors only.", "The front bucket position only.", "The entire 360-degree radius is clear of personnel.", "The fuel level in the tank."],
                                correct: 2
                            },
                            {
                                q: "What is a 'blind spot' in swing operations?",
                                a: "Any area where the operator cannot see a person from the seat.",
                                options: ["The area directly under the excavator's tracks.", "Any area where the operator cannot see a person from the seat.", "The interior of the engine compartment.", "The tip of the bucket when fully extended."],
                                correct: 1
                            },
                            {
                                q: "Which side of the cab has the largest blind spot?",
                                a: "The right-hand side (away from the door).",
                                options: ["The left-hand side (near the door).", "The right-hand side (away from the door).", "Directly behind the counterweight.", "Directly in front of the window."],
                                correct: 1
                            },
                            {
                                q: "When should a 'banksman' be used for swinging?",
                                a: "Whenever working in confined spaces or near other personnel.",
                                options: ["Only during training exercises.", "Whenever working in confined spaces or near other personnel.", "Only when the machine has no mirrors.", "Only during nighttime operations."],
                                correct: 1
                            },
                            {
                                q: "What color is the 'Swing Lock' pin or electronic switch?",
                                a: "Red.",
                                options: ["Green.", "Blue.", "Yellow.", "Red."],
                                correct: 4
                            },
                            {
                                q: "What is the purpose of a swing alarm?",
                                a: "To give an audible warning to nearby personnel when the cab rotates.",
                                options: ["To notify the operator that they are at maximum reach.", "To give an audible warning to nearby personnel when the cab rotates.", "To signal the end of the work day.", "To indicate a hydraulic fault in the swing motor."],
                                correct: 1
                            }
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
                            {
                                q: "What document must be consulted before any lifting operation?",
                                a: "The machine-specific load chart.",
                                options: ["The daily inspection log from the previous shift.", "The machine-specific load chart.", "The site risk assessment for the work area.", "The manufacturer's engine torque specifications."],
                                correct: 1
                            },
                            {
                                q: "Besides boom extension, what factors reduce safe lifting capacity?",
                                a: "Ground conditions, slope, and wind.",
                                options: ["Operator certification level and shift length.", "Cab temperature and fuel type.", "Track tension and undercarriage wear.", "Ground conditions, slope, and wind."],
                                correct: 3
                            },
                            {
                                q: "What is 'tipping capacity' on a load chart?",
                                a: "The weight that will cause the machine to physically tip over.",
                                options: ["The amount of soil a bucket can hold.", "The weight that will cause the machine to physically tip over.", "The strength of the hydraulic cylinders.", "The maximum reach of the excavator arm."],
                                correct: 1
                            },
                            {
                                q: "How much factor of safety is usually built into a load chart?",
                                a: "Rated capacity is usually 75% of tipping capacity.",
                                options: ["No factor of safety; rated equals tipping.", "Rated capacity is usually 75% of tipping capacity.", "Rated capacity is 50% of tipping capacity.", "Rated capacity is 90% of tipping capacity."],
                                correct: 1
                            },
                            {
                                q: "What is the 'working radius' for a lift?",
                                a: "The horizontal distance from the center of swing to the hook.",
                                options: ["The vertical distance from the ground.", "The horizontal distance from the center of swing to the hook.", "The total length of the boom and arm segments.", "The distance between the tracks."],
                                correct: 1
                            },
                            {
                                q: "What should you do if the Load Moment Indicator (LMI) warns you?",
                                a: "Immediately stop the movement and retract the load.",
                                options: ["Continue the lift but move more slowly.", "Immediately stop the movement and retract the load.", "Mute the alarm and finish the lift.", "Radio the supervisor for permission to override."],
                                correct: 1
                            },
                            {
                                q: "How does wind speed affects a large surface area load?",
                                a: "It can push the load and create dangerous dynamic forces.",
                                options: ["Wind has no effect on a heavy machine's stability.", "It can push the load and create dangerous dynamic forces.", "It helps cool the hydraulic oil during the lift.", "It reduces the amount of fuel the engine uses."],
                                correct: 1
                            },
                            {
                                q: "What is 'over the side' vs 'over the front' stability?",
                                a: "Excavators are more stable lifting over the front or rear than the side.",
                                options: ["Stability is exactly the same in all 360 degrees.", "Excavators are more stable lifting over the front than the side.", "Over the side lifting is the safest position.", "Over the side lifting increases capacity by 20%."],
                                correct: 1
                            },
                            {
                                q: "Who is responsible for knowing the weight of the load?",
                                a: "The person supervising the lift (Lift Supervisor or Operator).",
                                options: ["The truck driver delivering the load.", "The manufacturer of the item being lifted.", "The person supervising the lift (Lift Supervisor or Operator).", "The machine's salesperson."],
                                correct: 2
                            },
                            {
                                q: "What is the danger of an 'unknown' load weight?",
                                a: "It can exceed machine capacity and cause a collapse or tip-over.",
                                options: ["It might take too long to lift.", "It can exceed machine capacity and cause a collapse or tip-over.", "The bucket might get scratched.", "The operator might get bored with the slow lift."],
                                correct: 1
                            }
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
                            {
                                q: "How should the machine's tracks be oriented when working near water?",
                                a: "Perpendicular to the water's edge for maximum stability.",
                                options: ["Parallel to the water's edge to allow quick retreat.", "At a 45-degree angle for balanced load distribution.", "Perpendicular to the water's edge for maximum stability.", "Direction does not affect stability on saturated ground."],
                                correct: 2
                            },
                            {
                                q: "What rescue equipment must be present when working near water?",
                                a: "Life rings and throw lines.",
                                options: ["A fire extinguisher and first aid kit.", "A safety harness and anchor line.", "Life rings and throw lines.", "A buoyancy suit for the operator."],
                                correct: 2
                            },
                            {
                                q: "Why is saturated soil near water dangerous for heavy machinery?",
                                a: "It can lose bearing capacity and liquefy under pressure.",
                                options: ["It makes the tracks too muddy to clean.", "It can lose bearing capacity and liquefy under pressure.", "The soil becomes too hard to dig accurately.", "It attracts dangerous local wildlife to the machine."],
                                correct: 1
                            },
                            {
                                q: "What is the minimum recommended distance from a water edge without specialized data?",
                                a: "10 meters.",
                                options: ["2 meters.", "5 meters.", "10 meters.", "50 meters."],
                                correct: 2
                            },
                            {
                                q: "If the machine begins to tilt toward the water, what is the first action?",
                                a: "Lower the bucket into solid ground away from the water to stabilize.",
                                options: ["Try to swing the cab toward the water to balance.", "Jump out of the cab into the water.", "Lower the bucket into solid ground away from the water to stabilize.", "Increase engine RPM to maximum and try to reverse."],
                                correct: 2
                            },
                            {
                                q: "What is the risk of an excavator cab becoming submerged?",
                                a: "Water pressure may prevent the door from opening, trapping the operator.",
                                options: ["The electrical system will short and cause a fire.", "Water pressure may prevent the door from opening, trapping the operator.", "The hydraulic oil will contaminate the entire river.", "The paint will peel off the machine immediately."],
                                correct: 1
                            },
                            {
                                q: "What should you check for on the banks of a river before positioning?",
                                a: "Undercutting or erosion beneath the surface.",
                                options: ["The color of the water.", "The presence of fish or water plants.", "Undercutting or erosion beneath the surface.", "Nearby boat traffic schedules."],
                                correct: 2
                            },
                            {
                                q: "What is 'geotechnical data' in the context of water-side work?",
                                a: "Engineering reports on the strength and stability of the soil.",
                                options: ["A map of local water temperature and depth.", "Engineering reports on the strength and stability of the soil.", "A list of nearby emergency contact numbers.", "The historical rainfall records for the area."],
                                correct: 1
                            },
                            {
                                q: "Why use 'bog mats' (marsh mats) near water?",
                                a: "To spread the machine's weight over a larger surface area.",
                                options: ["To keep the machine tracks from getting wet.", "To provide a clean walking path for site staff.", "To spread the machine's weight over a larger surface area.", "To prevent the bucket from hitting the ground."],
                                correct: 2
                            },
                            {
                                q: "Who should supervise work within 10m of a water body?",
                                a: "A qualified supervisor with a specific water-safety permit.",
                                options: ["The machine operator alone is sufficient.", "The newest member of the crew.", "A qualified supervisor with a specific water-safety permit.", "Local environmental protection agents only."],
                                correct: 2
                            }
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
                            {
                                q: "What irreversible lung disease does silica dust cause?",
                                a: "Silicosis — irreversible lung scarring.",
                                options: ["Asbestosis — caused by fibrous mineral exposure.", "Mesothelioma — a cancer of the lung lining.", "Pneumoconiosis — caused by coal dust inhalation.", "Silicosis — irreversible lung scarring."],
                                correct: 3
                            },
                            {
                                q: "What minimum RPE rating is required during silica exposure?",
                                a: "FFP3 or higher.",
                                options: ["FFP1 — protects against coarse dust particles.", "FFP2 — the standard construction dust rating.", "FFP3 or higher.", "Any CE-marked dust mask is sufficient."],
                                correct: 2
                            },
                            {
                                q: "How can you reduce dust creation at the source?",
                                a: "Apply water suppression (misting or spraying) directly to the dig point.",
                                options: ["Dig faster to move the dust away quickly.", "Apply water suppression (misting or spraying) directly to the dig point.", "Wait for a windy day to blow the dust away.", "Wear a heavier jacket to block the dust."],
                                correct: 1
                            },
                            {
                                q: "What is 'HEPA' in the context of an excavator cab?",
                                a: "High-Efficiency Particulate Air filter for the cabin air intake.",
                                options: ["Heavy Equipment Power Assistant.", "High-Efficiency Particulate Air filter for the cabin air intake.", "Hydraulic Energy Pressure Accumulator.", "Heat Exchanger Plate Assembly."],
                                correct: 1
                            },
                            {
                                q: "Why is silica dust (RCS) so dangerous?",
                                a: "The particles are too small to see and get deep into the lungs.",
                                options: ["It has a strong chemical smell that causes nausea.", "It is highly flammable when mixed with diesel.", "The particles are too small to see and get deep into the lungs.", "It causes immediate skin rashes on contact."],
                                correct: 2
                            },
                            {
                                q: "Which activity produces the most silica dust?",
                                a: "Breaking concrete or cutting stone/brick with a dry saw.",
                                options: ["Moving wet topsoil across a field.", "Breaking concrete or cutting stone/brick with a dry saw.", "Greasing the excavator's bucket pins.", "Driving the machine on a paved road."],
                                correct: 1
                            },
                            {
                                q: "What does 'on-tool extraction' mean?",
                                a: "A vacuum system attached directly to the tool (e.g. concrete breaker).",
                                options: ["Removing the bucket from the machine for cleaning.", "A vacuum system attached directly to the tool (e.g. concrete breaker).", "The process of pulling a machine out of a mud hole.", "Sucking air out of the hydraulic tank."],
                                correct: 1
                            },
                            {
                                q: "How long should you wait for dust to settle after work ends?",
                                a: "At least 15-20 minutes, depending on ventilation.",
                                options: ["Immediately — dust settles instantly.", "At least 15-20 minutes, depending on ventilation.", "One full hour regardless of the site.", "Until the next shift starts."],
                                correct: 1
                            },
                            {
                                q: "Is a standard surgical mask effective against silica dust?",
                                a: "No, it does not provide a seal or filter fine particles.",
                                options: ["Yes, if it is double-layered.", "Only if it is worn under a face shield.", "No, it does not provide a seal or filter fine particles.", "Only if it is dampened with water first."],
                                correct: 2
                            },
                            {
                                q: "What should you do before eating or smoking after working in dust?",
                                a: "Wash hands, face, and change out of dusty outer clothing.",
                                options: ["Nothing, silica is only dangerous when inhaled.", "Drink plenty of water to flush the system.", "Wash hands, face, and change out of dusty outer clothing.", "Blow the dust off with an air hose."],
                                correct: 2
                            }
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
                            {
                                q: "What is the maximum outrigger pad load on the LTM 11200-9.1?",
                                a: "Up to 32 tonnes per pad.",
                                options: ["Up to 10 tonnes per pad.", "Up to 20 tonnes per pad.", "Up to 32 tonnes per pad.", "Up to 50 tonnes per pad."],
                                correct: 2
                            },
                            {
                                q: "What must be placed under outriggers on soft or unprepared ground?",
                                a: "Timber mats rated for the imposed load.",
                                options: ["Steel plates of any available thickness.", "Compacted gravel to improve bearing capacity.", "Concrete pads installed by a civil engineer.", "Timber mats rated for the imposed load."],
                                correct: 3
                            },
                            {
                                q: "When is a geotechnical survey required for crane operations?",
                                a: "For lifts exceeding 100 tonnes.",
                                options: ["For all lifts over 5 tonnes.", "Whenever the boom exceeds 50m extension.", "For lifts exceeding 100 tonnes.", "Only when operating on coastal or reclaimed land."],
                                correct: 2
                            },
                            {
                                q: "What is 'ground bearing capacity' (GBC)?",
                                a: "The maximum pressure the soil can support without failing.",
                                options: ["The weight of the machine's counterweights.", "The maximum pressure the soil can support without failing.", "The depth of the nearest water table.", "The speed at which a crane can travel across dirt."],
                                correct: 1
                            },
                            {
                                q: "Why is 'recent backfill' dangerous for crane outriggers?",
                                a: "It may look solid but lacks the density to support concentrated loads.",
                                options: ["It might contain chemical contaminants.", "It might be too hot and damage the outrigger pads.", "It may look solid but lacks the density to support concentrated loads.", "It makes the site look messy for inspectors."],
                                correct: 2
                            },
                            {
                                q: "What is the result of an outrigger pad sinking mid-lift?",
                                a: "Catastrophic shift in the center of gravity and likely tip-over.",
                                options: ["The crane's engine will stall automatically.", "The operator's seat will vibrate to give warning.", "Catastrophic shift in the center of gravity and likely tip-over.", "The load will become lighter due to the change in angle."],
                                correct: 2
                            },
                            {
                                q: "How do you calculate outrigger pressure roughly?",
                                a: "Total weight (crane + load) divided by the number of supporting pads.",
                                options: ["Total weight (crane + load) divided by the number of supporting pads.", "The weight of the load alone.", "The length of the boom multiplied by the angle.", "The pressure in the hydraulic system cylinders."],
                                correct: 0
                            },
                            {
                                q: "What should you check for beneath the surface before setup?",
                                a: "Buried utilities, voids, or old cellar tanks.",
                                options: ["High-speed fiber optic cables only.", "Buried utilities, voids, or old cellar tanks.", "The type of worms living in the soil.", "Remnants of previous construction workers."],
                                correct: 1
                            },
                            {
                                q: "What is 'point loading' in crane safety?",
                                a: "Concentrating the entire weight of a crane on a small area.",
                                options: ["The weight at the very tip of the hook.", "Concentrating the entire weight of a crane on a small area.", "Using only one outrigger instead of four.", "Lifting a load with a single wire rope."],
                                correct: 1
                            },
                            {
                                q: "How do timber mats (cribbing) help on soft ground?",
                                a: "They distribute the load over a much larger surface area.",
                                options: ["They provide a level surface for the machine tracks.", "They protect the soil from leaking oil.", "They distribute the load over a much larger surface area.", "They keep the outrigger pads warm in cold weather."],
                                correct: 2
                            }
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
                            {
                                q: "What is the maximum allowable tilt before a crane lift is unsafe?",
                                a: "0.5 degrees from level.",
                                options: ["1.0 degree — the standard tolerance for mobile cranes.", "2.0 degrees — acceptable on compacted ground.", "0.5 degrees from level.", "Any tilt is acceptable if outriggers are fully extended."],
                                correct: 2
                            },
                            {
                                q: "What is the primary cause of crane level changes during a lift?",
                                a: "Ground settlement under load.",
                                options: ["Wind pushing the boom to one side.", "Thermal expansion of the outrigger cylinders.", "Load sway causing dynamic forces on the superstructure.", "Ground settlement under load."],
                                correct: 3
                            },
                            {
                                q: "Where is the level indicator located on the LTM 11200?",
                                a: "In the operator's cab and often at the outrigger control panels.",
                                options: ["On the side of the engine block.", "In the operator's cab and often at the outrigger control panels.", "On the very top of the boom tip.", "In the site manager's office window."],
                                correct: 1
                            },
                            {
                                q: "How much can a 1-degree tilt affect stability at 100m extension?",
                                a: "It can reduce the stability margin by over 50%.",
                                options: ["It has no effect if the load is light.", "It reduces stability by exactly 1%.", "It can reduce the stability margin by over 50%.", "It only affects the speed of the swing."],
                                correct: 2
                            },
                            {
                                q: "When should the level be checked?",
                                a: "Before, during, and after every heavy lift.",
                                options: ["Once at the start of the week.", "Only if the crane feels like it is leaning.", "Before, during, and after every heavy lift.", "Only when the supervisor is present."],
                                correct: 2
                            },
                            {
                                q: "What is 'side-loading' in crane operations?",
                                a: "When the load is pulled at an angle, stress the boom sideways.",
                                options: ["Loading items into the side door of the cab.", "When the load is pulled at an angle, stress the boom sideways.", "The weight of the outriggers themselves.", "A special mode for lifting from the side of a building."],
                                correct: 1
                            },
                            {
                                q: "What device automatically monitors the crane's level?",
                                a: "Electronic inclinometers integrated into the LMI system.",
                                options: ["A mechanical plum-bob hanging from the ceiling.", "An app on the operator's smartphone.", "Electronic inclinometers integrated into the LMI system.", "A spirit level taped to the dashboard."],
                                correct: 2
                            },
                            {
                                q: "What should the operator do if the level changes mid-lift?",
                                a: "Stop all boom movements and carefully lower the load to the ground.",
                                options: ["Ignore it and finish the lift quickly.", "Increase the outrigger pressure while lifting.", "Stop all boom movements and carefully lower the load to the ground.", "Swing in the opposite direction of the tilt."],
                                correct: 2
                            },
                            {
                                q: "Why is an 'out-of-level' crane dangerous for the boom structure?",
                                a: "It creates torsion and side forces that the boom isn't designed for.",
                                options: ["It causes the hydraulic oil to pool on one side.", "It creates torsion and side forces that the boom isn't designed for.", "It makes the wire rope slide off the drum.", "The operator may fall out of the seat."],
                                correct: 1
                            },
                            {
                                q: "What is 'eccentric loading'?",
                                a: "When the weight is not perfectly centered over the support points.",
                                options: ["When the load is unusually shaped.", "When the weight is not perfectly centered over the support points.", "Lifting a load that is lighter than 1 tonne.", "Using an old, worn out crane."],
                                correct: 1
                            }
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
                            {
                                q: "When can outriggers safely be retracted?",
                                a: "Only after the boom is fully telescoped and stored on the rack.",
                                options: ["As soon as the load is safely set down.", "Once the operator has confirmed the area is clear.", "Only after the boom is fully telescoped and stored on the rack.", "Only after the engine has been running for 10 minutes on shutdown."],
                                correct: 2
                            },
                            {
                                q: "What is the correct outrigger retraction sequence?",
                                a: "Rear outriggers first, then front.",
                                options: ["Front outriggers first, then rear.", "All four simultaneously for balanced retraction.", "Rear outriggers first, then front.", "Whichever side is closer to the operator."],
                                correct: 2
                            },
                            {
                                q: "Why must the boom be telescoped 'in' before retracting outriggers?",
                                a: "To lower the center of gravity and ensure machine stability.",
                                options: ["To prevent the boom from hitting overhead lines.", "To lower the center of gravity and ensure machine stability.", "To clean the dust off the boom segments.", "A retracted boom is easier for the engine to carry."],
                                correct: 1
                            },
                            {
                                q: "What risk is present if front outriggers are retracted first on a hill?",
                                a: "The crane could tip over or roll uncontrollably.",
                                options: ["The engine might overheat.", "The crane could tip over or roll uncontrollably.", "The cab's door might jam shut.", "The hydraulic pump will lose its prime."],
                                correct: 1
                            },
                            {
                                q: "What should you check before moving an outrigger beam?",
                                a: "That no personnel are in the outrigger's path or crush zones.",
                                options: ["The tire pressure of the crane.", "That no personnel are in the outrigger's path or crush zones.", "The weight of the boom.", "The radio station frequency."],
                                correct: 1
                            },
                            {
                                q: "What are 'outrigger beam locks'?",
                                a: "Mechanical pins or bolts that prevent the outriggers from extending while on the road.",
                                options: ["Locks that prevent anyone from stealing the outrigger pads.", "Mechanical pins or bolts that prevent the outriggers from extending while on the road.", "Devices used to keep the crane level on a slope.", "A special key used only by the crane manufacturer."],
                                correct: 1
                            },
                            {
                                q: "Can help from a signalman be used during outrigger retraction?",
                                a: "Yes, it is highly recommended in congested sites.",
                                options: ["No, the operator must be alone for focus.", "Only if the electronic sensors are broken.", "Yes, it is highly recommended in congested sites.", "Only during nighttime operations."],
                                correct: 2
                            },
                            {
                                q: "What happens to the tires when the outriggers are retracted?",
                                a: "The full weight of the crane shifts back onto the suspension and tires.",
                                options: ["The tires automatically inflate to higher pressure.", "The full weight of the crane shifts back onto the suspension and tires.", "The tires unlock and begin to rotation.", "Nothing, the tires were already carrying the weight."],
                                correct: 1
                            },
                            {
                                q: "What is 'axle loading' limits during road travel?",
                                a: "The maximum weight allowed per wheel/axle on public roads.",
                                options: ["The maximum lift capacity of a single axle.", "The maximum weight allowed per wheel/axle on public roads.", "The speed limit for a multi-axle crane.", "The number of hours a driver can be behind the wheel."],
                                correct: 1
                            },
                            {
                                q: "What should you do if an outrigger beam gets stuck during retraction?",
                                a: "Stop immediately and inspect for mechanical debris or hydraulic faults.",
                                options: ["Apply more hydraulic force to break it loose.", "Grease the beam while it is under pressure.", "Stop immediately and inspect for mechanical debris or hydraulic faults.", "Leave it extended and drive back slowly."],
                                correct: 2
                            }
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
                            {
                                q: "At what sustained wind speed must all crane lifting cease?",
                                a: "20 mph (9 m/s).",
                                options: ["10 mph (4.5 m/s).", "15 mph (6.7 m/s).", "20 mph (9 m/s).", "30 mph (13 m/s) — the gust limit only."],
                                correct: 2
                            },
                            {
                                q: "Where must the anemometer be positioned on the crane?",
                                a: "At boom tip height.",
                                options: ["At cab level for easy operator reading.", "At ground level for calibrated baseline readings.", "At mid-boom height as a compromise point.", "At boom tip height."],
                                correct: 3
                            },
                            {
                                q: "Why is 'gust' speed more dangerous than sustained wind?",
                                a: "It can cause the load and boom to sway violently without warning.",
                                options: ["It blows dust into the operator's eyes.", "It makes the cab feel colder.", "It can cause the load and boom to sway violently without warning.", "It causes the hydraulic oil to overheat."],
                                correct: 2
                            },
                            {
                                q: "What is 'sail area' in crane operations?",
                                a: "The surface area of the load that catches the wind.",
                                options: ["The area of the crane's counterweight.", "The surface area of the load that catches the wind.", "The size of the exclusion zone around the crane.", "The distance the boom tip travels in a full swing."],
                                correct: 1
                            },
                            {
                                q: "How does wind affect a high-reach lift differently than a low lift?",
                                a: "Wind speed is significantly higher at height than at ground level.",
                                options: ["Wind is slower at height because there are no buildings.", "Wind has no effect once the load is off the ground.", "Wind speed is significantly higher at height than at ground level.", "There is no difference in wind speed."],
                                correct: 2
                            },
                            {
                                q: "If wind speed is borderline, who has the final say in stopping work?",
                                a: "The Crane Operator or the Appointed Person.",
                                options: ["The site owner.", "The truck driver.", "The Crane Operator or the Appointed Person.", "The local weather reporter."],
                                correct: 2
                            },
                            {
                                q: "What is 'dynamic amplification' from wind?",
                                a: "Forces created when a load begins to oscillate (bounce/swing).",
                                options: ["When the wind sounds louder in the boom structure.", "Forces created when a load begins to oscillate (bounce/swing).", "Using a radio to amplify the weather warnings.", "The way wind spins the anemometer faster."],
                                correct: 1
                            },
                            {
                                q: "What should be done with a load if wind suddenly spikes mid-lift?",
                                a: "Calmly lower the load to the nearest safe landing spot.",
                                options: ["Swing the crane with the wind to reduce pressure.", "Calmly lower the load to the nearest safe landing spot.", "Hold the load high until the wind drops.", "Radio the office for a new wind speed reading."],
                                correct: 1
                            },
                            {
                                q: "Does rain affect wind speed limits?",
                                a: "Not directly, but wet conditions combined with wind increase overall risk.",
                                options: ["Yes, wind speed limits drop by 50% during rain.", "No, water makes the machine more stable.", "Not directly, but wet conditions combined with wind increase overall risk.", "Rain only affects ground bearing capacity."],
                                correct: 2
                            },
                            {
                                q: "What is the danger of 'vortex shedding' on a boom?",
                                a: "Wind creating repetitive shaking that can fatigue the steel.",
                                options: ["Water falling off the boom segments.", "Wind creating repetitive shaking that can fatigue the steel.", "Dust blowing out of the lattice structure.", "The boom tip rotating like a drill."],
                                correct: 1
                            }
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
                            {
                                q: "At what distance must crane operations cease due to lightning?",
                                a: "10 miles (16 km).",
                                options: ["5 miles (8 km) — visual lightning only.", "3 miles (5 km) — when thunder is audible.", "10 miles (16 km).", "Only when lightning is directly overhead."],
                                correct: 2
                            },
                            {
                                q: "What must be done with the boom when a storm approaches?",
                                a: "Lowered to minimum elevation.",
                                options: ["Locked at maximum height to avoid movement.", "Retracted horizontally to reduce surface area.", "Left in current position with all locks applied.", "Lowered to minimum elevation."],
                                correct: 3
                            },
                            {
                                q: "Why is a crane especially vulnerable to lightning strikes?",
                                a: "It is often the tallest, most conductive structure on a site.",
                                options: ["The hydraulic oil attracts static electricity.", "The radio antennas are very sensitive to thunder.", "It is often the tallest, most conductive structure on a site.", "The tires are made of a special conductive rubber."],
                                correct: 2
                            },
                            {
                                q: "What is the '30-30 rule' in storm safety?",
                                a: "Wait 30 mins after the last thunder/lightning before resuming.",
                                options: ["Stop work if the wind is 30mph for 30 seconds.", "Wait 30 mins after the last thunder/lightning before resuming.", "Cease operations if lightning is 30 miles away.", "Store 30 liters of water for every 30 hours of work."],
                                correct: 1
                            },
                            {
                                q: "Where should the operator go when evacuating for lightning?",
                                a: "To a grounded, enclosed building or a non-crane vehicle.",
                                options: ["Under the crane's chassis for protection.", "Inside the operator's cab with the door open.", "To a grounded, enclosed building or a non-crane vehicle.", "To the highest point on the site to watch the storm."],
                                correct: 2
                            },
                            {
                                q: "What can happen to the crane's electronics during a strike?",
                                a: "Complete destruction of control systems (LMI, engine ECU).",
                                options: ["They may reboot and work better than before.", "They will be charged with extra power for the rest of the day.", "Complete destruction of control systems (LMI, engine ECU).", "The radio will only play static forever."],
                                correct: 2
                            },
                            {
                                q: "What must happen after a lightning strike on a crane?",
                                a: "A full structural and NDT inspection before resuming any work.",
                                options: ["Wait for the rain to wash the char marks off.", "A full structural and NDT inspection before resuming any work.", "Respray the affected area with paint.", "Reset the main fuse and start lifting immediately."],
                                correct: 1
                            },
                            {
                                q: "What is the danger of touching the crane during a strike?",
                                a: "Fatal electrocution through 'touch potential'.",
                                options: ["A static shock similar to a carpet spark.", "Your fingerprints will be permanently burned onto the steel.", "Fatal electrocution through 'touch potential'.", "The crane will become magnetic and trap you."],
                                correct: 2
                            },
                            {
                                q: "Can the crane be used to shelter from a storm?",
                                a: "No, the crane is a hazard during a storm; stay away.",
                                options: ["Yes, the metal cab acts as a safe 'Faraday Cage'.", "Only if the outriggers are all earthed with wires.", "No, the crane is a hazard during a storm; stay away.", "Yes, but only if the engine is running."],
                                correct: 2
                            },
                            {
                                q: "Does modern crane design include 'lightning protection' blocks?",
                                a: "Some do, but they are seldom 100% effective against direct hits.",
                                options: ["Yes, all modern Liebherrs are 100% lightning-proof.", "No, it is impossible to protect a crane from lightning.", "Some do, but they are seldom 100% effective against direct hits.", "Only if they are painted in special anti-static colors."],
                                correct: 2
                            }
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
                            {
                                q: "Below what temperature does structural steel become brittle?",
                                a: "Below -20 degrees Celsius.",
                                options: ["Below 0 degrees Celsius — freezing point.", "Below -10 degrees Celsius.", "Below -20 degrees Celsius.", "Below -40 degrees Celsius — extreme arctic conditions only."],
                                correct: 2
                            },
                            {
                                q: "By how much must crane capacity be reduced in cold weather?",
                                a: "10% for every 10 degrees below -10 C.",
                                options: ["5% for every 10 degrees below 0 C.", "20% flat reduction below -10 C.", "10% for every 10 degrees below -10 C.", "No reduction — load charts already account for cold weather."],
                                correct: 2
                            },
                            {
                                q: "What is 'ductile-to-brittle' transition in steel?",
                                a: "The point where steel snaps instead of bending under load.",
                                options: ["When steel turns into liquid at high heat.", "The point where steel snaps instead of bending under load.", "Moving the machine from indoor to outdoor storage.", "A chemical reaction caused by road salt."],
                                correct: 1
                            },
                            {
                                q: "What happens to hydraulic oil in extreme heat (+40 C)?",
                                a: "It becomes less viscous (thinner), causing internal leaks and heat.",
                                options: ["It turns into a solid jelly.", "It becomes more efficient at creating pressure.", "It becomes less viscous (thinner), causing internal leaks and heat.", "It loses its color and becomes transparent."],
                                correct: 2
                            },
                            {
                                q: "How should a boom be 'pre-warmed' in extreme cold?",
                                a: "Slowly cycling hydraulic oil through cylinders and following manual protocols.",
                                options: ["Using a gas torch to heat the boom segments.", "Slowly cycling hydraulic oil through cylinders and following manual protocols.", "Leaving the engine running for 5 hours at full RPM.", "Wrapping the boom in electric blankets."],
                                correct: 1
                            },
                            {
                                q: "Does extreme cold affect the crane's Load Moment Indicator?",
                                a: "Yes, sensors can freeze or give inaccurate readings in extreme cold.",
                                options: ["No, electronics work better in the cold.", "Only if snow gets inside the cab.", "Yes, sensors can freeze or give inaccurate readings in extreme cold.", "Only if the battery dies."],
                                correct: 2
                            },
                            {
                                q: "What is 'shock loading' and why is it worse in the cold?",
                                a: "Sudden impacts on the boom; brittle steel cannot absorb the force.",
                                options: ["Lifting a load that is electrically charged.", "Sudden impacts on the boom; brittle steel cannot absorb the force.", "The noise of the boom segments hitting together.", "A special mode for demolition work."],
                                correct: 1
                            },
                            {
                                q: "What is the danger of ice on the boom segments?",
                                a: "Ice adds weight and can cause segments to jam during telescoping.",
                                options: ["It might fall off and hit someone below.", "The boom will reflect sunlight and blind the operator.", "Ice adds weight and can cause segments to jam during telescoping.", "Ice makes the boom easier to clean."],
                                correct: 2
                            },
                            {
                                q: "When should hydraulic oil be changed for cold weather?",
                                a: "Switch to a low-viscosity (winter grade) oil as recommended by Liebherr.",
                                options: ["Every time the temperature drops below 10 C.", "Switch to a low-viscosity (winter grade) oil as recommended by Liebherr.", "Hydraulic oil never needs to be changed for weather.", "Only when the machine fails to start."],
                                correct: 1
                            },
                            {
                                q: "What part of the crane is most likely to fail in extreme cold?",
                                a: "Hydraulic seals and high-strength boom steel.",
                                options: ["The rubber mats on the floor of the cab.", "Hydraulic seals and high-strength boom steel.", "The paint on the counterweights.", "The glass in the side windows."],
                                correct: 1
                            }
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
                            {
                                q: "When is a formal written lift plan legally required?",
                                a: "For lifts exceeding 10 tonnes or classified as complex.",
                                options: ["For all lifts, regardless of weight.", "Only for tandem lifts involving two cranes.", "For lifts exceeding 10 tonnes or classified as complex.", "Only when operating within 10m of a public highway."],
                                correct: 2
                            },
                            {
                                q: "What is the most common critical error found in lift plans?",
                                a: "Incorrect center of gravity calculation.",
                                options: ["Underestimating the wind load factor.", "Choosing the wrong sling type for the load shape.", "Incorrect center of gravity calculation.", "Failing to account for outrigger pad area."],
                                correct: 2
                            },
                            {
                                q: "What is the 'Appointed Person' (AP) in lifting operations?",
                                a: "The person responsible for the safety and planning of the lift.",
                                options: ["The person who buys the crane.", "The person responsible for the safety and planning of the lift.", "The newest member of the rigging crew.", "A government official who inspects the crane yearly."],
                                correct: 1
                            },
                            {
                                q: "Why is 'center of gravity' (CoG) so important in rigging?",
                                a: "If the hook isn't over the CoG, the load will swing when lifted.",
                                options: ["It determines the weight of the load.", "If the hook isn't over the CoG, the load will swing when lifted.", "It helps calculate the wind speed.", "It indicates how long the lift will take."],
                                correct: 1
                            },
                            {
                                q: "What belongs in an 'Exclusion Zone'?",
                                a: "Absolutely no one except the certified lifting crew.",
                                options: ["Site office staff and visitors.", "Site vehicles and dumpsters.", "Absolutely no one except the certified lifting crew.", "Only the site manager and the owner."],
                                correct: 2
                            },
                            {
                                q: "How can you verify the weight of a load for a lift plan?",
                                a: "Using shipping documents, theoretical calculations, or a load cell test.",
                                options: ["Guessing based on the size of the object.", "Using shipping documents, theoretical calculations, or a load cell test.", "Asking the client how much they think it weighs.", "Measuring the volume and doubling it to be safe."],
                                correct: 1
                            },
                            {
                                q: "What is a 'Toolbox Talk' before a lift?",
                                a: "A briefing for all staff involved to discuss the specific lift plan.",
                                options: ["A training session on how to repair tools.", "A briefing for all staff involved to discuss the specific lift plan.", "A test to ensure the radio batteries are charged.", "A meeting to discuss pay and site schedules."],
                                correct: 1
                            },
                            {
                                q: "Does a lift plan ever change mid-lift?",
                                a: "No; if conditions change, the lift must be stopped and the plan re-assessed.",
                                options: ["Yes, the operator can adjust it on the fly.", "Only if the supervisor approves via radio.", "No; if conditions change, the lift must be stopped and the plan re-assessed.", "Only if the load becomes lighter during the lift."],
                                correct: 2
                            },
                            {
                                q: "What is a 'Blind Lift'?",
                                a: "A lift where the operator cannot see the load or the landing area.",
                                options: ["When the operator closes their eyes for focus.", "A lift where the operator cannot see the load or the landing area.", "Lifting at night with no site lights.", "A lift performed by an uncertified operator."],
                                correct: 1
                            },
                            {
                                q: "Who is responsible for ensuring the ground is safe for a 11200 crane?",
                                a: "The Principal Contractor / Site Manager in consultation with the AP.",
                                options: ["The crane operator alone.", "The Principal Contractor / Site Manager in consultation with the AP.", "The local council's road department.", "The person receiving the load at the landing spot."],
                                correct: 1
                            }
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
                            {
                                q: "What is the maximum capacity each crane can use in a tandem lift?",
                                a: "75% of rated capacity.",
                                options: ["50% — to ensure equal load sharing.", "75% of rated capacity.", "90% — only the primary crane is reduced.", "100% — the load is shared so full capacity is safe."],
                                correct: 1
                            },
                            {
                                q: "What communication method is required during a tandem lift?",
                                a: "Direct radio communication between operators.",
                                options: ["Hand signals coordinated by the lift supervisor.", "Direct radio communication between operators.", "Visual contact with a flagging system only.", "A shared monitor feed in each cab."],
                                correct: 1
                            },
                            {
                                q: "Why is a tandem lift considered 'high-risk'?",
                                a: "One crane moving too fast can rapidly overload the second crane.",
                                options: ["It uses twice as much fuel as a single lift.", "Two cranes together produce a dangerous magnetic field.", "One crane moving too fast can rapidly overload the second crane.", "It is much harder to clean two cranes after the work."],
                                correct: 2
                            },
                            {
                                q: "What happens if one crane's outrigger sinks during a tandem lift?",
                                a: "The entire load weight will shift to the other crane, causing total failure.",
                                options: ["The second crane will automatically take the extra weight.", "Nothing, tandem lifts are designed to handle sinking ground.", "The entire load weight will shift to the other crane, causing total failure.", "The site manager will stop the work for a coffee break."],
                                correct: 2
                            },
                            {
                                q: "Who is in charge of the tandem lift sequence?",
                                a: "A single designated Lift Supervisor managing both operators.",
                                options: ["Both operators decide their own movements together.", "The newest operator leads the lift.", "A single designated Lift Supervisor managing both operators.", "The person who owns the load being lifted."],
                                correct: 2
                            },
                            {
                                q: "How should the two cranes be positioned?",
                                a: "According to a detailed engineering drawing and site plan.",
                                options: ["Wherever they have enough space to swing.", "As close together as possible to reduce load length.", "According to a detailed engineering drawing and site plan.", "They should face opposite directions for balance."],
                                correct: 2
                            },
                            {
                                q: "What is 'load share' in tandem lifting?",
                                a: "The percentage of the total weight each crane is carrying.",
                                options: ["Splitting the cost of the crane hire between sites.", "The way wind is shared between the two booms.", "The percentage of the total weight each crane is carrying.", "Giving the operator a break halfway through the lift."],
                                correct: 2
                            },
                            {
                                q: "What is the benefit of using a 'spreader beam' in a tandem lift?",
                                a: "It helps keep the slings vertical and stabilizes the load share.",
                                options: ["It makes the crane boom appear longer.", "It helps keep the slings vertical and stabilizes the load share.", "It reduces the weight of the load by half.", "It adds extra color to the site for better visibility."],
                                correct: 1
                            },
                            {
                                q: "What happens if radio contact is lost mid-lift?",
                                a: "All movements must stop immediately until contact is restored.",
                                options: ["Continue using hand signals to finish the lift.", "The most experienced operator takes full control.", "All movements must stop immediately until contact is restored.", "Assume everything is fine and continue as planned."],
                                correct: 2
                            },
                            {
                                q: "Should tandem lifts be performed at night?",
                                a: "Only under exceptional circumstances with extremely high lighting levels.",
                                options: ["No, it is strictly illegal to perform tandem lifts at night.", "Yes, it is safer at night because of fewer site staff.", "Only under exceptional circumstances with extremely high lighting levels.", "Only if the crane booms are painted white."],
                                correct: 2
                            }
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
