import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../../Utils/Firebase';

const Login = () => {
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('Registered user:', userCredential.user);
        // Optional: Save username to Firestore or user profile
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('Signed in user:', userCredential.user);
      }
    } catch (error) {
      console.error('Email Auth Error:', error.message);
    }
  };

  const Signinwithgoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        console.log('User signed in with Google:', user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData?.email;
        console.error('Error signing in with Google:', errorCode, errorMessage, email);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1d1d1f] text-white">
      <div className="w-full max-w-md bg-[#2b2b2f] rounded-2xl shadow-md p-8">
        <h1 className="flex items-center flex-col gap-5 justify-center mb-6">
          <img src="/images/logo.png" alt="LeetCode Logo" />
          LeetCode
        </h1>
        <form className="space-y-4" onSubmit={handleEmailAuth}>
          <div>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-[#444] bg-[#1d1d1f] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1890ff]"
              placeholder="Enter your email"
            />
          </div>
          {isRegistering && (
            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-[#444] bg-[#1d1d1f] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1890ff]"
                placeholder="Enter your username"
              />
            </div>
          )}
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-[#444] bg-[#1d1d1f] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1890ff]"
              placeholder="Enter your password"
            />
          </div>
          {!isRegistering && (
            <div className="flex items-center justify-between text-sm text-[#bfbfbf]">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Remember me
              </label>
              <a href="#" className="text-[#1890ff] hover:underline">
                Forgot Password?
              </a>
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-[#1890ff] text-white py-2 rounded-lg hover:bg-[#40a9ff] transition"
          >
            {isRegistering ? 'Register' : 'Sign In'}
          </button>
          <div className="flex items-center justify-center text-sm text-[#bfbfbf]">
            <span className="mx-2">or</span>
          </div>
          <button
            type="button"
            onClick={Signinwithgoogle}
            className="w-full flex items-center justify-center gap-3 border border-[#444] bg-[#1d1d1f] text-white py-2 rounded-lg hover:bg-[#333] transition"
          >
            <FcGoogle size={20} />
            {isRegistering ? 'Register with Google' : 'Sign in with Google'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-[#8c8c8c]">
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-[#1890ff] hover:underline"
          >
            {isRegistering ? 'Sign In' : 'Register now'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
