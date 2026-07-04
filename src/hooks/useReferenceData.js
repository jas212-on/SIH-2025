import { useState, useEffect } from "react";
import { api } from "../services/api";
import { ALL_STATES, KERALA_DISTRICTS, METRICS } from "../config/constants";

// Reference lists (states / districts / metrics) are served by the backend so the
// UI stays in sync with whatever data is actually loaded there. These hooks fetch
// once, cache the result at module scope (shared across pages and remounts), and
// fall back to the bundled constants if the backend is unreachable — so the app
// still renders offline instead of showing empty dropdowns.

let statesCache = null;
let statesPromise = null;

let metricsCache = null;
let metricsPromise = null;

const districtsCache = {};
const districtsPromises = {};

export function useStates() {
  const [states, setStates] = useState(statesCache || ALL_STATES);
  const [loading, setLoading] = useState(!statesCache);

  useEffect(() => {
    if (statesCache) return;
    if (!statesPromise) {
      statesPromise = api
        .states()
        .then((d) => {
          statesCache = d?.states?.length ? d.states : ALL_STATES;
          return statesCache;
        })
        .catch(() => {
          statesPromise = null; // allow a retry on the next page visit
          return ALL_STATES;
        });
    }
    let active = true;
    setLoading(true);
    statesPromise.then((list) => {
      if (active) {
        setStates(list);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return { states, loading };
}

export function useMetrics() {
  const [metrics, setMetrics] = useState(metricsCache || METRICS);
  const [loading, setLoading] = useState(!metricsCache);

  useEffect(() => {
    if (metricsCache) return;
    if (!metricsPromise) {
      metricsPromise = api
        .metrics()
        .then((d) => {
          metricsCache = d?.metrics?.length ? d.metrics : METRICS;
          return metricsCache;
        })
        .catch(() => {
          metricsPromise = null;
          return METRICS;
        });
    }
    let active = true;
    setLoading(true);
    metricsPromise.then((list) => {
      if (active) {
        setMetrics(list);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return { metrics, loading };
}

export function useDistricts(state) {
  const key = (state || "").toUpperCase();
  const fallbackFor = (k) => (k === "KERALA" ? KERALA_DISTRICTS : []);
  const [districts, setDistricts] = useState(districtsCache[key] || fallbackFor(key));
  const [loading, setLoading] = useState(Boolean(key) && !districtsCache[key]);

  useEffect(() => {
    if (!key) {
      setDistricts([]);
      setLoading(false);
      return;
    }
    if (districtsCache[key]) {
      setDistricts(districtsCache[key]);
      setLoading(false);
      return;
    }
    if (!districtsPromises[key]) {
      districtsPromises[key] = api
        .districts(key)
        .then((d) => {
          districtsCache[key] = d?.districts || [];
          return districtsCache[key];
        })
        .catch(() => {
          districtsPromises[key] = null;
          return fallbackFor(key);
        });
    }
    let active = true;
    setLoading(true);
    districtsPromises[key].then((list) => {
      if (active) {
        setDistricts(list);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [key]);

  return { districts, loading };
}
