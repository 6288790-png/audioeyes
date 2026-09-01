import{a as e}from"./lil-gui.esm-jlbWO7FJ.js";import{i as t,n,r,t as i}from"./GUIHelper-DspWBXk2.js";var a=[[`energy`,`ENERGY`,[`rms`,`peak`,`crest`,`volume`]],[`bands`,`FREQUENCY BANDS`,[`sub`,`bass`,`lowMid`,`mid`,`upperMid`,`presence`,`brilliance`]],[`spectral`,`SPECTRAL SHAPE`,[`centroid`,`spread`,`rolloff`,`flatness`,`entropy`,`flux`]],[`beat`,`RHYTHM EVENTS`,[`kick`,`snare`,`hihat`,`onset`,`pulse`,`bpm`,`quarter`,`bar`,`downbeat`,`isDownbeat`]],[`motion`,`MOTION`,[`motion`,`density`,`texture`,`percussive`]],[`trend`,`TREND`,[`energy`,`centroid`,`flux`]],[`envelope`,`ENVELOPE`,[`value`,`attack`,`sustain`,`release`]],[`mood`,`MOOD`,[`emotion`,`roughness`,`calmness`,`intensity`]],[`semantic`,`SEMANTIC`,[`brightness`,`energy`,`motion`,`density`,`texture`,`punch`,`smoothness`,`energyTrend`,`complexity`]],[`animation`,`ANIMATION DRIVES`,[`kick`,`snare`,`hihat`,`beat`,`downbeat`,`energy`,`bass`,`mid`,`high`,`motion`,`brightness`,`percussive`,`texture`,`smoothness`,`variation`,`energyTrend`,`bpm`,`bar`,`quarter`,`isDownbeat`]],[`_legacy3BandEnergy`,`LEGACY 3-BAND`,[`low`,`mid`,`high`,`volume`]]],o=new Set([`beat.kick`,`beat.snare`,`beat.hihat`,`beat.onset`,`beat.pulse`,`beat.isDownbeat`,`animation.kick`,`animation.snare`,`animation.hihat`,`animation.beat`,`animation.downbeat`,`animation.isDownbeat`]),s=new Set([`beat.bpm`,`beat.quarter`,`beat.bar`,`beat.downbeat`,`beat.isDownbeat`,`animation.bpm`,`animation.bar`,`animation.quarter`,`animation.isDownbeat`]),c={bassLow:`#121c2a`,bassMid:`#5d84df`,bassHigh:`#72d0e3`,midLow:`#171b2d`,midMid:`#7083e6`,midHigh:`#a982e3`,highLow:`#241a29`,highMid:`#c77eae`,highHigh:`#e7ecf3`,energyLow:`#5b52b8`,energyMid:`#a34f62`,energyHigh:`#de786b`,textureLow:`#6f7485`,textureMid:`#80537f`,textureHigh:`#b14f60`,eventLow:`#161924`,eventMid:`#dfa968`,eventHigh:`#f2dfc6`,trendNeg:`#73d7e8`,trendZero:`#6d7586`,trendPos:`#e0ae6b`,smoothLow:`#7f5480`,smoothHigh:`#dfe7ef`,waveLow:`#73d7e8`,waveMid:`#7287f5`,waveHigh:`#a485e8`,wavePeak:`#e7ecf3`,saturation:1.5,brightness:1.35,colorRange:1.6,glow:2,waveResponse:1,waveSmooth:.028,adaptiveWave:!0,colorAttack:.08,colorRelease:.035,colorDeadband:.025},l={...c};function u(e){let t=e.replace(`#`,``);return[parseInt(t.slice(0,2),16),parseInt(t.slice(2,4),16),parseInt(t.slice(4,6),16)]}function d(e,t=0,n=1){return Math.max(t,Math.min(n,Number(e)||0))}function f(e,t){return typeof t==`boolean`?+!!t:e.endsWith(`.volume`)?d(t/100):e.endsWith(`.bpm`)?d(t/220):e.endsWith(`.bar`)?d(t%16/15):e.endsWith(`.quarter`)||e.endsWith(`.downbeat`)&&!e.startsWith(`animation.`)?d(t/3):e.endsWith(`.crest`)||e.endsWith(`.punch`)?d(t/5):e.startsWith(`trend.`)||e.endsWith(`.energyTrend`)?d((t+1)/2):d(t)}function p(e,t){if(typeof t==`boolean`)return t?`YES`:`NO`;let n=Number(t)||0;return e.endsWith(`.volume`)?`${Math.round(n)}%`:e.endsWith(`.bpm`)||e.endsWith(`.bar`)||e.endsWith(`.quarter`)||e.endsWith(`.downbeat`)?String(Math.round(n)):Math.abs(n)>=10?n.toFixed(1):n.toFixed(3)}function m(e){let t=.2126*e[0]+.7152*e[1]+.0722*e[2],n=l.saturation,r=l.brightness;return e.map(e=>{let i=t+(e-t)*n;return Math.max(0,Math.min(255,i*r))})}function h(e){let t=.5+(e-.5)*l.colorRange;return Math.max(0,Math.min(1,t))}function g(e,t,n){let r=Math.max(0,Math.min(1,n));return[e[0]+(t[0]-e[0])*r,e[1]+(t[1]-e[1])*r,e[2]+(t[2]-e[2])*r]}function _(e,t){let n=Math.max(0,Math.min(1,e));if(t.length===1)return t[0];let r=n*(t.length-1),i=Math.min(t.length-2,Math.floor(r));return g(t[i],t[i+1],r-i)}function v(e){return`rgb(${e.map(e=>Math.round(e)).join(`,`)})`}function y(e,t,n=!1){let r=h(n?t:f(e,t)),i;if(e.endsWith(`.sub`)||e.endsWith(`.bass`)||e.endsWith(`.low`))i=g(u(l.bassLow),u(l.bassHigh),.18+r*.48);else if(e.endsWith(`.lowMid`)||e.endsWith(`.mid`)||e.endsWith(`.upperMid`))i=g(u(l.midLow),u(l.midHigh),.18+r*.48);else if(e.endsWith(`.presence`)||e.endsWith(`.brilliance`)||e.endsWith(`.high`))i=g(u(l.highLow),u(l.highHigh),.18+r*.48);else if(e.endsWith(`.kick`)||e.endsWith(`.snare`)||e.endsWith(`.hihat`)||e.endsWith(`.onset`)||e.endsWith(`.pulse`)||e.endsWith(`.beat`)||e.endsWith(`.downbeat`)||e.endsWith(`.isDownbeat`))i=g(u(l.eventMid),u(l.eventHigh),.08+r*.16);else if(e.startsWith(`trend.`)||e.endsWith(`.energyTrend`)){let e=n?Math.max(-1,Math.min(1,(Number(t)||0)*2-1)):Math.max(-1,Math.min(1,Number(t)||0));i=e<0?g(u(l.trendNeg),u(l.trendZero),e+1):g(u(l.trendZero),u(l.trendPos),e)}else i=e.endsWith(`.brightness`)||e.endsWith(`.centroid`)||e.endsWith(`.rolloff`)?g(u(l.highMid),u(l.highHigh),.1+r*.22):e.endsWith(`.smoothness`)||e.endsWith(`.calmness`)?g(u(l.smoothLow),u(l.smoothHigh),.2+r*.42):e.endsWith(`.texture`)||e.endsWith(`.complexity`)||e.endsWith(`.entropy`)?g(u(l.textureLow),u(l.textureHigh),.18+r*.42):e.endsWith(`.intensity`)||e.endsWith(`.punch`)||e.endsWith(`.crest`)||e.endsWith(`.percussive`)||e.endsWith(`.energy`)||e.endsWith(`.rms`)||e.endsWith(`.peak`)||e.endsWith(`.volume`)?g(u(l.energyLow),u(l.energyHigh),.18+r*.42):e.endsWith(`.motion`)||e.endsWith(`.flux`)||e.endsWith(`.attack`)||e.endsWith(`.sustain`)||e.endsWith(`.release`)?g(u(l.midLow),u(l.midHigh),.18+r*.42):e.endsWith(`.emotion`)||e.endsWith(`.roughness`)?g(u(l.textureLow),u(l.textureHigh),.18+r*.42):e.endsWith(`.density`)||e.endsWith(`.spread`)||e.endsWith(`.flatness`)?g(u(l.midLow),u(l.textureMid),.18+r*.42):e.endsWith(`.bpm`)||e.endsWith(`.bar`)||e.endsWith(`.quarter`)?g(u(l.midMid),u(l.smoothHigh),.12+r*.24):g(u(l.midMid),u(l.highHigh),.16+r*.34);return m(i)}function b(){return{energy:{rms:0,peak:0,crest:0,volume:0},bands:{sub:0,bass:0,lowMid:0,mid:0,upperMid:0,presence:0,brilliance:0},spectral:{centroid:0,spread:0,rolloff:0,flatness:0,entropy:0,flux:0},beat:{kick:0,snare:0,hihat:0,onset:0,pulse:0,bpm:0,quarter:0,bar:0,downbeat:0,isDownbeat:!1},motion:{motion:0,density:0,texture:0,percussive:0},trend:{energy:0,centroid:0,flux:0},envelope:{value:0,attack:0,sustain:0,release:0},mood:{emotion:0,roughness:0,calmness:0,intensity:0},semantic:{brightness:0,energy:0,motion:0,density:0,texture:0,punch:0,smoothness:0,energyTrend:0,complexity:0},animation:{kick:0,snare:0,hihat:0,beat:0,downbeat:0,energy:0,bass:0,mid:0,high:0,motion:0,brightness:0,percussive:0,texture:0,smoothness:0,variation:0,energyTrend:0,bpm:0,bar:0,quarter:0,isDownbeat:!1},_legacy3BandEnergy:{low:0,mid:0,high:0,volume:0}}}var x=class{constructor(e,t={}){this.canvas=e,this.defaultSettings={...c},Object.assign(l,this.defaultSettings),Object.assign(l,t),this.settings=l,this.root=null,this.visual=null,this.heroEnergy=null,this.waveCanvas=null,this.waveCtx=null,this.refs=new Map,this.audioFeature=null,this.waveformData=null,this.hasAudioData=!1,this.lastTime=performance.now(),this.centroidSmooth=0,this.centroidMin=1,this.centroidMax=0,this.waveAmplitude=0,this.idleTime=0,this._isReady=!1,this.gui=null,this.guiContainer=null,this.settingsButton=null,this.guiVisible=!1,this.init()}init(){this._isReady||this.root||(this.ensureStyles(),this.setupDOM(),this.buildTiles(),this.setupGUI(),this.setupSettingsButton(),this.resizeWave(),this._isReady=!0,console.log(`✅ Animation64 初始化成功`))}ensureStyles(){if(document.getElementById(`Animation64-style`))return;let e=document.createElement(`style`);e.id=`Animation64-style`,e.textContent=`
            #Animation64-root {
                position: absolute;
                inset: 0;
                z-index: 1;
                pointer-events: none;
                background: #030407;
                color: #edf4ff;
                font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
                display: grid;
                grid-template-rows: 92px minmax(0, 1fr);
                background:
                    radial-gradient(circle at 18% -8%, var(--ambient-1, rgba(41, 110, 255, .28)), transparent 32%),
                    radial-gradient(circle at 82% 8%, var(--ambient-2, rgba(156, 96, 255, .26)), transparent 30%),
                    radial-gradient(circle at 50% 118%, var(--ambient-3, rgba(60, 205, 255, .18)), transparent 28%),
                    #030407;
                transition: background 500ms linear;
            }
            #Animation64-root * { box-sizing: border-box; }
            #Animation64-root .hero {
                height: 92px;
                position: relative;
                overflow: hidden;
                border-bottom: 1px solid rgba(150, 180, 220, 0.10);
                background: linear-gradient(180deg, rgba(16, 23, 34, 0.35), rgba(3, 4, 7, 0.04));
            }
            #Animation64-root #wave { width: 100%; height: 100%; display: block; }
            #Animation64-root .heroText {
                position: absolute;
                left: 14px;
                bottom: 10px;
                pointer-events: none;
            }
            #Animation64-root .heroText .big {
                font-size: 30px;
                font-weight: 650;
                letter-spacing: -.04em;
                line-height: .9;
                opacity: .93;
            }
            #Animation64-root .heroText .small {
                margin-top: 4px;
                font-size: 7px;
                color: #6d7f97;
                letter-spacing: .13em;
            }
            #Animation64-root #visual {
                min-height: 0;
                height: 100%;
                padding: 7px;
                display: grid;
                grid-template-columns: repeat(4, minmax(0, 1fr));
                grid-template-rows: repeat(3, minmax(0, 1fr));
                gap: 6px;
                overflow: hidden;
                background:
                    linear-gradient(rgba(255,255,255,.012) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,.012) 1px, transparent 1px);
                background-size: 28px 28px;
            }
            #Animation64-root .section {
                min-width: 0;
                min-height: 0;
                margin: 0;
                padding: 5px;
                border: 1px solid rgba(145,175,220,.075);
                border-radius: 8px;
                background: rgba(7,10,15,.56);
                display: grid;
                grid-template-rows: 18px minmax(0, 1fr);
                overflow: hidden;
                box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--c, #7aa7ff) 2%, transparent);
            }
            #Animation64-root .sectionTitle {
                padding: 0 2px 4px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                color: #7d8ea5;
                font-size: 7px;
                letter-spacing: .12em;
                text-transform: uppercase;
            }
            #Animation64-root .sectionTitle span:last-child {
                opacity: .55;
                font-size: 6px;
            }
            #Animation64-root .grid {
                min-height: 0;
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(72px, 1fr));
                grid-auto-rows: minmax(0, 1fr);
                gap: 4px;
            }
            #Animation64-root .tile {
                --v: 0;
                --c: #76a7ff;
                min-width: 0;
                min-height: 0;
                position: relative;
                overflow: hidden;
                border: 1px solid rgba(160,190,235,.08);
                background: #070a0f;
                border-radius: 6px;
                transform: translateZ(0);
                transition: transform 55ms linear, border-color 90ms linear, background 130ms linear;
                background: linear-gradient(to top, rgba(255,255,255,.018), transparent 38%), #070a0f;
                border-color: color-mix(in srgb, var(--c) 14%, rgba(160,190,235,.08));
            }
            #Animation64-root .tile.large,
            #Animation64-root .tile.event { height: auto; }
            #Animation64-root .tile::before {
                content: "";
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                height: calc(var(--v) * 100%);
                background: linear-gradient(
                    to top,
                    color-mix(in srgb, var(--tile-color) 42%, #ffffff 58%) 0%,
                    color-mix(in srgb, var(--tile-color) 98%, #05070b 2%) 42%,
                    color-mix(in srgb, var(--tile-color) 58%, #ffffff 42%) 100%
                );
                opacity: .86;
                transition: height 50ms linear, background 120ms linear;
            }
            #Animation64-root .tile::after {
                content: "";
                position: absolute;
                left: 0;
                right: 0;
                bottom: calc(var(--v) * 100%);
                height: 1px;
                background: var(--tile-color);
                opacity: calc(.12 + var(--v) * .52);
                box-shadow: 0 0 calc(10px * var(--v) * var(--glow-scale, 1)) var(--tile-color);
                transition: bottom 50ms linear, background 120ms linear;
            }
            #Animation64-root .tile.pulse.active {
                transform: scale(1.035);
                border-color: color-mix(in srgb, var(--c) 54%, white 7%);
            }
            #Animation64-root .tile.pulse.active::before { filter: brightness(1.34); }
            #Animation64-root .label {
                position: absolute;
                z-index: 3;
                left: 6px;
                top: 5px;
                max-width: 70%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: 6.5px;
                letter-spacing: .06em;
                text-transform: uppercase;
                color: #b9c8da;
            }
            #Animation64-root .value {
                position: absolute;
                z-index: 3;
                right: 5px;
                top: 4px;
                font-size: 9px;
                font-variant-numeric: tabular-nums;
                font-weight: 600;
            }
            #Animation64-root .sub {
                position: absolute;
                z-index: 3;
                left: 6px;
                bottom: 4px;
                font-size: 5.5px;
                color: rgba(215,230,250,.40);
                letter-spacing: .04em;
            }
            #Animation64-root .section:nth-child(2){grid-column:span 1}
            #Animation64-root .section:nth-child(3){grid-column:span 1}
            #Animation64-root .section:nth-child(4){grid-column:span 1}
            #Animation64-root .section:nth-child(9){grid-column:span 1}
            #Animation64-root .section:nth-child(10){grid-column:span 2}
            #Animation64-root .section:nth-child(10) .grid{grid-template-columns:repeat(5,minmax(58px,1fr))}
            #Animation64-root .section:nth-child(4) .grid{grid-template-columns:repeat(5,minmax(52px,1fr))}
            #Animation64-root .section:nth-child(9) .grid{grid-template-columns:repeat(3,minmax(62px,1fr))}
            #Animation64-root .tile.signed::before {
                top: 50%;
                bottom: auto;
                height: calc(var(--a) * 50%);
                transform-origin: top;
            }
            #Animation64-root .tile.signed.neg::before {
                top: auto;
                bottom: 50%;
            }
            #Animation64-root .tile.signed::after {
                top: 50%;
                bottom: auto;
                opacity: .25;
                box-shadow: none;
            }
            #Animation64-root .zero { display: none; }
            #Animation64-root .tile.signed .zero {
                display: block;
                position: absolute;
                left: 0; right: 0; top: 50%;
                height: 1px;
                background: rgba(255,255,255,.07);
            }
            #Animation64-root .tile.tempo::before,
            #Animation64-root .tile.metadata::before { height:0; opacity:0; }
            #Animation64-root .tile.tempo::after,
            #Animation64-root .tile.metadata::after { opacity:0; box-shadow:none; }
            #Animation64-root .tile.metadata { background:rgba(16,22,32,.72); }
            #Animation64-root .beatDots {
                position:absolute;
                z-index:3;
                left:5px;right:5px;bottom:6px;
                display:grid;
                grid-template-columns:repeat(4,1fr);
                gap:3px;
            }
            #Animation64-root .beatDots i {
                height:4px;
                border-radius:2px;
                background: rgba(255,255,255,.07);
            }
            #Animation64-root .beatDots i.on {
                background: var(--c);
                box-shadow: 0 0 8px var(--c);
            }
            #Animation64-root .energy, #Animation64-root .bands, #Animation64-root .spectral, #Animation64-root .beat, #Animation64-root .motion, #Animation64-root .trend, #Animation64-root .envelope, #Animation64-root .mood, #Animation64-root .semantic, #Animation64-root .animation, #Animation64-root ._legacy3BandEnergy {
                --c: var(--tile-color, #4a79ff);
            }
            @media(min-width:1600px){
              #Animation64-root { grid-template-rows:104px minmax(0,1fr); }
              #Animation64-root .hero{ height:104px; }
              #Animation64-root #visual { gap:7px; padding:8px; }
              #Animation64-root .tile .label{ font-size:7px; }
              #Animation64-root .tile .value{ font-size:10px; }
            }
            @media(max-width:1450px){
              #Animation64-root #visual{ grid-template-columns:repeat(4,minmax(0,1fr)); gap:5px; padding:5px; }
              #Animation64-root .section{ padding:4px; }
              #Animation64-root .grid{ gap:3px; grid-template-columns:repeat(auto-fit,minmax(62px,1fr)); }
              #Animation64-root .section:nth-child(10) .grid{ grid-template-columns:repeat(5,minmax(48px,1fr)); }
              #Animation64-root .label{ font-size:5.8px; }
              #Animation64-root .value{ font-size:8px; }
              #Animation64-root .sub{ font-size:5px; }
            }
            @media(max-width:900px){
              #Animation64-root{ overflow:auto; height:auto; }
              #Animation64-root .hero{ height:120px; }
              #Animation64-root #visual{
                height:auto;
                display:grid;
                grid-template-columns:repeat(2,minmax(0,1fr));
                grid-auto-rows:260px;
                overflow:visible;
              }
              #Animation64-root .section:nth-child(10){ grid-column:span 2; }
            }
        `,document.head.appendChild(e)}setupDOM(){this.root=document.createElement(`div`),this.root.id=`Animation64-root`,this.root.innerHTML=`
            <section class="hero">
              <canvas id="wave"></canvas>
              <div class="heroText">
                <div id="heroEnergy" class="big">0.00</div>
                <div class="small">全局能量</div>
              </div>
            </section>
            <main id="visual"></main>
        `,(this.canvas?.parentElement||document.getElementById(`container`)||document.body).appendChild(this.root),this.heroEnergy=this.root.querySelector(`#heroEnergy`),this.visual=this.root.querySelector(`#visual`),this.waveCanvas=this.root.querySelector(`#wave`),this.waveCtx=this.waveCanvas.getContext(`2d`)}tile(e,t){let n=`${e}.${t}`,r=document.createElement(`div`);r.className=`tile ${e===`trend`||t===`energyTrend`?`signed `:``}${o.has(n)?`pulse event `:``}${s.has(n)?`metadata `:``}${[`bpm`,`quarter`,`bar`,`downbeat`].includes(t)?`tempo `:``}${e}`,r.innerHTML=`
            <span class="zero"></span>
            <div class="label">${t}</div>
            <div class="value">0.000</div>
            <div class="sub">${e}</div>
            ${t===`quarter`?`<div class="beatDots"><i></i><i></i><i></i><i></i></div>`:``}
        `;let i={el:r,val:r.querySelector(`.value`),dots:[...r.querySelectorAll(`.beatDots i`)],lastText:``,lastCss:``,lastNorm:NaN,lastDisplayValue:NaN,lastSigned:void 0,lastPulse:void 0,lastBeatIndex:NaN,colorValue:NaN,rangeMin:NaN,rangeMax:NaN,displayValue:0,pulseValue:0};return this.refs.set(n,i),r}buildTiles(){a.forEach(([e,t,n])=>{let r=document.createElement(`section`);r.className=`section`,r.innerHTML=`<div class="sectionTitle"><span>${t}</span><span>${n.length} FEATURES</span></div><div class="grid"></div>`;let i=r.querySelector(`.grid`);n.forEach(t=>i.appendChild(this.tile(e,t))),this.visual.appendChild(r)})}ensureFeatureColor(e,t,n=1/60){let r=this.refs.get(e);if(!r)return;let i=h(f(e,t)),a=o.has(e);Number.isFinite(r.colorValue)||(r.colorValue=i);let s=i-r.colorValue,c=l.colorDeadband;if(Math.abs(s)>=c){let e=Math.abs(s)>0?s>0?l.colorAttack:l.colorRelease:0;r.colorValue+=s*(1-Math.exp(-Math.max(.001,e)*n*60))}let u=v(y(e,a?.55:r.colorValue,!0)),d=`color-mix(in srgb, ${u} ${14+Math.round(10*l.glow)}%, transparent)`;r.lastCss!==u&&(r.el.style.setProperty(`--tile-color`,u),r.el.style.borderColor=d,r.lastCss=u),r.el.style.setProperty(`--glow-scale`,l.glow),r.el.style.borderColor=d}updateFeature(e,t,n=1/60){let r=this.refs.get(e);if(!r)return;let i=p(e,t);if(r.lastText!==i&&(r.val.textContent=i,r.lastText=i),this.ensureFeatureColor(e,t,n),e.startsWith(`trend.`)||e.endsWith(`.energyTrend`)){let e=d(t,-1,1),n=Math.abs(e),i={a:n,v:n,neg:e<0};(r.lastSigned!==i.neg||r.lastNorm!==n)&&(r.el.style.setProperty(`--a`,n),r.el.style.setProperty(`--v`,n),r.el.classList.toggle(`neg`,i.neg),r.lastSigned=i.neg,r.lastNorm=n)}else if(s.has(e))r.el.style.setProperty(`--v`,0);else{let i=f(e,t);Number.isFinite(r.rangeMin)||(r.rangeMin=Math.max(0,i-.08),r.rangeMax=Math.min(1,i+.08));let a=Math.min(1,n*.65);i<r.rangeMin?r.rangeMin+=(i-r.rangeMin)*a:r.rangeMin+=(i-r.rangeMin)*n*.035,i>r.rangeMax?r.rangeMax+=(i-r.rangeMax)*a:r.rangeMax+=(i-r.rangeMax)*n*.035;let o=Math.max(.12,r.rangeMax-r.rangeMin),s=.08+d((i-r.rangeMin)/o)**.82*.78,c=s>r.displayValue?.22:.1;r.displayValue+=(s-r.displayValue)*(1-Math.exp(-c*n*60)),(r.lastNorm!==i||r.lastDisplayValue!==r.displayValue)&&(r.el.style.setProperty(`--v`,r.displayValue),r.lastNorm=i,r.lastDisplayValue=r.displayValue)}if(o.has(e)&&!s.has(e)){let i=f(e,t),a=i>r.pulseValue?.32:.075;r.pulseValue+=(i-r.pulseValue)*(1-Math.exp(-a*n*60)),r.el.style.setProperty(`--v`,d(r.pulseValue));let o=r.pulseValue>.1;r.lastPulse!==o&&(r.el.classList.toggle(`active`,o),r.lastPulse=o)}if(e.endsWith(`.quarter`)&&r.dots.length){let e=Math.round(Number(t)||0);r.lastBeatIndex!==e&&(r.dots.forEach((t,n)=>t.classList.toggle(`on`,n===e)),r.lastBeatIndex=e)}}groupUpdate(e,t,n){t&&Object.entries(t).forEach(([t,r])=>this.updateFeature(`${e}.${t}`,r,n))}idleFeatureValue(e){if(s.has(e)||o.has(e))return 0;let t=0;for(let n=0;n<e.length;n+=1)t=(t*31+e.charCodeAt(n))%997;let n=t*.037,r=.42+t%7*.045,i=.18+t%5*.035,a=Math.sin(this.idleTime*r+n)*.075+Math.sin(this.idleTime*r*.43+n*1.7)*.035;return e.startsWith(`trend.`)||e.endsWith(`.energyTrend`)?a*2:d(i+a)}updateCentroidRange(e,t){let n=Math.max(0,Math.min(1,Number(e)||0));n<this.centroidMin?this.centroidMin=n:this.centroidMin+=(n-this.centroidMin)*t*.015,n>this.centroidMax?this.centroidMax=n:this.centroidMax+=(n-this.centroidMax)*t*.015;let r=(this.centroidMin+this.centroidMax)*.5,i=Math.max(this.centroidMax-this.centroidMin,.045);this.centroidMin=r-i*.5,this.centroidMax=r+i*.5;let a=(n-this.centroidMin)/Math.max(.001,this.centroidMax-this.centroidMin);return Math.max(0,Math.min(1,a))}waveColorFromCentroidAdaptive(e,t){let n=l.adaptiveWave?this.updateCentroidRange(e,t):Math.max(0,Math.min(1,Number(e)||0));return this.centroidSmooth+=(n-this.centroidSmooth)*Math.max(.001,Math.min(.25,l.waveSmooth)),m(_(Math.max(0,Math.min(1,this.centroidSmooth*l.waveResponse)),[u(l.waveLow),u(l.waveMid),u(l.waveHigh),u(l.wavePeak)]))}resizeWave(){if(!this.waveCanvas||!this.waveCtx)return;let e=this.waveCanvas.getBoundingClientRect(),t=Math.max(1,e.width||this.waveCanvas.clientWidth||window.innerWidth),n=Math.max(1,e.height||this.waveCanvas.clientHeight||92),r=/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)||navigator.maxTouchPoints>1&&window.innerWidth<1024?1:Math.min(window.devicePixelRatio||1,2);this.waveCanvas.width=Math.floor(t*r),this.waveCanvas.height=Math.floor(n*r),this.waveCtx.setTransform(r,0,0,r,0,0)}updateWithAudioData(e,t){e&&e.audioFeature&&e.audioFeature.animation?(this.audioFeature=e.audioFeature,this.waveformData=e.waveformData||null,this.hasAudioData=e.isPlaying===!0):(this.audioFeature=b(),this.waveformData=null,this.hasAudioData=!1),t!==void 0&&(this.elapsed=t)}render(){if(!this._isReady||!this.root)return;let e=performance.now(),t=Math.min(Math.max((e-this.lastTime)/1e3,1/240),.1);this.lastTime=e;let n=this.audioFeature&&this.audioFeature.animation?this.audioFeature:b();this.idleTime+=t,this.hasAudioData?a.forEach(([e])=>this.groupUpdate(e,n[e]||null,t)):this.refs.forEach((e,n)=>this.updateFeature(n,this.idleFeatureValue(n),t)),this.heroEnergy.textContent=(n.animation?.energy||0).toFixed(2);let r=this.waveCanvas.clientWidth||1,i=this.waveCanvas.clientHeight||1,o=this.waveCtx;o.clearRect(0,0,r,i),o.strokeStyle=`rgba(130,165,220,.10)`,o.beginPath(),o.moveTo(0,i/2),o.lineTo(r,i/2),o.stroke();let s=this.waveformData&&this.waveformData.length?this.waveformData:null;if(s&&this.hasAudioData){let e=n.animation?.energy||0,a=n.animation?.high||0,c=Math.max(n.animation?.beat||0,n.animation?.downbeat||0,n.beat?.onset||0),d=n.spectral?.centroid||0,f=Math.max(48,Number(n.animation?.bpm||n.beat?.bpm||72)),p=e<.04&&c<.08;{let n=this.waveColorFromCentroidAdaptive(d,t),h=Math.min(1,p?.1+e*.45:.18+e*.72+c*.18);this.waveAmplitude+=(h-this.waveAmplitude)*(1-Math.exp(-.12*t*60));let g=Math.min(.82,p?.14+e*.22:.24+e*.34+c*.12),_=m(u(l.waveLow)),v=m(u(l.waveHigh)),y=e=>{let t=.2126*e[0]+.7152*e[1]+.0722*e[2];return e.map(e=>Math.max(0,Math.min(255,t+(e-t)*1.32)))},b=y(_),x=y(n),S=y(v),C=(e,t)=>`rgba(${e.map(e=>Math.round(e)).join(`,`)}, ${t})`,w=(e,t,n)=>{let a=(this.elapsed||0)*.045%1,c=o.createLinearGradient(-r*a,0,r*(1-a),0);c.addColorStop(0,C(b,Math.min(.9,t*.82))),c.addColorStop(.5,C(x,Math.min(.9,t*1.08))),c.addColorStop(1,C(S,Math.min(.9,t*.92))),o.strokeStyle=c,o.lineWidth=n,o.beginPath();for(let t=0;t<r;t+=1){let n=t/Math.max(1,r-1),a=Math.min(s.length-1,Math.max(0,Math.floor(n*(s.length-1)))),c=(n*3.2+(this.elapsed||0)*f/60)%1,l=Math.exp(-(((c-.18)/.055)**2))*.16,u=Math.exp(-(((c-.3)/.018)**2))*1,d=Math.exp(-(((c-.34)/.025)**2))*.34,p=Math.exp(-(((c-.43)/.06)**2))*.22,m=(s[a]-128)/128*.08,h=l+u-d+p+m,g=i*.5+h*i*.34*this.waveAmplitude*e;t===0?o.moveTo(t,g):o.lineTo(t,g)}o.stroke()};w(1,g*.34,3.8),w(.82,g,.9+a*.45+c*.25),o.strokeStyle=`rgba(235, 243, 255, ${.1+g*.12})`,o.lineWidth=.5,o.beginPath(),o.moveTo(0,i*.5),o.lineTo(r,i*.5),o.stroke()}}}setupGUI(){this.guiContainer=r(`Animation64-gui-container`),i(`Animation64-gui-container`),this.guiContainer.id=`Animation64-gui-container`,document.body.appendChild(this.guiContainer),this.gui=new e({title:`控制面板`,container:this.guiContainer}),this.gui.hide();let t=this.gui.addFolder(`低频`);t.addColor(this.settings,`bassLow`).name(`低`),t.addColor(this.settings,`bassMid`).name(`中`),t.addColor(this.settings,`bassHigh`).name(`高`);let n=this.gui.addFolder(`中频 / 运动`);n.addColor(this.settings,`midLow`).name(`低`),n.addColor(this.settings,`midMid`).name(`中`),n.addColor(this.settings,`midHigh`).name(`高`);let a=this.gui.addFolder(`高频 / 亮度`);a.addColor(this.settings,`highLow`).name(`低`),a.addColor(this.settings,`highMid`).name(`中`),a.addColor(this.settings,`highHigh`).name(`高`);let o=this.gui.addFolder(`能量`);o.addColor(this.settings,`energyLow`).name(`低`),o.addColor(this.settings,`energyMid`).name(`中`),o.addColor(this.settings,`energyHigh`).name(`高`);let s=this.gui.addFolder(`纹理 / 复杂度`);s.addColor(this.settings,`textureLow`).name(`低`),s.addColor(this.settings,`textureMid`).name(`中`),s.addColor(this.settings,`textureHigh`).name(`高`);let c=this.gui.addFolder(`节拍 / 事件`);c.addColor(this.settings,`eventLow`).name(`空闲`),c.addColor(this.settings,`eventMid`).name(`命中`),c.addColor(this.settings,`eventHigh`).name(`峰值`);let l=this.gui.addFolder(`趋势`);l.addColor(this.settings,`trendNeg`).name(`负`),l.addColor(this.settings,`trendZero`).name(`零`),l.addColor(this.settings,`trendPos`).name(`正`);let u=this.gui.addFolder(`波形`);u.addColor(this.settings,`waveLow`).name(`低质心`),u.addColor(this.settings,`waveMid`).name(`中质心`),u.addColor(this.settings,`waveHigh`).name(`高质心`),u.addColor(this.settings,`wavePeak`).name(`峰值质心`),u.add(this.settings,`waveResponse`,.5,1.8,.01).name(`颜色响应`),u.add(this.settings,`waveSmooth`,.005,.12,.001).name(`颜色平滑`),u.add(this.settings,`adaptiveWave`).name(`自适应范围`);let d=this.gui.addFolder(`全局`);d.add(this.settings,`saturation`,.45,2.2,.01).name(`饱和度`),d.add(this.settings,`brightness`,.65,1.8,.01).name(`亮度`),d.add(this.settings,`colorRange`,.45,2.4,.01).name(`色彩范围`),d.add(this.settings,`glow`,0,3,.01).name(`发光`),d.add(this.settings,`colorAttack`,.02,.2,.005).name(`颜色变亮速度`),d.add(this.settings,`colorRelease`,.01,.12,.005).name(`颜色变暗速度`),d.add(this.settings,`colorDeadband`,0,.12,.005).name(`颜色死区`),this.gui.add(this,`resetParams`).name(`重置参数`),u.open(),d.open(),this.gui.hide()}setupSettingsButton(){this.settingsButton=t(`Animation64-settings-button`),this.settingsButton.title=`打开控制面板`,this.settingsButton.addEventListener(`click`,()=>{this.guiVisible=!this.guiVisible,this.gui&&(this.guiVisible?this.gui.show():this.gui.hide())}),document.body.appendChild(this.settingsButton)}onWindowResize(){this.resizeWave()}resetParams(){Object.assign(this.settings,this.defaultSettings),Object.assign(l,this.defaultSettings),this.resetState();let e=t=>{t&&(Array.isArray(t.controllers)&&t.controllers.forEach(e=>{if(!e)return;let t=e.property;if(t&&Object.prototype.hasOwnProperty.call(this.defaultSettings,t)){let n=this.defaultSettings[t];typeof e.setValue==`function`?e.setValue(n):this.settings[t]!==void 0&&(this.settings[t]=n)}typeof e.updateDisplay==`function`&&e.updateDisplay()}),t.folders&&Object.values(t.folders).forEach(e))};e(this.gui)}resetState(){this.audioFeature=b(),this.waveformData=null,this.hasAudioData=!1,this.centroidSmooth=0,this.centroidMin=1,this.centroidMax=0,this.waveAmplitude=0,this.idleTime=0,this.refs.forEach(e=>{e.rangeMin=NaN,e.rangeMax=NaN,e.displayValue=0,e.pulseValue=0,e.colorValue=NaN,e.lastNorm=NaN,e.lastDisplayValue=NaN})}dispose(){this.root&&this.root.parentNode&&this.root.parentNode.removeChild(this.root),this.guiContainer&&this.guiContainer.parentNode&&this.guiContainer.parentNode.removeChild(this.guiContainer),this.settingsButton&&this.settingsButton.parentNode&&this.settingsButton.parentNode.removeChild(this.settingsButton),n(this.settingsButton,this.guiContainer,this.gui),this._isReady=!1}};export{x as default};