import {
  Button,
  Checkbox,
  Flex,
  Heading, Input,
  ListItem, Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Text,
  Tooltip,
  UnorderedList
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useOnKeyPress } from "../../items/useOnKey";
import Layout from "../Layout";
import { ProductSideBar } from "./productSideBar";
import { ProductSideBarItem } from "./productSideBarItem";
export const FormatProduct = ({
  loader,
  cartIndex,
  children,
  title,  
  setDescuentoValue,
  setPriceRange,
  filtersClean,
  marcasProp,
  marcasPropPick,
}) => {
  const [marcas, setMarcas] = useState({});
  const [marcasElegidas, setMarcasElegidas] = useState([]);
  const [maxMin, setMaxMin] = useState({ min: 0, max: Infinity });
  const [sliderValue, setSliderValue] = useState(0);
  const [showSlider, setShowSlider] = useState(false);
  const searchInputNavMin = useRef(null);
  const searchInputNavMax = useRef(null);
  const sliderValueRef = useRef(null);
  const sliderThumbRef = useRef(null);
  const filledTrackRef = useRef(null);
  const labelStyles = {
    mt: "2",
    ml: "-2.5",
    fontSize: "xs",
  };
  
  
  const handleEnter = () => {
    if (
      document.activeElement === searchInputNavMin.current ||
      document.activeElement === searchInputNavMax.current
    ) {
      applyRangeChanges();
    }
  };
  const applyRangeChanges = () => {
    if (maxMin.min > 1 || maxMin.max < Infinity) setPriceRange(maxMin);
  };
  function orderSort(a, b) {
    return a < b ? -1 : 1;
  }

  useEffect(() => {
    setMarcas(marcasProp);
  }, [marcasProp]);
  const onClickCleanValues = () => {
    searchInputNavMin.current.value = "";
    searchInputNavMax.current.value = "";
    sliderThumbRef.current.style.left = "calc(0% - 6.99219px)";
    filledTrackRef.current.style.width = "0%";
    setMaxMin({ min: 0, max: Infinity });
    setMarcasElegidas([]);
    filtersClean();
  };
  const handleCheckbox = (e) => {
    if (marcasElegidas.includes(e.target.value)) {
      let newArr = marcasElegidas.filter((m) => m !== e.target.value);
      setMarcasElegidas([...newArr]);
    } else {
      setMarcasElegidas([...marcasElegidas, e.target.value]);
    }
  };

  return (
    <Layout hiddenTitle={title} cartIndex={cartIndex}>
      <Flex
        align="center"
        justify="center"
        h={["3vh", "4vh", "5vh", "6vh"]}
        bgGradient="linear(to-t, teal.400, teal.300)"
      >
        <Heading>Publicidad</Heading>
      </Flex>
      <Flex gap={[1, 2, 2, 2]}>
        <Flex
          minW={["28px", "32px", "35px", "35px"]}
          maxW={["28px", "32px", "35px", "100%"]}
        >
          <ProductSideBar loader={loader}>
            <ProductSideBarItem title="Precio">
              <Flex width="100%" flexDir="column">
                <Flex flexDir="column">
                  <Flex flexDir="column">
                    <Text>Precio Min</Text>
                    <Input
                      onChange={(e) => {
                        if (e.target.value) {
                          setMaxMin({
                            ...maxMin,
                            min: parseInt(e.target.value),
                          });
                        } else {
                          setMaxMin({
                            ...maxMin,
                            min: 0,
                          });
                        }
                      }}
                      borderColor="blackAlpha.500"
                      ref={searchInputNavMin}
                      onKeyDown={useOnKeyPress("Enter", handleEnter)}
                      bg="white"
                      color="black"
                      w="80%"
                      size="xs"
                      type="number"
                      placeholder={"Ingresa un mínimo"}
                    />
                  </Flex>
                  <Flex flexDir="column">
                    <Text>Precio Max</Text>
                    <Input
                      onChange={(e) => {
                        if (e.target.value) {
                          setMaxMin({
                            ...maxMin,
                            max: parseInt(e.target.value),
                          });
                        } else {
                          setMaxMin({
                            ...maxMin,
                            max: Infinity,
                          });
                        }
                      }}
                      borderColor="blackAlpha.500"
                      ref={searchInputNavMax}
                      onKeyDown={useOnKeyPress("Enter", handleEnter)}
                      bg="white"
                      color="black"
                      w="80%"
                      size="xs"
                      type="number"
                      placeholder={"Ingresa un máximo"}
                    />
                  </Flex>
                </Flex>
                <Button
                  onClick={() => applyRangeChanges()}
                  mt={5}
                  size="xs"
                  bg="gray.300"
                  w="50%"
                  boxShadow="0 1px 5px"
                >
                  Aplicar
                </Button>
              </Flex>
            </ProductSideBarItem>
            {Object.keys(marcas).length > 0 && (
              <ProductSideBarItem title="Marcas">
                <Flex w="100%" flexDir="column">
                  <UnorderedList listStyleType="none">
                    {Object.keys(marcas)
                      .sort(orderSort)
                      .map((mrk) => {
                        if(mrk)
                        return (
                          <ListItem key={mrk}>
                            <Checkbox
                              onChange={handleCheckbox}
                              value={mrk}
                              border="1px gray"
                              isChecked={marcasElegidas.includes(mrk)}
                            >
                              {`${mrk} (${marcas[mrk]})`}
                            </Checkbox>
                          </ListItem>
                        );
                      })}
                  </UnorderedList>
                  <Button
                    onClick={() => marcasPropPick(marcasElegidas)}
                    mt={10}
                    size="xs"
                    bg="gray.300"
                    w="50%"
                    boxShadow="0 1px 5px"
                  >
                    Aplicar
                  </Button>
                </Flex>
              </ProductSideBarItem>
            )}

            <ProductSideBarItem title="Descuentos">
              <Flex width="100%" flexDir="column">
                <Flex w="85%">
                  <Slider
                    focusThumbOnChange
                    defaultValue={0}
                    aria-label="slider-ex-6"
                    ref={sliderValueRef}
                    onChange={(val) => setSliderValue(val)}
                    min={0}
                    max={30}
                    onTouchStart={() => setShowSlider(true)}
                    onTouchEnd={() => setShowSlider(false)}
                  >
                    <SliderMark value={10} {...labelStyles}>
                      10%
                    </SliderMark>
                    <SliderMark value={20} {...labelStyles}>
                      20%
                    </SliderMark>
                    <SliderMark value={32} {...labelStyles}>
                      |
                    </SliderMark>
                    <SliderTrack>
                      <SliderFilledTrack ref={filledTrackRef} />
                    </SliderTrack>
                    <Tooltip
                      hasArrow
                      bg="blue.400"
                      color="white"
                      placement="top"
                      isOpen={showSlider}
                      label={`${sliderValue}%`}
                    >
                      <SliderThumb
                        ref={sliderThumbRef}
                        bg="gray.300"
                        _hover={{ bg: "blue.300" }}
                        onMouseEnter={() => setShowSlider(true)}
                        onMouseLeave={() => setShowSlider(false)}
                      />
                    </Tooltip>
                  </Slider>
                </Flex>
                <Button
                  onClick={() =>
                    sliderValue > 0 ? setDescuentoValue(sliderValue) : null
                  }
                  mt={10}
                  size="xs"
                  bg="gray.300"
                  w="50%"
                  boxShadow="0 1px 5px"
                >
                  Aplicar
                </Button>
              </Flex>
            </ProductSideBarItem>
            <ProductSideBarItem>
              <Button
                boxShadow="0 1px 5px"
                mt={3}
                size="xs"
                bg="gray.300"
                w="70%"
                onClick={onClickCleanValues}
              >
                Limpiar filtros
              </Button>
            </ProductSideBarItem>
          </ProductSideBar>
        </Flex>
        <Flex flexGrow={10}>
          <Flex flexGrow={1} flexDir="column" minH="80%" h="100%" bg="gray.200">
                         
                {children}            
          </Flex>
        </Flex>
        <Flex flexGrow={1} bgGradient="linear(to-r, teal.400, teal.300)"></Flex>
      </Flex>
      <Flex justify="center" bg="white" h="10vh"></Flex>
    </Layout>
  );
};
