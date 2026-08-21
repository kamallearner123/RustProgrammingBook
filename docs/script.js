document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const themeToggleBtn = document.getElementById('theme-toggle');

    // Initialize Theme
    function initTheme() {
        const savedTheme = localStorage.getItem('rust-book-theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
        updateThemeIcon();
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('rust-book-theme', newTheme);
        updateThemeIcon();
    }

    function updateThemeIcon() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const iconSvg = document.getElementById('theme-icon');
        if (!iconSvg) return;
        
        if (isDark) {
            // Sun icon for dark mode (switch to light)
            iconSvg.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
        } else {
            // Moon icon for light mode (switch to dark)
            iconSvg.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
        }
    }

    // Highlight active link in sidebar and add hierarchy
    function setActiveLink() {
        const links = document.querySelectorAll('.toc a');
        let currentUrl = window.location.pathname.split('/').pop();
        
        if (!currentUrl || currentUrl === '') {
            currentUrl = 'index.html';
        }
        
        links.forEach(link => {
            const li = link.parentElement;
            
            // Add hierarchical sub-item class based on text content
            const text = link.textContent.trim();
            if (/^(\d+\.\d+|Exercise|Bonus)/.test(text) && !li.classList.contains('toc-main')) {
                li.classList.add('toc-sub');
            }
            
            const href = link.getAttribute('href');
            if (href && (href === currentUrl || window.location.href.includes(href))) {
                li.classList.add('active');
            } else {
                li.classList.remove('active');
            }
        });
    }

    // Top Nav Scroll Effect
    const mainContent = document.querySelector('.main-content');
    const topNav = document.getElementById('top-nav');
    if (mainContent && topNav) {
        mainContent.addEventListener('scroll', () => {
            if (mainContent.scrollTop > 10) {
                topNav.classList.add('scrolled');
            } else {
                topNav.classList.remove('scrolled');
            }
        });
    }

    // Event Listeners
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }

    // Setup Rust Playground Run Buttons
    // Setup Rust Playground Run Buttons
    function setupRustPlayground() {
        if (!document.getElementById('rust-playground-style')) {
            const style = document.createElement('style');
            style.id = 'rust-playground-style';
            style.textContent = `
                .code-wrapper { position: relative; margin: 2rem 0; border-radius: 0.5rem; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
                .ace_editor { font-family: 'Fira Code', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important; font-size: 0.95em !important; line-height: 1.5 !important; }
                .play-btn {
                    position: absolute; top: 0.5rem; right: 0.5rem; z-index: 10;
                    background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2);
                    color: #e83e8c; padding: 0.25rem 0.75rem; border-radius: 4px;
                    font-size: 0.8rem; font-weight: bold; cursor: pointer; transition: all 0.2s;
                }
                .play-btn:hover { background: rgba(255, 255, 255, 0.2); color: #fff; }
                .terminal-window { margin: 0; border: none; border-radius: 0; border-top: 1px solid #333; }
            `;
            document.head.appendChild(style);
        }

        function buildEditorWrapper(codeText, mode, isC, isCpp) {
            const wrapper = document.createElement('div');
            wrapper.className = 'code-wrapper';
            
            const lines = codeText.split('\n').length;
            const editorHeight = Math.max(100, lines * 21 + 30);
            
            const editorDiv = document.createElement('div');
            editorDiv.style.width = '100%';
            editorDiv.style.height = editorHeight + 'px';
            editorDiv.textContent = codeText;
            
            wrapper.appendChild(editorDiv);
            
            const editor = ace.edit(editorDiv);
            editor.setTheme("ace/theme/tomorrow_night_eighties");
            editor.session.setMode(mode);
            editor.setOptions({
                fontFamily: "'Fira Code', monospace",
                fontSize: "14px",
                showPrintMargin: false,
                displayIndentGuides: true,
                highlightActiveLine: true,
                tabSize: 4,
                useSoftTabs: true
            });
            
            const playBtn = document.createElement('button');
            playBtn.className = 'play-btn';
            playBtn.innerHTML = 'Run ▶';
            playBtn.title = 'Run locally';
            
            const outputDiv = document.createElement('div');
            outputDiv.className = 'terminal-window';
            outputDiv.style.display = 'none';
            outputDiv.innerHTML = `
                <div class="terminal-header">
                    <span class="terminal-btn red"></span>
                    <span class="terminal-btn yellow"></span>
                    <span class="terminal-btn green"></span>
                    <span class="terminal-title">Execution Output</span>
                </div>
                <div class="terminal-body" style="font-family: monospace; white-space: pre-wrap;"></div>
            `;
            
            playBtn.addEventListener('click', async () => {
                const code = editor.getValue();
                outputDiv.style.display = 'block';
                const terminalBody = outputDiv.querySelector('.terminal-body');
                terminalBody.innerHTML = '<span style="color: #ffbd2e;">Compiling and running...</span>';
                
                try {
                    if (mode === "ace/mode/rust") {
                        const response = await fetch('https://play.rust-lang.org/execute', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                channel: "stable", mode: "debug", edition: "2021",
                                crateType: "bin", tests: false, code: code, backtrace: false
                            })
                        });
                        
                        const data = await response.json();
                        let output = '';
                        if (data.success) {
                            output = data.stdout ? data.stdout.replace(/</g, '&lt;').replace(/>/g, '&gt;') : "<em>Program ran successfully with no output.</em>";
                            if (data.stderr) output += '\n<span style="color: #8b949e;">' + data.stderr.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</span>';
                        } else {
                            output = '<span style="color: #ff5f56;">' + (data.stderr || data.stdout).replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</span>';
                        }
                        terminalBody.innerHTML = output;
                    } else {
                        const languageId = isC ? 50 : 54;
                        const response = await fetch('https://ce.judge0.com/submissions?base64_encoded=false&wait=true', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                source_code: code,
                                language_id: languageId
                            })
                        });
                        
                        const data = await response.json();
                        let output = '';
                        
                        if (data.compile_output) {
                            output += '<span style="color: #ff5f56;">Compilation Error:</span>\n<span style="color: #ff5f56;">' + data.compile_output.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</span>';
                        } else if (data.stderr) {
                            output += '<span style="color: #ff5f56;">' + data.stderr.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</span>';
                        }
                        
                        if (data.stdout) {
                            output += (output ? '\n' : '') + data.stdout.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                        }
                        
                        if (!data.compile_output && !data.stderr && !data.stdout) {
                            output = "<em>Program ran successfully with no output.</em>";
                        }
                        
                        terminalBody.innerHTML = output;
                    }
                } catch (error) {
                    terminalBody.innerHTML = '<span style="color: #ff5f56;">Error connecting to compiler backend.</span>';
                }
            });
            
            wrapper.appendChild(playBtn);
            wrapper.appendChild(outputDiv);
            return wrapper;
        }

        function initAceEditors() {
            const codeBlocks = document.querySelectorAll('pre code.language-rust, pre code.language-c, pre code.language-cpp');
            codeBlocks.forEach((codeBlock, index) => {
                const pre = codeBlock.parentElement;
                const codeText = codeBlock.textContent;
                const isRust = codeBlock.classList.contains('language-rust');
                const isC = codeBlock.classList.contains('language-c');
                const isCpp = codeBlock.classList.contains('language-cpp');
                const mode = isRust ? "ace/mode/rust" : "ace/mode/c_cpp";
                
                const wrapper = buildEditorWrapper(codeText, mode, isC, isCpp);
                pre.parentNode.insertBefore(wrapper, pre);
                pre.remove();
                
                const addCodeBtn = document.createElement('button');
                addCodeBtn.innerHTML = '+ Add code';
                addCodeBtn.style.cssText = 'display: block; margin: 0.5rem 0 2rem 0; background: transparent; border: 1px dashed var(--accent); color: var(--accent); padding: 0.4rem 0.8rem; border-radius: 4px; cursor: pointer; font-family: inherit; font-size: 0.85rem; font-weight: bold; transition: all 0.2s;';
                
                addCodeBtn.addEventListener('mouseenter', () => {
                    addCodeBtn.style.background = 'rgba(232, 62, 140, 0.1)';
                });
                addCodeBtn.addEventListener('mouseleave', () => {
                    addCodeBtn.style.background = 'transparent';
                });
                
                addCodeBtn.addEventListener('click', () => {
                    const defaultCode = isRust ? "fn main() {\n    \n}" : "#include <stdio.h>\n\nint main() {\n    \n    return 0;\n}";
                    const newWrapper = buildEditorWrapper(defaultCode, mode, isC, isCpp);
                    addCodeBtn.parentNode.insertBefore(newWrapper, addCodeBtn);
                });
                
                wrapper.parentNode.insertBefore(addCodeBtn, wrapper.nextSibling);
            });
        }

        if (window.ace) {
            initAceEditors();
        } else if (!document.getElementById('ace-script')) {
            const script = document.createElement('script');
            script.id = 'ace-script';
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.32.3/ace.js';
            script.onload = initAceEditors;
            document.head.appendChild(script);
        }
    }

    // Maintain sidebar scroll position between page loads
    function setupSidebarScroll() {
        const sidebar = document.querySelector('.sidebar-content');
        if (!sidebar) return;

        // Restore scroll position if it exists
        const savedScroll = sessionStorage.getItem('sidebarScroll');
        if (savedScroll) {
            sidebar.scrollTop = parseInt(savedScroll, 10);
        } else {
            // Fallback: If no saved scroll, scroll the active item into view
            const activeLink = document.querySelector('.toc li.active');
            if (activeLink) {
                activeLink.scrollIntoView({ block: 'center' });
            }
        }

        // Save scroll position just before leaving the page
        window.addEventListener('beforeunload', () => {
            sessionStorage.setItem('sidebarScroll', sidebar.scrollTop);
        });
    }

    // Initialize
    initTheme();
    setActiveLink();
    setupSidebarScroll();
    setupRustPlayground();
});


document.addEventListener("DOMContentLoaded", () => {
    // 1. Page Transition
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.classList.add('page-enter');
    }

    // 2. Global Score UI (Top Right Corner)
    const topNavActions = document.querySelector('.nav-actions');
    if (topNavActions && !document.getElementById('global-score-container')) {
        const scoreContainer = document.createElement('div');
        scoreContainer.id = 'global-score-container';
        scoreContainer.style.display = 'flex';
        scoreContainer.style.alignItems = 'center';
        scoreContainer.style.marginRight = '10px';
        scoreContainer.style.position = 'relative';
        scoreContainer.style.cursor = 'pointer';
        scoreContainer.innerHTML = `
            <div id="score-toggle" style="font-size: 0.95rem; color: var(--text-color); font-weight: 600; padding: 6px 12px; border-radius: 6px; background: var(--sidebar-bg); border: 1px solid var(--border-color); transition: all 0.2s;">
                Completeness: <strong id="global-score-display" style="color: var(--accent);">0%</strong>
            </div>
            <div id="score-dropdown" style="display: none; position: absolute; top: 120%; right: 0; width: 260px; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; box-shadow: var(--shadow-md); padding: 1.25rem; z-index: 1000; cursor: default;">
                <h4 style="margin-top: 0; margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; font-size: 1rem;">Course Progress</h4>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;"><span style="color: var(--text-muted);">Session 1:</span> <strong id="s1-score" style="color: var(--text-main);">0 / 20</strong></div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;"><span style="color: var(--text-muted);">Session 2:</span> <strong id="s2-score" style="color: var(--text-main);">0 / 45</strong></div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;"><span style="color: var(--text-muted);">Session 4:</span> <strong id="s4-score" style="color: var(--text-main);">0 / 5</strong></div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 1.5rem;"><span style="color: var(--text-muted);">Final Test:</span> <strong id="s5-score" style="color: var(--text-main);">0 / 50</strong></div>
                <button id="reset-score-btn" style="width: 100%; font-size: 0.85rem; padding: 8px; border-radius: 4px; background: rgba(255, 95, 86, 0.1); color: #ff5f56; border: 1px solid rgba(255, 95, 86, 0.2); cursor: pointer; font-weight: bold; transition: background 0.2s;">Reset All Progress</button>
            </div>
        `;
        topNavActions.insertBefore(scoreContainer, topNavActions.firstChild);
        
        const scoreToggle = document.getElementById('score-toggle');
        const scoreDropdown = document.getElementById('score-dropdown');
        
        // Hover effects for the toggle button
        scoreToggle.addEventListener('mouseenter', () => scoreToggle.style.borderColor = 'var(--accent)');
        scoreToggle.addEventListener('mouseleave', () => scoreToggle.style.borderColor = 'var(--border-color)');

        scoreToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            scoreDropdown.style.display = scoreDropdown.style.display === 'none' ? 'block' : 'none';
        });

        document.addEventListener('click', (e) => {
            if (!scoreContainer.contains(e.target)) {
                scoreDropdown.style.display = 'none';
            }
        });
        
        updateScoreDisplay();

        const resetBtn = document.getElementById('reset-score-btn');
        resetBtn.addEventListener('mouseenter', () => resetBtn.style.background = 'rgba(255, 95, 86, 0.2)');
        resetBtn.addEventListener('mouseleave', () => resetBtn.style.background = 'rgba(255, 95, 86, 0.1)');
        
        resetBtn.addEventListener('click', () => {
            if(confirm("Are you sure you want to completely reset all your progress, scores, and test results?")) {
                localStorage.setItem('rust_global_score', '0');
                localStorage.removeItem('rust_answered_mcqs');
                localStorage.removeItem('rust_test_score');
                localStorage.removeItem('rust_test_mcqs');
                updateScoreDisplay();
                location.reload();
            }
        });
    }

    // 3. Initialize Interactive MCQs
    initMCQs();
});

function updateScoreDisplay() {
    let answeredQuestions = JSON.parse(localStorage.getItem('rust_answered_mcqs') || '{}');
    
    let s1 = 0, s2 = 0, s4 = 0;
    for (const [key, value] of Object.entries(answeredQuestions)) {
        if (value.chosen === value.correct) {
            if (key.includes('session_1_')) s1++;
            if (key.includes('session_2_')) s2++;
            if (key.includes('session_4_')) s4++;
        }
    }
    
    let s5 = parseInt(localStorage.getItem('rust_test_score') || '0', 10);
    
    let totalCorrect = s1 + s2 + s4 + s5;
    let maxPossible = 120; // 20 + 45 + 5 + 50
    let percentage = Math.round((totalCorrect / maxPossible) * 100);

    const display = document.getElementById('global-score-display');
    if (display) display.textContent = percentage + '%';
    
    const s1Display = document.getElementById('s1-score');
    if (s1Display) s1Display.textContent = s1 + ' / 20';
    
    const s2Display = document.getElementById('s2-score');
    if (s2Display) s2Display.textContent = s2 + ' / 45';
    
    const s4Display = document.getElementById('s4-score');
    if (s4Display) s4Display.textContent = s4 + ' / 5';
    
    const s5Display = document.getElementById('s5-score');
    if (s5Display) s5Display.textContent = s5 + ' / 50';
}

function initMCQs() {
    const mcqContainers = document.querySelectorAll('.mcq-container');
    let answeredQuestions = JSON.parse(localStorage.getItem('rust_answered_mcqs') || '{}');

    mcqContainers.forEach((container, index) => {
        // Unique ID based on page path and index
        const qId = window.location.pathname + "_q" + index;
        const options = container.querySelectorAll('.mcq-option');
        const submitBtn = container.querySelector('.mcq-submit');
        const feedback = container.querySelector('.mcq-feedback');
        
        // Check if already answered correctly
        if (answeredQuestions[qId]) {
            const correctIdx = answeredQuestions[qId].correct;
            const chosenIdx = answeredQuestions[qId].chosen;
            
            options[chosenIdx].classList.add(chosenIdx === correctIdx ? 'correct' : 'incorrect');
            if(chosenIdx !== correctIdx) options[correctIdx].classList.add('correct');
            
            feedback.style.display = 'block';
            submitBtn.style.display = 'none';
            options.forEach(opt => opt.style.pointerEvents = 'none');
            return;
        }

        let selectedOption = null;

        options.forEach((opt, optIndex) => {
            opt.addEventListener('click', () => {
                options.forEach(o => o.classList.remove('selected'));
                opt.classList.add('selected');
                selectedOption = { element: opt, index: optIndex };
                submitBtn.disabled = false;
            });
        });

        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                if (!selectedOption) return;
                
                const isCorrect = selectedOption.element.dataset.correct === "true";
                
                // Show feedback
                options.forEach(opt => opt.style.pointerEvents = 'none'); // disable clicks
                submitBtn.style.display = 'none';
                feedback.style.display = 'block';
                
                // Find correct option index
                let correctIdx = 0;
                options.forEach((opt, idx) => {
                    if(opt.dataset.correct === "true") {
                        opt.classList.add('correct');
                        correctIdx = idx;
                    }
                });

                if (isCorrect) {
                    let score = parseInt(localStorage.getItem('rust_global_score') || '0');
                    localStorage.setItem('rust_global_score', score + 1);
                    updateScoreDisplay();
                } else {
                    selectedOption.element.classList.add('incorrect');
                }
                
                // Save state
                answeredQuestions[qId] = { chosen: selectedOption.index, correct: correctIdx };
                localStorage.setItem('rust_answered_mcqs', JSON.stringify(answeredQuestions));
            });
        }
    });
}

// UI Enhancements (Resizer, Nav Icons, Collapsible TOC)
document.addEventListener('DOMContentLoaded', () => {
    // 1. Sidebar Resizer
    const sidebar = document.getElementById('sidebar');
    if (sidebar && !document.querySelector('.sidebar-resizer')) {
        const savedWidth = localStorage.getItem('rust-sidebar-width');
        if (savedWidth) {
            sidebar.style.setProperty('--sidebar-width', savedWidth);
        }

        const resizer = document.createElement('div');
        resizer.className = 'sidebar-resizer';
        sidebar.appendChild(resizer);

        let isDragging = false;
        let startX, startWidth;

        resizer.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startWidth = parseInt(getComputedStyle(sidebar).getPropertyValue('--sidebar-width') || 300, 10);
            resizer.classList.add('is-dragging');
            document.body.style.cursor = 'col-resize';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const newWidth = startWidth + (e.clientX - startX);
            if (newWidth > 200 && newWidth < 500) {
                sidebar.style.setProperty('--sidebar-width', newWidth + 'px');
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                resizer.classList.remove('is-dragging');
                document.body.style.cursor = '';
                localStorage.setItem('rust-sidebar-width', sidebar.style.getPropertyValue('--sidebar-width'));
            }
        });
    }

    // 2. Top Nav Icons (Hamburger, Print, GitHub)
    const topNav = document.getElementById('top-nav');
    if (topNav) {
        // Hamburger (Left)
        if (!document.getElementById('sidebar-toggle')) {
            const hamburgerBtn = document.createElement('button');
            hamburgerBtn.id = 'sidebar-toggle';
            hamburgerBtn.className = 'nav-icon';
            hamburgerBtn.style.marginRight = '10px';
            hamburgerBtn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
            topNav.insertBefore(hamburgerBtn, topNav.firstChild);
            
            // Initial hide check
            if (localStorage.getItem('rust-sidebar-hidden') === 'true') {
                sidebar.classList.add('hidden');
            }

            hamburgerBtn.addEventListener('click', () => {
                sidebar.classList.toggle('hidden');
                localStorage.setItem('rust-sidebar-hidden', sidebar.classList.contains('hidden'));
            });
        }

        // Print & GitHub (Right)
        const navActions = document.querySelector('.nav-actions');
        if (navActions && !document.getElementById('github-link')) {
            const printBtn = document.createElement('button');
            printBtn.id = 'print-btn';
            printBtn.className = 'nav-icon';
            printBtn.title = "Print Page";
            printBtn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>`;
            printBtn.addEventListener('click', () => window.print());
            
            const githubLink = document.createElement('a');
            githubLink.id = 'github-link';
            githubLink.className = 'nav-icon';
            githubLink.href = 'https://github.com/kamallearner123/RustProgrammingBook';
            githubLink.target = '_blank';
            githubLink.title = "View on GitHub";
            githubLink.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>`;

            navActions.appendChild(printBtn);
            navActions.appendChild(githubLink);
        }
    }
});

// Convert flat TOC into collapsible sections dynamically
document.addEventListener('DOMContentLoaded', () => {
    const tocList = document.querySelector('.toc');
    if (!tocList || tocList.dataset.collapsibleInit) return;
    tocList.dataset.collapsibleInit = 'true';

    const items = Array.from(tocList.children);
    let currentMain = null;
    let currentSubList = null;

    items.forEach(li => {
        if (li.classList.contains('toc-main')) {
            // Setup new collapsible group
            const link = li.querySelector('a');
            
            // Exclude single pages like Test Your Skills from acting as a collapsible parent
            if (link.textContent.toUpperCase().includes('SESSION 5')) return;

            const headerDiv = document.createElement('div');
            headerDiv.className = 'toc-main-header';
            
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'toc-toggle';
            toggleBtn.innerHTML = '▼';
            
            // Move link into header
            li.insertBefore(headerDiv, link);
            headerDiv.appendChild(link);
            headerDiv.appendChild(toggleBtn);
            
            currentSubList = document.createElement('ul');
            currentSubList.className = 'toc-sub-list';
            li.appendChild(currentSubList);
            
            currentMain = li;
            
            // Toggle Logic
            toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                li.classList.toggle('collapsed');
            });
            
        } else if (currentMain && !li.classList.contains('toc-main')) {
            // Is it a normal sub-item? Move into currentSubList
            // Ignore top level links like Intro, Pre-workshop
            if (li.textContent.trim().match(/^\d+\.\d+|Exercise|Bonus/)) {
                currentSubList.appendChild(li);
                // If this item is active, make sure parent is NOT collapsed
                if (li.classList.contains('active')) {
                    currentMain.classList.remove('collapsed');
                }
            }
        }
    });

    // Auto collapse sections that don't contain the active link
    document.querySelectorAll('.toc-main').forEach(mainLi => {
        if (mainLi.querySelector('.toc-sub-list') && !mainLi.querySelector('.active')) {
            mainLi.classList.add('collapsed');
        }
    });
});
