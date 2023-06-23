import React, { useEffect, useState } from "react";
import "./App.css";
import Post from "./Post";
import { db, auth } from "./firebase";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Button, Input } from "@material-ui/core";
import ImageUpload from "./Imageupload.js";
import InstagramEmbed from "react-instagram-embed";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const [modalStyle] = useState(getModalStyle);
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);

  const [userName, setuserName] = useState("");
  const [email, setEmail] = useState("");
  const [passWord, setPassWord] = useState("");
  const [user, setUser] = useState(null);

  const [posts, setPosts] = useState([
    // {
    //   userName: "karthikAaaryan",
    //   caption: "I am Star",
    //   imageUrl: "https://static.toiimg.com/photo/msid-95055581/95055581.jpg",
    // },
    // {
    //   userName: "SRK",
    //   caption: "I am a star",
    //   imageUrl:
    //     "https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcTK7Os2YW_6OfJJGh9rvPUSbNYqUwQXZce6mMIrqMasLen8sg4BDbHwN-UMOAV6Q_lXdvqdhbY-NqCTcGA",
    // },
    // {
    //   userName: "RanbirKapoor",
    //   caption: "I am also a star",
    //   imageUrl:
    //     "https://img.mensxp.com/media/content/2021/Aug/All-Ranbir-Movies-Where-He-Leaves-A-Wedding1200_612cdcbc82be7.jpeg",
    // },
  ]);

  const signUp = (e) => {
    e.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, passWord)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: userName,
        });
      })
      .catch((error) => alert(error.message));

    setOpen(false);
  };

  const signIn = (e) => {
    e.preventDefault();

    auth
      .signInWithEmailAndPassword(email, passWord)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
  };

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user has logged in
        console.log("UseEffect gets fired: ");
        console.log(authUser);
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
  }, [user, userName]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  return (
    <div className="App">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signUp">
            <center>
              <img
                className="app__headerImage"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1280px-Instagram_logo.svg.png"
                alt=""
              />
            </center>
            <Input
              type="text"
              placeholder="username"
              value={userName}
              onChange={(e) => setuserName(e.target.value)}
            />

            <Input
              type="text"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              type="text"
              placeholder="password"
              value={passWord}
              onChange={(e) => setPassWord(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signUp">
            <center>
              <img
                className="app__headerImage"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1280px-Instagram_logo.svg.png"
                alt=""
              />
            </center>

            <Input
              type="text"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              type="text"
              placeholder="password"
              value={passWord}
              onChange={(e) => setPassWord(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>
              Sign In
            </Button>
          </form>
        </div>
      </Modal>
      <div class="app__header">
        <img
          class="app__headerImage"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1280px-Instagram_logo.svg.png"
          alt=""
        />

        {user ? (
          <Button onClick={() => auth.signOut()}>LogOut</Button>
        ) : (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>SignIn</Button>
            <Button onClick={() => setOpen(true)}>SignUp</Button>
          </div>
        )}
      </div>

      <div class="app__posts">
        <div className="app__postsLeft">
          {posts.map(({ id, post }) => (
            <Post
              user={user}
              key={id}
              postId={id}
              userName={post.userName}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          ))}
        </div>

        <div className="app__postsRight">
          <InstagramEmbed
            url="https://www.instagram.com/p/CtqrQG4tkJO/"
            clientAccessToken="f7607e7998fb010949fbe342e01f6879"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>

      {user?.displayName ? (
        <ImageUpload userName={user.displayName} />
      ) : (
        <h3>Please login to upload.</h3>
      )}
    </div>
  );
}

export default App;
