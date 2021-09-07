import { getAuth, getRedirectResult, signInWithRedirect, GoogleAuthProvider } from 'firebase/auth';

const provider = new GoogleAuthProvider();
const AuthService = {
  async login() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    const auth = getAuth();
    try {
      signInWithRedirect(auth, provider);
    } catch (error) {}
  },

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },

  checkForRedirect() {
    return new Promise((resolve, reject) => {
      const auth = getAuth();
      getRedirectResult(auth)
        .then((result) => {
          if (!result) {
            this.login();
          }
          // This gives you a Google Access Token. You can use it to access Google APIs.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;

          // The signed-in user info.
          const user = result.user;
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('token', JSON.stringify(token));
          resolve(user);
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          console.error(errorCode, errorMessage, email, credential);
          reject(error);
          // ...
        });
    });
  },

  getUser() {
    const userData = localStorage.getItem('user');
    if (userData) return JSON.parse(userData);
    return null;
  },

  async checkAuth() {
    try {
      const user = this.getUser();
      return user;
    } catch (error) {
      return null;
    }
  },
};

export default AuthService;
