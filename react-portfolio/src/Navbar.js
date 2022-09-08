import './Navbar.css';
import React from 'react';

import config from './config.json';

const serverAddress = config.SERVER_ADDR;


class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hideSidebar: false,
      pages: this.getPages(),
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();

    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`${serverAddress}/api/get_portfolio/`, requestOptions)
      .then(async response => {
        const data = await response.json();
        this.setState({
          realname: data.realname,
          categories: data.categories,
        });
        if (this.state.categories != null) {
          let newPages = this.state.categories.map(category =>
            ({
              name: category.name,
              href: "/" + category.slug,
              googleIcon: category.googleIcon,
            })
	  );

          this.setState({
            'pages': this.getPages(newPages),
          });
          this.render();
        }
      })
      .catch(error => {
        this.setState({ errorMessage: error.toString() });
        console.error('Error', error);
      });
  }

  getPages(insertPages) {
    if (insertPages == null) {
      insertPages = [];
    }
    return [
      {
        name: "Overview",
        href: "/",
        googleIcon: "home",
      },
    ].concat(insertPages).concat([
      {
        name: "Test",
        href: "/test",
        googleIcon: "bug_report",
      },
      {
        name: "About",
        href: "/info",
        googleIcon: "info",
      },
      {
        name: "User Management",
        href: "/users",
        googleIcon: "person",
      },
    ]);
  }

  resize() {
    let currentHideNav = (window.innerWidth < 760);
    if (currentHideNav !== this.state.hideNav) {
      this.setState({hideNav: currentHideNav});
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize.bind(this));
  }

  render() {
    let icons = <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet"></link>;

    if (this.state.hideSidebar !== true) {
      return [icons, (
        <div className="Sidebar">
          {
            this.state.pages.map((button, index) => React.createElement(
              "a", { className: "Sidebar-tab", href: button.href },
              React.createElement(
                "span", { className: "material-icons-outlined" },
                button.googleIcon),
              button.name)
            )
           }
         </div>
       )
     ];
    } else {
      return null;
    }
  }
}
export default Navbar;