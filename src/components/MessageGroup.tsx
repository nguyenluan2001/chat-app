import styled from '@emotion/styled';
import { Avatar, Box, Stack, Typography } from '@mui/material';
import React, { ReactElement } from 'react';
interface IMessage {
  uid: string;
  content: string;
}
interface IMessageGroup {
  isSend: boolean;
  group: [string, IMessage[]];
}
const StyledMessageSingle = styled(Box)(({ isSend }) => ({
  background: isSend ? 'rgb(0,132,255)' : 'rgb(62,64,66)',
  padding: '8px',
  borderRadius: '8px',
}));
const MessageGroup: React.FC<IMessageGroup> = ({ isSend, group }) => {
  return (
    <>
      {isSend && (
        <Stack
          direction="column"
          spacing={1}
          alignItems={isSend ? 'flex-end' : 'flex-start'}
          sx={{ px: 2 }}
        >
          {group?.[1]?.map((item) => {
            return (
              <MessageSingle
                key={item?.[0]}
                message={item}
                isSend={isSend}
              />
            );
          })}
          {/* <MessageSingle message={'hello2'} />
          <MessageSingle message={'hello3'} /> */}
        </Stack>
      )}
      {!isSend && (
        <Stack
          direction="row"
          alignItems="flex-end"
          spacing={2}
          sx={{ px: 2 }}
        >
          <Avatar>LN</Avatar>
          <Stack
            direction="column"
            spacing={1}
          >
            {group?.[1]?.map((item) => {
              return (
                <MessageSingle
                  message={item}
                  key={item?.uid}
                  isSend={isSend}
                />
              );
            })}
            {/* <MessageSingle message={message} /> */}
            {/* <MessageSingle message={'hello2'} />
            <MessageSingle message={'hello3'} /> */}
          </Stack>
        </Stack>
      )}
    </>
  );
};
const MessageSingle: React.FC<{
  message: IMessage;
  isSend: boolean;
}> = ({ message, isSend }) => {
  return (
    <StyledMessageSingle isSend={isSend}>
      {message?.content}
    </StyledMessageSingle>
  );
};

export default MessageGroup;
