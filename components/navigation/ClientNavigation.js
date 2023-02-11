import { ChevronDownIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useToast,
} from "@chakra-ui/react";
import { doc, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import Link from "next/link";
import { useContext, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { AiOutlineUser } from "react-icons/Ai";
import { BeatLoader } from "react-spinners";
import { useSetRecoilState } from "recoil";
import { context } from "../../contexts/userContext";
import { auth, firestore } from "../../firebase/clientApp";
import {
  defaultProfile,
  dogsAvatars,
  profileAvatars,
} from "../../src/images/avatars/avatars";
import { modState } from "../atoms/modalatom";
import ModalTest from "../Modal/modalLog";
import { ProfileImage } from "./ProfileImage";

export const ClientNavigation = () => {
  const ctx = useContext(context);
  const toast = useToast();
  const [user, loading, error] = useAuthState(auth);
  const allAvatars = [...profileAvatars, ...dogsAvatars];
  const setAuthModelState = useSetRecoilState(modState);
  const [show, setShow] = useState(false);
  const [loadingImg, setLoadingImg] = useState(false);

  const handleImg = async (prop) => {
    if (user) {
      setLoadingImg(true);
      await updateDoc(doc(firestore, "users", user.uid), {
        Img: prop,
      });
      setLoadingImg(false);
      setShow(false);
      window.location.reload();
      toast({
        title: `Avatar actualizado correctamente`,
        status: "success",
        isClosable: true,
      });
    } else {
      toast({
        title: `Inicia sesion`,
        status: "error",
        isClosable: true,
      });
    }
  };

  const variants = {
    open: {
      left: 0,
      transitionDuration: "0.2s",
      display: "flex",
    },
    close: {
      left: "300vw",
      display: "none",
      transitionDuration: "0.2s",
    },
  };
  return (
    <Flex width={["100%", "100%", "90%", "400px"]}>
      <Box
        as={motion.div}
        zIndex={100}
        variants={variants}
        display="none"
        animate={show ? "open" : "close"}
        minH="100%"
        minW="100%"
        left={0}
        top={0}
        pos="absolute"
        bg="gray.400"
      >
        <Flex w="100%" flexDir="column">
          <Heading m={10} align="center">
            Selecciona tu Avatar
          </Heading>
          <Flex p={2} bg="gray.300" minW="100%">
            <Flex
              boxShadow="0 10px 10px"
              borderRadius="20px"
              m="0 auto"
              maxW="850px"
              bg="gray.200"
              align="center"
              flexDir="column"
            >
              <Flex justify="flex-end" width="100%">
                <IconButton
                  onClick={() => setShow(false)}
                  mt={2}
                  mr={2}
                  size="sm"
                  icon={<CloseIcon />}
                  color="blackAlpha.700"
                  bg="blackAlpha.300"
                />
              </Flex>
              {loadingImg ? (
                <Flex mt={10} justify="center">
                  <BeatLoader color="#68EBBB" />
                </Flex>
              ) : null}
              <Flex
                justifyContent="center"
                p={3}
                w={["100%", "95%", "90%", "85%"]}
                flexWrap="wrap"
              >
                {allAvatars.map((ph, i) => {
                  return (
                    <Flex m={2} key={"P" + i + 1}>
                      <Image
                        cursor="pointer"
                        onClick={() => handleImg(ph)}
                        _hover={{ opacity: "0.8" }}
                        h="70px"
                        borderRadius="50%"
                        src={ph}
                      />
                    </Flex>
                  );
                })}
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Box>
      <Button
        size={["md", "sm", "sm", "sm"]}
        mr={["10px", "10px", "20px", "20px"]}
        display={user ? "none" : ["none", "flex", "flex", "flex"]}
        flexGrow={1}
        onClick={() => setAuthModelState({ open: true, view: "signup" })}
      >
        Registrate
      </Button>
      <ModalTest />

      <Button
        size="sm"
        mr={["10px", "10px", "20px", "20px"]}
        bg={user ? "teal.400" : null}
        _hover={user ? { bg: "teal.300" } : null}
        flexGrow={1}
        onClick={
          user ? null : () => setAuthModelState({ open: true, view: "login" })
        }
      >
        {user ? <Image mr="10%" src="" /> : null}
        {user
          ? `Hola ${user.displayName != null ? user.displayName : ""}!`
          : "Ingresá"}
      </Button>

      {user && !loading && (
        <Menu>
          <MenuButton
            size="sm"
            width={["69px", "60px", "60px", "60px"]}
            borderRadius="50%"
            as={Button}
            rightIcon={<ChevronDownIcon />}
          >
            {
              <Icon
                as={AiOutlineUser}
                cursor="pointer"
                _hover={{ color: "blackAlpha.400" }}
                fontSize={25}
              />
            }
          </MenuButton>
          <MenuList zIndex={15}>
            <MenuItem minH="48px">
              <ProfileImage
                showFunction={() => setShow(true)}
                img={ctx.Img}
                user={user}
                userPhoto={user.photoURL}
                defaultProf={defaultProfile}
              />
              <Flex flexDir="column">
                <span>Mi Usuario</span>
                <Text fontSize={13}>{user ? user.email : null}</Text>
              </Flex>
            </MenuItem>
            <Link href="/clientPages/miCuenta">
              <MenuItem _hover={{ bg: "blue.200", borderRadius: "10px" }}>
                Mi Cuenta
              </MenuItem>
            </Link>
            <Link href="/clientPages/configuracion">
              <MenuItem _hover={{ bg: "blue.200", borderRadius: "10px" }}>
                Ajustes
              </MenuItem>
            </Link>
            <Link href={`/clientPages/favoritos?cd=${user ? user.uid : "noUser"}`}>
              <MenuItem _hover={{ bg: "blue.200", borderRadius: "10px" }}>
                Favoritos
              </MenuItem>
            </Link>
            <Link href="/clientPages/misCompras">
              <MenuItem _hover={{ bg: "blue.200", borderRadius: "10px" }}>
                Mis Compras
              </MenuItem>
            </Link>
            <Link href="/ayuda">
              <MenuItem _hover={{ bg: "blue.200", borderRadius: "10px" }}>
                Ayuda
              </MenuItem>
            </Link>
            {ctx.isSeller && (
              <Flex flexDir='column'>
                <Link href={`/productPages/vendedores/${user.uid}`}>
                  <MenuItem
                    borderRadius="10px"
                    _hover={{ bg: "blue.200", borderRadius: "10px" }}
                    fontWeight="bold"
                    bg="blue.500"
                  >
                    Perfil del vendedor
                  </MenuItem>
                </Link>
                <Link href="/clientPages/admin/addProducts">
                  <MenuItem
                    borderRadius="10px"
                    _hover={{ bg: "blue.200", borderRadius: "10px" }}
                    fontWeight="bold"
                    bg="blue.500"
                  >
                    Agregar Productos
                  </MenuItem>
                </Link>
              </Flex>
            )}
            {ctx.isAdmin && (
              <Link href="/clientPages/admin/createAdmin">
                <MenuItem
                  borderRadius="10px"
                  _hover={{ bg: "blue.200", borderRadius: "10px" }}
                  fontWeight="bold"
                  bg="blue.500"
                >
                  Admin
                </MenuItem>
              </Link>
            )}
            <MenuItem
              _hover={{ bg: "blue.200", borderRadius: "10px" }}
              onClick={() => {
                setAuthModelState({
                  open: true,
                  view: user ? "logout" : "login",
                });
                !user
                  ? toast({
                      title: `No has iniciado sesion`,
                      status: "error",
                      isClosable: true,
                    })
                  : "";
              }}
            >
              Cerrar Sesion
            </MenuItem>
          </MenuList>
        </Menu>
      )}
    </Flex>
  );
};
