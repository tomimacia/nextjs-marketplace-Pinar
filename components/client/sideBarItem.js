import { Flex, Icon } from "@chakra-ui/react";
import Link from "next/link";

export const SideBarItem = ({ href, icon, children, bgProp }) => {
  return (
    <Link href={href}>
      <Flex
        bg={bgProp}
        justify="center"
        flexDir="column"
        _hover={{ bg: "blue.300", borderRadius: "5px" }}
        align="center"
        flexGrow={1}
        cursor="pointer"
      >
        <Flex w="100%" align="center">
          <Icon ml={3} as={icon} mr={2} />
          {children}
        </Flex>
      </Flex>
    </Link>
  );
};
