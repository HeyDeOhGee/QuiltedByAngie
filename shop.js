let currentFilters = {
    sizes: [],
    priceRange: null
};

function getPriceRange(range) {
    const ranges = {
        '0-200': [0, 200],
        '200-400': [200, 400],
        '400-600': [400, 600],
        '600+': [600, Infinity]
    };
    return ranges[range] || [0, Infinity];
}

function filterQuilts() {
    return quilts.filter(quilt => {
        const sizeMatch = currentFilters.sizes.length === 0 || currentFilters.sizes.includes(quilt.size);
        
        let priceMatch = true;
        if (currentFilters.priceRange) {
            const [min, max] = getPriceRange(currentFilters.priceRange);
            priceMatch = quilt.price >= min && quilt.price <= max;
        }

        return sizeMatch && priceMatch;
    });
}

function sortQuilts(quilts, sortBy) {
    const sorted = [...quilts];
    switch (sortBy) {
        case 'price-low':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sorted.sort((a, b) => b.price - a.price);
        case 'newest':
            return sorted.reverse();
        default:
            return sorted;
    }
}

function renderShop() {
    const shopGrid = document.getElementById('shopGrid');
    const sortSelect = document.getElementById('sortSelect');
    
    let filtered = filterQuilts();
    const sortBy = sortSelect?.value || 'featured';
    const sorted = sortQuilts(filtered, sortBy);

    if (sorted.length === 0) {
        shopGrid.innerHTML = '<div class="empty-state"><p>No quilts match your filters</p></div>';
        return;
    }

    shopGrid.innerHTML = sorted.map(quilt => `
        <div class="quilt-card">
            <div class="quilt-image">[Quilt Image]</div>
            <div class="quilt-info">
                <h3>${quilt.name}</h3>
                <p>${quilt.description}</p>
                <p style="font-size: 0.85rem; color: #999;">${quilt.size.charAt(0).toUpperCase() + quilt.size.slice(1)}</p>
                <p class="rating">${'★'.repeat(Math.floor(quilt.rating))} ${quilt.rating}</p>
                <p class="price">$${quilt.price}</p>
                <button class="btn btn-primary add-to-cart-btn" onclick="addToCart(${quilt.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    const sizeFilters = document.querySelectorAll('.size-filter');
    const priceFilters = document.querySelectorAll('.price-filter');
    const sortSelect = document.getElementById('sortSelect');

    sizeFilters.forEach(filter => {
        filter.addEventListener('change', (e) => {
            currentFilters.sizes = Array.from(sizeFilters)
                .filter(f => f.checked)
                .map(f => f.value);
            renderShop();
        });
    });

    priceFilters.forEach(filter => {
        filter.addEventListener('change', (e) => {
            currentFilters.priceRange = e.target.value;
            renderShop();
        });
    });

    sortSelect?.addEventListener('change', () => {
        renderShop();
    });

    renderShop();
});
