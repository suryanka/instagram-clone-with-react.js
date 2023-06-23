import React, { useState } from "react";
import "./ImageUpload.css";
import { Button } from "@material-ui/core";
import {storage} from 'firebase/storage';
import { db,getStorage, ref } from "./firebase.js";
import firebase from "firebase/compat/app";
import { getDownloadURL, uploadBytesResumable } from "firebase/storage";

function Imageupload({userName}) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    if (e?.target?.files[0]) {
      setImage(e.target.files[0]);
      console.log("Image was set");
    }
  };

  const handleUpload = () => {
    // const uploadTask = storage.ref(`images/${image.name}`).put(image);
    const storage=getStorage();
    const storageRef = ref(storage, `images/${image.name}`);
    const uploadTask= uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error);
        alert(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url)=>{
            db.collection('posts').add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                caption: caption,
                imageUrl:url,
                userName:userName
            });

            setProgress(0);
            setCaption('');
            setImage(null);
        });
      }
    );
  };

  

  return (
    <div className="imageupload">
      {/* storage
      I want to have
      caption Input
      File Picker
      Post Button  */}
      <progress className='imageupload__progress' value={progress} max='100'/>
      <input
        type="text"
        value={caption}
        placeholder="Enter a caption ..."
        onChange={(e) => setCaption(e.target.value)}
      />
      <input type="file" onChange={handleChange} />
      <Button type="submit" onClick={handleUpload}>Upload</Button>
    </div>
  );
}

export default Imageupload;
