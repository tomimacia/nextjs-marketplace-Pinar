import { Box, Image } from "@chakra-ui/react";

export const ProfileImage = ({
  showFunction,
  img,
  user,
  userPhoto,
  defaultProf,
}) => {
  return (
    <Box>
      {img ? (
        <Image
          boxSize="4rem"
          borderRadius="full"
          onClick={showFunction}
          src={img}
          mr="12px"
          _hover={{ opacity: "0.8" }}
        />
      ) : <Image
      boxSize="4rem"
      borderRadius="full"
      onClick={showFunction}
      src={user && userPhoto ? userPhoto : defaultProf}
      mr="12px"
      _hover={{ opacity: "0.8" }}
    />}
    </Box>
  );
};
