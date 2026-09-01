import{a as e}from"./lil-gui.esm-jlbWO7FJ.js";import{$n as t,Bt as n,Jn as r,Tt as i,Ut as a,Wt as o,_t as s,g as c,l,qn as u,r as d,u as f,wr as p,xt as m}from"./three.module-CgISyWQV.js";import{n as h,r as g,t as _}from"./OutputPass-D9GSoAm2.js";import{t as v}from"./UnrealBloomPass-1z79deN3.js";import{i as y,n as b,r as x,t as S}from"./GUIHelper-DspWBXk2.js";var C=class{constructor(e,t={}){this.canvas=e,this.settings={bloomStrength:.5,bloomRadius:.2,bloomThreshold:.6,exposure:.4,particleSize:1,baseHue:.58,colorSpread:.42,colorSpeed:.025,audioColorResponse:.85,bassBreath:1,kickExplosion:1,midFlow:1,highTurbulence:1,snareRotation:1,hihatGlitter:1,audioSensitivity:1,bassRelease:.48,kickRelease:.22,hihatRelease:.085,snareWaveSpeed:2.1,motionSensitivity:1,brightnessSensitivity:1,textureSensitivity:1,smoothnessSensitivity:1,downbeatStrength:1,maxAudioDisplacement:18,cameraSpeed:8,trailLength:1.5,trailOpacity:1,trailWidth:1,trailSpeedResponse:1,trailBeatResponse:1,backgroundColor:0,...t},this.defaultSettings={...this.settings},this.scene=null,this.camera=null,this.renderer=null,this.composer=null,this.bloomPass=null,this.starSystem=null,this.starGeometry=null,this.starMaterial=null,this.STAR_COUNT=2e5,this.TRAIL_COUNT=12e3,this.trailStarIndices=null,this.trailGeometry=null,this.trailMesh=null,this.trailMaterial=null,this.nebula=null,this.nebulaMat=null,this.coreLight=null,this.bass=0,this.mid=0,this.high=0,this.kickDetected=0,this.snareDetected=0,this.hihatDetected=0,this.audioTargets={bass:0,mid:0,high:0,kick:0,snare:0,hihat:0},this.lastKickInput=0,this.lastSnareInput=0,this.kickPulseProgress=1,this.snareWaveProgress=1,this.rotationPhase=0,this.cameraTime=0,this.cameraState={speed:8,targetSpeed:8,shake:0},this.cameraTravel=0,this.gui=null,this.guiContainer=null,this.guiVisible=!1,this.lastTime=0,this.hasAudioData=!1,this.performance={sampleTime:0,frameCount:0,averageFps:60,qualityLevel:2,cooldown:0},this.motion=0,this.brightness=0,this.texture=0,this.smoothness=0,this.bpm=0,this.quarter=0,this.isDownbeat=!1,this.settingsButton=null,this.ready=this.init().catch(e=>(console.error(`❌ Animation2 初始化失败:`,e),!1))}async init(){try{return await this.setupThreeJS(),this.createStarSystem(),this.createNebula(),this.TRAIL_COUNT=this.getTrailCount(),this.createTrailSystem(),this.setupPostProcessing(),this.setupGUI(),this.setupSettingsButton(),console.log(`✅ Animation2 初始化成功`),!0}catch(e){throw console.error(`❌ Animation2 初始化失败:`,e),e}}async setupThreeJS(){this.scene=new u;let{width:e,height:t}=this.getViewportSize();this.camera=new n(60,e/t,.1,3e3),this.camera.position.set(0,0,30),this.renderer=new d({canvas:this.canvas,antialias:!0,alpha:!0}),this.renderer.setSize(e,t,!1),this.renderer.setClearColor(0,0),this.renderer.setPixelRatio(this.getPixelRatio()),this.renderer.outputColorSpace=s,this.renderer.toneMapping=4,this.renderer.toneMappingExposure=this.settings.exposure,this.canvas.style.backgroundColor=`transparent`,this.canvas.style.zIndex=`1`,this.coreLight=new a(6719743,2,800),this.coreLight.position.set(0,0,0),this.scene.add(this.coreLight)}createStarSystem(){this.starSystem&&(this.scene.remove(this.starSystem),this.starGeometry&&this.starGeometry.dispose(),this.starMaterial&&this.starMaterial.dispose()),this.starGeometry=new f;let e=new Float32Array(this.STAR_COUNT*3),t=new Float32Array(this.STAR_COUNT*3),n=new Float32Array(this.STAR_COUNT),i=new Float32Array(this.STAR_COUNT);for(let r=0;r<this.STAR_COUNT;r++){let a=r*3,o=Math.random()**.7*500,s=r%5/5*Math.PI*2+o*.018+(Math.random()-.5)*.8,c=Math.random()**2;e[a]=Math.cos(s)*o+(Math.random()-.5)*60,e[a+1]=(Math.random()-.5)*40*c,e[a+2]=Math.sin(s)*o+(Math.random()-.5)*60,t[a]=Math.sin(s)*.05,t[a+1]=(Math.random()-.5)*.02,t[a+2]=Math.cos(s)*.05,i[r]=Math.random()*3+.5,n[r]=Math.random()}this.starGeometry.setAttribute(`position`,new l(e,3)),this.starGeometry.setAttribute(`velocity`,new l(t,3)),this.starGeometry.setAttribute(`seed`,new l(n,1)),this.starGeometry.setAttribute(`size`,new l(i,1)),this.starMaterial=new r({transparent:!0,depthWrite:!1,blending:2,uniforms:{time:{value:0},uBass:{value:0},uMid:{value:0},uHigh:{value:0},uKick:{value:0},uSnare:{value:0},uHihat:{value:0},uKickPhase:{value:1},uSnareWave:{value:1},uDownbeat:{value:0},uRotationPhase:{value:0},uMaxDisplacement:{value:this.settings.maxAudioDisplacement},uSizeMult:{value:this.settings.particleSize},uBaseHue:{value:this.settings.baseHue},uColorSpread:{value:this.settings.colorSpread},uColorSpeed:{value:this.settings.colorSpeed},uAudioColorResponse:{value:this.settings.audioColorResponse}},vertexShader:`
                attribute vec3 velocity;
                attribute float size;
                attribute float seed;
                uniform float time;
                uniform float uBass;
                uniform float uMid;
                uniform float uHigh;
                uniform float uKick;
                uniform float uSnare;
                uniform float uHihat;
                uniform float uKickPhase;
                uniform float uSnareWave;
                uniform float uDownbeat;
                uniform float uRotationPhase;
                uniform float uMaxDisplacement;
                uniform float uSizeMult;
                varying float vAlpha;
                varying float vSeed;
                varying float vRadius;

                
            vec3 hash33(vec3 p){
                p = vec3(
                    dot(p, vec3(127.1, 311.7, 74.7)),
                    dot(p, vec3(269.5, 183.3, 246.1)),
                    dot(p, vec3(113.5, 271.9, 124.6))
                );
                return fract(sin(p) * 43758.5453);
            }
            float noise(vec3 p){
                vec3 i = floor(p);
                vec3 f = fract(p);
                f = f * f * (3.0 - 2.0 * f);
                return mix(
                    mix(mix(hash33(i).x, hash33(i + vec3(1,0,0)).x, f.x),
                        mix(hash33(i + vec3(0,1,0)).x, hash33(i + vec3(1,1,0)).x, f.x), f.y),
                    mix(mix(hash33(i + vec3(0,0,1)).x, hash33(i + vec3(1,0,1)).x, f.x),
                        mix(hash33(i + vec3(0,1,1)).x, hash33(i + vec3(1,1,1)).x, f.x), f.y),
                    f.z
                );
            }
            vec3 curlNoise(vec3 p){
                float e = 0.1;
                float n1 = noise(p + vec3(0, e, 0));
                float n2 = noise(p - vec3(0, e, 0));
                float n3 = noise(p + vec3(e, 0, 0));
                float n4 = noise(p - vec3(e, 0, 0));
                float n5 = noise(p + vec3(0, 0, e));
                float n6 = noise(p - vec3(0, 0, e));
                return normalize(vec3(n1 - n2, n3 - n4, n5 - n6));
            }
        

                void main(){
                    vec3 p = position;

                    float radiusNorm = clamp(length(p.xz) / 500.0, 0.0, 1.0);

                    // Kick：核心先收缩再爆发，外圈保持构图稳定。
                    float coreMask = 1.0 - smoothstep(0.12, 0.58, radiusNorm);
                    float contract = exp(-pow((uKickPhase - 0.10) / 0.09, 2.0));
                    float explode = exp(-pow((uKickPhase - 0.42) / 0.20, 2.0));
                    float kickShape = explode - contract * 0.45;
                    float kickPush = clamp(uKick * kickShape * coreMask * 10.0, -uMaxDisplacement, uMaxDisplacement);
                    vec3 dir = normalize(p + 0.001);
                    p += dir * kickPush;

                    // Bass breathing
                    float breathe = 1.0 + uBass * 0.15;
                    p *= breathe;

                    // Snare：沿旋臂向外传播的扭曲波，不再用绝对时间造成旋转跳变。
                    float waveCenter = 0.12 + uSnareWave * 0.9;
                    float snareWave = exp(-pow((radiusNorm - waveCenter) / 0.09, 2.0)) * uSnare;
                    float angle = time * 0.05 + uRotationPhase + snareWave * 0.32;
                    float c = cos(angle);
                    float s = sin(angle);
                    p.xz = mat2(c, -s, s, c) * p.xz;
                    p.y += snareWave * sin(seed * 31.0 + radiusNorm * 20.0) * 5.0;

                    // Curl noise flow — modulated by mid（flowStrength/flowSpeed 值硬编码为 0.35/0.25）
                    float flowScale = 0.002;
                    float speedScale = time * 0.25;
                    vec3 flow = curlNoise(p * flowScale + speedScale);
                    float flowMod = 1.0 + uMid * 1.2;
                    p += flow * min(7.0 * flowMod, uMaxDisplacement);

                    // Turbulence — modulated by high
                    float turbScale = 1.0 + uHigh * 1.5;
                    p.x += sin(time * 0.7 + seed * 10.0) * 2.0 * turbScale;
                    p.y += cos(time + seed * 5.0) * 2.0 * turbScale;

                    vec4 mv = modelViewMatrix * vec4(p, 1.0);

                    // Hihat 只点亮外围的一部分小星，避免全屏同步闪烁。
                    float glitterMask = step(0.72, fract(seed * 91.731)) * smoothstep(0.45, 0.9, radiusNorm);
                    float glitter = glitterMask * uHihat;
                    float sizePulse = 1.0 + uBass * 0.45 + glitter * 1.15 + uDownbeat * 0.18;
                    // 保护：粒子越过相机平面时点大小不取异常值
                    float viewZ = -mv.z;
                    gl_PointSize = viewZ > 0.1 ? size * sizePulse * uSizeMult * 0.8 * (350.0 / viewZ) : 0.5;

                    float h = fract(sin(seed) * 43758.5453);
                    vAlpha = clamp((0.48 + 0.42 * h) * (0.72 + 0.22 * uHigh) + glitter * 0.55, 0.0, 1.0);
                    vSeed = seed;
                    vRadius = radiusNorm;

                    gl_Position = projectionMatrix * mv;
                }
            `,fragmentShader:`
                varying float vAlpha;
                varying float vSeed;
                varying float vRadius;
                uniform float time;
                uniform float uBass;
                uniform float uMid;
                uniform float uHigh;
                uniform float uKick;
                uniform float uSnare;
                uniform float uHihat;
                uniform float uBaseHue;
                uniform float uColorSpread;
                uniform float uColorSpeed;
                uniform float uAudioColorResponse;

                // HSV → RGB conversion
                vec3 hsv2rgb(vec3 c) {
                    vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
                    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
                    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
                }

                void main(){
                    vec2 uv = gl_PointCoord - 0.5;
                    float d = length(uv);
                    float glow = smoothstep(0.5, 0.05, d);

                    // 空间色带沿旋臂展开，时间只负责缓慢流动，避免整屏同步换色。
                    float seedBand = fract(vSeed * 13.731 + vRadius * 1.7) - 0.5;
                    float hue = uBaseHue + seedBand * uColorSpread + time * uColorSpeed;

                    // 各频段拥有明确色彩角色：Bass 暖金、Mid 洋红、High 青蓝。
                    vec3 baseColor = hsv2rgb(vec3(fract(hue), 0.78, 0.88));
                    vec3 bassColor = hsv2rgb(vec3(0.075, 0.88, 1.0));
                    vec3 midColor  = hsv2rgb(vec3(0.90, 0.78, 1.0));
                    vec3 highColor = hsv2rgb(vec3(0.52, 0.72, 1.0));
                    float response = uAudioColorResponse;
                    float totalBand = uBass + uMid + uHigh + 0.0001;
                    vec3 audioColor =
                        (bassColor * uBass + midColor * uMid + highColor * uHigh) / totalBand;
                    float audioMix = clamp(max(max(uBass, uMid), uHigh) * response * 0.68, 0.0, 0.78);
                    vec3 color = mix(baseColor, audioColor, audioMix);

                    // 镲片产生局部青色闪烁，军鼓推向洋红，底鼓给出短促暖金爆发。
                    color = mix(color, highColor, clamp(uHihat * response * 0.35, 0.0, 0.5));
                    color = mix(color, midColor, clamp(uSnare * response * 0.22, 0.0, 0.4));
                    color = mix(color, vec3(1.0, 0.58, 0.18), clamp(uKick * response * 0.18, 0.0, 0.28));
                    color *= 0.9 + min(uBass * 0.08 + uKick * 0.08, 0.18);

                    gl_FragColor = vec4(color, glow * vAlpha);
                }
            `}),this.starSystem=new o(this.starGeometry,this.starMaterial),this.scene.add(this.starSystem)}createTrailSystem(){this.trailMesh&&(this.scene.remove(this.trailMesh),this.trailGeometry&&this.trailGeometry.dispose(),this.trailMaterial&&this.trailMaterial.dispose()),this.trailStarIndices=new Uint32Array(this.TRAIL_COUNT);let e=new Float32Array(this.TRAIL_COUNT*6*3),t=new Float32Array(this.TRAIL_COUNT*6*3),n=new Float32Array(this.TRAIL_COUNT*6*2),a=new Float32Array(this.TRAIL_COUNT*6),o=this.starGeometry.attributes.position.array,s=this.starGeometry.attributes.velocity.array,u=[0,0,.5,1,.5,-1,.5,1,1,0,.5,-1];for(let r=0;r<this.TRAIL_COUNT;r++){let i=Math.floor(r*this.STAR_COUNT/this.TRAIL_COUNT);this.trailStarIndices[r]=i;let c=i*3;for(let l=0;l<6;l++){let d=r*6+l,f=d*3,p=d*2;e[f]=o[c],e[f+1]=o[c+1],e[f+2]=o[c+2],t[f]=s[c],t[f+1]=s[c+1],t[f+2]=s[c+2],n[p]=u[l*2],n[p+1]=u[l*2+1],a[d]=i%997/997}}this.trailGeometry=new f,this.trailGeometry.setAttribute(`position`,new l(e,3)),this.trailGeometry.setAttribute(`trailVelocity`,new l(t,3)),this.trailGeometry.setAttribute(`trailCoord`,new l(n,2)),this.trailGeometry.setAttribute(`trailSeed`,new l(a,1)),this.trailMaterial=new r({transparent:!0,blending:2,depthWrite:!1,side:2,uniforms:{uLength:{value:this.settings.trailLength},uWidth:{value:this.settings.trailWidth},uStretch:{value:1},uCameraSpeed:{value:this.settings.cameraSpeed},uOpacity:{value:this.settings.trailOpacity},uColor:{value:new c(8961023)},uHigh:{value:0},uKick:{value:0}},vertexShader:`
        attribute vec3 trailVelocity;
        attribute vec2 trailCoord;
        attribute float trailSeed;
        uniform float uLength;
        uniform float uWidth;
        uniform float uStretch;
        uniform float uCameraSpeed;
        uniform float uHigh;
        uniform float uKick;
        varying float vTrailAlpha;
        varying float vTrailSeed;

        void main() {
          vec3 tail = -trailVelocity * uLength * uStretch;
          tail.z -= uCameraSpeed * 0.035 * uLength;
          vec3 direction = normalize(tail + vec3(0.0001));
          vec3 side = cross(direction, vec3(0.0, 1.0, 0.0));
          if (length(side) < 0.01) side = cross(direction, vec3(1.0, 0.0, 0.0));
          side = normalize(side);
          float widthProfile = sin(trailCoord.x * 3.14159265);
          float audioWidth = uWidth * (0.14 + min(uHigh * 0.04 + uKick * 0.08, 0.1));
          vec3 p = position + tail * trailCoord.x + side * trailCoord.y * audioWidth * widthProfile;
          vTrailAlpha = 1.0 - trailCoord.x;
          vTrailSeed = trailSeed;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,fragmentShader:`
        uniform float uOpacity;
        uniform vec3 uColor;
        uniform float uHigh;
        uniform float uKick;
        varying float vTrailAlpha;
        varying float vTrailSeed;

        void main() {
          float shimmer = 0.86 + 0.14 * sin(vTrailSeed * 45.0 + uHigh * 8.0);
          vec3 color = mix(uColor, vec3(1.0, 0.72, 0.34), clamp(uKick * 0.32, 0.0, 0.32));
          gl_FragColor = vec4(color * shimmer, uOpacity * vTrailAlpha * vTrailAlpha);
        }
      `}),this.trailMesh=new i(this.trailGeometry,this.trailMaterial),this.trailMesh.frustumCulled=!1,this.scene.add(this.trailMesh)}createNebula(){this.nebula&&(this.scene.remove(this.nebula),this.nebula.geometry&&this.nebula.geometry.dispose(),this.nebulaMat&&this.nebulaMat.dispose());let e=new t(1200,64,64);this.nebulaMat=new r({side:1,transparent:!0,uniforms:{time:{value:0}},vertexShader:`
                varying vec3 vPos;
                void main(){ vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
            `,fragmentShader:`
                uniform float time; varying vec3 vPos;
                float hash(vec3 p){ return fract(sin(dot(p, vec3(12.4,78.2,45.6)))*43758.5); }
                // 平滑 3D 噪声（替代纯 hash，避免星云表面每帧闪烁）
                float noise(vec3 p){
                    vec3 i = floor(p);
                    vec3 f = fract(p);
                    f = f*f*(3.0-2.0*f);
                    return mix(
                        mix(mix(hash(i), hash(i+vec3(1,0,0)), f.x),
                            mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), f.x), f.y),
                        mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), f.x),
                            mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), f.x), f.y),
                        f.z);
                }
                void main(){
                    vec3 dir = normalize(vPos);
                    float n = noise(dir * 4.0 + vec3(0.0, 0.0, time * 0.03));
                    vec3 col = mix(vec3(0.0,0.0,0.0), vec3(0.005,0.008,0.015), n);
                    gl_FragColor = vec4(col, 0.02);
                }
            `}),this.nebula=new i(e,this.nebulaMat),this.scene.add(this.nebula)}setupPostProcessing(){let e=new h(this.scene,this.camera);this.bloomPass=new v(new p(window.innerWidth,window.innerHeight),this.settings.bloomStrength,this.settings.bloomRadius,this.settings.bloomThreshold),this.composer=new g(this.renderer),this.composer.addPass(e),this.composer.addPass(this.bloomPass),this.composer.addPass(new _)}setupGUI(){this.createGUIContainer();let t={resetParams:()=>{Object.assign(this.settings,this.defaultSettings),this.resetState(),this.bloomPass.strength=this.settings.bloomStrength,this.bloomPass.radius=this.settings.bloomRadius,this.bloomPass.threshold=this.settings.bloomThreshold,this.renderer.toneMappingExposure=this.settings.exposure,this.starMaterial.uniforms.uSizeMult.value=this.settings.particleSize,this.syncColorUniforms(),this.camera.position.set(0,0,30),this.cameraState.speed=this.settings.cameraSpeed,this.cameraState.targetSpeed=this.settings.cameraSpeed;let e=t=>{t.controllers.forEach(e=>e.updateDisplay()),t.folders&&Object.values(t.folders).forEach(t=>e(t))};e(this.gui)}};this.gui=new e({title:`星雨流光`,container:this.guiContainer});let n=this.gui.addFolder(`基础视觉`);n.add(this.settings,`particleSize`,.3,2.5,.05).name(`粒子大小`).onChange(e=>{this.starMaterial&&(this.starMaterial.uniforms.uSizeMult.value=e)}),n.add(this.settings,`baseHue`,0,1,.001).name(`基础色相`),n.add(this.settings,`colorSpread`,0,1,.01).name(`色彩范围`),n.add(this.settings,`colorSpeed`,-.12,.12,.001).name(`色彩流速`),n.open();let r=this.gui.addFolder(`音频响应`);r.add(this.settings,`audioSensitivity`,0,3,.05).name(`主灵敏度`),r.add(this.settings,`bassBreath`,0,3,.1).name(`Bass 呼吸`),r.add(this.settings,`midFlow`,0,3,.1).name(`Mid 流动`),r.add(this.settings,`highTurbulence`,0,3,.1).name(`High 湍流`),r.add(this.settings,`kickExplosion`,0,2,.05).name(`Kick 爆发`),r.add(this.settings,`downbeatStrength`,0,3,.1).name(`强拍脉冲`);let i=this.gui.addFolder(`相机与拖尾`);i.add(this.settings,`cameraSpeed`,1,30,.5).name(`镜头速度`),i.add(this.settings,`trailLength`,.2,6,.1).name(`拖尾长度`),i.add(this.settings,`trailOpacity`,0,1,.01).name(`拖尾透明度`),i.add(this.settings,`trailWidth`,.1,3,.05).name(`拖尾粗细`);let a=this.gui.addFolder(`后期效果`);a.add(this.settings,`bloomStrength`,0,3,.01).name(`Bloom 强度`).onChange(e=>{this.bloomPass.strength=e}),a.add(this.settings,`bloomRadius`,0,1,.01).name(`Bloom 半径`).onChange(e=>{this.bloomPass.radius=e}),a.add(this.settings,`bloomThreshold`,0,1,.01).name(`Bloom 阈值`).onChange(e=>{this.bloomPass.threshold=e}),a.add(this.settings,`exposure`,0,3,.01).name(`曝光度`);let o=this.gui.addFolder(`高级设置`);o.add(this.settings,`audioColorResponse`,0,2,.01).name(`音频色彩响应`),o.add(this.settings,`snareRotation`,0,3,.1).name(`Snare 旋臂波`),o.add(this.settings,`hihatGlitter`,0,3,.1).name(`Hihat 闪烁`),o.add(this.settings,`maxAudioDisplacement`,4,30,.5).name(`最大音频位移`),o.add(this.settings,`bassRelease`,.1,1,.01).name(`Bass 释放时间`),o.add(this.settings,`kickRelease`,.05,.5,.01).name(`Kick 释放时间`),o.add(this.settings,`hihatRelease`,.03,.25,.005).name(`Hihat 释放时间`),o.add(this.settings,`snareWaveSpeed`,.5,5,.1).name(`Snare 波速`),o.add(this.settings,`motionSensitivity`,0,3,.1).name(`Motion 抖动`),o.add(this.settings,`brightnessSensitivity`,0,3,.1).name(`Brightness 色彩`),o.add(this.settings,`textureSensitivity`,0,3,.1).name(`Texture 微动`),o.add(this.settings,`smoothnessSensitivity`,0,3,.1).name(`Smoothness 饱和度`),o.add(this.settings,`trailSpeedResponse`,0,2,.05).name(`速度拖尾响应`),o.add(this.settings,`trailBeatResponse`,0,2,.05).name(`强拍拖尾响应`),this.gui.add(t,`resetParams`).name(`重置参数`),this.gui.hide()}createGUIContainer(){this.guiContainer=x(`Animation2-gui-container`),S(`Animation2-gui-container`),document.body.appendChild(this.guiContainer)}setupSettingsButton(){this.settingsButton=y(`Animation2-settings-button`),this.settingsButton.addEventListener(`click`,()=>{this.guiVisible=!this.guiVisible,this.guiVisible?this.gui.show():this.gui.hide()}),document.body.appendChild(this.settingsButton)}updateAudioAnalysis(){if(this.hasAudioData||this.bass>.001||this.mid>.001||this.high>.001||this.kickDetected>.001||this.snareDetected>.001||this.hihatDetected>.001){let e=this.settings.audioSensitivity,t=this.bass*e*this.settings.bassBreath,n=this.mid*e*this.settings.midFlow,r=this.high*e*this.settings.highTurbulence,i=this.kickDetected*e*this.settings.kickExplosion,a=this.snareDetected*e*this.settings.snareRotation,o=this.hihatDetected*e*this.settings.hihatGlitter;this.starMaterial&&(this.starMaterial.uniforms.uBass.value=t,this.starMaterial.uniforms.uMid.value=n,this.starMaterial.uniforms.uHigh.value=r,this.starMaterial.uniforms.uKick.value=i,this.starMaterial.uniforms.uSnare.value=a,this.starMaterial.uniforms.uHihat.value=o,this.starMaterial.uniforms.uKickPhase.value=this.kickPulseProgress,this.starMaterial.uniforms.uSnareWave.value=this.snareWaveProgress,this.starMaterial.uniforms.uDownbeat.value=this.isDownbeat?this.settings.downbeatStrength:0,this.starMaterial.uniforms.uRotationPhase.value=this.rotationPhase,this.starMaterial.uniforms.uMaxDisplacement.value=this.settings.maxAudioDisplacement,this.starMaterial.uniforms.uSizeMult.value=this.settings.particleSize);let s=this.settings.bloomStrength+this.bass*e*1.2*this.settings.bassBreath+this.kickDetected*e*2*this.settings.kickExplosion;this.bloomPass.strength=Math.min(s,6)}else this.bass*=.95,this.mid*=.95,this.high*=.95,this.bass<.001&&(this.bass=0),this.mid<.001&&(this.mid=0),this.high<.001&&(this.high=0),this.starMaterial&&(this.starMaterial.uniforms.uBass.value=0,this.starMaterial.uniforms.uMid.value=0,this.starMaterial.uniforms.uHigh.value=0,this.starMaterial.uniforms.uKick.value=0,this.starMaterial.uniforms.uSnare.value=0,this.starMaterial.uniforms.uHihat.value=0,this.starMaterial.uniforms.uSizeMult.value=this.settings.particleSize),this.bloomPass.strength=this.settings.bloomStrength,this.kickDetected*=.92,this.snareDetected*=.9,this.hihatDetected*=.88,this.kickDetected=Math.max(0,this.kickDetected),this.snareDetected=Math.max(0,this.snareDetected),this.hihatDetected=Math.max(0,this.hihatDetected)}syncColorUniforms(){if(!this.starMaterial)return;let e=this.starMaterial.uniforms;e.uBaseHue.value=this.settings.baseHue,e.uColorSpread.value=this.settings.colorSpread,e.uColorSpeed.value=this.settings.colorSpeed,e.uAudioColorResponse.value=this.settings.audioColorResponse}updateEnvelope(e,t,n,r,i){let a=t>e?r:i,o=1-Math.exp(-n/Math.max(a,.001));return e+(t-e)*o}updateVisualEnvelopes(e){let t=this.audioTargets;this.bass=this.updateEnvelope(this.bass,t.bass,e,.055,this.settings.bassRelease),this.mid=this.updateEnvelope(this.mid,t.mid,e,.065,.34),this.high=this.updateEnvelope(this.high,t.high,e,.025,.18),this.kickDetected=this.updateEnvelope(this.kickDetected,t.kick,e,.012,this.settings.kickRelease),this.snareDetected=this.updateEnvelope(this.snareDetected,t.snare,e,.01,.3),this.hihatDetected=this.updateEnvelope(this.hihatDetected,t.hihat,e,.006,this.settings.hihatRelease),t.kick>.42&&this.lastKickInput<=.42&&(this.kickPulseProgress=0),t.snare>.42&&this.lastSnareInput<=.42&&(this.snareWaveProgress=0),this.lastKickInput=t.kick,this.lastSnareInput=t.snare,this.kickPulseProgress=Math.min(1,this.kickPulseProgress+e*2.4),this.snareWaveProgress=Math.min(1,this.snareWaveProgress+e*this.settings.snareWaveSpeed),this.rotationPhase=(this.rotationPhase+this.snareDetected*e*.7)%(Math.PI*2)}updateCamera(e){this.cameraTime+=e;let t=this.settings.cameraSpeed,n=this.bass*6*this.settings.bassBreath,r=this.kickDetected*12*this.settings.kickExplosion,i=this.isDownbeat?8*this.settings.downbeatStrength:0;this.cameraState.targetSpeed=t+n+r+i;let a=this.motion*.12*this.settings.motionSensitivity,o=this.snareDetected*.15*this.settings.snareRotation;this.cameraState.shake+=(Math.max(a,o)-this.cameraState.shake)*e*5,this.cameraState.speed+=(this.cameraState.targetSpeed-this.cameraState.speed)*e*1.5,this.cameraTravel+=this.cameraState.speed*e;let s=this.cameraTravel/310;this.camera.position.z=30-(.5-.5*Math.cos(s*Math.PI*2))*620;let c=1+this.bass*2*this.settings.bassBreath;this.camera.position.x=Math.sin(this.cameraTime*.25)*4*c,this.camera.position.y=Math.cos(this.cameraTime*.18)*2*c;let l=this.bpm>0?Math.min(this.bpm/120,1.5):1,u=this.quarter/4;this.cameraState.shake>.001&&(this.camera.position.x+=(Math.sin(this.cameraTime*31.7)+Math.sin(this.cameraTime*47.3)*.5)*this.cameraState.shake,this.camera.position.y+=(Math.sin(this.cameraTime*37.1+1.7)+Math.sin(this.cameraTime*53.9)*.5)*this.cameraState.shake),this.camera.lookAt(this.camera.position.x*.18,this.camera.position.y*.18,this.camera.position.z-200),this.camera.rotation.z=Math.sin(this.cameraTime*.3*l+u*Math.PI*2)*.008+Math.sin(this.cameraTime*1.5)*this.hihatDetected*.01*this.settings.hihatGlitter}updateTrails(){if(!this.trailMaterial)return;let e=1+Math.min(this.cameraState.speed/30,2.2)*this.settings.trailSpeedResponse+(this.kickDetected*1.4+(this.isDownbeat?this.settings.downbeatStrength*.7:0))*this.settings.trailBeatResponse,t=this.trailMaterial.uniforms;t.uLength.value=this.settings.trailLength*(1.45+this.bass*.45+this.kickDetected*.9),t.uWidth.value=this.settings.trailWidth,t.uStretch.value=e,t.uCameraSpeed.value=this.cameraState.speed,t.uHigh.value=this.high,t.uKick.value=this.kickDetected,t.uOpacity.value=Math.min(1,this.settings.trailOpacity*(1+this.kickDetected*.65+this.high*.18));let n=this.settings.brightnessSensitivity,r=this.settings.textureSensitivity,i=this.settings.smoothnessSensitivity,a=(.55+this.bass*.12*this.settings.bassBreath+this.mid*.08*this.settings.midFlow-this.high*.06*this.settings.highTurbulence+this.snareDetected*.1*this.settings.snareRotation+this.hihatDetected*.08*this.settings.hihatGlitter+this.kickDetected*.15*this.settings.kickExplosion+(this.brightness-.5)*.06*n+this.texture*.04*r)%1,o=Math.min(1,.6+this.smoothness*.4*i),s=Math.min(1,.4+this.brightness*.3*n+this.kickDetected*.25);t.uColor.value.setHSL(Math.abs(a),o,s)}render(){try{if(!this.renderer||!this.camera||!this.scene)return;let e=performance.now()*.001,t=Math.min(.05,e-this.lastTime);this.lastTime=e,this.updatePerformanceQuality(e,t||1/60),this.updateVisualEnvelopes(t||1/60),this.starMaterial&&(this.starMaterial.uniforms.time.value=e,this.syncColorUniforms()),this.nebulaMat&&(this.nebulaMat.uniforms.time.value=e),this.updateAudioAnalysis(),this.renderer.toneMappingExposure=this.settings.exposure,this.updateCamera(t),this.updateTrails(),this.trailMesh&&(this.trailMesh.rotation.y=e*.05+this.rotationPhase),this.composer?this.composer.render():this.renderer&&this.scene&&this.camera&&this.renderer.render(this.scene,this.camera)}catch(e){console.error(`渲染错误:`,e)}}onWindowResize(){if(!this.camera||!this.renderer)return;let{width:e,height:t}=this.getViewportSize();this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t),this.renderer.setPixelRatio(this.getPixelRatio()),this.composer&&this.composer.setSize(e,t)}updatePerformanceQuality(e,t){let n=this.performance;if(n.sampleTime+=t,n.frameCount+=1,n.cooldown=Math.max(0,n.cooldown-t),n.sampleTime<1||(n.averageFps=n.frameCount/n.sampleTime,n.sampleTime=0,n.frameCount=0,n.cooldown>0))return;let r=n.averageFps<32?0:n.averageFps<45?1:n.averageFps>56?2:n.qualityLevel;if(r===n.qualityLevel)return;let i=[3500,6500,this.getTrailCount()];n.qualityLevel=r,n.cooldown=r<2?4:8;let a=i[r];a!==this.TRAIL_COUNT&&this.scene&&(this.TRAIL_COUNT=a,this.createTrailSystem())}getViewportSize(){return{width:Math.max(1,this.canvas?.clientWidth||window.innerWidth||1),height:Math.max(1,this.canvas?.clientHeight||window.innerHeight||1)}}getPixelRatio(){let e=window.devicePixelRatio||1,t=Math.min(this.getViewportSize().width,this.getViewportSize().height)<700;return Math.min(e,t?1.5:2)}getTrailCount(){let{width:e,height:t}=this.getViewportSize(),n=e*t;return n<700*700?5e3:n<1200*900?8e3:12e3}updateWithAudioData(e,t){if(e&&e.energy)if(this.hasAudioData=!!e.isPlaying,e.audioFeature&&e.audioFeature.animation){let t=e.audioFeature.animation;this.audioTargets.bass=this.hasAudioData?m.clamp(t.bass||0,0,1.5):0,this.audioTargets.mid=this.hasAudioData?m.clamp(t.mid||0,0,1.5):0,this.audioTargets.high=this.hasAudioData?m.clamp(t.high||0,0,1.5):0,this.audioTargets.kick=this.hasAudioData?m.clamp(t.kick||0,0,1):0,this.audioTargets.snare=this.hasAudioData?m.clamp(t.snare||0,0,1):0,this.audioTargets.hihat=this.hasAudioData?m.clamp(t.hihat||0,0,1):0,this.motion=t.motion,this.brightness=t.brightness,this.texture=t.texture,this.smoothness=t.smoothness,this.bpm=t.bpm,this.quarter=t.quarter,this.isDownbeat=this.hasAudioData&&!!t.isDownbeat}else{let t=e.energy.low||0,n=e.energy.mid||0,r=e.energy.high||0;this.audioTargets.bass=this.hasAudioData?m.clamp(t,0,1.5):0,this.audioTargets.mid=this.hasAudioData?m.clamp(n,0,1.5):0,this.audioTargets.high=this.hasAudioData?m.clamp(r,0,1.5):0,e.beat&&(this.audioTargets.kick=this.hasAudioData?m.clamp(e.beat.kick||0,0,1):0,this.audioTargets.snare=this.hasAudioData?m.clamp(e.beat.snare||0,0,1):0,this.audioTargets.hihat=this.hasAudioData?m.clamp(e.beat.hihat||0,0,1):0)}else this.hasAudioData=!1,Object.assign(this.audioTargets,{bass:0,mid:0,high:0,kick:0,snare:0,hihat:0}),this.motion=0,this.brightness=0,this.texture=0,this.smoothness=0}resetState(){this.bass=0,this.mid=0,this.high=0,this.hasAudioData=!1,this.kickDetected=0,this.snareDetected=0,this.hihatDetected=0,Object.assign(this.audioTargets,{bass:0,mid:0,high:0,kick:0,snare:0,hihat:0}),this.lastKickInput=0,this.lastSnareInput=0,this.kickPulseProgress=1,this.snareWaveProgress=1,this.rotationPhase=0,this.motion=0,this.brightness=0,this.texture=0,this.smoothness=0,this.bpm=0,this.quarter=0,this.isDownbeat=!1,this.cameraTime=0,this.cameraTravel=0,this.lastTime=0,this.performance.sampleTime=0,this.performance.frameCount=0,this.performance.averageFps=60,this.performance.qualityLevel=2,this.performance.cooldown=0;let e=this.getTrailCount();this.TRAIL_COUNT!==e&&this.scene&&(this.TRAIL_COUNT=e,this.createTrailSystem()),this.cameraState.speed=this.defaultSettings.cameraSpeed,this.cameraState.targetSpeed=this.defaultSettings.cameraSpeed,this.cameraState.shake=0,this.bloomPass&&(this.bloomPass.strength=this.defaultSettings.bloomStrength,this.bloomPass.radius=this.defaultSettings.bloomRadius,this.bloomPass.threshold=this.defaultSettings.bloomThreshold),this.starMaterial&&(this.starMaterial.uniforms.uBass.value=0,this.starMaterial.uniforms.uMid.value=0,this.starMaterial.uniforms.uHigh.value=0,this.starMaterial.uniforms.uKick.value=0,this.starMaterial.uniforms.uSnare.value=0,this.starMaterial.uniforms.uHihat.value=0,this.starMaterial.uniforms.uKickPhase.value=1,this.starMaterial.uniforms.uSnareWave.value=1,this.starMaterial.uniforms.uDownbeat.value=0,this.starMaterial.uniforms.uRotationPhase.value=0)}setEffectMode(e){return console.log(`当前效果模式：${e}`),!0}updateSettings(e){Object.assign(this.settings,e),e.bloomStrength!==void 0&&this.bloomPass&&(this.bloomPass.strength=e.bloomStrength),e.bloomRadius!==void 0&&this.bloomPass&&(this.bloomPass.radius=e.bloomRadius),e.bloomThreshold!==void 0&&this.bloomPass&&(this.bloomPass.threshold=e.bloomThreshold),e.exposure!==void 0&&this.renderer&&(this.renderer.toneMappingExposure=e.exposure),e.particleSize!==void 0&&this.starMaterial&&(this.starMaterial.uniforms.uSizeMult.value=e.particleSize),this.syncColorUniforms()}dispose(){try{b(this.settingsButton,this.guiContainer,this.gui),this.starSystem&&this.scene.remove(this.starSystem),this.starGeometry&&this.starGeometry.dispose(),this.starMaterial&&this.starMaterial.dispose(),this.trailMesh&&this.scene.remove(this.trailMesh),this.trailGeometry&&this.trailGeometry.dispose(),this.trailMaterial&&this.trailMaterial.dispose(),this.nebula&&(this.scene.remove(this.nebula),this.nebula.geometry&&this.nebula.geometry.dispose(),this.nebulaMat&&this.nebulaMat.dispose()),this.coreLight&&this.scene.remove(this.coreLight),this.composer&&this.composer.dispose(),this.renderer&&this.renderer.dispose(),this.starSystem=null,this.starGeometry=null,this.starMaterial=null,this.trailMesh=null,this.trailGeometry=null,this.trailMaterial=null,this.nebula=null,this.nebulaMat=null,this.coreLight=null,this.composer=null,this.renderer=null,this.camera=null,this.scene=null,console.log(`✅ Animation2 资源已清理`)}catch(e){console.error(`❌ Animation2 资源清理失败:`,e)}}getAudioDataForUI(){return{bass:this.bass,mid:this.mid,high:this.high}}playAudio(){console.log(`音频播放由系统控制`)}pauseAudio(){console.log(`音频暂停由系统控制`)}};export{C as default};