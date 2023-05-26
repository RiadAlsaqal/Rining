import { createSelector, createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./actionsApi";
const groubsSlice = createSlice({
  name: "groubs",
  initialState: {
    list: {},
    loading: false,
    searchList: [],
    selectedgroup: {},
    selectedMembersInSelectedGroup: {},
    membersInNewGroup: [],
    searchListMembersForEditGroup: {},
    confirm: { error: "", group: {}, open: false },
  },
  reducers: {
    groubsRequested: (groubs) => {
      groubs.loading = true;
    },
    groubsReceived: (groubs, action) => {
      groubs.list = action.payload.groub;
      groubs.loading = false;
    },
    /* remeber to handle the notification here*/
    groubsRequestFalid: (groubs, action) => {
      groubs.loading = false;
    },

    groubCreated: (groubs, action) => {
      groubs.list = {
        ...groubs.list,
        [action.payload.data.id]: action.payload.data,
      };

      groubs.loading = false;
    },
    createGroubRequestFaild: (groubs, action) => {
      groubs.loading = false;
    },
    groubRemove: (groubs, action) => {
      delete groubs.list[action.payload.id];
      delete groubs.searchList[action.payload.id];
      groubs.selectedgroup = {};
      groubs.loading = false;
      groubs.confirm = { error: "", group: {}, open: false };
    },
    removeGroubRequestFaild: (groubs, action) => {
      groubs.loading = false;
    },
    groubSearched: (groub, action) => {
      groub.searchList = {};
      if (action.payload.name.length !== 0) {
        Object.keys(groub.list).foreach((key) => {
          const x = groub.list[key].group_name.includes(action.payload.name);
          x &&
            (groub.searchList = {
              ...groub.searchList,
              [key]: groub.list[key],
            });
        });
        Object.keys(groub.searchList).length === 0 &&
          (groub.searchList = "no Groups Found");
      }
    },
    groubMemberSearched: (groub, action) => {
      groub.searchListMembersForEditGroup = {};

      if (action.payload.name.length !== 0) {
        Object.keys(action.payload.k).foreach((key, i) => {
          const x = groub.list[action.payload.id].member[key].name.includes(
            action.payload.name
          );
          x &&
            (groub.searchListMembersForEditGroup = {
              ...groub.searchListMembersForEditGroup,
              [key]: groub.list[action.payload.id].member[key],
            });
        });
        Object.keys(groub.searchListMembersForEditGroup).length === 0 &&
          (groub.searchListMembersForEditGroup = "no Friends Found");
      }
    },

    groubSelect: (groub, action) => {
      groub.selectedgroup = groub.list[action.payload.id];
      groub.selectedMembersInSelectedGroup = {};
    },

    memberAdded: (groub, { payload }) => {
      console.log("from the reduver " + payload);
      const { id, newMembers } = payload;
      Object.keys(newMembers).foreach((key, i) => {
        groub.list = {
          ...groub.list,
          [groub.list[id].id]: {
            ...groub.list[id],
            member: { ...groub.list[id].member, [key]: newMembers[key] },
          },
        };
      });
      Object.keys(newMembers).foreach((key, i) => {
        groub.selectedgroup = {
          ...groub.selectedgroup,
          member: { ...groub.selectedgroup.member, [key]: newMembers[key] },
        };
      });
      groub.loading = false;
    },
    addMemberRequestFaild: (groub, action) => {
      groub.loading = false;
    },

    memberDeleted: (groub, action) => {
      const { id, keys } = action.payload;
      keys.foreach((key, i) => {
        delete groub.list[id].member[key];
      });
      keys.map((key, i) => delete groub.selectedgroup.member[key]);
      groub.selectedMembersInSelectedGroup = {};
      groub.loading = false;
    },
    deleteMemberRequestFaild: (groub, action) => {
      groub.loading = false;
    },
    memberSelectedNewGroup: (member, action) => {
      member.membersInNewGroup.push(action.payload.x);
    },
    memberUnSelectedNewGroup: (member, action) => {
      member.membersInNewGroup.filter(
        (member) => member.id !== action.payload.id
      );
    },

    memberSelectedInSelectedGroup: (member, action) => {
      member.selectedgroup = {
        ...member.selectedgroup,
        member: {
          ...member.selectedgroup.member,
          [action.payload.key]: {
            ...member.selectedgroup.member[action.payload.key],
            check: true,
          },
        },
      };
      member.selectedMembersInSelectedGroup = {
        ...member.selectedMembersInSelectedGroup,
        [action.payload.key]: action.payload.key,
      };
    },

    memberUnSelectedInSelectedGroup: (member, action) => {
      member.selectedgroup = {
        ...member.selectedgroup,
        member: {
          ...member.selectedgroup.member,
          [action.payload.key]: {
            ...member.selectedgroup.member[action.payload.key],
            check: false,
          },
        },
      };
      delete member.selectedMembersInSelectedGroup[action.payload.key];
    },

    groupNameEdit: (group, action) => {
      group.list = {
        ...group.list,
        [action.payload.id]: {
          ...group.list[action.payload.id],
          group_name: action.payload.name,
        },
      };

      group.selectedgroup = {
        ...group.selectedgroup,
        group_name: action.payload.name,
      };
    },

    memberOnline: (group, action) => {
      action.payload.groups.foreach((key, i) => {
        if (group.list[key]) {
          group.list[key].member[action.payload.key].live = true;
        }
      });
      if (Object.keys(group.selectedgroup).length > 0)
        group.selectedgroup.member[action.payload.key].live = true;
    },
    memberOffline: (group, action) => {
      action.payload.groups.foreach((key, i) => {
        if (group.list[key]) {
          group.list[key].member[action.payload.key].live = false;
        }
      });
      if (Object.keys(group.selectedgroup).length > 0)
        group.selectedgroup.member[action.payload.key].live = false;
    },
    confirmGroupDo: (state, action) => {
      state.confirm.group = action.payload;
      state.confirm.open = true;
    },
    confirmGroupClear: (state, action) => {
      state.confirm = { message: "", error: "", group: {}, open: false };
    },
  },
});

export const {
  groubsRequested,
  groubsReceived,
  groubsRequestFalid,
  groubCreated,
  createGroubRequestFaild,
  groubRemove,
  removeGroubRequestFaild,
  memberAdded,
  addMemberRequestFaild,
  memberDeleted,
  deleteMemberRequestFaild,
  groubSearched,
  groubSelect,
  memberSelectedNewGroup,
  memberUnSelectedNewGroup,
  memberSelectedInSelectedGroup,
  memberUnSelectedInSelectedGroup,
  groupNameEdit,
  groubMemberSearched,
  memberOnline,
  memberOffline,
  confirmGroupClear,
  confirmGroupDo,
} = groubsSlice.actions;

export default groubsSlice.reducer;
const url = "";
export const loadGroubs = () =>
  apiCallBegan({
    url,
    onStart: groubsRequested.type,
    onSuccess: groubsReceived.type,
    onError: groubsRequestFalid.type,
  });

export const creatGroub = (groub) =>
  apiCallBegan({
    url: "Accounts/addgroup",
    method: "post",
    data: groub,
    onStart: groubsRequested.type,
    onSuccess: groubCreated.type,
    onError: createGroubRequestFaild.type,
  });
export const groupCreate = (data) => {
  return {
    type: groubCreated.type,
    payload: data,
  };
};
export const removeGroub = (id, token) =>
  apiCallBegan({
    url: "Accounts/delete_group",
    method: "post",
    data: {
      id,
      token,
    },
    onStart: groubsRequested.type,
    onSuccess: groubRemove.type,
    onError: removeGroubRequestFaild.type,
  });
export const deleteGroup = (group) => {
  return {
    type: groubRemove.type,
    payload: group,
  };
};

export const searchGroub = (name) => {
  return {
    type: groubSearched.type,
    payload: {
      name,
    },
  };
};
export const searchGroubMembers = (name, id, k) => {
  return {
    type: groubMemberSearched.type,
    payload: {
      name,
      id,
      k,
    },
  };
};

export const addMember = (groupId, keys, token) =>
  apiCallBegan({
    url: "Accounts/addMemberGroup",
    method: "post",
    data: { groupId, keys, token },
    onStart: groubsRequested.type,
    onSuccess: memberAdded.type,
    onError: addMemberRequestFaild.type,
  });
export const memberAdd = (obj) => {
  return {
    type: memberAdded.type,
    payload: obj,
  };
};
export const deleteMember = (groupId, keys, token) =>
  apiCallBegan({
    url: "Accounts/deleteMember",
    method: "post",
    data: { groupId, keys, token },
    onStart: groubsRequested.type,
    onSuccess: memberDeleted.type,
    onError: deleteMemberRequestFaild.type,
  });

export const memberDelete = (group) => {
  return {
    type: memberDeleted.type,
    payload: group,
  };
};
export const editNameGroup = (groupId, newName, token) =>
  apiCallBegan({
    method: "post",
    url: "Accounts/editGroup",
    data: { newName, groupId, token },
    onSuccess: groupNameEdit.type,
  });

export const reciveGroups = (groub) => {
  return {
    type: groubsReceived.type,
    payload: {
      groub,
    },
  };
};
export const selectGroup = (id) => {
  return {
    type: groubSelect.type,
    payload: {
      id,
    },
  };
};

export const selectMemberToNewGroup = (id) => {
  return {
    type: memberSelectedNewGroup.type,
    payload: {
      x: id,
    },
  };
};

export const unSelectMemberToNewGroup = (id) => {
  return {
    type: memberSelectedInSelectedGroup.type,
    payload: {
      id,
    },
  };
};

export const selectMemberInselectedGroup = (key) => {
  return {
    type: memberSelectedInSelectedGroup.type,
    payload: {
      key,
    },
  };
};
export const unSelectMemberInselectedGroup = (key) => {
  return {
    type: memberUnSelectedInSelectedGroup.type,
    payload: {
      key,
    },
  };
};

export const onlineMember = (key, groups) => {
  return {
    type: memberOnline.type,
    payload: {
      key,
      groups,
    },
  };
};
export const offlineMember = (key, groups) => {
  return {
    type: memberOffline.type,
    payload: {
      key,
      groups,
    },
  };
};
export const doConfirmeGroup = (group) => {
  return {
    type: confirmGroupDo.type,
    payload: group,
  };
};
export const celarGroupConfirme = () => {
  return {
    type: confirmGroupClear.type,
  };
};
export const selectSelectedMemberToNewGroup = createSelector(
  (state) => state.entities.groubs,
  (groubs) => groubs.membersInNewGroup
);

export const selectGroups = createSelector(
  (state) => state.entities.groubs,
  (groubs) => groubs.list
);

export const selectSelectedGroup = createSelector(
  (state) => state.entities.groubs,
  (groubs) => groubs.selectedgroup
);

export const selecteSelectedMembersToDelete = createSelector(
  (state) => state.entities.groubs,
  (groubs) => groubs.selectedMembersInSelectedGroup
);

export const selecteSearchedGroup = createSelector(
  (state) => state.entities.groubs,
  (groubs) => groubs.searchList
);

export const selecteSearchedGroupMember = createSelector(
  (state) => state.entities.groubs,
  (groubs) => groubs.searchListMembersForEditGroup
);

export const selectGroupConfirm = createSelector(
  (state) => state.entities.groubs,
  (groubs) => groubs.confirm
);
