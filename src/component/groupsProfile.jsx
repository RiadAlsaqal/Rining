import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import styled from "styled-components";
import joi from "joi-browser";
import CallIcon from "@mui/icons-material/Call";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { selecteToken, selecteUser } from "../store/auth";
import { useDispatch, useSelector } from "react-redux";
import {
  selectGroups,
  selectSelectedGroup,
  selectGroup,
  creatGroub,
  selectMemberInselectedGroup,
  unSelectMemberInselectedGroup,
  deleteMember,
  selecteSelectedMembersToDelete,
  addMember,
  editNameGroup,
  searchGroub,
  selecteSearchedGroup,
  selecteSearchedGroupMember,
  searchGroubMembers,
  doConfirmeGroup,
} from "../store/groubs";
import { callGroub } from "../store/calls";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Button from "@mui/material/Button";
import {
  selectFriendsForEditGroup,
  selectFriendsForNewGroup,
  selectFriendForEditGroup,
  removeSelectedFriendForEditGroup,
  selectFriendForNewGroup,
  removeSelectedFriendForNewGroup,
  selectSelectedFriendsForNewGroup,
  findMembers,
  cleanFriendsForEditGroup,
  selectMembersForSelectedGroup,
  selectSelectedFriendsForEditGroup,
  selectSearchFriendsForEidtGroup,
  searchFriendForEditGroup,
  selectSearchFriendsForNewGroup,
  searchFriendForNewGroup,
} from "../store/friends";
const SearchBar = styled(TextField)`
  width: 27vw;
`;

const Groubs = () => {
  const [editGroupName, setEditGroupName] = useState({
    groupName: "",
  });
  const [errors, setErrors] = useState({});
  const schema = {
    groupName: joi.string().min(3).max(15).required().label("groupName"),
  };
  const [open, setOpen] = useState({
    openDetails: false,
    openCalls: true,
    openGroupDetails: false,
    openAddMember: false,
    openEdit: false,
    openMembers: false,
    openAddGroup: false,
  });

  const [newGroup, setNewGroup] = useState({
    name: "",
    image: "",
    kind: "",
    members: [],
    picture: "",
  });

  const dispatch = useDispatch();
  const getUser = useSelector(selecteUser);
  const getSelectedGroup = useSelector(selectSelectedGroup);
  const getFriendsForEditGroup = useSelector(selectFriendsForEditGroup);
  const getFriendsForNewGroup = useSelector(selectFriendsForNewGroup);
  const getMembersForSelectedGroup = useSelector(selectMembersForSelectedGroup);
  const getSelectedFriendsForNewGroup = useSelector(
    selectSelectedFriendsForNewGroup
  );
  const getSelectedMembersToDelete = useSelector(
    selecteSelectedMembersToDelete
  );
  const getSelectedFriendsForEditGroup = useSelector(
    selectSelectedFriendsForEditGroup
  );
  const getSearchedGroups = useSelector(selecteSearchedGroup);
  const getSearchedFriendsForEditGroup = useSelector(
    selectSearchFriendsForEidtGroup
  );
  const getSearchedGroupsMember = useSelector(selecteSearchedGroupMember);
  const getSearchedFriendsForNewGroup = useSelector(
    selectSearchFriendsForNewGroup
  );
  const getToken = useSelector(selecteToken);

  const getGroups = useSelector(selectGroups);
  const member = getSelectedGroup.member;
  const callHestory = getSelectedGroup.calling;
  const handleSubmitEditNameGroup = async () => {
    const result = joi.validate(editGroupName, schema, { abortEarly: false });
    const { error } = result;
    if (!error) {
      try {
        dispatch(
          editNameGroup(getSelectedGroup.id, editGroupName.groupName, getToken)
        );
        setEditGroupName({ groupName: "" });
      } catch (error) {
        console.log(error);
      }
    } else {
      const errorData = {};
      error.details.forEach((item) => {
        errorData[item.path[0]] = item.message;
      });
      setErrors(errorData);

      return errorData;
    }
  };

  const validateProperty = (event) => {
    const { name, value } = event.target;
    const obj = { [name]: value };
    const subSchema = { [name]: schema[name] };
    const result = joi.validate(obj, subSchema);
    const { error } = result;
    return error ? error.details[0].message : null;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    let errorData = { ...errors };
    const errorMessage = validateProperty(e);
    errorMessage ? (errorData[name] = errorMessage) : delete errorData[name];
    const accoun = { ...editGroupName };
    accoun[name] = value;
    setEditGroupName(accoun);
    setErrors(errorData);
  };

  const getMembers = (keyOfGroup) => {
    const members = Object.keys(getFriendsForEditGroup).filter(
      (key) => !Object.keys(getGroups[keyOfGroup].member).includes(key)
    );
    dispatch(findMembers(members));
  };
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    console.log("asdasd" + base64);
    setNewGroup({ ...newGroup, picture: base64 });
  };
  return (
    <div className="groubs">
      <div className="groubs_list">
        <div className="add_and_seach_friend">
          <SearchBar
            variant="standard"
            label="Search Group"
            onChange={(e) => dispatch(searchGroub(e.target.value))}
          />
          <div className="add_group">
            <AddIcon
              sx={{ fontSize: "4.5rem", color: "green", cursor: "pointer" }}
              onClick={() =>
                setOpen({
                  ...open,
                  openAddGroup: !open.openAddGroup,
                  openDetails: false,
                })
              }
            />
          </div>
        </div>
        {Object.keys(getSearchedGroups).length !== 0 ? (
          getSearchedGroups === "no Groups Found" ? (
            <p style={{ fontSize: "2rem" }}> No Groups Found</p>
          ) : (
            Object.keys(getSearchedGroups).map((key, i) => {
              return (
                <div
                  /*style={{
                backgroundColor: `${
                  friends[key].check ? "rgb(219, 216, 216)" : "white"
                }`,
              }}*/
                  className="groub"
                  onClick={() => {
                    dispatch(cleanFriendsForEditGroup());
                    dispatch(selectGroup(key));
                    setOpen({
                      ...open,
                      openDetails: true,
                      openAddGroup: false,
                      openAddMember: false,
                      openEdit: false,
                      openMembers: false,
                      openCalls: true,
                      openGroupDetails: false,
                    });
                    getMembers(key);
                  }}
                >
                  <img
                    className="image_friend"
                    src={getSearchedGroups[key].picture}
                    alt="friend"
                  />
                  <p className="name_friend">{`${getSearchedGroups[key].group_name}`}</p>
                  <p style={{ alignSelf: "flex-end" }}>
                    {getSearchedGroups[key].kind} group
                  </p>
                  <Button
                    variant="outlined"
                    sx={{
                      color: "red",
                      borderColor: "white",
                      "&:hover": {
                        borderColor: "white",
                        backgroundColor: "white",
                      },
                      position: "relative",
                    }}
                  >
                    <RemoveIcon
                      sx={{
                        color: "rgb(221, 7, 7)",
                        fontSize: "4.5rem",
                        cursor: "pointer",
                        width: "4.5vw",
                      }}
                      onClick={() => {
                        dispatch(doConfirmeGroup(getSearchedGroups[key]));
                      }}
                    />
                  </Button>
                </div>
              );
            })
          )
        ) : (
          Object.keys(getGroups).map((key, i) => {
            return (
              <div
                /*style={{
                backgroundColor: `${
                  friends[key].check ? "rgb(219, 216, 216)" : "white"
                }`,
              }}*/
                className="groub"
                onClick={() => {
                  dispatch(cleanFriendsForEditGroup());
                  dispatch(selectGroup(key));
                  setOpen({
                    ...open,
                    openDetails: true,
                    openAddGroup: false,
                    openAddMember: false,
                    openEdit: false,
                    openMembers: false,
                    openCalls: true,
                    openGroupDetails: false,
                  });
                  getMembers(key);
                }}
              >
                <img
                  className="image_friend"
                  src={getGroups[key].picture}
                  alt="friend"
                />
                <p className="name_friend">{`${getGroups[key].group_name}`}</p>
                <p style={{ alignSelf: "flex-end" }}>
                  {getGroups[key].kind} group
                </p>
                <Button
                  variant="outlined"
                  sx={{
                    color: "red",
                    borderColor: "white",
                    "&:hover": {
                      borderColor: "white",
                      backgroundColor: "white",
                    },
                    position: "relative",
                  }}
                >
                  <RemoveIcon
                    sx={{
                      color: "rgb(221, 7, 7)",
                      fontSize: "4.5rem",
                      cursor: "pointer",
                      width: "4.5vw",
                    }}
                    onClick={() => {
                      dispatch(doConfirmeGroup(getGroups[key]));
                    }}
                  />
                </Button>
              </div>
            );
          })
        )}
      </div>
      <div className="groubs_details">
        <div
          style={{
            display: open.openDetails ? "flex" : "none",
            flexDirection: "column",
            width: "100%",
            alignItems: "center",
          }}
        >
          <div
            className="groub_nav_bar"
            onClick={() =>
              setOpen({
                ...open,
                openCalls: !open.openCalls,
                openGroupDetails: !open.openGroupDetails,
                openAddGroup: false,
              })
            }
          >
            <div className="name_and_number_group">
              <p className="group_name">
                {getSelectedGroup && getSelectedGroup.group_name}
              </p>
              <p className="number_of_members_groub">
                {member && Object.keys(member).length + 1 + " "}
                members
              </p>
            </div>
            <div style={{ display: "flex" }}>
              {member && Object.keys(member).length > 0 ? (
                getSelectedGroup.kind === "Meeting" ? (
                  <div
                    style={{ alignSelf: "center" }}
                    onClick={() =>
                      dispatch(
                        callGroub({
                          token: getToken,
                          keys: Object.keys(member),
                          kind: getSelectedGroup.kind,
                          groupId: getSelectedGroup.id,
                        })
                      )
                    }
                  >
                    <CallIcon
                      sx={{
                        color: "white",
                        fontSize: "4rem",
                        marginRight: "2vw",
                      }}
                    />
                  </div>
                ) : getSelectedGroup.kind === "lecture" ? (
                  getSelectedGroup.admin === getUser.key ? (
                    <div
                      style={{ alignSelf: "center" }}
                      onClick={() =>
                        dispatch(
                          callGroub({
                            token: getToken,
                            keys: Object.keys(member),
                            kind: getSelectedGroup.kind,
                            groupId: getSelectedGroup.id,
                          })
                        )
                      }
                    >
                      <CallIcon
                        sx={{
                          color: "white",
                          fontSize: "4rem",
                          marginRight: "2vw",
                        }}
                      />
                    </div>
                  ) : null
                ) : null
              ) : null}
              <img
                className="image_friend"
                src={getSelectedGroup.picture}
                alt="friend"
              />
            </div>
          </div>
          <div
            className="group_calling_hestory"
            style={{
              display: open.openCalls ? "flex" : "none",
              flexDirection: "column-reverse",
            }}
          >
            {callHestory && Object.keys(callHestory).length === 0 && (
              <p
                style={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  width: "99%",
                  fontSize: "2.2rem",
                  overflow: "hidden",
                  color: "gray  ",
                }}
              >
                No calls yet
              </p>
            )}
            {callHestory &&
              Object.keys(callHestory).map((key, i) => (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    width: "99%",
                    borderTop: "1px solid gray",
                    fontSize: "2.2rem",
                    overflow: "hidden",
                    color: "gray  ",
                  }}
                >
                  <p>
                    Call date:
                    {getSelectedGroup.calling[key].call_date &&
                      getSelectedGroup.calling[key].call_date}
                  </p>
                  <p>
                    Call time:
                    {getSelectedGroup.calling[key].call_date &&
                      getSelectedGroup.calling[key].call_time}
                  </p>
                  <p>
                    duration:
                    {getSelectedGroup.calling[key].call_date &&
                      getSelectedGroup.calling[key].call_durtion}
                  </p>
                </div>
              ))}
          </div>

          <div
            className="group_details_popup"
            style={{ display: open.openGroupDetails ? "flex" : "none" }}
          >
            {getUser.key === getSelectedGroup.admin && (
              <>
                <p
                  className=" style_paragraph_group"
                  onClick={() =>
                    setOpen({
                      ...open,
                      openEdit: !open.openEdit,
                      openAddMember: false,
                      openMembers: false,
                    })
                  }
                >
                  Edit Name and Picture
                </p>
                <div
                  className="edit_name_and_picture_group"
                  style={{
                    display: open.openEdit ? "flex" : "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <div>
                      <TextField
                        variant="outlined"
                        label="Edit group name"
                        sx={{ width: "15vw" }}
                        name="groupName"
                        value={editGroupName.groupName}
                        error={errors.groupName && true}
                        onChange={handleChange}
                      />
                      {errors.groupName && (
                        <p className="error_message"> {errors.groupName} </p>
                      )}
                    </div>
                    <div style={{ width: "10vw", hieght: "20vh" }}>
                      <img className="image_friend" alt="friend" />
                      <input type="file" />
                    </div>
                  </div>
                  <Button
                    variant="contained"
                    sx={{
                      height: "5vh",
                      width: "10vw",
                      fontSize: "1.5rem",
                    }}
                    color="success"
                    onClick={() => handleSubmitEditNameGroup()}
                  >
                    Save
                  </Button>
                </div>
                <p
                  className="style_paragraph_group"
                  onClick={() => {
                    setOpen({
                      ...open,
                      openAddMember: !open.openAddMember,
                      openEdit: false,
                      openMembers: false,
                    });
                    getMembers(getSelectedGroup.id);
                  }}
                >
                  Add member
                </p>
                <div
                  style={{
                    display: open.openAddMember ? "flex" : "none",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <div className="add_friend_to_group">
                    <SearchBar
                      variant="standard"
                      label="Search Friend"
                      onChange={(e) =>
                        dispatch(searchFriendForEditGroup(e.target.value))
                      }
                    />
                    {Object.keys(getSearchedFriendsForEditGroup).length !==
                    0 ? (
                      getSearchedFriendsForEditGroup === "no Friends Found" ? (
                        <p style={{ fontSize: "2rem" }}> No Friends Found</p>
                      ) : (
                        Object.keys(getSearchedFriendsForEditGroup).map(
                          (key, i) => {
                            return (
                              <div
                                key={i}
                                style={{
                                  backgroundColor: getFriendsForEditGroup[key]
                                    .check
                                    ? "gray"
                                    : "white",
                                }}
                                className="friend"
                                onClick={() => {
                                  getFriendsForEditGroup[key].check
                                    ? dispatch(
                                        removeSelectedFriendForEditGroup(key)
                                      )
                                    : dispatch(selectFriendForEditGroup(key));
                                }}
                              >
                                <img
                                  key={i}
                                  className="image_friend"
                                  src={getFriendsForEditGroup[key].picture}
                                  alt="friend"
                                />
                                <p key={i} className="name_friend">
                                  {`${getSearchedFriendsForEditGroup[key].friend_name} ${getSearchedFriendsForEditGroup[key].friend_lname}`}
                                </p>
                              </div>
                            );
                          }
                        )
                      )
                    ) : (
                      Object.keys(getMembersForSelectedGroup).map((key, i) => {
                        return (
                          <div
                            key={i}
                            style={{
                              backgroundColor: getFriendsForEditGroup[
                                getMembersForSelectedGroup[key]
                              ].check
                                ? "gray"
                                : "white",
                            }}
                            className="friend"
                            onClick={() => {
                              getFriendsForEditGroup[
                                getMembersForSelectedGroup[key]
                              ].check
                                ? dispatch(
                                    removeSelectedFriendForEditGroup(
                                      getMembersForSelectedGroup[key]
                                    )
                                  )
                                : dispatch(
                                    selectFriendForEditGroup(
                                      getMembersForSelectedGroup[key]
                                    )
                                  );
                            }}
                          >
                            <img
                              key={i}
                              className="image_friend"
                              src={
                                getFriendsForEditGroup[
                                  getMembersForSelectedGroup[key]
                                ].picture
                              }
                              alt="friend"
                            />
                            <p key={i} className="name_friend">
                              {`${
                                getFriendsForEditGroup[
                                  getMembersForSelectedGroup[key]
                                ].friend_name
                              } ${
                                getFriendsForEditGroup[
                                  getMembersForSelectedGroup[key]
                                ].friend_lname
                              }`}
                            </p>
                          </div>
                        );
                      })
                    )}
                  </div>
                  <br />
                  <br />
                  <Button
                    variant="contained"
                    sx={{
                      height: "5vh",
                      width: "10vw",
                      fontSize: "1.5rem",
                    }}
                    color="success"
                    onClick={() => {
                      getSelectedFriendsForEditGroup.length !== 0 &&
                        dispatch(
                          addMember(
                            getSelectedGroup.id,
                            getSelectedFriendsForEditGroup,
                            getToken
                          )
                        );
                    }}
                    onMouseLeave={() =>
                      setTimeout(() => getMembers(getSelectedGroup.id), 1000)
                    }
                  >
                    add
                  </Button>
                </div>
              </>
            )}
            <p
              className="style_paragraph_group"
              onClick={() => {
                setOpen({
                  ...open,
                  openAddMember: false,
                  openEdit: false,
                  openMembers: !open.openMembers,
                });
              }}
            >
              Members
            </p>
            <div
              style={{
                display: open.openMembers ? "flex" : "none",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <SearchBar
                variant="standard"
                label="Search Member"
                onChange={(e) =>
                  dispatch(
                    searchGroubMembers(
                      e.target.value,
                      getSelectedGroup.id,
                      member
                    )
                  )
                }
              />

              {member &&
                (Object.keys(getSearchedGroupsMember).length !== 0 ? (
                  getSearchedGroupsMember === "no Friends Found" ? (
                    <p style={{ fontSize: "2rem" }}> No Friends Found</p>
                  ) : (
                    Object.keys(getSearchedGroupsMember).map((key, i) => {
                      return (
                        <>
                          <div
                            key={i}
                            className="members"
                            style={{
                              backgroundColor: member[key].check
                                ? "gray"
                                : "white",
                            }}
                            onClick={() => {
                              member[key].check
                                ? dispatch(unSelectMemberInselectedGroup(key))
                                : dispatch(selectMemberInselectedGroup(key));
                            }}
                          >
                            <img
                              key={i}
                              className="image_friend"
                              src={getSearchedGroupsMember[key].picture}
                              alt="friend"
                            />
                            <p
                              key={i}
                              className="name_friend"
                              style={{
                                color: getSearchedGroupsMember[key].live
                                  ? "green"
                                  : "initial",
                              }}
                            >
                              {getSearchedGroupsMember[key].name}
                            </p>
                          </div>
                        </>
                      );
                    })
                  )
                ) : (
                  Object.keys(member).map((key, i) => {
                    return (
                      <>
                        <div
                          key={i}
                          className="members"
                          style={{
                            backgroundColor: member[key].check
                              ? "gray"
                              : "white",
                          }}
                          onClick={() => {
                            member[key].check
                              ? dispatch(unSelectMemberInselectedGroup(key))
                              : dispatch(selectMemberInselectedGroup(key));
                          }}
                        >
                          <img
                            key={i}
                            className="image_friend"
                            src={getSelectedGroup.member[key].picture}
                            alt="friend"
                          />
                          <p
                            key={i}
                            className="name_friend"
                            style={{
                              color:
                                getSelectedGroup.kind === "lecture"
                                  ? getSelectedGroup.admin === getUser.key
                                    ? getSelectedGroup.member[key].live
                                      ? "green"
                                      : "initial"
                                    : "initial"
                                  : getSelectedGroup.member[key].live
                                  ? "green"
                                  : "initial",
                            }}
                          >
                            {getSelectedGroup.member[key].name}
                          </p>
                        </div>
                      </>
                    );
                  })
                ))}

              {getUser.key === getSelectedGroup.admin &&
                member &&
                Object.keys(member).length !== 0 && (
                  <Button
                    variant="contained"
                    sx={{
                      height: "5vh",
                      width: "10vw",
                      fontSize: "1.5rem",
                      marginTop: "1vw",
                    }}
                    color="success"
                    onClick={() => {
                      Object.keys(getSelectedMembersToDelete).length !== 0 &&
                        dispatch(
                          deleteMember(
                            getSelectedGroup.id,
                            Object.keys(getSelectedMembersToDelete),
                            getToken
                          )
                        );
                    }}
                  >
                    Delete
                  </Button>
                )}
            </div>
          </div>
        </div>
        <br />

        {open.openAddGroup && (
          <div className="add_group_form">
            <p
              style={{
                fontSize: "3rem",
                color: "rgb(21, 63, 117)",
                fontFamily: " Arial, Helvetica, sans-serif",
              }}
            >
              New group
            </p>
            <div
              className="edit_name_and_picture_group"
              style={{ display: "flex" }}
            >
              <TextField
                variant="outlined"
                label="group name"
                sx={{ width: "15vw" }}
                value={newGroup.name}
                onChange={(e) =>
                  setNewGroup({ ...newGroup, name: e.target.value })
                }
              />
              <div style={{ width: "10vw", hieght: "20vh" }}>
                <img className="image_friend" alt="friend" />
                <input
                  type="file"
                  onChange={(e) => {
                    handleFileUpload(e);
                  }}
                />
              </div>
            </div>
            <p className="style_paragraph_group" style={{ cursor: "default" }}>
              Kind of group
            </p>
            <div>
              <RadioGroup
                value={newGroup.kind}
                onChange={(e) =>
                  setNewGroup({ ...newGroup, kind: e.target.value })
                }
              >
                <FormControlLabel
                  value="Meeting"
                  control={<Radio />}
                  label={<span style={{ fontSize: "2rem" }}>Meeting</span>}
                />
                <FormControlLabel
                  value="lecture"
                  control={<Radio />}
                  label={<span style={{ fontSize: "2rem" }}>Lecture</span>}
                />
              </RadioGroup>
            </div>
            <p
              style={{
                borderBottom: "1px solid rgb(200, 200, 200)",
                width: "87%",
                height: ".2vh",
              }}
            />

            <p className="style_paragraph_group" style={{ cursor: "default" }}>
              Add members
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <div className="add_friend_to_group">
                <SearchBar
                  variant="standard"
                  label="Search Friend"
                  onChange={(e) =>
                    dispatch(searchFriendForNewGroup(e.target.value))
                  }
                />
                {Object.keys(getSearchedFriendsForNewGroup).length !== 0 ? (
                  getSearchedFriendsForNewGroup === "no Friends Found" ? (
                    <p style={{ fontSize: "2rem" }}> No Friends Found</p>
                  ) : (
                    Object.keys(getSearchedFriendsForNewGroup).map((key, i) => {
                      return (
                        <div
                          key={i}
                          style={{
                            backgroundColor: getFriendsForNewGroup[key].check
                              ? "gray"
                              : "white",
                          }}
                          className="friend"
                          onClick={() => {
                            getFriendsForNewGroup[key].check
                              ? dispatch(removeSelectedFriendForNewGroup(key))
                              : dispatch(selectFriendForNewGroup(key));
                          }}
                        >
                          <img
                            key={i}
                            className="image_friend"
                            src={getSearchedFriendsForNewGroup[key].picture}
                            alt="friend"
                          />
                          <p
                            key={i}
                            className="name_friend"
                            style={{ fontSize: "2rem" }}
                          >
                            {`${getSearchedFriendsForNewGroup[key].friend_name} ${getSearchedFriendsForNewGroup[key].friend_lname}`}
                          </p>
                        </div>
                      );
                    })
                  )
                ) : (
                  Object.keys(getFriendsForNewGroup).map((key, i) => {
                    return (
                      <div
                        key={i}
                        style={{
                          backgroundColor: getFriendsForNewGroup[key].check
                            ? "gray"
                            : "white",
                        }}
                        className="friend"
                        onClick={() => {
                          getFriendsForNewGroup[key].check
                            ? dispatch(removeSelectedFriendForNewGroup(key))
                            : dispatch(selectFriendForNewGroup(key));
                        }}
                      >
                        <img
                          key={i}
                          className="image_friend"
                          src={getFriendsForNewGroup[key].picture}
                          alt="friend"
                        />
                        <p
                          key={i}
                          className="name_friend"
                          style={{ fontSize: "2rem" }}
                        >
                          {`${getFriendsForNewGroup[key].friend_name} ${getFriendsForNewGroup[key].friend_lname}`}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
              <br />
              <br />
              <Button
                variant="contained"
                sx={{
                  height: "auto",
                  width: "auto",
                  fontSize: "1.5rem",
                }}
                color="success"
                onMouseOver={() =>
                  setNewGroup({
                    ...newGroup,
                    members: getSelectedFriendsForNewGroup,
                  })
                }
                onClick={() => {
                  dispatch(
                    creatGroub({ newGroup, token: getToken, created: true })
                  ) &&
                    setNewGroup({
                      name: "",
                      image: "",
                      kind: "",
                      members: [],
                      picture: "",
                    });
                }}
              >
                Create group
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Groubs;
