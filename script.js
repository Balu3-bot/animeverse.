
/* ==========================================================
   ANIMEVERSE - script.js
   1. Mobile navigation
   2. Automatic footer year
   3. AnimeVerse search
   4. Upload menu
   ========================================================== */


/* ---------- 1. MOBILE NAVIGATION ---------- */

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const yearSpan = document.getElementById("year");

function toggleMenu() {
  if (!menuToggle || !navLinks) return;

  const isOpen = navLinks.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "Close" : "Menu";
}

function closeMenu() {
  if (!menuToggle || !navLinks) return;

  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.textContent = "Menu";
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", toggleMenu);

  navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeMenu();
      closeUploadMenu();
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 700) {
      closeMenu();
    }
  });
}


/* ---------- 2. FOOTER YEAR ---------- */

if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}


/* ---------- 3. ANIMEVERSE SEARCH ---------- */

function setupAnimeVerseSearch() {
  const searchInput = document.getElementById("animeverse-search");
  const searchButton = document.getElementById("animeverse-search-btn");
  const searchMessage = document.getElementById(
    "animeverse-search-message"
  );

  if (!searchInput || !searchButton || !searchMessage) return;

  // Shared by both search and clear-search handlers.
  const cards = document.querySelectorAll(
    "#blogs .card, #blogs .content-card, " +
    "#content .card, #content .content-card, " +
    "#art .card, #edits .card"
  );

  function runAnimeVerseSearch() {
    const query = searchInput.value.trim().toLowerCase();

    if (!query) {
      cards.forEach(function (card) {
        card.hidden = false;
      });

      searchMessage.textContent = "Type something to search for.";
      return;
    }

    let matches = 0;
    let firstMatch = null;

    cards.forEach(function (card) {
      const found = card.textContent.toLowerCase().includes(query);

      card.hidden = !found;

      if (found) {
        matches++;

        if (!firstMatch) {
          firstMatch = card;
        }
      }
    });

    searchMessage.textContent = matches
      ? matches + " result(s) found."
      : "No matching content found.";

    if (firstMatch) {
      setTimeout(function () {
        firstMatch.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }, 150);
    }
  }

  searchButton.addEventListener("click", runAnimeVerseSearch);

  searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      runAnimeVerseSearch();
    }
  });

  searchInput.addEventListener("input", function () {
    if (!searchInput.value.trim()) {
      cards.forEach(function (card) {
        card.hidden = false;
      });

      searchMessage.textContent = "";
    }
  });
}


/* ---------- 4. ANIMEVERSE UPLOAD MENU ---------- */

function openUploadMenu() {
  const uploadMenu = document.getElementById("upload-menu");

  if (!uploadMenu) {
    console.error(
      'AnimeVerse: Could not find the element with id="upload-menu".'
    );
    alert("The upload menu could not be found. Please refresh the page.");
    return;
  }

  uploadMenu.hidden = false;
  uploadMenu.style.display = "flex";

  const firstButton = uploadMenu.querySelector("button");

  if (firstButton) {
    firstButton.focus();
  }
}

function closeUploadMenu() {
  const uploadMenu = document.getElementById("upload-menu");

  if (!uploadMenu) return;

  uploadMenu.hidden = true;
  uploadMenu.style.display = "none";
}

function chooseUploadType(type) {
  const names = {
    blog: "Anime Blog",
    art: "Fan Art & Designs",
    edit: "Anime Edits"
  };

  if (!Object.prototype.hasOwnProperty.call(names, type)) {
    return;
  }

  closeUploadMenu();

  alert(names[type] + " submissions are coming soon!");
}


/* ---------- 5. INITIALIZE ---------- */

function initializeAnimeVerse() {
  setupAnimeVerseSearch();

  // Keep the menu hidden until the visitor taps Upload.
  const uploadMenu = document.getElementById("upload-menu");

  if (uploadMenu) {
    uploadMenu.hidden = true;
    uploadMenu.style.display = "none";
  }
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initializeAnimeVerse,
    { once: true }
  );
} else {
  initializeAnimeVerse();
}
