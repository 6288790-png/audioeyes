import{a as e}from"./lil-gui.esm-jlbWO7FJ.js";import{Gn as t,Ht as n,Jn as r,Tt as i,f as a,pt as o,qn as s,r as c,sr as l,wr as u,xt as d,zt as f}from"./three.module-CgISyWQV.js";import{t as p}from"./pointer-input-D1lPjgVB.js";import{d as m}from"./dist-Dn8kJ3dz.js";import{i as h,n as g,r as _,t as v}from"./GUIHelper-DspWBXk2.js";var y=Object.freeze({edgeStyle:`liquidRefraction`,effectIntensity:.8,animationSpeed:1,doubleClickToggle:!0,threshold:.06,softness:.26,edgeStrength:3e-4,rimStrength:.35,baseBrightness:1,revealBrightness:1,imageContrast:1,imageSaturation:1,imageGamma:1,imageTemperature:0,imageBlackPoint:0,imageSharpness:0,imageScale:1,splatRadius:.015,splatForce:6,densityDissipation:.975,velocityDissipation:.94}),b=Object.freeze({liquidRefraction:0,rgbChromatic:1,rainbowOil:2,electric:3,scanline:4,fireBurn:5,moltenMetal:6,dropletHighlight:7}),x=class{constructor(e,t={}){this.canvas=e,this.settings={...y,...t},this._disposed=!1,this._lastTime=performance.now(),this._ownedTextures=new Set,this.guiVisible=!1,this.fullReveal=!1,this.revealOverride=0,this.revealOverrideTarget=0,this.initPromise=this.init()}async init(){return this.renderer||this._disposed?!0:(this.setupRenderer(),this.setupFluid(),this.setupComposition(),await this.loadDefaultImages(),this.setupInputs(),this.setupWheelZoom(),this.setupDoubleClickToggle(),this.setupGUI(),this.setupSettingsButton(),this.resize(),!0)}setupRenderer(){this.renderer=new c({canvas:this.canvas,alpha:!1,antialias:!0,powerPreference:`high-performance`}),this.renderer.outputColorSpace=t,this.renderer.setClearColor(329224,1),this.scene=new s,this.camera=new f(-1,1,1,-1,0,1)}setupFluid(){this.fluid=new m(this.renderer,{profile:`balanced`,splatRadius:this.settings.splatRadius,splatForce:this.settings.splatForce,densityDissipation:this.settings.densityDissipation,velocityDissipation:this.settings.velocityDissipation,pressureIterations:10,curlStrength:0,enableVorticity:!1,reflectWalls:!1}),this.removePointerInput=p(this.canvas,this.fluid,{coloredStrokes:!1})}setupComposition(){let e=this.createPlaceholderTexture(`sealed`),t=this.createPlaceholderTexture(`reveal`);this.sealedTexture=e.texture,this.revealTexture=t.texture,this.sealedSize=e.size,this.revealSize=t.size,this.uniforms={tSealed:{value:this.sealedTexture},tReveal:{value:this.revealTexture},tDensity:{value:this.fluid.densityTexture},tVelocity:{value:this.fluid.velocityTexture},uViewSize:{value:new u(1,1)},uSealedSize:{value:this.sealedSize.clone()},uRevealSize:{value:this.revealSize.clone()},uThreshold:{value:this.settings.threshold},uSoftness:{value:this.settings.softness},uEdgeStrength:{value:this.settings.edgeStrength},uRimStrength:{value:this.settings.rimStrength},uBaseBrightness:{value:this.settings.baseBrightness},uRevealBrightness:{value:this.settings.revealBrightness},uImageContrast:{value:this.settings.imageContrast},uImageSaturation:{value:this.settings.imageSaturation},uImageGamma:{value:this.settings.imageGamma},uImageTemperature:{value:this.settings.imageTemperature},uImageBlackPoint:{value:this.settings.imageBlackPoint},uImageSharpness:{value:this.settings.imageSharpness},uImageScale:{value:this.settings.imageScale},uEdgeMode:{value:0},uEffectIntensity:{value:this.settings.effectIntensity},uAnimationSpeed:{value:this.settings.animationSpeed},uTime:{value:0},uRevealOverride:{value:0}},this.material=new r({depthTest:!1,depthWrite:!1,uniforms:this.uniforms,vertexShader:`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `,fragmentShader:`
        precision highp float;
        varying vec2 vUv;
        uniform sampler2D tSealed;
        uniform sampler2D tReveal;
        uniform sampler2D tDensity;
        uniform sampler2D tVelocity;
        uniform vec2 uViewSize;
        uniform vec2 uSealedSize;
        uniform vec2 uRevealSize;
        uniform float uThreshold;
        uniform float uSoftness;
        uniform float uEdgeStrength;
        uniform float uRimStrength;
        uniform float uBaseBrightness;
        uniform float uRevealBrightness;
        uniform float uImageContrast;
        uniform float uImageSaturation;
        uniform float uImageGamma;
        uniform float uImageTemperature;
        uniform float uImageBlackPoint;
        uniform float uImageSharpness;
        uniform float uImageScale;
        uniform float uEdgeMode;
        uniform float uEffectIntensity;
        uniform float uAnimationSpeed;
        uniform float uTime;
        uniform float uRevealOverride;

        vec2 coverUv(vec2 screenUv, vec2 mediaSize, vec2 viewSize) {
          float viewAspect = viewSize.x / max(viewSize.y, 1.0);
          float mediaAspect = mediaSize.x / max(mediaSize.y, 1.0);
          vec2 ratio = vec2(
            min(viewAspect / mediaAspect, 1.0),
            min(mediaAspect / viewAspect, 1.0)
          );
          return screenUv * ratio + (1.0 - ratio) * 0.5;
        }

        float insideUv(vec2 sampleUv) {
          vec2 lower = step(vec2(0.0), sampleUv);
          vec2 upper = step(sampleUv, vec2(1.0));
          return lower.x * lower.y * upper.x * upper.y;
        }

        float hash21(vec2 p) {
          p = fract(p * vec2(123.34, 456.21));
          p += dot(p, p + 45.32);
          return fract(p.x * p.y);
        }

        float noise21(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
            mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0)), f.x),
            f.y
          );
        }

        vec3 hsv2rgb(vec3 c) {
          vec3 p = abs(fract(c.xxx + vec3(0.0, 2.0 / 3.0, 1.0 / 3.0)) * 6.0 - 3.0);
          return c.z * mix(vec3(1.0), clamp(p - 1.0, 0.0, 1.0), c.y);
        }

        vec3 sampleAdjustedImage(
          sampler2D imageTexture,
          vec2 imageUv,
          vec2 imageSize,
          float brightness
        ) {
          vec2 safeUv = clamp(imageUv, 0.0, 1.0);
          vec2 imageTexel = 1.0 / max(imageSize, vec2(1.0));
          vec3 center = texture2D(imageTexture, safeUv).rgb;
          vec3 neighbours =
            texture2D(imageTexture, clamp(safeUv + vec2(imageTexel.x, 0.0), 0.0, 1.0)).rgb +
            texture2D(imageTexture, clamp(safeUv - vec2(imageTexel.x, 0.0), 0.0, 1.0)).rgb +
            texture2D(imageTexture, clamp(safeUv + vec2(0.0, imageTexel.y), 0.0, 1.0)).rgb +
            texture2D(imageTexture, clamp(safeUv - vec2(0.0, imageTexel.y), 0.0, 1.0)).rgb;
          vec3 color = center + (center * 4.0 - neighbours) * uImageSharpness;
          color *= brightness;
          color = (color - 0.5) * uImageContrast + 0.5;
          float luminance = dot(color, vec3(0.2126, 0.7152, 0.0722));
          color = mix(vec3(luminance), color, uImageSaturation);
          color += vec3(uImageTemperature * 0.1, 0.0, -uImageTemperature * 0.1);
          color = (color - uImageBlackPoint) / max(1.0 - uImageBlackPoint, 0.001);
          return pow(max(color, vec3(0.0)), vec3(1.0 / max(uImageGamma, 0.01)));
        }

        void main() {
          vec4 densitySample = texture2D(tDensity, vUv);
          vec2 velocity = texture2D(tVelocity, vUv).rg;
          vec2 texel = 1.0 / max(uViewSize, vec2(1.0));
          float densityLeft = texture2D(tDensity, vUv - vec2(texel.x, 0.0)).b;
          float densityRight = texture2D(tDensity, vUv + vec2(texel.x, 0.0)).b;
          float densityDown = texture2D(tDensity, vUv - vec2(0.0, texel.y)).b;
          float densityUp = texture2D(tDensity, vUv + vec2(0.0, texel.y)).b;
          vec2 densityNormal = normalize(vec2(
            densityLeft - densityRight,
            densityDown - densityUp
          ) + vec2(0.00001));
          float mask = smoothstep(
            uThreshold,
            uThreshold + max(uSoftness, 0.0001),
            densitySample.b
          );
          float edgeBand = mask * (1.0 - mask) * 4.0;
          float overrideAmount = abs(uRevealOverride);
          edgeBand *= 1.0 - overrideAmount;
          mask = mix(mask, step(0.0, uRevealOverride), overrideAmount);

          float safeScale = max(uImageScale, 0.01);
          vec2 scaledScreenUv = (vUv - 0.5) / safeScale + 0.5;
          vec2 sealedUv = coverUv(scaledScreenUv, uSealedSize, uViewSize);
          vec2 revealUv = coverUv(scaledScreenUv, uRevealSize, uViewSize);
          float sealedInside = insideUv(sealedUv);
          float revealInside = insideUv(revealUv);
          revealUv = clamp(
            revealUv - velocity * uEdgeStrength * edgeBand,
            0.0,
            1.0
          );

          vec3 sealedColor = sampleAdjustedImage(
            tSealed, sealedUv, uSealedSize, uBaseBrightness
          ) * sealedInside;
          vec3 revealColor = sampleAdjustedImage(
            tReveal, revealUv, uRevealSize, uRevealBrightness
          ) * revealInside;
          float effect = max(uEffectIntensity, 0.0);
          float animatedTime = uTime * uAnimationSpeed;

          // RGB 色差：沿速度与密度法线分离内部图的三个颜色通道。
          if (uEdgeMode > 0.5 && uEdgeMode < 1.5) {
            vec2 chromaOffset = (
              velocity * uEdgeStrength * 2.0 + densityNormal * texel * 5.0
            ) * edgeBand * effect;
            revealColor = vec3(
              sampleAdjustedImage(
                tReveal, revealUv + chromaOffset, uRevealSize, uRevealBrightness
              ).r,
              sampleAdjustedImage(
                tReveal, revealUv, uRevealSize, uRevealBrightness
              ).g,
              sampleAdjustedImage(
                tReveal, revealUv - chromaOffset, uRevealSize, uRevealBrightness
              ).b
            ) * revealInside;
          }

          vec3 color = mix(sealedColor, revealColor, mask);

          // 0 液体折射：柔和的湿润高光。
          if (uEdgeMode < 0.5) {
            vec3 wetNormal = normalize(vec3(densityNormal * 0.75, 1.0));
            float wetSpec = pow(max(dot(wetNormal, normalize(vec3(-0.35, 0.45, 1.0))), 0.0), 18.0);
            color += (revealColor * uRimStrength + vec3(wetSpec)) * edgeBand * effect;
          }
          // 1 RGB 色差。
          else if (uEdgeMode < 1.5) {
            color += vec3(0.12, 0.04, 0.16) * edgeBand * effect;
          }
          // 2 彩虹油膜。
          else if (uEdgeMode < 2.5) {
            float angle = atan(densityNormal.y, densityNormal.x) / 6.2831853;
            float hue = fract(angle + densitySample.b * 0.7 + animatedTime * 0.06);
            vec3 oil = hsv2rgb(vec3(hue, 0.82, 1.0));
            float bands = 0.55 + 0.45 * sin(densitySample.b * 38.0 - animatedTime * 2.2);
            color += oil * edgeBand * bands * effect * 1.25;
          }
          // 3 电流边缘。
          else if (uEdgeMode < 3.5) {
            float electricNoise = noise21(vUv * vec2(210.0, 65.0) + vec2(animatedTime * 4.0, 0.0));
            float electricPulse = smoothstep(0.48, 0.92, electricNoise + 0.32 * sin(animatedTime * 17.0));
            vec3 electricColor = mix(vec3(0.05, 0.55, 1.0), vec3(0.75, 0.98, 1.0), electricPulse);
            color += electricColor * edgeBand * (0.55 + electricPulse) * effect * 1.6;
          }
          // 4 扫描线。
          else if (uEdgeMode < 4.5) {
            float scan = pow(0.5 + 0.5 * sin(gl_FragCoord.y * 0.34 - animatedTime * 15.0), 14.0);
            float sweep = pow(0.5 + 0.5 * sin(vUv.y * 18.0 - animatedTime * 2.5), 28.0);
            vec3 scanColor = vec3(0.12, 0.82, 1.0);
            color += scanColor * (edgeBand * (0.35 + scan) + mask * sweep * 0.35) * effect;
          }
          // 5 火焰灼烧边缘。
          else if (uEdgeMode < 5.5) {
            float flameNoise = noise21(vUv * vec2(95.0, 48.0) - vec2(0.0, animatedTime * 2.8));
            float flame = smoothstep(0.05, 0.95, edgeBand + (flameNoise - 0.5) * 0.85);
            vec3 fireColor = mix(vec3(0.75, 0.035, 0.0), vec3(1.0, 0.82, 0.12), flame);
            color *= 1.0 - edgeBand * effect * 0.28;
            color += fireColor * edgeBand * (0.6 + flame) * effect * 1.45;
          }
          // 6 金属融化边缘。
          else if (uEdgeMode < 6.5) {
            float moltenNoise = noise21(vUv * 75.0 + animatedTime * 0.8);
            float heat = smoothstep(0.12, 0.95, edgeBand + moltenNoise * 0.24);
            vec3 molten = mix(vec3(0.32, 0.04, 0.01), vec3(1.0, 0.34, 0.03), heat);
            molten = mix(molten, vec3(1.0, 0.96, 0.72), smoothstep(0.72, 1.0, heat));
            float metalGlint = pow(max(dot(densityNormal, normalize(vec2(-0.6, 0.8))), 0.0), 10.0);
            color += (molten * (0.65 + heat) + metalGlint) * edgeBand * effect;
          }
          // 7 水滴高光。
          else {
            vec3 dropNormal = normalize(vec3(densityNormal * 1.35, 0.72));
            vec3 lightDir = normalize(vec3(-0.45, 0.62, 1.0));
            float dropSpec = pow(max(dot(dropNormal, lightDir), 0.0), 30.0);
            float fresnel = pow(1.0 - max(dropNormal.z, 0.0), 2.0);
            vec3 waterLight = vec3(0.68, 0.9, 1.0) * fresnel + vec3(1.0) * dropSpec * 2.2;
            color += waterLight * edgeBand * effect;
          }
          gl_FragColor = vec4(color, 1.0);
        }
      `}),this.geometry=new n(2,2),this.mesh=new i(this.geometry,this.material),this.scene.add(this.mesh)}createPlaceholderTexture(e){let n=document.createElement(`canvas`);n.width=1600,n.height=900;let r=n.getContext(`2d`),i=r.createRadialGradient(800,420,80,800,450,900);if(i.addColorStop(0,e===`sealed`?`#303640`:`#142d32`),i.addColorStop(1,`#050608`),r.fillStyle=i,r.fillRect(0,0,n.width,n.height),r.save(),r.translate(800,455),r.fillStyle=e===`sealed`?`#171a1f`:`#0a0d10`,r.strokeStyle=e===`sealed`?`#777f89`:`#54d4c8`,r.lineWidth=16,this.roundRect(r,-500,-205,1e3,410,190),r.fill(),r.stroke(),e===`sealed`){r.strokeStyle=`rgba(215,225,235,.38)`,r.lineWidth=2;for(let e=-430;e<=430;e+=16)for(let t=-145;t<=145;t+=16)r.beginPath(),r.arc(e,t,2.2,0,Math.PI*2),r.stroke()}else{r.strokeStyle=`#62eee0`,r.fillStyle=`#17272a`;for(let e of[-235,30,295])r.beginPath(),r.arc(e,0,e===295?145:112,0,Math.PI*2),r.fill(),r.stroke(),r.beginPath(),r.arc(e,0,e===295?68:50,0,Math.PI*2),r.stroke();r.fillStyle=`#163f34`,r.fillRect(-430,115,380,65),r.strokeRect(-430,115,380,65)}r.restore(),r.fillStyle=`rgba(255,255,255,.78)`,r.font=`600 24px system-ui`,r.textAlign=`center`,r.fillText(e===`sealed`?`移动鼠标揭示内部 · 上传外观图`:`内部结构层 · 上传内部图`,800,790);let s=new a(n);return s.colorSpace=t,s.minFilter=o,s.magFilter=o,this._ownedTextures.add(s),{texture:s,size:new u(n.width,n.height)}}roundRect(e,t,n,r,i,a){let o=Math.min(a,r/2,i/2);e.beginPath(),e.moveTo(t+o,n),e.arcTo(t+r,n,t+r,n+i,o),e.arcTo(t+r,n+i,t,n+i,o),e.arcTo(t,n+i,t,n,o),e.arcTo(t,n,t+r,n,o),e.closePath()}setupInputs(){this.sealedInput=this.createImageInput(`sealed`),this.revealInput=this.createImageInput(`reveal`)}setupWheelZoom(){this._onWheel=e=>{if(this._disposed)return;e.preventDefault();let t=Math.exp(-e.deltaY*.0012);this.settings.imageScale=d.clamp(this.settings.imageScale*t,.2,2),this.imageScaleController?.updateDisplay()},this.canvas.addEventListener(`wheel`,this._onWheel,{passive:!1})}setupDoubleClickToggle(){this._onPointerMoveRestore=()=>{this._disposed||this.revealOverrideTarget===0||(this.fullReveal=!1,this.revealOverrideTarget=0)},this._onDoubleClick=e=>{!this.settings.doubleClickToggle||this._disposed||(e.preventDefault(),this.fullReveal=!this.fullReveal,this.revealOverrideTarget=this.fullReveal?1:-1)},this.canvas.addEventListener(`pointermove`,this._onPointerMoveRestore),this.canvas.addEventListener(`dblclick`,this._onDoubleClick)}createImageInput(e){let t=document.createElement(`input`);return t.type=`file`,t.accept=`image/*`,t.style.display=`none`,t.addEventListener(`change`,async()=>{let n=t.files?.[0];n&&await this.loadImageLayer(e,n),t.value=``}),document.body.appendChild(t),t}async loadImageLayer(e,t){let n=URL.createObjectURL(t);try{await this.loadTextureUrl(e,n)}finally{URL.revokeObjectURL(n)}}async loadDefaultImages(){let e=await Promise.allSettled([this.loadTextureUrl(`sealed`,`/assets/visualizations/animation63/inner.png`),this.loadTextureUrl(`reveal`,`/assets/visualizations/animation63/outer.png`)]);for(let t of e)t.status===`rejected`&&console.warn(`Animation63 默认图片加载失败，继续使用内置占位图。`,t.reason)}async loadTextureUrl(e,n){let r=await new l().loadAsync(n);if(this._disposed){r.dispose();return}r.colorSpace=t,r.minFilter=o,r.magFilter=o;let i=e===`sealed`?this.sealedTexture:this.revealTexture;this._ownedTextures.delete(i),i?.dispose(),this._ownedTextures.add(r);let a=new u(r.image?.width||1,r.image?.height||1);e===`sealed`?(this.sealedTexture=r,this.uniforms.tSealed.value=r,this.uniforms.uSealedSize.value.copy(a)):(this.revealTexture=r,this.uniforms.tReveal.value=r,this.uniforms.uRevealSize.value.copy(a))}setupGUI(){this.guiContainer=_(`Animation63-gui-container`),v(`Animation63-gui-container`),document.body.appendChild(this.guiContainer),this.gui=new e({title:`63 · 流体揭示`,width:310,container:this.guiContainer});let t=this.gui.addFolder(`双层图片`);t.add({"上传外观图…":()=>this.sealedInput?.click()},`上传外观图…`),t.add({"上传内部图…":()=>this.revealInput?.click()},`上传内部图…`),this.imageScaleController=t.add(this.settings,`imageScale`,.2,2,.01).name(`图片整体缩放`),t.open();let n=this.gui.addFolder(`图片调整`);n.add(this.settings,`baseBrightness`,.2,2,.01).name(`外观亮度`),n.add(this.settings,`revealBrightness`,.2,2,.01).name(`内部亮度`),n.add(this.settings,`imageContrast`,.2,2,.01).name(`对比度`),n.add(this.settings,`imageSaturation`,0,2,.01).name(`饱和度`),n.add(this.settings,`imageGamma`,.35,2.5,.01).name(`Gamma`),n.add(this.settings,`imageTemperature`,-1,1,.01).name(`色温`),n.add(this.settings,`imageBlackPoint`,0,.45,.005).name(`黑位`),n.add(this.settings,`imageSharpness`,0,1.5,.01).name(`锐度`);let r=this.gui.addFolder(`揭示`);r.add(this.settings,`edgeStyle`,{液体折射:`liquidRefraction`,"RGB 色差":`rgbChromatic`,彩虹油膜:`rainbowOil`,电流边缘:`electric`,扫描线:`scanline`,火焰灼烧:`fireBurn`,金属融化:`moltenMetal`,水滴高光:`dropletHighlight`}).name(`边缘材质`),r.add(this.settings,`effectIntensity`,0,2,.01).name(`材质强度`),r.add(this.settings,`animationSpeed`,0,3,.01).name(`动画速度`),r.add(this.settings,`threshold`,0,.4,.005).name(`显露阈值`),r.add(this.settings,`softness`,.02,.6,.005).name(`边缘柔度`),r.add(this.settings,`edgeStrength`,0,.003,5e-5).name(`边缘折射`),r.add(this.settings,`rimStrength`,0,1.5,.01).name(`边缘辉光`),r.open();let i=this.gui.addFolder(`流体`);i.add(this.settings,`splatRadius`,.002,.03,5e-4).name(`笔触大小`),i.add(this.settings,`splatForce`,1,12,.5).name(`笔触力度`),i.add(this.settings,`densityDissipation`,.9,.999,.001).name(`恢复速度`),i.add(this.settings,`velocityDissipation`,.8,.99,.005).name(`流动保持`),this.gui.addFolder(`鼠标交互`).add(this.settings,`doubleClickToggle`).name(`双击切换全图`),this.gui.add({恢复默认:()=>{Object.assign(this.settings,y),this.gui.controllersRecursive().forEach(e=>e.updateDisplay())}},`恢复默认`),this.gui.hide()}setupSettingsButton(){this.settingsButton=h(`Animation63-settings-button`),this.settingsButton.addEventListener(`click`,()=>{this.gui&&(this.guiVisible=!this.guiVisible,this.guiVisible?this.gui.show():this.gui.hide())}),document.body.appendChild(this.settingsButton)}syncSettings(){this.fluid.configure({splatRadius:this.settings.splatRadius,splatForce:this.settings.splatForce,densityDissipation:this.settings.densityDissipation,velocityDissipation:this.settings.velocityDissipation}),this.uniforms.uThreshold.value=this.settings.threshold,this.uniforms.uSoftness.value=this.settings.softness,this.uniforms.uEdgeStrength.value=this.settings.edgeStrength,this.uniforms.uRimStrength.value=this.settings.rimStrength,this.uniforms.uBaseBrightness.value=this.settings.baseBrightness,this.uniforms.uRevealBrightness.value=this.settings.revealBrightness,this.uniforms.uImageContrast.value=this.settings.imageContrast,this.uniforms.uImageSaturation.value=this.settings.imageSaturation,this.uniforms.uImageGamma.value=this.settings.imageGamma,this.uniforms.uImageTemperature.value=this.settings.imageTemperature,this.uniforms.uImageBlackPoint.value=this.settings.imageBlackPoint,this.uniforms.uImageSharpness.value=this.settings.imageSharpness,this.uniforms.uImageScale.value=this.settings.imageScale,this.uniforms.uEdgeMode.value=b[this.settings.edgeStyle]??0,this.uniforms.uEffectIntensity.value=this.settings.effectIntensity,this.uniforms.uAnimationSpeed.value=this.settings.animationSpeed,this.uniforms.uRevealOverride.value=this.revealOverride}updateWithAudioData(){}render(){if(this._disposed||!this.renderer)return;let e=performance.now(),t=Math.min(Math.max((e-this._lastTime)/1e3,1e-6),1/30);this._lastTime=e,this.revealOverride=d.lerp(this.revealOverride,this.revealOverrideTarget,1-Math.exp(-t*5)),this.syncSettings(),this.uniforms.uTime.value+=t,this.fluid.step(t),this.uniforms.tDensity.value=this.fluid.densityTexture,this.uniforms.tVelocity.value=this.fluid.velocityTexture,this.renderer.render(this.scene,this.camera)}resize(){if(!this.renderer||this._disposed)return;let e=Math.max(1,this.canvas.clientWidth||innerWidth),t=Math.max(1,this.canvas.clientHeight||innerHeight);this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,2)),this.renderer.setSize(e,t,!1),this.fluid.resize(e,t),this.uniforms.uViewSize.value.set(e,t)}dispose(){if(!this._disposed){this._disposed=!0,this.removePointerInput?.(),this._onWheel&&this.canvas.removeEventListener(`wheel`,this._onWheel),this._onPointerMoveRestore&&this.canvas.removeEventListener(`pointermove`,this._onPointerMoveRestore),this._onDoubleClick&&this.canvas.removeEventListener(`dblclick`,this._onDoubleClick),this.sealedInput?.remove(),this.revealInput?.remove(),g(this.settingsButton,this.guiContainer,this.gui),this.scene?.remove(this.mesh),this.geometry?.dispose(),this.material?.dispose();for(let e of this._ownedTextures)e.dispose();this._ownedTextures.clear(),this.fluid?.dispose(),this.renderer?.dispose()}}};export{x as default};