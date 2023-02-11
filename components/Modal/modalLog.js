import {
  Box,
  Button,
  Flex,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { signOut } from "firebase/auth";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState } from "recoil";
import { auth } from "../../firebase/clientApp";
import { modState } from "../atoms/modalatom";
import AuthInputs from "./AuthInputs";
import OAuthButtons from "./OAuthButtons";
import { useRouter } from "next/router";
import { useContext } from "react";
import { context } from "../../contexts/userContext";

const ModalTest = () => {
  const ctx = useContext(context)
  const router = useRouter();
  const [modalState, setModalState] = useRecoilState(modState);
  const [user, loading, error] = useAuthState(auth);
  const handleClose = () => {
    setModalState((prev) => ({
      ...prev,
      open: false,
    }));
  };

  useEffect(() => {
    if (user && user.displayName === null)
      router.push("clientPages/confirmUserDetails");
  }, [user]);

  useEffect(() => {
    if (user) handleClose();
  }, [user]);

  return (
    <Modal isOpen={modalState.open} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">
          {modalState.view === "login" && "Ingresa con tu email"}
          {modalState.view === "signup" && "Ingresa tu email"}
          {modalState.view === "resetPassword" && "Reset Password"}
          {modalState.view === "logout" && "Cerrar Sesion"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody
          display="flex"
          flexDir="column"
          alignItems="center"
          justifyContent="center"
          pb={6}
        >
          <Flex direction="column" align="center" justify="center" w="70%">
            {modalState.view === "logout" ? null : <OAuthButtons />}
            <Text color="gray.400" fontWeight={700}>
              {modalState.view === "logout" ? "" : "Or"}
            </Text>
            {modalState.view === "logout" && (
              <Box>
                <Text>Estas seguro que quieres cerrar sesion?</Text>
                <Link href="/">
                  <Button
                    isLoading={loading}
                    onClick={() => signOut(auth)}
                    bg="gray.300"
                    mt={10}
                    w="100%"
                  >
                    Cerrar Sesion
                  </Button>
                </Link>
              </Box>
            )}
            <AuthInputs />
            {/* <ResetPassword/> */}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalTest;
