import React, { useEffect, useState } from "react";
import Rining from "./rining";
import Popup from "reactjs-popup";
import Profile from "./profile";
import Groubs from "./groupsProfile";
import FirstP from "./contant_component/first_p";
import Services from "./contant_component/ourServices";
import About from "./contant_component/about";
import ContactUs from "./contant_component/contactUs";
import TryIt from "./contant_component/tryIt";
import Noti from "./contant_component/noti";
import { selecteToken, selectLogIn } from "../store/auth";
import { selectGroupName, selectMembersRining } from "../store/members";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@mui/material";
import CallIcon from "@mui/icons-material/Call";
import CallEndIcon from "@mui/icons-material/CallEnd";
import { connectToSocket, desconnectFromSocket } from "./socket";
import useNotifier from "./useNotifier";
import {
  selectNotificationBar,
  selectIsread,
  cleanIsRead,
} from "../store/notification";
import NotificationsIcon from "@mui/icons-material/Notifications";
const Contant = () => {
  const getLogin = useSelector(selectLogIn);
  const [, setOpen] = useState(true);
  const [openNoti, setOpenNoti] = useState(false);
  const getGroupName = useSelector(selectGroupName);
  const getMembersRining = useSelector(selectMembersRining);
  const getNotification = useSelector(selectNotificationBar);
  const dispatch = useDispatch();
  useNotifier();

  const getIsRead = useSelector(selectIsread);
  const getToken = useSelector(selecteToken);
  useEffect(() => {
    getLogin ? connectToSocket() : desconnectFromSocket();
  }, [getLogin]);

  return (
    <div className="contant">
      <Rining name="hiiii" />
      {getLogin === true && (
        <div
          style={{
            position: "fixed",
            zIndex: "10",
            left: ".1vw",
            backgroundColor: getIsRead === 0 ? "rgb(21, 101, 192)" : "red",
            borderRadius: "5rem",
            display: "flex",
            width: getIsRead === 0 ? "5vw" : "7vw",
          }}
        >
          <NotificationsIcon
            onClick={() => {
              setOpenNoti(!openNoti);
              getIsRead > 0 && dispatch(cleanIsRead(getToken));
            }}
            style={{
              width: "5vw",
              height: "6vh",
              color: "white",
              cursor: "pointer",
            }}
          />
          {getIsRead > 0 && <p style={{ fontSize: "1.5rem" }}>{getIsRead}</p>}
        </div>
      )}
      <div
        style={{
          display: openNoti ? "flex" : "none",

          justifyContent: "flex-start",
          position: "fixed",
          zIndex: "10",
          width: "20vw",
          left: "0.1vw",
          bottom: "2vh",
          height: "80vh",
          color: "white",
          backgroundColor: "rgba(204, 203, 203, 0.747)",
          borderRadius: "2rem",
          alignItems: "center",
          flexDirection: "column",
          overflow: "auto",
          scrollbarWidth: "1vw",
        }}
      >
        <br />
        {getNotification &&
          getNotification.map((key, i) => {
            return <Noti obj={key} />;
          })}
      </div>
      <Popup open={false} closeOnDocumentClick onClose={() => setOpen(false)}>
        <div
          style={{
            width: "100vw",
            height: "100vh",
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="rining_group">
            <div
              style={{
                width: "90%",
                height: "70%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {getGroupName ? (
                <p>{getGroupName}</p>
              ) : (
                Object.keys(getMembersRining).map((key, i) => {
                  return (
                    <div style={{ textAlign: "center" }}>
                      <img
                        className="selected_friend_img"
                        style={{ backgroundColor: "white" }}
                        alt="friend"
                      />
                      <p>{getMembersRining[key].name}</p>
                    </div>
                  );
                })
              )}
            </div>
            <div
              style={{
                display: "flex",
                width: "60%",
                height: "30% ",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                color="success"
                sx={{ width: "5vw", height: "7vh", borderRadius: "50%" }}
              >
                <CallIcon sx={{ width: "100%", height: "100%" }} />
              </Button>
              <Button
                variant="contained"
                color="error"
                sx={{ width: "5vw", height: "7vh", borderRadius: "50%" }}
              >
                <CallEndIcon sx={{ width: "100%", height: "100%" }} />
              </Button>
            </div>
          </div>
        </div>
      </Popup>
      {getLogin && (
        <>
          <Profile />
          <Groubs />
        </>
      )}

      <FirstP />
      <h1 className="our_services">Our Services: </h1>
      <Services />
      <About />
      <div className="contactUs_and_tryIt">
        <ContactUs />
        <TryIt />
      </div>
    </div>
  );
};

export default Contant;
