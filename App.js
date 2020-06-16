import React from 'react';
import { StyleSheet, View } from 'react-native';

import DrawerNavigation from '../Note-Coin/navigation/DrawerNavigation';
import {Provider} from 'react-redux';
import {createStore} from 'redux'
import reducers from './redux/index'//reducer oluşturulduktan sonra gelecek

export const store = createStore(reducers);


export default class App extends React.Component {
  constructor(props){
    super(props);
    
  }
  render() {
    return (
      <Provider store={store}>
        <View style={styles.container}>
           <DrawerNavigation/>
        </View>
        </Provider>
   
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    marginTop:21,
    alignContent:'center',
   
    justifyContent: 'center',
  },
});