import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./actionsApi";
import { createSelector } from "@reduxjs/toolkit";
import { memberAdded, memberDeleted } from "./groubs";
const friendsSlice = createSlice({
  name: "friends",
  initialState: {
    list: [],
    selectedFriends: {},
    loading: false,
    notification: [],
    searchList: [],
    friendsForEditGroup: {},
    selectedFriendsForEditGroup: [],
    searchListForEditGroup: {},
    friendsForNewGroup: [],
    selectedFriendsForNewGroup: [],
    searchListForNewGroup: {},
    membersInGroup: {},
    confirm: { error: "", friend: {}, open: false },
  },
  reducers: {
    friendsRequested: (friends, action) => {
      friends.loading = true;
    },

    friendsReceived: (friends, action) => {
      friends.list = action.payload.friends;
      friends.loading = false;
      friends.friendsForEditGroup = action.payload.friends;
      friends.friendsForNewGroup = action.payload.friends;
    },

    /* for  requestFriends */

    friendsRequestFaild: (friends, action) => {
      friends.loading = false;
      friends.notification.push(action.payload);
    },

    friendSelected: (friends, action) => {
      friends.list = {
        ...friends.list,
        [action.payload.key]: {
          ...friends.list[action.payload.key],
          check: true,
        },
      };
      friends.selectedFriends = {
        ...friends.selectedFriends,
        [action.payload.key]: friends.list[action.payload.key],
      };
    },
    friendSelectedRemove: (friends, action) => {
      friends.list = {
        ...friends.list,
        [action.payload.key]: {
          ...friends.list[action.payload.key],
          check: false,
        },
      };
      delete friends.selectedFriends[action.payload.key];
    },
    friendSelectedForEditGroup: (friends, action) => {
      friends.friendsForEditGroup = {
        ...friends.friendsForEditGroup,
        [action.payload.x]: {
          ...friends.friendsForEditGroup[action.payload.x],
          check: true,
        },
      };
      friends.selectedFriendsForEditGroup.push(action.payload.x);
    },
    friendSelectedRemoveForEditGroup: (friends, action) => {
      friends.friendsForEditGroup = {
        ...friends.friendsForEditGroup,
        [action.payload.x]: {
          ...friends.friendsForEditGroup[action.payload.x],
          check: false,
        },
      };
      friends.selectedFriendsForEditGroup =
        friends.selectedFriendsForEditGroup.filter(
          (key) => key !== action.payload.x
        );
    },
    friendsCleanForEditGroup: (friends, action) => {
      Object.keys(friends.friendsForEditGroup).foreach((key, i) => {
        friends.friendsForEditGroup = {
          ...friends.friendsForEditGroup,
          [key]: { ...friends.friendsForEditGroup[key], check: false },
        };
      });
      friends.selectedFriendsForEditGroup = [];
    },

    friendSelectedForNewGroup: (friends, action) => {
      friends.friendsForNewGroup = {
        ...friends.friendsForNewGroup,
        [action.payload.x]: {
          ...friends.friendsForNewGroup[action.payload.x],
          check: true,
        },
      };
      friends.selectedFriendsForNewGroup.push(action.payload.x);
    },
    friendSelectedRemoveForNewGroup: (friends, action) => {
      friends.friendsForNewGroup = {
        ...friends.friendsForNewGroup,
        [action.payload.x]: {
          ...friends.friendsForNewGroup[action.payload.x],
          check: false,
        },
      };
      friends.selectedFriendsForNewGroup =
        friends.selectedFriendsForNewGroup.filter(
          (key) => key !== action.payload.x
        );
    },
    friendAdded: (friend, action) => {
      friend.list = { [action.payload.key]: action.payload, ...friend.list };
      friend.friendsForEditGroup = {
        [action.payload.key]: action.payload,
        ...friend.friendsForEditGroup,
      };
      friend.friendsForNewGroup = {
        [action.payload.key]: action.payload,
        ...friend.friendsForNewGroup,
      };
    },

    friendDeleted: (friend, action) => {
      delete friend.list[action.payload];
      delete friend.friendsForEditGroup[action.payload];
      delete friend.friendsForNewGroup[action.payload];
      friend.confirm = { error: "", friend: {}, open: false };
    },
    /* the resulte of addFreind if it faild */
    addFriendRequestSucceeded: (friend, actopn) => {},

    addFreindRequestFaild: (friends, action) => {
      friends.loading = false;
    },
    friendRemove: (friend, action) => {
      delete friend.list[action.payload.key];
      delete friend.friendsForEditGroup[action.payload.key];
      delete friend.friendsForNewGroup[action.payload.key];
      delete friend.searchList[action.payload.key];
      friend.confirm = { error: "", friend: {}, open: false };
    },
    removeFreindRequestFaild: (friends, action) => {
      friends.loading = false;
    },

    friendSearched: (friend, action) => {
      friend.searchList = {};
      if (action.payload.name.length !== 0) {
        Object.keys(friend.list).foreach((key) => {
          const x =
            friend.list[key].friend_name.includes(action.payload.name) ||
            friend.list[key].friend_lname.includes(action.payload.name);
          x &&
            (friend.searchList = {
              ...friend.searchList,
              [key]: friend.list[key],
            });
        });
        Object.keys(friend.searchList).length === 0 &&
          (friend.searchList = "no Friends Found");
      }
    },

    friendSearchedForEditGroup: (friend, action) => {
      friend.searchListForEditGroup = {};
      if (action.payload.name.length !== 0) {
        Object.keys(friend.friendsForEditGroup).foreach((key) => {
          const x =
            friend.friendsForEditGroup[key].friend_name.includes(
              action.payload.name
            ) ||
            friend.friendsForEditGroup[key].friend_lname.includes(
              action.payload.name
            );
          x &&
            (friend.searchListForEditGroup = {
              ...friend.searchListForEditGroup,
              [key]: friend.friendsForEditGroup[key],
            });
        });
        Object.keys(friend.searchListForEditGroup).length === 0 &&
          (friend.searchListForEditGroup = "no Friends Found");
      }
    },

    friendSearchedForNewGroup: (friend, action) => {
      friend.searchListForNewGroup = {};
      if (action.payload.name.length !== 0) {
        Object.keys(friend.friendsForNewGroup).foreach((key) => {
          const x =
            friend.friendsForNewGroup[key].friend_name.includes(
              action.payload.name
            ) ||
            friend.friendsForNewGroup[key].friend_lname.includes(
              action.payload.name
            );
          x &&
            (friend.searchListForNewGroup = {
              ...friend.searchListForNewGroup,
              [key]: friend.friendsForNewGroup[key],
            });
        });
        Object.keys(friend.searchListForNewGroup).length === 0 &&
          (friend.searchListForNewGroup = "no Friends Found");
      }
    },
    memberFind: (friends, action) => {
      friends.membersInGroup = action.payload.members;
    },

    friendOnline: (friend, action) => {
      friend.list[action.payload.key].isLive = true;
    },
    friendOffline: (friend, action) => {
      friend.list[action.payload.key].isLive = false;
    },
    tes: (friend, action) => {
      friend.list.push(action.payload);
      friend.a.push({ r: 1 });
    },
    friendAccept: (friend, action) => {
      friend.list = {
        ...friend.list,
        [action.payload.user.key]: action.payload.user,
      };
      friend.friendsForEditGroup = {
        ...friend.list,
        [action.payload.user.key]: action.payload.user,
      };
      friend.friendsForNewGroup = {
        ...friend.list,
        [action.payload.user.key]: action.payload.user,
      };
    },
    friendReject: (friend, action) => {},
    confirmDo: (state, action) => {
      state.confirm.friend = action.payload;
      state.confirm.open = true;
    },
    confirmClear: (state, action) => {
      state.confirm = { message: "", error: "", friend: {}, open: false };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(memberDeleted, (state, action) => {
        state.selectedFriendsForEditGroup = [];

        Object.keys(state.friendsForEditGroup).foreach((key, i) => {
          state.friendsForEditGroup = {
            ...state.friendsForEditGroup,
            [key]: { ...state.friendsForEditGroup[key], check: false },
          };
        });
      })
      .addCase(memberAdded, (state, action) => {
        state.selectedFriendsForEditGroup = [];
      });
  },
});

const {
  friendsRequested,
  friendsReceived,
  friendsRequestFaild,
  friendSelected,
  friendSelectedRemove,
  friendAdded,
  friendDeleted,
  addFriendRequestSucceeded,
  friendRemove,
  removeFreindRequestFaild,
  friendSearched,
  friendSelectedForEditGroup,
  friendSelectedRemoveForEditGroup,
  friendSelectedForNewGroup,
  friendSelectedRemoveForNewGroup,
  memberFind,
  friendsCleanForEditGroup,
  friendSearchedForEditGroup,
  friendSearchedForNewGroup,
  friendOnline,
  friendOffline,
  friendAccept,
  friendReject,
  confirmDo,
  confirmClear,
} = friendsSlice.actions;

export default friendsSlice.reducer;
const url = "";
export const loadFriends = () =>
  apiCallBegan({
    url,
    onStart: friendsRequested.type,
    onSuccess: friendsReceived.type,
    onError: friendsRequestFaild.type,
  });

export const addFriend = (friend) =>
  apiCallBegan({
    method: "post",
    url: "Accounts/addfriend",
    data: friend,
    onStart: friendsRequested.type,
    onSuccess: addFriendRequestSucceeded.type,
    onError: friendsRequestFaild.type,
  });

export const removeFriend = (key, status, token) =>
  apiCallBegan({
    url: "Accounts/statusFriend",
    method: "post",
    data: { key, status: "deleted", token },
    onStart: friendsRequested.type,
    onSuccess: friendRemove.type,
    onError: removeFreindRequestFaild.type,
  });

/* there is more in this func like onSuccess => Routing, and or error*/
export const callSelectedFriends = (friends) => {
  apiCallBegan({
    url,
    method: "post",
    data: friends,
  });
};
export const reciveFriends = (friends) => {
  return {
    type: friendsReceived.type,
    payload: {
      friends,
    },
  };
};
export const friendAdd = (friend) => {
  return {
    type: friendAdded.type,
    payload: friend,
  };
};
export const friendDelete = (friend) => {
  return { type: friendDeleted.type, payload: friend };
};
export const selectFriend = (key) => {
  return {
    type: friendSelected.type,
    payload: {
      key,
    },
  };
};
export const removeSelectedFriend = (key) => {
  return {
    type: friendSelectedRemove.type,
    payload: {
      key,
    },
  };
};
export const selectFriendForEditGroup = (key) => {
  return {
    type: friendSelectedForEditGroup.type,
    payload: {
      x: key,
    },
  };
};
export const removeSelectedFriendForEditGroup = (key) => {
  return {
    type: friendSelectedRemoveForEditGroup.type,
    payload: {
      x: key,
    },
  };
};
export const selectFriendForNewGroup = (key) => {
  return {
    type: friendSelectedForNewGroup.type,
    payload: {
      x: key,
    },
  };
};
export const removeSelectedFriendForNewGroup = (key) => {
  return {
    type: friendSelectedRemoveForNewGroup.type,
    payload: {
      x: key,
    },
  };
};
export const searchFriend = (name) => {
  return {
    type: friendSearched.type,
    payload: {
      name,
    },
  };
};

export const searchFriendForEditGroup = (name) => {
  return {
    type: friendSearchedForEditGroup.type,
    payload: {
      name,
    },
  };
};
export const searchFriendForNewGroup = (name) => {
  return {
    type: friendSearchedForNewGroup.type,
    payload: {
      name,
    },
  };
};

export const findMembers = (members) => {
  return {
    type: memberFind.type,
    payload: {
      members,
    },
  };
};
export const onlineFriend = (key) => {
  return {
    type: friendOnline.type,
    payload: { key },
  };
};

export const offlineFriend = (key) => {
  return {
    type: friendOffline.type,
    payload: { key },
  };
};

export const acceptFriend = (friend, token, notiId) =>
  apiCallBegan({
    url: "Accounts/statusFriend",
    method: "post",
    data: { key: friend, token, notiId, status: "accepted" },
    onStart: friendsRequested.type,
    onSuccess: friendAccept.type,
    onError: friendsRequestFaild.type,
  });
export const rejectFriend = (friend, token, notiId) =>
  apiCallBegan({
    url: "Accounts/statusFriend",
    method: "post",
    data: {
      key: friend,
      token,
      notiId,
      status: "rejected",
    },
    onStart: friendsRequested.type,
    onSuccess: friendReject.type,
    onError: friendsRequestFaild.type,
  });
export const cleanFriendsForEditGroup = () => {
  return {
    type: friendsCleanForEditGroup.type,
  };
};
export const doConfirme = (friend) => {
  return {
    type: confirmDo.type,
    payload: friend,
  };
};
export const celarFriendConfirme = () => {
  return {
    type: confirmClear.type,
  };
};
export const selectFriends = createSelector(
  (state) => state.entities.friends,
  (friends) => friends.list
);
export const selectFriendsForEditGroup = createSelector(
  (state) => state.entities.friends,
  (friends) => friends.friendsForEditGroup
);
export const selectFriendsForNewGroup = createSelector(
  (state) => state.entities.friends,
  (friends) => friends.friendsForNewGroup
);
export const selectSelectedFriendsForNewGroup = createSelector(
  (state) => state.entities.friends,
  (friends) => friends.selectedFriendsForNewGroup
);

export const selectMembersForSelectedGroup = createSelector(
  (state) => state.entities.friends,
  (friends) => friends.membersInGroup
);

export const selectSelectedFriendsForEditGroup = createSelector(
  (state) => state.entities.friends,
  (friends) => friends.selectedFriendsForEditGroup
);
export const selectSearchFriends = createSelector(
  (state) => state.entities.friends,
  (friends) => friends.searchList
);

export const selectSearchFriendsForEidtGroup = createSelector(
  (state) => state.entities.friends,
  (friends) => friends.searchListForEditGroup
);

export const selectSearchFriendsForNewGroup = createSelector(
  (state) => state.entities.friends,
  (friends) => friends.searchListForNewGroup
);
export const selectSelectedFriends = createSelector(
  (state) => state.entities.friends,
  (friends) => friends.selectedFriends
);

export const selectFriendConfirm = createSelector(
  (state) => state.entities.friends,
  (friends) => friends.confirm
);
