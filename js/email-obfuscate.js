/* Mohammed Lab: build mailto links from base64-encoded data attributes,
   only at the moment of a click, so the real address never sits in the
   rendered page for scrapers (JS-executing ones included) to read. */
(function () {
  "use strict";

  document.querySelectorAll("[data-email]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();

      var email;
      try {
        email = atob(el.getAttribute("data-email"));
      } catch (err) {
        return;
      }
      if (!email) return;

      var subject = el.getAttribute("data-subject");
      window.location.href =
        "mailto:" + email + (subject ? "?subject=" + encodeURIComponent(subject) : "");
    });
  });
})();
