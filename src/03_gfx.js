// ===================== GFX: mini motor WebGL (sin dependencias) =====================
const M4={
 persp(f,a,n,fa){const t=1/Math.tan(f/2),nf=1/(n-fa);return new Float32Array([t/a,0,0,0,0,t,0,0,0,0,(fa+n)*nf,-1,0,0,2*fa*n*nf,0])},
 look(e,c,u){let zx=e[0]-c[0],zy=e[1]-c[1],zz=e[2]-c[2];let l=Math.hypot(zx,zy,zz);zx/=l;zy/=l;zz/=l;
  let xx=u[1]*zz-u[2]*zy,xy=u[2]*zx-u[0]*zz,xz=u[0]*zy-u[1]*zx;l=Math.hypot(xx,xy,xz);xx/=l;xy/=l;xz/=l;
  const yx=zy*xz-zz*xy,yy=zz*xx-zx*xz,yz=zx*xy-zy*xx;
  return new Float32Array([xx,yx,zx,0,xy,yy,zy,0,xz,yz,zz,0,-(xx*e[0]+xy*e[1]+xz*e[2]),-(yx*e[0]+yy*e[1]+yz*e[2]),-(zx*e[0]+zy*e[1]+zz*e[2]),1])},
 mul(a,b){const o=new Float32Array(16);for(let i=0;i<4;i++)for(let j=0;j<4;j++){let s=0;for(let k=0;k<4;k++)s+=a[k*4+j]*b[i*4+k];o[i*4+j]=s}return o}
};

class MeshBuilder{
 constructor(){this.v=[];this.i=[];this.n=0}
 vert(x,y,z,u,v,nx,ny,nz,c,e){this.v.push(x,y,z,u,v,nx,ny,nz,c[0],c[1],c[2],e||0);return this.n++}
 // a,b,c,d en orden: abajo-izq, abajo-der, arriba-der, arriba-izq ; uv=[u0,v0,u1,v1]
 quad(a,b,c,d,uv,n,col,em){col=col||[1,1,1];const i=this.vert(a[0],a[1],a[2],uv[0],uv[3],n[0],n[1],n[2],col,em);
  this.vert(b[0],b[1],b[2],uv[2],uv[3],n[0],n[1],n[2],col,em);this.vert(c[0],c[1],c[2],uv[2],uv[1],n[0],n[1],n[2],col,em);this.vert(d[0],d[1],d[2],uv[0],uv[1],n[0],n[1],n[2],col,em);
  this.i.push(i,i+1,i+2,i,i+2,i+3)}
 tri(a,b,c,uvA,uvB,uvC,n,col,em){col=col||[1,1,1];const i=this.vert(a[0],a[1],a[2],uvA[0],uvA[1],n[0],n[1],n[2],col,em);this.vert(b[0],b[1],b[2],uvB[0],uvB[1],n[0],n[1],n[2],col,em);this.vert(c[0],c[1],c[2],uvC[0],uvC[1],n[0],n[1],n[2],col,em);this.i.push(i,i+1,i+2)}
}

const GL={
 gl:null,cv:null,w:1,h:1,prog:{},tex:{},sprAtlas:null,tileTex:[],cam:{yaw:.7,pitch:.86,dist:15,fov:.72,tx:0,ty:0,tz:0},VP:null,eye:[0,0,0],
 env:{amb:[.6,.6,.6],sun:[1,1,1],sunDir:[.3,.8,.3],moon:[0,0,.1],moonDir:[-.3,.8,-.3],fog:[.6,.7,.8],fogN:30,fogF:70,glow:0,flash:0,top:[.3,.5,.9],hor:[.7,.8,.95],stars:0,cloud:0,time:0},
 maxSpr:3000,
 init(cv){
  this.cv=cv;const gl=cv.getContext('webgl',{antialias:false,alpha:false,preserveDrawingBuffer:true})||cv.getContext('experimental-webgl');
  if(!gl)throw new Error('WebGL no disponible');this.gl=gl;gl.getExtension('OES_element_index_uint');
  const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(o)+'\n'+s);return o};
  const pr=(vs,fs,attrs)=>{const p=gl.createProgram();gl.attachShader(p,sh(gl.VERTEX_SHADER,vs));gl.attachShader(p,sh(gl.FRAGMENT_SHADER,fs));attrs.forEach((a,i)=>gl.bindAttribLocation(p,i,a));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p));const u={};const n=gl.getProgramParameter(p,gl.ACTIVE_UNIFORMS);for(let i=0;i<n;i++){const inf=gl.getActiveUniform(p,i);u[inf.name]=gl.getUniformLocation(p,inf.name)}return{p,u}};
  this.prog.main=pr(`attribute vec3 aPos;attribute vec2 aUV;attribute vec3 aNrm;attribute vec3 aCol;attribute float aEm;
uniform mat4 uVP;uniform vec3 uCam;uniform vec3 uAmb,uSunDir,uSunCol,uMoonDir,uMoonCol;uniform float uBB,uFogN,uFogF,uUV;
varying vec2 vUV;varying vec3 vLight,vCol;varying float vFog,vEm;
void main(){gl_Position=uVP*vec4(aPos,1.0);vUV=aUV+vec2(uUV,0.0);vCol=aCol;vEm=aEm;
 float nd=max(dot(aNrm,uSunDir),0.0),nm=max(dot(aNrm,uMoonDir),0.0);
 vec3 lit=uAmb+uSunCol*nd+uMoonCol*nm;
 if(uBB>0.5)lit=uAmb+(uSunCol+uMoonCol)*0.5;
 vLight=lit;float d=length(aPos-uCam);vFog=clamp((d-uFogN)/(uFogF-uFogN),0.0,1.0);}`,
`precision mediump float;uniform sampler2D uTex;uniform vec3 uFogCol;uniform float uGlow,uFlash,uAlpha;
varying vec2 vUV;varying vec3 vLight,vCol;varying float vFog,vEm;
void main(){vec4 t=texture2D(uTex,vUV);if(t.a<0.04)discard;
 vec3 lit=vLight*(1.0-vEm*uGlow)+vec3(1.25,0.98,0.62)*vEm*uGlow;
 vec3 c=t.rgb*vCol*lit+vec3(uFlash);c=mix(c,uFogCol,vFog);gl_FragColor=vec4(c,t.a*uAlpha);}`,['aPos','aUV','aNrm','aCol','aEm']);
  this.prog.sky=pr(`attribute vec2 aP;varying vec2 vP;void main(){vP=aP;gl_Position=vec4(aP,0.9999,1.0);}`,
`precision mediump float;varying vec2 vP;uniform vec3 uR,uU,uF,uTop,uHor,uSunDir,uMoonDir,uSunC;uniform float uTH,uAsp,uStars,uCloud,uFlash;
float hash(vec3 p){p=fract(p*vec3(443.897,441.423,437.195));p+=dot(p,p.yzx+19.19);return fract((p.x+p.y)*p.z);}
void main(){vec3 r=normalize(uF+uR*vP.x*uTH*uAsp+uU*vP.y*uTH);float h=clamp(r.y,0.0,1.0);vec3 c=mix(uHor,uTop,pow(h,0.5));
 float sd=dot(r,uSunDir);c+=uSunC*(pow(max(sd,0.0),48.0)*0.5+smoothstep(0.9993,0.9996,sd)*2.0);
 float md=dot(r,uMoonDir);c=mix(c,vec3(0.92,0.94,1.0),smoothstep(0.9990,0.9994,md)*uStars);
 if(r.y>0.02&&uStars>0.0){vec3 q=floor(r*150.0);float s=hash(q);c+=vec3(step(0.9970,s))*uStars*(0.4+0.6*hash(q+1.0));}
 c=mix(c,vec3(dot(c,vec3(0.33)))*0.85+0.04,uCloud*0.75);c+=vec3(uFlash);gl_FragColor=vec4(c,1.0);}`,['aP']);
  this.prog.part=pr(`attribute vec3 aPos;uniform mat4 uVP;uniform float uSize;void main(){gl_Position=uVP*vec4(aPos,1.0);gl_PointSize=uSize;}`,
`precision mediump float;uniform vec4 uC;void main(){gl_FragColor=uC;}`,['aPos']);
  // buffers
  this.skyBuf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,this.skyBuf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,1,1,-1,-1,1,1,-1,1]),gl.STATIC_DRAW);
  this.sprVB=gl.createBuffer();this.sprIB=gl.createBuffer();
  const ids=new Uint32Array(this.maxSpr*6);for(let s=0;s<this.maxSpr;s++){const o=s*4;ids.set([o,o+1,o+2,o,o+2,o+3],s*6)}
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.sprIB);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,ids,gl.STATIC_DRAW);
  this.sprArr=new Float32Array(this.maxSpr*4*12);this.partBuf=gl.createBuffer();this.partArr=new Float32Array(9000);
  // atlas de sprites
  this.ATL=Math.min(4096,gl.getParameter(gl.MAX_TEXTURE_SIZE));this.sprTex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,this.sprTex);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,this.ATL,this.ATL,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  this.shelf={x:0,y:0,h:0};
  gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
  this.resize();
 },
 resize(){const cv=this.cv,dpr=Math.min(window.devicePixelRatio||1,2);const w=Math.max(2,Math.floor(cv.clientWidth*dpr)),h=Math.max(2,Math.floor(cv.clientHeight*dpr));if(cv.width!==w||cv.height!==h){cv.width=w;cv.height=h}this.w=w;this.h=h;this.gl.viewport(0,0,w,h)},
 // reserva sitio en el atlas y sube el canvas; devuelve {x,y,w,h}
 allocSprite(c){const gl=this.gl,s=this.shelf,w=c.width,h=c.height;
  if(s.x+w>this.ATL){s.x=0;s.y+=s.h+1;s.h=0}
  if(s.y+h>this.ATL)throw new Error('Atlas de sprites lleno');
  const r={x:s.x,y:s.y,w,h};s.x+=w+1;s.h=Math.max(s.h,h);
  gl.bindTexture(gl.TEXTURE_2D,this.sprTex);gl.texSubImage2D(gl.TEXTURE_2D,0,r.x,r.y,gl.RGBA,gl.UNSIGNED_BYTE,c);return r},
 makeTex(c){const gl=this.gl;const t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,c);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);return t},
 // malla estática desde MeshBuilder
 upload(mb){const gl=this.gl;const vb=gl.createBuffer(),ib=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(mb.v),gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint32Array(mb.i),gl.STATIC_DRAW);return{vb,ib,n:mb.i.length}},
 free(m){if(!m)return;this.gl.deleteBuffer(m.vb);this.gl.deleteBuffer(m.ib)},
 camSetup(){const c=this.cam;const cp=Math.cos(c.pitch),sp=Math.sin(c.pitch);
  this.eye=[c.tx+c.dist*cp*Math.sin(c.yaw),c.ty+c.dist*sp,c.tz+c.dist*cp*Math.cos(c.yaw)];
  const asp=this.w/this.h;const P=M4.persp(c.fov,asp,.5,160);const V=M4.look(this.eye,[c.tx,c.ty,c.tz],[0,1,0]);this.VP=M4.mul(P,V);
  let fx=c.tx-this.eye[0],fy=c.ty-this.eye[1],fz=c.tz-this.eye[2];const l=Math.hypot(fx,fy,fz);fx/=l;fy/=l;fz/=l;
  let rx=-fz,rz=fx;const rl=Math.hypot(rx,rz);rx/=rl;rz/=rl; // right = fwd x up
  this.fwd=[fx,fy,fz];this.right=[rx,0,rz];
  this.up=[-(rz*fy),rz*fx-rx*fz,rx*fy];this.asp=asp},
 project(x,y,z){const m=this.VP;const cx=m[0]*x+m[4]*y+m[8]*z+m[12],cy=m[1]*x+m[5]*y+m[9]*z+m[13],cw=m[3]*x+m[7]*y+m[11]*z+m[15];if(cw<=0.01)return null;return{x:(cx/cw*.5+.5)*this.cv.clientWidth,y:(1-(cy/cw*.5+.5))*this.cv.clientHeight,d:cw}},
 ray(px,py){const nx=(px/this.cv.clientWidth)*2-1,ny=1-(py/this.cv.clientHeight)*2;const th=Math.tan(this.cam.fov/2);const f=this.fwd,r=this.right,u=this.up;
  let dx=f[0]+r[0]*nx*th*this.asp+u[0]*ny*th,dy=f[1]+r[1]*nx*th*this.asp+u[1]*ny*th,dz=f[2]+r[2]*nx*th*this.asp+u[2]*ny*th;const l=Math.hypot(dx,dy,dz);return{o:this.eye.slice(),d:[dx/l,dy/l,dz/l]}},
 setAttr(stride,offs){const gl=this.gl;gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,48,0);gl.enableVertexAttribArray(1);gl.vertexAttribPointer(1,2,gl.FLOAT,false,48,12);gl.enableVertexAttribArray(2);gl.vertexAttribPointer(2,3,gl.FLOAT,false,48,20);gl.enableVertexAttribArray(3);gl.vertexAttribPointer(3,3,gl.FLOAT,false,48,32);gl.enableVertexAttribArray(4);gl.vertexAttribPointer(4,1,gl.FLOAT,false,48,44)},
 setMainUniforms(P,bb,alpha,uv){const gl=this.gl,e=this.env,u=P.u;gl.uniformMatrix4fv(u.uVP,false,this.VP);gl.uniform3fv(u.uCam,this.eye);gl.uniform3fv(u.uAmb,e.amb);gl.uniform3fv(u.uSunDir,e.sunDir);gl.uniform3fv(u.uSunCol,e.sun);gl.uniform3fv(u.uMoonDir,e.moonDir);gl.uniform3fv(u.uMoonCol,e.moon);
  gl.uniform1f(u.uBB,bb);gl.uniform1f(u.uFogN,e.fogN);gl.uniform1f(u.uFogF,e.fogF);gl.uniform3fv(u.uFogCol,e.fog);gl.uniform1f(u.uGlow,e.glow);gl.uniform1f(u.uFlash,e.flash);gl.uniform1f(u.uAlpha,alpha);gl.uniform1f(u.uUV,uv||0);gl.uniform1i(u.uTex,0)},
 drawMesh(m){const gl=this.gl;if(!m||!m.n)return;gl.bindBuffer(gl.ARRAY_BUFFER,m.vb);this.setAttr();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,m.ib);gl.drawElements(gl.TRIANGLES,m.n,gl.UNSIGNED_INT,0)},
 // sprites: lista [{x,y,z,w,h,uv:[u0,v0,u1,v1],c:[r,g,b],flip,sh}] ya ordenada si hace falta
 drawSprites(list,shadows){const gl=this.gl;const a=this.sprArr;let n=0;const rx=this.right[0],rz=this.right[2];
  const put=(x,y,z,ax,az,bx,bz,h,uv,c,flip,em)=>{ // base izq/der (a,b) y altura h
   if(n>=this.maxSpr)return;let o=n*48;const u0=flip?uv[2]:uv[0],u1=flip?uv[0]:uv[2];
   const V=(px,py,pz,u,v)=>{a[o]=px;a[o+1]=py;a[o+2]=pz;a[o+3]=u;a[o+4]=v;a[o+5]=0;a[o+6]=1;a[o+7]=0;a[o+8]=c[0];a[o+9]=c[1];a[o+10]=c[2];a[o+11]=em||0;o+=12};
   V(ax,y,az,u0,uv[3]);V(bx,y,bz,u1,uv[3]);V(bx,y+h,bz,u1,uv[1]);V(ax,y+h,az,u0,uv[1]);n++};
  const lean=0.0;
  for(const s of list){const hw=s.w/2;put(s.x,s.y,s.z,s.x-rx*hw,s.z-rz*hw,s.x+rx*hw,s.z+rz*hw,s.h,s.uv,s.c||[1,1,1],s.flip,s.em)}
  if(!n)return;gl.bindBuffer(gl.ARRAY_BUFFER,this.sprVB);gl.bufferData(gl.ARRAY_BUFFER,a.subarray(0,n*48),gl.DYNAMIC_DRAW);this.setAttr();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.sprIB);gl.drawElements(gl.TRIANGLES,n*6,gl.UNSIGNED_INT,0);return n},
 // sombras en el suelo: quads horizontales
 drawFlat(list){const gl=this.gl;const a=this.sprArr;let n=0;
  for(const s of list){if(n>=this.maxSpr)break;let o=n*48;const hw=s.w/2,hd=s.d/2,uv=s.uv,c=s.c||[1,1,1];
   const V=(px,py,pz,u,v)=>{a[o]=px;a[o+1]=py;a[o+2]=pz;a[o+3]=u;a[o+4]=v;a[o+5]=0;a[o+6]=1;a[o+7]=0;a[o+8]=c[0];a[o+9]=c[1];a[o+10]=c[2];a[o+11]=0;o+=12};
   V(s.x-hw,s.y,s.z+hd,uv[0],uv[3]);V(s.x+hw,s.y,s.z+hd,uv[2],uv[3]);V(s.x+hw,s.y,s.z-hd,uv[2],uv[1]);V(s.x-hw,s.y,s.z-hd,uv[0],uv[1]);n++}
  if(!n)return;gl.bindBuffer(gl.ARRAY_BUFFER,this.sprVB);gl.bufferData(gl.ARRAY_BUFFER,a.subarray(0,n*48),gl.DYNAMIC_DRAW);this.setAttr();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.sprIB);gl.drawElements(gl.TRIANGLES,n*6,gl.UNSIGNED_INT,0)},
 drawSky(){const gl=this.gl,P=this.prog.sky,u=P.u,e=this.env,c=this.cam;gl.useProgram(P.p);gl.disable(gl.DEPTH_TEST);
  gl.uniform3fv(u.uR,this.right);gl.uniform3fv(u.uU,this.up);gl.uniform3fv(u.uF,this.fwd);gl.uniform3fv(u.uTop,e.top);gl.uniform3fv(u.uHor,e.hor);gl.uniform3fv(u.uSunDir,e.sunDir);gl.uniform3fv(u.uMoonDir,e.moonDir);gl.uniform3fv(u.uSunC,e.sunDisk||[1,.9,.6]);
  gl.uniform1f(u.uTH,Math.tan(c.fov/2));gl.uniform1f(u.uAsp,this.asp);gl.uniform1f(u.uStars,e.stars);gl.uniform1f(u.uCloud,e.cloud);gl.uniform1f(u.uFlash,e.flash);
  gl.bindBuffer(gl.ARRAY_BUFFER,this.skyBuf);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
  for(let i=1;i<5;i++)gl.disableVertexAttribArray(i);gl.drawArrays(gl.TRIANGLES,0,6);gl.enable(gl.DEPTH_TEST)},
 drawParticles(lines,pts,col,size){const gl=this.gl,P=this.prog.part;gl.useProgram(P.p);gl.uniformMatrix4fv(P.u.uVP,false,this.VP);gl.uniform4fv(P.u.uC,col);gl.uniform1f(P.u.uSize,size||2);
  gl.bindBuffer(gl.ARRAY_BUFFER,this.partBuf);gl.enableVertexAttribArray(0);for(let i=1;i<5;i++)gl.disableVertexAttribArray(i);gl.vertexAttribPointer(0,3,gl.FLOAT,false,0,0);
  gl.depthMask(false);
  if(lines&&lines.length){gl.bufferData(gl.ARRAY_BUFFER,lines,gl.DYNAMIC_DRAW);gl.drawArrays(gl.LINES,0,lines.length/3)}
  if(pts&&pts.length){gl.bufferData(gl.ARRAY_BUFFER,pts,gl.DYNAMIC_DRAW);gl.drawArrays(gl.POINTS,0,pts.length/3)}
  gl.depthMask(true)}
};
