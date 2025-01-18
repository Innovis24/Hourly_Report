import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #f4f4f4, #e9ecef);
  font-family: 'Arial', sans-serif;
`;

const Form = styled.form`
  width: 100%;
  max-width: 500px; /* Increased size */
  background: #fff;
  padding: 40px; /* Increased padding */
  border-radius: 16px; /* Softer corners */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.8s ease-in-out;
  text-align: center;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Title = styled.h2`
  margin-bottom: 30px; /* More space */
  font-size: 32px; /* Bigger font size */
  color: #333;
  font-weight: 600;
  letter-spacing: 1.2px;
`;

const FormGroup = styled.div`
  margin-bottom: 25px; /* More vertical space */
  text-align: left;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 10px; /* Slightly bigger spacing */
  font-size: 16px; /* Bigger font size */
  color: #555;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px; /* More padding */
  font-size: 16px; /* Larger font size */
  border: 1px solid #ddd;
  border-radius: 8px;
  outline: none;
  box-sizing: border-box;
  background-color: #fafafa;
  transition: border-color 0.3s, box-shadow 0.3s;

  &:focus {
    border-color: #1d8ea5;
    box-shadow: 0 0 8px rgba(29, 142, 165, 0.5);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 14px 20px; /* Larger button */
  background: linear-gradient(135deg, #1d8ea5, #147b8e);
  color: #fff;
  font-size: 18px; /* Bigger font */
  font-weight: bold;
  border: none;
  border-radius: 8px; /* Softer corners */
  cursor: pointer;
  transition: transform 0.2s, background 0.3s;

  &:hover {
    background: linear-gradient(135deg, #137b8e, #0f6a77);
    transform: translateY(-3px);
  }
`;

const RegisterLink = styled.div`
  margin-top: 25px; /* More space above */
  font-size: 16px; /* Slightly larger text */
  color: #555;

  a {
    color: #1d8ea5;
    text-decoration: none;
    font-weight: bold;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin-top: 10px;
`;


function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost/hourly_report/Login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.isValid) {
        console.log("Login successful:", data);
        navigate("/"); // Navigate to the home page
      } else {
        // Login failed
        setError(data.message || "Invalid username or password");
      }
    } catch (error) {
      setError("Something went wrong. Please try again later.");
      console.error("Login error:", error);
    }
  };
  
  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>Login</Title>
        <FormGroup>
          <Label htmlFor="username">Username</Label>
          <Input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormGroup>
        <SubmitButton type="submit">Login</SubmitButton>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Form>
    </Container>
  );
}

export default Login;