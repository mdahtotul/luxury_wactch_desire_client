import React, { useState } from "react";
import { Spinner } from "react-bootstrap";
import useAuth from "../../../hooks/useAuth";
import "../Login/Login.css";

const AddReview = () => {
   const { user } = useAuth();
   const [posting, setPosting] = useState(false);
   const initialInfo = {
      name: user.displayName,
      email: user.email,
      rating: "",
      avatar: user.photoURL || "",
      comment: "",
   };
   const [reviewInfo, setReviewInfo] = useState(initialInfo);

   const handleOnBlur = (e) => {
      const field = e.target.name;
      const value = e.target.value;
      const newInfo = { ...reviewInfo };
      newInfo[field] = value;
      console.log(newInfo);
      setReviewInfo(newInfo);
   };

   const handleReviewSubmit = (e) => {
      setPosting(true);
      e.preventDefault();
      const newReview = {
         ...reviewInfo,
      };
      const url = `https://stormy-oasis-18134.herokuapp.com/reviews`;
      fetch(url, {
         method: "POST",
         headers: {
            "content-type": "application/json",
         },
         body: JSON.stringify(newReview),
      })
         .then((res) => res.json())
         .then((data) => {
            if (data.insertedId) {
               alert("successfully added review");
               e.target.reset();
            }
         })
         .catch((error) => {
            console.log(error);
         })
         .finally(() => setPosting(false));
   };

   return (
      <div className="container-fluid form_wrapper">
         <h1 className="heading">
            <span>a</span>
            <span>d</span>
            <span>d</span>
            <span className="space"></span>
            <span>r</span>
            <span>e</span>
            <span>v</span>
            <span>i</span>
            <span>e</span>
            <span>w</span>
         </h1>
         {/* {authError && <div style={{ color: "red" }}></div>} */}

         <form className="form_login" onSubmit={handleReviewSubmit}>
            <div className="input_field">
               <span>Your Name</span>
               <input
                  onBlur={handleOnBlur}
                  type="text"
                  defaultValue={user.displayName}
                  name="name"
                  readOnly
               />
            </div>
            <div className="input_field">
               <span>Your Email</span>
               <input
                  onBlur={handleOnBlur}
                  type="email"
                  name="email"
                  defaultValue={user.email}
                  readOnly
               />
            </div>
            <div className="input_field">
               <span>Rating</span>
               <input
                  onBlur={handleOnBlur}
                  type="text"
                  name="rating"
                  placeholder="Give number between 1-5"
                  required
               />
            </div>
            <div className="input_field">
               <span>Image Link</span>
               <input
                  onBlur={handleOnBlur}
                  type="text"
                  name="avatar"
                  defaultValue={user.photoURL ? user.photoURL : ""}
                  required
               />
            </div>
            <div className="input_field">
               <span>Comment</span>
               <textarea
                  type="text"
                  name="comment"
                  onBlur={handleOnBlur}
                  placeholder="Please leave a comment.(Maximum 200 words)"
                  required
               />
            </div>

            {!posting && (
               <input type="submit" className="btn_book" value="Add Review" />
            )}

            {posting && (
               <Spinner
                  animation="border"
                  variant="secondary"
                  style={{ width: "4rem", height: "4rem", fontSize: "2rem" }}
               />
            )}
         </form>
      </div>
   );
};

export default AddReview;
