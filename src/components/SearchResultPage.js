import React from "react";
import { getPhotoByTag } from "../actions/tagActions";
import Photo from "./Photo";
import image from "./black.png";
import { connect } from "react-redux";

class SearchResultPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [
        { name: "IMG_2013", uploadDate: "12/20/19", image: image },
        { name: "IMG_4021", uploadDate: "12/20/19", image: image },
        { name: "IMG_1227", uploadDate: "12/20/19", image: image }
      ],
      pathName: ""
    };
  }

  componentDidMount() {
    this.getPathName();
  }

  getPathName = () => {
    const { pathname } = this.props.location;
    const currentPath = pathname.substring(pathname.lastIndexOf("/") + 1);
    this.props.getPhotoByTag(currentPath);
    this.setState({
      pathName: currentPath
    });
  }

  render() {
    const { tags } = this.props;
    return (
      <div>
        <h1>Photos for {this.state.pathName}</h1>
        {tags.photosByTag &&
          tags.photosByTag.map((image, index) => {
            return (
              <Photo key={index} title={image.title}
                uploadDate={image.uploadDate}
                image={image.photo.data} />
            );
          })}
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  tags: state.tags
  //TODO: need to get this userid from backend first
});

export default connect(
  mapStateToProps,
  { getPhotoByTag }
)(SearchResultPage);
