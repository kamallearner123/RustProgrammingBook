import os
import re
import glob

# HTML files to update
html_files = glob.glob("/home/kamal/Documents/1.Github/BookToStartRust/*.html")

def format_terminal(match):
    output_text = match.group(1)
    
    # Don't format the cargo check explanation as a terminal
    if "cargo check" in output_text and "quickly analyzes" in output_text:
        return match.group(0)
        
    return f"""<div class="terminal-window">
    <div class="terminal-header">
        <span class="terminal-btn red"></span>
        <span class="terminal-btn yellow"></span>
        <span class="terminal-btn green"></span>
        <span class="terminal-title">Local Terminal</span>
    </div>
    <div class="terminal-body">
        <span class="terminal-prompt">$</span> rustc main.rs
        <br>
        <span class="terminal-prompt">$</span> ./main
        <br>
        {output_text}
    </div>
</div>"""

keywords_to_highlight = [
    r'\bOwnership\b',
    r'\bBorrowing\b',
    r'\bStack\b',
    r'\bHeap\b'
]

code_keywords = [
    r'rustc',
    r'cargo run',
    r'cargo check',
    r'cargo build',
    r'mut',
    r'Option',
    r'Result'
]

for file in html_files:
    with open(file, 'r') as f:
        content = f.read()

    # 1. Replace Outputs with Terminal blocks
    # Using regex to find <p><strong>Output:</strong> <code>...</code></p>
    content = re.sub(r'<p><strong>Output:</strong>\s*<code>(.*?)</code></p>', format_terminal, content, flags=re.DOTALL)

    # 2. Highlight Keywords in plain text (case-sensitive)
    for kw in keywords_to_highlight:
        # Avoid replacing if it's already inside a tag or something. This is a simple replace on text nodes.
        # But doing this safely with regex in HTML is tricky. 
        # Better just rely on the <strong> tags we already have, or inject spans safely.
        # Let's skip plain text highlighting to avoid corrupting HTML and focus on <code> keywords which is safer.
        pass

    # Safely highlight specific keywords inside <code> tags that aren't already highlighted
    for kw in code_keywords:
        # e.g., replace <code>mut</code> with <code class="keyword-hl">mut</code>
        content = re.sub(f'<code>{kw}</code>', f'<code class="keyword-hl">{kw}</code>', content)
        
    # Highlight specific concept words that we know are safe
    safe_concepts = ['Ownership', 'Borrowing', 'Stack', 'Heap', 'Data Race', 'Memory Leak', 'Buffer Overflow']
    for concept in safe_concepts:
        # Replace ONLY if it's not inside a tag (very basic heuristic: not preceded by < or =, not followed by >)
        # Better: just wrap <strong>Concept</strong> with keyword-hl if it matches
        content = re.sub(rf'<strong>({concept})</strong>', rf'<strong class="keyword-hl">\1</strong>', content)

    with open(file, 'w') as f:
        f.write(content)

print("Applied terminal windows and keyword highlights!")
