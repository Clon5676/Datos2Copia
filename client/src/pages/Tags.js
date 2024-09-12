import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/DaresStyle.css"; // Ensure this file exists and has correct styles

function Tags() {
  const { id } = useParams(); // Tag ID from URL parameter
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [tag, setTag] = useState(null); // State to store the tag information
  const [loading, setLoading] = useState(false);

  const fetchPostsAndTag = async () => {
    setLoading(true);

    try {
      const postsResponse = await axios.get(
        `http://localhost:5000/posts/byTag`,
        {
          params: { TagId: id },
        }
      );
      setPosts(postsResponse.data);

      // Fetch tag information separately if needed
    } catch (error) {
      console.error("Error fetching posts or tag:", error);
      // Handle error gracefully (e.g., show a message to the user)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostsAndTag();
  }, [id]);

  const handlePostClick = (post) => {
    navigate(`/post/${post.id}`);
  };

  return (
    <div className="post-container">
      {tag && (
        <div className="dare-info">
          <h2>{tag.tagName}</h2>
          {/* You can add more tag details here if needed */}
        </div>
      )}
      {posts.length === 0 && !loading && (
        <div>No posts found for this tag.</div>
      )}
      {posts.map((post) => (
        <div
          className="post-box"
          key={post.id} // Use a unique key like post.id
          onClick={() => handlePostClick(post)}
        >
          <div className="post-header">
            <span>{post.User && <span>{post.User.username}</span>}</span>
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

export default Tags;
