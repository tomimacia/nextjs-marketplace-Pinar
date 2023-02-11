import { Flex, Text } from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";

export const ProductPrice = ({ precio, descuento, fontSizeProp }) => {
  return (
    <Flex flexDir="column" mb="5%">
      {descuento ? (
        <Flex flexDir="column">
          <Flex flexDir="column">
            <Text
              fontSize={fontSizeProp}
              color="red.300"
              textDecoration="line-through"
              lineHeight="15px"
              pl="15px"
            >
              $ {precio}
            </Text>
            <Text lineHeight="10px" fontSize={fontSizeProp} color="green.500">
              <ArrowForwardIcon /> $
              {Math.round(precio * (1 - descuento * 0.01))}
            </Text>
          </Flex>
          <Flex flexDir="column">
            <Text fontSize={fontSizeProp}>{descuento}% Off!</Text>
          </Flex>
        </Flex>
      ) : (
        <Text fontSize={[13, 14, 15, 16]}>$ {precio}</Text>
      )}
    </Flex>
  );
};
