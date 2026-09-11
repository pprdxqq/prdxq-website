const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const modules=document.querySelectorAll('.module');
const labCore=document.querySelector('.lab-core');
const ring=document.querySelector('.core-ring:not(.two)');
const ringTwo=document.querySelector('.core-ring.two');
const center=document.querySelector('.core-center');
const states={
 'FULL-STACK':{r:'rotate(0deg) scaleX(1)',r2:'rotate(72deg) scaleX(.72)',d:'14s',d2:'9s',label:'Q'},
 'AUTOMATION':{r:'rotate(35deg) scaleX(.5)',r2:'rotate(-35deg) scaleX(.85)',d:'6s',d2:'10s',label:'A'},
 'DESIGN':{r:'rotate(45deg) scale(.76)',r2:'rotate(-45deg) scale(.58)',d:'18s',d2:'12s',label:'D'},
 'MEDIA':{r:'rotate(-28deg) scaleX(1.15) scaleY(.62)',r2:'rotate(28deg) scaleX(.72) scaleY(.45)',d:'5s',d2:'8s',label:'M'}
};
const setLabState=name=>{
 const s=states[name]||states['FULL-STACK'];
 if(!ring||!ringTwo||!center)return;
 ring.style.transform=s.r;ring.style.animationDuration=s.d;
 ringTwo.style.transform=s.r2;ringTwo.style.animationDuration=s.d2;
 center.textContent=s.label;
 if(labCore&&!reduced)labCore.animate([{transform:'translate(-50%,-50%) scale(.82)'},{transform:'translate(-50%,-50%) scale(1)'}],{duration:420,easing:'cubic-bezier(.2,.8,.2,1)'});
};
modules.forEach(button=>button.addEventListener('click',()=>{
 modules.forEach(b=>b.classList.remove('active'));button.classList.add('active');
 const name=document.getElementById('moduleName'),desc=document.getElementById('moduleDesc');
 if(name){name.textContent=button.dataset.module;desc.textContent=button.dataset.desc;setLabState(button.dataset.module);if(!reduced)name.animate([{opacity:.15,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{duration:350,easing:'ease-out'});}
}));

if(window.matchMedia('(pointer:fine)').matches&&!reduced){
 const cursor=document.querySelector('.cursor');let x=innerWidth/2,y=innerHeight/2,cx=x,cy=y;
 window.addEventListener('pointermove',e=>{x=e.clientX;y=e.clientY});
 const loop=()=>{cx+=(x-cx)*.16;cy+=(y-cy)*.16;cursor.style.left=cx+'px';cursor.style.top=cy+'px';requestAnimationFrame(loop)};loop();
 document.querySelectorAll('a,button').forEach(el=>{el.addEventListener('mouseenter',()=>{cursor.style.width='28px';cursor.style.height='28px'});el.addEventListener('mouseleave',()=>{cursor.style.width='9px';cursor.style.height='9px'})});
}

const form=document.getElementById('contactForm');
if(form)form.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(form);const subject=encodeURIComponent(`PRDXQ Projektanfrage von ${d.get('name')}`);const body=encodeURIComponent(`Name: ${d.get('name')}\nKontakt: ${d.get('contact')}\n\nProjekt:\n${d.get('message')}`);location.href=`mailto:ilias.asdufan@icloud.de?subject=${subject}&body=${body}`});
