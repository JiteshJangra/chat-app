import { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState();
  const [notification, setNotification] = useState([]);
  const history = useHistory();
  //console.log("chats");
   useEffect(() => {
     const checkUserLoggedIn = () => {
       const userInfo = JSON.parse(localStorage.getItem("userInfo"));
       if (userInfo) {
         setUser(userInfo);
       } else {
         setUser(null);
         history.push("/");
       }
     };

     checkUserLoggedIn();

     // Set up an event listener for storage changes
     window.addEventListener("storage", checkUserLoggedIn);

     // Clean up the event listener
     return () => {
       window.removeEventListener("storage", checkUserLoggedIn);
     };
   }, [history]);

   const login = (userData) => {
     localStorage.setItem("userInfo", JSON.stringify(userData));
     setUser(userData);
   };

   const logout = () => {
     localStorage.removeItem("userInfo");
     setUser(null);
     history.push("/");
   };
  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        login,
        logout,
        notification,setNotification
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
