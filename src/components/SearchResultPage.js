import React from "react";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import { Container } from "reactstrap";
import "../App.css";
import { connect } from "react-redux";
import { getPhotoByTag } from "../actions/tagActions";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 500,
    height: 450,
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)",
  },
}));

class SearchResultPage extends React.Component {
  state = {
    pathName: ""
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
    const { photosByTag } = this.props.tags;
    const classes = this.props.classes;
    return (
      <React.Fragment>
        <h1>Photos for {this.state.pathName}</h1>
        <Container style={{
          display: "flex",
          alignContent: "center",
          marginTop: "50px",
          marginBottom: "10px"
        }}>
          <GridList cellHeight={180} className={classes.gridList}>
            {photosByTag && photosByTag.map((tile, index) => (
              <GridListTile key={index}>
                <img src={tile.photo.data} alt={tile.title} />
                <GridListTileBar
                  title={tile.title}
                  subtitle={<span>Uploaded on: {tile.uploadDate}</span>}
                />
              </GridListTile>
            ))}
          </GridList>
        </Container>
      </React.Fragment>
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
)(withStyles(styles)(SearchResultPage));





