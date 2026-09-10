const progress=document.querySelector('.progress span');
const reveals=document.querySelectorAll('.reveal');
const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}})},{threshold:.1});
reveals.forEach(el=>observer.observe(el));

const updateScroll=()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=`${max>0?(scrollY/max)*100:0}%`};
window.addEventListener('scroll',updateScroll,{passive:true});updateScroll();

// Service cards react to touch/click.
document.querySelectorAll('.card').forEach(card=>{
  card.addEventListener('click',()=>{
    document.querySelectorAll('.card.active').forEach(c=>{if(c!==card)c.classList.remove('active')});
    card.classList.toggle('active');
  });
});

// PRDXQ Lab module switcher.
const moduleName=document.getElementById('moduleName');
const moduleDesc=document.getElementById('moduleDesc');
document.querySelectorAll('.module').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('.module').forEach(b=>b.classList.remove('active'));
  button.classList.add('active');
  moduleName.textContent=button.dataset.module;
  moduleDesc.textContent=button.dataset.desc;
  moduleName.animate([{opacity:.15,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:350,easing:'cubic-bezier(.2,.8,.2,1)'});
}));

// Desktop-only magnetic controls, cursor and 3D card tilt.
if(window.matchMedia('(pointer:fine)').matches){
  const cursor=document.querySelector('.cursor');
  let mx=innerWidth/2,my=innerHeight/2,cx=mx,cy=my;
  window.addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY});
  const cursorLoop=()=>{cx+=(mx-cx)*.18;cy+=(my-cy)*.18;if(cursor)cursor.style.transform=`translate(${cx}px,${cy}px) translate(-50%,-50%)`;requestAnimationFrame(cursorLoop)};
  cursorLoop();

  document.querySelectorAll('a,button,.card,.module').forEach(el=>{
    el.addEventListener('mouseenter',()=>document.body.classList.add('hovering'));
    el.addEventListener('mouseleave',()=>document.body.classList.remove('hovering'));
  });

  document.querySelectorAll('.magnetic').forEach(el=>{
    el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();const x=(e.clientX-r.left-r.width/2)*.16;const y=(e.clientY-r.top-r.height/2)*.16;el.style.transform=`translate(${x}px,${y}px)`});
    el.addEventListener('pointerleave',()=>el.style.transform='');
  });

  document.querySelectorAll('.card').forEach(card=>{
    card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(900px) rotateX(${y*-3}deg) rotateY(${x*3}deg) translateY(-4px)`});
    card.addEventListener('pointerleave',()=>card.style.transform='');
  });
}

const form=document.getElementById('contactForm');
form.addEventListener('submit',e=>{e.preventDefault();const data=new FormData(form);const subject=encodeURIComponent(`PRDXQ Projektanfrage von ${data.get('name')}`);const body=encodeURIComponent(`Name: ${data.get('name')}\nKontakt: ${data.get('contact')}\n\nProjekt:\n${data.get('message')}`);window.location.href=`mailto:ilias.asdufan@icloud.de?subject=${subject}&body=${body}`});
