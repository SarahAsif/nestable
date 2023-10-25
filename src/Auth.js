import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Auth = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    fetch("http://localhost:8000/users", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        const user = data.users.find((user) => user.username === username);

        if (user) {
          if (user.password === password) {
            // User logged in successfully with the correct password
            toast.success("Login successful!");
            // Perform login actions (e.g., set authentication state)
          } else {
            // Password is incorrect
            toast.error("Incorrect password. Please try again.");
            // Handle login error (incorrect password)
          }
        } else {
          // User not found (invalid username)
          toast.error("User not found. Please sign up or check your username.");
          // Handle login error (user not found)
        }
      })
      .catch((error) => {
        toast.error("An error occurred. Please try again later.");
        // Handle error
      });
  };

  const handleSignup = () => {
    fetch("http://localhost:8000/users", {
      // Endpoint for user signup
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        if (response.status === 200) {
          // User registered successfully
        } else {
          // Handle registration error
        }
      })
      .catch((error) => {
        // Handle error
      });
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Log In</button>
      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
};

export default Auth;
