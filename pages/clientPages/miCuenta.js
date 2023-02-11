import { Box, Flex } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FormatClient } from "../../components/client/FormatCliente";
import { context } from "../../contexts/userContext";
import { auth } from "../../firebase/clientApp";
import { UserDataListItem } from "../../items/userDataListItem";
import { Text } from "@chakra-ui/react";
import { BeatLoader } from "react-spinners";

const MiCuenta = () => {
  const [user, loading, error] = useAuthState(auth);
  const [blur, setBlur] = useState(true);
  const ctx = useContext(context);
  const clickBlur = () => {
    setBlur(!blur);
  };
  return (
    <Box>
      {user ? (
        <FormatClient title="Mi Cuenta">
          {ctx.email ? (
            <Box>
              <UserDataListItem blurProp={blur} isEmail title="Email:">
                {ctx && ctx.email}
              </UserDataListItem>
              <UserDataListItem
                onClickBlur={() => clickBlur()}
                blurProp={blur}
                title="Nombre:"
                userProp="nombre"
              >
                {ctx && ctx.nombre}
              </UserDataListItem>
              <UserDataListItem
                onClickBlur={() => clickBlur()}
                blurProp={blur}
                title="Apellido:"
                userProp="apellido"
              >
                {ctx && ctx.apellido}
              </UserDataListItem>
              <UserDataListItem
                onClickBlur={() => clickBlur()}
                blurProp={blur}
                title="Nacionalidad:"
                inputType="select"
                userProp="pais"
              >
                {ctx && ctx.pais}
              </UserDataListItem>
              <UserDataListItem
                onClickBlur={() => clickBlur()}
                blurProp={blur}
                title="Telefono:"
                userProp="telefono"
              >
                {ctx && ctx.telefono}
              </UserDataListItem>
              <UserDataListItem
                onClickBlur={() => clickBlur()}
                blurProp={blur}
                title="Nacimiento:"
                inputType="date"
                userProp="fechaDeNacimiento"
              >
                {ctx.fechaDeNacimiento ? ctx.fechaDeNacimiento : "Sin definir"}
              </UserDataListItem>
              <UserDataListItem
                onClickBlur={() => setBlur(!blur)}
                blurProp={blur}
                title="Dni:"
                inputType="number"
                userProp="dni"
              >
                {ctx && ctx.dni}
              </UserDataListItem>
              <UserDataListItem
                onClickBlur={() => setBlur(!blur)}
                blurProp={blur}
                title={
                  <>
                    Direccion:
                    <br /> Localidad:
                    <br /> Codigo Postal:
                  </>
                }
                userProp="direccion"
              >
                <Flex w="100%" flexDir="column">
                  <Text>
                    {ctx.direccion
                      ? ctx.direccion.direccion
                        ? ctx.direccion.direccion
                        : "Sin definir"
                      : "Sin definir"}
                  </Text>
                  <Text>
                    {ctx.direccion
                      ? ctx.direccion.localidad
                        ? ctx.direccion.localidad
                        : "Sin definir"
                      : "Sin definir"}
                  </Text>
                  <Text>
                    {ctx.direccion
                      ? ctx.direccion.codigoPostal
                        ? ctx.direccion.codigoPostal
                        : "Sin definir"
                      : "Sin definir"}
                  </Text>
                </Flex>
              </UserDataListItem>
            </Box>
          ) : (
            <Flex mt={10} justify="center">
              <BeatLoader color="#68EBBB" />
            </Flex>
          )}
        </FormatClient>
      ) : (
        <FormatClient title="Mi Cuenta">
          <Text
            mt={5}
            align="center"
            fontSize={[10, 20, 20, 20]}
            color="blackAlpha.500"
          >
            Inicia sesion 
          </Text>
        </FormatClient>
      )}
    </Box>
  );
};

export default MiCuenta;
