import { Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"

type Props = {
    message : string | undefined;
    handleClose : () => void;
}

export const ErrorModal = ({handleClose, message} : Props) => {
    return <Dialog
    open={message !== undefined}
    onClose={handleClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="alert-dialog-title">
      Error
    </DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        {message}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} autoFocus>
        Close
      </Button>
    </DialogActions>
  </Dialog>
}