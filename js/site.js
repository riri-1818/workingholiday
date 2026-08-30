/* ワーホリ実務ノート / site.js
   「動的」演出まとめ。全機能は独立した try/catch で保護し、
   1つが失敗しても他の機能・記事本文の表示に影響しない設計。
   スクロール演出は「JSが動く前提で要素を隠す」リスクを避けるため、
   多重のフェイルセーフ(強制表示タイマー・シンプルな判定式)を入れている。
*/
(function () {
  "use strict";

  function safe(name, fn) {
    try {
      fn();
    } catch (e) {
      if (window.console && console.warn) {
        console.warn("[site.js] " + name + " failed:", e);
      }
    }
  }

  var canHover =
    window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- 1) スクロールフェードイン(フェイルセーフ付き) ---------- */
  function initReveal() {
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

    var els = Array.prototype.slice.call(document.querySelectorAll(selectors.join(",")));
    if (!els.length) return;

    els.forEach(function (el, i) {
      el.classList.add("reveal");
      el.style.transitionDelay = Math.min(i % 8, 7) * 45 + "ms";
    });

    var revealed = false;

    function revealAll() {
      if (revealed) return;
      revealed = true;
      els.forEach(function (el) {
        el.classList.add("is-visible");
      });
    }

    // フェイルセーフ: どんな事情があっても2秒後には必ず全部見える状態にする
    var failSafeTimer = window.setTimeout(revealAll, 2000);

    function check() {
      var vh = window.innerHeight;
      var allDone = true;
      els.forEach(function (el) {
        if (el.classList.contains("is-visible")) return;
        var rect = el.getBoundingClientRect();
        if (rect.top < vh * 0.94 && rect.bottom > 0) {
          el.classList.add("is-visible");
        } else {
          allDone = false;
        }
      });
      if (allDone) {
        window.clearTimeout(failSafeTimer);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      }
    }

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        check();
        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    check();
  }

  /* ---------- 2) ダークモード手動切り替え ---------- */
  function initThemeToggle() {
    var nav = document.querySelector(".site-nav");
    if (!nav) return;

    function systemPrefersDark() {
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    function currentMode() {
      var explicit = document.documentElement.getAttribute("data-theme");
      if (explicit) return explicit;
      return systemPrefersDark() ? "dark" : "light";
    }

    var stored = null;
    try {
      stored = localStorage.getItem("wh-theme");
    } catch (e) {}
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
      } catch (e) {}
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

  /* ---------- 7) カードの3Dチルト(立体感) ---------- */
  function initTilt() {
    if (!canHover) return;
    var cards = document.querySelectorAll(".pillar-card, .article-card, .rank-item");
    cards.forEach(function (card) {
      card.classList.add("tilt-ready");
      var raf = null;
      card.addEventListener("mousemove", function (e) {
        if (raf) return;
        raf = window.requestAnimationFrame(function () {
          var rect = card.getBoundingClientRect();
          var x = (e.clientX - rect.left) / rect.width - 0.5;
          var y = (e.clientY - rect.top) / rect.height - 0.5;
          var rotateX = (-y * 8).toFixed(2);
          var rotateY = (x * 10).toFixed(2);
          card.style.transform =
            "perspective(900px) rotateX(" +
            rotateX +
            "deg) rotateY(" +
            rotateY +
            "deg) translateY(-6px) scale(1.015)";
          raf = null;
        });
      });
      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
      });
    });
  }

  /* ---------- 8) ヒーロー写真のパララックス ---------- */
  function initParallax() {
    var photo = document.querySelector(".hero-photo");
    if (!photo) return;
    var hero = document.querySelector(".hero-premium");
    var ticking = false;
    function update() {
      var rect = hero.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        var offset = (window.scrollY - hero.offsetTop) * 0.12;
        photo.style.transform = "translateY(" + offset + "px) scale(1.04)";
      }
      ticking = false;
    }
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );
    update();
  }

  /* ---------- 9) 数字のカウントアップ ---------- */
  function initCountUp() {
    var spans = document.querySelectorAll(".hero-stats span");
    spans.forEach(function (span) {
      var match = span.textContent.match(/\d+/);
      if (!match) return;
      var target = parseInt(match[0], 10);
      var before = span.textContent.slice(0, match.index);
      var after = span.textContent.slice(match.index + match[0].length);
      var duration = 900;
      var startTime = null;
      function frame(ts) {
        if (!startTime) startTime = ts;
        var progress = Math.min((ts - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.round(target * eased);
        span.textContent = before + current + after;
        if (progress < 1) window.requestAnimationFrame(frame);
      }
      window.requestAnimationFrame(frame);
    });
  }

  safe("reveal", initReveal);
  safe("themeToggle", initThemeToggle);
  safe("readingProgress", initReadingProgress);
  safe("tocHighlight", initTocHighlight);
  safe("backToTop", initBackToTop);
  safe("ripple", initRipple);
  safe("tilt", initTilt);
  safe("parallax", initParallax);
  safe("countUp", initCountUp);
})();
