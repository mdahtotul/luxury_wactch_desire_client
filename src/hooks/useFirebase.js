import {
   createUserWithEmailAndPassword,
   getAuth,
   getIdToken,
   GoogleAuthProvider,
   onAuthStateChanged,
   signInWithEmailAndPassword,
   signInWithPopup,
   signOut,
   updateProfile,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { initAuthentication } from "../Firebase/firebase.init";

initAuthentication();

const useFirebase = () => {
   const [user, setUser] = useState({});
   const [isLoading, setIsLoading] = useState(true);
   const [authError, setAuthError] = useState("");
   const [admin, setAdmin] = useState(false);
   const [userAuthToken, setUserAuthToken] = useState("");
   const [isAdminLoading, setIsAdminLoading] = useState(true);

   const auth = getAuth();
   const googleProvider = new GoogleAuthProvider();

   // google sign in
   const signInUsingGoogle = (history, redirect_uri) => {
      setIsLoading(true);
      signInWithPopup(auth, googleProvider)
         .then((result) => {
            console.log(result.user);
            const user = result.user;
            // send data to db
            saveUser(user.displayName, user.email, "PUT");
            history.push(redirect_uri);
            setAuthError("");
         })
         .catch((error) => {
            setAuthError(error.message);
         })
         .finally(() => setIsLoading(false));
   };

   // create user email
   const registerUserEmail = (name, email, password, history, redirect_uri) => {
      setIsLoading(true);
      createUserWithEmailAndPassword(auth, email, password)
         .then((result) => {
            const newUser = { displayName: name, email };
            console.log(newUser);
            setUser(newUser);

            // save user to database
            saveUser(name, email, "POST");

            // send name to firebase
            updateProfile(auth.currentUser, {
               displayName: name,
            })
               .then(() => {
                  // Profile updated!
                  // ...
               })
               .catch((error) => {
                  // An error occurred
                  // ...
               });
            history.push(redirect_uri);
         })
         .catch((error) => {
            setAuthError(error.message);
         })
         .finally(() => setIsLoading(false));
   };
   // login user
   const loginUserEmail = (email, password, history, redirect_uri) => {
      setIsLoading(true);
      signInWithEmailAndPassword(auth, email, password)
         .then((result) => {
            setAuthError("");
            if (admin) {
               history.push("/dashboard/makeAdmin");
            } else {
               history.push(redirect_uri);
            }
         })
         .catch((error) => {
            setAuthError(error.message);
         })
         .finally(() => {
            setIsLoading(false);
            // setIsAdminLoading(false);
         });
   };

   // logout
   const logout = () => {
      setIsLoading(true);
      signOut(auth)
         .then(() => {
            // sign out successful
         })
         .catch((error) => {
            setAuthError(error.message);
         })
         .finally(() => setIsLoading(false));
   };

   // user observer
   const unsubscribed = useEffect(() => {
      onAuthStateChanged(auth, (user) => {
         if (user) {
            setUser(user);
            // getting id token
            getIdToken(user).then((idToken) => {
               // console.log(idToken);
               setUserAuthToken(idToken);
            });
         } else {
            setUser({});
         }
         setIsLoading(false);
      });
      return () => unsubscribed;
   }, [auth]);

   useEffect(() => {
      setIsAdminLoading(true);
      const url = `https://stormy-oasis-18134.herokuapp.com/users/${user.email}`;
      fetch(url)
         .then((res) => res.json())
         .then((data) => setAdmin(data.admin))
         .catch((error) => setAuthError(error.message))
         .finally(() => setIsAdminLoading(false));
   }, [user.email]);

   const saveUser = (displayName, email, method) => {
      const user = { displayName, email };
      const url = `https://stormy-oasis-18134.herokuapp.com/users`;
      fetch(url, {
         method: method,
         headers: {
            "content-type": "application/json",
         },
         body: JSON.stringify(user),
      }).then();
   };

   return {
      user,
      admin,
      userAuthToken,
      isLoading,
      isAdminLoading,
      setIsAdminLoading,
      setIsLoading,
      authError,
      setAuthError,
      signInUsingGoogle,
      registerUserEmail,
      loginUserEmail,
      logout,
   };
};

export default useFirebase;
