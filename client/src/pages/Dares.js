import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/DaresStyle.css"; // Ensure this file exists and has correct styles

function Dares() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [dare, setDare] = useState(null); // State to store the dare information
  const [loading, setLoading] = useState(false);

  const fetchPostsAndDare = async () => {
    setLoading(true);

    try {
      const response = await axios.get(`http://localhost:5000/posts/byDare`, {
        params: {
          dareId: id,
          // Fetch only the first page
        },
      });

      setPosts(response.data);

      // Fetch the dare information separately if it's not included in the posts response
      const dareResponse = await axios.get(`http://localhost:5000/dares/${id}`);
      setDare(dareResponse.data);
    } catch (error) {
      console.error("Error fetching posts or dare:", error);
      // Handle error gracefully (e.g., show a message to the user)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostsAndDare();
  }, [id]);

  const handlePostClick = (post) => {
    navigate(`/post/${post.id}`);
  };

  return (
    <div className="post-container">
      {dare && (
        <div className="dare-info">
          <h2>{dare.dare}</h2>
          <p>{dare.description}</p>
        </div>
      )}
      {posts.length === 0 && !loading && (
        <div>No posts found for this dare.</div>
      )}
      {posts.map((post) => (
        <div
          className="post-box"
          key={post.id} // Use a unique key like post.id
          onClick={() => handlePostClick(post)}
        >
          <div className="post-header">
            <span>{post.username}</span>
          </div>
          <div className="post-content">
            <div className="post-photo">
              <img
                src={`http://localhost:5000${post.photoUrl}`}
                alt="Post"
                className="post-image"
              />
            </div>
            <div className="post-details">
              <div className="post-text">{post.postText}</div>
              <div className="post-dare">
                {post.Dare ? post.Dare.dare : "No dare information"}
              </div>
              <div className="post-footer">
                <div className="points">
                  Points: {post.Dare ? post.Dare.points : "N/A"}
                </div>
                <div className="reactions">
                  <span className="approve">👍 {post.approvals}</span>
                  <span className="disapprove">👎 {post.disapproval}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      {loading && <div>Loading...</div>}
    </div>
  );
}

export default Dares;
