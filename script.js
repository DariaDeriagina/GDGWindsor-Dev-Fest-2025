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
// Reveal all hidden speaker cards on mobile
(function () {
	const btn = document.getElementById("loadMoreSpeakers");
	if (!btn) return;

	btn.addEventListener("click", function () {
		const hidden = document.querySelectorAll(
			".speaker-list-grid .is-hidden-mobile"
		);
		hidden.forEach((el) => el.classList.remove("is-hidden-mobile"));
		btn.style.display = "none"; // hide button after expanding
	});
})();
document.querySelectorAll(".btn-green, .btn-yellow").forEach((button) => {
	button.addEventListener("click", function (e) {
		const ripple = this.querySelector("::after"); // pseudo-elements not directly accessible
		// Instead, dynamically create a span ripple
		let circle = document.createElement("span");
		const rect = this.getBoundingClientRect();
		const size = Math.max(rect.width, rect.height);
		circle.style.width = circle.style.height = size + "px";
		circle.style.left = e.clientX - rect.left - size / 2 + "px";
		circle.style.top = e.clientY - rect.top - size / 2 + "px";
		circle.classList.add("ripple");
		this.appendChild(circle);

		setTimeout(() => circle.remove(), 600);
	});
});
