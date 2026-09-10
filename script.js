const progress=document.querySelector('.progress span');
const reveals=document.querySelectorAll('.reveal');
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}})},{threshold:.1});
reveals.forEach(el=>observer.observe(el));

const updateScroll=()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=`${max>0?(scrollY/max)*100:0}%`};
window.addEventListener('scroll',updateScroll,{passive:true});updateScroll();

// Cards: tap/click opens a focused project detail layer.
const modal=document.querySelector('.project-modal');
const modalTitle=document.querySelector('.modal-title');
const modalKicker=document.querySelector('.modal-kicker');
const modalDetail=document.querySelector('.modal-detail');
const modalStack=document.querySelector('.modal-stack');
const closeModal=()=>{modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.classList.remove('lock')};
const openModal=card=>{modalKicker.textContent=card.dataset.kicker;modalTitle.textContent=card.dataset.title;modalDetail.textContent=card.dataset.detail;modalStack.innerHTML=card.dataset.stack.split(' / ').map(item=>`<span>${item}</span>`).join('');modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.classList.add('lock');modal.querySelector('.modal-close').focus()};

document.querySelectorAll('.card').forEach(card=>{
  card.addEventListener('click',e=>{if(e.target.closest('a,button'))return;openModal(card)});
  card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openModal(card)}});
});
document.querySelector('.modal-close').addEventListener('click',closeModal);
document.querySelector('.modal-backdrop').addEventListener('click',closeModal);
window.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});

document.querySelectorAll('.module').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('.module').forEach(b=>b.classList.remove('active'));
  button.classList.add('active');
  const name=document.getElementById('moduleName');
  const desc=document.getElementById('moduleDesc');
  name.textContent=button.dataset.module;desc.textContent=button.dataset.desc;
  if(!reduced)name.animate([{opacity:.1,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,easing:'cubic-bezier(.2,.8,.2,1)'});
}));

// Desktop: custom cursor, magnetic controls, card tilt and spotlight tracking.
if(window.matchMedia('(pointer:fine)').matches&&!reduced){
  const cursor=document.querySelector('.cursor');let mx=innerWidth/2,my=innerHeight/2,cx=mx,cy=my;
  window.addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY});
  const cursorLoop=()=>{cx+=(mx-cx)*.18;cy+=(my-cy)*.18;cursor.style.transform=`translate(${cx}px,${cy}px) translate(-50%,-50%)`;requestAnimationFrame(cursorLoop)};cursorLoop();
  document.querySelectorAll('a,button,.card,.module').forEach(el=>{el.addEventListener('mouseenter',()=>document.body.classList.add('hovering'));el.addEventListener('mouseleave',()=>document.body.classList.remove('hovering'))});
  document.querySelectorAll('.magnetic').forEach(el=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.16}px,${(e.clientY-r.top-r.height/2)*.16}px)`});el.addEventListener('pointerleave',()=>el.style.transform='')});
  document.querySelectorAll('.card').forEach(card=>{card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();const x=(e.clientX-r.left)/r.width*100;const y=(e.clientY-r.top)/r.height*100;card.style.setProperty('--mx',`${x}%`);card.style.setProperty('--my',`${y}%`);card.style.transform=`perspective(900px) rotateX(${(y/100-.5)*-4}deg) rotateY(${(x/100-.5)*4}deg) translateY(-5px)`});card.addEventListener('pointerleave',()=>card.style.transform='')});
}

// Subtle parallax on the hero while scrolling.
if(!reduced){window.addEventListener('scroll',()=>{const y=Math.min(scrollY,innerHeight);const orb=document.querySelector('.hero-orb');const main=document.querySelector('.hero-main');if(orb)orb.style.marginTop=`${y*.08}px`;if(main)main.style.translate=`0 ${y*-.045}px`},{passive:true})}

const form=document.getElementById('contactForm');
form.addEventListener('submit',e=>{e.preventDefault();const data=new FormData(form);const subject=encodeURIComponent(`PRDXQ Projektanfrage von ${data.get('name')}`);const body=encodeURIComponent(`Name: ${data.get('name')}\nKontakt: ${data.get('contact')}\n\nProjekt:\n${data.get('message')}`);window.location.href=`mailto:ilias.asdufan@icloud.de?subject=${subject}&body=${body}`});
