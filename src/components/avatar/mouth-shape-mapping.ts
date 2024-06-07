import { MouthShape } from "@/lib/chat";

export interface CueMapping {
  morphTarget: string;
  weight: number;
}

/**
 * Mouth Shape mapping to avatar mesh Viseme morph targets
 *
 * See: https://github.com/DanielSWolf/rhubarb-lip-sync?tab=readme-ov-file#mouth-shapes
 */
export const mouthShapeMapping: Record<MouthShape, CueMapping> = {
  A: {
    morphTarget: "viseme_PP",
    weight: 0.4,
  },
  B: {
    morphTarget: "viseme_kk",
    weight: 0.3,
  },
  C: {
    morphTarget: "viseme_I",
    weight: 0.5,
  },
  D: {
    morphTarget: "viseme_AA",
    weight: 0.5,
  },
  E: {
    morphTarget: "viseme_O",
    weight: 0.35,
  },
  F: {
    morphTarget: "viseme_U",
    weight: 0.37,
  },
  G: {
    morphTarget: "viseme_FF",
    weight: 0.46,
  },
  H: {
    morphTarget: "viseme_TH",
    weight: 0.65,
  },
  X: {
    morphTarget: "viseme_PP",
    weight: 0.3,
  },
};
