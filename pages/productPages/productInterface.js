import { Flex, Box, Text, useToast, Select,Spinner } from "@chakra-ui/react";
import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useContext, useRef, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { BeatLoader } from "react-spinners";
import { FormatProduct } from "../../components/products/FormatProducts";
import { ProductStructure } from "../../components/products/productStructure";
import { context } from "../../contexts/userContext";
import { auth, firestore } from "../../firebase/clientApp";
import { BusquedaGeneral } from "./busquedaGeneral";
import { ProductsPagination } from "./productsPagination";
import ProductTopComp from "../../components/products/ProductTopComp";

const productos = () => {
  const ctx = useContext(context);
  const productsCollectionRef = collection(firestore, "Productos");
  const catCollectionRef = collection(firestore, "Categorias");
  const [user, loading, error] = useAuthState(auth);
  const toast = useToast();
  const [cartList, setCartList] = useState([]);
  const [favoriteList, setFavoritelist] = useState(ctx.favoritos);
  const [products, setProducts] = useState([]);
  const [loadedProducts, setLoadedProducts] = useState(false);
  const [productOrder, setProductOrder] = useState();
  const [categoria, setCategoria] = useState();
  const [categorias, setCategorias] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [descuento, setDescuento] = useState(0);
  const [priceMinMax, setPriceMinMax] = useState({ min: 0, max: Infinity });
  const [marcas, setMarcas] = useState({});
  const [marcasPick, setMarcasPick] = useState([]);
  const [subCat1, setSubCat1] = useState();
  const [searchInputValue, setSearchInputvalue] = useState([]);
  const [queryArr, setQueryArr] = useState([productsCollectionRef, limit(1)]);
  const [page, setPage] = useState(1);
  const [pagesTotal, setPagesTotal] = useState(0);
  const [selectedProd, setSelectedProd] = useState(0)
  const [showSpinner, setShowSpinner] = useState(false)

  const catStorageRef = useRef(false);
  const router = useRouter();
  const rqCategoria = router.query.categoria;
  const rqSearch = router.query.searchInput;
  const rqSubCat1 = router.query.SubCat1;

  //handle url Querys
  useEffect(() => {
    setSubCat1();
    if (rqCategoria) setCategoria(rqCategoria);
    if (rqSubCat1) setSubCat1(rqSubCat1);
    if (rqSearch) {
      setSearchInputvalue(rqSearch.split(" "));
    }
  }, [rqSearch, rqCategoria]);

  //handleQueryArr
  useEffect(() => {
    if (categoria || searchInputValue.length > 0){
      
    let arr = [productsCollectionRef];
    if (searchInputValue.length > 0) {
      arr = [
        ...arr,
        where("SearchValues", "array-contains-any", searchInputValue),
      ];
    }
    if (categoria) {
      arr = [...arr, where("Categoria", "==", categoria)];
    }
    if (subCat1) {
      arr = [...arr, where("SubCat1", "==", subCat1)];
    }
    if (productOrder) {
      arr = [...arr, orderBy("Precio", productOrder)];
    }
    setQueryArr([
      ...arr,
      where("Precio", "<=", priceMinMax.max),
      where("Precio", ">=", priceMinMax.min),
      limit(30),
    ]);
    setPage(1);
    console.log("queryArr")    
    }
  }, [searchInputValue, categoria, subCat1, priceMinMax, productOrder]);

  // getProducts
  useEffect(() => {
    if (categoria || searchInputValue.length > 0) {
      const getProducts = async () => {
        setLoadedProducts(false);
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
    }
    
  }, [queryArr]);
  // handleFavoritos
  useEffect(() => {
    const data = sessionStorage.getItem("FAVORITOS_STORAGE_SESSION_CONTEXT");
    if (data && data !== favoriteList) {
      setFavoritelist(JSON.parse(data));      
    }
  }, []);
  const handleFavorito = async (prop, numProp) => {
    setShowSpinner(true);
    setSelectedProd(numProp);
    const ind = favoriteList.indexOf(prop);
    let newArr = [];
    ind === -1
      ? (newArr = [...favoriteList, prop])
      : (newArr = favoriteList.filter((p) => p !== favoriteList[ind]));
    await updateDoc(doc(firestore, "users", user.uid), {
      favoritos: newArr,
    });
    setFavoritelist(newArr);
    sessionStorage.setItem(
      "FAVORITOS_STORAGE_SESSION_CONTEXT",
      JSON.stringify(newArr)
    );

    toast({
      title: ind === -1 ? `Añadido correctamente` : `Eliminado correctamente`,
      status: "success",
      isClosable: true,
    });
    setShowSpinner(false);
    setSelectedProd(0);
  };

  // handleCarrito
  const handleCarrito = (prop) => {
    setCartList([...cartList, prop]);
  };
  const handlePagination = (prop) => {
    setPage(page + prop);
    window.scrollTo(0, 0);
  };

  // cartStorage
  useEffect(() => {
    const data = localStorage.getItem("CART_CONTEXT_STORAGE");
    if (data) {
      setCartList(JSON.parse(data));
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("CART_CONTEXT_STORAGE", JSON.stringify(cartList));
  });

  // total de paginas
  useEffect(() => {
    setPagesTotal(Math.floor(products.length / 10) + 1);
    filtrarMarcas(products);
  }, [products]);

  // filtrado client side productos y get Marcas
  const filtrarProductos = (prop) => {
    const contarPalabras = (prd) => {
      const cuenta = prd.SearchValues.reduce(
        (acc, elem, index) =>
          searchInputValue.includes(elem)
            ? acc + prd.SearchValues.length - index
            : acc,
        0
      );
      return cuenta;
    };
    const newProp = prop.filter(
      (prd) =>
        (descuento > 0 ? prd.Descuento >= descuento : prd) &&
        (marcasPick.length > 0 ? marcasPick.includes(prd.Marca) : prd)
    );
    if (searchInputValue.length > 0 && !productOrder) {
      newProp.sort((a, b) => {
        if (contarPalabras(a) > contarPalabras(b)) return -1;
        if (contarPalabras(a) < contarPalabras(b)) return 1;
        if (contarPalabras(a) === contarPalabras(b)) {
        }
        return 0;
      });
    }
    return newProp;
  };
  const filtrarMarcas = (prop) => {
    const currentMarcas = prop.reduce(
      (acc, prod) =>
        prod.Marca !== "Otro"
          ? { ...acc, [prod.Marca]: acc[prod.Marca] + 1 || 1 }
          : { ...acc },
      {}
    );
    setMarcas(currentMarcas);
  };
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

  useEffect(() => {
    if (categoria && categorias.length > 0) {
      const catSel = categorias.filter((cat) => categoria === cat.id);
      setSecciones(catSel[0].SubCat1);
    }
  }, [categoria]);

  return (
    <FormatProduct
      loader={loadedProducts}
      cartIndex={cartList.length}
      title={
        categoria
          ? `${categoria} ${subCat1 ? ` - ${subCat1}` : ""}`
          : "Productos"
      }
      setDescuentoValue={(descuento) => setDescuento(descuento)}
      marcasPropPick={(marcasPick) => setMarcasPick(marcasPick)}
      filtersClean={() => {
        if (priceMinMax.min !== 0 || priceMinMax.max !== Infinity) {
          setPriceMinMax({ min: 0, max: Infinity });
        }
        if (descuento > 0 || marcasPick.length > 0) {
          setDescuento(0);
          setMarcasPick([]);
        }
      }}
      marcasProp={marcas}
      setPriceRange={(priceMinMax) => setPriceMinMax(priceMinMax)}
    >
      <ProductTopComp
        subCatClean={() => setSubCat1()}
        searchInputProp={searchInputValue.join(" ")}
        title={
          categoria
            ? `${categoria} ${subCat1 ? ` > ${subCat1}` : ""}`
            : "Productos"
        }
        subCatProp={[subCat1, categoria]}
        searchInputClean={() => {
          setMarcasPick([]);
          setMarcas({});
          setProducts([]);
          setSearchInputvalue([]);
          router.push(`/productPages/productInterface`);
        }}
        setProduct={(productOrder) => setProductOrder(productOrder)}
        catProp={rqCategoria}
      >
        <Flex
          flexDir={["column", "column", "column", "row"]}
          justifyContent="space-between"
          flexGrow={1}
        >
          <Flex w={["100%", "100%", "100%", "30%"]}>
            {categoria && (
              <Select
                size={["xs", "sm"]}
                placeholder="Secciones"
                borderBottom="1px solid #7D7D7D"
                borderRight="1px solid #7D7D7D"
                value={subCat1}
                onChange={(e) => {
                  setSubCat1(e.target.value);
                }}
              >
                {secciones &&
                  secciones.map((sec) => {
                    return (
                      <option key={sec} value={sec}>
                        {sec}
                      </option>
                    );
                  })}
              </Select>
            )}
          </Flex>
          <Flex w={["100%", "100%", "100%", "50%"]}>
            <Text
              w={["45%", "45%"]}
              m="auto 1%"
              fontSize={["xs", "xs", "sm", "md"]}
            >
              Ordenar por
            </Text>
            <Select
              name="ordernarPor"
              borderBottom="1px solid #7D7D7D"
              borderLeft="1px solid #7D7D7D"
              placeholder="Mejores resultados"
              size={["xs", "sm"]}
              onChange={(e) => {
                setProductOrder(e.target.value);
              }}
            >
              <option value="desc">Mayor Precio</option>
              <option value="asc">Menor Precio</option>
            </Select>
          </Flex>
        </Flex>
        {subCat1 && (
          <Text
            textDecor="underline"
            ml={1}
            _hover={{ color: "blue.600" }}
            cursor="pointer"
            onClick={() => setSubCat1()}
          >{`Buscar en "${categoria}"`}</Text>
        )}
      </ProductTopComp>
      <Box
        mt={[2, 4, 7, 10]}
        minH="30vh"
        m={2}
        border="1px solid #a7a7a7"
        borderRadius="15px"
      >
        <Flex justify="center" flexDir="column" p={2} m={2}>
          {!categoria && searchInputValue.length === 0 && <BusquedaGeneral />}
          {!loadedProducts && (categoria || searchInputValue.length > 0) ? (
            <Flex mt={10} justify="center">
              <BeatLoader color="#68EBBB" />
            </Flex>
          ) : (
            filtrarProductos(products).map((product, i) => {
              if (i > page * 10 - 11 && i < page * 10)
                return (
                  <ProductStructure
                    page={page}
                    i={i}
                    id={product.id}
                    nombre={product.Nombre}
                    precio={product.Precio}
                    descuento={product.Descuento}
                    img={product.Img[0]}
                    favoriteList={favoriteList}
                    cartList={cartList}
                    onClickCarrito={() => handleCarrito(product.id)}
                    onClickFavorito={() => handleFavorito(product.id,i)}
                    key={product.id}
                    isSpinner={showSpinner && selectedProd === i}
                  />
                );
            })
          )}
        </Flex>
        {loadedProducts && (
          <Flex justify="center" bg="white" h="10vh">
            {products.length > 0 ? (
              <ProductsPagination
                pagina={page}
                paginasTotales={pagesTotal}
                manejarPaginacion={handlePagination}
                handleSiguiente={() => {
                  setPage(page + 1);
                }}
                handleAnterior={() => {
                  setPage(page - 1);
                }}
              />
            ) : (
              searchInputValue.length > 0 && (
                <Flex flexDir="column">
                  <Text>
                    No se encontraron resultados
                    {categoria && ` buscando en "${categoria}"`}
                  </Text>
                  {categoria && (
                    <Text
                      cursor="pointer"
                      _hover={{ textDecoration: "underline" }}
                      onClick={() => setCategoria()}
                    >
                      Buscar "{searchInputValue.join(" ")}" en general
                    </Text>
                  )}
                </Flex>
              )
            )}
          </Flex>
        )}
      </Box>
    </FormatProduct>
  );
};

export default productos;
