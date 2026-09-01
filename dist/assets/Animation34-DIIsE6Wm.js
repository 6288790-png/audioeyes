import{a as e}from"./lil-gui.esm-jlbWO7FJ.js";import{Bn as t,Bt as n,Et as r,Jn as i,Tt as a,Wt as o,Y as s,_t as c,l,qn as u,r as d,u as f,wr as p}from"./three.module-CgISyWQV.js";import{i as m,n as h,r as g,t as _}from"./OutputPass-D9GSoAm2.js";import{t as v}from"./UnrealBloomPass-1z79deN3.js";import{i as y,n as b,r as x,t as S}from"./GUIHelper-DspWBXk2.js";import{t as C}from"./OrbitControls-DVnblHSy.js";import{t as w}from"./AfterimagePass-C960-4eH.js";import{t as T}from"./GPUComputationRenderer-a9_9_jwr.js";var E=class{constructor(e,t={}){this.canvas=e;let n={particleSize:.3,particleGridSize:100,particleEnergyAmplification:0,particleAudioScatter:.05,particleAudio:1,particleContainment:.004,particleRotationSpeed:0,hueSpeed:.04,hueRadiusScale:.2,hueAngleScale:.15,hueAudioShift:.8,hueBrightnessScale:.3,particleBrightness:1,diskSpeed:.05,diskPulse:.03,diskKickPulse:.1,diskVariationSpeed:.02,diskHueOffset:.1,diskSaturation:1,diskHueAudioShift:.8,coreSize:.3,corePulse:.6,coreBeatPulse:.5,shellEnergyGlow:.15,bloomStrength:1.5,bloomThreshold:.9,bloomRadius:.1,bloomEnergyAmplification:.5,bloomBeatBurst:1,chromaticAmount:.0015,chromaAudio:1,afterimageDamp:.82,exposure:1.2,exposureAudio:1,audioIntensity:1,cameraPosition:{x:8,y:-20,z:8}};this.settings={...n,...t},this.defaultSettings=n,this.scene=null,this.camera=null,this.renderer=null,this.controls=null,this.composer=null,this.gpuCompute=null,this.positionVariable=null,this.velocityVariable=null,this.particleMesh=null,this.particleMaterial=null,this.core=null,this.coreShell=null,this.disk=null,this.bloomPass=null,this.afterimagePass=null,this.chromaPass=null,this.gui=null,this.guiContainer=null,this.guiVisible=!1,this.settingsButton=null,this.lastTime=0,this._time=0,this._elapsed=0,this.bass=0,this.mid=0,this.high=0,this.energy=0,this.kick=0,this.snare=0,this.motion=0,this.brightness=0,this.variation=0,this.downbeat=0,this.hasAudioData=!1,this.init().then(()=>{}).catch(e=>{console.error(`❌ Animation34 初始化失败:`,e)})}async init(){try{return this.setupThreeJS(),this.setupComposer(),this.initGPUCompute(),this.initParticles(),this.syncParticleUniforms(),this.initCoreShell(),this.initCore(),this.initDisk(),this.setupGUI(),this.setupSettingsButton(),this.resizeHandler=()=>this.onWindowResize(),window.addEventListener(`resize`,this.resizeHandler),console.log(`✅ Animation34 彩虹奇点初始化成功`),!0}catch(e){throw console.error(`❌ Animation34 初始化失败:`,e),e}}setupThreeJS(){this.scene=new u,this.camera=new n(55,window.innerWidth/window.innerHeight,.1,500),this.camera.position.set(this.settings.cameraPosition.x,this.settings.cameraPosition.y,this.settings.cameraPosition.z),this.renderer=new d({canvas:this.canvas,antialias:!0,alpha:!0}),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.outputColorSpace=c,this.renderer.toneMapping=4,this.renderer.toneMappingExposure=this.settings.exposure,this.renderer.setClearColor(0,0),this.canvas.style.backgroundColor=`transparent`,this.canvas.style.zIndex=`1`,this.controls=new C(this.camera,this.canvas),this.controls.enableDamping=!0,this.controls.dampingFactor=.08,this.controls.minDistance=2,this.controls.maxDistance=1/0,this.controls.rotateSpeed=.8,this.controls.zoomSpeed=1.2,this.controls.target.set(0,0,0),this.controls.update(),this.controls.saveState()}setupComposer(){this.composer=new g(this.renderer),this.composer.addPass(new h(this.scene,this.camera)),this.bloomPass=new v(new p(window.innerWidth,window.innerHeight),this.settings.bloomStrength,this.settings.bloomRadius,this.settings.bloomThreshold),this.composer.addPass(this.bloomPass),this.afterimagePass=new w(this.settings.afterimageDamp),this.composer.addPass(this.afterimagePass),this.chromaPass=new m({uniforms:{tDiffuse:{value:null},amount:{value:this.settings.chromaticAmount}},vertexShader:`
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,fragmentShader:`
                uniform sampler2D tDiffuse;
                uniform float amount;
                varying vec2 vUv;
                void main() {
                    vec2 offset = vec2(amount, 0.0);
                    float r = texture2D(tDiffuse, vUv + offset).r;
                    float g = texture2D(tDiffuse, vUv).g;
                    float b = texture2D(tDiffuse, vUv - offset).b;
                    // 保留输入 alpha：透明区透出背景，避免全屏不透明
                    float a = texture2D(tDiffuse, vUv).a;
                    gl_FragColor = vec4(r, g, b, a);
                }
            `}),this.composer.addPass(this.chromaPass),this.composer.addPass(new _)}initGPUCompute(){let e=this.settings.particleGridSize;this.gpuCompute=new T(e,e,this.renderer);let t=this.gpuCompute.createTexture(),n=this.gpuCompute.createTexture(),r=t.image.data;for(let e=0;e<r.length;e+=4){let t=4+Math.random()*4,n=Math.random()*Math.PI*2,i=Math.acos(Math.random()*2-1);r[e+0]=t*Math.sin(i)*Math.cos(n),r[e+1]=t*Math.sin(i)*Math.sin(n),r[e+2]=t*Math.cos(i),r[e+3]=1}let i=n.image.data;for(let e=0;e<i.length;e+=4)i[e+0]=(Math.random()-.5)*.01,i[e+1]=(Math.random()-.5)*.01,i[e+2]=(Math.random()-.5)*.01,i[e+3]=1;this.positionVariable=this.gpuCompute.addVariable(`texturePosition`,`
            uniform float time;
            uniform float dt;
            void main() {
                vec2 uv = gl_FragCoord.xy / resolution.xy;
                vec4 pos = texture2D(texturePosition, uv);
                vec4 vel = texture2D(textureVelocity, uv);
                // dt 以 60fps 为基准（1.0=一帧），帧率无关
                pos.xyz += vel.xyz * 0.8 * dt;
                gl_FragColor = pos;
            }
        `,t),this.velocityVariable=this.gpuCompute.addVariable(`textureVelocity`,`
            uniform float time;
            uniform float dt;
            uniform float uAudioEnergy;
            uniform float uBass;
            uniform float uMid;
            uniform float uBeatKick;
            uniform float uContainment;
            float hash(vec3 p) {
                p = fract(p * 0.3183099 + 0.1);
                p *= 17.0;
                return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
            }
            float noise(vec3 p) {
                vec3 i = floor(p);
                vec3 f = fract(p);
                f = f * f * (3.0 - 2.0 * f);
                float n000 = hash(i);
                float n100 = hash(i + vec3(1,0,0));
                float n010 = hash(i + vec3(0,1,0));
                float n110 = hash(i + vec3(1,1,0));
                float n001 = hash(i + vec3(0,0,1));
                float n101 = hash(i + vec3(1,0,1));
                float n011 = hash(i + vec3(0,1,1));
                float n111 = hash(i + vec3(1,1,1));
                return mix(
                    mix(mix(n000,n100,f.x), mix(n010,n110,f.x), f.y),
                    mix(mix(n001,n101,f.x), mix(n011,n111,f.x), f.y),
                    f.z
                );
            }
            vec3 curlNoise(vec3 p) {
                float e = 0.05;
                float dx = noise(p + vec3(e,0,0)) - noise(p - vec3(e,0,0));
                float dy = noise(p + vec3(0,e,0)) - noise(p - vec3(0,e,0));
                float dz = noise(p + vec3(0,0,e)) - noise(p - vec3(0,0,e));
                return normalize(vec3(dy - dz, dz - dx, dx - dy));
            }
            void main() {
                vec2 uv = gl_FragCoord.xy / resolution.xy;
                vec4 pos = texture2D(texturePosition, uv);
                vec4 vel = texture2D(textureVelocity, uv);
                vec3 p = pos.xyz;
                // 径向单位向量（防粒子到达原点时 normalize(0) 产生 NaN 污染整个纹理）
                float pr = length(p);
                vec3 pn = pr > 0.0001 ? p / pr : vec3(0.0, 0.0, 1.0);
                // curl noise 湍流（中频增强）
                float curlStrength = 0.0015 + uMid * 0.001;
                vec3 curl = curlNoise(p * 0.4 + vec3(0.0, 0.0, time * 0.15));
                vel.xyz += curl * curlStrength * dt;
                // 向心引力（基础，近核区保持自由湍流运动，不钉死粒子）
                vel.xyz += -pn * 0.0002 * dt;
                // 远场回拉：粒子漂出 r≈7 后拉力随距离平滑增强（低音/鼓点推不散，越远拉得越狠）
                vel.xyz += -pn * smoothstep(7.0, 12.0, pr) * uContainment * dt;
                // 音频随机散射（增强：仅轻微扩散扰动，不改变云团结构）
                float scatter = uAudioEnergy * 0.02;
                vec3 rnd = vec3(
                    hash(vec3(uv, 0.0) + time * 0.5),
                    hash(vec3(uv, 1.0) + time * 0.5),
                    hash(vec3(uv, 2.0) + time * 0.5)
                ) * 2.0 - 1.0;
                vel.xyz += rnd * scatter * dt;
                // 低音径向呼吸（增强：柔和向外呼吸，幅度与向心引力同级，靠引力回弹）
                vel.xyz += pn * uBass * 0.0005 * dt;
                // 鼓点爆发（增强：瞬态向外脉动，快速衰减，不累积外推）
                vel.xyz += pn * uBeatKick * 0.003 * dt;
                if (pr > 12.0) {
                    vel.xyz -= pn * 0.003 * dt;
                }
                // 阻尼指数化，保证不同帧率下衰减速率一致
                vel.xyz *= pow(0.995, dt);
                gl_FragColor = vel;
            }
        `,n),this.gpuCompute.setVariableDependencies(this.positionVariable,[this.positionVariable,this.velocityVariable]),this.gpuCompute.setVariableDependencies(this.velocityVariable,[this.positionVariable,this.velocityVariable]),this.positionVariable.material.uniforms.time={value:0},this.velocityVariable.material.uniforms.time={value:0},this.positionVariable.material.uniforms.dt={value:1},this.velocityVariable.material.uniforms.dt={value:1},this.velocityVariable.material.uniforms.uAudioEnergy={value:0},this.velocityVariable.material.uniforms.uBass={value:0},this.velocityVariable.material.uniforms.uMid={value:0},this.velocityVariable.material.uniforms.uBeatKick={value:0},this.velocityVariable.material.uniforms.uContainment={value:this.settings.particleContainment};let a=this.gpuCompute.init();a&&console.error(`GPU Compute 初始化失败:`,a)}initParticles(){let e=this.settings.particleGridSize,t=e*e,n=new f,r=new Float32Array(t*3),a=new Float32Array(t*2),s=0,c=0;for(let t=0;t<e;t++)for(let n=0;n<e;n++)r[s++]=0,r[s++]=0,r[s++]=0,a[c++]=n/(e-1),a[c++]=t/(e-1);n.setAttribute(`position`,new l(r,3)),n.setAttribute(`uv`,new l(a,2)),this.particleMaterial=new i({transparent:!0,depthWrite:!1,blending:2,uniforms:{time:{value:0},energy:{value:0},texturePosition:{value:null},uParticleSize:{value:this.settings.particleSize},uEnergyAmplification:{value:this.settings.particleEnergyAmplification},uHueSpeed:{value:this.settings.hueSpeed},uHueRadiusScale:{value:this.settings.hueRadiusScale},uHueAngleScale:{value:this.settings.hueAngleScale},uHueAudioShift:{value:this.settings.hueAudioShift},uHueBrightness:{value:0},uHueBrightnessScale:{value:this.settings.hueBrightnessScale},uBrightness:{value:1}},vertexShader:`
                uniform sampler2D texturePosition;
                uniform float time;
                uniform float energy;
                uniform float uParticleSize;
                uniform float uEnergyAmplification;
                uniform float uHueSpeed;
                uniform float uHueRadiusScale;
                uniform float uHueAngleScale;
                uniform float uHueAudioShift;
                uniform float uHueBrightness;
                uniform float uHueBrightnessScale;
                varying float vDist;
                varying vec3 vColor;

                void main() {
                    vec4 pos = texture2D(texturePosition, uv);
                    vec3 p = pos.xyz;
                    vDist = length(p);

                    float hue = fract(vDist * uHueRadiusScale + atan(p.y, p.x) * uHueAngleScale + time * uHueSpeed + energy * uHueAudioShift + uHueBrightness * uHueBrightnessScale);
                    vec3 color = clamp(abs(mod(hue * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
                    vColor = color;

                    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
                    gl_PointSize = (uParticleSize + min(energy * uEnergyAmplification, uParticleSize * 10.0)) * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,fragmentShader:`
                uniform float uBrightness;
                varying vec3 vColor;
                void main() {
                    vec2 c = gl_PointCoord - 0.5;
                    float d = length(c);
                    float alpha = smoothstep(0.5, 0.0, d);
                    gl_FragColor = vec4(vColor * uBrightness, alpha);
                }
            `}),this.particleMesh=new o(n,this.particleMaterial),this.scene.add(this.particleMesh)}syncParticleUniforms(){this.particleMaterial&&(this.particleMaterial.uniforms.uParticleSize.value=this.settings.particleSize,this.particleMaterial.uniforms.uEnergyAmplification.value=this.settings.particleEnergyAmplification,this.particleMaterial.uniforms.uHueSpeed.value=this.settings.hueSpeed,this.particleMaterial.uniforms.uHueRadiusScale.value=this.settings.hueRadiusScale,this.particleMaterial.uniforms.uHueAngleScale.value=this.settings.hueAngleScale,this.particleMaterial.uniforms.uHueAudioShift.value=this.settings.hueAudioShift,this.particleMaterial.uniforms.uHueBrightnessScale.value=this.settings.hueBrightnessScale)}reinitParticleSystem(){this.particleMesh&&(this.scene.remove(this.particleMesh),this.particleMesh.geometry.dispose(),this.particleMesh.material.dispose(),this.particleMesh=null,this.particleMaterial=null),this.gpuCompute&&=(this.gpuCompute.dispose(),null),this.initGPUCompute(),this.initParticles(),this.syncParticleUniforms()}initCoreShell(){let e=new s(1.8,4),t=new i({transparent:!0,depthWrite:!1,blending:2,uniforms:{time:{value:0}},vertexShader:`
                uniform float time;
                varying vec3 vNormal;
                void main() {
                    // 法线转视图空间，保证 fresnel 按屏幕轮廓计算（旋转时不漂移）
                    vNormal = normalize(normalMatrix * normal);
                    vec3 p = position;
                    p += normal * sin(time * 2.0 + position.y * 8.0) * 0.05;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
                }
            `,fragmentShader:`
                uniform float time;
                varying vec3 vNormal;
                void main() {
                    float fresnel = pow(1.0 - abs(vNormal.z), 3.0);
                    vec3 color = mix(vec3(0.2, 0.6, 1.0), vec3(1.0, 0.2, 1.0), fresnel);
                    gl_FragColor = vec4(color, fresnel * 0.8);
                }
            `});this.coreShell=new a(e,t),this.scene.add(this.coreShell)}initCore(){this.core=new a(new s(1,8),new r({color:16777215,transparent:!0,blending:2,depthWrite:!1})),this.scene.add(this.core)}initDisk(){let e=new t(2.5,6,96),n=new i({transparent:!0,side:2,blending:2,uniforms:{time:{value:0},uDiskSpeed:{value:this.settings.diskSpeed},uDiskHueOffset:{value:this.settings.diskHueOffset},uDiskSaturation:{value:this.settings.diskSaturation},uDiskHueAudioShift:{value:this.settings.diskHueAudioShift},uAudioEnergy:{value:0}},vertexShader:`
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,fragmentShader:`
                uniform float time;
                uniform float uDiskSpeed;
                uniform float uDiskHueOffset;
                uniform float uDiskSaturation;
                uniform float uDiskHueAudioShift;
                uniform float uAudioEnergy;
                varying vec2 vUv;
                vec3 hsv2rgb(vec3 c) {
                    vec4 K = vec4(1., 2./3., 1./3., 3.);
                    vec3 p = abs(fract(c.xxx + K.xyz) * 6. - K.www);
                    return c.z * mix(K.xxx, clamp(p - K.xxx, 0., 1.), c.y);
                }
                void main() {
                    float hue = fract(vUv.x + time * uDiskSpeed + uDiskHueOffset + uAudioEnergy * uDiskHueAudioShift);
                    vec3 color = hsv2rgb(vec3(hue, uDiskSaturation, 1.0));
                    float alpha = sin(vUv.x * 40.0 + time * 6.0) * 0.5 + 0.5;
                    gl_FragColor = vec4(color, alpha * 0.7);
                }
            `});this.disk=new a(e,n),this.disk.rotation.x=Math.PI*.35,this.scene.add(this.disk)}setupGUI(){this.guiContainer=x(`Animation34-gui-container`),document.body.appendChild(this.guiContainer),S(`Animation34-gui-container`);let t={particleCount:this.settings.particleGridSize*this.settings.particleGridSize,resetParams:()=>{let e=JSON.parse(JSON.stringify(this.defaultSettings));Object.assign(this.settings,e),this.resetState(),(this.particleMesh?Math.round(Math.sqrt(this.particleMesh.geometry.attributes.position.count)):this.settings.particleGridSize)!==this.settings.particleGridSize&&this.reinitParticleSystem(),this.controls.reset(),t.particleCount=this.settings.particleGridSize*this.settings.particleGridSize,this.syncParticleUniforms(),this.bloomPass.strength=this.settings.bloomStrength,this.bloomPass.threshold=this.settings.bloomThreshold,this.bloomPass.radius=this.settings.bloomRadius,this.afterimagePass.uniforms.damp.value=this.settings.afterimageDamp,this.renderer.toneMappingExposure=this.settings.exposure;let n=e=>{e.controllers.forEach(e=>e.updateDisplay()),e.folders&&Object.values(e.folders).forEach(e=>n(e))};n(this.gui)}};this.gui=new e({title:`彩虹奇点`,container:this.guiContainer}),this.gui.hide();let n=this.gui.addFolder(`粒子系统`);n.add(this.settings,`particleSize`,.01,20,.01).name(`粒子大小`).onChange(e=>{this.syncParticleUniforms()}),n.add(this.settings,`particleGridSize`,32,512,16).name(`粒子网格(×)`).onChange(e=>{t.particleCount=e*e,this.reinitParticleSystem()}),n.add(t,`particleCount`,1024,262144,1).name(`粒子数量`).onChange(e=>{let n=Math.max(32,Math.min(512,Math.round(Math.sqrt(e))));this.settings.particleGridSize=n,t.particleCount=n*n,this.reinitParticleSystem()}),n.add(this.settings,`particleAudio`,0,2,.01).name(`音频响应强度`),n.add(this.settings,`particleAudioScatter`,0,2,.01).name(`音频散射`),n.add(this.settings,`particleRotationSpeed`,0,.3,.001).name(`旋转速度`),n.add(this.settings,`hueSpeed`,0,.2,.001).name(`色彩流速`).onChange(e=>{this.syncParticleUniforms()}),n.add(this.settings,`hueAudioShift`,0,1,.01).name(`音频色变`).onChange(e=>{this.syncParticleUniforms()}),n.add(this.settings,`particleBrightness`,.1,3,.05).name(`粒子亮度`).onChange(e=>{this.particleMaterial.uniforms.uBrightness.value=e}),n.open();let r=this.gui.addFolder(`🌀 吸积盘`);r.add(this.settings,`diskSpeed`,0,.2,.001).name(`旋转速度`),r.add(this.settings,`diskPulse`,0,.5,.01).name(`低频脉冲`),r.add(this.settings,`diskKickPulse`,0,2,.01).name(`鼓点脉冲`),r.add(this.settings,`diskHueOffset`,0,1,.01).name(`色相偏移`),r.add(this.settings,`diskSaturation`,0,1,.01).name(`饱和度`),r.add(this.settings,`diskHueAudioShift`,0,1,.01).name(`音频色变`),r.open();let i=this.gui.addFolder(`奇点核心`);i.add(this.settings,`coreSize`,.1,5,.1).name(`核心大小`),i.add(this.settings,`corePulse`,0,2,.05).name(`低频脉动`),i.add(this.settings,`coreBeatPulse`,0,2,.01).name(`鼓点/强拍脉动`),i.open();let a=this.gui.addFolder(`后期处理`);a.add(this.settings,`bloomStrength`,0,10,.1).name(`bloom强度`).onChange(e=>{this.bloomPass.strength=e}),a.add(this.settings,`bloomThreshold`,0,1,.01).name(`bloom阈值`).onChange(e=>{this.bloomPass.threshold=e}),a.add(this.settings,`bloomRadius`,0,1,.01).name(`bloom半径`).onChange(e=>{this.bloomPass.radius=e}),a.add(this.settings,`bloomEnergyAmplification`,0,5,.1).name(`Bloom 音频响应`),a.add(this.settings,`bloomBeatBurst`,0,5,.1).name(`Bloom 鼓点爆发`),a.add(this.settings,`chromaticAmount`,0,.01,1e-4).name(`色差量`),a.add(this.settings,`chromaAudio`,0,3,.1).name(`色差音频响应`),a.add(this.settings,`afterimageDamp`,.8,1,.001).name(`残影衰减`).onChange(e=>{this.afterimagePass.uniforms.damp.value=e}),a.add(this.settings,`exposure`,.5,3,.05).name(`基础曝光`).onChange(e=>{this.renderer.toneMappingExposure=e}),a.add(this.settings,`exposureAudio`,0,2,.05).name(`曝光音频响应`),a.open();let o=this.gui.addFolder(`音频响应`);o.add(this.settings,`audioIntensity`,0,2,.05).name(`音频灵敏度`),o.open(),this.gui.add(t,`resetParams`).name(`重置参数`)}setupSettingsButton(){this.settingsButton=y(`Animation34-settings-button`),this.settingsButton.addEventListener(`click`,()=>{this.guiVisible=!this.guiVisible,this.guiVisible?this.gui.show():this.gui.hide()}),document.body.appendChild(this.settingsButton)}render(){let e=this._time?this._time*.001:performance.now()*.001,t=Math.min(.033,e-this.lastTime);this.lastTime=e,this._elapsed+=t;let n=this._elapsed,r=this.settings.audioIntensity,i=this.energy*r,a=this.bass*r,o=this.mid*r,s=this.kick*r,c=this.snare*r,l=this.high*r,u=this.motion*r,d=this.variation*r,f=this.brightness*r,p=this.downbeat*r;if(this.gpuCompute&&this.positionVariable&&this.velocityVariable){let e=t*60;this.positionVariable.material.uniforms.time.value=n,this.velocityVariable.material.uniforms.time.value=n,this.positionVariable.material.uniforms.dt.value=e,this.velocityVariable.material.uniforms.dt.value=e,this.velocityVariable.material.uniforms.uAudioEnergy.value=i*this.settings.particleAudioScatter*(.6+u*.8),this.velocityVariable.material.uniforms.uBass.value=a*this.settings.particleAudio*.5,this.velocityVariable.material.uniforms.uMid.value=o*this.settings.particleAudio*.4,this.velocityVariable.material.uniforms.uBeatKick.value=s*this.settings.particleAudio*.6,this.velocityVariable.material.uniforms.uContainment.value=this.settings.particleContainment,this.gpuCompute.compute()}if(this.particleMesh&&this.gpuCompute&&(this.particleMesh.rotation.y+=t*this.settings.particleRotationSpeed,this.particleMaterial.uniforms.texturePosition.value=this.gpuCompute.getCurrentRenderTarget(this.positionVariable).texture,this.particleMaterial.uniforms.time.value=n,this.particleMaterial.uniforms.energy.value=i,this.particleMaterial.uniforms.uHueBrightness.value=f,this.particleMaterial.uniforms.uBrightness.value=this.settings.particleBrightness),this.core){let e=s*this.settings.coreBeatPulse+p*this.settings.coreBeatPulse*.6,t=this.settings.coreSize*(1+a*this.settings.corePulse+Math.sin(n*2)*.05+e);this.core.scale.setScalar(t)}if(this.coreShell){this.coreShell.material.uniforms.time.value=n;let e=1+i*this.settings.shellEnergyGlow;this.coreShell.scale.setScalar(this.settings.coreSize*e),this.coreShell.rotation.y+=t*.1,this.coreShell.rotation.x+=t*.05}if(this.disk){this.disk.material.uniforms.time.value=n,this.disk.material.uniforms.uDiskSpeed.value=this.settings.diskSpeed,this.disk.material.uniforms.uDiskHueOffset.value=this.settings.diskHueOffset,this.disk.material.uniforms.uDiskSaturation.value=this.settings.diskSaturation,this.disk.material.uniforms.uDiskHueAudioShift.value=this.settings.diskHueAudioShift,this.disk.material.uniforms.uAudioEnergy.value=i,this.disk.rotation.z+=t*(.1+d*this.settings.diskVariationSpeed);let e=1+a*this.settings.diskPulse+s*this.settings.diskKickPulse;this.disk.scale.setScalar(e)}this.bloomPass.strength=this.settings.bloomStrength+i*this.settings.bloomEnergyAmplification+(s+c*.5)*this.settings.bloomBeatBurst,this.renderer.toneMappingExposure=this.settings.exposure+(i*.8+s*.3)*this.settings.exposureAudio,this.chromaPass.uniforms.amount.value=this.settings.chromaticAmount+(i*.01+c*.008+l*.008)*this.settings.chromaAudio,this.controls.update(),this.composer.render()}onWindowResize(){let e=window.innerWidth,t=window.innerHeight;this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t),this.composer.setSize(e,t),this.bloomPass&&this.bloomPass.setSize(e,t)}updateWithAudioData(e,t){if(t!==void 0&&(this._time=t),e&&e.audioFeature&&e.audioFeature.animation){let t=e.audioFeature.animation;this.hasAudioData=e.isPlaying!==!1,this.bass=t.bass||0,this.mid=t.mid||0,this.high=t.high||0,this.energy=t.energy||0,this.kick=t.kick||0,this.snare=t.snare||0,this.motion=t.motion||0,this.brightness=t.brightness||0,this.variation=t.variation||0,this.downbeat=+!!t.isDownbeat;return}if(e&&e.energy){this.hasAudioData=!0,this.bass=e.energy.low||0,this.mid=e.energy.mid||0,this.high=e.energy.high||0,this.kick=e.beat?.kick||0,this.snare=e.beat?.snare||0,this.energy=(this.bass+this.mid+this.high)/3,this.motion=0,this.brightness=0,this.variation=0,this.downbeat=0;return}this.hasAudioData=!1,this.bass=0,this.mid=0,this.high=0,this.energy=0,this.kick=0,this.snare=0,this.motion=0,this.brightness=0,this.variation=0,this.downbeat=0}setEffectMode(e){return console.log(`当前效果模式：${e}`),!0}updateSettings(e){Object.assign(this.settings,e),e.cameraPosition&&(this.camera.position.set(e.cameraPosition.x===void 0?this.settings.cameraPosition.x:e.cameraPosition.x,e.cameraPosition.y===void 0?this.settings.cameraPosition.y:e.cameraPosition.y,e.cameraPosition.z===void 0?this.settings.cameraPosition.z:e.cameraPosition.z),this.controls.saveState()),e.bloomStrength!==void 0&&(this.bloomPass.strength=e.bloomStrength),e.bloomThreshold!==void 0&&(this.bloomPass.threshold=e.bloomThreshold),e.bloomRadius!==void 0&&(this.bloomPass.radius=e.bloomRadius),e.afterimageDamp!==void 0&&(this.afterimagePass.uniforms.damp.value=e.afterimageDamp),this.syncParticleUniforms(),e.particleGridSize!==void 0&&(this.settings.particleGridSize=e.particleGridSize,this.reinitParticleSystem())}resetState(){this.bass=0,this.mid=0,this.high=0,this.energy=0,this.kick=0,this.snare=0,this.motion=0,this.brightness=0,this.variation=0,this.downbeat=0,this.hasAudioData=!1}dispose(){b(this.settingsButton,this.guiContainer,this.gui),this.settingsButton=null,this.resizeHandler&&=(window.removeEventListener(`resize`,this.resizeHandler),null),this.particleMesh&&=(this.scene.remove(this.particleMesh),this.particleMesh.geometry.dispose(),this.particleMesh.material.dispose(),null),this.gpuCompute&&=(this.gpuCompute.dispose(),null),this.coreShell&&=(this.scene.remove(this.coreShell),this.coreShell.geometry.dispose(),this.coreShell.material.dispose(),null),this.disk&&=(this.scene.remove(this.disk),this.disk.geometry.dispose(),this.disk.material.dispose(),null),this.core&&=(this.scene.remove(this.core),this.core.geometry.dispose(),this.core.material.dispose(),null),this.composer&&this.composer.dispose(),this.chromaPass&&=(this.chromaPass.dispose(),null),this.afterimagePass&&=(this.afterimagePass.dispose(),null),this.bloomPass&&=(this.bloomPass.dispose(),null),this.controls&&=(this.controls.dispose(),null),this.renderer&&this.renderer.dispose(),console.log(`✅ Animation34 彩虹奇点资源已清理`)}getAudioDataForUI(){return{bass:this.bass,mid:this.mid,high:this.high}}playAudio(){console.log(`音频播放由系统控制`)}pauseAudio(){console.log(`音频暂停由系统控制`)}};export{E as default};