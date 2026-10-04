const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}
  });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

/* LAB SKILL SWITCHER */
const skillData={
 build:{code:'01',title:'FULL-STACK',desc:'Von der Oberfläche bis zur Datenbank.',status:'BUILD',tags:['FRONTEND','BACKEND','API','DATABASE']},
 apps:{code:'02',title:'APPS & SOFTWARE',desc:'Tools und Anwendungen, die wirklich etwas erledigen.',status:'APPS',tags:['DESKTOP','MOBILE','ELECTRON','TOOLS']},
 systems:{code:'03',title:'SYSTEME & AUTOMATION',desc:'Daten, Schnittstellen und Prozesse miteinander verbinden.',status:'AUTOMATE',tags:['DATABASE','WORKFLOW','API','INTEGRATION']},
 design:{code:'04',title:'UI / UX & GRAFIK',desc:'Interfaces und Visuals, die Funktion und Charakter verbinden.',status:'DESIGN',tags:['UI','UX','BRANDING','VISUALS']},
 media:{code:'05',title:'FOTO · VIDEO · SOCIAL',desc:'Aufnehmen, bearbeiten und Content für echte Kanäle bauen.',status:'CREATE',tags:['PHOTO','VIDEO','EDITING','SOCIAL']},
 it:{code:'06',title:'IT & ADMIN',desc:'Hosting, Infrastruktur und technische Systeme sauber aufsetzen.',status:'SYSTEM',tags:['HOSTING','SETUP','ADMIN','SECURITY']}
};
const skillItems=document.querySelectorAll('.skill-item');
const stage=document.querySelector('.skill-stage');
if(stage&&skillItems.length){
  const code=document.getElementById('skillCode');
  const title=document.getElementById('skillTitle');
  const desc=document.getElementById('skillDesc');
  const status=document.getElementById('skillStatus');
  const tags=document.getElementById('skillTags');
  const setSkill=(key)=>{
    const s=skillData[key]||skillData.build;
    stage.dataset.stage=key;
    code.textContent=s.code;title.textContent=s.title;desc.textContent=s.desc;status.textContent=s.status;
    tags.innerHTML=s.tags.map(t=>'<span>'+t+'</span>').join('');
    if(!reduced) stage.animate([{opacity:.45,transform:'scale(.985)'},{opacity:1,transform:'scale(1)'}],{duration:350,easing:'ease-out'});
  };
  skillItems.forEach(item=>item.addEventListener('click',()=>{
    skillItems.forEach(x=>x.classList.remove('active'));
    item.classList.add('active');
    setSkill(item.dataset.skill);
  }));
}

/* CUSTOM CURSOR */
if(window.matchMedia('(pointer:fine)').matches&&!reduced){
  const cursor=document.querySelector('.cursor');
  if(cursor){
    let x=innerWidth/2,y=innerHeight/2,cx=x,cy=y;
    window.addEventListener('pointermove',e=>{x=e.clientX;y=e.clientY});
    const loop=()=>{cx+=(x-cx)*.16;cy+=(y-cy)*.16;cursor.style.left=cx+'px';cursor.style.top=cy+'px';requestAnimationFrame(loop)};loop();
    document.querySelectorAll('a,button').forEach(el=>{
      el.addEventListener('mouseenter',()=>{cursor.style.width='28px';cursor.style.height='28px'});
      el.addEventListener('mouseleave',()=>{cursor.style.width='9px';cursor.style.height='9px'});
    });
  }
}

/* CONTACT */
const form=document.getElementById('contactForm');
if(form)form.addEventListener('submit',e=>{
  e.preventDefault();
  const d=new FormData(form);
  const subject=encodeURIComponent('PRDXQ Projektanfrage von '+d.get('name'));
  const body=encodeURIComponent('Name: '+d.get('name')+'\nKontakt: '+d.get('contact')+'\n\nProjekt:\n'+d.get('message'));
  location.href='mailto:ilias.asdufan@icloud.de?subject='+subject+'&body='+body;
});
