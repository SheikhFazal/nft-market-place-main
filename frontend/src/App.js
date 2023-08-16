import "./app.css";
import Layout from "./components/Layout/Layout";
import React, { useEffect, useState } from "react";

function App() {
  const [theme, setTheme] = useState('light-theme')

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);
  const toogleTheme = () => {
    if (theme === 'dark-theme') {
      setTheme('light-theme')
    } else {
      setTheme('dark-theme')
    }
  }
  return <Layout toogleTheme={toogleTheme} />;
}

export default App;
