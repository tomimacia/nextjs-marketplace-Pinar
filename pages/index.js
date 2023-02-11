import { Box, Button, Text, Flex, Image, useColorMode } from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import Layout from "../components/Layout";
import { auth } from "../firebase/clientApp";
import { profileAvatars, dogsAvatars } from "../src/images/avatars/avatars";
const Index = () => {
  const [user, loading, error] = useAuthState(auth);
  const { colorMode } = useColorMode();

  return (
    <Layout hasTransition={true} mainTitle="Home" title="Marketplace El Pinar">
      <Box>
        <Image
          display={colorMode === "light" ? "flex" : "none"}
          ml={3}
          width={200}
          src="https://elpinar.edu.mx/wp-content/uploads/2020/03/LogoElPinar-e1583287195672.png"
        ></Image>
        <Image
          display={colorMode === "light" ? "none" : "flex"}
          ml={3}
          width={200}
          src="https://elpinar.edu.mx/wp-content/uploads/2020/03/LogoElPinar_blanco.png"
        ></Image>
        
      </Box>
    </Layout>
  );
};

export default Index;
