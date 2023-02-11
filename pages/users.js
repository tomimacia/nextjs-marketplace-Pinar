import Container from "../components/container";
import { initializeApp } from "firebase/app";
import { doc, getFirestore } from "firebase/firestore";
import { firestore } from "../firebase/clientApp";
import { useState, useEffect } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { Box, Button, Flex, FormLabel, Input, Text, FormControl } from "@chakra-ui/react";

const Users = () => {
  
  const [users, setUsers] = useState([]);
  
  const usersCollectionRef2 = collection(firestore, "users");
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState(0);

  
  const createUser = async () => {
    await addDoc(usersCollectionRef2, { name: newName, edad: Number(newAge) });
  };
  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef2);
      setUsers(data.docs.map((user) => ({ ...user.data(), id: user.id })));
    };
    getUsers();
  }, []);

  return (
    <Container title="Users">
      <Flex flexWrap='wrap'>
        {users.map((user) => {
          return (
            <Box m={5} key={user.id}>
              <Text fontWeight="bold">Nombre: {user.name}</Text>
              <h1>Edad: {user.edad}</h1>
              <Button borderRadius="none" size={5} fontSize="small">
                Eliminar
              </Button>
            </Box>
          );
        })}
      </Flex>
      <FormControl display='flex' isRequired flexDir='column' align='center' width='100%'>
        <FormLabel ml='25%' width='50%' mt={2} bg='green.300'>Nombre</FormLabel>
        <Input color='black' ml='25%' width='50%'
          placeholder="Ej: Juan"
          bg="white"          
          type="text"
          onChange={(e) => {
            setNewName(e.target.value);
          }}
        />
        <FormLabel ml='25%' width='50%' mt={2} bg='green.300'>Edad</FormLabel>
        <Input color='black' ml='25%' width='50%'          
          bg="white"
          placeholder="Ej: 20"
          type="number"
          onChange={(e) => {
            setNewAge(e.target.value);
          }}
        />
        <Button ml='25%' width='50%' mt={2} onClick={createUser}>Agregar user</Button>
      </FormControl>
    </Container>
  );
};

export default Users;
