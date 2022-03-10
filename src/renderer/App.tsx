import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Canvas from './components/canvas';

const Hello = () => {
  return (
    <>
      <Canvas width={450} height={300} />
    </>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
