(() => {
	"use strict";

	/* ============== Tiny helpers ============== */
	const $ = (sel, root = document) => root.querySelector(sel);
	const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
	const on = (el, ev, fn, opt) => el && el.addEventListener(ev, fn, opt);
	const esc = (s) =>
		String(s ?? "").replace(
			/[&<>"]/g,
			(m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m])
		);

	/* ============== Palette (single source of truth) ============== */
	const TRACK_COLORS = {
		"Google Cloud": "#BDE9F4",
		"Build with AI": "#C3DFC4",
		"Full-Stack": "#D0C4F6",
		Cybersecurity: "#F6D2D2",
		Entrepreneurship: "#FFE2A0",
		"High School": "#FAE8C8",
		Keynote: "#FAE8C8",
		All: "#EBEBEB",
	};
	const trackColor = (name) => TRACK_COLORS[name] || TRACK_COLORS.All;
	const PLACEHOLDER_IMG = "./images/speakersImage/placeholder.png";

	/* ============== Navbar: active + graceful close (mobile) ============== */
	function initNavbar() {
		const toggler = $(".navbar-toggler");
		const collapse = $(".navbar-collapse");
		const links = $$(".navbar-nav .nav-link");
		if (!toggler || !collapse) return;

		links.forEach((link) =>
			on(link, "click", () => {
				links.forEach((l) => l.classList.remove("active"));
				link.classList.add("active");
				if (toggler.getAttribute("aria-expanded") === "true") closeWithFade();
			})
		);

		on(
			window,
			"scroll",
			() => {
				if (window.innerWidth < 992 && collapse.classList.contains("show"))
					closeWithFade();
			},
			{ passive: true }
		);

		function closeWithFade() {
			collapse.classList.add("fade-out");
			setTimeout(() => {
				toggler.click();
				collapse.classList.remove("fade-out");
			}, 200);
		}
	}

	/* ============== Ripple for CTAs (respects reduced motion) ============== */
	function initRipples() {
		const reduced = window.matchMedia(
			"(prefers-reduced-motion: reduce)"
		).matches;
		$$(".btn-green, .btn-yellow").forEach((btn) => {
			btn.style.position ||= "relative";
			btn.style.overflow = "hidden";
			on(btn, "pointerdown", (e) => {
				if (reduced) return;
				const r = btn.getBoundingClientRect();
				const size = Math.max(r.width, r.height);
				const ripple = document.createElement("span");
				ripple.className = "ripple";
				ripple.style.width = ripple.style.height = `${size}px`;
				ripple.style.left = `${e.clientX - r.left - size / 2}px`;
				ripple.style.top = `${e.clientY - r.top - size / 2}px`;
				btn.appendChild(ripple);
				ripple.addEventListener("animationend", () => ripple.remove(), {
					once: true,
				});
			});
		});
	}

	/* ============== Session factory ============== */
	// s(startISO, endISO, room, track, speaker, title, presenter, {img, url, desc})
	function s(
		startISO,
		endISO,
		room,
		track,
		speaker,
		title,
		presenter,
		opts = {}
	) {
		return {
			id: crypto.randomUUID(),
			start: new Date(startISO),
			end: new Date(endISO),
			room,
			track,
			speaker,
			title,
			presenter,
			img: opts.img || "",
			url: opts.url || "",
			desc: opts.desc || "",
		};
	}

	/* ============== Schedule data (with full desc support) ============== */
	const sessions = [
		s(
			"2025-11-08T08:45",
			"2025-11-08T09:45",
			"B14",
			"Keynote",
			"All",
			"Welcoming and Keynote – Luis Serrano",
			"Luis Serrano",
			{ img: "./images/speakersImage/Speaker_LuisSerrano.png" }
		),

		s(
			"2025-11-08T10:00",
			"2025-11-08T10:45",
			"104",
			"Google Cloud",
			"Naresh Jasotani",
			"Google Cloud Foundations",
			"Naresh Jasotani",
			{ img: "./images/speakersImage/Speaker_NareshJasotani.png" }
		),
		s(
			"2025-11-08T10:00",
			"2025-11-08T10:45",
			"112",
			"Build with AI",
			"Ben Morss",
			"MCP demystified: how your LLM can do things in the real world",
			"Ben Morss",
			{
				img: "./images/speakersImage/Speaker_BenMorss.png",
				desc: "Everyone’s talking about Anthropic’s Model Context Protocol (MCP). We’ll explain what it is, how it lets LLMs act by using tools, and build a tiny MCP server together.",
			}
		),
		s(
			"2025-11-08T10:00",
			"2025-11-08T10:45",
			"B14",
			"Full-Stack",
			"Raneem Ghalion",
			"From Emails to Insights: Automating Customer Service with Google Cloud & AI",
			"Raneem Ghalion",
			{
				img: "./images/speakersImage/Speaker_RaneemGhalion.png",
				desc: "Turn messy customer emails into insights and instant responses with Gmail API, BigQuery, Vertex AI (Gemini), and Looker Studio. A practical, lightweight workflow you can apply immediately.",
			}
		),
		s(
			"2025-11-08T10:00",
			"2025-11-08T10:45",
			"110",
			"Full-Stack",
			"Godfrey Nolan",
			"Mobile + GenAI Patterns",
			"Godfrey Nolan",
			{ img: "./images/speakersImage/Speaker_GodfreyNolan.png" }
		),
		// Entrepreneurship (B02)
		s(
			"2025-11-08T10:00",
			"2025-11-08T10:45",
			"B02",
			"Entrepreneurship",
			"Panel",
			"From C++ to the C-Suite: A Fireside Chat with CTO John Langlois",
			"Adam Castle & John Langlois",
			{
				img: "./images/speakersImage/Speaker_AdamCastle.png",
				desc: "Adam Castle interviews CTO John Langlois on the path from developer to executive leadership—balancing strategy with execution, building teams, and the habits that keep leaders effective.",
			}
		),

		s(
			"2025-11-08T11:00",
			"2025-11-08T11:45",
			"104",
			"Google Cloud",
			"Nilesh Patel",
			"AI on GCP – Hands on",
			"Nilesh Patel",
			{ img: "./images/speakersImage/Speaker_NileshPatel.png" }
		),
		s(
			"2025-11-08T11:00",
			"2025-11-08T11:45",
			"112",
			"Build with AI",
			"Nicholas Schmidt",
			"Responsible AI in the Wild",
			"Nicholas Schmidt",
			{ img: "./images/speakersImage/Speaker_NicholasSchmidt.png" }
		),
		s(
			"2025-11-08T11:00",
			"2025-11-08T11:45",
			"B14",
			"Entrepreneurship",
			"Salma Aly",
			"From Requests to Results: Hands-On API Testing Automation",
			"Salma Aly",
			{
				img: "./images/speakersImage/Speaker_SalmaAly.png",
				desc: "Design, execute, and validate API tests with modern tools. We’ll cover REST, JSON payloads, auth, assertions, and how to wire testing into CI/CD so releases are faster and safer.",
			}
		),
		// Cybersecurity
		s(
			"2025-11-08T11:00",
			"2025-11-08T11:45",
			"110",
			"Cybersecurity",
			"Frank Abbruzzese",
			"What’s Your Cybersecurity Strategy?",
			"Frank Abbruzzese",
			{
				img: "./images/speakersImage/Speaker_FrankAbbruzzese.png",
				desc: "What strong cybersecurity looks like in 2025: current threats, phishing gotchas, and practical practices to protect people, data, and companies.",
			}
		),

		s(
			"2025-11-08T12:00",
			"2025-11-08T12:45",
			"Commons",
			"All",
			"Lunch Break – Fireside Chat",
			"Fireside",
			{
				desc: "Inventing Tomorrow: A GenAI fireside with Nilesh Patel, Naresh Jasotani, Satish Venugopal, and Don Ward. GenAI solutions that excite us (and customers) and why the future is something to embrace.",
			}
		),

		s(
			"2025-11-08T13:00",
			"2025-11-08T13:45",
			"104",
			"Google Cloud",
			"Don Ward",
			"GenAI by the Numbers: Signal from the Noise",
			"Don Ward",
			{
				img: "./images/speakersImage/Speaker_DonWard.png",
				desc: "Past the hype: where GenAI sits on the Hype Cycle, real adoption, investment and performance stats, and how to “skate to where the puck is going.”",
			}
		),
		s(
			"2025-11-08T13:00",
			"2025-11-08T13:45",
			"112",
			"Build with AI",
			"Keval Patel",
			"Building Your Own AI Assistant: Web Automation with Gemini",
			"Keval Patel",
			{
				img: "./images/speakersImage/Speaker_KevalPatel.png",
				desc: "Live-coded demo of an open-source web agent that navigates sites, fills forms, compares prices, and scrapes dynamic data using Gemini + browser automation and a robust agentic loop.",
			}
		),
		s(
			"2025-11-08T13:00",
			"2025-11-08T13:45",
			"B14",
			"Entrepreneurship",
			"TBD",
			"Troy ?",
			"TBD"
		),
		s(
			"2025-11-08T13:00",
			"2025-11-08T13:45",
			"110",
			"Full-Stack",
			"Mina Girges",
			"Healthcare + AI",
			"Mina Girges",
			{ img: "./images/speakersImage/Speaker_MinaGirges.png" }
		),

		s(
			"2025-11-08T14:00",
			"2025-11-08T14:45",
			"104",
			"Google Cloud",
			"Satish Venugopal",
			"Modern Cloud Patterns",
			"Satish Venugopal",
			{ img: "./images/speakersImage/Speaker_SatishVenugopal.png" }
		),
		s(
			"2025-11-08T14:00",
			"2025-11-08T14:45",
			"112",
			"Build with AI",
			"Ahmed Abou Gharam",
			"Design for Reliability 2.0: How AI is Transforming DfR",
			"Ahmed Abou Gharam",
			{
				img: "./images/speakersImage/Speaker_AhmedAbouGharam.png",
				desc: "DfR 2.0: using historical test data, ML, and digital twins to predict failures, accelerate life testing, and design reliability continuously—with the trust and workflows teams need.",
			}
		),
		s(
			"2025-11-08T14:00",
			"2025-11-08T14:45",
			"B14",
			"Full-Stack",
			"Daria Deriagina",
			"Pixel Perfect Is Not Dead: How I Build UI That Matches the Figma Design",
			"Daria Deriagina",
			{
				img: "./images/speakersImage/Speaker_DashaDeriagina.png",
				// Put your full long abstract here; it's rendered entirely
				desc: "What if your design looked exactly the same in the browser as it did in Figma — every pixel, every spacing, every detail?In this talk, I’ll share how I work as both a designer and a front-end developer to make that happen. I recently designed and built the Google DevFest website from scratch, and I’ll walk you through my real-world process — from designing a clean, scalable UI in Figma to implementing it with code.You’ll see how I approach structure, spacing, styles, and components with both design logic and code in mind — and how that helps avoid the usual chaos when handing off files to developers (especially when that developer is me!).I’ll also share a few of my practical rules for keeping design consistent, readable, and ready for production — whether you're working solo or in a team. This talk is especially helpful for designers who want to understand what happens after Figma, and developers who are tired of messy, unrealistic mockups.No live coding, no fluff — just honest lessons from someone who lives on both sides.",
			}
		),
		// Cybersecurity
		s(
			"2025-11-08T14:00",
			"2025-11-08T14:45",
			"110",
			"Cybersecurity",
			"Glen Yu",
			"Secure your GKE cluster using eBPF tools (Tetragon)",
			"Glen Yu",
			{
				img: "./images/speakersImage/Speaker_GlenYu.png",
				desc: "Move from reactive to proactive runtime security on GKE. Use Tetragon + eBPF for deep, real-time observability and enforcement directly from the kernel—beyond perimeter security.",
			}
		),

		s(
			"2025-11-08T15:00",
			"2025-11-08T15:45",
			"104",
			"Google Cloud",
			"Mark Johnson",
			"From Models to Agents: Building the Future of Enterprise AI with Google Cloud",
			"Mark Johnson",
			{
				img: "./images/speakersImage/Speaker_MarkJohnson.png",
				desc: "Part 1: Vertex AI at scale. Part 2: Google Agentspace—turn org data into intelligent agents that reason, plan, and act.",
			}
		),
		s(
			"2025-11-08T15:00",
			"2025-11-08T15:45",
			"112",
			"Build with AI",
			"Andrea Yzeiri",
			"Continuity by Design: Scalable ML/AI Systems for Longevity",
			"Andrea Yzeiri",
			{
				img: "./images/speakersImage/Speaker_AndreaIrinaYzeiri.png",
				desc: "Design end-to-end systems that last: reduce tech debt, pick high-impact solutions, integrate data well, and lean on strong math to turn complex projects into durable, valuable systems.",
			}
		),
		s(
			"2025-11-08T15:00",
			"2025-11-08T15:45",
			"B14",
			"Full-Stack",
			"Joseph Youssouf",
			"Oden Forge: Agentic Copilot with MCP + Google ADK for Manufacturing",
			"Joseph Youssouf",
			{
				img: "./images/speakersImage/Speaker_JosephYoussouf.png",
				desc: "Inside Oden Forge—a custom LLM copilot built with MCP + Google ADK. Natural-language workflows for labeling, ad-hoc EDA, and real-time optimization; challenges, wins, and lessons for industrial AI.",
			}
		),
		s(
			"2025-11-08T15:00",
			"2025-11-08T15:45",
			"110",
			"Full-Stack",
			"Noah Campbell?",
			"TBD",
			"Noah Campbell?"
		),

		s(
			"2025-11-08T16:00",
			"2025-11-08T16:45",
			"104",
			"Google Cloud",
			"Umair Durrani",
			"brandthis: Build your personal brand & portfolio websites with LLMs",
			"Umair Durrani",
			{
				img: "./images/speakersImage/Speaker_UmairDurrani.png",
				desc: "An R package that uses AI to generate a logo, palette, and brand.yml—then applies them across a Quarto website, ggplot2, and Shiny for a cohesive personal brand. User + developer perspectives.",
			}
		),
		s(
			"2025-11-08T16:00",
			"2025-11-08T16:45",
			"112",
			"Build with AI",
			"Kiran Puthan",
			"Solutions at Scale",
			"Kiran Puthan",
			{ img: "./images/speakersImage/Speaker_KiranPuthan.png" }
		),
		s(
			"2025-11-08T16:00",
			"2025-11-08T16:45",
			"B14",
			"Entrepreneurship",
			"Steven Rice",
			"Academic AI Research",
			"Steven Rice",
			{ img: "./images/speakersImage/Speaker_StevenRice.png" }
		),
		s(
			"2025-11-08T16:00",
			"2025-11-08T16:45",
			"110",
			"Full-Stack",
			"Safia Mohammed",
			"Applied NLP",
			"Safia Mohammed",
			{ img: "./images/speakersImage/Speaker_SafiaMohammed.png" }
		),

		s(
			"2025-11-08T17:00",
			"2025-11-08T17:30",
			"Commons",
			"All",
			"Closing Remarks & Wrap-up",
			"Team",
			"—"
		),
	];

	/* ============== Schedule UI ============== */
	const mount = $("#scheduleMount");
	const viewBtns = $$(".view-btn");
	const trackChips = $$(".track-chip");

	let currentView = "time";
	let currentTrack = "All";

	function initScheduleUI() {
		if (!mount) return;

		// colorize chips to match tracks
		trackChips.forEach((chip) =>
			chip.style.setProperty(
				"--chip-color",
				trackColor(chip.dataset.track || "All")
			)
		);

		viewBtns.forEach((btn) =>
			on(btn, "click", () => {
				viewBtns.forEach((b) => {
					b.classList.toggle("is-active", b === btn);
					b.setAttribute("aria-selected", b === btn);
				});
				currentView = btn.dataset.view || "time";
				render();
			})
		);

		trackChips.forEach((chip) =>
			on(chip, "click", () => {
				trackChips.forEach((c) => c.classList.toggle("is-active", c === chip));
				currentTrack = chip.dataset.track || "All";
				render();
			})
		);

		// mobile: tap to expand inline details (no popups)
		on(mount, "click", (e) => {
			if (!window.matchMedia("(hover: none)").matches) return;
			const slot = e.target.closest(".slot");
			if (!slot) return;
			slot.classList.toggle("is-open");
			slot.setAttribute(
				"aria-expanded",
				slot.classList.contains("is-open") ? "true" : "false"
			);
		});

		render();
	}

	function render() {
		const data =
			currentTrack === "All"
				? sessions
				: sessions.filter((s) => s.track === currentTrack);
		currentView === "time" ? renderByTime(data) : renderByTrack(data);
	}

	function renderByTime(list) {
		const byStart = groupBy(
			list.slice().sort(by((x) => x.start)),
			(s) => `${fmtTime(s.start)} – ${fmtTime(s.end)}`
		);

		let html = `<div class="time-grid">`;
		for (const [slot, items] of byStart) {
			items.sort(by((s) => s.room));
			items.forEach((it, i) => {
				const color = trackColor(it.track);
				html += `
        <div class="time-row">
          ${
						i === 0
							? `<div class="slot-time">${slot}</div>`
							: `<div class="slot-time"></div>`
					}
          <article class="slot" style="--track-color:${color}">
            <div class="slot-media">
              <img src="${esc(it.img || PLACEHOLDER_IMG)}" alt="${esc(
					it.presenter
				)}">
            </div>
            <div class="slot-body">
              <h4>${esc(it.title)}</h4>
              <div class="slot-meta">
                ${esc(
									it.presenter
								)} • <span class="room-badge badge" style="color:#000">Room ${esc(
					it.room
				)}</span>
              </div>
              <div class="slot-badges">
                <span class="badge" style="color:#000">${esc(it.track)}</span>
                <a class="add-to-cal" href="${gcalLink(
									it
								)}" target="_blank" rel="noopener">Add to Calendar</a>
              </div>
              ${
								it.desc
									? detailsBlock(it.desc, it.url)
									: it.url
									? rawLink(it.url)
									: ""
							}
            </div>
          </article>
        </div>`;
			});
		}
		html += `</div>`;
		mount.innerHTML = html;
	}

	function renderByTrack(list) {
		const byT = groupBy(list.slice().sort(by((s) => s.start)), (s) => s.track);
		let html = ``;
		for (const [track, items] of byT) {
			const color = trackColor(track);
			html += `<h3 class="group-heading">${esc(track)}</h3>`;
			items.forEach((it) => {
				html += `
        <article class="slot" style="--track-color:${color}">
          <div class="slot-media">
            <img src="${esc(it.img || PLACEHOLDER_IMG)}" alt="${esc(
					it.presenter
				)}">
          </div>
          <div class="slot-body">
            <div class="slot-time">${fmtTime(it.start)} – ${fmtTime(
					it.end
				)}</div>
            <h4>${esc(it.title)}</h4>
            <div class="slot-meta">
              ${esc(
								it.presenter
							)} • <span class="room-badge badge" style="color:#000">Room ${esc(
					it.room
				)}</span>
            </div>
            <div class="slot-badges">
              <span class="badge" style="color:#000">${esc(it.room)}</span>
              <a class="add-to-cal" href="${gcalLink(
								it
							)}" target="_blank" rel="noopener">Add to Calendar</a>
            </div>
            ${
							it.desc
								? detailsBlock(it.desc, it.url)
								: it.url
								? rawLink(it.url)
								: ""
						}
          </div>
        </article>`;
			});
		}
		mount.innerHTML = html;
	}

	/* ============== Render helpers ============== */
	function detailsBlock(desc, url) {
		return `
      <details class="slot-more">
        <summary>Find out more →</summary>
        <div class="slot-desc">${paragraphize(desc)}</div>
        ${
					url
						? `<div class="slot-readmore"><a href="${esc(
								url
						  )}" target="_blank" rel="noopener">Open session page ↗</a></div>`
						: ``
				}
      </details>`;
	}
	function rawLink(url) {
		return `<div class="slot-readmore"><a class="slot-more-link" href="${esc(
			url
		)}" target="_blank" rel="noopener">Find out more →</a></div>`;
	}
	function paragraphize(text) {
		const safe = esc(text || "");
		return safe
			.trim()
			.split(/\n\s*\n/g)
			.map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`)
			.join("");
	}

	/* ============== Utils ============== */
	function by(sel) {
		return (a, b) => (sel(a) > sel(b) ? 1 : -1);
	}
	function groupBy(arr, keyFn) {
		const m = new Map();
		for (const it of arr) {
			const k = keyFn(it);
			if (!m.has(k)) m.set(k, []);
			m.get(k).push(it);
		}
		return m;
	}
	function fmtTime(d) {
		return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
	}
	function toICSDate(d) {
		const pad = (n) => String(n).padStart(2, "0");
		return (
			d.getUTCFullYear() +
			pad(d.getUTCMonth() + 1) +
			pad(d.getUTCDate()) +
			"T" +
			pad(d.getUTCHours()) +
			pad(d.getUTCMinutes()) +
			"00Z"
		);
	}
	function gcalLink(it) {
		const base = "https://calendar.google.com/calendar/render?action=TEMPLATE";
		const text = encodeURIComponent(it.title);
		const details = encodeURIComponent(`${it.presenter} • Track: ${it.track}`);
		const location = encodeURIComponent(
			`Room ${it.room}, Odette School of Business, Windsor, Ontario`
		);
		const dates = `${toICSDate(it.start)}/${toICSDate(it.end)}`;
		return `${base}&text=${text}&details=${details}&location=${location}&dates=${dates}`;
	}

	/* ============== Boot ============== */
	document.addEventListener("DOMContentLoaded", () => {
		if (typeof initNavbar === "function") initNavbar();
		if (typeof initLoadMoreSpeakers === "function") initLoadMoreSpeakers();
		if (typeof initRipples === "function") initRipples();
		initScheduleUI();
	});
})();
