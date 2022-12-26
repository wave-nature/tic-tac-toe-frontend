import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../store/AuthContext";
import { getGame, updateGame } from "../request/index";
import BackArrow from "../components/BackArrow";
import styles from "./Game.module.css";

const Cross = () => <img className={styles.img} src="/cross.jpg" alt="" />;
const Zero = () => <img className={styles.img} src="/zero.jpg" alt="" />;
const pieces = [<Cross />, <Zero />];
const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const winningCondition = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let timer;
export const Game = () => {
  const auth = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [game, setGame] = useState({});
  const [otherUserInfo, setOtherUserInfo] = useState({});
  const [myUserInfo, setMyUserInfo] = useState({});
  const [win, setWin] = useState(false);
  const [draw, setDraw] = useState(false);
  const [notAllowed, setNotAllowed] = useState(false);
  const [loading, setLoading] = useState(false);
  const id = location.pathname.split("/")[2];

  const fetchGame = async () => {
    const res = await getGame(id, auth.token);
    const game = res.game;
    if (game?.initialUser?.user?.username === auth.user.username) {
      setOtherUserInfo(game?.otherUser);
      setMyUserInfo(game?.initialUser);
    }
    if (game?.otherUser?.user?.username === auth.user.username) {
      setOtherUserInfo(game?.initialUser);
      setMyUserInfo(game?.otherUser);
    }
    setGame(res.game);
  };
  const turn = myUserInfo.turn;
  useEffect(() => {
    fetchGame();
    timer = setInterval(() => {
      fetchGame();
    }, [1500]);

    if (turn) {
      clearInterval(timer);
    }

    return () => {
      clearInterval(timer);
    };
  }, [turn]);
  const inProgress = game?.inProgress;

  useEffect(() => {
    if (!inProgress) clearInterval(timer);
  }, [inProgress]);

  const checkWin = (myMoves) => {
    console.log("my moves", myMoves);
    for (let i = 0; i < winningCondition.length; i++) {
      const condition = winningCondition[i];
      for (let j = 0; j < myMoves.length; j++) {
        const val = myMoves[j];
        const index = condition.indexOf(val);
        if (index > -1) {
          condition.splice(index, 1);
          if (condition.length === 0) return true;
        }
      }
    }
    console.log(winningCondition);
    return false;
  };

  const checkUpdateGame = (val) => {
    let draw = false,
      win = false;
    const theirMoves = otherUserInfo.moves;
    const myMoves = myUserInfo.moves;
    // game already finished
    if (!game.inProgress) return;
    // wait if their turn is goin on
    if (!myUserInfo.turn) return;
    // do not over lap moves with other user
    if (theirMoves.includes(val)) return;
    // do not tap on same box
    if (myMoves.includes(val)) return;
    // do not select two boxes at the same time
    if (notAllowed) return;
    //check if user already won
    win = checkWin([...myMoves, val]);
    console.log("win", win);
    // check draw
    if (theirMoves.length + [...myMoves, val].length === 9 && !win) draw = true;

    setMyUserInfo((prev) => ({
      ...prev,
      moves: [...new Set([...prev.moves, val])],
    }));
    setNotAllowed(true);
    setWin(win);
    setDraw(draw);
  };

  const updateTheGame = async () => {
    // wait if their turn is going on
    if (!myUserInfo.turn) return;

    // make sure moves array is not empty
    const moves = myUserInfo.moves;
    if (moves.length === 0) return;
    let inProgress = true;
    let status;
    if (win) {
      inProgress = false;
      status = "win";
    }
    if (draw) {
      inProgress = false;
      status = "draw";
    }
    setLoading(true);
    await updateGame(id, { moves, inProgress, status }, auth.token);
    await fetchGame();
    setNotAllowed(false);
    setLoading(false);
  };

  const MyPiece = () => pieces[myUserInfo?.piece];
  const ThierPiece = () => pieces[otherUserInfo?.piece];
  let showGameStatus = "";
  if (game?.inProgress) {
    showGameStatus = myUserInfo.turn ? "Your Move" : "Their Move";
  }
  if (!game?.inProgress) {
    if (myUserInfo?.status === "draw" || otherUserInfo?.status === "draw")
      showGameStatus = "draw";
    else if (myUserInfo?.status === "win") showGameStatus = "You Won";
    else if (otherUserInfo?.status === "win") showGameStatus = "They Won";
  }

  return (
    <>
      <div className={styles["container"]}>
        <div>
          <BackArrow path="/home" />
          <p className={styles["head-2"]}>
            Game with {otherUserInfo.user?.name}
          </p>
          <div className={styles["your"]}>Your Piece</div>
          <div>
            <MyPiece />
          </div>
          <div className={styles["turn"]}>{showGameStatus}</div>
          <div className={styles["game-grid-back"]}>
            <div className={styles["game-grid"]}>
              {arr.map((el) => {
                return (
                  <div
                    key={el}
                    onClick={checkUpdateGame.bind(this, el)}
                    className={styles["game-grid-item"]}
                  >
                    {myUserInfo?.moves?.includes(el) && <MyPiece />}
                    {otherUserInfo?.moves?.includes(el) && <ThierPiece />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {game?.inProgress && (
          <button onClick={updateTheGame}>
            {!myUserInfo.turn
              ? "Wait! Thier Turn"
              : loading
              ? "Loading"
              : "Submit"}
          </button>
        )}
        {!game?.inProgress && (
          <button onClick={() => navigate("/game")}>Start New Game</button>
        )}
      </div>
    </>
  );
};
