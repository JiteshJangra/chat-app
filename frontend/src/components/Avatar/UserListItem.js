import React from "react";
import { Avatar, Box, Text } from "@chakra-ui/react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="#E8E8F8"
      _hover={{
        background: "#b06841",
        color: "white",
      }}
      w="100%"
      display="flex"
      alignItems="center"
      color="black"
      px="5px"
      py="2px"
      mb="4px"
      borderRadius="lg"
    >
      <Avatar
        mr="2px"
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.pic}
      />
      <Box >
        <Text>{user.name}</Text>
        <Text fontSize="xs">
          <b>Email: {user.email}</b>
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
