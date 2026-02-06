(() => {
  let data = null;
  let currentCatId = null;
  let history = {}; // categoryId -> array of shown indices
  const FADE_MS = 350;

  const categoriesEl = document.getElementById("categories");
  const verseContent = document.getElementById("verseContent");

  async function init() {
    const res = await fetch("verses.json");
    data = await res.json();
    renderCategories();
  }

  function renderCategories() {
    data.categories.forEach((cat) => {
      const btn = document.createElement("button");
      btn.className = "cat-btn";
      btn.dataset.id = cat.id;
      btn.innerHTML = `<span class="icon">${cat.icon}</span>${cat.label}`;
      btn.addEventListener("click", () => selectCategory(cat.id));
      categoriesEl.appendChild(btn);
    });
  }

  function selectCategory(catId) {
    currentCatId = catId;
    // Update active button
    document.querySelectorAll(".cat-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.id === catId);
    });
    showRandomVerse();
  }

  function pickRandomIndex(catId) {
    const cat = data.categories.find((c) => c.id === catId);
    const total = cat.verses.length;
    if (!history[catId]) history[catId] = [];

    // If all shown, reset history but keep the last one to avoid immediate repeat
    if (history[catId].length >= total) {
      const last = history[catId][history[catId].length - 1];
      history[catId] = [last];
    }

    const available = [];
    for (let i = 0; i < total; i++) {
      if (!history[catId].includes(i)) available.push(i);
    }

    const idx = available[Math.floor(Math.random() * available.length)];
    history[catId].push(idx);
    return idx;
  }

  function showRandomVerse() {
    const cat = data.categories.find((c) => c.id === currentCatId);
    const idx = pickRandomIndex(currentCatId);
    const verse = cat.verses[idx];

    // Fade out, swap content, fade in
    verseContent.classList.add("fade-out");

    setTimeout(() => {
      verseContent.innerHTML = `
        <p class="verse-kr">${verse.kr}</p>
        <span class="verse-ref-kr">— ${verse.ref}</span>
        <hr class="verse-divider">
        <p class="verse-en">${verse.en}</p>
        <span class="verse-ref-en">— ${verse.refEn}</span>
        <button class="btn-another" onclick="window.__nextVerse()">다른 말씀 찾기</button>
      `;
      verseContent.classList.remove("fade-out");
    }, FADE_MS);
  }

  // Expose for inline onclick
  window.__nextVerse = () => {
    if (currentCatId) showRandomVerse();
  };

  init();
})();
