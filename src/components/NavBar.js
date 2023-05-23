import React from "react";
import GoogleSignin from "../img/google.png";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { faComment, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NavBar = () => {
  const [user] = useAuthState(auth);

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };

  const signOut = () => {
    auth.signOut();
  };

  return (
    <nav className="nav-bar">
      <div className="nav-bar__left">
        <h1>
          <FontAwesomeIcon icon={faComment} /> CHATLAH
        </h1>
      </div>
      <div className="nav-bar__center">
        <input type="text" placeholder="Search" />
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
      </div>
      <div className="nav-bar__right">
        {user ? (
          <button onClick={signOut} className="sign-out" type="button">
            Sign Out
          </button>
        ) : (
          <button className="sign-in">
            <img
              onClick={googleSignIn}
              src={GoogleSignin}
              alt="sign in with google"
              type="button"
            />
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
