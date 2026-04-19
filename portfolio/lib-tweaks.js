// Tweaks panel
(function(){
  const T = window.__TWEAKS__ || {};
  const root = document.documentElement;

  function apply(){
    root.style.setProperty('--accent', T.accent);
    root.style.setProperty('--accent2', T.accent2);
    root.style.setProperty('--motion-scale', (T.motion/10).toString());
    if(window.__setAudio) window.__setAudio(!!T.audio);
    if(T.dark===true){
      // Optional dark mode — kept for completeness but default is warm off-white
      root.style.setProperty('--bg','#15140f');
      root.style.setProperty('--bg-2','#1c1b15');
      root.style.setProperty('--fg','#ede8dc');
      root.style.setProperty('--fg-dim','#a8a395');
      root.style.setProperty('--fg-mute','#6e6a5e');
      root.style.setProperty('--rule','rgba(237,232,220,0.14)');
      root.style.setProperty('--rule-strong','rgba(237,232,220,0.26)');
    } else {
      // Warm editorial off-white (default)
      root.style.setProperty('--bg','#f3efe6');
      root.style.setProperty('--bg-2','#ebe5d8');
      root.style.setProperty('--fg','#1a1916');
      root.style.setProperty('--fg-dim','#5a564d');
      root.style.setProperty('--fg-mute','#8a8579');
      root.style.setProperty('--rule','rgba(26,25,22,0.14)');
      root.style.setProperty('--rule-strong','rgba(26,25,22,0.28)');
    }
  }
  apply();

  const tw = document.getElementById('tweaks');
  const a = document.getElementById('tw-accent');
  const a2 = document.getElementById('tw-accent2');
  const m = document.getElementById('tw-motion');
  const mv = document.getElementById('tw-motion-v');
  const au = document.getElementById('tw-audio');
  const dk = document.getElementById('tw-dark');

  a.value = T.accent; a2.value = T.accent2;
  m.value = T.motion; mv.textContent = T.motion;
  au.checked = !!T.audio; dk.checked = T.dark === true;

  function change(key, val){
    T[key] = val;
    window.__TWEAKS__ = T;
    apply();
    try{
      window.parent.postMessage({type:'__edit_mode_set_keys', edits:{[key]:val}}, '*');
    }catch(e){}
  }
  a.addEventListener('input', e=>change('accent', e.target.value));
  a2.addEventListener('input', e=>change('accent2', e.target.value));
  m.addEventListener('input', e=>{ mv.textContent = e.target.value; change('motion', +e.target.value); });
  au.addEventListener('change', e=>change('audio', e.target.checked));
  dk.addEventListener('change', e=>change('dark', e.target.checked));

  // Listen for toolbar
  window.addEventListener('message', e=>{
    const d = e.data || {};
    if(d.type === '__activate_edit_mode'){ tw.hidden=false; tw.style.display=''; requestAnimationFrame(()=>tw.classList.add('open')); }
    if(d.type === '__deactivate_edit_mode'){ tw.classList.remove('open'); setTimeout(()=>{ tw.hidden=true; tw.style.display='none'; }, 400); }
  });
  try{ window.parent.postMessage({type:'__edit_mode_available'}, '*'); }catch(e){}
})();
