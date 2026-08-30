/* ワーホリ実務ノート / site.js
   読みやすさを壊さない範囲での「動的」演出をまとめたファイル。
   全機能はプログレッシブエンハンスメント: JS未対応・無効環境でも
   通常どおり全コンテンツが読める状態を維持する。
   1) スクロールでのフェードイン演出
   2) ダークモード手動切り替え(localStorage記憶)
   3) 記事の読了プログレスバー
   4) 目次(TOC)の現在地ハイライト
   5) トップへ戻るボタン
   6) ボタンのリップルエフェクト
*/
(function () {
  "use strict";

  /* ---------- 1) スクロールフェードイン ---------- */
  function initReveal() {
    if (!("IntersectionObserver" in window)) return;

    var selectors = [
      ".hero-kicker",
      ".hero-premium h1",
      ".hero-premium p",
      ".hero-stats",
      ".hero-photo",
      ".section-title",
      ".pillar-card",
      ".article-card",
      ".tldr-box",
      ".toc",
      ".pros-cons .box",
      ".affiliate-box",
      ".rank-item",
      ".author-box"
    ];

    var els = Array.prototype.slice.call(
      document.querySelectorAll(selectors.join(","))
    );
    if (!els.length) return;

    els.forEach(function (el, i) {
      el.classList.add("reveal");
      el.style.transitionDelay = Math.min(i % 8, 7) * 55 + "ms";
    });

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    els.forEach(function (el) {
      io.observe(el);
    });
  }

  /* ---------- 2) ダークモード手動切り替え ---------- */
  function initThemeToggle() {
    var nav = document.querySelector(".site-nav");
    if (!nav) return;

    function systemPrefersDark() {
      return (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      );
    }

    function currentMode() {
      var explicit = document.documentElement.getAttribute("data-theme");
      if (explicit) return explicit;
      return systemPrefersDark() ? "dark" : "light";
    }

    var stored = null;
    try {
      stored = localStorage.getItem("wh-theme");
    } catch (e) {
      /* localStorage無効環境: 何もしない */
    }
    if (stored === "dark" || stored === "light") {
      document.documentElement.setAttribute("data-theme", stored);
    }

    var li = document.createElement("li");
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "theme-toggle";
    btn.setAttribute("aria-label", "ダークモード切り替え");
    btn.textContent = currentMode() === "dark" ? "☀️" : "🌙";
    li.appendChild(btn);
    nav.appendChild(li);

    btn.addEventListener("click", function () {
      var next = currentMode() === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      btn.textContent = next === "dark" ? "☀️" : "🌙";
      try {
        localStorage.setItem("wh-theme", next);
      } catch (e) {
        /* 保存できなくても表示切り替え自体は機能する */
      }
    });
  }

  /* ---------- 3) 記事の読了プログレスバー ---------- */
  function initReadingProgress() {
    var article = document.querySelector(".article-body");
    if (!article) return;

    var bar = document.createElement("div");
    bar.className = "reading-progress";
    var fill = document.createElement("div");
    fill.className = "reading-progress-fill";
    bar.appendChild(fill);
    document.body.insertBefore(bar, document.body.firstChild);

    function update() {
      var top = article.getBoundingClientRect().top + window.scrollY;
      var start = top;
      var end = top + article.offsetHeight - window.innerHeight;
      var pct = end > start ? (window.scrollY - start) / (end - start) : 0;
      pct = Math.min(Math.max(pct, 0), 1);
      fill.style.width = pct * 100 + "%";
    }

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ---------- 4) 目次(TOC)の現在地ハイライト ---------- */
  function initTocHighlight() {
    var toc = document.querySelector(".toc");
    if (!toc) return;

    var links = Array.prototype.slice.call(toc.querySelectorAll('a[href^="#"]'));
    if (!links.length) return;

    var targets = links
      .map(function (a) {
        return document.getElementById(a.getAttribute("href").slice(1));
      })
      .filter(Boolean);
    if (!targets.length) return;

    function onScroll() {
      var pos = window.scrollY + 140;
      var current = targets[0];
      targets.forEach(function (t) {
        if (t.offsetTop <= pos) current = t;
      });
      links.forEach(function (a) {
        a.classList.toggle("is-active", a.getAttribute("href") === "#" + current.id);
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 5) トップへ戻るボタン ---------- */
  function initBackToTop() {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "back-to-top";
    btn.setAttribute("aria-label", "ページ上部へ戻る");
    btn.textContent = "↑";
    document.body.appendChild(btn);

    function toggle() {
      btn.classList.toggle("is-visible", window.scrollY > 480);
    }

    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener("scroll", toggle, { passive: true });
    toggle();
  }

  /* ---------- 6) ボタンのリップルエフェクト ---------- */
  function initRipple() {
    document.addEventListener("click", function (e) {
      var btn = e.target.closest && e.target.closest(".btn-affiliate");
      if (!btn) return;

      var circle = document.createElement("span");
      circle.className = "ripple";
      var rect = btn.getBoundingClientRect();
      var size = Math.max(rect.width, rect.height);
      circle.style.width = circle.style.height = size + "px";
      circle.style.left = e.clientX - rect.left - size / 2 + "px";
      circle.style.top = e.clientY - rect.top - size / 2 + "px";
      btn.appendChild(circle);
      circle.addEventListener("animationend", function () {
        circle.remove();
      });
    });
  }

  initReveal();
  initThemeToggle();
  initReadingProgress();
  initTocHighlight();
  initBackToTop();
  initRipple();
})();
