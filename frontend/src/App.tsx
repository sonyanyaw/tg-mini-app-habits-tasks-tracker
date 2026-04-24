import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import AddItemPage from './pages/AddItemPage';
import ToastContainer from './components/ui/Toast';
import CalendarPage from './pages/CalendarPage';
import StatsPage from './pages/StatsPage';
import SettingsPage from './pages/SettingsPage';


function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <ToastContainer />
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/tasks" element={<Dashboard />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/add" element={<AddItemPage />} />
            <Route path="/" element={<Auth />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;