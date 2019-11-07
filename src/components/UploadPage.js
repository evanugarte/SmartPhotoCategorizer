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

import { uploadFileAction } from "../actions/uploadFileAction";

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

class UploadPage extends Component {
  constructor() {
    super();
    this.state = {
      description: "",
      file: null,
      isSubmit: false
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.handleInit = this.handleInit.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    const uploadData = {
      desc: this.state.description,
      file: this.state.file[0],
      email: this.props.user.userInfo.email
    };
    this.setState({ isSubmit: true });
    this.props.uploadFileAction(uploadData, this.props.history);
  }

  handleInit() {
    console.debug("FilePond instance has initialised", this.pond);
  }

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
            backgroundImage:
              "linear-gradient(to right, #0c4b78, #3d4e96, #2c76a9)"
          }}
        >
          <h2>Upload Files</h2>
        </div>

        <form
          style={{
            display: "flex",
            flexDirection: "column"
          }}
          onSubmit={this.onSubmit}
        >
          <TextField
            id="outlined-description"
            value={this.state.description}
            onChange={this.onChange}
            name="description"
            label="description"
            margin="normal"
            variant="outlined"
            multiline
          />

          <FilePond
            ref={ref => (this.pond = ref)}
            files={this.state.file}
            allowMultiple={true}
            maxFiles={1}
            oninit={() => this.handleInit()}
            onupdatefiles={fileItems => {
              this.setState({
                file: fileItems.map(fileItem => fileItem.file)
              });
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="default"
            style={{ marginTop: 10, marginBottom: 15 }}
          >
            Upload
          </Button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  upload: state.upload,
  user: state.user
});

export default connect(
  mapStateToProps,
  { uploadFileAction }
)(withStyles(styles, { withTheme: true })(UploadPage));
