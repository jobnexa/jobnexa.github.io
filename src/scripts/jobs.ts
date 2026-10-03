import { todayInVietnam } from '../lib/content/policy';
import { getJobSkills, normalizeSkills, rankRecommendedJobs, skillKey } from '../lib/content/recommendations';
import type { SearchRecord } from '../lib/content/search';
import './expiry';

const form = document.querySelector<HTMLFormElement>('#job-filter-form');
const dataNode = document.querySelector<HTMLScriptElement>('#job-search-data');
const resultList = document.querySelector<HTMLElement>('#job-results');
const numberNode = document.querySelector<HTMLElement>('#result-number');
const noResults = document.querySelector<HTMLElement>('#no-results');

if (form && dataNode && resultList && numberNode && noResults) {
  const stableForm = form;
  const stableResultList = resultList;
  const stableNumberNode = numberNode;
  const stableNoResults = noResults;
  const records = JSON.parse(dataNode.textContent || '[]') as SearchRecord[];
  const cards = new Map([...stableResultList.querySelectorAll<HTMLElement>('[data-job-id]')].map(card => [card.dataset.jobId!, card]));
  const fields = ['q', 'category', 'location', 'workType', 'company', 'date', 'sort'] as const;
  type Field = typeof fields[number];
  type View = 'all' | 'recommended';
  const control = (name: Field) => stableForm.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement;
  const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').toLowerCase().trim();
  const dateBefore = (today: string, days: number) => {
    const [year, month, day] = today.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day - (days - 1))).toISOString().slice(0, 10);
  };
  const chooser = document.querySelector<HTMLElement>('#skills-chooser');
  const editSkills = document.querySelector<HTMLButtonElement>('#skills-edit');
  const saveSkills = document.querySelector<HTMLButtonElement>('#skills-save');
  const cancelSkills = document.querySelector<HTMLButtonElement>('#skills-cancel');
  const skillInputs = [...document.querySelectorAll<HTMLInputElement>('#skills-chooser input[name="skill"]')];
  const tabs = [...document.querySelectorAll<HTMLButtonElement>('[data-jobs-tab]')];
  const panel = document.querySelector<HTMLElement>('#jobs-panel');
  const summary = document.querySelector<HTMLElement>('#recommendation-summary');
  const emptyEditSkills = document.querySelector<HTMLButtonElement>('#empty-edit-skills');
  const emptyViewAll = document.querySelector<HTMLButtonElement>('#empty-view-all');
  const storedKey = 'job-discovery.skills';
  const availableSkills = normalizeSkills(records.flatMap(getJobSkills));
  const availableByKey = new Map(availableSkills.map(skill => [skillKey(skill), skill]));
  let selectedSkills: string[] = [];
  let returningVisitor = false;
  let selectionNeedsUpdate = false;
  let view: View = 'all';
  let allJobsSort = 'newest';
  let inputTimer: number | undefined;
  let previousFocus: HTMLElement | null = null;
  editSkills?.setAttribute('aria-controls', 'skills-chooser');
  editSkills?.setAttribute('aria-expanded', 'false');

  // Store skill names only. Blocked storage never prevents search or recommendations.
  try {
    const saved = localStorage.getItem(storedKey);
    if (saved !== null) {
      const values: unknown = JSON.parse(saved);
      if (Array.isArray(values) && values.every(value => typeof value === 'string')) {
        returningVisitor = true;
        const savedSkills = normalizeSkills(values);
        selectedSkills = savedSkills.map(skill => availableByKey.get(skillKey(skill))).filter((skill): skill is string => !!skill);
        selectionNeedsUpdate = savedSkills.length > 0 && selectedSkills.length === 0 && availableSkills.length > 0;
      }
    }
  } catch { /* The in-memory selection works without storage. */ }

  function syncSkillInputs() {
    const selected = new Set(selectedSkills.map(skillKey));
    for (const input of skillInputs) input.checked = selected.has(skillKey(input.value));
  }

  function openChooser() {
    if (!chooser) return;
    previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    syncSkillInputs();
    chooser.hidden = false;
    editSkills?.setAttribute('aria-expanded', 'true');
    chooser.focus();
  }

  function closeChooser(returnFocus = true) {
    if (chooser) chooser.hidden = true;
    editSkills?.setAttribute('aria-expanded', 'false');
    if (returnFocus) (previousFocus ?? editSkills)?.focus();
  }

  function syncTabs() {
    for (const tab of tabs) {
      const selected = tab.dataset.jobsTab === view;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected && panel && tab.id) panel.setAttribute('aria-labelledby', tab.id);
    }
    const sort = control('sort');
    if (sort) {
      if (sort instanceof HTMLSelectElement) {
        if (sort.value && sort.value !== 'best-match') allJobsSort = sort.value;
        let bestMatch = sort.querySelector<HTMLOptionElement>('[data-recommendation-sort]');
        if (view === 'recommended') {
          if (!bestMatch) {
            bestMatch = new Option('Best match', 'best-match');
            bestMatch.dataset.recommendationSort = '';
            sort.append(bestMatch);
          }
          sort.value = 'best-match';
        } else {
          bestMatch?.remove();
          sort.value = allJobsSort;
        }
      }
      sort.disabled = view === 'recommended';
      sort.title = view === 'recommended' ? 'Best matches appear first.' : '';
    }
  }

  function restore() {
    const params = new URLSearchParams(location.search);
    for (const field of fields) {
      const input = control(field);
      if (!input) continue;
      const value = params.get(field) ?? '';
      input.value = input instanceof HTMLSelectElement && ![...input.options].some(option => option.value === value)
        ? (field === 'sort' ? 'newest' : '') : value;
      if (field === 'sort') {
        allJobsSort = ['newest', 'oldest', 'title'].includes(value) ? value : 'newest';
        input.value = allJobsSort;
      }
    }
    const savedView = params.get('view');
    view = savedView === 'all' || savedView === 'recommended' ? savedView : selectedSkills.length ? 'recommended' : 'all';
    syncTabs();
  }

  function updateUrl(replace = false) {
    const url = new URL(location.href);
    for (const field of fields) {
      const value = field === 'sort' ? allJobsSort : control(field)?.value.trim() ?? '';
      url.searchParams.delete(field);
      if (value && !(field === 'sort' && value === 'newest')) url.searchParams.set(field, value);
    }
    // Explicit all keeps a returning user's All jobs choice across reload and Back.
    url.searchParams.set('view', view);
    history[replace ? 'replaceState' : 'pushState']({}, '', url);
  }

  function render() {
    const today = todayInVietnam();
    const query = normalize(control('q')?.value ?? '').split(/\s+/).filter(Boolean);
    const category = control('category')?.value ?? '';
    const locationFilter = control('location')?.value ?? '';
    const workType = control('workType')?.value ?? '';
    const company = control('company')?.value ?? '';
    const date = control('date')?.value ?? '';
    const sort = allJobsSort;
    const earliest = date === 'today' ? today : date === '7' || date === '30' ? dateBefore(today, Number(date)) : '';
    const filtered = records.filter(job => {
      if (job.expirationDate && job.expirationDate < today) return false;
      if (category && job.category !== category) return false;
      if (locationFilter && job.location !== locationFilter) return false;
      if (workType && job.workType !== workType) return false;
      if (company && job.company !== company) return false;
      if (earliest && (job.publishedDate < earliest || job.publishedDate > today)) return false;
      const haystack = normalize([job.title, job.company, job.location, job.category, job.employmentType, ...job.tags, ...getJobSkills(job), job.description].join(' '));
      return query.every(token => haystack.includes(token));
    });
    const ranked = view === 'recommended' ? rankRecommendedJobs(filtered, selectedSkills, today) : [];
    const found = view === 'recommended' ? ranked.map(match => match.job) : filtered.sort((a, b) => sort === 'oldest'
      ? a.publishedDate.localeCompare(b.publishedDate) || a.id.localeCompare(b.id)
      : sort === 'title'
        ? a.title.localeCompare(b.title, 'en') || a.id.localeCompare(b.id)
        : b.publishedDate.localeCompare(a.publishedDate) || a.id.localeCompare(b.id));
    const matchById = new Map(ranked.map(match => [match.job.id, match]));
    const visible = new Set(found.map(job => job.id));
    for (const [id, card] of cards) {
      card.hidden = !visible.has(id);
      const badge = card.querySelector<HTMLElement>('[data-skill-match]');
      const match = matchById.get(id);
      if (badge) {
        badge.hidden = !match;
        badge.textContent = match ? `${match.matchedCount}/${match.totalSkills} skills matched` : '';
        badge.title = match ? `Matched: ${match.matchedSkills.join(', ')}` : '';
      }
    }
    for (const job of found) {
      const card = cards.get(job.id);
      if (card) stableResultList.append(card);
    }
    stableNumberNode.textContent = String(found.length);
    const resultLabel = document.querySelector<HTMLElement>('#result-label');
    if (resultLabel) resultLabel.textContent = found.length === 1 ? 'job' : 'jobs';
    else if (stableNumberNode.nextSibling?.nodeType === Node.TEXT_NODE) {
      stableNumberNode.nextSibling.textContent = found.length === 1 ? ' job' : ' jobs';
    }
    stableNoResults.hidden = found.length > 0;
    stableResultList.hidden = found.length === 0;
    if (emptyEditSkills) emptyEditSkills.hidden = view !== 'recommended' || !availableSkills.length;
    if (emptyViewAll) emptyViewAll.hidden = view !== 'recommended';
    const emptyTitle = stableNoResults.querySelector('h3');
    const emptyDescription = stableNoResults.querySelector('p');
    if (emptyTitle) emptyTitle.textContent = !records.length ? 'No jobs posted yet' : view === 'recommended' && !selectedSkills.length ? 'Choose skills to get recommendations' : 'No matching jobs';
    if (emptyDescription) emptyDescription.textContent = view === 'recommended'
      ? selectedSkills.length ? 'No jobs match your selected skills and filters. Try editing your skills or view all jobs.' : 'Select skills from the list, or switch to All jobs to browse every active listing.'
      : records.length ? 'Try another keyword or remove some filters.' : 'New jobs will appear here when available.';
    if (summary) {
      summary.hidden = view !== 'recommended';
      summary.textContent = selectedSkills.length
        ? `Matching your skills: ${selectedSkills.join(', ')}. Best matches appear first.`
        : 'Choose skills to see jobs with at least one matching skill. You can always browse All jobs.';
    }
    syncTabs();
  }

  function apply(replace = false) { syncTabs(); updateUrl(replace); render(); }
  stableForm.addEventListener('submit', event => { event.preventDefault(); apply(); });
  stableForm.addEventListener('change', () => apply());
  control('sort')?.addEventListener('change', () => apply());
  control('q')?.addEventListener('input', () => {
    clearTimeout(inputTimer);
    inputTimer = window.setTimeout(() => apply(true), 250);
  });
  function reset() {
    stableForm.reset();
    const query = control('q');
    if (query) query.value = '';
    apply();
    query?.focus();
  }
  document.querySelector('#reset-filters')?.addEventListener('click', reset);
  document.querySelector('#empty-reset')?.addEventListener('click', reset);
  editSkills?.addEventListener('click', openChooser);
  emptyEditSkills?.addEventListener('click', openChooser);
  emptyViewAll?.addEventListener('click', () => {
    view = 'all'; apply();
    tabs.find(tab => tab.dataset.jobsTab === 'all')?.focus();
  });
  saveSkills?.addEventListener('click', () => {
    selectedSkills = normalizeSkills(skillInputs.filter(input => input.checked).map(input => input.value));
    try { localStorage.setItem(storedKey, JSON.stringify(selectedSkills)); } catch { /* Keep selection in memory. */ }
    view = 'recommended';
    closeChooser(false);
    apply();
    tabs.find(tab => tab.dataset.jobsTab === 'recommended')?.focus();
  });
  cancelSkills?.addEventListener('click', () => {
    // An empty list records a first-time visitor's explicit choice to browse all.
    try { localStorage.setItem(storedKey, JSON.stringify(selectedSkills)); } catch { /* Browsing works without storage. */ }
    view = 'all'; closeChooser(false); apply();
    tabs.find(tab => tab.dataset.jobsTab === 'all')?.focus();
  });
  chooser?.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); closeChooser(); }
  });
  for (const [index, tab] of tabs.entries()) {
    tab.addEventListener('click', () => { view = tab.dataset.jobsTab === 'recommended' ? 'recommended' : 'all'; apply(); });
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      tabs[next]?.focus(); tabs[next]?.click();
    });
  }
  window.addEventListener('popstate', () => { restore(); render(); });
  document.addEventListener('jobs:expiry-refresh', render);
  syncSkillInputs();
  restore();
  render();
  if (!returningVisitor || selectionNeedsUpdate) openChooser();
}
