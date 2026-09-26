const API_URL = "http://127.0.0.1:5000";

const resumeText = document.getElementById("resumeText");
const jobDescription = document.getElementById("jobDescription");

const analyzeButton = document.getElementById("analyzeButton");
const topAnalyze = document.getElementById("topAnalyze");
const heroAnalyze = document.getElementById("heroAnalyze");
const historyAnalyze = document.getElementById("historyAnalyze");

const analysisStatus = document.getElementById("analysisStatus");

const resumeCount = document.getElementById("resumeCount");
const jobCount = document.getElementById("jobCount");

const scoreValue = document.getElementById("scoreValue");
const heroScore = document.getElementById("heroScore");
const jobMatchValue = document.getElementById("jobMatchValue");
const skillsValue = document.getElementById("skillsValue");

const strengthsList = document.getElementById("strengthsList");
const weaknessesList = document.getElementById("weaknessesList");

const skillsList = document.getElementById("skillsList");

const matchedKeywords = document.getElementById("matchedKeywords");
const missingKeywords = document.getElementById("missingKeywords");

const sectionChecker = document.getElementById("sectionChecker");
const suggestionsList = document.getElementById("suggestionsList");

const roadmapList = document.getElementById("roadmapList");
const historyList = document.getElementById("historyList");

const clearResume = document.getElementById("clearResume");
const clearJob = document.getElementById("clearJob");
const clearHistory = document.getElementById("clearHistory");

const themeToggle = document.getElementById("themeToggle");
const pageTitle = document.getElementById("pageTitle");

const navItems = document.querySelectorAll(".nav-item");
const pageSections = document.querySelectorAll(".page-section");

/* -----------------------------
   HELPERS
----------------------------- */

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDate(dateString) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return date.toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function setProgress(id, value) {
  const element = document.getElementById(id);

  if (!element) {
    return;
  }

  const safeValue = Math.max(0, Math.min(100, Number(value) || 0));

  element.style.width = `${safeValue}%`;
}

function updateCounter(element, counter) {
  const count = element.value.length;

  counter.textContent = `${count.toLocaleString()} characters`;
}

/* -----------------------------
   NAVIGATION
----------------------------- */

function showSection(sectionId) {
  pageSections.forEach((section) => {
    section.classList.toggle("active", section.id === sectionId);
  });

  navItems.forEach((item) => {
    item.classList.toggle("active", item.dataset.section === sectionId);
  });

  const titles = {
    dashboard: "Dashboard",
    checker: "CV Checker",
    history: "History",
    roadmap: "Career Roadmap",
  };

  pageTitle.textContent = titles[sectionId] || "Dashboard";

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    showSection(item.dataset.section);
  });
});

topAnalyze.addEventListener("click", () => {
  showSection("checker");
  resumeText.focus();
});

heroAnalyze.addEventListener("click", () => {
  showSection("checker");
  resumeText.focus();
});

historyAnalyze.addEventListener("click", () => {
  showSection("checker");
  resumeText.focus();
});

/* -----------------------------
   COUNTERS
----------------------------- */

resumeText.addEventListener("input", () => {
  updateCounter(resumeText, resumeCount);
});

jobDescription.addEventListener("input", () => {
  updateCounter(jobDescription, jobCount);
});

/* -----------------------------
   CLEAR INPUTS
----------------------------- */

clearResume.addEventListener("click", () => {
  resumeText.value = "";
  updateCounter(resumeText, resumeCount);
  resumeText.focus();
});

clearJob.addEventListener("click", () => {
  jobDescription.value = "";
  updateCounter(jobDescription, jobCount);
  jobDescription.focus();
});

/* -----------------------------
   RENDER RESULTS
----------------------------- */

function renderStrengths(items) {
  if (!items || items.length === 0) {
    strengthsList.innerHTML = `
            <div class="empty-message">
                No strengths found yet.
            </div>
        `;
    return;
  }

  strengthsList.innerHTML = items
    .map(
      (item) => `
            <div class="feedback-item success">
                ${escapeHTML(item)}
            </div>
        `,
    )
    .join("");
}

function renderWeaknesses(items) {
  if (!items || items.length === 0) {
    weaknessesList.innerHTML = `
            <div class="empty-message">
                No major issues detected.
            </div>
        `;
    return;
  }

  weaknessesList.innerHTML = items
    .map(
      (item) => `
            <div class="feedback-item warning">
                ${escapeHTML(item)}
            </div>
        `,
    )
    .join("");
}

function renderSkills(items) {
  if (!items || items.length === 0) {
    skillsList.innerHTML = `
            <span class="empty-message">
                No skills detected yet.
            </span>
        `;
    return;
  }

  skillsList.innerHTML = items
    .map(
      (skill) => `
            <span class="tag">
                ${escapeHTML(skill)}
            </span>
        `,
    )
    .join("");
}

function renderKeywords(items, container, className) {
  if (!items || items.length === 0) {
    container.innerHTML = `
            <span class="empty-message">
                None
            </span>
        `;
    return;
  }

  container.innerHTML = items
    .map(
      (keyword) => `
            <span class="tag ${className}">
                ${escapeHTML(keyword)}
            </span>
        `,
    )
    .join("");
}

function renderSections(sections) {
  if (!sections || sections.length === 0) {
    sectionChecker.innerHTML = "";
    return;
  }

  sectionChecker.innerHTML = sections
    .map(
      (section) => `
            <div class="section-item ${section.found ? "found" : "missing"}">

                <span class="section-status">
                    ${section.found ? "✓" : "–"}
                </span>

                <span>
                    ${escapeHTML(section.name)}
                </span>

            </div>
        `,
    )
    .join("");
}

function renderSuggestions(items) {
  if (!items || items.length === 0) {
    suggestionsList.innerHTML = `
            <div class="empty-message">
                No suggestions available.
            </div>
        `;
    return;
  }

  suggestionsList.innerHTML = items
    .map(
      (item) => `
            <div class="suggestion-item">
                ${escapeHTML(item)}
            </div>
        `,
    )
    .join("");
}

function renderRoadmap(items) {
  if (!items || items.length === 0) {
    roadmapList.innerHTML = `
            <div class="empty-state">
                <h3>Your roadmap will appear here</h3>
                <p>Analyze your CV to create your next career steps.</p>
            </div>
        `;
    return;
  }

  roadmapList.innerHTML = items
    .map(
      (item) => `
            <div class="roadmap-item">

                <div class="roadmap-number">
                    ${escapeHTML(item.step)}
                </div>

                <div class="roadmap-content">

                    <h3>
                        ${escapeHTML(item.title)}
                    </h3>

                    <p>
                        ${escapeHTML(item.description)}
                    </p>

                    <span class="roadmap-status">
                        ${escapeHTML(item.status)}
                    </span>

                </div>

            </div>
        `,
    )
    .join("");
}

function renderAnalysis(data) {
  const score = Number(data.score) || 0;

  const breakdown = data.scoreBreakdown || {};

  scoreValue.textContent = `${score}/100`;

  heroScore.textContent = score;

  jobMatchValue.textContent =
    data.jobMatch === null || data.jobMatch === undefined
      ? "--"
      : `${data.jobMatch}%`;

  skillsValue.textContent = data.skills?.length || 0;

  document.getElementById("sectionsScore").textContent =
    `${breakdown.sections || 0}%`;

  document.getElementById("keywordsScore").textContent =
    `${breakdown.keywords || 0}%`;

  document.getElementById("projectsScore").textContent =
    `${breakdown.projects || 0}%`;

  document.getElementById("experienceScore").textContent =
    `${breakdown.experience || 0}%`;

  document.getElementById("skillsScore").textContent =
    `${breakdown.skills || 0}%`;

  setProgress("sectionsBar", breakdown.sections);

  setProgress("keywordsBar", breakdown.keywords);

  setProgress("projectsBar", breakdown.projects);

  setProgress("experienceBar", breakdown.experience);

  setProgress("skillsBar", breakdown.skills);

  renderStrengths(data.strengths || []);
  renderWeaknesses(data.weaknesses || []);

  renderSkills(data.skills || []);

  renderKeywords(data.matchedKeywords || [], matchedKeywords, "matched");

  renderKeywords(data.missingSkills || [], missingKeywords, "missing");

  renderSections(data.sections || []);

  renderSuggestions(data.suggestions || []);

  renderRoadmap(data.roadmap || []);
}

/* -----------------------------
   HISTORY
----------------------------- */

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem("cvisionHistory")) || [];
  } catch {
    return [];
  }
}

function saveHistory(resume, jobDescription, data) {
  const history = getHistory();

  const record = {
    id: Date.now(),
    resume,
    jobDescription,
    data,
  };

  history.unshift(record);

  const limitedHistory = history.slice(0, 10);

  localStorage.setItem("cvisionHistory", JSON.stringify(limitedHistory));

  renderHistory();
}

function renderHistory() {
  const history = getHistory();

  if (history.length === 0) {
    historyList.innerHTML = `
            <div class="empty-state">

                <div class="empty-state-icon">
                    <svg viewBox="0 0 24 24" fill="none">
                        <path
                            d="M4 12a8 8 0 1 0 2.35-5.65"
                            stroke="currentColor"
                            stroke-width="1.8"
                            stroke-linecap="round"
                        />
                        <path
                            d="M4 5v4h4M12 7v5l3 2"
                            stroke="currentColor"
                            stroke-width="1.8"
                            stroke-linecap="round"
                        />
                    </svg>
                </div>

                <h3>No analyses yet</h3>

                <p>
                    Your completed CV analyses will appear here.
                </p>

                <button class="primary-button" id="historyAnalyze">
                    Analyze a CV
                </button>

            </div>
        `;

    document.getElementById("historyAnalyze").addEventListener("click", () => {
      showSection("checker");
      resumeText.focus();
    });

    return;
  }

  historyList.innerHTML = history
    .map((item) => {
      const score = item.data?.score ?? 0;

      const jobMatch = item.data?.jobMatch;

      const skills = item.data?.skills?.length || 0;

      const analyzedAt = item.data?.analyzedAt;

      return `
                <div class="history-card">

                    <div class="history-score">
                        ${escapeHTML(score)}
                    </div>

                    <div class="history-info">

                        <strong>
                            CV Analysis
                        </strong>

                        <p>
                            ${escapeHTML(
                              item.resume.replace(/\s+/g, " ").slice(0, 100),
                            )}${item.resume.length > 100 ? "..." : ""}
                        </p>

                    </div>

                    <div class="history-meta">

                        <span>
                            ${
                              jobMatch === null || jobMatch === undefined
                                ? "No job match"
                                : `${jobMatch}% match`
                            }
                        </span>

                        <span>
                            ${skills} skills
                        </span>

                        <span>
                            ${formatDate(analyzedAt)}
                        </span>

                    </div>

                    <div class="history-actions">

                        <button
                            class="history-open"
                            data-id="${item.id}"
                        >
                            Open
                        </button>

                    </div>

                </div>
            `;
    })
    .join("");

  document.querySelectorAll(".history-open").forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.id);

      openHistory(id);
    });
  });
}

function openHistory(id) {
  const history = getHistory();

  const item = history.find((record) => record.id === id);

  if (!item) {
    return;
  }

  resumeText.value = item.resume || "";

  jobDescription.value = item.jobDescription || "";

  updateCounter(resumeText, resumeCount);

  updateCounter(jobDescription, jobCount);

  renderAnalysis(item.data);

  analysisStatus.textContent = "Previous analysis loaded.";

  showSection("dashboard");
}

clearHistory.addEventListener("click", () => {
  const history = getHistory();

  if (history.length === 0) {
    return;
  }

  const confirmed = window.confirm("Clear all saved CV analyses?");

  if (!confirmed) {
    return;
  }

  localStorage.removeItem("cvisionHistory");

  renderHistory();
});

/* -----------------------------
   ANALYZE CV
----------------------------- */

async function analyzeCV() {
  const resume = resumeText.value.trim();

  const job = jobDescription.value.trim();

  if (resume.length < 30) {
    analysisStatus.textContent =
      "Please add at least 30 characters to your CV.";

    showSection("checker");

    resumeText.focus();

    return;
  }

  analyzeButton.disabled = true;

  analyzeButton.textContent = "Analyzing...";

  analysisStatus.textContent = "Analyzing your CV...";

  try {
    const response = await fetch(`${API_URL}/api/check-resume`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        resume,
        jobDescription: job,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "The server could not analyze your CV.");
    }

    renderAnalysis(data);

    saveHistory(resume, job, data);

    analysisStatus.textContent = `Analysis complete — ${data.score}/100 (${data.scoreLabel}).`;

    showSection("dashboard");
  } catch (error) {
    console.error("CVision analysis error:", error);

    analysisStatus.textContent = "Analysis failed.";

    alert(`Analysis failed: ${error.message}`);
  } finally {
    analyzeButton.disabled = false;

    analyzeButton.textContent = "Analyze CV";
  }
}

analyzeButton.addEventListener("click", analyzeCV);

/* -----------------------------
   DARK MODE
----------------------------- */

function loadTheme() {
  const savedTheme = localStorage.getItem("cvisionTheme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  }
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");

  localStorage.setItem("cvisionTheme", isDark ? "dark" : "light");
});

/* -----------------------------
   START
----------------------------- */

loadTheme();

renderHistory();

updateCounter(resumeText, resumeCount);

updateCounter(jobDescription, jobCount);
