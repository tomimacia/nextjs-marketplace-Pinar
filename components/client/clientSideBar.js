import { HamburgerIcon } from "@chakra-ui/icons";
import { Divider, Box, Flex, Icon, Text, useToast } from "@chakra-ui/react";

import { useAuthState } from "react-firebase-hooks/auth";
import {
  FaBell,
  FaHeadset,
  FaHeart,
  FaPowerOff,
  FaUserAlt,
  FaWallet,
} from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { useSetRecoilState } from "recoil";
import { auth } from "../../firebase/clientApp";
import { SideBarItem } from "./sideBarItem";
import { modState } from "../atoms/modalatom";
import { useRouter } from "next/router";
import { useState } from "react";
import { motion } from "framer-motion";

const ClientSideBar = () => {
  const [customDisplay, setCustomDisplay] = useState("none");
  const handleClick = () => {
    setCustomDisplay(customDisplay === "none" ? "flex" : "none");
  };

  const toast = useToast();
  const [user, loading, error] = useAuthState(auth);
  const routeBg = "blue.300";
  const setAuthModelState = useSetRecoilState(modState);
  const route = useRouter().route;
  return (
    <Flex
      as={motion.div}
      maxW="100vw"
      animate={customDisplay === "none" ? { width: 10 } : { width: "60vw" }}
      position="sticky"
      zIndex={10}
      top={0}      
      bg="gray.300"
      h="60vh"      
      maxH="60vh"
      flexDir="column"
      flexGrow={1}
    >
      <Flex flexGrow={5} flexDir="column">
        <Flex
          _hover={{ bg: "blue.300", borderRadius: "5px" }}
          align="center"
          flexGrow={1}
          cursor="pointer"
          onClick={handleClick}
        >
          <Flex ml={2} w="100%" align="center">
            <Text display={customDisplay}>
              {user ? user.displayName : "Usuario"}
            </Text>
            <Flex
              w="100%"
              justify={customDisplay === "none" ? "flex-start" : "flex-end"}
            >
              <Box as={motion.div} whileHover={{}} animate={customDisplay === "none" ? "none" : {rotate:90, color:'#2961EE'}}>
                <HamburgerIcon mr={2} fontSize={20} />
              </Box>
            </Flex>
          </Flex>
        </Flex>
        <SideBarItem
          bgProp={route === "/clientPages/miCuenta" ? routeBg : "none"}
          icon={FaUserAlt}
          href="/clientPages/miCuenta"
        >
          <Text display={customDisplay} cursor="pointer" w="100%">
            Mi cuenta
          </Text>
        </SideBarItem>
        <SideBarItem
          bgProp={route === "/clientPages/misCompras" ? routeBg : "none"}
          icon={FaWallet}
          href="/clientPages/misCompras"
        >
          <Text display={customDisplay} cursor="pointer">
            Mis compras
          </Text>
        </SideBarItem>
        <SideBarItem
          bgProp={route === "/clientPages/favoritos" ? routeBg : "none"}
          icon={FaHeart}
          href={`/clientPages/favoritos?cd=${user ? user.uid : "noUser"}`}
        >
          <Text mr="20vw" display={customDisplay} cursor="pointer">
            Favoritos
          </Text>
        </SideBarItem>
      </Flex>
      <Divider mb="10%" />
      <Flex flexGrow={5} flexDir="column">
        <SideBarItem
          bgProp={route === "/clientPages/notificaciones" ? routeBg : "none"}
          icon={FaBell}
          href="/clientPages/notificaciones"
        >
          <Text display={customDisplay} cursor="pointer">
            Notificaciones
          </Text>
        </SideBarItem>
        <SideBarItem
          bgProp={route === "/clientPages/configuracion" ? routeBg : "none"}
          icon={FiSettings}
          href="/clientPages/configuracion"
        >
          <Text display={customDisplay} cursor="pointer">
            Configuracion
          </Text>
        </SideBarItem>

        <SideBarItem href="/ayuda" icon={FaHeadset}>
          <Text display={customDisplay} cursor="pointer">
            Ayuda
          </Text>
        </SideBarItem>

        <Flex
          _hover={{ bg: "blue.300", borderRadius: "5px" }}
          align="center"
          flexGrow={1}
          cursor="pointer"
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
          <Flex ml={3} align="center" width="100%">
            <Icon as={FaPowerOff} mr={2} />
            <Text display={customDisplay}>Cerrar Sesion</Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ClientSideBar;
