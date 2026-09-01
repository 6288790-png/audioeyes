import{a as e}from"./lil-gui.esm-jlbWO7FJ.js";import{Bt as t,Gn as n,Jn as r,Wt as i,g as a,l as o,qn as s,r as c,u as l,wr as u,xt as d}from"./three.module-CgISyWQV.js";import{n as f,r as p,t as m}from"./OutputPass-D9GSoAm2.js";import{t as h}from"./UnrealBloomPass-1z79deN3.js";import{i as g,n as _,r as v,t as y}from"./GUIHelper-DspWBXk2.js";import{t as b}from"./OrbitControls-DVnblHSy.js";import{t as x}from"./GPUComputationRenderer-a9_9_jwr.js";var S=class{constructor(e,t={}){this.canvas=e;let n={color:`#4488ff`,bloomStrength:.3,bloomRadius:.15,bloomThreshold:.8,toneMappingExposure:.9,autoRotateSpeed:.2,audioSensitivity:1,bassReactivity:1,midReactivity:1,highReactivity:1,kickPulse:.65,energyBrightness:.35,colorReactivity:1.25,saturationBoost:1.6,colorLerpSpeed:.3,pointSize:.5,brightness:1,particleCount:6e4,cameraPosition:{x:0,y:10,z:50},vortexStrength:.8,flowSpeed:.1,riverWidth:30,riverHeight:20,riverLength:80,autoRotate:!1};this.settings={...n,...t},this.defaultSettings=n,this.scene=null,this.camera=null,this.renderer=null,this.controls=null,this.composer=null,this.bloomPass=null,this.gpuCompute=null,this.posVar=null,this.velVar=null,this.velUniforms=null,this.posUniforms=null,this.WIDTH=Math.floor(Math.sqrt(this.settings.particleCount)),this.particles=null,this.geometry=null,this.shaderMaterial=null,this.useGPUGPU=!0,this.baseHue=this.hexToBaseHue(this.settings.color),this.a=null,this.hasAudioData=!1,this.gui=null,this.guiContainer=null,this.guiVisible=!1,this.time=0,this.lastFrameTime=0,this.kickEnvelope=0,this._riverResizeTimer=null,this.settingsButton=null,this.init().catch(e=>{throw console.error(`❌ Animation9 初始化失败:`,e),Error(`GPGPU初始化失败，无法启动可视化效果`)})}async init(){try{return await this.setupThreeJS(),await this.initGPGPU(),this.createParticleSystem(),this.setupPostProcessing(),this.setupGUI(),this.setupSettingsButton(),console.log(`✅ Animation9 初始化成功`),!0}catch(e){throw console.error(`❌ Animation9 初始化失败:`,e),e}}async setupThreeJS(){this.scene=new s,this.camera=new t(60,window.innerWidth/window.innerHeight,.1,1e3),this.camera.position.set(this.settings.cameraPosition.x,this.settings.cameraPosition.y,this.settings.cameraPosition.z),this.camera.lookAt(0,0,0),this.renderer=new c({canvas:this.canvas,antialias:!0,alpha:!0}),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.setClearColor(0,0),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.toneMapping=4,this.renderer.toneMappingExposure=this.settings.toneMappingExposure,this.renderer.outputColorSpace=n,this.canvas.style.backgroundColor=`transparent`,this.canvas.style.zIndex=`1`,this.controls=new b(this.camera,this.canvas),this.controls.enableDamping=!0,this.controls.dampingFactor=.05,this.controls.target.set(0,0,0),this.controls.saveState()}async initGPGPU(){try{this.gpuCompute=new x(this.WIDTH,this.WIDTH,this.renderer);let e=this.gpuCompute.createTexture(),t=this.gpuCompute.createTexture(),n=e.image.data,r=t.image.data;for(let e=0;e<n.length;e+=4)n[e+0]=(Math.random()-.5)*this.settings.riverWidth,n[e+1]=(Math.random()-.5)*this.settings.riverHeight,n[e+2]=(Math.random()-.5)*this.settings.riverLength,n[e+3]=1,r[e+0]=(Math.random()-.5)*.2,r[e+1]=(Math.random()-.5)*.2,r[e+2]=(Math.random()-.5)*.2,r[e+3]=1;this.posVar=this.gpuCompute.addVariable(`texturePosition`,`
            uniform float uTime;
            uniform float uRiverLength;
            uniform float uRiverWidth;
            uniform float uRiverHeight;
            
            // 简单的伪随机数生成器
            float rand(vec2 co) {
                return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
            }
            
            void main() {
                vec2 uv = gl_FragCoord.xy / resolution.xy;
                vec3 pos = texture2D(texturePosition, uv).xyz;
                vec3 vel = texture2D(textureVelocity, uv).xyz;
                
                // 更新位置
                pos += vel * 0.1;
                
                // Z轴循环
                float halfLength = uRiverLength * 0.5;
                if (pos.z > halfLength) {
                    pos.z = -halfLength;
                    // 使用伪随机数生成器替代Math.random()，重置位置随河流尺寸
                    float randX = rand(uv + vec2(uTime, 0.0));
                    float randY = rand(uv + vec2(0.0, uTime));
                    pos.x = (randX - 0.5) * uRiverWidth;
                    pos.y = (randY - 0.5) * uRiverHeight;
                }
                
                gl_FragColor = vec4(pos, 1.0);
            }`,e),this.velVar=this.gpuCompute.addVariable(`textureVelocity`,`
            uniform float uTime;
            uniform float uVortexStrength;
            uniform float uFlowSpeed;
            uniform float uRiverWidth;
            uniform float uRiverHeight;
            uniform float uBass;
            uniform float uMid;
            uniform float uHigh;
            
            void main() {
                vec2 uv = gl_FragCoord.xy / resolution.xy;
                vec3 pos = texture2D(texturePosition, uv).xyz;
                vec3 vel = texture2D(textureVelocity, uv).xyz;
                
                // 漩涡影响半径随河流尺寸变化（约为河流对角线的一半）
                float vortexRadius = sqrt(uRiverWidth * uRiverWidth + uRiverHeight * uRiverHeight) * 0.5;
                
                // 漩涡效果 + 音频驱动（bass 增强漩涡扭转力度）
                vec2 centerOffset = pos.xy;
                float distToCenter = length(centerOffset);
                float bassBoost = 1.0 + uBass * 1.5;
                float vortexStrength = smoothstep(0.0, vortexRadius, vortexRadius - distToCenter) * uVortexStrength * bassBoost;
                
                // 河流主流动 + 漩涡效果 + 音频驱动
                vec3 force = vec3(
                    -centerOffset.y * vortexStrength + sin(pos.z * 0.1 + uTime) * 0.5 * (1.0 + uMid * 1.0),
                    centerOffset.x * vortexStrength + cos(pos.z * 0.08 + uTime * 0.7) * 0.3 * (1.0 + uHigh * 1.0),
                    uFlowSpeed + sin(pos.x * 0.05 + uTime * 0.3) * 0.2 * (1.0 + uBass * 1.2)
                );
                
                // 速度适应
                vel = mix(vel, force, 0.07);
                
                gl_FragColor = vec4(vel, 1.0);
            }`,t),this.gpuCompute.setVariableDependencies(this.posVar,[this.posVar,this.velVar]),this.gpuCompute.setVariableDependencies(this.velVar,[this.posVar,this.velVar]),this.velUniforms=this.velVar.material.uniforms,this.posUniforms=this.posVar.material.uniforms,this.velUniforms.uTime={value:0},this.velUniforms.uVortexStrength={value:this.settings.vortexStrength},this.velUniforms.uFlowSpeed={value:this.settings.flowSpeed},this.velUniforms.uRiverWidth={value:this.settings.riverWidth},this.velUniforms.uRiverHeight={value:this.settings.riverHeight},this.velUniforms.uBass={value:0},this.velUniforms.uMid={value:0},this.velUniforms.uHigh={value:0},this.posUniforms.uTime={value:0},this.posUniforms.uRiverLength={value:this.settings.riverLength},this.posUniforms.uRiverWidth={value:this.settings.riverWidth},this.posUniforms.uRiverHeight={value:this.settings.riverHeight};let i=this.gpuCompute.init();if(i!==null)throw console.error(`GPGPU Init Error:`,i),Error(`GPGPU初始化失败: ${i}`);this.useGPUGPU=!0}catch(e){throw console.error(`GPGPU设置失败:`,e),e}}createParticleSystem(){this.particles&&(this.scene.remove(this.particles),this.geometry&&this.geometry.dispose(),this.shaderMaterial&&this.shaderMaterial.dispose()),this.particleCount=this.WIDTH*this.WIDTH,this.geometry=new l;try{let e=this.getLayerColorsFromBase();this.shaderMaterial=new r({transparent:!0,blending:2,depthWrite:!1,uniforms:{uPosTexture:{value:null},uTime:{value:0},uPointSize:{value:this.settings.pointSize},uBrightness:{value:this.settings.brightness},uBassColor:{value:e.bass},uMidColor:{value:e.mid},uHighColor:{value:e.high},uHueShift:{value:0},uColorIntensity:{value:1},uRiverLength:{value:this.settings.riverLength},uAudioIntensity:{value:0},uBassIntensity:{value:0},uMidIntensity:{value:0},uHighIntensity:{value:0},uKickPulse:{value:0}},vertexShader:`
                    uniform sampler2D uPosTexture;
                    uniform float uTime;
                    uniform float uPointSize;
                    uniform float uAudioIntensity;
                    uniform float uRiverLength;
                    uniform float uKickPulse;
                    
                    attribute vec2 customUV;
                    
                    varying float vLayer;
                    varying float vParticleSeed;
                    
                    void main() {
                        // 从纹理读取位置
                        vec4 texData = texture2D(uPosTexture, customUV);
                        vec3 pos = texData.xyz;
                        vParticleSeed = fract(sin(dot(customUV, vec2(12.9898, 78.233))) * 43758.5453);
                        vec2 radial = normalize(pos.xy + vec2(0.0001));
                        pos.xy += radial * uKickPulse * (0.35 + vParticleSeed * 0.65);
                        
                        // 音频驱动粒子震动
                        float audioWave = sin(uTime * 4.0 + pos.x * 0.05) * uAudioIntensity * 0.4;
                        pos.x += audioWave;
                        pos.y += cos(uTime * 3.0 + pos.y * 0.05) * uAudioIntensity * 0.3;
                        pos.z += sin(uTime * 2.0 + pos.x * 0.03 + pos.y * 0.03) * uAudioIntensity * 0.2;
                        
                        // 按粒子在河流中的 z 位置分层（0~1），决定它属于低/中/高音色带
                        float halfLen = uRiverLength * 0.5;
                        vLayer = clamp((pos.z + halfLen) / max(uRiverLength, 0.001), 0.0, 1.0);
                        
                        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                        float dist = length(mvPosition.xyz);
                        
                        // 点大小随距离和音频变化
                        float size = uPointSize * (300.0 / max(dist, 10.0)) * (1.0 + uAudioIntensity * 0.3);
                        
                        gl_PointSize = size;
                        gl_Position = projectionMatrix * mvPosition;
                    }
                `,fragmentShader:`
                    uniform vec3 uBassColor;
                    uniform vec3 uMidColor;
                    uniform vec3 uHighColor;
                    uniform float uHueShift;
                    uniform float uColorIntensity;
                    uniform float uAudioIntensity;
                    uniform float uBrightness;
                    uniform float uBassIntensity;
                    uniform float uMidIntensity;
                    uniform float uHighIntensity;
                    uniform float uTime;
                    
                    varying float vLayer;
                    varying float vParticleSeed;

                    vec3 hsl2rgb(vec3 hsl) {
                        vec3 rgb = clamp(abs(mod(hsl.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
                        return hsl.z + hsl.y * (rgb - 0.5) * (1.0 - abs(2.0 * hsl.z - 1.0));
                    }

                    vec3 rgb2hsl(vec3 rgb) {
                        float maxVal = max(rgb.r, max(rgb.g, rgb.b));
                        float minVal = min(rgb.r, min(rgb.g, rgb.b));
                        float h = 0.0;
                        float s = 0.0;
                        float l = (maxVal + minVal) * 0.5;
                        if (maxVal != minVal) {
                            float d = maxVal - minVal;
                            s = l > 0.5 ? d / (2.0 - maxVal - minVal) : d / (maxVal + minVal);
                            if (maxVal == rgb.r) h = (rgb.g - rgb.b) / d + (rgb.g < rgb.b ? 6.0 : 0.0);
                            else if (maxVal == rgb.g) h = (rgb.b - rgb.r) / d + 2.0;
                            else h = (rgb.r - rgb.g) / d + 4.0;
                            h /= 6.0;
                        }
                        return vec3(h, s, l);
                    }
                    
                    void main() {
                        // 圆形粒子
                        vec2 coord = gl_PointCoord - vec2(0.5);
                        float dist = length(coord);
                        
                        // 根据音频增加粒子尺寸
                        float audioEffect = 1.0 + uAudioIntensity * 0.3;
                        float maxR = 0.5 * audioEffect;
                        if (dist > maxR) discard;
                        
                        // 更锐利的发光核：中心 45% 区域全亮，边缘快速衰减（避免大范围柔化导致糊）
                        float coreDist = dist / maxR;
                        float pulse = sin(uTime * 2.0) * 0.08 + 1.0;
                        float alpha = 1.0 - smoothstep(0.45, 0.95, coreDist);
                        alpha = pow(alpha, 2.0) * 0.95 * pulse;
                        
                        // 三个频段使用重叠的连续权重，避免沿河流出现生硬色带。
                        float phase = fract(vLayer + (vParticleSeed - 0.5) * 0.16);
                        float bassWeight = 1.0 - smoothstep(0.08, 0.42, phase);
                        float highWeight = smoothstep(0.58, 0.92, phase);
                        float midWeight = max(0.0, 1.0 - bassWeight - highWeight);
                        vec3 bandEnergy = vec3(uBassIntensity, uMidIntensity, uHighIntensity);
                        vec3 weights = vec3(bassWeight, midWeight, highWeight) * (0.28 + bandEnergy * 1.35);
                        // 强频段会把自己的颜色传播到整条星河，而不只影响所在位置。
                        weights += bandEnergy * 0.18;
                        float weightSum = max(dot(weights, vec3(1.0)), 0.001);
                        vec3 finalColor = (
                            uBassColor * weights.x +
                            uMidColor * weights.y +
                            uHighColor * weights.z
                        ) / weightSum;
                        // 与 Animation7 相同：在 HSL 空间由音频连续推动色相和饱和度。
                        vec3 hsl = rgb2hsl(finalColor);
                        hsl.x = mod(hsl.x + uHueShift + 1.0, 1.0);
                        hsl.y = min(hsl.y * uColorIntensity, 1.0);
                        hsl.z = mix(hsl.z, min(hsl.z * 1.25, 0.82), clamp(uColorIntensity - 1.0, 0.0, 1.0));
                        finalColor = hsl2rgb(hsl);
                        alpha *= 0.42 + min(weightSum / 3.0, 1.0) * 0.48;

                        // 保留 HDR 高光，由 ACES 与 Bloom 统一压缩。
                        finalColor *= uBrightness * (0.82 + uAudioIntensity * 0.38);
                        
                        gl_FragColor = vec4(finalColor, alpha);
                    }
                `});let t=new Float32Array(this.particleCount*3),n=new Float32Array(this.particleCount*2);for(let e=0;e<this.particleCount;e++)n[e*2]=e%this.WIDTH/this.WIDTH,n[e*2+1]=Math.floor(e/this.WIDTH)/this.WIDTH,t[e*3]=0,t[e*3+1]=0,t[e*3+2]=0;this.geometry.setAttribute(`position`,new o(t,3)),this.geometry.setAttribute(`customUV`,new o(n,2)),this.particles=new i(this.geometry,this.shaderMaterial)}catch(e){throw console.warn(`ShaderMaterial创建失败:`,e),Error(`ShaderMaterial创建失败，无法启动可视化效果`)}this.scene.add(this.particles)}hexToBaseHue(e){try{let{r:t,g:n,b:r}=new a(e);return new a().setRGB(t,n,r).getHSL({h:0,s:0,l:0}).h}catch{return .58}}getLayerColorsFromBase(){return{bass:new a(`#7c3aed`),mid:new a(`#2563eb`),high:new a(`#22d3ee`)}}applyBaseColorToUniforms(){if(!this.shaderMaterial)return;let e=this.getLayerColorsFromBase();this.shaderMaterial.uniforms.uBassColor.value.copy(e.bass),this.shaderMaterial.uniforms.uMidColor.value.copy(e.mid),this.shaderMaterial.uniforms.uHighColor.value.copy(e.high)}async updateParticleCount(){try{let e=Math.sqrt(this.settings.particleCount);this.WIDTH=Math.floor(e),await this.rebuildParticleSystem()}catch(e){console.error(`更新粒子数量失败:`,e)}}async rebuildParticleSystem(){try{this.gpuCompute&&(this.gpuCompute.dispose(),this.gpuCompute=null,this.posVar=null,this.velVar=null,this.velUniforms=null,this.posUniforms=null),await this.initGPGPU(),this.particles&&(this.scene.remove(this.particles),this.geometry&&this.geometry.dispose(),this.shaderMaterial&&this.shaderMaterial.dispose()),this.createParticleSystem(),this.gui&&this.gui.controllersRecursive().forEach(e=>{e.updateDisplay()})}catch(e){console.error(`重建粒子系统失败:`,e)}}setupPostProcessing(){let e=new f(this.scene,this.camera);this.bloomPass=new h(new u(window.innerWidth,window.innerHeight),this.settings.bloomStrength,this.settings.bloomRadius,this.settings.bloomThreshold),this.composer=new p(this.renderer),this.composer.addPass(e),this.composer.addPass(this.bloomPass),this.composer.addPass(new m)}setupGUI(){this.createGUIContainer();let t={resetParams:async()=>{Object.assign(this.settings,this.defaultSettings),this.resetState(),this.bloomPass.strength=this.settings.bloomStrength,this.bloomPass.radius=this.settings.bloomRadius,this.bloomPass.threshold=this.settings.bloomThreshold,this.renderer.toneMappingExposure=this.settings.toneMappingExposure,this.camera.position.set(0,10,50),this.controls.target.set(0,0,0),this.controls.saveState(),this.controls.reset(),this.controls.update(),this.baseHue=this.hexToBaseHue(this.settings.color),this.applyBaseColorToUniforms(),this.shaderMaterial&&(this.shaderMaterial.uniforms.uPointSize.value=this.settings.pointSize,this.shaderMaterial.uniforms.uBrightness.value=this.settings.brightness,this.shaderMaterial.uniforms.uRiverLength.value=this.settings.riverLength),this.velUniforms&&(this.velUniforms.uVortexStrength.value=this.settings.vortexStrength,this.velUniforms.uFlowSpeed.value=this.settings.flowSpeed),this.posUniforms&&(this.posUniforms.uRiverLength.value=this.settings.riverLength);let e=t=>{t.controllers.forEach(e=>e.updateDisplay()),t.folders&&Object.values(t.folders).forEach(t=>e(t))};e(this.gui),await this.updateParticleCount()}};this.gui=new e({title:`浮光星海`,container:this.guiContainer});let n=this.gui.addFolder(`视觉与粒子`);n.add(this.settings,`particleCount`,1024,1e5,1024).name(`粒子数量`).onChange(e=>{this.updateParticleCount()}),n.add(this.settings,`pointSize`,.1,5,.1).name(`粒子大小`).onChange(e=>{this.shaderMaterial&&(this.shaderMaterial.uniforms.uPointSize.value=e)}),n.add(this.settings,`brightness`,.5,5,.1).name(`粒子亮度`).onChange(e=>{this.shaderMaterial&&(this.shaderMaterial.uniforms.uBrightness.value=e)}),n.add(this.settings,`bloomStrength`,0,3,.1).name(`bloom强度`).onChange(e=>{this.bloomPass.strength=e}),n.add(this.settings,`bloomRadius`,.1,1,.05).name(`bloom半径`).onChange(e=>{this.bloomPass.radius=e}),n.add(this.settings,`bloomThreshold`,.1,1,.05).name(`bloom阈值`).onChange(e=>{this.bloomPass.threshold=e}),n.add(this.settings,`toneMappingExposure`,.1,2,.05).name(`曝光强度`).onChange(e=>{this.renderer.toneMappingExposure=e}),n.open();let r=this.gui.addFolder(`河流效果`);r.add(this.settings,`vortexStrength`,0,2,.1).name(`漩涡强度`).onChange(e=>{this.velUniforms&&(this.velUniforms.uVortexStrength.value=e)}),r.add(this.settings,`flowSpeed`,0,.5,.01).name(`流动速度`).onChange(e=>{this.velUniforms&&(this.velUniforms.uFlowSpeed.value=e)});let i=()=>{clearTimeout(this._riverResizeTimer),this._riverResizeTimer=setTimeout(()=>this.rebuildParticleSystem(),200)};r.add(this.settings,`riverWidth`,10,100,1).name(`河流宽度`).onChange(i),r.add(this.settings,`riverHeight`,5,50,1).name(`河流高度`).onChange(i),r.add(this.settings,`riverLength`,20,200,1).name(`河流长度`).onChange(e=>{this.posUniforms&&(this.posUniforms.uRiverLength.value=e),this.shaderMaterial&&(this.shaderMaterial.uniforms.uRiverLength.value=e)}),r.open();let a=this.gui.addFolder(`音频交互`);a.add(this.settings,`audioSensitivity`,0,3,.1).name(`总灵敏度`),a.add(this.settings,`bassReactivity`,0,2,.05).name(`低音→漩涡`),a.add(this.settings,`midReactivity`,0,2,.05).name(`中音→横向扰动`),a.add(this.settings,`highReactivity`,0,2,.05).name(`高音→纵向扰动`),a.add(this.settings,`kickPulse`,0,1.5,.01).name(`鼓点冲击`),a.add(this.settings,`energyBrightness`,0,2,.05).name(`音量→亮度`),a.add(this.settings,`colorReactivity`,0,3,.05).name(`音频变色强度`),a.add(this.settings,`saturationBoost`,0,3,.05).name(`低频饱和增强`),a.add(this.settings,`colorLerpSpeed`,.01,1,.05).name(`变色响应速度`),a.open();let o=this.gui.addFolder(`相机控制`);o.add(this.settings,`autoRotate`).name(`自动旋转`).onChange(()=>{}),o.add(this.settings,`autoRotateSpeed`,.1,2,.1).name(`旋转速度`),this.gui.add(t,`resetParams`).name(`重置参数`),this.gui.hide()}createGUIContainer(){this.guiContainer=v(`Animation9-gui-container`),y(`Animation9-gui-container`),document.body.appendChild(this.guiContainer)}setupSettingsButton(){this.settingsButton=g(`Animation9-settings-button`),this.settingsButton.addEventListener(`click`,()=>{this.guiVisible=!this.guiVisible,this.guiVisible?this.gui.show():this.gui.hide()}),document.body.appendChild(this.settingsButton)}updateAudioAnalysis(e=1/60){if(!this.hasAudioData||!this.a){this.kickEnvelope*=Math.exp(-e/.16),this.shaderMaterial&&(this.shaderMaterial.uniforms.uAudioIntensity.value=0,this.shaderMaterial.uniforms.uBassIntensity.value=0,this.shaderMaterial.uniforms.uMidIntensity.value=0,this.shaderMaterial.uniforms.uHighIntensity.value=0,this.shaderMaterial.uniforms.uPointSize.value=this.settings.pointSize,this.shaderMaterial.uniforms.uKickPulse.value=this.kickEnvelope*this.settings.kickPulse,this.shaderMaterial.uniforms.uHueShift.value=d.lerp(this.shaderMaterial.uniforms.uHueShift.value,0,1-Math.exp(-e/.18)),this.shaderMaterial.uniforms.uColorIntensity.value=d.lerp(this.shaderMaterial.uniforms.uColorIntensity.value,1,1-Math.exp(-e/.18))),this.velUniforms&&(this.velUniforms.uBass.value=0,this.velUniforms.uMid.value=0,this.velUniforms.uHigh.value=0),this.applyBaseColorToUniforms();return}let t=this.a,n=this.settings.audioSensitivity,r=Math.min(t.bass*n*this.settings.bassReactivity,1.5),i=Math.min(t.mid*n*this.settings.midReactivity,1.5),a=Math.min(t.high*n*this.settings.highReactivity,1.5);if(this.useGPUGPU&&this.velUniforms&&(this.velUniforms.uBass.value=r,this.velUniforms.uMid.value=i,this.velUniforms.uHigh.value=a),this.useGPUGPU&&this.shaderMaterial){let n=(r+i+a)/3,o=t.energy*this.settings.energyBrightness;this.shaderMaterial.uniforms.uAudioIntensity.value=Math.min(n+o,1.5),this.kickEnvelope=Math.max(t.kick,this.kickEnvelope*Math.exp(-e/.22)),this.shaderMaterial.uniforms.uKickPulse.value=this.kickEnvelope*this.settings.kickPulse,this.shaderMaterial.uniforms.uPointSize.value=this.settings.pointSize*(1+this.kickEnvelope*.12),this.updateAudioDrivenColors(r,i,a)}}updateAudioDrivenColors(e,t,n){this.shaderMaterial&&this.updateParticleLayerColors(e,t,n)}updateParticleLayerColors(e,t,n){if(!this.useGPUGPU||!this.shaderMaterial||!this.a)return;let r=this.settings.colorReactivity,i=this.settings.colorLerpSpeed,a=Math.min(1.5,t+n),o=(Math.sin(this.time*.5)*.18*a+a*.55)*r,s=1+e*this.settings.saturationBoost;this.shaderMaterial.uniforms.uHueShift.value=d.lerp(this.shaderMaterial.uniforms.uHueShift.value,o,i),this.shaderMaterial.uniforms.uColorIntensity.value=d.lerp(this.shaderMaterial.uniforms.uColorIntensity.value,s,i),this.shaderMaterial.uniforms.uBassIntensity.value=d.lerp(this.shaderMaterial.uniforms.uBassIntensity.value,e,i),this.shaderMaterial.uniforms.uMidIntensity.value=d.lerp(this.shaderMaterial.uniforms.uMidIntensity.value,t,i),this.shaderMaterial.uniforms.uHighIntensity.value=d.lerp(this.shaderMaterial.uniforms.uHighIntensity.value,n,i)}render(){try{let e=performance.now()*.001,t=this.lastFrameTime>0?Math.min(e-this.lastFrameTime,.05):1/60;if(this.lastFrameTime=e,this.time=e,this.gpuCompute&&this.posVar&&this.velVar&&(this.velUniforms&&(this.velUniforms.uTime.value=this.time),this.posUniforms&&(this.posUniforms.uTime.value=this.time),this.gpuCompute.compute(),this.shaderMaterial&&this.gpuCompute&&this.posVar)){let e=this.gpuCompute.getCurrentRenderTarget(this.posVar).texture;e&&(this.shaderMaterial.uniforms.uPosTexture.value=e,this.shaderMaterial.uniforms.uTime.value=this.time)}this.updateAudioAnalysis(t),this.controls&&(this.settings.autoRotate?(this.controls.autoRotate=!0,this.controls.autoRotateSpeed=this.settings.autoRotateSpeed):this.controls.autoRotate=!1,this.controls.update()),this.composer?this.composer.render():this.renderer&&this.scene&&this.camera&&this.renderer.render(this.scene,this.camera)}catch(e){console.error(`渲染错误:`,e)}}onWindowResize(){let e=window.innerWidth,t=window.innerHeight;this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t),this.composer.setSize(e,t)}updateWithAudioData(e,t){if(e&&e.audioFeature&&e.audioFeature.animation&&e.isPlaying!==!1){this.hasAudioData=!0;let t=e.audioFeature.animation;this.a={bass:t.bass??0,mid:t.mid??0,high:t.high??0,kick:t.kick??0,energy:t.energy??0}}else this.hasAudioData=!1,this.a=null}resetState(){this.a=null,this.hasAudioData=!1,this.kickEnvelope=0,this.velUniforms&&(this.velUniforms.uBass.value=0,this.velUniforms.uMid.value=0,this.velUniforms.uHigh.value=0),this.shaderMaterial&&(this.shaderMaterial.uniforms.uAudioIntensity.value=0,this.shaderMaterial.uniforms.uBassIntensity.value=0,this.shaderMaterial.uniforms.uMidIntensity.value=0,this.shaderMaterial.uniforms.uHighIntensity.value=0,this.shaderMaterial.uniforms.uPointSize.value=this.settings.pointSize,this.shaderMaterial.uniforms.uKickPulse.value=0,this.shaderMaterial.uniforms.uHueShift.value=0,this.shaderMaterial.uniforms.uColorIntensity.value=1),this.applyBaseColorToUniforms()}setEffectMode(e){return console.log(`当前效果模式：${e}`),!0}updateSettings(e){Object.assign(this.settings,e),e.cameraPosition&&this.camera.position.set(e.cameraPosition.x??this.settings.cameraPosition.x,e.cameraPosition.y??this.settings.cameraPosition.y,e.cameraPosition.z??this.settings.cameraPosition.z),e.bloomStrength!==void 0&&this.bloomPass&&(this.bloomPass.strength=e.bloomStrength),e.bloomRadius!==void 0&&this.bloomPass&&(this.bloomPass.radius=e.bloomRadius),e.bloomThreshold!==void 0&&this.bloomPass&&(this.bloomPass.threshold=e.bloomThreshold),e.color!==void 0&&(this.baseHue=this.hexToBaseHue(e.color),this.applyBaseColorToUniforms()),e.pointSize!==void 0&&this.shaderMaterial&&(this.shaderMaterial.uniforms.uPointSize.value=e.pointSize),e.brightness!==void 0&&this.shaderMaterial&&(this.shaderMaterial.uniforms.uBrightness.value=e.brightness),e.vortexStrength!==void 0&&this.velUniforms&&(this.velUniforms.uVortexStrength.value=e.vortexStrength),e.flowSpeed!==void 0&&this.velUniforms&&(this.velUniforms.uFlowSpeed.value=e.flowSpeed),e.riverWidth!==void 0&&(this.velUniforms&&(this.velUniforms.uRiverWidth.value=e.riverWidth),this.posUniforms&&(this.posUniforms.uRiverWidth.value=e.riverWidth)),e.riverHeight!==void 0&&(this.velUniforms&&(this.velUniforms.uRiverHeight.value=e.riverHeight),this.posUniforms&&(this.posUniforms.uRiverHeight.value=e.riverHeight)),e.riverLength!==void 0&&(this.posUniforms&&(this.posUniforms.uRiverLength.value=e.riverLength),this.shaderMaterial&&(this.shaderMaterial.uniforms.uRiverLength.value=e.riverLength)),e.toneMappingExposure!==void 0&&(this.renderer.toneMappingExposure=e.toneMappingExposure),(e.particleCount!==void 0||e.riverWidth!==void 0||e.riverHeight!==void 0)&&this.updateParticleCount()}dispose(){this._riverResizeTimer&&=(clearTimeout(this._riverResizeTimer),null),_(this.settingsButton,this.guiContainer,this.gui),this.controls&&this.controls.dispose(),this.composer&&this.composer.dispose(),this.bloomPass&&this.bloomPass.dispose(),this.particles&&this.scene.remove(this.particles),this.geometry&&this.geometry.dispose(),this.shaderMaterial&&this.shaderMaterial.dispose(),this.gpuCompute&&this.gpuCompute.dispose(),this.renderer&&this.renderer.dispose(),console.log(`✅ Animation9 资源已清理`)}getAudioDataForUI(){return{bass:this.a?this.a.bass:0,mid:this.a?this.a.mid:0,high:this.a?this.a.high:0}}playAudio(){console.log(`音频播放由系统控制`)}pauseAudio(){console.log(`音频暂停由系统控制`)}};export{S as default};