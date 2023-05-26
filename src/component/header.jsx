import React, { useState } from "react";
import Popup from "reactjs-popup";
import Joi from "joi-browser";
import { Link } from "react-router-dom";
import ReactLoading from "react-loading";
import FormControl from "@mui/material/FormControl";
import { makeStyles } from "@material-ui/core/styles";
import styl from "@emotion/styled";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { receiveAuth, selectAuthLoading, logOutUser } from "../store/auth";
import { useDispatch, useSelector } from "react-redux";
import logoImage from "./contant_component/content images/logo rining.png";
const useStyles = makeStyles({
  root1: {
    color: "white",
    backgroundColor: "white",
    marginTop: "3vh",
    width: "9.9vw",
    margin: "2px",
  },
  root2: {
    color: "white",
    backgroundColor: "white",
    width: "14vw",
  },
});

const SubmitButton = styl(Button)({
  color: "white",
  backgroundColor: "rgba(255, 255, 255, 0.144)",
  width: "8vw",
  height: "4vh",
  fontFamily: "Arial, Helvetica, sans-serif",
  border: "2px solid white",
  fontSize: "1.2rem",
  cursor: "pointer",

  "&:hover": {
    color: "rgb(21, 63, 117)",
    backgroundColor: "rgb(207, 210, 216)",
  },
});
const Header = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setopen] = useState(false);
  const closeModel = () => setopen(false);
  const [account, setAccount] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const schema = {
    email: Joi.string().required().label("Email"),
    password: Joi.string().min(8).required().label("Password"),
  };
  const getLoadingAuth = useSelector(selectAuthLoading);
  const [label, setLabel] = useState({
    label1: "textfield__label",
    label2: "textfield__label",
    label3: "textfield__label",
    label4: "textfield__label",
    label5: "textfield__label",
    label6: "textfield__label1_onclick",
    click1: false,
    show1: false,
    show2: false,
    show3: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = Joi.validate(account, schema, { abortEarly: false });
    const { error } = result;
    if (!error) {
      // setLabel({ ...label, show3: true });
      try {
        dispatch(receiveAuth(account));
        setAccount({
          email: "",
          password: "",
        });
        setopen(false);
        //if (server.data) setLabel({ ...label, show3: false });

        return null;
      } catch (error) {
        console.log(error);
      }
    } else {
      const errorData = {};
      error.details.foreach((item) => {
        errorData[item.path[0]] = item.message;
      });
      setErrors(errorData);
    }
  };
  const validateProperty = (event) => {
    const { name, value } = event.target;
    const obj = { [name]: value };
    const subSchema = { [name]: schema[name] };
    const result = Joi.validate(obj, subSchema);
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
  const handleClickShowPassword = (e) => {
    e === 1
      ? setLabel({
          ...label,
          show1: !label.show1,
        })
      : setLabel({
          ...label,
          show2: !label.show2,
        });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div className="header">
      <div className="logo_div">
        <Link
          style={{
            width: "5.5vw",
            height: "4.5vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          to="/"
        >
          <img
            src={logoImage}
            style={{ width: "20vw", height: "13vh" }}
            alt=""
          />
        </Link>
      </div>
      <div className="header_links">
        <p>Services</p>
        <p>about</p>
        <p>contact us </p>
        {!localStorage.getItem("token") && (
          <button href="" onClick={() => setopen((o) => !o)}>
            Login
          </button>
        )}
        {localStorage.getItem("token") && (
          <button href="" onClick={() => dispatch(logOutUser())}>
            Logout
          </button>
        )}
      </div>

      {!localStorage.getItem("token") && (
        <Popup open={open} closeOnDocumentClick onClose={closeModel}>
          <div
            className="loading_div"
            style={{
              display: getLoadingAuth ? "flex" : "none",
            }}
          >
            <ReactLoading
              type={"spokes"}
              color={"white"}
              height={200}
              width={100}
            />
          </div>
          <div className="login_container">
            <div className="popup">
              <p className="close" onClick={closeModel}>
                &times;
              </p>
              <div className="login_inputs">
                <FormControl focused={label.click1 && true} variant="outlined">
                  <InputLabel
                    sx={{ color: "#3b5998 ", fontWeight: "bold" }}
                    htmlFor="email"
                  >
                    Email
                  </InputLabel>
                  <OutlinedInput
                    id="email"
                    type="email"
                    name="email"
                    error={errors.email ? true : false}
                    value={account.email}
                    onChange={handleChange}
                    className={classes.root2}
                    onClick={() => {
                      setLabel({ ...label, click1: true });
                    }}
                    onBlur={() => setLabel({ ...label, click1: false })}
                    InputLabelProps={{
                      className: label.label3,
                    }}
                    label="Email"
                  />
                </FormControl>
                <br />

                {errors.email && (
                  <p className="error_message1"> {errors.email} </p>
                )}

                <FormControl variant="outlined">
                  <InputLabel
                    sx={{ color: "#3b5998 ", fontWeight: "bold" }}
                    htmlFor="outlined-adornment-password"
                  >
                    Password
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={label.show1 ? "text" : "password"}
                    name="password"
                    error={errors.password ? true : false}
                    value={account.password}
                    onChange={handleChange}
                    className={classes.root2}
                    InputLabelProps={{
                      className: label.label2,
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => {
                            handleClickShowPassword(1);
                          }}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {label.show1 ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                  />
                </FormControl>
                {errors.password && (
                  <p className="error_message1"> {errors.password} </p>
                )}
              </div>
              <p className="forgot_password" href="">
                Forgot Password?
              </p>
              <SubmitButton onClick={handleSubmit}>LOGIN</SubmitButton>

              <p className="dont_have_account">
                don't have account? <Link to="/SignIn">Sign in</Link>
              </p>
            </div>
          </div>
        </Popup>
      )}
    </div>
  );
};

export default Header;
