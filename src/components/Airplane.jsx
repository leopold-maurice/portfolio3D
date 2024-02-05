/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.16 .\public\models\airplane\starfighter.glb 
*/

import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export function Airplane(props) {
  const { nodes, materials } = useGLTF("./models/airplane/starfighter.glb");
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes["Node-Mesh"].geometry} material={materials.mat16}>
        <meshStandardMaterial color="#444444" />
      </mesh>
      <mesh geometry={nodes["Node-Mesh_1"].geometry} material={materials.mat5}>
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh geometry={nodes["Node-Mesh_2"].geometry} material={materials.mat8}>
        <meshStandardMaterial color="#830000" />
      </mesh>
      <mesh geometry={nodes["Node-Mesh_3"].geometry} material={materials.mat17}>
        <meshStandardMaterial color="#222222" />
      </mesh>
      <mesh geometry={nodes["Node-Mesh_4"].geometry} material={materials.mat25}>
        <meshStandardMaterial color="#830000" />
      </mesh>
      <mesh
        geometry={nodes["Node-Mesh_5"].geometry}
        material={materials.mat24}
      />
      <mesh geometry={nodes["Node-Mesh_6"].geometry} material={materials.mat23}>
        <meshStandardMaterial color="#830000" />
      </mesh>
      <mesh
        geometry={nodes["Node-Mesh_7"].geometry}
        material={materials.mat22}
      />
      <mesh geometry={nodes["Node-Mesh_8"].geometry} material={materials.mat7}>
        <meshStandardMaterial color="#AF3500" />
      </mesh>
    </group>
  );
}

useGLTF.preload("./models/airplane/starfighter.glb");
