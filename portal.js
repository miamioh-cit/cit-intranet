(() => {
    const system = window.matchMedia('(prefers-color-scheme: dark)');
    const picker = document.querySelector('.theme-picker');
    const select = picker.querySelector('select');
    const readTheme = () => {
        try { const saved = localStorage.getItem('cet-theme'); return ['light', 'dark'].includes(saved) ? saved : 'system'; } catch (_) { return 'system'; }
    };
    let preference = readTheme();
    const applyTheme = () => {
        document.documentElement.dataset.theme = preference === 'system' ? (system.matches ? 'dark' : 'light') : preference;
        select.value = preference;
    };
    picker.hidden = false;
    applyTheme();
    select.addEventListener('change', () => {
        preference = select.value;
        try { localStorage.setItem('cet-theme', preference); } catch (_) {}
        applyTheme();
    });
    system.addEventListener('change', applyTheme);

    const key = 'cet-favorites';
    const readFavorites = () => {
        try {
            const saved = JSON.parse(localStorage.getItem(key));
            return new Set(Array.isArray(saved) ? saved.filter(value => typeof value === 'string') : []);
        } catch (_) { return new Set(); }
    };
    let favorites = readFavorites();
    const resources = [];
    const favoriteSection = document.createElement('section');
    favoriteSection.className = 'section favorites-section';
    favoriteSection.hidden = true;
    favoriteSection.setAttribute('aria-labelledby', 'favorites-title');
    favoriteSection.innerHTML = '<div class="section-header"><h2 class="section-title" id="favorites-title" tabindex="-1">Favorite tools</h2></div><div class="card-grid favorites-grid"></div>';
    const firstGrid = document.querySelector('.card-grid');
    const firstSection = firstGrid.closest('section') || firstGrid.previousElementSibling;
    firstSection.before(favoriteSection);
    const status = document.createElement('p');
    status.className = 'visually-hidden';
    status.setAttribute('role', 'status');
    favoriteSection.before(status);

    const syncButtons = () => {
        document.querySelectorAll('.favorite-button').forEach(button => {
            const selected = favorites.has(button.dataset.favoriteId);
            button.setAttribute('aria-pressed', String(selected));
            button.setAttribute('aria-label', `${selected ? 'Remove' : 'Add'} ${button.dataset.title} ${selected ? 'from' : 'to'} favorites`);
            button.textContent = selected ? '★' : '☆';
        });
    };
    const wrapResource = (anchor, resource) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'tool-item';
        anchor.replaceWith(wrapper);
        wrapper.append(anchor);
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'favorite-button';
        button.dataset.favoriteId = resource.id;
        button.dataset.title = resource.title;
        button.addEventListener('click', () => {
            const removing = favorites.has(resource.id);
            const wasInFavorites = favoriteSection.contains(button);
            removing ? favorites.delete(resource.id) : favorites.add(resource.id);
            let saved = true;
            try { localStorage.setItem(key, JSON.stringify([...favorites])); } catch (_) { saved = false; }
            renderFavorites();
            status.textContent = `${resource.title} ${removing ? 'removed from' : 'added to'} favorites.${saved ? '' : ' Changes will last for this visit only.'}`;
            if (wasInFavorites) {
                const original = resources.find(item => item.id === resource.id);
                original.anchor.parentElement.querySelector('button').focus();
            }
        });
        wrapper.append(button);
    };
    const renderFavorites = () => {
        const grid = favoriteSection.querySelector('.favorites-grid');
        grid.replaceChildren();
        resources.filter(resource => favorites.has(resource.id)).forEach(resource => {
            const anchor = resource.anchor.cloneNode(true);
            grid.append(anchor);
            wrapResource(anchor, resource);
        });
        favoriteSection.hidden = !grid.children.length;
        syncButtons();
    };
    document.querySelectorAll('.card-grid:not(.favorites-grid) > a, .admin-grid > a').forEach(anchor => {
        const title = anchor.querySelector('.card-title, .admin-title').textContent.trim();
        const resource = { id: `${title}|${anchor.getAttribute('href')}`, title, anchor };
        resources.push(resource);
        wrapResource(anchor, resource);
    });
    renderFavorites();
    window.addEventListener('storage', event => {
        if (event.key === 'cet-theme' || event.key === null) { preference = readTheme(); applyTheme(); }
        if (event.key === key || event.key === null) { favorites = readFavorites(); renderFavorites(); }
    });
})();
