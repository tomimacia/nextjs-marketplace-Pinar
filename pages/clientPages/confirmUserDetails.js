import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Select,
  Text,
  useColorMode,
  useToast,
} from "@chakra-ui/react";
import { signOut, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";
import { modState } from "../../components/atoms/modalatom";
import { auth, firestore } from "../../firebase/clientApp";
import { sendEmailVerification } from "firebase/auth";

const confirmUserDetails = () => {
  const setAuthModelState = useSetRecoilState(modState);
  const { colorMode, setColorMode } = useColorMode();
  const [user, loading, error] = useAuthState(auth);
  const [selectedDate, setSelectedDate] = useState(null);
  const toast = useToast();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState("none");
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    tipoDeDni: "",
    pais: "",
    codigoDeArea: "",
    telefono: "",
    checkbox: false,
  });
  useEffect(() => {
    if (!user) router.push("/");
  }, []);

  useEffect(() => {
    setColorMode("light");
  }, [colorMode]);
  const handleCheckbox = () => {
    setForm({ ...form, checkbox: !form.checkbox });
  };
  const onChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  function todayDate(str) {
    return `${str.getDate()}/${str.getMonth() + 1}/${str.getYear() + 1900}`;
  }

  const confirmUser = async () => {
    await setDoc(doc(firestore, "users", user.uid), {
      nombre: form.nombre,
      apellido: form.apellido,
      fechaDeNacimiento: todayDate(selectedDate),
      email: user.email,
      dni: `${form.tipoDeDni} ${form.dni}`,
      pais: form.pais,
      telefono: form.telefono ? `+${form.codigoDeArea}-${form.telefono}` : "",
      direccion: "",
      deseaRecibirEmails: form.checkbox,
      fechaDeSuscripcion: new Date(),
    });
    updateProfile(user, { displayName: form.nombre });
  };
  
  const format = /[0-9`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  const handleSubmit = () => {
    if (format.test(form.nombre) || format.test(form.apellido))
      return toast({
        title: `Nombre o apellido invalido`,
        status: "error",
        isClosable: true,
      });
    else if (!form.pais || !selectedDate)
      return toast({
        title: `Complete los datos obligatorios por favor`,
        status: "error",
        isClosable: true,
      });
    else {
      toast({
        title: `Regitrado correctamente`,
        status: "success",
        isClosable: true,
      });
      confirmUser();
      setAuthModelState(() => ({
        view: "login",
        open: false,
      }));
      setIsOpen("grid");
      sendEmailVerification(user);
    }
  };

  return (
    <Flex>
      <Flex
        alignItems="center"
        flexDir="column"
        minH="100vh"
        maxH="100%"
        w="100vw"
        bg="blue.300"
        p={[0, 10, 10, 10]}
      >
        <Heading m={10}>Datos del usuario</Heading>
        <Flex
          borderRadius={[0, "20px", "20px", "20px"]}
          border="5px solid black"
          alignItems="center"
          flexDir="column"
          width={["100%", "80%", "80%", "80%"]}
          bg="white"
          p={[0, 0, 0, 10]}
        >
          <Heading as="h2" size="sm" mb={3}>
            Bienvenido {user ? user.email : ""}!
          </Heading>
          <Heading as="h3" size="sm" mb={3}>
            Completa los datos para continuar
          </Heading>
          <FormControl
            p={5}
            border="1px solid black"
            maxH="100%"
            w={["100%", "100%", "100%", "70%"]}
          >
            <FormLabel>* Nombre</FormLabel>
            <Input
              name="nombre"
              onChange={onChange}
              required
              placeholder="Ingrese su nombre completo"
            />
            <FormLabel>* Apellido</FormLabel>
            <Input
              name="apellido"
              onChange={onChange}
              required
              placeholder="Ingrese su apellido"
            />
            <FormLabel>* Fecha de nacimiento</FormLabel>
            <Box border="1px solid black">
              <DatePicker
                onChange={(date) => setSelectedDate(date)}
                selected={selectedDate}
                dateFormat="dd/MM/yyyy"
                name="date"
                scrollableYearDropdown
                showYearDropdown
                maxDate={new Date()}
                isClosable
              />
            </Box>
            <FormLabel>* Pais</FormLabel>
            <Select
              name="pais"
              onChange={onChange}
              placeholder="Seleccionar pais"
            >
              <option>Argentina</option>
              <option>Uruguay</option>
              <option>Paraguay</option>
              <option>Chile</option>
              <option>Bolivia</option>
              <option>Brasil</option>
              <option>Peru</option>
              <option>Colombia</option>
            </Select>
            <FormLabel>DNI</FormLabel>
            <Input
              name="dni"
              onChange={onChange}
              type="number"
              placeholder="Ingrese su DNI"
            />
            <FormLabel>Tipo de DNI</FormLabel>
            <Select
              name="tipoDeDni"
              onChange={onChange}
              placeholder="Tipo de DNI"
            >
              <option>Cédula de identidad</option>
              <option>Libreta de Enrolamiento</option>
              <option>DNI</option>
              <option>Libreta Cívica</option>
              <option>Otro</option>
            </Select>
            <FormLabel>Codigo de Area</FormLabel>
            <Input
              name="codigoDeArea"
              onChange={onChange}
              type="number"
              placeholder="Ej: 54"
            />
            <FormLabel>Numero de Telefono</FormLabel>
            <Input
              name="telefono"
              onChange={onChange}
              type="number"
              placeholder="Ej: 1141414141"
            />
            {/* activar para terminos y condiciones
            <Checkbox defaultChecked>
            <Text>Acepto los terminos y condiciones</Text>
          </Checkbox> */}
            <Checkbox
              border="1px black"
              name="checkbox"
              onChange={handleCheckbox}
            >
              <Text>Deseo recibir ofertas e informacion por email</Text>
            </Checkbox>
            <FormHelperText>* Campos requeridos</FormHelperText>
            <FormHelperText>
              La informacion es solo para el uso de la aplicacion.
            </FormHelperText>
            <FormHelperText>
              No compartiremos la informacion con nadie.
            </FormHelperText>
            <Button
              _hover={{ bg: "blue.200" }}
              fontSize="15px"
              fontWeight="bold"
              w="50%"
              mt={10}
              mb={3}
              bg="blue.400"
              ml="20%"
              type="submit"
              onClick={handleSubmit}
            >
              Confirmar
            </Button>
            <Flex width="100%">
              <Link href="/">
                <Button bg="gray.300" m="auto" onClick={() => signOut(auth)}>
                  Cerrar y volver al Inicio
                </Button>
              </Link>
            </Flex>
          </FormControl>
        </Flex>
      </Flex>
      <Box
        backdropFilter="auto"
        display={isOpen}
        pos="absolute"
        w="100%"
        h="100%"
        backdropBlur="4px"
        bg="(0, 0, 0, 0.5)"
      >
        <Box
          textAlign="center"
          alignItems="center"
          p={[2,5,10,10]}
          borderRadius='20px'
          border='1px solid black'
          m="auto"          
          h={[300,550,700,700]}
          w={["90%","75%","60%","60%"]}
          bg="blue.400"
        >
          <Heading fontSize={[15,22,25,30]} mb={10}>Bienvenido {form.nombre}!</Heading>
          <Text mb={5} fontSize={[10,17,20,25]}>
            Muchas gracias por suscribirte a Marketplace el Pinar. <br />
            Te hemos enviado un email de verificacion al correo{" "}
            {user ? user.email : ""} (si no aparece chequea la casilla de spam). <br />
            La verificacion es necesaria para poder realizar compras, pero ya
            puedes navegar por el sitio y consultar nuestros productos. <br /> Vuelve
            al inicio para comenzar a utilizar tu usuario.
          </Text>
          <Link href="/">
            <Button  size={['sm','sm','md','lg']}>Volver al inicio</Button>
          </Link>
        </Box>
      </Box>
    </Flex>
  );
};

export default confirmUserDetails;
