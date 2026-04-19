// Custom cursor + morphs based on context
(function(){
  const cur = document.getElementById('cursor');
  const dot = cur.querySelector('.cursor-dot');
  const ring = cur.querySelector('.cursor-ring');
  const label = document.getElementById('cursorLabel');
  if(window.matchMedia('(max-width:900px)').matches) return;

  let tx=innerWidth/2, ty=innerHeight/2, rx=tx, ry=ty;
  window.addEventListener('mousemove', e=>{ tx=e.clientX; ty=e.clientY; });
  function frame(){
    rx += (tx-rx)*0.18;
    ry += (ty-ry)*0.18;
    dot.style.transform = `translate(${tx}px,${ty}px) translate(-50%,-50%)`;
    ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    label.style.transform = `translate(${rx}px,${ry}px)`;
    requestAnimationFrame(frame);
  }
  frame();

  // hover detection
  const hoverSel = 'a, button, [data-magnetic], .chip, .pg-card, input, textarea';
  document.addEventListener('mouseover', e=>{
    const t = e.target.closest(hoverSel);
    if(t){
      cur.classList.add('hover');
      const lbl = t.dataset.cursor;
      if(lbl){
        cur.classList.add('label');
        label.textContent = lbl.toUpperCase();
      }
    }
  });
  document.addEventListener('mouseout', e=>{
    const t = e.target.closest(hoverSel);
    if(t){ cur.classList.remove('hover','label'); }
  });
})();
