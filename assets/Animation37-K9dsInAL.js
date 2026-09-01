import{a as e}from"./lil-gui.esm-jlbWO7FJ.js";import{Ht as t,Jn as n,Tt as r,Wt as i,_t as a,g as o,l as s,qn as c,r as l,u,wr as d,zt as f}from"./three.module-CgISyWQV.js";import{n as p,r as m,t as h}from"./OutputPass-D9GSoAm2.js";import{t as g}from"./UnrealBloomPass-1z79deN3.js";import{i as _,n as v,r as y,t as b}from"./GUIHelper-DspWBXk2.js";var x=class{constructor(e,t={}){this.canvas=e,this._isReady=!1,this._initializationError=null;let n={speed:.85,rotSpeed:.089,tunnelLength:7,zoom:1,hue:.505,hueRange:.3,saturation:.85,lightness:.1,beatFlash:.05,audioSensitivity:1,speedResponse:.5,rotResponse:.3,particleResponse:.5,downbeatBoost:.6,colorResponse:1,bloomEnabled:!0,bloomStrength:.4,bloomRadius:.17,bloomThreshold:.9,surfaceParticles:!0,surfaceParticleCount:1e4,surfaceParticleSize:.06,surfaceParticleBrightness:2};this.settings={...n,...t},this.defaultSettings={...n},this.scene=null,this.camera=null,this.renderer=null,this.composer=null,this.bloomPass=null,this.mesh=null,this.material=null,this.geometry=null,this.surfaceParticles=null,this.surfaceParticleGeometry=null,this.surfaceParticleMaterial=null,this.surfaceParticlePositions=null,this.surfaceParticleSizes=null,this.surfaceParticlePhases=null,this.surfaceParticleSpeeds=null,this.surfaceParticleColors=null,this.surfaceParticleRandoms=null,this.surfaceParticleUVs=null,this.externalAudio={bass:0,mid:0,high:0,amplitude:0},this.hasAudioData=!1,this.lastAudioDataTime=0,this.AUDIO_TIMEOUT=500,this._time=0,this.beat=null,this.smoothHueShift=0,this.smoothBeat=0,this.smoothSpeed=this.settings.speed,this.smoothRotSpeed=this.settings.rotSpeed,this.audioFeature=null,this.timeAccumulator=0,this.lastFrameTime=0,this.zoomLevel=1,this.gui=null,this.guiContainer=null,this.guiVisible=!1,this.wheelHandler=null,this.resizeHandler=null,this.contextLostHandler=null,this.contextRestoredHandler=null,this.particleRebuildTimer=null,this.lastParticleCount=this.settings.surfaceParticleCount,this.init().catch(e=>{console.error(`❌ Animation37 初始化失败:`,e),this._initializationError=e})}async init(){try{return this.setupThreeJS(),this.createShaderMaterial(),this.createSurfaceParticles(),this.setupPostProcessing(),this.setupGUI(),this.setupSettingsButton(),this.setupControls(),this._isReady=!0,console.log(`✅ Animation37 初始化成功`),!0}catch(e){throw console.error(`❌ Animation37 初始化失败:`,e),e}}setupThreeJS(){this.scene=new c,this.camera=new f(-1,1,1,-1,.1,10),this.camera.position.z=1,this.renderer=new l({canvas:this.canvas,antialias:!0,alpha:!0,powerPreference:`high-performance`}),this.renderer.setClearColor(0,0),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.outputColorSpace=a,this.renderer.toneMapping=4,this.renderer.toneMappingExposure=1.2,this.canvas.style.backgroundColor=`transparent`,this.canvas.style.zIndex=`1`,this.contextLostHandler=e=>{e.preventDefault(),console.warn(`⚠️ Animation37: WebGL 上下文丢失`)},this.contextRestoredHandler=()=>{console.log(`✅ Animation37: WebGL 上下文已恢复，重建所有资源`),this.createShaderMaterial(),this.createSurfaceParticles(),this.setupPostProcessing()},this.canvas.addEventListener(`webglcontextlost`,this.contextLostHandler),this.canvas.addEventListener(`webglcontextrestored`,this.contextRestoredHandler),this.resizeHandler=()=>this.onWindowResize(),window.addEventListener(`resize`,this.resizeHandler)}createShaderMaterial(){this.geometry&&this.geometry.dispose(),this.material&&this.material.dispose(),this.mesh&&this.scene.remove(this.mesh),this.geometry=new t(2,2),this.material=new n({uniforms:{uResolution:{value:new d(window.innerWidth,window.innerHeight)},uTime:{value:0},uHue:{value:this.settings.hue},uHueRange:{value:this.settings.hueRange||.2},uSaturation:{value:this.settings.saturation},uLightness:{value:this.settings.lightness},uBeat:{value:0},uZoom:{value:this.settings.zoom},uSpeed:{value:this.settings.speed},uRotSpeed:{value:this.settings.rotSpeed},uTunnelLength:{value:this.settings.tunnelLength}},transparent:!0,vertexShader:`
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,fragmentShader:`
            uniform vec2 uResolution;
            uniform float uTime;
            uniform float uHue;
            uniform float uHueRange;
            uniform float uSaturation;
            uniform float uLightness;
            uniform float uBeat;
            uniform float uZoom;
            uniform float uSpeed;
            uniform float uRotSpeed;
            uniform float uTunnelLength;

            varying vec2 vUv;

            mat2 rot(float a) {
                float s = sin(a), c = cos(a);
                return mat2(c, -s, s, c);
            }

            vec3 hsv2rgb(float h, float s, float v) {
                vec3 rgb = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
                return v * mix(vec3(1.0), rgb, s);
            }

            float map(vec3 p) {
                float tunnelLength = uTunnelLength;
                float halfLength = tunnelLength * 0.5;
                float zCycle = mod(p.z + halfLength, tunnelLength) - halfLength;
                vec3 pCyclic = vec3(p.x, p.y, zCycle);
                
                float rotSpeed = uRotSpeed;
                pCyclic.xy *= rot(uTime * rotSpeed);
                pCyclic.xz *= rot(uTime * rotSpeed * 0.6);

                float scale = 1.0;
                for (int i = 0; i < 8; i++) {
                    pCyclic = abs(pCyclic);
                    if (pCyclic.x < pCyclic.y) pCyclic.xy = pCyclic.yx;
                    if (pCyclic.x < pCyclic.z) pCyclic.xz = pCyclic.zx;
                    if (pCyclic.y < pCyclic.z) pCyclic.yz = pCyclic.zy;
                    
                    pCyclic = pCyclic * 2.0 - vec3(1.0, 0.9, 1.1);
                    scale *= 2.0;
                }
                
                return (length(pCyclic) - 0.3) / scale;
            }

            void main() {
                vec2 uv = vUv * 2.0 - 1.0;
                float aspect = uResolution.x / uResolution.y;
                uv.x *= aspect;
                uv *= uZoom;
                
                float speed = uSpeed;
                vec3 ro = vec3(0.0, 0.0, -6.0 + uTime * speed);
                vec3 rd = normalize(vec3(uv, 1.0));

                float t = 0.0;
                bool hit = false;
                float minDist = 100.0;
                
                for (int i = 0; i < 80; i++) {
                    vec3 p = ro + rd * t;
                    float d = map(p);
                    
                    if (d < 0.001) { 
                        hit = true; 
                        minDist = t;
                        break; 
                    }
                    t += d * 0.6;
                    if (t > 40.0) break;
                }

                vec3 col;
                if (hit) {
                    float depth = 1.0 / (minDist * 0.04 + 0.5);
                    
                    float hue = fract(uHue + uHueRange * depth);
                    float saturation = uSaturation;
                    float brightness = uLightness * depth * 0.8 + 0.2;
                    brightness = clamp(brightness, 0.05, 1.0);
                    
                    col = hsv2rgb(hue, saturation, brightness);
                    
                    float beatFlash = uBeat * 0.3;
                    col += beatFlash * vec3(1.0);
                    
                    float vignette = 1.0 - length(uv) * 0.35;
                    col *= vignette;
                    col = clamp(col, 0.0, 1.0);
                    
                    col *= 1.2;
                } else {
                    col = vec3(0.003, 0.002, 0.008);
                }

                float alpha = hit ? 1.0 : 0.0;
                gl_FragColor = vec4(col, alpha);
            }
        `}),this.mesh=new r(this.geometry,this.material),this.scene.add(this.mesh)}createSurfaceParticles(){this.surfaceParticles&&this.scene.remove(this.surfaceParticles),this.surfaceParticleGeometry&&this.surfaceParticleGeometry.dispose(),this.surfaceParticleMaterial&&this.surfaceParticleMaterial.dispose();let e=this.settings.surfaceParticleCount||1e4;this.surfaceParticleGeometry=new u,this.surfaceParticlePositions=new Float32Array(e*3),this.surfaceParticleSizes=new Float32Array(e),this.surfaceParticlePhases=new Float32Array(e),this.surfaceParticleSpeeds=new Float32Array(e),this.surfaceParticleColors=new Float32Array(e*3),this.surfaceParticleRandoms=new Float32Array(e),this.surfaceParticleUVs=new Float32Array(e*2);let t=this.settings.tunnelLength||7;for(let n=0;n<e;n++){let e=Math.random(),r=Math.random();this.surfaceParticleUVs[n*2]=e,this.surfaceParticleUVs[n*2+1]=r;let i=e*Math.PI*2,a=.5+(Math.random()-.5)*.1,s=(r-.5)*t*1.5;this.surfaceParticlePositions[n*3]=Math.cos(i)*a,this.surfaceParticlePositions[n*3+1]=Math.sin(i)*a,this.surfaceParticlePositions[n*3+2]=s;let c=this.settings.surfaceParticleSize||.06;this.surfaceParticleSizes[n]=c*(.3+Math.random()*.7),this.surfaceParticlePhases[n]=Math.random()*Math.PI*2,this.surfaceParticleSpeeds[n]=.5+Math.random()*2.5,this.surfaceParticleRandoms[n]=Math.random();let l=.55+Math.random()*.3,u=.7+Math.random()*.3,d=.6+Math.random()*.4,f=new o().setHSL(l,u,d);this.surfaceParticleColors[n*3]=f.r,this.surfaceParticleColors[n*3+1]=f.g,this.surfaceParticleColors[n*3+2]=f.b}this.surfaceParticleGeometry.setAttribute(`position`,new s(this.surfaceParticlePositions,3)),this.surfaceParticleGeometry.setAttribute(`size`,new s(this.surfaceParticleSizes,1)),this.surfaceParticleGeometry.setAttribute(`phase`,new s(this.surfaceParticlePhases,1)),this.surfaceParticleGeometry.setAttribute(`speed`,new s(this.surfaceParticleSpeeds,1)),this.surfaceParticleGeometry.setAttribute(`color`,new s(this.surfaceParticleColors,3)),this.surfaceParticleGeometry.setAttribute(`random`,new s(this.surfaceParticleRandoms,1)),this.surfaceParticleGeometry.setAttribute(`uvCoord`,new s(this.surfaceParticleUVs,2)),this.surfaceParticleMaterial=new n({uniforms:{uTime:{value:0},uPixelRatio:{value:this.renderer.getPixelRatio()},uBeat:{value:0},uTunnelSpeed:{value:this.settings.speed},uTunnelLength:{value:this.settings.tunnelLength},uRotSpeed:{value:this.settings.rotSpeed},uBrightness:{value:this.settings.surfaceParticleBrightness||1.2},uEnabled:{value:this.settings.surfaceParticles===!1?0:1}},vertexShader:`
                attribute float size;
                attribute float phase;
                attribute float speed;
                attribute vec3 color;
                attribute float random;
                attribute vec2 uvCoord;
                
                uniform float uTime;
                uniform float uPixelRatio;
                uniform float uBeat;
                uniform float uTunnelSpeed;
                uniform float uTunnelLength;
                uniform float uRotSpeed;
                uniform float uBrightness;
                uniform float uEnabled;
                
                varying vec3 vColor;
                varying float vAlpha;
                
                mat2 rot(float a) {
                    float s = sin(a), c = cos(a);
                    return mat2(c, -s, s, c);
                }
                
                float map(vec3 p) {
                    float tunnelLength = uTunnelLength;
                    float halfLength = tunnelLength * 0.5;
                    float zCycle = mod(p.z + halfLength, tunnelLength) - halfLength;
                    vec3 pCyclic = vec3(p.x, p.y, zCycle);
                    
                    float rotSpeed = uRotSpeed;
                    pCyclic.xy *= rot(uTime * rotSpeed);
                    pCyclic.xz *= rot(uTime * rotSpeed * 0.6);
            
                    float scale = 1.0;
                    for (int i = 0; i < 8; i++) {
                        pCyclic = abs(pCyclic);
                        if (pCyclic.x < pCyclic.y) pCyclic.xy = pCyclic.yx;
                        if (pCyclic.x < pCyclic.z) pCyclic.xz = pCyclic.zx;
                        if (pCyclic.y < pCyclic.z) pCyclic.yz = pCyclic.zy;
                        
                        pCyclic = pCyclic * 2.0 - vec3(1.0, 0.9, 1.1);
                        scale *= 2.0;
                    }
                    
                    return (length(pCyclic) - 0.3) / scale;
                }
                
                void main() {
                    vColor = color * uBrightness;
                    
                    float angle = uvCoord.x * 6.2832;
                    float depthRatio = uvCoord.y;
                    
                    float radius = 0.5;
                    vec3 basePos = vec3(cos(angle) * radius, sin(angle) * radius, 0.0);
                    
                    float tunnelLength = uTunnelLength;
                    float halfLength = tunnelLength * 0.5;
                    float zPos = (depthRatio - 0.5) * tunnelLength * 1.5 + uTime * uTunnelSpeed * 0.5;
                    
                    zPos = mod(zPos + halfLength, tunnelLength) - halfLength;
                    
                    vec3 pos = basePos;
                    pos.xy *= rot(uTime * uRotSpeed);
                    pos.xz *= rot(uTime * uRotSpeed * 0.6);
                    
                    vec3 p = pos;
                    p.z = zPos;
                    
                    for (int i = 0; i < 4; i++) {
                        float d = map(p);
                        if (d < 0.01) break;
                        p -= normalize(p) * d * 0.5;
                    }
                    
                    vec3 finalPos = p;
                    finalPos.z = zPos;
                    
                    float sparkle = sin(uTime * speed + phase) * 0.5 + 0.5;
                    sparkle = pow(sparkle, 2.0);
                    
                    float beatEffect = 1.0 + uBeat * 2.0;
                    sparkle *= beatEffect;
                    
                    vAlpha = sparkle * 0.8 + 0.1;
                    vAlpha *= uEnabled;
                    
                    float sizeVar = size * (0.6 + 0.4 * sparkle);
                    
                    vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
                    gl_PointSize = sizeVar * uPixelRatio * (60.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,fragmentShader:`
                varying vec3 vColor;
                varying float vAlpha;
                
                void main() {
                    vec2 center = gl_PointCoord - vec2(0.5);
                    float dist = length(center);
                    if (dist > 0.5) discard;
                    
                    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
                    alpha = pow(alpha, 1.5);
                    
                    float star = 1.0 - abs(gl_PointCoord.x - 0.5) * 2.0;
                    star = star * (1.0 - abs(gl_PointCoord.y - 0.5) * 2.0);
                    star = max(0.0, star * 0.5);
                    
                    float glow = exp(-dist * 8.0);
                    vec3 color = vColor * (1.0 + glow * 0.8 + star * 0.3);
                    
                    float finalAlpha = alpha * vAlpha;
                    if (finalAlpha < 0.01) discard;
                    gl_FragColor = vec4(color, finalAlpha);
                }
            `,transparent:!0,blending:2,depthWrite:!1,depthTest:!0}),this.surfaceParticles=new i(this.surfaceParticleGeometry,this.surfaceParticleMaterial),this.scene.add(this.surfaceParticles)}rebuildSurfaceParticles(){this.surfaceParticles&&this.scene.remove(this.surfaceParticles),this.surfaceParticleGeometry&&this.surfaceParticleGeometry.dispose(),this.surfaceParticleMaterial&&this.surfaceParticleMaterial.dispose(),this.createSurfaceParticles()}setupPostProcessing(){if(this.composer)try{this.composer.dispose()}catch{}this.composer=new m(this.renderer);let e=new p(this.scene,this.camera);this.composer.addPass(e),this.bloomPass=new g(new d(window.innerWidth,window.innerHeight),this.settings.bloomStrength,this.settings.bloomRadius,this.settings.bloomThreshold),this.bloomPass.enabled=this.settings.bloomEnabled,this.composer.addPass(this.bloomPass);let t=new h;this.composer.addPass(t)}setupGUI(){this.createGUIContainer();let t={resetTime:()=>{this.timeAccumulator=0,this.material&&(this.material.uniforms.uTime.value=0)},resetBloom:()=>{this.settings.bloomStrength=.4,this.settings.bloomRadius=.17,this.settings.bloomThreshold=.9,this.settings.bloomEnabled=!0,this.bloomPass.strength=.4,this.bloomPass.radius=.17,this.bloomPass.threshold=.9,this.bloomPass.enabled=!0,this.updateAllGUIControllers()},resetParams:()=>{Object.assign(this.settings,this.defaultSettings),this.material&&(this.material.uniforms.uSpeed.value=this.settings.speed,this.material.uniforms.uRotSpeed.value=this.settings.rotSpeed,this.material.uniforms.uTunnelLength.value=this.settings.tunnelLength,this.material.uniforms.uZoom.value=this.settings.zoom,this.zoomLevel=this.settings.zoom,this.material.uniforms.uHue.value=this.settings.hue,this.material.uniforms.uHueRange.value=this.settings.hueRange,this.material.uniforms.uSaturation.value=this.settings.saturation,this.material.uniforms.uLightness.value=this.settings.lightness),this.bloomPass&&(this.bloomPass.strength=this.settings.bloomStrength,this.bloomPass.radius=this.settings.bloomRadius,this.bloomPass.threshold=this.settings.bloomThreshold,this.bloomPass.enabled=this.settings.bloomEnabled),this.rebuildSurfaceParticles(),this.hasAudioData=!1,this.externalAudio={bass:0,mid:0,high:0,amplitude:0},this.lastAudioDataTime=0,this.smoothHueShift=0,this.smoothBeat=0,this.smoothSpeed=this.settings.speed,this.smoothRotSpeed=this.settings.rotSpeed,this.audioFeature=null,this.beat=null,this.lastParticleCount=this.settings.surfaceParticleCount,this.updateAllGUIControllers()}};this.gui=new e({title:`幻光隧道`,container:this.guiContainer}),this.gui.hide();let n=this.gui.addFolder(`隧道`);n.add(this.settings,`speed`,.05,1,.001).name(`前进速度`).onChange(e=>{this.material&&(this.material.uniforms.uSpeed.value=e),this.surfaceParticleMaterial&&(this.surfaceParticleMaterial.uniforms.uTunnelSpeed.value=e)}),n.add(this.settings,`rotSpeed`,.01,.2,.001).name(`旋转速度`).onChange(e=>{this.material&&(this.material.uniforms.uRotSpeed.value=e),this.surfaceParticleMaterial&&(this.surfaceParticleMaterial.uniforms.uRotSpeed.value=e)}),n.add(this.settings,`tunnelLength`,4,16,.5).name(`隧道周期`).onChange(e=>{this.material&&(this.material.uniforms.uTunnelLength.value=e),this.surfaceParticleMaterial&&(this.surfaceParticleMaterial.uniforms.uTunnelLength.value=e)}),n.add(this.settings,`zoom`,.3,2.5,.05).name(`视野缩放`).onChange(e=>{this.material&&(this.material.uniforms.uZoom.value=e),this.zoomLevel=e}),n.open();let r=this.gui.addFolder(`颜色`);r.add(this.settings,`hue`,0,1,.001).name(`色相偏移`).onChange(e=>{this.material&&(this.material.uniforms.uHue.value=e)}),r.add(this.settings,`hueRange`,0,.5,.01).name(`色彩丰富度`).onChange(e=>{this.material&&(this.material.uniforms.uHueRange.value=e)}),r.add(this.settings,`saturation`,0,1,.01).name(`饱和度`).onChange(e=>{this.material&&(this.material.uniforms.uSaturation.value=e)}),r.add(this.settings,`lightness`,.1,.9,.01).name(`明度`).onChange(e=>{this.material&&(this.material.uniforms.uLightness.value=e)}),r.open();let i=this.gui.addFolder(`Bloom辉光`);i.add(this.settings,`bloomEnabled`).name(`启用Bloom`).onChange(e=>{this.bloomPass&&(this.bloomPass.enabled=e)}),i.add(this.settings,`bloomStrength`,0,1,.01).name(`bloom强度`).onChange(e=>{this.bloomPass&&(this.bloomPass.strength=e)}),i.add(this.settings,`bloomRadius`,0,1,.01).name(`bloom半径`).onChange(e=>{this.bloomPass&&(this.bloomPass.radius=e)}),i.add(this.settings,`bloomThreshold`,0,1,.01).name(`bloom阈值`).onChange(e=>{this.bloomPass&&(this.bloomPass.threshold=e)}),i.add(t,`resetBloom`).name(`↺ 重置辉光`),i.open();let a=this.gui.addFolder(`✨ 表面亮晶晶`);a.add(this.settings,`surfaceParticles`).name(`启用粒子`).onChange(e=>{this.surfaceParticleMaterial&&(this.surfaceParticleMaterial.uniforms.uEnabled.value=+!!e)}),a.add(this.settings,`surfaceParticleCount`,100,2e4,100).name(`粒子数量`).onChange(e=>{e!==this.lastParticleCount&&(this.lastParticleCount=e,this.particleRebuildTimer&&clearTimeout(this.particleRebuildTimer),this.particleRebuildTimer=setTimeout(()=>{this.rebuildSurfaceParticles(),this.particleRebuildTimer=null},300))}),a.add(this.settings,`surfaceParticleSize`,.005,.12,.005).name(`粒子大小`).onChange(e=>{if(this.surfaceParticleGeometry){let t=this.surfaceParticleGeometry.attributes.size.array;for(let n=0;n<t.length;n++)t[n]=e*(.3+(this.surfaceParticleRandoms?this.surfaceParticleRandoms[n]:Math.random())*.7);this.surfaceParticleGeometry.attributes.size.needsUpdate=!0}}),a.add(this.settings,`surfaceParticleBrightness`,.1,3,.1).name(`亮度`).onChange(e=>{this.surfaceParticleMaterial&&(this.surfaceParticleMaterial.uniforms.uBrightness.value=e)}),a.open();let o=this.gui.addFolder(`音频`);o.add(this.settings,`audioSensitivity`,.1,2,.1).name(`灵敏度`),o.add(this.settings,`beatFlash`,0,.5,.01).name(`节拍闪光强度`),o.add(this.settings,`downbeatBoost`,0,1,.05).name(`强拍增强`),o.add(this.settings,`speedResponse`,0,1,.05).name(`速度响应`),o.add(this.settings,`rotResponse`,0,1,.05).name(`旋转响应`),o.add(this.settings,`particleResponse`,0,1,.05).name(`粒子响应`),o.add(this.settings,`colorResponse`,0,1,.05).name(`色彩响应`),o.open();let s=this.gui.addFolder(`操作`);s.add(t,`resetTime`).name(`↺ 重置时间`),s.add(t,`resetParams`).name(`↺ 重置参数`),s.open()}updateAllGUIControllers(){if(!this.gui)return;let e=t=>{t.controllers&&t.controllers.forEach(e=>e.updateDisplay()),t.folders&&Object.values(t.folders).forEach(t=>{e(t)}),t.__folders&&Object.values(t.__folders).forEach(t=>{e(t)})};e(this.gui)}createGUIContainer(){this.guiContainer=y(`Animation37-gui-container`),b(`Animation37-gui-container`),document.body.appendChild(this.guiContainer)}setupSettingsButton(){this.settingsButton=_(`Animation37-settings-button`),this.settingsButton.addEventListener(`click`,()=>{this.guiVisible=!this.guiVisible,this.guiVisible?this.gui.show():this.gui.hide()}),document.body.appendChild(this.settingsButton)}setupControls(){this.wheelHandler=e=>{e.target.closest(`.lil-gui`)||(this.zoomLevel=Math.max(.3,Math.min(2.5,this.zoomLevel-e.deltaY*.001)),this.material&&(this.material.uniforms.uZoom.value=this.zoomLevel),this.settings.zoom=this.zoomLevel,this.updateAllGUIControllers(),e.preventDefault())},document.addEventListener(`wheel`,this.wheelHandler,{passive:!1})}_update(){let e=this._time?this._time*.001:performance.now()*.001,t=Math.min(.033,e-this.lastFrameTime||.016);this.lastFrameTime=e,this.timeAccumulator=(this.timeAccumulator+t)%1e5,this.material&&(this.material.uniforms.uTime.value=this.timeAccumulator);let n=this.externalAudio,r=this.audioFeature,i=this.settings.audioSensitivity,a=this.settings.colorResponse,o=performance.now()-this.lastAudioDataTime>this.AUDIO_TIMEOUT,s=this.hasAudioData&&!o&&n.amplitude>.01,c,l,u,d,f,p,m,h;if(s){let e=Math.max(n.bass,.01),t=Math.max(n.mid,.01),o=Math.max(n.high,.01),s=Math.max(n.amplitude,.05),g=(r&&typeof r.beat==`number`?r.beat:this.beat?.kick||0)*this.settings.beatFlash*5;r&&r.isDownbeat&&(g*=1+this.settings.downbeatBoost),g=Math.min(g,1.5),this.smoothBeat+=(g-this.smoothBeat)*.3,f=this.smoothBeat;let _=e*.8*i%1;this.smoothHueShift+=(_-this.smoothHueShift)*.15,c=(this.settings.hue+this.smoothHueShift*.8)%1,u=Math.min(this.settings.saturation+o*.15*a,1),l=Math.min(.1+s*i*.4*a,.5),d=Math.max(Math.min(this.settings.lightness+t*.4*a,.9),.15);let v=1+((r&&r.motion||0)-.35)*this.settings.speedResponse*.6;p=this.settings.speed*Math.max(.6,Math.min(1.4,v));let y=1+(r&&r.variation||0)*this.settings.rotResponse*.5;m=this.settings.rotSpeed*Math.max(.6,Math.min(1.5,y));let b=r&&r.texture||0;h=Math.min(2,b*this.settings.particleResponse*2)}else c=this.settings.hue,u=this.settings.saturation,l=this.settings.hueRange||.2,d=this.settings.lightness,this.smoothHueShift=0,this.smoothBeat*=.9,f=this.smoothBeat,p=this.settings.speed,m=this.settings.rotSpeed,h=0;this.smoothSpeed+=(p-this.smoothSpeed)*.12,this.smoothRotSpeed+=(m-this.smoothRotSpeed)*.2;let g=this.smoothSpeed,_=this.smoothRotSpeed;this.surfaceParticleMaterial&&(this.surfaceParticleMaterial.uniforms.uTime.value=this.timeAccumulator,this.surfaceParticleMaterial.uniforms.uBeat.value=h,this.surfaceParticleMaterial.uniforms.uTunnelSpeed.value=g,this.surfaceParticleMaterial.uniforms.uTunnelLength.value=this.settings.tunnelLength,this.surfaceParticleMaterial.uniforms.uRotSpeed.value=_),this.material&&(this.material.uniforms.uHue.value=c,this.material.uniforms.uHueRange.value=l,this.material.uniforms.uSaturation.value=u,this.material.uniforms.uLightness.value=d,this.material.uniforms.uBeat.value=f,this.material.uniforms.uSpeed.value=g,this.material.uniforms.uRotSpeed.value=_)}render(){!this._isReady||!this.material||!this.composer||(this._update(),this.composer.render())}onWindowResize(){let e=window.innerWidth,t=window.innerHeight;this.renderer&&this.renderer.setSize(e,t),this.composer&&this.composer.setSize(e,t),this.material&&this.material.uniforms.uResolution.value.set(e,t),this.surfaceParticleMaterial&&(this.surfaceParticleMaterial.uniforms.uPixelRatio.value=this.renderer.getPixelRatio())}updateWithAudioData(e,t){if(t!==void 0&&(this._time=t),!e){this.hasAudioData=!1;return}if(e.audioFeature&&e.audioFeature.animation){this.hasAudioData=!0,this.lastAudioDataTime=performance.now();let t=e.audioFeature.animation;this.audioFeature=t,this.externalAudio.bass=t.bass||0,this.externalAudio.mid=t.mid||0,this.externalAudio.high=t.high||0,this.externalAudio.amplitude=t.energy||(t.bass+t.mid+t.high)/3,e.audioFeature.beat&&(this.beat=e.audioFeature.beat)}else e.energy?(this.hasAudioData=!0,this.lastAudioDataTime=performance.now(),this.audioFeature=null,this.externalAudio.bass=e.energy.low||0,this.externalAudio.mid=e.energy.mid||0,this.externalAudio.high=e.energy.high||0,this.externalAudio.amplitude=(this.externalAudio.bass+this.externalAudio.mid+this.externalAudio.high)/3,e.beat&&(this.beat=e.beat)):e.bass!==void 0&&e.mid!==void 0?(this.hasAudioData=!0,this.lastAudioDataTime=performance.now(),this.audioFeature=null,this.externalAudio.bass=Math.min((e.bass||0)/100,1),this.externalAudio.mid=Math.min((e.mid||0)/100,1),this.externalAudio.high=Math.min((e.high||0)/100,1),this.externalAudio.amplitude=(this.externalAudio.bass+this.externalAudio.mid+this.externalAudio.high)/3,e.beat&&(this.beat=e.beat)):(this.hasAudioData=!1,console.warn(`⚠️ Animation37: 未知音频数据格式`,e))}setEffectMode(e){return console.log(`当前效果模式：${e}`),!0}updateSettings(e){this.settings={...this.settings,...e},e.bloomStrength!==void 0&&this.bloomPass&&(this.bloomPass.strength=e.bloomStrength),e.bloomRadius!==void 0&&this.bloomPass&&(this.bloomPass.radius=e.bloomRadius),e.bloomThreshold!==void 0&&this.bloomPass&&(this.bloomPass.threshold=e.bloomThreshold),e.speed!==void 0&&this.material&&(this.material.uniforms.uSpeed.value=e.speed),e.hue!==void 0&&this.material&&(this.material.uniforms.uHue.value=e.hue),e.surfaceParticleCount!==void 0&&(this.settings.surfaceParticleCount=e.surfaceParticleCount,this.rebuildSurfaceParticles())}getAudioDataForUI(){return{bass:this.externalAudio.bass,mid:this.externalAudio.mid,high:this.externalAudio.high}}playAudio(){console.log(`🎵 [Animation37] 音频播放`)}pauseAudio(){console.log(`⏸️ [Animation37] 音频暂停`)}dispose(){if(this.wheelHandler&&document.removeEventListener(`wheel`,this.wheelHandler),this.resizeHandler&&window.removeEventListener(`resize`,this.resizeHandler),this.contextLostHandler&&this.canvas.removeEventListener(`webglcontextlost`,this.contextLostHandler),this.contextRestoredHandler&&this.canvas.removeEventListener(`webglcontextrestored`,this.contextRestoredHandler),v(this.settingsButton,this.guiContainer,this.gui),this.particleRebuildTimer&&=(clearTimeout(this.particleRebuildTimer),null),this.surfaceParticles&&=(this.scene.remove(this.surfaceParticles),null),this.surfaceParticleGeometry&&=(this.surfaceParticleGeometry.dispose(),null),this.surfaceParticleMaterial&&=(this.surfaceParticleMaterial.dispose(),null),this.mesh&&=(this.scene.remove(this.mesh),null),this.geometry){try{this.geometry.dispose()}catch{}this.geometry=null}if(this.material){try{this.material.dispose()}catch{}this.material=null}if(this.composer){try{this.composer.dispose()}catch{}this.composer=null}if(this.renderer){try{this.renderer.dispose()}catch{}this.renderer=null}this.scene&&=null,this._isReady=!1,console.log(`✅ Animation37 资源已清理`)}isReady(){return this._isReady}getInitializationError(){return this._initializationError}};export{x as default};