import { Input, Button } from "@chakra-ui/react";
import { useState } from "react";


const ResetPassword = () => {
  const [loginForm, setLoginForm] = useState();
  const onSubmit = () => {};

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
      >
        Registrate
      </Button>
      
    </form>
  );
};

export default ResetPassword;
