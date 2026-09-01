import{a as e}from"./lil-gui.esm-jlbWO7FJ.js";import{Bt as t,Jn as n,Wt as r,_t as i,g as a,kr as o,l as s,q as c,qn as l,r as u,u as d,wr as f}from"./three.module-CgISyWQV.js";import{n as p,r as m,t as h}from"./OutputPass-D9GSoAm2.js";import{t as g}from"./UnrealBloomPass-1z79deN3.js";import{i as _,n as v,r as y,t as b}from"./GUIHelper-DspWBXk2.js";import{t as x}from"./OrbitControls-DVnblHSy.js";var S=class{constructor(e,t={}){this.canvas=e,this.scenePresets={default:{name:`默认星云`,galaxyCount:8e4,branches:6,galaxyRadius:750},spiral:{name:`螺旋星系`,galaxyCount:8e4,branches:8,galaxyRadius:750},dense:{name:`密集星云`,galaxyCount:15e4,branches:5,galaxyRadius:600},colorful:{name:`多彩星云`,galaxyCount:8e4,branches:6,galaxyRadius:750},minimal:{name:`极简风格`,galaxyCount:3e4,branches:6,galaxyRadius:750}};let n={preset:`default`,colorCore:`#ffdd55`,colorMid:`#00f2ff`,colorOuter:`#cc66ff`,bloomStrength:.1,bloomRadius:.1,bloomThreshold:.9,particleSize:1,rotationSpeed:.1,autoRotate:!0,galaxyCount:8e4,galaxyRadius:750,branches:6,cameraPosition:{x:-1478.37,y:50.8,z:900.55},audioEnabled:!0,autoColorMode:!0,colorChangeSpeed:.2,energySensitivity:1,bassResponse:.8,midResponse:1,highResponse:1,motionResponse:1,beatPulseStrength:.5,shockwaveStrength:1,sizzleStrength:.4,kickStrength:1,colorStormStrength:.5,particleBrightness:1};this.settings={...n,...t},this.DEFAULTS=n,this.scene=null,this.camera=null,this.renderer=null,this.controls=null,this.composer=null,this.bloomPass=null,this.galaxyPoints=null,this._colorCache={core:new a,mid:new a,outer:new a,tmp:new a},this._hsl={h:0,s:0,l:0},this.resetState(),this.gui=null,this.guiContainer=null,this.guiVisible=!1,this.settingsButton=null;try{this.init(),console.log(`✅ Animation11 初始化成功`)}catch(e){console.error(`❌ Animation11 初始化失败:`,e)}}init(){this.setupThreeJS(),this.createGalaxy(),this.setupPostProcessing(),this.setupGUI(),this.setupSettingsButton()}setupThreeJS(){this.scene=new l,this.camera=new t(55,window.innerWidth/window.innerHeight,1,12e3),this.camera.position.set(this.settings.cameraPosition.x,this.settings.cameraPosition.y,this.settings.cameraPosition.z),this.camera.lookAt(0,0,0),this.renderer=new u({canvas:this.canvas,antialias:!0,alpha:!0}),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.toneMapping=2,this.renderer.outputColorSpace=i,this.canvas.style.backgroundColor=`transparent`,this.canvas.style.zIndex=`1`,this.controls=new x(this.camera,this.canvas),this.controls.enableDamping=!0,this.controls.autoRotate=this.settings.autoRotate,this.controls.dampingFactor=.05,this.controls.target.set(0,0,0),this.controls.saveState()}getGalaxyVertexShader(){return`
            uniform float uTime;
            uniform float uSize;
            uniform float uAudioEnergy;
            uniform float uBass;
            uniform float uMid;
            uniform float uHigh;
            uniform float uGalaxyRadius;
            uniform float uShockwaveStrength;
            uniform float uShockwaveRadius;
            uniform float uKickPulseStrength;
            uniform float uSizzleStrength;
            uniform float uColorStormStrength;
            uniform vec3 uColorCore;
            uniform vec3 uColorMid;
            uniform vec3 uColorOuter;
            attribute float aScale;
            attribute float aFlickerSpeed;
            varying vec3 vColor;
            varying float vOpacity;

            void main() {
                vec4 modelPosition = modelMatrix * vec4(position, 1.0);
                float distanceToCenter = length(modelPosition.xz);

                // ===== 从 uniform 计算渐变色（GPU 端，替代每帧更新顶点颜色） =====
                vec3 baseColor;
                float radius = uGalaxyRadius;
                if (distanceToCenter < radius * 0.1) {
                    baseColor = mix(uColorCore, vec3(1.0), 0.9);
                } else if (distanceToCenter < radius * 0.45) {
                    float t = (distanceToCenter - radius * 0.1) / max(radius * 0.35, 0.001);
                    baseColor = mix(uColorCore, uColorMid, t);
                } else {
                    float t = clamp((distanceToCenter - radius * 0.45) / max(radius * 0.55, 0.001), 0.0, 1.0);
                    baseColor = mix(uColorMid, uColorOuter, t);
                }

                // ===== 音频驱动的动态颜色调制 =====
                float colorMix = uAudioEnergy * 0.8;
                vec3 dynamicColor = uColorCore;
                float verySlowTime = uTime * 0.2;
                dynamicColor.r += sin(verySlowTime * 0.5 + position.x * 0.002) * uAudioEnergy * 0.3;
                dynamicColor.g += sin(verySlowTime * 0.6 + position.y * 0.002) * uAudioEnergy * 0.3;
                dynamicColor.b += sin(verySlowTime * 0.4 + position.z * 0.002) * uAudioEnergy * 0.3;
                dynamicColor = clamp(dynamicColor, 0.0, 1.0);
                vColor = mix(baseColor, dynamicColor, colorMix);

                // ===== 低频泵动：bass 驱动粒子整体膨胀/收缩（~0.3s） =====
                float bassPump = 1.0 + uBass * 0.8;
                modelPosition.xyz *= bassPump;

                // ===== 冲击波：beat 触发的单次高斯脉冲环 =====
                // 平时不做波浪运动，只在 beat 时从中心爆发一层冲击波
                // 冲击波环从中心(r=0)扩散到边缘(r=1)，粒子弹起 + 变亮 + 变大
                float nd = distanceToCenter / uGalaxyRadius;
                float env = exp(-nd * nd * 3.0);
                float distFromRing = abs(nd - uShockwaveRadius);
                float ringWidth = 0.06 + uAudioEnergy * 0.08;  // 宽度随能量变化
                float pulse = exp(-distFromRing * distFromRing / (ringWidth * ringWidth));
                float shockIntensity = pulse * uShockwaveStrength;

                // Y 弹起：冲击波经过时粒子向上跳起
                modelPosition.y += shockIntensity * 300.0 * env;

                // ===== kick脉冲：星系整体收缩（~0.5s） =====
                float kickScale = 1.0 - uKickPulseStrength * 0.12;
                modelPosition.xz *= kickScale;
                modelPosition.y *= (1.0 - uKickPulseStrength * 0.6);

                // ===== 径向微呼吸 =====
                float radialScale = 1.0 + uMid * 0.3;
                modelPosition.xz *= radialScale;

                // ===== snare闪爆：随机约30%粒子跳起+偏移（~0.3s） =====
                float sizzleSeed = fract(aScale * 73.0 + aFlickerSpeed * 51.0);
                float sizzleMask = step(0.7, sizzleSeed);
                float sizzle = sizzleMask * uSizzleStrength;
                modelPosition.y += sizzle * 80.0;
                modelPosition.x += sin(aScale * 200.0) * sizzle * 15.0;
                modelPosition.z += cos(aFlickerSpeed * 200.0) * sizzle * 15.0;

                vec4 viewPosition = viewMatrix * modelPosition;
                gl_Position = projectionMatrix * viewPosition;

                // 闪烁
                float flickerSpeed = aFlickerSpeed * (1.0 + uHigh * 1.5);
                float flicker = abs(sin(uTime * flickerSpeed + aScale * 20.0));
                gl_PointSize = uSize * aScale * (0.7 + flicker * 0.6)
                             * (1.0 + uAudioEnergy * 0.6)
                             * (1.0 + uBass * 0.3)
                             * (1.0 + shockIntensity * 0.5);
                gl_PointSize *= (1000.0 / -viewPosition.z);

                // 冲击波经过时粒子变白变亮
                vColor = mix(vColor, vec3(2.0), shockIntensity * 0.9);

                // ===== 色彩风暴：percussive触发的暖色调偏移（~0.4s） =====
                float storm = uColorStormStrength;
                vColor.r += storm * 2.0;
                vColor.g -= storm * 1.0;
                vColor.b -= storm * 0.8;

                // ===== snare闪爆：亮度 + 大小 =====
                vColor = mix(vColor, vec3(2.5), sizzle);
                gl_PointSize *= (1.0 + sizzle * 0.4);

                vOpacity = 0.3 + flicker * 0.5 + uAudioEnergy * 0.8
                         + shockIntensity * 0.5
                         + storm * 0.3
                         + sizzle * 0.5;
            }
        `}getGalaxyFragmentShader(){return`
            uniform float uBrightness;
            varying vec3 vColor;
            varying float vOpacity;
            void main() {
                float dist = distance(gl_PointCoord, vec2(0.5));
            if (dist > 0.5) discard;
            
            // 锐利星点：全实心圆 + 仅边缘1px抗锯齿过渡
            float alpha = 1.0 - smoothstep(0.45, 0.5, dist);
            gl_FragColor = vec4(vColor * uBrightness * 2.5, alpha * vOpacity);
            }
        `}createGalaxy(){this.galaxyPoints&&(this.scene.remove(this.galaxyPoints),this.galaxyPoints.geometry&&this.galaxyPoints.geometry.dispose(),this.galaxyPoints.material&&this.galaxyPoints.material.dispose());let e=new d,t=new Float32Array(this.settings.galaxyCount*3),i=new Float32Array(this.settings.galaxyCount),a=new Float32Array(this.settings.galaxyCount);for(let e=0;e<this.settings.galaxyCount;e++){let n=e*3,r=Math.random()*this.settings.galaxyRadius,o=e%this.settings.branches/this.settings.branches*Math.PI*2,s=r*.01,c=Math.random()**3*(Math.random()<.5?1:-1)*.45*r,l=Math.random()**4*(Math.random()<.5?1:-1)*.2*r,u=Math.random()**3*(Math.random()<.5?1:-1)*.45*r;t[n]=Math.cos(o+s)*r+c,t[n+1]=l,t[n+2]=Math.sin(o+s)*r+u,i[e]=Math.random()*.8+.1,a[e]=Math.random()*3+1}e.setAttribute(`position`,new s(t,3)),e.setAttribute(`aScale`,new s(i,1)),e.setAttribute(`aFlickerSpeed`,new s(a,1));let o=this._colorCache,c=new n({depthWrite:!1,transparent:!0,blending:2,uniforms:{uTime:{value:0},uSize:{value:this.settings.particleSize},uAudioEnergy:{value:0},uBass:{value:0},uMid:{value:0},uHigh:{value:0},uGalaxyRadius:{value:this.settings.galaxyRadius},uShockwaveStrength:{value:0},uShockwaveRadius:{value:0},uKickPulseStrength:{value:0},uSizzleStrength:{value:0},uColorStormStrength:{value:0},uColorCore:{value:o.core.set(this.settings.colorCore).clone()},uColorMid:{value:o.mid.set(this.settings.colorMid).clone()},uColorOuter:{value:o.outer.set(this.settings.colorOuter).clone()},uBrightness:{value:this.settings.particleBrightness}},vertexShader:this.getGalaxyVertexShader(),fragmentShader:this.getGalaxyFragmentShader()});this.galaxyPoints=new r(e,c),this.scene.add(this.galaxyPoints)}updateColors(){if(!this.galaxyPoints)return;let e=this.galaxyPoints.material.uniforms,t=this._colorCache;e.uColorCore.value.copy(t.core.set(this.settings.colorCore)),e.uColorMid.value.copy(t.mid.set(this.settings.colorMid)),e.uColorOuter.value.copy(t.outer.set(this.settings.colorOuter))}_refreshControllers(){if(!this.gui)return;let e=t=>{t.controllers.forEach(e=>e.updateDisplay()),t.folders&&Object.values(t.folders).forEach(t=>e(t))};e(this.gui)}loadScenePreset(e){let t=this.scenePresets[e];if(t){switch(this.settings.preset=e,this.settings.galaxyCount=t.galaxyCount,this.settings.branches=t.branches,this.settings.galaxyRadius=t.galaxyRadius,e){case`spiral`:this.settings.colorCore=`#ffaa00`,this.settings.colorMid=`#00aaff`,this.settings.colorOuter=`#aa00ff`;break;case`colorful`:this.settings.colorCore=`#ff0066`,this.settings.colorMid=`#00ffaa`,this.settings.colorOuter=`#ffaa00`;break;case`minimal`:this.settings.colorCore=`#ffffff`,this.settings.colorMid=`#aaaaaa`,this.settings.colorOuter=`#666666`,this.settings.bloomStrength=1;break;case`dense`:this.settings.colorCore=`#ffdd55`,this.settings.colorMid=`#00f2ff`,this.settings.colorOuter=`#cc66ff`;break;default:this.settings.colorCore=`#ffdd55`,this.settings.colorMid=`#00f2ff`,this.settings.colorOuter=`#cc66ff`,this.settings.bloomStrength=2.5}this.bloomPass&&(this.bloomPass.strength=this.settings.bloomStrength,this.bloomPass.radius=this.settings.bloomRadius,this.bloomPass.threshold=this.settings.bloomThreshold),this.createGalaxy(),this.gui&&this._refreshControllers()}}setupPostProcessing(){let e=new p(this.scene,this.camera);this.bloomPass=new g(new f(window.innerWidth,window.innerHeight),this.settings.bloomStrength,this.settings.bloomRadius,this.settings.bloomThreshold);let t=this.renderer.getSize(new f),n=this.renderer.getPixelRatio();this._msaaTarget=new o(Math.floor(t.width*n),Math.floor(t.height*n),{type:c,samples:4}),this.composer=new m(this.renderer,this._msaaTarget),this.composer.addPass(e),this.composer.addPass(this.bloomPass),this.composer.addPass(new h)}setupGUI(){this.createGUIContainer();let t={resetParams:()=>{Object.assign(this.settings,this.DEFAULTS),this.resetState(),this.bloomPass&&(this.bloomPass.strength=this.settings.bloomStrength,this.bloomPass.radius=this.settings.bloomRadius,this.bloomPass.threshold=this.settings.bloomThreshold),this._refreshControllers(),this.createGalaxy(),this.camera.position.set(this.DEFAULTS.cameraPosition.x,this.DEFAULTS.cameraPosition.y,this.DEFAULTS.cameraPosition.z),this.controls.target.set(0,0,0),this.controls.saveState(),this.controls.reset(),this.controls.update()}};this.gui=new e({title:`宇宙星河`,container:this.guiContainer});let n=this.gui.addFolder(`预设场景`),r={};Object.keys(this.scenePresets).forEach(e=>{r[this.scenePresets[e].name]=e}),n.add(this.settings,`preset`,r).name(`场景预设`).onChange(e=>{this.loadScenePreset(e)}),n.open();let i=this.gui.addFolder(`视觉效果`);i.addColor(this.settings,`colorCore`).name(`核心颜色`).onChange(()=>{this.updateColors()}),i.addColor(this.settings,`colorMid`).name(`中间颜色`).onChange(()=>{this.updateColors()}),i.addColor(this.settings,`colorOuter`).name(`外部颜色`).onChange(()=>{this.updateColors()}),i.add(this.settings,`particleSize`,1,15,.5).name(`粒子大小`).onChange(e=>{this.galaxyPoints&&(this.galaxyPoints.material.uniforms.uSize.value=e)}),i.add(this.settings,`bloomStrength`,0,5,.1).name(`bloom强度`).onChange(e=>{this.bloomPass&&(this.bloomPass.strength=e)}),i.add(this.settings,`bloomRadius`,0,2,.1).name(`bloom半径`).onChange(e=>{this.bloomPass&&(this.bloomPass.radius=e)}),i.add(this.settings,`bloomThreshold`,0,1,.05).name(`bloom阈值`).onChange(e=>{this.bloomPass&&(this.bloomPass.threshold=e)}),i.add(this.settings,`particleBrightness`,.1,3,.05).name(`粒子亮度`).onChange(e=>{this.galaxyPoints&&(this.galaxyPoints.material.uniforms.uBrightness.value=e)}),i.open();let a=this.gui.addFolder(`音频响应控制`);a.add(this.settings,`audioEnabled`).name(`启用音频响应`),a.add(this.settings,`energySensitivity`,0,2,.05).name(`整体响应强度`),a.add(this.settings,`bassResponse`,0,2,.05).name(`低频响应`),a.add(this.settings,`midResponse`,0,2,.05).name(`中频响应`),a.add(this.settings,`highResponse`,0,2,.05).name(`高频响应`),a.add(this.settings,`motionResponse`,0,2,.05).name(`运动响应`),a.add(this.settings,`beatPulseStrength`,0,2,.05).name(`节拍脉冲`),a.add(this.settings,`shockwaveStrength`,0,2,.1).name(`冲击波强度`),a.add(this.settings,`kickStrength`,0,2,.1).name(`心跳强度`),a.add(this.settings,`sizzleStrength`,0,2,.1).name(`闪爆强度`),a.add(this.settings,`colorStormStrength`,0,2,.1).name(`色暴强度`),a.add(this.settings,`autoColorMode`).name(`自动颜色模式`),a.add(this.settings,`colorChangeSpeed`,.1,1,.05).name(`颜色变化速度`),a.open();let o=this.gui.addFolder(`动画控制`);o.add(this.settings,`rotationSpeed`,0,.2,.01).name(`旋转速度`).onChange(e=>{this.controls&&(this.controls.autoRotateSpeed=e*10)}),o.add(this.settings,`autoRotate`).name(`自动旋转`).onChange(e=>{this.controls&&(this.controls.autoRotate=e)}),o.open(),this.gui.add(t,`resetParams`).name(`重置参数`),this.gui.hide()}createGUIContainer(){this.guiContainer=y(`Animation11-gui-container`),b(`Animation11-gui-container`),document.body.appendChild(this.guiContainer)}setupSettingsButton(){this.settingsButton=_(`Animation11-settings-button`),this._onSettingsClick=()=>{this.guiVisible=!this.guiVisible,this.guiVisible?this.gui.show():this.gui.hide()},this.settingsButton.addEventListener(`click`,this._onSettingsClick),document.body.appendChild(this.settingsButton)}_updateShaderUniforms(){let e=this.audioFeature;if(!e||!this.settings.audioEnabled||!this.galaxyPoints)return;let t=Math.min(e.bass*this.settings.bassResponse,1),n=Math.min(e.mid*this.settings.midResponse,1),r=Math.min(e.high*this.settings.highResponse,1),i=Math.min(e.energy*this.settings.energySensitivity,1),a=e.beat*this.settings.beatPulseStrength,o=Math.min(i+a,1.2);e.beat>.3&&this._shockwaveStrength<.1&&(this._shockwaveStrength=(.5+t*.8)*this.settings.shockwaveStrength,this._shockwaveRadius=.02),this._percussive=e.percussive||0,(e.kick||0)>.3&&this._kickPulseStrength<.05&&(this._kickPulseStrength=(.5+t*.5)*this.settings.kickStrength);let s=Math.max(e.snare||0,e.hihat||0);s>.3&&this._sizzleStrength<.05&&(this._sizzleStrength=(.4+s*.6)*this.settings.sizzleStrength),(e.percussive||0)>.3&&this._colorStormStrength<.05&&(this._colorStormStrength=(.3+e.percussive*.7)*this.settings.colorStormStrength);let c=this.galaxyPoints.material;if(c.uniforms.uAudioEnergy.value=o,c.uniforms.uBass.value=t,c.uniforms.uMid.value=n,c.uniforms.uHigh.value=r,this.settings.autoColorMode&&e.energy>.01){let t=e.bass,n=e.mid,r=e.high,i=t+n+r+.001,a=(t*0+n*.33+r*.66)/i,o=Math.min(this.settings.colorChangeSpeed*.05,.5),s=this._colorCache,c=this._hsl;s.tmp.set(this.settings.colorCore).getHSL(c);let l=a-c.h;l>.5&&--l,l<-.5&&(l+=1),Math.abs(l)<.002&&(l=0);let u=e=>(s.tmp.set(e).getHSL(c),s.tmp.setHSL((c.h+l*o+1)%1,c.s,c.l),s.tmp.getStyle());if(this.settings.colorCore=u(this.settings.colorCore),this.settings.colorMid=u(this.settings.colorMid),this.settings.colorOuter=u(this.settings.colorOuter),this.galaxyPoints){let e=this.galaxyPoints.material.uniforms;e.uColorCore.value.copy(s.core.set(this.settings.colorCore)),e.uColorMid.value.copy(s.mid.set(this.settings.colorMid)),e.uColorOuter.value.copy(s.outer.set(this.settings.colorOuter))}}}render(){if(this.galaxyPoints&&(this.galaxyPoints.material.uniforms.uTime.value=this.elapsed),this.galaxyPoints){let e=.985-(this._percussive||0)*.02;this._shockwaveStrength*=e,this._shockwaveRadius+=.015,this._kickPulseStrength*=.96,this._sizzleStrength*=.93,this._colorStormStrength*=.95;let t=this.galaxyPoints.material.uniforms;t.uShockwaveStrength.value=this._shockwaveStrength,t.uShockwaveRadius.value=this._shockwaveRadius,t.uKickPulseStrength.value=this._kickPulseStrength,t.uSizzleStrength.value=this._sizzleStrength,t.uColorStormStrength.value=this._colorStormStrength}if(this.hasAudioData&&this.audioFeature)this._updateShaderUniforms();else if(this.galaxyPoints){let e=this.galaxyPoints.material.uniforms;e.uAudioEnergy.value=0,e.uBass.value=0,e.uMid.value=0,e.uHigh.value=0}let e=this.hasAudioData&&this.audioFeature?1+this.audioFeature.motion*this.settings.motionResponse*2:1;this.controls.autoRotate=this.settings.autoRotate,this.controls.autoRotateSpeed=this.settings.rotationSpeed*10*e,this.controls.update(),this.composer&&this.composer.render()}onWindowResize(){let e=window.innerWidth,t=window.innerHeight;!this.camera||!this.renderer||!this.composer||(this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t),this.composer.setSize(e,t))}resetState(){this.audioFeature=null,this.hasAudioData=!1,this.elapsed=0,this._shockwaveStrength=0,this._shockwaveRadius=0,this._kickPulseStrength=0,this._sizzleStrength=0,this._colorStormStrength=0,this._percussive=0}updateWithAudioData(e,t){if(t!==void 0&&(this.elapsed=t),!e||!e.audioFeature||!e.isPlaying){this.hasAudioData=!1;return}this.hasAudioData=!0,this.audioFeature=e.audioFeature.animation}setEffectMode(e){return this.scenePresets[e]?(this.loadScenePreset(e),!0):!1}updateSettings(e){Object.assign(this.settings,e),e.cameraPosition&&this.camera.position.set(e.cameraPosition.x??this.settings.cameraPosition.x,e.cameraPosition.y??this.settings.cameraPosition.y,e.cameraPosition.z??this.settings.cameraPosition.z),(e.colorCore!==void 0||e.colorMid!==void 0||e.colorOuter!==void 0)&&this.updateColors(),e.bloomStrength!==void 0&&(this.bloomPass.strength=e.bloomStrength),e.bloomRadius!==void 0&&(this.bloomPass.radius=e.bloomRadius),e.bloomThreshold!==void 0&&(this.bloomPass.threshold=e.bloomThreshold),e.particleSize!==void 0&&this.galaxyPoints&&(this.galaxyPoints.material.uniforms.uSize.value=e.particleSize),e.particleBrightness!==void 0&&this.galaxyPoints&&(this.galaxyPoints.material.uniforms.uBrightness.value=e.particleBrightness),e.galaxyRadius!==void 0&&this.galaxyPoints&&(this.galaxyPoints.material.uniforms.uGalaxyRadius.value=e.galaxyRadius),e.galaxyCount!==void 0&&this.createGalaxy(),this.gui&&this._refreshControllers()}dispose(){this.settingsButton&&this._onSettingsClick&&this.settingsButton.removeEventListener(`click`,this._onSettingsClick),v(this.settingsButton,this.guiContainer,this.gui),this.controls&&this.controls.dispose(),this.galaxyPoints&&(this.scene.remove(this.galaxyPoints),this.galaxyPoints.geometry&&this.galaxyPoints.geometry.dispose(),this.galaxyPoints.material&&this.galaxyPoints.material.dispose()),this.bloomPass&&this.bloomPass.dispose(),this.composer&&this.composer.dispose(),this._msaaTarget&&=(this._msaaTarget.dispose(),null),this.scene=null,this.renderer&&this.renderer.dispose(),console.log(`✅ Animation11 资源已清理`)}getAudioDataForUI(){let e=this.audioFeature;return{bass:e?e.bass:0,mid:e?e.mid:0,high:e?e.high:0,energy:e?e.energy:0}}getPerformanceData(){return{fps:0,particleCount:this.settings.galaxyCount}}};export{S as default};