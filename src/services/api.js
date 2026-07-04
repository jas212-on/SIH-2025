const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  chat: (query, role, language, history) =>
    request("/chat", {
      method: "POST",
      body: JSON.stringify({ query, role: role || "general", language, history }),
    }),

  visualize: (params) =>
    request("/visualize", { method: "POST", body: JSON.stringify(params) }),

  visualizationOptions: () => request("/visualization/options"),

  states: () => request("/api/v1/states"),

  districts: (state) => request(`/api/v1/states/${encodeURIComponent(state)}/districts`),

  metrics: () => request("/api/v1/metrics"),

  mapStates: (metric = "availability", year = 2024) =>
    request(`/api/v1/map/states?metric=${metric}&year=${year}`),

  suggestions: (q = "") =>
    request(`/api/v1/suggestions?q=${encodeURIComponent(q)}`),

  feedback: (query, answer, rating, comment) =>
    request("/api/v1/feedback", {
      method: "POST",
      body: JSON.stringify({ query, answer, rating, comment }),
    }),

  export: (params) =>
    fetch(`${BASE}/api/v1/data/export`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    }),

  health: () => request("/health"),

  forecast: (state, district, horizon = 3) =>
    district
      ? request(`/api/v1/forecast/${encodeURIComponent(state)}/${encodeURIComponent(district)}?horizon=${horizon}`)
      : request(`/api/v1/forecast/${encodeURIComponent(state)}?horizon=${horizon}`),

  simulate: ({ state, district, draftChangePct, horizon = 5 }) =>
    request("/api/v1/simulate", {
      method: "POST",
      body: JSON.stringify({ state, district, draft_change_pct: draftChangePct, horizon }),
    }),

  advisory: ({ state, district, crop }) =>
    request("/api/v1/advisory", {
      method: "POST",
      body: JSON.stringify({ state, district, crop }),
    }),

  advisoryCrops: () => request("/api/v1/advisory/crops"),

  submitObservation: ({ state, district, wellDepthM, note }) =>
    request("/api/v1/field-observations", {
      method: "POST",
      body: JSON.stringify({ state, district, well_depth_m: wellDepthM, note }),
    }),

  listObservations: (state, district) => {
    const params = new URLSearchParams();
    if (state) params.set("state", state);
    if (district) params.set("district", district);
    return request(`/api/v1/field-observations?${params.toString()}`);
  },

  generateReport: (state, district, years = [2023, 2024]) =>
    fetch(`${BASE}/api/v1/reports/${encodeURIComponent(state)}${district ? `/${encodeURIComponent(district)}` : ""}?years=${years.join(",")}`),

  dataFreshness: () => request("/api/v1/data/freshness"),

  dataCategories: () => request("/api/v1/data/categories"),

  exportFullDataset: ({ state, district, years = [2023, 2024], categories = [], format = "json" }) => {
    const params = new URLSearchParams({ state, years: years.join(","), format });
    if (district) params.set("district", district);
    if (categories.length) params.set("categories", categories.join(","));
    const url = `${BASE}/api/v1/data/export-full?${params.toString()}`;
    return format === "csv" ? fetch(url) : request(`/api/v1/data/export-full?${params.toString()}`);
  },

  exportPineconeData: (state, format = "json") => {
    const params = new URLSearchParams({ state, format });
    const url = `${BASE}/api/v1/data/pinecone-export?${params.toString()}`;
    return format === "csv" ? fetch(url) : request(`/api/v1/data/pinecone-export?${params.toString()}`);
  },

  chatStream: (query, role, language, onToken, onDone, onError, history) => {
    fetch(`${BASE}/chat/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, role: role || "general", language, history }),
    }).then((res) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      function read() {
        reader.read().then(({ done, value }) => {
          if (done) return;
          const text = decoder.decode(value);
          const lines = text.split("\n").filter((l) => l.startsWith("data: "));
          for (const line of lines) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.error) { onError(data.error); return; }
              if (data.done) { onDone(data); return; }
              if (data.token) onToken(data.token);
            } catch {}
          }
          read();
        });
      }
      read();
    }).catch(onError);
  },
};
