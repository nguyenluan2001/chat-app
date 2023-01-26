import { Icon } from '@iconify/react';
import { Avatar, IconButton, Stack, Typography } from '@mui/material';
import React, { ReactElement, useState, useEffect } from 'react';
import alertCircle from '@iconify/icons-mdi/alert-circle';
import { IRoomItem, IUser } from '@/utils/models';
import { useSelector } from 'react-redux';
import { useCurrentUser } from '@/hooks/useCurrentUser';

interface IChatHeader {
  handleToggleChatInformation: () => void;
}
const ChatHeader: React.FC<IChatHeader> = ({ handleToggleChatInformation }) => {
  const { user } = useCurrentUser();
  const { currentRoom } = useSelector(
    (state) => state.chat?.sessions[user?.uid]
  );
  const roomName = currentRoom?.members
    ?.map((item: IUser) => item?.email)
    .join('; ');
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      sx={{ height: '70px' }}
    >
      <Stack
        direction="row"
        spacing={2}
      >
        <Avatar>LN</Avatar>
        <Stack direction="column">
          <Typography>{roomName}</Typography>
          <Typography>Active 1h ago</Typography>
        </Stack>
      </Stack>
      <IconButton
        onClick={handleToggleChatInformation}
        sx={{ color: 'white', height: 'fit-content' }}
      >
        <Icon icon={alertCircle} />
      </IconButton>
    </Stack>
  );
};

export default ChatHeader;
