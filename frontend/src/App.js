import "./App.css";
import ChatPage from "./pages/ChatPage";
//import { Button } from "@chakra-ui/react";
import Homepage from "./pages/Homepage";
import { Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Route path="/" component={Homepage} exact></Route>
      <Route path="/chats" component={ChatPage}></Route>
    </div>
  );
}

export default App;
