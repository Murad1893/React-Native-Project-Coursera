import React from 'react';
import {
  ActivityIndicator, //spinning wheel like component available from react-native
  StyleSheet,
  Text,
  View,
} from 'react-native'

const styles = StyleSheet.create({ //custom stylesheet
  loadingView: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  loadingText: {
    color: '#512DA8',
    fontSize: 14,
    fontWeight: 'bold'
  }
});

//functional component
export const Loading = () => {
  return (
    <View style={styles.loadingView} >
      <ActivityIndicator size="large" color="#512DA8" />
      <Text style={styles.loadingText} >Loading . . .</Text>
    </View>
  );
};