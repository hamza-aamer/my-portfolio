// Top bar, slide-in drawer, bottom tab bar

function TopBar({ onMenu, scrolled, dwell }) {
  return (
    <header className={"topbar" + (scrolled ? " is-scrolled" : "")}>
      <a href="#home" className="brand" onClick={(e)=>{e.preventDefault();document.getElementById('home').scrollIntoView({behavior:'smooth'})}}>
        <span className="brand-sq">HA</span>
        <span className="brand-meta">
          <span className="mono brand-l1">HAMZA AAMER</span>
          <span className="mono brand-l2">DS TEAM LEAD</span>
        </span>
      </a>
      <div className="top-right">
        <span className="mono dwell"><span className="dwell-k">DWELL</span>{dwell}</span>
        <button className="icon-btn" onClick={onMenu} aria-label="Menu"><Icon.Menu/></button>
      </div>
    </header>
  );
}

const NAV_ITEMS = [
  { id: 'home', idx: '00', label: 'Index' },
  { id: 'about', idx: '01', label: 'Manifesto' },
  { id: 'work', idx: '02', label: 'Selected Work' },
  { id: 'timeline', idx: '03', label: 'Timeline' },
  { id: 'playground', idx: '04', label: 'Playground' },
  { id: 'contact', idx: '05', label: 'Contact' },
];

function Drawer({ open, onClose, active }) {
  React.useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const go = (id) => {
    onClose();
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 280);
  };

  return (
    <div className={"drawer" + (open ? " is-open" : "")} aria-hidden={!open}>
      <div className="drawer-top">
        <span className="mono">MENU / 06</span>
        <button className="icon-btn" onClick={onClose} aria-label="Close"><Icon.Close/></button>
      </div>
      <nav className="drawer-nav">
        {NAV_ITEMS.map((it, i) => (
          <button
            key={it.id}
            className={"drawer-item" + (active === it.id ? " is-active" : "")}
            onClick={() => go(it.id)}
            style={{ transitionDelay: open ? `${80 + i * 40}ms` : '0ms' }}
          >
            <span className="mono di-idx">{it.idx}</span>
            <span className="di-label">{it.label}</span>
            <Icon.Arrow className="di-arrow"/>
          </button>
        ))}
      </nav>
      <div className="drawer-foot">
        <div className="df-row">
          <span className="mono df-k">STATUS</span>
          <span className="df-v"><span className="live-dot"/>Building</span>
        </div>
        <div className="df-row">
          <span className="mono df-k">LOC</span>
          <span className="df-v">Karlsruhe · UTC+1</span>
        </div>
        <a href="mailto:hamzaaamer6@gmail.com" className="df-cta">
          <span>hamzaaamer6@gmail.com</span>
          <Icon.Arrow/>
        </a>
      </div>
    </div>
  );
}

const TAB_ITEMS = [
  { id: 'home', label: 'Home', icon: Icon.Home },
  { id: 'about', label: 'About', icon: Icon.User },
  { id: 'work', label: 'Work', icon: Icon.Grid },
  { id: 'timeline', label: 'Log', icon: Icon.Clock },
  { id: 'contact', label: 'Mail', icon: Icon.Mail },
];

function TabBar({ active, onGo }) {
  return (
    <nav className="tabbar" aria-label="Section navigation">
      <div className="tabbar-inner">
        {TAB_ITEMS.map(t => {
          const I = t.icon;
          const on = active === t.id || (t.id === 'work' && active === 'playground');
          return (
            <button
              key={t.id}
              className={"tab" + (on ? " is-on" : "")}
              onClick={() => onGo(t.id)}
              aria-label={t.label}
            >
              <I/>
              <span className="mono tab-l">{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

Object.assign(window, { TopBar, Drawer, TabBar, NAV_ITEMS });
