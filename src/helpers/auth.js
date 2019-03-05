import auth0 from 'auth0-js'
import jwtDecode from 'jwt-decode'
import { navigate } from 'gatsby'
import storage from 'local-storage-fallback'

class Auth {
  auth0 = new auth0.WebAuth({
    domain: 'leonrodenburg.eu.auth0.com',
    audience: process.env.GATSBY_AUTH0_AUDIENCE,
    clientID: 'HNB4povCl5Sxy3Ci9ZNiHhLlV5uCvKBx',
    redirectUri: process.env.GATSBY_AUTH0_CALLBACK_URL,
    responseType: 'token id_token',
    scope: 'openid profile',
  })

  constructor() {
    this.renewTokenIfNecessary()
  }

  login() {
    storage.setItem('loginRedirect', window.location.pathname)
    this.auth0.authorize()
  }

  handleAuthentication() {
    const loginRedirect = storage.getItem('loginRedirect')
    storage.removeItem('loginRedirect')

    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.idToken) {
        this.setSession(authResult)
        navigate(loginRedirect ? loginRedirect : '/', { replace: true })
      } else if (err) {
        console.log(err)
        navigate(loginRedirect ? loginRedirect : '/', { replace: true })
      }
    })
  }

  getIdToken() {
    return storage.getItem('idToken')
  }

  getProfile() {
    const idToken = jwtDecode(this.getIdToken())
    return {
      id: idToken.sub,
      name: idToken.name,
      firstName: idToken.given_name,
      lastName: idToken.family_name,
      picture: idToken.picture,
    }
  }

  setSession(authResult) {
    storage.setItem('isLoggedIn', 'true')

    let expiresAt = authResult.expiresIn * 1000 + new Date().getTime()

    storage.setItem('expiresAt', expiresAt)
    storage.setItem('idToken', authResult.idToken)
  }

  renewSession() {
    this.auth0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.idToken) {
        this.setSession(authResult)
      } else if (err) {
        console.log(err)
        this.logout()
      }
    })
  }

  logout() {
    storage.removeItem('idToken')
    storage.removeItem('expiresAt')
    storage.removeItem('isLoggedIn')

    clearTimeout(this.tokenRenewalTimeout)

    window.location.reload()
  }

  isAuthenticated() {
    const isLoggedIn = storage.getItem('isLoggedIn')
    const expiresAt = storage.getItem('expiresAt')
    return isLoggedIn === 'true' && Date.now() < expiresAt
  }

  renewTokenIfNecessary() {
    const expiresAt = storage.getItem('expiresAt')
    if (!expiresAt) return

    const timeout = expiresAt - Date.now()
    this.tokenRenewalTimeout = setTimeout(
      () => {
        this.renewSession()
      },
      timeout > 0 ? timeout : 0,
    )
  }
}

export default new Auth()
