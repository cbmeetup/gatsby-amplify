import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import classNames from 'classnames'

import { Link, graphql, useStaticQuery } from 'gatsby'
import auth from '../helpers/auth'

const ProfileWrapper = styled.div`
  display: inline-flex;
`

const ProfileItem = styled.span`
  margin: 0 0 0 10px;
`

const Profile = ({ profile }) => (
  <ProfileWrapper>
    <ProfileItem className="image is-24x24">
      <img className="is-rounded" src={profile.picture} alt="Profile" />
    </ProfileItem>
    <ProfileItem>{profile.name}</ProfileItem>
  </ProfileWrapper>
)

const Header = ({ siteTitle }) => {
  const [isMenuShown, setMenuShown] = useState(false)
  const data = useStaticQuery(graphql`
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
  `)
  return (
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

          <span
            className={classNames('navbar-burger', {
              'is-active': isMenuShown,
            })}
            aria-label="menu"
            aria-expanded="false"
            onClick={() => setMenuShown(!isMenuShown)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </span>
        </div>

        <div
          id="navbar"
          className={classNames('navbar-menu', {
            'is-active': isMenuShown,
          })}
        >
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
              {auth.isAuthenticated() && (
                <Profile profile={auth.getProfile()} />
              )}
            </div>
            <div className="navbar-item">
              <div className="buttons">
                {auth.isAuthenticated() ? (
                  <button
                    className="button is-danger"
                    onClick={() => auth.logout()}
                  >
                    Log out
                  </button>
                ) : (
                  <button
                    className="button is-info"
                    onClick={() => auth.login()}
                  >
                    Log in
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
