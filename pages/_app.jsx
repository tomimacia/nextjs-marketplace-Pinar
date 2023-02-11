import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../chakra/theme";
import { RecoilRoot } from "recoil";
import { UserProvider } from "../contexts/userContext";
import '@fontsource/roboto-mono/400.css'
import '@fontsource/raleway/200.css'

export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <RecoilRoot>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </RecoilRoot>
    </UserProvider>
  );
}
