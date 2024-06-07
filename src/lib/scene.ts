import * as THREE from "three";

type Scene = THREE.Group<THREE.Object3DEventMap>;

export function lerpMorphTarget(
  scene: Scene,
  target: string,
  value: number,
  speed = 0.1
) {
  scene.traverse((child) => {
    if (
      child instanceof THREE.SkinnedMesh &&
      child.isSkinnedMesh &&
      child.morphTargetDictionary
    ) {
      const index = child.morphTargetDictionary[target];
      if (
        index === undefined ||
        child.morphTargetInfluences?.[index] === undefined
      ) {
        return;
      }
      child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
        child.morphTargetInfluences[index],
        value,
        speed
      );
    }
  });
}
