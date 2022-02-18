import logo from './logo.svg';
import './App.css';
import NumberBoard from './components/NumberBoard';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import { HomeMain } from './components/Home';


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from 'firebase/database';
import React from 'react';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB28Xu-SQSToQkkZorwQim0Qdsl2GTeuUQ",
  authDomain: "bozbingo.firebaseapp.com",
  databaseURL: "https://bozbingo-default-rtdb.firebaseio.com",
  projectId: "bozbingo",
  storageBucket: "bozbingo.appspot.com",
  messagingSenderId: "479426463043",
  appId: "1:479426463043:web:3e5171422e934985165bf6",
  measurementId: "G-37K32V17NT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db_context = React.createContext(getDatabase());

function App() {

  return (
    <div className="App" style={{ padding: '10px' }}>
      <Router>
        <Routes>
          <Route path="/game" element={<NumberBoard/>}/>
          
          <Route path="/" element={<HomeMain/>} />
          
          
        </Routes>
      </Router>
    </div>
  );
}

export default App;
