import { Button, Flex, Heading, Input, Text } from "@chakra-ui/react";
import Layout from "../../../components/Layout";
const createAdmin = () => {
  
  const adminRoute = '/'
  return (
    <Layout title="Admin">
      <Flex m={10} flexDir="column">
        <Heading size="lg" align="center" mb={10}>
          Crear nuevo Admin
        </Heading>
        <Flex bgGradient="radial(blackAlpha.400, blackAlpha.200)" borderRadius="20px" border='3px solid black' p={5} w='80%' flexDir="column" justify="justify">
          <Text size="lg">
            Ingresa el Id o Email del nuevo admin
          </Text>
          <Flex mt={5} width='50%' flexDir='column'>
            <Input mb={5} type="text"></Input>
            <Button w='50%' size='md'>Agregar Admin</Button>
          </Flex>
        </Flex>
      </Flex>
      <Flex m={10} flexDir="column">
        <Heading size="lg" align="center" mb={10}>
          Eliminar admin
        </Heading>
        <Flex bgGradient="radial(blackAlpha.400, blackAlpha.200)" borderRadius="20px" border='3px solid black' p={5} w='80%' flexDir="column" justify="justify">
          <Text size="lg">
            Ingresa el Id o Email del admin para eliminar
          </Text>
          <Flex mt={5} width='50%' flexDir='column'>
            <Input mb={5} type="text"></Input>
            <Button w='50%' size='md'>Eliminar Admin</Button>
          </Flex>
        </Flex>
      </Flex>
    </Layout>
  );
};

export default createAdmin;
