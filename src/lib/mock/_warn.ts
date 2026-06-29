/**
 * Mock-usage warning helper.
 *
 * Every call to a mock provider routes through `warnMock(area)` so that:
 *   1. There is a single grep-able TODO surface for the Xano migration.
 *   2. DevTools shows exactly which areas are still backed by mocks.
 *
 * Each area is warned only once per page load to avoid noise.
 */
const warned = new Set<string>();

export function warnMock(area: string, endpointHint?: string) {
  if (typeof window === "undefined") return;
  if (warned.has(area)) return;
  warned.add(area);
  // eslint-disable-next-line no-console
  console.warn(
    `[atomia][mock] "${area}" is still using mock data. ` +
      `TODO: replace with Xano API call${endpointHint ? ` (${endpointHint})` : ""}.`,
  );
}
