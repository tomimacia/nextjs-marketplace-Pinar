import { Text } from "@chakra-ui/react";
import Layout from "../components/Layout";

const About = () => {
  
  
  
  return (
    <Layout hasTransition={true} title='Sobre nosotros' mainTitle="Sobre nosotros">
      <Text 
        p={25}
        fontWeight="bold"
        fontStyle="oblique"
        pt={10}
        letterSpacing="1px"
        textAlign="justify"
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque eos
        dolores soluta omnis nobis consequuntur laudantium maiores, eveniet
        perspiciatis vitae, autem, cum reprehenderit libero inventore.
        Aspernatur dolores modi labore excepturi. Lorem, ipsum dolor sit amet
        consectetu Lorem ipsum dolor, sit amet consectetur adipisicing elit.
        Architecto necessitatibus blanditiis inventore perspiciatis beatae,
        provident, id dolor ducimus assumenda natus doloribus repudiandae quas?
        Saepe modi non aut earum quisquam corrupti! Lorem ipsum, dolor sit amet
        consectetur adipisicing elit. Pariatur rem voluptas consequatur
        obcaecati harum reprehenderit nesciunt doloribus ex est culpa fugit
        accusantium nam porro facilis aliquam tempora sequi, assumenda saepe.
      </Text>
    </Layout>
  );
};

export default About;
