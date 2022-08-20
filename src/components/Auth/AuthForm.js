import { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import classes from './AuthForm.module.css';
import AuthContext from "../../store/auth-context";

const AuthForm = () => {
    const navigate = useNavigate();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const authCtx = useContext(AuthContext);

  const submitHandler = (event) => {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;



    setIsLoading(true);

    if(isLogin) {
        //sign-in mode
        fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDgF15A3TX2oe8BVR3aM553_TDO-AVMNLI',
            {
                method: 'POST',
                body: JSON.stringify({
                    email: enteredEmail,
                    password: enteredPassword,
                    returnSecureToken: true
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then(res => {
            setIsLoading(false);
            if(res.ok) {
                return res.json();
            } else {
                return res.json().then(data => {
                    //show error modal
                    let errorMessage = 'Login failed';
                    if(data) {
                        errorMessage = data.error.message;
                    }
                    alert(errorMessage);
                    console.log(data);
                })
            }
        }).then((data) => {
            const expirationTime = new Date(new Date().getTime() + (+data.expiresIn * 1000));
            authCtx.login(data.idToken, expirationTime.toISOString());
            navigate("/");
        });
    } else {
      //register mode
      fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDgF15A3TX2oe8BVR3aM553_TDO-AVMNLI',
          {
            method: 'POST',
            body: JSON.stringify({
              email: enteredEmail,
              password: enteredPassword,
              returnSecureToken: true
            }),
            headers: {
              'Content-Type': 'application/json'
            }
          }
          ).then(res => {
              setIsLoading(false);
              if(res.ok) {
                  //...
                  console.log('registered');
              } else {
                  return res.json().then(data => {
                      //show error modal
                      let errorMessage = 'Registration failed';
                      if(data) {
                          errorMessage = data.error.message;
                      }
                      alert(errorMessage);
                      console.log(data);
                  })
              }
      });
    }
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
        {isLoading && <p>Loading...</p>}
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInputRef}/>
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={passwordInputRef}/>
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? 'Login' : 'Create Account'}</button>
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
