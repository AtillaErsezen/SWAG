import json
from deep_translator import GoogleTranslator
import time

# Define the source data (extracted identically from mockData.js)
TAMPING_UNITS = [
    {
        "id": "unit-1", "title": "On-Track Safety & Protection", "completed": False, "progress": 0,
        "sections": [
            {
                "id": "1.1", "title": "Line Blockage & Exclusion Zones", "criticality": "rust-red",
                "completed": False, "progress": 0,
                "content": "A tamping machine must NEVER enter an unprotected line. A formal Engineering Possession must be confirmed before any on-track movement. Exclusion zones extend min 50 m each side of the work site, protected by detonators or signals.",
                "qChatContext": "Explain the difference between a line blockage and a possession, and why verbal-only permission is insufficient for tamping operations.",
                "summary": "Formal possession required before on-track work. 50m exclusion zones each side. No verbal-only permission.",
                "learnCards": [
                    { "q": "What must be confirmed before a tamping machine moves on-track?", "a": "A formal Engineering Possession.", "options": ["Verbal approval from a site supervisor.", "A formal Engineering Possession.", "The nearest signal showing green.", "Track cleared of ballast."], "correct": 1 },
                    { "q": "Minimum exclusion zone either side of a tamping site?", "a": "50 metres.", "options": ["10 m.", "25 m.", "50 metres.", "100 m."], "correct": 2 },
                    { "q": "Can a tamping machine move on verbal permission only?", "a": "No — written blockage authority is required.", "options": ["Yes, if the supervisor is on site.", "No — written blockage authority is required.", "Yes, during daylight hours only.", "Yes, below 5 km/h."], "correct": 1 }
                ]
            },
            {
                "id": "1.2", "title": "Tamping Tine Safety", "criticality": "safety-orange",
                "completed": False, "progress": 0,
                "content": "Tamping tines vibrate at high frequency and penetrate ballast to 450 mm depth. Never reach into the tamping zone while powered. Raise the tamping unit fully before travelling. Inspect tines for wear before each working cycle.",
                "qChatContext": "Why is contact with a vibrating tamping tine at operating frequency fatal, and what guarding prevents it?",
                "summary": "Never enter tamping zone while powered. Raise unit before travel. Inspect tines before each cycle.",
                "learnCards": [
                    { "q": "Ballast penetration depth of tamping tines?", "a": "Up to 450 mm.", "options": ["100 mm.", "200 mm.", "Up to 450 mm.", "600 mm."], "correct": 2 },
                    { "q": "When must tamping tines be inspected?", "a": "Before every working cycle.", "options": ["Weekly.", "Monthly.", "Before every working cycle.", "After blockage ends."], "correct": 2 },
                    { "q": "What must be done before travelling between working positions?", "a": "Tamping unit fully raised and locked.", "options": ["Reduce to idle.", "Tamping unit fully raised and locked.", "Sound horn twice.", "Confirm with PIC."], "correct": 1 }
                ]
            }
        ]
    }
]

CRANE_UNITS = [
    {
        "id": "unit-1", "title": "Railway Crane Safety", "completed": False, "progress": 0,
        "sections": [
            {
                "id": "1.1", "title": "Outrigger Deployment", "criticality": "rust-red",
                "completed": False, "progress": 0,
                "content": "All outriggers must be fully extended and locked before any lift. Ground-bearing pads are mandatory under each foot. A competent person must assess ground-bearing capacity — railway ballast and embankments require engineered pads.",
                "qChatContext": "How does uneven outrigger settlement cause overload during a railway crane lift?",
                "summary": "Outriggers fully extended and locked. Ground pads mandatory. Competent person assesses ground.",
                "learnCards": [
                    { "q": "Outrigger position before any lift?", "a": "Fully extended and mechanically locked.", "options": ["Half extended.", "Fully extended and mechanically locked.", "Ballast surface only.", "Retracted for on-track lifts."], "correct": 1 },
                    { "q": "Can a lift proceed with one outrigger not fully deployed?", "a": "No — all outriggers must be fully deployed.", "options": ["Yes, under 5 t.", "Yes, for side lifts.", "No — all outriggers must be fully deployed.", "Only for tandem lifts."], "correct": 2 },
                    { "q": "Who assesses ground-bearing capacity?", "a": "A competent person.", "options": ["The crane operator.", "Any team member.", "A competent person.", "The network controller."], "correct": 2 }
                ]
            },
            {
                "id": "1.2", "title": "Load Moment Indicator (LMI)", "criticality": "rust-red",
                "completed": False, "progress": 0,
                "content": "The LMI must be active at all times. If the alarm triggers, stop all boom and slew movement immediately. Never bypass the LMI. On-track recovery lifts require a formal lift plan per the Network's Vehicle Recovery Procedure.",
                "qChatContext": "Why is bypassing the LMI on a railway crane particularly dangerous compared to a road crane?",
                "summary": "LMI always active. Stop immediately on alarm. Never bypass. Formal lift plan for recovery lifts.",
                "learnCards": [
                    { "q": "If LMI alarm activates, first action?", "a": "Stop all boom and slew movements.", "options": ["Lower load immediately.", "Override and continue.", "Stop all boom and slew movements.", "Radio network controller."], "correct": 2 },
                    { "q": "Can the LMI be bypassed for a critical recovery lift?", "a": "No — bypassing LMI is prohibited.", "options": ["Yes, in emergency.", "Supervisor approval required.", "Only at night.", "No — bypassing LMI is prohibited."], "correct": 3 },
                    { "q": "What document is needed before a vehicle recovery lift?", "a": "Formal lift plan signed by appointed person.", "options": ["Email from operations.", "Verbal briefing from PIC.", "Formal lift plan signed by appointed person.", "Daily inspection form only."], "correct": 2 }
                ]
            }
        ]
    }
]

GRINDING_UNITS = [
    {
        "id": "unit-1", "title": "Rail Grinding Safety", "completed": False, "progress": 0,
        "sections": [
            {
                "id": "1.1", "title": "Spark & Fire Risk", "criticality": "rust-red",
                "completed": False, "progress": 0,
                "content": "Rail grinding generates intense sparks that ignite lineside vegetation. A fire watch person must be posted in fire-risk conditions. Water suppression must be operational before work starts. A 30-minute post-work fire patrol is mandatory.",
                "qChatContext": "Why is rail grinding classified as a high fire-risk activity and what seasonal restrictions apply?",
                "summary": "Sparks ignite vegetation. Fire watch required. Water suppression active. 30-min fire patrol after work.",
                "learnCards": [
                    { "q": "Duration of mandatory post-work fire patrol?", "a": "30 minutes minimum.", "options": ["5 min.", "15 min.", "30 minutes minimum.", "60 min."], "correct": 2 },
                    { "q": "What system must be operational before grinding?", "a": "On-board water suppression.", "options": ["Track circuit.", "On-board water suppression.", "Adjacent line warning.", "GPS tracking."], "correct": 1 },
                    { "q": "Highest fire risk condition for grinding?", "a": "Dry weather, low humidity, dense vegetation.", "options": ["Wet/windy weather.", "Below 5°C.", "Dry weather, low humidity, dense vegetation.", "Night operations."], "correct": 2 }
                ]
            },
            {
                "id": "1.2", "title": "Grinding Stone Inspection", "criticality": "safety-orange",
                "completed": False, "progress": 0,
                "content": "Inspect all grinding stones before each shift for cracks or chips. A cracked stone can explode at operating speed. Never exceed the max RPM rating. Discard stones worn below minimum diameter. Store dry and shock-free.",
                "qChatContext": "What is the physics of a grinding stone failure at operating speed and what PPE does not protect against it?",
                "summary": "Inspect stones before each shift. Never exceed max RPM. Discard at minimum diameter. Store dry.",
                "learnCards": [
                    { "q": "Consequence of operating a cracked grinding stone?", "a": "The stone can explode causing fatal injuries.", "options": ["Increased vibration.", "Reduced effectiveness.", "The stone can explode causing fatal injuries.", "Machine stops automatically."], "correct": 2 },
                    { "q": "When must grinding stones be discarded?", "a": "Worn to minimum permitted diameter.", "options": ["After every shift.", "Worn to minimum permitted diameter.", "After 100 km grinding.", "Only when visibly cracked."], "correct": 1 },
                    { "q": "How often must grinding stones be inspected?", "a": "Before each shift.", "options": ["Weekly.", "Monthly.", "Before each shift.", "When machine slows unexpectedly."], "correct": 2 }
                ]
            }
        ]
    }
]

RENEWAL_UNITS = [
    {
        "id": "unit-1", "title": "Track Renewal Safety", "completed": False, "progress": 0,
        "sections": [
            {
                "id": "1.1", "title": "Machine Train Formation", "criticality": "rust-red",
                "completed": False, "progress": 0,
                "content": "Renewal machines operate as multi-unit trains. All units must be coupled per the manufacturer's sequence before movement. Never uncouple a wagon on a gradient without applying the handbrake first.",
                "qChatContext": "Explain what a runaway wagon event is and how improper handbrake procedures cause them.",
                "summary": "Couple per manufacturer sequence. Apply wagon handbrakes before uncoupling on gradients.",
                "learnCards": [
                    { "q": "Before uncoupling on a gradient?", "a": "Apply the wagon handbrake.", "options": ["Chain between wagons.", "Apply the wagon handbrake.", "Wooden chocks under wheels.", "Machine emergency brake."], "correct": 1 },
                    { "q": "What is a runaway wagon?", "a": "An uncoupled wagon rolling uncontrolled on a gradient.", "options": ["Wagon exceeding speed limit.", "An uncoupled wagon rolling uncontrolled on a gradient.", "Wagon derailing during coupling.", "Wagon vibrating excessively."], "correct": 1 },
                    { "q": "Can the train travel with a wagon brake defect?", "a": "No — all brakes must be in working order.", "options": ["Yes, reduced speed.", "Yes, one wagon OK.", "No — all brakes must be in working order.", "Gradient <1% OK."], "correct": 2 }
                ]
            },
            {
                "id": "1.2", "title": "Silica Dust Control", "criticality": "safety-orange",
                "completed": False, "progress": 0,
                "content": "Ballast renewal generates crystalline silica dust causing silicosis. FFP3 RPE is mandatory. Water suppression or dust extraction must be operational. Formal dust monitoring is required for operations exceeding 30 minutes.",
                "qChatContext": "Why is crystalline silica dust more dangerous than ordinary dust, and why is monitoring mandatory?",
                "summary": "Silica dust — FFP3 RPE mandatory. Water suppression required. Monitor dust for operations >30 min.",
                "learnCards": [
                    { "q": "What substance in ballast dust causes silicosis?", "a": "Crystalline silica (quartz).", "options": ["Limestone dust.", "Iron oxide.", "Crystalline silica (quartz).", "Granite aggregate."], "correct": 2 },
                    { "q": "Minimum RPE for ballast renewal work?", "a": "FFP3 filtering facepiece.", "options": ["FFP1.", "FFP2.", "FFP3 filtering facepiece.", "Full airline set."], "correct": 2 },
                    { "q": "When is formal silica dust monitoring required?", "a": "Operations exceeding 30 minutes.", "options": [">2 hours.", ">1 hour.", "Operations exceeding 30 minutes.", "Always, regardless of duration."], "correct": 2 }
                ]
            }
        ]
    }
]

LOCO_UNITS = [
    {
        "id": "unit-1", "title": "Traction & Electrical Safety", "completed": False, "progress": 0,
        "sections": [
            {
                "id": "1.1", "title": "Overhead Line Equipment (OLE)", "criticality": "rust-red",
                "completed": False, "progress": 0,
                "content": "OLE operates at 25 kV AC or 15 kV AC — instantly fatal on contact. Minimum approach distance is 600 mm. OLE can only be touched after a formal Line Isolation and Earthing certificate is issued and confirmed.",
                "qChatContext": "Why can OLE become re-energised without warning even after an isolation has been confirmed?",
                "summary": "OLE 25kV/15kV — instantly fatal. Min 600mm approach. Only touch after Line Isolation & Earthing certificate.",
                "learnCards": [
                    { "q": "Minimum approach distance to live OLE?", "a": "600 mm.", "options": ["100 mm.", "300 mm.", "600 mm.", "1 metre."], "correct": 2 },
                    { "q": "When can OLE be physically touched?", "a": "Only after Line Isolation and Earthing certificate confirmed.", "options": ["Pantograph lowered.", "Substation visually off.", "Only after Line Isolation and Earthing certificate confirmed.", "10 min no train movement."], "correct": 2 },
                    { "q": "Why is OLE dangerous even when believed isolated?", "a": "Voltage can be re-introduced by automatic switching.", "options": ["Static build-up.", "Voltage can be re-introduced by automatic switching.", "Wire stays warm.", "Other workers unaware."], "correct": 1 }
                ]
            },
            {
                "id": "1.2", "title": "Brake Testing Before Departure", "criticality": "safety-orange",
                "completed": False, "progress": 0,
                "content": "A full brake test is mandatory before any movement. Brake pipe must be charged to 5 bar. A continuity test must confirm all wagon brakes are connected. Departure checklist must be signed before the train moves.",
                "qChatContext": "Explain the difference between the automatic brake and independent brake and why both must be tested.",
                "summary": "Full brake test before movement. Brake pipe 5 bar. All wagon brakes confirmed. Checklist signed.",
                "learnCards": [
                    { "q": "Required brake pipe pressure before departure?", "a": "5 bar.", "options": ["2 bar.", "3.5 bar.", "5 bar.", "7 bar."], "correct": 2 },
                    { "q": "What confirms all wagon brakes are functional?", "a": "The brake continuity test.", "options": ["Independent brake application.", "The brake continuity test.", "Visual walk-around.", "Low-speed braking test."], "correct": 1 },
                    { "q": "If the brake test fails, what happens?", "a": "Fault must be rectified before any movement.", "options": ["Move at half speed.", "Fault must be rectified before any movement.", "Report and proceed.", "Only automatic brake is mandatory."], "correct": 1 }
                ]
            }
        ]
    }
]

languages = [
    { "code": "en", "name": "English", "native": "English", "flag": "GB" },
    { "code": "tr", "name": "Turkish", "native": "Türkçe", "flag": "TR" },
    { "code": "ar", "name": "Arabic", "native": "العربية", "flag": "SA" },
    { "code": "pl", "name": "Polish", "native": "Polski", "flag": "PL" },
    { "code": "ro", "name": "Romanian", "native": "Română", "flag": "RO" },
    { "code": "pt", "name": "Portuguese", "native": "Português", "flag": "BR" },
    { "code": "es", "name": "Spanish", "native": "Español", "flag": "ES" },
    { "code": "fr", "name": "French", "native": "Français", "flag": "FR" },
    { "code": "de", "name": "German", "native": "Deutsch", "flag": "DE" },
    { "code": "it", "name": "Italian", "native": "Italiano", "flag": "IT" },
    { "code": "nl", "name": "Dutch", "native": "Nederlands", "flag": "NL" },
    { "code": "el", "name": "Greek", "native": "Ελληνικά", "flag": "GR" },
    { "code": "hu", "name": "Hungarian", "native": "Magyar", "flag": "HU" },
    { "code": "cs", "name": "Czech", "native": "Čeština", "flag": "CZ" },
    { "code": "bg", "name": "Bulgarian", "native": "Български", "flag": "BG" },
    { "code": "uk", "name": "Ukrainian", "native": "Українська", "flag": "UA" },
    { "code": "sr", "name": "Serbian", "native": "Српски", "flag": "RS" },
    { "code": "hi", "name": "Hindi", "native": "हिन्दी", "flag": "IN" },
    { "code": "bn", "name": "Bengali", "native": "বাংলা", "flag": "BD" },
    { "code": "ur", "name": "Urdu", "native": "اردو", "flag": "PK" },
    { "code": "id", "name": "Indonesian", "native": "Bahasa Indonesia", "flag": "ID" }
]

def translate_text(text, target_lang):
    if not text or target_lang == 'en':
        return text
    try:
        # deep-translator uses standard google language codes
        return GoogleTranslator(source='en', target=target_lang).translate(text)
    except Exception as e:
        print(f"    Translation failed for {target_lang}: {text[:20]}... Error: {e}")
        time.sleep(1) # Backoff
        return text

def translate_unit(unit, target_lang):
    translated_unit = unit.copy()
    translated_unit['title'] = translate_text(unit['title'], target_lang)
    
    translated_sections = []
    for section in unit['sections']:
        translated_section = section.copy()
        translated_section['title'] = translate_text(section['title'], target_lang)
        translated_section['content'] = translate_text(section['content'], target_lang)
        translated_section['qChatContext'] = translate_text(section['qChatContext'], target_lang)
        translated_section['summary'] = translate_text(section['summary'], target_lang)
        
        translated_cards = []
        for card in section['learnCards']:
            translated_card = card.copy()
            translated_card['q'] = translate_text(card['q'], target_lang)
            translated_card['a'] = translate_text(card['a'], target_lang)
            translated_card['options'] = [translate_text(opt, target_lang) for opt in card['options']]
            translated_cards.append(translated_card)
            
        translated_section['learnCards'] = translated_cards
        translated_sections.append(translated_section)
        
    translated_unit['sections'] = translated_sections
    return translated_unit

def main():
    localized_units = {}
    
    print("Starting translation...")
    for lang in languages:
        lang_code = lang['code']
        print(f"Translating to {lang['name']} ({lang_code})...")
        
        localized_units[lang_code] = {
            "TAMPING_UNITS": [translate_unit(u, lang_code) for u in TAMPING_UNITS],
            "CRANE_UNITS": [translate_unit(u, lang_code) for u in CRANE_UNITS],
            "GRINDING_UNITS": [translate_unit(u, lang_code) for u in GRINDING_UNITS],
            "RENEWAL_UNITS": [translate_unit(u, lang_code) for u in RENEWAL_UNITS],
            "LOCO_UNITS": [translate_unit(u, lang_code) for u in LOCO_UNITS]
        }
        
    output_path = "c:\\Users\\ersez\\SWAG\\Site Marshall\\Site Marshal\\src\\data\\localizedUnits.js"
    print(f"Generating localized file at {output_path}...")
    
    js_content = f"// AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.\n\nexport const localizedMachineUnits = {json.dumps(localized_units, indent=2, ensure_ascii=False)};\n"
    
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(js_content)
        
    print("Translation complete!")

if __name__ == "__main__":
    main()
