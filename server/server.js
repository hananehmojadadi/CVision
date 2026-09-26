const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json({ limit: "2mb" }));

// Home
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CVision Backend is running",
  });
});

// Analyze CV
app.post("/api/check-resume", (req, res) => {
  try {
    const { resume, jobDescription = "" } = req.body;

    if (!resume || !resume.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a resume.",
      });
    }

    const text = resume.toLowerCase();
    const jobText = jobDescription.toLowerCase();

    // Common skills
    const skillList = [
      "html",
      "css",
      "javascript",
      "typescript",
      "react",
      "vue",
      "angular",
      "node.js",
      "node",
      "express",
      "python",
      "java",
      "c++",
      "sql",
      "mysql",
      "postgresql",
      "mongodb",
      "git",
      "github",
      "figma",
      "photoshop",
      "illustrator",
      "excel",
      "wordpress",
      "bootstrap",
      "tailwind",
      "rest api",
      "api",
      "docker",
      "aws",
    ];

    const foundSkills = skillList.filter((skill) => text.includes(skill));

    // CV sections
    const sectionNames = {
      contact: ["email", "phone", "linkedin", "github", "contact"],
      summary: ["summary", "profile", "objective", "about me"],
      education: ["education", "university", "college", "degree"],
      skills: ["skills", "technical skills", "core skills"],
      experience: ["experience", "work experience", "employment"],
      projects: ["projects", "project"],
      certifications: ["certification", "certifications", "certificate"],
      languages: ["languages", "language"],
    };

    const sections = Object.entries(sectionNames).map(([name, keywords]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      found: keywords.some((keyword) => text.includes(keyword)),
    }));

    const foundSections = sections.filter((section) => section.found).length;

    // Job keywords
    const jobWords = jobText
      .split(/[^a-zA-Z0-9+#.]+/)
      .filter((word) => word.length >= 3);

    const uniqueJobWords = [...new Set(jobWords)];

    const matchedKeywords = uniqueJobWords.filter((word) =>
      text.includes(word),
    );

    const missingSkills = jobDescription
      ? skillList.filter(
          (skill) => jobText.includes(skill) && !text.includes(skill),
        )
      : [];

    // Scores
    const sectionsScore = Math.round((foundSections / 8) * 100);

    const skillsScore = Math.min(100, foundSkills.length * 10);

    const projectsScore = text.includes("project") ? 100 : 30;

    const experienceScore =
      text.includes("experience") || text.includes("work") ? 100 : 40;

    const keywordsScore = jobDescription
      ? Math.min(
          100,
          Math.round(
            (matchedKeywords.length / Math.max(uniqueJobWords.length, 1)) * 100,
          ),
        )
      : 60;

    const score = Math.round(
      sectionsScore * 0.2 +
        skillsScore * 0.2 +
        projectsScore * 0.15 +
        experienceScore * 0.2 +
        keywordsScore * 0.25,
    );

    let scoreLabel = "Needs Improvement";

    if (score >= 80) {
      scoreLabel = "Excellent";
    } else if (score >= 65) {
      scoreLabel = "Good";
    } else if (score >= 50) {
      scoreLabel = "Fair";
    }

    const jobMatch = jobDescription
      ? Math.min(
          100,
          Math.round(
            (matchedKeywords.length / Math.max(uniqueJobWords.length, 1)) * 100,
          ),
        )
      : 0;

    // Strengths
    const strengths = [];

    if (foundSkills.length >= 3) {
      strengths.push("Good range of technical skills");
    }

    if (sections.find((s) => s.name === "Projects")?.found) {
      strengths.push("Projects section is included");
    }

    if (sections.find((s) => s.name === "Education")?.found) {
      strengths.push("Education information is included");
    }

    if (sections.find((s) => s.name === "Experience")?.found) {
      strengths.push("Work experience is included");
    }

    if (strengths.length === 0) {
      strengths.push("The CV contains useful information to build on");
    }

    // Weaknesses
    const weaknesses = [];

    if (!sections.find((s) => s.name === "Summary")?.found) {
      weaknesses.push("Professional summary is missing");
    }

    if (!sections.find((s) => s.name === "Projects")?.found) {
      weaknesses.push("Projects section is missing");
    }

    if (!sections.find((s) => s.name === "Certifications")?.found) {
      weaknesses.push("Certifications section is missing");
    }

    if (foundSkills < 3) {
      weaknesses.push("More relevant skills could be listed");
    }

    // Suggestions
    const suggestions = [];

    if (!sections.find((s) => s.name === "Summary")?.found) {
      suggestions.push(
        "Add a short professional summary at the top of the CV.",
      );
    }

    if (!sections.find((s) => s.name === "Projects")?.found) {
      suggestions.push("Add 2–3 relevant projects with short descriptions.");
    }

    if (jobDescription && missingSkills.length > 0) {
      suggestions.push(
        `Consider highlighting relevant skills such as ${missingSkills
          .slice(0, 4)
          .join(", ")} if you genuinely have them.`,
      );
    }

    suggestions.push(
      "Use clear bullet points and focus on measurable results where possible.",
    );

    // Roadmap
    const roadmap = [
      {
        step: 1,
        title: "Improve CV Structure",
        description: "Make sure the main CV sections are clearly organized.",
        status: sectionsScore >= 75 ? "Completed" : "Next",
      },
      {
        step: 2,
        title: "Strengthen Skills",
        description:
          "Highlight the technical and professional skills relevant to your target role.",
        status: skillsScore >= 70 ? "Completed" : "In Progress",
      },
      {
        step: 3,
        title: "Improve Projects",
        description:
          "Add strong projects and explain your contribution clearly.",
        status: projectsScore >= 80 ? "Completed" : "In Progress",
      },
      {
        step: 4,
        title: "Match the Job",
        description:
          "Customize keywords and skills based on the job description.",
        status: jobDescription && jobMatch >= 70 ? "Completed" : "Next",
      },
    ];

    const summary =
      score >= 80
        ? "Your CV has a strong structure and good supporting information."
        : score >= 60
          ? "Your CV has a solid foundation, but several areas can be improved."
          : "Your CV has useful information, but it needs more structure and detail.";

    res.json({
      success: true,
      score,
      scoreLabel,
      summary,

      scoreBreakdown: {
        sections: sectionsScore,
        keywords: keywordsScore,
        projects: projectsScore,
        experience: experienceScore,
        skills: skillsScore,
      },

      jobMatch,

      strengths,
      weaknesses,
      suggestions,

      skills: foundSkills,
      matchedKeywords,
      missingSkills,

      sections,

      roadmap,

      analyzedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("CV analysis error:", error);

    res.status(500).json({
      success: false,
      message: "CV analysis failed.",
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`CVision Backend running on http://localhost:${PORT}`);
});
