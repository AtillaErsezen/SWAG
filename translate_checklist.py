import json
from deep_translator import GoogleTranslator
import time
import os

checklistItems = {
    "Excavator": [
        { "id": 'c1', "label": 'Engine oil level verified', "critical": True },
        { "id": 'c2', "label": 'Hydraulic fluid level verified', "critical": True },
        { "id": 'c3', "label": 'Coolant level verified', "critical": True },
        { "id": 'c4', "label": 'Tracks and undercarriage inspected', "critical": False },
        { "id": 'c5', "label": 'All mirrors and cameras clean', "critical": False },
        { "id": 'c6', "label": 'Fire extinguisher present and charged', "critical": True },
        { "id": 'c7', "label": 'Seat belt functional', "critical": True },
        { "id": 'c8', "label": 'Horn and backup alarm tested', "critical": False },
        { "id": 'c9', "label": 'No visible hydraulic leaks', "critical": True },
        { "id": 'c10', "label": 'PPE worn (hardhat, vest, boots)', "critical": True },
    ],
    "Mobile Crane": [
        { "id": 'c1', "label": 'Outrigger pads and timber mats staged', "critical": True },
        { "id": 'c2', "label": 'Load chart for planned lift reviewed', "critical": True },
        { "id": 'c3', "label": 'Wind speed below operational limit', "critical": True },
        { "id": 'c4', "label": 'Overhead power line survey complete', "critical": True },
        { "id": 'c5', "label": 'All rigging and slings inspected', "critical": True },
        { "id": 'c6', "label": 'Boom and jib visually inspected', "critical": False },
        { "id": 'c7', "label": 'Anti-two-block device tested', "critical": True },
        { "id": 'c8', "label": 'Ground conditions assessed', "critical": True },
        { "id": 'c9', "label": 'Fire extinguisher present and charged', "critical": True },
        { "id": 'c10', "label": 'PPE worn (hardhat, vest, boots)', "critical": True },
    ]
}

ui_strings = {
    "pre_shift_inspection": "Pre-Shift Inspection",
    "of": "of",
    "items_verified": "items verified",
    "critical_items_remaining": "critical item(s) remaining",
    "machine_operation_prohibited": "Machine operation is prohibited until all critical items are verified.",
    "critical_mandatory": "CRITICAL · MANDATORY",
    "sign_off_proceed": "SIGN OFF & PROCEED",
    "items_remaining": "ITEMS REMAINING",
    "machine_not_found": "Machine Not Found"
}

target_languages = [
    'nl', 'fr', 'de', 'pl', 'tr', 'ro', 'pt', 'es'
]

# Create translation function with retries
def translate_text(text, target):
    if not text: return text
    if target == 'en': return text
    
    for attempt in range(3):
        try:
            time.sleep(0.3)  # Rate limiting
            return GoogleTranslator(source='en', target=target).translate(text)
        except Exception as e:
            print(f"Error translating '{text}' to {target}: {e}. Retrying {attempt+1}/3...")
            time.sleep(2)
    return text  # Fallback to English

def translate_checklist(checklist, target_lang):
    translated_checklist = {}
    for machine_type, items in checklist.items():
        translated_items = []
        for item in items:
            translated_items.append({
                "id": item["id"],
                "label": translate_text(item["label"], target_lang),
                "critical": item["critical"]
            })
        translated_checklist[machine_type] = translated_items
    return translated_checklist

def translate_ui(ui_dict, target_lang):
    translated_ui = {}
    for key, text in ui_dict.items():
        translated_ui[key] = translate_text(text, target_lang)
    return translated_ui

def main():
    print("Starting Checklist translations...")
    all_data = {
        "en": {
            "checklists": checklistItems,
            "ui": ui_strings
        }
    }
    
    for lang in target_languages:
        print(f"\n[{lang.upper()}] Translating...")
        lang_checklists = translate_checklist(checklistItems, lang)
        lang_ui = translate_ui(ui_strings, lang)
        
        all_data[lang] = {
            "checklists": lang_checklists,
            "ui": lang_ui
        }
        print(f"[{lang.upper()}] Done.")
    
    # Save to JS file
    output_path = os.path.join(os.getcwd(), 'Site Marshall', 'Site Marshal', 'src', 'data', 'localizedChecklists.js')
    
    js_content = f"// Auto-generated checklist translations\n\nexport const localizedChecklists = {json.dumps(all_data, indent=4, ensure_ascii=False)};\n"
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(js_content)
        
    print(f"\nAll translations saved successfully to {output_path}")

if __name__ == "__main__":
    main()
