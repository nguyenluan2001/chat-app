import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { ReactElement, useEffect, useState } from 'react';
import magnifyIcon from '@iconify/icons-mdi/magnify';
import { Icon } from '@iconify/react';
import ChatList from './ChatList';
import squareEditOutline from '@iconify/icons-mdi/square-edit-outline';
import {
  useCollection,
  useCollectionData,
} from 'react-firebase-hooks/firestore';
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { auth, db, firestore } from '@/utils/firebase';
import { isEmpty } from 'lodash';
import { useAuthState } from 'react-firebase-hooks/auth';
import { IUser } from '@/utils/models';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { onValue, push, ref, set } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';

const Sidebar = (): ReactElement => {
  const { user, loading, error } = useCurrentUser();
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [rooms, setRooms] = useState([]);
  console.log('==== user ====', user);
  // console.log('currentUser', user);
  useEffect(() => {
    if (user?.uid) {
      const unsub = onSnapshot(doc(firestore, 'users', user?.uid), (doc) => {
        console.log('Current data: ', doc.data());
        const data = doc.data();
        setRooms(data?.rooms);
      });
      return unsub;
    }
  }, [user?.rooms]);
  const handleCreateRoom = async (users: IUser[]): Promise<void> => {
    const mergedUsers = [...users, user];
    const roomUID = uuidv4();
    // await push(ref(db, `rooms/${uuidv4()}`), {
    //   user: '',
    //   message: '',
    // });
    // const roomRef = ref(db, `rooms/${now.toLocaleString()}`);
    // onValue(roomRef, (snapshot) => {
    //   const data = snapshot.val();
    //   console.log('==== realtime ====', data);
    // });
    console.log('==== mergedUsers ====', mergedUsers);
    for (const _user of mergedUsers) {
      const restUsers = mergedUsers?.filter(
        (item) => item?.authentication_uid !== _user?.authentication_uid
      );
      const userRef = doc(firestore, 'users', _user?.authentication_uid);
      const userShot = await getDoc(userRef);
      const newRoom = {
        uid: roomUID,
        members: restUsers,
      };
      console.log('====== usershot =====', userShot);
      if (userShot.exists()) {
        await updateDoc(userRef, {
          rooms: [...userShot?.data()?.rooms, newRoom],
        });
      }
    }
    // setIsOpenDialog(false);
  };
  const handleOpenDialog = (): void => {
    setIsOpenDialog(true);
  };
  const handleCloseDialog = (): void => {
    setIsOpenDialog(false);
  };
  console.log('==== rooms ====', rooms);
  return (
    <Stack
      direction="column"
      sx={{
        maxHeight: '100%',
        width: '100%',
        px: 2,
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h4">Chat App</Typography>
        <IconButton
          sx={{ color: 'white' }}
          onClick={handleOpenDialog}
        >
          <Icon icon={squareEditOutline} />
        </IconButton>
      </Stack>
      <TextField
        placeholder="Finding on Chat"
        id="outlined-start-adornment"
        sx={{
          m: 1,
          background: 'rgb(58,59,60)',
          '&::placeholder': {
            color: 'white',
          },
          color: 'white',
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Icon icon={magnifyIcon} />
            </InputAdornment>
          ),
        }}
      />
      <CreateRoomDialog
        handleCreateRoom={handleCreateRoom}
        handleClose={handleCloseDialog}
        open={isOpenDialog}
      />
      <ChatList rooms={rooms} />
    </Stack>
  );
};
interface ICreateRoomDialog {
  handleCreateRoom: (user: IUser[]) => Promise<void>;
  handleClose: () => void;
  open: boolean;
}
const CreateRoomDialog: React.FC<ICreateRoomDialog> = ({
  handleCreateRoom,
  handleClose,
  open,
}) => {
  const [user] = useAuthState(auth);
  const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
  const [users, setUsers] = useState<DocumentData>([]);
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      if (user != null) {
        const q = query(
          collection(firestore, 'users'),
          where('authentication_uid', '!=', user?.uid)
        );
        const rawUsers = await getDocs(q);
        if (!rawUsers.empty) {
          const _users: DocumentData[] = [];
          rawUsers.forEach((item) => {
            _users.push(item.data());
          });
          setUsers(_users);
        }
      }
    };
    fetchData()
      .then(() => {})
      .catch(() => {});
  }, [user]);
  console.log('===== users =====', users);
  const handleSelectUser = (value: IUser[]): void => {
    setSelectedUsers(value);
  };
  const onClickCreateRoom = async (): Promise<void> => {
    await handleCreateRoom(selectedUsers);
  };
  console.log('==== users ====', users);
  console.log('==== user ====', user);
  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>Chat with</DialogTitle>
      <DialogContent>
        <Autocomplete
          id="combo-box-demo"
          getOptionLabel={(option) => option?.email}
          options={!isEmpty(users) ? users : []}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} />}
          multiple={true}
          onChange={(e, value) => {
            handleSelectUser(value);
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={onClickCreateRoom}
        >
          Chat
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default Sidebar;
