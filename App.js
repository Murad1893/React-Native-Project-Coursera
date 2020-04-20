import React from 'react';
import Main from './components/MainComponent';
import { Provider } from 'react-redux'
import { ConfigureStore } from './redux/configureStore'
import { PersistGate } from 'redux-persist/es/integration/react' //will allow us to 
import { Loading } from './components/LoadingComponent'; //this will be used by the persistGate when it is rehydrating the component

const { persistor, store } = ConfigureStore();

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate
          loading={<Loading />}
          persistor={persistor}>
          <Main />
        </PersistGate>
      </Provider>
    );
  }
}