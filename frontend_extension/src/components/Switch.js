import React from "react";
// import PropTypes from "external_propTypes";
// import { observable, computed, action } from "mobx";
// import { Provider, observer, inject } from "mobx-react";
// import State from "../constants/State";

/**
 * The public API for rendering the first <Route> that matches.
 */
class Switch extends React.Component {
  renderWithCloneElement() {
    let matchChild;
    React.Children.forEach(children, element => {
      if (matchChild == null && React.isValidElement(element)) {
        const {
          caseState
          //   exact,
          //   strict,
          //   sensitive,
          //   from
        } = element.props;
        // const path = pathProp || from;

        // child = element;
        matchChild = caseState === location ? element : null;

        // match = path
        //   ? matchPath(location.pathname, { path, exact, strict, sensitive })
        //   : route.match;
      }
    });

    return matchChild ? React.cloneElement(matchChild, { location }) : null;
  }

  render() {
    const { children, state } = this.props;

    // Render components with hiding
    return React.Children.map(children, element => {
      return React.cloneElement(element, {
        state,
        hidden:
          element.props.caseState === "any" || element.props.caseState === state
            ? false
            : true
      });
    });

    // Render components with cloning
    // this.renderWithCloneElement();
  }
}

export default Switch;
