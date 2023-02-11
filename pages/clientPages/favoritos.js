import { Flex, Icon, Image, Spinner, Text, useToast } from "@chakra-ui/react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { AiFillHeart, AiOutlineShoppingCart } from "react-icons/Ai";
import { BeatLoader } from "react-spinners";
import { FormatClient } from "../../components/client/FormatCliente";
import { ProductHasDiscount } from "../../components/products/productHasDiscount";
import { context } from "../../contexts/userContext";
import { auth, firestore } from "../../firebase/clientApp";
import { ProductsPagination } from "../productPages/productsPagination";
export async function getServerSideProps({ query }) {
  const usuario = await getDoc(doc(firestore, "users", query.cd));
  const favoritos = usuario.data().favoritos;
  let docObject = [];
  if (favoritos.length === 0) {
    return {
      props: {
        favData: [],
        favs: [],
      },
    };
  }
  for (let i = 0; i < favoritos.length; i++) {
    const document = await getDoc(doc(firestore, "Productos", favoritos[i]));
    docObject = [...docObject, { ...document.data(), id: document.id }];
    if (docObject.length === favoritos.length) {
      return {
        props: {
          favData: docObject,
          favs: favoritos,
        },
      };
    }
  }
}

const Favoritos = ({ favData, favs }) => {
  const [user, loading, error] = useAuthState(auth);
  const ctx = useContext(context);
  const [showSpinner, setShowSpinner] = useState(false);
  const [selectedProd, setSelectedProd] = useState(0);
  const [cartList, setCartList] = useState([]);
  const [products, setProducts] = useState(favData);
  const [favoriteList, setFavoritelist] = useState(favs);
  const [page, setPage] = useState(1);
  const [pagesTotal, setPagesTotal] = useState();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleFavorito = async (prop, numProp) => {
    setShowSpinner(true);
    setSelectedProd(numProp);
    const ind = favoriteList.indexOf(prop);
    let newArr = [];
    let newProds = products.filter((prd) => prd.id !== prop);
    newArr = favoriteList.filter((p) => p !== favoriteList[ind]);
    setFavoritelist(newArr);
    await updateDoc(doc(firestore, "users", user.uid), {
      favoritos: newArr,
    });
    toast({
      title: `Eliminado correctamente`,
      status: "success",
      isClosable: true,
    });
    sessionStorage.setItem(
      "FAVORITOS_STORAGE_SESSION_CONTEXT",
      JSON.stringify(newArr)
    );
    setProducts(newProds);
    setShowSpinner(false);
    setSelectedProd(0);
  };
  const handleCarrito = async (prop) => {
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
  useEffect(() => {
    setPagesTotal(Math.ceil(products.length / 10));
  }, [products]);
  const handlePagination = (prop) => {
    setPage(page + prop);
    window.scrollTo(0, 0);
  };
  useEffect(() => {
    if (page > pagesTotal) {
      setPage(page - 1);
    }
  }, [pagesTotal]);
  return (
    <FormatClient title="Favoritos" cartIndex={cartList.length}>
      {!products || products?.length > 0 ? (
        <Flex justify="center" flexDir="column" p={2} m={2}>
          {isLoading && (
            <Flex mt={10} justify="center">
              <BeatLoader color="#68EBBB" />
            </Flex>
          )}
          {products.map((product, i) => {
            if (i > page * 10 - 11 && i < page * 10)
              return (
                <Flex
                  as={motion.div}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transitionDuration={"0.2s"}
                  transitionDelay={`${(i - (page * 10 - 10)) * 0.1}s`}
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
                      <Link href={`/productPages/productos/${product.id}`}>
                        <Image
                          cursor="pointer"
                          border={[
                            "none",
                            "1px solid black",
                            "1px solid black",
                            "1px solid black",
                          ]}
                          m="auto"
                          boxSize={["100px", "120px", "160px", "160px"]}
                          objectFit="cover"
                          borderRadius="5px"
                          src={product.Img}
                        />
                      </Link>
                    </Flex>
                    <Flex
                      maxH={["120px", "120px", "160px", "160px"]}
                      h="100%"
                      flexDir="column"
                      placeContent="space-between"
                      flexGrow={1}
                    >
                      <Flex flexGrow={4}>
                        <Link href={`/productPages/productos/${product.id}`}>
                          <Text
                            cursor="pointer"
                            fontSize={[12, 14, 17, 17]}
                            fontWeight="bold"
                          >
                            {product.Nombre}
                          </Text>
                        </Link>
                      </Flex>
                      {product.Descuento ? (
                        <ProductHasDiscount
                          precio={product.Precio}
                          descuento={product.Descuento}
                        />
                      ) : (
                        <Flex flexGrow={2} flexDir="column">
                          <Text fontSize={[13, 14, 15, 16]}>
                            $ {product.Precio}
                          </Text>
                        </Flex>
                      )}
                    </Flex>

                    <Flex
                      flexDir="column"
                      align="flex-end"
                      justifyContent="space-between"
                    >
                      <Icon
                        as={AiFillHeart}
                        cursor="pointer"
                        display={
                          !showSpinner || selectedProd !== i + 1
                            ? "flex"
                            : "none"
                        }
                        _hover={{ opacity: "0.4" }}
                        color="blue.800"
                        fontSize={[20, 25, 30, 30]}
                        onClick={() => handleFavorito(product.id, i + 1)}
                      />
                      <Spinner
                        display={
                          showSpinner && selectedProd === i + 1
                            ? "flex"
                            : "none"
                        }
                        color="blue.500"
                      />
                      <Flex>
                        {cartList.includes(product.id) && (
                          <Text
                            fontSize={[12, 15, 18, 18]}
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
                        <Icon
                          as={AiOutlineShoppingCart}
                          cursor="pointer"
                          _hover={
                            !cartList.includes(product.id)
                              ? { opacity: "1" }
                              : { opacity: "0.7" }
                          }
                          opacity={cartList.includes(product.id) ? "1" : "0.3"}
                          color="blue"
                          fontSize={[20, 25, 30, 30]}
                          onClick={() => handleCarrito(product.id)}
                        />
                      </Flex>
                    </Flex>
                  </Flex>
                </Flex>
              );
          })}
        </Flex>
      ) : (
        <Text
          mt={5}
          align="center"
          fontSize={[10, 20, 20, 20]}
          color="blackAlpha.500"
        >
          No se han encontrado favoritos
        </Text>
      )}
      {products.length > 0 && (
        <ProductsPagination
          pagina={page}
          paginasTotales={pagesTotal}
          handleAnterior={() => handlePagination(-1)}
          handleSiguiente={() => handlePagination(+1)}
        />
      )}
    </FormatClient>
  );
};

export default Favoritos;
