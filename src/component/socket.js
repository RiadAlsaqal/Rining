import io from "socket.io-client";
import { selecteToken, selecteUser } from "../store/auth";
import { Store } from "../store/configureStore";
import {
  onlineFriend,
  offlineFriend,
  friendAdd,
  friendDelete,
} from "../store/friends";
import {
  onlineMember,
  offlineMember,
  memberDelete,
  deleteGroup,
  groupCreate,
  memberAdd,
} from "../store/groubs";
import {
  reciveCall,
  leaveMemberInCall,
  joinMemberInCall,
  leaveCall,
  requestMemberTalk,
  speackMember,
  talkMember,
  reciveMessage,
  doRining,
  clearRining,
  speackMeeting,
} from "../store/calls";
import { enqueueSnackbar as enqueueSnackbarAction } from "../store/notification";
let socket = io("https://192.168.43.65:8000").disconnect();
selecteToken(Store.getState());
selecteUser(Store.getState());
const enqueueSnackbar = (...args) =>
  Store.dispatch(enqueueSnackbarAction(...args));

const connectToSocket = () => {
  socket.connect();
};

const desconnectFromSocket = () => {
  socket.disconnect();
};

socket.on("connect", () => {
  socket.emit("logIn", selecteToken(Store.getState()));
});

socket.on("clientOpen", (key) => {
  Store.dispatch(onlineFriend(key.key));
  Store.dispatch(onlineMember(key.key, key.groups));
});

socket.on("clientClose", (key) => {
  Store.dispatch(offlineFriend(key.key));
  Store.dispatch(offlineMember(key.key, key.groups));
});

socket.on("notification", (obj) => {
  const i = obj.id;
  enqueueSnackbar({
    message: {
      id: obj.id,
      message: obj[i].message,
      type: obj[i].type,
      end: obj[i].end_reque_Call,
      isRead: obj[i].is_read,
      time: obj[i].time,
      sender_group: obj[i].sender_group,
      sender_user: obj[i].sender_user,
    },
    options: {
      key: obj.id,
    },
  });
});

socket.on("friendAdded", (obj) => {
  Store.dispatch(friendAdd(obj));
});
socket.on("friendDeleted", (key) => {
  Store.dispatch(friendDelete(key));
});

socket.on("groupCreated", (obj) => {
  delete obj.data.member[selecteUser(Store.getState()).key];
  Store.dispatch(groupCreate(obj));
});
socket.on("memberAdded", (obj) => {
  Store.dispatch(memberAdd(obj));
});
socket.on("memberDeleted", (obj) => {
  Store.dispatch(memberDelete(obj));
  obj.keys.foreach((key, i) => {
    if (key === selecteUser(Store.getState()).key)
      Store.dispatch(deleteGroup(obj));
  });
});
const joinLecture = (obj) =>
  socket.emit("joinLecture", {
    groupId: obj,
    key: selecteUser(Store.getState()).key,
    name:
      selecteUser(Store.getState()).firstName +
      " " +
      selecteUser(Store.getState()).lastName,
  });
socket.on("callJoin", (obj) => {
  Store.dispatch(reciveCall(obj));
});

const stream = (stream, idGroup) => {
  socket.emit("stream", stream, idGroup);
};
export const leaveLecture = (key, groupId, kind) => {
  socket.emit("leaveLecture", key, groupId, kind);
};
socket.on("memberJoin", ({ member, kind }) => {
  Store.dispatch(joinMemberInCall({ member, kind }));
});

socket.on("memberLeave", ({ key, kind }) => {
  if (key !== selecteUser(Store.getState()).key)
    Store.dispatch(leaveMemberInCall({ key, kind }));
  else Store.dispatch(leaveCall(kind));
});

socket.on("callEnd", (kind) => {
  console.log("from call end " + kind);
  Store.dispatch(leaveCall(kind));
});

export const talkRequest = () => {
  socket.emit("talkReques", selecteUser(Store.getState()));
};

socket.on("requestTalk", (obj) => {
  Store.dispatch(requestMemberTalk(obj));
});
export const acceptTalk = (Key) => {
  socket.emit("acceptTalk", Key);
};
socket.on("talkStudent", (data) => {
  Store.dispatch(speackMember(data.key, data.sound));
});

socket.on("talkAccept", (key) => {
  Store.dispatch(talkMember(key));
});

export const stopTalk = (key) => {
  socket.emit("stopTalk", key);
};

export const sendMessage = (obj) => {
  socket.emit("sendMessage", obj);
};
socket.on("messageSend", (obj) => {
  Store.dispatch(reciveMessage(obj));
});

socket.on("rining", (obj) => {
  Store.dispatch(doRining(obj));
});

socket.on("clearRining", () => {
  Store.dispatch(clearRining());
});
export const acceptmeetingCall = (obj) => {
  socket.emit("acceptMeetingCall", obj);
};

socket.on("meetingStream", (obj) => {
  Store.dispatch(speackMeeting(obj.key, obj.stream));
});
export { connectToSocket, desconnectFromSocket, joinLecture, stream, socket };
