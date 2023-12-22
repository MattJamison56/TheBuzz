import React, { useState } from 'react';
import './Signin.css';
import FormInput from './FormInput';

function Signin(props) {
    const [loginVisible, toggleLoginPage] = useState(false);
    const [registerVisible, toggleRegisterPage] = useState(false);

    const [registervalues, setRegisterValues] = useState({
        regusername: "",
        regemail: "",
        regpassword: "",
        regconfirmPassword: "",
      });
    const [loginvalues, setLoginValues] = useState({
        loginemail: "",
        loginpassword: ""
      });
    
      const registerinputs = [
        {
          id: 1,
          name: "regusername",
          type: "text",
          placeholder: "Username",
          errorMessage:
            "Username should be 3-16 characters and shouldn't include any special character!",
          pattern: "^[A-Za-z0-9]{3,16}$",
          required: true,
        },
        {
          id: 2,
          name: "regemail",
          type: "email",
          placeholder: "Email",
          errorMessage: "It should be a valid email address!",
          required: true,
        },
        {
          id: 3,
          name: "regpassword",
          type: "password", 
          placeholder: "Password",
          errorMessage:
            "Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!",
          pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$`,
          required: true,
        },
        {
          id: 4,
          name: "regconfirmPassword",
          type: "password",
          placeholder: "Confirm Password",
          errorMessage: "Passwords don't match!",
          pattern: registervalues.regpassword,
          required: true,
        },
      ];

      const logininputs = [
        {
          id: 0,
          name: "loginemail",
          type: "email",
          placeholder: "Email",
          errorMessage: "It should be a valid email address!",
          required: true
        },
        {
          id: 1,
          name: "loginpassword",
          type: "password",
          placeholder: "Password",
          errorMessage:
            "Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!",
          pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$`,
          required: true
        }
      ];
      
      const handleNotification= async (message) => {
        props.setNotification(message);
      }

      const handleError= async (error) => {
        props.setError(error);
      } 

      const handleUserID= async (user_id) => {
        props.setUserID(user_id);
        console.log("inside signin the userID is: " + user_id)
      } 

      const handleLoginSubmit = async (logininfo) => {
        try {
            // Perform a POST request to your backend API using the fetch API
            console.log(logininfo)
            const result = await fetch("http://localhost:5000/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(logininfo),
          })

          const loginresults = await result.json();
          if (loginresults.message !== "Login successful!") {
            throw new Error(loginresults.message);
          }
          else {
            handleUserID(loginresults.user_ID);
            closeForms();
          }
        
        } catch (error) {
          handleError(error);
        }
      };

      const handleRegisterSubmit = async (registerinfo) => {
        try {
            // Perform a POST request to your backend API using the fetch API
            const result = await fetch("http://localhost:5000/register", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(registerinfo),
          })
          const accountresults = await result.json();
          
          if (accountresults !== "Registration Successful!") {
            throw new Error(accountresults);
          }
          else {
              closeForms();
              handleNotification(accountresults);
          }
          
        } catch (error) {
          console.log(error);
          handleError(error);
        }
      };

    
      const onRegChange = (e) => {
        setRegisterValues({ ...registervalues, [e.target.name]: e.target.value });
      };

      const onLoginChange = (e) => {
        setLoginValues({ ...loginvalues, [e.target.name]: e.target.value });
      };


    const openLoginPage = () => {
        toggleLoginPage(true);
        toggleRegisterPage(false);
        console.log("loginpage");
    }

    const openRegisterPage = () => {
        toggleRegisterPage(true);
        toggleLoginPage(false);
        console.log("registerpage");
    }

    const closeForms = () => {
        toggleLoginPage(false);
        console.log("loginpageclosed");
        toggleRegisterPage(false);
        console.log("registerpageclosed");
        setRegisterValues({
          regusername: "",
          regemail: "",
          regpassword: "",
          regconfirmPassword: "",
        });
        setLoginValues({
          loginemail: "",
          loginpassword: ""
        });
    }

    return (
        <div>
            <div className="login-buttons">
                <button onClick={openLoginPage} className="login">Login</button>
                <button onClick={openRegisterPage} className="register">Register</button>
            </div>
            <div className={`login-form ${loginVisible ? 'visible' : ''}`}>
                    <form onSubmit={(e) => { e.preventDefault(); handleLoginSubmit(loginvalues); }}>
                        <h1>Login</h1>
                        {logininputs.map((input) => (
                        <FormInput
                            key={input.id}
                            {...input}
                            value={loginvalues[input.name]}
                            onChange={onLoginChange}
                        />
                        ))}
                        <button className="submit-button">Login</button>
                    </form>
                    <button onClick={ closeForms } className="exit-button">x</button>
            </div>
            <div className={`register-form ${registerVisible ? 'visible' : ''}`}>
                    <form onSubmit={(e) => { e.preventDefault(); handleRegisterSubmit(registervalues); }}>
                        <h1>Register</h1>
                        {registerinputs.map((input) => (
                        <FormInput
                            key={input.id}s
                            {...input}
                            value={registervalues[input.name]}
                            onChange={onRegChange}
                        />
                        ))}
                        <button className="submit-button">Register</button>
                    </form>
                    <button onClick={ closeForms } className="exit-button">x</button>
                </div>
            </div>
    );
}

export default Signin