import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Input, CheckBox, Button, Icon } from 'react-native-elements';
import * as SecureStore from 'expo-secure-store'
import * as ImagePicker from 'expo-image-picker'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Permissions from 'expo-permissions';
import { baseUrl } from '../shared/baseUrl';
import Constants from 'expo-constants'

class LoginTab extends Component {

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      remember: false
    }
  }

  componentDidMount() {
    SecureStore.getItemAsync('userinfo')
      .then((userdata) => {
        let userinfo = JSON.parse(userdata);
        if (userinfo) {
          this.setState({ username: userinfo.username });
          this.setState({ password: userinfo.password });
          this.setState({ remember: true })
        }
      })
  }

  handleLogin() {
    console.log(JSON.stringify(this.state));
    if (this.state.remember)
      SecureStore.setItemAsync('userinfo', JSON.stringify({ username: this.state.username, password: this.state.password }))
        .catch((error) => console.log('Could not save user info', error));
    else
      SecureStore.deleteItemAsync('userinfo')
        .catch((error) => console.log('Could not delete user info', error));

  }


  render() {
    return (
      <View style={styles.container}>
        <Input
          placeholder="Username"
          leftIcon={{ type: 'font-awesome', name: 'user-o', paddingRight: 10 }}
          onChangeText={(username) => this.setState({ username })}
          value={this.state.username}
          containerStyle={styles.formInput}
        />
        <Input
          placeholder="Password"
          leftIcon={{ type: 'font-awesome', name: 'key', paddingRight: 10 }}
          onChangeText={(password) => this.setState({ password })}
          value={this.state.password}
          secureTextEntry={true}
          containerStyle={styles.formInput}
        />
        <CheckBox title="Remember Me"
          center
          checked={this.state.remember}
          onPress={() => this.setState({ remember: !this.state.remember })}
          containerStyle={styles.formCheckbox}
        />
        <View style={styles.formButton}>
          <Button
            onPress={() => this.handleLogin()}
            title="Login"
            color="#512DA8"
            icon={
              <Icon
                name="sign-in"
                type='font-awesome'
                size={24}
                color="white"
                paddingRight={10}
              />
            }
            buttonStyle={{
              backgroundColor: "#512DA8"
            }}
          />
        </View>
      </View>
    );
  }

}

class RegisterTab extends Component {

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      firstname: '',
      lastname: '',
      email: '',
      remember: false,
      imageUrl: baseUrl + 'images/logo.png'
    }
  }

  //capturing image from the camera
  getImageFromCamera = async () => {
    const cameraPermission = await Permissions.askAsync(Permissions.CAMERA); //getting the camera permission
    const cameraRollPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (cameraPermission.status === 'granted' && cameraRollPermission.status === 'granted') {
      let capturedImage = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3], //setting the aspect ratio
      });
      if (!capturedImage.cancelled) {
        console.log(capturedImage);
        this.setState({ imageUrl: capturedImage.uri });
      }
    }

  }

  getImageFromGallery = async () => {
    const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);
    const cameraRollPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (cameraPermission.status === 'granted' && cameraRollPermission.status === 'granted') {
      let galleryImage = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3], //setting the aspect ratio
      });
      if (!galleryImage.cancelled) {
        console.log(galleryImage);
        this.setState({ imageUrl: galleryImage.uri });
      }
    }
  }

  //processing the image
  processImage = async (imageUri) => {
    let processedImage = await ImageManipulator.manipulate(
      imageUri,
      [
        { resize: { width: 400 } }
      ],
      { format: 'png' }
    );
    console.log(processedImage);
    this.setState({ imageUrl: processedImage.uri });

  }

  handleRegister() {
    console.log(JSON.stringify(this.state));
    if (this.state.remember)
      SecureStore.setItemAsync('userinfo', JSON.stringify({ username: this.state.username, password: this.state.password }))
        .catch((error) => console.log('Could not save user info', error));
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: this.state.imageUrl }}
              loadingIndicatorSource={require('./images/logo.png')} //showing a temporary while loading the image
              style={styles.image}
            />
            <Button
              title="Camera"
              onPress={this.getImageFromCamera}
            />
            <Button
              title="Gallery"
              onPress={this.getImageFromGallery}
            />
          </View>
          <Input
            placeholder="Username"
            leftIcon={{ type: 'font-awesome', name: 'user-o', paddingRight: 10 }}
            onChangeText={(username) => this.setState({ username })}
            value={this.state.username}
            containerStyle={styles.formInput}
          />
          <Input
            placeholder="Password"
            leftIcon={{ type: 'font-awesome', name: 'key', paddingRight: 10 }}
            onChangeText={(password) => this.setState({ password })}
            value={this.state.password}
            containerStyle={styles.formInput}
          />
          <Input
            placeholder="First Name"
            leftIcon={{ type: 'font-awesome', name: 'user-o', paddingRight: 10 }}
            onChangeText={(lastname) => this.setState({ firstname })}
            value={this.state.firstname}
            containerStyle={styles.formInput}
          />
          <Input
            placeholder="Last Name"
            leftIcon={{ type: 'font-awesome', name: 'user-o', paddingRight: 10 }}
            onChangeText={(lastname) => this.setState({ lastname })}
            value={this.state.lastname}
            containerStyle={styles.formInput}
          />
          <Input
            placeholder="Email"
            leftIcon={{ type: 'font-awesome', name: 'envelope-o', paddingRight: 10 }}
            onChangeText={(email) => this.setState({ email })}
            value={this.state.email}
            containerStyle={styles.formInput}
          />
          <CheckBox title="Remember Me"
            center
            checked={this.state.remember}
            onPress={() => this.setState({ remember: !this.state.remember })}
            containerStyle={styles.formCheckbox}
          />
          <View style={styles.formButton}>
            <Button
              onPress={() => this.handleRegister()}
              title="Register"
              icon={
                <Icon
                  name='user-plus'
                  type='font-awesome'
                  size={24}
                  color='white'
                  paddingRight={10}
                />
              }
              buttonStyle={{
                backgroundColor: "#512DA8"
              }}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}

//adding the bottom navigations
const Login = createBottomTabNavigator()

function LoginScreen() {
  return (
    <Login.Navigator
      initialRouteName={'Login'}
      tabBarOptions={{
        activeBackgroundColor: '#9575CD',
        inactiveBackgroundColor: '#D1C4E9',
        activeTintColor: '#ffffff',
        inactiveTintColor: 'gray'
      }}
    >
      <Login.Screen name="Login" component={LoginTab}
        options={{
          title: '',
          tabBarIcon: ({ color }) => (
            <Icon
              name='sign-in'
              type='font-awesome'
              size={30}
              iconStyle={{ color: color, paddingTop: 15 }}
            />
          )
        }} />
      <Login.Screen name="Register" component={RegisterTab}
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name='user-plus'
              type='font-awesome'
              size={30}
              iconStyle={{ color: color, paddingTop: 15 }}
            />
          )
        }} />
    </Login.Navigator>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    margin: 20,
  },
  imageContainer: {
    flex: 1,
    flexDirection: 'row',
    margin: 20,
    justifyContent: 'space-around'
  },
  image: {
    margin: 10,
    width: 80,
    height: 60
  },
  formInput: {
    margin: 20
  },
  formCheckbox: {
    margin: 20,
    backgroundColor: null
  },
  formButton: {
    margin: 60,
  }
});

export default LoginScreen;