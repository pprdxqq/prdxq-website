const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(e=>observer.observe(e));

const data={
 build:{code:'01',title:'FULL-STACK',desc:'Von der Oberfläche bis zur Datenbank.',status:'BUILD',tags:['FRONTEND','BACKEND','API','DATABASE']},
 apps:{code:'02',title:'APPS & SOFTWARE',desc:'Tools und Anwendungen für konkrete Aufgaben.',status:'APPS',tags:['DESKTOP','MOBILE','TOOLS','SOFTWARE']},
 systems:{code:'03',title:'SYSTEME & AUTOMATION',desc:'Daten, APIs und Prozesse miteinander verbinden.',status:'AUTOMATE',tags:['DATABASE','WORKFLOW','API','INTEGRATION']},
 design:{code:'04',title:'UI / UX & GRAFIK',desc:'Interfaces und Visuals mit Funktion und Charakter.',status:'DESIGN',tags:['UI','UX','BRANDING','VISUALS']},
 media:{code:'05',title:'FOTO · VIDEO · SOCIAL',desc:'Aufnehmen, bearbeiten und Content produzieren.',status:'CREATE',tags:['PHOTO','VIDEO','EDITING','SOCIAL']},
 it:{code:'06',title:'IT & ADMIN',desc:'Hosting, Infrastruktur und technische Setups.',status:'SYSTEM',tags:['HOSTING','DEPLOYMENT','ADMIN','SETUP']}
};
const stage=document.querySelector('.skill-stage');
if(stage){
 const code=document.querySelector('#skillCode'),title=document.querySelector('#skillTitle'),desc=document.querySelector('#skillDesc'),status=document.querySelector('#skillStatus'),tags=document.querySelector('#skillTags');
 document.querySelectorAll('.skill-item').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.skill-item').forEach(x=>x.classList.remove('active'));btn.classList.add('active');
  const s=data[btn.dataset.skill]||data.build;stage.dataset.stage=btn.dataset.skill;
  code.textContent=s.code;title.textContent=s.title;desc.textContent=s.desc;status.textContent=s.status;
  tags.innerHTML=s.tags.map(x=>'<i>'+x+'</i>').join('');
 }));
}
const form=document.getElementById('contactForm');
if(form)form.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(form);const subject=encodeURIComponent('PRDXQ Projektanfrage von '+d.get('name'));const body=encodeURIComponent('Name: '+d.get('name')+'\nKontakt: '+d.get('contact')+'\n\nProjekt:\n'+d.get('message'));location.href='mailto:ilias.asdufan@icloud.de?subject='+subject+'&body='+body});
if(window.matchMedia('(pointer:fine)').matches&&!reduced){const c=document.querySelector('.cursor');if(c){let x=innerWidth/2,y=innerHeight/2,cx=x,cy=y;window.addEventListener('pointermove',e=>{x=e.clientX;y=e.clientY});const loop=()=>{cx+=(x-cx)*.16;cy+=(y-cy)*.16;c.style.left=cx+'px';c.style.top=cy+'px';requestAnimationFrame(loop)};loop()}}
const menu=document.querySelector('.menu-toggle');const mobileMenu=document.querySelector('.mobile-menu');if(menu&&mobileMenu){menu.addEventListener('click',()=>{const open=mobileMenu.classList.toggle('open');menu.setAttribute('aria-expanded',open);document.body.style.overflow=open?'hidden':''});mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobileMenu.classList.remove('open');menu.setAttribute('aria-expanded','false');document.body.style.overflow=''}));}