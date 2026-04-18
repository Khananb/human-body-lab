// particles.js
(function(){
  const canvas = document.getElementById('particles');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const COUNT = 80;

  function init() {
    particles = [];
    for(let i=0;i<COUNT;i++) {
      particles.push({
        x: Math.random(), y: Math.random(),
        vx: (Math.random()-0.5)*0.0015, vy: (Math.random()-0.5)*0.0015,
        size: Math.random()*2+0.8, baseSize: Math.random()*2+0.8, pulse: Math.random()*6.28
      });
    }
  }
  function resize() {
    width = window.innerWidth; height = window.innerHeight;
    canvas.width = width; canvas.height = height;
  }
  function draw() {
    ctx.clearRect(0,0,width,height);
    ctx.strokeStyle = 'rgba(70,150,255,0.12)';
    ctx.lineWidth = 0.6;
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const dx = (particles[i].x - particles[j].x)*width;
        const dy = (particles[i].y - particles[j].y)*height;
        const dist = Math.sqrt(dx*dx+dy*dy);
        if(dist<110){
          ctx.beginPath();
          ctx.moveTo(particles[i].x*width, particles[i].y*height);
          ctx.lineTo(particles[j].x*width, particles[j].y*height);
          ctx.strokeStyle = `rgba(80,170,255,${0.15*(1-dist/140)})`;
          ctx.stroke();
        }
      }
    }
    particles.forEach(p => {
      const pulse = Math.sin(Date.now()*0.002 + p.pulse)*0.15+0.9;
      const size = p.baseSize * pulse;
      const grad = ctx.createRadialGradient(p.x*width, p.y*height, 0, p.x*width, p.y*height, size*3);
      grad.addColorStop(0,'#aac9ff'); grad.addColorStop(0.7,'#3f78c0'); grad.addColorStop(1,'transparent');
      ctx.beginPath(); ctx.arc(p.x*width, p.y*height, size, 0, 2*Math.PI);
      ctx.fillStyle = grad; ctx.shadowColor = '#3f9eff'; ctx.shadowBlur = 10; ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if(p.x<0)p.x=1; if(p.x>1)p.x=0; if(p.y<0)p.y=1; if(p.y>1)p.y=0;
    });
    ctx.shadowBlur = 0;
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', resize);
  init(); resize(); draw();
})();
