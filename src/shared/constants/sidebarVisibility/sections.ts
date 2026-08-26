import type {
  SidebarItemDefinition,
  SidebarItemGroup,
  SidebarSectionChild,
  SidebarSectionDefinition,
} from "./types";

// ─── Item arrays ────────────────────────────────────────────────────────────

const HOME_ITEMS: readonly SidebarItemDefinition[] = [
  {
    id: "home",
    href: "/home",
    i18nKey: "home",
    subtitleKey: "homeSubtitle",
    icon: "home",
    exact: true,
  },
];

const OMNI_PROXY_ITEMS: readonly SidebarItemDefinition[] = [
  {
    id: "endpoints",
    href: "/admin/endpoint",
    i18nKey: "endpoints",
    subtitleKey: "endpointsSubtitle",
    icon: "api",
  },
  {
    id: "api-manager",
    href: "/admin/api-manager",
    i18nKey: "apiManager",
    subtitleKey: "apiManagerSubtitle",
    icon: "vpn_key",
  },
  {
    id: "providers",
    href: "/admin/providers",
    i18nKey: "providers",
    subtitleKey: "providersSubtitle",
    icon: "dns",
  },
  {
    id: "embedded-services",
    href: "/admin/providers/services",
    i18nKey: "embeddedServices",
    subtitleKey: "embeddedServicesSubtitle",
    icon: "deployed_code",
  },
  {
    id: "combos",
    href: "/admin/combos",
    i18nKey: "combos",
    subtitleKey: "combosSubtitle",
    icon: "layers",
  },
  {
    id: "combos-live",
    href: "/admin/combos/live",
    i18nKey: "combosLive",
    labelFallback: "Combo Studio",
    subtitleKey: "combosLiveSubtitle",
    subtitleFallback: "Live routing cascade",
    icon: "account_tree",
  },
  {
    id: "quota",
    href: "/admin/quota",
    i18nKey: "providerQuota",
    subtitleKey: "providerQuotaSubtitle",
    icon: "tune",
  },
  {
    id: "costs-quota-share",
    href: "/admin/costs/quota-share",
    i18nKey: "costsQuotaShare",
    subtitleKey: "costsQuotaShareSubtitle",
    icon: "pie_chart",
  },
];

export const COMPRESSION_CONTEXT_GROUP: SidebarItemGroup = {
  type: "group",
  id: "compression-context",
  titleKey: "compressionContextGroup",
  titleFallback: "Compression Context",
  // Order: Settings (the unified panel) → Combos → per-engine pages → Studio (analytics).
  items: [
    {
      id: "context-settings",
      href: "/admin/context/settings",
      i18nKey: "contextSettings",
      labelFallback: "Compression Settings",
      subtitleKey: "contextSettingsSubtitle",
      subtitleFallback: "Global defaults",
      icon: "settings",
    },
    {
      id: "context-combos",
      href: "/admin/context/combos",
      i18nKey: "contextCombos",
      subtitleKey: "contextCombosSubtitle",
      icon: "hub",
    },
    {
      id: "context-caveman",
      href: "/admin/context/caveman",
      i18nKey: "contextCaveman",
      subtitleKey: "contextCavemanSubtitle",
      icon: "compress",
    },
    {
      id: "context-rtk",
      href: "/admin/context/rtk",
      i18nKey: "contextRtk",
      subtitleKey: "contextRtkSubtitle",
      icon: "filter_alt",
    },
    {
      id: "context-headroom",
      href: "/admin/context/headroom",
      i18nKey: "contextHeadroom",
      labelFallback: "Headroom",
      subtitleKey: "contextHeadroomSubtitle",
      subtitleFallback: "Tabular compaction",
      icon: "table_rows",
    },
    {
      id: "context-session-dedup",
      href: "/admin/context/session-dedup",
      i18nKey: "contextSessionDedup",
      labelFallback: "Session Dedup",
      subtitleKey: "contextSessionDedupSubtitle",
      subtitleFallback: "Cross-turn dedup",
      icon: "content_copy",
    },
    {
      id: "context-ccr",
      href: "/admin/context/ccr",
      i18nKey: "contextCcr",
      labelFallback: "CCR",
      subtitleKey: "contextCcrSubtitle",
      subtitleFallback: "Retrieve markers",
      icon: "archive",
    },
    {
      id: "context-llmlingua",
      href: "/admin/context/llmlingua",
      i18nKey: "contextLlmlingua",
      labelFallback: "LLMLingua",
      subtitleKey: "contextLlmlinguaSubtitle",
      subtitleFallback: "Semantic pruning",
      icon: "psychology",
    },
    {
      id: "context-lite",
      href: "/admin/context/lite",
      i18nKey: "contextLite",
      labelFallback: "Lite",
      subtitleKey: "contextLiteSubtitle",
      subtitleFallback: "Fast whitespace cleanup",
      icon: "compress",
    },
    {
      id: "context-aggressive",
      href: "/admin/context/aggressive",
      i18nKey: "contextAggressive",
      labelFallback: "Aggressive",
      subtitleKey: "contextAggressiveSubtitle",
      subtitleFallback: "Summary + aging",
      icon: "speed",
    },
    {
      id: "context-ultra",
      href: "/admin/context/ultra",
      i18nKey: "contextUltra",
      labelFallback: "Ultra",
      subtitleKey: "contextUltraSubtitle",
      subtitleFallback: "Heuristic pruning",
      icon: "bolt",
    },
    {
      id: "context-omniglyph",
      href: "/admin/context/omniglyph",
      i18nKey: "contextOmniglyph",
      labelFallback: "OmniGlyph",
      subtitleKey: "contextOmniglyphSubtitle",
      subtitleFallback: "Context-as-image",
      icon: "grain",
    },
    {
      id: "compression-studio",
      href: "/admin/compression/studio",
      i18nKey: "compressionStudio",
      labelFallback: "Compression Studio",
      subtitleKey: "compressionStudioSubtitle",
      subtitleFallback: "Live engine cascade",
      icon: "monitoring",
    },
    {
      id: "compression-exclusions",
      href: "/admin/compression/exclusions",
      i18nKey: "compressionExclusions",
      labelFallback: "Exclusions",
      subtitleKey: "compressionExclusionsSubtitle",
      subtitleFallback: "Per-model/endpoint bypass",
      icon: "block",
    },
  ],
};

const TOOLS_GROUP: SidebarItemGroup = {
  type: "group",
  id: "tools",
  titleKey: "toolsGroup",
  titleFallback: "Tools",
  items: [
    {
      id: "cli-code",
      href: "/admin/cli-code",
      i18nKey: "cliCode",
      subtitleKey: "cliCodeSubtitle",
      icon: "terminal",
    },
    {
      id: "cli-agents",
      href: "/admin/cli-agents",
      i18nKey: "cliAgents",
      subtitleKey: "cliAgentsSubtitle",
      icon: "smart_toy",
    },
    {
      id: "acp-agents",
      href: "/admin/acp-agents",
      i18nKey: "acpAgents",
      subtitleKey: "acpAgentsSubtitle",
      icon: "device_hub",
    },
    {
      id: "cloud-agents",
      href: "/admin/cloud-agents",
      i18nKey: "cloudAgents",
      subtitleKey: "cloudAgentsSubtitle",
      icon: "cloud",
    },
    {
      id: "conductor",
      href: "/admin/conductor",
      i18nKey: "conductor",
      subtitleKey: "conductorSubtitle",
      icon: "account_tree",
      labelFallback: "Conductor",
      subtitleFallback: "CLI-agent fleet",
    },
    {
      id: "agent-bridge",
      href: "/admin/tools/agent-bridge",
      i18nKey: "agentBridge",
      subtitleKey: "agentBridgeSubtitle",
      icon: "link",
    },
    {
      id: "traffic-inspector",
      href: "/admin/tools/traffic-inspector",
      i18nKey: "trafficInspector",
      subtitleKey: "trafficInspectorSubtitle",
      icon: "network_check",
    },
    {
      id: "discovery",
      href: "/admin/discovery",
      i18nKey: "discovery",
      subtitleKey: "discoverySubtitle",
      icon: "travel_explore",
    },
  ],
};

const INTEGRATIONS_GROUP: SidebarItemGroup = {
  type: "group",
  id: "integrations",
  titleKey: "integrationsGroup",
  titleFallback: "Integrations",
  items: [
    {
      id: "api-endpoints",
      href: "/admin/api-endpoints",
      i18nKey: "apiEndpoints",
      subtitleKey: "apiEndpointsSubtitle",
      icon: "api",
    },
    {
      id: "webhooks",
      href: "/admin/webhooks",
      i18nKey: "webhooks",
      subtitleKey: "webhooksSubtitle",
      icon: "webhook",
    },
  ],
};

const PROXY_ITEM: SidebarItemDefinition = {
  id: "proxy",
  href: "/admin/system/proxy",
  i18nKey: "proxy",
  subtitleKey: "proxySubtitle",
  icon: "dns",
};

const ANALYTICS_ITEMS: readonly SidebarItemDefinition[] = [
  {
    id: "analytics",
    href: "/admin/analytics",
    i18nKey: "usage",
    subtitleKey: "usageSubtitle",
    icon: "analytics",
  },
  {
    id: "analytics-combo-health",
    href: "/admin/analytics/combo-health",
    i18nKey: "analyticsComboHealth",
    subtitleKey: "analyticsComboHealthSubtitle",
    icon: "monitor_heart",
  },
  {
    id: "analytics-utilization",
    href: "/admin/analytics/utilization",
    i18nKey: "analyticsUtilization",
    subtitleKey: "analyticsUtilizationSubtitle",
    icon: "bar_chart",
  },
  {
    id: "cache",
    href: "/admin/cache",
    i18nKey: "cache",
    subtitleKey: "cacheSubtitle",
    icon: "cached",
  },
  {
    id: "analytics-compression",
    href: "/admin/analytics/compression",
    i18nKey: "analyticsCompression",
    subtitleKey: "analyticsCompressionSubtitle",
    icon: "compress",
  },
  {
    id: "analytics-search",
    href: "/admin/analytics/search",
    i18nKey: "analyticsSearch",
    subtitleKey: "analyticsSearchSubtitle",
    icon: "manage_search",
  },
  {
    id: "analytics-evals",
    href: "/admin/analytics/evals",
    i18nKey: "analyticsEvals",
    subtitleKey: "analyticsEvalsSubtitle",
    icon: "labs",
  },
  {
    id: "provider-stats",
    href: "/admin/provider-stats",
    i18nKey: "providerStats",
    subtitleKey: "providerStatsSubtitle",
    icon: "speed",
  },
];

const MONITORING_ITEMS: readonly SidebarItemDefinition[] = [
  {
    id: "activity",
    href: "/admin/activity",
    i18nKey: "activity",
    subtitleKey: "activitySubtitle",
    icon: "timeline",
  },
];

const LOGS_GROUP: SidebarItemGroup = {
  type: "group",
  id: "logs",
  titleKey: "logsGroup",
  titleFallback: "Logs",
  items: [
    {
      id: "logs",
      href: "/admin/logs",
      i18nKey: "logs",
      subtitleKey: "logsSubtitle",
      icon: "description",
    },
    {
      id: "logs-proxy",
      href: "/admin/logs/proxy",
      i18nKey: "logsProxy",
      subtitleKey: "logsProxySubtitle",
      icon: "lan",
    },
    {
      id: "logs-console",
      href: "/admin/logs/console",
      i18nKey: "consoleLogs",
      subtitleKey: "consoleLogsSubtitle",
      icon: "terminal",
    },
    {
      id: "logs-timeline",
      href: "/admin/logs/timeline",
      i18nKey: "logsTimeline",
      subtitleKey: "logsTimelineSubtitle",
      icon: "view_timeline",
    },
    {
      id: "conversations",
      href: "/admin/conversations",
      i18nKey: "conversations",
      subtitleKey: "conversationsSubtitle",
      icon: "forum",
    },
  ],
};

const SYSTEM_GROUP: SidebarItemGroup = {
  type: "group",
  id: "system",
  titleKey: "systemGroup",
  titleFallback: "System",
  items: [
    {
      id: "health",
      href: "/admin/health",
      i18nKey: "health",
      subtitleKey: "healthSubtitle",
      icon: "health_and_safety",
    },
    {
      id: "runtime",
      href: "/admin/runtime",
      i18nKey: "runtime",
      subtitleKey: "runtimeSubtitle",
      icon: "bolt",
    },
    {
      id: "resilience-connections",
      href: "/admin/resilience/connections",
      i18nKey: "resilienceConnections",
      subtitleKey: "resilienceConnectionsSubtitle",
      icon: "shield",
    },
  ],
};

const COSTS_ITEMS: readonly SidebarItemDefinition[] = [
  {
    id: "costs",
    href: "/admin/costs",
    i18nKey: "costsOverview",
    subtitleKey: "costsOverviewSubtitle",
    icon: "account_balance_wallet",
  },
  {
    id: "costs-pricing",
    href: "/admin/costs/pricing",
    i18nKey: "costsPricing",
    subtitleKey: "costsPricingSubtitle",
    icon: "price_change",
  },
  {
    id: "costs-budget",
    href: "/admin/costs/budget",
    i18nKey: "costsBudget",
    subtitleKey: "costsBudgetSubtitle",
    icon: "savings",
  },
  {
    id: "costs-free-tiers",
    href: "/admin/free-tiers",
    i18nKey: "costsFreeTiers",
    subtitleKey: "costsFreeTiersSubtitle",
    icon: "request_quote",
  },
  {
    id: "free-provider-rankings",
    href: "/admin/free-provider-rankings",
    i18nKey: "freeProviderRankings",
    subtitleKey: "freeProviderRankingsSubtitle",
    icon: "leaderboard",
  },
  {
    id: "radar",
    href: "/admin/radar",
    i18nKey: "radar",
    subtitleKey: "radarSubtitle",
    icon: "radar",
    featureFlagKey: "RADAR_ENABLED",
  },
];

const AUDIT_GROUP: SidebarItemGroup = {
  type: "group",
  id: "audit",
  titleKey: "auditGroup",
  titleFallback: "Audit",
  items: [
    {
      id: "audit",
      href: "/admin/audit",
      i18nKey: "auditLog",
      subtitleKey: "auditLogSubtitle",
      icon: "policy",
    },
    {
      id: "audit-mcp",
      href: "/admin/audit/mcp",
      i18nKey: "auditMcp",
      subtitleKey: "auditMcpSubtitle",
      icon: "security",
    },
    {
      id: "audit-a2a",
      href: "/admin/audit/a2a",
      i18nKey: "auditA2a",
      subtitleKey: "auditA2aSubtitle",
      icon: "device_hub",
    },
  ],
};

const DEVTOOLS_ITEMS: readonly SidebarItemDefinition[] = [
  {
    id: "translator",
    href: "/admin/translator",
    i18nKey: "translator",
    subtitleKey: "translatorSubtitle",
    icon: "translate",
  },
  {
    id: "playground",
    href: "/admin/playground",
    i18nKey: "playground",
    subtitleKey: "playgroundSubtitle",
    icon: "science",
  },
  {
    id: "search-tools",
    href: "/admin/search-tools",
    i18nKey: "searchTools",
    subtitleKey: "searchToolsSubtitle",
    icon: "manage_search",
  },
];

const MCP_ITEM: SidebarItemDefinition = {
  id: "mcp",
  href: "/admin/mcp",
  i18nKey: "mcp",
  subtitleKey: "mcpSubtitle",
  icon: "hub",
};

const AGENTIC_FEATURES_ITEMS: readonly SidebarSectionChild[] = [
  {
    id: "jinwoo",
    href: "/jinwoo",
    i18nKey: "jinwoo",
    labelFallback: "Jinwoo Sys",
    subtitleKey: "jinwooSubtitle",
    subtitleFallback: "Multi-AI Operating System",
    icon: "computer",
  },
  {
    id: "jinwoo-roles",
    href: "/jinwoo/roles",
    i18nKey: "jinwooRoles",
    labelFallback: "Role Assignments",
    subtitleFallback: "Assign Models to Agents",
    icon: "group",
  },
  {
    id: "memory",
    href: "/admin/memory",
    i18nKey: "memory",
    subtitleKey: "memorySubtitle",
    icon: "psychology",
  },
  {
    id: "agent-skills",
    href: "/admin/agent-skills",
    i18nKey: "agentSkills",
    subtitleKey: "agentSkillsSubtitle",
    icon: "share",
  },
  {
    id: "chaos-config",
    href: "/admin/chaos",
    i18nKey: "chaosConfig",
    labelFallback: "Chaos Mode",
    subtitleKey: "chaosConfigSubtitle",
    subtitleFallback: "Multi-model parallel execution",
    icon: "blender",
  },
  {
    id: "skills",
    href: "/admin/omni-skills",
    i18nKey: "omniSkills",
    subtitleKey: "omniSkillsSubtitle",
    icon: "auto_fix_high",
  },
  MCP_ITEM,
  {
    id: "a2a",
    href: "/admin/a2a",
    i18nKey: "a2a",
    subtitleKey: "a2aSubtitle",
    icon: "device_hub",
  },
  {
    id: "plugins",
    href: "/admin/plugins",
    i18nKey: "plugins",
    subtitleKey: "pluginsSubtitle",
    icon: "extension",
  },
];

const GAMIFICATION_GROUP: SidebarItemGroup = {
  type: "group",
  id: "gamification",
  titleKey: "gamificationGroup",
  titleFallback: "Gamification",
  items: [
    {
      id: "leaderboard",
      href: "/admin/leaderboard",
      i18nKey: "leaderboard",
      subtitleKey: "leaderboardSubtitle",
      icon: "emoji_events",
    },
    {
      id: "profile",
      href: "/admin/profile",
      i18nKey: "profile",
      subtitleKey: "profileSubtitle",
      icon: "person",
    },
    {
      id: "tokens",
      href: "/admin/tokens",
      i18nKey: "tokens",
      subtitleKey: "tokensSubtitle",
      icon: "toll",
    },
  ],
};

const OTHER_FEATURES_ITEMS: readonly SidebarItemDefinition[] = [
  {
    id: "media",
    href: "/admin/cache/media",
    i18nKey: "media",
    subtitleKey: "mediaSubtitle",
    icon: "perm_media",
  },
];

const BATCH_GROUP: SidebarItemGroup = {
  type: "group",
  id: "batch",
  titleKey: "batchGroup",
  titleFallback: "Batch",
  items: [
    {
      id: "batch",
      href: "/admin/batch",
      i18nKey: "batch",
      subtitleKey: "batchSubtitle",
      icon: "view_list",
    },
    {
      id: "batch-files",
      href: "/admin/batch/files",
      i18nKey: "batchFiles",
      subtitleKey: "batchFilesSubtitle",
      icon: "folder",
    },
  ],
};

const CONFIGURATION_ITEMS: readonly SidebarItemDefinition[] = [
  {
    id: "settings-general",
    href: "/admin/settings/general",
    i18nKey: "settingsGeneral",
    subtitleKey: "settingsGeneralSubtitle",
    icon: "tune",
  },
  {
    id: "settings-appearance",
    href: "/admin/settings/appearance",
    i18nKey: "settingsAppearance",
    subtitleKey: "settingsAppearanceSubtitle",
    icon: "palette",
  },
  {
    id: "settings-ai",
    href: "/admin/settings/ai",
    i18nKey: "settingsAi",
    subtitleKey: "settingsAiSubtitle",
    icon: "auto_awesome",
  },
  {
    id: "settings-modality-bridge",
    href: "/admin/settings/modality-bridge",
    i18nKey: "settingsModalityBridge",
    subtitleKey: "settingsModalityBridgeSubtitle",
    icon: "image_search",
  },
  {
    id: "settings-routing",
    href: "/admin/settings/routing",
    i18nKey: "globalRouting",
    subtitleKey: "globalRoutingSubtitle",
    icon: "route",
  },
  {
    id: "settings-resilience",
    href: "/admin/settings/resilience",
    i18nKey: "settingsResilience",
    subtitleKey: "settingsResilienceSubtitle",
    icon: "health_and_safety",
  },
  {
    id: "settings-advanced",
    href: "/admin/settings/advanced",
    i18nKey: "settingsAdvanced",
    subtitleKey: "settingsAdvancedSubtitle",
    icon: "engineering",
  },
  {
    id: "settings-security",
    href: "/admin/settings/security",
    i18nKey: "settingsSecurity",
    subtitleKey: "settingsSecuritySubtitle",
    icon: "shield",
  },
  {
    id: "settings-access-tokens",
    href: "/admin/settings/access-tokens",
    i18nKey: "settingsAccessTokens",
    labelFallback: "Access Tokens",
    subtitleKey: "settingsAccessTokensSubtitle",
    icon: "key",
  },
  {
    id: "settings-feature-flags",
    href: "/admin/settings/feature-flags",
    i18nKey: "settingsFeatureFlags",
    subtitleKey: "settingsFeatureFlagsSubtitle",
    icon: "flag",
  },
  {
    id: "settings-cache",
    href: "/admin/settings/cache",
    i18nKey: "settingsCache",
    subtitleKey: "settingsCacheSubtitle",
    icon: "memory",
  },
  {
    id: "settings-sidebar",
    href: "/admin/settings/sidebar",
    i18nKey: "settingsSidebar",
    subtitleKey: "settingsSidebarSubtitle",
    icon: "view_sidebar",
  },
];

const HELP_ITEMS: readonly SidebarItemDefinition[] = [
  {
    id: "docs",
    href: "/docs",
    i18nKey: "docs",
    subtitleKey: "docsSubtitle",
    icon: "menu_book",
    external: true,
  },
  {
    id: "issues",
    href: "https://github.com/diegosouzapw/OmniRoute/issues",
    i18nKey: "issues",
    subtitleKey: "issuesSubtitle",
    icon: "bug_report",
    external: true,
  },
  {
    id: "changelog",
    href: "/admin/changelog",
    i18nKey: "changelog",
    subtitleKey: "changelogSubtitle",
    icon: "campaign",
  },
];

// ─── Sections ────────────────────────────────────────────────────────────────

export const SIDEBAR_SECTIONS: readonly SidebarSectionDefinition[] = [
  {
    id: "home",
    titleKey: "home",
    titleFallback: "Jinwoo",
    children: HOME_ITEMS,
    showTitle: false,
  },
  {
    id: "omni-proxy",
    titleKey: "omniProxySection",
    titleFallback: "OmniProxy",
    children: [
      ...OMNI_PROXY_ITEMS,
      COMPRESSION_CONTEXT_GROUP,
      TOOLS_GROUP,
      INTEGRATIONS_GROUP,
      PROXY_ITEM,
    ],
  },
  {
    id: "analytics",
    titleKey: "analyticsSection",
    titleFallback: "Analytics",
    children: ANALYTICS_ITEMS,
  },
  {
    id: "costs",
    titleKey: "costsSection",
    titleFallback: "Costs",
    children: COSTS_ITEMS,
  },
  {
    id: "monitoring",
    titleKey: "monitoringSection",
    titleFallback: "Monitoring",
    children: [...MONITORING_ITEMS, LOGS_GROUP, AUDIT_GROUP, SYSTEM_GROUP],
  },
  {
    id: "devtools",
    titleKey: "devtoolsSection",
    titleFallback: "Dev Tools",
    children: DEVTOOLS_ITEMS,
    visibility: "debug",
  },
  {
    id: "agentic-features",
    titleKey: "agenticFeaturesSection",
    titleFallback: "Agentic Features",
    children: AGENTIC_FEATURES_ITEMS,
  },
  {
    id: "other-features",
    titleKey: "otherFeaturesSection",
    titleFallback: "Other Features",
    children: [GAMIFICATION_GROUP, ...OTHER_FEATURES_ITEMS, BATCH_GROUP],
  },
  {
    id: "configuration",
    titleKey: "configurationSection",
    titleFallback: "Configuration",
    children: CONFIGURATION_ITEMS,
  },
] as const;
