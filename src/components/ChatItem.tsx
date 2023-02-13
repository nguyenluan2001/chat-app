import { useCurrentUser } from '@/hooks/useCurrentUser';
import { setCurrentRoom } from '@/redux/slices/chat';
import { db, firestore } from '@/utils/firebase';
import { IMessage, IRoomItem, IUser } from '@/utils/models';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import {
  equalTo,
  get,
  limitToFirst,
  limitToLast,
  onValue,
  orderByChild,
  orderByKey,
  query,
  ref,
  update,
} from 'firebase/database';
import React, {
  ReactElement,
  ReactEventHandler,
  useEffect,
  useState,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import dotsHorizontalCircleOutline from '@iconify/icons-mdi/dots-horizontal-circle-outline';
import accountCancel from '@iconify/icons-mdi/account-cancel';
import deleteForever from '@iconify/icons-mdi/delete-forever';
import closeCircleOutline from '@iconify/icons-mdi/close-circle-outline';
import { Icon } from '@iconify/react';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';

type TLastestMessage = [string, IMessage];
const ChatItem: React.FC<{
  room: IRoomItem;
}> = ({ room }) => {
  const { user } = useCurrentUser();
  const roomName = room?.members?.map((item: IUser) => item?.email).join('; ');
  const { currentRoom } = useSelector(
    (state) => state?.chat?.sessions?.[user?.uid]
  );
  const [lastestMessage, setLatestMessage] = useState<any>();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  useEffect(() => {
    const roomRef = ref(db, `rooms/${room?.uid}`);
    const _query = query(roomRef, limitToLast(1));
    onValue(_query, (snapshot) => {
      let data = snapshot.val();
      data = Object.entries(data);
      setLatestMessage(data?.[0]);
    });
  }, []);
  useEffect(() => {
    const unsub = onSnapshot(
      doc(firestore, 'users', user?.uid as string),
      (doc) => {
        const data = doc.data();
        const _room = data?.rooms?.find((item) => {
          return item?.uid === room?.uid;
        });
        console.log('🚀 ===== useEffect ===== room', _room);
        setIsBlocked(_room?.isBlocked);
      }
    );
    return unsub;
  }, []);
  const handleSeenMessage = async (): Promise<void> => {
    const roomRef = ref(db, `rooms/${room?.uid}`);
    const _query = query(
      roomRef,
      orderByChild('isSeen'),
      equalTo(false),
      limitToLast(1)
    );
    get(_query).then(
      async (snapshot) => {
        const _lastMessage = Object.entries(snapshot.val())?.[0];
        console.log('==== unSeenMessage ====', Object.entries(snapshot.val()));
        const updates: Record<string, any> = {};
        updates[`/rooms/${room?.uid}/${_lastMessage?.[0]}`] = {
          ..._lastMessage?.[1],
          isSeen: true,
        };
        await update(ref(db), updates);
      },
      () => {}
    );
  };
  const handleSelectRoom = async (): Promise<void> => {
    await handleSeenMessage();
    dispatch(
      setCurrentRoom({
        uid: user?.uid,
        room,
      })
    );
  };
  const handleClickOption = (e: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(e.currentTarget);
  };
  const handleCloseOption = (): void => {
    setAnchorEl(null);
  };
  const handleBlock = async (): Promise<void> => {
    const userRef = doc(firestore, 'users', user?.uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      let rooms = docSnap.data().rooms;
      rooms = rooms?.map((item) => {
        if (item?.uid === room?.uid) {
          return {
            ...item,
            isBlocked: true,
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
  const handleRemoveBlock = async (): Promise<void> => {
    const userRef = doc(firestore, 'users', user?.uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      let rooms = docSnap.data().rooms;
      rooms = rooms?.map((item) => {
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
  const onClickDeleteChat = (): void => {
    setAnchorEl(null);
    setIsOpenDialog(true);
  };
  const handleCloseDialog = (): void => {
    setIsOpenDialog(false);
  };
  const handleDeleteChat = async (): Promise<void> => {
    const userRef = doc(firestore, 'users', user?.uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      let rooms = docSnap.data().rooms;
      rooms = rooms?.filter((item: IRoomItem) => {
        return item?.uid !== room?.uid;
      });
      console.log('🚀 ===== rooms=rooms?.map ===== rooms', rooms);
      await updateDoc(userRef, {
        rooms,
      });
      handleCloseDialog();
    }
  };
  console.log('currentRoom', currentRoom);
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        p: 1,
        '&:hover': {
          background:
            currentRoom?.uid === room?.uid ? 'rgb(37,47,60)' : 'rgb(58,59,60)',
        },
        borderRadius: 2,
        cursor: 'pointer',
        background: currentRoom?.uid === room?.uid ? 'rgb(37,47,60)' : 'none',
      }}
      onClick={handleSelectRoom}
    >
      <Avatar>LN</Avatar>
      <Stack>
        <Typography>{roomName}</Typography>
        <Stack
          direction="row"
          spacing={1}
        >
          {user?.uid === lastestMessage?.[1]?.user && (
            <Typography>You: </Typography>
          )}
          <Typography
            sx={{
              color: lastestMessage?.[1]?.isSeen ? 'white' : 'rgb(46,137,255)',
              fontWeight: lastestMessage?.[1]?.isSeen ? 'normal' : 'bold',
            }}
          >
            {' '}
            {lastestMessage?.[1]?.message}
          </Typography>
        </Stack>
      </Stack>
      <Box sx={{ flex: 1 }} />
      <IconButton>
        <Icon
          icon={dotsHorizontalCircleOutline}
          style={{
            fontSize: '32px',
            color: 'rgb(151,153,158)',
            height: 'fit-content',
          }}
          onClick={handleClickOption}
        />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseOption}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {!isBlocked && (
          <MenuItem onClick={handleBlock}>
            <ListItemIcon>
              <Icon
                icon={accountCancel}
                style={{ fontSize: '24px' }}
              />
            </ListItemIcon>
            <ListItemText>Block</ListItemText>
          </MenuItem>
        )}
        {isBlocked && (
          <MenuItem onClick={handleRemoveBlock}>
            <ListItemIcon>
              <Icon
                icon={accountCancel}
                style={{ fontSize: '24px' }}
              />
            </ListItemIcon>
            <ListItemText>Remove block</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={onClickDeleteChat}>
          <ListItemIcon>
            <Icon
              icon={deleteForever}
              style={{ fontSize: '24px' }}
            />
          </ListItemIcon>
          <ListItemText>Delete chat</ListItemText>
        </MenuItem>
      </Menu>
      <ConfirmDeleteChatDialog
        open={isOpenDialog}
        handleClose={handleCloseDialog}
        handleDeleteChat={handleDeleteChat}
      />
    </Stack>
  );
};
const ConfirmDeleteChatDialog: React.FC<{
  open: boolean;
  handleClose: () => void;
  handleDeleteChat: () => void;
}> = ({ open, handleClose, handleDeleteChat }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>
        <Typography>Delete chat</Typography>
        <IconButton
          sx={{ position: 'absolute', top: '5px', right: '5px' }}
          onClick={handleClose}
        >
          <Icon icon={closeCircleOutline} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        You cannot undo after deleting a copy of this conversation.
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleDeleteChat}
        >
          Delete chat
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default ChatItem;
