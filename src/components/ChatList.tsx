import { IRoomItem, IUser } from '@/utils/models';
import { Avatar, Box, Stack, Typography } from '@mui/material';
import React, { ReactElement } from 'react';
import ChatItem from './ChatItem';
interface Props {
  rooms: IRoomItem[];
}

const ChatList: React.FC<Props> = ({ rooms }) => {
  return (
    <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
      {rooms?.map((room) => {
        return <ChatItem room={room} />;
      })}
    </Box>
  );
};

export default ChatList;
