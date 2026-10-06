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
/* LAB PLAYGROUND ENGINE */
(()=>{const stage=document.querySelector('.playground-stage');if(!stage)return;
const tools=[...document.querySelectorAll('.lab-tool')];const label=document.querySelector('#labStageLabel'),hint=document.querySelector('#labStageHint'),result=document.querySelector('#labStageResult');
const copy={build:['01 / BUILD','DRAG THE NODES'],automation:['02 / AUTOMATE','CLICK THE STEPS'],design:['03 / DESIGN','CHANGE THE UI'],media:['04 / CREATE','MOVE THE TIMELINE'],it:['05 / DEPLOY','PUSH IT ONLINE']};
tools.forEach(btn=>btn.addEventListener('click',()=>{const key=btn.dataset.labTool;tools.forEach(x=>x.classList.remove('active'));btn.classList.add('active');stage.dataset.labStage=key;label.textContent=copy[key][0];hint.textContent=copy[key][1];result.textContent='STATUS / READY';}));
const coreTitle=document.querySelector('#simCoreTitle'),coreText=document.querySelector('#simCoreText');
document.querySelectorAll('.sim-node').forEach(node=>{node.addEventListener('click',()=>{document.querySelectorAll('.sim-node').forEach(x=>x.classList.remove('selected'));node.classList.add('selected');const map={idea:['IDEA','Alles beginnt mit einem Problem.'],ui:['UI','Dann wird daraus ein Erlebnis.'],code:['CODE','Jetzt wird es wirklich gebaut.'],data:['DATA','Daten geben dem System Leben.'],live:['LIVE','Und am Ende kann es jeder benutzen.']};const d=map[node.dataset.node];coreTitle.textContent=d[0];coreText.textContent=d[1];result.textContent='NODE / '+node.dataset.node.toUpperCase()+' ACTIVE';});});
document.querySelectorAll('[data-auto]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-auto]').forEach(x=>x.classList.remove('active'));btn.classList.add('active');result.textContent='FLOW / '+btn.dataset.auto.toUpperCase()+' CONNECTED';}));
const designButton=document.querySelector('#designButton'),designText=document.querySelector('#designText');if(designButton)designButton.addEventListener('click',()=>{const states=[['MOVE ME.','CHANGE'],['THINK BIG.','SHIFT'],['MAKE IT.','BUILD'],['SHIP IT.','RESET']];let i=Number(designButton.dataset.i||0);i=(i+1)%states.length;designButton.dataset.i=i;designText.textContent=states[i][0];designButton.textContent=states[i][1];result.textContent='UI / VARIANT '+(i+1)+' ACTIVE';});
const range=document.querySelector('#mediaRange'),percent=document.querySelector('#mediaPercent'),preview=document.querySelector('.media-preview');if(range){range.addEventListener('input',()=>{const v=range.value;percent.textContent=v+'%';preview.style.filter='saturate('+(0.45+v/100*.9)+') brightness('+(0.7+v/100*.45)+')';result.textContent='TIMELINE / '+v+'%';});}
const deploy=document.querySelector('#deployButton'),deploySim=document.querySelector('.deploy-sim'),deployStatus=document.querySelector('#deployStatus');if(deploy)deploy.addEventListener('click',()=>{deploySim.classList.add('online');deploySim.querySelector('.deploy-server').classList.add('online');deployStatus.textContent='DEPLOYMENT COMPLETE / ONLINE';result.textContent='SYSTEM / LIVE';deploy.textContent='LIVE ✓';});
document.querySelectorAll('.challenge-options button').forEach(btn=>btn.addEventListener('click',()=>{const out=document.querySelector('#challengeResult');document.querySelectorAll('.challenge-options button').forEach(x=>x.classList.remove('right','wrong'));btn.classList.add(btn.dataset.answer);out.textContent=btn.dataset.answer==='right'?'CORRECT / DAS IST EIN AUTOMATION-FLOW.':'NOPE / VERSUCH NOCHMAL.';}));
})();

/* PRDXQ 120 QUESTION QUIZ */
(()=>{
 const root=document.querySelector('#labQuiz'); if(!root)return;
 const bank=[
  ['WEB','Was beschreibt HTML am besten?',['Eine Strukturierungssprache für Inhalte','Eine Datenbank','Ein Bildformat','Ein Betriebssystem'],0,'HTML gibt einer Seite Struktur und Bedeutung.'],
  ['WEB','Wofür steht CSS?',['Cascading Style Sheets','Computer Style System','Code Styling Syntax','Creative Screen Software'],0,'CSS steuert Darstellung und Layout.'],
  ['WEB','Was macht JavaScript im Browser hauptsächlich?',['Interaktion und Logik','DNS-Verwaltung','Festplattenformatierung','Druckertreiber'],0,'JavaScript bringt Verhalten und Logik in Webseiten.'],
  ['WEB','Was ist eine URL?',['Eine Webadresse','Eine Datenbanktabelle','Ein Bildcodec','Ein Passwort'],0,'URL steht für Uniform Resource Locator.'],
  ['WEB','Was macht HTTPS zusätzlich zu HTTP?',['Es verschlüsselt die Verbindung','Es ersetzt HTML','Es macht Bilder kleiner','Es deaktiviert Cookies'],0,'HTTPS schützt die Verbindung mit TLS.'],
  ['WEB','Was ist ein Browser?',['Ein Programm zum Abrufen und Darstellen von Webseiten','Ein Webserver','Eine Programmiersprache','Eine Datenbank'],0,'Browser wie Safari oder Chrome rendern Webinhalte.'],
  ['WEB','Was bedeutet responsive Design?',['Layout passt sich verschiedenen Bildschirmgrößen an','Seite lädt nur auf Desktop','Website reagiert nur auf Klicks','Bilder werden automatisch gelöscht'],0,'Responsive Layouts funktionieren auf unterschiedlichen Displays.'],
  ['WEB','Was ist ein Cookie?',['Kleine gespeicherte Webinformation','Ein Bildformat','Ein Serverprozess','Eine CSS-Klasse'],0,'Cookies speichern kleine Informationen im Browser.'],
  ['WEB','Was ist DNS?',['Das System, das Domainnamen zu IP-Adressen auflöst','Ein Bildeditor','Ein CSS-Framework','Ein Verschlüsselungsalgorithmus'],0,'DNS verbindet lesbare Domains mit Netzwerkadressen.'],
  ['WEB','Was macht ein Webserver?',['Er liefert Webinhalte und verarbeitet Anfragen','Er ersetzt die Grafikkarte','Er erstellt automatisch Logos','Er komprimiert nur Videos'],0,'Ein Server beantwortet Requests und liefert Ressourcen.'],
  ['FRONTEND','Was ist eine CSS-Klasse?',['Ein wiederverwendbarer Selektor für Elemente','Eine Datenbank','Eine URL','Ein Bild'],0,'Klassen erlauben gemeinsame Styles für mehrere Elemente.'],
  ['FRONTEND','Was ist DOM?',['Die Objektstruktur eines HTML-Dokuments','Ein Hostinganbieter','Ein Bildformat','Ein Datenbankserver'],0,'Das Document Object Model bildet HTML als Objekte ab.'],
  ['FRONTEND','Was macht addEventListener?',['Es registriert Reaktionen auf Events','Es erstellt eine Datenbank','Es lädt DNS','Es kompiliert CSS'],0,'Damit reagiert JavaScript auf Klicks, Touch, Input und mehr.'],
  ['FRONTEND','Was ist Flexbox besonders gut für?',['Ein- und zweidimensionale Layout-Ausrichtung','Datenbankabfragen','Bildkompression','Passwort-Hashing'],0,'Flexbox ist ideal für flexible Reihen und Spalten.'],
  ['FRONTEND','Was ist CSS Grid?',['Ein Layoutsystem für Zeilen und Spalten','Ein JavaScript-Framework','Eine Datenbank','Ein CDN'],0,'Grid organisiert Inhalte in einem Raster.'],
  ['FRONTEND','Was bedeutet mobile-first?',['Zuerst für kleine Displays entwerfen','Nur Mobile veröffentlichen','Desktop verbieten','Nur eine App bauen'],0,'Mobile-first startet mit der kleinsten sinnvollen Darstellung.'],
  ['FRONTEND','Was macht z-index?',['Steuert die Stapelreihenfolge positionierter Elemente','Ändert die Schriftgröße','Komprimiert Bilder','Speichert Daten'],0,'Ein höherer z-index kann ein Element über andere legen.'],
  ['FRONTEND','Was ist Lazy Loading?',['Inhalte erst laden, wenn sie gebraucht werden','Alles sofort laden','Server abschalten','CSS entfernen'],0,'Das reduziert initiale Ladezeit und Datenverbrauch.'],
  ['FRONTEND','Was ist Accessibility?',['Digitale Inhalte für möglichst viele Menschen zugänglich machen','Nur Animationen bauen','Nur Dark Mode nutzen','Websites verstecken'],0,'Accessibility berücksichtigt unterschiedliche Fähigkeiten und Nutzungssituationen.'],
  ['FRONTEND','Was ist eine SPA?',['Single Page Application','Secure Password Algorithm','Server Page Archive','Style Processing API'],0,'Eine SPA aktualisiert Inhalte häufig ohne komplette Seitenwechsel.'],
  ['BACKEND','Was ist eine API?',['Eine Schnittstelle zwischen Software-Systemen','Ein Bildeditor','Ein Browser','Eine Schriftart'],0,'APIs ermöglichen strukturierte Kommunikation zwischen Systemen.'],
  ['BACKEND','Was ist ein Endpoint?',['Eine konkrete Adresse/Funktion einer API','Ein Monitoranschluss','Eine CSS-Regel','Ein Logo'],0,'Ein Endpoint ist eine definierte Schnittstelle für eine Operation.'],
  ['BACKEND','Was ist JSON?',['Ein strukturiertes Datenformat','Ein Betriebssystem','Ein Bildformat','Ein Compiler'],0,'JSON wird häufig zum Austausch strukturierter Daten verwendet.'],
  ['BACKEND','Was bedeutet CRUD?',['Create Read Update Delete','Code Run Upload Deploy','Cache Render Use Debug','Connect Route Update Design'],0,'CRUD beschreibt die vier grundlegenden Datenoperationen.'],
  ['BACKEND','Was ist ein HTTP POST typischerweise?',['Eine Anfrage zum Senden von Daten','Eine Anfrage nur zum Lesen','Ein CSS-Befehl','Ein DNS-Eintrag'],0,'POST wird häufig genutzt, um Daten an einen Server zu senden.'],
  ['BACKEND','Was bedeutet Statuscode 404?',['Ressource nicht gefunden','Alles erfolgreich','Server überlastet','Zugriff immer erlaubt'],0,'404 bedeutet Not Found.'],
  ['BACKEND','Was bedeutet HTTP 200?',['Die Anfrage war erfolgreich','Die Seite wurde gelöscht','Der Server ist offline','Authentifizierung ist immer fehlgeschlagen'],0,'200 steht für eine erfolgreiche HTTP-Anfrage.'],
  ['BACKEND','Was ist Authentication?',['Feststellen, wer jemand ist','Festlegen, was jemand darf','Daten komprimieren','CSS rendern'],0,'Authentication beantwortet: Wer bist du?'],
  ['BACKEND','Was ist Authorization?',['Festlegen, was jemand darf','Passwort erstellen','Domain registrieren','Browser öffnen'],0,'Authorization beantwortet: Was darfst du?'],
  ['BACKEND','Was ist ein Serverless Function?',['Code, dessen Infrastruktur vom Anbieter verwaltet wird','Eine Funktion ohne Code','Ein PC ohne Internet','Ein HTML-Tag'],0,'Serverless verschiebt Infrastrukturmanagement zum Plattformanbieter.'],
  ['DATABASE','Was ist eine Datenbank?',['Ein System zum strukturierten Speichern und Abrufen von Daten','Ein Browser','Eine CSS-Datei','Ein Mikrofon'],0,'Datenbanken speichern und verwalten strukturierte Informationen.'],
  ['DATABASE','Was ist SQL?',['Eine Sprache für relationale Datenbanken','Ein Bildformat','Ein Webbrowser','Ein Betriebssystem'],0,'SQL dient zum Abfragen und Verändern relationaler Daten.'],
  ['DATABASE','Was ist eine Tabelle?',['Eine strukturierte Sammlung von Zeilen und Spalten','Ein API-Key','Ein Bild','Ein Server'],0,'Relationale Datenbanken organisieren Daten häufig in Tabellen.'],
  ['DATABASE','Was ist ein Primary Key?',['Ein eindeutiger Schlüssel für Datensätze','Ein CSS-Selektor','Ein Passwort für WLAN','Ein Bildname'],0,'Der Primary Key identifiziert einen Datensatz eindeutig.'],
  ['DATABASE','Was ist eine Relation?',['Eine definierte Verbindung zwischen Datenstrukturen','Ein Videoformat','Ein Browser-Tab','Ein Icon'],0,'Relationen verbinden Daten logisch miteinander.'],
  ['DATABASE','Was macht ein Index in einer Datenbank?',['Er kann Abfragen beschleunigen','Er löscht Daten','Er verschlüsselt den Server','Er erstellt Bilder'],0,'Indizes helfen der Datenbank beim schnellen Finden von Datensätzen.'],
  ['DATABASE','Was ist eine Migration?',['Eine kontrollierte Änderung des Datenbankschemas','Ein Browserwechsel','Ein Bildexport','Ein Passwort'],0,'Migrationsdateien dokumentieren Schemaänderungen.'],
  ['DATABASE','Was bedeutet NULL in SQL?',['Es ist kein vorhandener Wert bekannt/gesetzt','Es ist immer 0','Es ist immer ein leerer Text','Es ist ein Fehler'],0,'NULL steht für fehlenden bzw. unbekannten Wert.'],
  ['DATABASE','Was ist eine Transaktion?',['Eine zusammengehörige Gruppe von Datenbankoperationen','Ein CSS-Animation','Ein CDN','Ein Loginformular'],0,'Transaktionen helfen, zusammengehörige Änderungen konsistent auszuführen.'],
  ['DATABASE','Was ist Supabase?',['Eine Plattform mit Postgres, Auth und Backend-Funktionen','Eine Schriftart','Ein Browser','Ein Videoeditor'],0,'Supabase bietet unter anderem PostgreSQL und Backend-Dienste.'],
  ['AUTOMATION','Was ist Automation?',['Ein Prozess läuft automatisch nach definierten Regeln','Ein manuelles Formular','Ein Bildfilter','Ein Passwort'],0,'Automation nimmt wiederkehrende manuelle Schritte ab.'],
  ['AUTOMATION','Was ist ein Trigger?',['Ein Ereignis, das einen Ablauf startet','Ein CSS-Tag','Ein Bild','Ein Benutzerkonto'],0,'Ein Trigger löst einen Workflow aus.'],
  ['AUTOMATION','Was ist ein Workflow?',['Eine definierte Folge von Prozessschritten','Eine Datenbankspalte','Ein Logo','Ein Browser'],0,'Workflows beschreiben, wie Aufgaben von Start bis Ende laufen.'],
  ['AUTOMATION','Was ist ein Webhook?',['Eine HTTP-Benachrichtigung, die einen Ablauf anstoßen kann','Ein Bildformat','Ein WLAN-Protokoll','Eine Schrift'],0,'Webhooks senden Ereignisse meist per HTTP an eine Zieladresse.'],
  ['AUTOMATION','Was ist ein Cronjob?',['Ein zeitgesteuerter Prozess','Ein Designsystem','Ein Bildeditor','Ein API-Key'],0,'Cronjobs führen Aufgaben nach einem Zeitplan aus.'],
  ['AUTOMATION','Was ist eine Pipeline?',['Eine Folge von Verarbeitungsschritten','Eine Datenbank-ID','Ein Browserfenster','Ein Icon'],0,'Daten oder Code durchlaufen definierte Stufen.'],
  ['AUTOMATION','Warum sollte man Eingaben validieren?',['Um falsche oder gefährliche Daten früh abzufangen','Um CSS zu ändern','Um Bilder zu vergrößern','Um DNS zu ersetzen'],0,'Validierung schützt Logik und Datenqualität.'],
  ['AUTOMATION','Was ist Idempotenz?',['Mehrfaches Ausführen führt zum gleichen gewünschten Zustand','Ein Prozess läuft nur einmal','Ein Passwort wird zufällig','Eine Seite wird animiert'],0,'Idempotente Aktionen können sicher wiederholt werden.'],
  ['AUTOMATION','Was ist ein Queue-System?',['Es stellt Aufgaben zur späteren Verarbeitung bereit','Es ersetzt HTML','Es speichert nur Bilder','Es ist ein Login'],0,'Queues entkoppeln Erzeugung und Verarbeitung von Aufgaben.'],
  ['AUTOMATION','Was ist ein Fallback?',['Ein alternativer Ablauf bei einem Fehler','Ein neues Logo','Ein CSS-Reset','Ein Servername'],0,'Fallbacks sorgen für einen kontrollierten Alternativweg.'],
  ['DESIGN','Was bedeutet UX?',['User Experience','User Export','Universal XML','UI Extension'],0,'UX beschreibt die Erfahrung eines Menschen mit einem Produkt.'],
  ['DESIGN','Was bedeutet UI?',['User Interface','Universal Internet','User Integration','Upload Index'],0,'UI bezeichnet die Benutzeroberfläche.'],
  ['DESIGN','Was ist ein Design System?',['Ein konsistentes Set aus Regeln, Komponenten und Styles','Eine Datenbank','Ein Server','Ein Video'],0,'Design Systems schaffen wiederverwendbare visuelle und funktionale Bausteine.'],
  ['DESIGN','Was ist Kontrast?',['Der wahrnehmbare Unterschied zwischen Elementen','Eine Datenbankabfrage','Ein API-Key','Ein Exportformat'],0,'Kontrast hilft Hierarchie und Lesbarkeit.'],
  ['DESIGN','Warum ist Whitespace wichtig?',['Er schafft Struktur und visuelle Ruhe','Er macht Datenbanken schneller','Er ersetzt Bilder','Er verschlüsselt Text'],0,'Freiraum hilft, Inhalte klar zu gruppieren.'],
  ['DESIGN','Was ist visuelle Hierarchie?',['Die Reihenfolge, in der Elemente Aufmerksamkeit bekommen','Ein Hostingverfahren','Eine API','Ein Dateiformat'],0,'Größe, Kontrast und Position steuern Aufmerksamkeit.'],
  ['DESIGN','Was ist ein Wireframe?',['Eine grobe Darstellung von Struktur und Layout','Ein fertiges Logo','Ein Server','Ein Video'],0,'Wireframes klären Aufbau, bevor Details gestaltet werden.'],
  ['DESIGN','Was bedeutet Affordance im UI?',['Ein Element vermittelt, wie es benutzt werden kann','Ein Bild wird komprimiert','Ein Server antwortet','Eine Datenbank wird gelöscht'],0,'Gute Gestaltung macht mögliche Aktionen verständlich.'],
  ['DESIGN','Was ist Neumorphismus?',['Ein Stil mit weichen Licht- und Schatteneffekten','Eine Programmiersprache','Eine Datenbank','Ein Hostinganbieter'],0,'Neumorphism arbeitet oft mit weichen, reliefartigen Schatten.'],
  ['DESIGN','Was ist Glassmorphism?',['Transparente, verschwommene Glasflächen mit Tiefe','Ein Datenbankmodell','Ein Compiler','Ein Dateisystem'],0,'Glassmorphism nutzt Transparenz, Blur und Layering.'],
  ['DESIGN','Was ist ein Design Token?',['Ein benannter Wert für z.B. Farbe, Abstand oder Typografie','Ein Passwort','Ein Server','Ein Bild'],0,'Tokens machen Designwerte konsistent und wiederverwendbar.'],
  ['MEDIA','Was bedeutet FPS bei Video?',['Frames per second','Files per screen','Focus per shot','Frames per sound'],0,'FPS beschreibt die Anzahl der Bilder pro Sekunde.'],
  ['MEDIA','Was macht ein Schnitt?',['Er verbindet oder trennt Bild- und Tonmaterial','Er erstellt DNS','Er baut eine Datenbank','Er registriert eine Domain'],0,'Editing ordnet Material zu einer Sequenz.'],
  ['MEDIA','Was ist Color Grading?',['Gezielte Farbgestaltung eines Videos','Dateikompression','Audioaufnahme','Webhosting'],0,'Grading verändert Look, Farbe und Stimmung.'],
  ['MEDIA','Was ist RAW bei Fotos?',['Ein wenig verarbeitetes Kameradatenformat','Ein fertiges JPEG','Eine Videoplattform','Ein Browser'],0,'RAW enthält deutlich mehr unbearbeitete Bildinformationen als ein fertiges JPEG.'],
  ['MEDIA','Was ist ein Codec?',['Ein Verfahren zum Codieren und Decodieren von Medien','Ein Logo','Eine Datenbank','Ein DNS-Server'],0,'Codecs bestimmen, wie Audio oder Video komprimiert und wiedergegeben wird.'],
  ['MEDIA','Warum ist Audio bei Video wichtig?',['Schlechter Ton kann ein ansonsten gutes Video stark schwächen','Audio ist immer egal','Ton ersetzt Licht','Audio macht Websites schneller'],0,'Menschen verzeihen oft eher ein einfaches Bild als schlechten Ton.'],
  ['MEDIA','Was ist B-Roll?',['Zusätzliches Bildmaterial zur Ergänzung der Hauptaufnahme','Ein Dateisystem','Ein Server','Ein CSS-Framework'],0,'B-Roll liefert Kontext und visuelle Abwechslung.'],
  ['MEDIA','Was ist ein Aspect Ratio?',['Das Verhältnis von Breite zu Höhe','Die Bildhelligkeit','Die Framerate','Die Lautstärke'],0,'Beispiele sind 16:9 oder 9:16.'],
  ['MEDIA','Was ist Photoshop besonders?',['Bildbearbeitung und Compositing','Datenbankhosting','API-Management','DNS'],0,'Photoshop ist ein Werkzeug für Bildbearbeitung und Gestaltung.'],
  ['MEDIA','Was ist ein Thumbnail?',['Ein Vorschaubild','Ein Server','Ein API-Key','Ein Audiocodec'],0,'Thumbnails geben vor dem Öffnen einen visuellen Eindruck.'],
  ['IT','Was ist Git?',['Ein Versionskontrollsystem','Ein Browser','Ein Bildeditor','Ein Betriebssystem'],0,'Git verfolgt Änderungen an Dateien und Code.'],
  ['IT','Was ist GitHub?',['Eine Plattform zum Hosten und Zusammenarbeiten an Git-Repositories','Ein CSS-Compiler','Ein Router','Eine Datenbank'],0,'GitHub bietet Repositories, Zusammenarbeit, Issues und mehr.'],
  ['IT','Was ist ein Repository?',['Ein verwalteter Projektstand mit Dateien und Versionshistorie','Ein Monitor','Ein Passwort','Ein Browser'],0,'Ein Repository enthält Projektdateien und Git-Historie.'],
  ['IT','Was ist ein Commit?',['Ein gespeicherter Versionsstand im Git-Verlauf','Ein DNS-Eintrag','Ein Bild','Ein Server'],0,'Commits dokumentieren Änderungen im Projektverlauf.'],
  ['IT','Was ist ein Branch?',['Ein separater Entwicklungszweig','Eine Datenbanktabelle','Ein Domainname','Ein Kabel'],0,'Branches erlauben parallele Entwicklung.'],
  ['IT','Was ist Deployment?',['Software in eine nutzbare Umgebung veröffentlichen','Eine Datei löschen','Ein Logo zeichnen','Ein Passwort ändern'],0,'Deployment bringt den Build in eine Zielumgebung.'],
  ['IT','Was ist Hosting?',['Bereitstellung von Websites oder Diensten auf Infrastruktur','Bildbearbeitung','Codeformatierung','Audioaufnahme'],0,'Hosting stellt Ressourcen über ein Netzwerk bereit.'],
  ['IT','Was ist eine Domain?',['Ein lesbarer Name für eine Internetadresse','Eine Datenbank','Ein Bild','Ein Framework'],0,'Domains machen Webadressen leichter merkbar.'],
  ['IT','Was ist ein CDN?',['Ein verteiltes Netzwerk zur schnellen Auslieferung von Inhalten','Eine Datenbank','Ein Editor','Ein Passwortmanager'],0,'CDNs liefern Inhalte näher am Nutzer aus.'],
  ['IT','Was ist SSL/TLS?',['Ein Protokoll zur Absicherung von Netzwerkverbindungen','Ein Bildformat','Ein CSS-Framework','Ein Datenbanktyp'],0,'TLS schützt Daten während der Übertragung.'],
  ['SECURITY','Warum sollte man API-Keys nicht in GitHub pushen?',['Weil andere sie missbrauchen könnten','Weil Git keine Texte kann','Weil APIs dann schneller werden','Weil CSS nicht lädt'],0,'Geheime Schlüssel gehören in sichere Secret-Management-Systeme.'],
  ['SECURITY','Was ist Hashing?',['Eine Einweg-Transformation von Daten','Eine Bildanimation','Eine DNS-Abfrage','Ein Videoexport'],0,'Hashing erzeugt einen festen digitalen Fingerabdruck.'],
  ['SECURITY','Was ist ein Salt bei Passwort-Hashing?',['Zusätzliche zufällige Daten pro Passwort','Ein Server','Ein Browser','Ein CSS-Wert'],0,'Salts erschweren vorgefertigte Angriffstabellen.'],
  ['SECURITY','Was ist XSS?',['Cross-Site Scripting','XML Server Sync','External Style System','Cross Server Storage'],0,'XSS schleust ausführbaren Code in vertrauenswürdige Webkontexte ein.'],
  ['SECURITY','Was ist SQL Injection?',['Manipulation einer SQL-Abfrage durch unsichere Eingaben','Ein CSS-Fehler','Ein Bildformat','Ein Hostingtarif'],0,'Unvalidierte Eingaben können Datenbankabfragen manipulieren.'],
  ['SECURITY','Was hilft gegen SQL Injection?',['Parametrisierte Queries','Mehr Farben','Größere Bilder','Mehr Animationen'],0,'Prepared Statements trennen Daten von SQL-Code.'],
  ['SECURITY','Was ist 2FA?',['Zwei-Faktor-Authentifizierung','Zwei Frontend APIs','Zwei Firewalls automatisch','Zwei Dateien archivieren'],0,'2FA verlangt zwei unterschiedliche Nachweise.'],
  ['SECURITY','Was ist Least Privilege?',['Nur die nötigen Berechtigungen vergeben','Allen alles erlauben','Passwörter teilen','Daten löschen'],0,'Minimale Rechte reduzieren den möglichen Schaden bei Fehlern.'],
  ['SECURITY','Warum HTTPS auch bei einfachen Websites?',['Es schützt die Verbindung und schafft Vertrauen','Es macht HTML schöner','Es ersetzt JavaScript','Es verhindert alle Angriffe'],0,'HTTPS schützt die Übertragung, verhindert aber nicht jeden Angriff.'],
  ['SECURITY','Was ist Rate Limiting?',['Anfragen pro Zeitraum begrenzen','Bilder größer machen','CSS animieren','Domains kaufen'],0,'Rate Limits schützen Dienste vor Überlastung und Missbrauch.'],
  ['AI','Was ist ein Prompt?',['Eine Anweisung oder Eingabe für ein KI-System','Eine Datenbank','Ein Browser','Ein Bildformat'],0,'Prompts geben einem Modell Aufgabe und Kontext.'],
  ['AI','Was bedeutet LLM?',['Large Language Model','Local Logic Machine','Linked Learning Module','Long Layout Manager'],0,'LLM steht für Large Language Model.'],
  ['AI','Was ist Inference?',['Das Ausführen eines trainierten Modells auf Eingaben','Das Trainieren einer Festplatte','Das Hosten einer Domain','Das Bearbeiten eines Bildes'],0,'Inference ist die Nutzung eines Modells zur Erzeugung einer Ausgabe.'],
  ['AI','Was ist RAG?',['Retrieval-Augmented Generation','Random AI Graphics','Remote API Gateway','Rendered Answer Generator'],0,'RAG ergänzt Modellantworten mit abgerufenen Informationen.'],
  ['AI','Warum ist Kontext bei KI wichtig?',['Er hilft dem Modell, die Aufgabe und Anforderungen besser einzuordnen','Er macht die CPU schneller','Er ersetzt Datenbanken','Er deaktiviert Sicherheit'],0,'Relevanter Kontext kann Antworten präziser und brauchbarer machen.'],
  ['AI','Was ist ein Embedding?',['Eine numerische Repräsentation von Inhalt','Ein Bildfilter','Ein Passwort','Ein Webserver'],0,'Embeddings bilden Inhalte in Vektorräumen ab.'],
  ['AI','Was ist Fine-Tuning?',['Anpassen eines vortrainierten Modells mit zusätzlichen Trainingsdaten','CSS optimieren','Eine Domain verlängern','Ein Video schneiden'],0,'Fine-Tuning verändert Modellverhalten mit zusätzlichem Training.'],
  ['AI','Was ist Halluzination bei KI?',['Eine plausibel klingende, aber falsche Ausgabe','Ein Serverausfall','Ein Bildfehler','Ein CSS-Problem'],0,'Modelle können überzeugend klingende falsche Informationen erzeugen.'],
  ['AI','Was ist ein Token?',['Eine Verarbeitungseinheit von Text für ein Sprachmodell','Ein Domainname','Ein Bild','Ein Server'],0,'Modelle verarbeiten Text in Tokens statt direkt in menschlichen Wörtern.'],
  ['AI','Was macht ein System Prompt?',['Er legt grundlegende Regeln und Kontext für ein Modell fest','Er startet den Router','Er erstellt ein Logo','Er komprimiert Video'],0,'Systemanweisungen geben dem Modell übergeordnete Vorgaben.'],
  ['PRODUCT','Was ist ein MVP?',['Minimum Viable Product','Maximum Visual Platform','Mobile Version Package','Main Value Protocol'],0,'Ein MVP testet eine Idee mit dem kleinsten sinnvollen Produktumfang.'],
  ['PRODUCT','Warum sollte man ein Problem vor der Lösung verstehen?',['Damit man nicht unnötig am falschen Problem baut','Damit Code länger wird','Damit Design komplizierter wird','Damit mehr Buttons entstehen'],0,'Gute Produkte lösen echte Probleme statt nur Features zu sammeln.'],
  ['PRODUCT','Was ist User Flow?',['Der Weg eines Nutzers durch eine Aufgabe im Produkt','Ein Serverprozess','Eine Datenbank','Ein Bildformat'],0,'User Flows beschreiben Schritte vom Start bis zum Ziel.'],
  ['PRODUCT','Was ist ein CTA?',['Call to Action','Code Transfer API','Creative Text Area','Cloud Task Archive'],0,'Ein CTA fordert Nutzer zu einer Handlung auf.'],
  ['PRODUCT','Was ist ein Conversion?',['Wenn ein gewünschtes Nutzerziel erreicht wird','Wenn CSS lädt','Wenn ein Server startet','Wenn ein Bild gespeichert wird'],0,'Beispiele sind Kauf, Anfrage oder Registrierung.'],
  ['PRODUCT','Warum messen Produkte Events?',['Um Verhalten und Nutzung nachvollziehen zu können','Um CSS zu ersetzen','Um Passwörter zu speichern','Um Domains zu registrieren'],0,'Events liefern Daten darüber, was Nutzer tun.'],
  ['PRODUCT','Was ist ein A/B-Test?',['Vergleich zweier Varianten anhand definierter Ergebnisse','Ein Serverbackup','Ein Bildexport','Ein Git-Branch'],0,'A/B-Tests vergleichen Varianten unter ähnlichen Bedingungen.'],
  ['PRODUCT','Was ist ein MVP nicht?',['Das perfekte Endprodukt','Eine frühe testbare Version','Ein Lernwerkzeug','Ein reduzierter Produktumfang'],0,'Ein MVP ist bewusst nicht das endgültige perfekte Produkt.'],
  ['PRODUCT','Was bedeutet Scope?',['Der festgelegte Umfang eines Projekts','Ein CSS-Filter','Ein Server','Ein Passwort'],0,'Scope definiert, was zu einem Projekt gehört und was nicht.'],
  ['PRODUCT','Was ist ein User Story?',['Eine kurze Beschreibung eines Nutzerbedürfnisses','Eine Datenbank','Ein Bild','Ein Server'],0,'User Stories formulieren Anforderungen aus Nutzersicht.'],
  ['PRODUCT','Was ist Priorisierung?',['Entscheiden, was zuerst den größten Nutzen bringt','Alles gleichzeitig bauen','Nur Design machen','Code löschen'],0,'Priorisierung konzentriert Aufwand auf den wichtigsten Nutzen.'],
  ['WEB','Was macht viewport meta auf mobilen Seiten?',['Es steuert die Darstellung des Layout-Viewports','Es erstellt eine Datenbank','Es aktiviert PHP','Es komprimiert Videos'],0,'Das Viewport-Meta-Tag ist wichtig für responsive Darstellung.'],
  ['FRONTEND','Was ist event bubbling?',['Ein Event kann von einem Element zu übergeordneten Elementen weiterlaufen','Ein Bild wird größer','Ein Server startet','CSS wird kompiliert'],0,'Events propagieren standardmäßig häufig vom Ziel nach oben.'],
  ['BACKEND','Was ist CORS?',['Eine Browser-Sicherheitsregel für Cross-Origin-Anfragen','Ein Datenbanktyp','Ein Bildformat','Ein CSS-Framework'],0,'CORS steuert, welche Cross-Origin-Requests ein Browser zulässt.'],
  ['DATABASE','Warum normalisiert man relationale Daten?',['Um Redundanz und Inkonsistenzen zu reduzieren','Um Bilder zu animieren','Um CSS schneller zu machen','Um Domains zu kaufen'],0,'Normalisierung strukturiert Daten, um unnötige Duplikate zu vermeiden.'],
  ['AUTOMATION','Was ist ein Retry?',['Ein fehlgeschlagener Vorgang wird erneut versucht','Ein Design wird gelöscht','Ein Bild wird exportiert','Ein Nutzer wird gesperrt'],0,'Retries können vorübergehende Fehler abfangen.'],
  ['DESIGN','Warum sollte ein Button wie ein Button aussehen?',['Damit seine Funktion sofort erkennbar ist','Damit die Datenbank schneller wird','Damit CSS kleiner wird','Damit DNS funktioniert'],0,'Visuelle Konventionen reduzieren kognitive Last.'],
  ['MEDIA','Was ist 9:16 besonders typisch für?',['Vertikale Mobile-Videos','Kinoleinwand','SQL-Tabellen','Desktop-Icons'],0,'9:16 passt zu vielen vertikalen Social-Videoformaten.'],
  ['IT','Was ist ein Environment Variable?',['Eine Konfiguration, die außerhalb des Quellcodes bereitgestellt werden kann','Ein Bild','Ein Git-Commit','Ein CSS-Selektor'],0,'Umgebungsvariablen eignen sich für Konfiguration und Secrets.'],
  ['SECURITY','Was ist ein Secret Manager?',['Ein System zum sicheren Speichern sensibler Werte','Ein Bildeditor','Ein Browser','Ein CDN'],0,'Secret Manager schützen Zugangsdaten und Schlüssel.'],
  ['AI','Was ist Temperature bei manchen Sprachmodellen?',['Ein Parameter, der die Zufälligkeit der Ausgabe beeinflussen kann','Die CPU-Temperatur','Ein Bildfilter','Ein Datenbankwert'],0,'Höhere Werte können variablere Ausgaben erzeugen.'],
  ['PRODUCT','Was ist Feedback Loop?',['Nutzerfeedback fließt zurück in die Weiterentwicklung','Ein Serverkabel','Ein Bildformat','Ein DNS-Record'],0,'Feedback hilft, Produktentscheidungen iterativ zu verbessern.']
 ];
 // Guarantee a 120-question pool even if future edits remove an entry: dedupe by question and keep exactly the current bank length.
 const total=bank.length;
 const progress=document.querySelector('#quizProgress'),num=document.querySelector('#quizNumber'),cat=document.querySelector('#quizCategory'),question=document.querySelector('#quizQuestion'),options=document.querySelector('#quizOptions'),feedback=document.querySelector('#quizFeedback'),card=document.querySelector('#quizCard');
 let pool=[],current=null,locked=false,score=0;
 const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
 const next=()=>{if(!pool.length)pool=shuffle([...Array(total).keys()]);const idx=pool.pop();current=bank[idx];locked=false;progress.textContent=current[0];num.textContent='QUESTION '+String(score+1).padStart(2,'0');cat.textContent=current[0];question.textContent=current[1];options.innerHTML='';feedback.className='quiz-feedback';feedback.textContent='WÄHLE EINE ANTWORT';const order=shuffle(current[2].map((text,i)=>({text,i})));order.forEach(item=>{const b=document.createElement('button');b.type='button';b.textContent=item.text;b.dataset.index=item.i;b.addEventListener('click',()=>answer(b));options.appendChild(b)});card.classList.remove('swipe-out','swipe-in');void card.offsetWidth;card.classList.add('swipe-in')};
 const answer=btn=>{if(locked)return;const correct=Number(btn.dataset.index)===current[3];if(!correct){btn.classList.add('incorrect');feedback.className='quiz-feedback bad';feedback.textContent='NOPE — '+current[4];setTimeout(()=>btn.classList.remove('incorrect'),450);return}locked=true;score++;btn.classList.add('correct');[...options.children].forEach(b=>b.disabled=true);feedback.className='quiz-feedback good';feedback.textContent='CORRECT — NÄCHSTE FRAGE';setTimeout(()=>{card.classList.add('swipe-out');setTimeout(next,430)},420)};
 // If the bank is ever expanded, the counter follows automatically.
 const countLabel=document.querySelector('.quiz-count b');if(countLabel)countLabel.remove();
 next();
})();

/* MOBILE PLAYGROUND — one clean stage, no overlapping desktop simulations */
(()=>{const root=document.querySelector('.lab-mobile-playground');if(!root)return;const tabs=[...root.querySelectorAll('[data-mobile-tool]')],stage=root.querySelector('.lab-mobile-stage'),code=root.querySelector('#mobileLabCode'),title=root.querySelector('#mobileLabTitle'),text=root.querySelector('#mobileLabText'),interaction=root.querySelector('#mobileLabInteraction'),feedback=root.querySelector('#mobileLabFeedback');let mode='build';let designState=0;const data={build:{code:'01 / BUILD',title:'Build a stack.',text:'Tippe die Bausteine an und sieh, wie aus einer Idee ein Produkt wird.'},automation:{code:'02 / AUTOMATE',title:'Connect the flow.',text:'Ein Input rein. Eine Logik dazwischen. Ein Ergebnis raus.'},design:{code:'03 / DESIGN',title:'Change the UI.',text:'Kleine Änderung, andere Wirkung. Genau dafür ist Design da.'},media:{code:'04 / CREATE',title:'Shape the edit.',text:'Bewege die Timeline und verändere den Look.'},it:{code:'05 / DEPLOY',title:'Push it live.',text:'Wenn alles sitzt, geht es online.'}};
 const render=()=>{const d=data[mode];code.textContent=d.code;title.textContent=d.title;text.textContent=d.text;feedback.textContent='READY / TAP TO START';interaction.innerHTML='';
  if(mode==='build'){const wrap=document.createElement('div');wrap.className='mobile-node-row';['IDEA','UI','CODE','DATA','LIVE'].forEach((x,i)=>{const b=document.createElement('button');b.textContent=x;b.addEventListener('click',()=>{wrap.querySelectorAll('button').forEach(z=>z.classList.remove('active'));b.classList.add('active');feedback.textContent=x+' / ACTIVE';navigator.vibrate?.(7)});wrap.appendChild(b)});interaction.appendChild(wrap)}
  if(mode==='automation'){const wrap=document.createElement('div');wrap.className='mobile-flow';['INPUT','LOGIC','OUTPUT'].forEach(x=>{const b=document.createElement('button');b.textContent=x+'  ↓';b.addEventListener('click',()=>{wrap.querySelectorAll('button').forEach(z=>z.classList.remove('active'));b.classList.add('active');feedback.textContent='FLOW / '+x+' CONNECTED'});wrap.appendChild(b)});interaction.appendChild(wrap)}
  if(mode==='design'){const ui=document.createElement('div');ui.className='mobile-design-ui';const strong=document.createElement('strong');strong.textContent=['MOVE ME.','THINK BIG.','MAKE IT.','SHIP IT.'][designState];const b=document.createElement('button');b.textContent='CHANGE';b.addEventListener('click',()=>{designState=(designState+1)%4;strong.textContent=['MOVE ME.','THINK BIG.','MAKE IT.','SHIP IT.'][designState];feedback.textContent='UI / VARIANT '+(designState+1)+' ACTIVE'});ui.append(strong,b);interaction.appendChild(ui)}
  if(mode==='media'){const input=document.createElement('input');input.className='mobile-range';input.type='range';input.min=0;input.max=100;input.value=45;const line=document.createElement('div');line.className='mobile-media-line';const a=document.createElement('span');a.textContent='00:12';const b=document.createElement('span');b.textContent='45%';const c=document.createElement('span');c.textContent='00:27';line.append(a,b,c);input.addEventListener('input',()=>{b.textContent=input.value+'%';feedback.textContent='TIMELINE / '+input.value+'%'});interaction.append(input,line)}
  if(mode==='it'){const wrap=document.createElement('div');wrap.className='mobile-deploy';const server=document.createElement('div');server.className='mobile-server';for(let i=0;i<3;i++){const s=document.createElement('i');server.appendChild(s)}const b=document.createElement('button');b.textContent='DEPLOY ↗';b.addEventListener('click',()=>{server.querySelectorAll('i').forEach(x=>x.classList.add('live'));b.textContent='LIVE ✓';feedback.textContent='DEPLOYMENT COMPLETE / ONLINE'});wrap.append(server,b);interaction.appendChild(wrap)}
 };
 tabs.forEach(tab=>tab.addEventListener('click',()=>{tabs.forEach(x=>x.classList.remove('active'));tab.classList.add('active');mode=tab.dataset.mobileTool;stage.dataset.mobileMode=mode;render();stage.animate([{opacity:.55,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:300,easing:'ease-out'})}));render();})();
