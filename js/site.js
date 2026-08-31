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
      ".spotlight-entry",
      ".section-title",
      ".pillar-card",
      ".article-card",
      ".tldr-box",
      ".toc",
      ".pros-cons .box",
      ".affiliate-box",
      ".rank-item",
      ".author-box",
      ".cover-img",
      ".article-body h2"
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

  var reducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 10) ヒーローの粒子ネットワーク(canvas) ---------- */
  function initParticles() {
    var canvas = document.getElementById("hero-canvas");
    if (!canvas || reducedMotion) return;
    var ctx = canvas.getContext("2d");
    var hero = canvas.parentElement;
    var particles = [];
    var mouse = { x: null, y: null };
    var count = window.innerWidth < 640 ? 26 : 55;

    function resize() {
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }

    function makeParticles() {
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.6 + 0.6
        });
      }
    }

    resize();
    makeParticles();
    window.addEventListener("resize", function () {
      resize();
      makeParticles();
    });
    hero.addEventListener("mousemove", function (e) {
      var rect = hero.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    hero.addEventListener("mouseleave", function () {
      mouse.x = null;
      mouse.y = null;
    });

    var linkDist = 130;

    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        if (mouse.x !== null) {
          var dx = p.x - mouse.x;
          var dy = p.y - mouse.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            p.x += (dx / dist) * 0.6;
            p.y += (dy / dist) * 0.6;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(53, 99, 233, 0.65)";
        ctx.fill();
      });

      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var a = particles[i];
          var b = particles[j];
          var d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < linkDist) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = "rgba(53, 99, 233, " + (1 - d / linkDist) * 0.3 + ")";
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      window.requestAnimationFrame(tick);
    }
    window.requestAnimationFrame(tick);
  }

  /* ---------- 11) 見出しのスクランブル演出 ---------- */
  function initTextScramble() {
    if (reducedMotion) return;
    var el = document.querySelector("[data-scramble]");
    if (!el) return;
    var chars = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    // テキストノードだけを対象にし、<br>等のタグ構造は保持する
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    var nodes = [];
    var n;
    while ((n = walker.nextNode())) nodes.push(n);

    var globalIndex = 0;
    nodes.forEach(function (node) {
      var original = node.textContent;
      var chars_arr = original.split("");
      chars_arr.forEach(function (ch, idx) {
        (function (node, charIndex, finalChar, delayIndex) {
          if (finalChar.trim() === "") return;
          var iterations = 0;
          var maxIterations = 7;
          var delay = delayIndex * 28;
          window.setTimeout(function () {
            var interval = window.setInterval(function () {
              var current = node.textContent.split("");
              current[charIndex] =
                iterations < maxIterations ? chars[Math.floor(Math.random() * chars.length)] : finalChar;
              node.textContent = current.join("");
              iterations++;
              if (iterations > maxIterations) window.clearInterval(interval);
            }, 35);
          }, delay);
        })(node, idx, ch, globalIndex);
        globalIndex++;
      });
    });
  }

  /* ---------- 12) 追従ミニCTAバー ---------- */
  function initFloatingCta() {
    var firstBox = document.querySelector(".affiliate-box");
    if (!firstBox) return;
    var link = firstBox.querySelector(".btn-affiliate");
    var heading = firstBox.querySelector("h4");
    if (!link) return;

    var dismissed = false;
    try {
      dismissed = sessionStorage.getItem("wh-fc-dismissed") === "1";
    } catch (e) {}
    if (dismissed) return;

    var bar = document.createElement("div");
    bar.className = "floating-cta";
    bar.innerHTML =
      '<div class="wrap">' +
      '<span class="fc-text"></span>' +
      '<a class="btn-affiliate" href="' + link.getAttribute("href") + '">' + link.textContent + "</a>" +
      '<button type="button" class="fc-close" aria-label="閉じる">×</button>' +
      "</div>";
    bar.querySelector(".fc-text").textContent = heading ? heading.textContent : "気になる方はこちら";
    document.body.appendChild(bar);

    bar.querySelector(".fc-close").addEventListener("click", function () {
      bar.classList.remove("is-visible");
      try {
        sessionStorage.setItem("wh-fc-dismissed", "1");
      } catch (e) {}
    });

    var footer = document.querySelector(".site-footer");

    function onScroll() {
      var boxRect = firstBox.getBoundingClientRect();
      var past = boxRect.bottom < window.innerHeight * 0.6;
      var footerVisible = footer && footer.getBoundingClientRect().top < window.innerHeight;
      bar.classList.toggle("is-visible", past && !footerVisible);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
  }

  /* ---------- 13) スクロールレール(記事の現在地インジケーター) ---------- */
  function initScrollRail() {
    var article = document.querySelector(".article-body");
    if (!article) return;
    var headings = Array.prototype.slice.call(article.querySelectorAll("h2"));
    if (headings.length < 2) return;

    headings.forEach(function (h, i) {
      if (!h.id) h.id = "wh-section-" + i;
    });

    var rail = document.createElement("div");
    rail.className = "scroll-rail";
    headings.forEach(function (h) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", h.textContent);
      dot.dataset.target = h.id;
      dot.addEventListener("click", function () {
        document.getElementById(h.id).scrollIntoView({ behavior: "smooth", block: "start" });
      });
      rail.appendChild(dot);
    });
    document.body.appendChild(rail);

    var dots = Array.prototype.slice.call(rail.querySelectorAll("button"));

    function onScroll() {
      var pos = window.scrollY + 160;
      rail.classList.toggle(
        "is-visible",
        window.scrollY > 200 && window.scrollY + window.innerHeight < document.body.scrollHeight - 100
      );
      var current = headings[0];
      headings.forEach(function (h) {
        if (h.offsetTop <= pos) current = h;
      });
      dots.forEach(function (d) {
        d.classList.toggle("is-active", d.dataset.target === current.id);
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
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
  safe("particles", initParticles);
  safe("textScramble", initTextScramble);
  safe("floatingCta", initFloatingCta);
  safe("scrollRail", initScrollRail);
})();
