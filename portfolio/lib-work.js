// Horizontal pinned work section using GSAP ScrollTrigger
(function(){
  window.addEventListener('portfolio:ready', init);

  function init(){
    if(!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    const pin = document.getElementById('workPin');
    const track = document.getElementById('workTrack');
    if(!pin || !track) return;

    // ---- Build helix (Ascend viz) ----
    const helix = document.getElementById('helix-ascend');
    if(helix){
      for(let i=0;i<14;i++){
        const r = document.createElement('div');
        r.className = 'rung';
        r.innerHTML = '<div class="bar"></div>';
        r.style.transform = 'translate(-50%,-50%) translateY('+(i-7)*18+'px) rotateY('+(i/14*360)+'deg)';
        helix.appendChild(r);
      }
      let a = 0;
      (function spin(){ a+=0.4; helix.style.transform='rotateY('+a+'deg) rotateX(10deg)'; requestAnimationFrame(spin); })();
    }

    // ---- Build swarm (Ant-AI viz) ----
    const swarmSvg = document.querySelector('.swarm-svg');
    if(swarmSvg){
      const nodes = swarmSvg.querySelector('.nodes');
      const edges = swarmSvg.querySelector('.edges');
      const pts = [];
      for(let i=0;i<14;i++){
        const cx=50+Math.random()*300, cy=40+Math.random()*220;
        pts.push({cx,cy});
        const c = document.createElementNS('http://www.w3.org/2000/svg','circle');
        c.setAttribute('cx',cx); c.setAttribute('cy',cy);
        c.setAttribute('r',i===0?6:3);
        const fill = i%3===0?'var(--accent)':'var(--fg)';
        c.setAttribute('fill',fill); c.style.color=fill;
        nodes.appendChild(c);
      }
      pts.forEach(function(p){
        pts.forEach(function(q){
          if(p===q) return;
          if(Math.hypot(p.cx-q.cx,p.cy-q.cy)<90 && Math.random()<0.4){
            const l = document.createElementNS('http://www.w3.org/2000/svg','line');
            l.setAttribute('x1',p.cx);l.setAttribute('y1',p.cy);
            l.setAttribute('x2',q.cx);l.setAttribute('y2',q.cy);
            edges.appendChild(l);
          }
        });
      });
      let t=0;
      (function pulse(){
        t+=0.02;
        nodes.querySelectorAll('circle').forEach(function(c,i){
          c.setAttribute('r',(i===0?6:3)*(1+Math.sin(t+i*0.7)*0.3));
        });
        requestAnimationFrame(pulse);
      })();
    }

    // ---- Horizontal scroll (desktop only) ----
    if(window.innerWidth <= 900) return;

    var cases = track.querySelectorAll('.case');
    var total = cases.length;
    var distance = (total - 1) * window.innerWidth;

    // Simple GSAP horizontal pin with native snap
    gsap.to(track, {
      x: function(){ return -distance; },
      ease: 'none',
      scrollTrigger: {
        trigger: pin,
        start: 'top top',
        end: function(){ return '+=' + distance; },
        pin: true,
        scrub: 0.3,
        snap: {
          snapTo: 1/(total-1),
          duration: {min:0.15, max:0.5},
          ease: 'power1.inOut'
        },
        invalidateOnRefresh: true,
        anticipatePin: 1
      }
    });

    // Ensure visuals are visible
    cases.forEach(function(c){
      var vis = c.querySelector('.case-visual');
      if(vis) gsap.set(vis, {opacity:1, y:0});
    });

    // Progress rail
    var fill = document.getElementById('progressFill');
    if(fill){
      ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: function(self){ fill.style.width = (self.progress*100)+'%'; }
      });
    }

    // Refresh on resize
    window.addEventListener('resize', function(){ ScrollTrigger.refresh(); });
  }
})();
