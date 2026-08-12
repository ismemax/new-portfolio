// --- Scroll Animations Logic (Moved to top to guarantee execution) ---
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const fadeObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-in-up').forEach(el => {
  fadeObserver.observe(el);
});

// Immediately show everything just in case there's a fatal error later, 
// using a window error listener as a fail-safe.
window.addEventListener('error', () => {
  document.querySelectorAll('.fade-in-up').forEach(el => {
    el.classList.add('active');
  });
});

const $portfolioContent = await fetch('../config/content.json').then(res => res.json());
const { profile, projects, projectLinks, certifications } = $portfolioContent;
const categories = [
  "All",
  "Game Dev",
  "Backend & APIs",
  "IoT / Hardware",
  "Full Stack",
];
let activeCategory = "All",
  activeTag = "",
  query = "";
document.title = `${profile.name} - ${profile.role} Portfolio`;
document.querySelector(".logo").textContent = profile.shortName;
document.querySelector(".hero .eyebrow").innerHTML =
  `<i></i>${profile.availability}`;
document.querySelector(".hero-intro").textContent = profile.intro;
document.querySelector(".about p:not(.eyebrow)").textContent = profile.about;
document.querySelector("footer span").textContent =
  `© ${profile.copyrightYear} ${profile.name}`;
document.querySelector("footer span:last-child").innerHTML =
  `<a href="${profile.socials.github}" target="_blank" rel="noreferrer">GitHub ↗</a> &nbsp; <a href="${profile.socials.linkedin}" target="_blank" rel="noreferrer">LinkedIn ↗</a>`;
document.querySelector(".stats div:nth-child(3) strong").textContent =
  profile.startYear;
if (document.querySelector("#navResume")) {
  document.querySelector("#navResume").href = profile.resume;
}
if (document.querySelector("#aboutResume")) {
  document.querySelector("#aboutResume").href = profile.resume;
}
if (document.querySelector("#stats-projects-count")) {
  document.querySelector("#stats-projects-count").textContent = projects.length;
}
const grid = document.querySelector("#projectGrid"),
  filters = document.querySelector("#filters"),
  search = document.querySelector("#search"),
  empty = document.querySelector("#emptyState"),
  activeLabel = document.querySelector("#activeFilter");
function renderFilters() {
  filters.innerHTML = categories
    .map(
      (c) =>
        `<button class="filter" data-category="${c}" aria-pressed="${c === activeCategory}">${c}</button>`,
    )
    .join("");
}
function filtered() {
  return projects.filter(
    (p) =>
      (activeCategory === "All" || p.category === activeCategory) &&
      (!activeTag || p.stack.includes(activeTag)) &&
      `${p.title} ${p.desc} ${p.stack.join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
}
function renderProjects() {
  const list = filtered();
  grid.innerHTML = list
    .map(
      (p) =>
        `<article class="project" data-id="${p.id}" tabindex="0"><div class="card-art ${p.art}"><span class="card-index">0${projects.indexOf(p) + 1}</span><span class="card-category">${p.category}</span></div><div class="project-info"><h3>${p.title}</h3><p>${p.role} / ${p.date}</p><div class="tags">${p.stack.map((t) => `<button class="tag" data-tag="${t}">#${t}</button>`).join("")}</div></div></article>`,
    )
    .join("");
  empty.hidden = !!list.length;
  activeLabel.textContent = `Showing ${activeTag ? `#${activeTag}` : activeCategory === "All" ? "all projects" : activeCategory}${query ? ` matching "${query}"` : ""}`;
}
filters.addEventListener("click", (e) => {
  const b = e.target.closest("[data-category]");
  if (b) {
    activeCategory = b.dataset.category;
    activeTag = "";
    renderFilters();
    renderProjects();
  }
});
search.addEventListener("input", (e) => {
  query = e.target.value;
  renderProjects();
});
grid.addEventListener("click", (e) => {
  const tag = e.target.closest("[data-tag]");
  if (tag) {
    e.stopPropagation();
    activeTag = tag.dataset.tag;
    activeCategory = "All";
    renderFilters();
    renderProjects();
    return;
  }
  const card = e.target.closest(".project");
  if (card) openModal(card.dataset.id);
});
grid.addEventListener("keydown", (e) => {
  if (e.key === "Enter") openModal(e.target.dataset.id);
});
const modal = document.querySelector("#projectModal"),
  content = document.querySelector("#modalContent");
function projectActions(p) {
  const links = (projectLinks[p.id]?.links || []).filter(
    (link) => link.label && link.url,
  );
  return links.length
    ? `<div class="project-actions">${links.map((link) => `<a class="project-link" href="${link.url}" target="_blank" rel="noreferrer">${link.label} ↗</a>`).join("")}</div>`
    : "";
}
function openModal(id) {
  const p = projects.find((x) => x.id === id);
  content.innerHTML = `<div class="modal-hero"><p>${p.category.toUpperCase()} / ${p.date}</p><h2>${p.title}</h2></div><div class="modal-body"><div class="modal-tabs"><button class="tab active" data-tab="overview">Overview</button><button class="tab" data-tab="demo">Build / Demo</button><button class="tab" data-tab="architecture">Architecture</button></div><div class="tab-panel" id="tabPanel"></div></div>`;
  content.dataset.id = id;
  showTab("overview");
  modal.showModal();
  if (typeof cursor !== 'undefined') modal.appendChild(cursor);
}
function showTab(tab) {
  const p = projects.find((x) => x.id === content.dataset.id),
    panel = document.querySelector("#tabPanel");
  document
    .querySelectorAll(".tab")
    .forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
  if (tab === "overview")
    panel.innerHTML = `<p>${p.desc}</p><ul class="feature-list">${p.features.map((f) => `<li>${f}</li>`).join("")}</ul>${projectActions(p)}`;
  if (tab === "demo")
    panel.innerHTML = `<div class="demo-box"><b>./${p.id}</b><br /><br />This project is presented as a technical case study. The visual preview and live build can be connected here when media assets are available.<br /><br />status: <b>case-study ready</b></div>${projectActions(p)}`;
  if (tab === "architecture")
    panel.innerHTML = `<div class="architecture">${p.arch.map((a) => `<span>${a}</span>`).join("")}</div>${projectActions(p)}`;
}
content.addEventListener("click", (e) => {
  const tab = e.target.closest(".tab");
  if (tab) showTab(tab.dataset.tab);
});
document
  .querySelector("#modalClose")
  .addEventListener("click", () => {
    modal.close();
    if (typeof cursor !== 'undefined') document.body.appendChild(cursor);
  });
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.close();
    if (typeof cursor !== 'undefined') document.body.appendChild(cursor);
  }
});
modal.addEventListener("close", () => {
  if (typeof cursor !== 'undefined') document.body.appendChild(cursor);
});
const shufflePanel = document.querySelector("#shufflePanel"),
  shuffleTitle = document.querySelector("#shuffleTitle"),
  shuffleCategory = document.querySelector("#shuffleCategory"),
  shuffleDescription = document.querySelector("#shuffleDescription"),
  shuffleTags = document.querySelector("#shuffleTags");
let shuffleProject = projects[0];
function chooseProject() {
  const choices = projects.filter((p) => p.id !== shuffleProject.id);
  shuffleProject = choices[Math.floor(Math.random() * choices.length)];
  shuffleTitle.textContent = shuffleProject.title;
  shuffleCategory.textContent = shuffleProject.category.toUpperCase();
  shuffleDescription.textContent = shuffleProject.desc;
  shuffleTags.innerHTML = shuffleProject.stack
    .map((t) => `<span>#${t}</span>`)
    .join("");
}
document.querySelector("#shuffleToggle").addEventListener("click", () => {
  shufflePanel.hidden = false;
  chooseProject();
});
document
  .querySelector("#shuffleClose")
  .addEventListener("click", () => (shufflePanel.hidden = true));
document
  .querySelector("#shuffleAgain")
  .addEventListener("click", chooseProject);
document.querySelector("#shuffleView").addEventListener("click", () => {
  shufflePanel.hidden = true;
  openModal(shuffleProject.id);
});
renderFilters();
renderProjects();

// --- Certifications Logic ---
const certGrid = document.querySelector("#certGrid");
if (certGrid && certifications) {
  certGrid.innerHTML = certifications.map((c) => 
    `<a class="cert-card" href="${c.fileUrl}" target="_blank" rel="noreferrer">
      <div style="position: relative; z-index: 1;">
        <span class="cert-type">${c.type}</span>
        <h3 class="cert-title">${c.title}</h3>
        <p class="cert-issuer">${c.issuer}</p>
      </div>
      <div class="cert-date" style="position: relative; z-index: 1;">${c.date}</div>
    </a>`
  ).join("");
}

// --- Contact Form AJAX Logic ---
const contactForm = document.getElementById('contact-form');
const contactStatus = document.getElementById('contact-status');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    contactStatus.style.display = 'block';
    contactStatus.style.color = 'inherit';
    contactStatus.textContent = 'Sending message...';
    
    const data = new FormData(contactForm);
    try {
      const response = await fetch(contactForm.action, {
        method: contactForm.method,
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        contactStatus.textContent = "Thanks! Your message has been sent successfully.";
        contactForm.reset();
      } else {
        const responseData = await response.json();
        if (Object.hasOwn(responseData, 'errors')) {
          contactStatus.textContent = responseData.errors.map(error => error.message).join(", ");
        } else {
          contactStatus.textContent = "Oops! There was a problem submitting your form";
        }
        contactStatus.style.color = 'var(--pink)';
      }
    } catch (error) {
      contactStatus.textContent = "Oops! There was a problem submitting your form";
      contactStatus.style.color = 'var(--pink)';
    }
  });
}

// --- Dark Mode Logic ---
const themeToggle = document.getElementById('themeToggle');
let currentTheme = localStorage.getItem('theme') || 'light';

if (currentTheme === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
}

themeToggle.addEventListener('click', () => {
  currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  localStorage.setItem('theme', currentTheme);
});

// --- AI Chat Widget Logic ---
const chatBubble = document.getElementById('chat-bubble');
const chatWindow = document.getElementById('chat-window');
const chatClose = document.getElementById('chat-close');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatHistory = document.getElementById('chat-history');
const chatRemaining = document.getElementById('chat-remaining');

const agent = typeof PortfolioAgent !== 'undefined' ? new PortfolioAgent() : null;

// Initialize remaining count from local storage
const todayStr = new Date().toISOString().split('T')[0];
let savedDataStr = localStorage.getItem('chatRemainingData');

if (savedDataStr !== null) {
  try {
    const savedData = JSON.parse(savedDataStr);
    if (savedData.date === todayStr) {
      chatRemaining.textContent = savedData.count;
    } else {
      chatRemaining.textContent = '5';
    }
  } catch (e) {
    chatRemaining.textContent = '5';
  }
} else {
  // Backwards compatibility with previous version
  let oldSaved = localStorage.getItem('chatRemaining');
  if (oldSaved !== null) {
    localStorage.removeItem('chatRemaining');
  }
}

chatBubble.addEventListener('click', () => {
  chatWindow.classList.remove('hidden');
  chatInput.focus();
});

chatClose.addEventListener('click', () => {
  chatWindow.classList.add('hidden');
});

const charCountSpan = document.getElementById('chat-char-count');
if (chatInput && charCountSpan) {
  chatInput.addEventListener('input', () => {
    charCountSpan.textContent = `${chatInput.value.length}/100`;
  });
}

function appendMessage(text, sender) {
  const msgDiv = document.createElement('div');
  msgDiv.className = "chat-message " + sender + "-message";
  
  if (sender === 'ai' && typeof marked !== 'undefined') {
    let rawHtml = marked.parse(text);
    if (typeof DOMPurify !== 'undefined') {
      rawHtml = DOMPurify.sanitize(rawHtml);
    }
    msgDiv.innerHTML = rawHtml;
  } else {
    msgDiv.textContent = text;
  }
  
  chatHistory.appendChild(msgDiv);
  chatHistory.scrollTop = chatHistory.scrollHeight;
}

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;
  
  // Prevent sending if client knows limit is reached
  if (chatRemaining.textContent === '0') {
    appendMessage("I've reached my chat limit for today! Feel free to email Von.", 'ai');
    chatInput.value = '';
    if (charCountSpan) charCountSpan.textContent = '0/100';
    return;
  }
  
  appendMessage(text, 'user');
  chatInput.value = '';
  if (charCountSpan) charCountSpan.textContent = '0/100';
  
  if (agent) {
    const data = await agent.handleMessage(text);
    
    // Check if the response is an object with a remaining count
    if (typeof data === 'object' && data !== null) {
      appendMessage(data.response, 'ai');
      if (data.remaining !== undefined) {
        chatRemaining.textContent = data.remaining;
        localStorage.setItem('chatRemainingData', JSON.stringify({
          count: data.remaining,
          date: new Date().toISOString().split('T')[0]
        }));
      }
    } else {
      appendMessage(data, 'ai');
    }
  } else {
    appendMessage('AI Agent is offline.', 'ai');
  }
});

// --- Custom Cursor Logic ---
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

document.addEventListener('mouseover', (e) => {
  const isInteractive = e.target.closest('a, button, input, textarea, .card, .filter, .tag, .theme-toggle');
  if (isInteractive) {
    cursor.classList.add('hover');
  }
});

document.addEventListener('mouseout', (e) => {
  const isInteractive = e.target.closest('a, button, input, textarea, .card, .filter, .tag, .theme-toggle');
  if (isInteractive) {
    cursor.classList.remove('hover');
  }
});
