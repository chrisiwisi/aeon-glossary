import re
import json
import argparse

def detect_tags(text, include_tags):
    if isinstance(include_tags, str):
        include_tags = [include_tags]

    tags = set(include_tags)
    if re.search(r'Cycle\s+[IVX\d]+', text):
        for match in re.findall(r'Cycle\s+([IVX\d]+)', text):
            tags.add(f"Cycle {match}")
    return sorted(tags)

def extract_entries(md_text):
    chapter_matches = [match.group(1) for match in re.finditer(r"\{#([^\}]+)\}", md_text)]

    pattern = r"\n(?<!# )(\d+)\.\s+(?!#)\*\*(.+?)\*\*\s*((?:.|\n)*?)(?=\n\d+\.\s+(?!#)\*\*(?!\*)|\n\d+\.\s+#|\n#+\s+\*\*References List\*\*\s+\{#references-list\}|\Z)"
    matches = re.findall(pattern, md_text, re.DOTALL)

    entries = []
    chapter_index = 1
    current_chapter = "A"
    for num, keyword, desc in matches:
        if num == "1" and chapter_index + 1 < len(chapter_matches):
            chapter_index += 1
            current_chapter = chapter_matches[chapter_index]
            
        entry = {
            "id": f"{current_chapter}.{num}",
            "name": keyword.strip(),
            "rule": clean_rule_text(desc),
            "keywords": detect_tags(desc, current_chapter)
        }
        entries.append(entry)
    return entries

def clean_rule_text(text):
    return '\n'.join(
        line.rstrip()
        for line in text.strip().splitlines()
        if line.strip()  # keep only non-empty lines
    )

def main():
    parser = argparse.ArgumentParser(description="Extract keywords from markdown into JSON.")
    parser.add_argument("--input", "-i", required=True, help="Path to the input markdown file")
    parser.add_argument("--output", "-o", default="rules.json", help="Path to the output JSON file")

    args = parser.parse_args()

    with open(args.input, "r", encoding="utf-8") as file:
        md_content = file.read()

    entries = extract_entries(md_content)

    with open(args.output, "w", encoding="utf-8") as json_file:
        json.dump(entries, json_file, indent=4, ensure_ascii=False)

    print(f"✅ JSON saved to {args.output}")

if __name__ == "__main__":
    main()
