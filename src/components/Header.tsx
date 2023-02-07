import { auth } from '@/utils/firebase';
import { Button } from '@mui/material';
import { signOut } from 'firebase/auth';
import React from 'react';

const Header = () => {
  const handleSignOut = async (): Promise<void> => {
    await signOut(auth);
  };
  return (
    <div style={{ height: '150px' }}>
      <Button
        variant="contained"
        onClick={handleSignOut}
      >
        Sign Out
      </Button>
      Header
    </div>
  );
};

export default Header;
