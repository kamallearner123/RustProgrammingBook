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

        function initAceEditors() {
            const rustBlocks = document.querySelectorAll('pre code.language-rust');
            rustBlocks.forEach((codeBlock, index) => {
                const pre = codeBlock.parentElement;
                const codeText = codeBlock.textContent;
                
                const wrapper = document.createElement('div');
                wrapper.className = 'code-wrapper';
                pre.parentNode.insertBefore(wrapper, pre);
                
                const lines = codeText.split('\n').length;
                const editorHeight = Math.max(100, lines * 21 + 30);
                
                const editorDiv = document.createElement('div');
                editorDiv.style.width = '100%';
                editorDiv.style.height = editorHeight + 'px';
                editorDiv.textContent = codeText;
                
                wrapper.appendChild(editorDiv);
                pre.remove();
                
                const editor = ace.edit(editorDiv);
                editor.setTheme("ace/theme/tomorrow_night_eighties");
                editor.session.setMode("ace/mode/rust");
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
                    } catch (error) {
                        terminalBody.innerHTML = '<span style="color: #ff5f56;">Error connecting to compiler backend.</span>';
                    }
                });
                
                wrapper.appendChild(playBtn);
                wrapper.appendChild(outputDiv);
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
        scoreContainer.style.gap = '10px';
        scoreContainer.style.marginRight = '15px';
        scoreContainer.innerHTML = `
            <div style="font-size: 1rem; color: var(--text-color); font-weight: 600;">Score: <strong id="global-score-display" style="color: var(--accent);">0</strong></div>
            <button id="reset-score-btn" style="font-size: 0.75rem; padding: 4px 8px; border-radius: 4px; background: var(--sidebar-bg); color: var(--text-color); border: 1px solid var(--border-color); cursor: pointer;">Reset</button>
        `;
        topNavActions.insertBefore(scoreContainer, topNavActions.firstChild);
        
        updateScoreDisplay();

        document.getElementById('reset-score-btn').addEventListener('click', () => {
            if(confirm("Reset your global score?")) {
                localStorage.setItem('rust_global_score', '0');
                localStorage.removeItem('rust_answered_mcqs');
                updateScoreDisplay();
                location.reload(); // Reload to reset local MCQ states
            }
        });
    }

    // 3. Initialize Interactive MCQs
    initMCQs();
});

function updateScoreDisplay() {
    const score = localStorage.getItem('rust_global_score') || '0';
    const display = document.getElementById('global-score-display');
    if(display) display.textContent = score;
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
