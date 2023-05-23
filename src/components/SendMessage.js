import React, { useState, useRef } from "react";
import { auth, db, storage } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import {  getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";



const SendMessage = ({ scroll }) => {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

 const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (!file) return; // Periksa apakah file ada sebelum melanjutkan

  setImage(file);
  const reader = new FileReader();
  reader.onload = () => {
    setImagePreview(reader.result);
  };
  reader.readAsDataURL(file);
};

 
const uploadImage = async () => {
  if (!image) return;

  try {
    const storageRef = ref(storage, `images/${image.name}`);
    await uploadBytes(storageRef, image);
    const downloadURL = await getDownloadURL(storageRef);
    console.log("Download URL:", downloadURL);
    return downloadURL;
  } catch (error) {
    console.log("Error uploading image:", error);
    throw error;
  }
};

const sendMessage = async (event) => {
  event.preventDefault();
  if (message.trim() === "" && !image) {
    alert("Enter a valid message or select an image");
    return;
  }

  const { uid, displayName, photoURL } = auth.currentUser;
  const messageData = {
    text: message,
    name: displayName,
    avatar: photoURL,
    createdAt: serverTimestamp(),
    uid,
  };

  if (image) {
    console.log(image);
    try {
      const imageUrl = await uploadImage();
      if (imageUrl) {
        messageData.image = imageUrl;
      } else {
        throw new Error("Failed to get image URL");
      }
    } catch (error) {
      console.log(error);
      alert("Failed to upload image");
      return;
    }
  }

  try {
    await addDoc(collection(db, "messages"), messageData);
    setMessage("");
    setImage(null);
    setImagePreview(null);
    scroll.current.scrollIntoView({ behavior: "smooth" });
  } catch (error) {
    console.log(error);
    alert("Failed to send message");
  }
};


  return (
    <form onSubmit={sendMessage} className="send-message">
      <label htmlFor="messageInput" hidden>
        Enter Message
      </label>
        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="GambarPreview" style={{ maxWidth: "60px", maxHeight: "60px" , marginRight: "5px"}} />
          </div>
        )}
        <button type="button" onClick={handleIconClick} style={{ marginRight: "10px" }}>
          <FontAwesomeIcon
            icon={faCamera}
            className="camera-icon"
            style={{ fontSize: "1.5rem" }}
          />
        </button>
        <input
          type="file"
          accept="image/*"
          name="image"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <input
          id="messageInput"
          name="messageInput"
          type="text"
          className="form-input__input"
          placeholder="Type message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      
        <button type="submit" onClick={uploadImage} >Send</button>
  
    </form>
  );
};

export default SendMessage;
