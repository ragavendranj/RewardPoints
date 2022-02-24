import logo from './logo.svg';
import './App.css';
import RewardPoints from './RewardPoints/RewardPoints';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <RewardPoints/>
      </header>
    </div>
  );
}

export default App;
