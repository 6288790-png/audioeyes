import{a as e}from"./lil-gui.esm-jlbWO7FJ.js";import{Bt as t,Jn as n,Wt as r,_t as i,g as a,l as o,qn as s,r as c,u as l,wr as u}from"./three.module-CgISyWQV.js";import{n as d,r as f,t as p}from"./OutputPass-D9GSoAm2.js";import{t as m}from"./UnrealBloomPass-1z79deN3.js";import{i as h,n as g,r as _,t as v}from"./GUIHelper-DspWBXk2.js";import{t as y}from"./OrbitControls-DVnblHSy.js";var b=class{constructor(e,t={}){this.canvas=e;let n={galaxyCount:15e4,neuralCount:45e4,nebulaCount:35e4,nodeCount:25e3,galaxySize:2,nebulaSize:7,neuralSize:2,bloomStrength:.1,bloomRadius:.2,bloomThreshold:.95,nebulaOpacity:.35,autoRotationSpeed:.001,autoRotationEnabled:!1,audioBoost:6,showNodes:!0,effectMode:`full`,bassResponse:2,midResponse:1.5,trebleResponse:1,particleSizeAudio:3,colorShiftAudio:1,pulseIntensity:5,floatIntensity:5,cameraPosition:{x:0,y:0,z:12e3}};this.settings={...n,...t},this.defaultSettings=n,this.scene=null,this.camera=null,this.renderer=null,this.controls=null,this.composer=null,this.bloomPass=null,this.galaxyPoints=null,this.neuralPoints=null,this.nebulaPoints=null,this.nodePoints=null,this.galaxyGeo=null,this.neuralGeo=null,this.nebulaGeo=null,this.nodeGeo=null,this.galaxyMat=null,this.neuralMat=null,this.nebulaMat=null,this.nodeMat=null,this.audioLevel=0,this.bassLevel=0,this.midLevel=0,this.trebleLevel=0,this.beatDetected=!1,this.hasAudioData=!1,this.gui=null,this.guiContainer=null,this.guiVisible=!1,this.settingsButton=null,this.mouse=new u,this.onMouseMoveHandler=null,this.renderTime=0,this.init()}init(){this.setupScene(),this.setupCamera(),this.setupRenderer(),this.setupControls(),this.setupPostProcessing(),this.createGalaxy(),this.createNebula(),this.createNeuralParticles(),this.createNodes(),this.setupMouseListeners(),this.setupGUI(),this.setupSettingsButton()}setupScene(){this.scene=new s}setupCamera(){this.camera=new t(60,window.innerWidth/window.innerHeight,.1,3e4),this.camera.position.set(this.settings.cameraPosition.x,this.settings.cameraPosition.y,this.settings.cameraPosition.z)}setupRenderer(){this.renderer=new c({canvas:this.canvas,antialias:!1,alpha:!0}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.outputColorSpace=i,this.canvas.style.backgroundColor=`transparent`,this.canvas.style.zIndex=`1`}setupControls(){this.controls=new y(this.camera,this.canvas),this.controls.enableDamping=!0,this.controls.dampingFactor=.05,this.controls.target.set(0,0,0)}setupPostProcessing(){let e=new d(this.scene,this.camera);this.bloomPass=new m(new u(window.innerWidth,window.innerHeight),this.settings.bloomStrength,this.settings.bloomRadius,this.settings.bloomThreshold),this.composer=new f(this.renderer),this.composer.addPass(e),this.composer.addPass(this.bloomPass),this.composer.addPass(new p)}createGalaxy(){let e=this.settings.galaxyCount;this.galaxyGeo=new l;let t=new Float32Array(e*3),i=new Float32Array(e),a=new Float32Array(e);for(let n=0;n<e;n++){let e=6e3*Math.random()**2,r=e*.005;t[n*3]=Math.cos(r)*e,t[n*3+1]=(Math.random()-.5)*1500,t[n*3+2]=Math.sin(r)*e,i[n]=e/6e3,a[n]=r}this.galaxyGeo.setAttribute(`position`,new o(t,3)),this.galaxyGeo.setAttribute(`distance`,new o(i,1)),this.galaxyGeo.setAttribute(`angle`,new o(a,1)),this.galaxyMat=new n({transparent:!0,depthWrite:!1,blending:2,uniforms:{time:{value:0},audio:{value:0},bassLevel:{value:0},midLevel:{value:0},trebleLevel:{value:0},beatDetected:{value:!1},pulseIntensity:{value:this.settings.pulseIntensity},bassResponse:{value:this.settings.bassResponse},midResponse:{value:this.settings.midResponse},trebleResponse:{value:this.settings.trebleResponse},floatIntensity:{value:this.settings.floatIntensity},particleSize:{value:this.settings.galaxySize}},vertexShader:`
                attribute float distance;
                attribute float angle;
                uniform float time;
                uniform float audio;
                uniform float bassLevel;
                uniform float midLevel;
                uniform float trebleLevel;
                uniform bool beatDetected;
                uniform float pulseIntensity;
                uniform float bassResponse;
                uniform float midResponse;
                uniform float trebleResponse;
                uniform float floatIntensity;
                uniform float particleSize;
                varying float glow;
                varying float dist;

                void main(){
                    vec3 p = position;
                    dist = distance;
                    
                    float bassBoost = bassLevel * bassResponse;
                    float midBoost = midLevel * midResponse;
                    float trebleBoost = trebleLevel * trebleResponse;
                    
                    // 银河粒子随音频轻微震动
                    p.x += cos(time * 2.0 + angle) * bassBoost * 3.0;
                    p.y += sin(time * 1.5 + angle) * bassBoost * 2.0;
                    p.z += cos(time * 2.5 + angle) * midBoost * 1.5;
                    
                    // 节拍时的螺旋扩张效果
                    if (beatDetected) {
                        p.x += cos(angle) * 10.0 * pulseIntensity;
                        p.y += sin(angle) * 5.0 * pulseIntensity;
                    }
                    
                    // 音频浮动 - 银河粒子随中频上下飘浮
                    p.y += sin(time * 0.5 + angle * 6.28) * (1.0 + midBoost * floatIntensity * 3.0) * 15.0;
                    
                    // 根据距离调整发光效果
                    glow = (1.0 - distance) * 0.5 + audio * 0.3 + trebleBoost * 0.2;
                    
                    vec4 mv = modelViewMatrix * vec4(p, 1.0);
                    // 粒子大小：particleSize 作为乘法因子，音频驱动项归一化后同比例缩放
                    float sizeVariation = sin(time * 6.0 + angle) * midBoost * 0.3;
                    gl_PointSize = particleSize * (1.0 + distance * 1.5 + audio * 2.0 + trebleBoost * 1.5 + sizeVariation * 0.5) * (700.0 / -mv.z);
                    gl_Position = projectionMatrix * mv;
                }
            `,fragmentShader:`
                varying float glow;
                varying float dist;
                uniform float time;
                uniform float bassLevel;
                uniform float midLevel;
                uniform float trebleLevel;
                uniform bool beatDetected;

                // HSV转RGB函数
                vec3 hsv2rgb(vec3 c) {
                    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
                    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
                    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
                }

                void main(){
                    // 波浪形边缘 - 随音频扭曲
                    vec2 uv = gl_PointCoord - 0.5;
                    float waveAngle = atan(uv.y, uv.x);
                    float waveAmount = bassLevel * 0.3 + midLevel * 0.2;
                    float wave = sin(waveAngle * 5.0 + time * 2.0 + glow * 3.0) * waveAmount;
                    float d = length(uv) + wave;
                    float a = smoothstep(0.5, 0.0, d);
                    
                    // 节拍时边缘锯齿加剧
                    if (beatDetected) {
                        float beatWave = sin(waveAngle * 8.0 + time * 6.0) * 0.2;
                        a = smoothstep(0.5 + beatWave, 0.0 + beatWave * 0.5, d);
                    }
                    
                    // 根据距离和音频调整透明度
                    float opacityBoost = bassLevel * 0.6 + midLevel * 0.4 + trebleLevel * 0.2;
                    float finalOpacity = (0.15 + dist * 0.4) * (1.0 + opacityBoost);
                    
                    // 节拍时增加亮度
                    if (beatDetected) {
                        finalOpacity *= 1.6;
                    }
                    
                    // 银河颜色系统：中心偏蓝，边缘偏黄
                    float centerHue = 0.6; // 蓝色
                    float edgeHue = 0.1;   // 黄色
                    float hue = mix(centerHue, edgeHue, dist);
                    
                    // 音频驱动的颜色变化——无音频时色调稳定，音频触发明显变化
                    float audioEnergy = bassLevel * 0.5 + midLevel * 0.3 + trebleLevel * 0.2;
                    
                    // 色调：三个频段共同驱动全色环自由旋转
                    hue += bassLevel * 1.2 + trebleLevel * 0.8 + midLevel * 0.6;
                    // 极缓时间漂移，防止无音频时完全静止
                    hue = mod(hue + time * 0.005, 1.0);
                    
                    // 节拍时色调跳变 35%
                    if (beatDetected) hue = mod(hue + 0.35, 1.0);
                    
                    // 饱和度：音频低时偏灰，音频高时鲜艳
                    float saturation = 0.4 + audioEnergy * 1.2 - dist * 0.15;
                    
                    // 明度：音频高时更亮
                    float value = 0.5 + audioEnergy * 1.0 + trebleLevel * 0.5;
                    
                    vec3 mainColor = hsv2rgb(vec3(
                        hue,
                        clamp(saturation, 0.7, 1.0),
                        clamp(value, 0.4, 1.0)
                    ));
                    
                    vec3 finalColor = mainColor;
                    
                    // 节拍时暖色脉冲
                    if (beatDetected) {
                        vec3 pulseColor = vec3(1.0, 0.9, 0.2);
                        finalColor = mix(finalColor, pulseColor, 0.6);
                    }
                    
                    // 限制颜色范围（上限1.0，避免 additive 累加发白）
                    finalColor = clamp(finalColor, 0.0, 1.0);
                    
                    gl_FragColor = vec4(finalColor, a * finalOpacity);
                }
            `}),this.galaxyPoints=new r(this.galaxyGeo,this.galaxyMat),this.galaxyPoints.visible=!0,this.scene.add(this.galaxyPoints)}createNebula(){let e=this.settings.nebulaCount;this.nebulaGeo=new l;let t=new Float32Array(e*3),i=new Float32Array(e);for(let n=0;n<e;n++)t[n*3]=(Math.random()-.5)*12e3,t[n*3+1]=(Math.random()-.5)*2500,t[n*3+2]=(Math.random()-.5)*12e3,i[n]=Math.random()*.5+.5;this.nebulaGeo.setAttribute(`position`,new o(t,3)),this.nebulaGeo.setAttribute(`speed`,new o(i,1)),this.nebulaMat=new n({transparent:!0,depthWrite:!1,blending:2,uniforms:{time:{value:0},audio:{value:0},bassLevel:{value:0},midLevel:{value:0},trebleLevel:{value:0},beatDetected:{value:!1},baseOpacity:{value:this.settings.nebulaOpacity},audioBoost:{value:this.settings.audioBoost},pulseIntensity:{value:this.settings.pulseIntensity},bassResponse:{value:this.settings.bassResponse},midResponse:{value:this.settings.midResponse},trebleResponse:{value:this.settings.trebleResponse},floatIntensity:{value:this.settings.floatIntensity},particleSize:{value:this.settings.nebulaSize}},vertexShader:`
                attribute float speed;
                uniform float time;
                uniform float audio;
                uniform float bassLevel;
                uniform float midLevel;
                uniform float trebleLevel;
                uniform bool beatDetected;
                uniform float audioBoost;
                uniform float pulseIntensity;
                uniform float bassResponse;
                uniform float midResponse;
                uniform float trebleResponse;
                uniform float floatIntensity;
                uniform float particleSize;
                varying float glow;

                float noise(vec3 p){
                    return sin(p.x*0.08)+cos(p.y*0.08)+sin(p.z*0.08);
                }

                void main(){
                    vec3 p = position;
                    float n = noise(p*0.01 + time*0.15);
                    
                    float bassBoost = bassLevel * bassResponse;
                    float midBoost = midLevel * midResponse;
                    float trebleBoost = trebleLevel * trebleResponse;
                    
                    float boost = 1.0 + audio*audioBoost + bassBoost*0.8 + midBoost*0.4;
                    float pulse = beatDetected ? pulseIntensity * 2.0 : 1.0;
                    
                    // 星云粒子随音频移动（更强烈的响应）
                    p.x += cos(n)*speed*boost*pulse*0.5;
                    p.y += sin(n)*speed*boost*pulse*0.5;
                    p.z += sin(n*0.7)*speed*boost*pulse*0.5;
                    
                    // 低频震动效果（增强）
                    p.x += cos(time*4.0 + p.y*0.02) * bassBoost * 8.0;
                    p.y += sin(time*3.0 + p.z*0.02) * bassBoost * 8.0;
                    p.z += cos(time*2.0 + p.x*0.02) * bassBoost * 6.0;
                    
                    // 中频波动效果
                    p.x += sin(time*6.0 + p.z*0.03) * midBoost * 4.0;
                    p.y += cos(time*5.0 + p.x*0.03) * midBoost * 4.0;
                    
                    // 高频抖动效果
                    p.x += sin(time*12.0) * trebleBoost * 2.0;
                    p.y += cos(time*10.0) * trebleBoost * 2.0;
                    p.z += sin(time*8.0) * trebleBoost * 2.0;
                    
                    // 节拍时的强烈脉冲
                    if (beatDetected) {
                        p.x += (cos(time*20.0) - 0.5) * 20.0;
                        p.y += (sin(time*18.0) - 0.5) * 20.0;
                    }
                    
                    // 音频浮动 - 星云粒子随中频上下飘浮
                    p.y += sin(time * 0.5 + speed * 6.28) * (1.0 + midBoost * floatIntensity * 3.0) * 25.0;
                    
                    glow = length(p)*0.0001 + audio*0.8 + trebleBoost*0.3 + bassBoost*0.2;
                    
                    vec4 mv = modelViewMatrix * vec4(p, 1.0);
                    // 粒子大小：particleSize 作为乘法因子
                    float sizeVariation = sin(time*8.0 + p.x*0.02) * midBoost * 0.8;
                    gl_PointSize = particleSize * (1.0 + audio*1.14 + trebleBoost*1.43 + bassBoost*0.57 + sizeVariation*0.14) * (700.0 / -mv.z);
                    gl_Position = projectionMatrix * mv;
                }
            `,fragmentShader:`
                varying float glow;
                uniform float baseOpacity;
                uniform float bassLevel;
                uniform float midLevel;
                uniform float trebleLevel;
                uniform bool beatDetected;
                uniform float time;

                // HSV转RGB函数
                vec3 hsv2rgb(vec3 c) {
                    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
                    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
                    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
                }

                void main(){
                    // 波浪形边缘 - 随音频扭曲
                    vec2 uv = gl_PointCoord - 0.5;
                    float waveAngle = atan(uv.y, uv.x);
                    float waveAmount = bassLevel * 0.4 + midLevel * 0.25;
                    float wave = sin(waveAngle * 6.0 + time * 2.5 + glow * 4.0) * waveAmount;
                    float d = length(uv) + wave;
                    float a = smoothstep(0.5, 0.0, d);
                    
                    // 节拍时边缘锯齿加剧
                    if (beatDetected) {
                        float beatWave = sin(waveAngle * 9.0 + time * 7.0) * 0.25;
                        a = smoothstep(0.5 + beatWave, 0.0 + beatWave * 0.5, d);
                    }
                    
                    // 根据音频调整透明度
                    float opacityBoost = bassLevel * 0.8 + midLevel * 0.5 + trebleLevel * 0.3;
                    float finalOpacity = baseOpacity * (1.0 + opacityBoost);
                    
                    // 节拍时增加亮度
                    if (beatDetected) {
                        finalOpacity *= 1.8;
                    }
                    
                    // 音频驱动的动态颜色——无音频时色相基本稳定
                    float audioEnergy = bassLevel * 0.5 + midLevel * 0.3 + trebleLevel * 0.2;
                    float hueShift = time * 0.01 + bassLevel * 2.0 + midLevel * 1.2 + trebleLevel * 0.8;
                    
                    // 节拍时色调跳变 40%
                    if (beatDetected) hueShift += 0.4;
                    
                    // 饱和度：提高基础值防止发白，让颜色更鲜艳
                    float saturation = 0.8 + audioEnergy * 0.8;
                    // 明度：将上限压低，避免 additive 叠加洗白
                    float value = 0.3 + audioEnergy * 0.6 + trebleLevel * 0.3;
                    
                    // 主色调：随时间缓慢变化，受音频影响
                    vec3 mainHue = hsv2rgb(vec3(
                        mod(hueShift, 1.0),
                        clamp(saturation, 0.7, 1.0),
                        clamp(value, 0.3, 0.8)
                    ));
                    
                    vec3 finalColor = mainHue;
                    
                    // 节拍时暖色脉冲
                    if (beatDetected) {
                        vec3 pulseColor = vec3(1.0, 0.85, 0.1);
                        finalColor = mix(finalColor, pulseColor, 0.5);
                    }
                    
                    // 限制颜色范围（上限1.0，避免 additive 累加发白）
                    finalColor = clamp(finalColor, 0.0, 1.0);
                    
                    gl_FragColor = vec4(finalColor, a * finalOpacity);
                }
            `}),this.nebulaPoints=new r(this.nebulaGeo,this.nebulaMat),this.nebulaPoints.visible=!0,this.scene.add(this.nebulaPoints)}createNeuralParticles(){let e=this.settings.neuralCount;this.neuralGeo=new l;let t=new Float32Array(e*3),i=new Float32Array(e);for(let n=0;n<e;n++)t[n*3]=(Math.random()-.5)*6e3,t[n*3+1]=(Math.random()-.5)*6e3,t[n*3+2]=(Math.random()-.5)*6e3,i[n]=Math.random()*2;this.neuralGeo.setAttribute(`position`,new o(t,3)),this.neuralGeo.setAttribute(`speed`,new o(i,1)),this.neuralMat=new n({transparent:!0,depthWrite:!1,blending:2,uniforms:{time:{value:0},audio:{value:0},mouse:{value:new u},color1:{value:new a(`#33ffaa`)},color2:{value:new a(`#ffaa33`)},audioBoost:{value:this.settings.audioBoost},bassLevel:{value:0},midLevel:{value:0},trebleLevel:{value:0},beatDetected:{value:!1},particleSizeAudio:{value:this.settings.particleSizeAudio},colorShiftAudio:{value:this.settings.colorShiftAudio},pulseIntensity:{value:this.settings.pulseIntensity},bassResponse:{value:this.settings.bassResponse},midResponse:{value:this.settings.midResponse},trebleResponse:{value:this.settings.trebleResponse},floatIntensity:{value:this.settings.floatIntensity},particleSize:{value:this.settings.neuralSize}},vertexShader:`
                attribute float speed;
                uniform float time;
                uniform float audio;
                uniform vec2 mouse;
                uniform float audioBoost;
                uniform float bassLevel;
                uniform float midLevel;
                uniform float trebleLevel;
                uniform bool beatDetected;
                uniform float particleSizeAudio;
                uniform float pulseIntensity;
                uniform float bassResponse;
                uniform float midResponse;
                uniform float trebleResponse;
                uniform float floatIntensity;
                uniform float particleSize;
                varying float glow;

                float noise(vec3 p){
                    return sin(p.x*0.12)+cos(p.y*0.12)+sin(p.z*0.12);
                }

                void main(){
                    vec3 p = position;
                    float n = noise(p*0.02 + time*0.25);
                    
                    float bassBoost = bassLevel * bassResponse;
                    float midBoost = midLevel * midResponse;
                    float trebleBoost = trebleLevel * trebleResponse;
                    
                    float boost = 1.0 + audio*audioBoost + bassBoost + midBoost*0.5;
                    float pulse = beatDetected ? pulseIntensity * 2.0 : 1.0;
                    
                    p.x += cos(n)*speed*boost*pulse;
                    p.y += sin(n)*speed*boost*pulse;
                    p.z += sin(n*0.5)*speed*boost*pulse;
                    
                    p.xy += mouse*500.0*audio;
                    p.xz += vec2(cos(time*2.0), sin(time*2.0)) * bassBoost * 10.0;
                    
                    // 音频浮动 - 神经粒子随中频上下飘浮
                    p.y += sin(time * 0.5 + speed * 3.14) * (1.0 + midBoost * floatIntensity * 3.0) * 20.0;
                    
                    // 粒子大小：particleSize 作为乘法因子
                    float sizeVariation = sin(time*5.0 + p.x*0.01) * midBoost * 0.5;
                    glow = length(p)*0.0001 + audio + trebleBoost*0.3;
                    
                    vec4 mv = modelViewMatrix * vec4(p, 1.0);
                    gl_PointSize = particleSize * (1.0 + audio*particleSizeAudio*0.5 + trebleBoost*4.0 + sizeVariation*0.5) * (700.0 / -mv.z);
                    gl_Position = projectionMatrix * mv;
                }
            `,fragmentShader:`
                varying float glow;
                uniform vec3 color1;
                uniform vec3 color2;
                uniform float colorShiftAudio;
                uniform float bassLevel;
                uniform float midLevel;
                uniform float trebleLevel;
                uniform float time;
                uniform bool beatDetected;

                // HSV转RGB函数
                vec3 hsv2rgb(vec3 c) {
                    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
                    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
                    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
                }

                // RGB转HSV函数
                vec3 rgb2hsv(vec3 c) {
                    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
                    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
                    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
                    float d = q.x - min(q.w, q.y);
                    float e = 1.0e-10;
                    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
                }

                void main(){
                    // 波浪形边缘 - 随音频扭曲
                    vec2 uv = gl_PointCoord - 0.5;
                    float waveAngle = atan(uv.y, uv.x);
                    float waveAmount = bassLevel * 0.3 + midLevel * 0.2 + trebleLevel * 0.1;
                    float wave = sin(waveAngle * 5.0 + time * 2.0 + glow * 3.0) * waveAmount;
                    float d = length(uv) + wave;
                    float a = smoothstep(0.5, 0.0, d);
                    
                    // 节拍时边缘锯齿加剧
                    if (beatDetected) {
                        float beatWave = sin(waveAngle * 7.0 + time * 5.0) * 0.2;
                        a = smoothstep(0.5 + beatWave, 0.0 + beatWave * 0.5, d);
                    }
                    
                    // 基于音频的颜色混合系数
                    float colorShift = bassLevel * colorShiftAudio * 1.5;
                    float midShift = midLevel * 0.5;
                    
                    // 在color1和color2之间混合（clamp 系数，避免 mix 外插反色）
                    vec3 baseColor = mix(color1, color2, clamp(colorShift + midShift * 0.5, 0.0, 1.0));
                    
                    // 转换为HSV
                    vec3 hsv = rgb2hsv(baseColor);
                    
                    // 音频能量整体驱动
                    float audioEnergy = bassLevel * 0.5 + midLevel * 0.3 + trebleLevel * 0.2;
                    
                    // 色调：三个频段共同驱动全色环自由旋转
                    hsv.x += bassLevel * 0.8 + midLevel * 0.6 + trebleLevel * 0.4 + time * 0.005;
                    // 节拍时色调跳变 35%
                    if (beatDetected) hsv.x += 0.35;
                    hsv.x = mod(hsv.x, 1.0);
                    
                    // 饱和度：提高基础值让颜色更鲜艳
                    hsv.y = min(0.6 + audioEnergy * 1.2 + hsv.y * 0.3, 1.0);
                    
                    // 明度：音频高时更亮（不含白色混合）
                    hsv.z = min(0.4 + audioEnergy * 1.0 + trebleLevel * 0.5, 1.0);
                    
                    vec3 c = hsv2rgb(hsv);
                    
                    // 节拍时亮度脉冲
                    if (beatDetected) {
                        c = mix(c, vec3(1.0, 0.9, 0.3), 0.4);
                    }
                    
                    gl_FragColor = vec4(c, a * (1.0 + bassLevel * 0.4));
                }
            `}),this.neuralPoints=new r(this.neuralGeo,this.neuralMat),this.neuralPoints.visible=!0,this.scene.add(this.neuralPoints)}createNodes(){let e=this.settings.nodeCount;this.nodeGeo=new l;let t=new Float32Array(e*3),i=new Float32Array(e);for(let n=0;n<e;n++)t[n*3]=(Math.random()-.5)*5e3,t[n*3+1]=(Math.random()-.5)*5e3,t[n*3+2]=(Math.random()-.5)*5e3,i[n]=Math.random();this.nodeGeo.setAttribute(`position`,new o(t,3)),this.nodeGeo.setAttribute(`offset`,new o(i,1)),this.nodeMat=new n({transparent:!0,depthWrite:!1,blending:2,uniforms:{time:{value:0},audio:{value:0},bassLevel:{value:0},midLevel:{value:0},trebleLevel:{value:0},beatDetected:{value:!1},particleSize:{value:20}},vertexShader:`
                attribute float offset;
                uniform float time;
                uniform float audio;
                uniform float bassLevel;
                uniform float midLevel;
                uniform float trebleLevel;
                uniform bool beatDetected;
                uniform float particleSize;
                varying float vOffset;

                void main(){
                    vOffset = offset;
                    vec3 p = position;

                    // 低频/节拍驱动整体呼吸扩张（以原点为中心）
                    float bassBoost = bassLevel * 0.15;
                    float pulse = beatDetected ? 1.25 : 1.0;
                    p *= 1.0 + bassBoost * pulse;

                    vec4 mv = modelViewMatrix * vec4(p, 1.0);
                    gl_PointSize = particleSize * (1.0 + audio * 1.5 + trebleLevel * 2.0) * (700.0 / -mv.z);
                    gl_Position = projectionMatrix * mv;
                }
            `,fragmentShader:`
                uniform float time;
                uniform float bassLevel;
                uniform float midLevel;
                uniform float trebleLevel;
                uniform bool beatDetected;
                varying float vOffset;

                // HSV转RGB函数
                vec3 hsv2rgb(vec3 c) {
                    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
                    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
                    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
                }

                void main(){
                    // 圆形柔边粒子
                    vec2 uv = gl_PointCoord - 0.5;
                    float d = length(uv);
                    float a = smoothstep(0.5, 0.05, d);

                    float audioEnergy = bassLevel * 0.5 + midLevel * 0.3 + trebleLevel * 0.2;

                    // 基础青色，随音频与节拍在色环上旋转，offset 提供粒子间的色差
                    float hue = 0.55 + bassLevel * 0.8 + midLevel * 0.6 + trebleLevel * 0.4 + time * 0.005 + vOffset * 0.08;
                    if (beatDetected) hue += 0.35;
                    hue = mod(hue, 1.0);

                    // 饱和度与明度随音频增强
                    float saturation = 0.7 + audioEnergy * 0.6;
                    float value = 0.55 + audioEnergy * 0.7 + trebleLevel * 0.4;

                    vec3 color = hsv2rgb(vec3(hue, clamp(saturation, 0.5, 1.0), clamp(value, 0.4, 1.0)));

                    // 节拍时暖色脉冲
                    if (beatDetected) {
                        color = mix(color, vec3(1.0, 0.9, 0.3), 0.5);
                    }

                    gl_FragColor = vec4(color, a);
                }
            `}),this.nodePoints=new r(this.nodeGeo,this.nodeMat),this.nodePoints.visible=!0,this.scene.add(this.nodePoints)}setupMouseListeners(){this.onMouseMoveHandler=e=>{this.mouse.x=e.clientX/window.innerWidth*2-1,this.mouse.y=-(e.clientY/window.innerHeight)*2+1},window.addEventListener(`mousemove`,this.onMouseMoveHandler)}updateGalaxyCount(e){if(!this.galaxyGeo)return;[`position`,`distance`,`angle`].forEach(e=>{let t=this.galaxyGeo.getAttribute(e);t&&t.dispose()});let t=new Float32Array(e*3),n=new Float32Array(e),r=new Float32Array(e);for(let i=0;i<e;i++){let e=6e3*Math.random()**2,a=e*.005;t[i*3]=Math.cos(a)*e,t[i*3+1]=(Math.random()-.5)*1500,t[i*3+2]=Math.sin(a)*e,n[i]=e/6e3,r[i]=a}this.galaxyGeo.setAttribute(`position`,new o(t,3)),this.galaxyGeo.setAttribute(`distance`,new o(n,1)),this.galaxyGeo.setAttribute(`angle`,new o(r,1))}updateNeuralCount(e){if(!this.neuralGeo)return;[`position`,`speed`].forEach(e=>{let t=this.neuralGeo.getAttribute(e);t&&t.dispose()});let t=new Float32Array(e*3),n=new Float32Array(e);for(let r=0;r<e;r++)t[r*3]=(Math.random()-.5)*6e3,t[r*3+1]=(Math.random()-.5)*6e3,t[r*3+2]=(Math.random()-.5)*6e3,n[r]=Math.random()*2;this.neuralGeo.setAttribute(`position`,new o(t,3)),this.neuralGeo.setAttribute(`speed`,new o(n,1))}updateNebulaCount(e){if(!this.nebulaGeo)return;[`position`,`speed`].forEach(e=>{let t=this.nebulaGeo.getAttribute(e);t&&t.dispose()});let t=new Float32Array(e*3),n=new Float32Array(e);for(let r=0;r<e;r++)t[r*3]=(Math.random()-.5)*12e3,t[r*3+1]=(Math.random()-.5)*2500,t[r*3+2]=(Math.random()-.5)*12e3,n[r]=Math.random()*.5+.5;this.nebulaGeo.setAttribute(`position`,new o(t,3)),this.nebulaGeo.setAttribute(`speed`,new o(n,1))}updateNodeCount(e){if(!this.nodeGeo)return;[`position`,`offset`].forEach(e=>{let t=this.nodeGeo.getAttribute(e);t&&t.dispose()});let t=new Float32Array(e*3),n=new Float32Array(e);for(let r=0;r<e;r++)t[r*3]=(Math.random()-.5)*5e3,t[r*3+1]=(Math.random()-.5)*5e3,t[r*3+2]=(Math.random()-.5)*5e3,n[r]=Math.random();this.nodeGeo.setAttribute(`position`,new o(t,3)),this.nodeGeo.setAttribute(`offset`,new o(n,1))}updateWithAudioData(e,t){if(this.renderTime=(t||0)/1e3,!e||!e.audioFeature||!e.isPlaying){this.hasAudioData=!1,this.audioLevel=0,this.bassLevel=0,this.midLevel=0,this.trebleLevel=0,this.beatDetected=!1;return}this.hasAudioData=!0;let n=e.audioFeature.animation,r=.3;this.bassLevel=this.bassLevel*(1-r)+(n.bass||0)*r,this.midLevel=this.midLevel*(1-r)+(n.mid||0)*r,this.trebleLevel=this.trebleLevel*(1-r)+(n.high||0)*r,this.audioLevel=n.energy||(this.bassLevel+this.midLevel+this.trebleLevel)/3,this.beatDetected=n.beat>.4}setupGUI(){this.guiContainer=_(`Animation22-gui-container`),v(`Animation22-gui-container`),document.body.appendChild(this.guiContainer),this.gui=new e({title:`幻音宇宙`,container:this.guiContainer});let t=this.gui.addFolder(`粒子系统`);t.add(this.settings,`galaxyCount`,1e4,1e6,1e3).name(`银河粒子数`).onChange(e=>this.updateGalaxyCount(e)),t.add(this.settings,`neuralCount`,1e4,1e6,1e3).name(`神经粒子数`).onChange(e=>this.updateNeuralCount(e)),t.add(this.settings,`nebulaCount`,1e4,1e6,1e3).name(`星云粒子数`).onChange(e=>this.updateNebulaCount(e)),t.add(this.settings,`nodeCount`,1e3,1e5,1e3).name(`节点数量`).onChange(e=>this.updateNodeCount(e)),t.add(this.settings,`galaxySize`,.5,10,.5).name(`银河大小`).onChange(e=>{this.galaxyMat&&(this.galaxyMat.uniforms.particleSize.value=e)}),t.add(this.settings,`nebulaSize`,.5,20,.5).name(`星云大小`).onChange(e=>{this.nebulaMat&&(this.nebulaMat.uniforms.particleSize.value=e)}),t.add(this.settings,`neuralSize`,.5,10,.5).name(`神经大小`).onChange(e=>{this.neuralMat&&(this.neuralMat.uniforms.particleSize.value=e)}),t.open();let n=this.gui.addFolder(`效果参数`);n.add(this.settings,`bloomStrength`,0,5,.1).name(`bloom强度`).onChange(e=>this.bloomPass.strength=e),n.add(this.settings,`bloomRadius`,.1,2,.1).name(`bloom半径`).onChange(e=>this.bloomPass.radius=e),n.add(this.settings,`bloomThreshold`,0,1,.01).name(`bloom阈值`).onChange(e=>this.bloomPass.threshold=e),n.add(this.settings,`nebulaOpacity`,.1,1,.05).name(`星云透明度`).onChange(e=>this.nebulaMat.uniforms.baseOpacity.value=e),n.open();let r=this.gui.addFolder(`效果模式`);r.add(this.settings,`effectMode`,{全部图层:`full`,仅银河:`galaxy`,仅星云:`nebula`,仅神经:`neural`,仅节点:`nodes`}).name(`效果模式`).onChange(e=>this.setEffectMode(e)),r.open();let i=this.gui.addFolder(`动画控制`);i.add(this.settings,`autoRotationEnabled`).name(`启用自动旋转`),i.add(this.settings,`autoRotationSpeed`,1e-4,.005,1e-4).name(`自动旋转速度`),i.add(this.settings,`showNodes`).name(`显示节点`).onChange(()=>this.updateNodeVisibility()),i.open();let a=this.gui.addFolder(`音频增强`);a.add(this.settings,`audioBoost`,1,20,.5).name(`增强强度`).onChange(e=>{this.neuralMat&&(this.neuralMat.uniforms.audioBoost.value=e),this.nebulaMat&&(this.nebulaMat.uniforms.audioBoost.value=e)}),a.add(this.settings,`bassResponse`,.1,5,.1).name(`低频响应`).onChange(e=>{this.neuralMat&&(this.neuralMat.uniforms.bassResponse.value=e),this.nebulaMat&&(this.nebulaMat.uniforms.bassResponse.value=e),this.galaxyMat&&(this.galaxyMat.uniforms.bassResponse.value=e)}),a.add(this.settings,`midResponse`,.1,5,.1).name(`中频响应`).onChange(e=>{this.neuralMat&&(this.neuralMat.uniforms.midResponse.value=e),this.nebulaMat&&(this.nebulaMat.uniforms.midResponse.value=e),this.galaxyMat&&(this.galaxyMat.uniforms.midResponse.value=e)}),a.add(this.settings,`trebleResponse`,.1,5,.1).name(`高频响应`).onChange(e=>{this.neuralMat&&(this.neuralMat.uniforms.trebleResponse.value=e),this.nebulaMat&&(this.nebulaMat.uniforms.trebleResponse.value=e),this.galaxyMat&&(this.galaxyMat.uniforms.trebleResponse.value=e)}),a.add(this.settings,`particleSizeAudio`,.1,10,.1).name(`粒子大小响应`).onChange(e=>this.neuralMat.uniforms.particleSizeAudio.value=e),a.add(this.settings,`colorShiftAudio`,.1,3,.1).name(`颜色变化响应`).onChange(e=>this.neuralMat.uniforms.colorShiftAudio.value=e),a.add(this.settings,`pulseIntensity`,.1,5,.1).name(`脉冲强度`).onChange(e=>{this.neuralMat&&(this.neuralMat.uniforms.pulseIntensity.value=e),this.nebulaMat&&(this.nebulaMat.uniforms.pulseIntensity.value=e),this.galaxyMat&&(this.galaxyMat.uniforms.pulseIntensity.value=e)}),a.add(this.settings,`floatIntensity`,0,10,.1).name(`浮动强度`).onChange(e=>{this.neuralMat&&(this.neuralMat.uniforms.floatIntensity.value=e),this.nebulaMat&&(this.nebulaMat.uniforms.floatIntensity.value=e),this.galaxyMat&&(this.galaxyMat.uniforms.floatIntensity.value=e)}),a.open(),this.gui.add({resetParams:()=>{Object.assign(this.settings,this.defaultSettings),this.updateGalaxyCount(this.settings.galaxyCount),this.updateNeuralCount(this.settings.neuralCount),this.updateNebulaCount(this.settings.nebulaCount),this.updateNodeCount(this.settings.nodeCount),this.bloomPass&&(this.bloomPass.strength=this.settings.bloomStrength,this.bloomPass.radius=this.settings.bloomRadius,this.bloomPass.threshold=this.settings.bloomThreshold),this.nebulaMat&&this.nebulaMat.uniforms.baseOpacity&&(this.nebulaMat.uniforms.baseOpacity.value=this.settings.nebulaOpacity),this.neuralMat&&(this.neuralMat.uniforms.audioBoost.value=this.settings.audioBoost,this.neuralMat.uniforms.bassResponse.value=this.settings.bassResponse,this.neuralMat.uniforms.midResponse.value=this.settings.midResponse,this.neuralMat.uniforms.trebleResponse.value=this.settings.trebleResponse,this.neuralMat.uniforms.particleSizeAudio.value=this.settings.particleSizeAudio,this.neuralMat.uniforms.colorShiftAudio.value=this.settings.colorShiftAudio,this.neuralMat.uniforms.pulseIntensity.value=this.settings.pulseIntensity,this.neuralMat.uniforms.floatIntensity.value=this.settings.floatIntensity,this.neuralMat.uniforms.particleSize.value=this.settings.neuralSize),this.galaxyMat&&(this.galaxyMat.uniforms.bassResponse.value=this.settings.bassResponse,this.galaxyMat.uniforms.midResponse.value=this.settings.midResponse,this.galaxyMat.uniforms.trebleResponse.value=this.settings.trebleResponse,this.galaxyMat.uniforms.pulseIntensity.value=this.settings.pulseIntensity,this.galaxyMat.uniforms.floatIntensity.value=this.settings.floatIntensity,this.galaxyMat.uniforms.particleSize.value=this.settings.galaxySize),this.nebulaMat&&(this.nebulaMat.uniforms.audioBoost.value=this.settings.audioBoost,this.nebulaMat.uniforms.bassResponse.value=this.settings.bassResponse,this.nebulaMat.uniforms.midResponse.value=this.settings.midResponse,this.nebulaMat.uniforms.trebleResponse.value=this.settings.trebleResponse,this.nebulaMat.uniforms.pulseIntensity.value=this.settings.pulseIntensity,this.nebulaMat.uniforms.floatIntensity.value=this.settings.floatIntensity,this.nebulaMat.uniforms.particleSize.value=this.settings.nebulaSize),this.setEffectMode(this.settings.effectMode),this.scene.rotation.set(0,0,0),this.nodePoints&&this.nodePoints.rotation.set(0,0,0),this.audioLevel=0,this.bassLevel=0,this.midLevel=0,this.trebleLevel=0,this.beatDetected=!1,this.hasAudioData=!1,this.renderTime=0,this.camera.position.set(this.settings.cameraPosition.x,this.settings.cameraPosition.y,this.settings.cameraPosition.z),this.camera.lookAt(0,0,0),this.controls.target.set(0,0,0),this.controls.update();let e=t=>{t.controllers.forEach(e=>e.updateDisplay()),t.folders&&Object.values(t.folders).forEach(t=>e(t))};e(this.gui)}},`resetParams`).name(`重置参数`),this.gui.hide()}setupSettingsButton(){this.settingsButton=h(`Animation22-settings-button`),this.settingsButton.addEventListener(`click`,()=>{this.guiVisible=!this.guiVisible,this.guiVisible?this.gui.show():this.gui.hide()}),document.body.appendChild(this.settingsButton)}render(){if(!this.composer||!this.scene)return;let e=this.renderTime;if(!this.hasAudioData){this.neuralMat&&(this.neuralMat.uniforms.time.value=e),this.nebulaMat&&(this.nebulaMat.uniforms.time.value=e),this.galaxyMat&&(this.galaxyMat.uniforms.time.value=e),this.nodeMat&&(this.nodeMat.uniforms.time.value=e),this.settings.autoRotationEnabled&&(this.scene.rotation.y+=this.settings.autoRotationSpeed*.3),this.controls.update(),this.composer.render();return}this.neuralMat&&(this.neuralMat.uniforms.time.value=e,this.neuralMat.uniforms.audio.value=this.audioLevel||0,this.neuralMat.uniforms.mouse.value.copy(this.mouse),this.neuralMat.uniforms.bassLevel.value=this.bassLevel,this.neuralMat.uniforms.midLevel.value=this.midLevel,this.neuralMat.uniforms.trebleLevel.value=this.trebleLevel,this.neuralMat.uniforms.beatDetected.value=this.beatDetected,this.neuralMat.uniforms.floatIntensity.value=this.settings.floatIntensity),this.nebulaMat&&(this.nebulaMat.uniforms.time.value=e,this.nebulaMat.uniforms.audio.value=this.audioLevel||0,this.nebulaMat.uniforms.bassLevel.value=this.bassLevel,this.nebulaMat.uniforms.midLevel.value=this.midLevel,this.nebulaMat.uniforms.trebleLevel.value=this.trebleLevel,this.nebulaMat.uniforms.beatDetected.value=this.beatDetected,this.nebulaMat.uniforms.baseOpacity.value=this.settings.nebulaOpacity,this.nebulaMat.uniforms.audioBoost.value=this.settings.audioBoost,this.nebulaMat.uniforms.pulseIntensity.value=this.settings.pulseIntensity,this.nebulaMat.uniforms.bassResponse.value=this.settings.bassResponse,this.nebulaMat.uniforms.midResponse.value=this.settings.midResponse,this.nebulaMat.uniforms.trebleResponse.value=this.settings.trebleResponse,this.nebulaMat.uniforms.floatIntensity.value=this.settings.floatIntensity),this.galaxyMat&&(this.galaxyMat.uniforms.time.value=e,this.galaxyMat.uniforms.audio.value=this.audioLevel||0,this.galaxyMat.uniforms.bassLevel.value=this.bassLevel,this.galaxyMat.uniforms.midLevel.value=this.midLevel,this.galaxyMat.uniforms.trebleLevel.value=this.trebleLevel,this.galaxyMat.uniforms.beatDetected.value=this.beatDetected,this.galaxyMat.uniforms.pulseIntensity.value=this.settings.pulseIntensity,this.galaxyMat.uniforms.bassResponse.value=this.settings.bassResponse,this.galaxyMat.uniforms.midResponse.value=this.settings.midResponse,this.galaxyMat.uniforms.trebleResponse.value=this.settings.trebleResponse,this.galaxyMat.uniforms.floatIntensity.value=this.settings.floatIntensity),this.nodeMat&&(this.nodeMat.uniforms.time.value=e,this.nodeMat.uniforms.audio.value=this.audioLevel||0,this.nodeMat.uniforms.bassLevel.value=this.bassLevel,this.nodeMat.uniforms.midLevel.value=this.midLevel,this.nodeMat.uniforms.trebleLevel.value=this.trebleLevel,this.nodeMat.uniforms.beatDetected.value=this.beatDetected),this.nodePoints&&this.nodePoints.visible&&(this.nodePoints.rotation.y+=this.trebleLevel*.01,this.nodePoints.rotation.x+=this.bassLevel*.005),this.settings.autoRotationEnabled&&(this.scene.rotation.y+=this.settings.autoRotationSpeed),this.controls.update(),this.composer.render()}setEffectMode(e){let t=[`full`,`galaxy`,`nebula`,`neural`,`nodes`].includes(e)?e:`full`;return this.settings.effectMode=t,this.galaxyPoints&&(this.galaxyPoints.visible=t===`full`||t===`galaxy`),this.nebulaPoints&&(this.nebulaPoints.visible=t===`full`||t===`nebula`),this.neuralPoints&&(this.neuralPoints.visible=t===`full`||t===`neural`),this.updateNodeVisibility(),console.log(`Animation22 模式切换: ${t}`),!0}updateNodeVisibility(){this.nodePoints&&(this.settings.effectMode===`nodes`?this.nodePoints.visible=!0:this.settings.effectMode===`full`?this.nodePoints.visible=this.settings.showNodes:this.nodePoints.visible=!1)}onWindowResize(){this.camera.aspect=window.innerWidth/window.innerHeight,this.camera.updateProjectionMatrix(),this.renderer.setSize(window.innerWidth,window.innerHeight),this.composer.setSize(window.innerWidth,window.innerHeight)}dispose(){this.onMouseMoveHandler&&=(window.removeEventListener(`mousemove`,this.onMouseMoveHandler),null),this.controls&&=(this.controls.dispose(),null),g(this.settingsButton,this.guiContainer,this.gui),this.settingsButton=null,this.guiContainer=null,this.gui=null,this.scene&&=(this.scene.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.dispose()):e.material.dispose())}),null),this.composer&&=(this.composer.passes.forEach(e=>{e.dispose&&e.dispose()}),null),this.bloomPass=null,this.renderer&&=(this.renderer.dispose(),null),this.camera=null,this.galaxyPoints=null,this.neuralPoints=null,this.nebulaPoints=null,this.nodePoints=null,this.galaxyGeo=null,this.neuralGeo=null,this.nebulaGeo=null,this.nodeGeo=null,this.galaxyMat=null,this.neuralMat=null,this.nebulaMat=null,this.nodeMat=null}};export{b as default};