import * as THREE from 'three';
import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';
import {mkdir,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
import {createIsland} from '../src/index.js';

// GLTFExporter uses FileReader for Blob output; Node's Blob supports the same reads.
globalThis.FileReader??=class{
  readAsArrayBuffer(blob){blob.arrayBuffer().then(value=>{this.result=value;this.onloadend?.()}).catch(error=>this.onerror?.(error))}
  readAsDataURL(blob){blob.arrayBuffer().then(value=>{this.result=`data:${blob.type};base64,${Buffer.from(value).toString('base64')}`;this.onloadend?.()}).catch(error=>this.onerror?.(error))}
};

const out=resolve(dirname(fileURLToPath(import.meta.url)),'../models');
await mkdir(out,{recursive:true});
for(const id of ['spiral','verdant','pinwheel']){
  const island=createIsland(id);
  island.update(0,0);
  const manifest=island.navigationManifest();
  await writeFile(resolve(out,`${id}.navigation.json`),JSON.stringify(manifest,null,2));
  // Keep only JSON-safe navigation tags in glTF node extras.
  island.group.traverse(object=>{const tag=object.userData.navSurface;object.userData=tag?{navSurface:tag}:{}});
  const binary=await new GLTFExporter().parseAsync(island.group,{binary:true,onlyVisible:true});
  await writeFile(resolve(out,`${id}.glb`),Buffer.from(binary));
  console.log(`${id}: ${(binary.byteLength/1048576).toFixed(2)} MiB, ${manifest.walkableNodes.length} named walkable nodes`);
  island.dispose();
}
