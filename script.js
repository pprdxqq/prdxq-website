const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const modules=document.querySelectorAll('.module');
modules.forEach(button=>button.addEventListener('click',()=>{
  modules.forEach(b=>b.classList.remove('active')); button.classList.add('active');
  const name=document.getElementById('moduleName'),desc=document.getElementById('moduleDesc');
  if(name){name.textContent=button.dataset.module;desc.textContent=button.dataset.desc;if(!reduced)name.animate([{opacity:.15,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{duration:350,easing:'ease-out'});}
}));

if(window.matchMedia('(pointer:fine)').matches&&!reduced){
 const cursor=document.querySelector('.cursor');let x=innerWidth/2,y=innerHeight/2,cx=x,cy=y;
 window.addEventListener('pointermove',e=>{x=e.clientX;y=e.clientY});
 const loop=()=>{cx+=(x-cx)*.16;cy+=(y-cy)*.16;cursor.style.left=cx+'px';cursor.style.top=cy+'px';requestAnimationFrame(loop)};loop();
 document.querySelectorAll('a,button').forEach(el=>{el.addEventListener('mouseenter',()=>{cursor.style.width='28px';cursor.style.height='28px'});el.addEventListener('mouseleave',()=>{cursor.style.width='9px';cursor.style.height='9px'})});
}

const form=document.getElementById('contactForm');
if(form)form.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(form);const subject=encodeURIComponent(`PRDXQ Projektanfrage von ${d.get('name')}`);const body=encodeURIComponent(`Name: ${d.get('name')}\nKontakt: ${d.get('contact')}\n\nProjekt:\n${d.get('message')}`);location.href=`mailto:ilias.asdufan@icloud.de?subject=${subject}&body=${body}`});
