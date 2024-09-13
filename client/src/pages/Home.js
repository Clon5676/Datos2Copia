import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/HomeStyle.css";
import { AuthContext } from "../helpers/AuthContext"; // Import AuthContext

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const { authState } = useContext(AuthContext); // Use AuthContext
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/posts")
      .then((response) => {
        setListOfPosts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }, []);

  useEffect(() => {
    if (authState.status) {
      // Only fetch ratings if the user is logged in
      axios
        .get("http://localhost:5000/ratings", {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          const ratingsData = response.data.reduce((acc, rating) => {
            acc[rating.PostId] = rating.ratingValue;
            return acc;
          }, {});
          setUserRatings(ratingsData);
        });
    }
  }, [authState.status]); // Dependency array includes authState.status

  const handlePostClick = (post) => {
    navigate(`/post/${post.id}`);
  };

  const rateAPost = (postId, ratingValue) => {
    if (authState.status) {
      // Check if user is logged in before submitting
      axios
        .post(
          "http://localhost:5000/ratings",
          { PostId: postId, ratingValue },
          { headers: { accessToken: localStorage.getItem("accessToken") } }
        )
        .then((response) => {
          setUserRatings((prevRatings) => ({
            ...prevRatings,
            [postId]: ratingValue,
          }));
        })
        .catch((error) => {
          console.error("Error submitting rating:", error);
        });
    }
  };

  const [tempRating, setTempRating] = useState({}); // Manage temporary rating

  const renderStars = (postId) => {
    if (!authState.status) return null; // Don't render stars if user is not logged in
  
    const currentRating = userRatings[postId] || 0;
    const currentTempRating = tempRating[postId] || 0; // Get temporary rating
    const stars = [];
  
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${i <= (currentTempRating || currentRating) ? "filled" : ""}`}
          onClick={() => rateAPost(postId, i)}
          onMouseEnter={() => setTempRating(prev => ({ ...prev, [postId]: i }))} // Handle hover effect
          onMouseLeave={() => setTempRating(prev => ({ ...prev, [postId]: 0 }))} // Clear hover effect
        >
          ★
        </span>
      );
    }
  
    return <div className="stars">{stars}</div>;
  };
  

  return (
    <div className="posts-container"> {/* Use the updated container class */}
      {listOfPosts.map((post, key) => (
        <div className="post-box" key={key}>
          <div
            className="post-header"
            onClick={() => navigate(`/profile/${post.User.id}`)}
          >
            <span>{post.User.username}</span>
          </div>
          <div className="post-content" onClick={() => handlePostClick(post)}>
            <div className="post-photo">
              <img
                src={`http://localhost:5000${post.photoUrl}`}
                alt="Post"
                className="post-image"
              />
            </div>
            <div className="post-details">
              <div className="post-text">{post.postText}</div>
              <div className="post-dare">{post.Dare.dare}</div>
            </div>
          </div>
          <div className="post-footer">
            My rating:
            {renderStars(post.id)} {/* Render star rating if logged in */}
            <div className="points">
              Points: {post.Dare ? post.Dare.points : "N/A"}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home;
