import { Text } from "@react-three/drei";

export const TextSection = ({ title, subtitle, ...props }) => {
  return (
    <group {...props}>
      {!!title && (
        <Text
          color="white"
          anchorX={"left"}
          anchorY="bottom"
          fontSize={0.52}
          maxWidth={2.5}
          lineHeight={1}
          font={"./fonts/Poppins-ExtraBold.ttf"}
        >
          {title}
        </Text>
      )}

      <Text
        color="white"
        anchorX={"left"}
        anchorY="top"
        fontSize={0.2}
        maxWidth={3}
        font={"./fonts/Poppins-black.ttf"}
      >
        {subtitle}
      </Text>
    </group>
  );
};
