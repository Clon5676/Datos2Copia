import "./styles/HomeStyle.css";
import "./styles/AppStyle.css"; // Import the new CSS file
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Dares from "./pages/Dares";
import Tags from "./pages/Tags";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import { AuthContext } from "./helpers/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });

  useEffect(() => {
    axios
      .get("http://backend-service:5000/auth/check", {  // Cambiado localhost a backend-service
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState({
            ...authState,
            status: false,
          });
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
        }
      });
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({
      ...authState,
      status: false,
    });
  };

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <nav className="navbar">
            <div className="navbar-logo">Dare App</div>
            <div className="navbar-links">
              <Link to="/"> Home </Link>
              {!authState.status ? (
                <>
                  <Link to="/login"> Login </Link>
                  <Link to="/signup"> Signup </Link>
                </>
              ) : (
                <>
                  <Link to="/createpost"> Create a Post </Link>
                  <Link to={`/profile/${authState.id}`}>
                    {authState.username}
                  </Link>
                  <button className="logout-btn" onClick={logout}>
                    Logout
                  </button>
                </>
              )}
            </div>
          </nav>
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/createpost" exact element={<CreatePost />} />
            <Route path="/post/:id" exact element={<Post />} />
            <Route path="/dare/:id" exact element={<Dares />} />
            <Route path="/tag/:id" exact element={<Tags />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/signup" exact element={<Signup />} />
            <Route path="/profile/:id" exact element={<Profile />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
