// Dwell meter, GitHub contribution graph, konami code, audio, resume click
(function(){
  // Dwell
  const dwell = document.getElementById('dwellTime');
  if(dwell){
    const t0 = Date.now();
    setInterval(()=>{
      const s = Math.floor((Date.now() - t0)/1000);
      const m = String(Math.floor(s/60)).padStart(2,'0');
      const ss = String(s%60).padStart(2,'0');
      dwell.textContent = `${m}:${ss}`;
    }, 1000);
  }

  // GitHub contribution graph — synthetic but plausible pattern
  const gh = document.getElementById('ghGraph');
  if(gh){
    const weeks = 52, days = 7;
    for(let w=0; w<weeks; w++){
      for(let d=0; d<days; d++){
        const cell = document.createElement('div');
        cell.className='gh-cell';
        // weekend less likely; trend rising
        const base = Math.random();
        let lvl = 0;
        const factor = w/weeks;
        if(base < 0.25) lvl = 0;
        else if(base < 0.5) lvl = 1;
        else if(base < 0.75) lvl = 2;
        else if(base < 0.92) lvl = 3;
        else lvl = 4;
        if(d===0 || d===6){ lvl = Math.max(0, lvl-1); }
        if(factor > 0.8 && Math.random() < 0.6) lvl = Math.min(4, lvl+1);
        if(lvl>0) cell.setAttribute('data-lvl', lvl);
        gh.appendChild(cell);
      }
    }
  }

  // Nav scrolled state
  const nav = document.querySelector('.nav');
  if(nav){
    window.addEventListener('scroll', ()=>{
      if(window.scrollY > 40) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    });
  }

  // Resume button (placeholder — would link to real resume.pdf)
  const rb = document.getElementById('resumeBtn');
  if(rb){
    rb.addEventListener('click', (e)=>{
      e.preventDefault();
      // Try GitHub-hosted resume first
      window.open('https://github.com/hamza-aamer/my-portfolio/raw/main/assets/hamza_resume.pdf', '_blank');
    });
  }

  // Contact form — Formspree via AJAX
  const cf = document.getElementById('cf');
  if(cf){
    cf.addEventListener('submit', (e)=>{
      e.preventDefault();
      const btn = cf.querySelector('.cf-submit span');
      const orig = btn.textContent;
      btn.textContent = 'Sending…';
      fetch(cf.action, {
        method: 'POST',
        body: new FormData(cf),
        headers: {'Accept': 'application/json'}
      }).then(r=>{
        if(r.ok){
          btn.textContent = 'Sent \u2713';
          cf.reset();
        } else {
          btn.textContent = 'Error — retry';
        }
        setTimeout(()=>{ btn.textContent = orig; }, 3000);
      }).catch(()=>{
        btn.textContent = 'Error — retry';
        setTimeout(()=>{ btn.textContent = orig; }, 3000);
      });
    });
  }

  // Smooth scroll with Lenis (integrated with GSAP ScrollTrigger)
  let lenis = null;
  if(window.Lenis && window.gsap && window.ScrollTrigger){
    lenis = new Lenis({
      duration: 1.1,
      easing: t=>Math.min(1, 1.001 - Math.pow(2, -10*t)),
      wheelMultiplier: 1,
      smoothWheel: true,
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time)=>lenis.raf(time*1000));
    gsap.ticker.lagSmoothing(0);
    // Critical: keep Lenis's dimension cache in sync with ScrollTrigger refreshes
    // (pin-spacers change document height after init — without this, Lenis caps
    //  scroll at a stale limit and freezes mid-page).
    ScrollTrigger.addEventListener('refresh', ()=>lenis.resize());
    ScrollTrigger.refresh();
    // Also resize on resize/load
    window.addEventListener('load', ()=>lenis.resize());
    window.addEventListener('resize', ()=>lenis.resize());
    // Override window.scrollTo so ScrollTrigger snap goes through Lenis smoothly
    const origScrollTo = window.scrollTo.bind(window);
    window.scrollTo = function(x, y){
      let target = null;
      if(typeof x === 'object' && x !== null && 'top' in x){ target = x.top; }
      else if(typeof y === 'number'){ target = y; }
      if(target !== null){
        lenis.scrollTo(target, {duration: 0.55, lock: true});
      } else {
        origScrollTo(x, y);
      }
    };
    // anchor links
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
      a.addEventListener('click', (e)=>{
        const id = a.getAttribute('href');
        if(id.length < 2) return;
        const t = document.querySelector(id);
        if(!t) return;
        e.preventDefault();
        // Ensure Lenis is running (horizontal carousel may have paused it)
        try{ lenis.start(); }catch(_){}
        // Use a raw numeric target — more reliable than element ref when targets are
        // inside pinned sections where ScrollTrigger rewrites offsets.
        const rect = t.getBoundingClientRect();
        const target = window.scrollY + rect.top - 60;
        lenis.scrollTo(target, {force:true, duration: 1.4, lock:false});
      });
    });
    window.__lenis = lenis;
  }

  // Scramble on nav hover
  document.querySelectorAll('[data-scramble]').forEach(el=>{
    const s = window.attachScramble(el);
    const orig = el.textContent;
    el.addEventListener('mouseenter', ()=>{ s.set(orig); });
  });

  // Konami code
  const seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','KeyB','KeyA'];
  let idx = 0;
  window.addEventListener('keydown', e=>{
    const want = seq[idx];
    const got = e.code;
    if(got === want){ idx++; if(idx===seq.length){ showKonami(); idx=0; } }
    else{ idx = (got===seq[0]?1:0); }
  });
  function showKonami(){
    let k = document.getElementById('konami');
    if(!k){
      k = document.createElement('div');
      k.id = 'konami'; k.className = 'konami';
      k.innerHTML = `<div class="konami-inner"><div class="mono">ACCESS GRANTED</div><h2 class="k-h">You found it.</h2><p class="k-p">The real portfolio is the problems we solve along the way. Thanks for digging.</p><button class="btn-outline" id="kClose" data-magnetic><span>Continue</span></button></div>`;
      document.body.appendChild(k);
      k.querySelector('#kClose').addEventListener('click', ()=>k.remove());
    }
    document.documentElement.style.setProperty('--accent','#10b981');
    document.documentElement.style.setProperty('--accent2','#fbbf24');
  }

  // Audio hover feedback (subtle clicks)
  let audioOn = !!window.__TWEAKS__?.audio;
  let audioCtx = null;
  function ensureAudio(){
    if(!audioCtx){
      try{ audioCtx = new (window.AudioContext||window.webkitAudioContext)(); }catch(e){}
    }
    return audioCtx;
  }
  function blip(freq=440, dur=0.04, vol=0.03){
    if(!audioOn) return;
    const ctx = ensureAudio(); if(!ctx) return;
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.frequency.value = freq; o.type='sine';
    g.gain.value = vol;
    o.connect(g).connect(ctx.destination);
    o.start(); o.stop(ctx.currentTime + dur);
    g.gain.setTargetAtTime(0, ctx.currentTime+dur*0.3, 0.02);
  }
  document.addEventListener('mouseover', e=>{
    const t = e.target.closest('a,button,[data-magnetic]');
    if(t) blip(880, 0.03, 0.02);
  });
  window.__setAudio = v => { audioOn = v; };

})();
