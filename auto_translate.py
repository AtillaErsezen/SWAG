import json
import os
import anthropic
from dotenv import load_dotenv

load_dotenv()

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

with open('Site Marshall/strings.json', 'r', encoding='utf-8') as f:
    strings = json.load(f)

print(f"Loaded {len(strings)} strings.")

chunk_size = 50
translated_dict_en = {}
translated_dict_nl = {}

for i in range(0, len(strings), chunk_size):
    chunk = strings[i:i+chunk_size]
    print(f"Translating chunk {i} to {i+len(chunk)}...")
    
    prompt = "I have a list of strings from a heavy machinery UI app. Please return a JSON object where the keys are the EXACT original strings, and the values are their Dutch translations. Only reply with the JSON, nothing else.\n\n"
    prompt += json.dumps(chunk)
    
    msg = client.messages.create(
        model="claude-opus-4-7",
        max_tokens=4096,
        messages=[{"role": "user", "content": prompt}]
    )
    
    result = msg.content[0].text.strip()
    if result.startswith("```json"):
        result = result[7:-3]
    elif result.startswith("```"):
        result = result[3:-3]
        
    try:
        translated_chunk = json.loads(result)
        translated_dict_nl.update(translated_chunk)
    except Exception as e:
        print("Error parsing chunk:", e)
        print(result)
        
    for s in chunk:
        translated_dict_en[s] = s

with open('Site Marshall/translated_nl.json', 'w', encoding='utf-8') as f:
    json.dump(translated_dict_nl, f, indent=2, ensure_ascii=False)

with open('Site Marshall/translated_en.json', 'w', encoding='utf-8') as f:
    json.dump(translated_dict_en, f, indent=2, ensure_ascii=False)

print("Done translating!")
