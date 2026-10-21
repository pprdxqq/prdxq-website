(() => {
const root=document.documentElement,key="prdxq-color-mode";let mode="light";
try{const saved=localStorage.getItem(key);if(saved==="dark"||saved==="light")mode=saved}catch(_){}
const apply=next=>{mode=next==="dark"?"dark":"light";root.dataset.theme=mode;root.style.colorScheme=mode;const control=document.querySelector(".prdxq-theme-switch");if(control){control.setAttribute("aria-checked",String(mode==="dark"));control.setAttribute("aria-label",mode==="dark"?"Dark Glass Mode aktiv. Zu Light Mode wechseln":"Light Mode aktiv. Zu Dark Glass Mode wechseln");const label=control.querySelector(".prdxq-theme-label"),icon=control.querySelector(".prdxq-theme-icon");if(label)label.textContent=mode==="dark"?"Dark":"Light";if(icon)icon.textContent=mode==="dark"?"☾":"☼"}try{localStorage.setItem(key,mode)}catch(_){}};
const nav=document.querySelector(".nav-right"),mobileMenu=document.querySelector(".mobile-menu");
if(nav&&!document.querySelector(".prdxq-theme-switch")){
const button=document.createElement("button");button.type="button";button.className="prdxq-theme-switch";button.setAttribute("role","switch");button.innerHTML='<span class="prdxq-theme-icon" aria-hidden="true">☼</span><span class="prdxq-theme-label">Light</span><span class="prdxq-theme-track" aria-hidden="true"><i></i></span>';
const place=()=>{const isMobile=window.matchMedia("(max-width: 700px)").matches,admin=mobileMenu&&mobileMenu.querySelector(".prdxq-admin-link");if(isMobile&&mobileMenu){if(admin)mobileMenu.insertBefore(button,admin);else mobileMenu.appendChild(button);button.classList.add("mobile-menu-theme")}else{button.classList.remove("mobile-menu-theme");const cta=nav.querySelector(".nav-cta");if(cta)nav.insertBefore(button,cta);else nav.insertBefore(button,nav.firstChild)}};
place();window.addEventListener("resize",place,{passive:true});
let downX=0,downY=0,dragged=false,pointerId=null;
button.addEventListener("pointerdown",e=>{if(e.pointerType==="mouse"&&e.button!==0)return;downX=e.clientX;downY=e.clientY;dragged=false;pointerId=e.pointerId;try{button.setPointerCapture(pointerId)}catch(_){}});
button.addEventListener("pointermove",e=>{if(pointerId!==e.pointerId)return;if(Math.abs(e.clientX-downX)>7||Math.abs(e.clientY-downY)>10)dragged=true;if(dragged)apply(e.clientX>=downX?"dark":"light")});
button.addEventListener("pointerup",e=>{if(pointerId!==e.pointerId)return;if(dragged){const r=button.getBoundingClientRect();apply(e.clientX>=r.left+r.width/2?"dark":"light")}pointerId=null});
button.addEventListener("pointercancel",()=>{pointerId=null});
button.addEventListener("click",()=>{if(dragged){dragged=false;return}apply(mode==="dark"?"light":"dark")});
button.addEventListener("keydown",e=>{if(e.key==="ArrowLeft"){e.preventDefault();apply("light")}if(e.key==="ArrowRight"){e.preventDefault();apply("dark")}});
}
apply(mode);
})();