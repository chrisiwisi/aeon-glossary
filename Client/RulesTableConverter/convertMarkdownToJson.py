import re
import json
import argparse

def detect_tags(text, include_tags):
    tags = set(include_tags)
    if re.search(r'Cycle\s+[IVX]+', text):
        for match in re.findall(r'Cycle\s+([IVX]+)', text):
            tags.add(f"Cycle {match}")
    return sorted(tags)

def extract_entries(md_text, include_tags):
    pattern = r"\n(\d+)\.\s+\*\*(.+?)\*\*\s*((?:.|\n)*?)(?=\n\d+\.\s+\*\*|\Z)"
    matches = re.findall(pattern, md_text, re.DOTALL)

    entries = []
    for num, keyword, desc in matches:
        entry = {
            "id": f"A.{num}",
            "name": keyword.strip(),
            "rule": ' '.join(desc.strip().split()),
            "keywords": detect_tags(desc, include_tags)
        }
        entries.append(entry)
    return entries

def main():
    parser = argparse.ArgumentParser(description="Extract keywords from markdown into JSON.")
    parser.add_argument("--input", "-i", required=True, help="Path to the input markdown file")
    parser.add_argument("--output", "-o", default="keyword_rules.json", help="Path to the output JSON file")
    parser.add_argument("--tags", "-t", nargs="+", help="Tags to include in the output")

    args = parser.parse_args()

    with open(args.input, "r", encoding="utf-8") as file:
        md_content = file.read()

    entries = extract_entries(md_content, args.tags)

    with open(args.output, "w", encoding="utf-8") as json_file:
        json.dump(entries, json_file, indent=4, ensure_ascii=False)

    print(f"✅ JSON saved to {args.output}")

if __name__ == "__main__":
    main()
