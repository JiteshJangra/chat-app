import {
  Box,
  
  useDisclosure,
  Input,
  useToast,
} from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";

import React, { useState } from "react";

import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../Avatar/UserListItem";

const SearchUser = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const { onClose } = useDisclosure();

  const toast = useToast();
  const handleSearch = async (query) => {
        try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${query}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to load search  results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    } finally {
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      
      const { data } = await axios.post("/api/chat", { userId }, config);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoading(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Box display="flex" pb={2}>
        <Input
          placeholder="Search by name or email"
          mr={2}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            handleSearch(e.target.value);
          }}
        />
      </Box>
      <Box textAlign="center">
        {loading ? (
          <ChatLoading />
        ) : (
          search &&
          (searchResult?.length > 0 ? (
            searchResult.map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={() => accessChat(user._id)}
              />
            ))
          ) : (
            <p>No users found</p>
          ))
        )}
        {/* {loadingChat && <Spinner ml="auto" display="flex" />} */}
      </Box>
    </>
  );
};
export default SearchUser;
