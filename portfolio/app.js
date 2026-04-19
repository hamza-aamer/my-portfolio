// Entry — minimal orchestration (most init is in lib-*.js files)
(function(){
  // set char animation indices for hero (per-line)
  document.querySelectorAll('.ht-line').forEach(line=>{
    line.querySelectorAll('.ht-char').forEach((c,i)=>{
      c.style.setProperty('--i', i);
    });
  });
})();
