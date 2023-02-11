import { HamburgerIcon } from "@chakra-ui/icons";
import { Box, Flex, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
export const ProductSideBar = ({ loader, children }) => {
  const matches = useMediaQuery("(min-width: 780px)");
  const [show, setShow] = useState(false);

  const variants = {
    open: {
      minW: "60vw",
      transitionDuration:"0.7s",
    },
    close: {
      w: "10vw",
      transitionDuration:"0.7s",
    },
    rotated: {
      rotate: 90,
      color: "#2961EE",
      marginLeft: "150px",
    },
    openNav: {
      display: "flex",
      opacity: 1,
      transitionDuration:"0.1s",
    },
    closeNav: {
      transitionDuration:"0.1s",
      display: "none",
      opacity: 0,
    },
  };
  useEffect(() => {
    if (matches && loader)
      setTimeout(() => {
        setShow(true);
      }, 500);
  }, [loader]);
  const handleClick = () => {
    setShow(!show);
  };

  return (
    <Flex
      as={motion.nav}
      maxW="100vw"
      variants={variants}
      animate={show ? "open" : "close"}
      position="sticky"
      zIndex={10}
      top={0}
      bg="gray.300"
      maxH='501px'      
      flexDir="column"
      flexGrow={1}
      borderRadius='5px'
    >
      <Flex flexGrow={5} flexDir="column">
        <Flex
          _hover={[
            {bg:"none"},
            {bg:"none"},
            {bg:"none"},
            { bg: "blue.300", borderRadius: "5px" },
          ]}
          align="center"
          h="60px"
          cursor="pointer"
          maxW='200px'
          onClick={handleClick}
          borderBottom="1px solid #7D7D7D"
        >
          <Flex w="100%" align="center">
            <Text
              as={motion.h2}
              animate={show ? "open" : "closed"}
              display={show ? "flex" : "none"}
              justify="center"
              w='100%'
              fontWeight="medium"
            >
              Filtrar por
            </Text>
            <Flex w="20%" m='auto' justify={show ? "flex-end" : "center"}>
              <Box
                as={motion.div}
                variants={variants}
                animate={show ? "rotated" : "none"}                
              >
                <HamburgerIcon fontSize={20} />
              </Box>
            </Flex>
          </Flex>
        </Flex>
        <Flex
          as={motion.div}
          variants={variants}
          animate={show ? "openNav" : "closeNav"}
          flexGrow={5}
          flexDir="column"          
        >
          {children}         
        </Flex>
        
      </Flex>
    </Flex>
  );
};
