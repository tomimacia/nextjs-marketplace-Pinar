import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
  Flex,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import ContainerForm from "../components/containerForm";
import Link from "next/link"

const Registro = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <ContainerForm>
      <Flex
        maxH="100vh"
        maxW="100%"
        w="100%"
        h="100vh"
        justifyItems="center"
        display="grid"
        placeItems="center"
      >
        <Box display='flex' m="auto" bg="white" height="300px" width="300px">
          <Button m='auto' onClick={onOpen}>Open Modal</Button>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Modal Title</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nam,
                ipsa? Ipsam quis, ducimus similique architecto laboriosam quos
                reiciendis molestiae? Labore deserunt modi perferendis quidem
                qui nesciunt temporibus. Iure, eum nihil?
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Close
                </Button>
                <Link href='/'>
                  <Button >Back home</Button>
                </Link>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      </Flex>
    </ContainerForm>
  );
};

export default Registro;
