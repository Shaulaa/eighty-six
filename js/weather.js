/* ============================================
   weather.js — EIGHTY-SIX Rain Effect
   ============================================ */
'use strict';

(function(){
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'weather-canvas';
  Object.assign(canvas.style, {
    position:      'absolute',
    top:           '0',
    left:          '0',
    width:         '100%',
    height:        '100%',
    zIndex:        '6',       /* above bg, grid, scanlines, slash, particles */
    pointerEvents: 'none',
  });
  hero.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let W, H, drops=[], splashes=[];

  function resize(){
    W = canvas.width  = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  }

  class Drop {
    reset(init=false){
      this.x     = Math.random()*(W+200)-100;
      this.y     = init ? Math.random()*H*0.6 : -20;
      this.len   = 12 + Math.random()*18;
      this.speed = 12 + Math.random()*14;
      this.vx    = 2.5;
      this.op    = 0.1 + Math.random()*0.28;
      this.w     = 0.3 + Math.random()*0.5;
    }
    constructor(){ this.reset(true); }
    update(){
      this.x += this.vx;
      this.y += this.speed;
      if (this.y > H+20){
        splashes.push(new Splash(this.x, H-2));
        this.reset();
      }
    }
    draw(){
      ctx.save();
      ctx.strokeStyle = `rgba(174,210,230,${this.op})`;
      ctx.lineWidth = this.w;
      ctx.beginPath();
      const ex = this.x + this.vx*(this.len/this.speed);
      const ey = this.y + this.len;
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(ex, ey);
      ctx.stroke();
      ctx.restore();
    }
  }

  class Splash {
    constructor(x,y){
      this.x=x; this.y=y;
      this.life=1;
      this.decay=0.07+Math.random()*0.08;
      this.rx=2+Math.random()*3;
      this.ry=0.4+Math.random()*0.5;
      this.op=0.15+Math.random()*0.18;
    }
    update(){ this.life-=this.decay; }
    dead(){ return this.life<=0; }
    draw(){
      ctx.save();
      ctx.strokeStyle=`rgba(174,210,230,${this.op*this.life})`;
      ctx.lineWidth=0.6;
      ctx.beginPath();
      ctx.ellipse(this.x,this.y,this.rx*(2-this.life),this.ry,0,0,Math.PI*2);
      ctx.stroke();
      ctx.restore();
    }
  }

  let fog=0;
  function drawAtmos(){
    fog+=0.1;
    /* bottom vignette */
    const g=ctx.createLinearGradient(0,H*0.5,0,H);
    g.addColorStop(0,'rgba(8,10,14,0)');
    g.addColorStop(1,'rgba(8,10,14,0.22)');
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);

    /* slow fog wisps */
    for(let i=0;i<4;i++){
      const x=((fog*(i+1)*0.35)%(W+400))-200;
      const y=H*(0.52+i*0.1);
      const gr=ctx.createRadialGradient(x,y,0,x,y,180+i*50);
      gr.addColorStop(0,`rgba(140,170,195,${0.05-i*0.008})`);
      gr.addColorStop(1,'rgba(140,170,195,0)');
      ctx.fillStyle=gr; ctx.fillRect(0,0,W,H);
    }
  }

  function init(){
    drops=[];
    for(let i=0;i<200;i++) drops.push(new Drop());
  }

  function animate(){
    ctx.clearRect(0,0,W,H);
    drawAtmos();
    drops.forEach(d=>{ d.update(); d.draw(); });
    splashes=splashes.filter(s=>!s.dead());
    splashes.forEach(s=>{ s.update(); s.draw(); });
    requestAnimationFrame(animate);
  }

  resize(); init(); animate();
  window.addEventListener('resize',()=>{ resize(); init(); });
})();
