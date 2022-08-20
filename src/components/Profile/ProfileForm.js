import classes from './ProfileForm.module.css';
import { useRef, useContext, useState } from 'react';
import AuthContext from "../../store/auth-context";
import { useNavigate } from 'react-router-dom';

const ProfileForm = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
  const newPasswordRef = useRef();
    const authCtx = useContext(AuthContext);
  const changePasswordHandler = (event) => {
      setIsLoading(true);
      event.preventDefault();
      const enteredNewPassword = newPasswordRef.current.value;

      fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDgF15A3TX2oe8BVR3aM553_TDO-AVMNLI',
          {
              method: 'POST',
              body: JSON.stringify({
                  idToken: authCtx.token,
                  password: enteredNewPassword,
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
              console.log('Password changed', authCtx.token );
              navigate('/');
          } else {
              return res.json().then(data => {
                  //show error modal
                  let errorMessage = 'Password change failed';
                  if(data) {
                      errorMessage = data.error.message;
                  }
                  alert(errorMessage);
                  console.log(data);
              })
          }
      });
  }

  return (
    <form className={classes.form} onSubmit={changePasswordHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' ref={newPasswordRef}/>
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
