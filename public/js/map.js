document.addEventListener('DOMContentLoaded', () => {
    const mapElement = document.getElementById('map');
    const locationName = mapElement.dataset.location;
    const title = mapElement.dataset.title;
    const encodedLocation = encodeURIComponent(locationName);

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodedLocation}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                const lat = data[0].lat;
                const lon = data[0].lon;

                const map = L.map('map', { scrollWheelZoom: false }).setView([lat, lon], 13);

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '&copy; OpenStreetMap contributors'
                }).addTo(map);

                L.marker([lat, lon]).addTo(map)
                    .bindPopup(`<b>${title}</b><br>${locationName}`)
                    .openPopup();

                const directionsBtn = document.getElementById('directions-btn');
                if (directionsBtn) {
                    directionsBtn.href = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
                    directionsBtn.classList.remove('d-none');
                }

                // --- START: Double Tap to Enable Scroll/Pan on Mobile ---
                if (/Mobi|Android/i.test(navigator.userAgent)) {
                    let lastTap = 0;
                    let scrollEnabled = false;

                    map.dragging.disable(); // disable panning by default
                    map.scrollWheelZoom.disable(); // disable zoom by scroll

                    mapElement.addEventListener('touchend', (e) => {
                        const now = Date.now();
                        if (now - lastTap < 300) {
                            // double tap detected
                            if (!scrollEnabled) {
                                map.dragging.enable();
                                scrollEnabled = true;
                            }
                        }
                        lastTap = now;
                    });

                    // Disable dragging again when map is out of viewport
                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (!entry.isIntersecting && scrollEnabled) {
                                map.dragging.disable();
                                scrollEnabled = false;
                            }
                        });
                    }, { threshold: 0.3 });

                    observer.observe(mapElement);
                } else {
                    // For desktop, enable scroll wheel zoom only when map in viewport and focused
                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach((entry) => {
                            if (entry.isIntersecting) {
                                map.once('focus', () => {
                                    map.scrollWheelZoom.enable();
                                });
                            } else {
                                map.scrollWheelZoom.disable();
                            }
                        });
                    }, { threshold: 0.5 });
                    observer.observe(mapElement);
                }
                // --- END: Double Tap to Enable Scroll/Pan on Mobile ---

            } else {
                mapElement.innerHTML = "<p class='text-danger'>Location not found.</p>";
            }
        })
        .catch((err) => {
            console.error("Error fetching geocode or loading map:", err);
            mapElement.innerHTML = "<p class='text-danger'>Location could not be loaded.</p>";
        });
});




    // Show more reviews
    const showMoreBtn = document.getElementById('show-more-btn');
    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', () => {
            document.querySelectorAll('.review-card-container[style*="display:none"]').forEach(el => {
                el.style.display = 'block';
            });
            showMoreBtn.style.display = 'none';
        });
    }