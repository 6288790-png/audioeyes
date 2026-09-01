const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/lil-gui.esm-Dmd9RIzu.js","assets/lil-gui.esm-jlbWO7FJ.js"])))=>i.map(i=>d[i]);
import{t as e}from"./preload-helper-zJ_50EbN.js";import{Bt as t,Gn as n,Jn as r,K as i,Wt as a,l as o,qn as s,r as c,u as l,wr as u,xt as d}from"./three.module-CgISyWQV.js";import{n as f,r as p,t as m}from"./OutputPass-D9GSoAm2.js";import{t as h}from"./UnrealBloomPass-1z79deN3.js";import{i as g,n as _,r as v,t as y}from"./GUIHelper-DspWBXk2.js";import{t as b}from"./OrbitControls-DVnblHSy.js";var x=class{constructor(e,t={}){this.canvas=e,this.settings={stellarCount:19e4,dustCount:56e3,heroCount:1200,galaxyRadius:320,armTightness:.041,armWidth:.42,coreDensity:.28,diskThickness:1,featherStrength:1,outerSpread:1,cameraDistance:520,rotationSpeed:34e-5,autoRotate:!0,shaderRotationSpeed:.035,stellarSize:3,dustSize:5,dustOpacity:.34,heroSize:5.7,heroBrightness:1.38,sensitivity:1,smoothing:.72,bassFlow:1,midBreath:.9,highSparkle:1.05,kickPulse:1,snareDust:.75,downbeatBreath:.9,motionIntensity:.85,textureIntensity:.55,variationIntensity:.55,flowStrength:1,armBreath:1,propagationStrength:1,depthFade:82e-5,colorIntensity:1.08,coreWarmth:.62,sparkleThreshold:.78,colorChangeIntensity:1.1,bassWarmthColor:1.08,midPaletteMorph:1.12,highCoolTint:1.1,kickColorPulse:1.22,downbeatColorDrift:.92,colorEvolutionSpeed:1.45,violetBias:.12,coolBias:.08,warmLimit:.72,exposure:1.18,bloomStrength:.2,bloomRadius:.2,bloomThreshold:.6,...t},this.defaultSettings={...this.settings},this.capacity={stellar:26e4,dust:9e4,hero:2500},this.baseStructure={galaxyRadius:320,armTightness:.041,armWidth:.42},this._rngState=1243072995,this._palettePhase=.055,this.scene=null,this.camera=null,this.renderer=null,this.composer=null,this.bloomPass=null,this.controls=null,this.galaxyGroup=null,this.stellarPoints=null,this.dustPoints=null,this.heroPoints=null,this.stellarMaterial=null,this.dustMaterial=null,this.heroMaterial=null,this.hasAudioData=!1,this.bass=0,this.mid=0,this.high=0,this.energyLevel=0,this.motionVal=0,this.brightnessVal=0,this.textureVal=0,this.smoothnessVal=.5,this.variationVal=0,this._kickEnvelope=0,this._snareEnvelope=0,this._hihatEnvelope=0,this._downbeatEnvelope=0,this._kickProgress=1,this._snareProgress=1,this._downbeatProgress=1,this._lastKickInput=0,this._lastSnareInput=0,this._lastDownbeatInput=!1,this._lastAudioTime=null,this._lastRenderTime=null,this._palettePhase=.055,this.gui=null,this.guiContainer=null,this.guiScrollbarStyle=null,this.settingsButton=null,this.guiVisible=!1,this.mouseControls={isMouseDown:!1,autoRotate:this.settings.autoRotate},this._autoRotateTimer=null,this._mouseHandlers=null,this.guiActions={resetParams:()=>this.resetParams()},this.init()}init(){try{return this.setupThreeJS(),this.setupPostProcessing(),this.setupMouseControls(),setTimeout(()=>{this.renderer&&this.createGUI()},400),console.log(`✅ Animation4  初始化成功 - Spectral Living Galaxy`),!0}catch(e){return console.error(`❌ Animation4  初始化失败:`,e),!1}}setupThreeJS(){this.scene=new s,this.camera=new t(58,window.innerWidth/window.innerHeight,.1,2200),this.camera.position.set(-255.28,264.2,355.51),this.renderer=new c({canvas:this.canvas,antialias:!0,alpha:!0,powerPreference:`high-performance`}),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.setPixelRatio(Math.min(2,window.devicePixelRatio)),this.renderer.outputColorSpace=n,this.renderer.toneMapping=4,this.renderer.toneMappingExposure=this.settings.exposure,this.renderer.setClearColor(0,0),this.canvas.style.backgroundColor=`transparent`,this.canvas.style.zIndex=`1`,this.controls=new b(this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.dampingFactor=.055,this.controls.target.set(0,0,0),this.controls.minDistance=260,this.controls.maxDistance=1100,this.controls.update(),this.setupGalaxyLayers()}setupPostProcessing(){this.composer=new p(this.renderer),this.composer.addPass(new f(this.scene,this.camera)),this.bloomPass=new h(new u(window.innerWidth,window.innerHeight),this.settings.bloomStrength,this.settings.bloomRadius,this.settings.bloomThreshold),this.composer.addPass(this.bloomPass),this.composer.addPass(new m),this.composer.renderToScreen=!0}resetDeterministicRandom(e=1243072995){this._rngState=e>>>0}rand(){let e=this._rngState>>>0;return e^=e<<13,e^=e>>>17,e^=e<<5,this._rngState=e>>>0,(this._rngState>>>0)/4294967296}randomGaussian(){let e=Math.max(1e-6,this.rand()),t=Math.max(1e-6,this.rand());return d.clamp(Math.sqrt(-2*Math.log(e))*Math.cos(Math.PI*2*t),-2.6,2.6)}generateStellarGalaxy(e){let t=new Float32Array(e*3),n=new Float32Array(e),r=new Float32Array(e),i=new Float32Array(e),a=new Float32Array(e),o=new Float32Array(e),s=new Float32Array(e),c=this.baseStructure.galaxyRadius,l=this.baseStructure.armTightness,u=this.baseStructure.armWidth;this.resetDeterministicRandom(1369948382);for(let f=0;f<e;f++){let e=this.rand(),p,m,h,g,_=0,v=0;if(e<.28){let e=this.rand()**1.75;p=9+e*96;let t=f%2*Math.PI;_=this.randomGaussian()*(.42-e*.12),m=t+p*l*.72+_,h=this.randomGaussian()*d.lerp(27,7,e)*.34,g=0}else if(e<.93){p=45+this.rand()**.82*(c-45);let e=p/c,t=f%2*Math.PI,n=d.lerp(.48,1.02,e),r=this.rand();r>.56&&r<=.79?v=.16+e*.16:r>.79&&(v=-.14-e*.13);let i=Math.abs(v)>.001?.36:.52;_=this.randomGaussian()*n*i,m=t+p*l+v+_*u,p+=this.randomGaussian()*d.lerp(2.2,10.5,e),h=this.randomGaussian()*d.lerp(7.5,19,e)*.32,g=1}else p=110+Math.sqrt(this.rand())*(c*1.06-110),m=this.rand()*Math.PI*2,h=this.randomGaussian()*d.lerp(8,31,p/c)*.36,g=2;let y=g===0?.86:1,b=Math.cos(m)*p,x=Math.sin(m)*p*y;t[f*3]=b,t[f*3+1]=h,t[f*3+2]=x,n[f]=Math.sqrt(b*b+x*x),r[f]=this.rand(),i[f]=g,a[f]=.55+this.rand()**3*1.9,o[f]=_,s[f]=v}return{positions:t,radius:n,seed:r,layer:i,sizeJitter:a,armOffset:o,featherOffset:s}}generateDustGalaxy(e){let t=new Float32Array(e*3),n=new Float32Array(e),r=new Float32Array(e),i=new Float32Array(e),a=new Float32Array(e),o=new Float32Array(e),s=new Float32Array(e),c=this.baseStructure.galaxyRadius,l=this.baseStructure.armTightness,u=this.baseStructure.armWidth;this.resetDeterministicRandom(2446717754);for(let f=0;f<e;f++){let e=24+this.rand()**.9*(c-10),p=e/c,m=f%2*Math.PI,h=d.lerp(.82,1.62,p),g=this.rand(),_=0;g>.58&&g<=.8?_=.18+p*.14:g>.8&&(_=-.16-p*.12);let v=Math.abs(_)>.001?.5:.72,y=this.randomGaussian()*h*v,b=m+e*l+_+y*u+Math.sin(e*.045+f*.017)*.055;e+=this.randomGaussian()*d.lerp(5,16,p);let x=Math.cos(b)*e,S=Math.sin(b)*e,C=this.randomGaussian()*d.lerp(8,26,p)*.42+Math.sin(b*2+e*.025)*2.2;t[f*3]=x,t[f*3+1]=C,t[f*3+2]=S,n[f]=Math.sqrt(x*x+S*S),r[f]=this.rand(),i[f]=d.lerp(.25,1,this.rand()**.8),a[f]=.55+this.rand()*1.55,o[f]=y,s[f]=_}return{positions:t,radius:n,seed:r,alpha:i,sizeJitter:a,armOffset:o,featherOffset:s}}generateHeroStars(e){let t=new Float32Array(e*3),n=new Float32Array(e),r=new Float32Array(e),i=new Float32Array(e),a=new Float32Array(e),o=new Float32Array(e),s=this.baseStructure.galaxyRadius,c=this.baseStructure.armTightness,l=this.baseStructure.armWidth;this.resetDeterministicRandom(797689697);for(let u=0;u<e;u++){let e=18+this.rand()**.78*(s*.98),f=e/s,p=u%2*Math.PI,m=this.randomGaussian()*d.lerp(.45,1.05,f),h=this.rand()>.82?(this.rand()>.5?1:-1)*(.1+f*.12):0,g=p+e*c+h+m*l;e+=this.randomGaussian()*4.5;let _=Math.cos(g)*e,v=Math.sin(g)*e,y=this.randomGaussian()*d.lerp(3.5,13,f)*.35;t[u*3]=_,t[u*3+1]=y,t[u*3+2]=v,n[u]=Math.sqrt(_*_+v*v),r[u]=this.rand(),i[u]=.8+this.rand()**1.7*2.4,a[u]=m,o[u]=h}return{positions:t,radius:n,seed:r,sizeJitter:i,armOffset:a,featherOffset:o}}createGeometry(e){let t=new l;t.setAttribute(`position`,new o(e.positions,3));let n=(e,n)=>{n&&t.setAttribute(e,new o(n,1))};return n(`aRadius`,e.radius),n(`aSeed`,e.seed),n(`aLayer`,e.layer),n(`aAlpha`,e.alpha),n(`aSizeJitter`,e.sizeJitter),n(`aArmOffset`,e.armOffset),n(`aFeatherOffset`,e.featherOffset),t}setupGalaxyLayers(){this.disposeGalaxyLayers(),this.galaxyGroup=new i,this.scene.add(this.galaxyGroup),this.stellarMaterial=this.createStellarMaterial(),this.dustMaterial=this.createDustMaterial(),this.heroMaterial=this.createHeroMaterial(),this.stellarPoints=new a(this.createGeometry(this.generateStellarGalaxy(this.capacity.stellar)),this.stellarMaterial),this.dustPoints=new a(this.createGeometry(this.generateDustGalaxy(this.capacity.dust)),this.dustMaterial),this.heroPoints=new a(this.createGeometry(this.generateHeroStars(this.capacity.hero)),this.heroMaterial),this.stellarPoints.frustumCulled=!1,this.dustPoints.frustumCulled=!1,this.heroPoints.frustumCulled=!1,this.dustPoints.renderOrder=0,this.stellarPoints.renderOrder=1,this.heroPoints.renderOrder=2,this.galaxyGroup.add(this.dustPoints,this.stellarPoints,this.heroPoints),this.syncAllUniforms()}regenerateGalaxy(){this.syncAllUniforms()}disposeGalaxyLayers(){let e=e=>{e&&(e.parent&&e.parent.remove(e),e.geometry?.dispose(),e.material?.dispose())};e(this.stellarPoints),e(this.dustPoints),e(this.heroPoints),this.stellarPoints=null,this.dustPoints=null,this.heroPoints=null,this.stellarMaterial=null,this.dustMaterial=null,this.heroMaterial=null,this.galaxyGroup&&=(this.galaxyGroup.parent&&this.galaxyGroup.parent.remove(this.galaxyGroup),this.galaxyGroup.clear(),null)}createCommonUniforms(){return{uTime:{value:0},uGalaxyRadius:{value:this.settings.galaxyRadius},uBaseGalaxyRadius:{value:this.baseStructure.galaxyRadius},uArmTightness:{value:this.settings.armTightness},uBaseArmTightness:{value:this.baseStructure.armTightness},uArmWidth:{value:this.settings.armWidth},uBaseArmWidth:{value:this.baseStructure.armWidth},uCoreDensity:{value:this.settings.coreDensity},uDiskThickness:{value:this.settings.diskThickness},uFeatherStrength:{value:this.settings.featherStrength},uOuterSpread:{value:this.settings.outerSpread},uBass:{value:0},uMid:{value:0},uHigh:{value:0},uEnergy:{value:0},uMotion:{value:0},uBrightnessFeat:{value:0},uTextureFeat:{value:0},uSmoothnessFeat:{value:.5},uVariationFeat:{value:0},uKick:{value:0},uSnare:{value:0},uHihat:{value:0},uDownbeat:{value:0},uKickProgress:{value:1},uSnareProgress:{value:1},uDownbeatProgress:{value:1},uSensitivity:{value:this.settings.sensitivity},uBassFlow:{value:this.settings.bassFlow},uMidBreath:{value:this.settings.midBreath},uHighSparkle:{value:this.settings.highSparkle},uKickPulse:{value:this.settings.kickPulse},uSnareDust:{value:this.settings.snareDust},uDownbeatBreath:{value:this.settings.downbeatBreath},uFlowStrength:{value:this.settings.flowStrength},uArmBreath:{value:this.settings.armBreath},uPropagationStrength:{value:this.settings.propagationStrength},uColorIntensity:{value:this.settings.colorIntensity},uCoreWarmth:{value:this.settings.coreWarmth},uDepthFade:{value:this.settings.depthFade},uColorChangeIntensity:{value:this.settings.colorChangeIntensity},uBassWarmthColor:{value:this.settings.bassWarmthColor},uMidPaletteMorph:{value:this.settings.midPaletteMorph},uHighCoolTint:{value:this.settings.highCoolTint},uKickColorPulse:{value:this.settings.kickColorPulse},uDownbeatColorDrift:{value:this.settings.downbeatColorDrift},uPalettePhase:{value:this._palettePhase},uAudioHueShift:{value:0},uAudioSaturation:{value:1},uVioletBias:{value:this.settings.violetBias},uCoolBias:{value:this.settings.coolBias},uWarmLimit:{value:this.settings.warmLimit}}}createStellarMaterial(){let e=this.createCommonUniforms();return e.uSize={value:this.settings.stellarSize},e.uRotationSpeed={value:this.settings.shaderRotationSpeed},e.uSparkleThreshold={value:this.settings.sparkleThreshold},new r({transparent:!0,depthWrite:!1,blending:2,uniforms:e,vertexShader:this.getStellarVertexShader(),fragmentShader:this.getStellarFragmentShader()})}getStellarVertexShader(){return`
      uniform float uTime;
      uniform float uGalaxyRadius;
      uniform float uBaseGalaxyRadius;
      uniform float uArmTightness;
      uniform float uBaseArmTightness;
      uniform float uArmWidth;
      uniform float uBaseArmWidth;
      uniform float uCoreDensity;
      uniform float uDiskThickness;
      uniform float uFeatherStrength;
      uniform float uOuterSpread;
      uniform float uSize;
      uniform float uRotationSpeed;

      uniform float uBass;
      uniform float uMid;
      uniform float uHigh;
      uniform float uEnergy;
      uniform float uMotion;
      uniform float uBrightnessFeat;
      uniform float uVariationFeat;

      uniform float uKick;
      uniform float uHihat;
      uniform float uDownbeat;
      uniform float uKickProgress;
      uniform float uDownbeatProgress;

      uniform float uSensitivity;
      uniform float uBassFlow;
      uniform float uMidBreath;
      uniform float uHighSparkle;
      uniform float uKickPulse;
      uniform float uDownbeatBreath;
      uniform float uFlowStrength;
      uniform float uArmBreath;
      uniform float uPropagationStrength;

      attribute float aRadius;
      attribute float aSeed;
      attribute float aLayer;
      attribute float aSizeJitter;
      attribute float aArmOffset;
      attribute float aFeatherOffset;

      varying float vRadiusNorm;
      varying float vSeed;
      varying float vLayer;
      varying float vEnergy;
      varying float vSparkle;
      varying float vDepth;
      varying float vPulse;
      varying float vBrightnessFeat;

      mat2 rot(float a) {
        float c = cos(a);
        float s = sin(a);
        return mat2(c, -s, s, c);
      }

      void main() {
        vec3 pos = position;

        float structureScale = uGalaxyRadius / max(1.0, uBaseGalaxyRadius);
        pos.xz *= structureScale;
        pos.y *= uDiskThickness;

        float shapeAngle =
          aRadius * (uArmTightness - uBaseArmTightness) +
          aArmOffset * (uArmWidth - uBaseArmWidth) +
          aFeatherOffset * (uFeatherStrength - 1.0);
        if (aLayer < 1.5) pos.xz = rot(shapeAngle) * pos.xz;

        if (aLayer < 0.5) {
          float coreFocus = clamp((uCoreDensity - 0.12) / 0.38, 0.0, 1.0);
          pos.xz *= mix(1.30, 0.68, coreFocus);
          pos.y *= mix(1.08, 0.78, coreFocus);
        } else if (aLayer > 1.5) {
          pos.xz *= uOuterSpread;
          pos.y *= mix(0.8, 1.25, clamp(uOuterSpread - 0.65, 0.0, 1.0));
        }

        float rNorm = clamp(length(pos.xz) / max(1.0, uGalaxyRadius), 0.0, 1.15);

        float flowAudio =
          uBass * uBassFlow * 0.7 +
          uMotion * 0.35;

        float differential =
          mix(1.15, 0.45, clamp(rNorm, 0.0, 1.0));

        float flowAngle =
          uTime *
          uRotationSpeed *
          differential *
          (1.0 + flowAudio * uFlowStrength);

        // Variation 让每颗星的角速度产生轻微、连续的差异，避免整体同步旋转。
        flowAngle +=
          sin(uTime * (0.38 + aSeed * 0.34) + aSeed * 19.0) *
          uVariationFeat *
          0.045;

        pos.xz = rot(flowAngle) * pos.xz;

        vec2 radialDir =
          length(pos.xz) > 0.001
            ? normalize(pos.xz)
            : vec2(1.0, 0.0);

        vec2 tangentDir =
          vec2(-radialDir.y, radialDir.x);

        float breathPhase =
          uTime * (0.42 + uMotion * 0.18) -
          rNorm * 9.0 +
          aSeed * 6.28318;

        float armMask = 1.0 - step(1.5, aLayer);

        float breathAmp =
          uMid *
          uMidBreath *
          uArmBreath *
          mix(0.7, 2.8, rNorm) *
          armMask;

        pos.xz +=
          radialDir *
          sin(breathPhase) *
          breathAmp;

        float stream =
          sin(
            uTime * 0.32 -
            rNorm * 7.0 +
            aSeed * 4.0
          ) *
          0.5 +
          0.5;

        pos.xz +=
          tangentDir *
          stream *
          uBass *
          uBassFlow *
          uFlowStrength *
          mix(0.25, 1.7, rNorm);

        float kickWave =
          exp(
            -pow(
              (rNorm - uKickProgress) / 0.07,
              2.0
            )
          ) *
          uKick *
          uKickPulse *
          uPropagationStrength;

        pos.xz +=
          radialDir *
          kickWave *
          mix(1.8, 7.5, rNorm);

        float downbeatWave =
          exp(
            -pow(
              (rNorm - uDownbeatProgress) / 0.18,
              2.0
            )
          ) *
          uDownbeat *
          uDownbeatBreath *
          uPropagationStrength;

        pos.xz +=
          radialDir *
          downbeatWave *
          4.2;

        pos.y +=
          downbeatWave *
          (aSeed - 0.5) *
          2.8;

        float sparkleSeed =
          smoothstep(0.68, 0.98, aSeed);

        float twinkle =
          0.5 +
          0.5 *
          sin(
            uTime * (3.5 + aSeed * 4.0) +
            aSeed * 24.0
          );

        float sparkle =
          sparkleSeed *
          (uHigh * uHighSparkle + uHihat * 0.55 + 0.12) *
          twinkle;

        vec4 mvPos =
          modelViewMatrix * vec4(pos, 1.0);

        float perspective =
          300.0 / max(1.0, -mvPos.z);

        float layerScale =
          aLayer < 0.5
            ? 1.05
            : aLayer < 1.5
              ? 1.0
              : 0.72;

        gl_PointSize =
          uSize *
          aSizeJitter *
          layerScale *
          (1.0 +
            sparkle * 0.85 +
            kickWave * 0.18) *
          perspective;

        gl_Position =
          projectionMatrix * mvPos;

        vRadiusNorm = rNorm;
        vSeed = aSeed;
        vLayer = aLayer;
        vEnergy =
          clamp(
            (
              uEnergy * 0.65 +
              uBass * 0.2 +
              uMid * 0.15
            ) *
            uSensitivity,
            0.0,
            1.7
          );
        vSparkle = sparkle;
        vDepth = -mvPos.z;
        vPulse =
          kickWave +
          downbeatWave * 0.65;
        vBrightnessFeat = uBrightnessFeat;
      }
    `}getStellarFragmentShader(){return`
      uniform float uColorIntensity;
      uniform float uCoreWarmth;
      uniform float uDepthFade;
      uniform float uSparkleThreshold;
      uniform float uBass;
      uniform float uMid;
      uniform float uHigh;
      uniform float uTextureFeat;
      uniform float uColorChangeIntensity;
      uniform float uBassWarmthColor;
      uniform float uMidPaletteMorph;
      uniform float uHighCoolTint;
      uniform float uKickColorPulse;
      uniform float uPalettePhase;
      uniform float uAudioHueShift;
      uniform float uAudioSaturation;
      uniform float uVioletBias;
      uniform float uCoolBias;
      uniform float uWarmLimit;

      varying float vRadiusNorm;
      varying float vSeed;
      varying float vLayer;
      varying float vEnergy;
      varying float vSparkle;
      varying float vDepth;
      varying float vPulse;
      varying float vBrightnessFeat;

      vec3 electricIndigo(float r) {
        vec3 core = vec3(0.96, 0.95, 1.00);
        vec3 indigo = vec3(0.34, 0.42, 1.00);
        vec3 violet = vec3(0.58, 0.33, 1.00);
        vec3 deep = vec3(0.12, 0.18, 0.52);
        if (r < 0.22) return mix(core, indigo, smoothstep(0.0, 0.22, r));
        if (r < 0.68) return mix(indigo, violet, smoothstep(0.22, 0.68, r));
        return mix(violet, deep, smoothstep(0.68, 1.12, r));
      }

      vec3 ultraviolet(float r) {
        vec3 white = vec3(0.94, 0.93, 1.00);
        vec3 violet = vec3(0.58, 0.28, 1.00);
        vec3 magenta = vec3(0.92, 0.26, 0.78);
        vec3 midnight = vec3(0.14, 0.12, 0.42);
        if (r < 0.24) return mix(white, violet, smoothstep(0.0, 0.24, r));
        if (r < 0.70) return mix(violet, magenta, smoothstep(0.24, 0.70, r));
        return mix(magenta, midnight, smoothstep(0.70, 1.12, r));
      }

      vec3 solarRose(float r) {
        vec3 champagne = vec3(1.00, 0.80, 0.58);
        vec3 coral = vec3(1.00, 0.43, 0.48);
        vec3 rose = vec3(0.88, 0.28, 0.72);
        vec3 blue = vec3(0.20, 0.28, 0.72);
        if (r < 0.20) return mix(champagne, coral, smoothstep(0.0, 0.20, r));
        if (r < 0.62) return mix(coral, rose, smoothstep(0.20, 0.62, r));
        return mix(rose, blue, smoothstep(0.62, 1.12, r));
      }

      vec3 arcticCyan(float r) {
        vec3 silver = vec3(0.93, 0.98, 1.00);
        vec3 ice = vec3(0.35, 0.86, 1.00);
        vec3 cyan = vec3(0.16, 0.62, 0.92);
        vec3 deep = vec3(0.09, 0.20, 0.48);
        if (r < 0.22) return mix(silver, ice, smoothstep(0.0, 0.22, r));
        if (r < 0.70) return mix(ice, cyan, smoothstep(0.22, 0.70, r));
        return mix(cyan, deep, smoothstep(0.70, 1.12, r));
      }

      vec3 dynamicPalette(float r) {
        float p = fract(uPalettePhase + uAudioHueShift) * 4.0;
        if (p < 1.0) return mix(electricIndigo(r), ultraviolet(r), smoothstep(0.0, 1.0, p));
        if (p < 2.0) return mix(ultraviolet(r), solarRose(r), smoothstep(1.0, 2.0, p));
        if (p < 3.0) return mix(solarRose(r), arcticCyan(r), smoothstep(2.0, 3.0, p));
        return mix(arcticCyan(r), electricIndigo(r), smoothstep(3.0, 4.0, p));
      }

      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d2 = dot(uv, uv);
        if (d2 > 0.25) discard;

        float pointCore = exp(-22.0 * d2);
        float pointHalo = exp(-7.0 * d2);
        float colorDrive = clamp(uColorChangeIntensity, 0.0, 1.5);
        float morphDrive = clamp((0.30 + uMid * 0.78 + uTextureFeat * 0.46 + vEnergy * 0.22) * uMidPaletteMorph * colorDrive, 0.0, 1.0);

        vec3 col = mix(electricIndigo(vRadiusNorm), dynamicPalette(vRadiusNorm), morphDrive);

        // 音乐能量直接推动青蓝↔洋红色域，保证中频起伏时能肉眼辨认出色相变化。
        float musicColorDrive = clamp((uMid * 0.92 + uTextureFeat * 0.62 + vEnergy * 0.42) * colorDrive, 0.0, 1.0);
        float hueWave = 0.5 + 0.5 * sin((uPalettePhase + uAudioHueShift) * 6.28318 + vSeed * 2.1);
        vec3 musicAccent = mix(vec3(0.10, 0.76, 1.00), vec3(1.00, 0.10, 0.62), hueWave);
        col = mix(col, musicAccent, musicColorDrive * 0.52);

        // 低频只加热核心/内旋臂，避免整片银河变红。
        float innerMask = 1.0 - smoothstep(0.16, 0.64, vRadiusNorm);
        float warmAmount = clamp(uBass * uBassWarmthColor * innerMask * colorDrive, 0.0, uWarmLimit);
        vec3 warmColor = mix(vec3(1.0, 0.63, 0.46), vec3(1.0, 0.82, 0.62), uCoreWarmth);
        col = mix(col, warmColor, warmAmount * 0.76);

        // GUI 的冷/紫偏向是 grade，不是独立彩虹色。
        col = mix(col, col * vec3(0.86, 0.90, 1.14), clamp(uCoolBias, 0.0, 1.0) * 0.35);
        col = mix(col, col * vec3(1.08, 0.84, 1.16), clamp(uVioletBias, 0.0, 1.0) * 0.38);

        // Kick/Downbeat 的颜色与几何传播共用同一个传播波前。
        float chromaticPulse = clamp(vPulse * uKickColorPulse * colorDrive, 0.0, 1.0);
        vec3 pulseColor = mix(vec3(1.0, 0.77, 0.56), vec3(0.96, 0.33, 0.77), smoothstep(0.08, 0.75, vRadiusNorm));
        col = mix(col, pulseColor, chromaticPulse * 0.76);

        // High 只给高亮恒星冰蓝/淡紫 tint，不驱动几何抖动。
        float highMask = clamp(vSparkle * uHighCoolTint * colorDrive, 0.0, 1.0);
        vec3 highTint = mix(vec3(0.80, 0.95, 1.00), vec3(0.88, 0.78, 1.00), fract(vSeed * 3.7));
        col = mix(col, highTint, highMask * 0.48);

        float colorLuma = dot(col, vec3(0.2126, 0.7152, 0.0722));
        col = mix(vec3(colorLuma), col, uAudioSaturation);

        float coreWeight = 1.0 - smoothstep(0.06, 0.45, vRadiusNorm);
        float armWeight = 1.0 - step(1.5, vLayer);
        float baseBrightness = 0.52 + coreWeight * 0.32 + armWeight * 0.30 + vEnergy * 0.40 + vPulse * 0.58;
        float heroLike = smoothstep(uSparkleThreshold, 1.0, vSeed);
        float sparkleBoost = vSparkle * mix(0.35, 1.15, heroLike);
        float depth = clamp(1.0 - vDepth * uDepthFade, 0.30, 1.0);
        float luminance = (baseBrightness + sparkleBoost) * depth;

        vec3 finalCol = col * uColorIntensity * (pointCore * 1.12 + pointHalo * 0.24) * luminance;
        finalCol += highTint * pointCore * sparkleBoost * 0.30;
        float alpha = (pointCore * 0.94 + pointHalo * 0.17) * clamp(0.50 + luminance * 0.50, 0.0, 1.0);
        gl_FragColor = vec4(finalCol, alpha);
      }
    `}createDustMaterial(){let e=this.createCommonUniforms();return e.uSize={value:this.settings.dustSize},e.uOpacity={value:this.settings.dustOpacity},e.uRotationSpeed={value:this.settings.shaderRotationSpeed*.78},new r({transparent:!0,depthWrite:!1,blending:2,uniforms:e,vertexShader:this.getDustVertexShader(),fragmentShader:this.getDustFragmentShader()})}getDustVertexShader(){return`
      uniform float uTime;
      uniform float uGalaxyRadius;
      uniform float uBaseGalaxyRadius;
      uniform float uArmTightness;
      uniform float uBaseArmTightness;
      uniform float uArmWidth;
      uniform float uBaseArmWidth;
      uniform float uCoreDensity;
      uniform float uDiskThickness;
      uniform float uFeatherStrength;
      uniform float uOuterSpread;
      uniform float uSize;
      uniform float uRotationSpeed;

      uniform float uBass;
      uniform float uMid;
      uniform float uEnergy;
      uniform float uMotion;
      uniform float uTextureFeat;
      uniform float uSmoothnessFeat;

      uniform float uKick;
      uniform float uSnare;
      uniform float uDownbeat;
      uniform float uKickProgress;
      uniform float uSnareProgress;
      uniform float uDownbeatProgress;

      uniform float uBassFlow;
      uniform float uMidBreath;
      uniform float uKickPulse;
      uniform float uSnareDust;
      uniform float uDownbeatBreath;
      uniform float uFlowStrength;
      uniform float uArmBreath;
      uniform float uPropagationStrength;

      attribute float aRadius;
      attribute float aSeed;
      attribute float aAlpha;
      attribute float aSizeJitter;
      attribute float aArmOffset;
      attribute float aFeatherOffset;

      varying float vRadiusNorm;
      varying float vAlpha;
      varying float vEnergy;
      varying float vDepth;
      varying float vPulse;
      varying float vTexture;

      mat2 rot(float a) {
        float c = cos(a);
        float s = sin(a);
        return mat2(c, -s, s, c);
      }

      void main() {
        vec3 pos = position;
        float structureScale = uGalaxyRadius / max(1.0, uBaseGalaxyRadius);
        pos.xz *= structureScale;
        pos.y *= uDiskThickness;
        float shapeAngle =
          aRadius * (uArmTightness - uBaseArmTightness) +
          aArmOffset * (uArmWidth - uBaseArmWidth) +
          aFeatherOffset * (uFeatherStrength - 1.0);
        pos.xz = rot(shapeAngle) * pos.xz;
        float rNorm = clamp(length(pos.xz) / max(1.0, uGalaxyRadius), 0.0, 1.15);

        float differential =
          mix(
            1.05,
            0.42,
            clamp(
              rNorm,
              0.0,
              1.0
            )
          );

        float flowAudio =
          uBass * uBassFlow * 0.78 +
          uMotion * 0.48;

        float flowAngle =
          uTime *
          uRotationSpeed *
          differential *
          (
            1.0 +
            flowAudio *
              uFlowStrength
          );

        pos.xz =
          rot(flowAngle) *
          pos.xz;

        vec2 radialDir =
          length(pos.xz) > 0.001
            ? normalize(pos.xz)
            : vec2(1.0, 0.0);

        vec2 tangentDir =
          vec2(
            -radialDir.y,
            radialDir.x
          );

        float turbulence =
          sin(
            pos.x * 0.025 +
            uTime * 0.38 +
            aSeed * 7.0
          ) *
          cos(
            pos.z * 0.021 -
            uTime * 0.29 +
            aSeed * 5.0
          );

        turbulence *=
          mix(
            1.0,
            0.42,
            clamp(
              uSmoothnessFeat,
              0.0,
              1.0
            )
          );

        float textureAmp =
          (
            0.25 +
            uTextureFeat * 0.75
          ) *
          mix(
            0.8,
            2.8,
            rNorm
          );

        pos.xz +=
          tangentDir *
          turbulence *
          textureAmp;

        float breath =
          sin(
            uTime * 0.34 -
            rNorm * 8.0 +
            aSeed * 3.0
          ) *
          uMid *
          uMidBreath *
          uArmBreath;

        pos.xz +=
          radialDir *
          breath *
          mix(
            0.9,
            3.5,
            rNorm
          );

        pos.y +=
          breath *
          (aSeed - 0.5) *
          2.2;

        float kickWave =
          exp(
            -pow(
              (
                rNorm -
                uKickProgress
              ) /
                0.085,
              2.0
            )
          ) *
          uKick *
          uKickPulse *
          uPropagationStrength;

        float snareWave =
          exp(
            -pow(
              (
                rNorm -
                uSnareProgress
              ) /
                0.12,
              2.0
            )
          ) *
          uSnare *
          uSnareDust *
          uPropagationStrength;

        float downbeatWave =
          exp(
            -pow(
              (
                rNorm -
                uDownbeatProgress
              ) /
                0.20,
              2.0
            )
          ) *
          uDownbeat *
          uDownbeatBreath *
          uPropagationStrength;

        pos.xz +=
          radialDir *
          (
            kickWave * 5.5 +
            downbeatWave * 3.7
          );

        pos.y +=
          (aSeed - 0.5) *
          (
            snareWave * 8.0 +
            downbeatWave * 3.0
          );

        vec4 mvPos =
          modelViewMatrix *
          vec4(pos, 1.0);

        float perspective =
          300.0 /
          max(1.0, -mvPos.z);

        gl_PointSize =
          uSize *
          aSizeJitter *
          (
            1.0 +
            snareWave * 0.28 +
            uTextureFeat * 0.12
          ) *
          perspective;

        gl_Position =
          projectionMatrix *
          mvPos;

        vRadiusNorm = rNorm;
        vAlpha = aAlpha;
        vEnergy =
          clamp(
            uEnergy * 0.75 +
            uMid * 0.25,
            0.0,
            1.5
          );
        vDepth = -mvPos.z;
        vPulse =
          kickWave * 0.7 +
          snareWave +
          downbeatWave * 0.55;
        vTexture = uTextureFeat;
      }
    `}getDustFragmentShader(){return`
      uniform float uOpacity;
      uniform float uColorIntensity;
      uniform float uDepthFade;
      uniform float uBass;
      uniform float uMid;
      uniform float uTextureFeat;
      uniform float uColorChangeIntensity;
      uniform float uBassWarmthColor;
      uniform float uMidPaletteMorph;
      uniform float uKickColorPulse;
      uniform float uPalettePhase;
      uniform float uAudioHueShift;
      uniform float uAudioSaturation;
      uniform float uVioletBias;
      uniform float uCoolBias;
      uniform float uWarmLimit;

      varying float vRadiusNorm;
      varying float vAlpha;
      varying float vEnergy;
      varying float vDepth;
      varying float vPulse;
      varying float vTexture;

      vec3 electricDust(float r) {
        return mix(vec3(0.22, 0.28, 0.78), vec3(0.58, 0.30, 0.92), smoothstep(0.18, 0.88, r));
      }
      vec3 ultravioletDust(float r) {
        return mix(vec3(0.42, 0.26, 0.88), vec3(0.84, 0.24, 0.68), smoothstep(0.20, 0.90, r));
      }
      vec3 solarDust(float r) {
        return mix(vec3(0.94, 0.40, 0.48), vec3(0.48, 0.25, 0.80), smoothstep(0.15, 0.92, r));
      }
      vec3 arcticDust(float r) {
        return mix(vec3(0.18, 0.66, 0.90), vec3(0.24, 0.36, 0.78), smoothstep(0.20, 0.96, r));
      }
      vec3 dynamicDust(float r) {
        float p = fract(uPalettePhase + uAudioHueShift) * 4.0;
        if (p < 1.0) return mix(electricDust(r), ultravioletDust(r), smoothstep(0.0, 1.0, p));
        if (p < 2.0) return mix(ultravioletDust(r), solarDust(r), smoothstep(1.0, 2.0, p));
        if (p < 3.0) return mix(solarDust(r), arcticDust(r), smoothstep(2.0, 3.0, p));
        return mix(arcticDust(r), electricDust(r), smoothstep(3.0, 4.0, p));
      }

      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d2 = dot(uv, uv);
        if (d2 > 0.25) discard;

        float softCore = exp(-8.2 * d2);
        float softHalo = exp(-3.4 * d2);
        float colorDrive = clamp(uColorChangeIntensity, 0.0, 1.5);
        float morph = clamp((0.28 + uMid * 0.72 + uTextureFeat * 0.52 + vEnergy * 0.24) * uMidPaletteMorph * colorDrive, 0.0, 1.0);
        vec3 col = mix(electricDust(vRadiusNorm), dynamicDust(vRadiusNorm), morph);

        float musicColorDrive = clamp((uMid * 0.86 + uTextureFeat * 0.72 + vEnergy * 0.46) * colorDrive, 0.0, 1.0);
        float hueWave = 0.5 + 0.5 * sin((uPalettePhase + uAudioHueShift) * 6.28318 + vRadiusNorm * 3.4);
        vec3 musicAccent = mix(vec3(0.08, 0.70, 1.00), vec3(0.98, 0.08, 0.68), hueWave);
        col = mix(col, musicAccent, musicColorDrive * 0.58);

        float innerMask = 1.0 - smoothstep(0.12, 0.58, vRadiusNorm);
        float warmAmount = clamp(uBass * uBassWarmthColor * innerMask * colorDrive, 0.0, uWarmLimit);
        col = mix(col, vec3(0.96, 0.42, 0.46), warmAmount * 0.58);
        col = mix(col, col * vec3(0.88, 0.92, 1.14), clamp(uCoolBias, 0.0, 1.0) * 0.28);
        col = mix(col, col * vec3(1.10, 0.82, 1.14), clamp(uVioletBias, 0.0, 1.0) * 0.34);

        float pulse = clamp(vPulse * uKickColorPulse * colorDrive, 0.0, 1.0);
        vec3 pulseColor = mix(vec3(1.0, 0.53, 0.48), vec3(0.82, 0.28, 0.92), smoothstep(0.12, 0.82, vRadiusNorm));
        col = mix(col, pulseColor, pulse * 0.68);

        float colorLuma = dot(col, vec3(0.2126, 0.7152, 0.0722));
        col = mix(vec3(colorLuma), col, uAudioSaturation);

        float depth = clamp(1.0 - vDepth * uDepthFade, 0.22, 1.0);
        float brightness = 0.54 + vEnergy * 0.26 + pulse * 0.38 + vTexture * 0.10;
        vec3 finalCol = col * uColorIntensity * (softCore * 0.72 + softHalo * 0.30) * brightness * depth;
        float alpha = uOpacity * vAlpha * (softCore * 0.55 + softHalo * 0.30) * clamp(0.72 + vEnergy * 0.20 + pulse * 0.18, 0.0, 1.15);
        gl_FragColor = vec4(finalCol, alpha);
      }
    `}createHeroMaterial(){let e=this.createCommonUniforms();return e.uSize={value:this.settings.heroSize},e.uHeroBrightness={value:this.settings.heroBrightness},e.uRotationSpeed={value:this.settings.shaderRotationSpeed},new r({transparent:!0,depthWrite:!1,blending:2,uniforms:e,vertexShader:this.getHeroVertexShader(),fragmentShader:this.getHeroFragmentShader()})}getHeroVertexShader(){return`
      uniform float uTime;
      uniform float uGalaxyRadius;
      uniform float uBaseGalaxyRadius;
      uniform float uArmTightness;
      uniform float uBaseArmTightness;
      uniform float uArmWidth;
      uniform float uBaseArmWidth;
      uniform float uCoreDensity;
      uniform float uDiskThickness;
      uniform float uFeatherStrength;
      uniform float uOuterSpread;
      uniform float uSize;
      uniform float uRotationSpeed;

      uniform float uBass;
      uniform float uHigh;
      uniform float uEnergy;
      uniform float uMotion;

      uniform float uKick;
      uniform float uDownbeat;
      uniform float uKickProgress;
      uniform float uDownbeatProgress;

      uniform float uBassFlow;
      uniform float uHighSparkle;
      uniform float uKickPulse;
      uniform float uDownbeatBreath;
      uniform float uFlowStrength;
      uniform float uPropagationStrength;

      attribute float aRadius;
      attribute float aSeed;
      attribute float aSizeJitter;
      attribute float aArmOffset;
      attribute float aFeatherOffset;

      varying float vRadiusNorm;
      varying float vSeed;
      varying float vTwinkle;
      varying float vPulse;
      varying float vDepth;

      mat2 rot(float a) {
        float c = cos(a);
        float s = sin(a);
        return mat2(c, -s, s, c);
      }

      void main() {
        vec3 pos = position;
        float structureScale = uGalaxyRadius / max(1.0, uBaseGalaxyRadius);
        pos.xz *= structureScale;
        pos.y *= uDiskThickness;
        float shapeAngle =
          aRadius * (uArmTightness - uBaseArmTightness) +
          aArmOffset * (uArmWidth - uBaseArmWidth) +
          aFeatherOffset * (uFeatherStrength - 1.0);
        pos.xz = rot(shapeAngle) * pos.xz;
        float rNorm = clamp(length(pos.xz) / max(1.0, uGalaxyRadius), 0.0, 1.15);

        float flow =
          uTime *
          uRotationSpeed *
          mix(
            1.15,
            0.5,
            clamp(
              rNorm,
              0.0,
              1.0
            )
          ) *
          (
            1.0 +
            uBass *
              uBassFlow *
              uFlowStrength *
              0.45 +
            uMotion * 0.18
          );

        pos.xz =
          rot(flow) *
          pos.xz;

        vec2 radialDir =
          length(pos.xz) >
          0.001
            ? normalize(pos.xz)
            : vec2(
                1.0,
                0.0
              );

        float kickWave =
          exp(
            -pow(
              (
                rNorm -
                uKickProgress
              ) /
                0.065,
              2.0
            )
          ) *
          uKick *
          uKickPulse *
          uPropagationStrength;

        float downbeatWave =
          exp(
            -pow(
              (
                rNorm -
                uDownbeatProgress
              ) /
                0.17,
              2.0
            )
          ) *
          uDownbeat *
          uDownbeatBreath *
          uPropagationStrength;

        pos.xz +=
          radialDir *
          (
            kickWave * 6.5 +
            downbeatWave * 3.7
          );

        float twinkle =
          0.5 +
          0.5 *
          sin(
            uTime *
              (
                2.5 +
                aSeed * 6.0
              ) +
            aSeed * 28.0
          );

        float sparkle =
          twinkle *
          (
            0.28 +
            uHigh *
              uHighSparkle *
              1.15 +
            uEnergy * 0.18
          );

        vec4 mvPos =
          modelViewMatrix *
          vec4(
            pos,
            1.0
          );

        float perspective =
          300.0 /
          max(
            1.0,
            -mvPos.z
          );

        gl_PointSize =
          uSize *
          aSizeJitter *
          (
            0.72 +
            sparkle * 0.86 +
            kickWave * 0.28
          ) *
          perspective;

        gl_Position =
          projectionMatrix *
          mvPos;

        vRadiusNorm =
          rNorm;
        vSeed =
          aSeed;
        vTwinkle =
          sparkle;
        vPulse =
          kickWave +
          downbeatWave * 0.6;
        vDepth =
          -mvPos.z;
      }
    `}getHeroFragmentShader(){return`
      uniform float uHeroBrightness;
      uniform float uColorIntensity;
      uniform float uDepthFade;
      uniform float uColorChangeIntensity;
      uniform float uHighCoolTint;
      uniform float uKickColorPulse;
      uniform float uPalettePhase;
      uniform float uAudioHueShift;
      uniform float uAudioSaturation;

      varying float vRadiusNorm;
      varying float vSeed;
      varying float vTwinkle;
      varying float vPulse;
      varying float vDepth;

      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        if (d > 0.5) discard;

        float core = exp(-34.0 * d * d);
        float halo = exp(-8.0 * d * d);
        float rayX = exp(-95.0 * abs(uv.x)) * exp(-6.0 * abs(uv.y));
        float rayY = exp(-95.0 * abs(uv.y)) * exp(-6.0 * abs(uv.x));
        float rayMask = step(0.82, fract(vSeed * 5.17));
        float rays = (rayX + rayY) * rayMask;

        float phase = fract(uPalettePhase + uAudioHueShift);
        vec3 silver = vec3(0.95, 0.98, 1.00);
        vec3 ice = vec3(0.62, 0.90, 1.00);
        vec3 paleViolet = vec3(0.88, 0.76, 1.00);
        vec3 tint = mix(ice, paleViolet, 0.5 + 0.5 * sin(phase * 6.28318 + vSeed * 8.0));
        float highTint = clamp(vTwinkle * uHighCoolTint * uColorChangeIntensity, 0.0, 1.0);
        vec3 col = mix(silver, tint, highTint * 0.68);

        float pulse = clamp(vPulse * uKickColorPulse * uColorChangeIntensity, 0.0, 1.0);
        vec3 pulseColor = mix(vec3(1.0, 0.80, 0.58), vec3(0.96, 0.45, 0.82), smoothstep(0.08, 0.78, vRadiusNorm));
        col = mix(col, pulseColor, pulse * 0.70);

        float colorLuma = dot(col, vec3(0.2126, 0.7152, 0.0722));
        col = mix(vec3(colorLuma), col, uAudioSaturation);

        float depth = clamp(1.0 - vDepth * uDepthFade, 0.32, 1.0);
        float luminosity = uHeroBrightness * uColorIntensity * depth * (0.76 + vTwinkle * 0.62 + pulse * 0.46);
        vec3 finalCol = col * (core * 1.35 + halo * 0.28 + rays * 0.16) * luminosity;
        float alpha = clamp(core * 0.98 + halo * 0.20 + rays * 0.10, 0.0, 1.0);
        gl_FragColor = vec4(finalCol, alpha);
      }
    `}updateEnvelope(e,t,n,r,i){let a=t>e?r:i;return e+(t-e)*(1-Math.exp(-n/Math.max(a,.001)))}updateWithAudioData(e,t){if(!e||e.isPlaying!==!0||!e.audioFeature?.animation){this.hasAudioData=!1,this._lastAudioTime=null,this._lastKickInput=0,this._lastSnareInput=0,this._lastDownbeatInput=!1;return}this.hasAudioData=!0;let n=Number.isFinite(t)?t*.001:performance.now()*.001,r=this._lastAudioTime===null?1/60:d.clamp(n-this._lastAudioTime,1/240,.1);this._lastAudioTime=n;let i=e.audioFeature.animation,a=d.lerp(.55,1.9,this.settings.smoothing);this.bass=this.updateEnvelope(this.bass,d.clamp(i.bass||0,0,1.5),r,.045*a,.38*a),this.mid=this.updateEnvelope(this.mid,d.clamp(i.mid||0,0,1.5),r,.07*a,.3*a),this.high=this.updateEnvelope(this.high,d.clamp(i.high||0,0,1.5),r,.025*a,.13*a),this.energyLevel=this.updateEnvelope(this.energyLevel,d.clamp(i.energy||0,0,1.5),r,.06*a,.34*a),this.motionVal=this.updateEnvelope(this.motionVal,d.clamp(i.motion||0,0,1.5),r,.07,.32),this.brightnessVal=this.updateEnvelope(this.brightnessVal,d.clamp(i.brightness||0,0,1.5),r,.08,.36),this.textureVal=this.updateEnvelope(this.textureVal,d.clamp(i.texture||0,0,1.5),r,.07,.28),this.smoothnessVal=this.updateEnvelope(this.smoothnessVal,d.clamp(i.smoothness??.5,0,1),r,.12,.42),this.variationVal=this.updateEnvelope(this.variationVal,d.clamp(i.variation||0,0,1.5),r,.09,.34);let o=d.clamp(i.kick||0,0,1.5),s=d.clamp(i.snare||0,0,1.5),c=d.clamp(i.hihat||0,0,1.5),l=!!(i.isDownbeat||(i.downbeat||0)>.5);if(o>.42&&this._lastKickInput<=.42&&(this._kickProgress=0,this._kickEnvelope=Math.max(this._kickEnvelope,o)),s>.36&&this._lastSnareInput<=.36&&(this._snareProgress=0,this._snareEnvelope=Math.max(this._snareEnvelope,s)),l&&!this._lastDownbeatInput&&(this._downbeatProgress=0,this._downbeatEnvelope=Math.max(this._downbeatEnvelope,d.clamp(i.downbeat||o||.72,0,1.5))),this._hihatEnvelope=Math.max(this._hihatEnvelope,c),this._lastKickInput=o,this._lastSnareInput=s,this._lastDownbeatInput=l,this.writeAudioUniforms(),this.bloomPass){let e=this.settings.bloomStrength+this.energyLevel*.16+this.brightnessVal*.09+this._kickEnvelope*.08+this._downbeatEnvelope*.1;this.bloomPass.strength=d.lerp(this.bloomPass.strength,e,1-Math.exp(-r/.08)),this.bloomPass.radius=this.settings.bloomRadius,this.bloomPass.threshold=this.settings.bloomThreshold}}getMaterials(){return[this.stellarMaterial,this.dustMaterial,this.heroMaterial].filter(Boolean)}writeAudioUniforms(){let e={uBass:this.bass,uMid:this.mid,uHigh:this.high,uEnergy:this.energyLevel,uMotion:this.motionVal*this.settings.motionIntensity,uBrightnessFeat:this.brightnessVal,uTextureFeat:this.textureVal*this.settings.textureIntensity,uSmoothnessFeat:this.smoothnessVal,uVariationFeat:this.variationVal*this.settings.variationIntensity,uKick:this._kickEnvelope,uSnare:this._snareEnvelope,uHihat:this._hihatEnvelope,uDownbeat:this._downbeatEnvelope,uKickProgress:this._kickProgress,uSnareProgress:this._snareProgress,uDownbeatProgress:this._downbeatProgress,uAudioHueShift:this.mid*.48+this.high*.32+this.textureVal*.18+this.variationVal*.12,uAudioSaturation:1+d.clamp(this.bass*.52+this.energyLevel*.22,0,.78)};for(let t of this.getMaterials())for(let[n,r]of Object.entries(e))t.uniforms[n]&&(t.uniforms[n].value=r)}render(){let e=performance.now()*.001,t=this._lastRenderTime===null?1/60:d.clamp(e-this._lastRenderTime,1/240,.05);this._lastRenderTime=e,this._kickProgress=Math.min(1,this._kickProgress+t*1.55),this._snareProgress=Math.min(1,this._snareProgress+t*1.25),this._downbeatProgress=Math.min(1,this._downbeatProgress+t*.78),this._kickEnvelope*=Math.exp(-t/.28),this._snareEnvelope*=Math.exp(-t/.22),this._hihatEnvelope*=Math.exp(-t/.085),this._downbeatEnvelope*=Math.exp(-t/.55);let n=(.065+(this.hasAudioData?d.clamp(this.mid*.48+this.textureVal*.3+this.variationVal*.1+this.energyLevel*.12,0,1.5):.04)*.135+this._downbeatEnvelope*.12*this.settings.downbeatColorDrift)*this.settings.colorEvolutionSpeed;this._palettePhase=(this._palettePhase+t*n)%1;for(let t of this.getMaterials())t.uniforms.uTime&&(t.uniforms.uTime.value=e),t.uniforms.uPalettePhase&&(t.uniforms.uPalettePhase.value=this._palettePhase);this.hasAudioData?this.writeAudioUniforms():this.updateIdleState(e,t),this.mouseControls.autoRotate&&!this.mouseControls.isMouseDown&&this.galaxyGroup&&(this.galaxyGroup.rotation.y+=this.settings.rotationSpeed),this.controls?.update();try{this.composer?this.composer.render():this.renderer?.render(this.scene,this.camera)}catch(e){console.error(`❌ Animation4 渲染错误:`,e)}}updateIdleState(e,t){let n=.08+Math.sin(e*.37)*.015,r=.065+Math.sin(e*.29+1.2)*.012,i=.04+Math.sin(e*.63+2)*.008;this.bass=this.updateEnvelope(this.bass,n,t,.3,.7),this.mid=this.updateEnvelope(this.mid,r,t,.35,.8),this.high=this.updateEnvelope(this.high,i,t,.2,.5),this.energyLevel=this.updateEnvelope(this.energyLevel,.055,t,.4,.8),this.motionVal=this.updateEnvelope(this.motionVal,.08,t,.4,.8),this.brightnessVal=this.updateEnvelope(this.brightnessVal,.14,t,.5,.9),this.textureVal=this.updateEnvelope(this.textureVal,.12,t,.5,.9),this.smoothnessVal=this.updateEnvelope(this.smoothnessVal,.75,t,.5,.9),this.variationVal=this.updateEnvelope(this.variationVal,.08,t,.5,.9),this._kickEnvelope=0,this._snareEnvelope=0,this._hihatEnvelope=0,this._downbeatEnvelope=0,this._kickProgress=1,this._snareProgress=1,this._downbeatProgress=1,this.writeAudioUniforms(),this.bloomPass&&(this.bloomPass.strength=d.lerp(this.bloomPass.strength,this.settings.bloomStrength,1-Math.exp(-t/.25)),this.bloomPass.radius=this.settings.bloomRadius,this.bloomPass.threshold=this.settings.bloomThreshold)}syncAllUniforms(){let e={uGalaxyRadius:this.settings.galaxyRadius,uArmTightness:this.settings.armTightness,uArmWidth:this.settings.armWidth,uCoreDensity:this.settings.coreDensity,uDiskThickness:this.settings.diskThickness,uFeatherStrength:this.settings.featherStrength,uOuterSpread:this.settings.outerSpread,uSensitivity:this.settings.sensitivity,uBassFlow:this.settings.bassFlow,uMidBreath:this.settings.midBreath,uHighSparkle:this.settings.highSparkle,uKickPulse:this.settings.kickPulse,uSnareDust:this.settings.snareDust,uDownbeatBreath:this.settings.downbeatBreath,uFlowStrength:this.settings.flowStrength,uArmBreath:this.settings.armBreath,uPropagationStrength:this.settings.propagationStrength,uColorIntensity:this.settings.colorIntensity,uCoreWarmth:this.settings.coreWarmth,uDepthFade:this.settings.depthFade,uColorChangeIntensity:this.settings.colorChangeIntensity,uBassWarmthColor:this.settings.bassWarmthColor,uMidPaletteMorph:this.settings.midPaletteMorph,uHighCoolTint:this.settings.highCoolTint,uKickColorPulse:this.settings.kickColorPulse,uDownbeatColorDrift:this.settings.downbeatColorDrift,uPalettePhase:this._palettePhase,uVioletBias:this.settings.violetBias,uCoolBias:this.settings.coolBias,uWarmLimit:this.settings.warmLimit};for(let t of this.getMaterials())for(let[n,r]of Object.entries(e))t.uniforms[n]&&(t.uniforms[n].value=r);this.stellarMaterial&&(this.stellarMaterial.uniforms.uSize.value=this.settings.stellarSize,this.stellarMaterial.uniforms.uRotationSpeed.value=this.settings.shaderRotationSpeed,this.stellarMaterial.uniforms.uSparkleThreshold.value=this.settings.sparkleThreshold),this.dustMaterial&&(this.dustMaterial.uniforms.uSize.value=this.settings.dustSize,this.dustMaterial.uniforms.uOpacity.value=this.settings.dustOpacity,this.dustMaterial.uniforms.uRotationSpeed.value=this.settings.shaderRotationSpeed*.78),this.heroMaterial&&(this.heroMaterial.uniforms.uSize.value=this.settings.heroSize,this.heroMaterial.uniforms.uHeroBrightness.value=this.settings.heroBrightness,this.heroMaterial.uniforms.uRotationSpeed.value=this.settings.shaderRotationSpeed),this.stellarPoints?.geometry.setDrawRange(0,Math.round(d.clamp(this.settings.stellarCount,1,this.capacity.stellar))),this.dustPoints?.geometry.setDrawRange(0,Math.round(d.clamp(this.settings.dustCount,1,this.capacity.dust))),this.heroPoints?.geometry.setDrawRange(0,Math.round(d.clamp(this.settings.heroCount,1,this.capacity.hero))),this.renderer&&(this.renderer.toneMappingExposure=this.settings.exposure),this.bloomPass&&(this.bloomPass.strength=this.settings.bloomStrength,this.bloomPass.radius=this.settings.bloomRadius,this.bloomPass.threshold=this.settings.bloomThreshold),this.mouseControls.autoRotate=this.settings.autoRotate,this.writeAudioUniforms()}resetParams(){Object.assign(this.settings,this.defaultSettings),this.resetCamera(),this.resetState(),this.syncAllUniforms();let e=t=>{t.controllers?.forEach(e=>e.updateDisplay()),t.folders&&Object.values(t.folders).forEach(t=>e(t))};this.gui&&e(this.gui),console.log(`✅ Animation4 参数已重置`)}updateSettings(e){Object.assign(this.settings,e),Object.prototype.hasOwnProperty.call(e,`cameraDistance`)&&this.applyCameraDistance(e.cameraDistance),this.syncAllUniforms()}applyCameraDistance(e){if(!this.camera||!this.controls)return;let t=this.controls.target.clone(),n=this.camera.position.clone().sub(t).normalize();this.camera.position.copy(t).addScaledVector(n,e),this.controls.update()}setupMouseControls(){let e=this.renderer.domElement,t=t=>{t.button===0&&(this.mouseControls.isMouseDown=!0,this.mouseControls.autoRotate=!1,this._autoRotateTimer&&clearTimeout(this._autoRotateTimer),e.setPointerCapture?.(t.pointerId))},n=e=>{e.type!==`pointercancel`&&e.button!==0||(this.mouseControls.isMouseDown=!1,this._autoRotateTimer&&clearTimeout(this._autoRotateTimer),this._autoRotateTimer=setTimeout(()=>{this.mouseControls.isMouseDown||(this.mouseControls.autoRotate=this.settings.autoRotate)},1800))},r=()=>{this.mouseControls.autoRotate=!1,this._autoRotateTimer&&clearTimeout(this._autoRotateTimer),this._autoRotateTimer=setTimeout(()=>{this.mouseControls.isMouseDown||(this.mouseControls.autoRotate=this.settings.autoRotate)},1e3)},i=e=>{e.preventDefault()};this._mouseHandlers={onPointerDown:t,onPointerUp:n,onWheel:r,onContextMenu:i},e.addEventListener(`pointerdown`,t),window.addEventListener(`pointerup`,n),window.addEventListener(`pointercancel`,n),e.addEventListener(`wheel`,r,{passive:!0}),e.addEventListener(`contextmenu`,i)}onWindowResize(){try{if(!this.camera||!this.renderer)return;let e=window.innerWidth,t=window.innerHeight;this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t),this.composer?.setSize(e,t)}catch(e){console.error(`❌ Animation4 窗口调整错误:`,e)}}resetState(){this.hasAudioData=!1,this.bass=0,this.mid=0,this.high=0,this.energyLevel=0,this.motionVal=0,this.brightnessVal=0,this.textureVal=0,this.smoothnessVal=.5,this.variationVal=0,this._kickEnvelope=0,this._snareEnvelope=0,this._hihatEnvelope=0,this._downbeatEnvelope=0,this._kickProgress=1,this._snareProgress=1,this._downbeatProgress=1,this._lastKickInput=0,this._lastSnareInput=0,this._lastDownbeatInput=!1,this._lastAudioTime=null,this._palettePhase=.055,this.writeAudioUniforms()}resetCamera(){this.camera&&(this.camera.position.set(-255.28,264.2,355.51),this.controls&&(this.controls.target.set(0,0,0),this.controls.update()))}createGUIContainer(){let e=document.getElementById(`Animation4-settings-button`);e||(e=g(`Animation4-settings-button`),document.body.appendChild(e)),this.settingsButton=e,e._animation4Handler&&e.removeEventListener(`click`,e._animation4Handler),e._animation4Handler=()=>this.toggleGUI(),e.addEventListener(`click`,e._animation4Handler);let t=document.getElementById(`Animation4-gui-container`);t||(t=v(`Animation4-gui-container`),document.body.appendChild(t));let n=document.getElementById(`Animation4-gui-scrollbar-style`);n||(n=y(`Animation4-gui-container`),n.id=`Animation4-gui-scrollbar-style`),this.guiContainer=t,this.guiScrollbarStyle=n}createGUI(){this.gui&&this.gui.destroy(),this.createGUIContainer(),e(()=>import(`./lil-gui.esm-Dmd9RIzu.js`).then(e=>{if(!this.settingsButton||!this.guiContainer)return;let t=e.default;this.gui=new t({container:this.guiContainer,title:`银河旋臂`}),this.gui.$title.style.pointerEvents=`none`,this.gui.hide();let n=e=>e.onChange(()=>this.syncAllUniforms()),r=this.gui.addFolder(`银河构图`);n(r.add(this.settings,`galaxyRadius`,220,430,1).name(`银河尺寸`)),n(r.add(this.settings,`armTightness`,.018,.072,.001).name(`旋臂紧密度`)),n(r.add(this.settings,`armWidth`,.16,.9,.01).name(`旋臂宽度`)),n(r.add(this.settings,`coreDensity`,.12,.5,.01).name(`核心集中度`)),n(r.add(this.settings,`diskThickness`,.35,2.2,.01).name(`盘面厚度`)),n(r.add(this.settings,`featherStrength`,0,2.2,.01).name(`羽状支流`)),n(r.add(this.settings,`outerSpread`,.65,1.45,.01).name(`外围扩散`)),n(r.add(this.settings,`stellarCount`,4e4,this.capacity.stellar,1e3).name(`恒星数量`)),n(r.add(this.settings,`dustCount`,5e3,this.capacity.dust,1e3).name(`星云数量`)),n(r.add(this.settings,`heroCount`,100,this.capacity.hero,50).name(`亮星数量`));let i=this.gui.addFolder(`材质与光效`);n(i.add(this.settings,`stellarSize`,.4,5,.05).name(`恒星尺寸`)),n(i.add(this.settings,`dustSize`,2,18,.1).name(`星云尺寸`)),n(i.add(this.settings,`dustOpacity`,0,.65,.01).name(`星云透明度`)),n(i.add(this.settings,`heroSize`,1,10,.1).name(`亮星尺寸`)),n(i.add(this.settings,`heroBrightness`,.3,2.5,.01).name(`亮星亮度`)),n(i.add(this.settings,`colorIntensity`,.35,1.8,.01).name(`整体亮度`)),n(i.add(this.settings,`depthFade`,0,.004,5e-5).name(`空间衰减`)),n(i.add(this.settings,`exposure`,.65,1.8,.01).name(`曝光`)),n(i.add(this.settings,`bloomStrength`,0,2.5,.01).name(`Bloom强度`)),n(i.add(this.settings,`bloomRadius`,0,.7,.01).name(`Bloom半径`)),n(i.add(this.settings,`bloomThreshold`,0,1,.01).name(`Bloom阈值`));let a=this.gui.addFolder(`综合色彩`);n(a.add(this.settings,`colorChangeIntensity`,0,1.5,.01).name(`颜色变化强度`)),n(a.add(this.settings,`bassWarmthColor`,0,1.8,.01).name(`低频色温响应`)),n(a.add(this.settings,`midPaletteMorph`,0,1.6,.01).name(`中频Palette Morph`)),n(a.add(this.settings,`highCoolTint`,0,1.8,.01).name(`高频冷色闪耀`)),n(a.add(this.settings,`kickColorPulse`,0,2,.01).name(`节拍颜色传播`)),n(a.add(this.settings,`downbeatColorDrift`,0,1.8,.01).name(`重拍色彩演化`)),a.add(this.settings,`colorEvolutionSpeed`,0,2.5,.01).name(`色彩演化速度`),n(a.add(this.settings,`violetBias`,0,1,.01).name(`紫色倾向`)),n(a.add(this.settings,`coolBias`,0,1,.01).name(`冷色倾向`)),n(a.add(this.settings,`warmLimit`,0,1,.01).name(`暖色上限`)),n(a.add(this.settings,`coreWarmth`,0,1,.01).name(`核心暖色`));let o=this.gui.addFolder(`银河运动`);o.add(this.settings,`rotationSpeed`,0,.002,1e-5).name(`整体旋转`),n(o.add(this.settings,`shaderRotationSpeed`,0,.12,.001).name(`差速流速`)),n(o.add(this.settings,`flowStrength`,0,2.5,.01).name(`流场强度`)),n(o.add(this.settings,`armBreath`,0,2.5,.01).name(`旋臂呼吸`)),n(o.add(this.settings,`propagationStrength`,0,2.5,.01).name(`传播强度`)),o.add(this.settings,`autoRotate`).name(`自动旋转`).onChange(e=>{this.mouseControls.autoRotate=e});let s=this.gui.addFolder(`音频响应`);n(s.add(this.settings,`sensitivity`,.2,2.5,.01).name(`整体敏感度`)),s.add(this.settings,`smoothing`,.05,1,.01).name(`平滑系数`),n(s.add(this.settings,`bassFlow`,0,2.5,.01).name(`Bass→流动`)),n(s.add(this.settings,`midBreath`,0,2.5,.01).name(`Mid→呼吸`)),n(s.add(this.settings,`highSparkle`,0,2.5,.01).name(`High→闪耀`)),n(s.add(this.settings,`kickPulse`,0,2.5,.01).name(`Kick→传播`)),n(s.add(this.settings,`snareDust`,0,2.5,.01).name(`Snare→星云`)),n(s.add(this.settings,`downbeatBreath`,0,2.5,.01).name(`Downbeat→呼吸`)),s.add(this.settings,`motionIntensity`,0,2,.01).name(`Motion强度`),s.add(this.settings,`textureIntensity`,0,2,.01).name(`Texture强度`),s.add(this.settings,`variationIntensity`,0,2,.01).name(`Variation强度`),this.gui.add(this.guiActions,`resetParams`).name(`重置参数`)}),__vite__mapDeps([0,1])).catch(e=>{console.error(`❌ Animation4 GUI 创建失败:`,e)})}toggleGUI(){return this.gui?(this.guiVisible=!this.guiVisible,this.guiVisible?this.gui.show():this.gui.hide(),this.guiVisible):!1}setEffectMode(e){return console.log(`✅ Animation4 使用固定效果模式: Cinematic Living Galaxy`),e===`galaxy`||e==null}getEffectModes(){return[{id:`galaxy`,name:`Spectral Living Galaxy`}]}hasEffectModes(){return!1}setColorMode(){return!0}createEffectModesUI(e,t){try{e.innerHTML=``;let t=document.createElement(`option`);return t.value=`galaxy`,t.textContent=`Spectral Living Galaxy`,t.selected=!0,e.appendChild(t),!0}catch(e){return console.error(`❌ Animation4 创建效果模式 UI 失败:`,e),!1}}triggerEffect(){this._kickProgress=0,this._kickEnvelope=Math.max(this._kickEnvelope,.9),this.writeAudioUniforms()}dispose(){try{this._autoRotateTimer&&=(clearTimeout(this._autoRotateTimer),null);let e=this.renderer?.domElement;e&&this._mouseHandlers&&(e.removeEventListener(`pointerdown`,this._mouseHandlers.onPointerDown),window.removeEventListener(`pointerup`,this._mouseHandlers.onPointerUp),window.removeEventListener(`pointercancel`,this._mouseHandlers.onPointerUp),e.removeEventListener(`wheel`,this._mouseHandlers.onWheel),e.removeEventListener(`contextmenu`,this._mouseHandlers.onContextMenu)),this._mouseHandlers=null,this.settingsButton?._animation4Handler&&(this.settingsButton.removeEventListener(`click`,this.settingsButton._animation4Handler),delete this.settingsButton._animation4Handler),_(this.settingsButton,this.guiContainer,this.gui),this.guiScrollbarStyle?.remove(),this.settingsButton=null,this.guiContainer=null,this.gui=null,this.guiScrollbarStyle=null,this.controls?.dispose(),this.controls=null,this.disposeGalaxyLayers(),this.composer&&=(this.composer.dispose(),null),this.renderer&&=(this.renderer.dispose(),null),this.scene=null,this.camera=null,this.bloomPass=null,console.log(`✅ Animation4 V2 资源已清理`)}catch(e){console.error(`❌ Animation4 V2 清理资源错误:`,e)}}};export{x as default};