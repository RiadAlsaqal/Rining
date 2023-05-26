import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createSelector } from "@reduxjs/toolkit";
import "./scrollcss.css";
import styled from "styled-components";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicOffIcon from "@mui/icons-material/MicOff";
import ChatIcon from "@mui/icons-material/Chat";
import AddBoxIcon from "@mui/icons-material/AddBox";
import InputSlider from "./volumeSilder";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import VoiceOverOffIcon from "@mui/icons-material/VoiceOverOff";
import SendIcon from "@mui/icons-material/Send";
import { selecteUser, selecteToken } from "../store/auth";
import {
  selecteLectureCall,
  selecteLectureState,
  endCallGroupIfAdmin,
  selecteAdapter,
  stopTalkMember,
} from "../store/calls";
import {
  socket,
  leaveLecture,
  talkRequest,
  acceptTalk,
  stopTalk,
  sendMessage,
} from "./socket";
import TextField from "@mui/material/TextField";

const VideoStyled = styled.video`
  width: 100%;
  height: 98vh;
  object-fit: fill;
`;

const Call = (props) => {
  const ref = useRef();
  const [show1, setShow] = useState("none");
  const [imagesrc1, setImageSrc1] = useState(null);
  const navigate = useNavigate();
  const getLectureCall = useSelector(selecteLectureCall);
  const getLectureState = useSelector(selecteLectureState);
  const getUser = useSelector(selecteUser);
  const getToken = useSelector(selecteToken);
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const Admin = createSelector(
    [
      (state) => state.entities.auth.user,
      (state) => state.entities.calls.lectureState,
    ],
    (user, lecture) => {
      const isAdmin =
        user.key === lecture.adminKey && lecture.adminKey !== undefined;

      return isAdmin;
    }
  );
  const isAdmin = useSelector(Admin);
  const selectMyObject = createSelector(
    [
      (state) => state.entities.auth.user,
      (state) => state.entities.calls.lectureState,
    ],
    (user, lecture) => {
      const my = lecture.member.find((member) => member.key === user.key);
      if (my) {
        const s = my[my.key];
        return s;
      }
    }
  );
  const getMyObjectAsStudent = useSelector(selectMyObject);
  const [mute, setMute] = useState(false);
  const getAdapter = useSelector(selecteAdapter);
  const handleVoice = () => {
    if (!mute) {
      Window.localStream.getAudioTracks().forEach((track) => track.stop());
      setMute(true);
    } else {
      Window.localStream.getTracks().forEach((track) => track.stop());
      MainFunction(3000);
      setMute(false);
    }
  };
  const exitStream = () => {
    Window.localStream.getTracks().forEach((track) => track.stop());
  };

  useEffect(() => {
    getMyObjectAsStudent &&
      getMyObjectAsStudent.option.canTalk === "True" &&
      studentTalk(3000);
  }, [getMyObjectAsStudent]);
  useEffect(() => {
    if (isAdmin === true) {
      MainFunction(3000);
      console.log("from ff ");
    }
  }, [isAdmin]);
  function MainFunction(time) {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        Window.localStream = stream;
        // const s = URL.createObjectURL(stream);
        //setVideo(s);
        const node = ref.current;
        if (node) node.srcObject = stream;
        var madiaRecorder = new MediaRecorder(stream);
        stream.active && madiaRecorder.start();

        var audioChunks = [];

        madiaRecorder.addEventListener("dataavailable", function (event) {
          audioChunks.push(event.data);
        });

        madiaRecorder.addEventListener("stop", function () {
          var audioBlob = new Blob(audioChunks);

          audioChunks = [];

          var fileReader = new FileReader();
          fileReader.readAsDataURL(audioBlob);
          fileReader.onloadend = function () {
            var base64String = fileReader.result;
            socket.emit("sendVoice", base64String, getLectureState.idGroup);
          };

          stream.active && madiaRecorder.start();

          setTimeout(function () {
            stream.active && madiaRecorder.stop();
            console.log("1");
          }, time);
        });

        setTimeout(function () {
          stream.active && madiaRecorder.stop();
          console.log("2");
        }, time);
      });
  }

  const studentTalk = (time) => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then((stream) => {
        Window.localStream = stream;

        var madiaRecorder = new MediaRecorder(stream);
        stream.active && madiaRecorder.start();

        var audioChunks = [];

        madiaRecorder.addEventListener("dataavailable", function (event) {
          audioChunks.push(event.data);
        });

        madiaRecorder.addEventListener("stop", function () {
          var audioBlob = new Blob(audioChunks);

          audioChunks = [];

          var fileReader = new FileReader();
          fileReader.readAsDataURL(audioBlob);
          fileReader.onloadend = function () {
            var base64String = fileReader.result;
            socket.emit("studentTalk", {
              sound: base64String,
              key: getUser.key,
            });
          };

          stream.active && madiaRecorder.start();

          setTimeout(function () {
            stream.active && madiaRecorder.stop();
          }, time);
        });

        setTimeout(function () {
          stream.active && madiaRecorder.stop();
        }, time);
      });
  };
  useEffect(() => {
    socket.on("reciveVoice", (data) => {
      setImageSrc1(data);
    });
    socket.on("talkStop", (obj) => {
      dispatch(stopTalkMember(obj));
    });
  }, [dispatch]);
  useEffect(() => {
    if (getMyObjectAsStudent)
      if (
        (getMyObjectAsStudent.option.canTalk === "False" ||
          getMyObjectAsStudent.option.canTalk === "pending") &&
        Window.localStream
      )
        Window.localStream.getAudioTracks().forEach((track) => track.stop());
  }, [getMyObjectAsStudent]);
  useEffect(() => {
    if (!getLectureCall) {
      navigate("/");
    }
  }, [getLectureCall, navigate]);

  const handleShow = () => {
    setShow("inline-block");
  };
  const handleShow2 = () => {
    setShow("none");
  };

  return (
    <div className="call_container">
      <div className="viewers_and_chat">
        <div className="viewers">
          {getLectureState.member &&
            getLectureState.member.map((key, i) => (
              <div
                className={
                  key[key.key].option.canTalk === "pending"
                    ? "animationViewer"
                    : "viewer"
                }
                style={{
                  backgroundColor:
                    key[key.key].option.canTalk === "True" && "rgb(7, 199, 7)",
                }}
              >
                <div className="detilsViewer">
                  <p> {key[key.key].name}</p>
                  <div className="optionsViewer">
                    {getUser.key === key[key.key].key ? (
                      key[key.key].option.canTalk === "False" ? (
                        <RecordVoiceOverIcon
                          style={{ cursor: "pointer" }}
                          onClick={() => talkRequest()}
                        />
                      ) : (
                        <VoiceOverOffIcon
                          onClick={() => {
                            stopTalk(key.key);
                          }}
                        />
                      )
                    ) : null}
                    {getUser.key === getLectureState.adminKey ? (
                      key[key.key].option.canTalk === "pending" ? (
                        <RecordVoiceOverIcon
                          onClick={() =>
                            acceptTalk({
                              key: key.key,
                              name: key[key.key].name,
                            })
                          }
                        />
                      ) : key[key.key].option.canTalk === "True" ? (
                        <VoiceOverOffIcon
                          onClick={() => {
                            stopTalk(key.key);
                          }}
                        />
                      ) : null
                    ) : null}
                  </div>
                </div>
                <div className="imgViewer" />
              </div>
            ))}
        </div>
        <div>
          <div className="chat_border">chat</div>
          <div className="chat">
            <div style={{ overflow: "auto" }}>
              {getLectureState.chat &&
                getLectureState.chat.map((key, i) => (
                  <p>
                    {key.key === getUser.key ? "you" : key.name} : {key.message}
                  </p>
                ))}
            </div>
            <div>
              <TextField
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                sx={{ width: "100%", backgroundColor: "rgb(179, 179, 179)" }}
                InputProps={{
                  endAdornment: (
                    <SendIcon
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        message.length > 1 &&
                          sendMessage({
                            name: `${getUser.firstName} ${getUser.lastName}`,
                            message,
                          });
                        setMessage("");
                      }}
                    />
                  ),
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="call_and_option">
        <div style={{ width: "100%" }}>
          {isAdmin === true && (
            <VideoStyled
              className="video"
              ref={ref}
              muted
              controls={false}
              autoPlay
            />
          )}
          {isAdmin === false && (
            <VideoStyled className="video" src={imagesrc1} autoPlay />
          )}
        </div>
        <div className="options">
          <div onMouseLeave={handleShow2}>
            <InputSlider value={show1} newValue={handleShow} />
          </div>
          <div
            style={{
              display: "flex",
              width: 400,
              justifyContent: "space-evenly",
            }}
          >
            <ChatIcon
              sx={{
                fontSize: 40,
              }}
              className="option"
            />

            <AddBoxIcon
              sx={{
                fontSize: 40,
              }}
              className="option"
              onClick={() => {
                exitStream();
              }}
            />
            <MicOffIcon
              sx={{
                fontSize: 40,
                backgroundColor: mute ? "gray" : "initial",
              }}
              className="option micro_slash"
              onClick={() => {
                handleVoice();
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              width: 200,
              justifyContent: "space-evenly",
            }}
          >
            <CallEndIcon
              sx={{
                fontSize: 40,
              }}
              className="option phone_slash"
              onClick={() => {
                if (getUser.key !== getLectureState.adminKey) {
                  if (getMyObjectAsStudent.option.canTalk === "True")
                    exitStream();

                  leaveLecture(getUser.key, getLectureState.idGroup, "lecture");
                } else {
                  exitStream();
                  dispatch(
                    endCallGroupIfAdmin({
                      token: getToken,
                      idGroup: getLectureState.idGroup,
                      kind: getLectureState.kind,
                    })
                  );
                }
              }}
            />
          </div>
        </div>
      </div>
      {getAdapter &&
        Object.keys(getAdapter).map((key, i) => (
          <audio
            style={{ display: "none" }}
            src={getAdapter[key]}
            controls
            autoPlay
          ></audio>
        ))}
    </div>
  );
};

export default Call;
