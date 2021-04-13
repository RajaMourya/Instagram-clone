import React,{ useState } from 'react';
import { Button } from '@material-ui/core';
import { db, storage } from './firebase'
import firebase from 'firebase';
import './ImageUpload.css';

function ImageUpload({username, closer}) {
    const [caption, setCaption] = useState("");
    const [image, setImage ] = useState(null);
    const [progress, setProgress] = useState(0)

    const handleChange = (e) =>{
        if (e.target.files[0]){
            setImage(e.target.files[0]);
        }
    }

    const handleUpload = ()=>{
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                //next function
                const progress = Math.round( (snapshot.bytesTransferred/snapshot.totalBytes)*100 );
                setProgress(progress);
            },
            (error) => {
                // error function
                console.log(error);
                alert(error.message);
            },
            ()=>{
                // complete function
            storage
                .ref('images')
                .child(image.name)
                .getDownloadURL()
                .then(url=>{
                    //post image inside db
                    db.collection('posts').add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption : caption,
                        imageUrl : url,
                        username : username,
                        liked : false,
                    });
                    setProgress(0);
                    setImage(null);
                    setCaption("");
                });
            }
        )
        closer();
    };

    return (
        <div className='container'>
        <div className='imageupload'>
            <progress className='imageupload__progress' value={progress} max="100"/>
            <input className='imageupload__input' type='text' placeholder='Enter a caption...' value={caption} onChange={(e)=>setCaption(e.target.value)} />
            <input className='imageupload__input' type='file' onChange={handleChange} />
            <Button className="imageupload__button" onClick={handleUpload}>
                Upload
            </Button>
        </div>
        </div>
    )
}

export default ImageUpload
