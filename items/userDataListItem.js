import { Button, Flex, Input,Box, Select, Text } from "@chakra-ui/react";
import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../firebase/clientApp";
import { useToast } from "@chakra-ui/react";
export const UserDataListItem = ({
  isEmail,
  title,
  children,
  onClickBlur,
  blurProp,
  inputType,
  userProp,
}) => {
  const [user, loading, error] = useAuthState(auth);
  const [displayProp, setDisplayProp] = useState(false);
  const [inputValue, setInputValue] = useState();
  const [inputLocalidad, setInputLocalidad] = useState();
  const [inputCP, setInputCP] = useState();
  const [isValid, setIsValid] = useState(false);
  const toast = useToast();

  const format = /[0-9`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

  const onClickAceptar = async (prop) => {
    if (isValid && userProp !== "direccion") {
      await updateDoc(doc(firestore, "users", user.uid), {
        [`${prop}`]: inputValue,
      });
      toast({
        title: `Actualizado correctamente`,
        status: "success",
        isClosable: true,
      });
      window.location.reload();
    } else if (isValid && userProp === "direccion") {
      await updateDoc(doc(firestore, "users", user.uid), {
        ["direccion.codigoPostal"]: inputCP,
        ["direccion.direccion"]: inputValue,
        ["direccion.localidad"]: inputLocalidad,
      });
      toast({
        title: `Actualizado correctamente`,
        status: "success",
        isClosable: true,
      });
      window.location.reload();
    } else {
      toast({
        title: `Ingresa correctamente los datos`,
        status: "error",
        isClosable: true,
      });
    }
  };
  // validaciones de inputs
  useEffect(() => {
    if (userProp === "nombre" || userProp === "apellido") {
      !format.test(inputValue) ? setIsValid(true) : setIsValid(false);
    }
    if (userProp === "pais") {
      inputValue !== undefined ? setIsValid(true) : setIsValid(false);
    }
    if (userProp === "telefono") {
      inputValue !== undefined ? setIsValid(true) : setIsValid(false);
    }
    if (userProp === "fechaDeNacimiento") {
      inputValue !== new Date() ? setIsValid(true) : setIsValid(false);
    }
    if (userProp === "dni") {
      inputValue > 500000 && inputValue < 100000000
        ? setIsValid(true)
        : setIsValid(false);
    }
    if (userProp === "direccion") {
      if (
        inputValue !== undefined &&
        inputValue.length > 1 &&
        inputLocalidad !== undefined &&
        inputLocalidad.length > 1 &&
        inputCP !== undefined &&
        inputCP.length > 1
      ) {
        setIsValid(true);
      } else {
        setIsValid(false);
      }
    }
  }, [inputValue, inputLocalidad, inputCP]);
  return (
    <Flex
      flexDir={["column", "row", "row", "row"]}
      p={1}
      borderRadius="10px"
      border="1px solid black"
      mb={5}
      align={["justify", "justify", "center", "center"]}
      width="100%"
      justify="space-between"
      filter="auto"
      blur={!displayProp && !blurProp ? "4px" : "0px"}
      brightness={!displayProp && !blurProp ? "60%" : "none"}
    >
      <Flex
        flexDir={isEmail ? ["column", "row", "row", "row"] : "flex"}
        w="100%"
      >
        <Flex flexWrap="wrap" w="50%">
          <Text flexGrow={1} fontSize={["xs", "xs", "md", "md"]}>
            {title}
          </Text>
        </Flex>
        <Flex w="50%">
          <Box
            display={!displayProp ? "flex" : "none"}
            flexGrow={1}
            fontSize={["xs", "xs", "md", "md"]}
            width="100%"
          >
            {children}
          </Box>
          {userProp !== "direccion" && userProp !== "pais" ? (
            <Input
              display={displayProp ? "flex" : "none"}
              borderColor="blackAlpha.500"
              onChange={(e) => setInputValue(e.target.value)}
              bg="white"
              color="black"
              size={["xs", "xs", "sm", "sm"]}
              type={inputType}
            />
          ) : userProp !== "direccion" ? (
            <Select
              name="pais"
              size={["xs", "xs", "sm", "sm"]}
              onChange={(e) => setInputValue(e.target.value)}
              display={displayProp ? "flex" : "none"}
              placeholder="Seleccionar pais"
            >
              <option>Argentina</option>
              <option>Uruguay</option>
              <option>Paraguay</option>
              <option>Chile</option>
              <option>Bolivia</option>
              <option>Brasil</option>
              <option>Peru</option>
              <option>Colombia</option>
            </Select>
          ) : (
            <Flex w={displayProp ? "90%" : "0"} flexDir="column">
              <Input
                display={displayProp ? "flex" : "none"}
                borderColor="blackAlpha.500"
                onChange={(e) => setInputValue(e.target.value)}
                bg="white"
                color="black"
                size="xs"
                type={inputType}
              />
              <Input
                mt={1}
                mb={1}
                display={displayProp ? "flex" : "none"}
                borderColor="blackAlpha.500"
                onChange={(e) => setInputLocalidad(e.target.value)}
                bg="white"
                color="black"
                size="xs"
                type={inputType}
              />
              <Input
                display={displayProp ? "flex" : "none"}
                borderColor="blackAlpha.500"
                onChange={(e) => setInputCP(e.target.value)}
                bg="white"
                color="black"
                size="xs"
                type={inputType}
              />
            </Flex>
          )}
        </Flex>
      </Flex>
      <Flex justify="flex-end">
        {!isEmail && (
          <Flex>
            {displayProp && (
              <Flex ml={1} flexDir={["column", "column", "row", "row"]}>
                <Flex>
                  <Button
                    w="100%"
                    size={["xs", "xs", "xs", "sm"]}
                    boxShadow="0 1px 1px"
                    bg="gray.400"
                    _hover={{ bg: "gray.300" }}
                    onClick={() => onClickAceptar(userProp)}
                    mb={1}
                  >
                    Aceptar
                  </Button>
                </Flex>
                <Flex onClick={onClickBlur}>
                  <Button
                    ml={[0,0,1,1]}
                    w="100%"
                    size={["xs", "xs", "xs", "sm"]}
                    boxShadow="0 1px 1px"
                    bg="gray.400"
                    _hover={{ bg: "gray.300" }}
                    onClick={() => {
                      setDisplayProp(false);
                    }}
                  >
                    Cancelar
                  </Button>
                </Flex>
              </Flex>
            )}
            {!displayProp && (
              <Flex onClick={blurProp ? onClickBlur : null}>
                <Button                                    
                  size={["xs", "xs", "sm", "sm"]}
                  boxShadow="0 1px 1px"
                  bg="gray.400"
                  _hover={blurProp ? { bg: "gray.300" } : {bg:"none"}}
                  onClick={blurProp ? () => setDisplayProp(true) : null}
                >
                  Modificar
                </Button>
              </Flex>
            )}
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};
