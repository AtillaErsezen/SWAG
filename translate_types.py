import json
from deep_translator import GoogleTranslator
import time

machine_types = [
    "Track Tamping Machine",
    "Railway Crane",
    "Rail Grinding Machine",
    "Rail Milling Machine",
    "Ballast Distribution System",
    "Dynamic Track Stabilizer",
    "Material Feeder / Storage",
    "Track Renewal Machine",
    "Switch & Crossing Renewal",
    "Hybrid Locomotive",
    "Electric Locomotive",
    "Track Inspection Vehicle",
    "Catenary Maintenance Vehicle",
    "Diesel Locomotive",
    "Shunting Locomotive",
    "Diesel-Electric Locomotive",
    "Multi-Purpose Vehicle",
    "Diesel-Hydraulic Shunter",
    "Track Circuit Equipment"
]

languages = ['en', 'tr', 'ar', 'pl', 'ro', 'pt', 'es', 'fr', 'de', 'it', 'nl', 'el', 'hu', 'cs', 'bg', 'uk', 'sr', 'hi', 'bn', 'ur', 'id']

def to_key(name):
    return 'type_' + name.lower().replace(' & ', '_').replace(' / ', '_').replace('-', '_').replace(' ', '_')

results = {lang: {} for lang in languages}

print("Translating machine types...")
for lang in languages:
    if lang == 'en':
        for type_str in machine_types:
            results[lang][to_key(type_str)] = type_str
        continue
        
    print(f"Translating to {lang}...")
    try:
        translated = GoogleTranslator(source='en', target=lang).translate_batch(machine_types)
        for i, t in enumerate(translated):
            results[lang][to_key(machine_types[i])] = t
    except Exception as e:
        print(f"Error {lang}: {e}")
        time.sleep(1)

with open('c:\\Users\\ersez\\SWAG\\Site Marshall\\Site Marshal\\src\\data\\machineTranslations.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print("Done! Saved to machineTranslations.json")
