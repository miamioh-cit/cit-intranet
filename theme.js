// Apply the preference before the stylesheet loads to avoid a light-mode flash.
(() => {
    let saved;
    try { saved = localStorage.getItem('cet-theme'); } catch (_) { /* Storage may be unavailable. */ }
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.dataset.theme = saved === 'system'
        ? (systemDark ? 'dark' : 'light') : saved === 'dark' ? 'dark' : 'light';
})();
