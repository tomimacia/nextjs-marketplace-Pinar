import { Box, Flex, Heading } from "@chakra-ui/react";
import ClientSideBar from "./ClientSideBar";
import { motion } from "framer-motion";
import Layout from "../Layout";

export const FormatClient = ({ children, title, cartIndex }) => {
  return (
    <Layout hiddenTitle={title} cartIndex={cartIndex}>
      <Flex
        align="center"
        justify="center"
        h={["3vh", "4vh", "5vh", "6vh"]}
        bgGradient="linear(to-t, teal.400, teal.300)"
      >
        <Heading>Publicidad</Heading>
      </Flex>
      <Flex gap={[1, 2, 2, 2]}>
        <Flex w="45px" minW="35px">
          <ClientSideBar />
        </Flex>

        <Flex left="0vw" w="90vw" minH="80%">
          <Box minH="80%" minW="80%" w="100%" h="100%" bg="gray.200">
            <Box pt={1} pr={[1, 3, 5, 7]} pl={[1, 3, 5, 7]}>
              <Box p={5} border="1px solid black" borderRadius="15px">
                <Heading
                  as={motion.h1}
                  initial={{ x: "120vw" }}
                  animate={{ x: 0 }}
                  size={["xs", "xs", "sm", "sm"]}
                >
                  {title}
                </Heading>
              </Box>

              <Box
                mt={[2, 4, 7, 10]}
                minH="30vh"
                p={2}
                border="1px solid black"
                borderRadius="15px"
              >
                {children}
              </Box>
            </Box>
          </Box>
        </Flex>
        <Flex w="5vw" bgGradient="linear(to-r, teal.400, teal.300)"></Flex>
      </Flex>
      <Flex bg="white" h="10vh"></Flex>
    </Layout>
  );
};
