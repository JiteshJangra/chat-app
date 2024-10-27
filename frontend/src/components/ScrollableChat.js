import ScrollableFeed from "react-scrollable-feed";
import { Tooltip, Avatar } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  //console.log("userid", user._id);
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,

                marginLeft: isSameSenderMargin(messages, m, i, user._id), //`${m.sender._id === user._id ? ("auto"):(i < messages.length - 1 && messages[i+1].sender._id===messages[i].sender._id ? "32px" : 0)}`,
                marginTop: isSameUser(messages, m, i, user._id) ? 5 : 10,
                marginRight: `${m.sender._id === user._id ? "10px" : 0}`,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
