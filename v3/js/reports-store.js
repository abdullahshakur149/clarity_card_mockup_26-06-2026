/* ============================================================================
   reports-store.js — tiny helpers for the per-mission report *history*.
   Market & Competition now store { reports: [ {id, …report}, … ], primaryId }
   instead of a single report object. These accessors read that shape AND stay
   backward-compatible: a bare legacy/demo report object (no `.reports`) is
   treated as a one-item list, so old saved ideas and the compare.js demo ideas
   keep working with zero migration. Customers keeps its own {sketches, primary}.
     window.ClarityReports.{ list, primary, count }
   ========================================================================== */
(function () {
  'use strict';

  function isList(m) { return !!(m && Array.isArray(m.reports)); }

  /* every report in the mission (or [legacy] / []) */
  function list(m) {
    if (!m) return [];
    if (isList(m)) return m.reports;
    return [m];               /* legacy single-report object or demo shape */
  }

  /* the report that feeds the Plan + Comparison (primaryId, else the first) */
  function primary(m) {
    if (!m) return null;
    if (!isList(m)) return m; /* legacy / demo bare object */
    var reps = m.reports;
    for (var i = 0; i < reps.length; i++) if (reps[i].id === m.primaryId) return reps[i];
    return reps[0] || null;
  }

  function count(m) { return list(m).length; }

  window.ClarityReports = { list: list, primary: primary, count: count };
})();
