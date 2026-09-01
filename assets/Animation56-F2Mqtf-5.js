import{a as e}from"./lil-gui.esm-jlbWO7FJ.js";import{B as t,Bt as n,E as r,Ft as i,Ht as a,Jn as o,P as s,Qt as c,Tr as l,Tt as u,Wt as d,_t as f,kr as p,l as m,qn as h,r as g,u as _,wr as v,xt as y,zt as b}from"./three.module-CgISyWQV.js";import{i as x,n as S,r as C,t as w}from"./OutputPass-D9GSoAm2.js";import{t as T}from"./UnrealBloomPass-1z79deN3.js";import{i as E,n as D,r as O,t as k}from"./GUIHelper-DspWBXk2.js";import{t as A}from"./AfterimagePass-C960-4eH.js";var j={name:`FXAAShader`,uniforms:{tDiffuse:{value:null},resolution:{value:new v(1/1024,1/512)}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec2 resolution;
		varying vec2 vUv;

		#define EDGE_STEP_COUNT 6
		#define EDGE_GUESS 8.0
		#define EDGE_STEPS 1.0, 1.5, 2.0, 2.0, 2.0, 4.0
		const float edgeSteps[EDGE_STEP_COUNT] = float[EDGE_STEP_COUNT]( EDGE_STEPS );

		float _ContrastThreshold = 0.0312;
		float _RelativeThreshold = 0.063;
		float _SubpixelBlending = 1.0;

		vec4 Sample( sampler2D  tex2D, vec2 uv ) {

			return texture( tex2D, uv );

		}

		float SampleLuminance( sampler2D tex2D, vec2 uv ) {

			return dot( Sample( tex2D, uv ).rgb, vec3( 0.3, 0.59, 0.11 ) );

		}

		float SampleLuminance( sampler2D tex2D, vec2 texSize, vec2 uv, float uOffset, float vOffset ) {

			uv += texSize * vec2(uOffset, vOffset);
			return SampleLuminance(tex2D, uv);

		}

		struct LuminanceData {

			float m, n, e, s, w;
			float ne, nw, se, sw;
			float highest, lowest, contrast;

		};

		LuminanceData SampleLuminanceNeighborhood( sampler2D tex2D, vec2 texSize, vec2 uv ) {

			LuminanceData l;
			l.m = SampleLuminance( tex2D, uv );
			l.n = SampleLuminance( tex2D, texSize, uv,  0.0,  1.0 );
			l.e = SampleLuminance( tex2D, texSize, uv,  1.0,  0.0 );
			l.s = SampleLuminance( tex2D, texSize, uv,  0.0, -1.0 );
			l.w = SampleLuminance( tex2D, texSize, uv, -1.0,  0.0 );

			l.ne = SampleLuminance( tex2D, texSize, uv,  1.0,  1.0 );
			l.nw = SampleLuminance( tex2D, texSize, uv, -1.0,  1.0 );
			l.se = SampleLuminance( tex2D, texSize, uv,  1.0, -1.0 );
			l.sw = SampleLuminance( tex2D, texSize, uv, -1.0, -1.0 );

			l.highest = max( max( max( max( l.n, l.e ), l.s ), l.w ), l.m );
			l.lowest = min( min( min( min( l.n, l.e ), l.s ), l.w ), l.m );
			l.contrast = l.highest - l.lowest;
			return l;

		}

		bool ShouldSkipPixel( LuminanceData l ) {

			float threshold = max( _ContrastThreshold, _RelativeThreshold * l.highest );
			return l.contrast < threshold;

		}

		float DeterminePixelBlendFactor( LuminanceData l ) {

			float f = 2.0 * ( l.n + l.e + l.s + l.w );
			f += l.ne + l.nw + l.se + l.sw;
			f *= 1.0 / 12.0;
			f = abs( f - l.m );
			f = clamp( f / l.contrast, 0.0, 1.0 );

			float blendFactor = smoothstep( 0.0, 1.0, f );
			return blendFactor * blendFactor * _SubpixelBlending;

		}

		struct EdgeData {

			bool isHorizontal;
			float pixelStep;
			float oppositeLuminance, gradient;

		};

		EdgeData DetermineEdge( vec2 texSize, LuminanceData l ) {

			EdgeData e;
			float horizontal =
				abs( l.n + l.s - 2.0 * l.m ) * 2.0 +
				abs( l.ne + l.se - 2.0 * l.e ) +
				abs( l.nw + l.sw - 2.0 * l.w );
			float vertical =
				abs( l.e + l.w - 2.0 * l.m ) * 2.0 +
				abs( l.ne + l.nw - 2.0 * l.n ) +
				abs( l.se + l.sw - 2.0 * l.s );
			e.isHorizontal = horizontal >= vertical;

			float pLuminance = e.isHorizontal ? l.n : l.e;
			float nLuminance = e.isHorizontal ? l.s : l.w;
			float pGradient = abs( pLuminance - l.m );
			float nGradient = abs( nLuminance - l.m );

			e.pixelStep = e.isHorizontal ? texSize.y : texSize.x;

			if (pGradient < nGradient) {

				e.pixelStep = -e.pixelStep;
				e.oppositeLuminance = nLuminance;
				e.gradient = nGradient;

			} else {

				e.oppositeLuminance = pLuminance;
				e.gradient = pGradient;

			}

			return e;

		}

		float DetermineEdgeBlendFactor( sampler2D  tex2D, vec2 texSize, LuminanceData l, EdgeData e, vec2 uv ) {

			vec2 uvEdge = uv;
			vec2 edgeStep;
			if (e.isHorizontal) {

				uvEdge.y += e.pixelStep * 0.5;
				edgeStep = vec2( texSize.x, 0.0 );

			} else {

				uvEdge.x += e.pixelStep * 0.5;
				edgeStep = vec2( 0.0, texSize.y );

			}

			float edgeLuminance = ( l.m + e.oppositeLuminance ) * 0.5;
			float gradientThreshold = e.gradient * 0.25;

			vec2 puv = uvEdge + edgeStep * edgeSteps[0];
			float pLuminanceDelta = SampleLuminance( tex2D, puv ) - edgeLuminance;
			bool pAtEnd = abs( pLuminanceDelta ) >= gradientThreshold;

			for ( int i = 1; i < EDGE_STEP_COUNT && !pAtEnd; i++ ) {

				puv += edgeStep * edgeSteps[i];
				pLuminanceDelta = SampleLuminance( tex2D, puv ) - edgeLuminance;
				pAtEnd = abs( pLuminanceDelta ) >= gradientThreshold;

			}

			if ( !pAtEnd ) {

				puv += edgeStep * EDGE_GUESS;

			}

			vec2 nuv = uvEdge - edgeStep * edgeSteps[0];
			float nLuminanceDelta = SampleLuminance( tex2D, nuv ) - edgeLuminance;
			bool nAtEnd = abs( nLuminanceDelta ) >= gradientThreshold;

			for ( int i = 1; i < EDGE_STEP_COUNT && !nAtEnd; i++ ) {

				nuv -= edgeStep * edgeSteps[i];
				nLuminanceDelta = SampleLuminance( tex2D, nuv ) - edgeLuminance;
				nAtEnd = abs( nLuminanceDelta ) >= gradientThreshold;

			}

			if ( !nAtEnd ) {

				nuv -= edgeStep * EDGE_GUESS;

			}

			float pDistance, nDistance;
			if ( e.isHorizontal ) {

				pDistance = puv.x - uv.x;
				nDistance = uv.x - nuv.x;

			} else {

				pDistance = puv.y - uv.y;
				nDistance = uv.y - nuv.y;

			}

			float shortestDistance;
			bool deltaSign;
			if ( pDistance <= nDistance ) {

				shortestDistance = pDistance;
				deltaSign = pLuminanceDelta >= 0.0;

			} else {

				shortestDistance = nDistance;
				deltaSign = nLuminanceDelta >= 0.0;

			}

			if ( deltaSign == ( l.m - edgeLuminance >= 0.0 ) ) {

				return 0.0;

			}

			return 0.5 - shortestDistance / ( pDistance + nDistance );

		}

		vec4 ApplyFXAA( sampler2D  tex2D, vec2 texSize, vec2 uv ) {

			LuminanceData luminance = SampleLuminanceNeighborhood( tex2D, texSize, uv );
			if ( ShouldSkipPixel( luminance ) ) {

				return Sample( tex2D, uv );

			}

			float pixelBlend = DeterminePixelBlendFactor( luminance );
			EdgeData edge = DetermineEdge( texSize, luminance );
			float edgeBlend = DetermineEdgeBlendFactor( tex2D, texSize, luminance, edge, uv );
			float finalBlend = max( pixelBlend, edgeBlend );

			if (edge.isHorizontal) {

				uv.y += edge.pixelStep * finalBlend;

			} else {

				uv.x += edge.pixelStep * finalBlend;

			}

			return Sample( tex2D, uv );

		}

		void main() {

			gl_FragColor = ApplyFXAA( tDiffuse, resolution.xy, vUv );

		}`},M=`
    varying vec2 vUv;
    uniform sampler2D tPos;
    uniform sampler2D tVel;
    uniform sampler2D tVis;
    uniform float uDt;
    uniform float uTime;
    uniform float uNoiseScale;   // bass → 流场（噪声尺度）
    uniform float uNoisePower;   // bass → 流场（噪声强度）
    uniform float uFlowStrength; // bass → 流场（整体强度）
    uniform float uAttractorStrength;
    uniform float uGlobalDriftZ;
    uniform float uDamping;

    // 吸引子
    uniform vec3 uAttractor0;
    uniform vec3 uAttractor1;
    uniform vec3 uAttractor2;

    // 爆发参数
    uniform float uBurstActive;
    uniform vec3  uBurstPos;
    uniform float uBurstRadius;
    uniform float uBurstSpeedMin;
    uniform float uBurstSpeedMax;
    uniform float uBurstLifeMin;
    uniform float uBurstLifeMax;
    uniform float uBurstHue0;
    uniform float uBurstHue1;
    uniform float uBurstSat0;
    uniform float uBurstSat1;
    uniform float uBurstEnergy0;
    uniform float uBurstEnergy1;
    uniform float uBurstTrail0;
    uniform float uBurstTrail1;
    uniform float uBurstProb;  // burstCount/NP

    // 颜色（重生时按 GUI 参数随机分配）
    uniform float uBaseHue;
    uniform float uHueRange;

    float hash(vec3 p) {
        return fract(sin(dot(p,vec3(12.9898,78.233,37.719)))*43758.5453);
    }

    float noise3(vec3 p) {
        vec3 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
        return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),
                       mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
                   mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),
                       mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);
    }

    vec3 curlNoise(vec3 p, float time, float scale, float power) {
        float px = p.x, py = p.y, pz = p.z;
        float sx=px*scale, sy=py*scale, sz=pz*scale;
        float t=time*0.08, eps=0.05;
        float n0=noise3(vec3(sx+t,sy,sz));
        float nx=noise3(vec3(sx+eps+t,sy,sz));
        float ny=noise3(vec3(sx+t,sy+eps,sz));
        float nz=noise3(vec3(sx+t,sy,sz+eps));
        float gx=(nx-n0)/eps, gy=(ny-n0)/eps, gz=(nz-n0)/eps;
        float cx=gy-gz, cy=gz-gx, cz=gx-gy;
        float mag=sqrt(cx*cx+cy*cy+cz*cz);
        float pwr=power*2.0;
        float sm = mag>0.001 ? pow(min(mag*2.0,1.0), pwr)/mag : 1.0;
        return vec3(cx*sm, cy*sm, cz*sm);
    }

    // 共用计算体
    void computeMain(out vec3 newPos, out vec3 newVel, out float newLife,
                     out float newMaxLife, out float newHue, out float newSat,
                     out float newEn, out float newTrail,
                     vec2 uv) {
        vec4 pT = texture2D(tPos, uv);
        vec3 pos = pT.xyz;
        float life = pT.w;
        vec4 vT = texture2D(tVel, uv);
        vec3 vel = vT.xyz;
        float maxLife = vT.w;
        vec4 visT = texture2D(tVis, uv);
        float hue = visT.x, sat = visT.y, en = visT.z, trail = visT.w;

        // ---- 力计算 ----
        vec3 force = vec3(0.0);

        // ① 流场力 (curlNoise) — bass → 流场涌动（仅此一个特征）
        vec3 curl = curlNoise(pos, uTime, uNoiseScale, uNoisePower);
        force += curl * uFlowStrength;

        // ② 吸引子
        vec3 aa[3]; aa[0]=uAttractor0; aa[1]=uAttractor1; aa[2]=uAttractor2;
        for (int a=0; a<3; a++) {
            vec3 d = aa[a] - pos;
            float dist = length(d);
            force += d / (dist*dist + 10.0) * uAttractorStrength;
        }

        // ③ 全局漂移
        force.z += uGlobalDriftZ;

        // ---- 积分 ----
        vec3 nVel = (vel + force) * uDamping;
        vec3 nPos = pos + nVel * uDt;

        // ---- 生命周期（恒定速率，不受音频影响） ----
        float lifeSpeed = 1.0/max(maxLife,0.5);
        float nLife = life + lifeSpeed * uDt;

        // ---- 重生判断 ----
        bool respawn = nLife >= 1.0 ||
                       nPos.z < -750.0 || nPos.z > 750.0 ||
                       abs(nPos.x) > 650.0 || abs(nPos.y) > 650.0;

        // 爆发 Emitter 触发 (CPU 可覆盖)
        if (uBurstProb > 0.0 && !respawn && hash(vec3(uv, uTime+1000.0)) < uBurstProb) {
            respawn = true;
        }

        if (respawn) {
            vec3 seed = vec3(uv, uTime+2000.0);
            float r1=hash(seed+0.1), r2=hash(seed+0.2), r3=hash(seed+0.3);

            // 爆发模式 vs 普通重生
            bool burst = uBurstActive > 0.5 && hash(seed+0.4) < 0.7;
            if (burst) {
                float R = sqrt(r1)*uBurstRadius;
                float th=r2*6.283, ph=acos(r3);
                nPos = vec3(R*sin(ph)*cos(th)+uBurstPos.x,
                            R*sin(ph)*sin(th)+uBurstPos.y,
                            R*cos(ph)+uBurstPos.z);
                float spd = uBurstSpeedMin + r3*(uBurstSpeedMax-uBurstSpeedMin);
                nVel = vec3(hash(seed+0.5)-0.5, hash(seed+0.6)-0.5, (hash(seed+0.55)-0.5)*spd*0.8);
                nLife = 0.0;
                newMaxLife = uBurstLifeMin + hash(seed+0.7)*(uBurstLifeMax-uBurstLifeMin);
                newHue = uBurstHue0 + hash(seed+0.8)*(uBurstHue1-uBurstHue0);
                newSat = uBurstSat0 + hash(seed+0.9)*(uBurstSat1-uBurstSat0);
                newEn  = uBurstEnergy0 + hash(seed+1.0)*(uBurstEnergy1-uBurstEnergy0);
                newTrail = uBurstTrail0 + hash(seed+1.1)*(uBurstTrail1-uBurstTrail0);
            } else {
                float R = sqrt(r1)*550.0;
                float th=r2*6.283, ph=acos(r3);
                nPos = vec3(R*sin(ph)*cos(th), R*sin(ph)*sin(th), R*cos(ph)+50.0);
                nVel = vec3(hash(seed+0.5)-0.5, hash(seed+0.6)-0.5,
                            (hash(seed+0.7)-0.5)*80.0);
                nLife = 0.0;
                newMaxLife = 2.0+hash(seed+0.8)*6.0;
                newHue = fract(uBaseHue + (hash(seed+0.9)-0.5)*uHueRange*2.0);
                newSat = 0.6+hash(seed+1.0)*0.4;
                newEn  = 0.3+hash(seed+1.1)*0.5;
                newTrail = 0.2+hash(seed+1.2)*0.4;
            }
            newPos = nPos; newVel = nVel; newLife = nLife;
        } else {
            newPos = nPos; newVel = nVel; newLife = nLife;
            newMaxLife = maxLife;
            newHue = hue; newSat = sat; newEn = en; newTrail = trail;
        }
    }
`,N=M+`
    void main() {
        vec3 np, nv; float nl, nml, nh, ns, ne, nt;
        computeMain(np, nv, nl, nml, nh, ns, ne, nt, vUv);
        gl_FragColor = vec4(np, nl);
    }
`,P=M+`
    void main() {
        vec3 np, nv; float nl, nml, nh, ns, ne, nt;
        computeMain(np, nv, nl, nml, nh, ns, ne, nt, vUv);
        gl_FragColor = vec4(nv, nml);
    }
`,F=M+`
    void main() {
        vec3 np, nv; float nl, nml, nh, ns, ne, nt;
        computeMain(np, nv, nl, nml, nh, ns, ne, nt, vUv);
        gl_FragColor = vec4(nh, ns, ne, nt);
    }
`,I=class{constructor(e,t){this.camera=e,this.settings=t,this.defs={IDLE:{y:120,z:-300,fov:58,lx:0,ly:0,lz:250,t0:4,t1:8,ax:3,fx:.12},APPROACH:{y:80,z:-200,fov:62,lx:0,ly:0,lz:200,t0:3,t1:5,ax:2,fx:.15},DIVE:{y:25,z:-120,fov:68,lx:0,ly:0,lz:150,t0:2,t1:4,ax:.5,fx:.08},ORBIT:{y:60,z:-250,fov:55,lx:0,ly:0,lz:200,t0:5,t1:9,ax:5,fx:.22},RECOVER:{y:100,z:-280,fov:58,lx:0,ly:0,lz:230,t0:3,t1:6,ax:2,fx:.1}},this.routes={IDLE:[`APPROACH`,`ORBIT`],APPROACH:[`DIVE`,`ORBIT`],DIVE:[`RECOVER`,`ORBIT`,`IDLE`],ORBIT:[`IDLE`,`APPROACH`,`DIVE`],RECOVER:[`IDLE`,`APPROACH`]},this.state=`IDLE`,this.timer=0,this.dur=6,this.prog=1,this.pos=new l(0,120,-300),this.pTgt=new l(0,120,-300),this.fov=58,this.fTgt=58,this.look=new l(0,0,250),this.fovPulse=0}onBeat(e,t){let n={kick:t>.5?`DIVE`:`APPROACH`,snare:`ORBIT`,hihat:`IDLE`}[e];if(!n||n===this.state)return;this.state=n,this.prog=0,this.timer=0;let r=this.defs[n];this.dur=r.t0+Math.random()*(r.t1-r.t0),e===`kick`&&(this.fovPulse=t*5)}_nextState(){let e=this.routes[this.state]||[`IDLE`];return e[Math.floor(Math.random()*e.length)]}update(e){let t=this.settings.driftScale;if(t<=0){this.fovPulse*=.92,this.fovPulse<.1&&(this.fovPulse=0);return}if(this.timer+=e,this.timer>=this.dur&&this.prog>=.99){let e=this._nextState();this.state=e,this.prog=0,this.timer=0;let t=this.defs[e];this.dur=t.t0+Math.random()*(t.t1-t.t0)}let n=this.defs.IDLE,r=this.defs[this.state],i=Math.min(1,t);this.pTgt.set(0,n.y+(r.y-n.y)*i,n.z+(r.z-n.z)*i),this.fTgt=n.fov+(r.fov-n.fov)*i,this.look.set(n.lx+(r.lx-n.lx)*i,n.ly+(r.ly-n.ly)*i,n.lz+(r.lz-n.lz)*i);let a=this.prog<1?.15:.04;this.prog=Math.min(1,this.prog+e*.5),this.pos.lerp(this.pTgt,a),this.fov+=(this.fTgt-this.fov)*a,this.camera.position.y=this.pos.y,this.camera.position.z=this.pos.z,this.camera.position.x=Math.sin(this.timer*r.fx)*r.ax*t;let o=this.fov+this.fovPulse;this.camera.fov+=(o-this.camera.fov)*.15,this.fovPulse*=.92,this.fovPulse<.1&&(this.fovPulse=0),this.camera.updateProjectionMatrix(),this.camera.lookAt(this.look)}reset(e){this.state=`IDLE`,this.timer=0,this.dur=6,this.prog=1,this.pos.set(0,120,-300),this.pTgt.set(0,120,-300),this.fov=58,this.fTgt=58,this.look.set(0,0,250),this.fovPulse=0,this.camera.position.set(0,120,-300),this.camera.fov=58,this.camera.updateProjectionMatrix(),this.camera.lookAt(this.look),e&&(e.toneMappingExposure=this.settings.exposure)}},L=class{constructor(e,t={}){this.canvas=e;let n={bloomStrength:.4,bloomRadius:.3,bloomThreshold:.6,exposure:1,particleSize:1,trailStrength:.6,brightness:1,stretchStrength:.8,driftScale:1,flowStrength:1.5,attractorStrength:1.5,driftZ:-2,spawnBurst:!0,spawnCount:1e3,kickForce:5,burstPower:1,beatSensitivity:1,bassStrength:1,midStrength:1,highStrength:1,brightnessStrength:1,baseHue:.3,hueRange:.5,saturation:.85,themeSpeed:1};this.settings={...n,...t},this.defaultSettings=n,this.scene=null,this.camera=null,this.renderer=null,this.composer=null,this.bloomPass=null,this.afterimagePass=null,this.fxaaPass=null,this.bass=0,this.mid=0,this.high=0,this.brightness=.5,this.kick=0,this.snare=0,this.hihat=0,this._kickCooldown=0,this._snareCooldown=0,this._hihatCooldown=0,this.hasAudioData=!1,this._isReady=!1,this.lastTime=0,this.elapsed=0,this.gui=null,this.guiContainer=null,this.guiVisible=!1,this.settingsButton=null,this.NP=6e4,this.TEX_W=256,this.TEX_H=Math.ceil(this.NP/this.TEX_W),this.TEX_SIZE=this.TEX_W*this.TEX_H,this.pos=null,this.vel=null,this.size=null,this.bri=null,this.life=null,this.maxLife=null,this.hue=null,this.saturation=null,this.energy=null,this.trailLen=null,this.rtPosA=this.rtVelA=this.rtVisA=null,this.rtPosB=this.rtVelB=this.rtVisB=null,this.texPosIn=this.texVelIn=this.texVisIn=null,this.matPos=this.matVel=this.matVis=null,this.meshPos=this.meshVel=this.meshVis=null,this.burstState={active:0,timer:0,prob:0,pos:new l(0,0,50),radius:80,speedMin:80,speedMax:180,lifeMin:.5,lifeMax:2,hue0:.55,hue1:.65,sat0:.8,sat1:1,en0:.8,en1:1,trail0:.6,trail1:1},this.simParams={flowTime:0,flowStrength:1.5,attractorStrength:1.5,damping:.998,globalDriftZ:-2},this.attractors=[{pos:[0,0,-40],phase:0},{pos:[15,-5,-60],phase:2.1},{pos:[-12,8,-80],phase:4.3}],this.cameraDirector=null,this.init().then(()=>{this._isReady=!0}).catch(e=>{console.error(`❌ Animation56 初始化失败:`,e)})}async init(){if(!this.scene)try{return this.setupThreeJS(),this.createParticleData(),this.createComputeSystem(),this.createParticlePoints(),this.setupPostProcessing(),this.setupGUI(),this.setupSettingsButton(),console.log(`✅ Animation56 初始化成功`),!0}catch(e){throw console.error(`❌ Animation56 初始化失败:`,e),e}}setupThreeJS(){this.scene=new h,this.scene.background=null,this.camera=new n(58,window.innerWidth/window.innerHeight,.1,2e3),this.camera.position.set(0,120,-300),this.camera.lookAt(0,0,200),this.renderer=new g({canvas:this.canvas,antialias:!0,alpha:!0,powerPreference:`high-performance`}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.outputColorSpace=f,this.renderer.toneMapping=4,this.renderer.toneMappingExposure=this.settings.exposure,this.cameraDirector=new I(this.camera,this.settings)}createParticleData(){let e=this.NP;this.pos=new Float32Array(e*3),this.vel=new Float32Array(e*3),this.size=new Float32Array(e),this.bri=new Float32Array(e),this.life=new Float32Array(e),this.maxLife=new Float32Array(e),this.hue=new Float32Array(e),this.saturation=new Float32Array(e),this.energy=new Float32Array(e),this.trailLen=new Float32Array(e);let t=this._getEmitterConfig();for(let n=0;n<e;n++)this._initParticle(n,t)}_getEmitterConfig(){return{position:new l(0,0,50),radius:550,speedMax:100,sizeMin:.6,sizeMax:4,brightMin:.4,brightMax:1,trailMin:.2,trailMax:.6,satRange:[.5,1],energyRange:[.3,.8],lifeMin:2,lifeMax:8}}resetParticles(){let e=this._getEmitterConfig();for(let t=0;t<this.NP;t++)this._initParticle(t,e);this._packParticleTextures(),this.texPosIn.needsUpdate=!0,this.texVelIn.needsUpdate=!0,this.texVisIn.needsUpdate=!0,this.geo&&(this.geo.attributes.size.needsUpdate=!0,this.geo.attributes.brightness.needsUpdate=!0),this.curReadTex={pos:this.texPosIn,vel:this.texVelIn,vis:this.texVisIn},this.curWriteRT={pos:this.rtPosA,vel:this.rtVelA,vis:this.rtVisA},this.altWriteRT={pos:this.rtPosB,vel:this.rtVelB,vis:this.rtVisB},this.simParams.flowTime=0}_initParticle(e,t){let n=e*3,r=t.radius,i=Math.sqrt(Math.random())*r,a=Math.random()*Math.PI*2,o=Math.acos(Math.random());this.pos[n]=i*Math.sin(o)*Math.cos(a)+t.position.x,this.pos[n+1]=i*Math.sin(o)*Math.sin(a)+t.position.y,this.pos[n+2]=i*Math.cos(o)+t.position.z,this.vel[n]=y.randFloat(-.1,.1),this.vel[n+1]=y.randFloat(-.1,.1),this.vel[n+2]=y.randFloat(-t.speedMax,t.speedMax)*.3,this.size[e]=y.randFloat(t.sizeMin,t.sizeMax),this.bri[e]=y.randFloat(t.brightMin,t.brightMax),this.trailLen[e]=y.randFloat(t.trailMin,t.trailMax),this.life[e]=0,this.maxLife[e]=y.randFloat(t.lifeMin,t.lifeMax);let s=this.settings.baseHue,c=this.settings.hueRange,l=s+(Math.random()-.5)*c*2;this.hue[e]=l-Math.floor(l),this.saturation[e]=t.satRange[0]+Math.random()*(t.satRange[1]-t.satRange[0]),this.energy[e]=t.energyRange[0]+Math.random()*(t.energyRange[1]-t.energyRange[0])}makeFloatRT(e,n){return new p(e,n,{minFilter:i,magFilter:i,format:c,type:t,depthBuffer:!1,stencilBuffer:!1})}makeDataTexture(e,n,a){let o=new r(e,n,a,c,t);return o.needsUpdate=!0,o.minFilter=i,o.magFilter=i,o.flipY=!1,o}createComputeSystem(){this.NP;let e=this.TEX_W,t=this.TEX_H,n=e*t;this._posTexData=new Float32Array(n*4),this._velTexData=new Float32Array(n*4),this._visTexData=new Float32Array(n*4),this._packParticleTextures(),this.texPosIn=this.makeDataTexture(this._posTexData,e,t),this.texVelIn=this.makeDataTexture(this._velTexData,e,t),this.texVisIn=this.makeDataTexture(this._visTexData,e,t),this.rtPosA=this.makeFloatRT(e,t),this.rtVelA=this.makeFloatRT(e,t),this.rtVisA=this.makeFloatRT(e,t),this.rtPosB=this.makeFloatRT(e,t),this.rtVelB=this.makeFloatRT(e,t),this.rtVisB=this.makeFloatRT(e,t),this.curReadTex={pos:this.texPosIn,vel:this.texVelIn,vis:this.texVisIn},this.curWriteRT={pos:this.rtPosA,vel:this.rtVelA,vis:this.rtVisA},this.altWriteRT={pos:this.rtPosB,vel:this.rtVelB,vis:this.rtVisB},this.computeQuadGeo=new a(2,2),this.computeCam=new b(-1,1,1,-1,0,1),this.computeScene=new h,this.matPos=this.makeComputeMat(N),this.matVel=this.makeComputeMat(P),this.matVis=this.makeComputeMat(F),this.computeUniforms=[this.matPos.uniforms,this.matVel.uniforms,this.matVis.uniforms],this.meshPos=new u(this.computeQuadGeo,this.matPos),this.meshVel=new u(this.computeQuadGeo,this.matVel),this.meshVis=new u(this.computeQuadGeo,this.matVis),this.computeScene.add(this.meshPos,this.meshVel,this.meshVis)}_packParticleTextures(){let e=this.NP,t=this.TEX_W,n=this._posTexData,r=this._velTexData,i=this._visTexData;for(let a=0;a<e;a++){let e=a*3,o=Math.floor(a/t)*t*4,s=a%t*4;n[o+s]=this.pos[e],n[o+s+1]=this.pos[e+1],n[o+s+2]=this.pos[e+2],n[o+s+3]=this.life[a],r[o+s]=this.vel[e],r[o+s+1]=this.vel[e+1],r[o+s+2]=this.vel[e+2],r[o+s+3]=this.maxLife[a],i[o+s]=this.hue[a],i[o+s+1]=this.saturation[a],i[o+s+2]=this.energy[a],i[o+s+3]=this.trailLen[a]}}makeComputeMat(e){return new o({uniforms:{tPos:{value:this.texPosIn},tVel:{value:this.texVelIn},tVis:{value:this.texVisIn},uDt:{value:1/60},uTime:{value:0},uNoiseScale:{value:.006},uNoisePower:{value:.4},uFlowStrength:{value:1},uAttractorStrength:{value:1},uGlobalDriftZ:{value:-2},uDamping:{value:.998},uAttractor0:{value:new l},uAttractor1:{value:new l},uAttractor2:{value:new l},uBurstActive:{value:0},uBurstPos:{value:new l},uBurstRadius:{value:80},uBurstSpeedMin:{value:80},uBurstSpeedMax:{value:180},uBurstLifeMin:{value:.5},uBurstLifeMax:{value:2},uBurstHue0:{value:.55},uBurstHue1:{value:.65},uBurstSat0:{value:.8},uBurstSat1:{value:1},uBurstEnergy0:{value:.8},uBurstEnergy1:{value:1},uBurstTrail0:{value:.6},uBurstTrail1:{value:1},uBurstProb:{value:0},uBaseHue:{value:.62},uHueRange:{value:.55}},vertexShader:`varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position,1.0); }`,fragmentShader:e,depthWrite:!1,depthTest:!1})}setComputeUniform(e,t){for(let n of this.computeUniforms)n[e].value=t}stepGPU(e){this.setComputeUniform(`uDt`,e),this.simParams.flowTime+=e,this.setComputeUniform(`uTime`,this.simParams.flowTime),this.setComputeUniform(`uNoiseScale`,.006+this.bass*.018),this.setComputeUniform(`uNoisePower`,.4+this.bass*2.8),this.setComputeUniform(`uFlowStrength`,this.simParams.flowStrength*(1+this.bass*1.2*this.settings.bassStrength)),this.setComputeUniform(`uAttractorStrength`,this.simParams.attractorStrength),this.setComputeUniform(`uGlobalDriftZ`,this.simParams.globalDriftZ),this.setComputeUniform(`uDamping`,this.simParams.damping),this.updateAttractors(e),this.setComputeUniform(`uAttractor0`,this.attractors[0].pos),this.setComputeUniform(`uAttractor1`,this.attractors[1].pos),this.setComputeUniform(`uAttractor2`,this.attractors[2].pos),this.burstState.timer>0&&(this.burstState.timer-=e,this.burstState.timer<=0&&(this.burstState.active=0,this.burstState.prob=0));let t=this.burstState;this.setComputeUniform(`uBurstActive`,t.active),this.setComputeUniform(`uBurstProb`,t.prob),this.setComputeUniform(`uBurstPos`,t.pos),this.setComputeUniform(`uBurstRadius`,t.radius),this.setComputeUniform(`uBurstSpeedMin`,t.speedMin),this.setComputeUniform(`uBurstSpeedMax`,t.speedMax),this.setComputeUniform(`uBurstLifeMin`,t.lifeMin),this.setComputeUniform(`uBurstLifeMax`,t.lifeMax),this.setComputeUniform(`uBurstHue0`,t.hue0),this.setComputeUniform(`uBurstHue1`,t.hue1),this.setComputeUniform(`uBurstSat0`,t.sat0),this.setComputeUniform(`uBurstSat1`,t.sat1),this.setComputeUniform(`uBurstEnergy0`,t.en0),this.setComputeUniform(`uBurstEnergy1`,t.en1),this.setComputeUniform(`uBurstTrail0`,t.trail0),this.setComputeUniform(`uBurstTrail1`,t.trail1),this.setComputeUniform(`uBaseHue`,this.settings.baseHue),this.setComputeUniform(`uHueRange`,this.settings.hueRange);let n=this.curReadTex;this.matPos.uniforms.tPos.value=n.pos,this.matPos.uniforms.tVel.value=n.vel,this.matPos.uniforms.tVis.value=n.vis,this.matVel.uniforms.tPos.value=n.pos,this.matVel.uniforms.tVel.value=n.vel,this.matVel.uniforms.tVis.value=n.vis,this.matVis.uniforms.tPos.value=n.pos,this.matVis.uniforms.tVel.value=n.vel,this.matVis.uniforms.tVis.value=n.vis,this.meshPos.visible=!0,this.meshVel.visible=!1,this.meshVis.visible=!1,this.renderer.setRenderTarget(this.curWriteRT.pos),this.renderer.render(this.computeScene,this.computeCam),this.meshPos.visible=!1,this.meshVel.visible=!0,this.meshVis.visible=!1,this.renderer.setRenderTarget(this.curWriteRT.vel),this.renderer.render(this.computeScene,this.computeCam),this.meshPos.visible=!1,this.meshVel.visible=!1,this.meshVis.visible=!0,this.renderer.setRenderTarget(this.curWriteRT.vis),this.renderer.render(this.computeScene,this.computeCam),this.meshPos.visible=this.meshVel.visible=this.meshVis.visible=!0,this.renderer.setRenderTarget(null);let r=this.TEX_W,i=this.TEX_H,a=this.NP,o=this._posTexData,s=this._velTexData,c=this._visTexData;this.renderer.readRenderTargetPixels(this.curWriteRT.pos,0,0,r,i,o),this.renderer.readRenderTargetPixels(this.curWriteRT.vel,0,0,r,i,s),this.renderer.readRenderTargetPixels(this.curWriteRT.vis,0,0,r,i,c);for(let e=0;e<a;e++){let t=e*3,n=Math.floor(e/r)*r*4,i=e%r*4;this.pos[t]=o[n+i],this.pos[t+1]=o[n+i+1],this.pos[t+2]=o[n+i+2],this.life[e]=o[n+i+3],this.vel[t]=s[n+i],this.vel[t+1]=s[n+i+1],this.vel[t+2]=s[n+i+2],this.maxLife[e]=s[n+i+3],this.hue[e]=c[n+i],this.saturation[e]=c[n+i+1],this.energy[e]=c[n+i+2],this.trailLen[e]=c[n+i+3]}this.syncGeometry();let l=this.curWriteRT;this.curWriteRT=this.altWriteRT,this.altWriteRT=l,this.curReadTex={pos:this.altWriteRT.pos.texture,vel:this.altWriteRT.vel.texture,vis:this.altWriteRT.vis.texture}}updateAttractors(e){for(let t=0;t<3;t++){let n=this.attractors[t];n.phase+=e*.1;let r=.15+t*.05,i=30+t*15;n.pos[0]=Math.cos(n.phase*r)*i,n.pos[1]=Math.sin(n.phase*r*.7)*i*.4+5,n.pos[2]=-40-t*20+Math.sin(n.phase*r*.5)*15}}syncGeometry(){let e=this.geo;e&&(e.attributes.position.needsUpdate=!0,e.attributes.velocity.needsUpdate=!0,e.attributes.hue.needsUpdate=!0,e.attributes.saturation.needsUpdate=!0,e.attributes.energy.needsUpdate=!0,e.attributes.trailLen.needsUpdate=!0,e.attributes.life.needsUpdate=!0)}createParticlePoints(){this.geo=new _,this.geo.setAttribute(`position`,new m(this.pos,3)),this.geo.setAttribute(`velocity`,new m(this.vel,3)),this.geo.setAttribute(`size`,new m(this.size,1)),this.geo.setAttribute(`brightness`,new m(this.bri,1)),this.geo.setAttribute(`hue`,new m(this.hue,1)),this.geo.setAttribute(`saturation`,new m(this.saturation,1)),this.geo.setAttribute(`energy`,new m(this.energy,1)),this.geo.setAttribute(`trailLen`,new m(this.trailLen,1)),this.geo.setAttribute(`life`,new m(this.life,1));for(let e of[`position`,`velocity`,`hue`,`saturation`,`energy`,`trailLen`,`life`])this.geo.attributes[e].setUsage(s);this.mat=new o({transparent:!0,depthWrite:!1,blending:2,uniforms:{uSizeScale:{value:1},uBrightness:{value:1},uColorShift:{value:0},uSaturation:{value:1},uKickForce:{value:0},uStretchAmount:{value:1}},vertexShader:`
                uniform float uSizeScale;
                uniform float uKickForce;
                uniform float uStretchAmount;
                attribute vec3 velocity;
                attribute float size;
                attribute float brightness;
                attribute float hue;
                attribute float saturation;
                attribute float energy;
                attribute float trailLen;
                attribute float life;
                varying float vBright;
                varying float vHue;
                varying float vSat;
                varying float vEnergy;
                varying float vLife;
                varying vec3  vVel;

                void main() {
                    vBright   = brightness;
                    vHue      = hue;
                    vSat      = saturation;
                    vEnergy   = energy;
                    vLife     = life;
                    vVel      = velocity;

                    vec3 p = position + normalize(position) * uKickForce;
                    float speed = length(velocity);

                    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);

                    float stretch = 1.0 + (speed * 0.015 + trailLen * 1.0) * uStretchAmount;

                    float sizeBase = size * uSizeScale * (280.0 / -mvPosition.z);
                    gl_PointSize = sizeBase * stretch;
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,fragmentShader:`
                uniform float uBrightness;
                uniform float uColorShift;
                uniform float uSaturation;
                varying float vBright;
                varying float vHue;
                varying float vSat;
                varying float vEnergy;
                varying float vLife;
                varying vec3  vVel;

                // HSV → RGB 转换
                vec3 hsv2rgb(vec3 c) {
                    vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
                    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
                    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
                }

                void main() {
                    vec2 uv = gl_PointCoord - 0.5;

                    // ---- 圆形发光 ----
                    float d = length(uv) * 2.0;  // [0, 0.5] → [0, 1]
                    float glow = smoothstep(0.5, 0.0, d);

                    // 每粒子单一固定色：出生即定色，终身不变（不同粒子颜色不同）
                    // 仅叠加音频 brightness 全局冷暖偏移（不影响"一粒子一色"）
                    float finalHue = fract(vHue + uColorShift);
                    float finalSat = clamp(vSat * uSaturation, 0.0, 1.0);
                    float finalVal = vEnergy;

                    // 速度对颜色的影响: 高速粒子偏白
                    float speed = length(vVel);
                    float speedWhite = clamp(speed * 0.003, 0.0, 0.5);
                    finalSat = mix(finalSat, 0.0, speedWhite);
                    finalVal = min(1.0, finalVal + speedWhite * 0.3);

                    vec3 rgb = hsv2rgb(vec3(finalHue, finalSat, finalVal));

                    // 生命末期变暗（立方衰减，生命结束完全消失）
                    float lifeFade = 1.0 - vLife * vLife * vLife;

                    vec3 color = rgb * vBright * uBrightness * glow * lifeFade;

                    // 核心区域加亮
                    float core = smoothstep(0.3, 0.0, d);
                    color += rgb * finalVal * 0.4 * core;

                    gl_FragColor = vec4(color, glow * 0.85);
                }
            `}),this.points=new d(this.geo,this.mat),this.points.frustumCulled=!1,this.scene.add(this.points)}setupPostProcessing(){this.composer=new C(this.renderer),this.composer.addPass(new S(this.scene,this.camera)),this.bloomPass=new T(new v(window.innerWidth,window.innerHeight),this.settings.bloomStrength,this.settings.bloomRadius,this.settings.bloomThreshold),this.composer.addPass(this.bloomPass),this.afterimagePass=new A(this.settings.trailStrength),this.composer.addPass(this.afterimagePass),this.fxaaPass=new x(j),this.fxaaPass.uniforms.resolution.value.set(1/window.innerWidth,1/window.innerHeight),this.composer.addPass(this.fxaaPass),this.composer.addPass(new w)}setupGUI(){this.guiContainer=O(`Animation56-gui-container`),k(`Animation56-gui-container`),document.body.appendChild(this.guiContainer),this.gui=new e({title:`星河漫舞`,container:this.guiContainer});let t=this.gui.addFolder(`音频映射`);t.add(this.settings,`bassStrength`,0,2,.05).name(`低音→流场`),t.add(this.settings,`midStrength`,0,2,.05).name(`中音→膨胀`),t.add(this.settings,`highStrength`,0,2,.05).name(`高音→闪耀`),t.add(this.settings,`brightnessStrength`,0,2,.05).name(`质心→色相`),t.open();let n=this.gui.addFolder(`颜色`);n.add(this.settings,`baseHue`,0,1,.01).name(`基础色相`),n.add(this.settings,`hueRange`,0,1,.01).name(`色相范围`),n.add(this.settings,`saturation`,0,1,.01).name(`饱和度`),n.add(this.settings,`themeSpeed`,0,3,.05).name(`主题流速`),n.open();let r=this.gui.addFolder(`粒子`);r.add(this.settings,`particleSize`,.3,3).name(`大小基准`),r.add(this.settings,`brightness`,0,3).name(`亮度基准`),r.add(this.settings,`trailStrength`,0,.98).name(`拖尾强度`),r.add(this.settings,`stretchStrength`,0,3).name(`速度增益`),r.open();let i=this.gui.addFolder(`力场`);i.add(this.settings,`flowStrength`,0,3).name(`流场基准`),i.add(this.settings,`attractorStrength`,0,3).name(`吸引子强度`),i.add(this.settings,`driftZ`,-10,0,.1).name(`下漂速度`),i.open();let a=this.gui.addFolder(`节拍`);a.add(this.settings,`spawnBurst`).name(`爆发生成`),a.add(this.settings,`spawnCount`,100,2e3).name(`爆发数量`),a.add(this.settings,`beatSensitivity`,.1,3,.05).name(`节拍灵敏度`),a.add(this.settings,`kickForce`,0,200,5).name(`kick 踢击力`),a.add(this.settings,`burstPower`,.2,3,.05).name(`爆发力度`),a.open();let o=this.gui.addFolder(`相机`);o.add(this.settings,`driftScale`,0,1).name(`相机运动`),o.open();let s=this.gui.addFolder(`后期`);s.add(this.settings,`bloomStrength`,0,3).name(`bloom强度`),s.add(this.settings,`bloomRadius`,0,1).name(`bloom半径`),s.add(this.settings,`bloomThreshold`,0,1).name(`bloom阈值`),s.add(this.settings,`exposure`,.2,3,.01).name(`曝光`),s.open(),this.gui.add({reset:()=>this.resetParams()},`reset`).name(`重置参数`),this.gui.hide()}resetParams(){if(Object.assign(this.settings,this.defaultSettings),this.bloomPass.strength=this.settings.bloomStrength,this.bloomPass.radius=this.settings.bloomRadius,this.bloomPass.threshold=this.settings.bloomThreshold,this.renderer.toneMappingExposure=this.settings.exposure,this.afterimagePass.damp=this.settings.trailStrength,this.resetState(),this.resetParticles(),this.gui){let e=t=>{t&&(t.controllers.forEach(e=>e.updateDisplay()),t.folders.forEach(e))};e(this.gui),this.gui.controllers.forEach(e=>e.updateDisplay())}}setupSettingsButton(){this.settingsButton=E(`Animation56-settings-button`),this.settingsButton.addEventListener(`click`,()=>{this.guiVisible=!this.guiVisible,this.guiVisible?this.gui.show():this.gui.hide()}),document.body.appendChild(this.settingsButton)}updateWithAudioData(e,t){let n=!!(e&&e.isPlaying===!0);if(e&&e.audioFeature&&e.audioFeature.animation){let t=e.audioFeature.animation;this.hasAudioData=e.isPlaying===void 0?!0:n,this.bass=Math.min(this.bass*.5+(t.bass||0)*.5,1),this.mid=Math.min(this.mid*.5+(t.mid||0)*.5,1),this.high=Math.min(this.high*.5+(t.high||0)*.5,1),this.brightness=Math.min(this.brightness*.5+(t.brightness||0)*.5,1),this.kick=t.kick||0,this.snare=t.snare||0,this.hihat=t.hihat||0;return}if(e&&e.energy){this.hasAudioData=e.isPlaying===void 0?!0:n,this.bass=e.energy.low||0,this.mid=e.energy.mid||0,this.high=e.energy.high||0,this.brightness=.5,this.kick=e.beat?.kick||0,this.snare=e.beat?.snare||0,this.hihat=e.beat?.hihat||0;return}this.hasAudioData=!1}_beatEvents(e){let t=this.settings.beatSensitivity||1,n=Math.min(this.kick*t,2),r=Math.min(this.snare*t,2),i=Math.min(this.hihat*t,2);this._kickCooldown=Math.max(0,this._kickCooldown-e),this._snareCooldown=Math.max(0,this._snareCooldown-e),this._hihatCooldown=Math.max(0,this._hihatCooldown-e),n>.3&&this._kickCooldown<=0&&(this._kickCooldown=.3,this._triggerBeat(`kick`,n)),r>.25&&this._snareCooldown<=0&&(this._snareCooldown=.25,this._triggerBeat(`snare`,r)),i>.2&&this._hihatCooldown<=0&&(this._hihatCooldown=.2,this._triggerBeat(`hihat`,i)),this._kickForce=n}_triggerBeat(e,t){let n=this.settings;if(this.renderer.toneMappingExposure=Math.min(2,n.exposure+t*.15),this.cameraDirector.onBeat(e,t),!n.spawnBurst)return;let r=this.burstState,i=n.burstPower;e===`kick`?(r.active=1,r.timer=5,r.prob=Math.min(n.spawnCount/this.NP,.5),r.pos.set(0,0,50),r.radius=(20+t*60)*i,r.speedMin=80*i,r.speedMax=180*i,r.lifeMin=.5*i,r.lifeMax=2*i,r.hue0=n.baseHue-.1,r.hue1=n.baseHue+.1,r.sat0=.8,r.sat1=1,r.en0=.8,r.en1=1,r.trail0=.6,r.trail1=1):e===`snare`?(r.active=1,r.timer=3,r.prob=Math.min(n.spawnCount*.6/this.NP,.5),r.pos.set(0,0,50),r.radius=150*i,r.speedMin=60*i,r.speedMax=140*i,r.lifeMin=1*i,r.lifeMax=3*i,r.hue0=n.baseHue-.2,r.hue1=n.baseHue+.2,r.sat0=.6,r.sat1=1,r.en0=.6,r.en1=1,r.trail0=.8,r.trail1=1.2):(r.active=1,r.timer=1.5,r.prob=Math.min(n.spawnCount*.3/this.NP,.5),r.pos.set(0,0,50),r.radius=80*i,r.speedMin=30*i,r.speedMax=80*i,r.lifeMin=.3*i,r.lifeMax=1*i,r.hue0=n.baseHue-.05,r.hue1=n.baseHue+.05,r.sat0=.3,r.sat1=.6,r.en0=.8,r.en1=1,r.trail0=.1,r.trail1=.4)}render(){if(!this._isReady||!this.composer)return;let e=performance.now()*.001,t=this.lastTime>0?Math.min(.05,e-this.lastTime):.016;this.lastTime=e,this.elapsed+=t;let n=this.settings;this.hasAudioData?this._beatEvents(t):(this.bass*=.95,this.mid*=.95,this.high*=.95,this.brightness+=(.5-this.brightness)*.1,this.kick*=.9,this.snare*=.9,this.hihat*=.9,this._kickForce=0,this._kickCooldown=Math.max(0,this._kickCooldown-t),this._snareCooldown=Math.max(0,this._snareCooldown-t),this._hihatCooldown=Math.max(0,this._hihatCooldown-t),this.bass<.001&&(this.bass=0),this.mid<.001&&(this.mid=0),this.high<.001&&(this.high=0)),this.bloomPass.strength=n.bloomStrength,this.bloomPass.radius=n.bloomRadius,this.bloomPass.threshold=n.bloomThreshold,this.afterimagePass.damp=n.trailStrength,this.renderer.toneMappingExposure+=(n.exposure-this.renderer.toneMappingExposure)*.06,this.mat.uniforms.uKickForce.value=(this._kickForce||0)*n.kickForce,this.mat.uniforms.uSizeScale.value=n.particleSize*(1+this.mid*.8*n.midStrength),this.mat.uniforms.uBrightness.value=n.brightness*(1+this.high*.8*n.highStrength),this.mat.uniforms.uColorShift.value=this.elapsed*.02*n.themeSpeed+(this.brightness-.5)*.8*n.brightnessStrength,this.mat.uniforms.uSaturation.value=n.saturation,this.mat.uniforms.uStretchAmount.value=n.stretchStrength,this.simParams.flowStrength=n.flowStrength,this.simParams.attractorStrength=n.attractorStrength,this.simParams.globalDriftZ=n.driftZ,this.stepGPU(t),this.cameraDirector.update(t),this.composer.render()}onWindowResize(){let e=window.innerWidth,t=window.innerHeight;this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t),this.composer&&this.composer.setSize(e,t),this.afterimagePass&&this.afterimagePass.setSize(e,t),this.fxaaPass&&this.fxaaPass.uniforms.resolution.value.set(1/e,1/t)}resetState(){this.bass=0,this.mid=0,this.high=0,this.brightness=.5,this.kick=0,this.snare=0,this.hihat=0,this._kickForce=0,this._kickCooldown=0,this._snareCooldown=0,this._hihatCooldown=0,this.hasAudioData=!1,this.lastTime=0,this.elapsed=0,Object.assign(this.burstState,{active:0,timer:0,prob:0}),this.cameraDirector&&this.cameraDirector.reset(this.renderer),this.bloomPass&&(this.bloomPass.strength=this.defaultSettings.bloomStrength,this.bloomPass.radius=this.defaultSettings.bloomRadius,this.bloomPass.threshold=this.defaultSettings.bloomThreshold),this.afterimagePass&&(this.afterimagePass.damp=this.defaultSettings.trailStrength)}updateSettings(e){Object.assign(this.settings,e),e.bloomStrength!==void 0&&this.bloomPass&&(this.bloomPass.strength=e.bloomStrength),e.bloomRadius!==void 0&&this.bloomPass&&(this.bloomPass.radius=e.bloomRadius),e.bloomThreshold!==void 0&&this.bloomPass&&(this.bloomPass.threshold=e.bloomThreshold),e.exposure!==void 0&&this.renderer&&(this.renderer.toneMappingExposure=e.exposure)}dispose(){D(this.settingsButton,this.guiContainer,this.gui),this.scene&&this.scene.traverse(e=>{(e.isMesh||e.isPoints||e.isLineSegments||e.isSprite)&&(e.geometry&&e.geometry.dispose(),e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.dispose()):e.material.dispose()))}),this.computeQuadGeo&&this.computeQuadGeo.dispose(),this.matPos&&this.matPos.dispose(),this.matVel&&this.matVel.dispose(),this.matVis&&this.matVis.dispose(),this.geo&&this.geo.dispose(),this.texPosIn&&this.texPosIn.dispose(),this.texVelIn&&this.texVelIn.dispose(),this.texVisIn&&this.texVisIn.dispose(),this.rtPosA&&this.rtPosA.dispose(),this.rtVelA&&this.rtVelA.dispose(),this.rtVisA&&this.rtVisA.dispose(),this.rtPosB&&this.rtPosB.dispose(),this.rtVelB&&this.rtVelB.dispose(),this.rtVisB&&this.rtVisB.dispose(),this.composer&&this.composer.dispose(),this.renderer&&this.renderer.dispose(),this._isReady=!1,console.log(`✅ Animation56 资源已清理`)}};export{L as default};