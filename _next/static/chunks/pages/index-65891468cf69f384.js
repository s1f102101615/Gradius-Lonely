(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{9208:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return n(9178)}])},9178:function(e,t,n){"use strict";n.r(t);var i=n(5893),s=n(24),l=n(185),r=n.n(l),d=n(7294),x=n(2237),u=n(8239),a=n(1290),o=n(5371);let f=()=>{let[e]=(0,s.KO)(o.L),[t,n]=(0,d.useState)([0,0]),[l,f]=(0,d.useState)([]),[c,y]=(0,d.useState)([]),h=(0,d.useRef)(null),p=async e=>{if("KeyZ"===e.code){let e={x:t[1]+54,y:t[0]+20,speedX:1e3};y(t=>[...t,e])}else if("Space"===e.code){let e={x:640,y:Math.floor(481*Math.random()),speedX:-100};f(t=>[...t,e])}let i=await a.x.control.post({body:{x:t[0],y:t[1],KeyEvent:e.code}});n([i.body.x,i.body.y])};function _(e,t){let n=e.x-t.x,i=e.y-t.y;return 55>=Math.sqrt(n*n+i*i)}let m=()=>{f(e=>e.filter(e=>{let t=c.some(t=>_(t,e));return!t||(y(t=>t.filter(t=>!_(t,e))),!1)}))};return((0,d.useEffect)(()=>{let e=new(r()).Animation(e=>{if(e){let t=e.timeDiff/1e3;y(e=>e.map(e=>({...e,x:e.x+e.speedX*t})).filter(e=>e.x<640)),f(e=>e.map(e=>({...e,x:e.x+e.speedX*t}))),f(e=>e.map(e=>({...e,x:e.x+e.speedX*t})).filter(e=>e.x>0)),m()}});return e.start(),h.current=e,()=>{e.stop()}},[c,l]),e)?(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)("p",{children:["gradius",t]}),(0,i.jsx)("div",{tabIndex:0,onKeyDown:p,style:{display:"inline-block",border:"solid"},children:(0,i.jsx)(x.Hf,{width:640,height:480,children:(0,i.jsxs)(x.mh,{children:[(0,i.jsx)(x.UL,{x:t[1],y:t[0],width:50,height:40,fill:"blue"}),l.map((e,t)=>(0,i.jsx)(x.Cd,{x:e.x,y:e.y,radius:35,fill:"red"},t)),c.map((e,t)=>(0,i.jsx)(x.Cd,{x:e.x,y:e.y,radius:10,fill:"green"},t))]})})})]}):(0,i.jsx)(u.g,{visible:!0})};t.default=f}},function(e){e.O(0,[237,774,888,179],function(){return e(e.s=9208)}),_N_E=e.O()}]);