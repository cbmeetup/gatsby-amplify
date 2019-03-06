import React from 'react'
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

export default withAuth(Callback)
