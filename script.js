(() => {
	"use strict";

	/* ============================ Tiny helpers ============================ */
	const $ = (sel, root = document) => root.querySelector(sel);
	const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
	const on = (el, ev, fn, opt) => el && el.addEventListener(ev, fn, opt);
	const esc = (s) =>
		String(s ?? "").replace(
			/[&<>"]/g,
			(m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m])
		);

	/* ============================ Palette ============================ */
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

	/* ============================ Navbar ============================ */
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
				if (window.innerWidth < 992 && collapse.classList.contains("show")) {
					closeWithFade();
				}
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

	/* ============================ CTA ripples ============================ */
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

	/* ============================ Session factory ============================ */
	// s(startISO, endISO, room, track, speaker, title, presenter, { img, imgs, url, desc, global })
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
		const imgs = Array.isArray(opts.imgs)
			? opts.imgs.filter(Boolean)
			: opts.img
			? [opts.img]
			: [];
		return {
			id: (crypto?.randomUUID
				? crypto.randomUUID()
				: String(Math.random())
			).replace(/[^a-z0-9-]/gi, ""),
			start: new Date(startISO),
			end: new Date(endISO),
			room,
			track,
			speaker,
			title,
			presenter,
			imgs,
			url: opts.url || "",
			desc: opts.desc || "",
			global: !!opts.global, // ← global flag for sessions that appear in every track
		};
	}

	/* ============================ Sessions ============================ */
	const sessions = [
		// Keynote (GLOBAL)
		s(
			"2025-11-08T08:45",
			"2025-11-08T09:45",
			"B14",
			"Keynote",
			"All",
			"The Celestial Mechanics of Attention Mechanisms",
			"Luis Serrano",
			{
				img: "./images/speakersImage/Speaker_LuisSerrano.png",
				desc: "The attention mechanism is the secret sauce behind the success of transformer models like ChatGPT and DeepSeek. It enables these models to dynamically focus on the most relevant parts of a text, determining which words or phrases are most important based on their contextual relationships. In this talk, we’ll explore language models through a geometric lens, imagining words as celestial bodies floating in space. The attention mechanism acts as a gravitational force, pulling these words together to form 'context galaxies' where meaning emerges. We’ll also dive into the roles of the Key, Query, and Value matrices, which serve as the cosmic tools that help extract and organize information from the text. No advanced mathematical background is required, just a willingness to think creatively about addition, subtraction, and the occasional multiplication. Join us for a journey through the universe of transformers, where words, gravity, and context collide!",
				global: true,
			}
		),

		// MARK: 10:00 block
		//Naresh Jasotani
		s(
			"2025-11-08T10:00",
			"2025-11-08T10:45",
			"104",
			"Google Cloud",
			"Naresh Jasotani",
			"To Be Announced",
			"Naresh Jasotani",
			{
				img: "./images/speakersImage/Speaker_NareshJasotani.png",
				desc: "To Be Announced",
			}
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
				desc: "Everyone’s talking about Anthropic’s new Model Context Protocol (MCP), a new standard that gives your favorite LLM access to software tools. With MCP, an LLM can send emails, make Jira tickets, or browse the web. MCP makes an LLM into an agent! We’ll explain how this works in detail, and we’ll show you how to use MCPs of your very own. Finally, we’ll build a little MCP server of our very own.",
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
				desc: "We all know how slow replies and messy communication can cost businesses their customers. In this session, I’ll walk through how Google Cloud tools—Gmail API, BigQuery, Vertex AI (Gemini), and Looker Studio—can turn customer emails into insights and instant responses. The session is designed to be practical, light, and inspiring—something attendees can take back and apply right away.",
			}
		),
		s(
			"2025-11-08T10:00",
			"2025-11-08T10:45",
			"110",
			"Cybersecurity",
			"Godfrey Nolan",
			"Taming Agentic AI: Securing Deployments in the Real World",
			"Godfrey Nolan",
			{
				img: "./images/speakersImage/Speaker_GodfreyNolan.png",
				desc: "Agentic AI systems—autonomous agents capable of making decisions and taking actions—are moving rapidly from prototypes into production environments. While their potential to transform industries is enormous, they also introduce new layers of cybersecurity risk that go beyond traditional AI deployments. How do we ensure that these agents remain trustworthy, resilient, and aligned when operating in complex, real-world conditions? ƒThis talk explores the most pressing cybersecurity risks associated with deploying Agentic AI, including data poisoning, prompt injection, supply chain vulnerabilities, and adversarial manipulation of autonomous workflows. We will also examine real-world scenarios where attackers could exploit these systems, and the consequences organizations may face if safeguards are not in place.Most importantly, the session will highlight practical mitigations and best practices that teams can adopt today. Topics will include secure model lifecycle management, monitoring and auditing autonomous behaviors, implementing guardrails and fallback mechanisms, and designing defense-in-depth strategies tailored for Agentic AI systems.Attendees will leave with a clear understanding of the evolving threat landscape, as well as actionable steps to reduce risks and increase confidence when bringing Agentic AI into production.",
			}
		),

		s(
			"2025-11-08T10:00",
			"2025-11-08T10:45",
			"B02",
			"Entrepreneurship",
			"Panel",
			"From C++ to the C-Suite: A Fireside Chat with CTO John Langlois",
			"Adam Castle & John Langlois",
			{
				imgs: [
					"./images/speakersImage/Speaker_AdamCastle.png",
					"./images/speakersImage/Speaker_JohnLanglois.png",
				],
				desc: "Join Adam Castle, Director of Venture Services and Partnerships at WEtech Alliance, for a fireside chat with local CTO John Langlois of Scelta, as we dive into his journey from developer to the c-suite.John will share his personal path in technology, and explore how he went from writing code to leading at the executive level, and what lessons he picked up along the way. We’ll explore the realities of the CTO role through his eyes: balancing strategy with execution, navigating rapid growth, and making decisions when both the technical and business stakes are high.In this conversation, John will reflect on the professional skills that helped him move beyond a purely technical role, including leadership, communication, and building strong teams. He’ll also share the habits and routines that keep him grounded under pressure, along with the technology trends he sees shaping the future of his company and the broader industry.Whether you’re a developer curious about what leadership looks like, a founder preparing to scale, or someone interested in the evolving role of technology leaders, John’s perspective offers practical insights and candid advice from someone who has walked the path, with both boots on the ground.",
			}
		),

		// MARK: 11:00 block
		s(
			"2025-11-08T11:00",
			"2025-11-08T11:45",
			"104",
			"Google Cloud",
			"Nilesh Patel",
			"The Agentic Shift: From Prompt to Action",
			"Nilesh Patel",
			{
				img: "./images/speakersImage/Speaker_NileshPatel.png",
				desc: "Welcome to The Agentic Shift—the evolution of AI from passive tools into active partners. In this new reality, we move From Prompt to Action, creating systems that don't just answer questions but get things done. This session is your practical guide to building Agentic AI with Google's powerful agentic platform and Google Cloud’s latest GenAI ecosystem. We will demystify what makes an AI Agent truly \"agentic\"—its ability to reason, use tools, and work autonomously to help users. Through a live, hands-on demonstration, you will learn how to construct a smart agent from the ground up, proving that you have the power to build the next generation of AI.",
			}
		),
		s(
			"2025-11-08T11:00",
			"2025-11-08T11:45",
			"112",
			"Build with AI",
			"Nicholas Schmidt",
			"Equity, Equality, and Equations: Using Philosophy and Ethics to Guide Algorithmic Design",
			"Nicholas Schmidt",
			{
				img: "./images/speakersImage/Speaker_NicholasSchmidt.png",
				desc: "What does it mean for an algorithm to be “fair”? If you build an algorithm that affects others in society, you alone do not get to decide…or do you?  This talk explores how concepts of equity and equality map onto the technical world of algorithmic decisioning. We discuss how you can tie these concepts to your domain expertise and your knowledge of the world to build an algorithm that not only solves your business problem but does so in the most beneficial way possible. Attendees will gain a deeper understanding of the trade-offs between equity and equality, and how to defend their metric choices — and their models — in both technical and regulatory settings.",
			}
		),
		s(
			"2025-11-08T11:00",
			"2025-11-08T11:45",
			"B14",
			"Full-Stack",
			"Salma Aly",
			"From Requests to Results: Hands-On API Testing Automation",
			"Salma Aly",
			{
				img: "./images/speakersImage/Speaker_SalmaAly.png",
				desc: "This interactive workshop will guide participants through the fundamentals and advanced techniques of automated API testing. Attendees will learn how to design, execute, and validate API tests using industry-standard tools and frameworks, with a strong emphasis on practical, hands-on experience. Topics include understanding REST and JSON payloads, structuring automated test scripts, handling authentication, verifying responses, and integrating API testing into continuous integration/continuous deployment (CI/CD) pipelines. Participants will leave with the skills to build robust, repeatable API test suites that improve software quality, accelerate release cycles, and ensure system reliability in modern, service-oriented architectures.",
			}
		),
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
				desc: "We will look at some Cyber Threats.  What does a strong Cybersecurity Strategy look like?  Share some Phishing Scams to be aware and help protect you, your data and company.  Tips and best practices to keep everyone safe",
			}
		),
		s(
			"2025-11-08T11:00",
			"2025-11-08T11:45",
			"B02",
			"Entrepreneurship",
			"Amrit Mehta",
			"Connecting Technology to Customer and Business Outcomes - Lessons from Managing Innovation in Large Corporations",
			"Amrit Mehta",
			{
				img: "./images/speakersImage/AmritMehta.jpeg",
				desc: "Successful implementation of technology requires an enterprise mindset. Leaders need to harness innovation at the intersection of customer needs, cutting edge technologies and business results. Throughout Amrit’s career at large multinationals and now within consulting, he has led R&D, technology, software product, operations and P&L teams to successfully drive transformation and innovation at start up speed. The breakout session will focus on lessons learned and key takeaways for entrepreneurs and innovators.",
			}
		),

		// MARK: 12:00 block – TWO SLOTS

		// 12:00 block — ONE COMBINED SLOT (Lunch + Fireside)
		s(
			"2025-11-08T12:00",
			"2025-11-08T12:45",
			"Commons (Lunch & Fireside)",
			"All",
			"Panel",
			"Lunch & Fireside Chat Inventing Tomorrow: A Fireside Chat on the GenAI Revolution and Why You Should Be Excited",
			"Nilesh Patel · Naresh Jasotani · Satish Venugopal · Don Ward · Aasha Khan",
			{
				// put the lunch icon first, then the panelists
				imgs: [
					"./images/speakersImage/Speaker_Lunch.png",
					"./images/speakersImage/Speaker_NileshPatel.png",
					"./images/speakersImage/Speaker_NareshJasotani.png",
					"./images/speakersImage/Speaker_SatishVenugopal.png",
					"./images/speakersImage/Speaker_DonWard.png",
					"./images/speakersImage/Speaker_AashaKhan.jpeg",
				],
				global: true,
				desc: "Happening during lunch in the Commons — grab food and join the fireside chat: GenAI is all the rage these days. Join us as we discuss GenAI solutions that excite us (and our customers) and why the GenAI future is to be embraced.",
			}
		),

		// MARK: 13:00 block
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
				desc: "Generative AI has dominated headlines, but for innovators, the critical question remains: what is the reality behind the hype? This presentation moves beyond anecdotal evidence to provide a data-driven analysis of GenAI's current and future landscape.We will anchor our discussion in Gartner's Hype Cycle to pinpoint where GenAI stands today and what to expect as it matures from inflated expectations toward true productivity. We'll then dive deep into the numbers, exploring current enterprise adoption rates, investment trends, and performance statistics that reveal how organizations are truly using—or struggling with—this technology.We will try to distill how to 'skate to where the puck is going, vs where it has been'",
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
				desc: "Tired of repetitive online tasks? Imagine a smart AI assistant that can navigate the web, fill out forms, and even buy products from sites like Amazon, all by understanding your natural language commands. This is the world of web automation, and with this talk, you'll learn how to build it yourself.We'll dive into the fundamentals of creating a powerful, open-source web agent from the ground up. You'll learn to combine the advanced reasoning of Gemini with robust browser automation to create a solution that goes beyond the capabilities of tools like the ChatGPT operator. We'll explore the core concepts behind the 'agentic loop': how an agent breaks down a complex goal, executes a plan, observes the results, and intelligently adapts to its environment.Through a practical, live-coded demonstration, we'll build an agent that can perform real-world tasks, from comparing product prices to scraping dynamic data. You'll walk away with a clear understanding of the necessary tools, the key architectural patterns, and the confidence to start building your own. Join us to unlock the future of browser automation and empower your applications with a new level of autonomy.",
			}
		),
		s(
			"2025-11-08T13:00",
			"2025-11-08T13:45",
			"B14",
			"Full-Stack",
			"Daria Deriagina",
			"Pixel Perfect Is Not Dead: How I Build UI That Matches the Figma Design",
			"Daria Deriagina",
			{
				img: "./images/speakersImage/Speaker_DashaDeriagina.png",
				desc: "What if your design looked exactly the same in the browser as it did in Figma — every pixel, every spacing, every detail?In this talk, I’ll share how I work as both a designer and a front-end developer to make that happen. I recently designed and built the Google DevFest website from scratch, and I’ll walk you through my real-world process — from designing a clean, scalable UI in Figma to implementing it with code.You’ll see how I approach structure, spacing, styles, and components with both design logic and code in mind — and how that helps avoid the usual chaos when handing off files to developers (especially when that developer is me!).I’ll also share a few of my practical rules for keeping design consistent, readable, and ready for production — whether you're working solo or in a team. This talk is especially helpful for designers who want to understand what happens after Figma, and developers who are tired of messy, unrealistic mockups.No live coding, no fluff — just honest lessons from someone who lives on both sides.",
			}
		),
		s(
			"2025-11-08T13:00",
			"2025-11-08T13:45",
			"110",
			"Cybersecurity",
			"Mina Girges",
			"AI Meets Security: Defending Against AI-Powered Threats",
			"Mina Girges",
			{
				img: "./images/speakersImage/Speaker_MinaGirges.png",
				desc: "Artificial Intelligence is transforming how we build, scale, and secure digital systems — but it’s also redefining how attackers operate. From AI-generated phishing campaigns to deepfake-driven fraud and automated exploit discovery, the threat landscape is evolving faster than ever. For developers and organizations, the challenge isn’t just adopting AI — it’s building with resilience, trust, and responsibility at the core.In this session, Mina Girges will explore the intersection of AI and cybersecurity through the lens of enterprise leadership and developer responsibility. We’ll look at how AI is being weaponized, what this means for application security and identity-first design, and how organizations can adapt their security posture without slowing down innovation. Using real-world examples and lessons drawn from global industries, Mina will share actionable strategies for securing applications, APIs, and software supply chains in an AI-driven world.Attendees will walk away with a clearer understanding of:How AI is changing the attack surface — and the mindset required to defend it.Practical steps developers can take to integrate responsible AI security practices into their workflows.The leadership perspective: aligning AI adoption, Zero Trust, and governance to protect both code and business outcomes.Whether you’re a developer, architect, or leader, this talk will equip you with the insights needed to secure the next generation of digital systems — and stay one step ahead in the age of AI-powered threats.",
			}
		),
		s(
			"2025-11-08T13:00",
			"2025-11-08T13:45",
			"B02",
			"Entrepreneurship",
			"Faris Alami",
			"Start Where You Are: Utilizing the Resilient Canvas",
			"Faris Alami",
			{
				img: "./images/speakersImage/Speaker_FarisAlami.jpeg",
				desc: "Adversity is inevitable—but failure doesn’t have to be. The businesses that not only survive but thrive in uncertain times are those that know how to assess their strengths, identify vulnerabilities, and adapt with confidence.Join us for a dynamic session designed to help you enhance your business’s resilience and prepare for whatever challenges lie ahead. Through a mix of interactive activities, expert guidance, and collaborative discussions, you’ll uncover key areas where your business may be at risk and develop practical strategies to pivot, innovate, and grow — even in the face of disruption.Leave with a comprehensive, ready-to-implement action plan that equips you to navigate uncertainty with confidence. Don’t let the unknown hold you back—invest in your business’s future and gain the tools, strategies, and mindset needed to weather any storm and seize new opportunities.Are you ready to redefine resilience?",
			}
		),

		// MARK:  14:00 block
		s(
			"2025-11-08T14:00",
			"2025-11-08T14:45",
			"104",
			"Google Cloud",
			"Glen Yu",
			"Secure your GKE cluster using eBPF tools (Tetragon)",
			"Glen Yu",
			{
				img: "./images/speakersImage/Speaker_GlenYu.png",
				desc: "Tired of sifting through endless logs after a security event? Traditional runtime security tools typically provide insights AFTER a breach has already occurred. Good security should be proactive and not reactive.  This session dives into how you can take your Google Kubernetes Engine security posture to the next level using Tetragon.We'll explore how Tetragon, an open-source security tool, leverages the power of eBPF to provide deep, real-time security observability and enforcement directly from the Linux kernel.",
			}
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
				desc: "As products—from cars to microchips—become more complex, traditional Design for Reliability (DfR) methods are no longer enough. Reliability engineers once relied on static test plans, statistical models, and decades of accumulated experience. Today, with the rise of AI, we are entering a new era: DfR 2.0, where reliability is designed continuously, adaptively, and intelligently.At the heart of this transformation is the ability to leverage vast amounts of historical test data to predict the future. Instead of running repetitive and costly experiments, AI can uncover hidden patterns, accelerate life testing, and forecast potential failures before they occur. Digital twins and machine learning models can simulate years of wear in minutes, enabling smarter design choices and faster product development.This talk will explore how AI is reshaping reliability engineering, with practical applications spanning hardware and software alike—from predictive maintenance and anomaly detection to automated test planning, software fault prediction, and reliability reporting. But success requires more than just algorithms—it demands trust, transparency, and a shift in how engineers work. It’s about building systems where developers and engineers become active co-creators alongside AI systems, shaping workflows that make both hardware and software more efficient, reliable, and future-ready.",
			}
		),
		s(
			"2025-11-08T14:00",
			"2025-11-08T14:45",
			"B14",
			"Full-Stack",
			"Joseph Youssouf",
			"Oden Forge: Agentic Copilot with MCP + Google ADK for Manufacturing",
			"Joseph Youssouf",
			{
				img: "./images/speakersImage/Speaker_JosephYoussouf.png",
				desc: "Joe Youssouf is a Data Scientist at Oden Technologies, where he develops AI-powered solutions that deliver real-time, domain-specific intelligence to manufacturing. His work includes Oden Forge, a custom-built LLM copilot created with the Model Context Protocol (MCP) and Google’s Agent Development Kit (ADK). Oden Forge transforms complex production data into actionable insights through natural language workflows, making advanced analytics accessible to process engineers and other stakeholders alike. These capabilities support tasks such as data labeling, ad-hoc exploratory data analysis, and real-time process optimization.At Google DevFest, Joe will explain how Oden Forge was developed and demonstrate example workflows that deliver measurable value for manufacturing customers. He will also share the challenges, successes, and lessons learned from integrating AI-powered solutions like Oden Forge into the manufacturing sector and beyond.",
			}
		),
		s(
			"2025-11-08T14:00",
			"2025-11-08T14:45",
			"B14",
			"Cybersecurity",
			"Troy Hector",
			"Secure your code with Scratch powered by Gemini AI",
			"Troy Hector",
			{
				img: "./images/organizers/Organizer_TroyHector.png",
				desc: "In this hands-on session, we’ll explore how to use Scratch powered by Gemini AI to spot and fix vulnerabilities in your code. Together, we’ll build a small project with intentional security issues, then walk through setting up Scratch AI, including installing the tool and generating an API key through Gemini API Studio.From there, we’ll resolve three common security issues step by step, giving you practical experience with how AI can strengthen your development workflow. Whether you’re new to security or looking to enhance your existing practices, this workshop will equip you with the knowledge and tools to write safer code with the help of AI.",
			}
		),
		s(
			"2025-11-08T14:00",
			"2025-11-08T14:45",
			"B02",
			"Entrepreneurship",
			"Wen Teoh",
			"Hack It, Build It, Launch It: Entrepreneurship for Developers",
			"Wen Teoh",
			{
				img: "./images/speakersImage/Speaker_WenTeoh.png",
				desc: "As a developer, you already have an amazing skill: you can turn an idea into something real with just your laptop. But building a cool app or project isn’t always the same as building something people will actually use—or even pay for. In this talk, we’ll explore how developers can turn side projects into startups, the common mistakes to watch out for, and why now is the perfect time to try. You’ll leave with practical tips, real examples, and maybe even the spark for your next big idea.",
			}
		),

		// MARK: 15:00 block
		// Mark Johnson
		//Andrea Yzeiri
		//Veronica Reingold

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
				desc: "This session explores the end-to-end journey of enterprise AI on Google Cloud. First, we'll dive into Vertex AI, covering the various features that can be used to build, deploy, and manage machine learning models at scale. (15 min)  Then, we'll shift our focus to the next frontier: Google Agentspace. You'll learn how this new platform is revolutionizing enterprise productivity by transforming your organization's data into a fleet of intelligent, autonomous agents that can reason, plan, and act. (15 min)",
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
				desc: "In today’s data-driven world, building ML and AI solutions that deliver lasting value requires more than implementing the latest tools. This session shares practical strategies for designing end-to-end systems that are scalable, reliable, and adaptable. Participants will learn how to make informed design decisions that reduce technical debt, prioritize high-impact solutions, and balance innovation with operational efficiency. The talk covers how to evaluate the right algorithms and architectures, integrate data effectively, and leverage strong mathematical foundations to create solutions that endure. Through real-world examples and actionable frameworks, attendees will gain insights into transforming complex projects into sustainable, high-value systems that drive real-world impact.",
			}
		),
		s(
			"2025-11-08T15:00",
			"2025-11-08T15:45",
			"B14",
			"Full-Stack",
			"Veronica Reingold ",
			"Press A for Assistance: Making Games Accessible with AI",
			"Veronica Reingold ",
			{
				img: "./images/speakersImage/Speaker_VeronicaNonikaReingold.png",
				desc: "As video games continue to evolve in complexity and scope, accessibility, approachability, and learnability are no longer niche considerations—they’re essential. In this talk, we will explore the differences between accessibility, approachability, and learnability, as well as the overlap between them. We will discuss the difficulties in developing accessible, approachable, and learnable games, why the industry lacks clear benchmarks, and the best resources and solutions for game developers. We’ll dive into some examples of modern games, the challenges they pose to players, and the current assistive techniques used in industry. Then, we’ll see how various AI techniques (including Utility AI, Goal-Oriented Action Planning, and Large Language Models) can dynamically assist players without compromising gameplay. This presentation will not only explain the concepts of accessibility, approachability, and learnability, but encourage creative thinking about how emerging technologies can make games more inclusive, intuitive, and fun for everyone.",
			}
		),
		s(
			"2025-11-08T15:00",
			"2025-11-08T15:45",
			"B02",
			"Entrepreneurship", // ← no trailing space
			"Richard Nonso & Moshood Saka",
			"Choice Between Career and Entrepreneurship",
			"Richard Nonso & Moshood Saka",
			{
				imgs: [
					"./images/speakersImage/Speaker_RichardNonso.png",
					"./images/speakersImage/Speaker_MoshoodSaka.png",
				],
				desc: "Most of us face the big question at some point: Should I get a career or start a business? We didn’t so much choose as learn to live in the messy middle, holding day jobs while building a youth-focused tech initiative that’s raised over $200,000 through grants and partnerships. In this candid co-founder talk, we’ll share how two complementary lanes, one product/ops, one strategy/partnerships guided real decisions on money, timelines, and scope; how we protected momentum and trust without sacrificing the friendship; and the moments we resized ambition, said no to distractions, and kept promises to the people we serve. No playbooks, just honest lessons, failures, and receipts from balancing a paycheck and a purpose in today’s fast-changing world.",
			}
		),
		// (Optional future Cybersecurity session for 15:00… left commented in your source)

		// MARK: 16:00 block
		//Umair Durrani
		//Kiran Puthan
		//Steven Rice
		//Safiia Mohammed
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
				desc: "For early-career data scientists, analysts, and developers, a polished online portfolio is more than a nice addition to a resume. It can be a strong advantage in attracting the attention of recruiters, collaborators, and potential clients. A personal website with a consistent look, matching presentations, and visually coherent plots can help you stand out in a competitive market. However, building this kind of professional brand from scratch can be time-consuming and challenging, especially without design experience.brandthis is an R package designed to make that process simple. It uses AI to help you create a complete personal brand directly from your R workflow. With just a few prompts, it can generate a logo, a color palette, and a _brand.yml file. These assets can then be applied automatically to a Quarto-based personal website, ggplot2 themes, and Shiny apps. The result is a cohesive visual identity that works across your projects, presentations, and applications.This talk will present two perspectives. From the user perspective, we will go through how to install brandthis, generate brand assets, set up a Quarto portfolio, and customize it to highlight your projects. From the developer perspective, we will look at how the package integrates AI to generate creative assets, how the YAML structure works, and how branding definitions are applied across R and Quarto outputs.",
			}
		),
		s(
			"2025-11-08T16:00",
			"2025-11-08T16:45",
			"112",
			"Build with AI",
			"Kiran Puthan",
			"The Agentic Leap: The New Era of AI Collaboration",
			"Kiran Puthan",
			{
				img: "./images/speakersImage/Speaker_KiranPuthan.png",
				desc: "In this talk, we'll discover what AI agents are, exploring how they are fundamentally different from traditional AI by acting as **autonomous, goal-oriented systems**. We'll also examine the future of automation and how these agents will transform the way we work by automating complex workflows and processes.",
			}
		),
		s(
			"2025-11-08T16:00",
			"2025-11-08T16:45",
			"B14",
			"Full-Stack",
			"Steven Rice",
			"Bridging AI and Robotics with Python-First Frameworks",
			"Steven Rice",
			{
				img: "./images/speakersImage/Speaker_StevenRice.png",
				desc: "For decades, robotics software has been a significant bottleneck, characterized by low-level C++, fragmented tooling, and steep learning curves reminiscent of early machine learning. Just as Python-centric ecosystems revolutionized machine learning by prioritizing accessibility and rapid iteration, a similar paradigm shift is now transforming robotics.This talk will explore the rise of a new generation of Python-first frameworks designed to bridge the gap between AI and robotics systems. These tools are not mere wrappers around legacy codebases; they are fundamentally Pythonic, offering high-level abstractions and modular architectures. We will discuss how features like seamless simulation-to-reality deployment, integrated data collection pipelines, and native Gym-style interfaces are making robotics development more intuitive for the modern ML practitioner. By embracing a development philosophy that favors simplicity and interoperability, this new approach lowers the barrier to entry, accelerates research, and empowers developers to build, test, and deploy complex autonomous systems faster than ever before. Join us to see how the future of robotics is becoming more Pythonic, paving the way for the next wave of innovation.",
			}
		),
		s(
			"2025-11-08T16:00",
			"2025-11-08T16:45",
			"110",
			"Cybersecurity",
			"Safiia Mohammed",
			"LLM Supply Chain Security: Threats, Opportunities, and Business Resilience",
			"Safiia Mohammed",
			{
				img: "./images/speakersImage/Speaker_SafiiaMohammed.png",
				desc: "As Large Language Models (LLMs) become intensely integrated in business operations, their supply chains have emerged as a critical security frontier. Unlike traditional software, LLMs rely on massive training datasets, third-party APIs, fine-tuning providers, open-source model hubs, and deployment infrastructures. Each stage introduces potential vulnerabilities. Malicious behaviours can bias outputs, compromised pre-trained models may contain hidden backdoors, and insecure API integrations expose organizations to data leakage or manipulation.However, within these threats lie opportunities. Businesses that secure their LLM supply chains can differentiate themselves by offering trustworthy, compliance-ready AI services. This aligns with regulations like the EU AI Act and Canada’s AIDA, which demand transparency in AI decision-making.Resilient organizations will view LLM supply chain security as more than risk mitigation; it is a strategic enabler. By embedding security, privacy, and accountability into AI pipelines, businesses protect customer trust, reduce liability, and unlock competitive advantage. Enterprises that can validate what their models do,and transparently explain the how, why, and origin of their intelligence,will lead the future of AI.",
			}
		),
		//Closing Celebration + Live Performance by RKease
		s(
			"2025-11-08T17:00",
			"2025-11-08T17:30",
			"104",
			"All",
			"Rashidi Kabamba",
			"Closing Celebration + Live Performance by RKease",
			"Rashidi Kabamba (RKease)",
			{
				// celebration icon first, then Rashidi’s photo
				imgs: [
					"./images/speakersImage/Speaker_Celebration.png", //
					"./images/speakersImage/Speaker_RashidiKabamba.jpg",
				],
				desc: "Join us for an epic end-of-the-day celebration.We announce the winners of the “Innovate with AI” competition.We will give away cool raffle prizes. We will close with a live performance by the one and only Rkease!", // no abstract (per your note)
				global: true, // ✅ appears in every section
			}
		),
	]; // ✅ close the sessions array

	/* ============================ Schedule UI ============================ */
	const mount = $("#scheduleMount");
	const viewBtns = $$(".view-btn");
	const trackChips = $$(".track-chip");

	let currentView = "time"; // "time" | "track"
	let currentTrack = "All";

	function initScheduleUI() {
		if (!mount) return;

		// colorize chips to match tracks
		trackChips.forEach((chip) => {
			chip.style.setProperty(
				"--chip-color",
				trackColor(chip.dataset.track || "All")
			);
		});

		// view toggles
		viewBtns.forEach((btn) =>
			on(btn, "click", () => {
				viewBtns.forEach((b) => {
					const active = b === btn;
					b.classList.toggle("is-active", active);
					b.setAttribute("aria-selected", String(active));
				});
				currentView = btn.dataset.view || "time";
				render();
				syncMobileFilterTheme();
			})
		);

		// track chips
		trackChips.forEach((chip) =>
			on(chip, "click", () => {
				trackChips.forEach((c) => c.classList.toggle("is-active", c === chip));
				currentTrack = chip.dataset.track || "All";
				render();
				syncMobileFilterTheme();
			})
		);

		// mobile: tap to expand
		on(mount, "click", (e) => {
			if (!window.matchMedia("(hover: none)").matches) return;
			const slot = e.target.closest(".slot");
			if (!slot) return;
			const open = slot.classList.toggle("is-open");
			slot.setAttribute("aria-expanded", String(open));
		});

		render();
		syncMobileFilterTheme();
	}

	function render() {
		const base =
			currentTrack === "All"
				? sessions.slice()
				: sessions.filter((s) => s.track === currentTrack || s.global); // include globals on any track

		// ⬇️ When viewing BY TRACK, exclude Keynote entirely (so it won't be grouped or merged as a global)
		const list =
			currentView === "track"
				? base.filter((s) => s.track !== "Keynote")
				: base;

		if (currentView === "time") {
			renderByTime(list);
		} else {
			renderByTrack(list);
		}
	}

	/* ============================ Render helpers ============================ */
	function renderSpeakerImgs(it, size = 64) {
		const sources = (
			Array.isArray(it.imgs) && it.imgs.length ? it.imgs : [PLACEHOLDER_IMG]
		).slice(0, 6);
		if (sources.length === 1) {
			return `<img src="${esc(sources[0])}" alt="${esc(
				it.presenter || it.speaker || it.title
			)}" width="${size}" height="${size}" loading="lazy">`;
		}
		return sources
			.map(
				(src) =>
					`<img src="${esc(src)}" alt="${esc(
						it.presenter || it.speaker || it.title
					)}" width="${size}" height="${size}" loading="lazy">`
			)
			.join("");
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
              <div class="slot-media">${renderSpeakerImgs(it, 64)}</div>
              <div class="slot-body">
                <h4>${esc(it.title || "")}</h4>
                <div class="slot-meta">
                  ${esc(it.presenter || it.speaker || "")}
                  • <span class="room-badge badge" style="color:#000">Room ${esc(
										it.room
									)}</span>
                </div>
                <div class="slot-badges">
                  <span class="badge" style="color:#000">${esc(it.track)}</span>
                  ${
										it.global
											? `<span class="badge is-global" aria-label="Global session">Global</span>`
											: ``
									}
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
		// Take globals from the master list so they exist even if filtered out above,
		// but never bring back Keynote.
		const globals = sessions.filter((s) => s.global && s.track !== "Keynote");

		// IMPORTANT: do not create a group for "All"
		const trackItems = list.filter((s) => s.track !== "All");

		const byT = groupBy(
			trackItems.slice().sort(by((s) => s.start)),
			(s) => s.track
		);

		let html = ``;
		for (const [track, items] of byT) {
			const color = trackColor(track);

			// merge globals once per track, no dupes
			const merged = items
				.concat(globals.filter((g) => !items.some((i) => i.id === g.id)))
				.sort(by((s) => s.start));

			html += `<h3 class="group-heading">${esc(track)}</h3>`;
			merged.forEach((it) => {
				html += `
        <article class="slot" style="--track-color:${color}">
          <div class="slot-media">${renderSpeakerImgs(it, 64)}</div>
          <div class="slot-body">
            <div class="slot-time">${fmtTime(it.start)} – ${fmtTime(
					it.end
				)}</div>
            <h4>${esc(it.title || "")}</h4>
            <div class="slot-meta">
              ${esc(it.presenter || it.speaker || "")}
              • <span class="room-badge badge" style="color:#000">Room ${esc(
								it.room
							)}</span>
            </div>
            <div class="slot-badges">
              <span class="badge" style="color:#000">${esc(it.track)}</span>
              ${
								it.global
									? `<span class="badge is-global" aria-label="Global session">Global</span>`
									: ``
							}
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

	function detailsBlock(desc, url) {
		return `
      <details class="slot-more">
        <summary>Read the abstract</summary>
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
		)}" target="_blank" rel="noopener">Read the abstract →</a></div>`;
	}

	function paragraphize(text) {
		const safe = esc(text || "");
		return safe
			.trim()
			.split(/\n\s*\n/g)
			.map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`)
			.join("");
	}

	/* ============================ Utils ============================ */
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
		const text = encodeURIComponent(it.title || "");
		const details = encodeURIComponent(
			`${it.presenter || it.speaker || ""} • Track: ${it.track}`
		);
		const location = encodeURIComponent(
			`Room ${it.room}, Odette School of Business, Windsor, Ontario`
		);
		const dates = `${toICSDate(it.start)}/${toICSDate(it.end)}`;
		return `${base}&text=${text}&details=${details}&location=${location}&dates=${dates}`;
	}

	/* ======================= Mobile filter theming ======================= */
	function syncMobileFilterTheme() {
		const select = document.getElementById("mobileTrackFilter");
		if (!select) return;
		const c = trackColor(currentTrack);
		select.style.setProperty("--select-track-color", c);
	}

	/* ============================ Boot ============================ */
	document.addEventListener("DOMContentLoaded", () => {
		if (typeof initNavbar === "function") initNavbar();
		if (typeof initLoadMoreSpeakers === "function") initLoadMoreSpeakers();
		if (typeof initRipples === "function") initRipples();
		initScheduleUI();
	});
})();

/* ===== MOBILE FILTER: keep <select> and chips in sync ===== */
(() => {
	const select = document.getElementById("mobileTrackFilter");

	// MOBILE → DESKTOP
	if (select) {
		select.addEventListener("change", () => {
			const val = select.value;
			const chip = document.querySelector(`.track-chip[data-track="${val}"]`);
			chip?.click();
		});
	}

	// DESKTOP → MOBILE
	const chips = document.querySelectorAll(".track-chip");
	if (chips.length && select) {
		chips.forEach((chip) => {
			chip.addEventListener("click", () => {
				const val = chip.getAttribute("data-track");
				if (val) select.value = val;
			});
		});
	}
})();

//MARK: Modal window
document.querySelectorAll(".btn-bio").forEach((btn) => {
	btn.addEventListener("click", (e) => {
		const card = e.target.closest(".person-card");
		const name = card.querySelector(".person-name").textContent;
		const role = card.querySelector(".person-role").textContent;
		const meta = card.querySelector(".person-meta").textContent;
		const img = card.querySelector(".person-photo").src;
		const bio = card.dataset.bio;

		// fill modal
		document.querySelector("#modal-name").textContent = name;
		document.querySelector("#modal-role").textContent = role;
		document.querySelector("#modal-meta").textContent = meta;
		document.querySelector("#modal-img").src = img;
		document.querySelector("#modal-bio").textContent = bio;

		document.querySelector("#speakerModal").classList.add("open");
	});
});
// Close modal on X or backdrop click
document.querySelector(".modal-close").addEventListener("click", () => {
	document.querySelector("#speakerModal").classList.remove("open");
});

document.querySelector("#speakerModal").addEventListener("click", (e) => {
	if (e.target.classList.contains("modal")) {
		e.target.classList.remove("open");
	}
});
let __scrollY = 0;

function openModal() {
	const modal = document.getElementById("speakerModal");
	if (!modal) return;
	__scrollY = window.scrollY || document.documentElement.scrollTop || 0;
	document.body.style.top = `-${__scrollY}px`;
	document.body.classList.add("modal-open"); // CSS below uses this
	modal.classList.add("open");
}

function closeModal() {
	const modal = document.getElementById("speakerModal");
	if (!modal) return;
	modal.classList.remove("open");
	document.body.classList.remove("modal-open");
	document.body.style.top = "";
	window.scrollTo(0, __scrollY);
}

//  MARK: One modal handler for all cards that have .btn-bio
document.addEventListener("click", (e) => {
	const btn = e.target.closest(".btn-bio");
	if (!btn) return;

	const card = btn.closest(".person-card, .org-card"); // works for both
	if (!card) return;

	// Pull data
	const name =
		card.querySelector(".person-name, .org-name")?.textContent?.trim() || "";
	const role =
		card.querySelector(".person-role, .org-affil")?.textContent?.trim() || "";
	const img = card.querySelector("img")?.getAttribute("src") || "";
	const bio = card.getAttribute("data-bio") || "Bio coming soon.";

	// Fill your existing modal elements
	const modal = document.querySelector(".bio-modal");
	modal.querySelector(".bio-modal__name").textContent = name;
	modal.querySelector(".bio-modal__role").textContent = role;
	modal.querySelector(".bio-modal__photo").src = img;

	const body = modal.querySelector(".bio-modal__body");
	body.innerHTML = `<p>${bio}</p>`;

	modal.classList.add("is-open");
});

// Close modal actions (if not already present)
document.addEventListener("click", (e) => {
	if (e.target.matches(".bio-modal__close, .bio-modal__backdrop")) {
		document.querySelector(".bio-modal")?.classList.remove("is-open");
	}
});
// ========== MARK: ONE modal handler for ALL cards ==========
(() => {
	// Open on any "See bio" click
	document.addEventListener("click", (e) => {
		const btn = e.target.closest(".btn-bio");
		if (!btn) return;

		// Works for speakers (.person-card), organizers (.org-card), facilitators (.facilitator-card)
		const card = btn.closest(".person-card, .org-card, .facilitator-card");
		if (!card) return;

		// Pull data safely across variants
		const name =
			card.querySelector(".person-name, .org-name")?.textContent?.trim() || "";
		const role =
			card.querySelector(".person-role, .org-affil")?.textContent?.trim() || "";
		const meta =
			card.querySelector(".person-meta, .org-meta")?.textContent?.trim() || "";
		const imgEl = card.querySelector(".person-photo, .org-avatar-large, img");
		const img = imgEl?.getAttribute("src") || "";
		const bio = card.getAttribute("data-bio") || "Bio coming soon.";

		// Fill your existing #speakerModal
		const modal = document.getElementById("speakerModal");
		if (!modal) return;

		modal.querySelector("#modal-name").textContent = name;
		modal.querySelector("#modal-role").textContent = role;
		modal.querySelector("#modal-meta").textContent = meta;
		modal.querySelector("#modal-img").src = img;
		modal.querySelector("#modal-bio").textContent = bio;

		modal.classList.add("open");
	});

	// Close on X
	document.querySelector(".modal-close")?.addEventListener("click", () => {
		document.getElementById("speakerModal")?.classList.remove("open");
	});

	// Close on backdrop click
	document.getElementById("speakerModal")?.addEventListener("click", (e) => {
		if (e.target.id === "speakerModal") {
			e.target.classList.remove("open");
		}
	});
})();
