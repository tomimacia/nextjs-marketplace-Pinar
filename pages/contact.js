import { EmailIcon, Icon, PhoneIcon } from "@chakra-ui/icons";
import { Box, Flex, Link, Stack, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import {
  BsDiscord, BsFacebook, BsInstagram, BsTelegram, BsTwitter, BsWhatsapp
} from "react-icons/Bs";

import Layout from "../components/Layout";

const Contact = () => {  
  
  return (
    <Layout hasTransition={true} title="Contacto" mainTitle="Contacto">
      <Stack fontWeight="bold" p={5} spacing={7} fontSize={18}>
        <Box>
          <PhoneIcon />
          <Text>1161685959</Text>
        </Box>
        <Box>
          <EmailIcon />
          <Text>somemail@gmail.com</Text>
        </Box>
        <Flex color="black" fontSize={22} pt={0}>
          <Link href="https://www.instagram.com/" target="_blank">
            <Icon as={BsInstagram} ml={5} />
          </Link>
          <Link href="https://www.twitter.com/" target="_blank">
            <Icon as={BsTwitter} ml={5} />
          </Link>

          <Link href="https://wa.me/541161616161" target="_blank">
            <Icon as={BsWhatsapp} ml={5} />
          </Link>
          <Link href="https://www.facebook.com/" target="_blank">
            <Icon as={BsFacebook} ml={5} />
          </Link>

          <Link href="https://www.discord.com/" target="_blank">
            <Icon as={BsDiscord} ml={5} />
          </Link>

          <Link href="https://www.telegram.com/" target="_blank">
            <Icon as={BsTelegram} ml={5} />
          </Link>
        </Flex>
      </Stack>
    </Layout>
  );
};

export default Contact;
