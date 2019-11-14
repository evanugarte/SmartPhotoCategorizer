import React, { Component } from "react";
import { connect } from "react-redux";
import { FilePond } from "react-filepond";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond/dist/filepond.min.css";
import { withStyles } from "@material-ui/core/styles";
import { Button, TextField } from "@material-ui/core";
import { updateProfileFileAction, getProfileFileAction } from "../actions/updateProfileAction";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import IconButton from "@material-ui/core/IconButton";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import FormControl from "@material-ui/core/FormControl";
import CardMedia from "@material-ui/core/CardMedia";

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    minWidth: 120,
    maxWidth: 300
  }
});

class ProfilePage extends Component {
  constructor() {
    super();
    this.state = {
      email: null,
      password: null,
      file: null,
      isSubmit: false,
      showPassword: false,
      upload: false
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount(){
    if(this.props.user.userInfo.userid === null){
      this.props.history.push("/");
    }
  }
  componentDidMount(){
    if(this.props.user.userInfo.userid === null){
      this.props.history.push("/");
    }else{
      this.setState({
        email: this.props.user.userInfo.email,
        password: this.props.user.userInfo.password,
        file: this.props.user.userInfo.avatar,
      });
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    const { email, password, file } = this.state;
    const profileData = {
      password: password,
      file: file[0],
      email: this.props.user.userInfo.email,
      userid: "asd123" //TODO: need to get this userid from backend first
    };
    this.setState({ isSubmit: true });
    this.props.updateProfileFileAction(profileData, this.props.history);
  }

  handleClickShowPassword = () => {
    this.setState({showPassword: !this.state.showPassword });
  };

  handleMouseDownPassword = event => {
    event.preventDefault();
  };

  render() {
    const {userInfo} = this.props.user;
    return (
      <div
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          width: "15%"
        }}
      >
        <div
          style={{
            color: "white",
            textAlign: "center",
            paddingBottom: 4,
            paddingTop: 4,
            borderRadius: 4,
            marginTop: 15,
            marginBottom: 15,
            backgroundImage:
              "linear-gradient(to right, #0c4b78, #3d4e96, #2c76a9)"
          }}
        >
          <h2>Profile</h2>
        </div>

        <form
          style={{
            display: "flex",
            flexDirection: "column"
          }}
          onSubmit={this.onSubmit}
        > 
          {this.state.upload ? null :  <CardMedia
            style={{ width: 240, height: 290 }}
            image={this.state.file ? this.state.file.data : require("./user.png")}
          />}
          <div>
            <FilePond
              labelIdle="Click to update your avatar"
              ref={ref => (this.pond = ref)}
              maxFiles={1}
              onremovefile={() => {
                this.setState({
                  file: userInfo.avatar,
                  upload: false
                });
              }
              }
              onupdatefiles={(fileItems) => {
                this.setState({
                  file: fileItems.map(fileItem => fileItem.file),
                  upload: true
                });
              }}
            />
          </div>
          

          <TextField
            name="email"
            label="email"
            onChange={this.onChange}
            value={this.state.email}
            margin="normal"
            variant="outlined"
            style={{marginBottom: 10}}
          />

          <FormControl variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              name="password"
              label="password"
              type={this.state.showPassword ? "text" : "password"}
              value={this.state.password}
              onChange={this.onChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={this.handleClickShowPassword}
                    onMouseDown={this.handleMouseDownPassword}
                  >
                    {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              labelWidth={70}
            />
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            color="default"
            style={{ marginTop: 10, marginBottom: 15 }}
          >
            Save Changes
          </Button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
  //TODO: need to get this userid from backend first
});

export default connect(
  mapStateToProps,
  { updateProfileFileAction, getProfileFileAction }
)(withStyles(styles, { withTheme: true })(ProfilePage));
