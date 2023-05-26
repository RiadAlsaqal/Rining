import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router } from "react-router-dom";
import { Store } from "./store/configureStore";
import { Provider } from "react-redux";
import { SnackbarProvider } from "notistack";
import { Button } from "@mui/material";
import { acceptFriend, rejectFriend } from "./store/friends";
import { selecteToken } from "./store/auth";
import { joinLecture } from "./component/socket";
ReactDOM.render(
  <React.StrictMode>
    <Provider store={Store}>
      <SnackbarProvider
        maxSnack={4}
        autoHideDuration="8000"
        content={(key, message, type) => (
          <div
            style={{
              width: "20vw",
              height: "13vh",
              backgroundColor: "rgba(204, 203, 203, 0.747)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid white",
              borderRadius: "1rem",
              fontSize: "1.5rem",
            }}
          >
            <p>{message.message}</p>

            <div
              style={{
                width: "100%",
                height: "5vh",
                display: "flex",
                justifyContent: "space-evenly",
              }}
            >
              {message.type === "call" ? (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    style={{ width: "2vw", height: "3vh" }}
                    onClick={() => {
                      joinLecture(message.sender_group.id);
                    }}
                  >
                    Join
                  </Button>
                </>
              ) : message.type === "RAdd" ? (
                <>
                  <Button
                    variant="contained"
                    style={{ width: "2vw", height: "3vh" }}
                    onClick={() =>
                      Store.dispatch(
                        acceptFriend(
                          message.sender_user.key,
                          selecteToken(Store.getState(), message.id),
                          message.id
                        )
                      )
                    }
                  >
                    Accipte
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    style={{ width: "2vw", height: "3vh" }}
                    onClick={() =>
                      Store.dispatch(
                        rejectFriend(
                          message.sender_user.key,
                          selecteToken(Store.getState()),
                          message.id
                        )
                      )
                    }
                  >
                    igonre
                  </Button>
                </>
              ) : null}
            </div>
          </div>
        )}
      >
        <Router>
          <App />
        </Router>
      </SnackbarProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
