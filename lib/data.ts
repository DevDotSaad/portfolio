// All site content lives here. Every fact comes from the CV / project brief —
// anything not yet supplied is marked as a placeholder (see README "Placeholders").
import type { IconKey } from './icons.generated';
import type { ScreenKey } from './screens.generated';

export const SITE = {
  name: 'Muhammad Saad Zubair',
  short: 'SZ',
  title: 'AI Engineer & Full Stack AI Developer',
  location: 'Karachi, Pakistan',
  intro:
    'I build real-time AI products end to end — speech, retrieval, LLMs, desktop and web — and the automations that run around them.',
  email: 'muhammadsaadzubair10@gmail.com',
  phone: '+92 336 2179891',
  phoneHref: 'tel:+923362179891',
  linkedin: 'https://www.linkedin.com/in/muhammad-saad-zubair-272684321', // from the CV
  cv: '/Muhammad-Saad-Zubair-CV.pdf',
  heroChips: ['AI Automation · RAG · Real-time voice', 'Leads a small dev team'],
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://muhammadsaadzubair.vercel.app', // PLACEHOLDER: production domain
};

export const NAV = [
  { id: 'work', label: 'Work' },
  { id: 'projects', label: 'Projects' },
  { id: 'stack', label: 'Stack' },
  { id: 'concepts', label: 'Concepts' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
] as const;

export const MARQUEE = [
  'React', 'Next.js', 'Node.js', 'Python', 'Supabase', 'pgvector', 'OpenAI', 'Gemini', 'Claude',
  'WebRTC', 'Electron', 'GoHighLevel', 'Close', 'Retell.ai', 'Zapier',
];

/* ───────────────────────────── Concepts ───────────────────────────── */

export type ConceptId =
  | 'rag' | 'embeddings' | 'prompting' | 'stt' | 'tts' | 'webrtc'
  | 'node' | 'electron' | 'webhooks' | 'capi' | 'voice-agents' | 'rls';

export type Concept = { id: ConceptId; name: string; def: string; usedIn: ProjectSlug[] };

export const CONCEPTS: Concept[] = [
  {
    id: 'rag',
    name: 'RAG (retrieval-augmented generation)',
    def: 'Relevant passages are fetched from your own documents at question time and handed to the LLM, so answers are grounded in that material rather than in what the model memorised.',
    usedIn: ['coach-ai', 'sales-copilot'],
  },
  {
    id: 'embeddings',
    name: 'Vector embeddings & pgvector',
    def: 'Text becomes numeric vectors where similar meanings sit close together. pgvector stores them inside PostgreSQL and returns the nearest matches with a similarity query.',
    usedIn: ['coach-ai'],
  },
  {
    id: 'prompting',
    name: 'Fine-tuned prompting & model routing',
    def: 'Prompts are refined and structured for one specific job, and each request is routed to the model — OpenAI, Gemini or Claude — that suits that job best.',
    usedIn: ['coach-ai'],
  },
  {
    id: 'stt',
    name: 'Real-time STT (Whisper) & VAD',
    def: 'Speech-to-text turns audio into text as it is spoken; Whisper is an open speech-recognition model. Voice activity detection marks where speech starts and stops.',
    usedIn: ['ai-interpreter', 'coach-ai', 'sales-copilot'],
  },
  {
    id: 'tts',
    name: 'TTS (Piper) & virtual audio devices',
    def: 'Piper is a fast, local neural text-to-speech engine. A virtual audio device such as VB-Cable lets other apps hear that generated voice as if it came from a microphone.',
    usedIn: ['ai-interpreter'],
  },
  {
    id: 'webrtc',
    name: 'WebRTC & real-time media capture',
    def: 'WebRTC is the web standard for low-latency audio and video. Media-capture APIs read the microphone, system audio or screen as a live stream an app can process.',
    usedIn: ['coach-ai', 'sales-copilot', 'ai-interpreter'],
  },
  {
    id: 'node',
    name: 'Node.js event-driven backends',
    def: 'Node.js serves many connections on a single event loop, reacting to requests, sockets and streams without blocking — a good fit for real-time APIs.',
    usedIn: ['coach-ai'],
  },
  {
    id: 'electron',
    name: 'Electron overlays & screen-share exclusion',
    def: 'Electron ships a web UI as a desktop app. A transparent, always-on-top window becomes an overlay, and content protection keeps it out of screen shares.',
    usedIn: ['sales-copilot', 'ai-interpreter', 'coach-ai'],
  },
  {
    id: 'webhooks',
    name: 'Webhooks & event-driven CRM automation',
    def: 'A webhook is an HTTP call one system sends the moment something happens — a form submit, a booking — so the CRM can trigger the next step instantly.',
    usedIn: ['crm-automation-suite'],
  },
  {
    id: 'capi',
    name: 'Meta Pixel + Conversions API',
    def: 'The Pixel reports conversions from the browser; the Conversions API sends the same events from a server. Together, deduplicated, they keep ad attribution reliable.',
    usedIn: ['crm-automation-suite'],
  },
  {
    id: 'voice-agents',
    name: 'AI voice agents (Retell.ai, Close Chloe)',
    def: 'An AI voice agent holds a phone conversation by chaining speech recognition, an LLM and speech synthesis — here built with Retell.ai and Close CRM’s “Chloe”.',
    usedIn: ['crm-automation-suite'],
  },
  {
    id: 'rls',
    name: 'Supabase auth + Row Level Security',
    def: 'Supabase pairs PostgreSQL with built-in authentication. Row Level Security policies make the database itself enforce which rows each user may read or write.',
    usedIn: ['ai-interpreter'],
  },
];

/* ───────────────────────────── Projects ───────────────────────────── */

export type ProjectSlug = 'coach-ai' | 'sales-copilot' | 'ai-interpreter' | 'crm-automation-suite';

export type FlowNode = { title: string; sub?: string };
export type Diagram = {
  label: string;
  nodes: FlowNode[];
  /** Optional supporting node drawn under one of the main nodes. */
  branch?: { at: number; title: string; sub?: string; direction: 'in' | 'out' };
};

export type Project = {
  slug: ProjectSlug;
  name: string;
  /** Name as shown in titles, e.g. "Coach AI — PainterGrowth.com". */
  fullName: string;
  client: string;
  kicker: string;
  tagline: string;
  status?: string;
  link: { href: string; label: string; placeholder?: boolean };
  host: string;
  problem: string;
  built: string[];
  diagram: Diagram;
  stack: string[];
  role: string;
  concepts: ConceptId[];
  clients?: { name: string; line: string; placeholder?: boolean }[];
  /** Best screenshot for the home-page mockup (must be hi-res); none → placeholder frame. */
  cover?: ScreenKey;
  /** Up to four screenshots for the case-study lightbox grid. */
  shots: ScreenKey[];
  /** Text on the placeholder frame when there are no screenshots. */
  noShots?: string;
};

export const PROJECTS: Project[] = [
  {
    slug: 'coach-ai',
    name: 'Coach AI',
    fullName: 'Coach AI — PainterGrowth.com',
    client: 'PainterGrowth.com',
    kicker: 'Real-time AI coaching · Windows + macOS',
    tagline: 'A real-time AI customer-success coaching platform, built end to end — from audio capture to the on-screen overlay.',
    link: { href: 'https://coach-ai-five-beta.vercel.app/', label: 'live project' }, // “Live Project” link from the CV
    host: 'painter-growth · coach ai',
    problem:
      'Customer-success conversations move fast, and the answer a rep needs is usually buried in the company’s own documents and past calls. Coaching has to arrive during the conversation, grounded in that material — not in generic model knowledge.',
    built: [
      'Web app in Next.js + React.',
      'Supabase / PostgreSQL + pgvector for the CRM, the knowledge base and persistent per-customer memory.',
      'RAG: the company’s documents and past calls are chunked, embedded and retrieved at the moment of the question, so coaching is grounded in their material.',
      'LLM layer with fine-tuned prompting and model routing across OpenAI, Gemini and Claude.',
      'Python real-time speech-to-text capturing both microphone and system audio.',
      'Electron desktop overlay with one-click installers for Windows and macOS; deployed to the cloud.',
    ],
    diagram: {
      label: 'Coach AI architecture: audio capture, speech-to-text, retrieval from pgvector, LLM, overlay',
      nodes: [
        { title: 'Audio capture', sub: 'Mic + system audio' },
        { title: 'Real-time STT', sub: 'Python' },
        { title: 'Retrieval', sub: 'pgvector · RAG' },
        { title: 'LLM', sub: 'OpenAI · Gemini · Claude' },
        { title: 'Overlay', sub: 'Electron · Win + macOS' },
      ],
      branch: { at: 2, title: 'Supabase / PostgreSQL', sub: 'CRM · knowledge base · memory', direction: 'in' },
    },
    stack: ['Next.js', 'React', 'Supabase', 'PostgreSQL', 'pgvector', 'Python', 'OpenAI', 'Gemini', 'Claude', 'Electron'],
    role: 'Built end to end: web app, data layer, retrieval pipeline, LLM layer, real-time audio and the desktop overlay with its installers, through to cloud deployment.',
    concepts: ['rag', 'embeddings', 'prompting', 'stt', 'webrtc', 'electron', 'node'],
    cover: 'coach-ai-dashboard',
    shots: ['coach-ai-dashboard', 'coach-ai-live-coach', 'coach-ai-knowledge-base', 'coach-ai-meetings'],
  },
  {
    slug: 'sales-copilot',
    name: 'AI Real-Time Sales Copilot',
    fullName: 'AI Real-Time Sales Copilot — Thelaywala',
    client: 'Thelaywala',
    kicker: 'Live sales-call coaching · Windows + macOS',
    tagline: 'A real-time coaching overlay that suggests the next line while the customer is still speaking.',
    link: { href: 'https://salescoach.thelaywala.com', label: 'salescoach.thelaywala.com' },
    host: 'salescoach.thelaywala.com',
    problem:
      'On a live sales call a rep has to listen, handle objections and steer the conversation at once. Help needs to arrive while the customer is still talking, drawn from what has worked on the team’s own calls — and stay invisible on a shared screen.',
    built: [
      'Dual-side live transcription of both the rep and the customer.',
      'Next-line suggestions generated while the customer is still speaking.',
      'Objection and buying-signal detection.',
      'RAG over the team’s own winning calls.',
      'AI call summaries and follow-up email drafting.',
      'Saved sessions and usage dashboards.',
      'Overlay that stays invisible in screen-share.',
    ],
    diagram: {
      label: 'AI Real-Time Sales Copilot architecture: dual-side audio, live transcription, retrieval over winning calls, LLM suggestions, hidden overlay',
      nodes: [
        { title: 'Call audio', sub: 'Rep + customer' },
        { title: 'Live STT', sub: 'Dual-side transcript' },
        { title: 'Retrieval', sub: 'RAG · winning calls' },
        { title: 'LLM', sub: 'Suggestions · signals' },
        { title: 'Overlay', sub: 'Hidden in screen-share' },
      ],
      branch: { at: 3, title: 'After the call', sub: 'Summary · follow-up email · dashboards', direction: 'out' },
    },
    stack: ['Desktop overlay · Win + macOS', 'Real-time STT', 'RAG', 'LLMs'],
    role: 'Full Stack AI Developer at Thelaywala. Same architecture family as Coach AI — real-time audio, retrieval, LLM and a desktop overlay.',
    concepts: ['rag', 'stt', 'webrtc', 'electron'],
    cover: 'sales-copilot-dashboard-home',
    shots: ['sales-copilot-dashboard-home', 'sales-copilot-overlay-live-call', 'sales-copilot-dashboard-weekly', 'sales-copilot-dashboard-reports'],
  },
  {
    slug: 'ai-interpreter',
    name: 'AI Interpreter',
    fullName: 'AI Interpreter',
    client: 'Independent product · founder & builder',
    kicker: 'Live two-way voice translation',
    tagline: 'Speak your language on Zoom, Meet or Teams — the other side hears theirs, through a virtual microphone.',
    status: 'Launching soon',
    link: { href: '#', label: 'Launching soon', placeholder: true },
    host: 'ai interpreter',
    problem:
      'Calls on Zoom, Meet and Teams break down when the two sides don’t share a language. Translation has to happen live, in both directions, and reach the other side as a voice through the normal meeting audio.',
    built: [
      'On-device Whisper speech-to-text with voice activity detection.',
      'Argos machine translation.',
      'Piper TTS routed into a virtual microphone (VB-Cable), so meeting apps hear the translated voice.',
      'Floating caption overlay that is invisible in screen-share.',
      'Acoustic echo cancellation, plus headphones / speakers auto-detect via Windows Core Audio.',
      'Electron overlay, Next.js dashboard and a GSAP marketing site.',
      'Supabase auth with Row Level Security usage metering.',
    ],
    diagram: {
      label: 'AI Interpreter architecture: call audio, voice activity detection, speech-to-text, machine translation, text-to-speech, virtual microphone',
      nodes: [
        { title: 'Call audio', sub: 'Zoom · Meet · Teams' },
        { title: 'VAD', sub: 'Speech detection' },
        { title: 'STT', sub: 'Whisper · on-device' },
        { title: 'MT', sub: 'Argos' },
        { title: 'TTS', sub: 'Piper' },
        { title: 'Virtual mic', sub: 'VB-Cable' },
      ],
      branch: { at: 3, title: 'Caption overlay', sub: 'Hidden in screen-share', direction: 'out' },
    },
    stack: ['Whisper', 'Argos', 'Piper', 'VB-Cable', 'Windows Core Audio', 'Electron', 'Next.js', 'GSAP', 'Supabase'],
    role: 'Designed and built end to end — audio pipeline, desktop overlay, dashboard, marketing site and Supabase auth.',
    concepts: ['stt', 'tts', 'webrtc', 'electron', 'rls'],
    // Its own marketing site; the “Built by Thelaywala” line is cropped out.
    cover: 'ai-interpreter-site-hero',
    shots: ['ai-interpreter-site-hero', 'ai-interpreter-site-pipeline', 'ai-interpreter-site-they-speak', 'ai-interpreter-site-on-your-machine'],
  },
  {
    slug: 'crm-automation-suite',
    name: 'CRM & AI Automation Suite',
    fullName: 'CRM & AI Automation Suite',
    client: 'GoHighLevel + Close',
    kicker: 'Funnels · tracking · AI bots · voice agents',
    tagline: 'Lead capture to human handoff — funnels, tracking, pipelines, AI chat bots and AI voice agents for four businesses.',
    link: { href: '#', label: 'Case study', placeholder: true },
    host: 'gohighlevel · close',
    problem:
      'Each business needed leads captured, tracked, followed up and qualified across ads, forms, SMS, web chat and phone — without manual work, and with a person stepping in when it matters.',
    built: [
      'Lead-capture funnels and landing pages with real-time webhooks.',
      'Meta Pixel + Conversions API tracking.',
      'Pipelines and lead routing.',
      'Email / SMS sequences.',
      'AI chat bots trained per business for SMS and web.',
      'Retell.ai AI voice calling agents and the Close CRM “Chloe” AI calling agent.',
      'Zapier integrations and human-handoff flows.',
    ],
    diagram: {
      label: 'Automation flow: ad or form, webhook, CRM pipeline, AI bot or agent, sequence, human handoff',
      nodes: [
        { title: 'Ad / form', sub: 'Meta Pixel + CAPI' },
        { title: 'Webhook', sub: 'Real-time' },
        { title: 'CRM pipeline', sub: 'GHL · Close · routing' },
        { title: 'AI bot / agent', sub: 'SMS · web · Retell · Chloe' },
        { title: 'Sequence', sub: 'Email · SMS' },
        { title: 'Human handoff', sub: 'Team takes over' },
      ],
    },
    stack: ['GoHighLevel', 'Close CRM', 'Retell.ai', 'Zapier', 'Webhooks', 'Meta Pixel', 'Conversions API'],
    role: 'AI Automation Engineer — designed and built the funnels, tracking, pipelines, sequences, AI bots, voice agents and handoff flows.',
    concepts: ['webhooks', 'capi', 'voice-agents'],
    cover: 'crm-ghl-workflow-pipeline-sync',
    shots: ['crm-ghl-workflow-pipeline-sync', 'crm-ghl-workflow-customer-emails', 'crm-ghl-workflow-reply-branches', 'crm-ghl-workflow-pvl-purchase'],
    clients: [
      { name: 'Thelaywala', line: 'Lead-capture funnels, webhooks, email/SMS sequences, AI chat bots' },
      { name: 'PainterGrowth', line: 'CRM pipelines, lead routing, automated follow-ups' },
      { name: 'Prime Vitality Labs', line: 'Purchase-triggered workflows, email automation, AI reply branches' },
      { name: 'Trady In Lab', line: 'Lead qualification bot and SMS follow-up sequences' },
    ],
  },
];

export const projectBySlug = (slug: string) => PROJECTS.find((p) => p.slug === slug);
export const conceptById = (id: ConceptId) => CONCEPTS.find((c) => c.id === id)!;

// Links are the ones in the CV.
export const MORE_PROJECTS: { name: string; desc: string; tags: string[]; href: string; thumb: ScreenKey }[] = [
  { name: 'Salon Website', desc: 'GHL lead-gen funnel + CRM automation.', tags: ['GoHighLevel', 'Funnel', 'CRM'], href: 'https://salon.thelaywala.com/home', thumb: 'salon-hero' },
  { name: 'Weather App', desc: 'OpenWeather API with a responsive UI.', tags: ['OpenWeather API', 'Responsive'], href: 'https://weather-app-msz.netlify.app/', thumb: 'weather-dashboard' },
  { name: 'TaskFlow', desc: 'React / Vite productivity app with persistent storage.', tags: ['React', 'Vite'], href: 'https://taskflow-msz.netlify.app/', thumb: 'taskflow-home' },
  { name: 'Blog App', desc: 'Multi-page React app built from reusable components.', tags: ['React', 'Components'], href: 'https://blog-app-msz.netlify.app/', thumb: 'blog-home' },
];

/* ───────────────────────────── Stack ───────────────────────────── */

type Use = { label: string; href: string };
const w = (slug: ProjectSlug): Use => ({ label: projectBySlug(slug)!.name, href: `/work/${slug}/` });
const more = (name: string): Use => ({ label: name, href: '#projects' });
const concept = (id: ConceptId, label: string): Use => ({ label, href: `#concept-${id}` });

export type Tool = { name: string; icon?: IconKey; mono?: string; used: Use[] };
export type Hub = { id: string; name: string; tools: Tool[] };

export const STACK: Hub[] = [
  {
    id: 'frontend',
    name: 'Frontend',
    tools: [
      { name: 'HTML5', icon: 'html5', used: [more('Weather App'), more('Blog App')] },
      { name: 'CSS3', icon: 'css', used: [more('Weather App'), more('Blog App')] },
      { name: 'JavaScript ES6+', icon: 'javascript', used: [more('Weather App'), more('TaskFlow')] },
      { name: 'React', icon: 'react', used: [w('coach-ai'), more('TaskFlow'), more('Blog App')] },
      { name: 'Next.js', icon: 'nextjs', used: [w('coach-ai'), w('ai-interpreter')] },
      { name: 'TailwindCSS', icon: 'tailwind', used: [] },
      { name: 'Bootstrap', icon: 'bootstrap', used: [] },
      { name: 'GSAP', icon: 'gsap', used: [w('ai-interpreter')] },
    ],
  },
  {
    id: 'backend',
    name: 'Backend & Data',
    tools: [
      { name: 'Node.js', icon: 'node', used: [concept('node', 'Event-driven backends')] },
      { name: 'Python', icon: 'python', used: [w('coach-ai')] },
      { name: 'REST APIs', mono: 'API', used: [more('Weather App')] },
      { name: 'WebRTC', icon: 'webrtc', used: [concept('webrtc', 'Real-time media capture')] },
      { name: 'Supabase / PostgreSQL', icon: 'supabase', used: [w('coach-ai'), w('ai-interpreter')] },
      { name: 'pgvector', icon: 'postgresql', used: [w('coach-ai')] },
      { name: 'SQL', mono: 'SQL', used: [w('coach-ai')] },
      { name: 'Pandas / NumPy', icon: 'pandas', used: [] },
    ],
  },
  {
    id: 'ai',
    name: 'AI & Automation',
    tools: [
      { name: 'OpenAI API', mono: 'OAI', used: [w('coach-ai')] },
      { name: 'Google Gemini', icon: 'gemini', used: [w('coach-ai')] },
      { name: 'Claude API', icon: 'claude', used: [w('coach-ai')] },
      { name: 'RAG', mono: 'RAG', used: [w('coach-ai'), w('sales-copilot')] },
      { name: 'Fine-tuned prompting', mono: 'PR', used: [w('coach-ai')] },
      { name: 'Whisper', mono: 'WSP', used: [w('ai-interpreter')] },
      { name: 'Piper', mono: 'TTS', used: [w('ai-interpreter')] },
      { name: 'GoHighLevel bots / workflows', mono: 'GHL', used: [w('crm-automation-suite'), more('Salon Website')] },
      { name: 'Close CRM', mono: 'CL', used: [w('crm-automation-suite')] },
      { name: 'Retell.ai voice agents', mono: 'RT', used: [w('crm-automation-suite')] },
      { name: 'Zapier', icon: 'zapier', used: [w('crm-automation-suite')] },
      { name: 'Webhooks', mono: 'WH', used: [w('crm-automation-suite')] },
      { name: 'Meta CAPI', icon: 'meta', used: [w('crm-automation-suite')] },
    ],
  },
  {
    id: 'engineering',
    name: 'Engineering',
    tools: [
      { name: 'OOP', mono: 'OOP', used: [] },
      { name: 'SDLC', mono: 'SDLC', used: [] },
      { name: 'API integration', mono: 'INT', used: [w('crm-automation-suite'), more('Weather App')] },
      { name: 'Reusable architecture', mono: 'ARC', used: [more('Blog App')] },
      { name: 'Debugging', mono: 'DBG', used: [] },
      { name: 'Electron packaging', icon: 'electron', used: [w('coach-ai'), w('sales-copilot'), w('ai-interpreter')] },
      { name: 'Vercel', icon: 'vercel', used: [] },
    ],
  },
];

/* ───────────────────────────── Experience & education ───────────────────────────── */

export const EXPERIENCE = [
  {
    org: 'Thelaywala.com',
    role: 'AI Engineer & Full Stack AI Developer',
    date: 'Jan 2026 – Present',
    current: true,
    // First three: the CV's exact wording. Last: leadership line from the content brief.
    bullets: [
      'Build responsive lead-capture funnels and landing pages with real-time webhooks, CRM pipelines, Meta Pixel/CAPI tracking, and automated email/SMS workflows.',
      'Design and maintain automation across GoHighLevel and Close CRM, including lead routing, pipelines, sequences, Zapier integrations, and webhook-driven processes.',
      'Configure and train conversational bots and voice agents in GoHighLevel and Retell.ai, refining prompts, call flows, knowledge/context, qualification logic, and human handoffs.',
      'Lead developer on the team’s AI products; currently training and supervising two new developer interns.',
    ],
  },
  // Bullets below: the CV's exact wording.
  {
    org: 'Data Zenix Solutions',
    role: 'Data Science Intern',
    date: 'Sep 2025',
    bullets: ['Cleaned datasets, supported analytics-dashboard creation, and delivered data insights that improved reporting efficiency and stakeholder communication.'],
  },
  {
    org: 'Elevvo Pathways',
    role: 'Frontend Intern',
    date: 'Jul – Aug 2025',
    bullets: ['Built responsive CSS layouts and JavaScript interactivity, developed reusable React components, and improved UI performance through clean design.'],
  },
  {
    org: 'SMIT',
    role: 'Web Development Trainee',
    date: '2023 – 2024',
    bullets: ['Built responsive web interfaces with HTML, CSS, and JavaScript while developing clean UI design and software-development practices.'],
  },
];

export const EDUCATION = [
  { degree: 'BS Software Engineering', school: 'Sir Syed University', date: '2022 – 2026' },
  { degree: 'Pre-Engineering', school: 'DJ Science College', date: '2020 – 2022' },
];

export const CERTS = [
  { name: 'Web Development', issuer: 'SMIT', year: '2024' },
  { name: 'AI', issuer: 'HP LIFE', year: '2025' },
  { name: 'Frontend', issuer: 'Elevvo', year: '2025' },
  { name: 'Data Science', issuer: 'Data Zenix', year: '2025' },
];

/* ───────────────────────────── How I work ───────────────────────────── */

export const HOW_I_WORK = [
  { title: 'Ships end to end', icon: 'ship' },
  { title: 'Mentors and reviews junior developers’ work', icon: 'mentor' },
  { title: 'Measures before claiming', icon: 'measure' },
] as const;
