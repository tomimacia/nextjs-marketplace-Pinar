import { Flex, Text } from "@chakra-ui/react";

export const ProductSideBarItem = ({ title, children }) => {
  return (
    <Flex borderRight="1px solid #A3A3A3" flexDir="column" w="100%" align="center">
      <Flex
        bg="gray.300"
        pl="5%"
        align="center"
        width="100%"        
      >
        <Text  fontSize="md" fontWeight="medium">
          {title}
        </Text>
      </Flex>
      <Flex
        borderBottom="1px solid #7D7D7D"
        pb='30px'
        pt="15px"
        pl="5%"
        width="100%"
        
        bg="White"
      >
        {children}
      </Flex>
    </Flex>
  );
};
