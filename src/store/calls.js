import { createSelector, createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./actionsApi";
const callsSlice = createSlice({
  name: "calls",
  initialState: {
    lectureState: { member: [], chat: [] },
    meetingState: { memberCount: 3 },
    lectureCall: false,
    meetingCall: false,
    rining: { key: "", rin: false, picture: "", groupId: 0, groupName: "" },
    adapter: {},
  },

  reducers: {
    callsRequest: () => {},
    callRequestFaild: () => {},
    callRecive: (state, action) => {
      if (action.payload.kind === "lecture") {
        state.lectureState = action.payload;
        state.lectureCall = true;
        action.payload.member.foreach((key) => {
          if (key[key.key].option.canTalk)
            state.adapter = { ...state.adapter, [key.key]: "" };
        });
      } else {
        state.meetingState = action.payload;
        state.meetingCall = true;
        Object.keys(action.payload.member).foreach((key) => {
          if (state.meetingState.member[key].onLine)
            state.adapter = {
              ...state.adapter,
              [key]: {
                name: state.meetingState.member[key].name,
                key: state.meetingState.member[key].key,
                media: "",
              },
            };
        });
        state.rining = { key: "", rin: false };
      }
    },
    memberInCallJoin: (state, action) => {
      if (action.payload.kind === "lecture")
        state.lectureState.member.push(action.payload.member);
      else {
        console.log(
          " from reducer " + action.payload.kind + " " + action.payload.member
        );
        state.meetingState.member[action.payload.member].onLine = true;
        state.adapter = {
          ...state.adapter,
          [action.payload.member]: {
            name: state.meetingState.member[action.payload.member].name,
            key: action.payload.member,
            media: "",
          },
        };
        state.meetingState.memberCount += 1;
      }
    },
    memberInCallLeave: (state, action) => {
      if (action.payload.kind === "lecture")
        state.lectureState.member = state.lectureState.member.filter(
          (key) => key.key !== action.payload.key
        );
      else {
        state.meetingState.memberCount -= 1;
        delete state.meetingState.member[action.payload.key];
        delete state.adapter[action.payload.key];
      }
    },
    callLeave: (state, action) => {
      if (action.payload === "lecture") {
        state.lectureCall = false;
        state.lectureState = { member: [] };
        state.adapter = {};
      } else {
        state.meetingCall = false;
        state.meetingState = {};
        state.adapter = {};
      }
    },

    memberRequestTalk: (state, action) => {
      console.log("asdsad" + action.payload);
      const members = state.lectureState.member.filter(
        (key) => key.key !== action.payload.key
      );
      state.lectureState.member = members;
      state.lectureState.member.unshift(action.payload);
    },
    memberTalk: (state, action) => {
      const members = state.lectureState.member.filter(
        (key) => key.key !== action.payload.key
      );
      state.lectureState.member = members;
      state.lectureState.member.unshift(action.payload);
      state.adapter = { ...state.adapter, [action.payload.key]: "" };
    },

    memberSpeack: (state, action) => {
      state.adapter = {
        ...state.adapter,
        [action.payload.key]: action.payload.media,
      };
    },
    meetingSpeack: (state, action) => {
      state.adapter[action.payload.key].media = action.payload.media;
    },
    memberStopTalk: (state, action) => {
      if (action.payload === "All") {
        state.lectureState.member.foreach((key, i) => {
          if (key[key.key].option.canTalk === "True") {
            key[key.key].option.canTalk = "False";
          }
        });
        state.adapter = {};
      } else {
        const members = state.lectureState.member.filter(
          (key) => key.key !== action.payload.key
        );
        state.lectureState.member = members;
        state.lectureState.member.push(action.payload);
        delete state.adapter[action.payload.key];
      }
    },
    messageRecive: (state, action) => {
      state.lectureState.chat.push(action.payload);
    },
    RiningDo: (state, action) => {
      state.rining = { ...action.payload, rin: true };
    },
    riningClear: (state, action) => {
      state.rining = { key: "", rin: false };
    },
    meetingLeave: (state, action) => {
      state.lectureState = {};
      state.lectureCall = false;
    },
    memberInMeetingMedia: (state, action) => {
      state.adapter[action.payload.media] = action.payload;
    },
  },
});

export const {
  callsRequest,
  callRequestFaild,
  callRecive,
  memberInCallLeave,
  callLeave,
  memberInCallJoin,
  memberRequestTalk,
  memberTalk,
  memberSpeack,
  memberStopTalk,
  messageRecive,
  RiningDo,
  riningClear,
  meetingLeave,
  memberInMeetingMedia,
  meetingSpeack,
} = callsSlice.actions;
export default callsSlice.reducer;
export const callGroub = (groub) =>
  apiCallBegan({
    url: "Accounts/makeCall",
    method: "post",
    data: groub,
    onStart: callsRequest.type,
    onError: callRequestFaild.type,
  });
/* asdsadasd*/

export const endCallGroupIfAdmin = (groub) =>
  apiCallBegan({
    url: "Accounts/endCall",
    method: "post",
    data: groub,
    onStart: callsRequest.type,
    onError: callRequestFaild.type,
  });
export const igonreMeetingCall = (obj) =>
  apiCallBegan({
    url: "Accounts/endCall",
    method: "post",
    data: obj,
    onStart: callsRequest.type,
    onError: callRequestFaild.type,
  });
export const reciveCall = (obj) => {
  return {
    type: callRecive.type,
    payload: obj,
  };
};
export const leaveCall = (kind) => {
  return {
    type: callLeave.type,
    payload: kind,
  };
};

export const joinMemberInCall = (obj) => {
  console.log("from action creatore " + obj.kind + " " + obj.member);
  return {
    type: memberInCallJoin.type,
    payload: obj,
  };
};

export const leaveMemberInCall = (obj) => {
  return {
    type: memberInCallLeave.type,
    payload: obj,
  };
};
export const requestMemberTalk = (obj) => {
  return {
    type: memberRequestTalk.type,
    payload: obj,
  };
};
export const talkMember = (key) => {
  return {
    type: memberTalk.type,
    payload: key,
  };
};

export const speackMember = (key, media) => {
  return {
    type: memberSpeack.type,
    payload: {
      key,
      media,
    },
  };
};
export const speackMeeting = (key, media) => {
  return {
    type: meetingSpeack.type,
    payload: {
      key,
      media,
    },
  };
};
export const stopTalkMember = (obj) => {
  return {
    type: memberStopTalk.type,
    payload: obj,
  };
};
export const reciveMessage = (obj) => {
  return {
    type: messageRecive.type,
    payload: obj,
  };
};
export const doRining = (obj) => {
  return {
    type: RiningDo.type,
    payload: obj,
  };
};
export const clearRining = () => {
  return {
    type: riningClear.type,
  };
};
export const meidaMemberInMeeting = (obj) => {
  return {
    type: memberInMeetingMedia.type,
    payload: obj,
  };
};
export const selecteLectureCall = createSelector(
  (state) => state.entities.calls,
  (calls) => calls.lectureCall
);

export const selecteLectureState = createSelector(
  (state) => state.entities.calls,
  (calls) => calls.lectureState
);

export const selecteAdapter = createSelector(
  (state) => state.entities.calls,
  (calls) => calls.adapter
);
export const selectMeetingState = createSelector(
  (state) => state.entities.calls,
  (calls) => calls.meetingState
);
export const selectMeetingCall = createSelector(
  (state) => state.entities.calls,
  (calls) => calls.meetingCall
);
export const selectRining = createSelector(
  (state) => state.entities.calls,
  (calls) => calls.rining
);
/* width: ${getMeetingState.memberCount > 6
      ? `calc(100% / ${getMeetingState.memberCount})`
      : "calc(100% / 5)"};
    height:  48vh;
    object-fit: fill;
  `;*/
