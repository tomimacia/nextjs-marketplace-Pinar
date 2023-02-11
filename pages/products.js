import Layout from "../components/Layout";
import {
  FormControl,
  Image,
  FormLabel,
  Input,
  Button,
  Flex,
  Box,
} from "@chakra-ui/react";
import { firestore } from "../firebase/clientApp";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";

const Products = () => {
  const [products, setProducts] = useState([]);
  const usersCollectionRef = collection(firestore, "Products");
  useEffect(() => {
    const getProducts = async () => {
      const data = await getDocs(usersCollectionRef);
      setProducts(data.docs.map((user) => ({ ...user.data(), id: user.id })));
    };
    getProducts();
  }, []);

  return (
    <Layout hasTransition={true} title="Products">
      <Flex flexWrap="wrap" m={10}>
        {products.map((product) => {
          return (
            <Box
              align="center"
              borderRadius={20}
              bg="white"
              border="1px solid"
              m={3}
              key={product.id}
            >
              <Box fontSize={20} fontFamily="arial" fontWeight="bold">
                Producto: {product.ProductName}
              </Box>
              <br />
              <Box fontSize={17} fontFamily="arial" fontWeight="solid">
                Precio: AR$ {product.ProductPrice}
              </Box>
              <Box borderTop="2px solid" w={250} h={240}>
                <Image flexGrow={1} src={product.ProductImg} />
              </Box>
              <Button
                border={1}
                bg="green.400"
                _hover={{ color: "blue.200" }}
                borderRadius="none"
                size={5}
                fontSize="small"
                onClick={() => {}}
              >
                Agregar a carrito
              </Button>
              <br />
              <Button
                border={1}
                bg="green.400"
                color="red"
                _hover={{ color: "blue.200" }}
                borderRadius="none"
                size={5}
                fontSize="small"
              >
                Eliminar
              </Button>
            </Box>
          );
        })}
      </Flex>
      <FormControl display="flex" flexDir="column" align="center" width="100%">
        <FormLabel ml="25%" width="50%" mt={2} bg="green.300">
          Producto
        </FormLabel>
        <Input
          color="black"
          ml="25%"
          width="50%"
          bg="white"
          placeholder="Titulo del producto"
          type="number"
          onChange={(e) => {
            setNewAge(e.target.value);
          }}
        />
        <Button ml="25%" width="50%" mt={2} onClick={() => {}}>
          Agregar producto
        </Button>
      </FormControl>
    </Layout>
  );
};

export default Products;
