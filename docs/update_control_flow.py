import glob
import os
import re

old_toc = """                    <li class="toc-main"><a href="session_2_intro.html">Session 2: Basics of Rust programming</a></li>
                    <li><a href="session_2_variables.html">2.1 Variables</a></li>
                    <li><a href="session_2_types.html">2.2 Data Types</a></li>
                    <li><a href="session_2_functions.html">2.3 Functions</a></li>
                    <li><a href="session_2_ownership.html">2.4 Ownership</a></li>
                    <li><a href="session_2_borrowing.html">2.5 Borrowing</a></li>
                    <li><a href="session_2_references.html">2.6 References</a></li>
                    <li><a href="session_2_mutability.html">2.7 Mutable vs Immutable</a></li>
                    <li><a href="session_2_error.html">2.8 Error Handling</a></li>
                    <li><a href="session_2_cargo.html">2.9 Cargo Basics</a></li>"""

new_toc = """                    <li class="toc-main"><a href="session_2_intro.html">Session 2: Basics of Rust programming</a></li>
                    <li><a href="session_2_variables.html">2.1 Variables</a></li>
                    <li><a href="session_2_types.html">2.2 Data Types</a></li>
                    <li><a href="session_2_control.html">2.3 Control Flow</a></li>
                    <li><a href="session_2_functions.html">2.4 Functions</a></li>
                    <li><a href="session_2_ownership.html">2.5 Ownership</a></li>
                    <li><a href="session_2_borrowing.html">2.6 Borrowing</a></li>
                    <li><a href="session_2_references.html">2.7 References</a></li>
                    <li><a href="session_2_mutability.html">2.8 Mutable vs Immutable</a></li>
                    <li><a href="session_2_error.html">2.9 Error Handling</a></li>
                    <li><a href="session_2_cargo.html">2.10 Cargo Basics</a></li>"""

# 1. Update TOC in all html files
for filepath in glob.glob('docs/*.html'):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We might have different indentation, so let's use a regex to replace the block
    # Actually, the indentation is quite standard in this project.
    if "session_2_types.html" in content and "session_2_cargo.html" in content:
        # try simple replace
        content = content.replace(old_toc, new_toc)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

# 2. Update Titles and Chapter Numbers
mapping = {
    "session_2_functions.html": ("2.4", "Functions"),
    "session_2_ownership.html": ("2.5", "Ownership"),
    "session_2_borrowing.html": ("2.6", "Borrowing"),
    "session_2_references.html": ("2.7", "References"),
    "session_2_mutability.html": ("2.8", "Mutable vs Immutable"),
    "session_2_error.html": ("2.9", "Error Handling"),
    "session_2_cargo.html": ("2.10", "Cargo Basics")
}

for filename, (new_num, name) in mapping.items():
    filepath = os.path.join("docs", filename)
    if not os.path.exists(filepath): continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix <title>
    content = re.sub(r'<title>2\.\d+\s+.*?</title>', f'<title>{new_num} {name} - Rust Security Course</title>', content)
    # Fix <span class="chapter-number">
    content = re.sub(r'<span class="chapter-number">Session 2\.\d+</span>', f'<span class="chapter-number">Session {new_num}</span>', content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# 3. Create the new file session_2_control.html
with open('docs/session_2_types.html', 'r', encoding='utf-8') as f:
    template = f.read()

article_start = template.find('<article class="book-page">')
article_end = template.find('</article>') + len('</article>')

new_article = """<article class="book-page">
    <span class="chapter-number">Session 2.3</span>
    <h1>Operations and Control Flow</h1>
    
    <h2>Basic Operations</h2>
    <p>Rust supports all standard mathematical and logical operations. However, unlike C/C++, Rust will panic on integer overflow in debug mode instead of silently wrapping around, which prevents many security bugs!</p>
    <pre><code class="language-rust">fn main() {
    let sum = 5 + 10;
    let difference = 95.5 - 4.3;
    let product = 4 * 30;
    let quotient = 56.7 / 32.2;
    let remainder = 43 % 5;
    
    let is_true = (sum == 15) && (remainder != 0);
}</code></pre>

    <h2>If Expressions</h2>
    <p>In Rust, <code>if</code> blocks are expressions, meaning they can return values! There are no parentheses required around the condition.</p>
    <pre><code class="language-rust">fn main() {
    let number = 6;

    if number % 4 == 0 {
        println!("divisible by 4");
    } else if number % 3 == 0 {
        println!("divisible by 3");
    } else {
        println!("not divisible by 4 or 3");
    }

    // Using if in a let statement (like a ternary operator in C)
    let condition = true;
    let number = if condition { 5 } else { 6 };
}</code></pre>

    <h2>Loops (loop, while, for)</h2>
    <p>Rust has three kinds of loops: <code>loop</code> (infinite), <code>while</code>, and <code>for</code>. The <code>for</code> loop is the most commonly used and safest, as it prevents out-of-bounds indexing bugs.</p>
    
    <h3>The Safe `for` Loop</h3>
    <pre><code class="language-rust">fn main() {
    let a = [10, 20, 30, 40, 50];

    // Safe iteration over a collection! No out-of-bounds possible.
    for element in a {
        println!("the value is: {element}");
    }

    // Iterating over a range
    for number in (1..4).rev() {
        println!("{number}!");
    }
    println!("LIFTOFF!!!");
}</code></pre>

    <h2>The Power of `match`</h2>
    <p>The <code>match</code> control flow construct allows you to compare a value against a series of patterns. It is like a <code>switch</code> statement in C/C++, but the compiler enforces <strong>exhaustiveness checking</strong>: you must cover every single possible case, or the code will not compile.</p>
    <pre><code class="language-rust">fn main() {
    let http_status = 404;

    match http_status {
        200 => println!("OK"),
        404 => println!("Not Found"),
        500 => println!("Internal Server Error"),
        _ => println!("Unknown Status"), // The '_' acts as a default/catch-all
    }
}</code></pre>
</article>

<div style="margin-top: 3rem; padding-top: 2rem; border-top: 2px solid var(--border-color);"><h2>Topic Quiz (5 Questions)</h2>
        <div class="mcq-container">
            <div class="mcq-question">1. What happens on integer overflow in Rust (in debug mode)?</div>
            <ul class="mcq-options">
                <li class="mcq-option" data-correct="false">It wraps around silently</li>
                <li class="mcq-option" data-correct="false">It returns null</li>
                <li class="mcq-option" data-correct="true">The program panics and crashes</li>
                <li class="mcq-option" data-correct="false">It corrupts neighboring memory</li>
            </ul>
            <button class="mcq-submit" disabled>Submit</button>
            <div class="mcq-feedback">Correct answer! Great job!</div>
        </div>
        
        <div class="mcq-container">
            <div class="mcq-question">2. Which statement about Rust's `if` is true?</div>
            <ul class="mcq-options">
                <li class="mcq-option" data-correct="true">It is an expression and can be assigned to a variable</li>
                <li class="mcq-option" data-correct="false">Parentheses are required around the condition</li>
                <li class="mcq-option" data-correct="false">It must always have an else block</li>
                <li class="mcq-option" data-correct="false">It evaluates 0 to false automatically</li>
            </ul>
            <button class="mcq-submit" disabled>Submit</button>
            <div class="mcq-feedback">Correct answer! Great job!</div>
        </div>
        
        <div class="mcq-container">
            <div class="mcq-question">3. What is the safest and most idiomatic loop to iterate over an array in Rust?</div>
            <ul class="mcq-options">
                <li class="mcq-option" data-correct="false">loop</li>
                <li class="mcq-option" data-correct="false">while</li>
                <li class="mcq-option" data-correct="false">goto</li>
                <li class="mcq-option" data-correct="true">for</li>
            </ul>
            <button class="mcq-submit" disabled>Submit</button>
            <div class="mcq-feedback">Correct answer! Great job!</div>
        </div>
        
        <div class="mcq-container">
            <div class="mcq-question">4. What does exhaustiveness checking in a `match` statement mean?</div>
            <ul class="mcq-options">
                <li class="mcq-option" data-correct="false">It checks memory exhaustion</li>
                <li class="mcq-option" data-correct="true">You must cover every possible value pattern</li>
                <li class="mcq-option" data-correct="false">It prevents infinite loops</li>
                <li class="mcq-option" data-correct="false">It forces the use of a default case</li>
            </ul>
            <button class="mcq-submit" disabled>Submit</button>
            <div class="mcq-feedback">Correct answer! Great job!</div>
        </div>
        
        <div class="mcq-container">
            <div class="mcq-question">5. What symbol is used as the default/catch-all arm in a match statement?</div>
            <ul class="mcq-options">
                <li class="mcq-option" data-correct="false">default</li>
                <li class="mcq-option" data-correct="false">*</li>
                <li class="mcq-option" data-correct="true">_ (underscore)</li>
                <li class="mcq-option" data-correct="false">else</li>
            </ul>
            <button class="mcq-submit" disabled>Submit</button>
            <div class="mcq-feedback">Correct answer! Great job!</div>
        </div>
        </div>"""

quiz_end = template.find('</div>\n<footer class="page-navigation">')

# Rebuild new file content
new_content = template[:article_start] + new_article + template[quiz_end:]

# Update title
new_content = re.sub(r'<title>.*?</title>', '<title>2.3 Control Flow - Rust Security Course</title>', new_content)

with open('docs/session_2_control.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

# 4. Fix Navigations manually for the 3 impacted files: types, control, functions
def update_nav(filepath, prev_href, prev_title, next_href, next_title):
    with open(filepath, 'r', encoding='utf-8') as f:
        c = f.read()
    
    nav_start = c.find('<footer class="page-navigation">')
    nav_end = c.find('</footer>') + len('</footer>')
    
    new_nav = f"""<footer class="page-navigation">
                <a href="{prev_href}" class="nav-button prev">
                    <span class="nav-label">Previous</span>
                    <span class="nav-title">{prev_title}</span>
                </a>
                
                <a href="{next_href}" class="nav-button next">
                    <span class="nav-label">Next</span>
                    <span class="nav-title">{next_title}</span>
                </a>
            </footer>"""
    
    c = c[:nav_start] + new_nav + c[nav_end:]
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(c)

# Fix types
update_nav('docs/session_2_types.html', 'session_2_variables.html', '2.1 Variables', 'session_2_control.html', '2.3 Control Flow')
# Fix control
update_nav('docs/session_2_control.html', 'session_2_types.html', '2.2 Data Types', 'session_2_functions.html', '2.4 Functions')
# Fix functions
update_nav('docs/session_2_functions.html', 'session_2_control.html', '2.3 Control Flow', 'session_2_ownership.html', '2.5 Ownership')

# Also fix the rest of the navs shifting by 1
update_nav('docs/session_2_ownership.html', 'session_2_functions.html', '2.4 Functions', 'session_2_borrowing.html', '2.6 Borrowing')
update_nav('docs/session_2_borrowing.html', 'session_2_ownership.html', '2.5 Ownership', 'session_2_references.html', '2.7 References')
update_nav('docs/session_2_references.html', 'session_2_borrowing.html', '2.6 Borrowing', 'session_2_mutability.html', '2.8 Mutable vs Immutable')
update_nav('docs/session_2_mutability.html', 'session_2_references.html', '2.7 References', 'session_2_error.html', '2.9 Error Handling')
update_nav('docs/session_2_error.html', 'session_2_mutability.html', '2.8 Mutable', 'session_2_cargo.html', '2.10 Cargo Basics')
update_nav('docs/session_2_cargo.html', 'session_2_error.html', '2.9 Error Handling', 'session_3_intro.html', 'Session 3: Lab Exercises')

