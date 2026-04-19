// Horizontal pinned work section using GSAP ScrollTrigger
(function(){
  window.addEventListener('portfolio:ready', init);
  function init(){
    if(!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    const pin = document.getElementById('workPin');
    const track = document.getElementById('workTrack');
    if(!pin || !track) return;

    // Build helix rungs
    const helix = document.getElementById('helix-ascend');
    if(helix){
      const rungs = 14;
      for(let i=0;i<rungs;i++){
        const r = document.createElement('div');
        r.className = 'rung';
        const angle = (i/rungs)*360;
        const y = (i - rungs/2) * 18;
        r.innerHTML = `<div class="bar"></div>`;
        r.style.transform = `translate(-50%,-50%) translateY(${y}px) rotateY(${angle}deg)`;
        helix.appendChild(r);
      }
      // rotate helix
      let t = 0;
      function spin(){
        t += 0.4;
        helix.style.transform = `rotateY(${t}deg) rotateX(10deg)`;
        requestAnimationFrame(spin);
      }
      spin();
    }

    // Build swarm graph
    const swarmSvg = document.querySelector('.swarm-svg');
    if(swarmSvg){
      const nodes = swarmSvg.querySelector('.nodes');
      const edges = swarmSvg.querySelector('.edges');
      const pts = [];
      const count = 14;
      for(let i=0;i<count;i++){
        const cx = 50 + Math.random()*300;
        const cy = 40 + Math.random()*220;
        pts.push({cx,cy,i});
        const c = document.createElementNS('http://www.w3.org/2000/svg','circle');
        c.setAttribute('cx',cx); c.setAttribute('cy',cy);
        c.setAttribute('r', i===0?6:3);
        const fill = i%3===0 ? 'var(--accent)' : 'var(--fg)';
        c.setAttribute('fill', fill);
        c.style.color = fill;
        nodes.appendChild(c);
      }
      pts.forEach(p=>{
        pts.forEach(q=>{
          if(p===q) return;
          const d = Math.hypot(p.cx-q.cx,p.cy-q.cy);
          if(d < 90 && Math.random()<0.4){
            const l = document.createElementNS('http://www.w3.org/2000/svg','line');
            l.setAttribute('x1',p.cx);l.setAttribute('y1',p.cy);
            l.setAttribute('x2',q.cx);l.setAttribute('y2',q.cy);
            edges.appendChild(l);
          }
        });
      });
      // pulse
      let t = 0;
      function pulse(){
        t += 0.02;
        nodes.querySelectorAll('circle').forEach((c,i)=>{
          const s = 1 + Math.sin(t + i*0.7)*0.3;
          c.setAttribute('r', (i===0?6:3)*s);
        });
        requestAnimationFrame(pulse);
      }
      pulse();
    }

    // Horizontal scroll only on desktop
    if(window.matchMedia('(max-width:900px)').matches) return;

    const cases = track.querySelectorAll('.case');
    const total = cases.length;
    // Shorter scroll distance — 0.6 viewport height per case instead of 1 viewport
    const perCase = window.innerWidth * 0.6;
    const distance = (total - 1) * window.innerWidth; // visual travel stays full
    const scrollLen = (total - 1) * perCase; // vertical scroll required

    let st;
    const tween = gsap.to(track, {
      x: -distance,
      ease:'none',
      scrollTrigger: {
        trigger: pin,
        start:'top top',
        end: ()=> '+=' + scrollLen,
        pin:true,
        scrub: true,
        invalidateOnRefresh:true,
        anticipatePin:1,
      }
    });
    st = tween.scrollTrigger;
    gsap.set(track, {x: 0});

    // Carousel-style advance: one wheel event = jump to next/prev case
    let currentIdx = 0;
    let isSnapping = false;
    const snapToIdx = (idx)=>{
      idx = Math.max(0, Math.min(total - 1, idx));
      currentIdx = idx;
      const progress = idx / (total - 1);
      const target = st.start + progress * (st.end - st.start);
      if(window.__lenis){
        try{ window.__lenis.start(); }catch(_){}
        window.__lenis.scrollTo(target, {duration: 0.7, force: true, easing:(t)=>1-Math.pow(1-t,3)});
      } else {
        window.scrollTo({top: target, behavior:'smooth'});
      }
    };

    // Intercept wheel inside the pinned range
    let wheelCooldown = 0;
    const wheelHandler = (e)=>{
      const sy = window.scrollY;
      if(sy < st.start - 5 || sy > st.end + 5) {
        // Outside pin — safety: ensure Lenis is running
        if(window.__lenis){ try{ window.__lenis.start(); }catch(_){} }
        return;
      }

      const progress = st.progress;
      currentIdx = Math.round(progress * (total - 1));
      const dir = e.deltaY > 0 ? 1 : -1;
      const nextIdx = currentIdx + dir;

      // Let natural scroll pass at boundaries — any attempt to go past first/last exits the pin
      if(nextIdx > total - 1){
        // allow natural scroll out; if not already at end, glide to end first then release
        if(progress < 0.99){
          e.preventDefault();e.stopPropagation();
          const now = Date.now();
          if(now < wheelCooldown) return;
          wheelCooldown = now + 400;
          snapToIdx(total - 1);
        }
        return; // let Lenis continue
      }
      if(nextIdx < 0){
        if(progress > 0.01){
          e.preventDefault();e.stopPropagation();
          const now = Date.now();
          if(now < wheelCooldown) return;
          wheelCooldown = now + 400;
          snapToIdx(0);
        }
        return;
      }

      const now = Date.now();
      if(now < wheelCooldown) { e.preventDefault(); e.stopPropagation(); return; }

      e.preventDefault();
      e.stopPropagation();
      wheelCooldown = now + 800;
      snapToIdx(nextIdx);
    };
    window.addEventListener('wheel', wheelHandler, {passive: false, capture: true});

    // Keyboard
    window.addEventListener('keydown', (e)=>{
      const sy = window.scrollY;
      if(sy < st.start - 5 || sy > st.end + 5) return;
      if(['ArrowDown','PageDown',' '].includes(e.key)){
        e.preventDefault();
        currentIdx = Math.round(st.progress * (total - 1));
        snapToIdx(currentIdx + 1);
      } else if(['ArrowUp','PageUp'].includes(e.key)){
        e.preventDefault();
        currentIdx = Math.round(st.progress * (total - 1));
        snapToIdx(currentIdx - 1);
      }
    });

    // Parallax visuals — keep them always visible, add slight Y offset via container animation
    cases.forEach((c, i)=>{
      const vis = c.querySelector('.case-visual');
      if(vis){
        gsap.set(vis, {opacity:1, y:0});
      }
    });

    // Update progress rail
    const fill = document.getElementById('progressFill');
    if(fill){
      ScrollTrigger.create({
        trigger: document.body,
        start:'top top', end:'bottom bottom',
        onUpdate:(self)=>{
          fill.style.width = (self.progress*100) + '%';
        }
      });
    }

    window.addEventListener('resize', ()=>ScrollTrigger.refresh());
  }
})();
