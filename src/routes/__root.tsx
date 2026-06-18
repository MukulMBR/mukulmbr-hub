import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gradient">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This page drifted off into the aurora.
        </p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-gradient-brand px-4 py-2 text-sm font-medium text-primary-foreground">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight">Something glitched</h1>
        <p className="mt-2 text-sm text-muted-foreground">Try again or head back home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="rounded-md bg-gradient-brand px-4 py-2 text-sm font-medium text-primary-foreground">Try again</button>
          <a href="/" className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent/20">Go home</a>
        </div>
      </div>
    </div>
  );
}

const themeInitScript = `(function(){try{var s=localStorage.getItem('theme');var m=window.matchMedia('(prefers-color-scheme: dark)').matches;var d=s?s==='dark':m;var r=document.documentElement;if(d){r.classList.add('dark');}else{r.classList.remove('dark');}r.style.colorScheme=d?'dark':'light';}catch(e){document.documentElement.classList.add('dark');}})();`;

const SITE_URL = "https://mukulmbr.lovable.app";
const OG_IMAGE = "https://storage.googleapis.com/gpt-engineer-file-uploads/kKBXKzFqTYM1g1UYtrGl0suxJh12/social-images/social-1781625241275-Gemini_Generated_Image_v848u6v848u6v848.webp";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mukul Bushi Reddy M",
  alternateName: "Mukul",
  jobTitle: "Frontend Developer",
  url: SITE_URL,
  image: OG_IMAGE,
  email: "mailto:mukulmotakatla7@gmail.com",
  telephone: "+91-8919866652",
  sameAs: [
    "https://www.linkedin.com/in/mukul-bushi-reddy-m-0170471a2/",
    "https://github.com/MukulMBR",
  ],
  knowsAbout: [
    "Frontend Development", "Angular", "TypeScript", "React", "Flutter",
    "Spring Boot", "Firebase", "Node.js", "AI Integration", "Gemini API",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Mukul — Frontend Developer Portfolio",
  url: SITE_URL,
  author: { "@type": "Person", name: "Mukul Bushi Reddy M" },
};

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#0b0b14" },
      { name: "keywords", content: "Mukul, Frontend Developer, Angular Developer, TypeScript, React Developer, Flutter Developer, AI Application Builder, Firebase, Product Engineer" },
      { name: "author", content: "Mukul Bushi Reddy M" },
      { name: "google-site-verification", content: "IqwuEoCU7zyISUaUE9fmEIsyzfVMiDZgry0u9xV8LYM" },
      { name: "robots", content: "index,follow,max-image-preview:large" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Mukul" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "alternate icon", href: "/favicon.ico" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap" },
    ],
    scripts: [
      { children: themeInitScript },
      { type: "application/ld+json", children: JSON.stringify(personSchema) },
      { type: "application/ld+json", children: JSON.stringify(websiteSchema) },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><HeadContent /></head>
      <body suppressHydrationWarning>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
