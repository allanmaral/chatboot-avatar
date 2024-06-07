"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAnimations, useGLTF } from "@react-three/drei";
import { GroupProps, useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { useChat } from "@/components/chat";
import { lerpMorphTarget } from "@/lib/scene";
import { FacialExpression, MouthCue } from "@/lib/chat";

import { facialExpressions } from "./facial-expressions";
import { mouthShapeMapping } from "./mouth-shape-mapping";

const AVATAR_URL = "/models/avatar.glb";
const ANIMATIONS_URL = "/models/animations.glb";

export function Avatar(props: GroupProps) {
  const { nodes, materials, scene } = useGLTF(AVATAR_URL);
  const { animations } = useGLTF(ANIMATIONS_URL);
  const group = useRef<THREE.Group<THREE.Object3DEventMap>>(null);
  const { currentMessage, messagePlayed } = useChat();
  const [mouthCues, setMouthCues] = useState<MouthCue[]>();
  const [blink, setBlink] = useState(false);
  const [facialExpression, setFacialExpression] =
    useState<FacialExpression>("default");
  const [audio, setAudio] = useState<HTMLAudioElement | undefined>();
  const { actions, mixer } = useAnimations(animations, group);
  const [animation, setAnimation] = useState(
    animations.find((a) => a.name === "Idle") ? "Idle" : animations[0].name
  );

  useEffect(() => {
    if (!currentMessage) {
      setAnimation("Idle");
      return;
    }
    setAnimation(currentMessage.animation);
    setFacialExpression(currentMessage.facialExpression);
    setMouthCues(currentMessage.mouthCues);
    const audio = new Audio("data:audio/mp3;base64," + currentMessage.audio);
    audio.play();
    setAudio(audio);
    audio.onended = messagePlayed;
  }, [currentMessage, messagePlayed]);

  useEffect(() => {
    actions[animation]
      ?.reset()
      // @ts-ignore
      .fadeIn(mixer.stats.actions.inUse === 0 ? 0 : 0.5)
      .play();

    return () => {
      actions[animation]?.fadeOut(0.5);
    };
  }, [
    actions,
    animation,
    animations,
    // @ts-ignore
    mixer.stats.actions.inUse,
  ]);

  useFrame(() => {
    const referenceMesh = nodes.EyeLeft as THREE.SkinnedMesh;
    Object.keys(referenceMesh.morphTargetDictionary || {}).forEach((key) => {
      const mapping = facialExpressions[facialExpression];
      // Eyes blink are handled separately
      if (key === "eyeBlinkLeft" || key === "eyeBlinkRight") {
        return;
      }
      if (mapping && mapping[key]) {
        lerpMorphTarget(scene, key, mapping[key], 0.1);
      } else {
        lerpMorphTarget(scene, key, 0, 0.1);
      }
    });

    lerpMorphTarget(scene, "eyeBlinkLeft", blink ? 1 : 0, 0.5);
    lerpMorphTarget(scene, "eyeBlinkRight", blink ? 1 : 0, 0.5);

    const appliedMorphTargets: string[] = [];
    if (currentMessage && mouthCues && audio) {
      const currentAudioTime = audio.currentTime;
      for (let i = 0; i < mouthCues.length; i++) {
        const mouthCue = mouthCues[i];
        if (
          currentAudioTime >= mouthCue.start &&
          currentAudioTime <= mouthCue.end
        ) {
          const cue = mouthShapeMapping[mouthCue.value];
          appliedMorphTargets.push(cue.morphTarget);
          lerpMorphTarget(scene, cue.morphTarget, cue.weight * 1.0, 0.4);
          break;
        }
      }
    }

    Object.values(mouthShapeMapping).forEach((value) => {
      if (appliedMorphTargets.includes(value.morphTarget)) {
        return;
      }
      lerpMorphTarget(scene, value.morphTarget, 0, 0.1);
    });
  });

  useEffect(() => {
    let blinkTimeout: any;
    const nextBlink = () => {
      blinkTimeout = setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          nextBlink();
        }, 200);
      }, THREE.MathUtils.randInt(1000, 5000));
    };
    nextBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);

  // JSX generated from GLTF file, ignore typescript
  const _nodes: any = nodes;
  return (
    <group {...props} dispose={null} ref={group}>
      <primitive object={_nodes.Hips} />
      <skinnedMesh
        name="EyeLeft"
        geometry={_nodes.EyeLeft.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={_nodes.EyeLeft.skeleton}
        morphTargetDictionary={_nodes.EyeLeft.morphTargetDictionary}
        morphTargetInfluences={_nodes.EyeLeft.morphTargetInfluences}
      />
      <skinnedMesh
        name="EyeRight"
        geometry={_nodes.EyeRight.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={_nodes.EyeRight.skeleton}
        morphTargetDictionary={_nodes.EyeRight.morphTargetDictionary}
        morphTargetInfluences={_nodes.EyeRight.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Head"
        geometry={_nodes.Wolf3D_Head.geometry}
        material={materials.Wolf3D_Skin}
        skeleton={_nodes.Wolf3D_Head.skeleton}
        morphTargetDictionary={_nodes.Wolf3D_Head.morphTargetDictionary}
        morphTargetInfluences={_nodes.Wolf3D_Head.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Teeth"
        geometry={_nodes.Wolf3D_Teeth.geometry}
        material={materials.Wolf3D_Teeth}
        skeleton={_nodes.Wolf3D_Teeth.skeleton}
        morphTargetDictionary={_nodes.Wolf3D_Teeth.morphTargetDictionary}
        morphTargetInfluences={_nodes.Wolf3D_Teeth.morphTargetInfluences}
      />
      <skinnedMesh
        geometry={_nodes.Wolf3D_Hair.geometry}
        material={materials.Wolf3D_Hair}
        skeleton={_nodes.Wolf3D_Hair.skeleton}
      />
      <skinnedMesh
        geometry={_nodes.Wolf3D_Body.geometry}
        material={materials.Wolf3D_Body}
        skeleton={_nodes.Wolf3D_Body.skeleton}
      />
      <skinnedMesh
        geometry={_nodes.Wolf3D_Outfit_Bottom.geometry}
        material={materials.Wolf3D_Outfit_Bottom}
        skeleton={_nodes.Wolf3D_Outfit_Bottom.skeleton}
      />
      <skinnedMesh
        geometry={_nodes.Wolf3D_Outfit_Footwear.geometry}
        material={materials.Wolf3D_Outfit_Footwear}
        skeleton={_nodes.Wolf3D_Outfit_Footwear.skeleton}
      />
      <skinnedMesh
        geometry={_nodes.Wolf3D_Outfit_Top.geometry}
        material={materials.Wolf3D_Outfit_Top}
        skeleton={_nodes.Wolf3D_Outfit_Top.skeleton}
      />
    </group>
  );
}

useGLTF.preload(AVATAR_URL);
useGLTF.preload(ANIMATIONS_URL);
