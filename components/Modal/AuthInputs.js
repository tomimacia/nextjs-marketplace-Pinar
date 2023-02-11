import React from "react";
import { Flex } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { modState } from "../atoms/modalatom";
import Login from "./Login";
import SignUp from "./SignUp";

const AuthInputs = () => {
  const modalState = useRecoilValue(modState);

  return (
    <Flex>
      {modalState.view === "login" && <Login />}
      {modalState.view === "signup" && <SignUp />}
    </Flex>
  );
};

export default AuthInputs;
