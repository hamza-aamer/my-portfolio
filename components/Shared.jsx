// Shared primitives: icons, small utilities

const Icon = {
  Menu: (p) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M3 7h18M3 17h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  Close: (p) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  Arrow: (p) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M7 7H17V17M7 17L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  ArrowDown: (p) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M12 4v16m0 0l6-6m-6 6l-6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  ChevR: (p) => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  ChevD: (p) => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Dot: (p) => (
    <svg width="6" height="6" viewBox="0 0 6 6" {...p}>
      <circle cx="3" cy="3" r="3" fill="currentColor"/>
    </svg>
  ),
  // tab bar glyphs
  Home: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1v-9z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    </svg>
  ),
  User: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}>
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M4 21c.8-4 4-6 8-6s7.2 2 8 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  Grid: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}>
      <rect x="3" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="13" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="3" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="13" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  ),
  Clock: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  Mail: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M3 7l9 7 9-7" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    </svg>
  ),
};

// Reveal-on-scroll wrapper. Uses IntersectionObserver.
function Reveal({ children, delay = 0, as: Tag = 'div', className = '', style = {} }) {
  const ref = React.useRef(null);
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current; if (!el) return;
    const root = document.getElementById('screen') || null;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setShown(true); io.disconnect(); }
    }, { root, threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity .8s cubic-bezier(.16,1,.3,1) ${delay}ms, transform .9s cubic-bezier(.16,1,.3,1) ${delay}ms`,
        ...style,
      }}
    >{children}</Tag>
  );
}

// Section head block (index + divider)
function SectionHead({ idx, label }) {
  return (
    <div className="sec-head">
      <span className="mono sec-idx">§ {idx} — {label}</span>
      <div className="sec-rule"/>
    </div>
  );
}

Object.assign(window, { Icon, Reveal, SectionHead });
