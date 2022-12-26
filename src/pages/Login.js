import { useContext, useRef, useState } from "react";
import BackArrow from "../components/BackArrow";
import { AuthContext } from "../store/AuthContext";
import styles from "./Login.module.css";

export const Login = () => {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const [loading, setLoading] = useState(false);
  const auth = useContext(AuthContext);
  const submit = async () => {
    const payload = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
    };

    setLoading(true);
    await auth.loginUser(payload);
    setLoading(false);
  };

  return (
    <>
      <div className={`container ${styles.wrapper}`}>
        <div className={styles["content-wrapper"]}>
          <BackArrow />
          <h2 className="head-1">Login</h2>
          <p className="head-2">Please enter your details</p>

          <div className="title username">Username</div>

          <input
            type="text"
            name="username"
            className="username-box box"
            placeholder="Type your Username here"
            ref={usernameRef}
          />

          <div className="title password">Password</div>

          <input
            type="password"
            name="password"
            className="password-box box"
            placeholder="Type your Password here"
            ref={passwordRef}
          />
        </div>

        <div className={styles["btn-wrapper"]}>
          <div
            className={`${styles.notification} ${styles.notify} ${
              auth.errorMessage === "" ? "success" : "fail"
            }`}
            style={{
              visibility: auth.errorMessage !== "" ? "visible" : "hidden",
            }}
          >
            {auth.errorMessage === ""
              ? "Successfully logged in"
              : "Enter correct details"}
          </div>

          <button onClick={submit} className={styles.btn} id="login">
            {loading ? "Loading" : "Login"}
          </button>
        </div>
      </div>
    </>
  );
};
