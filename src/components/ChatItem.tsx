import { useCurrentUser } from '@/hooks/useCurrentUser';
import { setCurrentRoom } from '@/redux/slices/chat';
import { db } from '@/utils/firebase';
import { IMessage, IRoomItem, IUser } from '@/utils/models';
import { Avatar, Stack, Typography } from '@mui/material';
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
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
  const dispatch = useDispatch();
  useEffect(() => {
    const roomRef = ref(db, `rooms/${room?.uid}`);
    const _query = query(roomRef, limitToLast(1));
    onValue(_query, (snapshot) => {
      let data = snapshot.val();
      data = Object.entries(data);
      setLatestMessage(data?.[0]);
    });
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
      (snapshot) => {
        const _lastMessage = Object.entries(snapshot.val())?.[0];
        console.log('==== unSeenMessage ====', Object.entries(snapshot.val()));
        const updates = {};
        updates[`/rooms/${room?.uid}/${_lastMessage?.[0]}`] = {
          ..._lastMessage?.[1],
          isSeen: true,
        };
        update(ref(db), updates);
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
    </Stack>
  );
};

export default ChatItem;
