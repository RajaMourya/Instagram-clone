import React, { useState, useEffect } from 'react';
import './App.css';
import Post from "./Post";
import { db, auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import {Button,Input} from '@material-ui/core';
import ImageUpload from "./ImageUpload";
 
function getModalStyle() {
  const top = 50 ;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: '60%',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [ posts, setPosts ] = useState([]);
  const [user, setUser] = useState(null);

   // useEffect => runs piece of run on a specific condition
  useEffect(() =>{
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        setUser(authUser);
        if(authUser.displayName){
          //dont update username
        }else{
          return authUser.updateProfile({
            displayName: username,
          });
        }
      }else{
        setUser(null);
      }
    })
    return () => {
      //perform cleanup actions
      unsubscribe();
    }
  },[user,username]);
  /*---------------------------------DB-changes-HANDLER---------------------------------- */
  useEffect(()=> {
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc =>(
            {
              id: doc.id,
              post: doc.data()
            }
      )));
    })
  },[])
  /*--------------------------------SIGN-UP-HANDLER----------------------------------- */
  const signUp = (event) =>{
    event.preventDefault();

    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName:username
      })
    })
    .catch((error) => alert(error.message))
    setOpen(false);
  }
  /*--------------------------------SIGN-IN-HANDLER---------------------------------- */
  const signIn = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message));
    setOpenSignIn(false);
  }

  return (
    <div className="App">
      {/* ------------------------------MODAL FOR SIGN UP---------------------------- */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup"> 
            <center>
              <img 
                className="app__headerImage"
                src="https://1000logos.net/wp-content/uploads/2017/02/Instagram-Logo-640x400.png"
                alt=""
              />
            </center>
            <Input 
                placeholder="username" 
                type="tetx"
                value={username}
                onChange={(e) => setUsername(e.target.value)} >
            </Input>
            <Input 
              placeholder="email"
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)} >
            </Input>
            <Input 
              placeholder="password"
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)} >
            </Input>
            <Button type="submit" onClick={signUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>
      {/* -----------------------------MODAL FOR SIGN IN----------------------------- */}
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)} >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup"> 
            <center>
              <img 
                className="app__headerImage"
                src="https://1000logos.net/wp-content/uploads/2017/02/Instagram-Logo-640x400.png"
                alt=""
              />
            </center>
            <Input 
              placeholder="email"
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)} >
            </Input>
            <Input 
              placeholder="password"
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)} >
            </Input>
            <Button type="submit" onClick={signIn}>Sign In</Button>
          </form>
        </div>
      </Modal>
      {/* -----------------------------MODAL FOR UPLOAD----------------------------- */}
      <Modal open={openUpload} onClose={() => setOpenUpload(false)} >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup"> 
            <center>
              <img 
                className="app__headerImage"
                src="https://1000logos.net/wp-content/uploads/2017/02/Instagram-Logo-640x400.png"
                alt=""
              />
            </center>
            {user?.displayName ? (
              <ImageUpload username={user.displayName} closer={()=>setOpenUpload(false)}/> 
                ):(
                  <h3 style={{marginLeft:"50px"}}>Login required...... </h3>
            )}
          </form>
        </div>
      </Modal>
      {/*------------------------------HEADER------------------------------------- */}
      <div className='app__header'>
        <img 
          className="app__headerImage"
          src="https://1000logos.net/wp-content/uploads/2017/02/Instagram-Logo-640x400.png"
          alt=""
          />
                     {/*-------LOGIN LOGOUT SIGN IN SIGN OUT BUTTONS-------- */}
        
        {user ? (
          <div className="app__buttons">
            <img className="uploadLogo" src="https://cdn2.iconfinder.com/data/icons/instagram-ui/48/jee-80-512.png" onClick={() => setOpenUpload(true)}/> 
            <Button onClick={() => auth.signOut()}> Logout </Button>
          </div>
        ): (
          <div className="app__buttons">
            <img className="uploadLogo" src="https://cdn2.iconfinder.com/data/icons/instagram-ui/48/jee-80-512.png" onClick={() => setOpenUpload(true)}/>
            <Button onClick={() => setOpenSignIn(true)}> Sign In </Button>
            <Button onClick={() => setOpen(true)}> Sign Up </Button>
          </div>
        )}
      </div>
      {/*--------------------------------------POSTS----------------------------- */}
      <div className='app__posts'> 
        {
          posts.map(({id, post}) => (
            <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
        ))
        }        
      </div>

    </div>
  );
}

export default App;
