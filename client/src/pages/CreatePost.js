import React, { useEffect, useState, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "../styles/CreatePostStyle.css"; // Import your CSS file
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

export default function CreatePost() {
  const [dares, setDares] = useState([]);
  const { authState } = useContext(AuthContext);

  let navigate = useNavigate();

  useEffect(() => {
    // Fetch random dares when component mounts
    if (!authState.status) {
      navigate("/login");
    }
    axios
      .get("http://backend-service:5000/dares/random")
      .then((response) => {
        setDares(response.data);
      })
      .catch((error) => {
        console.error("Error fetching dares:", error);
      });
  }, []);

  const initialValues = {
    DareId: "", // Dare selection
    postText: "",
    photo: null, // File input for photo
  };

  const validationSchema = Yup.object().shape({
    DareId: Yup.string().required("Dare is required"),
    postText: Yup.string().required("Post Text is required"),
    photo: Yup.mixed().required("A photo is required"),
  });

  const onSubmit = (data, { resetForm }) => {
    const formData = new FormData(); // Handling file uploads with FormData
    for (let key in data) {
      formData.append(key, data[key]); // Append fields, including 'photo'
    }

    axios
      .post("http://backend-service:5000/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Required for file uploads
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        console.log("Post created:", response.data);
        navigate("/");
        resetForm();
      })
      .catch((error) => {
        console.error("Error creating post:", error);
      });
  };

  return (
  <div className="post-page">
    <div className="post-card">
      <h2 className="post-header">Create a New Post</h2>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({ setFieldValue }) => (
          <Form className="create-post-form">
            <div className="form-group">
              <label htmlFor="DareId">Dare:</label>
              <Field as="select" name="DareId" className="form-field">
                <option value="">Select a dare</option>
                {dares.map((dare) => (
                  <option key={dare.id} value={dare.id}>
                    {dare.dare}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="DareId" component="div" className="error-message" />
            </div>

            <div className="form-group">
              <label htmlFor="postText">Post Text:</label>
              <Field
                name="postText"
                placeholder="Describe your challenge!"
                className="form-field"
              />
              <ErrorMessage name="postText" component="div" className="error-message" />
            </div>

            <div className="form-group">
              <label htmlFor="photo">Photo:</label>
              <input
                type="file"
                name="photo"
                className="form-field"
                onChange={(event) => {
                  setFieldValue("photo", event.target.files[0]);
                }}
              />
              <ErrorMessage name="photo" component="div" className="error-message" />
            </div>

            <button type="submit" className="submit-button">Create Post</button>
          </Form>
        )}
      </Formik>
    </div>
  </div>
);

}
