import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { removeSnackbar } from "../store/notification";
let displayed = [];
const useNorifier = () => {
  const dispatch = useDispatch();
  const getNotification = useSelector(
    (store) => store.entities.notification.list2 || []
  );
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const storeDisplayed = (id) => {
    displayed = [...displayed, id];
  };
  const removeDisplayed = (id) => {
    displayed = [...displayed.filter((key) => id !== key)];
  };
  useEffect(() => {
    getNotification.forEach(
      ({ id, [id]: obj, message, options = {}, dismissed = false }) => {
        if (dismissed) {
          closeSnackbar(id);
          return;
        }
        if (displayed.includes(id)) return;

        enqueueSnackbar(obj, {
          id,
          ...options,
          autoHideDuration: 8000,
          onClose: (event, reason, mykey) => {
            if (options.onClose) {
              options.onClose(event, reason, id);
            }
          },
          onExited: (event, mykey) => {
            dispatch(removeSnackbar(id));
            removeDisplayed(id);
          },
        });
        storeDisplayed(id);
      }
    );
  }, [getNotification, closeSnackbar, enqueueSnackbar, dispatch]);
};

export default useNorifier;
