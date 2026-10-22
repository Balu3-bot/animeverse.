/* ==========================================================
   ANIMEVERSE - script.js
   What this file does:
   1. Opens and closes the mobile menu
   2. Closes the menu when a link is clicked or Escape is pressed
   3. Fills in the current year in the footer
   ========================================================== */


/* ---------- 1. FIND THE ELEMENTS WE NEED ----------
   document.getElementById() finds an element by its id in index.html. */
const menuToggle = document.getElementById("menuToggle"); // the "Menu" button
const navLinks = document.getElementById("navLinks");     // the list of links
const yearSpan = document.getElementById("year");         // the year in the footer


/* ---------- 2. MOBILE MENU ---------- */

// Function: open or close the menu
function toggleMenu() {
  // classList.toggle() adds the class "open" if it's missing, removes it if it's there.
  // It returns true when the menu is now open. style.css shows the menu when "open" is on.
  const isOpen = navLinks.classList.toggle("open");

  // Tell screen readers whether the menu is open (accessibility)
  menuToggle.setAttribute("aria-expanded", isOpen);

  // Change the button text to match
  menuToggle.textContent = isOpen ? "Close" : "Menu";
}

// Function: close the menu
function closeMenu() {
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.textContent = "Menu";
}

// Only add the menu code if both elements exist on the page
if (menuToggle && navLinks) {

  // When the Menu button is clicked, open or close the menu
  menuToggle.addEventListener("click", toggleMenu);

  // When any link inside the menu is clicked, close the menu
  navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  // When the Escape key is pressed, close the menu
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  // If the window grows to desktop size, reset the menu
  window.addEventListener("resize", function () {
    if (window.innerWidth > 700) {
      closeMenu();
    }
  });
}


/* ---------- 3. FOOTER YEAR ----------
   Sets the year automatically so you never have to update it by hand. */
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

/* AnimeVerse homepage search */
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.querySelector("#animeverse-search");
  const searchButton = document.querySelector("#animeverse-search-btn");
  const searchMessage = document.querySelector("#animeverse-search-message");

  if (!searchInput || !searchButton || !searchMessage) return;

  function runAnimeVerseSearch() {
    const query = searchInput.value.trim().toLowerCase();

    const cards = document.querySelectorAll(
      "#blogs .card, #blogs .content-card, #content .card, #content .content-card"
    );

    if (!query) {
      searchMessage.textContent = "Type something to search for.";
      return;
    }

    let matches = 0;

    cards.forEach(function (card) {
      const text = card.textContent.toLowerCase();
      const found = text.includes(query);

      card.hidden = !found;

      if (found) matches++; 
       
       if (matches === 1) {
    card.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }
}
    });

    searchMessage.textContent = matches
      ? matches + " result(s) found."
      : "No matching content found.";
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
      document.querySelectorAll(
        "#blogs .card, #blogs .content-card, #content .card, #content .content-card"
      ).forEach(function (card) {
        card.hidden = false;
      });

      searchMessage.textContent = "";
    }
  });
});
