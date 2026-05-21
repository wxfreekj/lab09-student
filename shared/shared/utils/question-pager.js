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

    // Prefer leaf-most question containers (avoid selecting both parent + nested question block)
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

      // Ensure current collapsible content is visible
      const current = questionContainers[index];
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
        current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    prevBtn.addEventListener("click", () => showQuestion(index - 1, true));
    nextBtn.addEventListener("click", () => showQuestion(index + 1, true));

    document.addEventListener("keydown", (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
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
