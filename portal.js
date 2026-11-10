(() => {
    const button = document.querySelector('.theme-toggle');
    const system = window.matchMedia('(prefers-color-scheme: dark)');
    let hasPreference = false;
    try { hasPreference = ['dark', 'light'].includes(localStorage.getItem('cet-theme')); } catch (_) {}
    const syncButton = () => {
        const dark = document.documentElement.dataset.theme === 'dark';
        button.setAttribute('aria-pressed', String(dark));
        button.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
        button.querySelector('.theme-label').textContent = dark ? 'Light mode' : 'Dark mode';
    };
    button.hidden = false;
    syncButton();
    button.addEventListener('click', () => {
        const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.dataset.theme = next;
        hasPreference = true;
        try { localStorage.setItem('cet-theme', next); } catch (_) {}
        syncButton();
    });
    system.addEventListener('change', (event) => {
        if (!hasPreference) {
            document.documentElement.dataset.theme = event.matches ? 'dark' : 'light';
            syncButton();
        }
    });
    window.addEventListener('storage', (event) => {
        if (event.key !== 'cet-theme' && event.key !== null) return;
        hasPreference = ['dark', 'light'].includes(event.newValue);
        document.documentElement.dataset.theme = hasPreference ? event.newValue : system.matches ? 'dark' : 'light';
        syncButton();
    });
})();
