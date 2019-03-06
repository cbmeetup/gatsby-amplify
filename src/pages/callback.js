import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { navigate } from 'gatsby'

import { withAuth } from '../helpers/auth'

const PaddedDiv = styled.div`
  padding: 10px 15px;
`

class Callback extends React.Component {
  componentDidMount() {
    this.props.auth.handleAuthentication()
    navigate('/')
  }

  render() {
    return <PaddedDiv>Authenticating...</PaddedDiv>
  }
}

Callback.propTypes = {
  auth: PropTypes.object.isRequired,
}

export default withAuth(Callback)
