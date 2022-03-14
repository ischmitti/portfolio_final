import"./style.css";import*as THREE from"three";import*as dat from"lil-gui";import gsap from"gsap";window.onload=()=>{if(window.innerWidth>=1768){const e={materialColor:"#ffeded"},t=document.querySelector("canvas.webgl"),o=new THREE.Scene,n=new THREE.TextureLoader;n.load("").magFilter=THREE.NearestFilter;const i=new THREE.MeshToonMaterial({color:e.materialColor}),r=4,a=new THREE.Mesh(new THREE.TorusBufferGeometry(.15,.1,20,100),i),s=new THREE.Mesh(new THREE.ConeBufferGeometry(.25,.5,32),i),d=new THREE.Mesh(new THREE.BoxBufferGeometry(.25,.25,.25,16),i);a.position.x=-2.5,s.position.x=2.5,d.position.x=-2.5,a.position.y=.3*r,s.position.y=.7*-r,d.position.y=1.7*-r,o.add(a,s,d);const l=[a,s,d],w=new THREE.DirectionalLight("#ffffff",1);w.position.set(1,1,0),o.add(w);const c=200,E=new Float32Array(3*c);for(let e=0;e<c;e++)E[3*e+0]=10*(Math.random()-.5),E[3*e+1]=.5*r-Math.random()*r*l.length,E[3*e+2]=10*(Math.random()-.5);const h=new THREE.BufferGeometry;h.setAttribute("position",new THREE.BufferAttribute(E,3));const m=new THREE.PointsMaterial({color:e.materialColor,sizeAttenuation:n,size:.03}),u=new THREE.Points(h,m);o.add(u);const y={width:window.innerWidth,height:window.innerHeight};window.addEventListener("resize",(()=>{y.width=window.innerWidth,y.height=window.innerHeight,g.aspect=y.width/y.height,g.updateProjectionMatrix(),T.setSize(y.width,y.height),T.setPixelRatio(Math.min(window.devicePixelRatio,2))}));const p=new THREE.Group;o.add(p);const g=new THREE.PerspectiveCamera(35,y.width/y.height,.1,100);g.position.z=6,p.add(g);const T=new THREE.WebGLRenderer({canvas:t,alpha:!0});T.setSize(y.width,y.height),T.setPixelRatio(Math.min(window.devicePixelRatio,2));let f=window.scrollY,R=0;window.addEventListener("scroll",(()=>{f=window.scrollY;const e=Math.round(f/y.height);e!=R&&(R=e,gsap.to(l[R].rotation,{duration:1.5,ease:"power2.inOut",x:"+=6",y:"+=3",z:"+=1.5"}))}));const H={x:0,y:0};window.addEventListener("mousemove",(e=>{H.x=e.clientX/y.width-.5,H.y=e.clientY/y.height-.5}));const x=new THREE.Clock;let M=0;const v=()=>{const e=x.getElapsedTime(),t=e-M;M=e,g.position.y=-f/y.height*r;const n=.5*H.x,i=.5*-H.y;p.position.x+=5*(n-p.position.x)*t,p.position.y+=5*(i-p.position.y)*t;for(const e of l)e.rotation.x+=.1*t,e.rotation.y+=.12*t;T.render(o,g),window.requestAnimationFrame(v)};v()}const e=["January","February","March","April","May","June","Juli","August","September","October","November","December"],t=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];!function(){const o=new Date;let n=o.getMinutes();n<10&&(n="0"+n);const i=o.getHours()+":"+n,r=o.getMonth(),a=o.getDay()%7;let s=o.getDay();s<10&&(s="0"+s),document.getElementById("time").textContent=i,document.getElementById("date").textContent=t[a]+", "+s+". "+e[r]}(),function(){const e=document.getElementById("navbar");document.getElementsByTagName("body")[0],document.addEventListener("scroll",(()=>{scrollY>window.innerHeight?e.style.display="inline":e.style.display="none"}))}(),document.getElementById("up-button").addEventListener("click",(()=>{window.scrollTo({top:0,behavior:"smooth"})}))};