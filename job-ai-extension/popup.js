const API_BASE = "http://localhost:8000/api";

const jwtInput = document.getElementById("jwtToken");
const saveTokenBtn = document.getElementById("saveTokenBtn");
const analyzeJobBtn = document.getElementById("analyzeJobBtn");
const analyzeFitBtn = document.getElementById("analyzeFitBtn");
const statusMessage = document.getElementById("statusMessage");
const resultsCard = document.getElementById("resultsCard");

const trustSection = document.getElementById("trustSection");
const fitSection = document.getElementById("fitSection");

// Load saved JWT token on popup open
chrome.storage.local.get(["authToken"], (res) => {
  if (res.authToken) {
    jwtInput.value = res.authToken;
  }
});

saveTokenBtn.addEventListener("click", () => {
  const token = jwtInput.value.trim();
  chrome.storage.local.set({ authToken: token }, () => {
    showStatus("Token saved successfully!", "status-success");
  });
});

function showStatus(text, type = "status-info") {
  statusMessage.className = `status-box ${type}`;
  statusMessage.innerText = text;
  statusMessage.classList.remove("hidden");
}

function getStoredToken() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["authToken"], (res) => {
      resolve(res.authToken || "");
    });
  });
}

// Helper to scrape current tab page details
function getScrapedPageData() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || tabs.length === 0) {
        reject(new Error("No active tab found."));
        return;
      }
      chrome.tabs.sendMessage(tabs[0].id, { action: "SCRAPE_JOB_DETAILS" }, (response) => {
        if (chrome.runtime.lastError || !response || !response.success) {
          reject(new Error("Could not scrape job from this page. Try refreshing the tab."));
          return;
        }
        resolve(response.data);
      });
    });
  });
}

// 1. Analyze Company & Job Trust (No resume)
analyzeJobBtn.addEventListener("click", async () => {
  const token = await getStoredToken();
  if (!token) {
    showStatus("Please save your backend JWT token first.", "status-error");
    return;
  }

  showStatus("Evaluating company legitimacy & trust...", "status-info");
  analyzeJobBtn.disabled = true;

  try {
    const jobData = await getScrapedPageData();
    const res = await fetch(`${API_BASE}/extension/analyze-job`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(jobData)
    });

    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const data = await res.json();
    
    displayJobTrustResults(data);
    showStatus("Company trust check complete!", "status-success");
  } catch (err) {
    showStatus(`Analysis failed: ${err.message}`, "status-error");
  } finally {
    analyzeJobBtn.disabled = false;
  }
});

// 2. Analyze Resume Fit (12-point semantic match)
analyzeFitBtn.addEventListener("click", async () => {
  const token = await getStoredToken();
  if (!token) {
    showStatus("Please save your backend JWT token first.", "status-error");
    return;
  }

  showStatus("Comparing job description against your resume...", "status-info");
  analyzeFitBtn.disabled = true;

  try {
    const jobData = await getScrapedPageData();
    const res = await fetch(`${API_BASE}/extension/analyze-fit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(jobData)
    });

    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const data = await res.json();
    
    displayResumeFitResults(data);
    showStatus("Resume match analysis complete!", "status-success");
  } catch (err) {
    showStatus(`Analysis failed: ${err.message}`, "status-error");
  } finally {
    analyzeFitBtn.disabled = false;
  }
});

function displayJobTrustResults(data) {
  document.getElementById("resTitle").innerText = data.job_title || "Unknown Role";
  document.getElementById("resCompany").innerText = data.company || "Unknown Company";

  trustSection.classList.remove("hidden");
  fitSection.classList.add("hidden");

  const trustScore = data.company_trust?.score || 0;
  const recommendation = data.company_trust?.recommendation || "Unknown";
  const trustElement = document.getElementById("resTrust");
  
  trustElement.innerText = `${trustScore}% (${recommendation})`;
  trustElement.style.color = trustScore >= 75 ? "#059669" : trustScore >= 50 ? "#d97706" : "#dc2626";

  // Handle Clickable Links
  const trustData = data.company_trust || {};
  
  const webLink = document.getElementById("webLink");
  if (trustData.official_website) {
    webLink.href = trustData.official_website;
    webLink.classList.remove("hidden");
  } else {
    webLink.classList.add("hidden");
  }

  const careerLink = document.getElementById("careerLink");
  if (trustData.careers_page) {
    careerLink.href = trustData.careers_page;
    careerLink.classList.remove("hidden");
  } else {
    careerLink.classList.add("hidden");
  }

  const linkedInLink = document.getElementById("linkedInLink");
  if (trustData.linkedin_url) {
    linkedInLink.href = trustData.linkedin_url;
    linkedInLink.classList.remove("hidden");
  } else {
    linkedInLink.classList.add("hidden");
  }

  const redFlags = trustData.red_flags || [];
  document.getElementById("trustFlags").innerText = redFlags.length > 0 ? `Warnings: ${redFlags[0]}` : "No major red flags detected.";

  resultsCard.classList.remove("hidden");
}

function displayResumeFitResults(data) {
  document.getElementById("resTitle").innerText = data.job_title || "Unknown Role";
  document.getElementById("resCompany").innerText = data.company || "Unknown Company";

  fitSection.classList.remove("hidden");
  trustSection.classList.add("hidden"); // Hide trust data if showing fit

  const fitScore = data.resume_fit?.overall_fit_score || 0;
  document.getElementById("resScore").innerText = `${fitScore}%`;

  const container = document.getElementById("keywordsList");
  container.innerHTML = "";
  
  const missingSkills = data.resume_fit?.missing_skills || [];
  if (missingSkills.length === 0) {
    container.innerHTML = "<span class='text-muted'>No major skill gaps detected!</span>";
  } else {
    missingSkills.forEach((kw) => {
      const span = document.createElement("span");
      span.className = "keyword-badge";
      span.style.backgroundColor = "#fee2e2";
      span.style.color = "#991b1b";
      span.innerText = kw;
      container.appendChild(span);
    });
  }

  // --- NEW COVER LETTER FORMATTING LOGIC ---
  let rawLetter = data.resume_fit?.cover_letter || "Cover letter generation failed.";
  
  let formattedLetter = rawLetter
      .replace(/\\n/g, '<br>')       // Fix explicit escaped \n
      .replace(/\n/g, '<br>')        // Fix actual newlines
      .replace(/\\u202f/g, ' ')      // Fix unicode spaces
      .replace(/\u202f/g, ' ')       // Fix literal unicode spaces
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Fix markdown bolding
      
  // Use innerHTML instead of innerText so the HTML tags render correctly
  document.getElementById("coverLetterBox").innerHTML = formattedLetter;

  let rawTailored = data.resume_fit?.tailored_resume || "No tailored resume generated.";
  
  // Format it assuming it comes back as a list or string
  if (Array.isArray(rawTailored)) {
      rawTailored = rawTailored.map(bullet => `• ${bullet}`).join('<br>');
  } else {
      rawTailored = String(rawTailored).replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  }
  
  document.getElementById("tailoredResumeBox").innerHTML = rawTailored;

  resultsCard.classList.remove("hidden");
}