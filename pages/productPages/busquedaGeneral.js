import { Search2Icon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  ListItem,
  UnorderedList,
  useToast,
} from "@chakra-ui/react";
import { collection, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { firestore } from "../../firebase/clientApp";
import formBackground from "../../items/formBackgrond";
import { useOnKeyPress } from "../../items/useOnKey";

export const BusquedaGeneral = () => {
  const searchInputNav2 = useRef(null);
  const router = useRouter();
  const toast = useToast();
  const [categorias, setCategorias] = useState([]);
  const [searchInputValue, setSearchInputvalue] = useState("");
  const catCollectionRef = collection(firestore, "Categorias");
  const catStorageRef = useRef(false);

  useEffect(() => {
    const catArray = sessionStorage.getItem(
      "CATEGORIAS_STORAGE_SESSION_CONTEXT"
    );
    if (catArray) {
      setCategorias(JSON.parse(catArray));
      catStorageRef.current = true;
    } else {
      const getCategorias = async () => {
        const data = await getDocs(catCollectionRef);
        const catFetched = data.docs.map((cat) => ({
          ...cat.data(),
          id: cat.id,
        }));
        sessionStorage.setItem(
          "CATEGORIAS_STORAGE_SESSION_CONTEXT",
          JSON.stringify(catFetched)
        );
        setCategorias(catFetched);
        console.log("rendered categorias");
      };
      getCategorias();
      catStorageRef.current = true;
    }
  }, []);
  const handleEnter = () => {
    if (document.activeElement === searchInputNav2.current) {
      if (searchInputValue.length <= 1 || searchInputValue.length > 50)
        toast({
          title: `Ingresa una busqueda entre 2 y 50 caracteres`,
          status: "error",
          isClosable: true,
        });
      else {
        router.push(
          `/productPages/productInterface?searchInput=${searchInputValue.toLocaleLowerCase()}`
        );
      }
    }
  };
  const handleSearchClick = () => {
    if (searchInputValue.length <= 1 || searchInputValue.length > 50)
      toast({
        title: `Ingresa una busqueda entre 2 y 50 caracteres`,
        status: "error",
        isClosable: true,
      });
    else {
      router.push(
        `/productPages/productInterface?searchInput=${searchInputValue.toLocaleLowerCase()}`
      );
    }
  };
  return (
    <Flex
      as={motion.div}
      display="flex"
      flexDir="column"
      transitionDuration={"0.5s"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      minH="60vh"
    >
      <Heading fontFamily="arial" as="h3" size={["sm", "sm", "md", "md"]}>
        Ingresa tu busqueda para comenzar!
      </Heading>
      <InputGroup>
        <Input
          mt={3}
          placeholder="¿Que estas buscando?"
          borderColor="blackAlpha.300"
          type="text"
          ref={searchInputNav2}
          onKeyDown={useOnKeyPress("Enter", handleEnter)}
          onChange={(e) => setSearchInputvalue(e.target.value)}
          bg={formBackground("white", "gray.500")}
          color={formBackground("blackAlpha.600", "white")}
        />
        <InputRightElement size="lg">
          <Search2Icon
            mt={5}
            cursor="pointer"
            onClick={() => handleSearchClick()}
          />
        </InputRightElement>
      </InputGroup>
      <Flex mt={10} flexDir="column">
        <Heading
          borderBottom="1px solid #c7c7c7"
          pb={2}
          as="h3"
          size={["xs", "xs", "sm", "sm"]}
        >
          o selecciona una categoria
        </Heading>
        <Flex mt={4}>
          {catStorageRef.current && (
            <Accordion ml="2%" minW="90%" allowToggle>
              {categorias.map((cat) => {
                return (
                  <AccordionItem key={cat.id}>
                    <h2>
                      <AccordionButton>
                        <Box flex="1" textAlign="left">
                          {cat.id}
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <Link
                        href={`http://localhost:3000/productPages/productInterface?categoria=${cat.id}`}
                      >
                        <Heading
                          mb={2}
                          _hover={{ color: "blackAlpha.700" }}
                          cursor="pointer"
                          fontWeight="light"
                          fontSize={14}
                        >
                          {`Buscar en ${cat.id}`}
                        </Heading>
                      </Link>
                      <UnorderedList>
                        {cat.SubCat1.map((thisCat) => {
                          return (
                            <Link
                              href={`http://localhost:3000/productPages/productInterface?categoria=${cat.id}&SubCat1=${thisCat}`}
                              key={thisCat}
                            >
                              <ListItem
                                _hover={{ color: "blackAlpha.700" }}
                                cursor="pointer"
                              >
                                {thisCat}
                              </ListItem>
                            </Link>
                          );
                        })}
                      </UnorderedList>
                    </AccordionPanel>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
