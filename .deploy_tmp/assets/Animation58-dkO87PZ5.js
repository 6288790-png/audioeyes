import{a as e}from"./lil-gui.esm-jlbWO7FJ.js";import{Bt as t,Ht as n,Jn as r,Kt as i,Q as a,Tr as o,Tt as s,Y as c,_t as l,g as u,kr as d,pt as f,qn as p,r as m,tt as h,wr as g,wt as _,xt as v}from"./three.module-CgISyWQV.js";import{n as y,r as b,t as x}from"./OutputPass-D9GSoAm2.js";import{t as S}from"./UnrealBloomPass-1z79deN3.js";import{i as C,n as w,r as T,t as E}from"./GUIHelper-DspWBXk2.js";var D=22,O=4e3,k={x:6,y:5.2,z:6},A={x:-3,y:.15,z:-3},j=k.x/D,M=1/j,N={x:-5.2,y:1.1,z:0},P=1/60,F=14,I=.985,L=class{constructor(e){this.owner=e,this.reset()}reset(){this.alive=!1,this.px=0,this.py=0,this.pz=0,this.vx=0,this.vy=0,this.vz=0,this.radius=.1,this.life=0,this.maxLife=12,this.born=0,this.buoy=0,this.grounded=!1,this.settled=!1,this.phase=Math.random(),this.hue=Math.random(),this.sat=.85,this.lum=.62,this.hueSpeed=0,this.cr=1,this.cg=1,this.cb=1}spawn(e,t,n,r,i,a,o){this.alive=!0,this.px=e,this.py=t,this.pz=n,this.vx=i===void 0?1.1+Math.random()*.5:i,this.vy=a===void 0?.8+Math.random()*1:a,this.vz=o===void 0?(Math.random()-.5)*.4:o,this.radius=r,this.buoy=Math.random()<.55?-(.4+Math.random()*.5):.15+Math.random()*.5,this.grounded=!1,this.settled=!1,this.born=performance.now(),this.maxLife=12+Math.random()*5,this.life=this.maxLife,this.phase=Math.random(),this.hue=Math.random(),this.sat=.7+Math.random()*.3,this.lum=.62+Math.random()*.23,this.hueSpeed=(Math.random()-.5)*.06,this.updateColor()}updateColor(){this.owner._hsl.setHSL(this.hue,this.sat,this.lum),this.cr=this.owner._hsl.r,this.cg=this.owner._hsl.g,this.cb=this.owner._hsl.b}},R=class{constructor(e,t={}){this.canvas=e;let n={bloomEnabled:!0,bloomStrength:.2,bloomRadius:.2,bloomThreshold:.5,filmThickness:400,filmStrength:.4,fresnelPower:5,bubbleOpacity:1,innerGlow:1.8,bubbleScale:1,hueShift:0,saturation:1,brightness:1,colorMix:.7,smooth:.5,bassStrength:1,midStrength:1,highStrength:1,brightnessStrength:1,kickForce:1,snareStrength:1,hihatStrength:1};this.settings={...n,...t},this.defaultSettings=n,this.scene=null,this.camera=null,this.renderer=null,this.composer=null,this.bloomPass=null,this.bgRT=null,this.bgScene=null,this.nebulaMat=null,this.bubbles=null,this.bubbleMat=null,this.bubbleGeo=null,this.aRadius=null,this.aPhase=null,this.aColor=null,this.aFade=null,this.ux=null,this.uy=null,this.uz=null,this.ux2=null,this.uy2=null,this.uz2=null,this.div=null,this.p=null,this.pn=null,this.simTime=0,this.pool=[],this.cursor=0,this._hsl=new u,this._m4=new _,this._q=new i,this._s=new o,this._p=new o,this._upAxis=new o(0,1,0),this.bass=0,this.mid=0,this.high=0,this.audioBrightness=.5,this.kickVal=0,this.snareVal=0,this.hihatVal=0,this.beatVal=0,this.kickEngine=0,this.snareEngine=0,this.hihatEngine=0,this.beatEngine=0,this.lastKickE=0,this.lastHihatE=0,this.burstCooldown=0,this.hihatCooldown=0,this.audio={bass:0,mid:0,high:0,beatPulse:0,snare:0},this.hasAudioData=!1,this._lastWasPlaying=!1,this.acc=0,this.lastTime=0,this.gui=null,this.guiContainer=null,this.guiVisible=!1,this.settingsButton=null,this._isReady=!1,this.init()}init(){if(!(this._isReady||this.scene))try{return this.allocateFluid(),this.setupThreeJS(),this.createBackground(),this.createBubbles(),this.createBubblePool(),this.setupPostProcessing(),this.setupGUI(),this.setupSettingsButton(),this.syncParams(),this._isReady=!0,console.log(`✅ Animation58 初始化成功`),!0}catch(e){throw console.error(`❌ Animation58 初始化失败:`,e),e}}setupThreeJS(){this.camera=new t(60,window.innerWidth/window.innerHeight,.1,200),this.camera.position.set(0,1.6,5),this.camera.lookAt(0,1.6,0),this.renderer=new m({canvas:this.canvas,antialias:!0,alpha:!0,powerPreference:`high-performance`}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.toneMapping=4,this.renderer.toneMappingExposure=1.2,this.renderer.outputColorSpace=l}createBackground(){this.bgRT=new d(window.innerWidth,window.innerHeight,{minFilter:f,magFilter:f}),this.bgScene=new p,this.nebulaMat=new r({depthTest:!1,depthWrite:!1,uniforms:{},vertexShader:`
                void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }`,fragmentShader:`
                void main(){
                    // 完全纯黑背景（渲染到 bgRT 供折射采样）
                    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
                }`});let e=new s(new n(2,2),this.nebulaMat);e.renderOrder=0,this.bgScene.add(e),this.scene=new p}createBubbles(){let e=O;this.bubbleGeo=new c(1,4),this.aRadius=new a(new Float32Array(e),1),this.aPhase=new a(new Float32Array(e),1),this.aColor=new a(new Float32Array(e*3),3),this.aFade=new a(new Float32Array(e),1);for(let t=0;t<e;t++)this.aRadius.array[t]=.12,this.aPhase.array[t]=Math.random(),this.aColor.array[t*3]=1,this.aColor.array[t*3+1]=1,this.aColor.array[t*3+2]=1,this.aFade.array[t]=0;this.bubbleGeo.setAttribute(`aRadius`,this.aRadius),this.bubbleGeo.setAttribute(`aPhase`,this.aPhase),this.bubbleGeo.setAttribute(`aColor`,this.aColor),this.bubbleGeo.setAttribute(`aFade`,this.aFade),this.bubbleMat=new r({transparent:!0,depthWrite:!1,uniforms:{uTime:{value:0},uBass:{value:0},uMid:{value:0},uHigh:{value:0},uBeat:{value:0},uFilmThickness:{value:400},uFilmStrength:{value:.85},uFresnelPower:{value:5},uF0:{value:.02},uAlpha:{value:1},uInnerGlow:{value:1.8},uRefraction:{value:1.333},uEnvIntensity:{value:1},uHueShift:{value:0},uSaturation:{value:1},uBrightness:{value:1},uColorMix:{value:.7},uAudioShift:{value:0},tScene:{value:this.bgRT.texture}},vertexShader:`
                uniform float uTime;
                uniform float uBeat;
                attribute float aRadius;
                attribute float aPhase;
                attribute vec3 aColor;
                attribute float aFade;
                varying vec3 vWorldPos;
                varying vec3 vNormalW;
                varying vec3 vViewDir;
                varying float vPhase;
                varying vec2 vScreenUV;
                varying float vRadius;
                varying vec3 vColor;
                varying float vFade;
                void main(){
                    vPhase = aPhase;
                    vRadius = aRadius;
                    vColor = aColor;
                    vFade = aFade;
                    // Audio Morph：鼓点脉动膨胀（无表面变形 → 标准球体剪影）
                    // 注：几何大小由 instanceMatrix 提供（aRadius 仅作折射属性），勿再乘 aRadius，否则尺寸被平方
                    vec3 pos = position * (1.0 + uBeat * 0.18);
                    vec4 world = instanceMatrix * vec4(pos, 1.0);
                    vWorldPos = world.xyz;
                    vNormalW = normalize(mat3(instanceMatrix) * normal);
                    vViewDir = cameraPosition - world.xyz;
                    vec4 clip = projectionMatrix * viewMatrix * world;
                    vScreenUV = clip.xy / clip.w * 0.5 + 0.5;
                    gl_Position = clip;
                }`,fragmentShader:`
                uniform float uTime, uBass, uMid, uHigh, uBeat;
                uniform float uFilmThickness, uFilmStrength;
                uniform float uFresnelPower, uF0, uRefraction, uEnvIntensity, uAlpha, uInnerGlow;
                uniform float uHueShift, uSaturation, uBrightness, uColorMix;
                uniform float uAudioShift;
                uniform sampler2D tScene;
                varying vec3 vWorldPos, vNormalW, vViewDir;
                varying float vPhase, vRadius, vFade;
                varying vec2 vScreenUV;
                varying vec3 vColor;

                const float PI = 3.14159265359;

                // 程序化噪声（Cinematic Thin Film 2.0 厚度场）
                float hash(vec3 p) {
                    p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
                    p *= 17.0;
                    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
                }

                // 色相旋转（绕灰色轴旋转 RGB，用于 GUI 颜色控制）
                vec3 hueShift(vec3 c, float rad) {
                    const vec3 k = vec3(0.5773502692);
                    float cosA = cos(rad);
                    return c * cosA + cross(k, c) * sin(rad) + k * dot(k, c) * (1.0 - cosA);
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
                        f.z);
                }

                // 程序化环境反射（顶亮底暗 + 主光斑）
                vec3 envColor(vec3 dir){
                    float t = clamp(dir.y*0.5+0.5, 0.0, 1.0);
                    vec3 c = mix(vec3(0.06,0.07,0.12), vec3(0.28,0.38,0.62), pow(t,1.2));
                    c += vec3(0.40,0.32,0.52) * pow(max(dir.y,0.0), 4.0);
                    c += vec3(1.5,1.15,0.85) * pow(max(dot(dir, normalize(vec3(0.25,1.0,0.4))),0.0), 32.0) * 1.0;   // 小而亮的主光 → 玻璃高光
                    return c;
                }

                void main(){
                    vec3 N = normalize(vNormalW);
                    vec3 V = normalize(vViewDir);
                    float nDotV = clamp(dot(N, V), 0.0, 1.0);
                    vec3 tint = clamp(vColor, 0.0, 1.0);   // 实例色彩

                    // 1. Fresnel（Schlick）
                    float F = uF0 + (1.0 - uF0) * pow(1.0 - nDotV, uFresnelPower);

                    // 2. 薄膜干涉 —— 相位以空间噪声为主 → 有机色块，而非同心圆环
                    float sinTheta = sqrt(max(1.0 - nDotV * nDotV, 0.0));
                    float filmNoise = noise(vWorldPos * 3.5 + vPhase * 40.0 + uTime * 0.1);
                    float thick = uFilmThickness * (0.62 + filmNoise * 0.76);
                    thick *= (0.88 + 0.35 * sinTheta);                                // 弱化径向梯度，消除一圈一圈
                    thick *= (0.75 + 0.5 * clamp(vWorldPos.y * 0.3 + 0.55, 0.0, 1.0)); // 底部略厚
                    thick += min(uHigh, 1.0) * 80.0;                                  // 高音驱动色流（high→色流，1:1）
                    vec3 lambda = vec3(440.0, 550.0, 680.0);
                    // Film Layer 1（主干涉：相位弱视角依赖 → 色彩随噪声分布，不随视角转圈）
                    vec3 phase = 4.0 * PI * thick * (0.45 + 0.55 * nDotV) / lambda;
                    vec3 film = 0.5 + 0.5 * cos(phase);
                    // Film Layer 2（次级膜：相位无视角依赖，纯噪声色块）
                    float thick2 = thick * (0.7 + 0.3 * noise(vWorldPos * 6.0 - uTime * 0.15 + vPhase * 15.0));
                    vec3 phase2 = 4.0 * PI * thick2 * 0.85 / lambda + 1.7;
                    film = film * 0.68 + (0.5 + 0.5 * cos(phase2)) * 0.32;
                    film = pow(film, vec3(0.55));                                      // 更浓饱和
                    film *= uFilmStrength * (1.0 + 0.35 * uHigh);                      // 薄膜强度滑块 → 明显影响
                    vec3 filmCol = film * mix(vec3(1.0), tint, uColorMix);             // 颜色混合强度（GUI 可调）

                    // 3. 反射（纯黑背景下用程序化环境光：顶亮蓝紫 + 主光高光，保持抛光玻璃质感）
                    vec3 R = reflect(-V, N);
                    vec3 envR = envColor(R);
                    vec3 refl = envR * filmCol * F * uEnvIntensity;
                    // 玻璃高光：反射方向对准主光 → 锐利亮斑（不乘 F，中心也有光点）
                    vec3 L = normalize(vec3(0.25, 1.0, 0.4));
                    float glint = pow(max(dot(R, L), 0.0), 96.0);
                    refl += vec3(0.95, 1.0, 1.1) * glint * 1.6 * (0.4 + 0.6 * filmCol);
                    // 柔和次高光（收紧，避免大面积白色块）
                    float spec2 = pow(max(dot(R, L), 0.0), 14.0) * 0.2 * F * uFilmStrength;
                    refl += spec2 * (0.4 + 0.6 * filmCol);
                    refl += filmCol * F * 0.8;                                        // 边缘虹彩描边

                    // 4. 折射 —— 薄膜色散：RGB 三通道轻微分离，产生肥皂膜特有的虹彩位移
                    vec3 T = refract(-V, N, 1.0 / uRefraction);
                    vec2 off = T.xy * 0.035 * uRefraction * (0.25 + vRadius * 0.9) * (0.5 + 0.7 * uMid);
                    vec3 bg;
                    bg.r = texture2D(tScene, clamp(vScreenUV + off * 1.04, 0.0, 1.0)).r;
                    bg.g = texture2D(tScene, clamp(vScreenUV + off * 1.00, 0.0, 1.0)).g;
                    bg.b = texture2D(tScene, clamp(vScreenUV + off * 0.96, 0.0, 1.0)).b;

                    // 5. 薄膜透射 —— 肥皂泡中心几乎全透明，背景无阻穿过，仅边缘轻微遮蔽
                    float trans = 1.0 - 0.35 * F;

                    // 6. 合成 —— 径向渐变：中心透明，越往边缘颜色越深
                    vec3 col = refl + bg * trans;
                    float edge = sqrt(max(1.0 - nDotV * nDotV, 0.0));               // 0=圆心, 1=边缘
                    // 主体颜色融合薄膜干涉色：让「薄膜厚度/薄膜强度」滑块明显可感
                    vec3 body = tint * 0.55 + filmCol * 1.0;                        // 主体色以泡泡自身颜色为主，保留虹彩质感
                    vec3 fill = body * (0.12 + 0.42 * pow(edge, 1.5)) * (0.85 + 0.5 * uBass);   // 提亮扩散填充 → 泡泡颜色更实、不发暗
                    col += fill;
                    col += filmCol * F * tint * uBeat * 0.5;                         // 节拍脉冲（带色）

                    // 7. Interior Bubble Volume —— 内部蓝紫空气柔光（HDR 亮度，喂给 Bloom 形成柔光核心）
                    float inside = pow(1.0 - edge, 5.0);                                   // 收紧内芯，减少雾感
                    vec3 innerColor = mix(vec3(0.3, 0.5, 1.0), vec3(0.95, 0.6, 1.0), uHigh);
                    col += mix(innerColor, innerColor * tint, 0.5) * inside * uInnerGlow;   // 内芯柔光混入泡泡自身颜色

                    // 8. Dual Fresnel Rim —— 双层彩色边缘（去白：边缘色 = 薄膜色 + 环境色，不再纯白）
                    float rim1 = pow(1.0 - nDotV, 5.0);
                    float rim2 = pow(1.0 - nDotV, 12.0);
                    vec3 rimColor = mix(vec3(0.2, 0.8, 1.0), vec3(1.0, 0.4, 0.8), uHigh);
                    col += rimColor * rim1 * 0.4;
                    col += (rimColor * 0.6 + filmCol * 0.4) * rim2 * 0.55;

                    float alpha = clamp((0.32 + 0.68 * pow(edge, 1.2)) * uAlpha * vFade, 0.0, 1.0);   // vFade=出生淡入

                    // GUI 颜色控制：色相偏移（GUI 基准 + 音频质心冷暖偏移）/ 饱和度 / 亮度
                    col = hueShift(col, uHueShift + uAudioShift);
                    col = mix(vec3(dot(col, vec3(0.299, 0.587, 0.114))), col, uSaturation);
                    col *= uBrightness;

                    gl_FragColor = vec4(col * vFade, alpha);   // 线性输出，色调映射 + sRGB 由 OutputPass 完成
                }`}),this.bubbles=new h(this.bubbleGeo,this.bubbleMat,O),this.bubbles.renderOrder=1,this.bubbles.frustumCulled=!1,this.scene.add(this.bubbles)}createBubblePool(){for(let e=0;e<O;e++)this.pool.push(new L(this));this.cursor=0}spawnOne(e,t,n,r,i,a,o){for(let s=0;s<O;s++){let c=(this.cursor+s)%O;if(!this.pool[c].alive){this.pool[c].spawn(e,t,n,r,i,a,o),this.cursor=(c+1)%O;return}}}burstSpawn(e=24){for(let t=0;t<e;t++)this.spawnOne(N.x+(Math.random()-.5)*.5,N.y+(Math.random()-.5)*.5,N.z+(Math.random()-.5)*.5,.1+Math.random()*.18*Math.random()**1.2)}hihatSpawn(e=5){for(let t=0;t<e;t++)this.spawnOne(N.x+(Math.random()-.5)*.3,N.y+(Math.random()-.5)*.3,N.z+(Math.random()-.5)*.3,.05+Math.random()*.1)}setupPostProcessing(){this.composer=new b(this.renderer),this.composer.addPass(new y(this.scene,this.camera)),this.bloomPass=new S(new g(window.innerWidth,window.innerHeight),this.settings.bloomStrength,this.settings.bloomRadius,this.settings.bloomThreshold),this.composer.addPass(this.bloomPass),this.composer.addPass(new x)}updateWithAudioData(e,t){let n=!!(e&&e.isPlaying===!0);if(e&&e.audioFeature&&e.audioFeature.animation){this.hasAudioData=n;let t=e.audioFeature.animation,r=this.settings.smooth;this.bass=this.bass*r+(t.bass||0)*(1-r),this.mid=this.mid*r+(t.mid||0)*(1-r),this.high=this.high*r+(t.high||0)*(1-r),this.audioBrightness=this.audioBrightness*r+(t.brightness||0)*(1-r),this.kickEngine=t.kick||0,this.snareEngine=t.snare||0,this.hihatEngine=t.hihat||0,this.beatEngine=t.beat||0}else e&&e.energy?(this.hasAudioData=e.isPlaying===void 0?!0:n,this.bass=e.energy.low||0,this.mid=e.energy.mid||0,this.high=e.energy.high||0,this.audioBrightness=.5,this.kickEngine=e.beat?.kick||0,this.snareEngine=e.beat?.snare||0,this.hihatEngine=e.beat?.hihat||0,this.beatEngine=Math.max(this.kickEngine,this.snareEngine,this.hihatEngine)):this.hasAudioData=!1;n&&!this._lastWasPlaying&&this.clearBubbles(),this._lastWasPlaying=n}clearBubbles(){for(let e=0;e<O;e++)this.pool[e].reset(),this._p.set(0,-10,0),this._q.identity(),this._s.set(1e-4,1e-4,1e-4),this.bubbles.setMatrixAt(e,this._m4.compose(this._p,this._q,this._s)),this.aRadius.array[e]=1e-4,this.aFade.array[e]=0,this.aColor.array[e*3]=0,this.aColor.array[e*3+1]=0,this.aColor.array[e*3+2]=0;this.aRadius.needsUpdate=!0,this.aFade.needsUpdate=!0,this.aColor.needsUpdate=!0,this.bubbles.instanceMatrix.needsUpdate=!0}updateAudioAnalysis(e){this.hasAudioData?(this.kickVal=Math.min(this.kickEngine,2),this.snareVal=Math.min(this.snareEngine,1.5),this.hihatVal=Math.min(this.hihatEngine,1.5),this.beatVal=Math.min(this.beatEngine,2),this.kickVal>.3&&this.kickVal>this.lastKickE*1.05&&this.burstCooldown<=0&&(this.burstSpawn(Math.max(4,Math.round(36*this.settings.kickForce))),this.burstCooldown=.15),this.hihatVal>.1&&this.hihatVal>this.lastHihatE*1.1&&this.hihatCooldown<=0&&(this.hihatSpawn(Math.max(4,Math.round(5*this.settings.hihatStrength))),this.hihatCooldown=.2),this.lastKickE=this.kickVal,this.lastHihatE=this.hihatVal):(this.bass*=.95,this.mid*=.95,this.high*=.95,this.audioBrightness+=(.5-this.audioBrightness)*.1,this.kickVal*=.92,this.snareVal*=.9,this.hihatVal*=.88,this.beatVal*=.9,this.lastKickE*=.95,this.lastHihatE*=.95),this.burstCooldown=Math.max(0,this.burstCooldown-e),this.hihatCooldown=Math.max(0,this.hihatCooldown-e),this.audio={bass:this.bass,mid:this.mid,high:this.high,beatPulse:Math.min(this.kickVal*this.settings.kickForce,1),snare:this.snareVal}}allocateFluid(){let e=D*D*D;this.ux=new Float32Array(e),this.uy=new Float32Array(e),this.uz=new Float32Array(e),this.ux2=new Float32Array(e),this.uy2=new Float32Array(e),this.uz2=new Float32Array(e),this.div=new Float32Array(e),this.p=new Float32Array(e),this.pn=new Float32Array(e)}clampI(e){return e<0?0:e>=D?D-1:e}gidx(e,t,n){return(e*D+t)*D+n}w2g(e,t,n){return[(e-A.x)/k.x*D,(t-A.y)/k.y*D,(n-A.z)/k.z*D]}triSample(e,t,n,r){let i=Math.floor(t),a=Math.floor(n),o=Math.floor(r),s=Math.min(i+1,D-1),c=Math.min(a+1,D-1),l=Math.min(o+1,D-1),u=t-i,d=n-a,f=r-o,p=this.gidx(i,a,o),m=this.gidx(s,a,o),h=this.gidx(i,c,o),g=this.gidx(s,c,o),_=this.gidx(i,a,l),v=this.gidx(s,a,l),y=this.gidx(i,c,l),b=this.gidx(s,c,l),x=e[p]*(1-u)+e[m]*u,S=e[h]*(1-u)+e[g]*u,C=e[_]*(1-u)+e[v]*u,w=e[y]*(1-u)+e[b]*u,T=x*(1-d)+S*d,E=C*(1-d)+w*d;return T*(1-f)+E*f}sampleVel(e,t,n){let[r,i,a]=this.w2g(e,t,n),o=this.clampI(r),s=this.clampI(i),c=this.clampI(a);return[this.triSample(this.ux,o,s,c),this.triSample(this.uy,o,s,c),this.triSample(this.uz,o,s,c)]}fluidStep(e,t,n,r){let i=this.ux,a=this.uy,o=this.uz,s=this.ux2,c=this.uy2,l=this.uz2,u=this.div,d=this.p,f=this.pn,p=D-1,m=1/D,h=t.bass*5.5*1*this.settings.bassStrength,g=t.mid*3*1*this.settings.midStrength,_=t.beatPulse*9*1,v=2.2;for(let t=0;t<D;t++)for(let n=0;n<D;n++)for(let s=0;s<D;s++){let c=this.gidx(t,n,s),l=A.x+(t+.5)*j,u=A.y+(n+.5)*j,d=A.z+(s+.5)*j;i[c]+=(.18+Math.sin(u*.6+r*.4)*.1)*1*e,a[c]+=Math.cos(l*1.1+r*.55)*.08*1*e,o[c]+=Math.sin(d*.8+r*1)*.1*1*e;let f=l-0,p=u-1.1,m=d-0,y=f*f+p*p+m*m,b=Math.exp(-y/(v*v)),x=Math.sqrt(y)+.001;i[c]+=f/x*h*b*e,a[c]+=p/x*h*b*e,o[c]+=m/x*h*b*e,i[c]+=-m/x*g*b*e,o[c]+=f/x*g*b*e,i[c]+=f/x*_*b*e,a[c]+=p/x*_*b*e,o[c]+=m/x*_*b*e}let y=.35;for(let t of n){let[n,r,s]=this.w2g(t.px,t.py,t.pz),c=this.clampI(Math.floor(n)),l=this.clampI(Math.floor(r)),u=this.clampI(Math.floor(s)),d=this.gidx(c,l,u);i[d]-=t.vx*y*e*10,a[d]-=t.vy*y*e*10,o[d]-=t.vz*y*e*10}for(let t=0;t<D;t++)for(let n=0;n<D;n++)for(let r=0;r<D;r++){let u=this.gidx(t,n,r),d=t+.5,f=n+.5,p=r+.5,h=d-i[u]*e*m,g=f-a[u]*e*m,_=p-o[u]*e*m;s[u]=this.triSample(i,h,g,_),c[u]=this.triSample(a,h,g,_),l[u]=this.triSample(o,h,g,_)}i.set(s),a.set(c),o.set(l);for(let e=0;e<D;e++)for(let t=0;t<D;t++)for(let n=0;n<D;n++){let r=this.gidx(e,t,n),s=this.gidx(Math.max(e-1,0),t,n),c=this.gidx(Math.min(e+1,p),t,n),l=this.gidx(e,Math.max(t-1,0),n),f=this.gidx(e,Math.min(t+1,p),n),m=this.gidx(e,t,Math.max(n-1,0)),h=this.gidx(e,t,Math.min(n+1,p));u[r]=.5*M*(i[c]-i[s]+(a[f]-a[l])+(o[h]-o[m])),d[r]=0}let b=j/6;for(let e=0;e<F;e++){for(let e=0;e<D;e++)for(let t=0;t<D;t++)for(let n=0;n<D;n++){let r=this.gidx(e,t,n);f[r]=(d[this.gidx(Math.max(e-1,0),t,n)]+d[this.gidx(Math.min(e+1,p),t,n)]+d[this.gidx(e,Math.max(t-1,0),n)]+d[this.gidx(e,Math.min(t+1,p),n)]+d[this.gidx(e,t,Math.max(n-1,0))]+d[this.gidx(e,t,Math.min(n+1,p))])*(1/6)-b*u[r]}let e=d;d.set(f),f.set(e)}for(let e=0;e<D;e++)for(let t=0;t<D;t++)for(let n=0;n<D;n++){let r=this.gidx(e,t,n),s=this.gidx(Math.max(e-1,0),t,n),c=this.gidx(Math.min(e+1,p),t,n),l=this.gidx(e,Math.max(t-1,0),n),u=this.gidx(e,Math.min(t+1,p),n),f=this.gidx(e,t,Math.max(n-1,0)),m=this.gidx(e,t,Math.min(n+1,p)),h=.5*M*(d[c]-d[s]),g=.5*M*(d[u]-d[l]),_=.5*M*(d[m]-d[f]);i[r]-=h,a[r]-=g,o[r]-=_}for(let e=0;e<i.length;e++){i[e]*=I,a[e]*=I,o[e]*=I;let t=i[e]*i[e]+a[e]*a[e]+o[e]*o[e];if(t>144){let n=12/Math.sqrt(t);i[e]*=n,a[e]*=n,o[e]*=n}}}bubbleStep(e,t){let n=this.pool,r=this.bubbles,i=this.aRadius,a=this.aFade,o=this.aColor,s=this._p,c=this._q,l=this._s,u=this._m4,d=this._upAxis,f=this.camera,p=(this.hasAudioData?2:2.5)+t.bass*5*this.settings.bassStrength;if(Math.random()<p*e){let e=1+(this.hasAudioData?Math.min(1,Math.floor(t.bass*2.5)):0);for(let t=0;t<e;t++)this.spawnOne(N.x+(Math.random()-.5)*.25,N.y+(Math.random()-.5)*.25,N.z+(Math.random()-.5)*.25,.1+Math.random()*.12)}for(let p=0;p<O;p++){let m=n[p];if(!m.alive){s.set(0,-10,0),c.identity(),l.set(1e-4,1e-4,1e-4),r.setMatrixAt(p,u.compose(s,c,l)),i.array[p]=1e-4,a.array[p]=0,o.array[p*3]=0,o.array[p*3+1]=0,o.array[p*3+2]=0;continue}let[h,g,_]=this.sampleVel(m.px,m.py,m.pz),y=Math.tan(v.degToRad(f.fov)*.5),b=f.position.z-m.pz,x=f.position.y-b*y,S=f.position.y+b*y,C=1.6;if(!m.grounded){if(m.settled)m.vx*=.98,m.vz*=.98;else{m.vx+=((h-m.vx)*C+1.6)*e,m.vz+=(_-m.vz)*C*e,m.vx<1.1&&(m.vx=1.1);let n=t.mid*2*this.settings.midStrength;m.vx+=(Math.random()-.5)*n*e,m.vz+=(Math.random()-.5)*n*e,m.vy+=t.bass*.35*this.settings.bassStrength*e,m.vx+=Math.sin(this.simTime*.9+m.phase*6.2831)*.25*e,m.vz+=Math.cos(this.simTime*.7+m.phase*6.2831)*.35*e,m.vy+=Math.sin(this.simTime*1.2+m.phase*6.2831)*.35*e}if(m.buoy<0)m.vy-=.6*e;else{let t=S-.8-m.phase*2;m.py>t?m.vy+=(0-m.vy)*2*e:m.vy+=(.15-m.vy)*1*e}}m.grounded&&(m.vx=m.vx*.95+.006,m.vz*=.9),m.px+=m.vx*e,m.py+=m.vy*e,m.pz+=m.vz*e,m.life-=e;let w=5.6,T=1;if(m.py<x+m.radius&&(m.py=x+m.radius,m.settled=!0,m.vy<-.2?(m.vy=Math.abs(m.vy)*.65,m.grounded=!1):(m.vy=0,m.grounded=!0,m.vx*=.9,m.life<6&&(m.life=6))),m.grounded&&t.beatPulse>.3&&Math.random()<.04&&(m.vy=.5+t.beatPulse*1.5,m.grounded=!1),m.py>S+3){m.alive=!1;continue}if(m.px>w-1.5&&(T=Math.max(0,(w-m.px)/1.5)),m.px>w+m.radius){m.alive=!1;continue}if(m.px<-6.6){m.alive=!1;continue}if(m.pz>2.5&&(m.pz=2.5,m.vz*=-.5),m.pz<-2.5&&(m.pz=-2.5,m.vz*=-.5),m.life<=0){m.alive=!1;continue}m.hue+=m.hueSpeed*e,m.hue>1?--m.hue:m.hue<0&&(m.hue+=1),m.updateColor();let E=1+.15*Math.sin(m.phase*20+performance.now()*.002),D=(performance.now()-m.born)*.001,O=Math.min(1,D/.8);O=O*O*(3-2*O),s.set(m.px,m.py,m.pz),c.setFromAxisAngle(d,m.phase*Math.PI*2+performance.now()*4e-4);let k=m.radius*E*this.settings.bubbleScale*O*T;l.set(k,k,k),r.setMatrixAt(p,u.compose(s,c,l)),i.array[p]=k,a.array[p]=O*T,o.array[p*3]=m.cr,o.array[p*3+1]=m.cg,o.array[p*3+2]=m.cb}i.needsUpdate=!0,a.needsUpdate=!0,o.needsUpdate=!0,r.instanceMatrix.needsUpdate=!0}syncParams(){let e=this.settings;if(this.bloomPass&&(this.bloomPass.enabled=e.bloomEnabled,this.bloomPass.strength=e.bloomStrength,this.bloomPass.radius=e.bloomRadius,this.bloomPass.threshold=e.bloomThreshold),!this.bubbleMat)return;let t=this.bubbleMat.uniforms;t.uFresnelPower.value=e.fresnelPower,t.uAlpha.value=e.bubbleOpacity,t.uInnerGlow.value=e.innerGlow,t.uHueShift.value=e.hueShift*Math.PI/180,t.uSaturation.value=e.saturation,t.uBrightness.value=e.brightness,t.uColorMix.value=e.colorMix}setupGUI(){this.guiContainer=T(`Animation58-gui-container`),E(`Animation58-gui-container`),document.body.appendChild(this.guiContainer),this.gui=new e({title:`音波幻泡`,container:this.guiContainer});let t=this.settings,n=this.gui.addFolder(`Bloom 辉光`);n.add(t,`bloomEnabled`).name(`启用辉光`),n.add(t,`bloomStrength`,0,1,.01).name(`bloom强度`),n.add(t,`bloomRadius`,0,1,.01).name(`bloom半径`),n.add(t,`bloomThreshold`,0,1,.01).name(`bloom阈值`),n.open();let r=this.gui.addFolder(`泡泡参数`);r.add(t,`filmThickness`,100,1200,10).name(`薄膜厚度`),r.add(t,`filmStrength`,0,2,.01).name(`薄膜强度`),r.add(t,`fresnelPower`,0,10,.1).name(`菲涅尔强度`),r.add(t,`bubbleOpacity`,.2,1,.01).name(`泡泡不透明度`),r.add(t,`innerGlow`,0,3,.01).name(`内芯亮度`),r.add(t,`bubbleScale`,.2,3,.01).name(`气泡大小`),r.open();let i=this.gui.addFolder(`颜色控制`);i.add(t,`hueShift`,0,360,1).name(`色相偏移(度)`),i.add(t,`saturation`,0,2,.01).name(`饱和度`),i.add(t,`brightness`,.3,1.5,.01).name(`亮度`),i.add(t,`colorMix`,0,1,.01).name(`颜色混合强度`),i.open();let a=this.gui.addFolder(`音频映射`);a.add(t,`bassStrength`,0,2,.05).name(`低音→吹泡`),a.add(t,`midStrength`,0,2,.05).name(`中音→搅动`),a.add(t,`highStrength`,0,2,.05).name(`高音→色流`),a.add(t,`brightnessStrength`,0,2,.05).name(`质心→冷暖`),a.add(t,`kickForce`,0,2,.05).name(`底鼓→爆发`),a.add(t,`snareStrength`,0,2,.05).name(`军鼓→闪烁`),a.add(t,`hihatStrength`,0,2,.05).name(`踩镲→细泡`),a.add(t,`smooth`,0,1,.01).name(`频谱平滑(旧值占比)`),this.gui.add({reset:()=>this.resetParams()},`reset`).name(`重置参数`),this.gui.hide()}resetParams(){if(Object.assign(this.settings,this.defaultSettings),this.syncParams(),this.resetState(),this.gui){let e=t=>{t&&(t.controllers.forEach(e=>e.updateDisplay()),t.folders.forEach(e))};e(this.gui),this.gui.controllers.forEach(e=>e.updateDisplay())}}setupSettingsButton(){this.settingsButton=C(`Animation58-settings-button`),this.settingsButton.addEventListener(`click`,()=>{this.guiVisible=!this.guiVisible,this.guiVisible?this.gui.show():this.gui.hide()}),document.body.appendChild(this.settingsButton)}render(){if(!this._isReady||!this.composer)return;let e=performance.now()*.001,t=this.lastTime>0?Math.min(.05,e-this.lastTime):.016;for(this.lastTime=e,this.acc+=t,this.syncParams(),this.updateAudioAnalysis(t);this.acc>=P;)this.simTime+=P,this.fluidStep(P,this.audio,this.pool,this.simTime),this.bubbleStep(P,this.audio),this.acc-=P;let n=this.bubbleMat.uniforms;n.uTime.value=e,n.uBass.value=this.audio.bass,n.uMid.value=this.audio.mid,n.uHigh.value=this.audio.high,n.uBeat.value=Math.min(this.beatVal,1.2),n.uAudioShift.value=(this.audioBrightness-.5)*.8*this.settings.brightnessStrength,n.uFilmStrength.value=this.settings.filmStrength+this.audio.snare*.3*this.settings.snareStrength,n.uFilmThickness.value=this.settings.filmThickness+this.audio.high*80*this.settings.highStrength+this.audio.snare*30*this.settings.snareStrength,this.renderer.setRenderTarget(this.bgRT),this.renderer.render(this.bgScene,this.camera),this.renderer.setRenderTarget(null),this.composer.render()}onWindowResize(){this.camera.aspect=window.innerWidth/window.innerHeight,this.camera.updateProjectionMatrix(),this.renderer.setSize(window.innerWidth,window.innerHeight),this.bgRT&&this.bgRT.setSize(window.innerWidth,window.innerHeight),this.composer&&this.composer.setSize(window.innerWidth,window.innerHeight),this.bloomPass&&this.bloomPass.setSize(window.innerWidth,window.innerHeight)}resetState(){this.bass=0,this.mid=0,this.high=0,this.audioBrightness=.5,this.kickVal=0,this.snareVal=0,this.hihatVal=0,this.beatVal=0,this.kickEngine=0,this.snareEngine=0,this.hihatEngine=0,this.beatEngine=0,this.lastKickE=0,this.lastHihatE=0,this.burstCooldown=0,this.hihatCooldown=0,this.hasAudioData=!1,this.audio={bass:0,mid:0,high:0,beatPulse:0,snare:0},this.simTime=0,this.acc=0,this.lastTime=0,this.ux.fill(0),this.uy.fill(0),this.uz.fill(0),this.ux2.fill(0),this.uy2.fill(0),this.uz2.fill(0),this.div.fill(0),this.p.fill(0),this.pn.fill(0),this.clearBubbles()}updateSettings(e){Object.assign(this.settings,e),this.syncParams()}dispose(){w(this.settingsButton,this.guiContainer,this.gui),this.scene&&this.scene.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.dispose()):e.material.dispose())}),this.bgScene&&this.bgScene.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&e.material.dispose()}),this.bgRT&&this.bgRT.dispose(),this.bubbleGeo&&this.bubbleGeo.dispose(),this.bubbleMat&&this.bubbleMat.dispose(),this.nebulaMat&&this.nebulaMat.dispose(),this.composer&&this.composer.dispose&&this.composer.dispose(),this.renderer&&this.renderer.dispose(),this._isReady=!1,console.log(`✅ Animation58 资源已清理`)}};export{R as default};