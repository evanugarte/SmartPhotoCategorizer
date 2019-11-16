import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { withStyles } from "@material-ui/core/styles";
import { getProfileFileAction } from "../actions/updateProfileAction";
import { getPicsSocialAction } from "../actions/getPicsSocialAction";

import { connect } from "react-redux";

const styles = theme => ({
  card: {
    maxWidth: 9000
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
  componentWillMount(){
    // const query = {userid: "asd123", email:"dummyemail@gmail.com"}; //TODO: need to get this userid, email from backend first
    const {userInfo} = this.props.user;
    this.props.getPicsSocialAction(userInfo);

    this.props.getProfileFileAction(userInfo);
  }


  render() {
    const {userInfo} = this.props.user;
    const {photoData} = this.props.photos;
    const classes = this.props.classes;

    const RenderSocialPost = () => {
      if (photoData != null){
        return(
          <Grid container spacing={3}  direction="column"
          justify="center"
          alignItems="center" >
            {photoData.map(photo => {
              return(
                <Grid item xs={6}>
                  <Card className={classes.card}>
                    <CardHeader
                      avatar={
                        <Avatar src={userInfo.avatar ? userInfo.avatar.data : null} aria-label="recipe" className={classes.avatar} />
                      }
                      action={
                        <IconButton aria-label="settings">
                          <MoreVertIcon />
                        </IconButton>
                      }
                      subheader="September 14, 2016"
                    />
                    <CardMedia
                      className={classes.media}
                      image={photo.photo.data}
                      title="Paella dish"
                    />
                    <CardContent>
                      <Typography variant="body2" color="textSecondary" component="p">
                        This impressive paella is a perfect party dish and a fun meal to
                        cook together with your guests. Add 1 cup of frozen peas along
                        with the mussels, if you like.
                      </Typography>
                    </CardContent>
                    <CardActions disableSpacing>
                      <IconButton aria-label="add to favorites">
                        <FavoriteIcon />
                      </IconButton>
                      <IconButton aria-label="share">
                        <ShareIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        );
      } else {
        return <div></div>;
      }
    };
    
    console.debug("social page photo data-", photoData);
    return (
      
        <RenderSocialPost/>
      
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  photos: state.photos
  //TODO: need to get this userid, email from backend first
});

export default connect(
  mapStateToProps,
  { getProfileFileAction, getPicsSocialAction }
)(withStyles(styles, { withTheme: true })(SocialPage));
