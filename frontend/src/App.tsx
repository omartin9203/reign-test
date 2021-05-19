import React from 'react';
import './App.css';
import ReactNotifications from 'react-notifications-component';
import NewsDetails from "./components/news/details/NewsDetails";
import AppLayout from "./components/layout/AppLayout";

function App() {
  return (
    <div className="App">
      <ReactNotifications />
      <AppLayout />
      <NewsDetails />

    </div>
  );
}


export default App;
