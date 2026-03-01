#!/usr/bin/env python3
"""Convert migrated-remote-articles-improved.json to individual Markdown files."""

import json
import os
import re
import unicodedata

INPUT_FILE = "/Users/ming/hellosleep/docs/migrated-remote-articles-improved.json"
OUTPUT_DIR = "/Users/ming/hellosleep/docs/articles"


def slugify_zh(text: str) -> str:
    """Slugify preserving Chinese characters."""
    text = re.sub(r"[^\w\u4e00-\u9fff\u3400-\u4dbf\s-]", "", text, flags=re.UNICODE)
    text = re.sub(r"[\s_]+", "-", text)
    return text.strip("-") or "article"


def lexical_node_to_md(node: dict, depth: int = 0) -> str:
    """Recursively convert a Lexical JSON node to Markdown."""
    node_type = node.get("type", "")
    children = node.get("children", [])

    if node_type == "root":
        parts = [lexical_node_to_md(c, depth) for c in children]
        return "\n\n".join(p for p in parts if p.strip())

    if node_type == "paragraph":
        return "".join(lexical_node_to_md(c, depth) for c in children)

    if node_type == "text":
        text = node.get("text", "")
        fmt = node.get("format", 0)
        if not text:
            return ""
        if fmt & 16:
            text = f"`{text}`"
        if fmt & 1:
            text = f"**{text}**"
        if fmt & 2:
            text = f"*{text}*"
        if fmt & 4:
            text = f"~~{text}~~"
        return text

    if node_type == "linebreak":
        return "\n"

    if node_type == "link":
        url = node.get("url", "")
        link_text = "".join(lexical_node_to_md(c, depth) for c in children)
        return f"[{link_text}]({url})"

    if node_type == "image":
        img = node.get("image", {})
        url = img.get("url", "")
        alt = img.get("alternativeText", "") or img.get("name", "image")
        caption = img.get("caption", "")
        result = f"![{alt}]({url})"
        if caption:
            result += f"\n*{caption}*"
        return result

    if node_type == "heading":
        tag = node.get("tag", "h2")
        level = int(tag[1]) if tag and len(tag) == 2 and tag[1].isdigit() else 2
        content = "".join(lexical_node_to_md(c, depth) for c in children)
        return f"{'#' * level} {content}"

    if node_type == "quote":
        content = "".join(lexical_node_to_md(c, depth) for c in children)
        return "\n".join(f"> {line}" for line in content.split("\n"))

    if node_type in ("ul", "ol"):
        items = []
        for i, child in enumerate(children):
            marker = "-" if node_type == "ul" else f"{i + 1}."
            indent = "  " * depth
            items.append(f"{indent}{marker} {lexical_node_to_md(child, depth + 1)}")
        return "\n".join(items)

    if node_type == "listitem":
        text_parts = []
        nested = []
        for child in children:
            if child.get("type") in ("ul", "ol"):
                nested.append("\n" + lexical_node_to_md(child, depth + 1))
            else:
                text_parts.append(lexical_node_to_md(child, depth))
        return "".join(text_parts) + "".join(nested)

    if node_type == "horizontalrule":
        return "---"

    if node_type == "code":
        lang = node.get("language", "")
        lines = []
        for child in children:
            if child.get("type") == "linebreak":
                lines.append("\n")
            else:
                lines.append(lexical_node_to_md(child, depth))
        return f"```{lang}\n{''.join(lines)}\n```"

    # Fallback
    return "".join(lexical_node_to_md(c, depth) for c in children)


def body_to_markdown(body) -> str:
    if isinstance(body, str):
        return body
    if isinstance(body, list):
        parts = [lexical_node_to_md(node) for node in body]
        return "\n\n".join(p for p in parts if p.strip())
    if isinstance(body, dict):
        return lexical_node_to_md(body)
    return str(body)


def article_to_markdown(article: dict) -> tuple:
    data = article.get("data", article)
    title = data.get("title", "Untitled")
    category = data.get("category", "")
    date = data.get("date", "")
    excerpt = data.get("excerpt", "")
    body = data.get("body", [])

    slug = slugify_zh(title)
    filename = f"{slug}.md"

    lines = [
        f"# {title}",
        "",
        f"**分类**: {category}",
        f"**发布时间**: {date}",
        "",
    ]
    if excerpt:
        lines += [f"> {excerpt}", ""]

    lines.append(body_to_markdown(body))
    return filename, "\n".join(lines)


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    with open(INPUT_FILE, encoding="utf-8") as f:
        articles = json.load(f)

    print(f"Total articles: {len(articles)}")

    slug_counts = {}
    written = 0
    skipped = 0

    for article in articles:
        try:
            filename, content = article_to_markdown(article)
            base = filename[:-3]
            if base in slug_counts:
                slug_counts[base] += 1
                filename = f"{base}-{slug_counts[base]}.md"
            else:
                slug_counts[base] = 0

            path = os.path.join(OUTPUT_DIR, filename)
            with open(path, "w", encoding="utf-8") as f:
                f.write(content)
            written += 1
        except Exception as e:
            title = article.get("data", article).get("title", "?")
            print(f"  ERROR [{title}]: {e}")
            skipped += 1

    print(f"\nDone! Written: {written}, Skipped: {skipped}")
    files = sorted(os.listdir(OUTPUT_DIR))
    print(f"\nFirst 10 of {len(files)} files:")
    for name in files[:10]:
        size = os.path.getsize(os.path.join(OUTPUT_DIR, name))
        print(f"  {name}  ({size} bytes)")


if __name__ == "__main__":
    main()
