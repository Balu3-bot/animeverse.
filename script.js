
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

/* ===== AnimeVerse Fan Art Features ===== */

function getArtworkCard(button) {
  return button.closest(".fan-art-card");
}

function getArtworkTitle(card) {
  return card.querySelector("h3")?.textContent.trim() || "Anime artwork";
}

function getArtworkImage(card) {
  return card.querySelector(".fan-art-image-link");
}

// Pin artwork
function togglePin(button) {
  const card = getArtworkCard(button);
  if (!card) return;

  const pinned = card.classList.toggle("artwork-pinned");
  button.textContent = pinned ? "📌 Pinned" : "📌 Pin";
  button.setAttribute("aria-pressed", String(pinned));

  const title = getArtworkTitle(card);
  let pins = JSON.parse(localStorage.getItem("animeverse-pins") || "[]");

  pins = pins.filter(item => item !== title);
  if (pinned) pins.push(title);

  localStorage.setItem("animeverse-pins", JSON.stringify(pins));
}

// Save artwork
function toggleSave(button) {
  const card = getArtworkCard(button);
  if (!card) return;

  const title = getArtworkTitle(card);
  let saved = JSON.parse(localStorage.getItem("animeverse-saved") || "[]");

  const alreadySaved = saved.includes(title);

  if (alreadySaved) {
    saved = saved.filter(item => item !== title);
  } else {
    saved.push(title);
  }

  localStorage.setItem("animeverse-saved", JSON.stringify(saved));

  button.textContent = alreadySaved ? "❤️ Save" : "💖 Saved";
  button.setAttribute("aria-pressed", String(!alreadySaved));
}

// Download artwork
function downloadArtwork(button) {
  const card = getArtworkCard(button);
  const link = card && getArtworkImage(card);

  if (!link) {
    alert("Artwork image not found.");
    return;
  }

  const imageUrl = link.href;
  const filename = imageUrl.split("/").pop().split("?")[0];

  const downloadLink = document.createElement("a");
  downloadLink.href = imageUrl;
  downloadLink.download = filename || "animeverse-artwork.jpg";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();
}

// Share artwork
async function shareArtwork(button) {
  const card = getArtworkCard(button);
  const link = card && getArtworkImage(card);
  if (!card || !link) return;

  const shareData = {
    title: getArtworkTitle(card),
    text: "Check out this artwork on AnimeVerse!",
    url: link.href
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareData.url);
      alert("Artwork link copied!");
    } else {
      prompt("Copy this artwork link:", shareData.url);
    }
  } catch (error) {
    if (error.name !== "AbortError") {
      alert("Couldn't share this artwork. Please try again.");
    }
  }
}

// Restore saved and pinned button states
document.addEventListener("DOMContentLoaded", function () {
  const pins = JSON.parse(localStorage.getItem("animeverse-pins") || "[]");
  const saved = JSON.parse(localStorage.getItem("animeverse-saved") || "[]");

  document.querySelectorAll(".fan-art-card").forEach(card => {
    const title = getArtworkTitle(card);
    const pinButton = card.querySelector('button[onclick="togglePin(this)"]');
    const saveButton = card.querySelector('button[onclick="toggleSave(this)"]');

    if (pins.includes(title)) {
      card.classList.add("artwork-pinned");
      if (pinButton) {
        pinButton.textContent = "📌 Pinned";
        pinButton.setAttribute("aria-pressed", "true");
      }
    }

    if (saved.includes(title) && saveButton) {
      saveButton.textContent = "💖 Saved";
      saveButton.setAttribute("aria-pressed", "true");
    }
  });
});
