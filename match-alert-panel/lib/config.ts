function isEnabled(value: string | undefined): boolean {
  return value
    ? ["1", "true", "yes", "on"].includes(value.trim().toLowerCase())
    : false;
}

export const config = {
  adminDemoMode:
    process.env.ADMIN_DEMO_MODE === undefined
      ? true
      : isEnabled(process.env.ADMIN_DEMO_MODE) &&
        isEnabled(process.env.ALLOW_ADMIN_DEMO_MODE),
  communityName: process.env.COMMUNITY_NAME || "Match Alert",
  model: process.env.AI_MODEL || "match-alert-rules-engine",
  slackWorkspaceUrl: process.env.SLACK_WORKSPACE_URL || "",
  savoirApiUrl: process.env.SAVOIR_API_URL || "",
  savoirApiKey: process.env.SAVOIR_API_KEY || "",
  searchDomains: process.env.SEARCH_DOMAINS
    ? process.env.SEARCH_DOMAINS.split(",").map((d) => d.trim())
    : [],
  communityLeadSlackId: process.env.COMMUNITY_LEAD_SLACK_ID || "",
};
