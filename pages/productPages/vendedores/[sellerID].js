import {
  Box,
  Progress,
  Flex,
  Heading,
  Icon,
  Image,
  Text,
} from "@chakra-ui/react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { AiOutlineShoppingCart } from "react-icons/Ai";
import { BiEdit } from "react-icons/Bi";
import FormatBlank from "../../../components/FormatBlank";
import { auth, firestore } from "../../../firebase/clientApp";
import { ProductPrice } from "../../../components/products/productHasDiscount";

export async function getServerSideProps({ params }) {
  const resp = await getDoc(doc(firestore, "users", params.sellerID));
  const seller = resp.data();
  delete seller.fechaDeSuscripcion;
  return {
    props: {
      sellerRef: seller,
      sellerID: params.sellerID,
    },
  };
}

export default function ProductsDynamic({ sellerRef, sellerID }) {
  const [user, loading, error] = useAuthState(auth);
  const [products, setProducts] = useState([]);
  const [cartList, setCartList] = useState([]);
  const [loadedProducts, setLoadedProducts] = useState(true);
  const productsCollectionRef = collection(firestore, "Productos");

  const queryArr = [
    productsCollectionRef,
    limit(10),
    where("UserID", "==", sellerID),
  ];
  useEffect(() => {
    setLoadedProducts(false);
    const getProducts = async () => {
      const prevData = await getDocs(query(...queryArr));
      const data = prevData.docs.map((product) => ({
        ...product.data(),
        id: product.id,
      }));
      setProducts(data);
      setLoadedProducts(true);
      console.log("render");
    };
    getProducts();
  }, []);
  const handleCarrito = (prop) => {
    setCartList([...cartList, prop]);
  };
  useEffect(() => {
    const data = localStorage.getItem("CART_CONTEXT_STORAGE");
    if (data) {
      setCartList(JSON.parse(data));
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("CART_CONTEXT_STORAGE", JSON.stringify(cartList));
  });

  return (
    <Box>
      <FormatBlank
        cartIndex={cartList.length}
        hiddenTitle={sellerRef.sellerName}
        title={
          <Flex
            fontSize={["20px", "30px", "30px", "35px"]}
            w="100%"
            align="center"
          >
            {sellerRef.sellerName}
            {user && user.uid === sellerID && (
              <Icon
                _hover={{ color: "#9b9b9b" }}
                cursor="pointer"
                as={BiEdit}
                ml={2}
              />
            )}
          </Flex>
        }
      >
        <Flex m="auto" maxW="1500px" flexDir="column">
          <Flex pb={5} borderBottom="3px solid black">
            <Image
              m="auto"
              objectFit="cover"
              objectPosition="top"
              borderRadius="10px"
              h="15vh"
              w="80vw"
              src={sellerRef.sellerSpecs.Img1}
              mb={5}
            />
            {user && user.uid === sellerID && (
              <Icon
                _hover={{ color: "#c7c7c7" }}
                cursor="pointer"
                fontSize="25px"
                as={BiEdit}
                right={12}
              />
            )}
          </Flex>
          <Flex p={3} flexDir="column">
            <Heading
              fontWeight="bold"
              fontSize={["15px", "20px", "20px", "25px"]}
              m="30px 0 20px 0"
            >
              Sobre nosotros
            </Heading>
            <Text lineHeight="25px" fontSize={["13px", "15px", "16px", "17px"]}>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Perspiciatis facilis doloremque tenetur, ab explicabo sequi
              quibusdam, qui reiciendis obcaecati velit asperiores voluptatibus
              provident, soluta libero? Debitis ullam recusandae nemo
              aspernatur?
            </Text>
          </Flex>
          <Flex p={3} mt={8} flexDir="column">
            <Heading
              fontSize={["15px", "20px", "20px", "25px"]}
              m="20px 0 20px 0"
              lineHeight="30px"
            >
              Take away y envíos
            </Heading>
            <Text lineHeight="25px" fontSize={["13px", "15px", "16px", "17px"]}>
              Nos encontramos en la localidad de{" "}
              <Text as="span" fontWeight="bold">
                {sellerRef.direccion.localidad}
              </Text>
              , ubicados en{" "}
              <Text as="span" fontWeight="bold">
                {sellerRef.direccion.direccion}
              </Text>
              . Con take away podes pasar a retirar tu pedido, o hacemos envios
              en un radio de{" "}
              <Text as="span" fontWeight="bold">
                'radio'km
              </Text>
              . Con tu compra mayor a
              <Text as="span" fontWeight="bold">
                'limite de compra'
              </Text>{" "}
              el envio es GRATIS!. En caso de ser un monto menor, el costo de
              envío es de{" "}
              <Text as="span" fontWeight="bold">
                'costo de envío'
              </Text>
              .
            </Text>
          </Flex>
          <Flex pl={2} pr={2} mt={10} w="100%" flexDir="column">
            <Flex>
              <Heading
                mt={10}
                mb={[10, 15, 18, 20]}
                fontSize={["15px", "20px", "20px", "25px"]}
              >
                Algunos de nuestros productos:
              </Heading>
            </Flex>
            {!loadedProducts ? (
              <Progress m="22px" size="xs" isIndeterminate />
            ) : (
              <Flex flexWrap="wrap" justify="space-around">
                {products.map((product, i) => {
                  return (
                    <Flex
                      boxShadow="0 5px 5px"
                      mb={10}
                      as={motion.div}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transitionDuration={"0.5s"}
                      transitionDelay={`${i * 0.1}s`}
                      border="1px solid #c7c7c7"
                      borderRadius="5px"
                      w={["96%", "96%", "96%", "48%"]}
                      p={1}
                      key={product.id}
                    >
                      <Flex w="100%" borderRadius="5px" bg="white">
                        {/* Flex de la imagen */}
                        <Flex
                          w={["80px", "120px", "140px", "140px"]}
                          minW={["80px", "120px", "140px", "140px"]}
                          h={["120px", "120px", "140px", "140px"]}
                          minH={["120px", "120px", "140px", "140px"]}
                          maxH={["120px", "120px", "140px", "140px"]}
                          ml={["10px", "20px", "20px", "10%"]}
                          mr={["10px", "20px", "20px", "10%"]}
                        >
                          <Link href={`/productPages/productos/${product.id}`}>
                            <Image
                              cursor="pointer"
                              border={[
                                "none",
                                "1px solid #c7c7c7",
                                "1px solid #c7c7c7",
                                "1px solid #c7c7c7",
                              ]}
                              loading="lazy"
                              boxSize={["100px", "120px", "140px", "140px"]}
                              objectFit="cover"
                              borderRadius="5px"
                              m="auto"
                              bg="gray.300"
                              src={product.Img[0]}
                            />
                          </Link>
                        </Flex>
                        {/* Flex nombre y precio */}
                        <Flex
                          maxH={["120px", "120px", "160px", "160px"]}
                          h="100%"
                          flexDir="column"
                          placeContent="space-between"
                        >
                          {/* Flex del nombre */}
                          <Flex h="50%">
                            <Link
                              href={`/productPages/productos/${product.id}`}
                            >
                              <Text
                                cursor="pointer"
                                fontSize={[12, 13, 14, 15]}
                                fontWeight="bold"
                                lineHeight="18px"
                                title={product.Nombre}
                                textOverflow="ellipsis"
                                overflow="hidden"
                              >
                                {product.Nombre}
                              </Text>
                            </Link>
                          </Flex>
                          {/* precio */}
                          <ProductPrice
                            fontSizeProp={[12, 14, 15, 14]}
                            precio={product.Precio}
                            descuento={product.Descuento}
                          />
                        </Flex>

                        <Flex ml="auto">
                          <Flex flexDir="column" align="center">
                            <Icon
                              as={AiOutlineShoppingCart}
                              cursor="pointer"
                              _hover={
                                !cartList.includes(product.id)
                                  ? { opacity: "1" }
                                  : { opacity: "0.7" }
                              }
                              opacity={
                                cartList.includes(product.id) ? "1" : "0.3"
                              }
                              color="blue"
                              fontSize={[20, 25, 28, 28]}
                              onClick={() => handleCarrito(product.id)}
                            />
                            {cartList.includes(product.id) && (
                              <Text
                                fontSize={[12, 15, 18, 15]}
                                opacity="0.7"
                                fontWeight="bold"
                              >
                                (
                                {cartList.reduce((acc, prod) => {
                                  return prod === product.id ? acc + 1 : acc;
                                }, 0)}
                                )
                              </Text>
                            )}
                          </Flex>
                        </Flex>
                      </Flex>
                    </Flex>
                  );
                })}
              </Flex>
            )}
          </Flex>
        </Flex>
      </FormatBlank>
    </Box>
  );
}
