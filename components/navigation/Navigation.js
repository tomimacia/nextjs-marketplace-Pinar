import {
  CloseIcon,
  HamburgerIcon,
  MoonIcon,
  Search2Icon,
  SunIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Flex,
  Icon,
  IconButton,
  Input,
  useColorMode,
  useToast,
  Text,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { AiOutlineShoppingCart } from "react-icons/Ai";
import { a, b } from "../../chakra/bgColors";
import formBackground from "../../items/formBackgrond";
import { useOnKeyPress } from "../../items/useOnKey";
import { ClientNavigation } from "./ClientNavigation";
import NavItem from "./navItem";
import { ProductsNav } from "./ProductsNav";

const Navigation = (props) => {
  const searchInputNav = useRef(null);
  const router = useRouter();
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();
  const [cartList, setCartList] = useState([]);
  const [display, changeDisplay] = useState("none");
  const [searchInputValue, setSearchInputvalue] = useState("");

  useEffect(() => {
    const data = localStorage.getItem("CART_CONTEXT_STORAGE");
    if (data) {
      setCartList(JSON.parse(data));
    }
  }, []);
  

  const handleEnter = () => {
    if (document.activeElement === searchInputNav.current) {
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
    <Box bgGradient={formBackground(a, b)} p={1}>
      <Flex width="100%" height={50} alignItems="center">
        <Breadcrumb
          flexGrow={1}
          spacing={3}
          display={["none", "none", "none", "flex"]}
        >
          <BreadcrumbItem>
            <NavItem href="/">Home</NavItem>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <NavItem href="/productPages/productInterface">Productos</NavItem>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <NavItem href="/about">Nosotros</NavItem>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <NavItem href="/contact">Contacto</NavItem>
          </BreadcrumbItem>
        </Breadcrumb>

        <Flex flexGrow={1}>
          <Flex flexGrow={5}>
            <IconButton
              display={["none", "flex", "flex", "none"]}
              icon={<HamburgerIcon />}
              aria-label="Open Menu"
              onClick={() => changeDisplay("flex")}
              mr={2}
            />
            <Flex flexGrow={1} justify="right">
              <Input
                variant="Flushed"
                width={["130px", "auto", "auto", "auto"]}
                minW="10px"
                flexGrow={1}
                ref={searchInputNav}
                maxW={600}
                onKeyDown={useOnKeyPress("Enter", handleEnter)}
                placeholder="Search products"
                onChange={(e) => setSearchInputvalue(e.target.value)}
                bg={formBackground("white", "gray.500")}
                color={formBackground("blackAlpha.600", "white")}
              />
              <Search2Icon
                cursor="pointer"
                fontSize={20}
                justify="right"
                display={["none", "flex", "flex", "flex"]}
                borderRadius="10%"
                onClick={() => handleSearchClick()}
                _hover={{ color: "blackAlpha.400" }}
                m={2}
              />
            </Flex>
          </Flex>
          <Flex justify="right">
            <IconButton
              icon={colorMode === "light" ? <SunIcon /> : <MoonIcon />}
              onClick={toggleColorMode}
              outlineColor={formBackground("blackAlpha.400", "gray.400")}
              cursor="pointer"
              fontSize={20}
              mt={1}
              boxSize={33}
              _hover={{ color: "blackAlpha.400" }}
              bg="transparent"
              ml={2}
              mr="45px"
            >
              Switch Mode
            </IconButton>
            <Link href="/cart">
              <Flex>
                <Icon
                  as={AiOutlineShoppingCart}
                  cursor="pointer"
                  _hover={{ color: "blackAlpha.400" }}
                  fontSize={34}
                  position="fixed"
                  top="10px"
                  right="4px"
                  bg="whiteAlpha.400"
                  borderRadius="50px"
                  zIndex={13}
                />
                <Box
                  as={motion.span}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  right={1}
                  minW={4}
                  h={5}
                  display={
                    props.carro != undefined
                      ? props.carro > 0
                        ? ""
                        : "none"
                      : cartList
                      ? cartList.length > 0
                        ? ""
                        : "none"
                      : ""
                  }
                  cursor="pointer"
                  lineHeight="18px"
                  textAlign="center"
                  pos="fixed"
                  bg="red"
                  borderRadius="50%"
                  fontWeight="Bold"
                  fontSize={15}
                  zIndex={14}
                >
                  <Text>
                    {props.carro ? props.carro : cartList ? cartList.length : 0}
                  </Text>
                </Box>
              </Flex>
            </Link>
          </Flex>
        </Flex>
      </Flex>

      <Flex mt={2}>
        <Flex display={["none", "flex", "flex", "flex"]} flexGrow={1}>
          <ProductsNav />
        </Flex>
        <Flex>
          <IconButton
            display={["flex", "none", "none", "none"]}
            icon={<HamburgerIcon />}
            aria-label="Open Menu"
            onClick={() => changeDisplay("flex")}
            mr={2}
            justify="left"
            size="sm"
          />
        </Flex>
        <Flex flexGrow={1} justify="right">
          <ClientNavigation />
        </Flex>
      </Flex>
      <Flex>
        <Flex mt={2} display={["flex", "none", "none", "none"]} flexGrow={1}>
          <ProductsNav />
        </Flex>
      </Flex>

      <Flex
        w="100vw"
        bgColor="gray.50"
        zIndex={20}
        height="100vh"
        pos="fixed"
        top="0"
        left="0"
        overflowY="auto"
        flexDir="column"
        display={display}
      >
        <Flex justify="flex-end">
          <IconButton
            onClick={() => changeDisplay("none")}
            mt={2}
            mr={2}
            aria-label="Close Menu"
            size="lg"
            icon={<CloseIcon />}
            color="blackAlpha.700"
          />
        </Flex>
        <Flex flexDir="column" align="center" p={5}>
          <Button
            onClick={() => changeDisplay("none")}
            w="100vw"
            color="blackAlpha.700"
            colorScheme="blue.300"
            variant="outline"
            outlineColor="blackAlpha.500"
          >
            <NavItem href="/">Home</NavItem>
          </Button>
          <Button
            onClick={() => changeDisplay("none")}
            w="100vw"
            color="blackAlpha.700"
            colorScheme="blue.300"
            variant="outline"
            outlineColor="blackAlpha.500"
          >
            <NavItem href="/productPages/productInterface">Products</NavItem>
          </Button>
          <Button
            onClick={() => changeDisplay("none")}
            w="100vw"
            color="blackAlpha.700"
            colorScheme="blue.300"
            variant="outline"
            outlineColor="blackAlpha.500"
          >
            <NavItem href="/about">About</NavItem>
          </Button>
          <Button
            onClick={() => changeDisplay("none")}
            w="100vw"
            color="blackAlpha.700"
            colorScheme="blue.300"
            variant="outline"
            outlineColor="blackAlpha.500"
          >
            <NavItem href="/contact">Contact</NavItem>
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navigation;
