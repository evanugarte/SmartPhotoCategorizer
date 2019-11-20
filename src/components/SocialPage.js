import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import DeleteIcon from "@material-ui/icons/Delete";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { withStyles } from "@material-ui/core/styles";
import { getProfileFileAction } from "../actions/updateProfileAction";
import { getPicsSocialAction } from "../actions/getPicsSocialAction";
import { deletePhotoAction } from "../actions/deletePhotoAction";
import { sharePhotosAction } from "../actions/sharePhotosAction";
import { connect } from "react-redux";

const styles = (theme) => ({
  card: {
    width: 550,
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  avatar: {
    backgroundColor: red[500]
  },
  root: {
    flexGrow: 1,
    backgroundColor: "white"
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
});

class SocialPage extends Component {
  constructor(){
    super();
    this.state = {
      open: false,
      email: ""
    };
  }

  handleClickOpen = () => {
    this.setState({open: true});
  }

  handleClose = () => {
    this.setState({open: false});
  }

  componentWillMount() {
    this.props.getPicsSocialAction();
    this.props.getProfileFileAction();
  }
  handleShare = (photo) => {
    const { userInfo } = this.props.user;
    const sharePhoto = {
      file: photo.file,
      userid: userInfo.userid,
      sharedEmail: this.state.email,
      sharedByEmail: userInfo.email
    };
    this.props.sharePhotosAction(sharePhoto);
    this.setState({open: false});
    alert("Your photo is shared");
  }

  onChange = (e) => {
    this.setState({ email: e.target.value });
  }

  render() {
    const { userInfo } = this.props.user;
    const { photoData } = this.props.photos;
    const classes = this.props.classes;

    if (photoData.length > 0) {
      return (
        <Grid container spacing={3} direction="column"
          justify="center"
          alignItems="center" >
          {photoData.map(photo => {
            return (
              <Grid item xs={6} key={photo.title+photo.uploadDate}>
                <Card className={classes.card} 
                  key={photo.title+photo.uploadDate}>
                  <CardHeader
                    avatar={
                      <Avatar
                        src={userInfo.avatar ? userInfo.avatar.data : null}
                        aria-label="recipe" className={classes.avatar} />
                    }
                    action={
                      <IconButton aria-label="settings">
                        <MoreVertIcon />
                      </IconButton>
                    }
                    subheader={photo.uploadDate}
                  />
                  <CardMedia
                    className={classes.media}
                    image={photo.photo.data}
                    title="Paella dish"
                  />
                  <CardContent>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p">
                      {photo.desc}
                    </Typography>
                  </CardContent>
                  <CardActions disableSpacing>
                    <IconButton aria-label="add to favorites">
                      <FavoriteIcon /> {photo.likes}
                    </IconButton>
                    <IconButton aria-label="share" 
                      onClick={this.handleClickOpen}>
                      <ShareIcon />
                    </IconButton>
                    <Dialog open={this.state.open} 
                      onClose={this.handleClose} 
                      aria-labelledby="form-dialog-title">
                      <DialogTitle id="form-dialog-title">
                      Share This Photo</DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          Type the email you want to share this photo with
                        </DialogContentText>
                        <TextField
                          autoFocus
                          margin="dense"
                          fullWidth
                          onChange={this.onChange}
                          value={this.state.email}
                          name="email"
                          id="email"
                          label="email"
                          type="email"
                        />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={() => this.handleShare(photo)} color="primary">
                          Share
                        </Button>
                      </DialogActions>
                    </Dialog>
                    <IconButton 
                      onClick={() => 
                        this.props.deletePhotoAction({
                          file: photo.file, userid: userInfo.userid})}
                      aria-label="delete">
                      <DeleteIcon/>
                    </IconButton>
                    {photo.sharedBy ? 
                      photo.sharedBy + " shared this to you" : null}
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      );
    } else {
      return <div style={{marginTop: 100}}>
        You dont have any photos. 
        Please click upload photo above to upload your photos</div>;
    }
  }
}

const mapStateToProps = state => ({
  user: state.user,
  photos: state.photos
});

export default connect(
  mapStateToProps,
  { getProfileFileAction, getPicsSocialAction,
    deletePhotoAction, sharePhotosAction }
)(withStyles(styles, { withTheme: true })(SocialPage));
