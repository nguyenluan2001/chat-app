import { ReactElement, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { auth } from '@/utils/firebase';
import Authentication from './layouts/Authentication';
import SignIn from './pages/authentication/SignIn';
import SignUp from './pages/authentication/SignUp';
import Home from '@/pages/Home';
import UnAuthenticationRoute from '@/routes/UnAuthenticationRoute';

function App(): ReactElement {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const location = useLocation();
  console.log('==== user ====', user);
  console.log('==== location ====', location);
  const unAuthenticationRoute = createBrowserRouter([
    {
      path: '/',
      element: <Authentication />,
      children: [
        {
          path: '/sign-in',
          element: <SignIn />,
        },
        {
          path: '/sign-up',
          element: <SignUp />,
        },
      ],
    },
  ]);
  const authenticationRoute = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
    },
  ]);
  useEffect(() => {
    if (user == null && location.pathname === '/') {
      navigate('/auth/sign-in');
    }
  }, [user]);
  return (
    <div
      className="App"
      style={{ width: '100vw', height: '100vh' }}
    >
      {/* <RouterProvider
        router={user != null ? authenticationRoute : unAuthenticationRoute}
      ></RouterProvider> */}
      <Routes>
        <Route
          path="/auth"
          element={<Authentication />}
        >
          <Route
            path="/auth/sign-up"
            element={<SignUp />}
          />
          <Route
            path="/auth/sign-in"
            element={<SignIn />}
          />
        </Route>
        <Route
          path="/"
          element={<Home />}
        ></Route>
      </Routes>
    </div>
  );
}

export default App;
