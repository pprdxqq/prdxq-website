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
const skillSelect=document.querySelector('#skillSelect');if(skillSelect){skillSelect.addEventListener('change',()=>{const btn=document.querySelector('.skill-item[data-skill="'+skillSelect.value+'"]');if(btn)btn.click()})}

const dropdownTrigger=document.querySelector('.skill-dropdown-trigger'),dropdownMenu=document.querySelector('.skill-dropdown-menu');if(dropdownTrigger&&dropdownMenu){const closeDropdown=()=>{dropdownMenu.classList.remove('open');dropdownTrigger.setAttribute('aria-expanded','false')};dropdownTrigger.addEventListener('click',e=>{e.stopPropagation();const open=dropdownMenu.classList.toggle('open');dropdownTrigger.setAttribute('aria-expanded',open)});dropdownMenu.querySelectorAll('button[data-value]').forEach(item=>item.addEventListener('click',()=>{const value=item.dataset.value;const source=document.querySelector('.skill-item[data-skill="'+value+'"]');if(source)source.click();const d=data[value];if(d){dropdownTrigger.querySelector('small').textContent=d.code;dropdownTrigger.querySelector('strong').textContent=d.title}dropdownMenu.querySelectorAll('button').forEach(x=>x.classList.remove('selected'));item.classList.add('selected');closeDropdown()}));document.addEventListener('click',e=>{if(!dropdownMenu.contains(e.target)&&!dropdownTrigger.contains(e.target))closeDropdown()});dropdownMenu.querySelector('[data-value="build"]')?.classList.add('selected')}

/* PRDXQ MOTION ENGINE */
(()=>{const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;const fine=window.matchMedia('(pointer:fine)').matches;if(reduce)return;
 const nav=document.querySelector('.nav');let lastY=scrollY;window.addEventListener('scroll',()=>{if(nav)nav.classList.toggle('scrolled',scrollY>40);lastY=scrollY},{passive:true});
 const hero=document.querySelector('.hero-poster');const word=document.querySelector('.hero-word');if(hero&&word){let tx=0,ty=0,cx=0,cy=0;if(fine){hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();tx=(e.clientX-r.left-r.width/2)*.018;ty=(e.clientY-r.top-r.height/2)*.018});hero.addEventListener('pointerleave',()=>{tx=0;ty=0})}const loop=()=>{cx+=(tx-cx)*.08;cy+=(ty-cy)*.08;hero.style.setProperty('--mx',cx+'px');hero.style.setProperty('--my',cy+'px');requestAnimationFrame(loop)};loop()}
 document.querySelectorAll('.cap-card,.experience-cards a,.design-row,.work-row,.workflow-grid article').forEach(card=>{if(!fine)return;card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform='perspective(900px) rotateX('+(-y*2.2)+'deg) rotateY('+(x*2.2)+'deg) translateY(-5px)' });card.addEventListener('pointerleave',()=>card.style.transform='')});
 document.querySelectorAll('.numbers span').forEach(el=>{const target=el.textContent.trim();if(!/^\\d+$/.test(target))return;const obs=new IntersectionObserver(es=>{if(!es[0].isIntersecting)return;obs.disconnect();let n=0,max=Number(target),start=performance.now();const tick=t=>{n=Math.min(max,Math.floor((t-start)/700*max));el.textContent=String(n).padStart(target.length,'0');if(n<max)requestAnimationFrame(tick);else el.textContent=target};requestAnimationFrame(tick)},{threshold:.7});obs.observe(el)});
})();

/* MOBILE EXPERIENCE */
(()=>{const isMobile=matchMedia('(max-width:800px)').matches;if(!isMobile)return;const path=location.pathname.split('/').pop()||'index.html';const map={"index.html":["⌂","HOME"],"work.html":["◫","WORK"],"lab.html":["◉","LAB"],"design.html":["◇","DESIGN"],"about.html":["○","ABOUT"],"contact.html":["↗","START"]};const dock=document.createElement('nav');dock.className='mobile-dock';const order=['index.html','work.html','lab.html','contact.html'];order.forEach(p=>{const a=document.createElement('a');a.href=p;a.className=p===path?'active':'';a.innerHTML='<span>'+map[p][0]+'</span><em>'+map[p][1]+'</em>';dock.appendChild(a)});document.body.appendChild(dock);const progress=document.createElement('div');progress.className='mobile-progress';document.body.appendChild(progress);const update=()=>{const h=document.documentElement.scrollHeight-innerHeight;progress.style.width=(h>0?scrollY/h*100:0)+'%'};addEventListener('scroll',update,{passive:true});update();
 document.querySelectorAll('a').forEach(a=>{const href=a.getAttribute('href');if(!href||href.startsWith('#')||href.startsWith('http')||href.startsWith('mailto:'))return;a.addEventListener('click',e=>{if(a.target==='_blank')return;e.preventDefault();document.body.classList.add('page-exit');setTimeout(()=>location.href=href,180)})});
 document.querySelectorAll('.cap-card,.experience-cards a,.work-row,.design-row,.workflow-grid article').forEach(card=>{card.addEventListener('touchstart',()=>card.classList.add('touching'),{passive:true});card.addEventListener('touchend',()=>setTimeout(()=>card.classList.remove('touching'),220),{passive:true})});
})();

/* MOBILE LAB / INTERACTIVE SKILL ORBIT */
(()=>{const root=document.querySelector('.mobile-skill-experience');if(!root)return;const nodes=[...root.querySelectorAll('.mobile-skill-node')];const code=root.querySelector('#mobileSkillCode'),title=root.querySelector('#mobileSkillTitle'),desc=root.querySelector('#mobileSkillDesc'),tags=root.querySelector('#mobileSkillTags'),count=root.querySelector('#mobileSkillCount');const keys=['build','apps','systems','design','media','it'];let active=0;const apply=(index,fromSwipe=false)=>{active=(index+keys.length)%keys.length;const key=keys[active],d=data[key];nodes.forEach((n,i)=>{n.classList.toggle('active',i===active);n.style.setProperty('--shift',(i-active)*1)});code.textContent=d.code+' / '+d.status;title.textContent=d.title;desc.textContent=d.desc;tags.innerHTML=d.tags.slice(0,3).map(x=>'<i>'+x+'</i>').join('');count.textContent=d.code+' / 06';root.classList.remove('pulse');void root.offsetWidth;root.classList.add('pulse');if(fromSwipe)navigator.vibrate?.(8)};nodes.forEach((n,i)=>n.addEventListener('click',()=>apply(i)));let sx=0,sy=0;root.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;sy=e.touches[0].clientY},{passive:true});root.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))apply(active+(dx<0?1:-1),true)},{passive:true});let timer=setInterval(()=>apply(active+1),4200);root.addEventListener('touchstart',()=>{clearInterval(timer)},{once:true,passive:true});apply(0)})();


/* =========================================================
   PRDXQ MOBILE EXPERIENCE ENGINE 2.0
   ========================================================= */
(()=>{
  if(!matchMedia('(max-width:800px)').matches) return;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];

  /* One reveal system for all major sections */
  const blocks=$$('.identity-section,.statement-block,.capabilities,.numbers,.experience,.final-poster');
  if(reduce) blocks.forEach(x=>x.classList.add('mobile-visible'));
  else{
    const io=new IntersectionObserver(entries=>{
      entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('mobile-visible');io.unobserve(e.target)}});
    },{threshold:.14,rootMargin:'0px 0px -8% 0px'});
    blocks.forEach(x=>io.observe(x));
  }

  /* Hero follows the finger, but never hijacks scrolling */
  const hero=$('.hero-poster');
  if(hero&&!reduce){
    let sx=0,sy=0,active=false;
    hero.addEventListener('touchstart',e=>{
      const t=e.touches[0];sx=t.clientX;sy=t.clientY;active=true;
    },{passive:true});
    hero.addEventListener('touchmove',e=>{
      if(!active)return;
      const t=e.touches[0],dx=(t.clientX-sx)*.045,dy=(t.clientY-sy)*.045;
      hero.style.setProperty('--hero-x',dx.toFixed(2)+'px');
      hero.style.setProperty('--hero-y',dy.toFixed(2)+'px');
      hero.style.setProperty('--hero-x2',(dx*.55).toFixed(2)+'px');
      hero.style.setProperty('--hero-y2',(dy*.55).toFixed(2)+'px');
    },{passive:true});
    hero.addEventListener('touchend',()=>{
      active=false;
      hero.style.setProperty('--hero-x','0px');hero.style.setProperty('--hero-y','0px');
      hero.style.setProperty('--hero-x2','0px');hero.style.setProperty('--hero-y2','0px');
    },{passive:true});
  }

  /* Person section gains focus while visible */
  const person=$('.identity-panel');
  if(person&&!reduce){
    const io=new IntersectionObserver(es=>es.forEach(e=>person.classList.toggle('mobile-focus',e.isIntersecting)),{threshold:.55});
    io.observe(person);
  }

  /* Statement orb responds to horizontal finger movement */
  const statement=$('.statement-block');
  if(statement&&!reduce){
    statement.addEventListener('touchmove',e=>{
      const r=statement.getBoundingClientRect(),t=e.touches[0];
      statement.style.setProperty('--statement-x',((t.clientX-r.left)/r.width*24-12)+'px');
      statement.style.setProperty('--statement-y',((t.clientY-r.top)/r.height*18-9)+'px');
    },{passive:true});
  }

  /* Snap carousels: highlight the card nearest the viewport center */
  const stages=$$('.cap-grid,.experience-cards');
  const mark=stage=>{
    const cards=[...stage.children].filter(x=>x.nodeType===1&&!x.matches(':after'));
    const center=innerWidth/2;
    cards.forEach(card=>{
      const r=card.getBoundingClientRect();
      card.classList.toggle('is-near',Math.abs((r.left+r.right)/2-center)<innerWidth*.18);
    });
  };
  stages.forEach(stage=>{
    stage.addEventListener('scroll',()=>requestAnimationFrame(()=>mark(stage)),{passive:true});
    mark(stage);
  });

  /* Numbers: intentional horizontal paging, no fake counters */
  const numbers=$('.numbers');
  if(numbers&&!reduce){
    let start=0,sy=0;
    numbers.addEventListener('touchstart',e=>{start=e.touches[0].clientX;sy=e.touches[0].clientY},{passive:true});
    numbers.addEventListener('touchend',e=>{
      const dx=e.changedTouches[0].clientX-start;
      if(Math.abs(dx)>35&&Math.abs(dx)>Math.abs(e.changedTouches[0].clientY-sy)){
        const card=numbers.querySelectorAll('div')[dx<0?1:0];
        if(card) card.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'});
      }
    },{passive:true});
  }
})();


/* PRDXQ SIGNATURE INTERACTIONS */
(()=>{
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const signature=[...document.querySelectorAll('.system-identity,.manifesto-section')];
  if(signature.length){
    if(reduce) signature.forEach(x=>x.classList.add('mobile-visible'));
    else{
      const io=new IntersectionObserver(es=>es.forEach(e=>{
        if(e.isIntersecting){e.target.classList.add('mobile-visible');io.unobserve(e.target)}
      }),{threshold:.12});
      signature.forEach(x=>io.observe(x));
    }
  }

  const manifesto=document.querySelector('.manifesto-stack');
  if(manifesto&&!reduce){
    const rows=[...manifesto.children];
    const io=new IntersectionObserver(es=>es.forEach(e=>{
      if(e.isIntersecting)e.target.style.paddingLeft=innerWidth<801?'8px':'28px';
      else e.target.style.paddingLeft='';
    }),{threshold:.7});
    rows.forEach(x=>io.observe(x));
  }

  const system=document.querySelector('.system-identity');
  if(system&&!reduce&&matchMedia('(pointer:fine)').matches){
    system.addEventListener('pointermove',e=>{
      const r=system.getBoundingClientRect();
      system.style.setProperty('--sys-x',((e.clientX-r.left)/r.width*18-9)+'px');
      system.style.setProperty('--sys-y',((e.clientY-r.top)/r.height*18-9)+'px');
    });
  }
})();

/* WORK DETAIL EXPERIENCE */
(()=>{const modal=document.querySelector('.work-modal');if(!modal)return;
const details={
build:{code:'01 / BUILD',status:'FULL-STACK',kicker:'DEVELOPMENT',title:'FULL-STACK',desc:'Du brauchst eine Website, einen Shop, ein Dashboard oder eine komplette Web-App? Ich kümmere mich um die Oberfläche und um das, was dahinter läuft.',outcome:'Ein fertiges digitales Produkt statt nur ein Design.',process:'IDEA → DESIGN → FRONTEND → BACKEND → DATABASE → LIVE',tags:['WEBSITE','WEB-APP','FRONTEND','BACKEND','API','DATABASE']},
apps:{code:'02 / APPS',status:'SOFTWARE',kicker:'SOFTWARE',title:'APPS & SOFTWARE',desc:'Aus einer Idee wird ein echtes Tool: für Desktop, Mobile oder einen ganz bestimmten Arbeitsablauf.',outcome:'Eine Anwendung, die genau für deinen Anwendungsfall gebaut ist.',process:'PROBLEM → CONCEPT → UI → BUILD → TEST → RELEASE',tags:['DESKTOP','MOBILE','TOOLS','SOFTWARE','INTEGRATION']},
systems:{code:'03 / SYSTEMS',status:'AUTOMATE',kicker:'AUTOMATION',title:'SYSTEME & AUTOMATION',desc:'Wenn Informationen ständig von A nach B kopiert werden müssen, kann man das meistens besser lösen. Ich verbinde Datenbanken, APIs und Automationen.',outcome:'Weniger manuelle Arbeit. Mehr Ablauf, der einfach funktioniert.',process:'INPUT → API → DATABASE → LOGIC → AUTOMATION → OUTPUT',tags:['DATABASE','API','WORKFLOW','AUTOMATION','INTEGRATION']},
design:{code:'04 / DESIGN',status:'VISUAL',kicker:'UI / UX & GRAFIK',title:'DESIGN',desc:'Design bedeutet für mich nicht nur, etwas schön aussehen zu lassen. Es muss verständlich sein, funktionieren und zur Marke passen.',outcome:'Interfaces und Visuals, die sich wie ein echtes Produkt anfühlen.',process:'RESEARCH → WIREFRAME → UI → MOTION → POLISH',tags:['UI','UX','BRANDING','GRAPHIC','MOTION']},
media:{code:'05 / CREATE',status:'CONTENT',kicker:'FOTO · VIDEO · SOCIAL',title:'FOTO · VIDEO · SOCIAL',desc:'Von der Aufnahme bis zum fertigen Post: Content wird produziert, geschnitten, bearbeitet und für die jeweilige Plattform vorbereitet.',outcome:'Fertiger Content, der direkt veröffentlicht werden kann.',process:'SHOT → SELECT → EDIT → COLOR → CUT → SOCIAL',tags:['PHOTO','VIDEO','EDITING','PHOTOSHOP','SOCIAL']},
it:{code:'06 / SYSTEM',status:'ONLINE',kicker:'INFRASTRUCTURE',title:'IT & ADMIN',desc:'Hinter jeder Website steckt Infrastruktur. Ich kümmere mich um Domains, Hosting, Deployment und die technischen Verbindungen.',outcome:'Eine technische Basis, auf der dein digitales Produkt zuverlässig läuft.',process:'DOMAIN → HOSTING → DEPLOY → CONFIG → MONITOR → ONLINE',tags:['HOSTING','DOMAIN','GITHUB','DEPLOYMENT','ADMIN']}
};
const $=s=>modal.querySelector(s);
const open=key=>{const d=details[key]||details.build;$('#workModalCode').textContent=d.code;$('#workModalStatus').textContent=d.status;$('#workModalKicker').textContent=d.kicker;$('#workModalTitle').textContent=d.title;$('#workModalDesc').textContent=d.desc;$('#workModalOutcome').textContent=d.outcome;$('#workModalProcess').textContent=d.process;$('#workModalTags').innerHTML=d.tags.map(x=>'<i>'+x+'</i>').join('');const v=$('#workModalVisual');v.dataset.type=key;v.innerHTML='<div class="modal-visual-label">'+d.code.split(' / ')[1]+'</div><div class="modal-visual-core">'+d.title+'</div>';modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'};
const close=()=>{modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow=''};
document.querySelectorAll('.work-card').forEach(card=>card.addEventListener('click',()=>open(card.dataset.work)));
modal.querySelector('.work-modal-close').addEventListener('click',close);modal.querySelector('.work-modal-backdrop').addEventListener('click',close);document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('open'))close()});
})();