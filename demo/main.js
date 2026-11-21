import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {createIsland} from '../src/index.js';

const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;document.body.prepend(renderer.domElement);
const scene=new THREE.Scene();scene.background=new THREE.Color(0xeaf2ec);
scene.add(new THREE.HemisphereLight(0xffffff,0xb4cbb9,1.7));
const sun=new THREE.DirectionalLight(0xfff0d8,2.1);sun.position.set(-10,18,12);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-32;sun.shadow.camera.right=32;sun.shadow.camera.top=18;sun.shadow.camera.bottom=-18;scene.add(sun);
const fill=new THREE.DirectionalLight(0xd8f4ec,.55);fill.position.set(9,5,-8);scene.add(fill);
const islands=[createIsland('spiral',{position:[-16,0,0]}),createIsland('verdant'),createIsland('pinwheel',{position:[16,0,0]})];
for(const island of islands)scene.add(island.group);
const camera=new THREE.PerspectiveCamera(42,innerWidth/innerHeight,.1,160);camera.position.set(26,16,35);
const orbit=new OrbitControls(camera,renderer.domElement);orbit.target.set(0,-.65,0);orbit.enableDamping=true;orbit.dampingFactor=.07;orbit.minDistance=5;orbit.maxDistance=85;orbit.update();
for(const button of document.querySelectorAll('[data-view]'))button.onclick=()=>{
  const view=button.dataset.view,x={all:0,spiral:-16,verdant:0,pinwheel:16}[view];
  document.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b===button));
  orbit.target.set(x,-.65,0);camera.position.set(x+(view==='all'?26:11),view==='all'?16:8,view==='all'?35:15);orbit.update();
};
let last=performance.now(),elapsed=0;
function frame(now){requestAnimationFrame(frame);const dt=Math.min((now-last)/1000,.05);last=now;elapsed+=dt;for(const island of islands)island.update(dt,elapsed);orbit.update();renderer.render(scene,camera)}requestAnimationFrame(frame);
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,2))});
