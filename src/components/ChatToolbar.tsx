import { IconButton, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import sendIcon from '@iconify/icons-mdi/send';
import { Icon } from '@iconify/react';
import { auth, db } from '../utils/firebase';
import { push, ref, set } from 'firebase/database';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useSelector } from 'react-redux';

const ChatToolbar: React.FC = () => {
  const [user] = useAuthState(auth);
  const [message, setMessage] = useState<string>('');
  const { currentRoom } = useSelector(
    (state) => state.chat?.sessions?.[user?.uid]
  );
  console.log('==== user====', user);
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

export default ChatToolbar;
