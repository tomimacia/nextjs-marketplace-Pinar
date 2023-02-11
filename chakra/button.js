// No esta en uso

import { ComponentStyleConfig } from "@chakra-ui/theme";

export const Button = {
  basesStyles: {
    bg: "white",
    border: "1px solid",
    borderRadius: "60px",
    fontSize: "10pt",
    fontWeight: "700",
    _focus: { boxShadow: "none" },
  },
  variants: {
    solid: {
      color: "white",
      borderRadius: "60px",
      bg: "blue.500",
      _hover: { bg: "blue.400" },

    },
  },
};
