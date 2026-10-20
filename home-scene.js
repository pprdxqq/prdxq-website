(() => {
  const story = document.querySelector('.home-story');
  const canvas = document.querySelector('#prdxqScene');
  if (!story || !canvas || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const gl = canvas.getContext('webgl2', { alpha: true, antialias: true, powerPreference: 'low-power' });
  if (!gl) return;
  const vertexSource = '#version 300 es\nin vec2 position;\nvoid main(){gl_Position=vec4(position,0.0,1.0);}';
  const fragmentSource = [
    '#version 300 es',
    'precision highp float;',
    'uniform vec2 u_resolution;',
    'uniform float u_progress;',
    'out vec4 fragColor;',
    'mat2 rotate2(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);}',
    'float roundBox(vec3 p,vec3 b,float r){vec3 q=abs(p)-b;return length(max(q,0.0))+min(max(q.x,max(q.y,q.z)),0.0)-r;}',
    'float sphere(vec3 p,float r){return length(p)-r;}',
    'float torus(vec3 p,vec2 t){return length(vec2(length(p.xz)-t.x,p.y))-t.y;}',
    'vec2 scene(vec3 p){',
    'float travel=u_progress*6.28318;',
    'vec3 boxPoint=p;boxPoint.xz=rotate2(-0.35+travel*0.34)*boxPoint.xz;boxPoint.xy=rotate2(0.25+travel*0.17)*boxPoint.xy;',
    'float d=roundBox(boxPoint,vec3(0.57,0.54,0.5),0.095);float material=0.0;',
    'vec3 ringPoint=p;ringPoint.xy=rotate2(0.78+travel*0.22)*ringPoint.xy;ringPoint.xz=rotate2(0.2-travel*0.16)*ringPoint.xz;',
    'float ring=torus(ringPoint,vec2(1.03,0.012));if(ring<d){d=ring;material=3.0;}',
    'vec3 a=p-vec3(cos(travel+0.5)*1.25,sin(travel+0.5)*0.38,-0.08);float orbA=sphere(a,0.22);if(orbA<d){d=orbA;material=1.0;}',
    'vec3 b=p-vec3(cos(travel+3.5)*1.28,sin(travel+3.5)*0.42,0.12);float orbB=sphere(b,0.16);if(orbB<d){d=orbB;material=2.0;}',
    'vec3 c=p-vec3(0.08+sin(travel*0.5)*0.12,-0.02,1.05);float orbC=sphere(c,0.105);if(orbC<d){d=orbC;material=1.0;}',
    'return vec2(d,material);}',
    'vec3 normalAt(vec3 p){vec2 e=vec2(0.0015,0.0);return normalize(vec3(scene(p+e.xyy).x-scene(p-e.xyy).x,scene(p+e.yxy).x-scene(p-e.yxy).x,scene(p+e.yyx).x-scene(p-e.yyx).x));}',
    'float raymarch(vec3 ro,vec3 rd,out float material){float t=0.0;material=0.0;for(int i=0;i<76;i++){vec3 pos=ro+rd*t;vec2 h=scene(pos);if(h.x<0.0015){material=h.y;return t;}t+=h.x*0.82;if(t>10.0)break;}return -1.0;}',
    'void main(){',
    'vec2 uv=(gl_FragCoord.xy*2.0-u_resolution)/u_resolution.y;float p=clamp(u_progress,0.0,1.0);',
    'vec3 bg=mix(vec3(0.035,0.051,0.041),vec3(0.06,0.084,0.062),smoothstep(0.0,1.0,p));',
    'float halo=exp(-dot(uv-vec2(0.12,-0.02),uv-vec2(0.12,-0.02))*2.6);bg+=vec3(0.16,0.22,0.1)*halo*0.43;',
    'vec3 ro=vec3(0.0,0.0,4.2);vec3 rd=normalize(vec3(uv,-1.75));float material;float dist=raymarch(ro,rd,material);vec3 color=bg;',
    'if(dist>0.0){vec3 pos=ro+rd*dist;vec3 n=normalAt(pos);vec3 light=normalize(vec3(-0.55,0.83,0.72));vec3 view=normalize(ro-pos);vec3 halfway=normalize(light+view);',
    'float diffuse=max(dot(n,light),0.0);float spec=pow(max(dot(n,halfway),0.0),58.0);float rim=pow(1.0-max(dot(n,view),0.0),3.0);',
    'vec3 base=material<0.5?vec3(0.24,0.32,0.26):material<1.5?vec3(0.68,0.76,0.67):material<2.5?vec3(0.69,0.91,0.18):vec3(0.47,0.61,0.43);',
    'color=base*(0.2+diffuse*0.78)+vec3(0.7,0.84,0.54)*spec*0.8+vec3(0.39,0.55,0.23)*rim*0.65;float fog=smoothstep(3.0,8.5,dist);color=mix(color,bg,fog*0.58);}',
    'float vignette=1.0-smoothstep(0.48,1.28,length(uv)*0.8);color*=0.76+vignette*0.34;fragColor=vec4(color,1.0);}'
  ].join('\n');
  const compile = (type, source) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };
  const vertex = compile(gl.VERTEX_SHADER, vertexSource);
  const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertex || !fragment) return;
  const program = gl.createProgram();
  if (!program) return;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const resolution = gl.getUniformLocation(program, 'u_resolution');
  const progress = gl.getUniformLocation(program, 'u_progress');
  const panels = [...story.querySelectorAll('[data-scene-step]')];
  const labels = [['01 / KLARHEIT','IDEE → PRODUKT'],['02 / SYSTEM','GESTALTUNG · ENTWICKLUNG · SYSTEME'],['03 / START','BEREIT FÜR DEN NÄCHSTEN SCHRITT']];
  let frame = 0;
  let visible = false;
  let hasDrawn = false;
  let scrollProgress = 0;
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const ratio = Math.min(window.devicePixelRatio || 1, matchMedia('(max-width:800px)').matches ? 1.15 : 1.4);
    const width = Math.round(rect.width * ratio);
    const height = Math.round(rect.height * ratio);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
  };
  const draw = () => {
    frame = 0;
    if (!visible || !story.isConnected || gl.isContextLost()) return;
    resize();
    gl.uniform2f(resolution, canvas.width, canvas.height);
    gl.uniform1f(progress, scrollProgress);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    if (!hasDrawn) {
      hasDrawn = true;
      story.classList.add('scene-ready');
    }
  };
  const schedule = () => {
    if (!frame && visible) frame = requestAnimationFrame(draw);
  };
  const update = () => {
    const rect = story.getBoundingClientRect();
    scrollProgress = Math.max(0, Math.min(1, (innerHeight * 0.53 - rect.top) / Math.max(1, story.offsetHeight)));
    let active = 0;
    panels.forEach((panel, index) => {
      if (panel.getBoundingClientRect().top < innerHeight * 0.53) active = index;
    });
    const copy = labels[active] || labels[0];
    const step = document.querySelector('#sceneStep');
    const word = document.querySelector('#sceneWord');
    if (step) step.textContent = copy[0];
    if (word) word.textContent = copy[1];
    schedule();
  };
  const observer = new IntersectionObserver((entries) => {
    visible = entries.some((entry) => entry.isIntersecting);
    if (visible) update();
  }, { rootMargin: '80px' });
  observer.observe(story);
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  if ('ResizeObserver' in window) new ResizeObserver(update).observe(canvas);
  update();
})();
