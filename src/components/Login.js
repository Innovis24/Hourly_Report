import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import doctorIllustration from '../assets/img_2.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import './Login.css'


const apiUrl = "http://localhost/hourly_report/Login.php";
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [Array, setArray] = useState([]);
  const [currentuser, setcurrentuser] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

   useEffect(() => {
    getapi();
   }, []);
   
  
    const getapi = () => {
      axios
      .get(apiUrl)
      .then((response) => {
        setArray(response.data);
        setcurrentuser(response.data)
      })
      .catch((error) => console.error("Error fetching users:", error));
    }


  const handleSubmit = async (e) => {
    e.preventDefault();
    if(username === '' && password ===''){
      toast.error("Please enter username and password");
      return;
    }
    if(username === '' && password !==''){
      toast.error("Please enter username ");
      return;
    }
    if(username !== '' && password === ''){
      toast.error("Please enter password");
      return;
    }
    const filtered = Array.filter((item) => item.UserName === username); 
    if(filtered.length > 0 ){
      const filteredVal = filtered.filter((item) => item.Password === password && item.Status === "Active"); 
      if(filteredVal.length>0){
 
        const loginFilterVal = currentuser.filter((item) => item.UserName === username);
        localStorage.setItem('currentUsername',JSON.stringify(loginFilterVal));
        navigate("/hourly_report");
      }
      else{
        toast.error("Your username or password is incorrect. Kindly check it.");
    }
    }
    else{
        toast.error("Your username or password is incorrect. Kindly check it.");
    }
         // Navigate to the home page
  };
  
  return (
    <div className="login-container">
      <ToastContainer
        autoClose={500} // Auto-close in 20 seconds
        toastStyle={{ backgroundColor: "white", color: 'black', fontFamily: "'Roboto', sans-serif" }}
        progressStyle={{ background: 'white' }}
      />
      {/* Illustration Section */}
      <div className="login-illustration">
        <div className="login-image">
          <img
            src={doctorIllustration}
            alt="Doctor profile"
            className="illustration-img responsive-image" />
        </div>
        {/* Login Form Section */}
        <div className="login-form-container login-form">
          <div className="login-form-wrapper">
            {/* <h1 className="login-title">Doctor Management</h1>
            <div className="login_font_style"> Login</div> */}
            <h1 className="login-title">Login</h1>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <div htmlFor="username" className="form-label wifth_90">
                <b>Username</b>
                </div>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="form-input1"
                  placeholder="Enter your username"
                  value={username}
                  autoComplete="off"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="form-group mrn_bottom15">
                <label htmlFor="password" className="form-label wifth_90">
                  <b>Password</b>
                </label>
                <div style={{ display: "flex", alignItems: "center" }} className="pwd_style">

                  {/* <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                /> */}
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    className="form-input1 "
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"

                  />
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    style={{
                      cursor: "pointer",
                      color: "#666",
                      marginLeft: "-10%",

                    }}
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </div>
              </div>

              {/* <div className="form-footer">
                <div
                  className="forget_pwd"
                >
                  <button className="button_login_color" onClick={forgetPassword}>
                    Forget password
                  </button>
                </div>
              </div> */}
              <div className="logjustify">
                <button className="loginBtn" >
                  Login
                </button>
              </div>
              <div className="register-prompt">
                {/* <p className="acc_mrg_btm">Don't have an account?</p> */}
                <div
                  className="signuplg"
                >
                  {/* <button className="button_login_color" onClick={handleRegisterClick}>
                    Sign up
                  </button> */}

                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;