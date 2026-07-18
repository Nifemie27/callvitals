export const CDR_API_URL =
  import.meta.env.VITE_CDR_API_URL ??
  "https://69b30b45e224ec066bdb55a0.mockapi.io/api/v1/cdr";

/** Guards the one-time auto-reload in RouteErrorBoundary against a loop. */
export const CHUNK_RELOAD_FLAG = "callvitals-chunk-reload";
