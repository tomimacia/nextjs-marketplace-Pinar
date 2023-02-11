import { Box } from "@chakra-ui/react"
import formBackground from "../../items/formBackgrond"
import { a , b } from "../../chakra/bgColors"
const ModalBgForm = (props) => {
  return (
    <Box 
    maxW="100%"
    w="100%"
    minH="100vh"
    maxH="100%"
    h="100%"      
    bgGradient={formBackground(a, b)}
    blur='2px'>
        {props.children}

    </Box>
  )
}

export default ModalBgForm
