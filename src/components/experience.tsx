"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import {
  CameraControls,
  ContactShadows,
  Environment,
  Loader,
  Text,
} from "@react-three/drei";
import { Canvas, GroupProps } from "@react-three/fiber";
import * as THREE from "three";

import { Avatar } from "@/components/avatar";
import { useChat } from "@/components/chat";

const LoadingDots = (props: GroupProps) => {
  const { loading } = useChat();
  const [loadingText, setLoadingText] = useState("");

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingText((loadingText) => {
          if (loadingText.length > 2) {
            return ".";
          }
          return loadingText + ".";
        });
      }, 800);
      return () => clearInterval(interval);
    } else {
      setLoadingText("");
    }
  }, [loading]);

  return loading ? (
    <group {...props}>
      <Text fontSize={0.14} anchorX={"left"} anchorY={"bottom"}>
        {loadingText}
        <meshBasicMaterial attach="material" color="black" />
      </Text>
    </group>
  ) : null;
};

export const Experience = () => {
  const cameraControls = useRef<CameraControls>();

  const cameraControlsRef = useCallback((controls: CameraControls | null) => {
    cameraControls.current = controls ?? undefined;
    if (cameraControls.current) {
      cameraControls.current.setLookAt(-0.55, 1.73, 1.37, 0, 1.5, 0, false);
    }
  }, []);

  return (
    <>
      {/* <Loader /> */}
      <Canvas shadows camera={{ position: [0, 0, 1], fov: 30 }}>
        <CameraControls ref={cameraControlsRef} />
        <Environment preset="sunset" />
        <Suspense>
          <LoadingDots position-y={1.75} position-x={-0.02} />
        </Suspense>
        <Avatar />
        <ContactShadows opacity={0.7} />
      </Canvas>
    </>
  );
};
