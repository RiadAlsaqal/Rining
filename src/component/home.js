import React from "react";
import Header from "./header";
import Contant from "./contant";
import Footer from "./footer";
import { selecteLectureCall, selectMeetingCall } from "../store/calls";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Confirm from "./confirm";
import Alert from "@mui/material/Alert";
import { selectError, clearError } from "../store/notification";
import { selectAuthLoading } from "../store/auth";
import ReactLoading from "react-loading";

const Home = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const getLectureCall = useSelector(selecteLectureCall);
  const getMeetingCall = useSelector(selectMeetingCall);
  const getError = useSelector(selectError);
  const getLoading = useSelector(selectAuthLoading);
  useEffect(() => {
    if (getLectureCall) navigate("/call");
    if (getMeetingCall) navigate("/meeting");
  }, [getLectureCall, getMeetingCall, navigate]);

  useEffect(() => {
    if (getError)
      setTimeout(() => {
        dispatch(clearError());
      }, 5000);
  }, [getError, dispatch]);
  return (
    <>
      <Header />
      <Confirm />
      <Contant />
      {getLoading && (
        <div
          className="loading_div"
          style={{
            display: "flex",
          }}
        >
          <ReactLoading
            type={"spokes"}
            color={"white"}
            height={200}
            width={100}
          />
        </div>
      )}
      <Footer />

      {getError && (
        <Alert
          style={{
            position: "absolute",
            width: "20vw",
            height: "8vh",
            bottom: "3vh",
            left: "1vw",
            fontSize: "1.7rem",
          }}
          severity="error"
        >
          something went wrong try again later
        </Alert>
      )}
    </>
  );
};

export default Home;
