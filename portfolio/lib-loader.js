// Loader boot sequence
(function(){
  const loader = document.getElementById('loader');
  const fill = document.getElementById('loaderFill');
  const status = document.getElementById('loaderStatus');
  const pct = document.getElementById('loaderPct');
  const messages = [
    'Initializing…',
    'Loading shaders…',
    'Compiling DNA signatures…',
    'Spawning agent swarm…',
    'Calibrating scroll engine…',
    'Ready.'
  ];
  let p = 0;
  let started = false;
  let finished = false;
  const start = performance.now();
  function tickFrame(){
    const elapsed = performance.now() - start;
    p = Math.min(100, elapsed / 14);
    fill.style.width = p + '%';
    pct.textContent = Math.floor(p) + '%';
    const mi = Math.min(messages.length-1, Math.floor(p/20));
    status.textContent = messages[mi];
    if(p < 100) requestAnimationFrame(tickFrame);
    else finish();
  }
  function tick(){
    if(started) return;
    started = true;
    tickFrame();
  }
  document.querySelectorAll('.ht-char').forEach((c,i)=>{
    c.style.setProperty('--i', i % 5);
  });
  function finish(){
    if(finished) return;
    finished = true;
    setTimeout(()=>{
      loader.classList.add('done');
      document.body.classList.add('loaded');
      window.dispatchEvent(new Event('portfolio:ready'));
    }, 300);
  }
  window.addEventListener('load', tick);
  setTimeout(tick, 100);
})();
