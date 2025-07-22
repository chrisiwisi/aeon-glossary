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
    # Capture chapter headers and their position in the text
    chapter_matches = [
        (match.start(), match.group(1))
        for match in re.finditer(r"\{#([^\}]+)\}", md_text)
    ]

    # Rule pattern
    pattern = r"\n(?<!# )(\d+)\.\s+(?!#)\*\*(.+?)\*\*\s*((?:.|\n)*?)(?=\n\d+\.\s+(?!#)\*\*(?!\*)|\n\d+\.\s+#|\n#+\s|\Z)"
    rule_matches = list(re.finditer(pattern, md_text, re.DOTALL))

    entries = []
    for match in rule_matches:
        num, keyword, desc = match.groups()
        rule_pos = match.start()

        current_chapter = "A"
        for pos, chap in chapter_matches:
            if pos < rule_pos:
                current_chapter = chap
            else:
                break

        entry = {
            "id": f"{current_chapter}.{num}",
            "name": keyword.strip(),
            "rule": clean_rule_text(desc),
            "keywords": detect_tags(desc, current_chapter)
        }
        entries.append(entry)

    return entries



def clean_rule_text(text):
    lines = text.strip().splitlines()
    cleaned = []

    for line in lines:
        stripped = line.strip()

        if not stripped:
            cleaned.append("")
            continue

        leading_spaces = len(line) - len(stripped)

        # Detect numbered list items like "1. **Something**"
        if re.match(r"^\d+\.\s", stripped):
            nesting_level = leading_spaces // 4
            new_indent = " " * (3 * nesting_level)
            cleaned.append(f"{new_indent}{stripped}")
        else:
            # Reduce indent to avoid Markdown code block
            if leading_spaces >= 4:
                cleaned.append(" " * (leading_spaces - 1) + stripped)
            else:
                cleaned.append(line.rstrip())

    return "\n".join(cleaned)

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
