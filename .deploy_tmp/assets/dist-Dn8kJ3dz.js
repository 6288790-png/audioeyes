import{$ as e,B as t,Ct as n,E as r,Ft as i,Jn as a,Q as o,Qt as s,Tr as c,Tt as l,fr as u,g as d,h as f,kr as p,l as m,mr as h,pt as g,q as _,qn as v,tt as ee,u as y,wr as b,wt as x,z as S,zt as C}from"./three.module-CgISyWQV.js";import{n as w,t as T}from"./Pass-CuYXgMSk.js";import{a as E,c as D,i as O,n as k,o as A,r as j,s as te}from"./pointer-input-D1lPjgVB.js";var ne=`
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform vec2 texelSize;

void main() {
  vUv = position.xy * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,re=`
precision mediump float;
varying highp vec2 vUv;
uniform sampler2D uTexture;
uniform float value;

void main() {
  gl_FragColor = value * texture2D(uTexture, vUv);
}
`,ie=`
varying vec2 vLocalUv;
uniform vec2 uCenter;
uniform vec2 uScale;

void main() {
  vLocalUv = position.xy;
  gl_Position = vec4(position.xy * uScale + uCenter, 0.0, 1.0);
}
`,ae=`
precision highp float;
varying vec2 vLocalUv;
uniform vec3 color;

void main() {
  float r = length(vLocalUv);
  if (r > 1.0) discard;
  float a = 1.0 - r;
  a *= a;
  gl_FragColor = vec4(color * a, a);
}
`,M=`
precision mediump float;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D uVelocity;

void main() {
  float L = texture2D(uVelocity, vL).y;
  float R = texture2D(uVelocity, vR).y;
  float T = texture2D(uVelocity, vT).x;
  float B = texture2D(uVelocity, vB).x;
  float vorticity = R - L - T + B;
  gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
}
`,oe=`
precision highp float;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float curl;
uniform float dt;

void main() {
  float L = texture2D(uCurl, vL).x;
  float R = texture2D(uCurl, vR).x;
  float T = texture2D(uCurl, vT).x;
  float B = texture2D(uCurl, vB).x;
  float C = texture2D(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= curl * C;
  force.y *= -1.0;
  vec2 vel = texture2D(uVelocity, vUv).xy;
  gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
}
`,se=`
precision mediump float;
varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D uVelocity;
uniform float uReflectWalls;

void main() {
  float L = texture2D(uVelocity, vL).x;
  float R = texture2D(uVelocity, vR).x;
  float T = texture2D(uVelocity, vT).y;
  float B = texture2D(uVelocity, vB).y;
  vec2 C = texture2D(uVelocity, vUv).xy;
  // 无流穿透边界（反射）：在边界处镜像速度。
  // 禁用后流体可以离开屏幕，对应 mofu / FluidCursor 的行为。
  if (uReflectWalls > 0.5) {
    if (vL.x < 0.0) { L = -C.x; }
    if (vR.x > 1.0) { R = -C.x; }
    if (vT.y > 1.0) { T = -C.y; }
    if (vB.y < 0.0) { B = -C.y; }
  }
  float div = 0.5 * (R - L + T - B);
  gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
}
`,ce=`
precision mediump float;
varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D uPressure;
uniform sampler2D uDivergence;

void main() {
  float L = texture2D(uPressure, vL).x;
  float R = texture2D(uPressure, vR).x;
  float T = texture2D(uPressure, vT).x;
  float B = texture2D(uPressure, vB).x;
  float divergence = texture2D(uDivergence, vUv).x;
  float pressure = (L + R + B + T - divergence) * 0.25;
  gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
}
`,le=`
precision mediump float;
varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D uPressure;
uniform sampler2D uVelocity;

void main() {
  float L = texture2D(uPressure, vL).x;
  float R = texture2D(uPressure, vR).x;
  float T = texture2D(uPressure, vT).x;
  float B = texture2D(uPressure, vB).x;
  vec2 velocity = texture2D(uVelocity, vUv).xy;
  velocity.xy -= vec2(R - L, T - B);
  gl_FragColor = vec4(velocity, 0.0, 1.0);
}
`,N=`
precision highp float;
varying vec2 vUv;
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 texelSize;
uniform float dt;
uniform float dissipation;
uniform float uBFECC;

void main() {
  if (uBFECC < 0.5) {
    vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
    gl_FragColor = dissipation * texture2D(uSource, coord);
  } else {
    vec2 vel = texture2D(uVelocity, vUv).xy;
    vec2 spotOld = vUv - vel * dt * texelSize;
    vec2 velBack = texture2D(uVelocity, spotOld).xy;
    vec2 spotForward = spotOld + velBack * dt * texelSize;
    vec2 error = spotForward - vUv;
    vec2 spotMid = vUv - error * 0.5;
    vec2 velMid = texture2D(uVelocity, spotMid).xy;
    vec2 coord = spotMid - velMid * dt * texelSize;
    gl_FragColor = dissipation * texture2D(uSource, coord);
  }
  gl_FragColor.a = 1.0;
}
`,P={performance:{simResolution:128,dyeResolution:256,pressureIterations:6},balanced:{simResolution:256,dyeResolution:512,pressureIterations:12},quality:{simResolution:384,dyeResolution:1024,pressureIterations:20}};function F(e,t,n){let r=n?g:i;return new p(e,t,{depthBuffer:!1,stencilBuffer:!1,format:s,type:_,minFilter:r,magFilter:r,wrapS:f,wrapT:f,generateMipmaps:!1})}function I(e,t,n){return{read:F(e,t,n),write:F(e,t,n)}}function L(e){let t=e.read;e.read=e.write,e.write=t}function R(e){e.read.dispose(),e.write.dispose()}var z=class{simResolution;dyeResolution;runtimeConfig;renderer;scene=new v;camera=new C(-1,1,1,-1,0,1);geometry=new y;mesh;splatScene=new v;splatGeometry=new y;splatMesh;velocity;density;dye;pressure;divergence;curl;clearMaterial;splatMaterial;curlMaterial;vorticityMaterial;divergenceMaterial;pressureMaterial;gradientSubtractMaterial;advectVelocityMaterial;advectDensityMaterial;advectDyeMaterial;splats=[];viewportWidth=1;viewportHeight=1;simWidth;simHeight;dyeWidth;dyeHeight;disposed=!1;constructor(e,t={}){this.renderer=e,te(t,Object.keys(P));let n=P[t.profile??`balanced`];this.simResolution=t.simResolution??n.simResolution,this.dyeResolution=t.dyeResolution??n.dyeResolution,this.runtimeConfig=A(n.pressureIterations,t),this.geometry.setAttribute(`position`,new S(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),3)),this.mesh=new l(this.geometry,void 0),this.mesh.frustumCulled=!1,this.scene.add(this.mesh),this.splatGeometry.setAttribute(`position`,new S(new Float32Array([-1,-1,0,1,-1,0,-1,1,0,1,1,0]),3)),this.splatGeometry.setIndex(new u(new Uint16Array([0,1,2,1,3,2]),1)),this.splatMesh=new l(this.splatGeometry,void 0),this.splatMesh.frustumCulled=!1,this.splatScene.add(this.splatMesh),this.simWidth=this.simResolution,this.simHeight=this.simResolution,this.dyeWidth=this.dyeResolution,this.dyeHeight=this.dyeResolution,this.velocity=I(this.simWidth,this.simHeight,!0),this.density=I(this.dyeWidth,this.dyeHeight,!0),this.dye=I(this.dyeWidth,this.dyeHeight,!0),this.pressure=I(this.simWidth,this.simHeight,!1),this.divergence=F(this.simWidth,this.simHeight,!1),this.curl=F(this.simWidth,this.simHeight,!1);let r=new b(1/this.simWidth,1/this.simHeight),i=new b(1/this.dyeWidth,1/this.dyeHeight);this.clearMaterial=this.createMaterial(re,{texelSize:{value:r.clone()},uTexture:{value:null},value:{value:this.pressureDissipation}}),this.splatMaterial=new a({vertexShader:ie,fragmentShader:ae,uniforms:{uCenter:{value:new b},uScale:{value:new b},color:{value:new c}},depthTest:!1,depthWrite:!1,toneMapped:!1,transparent:!0,blending:5,blendEquation:100,blendSrc:201,blendDst:201,blendSrcAlpha:201,blendDstAlpha:201}),this.splatMesh.material=this.splatMaterial,this.curlMaterial=this.createMaterial(M,{texelSize:{value:r.clone()},uVelocity:{value:null}}),this.vorticityMaterial=this.createMaterial(oe,{texelSize:{value:r.clone()},uVelocity:{value:null},uCurl:{value:null},curl:{value:this.curlStrength},dt:{value:.016}}),this.divergenceMaterial=this.createMaterial(se,{texelSize:{value:r.clone()},uVelocity:{value:null},uReflectWalls:{value:1}}),this.pressureMaterial=this.createMaterial(ce,{texelSize:{value:r.clone()},uPressure:{value:null},uDivergence:{value:null}}),this.gradientSubtractMaterial=this.createMaterial(le,{texelSize:{value:r.clone()},uPressure:{value:null},uVelocity:{value:null}}),this.advectVelocityMaterial=this.createMaterial(N,{texelSize:{value:r.clone()},uVelocity:{value:null},uSource:{value:null},dt:{value:.016},dissipation:{value:1},uBFECC:{value:0}}),this.advectDensityMaterial=this.createMaterial(N,{texelSize:{value:i.clone()},uVelocity:{value:null},uSource:{value:null},dt:{value:.016},dissipation:{value:1},uBFECC:{value:0}}),this.advectDyeMaterial=this.createMaterial(N,{texelSize:{value:i.clone()},uVelocity:{value:null},uSource:{value:null},dt:{value:.016},dissipation:{value:1},uBFECC:{value:0}}),this.clearTargets()}get velocityTexture(){return this.velocity.read.texture}get pressureIterations(){return this.runtimeConfig.pressureIterations}get densityDissipation(){return this.runtimeConfig.densityDissipation}get velocityDissipation(){return this.runtimeConfig.velocityDissipation}get pressureDissipation(){return this.runtimeConfig.pressureDissipation}get dyeDissipation(){return this.runtimeConfig.dyeDissipation}get curlStrength(){return this.runtimeConfig.curlStrength}get splatRadius(){return this.runtimeConfig.splatRadius}get splatForce(){return this.runtimeConfig.splatForce}get baseDelta(){return this.runtimeConfig.baseDelta}get enableVorticity(){return this.runtimeConfig.enableVorticity}get bfecc(){return this.runtimeConfig.bfecc}get reflectWalls(){return this.runtimeConfig.reflectWalls}get enableDye(){return this.runtimeConfig.enableDye}getConfig(){return{...this.runtimeConfig}}configure(e){this.assertActive(),this.runtimeConfig=E(this.runtimeConfig,e)}get velocityProjectedTexture(){return this.velocity.write.texture}get densityTexture(){return this.density.read.texture}get dyeTexture(){return this.dye.read.texture}resize(e,t){this.assertActive(),O(e,t),this.viewportWidth=Math.max(1,e),this.viewportHeight=Math.max(1,t);let n=k(this.simResolution,this.viewportWidth,this.viewportHeight),r=k(this.dyeResolution,this.viewportWidth,this.viewportHeight),{width:i,height:a}=n,{width:o,height:s}=r,c=!1;if(i!==this.simWidth||a!==this.simHeight){c=!0,this.simWidth=i,this.simHeight=a,this.velocity.read.setSize(i,a),this.velocity.write.setSize(i,a),this.pressure.read.setSize(i,a),this.pressure.write.setSize(i,a),this.divergence.setSize(i,a),this.curl.setSize(i,a);let e=1/i,t=1/a;this.clearMaterial.uniforms.texelSize.value.set(e,t),this.curlMaterial.uniforms.texelSize.value.set(e,t),this.vorticityMaterial.uniforms.texelSize.value.set(e,t),this.divergenceMaterial.uniforms.texelSize.value.set(e,t),this.pressureMaterial.uniforms.texelSize.value.set(e,t),this.gradientSubtractMaterial.uniforms.texelSize.value.set(e,t),this.advectVelocityMaterial.uniforms.texelSize.value.set(e,t)}if(o!==this.dyeWidth||s!==this.dyeHeight){c=!0,this.dyeWidth=o,this.dyeHeight=s,this.density.read.setSize(o,s),this.density.write.setSize(o,s),this.dye.read.setSize(o,s),this.dye.write.setSize(o,s);let e=1/o,t=1/s;this.advectDensityMaterial.uniforms.texelSize.value.set(e,t),this.advectDyeMaterial.uniforms.texelSize.value.set(e,t)}c&&this.clearTargets()}addSplat(e,t,n,r,i={}){this.assertActive(),D(e,t,n,r),this.splats.push({x:Math.min(1,Math.max(0,e)),y:Math.min(1,Math.max(0,t)),dx:n,dy:r,radius:i.radius??this.splatRadius,color:i.color,dyeColor:i.dyeColor})}step(e){this.assertActive(),j(e);let t=Math.min(Math.max(e,1e-6),1/60),n=this.baseDelta>0?t/this.baseDelta:1,r=this.renderer.getRenderTarget(),i=this.renderer.autoClear;this.renderer.autoClear=!1;try{this.vorticityMaterial.uniforms.curl.value=this.curlStrength;let e=+!!this.bfecc;this.advectVelocityMaterial.uniforms.uBFECC.value=e,this.advectDensityMaterial.uniforms.uBFECC.value=e;for(let e=0;e<this.splats.length;e+=1)this.applySplat(this.splats[e]);this.splats.length=0,this.enableVorticity&&(this.curlMaterial.uniforms.uVelocity.value=this.velocity.read.texture,this.blit(this.curl,this.curlMaterial),this.vorticityMaterial.uniforms.uVelocity.value=this.velocity.read.texture,this.vorticityMaterial.uniforms.uCurl.value=this.curl.texture,this.vorticityMaterial.uniforms.dt.value=t,this.blit(this.velocity.write,this.vorticityMaterial),L(this.velocity)),this.divergenceMaterial.uniforms.uVelocity.value=this.velocity.read.texture,this.divergenceMaterial.uniforms.uReflectWalls.value=+!!this.reflectWalls,this.blit(this.divergence,this.divergenceMaterial),this.clearMaterial.uniforms.uTexture.value=this.pressure.read.texture,this.clearMaterial.uniforms.value.value=this.pressureDissipation**+n,this.blit(this.pressure.write,this.clearMaterial),L(this.pressure),this.pressureMaterial.uniforms.uDivergence.value=this.divergence.texture;for(let e=0;e<this.pressureIterations;e+=1)this.pressureMaterial.uniforms.uPressure.value=this.pressure.read.texture,this.blit(this.pressure.write,this.pressureMaterial),L(this.pressure);this.gradientSubtractMaterial.uniforms.uPressure.value=this.pressure.read.texture,this.gradientSubtractMaterial.uniforms.uVelocity.value=this.velocity.read.texture,this.blit(this.velocity.write,this.gradientSubtractMaterial),L(this.velocity),this.advectVelocityMaterial.uniforms.uVelocity.value=this.velocity.read.texture,this.advectVelocityMaterial.uniforms.uSource.value=this.velocity.read.texture,this.advectVelocityMaterial.uniforms.dissipation.value=this.velocityDissipation**+n,this.advectVelocityMaterial.uniforms.dt.value=t,this.blit(this.velocity.write,this.advectVelocityMaterial),L(this.velocity),this.advectDensityMaterial.uniforms.uVelocity.value=this.velocity.read.texture,this.advectDensityMaterial.uniforms.uSource.value=this.density.read.texture,this.advectDensityMaterial.uniforms.dissipation.value=this.densityDissipation**+n,this.advectDensityMaterial.uniforms.dt.value=t,this.blit(this.density.write,this.advectDensityMaterial),L(this.density),this.enableDye&&(this.advectDyeMaterial.uniforms.uBFECC.value=e,this.advectDyeMaterial.uniforms.uVelocity.value=this.velocity.read.texture,this.advectDyeMaterial.uniforms.uSource.value=this.dye.read.texture,this.advectDyeMaterial.uniforms.dissipation.value=this.dyeDissipation**+n,this.advectDyeMaterial.uniforms.dt.value=t,this.blit(this.dye.write,this.advectDyeMaterial),L(this.dye))}finally{this.renderer.setRenderTarget(r),this.renderer.autoClear=i}}dispose(){this.disposed||(this.disposed=!0,this.scene.remove(this.mesh),this.splatScene.remove(this.splatMesh),this.geometry.dispose(),this.splatGeometry.dispose(),this.clearMaterial.dispose(),this.splatMaterial.dispose(),this.curlMaterial.dispose(),this.vorticityMaterial.dispose(),this.divergenceMaterial.dispose(),this.pressureMaterial.dispose(),this.gradientSubtractMaterial.dispose(),this.advectVelocityMaterial.dispose(),this.advectDensityMaterial.dispose(),this.advectDyeMaterial.dispose(),R(this.velocity),R(this.density),R(this.dye),R(this.pressure),this.divergence.dispose(),this.curl.dispose())}assertActive(){if(this.disposed)throw Error(`WebGLFluidSolver has been disposed.`)}clearTargets(){let e=this.renderer.getRenderTarget(),t=this.renderer.getClearColor(new d).clone(),n=this.renderer.getClearAlpha();this.renderer.setClearColor(0,0);for(let e of[this.velocity.read,this.velocity.write,this.density.read,this.density.write,this.dye.read,this.dye.write,this.pressure.read,this.pressure.write,this.divergence,this.curl])this.renderer.setRenderTarget(e),this.renderer.clear(!0,!1,!1);this.renderer.setRenderTarget(e),this.renderer.setClearColor(t,n)}createMaterial(e,t){return new a({vertexShader:ne,fragmentShader:e,uniforms:t,depthTest:!1,depthWrite:!1,toneMapped:!1})}blit(e,t){this.mesh.material=t,this.renderer.setRenderTarget(e),this.renderer.render(this.scene,this.camera),this.renderer.setRenderTarget(null)}applySplat(e){let t=this.viewportWidth/this.viewportHeight,n=e.color??[e.dx,e.dy,1],r=3*Math.sqrt(e.radius),i=this.splatMaterial.uniforms;i.uCenter.value.set(e.x*2-1,e.y*2-1),i.uScale.value.set(r/t,r),i.color.value.set(n[0],n[1],n[2]),this.renderer.setRenderTarget(this.velocity.read),this.renderer.render(this.splatScene,this.camera),this.renderer.setRenderTarget(this.density.read),this.renderer.render(this.splatScene,this.camera),this.enableDye&&e.dyeColor&&(i.color.value.set(e.dyeColor[0],e.dyeColor[1],e.dyeColor[2]),this.renderer.setRenderTarget(this.dye.read),this.renderer.render(this.splatScene,this.camera))}},B=`
varying vec2 vUv;

void main() {
  vUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,V=class{constructor(e){this.material=e,this.geometry.setAttribute(`position`,new S(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),3)),this.mesh=new l(this.geometry,e),this.mesh.frustumCulled=!1,this.scene.add(this.mesh)}material;scene=new v;camera=new C(-1,1,1,-1,0,1);geometry=new y;mesh;render(e,t=null){e.setRenderTarget(t),e.render(this.scene,this.camera)}dispose(){this.scene.remove(this.mesh),this.geometry.dispose(),this.material.dispose()}},H=10,U=.006,W=.5,ue=.012,de=-.12,fe=.14,pe=.68,me=.28,he=.34,ge=.18,_e=1.35,ve=.04,ye=`
precision highp float;
varying vec2 vUv;
uniform sampler2D uSource;

void main() {
  gl_FragColor = texture2D(uSource, vUv);
}
`,be=`
precision highp float;
varying vec2 vUv;
uniform sampler2D uPositionTexture;
uniform sampler2D uVelocityTexture;
uniform sampler2D uDestinationTexture;
uniform sampler2D uAttributeTexture;
uniform sampler2D uFlow;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uModelMatrix;
uniform vec3 uCameraRight;
uniform vec3 uCameraUp;
uniform float uDeltaTime;
uniform float uFlowStrength;
uniform float uDepthLift;
uniform float uMaxFlowSpeed;
uniform float uFlowThresh;
uniform float uFlowPow;
uniform float uPerpendicularAngle;
uniform float uOmega;
uniform float uZeta;
uniform float uDragLin;
uniform float uDragQuad;
uniform float uAMax;
uniform float uVMaxScale;
uniform float uSideVariation;
uniform float uPlaneLock;
uniform float uDepthScale;

float hash(float n) {
  return fract(sin(n) * 43758.5453123);
}

void main() {
  vec4 position = texture2D(uPositionTexture, vUv);
  vec4 velocity = texture2D(uVelocityTexture, vUv);
  vec4 destination = texture2D(uDestinationTexture, vUv);
  vec4 attr = texture2D(uAttributeTexture, vUv);

  vec3 pos = position.xyz;
  vec3 vel = velocity.xyz;
  vec3 dest = destination.xyz;
  float stiffness = destination.w;
  float vmax = attr.y * uVMaxScale;
  float seed = attr.w;

  vec3 error = dest - pos;
  float omega = uOmega * max(0.0, stiffness);
  vec3 aSpring = omega * omega * error;
  vec3 aDamp = -2.0 * uZeta * omega * vel;

  float speed = length(vel);
  vec3 aDrag = vec3(0.0);
  if (speed > 1e-5) {
    aDrag = -uDragLin * vel - uDragQuad * speed * vel;
  }

  vec3 aCore = aSpring + aDamp + aDrag;
  vec3 aFlow = vec3(0.0);

  vec3 worldPos = (uModelMatrix * vec4(pos, 1.0)).xyz;
  mat3 invModelRotation = inverse(mat3(uModelMatrix));
  vec4 clip = uProjectionMatrix * uViewMatrix * vec4(worldPos, 1.0);
  if (clip.w > 0.00001) {
    vec2 ndc = clip.xy / clip.w;
    vec2 uv = ndc * 0.5 + 0.5;
    if (uv.x > 0.0 && uv.x < 1.0 && uv.y > 0.0 && uv.y < 1.0) {
      vec2 flow = texture2D(uFlow, uv).xy;
      float flowMag = length(flow);
      float norm = (flowMag - uFlowThresh) / max(1e-5, uMaxFlowSpeed);
      float factor = smoothstep(0.0, 1.0, clamp(norm, 0.0, 1.0));
      factor = pow(factor, max(1.0, uFlowPow));
      flow *= factor;
      flow *= min(1.0, uMaxFlowSpeed / max(flowMag, 1e-5));

      vec3 flowWorld = flow.x * uCameraRight + flow.y * uCameraUp;
      vec3 flowLocal = invModelRotation * flowWorld;
      aFlow += flowLocal * uFlowStrength;

      if (uDepthLift > 0.0 && length(flowLocal) > 1e-5) {
        vec3 forward = normalize(cross(uCameraRight, uCameraUp));
        vec3 forwardLocal = invModelRotation * forward;
        vec3 flowDir = normalize(flowLocal);
        vec3 sideDir = normalize(cross(forwardLocal, flowDir));
        float sideSign = hash(seed * 12.9898) > 0.5 ? 1.0 : -1.0;
        float perSeed = mix(1.0, mix(0.35, 1.0, hash(seed * 37.719)), clamp(uSideVariation, 0.0, 1.0));
        aFlow += sideDir * sideSign * perSeed * length(flow) * uPerpendicularAngle * uDepthLift;
        aFlow += forwardLocal * (hash(seed * 91.17) - 0.5) * length(flow) * 0.18 * uDepthLift;
      }

      // Depth attenuation: only the camera-facing half of the volume reacts.
      // signedDepth > 0  (in front of origin) → full influence.
      // signedDepth < 0  (behind origin)      → Gaussian decay with width = uDepthScale.
      // For plane2d (z = 0) signedDepth = 0 → falloff = 1 regardless of scale.
      vec3 forwardW = normalize(cross(uCameraRight, uCameraUp));
      float signedDepth = dot(worldPos, forwardW);
      float behind = max(0.0, -signedDepth) / max(uDepthScale, 0.01);
      aFlow *= exp(-behind * behind);
    }
  }

  vec3 acceleration = aCore + aFlow;
  acceleration.z = mix(acceleration.z, aCore.z, uPlaneLock);

  float aMag = length(acceleration);
  if (aMag > uAMax) {
    acceleration = acceleration / aMag * uAMax;
    aMag = uAMax;
  }

  vel += acceleration * uDeltaTime;
  vel.z = mix(vel.z, 0.0, uPlaneLock);

  float newSpeed = length(vel);
  if (newSpeed > vmax) {
    vel = vel / newSpeed * vmax;
    newSpeed = vmax;
  }

  vec3 velCore = velocity.xyz + aCore * uDeltaTime;
  float flowEnergy = length(vel - velCore);
  float desiredEnergy = smoothstep(0.15, 2.8, newSpeed) * 0.35 + smoothstep(0.05, 1.8, flowEnergy) * 1.35;
  float alpha = 1.0 - pow(0.5, uDeltaTime / 0.08);
  float energy = mix(velocity.w, desiredEnergy, alpha);

  gl_FragColor = vec4(vel, energy);
}
`,xe=`
precision highp float;
varying vec2 vUv;
uniform sampler2D uPositionTexture;
uniform sampler2D uVelocityTexture;
uniform sampler2D uDestinationTexture;
uniform float uDeltaTime;
uniform float uPlaneLock;

void main() {
  vec4 pos = texture2D(uPositionTexture, vUv);
  vec3 vel = texture2D(uVelocityTexture, vUv).xyz;
  vec3 dest = texture2D(uDestinationTexture, vUv).xyz;
  pos.xyz += vel * uDeltaTime;
  pos.z = mix(pos.z, dest.z, uPlaneLock);
  gl_FragColor = vec4(pos.xyz, 1.0);
}
`,Se=`
precision highp float;
attribute vec2 aParticleUv;
attribute float aSeed;
uniform sampler2D uPositionTexture;
uniform sampler2D uVelocityTexture;
uniform sampler2D uAttributeTexture;
uniform sampler2D uColorTexture;
uniform float uUseColorTexture;
uniform float uPointSize;
uniform float uTime;
uniform vec3 uCameraRightLocal;
uniform vec3 uCameraUpLocal;
varying vec2 vUv;
varying vec3 vParticleColor;
varying vec3 vParticlePalette;

const float BILLBOARD_WORLD_UNITS_PER_POINT_SIZE = ${U.toFixed(3)};

float hash31(vec3 p) {
  return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453123);
}

float valueNoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);

  float n000 = hash31(i + vec3(0.0, 0.0, 0.0));
  float n100 = hash31(i + vec3(1.0, 0.0, 0.0));
  float n010 = hash31(i + vec3(0.0, 1.0, 0.0));
  float n110 = hash31(i + vec3(1.0, 1.0, 0.0));
  float n001 = hash31(i + vec3(0.0, 0.0, 1.0));
  float n101 = hash31(i + vec3(1.0, 0.0, 1.0));
  float n011 = hash31(i + vec3(0.0, 1.0, 1.0));
  float n111 = hash31(i + vec3(1.0, 1.0, 1.0));

  float nx00 = mix(n000, n100, u.x);
  float nx10 = mix(n010, n110, u.x);
  float nx01 = mix(n001, n101, u.x);
  float nx11 = mix(n011, n111, u.x);
  float nxy0 = mix(nx00, nx10, u.y);
  float nxy1 = mix(nx01, nx11, u.y);
  return mix(nxy0, nxy1, u.z);
}

void main() {
  vec3 pos = texture2D(uPositionTexture, aParticleUv).xyz;
  float energy = clamp(texture2D(uVelocityTexture, aParticleUv).w, 0.0, 1.0);
  vec4 attr = texture2D(uAttributeTexture, aParticleUv);
  float worldSize = uPointSize * attr.x * BILLBOARD_WORLD_UNITS_PER_POINT_SIZE;
  vec3 offset = (uCameraRightLocal * position.x + uCameraUpLocal * position.y) * worldSize;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos + offset, 1.0);
  vUv = uv;

  float e = smoothstep(0.0, 1.0, energy);
  vec3 patternPos = pos * 0.72;
  vec3 noisePos = patternPos * 1.15 + vec3(aSeed * 7.1, uTime * 0.08, -uTime * 0.05);
  float n0 = valueNoise(noisePos);
  float n1 = valueNoise(noisePos * 2.31 + vec3(13.5, 9.2, 5.7));
  float noise = n0 * 0.68 + n1 * 0.32;
  float marble = sin((patternPos.x + patternPos.y * 0.7 - patternPos.z * 0.4) * 2.4 + noise * 4.5 + uTime * 0.05);
  float paletteDrift = sin(uTime * 0.11 + aSeed * 6.28318530718) * 0.025;
  float a = fract(aSeed * 0.18 + noise * 0.48 + marble * 0.12 + e * 0.26 + paletteDrift);
  float phase = a * 6.3;
  vec3 palette = vec3(cos(phase), cos(phase + 83.0), cos(phase + 21.0)) * 0.56 + 0.55;
  palette = mix(palette, texture2D(uColorTexture, aParticleUv).rgb, uUseColorTexture);
  float cyanAmount = smoothstep(0.62, 1.05, palette.z + palette.y * 0.55 - palette.x * 0.7);
  float whiteAmount = smoothstep(0.72, 1.0, min(min(palette.x, palette.y), palette.z));
  vec3 paletteWarm = palette * vec3(1.08, 0.93, 0.72) + vec3(0.025, 0.0, 0.0);
  palette = mix(palette, paletteWarm, min(0.5, cyanAmount * 0.28 + whiteAmount * 0.35));
  float emissionStrength = 0.9 + e * 1.45;

  vParticlePalette = palette;
  vParticleColor = palette * emissionStrength;
}
`,Ce=`
precision highp float;
varying vec2 vUv;
varying vec3 vParticleColor;
varying vec3 vParticlePalette;
uniform float uOpacity;

const float POINT_SHAPE_RADIUS = ${W.toFixed(1)};
const float POINT_EDGE_AA_MIN = ${ue.toFixed(3)};
const vec2 POINT_GRADIENT_FOCUS = vec2(${de.toFixed(2)}, ${fe.toFixed(2)});
const float POINT_CENTER_FALLOFF = ${pe.toFixed(2)};
const float POINT_CENTER_LIGHT_BOOST = ${me.toFixed(2)};
const float POINT_CENTER_CHROMA_BOOST = ${he.toFixed(2)};
const float POINT_CENTER_ALPHA_BOOST = ${ge.toFixed(2)};
const float POINT_COLOR_PEAK = ${_e.toFixed(2)};
const float POINT_DEPTH_ALPHA_CUTOFF = ${ve.toFixed(2)};

void main() {
  vec2 p = vUv - 0.5;
  float d = length(p);

  // The sprite size is the visible diameter; AA is folded inward at the edge.
  float aa = max(fwidth(d), POINT_EDGE_AA_MIN);
  float alpha = 1.0 - smoothstep(POINT_SHAPE_RADIUS - aa, POINT_SHAPE_RADIUS, d);

  vec2 gradientP = p - POINT_GRADIENT_FOCUS;
  float centerGradient = 1.0 - smoothstep(0.0, POINT_CENTER_FALLOFF, length(gradientP) / POINT_SHAPE_RADIUS);
  vec2 normalUv = gradientP / POINT_SHAPE_RADIUS;
  float normalZ = sqrt(max(0.0, 1.0 - dot(normalUv, normalUv)));
  vec3 normal = normalize(vec3(normalUv, normalZ));
  vec3 lightDir = normalize(vec3(-0.42, 0.55, 0.72));
  vec3 halfDir = normalize(vec3(-0.16, 0.22, 1.0));
  float diffuse = max(dot(normal, lightDir), 0.0);
  float specular = pow(max(dot(normal, halfDir), 0.0), 18.0) * 0.28;
  float phongShade = (0.74 + diffuse * 0.42) * (0.84 + normalZ * 0.16);

  vec3 finalColor = vParticleColor * phongShade + vParticlePalette * specular;
  finalColor = finalColor * (1.0 + centerGradient * POINT_CENTER_LIGHT_BOOST)
    + vParticlePalette * (centerGradient * POINT_CENTER_CHROMA_BOOST);
  float peak = max(max(finalColor.r, finalColor.g), max(finalColor.b, POINT_COLOR_PEAK));
  finalColor *= POINT_COLOR_PEAK / peak;

  float visibleAlpha = min(1.0, alpha * (1.0 + centerGradient * POINT_CENTER_ALPHA_BOOST)) * uOpacity;
  if (visibleAlpha <= POINT_DEPTH_ALPHA_CUTOFF) {
    discard;
  }

  gl_FragColor = vec4(finalColor, visibleAlpha);
}
`;function G(e){return new p(e,e,{depthBuffer:!1,stencilBuffer:!1,format:s,type:_,minFilter:i,magFilter:i,wrapS:f,wrapT:f,generateMipmaps:!1})}function K(e){return{read:G(e),write:G(e)}}function q(e){let t=e.read;e.read=e.write,e.write=t}function we(t){let n=new e;return n.setAttribute(`position`,new m(new Float32Array([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0]),3)),n.setAttribute(`uv`,new m(new Float32Array([0,0,1,0,1,1,0,1]),2)),n.setAttribute(`aParticleUv`,new o(t.uvs,2)),n.setAttribute(`aSeed`,new o(t.seeds,1)),n.setIndex(new m(new Uint16Array([0,1,2,0,2,3]),1)),n.setDrawRange(0,6),n.instanceCount=t.seeds.length,n}function J(e,n){let a=new r(n,e,e,s,t);return a.minFilter=i,a.magFilter=i,a.wrapS=f,a.wrapT=f,a.needsUpdate=!0,a}function Te(e){let t=Math.sin(e)*43758.5453123;return t-Math.floor(t)}function Y(e,t){return new a({vertexShader:B,fragmentShader:e,uniforms:t,depthTest:!1,depthWrite:!1,toneMapped:!1})}function Ee(e,t,n){let r=t*t,i=new Float32Array(r*4),a=new Float32Array(r*4),o=new Float32Array(r*4),s=new Float32Array(r*4),c=new Float32Array(r*2),l=new Float32Array(r),u=Math.PI*(3-Math.sqrt(5));for(let d=0;d<r;d+=1){let f=(d%t+.5)/t,p=(Math.floor(d/t)+.5)/t,m=d*.61803398875%1,h=0,g=0,_=0;if(e===`custom2d`&&n?.length===r*4)h=n[d*4],g=n[d*4+1],_=n[d*4+2];else if(e===`plane2d`){let e=d*u,t=Math.sqrt((d+.5)/r);h=Math.cos(e)*t*2,g=Math.sin(e)*t*2,_=0}else{let e=1-2*((d+.5)/r),t=Math.sqrt(Math.max(0,1-e*e)),n=d*u;h=Math.cos(n)*t*2,g=e*2,_=Math.sin(n)*t*2}i[d*4]=h,i[d*4+1]=g,i[d*4+2]=_,i[d*4+3]=1,o[d*4]=h,o[d*4+1]=g,o[d*4+2]=_,o[d*4+3]=e===`cloud3d`?.82:1.15,a[d*4]=0,a[d*4+1]=0,a[d*4+2]=0,a[d*4+3]=0;let v=Te(d*12.9898+78.233);s[d*4]=e===`cloud3d`?.75+v*.6:.8+v*.5,s[d*4+1]=e===`cloud3d`?2.6:3.2,s[d*4+2]=0,s[d*4+3]=m,c[d*2]=f,c[d*2+1]=p,l[d]=m}return{positions:i,velocities:a,destinations:o,attributes:s,uvs:c,seeds:l}}function De(e,t){let r=t.size??(t.mode===`cloud3d`?144:160),i=Ee(t.mode,r,t.destinations),o=K(r),s=K(r),l=J(r,i.destinations),u=J(r,t.colors??new Float32Array(r*r*4).fill(1)),d=J(r,i.attributes),f=J(r,i.positions),p=J(r,i.velocities),m=Y(ye,{uSource:new h(f)}),g=Y(be,{uPositionTexture:new h(o.read.texture),uVelocityTexture:new h(s.read.texture),uDestinationTexture:new h(l),uAttributeTexture:new h(d),uFlow:new h(null),uViewMatrix:new h(new x),uProjectionMatrix:new h(new x),uModelMatrix:new h(new x),uCameraRight:new h(new c(1,0,0)),uCameraUp:new h(new c(0,1,0)),uDeltaTime:new h(.016),uFlowStrength:new h(1),uDepthLift:new h(0),uMaxFlowSpeed:new h(12),uFlowThresh:new h(.02),uFlowPow:new h(2),uPerpendicularAngle:new h(1.5),uOmega:new h(2),uZeta:new h(1.15),uDragLin:new h(.28),uDragQuad:new h(.05),uAMax:new h(24),uVMaxScale:new h(1),uSideVariation:new h(1),uPlaneLock:new h(t.mode===`cloud3d`?0:1),uDepthScale:new h(1)}),_=Y(xe,{uPositionTexture:new h(o.read.texture),uVelocityTexture:new h(s.read.texture),uDestinationTexture:new h(l),uDeltaTime:new h(.016),uPlaneLock:new h(t.mode===`cloud3d`?0:1)}),v=new V(m),y=new V(g),b=new V(_);m.uniforms.uSource.value=f,v.render(e,o.read),v.render(e,o.write),m.uniforms.uSource.value=p,v.render(e,s.read),v.render(e,s.write),e.setRenderTarget(null);let S=we(i),C=new a({vertexShader:Se,fragmentShader:Ce,uniforms:{uPositionTexture:new h(o.read.texture),uVelocityTexture:new h(s.read.texture),uAttributeTexture:new h(d),uColorTexture:new h(u),uUseColorTexture:new h(+!!t.colors),uPointSize:new h(H),uTime:new h(0),uOpacity:new h(1),uCameraRightLocal:new h(new c(1,0,0)),uCameraUpLocal:new h(new c(0,1,0))},transparent:!0,depthTest:!0,depthWrite:!0,blending:1,alphaToCoverage:!0,toneMapped:!1,side:2}),w=Math.min(Math.max(1,Math.floor(t.count??r*r)),r*r),T=new ee(S,C,w),E=new x;for(let e=0;e<w;e+=1)T.setMatrixAt(e,E);T.instanceMatrix.needsUpdate=!0,T.frustumCulled=!1;let D=0,O=new n,k=new x,A=C.uniforms.uCameraRightLocal.value,j=C.uniforms.uCameraUpLocal.value;return{points:T,setDestinations(e){if(e.length!==r*r*4)throw Error(`Expected ${r*r*4} destination values`);l.image.data.set(e),l.needsUpdate=!0},setColors(e){if(e.length!==r*r*4)throw Error(`Expected ${r*r*4} color values`);u.image.data.set(e),u.needsUpdate=!0,C.uniforms.uUseColorTexture.value=1},setOpacity(e){C.uniforms.uOpacity.value=Math.min(1,Math.max(0,e))},step(t){let n=Math.min(Math.max(t.dt,1e-6),.03333333333333333);T.updateWorldMatrix(!0,!1);let r=t.modelMatrix??T.matrixWorld;D+=n;let i=g.uniforms;i.uPositionTexture.value=o.read.texture,i.uVelocityTexture.value=s.read.texture,i.uFlow.value=t.velocityField,i.uViewMatrix.value.copy(t.viewMatrix),i.uProjectionMatrix.value.copy(t.projectionMatrix),i.uModelMatrix.value.copy(r),i.uCameraRight.value.copy(t.cameraRight),i.uCameraUp.value.copy(t.cameraUp),i.uDeltaTime.value=n,i.uOmega.value=t.spring,i.uZeta.value=t.zeta,i.uDragLin.value=t.dragLin,i.uDragQuad.value=t.dragQuad,i.uAMax.value=t.aMax,i.uVMaxScale.value=t.vMaxScale,i.uFlowStrength.value=t.flowStrength,i.uDepthLift.value=t.depthLift,i.uFlowThresh.value=t.flowThreshold,i.uMaxFlowSpeed.value=t.maxFlowSpeed,i.uFlowPow.value=t.responseGamma,i.uPerpendicularAngle.value=t.perpendicularAngle,i.uSideVariation.value=t.sideVariation,i.uDepthScale.value=t.depthAttenuationScale,y.render(e,s.write),q(s),_.uniforms.uPositionTexture.value=o.read.texture,_.uniforms.uVelocityTexture.value=s.read.texture,_.uniforms.uDeltaTime.value=n,b.render(e,o.write),q(o),e.setRenderTarget(null),C.uniforms.uPositionTexture.value=o.read.texture,C.uniforms.uVelocityTexture.value=s.read.texture,C.uniforms.uPointSize.value=t.pointSize,C.uniforms.uTime.value=D,k.extractRotation(r),O.setFromMatrix4(k).invert(),A.copy(t.cameraRight).applyMatrix3(O).normalize(),j.copy(t.cameraUp).applyMatrix3(O).normalize()},dispose(){S.dispose(),C.dispose(),v.dispose(),y.dispose(),b.dispose(),f.dispose(),p.dispose(),l.dispose(),u.dispose(),d.dispose(),o.read.dispose(),o.write.dispose(),s.read.dispose(),s.write.dispose()}}}var X=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,Oe=`
varying vec2 vUv;
uniform sampler2D tBase;
uniform sampler2D tOverlay;
uniform float uOpacity;

void main() {
  vec4 base = texture2D(tBase, vUv);
  vec4 overlay = texture2D(tOverlay, vUv);
  gl_FragColor = mix(base, overlay, clamp(uOpacity, 0.0, 1.0));
}
`,Z=class extends w{opacity=1;material;fsQuad;opacityMaterial;opacityQuad;opacityTarget;constructor(e,t,n={}){super(),this.needsSwap=!0,this.material=new a({vertexShader:X,fragmentShader:e,uniforms:t,depthTest:!1,depthWrite:!1,toneMapped:n.toneMapped??!1}),this.fsQuad=new T(this.material),this.opacityMaterial=new a({vertexShader:X,fragmentShader:Oe,uniforms:{tBase:new h(null),tOverlay:new h(null),uOpacity:new h(1)},depthTest:!1,depthWrite:!1,toneMapped:n.toneMapped??!1}),this.opacityQuad=new T(this.opacityMaterial),this.opacityTarget=new p(1,1,{depthBuffer:!1,stencilBuffer:!1})}setSize(e,t){}render(e,t,n,r,i){this.updateUniforms(n);let a=this.renderToScreen?null:t;if(this.opacity>=.999){e.setRenderTarget(a),this.clear&&e.clear(),this.fsQuad.render(e);return}(this.opacityTarget.width!==n.width||this.opacityTarget.height!==n.height)&&this.opacityTarget.setSize(n.width,n.height),e.setRenderTarget(this.opacityTarget),e.clear(),this.fsQuad.render(e);let o=this.opacityMaterial.uniforms;o.tBase.value=n.texture,o.tOverlay.value=this.opacityTarget.texture,o.uOpacity.value=Math.max(0,Math.min(this.opacity,1)),e.setRenderTarget(a),this.clear&&e.clear(),this.opacityQuad.render(e)}dispose(){this.material.dispose(),this.fsQuad.dispose(),this.opacityMaterial.dispose(),this.opacityQuad.dispose(),this.opacityTarget.dispose()}},ke=`
precision highp float;
varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform sampler2D tFluid;
uniform float uIntensity;

void main() {
  vec3 fluid = texture2D(tFluid, vUv).rgb;
  vec2 vel = fluid.rg;
  vec2 uv = vUv - vel * uIntensity * 0.0003;
  uv = clamp(uv, 0.0, 1.0);
  gl_FragColor = texture2D(tDiffuse, uv);
}
`,Ae=class extends Z{constructor(e){super(ke,{tDiffuse:new h(null),tFluid:new h(null),uIntensity:new h(1)}),this.fluid=e}fluid;intensity=1;updateUniforms(e){this.material.uniforms.tDiffuse.value=e.texture,this.material.uniforms.tFluid.value=this.fluid.densityTexture,this.material.uniforms.uIntensity.value=this.intensity}},je=`
precision highp float;
varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform sampler2D tFluid;
uniform float uIntensity;

void main() {
  vec3 fluid = texture2D(tFluid, vUv).rgb;
  float density = clamp(fluid.b, 0.0, 1.0);
  vec2 vel = fluid.rg;

  float speed = max(length(vel), 1e-4);
  vec2 dir = vel / speed;
  float strength = pow(density, 1.4) * uIntensity * 0.012;
  vec2 shift = dir * strength;

  float r = texture2D(tDiffuse, vUv + shift).r;
  float g = texture2D(tDiffuse, vUv).g;
  float b = texture2D(tDiffuse, vUv - shift).b;

  gl_FragColor = vec4(r, g, b, 1.0);
}
`,Me=class extends Z{constructor(e){super(je,{tDiffuse:new h(null),tFluid:new h(null),uIntensity:new h(1)}),this.fluid=e}fluid;intensity=1;updateUniforms(e){this.material.uniforms.tDiffuse.value=e.texture,this.material.uniforms.tFluid.value=this.fluid.densityTexture,this.material.uniforms.uIntensity.value=this.intensity}},Ne=`
precision highp float;
varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform sampler2D tFluid;
uniform float uIntensity;
uniform vec2 uTexel;

void main() {
  vec3 fluid = texture2D(tFluid, vUv).rgb * 0.36;
  fluid += texture2D(tFluid, vUv + vec2(uTexel.x * 2.0, 0.0)).rgb * 0.16;
  fluid += texture2D(tFluid, vUv - vec2(uTexel.x * 2.0, 0.0)).rgb * 0.16;
  fluid += texture2D(tFluid, vUv + vec2(0.0, uTexel.y * 2.0)).rgb * 0.16;
  fluid += texture2D(tFluid, vUv - vec2(0.0, uTexel.y * 2.0)).rgb * 0.16;

  vec2 vel = fluid.rg;
  float density = clamp(fluid.b, 0.0, 1.0);
  float falloff = pow(density, 1.2);

  vec2 chroma = vel * 0.003 * uIntensity * falloff;
  vec2 distUv = vUv - vel * 0.0002 * uIntensity * falloff;

  vec4 color;
  color.r = texture2D(tDiffuse, distUv + vec2( chroma.x,  chroma.y)).r;
  color.g = texture2D(tDiffuse, distUv + vec2(-chroma.x,  chroma.y)).g;
  color.b = texture2D(tDiffuse, distUv + vec2(-chroma.x, -chroma.y)).b;
  color.a = 1.0;
  gl_FragColor = color;
}
`,Pe=class extends Z{constructor(e){super(Ne,{tDiffuse:new h(null),tFluid:new h(null),uIntensity:new h(1),uTexel:new h(new b(1/512,1/512))}),this.fluid=e}fluid;intensity=1;updateUniforms(e){this.material.uniforms.tDiffuse.value=e.texture,this.material.uniforms.tFluid.value=this.fluid.densityTexture,this.material.uniforms.uIntensity.value=this.intensity;let t=this.fluid.densityTexture.image;this.material.uniforms.uTexel.value.set(1/t.width,1/t.height)}},Fe=`
precision highp float;
varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform sampler2D tFluid;
uniform float uIntensity;
uniform vec2 uTexel;

void main() {
  float hL = texture2D(tFluid, vUv - vec2(uTexel.x * 2.0, 0.0)).b;
  float hR = texture2D(tFluid, vUv + vec2(uTexel.x * 2.0, 0.0)).b;
  float hD = texture2D(tFluid, vUv - vec2(0.0, uTexel.y * 2.0)).b;
  float hU = texture2D(tFluid, vUv + vec2(0.0, uTexel.y * 2.0)).b;
  vec2 normal = vec2(hR - hL, hU - hD);

  vec2 offset = normal * uIntensity * 0.6;
  float r = texture2D(tDiffuse, vUv + offset * 0.95).r;
  float g = texture2D(tDiffuse, vUv + offset).g;
  float b = texture2D(tDiffuse, vUv + offset * 1.05).b;

  gl_FragColor = vec4(r, g, b, 1.0);
}
`,Ie=class extends Z{constructor(e){super(Fe,{tDiffuse:new h(null),tFluid:new h(null),uIntensity:new h(1),uTexel:new h(new b(1/512,1/512))}),this.fluid=e}fluid;intensity=1;updateUniforms(e){this.material.uniforms.tDiffuse.value=e.texture,this.material.uniforms.tFluid.value=this.fluid.densityTexture,this.material.uniforms.uIntensity.value=this.intensity;let t=this.fluid.densityTexture.image;this.material.uniforms.uTexel.value.set(1/t.width,1/t.height)}},Le=`
precision highp float;
varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform sampler2D tFluid;
uniform float uIntensity;
uniform float uTime;
uniform vec2 uTexel;

float causticWeb(vec2 uv, float t) {
  // 公式在 p = 0 附近会退化（1/length 会发散）；经典 Shadertoy 版本加入较大偏移，
  // 让 p 始终远离原点。
  const float TAU = 6.28318530718;
  vec2 p = mod(uv * TAU, TAU) - 250.0;
  vec2 i = p;
  float c = 1.0;
  float inten = 0.005;
  for (int n = 0; n < 5; n++) {
    float tt = t * (1.0 - 3.5 / float(n + 1));
    i = p + vec2(cos(tt - i.x) + sin(tt + i.y),
                 sin(tt - i.y) + cos(tt + i.x));
    c += 1.0 / length(vec2(
      p.x / (sin(i.x + tt) / inten),
      p.y / (cos(i.y + tt) / inten)
    ));
  }
  c /= 5.0;
  c = 1.17 - pow(c, 1.4);
  return clamp(pow(abs(c), 8.0), 0.0, 1.0);
}

void main() {
  vec3 fluid = texture2D(tFluid, vUv).rgb;
  float hC = fluid.b;
  vec2 vel = fluid.rg;

  float hL = texture2D(tFluid, vUv - vec2(uTexel.x * 2.0, 0.0)).b;
  float hR = texture2D(tFluid, vUv + vec2(uTexel.x * 2.0, 0.0)).b;
  float hD = texture2D(tFluid, vUv - vec2(0.0, uTexel.y * 2.0)).b;
  float hU = texture2D(tFluid, vUv + vec2(0.0, uTexel.y * 2.0)).b;
  vec2 normal = vec2(hR - hL, hU - hD);

  vec2 offset = normal * uIntensity * 0.6;
  float r = texture2D(tDiffuse, vUv + offset * 0.95).r;
  float g = texture2D(tDiffuse, vUv + offset).g;
  float b = texture2D(tDiffuse, vUv + offset * 1.05).b;

  // 将 Hoskins/joltz0r 光场计算为小型可平铺光照纹理。
  // 流体只负责控制和扰动光照，不应直接绘制焦散。
  float surface = smoothstep(0.015, 0.16, hC);
  float slope = smoothstep(0.0015, 0.04, length(normal));
  vec2 cuv = vUv * 4.0 + vel * 0.0012;
  float web = causticWeb(cuv, uTime * 0.5 + 23.0);
  vec3 caustic = clamp(vec3(web) + vec3(0.0, 0.35, 0.5), 0.0, 1.0);
  float energy = pow(web, 1.25) * surface * mix(0.4, 1.0, slope);

  vec3 color = vec3(r, g, b) + caustic * energy * uIntensity * 0.38;
  gl_FragColor = vec4(color, 1.0);
}
`,Re=class extends Z{constructor(e){super(Le,{tDiffuse:new h(null),tFluid:new h(null),uIntensity:new h(1),uTime:new h(0),uTexel:new h(new b(1/512,1/512))}),this.fluid=e}fluid;intensity=1;time=0;updateUniforms(e){this.material.uniforms.tDiffuse.value=e.texture,this.material.uniforms.tFluid.value=this.fluid.densityTexture,this.material.uniforms.uIntensity.value=this.intensity,this.material.uniforms.uTime.value=this.time;let t=this.fluid.densityTexture.image;this.material.uniforms.uTexel.value.set(1/t.width,1/t.height)}},ze=`
precision highp float;
varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform sampler2D tFluid;
uniform sampler2D tDye;
uniform float uIntensity;
uniform vec2 uTexel;
uniform vec3 uCursorColor;
uniform float uVibrance;

vec3 rgb2hsv(vec3 c) {
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
  float d = q.x - min(q.w, q.y);
  float e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 vibrant(vec3 col, float v) {
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  return clamp(mix(vec3(lum), col, 1.0 + v), 0.0, 1.0);
}

void main() {
  vec3 scene = texture2D(tDiffuse, vUv).rgb;

  vec3 dye = texture2D(tDye, vUv).rgb * 0.5;
  dye += texture2D(tDye, vUv + uTexel * vec2( 1.0,  1.0)).rgb * 0.125;
  dye += texture2D(tDye, vUv + uTexel * vec2(-1.0,  1.0)).rgb * 0.125;
  dye += texture2D(tDye, vUv + uTexel * vec2( 1.0, -1.0)).rgb * 0.125;
  dye += texture2D(tDye, vUv + uTexel * vec2(-1.0, -1.0)).rgb * 0.125;

  float far = 0.0;
  far += length(texture2D(tDye, vUv + uTexel * vec2( 8.0,  0.0)).rgb);
  far += length(texture2D(tDye, vUv + uTexel * vec2(-8.0,  0.0)).rgb);
  far += length(texture2D(tDye, vUv + uTexel * vec2( 0.0,  8.0)).rgb);
  far += length(texture2D(tDye, vUv + uTexel * vec2( 0.0, -8.0)).rgb);
  far *= 0.25;
  float core = smoothstep(0.02, 0.55, far * uIntensity * 4.0);

  vec2 vel = texture2D(tFluid, vUv).rg;
  float kinetic = clamp(length(vel) * 0.02, 0.0, 1.0);

  vec3 hsv = rgb2hsv(uCursorColor);
  float sat = clamp(hsv.y * mix(0.20, 1.0, core) + kinetic * hsv.y * 0.35, 0.0, 1.0);
  float val = hsv.z * mix(0.78, 1.0, core);
  vec3 tint = vibrant(hsv2rgb(vec3(hsv.x, sat, val)), uVibrance);

  float density = clamp(length(dye) * uIntensity * 3.0, 0.0, 0.95);
  gl_FragColor = vec4(mix(scene, tint, density), 1.0);
}
`,Be=class extends Z{constructor(e){let t=new d(.85,.95,1);super(ze,{tDiffuse:new h(null),tFluid:new h(null),tDye:new h(null),uIntensity:new h(1),uTexel:new h(new b(1/512,1/512)),uCursorColor:new h(t.clone()),uVibrance:new h(0)}),this.fluid=e,this.cursorColor=t}fluid;intensity=1;vibrance=0;cursorColor;updateUniforms(e){let t=this.material.uniforms;t.tDiffuse.value=e.texture,t.tFluid.value=this.fluid.densityTexture,t.tDye.value=this.fluid.dyeTexture,t.uIntensity.value=this.intensity,t.uCursorColor.value.copy(this.cursorColor),t.uVibrance.value=this.vibrance;let n=this.fluid.dyeTexture.image;t.uTexel.value.set(1/n.width,1/n.height)}},Ve=`
precision highp float;
varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform sampler2D tFluid;
uniform float uIntensity;
uniform float uTime;
uniform float uVibrance;
uniform vec3 uColor;
uniform vec3 uColorPrimary;
uniform vec3 uColorSecondary;
uniform vec3 uColorHighlight;
uniform float uUsePalette;

vec3 vibrant(vec3 c, float v) {
  float lum = dot(c, vec3(0.299, 0.587, 0.114));
  return clamp(mix(vec3(lum), c, 1.0 + v), 0.0, 1.0);
}

vec3 palette(float t) {
  return mix(mix(uColorPrimary, uColorHighlight, smoothstep(0.15, 0.85, t)), uColorSecondary, smoothstep(0.55, 1.0, t) * 0.42);
}

vec3 originalPalette(float t) {
  vec3 ember = vec3(1.0, 0.33, 0.20);
  vec3 mint = vec3(0.08, 0.78, 0.68);
  vec3 cream = vec3(1.0, 0.84, 0.55);
  return mix(mix(ember, cream, smoothstep(0.15, 0.85, t)), mint, smoothstep(0.55, 1.0, t) * 0.42);
}

void main() {
  vec4 scene = texture2D(tDiffuse, vUv);
  vec3 fluid = texture2D(tFluid, vUv).rgb;
  float density = clamp(fluid.b, 0.0, 1.0);
  float speed = length(fluid.rg);

  float trail = density;
  for (float i = 1.0; i < 6.0; i += 1.0) {
    vec2 offset = fluid.rg * i * 0.035;
    trail += texture2D(tFluid, vUv - offset).b * (1.0 - i / 7.0);
  }

  float glow = clamp(trail * uIntensity, 0.0, 1.0);
  vec3 originalColor = vibrant(mix(originalPalette(fract(glow * 0.62 + speed * 0.015 + uTime * 0.025)), uColor, 0.55), uVibrance);
  vec3 customColor = vibrant(palette(fract(glow * 0.62 + speed * 0.015 + uTime * 0.025)), uVibrance);
  vec3 color = mix(originalColor, customColor, uUsePalette);
  float alpha = clamp(glow * 0.58 + speed * 0.012, 0.0, 0.86);
  vec3 result = scene.rgb + color * alpha * 0.86;
  result = mix(result, color, alpha * 0.14);

  gl_FragColor = vec4(result, 1.0);
}
`,He=class extends Z{constructor(e){super(Ve,{tDiffuse:new h(null),tFluid:new h(null),uIntensity:new h(1),uTime:new h(0),uVibrance:new h(0),uColor:new h(new d(1,.45,.3)),uColorPrimary:new h(new d),uColorSecondary:new h(new d),uColorHighlight:new h(new d),uUsePalette:new h(0)}),this.fluid=e}fluid;intensity=1;time=0;vibrance=0;customColors=!1;color=new d(1,.45,.3);colors=[new d(`#ff6b9d`),new d(`#ff6b9d`),new d(`#ff6b9d`)];updateUniforms(e){let t=this.material.uniforms;t.tDiffuse.value=e.texture,t.tFluid.value=this.fluid.densityTexture,t.uIntensity.value=this.intensity,t.uTime.value=this.time,t.uVibrance.value=this.vibrance,t.uColor.value=this.color,t.uColorPrimary.value=this.colors[0],t.uColorSecondary.value=this.colors[1],t.uColorHighlight.value=this.colors[2],t.uUsePalette.value=+!!this.customColors}},Q=`
precision highp float;
varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform sampler2D tDye;
uniform float uIntensity;
uniform vec2 uTexel;
uniform vec3 uColor;

void main() {
  vec3 scene = texture2D(tDiffuse, vUv).rgb;

  vec3 dye = texture2D(tDye, vUv).rgb * 0.5;
  dye += texture2D(tDye, vUv + uTexel * vec2( 1.0,  1.0)).rgb * 0.125;
  dye += texture2D(tDye, vUv + uTexel * vec2(-1.0,  1.0)).rgb * 0.125;
  dye += texture2D(tDye, vUv + uTexel * vec2( 1.0, -1.0)).rgb * 0.125;
  dye += texture2D(tDye, vUv + uTexel * vec2(-1.0, -1.0)).rgb * 0.125;

  float density = clamp(length(dye) * uIntensity * 3.0, 0.0, 0.95);
  vec3 smokeColor = uColor;
  gl_FragColor = vec4(mix(scene, smokeColor, density), 1.0);
}
`,Ue=class extends Z{constructor(e){super(Q,{tDiffuse:new h(null),tDye:new h(null),uIntensity:new h(1),uTexel:new h(new b(1/512,1/512)),uColor:new h(new d(.95,.97,1))}),this.fluid=e}fluid;intensity=1;color=new d(.95,.97,1);updateUniforms(e){let t=this.material.uniforms;t.tDiffuse.value=e.texture,t.tDye.value=this.fluid.dyeTexture,t.uIntensity.value=this.intensity,t.uColor.value=this.color;let n=this.fluid.dyeTexture.image;t.uTexel.value.set(1/n.width,1/n.height)}},We=`
precision highp float;
varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform sampler2D tDye;
uniform float uIntensity;
uniform vec2 uTexel;
uniform float uVibrance;

vec3 vibrant(vec3 c, float v) {
  float lum = dot(c, vec3(0.299, 0.587, 0.114));
  return clamp(mix(vec3(lum), c, 1.0 + v), 0.0, 1.0);
}

void main() {
  vec3 scene = texture2D(tDiffuse, vUv).rgb;

  vec3 dye = texture2D(tDye, vUv).rgb * 0.5;
  dye += texture2D(tDye, vUv + uTexel * vec2( 1.0,  1.0)).rgb * 0.125;
  dye += texture2D(tDye, vUv + uTexel * vec2(-1.0,  1.0)).rgb * 0.125;
  dye += texture2D(tDye, vUv + uTexel * vec2( 1.0, -1.0)).rgb * 0.125;
  dye += texture2D(tDye, vUv + uTexel * vec2(-1.0, -1.0)).rgb * 0.125;

  // 笔划颜色以约 0.3 的幅度存储（参见 attachPointerSplats）。
  // 3.0 的增益将其恢复为鲜艳、饱和的效果。
  // 饱和度增强在单位幅度空间中进行：提取方向、增强后再缩放，
  // 从而保持幅度（即 alpha 贡献）不变。
  float dyeAmp = length(dye);
  vec3 dyeBoosted = dyeAmp > 1e-5
    ? vibrant(dye / dyeAmp, uVibrance) * dyeAmp
    : dye;
  vec3 result = scene + dyeBoosted * uIntensity * 3.0;
  gl_FragColor = vec4(result, 1.0);
}
`,Ge=class extends Z{constructor(e){super(We,{tDiffuse:new h(null),tDye:new h(null),uIntensity:new h(1),uTexel:new h(new b(1/512,1/512)),uVibrance:new h(0)}),this.fluid=e}fluid;intensity=1;vibrance=0;updateUniforms(e){let t=this.material.uniforms;t.tDiffuse.value=e.texture,t.tDye.value=this.fluid.dyeTexture,t.uIntensity.value=this.intensity,t.uVibrance.value=this.vibrance;let n=this.fluid.dyeTexture.image;t.uTexel.value.set(1/n.width,1/n.height)}},Ke=`
precision highp float;
varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform sampler2D tDye;
uniform float uIntensity;
uniform vec2 uTexel;
uniform float uVibrance;
uniform vec3 uPalette0;
uniform vec3 uPalette1;
uniform vec3 uPalette2;
uniform vec3 uPalette3;
uniform float uUsePalette;

vec3 vibrant(vec3 c, float v) {
  float lum = dot(c, vec3(0.299, 0.587, 0.114));
  return clamp(mix(vec3(lum), c, 1.0 + v), 0.0, 1.0);
}

vec3 rgb2hsv(vec3 c) {
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
  float d = q.x - min(q.w, q.y);
  float e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 palette(float t) {
  t = fract(t);
  if (t < 0.3333) return mix(uPalette0, uPalette1, t * 3.0);
  if (t < 0.6666) return mix(uPalette1, uPalette2, (t - 0.3333) * 3.0);
  return mix(uPalette2, uPalette3, (t - 0.6666) * 3.0);
}

void main() {
  vec3 scene = texture2D(tDiffuse, vUv).rgb;

  vec3 dye = texture2D(tDye, vUv).rgb * 0.5;
  dye += texture2D(tDye, vUv + uTexel * vec2( 1.0,  1.0)).rgb * 0.125;
  dye += texture2D(tDye, vUv + uTexel * vec2(-1.0,  1.0)).rgb * 0.125;
  dye += texture2D(tDye, vUv + uTexel * vec2( 1.0, -1.0)).rgb * 0.125;
  dye += texture2D(tDye, vUv + uTexel * vec2(-1.0, -1.0)).rgb * 0.125;

  float amp = length(dye);
  if (amp < 1e-4) {
    gl_FragColor = vec4(scene, 1.0);
    return;
  }

  float baseHue = rgb2hsv(dye / amp).x;
  float depth = pow(clamp(amp * 2.5, 0.0, 1.0), 0.7);

  float shiftMag = 0.32 + sin(baseHue * 6.28318 * 3.0) * 0.13;
  float hue = fract(baseHue + (1.0 - depth) * shiftMag);
  float sat = mix(0.75, 1.0, depth);

  vec3 original = vibrant(hsv2rgb(vec3(hue, sat, 1.0)), uVibrance);
  vec3 col = mix(original, vibrant(palette(hue), uVibrance), uUsePalette);
  vec3 result = scene + col * depth * uIntensity * 1.2;
  gl_FragColor = vec4(result, 1.0);
}
`,qe=class extends Z{constructor(e){super(Ke,{tDiffuse:new h(null),tDye:new h(null),uIntensity:new h(1),uTexel:new h(new b(1/512,1/512)),uVibrance:new h(0),uPalette0:new h(new d),uPalette1:new h(new d),uPalette2:new h(new d),uPalette3:new h(new d),uUsePalette:new h(0)}),this.fluid=e}fluid;intensity=1;vibrance=0;customColors=!1;colors=[new d(`#ffffff`),new d(`#ffffff`),new d(`#ffffff`),new d(`#ffffff`)];updateUniforms(e){let t=this.material.uniforms;t.tDiffuse.value=e.texture,t.tDye.value=this.fluid.dyeTexture,t.uIntensity.value=this.intensity,t.uVibrance.value=this.vibrance,this.colors.forEach((e,n)=>{t[`uPalette${n}`].value=e}),t.uUsePalette.value=+!!this.customColors;let n=this.fluid.dyeTexture.image;t.uTexel.value.set(1/n.width,1/n.height)}},Je=`
precision highp float;
varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform sampler2D tDye;
uniform float uIntensity;
uniform vec2 uTexel;
uniform float uVibrance;
uniform vec3 uColor;
uniform vec3 uColorPrimary;
uniform vec3 uColorSecondary;
uniform vec3 uColorHighlight;
uniform float uUsePalette;

vec3 vibrant(vec3 c, float v) {
  float lum = dot(c, vec3(0.299, 0.587, 0.114));
  return clamp(mix(vec3(lum), c, 1.0 + v), 0.0, 1.0);
}

void main() {
  vec3 scene = texture2D(tDiffuse, vUv).rgb;

  vec3 dye = texture2D(tDye, vUv).rgb * 0.5;
  dye += texture2D(tDye, vUv + uTexel * vec2( 1.0,  1.0)).rgb * 0.125;
  dye += texture2D(tDye, vUv + uTexel * vec2(-1.0,  1.0)).rgb * 0.125;
  dye += texture2D(tDye, vUv + uTexel * vec2( 1.0, -1.0)).rgb * 0.125;
  dye += texture2D(tDye, vUv + uTexel * vec2(-1.0, -1.0)).rgb * 0.125;

  float density = length(dye);
  vec3 originalHue = density > 1e-4 ? vibrant(mix(dye / density, uColor, 0.65), uVibrance) : uColor;
  vec3 dyeColor = density > 1e-4 ? dye / density : uColorPrimary;
  vec3 hue = mix(uColorPrimary, uColorSecondary, clamp(dyeColor.g, 0.0, 1.0));
  hue = mix(hue, uColorHighlight, clamp(dyeColor.b * 0.7, 0.0, 1.0));
  hue = vibrant(hue, uVibrance);
  hue = mix(originalHue, hue, uUsePalette);
  float alpha = (1.0 - exp(-density * uIntensity * 3.0)) * 0.72;

  vec3 wash = mix(scene, hue * 1.1, alpha);
  vec3 result = wash + scene * hue * alpha * 0.35;
  gl_FragColor = vec4(result, 1.0);
}
`,Ye=class extends Z{constructor(e){super(Je,{tDiffuse:new h(null),tDye:new h(null),uIntensity:new h(1),uTexel:new h(new b(1/512,1/512)),uVibrance:new h(0),uColor:new h(new d(.25,.75,1)),uColorPrimary:new h(new d),uColorSecondary:new h(new d),uColorHighlight:new h(new d),uUsePalette:new h(0)}),this.fluid=e}fluid;intensity=1;vibrance=0;customColors=!1;color=new d(.25,.75,1);colors=[new d(`#5bc0eb`),new d(`#5bc0eb`),new d(`#5bc0eb`)];updateUniforms(e){let t=this.material.uniforms;t.tDiffuse.value=e.texture,t.tDye.value=this.fluid.dyeTexture,t.uIntensity.value=this.intensity,t.uVibrance.value=this.vibrance,t.uColor.value=this.color,t.uColorPrimary.value=this.colors[0],t.uColorSecondary.value=this.colors[1],t.uColorHighlight.value=this.colors[2],t.uUsePalette.value=+!!this.customColors;let n=this.fluid.dyeTexture.image;t.uTexel.value.set(1/n.width,1/n.height)}},$={reveal:0,color:1,pixelate:2},Xe=class extends a{constructor(e){super({depthWrite:!1,uniforms:{tBackground:{value:e.background},tDensity:{value:e.densityTexture??null},tVelocity:{value:e.velocityTexture??null},uMode:{value:$[e.mode??`reveal`]},uStrength:{value:e.strength??1},uEdgeStrength:{value:e.edgeStrength??.016},uPixelSize:{value:e.pixelSize??22},uEnabled:{value:e.enabled??!0},uResolution:{value:new b(1,1)}},vertexShader:`varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position,1.0); }`,fragmentShader:`
        varying vec2 vUv;
        uniform sampler2D tBackground, tDensity, tVelocity;
        uniform float uMode, uStrength, uEdgeStrength, uPixelSize; uniform bool uEnabled;
        uniform vec2 uResolution;
        void main(){
          if (!uEnabled) { gl_FragColor = texture2D(tBackground, vUv); return; }
          vec2 velocity = texture2D(tVelocity, vUv).rg;
          vec2 fluidUv = clamp(vUv - velocity * uEdgeStrength, 0.0, 1.0);
          float density = texture2D(tDensity, fluidUv).b;
          float mask = smoothstep(0.012, 0.28, density) * uStrength;
          vec4 image = texture2D(tBackground, vUv);
          if (uMode < .5) image.rgb = mix(image.rgb * .1, image.rgb, mask);
          else if (uMode < 1.5) image.rgb = mix(vec3(dot(image.rgb, vec3(.299,.587,.114))), image.rgb, mask);
          else {
            vec2 blocks = max(vec2(1.0), uResolution / uPixelSize);
            vec4 pixelated = texture2D(tBackground, floor(vUv * blocks) / blocks);
            image.rgb = mix(pixelated.rgb, image.rgb, mask);
          }
          gl_FragColor = image;
        }`})}setFluidTextures(e,t){return this.uniforms.tDensity.value=e,this.uniforms.tVelocity.value=t,this}setSize(e,t){return this.uniforms.uResolution.value.set(e,t),this}setMode(e){return this.uniforms.uMode.value=$[e],this}setEnabled(e){return this.uniforms.uEnabled.value=e,this}};export{Me as a,Ge as c,z as d,Xe as f,Ye as i,qe as l,Pe as m,De as n,Ie as o,He as p,Be as r,Ae as s,Re as t,Ue as u};