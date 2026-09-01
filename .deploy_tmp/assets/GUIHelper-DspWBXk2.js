var e=`
    position: fixed;
    top: 12px;
    right: 12px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(0,0,0,0.7);
    color: white;
    border: none;
    cursor: pointer;
    z-index: 1000;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
`;function t(e=`calc(100vh - 70px)`){return`
        position: fixed;
        top: 55px;
        right: 12px;
        z-index: 999;
        max-height: ${e};
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: thin;
        scrollbar-color: rgba(255,255,255,0.2) transparent;
    `}function n(t){let n=document.createElement(`button`);return n.id=t,n.innerHTML=`⚙️`,n.style.cssText=e,n}function r(e,n=`calc(100vh - 70px)`){let r=document.createElement(`div`);return r.id=e,r.style.cssText=t(n),s(),r}function i(e){let t=document.createElement(`style`);return t.textContent=`
        #${e}::-webkit-scrollbar {
            width: 4px;
        }
        #${e}::-webkit-scrollbar-track {
            background: transparent;
        }
        #${e}::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,0.2);
            border-radius: 2px;
        }
        #${e}::-webkit-scrollbar-thumb:hover {
            background: rgba(255,255,255,0.35);
        }
    `,document.head.appendChild(t),t}function a(e,t,n){n&&n.destroy(),e&&e.parentNode&&e.parentNode.removeChild(e),t&&t.parentNode&&t.parentNode.removeChild(t)}var o=!1;function s(){if(o)return;o=!0;let e=document.createElement(`style`);e.textContent=`
        /* ===== lil-gui 毛玻璃统一样式 ===== */
        .lil-gui {
            --background-color: rgba(25, 25, 35, 0.7) !important;
            --text-color: #ebebeb !important;
            --title-background-color: rgba(25, 25, 35, 0.7) !important;
            --title-text-color: #ebebeb !important;
            --number-color: #4fc3f7 !important;
            --widget-color: rgba(50, 50, 60, 0.6) !important;
            --hover-color: rgba(70, 70, 80, 0.7) !important;
            --focus-color: rgba(90, 90, 100, 0.8) !important;
            --widget-border-radius: 6px !important;
            --slider-knob-width: 3px !important;
            --width: 280px !important;
            background: rgba(25, 25, 35, 0.7) !important;
            backdrop-filter: blur(16px) saturate(1.4) !important;
            -webkit-backdrop-filter: blur(16px) saturate(1.4) !important;
            border: 1px solid rgba(255, 255, 255, 0.08) !important;
            border-radius: 10px !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
        }
        .lil-gui .lil-title {
            background: rgba(25, 25, 35, 0.4) !important;
            border-radius: 10px 10px 0 0 !important;
            font-size: 12px !important;
            padding: 8px 10px !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06) !important;
        }
        .lil-gui .lil-controller {
            font-size: 11px !important;
        }
        .lil-controller.lil-number .lil-slider {
            border-radius: 4px !important;
            background: rgba(50, 50, 60, 0.6) !important;
        }
        .lil-controller.lil-number .lil-fill {
            border-right-width: 3px !important;
            border-right-color: #4fc3f7 !important;
        }
        .lil-controller.lil-number .lil-slider:hover .lil-fill {
            opacity: 0.95 !important;
        }
        .lil-controller.lil-number .lil-slider.lil-active .lil-fill {
            opacity: 0.95 !important;
        }
        .lil-controller.lil-number input[type=text] {
            border-radius: 4px !important;
        }
        .lil-gui input[type=text],
        .lil-gui input[type=number] {
            font-size: 11px !important;
        }
        .lil-gui input[type=number] {
            -moz-appearance: textfield;
            padding-right: 22px !important;
            min-width: 58px !important;
            width: 58px !important;
        }
        .lil-gui input[type=number]::-webkit-inner-spin-button,
        .lil-gui input[type=number]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
        /* 自定义微调箭头按钮 */
        .lil-controller.lil-number {
            position: relative;
        }
        .lil-controller.lil-number .gui-spinner {
            position: absolute;
            right: 3px;
            top: 3px;
            bottom: 3px;
            width: 16px;
            display: flex;
            flex-direction: column;
            opacity: 0.65;
            transition: opacity 0.2s ease;
            z-index: 5;
        }
        .lil-controller.lil-number .gui-spinner button {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(79, 195, 247, 0.08);
            border: none;
            color: #4fc3f7;
            cursor: pointer;
            padding: 0 2px;
            margin: 0;
            font-size: 6px;
            line-height: 1;
            transition: background 0.15s;
            user-select: none;
            outline: none;
        }
        .lil-controller.lil-number .gui-spinner button:hover {
            background: rgba(79, 195, 247, 0.2);
        }
        .lil-controller.lil-number .gui-spinner button:active {
            background: rgba(79, 195, 247, 0.35);
            color: #80d4fa;
        }
        .lil-controller.lil-number .gui-spinner .spinner-up {
            border-radius: 3px 3px 0 0;
            border-bottom: 1px solid rgba(0, 0, 0, 0.2);
        }
        .lil-controller.lil-number .gui-spinner .spinner-down {
            border-radius: 0 0 3px 3px;
        }
        .lil-gui .lil-folder .lil-title {
            background: rgba(40, 40, 50, 0.5) !important;
            border-radius: 6px !important;
            margin: 2px 4px !important;
        }
    `,document.head.appendChild(e),c()}function c(){new MutationObserver(()=>{document.querySelectorAll(`.lil-controller.lil-number input[type="text"]`).forEach(e=>{let t=e.closest(`.lil-controller`);if(!t)return;let n=t.querySelector(`.lil-slider`);if(!n||t.querySelector(`.gui-spinner`))return;let r=n.getAttribute(`aria-valuemin`),i=n.getAttribute(`aria-valuemax`);e.type=`number`,r!==null&&(e.min=r),i!==null&&(e.max=i),e.step=`0.01`;let a=document.createElement(`div`);a.className=`gui-spinner`;let o=document.createElement(`button`);o.className=`spinner-up`,o.type=`button`,o.tabIndex=-1,o.innerHTML=`▲`,o.addEventListener(`click`,t=>{t.preventDefault(),t.stopPropagation(),e.stepUp(),e.dispatchEvent(new Event(`input`,{bubbles:!0})),e.dispatchEvent(new Event(`change`,{bubbles:!0}))});let s=document.createElement(`button`);s.className=`spinner-down`,s.type=`button`,s.tabIndex=-1,s.innerHTML=`▼`,s.addEventListener(`click`,t=>{t.preventDefault(),t.stopPropagation(),e.stepDown(),e.dispatchEvent(new Event(`input`,{bubbles:!0})),e.dispatchEvent(new Event(`change`,{bubbles:!0}))}),a.appendChild(o),a.appendChild(s),t.appendChild(a)})}).observe(document.body,{childList:!0,subtree:!0})}export{n as i,a as n,r,i as t};