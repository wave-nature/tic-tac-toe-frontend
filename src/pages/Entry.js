import { useNavigate } from "react-router-dom";
import styles from "./Entry.module.css";

export const Entry = () => {
  const navigate = useNavigate();
  const redirectTo = (path) => navigate(path);
  return (
    <>
      <div className={`${styles["container"]} ${styles["grid"]}`}>
        <h4>async</h4>
        <h1> tic tac toe</h1>
        <button id="login" onClick={redirectTo.bind(this, "/login")}>
          Login
        </button>
        <button
          id="register"
          onClick={redirectTo.bind(this, "/register")}
          className={styles.blueBtn}
        >
          Register
        </button>
      </div>
      {/* <div className="container cont-grid">
        <h4>async</h4>
        <h1> tic tac toe</h1>
        <button id="login">Login</button>
        <button id="register" className="blue-btn">
          Register
        </button>
      </div> */}
    </>
  );
};
