import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import FormatBlank from "../components/FormatBlank";
import { firestore } from "../firebase/clientApp";
import { BeatLoader } from "react-spinners";

const Carrito = () => {
  const [products, setProducts] = useState([]);
  const [cartList, setCartList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dataLoaded = useRef(false);

  useEffect(() => {
    if (cartList.length > 0 && !dataLoaded.current) {
      setIsLoading(true);
      const getProducts = async () => {
        const idUnicos = cartList.filter((p, ind, prods) => {
          return ind === prods.indexOf(p);
        });
        let data = [];
        idUnicos.map((elem) => {
          async function fetchMyProduct() {
            const document = await getDoc(doc(firestore, "Productos", elem));
            data = [...data, { ...document.data(), id: document.id }];
            if (data.length === idUnicos.length) {
              setProducts(data);
              setIsLoading(false);
            }
          }
          fetchMyProduct();
        });
      };
      getProducts();
      dataLoaded.current = true;
    }
  }, [cartList]);

  useEffect(() => {
    const data = localStorage.getItem("CART_CONTEXT_STORAGE");
    if (data) {
      setCartList(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("CART_CONTEXT_STORAGE", JSON.stringify(cartList));
  });
  const borrarCarro = () => {
    if (cartList.length > 0) {
      setCartList([]);
    }
  };
  function eliminarProducto(prop) {
    setCartList(cartList.filter((prod) => prod !== prop));
  }
  function menosUnProducto(prop) {
    let indice = cartList.indexOf(prop);
    let arr = cartList;
    arr.splice(indice, 1);
    setCartList([...arr]);
  }
  function masUnProducto(prop) {
    setCartList([...cartList, prop]);
  }
  const cantTotal = products.reduce((acc, p) => {
    acc =
      acc +
      p.Precio *
        (p.Descuento ? 1 - p.Descuento * 0.01 : 1) *
        cartList.reduce((acc, prod) => {
          return prod === p.id ? acc + 1 : acc;
        }, 0);
    return acc;
  }, 0);  
  return (
    <FormatBlank size="lg" cartIndex={cartList.length} title="Carrito">
      <Flex minH="60vh">
        <Flex flexGrow={1}></Flex>
        <Flex
          flexGrow={10}
          border="2px solid black"
          flexDir="column"
          bg="gray.200"
          p={3}
          borderRadius="10px"
        >
          <Box p={[2, 3, 4, 5]} borderBottom="1px solid black">
            <Heading size={["md", "md", "xl", "xl"]}>Tus productos</Heading>
          </Box>
          {cartList.length > 0 ? (
            isLoading ? (
              <Flex mt={10} justify="center">
                <BeatLoader color="#68EBBB" />
              </Flex>
            ) : (
              products.map((product, i) => {
                let cantidad = 0;
                if (cartList.includes(product.id)) {
                  cartList.reduce((acc, elem) => {
                    return (cantidad = elem === product.id ? acc + 1 : acc);
                  }, 0);

                  return (
                    <Flex
                      as={motion.div}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transitionDuration={"0.2s"}
                      transitionDelay={`${i * 0.2}s`}
                      key={product.id}
                      border="1px solid black"
                      borderRadius="5px"
                      p={1}
                      mt={2}
                    >
                      <Flex w="100%" borderRadius="5px" bg="white">
                        <Flex
                          w={["80px", "120px", "160px", "160px"]}
                          minW={["80px", "120px", "160px", "160px"]}
                          h={["120px", "120px", "160px", "160px"]}
                          ml={["10px", "20px", "35px", "40px"]}
                          mr={["10px", "20px", "35px", "40px"]}
                        >
                          <Image
                            border={[
                              "none",
                              "1px solid black",
                              "1px solid black",
                              "1px solid black",
                            ]}
                            boxSize={["100px", "120px", "160px", "160px"]}
                            objectFit="cover"
                            borderRadius="5px"
                            src={product.Img}
                          />
                        </Flex>
                        <Flex flexGrow={1} flexDir="column">
                          <Flex align="center" flexGrow={7}>
                            <Flex flexGrow={2}>
                              <Text fontSize={17} fontWeight="bold">
                                {product.Nombre}
                              </Text>
                            </Flex>
                            <Flex flexGrow={1}>
                              <Button
                                bg="blue.300"
                                size={["xs", "sm", "md", "md"]}
                                onClick={() => menosUnProducto(product.id)}
                              >
                                -
                              </Button>
                              <Text
                                ml={3}
                                mr={3}
                                w="40px"
                                align="center"
                                border="1px solid black"
                                fontSize={22}
                              >
                                {cantidad}
                              </Text>
                              <Button
                                bg="blue.300"
                                size={["xs", "sm", "md", "md"]}
                                onClick={() => masUnProducto(product.id)}
                              >
                                +
                              </Button>
                            </Flex>
                          </Flex>
                          {product.Descuento ? (
                            <Flex flexGrow={3} flexDir="column">
                              <Flex flexGrow={2} flexDir="column">
                                <Text
                                  fontSize={[10, 12, 15, 15]}
                                  color="red.300"
                                  textDecoration="line-through"
                                >
                                  $ {product.Precio}
                                </Text>
                                <Flex>
                                  <Text
                                    fontSize={[12, 14, 15, 16]}
                                    color="green.500"
                                  >
                                    <ArrowForwardIcon /> $
                                    {Math.round(
                                      product.Precio *
                                        (1 - product.Descuento * 0.01)
                                    )}
                                  </Text>
                                  <Text ml={5} fontWeight="bold">
                                    Total: ${" "}
                                    {product.Precio *
                                      (1 - product.Descuento * 0.01) *
                                      cantidad}
                                  </Text>
                                </Flex>
                              </Flex>
                              <Flex flexGrow={1} flexDir="column">
                                <Text fontSize={[10, 12, 15, 15]}>
                                  {product.Descuento}% Off!
                                </Text>
                              </Flex>
                            </Flex>
                          ) : (
                            <Flex flexGrow={2} flexDir="row">
                              <Text fontSize={[13, 14, 15, 16]}>
                                $ {product.Precio}
                              </Text>
                              <Text ml={5} fontWeight="bold">
                                Total: $ {product.Precio * cantidad}
                              </Text>
                            </Flex>
                          )}
                        </Flex>

                        <Flex p={2} flexDir="column" justify="flex-end">
                          <Button
                            bg="blue.300"
                            size="xs"
                            onClick={() => eliminarProducto(product.id)}
                          >
                            Eliminar
                          </Button>
                        </Flex>
                      </Flex>
                    </Flex>
                  );
                }
              })
            )
          ) : (
            <Flex flexDir="column" m="auto">
              <Text fontSize={[20, 30, 40, 40]} color="blackAlpha.600">
                Tu carrito esta vacio!
              </Text>
              <Text fontSize={[10, 20, 20, 20]} color="blackAlpha.500">
                Agrega productos al carrito para realizar tu compra.
              </Text>
            </Flex>
          )}
          {cartList.length > 0 && !isLoading && (
            <Flex flexDir="column">
              <Flex>
                <Text>Total {cantTotal}</Text>{" "}
              </Flex>
              <Button
                size="sm"
                w="90px"
                m="auto"
                mt={2}
                onClick={() => borrarCarro()}
                bg="blue.300"
              >
                Borrar carro
              </Button>
            </Flex>
          )}
        </Flex>
        <Flex flexGrow={1}></Flex>
      </Flex>
    </FormatBlank>
  );
};

export default Carrito;
