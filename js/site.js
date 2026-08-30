/* ワーホリ実務ノート / site.js
   スクロールで要素がふわっと現れる演出(IntersectionObserver)。
   JS未対応・無効環境では何も起きず、通常どおり全要素が表示される(プログレッシブエンハンスメント)。
*/
(function () {
  "use strict";

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
})();
