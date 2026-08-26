import { redirect } from "next/navigation";

const LEGACY_TAB_ROUTES: Record<string, string> = {
  advanced: "/admin/settings/advanced",
  ai: "/admin/settings/ai",
  appearance: "/admin/settings/appearance",
  featureFlags: "/admin/settings/feature-flags",
  "feature-flags": "/admin/settings/feature-flags",
  cache: "/admin/settings/cache",
  general: "/admin/settings/general",
  modalityBridge: "/admin/settings/modality-bridge",
  "modality-bridge": "/admin/settings/modality-bridge",
  resilience: "/admin/settings/resilience",
  routing: "/admin/settings/routing",
  security: "/admin/settings/security",
  sidebar: "/admin/settings/sidebar",
};

type SettingsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function resolveSettingsRoute(value: string | undefined): string {
  return value
    ? LEGACY_TAB_ROUTES[value] || "/admin/settings/general"
    : "/admin/settings/general";
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const params = searchParams ? await searchParams : {};
  const tab = Array.isArray(params.tab) ? params.tab[0] : params.tab;
  redirect(resolveSettingsRoute(tab));
}
