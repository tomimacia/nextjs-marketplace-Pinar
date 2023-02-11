import { Flex, Text, Input, Button } from "@chakra-ui/react";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { modState } from "../atoms/modalatom";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/clientApp";
import { FIREBASE_ERRORS } from "../../firebase/errors"
const Login = () => {
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const setAuthModelState = useSetRecoilState(modState);
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

  const onSubmit = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(loginForm.email, loginForm.password);
  };
  
  const onChange = (e) => {
    setLoginForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  return (
    <form onSubmit={onSubmit}>
      <Input
        required
        name="email"
        placeholder="Email"
        type="email"
        mb={2}
        onChange={onChange}
        fontSize="10pt"
        _placeholder={{ color: "gray.500" }}
        _hover={{
          bg: "white",
          border: "1px solid",
          borderColor: "gray.500",
        }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "gray.500",
        }}
        bg="gray.50"
      />
      <Input
        required
        name="password"
        placeholder="Contraseña"
        type="password"
        onChange={onChange}
        mb={2}
        fontSize="10pt"
        _placeholder={{ color: "gray.500" }}
        _hover={{
          bg: "white",
          border: "1px solid",
          borderColor: "gray.500",
        }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "gray.500",
        }}
        bg="gray.50"
      />
      <Text textAlign='center' color='red' fontSize='10pt'>{FIREBASE_ERRORS[error?.message]}</Text>
      <Button
        type="submit"
        w="100%"
        h="36px"
        mt={2}
        mb={2}
        bg="blue.500"
        color="white"
        _hover={{ bg: "blue.400" }}
        border="1px solid"
        borderRadius="60px"
        fontSize="10pt"
        fontWeight="700"
        _focus={{ boxShadow: "none" }}
        isLoading={loading}
      >
        Log in
      </Button>
      <Flex fontSize="9pt" justifyContent="center">
        <Text mr={1}>Eres nuevo?</Text>
        <Text
          color="blue.500"
          fontWeight="700"
          cursor="pointer"
          onClick={() => {
            setAuthModelState((prev) => ({ ...prev, view: "signup" }));
          }}
        >
          REGISTRATE
        </Text>
      </Flex>
    </form>
  );
};

export default Login;
