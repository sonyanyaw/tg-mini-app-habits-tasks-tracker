import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Auth from './pages/Auth';
// import Habits from './pages/Habits';
import Dashboard from './pages/Dashboard';
// import AddTaskPage from './pages/Add';
import AddItemPage from './pages/AddItemPage';


function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/tasks" element={<Dashboard />} />
            {/* <Route path="/habits" element={<Habits />} /> */}
            <Route path="/add" element={<AddItemPage />} />
            <Route path="/" element={<Auth />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;