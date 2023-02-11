import { Flex, Button, Input } from "@chakra-ui/react";

export const AddPrdInput = ({
  onChangeValue,
  placeHolder,
  onClickCancelar,
  onClickAceptar,
}) => {
  return (
    <Flex>
      <Input
        onChange={onChangeValue}
        autoFocus
        borderColor="black"
        placeholder={placeHolder}
      />
      <Button ml={1} mr={1} bg="blue.300" onClick={onClickAceptar}>
        Agregar
      </Button>
      <Button bg="blue.300" onClick={onClickCancelar}>
        Cancelar
      </Button>
    </Flex>
  );
};
