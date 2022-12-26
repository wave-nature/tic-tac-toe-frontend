import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { myGames } from "../request";
import { AuthContext } from "../store/AuthContext";
import HomeNewUser from "./HomeNewUser";
import styles from "./Home.module.css";

export const Home = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState([]);

  const newGame = () => {
    const anyPendingGame = games.some((game) => game.inProgress);

    if (anyPendingGame) return;
    navigate("/game");
  };
  const getMyGames = async (token) => {
    const data = await myGames(token);
    setGames(data.games);
    setLoading(false);
  };
  useEffect(() => {
    getMyGames(auth.token);
    const interval = setInterval(() => {
      getMyGames(auth.token);
    }, 4000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const logout = () => {
    auth.logout();
  };
  const redirectToGame = (id) => navigate(`/game/${id}`);
  if (loading) return <p>Loading...</p>;

  if (games?.length === 0) return <HomeNewUser />;

  return (
    <div className={styles["container"]}>
      <div className={styles["heading-primary"]}>Your Games</div>
      <button onClick={logout} className={styles["logout"]}>
        Logout
      </button>

      {games?.map((game) => {
        let userInfo;
        const otherUser = game.otherUser;
        const initialUser = game.initialUser;
        // getting other user info based on logged in user
        if (initialUser.user.username === auth.user.username) {
          userInfo = otherUser;
        }
        if (otherUser.user.username === auth.user.username) {
          userInfo = initialUser;
        }
        const outputGameStatus = {
          true: "You've made your move! Wait for them.",
          false: `${initialUser.user.name} just made their move its your turn to make a move`,
          win: "You-won",
          draw: "It's a draw",
        };
        // let outputStatus = 'You-won';
        const readableDate = new Date(game.updatedAt).toLocaleDateString(
          "en-in",
          {
            day: "numeric",
            month: "long",
            year: "numeric",
          }
        );
        const readableTime = new Date(game.updatedAt).toLocaleTimeString(
          "en-in",
          {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }
        );
        return (
          <div key={game._id} className={styles["card"]}>
            <div className={styles["card-head"]}>
              Game with{" "}
              <span
                style={{ display: "inline-block", textTransform: "capitalize" }}
              >
                {userInfo.user.name}
              </span>
            </div>
            <div className={styles["card-data"]}>
              {
                outputGameStatus[
                  game.inProgress ? userInfo.turn : userInfo.status
                ]
              }
            </div>
            <div className={styles["card-time"]}>
              {readableDate}, {readableTime}
            </div>
            <button
              onClick={redirectToGame.bind(this, game._id)}
              className={styles.btn}
            >
              {!game.inProgress ? "View" : "Play!"}
            </button>
          </div>
        );
      })}

      <button onClick={newGame} className={styles["new-game"]}>
        <span className={styles.plus}>+</span> New Game
      </button>
    </div>
  );
};
