const chapters = [
    {
        id: 'session-1-why-rust',
        title: 'Session 1: Why Rust for Cybersecurity?',
        content: `
            <span class="chapter-number">Session 1 (30 mins)</span>
            <h1>Why Rust for Cybersecurity?</h1>
            <p>Welcome to the first session. In the modern landscape of software development, security is no longer an afterthought—it's a foundational requirement. This session explores why traditional software often falls short in terms of security and why <strong>Rust</strong> has emerged as the premier choice for building secure, high-performance systems.</p>
            
            <h2>Why Traditional Software Becomes Vulnerable</h2>
            <p>For decades, systems programming has been dominated by languages like C and C++. While these languages offer unparalleled control and performance, they place the entire burden of memory management and safety on the developer. In complex, large-scale applications, human error is inevitable. When these errors involve memory management, they often translate directly into critical security vulnerabilities.</p>
            <p>Attackers actively look for these memory mismanagement bugs to hijack control flows, steal sensitive data, or crash systems (Denial of Service).</p>
            
            <h2>Common Memory Safety Vulnerabilities</h2>
            <p>To understand Rust's value, we must first understand the bugs it prevents. Here are the most prevalent memory safety vulnerabilities:</p>
            
            <h3>1. Buffer Overflow</h3>
            <p>A buffer overflow occurs when a program attempts to write more data into a fixed-length block of memory (a buffer) than it was allocated to hold. The excess data overflows into adjacent memory spaces, corrupting or overwriting whatever data was held there.</p>
            <div class="info-callout">
                <strong>Impact:</strong> Attackers can overwrite the instruction pointer or return address to execute arbitrary malicious code (Remote Code Execution).
            </div>

            <h3>2. Use-after-Free (UAF)</h3>
            <p>A Use-after-Free vulnerability happens when a program continues to use a pointer to a memory allocation after that memory has been freed. If an attacker can control what is subsequently placed into that freed memory location, they can control the program's behavior when the dangling pointer is reused.</p>
            <div class="info-callout">
                <strong>Impact:</strong> Often leads to arbitrary code execution, data corruption, or system crashes.
            </div>

            <h3>3. Race Conditions (Data Races)</h3>
            <p>In multi-threaded applications, a data race occurs when two or more threads concurrently access the same memory location, at least one thread is writing, and there is no explicit synchronization mechanism in place. The result depends on the unpredictable timing of thread execution.</p>
            <div class="info-callout">
                <strong>Impact:</strong> Unpredictable system behavior, logic bypasses (e.g., bypassing authentication checks), and potential memory corruption.
            </div>

            <h2>Why C/C++ Struggle</h2>
            <p>C and C++ were designed in an era before the internet and modern threat modeling. They prioritize flexibility and performance over safety by default.</p>
            <ul>
                <li><strong>Manual Memory Management:</strong> Developers must explicitly call <code>malloc()</code>/<code>free()</code> or <code>new</code>/<code>delete</code>. Forgetting to free causes leaks; freeing twice causes double-free bugs; using after free causes UAF.</li>
                <li><strong>Lack of Bounds Checking:</strong> By default, array accesses are not checked. Writing past the end of an array is silently allowed by the language.</li>
                <li><strong>Weak Typing around Pointers:</strong> Pointer arithmetic makes it very easy to accidentally point to the wrong memory location.</li>
            </ul>
            <p>Even the most rigorous code review processes and automated testing tools fail to catch all memory safety bugs in large C/C++ codebases.</p>

            <h2>Industry Adoption: Why the Giants are Moving to Rust</h2>
            <p>Because ~70% of all severe security vulnerabilities in large codebases (like Windows, Android, and iOS) are memory safety issues, the industry is aggressively pivoting to Rust. Rust guarantees memory safety and thread safety at compile-time without a garbage collector.</p>
            
            <ul>
                <li><strong>Microsoft:</strong> Actively rewriting core parts of the Windows operating system kernel in Rust to eliminate memory-based CVEs.</li>
                <li><strong>Google:</strong> Using Rust extensively in Android (which has seen a dramatic drop in memory safety vulnerabilities as a result) and Chromium.</li>
                <li><strong>AWS (Amazon Web Services):</strong> Building critical infrastructure like Firecracker (the microVM running AWS Lambda) and Bottlerocket OS in Rust for maximum security and efficiency.</li>
                <li><strong>Linux Kernel:</strong> Rust is now officially the second language supported for Linux kernel development, primarily to write safer device drivers.</li>
                <li><strong>Automotive Industry:</strong> As cars become "computers on wheels" (connected and autonomous), safety standards like ISO 26262 require extreme reliability. Rust's strict compiler prevents bugs that could literally cost lives in automotive systems.</li>
            </ul>
            <p>Rust fundamentally changes the economics of secure software development. By making memory safety vulnerabilities a compile-time error, it eliminates entire classes of security threats before the code ever runs.</p>
        `
    }
];
