import { Provider } from 'react-redux';
import { store } from './store/store';
import { TryOnApp } from './components/TryOnApp';
import './index.css';

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-100 flex justify-center p-8">
        <TryOnApp />
      </div>
    </Provider>
  );
}

export default App;