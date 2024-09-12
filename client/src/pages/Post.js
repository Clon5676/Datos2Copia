import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Formik, Field, Form, ErrorMessage } from "formik";
import "../Post.css";
import { AuthContext } from "../helpers/AuthContext";

export default function Post() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [tags, setTags] = useState([]);
  const [userRating, setUserRating] = useState(0); // Add this line
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    // Obtener detalles del post
    axios.get(`http://localhost:5000/posts/byId/${id}`).then((response) => {
      setPostObject(response.data);
      setUserRating(response.data.userRating || 0); // Set user rating
    });

    // Obtener comentarios del post
    axios.get(`http://localhost:5000/comments/${id}`).then((response) => {
      setComments(response.data);
    });

    // Obtener ratings del post
    if (authState.status) {
      axios
        .get(`http://localhost:5000/ratings/${id}`, {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          setUserRating(response.data.ratingValue || 0);
        })
        .catch((error) => {
          console.error("Error fetching rating:", error);
        });
    }
  }, [id, authState.status]);

  useEffect(() => {
    // Obtener tags del dare si postObject.Dare está definido
    if (postObject.Dare && postObject.Dare.id) {
      axios
        .get(`http://localhost:5000/dares/${postObject.Dare.id}`)
        .then((response) => {
          setTags(response.data.Tags || []);
        });
    }
  }, [postObject.Dare]);

  const handleCommentSubmit = (values, { resetForm }) => {
    axios
      .post(
        "http://localhost:5000/comments",
        { ...values, PostId: id },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then(() => {
        axios.get(`http://localhost:5000/comments/${id}`).then((response) => {
          setComments(response.data);
        });
        resetForm();
      })
      .catch((error) => {
        console.error("Error creating comment:", error);
      });
  };

  const deleteComment = (id) => {
    axios
      .delete(`http://localhost:5000/comments/delete/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        setComments(
          comments.filter((val) => {
            return val.id != id;
          })
        );
      })
      .catch((error) => {
        console.error("Error deleting comment:", error);
      });
  };

  const deletePost = (id) => {
    axios
      .delete(`http://localhost:5000/posts/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        navigate("/");
      });
  };

  const handleDareClick = (postObject) => {
    navigate(`/dare/${postObject.Dare.id}`);
  };

  const handleTagClick = (tag) => {
    navigate(`/tag/${tag.id}`);
  };

  const handleStarClick = (rating) => {
    if (authState.status) {
      axios
        .post(
          `http://localhost:5000/ratings`,
          { PostId: id, ratingValue: rating },
          { headers: { accessToken: localStorage.getItem("accessToken") } }
        )
        .then(() => {
          setUserRating(rating);
          axios
            .get(`http://localhost:5000/posts/byId/${id}`)
            .then((response) => {
              setPostObject(response.data);
            });
        })
        .catch((error) => {
          console.error("Error submitting rating:", error);
        });
    }
  };

  const stars = [1, 2, 3, 4, 5].map((rating) => (
    <span
      key={rating}
      className={`star ${userRating >= rating ? "filled" : ""}`}
      onClick={() => handleStarClick(rating)}
    >
      ★
    </span>
  ));

  return (
    <div className="post-page">
      <div className="post-content">
        <div className="post-details">
          <div className="post-header">
            {/* Safely access username with optional chaining */}
            {postObject.User?.username && (
              <span>{postObject.User.username}</span>
            )}

            {/* Check if authState and postObject.User are available */}
            {authState.username === postObject.User?.username && (
              <button
                onClick={() => {
                  deletePost(postObject.id);
                }}
              >
                Delete Post
              </button>
            )}
          </div>

          <div className="post-photo">
            <img
              src={`http://localhost:5000${postObject.photoUrl}`}
              alt="Post"
              className="post-image"
            />
          </div>
          <div className="post-text">{postObject.postText}</div>
          <div
            className="post-dare"
            onClick={() => handleDareClick(postObject)}
          >
            {postObject.Dare ? postObject.Dare.dare : "No dare information"}
          </div>
          <div className="dare-description">
            {postObject.Dare && (
              <>
                <div className="description">{postObject.Dare.description}</div>
                <div className="tags-container">
                  {tags.map((tag, index) => (
                    <button
                      key={index}
                      className="tag-button"
                      onClick={() => handleTagClick(tag)}
                    >
                      {tag.tagName}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="post-footer">
            <div className="points">
              Points: {postObject.Dare ? postObject.Dare.points : "N/A"}
            </div>
            <div className="reactions">
              <div className="stars">My rating: {stars}</div>
              <div>
                A post is approved if its overall rating is over 2.5
                {postObject.averageRating < 2.5 ? "Disapproved" : "Approved"}
              </div>
            </div>
          </div>
        </div>
        <div className="comment-section">
          <h2>Comments</h2>
          <Formik
            initialValues={{ commentBody: "" }}
            onSubmit={handleCommentSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="comment-form">
                  <Field
                    as="textarea"
                    name="commentBody"
                    placeholder="Add a comment..."
                    className="comment-input"
                  />
                  <ErrorMessage
                    name="commentBody"
                    component="div"
                    className="error-message"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="submit-button"
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
          <div className="comments-list">
            {comments.map((comment, index) => (
              <div key={index} className="comment-item">
                <p>{comment.User.username}</p>
                <p>{comment.commentBody}</p>
                {authState.id === comment.UserId && (
                  <button
                    onClick={() => {
                      deleteComment(comment.id);
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
