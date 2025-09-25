import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDVUFrcvaAMFHHrjX59P9f4psm0fi4TlSY",
  authDomain: "encuestas-20c74.firebaseapp.com",
  projectId: "encuestas-20c74",
  storageBucket: "encuestas-20c74.appspot.com",
  messagingSenderId: "177601042333",
  appId: "1:177601042333:web:2ba4830be0f21f3d158174"
};

const app = initializeApp(firebaseConfig);

export default app;