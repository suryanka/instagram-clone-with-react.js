import React, { useEffect, useState } from "react";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import { db } from "./firebase";
import firebase from "firebase/compat/app";

function Post({ user, key, postId, userName, caption, imageUrl }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  const postComment = (event) => {
    event.preventDefault();

    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      userName: user?.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setComment("");
  };

  useEffect(() => {
    // let unsubscribe;
    if (postId) {
      // unsubscribe=
      db.collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }

    // return () =>{
    //   unsubscribe();
    // };
  }, [postId]);

  return (
    <div className="post" style={{ border: "1px solid lightgray" }}>
      {/* header --> avatatr+ username */}
      <div className="post__header">
        <Avatar
          className="post__avatar"
          alt={userName}
          src="/static/images/avatar/1.jpg"
        />
        <h3>{userName}</h3>
      </div>

      {/* image  */}
      <img className="post__image" src={imageUrl} />

      {/* userName + caption */}
      <h4 className="post__text">
        <strong>{userName}:</strong>
        {caption}
      </h4>

      <div className="post__comments">
        {comments.map((comment) => (
          <p>
            <strong>{comment.userName} </strong>
            {comment.text}
          </p>
        ))}
      </div>

      {user && (
        <form className="post__commentBox">
          <input
            className="post__input"
            type="text"
            placeholder="Please Add a comment...."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className="post__button"
            disabled={!comment}
            type="submit"
            onClick={postComment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;
