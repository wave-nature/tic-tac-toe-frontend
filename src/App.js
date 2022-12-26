import { useEffect, useState } from "react";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import Cookies from "js-cookie";
import { AuthContext } from "./store/AuthContext";
import { login, register } from "./request";
import { Entry } from "./pages/Entry";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { NewGame } from "./pages/NewGame";
import { Home } from "./pages/Home";
import { Game } from "./pages/Game";
import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";

const initialState = {
  isAuthenticated: false,
  user: null,
  token: "",
  erorrMessage: "",
};

function App() {
  const [auth, setAuth] = useState(initialState);

  useEffect(() => {
    refresh();
  }, []);

  const refresh = () => {
    const token = Cookies.get("jwt");
    if (token && token.length > 0) {
      const user = JSON.parse(localStorage.getItem("user"));
      setAuth({
        isAuthenticated: true,
        user,
        token,
        erorrMessage: "",
      });
    }
  };

  const loginUser = async (payload) => {
    const res = await login(payload);
    if (res.status === "fail" || res.status === "error") {
      Cookies.remove("jwt");
      localStorage.clear();
      setAuth({
        ...auth,
        isAuthenticated: false,
        user: null,
        token: "",
        erorrMessage: res.error.message,
      });

      setTimeout(() => {
        setAuth(initialState);
      }, 2000);
    } else {
      const token = res.token;
      Cookies.set("jwt", token);
      localStorage.setItem("user", JSON.stringify(res.user));
      setAuth({
        isAuthenticated: true,
        user: res.user,
        token: res.token,
        erorrMessage: "",
      });
    }
  };
  const registerUser = async (payload) => {
    const res = await register(payload);
    console.log(res, "res");
    if (res.status === "fail" || res.status === "error") {
      Cookies.remove("jwt");
      localStorage.clear();
      setAuth({
        ...auth,
        isAuthenticated: false,
        user: null,
        token: "",
        erorrMessage: res.error.message,
      });
    } else {
      const token = res.token;
      Cookies.set("jwt", token);
      localStorage.setItem("user", JSON.stringify(res.user));
      setAuth({
        isAuthenticated: true,
        user: res.user,
        token: res.token,
        erorrMessage: "",
      });
    }
  };

  const logout = () => {
    Cookies.remove("jwt");
    localStorage.clear();
    setAuth(initialState);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: auth.isAuthenticated,
        user: auth.user,
        token: auth.token,
        errorMessage: auth.erorrMessage,
        loginUser,
        registerUser,
        logout,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute>
                <Entry />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          <Route
            path="/game"
            element={
              <PrivateRoute>
                <NewGame />
              </PrivateRoute>
            }
          />
          <Route
            path="/game/:gameId"
            element={
              <PrivateRoute>
                <Game />
              </PrivateRoute>
            }
          />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          {/* <Route
            path="/home/new-user"
            element={
              <PrivateRoute>
                <HomeNewUser />
              </PrivateRoute>
            }
          /> */}
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
