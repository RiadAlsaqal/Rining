import React from "react";
import { Button } from "@mui/material";
import { acceptFriend, rejectFriend } from "../../store/friends";
import { useDispatch, useSelector } from "react-redux";
import { selecteToken } from "../../store/auth";
import { joinLecture } from "../socket";
const Noti = ({ obj }) => {
  const { id: notiId, type, message } = obj[obj.id] || "";
  const { id: groupId } = obj[obj.id].sender_group || "";
  const { key: userKey } = obj[obj.id].sender_user || "";
  const dispatch = useDispatch();
  const getToken = useSelector(selecteToken);
  return (
    <div
      style={{
        width: "100%",
        height: "13vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        borderBottom: "1px solid white",
        fontSize: "1.5rem",
      }}
    >
      <p> {message}</p>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-evenly",
        }}
      >
        {type === "call" ? (
          <>
            <Button
              variant="contained"
              color="success"
              style={{ width: "4vw" }}
              onClick={() => {
                joinLecture(groupId);
              }}
            >
              Join
            </Button>
          </>
        ) : type === "RAdd" ? (
          <>
            <Button
              variant="contained"
              style={{ width: "4vw" }}
              onClick={() => {
                dispatch(acceptFriend(userKey, getToken, notiId));
              }}
            >
              Accipte
            </Button>
            <Button
              variant="contained"
              color="error"
              style={{ width: "4vw" }}
              onClick={() => {
                dispatch(rejectFriend(userKey, getToken, notiId));
              }}
            >
              igonre
            </Button>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Noti;
