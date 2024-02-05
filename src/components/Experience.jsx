import {
  Float,
  OrbitControls,
  PerspectiveCamera,
  useScroll,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Group } from "three";
import { Airplane } from "./Airplane";
import { Background } from "./Background";
import { SolarSystem } from "./SolarSystem";
import { TextSection } from "./TextSection";
import gsap from "gsap";
import { BlackHole } from "./BlackHole";

const LINE_NB_POINTS = 1000;
const CURVE_DISTANCE = 250;
const CURVE_AHEAD_CAMERA = 0.008;
const CURVE_AHEAD_AIRPLANE = 0.02;
const AIRPLANE_MAX_ANGLE = 35;
const FRICTION_DISTANCE = 42;

export const Experience = () => {
  const curvePoints = useMemo(
    () => [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -CURVE_DISTANCE),
      new THREE.Vector3(100, 0, -2 * CURVE_DISTANCE),
      new THREE.Vector3(-100, 0, -3 * CURVE_DISTANCE),
      new THREE.Vector3(100, 0, -4 * CURVE_DISTANCE),
      new THREE.Vector3(0, 0, -5 * CURVE_DISTANCE),
      new THREE.Vector3(0, 0, -6 * CURVE_DISTANCE),
      new THREE.Vector3(0, 0, -7 * CURVE_DISTANCE),
    ],
    []
  );

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(curvePoints, false, "catmullrom", 0.5);
  }, []);

  const textSections = useMemo(() => {
    return [
      {
        cameraRailDist: -2,
        position: new THREE.Vector3(
          curvePoints[1].x - 3,
          curvePoints[1].y,
          curvePoints[1].z
        ),
        title: "Welcom",
        subtitle: `Have a seat and prepare yourself for the adventure!`,
      },
      {
        cameraRailDist: 2.5,
        position: new THREE.Vector3(
          curvePoints[2].x + 2,
          curvePoints[2].y,
          curvePoints[2].z
        ),
        title: "Self introduction",
        subtitle: `I'm Léopold Maurice, a french software and information system engineer.`,
      },
      {
        cameraRailDist: -2,
        position: new THREE.Vector3(
          curvePoints[3].x - 3,
          curvePoints[3].y,
          curvePoints[3].z
        ),
        title: "Professional Journey",
        subtitle: `Exploring my career milestones and achievements.`,
      },
      {
        cameraRailDist: 2.5,
        position: new THREE.Vector3(
          curvePoints[4].x + 3.5,
          curvePoints[4].y,
          curvePoints[4].z - 12
        ),
        title: "Personal Interests",
        subtitle: `Exploring my hobbies and passions outside of work.`,
      },
    ];
  }, []);

  const linePoints = useMemo(() => {
    return curve.getPoints(LINE_NB_POINTS);
  }, [curve]);

  const shape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.08);
    shape.lineTo(0, 0.08);

    return shape;
  }, [curve]);

  const cameraGroup = useRef();
  const cameraRail = useRef();
  const airplane = useRef();
  const lastScroll = useRef(0);

  const scroll = useScroll();

  useFrame((_state, delta) => {
    const scrollOffset = Math.max(0, scroll.offset);
    // Calcule le décalage de défilement et s'assure qu'il est toujours positif

    let friction = 1;
    let resetCameraRail = true;

    textSections.forEach((textSection) => {
      const distance = textSection.position.distanceTo(
        cameraGroup.current.position
      );
      if (distance < FRICTION_DISTANCE) {
        friction = Math.max(distance / FRICTION_DISTANCE, 0.005);
        const targetCameraRailPosition = new THREE.Vector3(
          (1 - distance / FRICTION_DISTANCE) * textSection.cameraRailDist,
          0,
          0
        );
        cameraRail.current.position.lerp(targetCameraRailPosition, delta);
        resetCameraRail = false;
      }
    });
    if (resetCameraRail) {
      const targetCameraRailPosition = new THREE.Vector3(0, 0, 0);
      cameraRail.current.position.lerp(targetCameraRailPosition, delta);
    }

    let lerpedScrollOffset = THREE.MathUtils.lerp(
      lastScroll.current,
      scrollOffset,
      delta * friction
    );
    lerpedScrollOffset = Math.min(lerpedScrollOffset, 1);
    lerpedScrollOffset = Math.max(lerpedScrollOffset, 0);

    lastScroll.current = lerpedScrollOffset;
    tl.current.seek(lerpedScrollOffset * tl.current.duration());

    const curPoint = curve.getPoint(lerpedScrollOffset);
    // Obtient le point sur la courbe en fonction du décalage de défilement actuel

    cameraGroup.current.position.lerp(curPoint, delta * 24);
    // Utilise une interpolation linéaire pour déplacer la position de cameraGroup vers curPoint

    const lookAtPoint = curve.getPoint(
      Math.min(lerpedScrollOffset + CURVE_AHEAD_CAMERA, 1)
    );
    // Obtient un point à l'avance sur la courbe en fonction du décalage de défilement actuel

    const currentLookAt = cameraGroup.current.getWorldDirection(
      new THREE.Vector3()
    );
    // Obtient la direction actuelle de la caméra

    const targetLookAt = new THREE.Vector3()
      .subVectors(curPoint, lookAtPoint)
      .normalize();
    // Calcule la direction vers laquelle la caméra devrait regarder (vers lookAtPoint)

    const lookAt = currentLookAt.lerp(targetLookAt, delta * 24);
    // Utilise une interpolation linéaire pour faire en sorte que la caméra regarde dans la direction cible

    cameraGroup.current.lookAt(
      cameraGroup.current.position.clone().add(lookAt)
    );
    // Fait en sorte que la caméra regarde le point actuel tout en prenant en compte la direction cible

    const tangent = curve.getTangent(lerpedScrollOffset + CURVE_AHEAD_AIRPLANE);
    // Obtient le vecteur tangent à la courbe à un point légèrement en avance du décalage actuel

    const nonLerpLookAt = new Group();
    nonLerpLookAt.position.copy(curPoint);
    nonLerpLookAt.lookAt(nonLerpLookAt.position.clone().add(targetLookAt));
    // Crée un groupe temporaire pour calculer la rotation sans interpolation linéaire

    tangent.applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      -nonLerpLookAt.rotation.y
    );
    // Applique une rotation sur le vecteur tangent en fonction de la rotation du regard non interpolée

    let angle = Math.atan2(-tangent.z, tangent.x);
    angle = -Math.PI / 2 + angle;
    // Calcule l'angle en radians basé sur le vecteur tangent pour l'avion

    let angleDegrees = (angle * 180) / Math.PI;
    angleDegrees *= 2.4; // Multiplie l'angle pour le renforcer

    // LIMIT PLANE ANGLE
    if (angleDegrees < 0) {
      angleDegrees = Math.max(angleDegrees, -AIRPLANE_MAX_ANGLE);
    }
    if (angleDegrees > 0) {
      angleDegrees = Math.min(angleDegrees, AIRPLANE_MAX_ANGLE);
    }
    // Limite l'angle de l'avion en fonction des angles max autorisés

    // SET BACK ANGLE
    angle = (angleDegrees * Math.PI) / 180;
    // Convertit l'angle en radians

    const targetAirplaneQuaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        airplane.current.rotation.x,
        airplane.current.rotation.y,
        angle
      )
    );
    // Crée un quaternion pour la rotation de l'avion basé sur l'angle

    airplane.current.quaternion.slerp(targetAirplaneQuaternion, delta * 2);
    // Utilise une interpolation slerp pour faire tourner l'avion progressivement vers le quaternion cible
  });

  const tl = useRef();
  const backgroundColors = useRef({ colorA: "#000000", colorB: "#38CF00" });

  useLayoutEffect(() => {
    tl.current = gsap.timeline();

    tl.current.to(backgroundColors.current, {
      duration: 1,
      colorA: "#000000",
      colorB: "#F1F500",
    });
    tl.current.to(backgroundColors.current, {
      duration: 1,
      colorA: "#000000",
      colorB: "#F59C00",
    });
    tl.current.to(backgroundColors.current, {
      duration: 1,
      colorA: "#000000",
      colorB: "#F54A00",
    });
    tl.current.to(backgroundColors.current, {
      duration: 1,
      colorA: "#000000",
      colorB: "#F51600",
    });
    tl.current.to(backgroundColors.current, {
      duration: 1,
      colorA: "#000000",
      colorB: "#A90000",
    });

    tl.current.pause();
  });

  return (
    <>
      <directionalLight position={[0, 3, 1]} intensity={0.1} />
      {/* <OrbitControls enableZoom={false} /> */}
      <group ref={cameraGroup}>
        <Background backgroundColors={backgroundColors} />
        <group ref={cameraRail}>
          <PerspectiveCamera
            position={[0, 1, 5]}
            rotation={[-0.1, 0, 0]}
            fov={60}
            makeDefault
          />
        </group>
        <group ref={airplane}>
          <Float floatIntensity={1} speed={1.5} rotationIntensity={0.5}>
            <Airplane rotation-y={-Math.PI / 2} position-y={0} />
          </Float>
        </group>
      </group>

      {textSections.map((textSection, index) => (
        <TextSection {...textSection} key={index} />
      ))}

      {/* LINE */}
      <group position-y={-2}>
        <mesh>
          <extrudeGeometry
            args={[
              shape,
              {
                steps: LINE_NB_POINTS,
                bevelEnabled: false,
                extrudePath: curve,
              },
            ]}
          />
          <meshStandardMaterial color={"white"} opacity={1} transparent />
        </mesh>
      </group>

      <SolarSystem
        rotation-y={Math.PI / 2}
        scale={[2, 1, 1]}
        position={[-20, 1, -50]}
      />

      <BlackHole
        rotation-x={Math.PI / 2}
        scale={[2, 1, 1]}
        position={[20, 1, -50]}
      />
    </>
  );
};
