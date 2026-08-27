/**
 * Client-side i18n — translates elements with data-key attributes
 * using the dictionary loaded via window.AEGIS_I18N.
 */
(function() {
  const dict = window.AEGIS_I18N;
  if (!dict) return;

  function translateElement(el) {
    const key = el.getAttribute('data-key');
    if (key && dict[key]) {
      el.innerHTML = dict[key];
    }
  }

  // Translate all elements with data-key on load
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('[data-key]').forEach(translateElement);
  });

  // Re-translate when language changes (via set-lang redirect)
  // The page reloads with new dict, so DOMContentLoaded handles it
})();
