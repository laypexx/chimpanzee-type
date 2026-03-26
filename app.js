/* ============================================
   codetype — typing test engine
   ============================================ */

(function () {
  "use strict";

  // ---- GitHub repos for each language ----
  const REPOS = {
    javascript: [
      { owner: "lodash", repo: "lodash", path: "lodash.js", ext: "js" },
      {
        owner: "expressjs",
        repo: "express",
        path: "lib/router/index.js",
        ext: "js",
      },
      {
        owner: "mrdoob",
        repo: "three.js",
        path: "src/math/Vector3.js",
        ext: "js",
      },
      {
        owner: "facebook",
        repo: "react",
        path: "packages/react/src/ReactHooks.js",
        ext: "js",
      },
      { owner: "axios", repo: "axios", path: "lib/core/Axios.js", ext: "js" },
      { owner: "d3", repo: "d3-scale", path: "src/linear.js", ext: "js" },
      {
        owner: "vuejs",
        repo: "vue",
        path: "src/core/observer/index.ts",
        ext: "js",
      },
    ],
    python: [
      { owner: "pallets", repo: "flask", path: "src/flask/app.py", ext: "py" },
      {
        owner: "django",
        repo: "django",
        path: "django/core/validators.py",
        ext: "py",
      },
      {
        owner: "psf",
        repo: "requests",
        path: "src/requests/api.py",
        ext: "py",
      },
      {
        owner: "fastapi",
        repo: "fastapi",
        path: "fastapi/routing.py",
        ext: "py",
      },
      {
        owner: "python",
        repo: "cpython",
        path: "Lib/json/encoder.py",
        ext: "py",
      },
      {
        owner: "numpy",
        repo: "numpy",
        path: "numpy/core/numeric.py",
        ext: "py",
      },
    ],
    java: [
      {
        owner: "spring-projects",
        repo: "spring-boot",
        path: "spring-boot-project/spring-boot/src/main/java/org/springframework/boot/SpringApplication.java",
        ext: "java",
      },
      {
        owner: "google",
        repo: "guava",
        path: "guava/src/com/google/common/collect/ImmutableList.java",
        ext: "java",
      },
      {
        owner: "apache",
        repo: "commons-lang",
        path: "src/main/java/org/apache/commons/lang3/StringUtils.java",
        ext: "java",
      },
      {
        owner: "elastic",
        repo: "elasticsearch",
        path: "server/src/main/java/org/elasticsearch/common/Strings.java",
        ext: "java",
      },
    ],
    typescript: [
      {
        owner: "microsoft",
        repo: "TypeScript",
        path: "src/compiler/scanner.ts",
        ext: "ts",
      },
      {
        owner: "vercel",
        repo: "next.js",
        path: "packages/next/src/server/base-server.ts",
        ext: "ts",
      },
      {
        owner: "prisma",
        repo: "prisma",
        path: "packages/client/src/runtime/core/model/applyModel.ts",
        ext: "ts",
      },
      {
        owner: "angular",
        repo: "angular",
        path: "packages/core/src/di/injector.ts",
        ext: "ts",
      },
      { owner: "denoland", repo: "deno", path: "cli/args/flags.rs", ext: "ts" },
    ],
    go: [
      { owner: "gin-gonic", repo: "gin", path: "gin.go", ext: "go" },
      { owner: "gofiber", repo: "fiber", path: "router.go", ext: "go" },
      { owner: "golang", repo: "go", path: "src/fmt/print.go", ext: "go" },
      {
        owner: "docker",
        repo: "cli",
        path: "cli/command/container/run.go",
        ext: "go",
      },
    ],
    rust: [
      {
        owner: "rust-lang",
        repo: "rust",
        path: "compiler/rustc_ast/src/token.rs",
        ext: "rs",
      },
      {
        owner: "tokio-rs",
        repo: "tokio",
        path: "tokio/src/runtime/scheduler/mod.rs",
        ext: "rs",
      },
      {
        owner: "serde-rs",
        repo: "serde",
        path: "serde/src/ser/mod.rs",
        ext: "rs",
      },
      {
        owner: "actix",
        repo: "actix-web",
        path: "actix-web/src/app.rs",
        ext: "rs",
      },
    ],
    cpp: [
      {
        owner: "nlohmann",
        repo: "json",
        path: "include/nlohmann/json.hpp",
        ext: "cpp",
      },
      {
        owner: "grpc",
        repo: "grpc",
        path: "src/core/lib/channel/channel_args.cc",
        ext: "cpp",
      },
      { owner: "google", repo: "leveldb", path: "db/db_impl.cc", ext: "cpp" },
      {
        owner: "facebook",
        repo: "folly",
        path: "folly/String.cpp",
        ext: "cpp",
      },
    ],
  };

  // ---- Fallback code snippets (if GitHub fails) ----
  const FALLBACKS = {
    javascript: [
      `function debounce(func, wait, immediate) {\n  let timeout;\n  return function executedFunction() {\n    const context = this;\n    const args = arguments;\n    const later = function() {\n      timeout = null;\n      if (!immediate) func.apply(context, args);\n    };\n    const callNow = immediate && !timeout;\n    clearTimeout(timeout);\n    timeout = setTimeout(later, wait);\n    if (callNow) func.apply(context, args);\n  };\n}`,
      `class EventEmitter {\n  constructor() {\n    this.events = {};\n  }\n  on(event, listener) {\n    if (!this.events[event]) {\n      this.events[event] = [];\n    }\n    this.events[event].push(listener);\n    return this;\n  }\n  emit(event, ...args) {\n    if (this.events[event]) {\n      this.events[event].forEach(listener => {\n        listener.apply(this, args);\n      });\n    }\n    return this;\n  }\n}`,
      `async function fetchWithRetry(url, options = {}, retries = 3) {\n  for (let i = 0; i < retries; i++) {\n    try {\n      const response = await fetch(url, options);\n      if (!response.ok) {\n        throw new Error(response.statusText);\n      }\n      return await response.json();\n    } catch (error) {\n      if (i === retries - 1) throw error;\n      const delay = 1000 * (i + 1);\n      await new Promise(r => setTimeout(r, delay));\n    }\n  }\n}`,
    ],
    python: [
      `def merge_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    return merge(left, right)\n\ndef merge(left, right):\n    result = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            result.append(left[i])\n            i += 1\n        else:\n            result.append(right[j])\n            j += 1\n    result.extend(left[i:])\n    result.extend(right[j:])\n    return result`,
      `class LRUCache:\n    def __init__(self, capacity):\n        self.capacity = capacity\n        self.cache = {}\n        self.order = []\n\n    def get(self, key):\n        if key in self.cache:\n            self.order.remove(key)\n            self.order.append(key)\n            return self.cache[key]\n        return -1\n\n    def put(self, key, value):\n        if key in self.cache:\n            self.order.remove(key)\n        elif len(self.cache) >= self.capacity:\n            oldest = self.order.pop(0)\n            del self.cache[oldest]\n        self.cache[key] = value\n        self.order.append(key)`,
    ],
    java: [
      `public class BinarySearch {\n    public static int search(int[] arr, int target) {\n        int left = 0;\n        int right = arr.length - 1;\n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n            if (arr[mid] == target) {\n                return mid;\n            } else if (arr[mid] < target) {\n                left = mid + 1;\n            } else {\n                right = mid - 1;\n            }\n        }\n        return -1;\n    }\n}`,
      `public class LinkedList<T> {\n    private Node<T> head;\n    private int size;\n\n    private static class Node<T> {\n        T data;\n        Node<T> next;\n        Node(T data) {\n            this.data = data;\n            this.next = null;\n        }\n    }\n\n    public void add(T data) {\n        Node<T> newNode = new Node<>(data);\n        if (head == null) {\n            head = newNode;\n        } else {\n            Node<T> current = head;\n            while (current.next != null) {\n                current = current.next;\n            }\n            current.next = newNode;\n        }\n        size++;\n    }\n}`,
    ],
    typescript: [
      `interface Observable<T> {\n  subscribe(observer: Observer<T>): Subscription;\n}\n\ninterface Observer<T> {\n  next(value: T): void;\n  error(err: Error): void;\n  complete(): void;\n}\n\nfunction createObservable<T>(\n  producer: (observer: Observer<T>) => void\n): Observable<T> {\n  return {\n    subscribe(observer: Observer<T>): Subscription {\n      producer(observer);\n      return {\n        unsubscribe() {\n          observer.complete();\n        },\n      };\n    },\n  };\n}`,
    ],
    go: [
      `func quickSort(arr []int) []int {\n\tif len(arr) <= 1 {\n\t\treturn arr\n\t}\n\tpivot := arr[len(arr)/2]\n\tvar left, right, equal []int\n\tfor _, v := range arr {\n\t\tswitch {\n\t\tcase v < pivot:\n\t\t\tleft = append(left, v)\n\t\tcase v > pivot:\n\t\t\tright = append(right, v)\n\t\tdefault:\n\t\t\tequal = append(equal, v)\n\t\t}\n\t}\n\tresult := quickSort(left)\n\tresult = append(result, equal...)\n\tresult = append(result, quickSort(right)...)\n\treturn result\n}`,
    ],
    rust: [
      `pub fn binary_search<T: Ord>(arr: &[T], target: &T) -> Option<usize> {\n    let mut left = 0;\n    let mut right = arr.len();\n    while left < right {\n        let mid = left + (right - left) / 2;\n        match arr[mid].cmp(target) {\n            std::cmp::Ordering::Equal => return Some(mid),\n            std::cmp::Ordering::Less => left = mid + 1,\n            std::cmp::Ordering::Greater => right = mid,\n        }\n    }\n    None\n}`,
    ],
    cpp: [
      `template<typename T>\nclass Stack {\nprivate:\n    std::vector<T> elements;\npublic:\n    void push(const T& elem) {\n        elements.push_back(elem);\n    }\n    T pop() {\n        if (elements.empty()) {\n            throw std::out_of_range("Stack is empty");\n        }\n        T elem = elements.back();\n        elements.pop_back();\n        return elem;\n    }\n    const T& top() const {\n        if (elements.empty()) {\n            throw std::out_of_range("Stack is empty");\n        }\n        return elements.back();\n    }\n    bool empty() const {\n        return elements.empty();\n    }\n    size_t size() const {\n        return elements.size();\n    }\n};`,
    ],
  };

  // ---- State ----
  let currentLang = "javascript";
  let codeText = "";
  let charElements = [];
  let cursorPos = 0;
  let startTime = null;
  let timerInterval = null;
  let countdownInterval = null;
  let isFinished = false;
  let isActive = false;
  let totalCorrect = 0;
  let totalIncorrect = 0;
  let totalKeystrokes = 0;
  let currentSource = "";
  let indentMap = new Set();
  let selectedTime = 30;
  let timeRemaining = 30;
  let keydownHandled = false;

  // ---- DOM refs ----
  const codeDisplay = document.getElementById("code-display");
  const hiddenInput = document.getElementById("hidden-input");
  const typingArea = document.getElementById("typing-area");
  const typingHint = document.getElementById("typing-hint");
  const codeSource = document.getElementById("code-source");
  const resultsOverlay = document.getElementById("results-overlay");
  const btnRestart = document.getElementById("btn-restart");
  const btnNew = document.getElementById("btn-new");
  const countdownDisplay = document.getElementById("countdown-display");
  const timerSelector = document.getElementById("timer-selector");

  // ---- Theme toggle ----
  (function () {
    const t = document.querySelector("[data-theme-toggle]");
    const r = document.documentElement;
    let d =
      r.getAttribute("data-theme") ||
      (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    r.setAttribute("data-theme", d);
    if (t) {
      t.addEventListener("click", () => {
        d = d === "dark" ? "light" : "dark";
        r.setAttribute("data-theme", d);
        t.setAttribute(
          "aria-label",
          "Switch to " + (d === "dark" ? "light" : "dark") + " mode",
        );
        t.innerHTML =
          d === "dark"
            ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
            : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
      });
    }
  })();

  // ---- Language selector ----
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.dataset.lang === currentLang) return;
      document.querySelectorAll(".lang-btn").forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      currentLang = btn.dataset.lang;
      loadSnippet();
    });
  });

  // ---- Timer selector ----
  document.querySelectorAll(".timer-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (parseInt(btn.dataset.time) === selectedTime) return;
      document.querySelectorAll(".timer-btn").forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      selectedTime = parseInt(btn.dataset.time);
      timeRemaining = selectedTime;
      countdownDisplay.textContent = selectedTime;
      loadSnippet();
    });
  });

  // ---- Check if a line is a comment ----
  function isCommentLine(line) {
    const trimmed = line.trim();
    if (trimmed === "") return false;
    // Single-line comments
    if (trimmed.startsWith("//")) return true; // JS, TS, Java, Go, Rust, C++
    if (trimmed.startsWith("#") && !trimmed.startsWith("#!")) return true; // Python (skip shebangs)
    // Block comment lines
    if (trimmed.startsWith("/*")) return true;
    if (trimmed.startsWith("*")) return true; // middle of block comment
    if (trimmed.startsWith("*/")) return true;
    // Python docstrings
    if (trimmed.startsWith('"""') || trimmed.startsWith("'''")) return true;
    // Rust doc comments
    if (trimmed.startsWith("///") || trimmed.startsWith("//!")) return true;
    return false;
  }

  // ---- Remove inline comments from a line ----
  function stripInlineComment(line) {
    // Remove trailing // comments, but not inside strings
    // Simple heuristic: find // that's not inside quotes
    let inString = false;
    let stringChar = "";
    let escaped = false;
    for (let i = 0; i < line.length - 1; i++) {
      const ch = line[i];
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === "\\") {
        escaped = true;
        continue;
      }
      if (!inString && (ch === '"' || ch === "'" || ch === "`")) {
        inString = true;
        stringChar = ch;
        continue;
      }
      if (inString && ch === stringChar) {
        inString = false;
        continue;
      }
      if (!inString && ch === "/" && line[i + 1] === "/") {
        return line.substring(0, i).trimEnd();
      }
    }
    // Also strip trailing # comments for Python (same heuristic)
    inString = false;
    escaped = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === "\\") {
        escaped = true;
        continue;
      }
      if (!inString && (ch === '"' || ch === "'" || ch === "`")) {
        inString = true;
        stringChar = ch;
        continue;
      }
      if (inString && ch === stringChar) {
        inString = false;
        continue;
      }
      if (!inString && ch === "#") {
        return line.substring(0, i).trimEnd();
      }
    }
    return line;
  }

  // ---- Extract a good snippet from raw file content ----
  function extractSnippet(content, minLines, maxLines) {
    // Remove BOM
    content = content.replace(/^\uFEFF/, "");

    let lines = content.split("\n");

    // Find a block of actual code (not imports, comments, blanks at top)
    let bestStart = 0;
    let inGoodBlock = false;

    // Skip leading comments, imports, package declarations
    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      if (
        trimmed === "" ||
        isCommentLine(lines[i]) ||
        trimmed.startsWith("import ") ||
        trimmed.startsWith("from ") ||
        trimmed.startsWith("package ") ||
        trimmed.startsWith("use ") ||
        trimmed.startsWith("require(") ||
        (trimmed.startsWith("const ") && trimmed.includes("require(")) ||
        trimmed.startsWith("#include") ||
        trimmed.startsWith("#pragma") ||
        trimmed.startsWith("using ")
      ) {
        continue;
      }
      bestStart = i;
      break;
    }

    // Look for a function/class definition start
    for (let i = bestStart; i < lines.length - minLines; i++) {
      const trimmed = lines[i].trim();
      if (
        trimmed.startsWith("function ") ||
        trimmed.startsWith("async function ") ||
        trimmed.startsWith("export function ") ||
        trimmed.startsWith("export default function") ||
        trimmed.startsWith("export async function") ||
        trimmed.startsWith("class ") ||
        trimmed.startsWith("export class ") ||
        trimmed.startsWith("def ") ||
        trimmed.startsWith("async def ") ||
        trimmed.startsWith("public ") ||
        trimmed.startsWith("private ") ||
        trimmed.startsWith("protected ") ||
        trimmed.startsWith("func ") ||
        trimmed.startsWith("fn ") ||
        trimmed.startsWith("pub fn ") ||
        trimmed.startsWith("impl ") ||
        trimmed.startsWith("struct ") ||
        trimmed.startsWith("template") ||
        trimmed.match(/^(const|let|var)\s+\w+\s*=\s*(function|\()/)
      ) {
        bestStart = i;
        inGoodBlock = true;
        break;
      }
    }

    // Extract a larger range of lines to work with
    const rawSnippet = lines.slice(bestStart, bestStart + maxLines * 2);

    // Filter out comment lines and strip inline comments
    let filtered = [];
    let inBlockComment = false;
    for (const line of rawSnippet) {
      const trimmed = line.trim();

      // Track block comments /* ... */
      if (inBlockComment) {
        if (trimmed.includes("*/")) {
          inBlockComment = false;
        }
        continue;
      }
      if (trimmed.startsWith("/*")) {
        if (!trimmed.includes("*/")) {
          inBlockComment = true;
        }
        continue;
      }

      // Skip full-line comments
      if (isCommentLine(line)) continue;

      // Strip inline comments from code lines
      const cleaned = stripInlineComment(line);

      // Skip lines that became empty after stripping
      if (cleaned.trim() === "" && trimmed !== "") continue;

      filtered.push(cleaned);
    }

    // Take the target number of lines
    const targetLines =
      minLines + Math.floor(Math.random() * (maxLines - minLines));
    let snippet = filtered.slice(0, targetLines);

    // Trim trailing empty lines
    while (snippet.length > 0 && snippet[snippet.length - 1].trim() === "") {
      snippet.pop();
    }

    // If snippet is too short, take more
    if (snippet.length < minLines) {
      snippet = filtered.slice(0, maxLines);
      while (snippet.length > 0 && snippet[snippet.length - 1].trim() === "") {
        snippet.pop();
      }
    }

    // Normalize indentation (find minimum indent, subtract it)
    const nonEmptyLines = snippet.filter((l) => l.trim().length > 0);
    if (nonEmptyLines.length > 0) {
      const minIndent = Math.min(
        ...nonEmptyLines.map((l) => l.match(/^(\s*)/)[1].length),
      );
      if (minIndent > 0) {
        snippet = snippet.map((l) => l.slice(minIndent));
      }
    }

    // Replace tabs with 2 spaces
    snippet = snippet.map((l) => l.replace(/\t/g, "  "));

    // Trim lines that are too long (break at 80 chars)
    snippet = snippet.map((l) => (l.length > 80 ? l.substring(0, 80) : l));

    return snippet.join("\n");
  }

  // ---- Fetch code from GitHub ----
  async function fetchGitHubSnippet() {
    const repos = REPOS[currentLang];
    if (!repos || repos.length === 0) return null;

    // Shuffle and try up to 3 repos
    const shuffled = [...repos].sort(() => Math.random() - 0.5);

    for (let i = 0; i < Math.min(3, shuffled.length); i++) {
      const { owner, repo, path } = shuffled[i];
      const url = `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/${path}`;
      try {
        const response = await fetch(url);
        if (!response.ok) continue;
        const text = await response.text();
        if (text.length < 200) continue;

        const snippet = extractSnippet(text, 8, 18);
        if (snippet.trim().length < 80) continue;

        currentSource = `${owner}/${repo}`;
        return snippet;
      } catch (e) {
        continue;
      }
    }
    return null;
  }

  // ---- Load snippet ----
  async function loadSnippet() {
    resetState();
    showSkeleton();

    let snippet = await fetchGitHubSnippet();

    if (!snippet) {
      // Fallback
      const fallbacks = FALLBACKS[currentLang] || FALLBACKS.javascript;
      snippet = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      currentSource = "fallback";
    }

    codeText = snippet;
    renderCode();
    updateSourceLabel();
  }

  function showSkeleton() {
    codeDisplay.innerHTML = "";
    for (let i = 0; i < 8; i++) {
      const div = document.createElement("div");
      div.className = "skeleton-line";
      div.style.width = 50 + Math.random() * 40 + "%";
      codeDisplay.appendChild(div);
    }
    codeSource.querySelector(".source-label").textContent =
      "loading snippet...";
  }

  function updateSourceLabel() {
    const label = codeSource.querySelector(".source-label");
    if (currentSource && currentSource !== "fallback") {
      label.innerHTML = `<a href="https://github.com/${currentSource}" target="_blank" rel="noopener noreferrer">${currentSource}</a>`;
    } else {
      label.textContent = "built-in snippet";
    }
  }

  // ---- Build a map of which char indices are "indent" (leading spaces on a line) ----
  function buildIndentMap(text) {
    const map = new Set();
    let i = 0;
    let atLineStart = true;
    for (let idx = 0; idx < text.length; idx++) {
      const ch = text[idx];
      if (ch === "\n") {
        atLineStart = true;
        continue;
      }
      if (atLineStart && ch === " ") {
        map.add(idx);
      } else {
        atLineStart = false;
      }
    }
    return map;
  }

  // ---- Render the code as individual char spans ----
  function renderCode() {
    codeDisplay.innerHTML = "";
    charElements = [];
    indentMap = buildIndentMap(codeText);

    for (let i = 0; i < codeText.length; i++) {
      const span = document.createElement("span");
      span.className = "char";
      const ch = codeText[i];

      if (ch === "\n") {
        span.textContent = "↵";
        span.dataset.char = "\n";
        span.style.opacity = "0.3";
      } else if (ch === " ") {
        span.innerHTML = "&nbsp;";
        span.dataset.char = " ";
      } else {
        span.textContent = ch;
        span.dataset.char = ch;
      }

      // Mark indent chars visually dimmer
      if (indentMap.has(i)) {
        span.classList.add("indent");
      }

      charElements.push(span);
      codeDisplay.appendChild(span);

      // After newline char, insert a real line break
      if (ch === "\n") {
        codeDisplay.appendChild(document.createElement("br"));
      }
    }

    // Place cursor at first typeable char (skip leading indent)
    cursorPos = 0;
    skipIndent();
    updateCursor();
  }

  // ---- Skip leading indent at current cursor position ----
  function skipIndent() {
    while (cursorPos < codeText.length && indentMap.has(cursorPos)) {
      charElements[cursorPos].classList.add("correct");
      charElements[cursorPos].classList.add("auto-skipped");
      cursorPos++;
    }
  }

  // ---- Cursor ----
  function updateCursor() {
    // Remove existing cursors
    document.querySelectorAll(".cursor").forEach((c) => c.remove());

    if (cursorPos < charElements.length) {
      const cursor = document.createElement("span");
      cursor.className = "cursor";
      charElements[cursorPos].style.position = "relative";
      charElements[cursorPos].appendChild(cursor);
    }
  }

  // ---- Focus management ----
  typingArea.addEventListener("click", () => {
    hiddenInput.focus();
  });

  hiddenInput.addEventListener("focus", () => {
    typingArea.classList.add("focused");
    typingHint.classList.add("hidden");
  });
  hiddenInput.addEventListener("blur", () => {
    typingArea.classList.remove("focused");
    typingArea.classList.remove("active");
    if (!isActive && !isFinished) {
      typingHint.classList.remove("hidden");
    }
  });

  // Start on any key press
  document.addEventListener("keydown", (e) => {
    if (isFinished) return;
    if (resultsOverlay && !resultsOverlay.hidden) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        loadSnippet();
        resultsOverlay.hidden = true;
        resultsOverlay.classList.remove("visible");
      }
      return;
    }
    // Focus the input if not focused and it's a typeable key
    if (document.activeElement !== hiddenInput && e.key.length === 1) {
      hiddenInput.focus();
    }
  });

  // ---- Ensure timer is started ----
  function ensureStarted() {
    if (!isActive) {
      startTimer();
      startCountdown();
      isActive = true;
      typingArea.classList.add("active");
      countdownDisplay.classList.add("visible");
      timerSelector.style.opacity = "0.3";
      timerSelector.style.pointerEvents = "none";
    }
  }

  // ---- Type a single character ----
  function typeChar(typed) {
    if (isFinished || cursorPos >= codeText.length) return;
    ensureStarted();

    const expected = codeText[cursorPos];

    if (typed === expected) {
      charElements[cursorPos].classList.add("correct");
      totalCorrect++;
    } else {
      charElements[cursorPos].classList.add("incorrect");
      totalIncorrect++;
    }

    totalKeystrokes++;
    cursorPos++;

    // Auto-skip indent after advancing
    skipIndent();

    updateCursor();
    updateStats();
    checkCompletion();
  }

  // ---- All input goes through keydown for reliable special char handling ----
  hiddenInput.addEventListener("keydown", (e) => {
    if (isFinished) return;

    // Escape — restart
    if (e.key === "Escape") {
      e.preventDefault();
      loadSnippet();
      return;
    }

    // Enter — type newline
    if (e.key === "Enter") {
      e.preventDefault();
      if (cursorPos >= codeText.length) return;
      ensureStarted();

      if (codeText[cursorPos] === "\n") {
        charElements[cursorPos].classList.add("correct");
        charElements[cursorPos].style.opacity = "0.6";
        totalCorrect++;
      } else {
        charElements[cursorPos].classList.add("incorrect");
        totalIncorrect++;
      }
      totalKeystrokes++;
      cursorPos++;
      skipIndent();
      hiddenInput.value = "";
      updateCursor();
      updateStats();
      checkCompletion();
      return;
    }

    // Tab — type 2 spaces
    if (e.key === "Tab") {
      e.preventDefault();
      ensureStarted();
      for (let i = 0; i < 2 && cursorPos < codeText.length; i++) {
        if (codeText[cursorPos] === " ") {
          charElements[cursorPos].classList.add("correct");
          totalCorrect++;
        } else {
          charElements[cursorPos].classList.add("incorrect");
          totalIncorrect++;
        }
        totalKeystrokes++;
        cursorPos++;
      }
      skipIndent();
      hiddenInput.value = "";
      updateCursor();
      updateStats();
      checkCompletion();
      return;
    }

    // Backspace
    if (e.key === "Backspace") {
      e.preventDefault();
      if (cursorPos > 0) {
        cursorPos--;
        // Skip back over auto-skipped indent chars
        while (
          cursorPos > 0 &&
          charElements[cursorPos].classList.contains("auto-skipped")
        ) {
          charElements[cursorPos].classList.remove("correct", "auto-skipped");
          cursorPos--;
        }

        const el = charElements[cursorPos];
        if (el.classList.contains("auto-skipped")) {
          skipIndent();
        } else {
          if (el.classList.contains("correct")) totalCorrect--;
          if (el.classList.contains("incorrect")) totalIncorrect--;
          totalKeystrokes = Math.max(0, totalKeystrokes - 1);
          el.classList.remove("correct", "incorrect");
          if (codeText[cursorPos] === "\n") {
            el.style.opacity = "0.3";
          }
        }
        hiddenInput.value = "";
        updateCursor();
        updateStats();
      }
      return;
    }

    // Printable character — handle directly from key
    // AltGr on German keyboards sends ctrlKey=true + altKey=true
    // We must allow this combo through for chars like { } [ ] ~ @ | \
    const isAltGr = e.ctrlKey && e.altKey;
    if (e.key.length === 1 && (!e.ctrlKey || isAltGr) && !e.metaKey) {
      e.preventDefault();
      keydownHandled = true;

      // Skip if expected char is a newline (must use Enter)
      if (cursorPos < codeText.length && codeText[cursorPos] === "\n") {
        return;
      }

      typeChar(e.key);
      hiddenInput.value = "";
      return;
    }
  });

  // Fallback: catch any characters that slip through keydown
  // (e.g., some AltGr combos on certain OS/browser combos)
  hiddenInput.addEventListener("input", (e) => {
    if (keydownHandled) {
      keydownHandled = false;
      hiddenInput.value = "";
      return;
    }
    const data = e.data || hiddenInput.value;
    if (
      data &&
      data.length === 1 &&
      !isFinished &&
      cursorPos < codeText.length
    ) {
      if (codeText[cursorPos] !== "\n") {
        ensureStarted();
        typeChar(data);
      }
    }
    hiddenInput.value = "";
  });

  // ---- Timer ----
  function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
      // Stats are no longer shown during typing — no live update needed
    }, 200);
  }

  // ---- Countdown ----
  function startCountdown() {
    timeRemaining = selectedTime;
    countdownDisplay.textContent = timeRemaining;
    countdownInterval = setInterval(() => {
      timeRemaining--;
      countdownDisplay.textContent = Math.max(0, timeRemaining);
      if (timeRemaining <= 0) {
        finishTest();
      }
    }, 1000);
  }

  // ---- Check completion ----
  function checkCompletion() {
    if (cursorPos >= codeText.length) {
      finishTest();
    }
  }

  function finishTest() {
    if (isFinished) return;
    isFinished = true;
    isActive = false;
    clearInterval(timerInterval);
    clearInterval(countdownInterval);
    typingArea.classList.remove("active");
    countdownDisplay.classList.remove("visible");

    const elapsed = (Date.now() - startTime) / 1000;
    const minutes = elapsed / 60;
    const wpm = minutes > 0 ? Math.round(totalCorrect / 5 / minutes) : 0;
    const rawWpm = minutes > 0 ? Math.round(totalKeystrokes / 5 / minutes) : 0;
    const accuracy =
      totalKeystrokes > 0
        ? Math.round((totalCorrect / totalKeystrokes) * 100)
        : 100;

    // Fill results
    document.getElementById("result-wpm").textContent = wpm;
    document.getElementById("result-accuracy").textContent = accuracy + "%";
    document.getElementById("result-time").textContent =
      elapsed.toFixed(1) + "s";
    document.getElementById("result-raw").textContent = rawWpm;
    document.getElementById("result-correct").textContent = totalCorrect;
    document.getElementById("result-errors").textContent = totalIncorrect;

    // Show overlay
    resultsOverlay.hidden = false;
    requestAnimationFrame(() => {
      resultsOverlay.classList.add("visible");
    });
  }

  // ---- Reset ----
  function resetState() {
    isFinished = false;
    isActive = false;
    cursorPos = 0;
    startTime = null;
    totalCorrect = 0;
    totalIncorrect = 0;
    totalKeystrokes = 0;
    clearInterval(timerInterval);
    clearInterval(countdownInterval);
    hiddenInput.value = "";
    typingHint.classList.remove("hidden");
    typingArea.classList.remove("active", "focused");

    // Reset countdown
    timeRemaining = selectedTime;
    countdownDisplay.textContent = selectedTime;
    countdownDisplay.classList.remove("visible");

    // Restore timer selector
    timerSelector.style.opacity = "1";
    timerSelector.style.pointerEvents = "auto";

    resultsOverlay.hidden = true;
    resultsOverlay.classList.remove("visible");
  }

  // ---- Buttons ----
  btnRestart.addEventListener("click", () => {
    loadSnippet();
  });

  btnNew.addEventListener("click", () => {
    loadSnippet();
  });

  // ---- Init ----
  loadSnippet();
})();
