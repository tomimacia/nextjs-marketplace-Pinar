import { Box, Flex, Heading } from "@chakra-ui/react";
import { motion } from "framer-motion";
import Head from "next/head";
import formBackground from "../items/formBackgrond";
import Footer from "./navigation/footer";
import Navigation from "./navigation/Navigation";


const Layout = (props) => {
  const bgColors = [
    "linear(to-b, blue.300, blue.100)",
    "linear(to-b, gray.700, gray.600)",
  ];
  const [a, b] = bgColors;
    

  return (
    <Box
      pos="relative"
      maxW="100%"
      w="100%"
      minH="100vh"
      maxH="100%"
      h="100%"
      pb="4rem"      
      bgGradient={formBackground(a, b)}
    >
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>El Pinar | {props.hiddenTitle || props.title}</title>
      </Head>
      <Navigation carro={props.cartIndex} />
      <Flex pt={0} flexDir="column">
        <Heading
          animate={{
            textAlign: "center",
            fontSize: "50px",
          }}
          flexGrow={1}
          as={motion.h1}
          color="#06137A"
          textDecoration="underline"
          pl={5}
          pt={10}
          align="center"
        >
          {props.mainTitle}
        </Heading>
      </Flex>
      {props.hasTransition && (
        <Box
          as={motion.div}
          transitionDuration={"0.5s"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          pb="5rem"
        >
          {props.children}
        </Box>
      )}
      {!props.hasTransition && <Box>{props.children}</Box>}
      <Footer />
    </Box>
  );
};

export default Layout;
