import React from 'react'
import PropTypes from 'prop-types'

import { Link, StaticQuery, graphql } from 'gatsby'

const Header = ({ siteTitle }) => (
  <StaticQuery
    query={graphql`
      query {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: ASC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
                date
              }
            }
          }
        }
      }
    `}
    render={data => (
      <header>
        <nav
          className="navbar is-primary"
          role="navigation"
          aria-label="main navigation"
        >
          <div className="navbar-brand">
            <Link to="/" className="navbar-item">
              {siteTitle}
            </Link>
          </div>

          <div id="navbar" className="navbar-menu">
            <div className="navbar-start">
              <Link to="/" className="navbar-item">
                Home
              </Link>

              <div className="navbar-item has-dropdown is-hoverable">
                <span className="navbar-link">Events</span>

                <div className="navbar-dropdown">
                  {data.allMarkdownRemark.edges.map(edge => (
                    <Link
                      to={edge.node.fields.slug}
                      key={edge.node.fields.slug}
                      className="navbar-item"
                    >
                      {edge.node.frontmatter.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="navbar-end">
              <div className="navbar-item">
                <div className="buttons">
                  <Link to="/" className="button is-light">
                    Log in
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    )}
  />
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
