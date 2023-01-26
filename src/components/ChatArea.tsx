import { auth, db, firestore } from '@/utils/firebase';
import { Box } from '@mui/material';
import { onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import MessageGroup from './MessageGroup';
import { useList, useObject } from 'react-firebase-hooks/database';
import { last } from 'lodash';
import { useAuthState } from 'react-firebase-hooks/auth';
import { IMessageGroup, IRoomItem } from '@/utils/models';
import { getFirestore, collection, doc } from 'firebase/firestore';
import {
  useCollection,
  useDocument,
  useDocumentData,
} from 'react-firebase-hooks/firestore';
import { useSelector } from 'react-redux';
interface IMessage {
  uid: string;
  content: string;
}
type TMessageSingle = [string, IMessage[]];
const ChatArea: React.FC = () => {
  const [user] = useAuthState(auth);
  const [userData, loading, error] = useDocumentData(
    doc(firestore, 'users', user?.uid as string),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  const [messages, setMessages] = useState<TMessageSingle[]>([]);
  const { currentRoom } = useSelector(
    (state) => state.chat?.sessions?.[user?.uid as string]
  );

  useEffect(() => {
    if (userData != null && currentRoom !== null) {
      console.log('currentroom uid 1', currentRoom?.uid);
      const roomRef = ref(db, `rooms/${currentRoom?.uid}`);
      console.log('==== roomRef', roomRef.toString());
      onValue(roomRef, (snapshot) => {
        if (snapshot != null) {
          const data = snapshot.val();
          let _messages: any = Object.entries(data);
          console.log('===== _message =====', _messages);
          console.log('===== snapshot =====', snapshot.val());
          console.log('==== roomRef', roomRef.toString());
          console.log('====== currentRoom ====', currentRoom);
          _messages = _messages
            ?.reduce(
              (pre, currentValue) => {
                let clonePre = [...pre];
                const [uid, preMessages] = last(pre);
                const [messageUID, { user, message }] = currentValue;
                console.log('==== currentValue ====', currentValue);
                console.log('=== messageUID ====', messageUID);
                console.log('=== uid ====', uid);
                if (user === uid) {
                  clonePre[clonePre?.length - 1]?.[1]?.push({
                    uid: messageUID,
                    content: message,
                  });
                } else {
                  clonePre = [
                    ...clonePre,
                    [
                      user,
                      [
                        {
                          uid: messageUID,
                          content: message,
                        },
                      ],
                    ],
                  ];
                }
                return clonePre;
              },
              [[userData?.authentication_uid, []]]
            )
            ?.filter(([uid, value]) => uid);

          setMessages(_messages as TMessageSingle[]);
        }
      });
    }
  }, [userData, currentRoom?.uid]);

  return (
    <Box sx={{ flex: 1, overflowY: 'auto', py: 2 }}>
      {messages?.map((message, index) => {
        const uid = message?.[0];
        const isSend = uid === user?.uid;
        return (
          <MessageGroup
            key={`${uid}-${index}`}
            isSend={isSend}
            group={message}
          />
        );
      })}
      {/* <MessageGroup isSend={false} />
      <MessageGroup isSend={true} />
      <MessageGroup isSend={false} />
      <MessageGroup isSend={true} />
      <MessageGroup isSend={false} /> */}
    </Box>
  );
};

export default ChatArea;
