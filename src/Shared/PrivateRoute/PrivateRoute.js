import React from "react";
import { Spinner } from "react-bootstrap";
import { Redirect, Route } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const PrivateRoute = ({ children, ...rest }) => {
   const { user, isLoading } = useAuth();
   if (isLoading) {
      return <Spinner animation="border" variant="warning" />;
   }
   return (
      <Route
         {...rest}
         render={({ location }) =>
            user.displayName || user.email || user.photoURL ? (
               children
            ) : (
               <Redirect
                  to={{ pathname: "/login", state: { from: location } }}
               />
            )
         }
      />
   );
};

export default PrivateRoute;
