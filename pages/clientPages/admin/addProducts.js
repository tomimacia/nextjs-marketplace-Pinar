import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Image,
  Input,
  Progress,
  Select,
  Stat,
  StatHelpText,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Textarea,
  Tr,
  useToast,
} from "@chakra-ui/react";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { motion } from "framer-motion";
import { useContext, useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import { FcCancel, FcCheckmark } from "react-icons/fc";
import { v4 } from "uuid";
import FormatBlank from "../../../components/FormatBlank";
import { context } from "../../../contexts/userContext";
import { auth, firestore, storage } from "../../../firebase/clientApp";
import { AddPrdInput } from "../../../items/addPrdInput";
const addProducts = () => {
  const [categorias, setCategorias] = useState([]);
  const [user, loading, error] = useAuthState(auth);
  const [subCategorias, setSubcategorias] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [showState, setShowState] = useState("");
  const toast = useToast();
  const ctx = useContext(context);
  const [formKey, setFormKey] = useState(10);
  const [addValue, setAddValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingImg, setLoadingImg] = useState(false);
  const formatSymbols = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/gi;
  const [images, setImages] = useState([]);
  const [imagesUrl, setImagesUrl] = useState([]);
  const [newCaracteristica, setNewCaracteristica] = useState({
    PropiedadC: "",
    ValorC: "",
    PropiedadO: "",
    ValorO: false,
  });
  const [caracteristicas, setCarateristicas] = useState([]);
  const [otros, setOtros] = useState([]);
  const [form, setForm] = useState({
    Nombre: "",
    Categoria: "",
    SubCat1: "",
    Precio: "",
    Marca: "",
    Modelo: "",
    UserID: "",
    Descripcion: "",
  });
  const PropiedadCRef = useRef(null);
  const ValorCRef = useRef(null);
  const PropiedadORef = useRef(null);

  const prepareSearchValue = (str) => {
    const firstArr = str
      .toLowerCase()
      .replaceAll(formatSymbols, " ")
      .replaceAll(/\s\s+/g, " ")
      .split(" ");
    const wordsToRmv = ["la", "del", "en", "de", "por", "al", "nuevo"];
    const finalArr = firstArr.filter((w) => !wordsToRmv.includes(w));
    return finalArr;
  };
  const checkAddValue = (str) => {
    if (str[0].toUpperCase() !== str[0]) return false;
    return true;
  };
  const selPortada = (i) => {
    const newImgs = [];
    let newPortada;
    let num = 0;
    while (num < images.length) {
      if (num !== i) newImgs.push(images[num]);
      else {
        newPortada = images[num];
      }
      num++;
    }
    setImages([newPortada, ...newImgs]);
  };
  const delImg = (i) => {
    const newImgs = [];
    let num = 0;
    while (num < images.length) {
      if (num !== i) newImgs.push(images[num]);
      num++;
    }
    setImages([...newImgs]);
  };

  const confirmProduct = async () => {
    try {
      await addDoc(collection(firestore, "Productos"), {
        Nombre: form.Nombre,
        Categoria: form.Categoria,
        SubCat1: form.SubCat1,
        Precio: parseInt(form.Precio),
        Img: imagesUrl,
        Marca: form.Marca,
        Modelo: form.Modelo,
        Descripcion: form.Descripcion,
        UserID: user.uid,
        SearchValues: prepareSearchValue(form.Nombre),
        Vendedor: ctx.sellerName,
        Caracteristicas: caracteristicas,
        Otros: otros,
      });
    } catch (error) {
      alert(error.message);
    }
  };
  const catCollectionRef = collection(firestore, "Categorias");
  useEffect(() => {
    const getCategorias = async () => {
      const data = await getDocs(catCollectionRef);
      setCategorias(data.docs.map((cat) => ({ ...cat.data(), id: cat.id })));
    };
    getCategorias();
  }, []);
  const onChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const onChangeImg = (e) => {
    const selectedFiles = e.target.files;
    setImages([...images, ...selectedFiles]);
  };
  const onSubmit = async () => {
    if (!form.Nombre || !form.Precio)
      return toast({
        title: `Completa todos los campos por favor`,
        status: "error",
        isClosable: true,
      });
    else if (images.length <= 0) {
      return toast({
        title: `Adjunta una imagen`,
        status: "error",
        isClosable: true,
      });
    } else {
      setLoadingImg(true);
      let newImages = [];
      for (let i = 0; i < images.length; i++) {
        newImages.push(await loadImage(images[i]));
      }
      setImagesUrl([...newImages]);
    }
  };
  useEffect(() => {
    if (imagesUrl.length === images.length && imagesUrl.length > 0) {
      confirmProduct();
      toast({
        title: `Producto agregado correctamente`,
        status: "success",
        isClosable: true,
      });
      setFormKey(formKey + 1);
      setImages([]);
      setCarateristicas([])
      setOtros([])
      setForm({
        Nombre: "",
        Categoria: "",
        SubCat1: "",
        Precio: "",
        Marca: "",
        Modelo: "",
        Descripcion: "",
      });
      setLoadingImg(false);
    }
  }, [imagesUrl]);
  useEffect(() => {
    const obj =
      form.Categoria &&
      categorias.filter((cat) => cat.id === form.Categoria)[0];
    obj.SubCat1 && setSubcategorias(obj.SubCat1);
    obj.Marcas && setMarcas(obj.Marcas);
    obj.Modelos && setModelos(obj.Modelos);
  }, [form.Categoria]);
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      SubCat1: "",
      Marca: "",
      Modelo: "",
    }));
  }, [form.Categoria]);
  const onClickUpdate = async (prop, state) => {
    if (addValue) {
      if (checkAddValue(addValue)) {
        setIsLoading(true);
        await updateDoc(doc(firestore, "Categorias", form.Categoria), {
          [prop]: [...state, addValue],
        });

        switch (prop) {
          case "SubCat1":
            setSubcategorias([...state, addValue]);
            break;
          case "Modelos":
            setModelos([...state, addValue]);
            break;
          case "Marcas":
            setMarcas([...state, addValue]);
            break;
        }
        setShowState("");
        setIsLoading(false);
        toast({
          title: `Actualizado correctamente`,
          status: "success",
          isClosable: true,
        });
      } else {
        return toast({
          title: `Debe comenzar con mayúscula`,
          status: "error",
          isClosable: true,
        });
      }
    } else {
      return toast({
        title: `Rellena el campo`,
        status: "error",
        isClosable: true,
      });
    }
  };
  const handleCancelar = () => {
    setShowState("");
    setAddValue("");
  };
  const handleAdd = (prop) => {
    if (!showState) {
      setShowState(prop);
    } else {
      toast({
        title: `Finaliza el cambio en curso`,
        status: "error",
        isClosable: true,
      });
    }
  };
  const loadImage = async (file) => {
    try {
      const storageRef = ref(
        storage,
        `${user.uid}/publicacion-${form.Nombre}/${
          v4() + "--fileName--" + file.name
        }`
      );
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    } catch (error) {
      alert(error.message);
    }
  };
  const onChangeCO = (e) => {
    setNewCaracteristica((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSwitch = () => {
    setNewCaracteristica((prev) => ({
      ...prev,
      ValorO: !newCaracteristica.ValorO,
    }));
  };
  const addCaracterística = () => {
    if (newCaracteristica.PropiedadC && newCaracteristica.ValorC) {
      setCarateristicas([
        ...caracteristicas,
        {
          Propiedad: newCaracteristica.PropiedadC,
          Valor: newCaracteristica.ValorC,
        },
      ]);
      setNewCaracteristica((prev) => ({ ...prev, PropiedadC: "", ValorC: "" }));
      PropiedadCRef.current.value = "";
      ValorCRef.current.value = "";
    } else {
      toast({
        title: `Completa ambos campos`,
        status: "error",
        isClosable: true,
      });
    }
  };
  const addOtro = () => {
    if (newCaracteristica.PropiedadO) {
      setOtros([
        ...otros,
        {
          Propiedad: newCaracteristica.PropiedadO,
          Valor: newCaracteristica.ValorO,
        },
      ]);
      setNewCaracteristica((prev) => ({
        ...prev,
        PropiedadO: "",
        ValorO: false,
      }));
      PropiedadORef.current.value = "";
    } else {
      toast({
        title: `Añade una propiedad`,
        status: "error",
        isClosable: true,
      });
    }
  };
  const deleteCaracteristica = (i) => {
    const newArr = caracteristicas.filter((e) => e !== caracteristicas[i]);
    setCarateristicas([...newArr]);
  };
  const deleteOtro = (i) => {
    const newArr = otros.filter((e) => e !== otros[i]);
    setOtros([...newArr]);
  };

  return (
    <FormatBlank title="Agregar Productos">
      <FormControl
        maxW="1500px"
        m="auto"
        borderRadius="10px"
        p={2}
        border="1px solid black"
        key={formKey}
      >
        <FormLabel>Titulo *</FormLabel>
        <Input mb={5} onChange={onChange} name="Nombre" />
        <FormLabel>Categoria *</FormLabel>
        {showState === "Categoria" ? (
          isLoading ? (
            <Progress m="22px" size="xs" isIndeterminate />
          ) : (
            <AddPrdInput
              onChangeValue={(e) => setAddValue(e.target.value)}
              placeHolder="Ingresa la nueva Categoria"
              onClickCancelar={() => handleCancelar()}
              onClickAceptar=""
            />
          )
        ) : (
          <Select
            name="Categoria"
            onChange={onChange}
            placeholder="Selecciona la categoria"
            borderColor="1px solid black"
          >
            {categorias.map((cat) => {
              return (
                <option key={cat.id} value={cat.id}>
                  {cat.id}
                </option>
              );
            })}
          </Select>
        )}
        <Flex>
          <Text
            textDecor="underline"
            ml={1}
            _hover={{ color: "blue.600" }}
            cursor="pointer"
            onClick={() => handleAdd("Categoria")}
          >{`Agregar una Categoria`}</Text>
        </Flex>
        {form.Categoria && (
          <Flex flexDir="column">
            <FormLabel mt={5}>Subcategoria</FormLabel>
            {showState === "SubCat1" ? (
              isLoading ? (
                <Progress m="22px" size="xs" isIndeterminate />
              ) : (
                <AddPrdInput
                  onChangeValue={(e) => setAddValue(e.target.value)}
                  placeHolder="Ingresa la nueva subcategoria"
                  onClickCancelar={() => handleCancelar()}
                  onClickAceptar={() => onClickUpdate("SubCat1", subCategorias)}
                />
              )
            ) : (
              <Select
                name="SubCat1"
                onChange={onChange}
                placeholder="Selecciona la subcategoria"
                borderColor="1px solid black"
              >
                {subCategorias
                  ? subCategorias.map((cat) => {
                      return (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      );
                    })
                  : ""}
                <option key="Otro" value="Otro">
                  Otro
                </option>
              </Select>
            )}
            <Flex>
              <Text
                textDecor="underline"
                ml={1}
                _hover={{ color: "blue.600" }}
                cursor="pointer"
                onClick={() => handleAdd("SubCat1")}
              >{`Agregar una Subcategoria`}</Text>
            </Flex>
          </Flex>
        )}

        <FormLabel mt={5}>Precio *</FormLabel>
        <Input onChange={onChange} name="Precio" type="number" />
        <FormLabel mt={5}>Imagen *</FormLabel>
        <Flex display="inline-block" flexDir="column">
          <Flex>
            <FormLabel htmlFor="file">
              <Flex>
                <Text
                  cursor="pointer"                  
                  p={2}                  
                  borderRadius="10px"
                  bgColor="gray.300"
                  _hover={{ color: "white", bgColor: "blue.300" }}
                >
                  Elegir una imagen
                </Text>
              </Flex>
              <Input
                pt={1}
                display="none"
                id="file"
                accept="image/*"
                type="file"
                multiple
                onChange={onChangeImg}                
                name="Img"
              />
            </FormLabel>
            {images.length > 0 && (
              <Button onClick={() => setImages([])} ml={5} bgColor="blue.300">
                Borrar Imagenes
              </Button>
            )}
          </Flex>
          {images.length > 0 && (
            <Flex flexWrap="wrap">
              {images &&
                Array.from(images)
                  .map((file) => {
                    return URL.createObjectURL(file);
                  })
                  .map((prv, i) => {
                    return (
                      <Flex
                        as={motion.div}
                        positionTransition
                        display="flex"
                        mr={2}
                        flexDir="column"
                        key={i}
                      >
                        <Image
                          as={motion.img}
                          whileHover={{
                            zIndex: 1,
                            position: "relative",
                            width: "200px",
                            maxWidth: "200px",
                            maxHeight: "200px",
                            height: "200px",
                          }}
                          transitionDuration={"0.1s"}
                          border={i === 0 && "3px solid blue"}
                          height={i === 0 ? "180px" : "135px"}
                          maxHeight={i === 0 ? "180px" : "135px"}
                          width={i === 0 ? "180px" : "135px"}
                          maxWidth={i === 0 ? "180px" : "135px"}
                          cursor="pointer"
                          onClick={i !== 0 ? () => selPortada(i) : null}
                          src={prv}
                          objectFit="cover"
                        />
                        {i === 0 && (
                          <Text align='center' fontWeight="bold">
                            Portada
                          </Text>
                        )}
                        <Flex align="center" flexDir="column">
                          <Button
                            mt={2}
                            bgColor="gray.300"
                            _hover={{ bgColor: "blue.200" }}
                            size="xs"
                            onClick={() => delImg(i)}
                            width="60%"
                            fontWeight="bold"
                            mb={1}
                          >
                            Borrar
                          </Button>
                        </Flex>
                      </Flex>
                    );
                  })}
            </Flex>
          )}
        </Flex>
        {form.SubCat1 && form.Categoria && (
          <Flex flexDir="column">
            <FormLabel mt={5}>Marca</FormLabel>
            {showState === "Marca" ? (
              isLoading ? (
                <Progress m="22px" size="xs" isIndeterminate />
              ) : (
                <AddPrdInput
                  onChangeValue={(e) => setAddValue(e.target.value)}
                  placeHolder="Ingresa la nueva marca"
                  onClickCancelar={() => handleCancelar()}
                  onClickAceptar={() => onClickUpdate("Marcas", marcas)}
                />
              )
            ) : (
              <Select
                name="Marca"
                onChange={onChange}
                placeholder="Selecciona la marca"
                borderColor="1px solid black"
              >
                {marcas
                  ? marcas.map((cat) => {
                      return (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      );
                    })
                  : ""}
                <option key="Otro" value="Otro">
                  Otro
                </option>
              </Select>
            )}
            <Flex>
              <Text
                textDecor="underline"
                ml={1}
                _hover={{ color: "blue.600" }}
                cursor="pointer"
                onClick={() => handleAdd("Marca")}
              >{`Agregar una Marca`}</Text>
            </Flex>
          </Flex>
        )}
        {form.SubCat1 && form.Categoria && (
          <Flex flexDir="column">
            <FormLabel mt={5}>Modelo</FormLabel>
            {showState === "Modelo" ? (
              isLoading ? (
                <Progress m="22px" size="xs" isIndeterminate />
              ) : (
                <AddPrdInput
                  onChangeValue={(e) => setAddValue(e.target.value)}
                  placeHolder="Ingresa el nueva modelo"
                  onClickCancelar={() => handleCancelar()}
                  onClickAceptar={() => onClickUpdate("Modelos", modelos)}
                />
              )
            ) : (
              <Select
                name="Modelo"
                onChange={onChange}
                placeholder="Selecciona el modelo"
                borderColor="1px solid black"
              >
                {modelos
                  ? modelos.map((cat) => {
                      return (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      );
                    })
                  : ""}
                <option key="Otro" value="Otro">
                  Otro
                </option>
              </Select>
            )}
            <Flex>
              <Text
                textDecor="underline"
                ml={1}
                _hover={{ color: "blue.600" }}
                cursor="pointer"
                onClick={() => handleAdd("Modelo")}
              >{`Agregar un Modelo`}</Text>
            </Flex>
          </Flex>
        )}
        <FormLabel mt={5}>Descripcion *</FormLabel>
        <Textarea onChange={onChange} name="Descripcion" />
        <FormLabel mt={5}>Características</FormLabel>
        <Stat>
          <StatHelpText fontSize="15px">
            Por cada carateristica ingresar "Propiedad" y "Valor", por ejemplo:
            "Peso" : "*** grs", "Sabor" : "vainilla"...
          </StatHelpText>
        </Stat>
        <Flex m={1} flexDir="column">
          <Flex justify="space-around" w="100%">
            <FormLabel m={1} fontSize="14px">
              Propiedad
            </FormLabel>
            <FormLabel m={1} fontSize="14px">
              Valor
            </FormLabel>
          </Flex>

          <Flex align="center">
            <Input
              onChange={onChangeCO}
              borderRadius="none"
              ref={PropiedadCRef}
              name="PropiedadC"
              size="sm"
              m={1}
              borderColor="black"
            />
            <Text fontSize="25px">:</Text>
            <Input
              onChange={onChangeCO}
              size="sm"
              name="ValorC"
              ref={ValorCRef}
              borderRadius="none"
              m={1}
              borderColor="black"
            />
            <Icon
              as={AiOutlinePlusCircle}
              cursor="pointer"
              fontSize="30px"
              borderRadius="10px"
              _hover={{ color: "#c7c7c7" }}
              onClick={addCaracterística}
            />
          </Flex>
          {caracteristicas.length > 0 && (
            <Flex m={5} border="1px solid #c7c7c7" borderRadius="8px">
              <TableContainer w="100%">
                <Table size="xl" variant="simple">
                  <Tbody>
                    {caracteristicas.map((car, i) => {
                      return (
                        <Tr key={i}>
                          <Td
                            w="48%"
                            bg={i % 2 === 0 && "#c0cbff"}
                            borderRadius='5px'
                          >
                            {car.Propiedad}
                          </Td>
                          <Td w="48%">{" "}: {car.Valor}</Td>

                          <Td>
                            <Icon
                              as={AiOutlineMinusCircle}
                              cursor="pointer"
                              fontSize="30px"
                              borderRadius="10px"
                              _hover={{ color: "blue.200" }}
                              onClick={() => deleteCaracteristica(i)}
                            />
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
            </Flex>
          )}
        </Flex>
        <FormLabel mt={5}>Otros</FormLabel>
        <Stat>
          <StatHelpText fontSize="15px">
            Otras carateristicas, con valor si o no, por ejemplo: "Apto para
            microondas":"No", "Es sumergible":"Si"...
          </StatHelpText>
        </Stat>
        <Flex m={1} flexDir="column">
          <Flex justify="space-around" w="100%">
            <FormLabel m={1} fontSize="14px">
              Propiedad
            </FormLabel>
            <FormLabel m={1} fontSize="14px">
              Valor
            </FormLabel>
          </Flex>
          <Flex align="center">
            <Input
              onChange={onChangeCO}
              size="sm"
              w="50%"
              name="PropiedadO"
              borderRadius="none"
              m={1}
              borderColor="black"
              ref={PropiedadORef}
            />
            <Text fontSize="25px">:</Text>

            <Flex flexGrow={1} align="center">
              <Flex
                flexGrow={7}
                border={`1px solid ${
                  newCaracteristica.ValorO ? "green" : "red"
                }`}
                align="center"
                justify="center"
                h="32px"
                ml={2}
                borderRadius="4px"
              >
                <Text
                  justifyContent="center"
                  color={newCaracteristica.ValorO ? "green" : "red"}
                >
                  {newCaracteristica.ValorO ? `Si` : `No`}
                </Text>
                <Icon as={newCaracteristica.ValorO ? FcCheckmark : FcCancel} />
              </Flex>
              <Flex align="center" justify="space-evenly" flexGrow={3}>
                <Switch
                  isChecked={newCaracteristica.ValorO}
                  name="ValorO"
                  onChange={handleSwitch}
                  size="md"
                />
                <Icon
                  as={AiOutlinePlusCircle}
                  cursor="pointer"
                  fontSize="30px"
                  borderRadius="10px"
                  _hover={{ color: "#c7c7c7" }}
                  onClick={addOtro}
                />
              </Flex>
            </Flex>
          </Flex>
          {otros.length > 0 && (
            <Flex m={5} border="1px solid #c7c7c7" borderRadius="8px">
              <TableContainer w="100%">
                <Table size="xl" variant="simple">
                  <Tbody >
                    {otros.map((otro, i) => {
                      return (
                        <Tr key={i}>
                          <Td
                            w="48%"
                            bg={i % 2 === 0 && "#c0cbff"}
                            borderRadius="5px"
                          >
                            {otro.Propiedad}
                          </Td>
                          <Td w="30%"> : {otro.Valor ? "Si" : "No"}</Td>
                          <Td >
                            <Icon                                                           
                              as={AiOutlineMinusCircle}
                              cursor="pointer"                              
                              fontSize="30px"
                              borderRadius="10px"
                              _hover={{ color: "blue.200" }}
                              onClick={() => deleteOtro(i)}
                            />
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
            </Flex>
          )}
        </Flex>
        <Button
          bgColor="blue.400"
          _hover={{ bgColor: "blue.200" }}
          mt={5}
          type="submit"
          onClick={onSubmit}
        >
          Agregar Producto
        </Button>
        {loadingImg && <Progress m="22px" size="xs" isIndeterminate />}
      </FormControl>
    </FormatBlank>
  );
};

export default addProducts;
