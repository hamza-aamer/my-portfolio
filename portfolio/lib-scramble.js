// Scramble text effect
(function(){
  const CHARS = '!<>-_\\/[]{}—=+*^?#';
  class Scramble {
    constructor(el){
      this.el = el;
      this.orig = el.textContent;
      this.queue = [];
      this.frame = 0;
      this.frameReq = null;
      this.resolve = null;
    }
    set(newText){
      const old = this.el.textContent;
      const L = Math.max(old.length, newText.length);
      const promise = new Promise(r=>this.resolve=r);
      this.queue = [];
      for(let i=0;i<L;i++){
        const from = old[i] || '';
        const to = newText[i] || '';
        const start = Math.floor(Math.random()*20);
        const end = start + Math.floor(Math.random()*20);
        this.queue.push({from,to,start,end,char:''});
      }
      cancelAnimationFrame(this.frameReq);
      this.frame = 0;
      this.update();
      return promise;
    }
    update(){
      let out = '', done = 0;
      for(let i=0;i<this.queue.length;i++){
        let {from,to,start,end,char} = this.queue[i];
        if(this.frame >= end){ done++; out += to; }
        else if(this.frame >= start){
          if(!char || Math.random()<0.28){
            char = CHARS[Math.floor(Math.random()*CHARS.length)];
            this.queue[i].char = char;
          }
          out += `<span style="color:var(--accent2)">${char}</span>`;
        } else { out += from; }
      }
      this.el.innerHTML = out;
      if(done === this.queue.length){ this.resolve && this.resolve(); }
      else { this.frameReq = requestAnimationFrame(()=>{ this.frame++; this.update(); }); }
    }
  }
  window.attachScramble = function(el){
    if(el.__scramble) return el.__scramble;
    const s = new Scramble(el);
    el.__scramble = s;
    return s;
  };
})();
