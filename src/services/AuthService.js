import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const provider = new GoogleAuthProvider();
const AuthService = {
  async login() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    const auth = getAuth();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.error(errorCode, errorMessage, email, credential);
    }
  },

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
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
