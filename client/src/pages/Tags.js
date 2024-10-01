import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/DaresStyle.css"; // Ensure this file exists and has correct styles
import { AuthContext } from "../helpers/AuthContext";

export default function Tags() {
  const { id } = useParams(); // Tag ID from URL parameter
  const navigate = useNavigate();
  const [listOfPosts, setListOfPosts] = useState([]);
  const [dare, setDare] = useState(null); // State to store the tag information
  const [tag, setTag] = useState(null); // State to store the tag information

  const [loading, setLoading] = useState(false);
  const { authState } = useContext(AuthContext);
  const [userRatings, setUserRatings] = useState({});

  useEffect(() => {
    const fetchPostsAndTag = async () => {
      try {
        const postsResponse = await axios.get(`http://backend-service:5000/posts/byTag/${id}`);


        const dareResponse = await axios.get(
          `http://backend-service:5000/dares/${id}`
        );
        setDare(dareResponse.data);

        const tagsResponse = await axios.get(
          `http://backend-service:5000/tags/${id}`
        );
        console.log(tagsResponse.data);
        setTag(tagsResponse.data);
      } catch (error) {
        console.error("Error fetching posts or dare:", error);
      }
    };

    fetchPostsAndTag();
  }, [id]);

  useEffect(() => {
    if (authState.status) {
      // Only fetch ratings if the user is logged in
      axios
        .get("http://backend-service:5000/ratings", {
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
  }, [authState.status]);

  const handlePostClick = (post) => {
    navigate(`/post/${post.id}`);
  };

  const renderStars = (postId) => {
    if (!authState.status) return null; // Don't render stars if user is not logged in

    const currentRating = userRatings[postId] || 0;
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${i <= currentRating ? "filled" : ""}`}
          onClick={() => rateAPost(postId, i)}
        >
          ★
        </span>
      );
    }

    const rateAPost = (postId, ratingValue) => {
      if (authState.status) {
        // Check if user is logged in before submitting
        axios
          .post(
            "http://backend-service:5000/ratings",
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
    return <div className="stars">{stars}</div>;
  };

  return (
    <div className="post-container">
      {tag && (
        <div className="dare-info">
          <h2>Busqueda por tags: {tag.tagName}</h2>
        </div>
      )}
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
                src={`http://backend-service:5000${post.photoUrl}`}
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
