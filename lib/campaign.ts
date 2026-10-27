import { CAMPAIGN_TAGS } from "@/lib/event";

const STORAGE_KEY = "ccd-campaign";

/**
 * The UTM tags this visit arrived with, as a query string ("" if none). They're kept for the tab's
 * session, so a visitor who lands on the home page from Instagram and registers from the Agenda page
 * is still attributed to Instagram. A string, so React's useSyncExternalStore can compare snapshots.
 */
export function visitCampaign(): string {
  const params = new URLSearchParams(window.location.search);
  const tags = new URLSearchParams();
  for (const tag of CAMPAIGN_TAGS) {
    const value = params.get(tag);
    if (value) tags.set(tag, value);
  }

  try {
    if (tags.has("utm_source")) {
      sessionStorage.setItem(STORAGE_KEY, tags.toString());
      return tags.toString();
    }
    return sessionStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    // Storage blocked (private mode, strict settings): fall back to this page's own tags.
    return tags.has("utm_source") ? tags.toString() : "";
  }
}
