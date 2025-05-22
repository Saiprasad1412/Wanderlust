document.addEventListener("DOMContentLoaded", function () {
  const sortSelect = document.getElementById("sortSelect");
  const priceSlider = document.getElementById("priceSlider");
  const priceVal = document.getElementById("priceVal");
  const categorySelect = document.getElementById("categorySelect");
  const applyBtn = document.getElementById("applyFiltersBtn");

  if (priceSlider && priceVal) {
    priceSlider.addEventListener("input", () => {
      priceVal.innerText = priceSlider.value;
    });
  }

  if (applyBtn) {
    applyBtn.addEventListener("click", () => {
      const sort = sortSelect?.value;
      const maxPrice = priceSlider?.value;
      const category = categorySelect?.value;

      const params = new URLSearchParams();
      if (sort) params.set("sort", sort);
      if (maxPrice) params.set("maxPrice", maxPrice);
      if (category) params.set("category", category);

      window.location.href = window.location.pathname + "?" + params.toString();
    });
  }

  const searchInput = document.getElementById("searchInput");
  const suggestionsBox = document.getElementById("suggestionsBox");

  if (searchInput && suggestionsBox) {
    searchInput.addEventListener("input", async () => {
      const query = searchInput.value.trim();
      if (!query) {
        suggestionsBox.style.display = "none";
        return;
      }

      try {
        const res = await fetch(`/listing/suggestions?q=${encodeURIComponent(query)}`);
        const results = await res.json();

        if (results.length === 0) {
          suggestionsBox.style.display = "none";
          return;
        }

        suggestionsBox.innerHTML = "";
        results.forEach((item) => {
          const li = document.createElement("li");
          li.className = "list-group-item list-group-item-action";
          li.textContent = `${item.title} — ${item.location}`;
          li.style.cursor = "pointer";
          li.addEventListener("click", () => {
            window.location.href = `/listing/${item._id}`;
          });
          suggestionsBox.appendChild(li);
        });

        suggestionsBox.style.display = "block";
      } catch (err) {
        console.error("Search error:", err);
      }
    });

    // Hide suggestions when clicking outside
    document.addEventListener("click", (e) => {
      if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
        suggestionsBox.style.display = "none";
      }
    });

    // Submit form on Enter key
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        window.location.href = `/listing?search=${encodeURIComponent(searchInput.value.trim())}`;
      }
    });
  }
});
let currentIndex = 30;
  const batchSize = 30;
  const allCards = document.querySelectorAll('.listing-card-wrapper');
  const showMoreBtn = document.getElementById('showMoreBtn');

  showMoreBtn?.addEventListener('click', () => {
    const nextIndex = currentIndex + batchSize;
    for (let i = currentIndex; i < nextIndex && i < allCards.length; i++) {
      allCards[i].classList.remove('d-none');
    }
    currentIndex = nextIndex;

    if (currentIndex >= allCards.length) {
      showMoreBtn.style.display = 'none';
    }
  });