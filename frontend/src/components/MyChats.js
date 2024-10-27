import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import {
  Box,
  Button,
  Stack,
  Text,
  Tooltip,
  useToast,
  Spinner,
  Input,
} from "@chakra-ui/react";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getSender } from "../config/ChatLogics";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import SearchUser from "./miscellaneous/SearchUser";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState(null);

  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      //console.log("chat data", data);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "failed to fetch chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  useEffect(() => {
    // console.log("Check local storage")
    // console.log("chats",chats)
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    //console.log("local storage",localStorage.getItem("userInfo"));
    fetchChats();
  }, [fetchAgain]);
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p="3px"
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box>
        <SearchUser />
      </Box>
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work Sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p="3px"
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {loggedUser && chats ? (
          <Stack>
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px="3px"
                py="2px"
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat ? (
                    <>
                      {/* {console.log("chat.users[0]123._id", chat.users[0]._id)*/}
                      {/* {console.log("loggedUser._id123", loggedUser._id)}  */}
                      {getSender(loggedUser, chat.users)}

                      {/* {loggedUser.name} */}
                    </>
                  ) : (
                    chat.chatName
                  )}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
