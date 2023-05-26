import React, { useEffect, useState } from "react";
import joi from "joi-browser";
import ReactLoading from "react-loading";
import TextField from "@material-ui/core/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import DatePicker from "@mui/lab/DatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import Stack from "@mui/material/Stack";
import { makeStyles } from "@material-ui/core/styles";
import styled from "styled-components";
import styl from "@emotion/styled";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useDispatch, useSelector } from "react-redux";
import { receiveAuth2, selectLogIn } from "../store/auth";
import { useNavigate } from "react-router-dom";
import { selectError } from "../store/auth";
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
    width: "20vw",
  },
});

const DataPickerDiv = styled.div`
  width: 20vw;
`;
const SubmitButton = styl(Button)({
  backgroundColor: "rgb(21, 63, 117)",
  color: "white",
  fontWeight: "bold",

  "&:hover": {
    color: "rgb(21, 63, 117)",
    backgroundColor: "rgb(207, 210, 216)",
  },
});

const Form = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useNavigate();
  const getLogIn = useSelector(selectLogIn);
  const getError = useSelector(selectError);
  const [label, setLabel] = useState({
    label1: "textfield__label",
    label2: "textfield__label",
    label3: "textfield__label",
    label4: "textfield__label",
    label5: "textfield__label",
    show1: false,
    show2: false,
    show3: false,
  });
  const [account, setAccount] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    date: "",
  });
  const [errors, setErrors] = useState({});

  const schema = {
    firstName: joi.string().min(3).max(20).required().label("FirstName"),
    lastName: joi.string().min(2).max(20).required().label("LastName"),
    email: joi.string().required().label("Email"),
    password: joi.string().min(8).required().label("password"),
    confirmPassword: joi.ref("password"),
    gender: joi.string().required().label("Gender"),
    date: joi
      .date()
      .min("01/01/1950")
      .max("12-31-2005")
      .required()
      .label("Birthday"),
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const result = joi.validate(account, schema, { abortEarly: false });
    const { error } = result;
    if (!error) {
      try {
        dispatch(receiveAuth2(account));
        return null;
      } catch (error) {
        console.log(error);
      }
    } else {
      const errorData = {};
      error.details.forEach((item) => {
        errorData[item.path[0]] = item.message;
      });
      if (!account.confirmPassword)
        errorData["confirmPassword"] =
          "Confirm Password is not allowed to be empty";
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
  const validateConfirmePassword = (e) => {
    const { name, value } = e.target;
    let errorData = { ...errors };
    value === account.password
      ? delete errorData[name]
      : (errorData[name] = "Confirm Password shoud be equal to Password");
    const accoun = { ...account };
    accoun[name] = value;
    setAccount(accoun);
    setErrors(errorData);
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
  const validateP = (e) => {
    const obj = { date: e };
    const subSchema = { date: schema["date"] };
    const result = joi.validate(obj, subSchema);
    const { error } = result;
    return error ? error.details[0].message : null;
  };

  const handleDateChange = (e) => {
    const accoun = { ...account };
    let errorData = { ...errors };
    const errorMessage = validateP(e);
    errorMessage
      ? (errorData["date"] = errorMessage)
      : delete errorData["date"];
    accoun["date"] = e;
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
  useEffect(() => {
    if (getLogIn) history("/");
  }, [getLogIn, history]);
  return (
    <>
      <div
        className="loading_div"
        style={{
          display: label.show3 ? "flex" : "none",
        }}
      >
        <ReactLoading
          type={"spokes"}
          color={"rgb(21, 63, 117)"}
          height={200}
          width={100}
        />
      </div>
      <form className="form" action="" method="get" onSubmit={handleSubmit}>
        {getError === "406" && (
          <p style={{ fontSize: "2rem" }} className="error_message">
            this account already used
          </p>
        )}
        <div className="name">
          <div>
            <TextField
              id="outlined-basic"
              label="First Name"
              variant="outlined"
              name="firstName"
              value={account.firstName}
              className={classes.root1}
              error={errors.firstName && true}
              onChange={handleChange}
              InputLabelProps={{
                className: label.label1,
              }}
            />
            {errors.firstName && (
              <p className="error_message"> {errors.firstName} </p>
            )}
          </div>
          <div>
            <TextField
              id="outlined-basic"
              label="Last Name"
              variant="outlined"
              error={errors.lastName && true}
              name="lastName"
              value={account.lastName}
              className={classes.root1}
              FormHelperTextProps={{
                style: { backgroundColor: " rgb(242, 244, 248)" },
              }}
              onChange={handleChange}
              InputLabelProps={{
                className: label.label2,
              }}
            />
            {errors.lastName && (
              <p className="error_message"> {errors.lastName} </p>
            )}
          </div>
        </div>
        <br />

        <TextField
          id="outlined-basic"
          label="Email"
          variant="outlined"
          name="email"
          value={account.email}
          error={errors.email && true}
          type="email"
          className={classes.root2}
          onChange={handleChange}
          InputLabelProps={{
            className: label.label3,
          }}
        />
        <br />

        {errors.email && <p className="error_message"> {errors.email} </p>}

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
        <br />

        {errors.password && (
          <p className="error_message"> {errors.password} </p>
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
            type={label.show2 ? "text" : "password"}
            name="confirmPassword"
            value={account.confirmPassword}
            error={errors.confirmPassword ? true : false}
            onChange={validateConfirmePassword}
            className={classes.root2}
            InputLabelProps={{
              className: label.label2,
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => {
                    handleClickShowPassword(2);
                  }}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {label.show2 ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="confirmPassword"
          />
        </FormControl>
        <br />
        {errors.confirmPassword && (
          <p className="error_message">{errors.confirmPassword}</p>
        )}
        <div style={{ width: "19vw" }}>
          <FormControl
            sx={{
              marginTop: "20px",
            }}
            component="fieldset"
          >
            <FormLabel className="gender" component="legend">
              Gender:
            </FormLabel>
            <RadioGroup
              aria-label="gender"
              name="gender"
              sx={{
                width: "5vw",
              }}
              value={account.gender}
              onChange={handleChange}
            >
              <FormControlLabel
                control={<Radio />}
                value="male"
                label="Male"
                name="gender"
                sx={{ color: "#3b5998" }}
              />
              <FormControlLabel
                value="female"
                control={<Radio />}
                label="Female"
                name="gender"
                sx={{
                  color: "#3b5998",
                }}
              />
            </RadioGroup>
          </FormControl>

          {errors.gender && <p className="error_message"> {errors.gender} </p>}
        </div>
        <DataPickerDiv>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={3}>
              <DatePicker
                label="Birthday"
                name="date"
                variant="outlined"
                value={account.date}
                inputVariant="outlined"
                inputFormat="dd/mm/yyyy"
                onChange={handleDateChange}
                minDate={new Date("01-01-1950")}
                maxDate={new Date("12-31-2005")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    style={{ width: 300 }}
                    variant="outlined"
                    className={classes.root1}
                    error={errors.date && true}
                    InputLabelProps={{
                      className: label.label3,
                    }}
                  />
                )}
              />
            </Stack>
          </LocalizationProvider>
          {errors.date && (
            <p className="error_message">
              birthday must be in format dd/mm/yyyy and
              <br /> between 1950,2005
            </p>
          )}
        </DataPickerDiv>

        <SubmitButton type="submit" variant="outlined">
          submit
        </SubmitButton>
      </form>
    </>
  );
};

export default Form;
