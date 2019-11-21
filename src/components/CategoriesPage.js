import React from "react";
import { Container, Spinner } from "reactstrap";
import SearchBar from "./SearchBar";
import CategoryCard from "./CategoryCard";
import img from "./black.png";
import "../App.css";
import { connect } from "react-redux";
import { getPhotoTags } from "../actions/tagActions";


class CategoriesPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      categories: [
        { name: "nature", count: 10 },
        { name: "restaurant", count: 7 },
        { name: "cars", count: 19 }
      ]
    };
  }

  componentDidMount() {
    this.getIt();
  }

  getIt = () => {
    this.props.getPhotoTags();
  }

  renderPersonEntries = () => {
    return (
      this.state.categories.map((category, index) => {
        return (
          <CategoryCard key={index} count={category.count}
            img={img} name={category.name} {...this.props} />
        );
      }));
  }

  render() {
    const { tags } = this.props.tags;
    return (
      <Container style={{ textAlign: "left" }} className="Employees">
        <SearchBar {...this.props} />
        {!tags ? <Spinner animation="border" /> : <React.Fragment />}
        {tags && tags.map((tag, index) => {
          return (
            <CategoryCard key={index} name={tag.tag}
              {...this.props} />
          );
        })}
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  tags: state.tags
  //TODO: need to get this userid from backend first
});

export default connect(
  mapStateToProps,
  { getPhotoTags }
)(CategoriesPage);
