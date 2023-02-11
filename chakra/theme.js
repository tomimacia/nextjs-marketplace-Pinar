import { extendTheme } from "@chakra-ui/react";
import { Button } from "./button";
export const theme = extendTheme({
  fonts: {
    logo: "Satisfy",
    heading: `'Roboto Mono', sans-serif`,
    text: `'Raleway', sans-serif`
  },
  colors: {
    300: "gray.700",
    600: "#5cb3bc",
  },
  breakpoints: {
    sm: "24em",
    md: "35em",
    lg: "45em",
    xl: "100em",
    "2xl": "96em",
  },
  // components: {
  //   Button,
  // },
});
