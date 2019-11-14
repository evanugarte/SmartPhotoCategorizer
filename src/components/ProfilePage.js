import React, { Component } from "react";
import { connect } from "react-redux";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond/dist/filepond.min.css";
import { withStyles } from "@material-ui/core/styles";
import { Button, TextField } from "@material-ui/core";
import { profileFileAction } from "../actions/updateProfileAction";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import IconButton from "@material-ui/core/IconButton";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import FormControl from "@material-ui/core/FormControl";

registerPlugin(
  FilePondPluginFileValidateType,
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview
);

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
      email: "",
      password: "",
      file: null,
      isSubmit: false,
      showPassword: false,
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount(){
    this.setState({
      email: this.props.user.userInfo.email,
      password: this.props.user.userInfo.password,
      file: this.props.user.userInfo.avatar,
    });
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
    this.props.profileFileAction(profileData, this.props.history);
  }

  handleClickShowPassword = () => {
    this.setState({showPassword: !this.state.showPassword });
  };

  handleMouseDownPassword = event => {
    event.preventDefault();
  };

  render() {
    return (
      <div
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          width: "30%"
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
          <div>
            <FilePond
              labelIdle="Click to update your avatar"
              ref={ref => (this.pond = ref)}
              files={this.state.file}
              allowMultiple={true}
              maxFiles={1}
              onupdatefiles={fileItems => {
                this.setState({
                  file: fileItems.map(fileItem => fileItem.file)
                });
              }}
            />
          </div>
          

          <TextField
            key={this.state.email}
            id="outlined-email"
            onChange={this.onChange}
            name="email"
            label="email"
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
  { profileFileAction }
)(withStyles(styles, { withTheme: true })(ProfilePage));
