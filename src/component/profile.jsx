import React, { useEffect, useState } from "react";
import joi from "joi-browser";
import {
  selectFriend,
  selectSearchFriends,
  selectSelectedFriends,
} from "../store/friends";
import { reciveNotification } from "../store/notification";
import { useDispatch, useSelector } from "react-redux";
import { addFriend, doConfirme } from "../store/friends";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import styled from "styled-components";
import axios from "axios";
import TextField from "@mui/material/TextField";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import Button from "@mui/material/Button";
import CancelIcon from "@mui/icons-material/Cancel";
import { selectFriends, removeSelectedFriend } from "../store/friends";
import { reciveFriends, searchFriend } from "../store/friends";
import { reciveGroups } from "../store/groubs";
import { receiveUser, selecteToken } from "../store/auth";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ButtonGroup from "@mui/material/ButtonGroup";
import EditIcon from "@mui/icons-material/Edit";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { editUser, selecteUser, setLoading } from "../store/auth";
import KeyIcon from "@mui/icons-material/Key";
import { callGroub } from "../store/calls";
const SearchBar = styled(TextField)`
  width: 90%;
`;

const Profile = () => {
  const [, setProfile] = useState({});
  const [open, setOpen] = useState(false);
  const [keyToSearch, setKeytoSearch] = useState();
  const [searchedFriendToAdd, setSearchedFriendToAdd] = useState({
    state: false,
    result: false,
  });
  const [key, setKey] = useState(false);
  const [options, setOptions] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPasword] = useState(false);
  const [showConfirmePassword, setShowConfirmePassword] = useState(false);
  const getSearchedFriends = useSelector(selectSearchFriends);
  const getSelectedFriends = useSelector(selectSelectedFriends);
  const getuser = useSelector(selecteUser);
  const getToken = useSelector(selecteToken);
  const [account, setAccount] = useState({
    firstName: "",
    lastName: "",
    password: "",
    newPassword: "",
    confirmPassword: "",
    picture: "",
  });
  const [errors, setErrors] = useState({});
  const schema = {
    firstName:
      account.firstName || account.lastName
        ? joi.string().min(3).max(20).label("FirstName")
        : "",
    lastName:
      account.firstName || account.lastName
        ? joi.string().min(2).max(20).label("LastName")
        : "",
    password: joi.string().optional().min(8).label("password"),
    newPassword: account.newPassword
      ? joi.string().min(8).label("new password")
      : joi.optional(),
    confirmPassword: account.newPassword ? account.newPassword : "",
    picture: account.picture,
  };

  const handleSubmitEditProfile = async () => {
    const result = joi.validate(account, schema, { abortEarly: false });
    const { error } = result;
    if (!error) {
      try {
        dispatch(editUser(account, getToken));
      } catch (error) {
        console.log(error);
      }
    } else {
      const errorData = {};
      error.details.foreach((item) => {
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
    const accoun = { ...account };
    accoun[name] = value;
    setAccount(accoun);
    setErrors(errorData);
  };
  const validateConfirmePassword = (e) => {
    const { name, value } = e.target;
    let errorData = { ...errors };
    value === account.newPassword
      ? delete errorData[name]
      : (errorData[name] = "Confirm Password shoud be equal to New Password");
    const accoun = { ...account };
    accoun[name] = value;
    setAccount(accoun);
    setErrors(errorData);
  };

  const getProfile = async () => {
    try {
      dispatch(setLoading());

      const respone = await axios.get(
        `https://192.168.43.65:8000/Accounts/refreshProfile`,
        {
          params: {
            token: localStorage.getItem("token"),
          },
        }
      );
      setProfile(respone.data.profile.userInfo);
      dispatch(receiveUser(respone.data.profile.userInfo));
      dispatch(reciveGroups(respone.data.profile.group));
      dispatch(reciveFriends(respone.data.profile.friend));
      dispatch(reciveNotification(respone.data.profile.notifications));
    } catch (error) {
      console.log(error);
    }
  };
  const searchFriendToAdd = async (key) => {
    try {
      const respone = await axios.get(
        `https://192.168.43.65:8000/Accounts/searchForAdd`,
        {
          params: {
            token: getToken,
            key,
          },
        }
      );
      setSearchedFriendToAdd(respone.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getFriends = useSelector(selectFriends);
  useEffect(() => {
    getProfile();
  }, []);
  const dispatch = useDispatch();
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
    setAccount({ ...account, picture: base64 });
  };
  return (
    <div className="profile">
      <div className="call_profile">
        <div className="selected_friends">
          {Object.keys(getSelectedFriends).length === 0 ? (
            <p style={{ fontSize: "2rem", width: "20vw", fontWeight: "bold" }}>
              Select friends to call or call from your groups
            </p>
          ) : null}
          {Object.keys(getSelectedFriends).map((key, i) => {
            return (
              <>
                <div className="selected_friend">
                  <img
                    className="selected_friend_img"
                    src={getSelectedFriends[key].picture}
                    alt="friend"
                  />
                  <p>{getSelectedFriends[key].friend_name}</p>
                </div>
              </>
            );
          })}
        </div>

        <div className="call_button">
          <Button
            variant="contained"
            disabled={
              Object.keys(getSelectedFriends).length === 0 ? true : false
            }
            color={options ? "success" : "primary"}
            endIcon={<ArrowForwardIcon sx={{ height: "3vh", width: "3vw" }} />}
            sx={{ fontSize: "1.2rem", height: "7vh" }}
            onClick={() => setOptions(!options)}
          >
            Call mode
          </Button>
          <div style={{ display: options ? "inline-block" : "none" }}>
            <ButtonGroup
              orientation="vertical"
              variant="contained"
              sx={{ width: "8vw", height: "1vh" }}
            >
              <Button
                key="one"
                onClick={() =>
                  dispatch(
                    callGroub({
                      kind: "Friends",
                      token: getToken,
                      keys: Object.keys(getSelectedFriends),
                      groupId: 0,
                    })
                  )
                }
              >
                Meeting
              </Button>
              <Button key="one">Lecture</Button>
            </ButtonGroup>
          </div>
        </div>
      </div>
      <div className="friends_profile">
        <div className="add_and_seach_friend">
          <SearchBar
            variant="standard"
            label="Search Friend"
            onChange={(e) => dispatch(searchFriend(e.target.value))}
          />
          <div className="add_friend">
            <PersonAddAlt1Icon
              sx={{ fontSize: "3rem", color: "green", cursor: "pointer" }}
              onClick={() => setOpen(true)}
            />
          </div>
        </div>
        <div
          className="add_friend_form_background"
          style={{ display: open ? "flex" : "none" }}
        >
          <div className="add_friend_form">
            <CancelIcon
              className="close_add_friend_form"
              onClick={() => {
                setOpen(!open);
                setSearchedFriendToAdd({ result: false, state: false });
                setKeytoSearch("");
              }}
            />
            <p style={{ height: "10vh" }} className="not_for_add_seach_friend">
              Search by key! take the key from a friend
            </p>
            <div style={{ width: "100%" }}>
              <div className="seach_friend" style={{ height: "15vh" }}>
                <TextField
                  onChange={(e) => setKeytoSearch(e.target.value)}
                  value={keyToSearch}
                />
                <Button
                  variant="contained"
                  onClick={() => keyToSearch && searchFriendToAdd(keyToSearch)}
                  sx={{ height: "5vh" }}
                >
                  search
                </Button>
              </div>
              <div className="search_friend_result">
                {searchedFriendToAdd && (
                  <p
                    style={{
                      fontSize: "2rem",
                      color: searchedFriendToAdd.state ? "black" : "red",
                    }}
                  >
                    {searchedFriendToAdd.state
                      ? searchedFriendToAdd.result
                      : searchedFriendToAdd.result}
                  </p>
                )}

                {searchedFriendToAdd.state && (
                  <Button
                    variant="contained"
                    sx={{ height: "5vh" }}
                    color="success"
                    onClick={() => {
                      dispatch(
                        addFriend({
                          token: getToken,
                          key: searchedFriendToAdd.key,
                        })
                      );
                      setKeytoSearch("");
                      setSearchedFriendToAdd({ state: false, result: false });
                    }}
                  >
                    Add
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        {Object.keys(getSearchedFriends).length !== 0 ? (
          getSearchedFriends === "no Friends Found" ? (
            <p style={{ fontSize: "2rem" }}> No Friends Found</p>
          ) : (
            Object.keys(getSearchedFriends).map((key, i) => {
              return (
                <div
                  className="friend"
                  style={{
                    backgroundColor: getFriends[key].check ? "gray" : "white",
                  }}
                >
                  <img
                    className="image_friend"
                    src={getSearchedFriends[key].picture}
                    alt="friend"
                  />
                  <p
                    className="name_friend"
                    onClick={() => {
                      getFriends[key].check
                        ? dispatch(removeSelectedFriend(key))
                        : dispatch(selectFriend(key));
                    }}
                    style={{
                      color: getSearchedFriends[key].isLive
                        ? "green"
                        : "initial",
                      fontSize: "1.8rem",
                    }}
                  >
                    {`${getSearchedFriends[key].friend_name} ${getSearchedFriends[key].friend_lname} `}
                  </p>

                  <PersonRemoveIcon
                    onClick={() =>
                      dispatch(doConfirme(getSearchedFriends[key]))
                    }
                    sx={{
                      color: "rgb(221, 7, 7)",
                      fontSize: "3rem",
                      cursor: "pointer",
                    }}
                    className="h"
                  />
                </div>
              );
            })
          )
        ) : (
          Object.keys(getFriends).map((key, i) => {
            return (
              <div
                className="friend"
                style={{
                  backgroundColor: getFriends[key].check ? "gray" : "white",
                }}
              >
                <img
                  className="image_friend"
                  src={getFriends[key].picture}
                  alt="friend"
                />
                <p
                  className="name_friend"
                  onClick={() => {
                    getFriends[key].check
                      ? dispatch(removeSelectedFriend(key))
                      : dispatch(selectFriend(key));
                  }}
                  style={{
                    color: getFriends[key].isLive ? "green" : "initial",
                    fontSize: "1.8rem",
                  }}
                >
                  {`${getFriends[key].friend_name} ${getFriends[key].friend_lname} `}
                </p>

                <PersonRemoveIcon
                  sx={{
                    color: "rgb(221, 7, 7)",
                    fontSize: "3rem",
                    cursor: "pointer",
                  }}
                  className="h"
                  onClick={() => dispatch(doConfirme(getFriends[key]))}
                />
              </div>
            );
          })
        )}
      </div>
      <div
        className="user_profile"
        style={{ height: editProfile ? "100vh" : "48vh" }}
      >
        <EditIcon
          style={{
            alignSelf: "flex-end",
            fontSize: "2rem",
            width: "4vw",
            height: "3.5vh",
            cursor: "pointer",
            color: "rgb(87, 155, 222)",
          }}
          onClick={() => setEditProfile(!editProfile)}
        />

        {editProfile ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "90vh",
              justifyContent: "space-evenly",
              alignItems: "center",
              width: "100%",
            }}
          >
            <img
              className="image_profile"
              src={
                account.picture.length > 1
                  ? account.picture
                  : "data:image/png;base64," + getuser.picture
              }
              alt="something went wrong"
            />
            <input
              type="file"
              onChange={(e) => {
                handleFileUpload(e);
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                width: "100%",
              }}
            >
              <TextField
                variant="outlined"
                label="Edite your First Name"
                name="firstName"
                value={account.firstName}
                error={errors.firstName && true}
                onChange={handleChange}
                InputLabelProps={{
                  style: {
                    color: "rgba(26, 61, 107)",
                    fontWeight: "bold",
                    paddingRight: "2vw",
                  },
                }}
              />

              <TextField
                variant="outlined"
                label="Edite your Last Name"
                name="lastName"
                value={account.lastName}
                error={errors.lastName && true}
                onChange={handleChange}
                InputLabelProps={{
                  style: { color: "rgba(26, 61, 107)", fontWeight: "bold" },
                }}
              />
            </div>
            <div style={{ display: "flex" }}>
              {errors.firstName && (
                <p className="error_message"> {errors.firstName} </p>
              )}
              {errors.lastName && (
                <p className="error_message"> {errors.lastName} </p>
              )}
            </div>
            <FormControl variant="outlined">
              <InputLabel
                sx={{ color: "#3b5998 ", fontWeight: "bold" }}
                htmlFor="outlined-adornment-conferme-password"
              >
                Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-conferme-password"
                type={showPassword ? "text" : "password"}
                name="password"
                error={errors.password && true}
                value={account.password}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="confirmPassword"
              />
            </FormControl>
            {errors.password && (
              <p className="error_message"> {errors.password} </p>
            )}
            <FormControl variant="outlined">
              <InputLabel
                sx={{ color: "#3b5998 ", fontWeight: "bold" }}
                htmlFor="outlined-adornment-new-password"
              >
                New Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-new-password"
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                error={errors.newPassword && true}
                value={account.newPassword}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowNewPasword(!showNewPassword)}
                      edge="end"
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="NewPassword"
              />
            </FormControl>
            {errors.newPassword && (
              <p className="error_message"> {errors.newPassword} </p>
            )}
            <FormControl variant="outlined">
              <InputLabel
                sx={{ color: "#3b5998 ", fontWeight: "bold" }}
                htmlFor="outlined-adornment-conferme-password"
              >
                Conferme Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-conferme-password"
                type={showConfirmePassword ? "text" : "password"}
                name="confirmPassword"
                error={errors.confirmPassword && true}
                value={account.confirmPassword}
                onChange={validateConfirmePassword}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() =>
                        setShowConfirmePassword(!showConfirmePassword)
                      }
                      edge="end"
                    >
                      {showConfirmePassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
                label="confirmPassword"
              />
            </FormControl>
            {errors.confirmPassword && (
              <p className="error_message"> {errors.confirmPassword} </p>
            )}
            <Button
              variant="contained"
              color="success"
              style={{
                display:
                  (account.firstName && account.lastName) || account.newPassword
                    ? "inline-flex"
                    : "none",
              }}
              onClick={() => {
                handleSubmitEditProfile();
                setAccount({
                  firstName: "",
                  lastName: "",
                  password: "",
                  newPassword: "",
                  confirmPassword: "",
                  picture: "",
                });
              }}
            >
              save
            </Button>
          </div>
        ) : (
          <>
            <img className="image_profile" src={getuser.picture} alt="friend" />
            {getuser.firstName && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  position: "relative",
                }}
              >
                <p className="name_profile">{`${getuser.firstName}  ${getuser.lastName}`}</p>
                <div
                  style={{
                    alignSelf: "flex-start",
                    display: "flex",
                    flexDirection: "column",
                    position: "absolute ",
                    left: "120%",
                    bottom: "40%",
                  }}
                  onMouseLeave={() => setKey(false)}
                >
                  <p
                    style={{
                      visibility: key ? "visible" : "hidden",
                      fontSize: "1.2rem",
                      backgroundColor: "gray",
                      borderRadius: "5rem",
                      width: "6vw",
                      textAlign: "center",
                    }}
                  >
                    {getuser.key}
                  </p>
                  <KeyIcon onMouseEnter={() => setKey(true)} className="key" />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
