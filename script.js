const progress=document.querySelector('.progress span');
const reveals=document.querySelectorAll('.reveal');
const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('visible')})},{threshold:.12});
reveals.forEach(el=>observer.observe(el));
window.addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=`${max>0?(scrollY/max)*100:0}%`},{passive:true});
const form=document.getElementById('contactForm');
form.addEventListener('submit',e=>{e.preventDefault();const data=new FormData(form);const subject=encodeURIComponent(`PRDXQ Projektanfrage von ${data.get('name')}`);const body=encodeURIComponent(`Name: ${data.get('name')}\nKontakt: ${data.get('contact')}\n\nProjekt:\n${data.get('message')}`);window.location.href=`mailto:ilias.asdufan@icloud.de?subject=${subject}&body=${body}`});
