import { VStack, FormControl, FormLabel, Toast } from "@chakra-ui/react";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Button } from "@chakra-ui/react";
import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import axios from 'axios';
import {useHistory} from 'react-router-dom'

const Signup = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmpassword, setConfirmPassword] = useState();
  const [pic, setPic] = useState();
  const [show, setShow] = useState();
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const toast = useToast();
  const postDetails = (pics) => {
    

    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "please select a image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false)
      return;
    }
    if (pics.type !== "image/jpeg" && pics.type !== "image/png") {
      toast({
        title: "Please Select a JPEG or PNG Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const formData = new FormData();
      formData.append("file", pics);
      formData.append("upload_preset", "chat-app");
      formData.append("cloud_name", "dtqaicwyw");

      axios.post("https://api.cloudinary.com/v1_1/dtqaicwyw/image/upload", formData)
      
        .then((res) => {
          //console.log("cloudinary response", res)
        //console.log(res.data.url.toString());
          setPic(res.data.url.toString()); // Use secure_url instead of url for HTTPS link
          setLoading(false); // Stop loading when the image is uploaded
          toast({
            title: "Image uploaded successfully",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        }).catch((err) => {
          console.log(err);
          setLoading(false);
      })
    }

  };

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmpassword)
    {
      toast({
        title: "Please fill al the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    if (password !== confirmpassword)
    {
      toast({
        title: "Passwors don't match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      const config = { 
        headers: {
          "Content-type": "application/json",

        }
      }
      const { data } = await axios.post("/api/user", { name, email, password, pic }, config);
      toast({
        title: "Registration successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Error",
        description:error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false)
    }

  };
  return (
    <VStack spacing={4} color="black">
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
        ></Input>
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        ></Input>
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          ></Input>
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={(e) => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm your password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Input>
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={(e) => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic">
        <FormLabel>Upload your picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        ></Input>
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
