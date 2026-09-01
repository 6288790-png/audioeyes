import{a as e}from"./lil-gui.esm-jlbWO7FJ.js";import{Bt as t,Jn as n,Tr as r,Wt as i,_t as a,l as o,qn as s,r as c,u as l,wr as u}from"./three.module-CgISyWQV.js";import{n as d,r as f,t as p}from"./OutputPass-D9GSoAm2.js";import{t as m}from"./UnrealBloomPass-1z79deN3.js";import{i as h,n as g,r as _,t as v}from"./GUIHelper-DspWBXk2.js";var y=class{constructor(e,t={}){this.originalCanvas=e,this.colorPresets={fire:{name:`火焰`,baseColor:{r:.31,g:.76,b:1},bassColor:{r:1,g:.2,b:0},midColor:{r:1,g:.6,b:0},highColor:{r:1,g:1,b:.5}},ocean:{name:`海洋`,baseColor:{r:0,g:.4,b:1},bassColor:{r:0,g:.2,b:.8},midColor:{r:0,g:.8,b:1},highColor:{r:.5,g:1,b:1}},neon:{name:`霓虹`,baseColor:{r:.8,g:0,b:1},bassColor:{r:1,g:0,b:.5},midColor:{r:0,g:1,b:1},highColor:{r:1,g:1,b:0}},forest:{name:`森林`,baseColor:{r:0,g:.8,b:.4},bassColor:{r:0,g:.5,b:.2},midColor:{r:.4,g:1,b:.6},highColor:{r:.8,g:1,b:.8}}};let n={colorTheme:`neon`,bloomStrength:.1,bloomRadius:.1,bloomThreshold:.9,audioSensitivity:.6,particleMultiplier:3,mouseStrength:3,attractMode:!0,bassColorStrength:1,midColorStrength:1,highColorStrength:1,saturation:2,dynamicColorSpeed:.5,colorShiftAmount:.3,particleBrightness:.45,particleSize:3.5,cameraAutoMove:!0,cameraPosition:{x:0,y:0,z:150}};this.settings={...n,...t},this.DEFAULTS=JSON.parse(JSON.stringify(n)),this.bassLevel=0,this.midLevel=0,this.highLevel=0,this.hasAudioData=!1,this._beatKickPulse=0,this._smoothBass=0,this._smoothMid=0,this._smoothHigh=0,this.scene=null,this.camera=null,this.renderer=null,this.composer=null,this.bloomPass=null,this.particleSystem=null,this.geometry=null,this.material=null,this.positions=null,this.velocities=null,this.particleCount=0,this.mouse={x:0,y:0},this.mouseActive=!1,this.mouseDown=!1,this.mouseRange=120,this.time=0,this.lastTime=0,this.camTime=0,this.camBaseZ=150,this.colorShiftTime=0,this.currentColorShift={r:0,g:0,b:0},this.gui=null,this.guiContainer=null,this.guiVisible=!1,this.settingsButton=null,this.eventListeners={mousemove:null,mousedown:null,mouseup:null,mouseleave:null,mouseenter:null,keydown:null},this.initPromise=this.init(),this.initPromise.then(()=>{this.lastTime=performance.now()*.001}).catch(e=>{console.error(`❌ Animation16 初始化失败:`,e)})}async init(){try{return this.setupThreeJS(),this.createParticleSystem(),this.setupPostProcessing(),this.setupGUI(),this.setupSettingsButton(),this.setupMouseInteraction(),this.setupKeyboardShortcuts(),console.log(`✅ Animation16 初始化成功 - 霓虹效果支持动态颜色`),!0}catch(e){throw console.error(`❌ Animation16 初始化失败:`,e),e}}setupThreeJS(){this.canvas=document.createElement(`canvas`),this.canvas.className=`threejs-canvas Animation16-canvas`,Object.assign(this.canvas.style,{position:`absolute`,top:`0`,left:`0`,width:`100%`,height:`100%`,zIndex:`1`}),this.visibleCanvas=this.canvas,this.originalCanvas&&this.originalCanvas.parentNode?(this.container=this.originalCanvas.parentNode,this.container.appendChild(this.canvas),this.originalCanvas.style.display=`none`):document.body.appendChild(this.canvas);let e=this.container?this.container.clientWidth:window.innerWidth,n=this.container?this.container.clientHeight:window.innerHeight;this.scene=new s,this.camera=new t(60,e/n,.1,1e3),this.camera.position.set(this.settings.cameraPosition.x,this.settings.cameraPosition.y,this.settings.cameraPosition.z),this.camera.lookAt(0,0,0),this.renderer=new c({canvas:this.canvas,alpha:!0,antialias:!0,powerPreference:`high-performance`}),this.renderer.setSize(e,n),this.renderer.setClearColor(0,0),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.outputColorSpace=a,this.canvas.style.backgroundColor=`transparent`}createParticleSystem(){this.particleCount=Math.round(5e4*this.settings.particleMultiplier),this.positions=new Float32Array(this.particleCount*3),this.velocities=new Float32Array(this.particleCount*2);for(let e=0;e<this.particleCount;e++){let t=e*3,n=e*2;this.positions[t]=(Math.random()-.5)*300,this.positions[t+1]=(Math.random()-.5)*300,this.positions[t+2]=(Math.random()-.5)*100,this.velocities[n]=(Math.random()-.5)*.05,this.velocities[n+1]=(Math.random()-.5)*.05}this.geometry=new l,this.geometry.setAttribute(`position`,new o(this.positions,3)),this.material=new n({transparent:!0,depthWrite:!1,blending:2,uniforms:{uTime:{value:0},uMouseActive:{value:0},uMouseDown:{value:0},uBassLevel:{value:0},uMidLevel:{value:0},uHighLevel:{value:0},uAudioStrength:{value:this.settings.audioSensitivity},uBaseColor:{value:new r},uBassColor:{value:new r},uMidColor:{value:new r},uHighColor:{value:new r},uBassColorStrength:{value:1},uMidColorStrength:{value:1},uHighColorStrength:{value:1},uSaturation:{value:this.settings.saturation},uColorShift:{value:new r},uDynamicColors:{value:0},uColorCycleSpeed:{value:.5},uParticleBrightness:{value:this.settings.particleBrightness},uParticleSize:{value:this.settings.particleSize},uBeatPulse:{value:0}},vertexShader:`
                uniform float uTime;
                uniform float uMouseActive;
                uniform float uMouseDown;
                uniform float uBassLevel;
                uniform float uMidLevel;
                uniform float uHighLevel;
                uniform float uAudioStrength;
                uniform float uBeatPulse;
                uniform float uParticleSize;
                varying float vAlpha;
                varying float vBrightness;
                varying float vBassEffect;
                varying float vMidEffect;
                varying float vHighEffect;
                varying float vParticleId;
                
                void main() {
                    vec4 mv = modelViewMatrix * vec4(position.xyz, 1.0);
                    
                    float d = length(mv.xyz);
                    vAlpha = 1.0 - smoothstep(30.0, 250.0, d);
                    vBrightness = 1.0 - smoothstep(40.0, 200.0, -mv.z);
                    
                    vBassEffect = uBassLevel * uAudioStrength;
                    vMidEffect = uMidLevel * uAudioStrength;
                    vHighEffect = uHighLevel * uAudioStrength;
                    
                    float mouseEffect = 1.0 + uMouseActive * 0.5 + uMouseDown * 0.3;
                    
                    float audioPulse = 1.0 + vBassEffect * 1.2 * sin(uTime * 12.0) 
                                     + vMidEffect * 0.8 * sin(uTime * 8.0) 
                                     + vHighEffect * 0.5 * sin(uTime * 20.0);
                    
                    float finalSize = uParticleSize * mouseEffect * audioPulse * (1.0 + uBeatPulse * 0.8);
                    gl_PointSize = finalSize * (150.0 / -mv.z);
                    
                    vec3 audioOffset = vec3(
                        sin(position.x * 0.01 + uTime * 3.0) * vHighEffect * 1.2,
                        cos(position.y * 0.01 + uTime * 2.0) * vMidEffect * 0.9,
                        sin(position.z * 0.01 + uTime * 1.5) * vBassEffect * 0.7
                    );
                    
                    vec4 finalPosition = vec4(position.xyz + audioOffset, 1.0);
                    gl_Position = projectionMatrix * modelViewMatrix * finalPosition;
                    
                    vParticleId = float(gl_VertexID) * 0.001;
                }
            `,fragmentShader:`
                uniform float uTime;
                uniform vec3 uBaseColor;
                uniform vec3 uBassColor;
                uniform vec3 uMidColor;
                uniform vec3 uHighColor;
                uniform float uBassColorStrength;
                uniform float uMidColorStrength;
                uniform float uHighColorStrength;
                uniform float uSaturation;
                uniform vec3 uColorShift;
                uniform float uDynamicColors;
                uniform float uColorCycleSpeed;
                uniform float uParticleBrightness;
                uniform float uBeatPulse;
                varying float vAlpha;
                varying float vBrightness;
                varying float vBassEffect;
                varying float vMidEffect;
                varying float vHighEffect;
                varying float vParticleId;
                
                vec3 hsl2rgb(vec3 hsl) {
                    vec3 rgb = clamp(abs(mod(hsl.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
                    return hsl.z + hsl.y * (rgb - 0.5) * (1.0 - abs(2.0 * hsl.z - 1.0));
                }
                
                vec3 rgb2hsl(vec3 rgb) {
                    float maxVal = max(rgb.r, max(rgb.g, rgb.b));
                    float minVal = min(rgb.r, min(rgb.g, rgb.b));
                    float h = 0.0, s = 0.0, l = (maxVal + minVal) * 0.5;
                    
                    if (maxVal != minVal) {
                        float d = maxVal - minVal;
                        s = l > 0.5 ? d / (2.0 - maxVal - minVal) : d / (maxVal + minVal);
                        
                        if (maxVal == rgb.r) {
                            h = (rgb.g - rgb.b) / d + (rgb.g < rgb.b ? 6.0 : 0.0);
                        } else if (maxVal == rgb.g) {
                            h = (rgb.b - rgb.r) / d + 2.0;
                        } else {
                            h = (rgb.r - rgb.g) / d + 4.0;
                        }
                        h /= 6.0;
                    }
                    return vec3(h, s, l);
                }
                
                void main() {
                    float r = length(gl_PointCoord - 0.5);
                    float particle = 1.0 - smoothstep(0.0, 0.5, r);
                    
                    float bassIntensity = vBassEffect * uBassColorStrength;
                    float midIntensity = vMidEffect * uMidColorStrength;
                    float highIntensity = vHighEffect * uHighColorStrength;
                    
                    vec3 finalColor = uBaseColor;
                    finalColor = mix(finalColor, uBassColor, bassIntensity * 0.2);
                    finalColor = mix(finalColor, uMidColor, midIntensity * 0.15);
                    finalColor = mix(finalColor, uHighColor, highIntensity * 0.1);
                    
                    if (uDynamicColors > 0.5) {
                        vec3 hsl = rgb2hsl(finalColor);
                        
                        float hueShift = (bassIntensity * 0.3 + midIntensity * 0.2 + highIntensity * 0.1) * 0.5;
                        float timeShift = sin(uTime * uColorCycleSpeed + vParticleId) * 0.2;
                        
                        hsl.x = mod(hsl.x + hueShift + timeShift + uColorShift.x, 1.0);
                        hsl.z = min(hsl.z * (1.0 + (bassIntensity + midIntensity) * 0.08), 1.0);
                        
                        finalColor = hsl2rgb(hsl);
                    }
                    
                    // 饱和度统一处理（避免在 HSL 中缩放：霓虹基色饱和度恒为 1.0，
                    // min(s * (1 + uSaturation*0.3), 1.0) 恒被 clamp 吞掉，导致滑杆全区间无效）
                    float luminance = dot(finalColor, vec3(0.299, 0.587, 0.114));
                    finalColor = mix(vec3(luminance), finalColor, uSaturation);
                    
                    float center = 1.0 - smoothstep(0.0, 0.3, r);
                    particle = mix(particle, particle * 1.2, center);
                    
                    float bassSparkle = step(0.9, sin(uTime * 15.0 + gl_PointCoord.x * 80.0 + vParticleId * 10.0)) * bassIntensity;
                    float midSparkle = step(0.85, sin(uTime * 20.0 + gl_PointCoord.y * 100.0 + vParticleId * 15.0)) * midIntensity;
                    float highSparkle = step(0.8, sin(uTime * 30.0 + gl_PointCoord.x * 150.0 + vParticleId * 20.0)) * highIntensity;
                    
                    if (uDynamicColors > 0.5) {
                        vec3 sparkleColor1 = vec3(1.0, 0.2, 0.8);
                        vec3 sparkleColor2 = vec3(0.2, 1.0, 0.8);
                        vec3 sparkleColor3 = vec3(0.8, 0.2, 1.0);
                        
                        finalColor += sparkleColor1 * bassSparkle * 0.8;
                        finalColor += sparkleColor2 * midSparkle * 0.6;
                        finalColor += sparkleColor3 * highSparkle * 0.4;
                    } else {
                        finalColor += vec3(1.0, 0.5, 0.2) * bassSparkle * 0.6;
                        finalColor += vec3(0.5, 1.0, 0.2) * midSparkle * 0.4;
                        finalColor += vec3(0.2, 0.5, 1.0) * highSparkle * 0.3;
                    }
                    
                    float glow = 1.0 - smoothstep(0.0, 0.5, r);
                    finalColor *= (1.0 + glow * 0.2);
                    
                    // 节拍闪光
                    finalColor *= (1.0 + uBeatPulse * 0.3);
                    float beatGlow = uBeatPulse * 0.15;
                    finalColor += vec3(1.0, 0.9, 0.7) * beatGlow;
                    
                    finalColor = clamp(finalColor, 0.0, 1.2);
                    
                    float alpha = particle * vAlpha * (1.0 + (bassIntensity + midIntensity) * 0.1);
                    alpha = clamp(alpha, 0.0, 1.0);
                    
                    gl_FragColor = vec4(finalColor * vBrightness * alpha * uParticleBrightness, alpha);
                }
            `}),this.particleSystem=new i(this.geometry,this.material),this.scene.add(this.particleSystem),this.updateColorUniforms()}rebuildParticles(){this.particleCount=Math.round(5e4*this.settings.particleMultiplier),this.positions=new Float32Array(this.particleCount*3),this.velocities=new Float32Array(this.particleCount*2);for(let e=0;e<this.particleCount;e++){let t=e*3,n=e*2;this.positions[t]=(Math.random()-.5)*300,this.positions[t+1]=(Math.random()-.5)*300,this.positions[t+2]=(Math.random()-.5)*100,this.velocities[n]=(Math.random()-.5)*.05,this.velocities[n+1]=(Math.random()-.5)*.05}let e=this.geometry.attributes.position;e&&e.dispose(),this.geometry.setAttribute(`position`,new o(this.positions,3)),this.geometry.attributes.position.needsUpdate=!0}updateColorUniforms(){if(!this.material)return;let e=this.colorPresets[this.settings.colorTheme]||this.colorPresets.neon,t=this.settings.colorTheme===`neon`;this.material.uniforms.uBaseColor.value.set(e.baseColor.r,e.baseColor.g,e.baseColor.b),this.material.uniforms.uBassColor.value.set(e.bassColor.r,e.bassColor.g,e.bassColor.b),this.material.uniforms.uMidColor.value.set(e.midColor.r,e.midColor.g,e.midColor.b),this.material.uniforms.uHighColor.value.set(e.highColor.r,e.highColor.g,e.highColor.b),this.material.uniforms.uBassColorStrength.value=this.settings.bassColorStrength,this.material.uniforms.uMidColorStrength.value=this.settings.midColorStrength,this.material.uniforms.uHighColorStrength.value=this.settings.highColorStrength,this.material.uniforms.uSaturation.value=this.settings.saturation,this.material.uniforms.uDynamicColors.value=+!!t,this.material.uniforms.uColorCycleSpeed.value=this.settings.dynamicColorSpeed}updateDynamicColors(){if(this.settings.colorTheme!==`neon`)return;this.colorShiftTime+=.01*this.settings.dynamicColorSpeed;let e=this.bassLevel*.5,t=this.midLevel*.3,n=this.highLevel*.2;this.currentColorShift={r:Math.sin(this.colorShiftTime+e*5)*this.settings.colorShiftAmount,g:Math.cos(this.colorShiftTime*1.3+t*4)*this.settings.colorShiftAmount,b:Math.sin(this.colorShiftTime*.7+n*3)*this.settings.colorShiftAmount},this.material&&this.material.uniforms.uColorShift.value.set(this.currentColorShift.r,this.currentColorShift.g,this.currentColorShift.b)}updateParticles(){let e=performance.now()*.001,t=Math.min(.016,e-this.lastTime);if(this.time+=t,this.lastTime=e,!this.geometry||!this.geometry.attributes||!this.geometry.attributes.position)return;this.hasAudioData||(this.bassLevel=.2+.15*Math.sin(this.time*.3),this.midLevel=.15+.1*Math.sin(this.time*.5),this.highLevel=.1+.08*Math.sin(this.time*.8),this._beatKickPulse=0),this.material.uniforms.uTime.value=this.time,this.updateDynamicColors();let n=this.geometry.attributes.position,r=n.array,i=this.mouse.x*150,a=this.mouse.y*150,o=Math.sin(this.time*(.5+this.bassLevel))*(.1+this.bassLevel*.5),s=Math.cos(this.time*(.4+this.midLevel))*(.1+this.midLevel*.4);for(let e=0;e<this.particleCount;e++){let t=e*3,n=e*2,c=r[t],l=r[t+1],u=this.velocities[n],d=this.velocities[n+1];if(u+=o*.03,d+=s*.03,u+=(Math.random()-.5)*this.bassLevel*.08,d+=(Math.random()-.5)*this.bassLevel*.08,this.mouseActive){let e=i-c,t=a-l,n=Math.sqrt(e*e+t*t);if(n<this.mouseRange){let r=1-n/this.mouseRange,i=this.settings.mouseStrength*r*(this.mouseDown?2:1);n>1&&(this.settings.attractMode?(u+=e/n*i*.1,d+=t/n*i*.1):(u-=e/n*i*.08,d-=t/n*i*.08),u+=(Math.random()-.5)*this.highLevel*.05,d+=(Math.random()-.5)*this.highLevel*.05)}}u+=Math.sin(l*.01+this.time)*this.midLevel*.03,d+=Math.cos(c*.01+this.time)*this.midLevel*.03;let f=.94-this.bassLevel*.06;u*=f,d*=f,Math.abs(c)>160&&(u*=-.5),Math.abs(l)>160&&(d*=-.5),r[t]=c+u,r[t+1]=l+d,this.velocities[n]=u,this.velocities[n+1]=d}n.needsUpdate=!0,this.material.uniforms.uBassLevel.value=this.bassLevel,this.material.uniforms.uMidLevel.value=this.midLevel,this.material.uniforms.uHighLevel.value=this.highLevel,this.material.uniforms.uAudioStrength.value=this.settings.audioSensitivity,this.material.uniforms.uParticleBrightness.value=this.settings.particleBrightness}updateCamera(){if(!this.settings.cameraAutoMove||!this.camera)return;this.camTime+=.001;let e=this.bassLevel*3,t=Math.sin(this.camTime*.5)*8+(Math.random()-.5)*e,n=Math.cos(this.camTime*.3)*6+(Math.random()-.5)*e,r=this.camBaseZ-this.bassLevel*20;this.camera.position.z+=(r-this.camera.position.z)*.05,this.camera.position.x=t,this.camera.position.y=n,this.camera.lookAt(0,0,0)}setupPostProcessing(){let e=new d(this.scene,this.camera),t=this.renderer.getDrawingBufferSize(new u);this.bloomPass=new m(t,this.settings.bloomStrength,this.settings.bloomRadius,this.settings.bloomThreshold),this.composer=new f(this.renderer),this.composer.addPass(e),this.composer.addPass(this.bloomPass),this.composer.addPass(new p)}setupMouseInteraction(){this.eventListeners.mousemove=e=>{this.mouse.x=e.clientX/window.innerWidth*2-1,this.mouse.y=-(e.clientY/window.innerHeight)*2+1,this.mouseActive=!0,this.material.uniforms.uMouseActive.value=.7,this.material.uniforms.uMouseDown.value=this.mouseDown?1:.5},this.eventListeners.mousedown=e=>{this.mouseDown=!0,this.material.uniforms.uMouseDown.value=1,this.eventListeners.mousemove(e)},this.eventListeners.mouseup=()=>{this.mouseDown=!1,this.material.uniforms.uMouseDown.value=.5},this.eventListeners.mouseleave=()=>{this.mouseActive=!1,this.mouseDown=!1,this.material.uniforms.uMouseActive.value=0,this.material.uniforms.uMouseDown.value=0},this.eventListeners.mouseenter=e=>{this.mouseActive=!0,this.eventListeners.mousemove(e)},window.addEventListener(`mousemove`,this.eventListeners.mousemove),window.addEventListener(`mousedown`,this.eventListeners.mousedown),window.addEventListener(`mouseup`,this.eventListeners.mouseup),window.addEventListener(`mouseleave`,this.eventListeners.mouseleave),window.addEventListener(`mouseenter`,this.eventListeners.mouseenter)}setupKeyboardShortcuts(){this.eventListeners.keydown=e=>{let t=e.target;if(!(t&&t.closest&&t.closest(`input, textarea, select, [contenteditable="true"], .lil-gui`)))switch(e.key.toLowerCase()){case`r`:this.rebuildParticles();break;case`a`:this.settings.attractMode=!this.settings.attractMode,this.updateGUI();break;case`1`:this.settings.particleMultiplier=1,this.rebuildParticles(),this.updateGUI();break;case`2`:this.settings.particleMultiplier=2,this.rebuildParticles(),this.updateGUI();break;case`3`:this.settings.particleMultiplier=3,this.rebuildParticles(),this.updateGUI();break;case`c`:this.settings.cameraAutoMove=!this.settings.cameraAutoMove,this.updateGUI();break}},window.addEventListener(`keydown`,this.eventListeners.keydown)}setupGUI(){this.createGUIContainer();let t={resetParticles:()=>this.rebuildParticles(),resetParams:()=>{Object.assign(this.settings,this.DEFAULTS),this.settings.cameraPosition={...this.DEFAULTS.cameraPosition},this.bassLevel=0,this.midLevel=0,this.highLevel=0,this.hasAudioData=!1,this._beatKickPulse=0,this._smoothBass=0,this._smoothMid=0,this._smoothHigh=0,this.camTime=0,this.colorShiftTime=0,this._syncToScene(),this.updateGUI(),this.rebuildParticles(),this.camera.position.set(this.settings.cameraPosition.x,this.settings.cameraPosition.y,this.settings.cameraPosition.z),this.camera.lookAt(0,0,0),this.camBaseZ=this.settings.cameraPosition.z}};this.gui=new e({title:`音随点动`,container:this.guiContainer});let n=this.gui.addFolder(`颜色主题`),r={};Object.keys(this.colorPresets).forEach(e=>{r[this.colorPresets[e].name]=e}),n.add(this.settings,`colorTheme`,r).name(`主题`).onChange(e=>{this._syncToScene(),this.updateGUI()}),n.open();let i=this.gui.addFolder(`颜色控制`);i.add(this.settings,`bassColorStrength`,0,3,.1).name(`低音颜色强度`).onChange(e=>{this.updateColorUniforms()}),i.add(this.settings,`midColorStrength`,0,3,.1).name(`中音颜色强度`).onChange(e=>{this.updateColorUniforms()}),i.add(this.settings,`highColorStrength`,0,3,.1).name(`高音颜色强度`).onChange(e=>{this.updateColorUniforms()}),i.add(this.settings,`saturation`,0,3,.1).name(`饱和度`).onChange(e=>{this.updateColorUniforms()}),i.add(this.settings,`dynamicColorSpeed`,0,2,.1).name(`颜色变化速度`).onChange(e=>{this.updateColorUniforms()}),i.add(this.settings,`colorShiftAmount`,0,1,.1).name(`颜色偏移量`),i.open();let a=this.gui.addFolder(`音频控制`);a.add(this.settings,`audioSensitivity`,0,3,.1).name(`音频灵敏度`),a.open();let o=this.gui.addFolder(`粒子控制`);o.add(this.settings,`particleMultiplier`,.5,10,.1).name(`粒子数量`).onChange(e=>{this.rebuildParticles()}),o.add(this.settings,`particleSize`,.5,15,.5).name(`粒子大小`).onChange(e=>{this.material&&(this.material.uniforms.uParticleSize.value=e)}),o.add(this.settings,`mouseStrength`,0,5,.1).name(`鼠标引力`),o.add(this.settings,`attractMode`).name(`吸引模式`),o.add(this.settings,`particleBrightness`,0,3,.05).name(`粒子亮度`),o.add(t,`resetParticles`).name(`重置粒子`),o.open();let s=this.gui.addFolder(`视觉效果`);s.add(this.settings,`bloomStrength`,0,5,.1).name(`bloom强度`).onChange(e=>{this.bloomPass.strength=e}),s.add(this.settings,`bloomRadius`,0,1,.05).name(`bloom半径`).onChange(e=>{this.bloomPass.radius=e}),s.add(this.settings,`bloomThreshold`,0,1,.05).name(`bloom阈值`).onChange(e=>{this.bloomPass.threshold=e}),s.add(this.settings,`cameraAutoMove`).name(`相机自动移动`),s.open(),this.gui.add(t,`resetParams`).name(`重置参数`),this.gui.hide()}createGUIContainer(){this.guiContainer=_(`Animation16-gui-container`),v(`Animation16-gui-container`),document.body.appendChild(this.guiContainer)}setupSettingsButton(){this.settingsButton=h(`Animation16-settings-button`),this.settingsButton.addEventListener(`click`,()=>{this.guiVisible=!this.guiVisible,this.guiVisible?this.gui.show():this.gui.hide()}),document.body.appendChild(this.settingsButton)}updateGUI(){if(this.gui){let e=t=>{t.controllers.forEach(e=>e.updateDisplay()),t.folders&&Object.values(t.folders).forEach(t=>e(t))};e(this.gui)}}_syncToScene(){this.bloomPass&&(this.bloomPass.strength=this.settings.bloomStrength,this.bloomPass.radius=this.settings.bloomRadius,this.bloomPass.threshold=this.settings.bloomThreshold),this.updateColorUniforms(),this.material&&(this.material.uniforms.uParticleSize.value=this.settings.particleSize)}render(){this._beatKickPulse>.01?this._beatKickPulse*=.85:this._beatKickPulse=0,this.material&&(this.material.uniforms.uBeatPulse.value=this._beatKickPulse),this.updateParticles(),this.updateCamera(),this.composer&&this.composer.render()}onWindowResize(){let e=this.container?this.container.clientWidth:window.innerWidth,t=this.container?this.container.clientHeight:window.innerHeight;this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t),this.composer&&this.composer.setSize(e,t)}updateWithAudioData(e,t){if(!e||!e.isPlaying){this.hasAudioData&&=!1;return}if(e&&e.audioFeature&&e.audioFeature.animation){let t=e.audioFeature.animation;this.hasAudioData=!0,this.bassLevel=t.bass,this.midLevel=t.mid,this.highLevel=t.high,t.kick>.6&&(this._beatKickPulse=Math.min(1,t.kick)),this._smoothBass=0,this._smoothMid=0,this._smoothHigh=0;return}if(e&&e.energy){this.hasAudioData=!0;let t=.3;this._smoothBass=this._smoothBass*(1-t)+(e.energy.low||0)*t,this._smoothMid=this._smoothMid*(1-t)+(e.energy.mid||0)*t,this._smoothHigh=this._smoothHigh*(1-t)+(e.energy.high||0)*t,this.bassLevel=this._smoothBass,this.midLevel=this._smoothMid,this.highLevel=this._smoothHigh,e.beat&&e.beat.kick>.6&&(this._beatKickPulse=Math.min(1,e.beat.kick));return}this.hasAudioData&&=!1}setEffectMode(e){return console.log(`Animation16 效果模式：${e}`),!0}updateSettings(e){let t=this.settings.cameraPosition;if(Object.assign(this.settings,e),e.colorTheme!==void 0&&this.updateColorUniforms(),(e.bassColorStrength!==void 0||e.midColorStrength!==void 0||e.highColorStrength!==void 0||e.saturation!==void 0||e.dynamicColorSpeed!==void 0)&&this.updateColorUniforms(),e.particleMultiplier!==void 0&&this.geometry&&this.rebuildParticles(),e.particleSize!==void 0&&this.material&&(this.material.uniforms.uParticleSize.value=e.particleSize),e.bloomStrength!==void 0&&this.bloomPass&&(this.bloomPass.strength=e.bloomStrength),e.bloomRadius!==void 0&&this.bloomPass&&(this.bloomPass.radius=e.bloomRadius),e.bloomThreshold!==void 0&&this.bloomPass&&(this.bloomPass.threshold=e.bloomThreshold),e.cameraPosition){let n={...t,...e.cameraPosition};this.settings.cameraPosition=n,this.camera&&(this.camera.position.set(n.x,n.y,n.z),this.camera.lookAt(0,0,0),this.camBaseZ=n.z)}}dispose(){if(Object.entries(this.eventListeners).forEach(([e,t])=>{t&&window.removeEventListener(e,t)}),g(this.settingsButton,this.guiContainer,this.gui),this.settingsButton=null,this.guiContainer=null,this.gui=null,this.particleSystem&&this.scene&&(this.scene.remove(this.particleSystem),this.particleSystem=null),this.geometry&&=(this.geometry.dispose(),null),this.material&&=(this.material.dispose(),null),this.composer&&=(this.composer.dispose(),null),this.bloomPass&&=(this.bloomPass.dispose(),null),this.renderer&&=(this.renderer.dispose(),null),this.scene){for(;this.scene.children.length>0;)this.scene.remove(this.scene.children[0]);this.scene=null}this.canvas&&this.canvas.parentNode&&this.canvas.parentNode.removeChild(this.canvas),this.canvas=null,this.originalCanvas&&(this.originalCanvas.style.display=`block`),console.log(`✅ Animation16 资源已清理`)}getAudioDataForUI(){return{bass:this.bassLevel,mid:this.midLevel,high:this.highLevel}}playAudio(){console.log(`Animation16: 音频播放由系统控制`)}pauseAudio(){console.log(`Animation16: 音频暂停由系统控制`)}};export{y as default};