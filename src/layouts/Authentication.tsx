import React, { ReactElement } from 'react';
import { Outlet } from 'react-router-dom';
import { Stack } from '@mui/material';

const Authentication = (): ReactElement => {
  return (
    <Stack
      direction="column"
      sx={{ mx: 'auto' }}
      justifyContent="center"
      alignItems="center"
      spacing={5}
    >
      <img src="/public/photos/chat-logo.png" />
      <Outlet />
    </Stack>
  );
};

export default Authentication;
