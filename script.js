const scene=new THREE.Scene();
scene.background=new THREE.Color(0x040607);
scene.fog=new THREE.Fog(0x040607,14,30);

const camera=new THREE.PerspectiveCamera(75,innerWidth/innerHeight,.1,1000);
camera.position.set(0,1.7,0.1);

const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.physicallyCorrectLights=true;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.25;
renderer.outputColorSpace=THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);
renderer.domElement.style.touchAction='none';
document.body.style.touchAction='none';

const btn=document.getElementById('btn');
const overlay=document.getElementById('overlay');
btn?.addEventListener('click',()=>{overlay.style.display='none';});

const ambient=new THREE.HemisphereLight(0xbfdcff,0x29140b,.78);
scene.add(ambient);

const keyLight=new THREE.DirectionalLight(0xf6e8c8,1.25);
keyLight.position.set(4,8.2,2.6);
keyLight.castShadow=true;
keyLight.shadow.mapSize.set(2048,2048);
keyLight.shadow.camera.left=-10;
keyLight.shadow.camera.right=10;
keyLight.shadow.camera.top=10;
keyLight.shadow.camera.bottom=-10;
scene.add(keyLight);

const fillLight=new THREE.PointLight(0x6ea8ff,6.4,24,2);
fillLight.position.set(-4.2,3.6,-3.2);
scene.add(fillLight);

const rimLight=new THREE.PointLight(0x4f6aff,2.4,18,2);
rimLight.position.set(0,4.4,6.8);
scene.add(rimLight);

const wallMaterialBlack=new THREE.MeshStandardMaterial({
  color:0x06080b,
  emissive:0x020406,
  roughness:0.48,
  metalness:0.16
});

const wallMaterialBlue=new THREE.MeshStandardMaterial({
  color:0x0d2143,
  emissive:0x07142b,
  roughness:0.42,
  metalness:0.14
});

const floorMaterial=new THREE.MeshStandardMaterial({
  color:0x171717,
  roughness:0.95,
  metalness:0.04
});

const frameMaterial=new THREE.MeshStandardMaterial({
  color:0x0c0c0c,
  roughness:0.35,
  metalness:0.15
});

const pedestalMaterial=new THREE.MeshStandardMaterial({
  color:0x1a1a1a,
  roughness:0.72,
  metalness:0.1
});

const roomSize=20;

function createWall(width,height,position,rotationY=0,material=wallMaterialBlack){
  const wall=new THREE.Mesh(new THREE.PlaneGeometry(width,height),material);
  wall.position.copy(position);
  wall.rotation.y=rotationY;
  wall.receiveShadow=true;
  scene.add(wall);
  return wall;
}

const floor = new THREE.Mesh(new THREE.PlaneGeometry(roomSize, roomSize), floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

const grid = new THREE.GridHelper(18, 18, 0x3a3a3a, 0x171717);
grid.position.y = 0.001;
scene.add(grid);

createWall(roomSize, 10, new THREE.Vector3(0, 5, -roomSize / 2), 0, wallMaterialBlack);
createWall(roomSize, 10, new THREE.Vector3(0, 5, roomSize / 2), Math.PI, wallMaterialBlue);
createWall(roomSize, 10, new THREE.Vector3(-roomSize / 2, 5, 0), Math.PI / 2, wallMaterialBlack);
createWall(roomSize, 10, new THREE.Vector3(roomSize / 2, 5, 0), -Math.PI / 2, wallMaterialBlue);

const ceiling = new THREE.Mesh(
  new THREE.PlaneGeometry(roomSize, roomSize),
  new THREE.MeshPhysicalMaterial({
    color: 0x0d1014,
    roughness: 0.84,
    metalness: 0.03,
    emissive: 0x06070a,
    emissiveIntensity: 0.05
  })
);
ceiling.rotation.x = Math.PI / 2;
ceiling.position.y = 10;
scene.add(ceiling);

const obras=[];
const interactiveObjects=[];
const nombresObras=[
 'Es mejor ser rico que pobre',
 'Un sueño',
 'Niño',
 'Eclipse rojo',
 'Pueblito'
];
const artworksData=[
 {
  title:'Es mejor ser rico que ser pobre',
  author:'Miguel Ángel Rojas',
  year:'1998',
  technique:'Acrílico y hojilla de oro sobre lienzo',
  measures:'100 x 130 cm.',
  category:'Pintura',
  donation:'01/01/1999',
  tags:'Arte latinoamericano | Simbolismo | Surrealismo',
  description:''
 },
 {
  title:'Un sueño',
  author:'Víctor Chab',
  year:'1991',
  technique:'Collage y acrílico',
  measures:'100 x 80 cm.',
  category:'Pintura',
  donation:'01/01/1990',
  tags:'Abstracción | Arte latinoamericano | Surrealismo',
  description:''
 },
 {
  title:'Niño',
  author:'María Cecilia Piazza',
  year:'2007',
  technique:'Impresión en tinta sobre papel Premium',
  measures:'135 x 98 cm.',
  category:'Fotografía',
  donation:'19/08/2015',
  tags:'Arte peruano | Mujeres artistas | Simbolismo',
  description:''
 },
 {
  title:'Eclipse rojo',
  author:'Nemesio Antúnez',
  year:'1960',
  technique:'Óleo sobre lienzo',
  measures:'68.5 x 103.5 cm.',
  category:'Pintura',
  donation:'01/01/1960',
  tags:'Abstracción lírica | Arte latinoamericano',
  description:''
 },
 {
  title:'Pueblito',
  author:'',
  year:'',
  technique:'',
  measures:'',
  category:'',
  donation:'',
  tags:'',
  description:''
 }
];

function resolveBasePath(){
 const scriptUrl=document.currentScript?.src || '';
 if(scriptUrl){
  const withoutFile=scriptUrl.replace(/\/[^\/]*$/, '/');
  return withoutFile;
 }
 return window.location.href.includes('index.html')?
  window.location.href.replace(/index\.html$/, ''):
  window.location.href.replace(/\/?$/, '/');
}

const basePath=resolveBasePath();

function resolveImagePath(relativePath){
 return new URL(relativePath, basePath).toString();
}

function loadArtworkTexture(index, onLoaded){
 const candidates=[`imagenes/obra${index}.png`,`imagenes/obra${index}.PNG`,`imagenes/obra${index}.jpg`,`imagenes/obra${index}.JPG`];
 let attempt=0;
 const tryNext=()=>{
  if(attempt>=candidates.length){
   console.warn(`No se pudo cargar la textura de obra ${index} desde ninguna ruta.`);
   onLoaded(null);
   return;
  }
  const path=resolveImagePath(candidates[attempt++]);
  const image=new Image();
  image.onload=()=>{
   const texture=new THREE.Texture(image);
   texture.generateMipmaps=false;
   texture.minFilter=THREE.LinearFilter;
   texture.wrapS=THREE.ClampToEdgeWrapping;
   texture.wrapT=THREE.ClampToEdgeWrapping;
   texture.encoding=THREE.sRGBEncoding;
   texture.needsUpdate=true;
   logDebug(`Imagen cargada: ${path}`);
   onLoaded(texture);
  };
  image.onerror=()=>{
   logDebug(`Fallo al cargar imagen: ${path}`, true);
   tryNext();
  };
  image.src=path;
 };
 tryNext();
}

const debugLog=document.getElementById('debugLog');
function logDebug(message, isError=false){
 if(!debugLog)return;
 debugLog.classList.remove('hidden');
 const item=document.createElement('p');
 item.textContent=message;
 if(isError) item.style.color='#ff8080';
 debugLog.appendChild(item);
 debugLog.scrollTop=debugLog.scrollHeight;
}

for(let i=1;i<=5;i++){
 const ang=(i-1)*Math.PI*2/5;
 const g=new THREE.Group();

 const marco=new THREE.Mesh(new THREE.BoxGeometry(1.8,2.45,.08),frameMaterial);
 marco.castShadow=true;
 marco.receiveShadow=true;

 const imgMaterial=new THREE.MeshBasicMaterial({color:0xffffff});
 const img=new THREE.Mesh(new THREE.PlaneGeometry(1.55,2.15),imgMaterial);
 img.position.z=.05;
 img.castShadow=true;
 loadArtworkTexture(i,tex=>{
  if(tex){
   tex.anisotropy=renderer.capabilities.getMaxAnisotropy();
   tex.encoding=THREE.sRGBEncoding;
   imgMaterial.map=tex;
   imgMaterial.needsUpdate=true;
  }
 });

 const pedestal=new THREE.Mesh(new THREE.CylinderGeometry(.28,.36,.6,24),pedestalMaterial);
 pedestal.position.set(0,-1.1,0);
 pedestal.castShadow=true;
 pedestal.receiveShadow=true;

 const base=new THREE.Mesh(new THREE.BoxGeometry(1.2,.12,1.2),new THREE.MeshStandardMaterial({color:0x141414,roughness:0.8,metalness:0.08}));
 base.position.set(0,-1.4,0);
 base.castShadow=true;
 base.receiveShadow=true;

 const labelCanvas=document.createElement('canvas');
 labelCanvas.width=512;
 labelCanvas.height=160;
 const labelCtx=labelCanvas.getContext('2d');
 const gradient=labelCtx.createLinearGradient(0,0,0,160);
 gradient.addColorStop(0,'rgba(255,255,255,0.95)');
 gradient.addColorStop(1,'rgba(224,224,224,0.86)');
 labelCtx.fillStyle=gradient;
 labelCtx.fillRect(10,10,492,140);
 labelCtx.strokeStyle='rgba(0,0,0,0.2)';
 labelCtx.lineWidth=8;
 labelCtx.strokeRect(14,14,484,132);
 labelCtx.fillStyle='#111';
 labelCtx.font='bold 34px Arial';
 labelCtx.textAlign='center';
 labelCtx.textBaseline='middle';
 labelCtx.fillText(nombresObras[i-1],256,80);
 const labelTexture=new THREE.CanvasTexture(labelCanvas);
 labelTexture.minFilter=THREE.LinearFilter;
 const label=new THREE.Mesh(new THREE.PlaneGeometry(2.2,0.48),new THREE.MeshBasicMaterial({map:labelTexture,transparent:true,depthWrite:false}));
 label.position.set(0,1.55,0.16);
 label.renderOrder=10;

 const spotlight=new THREE.SpotLight(0xfff0c2,.65,8,Math.PI/8,0.45,1.2);
 spotlight.position.set(Math.cos(ang)*4.2,4.4,Math.sin(ang)*4.2);
 spotlight.target.position.set(0,1.8,0);
 scene.add(spotlight.target);
 spotlight.castShadow=true;
 spotlight.shadow.mapSize.set(1024,1024);
 scene.add(spotlight);

 const hitbox=new THREE.Mesh(new THREE.BoxGeometry(2.4,3.2,.2),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));
 hitbox.position.z=.1;
 g.userData.artwork=artworksData[i-1];
 interactiveObjects.push(g);

 g.add(marco);g.add(img);g.add(pedestal);g.add(base);g.add(label);g.add(hitbox);
 g.position.set(Math.cos(ang)*6.2,1.8,Math.sin(ang)*6.2);
 g.lookAt(0,1.8,0);
 scene.add(g);obras.push(g);
}

const infoPanel=document.getElementById('artworkInfo');
const artworkTitle=document.getElementById('artworkTitle');
const artworkDescription=document.getElementById('artworkDescription');
const artworkAuthor=document.getElementById('artworkAuthor');
const artworkYear=document.getElementById('artworkYear');
const artworkTechnique=document.getElementById('artworkTechnique');
const artworkMeasures=document.getElementById('artworkMeasures');
const artworkCategory=document.getElementById('artworkCategory');
const artworkDonation=document.getElementById('artworkDonation');
const artworkTags=document.getElementById('artworkTags');
const closeInfo=document.getElementById('closeInfo');
const raycaster=new THREE.Raycaster();
const pointer=new THREE.Vector2();

function showArtworkInfo(artwork){
 artworkTitle.textContent=artwork.title||'Sin título';
 artworkDescription.textContent=artwork.description||'';
 artworkAuthor.textContent=artwork.author||'—';
 artworkYear.textContent=artwork.year||'—';
 artworkTechnique.textContent=artwork.technique||'—';
 artworkMeasures.textContent=artwork.measures||'—';
 artworkCategory.textContent=artwork.category||'—';
 artworkDonation.textContent=artwork.donation||'—';
 artworkTags.textContent=artwork.tags||'—';
 infoPanel.classList.remove('hidden');
}

function hideArtworkInfo(){
 infoPanel.classList.add('hidden');
}

closeInfo?.addEventListener('click',hideArtworkInfo);
addEventListener('keydown',e=>{if(e.key==='Escape')hideArtworkInfo();});
renderer.domElement.addEventListener('click',event=>{
 if(drag)return;
 const rect=renderer.domElement.getBoundingClientRect();
 pointer.x=((event.clientX-rect.left)/rect.width)*2-1;
 pointer.y=-((event.clientY-rect.top)/rect.height)*2+1;
 raycaster.setFromCamera(pointer,camera);
 const hits=raycaster.intersectObjects(interactiveObjects,true);
 if(hits.length){
  const artwork=hits[0].object.parent?.userData?.artwork||hits[0].object.userData?.artwork;
  if(artwork)showArtworkInfo(artwork);
 }
});

let touchState=null;
renderer.domElement.addEventListener('touchstart',event=>{
 if(event.touches.length===1){
  const touch=event.touches[0];
  touchState={mode:'rotate',startX:touch.clientX,startY:touch.clientY,startYaw:yaw,startPitch:pitch};
 }else if(event.touches.length===2){
  const [t1,t2]=event.touches;
  touchState={mode:'zoom',startDistance:Math.hypot(t2.clientX-t1.clientX,t2.clientY-t1.clientY),startCameraDistance:camera.position.length()};
 }
},{passive:true});
renderer.domElement.addEventListener('touchmove',event=>{
 if(!touchState)return;
 event.preventDefault();
 if(touchState.mode==='rotate'&&event.touches.length===1){
  const touch=event.touches[0];
  const dx=(touch.clientX-touchState.startX)/window.innerWidth;
  const dy=(touch.clientY-touchState.startY)/window.innerHeight;
  yaw=touchState.startYaw-dx*2.2;
  pitch=Math.max(-1.2,Math.min(1.2,touchState.startPitch+dy*1.5));
 }else if(touchState.mode==='zoom'&&event.touches.length===2){
  const [t1,t2]=event.touches;
  const distance=Math.hypot(t2.clientX-t1.clientX,t2.clientY-t1.clientY);
  const ratio=distance/touchState.startDistance;
  const newDistance=Math.max(2.2,Math.min(8.6,touchState.startCameraDistance*ratio));
  const dir=camera.position.clone().normalize();
  const nextPos=dir.multiplyScalar(newDistance);
  nextPos.y=Math.max(1.2,Math.min(2.5,camera.position.y));
  camera.position.copy(nextPos);
 }
},{passive:false});
renderer.domElement.addEventListener('touchend',()=>{touchState=null;});

let yaw=0,pitch=0,drag=false,vx=0,vy=0;
let moveForward=false,moveBackward=false,moveLeft=false,moveRight=false;
const moveSpeed=0.11;
const maxRoomDistance=8.6;

function clampCameraToRoom(){
 const pos=camera.position;
 const radius=Math.sqrt(pos.x*pos.x+pos.z*pos.z);
 if(radius>maxRoomDistance){
  pos.x=(pos.x/radius)*maxRoomDistance;
  pos.z=(pos.z/radius)*maxRoomDistance;
 }
 pos.y=Math.max(1.2,Math.min(2.5,pos.y));
}

function updateCamera(){
 const forward=new THREE.Vector3(Math.sin(yaw),0,-Math.cos(yaw));
 const right=new THREE.Vector3(Math.cos(yaw),0,Math.sin(yaw));
 if(moveForward)camera.position.addScaledVector(forward,moveSpeed);
 if(moveBackward)camera.position.addScaledVector(forward,-moveSpeed);
 if(moveLeft)camera.position.addScaledVector(right,-moveSpeed);
 if(moveRight)camera.position.addScaledVector(right,moveSpeed);
 clampCameraToRoom();
 yaw+=vx;pitch=Math.max(-1.2,Math.min(1.2,pitch+vy));
 vx*=.92;vy*=.92;
 const target=new THREE.Vector3(camera.position.x+Math.sin(yaw)*6,1.6+pitch,camera.position.z-Math.cos(yaw)*6);
 camera.lookAt(target);
}

addEventListener('keydown',e=>{
 const key=e.key.toLowerCase();
 if(key==='w'||key==='arrowup')moveForward=true;
 if(key==='s'||key==='arrowdown')moveBackward=true;
 if(key==='a'||key==='arrowleft')moveLeft=true;
 if(key==='d'||key==='arrowright')moveRight=true;
});

addEventListener('keyup',e=>{
 const key=e.key.toLowerCase();
 if(key==='w'||key==='arrowup')moveForward=false;
 if(key==='s'||key==='arrowdown')moveBackward=false;
 if(key==='a'||key==='arrowleft')moveLeft=false;
 if(key==='d'||key==='arrowright')moveRight=false;
});

addEventListener('mousedown',()=>{drag=true;document.body.style.cursor='grabbing';});
addEventListener('mouseup',()=>{drag=false;document.body.style.cursor='grab';});
addEventListener('mouseleave',()=>{drag=false;document.body.style.cursor='default';});
addEventListener('mousemove',e=>{if(!drag)return;vx=-e.movementX*.002;vy=-e.movementY*.002;});
addEventListener('wheel',e=>{
 const forward=new THREE.Vector3(Math.sin(yaw),0,-Math.cos(yaw));
 const zoomStep=e.deltaY>0?0.25:-0.25;
 const nextPos=camera.position.clone().addScaledVector(forward,zoomStep);
 const nextRadius=Math.sqrt(nextPos.x*nextPos.x+nextPos.z*nextPos.z);
 if(nextRadius<maxRoomDistance&&nextPos.y>1.1&&nextPos.y<2.6)camera.position.copy(nextPos);
 e.preventDefault();
},{passive:false});

function animate() {
  updateCamera();
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});

