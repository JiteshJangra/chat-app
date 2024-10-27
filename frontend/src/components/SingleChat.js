import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const toast = useToast();
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      //console.log(messages);
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error occured",
        description: "failed to load message123",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);
  console.log(notification, "-------------");
  useEffect(() => {
    socket.on("message recieved", (newMesaageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMesaageRecieved.chat._id
      ) {
        if (!notification.includes(newMesaageRecieved)) {
          setNotification([newMesaageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else setMessages([...messages, newMesaageRecieved]);
    });
  });

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        //console.log(data);
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error occured",
          description: "failed to fetch message",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    //console.log(e.target.value);

    if (!socketConnected) return;

    // if (e.target.value.length === 0) {
    //   socket.emit("stop typing", selectedChat._id);
    //   console.log("hellow");
    //   setTyping(false);
    //   return;
    // }
    //console.log("istyping1", isTyping);
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    //console.log("istyping1", isTyping);
    let lastTypingTime = new Date().getTime();
    var timerLength = 5000;

    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
      //console.log("istyping3", isTyping);
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            display="flex"
            alignItems="center"
            justifyContent={{ base: "space-between" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work Sans"
            //bg="white"
          >
            <IconButton
              colorScheme="blue"
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => {
                setSelectedChat("");
              }}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            pb={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3} key="123">
              {isTyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 20 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                colorScheme="blue"
                placeholder="enter a message"
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work Sans">
            Click on a user to chat
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
