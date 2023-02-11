import { Box, Text } from "@chakra-ui/react";
import {FormatClient} from "../../components/client/FormatCliente"
const Configuracion = () => {
  return (
    <Box>
        <FormatClient title='Configuracion'> 
        <Text>Texo de mi cuenta</Text>        
        </FormatClient>
    </Box>
  );
};

export default Configuracion;