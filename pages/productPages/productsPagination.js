import { Flex, Button, Text } from "@chakra-ui/react";

export const ProductsPagination = ({pagina, paginasTotales, handleAnterior, handleSiguiente}) => {
  return (
    <Flex>
      <Flex>
        {" "}
        {pagina > 1 && (
          <Button
            size="sm"
            m="auto"
            bg="blue.300"
            onClick={handleAnterior}
          >
            Anterior
          </Button>
        )}
      </Flex>
      <Text m="auto" p={3} fontWeight="bold">
        {pagina} de {paginasTotales}
      </Text>
      {pagina < paginasTotales && (
        <Button
          size="sm"
          m="auto"
          bg="blue.300"
          onClick={handleSiguiente}
        >
          Siguiente
        </Button>
      )}
    </Flex>
  );
};
{/* <Flex>
              <Flex>
                {" "}
                {page > 1 && (
                  <Button
                    size="sm"
                    m="auto"
                    bg="blue.300"
                    onClick={() => handlePagination(-1)}
                  >
                    Anterior
                  </Button>
                )}
              </Flex>
              <Text m="auto" p={3} fontWeight="bold">
                {page} de {pagesTotal}
              </Text>
              {page < pagesTotal && (
                <Button
                  size="sm"
                  m="auto"
                  bg="blue.300"
                  onClick={() => handlePagination(+1)}
                >
                  Siguiente
                </Button>
              )}
            </Flex> */}