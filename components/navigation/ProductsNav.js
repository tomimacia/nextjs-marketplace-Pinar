import {
  MenuItem,
  Menu,
  MenuButton,
  MenuList,
  Button,
  Flex,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { useSetRecoilState } from "recoil";
import { modState } from "../atoms/modalatom";
import { auth } from "../../firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";
export const ProductsNav = () => {
  const [user, loading, error] = useAuthState(auth);
  const setAuthModelState = useSetRecoilState(modState);

  return (
    <Flex>
      <Menu>
        <MenuButton _hover={{bg:'#aaa'}} as={Button} size="sm" rightIcon={<ChevronDownIcon />}>
          Categorias
        </MenuButton>
        <MenuList zIndex={15} width="40vw">
          <Link href="/productPages/productInterface?categoria=Deportes">
            <MenuItem _hover={{bg:'#aaa', borderRadius: '10px'}}>Deportes</MenuItem>
          </Link>
          <Link href="/productPages/productInterface?categoria=Herramientas">
            <MenuItem _hover={{bg:'#aaa', borderRadius: '10px'}}>Herramientas</MenuItem>
          </Link>
          <Link href="/productPages/productInterface?categoria=Inmuebles">
            <MenuItem _hover={{bg:'#aaa', borderRadius: '10px'}}>Inmuebles</MenuItem>
          </Link>
          <Link href="/productPages/productInterface?categoria=Tecnologia">
            <MenuItem _hover={{bg:'#aaa', borderRadius: '10px'}}>Tecnologia</MenuItem>
          </Link>
          <Link href="/productPages/productInterface?categoria=Supermercado">
            <MenuItem _hover={{bg:'#aaa', borderRadius: '10px'}}>Supermercado</MenuItem>
          </Link>
          <Link href="/productPages/productInterface?categoria=Vehiculos">
            <MenuItem _hover={{bg:'#aaa', borderRadius: '10px'}}>Vehiculos</MenuItem>
          </Link>
        </MenuList>
      </Menu>

      {user ? (
        <Link href="/ofertas">
          <Button
            display={["flex", "none", "none", "none"]}
            size="sm"
            ml={1}
            mr={1}
            _hover={{bg:'#aaa'}}
          >
            Ofertas
          </Button>
        </Link>
      ) : (
          <Button
            display={["flex", "none", "none", "none"]}
            size="sm"
            ml={1}
            mr={1}
            onClick={() => setAuthModelState({ open: true, view: "signup" })}
            _hover={{bg:'#aaa'}}
          >
            Registrate
          </Button>
      )}
      <Link href="/ofertas">
        <Button
          display={["none", "none", "flex", "flex"]}
          size="sm"
          ml={1}
          mr={1}
          onClick={""}
          _hover={{bg:'#aaa'}}
        >
          Ofertas
        </Button>
      </Link>
      <Link href="/ayuda">
        <Button
          display={["none", "none", "flex", "flex"]}
          size="sm"
          onClick={""}
          _hover={{bg:'#aaa'}}
        >
          Ayuda
        </Button>
      </Link>
    </Flex>
  );
};
