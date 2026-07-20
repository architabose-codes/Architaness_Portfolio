// iOS-style "zoom into place" transition between pages of this site.
// Only the incoming page animates (documentElement gets `pt-entering` +
// --pt-x/--pt-y, set synchronously by the inline script in each page's
// <head>, before first paint, to avoid a flash of the un-animated
// page). This file just records the click origin and hands off to a
// normal, immediate navigation — no artificial delay before it, since
// that only added dead time on top of the page's real load time.
(function () {
  var root = document.documentElement;

  root.addEventListener('animationend', function (e) {
    if (e.target === root && root.classList.contains('pt-entering')) {
      root.classList.remove('pt-entering');
    }
  });

  function isInternalNav(link) {
    if (!link || link.target === '_blank') return false;
    var href = link.getAttribute('href');
    if (!href || href.charAt(0) === '#') return false;
    if (/^(mailto:|tel:|javascript:)/i.test(href)) return false;
    if (/^https?:\/\//i.test(href)) return false;
    return true;
  }

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var link = e.target.closest('a');
    if (!isInternalNav(link)) return;

    var rect = link.getBoundingClientRect();
    var x = (((rect.left + rect.width / 2) / window.innerWidth) * 100).toFixed(2);
    var y = (((rect.top + rect.height / 2) / window.innerHeight) * 100).toFixed(2);
    sessionStorage.setItem('pt-origin', x + ',' + y);
    // Let the click navigate normally from here — no preventDefault/
    // manual location change, so there's nothing to delay it.
  });
})();
