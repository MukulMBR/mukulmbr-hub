// Lightweight analytics layer. Wire any provider (GA4, GTM, Clarity) by implementing trackEvent.
// Until a real provider is connected, events log to console in dev for verification.

type EventName =
  | "page_view"
  | "project_click"
  | "contact_submit"
  | "contact_success"
  | "contact_error"
  | "resume_download"
  | "github_click"
  | "linkedin_click"
  | "email_click"
  | "phone_click"
  | "whatsapp_click"
  | "theme_switch"
  | "scroll_depth"
  | "cta_click";

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export function trackEvent(name: EventName, params: Record<string, any> = {}) {
  if (typeof window === "undefined") return;
  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", name, params);
    } else if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: name, ...params });
    } else if (import.meta.env?.DEV) {
      // eslint-disable-next-line no-console
      console.debug("[analytics]", name, params);
    }
  } catch {
    /* noop */
  }
}

export function initScrollDepth() {
  if (typeof window === "undefined") return;
  const milestones = [25, 50, 75, 100];
  const fired = new Set<number>();
  const onScroll = () => {
    const h = document.documentElement;
    const pct = Math.round(((h.scrollTop + window.innerHeight) / h.scrollHeight) * 100);
    for (const m of milestones) {
      if (pct >= m && !fired.has(m)) {
        fired.add(m);
        trackEvent("scroll_depth", { percent: m });
      }
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}
