import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Image,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { AiFillHeart, AiOutlineHeart } from "react-icons/Ai";
import { MdVerified } from "react-icons/md";
import FormatBlank from "../../../components/FormatBlank";
import { context } from "../../../contexts/userContext";
import { auth, firestore } from "../../../firebase/clientApp";

export async function getServerSideProps({ params }) {
  const resp = await getDoc(doc(firestore, "Productos", params.productID));
  const producto = resp.data();
  return {
    props: {
      prodRef: { ...producto, id: params.productID },
    },
  };
}

export default function ProductsDynamic({ prodRef }) {
  const [mainImg, setMainImg] = useState(0);
  const [tempImg, setTempImg] = useState(0);
  const [imgDisplay, setImgDisplay] = useState(true);
  const [favoriteList, setFavoritelist] = useState([]);
  const [user, loading, error] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const [cartList, setCartList] = useState([]);
  const ctx = useContext(context);

  // fav storage
  useEffect(() => {
    const data = sessionStorage.getItem("FAVORITOS_STORAGE_SESSION_CONTEXT");
    if (data && data !== favoriteList) {
      setFavoritelist(JSON.parse(data));
    }
  }, []);

  // carrito
  const handleCarrito = (prop) => {
    setCartList([...cartList, prop]);
  };

  // cart storage local
  useEffect(() => {
    const data = localStorage.getItem("CART_CONTEXT_STORAGE");
    if (data) {
      setCartList(JSON.parse(data));
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("CART_CONTEXT_STORAGE", JSON.stringify(cartList));
  });

  // favoritos
  const handleFavorito = async (prop) => {
    setIsLoading(true);
    const ind = favoriteList.indexOf(prop);
    let newArr = [];
    ind === -1
      ? (newArr = [...favoriteList, prop])
      : (newArr = favoriteList.filter((p) => p !== favoriteList[ind]));
    await updateDoc(doc(firestore, "users", user.uid), {
      favoritos: newArr,
    });
    toast({
      title: ind === -1 ? `Añadido correctamente` : `Eliminado correctamente`,
      status: "success",
      isClosable: true,
    });
    setFavoritelist(newArr);
    sessionStorage.setItem(
      "FAVORITOS_STORAGE_SESSION_CONTEXT",
      JSON.stringify(newArr)
    );
    setIsLoading(false);
  };

  // Especial inmuebles vehiculos
  const paraConsulta = (param) => {
    return param === "Inmuebles" || param === "Vehiculos";
  };
  const handleMouseOver = (img) => {
    setTempImg(img);
    setImgDisplay(false);
  };
  
  return (
    <Box>
      <FormatBlank
        hiddenTitle={prodRef.Nombre}
        cartIndex={cartList.length}
        size="md"
        // titulo listo
        title={
          <Flex>
            <Link
              href={`/productPages/productInterface?categoria=${prodRef.Categoria}`}
            >
              <Text
                textDecoration="underline"
                cursor="pointer"
                _hover={{ color: "blue" }}
              >
                {prodRef.Categoria}
              </Text>
            </Link>
            <Text ml={2} mr={2}>
              {">"}
            </Text>
            <Link
              href={`/productPages/productInterface?categoria=${prodRef.Categoria}&SubCat1=${prodRef.SubCat1}`}
            >
              <Text
                textDecoration="underline"
                cursor="pointer"
                _hover={{ color: "blue" }}
              >
                {prodRef.SubCat1}
              </Text>
            </Link>
            {prodRef.Marca && <Text ml={2} mr={2}>
              {`>${prodRef.Marca}`}
            </Text>   }         
          </Flex>
        }
      >
        <Flex
          pr={2}
          pl={2}
          borderLeft="1px solid #c7c7c7"
          borderRight="1px solid #c7c7c7"
          m="0 auto"
          flexDir="column"
          maxW="1200px"
        >
          <Flex>
            <Flex flexDir="column">
              {prodRef.Img.map((img, i) => {
                return (
                  <Flex
                    key={i}
                    onClick={() => setMainImg(i)}
                    onMouseOver={() => handleMouseOver(i)}
                    onMouseOut={() => setImgDisplay(true)}
                    cursor="pointer"
                    justifyContent="center"
                    h="50px"
                    w="50px"
                    _hover={{ border: "2px solid blue" }}
                  >
                    <Image
                      objectFit="cover"
                      mb={1}
                      minH="50px"
                      w="40px"
                      minW="40px"
                      h="50px"
                      src={img}
                    />

                    <Flex
                      w="3px"
                      ml={1}
                      minW="3px"
                      minH="50px"
                      borderRadius={5}
                      bg={i === mainImg ? "blue.500" : "none"}
                    ></Flex>
                  </Flex>
                );
              })}
            </Flex>
            <Flex w="400px" bg="gray.200" mr={5} justify="center">
              <Flex></Flex>              
                <Image
                  pr={1}
                  pl={2}
                  objectFit="cover"
                  minH="400px"
                  h="400px"                  
                  src={prodRef.Img[imgDisplay ? mainImg : tempImg]}
                />              
              <Flex></Flex>
            </Flex>
            <Flex
              p={3}
              justifyContent="space-between"
              minH="400px"
              flexGrow={1}
              flexDir="column"
              borderLeft="1px solid #c7c7c7"
            >
              <Flex justify="space-between">
                <Heading w="90%" as={motion.h3} size="lg" fontFamily="arial">
                  {prodRef.Nombre}
                </Heading>
                {!isLoading ? (
                  <Icon
                    as={
                      favoriteList.includes(prodRef.id)
                        ? AiFillHeart
                        : AiOutlineHeart
                    }
                    w="10%"
                    cursor="pointer"
                    _hover={{ opacity: "0.4" }}
                    color="blue.800"
                    fontSize={30}
                    onClick={() => handleFavorito(prodRef.id)}
                  />
                ) : (
                  <Spinner />
                )}
              </Flex>
              <Flex w="80%" h="60%" justify="space-between" flexDir="column">
                <Flex justify="center" w="100%">
                  <Flex borderBottom="1px solid #c7c7c7" w="100%" maxW="300px">
                    <Text fontSize="30px">$ {prodRef.Precio}</Text>
                  </Flex>
                </Flex>

                {!paraConsulta(prodRef.Categoria) ? (
                  <Flex
                    alignItems="center"
                    w="100%"
                    m="0 auto"
                    flexDir="column"
                  >
                    <Button maxW="300px" w="100%" bg="blue.300">
                      Comprar
                    </Button>
                    <Button
                      maxW="300px"
                      onClick={() => handleCarrito(prodRef.id)}
                      w="100%"
                      bg="blue.300"
                      mt={5}
                    >
                      Agregar al carrito
                    </Button>
                  </Flex>
                ) : (
                  <Flex w="100%" m="0 auto" flexDir="column">
                    <Button bg="blue.300" mt={5}>
                      Consultar
                    </Button>
                  </Flex>
                )}
              </Flex>
            </Flex>
          </Flex>
          <Flex mt={3} flexDir="column">
            <Flex p={4} flexDir="column" borderTop="1px solid #c7c7c7">
              <Flex align="center">
                <Icon as={MdVerified} />
                <Link href={`/productPages/vendedores/${prodRef.UserID}`}>
                  <Text
                    cursor="pointer"
                    _hover={{ textDecoration: "underline", color: "blue" }}
                  >
                    {prodRef.Vendedor}
                  </Text>
                </Link>
              </Flex>
              <Heading size="lg">Descripcion</Heading>
              <Flex mt={3} borderRadius="5px" minH="100px" p={2}>
                <Text>{prodRef.Descripcion}</Text>
              </Flex>
              {prodRef.Caracteristicas && (
                <>
                  <Heading size="lg">Caracteristcas</Heading>
                  <Flex mt={3} borderRadius="5px" minH="100px" p={2}>
                    <Flex
                      w="100%"
                      m={5}
                      border="1px solid #c7c7c7"
                      borderRadius="8px"
                    >
                      <TableContainer w="100%">
                        <Table size="md" variant="simple">
                          <Tbody>
                            {prodRef.Caracteristicas.map((car, i) => {
                              return (
                                <Tr key={i}>
                                  <Td
                                    w="48%"
                                    bg={i % 2 === 0 && "#c0cbff"}
                                    borderRadius="5px"
                                    fontWeight="bold"
                                  >
                                    {car.Propiedad}
                                  </Td>
                                  <Td w="30%"> {car.Valor}</Td>
                                </Tr>
                              );
                            })}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </Flex>
                  </Flex>
                </>
              )}
              {prodRef.Otros && (
                <>
                  <Heading size="lg">Otros</Heading>
                  <Flex mt={3} borderRadius="5px" minH="100px" p={2}>
                    <Flex
                      w="100%"
                      m={5}
                      border="1px solid #c7c7c7"
                      borderRadius="8px"
                    >
                      <TableContainer w="100%">
                        <Table size="md" variant="simple">
                          <Tbody>
                            {prodRef.Otros.map((otro, i) => {
                              return (
                                <Tr key={i}>
                                  <Td
                                    w="48%"
                                    bg={i % 2 === 0 && "#c0cbff"}
                                    borderRadius="5px"
                                    fontWeight="bold"
                                  >
                                    {otro.Propiedad}
                                  </Td>
                                  <Td w="30%"> {otro.Valor ? "Si" : "No"}</Td>
                                </Tr>
                              );
                            })}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </Flex>
                  </Flex>
                </>
              )}
            </Flex>
          </Flex>
        </Flex>
      </FormatBlank>
    </Box>
  );
}
