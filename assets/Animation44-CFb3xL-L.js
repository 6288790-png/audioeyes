import{a as e}from"./lil-gui.esm-jlbWO7FJ.js";import{Bt as t,Gt as n,Jn as r,Wt as i,_t as a,ct as o,g as s,l as c,qn as l,r as u,u as d,wr as f,xt as p}from"./three.module-CgISyWQV.js";import{n as m,r as h,t as g}from"./OutputPass-D9GSoAm2.js";import{t as _}from"./UnrealBloomPass-1z79deN3.js";import{i as v,n as y,r as b,t as x}from"./GUIHelper-DspWBXk2.js";import{t as S}from"./OrbitControls-DVnblHSy.js";var C=class{constructor(e,t={}){this.canvas=e;let n={b:.19,dt:.05,bloomStrength:.35,bloomRadius:.1,bloomThreshold:.3,autoRotateSpeed:1.5,breatheAmplitude:.03,waveAmplitude:.05,audioDriven:!0,shapeAudioEnabled:!0,shapeSmoothness:.65,structureSensitivity:.018,bassScaleSensitivity:.35,motionTurbulenceSensitivity:.15,colorSpeed:2,saturationRange:1.05,hueRange:50,lowColorWeight:.8,midColorWeight:.9,highColorWeight:1,brightnessHueSensitivity:90,energyColorSensitivity:1,colorRibbonStrength:.65,bloomHighSensitivity:.12,autoRotate:!1,particleBrightness:1.1,lineOpacity:.82,beatSensitivity:1.4,variationRotateSensitivity:.5};this.settings={...n,...t},this.settings.hueRange>90&&(this.settings.hueRange=n.hueRange),this.defaultSettings={...n},this.scene=null,this.camera=null,this.renderer=null,this.controls=null,this.composer=null,this.bloomPass=null,this.line=null,this.glowLine=null,this.geometry=null,this.material=null,this.glowMaterial=null,this.stars=null,this.basePositions=null,this.baseColors=null,this.radialDistances=null,this.smoothState={b:this.settings.b},this.POINTS_COUNT=6e4,this.audioEnergy={bass:0,mid:0,high:0,amplitude:0},this.isAudioPlaying=!1,this.hasAudioData=!1,this.audioFeature=null,this.audioTargets={bass:0,mid:0,high:0,energy:0,motion:0,brightness:0,texture:0,smoothness:0,kick:0,snare:0,hihat:0},this.audioVisual={...this.audioTargets},this._lastAudioTime=null,this._lastKickInput=0,this._lastSnareInput=0,this._lastDownbeatInput=!1,this._adaptiveLevels={bass:{peak:.18},mid:{peak:.18},high:{peak:.18},energy:{peak:.18}},this._kickProgress=1,this._snareProgress=1,this._downbeatProgress=1,this._downbeatEnvelope=0,this._bloomEnvelope=this.settings.bloomStrength,this._lastAttractorUpdate=0,this._lastComputedB=this.settings.b,this._time=0,this._isReady=!1,this.gui=null,this.guiContainer=null,this.guiVisible=!1,this.time=0,this.sparkles=null,this.sparkleGeometry=null,this.sparkleMaterial=null,this.settingsButton=null,this._lastFrameTime=-1,this.DEFAULT_CAM_POS={x:5.16,y:-11.5,z:5.05},this.DEFAULT_TARGET={x:-.19,y:.04,z:.32},this.init().then(()=>{this._isReady=!0}).catch(e=>{console.error(`❌ Animation44 初始化失败:`,e)})}hslToRgb(e,t,n){if(e=(e%1+1)%1,t===0)return[n,n,n];let r=(e,t,n)=>(n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*(2/3-n)*6:e),i=n<.5?n*(1+t):n+t-n*t,a=2*n-i;return[r(a,i,e+1/3),r(a,i,e),r(a,i,e-1/3)]}computeAttractor(e,t){let n=new Float32Array(this.POINTS_COUNT*3),r=new Float32Array(this.POINTS_COUNT*3),i=new Float32Array(this.POINTS_COUNT),a=1,o=.1,s=.1;for(let c=0;c<this.POINTS_COUNT;c++){let l=(Math.sin(o)-e*a)*t,u=(Math.sin(s)-e*o)*t,d=(Math.sin(a)-e*s)*t;a+=l,o+=u,s+=d,n[c*3]=a,n[c*3+1]=o,n[c*3+2]=s,i[c]=Math.sqrt(a*a+o*o+s*s);let f=(a*20+o*15+s*10+360)%360,p=.7+Math.sin(a*.6)*.2,m=.45+Math.sin(o*.5)*.2,h=this.hslToRgb(f/360,Math.min(1,p),Math.min(1,m));r[c*3]=h[0],r[c*3+1]=h[1],r[c*3+2]=h[2]}return{positions:n,colors:r,radialDistances:i}}async init(){try{return this.setupThreeJS(),this.computeInitialData(),this.createMaterial(),this.createParticleSystem(),this.createSparkleSystem(),this.createBackgroundStars(),this.setupPostProcessing(),this.setupGUI(),this.setupSettingsButton(),this.resizeHandler=()=>this.onWindowResize(),window.addEventListener(`resize`,this.resizeHandler),console.log(`✅ Animation44 初始化成功`),!0}catch(e){throw console.error(`❌ Animation44 初始化失败:`,e),e}}setupThreeJS(){this.scene=new l,this.camera=new t(45,window.innerWidth/window.innerHeight,.1,200),this.camera.position.set(this.DEFAULT_CAM_POS.x,this.DEFAULT_CAM_POS.y,this.DEFAULT_CAM_POS.z),this.renderer=new u({canvas:this.canvas,antialias:!0,alpha:!0}),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setClearColor(0,0),this.renderer.outputColorSpace=a,this.canvas.style.backgroundColor=`transparent`,this.canvas.style.zIndex=`1`,this.controls=new S(this.camera,this.canvas),this.controls.enableDamping=!0,this.controls.autoRotate=this.settings.autoRotate,this.controls.autoRotateSpeed=this.settings.autoRotateSpeed,this.controls.target.set(this.DEFAULT_TARGET.x,this.DEFAULT_TARGET.y,this.DEFAULT_TARGET.z),this.controls.update()}computeInitialData(){let e=this.computeAttractor(this.settings.b,this.settings.dt);this.basePositions=e.positions,this.baseColors=e.colors,this.radialDistances=e.radialDistances}createMaterial(){this.material=new r({uniforms:{uTime:{value:0},uBreathe:{value:this.settings.breatheAmplitude},uWave:{value:this.settings.waveAmplitude},uBrightness:{value:1},uOpacity:{value:this.settings.lineOpacity},uBass:{value:0},uMid:{value:0},uHigh:{value:0},uMotion:{value:0},uEnergy:{value:0},uAudioBrightness:{value:0},uHueRange:{value:this.settings.hueRange/360},uSaturationRange:{value:this.settings.saturationRange},uLowWeight:{value:this.settings.lowColorWeight},uMidWeight:{value:this.settings.midColorWeight},uHighWeight:{value:this.settings.highColorWeight},uTexture:{value:0},uSmoothness:{value:.5},uRibbonStrength:{value:this.settings.colorRibbonStrength},uKick:{value:0},uSnare:{value:0},uDownbeat:{value:0},uKickProgress:{value:1},uSnareProgress:{value:1},uDownbeatProgress:{value:1}},vertexShader:`
            uniform float uTime;
            uniform float uBreathe;
            uniform float uWave;
            uniform float uBass;
            uniform float uMid;
            uniform float uMotion;
            uniform float uKick;
            uniform float uSnare;
            uniform float uDownbeat;
            uniform float uKickProgress;
            uniform float uSnareProgress;
            uniform float uDownbeatProgress;
            attribute float pathProgress;
            attribute vec3 color;
            varying vec3 vColor;
            varying float vPath;
            varying float vPulse;
            varying float vKickPulse;
            varying float vSnarePulse;
            varying float vDownbeatPulse;
            void main() {
                vColor = color;
                vPath = pathProgress;
                vec3 pos = position;

                // Bass 只负责整体呼吸；Mid 负责缠绕扭转；Motion 负责局部湍流。
                float breathe = 1.0 + uBreathe * sin(uTime * 0.15) + uBass * 0.22;
                pos *= breathe;
                float twist = uMid * 0.22 * sin(pathProgress * 18.8496 + uTime * 0.8);
                float tc = cos(twist), ts = sin(twist);
                pos.xy = mat2(tc, -ts, ts, tc) * pos.xy;
                float turbulence = uMotion * (0.08 + 0.04 * length(pos));
                pos += vec3(
                    sin(pathProgress * 91.0 + uTime * 1.7),
                    cos(pathProgress * 73.0 + uTime * 1.3),
                    sin(pathProgress * 57.0 - uTime * 1.5)
                ) * turbulence;
                float wave = sin(uTime * 0.3 + pos.z * 2.0) * uWave;
                pos.x += wave;
                pos.y += wave;

                float kickPulse = exp(-pow((pathProgress - uKickProgress) / 0.045, 2.0)) * uKick;
                float snarePulse = exp(-pow((pathProgress - uSnareProgress) / 0.075, 2.0)) * uSnare;
                float downbeatPulse = exp(-pow((pathProgress - uDownbeatProgress) / 0.13, 2.0)) * uDownbeat;
                vPulse = kickPulse + snarePulse * 0.75 + downbeatPulse * 1.15;
                vKickPulse = kickPulse;
                vSnarePulse = snarePulse;
                vDownbeatPulse = downbeatPulse;
                pos += normalize(pos + 0.001) * (kickPulse * 0.18 + downbeatPulse * 0.25);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,fragmentShader:`
            uniform float uTime;
            uniform float uBrightness;
            uniform float uOpacity;
            uniform float uEnergy;
            uniform float uAudioBrightness;
            uniform float uBass;
            uniform float uMid;
            uniform float uHigh;
            uniform float uHueRange;
            uniform float uSaturationRange;
            uniform float uLowWeight;
            uniform float uMidWeight;
            uniform float uHighWeight;
            uniform float uTexture;
            uniform float uSmoothness;
            uniform float uRibbonStrength;
            varying vec3 vColor;
            varying float vPath;
            varying float vPulse;
            varying float vKickPulse;
            varying float vSnarePulse;
            varying float vDownbeatPulse;

            vec3 hsv2rgb(vec3 c) {
                vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
                vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
                return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
            }
            void main() {
                // Texture 增加路径色带密度；Smoothness 控制色带边界的柔和程度。
                float density = mix(3.0, 9.0, clamp(uTexture, 0.0, 1.0));
                float rawBand = 0.5 + 0.5 * sin(vPath * 6.28318 * density + uTime * (0.22 + uMid * 0.35));
                float edge = mix(0.12, 0.46, clamp(uSmoothness, 0.0, 1.0));
                float flow = smoothstep(0.5 - edge, 0.5 + edge, rawBand);

                // 音色亮度决定主色相，各频段以不同方向推移色相；GUI 权重直接控制贡献。
                float bandHue = uBass * uLowWeight * -0.12
                    + uMid * uMidWeight * 0.08
                    + uHigh * uHighWeight * 0.2;
                float baseHue = fract(0.62 + uTime * 0.012 + uAudioBrightness * 0.16 + bandHue);
                float hueSpread = clamp(uHueRange, 0.0, 1.0);
                // 用连续的空间层次形成同色系丝线差异，避免离散彩虹分段。
                float strandLayer = clamp(dot(vColor, vec3(0.42, 0.36, 0.22)), 0.0, 1.0);
                float identityOffset = (strandLayer - 0.5) * hueSpread;
                float pathHue = fract(baseHue + identityOffset);
                float saturation = clamp((0.7 + uEnergy * 0.22 + uTexture * 0.1) * uSaturationRange, 0.0, 1.0);
                float value = 0.7 + strandLayer * 0.16 + uEnergy * 0.13 + uHigh * 0.08;
                vec3 color = hsv2rgb(vec3(pathHue, saturation, value));

                // 一条相邻色高光沿路径流动，强化节奏但不破坏整体配色统一性。
                float ribbon = pow(flow, mix(2.8, 1.6, clamp(uSmoothness, 0.0, 1.0)));
                vec3 ribbonColor = hsv2rgb(vec3(fract(baseHue + hueSpread * 0.65), saturation * 0.82, 1.0));
                float ribbonAmount = ribbon * (0.08 + uEnergy * 0.1 + uTexture * 0.07) * uRibbonStrength;
                color = mix(color, ribbonColor, clamp(ribbonAmount, 0.0, 0.55));

                // 瞬态事件形成短促的互补色脉冲，不锁定整体配色。
                vec3 kickColor = hsv2rgb(vec3(fract(baseHue + 0.5), saturation * 0.88, 1.0));
                vec3 snareColor = hsv2rgb(vec3(fract(baseHue + 0.22), saturation * 0.72, 1.0));
                color = mix(color, kickColor, clamp(vKickPulse * 0.62, 0.0, 0.58));
                color = mix(color, snareColor, clamp(vSnarePulse * 0.68, 0.0, 0.62));
                color = mix(color, vec3(1.0), clamp(vDownbeatPulse * 0.52, 0.0, 0.5));
                color *= 0.72 + uEnergy * 0.24 + uAudioBrightness * 0.08 + vPulse * 0.34;
                gl_FragColor = vec4(color * uBrightness, clamp(uOpacity + vPulse * 0.12, 0.0, 0.95));
            }
        `,transparent:!0,depthWrite:!1,blending:1}),this.glowMaterial=this.material.clone(),this.glowMaterial.blending=2,this.glowMaterial.uniforms.uBrightness.value=.42,this.glowMaterial.uniforms.uOpacity.value=.13}createParticleSystem(){this.geometry&&this.geometry.dispose(),this.geometry=new d,this.geometry.setAttribute(`position`,new c(this.basePositions.slice(),3)),this.geometry.setAttribute(`color`,new c(this.baseColors.slice(),3));let e=new Float32Array(this.POINTS_COUNT);for(let t=0;t<this.POINTS_COUNT;t++)e[t]=t/(this.POINTS_COUNT-1);this.geometry.setAttribute(`pathProgress`,new c(e,1)),this.line?(this.line.geometry=this.geometry,this.glowLine&&(this.glowLine.geometry=this.geometry)):(this.line=new o(this.geometry,this.material),this.scene.add(this.line),this.glowLine=new o(this.geometry,this.glowMaterial),this.glowLine.scale.setScalar(1.006),this.glowLine.renderOrder=-1,this.scene.add(this.glowLine))}createSparkleSystem(){let e=3e3,t=new Float32Array(e*3),n=new Float32Array(e),a=new Float32Array(e),o=new Uint32Array(e);for(let r=0;r<e;r++){let i=Math.floor(r*(this.POINTS_COUNT-1)/(e-1));o[r]=i,t[r*3]=this.basePositions[i*3],t[r*3+1]=this.basePositions[i*3+1],t[r*3+2]=this.basePositions[i*3+2],n[r]=Math.random(),a[r]=i/(this.POINTS_COUNT-1)}this.sparkleSourceIndices=o,this.sparkleGeometry=new d,this.sparkleGeometry.setAttribute(`position`,new c(t,3)),this.sparkleGeometry.setAttribute(`seed`,new c(n,1)),this.sparkleGeometry.setAttribute(`pathProgress`,new c(a,1)),this.sparkleMaterial=new r({uniforms:{uHihat:{value:0},uHigh:{value:0},uBass:{value:0},uMid:{value:0},uMotion:{value:0},uTime:{value:0},uColor:{value:new s(.78,.9,1)}},vertexShader:`
                attribute float seed;
                attribute float pathProgress;
                uniform float uHihat;
                uniform float uHigh;
                uniform float uBass;
                uniform float uMid;
                uniform float uMotion;
                uniform float uTime;
                varying float vAlpha;
                void main() {
                    // 每个闪点有独立周期：瞬时点亮、快速衰减，避免整批随机跳变。
                    float phase = fract(uTime * (7.0 + seed * 6.0) + seed * 11.73);
                    float life = pow(max(0.0, 1.0 - phase), 11.0);
                    float density = step(0.58, fract(seed * 37.17));
                    float sparkle = life * density * uHihat;
                    vec3 pos = position * (1.0 + uBass * 0.22);
                    float twist = uMid * 0.22 * sin(pathProgress * 18.8496 + uTime * 0.8);
                    float tc = cos(twist), ts = sin(twist);
                    pos.xy = mat2(tc, -ts, ts, tc) * pos.xy;
                    pos += vec3(
                        sin(pathProgress * 91.0 + uTime * 1.7),
                        cos(pathProgress * 73.0 + uTime * 1.3),
                        sin(pathProgress * 57.0 - uTime * 1.5)
                    ) * uMotion * (0.08 + 0.04 * length(pos));
                    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
                    float viewZ = max(-mv.z, 0.1);
                    // 静音时完全隐藏闪点；限制尺寸，避免接近相机时形成巨大亮斑。
                    gl_PointSize = clamp((0.5 + uHigh * 0.8 + sparkle * 2.2) * (55.0 / viewZ), 0.5, 5.0);
                    vAlpha = uHigh * 0.025 + sparkle * 0.48;
                    gl_Position = projectionMatrix * mv;
                }
            `,fragmentShader:`
                varying float vAlpha;
                uniform vec3 uColor;
                void main() {
                    float d = length(gl_PointCoord - 0.5);
                    if (d > 0.5) discard;
                    float glow = 1.0 - smoothstep(0.05, 0.5, d);
                    gl_FragColor = vec4(uColor, glow * vAlpha);
                }
            `,transparent:!0,depthWrite:!1,blending:2}),this.sparkles=new i(this.sparkleGeometry,this.sparkleMaterial),this.scene.add(this.sparkles)}createBackgroundStars(){let e=new d,t=new Float32Array(600*3);for(let e=0;e<600;e++)t[e*3]=(Math.random()-.5)*200,t[e*3+1]=(Math.random()-.5)*200,t[e*3+2]=(Math.random()-.5)*200-20;e.setAttribute(`position`,new c(t,3));let r=new n({color:5601177,size:.12,transparent:!0,opacity:.25,blending:2});this.stars=new i(e,r),this.scene.add(this.stars)}setupPostProcessing(){this.composer=new h(this.renderer);let e=new m(this.scene,this.camera);this.composer.addPass(e),this.bloomPass=new _(new f(window.innerWidth,window.innerHeight),this.settings.bloomStrength,this.settings.bloomRadius,this.settings.bloomThreshold),this.composer.addPass(this.bloomPass),this.composer.addPass(new g)}updateParticles(){let e=this.geometry.attributes.position,t=e.array,n=this.audioVisual.mid,r=this.audioFeature,i=this.settings.audioDriven&&this.settings.shapeAudioEnabled&&this.isAudioPlaying&&r,a=p.clamp(n,0,1)**.72,o=p.clamp((r?.motion||0)*2.2,0,1)**.7,s=p.clamp((r?.variation||0)*8,0,1),c=p.clamp(r?.energyTrend||0,-1,1),l=p.clamp((r?.kick||0)*.12+(r?.downbeat||0)*.16,0,.3),u=p.clamp(a*.62+o*.2+s*.12+c*.1+l,0,1.25),d=this.settings.b+(i?u*this.settings.structureSensitivity:0),f=p.clamp(d,.05,Math.max(.4,this.settings.b)),m=1-Math.exp(-.083/(.08+this.settings.shapeSmoothness*.65));this.smoothState.b+=(f-this.smoothState.b)*m;let h=this.smoothState.b;if(Math.abs(h-this._lastComputedB)<1e-4)return;this._lastComputedB=h;let g=1,_=.1,v=.1,y=this.settings.dt;for(let e=0;e<this.POINTS_COUNT;e++){let n=(Math.sin(_)-h*g)*y,r=(Math.sin(v)-h*_)*y,i=(Math.sin(g)-h*v)*y;g+=n,_+=r,v+=i;let a=e*3;t[a]=g,t[a+1]=_,t[a+2]=v}if(e.needsUpdate=!0,this.sparkleGeometry&&this.sparkleSourceIndices){let e=this.sparkleGeometry.attributes.position.array;for(let n=0;n<this.sparkleSourceIndices.length;n++){let r=this.sparkleSourceIndices[n]*3;e[n*3]=t[r],e[n*3+1]=t[r+1],e[n*3+2]=t[r+2]}this.sparkleGeometry.attributes.position.needsUpdate=!0}}resetParticles(){let e=this.computeAttractor(this.settings.b,this.settings.dt);this.basePositions.set(e.positions),this.baseColors.set(e.colors),this.radialDistances.set(e.radialDistances),this.smoothState.b=this.settings.b;let t=this.geometry.attributes.position,n=this.geometry.attributes.color;if(t.array.set(this.basePositions),n.array.set(this.baseColors),t.needsUpdate=!0,n.needsUpdate=!0,this._lastComputedB=this.settings.b,this.sparkleGeometry&&this.sparkleSourceIndices){let e=this.sparkleGeometry.attributes.position.array;for(let t=0;t<this.sparkleSourceIndices.length;t++){let n=this.sparkleSourceIndices[t]*3;e[t*3]=this.basePositions[n],e[t*3+1]=this.basePositions[n+1],e[t*3+2]=this.basePositions[n+2]}this.sparkleGeometry.attributes.position.needsUpdate=!0}}setupGUI(){this.createGUIContainer();let t={resetAll:()=>{Object.assign(this.settings,this.defaultSettings),this.material.uniforms.uBreathe.value=this.settings.breatheAmplitude,this.material.uniforms.uWave.value=this.settings.waveAmplitude,this.material.uniforms.uBrightness.value=this.settings.particleBrightness,this.bloomPass.strength=this.settings.bloomStrength,this._bloomEnvelope=this.settings.bloomStrength,this.bloomPass.radius=this.settings.bloomRadius,this.bloomPass.threshold=this.settings.bloomThreshold,this.controls.autoRotateSpeed=this.settings.autoRotateSpeed,this.controls.autoRotate=this.settings.autoRotate,this.smoothState.b=this.settings.b,Object.keys(this.audioVisual).forEach(e=>{this.audioVisual[e]=0,this.audioTargets[e]=0}),this._kickProgress=1,this._snareProgress=1,this._downbeatProgress=1,this._downbeatEnvelope=0,this._lastKickInput=0,this._lastSnareInput=0,this._lastDownbeatInput=!1,Object.values(this._adaptiveLevels).forEach(e=>{e.peak=.18}),this.resetParticles(),this.camera.position.set(this.DEFAULT_CAM_POS.x,this.DEFAULT_CAM_POS.y,this.DEFAULT_CAM_POS.z),this.controls.target.set(this.DEFAULT_TARGET.x,this.DEFAULT_TARGET.y,this.DEFAULT_TARGET.z),this.controls.update();let e=t=>{t.controllers.forEach(e=>e.updateDisplay()),t.folders&&Object.values(t.folders).forEach(t=>e(t))};e(this.gui)}};this.gui=new e({container:this.guiContainer,title:`流光缠丝`}),this.gui.add(this.settings,`audioDriven`).name(`🎧 音频驱动总开关`);let n=this.gui.addFolder(`吸引子参数 (Thomas)`);n.add(this.settings,`b`,.05,.5,.01).name(`b (耗散系数)`).onChange(()=>this.resetParticles()),n.add(this.settings,`dt`,.01,.15,.005).name(`积分步长`).onChange(()=>this.resetParticles()),n.open();let r=this.gui.addFolder(`🎵 形状驱动 · 综合响应`);r.add(this.settings,`shapeAudioEnabled`).name(`启用音频驱动形状`),r.add(this.settings,`shapeSmoothness`,.5,.99,.01).name(`结构响应平滑`),r.add(this.settings,`structureSensitivity`,0,.035,.001).name(`综合结构幅度`),r.add(this.settings,`bassScaleSensitivity`,0,.5,.01).name(`低频整体缩放`),r.add(this.settings,`motionTurbulenceSensitivity`,0,.5,.01).name(`Motion 丝线湍流`),r.open();let i=this.gui.addFolder(`🎨 颜色驱动 · 快速`);i.add(this.settings,`colorSpeed`,0,3,.1).name(`主色漂移速度`),i.add(this.settings,`saturationRange`,0,1.5,.01).name(`整体饱和度`),i.add(this.settings,`hueRange`,0,90,2).name(`丝线色差`),i.add(this.settings,`brightnessHueSensitivity`,0,180,5).name(`音色变色幅度`),i.add(this.settings,`energyColorSensitivity`,0,1.5,.05).name(`音量色彩强度`),i.add(this.settings,`lowColorWeight`,0,1.5,.01).name(`低频染色`),i.add(this.settings,`midColorWeight`,0,1.5,.01).name(`中频染色`),i.add(this.settings,`highColorWeight`,0,1.5,.01).name(`高频染色`),i.add(this.settings,`colorRibbonStrength`,0,1.5,.05).name(`流动色带强度`),i.add(this.settings,`beatSensitivity`,0,2.5,.1).name(`Kick 脉冲灵敏度`),i.open();let a=this.gui.addFolder(`🔄 动态变形`);a.add(this.settings,`breatheAmplitude`,0,.1,.005).name(`呼吸幅度`).onChange(e=>{this.material.uniforms.uBreathe.value=e}),a.add(this.settings,`waveAmplitude`,0,.2,.005).name(`波动幅度`).onChange(e=>{this.material.uniforms.uWave.value=e}),a.open();let o=this.gui.addFolder(`视觉效果`);o.add(this.settings,`bloomStrength`,0,1.5,.01).name(`bloom强度`).onChange(e=>{this.bloomPass.strength=e,this._bloomEnvelope=e}),o.add(this.settings,`bloomRadius`,0,.8,.01).name(`bloom半径`).onChange(e=>{this.bloomPass.radius=e}),o.add(this.settings,`bloomThreshold`,0,1,.02).name(`bloom阈值`).onChange(e=>{this.bloomPass.threshold=e}),o.add(this.settings,`bloomHighSensitivity`,0,.5,.01).name(`光晕 ← 高频`),o.add(this.settings,`particleBrightness`,.1,1.5,.05).name(`丝线亮度`).onChange(e=>{this.material&&(this.material.uniforms.uBrightness.value=e)}),o.add(this.settings,`lineOpacity`,.2,1,.02).name(`丝线透明度`).onChange(e=>{this.material&&(this.material.uniforms.uOpacity.value=e)}),o.open();let s=this.gui.addFolder(`🔄 旋转控制`);s.add(this.controls,`autoRotate`).name(`自动旋转`),s.add(this.settings,`autoRotateSpeed`,0,5,.1).name(`旋转速度`).onChange(e=>{this.controls.autoRotateSpeed=e}),s.add(this.settings,`variationRotateSensitivity`,0,2,.1).name(`旋转 ← 音乐变化`),s.open(),this.gui.add(t,`resetAll`).name(`↻ 重置参数`),this.gui.hide()}createGUIContainer(){this.guiContainer=b(`Animation44-gui-container`),x(`Animation44-gui-container`),document.body.appendChild(this.guiContainer)}setupSettingsButton(){this.settingsButton=v(`Animation44-settings-button`),this.settingsButton.addEventListener(`click`,()=>{this.guiVisible=!this.guiVisible,this.guiVisible?this.gui.show():this.gui.hide()}),document.body.appendChild(this.settingsButton)}onWindowResize(){let e=window.innerWidth,t=window.innerHeight;this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t),this.composer&&this.composer.setSize(e,t)}updateEnvelope(e,t,n,r,i){let a=t>e?r:i;return e+(t-e)*(1-Math.exp(-n/Math.max(a,.001)))}normalizeAudioLevel(e,t,n){let r=p.clamp(Number.isFinite(e)?e:0,0,2),i=this._adaptiveLevels[t];return i.peak=Math.max(r,i.peak*Math.exp(-n/3.2),.12),r<.012?0:p.clamp((r-.012)/Math.max(.08,i.peak*.88),0,1.25)**.82}updateWithAudioData(e,t){if(t!==void 0&&(this._time=t),!e||e.isPlaying!==!0){this.hasAudioData=!1,this.isAudioPlaying=!1,this.audioFeature=null,this._lastAudioTime=null,this._lastDownbeatInput=!1;return}this.hasAudioData=!0;let n=Number.isFinite(t)?t*.001:performance.now()*.001,r=this._lastAudioTime===null?1/60:p.clamp(n-this._lastAudioTime,1/240,.1);this._lastAudioTime=n;let i=e.audioFeature?e.audioFeature.animation:null,a=e.energy||{},o=i?i.bass||0:a.low||0,s=i?i.mid||0:a.mid||0,c=i?i.high||0:a.high||0,l=i?i.energy||0:(o+s+c)/3,u=this.normalizeAudioLevel(o,`bass`,r),d=this.normalizeAudioLevel(s,`mid`,r),f=this.normalizeAudioLevel(c,`high`,r),m=this.normalizeAudioLevel(l,`energy`,r),h=e.beat||{},g=i?i.kick||0:h.kick||0,_=i?i.snare||0:h.snare||0,v=i?i.hihat||0:h.hihat||0;Object.assign(this.audioTargets,{bass:u,mid:d,high:f,energy:m,motion:i&&i.motion||0,brightness:i&&i.brightness||0,texture:i&&i.texture||0,smoothness:i?i.smoothness??.5:.5,kick:g,snare:_,hihat:v});let y=this.audioVisual;y.bass=this.updateEnvelope(y.bass,u,r,.045,.42),y.mid=this.updateEnvelope(y.mid,d,r,.065,.32),y.high=this.updateEnvelope(y.high,f,r,.022,.14),y.energy=this.updateEnvelope(y.energy,m,r,.05,.36),y.motion=this.updateEnvelope(y.motion,this.audioTargets.motion,r,.05,.25),y.brightness=this.updateEnvelope(y.brightness,this.audioTargets.brightness,r,.06,.3),y.texture=this.updateEnvelope(y.texture,this.audioTargets.texture,r,.08,.35),y.smoothness=this.updateEnvelope(y.smoothness,this.audioTargets.smoothness,r,.1,.45),y.kick=this.updateEnvelope(y.kick,g,r,.008,.22),y.snare=this.updateEnvelope(y.snare,_,r,.008,.3),y.hihat=this.updateEnvelope(y.hihat,v,r,.004,.08);let b=this.settings.beatSensitivity>0?.5/this.settings.beatSensitivity:99;g>b&&this._lastKickInput<=b&&(this._kickProgress=0),_>.38&&this._lastSnareInput<=.38&&(this._snareProgress=0),this._lastKickInput=g,this._lastSnareInput=_;let x=!!i?.isDownbeat;x&&!this._lastDownbeatInput&&(this._downbeatProgress=0,this._downbeatEnvelope=Math.max(this._downbeatEnvelope,i.downbeat||g||.65)),this._lastDownbeatInput=x,this.audioEnergy.bass=y.bass,this.audioEnergy.mid=y.mid,this.audioEnergy.high=y.high,this.audioEnergy.amplitude=y.energy,this.audioFeature={energy:y.energy,bass:y.bass,mid:y.mid,high:y.high,motion:y.motion,brightness:y.brightness,texture:y.texture,smoothness:y.smoothness,variation:i&&i.variation||0,energyTrend:i&&i.energyTrend||0,kick:y.kick,snare:y.snare,hihat:y.hihat,downbeat:this._downbeatEnvelope},this.isAudioPlaying=!0}updateAudioData(){}setEffectMode(e){return console.log(`[Animation44] 模式: ${e}`),!0}render(){if(!this._isReady||!this.composer||!this.material)return;let e=this._time*.001,t=1/60;if(this._lastFrameTime>0&&e>0&&(t=p.clamp(e-this._lastFrameTime,1/240,.05),this.time+=t),this._lastFrameTime=e,!this.hasAudioData){let e=Math.exp(-t/.35);Object.keys(this.audioVisual).forEach(t=>{this.audioVisual[t]*=e}),this.audioEnergy.bass=this.audioVisual.bass,this.audioEnergy.mid=this.audioVisual.mid,this.audioEnergy.high=this.audioVisual.high,this.audioEnergy.amplitude=this.audioVisual.energy,this.audioEnergy.amplitude<.001&&(this.isAudioPlaying=!1,this.audioFeature=null)}let n=this.audioFeature,r=!!(this.settings.audioDriven&&this.isAudioPlaying&&n);this._kickProgress=Math.min(1,this._kickProgress+t*1.9),this._snareProgress=Math.min(1,this._snareProgress+t*1.45),this._downbeatProgress=Math.min(1,this._downbeatProgress+t*1.05),this._downbeatEnvelope*=Math.exp(-t/.38),(r||Math.abs(this.smoothState.b-this.settings.b)>=1e-4)&&this.time-this._lastAttractorUpdate>=1/12&&(this._lastAttractorUpdate=this.time,this.updateParticles());let i=this.settings.bloomStrength;r?(i=this.settings.bloomStrength+n.high*this.settings.bloomHighSensitivity*.4+n.kick*.045+n.downbeat*.065,this.controls.autoRotate&&(this.controls.autoRotateSpeed=this.settings.autoRotateSpeed*(1+n.variation*this.settings.variationRotateSensitivity))):this.controls.autoRotateSpeed+=(this.settings.autoRotateSpeed-this.controls.autoRotateSpeed)*(1-Math.exp(-t/.35)),this._bloomEnvelope=this.updateEnvelope(this._bloomEnvelope,i,t,.018,.2),this.bloomPass.strength=this._bloomEnvelope;let a=this.audioVisual,o=this.material.uniforms;if(o.uTime.value=this.time*this.settings.colorSpeed,o.uBrightness.value=this.settings.particleBrightness,o.uOpacity.value=this.settings.lineOpacity,o.uBass.value=r?a.bass*this.settings.bassScaleSensitivity:0,o.uMid.value=r?a.mid:0,o.uHigh.value=r?a.high:0,o.uMotion.value=r?a.motion*this.settings.motionTurbulenceSensitivity:0,o.uEnergy.value=r?a.energy*this.settings.energyColorSensitivity:0,o.uAudioBrightness.value=r?a.brightness*(this.settings.brightnessHueSensitivity/90):0,o.uHueRange.value=this.settings.hueRange/360,o.uSaturationRange.value=this.settings.saturationRange,o.uLowWeight.value=this.settings.lowColorWeight,o.uMidWeight.value=this.settings.midColorWeight,o.uHighWeight.value=this.settings.highColorWeight,o.uTexture.value=r?a.texture:0,o.uSmoothness.value=r?a.smoothness:.5,o.uRibbonStrength.value=this.settings.colorRibbonStrength,o.uKick.value=r?a.kick:0,o.uSnare.value=r?a.snare:0,o.uDownbeat.value=r?this._downbeatEnvelope:0,o.uKickProgress.value=this._kickProgress,o.uSnareProgress.value=this._snareProgress,o.uDownbeatProgress.value=this._downbeatProgress,this.glowMaterial){let e=this.glowMaterial.uniforms;Object.keys(o).forEach(t=>{t!==`uBrightness`&&t!==`uOpacity`&&(e[t].value=o[t].value)}),e.uBrightness.value=.34+a.energy*.12,e.uOpacity.value=.1+a.high*.055}if(this.sparkleMaterial){this.sparkleMaterial.uniforms.uTime.value=this.time,this.sparkleMaterial.uniforms.uHigh.value=r?a.high:0,this.sparkleMaterial.uniforms.uHihat.value=r?a.hihat:0,this.sparkleMaterial.uniforms.uBass.value=r?a.bass*this.settings.bassScaleSensitivity:0,this.sparkleMaterial.uniforms.uMid.value=r?a.mid:0,this.sparkleMaterial.uniforms.uMotion.value=r?a.motion*this.settings.motionTurbulenceSensitivity:0;let e=.62+this.time*this.settings.colorSpeed*.012+a.brightness*(this.settings.brightnessHueSensitivity/90)*.16-a.bass*this.settings.lowColorWeight*.12+a.mid*this.settings.midColorWeight*.08+a.high*this.settings.highColorWeight*.2;this.sparkleMaterial.uniforms.uColor.value.setHSL((e%1+1)%1,p.clamp(.62*this.settings.saturationRange,0,1),.84)}this.controls.update(),this.composer.render()}dispose(){this.resizeHandler&&window.removeEventListener(`resize`,this.resizeHandler),this.controls&&this.controls.dispose(),this.line&&this.scene.remove(this.line),this.glowLine&&this.scene.remove(this.glowLine),this.stars&&this.scene.remove(this.stars),this.sparkles&&this.scene.remove(this.sparkles),this.geometry&&this.geometry.dispose(),this.material&&this.material.dispose(),this.glowMaterial&&this.glowMaterial.dispose(),this.sparkleGeometry&&this.sparkleGeometry.dispose(),this.sparkleMaterial&&this.sparkleMaterial.dispose(),this.stars?.geometry&&this.stars.geometry.dispose(),this.stars?.material&&this.stars.material.dispose(),this.composer&&this.composer.dispose(),this.bloomPass?.dispose&&this.bloomPass.dispose(),y(this.settingsButton,this.guiContainer,this.gui),this.settingsButton=null,this.guiContainer=null,this.renderer&&this.renderer.dispose()}};export{C as default};