// Magnetic hover
(function(){
  if(window.matchMedia('(max-width:900px)').matches) return;
  document.querySelectorAll('[data-magnetic]').forEach(el=>{
    const strength = 0.35;
    el.addEventListener('mousemove', e=>{
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width/2);
      const y = e.clientY - (r.top + r.height/2);
      el.style.transform = `translate(${x*strength}px, ${y*strength}px)`;
    });
    el.addEventListener('mouseleave', ()=>{
      el.style.transition = 'transform .6s cubic-bezier(.16,1,.3,1)';
      el.style.transform = '';
      setTimeout(()=>{ el.style.transition=''; }, 600);
    });
  });
})();
