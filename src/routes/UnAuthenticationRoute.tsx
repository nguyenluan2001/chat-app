import Authentication from '@/layouts/Authentication';
import SignIn from '@/pages/authentication/SignIn';
import SignUp from '@/pages/authentication/SignUp';
import React, { ReactElement } from 'react';
import { Route } from 'react-router-dom';

const UnAuthenticationRoute = (): any => {
  return (
    <>
      <Route
        path="/"
        element={<Authentication />}
      >
        <Route
          path="/sign-up"
          element={<SignUp />}
        />
        <Route
          path="/sign-in"
          element={<SignIn />}
        />
      </Route>
    </>
  );
};

export default UnAuthenticationRoute;
