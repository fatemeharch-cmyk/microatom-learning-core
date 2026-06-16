/**
 * Barrel export for the Atomia API integration layer.
 * UI components should keep importing from src/lib/services/*.
 * Services will later swap mock provider calls for apiClient calls.
 */

export * from "./config";
export * from "./endpoints";
export * from "./client";
export * from "./auth";
