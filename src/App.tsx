import { Provider } from 'react-redux';
import { store } from './app/redux/store';
import AppEntry from './app/ui/AppEntry';

function App() {
  return (
    <Provider store={store}>
      <AppEntry />
    </Provider>
  );
}

export default App;