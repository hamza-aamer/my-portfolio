// Scroll reveals
(function(){
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('in');
        const children = e.target.querySelectorAll('[data-reveal-stagger]');
        children.forEach((c,i)=>{ setTimeout(()=>c.classList.add('in'), 60*i); });
      }
    });
  },{threshold:0.15});
  document.querySelectorAll('[data-reveal],[data-reveal-stagger]').forEach(el=>io.observe(el));

  // timeline reveal
  const tio = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('in'); });
  },{threshold:0.2});
  document.querySelectorAll('.tl-item').forEach(el=>tio.observe(el));

  // timeline line fill + dot activation based on scroll progress through rail
  const tline = document.querySelector('.timeline');
  if(tline){
    const items = Array.from(tline.querySelectorAll('.tl-item'));
    const updateFill = ()=>{
      const r = tline.getBoundingClientRect();
      const viewH = window.innerHeight;
      const start = viewH * 0.85;
      const progressed = Math.max(0, Math.min(r.height, start - r.top));
      const pct = (progressed / r.height) * 100;
      tline.style.setProperty('--tl-fill', Math.min(100, Math.max(0, pct)) + '%');
      // light up dots up to current fill line
      const fillPx = r.top + (pct/100)*r.height; // absolute y of fill bottom
      items.forEach(it=>{
        const year = it.querySelector('.tl-year');
        if(!year) return;
        const yr = year.getBoundingClientRect();
        const dotY = yr.top + 56; // matches ::after top:56px
        if(dotY <= fillPx) it.classList.add('in');
        else it.classList.remove('in');
      });
    };
    window.addEventListener('scroll', updateFill, {passive:true});
    window.addEventListener('resize', updateFill);
    const hookLenis = ()=>{ if(window.__lenis){ window.__lenis.on('scroll', updateFill); return true; } return false; };
    if(!hookLenis()){ setTimeout(hookLenis, 200); setTimeout(hookLenis, 800); }
    function rafTick(){ updateFill(); requestAnimationFrame(rafTick); }
    requestAnimationFrame(rafTick);
    updateFill();
  }

  // also reveal about-list items on stagger
  document.querySelectorAll('.about-list').forEach(list=>{
    const items = list.querySelectorAll('li');
    const lio = new IntersectionObserver((es)=>{
      es.forEach(e=>{
        if(e.isIntersecting){
          items.forEach((it,i)=>setTimeout(()=>it.classList.add('in'), 80*i));
          lio.disconnect();
        }
      });
    },{threshold:0.3});
    lio.observe(list);
  });
})();
