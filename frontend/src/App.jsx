import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Tasks from './pages/Tasks';
import Rewards from './pages/Rewards';
import Reflection from './pages/Reflection';
import Navbar from './components/Navbar';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="pt-4">
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/tasks" />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/rewards" element={<Rewards />} />
              <Route path="/reflections" element={<Reflection />} />
            </Routes>
          </Layout>
        </main>
      </div>
    </Router>
  );
}

export default App;