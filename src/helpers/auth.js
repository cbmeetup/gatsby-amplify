import auth0 from 'auth0-js'
import jwtDecode from 'jwt-decode'
import { navigate } from 'gatsby'

class Auth {
  auth0 = new auth0.WebAuth({
    domain: 'leonrodenburg.eu.auth0.com',
    audience: 'https://master.d1x0szjzq3kz9p.amplifyapp.com/',
    clientID: 'HNB4povCl5Sxy3Ci9ZNiHhLlV5uCvKBx',
    redirectUri: process.env.GATSBY_AUTH0_CALLBACK_URL,
    responseType: 'token id_token',
    scope: 'openid profile',
  })

  constructor() {
    this.scheduleRenewal()
  }

  login() {
    localStorage.setItem('loginRedirect', window.location.pathname)
    this.auth0.authorize()
  }

  handleAuthentication() {
    const loginRedirect = localStorage.getItem('loginRedirect')
    localStorage.removeItem('loginRedirect')
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult)
        navigate(loginRedirect, { replace: true })
      } else if (err) {
        navigate(loginRedirect, { replace: true })
        console.log(err)
        alert(`Error: ${err.error}. Check the console for further details.`)
      }
    })
  }

  getAccessToken() {
    return localStorage.getItem('accessToken')
  }

  getIdToken() {
    return localStorage.getItem('idToken')
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
    localStorage.setItem('isLoggedIn', 'true')

    let expiresAt = authResult.expiresIn * 1000 + new Date().getTime()

    localStorage.setItem('expiresAt', expiresAt)
    localStorage.setItem('accessToken', authResult.accessToken)
    localStorage.setItem('idToken', authResult.idToken)
  }

  renewSession() {
    this.auth0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult)
      } else if (err) {
        this.logout()
        console.log(err)
        alert(
          `Could not get a new token (${err.error}: ${err.error_description}).`,
        )
      }
    })
  }

  logout() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('idToken')
    localStorage.removeItem('expiresAt')
    localStorage.removeItem('isLoggedIn')

    clearTimeout(this.tokenRenewalTimeout)

    window.location.reload()
  }

  isAuthenticated() {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    const expiresAt = localStorage.getItem('expiresAt')
    return isLoggedIn === 'true' && new Date().getTime() < expiresAt
  }

  scheduleRenewal() {
    const expiresAt = localStorage.getItem('expiresAt')
    const timeout = expiresAt - Date.now()
    if (timeout > 0) {
      this.tokenRenewalTimeout = setTimeout(() => {
        this.renewSession()
      }, timeout)
    }
  }
}

const auth = new Auth()
export default auth
