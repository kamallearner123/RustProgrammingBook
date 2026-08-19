import glob
import re

html_files = glob.glob('*.html')

toc_replacement = """                <ul class="toc">
                    <li><a href="index.html">Introduction</a></li>
                    <li><a href="pre_workshop.html">Pre-Workshop</a></li>
                    
                    <li class="toc-main"><a href="session_1_intro.html">Session 1: Core concepts and C/C++ limitations</a></li>
                    <li><a href="session_1_1.html">1.1 Memory structure</a></li>
                    <li><a href="session_1_2.html">1.2 Data sharing</a></li>
                    <li><a href="session_1_3.html">1.3 C/C++ in the wild</a></li>
                    <li><a href="session_1_4.html">1.4 Tools and practices</a></li>
                    
                    <li class="toc-main"><a href="session_2_intro.html">Session 2: Basics of Rust programming</a></li>
                    <li><a href="session_2_variables.html">2.1 Variables</a></li>
                    <li><a href="session_2_types.html">2.2 Data Types</a></li>
                    <li><a href="session_2_functions.html">2.3 Functions</a></li>
                    <li><a href="session_2_ownership.html">2.4 Ownership</a></li>
                    <li><a href="session_2_borrowing.html">2.5 Borrowing</a></li>
                    <li><a href="session_2_references.html">2.6 References</a></li>
                    <li><a href="session_2_mutability.html">2.7 Mutable vs Immutable</a></li>
                    <li><a href="session_2_error.html">2.8 Error Handling</a></li>
                    <li><a href="session_2_cargo.html">2.9 Cargo Basics</a></li>
                    
                    <li class="toc-main"><a href="session_3_intro.html">Session 3: Lab Exercises</a></li>
                    <li><a href="session_3_1.html">Exercise 1: Hello Rust</a></li>
                    <li><a href="session_3_2.html">Exercise 2: Ownership in Action</a></li>
                    <li><a href="session_3_3.html">Exercise 3: Prevent Buffer Overflow</a></li>
                    <li><a href="session_3_4.html">Exercise 4: Input Validation</a></li>
                    <li><a href="session_3_5.html">Exercise 5: Safe File Handling</a></li>
                    <li><a href="session_3_6.html">Exercise 6: Thread-safe Counter</a></li>
                    <li><a href="session_3_bonus.html">Bonus: Password Generator</a></li>
                </ul>"""

prism_css = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css">\n</head>'
prism_js = '<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>\n<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-rust.min.js"></script>\n<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-c.min.js"></script>\n</body>'

for file in html_files:
    with open(file, 'r') as f:
        content = f.read()
    
    # Remove old <h3 class="toc-title">Table of Contents</h3> if it exists
    content = re.sub(r'<h3 class="toc-title">Table of Contents</h3>\s*', '', content)
    
    full_sidebar = f"""        <nav class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <h2>Rust Security Course</h2>
            </div>
            <div class="sidebar-content">
{toc_replacement}
            </div>
        </nav>"""
        
    if '<nav class="sidebar"' not in content:
        # Inject the full sidebar structure
        new_content = re.sub(r'<!--\s*Sidebar will be injected.*?-->', full_sidebar, content)
    else:
        # Update TOC normally
        new_content = re.sub(r'<ul class="toc"( id="toc-list")?>.*?</ul>', toc_replacement, content, flags=re.DOTALL)
    
    # Inject Prism CSS if not present
    if 'prism-tomorrow' not in new_content:
        new_content = new_content.replace('</head>', prism_css)
        
    # Force update Prism JS
    new_content = re.sub(r'<script src="[^"]*prism[^"]*"></script>\s*', '', new_content)
    new_content = new_content.replace('</body>', '\n' + prism_js)
    
    # Update Google Fonts
    old_fonts = r'<link href="https://fonts\.googleapis\.com/css2\?family=Inter.*?display=swap" rel="stylesheet">'
    new_fonts = '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&family=Fira+Code:wght@400;500&family=Outfit:wght@600;700;800&display=swap" rel="stylesheet">'
    new_content = re.sub(old_fonts, new_fonts, new_content)
    
    # Add language-rust class to pre code blocks (and ignore if already there)
    new_content = new_content.replace('<pre><code>', '<pre><code class="language-rust">')
    
    with open(file, 'w') as f:
        f.write(new_content)
    print(f"Updated {file}")
