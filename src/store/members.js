import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";

const membersSlice = createSlice({
  name: "members",
  initialState: {
    membersInCall: {},
    membersInRining: { 1: { name: "hh" } },
    groupName: false,
    showRining: false,
  },
  reducers: {
    membersCall: (members, action) => {
      members.membersInCall = action.payload.members;
    },
    membersRining: (members, action) => {
      members.showRining = true;
      members.membersInRining = action.payload.members;
      if (action.payload.groupName)
        members.groupName = action.payload.groupName;
    },
    memberJoinCall: (members, action) => {
      members.membersInCall = {
        ...members.membersInCall,
        [action.payload.member.key]: action.payload.member,
      };
    },
    memberLeaveCall: (members, action) => {
      delete members.membersInCall[action.payload.member.key];
    },

    riningHide: (members, action) => {
      members.showRining = false;
    },
  },
});

export const {
  membersCall,
  membersRining,
  memberJoinCall,
  memberLeaveCall,
  riningHide,
} = membersSlice.actions;
export default membersSlice.reducer;
export const callMembers = (members) => {
  return {
    type: membersCall.type,
    payload: members,
  };
};
export const riningMembers = (members) => {
  return {
    type: membersRining.type,
    payload: members,
  };
};
export const joinMemberCall = (member) => {
  return {
    type: memberJoinCall.type,
    payload: member,
  };
};
export const leaveMemberCall = (member) => {
  return {
    type: memberLeaveCall.type,
    payload: member,
  };
};

export const hideRining = () => {
  return {
    type: riningHide.type,
  };
};

export const selecteMembersCall = createSelector(
  (state) => state.entities.members,
  (members) => members.membersInCall
);
export const selectMembersRining = createSelector(
  (state) => state.entities.members,
  (members) => members.membersInRining
);
export const selecteRiningStatus = createSelector(
  (state) => state.entities.members,
  (members) => members.showRining
);
export const selectGroupName = createSelector(
  (state) => state.entities.members,
  (members) => members.groupName
);
