import { IRoomItem } from '@/utils/models';
import { sliderClasses } from '@mui/material';
import { createSlice, current } from '@reduxjs/toolkit';
interface ChatState {
  sessions: Record<
    string,
    {
      currentRoom: IRoomItem;
    }
  >;
  currentRoom: IRoomItem | null;
}

const initialState: ChatState = {
  sessions: {},
  currentRoom: null,
};
const slice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentRoom: (state, action) => {
      const { uid, room } = action.payload;
      const _state = current(state);
      console.log('=== _state ====', _state);
      state.sessions = {
        ..._state.sessions,
        [uid]: {
          currentRoom: room,
        },
      };
    },
  },
});
export const { setCurrentRoom } = slice.actions;
export default slice.reducer;
