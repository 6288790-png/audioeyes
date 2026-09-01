import{a as e}from"./lil-gui.esm-jlbWO7FJ.js";import{$ as t,Bt as n,Er as r,Gt as i,Jn as a,K as o,Kt as s,Mr as c,Qn as l,Tr as u,Tt as d,Wt as f,_t as p,et as m,hr as h,it as g,l as _,lt as v,n as y,qn as b,r as x,s as S,t as C,u as w,wr as T,wt as E,xt as D,z as O}from"./three.module-CgISyWQV.js";import{n as k,r as A,t as j}from"./OutputPass-D9GSoAm2.js";import{t as M}from"./UnrealBloomPass-1z79deN3.js";import{i as N,n as P,r as F,t as ee}from"./GUIHelper-DspWBXk2.js";import{t as I}from"./OrbitControls-DVnblHSy.js";var L=new S,R=new u,z=class extends t{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type=`LineSegmentsGeometry`,this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute(`position`,new O([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute(`uv`,new O([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,n=this.attributes.instanceEnd;return t!==void 0&&(t.applyMatrix4(e),n.applyMatrix4(e),t.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new m(t,6,1);return this.setAttribute(`instanceStart`,new g(n,3,0)),this.setAttribute(`instanceEnd`,new g(n,3,3)),this.instanceCount=this.attributes.instanceStart.count,this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new m(t,6,1);return this.setAttribute(`instanceColorStart`,new g(n,3,0)),this.setAttribute(`instanceColorEnd`,new g(n,3,3)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new c(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new S);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;e!==void 0&&t!==void 0&&(this.boundingBox.setFromBufferAttribute(e),L.setFromBufferAttribute(t),this.boundingBox.union(L))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new l),this.boundingBox===null&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(e!==void 0&&t!==void 0){let n=this.boundingSphere.center;this.boundingBox.getCenter(n);let r=0;for(let i=0,a=e.count;i<a;i++)R.fromBufferAttribute(e,i),r=Math.max(r,n.distanceToSquared(R)),R.fromBufferAttribute(t,i),r=Math.max(r,n.distanceToSquared(R));this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error(`THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.`,this)}}toJSON(){}};y.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new T(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}},C.line={uniforms:h.merge([y.common,y.fog,y.line]),vertexShader:`
		#include <common>
		#include <color_pars_vertex>
		#include <fog_pars_vertex>
		#include <logdepthbuf_pars_vertex>
		#include <clipping_planes_pars_vertex>

		uniform float linewidth;
		uniform vec2 resolution;

		attribute vec3 instanceStart;
		attribute vec3 instanceEnd;

		attribute vec3 instanceColorStart;
		attribute vec3 instanceColorEnd;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#ifdef USE_DASH

			uniform float dashScale;
			attribute float instanceDistanceStart;
			attribute float instanceDistanceEnd;
			varying float vLineDistance;

		#endif

		void trimSegment( const in vec4 start, inout vec4 end ) {

			// trim end segment so it terminates between the camera plane and the near plane

			// conservative estimate of the near plane
			float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
			float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
			float nearEstimate = - 0.5 * b / a;

			float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

			end.xyz = mix( start.xyz, end.xyz, alpha );

		}

		void main() {

			#ifdef USE_COLOR

				vColor.xyz = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

			#endif

			#ifdef USE_DASH

				vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
				vUv = uv;

			#endif

			float aspect = resolution.x / resolution.y;

			// camera space
			vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
			vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

			#ifdef WORLD_UNITS

				worldStart = start.xyz;
				worldEnd = end.xyz;

			#else

				vUv = uv;

			#endif

			// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
			// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
			// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
			// perhaps there is a more elegant solution -- WestLangley

			bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

			if ( perspective ) {

				if ( start.z < 0.0 && end.z >= 0.0 ) {

					trimSegment( start, end );

				} else if ( end.z < 0.0 && start.z >= 0.0 ) {

					trimSegment( end, start );

				}

			}

			// clip space
			vec4 clipStart = projectionMatrix * start;
			vec4 clipEnd = projectionMatrix * end;

			// ndc space
			vec3 ndcStart = clipStart.xyz / clipStart.w;
			vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

			// direction
			vec2 dir = ndcEnd.xy - ndcStart.xy;

			// account for clip-space aspect ratio
			dir.x *= aspect;
			dir = normalize( dir );

			#ifdef WORLD_UNITS

				vec3 worldDir = normalize( end.xyz - start.xyz );
				vec3 tmpFwd = normalize( mix( start.xyz, end.xyz, 0.5 ) );
				vec3 worldUp = normalize( cross( worldDir, tmpFwd ) );
				vec3 worldFwd = cross( worldDir, worldUp );
				worldPos = position.y < 0.5 ? start: end;

				// height offset
				float hw = linewidth * 0.5;
				worldPos.xyz += position.x < 0.0 ? hw * worldUp : - hw * worldUp;

				// don't extend the line if we're rendering dashes because we
				// won't be rendering the endcaps
				#ifndef USE_DASH

					// cap extension
					worldPos.xyz += position.y < 0.5 ? - hw * worldDir : hw * worldDir;

					// add width to the box
					worldPos.xyz += worldFwd * hw;

					// endcaps
					if ( position.y > 1.0 || position.y < 0.0 ) {

						worldPos.xyz -= worldFwd * 2.0 * hw;

					}

				#endif

				// project the worldpos
				vec4 clip = projectionMatrix * worldPos;

				// shift the depth of the projected points so the line
				// segments overlap neatly
				vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
				clip.z = clipPose.z * clip.w;

			#else

				vec2 offset = vec2( dir.y, - dir.x );
				// undo aspect ratio adjustment
				dir.x /= aspect;
				offset.x /= aspect;

				// sign flip
				if ( position.x < 0.0 ) offset *= - 1.0;

				// endcaps
				if ( position.y < 0.0 ) {

					offset += - dir;

				} else if ( position.y > 1.0 ) {

					offset += dir;

				}

				// adjust for linewidth
				offset *= linewidth;

				// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
				offset /= resolution.y;

				// select end
				vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

				// back to clip space
				offset *= clip.w;

				clip.xy += offset;

			#endif

			gl_Position = clip;

			vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

			#include <logdepthbuf_vertex>
			#include <clipping_planes_vertex>
			#include <fog_vertex>

		}
		`,fragmentShader:`
		uniform vec3 diffuse;
		uniform float opacity;
		uniform float linewidth;

		#ifdef USE_DASH

			uniform float dashOffset;
			uniform float dashSize;
			uniform float gapSize;

		#endif

		varying float vLineDistance;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#include <common>
		#include <color_pars_fragment>
		#include <fog_pars_fragment>
		#include <logdepthbuf_pars_fragment>
		#include <clipping_planes_pars_fragment>

		vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

			float mua;
			float mub;

			vec3 p13 = p1 - p3;
			vec3 p43 = p4 - p3;

			vec3 p21 = p2 - p1;

			float d1343 = dot( p13, p43 );
			float d4321 = dot( p43, p21 );
			float d1321 = dot( p13, p21 );
			float d4343 = dot( p43, p43 );
			float d2121 = dot( p21, p21 );

			float denom = d2121 * d4343 - d4321 * d4321;

			float numer = d1343 * d4321 - d1321 * d4343;

			mua = numer / denom;
			mua = clamp( mua, 0.0, 1.0 );
			mub = ( d1343 + d4321 * ( mua ) ) / d4343;
			mub = clamp( mub, 0.0, 1.0 );

			return vec2( mua, mub );

		}

		void main() {

			float alpha = opacity;
			vec4 diffuseColor = vec4( diffuse, alpha );

			#include <clipping_planes_fragment>

			#ifdef USE_DASH

				if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

				if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

			#endif

			#ifdef WORLD_UNITS

				// Find the closest points on the view ray and the line segment
				vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
				vec3 lineDir = worldEnd - worldStart;
				vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

				vec3 p1 = worldStart + lineDir * params.x;
				vec3 p2 = rayEnd * params.y;
				vec3 delta = p1 - p2;
				float len = length( delta );
				float norm = len / linewidth;

				#ifndef USE_DASH

					#ifdef USE_ALPHA_TO_COVERAGE

						float dnorm = fwidth( norm );
						alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

					#else

						if ( norm > 0.5 ) {

							discard;

						}

					#endif

				#endif

			#else

				#ifdef USE_ALPHA_TO_COVERAGE

					// artifacts appear on some hardware if a derivative is taken within a conditional
					float a = vUv.x;
					float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
					float len2 = a * a + b * b;
					float dlen = fwidth( len2 );

					if ( abs( vUv.y ) > 1.0 ) {

						alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

					}

				#else

					if ( abs( vUv.y ) > 1.0 ) {

						float a = vUv.x;
						float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
						float len2 = a * a + b * b;

						if ( len2 > 1.0 ) discard;

					}

				#endif

			#endif

			#include <logdepthbuf_fragment>
			#include <color_fragment>

			gl_FragColor = vec4( diffuseColor.rgb, alpha );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>
			#include <fog_fragment>
			#include <premultiplied_alpha_fragment>

		}
		`};var B=class extends a{constructor(e){super({type:`LineMaterial`,uniforms:h.clone(C.line.uniforms),vertexShader:C.line.vertexShader,fragmentShader:C.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(e)}get color(){return this.uniforms.diffuse.value}set color(e){this.uniforms.diffuse.value=e}get worldUnits(){return`WORLD_UNITS`in this.defines}set worldUnits(e){e===!0!==this.worldUnits&&(this.needsUpdate=!0),e===!0?this.defines.WORLD_UNITS=``:delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(e){this.uniforms.linewidth&&(this.uniforms.linewidth.value=e)}get dashed(){return`USE_DASH`in this.defines}set dashed(e){e===!0!==this.dashed&&(this.needsUpdate=!0),e===!0?this.defines.USE_DASH=``:delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(e){this.uniforms.dashScale.value=e}get dashSize(){return this.uniforms.dashSize.value}set dashSize(e){this.uniforms.dashSize.value=e}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(e){this.uniforms.dashOffset.value=e}get gapSize(){return this.uniforms.gapSize.value}set gapSize(e){this.uniforms.gapSize.value=e}get opacity(){return this.uniforms.opacity.value}set opacity(e){this.uniforms&&(this.uniforms.opacity.value=e)}get resolution(){return this.uniforms.resolution.value}set resolution(e){this.uniforms.resolution.value.copy(e)}get alphaToCoverage(){return`USE_ALPHA_TO_COVERAGE`in this.defines}set alphaToCoverage(e){this.defines&&(e===!0!==this.alphaToCoverage&&(this.needsUpdate=!0),e===!0?this.defines.USE_ALPHA_TO_COVERAGE=``:delete this.defines.USE_ALPHA_TO_COVERAGE)}},V=new r,H=new u,U=new u,W=new r,G=new r,K=new r,q=new u,te=new E,J=new v,ne=new u,Y=new S,X=new l,Z=new r,Q,$;function re(e,t,n){return Z.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),Z.multiplyScalar(1/Z.w),Z.x=$/n.width,Z.y=$/n.height,Z.applyMatrix4(e.projectionMatrixInverse),Z.multiplyScalar(1/Z.w),Math.abs(Math.max(Z.x,Z.y))}function ie(e,t){let n=e.matrixWorld,r=e.geometry,i=r.attributes.instanceStart,a=r.attributes.instanceEnd,o=Math.min(r.instanceCount,i.count);for(let r=0,s=o;r<s;r++){J.start.fromBufferAttribute(i,r),J.end.fromBufferAttribute(a,r),J.applyMatrix4(n);let o=new u,s=new u;Q.distanceSqToSegment(J.start,J.end,s,o),s.distanceTo(o)<$*.5&&t.push({point:s,pointOnLine:o,distance:Q.origin.distanceTo(s),object:e,face:null,faceIndex:r,uv:null,uv1:null})}}function ae(e,t,n){let r=t.projectionMatrix,i=e.material.resolution,a=e.matrixWorld,o=e.geometry,s=o.attributes.instanceStart,c=o.attributes.instanceEnd,l=Math.min(o.instanceCount,s.count),d=-t.near;Q.at(1,K),K.w=1,K.applyMatrix4(t.matrixWorldInverse),K.applyMatrix4(r),K.multiplyScalar(1/K.w),K.x*=i.x/2,K.y*=i.y/2,K.z=0,q.copy(K),te.multiplyMatrices(t.matrixWorldInverse,a);for(let t=0,o=l;t<o;t++){if(W.fromBufferAttribute(s,t),G.fromBufferAttribute(c,t),W.w=1,G.w=1,W.applyMatrix4(te),G.applyMatrix4(te),W.z>d&&G.z>d)continue;if(W.z>d){let e=W.z-G.z,t=(W.z-d)/e;W.lerp(G,t)}else if(G.z>d){let e=G.z-W.z,t=(G.z-d)/e;G.lerp(W,t)}W.applyMatrix4(r),G.applyMatrix4(r),W.multiplyScalar(1/W.w),G.multiplyScalar(1/G.w),W.x*=i.x/2,W.y*=i.y/2,G.x*=i.x/2,G.y*=i.y/2,J.start.copy(W),J.start.z=0,J.end.copy(G),J.end.z=0;let o=J.closestPointToPointParameter(q,!0);J.at(o,ne);let l=D.lerp(W.z,G.z,o),f=l>=-1&&l<=1,p=q.distanceTo(ne)<$*.5;if(f&&p){J.start.fromBufferAttribute(s,t),J.end.fromBufferAttribute(c,t),J.start.applyMatrix4(a),J.end.applyMatrix4(a);let r=new u,i=new u;Q.distanceSqToSegment(J.start,J.end,i,r),n.push({point:i,pointOnLine:r,distance:Q.origin.distanceTo(i),object:e,face:null,faceIndex:t,uv:null,uv1:null})}}}var oe=class extends d{constructor(e=new z,t=new B({color:Math.random()*16777215})){super(e,t),this.isLineSegments2=!0,this.type=`LineSegments2`}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,n=e.attributes.instanceEnd,r=new Float32Array(2*t.count);for(let e=0,i=0,a=t.count;e<a;e++,i+=2)H.fromBufferAttribute(t,e),U.fromBufferAttribute(n,e),r[i]=i===0?0:r[i-1],r[i+1]=r[i]+H.distanceTo(U);let i=new m(r,2,1);return e.setAttribute(`instanceDistanceStart`,new g(i,1,0)),e.setAttribute(`instanceDistanceEnd`,new g(i,1,1)),this}raycast(e,t){let n=this.material.worldUnits,r=e.camera;r===null&&!n&&console.error(`LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.`);let i=e.params.Line2===void 0?0:e.params.Line2.threshold||0;Q=e.ray;let a=this.matrixWorld,o=this.geometry,s=this.material;$=s.linewidth+i,o.boundingSphere===null&&o.computeBoundingSphere(),X.copy(o.boundingSphere).applyMatrix4(a);let c;if(c=n?$*.5:re(r,Math.max(r.near,X.distanceToPoint(Q.origin)),s.resolution),X.radius+=c,Q.intersectsSphere(X)===!1)return;o.boundingBox===null&&o.computeBoundingBox(),Y.copy(o.boundingBox).applyMatrix4(a);let l;l=n?$*.5:re(r,Math.max(r.near,Y.distanceToPoint(Q.origin)),s.resolution),Y.expandByScalar(l),Q.intersectsBox(Y)!==!1&&(n?ie(this,t):ae(this,r,t))}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(V),this.material.uniforms.resolution.value.set(V.z,V.w))}},se=class extends z{constructor(){super(),this.isLineGeometry=!0,this.type=`LineGeometry`}setPositions(e){let t=e.length-3,n=new Float32Array(2*t);for(let r=0;r<t;r+=3)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5];return super.setPositions(n),this}setColors(e){let t=e.length-3,n=new Float32Array(2*t);for(let r=0;r<t;r+=3)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5];return super.setColors(n),this}setFromPoints(e){let t=e.length-1,n=new Float32Array(6*t);for(let r=0;r<t;r++)n[6*r]=e[r].x,n[6*r+1]=e[r].y,n[6*r+2]=e[r].z||0,n[6*r+3]=e[r+1].x,n[6*r+4]=e[r+1].y,n[6*r+5]=e[r+1].z||0;return super.setPositions(n),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}},ce=class extends oe{constructor(e=new se,t=new B({color:Math.random()*16777215})){super(e,t),this.isLine2=!0,this.type=`Line2`}},le=class{constructor(e,t={}){this.canvas=e,this._isReady=!1;let n={sigma:10,rho:28,beta:8/3,dt:.005,controlPointCount:18e3,warmupSteps:2400,filamentCount:30,filamentSpread:.68,ribbonThickness:.12,filamentTwist:.32,wingBalance:.92,wingWidth:1.08,wingHeight:.82,depthScale:.72,dustAmount:0,shapeAudioEnabled:!0,audioResponse:1.4,shapeSmoothness:.84,bassWingSensitivity:.2,bassThicknessSensitivity:.42,midFlowSpeed:2.6,midWaveAmplitude:.34,motionFlexSensitivity:.3,highEdgeSensitivity:.24,highPointSizeSensitivity:.72,kickImpact:.24,kickTravelAmount:.3,downbeatBreathAmount:.12,beatPulseSpeed:1.55,beatThreshold:.46,structureUpdateHz:30,wingBreathAmount:.07,flowMidSensitivity:.9,flowDriftAmount:.075,highNormalSensitivity:.22,disturbanceAmount:.04,beatPulseAmount:.1,lowRhoSensitivity:.55,midSigmaSensitivity:.8,highBetaSensitivity:.6,rhoAudioRange:14,fociPerturbation:!0,beatPulseDisturbance:!0,beatWingBurst:12,saturation:1,colorSpeed:.32,colorSpread:.72,coreGlow:.16,edgeGlow:.18,stereoWeight:.35,lowColorWeight:.55,midColorWeight:.75,highColorWeight:.8,beatSensitivity:1.4,beatDecayRate:.88,beatBloomBurst:.45,motionRotSensitivity:.5,envelopeLightSensitivity:.18,variationDisturbanceSensitivity:.35,brightnessHueSensitivity:24,percussiveBloomSensitivity:.25,downbeatHuePulse:.32,pointSize:.095,particleCount:68e3,lineSamples:520,bloomStrength:.16,bloomRadius:.2,bloomThreshold:.92,particleBrightness:1,lineWidth:.78,rotationAxis:`Y`,customAxisX:0,customAxisY:1,customAxisZ:0,rotationSpeed:1.6,autoRotate:!1};this.settings={...n,...t},t.flowMidSensitivity===void 0&&t.midSigmaSensitivity!==void 0&&(this.settings.flowMidSensitivity=t.midSigmaSensitivity),t.highNormalSensitivity===void 0&&t.highBetaSensitivity!==void 0&&(this.settings.highNormalSensitivity=t.highBetaSensitivity),t.beatPulseAmount===void 0&&t.beatWingBurst!==void 0&&(this.settings.beatPulseAmount=Math.min(.25,Math.max(0,t.beatWingBurst/120))),t.bassWingSensitivity===void 0&&t.wingBreathAmount!==void 0&&(this.settings.bassWingSensitivity=Math.max(0,t.wingBreathAmount*2.8)),t.midWaveAmplitude===void 0&&t.flowDriftAmount!==void 0&&(this.settings.midWaveAmplitude=Math.max(0,t.flowDriftAmount*4.5)),t.highEdgeSensitivity===void 0&&t.highNormalSensitivity!==void 0&&(this.settings.highEdgeSensitivity=Math.max(0,t.highNormalSensitivity)),this.defaultSettings={...this.settings},this.scene=null,this.camera=null,this.renderer=null,this.controls=null,this.composer=null,this.bloomPass=null,this.particleSystem=null,this.geometry=null,this.material=null,this.filaments=[],this.stars=null,this.baseColors=null,this.basePositions=null,this.sculptedBasePositions=null,this.currentPositions=null,this.colors=null,this.POINTS_COUNT=this.getLineVertexCount(),this.smoothState={sigma:this.settings.sigma,rho:this.settings.rho,beta:this.settings.beta,flowScale:1},this.controlPositions=null,this.controlPointCapacity=0,this._rk4Out=new Float64Array(3),this.colorFlowPhase=0,this.centerPositions=null,this.baseOffsets=null,this.tangentVectors=null,this.particlePathT=null,this.particleEdge=null,this.particleWing=null,this.audioDriveSmooth={bass:0,mid:0,high:0,amplitude:0,variation:0,motion:0},this.audioEnergy={bass:0,mid:0,high:0,amplitude:0},this.leftLevel=0,this.rightLevel=0,this.isAudioPlaying=!1,this._time=0,this.beat=null,this.hasAudioData=!1,this.audioFeature=null,this.audioEnvelope=null,this.isBeat=!1,this.beatDecay=0,this.kickStartTime=-10,this._lastKickSignal=0,this.downbeatPulse=0,this.prevDownbeat=!1,this.gui=null,this.guiContainer=null,this.guiVisible=!1,this.time=0,this.lastTime=0,this.tempQuat=new s,this.tempAxis=new u,this.settingsButton=null,this.DEFAULT_CAM_POS={x:0,y:78,z:25},this.DEFAULT_TARGET={x:0,y:0,z:25},this.init().catch(e=>{console.error(`❌ Animation38 初始化失败:`,e)})}hslToRgb(e,t,n){if(e=(e%1+1)%1,t===0)return[n,n,n];let r=(e,t,n)=>(n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*(2/3-n)*6:e),i=n<.5?n*(1+t):n+t-n*t,a=2*n-i;return[r(a,i,e+1/3),r(a,i,e),r(a,i,e-1/3)]}async init(){try{return this.setupThreeJS(),this.createParticleSystem(),this.createStars(),this.setupPostProcessing(),this.setupGUI(),this.setupSettingsButton(),this.resizeHandler=()=>this.onWindowResize(),window.addEventListener(`resize`,this.resizeHandler),this._isReady=!0,console.log(`✅ Animation38 初始化成功`),!0}catch(e){throw console.error(`❌ Animation38 初始化失败:`,e),e}}setupThreeJS(){this.scene=new b,this.camera=new n(45,window.innerWidth/window.innerHeight,.1,200),this.camera.position.set(this.DEFAULT_CAM_POS.x,this.DEFAULT_CAM_POS.y,this.DEFAULT_CAM_POS.z),this.renderer=new x({canvas:this.canvas,antialias:!0,alpha:!0}),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setClearColor(0,0),this.renderer.outputColorSpace=p,this.renderer.toneMapping=4,this.renderer.toneMappingExposure=1.2,this.canvas.style.backgroundColor=`transparent`,this.canvas.style.zIndex=`1`,this.controls=new I(this.camera,this.canvas),this.controls.enableDamping=!0,this.controls.dampingFactor=.06,this.controls.autoRotate=this.settings.autoRotate,this.controls.autoRotateSpeed=this.settings.rotationSpeed,this.controls.target.set(this.DEFAULT_TARGET.x,this.DEFAULT_TARGET.y,this.DEFAULT_TARGET.z),this.controls.update()}createStars(){this.stars&&(this.scene.remove(this.stars),this.stars.geometry.dispose(),this.stars.material.dispose());let e=new w,t=new Float32Array(800*3);for(let e=0;e<800;e++)t[e*3]=(Math.random()-.5)*200,t[e*3+1]=(Math.random()-.5)*200,t[e*3+2]=(Math.random()-.5)*200-20;e.setAttribute(`position`,new _(t,3));let n=new i({color:4482696,size:.15,transparent:!0,opacity:.3,blending:2});this.stars=new f(e,n),this.scene.add(this.stars)}setupPostProcessing(){this.composer=new A(this.renderer);let e=new k(this.scene,this.camera);this.composer.addPass(e),this.bloomPass=new M(new T(window.innerWidth,window.innerHeight),this.settings.bloomStrength,this.settings.bloomRadius,this.settings.bloomThreshold),this.composer.addPass(this.bloomPass),this.composer.addPass(new j)}rk4Step(e,t,n,r,i,a,o,s){let c=r*(t-e),l=e*(i-n)-t,u=e*t-a*n,d=e+c*o*.5,f=t+l*o*.5,p=n+u*o*.5,m=r*(f-d),h=d*(i-p)-f,g=d*f-a*p,_=e+m*o*.5,v=t+h*o*.5,y=n+g*o*.5,b=r*(v-_),x=_*(i-y)-v,S=_*v-a*y,C=e+b*o,w=t+x*o,T=n+S*o,E=r*(w-C),D=C*(i-T)-w,O=C*w-a*T,k=o/6;s[0]=e+k*(c+2*m+2*b+E),s[1]=t+k*(l+2*h+2*x+D),s[2]=n+k*(u+2*g+2*S+O)}ensureControlBuffer(e){return(!this.controlPositions||this.controlPointCapacity!==e)&&(this.controlPositions=new Float32Array(e*3),this.controlPointCapacity=e),this.controlPositions}fillLorenzPositions(e,t,n,r,i,a=1){let o=this.POINTS_COUNT;if(o<=0)return;let s=Math.round(this.settings.controlPointCount||18e3),c=Math.max(1e3,Math.min(o,s)),l=this.ensureControlBuffer(c),u=o>1?(o-1)/Math.max(1,c-1):1,d=Math.min(.018,Math.max(5e-4,i*u*a)),f=.1,p=.1,m=.1,h=this._rk4Out,g=Math.max(0,Math.round(this.settings.warmupSteps||0));for(let e=0;e<g;e++)this.rk4Step(f,p,m,t,n,r,d,h),f=h[0],p=h[1],m=h[2],(!Number.isFinite(f)||!Number.isFinite(p)||!Number.isFinite(m))&&(f=.1,p=.1,m=.1);for(let e=0;e<c;e++){e>0&&(this.rk4Step(f,p,m,t,n,r,d,h),f=h[0],p=h[1],m=h[2],(!Number.isFinite(f)||!Number.isFinite(p)||!Number.isFinite(m))&&(f=l[Math.max(0,e-1)*3]||.1,p=l[Math.max(0,e-1)*3+1]||.1,m=l[Math.max(0,e-1)*3+2]||.1));let i=e*3;l[i]=f,l[i+1]=p,l[i+2]=m}if(o===c){e.set(l);return}let _=c-1,v=Math.max(1,o-1);for(let t=0;t<o;t++){let n=t/v*_,r=Math.min(c-2,Math.floor(n)),i=n-r,a=r*3,o=a+3,s=t*3;e[s]=l[a]+(l[o]-l[a])*i,e[s+1]=l[a+1]+(l[o+1]-l[a+1])*i,e[s+2]=l[a+2]+(l[o+2]-l[a+2])*i}}generateParticles(e,t,n,r){let i=new Float32Array(this.POINTS_COUNT*3),a=new Float32Array(this.POINTS_COUNT*3);this.fillLorenzPositions(i,e,t,n,r,1);for(let e=0;e<this.POINTS_COUNT;e++){let t=e*3,n=i[t],r=i[t+1],o=i[t+2],s=(n*30+r*20+o*10+360)%360,c=.7+Math.sin(n*.5)*.2,l=.4+Math.sin(r*.4)*.2,u=this.hslToRgb(s/360,Math.min(1,c),Math.min(1,l));a[t]=u[0],a[t+1]=u[1],a[t+2]=u[2]}return{positions:i,colors:a}}getLineVertexCount(){return Math.max(24,Math.min(48,Math.round(this.settings.filamentCount||34)))*Math.max(180,Math.min(720,Math.round(this.settings.lineSamples||360)))}rebuildContinuousField(){this.POINTS_COUNT=this.getLineVertexCount(),this.createParticleSystem()}createParticleSystem(){this.particleSystem&&(this.scene.remove(this.particleSystem),this.geometry&&this.geometry.dispose(),this.material&&this.material.dispose(),this.filaments.forEach(({geometry:e,material:t})=>{e.dispose(),t.dispose()}),this.filaments=[]),this.baseColors=new Float32Array(this.POINTS_COUNT*3),this.basePositions=new Float32Array(this.POINTS_COUNT*3),this.sculptedBasePositions=new Float32Array(this.POINTS_COUNT*3),this.currentPositions=new Float32Array(this.POINTS_COUNT*3),this.colors=new Float32Array(this.POINTS_COUNT*3),this.centerPositions=new Float32Array(this.POINTS_COUNT*3),this.baseOffsets=new Float32Array(this.POINTS_COUNT*3),this.tangentVectors=new Float32Array(this.POINTS_COUNT*3),this.particlePathT=new Float32Array(this.POINTS_COUNT),this.particleEdge=new Float32Array(this.POINTS_COUNT),this.particleWing=new Float32Array(this.POINTS_COUNT);let e=this.generateParticles(this.settings.sigma,this.settings.rho,this.settings.beta,this.settings.dt);this.basePositions.set(e.positions),this.buildSculptedBase(),this.currentPositions.set(this.sculptedBasePositions),this.baseColors.set(e.colors),this.geometry=new w,this.geometry.setAttribute(`position`,new _(this.currentPositions,3)),this.geometry.setAttribute(`color`,new _(this.colors,3)),this.particleSystem=new o,this.scene.add(this.particleSystem),this.updateSculptedColors(!1),this.createFilamentLines(),this.smoothState.sigma=this.settings.sigma,this.smoothState.rho=this.settings.rho,this.smoothState.beta=this.settings.beta}resetParticles(){let e=this.generateParticles(this.settings.sigma,this.settings.rho,this.settings.beta,this.settings.dt);this.basePositions.set(e.positions),this.buildSculptedBase(),this.currentPositions.set(this.sculptedBasePositions),this.baseColors.set(e.colors),this.smoothState.sigma=this.settings.sigma,this.smoothState.rho=this.settings.rho,this.smoothState.beta=this.settings.beta,this.smoothState.flowScale=1,this.colorFlowPhase=0;let t=this.geometry.attributes.position,n=this.geometry.attributes.color;t.needsUpdate=!0,this.updateSculptedColors(!1),n.needsUpdate=!0,this.createFilamentLines(),this.particleSystem.rotation.set(0,0,0)}createFilamentLines(){if(!this.particleSystem||!this.currentPositions)return;this.filaments.forEach(({line:e,geometry:t,material:n})=>{this.particleSystem.remove(e),t.dispose(),n.dispose()}),this.filaments=[];let e=Math.max(24,Math.min(48,Math.round(this.settings.filamentCount||34))),t=Math.max(2,Math.ceil(this.POINTS_COUNT/e));for(let n=0;n<e;n++){let e=new Float32Array(t*3),r=new Float32Array(t*3),i=new se,a=new B({vertexColors:!0,transparent:!0,opacity:Math.min(.72,.52*this.settings.particleBrightness),linewidth:this.settings.lineWidth,depthWrite:!1,blending:1});a.resolution.set(window.innerWidth,window.innerHeight);let o=new ce(i,a);o.frustumCulled=!1,this.particleSystem.add(o),this.filaments.push({strand:n,samples:t,positions:e,colors:r,geometry:i,material:a,line:o})}this.syncFilamentLines()}syncFilamentLines(){if(!this.currentPositions||!this.colors)return;let e=this.filaments.length;this.filaments.forEach(t=>{for(let n=0;n<t.samples;n++){let r=Math.min(this.POINTS_COUNT-1,n*e+t.strand)*3,i=n*3;t.positions[i]=this.currentPositions[r],t.positions[i+1]=this.currentPositions[r+1],t.positions[i+2]=this.currentPositions[r+2],t.colors[i]=this.colors[r],t.colors[i+1]=this.colors[r+1],t.colors[i+2]=this.colors[r+2]}t.geometry.setPositions(t.positions),t.geometry.setColors(t.colors)})}getRotationAxis(){let e=new u;switch(this.settings.rotationAxis){case`X`:e.set(1,0,0);break;case`Y`:e.set(0,1,0);break;case`Z`:e.set(0,0,1);break;case`Custom`:e.set(this.settings.customAxisX,this.settings.customAxisY,this.settings.customAxisZ),e.length()<.001&&e.set(0,1,0),e.normalize();break;default:e.set(0,1,0)}return e}hash01(e){let t=Math.sin(e*12.9898+78.233)*43758.5453123;return t-Math.floor(t)}smoothstep(e,t,n){let r=Math.max(0,Math.min(1,(n-e)/Math.max(1e-6,t-e)));return r*r*(3-2*r)}buildContinuousLorenzCenter(e){let t=new Float32Array(e*3),n=this._rk4Out,r=Math.min(.014,Math.max(.006,this.settings.dt*2.45)),i=.1,a=.1,o=.1,s=Math.max(0,Math.round(this.settings.warmupSteps||0));for(let e=0;e<s;e++)this.rk4Step(i,a,o,this.settings.sigma,this.settings.rho,this.settings.beta,r,n),i=n[0],a=n[1],o=n[2];for(let s=0;s<e;s++){this.rk4Step(i,a,o,this.settings.sigma,this.settings.rho,this.settings.beta,r,n),i=n[0],a=n[1],o=n[2];let e=s*3;t[e]=i,t[e+1]=a,t[e+2]=o}return t}buildSculptedBase(){if(!this.basePositions||!this.sculptedBasePositions)return;this.basePositions;let e=this.sculptedBasePositions,t=this.POINTS_COUNT,n=Math.max(4,Math.min(96,Math.round(this.settings.filamentCount||34))),r=Math.max(2,Math.ceil(t/n)),i=this.buildContinuousLorenzCenter(r),a=Math.max(0,this.settings.filamentSpread||0),o=Math.max(0,this.settings.ribbonThickness||0),s=Math.max(0,this.settings.filamentTwist||0),c=Math.max(0,Math.min(1,this.settings.wingBalance??.92)),l=Math.max(.2,this.settings.wingWidth||1),u=Math.max(.2,this.settings.wingHeight||1),d=Math.max(.1,this.settings.depthScale||1),f=Math.max(0,this.settings.dustAmount||0),p=1,m=1;for(let e=0;e<r;e++){let t=i[e*3];t<0?p=Math.max(p,-t):m=Math.max(m,t)}let h=(p+m)*.5,g=1+(h/p-1)*c,_=1+(h/m-1)*c,v=(e,t)=>{e=Math.max(0,Math.min(r-1,e));let n=e*3,a=i[n],o=i[n+1],s=i[n+2];a*=(a<0?g:_)*l,o*=d,s=25+(s-25)*u,t[0]=a,t[1]=o,t[2]=s},y=[0,0,0],b=[0,0,0],x=[0,0,0];for(let i=0;i<t;i++){let t=i%n,c=Math.floor(i/n),l=c/Math.max(1,r-1),u=n<=1?0:t/(n-1),d=u*2-1,p=c;v(p,y),v(p-2,b),v(p+2,x);let m=x[0]-b[0],h=x[1]-b[1],g=x[2]-b[2],_=Math.hypot(m,h,g)||1;m/=_,h/=_,g/=_;let S=-g,C=m,w=Math.hypot(S,C);w<1e-5&&(S=1,C=0,w=1),S/=w,C/=w;let T=h*C-g*0,E=g*S-m*C,D=m*0-h*S,O=Math.hypot(T,E,D)||1,k=y[0],A=y[1],j=y[2],M=this.smoothstep(1.8,13,Math.abs(k)),N=1-this.smoothstep(1.2,7,Math.hypot(k,j-25)),P=Math.sign(d)*Math.abs(d)**.82,F=a*(.16+.84*M)*P,ee=l*Math.PI*2*s+u*Math.PI*1.35,I=o*Math.sin(ee)*(.25+.75*M),L=this.hash01(i*1.713+13.7),R=this.hash01(i*4.191+81.2),z=L>.978?f*(.4+R*1.3)*M:0,B=this.hash01(i*7.11+2.4)>.5?1:-1,V=S*(F+z*B)+T/O*I,H=0*(F+z*B)+E/O*I,U=C*(F+z*B)+D/O*I,W=i*3;this.centerPositions[W]=k,this.centerPositions[W+1]=A,this.centerPositions[W+2]=j,this.baseOffsets[W]=V,this.baseOffsets[W+1]=H,this.baseOffsets[W+2]=U,this.tangentVectors[W]=m,this.tangentVectors[W+1]=h,this.tangentVectors[W+2]=g,this.particlePathT[i]=l,this.particleEdge[i]=Math.min(1,Math.abs(d)*(.45+.55*M)),this.particleWing[i]=k<0?-1:1;let G=1-N*.38;e[W]=k+V*G,e[W+1]=A+H*G,e[W+2]=j+U*G}}samplePalette(e,t){e=Math.max(0,Math.min(1,e));let n=[[.1,.035,.22],[.48,.075,.44],[.95,.24,.48],[.5,.18,.72],[.12,.48,.86]],r=e*(n.length-1),i=Math.min(n.length-2,Math.floor(r)),a=r-i,o=n[i],s=n[i+1];t[0]=o[0]+(s[0]-o[0])*a,t[1]=o[1]+(s[1]-o[1])*a,t[2]=o[2]+(s[2]-o[2])*a}updateSculptedColors(e){if(!this.geometry?.attributes?.color||!this.centerPositions)return;let t=this.geometry.attributes.color,n=t.array,r=this.POINTS_COUNT,i=this.audioDriveSmooth,a=e?Math.max(0,this.settings.audioResponse??1.4):1,o=this.audioFeature||null,s=o&&o.brightness||0,c=this.audioEnvelope?this.audioEnvelope.value:i.amplitude,l=e?.06+i.mid*.32:.025;this.colorFlowPhase=(this.colorFlowPhase+l*Math.max(.05,this.settings.colorSpeed)*.006)%1;let u=[0,0,0],d=this.isBeat?this.beatDecay:0,f=Math.max(0,Math.min(1.4,this.settings.colorSpread||.72)),p=Math.max(0,this.settings.saturation||0);for(let t=0;t<r;t++){let r=t*3,o=this.centerPositions[r],l=this.centerPositions[r+2],m=this.particlePathT[t],h=this.particleEdge[t],g=.5+Math.max(-1,Math.min(1,o/20))*.2*f;g+=Math.sin(m*Math.PI*2+this.colorFlowPhase*Math.PI*2)*.055*f,g+=i.bass*.1*a,g+=s*(this.settings.brightnessHueSensitivity/360)*.2,g+=this.downbeatPulse*this.settings.downbeatHuePulse*.025,g=Math.max(.02,Math.min(.98,g)),this.samplePalette(g,u);let _=Math.hypot(o*.75,(l-25)*.72),v=Math.exp(-(_*_)/58),y=Math.min(1.2,(this.time-this.kickStartTime)*Math.max(.1,this.settings.beatPulseSpeed)*.42),b=Math.abs(m-y),x=d*Math.exp(-(b*b)/.006),S=.42+v*this.settings.coreGlow+h*this.settings.edgeGlow;e&&(S+=c*this.settings.envelopeLightSensitivity*a,S+=i.bass*this.settings.lowColorWeight*.085*a,S+=i.mid*this.settings.midColorWeight*.07*a,S+=i.high*this.settings.highColorWeight*h*.11*a,S+=x*.18*a),S=Math.max(.15,S);let C=u[0]*.2126+u[1]*.7152+u[2]*.0722,w=C+(u[0]-C)*p,T=C+(u[1]-C)*p,E=C+(u[2]-C)*p,D=i.high*h*.42*a;w+=D*.32+x*.42,T+=D*.72+x*.31,E+=D*.82+x*.27;let O=1+(this.particleWing[t]<0?i.bass:i.high)*this.settings.stereoWeight*.06;n[r]=Math.min(1,Math.max(0,w*S*O)),n[r+1]=Math.min(1,Math.max(0,T*S*O)),n[r+2]=Math.min(1,Math.max(0,E*S*O))}t.needsUpdate=!0,this.syncFilamentLines()}updateParticles(){if(!this.sculptedBasePositions||!this.centerPositions||!this.geometry)return;let e=this.geometry.attributes.position,t=e.array,n=this.POINTS_COUNT,r=this.audioFeature||null,i=r&&r.variation||0,a=r?r.motion||0:this.audioEnergy.amplitude,o=(e,t=.82)=>Math.max(0,Math.min(1,e||0))**+t,s={bass:o(this.audioEnergy.bass,.78),mid:o(this.audioEnergy.mid,.82),high:o(this.audioEnergy.high,.88),amplitude:o(this.audioEnergy.amplitude,.82),variation:o(i,.9),motion:o(a,.84)},c=Math.max(1,this.settings.structureUpdateHz||30),l=1-Math.max(.5,Math.min(.995,this.settings.shapeSmoothness))**(60/c);for(let e of Object.keys(this.audioDriveSmooth))this.audioDriveSmooth[e]+=(s[e]-this.audioDriveSmooth[e])*l;let u=this.audioDriveSmooth,d=this.settings.shapeAudioEnabled?Math.max(0,this.settings.audioResponse??1.4):0,f=u.bass*this.settings.bassWingSensitivity*d,p=u.bass*this.settings.bassThicknessSensitivity*d,m=u.mid*this.settings.midWaveAmplitude*d,h=1+u.mid*this.settings.midFlowSpeed*d+u.motion*1.25,g=u.motion*this.settings.motionFlexSensitivity*d,_=u.high*this.settings.highEdgeSensitivity*d,v=this.beatDecay*this.settings.kickImpact*d,y=this.downbeatPulse*this.settings.downbeatBreathAmount*d,b=this.beatDecay*this.settings.kickTravelAmount*d,x=this.time;for(let e=0;e<n;e++){let n=e*3,r=this.centerPositions[n],i=this.centerPositions[n+1],a=this.centerPositions[n+2],o=this.baseOffsets[n],s=this.baseOffsets[n+1],c=this.baseOffsets[n+2],l=this.tangentVectors[n],S=this.tangentVectors[n+1],C=this.tangentVectors[n+2],w=this.particleEdge[e],T=this.particlePathT[e],E=this.particleWing[e]||(r<0?-1:1),D=this.smoothstep(2,13,Math.abs(r)),O=1-this.smoothstep(2,8.5,Math.hypot(r,a-25)),k=f*(.3+.7*D)+y*(.5+.5*D)+v*.3*(.25+.75*D),A=r*(1+k),j=i*(1+k*.1),M=25+(a-25)*(1+k*.3),N=Math.min(1.2,(x-this.kickStartTime)*Math.max(.1,this.settings.beatPulseSpeed)*.48),P=Math.abs(T-N),F=b*Math.exp(-(P*P)/.0045)*(.18+.82*D);A*=1+F,M=25+(M-25)*(1+F*.65);let ee=T*Math.PI*10-x*h*2.15+E*.55,I=Math.sin(ee),L=Math.sin(T*Math.PI*4-x*(.75+u.motion*2.2)+E*.9),R=1+p*(.2+w*.8)+I*m*(.2+.8*D)+F*.55;A+=o*R+l*m*.34*I,j+=s*R+S*m*.28*I,M+=c*R+C*m*.34*I;let z=g*L*(.12+.88*D);A+=E*z*(1+Math.abs(a-25)*.012),M+=z*(.45+O*.25);let B=Math.sin(T*Math.PI*30+e*.017+x*(3.2+u.high*5)),V=Math.hypot(o,s,c)||1,H=(_+u.variation*.05*d)*w*B*(.35+.65*D);A+=o/V*H,j+=s/V*H*.55,M+=c/V*H,t[n]=Number.isFinite(A)?A:this.sculptedBasePositions[n],t[n+1]=Number.isFinite(j)?j:this.sculptedBasePositions[n+1],t[n+2]=Number.isFinite(M)?M:this.sculptedBasePositions[n+2]}e.needsUpdate=!0,this.updateSculptedColors(!0)}updateColorsNoAudio(){if(!this.sculptedBasePositions||!this.geometry)return;let e=this.geometry.attributes.position,t=e.array,n=this.sculptedBasePositions,r=!1;for(let e=0;e<t.length;e++){let i=n[e]-t[e];Math.abs(i)>2e-5&&(t[e]+=i*.1,r=!0)}for(let e of Object.keys(this.audioDriveSmooth))this.audioDriveSmooth[e]*=.9;r&&(e.needsUpdate=!0),this.updateSculptedColors(!1),this.syncFilamentLines()}resetRuntimeState(){this.audioEnergy={bass:0,mid:0,high:0,amplitude:0},this.leftLevel=0,this.rightLevel=0,this.isAudioPlaying=!1,this._time=0,this.beat=null,this.hasAudioData=!1,this.audioFeature=null,this.audioEnvelope=null,this.isBeat=!1,this.beatDecay=0,this.kickStartTime=-10,this._lastKickSignal=0,this.downbeatPulse=0,this.prevDownbeat=!1,this.time=0,this.lastTime=0,this.colorFlowPhase=0,this.smoothState&&(this.smoothState.flowScale=1),this.audioDriveSmooth&&(this.audioDriveSmooth.bass=0,this.audioDriveSmooth.mid=0,this.audioDriveSmooth.high=0,this.audioDriveSmooth.amplitude=0,this.audioDriveSmooth.variation=0,this.audioDriveSmooth.motion=0)}refreshGUIDisplay(){if(!this.gui)return;let e=t=>{t.controllers.forEach(e=>e.updateDisplay()),Object.values(t.folders||{}).forEach(e)};e(this.gui)}setupGUI(){this.createGUIContainer();let t=()=>this.rebuildContinuousField(),n={resetAll:()=>{let e=this.POINTS_COUNT;Object.assign(this.settings,this.defaultSettings),this.POINTS_COUNT=this.getLineVertexCount(),this.resetRuntimeState(),this.bloomPass&&(this.bloomPass.strength=this.settings.bloomStrength,this.bloomPass.radius=this.settings.bloomRadius,this.bloomPass.threshold=this.settings.bloomThreshold),this.material&&(this.material.size=this.settings.pointSize,this.material.opacity=Math.min(1,.92*this.settings.particleBrightness)),this.filaments.forEach(({material:e})=>{e.linewidth=this.settings.lineWidth,e.opacity=Math.min(.72,.52*this.settings.particleBrightness)}),this.controls&&(this.controls.autoRotate=this.settings.autoRotate,this.controls.autoRotateSpeed=this.settings.rotationSpeed,this.camera.position.set(this.DEFAULT_CAM_POS.x,this.DEFAULT_CAM_POS.y,this.DEFAULT_CAM_POS.z),this.controls.target.set(this.DEFAULT_TARGET.x,this.DEFAULT_TARGET.y,this.DEFAULT_TARGET.z),this.controls.update()),e===this.POINTS_COUNT?this.resetParticles():this.createParticleSystem(),this.particleSystem&&this.particleSystem.rotation.set(0,0,0),this.stars&&this.stars.rotation.set(0,0,0),this.refreshGUIDisplay(),this.syncCustomAxisFolder()}};this.gui=new e({container:this.guiContainer,title:`混沌蝶影 V2.3`});let r=this.gui.addFolder(`Lorenz 骨架`);r.add(this.settings,`sigma`,5,20,.1).name(`σ`).onFinishChange(t),r.add(this.settings,`rho`,15,50,.1).name(`ρ`).onFinishChange(t),r.add(this.settings,`beta`,1.5,5,.01).name(`β`).onFinishChange(t),r.add(this.settings,`dt`,.001,.012,5e-4).name(`积分步长`).onFinishChange(t),r.add(this.settings,`controlPointCount`,4e3,3e4,1e3).name(`RK4 控制点`).onFinishChange(t),r.add(this.settings,`warmupSteps`,0,6e3,100).name(`瞬态丢弃步数`).onFinishChange(t),r.open();let i=this.gui.addFolder(`🦋 蝶翼雕塑`);i.add(this.settings,`filamentCount`,24,48,1).name(`丝束数量`).onFinishChange(t),i.add(this.settings,`filamentSpread`,0,2.5,.02).name(`翼面丝束展开`).onFinishChange(t),i.add(this.settings,`ribbonThickness`,0,1.2,.01).name(`空间厚度`).onFinishChange(t),i.add(this.settings,`filamentTwist`,0,2,.02).name(`丝束扭转`).onFinishChange(t),i.add(this.settings,`wingBalance`,0,1,.01).name(`左右翼平衡`).onFinishChange(t),i.add(this.settings,`wingWidth`,.6,1.7,.01).name(`翼展`).onFinishChange(t),i.add(this.settings,`wingHeight`,.5,1.3,.01).name(`翼高`).onFinishChange(t),i.add(this.settings,`depthScale`,.3,1.3,.01).name(`纵深压缩`).onFinishChange(t),i.add(this.settings,`dustAmount`,0,.8,.01).name(`蝶影粉尘`).onFinishChange(t),i.open();let a=this.gui.addFolder(`🎵 音频驱动 · V2.3`);a.add(this.settings,`shapeAudioEnabled`).name(`启用音频形变`),a.add(this.settings,`audioResponse`,0,4,.05).name(`音频总响应`),a.add(this.settings,`shapeSmoothness`,.5,.98,.01).name(`音频平滑`),a.add(this.settings,`bassWingSensitivity`,0,.45,.005).name(`低频→翼展`),a.add(this.settings,`bassThicknessSensitivity`,0,1,.01).name(`低频→丝束厚度`),a.add(this.settings,`midFlowSpeed`,0,6,.05).name(`中频→流动速度`),a.add(this.settings,`midWaveAmplitude`,0,.8,.01).name(`中频→行波幅度`),a.add(this.settings,`motionFlexSensitivity`,0,.8,.01).name(`Motion→柔性摆动`),a.add(this.settings,`highEdgeSensitivity`,0,.65,.01).name(`高频→翼缘羽化`),a.add(this.settings,`highPointSizeSensitivity`,0,1.5,.02).name(`高频→粒子尺寸`),a.add(this.settings,`kickImpact`,0,.65,.01).name(`Kick→整体冲击`),a.add(this.settings,`kickTravelAmount`,0,.8,.01).name(`Kick→传播幅度`),a.add(this.settings,`beatPulseSpeed`,.2,4,.05).name(`Kick→传播速度`),a.add(this.settings,`beatThreshold`,.1,1,.01).name(`Kick触发阈值`),a.add(this.settings,`downbeatBreathAmount`,0,.35,.005).name(`Downbeat→大呼吸`),a.add(this.settings,`structureUpdateHz`,10,45,1).name(`形变刷新 Hz`),a.add(this.settings,`motionRotSensitivity`,0,2,.05).name(`Motion→旋转`),a.open();let o=this.gui.addFolder(`🎨 色彩与光`);o.add(this.settings,`colorSpeed`,.05,2,.01).name(`色流速度`),o.add(this.settings,`colorSpread`,0,1.4,.02).name(`冷暖空间跨度`),o.add(this.settings,`saturation`,0,1.8,.02).name(`饱和度`),o.add(this.settings,`coreGlow`,0,1.5,.02).name(`中心汇聚亮度`),o.add(this.settings,`edgeGlow`,0,.8,.01).name(`翼缘亮度`),o.add(this.settings,`stereoWeight`,0,1,.02).name(`左右翼音频亮差`),o.add(this.settings,`lowColorWeight`,0,2,.05).name(`低频亮度权重`),o.add(this.settings,`midColorWeight`,0,2,.05).name(`中频亮度权重`),o.add(this.settings,`highColorWeight`,0,2,.05).name(`高频翼缘权重`),o.add(this.settings,`envelopeLightSensitivity`,0,.5,.01).name(`包络→亮度`),o.add(this.settings,`brightnessHueSensitivity`,0,90,1).name(`亮度特征→色相`),o.add(this.settings,`downbeatHuePulse`,0,1,.02).name(`强拍色相脉冲`),o.add(this.settings,`beatDecayRate`,.7,.99,.01).name(`节拍衰减`),o.add(this.settings,`beatBloomBurst`,0,1.2,.02).name(`节拍 Bloom`),o.add(this.settings,`percussiveBloomSensitivity`,0,1,.02).name(`打击→Bloom`),o.open();let s=this.gui.addFolder(`视觉效果`);s.add(this.settings,`filamentCount`,24,48,1).name(`光丝数量`).onFinishChange(t),s.add(this.settings,`lineSamples`,180,720,10).name(`每丝采样`).onFinishChange(t),s.add(this.settings,`lineWidth`,.35,4,.05).name(`光丝线宽`).onChange(e=>{this.filaments.forEach(({material:t})=>{t.linewidth=e})}),s.add(this.settings,`particleBrightness`,.1,2,.05).name(`粒子亮度`).onChange(e=>{this.filaments.forEach(({material:t})=>{t.opacity=Math.min(.72,.52*e)})}),s.add(this.settings,`bloomStrength`,0,2,.02).name(`Bloom 强度`).onChange(e=>{this.bloomPass&&(this.bloomPass.strength=e)}),s.add(this.settings,`bloomRadius`,0,1.5,.02).name(`Bloom 半径`).onChange(e=>{this.bloomPass&&(this.bloomPass.radius=e)}),s.add(this.settings,`bloomThreshold`,0,1,.01).name(`Bloom 阈值`).onChange(e=>{this.bloomPass&&(this.bloomPass.threshold=e)}),s.open();let c=this.gui.addFolder(`🔄 旋转控制`);c.add(this.settings,`rotationAxis`,[`X`,`Y`,`Z`,`Custom`]).name(`旋转轴`).onChange(()=>this.syncCustomAxisFolder()),c.add(this.settings,`rotationSpeed`,.2,5,.1).name(`旋转速度`).onChange(e=>{this.controls&&(this.controls.autoRotateSpeed=e)}),c.add(this.settings,`autoRotate`).name(`自动旋转`).onChange(e=>{this.controls&&(this.controls.autoRotate=e)}),this.customAxisFolder=this.gui.addFolder(`自定义轴参数`),this.customAxisFolder.add(this.settings,`customAxisX`,-1,1,.01).name(`X 分量`),this.customAxisFolder.add(this.settings,`customAxisY`,-1,1,.01).name(`Y 分量`),this.customAxisFolder.add(this.settings,`customAxisZ`,-1,1,.01).name(`Z 分量`),this.syncCustomAxisFolder(),this.gui.add(n,`resetAll`).name(`🔄 重置参数`),this.gui.hide()}syncCustomAxisFolder(){this.customAxisFolder&&(this.customAxisFolder.domElement.style.display=this.settings.rotationAxis===`Custom`?`block`:`none`)}createGUIContainer(){this.guiContainer=F(`Animation38-gui-container`),ee(`Animation38-gui-container`),document.body.appendChild(this.guiContainer)}setupSettingsButton(){this.settingsButton=N(`Animation38-settings-button`),this.settingsButton.addEventListener(`click`,()=>{this.guiVisible=!this.guiVisible,this.guiVisible?this.gui.show():this.gui.hide()}),document.body.appendChild(this.settingsButton)}updateAxisDisplay(){}onWindowResize(){let e=window.innerWidth,t=window.innerHeight;this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t),this.composer&&this.composer.setSize(e,t),this.filaments.forEach(({material:n})=>n.resolution.set(e,t))}updateWithAudioData(e,t){if(t!==void 0&&(this._time=t),!e){this.isAudioPlaying=!1,this.hasAudioData=!1,this.audioFeature=null,this.beat=null;return}if(e.audioFeature&&e.audioFeature.animation){let t=e.audioFeature.animation;this.hasAudioData=!0,this.audioFeature=t,this.audioEnvelope=e.audioFeature.envelope||null,this.audioEnergy.bass=t.bass||0,this.audioEnergy.mid=t.mid||0,this.audioEnergy.high=t.high||0,this.audioEnergy.amplitude=t.energy||(this.audioEnergy.bass+this.audioEnergy.mid+this.audioEnergy.high)/3,this.isAudioPlaying=e.isPlaying===!0||this.audioEnergy.amplitude>.006,this.beat=t,this.leftLevel=this.audioEnergy.bass,this.rightLevel=this.audioEnergy.high,t.isDownbeat&&!this.prevDownbeat&&(this.downbeatPulse=1),this.prevDownbeat=!!t.isDownbeat;return}if(e.energy){this.hasAudioData=!0,this.audioFeature=null,this.audioEnvelope=null,this.audioEnergy.bass=e.energy.low||0,this.audioEnergy.mid=e.energy.mid||0,this.audioEnergy.high=e.energy.high||0,this.audioEnergy.amplitude=(this.audioEnergy.bass+this.audioEnergy.mid+this.audioEnergy.high)/3,this.isAudioPlaying=e.isPlaying===!0||this.audioEnergy.amplitude>.01,this.beat=e.beat||null,this.leftLevel=this.audioEnergy.bass,this.rightLevel=this.audioEnergy.high,this.prevDownbeat=!1;return}this.isAudioPlaying=!1,this.hasAudioData=!1,this.audioFeature=null,this.beat=null}render(){if(!this._isReady)return;let e=this._time?this._time*.001:performance.now()*.001,t=Math.min(.033,e-this.lastTime||.016);this.lastTime=e,this.time+=t,this.downbeatPulse*=.9**(t*60),this.downbeatPulse<.001&&(this.downbeatPulse=0);let n=this.beat?.kick||0,r=Math.max(.05,this.settings.beatThreshold??.46);if(n>r&&(this.isBeat=!0,this.beatDecay=Math.max(this.beatDecay,1),this._lastKickSignal<=r&&(this.kickStartTime=this.time)),this._lastKickSignal=n,this.isBeat&&this.beatDecay>.01?this.beatDecay*=this.settings.beatDecayRate**(t*60):(this.isBeat=!1,this.beatDecay=0),this.isAudioPlaying){let e=Math.max(1,this.settings.structureUpdateHz||12);this.time-(this._lastStructureUpdate||0)>=1/e&&(this._lastStructureUpdate=this.time,this.updateParticles());let t=Math.max(0,this.settings.audioResponse??1.4),n=this.isBeat?this.beatDecay*this.settings.beatBloomBurst*t:0,r=this.audioFeature&&this.audioFeature.percussive||0;this.bloomPass.strength=Math.min(.52,this.settings.bloomStrength+n*.16+this.audioEnergy.high*.05*t+r*this.settings.percussiveBloomSensitivity*.1*t);let i=this.audioEnergy.high*this.settings.highPointSizeSensitivity*t;if(this.filaments.forEach(({material:e})=>{e.opacity=Math.min(.76,.46*this.settings.particleBrightness+i*.1)}),this.controls.autoRotate){let e=this.audioFeature?this.audioFeature.motion||0:this.audioEnergy.amplitude;this.controls.autoRotateSpeed=this.settings.rotationSpeed+e*this.settings.motionRotSensitivity}this.stars&&(this.stars.rotation.y+=1e-4)}else this.updateColorsNoAudio(),this.stars&&(this.stars.rotation.y+=2e-4),this.bloomPass.strength=this.settings.bloomStrength,this.filaments.forEach(({material:e})=>{e.opacity=Math.min(.72,.52*this.settings.particleBrightness)});if(this.controls.autoRotate){let e=this.controls.autoRotateSpeed*.005,t=this.getRotationAxis();this.tempAxis.copy(t),this.tempQuat.setFromAxisAngle(this.tempAxis,e),this.particleSystem&&this.particleSystem.quaternion.multiply(this.tempQuat),this.stars&&this.stars.quaternion.copy(this.particleSystem.quaternion)}this.controls.update(),this.composer.render()}startAnimationLoop(){}setEffectMode(e){return console.log(`当前效果模式：${e}`),!0}updateSettings(e){let t=this.POINTS_COUNT,n=[`sigma`,`rho`,`beta`,`dt`,`controlPointCount`,`warmupSteps`,`filamentCount`,`filamentSpread`,`ribbonThickness`,`filamentTwist`,`wingBalance`,`wingWidth`,`wingHeight`,`depthScale`,`dustAmount`].some(t=>e[t]!==void 0&&e[t]!==this.settings[t]);if(Object.assign(this.settings,e),e.flowMidSensitivity===void 0&&e.midSigmaSensitivity!==void 0&&(this.settings.flowMidSensitivity=e.midSigmaSensitivity),e.highNormalSensitivity===void 0&&e.highBetaSensitivity!==void 0&&(this.settings.highNormalSensitivity=e.highBetaSensitivity),e.beatPulseAmount===void 0&&e.beatWingBurst!==void 0&&(this.settings.beatPulseAmount=Math.min(.25,Math.max(0,e.beatWingBurst/120))),e.bloomStrength!==void 0&&this.bloomPass&&(this.bloomPass.strength=this.settings.bloomStrength),e.bloomRadius!==void 0&&this.bloomPass&&(this.bloomPass.radius=this.settings.bloomRadius),e.bloomThreshold!==void 0&&this.bloomPass&&(this.bloomPass.threshold=this.settings.bloomThreshold),e.lineWidth!==void 0&&this.filaments.forEach(({material:e})=>{e.linewidth=this.settings.lineWidth}),e.particleBrightness!==void 0&&this.filaments.forEach(({material:e})=>{e.opacity=Math.min(.72,.52*this.settings.particleBrightness)}),e.autoRotate!==void 0&&this.controls&&(this.controls.autoRotate=this.settings.autoRotate),e.rotationSpeed!==void 0&&this.controls&&(this.controls.autoRotateSpeed=this.settings.rotationSpeed),e.filamentCount!==void 0||e.lineSamples!==void 0)this.rebuildContinuousField();else if(e.particleCount!==void 0){let e=Math.max(1e4,Math.round(this.settings.particleCount));this.settings.particleCount=e,e===t?n&&this.resetParticles():(this.POINTS_COUNT=e,this.createParticleSystem())}else n&&this.resetParticles();this.refreshGUIDisplay(),this.syncCustomAxisFolder()}dispose(){this.resizeHandler&&=(window.removeEventListener(`resize`,this.resizeHandler),null),this.particleSystem&&this.scene.remove(this.particleSystem),this.stars&&this.scene.remove(this.stars),this.geometry&&this.geometry.dispose(),this.material&&this.material.dispose(),this.filaments.forEach(({geometry:e,material:t})=>{e.dispose(),t.dispose()}),this.stars&&(this.stars.geometry.dispose(),this.stars.material.dispose()),P(this.settingsButton,this.guiContainer,this.gui),this.composer&&this.composer.dispose(),this.bloomPass?.dispose&&this.bloomPass.dispose(),this.controls&&this.controls.dispose(),this.renderer&&this.renderer.dispose(),this.controlPositions=null,this.controlPointCapacity=0}};export{le as default};