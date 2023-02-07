import { Box, Button, Grid, Stack } from '@mui/material';
import { signOut } from 'firebase/auth';
import React, { ReactElement, useState, useEffect } from 'react';
import { auth, firestore } from '@/utils/firebase';
import Sidebar from '@/components/Sidebar';
import ChatDetail from '@/components/ChatDetail';
import Header from '@/components/Header';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { isEmpty } from 'lodash';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { setCurrentRoom } from '@/redux/slices/chat';
import { useDispatch, useSelector } from 'react-redux';

const Home = (): ReactElement => {
  const { user } = useCurrentUser();
  const [isOpenChatInformation, setIsOpenChatInformation] =
    useState<boolean>(false);
  const chat = useSelector((state) => state.chat);
  console.log('===== chat =====', chat);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const ref = doc(firestore, 'users', user?.uid);
      const userShot = await getDoc(ref);
      if (userShot.exists()) {
        console.log('========== set init room =======');
        dispatch(
          setCurrentRoom({
            uid: user?.uid,
            room: userShot.data().rooms?.[0],
          })
        );
      }
    };
    if (user?.uid) {
      fetchData().then(
        () => {},
        () => {}
      );
    }
  }, [user?.uid]);
  const handleToggleChatInformation = (): void => {
    setIsOpenChatInformation((pre) => !pre);
  };
  return (
    <Stack
      direction="column"
      sx={{ width: '100vw', height: '100vh', background: 'rgb(36,37,38)' }}
    >
      <Header />
      <Grid
        container={true}
        sx={{ width: '100%', flex: 1 }}
      >
        <Grid
          item={true}
          md={3}
          sx={{ height: '95vh' }}
        >
          <Sidebar />
        </Grid>
        <Grid
          item={true}
          md={isOpenChatInformation ? 6 : 9}
          sx={{ height: '95vh' }}
        >
          {user != null && isEmpty(user?.rooms) ? (
            <></>
          ) : (
            <ChatDetail
              handleToggleChatInformation={handleToggleChatInformation}
            />
          )}
        </Grid>
        {isOpenChatInformation && (
          <Grid
            item={true}
            md={3}
            sx={{ height: '95vh' }}
          >
            <Sidebar />
          </Grid>
        )}
      </Grid>
    </Stack>
  );
};

export default Home;
