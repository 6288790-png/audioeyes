import{Ft as e,Jn as t,hr as n,kr as r,q as i}from"./three.module-CgISyWQV.js";import{a}from"./OutputPass-D9GSoAm2.js";import{n as o,t as s}from"./Pass-CuYXgMSk.js";var c={name:`AfterimageShader`,uniforms:{damp:{value:.96},tOld:{value:null},tNew:{value:null}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float damp;

		uniform sampler2D tOld;
		uniform sampler2D tNew;

		varying vec2 vUv;

		vec4 when_gt( vec4 x, float y ) {

			return max( sign( x - y ), 0.0 );

		}

		void main() {

			vec4 texelOld = texture2D( tOld, vUv );
			vec4 texelNew = texture2D( tNew, vUv );

			texelOld *= damp * when_gt( texelOld, 0.1 );

			gl_FragColor = max(texelNew, texelOld);

		}`},l=class extends o{constructor(o=.96){super(),this.uniforms=n.clone(c.uniforms),this.damp=o,this.compFsMaterial=new t({uniforms:this.uniforms,vertexShader:c.vertexShader,fragmentShader:c.fragmentShader}),this.copyFsMaterial=new t({uniforms:n.clone(a.uniforms),vertexShader:a.vertexShader,fragmentShader:a.fragmentShader,blending:0,depthTest:!1,depthWrite:!1}),this._textureComp=new r(window.innerWidth,window.innerHeight,{magFilter:e,type:i}),this._textureOld=new r(window.innerWidth,window.innerHeight,{magFilter:e,type:i}),this._compFsQuad=new s(this.compFsMaterial),this._copyFsQuad=new s(this.copyFsMaterial)}get damp(){return this.uniforms.damp.value}set damp(e){this.uniforms.damp.value=e}render(e,t,n){this.uniforms.tOld.value=this._textureOld.texture,this.uniforms.tNew.value=n.texture,e.setRenderTarget(this._textureComp),this._compFsQuad.render(e),this._copyFsQuad.material.uniforms.tDiffuse.value=this._textureComp.texture,this.renderToScreen?(e.setRenderTarget(null),this._copyFsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(),this._copyFsQuad.render(e));let r=this._textureOld;this._textureOld=this._textureComp,this._textureComp=r}setSize(e,t){this._textureComp.setSize(e,t),this._textureOld.setSize(e,t)}dispose(){this._textureComp.dispose(),this._textureOld.dispose(),this.compFsMaterial.dispose(),this.copyFsMaterial.dispose(),this._compFsQuad.dispose(),this._copyFsQuad.dispose()}};export{l as t};