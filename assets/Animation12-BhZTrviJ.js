import{a as e}from"./lil-gui.esm-jlbWO7FJ.js";import{Bt as t,Gt as n,Jn as r,Wt as i,_t as a,f as o,l as s,qn as c,r as l,u,wr as d}from"./three.module-CgISyWQV.js";import{n as f,r as p,t as m}from"./OutputPass-D9GSoAm2.js";import{t as h}from"./UnrealBloomPass-1z79deN3.js";import{i as g,n as _,r as v,t as y}from"./GUIHelper-DspWBXk2.js";var b=class{constructor(e,t={}){this.canvas=e;let n={lyricsText:``,particleCount:22e3,particleSize:.6,transitionSpeed:.2,rotationEnabled:!1,textScale:1,graphicPosition:`center`,cameraPosition:{x:0,y:0,z:150},bloomStrength:.15,bloomRadius:.6,bloomThreshold:.9,particleJitter:.03,enableBloom:!0,particleBrightness:1,colorMode:5};this.settings={...n,...t},this.DEFAULTS=n,this.positionOptions={center:{name:`居中`,offsetX:0,offsetY:0},"top-left":{name:`左上角`,offsetX:-.25,offsetY:-.25},"top-right":{name:`右上角`,offsetX:.25,offsetY:-.25},"bottom-left":{name:`左下角`,offsetX:-.25,offsetY:.25},"bottom-right":{name:`右下角`,offsetX:.25,offsetY:.25},fullscreen:{name:`全屏`,offsetX:0,offsetY:0}},this.scene=null,this.camera=null,this.renderer=null,this.particles=null,this.composer=null,this.bloomPass=null,this.lyricsCoords=[],this.lastTime=0,this.transitionMultiplier=1,this.gui=null,this.guiContainer=null,this.guiVisible=!1,this.settingsButton=null,this.audioFreq=0,this.bass=0,this.mid=0,this.high=0,this.beat=null,this.hasAudioData=!1,this.isPlaying=!0,this.motion=0,this.variation=0,this.brightness=0,this.percussive=0,this.smoothness=0,this.isDownbeat=!1,this.isMusicPaused=!1,this._disposed=!1,this._lyricsPatched=!1,this._initTimeoutId=null,this._lyricsRequestId=0,this.sampleCanvas=null,this.sampleContext=null,this.init().then(()=>{this.lastTime=performance.now()*.001,this.animTime=0,this.initLyricsIntegration()}).catch(e=>{console.error(`❌ Animation12 初始化失败:`,e)})}async init(){try{return await this.setupThreeJS(),this.setupSampleCanvas(),await this.createGPUParticleSystem(),this.settings.lyricsText=``,await this.updateWithLyrics(this.settings.lyricsText),this.setupPostProcessing(),this.setupGUI(),this.setupSettingsButton(),!0}catch(e){throw console.error(`❌ Animation12 初始化失败:`,e),e}}setupSampleCanvas(){this.sampleCanvas=document.createElement(`canvas`),this.sampleContext=this.sampleCanvas.getContext(`2d`,{willReadFrequently:!0}),this.sampleContext||console.warn(`无法获取Canvas 2D上下文，回退到传统方法`)}async setupThreeJS(){if(!this.checkWebGLSupport())throw Error(`WebGL不支持或已禁用`);this.scene=new c,this.camera=new t(75,window.innerWidth/window.innerHeight,.1,1e3),this.camera.position.set(this.settings.cameraPosition.x,this.settings.cameraPosition.y,this.settings.cameraPosition.z);try{this.renderer=new l({canvas:this.canvas,antialias:!1,alpha:!0,powerPreference:`default`,preserveDrawingBuffer:!1})}catch(e){console.warn(`WebGL渲染器创建失败，尝试回退配置:`,e),this.renderer=new l({canvas:this.canvas,alpha:!0})}this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.setClearColor(0,0),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,1)),this.renderer.outputColorSpace=a,this.canvas.style.backgroundColor=`transparent`,this.canvas.style.zIndex=`1`}checkWebGLSupport(){try{let e=document.createElement(`canvas`),t=e.getContext(`webgl`)||e.getContext(`experimental-webgl`);if(!t)return console.error(`❌ WebGL不支持`),!1;let n=t.getParameter(t.MAX_VERTEX_ATTRIBS),r=t.getParameter(t.MAX_TEXTURE_SIZE);return t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS),n<8&&(console.warn(`⚠️ WebGL顶点属性数量不足，调整粒子配置`),this.settings.particleCount=Math.min(this.settings.particleCount,3e3)),r<2048&&(console.warn(`⚠️ WebGL纹理尺寸限制，调整Bloom效果`),this.settings.bloomStrength=Math.min(this.settings.bloomStrength,.3)),!0}catch(e){return console.error(`❌ WebGL能力检测失败:`,e),!1}}setupPostProcessing(){this.composer=new p(this.renderer);let e=new f(this.scene,this.camera);this.composer.addPass(e),this.bloomPass=new h(new d(window.innerWidth,window.innerHeight),this.settings.bloomStrength,this.settings.bloomRadius,this.settings.bloomThreshold),this.composer.addPass(this.bloomPass),this.composer.addPass(new m)}createGPUParticleMaterial(){try{return new r({uniforms:{time:{value:0},transitionSpeed:{value:this.settings.transitionSpeed},particleJitter:{value:this.settings.particleJitter*.5},bass:{value:0},mid:{value:0},high:{value:0},motion:{value:0},variation:{value:0},brightness:{value:0},percussive:{value:0},size:{value:this.settings.particleSize},colorMode:{value:this.settings.colorMode},uBrightness:{value:1},uSmoothness:{value:.5}},vertexShader:`
            attribute vec3 originalPosition;
            attribute vec3 targetPosition;
            attribute vec3 particleState;
            
            uniform float transitionSpeed;
            uniform float time;
            uniform float particleJitter;
            uniform float bass;
            uniform float mid;
            uniform float high;
            uniform float motion;
            uniform float variation;
            uniform float brightness;
            uniform float percussive;
            uniform float size;
            uniform int colorMode;
            
            varying vec3 vColor;
            varying float vAlpha;
            
            void main() {
                float delay = particleState.y;
                float animTime = max(0.0, time - delay);
                float progress = min(1.0, animTime * transitionSpeed * (0.5 + particleState.x));
                
                float audioEffect = bass * 0.3 + mid * 0.2 + high * 0.1;
                float jitter = (particleJitter + motion * 0.08 + percussive * 0.05) * (1.0 + audioEffect * 2.0);
                
                float easeProgress = progress * (2.0 - progress);
                vec3 finalPosition = mix(originalPosition, targetPosition, easeProgress);
                
                float randomOffset = sin(dot(originalPosition, vec3(12.9898, 78.233, 45.164)) * 43758.5453);
                vec3 jitterOffset = vec3(
                    sin(time * 2.0 + randomOffset * 10.0) * jitter,
                    cos(time * 1.5 + randomOffset * 8.0) * jitter,
                    0.0
                );
                
                finalPosition = finalPosition + jitterOffset;
                
                // 部分粒子汇聚后向外散发再收回
                float emitSeed = particleState.z;
                float shouldEmit = step(0.8, emitSeed);         // 约20%的粒子参与
                float emitAngle = time * 0.15 + emitSeed * 15.0;
                float emitDist = sin(time * 0.4 + emitSeed * 10.0) * (14.0 + variation * 20.0);
                emitDist = max(0.0, emitDist) * shouldEmit;
                finalPosition += vec3(
                    cos(emitAngle) * emitDist,
                    sin(emitAngle * 1.3) * emitDist * 0.8,
                    cos(emitAngle * 0.6 + emitSeed * 5.0) * emitDist * 0.3
                );
                
                float centerDist = length(targetPosition);
                float edgeFactor = smoothstep(0.0, 100.0, centerDist);
                
                // 七彩效果模式（每个模式都是七彩，但表现方式不同）
                vec3 audioColor;
                
                if (colorMode == 0) {
                    // 模式1：基础七彩 - 音频频率直接映射到彩虹色
                    float hue = (bass * 0.3 + mid * 0.4 + high * 0.3) * 6.0;
                    audioColor = vec3(
                        abs(sin(hue + time * 0.5)) * 1.0,
                        abs(sin(hue + 2.0 + time * 0.5)) * 1.0,
                        abs(sin(hue + 4.0 + time * 0.5)) * 1.0
                    );
                } else if (colorMode == 1) {
                    // 模式2：流动七彩 - 随时间流动的彩虹效果
                    float hue = (bass * 0.2 + mid * 0.3 + high * 0.5) * 6.0 + time * 2.0;
                    audioColor = vec3(
                        abs(sin(hue)) * 1.2,
                        abs(sin(hue + 2.0)) * 1.0,
                        abs(sin(hue + 4.0)) * 0.8
                    );
                } else if (colorMode == 2) {
                    // 模式3：粒子七彩 - 每个粒子有独立彩虹色
                    float particleHue = sin(dot(originalPosition, vec3(12.9898, 78.233, 45.164)) * 43758.5453) * 6.0;
                    float audioHue = (bass + mid + high) * 2.0 + time * 1.5;
                    audioColor = vec3(
                        abs(sin(particleHue + audioHue)) * 1.0,
                        abs(sin(particleHue + audioHue + 2.0)) * 1.0,
                        abs(sin(particleHue + audioHue + 4.0)) * 1.0
                    );
                } else if (colorMode == 3) {
                    // 模式4：脉冲七彩 - 音频脉冲驱动的彩虹
                    float pulse = bass * 2.0 + mid * 1.5 + high * 1.0;
                    float hue = (sin(time * 3.0) * 0.5 + 0.5) * 6.0 + pulse * 2.0;
                    audioColor = vec3(
                        abs(sin(hue)) * (1.0 + pulse * 0.5),
                        abs(sin(hue + 2.0)) * (1.0 + pulse * 0.3),
                        abs(sin(hue + 4.0)) * (1.0 + pulse * 0.2)
                    );
                } else if (colorMode == 4) {
                    // 模式5：分层七彩 - 不同频率层显示不同彩虹段
                    float bassHue = bass * 6.0;
                    float midHue = mid * 6.0 + 2.0;
                    float highHue = high * 6.0 + 4.0;
                    audioColor = vec3(
                        (abs(sin(bassHue)) + abs(sin(midHue)) * 0.5 + abs(sin(highHue)) * 0.3) * 0.8,
                        (abs(sin(bassHue + 1.0)) + abs(sin(midHue + 1.0)) * 0.7 + abs(sin(highHue + 1.0)) * 0.5) * 0.8,
                        (abs(sin(bassHue + 2.0)) + abs(sin(midHue + 2.0)) * 0.3 + abs(sin(highHue + 2.0)) * 0.7) * 0.8
                    );
                } else if (colorMode == 5) {
                    // 模式6：旋转七彩 - 旋转的彩虹色环
                    float angle = atan(targetPosition.y, targetPosition.x);
                    float radius = length(targetPosition.xy);
                    float hue = (angle / 3.14159 + 1.0) * 3.0 + time * 2.0 + (bass + mid + high) * 2.0;
                    audioColor = vec3(
                        abs(sin(hue)) * (1.0 - radius * 0.005),
                        abs(sin(hue + 2.0)) * (1.0 - radius * 0.005),
                        abs(sin(hue + 4.0)) * (1.0 - radius * 0.005)
                    );
                } else if (colorMode == 6) {
                    // 模式7：爆炸七彩 - 从中心向外扩散的彩虹
                    float dist = length(targetPosition);
                    float hue = (dist * 0.02 + time * 3.0 + (bass + mid + high) * 3.0) * 6.0;
                    audioColor = vec3(
                        abs(sin(hue)) * (1.0 - dist * 0.003),
                        abs(sin(hue + 2.0)) * (1.0 - dist * 0.003),
                        abs(sin(hue + 4.0)) * (1.0 - dist * 0.003)
                    );
                } else {
                    // 兜底：默认七彩
                    float hue = (bass * 0.3 + mid * 0.4 + high * 0.3) * 6.0;
                    audioColor = vec3(
                        abs(sin(hue + time * 0.5)),
                        abs(sin(hue + 2.0 + time * 0.5)),
                        abs(sin(hue + 4.0 + time * 0.5))
                    );
                }
                
                // 亮度增强：频谱亮度高时颜色更鲜艳
                audioColor *= (0.8 + brightness * 0.4);
                
                // 七彩效果的边缘渐变（统一处理，保持七彩特性）
                vec3 centerColor = audioColor;
                vec3 edgeColor = audioColor * 0.6; // 边缘颜色稍微暗淡，保持七彩特性
                
                vColor = mix(centerColor, edgeColor, edgeFactor);
                
                float distanceFade = 1.0 - smoothstep(0.0, 250.0, centerDist);
                float audioFade = 0.8 + (bass + mid + high) * 0.3;
                vAlpha = min(1.0, distanceFade * audioFade);
                
                float sizeMultiplier = 1.0 + (bass * 0.5 + mid * 0.3 + high * 0.2);
                
                vec4 mvPosition = modelViewMatrix * vec4(finalPosition, 1.0);
                gl_PointSize = size * sizeMultiplier * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,fragmentShader:`
            varying vec3 vColor;
            varying float vAlpha;
            
            uniform float uBrightness;
            uniform float uSmoothness;
            
            void main() {
                // 圆形粒子
                vec2 uv = gl_PointCoord - vec2(0.5);
                float dist = length(uv);
                
                if (dist > 0.5) {
                    discard;
                }
                
                // 柔和边缘（受 smoothness 控制：值越大边缘越柔和）
                float edgeStart = 0.5 - uSmoothness * 0.2;
                float alpha = vAlpha * (1.0 - smoothstep(edgeStart, 0.5, dist));
                
                // 添加中心亮点
                float highlight = 1.0 - smoothstep(0.0, 0.3, dist);
                vec3 finalColor = vColor * (1.0 + highlight * 0.5);
                
                gl_FragColor = vec4(finalColor * uBrightness, alpha);
            }
        `,transparent:!0,depthWrite:!1,blending:2})}catch(e){throw console.error(`❌ 自定义Shader材质创建失败:`,e),e}}async createGPUParticleSystem(){this.particles&&=(this.scene.remove(this.particles),this.particles.geometry&&this.particles.geometry.dispose(),this.particles.material&&this.particles.material.dispose(),null);let e=this.estimateMemoryUsage();e>100&&(console.warn(`⚠️ 粒子数量可能过多 (${e.toFixed(1)}MB)，尝试减少...`),this.settings.particleCount=Math.floor(this.settings.particleCount*.7));try{let e=new u,t=new Float32Array(this.settings.particleCount*3),n=new Float32Array(this.settings.particleCount*3),r=new Float32Array(this.settings.particleCount*3),a=new Float32Array(this.settings.particleCount*3);for(let e=0;e<this.settings.particleCount;e++){let i=e*3,o=(Math.random()-.5)*500,s=(Math.random()-.5)*500,c=(Math.random()-.5)*500;t[i]=o,t[i+1]=s,t[i+2]=c,n[i]=o,n[i+1]=s,n[i+2]=c,r[i]=o,r[i+1]=s,r[i+2]=c,a[i]=.5+Math.random()*.5,a[i+1]=Math.random()*2,a[i+2]=Math.random()}e.setAttribute(`position`,new s(t,3)),e.setAttribute(`originalPosition`,new s(n,3)),e.setAttribute(`targetPosition`,new s(r,3)),e.setAttribute(`particleState`,new s(a,3));let o=this.createGPUParticleMaterial();this.particles=new i(e,o),this.scene.add(this.particles)}catch(e){console.error(`❌ GPU粒子系统创建失败:`,e),await this.createFallbackParticleSystem()}}estimateMemoryUsage(){return this.settings.particleCount*12*4/(1024*1024)}async createFallbackParticleSystem(){console.warn(`🔄 创建简化版粒子系统...`),this.settings.particleCount=Math.min(this.settings.particleCount,2e3);let e=new u,t=new Float32Array(this.settings.particleCount*3),r=new Float32Array(this.settings.particleCount*3),a=new Float32Array(this.settings.particleCount*3),o=new Float32Array(this.settings.particleCount*3);for(let e=0;e<this.settings.particleCount;e++){let n=e*3,i=(Math.random()-.5)*200,s=(Math.random()-.5)*200,c=(Math.random()-.5)*200;t[n]=i,t[n+1]=s,t[n+2]=c,r[n]=i,r[n+1]=s,r[n+2]=c,a[n]=i,a[n+1]=s,a[n+2]=c,o[n]=.5+Math.random()*.5,o[n+1]=Math.random()*2,o[n+2]=Math.random()}e.setAttribute(`position`,new s(t,3)),e.setAttribute(`originalPosition`,new s(r,3)),e.setAttribute(`targetPosition`,new s(a,3)),e.setAttribute(`particleState`,new s(o,3));try{let t=this.createGPUParticleMaterial();console.log(`✅ 简化版粒子系统使用 ShaderMaterial`),this.particles=new i(e,t)}catch(t){console.warn(`⚠️ ShaderMaterial 回退失败，使用简单 PointsMaterial:`,t);let r=this.createParticleTexture(`circle`),a=new n({size:this.settings.particleSize,color:16777215,transparent:!0,opacity:.8,map:r,depthWrite:!1,blending:2});this.particles=new i(e,a)}this.scene.add(this.particles),console.log(`✅ 简化版粒子系统创建完成: ${this.settings.particleCount}个粒子`)}async sampleText(e,t=1,n=0){return n>5?this.createFallbackCoordinates(`lyrics`):new Promise((r,i)=>{try{let a=this.sampleContext;if(!a){i(Error(`Canvas上下文不可用`));return}let o=this.settings.graphicPosition===`fullscreen`,s=e.length;if(o)this.sampleCanvas.width=Math.max(400,s*30),this.sampleCanvas.height=Math.max(200,Math.ceil(s/15)*80);else{let e=Math.min(800,Math.max(300,s*20)),t=Math.max(150,Math.ceil(s/10)*50);this.sampleCanvas.width=e,this.sampleCanvas.height=t}let c=o?80:40,l=this.calculateOptimalFontSize(e,c,t);a.font=`bold ${l}px "Microsoft YaHei", "PingFang SC", sans-serif`,a.fillStyle=`white`,a.textAlign=`center`,a.textBaseline=`middle`,a.textRendering=`optimizeLegibility`,a.imageSmoothingEnabled=!0,a.imageSmoothingQuality=`high`,a.clearRect(0,0,this.sampleCanvas.width,this.sampleCanvas.height);let u=this.intelligentWordSplit(e),d=this.sampleCanvas.width*.9,f=l*1.5,p=[],m=``,h=0;a.font=`bold ${l}px "Microsoft YaHei", "PingFang SC", sans-serif`,a.textRendering=`optimizeLegibility`,a.imageSmoothingEnabled=!0,a.imageSmoothingQuality=`high`;for(let o of u){let s=a.measureText(o).width;if(s>d&&l>10)return this.sampleText(e,t*.85,n+1).then(r).catch(i);h+s>d&&m!==``?(p.push(m.trim()),m=o,h=s):(m+=o,h+=s)}m!==``&&p.push(m.trim());let g=Math.floor(this.sampleCanvas.height*.85/f);if(p.length>g&&l>10)return this.sampleText(e,t*.9,n+1).then(r).catch(i);let _=p.length*f,v=(this.sampleCanvas.height-_)/2+f/2;p.forEach((e,t)=>{a.strokeStyle=`black`,a.lineWidth=Math.max(1,Math.floor(l/20)),a.strokeText(e,this.sampleCanvas.width/2,v+t*f),a.fillText(e,this.sampleCanvas.width/2,v+t*f)});let y=this.advancedTextSampling(this.sampleCanvas,l);if(y.length<100&&l>12)return this.sampleText(e,t*1.2,n+1).then(r).catch(i);r(y)}catch(e){i(e)}})}calculateOptimalFontSize(e,t,n){let r=e.length,i=this.calculateTextComplexity(e),a=Math.max(.5,Math.min(1.5,50/Math.sqrt(r+1))),o=Math.max(.7,Math.min(1.3,1/Math.sqrt(i+.1))),s=t*a*o*n;return s=Math.max(12,Math.min(t*1.5,s)),Math.round(s)}calculateTextComplexity(e){let t=0;for(let n=0;n<e.length;n++){let r=e[n].charCodeAt(0);r>=19968&&r<=40959?t+=2:r>=65&&r<=90||r>=97&&r<=122||r>=48&&r<=57?t+=1:t+=.5}return t}advancedTextSampling(e,t){let n=this.sampleContext.getImageData(0,0,e.width,e.height),r=n.data,i=[],a=this.createDensityMap(n),o=Math.max(.8,Math.min(.9,6/Math.sqrt(t)));for(let t=0;t<e.height;t+=o)for(let n=0;n<e.width;n+=o)if(r[(Math.floor(t)*e.width+Math.floor(n))*4+3]>128){let r=this.getDensityAt(a,n,t,e.width),o=Math.min(1,.8+r*.6),s=Math.min(1,o*2.2);if(Math.random()<s){let a=this.calculatePosition(n,t,e.width,e.height,!0);i.push({x:a.x,y:a.y,z:0,density:r})}if(Math.random()<.8){let a=this.calculatePosition(n+(Math.random()-.5)*2,t+(Math.random()-.5)*2,e.width,e.height,!0);i.push({x:a.x,y:a.y,z:0,density:r})}}let s=this.sampleEdges(n,e.width,e.height);i.push(...s);let c=this.sampleIntersections(n,e.width,e.height);if(i.push(...c),i.length<100){let t=this.supplementarySampling(n,e.width,e.height);i.push(...t)}return i}createDensityMap(e){let t=e.width,n=e.height,r=e.data,i=new Float32Array(t*n);for(let e=0;e<n;e++)for(let a=0;a<t;a++){let o=e*t+a;if(r[o*4+3]>128){let s=0,c=0;for(let i=-3;i<=3;i++)for(let o=-3;o<=3;o++){let l=a+o,u=e+i;l>=0&&l<t&&u>=0&&u<n&&(r[(u*t+l)*4+3]>128&&s++,c++)}i[o]=s/c}else i[o]=0}return i}getDensityAt(e,t,n,r){let i=Math.floor(t),a=Math.floor(n)*r+i;return a>=0&&a<e.length?e[a]:0}sampleEdges(e,t,n){let r=[],i=e.data;for(let e=0;e<n;e+=2)for(let a=0;a<t;a+=2)if(i[(e*t+a)*4+3]>128){let o=!1;for(let r=-1;r<=1;r++){for(let s=-1;s<=1;s++){if(s===0&&r===0)continue;let c=a+s,l=e+r;if(c>=0&&c<t&&l>=0&&l<n){if(i[(l*t+c)*4+3]<=128){o=!0;break}}else o=!0}if(o)break}if(o){let i=this.calculatePosition(a,e,t,n,!0);r.push({x:i.x,y:i.y,z:0,density:1})}}return r}sampleIntersections(e,t,n){let r=[],i=e.data;for(let e=0;e<n;e+=3)for(let a=0;a<t;a+=3)if(i[(e*t+a)*4+3]>128){let o=0,s=0;for(let n=-2;n<=2;n++){let r=a+n;r>=0&&r<t&&i[(e*t+r)*4+3]>128&&o++}for(let r=-2;r<=2;r++){let o=e+r;o>=0&&o<n&&i[(o*t+a)*4+3]>128&&s++}if(o>=3&&s>=3){let i=this.calculatePosition(a,e,t,n,!0);r.push({x:i.x,y:i.y,z:0,density:1})}}return r}supplementarySampling(e,t,n){let r=[],i=e.data,a=0;for(;r.length<500&&a<5e3;){a++;let e=Math.random()*t,o=Math.random()*n,s=Math.floor(e);if(i[(Math.floor(o)*t+s)*4+3]>128){let i=this.calculatePosition(e,o,t,n,!0);r.push({x:i.x,y:i.y,z:0,density:.5})}}return r}intelligentWordSplit(e){let t=[],n=``;for(let r=0;r<e.length;r++){let i=e[r],a=/[\u4e00-\u9fff]/.test(i),o=/[\u3040-\u309F\u30A0-\u30FF]/.test(i),s=/[\uAC00-\uD7AF]/.test(i),c=/[a-zA-Z]/.test(i),l=/[0-9]/.test(i);if(a||o||s)n&&=(t.push(n),``),t.push(i);else if(c||l){let a=r>0?e[r-1]:``,o=/[a-zA-Z]/.test(a),s=/[0-9]/.test(a);c&&o||l&&s?n+=i:(n&&t.push(n),n=i)}else n&&=(t.push(n),``),t.push(i)}return n&&t.push(n),t.filter(e=>e.trim()!==``)}calculatePosition(e,t,n,r,i=!1){let a=this.settings.textScale,o=0,s=0,c=this.positionOptions[this.settings.graphicPosition];if(c&&(o=window.innerWidth*c.offsetX,s=window.innerHeight*c.offsetY),this.settings.graphicPosition===`fullscreen`&&!i){let e=window.innerWidth/window.innerHeight;a=n/r>e?window.innerWidth/n*.9:window.innerHeight/r*.9,o=0,s=0}return{x:(e-n/2)*a+o,y:-(t-r/2)*a+s}}createFallbackCoordinates(e){let t=[],n=1e3;if(e===`lyrics`)for(let e=0;e<n;e++){let r=e/n*Math.PI*2,i=16*Math.sin(r)**3,a=13*Math.cos(r)-5*Math.cos(2*r)-2*Math.cos(3*r)-Math.cos(4*r);t.push({x:i*5,y:a*5,z:0,density:.8})}else for(let e=0;e<n;e++){let r=e/n*Math.PI*2,i=50+20*Math.sin(r*5);t.push({x:Math.cos(r)*i,y:Math.sin(r)*i,z:0,density:.7})}return t}createParticleTexture(e){let t=document.createElement(`canvas`),n=t.getContext(`2d`);switch(t.width=64,t.height=64,n.clearRect(0,0,64,64),e){case`circle`:n.beginPath(),n.arc(64/2,64/2,64/2,0,Math.PI*2),n.fillStyle=`white`,n.fill();break;case`square`:n.fillStyle=`white`,n.fillRect(0,0,64,64);break;case`triangle`:n.beginPath(),n.moveTo(64/2,0),n.lineTo(64,64),n.lineTo(0,64),n.closePath(),n.fillStyle=`white`,n.fill();break;case`star`:n.beginPath();for(let e=0;e<5;e++){let t=e*Math.PI*2/5,r=64/2+Math.cos(t)*64/2,i=64/2+Math.sin(t)*64/2;e===0?n.moveTo(r,i):n.lineTo(r,i);let a=(e+.5)*Math.PI*2/5,o=64/2+Math.cos(a)*64/4,s=64/2+Math.sin(a)*64/4;n.lineTo(o,s)}n.closePath(),n.fillStyle=`white`,n.fill();break}let r=new o(t);return r.needsUpdate=!0,r}updateParticleTargets(e){if(!this.particles||!e||e.length===0){console.warn(`⚠️ 无法更新粒子目标: 粒子系统或坐标为空`);return}this.animTime=0;let t=this.particles.geometry,n=t.attributes.targetPosition.array,r=Math.floor(this.settings.particleCount/e.length),i=this.settings.particleCount%e.length,a=0,o=[...e].sort((e,t)=>(t.density||1)-(e.density||1));for(let e=0;e<o.length;e++){let t=o[e],s=t.density||1,c=r;e<i&&c++;for(let e=0;e<c&&a<this.settings.particleCount;e++){let e=a*3,r=Math.min(.4,Math.sqrt(s)*.4),i=(Math.random()-.5)*r,o=(Math.random()-.5)*r,c=t.x+i,l=t.y+o;n[e]=c,n[e+1]=l,n[e+2]=t.z||0,a++}}if(a<this.settings.particleCount){let t=this.settings.particleCount-a;for(let r=0;r<t;r++){let t=(a+r)*3,i=e[r%e.length];n[t]=i.x,n[t+1]=i.y,n[t+2]=i.z||0}}t.attributes.targetPosition.needsUpdate=!0;let s=t.attributes.originalPosition.array;for(let e=0;e<this.settings.particleCount;e++){let t=e*3;s[t]=n[t],s[t+1]=n[t+1],s[t+2]=n[t+2]}t.attributes.originalPosition.needsUpdate=!0}updateAnimationTargets(){let e=this.lyricsCoords;(!e||e.length===0)&&(console.warn(`⚠️ 坐标为空，使用后备坐标`),e=this.createFallbackCoordinates(`lyrics`)),this.updateParticleTargets(e)}render(){if(!this.renderer||this._disposed)return;let e=performance.now()*.001,t=Math.min(.033,e-this.lastTime);if(this.lastTime=e,this.detectMusicPause(),this.animTime+=t,this.particles&&this.particles.material){let e=this.particles.material;e.uniforms.time.value=this.animTime,e.uniforms.transitionSpeed.value=this.settings.transitionSpeed*this.transitionMultiplier,e.uniforms.particleJitter.value=this.settings.particleJitter,e.uniforms.size.value=this.settings.particleSize*(1+(this.beat?this.beat.kick*.3:0)),e.uniforms.bass.value=this.bass,e.uniforms.mid.value=this.mid,e.uniforms.high.value=this.high,e.uniforms.uBrightness.value=this.settings.particleBrightness,e.uniforms.motion.value=this.motion,e.uniforms.variation.value=this.variation,e.uniforms.brightness.value=this.brightness,e.uniforms.percussive.value=this.percussive,e.uniforms.uSmoothness.value=.3+this.smoothness*.7}this.beat&&this.applyBeatEffects(),this.settings.rotationEnabled&&this.particles&&(this.particles.rotation.y+=.002*(1+this.bass*.5)),this.updateAudioEffects(),this.settings.enableBloom&&this.composer?this.composer.render():this.renderer.render(this.scene,this.camera)}applyBeatEffects(){let e=this.beat;if(e){if(e.snare>.5&&this.bloomPass){let t=this.settings.bloomStrength*(1+e.snare*.8);this.bloomPass.strength+=(t-this.bloomPass.strength)*.5}if(e.hihat>.5&&this.particles){let t=this.settings.particleJitter*(1+e.hihat*.5);this.particles.material.uniforms.particleJitter.value=t}this.isDownbeat&&this.particles&&(this.particles.material.uniforms.uBrightness.value=this.settings.particleBrightness*1.3)}}updateAudioEffects(){if(this.bloomPass){let e=(this.bass+this.mid+this.high)/3,t=this.settings.bloomStrength*(1+e*.5),n=this.bloomPass.strength;this.bloomPass.strength+=(t-n)*.1,this.bloomPass.threshold=this.settings.bloomThreshold*(1-e*.3)}}onWindowResize(){let e=window.innerWidth,t=window.innerHeight;this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t),this.composer&&this.composer.setSize(e,t),this.settings.lyricsText&&this.updateWithLyrics(this.settings.lyricsText,!0)}setupGUI(){this.createGUIContainer();let t={rebuildParticles:async()=>{await this.createGPUParticleSystem(),this.updateAnimationTargets()},testLyrics:()=>{let e=[`音乐让生活更美好`,`Hello World! 你好世界`,`粒子文字效果优化版`,`Three.js + Shader = 💖`],t=e[Math.floor(Math.random()*e.length)];this.updateWithLyrics(t)},resetParams:()=>{Object.assign(this.settings,this.DEFAULTS),this.resetState(),this.bloomPass&&(this.bloomPass.strength=this.settings.bloomStrength,this.bloomPass.radius=this.settings.bloomRadius,this.bloomPass.threshold=this.settings.bloomThreshold);let e=t=>{t.controllers.forEach(e=>e.updateDisplay()),t.folders&&Object.values(t.folders).forEach(t=>e(t))};e(this.gui),this.camera.position.set(this.DEFAULTS.cameraPosition.x,this.DEFAULTS.cameraPosition.y,this.DEFAULTS.cameraPosition.z),this.createGPUParticleSystem().then(()=>{this.updateAnimationTargets()})}};this.gui=new e({title:`文字幻形`,container:this.guiContainer});let n=this.gui.addFolder(`粒子设置`);n.add(this.settings,`particleCount`,1e3,3e4,1e3).name(`粒子数量`).onChange(async()=>{await this.createGPUParticleSystem(),this.updateAnimationTargets()}),n.add(this.settings,`particleSize`,.1,3,.1).name(`粒子大小`).onChange(e=>{this.particles&&(this.particles.material.uniforms.size.value=e)}),n.add(this.settings,`transitionSpeed`,.01,2,.01).name(`过渡速度`),n.add(this.settings,`particleJitter`,0,1,.05).name(`粒子抖动`),n.add(t,`rebuildParticles`).name(`重建粒子系统`),n.open();let r=this.gui.addFolder(`动画设置`);r.add(this.settings,`rotationEnabled`).name(`旋转效果`),r.open();let i=this.gui.addFolder(`显示设置`);i.add(this.settings,`textScale`,.1,1.5,.1).name(`文字大小`).onChange(()=>{this.settings.lyricsText&&this.updateWithLyrics(this.settings.lyricsText,!0)}),i.add(this.settings,`particleBrightness`,.1,3,.05).name(`粒子亮度`);let a=i.addFolder(`Bloom效果`);a.add(this.settings,`enableBloom`).name(`启用Bloom`),a.add(this.settings,`bloomStrength`,0,2,.1).name(`bloom强度`).onChange(e=>{this.bloomPass&&(this.bloomPass.strength=e)}),a.add(this.settings,`bloomRadius`,0,2,.1).name(`bloom半径`).onChange(e=>{this.bloomPass&&(this.bloomPass.radius=e)}),a.add(this.settings,`bloomThreshold`,0,1,.05).name(`bloom阈值`).onChange(e=>{this.bloomPass&&(this.bloomPass.threshold=e)}),i.add(this.settings,`graphicPosition`,{居中:`center`,左上角:`top-left`,右上角:`top-right`,左下角:`bottom-left`,右下角:`bottom-right`,全屏:`fullscreen`}).name(`文字位置`).onChange(()=>{this.settings.lyricsText&&this.updateWithLyrics(this.settings.lyricsText,!0)}),i.add(this.settings,`colorMode`,{基础七彩:0,流动七彩:1,粒子七彩:2,脉冲七彩:3,分层七彩:4,旋转七彩:5,爆炸七彩:6}).name(`七彩效果模式`).onChange(e=>{this.particles&&this.particles.material&&(this.particles.material.uniforms.colorMode.value=e)}),i.open(),this.gui.add(t,`resetParams`).name(`重置参数`),this.gui.hide()}createGUIContainer(){this.guiContainer=v(`Animation12-gui-container`),y(`Animation12-gui-container`),document.body.appendChild(this.guiContainer)}setupSettingsButton(){this.settingsButton=g(`Animation12-settings-button`),this.settingsButton.addEventListener(`click`,()=>{this.guiVisible=!this.guiVisible,this.guiVisible?this.gui.show():this.gui.hide()}),document.body.appendChild(this.settingsButton)}resetState(){this.motion=0,this.variation=0,this.brightness=0,this.percussive=0,this.smoothness=0,this.bass=0,this.mid=0,this.high=0,this.audioFreq=0,this.beat=null,this.hasAudioData=!1,this.isPlaying=!0,this.isDownbeat=!1,this.isMusicPaused=!1}updateWithAudioData(e,t){if(this._disposed)return;if(!e||!e.audioFeature){this.hasAudioData=!1;return}this.hasAudioData=!0;let n=e.audioFeature.animation,r=.3;this.bass=this.bass*(1-r)+(n.bass||0)*r,this.mid=this.mid*(1-r)+(n.mid||0)*r,this.high=this.high*(1-r)+(n.high||0)*r,n.kick!==void 0&&(this.beat={kick:n.kick,snare:n.snare,hihat:n.hihat,pulse:n.beat===void 0?0:n.beat}),this.motion=n.motion||0,this.variation=n.variation||0,this.brightness=n.brightness||0,this.percussive=n.percussive||0,this.smoothness=n.smoothness||0,this.isDownbeat=n.isDownbeat||!1,this.isPlaying=e.isPlaying===void 0?!0:e.isPlaying}detectMusicPause(){this.hasAudioData&&(this.isPlaying?this.isMusicPaused&&(this.isMusicPaused=!1,this.settings.lyricsText&&this.settings.lyricsText.trim()!==``?this.updateWithLyrics(this.settings.lyricsText):(this.settings.lyricsText=``,this.lyricsCoords=this.createFallbackCoordinates(`lyrics`),this.updateAnimationTargets())):this.isMusicPaused||(this.isMusicPaused=!0,this.settings.lyricsText=``,this.lyricsCoords=this.createFallbackCoordinates(`lyrics`),this.updateAnimationTargets()))}updateSettings(e){Object.assign(this.settings,e),e.textScale!==void 0&&this.settings.lyricsText&&this.updateWithLyrics(this.settings.lyricsText,!0),e.graphicPosition!==void 0&&this.settings.lyricsText&&this.updateWithLyrics(this.settings.lyricsText,!0),e.particleCount!==void 0&&this.createGPUParticleSystem().then(()=>{this.updateAnimationTargets()}),e.particleSize!==void 0&&this.particles&&(this.particles.material.uniforms.size.value=e.particleSize),e.colorMode!==void 0&&this.particles&&this.particles.material&&(this.particles.material.uniforms.colorMode.value=e.colorMode),e.bloomStrength!==void 0&&this.bloomPass&&(this.bloomPass.strength=e.bloomStrength),e.bloomRadius!==void 0&&this.bloomPass&&(this.bloomPass.radius=e.bloomRadius),e.bloomThreshold!==void 0&&this.bloomPass&&(this.bloomPass.threshold=e.bloomThreshold),e.lyricsText!==void 0&&this.updateWithLyrics(e.lyricsText)}async updateWithLyrics(e,t=!1){if(this._disposed)return;if(!e||e.trim()===``){this.transitionMultiplier=1,this.settings.lyricsText=``,this.lyricsCoords=this.createFallbackCoordinates(`lyrics`),this.updateAnimationTargets();return}let n=this.wrapLyrics(e);if(!t&&n===this.settings.lyricsText)return;let r=++this._lyricsRequestId;this.transitionMultiplier=10,this.settings.lyricsText=n;try{if(this.diffuseParticles(),await new Promise(e=>setTimeout(e,1200)),this._disposed||r!==this._lyricsRequestId)return;let e=await this.sampleText(this.settings.lyricsText,this.settings.textScale,0);if(this._disposed||r!==this._lyricsRequestId)return;this.lyricsCoords=e,this.updateAnimationTargets()}catch(e){console.error(`❌ 歌词采样失败:`,e),this.lyricsCoords=this.createFallbackCoordinates(`lyrics`),this.updateAnimationTargets()}}diffuseParticles(){if(!this.particles||!this.particles.geometry)return;let e=this.particles.geometry,t=e.attributes.targetPosition.array;for(let e=0;e<this.settings.particleCount;e++){let n=e*3,r=Math.random()*Math.PI,i=Math.random()*Math.PI*2,a=50+Math.random()*200;t[n]=Math.sin(r)*Math.cos(i)*a,t[n+1]=Math.sin(r)*Math.sin(i)*a,t[n+2]=Math.cos(r)*a}e.attributes.targetPosition.needsUpdate=!0}wrapLyrics(e,t=15){if(!e)return``;let n=[],r=``,i=this.intelligentWordSplit(e);for(let e of i)r.length+e.length>t&&r!==``?(n.push(r),r=e):r+=e;return r&&n.push(r),n.join(`
`)}dispose(){if(!this._disposed){if(this._disposed=!0,this._initTimeoutId&&=(clearTimeout(this._initTimeoutId),null),this.lyricsListener&&this.lyricsManager?.musicPlayer?.lyricsService){let e=this.lyricsManager.musicPlayer.lyricsService;e.removeEventListener&&e.removeEventListener(`lyricsUpdate`,this.lyricsListener)}this._lyricsPatched&&this.originalUpdateLyricsDisplay&&this.lyricsManager&&(this.lyricsManager.updateLyricsDisplay=this.originalUpdateLyricsDisplay),this.particles&&(this.scene.remove(this.particles),this.particles.geometry&&this.particles.geometry.dispose(),this.particles.material&&this.particles.material.dispose()),this.composer&&this.composer.dispose(),this.bloomPass&&this.bloomPass.dispose(),this.renderer&&this.renderer.dispose(),_(this.settingsButton,this.guiContainer,this.gui),this.lyricsManager=null}}setEffectMode(e){return console.log(`Animation12 当前效果模式：${e}`),!0}setLyricsManager(e){this.lyricsManager=e}initLyricsIntegration(){this._initTimeoutId=setTimeout(()=>{if(this._initTimeoutId=null,!this._disposed)if(this.lyricsManager?.musicPlayer?.lyricsService){let e=this.lyricsManager.musicPlayer.lyricsService;this.lyricsListener=e=>{e&&e.current&&e.current.text&&this.updateWithLyrics(e.current.text)},e.addEventListener?e.addEventListener(`lyricsUpdate`,this.lyricsListener):(this.originalUpdateLyricsDisplay=this.lyricsManager.updateLyricsDisplay,this.lyricsManager.updateLyricsDisplay=e=>{this.originalUpdateLyricsDisplay.call(this.lyricsManager,e),e&&e.current&&e.current.text&&this.updateWithLyrics(e.current.text)},this._lyricsPatched=!0)}else console.warn(`⚠️ 系统歌词管理器未初始化，歌词集成将无法工作`)},1e3)}};export{b as default};