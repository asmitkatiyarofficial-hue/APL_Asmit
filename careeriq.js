
const API_KEY_PLACEHOLDER = ""; // handled by proxy
const COMMON_SKILLS = [
  'JavaScript','TypeScript','React','Next.js','Node.js','Express',
  'Python','Django','FastAPI','Flask','Java','Spring Boot',
  'Go','Rust','C++','C#','PHP','Laravel','Ruby on Rails',
  'Vue.js','Angular','Svelte','React Native','Flutter','Swift','Kotlin',
  'MongoDB','PostgreSQL','MySQL','Redis','Firebase','Supabase',
  'AWS','GCP','Azure','Docker','Kubernetes','Terraform','CI/CD',
  'GraphQL','REST APIs','gRPC','WebSockets','Microservices',
  'Machine Learning','Deep Learning','TensorFlow','PyTorch','LLMs',
  'Figma','UI/UX Design','Tailwind CSS','CSS/SCSS',
  'Git','Linux','System Design','Data Structures & Algorithms',
  'SEO / Growth','Digital Marketing','Product Management','Agile/Scrum'
];
const PROFILE_PLATFORMS = [
  { id:'linkedin', name:'LinkedIn', icon:'🔗', color:'#0A66C2', placeholder:'https://linkedin.com/in/yourprofile' },
  { id:'github', name:'GitHub', icon:'⚫', color:'#333', placeholder:'https://github.com/yourusername' },
  { id:'leetcode', name:'LeetCode', icon:'🟡', color:'#FFA116', placeholder:'https://leetcode.com/yourprofile' },
  { id:'kaggle', name:'Kaggle', icon:'🔵', color:'#20BEFF', placeholder:'https://kaggle.com/yourprofile' },
  { id:'dribbble', name:'Dribbble / Behance', icon:'🎨', color:'#EA4C89', placeholder:'https://dribbble.com/yourprofile' },
];

let state = {
  currentStep: 0,
  totalSteps: 5,
  selectedSkills: [],
  customSkills: [],
  data: null,
  aiResult: null,
};

// ---- INIT ----
function initSkillsGrid() {
  const g = document.getElementById('skillsGrid');
  g.innerHTML = COMMON_SKILLS.map(s =>
    `<div class="skill-chip" onclick="toggleSkill(this,'${s}')">${s}</div>`
  ).join('');
}

function initCustomSkill() {
  const input = document.getElementById('customSkillInput');
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && input.value.trim()) {
      addCustomSkill(input.value.trim());
      input.value = '';
    }
    if (e.key === 'Backspace' && !input.value && state.customSkills.length) {
      removeCustomSkill(state.customSkills[state.customSkills.length - 1]);
    }
  });
}

function toggleSkill(el, skill) {
  el.classList.toggle('selected');
  if (el.classList.contains('selected')) state.selectedSkills.push(skill);
  else state.selectedSkills = state.selectedSkills.filter(s => s !== skill);
}

function addCustomSkill(s) {
  if (state.customSkills.includes(s)) return;
  state.customSkills.push(s);
  renderCustomSkillTags();
}
function removeCustomSkill(s) {
  state.customSkills = state.customSkills.filter(x => x !== s);
  renderCustomSkillTags();
}
function renderCustomSkillTags() {
  const wrap = document.getElementById('customSkillWrap');
  const input = document.getElementById('customSkillInput');
  const tags = state.customSkills.map(s =>
    `<span class="tag">${s} <span class="tag-del" onclick="removeCustomSkill('${s}')">✕</span></span>`
  ).join('');
  wrap.innerHTML = tags + `<input class="tag-in" id="customSkillInput" placeholder="Type and press Enter…">`;
  const newInput = document.getElementById('customSkillInput');
  newInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && newInput.value.trim()) {
      addCustomSkill(newInput.value.trim());
      newInput.value = '';
    }
    if (e.key === 'Backspace' && !newInput.value && state.customSkills.length) {
      removeCustomSkill(state.customSkills[state.customSkills.length - 1]);
    }
  });
  newInput.focus();
}

function initProfileCards() {
  const c = document.getElementById('profileCards');
  c.innerHTML = PROFILE_PLATFORMS.map(p => `
    <div class="profile-link-card" id="plc-${p.id}" onclick="toggleProfile('${p.id}')">
      <div class="plc-icon" style="background:${p.color}20;color:${p.color};font-size:1.3rem">${p.icon}</div>
      <div class="plc-info">
        <div class="plc-title">${p.name}</div>
        <div class="plc-sub" id="plc-sub-${p.id}">Click to add your profile URL</div>
      </div>
      <div class="plc-badge badge-manual" id="plc-badge-${p.id}">Optional</div>
    </div>
    <div id="plc-input-${p.id}" style="display:none;margin:-10px 0 10px;padding:0 1rem">
      <input class="url-input" id="plc-url-${p.id}" type="url" placeholder="${p.placeholder}" oninput="updateProfileStatus('${p.id}')" />
    </div>
  `).join('');
}

function toggleProfile(id) {
  const el = document.getElementById(`plc-input-${id}`);
  const visible = el.style.display !== 'none';
  el.style.display = visible ? 'none' : 'block';
  if (!visible) document.getElementById(`plc-url-${id}`).focus();
}

function updateProfileStatus(id) {
  const val = document.getElementById(`plc-url-${id}`).value.trim();
  const sub = document.getElementById(`plc-sub-${id}`);
  const badge = document.getElementById(`plc-badge-${id}`);
  const card = document.getElementById(`plc-${id}`);
  if (val) {
    sub.textContent = val;
    badge.textContent = 'Added ✓';
    badge.className = 'plc-badge badge-connected';
    card.classList.add('connected');
  } else {
    sub.textContent = 'Click to add your profile URL';
    badge.textContent = 'Optional';
    badge.className = 'plc-badge badge-manual';
    card.classList.remove('connected');
  }
}

// ---- STEP NAV ----
function initNavSteps() {
  const ns = document.getElementById('navSteps');
  ns.innerHTML = Array.from({length: state.totalSteps}, (_,i) =>
    `<div class="nav-step" id="nstep-${i}"></div>`
  ).join('');
}

function goToStep(n) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  if (n === 0) document.getElementById('screen-hero').classList.add('active');
  else document.getElementById(`screen-${n}`)?.classList.add('active');
  state.currentStep = n;
  updateNavSteps();
  window.scrollTo({top: 0, behavior: 'smooth'});
}

function updateNavSteps() {
  for (let i = 0; i < state.totalSteps; i++) {
    const el = document.getElementById(`nstep-${i}`);
    if (!el) continue;
    el.className = 'nav-step';
    if (i < state.currentStep) el.classList.add('done');
    else if (i === state.currentStep) el.classList.add('active');
  }
}

function switchTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.getElementById(`tab-${tab}`)?.classList.add('active');
  document.querySelectorAll('.tabs .tab').forEach(t => {
    if (t.getAttribute('onclick').includes(`'${tab}'`)) t.classList.add('active');
  });
}

// ---- COLLECT DATA ----
function collectFormData() {
  const allSkills = [
    ...state.selectedSkills,
    ...state.customSkills,
  ].filter(Boolean);

  return {
    name: document.getElementById('f-name')?.value || '',
    email: document.getElementById('f-email')?.value || '',
    role: document.getElementById('f-role')?.value || '',
    industry: document.getElementById('f-industry')?.value || '',
    experience: document.getElementById('f-exp')?.value || '',
    location: document.getElementById('f-location')?.value || 'India',
    targetLocation: document.getElementById('f-target-loc')?.value || '',
    currentSalary: document.getElementById('f-salary')?.value || '',
    skills: allSkills,
    education: document.getElementById('f-edu')?.value || '',
    certifications: document.getElementById('f-certs')?.value || '',
    workExperience: document.getElementById('f-workex')?.value || '',
    projects: document.getElementById('f-projects')?.value || '',
    oss: document.getElementById('f-oss')?.value || '',
    goal: document.getElementById('f-goal')?.value || '',
    challenge: document.getElementById('f-challenge')?.value || '',
    linkedinUrl: document.getElementById('plc-url-linkedin')?.value || '',
    githubUrl: document.getElementById('plc-url-github')?.value || '',
    leetcodeUrl: document.getElementById('plc-url-leetcode')?.value || '',
    portfolioUrl: document.getElementById('f-portfolio')?.value || '',
    resumePaste: document.getElementById('f-resume-paste')?.value || '',
    englishLevel: document.getElementById('engSlider')?.value || 3,
  };
}

// ---- LOADING ----
function showLoading() {
  document.getElementById('loadingScreen').classList.add('show');
  const steps = [ls1,ls2,ls3,ls4,ls5,ls6];
  let i = 0;
  const msgs = ['Analysing your profile…','Benchmarking salaries…','Matching jobs…','Generating resume…','Finalising insights…'];
  let mi = 0;
  const interval = setInterval(() => {
    if (i > 0) document.getElementById(`ls${i}`).className = 'ls done';
    i++;
    if (i <= 6) document.getElementById(`ls${i}`).className = 'ls active';
    mi = (mi + 1) % msgs.length;
    document.getElementById('loadingMsg').textContent = msgs[mi];
    if (i > 6) clearInterval(interval);
  }, 800);
  return interval;
}

function hideLoading() {
  document.getElementById('loadingScreen').classList.remove('show');
}

// ---- AI ANALYSIS ----
async function runAnalysis() {
  const data = collectFormData();
  state.data = data;
  const timer = showLoading();

  const skillsStr = data.skills.length ? data.skills.join(', ') : 'Not specified';

  const prompt = `You are CareerIQ, an expert career analyst with deep knowledge of global and Indian tech job markets, salaries, freelancing, and emerging technologies.

Analyse this professional profile and return ONLY valid JSON (no markdown, no extra text):

PROFILE:
- Name: ${data.name || 'User'}
- Role: ${data.role || 'Not specified'}
- Experience: ${data.experience || 'Not specified'}
- Location: ${data.location}
- Target Location: ${data.targetLocation || 'India'}
- Industry: ${data.industry || 'Technology'}
- Skills: ${skillsStr}
- Education: ${data.education || 'Not specified'}
- Certifications: ${data.certifications || 'None'}
- Work Experience: ${data.workExperience || 'Not provided'}
- Projects: ${data.projects || 'Not provided'}
- Open Source: ${data.oss || 'None'}
- Career Goal: ${data.goal || 'Growth'}
- Challenge: ${data.challenge || 'Not specified'}
- Current Salary: ${data.currentSalary || 'Not disclosed'}
- LinkedIn: ${data.linkedinUrl ? 'Provided' : 'Not provided'}
- GitHub: ${data.githubUrl ? 'Provided' : 'Not provided'}
- Portfolio: ${data.portfolioUrl ? 'Provided' : 'Not provided'}
- Resume Paste: ${data.resumePaste ? 'Provided ('+data.resumePaste.length+' chars)' : 'Not provided'}

Return this exact JSON structure:
{
  "careerIQ": 75,
  "careerIQBreakdown": {
    "skills": 70,
    "experience": 65,
    "portfolio": 60,
    "marketability": 75,
    "growth": 80,
    "communication": 70
  },
  "summary": "2-3 sentence honest summary of their career standing and biggest opportunity",
  "profileTags": ["Full Stack", "Mid-Level", "Hireable"],
  "topSkills": [
    {"name": "React", "level": 85},
    {"name": "Node.js", "level": 78},
    {"name": "Python", "level": 60},
    {"name": "AWS", "level": 45},
    {"name": "System Design", "level": 40}
  ],
  "jobs": [
    {
      "title": "Senior Full Stack Developer",
      "type": "Full-time",
      "companies": "Razorpay, Zepto, Meesho",
      "salaryINR": "18-28 LPA",
      "salaryUSD": "$35k-55k (remote)",
      "desc": "Build scalable web apps across frontend and backend",
      "requiredSkills": ["React", "Node.js", "PostgreSQL"],
      "match": 88,
      "icon": "💻"
    }
  ],
  "freelance": [
    {
      "title": "React / Next.js Developer",
      "platforms": "Toptal, Upwork, Contra",
      "rateUSD": "$35-65/hr",
      "rateINR": "₹8k-15k/hr",
      "desc": "Build SPAs and full-stack apps for global clients",
      "requiredSkills": ["React", "TypeScript", "REST APIs"],
      "match": 85,
      "icon": "🌐"
    }
  ],
  "projects": [
    {
      "title": "AI-Powered SaaS Tool",
      "desc": "Build a niche SaaS that uses GPT-4 API to automate a common task in your industry. This adds AI experience to your resume.",
      "difficulty": "Medium",
      "stack": ["Next.js", "OpenAI API", "Stripe", "Vercel"],
      "why": "AI + SaaS = highest hiring signal in 2025",
      "estimatedTime": "2-3 weeks"
    }
  ],
  "salaryData": {
    "currentEstimate": "₹14-20 LPA",
    "potentialIndia": "₹22-35 LPA",
    "potentialRemote": "$60k-90k/yr",
    "potentialOnsite": "$90k-130k/yr",
    "roles": [
      {"role": "Current Level", "salaryINR": 17, "max": 50},
      {"role": "Senior Dev", "salaryINR": 28, "max": 50},
      {"role": "Tech Lead", "salaryINR": 38, "max": 50},
      {"role": "Remote (USD)", "salaryINR": 45, "max": 50},
      {"role": "FAANG India", "salaryINR": 50, "max": 50}
    ],
    "freelanceHourly": {"low": 25, "mid": 50, "high": 80},
    "freelanceMonthly": "₹2-5L/month"
  },
  "techTrends": [
    {
      "tech": "AI Agents & LLM APIs",
      "heat": 95,
      "heatLevel": "high",
      "description": "Companies are hiring heavily for devs who can integrate LLMs and build autonomous agents. This is the #1 skill gap.",
      "learnTime": "4-6 weeks",
      "resources": "LangChain docs, OpenAI Cookbook, Anthropic Claude API"
    }
  ],
  "skillGaps": [
    {
      "skill": "System Design",
      "severity": "high",
      "impact": "Blocking senior-level roles and FAANG interviews",
      "howToFix": "Study Grokking System Design, build one scalable project",
      "timeToFix": "6-8 weeks"
    }
  ],
  "resume": {
    "headline": "Full Stack Developer | React · Node.js · AWS | 3+ Years",
    "summary": "2-3 line professional summary",
    "experience": [
      {
        "title": "Full Stack Developer",
        "company": "Company Name · 2022 – Present",
        "points": ["Built X using Y, resulting in Z", "Led team of N to deliver project"]
      }
    ],
    "education": "B.Tech CS, XYZ University, 2021",
    "skillCategories": [
      {"category": "Frontend", "skills": ["React", "Next.js", "TypeScript"]},
      {"category": "Backend", "skills": ["Node.js", "Express", "PostgreSQL"]}
    ],
    "achievements": ["GitHub: 500+ stars on open source projects", "Certified AWS Solutions Architect"],
    "certifications": []
  },
  "learningRoadmap": [
    {
      "week": "Weeks 1-2",
      "focus": "System Design Fundamentals",
      "action": "Study Grokking System Design + build a URL shortener",
      "why": "Unlocks senior + FAANG roles"
    }
  ]
}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        messages: [{ role: "user", content: prompt }]
      })
    });

    const raw = await response.json();
    clearInterval(timer);

    let text = raw.content?.map(b => b.text || '').join('') || '';
    text = text.replace(/```json|```/g, '').trim();

    let result;
    try {
      result = JSON.parse(text);
    } catch {
      result = generateFallbackResult(data);
    }

    state.aiResult = result;
    hideLoading();
    renderAnalysis(data, result);
    goToAnalysis();
  } catch(err) {
    clearInterval(timer);
    const result = generateFallbackResult(data);
    state.aiResult = result;
    hideLoading();
    renderAnalysis(data, result);
    goToAnalysis();
  }
}

function generateFallbackResult(data) {
  const hasSkills = data.skills.length > 0;
  const expYears = data.experience?.includes('10+') ? 12 :
                   data.experience?.includes('6–10') ? 8 :
                   data.experience?.includes('3–5') ? 4 :
                   data.experience?.includes('1–2') ? 1.5 : 0;
  const iq = Math.min(95, Math.max(30, 45 + expYears * 4 + (hasSkills ? 15 : 0)));
  const skills = data.skills.slice(0, 5).map((s,i) => ({name: s, level: 85 - i*8}));
  if (!skills.length) skills.push({name:'General Tech',level:50});
  return {
    careerIQ: Math.round(iq),
    careerIQBreakdown: { skills: 68, experience: 62, portfolio: 55, marketability: 70, growth: 75, communication: 65 },
    summary: `Based on your profile, you have solid foundational skills${hasSkills ? ' in ' + data.skills.slice(0,3).join(', ') : ''}. Your biggest opportunity is building a stronger portfolio and targeting remote opportunities which can 2–3x your earnings.`,
    profileTags: [data.role || 'Tech Professional', data.experience?.split(' ')[0] + ' Exp', 'Hireable'],
    topSkills: skills,
    jobs: [
      { title: 'Software Developer', type: 'Full-time', companies: 'Razorpay, Groww, Zepto', salaryINR: '12-22 LPA', salaryUSD: '$30k-50k', desc: 'Build features for product companies in a fast-paced environment', requiredSkills: data.skills.slice(0,3), match: 82, icon: '💻' },
      { title: 'Backend Engineer', type: 'Full-time', companies: 'CRED, Swiggy, PhonePe', salaryINR: '15-25 LPA', salaryUSD: '$35k-55k', desc: 'Design APIs, services and data models at scale', requiredSkills: data.skills.slice(0,2), match: 76, icon: '⚙️' },
    ],
    freelance: [
      { title: 'Full Stack Developer', platforms: 'Upwork, Toptal, Contra', rateUSD: '$30-60/hr', rateINR: '₹7k-14k/hr', desc: 'Build web applications for global clients', requiredSkills: data.skills.slice(0,3), match: 80, icon: '🌐' },
    ],
    projects: [
      { title: 'SaaS Starter Kit', desc: 'Build a complete SaaS boilerplate with auth, billing, and dashboard that other developers can use or that you can turn into a product.', difficulty: 'Medium', stack: ['Next.js', 'Prisma', 'Stripe', 'Vercel'], why: 'Shows full-stack depth + entrepreneurial thinking', estimatedTime: '3-4 weeks' },
      { title: 'AI-Powered Tool', desc: 'Integrate an LLM API (Claude/GPT) to automate a repetitive task. Even a simple tool shows AI fluency — the hottest skill right now.', difficulty: 'Easy', stack: ['Node.js', 'Anthropic API', 'React'], why: 'AI skills = 50-70% salary premium in 2025', estimatedTime: '1-2 weeks' },
      { title: 'Open Source CLI', desc: 'Build a developer tool and publish it on npm or GitHub. Even 100 stars significantly boosts your profile credibility.', difficulty: 'Easy', stack: ['Node.js', 'Commander.js', 'npm'], why: 'Open source = credibility + inbound opportunities', estimatedTime: '1 week' },
    ],
    salaryData: {
      currentEstimate: '₹10-18 LPA', potentialIndia: '₹20-35 LPA',
      potentialRemote: '$55k-80k/yr', potentialOnsite: '$85k-120k/yr',
      roles: [
        { role: 'Current Level', salaryINR: 14, max: 50 },
        { role: 'Senior Dev', salaryINR: 25, max: 50 },
        { role: 'Tech Lead', salaryINR: 35, max: 50 },
        { role: 'Remote (USD equiv)', salaryINR: 43, max: 50 },
        { role: 'FAANG India', salaryINR: 50, max: 50 },
      ],
      freelanceHourly: { low: 25, mid: 45, high: 75 },
      freelanceMonthly: '₹2-4L/month'
    },
    techTrends: [
      { tech: 'AI Agents & LLM APIs', heat: 95, heatLevel: 'high', description: 'Building with GPT-4, Claude, Gemini is the #1 most in-demand skill. Companies are hiring anyone who can integrate AI into products.', learnTime: '3-5 weeks', resources: 'Anthropic Docs, OpenAI Cookbook, LangChain' },
      { tech: 'Rust & Systems Programming', heat: 72, heatLevel: 'mid', description: 'Rust adoption is accelerating in backend, WebAssembly, and infra. Learning it puts you in the top 2% of devs.', learnTime: '8-12 weeks', resources: 'The Rust Book (free), Rustlings' },
      { tech: 'Edge Computing & Deno/Bun', heat: 68, heatLevel: 'mid', description: 'Cloudflare Workers, Deno Deploy, and Bun are changing the serverless game. Early adopters are getting premium rates.', learnTime: '2-3 weeks', resources: 'Cloudflare Workers docs, Deno tutorials' },
      { tech: 'Web3 / Blockchain Revival', heat: 55, heatLevel: 'low', description: 'After the 2022 crash, Web3 is quietly rebuilding with real use cases. Solidity + DeFi devs are in short supply.', learnTime: '6-8 weeks', resources: 'Buildspace, Alchemy University' },
    ],
    skillGaps: [
      { skill: 'System Design', severity: 'high', impact: 'You cannot clear senior/staff engineer interviews without this. It is the #1 bottleneck for salary growth.', howToFix: 'Study Grokking System Design (3 hrs/day), build a URL shortener and message queue from scratch', timeToFix: '6-8 weeks' },
      { skill: 'Cloud / DevOps (AWS/GCP)', severity: 'medium', impact: 'Most senior roles require you to deploy, scale, and monitor your own code. Adds 20-40% to your salary.', howToFix: 'Get AWS Cloud Practitioner cert, then Solutions Architect. Build and deploy 2 projects on EC2/Lambda.', timeToFix: '4-6 weeks' },
      { skill: 'AI/ML Fluency', severity: 'medium', impact: 'Even non-ML devs need to know how to use AI APIs. Companies pay a premium for this.', howToFix: 'Build 2 AI-integrated projects using Claude or GPT-4 API. Study prompt engineering basics.', timeToFix: '2-3 weeks' },
    ],
    resume: {
      headline: (data.role || 'Software Developer') + ' | ' + (data.skills.slice(0,3).join(' · ') || 'Full Stack') + ' | ' + (data.experience || 'Experienced'),
      summary: `Results-driven ${data.role || 'developer'} with ${data.experience || 'hands-on'} building scalable products. Passionate about clean code, user experience, and continuously learning new technologies.`,
      experience: data.workExperience ? [{ title: data.role || 'Developer', company: 'Previous Experience', points: [data.workExperience.split('\n')[0] || 'Built and maintained production applications'] }] : [],
      education: data.education || 'B.Tech / Engineering',
      skillCategories: [{ category: 'Technical Skills', skills: data.skills.slice(0,8) }],
      achievements: data.projects ? [data.projects.split('\n')[0]] : ['Built production-ready applications'],
      certifications: data.certifications ? [data.certifications] : [],
    },
    learningRoadmap: [
      { week: 'Week 1-2', focus: 'System Design', action: 'Read Grokking System Design + build URL shortener + implement rate limiter', why: 'Unlocks ₹25+ LPA roles' },
      { week: 'Week 3-4', focus: 'AI Integration', action: 'Build 2 projects using Claude/GPT-4 API — a chatbot + an automation tool', why: '50%+ salary premium for AI skills' },
      { week: 'Week 5-6', focus: 'Cloud (AWS)', action: 'Deploy 2 projects on AWS (EC2 + Lambda), get Cloud Practitioner cert', why: 'Required for most senior roles' },
      { week: 'Week 7-8', focus: 'Open Source', action: 'Pick a popular GitHub repo in your stack, fix 2 issues, submit PRs', why: 'Portfolio credibility + network' },
    ]
  };
}

// ---- RENDER ----
function renderAnalysis(data, r) {
  const name = data.name || 'You';
  document.getElementById('heroName').textContent = name + "'s Career Analysis";
  document.getElementById('avatarInit').textContent = name[0]?.toUpperCase() || 'U';
  document.getElementById('heroSub').textContent = [data.role, data.experience, data.location].filter(Boolean).join(' · ');
  document.getElementById('iqScore').textContent = r.careerIQ;
  document.getElementById('heroTags').innerHTML = (r.profileTags || []).map(t =>
    `<span style="font-size:0.75rem;padding:3px 10px;border-radius:6px;background:rgba(108,99,255,0.15);color:#9d96ff;font-weight:500">${t}</span>`
  ).join('');

  // Score cards
  const bd = r.careerIQBreakdown || {};
  const scoreHTML = Object.entries({
    '🎯 Skills Depth': bd.skills || 70,
    '📦 Experience': bd.experience || 65,
    '💼 Portfolio': bd.portfolio || 60,
    '📊 Marketability': bd.marketability || 75,
    '📈 Growth Potential': bd.growth || 80,
    '🗣 Communication': bd.communication || 65,
  }).map(([label, val]) => {
    const color = val >= 80 ? 'var(--green)' : val >= 60 ? 'var(--amber)' : 'var(--red)';
    return `<div class="card"><div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px"><span style="font-size:0.82rem;color:var(--text2)">${label}</span><span style="font-size:1.2rem;font-weight:700;color:${color}">${val}</span></div><div style="height:5px;background:var(--bg4);border-radius:3px"><div style="height:100%;width:${val}%;background:${color};border-radius:3px;transition:width 1s"></div></div></div>`;
  }).join('');
  document.getElementById('scoreCards').innerHTML = scoreHTML;

  // Skill proficiency
  const skills = r.topSkills || [];
  document.getElementById('skillProfCard').innerHTML = `<div style="font-size:0.88rem;font-weight:600;margin-bottom:1rem">Top Skills Proficiency</div>` + skills.map(s => {
    const col = s.level >= 80 ? 'var(--green)' : s.level >= 60 ? 'var(--accent)' : 'var(--amber)';
    return `<div class="skill-row"><span class="skill-name">${s.name}</span><div class="skill-bar-wrap"><div class="skill-bar" style="width:${s.level}%;background:${col}"></div></div><span class="skill-pct">${s.level}%</span></div>`;
  }).join('');

  // Top opps
  const topJob = (r.jobs || [])[0];
  const topFreelance = (r.freelance || [])[0];
  document.getElementById('topOppContainer').innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
      ${topJob ? renderJobCard(topJob) : ''}
      ${topFreelance ? renderJobCard(topFreelance, true) : ''}
    </div>
  `;

  // Jobs
  document.getElementById('jobsContainer').innerHTML = (r.jobs || []).map(j => renderJobCard(j)).join('');
  document.getElementById('freelanceContainer').innerHTML = (r.freelance || []).map(j => renderJobCard(j, true)).join('');

  // Projects
  document.getElementById('projectsContainer').innerHTML = (r.projects || []).map(p => `
    <div class="project-card">
      <div class="pc-header">
        <div class="pc-title">${p.title}</div>
        <div class="pc-diff diff-${p.difficulty?.toLowerCase() === 'easy' ? 'easy' : p.difficulty?.toLowerCase() === 'hard' ? 'hard' : 'medium'}">${p.difficulty}</div>
      </div>
      <div class="pc-desc">${p.desc}</div>
      <div style="font-size:0.75rem;color:var(--green);margin-bottom:8px;font-weight:500">✦ ${p.why}</div>
      <div style="font-size:0.75rem;color:var(--text3);margin-bottom:6px">⏱ ${p.estimatedTime}</div>
      <div class="pc-stack">${(p.stack||[]).map(t => `<span class="tech-chip">${t}</span>`).join('')}</div>
    </div>
  `).join('');

  // Salary
  const sd = r.salaryData || {};
  document.getElementById('salaryTopCards').innerHTML = [
    {label:'Current Estimate', val: sd.currentEstimate || '—', col:'var(--text)'},
    {label:'India Potential', val: sd.potentialIndia || '—', col:'var(--accent2)'},
    {label:'Remote (USD)', val: sd.potentialRemote || '—', col:'var(--green)'},
    {label:'Onsite Abroad', val: sd.potentialOnsite || '—', col:'var(--amber)'},
  ].map(c => `<div class="card"><div style="font-size:0.75rem;color:var(--text3);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:6px">${c.label}</div><div style="font-size:1.25rem;font-weight:700;color:${c.col}">${c.val}</div></div>`).join('');

  const roles = sd.roles || [];
  document.getElementById('salaryChartCard').innerHTML = `<div style="font-size:0.88rem;font-weight:600;margin-bottom:1.25rem">Salary Ladder (LPA equivalent)</div>` +
    roles.map(r => {
      const pct = Math.round((r.salaryINR / (r.max || 50)) * 100);
      const col = r.salaryINR >= 40 ? 'var(--green)' : r.salaryINR >= 25 ? 'var(--accent2)' : 'var(--amber)';
      return `<div class="salary-bar-wrap"><div class="salary-role"><span>${r.role}</span><span style="color:${col};font-weight:600">₹${r.salaryINR}L+</span></div><div class="salary-bar-bg"><div class="salary-bar" style="width:${pct}%;background:${col}"></div></div></div>`;
    }).join('');

  const fl = sd.freelanceHourly || {};
  document.getElementById('freelanceRateCards').innerHTML = [
    {label:'Entry Freelance Rate', val: '$'+fl.low+'/hr', sub:'Starting rate on Upwork/Fiverr'},
    {label:'Mid Freelance Rate', val: '$'+fl.mid+'/hr', sub:'After 3–5 reviews, strong portfolio'},
    {label:'Senior Freelance Rate', val: '$'+fl.high+'/hr', sub:'Specialised + proven track record'},
    {label:'Monthly Freelance', val: sd.freelanceMonthly || '₹2-4L', sub:'Working full-time freelance'},
  ].map(c => `<div class="card"><div style="font-size:0.75rem;color:var(--text3);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:4px">${c.label}</div><div style="font-size:1.3rem;font-weight:700;color:var(--green);margin-bottom:2px">${c.val}</div><div style="font-size:0.78rem;color:var(--text2)">${c.sub}</div></div>`).join('');

  // Trends
  document.getElementById('trendsContainer').innerHTML = (r.techTrends || []).map(t => {
    const col = t.heatLevel === 'high' ? 'heat-high' : t.heatLevel === 'mid' ? 'heat-mid' : 'heat-low';
    return `<div class="trend-card"><div class="trend-icon">🔥</div><div class="trend-body"><div class="trend-title">${t.tech}</div><div class="trend-desc">${t.description}</div><div style="display:flex;gap:12px;font-size:0.75rem;color:var(--text3);margin-bottom:6px"><span>⏱ Learn in: ${t.learnTime}</span><span style="color:var(--accent2)">Heat: ${t.heat}/100</span></div><div class="trend-meter"><div class="trend-fill ${col}" style="width:${t.heat}%"></div></div><div style="font-size:0.72rem;color:var(--text3);margin-top:6px">📚 ${t.resources}</div></div></div>`;
  }).join('');

  // Learning roadmap
  document.getElementById('learnRoadmap').innerHTML = (r.learningRoadmap || []).map((item, i) => `
    <div style="display:flex;gap:1rem;margin-bottom:1rem;align-items:flex-start">
      <div style="width:32px;height:32px;border-radius:50%;background:rgba(108,99,255,0.2);color:var(--accent2);display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:600;flex-shrink:0">${i+1}</div>
      <div style="flex:1;padding:1rem;background:var(--bg2);border:1px solid var(--border);border-radius:var(--card-r)">
        <div style="font-size:0.7rem;color:var(--accent2);font-weight:600;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:4px">${item.week}</div>
        <div style="font-weight:600;margin-bottom:4px">${item.focus}</div>
        <div style="font-size:0.82rem;color:var(--text2);margin-bottom:6px">${item.action}</div>
        <div style="font-size:0.78rem;color:var(--green)">✦ ${item.why}</div>
      </div>
    </div>
  `).join('');

  // Gaps
  document.getElementById('gapsContainer').innerHTML = (r.skillGaps || []).map(g => `
    <div class="gap-item">
      <div class="gap-icon">${g.severity === 'high' ? '🚨' : g.severity === 'medium' ? '⚠️' : 'ℹ️'}</div>
      <div>
        <div class="gap-title">${g.skill} <span style="font-size:0.7rem;padding:2px 7px;border-radius:4px;font-weight:600;${g.severity==='high'?'background:rgba(255,90,90,0.12);color:var(--red)':'background:rgba(245,166,35,0.12);color:var(--amber)'}">${g.severity.toUpperCase()}</span></div>
        <div class="gap-desc" style="margin-bottom:6px">${g.impact}</div>
        <div class="gap-fix">→ Fix: ${g.howToFix}</div>
        <div style="font-size:0.75rem;color:var(--text3);margin-top:4px">⏱ Time to fix: ${g.timeToFix}</div>
      </div>
    </div>
  `).join('');

  // Resume
  const res = r.resume || {};
  const skillCats = (res.skillCategories || []);
  document.getElementById('resumeContainer').innerHTML = `
    <div class="resume-container">
      <div class="resume-header">
        <div class="resume-name">${data.name || 'Your Name'}</div>
        <div class="resume-title-line">${res.headline || data.role || 'Software Developer'}</div>
        <div class="resume-contacts">
          ${data.email ? '<span>✉ '+data.email+'</span>' : ''}
          ${data.location ? '<span>📍 '+data.location+'</span>' : ''}
          ${data.linkedinUrl ? '<span>🔗 LinkedIn</span>' : ''}
          ${data.githubUrl ? '<span>⚫ GitHub</span>' : ''}
          ${data.portfolioUrl ? '<span>🌐 Portfolio</span>' : ''}
        </div>
      </div>
      <div class="resume-body">
        <div>
          <div class="resume-section">
            <h3>Professional Summary</h3>
            <p style="font-size:0.82rem;color:#3a3a52;line-height:1.6">${res.summary || ''}</p>
          </div>
          <div class="resume-section">
            <h3>Work Experience</h3>
            ${(res.experience||[]).map(e => `
              <div class="resume-exp">
                <div class="resume-exp-title">${e.title}</div>
                <div class="resume-exp-company">${e.company}</div>
                ${(e.points||[]).map(p => `<div class="resume-exp-item">${p}</div>`).join('')}
              </div>
            `).join('')}
          </div>
          ${(res.achievements?.length) ? `
          <div class="resume-section">
            <h3>Achievements</h3>
            ${res.achievements.map(a => `<div class="resume-exp-item">${a}</div>`).join('')}
          </div>` : ''}
        </div>
        <div>
          <div class="resume-section">
            <h3>Skills</h3>
            ${skillCats.map(sc => `
              <div style="margin-bottom:0.75rem">
                <div style="font-size:0.72rem;font-weight:600;color:#6c63ff;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.5px">${sc.category}</div>
                <div>${(sc.skills||[]).map(s => `<span class="resume-skill-tag">${s}</span>`).join('')}</div>
              </div>
            `).join('')}
            ${!skillCats.length ? data.skills.map(s => `<span class="resume-skill-tag">${s}</span>`).join('') : ''}
          </div>
          <div class="resume-section">
            <h3>Education</h3>
            <div style="font-size:0.82rem;color:#3a3a52">${res.education || data.education || ''}</div>
          </div>
          ${res.certifications?.length ? `
          <div class="resume-section">
            <h3>Certifications</h3>
            ${res.certifications.map(c => `<div style="font-size:0.8rem;color:#3a3a52;margin-bottom:3px">✓ ${c}</div>`).join('')}
          </div>` : ''}
        </div>
      </div>
    </div>
  `;
}

function renderJobCard(j, freelance = false) {
  const match = j.match || 80;
  const col = match >= 85 ? 'var(--green)' : match >= 70 ? 'var(--amber)' : 'var(--text2)';
  return `<div class="job-card">
    <div class="job-icon" style="background:rgba(108,99,255,0.15)">${j.icon || '💼'}</div>
    <div class="job-info">
      <div class="job-title">${j.title}</div>
      <div class="job-desc">${j.desc}</div>
      <div style="font-size:0.78rem;color:var(--text2);margin-bottom:6px">📍 ${freelance ? j.platforms : j.companies}</div>
      <div class="job-tags">
        ${(j.requiredSkills||[]).slice(0,3).map(s => `<span class="jtag jtag-purple">${s}</span>`).join('')}
        <span class="jtag jtag-green">${match}% match</span>
      </div>
    </div>
    <div class="job-salary">
      <div class="job-salary-val">${freelance ? j.rateUSD : j.salaryINR}</div>
      <div class="job-salary-period">${freelance ? 'per hour' : 'per year'}</div>
      ${freelance ? `<div style="font-size:0.72rem;color:var(--text3);margin-top:2px">${j.rateINR}</div>` : `<div style="font-size:0.72rem;color:var(--text3);margin-top:2px">${j.salaryUSD}</div>`}
    </div>
  </div>`;
}

function goToAnalysis() {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-analysis').classList.add('active');
  state.currentStep = 5;
  updateNavSteps();
  window.scrollTo({top: 0, behavior: 'smooth'});
}

function printResume() {
  const el = document.getElementById('resumeContainer');
  const win = window.open('', '_blank');
  win.document.write(`<!DOCTYPE html><html><head><title>Resume</title>
  <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>body{margin:0;font-family:'Sora',sans-serif}*{box-sizing:border-box}</style>
  </head><body>${el.innerHTML}</body></html>`);
  win.document.close();
  setTimeout(() => { win.print(); }, 800);
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  initNavSteps();
  initSkillsGrid();
  initCustomSkill();
  initProfileCards();
  updateNavSteps();
});
