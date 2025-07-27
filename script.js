document.addEventListener("DOMContentLoaded", () => {
	// === Select Bootstrap toggler and nav container ===
	const navbarToggler = document.querySelector(".navbar-toggler");
	const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
	const navbarCollapse = document.querySelector(".navbar-collapse");

	navLinks.forEach((link) => {
		link.addEventListener("click", function () {
			// remove active from all
			navLinks.forEach((l) => l.classList.remove("active"));
			// add active to the clicked one
			this.classList.add("active");
		});
	});

	// === Close menu when any nav link is clicked ===
	navLinks.forEach((link) => {
		link.addEventListener("click", () => {
			if (navbarToggler.getAttribute("aria-expanded") === "true") {
				closeNavbar();
			}
		});
	});

	// === Close menu on scroll (only on mobile) ===
	window.addEventListener("scroll", () => {
		if (window.innerWidth < 992 && navbarCollapse.classList.contains("show")) {
			closeNavbar();
		}
	});

	// === Helper function for clean closing with fade effect ===
	function closeNavbar() {
		navbarCollapse.classList.add("fade-out");

		// Wait for fade animation to end, then fully close
		setTimeout(() => {
			navbarToggler.click(); // triggers Bootstrap’s collapse
			navbarCollapse.classList.remove("fade-out");
		}, 200); // 200ms matches CSS animation speed
	}
});
