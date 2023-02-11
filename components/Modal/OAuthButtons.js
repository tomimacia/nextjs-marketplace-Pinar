import { Button, Flex, Image, Text } from "@chakra-ui/react";

import React, { useState } from "react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";
import { auth } from "../../firebase/clientApp";
import { modState } from "../atoms/modalatom";

const OAuthButtons = () => {
  const setAuthModelState = useSetRecoilState(modState);
  const [handleError, setError] = useState("");

  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
  if (error) {
    setError(error);
  }

  const signUpWithGoogle = async () => {
    signInWithGoogle();
    setAuthModelState((prev) => ({
      ...prev,
      open: false,
    }));
  };
  return (
    <Flex direction="column" w="100%" mb={4}>
      <Button
        w="100%"
        h="34px"
        mb={2}
        borderColor="gray.300"
        color="black"
        _hover={{ bg: "gray.300" }}
        border="1px solid"
        borderRadius="60px"
        fontSize="10pt"
        fontWeight="700"
        _focus={{ boxShadow: "none" }}
        isLoading={loading}
        onClick={() => {
          signUpWithGoogle();
        }}
      >
        <Image
          mr={[3,4,5,5]}
          h={["15px", "17px", "20px", "20px"]}          
          src="https://img2.freepng.es/20180324/iww/kisspng-google-logo-g-suite-google-5ab6f1cee66464.5739288415219388949437.jpg"
        />
        <Text fontSize={['xs','sm','sm','md']}>Continuar con Google</Text>
      </Button>

      {handleError && <Text color="red">{handleError}</Text>}
    </Flex>
  );
};

export default OAuthButtons;
