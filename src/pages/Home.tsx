import { Button } from '@mui/material';
import { signOut } from 'firebase/auth';
import React, { ReactElement } from 'react';
import { auth } from '@/utils/firebase';

const Home = (): ReactElement => {
  const handleSignOut = async (): Promise<void> => {
    await signOut(auth);
  };
  return (
    <div>
      <Button
        variant="contained"
        onClick={handleSignOut}
      >
        Sign Out
      </Button>
    </div>
  );
};

export default Home;
