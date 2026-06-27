import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  doc,
  collection,
  setDoc,
  deleteDoc,
  getDocs,
  getDoc,
  addDoc,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User
} from "firebase/auth";

let firebaseApp: any = null;
let firestoreDb: any = null;
let firebaseAuth: any = null;

// Helper to parse JS-like config strings to JSON
function parseConfig(configStr: string): any {
  if (!configStr) return null;
  try {
    let cleanStr = configStr.trim();
    const match = cleanStr.match(/\{\s*["']?apiKey["']?\s*:[\s\S]*?\}/);
    if (match) {
      cleanStr = match[0];
    } else {
      const braceIndex = cleanStr.indexOf("{");
      const lastBraceIndex = cleanStr.lastIndexOf("}");
      if (braceIndex !== -1 && lastBraceIndex > braceIndex) {
        cleanStr = cleanStr.substring(braceIndex, lastBraceIndex + 1);
      }
    }

    const jsonCompatible = cleanStr
      .replace(/\/\/.*$/gm, "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/([{,])\s*([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')
      .replace(/'/g, '"')
      .replace(/,\s*([}])/g, "$1");

    return JSON.parse(jsonCompatible);
  } catch (e) {
    console.error("[Firebase] Config parse error:", e);
    return null;
  }
}

export function getFirebaseConfig(): string {
  if (typeof window === "undefined") return "";
  // Check portfolio specific config first, fall back to sadhvi_firebase_config if available
  return localStorage.getItem("mukulmbr_firebase_config") || localStorage.getItem("sadhvi_firebase_config") || "";
}

export function saveFirebaseConfig(configStr: string): boolean {
  if (typeof window === "undefined") return false;
  if (!configStr.trim()) {
    localStorage.removeItem("mukulmbr_firebase_config");
    return true;
  }
  const parsed = parseConfig(configStr);
  if (parsed && parsed.apiKey && parsed.projectId) {
    localStorage.setItem("mukulmbr_firebase_config", configStr);
    return true;
  }
  return false;
}

export function initFirebase() {
  if (typeof window === "undefined") return;

  const configStr = getFirebaseConfig();
  const config = parseConfig(configStr);

  if (config && config.apiKey && config.projectId) {
    try {
      if (getApps().length === 0) {
        firebaseApp = initializeApp(config);
      } else {
        firebaseApp = getApp();
      }
      firestoreDb = getFirestore(firebaseApp);
      firebaseAuth = getAuth(firebaseApp);
      console.log("[Firebase] Portfolio Connected. Project ID:", config.projectId);
    } catch (error) {
      console.error("[Firebase] Initialization error:", error);
    }
  } else {
    console.warn("[Firebase] No config found. Portfolio running in offline/local fallback mode.");
  }
}

// Run initialization
initFirebase();

export const db = () => firestoreDb;
export const auth = () => firebaseAuth;
export const isFirebaseEnabled = () => firestoreDb !== null;

// ─── ADMIN AUTHENTICATION ───────────────────────────────────────────────────
export async function signInAdmin(email: string, password: string): Promise<{ success: boolean; message: string; user?: User }> {
  if (!firebaseAuth) {
    return { success: false, message: "Firebase is not connected. Configure your Firebase project details first." };
  }
  try {
    const credential = await signInWithEmailAndPassword(firebaseAuth, email, password);
    return { success: true, message: "Logged in successfully.", user: credential.user };
  } catch (err: any) {
    return { success: false, message: err.message || "Invalid credentials." };
  }
}

export async function signOutAdmin(): Promise<void> {
  if (firebaseAuth) {
    await signOut(firebaseAuth);
  }
}

export function onAdminAuthChange(callback: (user: User | null) => void): () => void {
  if (!firebaseAuth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(firebaseAuth, callback);
}

// ─── CRUD OPERATIONS FOR PORTFOLIO SECTIONS ──────────────────────────────────

// Fetch all data (Bio, Projects, Skills, Experience)
export async function fetchPortfolioData(): Promise<{
  bio: any | null;
  projects: any[] | null;
  skills: any[] | null;
  experience: any[] | null;
}> {
  if (!isFirebaseEnabled()) return { bio: null, projects: null, skills: null, experience: null };

  try {
    const firestore = firestoreDb;
    
    // Fetch Bio
    const bioDoc = await getDoc(doc(firestore, "portfolio", "bio"));
    const bio = bioDoc.exists() ? bioDoc.data() : null;

    // Fetch Projects
    const projectsSnap = await getDocs(collection(firestore, "portfolio_projects"));
    const projects: any[] = [];
    projectsSnap.forEach(d => projects.push({ id: d.id, ...d.data() }));

    // Fetch Skills
    const skillsSnap = await getDocs(collection(firestore, "portfolio_skills"));
    const skills: any[] = [];
    skillsSnap.forEach(d => skills.push(d.data()));

    // Fetch Experience
    const expSnap = await getDocs(collection(firestore, "portfolio_experience"));
    const experience: any[] = [];
    expSnap.forEach(d => experience.push(d.data()));

    return { bio, projects: projects.length ? projects : null, skills: skills.length ? skills : null, experience: experience.length ? experience : null };
  } catch (e) {
    console.error("[Firebase] Error fetching portfolio data:", e);
    return { bio: null, projects: null, skills: null, experience: null };
  }
}

// Save Bio
export async function savePortfolioBio(bioData: any): Promise<void> {
  if (!isFirebaseEnabled()) return;
  await setDoc(doc(firestoreDb, "portfolio", "bio"), bioData, { merge: true });
}

// Save Project (Create / Update)
export async function savePortfolioProject(project: any): Promise<void> {
  if (!isFirebaseEnabled()) return;
  const projectRef = doc(firestoreDb, "portfolio_projects", project.id);
  await setDoc(projectRef, project, { merge: true });
}

// Delete Project
export async function deletePortfolioProject(projectId: string): Promise<void> {
  if (!isFirebaseEnabled()) return;
  await deleteDoc(doc(firestoreDb, "portfolio_projects", projectId));
}

// Helper to sanitize document IDs (replacing slashes with dashes to avoid subcollection path errors in Firestore)
function sanitizeDocId(id: string): string {
  return id.replace(/\//g, "-");
}

// Save Skill (Create / Update)
export async function savePortfolioSkill(skill: any): Promise<void> {
  if (!isFirebaseEnabled()) return;
  const docId = sanitizeDocId(skill.name);
  const skillRef = doc(firestoreDb, "portfolio_skills", docId);
  await setDoc(skillRef, skill, { merge: true });
}

// Delete Skill
export async function deletePortfolioSkill(skillName: string): Promise<void> {
  if (!isFirebaseEnabled()) return;
  const docId = sanitizeDocId(skillName);
  await deleteDoc(doc(firestoreDb, "portfolio_skills", docId));
}

// Save Experience (Create / Update)
export async function savePortfolioExperience(exp: any): Promise<void> {
  if (!isFirebaseEnabled()) return;
  const docId = sanitizeDocId(exp.company);
  const expRef = doc(firestoreDb, "portfolio_experience", docId);
  await setDoc(expRef, exp, { merge: true });
}

// Delete Experience
export async function deletePortfolioExperience(company: string): Promise<void> {
  if (!isFirebaseEnabled()) return;
  const docId = sanitizeDocId(company);
  await deleteDoc(doc(firestoreDb, "portfolio_experience", docId));
}

// Submit Contact Message
export async function submitContactMessage(name: string, email: string, message: string): Promise<void> {
  if (!isFirebaseEnabled()) return;
  await addDoc(collection(firestoreDb, "portfolio_messages"), {
    name,
    email,
    message,
    timestamp: new Date().toISOString()
  });
}

// Fetch Contact Messages
export async function fetchContactMessages(): Promise<any[]> {
  if (!isFirebaseEnabled()) return [];
  try {
    const snap = await getDocs(collection(firestoreDb, "portfolio_messages"));
    const msgs: any[] = [];
    snap.forEach(d => msgs.push({ id: d.id, ...d.data() }));
    return msgs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (e) {
    console.error("[Firebase] Error fetching contact messages:", e);
    return [];
  }
}

// Delete Contact Message
export async function deleteContactMessage(id: string): Promise<void> {
  if (!isFirebaseEnabled()) return;
  await deleteDoc(doc(firestoreDb, "portfolio_messages", id));
}

// ─── ANALYTICS ───────────────────────────────────────────────────────────────
export async function logAnalyticsEvent(eventType: string, details?: any): Promise<void> {
  if (!isFirebaseEnabled()) return;
  try {
    await addDoc(collection(firestoreDb, "portfolio_analytics"), {
      type: eventType,
      timestamp: new Date().toISOString(),
      ...details
    });
  } catch (e) {
    console.error("[Firebase] Error logging analytics event:", e);
  }
}

export async function fetchAnalyticsEvents(): Promise<any[]> {
  if (!isFirebaseEnabled()) return [];
  try {
    const snap = await getDocs(collection(firestoreDb, "portfolio_analytics"));
    const events: any[] = [];
    snap.forEach(d => events.push({ id: d.id, ...d.data() }));
    return events;
  } catch (e) {
    console.error("[Firebase] Error fetching analytics events:", e);
    return [];
  }
}

// ─── GUESTBOOK ───────────────────────────────────────────────────────────────
export async function fetchGuestbookMessages(): Promise<any[]> {
  if (!isFirebaseEnabled()) return [];
  try {
    const snap = await getDocs(collection(firestoreDb, "portfolio_guestbook"));
    const msgs: any[] = [];
    snap.forEach(d => msgs.push({ id: d.id, ...d.data() }));
    return msgs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (e) {
    console.error("[Firebase] Error fetching guestbook messages:", e);
    return [];
  }
}

export function subscribeToGuestbook(callback: (messages: any[]) => void): () => void {
  if (!isFirebaseEnabled()) {
    callback([]);
    return () => {};
  }
  const q = query(collection(firestoreDb, "portfolio_guestbook"), orderBy("timestamp", "desc"));
  return onSnapshot(q, (snap) => {
    const msgs: any[] = [];
    snap.forEach(d => msgs.push({ id: d.id, ...d.data() }));
    callback(msgs);
  }, (err) => {
    console.error("[Firebase] Guestbook subscription error:", err);
  });
}

export async function addGuestbookMessage(name: string, message: string, avatar: string): Promise<void> {
  if (!isFirebaseEnabled()) return;
  await addDoc(collection(firestoreDb, "portfolio_guestbook"), {
    name,
    message,
    avatar,
    timestamp: new Date().toISOString()
  });
}

// ─── SMART LINKS (DEEP LINK REDIRECTOR) ───────────────────────────────────────
export async function fetchShortLinks(): Promise<any[]> {
  if (!isFirebaseEnabled()) return [];
  try {
    const snap = await getDocs(collection(firestoreDb, "portfolio_links"));
    const links: any[] = [];
    snap.forEach(d => links.push({ id: d.id, ...d.data() }));
    return links;
  } catch (e) {
    console.error("[Firebase] Error fetching short links:", e);
    return [];
  }
}

export async function getShortLink(alias: string): Promise<any | null> {
  if (!isFirebaseEnabled()) return null;
  try {
    const docSnap = await getDoc(doc(firestoreDb, "portfolio_links", alias.toLowerCase().trim()));
    return docSnap.exists() ? docSnap.data() : null;
  } catch (e) {
    console.error("[Firebase] Error fetching short link:", e);
    return null;
  }
}

export async function saveShortLink(link: any): Promise<void> {
  if (!isFirebaseEnabled()) return;
  const aliasId = link.alias.toLowerCase().trim();
  await setDoc(doc(firestoreDb, "portfolio_links", aliasId), {
    ...link,
    alias: aliasId,
    clicks: link.clicks || 0,
    createdAt: link.createdAt || new Date().toISOString()
  }, { merge: true });
}

export async function deleteShortLink(alias: string): Promise<void> {
  if (!isFirebaseEnabled()) return;
  await deleteDoc(doc(firestoreDb, "portfolio_links", alias.toLowerCase().trim()));
}

export async function incrementLinkClicks(alias: string): Promise<void> {
  if (!isFirebaseEnabled()) return;
  try {
    const linkRef = doc(firestoreDb, "portfolio_links", alias.toLowerCase().trim());
    const docSnap = await getDoc(linkRef);
    if (docSnap.exists()) {
      const currentClicks = docSnap.data().clicks || 0;
      await setDoc(linkRef, { clicks: currentClicks + 1 }, { merge: true });
    }
  } catch (e) {
    console.error("[Firebase] Error incrementing link clicks:", e);
  }
}
