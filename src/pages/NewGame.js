import { useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import BackArrow from "../components/BackArrow";
import { createGame } from "../request/index";
import { AuthContext } from "../store/AuthContext";
import styles from "./NewGame.module.css";

export const NewGame = () => {
  const auth = useContext(AuthContext);
  const inputRef = useRef();
  const navigate = useNavigate();
  const startGame = async () => {
    try {
      const email = inputRef.current.value;
      const token = auth.token;

      const res = await createGame({ email }, token);
      const id = res.game._id;
      navigate(`/game/${id}`);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className={styles.container}>
        <div>
          <BackArrow />
          <h2 className="head-1">Start a new game</h2>
          <p className="head-2">Whom do you want to play with?</p>

          <div className="title email">Email</div>

          <input
            type="email"
            name="email"
            className="email-box box"
            placeholder="Type your Email here"
            ref={inputRef}
          />
        </div>

        <button onClick={startGame} className={styles.btn} id="start-game">
          Start Game
        </button>
      </div>
    </>
  );
};
