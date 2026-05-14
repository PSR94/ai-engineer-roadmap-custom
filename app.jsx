const { useState, useEffect, useRef } = React;

function CodeBlock({ code, label }) {
  if (!code) return null;
  return (
    <div className="codeblock">
      {label ? <div className="codeblock__label">{label}</div> : null}
      <pre><code>{code}</code></pre>
    </div>
  );
}

function CodeReveal({ code, showLabel = 'Show code', hideLabel = 'Hide code', codeLabel = 'Example' }) {
  const [open, setOpen] = useState(false);
  if (!code) return null;
  return (
    <details className="code-reveal" onToggle={e => setOpen(e.currentTarget.open)}>
      <summary className="code-reveal__summary">
        <span>{open ? hideLabel : showLabel}</span>
      </summary>
      <CodeBlock label={codeLabel} code={code} />
    </details>
  );
}

function DetailSection({ eyebrow, title, children }) {
  return (
    <section className="module-detail__section">
      {eyebrow ? <div className="module-detail__eyebrow">{eyebrow}</div> : null}
      <h4 className="module-detail__section-title">{title}</h4>
      {children}
    </section>
  );
}

function ConceptCard({ concept, index, detail }) {
  return (
    <details className="concept-card">
      <summary className="concept-card__topline">
        <span className="concept-card__index">{String(index + 1).padStart(2, '0')}</span>
        <h5 className="concept-card__title">{concept.title}</h5>
        <span className="concept-card__toggle" aria-hidden="true">+</span>
      </summary>
      <div className="concept-card__body">
        <p className="concept-card__text">{concept.explanation}</p>
        <div className="concept-card__usecase">
          <span>AI use case</span>
          <p>{concept.aiUseCase}</p>
        </div>
        {concept.plainExample ? (
          <div className="concept-card__plain">
            <span>Plain-English example</span>
            <p>{concept.plainExample}</p>
          </div>
        ) : null}
        <CodeReveal
          code={concept.code}
          showLabel={concept.showCodeLabel || detail.showCodeLabel}
          hideLabel={concept.hideCodeLabel || detail.hideCodeLabel}
          codeLabel={concept.codeLabel || detail.codeLabel} />
      </div>
    </details>
  );
}

function Checklist({ items }) {
  if (!items || items.length === 0) return null;
  return (
    <ul className="module-detail__checklist">
      {items.map((item, i) => (
        <li key={i}>
          <span className="module-detail__check" aria-hidden="true">✓</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ModuleDetail({ section }) {
  const detail = section.detail;
  return (
    <article className="module-detail">
      <header className="module-detail__header">
        <div>
          <div className="tabbox__panel-num">Module {section.n}</div>
          <h3 className="tabbox__panel-title module-detail__title">{section.title}</h3>
        </div>
        <div className="module-detail__badges" aria-label="Module metadata">
          <span>{detail.duration}</span>
          <span>{detail.level}</span>
          <span className="module-detail__badge-required">{detail.status}</span>
        </div>
      </header>

      <DetailSection title="Goal">
        <p className="module-detail__lead">{detail.goal}</p>
      </DetailSection>

      <DetailSection title="Why This Matters For AI Engineering">
        <p className="module-detail__intro">
          {detail.whyIntro || 'You will use this in practical AI engineering work when you are:'}
        </p>
        <ul className="module-detail__pill-list">
          {detail.whyItMatters.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      </DetailSection>

      <DetailSection eyebrow="Concepts" title={detail.conceptsTitle || "Key Concepts"}>
        <div className="concept-grid">
          {detail.concepts.map((concept, i) => (
            <ConceptCard key={concept.title} concept={concept} index={i} detail={detail} />
          ))}
        </div>
      </DetailSection>

      <DetailSection title="Common Mistakes">
        <div className="mistake-table" role="table" aria-label="Common mistakes and better approaches">
          <div className="mistake-table__row mistake-table__head" role="row">
            <div role="columnheader">Mistake</div>
            <div role="columnheader">Better approach</div>
          </div>
          {detail.commonMistakes.map((row, i) => (
            <div className="mistake-table__row" role="row" key={i}>
              <div role="cell">{row.mistake}</div>
              <div role="cell">{row.better}</div>
            </div>
          ))}
        </div>
      </DetailSection>

      <DetailSection title="Completion Checklist">
        <Checklist items={detail.checklist} />
      </DetailSection>
    </article>
  );
}

function PhaseTabBox({ phase }) {
  const [activeTab, setActiveTab] = useState(0);
  const section = phase.sections[activeTab];
  const hasPrev = activeTab > 0;
  const hasNext = activeTab < phase.sections.length - 1;
  return (
    <div className="tabbox">
      <div className="tabbox__tabs" role="tablist">
        {phase.sections.map((s, i) => (
          <button key={i} role="tab" aria-selected={i === activeTab}
            className={`tabbox__tab ${i === activeTab ? 'active' : ''}`}
            onClick={() => setActiveTab(i)}>
            <span className="tabbox__tab-num">{s.n}</span>
            <span className="tabbox__tab-title">{s.title}</span>
          </button>
        ))}
      </div>
      <div className="tabbox__panel" role="tabpanel">
        <div className="tabbox__panel-content" key={activeTab}>
          {section.detail ? (
            <ModuleDetail section={section} />
          ) : (
            <React.Fragment>
              <div className="tabbox__panel-num">Module {section.n}</div>
              <h3 className="tabbox__panel-title">{section.title}</h3>
              <ul className="tabbox__items">
                {section.items.map((item, ii) => (
                  <li key={ii} className="tabbox__item">
                    <span className="tabbox__item-marker">{String(ii + 1).padStart(2, '0')}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </React.Fragment>
          )}
          <div className="module-nav" aria-label="Module navigation">
            <button
              type="button"
              className="module-nav__button"
              disabled={!hasPrev}
              onClick={() => setActiveTab(t => Math.max(0, t - 1))}>
              <span aria-hidden="true">←</span>
              Previous
            </button>
            <div className="module-nav__status">
              Module {activeTab + 1} of {phase.sections.length}
            </div>
            <button
              type="button"
              className="module-nav__button module-nav__button--next"
              disabled={!hasNext}
              onClick={() => setActiveTab(t => Math.min(phase.sections.length - 1, t + 1))}>
              Next
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobilePhaseNav({ activePhase, visible, onJumpPhase }) {
  const [open, setOpen] = useState(false);
  const phase = window.ROADMAP[activePhase] || window.ROADMAP[0];
  const progress = ((activePhase + 1) / window.ROADMAP.length) * 100;

  useEffect(() => {
    if (!visible) setOpen(false);
  }, [visible]);

  return (
    <div className={`mobile-phase-nav ${visible ? 'visible' : ''} ${open ? 'open' : ''}`}>
      <button
        type="button"
        className="mobile-phase-nav__pill"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls="mobile-phase-list">
        <span className="mobile-phase-nav__label">Phase {activePhase + 1} of {window.ROADMAP.length}</span>
        <span className="mobile-phase-nav__title">{phase.short}</span>
        <span className="mobile-phase-nav__chevron" aria-hidden="true">{open ? '×' : '↑'}</span>
      </button>
      <div className="mobile-phase-nav__bar" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>
      {open ? (
        <div className="mobile-phase-nav__sheet" id="mobile-phase-list">
          {window.ROADMAP.map((p, i) => (
            <button
              key={p.id}
              type="button"
              className={`mobile-phase-nav__item ${i === activePhase ? 'active' : ''}`}
              onClick={() => { onJumpPhase(i); setOpen(false); }}>
              <span>{String(p.id).padStart(2, '0')}</span>
              <strong>{p.short}</strong>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

const isMac = typeof navigator !== 'undefined'
  && /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent || '');

function CommandPalette({ open, onClose, onJumpPhase }) {
  const [query, setQuery] = useState('');
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const items = React.useMemo(() => {
    const out = [];
    window.ROADMAP.forEach((phase, pi) => {
      out.push({
        kind: 'phase',
        label: phase.title,
        sub: `Phase ${String(phase.id).padStart(2, '0')} · ${phase.weeks}`,
        haystack: `${phase.title} ${phase.short} ${phase.summary}`.toLowerCase(),
        action: () => onJumpPhase(pi)
      });
      phase.sections.forEach((s) => {
        out.push({
          kind: 'module',
          label: s.title,
          sub: `Module ${s.n} · ${phase.title}`,
          haystack: `${s.title} ${s.n} ${(s.items || []).join(' ')}`.toLowerCase(),
          action: () => onJumpPhase(pi)
        });
      });
    });
    return out;
  }, []);

  const q = query.trim().toLowerCase();
  const results = React.useMemo(() => {
    if (!q) return items.slice(0, 30);
    const tokens = q.split(/\s+/).filter(Boolean);
    return items
      .map(item => {
        const allMatch = tokens.every(t => item.haystack.includes(t));
        if (!allMatch) return null;
        let score = 0;
        if (item.label.toLowerCase().includes(q)) score += 50;
        if (item.label.toLowerCase().startsWith(q)) score += 30;
        if (item.kind === 'phase') score += 5;
        return { item, score };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, 30)
      .map(x => x.item);
  }, [q, items]);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setHighlight(0);
    const t = setTimeout(() => inputRef.current && inputRef.current.focus(), 30);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => { setHighlight(0); }, [q]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return; }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlight(h => Math.min(results.length - 1, h + 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlight(h => Math.max(0, h - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const r = results[highlight];
        if (r) { r.action(); onClose(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, results, highlight, onClose]);

  useEffect(() => {
    if (!open || !listRef.current) return;
    const el = listRef.current.querySelector(`[data-idx="${highlight}"]`);
    if (el) el.scrollIntoView({ block: 'nearest' });
  }, [highlight, open]);

  if (!open) return null;
  return (
    <div className="cmdk" role="dialog" aria-modal="true" aria-label="Search modules" onClick={onClose}>
      <div className="cmdk__panel" onClick={e => e.stopPropagation()}>
        <div className="cmdk__input-row">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            className="cmdk__input"
            type="text"
            placeholder="Search phases and modules…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            aria-label="Search"
            aria-controls="cmdk-list"
            aria-activedescendant={results[highlight] ? `cmdk-item-${highlight}` : undefined} />
          <kbd className="cmdk__esc">esc</kbd>
        </div>
        <div className="cmdk__list" ref={listRef} id="cmdk-list" role="listbox">
          {results.length === 0 ? (
            <div className="cmdk__empty">No matches for "{query}"</div>
          ) : (
            results.map((r, i) => (
              <button
                key={i}
                id={`cmdk-item-${i}`}
                data-idx={i}
                role="option"
                aria-selected={i === highlight}
                className={`cmdk__item ${i === highlight ? 'is-active' : ''}`}
                onMouseMove={() => setHighlight(i)}
                onClick={() => { r.action(); onClose(); }}>
                <span className={`cmdk__kind cmdk__kind--${r.kind}`}>{r.kind}</span>
                <span className="cmdk__label">{r.label}</span>
                <span className="cmdk__sub">{r.sub}</span>
              </button>
            ))
          )}
        </div>
        <div className="cmdk__hint">
          <span><kbd>↑↓</kbd> navigate</span>
          <span><kbd>↵</kbd> jump</span>
          <span><kbd>esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [dockVisible, setDockVisible] = useState(false);
  const [activePhase, setActivePhase] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark';
    const stored = localStorage.getItem('roadmap-theme');
    if (stored) return stored;
    if (document.documentElement.dataset.theme) return document.documentElement.dataset.theme;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
    return 'dark';
  });
  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));
  const phaseRefs = useRef([]);
  const agendaRef = useRef(null);
  const dockNodeRefs = useRef([]);
  const progressFillRef = useRef(null);
  const progressDotRef = useRef(null);
  const scrollFrame = useRef(null);
  const lastActiveIdx = useRef(-1);
  const lastDockVisible = useRef(false);
  const phaseMetrics = useRef([]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('roadmap-theme', theme);
  }, [theme]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(o => !o);
      } else if (e.key === '/' && !searchOpen) {
        const tag = (e.target && e.target.tagName) || '';
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [searchOpen]);

  useEffect(() => {
    const recomputeMetrics = () => {
      phaseMetrics.current = phaseRefs.current.filter(Boolean).map(el => {
        const pt = parseFloat(window.getComputedStyle(el).paddingTop) || 0;
        return { el, paddingTop: pt };
      });
    };

    const update = () => {
      scrollFrame.current = null;
      const scrollTop = window.scrollY;
      const winH = window.innerHeight;
      const metrics = phaseMetrics.current;
      if (!metrics.length) return;

      const firstPhaseTop = metrics[0].el.getBoundingClientRect().top + scrollTop;
      const visible = scrollTop > firstPhaseTop - winH * 0.15;
      if (visible !== lastDockVisible.current) {
        lastDockVisible.current = visible;
        setDockVisible(visible);
      }

      const navOffset = window.innerWidth <= 700 ? 24 : 56;
      const firstTop = metrics[0].el.getBoundingClientRect().top + scrollTop + metrics[0].paddingTop - navOffset;
      const lastM = metrics[metrics.length - 1];
      const lastTop = lastM.el.getBoundingClientRect().top + scrollTop + lastM.paddingTop - navOffset;
      const phaseRange = lastTop - firstTop;
      const phaseProgress = phaseRange <= 0 ? 0 : (scrollTop - firstTop) / phaseRange;
      const pct = Math.min(1, Math.max(0, phaseProgress)) * 100;
      if (progressFillRef.current) progressFillRef.current.style.width = pct + '%';
      if (progressDotRef.current) progressDotRef.current.style.left = pct + '%';

      const probeLine = window.innerWidth <= 700 ? 96 : 160;
      let active = 0;
      for (let i = 0; i < metrics.length; i++) {
        const rect = metrics[i].el.getBoundingClientRect();
        if (rect.top + metrics[i].paddingTop <= probeLine) active = i;
      }
      if (active !== lastActiveIdx.current) {
        lastActiveIdx.current = active;
        setActivePhase(active);
        dockNodeRefs.current.forEach((node, i) => {
          if (!node) return;
          const isActive = i === active;
          node.classList.toggle('active', isActive);
          node.classList.toggle('passed', i < active);
          if (isActive) node.setAttribute('aria-current', 'true');
          else node.removeAttribute('aria-current');
        });
      }
    };

    const onScroll = () => {
      if (scrollFrame.current != null) return;
      scrollFrame.current = window.requestAnimationFrame(update);
    };

    const onResize = () => {
      recomputeMetrics();
      onScroll();
    };

    recomputeMetrics();
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (scrollFrame.current != null) window.cancelAnimationFrame(scrollFrame.current);
    };
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  const scrollToElement = (el, mobileOffset = 24, desktopOffset = 72, includePadding = false) => {
    if (!el) return;
    const navOffset = window.innerWidth <= 700 ? mobileOffset : desktopOffset;
    const pt = includePadding
      ? parseFloat(window.getComputedStyle(el).paddingTop) || 0
      : 0;
    const top = el.getBoundingClientRect().top + window.scrollY + pt - navOffset;
    const prefersReduced = window.matchMedia
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth <= 700;
    window.scrollTo({
      top: Math.max(0, top),
      behavior: prefersReduced || isMobile ? 'auto' : 'smooth'
    });
  };

  const scrollToPhase = (i) => {
    const el = phaseRefs.current[i];
    if (!el) return;
    scrollToElement(el, 24, 56, true);
  };
  const scrollToAgenda = () => scrollToElement(agendaRef.current, 24, 72, false);

  const totalSections = window.ROADMAP.reduce((a, p) => a + p.sections.length, 0);
  const totalWeeks = window.ROADMAP.reduce((max, phase) => {
    const matches = [...phase.weeks.matchAll(/\d+/g)].map(match => Number(match[0]));
    return Math.max(max, ...matches);
  }, 0);

  return (
    <React.Fragment>
      <nav className="nav" aria-label="Primary">
        <div className="nav__brand">
          <span className="nav__brand-mark" aria-hidden="true">A</span>
          <span><b>Agent Engineer</b> · 2026 Roadmap</span>
        </div>
        <div className="nav__right">
          <div className="nav__meta" aria-hidden="true">
            <span><b>{totalWeeks}</b> weeks</span>
            <span><b>9</b> phases</span>
            <span><b>{totalSections}</b> modules</span>
          </div>
          <button
            type="button"
            className="search-trigger"
            onClick={() => setSearchOpen(true)}
            aria-label="Open search (Cmd+K)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" />
            </svg>
            <span>Search</span>
            <kbd>{isMac ? '⌘' : 'Ctrl'}K</kbd>
          </button>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            aria-pressed={theme === 'dark'}>
            <span className="theme-toggle__track">
              <span className="theme-toggle__thumb" aria-hidden="true">
                {theme === 'light' ? '☀' : '☾'}
              </span>
            </span>
          </button>
        </div>
      </nav>

      <main id="main">
      {/* HERO */}
      <header className="hero" data-screen-label="01 Hero">
        <div className="hero__blob" />
        <div className="hero__blob-2" />
        <div className="hero__blob-3" />
        <div className="hero__eyebrow">
          <span className="hero__eyebrow-dot" />
          The 2026 Edition · {totalWeeks} Weeks · 9 Phases
        </div>
        <h1 className="hero__title">
          <span className="hero__title-main">
            The only roadmap<br />
            you need to become a
          </span><br />
          <span className="hero__title-100x">100× AI Engineer</span> <em>in 2026.</em>
        </h1>
        <p className="hero__sub">
          A complete, production-grade journey from builder basics to agent engineering.
          Every module grounded in real enterprise AI engineering — from Python fundamentals
          all the way to multi-agent systems shipping in regulated domains.
        </p>
        <div className="hero__actions">
          <button className="hero__cta" type="button" onClick={scrollToAgenda}>
            Explore the roadmap
            <span aria-hidden="true">↓</span>
          </button>
        </div>
        <div className="hero__stats">
          <div>
            <div className="hero__stat-num">{window.ROADMAP.length}</div>
            <div className="hero__stat-label">Phases</div>
          </div>
          <div>
            <div className="hero__stat-num">{totalSections}</div>
            <div className="hero__stat-label">Modules</div>
          </div>
          <div>
            <div className="hero__stat-num">{totalWeeks}</div>
            <div className="hero__stat-label">Weeks</div>
          </div>
        </div>
      </header>

      {/* AGENDA — 9 phase tiles */}
      <section className="agenda reveal" ref={agendaRef} data-screen-label="02 Agenda">
        <div className="agenda__head">
          <h2 className="agenda__title">What we'll <em>cover.</em></h2>
          <div className="agenda__sub">
            A complete production-grade journey. Every module grounded in real enterprise AI engineering.
          </div>
        </div>
        <div className="agenda__grid agenda__grid--phases">
          {window.ROADMAP.map((p) => (
            <button key={p.id}
              type="button"
              className="agenda__tile"
              data-color={p.color}
              aria-label={`Jump to phase ${String(p.id).padStart(2, '0')}: ${p.title}`}
              onClick={() => scrollToPhase(p.id - 1)}>
              <div className="agenda__tile-glow" />
              <div className="agenda__tile-num">{String(p.id).padStart(2, '0')}</div>
              <div className="agenda__tile-title">{p.short}</div>
              <div className="agenda__tile-weeks">{p.weeks}</div>
              <div className="agenda__tile-arrow">→</div>
            </button>
          ))}
        </div>
      </section>

      {/* DOCK */}
      <div className={`dock ${dockVisible ? 'visible' : ''}`}>
        {window.ROADMAP.map((p, i) => (
          <button key={p.id}
            type="button"
            aria-label={`Jump to phase ${String(p.id).padStart(2, '0')}: ${p.title}`}
            ref={el => dockNodeRefs.current[i] = el}
            className="dock__node"
            data-color={p.color}
            onClick={() => scrollToPhase(i)}>
            {String(p.id).padStart(2, '0')}
            <span className="dock__node-tooltip">{p.short}</span>
          </button>
        ))}
        <div className="dock__progress">
          <div className="dock__progress-fill" ref={progressFillRef} />
          <div className="dock__progress-dot" ref={progressDotRef} />
        </div>
      </div>

      <MobilePhaseNav
        activePhase={activePhase}
        visible={dockVisible}
        onJumpPhase={scrollToPhase} />

      {/* PHASES */}
      <section className="phases">
        {window.ROADMAP.map((phase, i) => (
          <article key={phase.id} className="phase"
            ref={el => phaseRefs.current[i] = el}
            data-screen-label={`${String(phase.id).padStart(2, '0')} ${phase.title}`}>
            <div className="phase__index">
              <span className="phase__num-prefix" data-color={phase.color}>Phase {String(phase.id).padStart(2, '0')}</span>
              <span className="phase__num">{String(phase.id).padStart(2, '0')}</span>
              <div className="phase__num-bar" data-color={phase.color} />
              <div className="phase__weeks-block" data-color={phase.color}>
                <div className="phase__weeks-label">Time frame</div>
                <div className="phase__weeks">{phase.weeks}</div>
                <div className="phase__weeks-detail">{phase.weeksDetail}</div>
                <div className="phase__diff">
                  <span>Difficulty</span>
                  <span className="phase__diff-score">{phase.difficulty}/5</span>
                  <span className="phase__diff-dots" aria-label={`Difficulty ${phase.difficulty} out of 5`}>
                    {[1,2,3,4,5].map(d => (
                      <span key={d} className={`phase__diff-dot ${d <= phase.difficulty ? 'on' : ''}`} />
                    ))}
                  </span>
                </div>
                {phase.difficultyNote && (
                  <div className="phase__diff-note">{phase.difficultyNote}</div>
                )}
              </div>
            </div>
            <div className="phase__body">
              <h2 className="phase__title">
                {phase.title}
              </h2>
              <p className="phase__summary">{phase.summary}</p>
              <PhaseTabBox phase={phase} />
              <div className="phase__endstate reveal">
                <div className="phase__endstate-label">End state</div>
                <div className="phase__endstate-text">{phase.endState}</div>
              </div>
            </div>
          </article>
        ))}
      </section>

      </main>

      <CommandPalette
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onJumpPhase={scrollToPhase} />

      <footer className="footer reveal">
        <h2 className="footer__title">
          The journey ends where the <em>real work</em> begins.
        </h2>
        <div className="footer__meta">{totalWeeks} weeks · 9 phases · {totalSections} modules · one engineer</div>
      </footer>
    </React.Fragment>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
