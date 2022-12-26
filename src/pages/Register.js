import { useContext, useState } from "react";
import { AuthContext } from "../store/AuthContext";
import BackArrow from "../components/BackArrow";
import styles from "./Register.module.css";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const submit = (e) => {
    e.preventDefault();
    const { name, email, username, password } = e.target;
    const payload = {
      name: name.value,
      email: email.value,
      username: username.value,
      password: password.value,
    };
    auth.registerUser(payload);
    if (auth.errorMessage === "") {
      setSuccess(true);
    }
  };

  return (
    <>
      <div className={`container ${styles.wrapper}`}>
        <div>
          <BackArrow />
          <h2 className="head-1">Create Account</h2>
          <p className="head-2">Let's get to know you better!</p>
        </div>
        <form onSubmit={submit}>
          <div className="title your-name">Your Name</div>
          <input
            type="text"
            name="name"
            className="name-box box"
            placeholder="Type your name here"
            required
          />

          <div className="title username">Username</div>
          <input
            type="text"
            name="username"
            className="username-box box"
            placeholder="Type your Username here"
            required
          />

          <div className="title email">Email</div>
          <input
            type="email"
            name="email"
            className="email-box box"
            placeholder="Type your Email here"
            required
          />

          <div className="title password">Password</div>
          <input
            type="password"
            name="password"
            className="password-box box"
            placeholder="Type your Password here"
            required
          />

          <div
            className={styles["notification"]}
            style={{ visibility: success ? "visible" : "hidden" }}
          >
            Congratulations account created!
          </div>
          <button className={styles.register}>Register</button>
        </form>
      </div>
    </>
  );
};
