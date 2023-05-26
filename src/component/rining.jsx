import React from "react";
import Popup from "reactjs-popup";
import Button from "@mui/material/Button";
import VideocamIcon from "@mui/icons-material/Videocam";
import PhoneDisabledIcon from "@mui/icons-material/PhoneDisabled";
import { selecteUser, selecteToken } from "../store/auth";
import { selectRining, igonreMeetingCall } from "../store/calls";
import { useSelector, useDispatch } from "react-redux";
import { acceptmeetingCall } from "./socket";
const Rining = ({ name }) => {
  const getRining = useSelector(selectRining);
  const getUser = useSelector(selecteUser);
  const getToken = useSelector(selecteToken);
  const dispatch = useDispatch();
  return (
    <Popup open={getRining.rin} closeOnDocumentClick onClose={() => {}}>
      <div className="rining_continer">
        <div
          className="rining"
          style={{
            backgroundImage: `url(${getRining.picture})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "50vw 70vh",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#00000094",
            }}
          >
            <p style={{ fontSize: "3rem", color: "white" }}>
              you have call from {getRining.groupName && getRining.groupName}
            </p>
          </div>
          <div
            style={{
              width: "25vw",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              variant="contained"
              sx={{
                width: "6vw",
                height: "10vh",
                borderRadius: "50%",
                fontSize: "2rem",
              }}
              color="success"
              onClick={() => {
                acceptmeetingCall({
                  key: getUser.key,
                  groupId: getRining.groupId,
                });
              }}
              endIcon={<VideocamIcon sx={{ width: "5vw", height: "5vh" }} />}
            />
            <Button
              variant="contained"
              sx={{
                width: "6vw",
                height: "10vh",
                borderRadius: "50%",
                fontSize: "2rem",
              }}
              color="error"
              onClick={() => {
                dispatch(
                  igonreMeetingCall({
                    token: getToken,
                    idGroup: getRining.groupId,
                    kind: "meeting",
                  })
                );
              }}
              endIcon={
                <PhoneDisabledIcon sx={{ width: "5vw", height: "5vh" }} />
              }
            />
          </div>
        </div>
      </div>
      ;
    </Popup>
  );
};

export default Rining;
