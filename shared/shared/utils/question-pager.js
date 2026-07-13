(function () {
  "use strict";

  function normalize(text) {
    return (text || "").replace(/\s+/g, " ").trim();
  }

  function isQuestionHeading(text) {
    const t = normalize(text);
    return (
      /^question\b/i.test(t) || /^q\d+\b/i.test(t) || /question\s+\d+/i.test(t)
    );
  }

  function getHeadingText(container) {
    const heading = container.querySelector(
      ".collapsible-header, h1, h2, h3, h4, .section-title, .question-label",
    );
    return heading ? heading.textContent : "";
  }

  function getQuestionContainers() {
    const candidates = Array.from(
      document.querySelectorAll(".collapsible-container, .section, .question"),
    );

    const questionContainers = candidates.filter((container) => {
      if (!(container instanceof HTMLElement)) return false;
      if (container.closest(".question-pager-nav")) return false;
      return isQuestionHeading(getHeadingText(container));
    });

    return questionContainers.filter(
      (container) =>
        !questionContainers.some(
          (other) => other !== container && container.contains(other),
        ),
    );
  }

  function ensureStyles() {
    if (document.getElementById("question-pager-styles")) return;

    const style = document.createElement("style");
    style.id = "question-pager-styles";
    style.textContent = `
      .question-page-hidden {
        display: none !important;
      }

      .question-pager-nav {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin: 16px 0;
        padding: 12px 14px;
        border-radius: 10px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        position: sticky;
        top: 58px;
        z-index: 900;
        /* keep the nav visible below the fixed progress bar when
           scrollIntoView targets it */
        scroll-margin-top: 32px;
      }

      .question-pager-status {
        font-weight: 600;
        color: #1f2937;
        min-width: 120px;
        text-align: center;
      }

      .question-pager-btn {
        border: none;
        border-radius: 8px;
        padding: 8px 14px;
        cursor: pointer;
        font-weight: 600;
        background: #2563eb;
        color: #ffffff;
      }

      .question-pager-btn[disabled] {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `;

    document.head.appendChild(style);
  }

  function initQuestionPager() {
    const questionContainers = getQuestionContainers();
    if (questionContainers.length < 2) return;

    ensureStyles();

    const nav = document.createElement("div");
    nav.className = "question-pager-nav";
    nav.innerHTML = `
      <button type="button" class="question-pager-btn" data-action="prev">← Previous</button>
      <div class="question-pager-status" aria-live="polite"></div>
      <button type="button" class="question-pager-btn" data-action="next">Next →</button>
    `;

    questionContainers[0].parentNode.insertBefore(nav, questionContainers[0]);

    const prevBtn = nav.querySelector('[data-action="prev"]');
    const nextBtn = nav.querySelector('[data-action="next"]');
    const status = nav.querySelector(".question-pager-status");

    let index = 0;

    function showQuestion(newIndex, scrollIntoView) {
      if (newIndex < 0 || newIndex >= questionContainers.length) return;
      index = newIndex;

      questionContainers.forEach((container, i) => {
        container.classList.toggle("question-page-hidden", i !== index);
      });

      const current = questionContainers[index];

      // Keep the pager directly above whichever question is active, so
      // Prev/Next never end up stranded elsewhere on the page (questions
      // can be interleaved with always-visible figures and info sections).
      if (nav.nextElementSibling !== current || nav.parentNode !== current.parentNode) {
        current.parentNode.insertBefore(nav, current);
      }

      current
        .querySelectorAll(".collapsible-header.is-collapsed")
        .forEach((h) => {
          h.classList.remove("is-collapsed");
        });
      current
        .querySelectorAll(".collapsible-content.is-collapsed")
        .forEach((c) => c.classList.remove("is-collapsed"));

      status.textContent = `Question ${index + 1} of ${questionContainers.length}`;
      prevBtn.disabled = index === 0;
      nextBtn.disabled = index === questionContainers.length - 1;

      if (scrollIntoView) {
        // Scroll to the pager so the question lands right beneath it.
        nav.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    prevBtn.addEventListener("click", () => showQuestion(index - 1, true));
    nextBtn.addEventListener("click", () => showQuestion(index + 1, true));

    function isTypingTarget(el) {
      if (!el) return false;
      const tag = el.tagName;
      return (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        el.isContentEditable
      );
    }

    document.addEventListener("keydown", (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (isTypingTarget(document.activeElement)) return;
      if (e.key === "ArrowLeft") showQuestion(index - 1, true);
      if (e.key === "ArrowRight") showQuestion(index + 1, true);
    });

    showQuestion(0, false);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initQuestionPager);
  } else {
    initQuestionPager();
  }
})();
