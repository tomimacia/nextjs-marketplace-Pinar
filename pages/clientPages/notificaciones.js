import { Box, Text } from "@chakra-ui/react";
import { FormatClient } from "../../components/client/FormatCliente";
const Notificaciones = () => {
  return (
    <Box>
      <FormatClient title="Notificaciones">
        <Text
          mt={5}
          align="center"
          fontSize={[10, 20, 20, 20]}
          color="blackAlpha.500"
        >
          No tienes notificaciones aun
        </Text>
      </FormatClient>
    </Box>
  );
};

export default Notificaciones;
