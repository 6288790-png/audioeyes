import{a as e}from"./lil-gui.esm-jlbWO7FJ.js";import{Bt as t,Jn as n,Wt as r,_t as i,ar as a,g as o,l as s,qn as c,r as l,u,wr as d,yt as f}from"./three.module-CgISyWQV.js";import{n as p,r as m,t as h}from"./OutputPass-D9GSoAm2.js";import{t as g}from"./UnrealBloomPass-1z79deN3.js";import{i as _,n as v,r as y,t as b}from"./GUIHelper-DspWBXk2.js";import{t as x}from"./OrbitControls-DVnblHSy.js";var S=class{constructor(e,t={}){this.canvas=e,this.TRAIL_COUNT=5e3,this.TRAIL_LENGTH=20;let n={particleSize:3,morphDrive:1,morphAmount:1,bloomStrength:2,bloomRadius:.15,bloomThreshold:.8,bloomBeatResponse:.1,audioBassImpact:1,audioMidImpact:1,audioHighImpact:1,autoRotate:!1,flowStrength:.12,outlineTight:.55,shapeClarity:.6,particleCount:15e4,trailGlow:.8,kickImpact:.2,downbeatImpact:1,particleBrightness:1,cameraPosition:{x:0,y:16.19,z:1.08},color:`#ffd43b`,hueVariation:.5,saturationBoost:1.8};this.settings={...n,...t},this.defaultSettings=n,this.scene=null,this.camera=null,this.renderer=null,this.controls=null,this.composer=null,this.bloomPass=null,this.particleSystem=null,this.particleMaterial=null,this.particleGeometry=null,this.trailMesh=null,this.trailMaterial3D=null,this.bass=0,this.mid=0,this.high=0,this.kickDetected=0,this.snareDetected=0,this.hihatDetected=0,this.downbeatDetected=0,this.motion=0,this.variation=0,this.energy=0,this.percussive=0,this.smoothness=0,this.hasAudioData=!1,this.morphValue=0,this.autoMin=.15,this.autoMax=.85,this.morphSlow=.5,this.prevFast=.5,this.morphTransient=0,this.prevKickDetected=0,this.hue=.13,this.baseHue=this.hexToBaseHue(this.settings.color),this.elapsedTime=0,this.lastFrameTime=0,this.gui=null,this.guiContainer=null,this.guiVisible=!1,this.settingsButton=null,this.isRebuilding=!1,this.currentParticleCount=this.settings.particleCount,this.init().catch(e=>{console.error(`❌ Animation23 初始化失败:`,e)})}async init(){try{return await this.setupThreeJS(),this.createParticles(this.settings.particleCount),this.createRibbonTrail(),this.setupPostProcessing(),this.setupGUI(),this.setupSettingsButton(),console.log(`✅ Animation23 初始化成功`),!0}catch(e){throw console.error(`❌ Animation23 初始化失败:`,e),e}}async setupThreeJS(){this.scene=new c,this.camera=new t(45,window.innerWidth/window.innerHeight,.1,1e3),this.camera.position.set(this.settings.cameraPosition.x,this.settings.cameraPosition.y,this.settings.cameraPosition.z),this.camera.lookAt(0,0,0),this.renderer=new l({canvas:this.canvas,antialias:!0,alpha:!0,powerPreference:`high-performance`,toneMapping:4,toneMappingExposure:1}),this.renderer.outputColorSpace=i,this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.setClearColor(0,0),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.canvas.style.backgroundColor=`transparent`,this.canvas.style.zIndex=`1`,this.controls=new x(this.camera,this.canvas),this.controls.enableDamping=!0,this.controls.autoRotate=!1,this.controls.target.set(0,0,0),this.controls.minDistance=1.5,this.controls.maxDistance=25,this.controls.enablePan=!0,this.controls.mouseButtons={LEFT:f.ROTATE,MIDDLE:f.DOLLY,RIGHT:f.PAN},this.controls.touches={ONE:a.ROTATE_PAN,TWO:a.DOLLY_PAN}}createParticles(e){this.particleSystem&&(this.scene.remove(this.particleSystem),this.particleGeometry&&this.particleGeometry.dispose(),this.particleMaterial&&this.particleMaterial.dispose());let t=Math.floor(e);this.currentParticleCount=t;let i=new u;this.particleGeometry=i;let a=new Float32Array(t*3),c=new Float32Array(t),l=new Float32Array(t),d=new Float32Array(t*3),f=new Float32Array(t*3),p=new Float32Array(t),m=new Float32Array(t);for(let e=0;e<t;e++){let t=2.8+Math.random()*.7,n=Math.random()*Math.PI*2,r=Math.acos(2*Math.random()-1),i=Math.sin(r)*Math.cos(n)*t,o=Math.sin(r)*Math.sin(n)*t*.7,s=Math.cos(r)*t;a[e*3+0]=i,a[e*3+1]=o,a[e*3+2]=s,d[e*3+0]=i,d[e*3+1]=o,d[e*3+2]=s,c[e]=Math.random(),l[e]=.15+Math.random()*.25,f[e*3+0]=(Math.random()-.5)*.02,f[e*3+1]=(Math.random()-.5)*.02,f[e*3+2]=(Math.random()-.5)*.02,p[e]=Math.random(),m[e]=Math.random()*100}i.setAttribute(`position`,new s(a,3)),i.setAttribute(`seed`,new s(c,1)),i.setAttribute(`size`,new s(l,1)),i.setAttribute(`basePos`,new s(d,3)),i.setAttribute(`velocity`,new s(f,3)),i.setAttribute(`lifePhase`,new s(p,1)),i.setAttribute(`flowSeed`,new s(m,1)),this.particleMaterial=new n({transparent:!0,depthWrite:!1,blending:2,uniforms:{time:{value:0},particleSize:{value:this.settings.particleSize},morph:{value:0},morphAmount:{value:this.settings.morphAmount},bass:{value:0},mid:{value:0},high:{value:0},flowStrength:{value:this.settings.flowStrength},outlineTight:{value:this.settings.outlineTight},shapeClarity:{value:this.settings.shapeClarity},kickDetected:{value:0},snareDetected:{value:0},hihatDetected:{value:0},motion:{value:0},brightness:{value:this.settings.particleBrightness},uColor:{value:new o(this.settings.color)},uHueShift:{value:0},uColorIntensity:{value:1},uBrightnessFeat:{value:0},uDownbeat:{value:0},uTime:{value:0},uVariation:{value:0}},vertexShader:`
                uniform float time;
                uniform float particleSize;
                uniform float morph;
                uniform float morphAmount;
                uniform float bass;
                uniform float mid;
                uniform float high;
                uniform float flowStrength;
                uniform float outlineTight;
                uniform float shapeClarity;
                uniform float kickDetected;
                uniform float snareDetected;
                uniform float hihatDetected;
                uniform float motion;

                attribute float seed;
                attribute float size;
                attribute vec3 basePos;
                attribute vec3 velocity;
                attribute float lifePhase;
                attribute float flowSeed;

                varying float vAlpha;
                varying float vEnergy;

                float hash(vec3 p) {
                    return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453);
                }

                float noise(vec3 p) {
                    vec3 i = floor(p);
                    vec3 f = fract(p);
                    f = f * f * (3.0 - 2.0 * f);
                    return mix(
                        mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
                            mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
                        mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                            mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
                        f.z
                    );
                }

                vec3 curlNoise(vec3 p) {
                    float e = 0.1;
                    float n1 = noise(p + vec3(e,0,0));
                    float n2 = noise(p - vec3(e,0,0));
                    float n3 = noise(p + vec3(0,e,0));
                    float n4 = noise(p - vec3(0,e,0));
                    float n5 = noise(p + vec3(0,0,e));
                    float n6 = noise(p - vec3(0,0,e));
                    return normalize(vec3(n2 - n1, n4 - n3, n6 - n5) + 0.001);
                }

                vec3 flowField(vec3 p, float t, float fseed) {
                    vec3 f1 = curlNoise(p * 0.4 + t * 0.06 + fseed);
                    vec3 f2 = curlNoise(p * 0.8 + t * 0.10 + fseed * 2.0);
                    vec3 f3 = curlNoise(p * 1.6 + t * 0.14 + fseed * 4.0);
                    return normalize(f1 * 0.5 + f2 * 0.3 + f3 * 0.2);
                }

                void main() {
                    vec3 p = basePos;
                    float id = seed;
                    float lf = lifePhase;

                    float life = fract(time * 0.08 + lf);
                    float lifeFade = sin(life * 3.14159);
                    lifeFade = 0.3 + lifeFade * 0.7;

                    float radius = length(p);
                    // 壳层压缩：生成时壳层为 2.8~3.5（中面 3.15），清晰度越高越贴近中面，形状轮廓越锐利
                    radius = 3.15 + (radius - 3.15) * (1.0 - shapeClarity * 0.8);
                    float theta = atan(p.z, p.x);
                    float phi = acos(clamp(p.y / (radius + 0.001), -1.0, 1.0));

                    float petalCount = 6.0;
                    float petalAngle = theta * petalCount;
                    float petalWave = abs(cos(petalAngle * 0.5));
                    float petalShape = 1.0 + 1.3 * petalWave;

                    vec3 flowerPos;
                    float newRadius = radius * petalShape;
                    flowerPos.x = newRadius * sin(phi) * cos(theta);
                    flowerPos.y = newRadius * cos(phi) * 0.8;
                    flowerPos.z = newRadius * sin(phi) * sin(theta);

                    float spiralRadius = radius * 0.6;
                    float spiralAngle = radius * 2.5;
                    vec3 spiralPos;
                    spiralPos.x = spiralRadius * cos(spiralAngle + theta * 2.0);
                    spiralPos.y = radius * 0.8 * sin(spiralAngle * 0.8);
                    spiralPos.z = spiralRadius * sin(spiralAngle + theta * 2.0);

                    float starArms = 5.0;
                    float starR = radius * (0.2 + 1.8 * abs(sin(theta * starArms)));
                    vec3 starPos;
                    starPos.x = starR * sin(phi) * cos(theta);
                    starPos.y = starR * cos(phi) * 0.5;
                    starPos.z = starR * sin(phi) * sin(theta);

                    float torusMajor = 3.0;
                    float torusMinor = 1.0 + radius * 0.1;
                    float torusTheta = theta;
                    float torusPhi = phi * 2.0 + 1.57;
                    vec3 donutPos;
                    donutPos.x = (torusMajor + torusMinor * cos(torusPhi)) * cos(torusTheta);
                    donutPos.y = torusMinor * sin(torusPhi) * 0.7;
                    donutPos.z = (torusMajor + torusMinor * cos(torusPhi)) * sin(torusTheta);

                    float waveR = radius * (0.8 + 0.5 * abs(sin(theta * 3.0 + phi * 2.0)));
                    vec3 wavePos;
                    wavePos.x = waveR * sin(phi) * cos(theta);
                    wavePos.y = waveR * cos(phi) * (0.4 + 0.3 * abs(sin(theta * 4.0)));
                    wavePos.z = waveR * sin(phi) * sin(theta);

                    float m = clamp(morph * morphAmount, 0.0, 1.0);
                    const float S = 1.0 / 6.0;
                    vec3 targetPos;
                    if (m < S) {
                        float t = m / S;
                        targetPos = mix(p, flowerPos, t);
                    } else if (m < S*2.0) {
                        float t = (m - S) / S;
                        targetPos = mix(flowerPos, spiralPos, t);
                    } else if (m < S*3.0) {
                        float t = (m - S*2.0) / S;
                        targetPos = mix(spiralPos, starPos, t);
                    } else if (m < S*4.0) {
                        float t = (m - S*3.0) / S;
                        targetPos = mix(starPos, donutPos, t);
                    } else if (m < S*5.0) {
                        float t = (m - S*4.0) / S;
                        targetPos = mix(donutPos, wavePos, t);
                    } else {
                        float t = (m - S*5.0) / S;
                        targetPos = mix(wavePos, wavePos, t);
                    }

                    vec3 flowDir = flowField(targetPos, time, flowSeed);
                    float flowMag = flowStrength * (0.3 + mid * 0.5 + hihatDetected * 0.3 + motion * 0.4);
                    vec3 flowOffset = flowDir * flowMag * lifeFade;

                    vec3 attractDir = normalize(targetPos + flowOffset + 0.001);
                    float attractStrength = 0.015 * (1.0 + bass * 0.4 + kickDetected * 0.5);
                    vec3 attractOffset = -attractDir * attractStrength;

                    vec3 vel = velocity;
                    float damping = 0.98;
                    vec3 flowVel = flowDir * flowMag * 0.5;
                    vec3 totalVel = (vel * damping + flowVel * 0.1 + attractOffset);

                    // 形状清晰度：把粒子拉回目标形状点位，抵消流场/速度扰动造成的糊感
                    vec3 disturbedPos = targetPos + totalVel * 2.0 + flowOffset * 0.5;
                    vec3 finalPos = mix(disturbedPos, targetPos, shapeClarity);

                    vec3 tangent = normalize(cross(finalPos + 0.001, vec3(0.0, 1.0, 0.0)) + 0.001);
                    float rotStr = 0.004 * (0.3 + mid * 0.4 + snareDetected * 0.2) * (1.0 - shapeClarity * 0.8);
                    finalPos += tangent * rotStr * radius;

                    float breathe = 1.0 + bass * 0.06 + 0.03 * sin(time * 0.8 + id * 100.0);
                    float kickPush = kickDetected * 1.5;
                    finalPos += normalize(finalPos + 0.001) * kickPush * 0.4;
                    finalPos *= breathe;

                    // 轮廓收敛：把粒子径向拉回形状表面，外轮廓聚集不发散
                    // （抵消 kick 膨胀、流场游走、呼吸缩放的径向分量，保留切向流动）
                    float contourR = length(targetPos + 0.001);
                    float finalR = length(finalPos + 0.001);
                    finalPos *= mix(1.0, contourR / finalR, outlineTight);

                    vec4 mvPos = modelViewMatrix * vec4(finalPos, 1.0);

                    float speed = length(totalVel) * 3.0 + 0.1;
                    vEnergy = clamp(speed + high * 0.5 + kickDetected * 0.3, 0.0, 1.0);

                    float lifeSize = 0.7 + lifeFade * 0.3;
                    float kickSize = 1.0 + kickDetected * 0.25;
                    float sizeScale = (1.0 + high * 0.3 + bass * 0.15) * lifeSize * kickSize;
                    gl_PointSize = (size * 20.0 / max(-mvPos.z, 1.0)) * particleSize * sizeScale;

                    gl_Position = projectionMatrix * mvPos;

                    float distFade = clamp(1.0 - length(finalPos) / 10.0, 0.0, 1.0);
                    vAlpha = clamp(distFade * lifeFade * (0.75 + vEnergy * 0.25), 0.0, 0.98);
                }
            `,fragmentShader:`
                uniform float bass;
                uniform float mid;
                uniform float high;
                uniform float kickDetected;
                uniform float snareDetected;
                uniform float hihatDetected;
                uniform float motion;
                uniform float brightness;
                uniform vec3 uColor;
                uniform float uHueShift;
                uniform float uColorIntensity;
                uniform float uBrightnessFeat;
                uniform float uDownbeat;
                uniform float uTime;
                uniform float uVariation;

                varying float vAlpha;
                varying float vEnergy;

                // HSL 转 RGB（Animation7 同款）
                vec3 hsl2rgb(vec3 hsl) {
                    vec3 rgb = clamp(abs(mod(hsl.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
                    return hsl.z + hsl.y * (rgb - 0.5) * (1.0 - abs(2.0 * hsl.z - 1.0));
                }

                // RGB 转 HSL（Animation7 同款）
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
                    vec2 uv = gl_PointCoord - 0.5;
                    float d = length(uv);
                    float core = 1.0 - smoothstep(0.0, 0.5, d);

                    // ---- Animation7 颜色逻辑（严格移植） ----
                    vec3 baseColor = uColor;
                    vec3 hsl = rgb2hsl(baseColor);
                    hsl.x = mod(hsl.x + uHueShift, 1.0);        // 色相偏移
                    hsl.y = min(hsl.y * uColorIntensity, 1.0);  // 饱和度增强
                    hsl.z = mix(hsl.z, hsl.z * 1.5, clamp(uColorIntensity - 1.0, 0.0, 1.0)); // 亮度增强
                    vec3 dynamicColor = hsl2rgb(hsl);

                    dynamicColor *= (1.0 + uBrightnessFeat * 3.0); // brightnessFeat 增强亮度

                    float beatFlash = max(kickDetected, snareDetected) * 0.6 + hihatDetected * 0.3 + uDownbeat * 0.8;
                    dynamicColor *= (1.0 + beatFlash);          // 节拍闪光

                    float featPulse = (motion + uVariation) * 0.3;
                    float pulse = sin(uTime * 10.0 + hsl.x * 10.0) * 0.1 + 1.0 + featPulse;
                    dynamicColor *= pulse;                       // motion + variation 驱动脉冲闪烁

                    dynamicColor *= brightness;                  // 亮度控制

                    // 软圆粒子（替代 Animation7 的纹理采样，保留原 alpha 逻辑）
                    float energy = clamp(vEnergy * 1.2 + high * 0.3 + bass * 0.2, 0.0, 1.0);
                    float alpha = core * vAlpha * (0.7 + energy * 0.3);
                    alpha = clamp(alpha, 0.0, 0.98);

                    gl_FragColor = vec4(dynamicColor * core * 1.5, alpha);
                }
            `}),this.particleSystem=new r(i,this.particleMaterial),this.scene.add(this.particleSystem),this.trailMesh&&(this.scene.remove(this.trailMesh),this.trailMesh.geometry&&this.trailMesh.geometry.dispose(),this.trailMaterial3D&&this.trailMaterial3D.dispose(),this.createRibbonTrail())}createRibbonTrail(){let e=this.TRAIL_LENGTH-1,t=this.TRAIL_COUNT*e*2,i=new Float32Array(t*3),a=new Float32Array(t*3),o=new Float32Array(t),c=new u;c.setAttribute(`position`,new s(i,3)),c.setAttribute(`color`,new s(a,3)),c.setAttribute(`alpha`,new s(o,1));let l=new Float32Array(this.TRAIL_COUNT*this.TRAIL_LENGTH*3);this.trailMaterial3D=new n({transparent:!0,depthWrite:!1,blending:2,uniforms:{bass:{value:0},mid:{value:0},high:{value:0},kickDetected:{value:0},snareDetected:{value:0},hihatDetected:{value:0},trailGlow:{value:this.settings.trailGlow}},vertexShader:`
                uniform float trailGlow;

                attribute vec3 color;
                attribute float alpha;

                varying float vAlpha;
                varying vec3 vColor;

                void main() {
                    vec3 p = position;
                    vec4 mvPos = modelViewMatrix * vec4(p, 1.0);
                    gl_Position = projectionMatrix * mvPos;

                    vColor = color;
                    vAlpha = alpha * (0.4 + trailGlow * 0.6);
                }
            `,fragmentShader:`
                uniform float high;
                uniform float kickDetected;
                uniform float snareDetected;
                uniform float hihatDetected;

                varying float vAlpha;
                varying vec3 vColor;

                void main() {
                    vec2 uv = gl_PointCoord - 0.5;
                    float d = length(uv);
                    float glow = exp(-d * d * 20.0);

                    vec3 color = vColor;
                    color += vec3(0.2, 0.1, 0.4) * kickDetected * 0.5;
                    color += vec3(0.1, 0.3, 0.5) * snareDetected * 0.3;
                    color += vec3(0.3, 0.2, 0.6) * hihatDetected * 0.4;

                    float finalAlpha = glow * vAlpha * (0.5 + high * 0.3 + kickDetected * 0.2);
                    gl_FragColor = vec4(color, finalAlpha);
                }
            `}),this.trailMesh=new r(c,this.trailMaterial3D),this.scene.add(this.trailMesh),this.trailMesh.userData.history=l,this.trailMesh.userData.segmentCount=e}updateRibbonTrail(){if(!this.trailMesh||!this.particleSystem)return;let e=this.trailMesh.geometry.attributes.position.array,t=this.trailMesh.geometry.attributes.color.array,n=this.trailMesh.geometry.attributes.alpha.array,r=this.trailMesh.userData.history,i=this.TRAIL_COUNT,a=this.TRAIL_LENGTH,o=this.trailMesh.userData.segmentCount,s=this.particleSystem.geometry.attributes.position.array,c=Math.min(i,Math.floor(s.length/3)),l=this.hsv2rgb(this.hue,.85,.45),u=l.r*(.6+this.bass*.4),d=l.g*(.6+this.mid*.4),f=l.b*(.6+this.high*.4);for(let e=0;e<c;e++){let t=e*3,n=e*a*3;for(let e=a-1;e>0;e--){let t=n+(e-1)*3,i=n+e*3;r[i]=r[t],r[i+1]=r[t+1],r[i+2]=r[t+2]}let i=this.morphPoint(s[t],s[t+1],s[t+2],this.morphValue);r[n]=i.x,r[n+1]=i.y,r[n+2]=i.z}for(let i=0;i<c;i++){let s=i*a*3;for(let a=0;a<o;a++){let c=(i*o+a)*2,l=c*3,p=l+3,m=s+a*3,h=s+(a+1)*3;e[l]=r[m],e[l+1]=r[m+1],e[l+2]=r[m+2],e[p]=r[h],e[p+1]=r[h+1],e[p+2]=r[h+2];let g=a/o,_=(a+1)/o,v=1-g*.7,y=1-_*.7;t[l]=(u+g*.3)*v,t[l+1]=(d+g*.2)*v,t[l+2]=(f+g*.4)*v,t[p]=(u+_*.3)*y,t[p+1]=(d+_*.2)*y,t[p+2]=(f+_*.4)*y;let b=(1-g*.85)*(.3+this.high*.3),x=(1-_*.85)*(.3+this.high*.3);n[c]=this.clamp01(b),n[c+1]=this.clamp01(x)}}this.trailMesh.geometry.attributes.position.needsUpdate=!0,this.trailMesh.geometry.attributes.color.needsUpdate=!0,this.trailMesh.geometry.attributes.alpha.needsUpdate=!0,this.trailMaterial3D&&(this.trailMaterial3D.uniforms.high.value=this.high,this.trailMaterial3D.uniforms.kickDetected.value=this.kickDetected,this.trailMaterial3D.uniforms.snareDetected.value=this.snareDetected,this.trailMaterial3D.uniforms.hihatDetected.value=this.hihatDetected)}setupPostProcessing(){let e=new p(this.scene,this.camera);this.bloomPass=new g(new d(window.innerWidth,window.innerHeight),this.settings.bloomStrength,this.settings.bloomRadius,this.settings.bloomThreshold),this.composer=new m(this.renderer),this.composer.addPass(e),this.composer.addPass(this.bloomPass),this.composer.addPass(new h)}setupGUI(){this.createGUIContainer();let t={resetParams:()=>{this.resetState(),Object.assign(this.settings,this.defaultSettings),this.baseHue=this.hexToBaseHue(this.settings.color),this.createParticles(this.settings.particleCount),this.bloomPass&&(this.bloomPass.strength=this.defaultSettings.bloomStrength,this.bloomPass.radius=this.defaultSettings.bloomRadius,this.bloomPass.threshold=this.defaultSettings.bloomThreshold),this.particleMaterial&&(this.particleMaterial.uniforms.particleSize.value=this.defaultSettings.particleSize,this.particleMaterial.uniforms.morphAmount.value=this.defaultSettings.morphAmount,this.particleMaterial.uniforms.flowStrength.value=this.defaultSettings.flowStrength,this.particleMaterial.uniforms.morph.value=0,this.particleMaterial.uniforms.brightness.value=this.defaultSettings.particleBrightness,this.particleMaterial.uniforms.uColor.value.set(this.defaultSettings.color),this.particleMaterial.uniforms.uHueShift.value=0,this.particleMaterial.uniforms.uColorIntensity.value=1),this.trailMaterial3D&&(this.trailMaterial3D.uniforms.trailGlow.value=this.defaultSettings.trailGlow),this.controls.autoRotate=this.defaultSettings.autoRotate,this.camera.position.set(this.defaultSettings.cameraPosition.x,this.defaultSettings.cameraPosition.y,this.defaultSettings.cameraPosition.z),this.controls.target.set(0,0,0),this.camera.lookAt(0,0,0),this.controls.update();let e=t=>{t.controllers.forEach(e=>e.updateDisplay()),t.folders&&Object.values(t.folders).forEach(t=>e(t))};e(this.gui)}};this.gui=new e({title:`✨ 流光幻影`,container:this.guiContainer});let n=this.gui.addFolder(`粒子参数`);n.add(this.settings,`particleCount`,1e4,5e5,1e4).name(`粒子数量`).onChange(e=>{this.isRebuilding||=(this.isRebuilding=!0,this.createParticles(e),!1)}),n.add(this.settings,`particleSize`,.1,30,.1).name(`粒子大小`).onChange(e=>{this.particleMaterial&&(this.particleMaterial.uniforms.particleSize.value=e)}),n.add(this.settings,`particleBrightness`,.1,3,.05).name(`粒子亮度`).onChange(e=>{this.particleMaterial&&(this.particleMaterial.uniforms.brightness.value=e)}),n.open();let r=this.gui.addFolder(`Bloom 辉光`);r.add(this.settings,`bloomStrength`,0,3,.01).name(`bloom强度`).onChange(e=>{this.bloomPass&&(this.bloomPass.strength=e)}),r.add(this.settings,`bloomRadius`,0,2,.01).name(`bloom半径`).onChange(e=>{this.bloomPass&&(this.bloomPass.radius=e)}),r.add(this.settings,`bloomThreshold`,0,1,.01).name(`bloom阈值`).onChange(e=>{this.bloomPass&&(this.bloomPass.threshold=e)}),r.add(this.settings,`bloomBeatResponse`,0,3,.05).name(`节拍辉光`),r.open();let i=this.gui.addFolder(`音频响应`),a=i.addFolder(`频段影响`);a.add(this.settings,`audioBassImpact`,0,2,.05).name(`低音影响`),a.add(this.settings,`audioMidImpact`,0,2,.05).name(`中频影响`),a.add(this.settings,`audioHighImpact`,0,2,.05).name(`高频影响`),a.add(this.settings,`kickImpact`,0,2,.05).name(`鼓点强度`),a.open();let o=i.addFolder(`形态与特征`);o.add(this.settings,`morphDrive`,0,2,.05).name(`形态驱动`),o.add(this.settings,`morphAmount`,.1,2,.05).name(`形态强度`).onChange(e=>{this.particleMaterial&&(this.particleMaterial.uniforms.morphAmount.value=e)}),o.add(this.settings,`flowStrength`,0,1.5,.01).name(`流场强度`).onChange(e=>{this.particleMaterial&&(this.particleMaterial.uniforms.flowStrength.value=e)}),o.add(this.settings,`outlineTight`,0,1,.01).name(`外轮廓收敛`).onChange(e=>{this.particleMaterial&&(this.particleMaterial.uniforms.outlineTight.value=e)}),o.add(this.settings,`shapeClarity`,0,1,.01).name(`形状清晰度`).onChange(e=>{this.particleMaterial&&(this.particleMaterial.uniforms.shapeClarity.value=e)}),o.add(this.settings,`downbeatImpact`,0,2,.05).name(`强拍跳变`),o.open(),i.open();let s=this.gui.addFolder(`颜色`);s.add(this.settings,`hueVariation`,0,1,.05).name(`色相漂移强度`),s.add(this.settings,`saturationBoost`,0,3,.1).name(`低音提艳`),s.open();let c=this.gui.addFolder(`相机控制`);c.add(this.settings,`autoRotate`).name(`自动旋转`).onChange(e=>{this.controls.autoRotate=e}),c.open(),this.gui.add(t,`resetParams`).name(`🔄 重置参数`),this.gui.hide()}createGUIContainer(){this.guiContainer=y(`Animation23-gui-container`),b(`Animation23-gui-container`),document.body.appendChild(this.guiContainer)}setupSettingsButton(){this.settingsButton=_(`Animation23-settings-button`),this.settingsButton.addEventListener(`click`,()=>{this.guiVisible=!this.guiVisible,this.guiVisible?this.gui.show():this.gui.hide()}),document.body.appendChild(this.settingsButton)}render(){if(!this.composer||!this.scene)return;let e=performance.now()*.001,t=Math.min(.033,e-this.lastFrameTime);this.elapsedTime+=t,this.lastFrameTime=e;let n=!this.hasAudioData;n&&(this.bass*=.95,this.mid*=.95,this.high*=.95,this.motion*=.95,this.variation*=.95,this.energy*=.95,this.percussive*=.95,this.smoothness*=.95,this.kickDetected=0,this.snareDetected=0,this.hihatDetected=0,this.downbeatDetected=0);let r=this.bass*this.settings.audioBassImpact,i=this.mid*this.settings.audioMidImpact,a=this.high*this.settings.audioHighImpact,o=this.elapsedTime,s=this.settings.morphDrive,c=r+i+a,l=c>1e-4?r/c:1/3,u=c>1e-4?i/c:1/3,d=c>1e-4?a/c:1/3,f=this.clamp01(l*.2+u*.45+d*.75+(1-this.smoothness)*.15+this.percussive*.1),p=this.morphValue,m=0;if(!n){f<this.autoMin?this.autoMin=f:this.autoMin+=(f-this.autoMin)*.015,f>this.autoMax?this.autoMax=f:this.autoMax+=(f-this.autoMax)*.015;let e=Math.max(this.autoMax-this.autoMin,.125),n=this.clamp01((f-this.autoMin)/e);this.morphSlow+=(n-this.morphSlow)*Math.min(.05*60*t,1),p=this.clamp01(this.morphSlow+(n-this.morphSlow)*(.3+this.variation*2)),m=Math.abs(n-this.prevFast),this.prevFast=n}let h=this.morphValue*(1-s)+p*s,g=1+s*1.5+this.energy*6+m*30;this.morphValue+=(h-this.morphValue)*Math.min(g*t,1),n||(this.kickDetected>.5&&(this.morphTransient=.05),this.downbeatDetected>.4&&(this.morphTransient=Math.max(this.morphTransient,.05*this.settings.downbeatImpact))),this.morphTransient*=.88**(t*60),this.morphValue+=this.morphTransient,this.morphValue=this.clamp01(this.morphValue);let _=(Math.sin(o*.5)*.5+(this.mid+this.high)*2)*this.settings.hueVariation;if(this.hue=(this.baseHue+_)%1,this.hue<0&&(this.hue+=1),this.bloomPass){let e=this.kickDetected*1.5*this.settings.bloomBeatResponse,t=r*1*this.settings.bloomBeatResponse,n=this.energy*.7*this.settings.bloomBeatResponse,i=this.settings.bloomStrength+e+t+n,a=Math.max(this.settings.bloomStrength*1.5,1);this.bloomPass.strength+=(Math.min(i,a)-this.bloomPass.strength)*.3}this.particleMaterial&&(this.particleMaterial.uniforms.time.value=o,this.particleMaterial.uniforms.morph.value=this.morphValue,this.particleMaterial.uniforms.bass.value=r,this.particleMaterial.uniforms.mid.value=i,this.particleMaterial.uniforms.high.value=a,this.particleMaterial.uniforms.kickDetected.value=this.kickDetected,this.particleMaterial.uniforms.snareDetected.value=this.snareDetected,this.particleMaterial.uniforms.hihatDetected.value=this.hihatDetected,this.particleMaterial.uniforms.motion.value=this.motion,this.particleMaterial.uniforms.uHueShift.value=_,this.particleMaterial.uniforms.uColorIntensity.value=1+this.bass*this.settings.saturationBoost,this.particleMaterial.uniforms.uBrightnessFeat.value=0,this.particleMaterial.uniforms.uDownbeat.value=this.downbeatDetected,this.particleMaterial.uniforms.uVariation.value=this.variation,this.particleMaterial.uniforms.uTime.value=o),this.updateRibbonTrail(),this.controls.update(),this.composer.render()}onWindowResize(){if(!this.camera||!this.renderer||!this.composer)return;let e=window.innerWidth,t=window.innerHeight;this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t),this.composer.setSize(e,t),this.bloomPass&&this.bloomPass.setSize(e,t)}updateWithAudioData(e,t){if(!e||!e.audioFeature||!e.isPlaying){this.hasAudioData=!1;return}this.hasAudioData=!0;let n=e.audioFeature.animation,r=.3;this.bass=this.bass*(1-r)+(n.bass||0)*r,this.mid=this.mid*(1-r)+(n.mid||0)*r,this.high=this.high*(1-r)+(n.high||0)*r,this.motion=this.motion*(1-r)+(n.motion||0)*r,this.variation=this.variation*(1-r)+(n.variation||0)*r,this.energy=this.energy*(1-r)+(n.energy||0)*r,this.percussive=this.percussive*(1-r)+(n.percussive||0)*r,this.smoothness=this.smoothness*(1-r)+(n.smoothness||0)*r,this.kickDetected=Math.min(n.kick*2*this.settings.kickImpact,2),this.snareDetected=n.snare,this.hihatDetected=n.hihat,this.downbeatDetected=n.downbeat}setEffectMode(e){return console.log(`当前效果模式：${e}`),!0}updateSettings(e){if(Object.assign(this.settings,e),e.cameraPosition&&this.camera.position.set(e.cameraPosition.x??this.settings.cameraPosition.x,e.cameraPosition.y??this.settings.cameraPosition.y,e.cameraPosition.z??this.settings.cameraPosition.z),e.bloomStrength!==void 0&&(this.bloomPass.strength=e.bloomStrength),e.bloomRadius!==void 0&&(this.bloomPass.radius=e.bloomRadius),e.bloomThreshold!==void 0&&(this.bloomPass.threshold=e.bloomThreshold),e.particleSize!==void 0&&this.particleMaterial&&(this.particleMaterial.uniforms.particleSize.value=e.particleSize),e.particleBrightness!==void 0&&this.particleMaterial&&(this.particleMaterial.uniforms.brightness.value=e.particleBrightness),e.particleCount!==void 0&&(this.settings.particleCount=e.particleCount,this.createParticles(e.particleCount)),e.flowStrength!==void 0&&this.particleMaterial&&(this.particleMaterial.uniforms.flowStrength.value=e.flowStrength),e.outlineTight!==void 0&&this.particleMaterial&&(this.particleMaterial.uniforms.outlineTight.value=e.outlineTight),e.shapeClarity!==void 0&&this.particleMaterial&&(this.particleMaterial.uniforms.shapeClarity.value=e.shapeClarity),e.morphAmount!==void 0&&this.particleMaterial&&(this.particleMaterial.uniforms.morphAmount.value=e.morphAmount),e.trailGlow!==void 0&&this.trailMaterial3D&&(this.trailMaterial3D.uniforms.trailGlow.value=e.trailGlow),e.kickImpact!==void 0&&(this.settings.kickImpact=e.kickImpact),e.autoRotate!==void 0&&this.controls&&(this.controls.autoRotate=e.autoRotate),e.color!==void 0&&this.particleMaterial&&(this.particleMaterial.uniforms.uColor.value.set(e.color),this.baseHue=this.hexToBaseHue(e.color)),this.gui){let e=t=>{t.controllers.forEach(e=>e.updateDisplay()),t.folders&&Object.values(t.folders).forEach(t=>e(t))};e(this.gui)}}resetState(){this.bass=0,this.mid=0,this.high=0,this.kickDetected=0,this.snareDetected=0,this.hihatDetected=0,this.downbeatDetected=0,this.motion=0,this.variation=0,this.energy=0,this.percussive=0,this.smoothness=0,this.hasAudioData=!1,this.morphValue=0,this.autoMin=.15,this.autoMax=.85,this.morphSlow=.5,this.prevFast=.5,this.morphTransient=0,this.prevKickDetected=0,this.hue=.13,this.baseHue=this.hexToBaseHue(this.settings.color),this.elapsedTime=0,this.lastFrameTime=0}dispose(){v(this.settingsButton,this.guiContainer,this.gui),this.settingsButton=null,this.guiContainer=null,this.gui=null,this.controls&&=(this.controls.dispose(),null),this.composer&&=(this.composer.dispose(),null),this.bloomPass&&=(this.bloomPass.dispose(),null),this.particleSystem&&=(this.scene&&this.scene.remove(this.particleSystem),null),this.particleGeometry&&=(this.particleGeometry.dispose(),null),this.particleMaterial&&=(this.particleMaterial.dispose(),null),this.trailMesh&&=(this.scene&&this.scene.remove(this.trailMesh),this.trailMesh.geometry.dispose(),null),this.trailMaterial3D&&=(this.trailMaterial3D.dispose(),null),this.renderer&&=(this.renderer.dispose(),null),this.scene&&=null,this.camera=null,console.log(`✅ Animation23 资源已清理`)}clamp01(e){return Math.max(0,Math.min(1,e))}morphPoint(e,t,n,r){let i=Math.sqrt(e*e+t*t+n*n);i=3.15+(i-3.15)*(1-this.settings.shapeClarity*.8);let a=Math.atan2(n,e),o=Math.acos(Math.max(-1,Math.min(1,t/(i+.001)))),s=Math.abs(Math.cos(a*6*.5)),c=i*(1+1.3*s),l=c*Math.sin(o)*Math.cos(a),u=c*Math.cos(o)*.8,d=c*Math.sin(o)*Math.sin(a),f=i*.6,p=i*2.5,m=f*Math.cos(p+a*2),h=i*.8*Math.sin(p*.8),g=f*Math.sin(p+a*2),_=i*(.2+1.8*Math.abs(Math.sin(a*5))),v=_*Math.sin(o)*Math.cos(a),y=_*Math.cos(o)*.5,b=_*Math.sin(o)*Math.sin(a),x=1+i*.1,S=o*2+1.57,C=(3+x*Math.cos(S))*Math.cos(a),w=x*Math.sin(S)*.7,T=(3+x*Math.cos(S))*Math.sin(a),E=i*(.8+.5*Math.abs(Math.sin(a*3+o*2))),D=E*Math.sin(o)*Math.cos(a),O=E*Math.cos(o)*(.4+.3*Math.abs(Math.sin(a*4))),k=E*Math.sin(o)*Math.sin(a),A=Math.max(0,Math.min(1,r*this.settings.morphAmount)),j=1/6,M=(e,t,n)=>e+(t-e)*n,N=e,P=t,F=n;if(A<j){let r=A/j;N=M(e,l,r),P=M(t,u,r),F=M(n,d,r)}else if(A<j*2){let e=(A-j)/j;N=M(l,m,e),P=M(u,h,e),F=M(d,g,e)}else if(A<j*3){let e=(A-j*2)/j;N=M(m,v,e),P=M(h,y,e),F=M(g,b,e)}else if(A<j*4){let e=(A-j*3)/j;N=M(v,C,e),P=M(y,w,e),F=M(b,T,e)}else if(A<j*5){let e=(A-j*4)/j;N=M(C,D,e),P=M(w,O,e),F=M(T,k,e)}else{let e=(A-j*5)/j;N=M(D,D,e),P=M(O,O,e),F=M(k,k,e)}return{x:N,y:P,z:F}}hexToBaseHue(e){let t=new o(e),n={h:0,s:0,l:0};return t.getHSL(n),n.h}hsv2rgb(e,t,n){e=(e%1+1)%1;let r=Math.floor(e*6),i=e*6-r,a=n*(1-t),o=n*(1-i*t),s=n*(1-(1-i)*t);switch(r%6){case 0:return{r:n,g:s,b:a};case 1:return{r:o,g:n,b:a};case 2:return{r:a,g:n,b:s};case 3:return{r:a,g:o,b:n};case 4:return{r:s,g:a,b:n};default:return{r:n,g:a,b:o}}}getAudioDataForUI(){return{bass:this.bass,mid:this.mid,high:this.high}}playAudio(){console.log(`音频播放由系统控制`)}pauseAudio(){console.log(`音频暂停由系统控制`)}};export{S as default};