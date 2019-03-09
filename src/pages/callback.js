import React, { useEffect } from 'react'
import styled from '@emotion/styled'

import { WithAuthentication } from '../helpers/auth'

const PaddedDiv = styled.div`
  padding: 10px 15px;
`

export default () => (
  <WithAuthentication>
    {({ auth }) => {
      useEffect(() => {
        auth.handleAuthentication()
      })

      return <PaddedDiv>Authenticating...</PaddedDiv>
    }}
  </WithAuthentication>
)
