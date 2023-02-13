import {
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import sendIcon from '@iconify/icons-mdi/send';
import { Icon } from '@iconify/react';
import { auth, db, firestore } from '../utils/firebase';
import { push, ref, set } from 'firebase/database';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useSelector } from 'react-redux';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { IRoomItem } from '@/utils/models';
import { RootState } from '@/redux/store';

const ChatToolbar: React.FC = () => {
  const [user] = useAuthState(auth);
  const [message, setMessage] = useState<string>('');
  const { currentRoom } = useSelector(
    (state: RootState) => state?.chat?.sessions?.[user?.uid as string]
  );
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  useEffect(() => {
    const unsub = onSnapshot(
      doc(firestore, 'users', user?.uid as string),
      (doc) => {
        const data = doc.data();
        const room = data?.rooms?.find(
          (item: IRoomItem) => item?.uid === currentRoom?.uid
        );
        setIsBlocked(room?.isBlocked);
      }
    );
    return unsub;
  }, []);
  const handleSendMessage = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    await push(ref(db, `rooms/${currentRoom?.uid}`), {
      user: user?.uid,
      message,
      isSeen: false,
    });
    setMessage('');
  };
  const handleChangeMessage = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = e.target.value;
    setMessage(value);
  };
  if (isBlocked)
    return (
      <BlockedToolbar
        userUID={user?.uid as string}
        room={currentRoom}
      />
    );
  return (
    <form onSubmit={handleSendMessage}>
      <Stack
        alignItems="center"
        direction="row"
        sx={{ width: '100%', py: 2 }}
      >
        <TextField
          sx={{
            background: 'rgb(58,59,60)',
            flex: 1,
            color: 'white',
            '& .MuiOutlinedInput-input': {
              color: 'white',
            },
            '& fieldset': {
              display: 'none',
            },
            borderRadius: '32px',
            border: 'none',
          }}
          placeholder="Aa"
          onChange={handleChangeMessage}
          value={message}
        />
        <IconButton
          sx={{
            color: 'rgb(0,132,255)',
            height: 'fit-content',
          }}
          type="submit"
        >
          <Icon icon={sendIcon} />
        </IconButton>
      </Stack>
    </form>
  );
};
const BlockedToolbar: React.FC<{ userUID: string; room: IRoomItem }> = ({
  userUID,
  room,
}) => {
  const handleRemoveBlock = async (): Promise<void> => {
    const userRef = doc(firestore, 'users', userUID);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      let rooms = docSnap.data().rooms;
      rooms = rooms?.map((item: IRoomItem) => {
        if (item?.uid === room?.uid) {
          return {
            ...item,
            isBlocked: false,
          };
        }
        return item;
      });
      console.log('🚀 ===== rooms=rooms?.map ===== rooms', rooms);
      await updateDoc(userRef, {
        rooms,
      });
    }
  };
  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="body1"
        sx={{ textAlign: 'center' }}
      >
        You have blocked messages and calls from Bao Ngoc's Facebook account
      </Typography>
      <Typography
        variant="body2"
        sx={{ textAlign: 'center' }}
      >
        You cannot text or call them in this chat, nor receive their messages or
        calls.
      </Typography>
      <Button
        variant="contained"
        fullWidth={true}
        onClick={handleRemoveBlock}
      >
        Remove block
      </Button>
    </Box>
  );
};

export default ChatToolbar;
