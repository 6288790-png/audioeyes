import{a as e}from"./lil-gui.esm-jlbWO7FJ.js";import{Bt as t,Ht as n,Jn as r,Tt as i,_t as a,g as o,qn as s,r as c,wr as l}from"./three.module-CgISyWQV.js";import{n as u,r as d,t as f}from"./OutputPass-D9GSoAm2.js";import{t as p}from"./UnrealBloomPass-1z79deN3.js";import{i as m,n as h,r as g,t as _}from"./GUIHelper-DspWBXk2.js";import{t as v}from"./OrbitControls-DVnblHSy.js";var y=class{constructor(e,t={}){this.canvas=e,this.colorThemes={neonRainbow:{name:`霓虹彩虹`,baseColor1:`#ff00ff`,baseColor2:`#00ffff`,accentColor:`#ffff00`,themeType:1},spectrum:{name:`七彩色谱`,baseColor1:`#ff4444`,baseColor2:`#44ff44`,accentColor:`#4444ff`,themeType:0},softRainbow:{name:`柔和彩虹`,baseColor1:`#ff88cc`,baseColor2:`#88ccff`,accentColor:`#ccff88`,themeType:2},flame:{name:`火焰光谱`,baseColor1:`#ff4400`,baseColor2:`#ff8800`,accentColor:`#ffcc00`,themeType:3},ocean:{name:`深海幽蓝`,baseColor1:`#0077b6`,baseColor2:`#00b4d8`,accentColor:`#90e0ef`,themeType:2}};let n={colorTheme:`neonRainbow`,amplitude:1,detail:2,audioResponse:1.5,brightness:.5,autoRotate:!1,rotationSpeed:.5,waveSpeed:1,meshSize:30,segments:140,bloomStrength:.5,bloomRadius:.2,bloomThreshold:.6,glowIntensity:1,saturation:1,kickThreshold:.6,kickDecayRate:8,cameraPosition:{x:0,y:10,z:20}};this.settings={...n,...t},this.DEFAULTS=JSON.parse(JSON.stringify(n)),this.scene=null,this.camera=null,this.renderer=null,this.controls=null,this.composer=null,this.bloomPass=null,this.fluidMesh=null,this.fluidGeometry=null,this.fluidMaterial=null,this.audioLow=0,this.audioMid=0,this.audioHigh=0,this.audioIntensity=0,this.audioFeature=null,this.hasAudioData=!1,this.isPlaying=!1,this.gui=null,this.guiContainer=null,this.guiVisible=!1,this.lastTime=0,this.time=0,this.settingsButton=null;try{this.init(),this.lastTime=performance.now()*.001}catch(e){console.error(`❌ Animation15 初始化失败:`,e)}}init(){try{return this.setupThreeJS(),this.createFluidMesh(),this.setupPostProcessing(),this.setupGUI(),this.setupSettingsButton(),console.log(`✅ Animation15 初始化成功`),!0}catch(e){throw console.error(`❌ Animation15 初始化失败:`,e),e}}setupThreeJS(){this.scene=new s,this.camera=new t(75,window.innerWidth/window.innerHeight,.1,1e3),this.camera.position.set(this.settings.cameraPosition.x,this.settings.cameraPosition.y,this.settings.cameraPosition.z),this.camera.lookAt(0,0,0),this.renderer=new c({canvas:this.canvas,antialias:!0,alpha:!0}),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.setClearColor(0,0),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.outputColorSpace=a,this.canvas.style.backgroundColor=`transparent`,this.canvas.style.zIndex=`1`,this.controls=new v(this.camera,this.canvas),this.controls.enableDamping=!0,this.controls.target.set(0,0,0),this.controls.autoRotate=this.settings.autoRotate,this.controls.autoRotateSpeed=this.settings.rotationSpeed,this.controls.saveState()}createFluidMesh(){this.fluidMesh&&(this.scene.remove(this.fluidMesh),this.fluidGeometry&&this.fluidGeometry.dispose(),this.fluidMaterial&&this.fluidMaterial.dispose()),this.fluidGeometry=new n(this.settings.meshSize,this.settings.meshSize,this.settings.segments,this.settings.segments);let e=this.colorThemes[this.settings.colorTheme]||this.colorThemes.neonRainbow;this.fluidMaterial=new r({uniforms:{uTime:{value:0},uAmplitude:{value:this.settings.amplitude},uDetail:{value:this.settings.detail},uAudioResponse:{value:this.settings.audioResponse},uBrightness:{value:this.settings.brightness},uAudioLow:{value:0},uAudioMid:{value:0},uAudioHigh:{value:0},uColor1:{value:new o(e.baseColor1)},uColor2:{value:new o(e.baseColor2)},uColor3:{value:new o(e.accentColor)},uWaveSpeed:{value:this.settings.waveSpeed},uThemeType:{value:e.themeType},uAudioIntensity:{value:0},uGlowIntensity:{value:this.settings.glowIntensity},uSaturation:{value:this.settings.saturation},uBeatKick:{value:0}},vertexShader:`
                uniform float uTime;
                uniform float uAmplitude;
                uniform float uDetail;
                uniform float uAudioResponse;
                uniform float uAudioLow;
                uniform float uAudioMid;
                uniform float uAudioHigh;
                uniform float uWaveSpeed;
                uniform float uBeatKick;
                
                varying vec2 vUv;
                varying float vAudioIntensity;
                varying float vHeight;
                varying float vFrequencyMix;
                
                void main() {
                    vUv = uv;
                    
                    vec3 pos = position;
                    
                    // 基础波形
                    float wave1 = sin(pos.x * uDetail * 0.3 + uTime * uWaveSpeed * 1.5) * 0.3;
                    float wave2 = cos(pos.y * uDetail * 0.3 + uTime * uWaveSpeed * 1.2) * 0.3;
                    float wave3 = sin(pos.x * uDetail * 0.5 + pos.y * uDetail * 0.6 + uTime * uWaveSpeed * 1.0) * 0.2;
                    
                    // 音频影响
                    float kickBoost = 1.0 + uBeatKick * 2.0;
                    float audioWave = (uAudioLow * sin(pos.x * 1.5 + uTime * uWaveSpeed * 2.0) +
                                     uAudioMid * cos(pos.y * 1.5 + uTime * uWaveSpeed * 1.8) +
                                     uAudioHigh * sin(pos.x * 1.0 + pos.y * 1.0 + uTime * uWaveSpeed * 1.5)) * uAudioResponse * 0.8 * kickBoost;
                    
                    // 组合波形
                    float totalWave = (wave1 + wave2 + wave3 + audioWave);
                    pos.z = totalWave * uAmplitude;
                    
                    vAudioIntensity = (uAudioLow + uAudioMid + uAudioHigh) / 1.5;
                    vHeight = totalWave;
                    vFrequencyMix = uAudioMid * 0.5 + uAudioHigh * 0.5; // 用于颜色变化的频率混合
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,fragmentShader:`
                uniform float uTime;
                uniform float uBrightness;
                uniform vec3 uColor1;
                uniform vec3 uColor2;
                uniform vec3 uColor3;
                uniform float uThemeType;
                uniform float uAudioIntensity;
                uniform float uGlowIntensity;  // 新增：发光强度控制
                uniform float uSaturation;  // 色彩饱和度控制
                uniform float uBeatKick;  // 节拍脉冲
                
                varying vec2 vUv;
                varying float vAudioIntensity;
                varying float vHeight;
                varying float vFrequencyMix;
                
                // 三色调色板函数 - 使用 uniform 颜色
                vec3 getPaletteColor(float t, vec3 c1, vec3 c2, vec3 c3) {
                    t = fract(t);
                    if (t < 0.333) {
                        return mix(c1, c2, t * 3.0);
                    } else if (t < 0.666) {
                        return mix(c2, c3, (t - 0.333) * 3.0);
                    } else {
                        return mix(c3, c1, (t - 0.666) * 3.0);
                    }
                }
                
                // 音频响应颜色
                vec3 audioDynamicColor(float audioIntensity, float frequencyMix, float time) {
                    // 基础颜色位置（随时间缓慢变化）
                    float baseHue = time * 0.1;
                    
                    // 低频控制变化速度
                    float speedMod = mix(0.05, 0.3, audioIntensity);
                    
                    // 中高频控制颜色位置
                    float hueShift = frequencyMix * 0.5;
                    
                    // 最终颜色位置
                    float hue = baseHue * speedMod + hueShift;
                    
                    vec3 dynamicColor = getPaletteColor(hue, uColor1, uColor2, uColor3);
                    
                    // 添加闪烁效果
                    float flicker = sin(time * 10.0 + vUv.x * 5.0) * 0.1 + 0.9;
                    dynamicColor *= flicker;
                    
                    return dynamicColor;
                }
                
                void main() {
                    vec3 dynamicColor = audioDynamicColor(vAudioIntensity, vFrequencyMix, uTime);
                    
                    // 根据高度添加颜色变化
                    float heightFactor = vHeight * 0.5 + 0.5;
                    
                    vec3 color1 = mix(dynamicColor, getPaletteColor(uTime * 0.08 + 0.7, uColor1, uColor2, uColor3), 0.5);
                    vec3 color2 = mix(dynamicColor, getPaletteColor(uTime * 0.08 + 0.3, uColor1, uColor2, uColor3), 0.5);
                    
                    vec3 baseColor = mix(color1, color2, heightFactor);
                    
                    // 音频强度影响整体亮度 - 移除亮度提升，保持纯饱和色
                    // 不再提升亮度，保持颜色饱和度
                    
                    // 添加发光效果 - 大幅降低基础强度
                    float glow1 = sin(vUv.x * 6.0 + uTime * 2.0) * 0.05;  // 从0.1降低到0.05
                    float glow2 = cos(vUv.y * 6.0 + uTime * 1.8) * 0.05;  // 从0.1降低到0.05
                    float baseGlow = (glow1 + glow2) * (0.15 + vAudioIntensity * 0.3);  // 大幅降低基础强度
                    
                    // 应用发光强度控制
                    baseGlow *= uGlowIntensity;
                    
                    // 不同主题的发光颜色和强度 - 大幅降低强度
                    vec3 glowColor;
                    float glowStrength;
                    
                    if (uThemeType < 0.5) {
                        // 七彩色谱：白色光晕为主
                        glowColor = vec3(1.0, 1.0, 1.0);
                        glowStrength = 0.2;  // 从0.5降低到0.2
                    } else if (uThemeType < 1.5) {
                        // 霓虹彩虹：彩色强光晕
                        glowColor = getPaletteColor(uTime * 0.2, uColor1, uColor2, uColor3);
                        glowStrength = 0.3;  // 从1.0降低到0.3
                    } else if (uThemeType < 2.5) {
                        // 柔和彩虹：柔和光晕
                        glowColor = vec3(0.9, 0.95, 1.0);
                        glowStrength = 0.1;  // 从0.3降低到0.1
                    } else {
                        // 火焰光谱：橙黄色光晕
                        glowColor = vec3(1.0, 0.8, 0.2);
                        glowStrength = 0.15;  // 从0.8降低到0.15
                    }
                    
                    // 不同频率的音频产生不同颜色的光晕 - 大幅降低强度
                    vec3 bassGlow = vec3(1.0, 0.0, 0.0) * baseGlow * 0.2 * uAudioIntensity * glowStrength;  // 从0.5降低到0.2
                    vec3 midGlow = vec3(0.0, 1.0, 0.0) * baseGlow * 0.1 * uAudioIntensity * glowStrength;   // 从0.3降低到0.1
                    vec3 highGlow = vec3(0.0, 0.0, 1.0) * baseGlow * 0.05 * uAudioIntensity * glowStrength; // 从0.2降低到0.05
                    
                    // 主题特定的光晕 - 大幅降低强度
                    vec3 themeGlow = glowColor * baseGlow * glowStrength * uAudioIntensity * 0.5;  // 添加0.5的衰减因子
                    
                    // 计算最终颜色
                    vec3 finalColor = baseColor;
                    
                    // 根据发光强度决定是否添加光晕效果
                    if (uGlowIntensity > 0.01) {
                        finalColor = finalColor + bassGlow + midGlow + highGlow + themeGlow;
                    }
                    
                    // 亮度调节
                    finalColor *= uBrightness;
                    
                    // 饱和度调整 - 使用 luminance 权重进行灰阶混合
                    float gray = dot(finalColor, vec3(0.299, 0.587, 0.114));
                    finalColor = mix(vec3(gray), finalColor, uSaturation);
                    
                    // 节拍脉冲闪光
                    float beatFlash = uBeatKick * uAudioIntensity;
                    finalColor += vec3(1.0, 0.9, 0.7) * beatFlash * 0.3;
                    
                    // 确保颜色不会过亮（放在所有调整之后，防止后续操作绕过限制）
                    finalColor = clamp(finalColor, vec3(0.0), vec3(2.0));
                    
                    gl_FragColor = vec4(finalColor, 1.0);
                }
            `,side:2,transparent:!1}),this.fluidMesh=new i(this.fluidGeometry,this.fluidMaterial),this.fluidMesh.rotation.x=-Math.PI/2.3,this.scene.add(this.fluidMesh)}setupPostProcessing(){let e=new u(this.scene,this.camera);this.bloomPass=new p(new l(window.innerWidth,window.innerHeight),this.settings.bloomStrength,this.settings.bloomRadius,this.settings.bloomThreshold),this.composer=new d(this.renderer),this.composer.addPass(e),this.composer.addPass(this.bloomPass),this.composer.addPass(new f)}setupGUI(){this.createGUIContainer();let t={resetParams:()=>{Object.assign(this.settings,this.DEFAULTS),this.settings.cameraPosition={...this.DEFAULTS.cameraPosition},this.resetState(),this.bloomPass&&(this.bloomPass.strength=this.settings.bloomStrength,this.bloomPass.radius=this.settings.bloomRadius,this.bloomPass.threshold=this.settings.bloomThreshold);let e=t=>{t.controllers.forEach(e=>e.updateDisplay()),t.folders&&Object.values(t.folders).forEach(t=>e(t))};e(this.gui),this.rebuildFluidMesh(),this.camera.position.set(this.settings.cameraPosition.x,this.settings.cameraPosition.y,this.settings.cameraPosition.z),this.controls.target.set(0,0,0),this.controls.autoRotate=this.settings.autoRotate,this.controls.autoRotateSpeed=this.settings.rotationSpeed,this.controls.saveState(),this.controls.reset(),this.controls.update()}};this.gui=new e({title:`频谱流形`,container:this.guiContainer,closeFolders:!1});let n=this.gui.addFolder(`视觉设置`),r={};Object.keys(this.colorThemes).forEach(e=>{r[this.colorThemes[e].name]=e}),n.add(this.settings,`colorTheme`,r).name(`颜色主题`).onChange(e=>{this.applyColorTheme(e)}),n.add(this.settings,`amplitude`,.1,5,.1).name(`波形强度`).onChange(e=>{this.settings.amplitude=e,this.fluidMaterial&&(this.fluidMaterial.uniforms.uAmplitude.value=e)}),n.add(this.settings,`detail`,.5,4,.1).name(`波浪细节`).onChange(e=>{this.settings.detail=e,this.fluidMaterial&&(this.fluidMaterial.uniforms.uDetail.value=e)}),n.add(this.settings,`brightness`,.1,3,.05).name(`色彩亮度`).onChange(e=>{this.settings.brightness=e,this.fluidMaterial&&(this.fluidMaterial.uniforms.uBrightness.value=e)}),n.add(this.settings,`saturation`,0,3,.1).name(`色彩饱和度`).onChange(e=>{this.settings.saturation=e,this.fluidMaterial&&(this.fluidMaterial.uniforms.uSaturation.value=e)}),n.add(this.settings,`waveSpeed`,.1,3,.1).name(`波浪速度`).onChange(e=>{this.settings.waveSpeed=e,this.fluidMaterial&&(this.fluidMaterial.uniforms.uWaveSpeed.value=e)}),n.add(this.settings,`glowIntensity`,0,2,.1).name(`光晕强度`).onChange(e=>{this.fluidMaterial&&(this.fluidMaterial.uniforms.uGlowIntensity.value=e)}),n.add(this.settings,`autoRotate`).name(`自动旋转`).onChange(e=>{this.settings.autoRotate=e,this.controls.autoRotate=e}),n.add(this.settings,`rotationSpeed`,.1,2,.1).name(`旋转速度`).onChange(e=>{this.settings.rotationSpeed=e,this.controls.autoRotateSpeed=e}),n.open();let i=this.gui.addFolder(`Bloom 效果`);i.add(this.settings,`bloomStrength`,0,3,.1).name(`bloom强度`).onChange(e=>{this.settings.bloomStrength=e,this.bloomPass&&(this.bloomPass.strength=e)}),i.add(this.settings,`bloomRadius`,0,1,.05).name(`bloom半径`).onChange(e=>{this.settings.bloomRadius=e,this.bloomPass&&(this.bloomPass.radius=e)}),i.add(this.settings,`bloomThreshold`,0,1,.05).name(`bloom阈值`).onChange(e=>{this.settings.bloomThreshold=e,this.bloomPass&&(this.bloomPass.threshold=e)}),i.open();let a=this.gui.addFolder(`音频控制`);a.add(this.settings,`audioResponse`,.1,3,.1).name(`音频响应度`).onChange(e=>{this.settings.audioResponse=e,this.fluidMaterial&&(this.fluidMaterial.uniforms.uAudioResponse.value=e)}),a.add(this.settings,`kickThreshold`,.1,1.5,.05).name(`底鼓触发阈值`).onChange(e=>{this.settings.kickThreshold=e}),a.add(this.settings,`kickDecayRate`,1,20,1).name(`脉冲衰减速度`).onChange(e=>{this.settings.kickDecayRate=e}),a.open();let o=this.gui.addFolder(`网格设置`);o.add(this.settings,`meshSize`,10,50,1).name(`网格大小`).onChange(e=>{this.settings.meshSize=e,this.rebuildFluidMesh()}),o.add(this.settings,`segments`,50,200,1).name(`网格细分`).onChange(e=>{this.settings.segments=e,this.rebuildFluidMesh()}),o.open(),this.gui.add(t,`resetParams`).name(`重置参数`),this.gui.hide()}applyColorTheme(e){(!e||!this.colorThemes[e])&&(console.warn(`主题 ${e} 不存在，使用默认主题`),e=`neonRainbow`);let t=this.colorThemes[e];if(!this.fluidMaterial)return console.error(`fluidMaterial 未初始化，无法应用主题`),!1;if(!this.fluidMaterial.uniforms.uColor1||!this.fluidMaterial.uniforms.uColor2||!this.fluidMaterial.uniforms.uColor3)return console.error(`material uniforms 不存在`),!1;try{return this.fluidMaterial.uniforms.uColor1.value=new o(t.baseColor1),this.fluidMaterial.uniforms.uColor2.value=new o(t.baseColor2),this.fluidMaterial.uniforms.uColor3.value=new o(t.accentColor),this.fluidMaterial.uniforms.uThemeType.value=t.themeType,this.settings.colorTheme=e,!0}catch(e){return console.error(`❌ 应用主题失败:`,e),!1}}rebuildFluidMesh(){let e=this.settings.colorTheme;this.createFluidMesh(),this.applyColorTheme(e),this.updateAudioUniforms()}createGUIContainer(){this.guiContainer=g(`Animation15-gui-container`),_(`Animation15-gui-container`),document.body.appendChild(this.guiContainer)}setupSettingsButton(){this.settingsButton=m(`Animation15-settings-button`),this.settingsButton.addEventListener(`click`,()=>{this.guiVisible=!this.guiVisible,this.guiVisible?this.gui.show():this.gui.hide()}),document.body.appendChild(this.settingsButton)}updateAudioUniforms(){if(this.fluidMaterial){let e,t,n,r;if(this.audioFeature)e=this.audioFeature.bass,t=this.audioFeature.mid,n=this.audioFeature.high,r=this.audioFeature.energy;else{e=this.audioLow,t=this.audioMid,n=this.audioHigh,r=this.audioIntensity;let i=.35;this._smoothLow===void 0&&(this._smoothLow=e,this._smoothMid=t,this._smoothHigh=n,this._smoothIntensity=r),this._smoothLow+=(e-this._smoothLow)*i,this._smoothMid+=(t-this._smoothMid)*i,this._smoothHigh+=(n-this._smoothHigh)*i,this._smoothIntensity+=(r-this._smoothIntensity)*i,e=this._smoothLow,t=this._smoothMid,n=this._smoothHigh,r=this._smoothIntensity}this.fluidMaterial.uniforms.uAudioLow.value=e,this.fluidMaterial.uniforms.uAudioMid.value=t,this.fluidMaterial.uniforms.uAudioHigh.value=n,this.fluidMaterial.uniforms.uAudioIntensity.value=r}}render(){let e=performance.now()*.001,t=Math.min(.033,e-this.lastTime);if(this.lastTime=e,this.time+=t,this._beatKickValue===void 0?this._beatKickValue=0:(this._beatKickValue*=Math.max(0,1-t*this.settings.kickDecayRate),this._beatKickValue<.001&&(this._beatKickValue=0)),this.fluidMaterial&&(this.fluidMaterial.uniforms.uTime.value=this.time),!this.hasAudioData){this.fluidMaterial&&(this.fluidMaterial.uniforms.uAudioLow.value=0,this.fluidMaterial.uniforms.uAudioMid.value=0,this.fluidMaterial.uniforms.uAudioHigh.value=0,this.fluidMaterial.uniforms.uAudioIntensity.value=0,this.fluidMaterial.uniforms.uBeatKick.value=0),this.controls&&this.controls.update(),this.fluidMesh&&(this.fluidMesh.rotation.z=Math.sin(this.time*.02)*.1),this.composer&&this.composer.render();return}this.updateAudioUniforms(),this.fluidMaterial&&(this.fluidMaterial.uniforms.uBeatKick.value=this._beatKickValue),this.controls&&this.controls.update(),this.fluidMesh&&(this.fluidMesh.rotation.z=Math.sin(this.time*.02)*.1),this.composer&&this.composer.render()}startAnimationLoop(){this.lastTime=performance.now()*.001}onWindowResize(){if(!this.composer||!this.renderer||!this.camera)return;let e=window.innerWidth,t=window.innerHeight;this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t),this.composer.setSize(e,t)}updateWithAudioData(e,t){if(e&&e.audioFeature&&e.audioFeature.animation){this.hasAudioData=!0;let t=e.audioFeature.animation;this.audioFeature=t,this.audioLow=t.bass,this.audioMid=t.mid,this.audioHigh=t.high,this.audioIntensity=t.energy,t.kick>this.settings.kickThreshold&&(this._beatKickValue=Math.min(1,t.kick)),this._smoothLow=void 0,this.isPlaying=e.isPlaying===void 0?!0:e.isPlaying;return}if(e&&e.energy){this.hasAudioData=!0,this.audioFeature=null;let t=.3;this.audioLow=this.audioLow*(1-t)+(e.energy.low||0)*t,this.audioMid=this.audioMid*(1-t)+(e.energy.mid||0)*t,this.audioHigh=this.audioHigh*(1-t)+(e.energy.high||0)*t,this.audioIntensity=(this.audioLow+this.audioMid+this.audioHigh)/3,e.beat&&e.beat.kick>this.settings.kickThreshold&&(this._beatKickValue=Math.min(1,e.beat.kick)),this.isPlaying=e.isPlaying===void 0?!0:e.isPlaying;return}this.hasAudioData&&(this.hasAudioData=!1,this.isPlaying=!1)}resetState(){this.audioLow=0,this.audioMid=0,this.audioHigh=0,this.audioIntensity=0,this.audioFeature=null,this.hasAudioData=!1,this.isPlaying=!1,this._beatKickValue=void 0,this._smoothLow=void 0,this._smoothMid=void 0,this._smoothHigh=void 0,this._smoothIntensity=void 0}setEffectMode(e){return console.log(`Animation15 当前效果模式：${e}`),!0}updateSettings(e){let t={...this.settings};Object.assign(this.settings,e),e.cameraPosition&&this.camera.position.set(e.cameraPosition.x===void 0?this.settings.cameraPosition.x:e.cameraPosition.x,e.cameraPosition.y===void 0?this.settings.cameraPosition.y:e.cameraPosition.y,e.cameraPosition.z===void 0?this.settings.cameraPosition.z:e.cameraPosition.z),e.colorTheme!==void 0&&e.colorTheme!==t.colorTheme&&(this.gui?this.gui.controllersRecursive().forEach(t=>{t.property===`colorTheme`&&(t.setValue(e.colorTheme),t.updateDisplay())}):this.applyColorTheme(e.colorTheme)),e.amplitude!==void 0&&this.fluidMaterial&&(this.fluidMaterial.uniforms.uAmplitude.value=e.amplitude),e.detail!==void 0&&this.fluidMaterial&&(this.fluidMaterial.uniforms.uDetail.value=e.detail),e.audioResponse!==void 0&&this.fluidMaterial&&(this.fluidMaterial.uniforms.uAudioResponse.value=e.audioResponse),e.brightness!==void 0&&this.fluidMaterial&&(this.fluidMaterial.uniforms.uBrightness.value=e.brightness),e.bloomStrength!==void 0&&this.bloomPass&&(this.bloomPass.strength=e.bloomStrength),e.bloomRadius!==void 0&&this.bloomPass&&(this.bloomPass.radius=e.bloomRadius),e.bloomThreshold!==void 0&&this.bloomPass&&(this.bloomPass.threshold=e.bloomThreshold),e.glowIntensity!==void 0&&this.fluidMaterial&&(this.fluidMaterial.uniforms.uGlowIntensity.value=e.glowIntensity),e.saturation!==void 0&&this.fluidMaterial&&(this.fluidMaterial.uniforms.uSaturation.value=e.saturation),e.waveSpeed!==void 0&&this.fluidMaterial&&(this.fluidMaterial.uniforms.uWaveSpeed.value=e.waveSpeed),e.autoRotate!==void 0&&this.controls&&(this.controls.autoRotate=e.autoRotate),e.rotationSpeed!==void 0&&this.controls&&(this.controls.autoRotateSpeed=e.rotationSpeed),(e.meshSize!==void 0||e.segments!==void 0)&&this.rebuildFluidMesh()}dispose(){if(h(this.settingsButton,this.guiContainer,this.gui),this.settingsButton=null,this.fluidMesh&&this.scene&&(this.scene.remove(this.fluidMesh),this.fluidMesh=null),this.fluidGeometry&&=(this.fluidGeometry.dispose(),null),this.fluidMaterial&&=(this.fluidMaterial.dispose(),null),this.composer&&=(this.composer.dispose(),null),this.bloomPass&&=(this.bloomPass.dispose(),null),this.renderer&&=(this.renderer.dispose(),null),this.controls&&=(this.controls.dispose(),null),this.scene){for(;this.scene.children.length>0;)this.scene.remove(this.scene.children[0]);this.scene=null}console.log(`✅ Animation15 资源已清理`)}getAudioDataForUI(){return{bass:this.audioLow,mid:this.audioMid,high:this.audioHigh,intensity:this.audioIntensity}}playAudio(){console.log(`Animation15: 音频播放由系统控制`)}pauseAudio(){console.log(`Animation15: 音频暂停由系统控制`)}getStatus(){return{settings:this.settings,audioIntensity:this.audioIntensity,time:this.time,isPlaying:this.isPlaying,currentTheme:this.colorThemes[this.settings.colorTheme]?.name||`未知`}}};export{y as default};