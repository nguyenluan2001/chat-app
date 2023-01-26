import { Stack } from '@mui/material';
import React, { ReactElement } from 'react';
import ChatArea from './ChatArea';
import ChatHeader from './ChatHeader';
import ChatToolbar from './ChatToolbar';
interface IChatDetail {
  handleToggleChatInformation: () => void;
}

const ChatDetail: React.FC<IChatDetail> = ({ handleToggleChatInformation }) => {
  return (
    <Stack sx={{ px: 3, height: '100%' }}>
      <ChatHeader handleToggleChatInformation={handleToggleChatInformation} />
      <ChatArea />
      <ChatToolbar />
    </Stack>
  );
};

export default ChatDetail;
