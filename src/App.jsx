import { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login_page from "./pages/Login/Login_page";
import Signup_page from "./pages/Signup/Signup_page";
import Dashboard_page from "./pages/Dashboard/Dashboard_page";
import PlayQuiz_page from "./pages/PlayQuiz/PlayQuiz_page";
import QuizResult_page from "./pages/QuizResult/QuizResult_page";
import Analytics_page from "./pages/Analytics/Analytics_page";
import QuizAnalysis_page from "./pages/QuizAnalysis/QuizAnalysis_page";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("accessToken")
  );

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("accessToken");
      setIsAuthenticated(!!token);
    };

    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login_page />} />
      <Route path="/signup" element={<Signup_page />} />
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? <Dashboard_page /> : <Navigate to="/login" />
        }
      />
      <Route path="/playquiz/:quizId" element={<PlayQuiz_page />} />
      <Route path="/quizresult" element={<QuizResult_page />} />
      <Route
        path="/analytics"
        element={
          isAuthenticated ? <Analytics_page /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/quizAnalysis/:quizId"
        element={
          isAuthenticated ? <QuizAnalysis_page /> : <Navigate to="/login" />
        }
      />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
