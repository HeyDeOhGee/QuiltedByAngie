function renderGallery(filter = 'all') {
    const galleryGrid = document.getElementById('galleryGrid');
    const filtered = filter === 'all' ? quilts : quilts.filter(q => q.category === filter);

    galleryGrid.innerHTML = filtered.map(quilt => `
        <div class="quilt-card">
            <div class="quilt-image">[Quilt Image]</div>
            <div class="quilt-info">
                <h3>${quilt.name}</h3>
                <p>${quilt.description}</p>
                <p>${quilt.size.charAt(0).toUpperCase() + quilt.size.slice(1)}</p>
                <p class="rating">${'★'.repeat(Math.floor(quilt.rating))} ${quilt.rating}</p>
                <p class="price">$${quilt.price}</p>
                <button class="btn btn-primary add-to-cart-btn" onclick="addToCart(${quilt.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            button.classList.add('active');
            renderGallery(button.dataset.filter);
        });
    });

    renderGallery();
});
