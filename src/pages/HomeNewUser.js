import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../store/AuthContext";
import styles from "./HomeNewUser.module.css";

const HomeNewUser = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const logout = () => {
    auth.logout();
  };
  return (
    <>
      <div className={styles.container}>
        <div className={styles["head-2"]}>Your Games</div>
        <button onClick={logout} className={styles["logout"]}>
          Logout
        </button>
        <div>
          <h1 className={styles["primary-heading"]}>No Games Found</h1>
          <button onClick={() => navigate("/game")} className={styles.btn}>
            Start a new game
          </button>
        </div>
      </div>
    </>
  );
};

export default HomeNewUser;
