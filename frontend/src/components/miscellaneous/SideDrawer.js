import {
  Box,
  Button,
  Menu,
  MenuList,
  MenuButton,
  Text,
  MenuItem,
  MenuDivider,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { ChatState } from "../../Context/ChatProvider";
import { useHistory } from "react-router-dom";
import React from "react";
import ProfileModal from "./ProfileModal";
import UserListItem from "../Avatar/UserListItem";
import { getSender } from "../../config/ChatLogics";
import { Effect } from "react-notification-badge";
import NotificationBadge from "react-notification-badge";

const SideDrawer = () => {
  const { user, notification, setNotification, setSelectedChat } = ChatState();
  const history = useHistory();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  //   if (!search) {
  //     toast({
  //       title: "PleaseEnter something in search",
  //       status: "warning",
  //       duration: 5000,
  //       isClosable: true,
  //       position: "top",
  //     });
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     const config = {
  //       headers: {
  //         Authorization: `Bearer ${user.token}`,
  //       },
  //     };
  //     const { data } = await axios.get(`/api/user?search=${search}`, config);
  //     setLoading(false);
  //     setSearchResult(data);
  //   } catch (error) {
  //     toast({
  //       title: "Error Occured",
  //       description: "Failed to load search  results",
  //       status: "error",
  //       duration: 5000,
  //       isClosable: true,
  //       position: "bottom-left",
  //     });
  //   }
  // };

  // const accessChat = async (userId) => {
  //   try {
  //     setLoadingChat(true);
  //     const config = {
  //       headers: {
  //         "Content-type": "application/json",
  //         Authorization: `Bearer ${user.token}`,
  //       },
  //     };
  //     const { data } = await axios.post("/api/chat", { userId }, config);
  //     if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
  //     setSelectedChat(data);
  //     setLoading(true);
  //     onClose();
  //   } catch (error) {
  //     toast({
  //       title: "Error fetching chat",
  //       description: error.message,
  //       status: "error",
  //       duration: 5000,
  //       isClosable: true,
  //       position: "bottom-left",
  //     });
  //   }
  // };
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderwidth="5px"
      >
        <Text fontSize="2xl" fontFamily="Work sans" ml="30px">
          Talk-A-Tive
        </Text>
        <Box ml="29vw">
          <UserListItem user={user} />
        </Box>
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
    </>
  );
};

export default SideDrawer;
