import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { useSelector, useDispatch } from "react-redux";
import {
  selectFriendConfirm,
  celarFriendConfirme,
  removeFriend,
} from "../store/friends";
import {
  celarGroupConfirme,
  selectGroupConfirm,
  removeGroub,
} from "../store/groubs";
import { selecteToken } from "../store/auth";
const Confirm = ({ open, message, friend, celar, ok }) => {
  const dispatch = useDispatch();
  const getFriendConfirm = useSelector(selectFriendConfirm);
  const getGroupsConfirm = useSelector(selectGroupConfirm);
  const getToken = useSelector(selecteToken);
  return (
    <>
      <Dialog
        maxWidth="sm"
        fullWidth={true}
        open={
          getFriendConfirm.open ? true : getGroupsConfirm.open ? true : false
        }
        onClose={() => {
          getFriendConfirm.open
            ? dispatch(celarFriendConfirme())
            : dispatch(celarGroupConfirme());
        }}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {getFriendConfirm.open
            ? `delete ${getFriendConfirm.friend.friend_name} ${getFriendConfirm.friend.friend_lname} ?`
            : `delete ${getGroupsConfirm.group.group_name} ?`}
        </DialogTitle>

        <DialogActions>
          <Button
            onClick={() => {
              getFriendConfirm.open
                ? dispatch(
                    removeFriend(
                      getFriendConfirm.friend.key,
                      "rejected",
                      getToken
                    )
                  )
                : dispatch(removeGroub(getGroupsConfirm.group.id, getToken));
            }}
            autoFocus
            color="error"
            variant="contained"
          >
            ok
          </Button>
          <Button
            sx={{ color: "gray" }}
            autoFocus
            onClick={() => {
              getFriendConfirm.open
                ? dispatch(celarFriendConfirme())
                : dispatch(celarGroupConfirme());
            }}
          >
            cancle
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Confirm;
