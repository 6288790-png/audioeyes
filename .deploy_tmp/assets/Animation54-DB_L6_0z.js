import{a as e}from"./lil-gui.esm-jlbWO7FJ.js";import{B as t,Bt as n,E as r,Ft as i,Gt as a,Ht as o,Jn as s,Qt as c,Tt as l,Wt as u,_t as d,c as f,g as p,kr as m,l as h,qn as g,r as _,u as v,wr as y,zt as b}from"./three.module-CgISyWQV.js";import{i as x,n as S,r as C,t as w}from"./OutputPass-D9GSoAm2.js";import{t as T}from"./UnrealBloomPass-1z79deN3.js";import{i as E,n as D,r as O,t as k}from"./GUIHelper-DspWBXk2.js";import{t as A}from"./OrbitControls-DVnblHSy.js";var j=class{constructor(e,t={}){this.canvas=e,this.SIM_SIZE=256,this.PARTICLE_COUNT=this.SIM_SIZE*this.SIM_SIZE,this.TIME_STEP=.016,this.TRAIL_LENGTH=6,this.PRESSURE_ITERATIONS=4,this.COLOR_PRESETS=[3526655,16725718,16763972,16777215,16729190,4521864,11167487,16746564,6741503,16737962],this.COLOR_NAMES=[`青蓝`,`洋红`,`金色`,`白色`,`烈焰红`,`翡翠绿`,`紫晶`,`暖橙`,`天蓝`,`粉红`],this.INK_NAMES=[`✦ 青蓝能量`,`✦ 洋红墨水`,`✦ 金色等离子`],this.MODE_NAMES=[`✦ 无限流`,`✧ 球体`,`❋ 花朵`,`✦ 波浪`,`✦ 爆炸`];let n={simSize:256,particleSize:1,particleBrightness:.6,particleEnergy:.26,particleOpacity:.32,bloomStrength:.23,bloomRadius:.1,bloomThreshold:.5,beatExposure:.1,flowStrength:.54,fluidSpeed:.5,vorticityStrength:1.48,densityInjection:.2,densityDecay:.98,densityVolume:.15,volumeDensity:.03,volumeEnergy:.4,autoCamera:!0,vjMode:!0,vjShake:.06,cameraRadius:5.3,cameraSpeed:.5,cameraHeight:9.6,colorR:.035601,colorG:.62396,colorB:1,hue:0,audioReactive:!0,flowResponse:.6,kickInjection:.8,bassBreathe:.5,energyAtmosphere:.6,beatSensitivity:1,morphSensitivity:.5,morphFlipThreshold:.3};this.settings={...n,...t},this.defaultSettings=n,this.scene=null,this.camera=null,this.renderer=null,this.controls=null,this.composer=null,this.bloomPass=null,this.cinematicPass=null,this.positionRT_A=null,this.positionRT_B=null,this.velocityRT_A=null,this.velocityRT_B=null,this.densityRT_A=null,this.densityRT_B=null,this.vorticityRT=null,this.divergenceRT=null,this.pressureA=null,this.pressureB=null,this.trailTargets=[],this.gpuScene=null,this.gpuCamera=null,this.gpuQuad=null,this.vorticityMat=null,this.fluidForceMat=null,this.advectionMat=null,this.divergenceMat=null,this.pressureMat=null,this.projectionMat=null,this.densityMat=null,this.positionUpdateMat=null,this.particleMat=null,this.volumeMat=null,this.densityVolumeMat=null,this.trailCopyMat=null,this.zeroMat=null,this.particleSystem=null,this.trailSystem=null,this.volumeMesh=null,this.densityVolume=null,this.stars=null,this.targetTexture=null,this.morphValue=0,this.morphDirection=1,this.prevBeatHigh=!1,this.sculptMode=0,this.inkMode=0,this.colorPresetIdx=0,this.bass=0,this.energy=0,this.motion=0,this.kick=0,this.beat=0,this.gui=null,this.guiContainer=null,this.guiVisible=!1,this.settingsButton=null,this.lastTime=0,this.frameCount=0,this.lastFpsTime=0,this.fpsDisplay=60,this.fpsSkipMode=0,this.frameSkip=0,this.initialized=!1,this.hasAudioData=!1,this._time=0,this._isReady=!1,this.inkSwitchTimer=0,this.morphSwitchTimer=0,this.colorSwitchTimer=0,this.init().then(()=>{this._isReady=!0}).catch(e=>{console.error(`❌ Animation54 初始化失败:`,e)})}async init(){try{return this.setupThreeJS(),this.createSimulation(),this.setupPostProcessing(),this.setupGUI(),this.setupSettingsButton(),this.initialized=!0,console.log(`✅ Animation54 初始化成功`),!0}catch(e){throw console.error(`❌ Animation54 初始化失败:`,e),e}}setupThreeJS(){this.scene=new g,this.camera=new n(60,window.innerWidth/window.innerHeight,.1,100),this.camera.position.set(-5.327,9.648,-.112),this.renderer=new _({canvas:this.canvas,antialias:!0,powerPreference:`high-performance`,alpha:!0}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.outputColorSpace=d,this.renderer.toneMapping=4,this.renderer.toneMappingExposure=1.35,this.canvas.style.backgroundColor=`transparent`,this.canvas.style.zIndex=`1`,this.controls=new A(this.camera,this.canvas),this.controls.enableDamping=!0,this.controls.dampingFactor=.08,this.controls.target.set(0,0,0),this.controls.autoRotate=!1}setupPostProcessing(){this.composer=new C(this.renderer),this.composer.addPass(new S(this.scene,this.camera)),this.bloomPass=new T(new y(window.innerWidth,window.innerHeight),this.settings.bloomStrength,this.settings.bloomRadius,this.settings.bloomThreshold),this.composer.addPass(this.bloomPass),this.createCinematicPass(),this.composer.addPass(new w)}createCinematicPass(){let e={uniforms:{tDiffuse:{value:null},time:{value:0},aberration:{value:.002},vignette:{value:.35},bass:{value:0},beat:{value:0}},vertexShader:`
                varying vec2 vUv;
                void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
            `,fragmentShader:`
                precision highp float;
                uniform sampler2D tDiffuse;
                uniform float time;
                uniform float aberration;
                uniform float vignette;
                uniform float bass;
                uniform float beat;
                varying vec2 vUv;
                void main() {
                    vec2 uv = vUv;
                    float shift = aberration * (0.5 + sin(time * 0.7) * 0.5 + beat * 0.3);
                    vec4 sampleR = texture(tDiffuse, uv + vec2(shift, 0.0));
                    vec4 sampleG = texture(tDiffuse, uv + vec2(shift * 0.3, shift * 0.1));
                    vec4 sampleB = texture(tDiffuse, uv - vec2(shift, 0.0));
                    vec3 color = vec3(sampleR.r, sampleG.g, sampleB.b);
                    float alpha = max(sampleR.a, max(sampleG.a, sampleB.a));
                    float d = distance(uv, vec2(0.5));
                    float vig = smoothstep(0.8, 0.2, d);
                    color *= mix(1.0, vig, vignette + bass * 0.1);
                    color = color / (color + vec3(0.15));
                    vec3 shadowTint = vec3(0.05, 0.08, 0.15);
                    vec3 highlightTint = vec3(1.0, 0.85, 0.7);
                    float lum = dot(color, vec3(0.299, 0.587, 0.114));
                    color += shadowTint * (1.0 - lum) * 0.1;
                    color *= mix(vec3(1.0), highlightTint, lum * 0.15);
                    color *= (1.0 + beat * 0.15);
                    gl_FragColor = vec4(color, alpha);
                }
            `};this.cinematicPass=new x(e),this.composer.addPass(this.cinematicPass)}createRT(){return new m(this.SIM_SIZE,this.SIM_SIZE,{format:c,type:t,minFilter:i,magFilter:i,depthBuffer:!1,stencilBuffer:!1})}renderToTarget(e,t){this.gpuQuad.material=e,this.renderer.setRenderTarget(t),this.renderer.render(this.gpuScene,this.gpuCamera),this.renderer.setRenderTarget(null)}createSimTextures(){let e=this.SIM_SIZE*this.SIM_SIZE,n=new Float32Array(e*4),i=new Float32Array(e*4),a=new Float32Array(e*4);for(let t=0;t<e;t++){let e=Math.random()**.5*2.5,r=Math.random()*Math.PI*2,o=Math.acos(2*Math.random()-1);n[t*4]=Math.sin(o)*Math.cos(r)*e,n[t*4+1]=Math.sin(o)*Math.sin(r)*e,n[t*4+2]=Math.cos(o)*e,n[t*4+3]=1,i[t*4]=(Math.random()-.5)*.02,i[t*4+1]=(Math.random()-.5)*.02,i[t*4+2]=(Math.random()-.5)*.02,i[t*4+3]=1;let s=Math.sqrt(n[t*4]*n[t*4]+n[t*4+1]*n[t*4+1]+n[t*4+2]*n[t*4+2]),c=Math.exp(-s*.5)*.5+.1;a[t*4]=c,a[t*4+1]=c*.3,a[t*4+2]=c*.8,a[t*4+3]=1}let o=new r(n,this.SIM_SIZE,this.SIM_SIZE,c,t),s=new r(i,this.SIM_SIZE,this.SIM_SIZE,c,t),l=new r(a,this.SIM_SIZE,this.SIM_SIZE,c,t);return o.needsUpdate=!0,s.needsUpdate=!0,l.needsUpdate=!0,{posTex:o,velTex:s,densTex:l}}createSimulation(){this.gpuScene=new g,this.gpuCamera=new b(-1,1,1,-1,0,1),this.gpuQuad=new l(new o(2,2)),this.gpuScene.add(this.gpuQuad),this.positionRT_A=this.createRT(),this.positionRT_B=this.createRT(),this.velocityRT_A=this.createRT(),this.velocityRT_B=this.createRT(),this.densityRT_A=this.createRT(),this.densityRT_B=this.createRT(),this.vorticityRT=this.createRT(),this.divergenceRT=this.createRT(),this.pressureA=this.createRT(),this.pressureB=this.createRT();for(let e=0;e<this.TRAIL_LENGTH;e++)this.trailTargets.push(this.createRT());this.simTex=this.createSimTextures(),this.initGPUState(),this.createShaderMaterials(),this.createPositionUpdate(),this.createTrailSystem(),this.targetTexture=this.createMorphTarget(0),this.buildParticles(),this.createVolumeAtmosphere(),this.createDensityVolume(),this.createStars()}initGPUState(){let e=new s({name:`InitCopy`,uniforms:{sourceTex:{value:null}},vertexShader:`
                varying vec2 vUv;
                void main() {
                    vUv = position.xy * 0.5 + 0.5;
                    gl_Position = vec4(position, 1.0);
                }
            `,fragmentShader:`
                precision highp float;
                uniform sampler2D sourceTex;
                varying vec2 vUv;
                void main() {
                    vec2 uv = vUv;
                    gl_FragColor = texture(sourceTex, uv);
                }
            `});e.uniforms.sourceTex.value=this.simTex.posTex,this.renderToTarget(e,this.positionRT_A),e.uniforms.sourceTex.value=this.simTex.velTex,this.renderToTarget(e,this.velocityRT_A),e.uniforms.sourceTex.value=this.simTex.densTex,this.renderToTarget(e,this.densityRT_A),this.renderToTarget(e,this.vorticityRT),this.renderToTarget(e,this.divergenceRT),this.renderToTarget(e,this.pressureA),this.renderToTarget(e,this.pressureB);for(let t of this.trailTargets)this.renderToTarget(e,t)}createShaderMaterials(){let e=1/this.SIM_SIZE;this.vorticityMat=new s({name:`Vorticity`,uniforms:{velocityTex:{value:this.velocityRT_A.texture},uPixelSize:{value:e}},vertexShader:`
                varying vec2 vUv;
                void main() {
                    vUv = position.xy * 0.5 + 0.5;
                    gl_Position = vec4(position, 1.0);
                }
            `,fragmentShader:`
                precision highp float;
                uniform sampler2D velocityTex;
                uniform float uPixelSize;
                varying vec2 vUv;
                void main() {
                    vec2 uv = vUv;
                    vec2 px = vec2(uPixelSize);
                    vec3 vL = texture(velocityTex, uv - vec2(px.x, 0.0)).xyz;
                    vec3 vR = texture(velocityTex, uv + vec2(px.x, 0.0)).xyz;
                    vec3 vD = texture(velocityTex, uv - vec2(0.0, px.y)).xyz;
                    vec3 vU = texture(velocityTex, uv + vec2(0.0, px.y)).xyz;
                    float curl = (vR.y - vL.y) - (vU.x - vD.x);
                    gl_FragColor = vec4(curl, 0.0, 0.0, 1.0);
                }
            `}),this.fluidForceMat=new s({name:`FluidForce`,uniforms:{velocityTex:{value:this.velocityRT_A.texture},vorticityTex:{value:this.vorticityRT.texture},strength:{value:.6},time:{value:0},motion:{value:0},uPixelSize:{value:e}},vertexShader:`
                varying vec2 vUv;
                void main() {
                    vUv = position.xy * 0.5 + 0.5;
                    gl_Position = vec4(position, 1.0);
                }
            `,fragmentShader:`
                precision highp float;
                uniform sampler2D velocityTex;
                uniform sampler2D vorticityTex;
                uniform float strength;
                uniform float time;
                uniform float motion;
                uniform float uPixelSize;
                varying vec2 vUv;
                void main() {
                    vec2 uv = vUv;
                    vec2 px = vec2(uPixelSize);
                    float cx = vUv.x / uPixelSize;
                    float cy = vUv.y / uPixelSize;
                    vec3 vel = texture(velocityTex, uv).xyz;
                    float vort = texture(vorticityTex, uv).x;
                    float vL = texture(vorticityTex, uv - vec2(px.x, 0.0)).x;
                    float vR = texture(vorticityTex, uv + vec2(px.x, 0.0)).x;
                    float vD = texture(vorticityTex, uv - vec2(0.0, px.y)).x;
                    float vU = texture(vorticityTex, uv + vec2(0.0, px.y)).x;
                    vec2 gradVort = vec2(vR - vL, vU - vD) * 0.5;
                    vec3 force = vec3(gradVort.y * vort * 0.5, -gradVort.x * vort * 0.5, 0.0);
                    // 流场力度由单一特征 animation.motion 驱动（引擎已平滑）
                    float audioBoost = 1.0 + motion * 1.5;
                    vel += force * strength * audioBoost * 0.02;
                    float turb = 0.001 + motion * 0.004;
                    vel += vec3(
                        sin(cx * 0.1 + time * 0.5) * turb,
                        cos(cy * 0.1 + time * 0.4) * turb,
                        sin((cx + cy) * 0.05 + time * 0.3) * turb
                    );
                    float speed = length(vel);
                    float maxSpeed = 0.06 * (1.0 + motion * 0.5);
                    if (speed > maxSpeed) vel = normalize(vel) * maxSpeed;
                    gl_FragColor = vec4(vel, 1.0);
                }
            `}),this.advectionMat=new s({name:`Advection`,uniforms:{velocityTex:{value:this.velocityRT_A.texture},dt:{value:.016}},vertexShader:`
                varying vec2 vUv;
                void main() {
                    vUv = position.xy * 0.5 + 0.5;
                    gl_Position = vec4(position, 1.0);
                }
            `,fragmentShader:`
                precision highp float;
                uniform sampler2D velocityTex;
                uniform float dt;
                varying vec2 vUv;
                void main() {
                    vec2 uv = vUv;
                    vec3 vel = texture(velocityTex, uv).xyz;
                    vec2 backUV = uv - vel.xy * dt * 0.05;
                    backUV = clamp(backUV, 0.0, 1.0);
                    gl_FragColor = vec4(texture(velocityTex, backUV).xyz, 1.0);
                }
            `}),this.divergenceMat=new s({name:`Divergence`,uniforms:{velocityTex:{value:this.velocityRT_A.texture},uPixelSize:{value:e}},vertexShader:`
                varying vec2 vUv;
                void main() {
                    vUv = position.xy * 0.5 + 0.5;
                    gl_Position = vec4(position, 1.0);
                }
            `,fragmentShader:`
                precision highp float;
                uniform sampler2D velocityTex;
                uniform float uPixelSize;
                varying vec2 vUv;
                void main() {
                    vec2 uv = vUv;
                    float px = uPixelSize;
                    float L = texture(velocityTex, uv - vec2(px, 0.0)).x;
                    float R = texture(velocityTex, uv + vec2(px, 0.0)).x;
                    float B = texture(velocityTex, uv - vec2(0.0, px)).y;
                    float T = texture(velocityTex, uv + vec2(0.0, px)).y;
                    gl_FragColor = vec4(0.5 * (R - L + T - B), 0, 0, 1);
                }
            `}),this.pressureMat=new s({name:`Pressure`,uniforms:{pressureTex:{value:null},divergenceTex:{value:null},uPixelSize:{value:e}},vertexShader:`
                varying vec2 vUv;
                void main() {
                    vUv = position.xy * 0.5 + 0.5;
                    gl_Position = vec4(position, 1.0);
                }
            `,fragmentShader:`
                precision highp float;
                uniform sampler2D pressureTex;
                uniform sampler2D divergenceTex;
                uniform float uPixelSize;
                varying vec2 vUv;
                void main() {
                    vec2 uv = vUv;
                    float px = uPixelSize;
                    float L = texture(pressureTex, uv - vec2(px, 0.0)).x;
                    float R = texture(pressureTex, uv + vec2(px, 0.0)).x;
                    float B = texture(pressureTex, uv - vec2(0.0, px)).x;
                    float T = texture(pressureTex, uv + vec2(0.0, px)).x;
                    float div = texture(divergenceTex, uv).x;
                    gl_FragColor = vec4((L + R + B + T - div) * 0.25, 0, 0, 1);
                }
            `}),this.projectionMat=new s({name:`Projection`,uniforms:{velocityTex:{value:null},pressureTex:{value:null},uPixelSize:{value:e}},vertexShader:`
                varying vec2 vUv;
                void main() {
                    vUv = position.xy * 0.5 + 0.5;
                    gl_Position = vec4(position, 1.0);
                }
            `,fragmentShader:`
                precision highp float;
                uniform sampler2D velocityTex;
                uniform sampler2D pressureTex;
                uniform float uPixelSize;
                varying vec2 vUv;
                void main() {
                    vec2 uv = vUv;
                    float px = uPixelSize;
                    vec3 vel = texture(velocityTex, uv).xyz;
                    float L = texture(pressureTex, uv - vec2(px, 0.0)).x;
                    float R = texture(pressureTex, uv + vec2(px, 0.0)).x;
                    float B = texture(pressureTex, uv - vec2(0.0, px)).x;
                    float T = texture(pressureTex, uv + vec2(0.0, px)).x;
                    vel.xy -= 0.5 * vec2(R - L, T - B);
                    gl_FragColor = vec4(vel, 1.0);
                }
            `}),this.densityMat=new s({name:`Density`,uniforms:{densityTex:{value:this.densityRT_A.texture},velocityTex:{value:this.velocityRT_A.texture},time:{value:0},audio:{value:0},inkMode:{value:0},injection:{value:.003},decay:{value:.997}},vertexShader:`
                varying vec2 vUv;
                void main() {
                    vUv = position.xy * 0.5 + 0.5;
                    gl_Position = vec4(position, 1.0);
                }
            `,fragmentShader:`
                precision highp float;
                uniform sampler2D densityTex;
                uniform sampler2D velocityTex;
                uniform float time;
                uniform float audio;
                uniform float inkMode;
                uniform float injection;
                uniform float decay;
                varying vec2 vUv;
                void main() {
                    vec2 uv = vUv;
                    vec4 density = texture(densityTex, uv);
                    vec3 vel = texture(velocityTex, uv).xyz;
                    vec2 backUV = uv - vel.xy * 0.02;
                    backUV = clamp(backUV, 0.0, 1.0);
                    density = texture(densityTex, backUV);
                    float center = distance(uv, vec2(0.5));
                    float ink = smoothstep(0.3, 0.0, center);
                    vec3 c1 = vec3(0.05, 0.7, 1.0);
                    vec3 c2 = vec3(1.0, 0.1, 0.6);
                    vec3 c3 = vec3(1.0, 0.7, 0.1);
                    vec3 inkColor = mix(mix(c1, c2, step(0.5, inkMode)), c3, step(1.5, inkMode));
                    density.rgb += inkColor * ink * (injection + audio * 0.03);
                    density.rgb *= decay;
                    density.rgb = clamp(density.rgb, 0.0, 2.0);
                    gl_FragColor = density;
                }
            `}),this.trailCopyMat=new s({name:`TrailCopy`,uniforms:{sourceTex:{value:null}},vertexShader:`
                varying vec2 vUv;
                void main() {
                    vUv = position.xy * 0.5 + 0.5;
                    gl_Position = vec4(position, 1.0);
                }
            `,fragmentShader:`
                precision highp float;
                uniform sampler2D sourceTex;
                varying vec2 vUv;
                void main() {
                    vec2 uv = vUv;
                    gl_FragColor = texture(sourceTex, uv);
                }
            `}),this.zeroMat=new s({name:`Zero`,uniforms:{},vertexShader:`void main(){ gl_Position = vec4(position, 1.0); }`,fragmentShader:`precision highp float; void main(){ gl_FragColor = vec4(0,0,0,1); }`})}createPositionUpdate(){this.positionUpdateMat=new s({name:`PosUpdate`,uniforms:{positionTex:{value:this.positionRT_A.texture},velocityTex:{value:this.velocityRT_A.texture},delta:{value:this.TIME_STEP}},vertexShader:`
                varying vec2 vUv;
                void main() {
                    vUv = position.xy * 0.5 + 0.5;
                    gl_Position = vec4(position, 1.0);
                }
            `,fragmentShader:`
                precision highp float;
                uniform sampler2D positionTex;
                uniform sampler2D velocityTex;
                uniform float delta;
                varying vec2 vUv;
                void main() {
                    vec2 uv = vUv;
                    vec3 pos = texture(positionTex, uv).xyz;
                    vec3 vel = texture(velocityTex, uv).xyz;
                    pos += vel * delta * 60.0;
                    float r = length(pos);
                    if (r > 4.5) pos = normalize(pos) * 4.5;
                    pos *= 0.9995;
                    gl_FragColor = vec4(pos, 1.0);
                }
            `})}createMorphTarget(e){let n=new Float32Array(this.PARTICLE_COUNT*4);for(let t=0;t<this.PARTICLE_COUNT;t++){let r=t%this.SIM_SIZE/this.SIM_SIZE,i=Math.floor(t/this.SIM_SIZE)/this.SIM_SIZE,a=r*Math.PI*2,o=i*Math.PI,s,c,l;switch(e){case 0:let e=Math.random()**.5*2.5,t=Math.random()*Math.PI*2,n=Math.acos(2*Math.random()-1);s=Math.sin(n)*Math.cos(t)*e,c=Math.sin(n)*Math.sin(t)*e,l=Math.cos(n)*e;break;case 1:let r=2+Math.sin(a*8)*.1;s=Math.sin(o)*Math.cos(a)*r,c=Math.cos(o)*r,l=Math.sin(o)*Math.sin(a)*r;break;case 2:let i=2*(Math.sin(a*6)*.8+1);s=Math.sin(o)*Math.cos(a)*i,c=Math.cos(o)*1.5,l=Math.sin(o)*Math.sin(a)*i;break;case 3:let u=2.5+Math.sin(a*8+o*4)*.8;s=Math.sin(o)*Math.cos(a)*u,c=Math.cos(o)*u*.8,l=Math.sin(o)*Math.sin(a)*u;break;case 4:let d=.5+Math.random()*3.5,f=Math.random()*Math.PI*2,p=Math.acos(2*Math.random()-1);s=Math.sin(p)*Math.cos(f)*d,c=Math.sin(p)*Math.sin(f)*d*.7,l=Math.cos(p)*d*.8;break;default:s=0,c=0,l=0}n[t*4]=s,n[t*4+1]=c,n[t*4+2]=l,n[t*4+3]=1}let i=new r(n,this.SIM_SIZE,this.SIM_SIZE,c,t);return i.needsUpdate=!0,i}buildParticles(){let e=new v,t=new Float32Array(this.PARTICLE_COUNT*3);for(let e=0;e<this.PARTICLE_COUNT;e++){let n=Math.random()**.5*2.5,r=Math.random()*Math.PI*2,i=Math.acos(2*Math.random()-1);t[e*3]=Math.sin(i)*Math.cos(r)*n,t[e*3+1]=Math.sin(i)*Math.sin(r)*n,t[e*3+2]=Math.cos(i)*n}e.setAttribute(`position`,new h(t,3));let n=new Float32Array(this.PARTICLE_COUNT*2),r=new Float32Array(this.PARTICLE_COUNT);for(let e=0;e<this.PARTICLE_COUNT;e++)n[e*2]=e%this.SIM_SIZE/this.SIM_SIZE,n[e*2+1]=Math.floor(e/this.SIM_SIZE)/this.SIM_SIZE,r[e]=Math.random();e.setAttribute(`particleUV`,new h(n,2)),e.setAttribute(`seed`,new h(r,1)),this.particleMat=new s({name:`Particle`,transparent:!0,depthWrite:!1,blending:2,uniforms:{positionTex:{value:this.positionRT_A.texture},targetTexture:{value:this.targetTexture},morph:{value:0},time:{value:0},energy:{value:1},brightness:{value:1.5},flowColor:{value:new p(3526655)},hue:{value:0},bass:{value:0},beat:{value:0},inkMode:{value:0},sizeScale:{value:1},opacity:{value:1}},vertexShader:`
                precision highp float;
                uniform sampler2D positionTex;
                uniform sampler2D targetTexture;
                uniform float morph;
                uniform float time;
                uniform float energy;
                uniform float bass;
                uniform float beat;
                uniform float sizeScale;
                attribute vec2 particleUV;
                attribute float seed;
                varying float vEnergy;
                varying float vDepth;
                varying float vBeat;
                varying float vBass;
                varying float vMorph;
                varying float vOpacity;
                void main() {
                    vec3 pos = texture(positionTex, particleUV).xyz;
                    vec3 target = texture(targetTexture, particleUV).xyz;
                    // 形状偏转由 bass/beat 即时驱动（低音/鼓点时粒子朝目标形状靠拢，倍率略收敛）
                    float morphAmt = clamp(morph + bass * 0.3 + beat * 0.4, 0.0, 1.0);
                    pos = mix(pos, target, morphAmt);
                    // 呼吸由单一特征 bass 驱动
                    float breathe = 1.0 + sin(time * 1.2 + seed * 30.0) * 0.04 + bass * 0.06;
                    pos *= breathe;
                    float turb = 0.002 + beat * 0.01;
                    pos += vec3(
                        sin(time + seed * 20.0 + bass * 2.0),
                        cos(time * 0.7 + seed * 15.0 + bass * 1.5),
                        sin(time * 0.5 + seed * 10.0 + bass * 1.8)
                    ) * turb;
                    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
                    float dist = max(-mv.z, 1.0);
                    gl_PointSize = (8.0 / dist) * (1.0 + energy * 0.8 + bass * 1.5) * sizeScale;
                    vDepth = clamp(1.0 - dist / 12.0, 0.0, 1.0);
                    vEnergy = energy + bass * 0.5;
                    vBeat = beat;
                    vBass = bass;
                    vMorph = morphAmt;
                    vOpacity = 1.0;
                    gl_Position = projectionMatrix * mv;
                }
            `,fragmentShader:`
                precision highp float;
                uniform float brightness;
                uniform vec3 flowColor;
                uniform float hue;
                uniform float bass;
                uniform float beat;
                uniform float inkMode;
                uniform float opacity;
                varying float vEnergy;
                varying float vDepth;
                varying float vBeat;
                varying float vBass;
                varying float vMorph;
                varying float vOpacity;
                vec3 hueRotate(vec3 col, float hue) {
                    float a = hue * 6.28318;
                    float s = sin(a);
                    float c = cos(a);
                    mat3 rot = mat3(
                        c + (1.0 - c) / 3.0,           (1.0 - c) / 3.0 - s * 0.57735, (1.0 - c) / 3.0 + s * 0.57735,
                        (1.0 - c) / 3.0 + s * 0.57735, c + (1.0 - c) / 3.0,           (1.0 - c) / 3.0 - s * 0.57735,
                        (1.0 - c) / 3.0 - s * 0.57735, (1.0 - c) / 3.0 + s * 0.57735, c + (1.0 - c) / 3.0
                    );
                    return rot * col;
                }
                void main() {
                    float d = length(gl_PointCoord - 0.5);
                    float core = smoothstep(0.5, 0.0, d);
                    if (core <= 0.0) discard;
                    float edge = pow(1.0 - core, 3.0);
                    vec3 color = flowColor;
                    float brightVal = brightness * (1.0 + bass * 0.3 + beat * 0.5);
                    color *= brightVal;
                    color = hueRotate(color, hue);
                    color += vec3(1.0) * core * 0.06;
                    color += color * edge * 0.12;
                    float alpha = core * (0.35 + vEnergy * 0.45) * vDepth * opacity;
                    gl_FragColor = vec4(color, alpha);
                }
            `}),this.particleSystem=new u(e,this.particleMat),this.particleSystem.frustumCulled=!1,this.scene.add(this.particleSystem)}createTrailSystem(){let e=this.PARTICLE_COUNT*this.TRAIL_LENGTH,t=new Float32Array(e*2),n=new Float32Array(e),r=0;for(let e=0;e<this.TRAIL_LENGTH;e++)for(let i=0;i<this.PARTICLE_COUNT;i++)t[r*2]=i%this.SIM_SIZE/this.SIM_SIZE,t[r*2+1]=Math.floor(i/this.SIM_SIZE)/this.SIM_SIZE,n[r]=e,r++;let i=new v;i.setAttribute(`particleUV`,new h(t,2)),i.setAttribute(`trailIndex`,new h(n,1));let a={};for(let e=0;e<this.TRAIL_LENGTH;e++)a[`history${e}`]={value:this.trailTargets[e].texture};let o=new s({name:`Trail`,transparent:!0,depthWrite:!1,blending:2,uniforms:{...a,time:{value:0},bass:{value:0}},vertexShader:`
                precision highp float;
                attribute vec2 particleUV;
                attribute float trailIndex;
                ${Array.from({length:this.TRAIL_LENGTH},(e,t)=>`uniform sampler2D history${t};`).join(`
`)}
                uniform float bass;
                varying float alpha;
                varying float vBass;
                vec3 getPos(float id, vec2 uv) {
                    ${Array.from({length:this.TRAIL_LENGTH},(e,t)=>`if (id < ${t+.5}) return texture(history${t}, uv).xyz;`).join(`
`)}
                    return texture(history${this.TRAIL_LENGTH-1}, uv).xyz;
                }
                void main() {
                    vec3 pos = getPos(trailIndex, particleUV);
                    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = (3.0 + bass * 2.0) / max(1.0, -length(mv.xyz));
                    alpha = 1.0 - trailIndex / ${this.TRAIL_LENGTH}.0;
                    vBass = bass;
                    gl_Position = projectionMatrix * mv;
                }
            `,fragmentShader:`
                precision highp float;
                varying float alpha;
                varying float vBass;
                void main() {
                    float d = length(gl_PointCoord - 0.5);
                    float glow = smoothstep(0.5, 0.0, d);
                    if (glow < 0.01) discard;
                    vec3 color = mix(vec3(0.05, 0.3, 0.8), vec3(0.1, 0.8, 1.0), alpha + vBass * 0.3);
                    gl_FragColor = vec4(color, glow * alpha * (0.3 + vBass * 0.5));
                }
            `});this.trailSystem=new u(i,o),this.trailSystem.frustumCulled=!1,this.scene.add(this.trailSystem)}createVolumeAtmosphere(){this.volumeMat=new s({name:`Volume`,transparent:!0,side:1,depthWrite:!1,blending:2,uniforms:{time:{value:0},density:{value:.06},energy:{value:1},morph:{value:0}},vertexShader:`
                varying vec3 vPos;
                void main() { vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
            `,fragmentShader:`
                precision highp float;
                uniform float time;
                uniform float density;
                uniform float energy;
                uniform float morph;
                varying vec3 vPos;
                float hash(vec3 p) { return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453); }
                float noise(vec3 p) {
                    vec3 i = floor(p), f = fract(p);
                    f = f*f*(3.0-2.0*f);
                    return mix(mix(mix(hash(i), hash(i+vec3(1,0,0)), f.x),
                                  mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), f.x), f.y),
                              mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), f.x),
                                  mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), f.x), f.y), f.z);
                }
                float fbm(vec3 p) {
                    float v=0., a=0.5, f=1.0;
                    for(int i=0;i<3;i++){ v += a*noise(p*f); f*=2.0; a*=0.5; }
                    return v;
                }
                void main() {
                    vec3 p = vPos * 0.4;
                    // 氛围层由单一特征 energy（AGC 整体音量）驱动，柔和稳定
                    float ts = 0.04 + energy * 0.06;
                    float n = fbm(p + time * ts);
                    float pulse = 1.0 + sin(time * 1.5 + p.x * 2.0 + p.y * 1.5) * 0.15 * (1.0 + morph * 0.3);
                    pulse += energy * 0.3;
                    float cloud = smoothstep(0.45, 0.75, n * pulse);
                    float d = length(vPos);
                    float falloff = 1.0 - smoothstep(1.0, 4.5, d);
                    float ab = 1.0 + energy * 0.6;
                    float alpha = cloud * falloff * density * energy * ab;
                    vec3 c1 = mix(vec3(0.02, 0.3, 0.9), vec3(0.3, 0.1, 0.8), morph * 0.3);
                    vec3 c2 = mix(vec3(0.1, 0.7, 1.0), vec3(1.0, 0.4, 0.8), morph * 0.3);
                    vec3 c3 = vec3(0.8, 0.6, 1.0);
                    vec3 color = mix(c1, c2, n);
                    color = mix(color, c3, energy * 0.3);
                    color += vec3(0.1, 0.5, 1.0) * cloud * 0.3 * (1.0 + energy * 0.5);
                    gl_FragColor = vec4(color, alpha * 0.5);
                }
            `}),this.volumeMesh=new l(new f(8,8,8),this.volumeMat),this.scene.add(this.volumeMesh)}createDensityVolume(){this.densityVolumeMat=new s({name:`DensityVolume`,transparent:!0,side:1,depthWrite:!1,blending:2,uniforms:{densityTex:{value:this.densityRT_A.texture},time:{value:0},inkMode:{value:0},volumeStrength:{value:.15}},vertexShader:`
                varying vec3 pos;
                void main() {
                    pos = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,fragmentShader:`
                precision highp float;
                uniform sampler2D densityTex;
                uniform float time;
                uniform float inkMode;
                uniform float volumeStrength;
                varying vec3 pos;
                void main() {
                    vec2 uv = pos.xy * 0.12 + 0.5;
                    uv = clamp(uv, 0.0, 1.0);
                    vec4 d = texture(densityTex, uv);
                    float glow = pow(d.r, 1.5);
                    float g = pow(d.g, 1.5);
                    vec3 c1 = vec3(0.05, 0.7, 1.0);
                    vec3 c2 = vec3(1.0, 0.1, 0.6);
                    vec3 c3 = vec3(1.0, 0.7, 0.1);
                    vec3 base = mix(mix(c1, c2, step(0.5, inkMode)), c3, step(1.5, inkMode));
                    vec3 color = base * glow * 2.0 + vec3(0.1, 0.5, 1.0) * d.g * 0.5;
                    float alpha = clamp((glow * 0.15 + g * 0.08) * volumeStrength, 0.0, 0.6);
                    gl_FragColor = vec4(color, alpha);
                }
            `}),this.densityVolume=new l(new f(7.5,7.5,7.5),this.densityVolumeMat),this.scene.add(this.densityVolume)}createStars(){let e=new v,t=new Float32Array(3e3);for(let e=0;e<3e3;e++)t[e]=(Math.random()-.5)*150;e.setAttribute(`position`,new h(t,3)),this.stars=new u(e,new a({color:4482815,size:.06,transparent:!0,opacity:.25,blending:2,depthWrite:!1})),this.scene.add(this.stars)}resizeSimulation(e){if(e=Math.max(64,Math.min(512,Math.round(e/8)*8)),e===this.SIM_SIZE)return;console.log(`调整粒子数量: ${this.SIM_SIZE}² → ${e}²`);let t=e=>{e&&(this.scene.remove(e),e.geometry&&e.geometry.dispose(),e.material&&e.material.dispose())};t(this.particleSystem),t(this.trailSystem),t(this.volumeMesh),this.volumeMat=null,t(this.densityVolume),this.densityVolumeMat=null,[this.vorticityMat,this.fluidForceMat,this.advectionMat,this.divergenceMat,this.pressureMat,this.projectionMat,this.densityMat,this.positionUpdateMat,this.trailCopyMat,this.zeroMat].forEach(e=>{e&&e.dispose()}),this.vorticityMat=this.fluidForceMat=this.advectionMat=null,this.divergenceMat=this.pressureMat=this.projectionMat=null,this.densityMat=this.positionUpdateMat=null,this.trailCopyMat=this.zeroMat=null;let n=e=>{e&&e.dispose()};[this.positionRT_A,this.positionRT_B,this.velocityRT_A,this.velocityRT_B,this.densityRT_A,this.densityRT_B,this.vorticityRT,this.divergenceRT,this.pressureA,this.pressureB,...this.trailTargets||[]].forEach(n),this.simTex&&(this.simTex.posTex&&this.simTex.posTex.dispose(),this.simTex.velTex&&this.simTex.velTex.dispose(),this.simTex.densTex&&this.simTex.densTex.dispose()),this.targetTexture&&this.targetTexture.dispose(),this.trailTargets=[],this.simTex=null,this.targetTexture=null,this.SIM_SIZE=e,this.PARTICLE_COUNT=e*e,this.settings.simSize=e,this.createSimulation(),this.gui&&this.gui.controllersRecursive().forEach(e=>e.updateDisplay())}updateTrailHistory(){for(let e=this.TRAIL_LENGTH-1;e>0;e--)this.trailCopyMat.uniforms.sourceTex.value=this.trailTargets[e-1].texture,this.renderToTarget(this.trailCopyMat,this.trailTargets[e]);this.trailCopyMat.uniforms.sourceTex.value=this.positionRT_A.texture,this.renderToTarget(this.trailCopyMat,this.trailTargets[0])}updateNavierStokes(e,t){this.advectionMat.uniforms.velocityTex.value=this.velocityRT_A.texture,this.advectionMat.uniforms.dt.value=t,this.renderToTarget(this.advectionMat,this.velocityRT_B),[this.velocityRT_A,this.velocityRT_B]=[this.velocityRT_B,this.velocityRT_A],this.vorticityMat.uniforms.velocityTex.value=this.velocityRT_A.texture,this.renderToTarget(this.vorticityMat,this.vorticityRT);let n=this.settings.flowStrength+this.motion*this.settings.flowResponse;this.fluidForceMat.uniforms.velocityTex.value=this.velocityRT_A.texture,this.fluidForceMat.uniforms.vorticityTex.value=this.vorticityRT.texture,this.fluidForceMat.uniforms.strength.value=n*this.settings.vorticityStrength,this.fluidForceMat.uniforms.time.value=e,this.fluidForceMat.uniforms.motion.value=this.motion,this.renderToTarget(this.fluidForceMat,this.velocityRT_B),[this.velocityRT_A,this.velocityRT_B]=[this.velocityRT_B,this.velocityRT_A],this.divergenceMat.uniforms.velocityTex.value=this.velocityRT_A.texture,this.renderToTarget(this.divergenceMat,this.divergenceRT),this.renderToTarget(this.zeroMat,this.pressureA);for(let e=0;e<this.PRESSURE_ITERATIONS;e++)this.pressureMat.uniforms.pressureTex.value=this.pressureA.texture,this.pressureMat.uniforms.divergenceTex.value=this.divergenceRT.texture,this.renderToTarget(this.pressureMat,this.pressureB),[this.pressureA,this.pressureB]=[this.pressureB,this.pressureA];this.projectionMat.uniforms.velocityTex.value=this.velocityRT_A.texture,this.projectionMat.uniforms.pressureTex.value=this.pressureA.texture,this.renderToTarget(this.projectionMat,this.velocityRT_B),[this.velocityRT_A,this.velocityRT_B]=[this.velocityRT_B,this.velocityRT_A]}updateDensity(e){let t=this.kick*this.settings.kickInjection*2.5;this.densityMat.uniforms.velocityTex.value=this.velocityRT_A.texture,this.densityMat.uniforms.densityTex.value=this.densityRT_A.texture,this.densityMat.uniforms.time.value=e,this.densityMat.uniforms.audio.value=t,this.densityMat.uniforms.inkMode.value=this.inkMode,this.densityMat.uniforms.injection.value=this.settings.densityInjection,this.densityMat.uniforms.decay.value=this.settings.densityDecay,this.renderToTarget(this.densityMat,this.densityRT_B),[this.densityRT_A,this.densityRT_B]=[this.densityRT_B,this.densityRT_A],this.densityVolumeMat.uniforms.densityTex.value=this.densityRT_A.texture,this.densityVolumeMat.uniforms.time.value=e,this.densityVolumeMat.uniforms.inkMode.value=this.inkMode,this.densityVolumeMat.uniforms.volumeStrength.value=this.settings.densityVolume}updateCamera(e){if(!(!this.settings.autoCamera&&!this.settings.vjMode)){if(this.settings.autoCamera){let t=this.settings.cameraRadius+this.bass*.5,n=this.settings.cameraSpeed+this.beat*.05;this.camera.position.x=Math.sin(e*n)*t,this.camera.position.z=Math.cos(e*n)*t,this.camera.position.y=this.settings.cameraHeight+Math.sin(e*.15)*.5+this.bass*.25}if(this.settings.vjMode){let t=this.settings.vjShake;this.camera.position.x+=Math.sin(e*2)*t*.05,this.camera.position.y+=Math.cos(e*1.5)*t*.05,this.camera.position.z+=Math.sin(e*1.8)*t*.033}this.camera.lookAt(0,0,0)}}updateMaterials(e){let t=this.settings.particleEnergy+this.bass*this.settings.bassBreathe*2+this.beat*2;this.particleMat.uniforms.positionTex.value=this.positionRT_A.texture,this.particleMat.uniforms.morph.value=this.morphValue,this.particleMat.uniforms.time.value=e,this.particleMat.uniforms.energy.value=Math.min(t,8),this.particleMat.uniforms.bass.value=this.bass*this.settings.bassBreathe,this.particleMat.uniforms.beat.value=this.beat,this.particleMat.uniforms.inkMode.value=this.inkMode,this.particleMat.uniforms.sizeScale.value=this.settings.particleSize,this.particleMat.uniforms.brightness.value=this.settings.particleBrightness,this.particleMat.uniforms.opacity.value=this.settings.particleOpacity;let n=new p(this.settings.colorR,this.settings.colorG,this.settings.colorB);this.particleMat.uniforms.flowColor.value=n,this.particleMat.uniforms.hue.value=this.settings.hue;for(let e=0;e<this.TRAIL_LENGTH;e++)this.trailSystem.material.uniforms[`history${e}`].value=this.trailTargets[e].texture;this.trailSystem.material.uniforms.time.value=e,this.trailSystem.material.uniforms.bass.value=this.bass*this.settings.bassBreathe,this.volumeMat.uniforms.time.value=e,this.volumeMat.uniforms.energy.value=this.settings.volumeEnergy+this.energy*this.settings.energyAtmosphere,this.volumeMat.uniforms.morph.value=this.morphValue,this.volumeMat.uniforms.density.value=this.settings.volumeDensity,this.bloomPass.strength=this.settings.bloomStrength+this.beat*this.settings.beatExposure,this.bloomPass.radius=this.settings.bloomRadius,this.bloomPass.threshold=this.settings.bloomThreshold,this.cinematicPass&&(this.cinematicPass.uniforms.time.value=e,this.cinematicPass.uniforms.aberration.value=.0015+this.beat*.012+this.bass*.002,this.cinematicPass.uniforms.bass.value=this.bass,this.cinematicPass.uniforms.beat.value=this.beat)}applyColorPreset(){let e=this.COLOR_PRESETS[this.colorPresetIdx],t=new p(e);this.settings.colorR=t.r,this.settings.colorG=t.g,this.settings.colorB=t.b,this.particleMat.uniforms.flowColor.value=t,this.gui&&this.gui.controllersRecursive().forEach(e=>e.updateDisplay())}updateAudioAnalysis(){if(!this.settings.audioReactive){this.motion=0,this.bass=0,this.energy=0,this.kick=0,this.beat=0;return}let e=this.settings.beatSensitivity||1;this.kick=Math.min(this.kick*e,2),this.beat=Math.min(this.beat*e,2),this.energy>0?(this.inkSwitchTimer+=this.energy*.5,this.inkSwitchTimer>8&&(this.inkSwitchTimer=0,this.inkMode=(this.inkMode+1)%3,this.gui&&this.gui.controllersRecursive().forEach(e=>e.updateDisplay())),this.morphSwitchTimer+=this.energy*.3*this.settings.morphSensitivity,this.morphSwitchTimer>12&&(this.morphSwitchTimer=0,this.sculptMode=(this.sculptMode+1)%this.MODE_NAMES.length,this.targetTexture=this.createMorphTarget(this.sculptMode),this.particleMat.uniforms.targetTexture.value=this.targetTexture,this.morphValue=0,this.morphDirection=1),this.colorSwitchTimer+=this.energy*.3,this.colorSwitchTimer>7&&(this.colorSwitchTimer=0,this.colorPresetIdx=(this.colorPresetIdx+1)%this.COLOR_PRESETS.length,this.applyColorPreset())):(this.beat=0,this.kick=0)}setupGUI(){this.createGUIContainer(),this.gui=new e({container:this.guiContainer,title:`流光溢彩`,width:280});let t=this.gui.addFolder(`粒子`);t.add(this.settings,`simSize`,64,512,8).name(`粒子数量 (NxN)`).onChange(e=>{this.resizeSimulation(e)}),t.add(this.settings,`particleSize`,.1,3,.01).name(`粒子大小`).onChange(e=>{this.particleMat.uniforms.sizeScale.value=e}),t.add(this.settings,`particleBrightness`,.1,3,.01).name(`亮度`).onChange(e=>{this.particleMat.uniforms.brightness.value=e}),t.add(this.settings,`particleEnergy`,.1,3,.01).name(`能量`).onChange(e=>{this.particleMat.uniforms.energy.value=e}),t.add(this.settings,`particleOpacity`,.1,1,.01).name(`透明度`).onChange(e=>{this.particleMat.uniforms.opacity.value=e}),t.open();let n=this.gui.addFolder(`泛光 (Bloom)`);n.add(this.settings,`bloomStrength`,0,3,.01).name(`Bloom强度`).onChange(e=>{this.bloomPass.strength=e}),n.add(this.settings,`bloomRadius`,0,1,.01).name(`Bloom半径`).onChange(e=>{this.bloomPass.radius=e}),n.add(this.settings,`bloomThreshold`,0,1,.01).name(`Bloom阈值`).onChange(e=>{this.bloomPass.threshold=e}),n.add(this.settings,`beatExposure`,0,2,.01).name(`鼓点曝光`),n.open();let r=this.gui.addFolder(`流体物理`);r.add(this.settings,`flowStrength`,0,2,.01).name(`流场强度`),r.add(this.settings,`vorticityStrength`,0,3,.01).name(`涡量强度`),r.add(this.settings,`fluidSpeed`,.1,2,.01).name(`流体速度`),r.open();let i=this.gui.addFolder(`密度`);i.add(this.settings,`densityInjection`,0,.2,.001).name(`注入强度`),i.add(this.settings,`densityDecay`,.98,1,1e-4).name(`衰减`),i.add(this.settings,`densityVolume`,0,.6,.01).name(`体积强度`),i.open();let a=this.gui.addFolder(`体积雾`);a.add(this.settings,`volumeDensity`,0,.3,.001).name(`密度`).onChange(e=>{this.volumeMat.uniforms.density.value=e}),a.add(this.settings,`volumeEnergy`,.1,3,.01).name(`能量`).onChange(e=>{this.volumeMat.uniforms.energy.value=e}),a.open();let o=this.gui.addFolder(`相机`);o.add(this.settings,`autoCamera`).name(`自动镜头`),o.add(this.settings,`vjMode`).name(`VJ模式`),o.add(this.settings,`vjShake`,0,.3,.005).name(`VJ晃动幅度`),o.add(this.settings,`cameraRadius`,1,8,.5).name(`轨道半径`),o.add(this.settings,`cameraSpeed`,.01,.5,.01).name(`旋转速度`),o.add(this.settings,`cameraHeight`,0,15,.1).name(`高度`),o.open();let s=this.gui.addFolder(`音频`);s.add(this.settings,`audioReactive`).name(`音频响应`),s.add(this.settings,`flowResponse`,0,2,.05).name(`流动响应 (motion)`),s.add(this.settings,`kickInjection`,0,2,.05).name(`墨水响应 (kick)`),s.add(this.settings,`bassBreathe`,0,2,.05).name(`呼吸响应 (bass)`),s.add(this.settings,`energyAtmosphere`,0,2,.05).name(`氛围响应 (energy)`),s.add(this.settings,`beatSensitivity`,0,3,.1).name(`节拍灵敏度`),s.open();let c=this.gui.addFolder(`形态`);c.add(this.settings,`morphSensitivity`,.1,3,.1).name(`切换频率`),c.add(this.settings,`morphFlipThreshold`,0,1,.05).name(`翻转阈值 (beat)`),c.open();let l=this.gui.addFolder(`颜色`);l.add(this.settings,`hue`,0,1,.01).name(`色相`).onChange(e=>{this.particleMat.uniforms.hue.value=e}),l.open(),this.gui.add({reset:()=>{if(Object.keys(this.defaultSettings).forEach(e=>{e!==`resetParams`&&(this.settings[e]=this.defaultSettings[e])}),this.SIM_SIZE!==this.settings.simSize){this.resizeSimulation(this.settings.simSize),this.inkMode=0,this.colorPresetIdx=0,this.sculptMode=0,this.morphValue=0,this.morphDirection=1,this.prevBeatHigh=!1,this.gui.controllersRecursive().forEach(e=>e.updateDisplay());return}this.bloomPass.strength=this.settings.bloomStrength,this.bloomPass.radius=this.settings.bloomRadius,this.bloomPass.threshold=this.settings.bloomThreshold,this.volumeMat.uniforms.density.value=this.settings.volumeDensity,this.volumeMat.uniforms.energy.value=this.settings.volumeEnergy;let e=new p(this.settings.colorR,this.settings.colorG,this.settings.colorB);this.particleMat.uniforms.flowColor.value=e,this.particleMat.uniforms.hue.value=this.settings.hue,this.inkMode=0,this.colorPresetIdx=0,this.sculptMode=0,this.morphValue=0,this.morphDirection=1,this.prevBeatHigh=!1,this.particleMat.uniforms.morph.value=0,this.volumeMat.uniforms.morph.value=0,this.particleMat.uniforms.sizeScale.value=this.settings.particleSize,this.particleMat.uniforms.brightness.value=this.settings.particleBrightness,this.particleMat.uniforms.energy.value=this.settings.particleEnergy,this.particleMat.uniforms.opacity.value=this.settings.particleOpacity,this.gui.controllersRecursive().forEach(e=>e.updateDisplay())}},`reset`).name(`🔄 重置参数`),this.gui.hide()}createGUIContainer(){this.guiContainer=O(`Animation54-gui-container`),k(`Animation54-gui-container`),document.body.appendChild(this.guiContainer)}setupSettingsButton(){this.settingsButton=E(`Animation54-settings-button`),this.settingsButton.addEventListener(`click`,()=>{this.guiVisible=!this.guiVisible,this.guiVisible?this.gui.show():this.gui.hide()}),document.body.appendChild(this.settingsButton)}render(){if(!this.hasAudioData){this.controls.target.set(0,0,0),this.settings.autoCamera||this.controls.update(),this.composer.render();return}let e=this._time*.001,t=Math.min(.05,e-this.lastTime);this.lastTime=e,this.frameCount++;let n=performance.now();if(n-this.lastFpsTime>=1e3&&(this.fpsDisplay=this.frameCount,this.frameCount=0,this.lastFpsTime=n),this.updateAudioAnalysis(),this.fpsDisplay<25?this.fpsSkipMode=this.fpsDisplay<10?3:this.fpsDisplay<15?2:1:this.fpsSkipMode=0,this.fpsSkipMode>0&&this.frameSkip%(this.fpsSkipMode+1)!==0){this.frameSkip++,this.settings.autoCamera||this.controls.update(),this.composer.render();return}this.frameSkip=(this.frameSkip+1)%(this.fpsSkipMode+1||1);let r=.002+this.bass*.02+this.beat*.05;this.morphValue+=r*this.morphDirection;let i=this.beat>(this.settings.morphFlipThreshold||.3);i&&!this.prevBeatHigh&&(this.morphDirection=-this.morphDirection),this.prevBeatHigh=i,(this.morphValue>1||this.morphValue<0)&&(this.morphDirection*=-1,this.morphValue=Math.max(0,Math.min(1,this.morphValue))),this.updateNavierStokes(e,Math.min(t,.05)),this.updateDensity(e);let a=this.settings.fluidSpeed;this.positionUpdateMat.uniforms.delta.value=Math.min(t*a,.05),this.positionUpdateMat.uniforms.positionTex.value=this.positionRT_A.texture,this.positionUpdateMat.uniforms.velocityTex.value=this.velocityRT_A.texture,this.renderToTarget(this.positionUpdateMat,this.positionRT_B),[this.positionRT_A,this.positionRT_B]=[this.positionRT_B,this.positionRT_A],this.updateTrailHistory(),this.updateMaterials(e),this.updateCamera(e),this.stars.rotation.y=e*.003,this.stars.rotation.x=Math.sin(e*.002)*.1,this.controls.target.set(0,0,0),this.settings.autoCamera||this.controls.update(),this.composer.render()}onWindowResize(){let e=window.innerWidth,t=window.innerHeight;this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t),this.composer.setSize(e,t)}updateWithAudioData(e,t){if(t!==void 0&&(this._time=t),!e||!e.audioFeature){this.hasAudioData=!1;return}this.hasAudioData=!0;let n=e.audioFeature&&e.audioFeature.animation||{};this.bass=n.bass||0,this.energy=n.energy||0,this.motion=n.motion||0,this.kick=n.kick||0,this.beat=n.beat||0}setEffectMode(e){return console.log(`当前效果模式：${e}`),!0}updateSettings(e){if(Object.assign(this.settings,e),e.colorR!==void 0||e.colorG!==void 0||e.colorB!==void 0){let e=new p(this.settings.colorR,this.settings.colorG,this.settings.colorB);this.particleMat.uniforms.flowColor.value=e}e.hue!==void 0&&(this.particleMat.uniforms.hue.value=e.hue),e.bloomStrength!==void 0&&(this.bloomPass.strength=e.bloomStrength),e.bloomRadius!==void 0&&(this.bloomPass.radius=e.bloomRadius),e.bloomThreshold!==void 0&&(this.bloomPass.threshold=e.bloomThreshold),e.particleSize!==void 0&&(this.particleMat.uniforms.sizeScale.value=e.particleSize),e.particleBrightness!==void 0&&(this.particleMat.uniforms.brightness.value=e.particleBrightness),e.particleEnergy!==void 0&&(this.particleMat.uniforms.energy.value=e.particleEnergy),e.particleOpacity!==void 0&&(this.particleMat.uniforms.opacity.value=e.particleOpacity),e.volumeDensity!==void 0&&(this.volumeMat.uniforms.density.value=e.volumeDensity),e.volumeEnergy!==void 0&&(this.volumeMat.uniforms.energy.value=e.volumeEnergy)}dispose(){D(this.settingsButton,this.guiContainer,this.gui),this.particleSystem&&(this.scene.remove(this.particleSystem),this.particleSystem.geometry.dispose(),this.particleMat.dispose()),this.trailSystem&&(this.scene.remove(this.trailSystem),this.trailSystem.geometry.dispose(),this.trailSystem.material.dispose()),this.volumeMesh&&(this.scene.remove(this.volumeMesh),this.volumeMat.dispose()),this.densityVolume&&(this.scene.remove(this.densityVolume),this.densityVolumeMat.dispose()),this.stars&&this.scene.remove(this.stars),this.trailCopyMat&&this.trailCopyMat.dispose(),this.zeroMat&&this.zeroMat.dispose(),this.renderer&&this.renderer.dispose(),console.log(`✅ Animation54 资源已清理`)}};export{j as default};