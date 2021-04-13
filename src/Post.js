import React,{ useState, useEffect } from 'react';
import './Post.css';
import Avatar from '@material-ui/core/Avatar';
import { db } from './firebase';
import firebase from 'firebase';
import like from "./like.png"
function Post({ user,username, postId, caption, imageUrl }) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");
    const [liked, setLiked] = useState(true);
    useEffect(() => {
        let unsubscribe;
        if(postId){
            unsubscribe = db
            .collection('posts')
            .doc(postId)
            .collection('comments')
            .onSnapshot((snapshot)=>{
                setComments(snapshot.docs.map(doc=> doc.data()));var docRef = db.collection("cities").doc("SF");
                db.collection('posts').doc(postId).get()
                    .then(snapshot => setLiked(snapshot.data().liked))
                
            });
        }
        return () => {
            unsubscribe();
        };
    }, [])

    //---------------LIKE-------------------------------------

    const likeHandler = (e)=>{
        e.preventDefault();
        if (liked == true){
            setLiked(false)
        }else{
            setLiked(true)
        }
        db.collection('posts').doc(postId).update({
            liked : liked,
        })
        .catch((error)=>
        alert("error updating ",error))
    }
    //----------------------POST-COMMENT--------------------
    const postComment = (event)=>{
        event.preventDefault();
        if(user){
        db.collection('posts').doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp:firebase.firestore.FieldValue.serverTimestamp(),
        })
        setComment("")
        }else{
            alert("Login to comment")
        }
        
    }

    return (
        <div className="post">
            {/* header -> avatar + username */}
            <div className="post__header">
                <Avatar 
                    className="post__avatar"
                    alt="Raja"
                    src=""
                />
                <h3>{ username }</h3>
            </div>

            {/*image*/}
            <img  className="post__image" src={ imageUrl } />
            {/*Like */}

            {
                user ? liked ? (
                    <img
                        className='post__like'
                        onClick={likeHandler}
                        src="https://www.transparentpng.com/thumb/instagram-heart/5AVRiZ-instagram-heart-background.png"
                    />
                ):(
                    <img
                        className='post__like'
                        onClick={likeHandler}
                        src={like}
                    />                    
                ) : <br/>
            }
            {/*caption */}
            <h4 className="post__text"><strong>{ username }</strong> { caption }</h4>
            {/*Comments */}
            <div className='post__comments'>
                {   
                    comments.map((comment)=>(
                        <p>
                            <b>{comment.username}</b> {comment.text}
                        </p>
                    ))
                }

            </div>
            {/*Comment Box */}
            <form className='post__commentBox'>
                <input
                    className="post__input"
                    type='text'
                    placeholder="Add a comment"
                    value={comment}
                    onChange={(e)=> setComment(e.target.value)}
                />
                <button className='post__button' onClick={postComment}>
                    Post 
                </button>
            </form>
        </div>
    )
}

export default Post
