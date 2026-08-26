import { redirect } from "next/navigation";

// `/admin/context` is a hub with only sub-routes (settings, combos, ultra,
// …) and no page of its own, so Next.js RSC prefetches of the bare parent
// route 404'd (#5298). Redirect the parent to its canonical sub-route, honoring
// a legacy `?tab=` query for deep links.
const CONTEXT_TAB_ROUTES: Record<string, string> = {
  settings: "/admin/context/settings",
  combos: "/admin/context/combos",
  caveman: "/admin/context/caveman",
  rtk: "/admin/context/rtk",
  headroom: "/admin/context/headroom",
  "session-dedup": "/admin/context/session-dedup",
  sessionDedup: "/admin/context/session-dedup",
  ccr: "/admin/context/ccr",
  llmlingua: "/admin/context/llmlingua",
  lite: "/admin/context/lite",
  aggressive: "/admin/context/aggressive",
  ultra: "/admin/context/ultra",
};

const DEFAULT_CONTEXT_ROUTE = "/admin/context/settings";

export function resolveContextRoute(value: string | undefined): string {
  return value ? CONTEXT_TAB_ROUTES[value] || DEFAULT_CONTEXT_ROUTE : DEFAULT_CONTEXT_ROUTE;
}

type ContextPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ContextPage({ searchParams }: ContextPageProps) {
  const params = searchParams ? await searchParams : {};
  const tab = Array.isArray(params.tab) ? params.tab[0] : params.tab;
  redirect(resolveContextRoute(tab));
}
