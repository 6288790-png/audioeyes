import{a as e}from"./lil-gui.esm-jlbWO7FJ.js";import{Bt as t,Jn as n,Wt as r,_t as i,f as a,g as o,l as s,qn as c,r as l,u,wr as d}from"./three.module-CgISyWQV.js";import{n as f,r as p,t as m}from"./OutputPass-D9GSoAm2.js";import{t as h}from"./UnrealBloomPass-1z79deN3.js";import{i as g,n as _,r as v,t as y}from"./GUIHelper-DspWBXk2.js";import{t as b}from"./OrbitControls-DVnblHSy.js";var x=class{constructor(e,t={}){this.canvas=e,this.colorThemes={rainbow:{name:`彩虹律动`,baseColor:`#ffd43b`,hueVariation:.5,saturationBoost:1.8},monochrome:{name:`单色渐变`,baseColor:`#ffffff`,hueVariation:0,saturationBoost:0}};let n={color:`#ffd43b`,colorTheme:`rainbow`,bloomStrength:.15,bloomRadius:.1,bloomThreshold:.9,audioSensitivity:1,wingWidth:3,zWidth:.4,autoRotate:!1,particleSize:2.6,particleCount:45e3,cameraPosition:{x:0,y:2,z:12},particleBrightness:1,motionIntensity:.6,brightnessIntensity:1,textureIntensity:0,smoothnessIntensity:1,variationIntensity:0};this.settings={...n,...t},this.defaultSettings=n,this.scene=null,this.camera=null,this.renderer=null,this.controls=null,this.composer=null,this.bloomPass=null,this.particleSystem=null,this.geometry=null,this.shaderMaterial=null,this.particleCount=this.settings.particleCount,this.audioFreq=0,this.lowFreq=0,this.bass=0,this.mid=0,this.high=0,this.smoothedAudioFreq=0,this.smoothedLowFreq=0,this.motionVal=0,this.brightnessVal=0,this.textureVal=0,this.smoothnessVal=0,this.variationVal=0,this.kickTrigger=0,this.snareTrigger=0,this.hihatTrigger=0,this.downbeatTrigger=0,this.smoothedKick=0,this.smoothedSnare=0,this.smoothedHihat=0,this.smoothedDownbeat=0,this.gui=null,this.guiContainer=null,this.guiVisible=!1,this.hasAudioData=!1,this.settingsButton=null,this.init().catch(e=>{console.error(`❌ Animation7 初始化失败:`,e)})}async init(){try{return await this.setupThreeJS(),this.createParticleSystem(),this.setupPostProcessing(),this.setupGUI(),this.setupSettingsButton(),console.log(`✅ Animation7 初始化成功`),!0}catch(e){throw console.error(`❌ Animation7 初始化失败:`,e),e}}async setupThreeJS(){this.scene=new c,this.camera=new t(50,window.innerWidth/window.innerHeight,.1,1e3),this.camera.position.set(this.settings.cameraPosition.x,this.settings.cameraPosition.y,this.settings.cameraPosition.z),this.camera.lookAt(0,1,0),this.renderer=new l({canvas:this.canvas,antialias:!0,alpha:!0}),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.setClearColor(0,0),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.outputColorSpace=i,this.canvas.style.backgroundColor=`transparent`,this.canvas.style.zIndex=`1`,this.controls=new b(this.camera,this.canvas),this.controls.enableDamping=!0,this.controls.target.set(0,1,0),this.controls.saveState(),this.crystalTexture=this.createCrystalTexture()}createCrystalTexture(){let e=document.createElement(`canvas`);e.width=64,e.height=64;let t=e.getContext(`2d`);t.fillStyle=`black`,t.fillRect(0,0,64,64);let n=t.createRadialGradient(32,32,0,32,32,32);return n.addColorStop(0,`rgba(255, 255, 255, 1)`),n.addColorStop(.2,`rgba(200, 230, 255, 0.8)`),n.addColorStop(.5,`rgba(50, 100, 255, 0.2)`),n.addColorStop(1,`rgba(0, 0, 0, 0)`),t.fillStyle=n,t.beginPath(),t.arc(32,32,30,0,Math.PI*2),t.fill(),t.strokeStyle=`rgba(255, 255, 255, 0.5)`,t.lineWidth=1,t.beginPath(),t.moveTo(32,10),t.lineTo(32,54),t.moveTo(10,32),t.lineTo(54,32),t.stroke(),new a(e)}createParticleSystem(){this.particleSystem&&(this.scene.remove(this.particleSystem),this.geometry&&this.geometry.dispose(),this.shaderMaterial&&this.shaderMaterial.dispose()),this.particleCount=this.settings.particleCount,this.geometry=new u;let e=new Float32Array(this.particleCount*3),t=new Float32Array(this.particleCount*3);for(let n=0;n<this.particleCount;n++){let r=Math.random()>.5?1:-1,i=Math.random(),a=i**2*this.settings.wingWidth*r,o=i**.5*4+(Math.random()-.5)*.5;a*=o*.5,e[n*3]=a,e[n*3+1]=o-1,e[n*3+2]=(Math.random()-.5)*this.settings.zWidth,t[n*3]=.2+Math.random()*.5,t[n*3+1]=Math.random()*Math.PI*2,t[n*3+2]=+(Math.random()>.75)}this.geometry.setAttribute(`position`,new s(e,3)),this.geometry.setAttribute(`extra`,new s(t,3)),this.shaderMaterial=new n({uniforms:{uTime:{value:0},uColor:{value:new o(this.settings.color)},uTexture:{value:this.crystalTexture},uAudioFreq:{value:0},uLowFreq:{value:0},uSize:{value:this.settings.particleSize},uColorIntensity:{value:1},uHueShift:{value:0},uBrightness:{value:this.settings.particleBrightness},uMotion:{value:0},uBrightnessFeat:{value:0},uTextureFeat:{value:0},uSmoothness:{value:0},uVariation:{value:0},uKick:{value:0},uSnare:{value:0},uHihat:{value:0},uDownbeat:{value:0}},vertexShader:`
                uniform float uTime;
                uniform float uAudioFreq;
                uniform float uLowFreq;
                uniform float uSize;
                uniform float uMotion;
                uniform float uTextureFeat;
                uniform float uSmoothness;
                uniform float uVariation;
                uniform float uKick;
                uniform float uSnare;
                uniform float uHihat;
                attribute vec3 extra;
                varying float vOpacity;
                varying float vIsTrail;
                varying float vRotation;

                void main() {
                    vec3 pos = position;
                    float speed = extra.x;
                    float rnd = extra.y;
                    vIsTrail = extra.z;
                    
                    // kick 节拍脉冲 - 整体轻微膨胀
                    float kickPulse = uKick * 0.3;
                    pos *= (1.0 + kickPulse);
                    
                    // 让每个晶体随时间独立旋转
                    vRotation = rnd + uTime * (speed + 0.5);

                    if(vIsTrail > 0.5) {
                        float dropSpeed = speed * 1.5 + uLowFreq * 2.5;
                        float drop = mod(uTime * dropSpeed + rnd * 10.0, 12.0);
                        pos.y -= drop;
                        // smoothness 影响拖尾透明度 - 越高越柔和（滑块 0→3 时拖尾更淡）
                        float smoothFactor = mix(1.0, 0.2, min(uSmoothness, 1.0));
                        vOpacity = (1.0 - drop / 12.0) * (0.5 + uLowFreq) * smoothFactor;
                    } else {
                        // motion 驱动翅膀呼吸 + 微妙摆动（滑块控制呼吸幅度）
                        float motionAmp = 0.06 + uMotion * 0.3;
                        pos.y += sin(uTime + pos.x) * motionAmp;
                        pos.x *= (1.0 + uAudioFreq * 0.3);
                        // textureFeat 驱动横向微位移（滑块 0→3 时位移幅度明显）
                        pos.x += uTextureFeat * sin(uTime * 3.0 + rnd) * 1.5;
                        // snare/hihat 细微脉冲
                        pos.y += uSnare * 0.15 * sin(uTime * 5.0);
                        pos.z += uHihat * 0.08 * sin(uTime * 8.0 + rnd * 5.0);
                        // smoothness 影响透明度下限 - 越高粒子越亮越柔（滑块 0→3 时变化明显）
                        float minOpacity = clamp(0.3 + uSmoothness * 0.6, 0.3, 0.9);
                        vOpacity = minOpacity + sin(uTime * 2.0 + rnd * 10.0) * (1.0 - minOpacity) * 0.5 + uAudioFreq * 0.3;
                    }

                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    // variation 影响粒子大小抖动（滑块 0→3 时最大 ±72%）
                    float varScale = 1.0 + uVariation * sin(uTime * 4.0 + rnd * 20.0) * 1.5;
                    gl_PointSize = uSize * varScale * (25.0 / max(6.0, -mvPosition.z));
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,fragmentShader:`
                uniform vec3 uColor;
                uniform sampler2D uTexture;
                uniform float uColorIntensity;
                uniform float uHueShift;
                uniform float uBrightness;
                uniform float uBrightnessFeat;
                uniform float uMotion;
                uniform float uVariation;
                uniform float uKick;
                uniform float uSnare;
                uniform float uHihat;
                uniform float uDownbeat;
                uniform float uTime;
                varying float vOpacity;
                varying float vIsTrail;
                varying float vRotation;

                // HSL 转 RGB 函数
                vec3 hsl2rgb(vec3 hsl) {
                    vec3 rgb = clamp(abs(mod(hsl.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
                    return hsl.z + hsl.y * (rgb - 0.5) * (1.0 - abs(2.0 * hsl.z - 1.0));
                }

                // RGB 转 HSL 函数
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
                    // UV 旋转逻辑
                    vec2 uv = gl_PointCoord - 0.5;
                    float s = sin(vRotation);
                    float c = cos(vRotation);
                    vec2 rotatedUV = vec2(c * uv.x - s * uv.y, s * uv.x + c * uv.y) + 0.5;

                    vec4 tex = texture(uTexture, rotatedUV);
                    if (tex.r < 0.1) discard; // 过滤黑边

                    // 基础颜色
                    vec3 baseColor = vIsTrail > 0.5 ? uColor * 0.8 : uColor;
                    
                    // 音频驱动的颜色变化
                    vec3 hsl = rgb2hsl(baseColor);
                    hsl.x = mod(hsl.x + uHueShift, 1.0); // 色相偏移
                    hsl.y = min(hsl.y * uColorIntensity, 1.0); // 饱和度增强
                    hsl.z = mix(hsl.z, hsl.z * 1.5, clamp(uColorIntensity - 1.0, 0.0, 1.0)); // 亮度增强
                    
                    vec3 dynamicColor = hsl2rgb(hsl);
                    
                    // brightnessFeat 增强亮度（滑块 0→3 时最大 +180%）
                    dynamicColor *= (1.0 + uBrightnessFeat * 3.0);
                    
                    // 节拍闪光效果
                    float beatFlash = max(uKick, uSnare) * 0.6 + uHihat * 0.3 + uDownbeat * 0.8;
                    dynamicColor *= (1.0 + beatFlash);
                    
                    // motion + variation 驱动脉冲闪烁
                    float featPulse = (uMotion + uVariation) * 0.3;
                    float pulse = sin(uTime * 10.0 + hsl.x * 10.0) * 0.1 + 1.0 + featPulse;
                    dynamicColor *= pulse;
                    
                    // 亮度增强处理
                    gl_FragColor = vec4(dynamicColor * tex.rgb * 1.5 * uBrightness, tex.r * vOpacity);
                }
            `,transparent:!0,blending:2,depthWrite:!1}),this.particleSystem=new r(this.geometry,this.shaderMaterial),this.scene.add(this.particleSystem)}rebuildWings(){if(this.particleSystem){let e=this.geometry.attributes.position.array;for(let t=0;t<this.particleCount;t++){let n=Math.random()>.5?1:-1,r=Math.random(),i=r**2*this.settings.wingWidth*n,a=r**.5*4+(Math.random()-.5)*.5;i*=a*.5,e[t*3]=i,e[t*3+1]=a-1,e[t*3+2]=(Math.random()-.5)*this.settings.zWidth}this.geometry.attributes.position.needsUpdate=!0}}setupPostProcessing(){let e=new f(this.scene,this.camera);this.bloomPass=new h(new d(window.innerWidth,window.innerHeight),this.settings.bloomStrength,this.settings.bloomRadius,this.settings.bloomThreshold),this.composer=new p(this.renderer),this.composer.addPass(e),this.composer.addPass(this.bloomPass),this.composer.addPass(new m)}setupGUI(){this.createGUIContainer();let t={randomColor:()=>{let e=[`#4facfe`,`#00f2fe`,`#ff6b6b`,`#51cf66`,`#ffd43b`,`#cc5de8`],t=e[Math.floor(Math.random()*e.length)];this.settings.color=t,this.shaderMaterial.uniforms.uColor.value.set(t),this.gui&&this.gui.controllersRecursive().forEach(e=>{e.property===`color`&&e.updateDisplay()})},applyColorTheme:e=>{let t=this.colorThemes[e];t&&(this.settings.colorTheme=e,e===`monochrome`?this.shaderMaterial.uniforms.uColor.value.set(this.settings.color):(this.settings.color=t.baseColor,this.shaderMaterial.uniforms.uColor.value.set(t.baseColor)),this.gui&&this.gui.controllersRecursive().forEach(e=>{e.property===`color`&&e.updateDisplay()}))},resetParams:()=>{Object.assign(this.settings,this.defaultSettings),this.resetState(),this.bloomPass.strength=this.settings.bloomStrength,this.bloomPass.radius=this.settings.bloomRadius,this.bloomPass.threshold=this.settings.bloomThreshold,this.shaderMaterial.uniforms.uSize.value=this.settings.particleSize,this.shaderMaterial.uniforms.uColor.value.set(this.settings.color),this.shaderMaterial.uniforms.uBrightness.value=this.settings.particleBrightness,this.camera.position.set(this.defaultSettings.cameraPosition.x,this.defaultSettings.cameraPosition.y,this.defaultSettings.cameraPosition.z),this.controls.target.set(0,1,0),this.controls.saveState(),this.controls.reset(),this.controls.update();let e=t=>{t.controllers.forEach(e=>e.updateDisplay()),t.folders&&Object.values(t.folders).forEach(t=>e(t))};e(this.gui),this.createParticleSystem()}};this.gui=new e({title:`晶羽流光`,container:this.guiContainer});let n=this.gui.addFolder(`视觉与晶体`),r={};Object.keys(this.colorThemes).forEach(e=>{r[this.colorThemes[e].name]=e}),n.add(this.settings,`colorTheme`,r).name(`颜色主题`).onChange(e=>{t.applyColorTheme(e)}),n.addColor(this.settings,`color`).name(`基础颜色`).onChange(e=>{this.shaderMaterial.uniforms.uColor.value.set(e)}),n.add(this.settings,`particleSize`,1,8,.1).name(`晶体大小`).onChange(e=>{this.shaderMaterial.uniforms.uSize.value=e}),n.add(this.settings,`particleCount`,1e3,1e5,1e3).name(`粒子数量`).onChange(e=>{this.settings.particleCount=e,this.createParticleSystem()}),n.add(this.settings,`wingWidth`,1,15,.1).name(`翅膀宽度`).onChange(e=>{this.settings.wingWidth=e,this.rebuildWings()}),n.add(this.settings,`zWidth`,.1,2,.1).name(`Z轴宽度`).onChange(e=>{this.settings.zWidth=e,this.rebuildWings()}),n.add(this.settings,`autoRotate`).name(`自动旋转`).onChange(e=>{this.settings.autoRotate=e}),n.add(t,`randomColor`).name(`随机颜色`),n.add(this.settings,`particleBrightness`,.1,3,.05).name(`粒子亮度`).onChange(e=>{this.shaderMaterial.uniforms.uBrightness.value=e}),n.open();let i=this.gui.addFolder(`Bloom效果`);i.add(this.settings,`bloomStrength`,0,5,.1).name(`bloom强度`).onChange(e=>{this.bloomPass.strength=e}),i.add(this.settings,`bloomRadius`,0,1,.01).name(`bloom半径`).onChange(e=>{this.bloomPass.radius=e}),i.add(this.settings,`bloomThreshold`,0,1,.01).name(`bloom阈值`).onChange(e=>{this.bloomPass.threshold=e}),i.open();let a=this.gui.addFolder(`音频控制`);a.add(this.settings,`audioSensitivity`,0,3,.1).name(`驱动灵敏度`),a.add(this.settings,`motionIntensity`,0,3,.01).name(`运动强度`),a.add(this.settings,`brightnessIntensity`,0,3,.01).name(`亮度强度`),a.add(this.settings,`textureIntensity`,0,3,.01).name(`纹理强度`),a.add(this.settings,`smoothnessIntensity`,0,3,.01).name(`平滑强度`),a.add(this.settings,`variationIntensity`,0,3,.01).name(`变化强度`),a.open(),this.gui.add(t,`resetParams`).name(`重置参数`),this.gui.hide()}createGUIContainer(){this.guiContainer=v(`Animation7-gui-container`),y(`Animation7-gui-container`),document.body.appendChild(this.guiContainer)}setupSettingsButton(){this.settingsButton=g(`Animation7-settings-button`),this.settingsButton.addEventListener(`click`,()=>{this.guiVisible=!this.guiVisible,this.guiVisible?this.gui.show():this.gui.hide()}),document.body.appendChild(this.settingsButton)}updateAudioAnalysis(){if(this.hasAudioData&&this.shaderMaterial){let e=this.settings.audioSensitivity,t=this.bass*e,n=this.mid*e,r=this.high*e;this.lowFreq=t,this.audioFreq=(n+r)*.5;let i=this.colorThemes[this.settings.colorTheme]||this.colorThemes.rainbow;this.shaderMaterial.uniforms.uColorIntensity.value=1+t*i.saturationBoost;let a=performance.now()*.001;this.shaderMaterial.uniforms.uHueShift.value=(Math.sin(a*.5)*.5+(n+r)*2)*i.hueVariation;let o=.08,s=this.settings.motionIntensity;this.smoothedAudioFreq+=(this.audioFreq-this.smoothedAudioFreq)*o,this.smoothedLowFreq+=(this.lowFreq-this.smoothedLowFreq)*o,this.shaderMaterial.uniforms.uAudioFreq.value=this.smoothedAudioFreq*s,this.shaderMaterial.uniforms.uLowFreq.value=this.smoothedLowFreq*s,this.shaderMaterial.uniforms.uMotion.value=this.motionVal*this.settings.motionIntensity*e,this.shaderMaterial.uniforms.uBrightnessFeat.value=this.brightnessVal*this.settings.brightnessIntensity*e,this.shaderMaterial.uniforms.uTextureFeat.value=this.textureVal*this.settings.textureIntensity*e,this.shaderMaterial.uniforms.uSmoothness.value=this.smoothnessVal*this.settings.smoothnessIntensity*e,this.shaderMaterial.uniforms.uVariation.value=this.variationVal*this.settings.variationIntensity*e;let c=.12;this.smoothedKick+=(this.kickTrigger-this.smoothedKick)*c,this.smoothedSnare+=(this.snareTrigger-this.smoothedSnare)*c,this.smoothedHihat+=(this.hihatTrigger-this.smoothedHihat)*c,this.smoothedDownbeat+=(this.downbeatTrigger-this.smoothedDownbeat)*c,this.shaderMaterial.uniforms.uKick.value=this.smoothedKick*s,this.shaderMaterial.uniforms.uSnare.value=this.smoothedSnare*s,this.shaderMaterial.uniforms.uHihat.value=this.smoothedHihat*s,this.shaderMaterial.uniforms.uDownbeat.value=this.smoothedDownbeat*s}else this.shaderMaterial&&(this.shaderMaterial.uniforms.uColor.value.set(this.settings.color),this.shaderMaterial.uniforms.uColorIntensity.value=1,this.shaderMaterial.uniforms.uHueShift.value=0,this.shaderMaterial.uniforms.uAudioFreq.value=0,this.shaderMaterial.uniforms.uLowFreq.value=0,this.shaderMaterial.uniforms.uBrightness.value=this.settings.particleBrightness,this.shaderMaterial.uniforms.uMotion.value=0,this.shaderMaterial.uniforms.uBrightnessFeat.value=0,this.shaderMaterial.uniforms.uTextureFeat.value=0,this.shaderMaterial.uniforms.uSmoothness.value=0,this.shaderMaterial.uniforms.uVariation.value=0,this.shaderMaterial.uniforms.uKick.value=0,this.shaderMaterial.uniforms.uSnare.value=0,this.shaderMaterial.uniforms.uHihat.value=0,this.shaderMaterial.uniforms.uDownbeat.value=0)}render(){if(!(!this.scene||!this.camera||!this.renderer||!this.controls))try{this.shaderMaterial&&(this.shaderMaterial.uniforms.uTime.value=performance.now()*.001),this.updateAudioAnalysis(),this.settings.autoRotate?(this.controls.autoRotate=!0,this.controls.autoRotateSpeed=.5):this.controls.autoRotate=!1,this.controls.update(),this.composer?this.composer.render():this.renderer&&this.scene&&this.camera&&this.renderer.render(this.scene,this.camera)}catch(e){console.error(`渲染错误:`,e)}}onWindowResize(){let e=window.innerWidth,t=window.innerHeight;this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t),this.composer.setSize(e,t)}updateWithAudioData(e,t){if(!e||!e.energy){this.hasAudioData=!1;return}let n=e.audioFeature?.animation,r=n?.bass??e.energy.low??0,i=n?.mid??e.energy.mid??0,a=n?.high??e.energy.high??0,o=(r+i)*.75,s=a,c=i,l=1-r,u=(r+i+a)/3;n?(this.motionVal=(n.motion??0)+o*.3,this.brightnessVal=(n.brightness??0)+s*.3,this.textureVal=(n.texture??0)+c*.3,this.smoothnessVal=(n.smoothness??0)+l*.2,this.variationVal=(n.variation??0)+u*.3):(this.motionVal=o,this.brightnessVal=s,this.textureVal=c,this.smoothnessVal=l,this.variationVal=u),e.beat&&(this.kickTrigger=e.beat.kick||0,this.snareTrigger=e.beat.snare||0,this.hihatTrigger=e.beat.hihat||0,this.downbeatTrigger=e.beat.downbeat||0),this.bass=r,this.mid=i,this.high=a,this.hasAudioData=!0}resetState(){this.bass=0,this.mid=0,this.high=0,this.lowFreq=0,this.audioFreq=0,this.smoothedAudioFreq=0,this.smoothedLowFreq=0,this.hasAudioData=!1,this.motionVal=0,this.brightnessVal=0,this.textureVal=0,this.smoothnessVal=0,this.variationVal=0,this.kickTrigger=0,this.snareTrigger=0,this.hihatTrigger=0,this.downbeatTrigger=0,this.smoothedKick=0,this.smoothedSnare=0,this.smoothedHihat=0,this.smoothedDownbeat=0,this.shaderMaterial&&(this.shaderMaterial.uniforms.uColorIntensity.value=1,this.shaderMaterial.uniforms.uHueShift.value=0,this.shaderMaterial.uniforms.uAudioFreq.value=0,this.shaderMaterial.uniforms.uLowFreq.value=0,this.shaderMaterial.uniforms.uMotion.value=0,this.shaderMaterial.uniforms.uBrightnessFeat.value=0,this.shaderMaterial.uniforms.uTextureFeat.value=0,this.shaderMaterial.uniforms.uSmoothness.value=0,this.shaderMaterial.uniforms.uVariation.value=0,this.shaderMaterial.uniforms.uKick.value=0,this.shaderMaterial.uniforms.uSnare.value=0,this.shaderMaterial.uniforms.uHihat.value=0,this.shaderMaterial.uniforms.uDownbeat.value=0)}setEffectMode(e){return console.log(`当前效果模式：${e}`),!0}updateSettings(e){if(Object.assign(this.settings,e),e.cameraPosition&&this.camera.position.set(e.cameraPosition.x||this.settings.cameraPosition.x,e.cameraPosition.y||this.settings.cameraPosition.y,e.cameraPosition.z||this.settings.cameraPosition.z),e.color!==void 0&&this.shaderMaterial.uniforms.uColor.value.set(e.color),e.bloomStrength!==void 0&&(this.bloomPass.strength=e.bloomStrength),e.bloomRadius!==void 0&&(this.bloomPass.radius=e.bloomRadius),e.bloomThreshold!==void 0&&(this.bloomPass.threshold=e.bloomThreshold),e.audioSensitivity!==void 0&&(this.settings.audioSensitivity=e.audioSensitivity),e.particleSize!==void 0&&(this.shaderMaterial.uniforms.uSize.value=e.particleSize),e.particleCount!==void 0&&(this.settings.particleCount=e.particleCount,this.createParticleSystem()),e.wingWidth!==void 0&&(this.settings.wingWidth=e.wingWidth,this.rebuildWings()),e.zWidth!==void 0&&(this.settings.zWidth=e.zWidth,this.rebuildWings()),e.particleBrightness!==void 0&&(this.shaderMaterial.uniforms.uBrightness.value=e.particleBrightness),e.colorTheme!==void 0){let t=this.colorThemes[e.colorTheme];t&&(e.colorTheme===`monochrome`?this.shaderMaterial.uniforms.uColor.value.set(this.settings.color):(this.settings.color=t.baseColor,this.shaderMaterial.uniforms.uColor.value.set(t.baseColor)))}}dispose(){_(this.settingsButton,this.guiContainer,this.gui),this.particleSystem&&this.scene.remove(this.particleSystem),this.geometry&&this.geometry.dispose(),this.shaderMaterial&&this.shaderMaterial.dispose(),this.crystalTexture&&this.crystalTexture.dispose(),this.controls&&this.controls.dispose(),this.composer&&this.composer.dispose(),this.bloomPass&&this.bloomPass.dispose(),this.renderer&&this.renderer.dispose(),console.log(`✅ Animation7 资源已清理`)}getAudioDataForUI(){return{bass:this.bass,mid:this.mid,high:this.high}}playAudio(){console.log(`音频播放由系统控制`)}pauseAudio(){console.log(`音频暂停由系统控制`)}};export{x as default};