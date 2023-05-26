import React, { useRef, useState } from "react";
import AddBoxIcon from "@mui/icons-material/AddBox";
import MicOffIcon from "@mui/icons-material/MicOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import { socket } from "./socket";
import {
  selecteAdapter,
  selectMeetingState,
  selectMeetingCall,
  igonreMeetingCall,
} from "../store/calls";
import { selecteToken, selecteUser } from "../store/auth";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Store } from "../store/configureStore";

const Meeting = () => {
  const [mute, setMute] = useState(false);
  const ref = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getAdapter = useSelector(selecteAdapter);
  const getMeetingState = useSelector(selectMeetingState);
  const getMeetingCall = useSelector(selectMeetingCall);
  const getToken = useSelector(selecteToken);
  const getUser = useSelector(selecteUser);

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
            socket.emit("streamMeeting", base64String, getMeetingState.groupId);
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
  }
  useEffect(() => {
    if (getUser) MainFunction(3000);
  }, [getUser]);

  useEffect(() => {
    if (!getMeetingCall) {
      if (Window.localStream) exitStream();
      navigate("/");
    }
  }, [getMeetingCall, navigate]);
  return (
    <div className="meeting_countainer">
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {console.log(typeof selectMeetingState(Store.getState()).memberCount)}
        {Object.keys(getAdapter).map((key, i) => (
          <>
            <video
              style={{
                height: getMeetingState.memberCount < 6 ? "100vh" : "50vh",
                objectFit: "cover",
                width:
                  getMeetingState.memberCount < 6
                    ? `calc(100%/${getMeetingState.memberCount})`
                    : "calc(100%/5)",
              }}
              autoPlay
              src={getAdapter[key].media}
            />
          </>
        ))}
        <video
          style={{
            height: getMeetingState.memberCount < 6 ? "100vh" : "50vh",
            objectFit: "cover",
            width:
              getMeetingState.memberCount < 6
                ? `calc(100%/${getMeetingState.memberCount})`
                : "calc(100%/5)",
          }}
          ref={ref}
          autoPlay
          muted
        />
      </div>
      <div className="options">
        <div
          style={{
            display: "flex",
            width: 400,
            justifyContent: "space-evenly",
          }}
        >
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
              dispatch(
                igonreMeetingCall({
                  token: getToken,
                  idGroup: getMeetingState.groupId,
                  kind: getMeetingState.kind,
                })
              );
              exitStream();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Meeting;
