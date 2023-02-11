import { Text } from "@chakra-ui/react";
import Link from "next/link";
import formBackground from "../../items/formBackgrond";

const NavItem = (props) => {
  return (
    <Text _hover={{ color: formBackground('white', 'gray.400') }} fontSize={18} fontWeight='bold'>
      <Link href={props.href}>{props.children}</Link>
    </Text>
  );
};

export default NavItem;
