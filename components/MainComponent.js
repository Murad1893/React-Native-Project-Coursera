import React, { Component } from 'react';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import Menu from './MenuComponent';
import Home from './HomeComponent';
import Dishdetail from './DishdetailComponent';
import Contact from './ContactComponent'
import About from './AboutComponent'
import { connect } from 'react-redux';
import { fetchDishes, fetchComments, fetchPromos, fetchLeaders } from '../redux/ActionCreators';
import Reservation from './ReservationComponent';
import Favorites from './FavoriteComponent';

const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    promotions: state.promotions,
    leaders: state.leaders
  }
}

const mapDispatchToProps = dispatch => ({
  fetchDishes: () => dispatch(fetchDishes()),
  fetchComments: () => dispatch(fetchComments()),
  fetchPromos: () => dispatch(fetchPromos()),
  fetchLeaders: () => dispatch(fetchLeaders()),
})

const HeaderOptions = {
  headerStyle: {
    backgroundColor: "#512DA8"
  },
  headerTintColor: "#fff",
  headerTitleStyle: {
    color: "#fff"
  },

};

const MenuNavigator = createStackNavigator();

function MenuNavigatorScreen() {
  return (
    <MenuNavigator.Navigator
      initialRouteName='Menu'
      screenOptions={HeaderOptions}
    >
      <MenuNavigator.Screen
        name="Menu"
        component={Menu}
        options={({ navigation }) => ({
          headerLeft: () => <Icon name="menu" size={24}
            color='white'
            onPress={() => navigation.toggleDrawer()} />
        })}

      />
      <MenuNavigator.Screen
        name="Dishdetail"
        component={Dishdetail}
        options={{ headerTitle: "Dish Detail" }}
      />
    </MenuNavigator.Navigator>
  );
}

const HomeNavigator = createStackNavigator();


function HomeNavigatorScreen() {
  return (
    <HomeNavigator.Navigator
      initialRouteName='Home'
      screenOptions={HeaderOptions}
    >
      <HomeNavigator.Screen
        name="Home"
        component={Home}
        options={({ navigation }) => ({
          headerLeft: () => <Icon name="menu" size={24}
            color='white'
            onPress={() => navigation.toggleDrawer()} />
        })}
      />
    </HomeNavigator.Navigator>
  );
}

const ContactNavigator = createStackNavigator()

function ContactNavigatorScreen() {
  return (
    <ContactNavigator.Navigator
      initialRouteName='Contact'
      screenOptions={HeaderOptions}
    >

      <ContactNavigator.Screen
        name="Contact"
        component={Contact}
        options={({ navigation }) => ({
          headerTitle: 'Contact Us',
          headerLeft: () => <Icon name="menu" size={24}
            color='white'
            onPress={() => navigation.toggleDrawer()} />
        })}
      />

    </ContactNavigator.Navigator>
  )
}

const AboutNavigator = createStackNavigator()

function AboutNavigatorScreen() {
  return (
    <AboutNavigator.Navigator
      initialRouteName='About'
      screenOptions={HeaderOptions}
    >

      <AboutNavigator.Screen
        name="About"
        component={About}
        options={({ navigation }) => ({
          headerTitle: "About Us",
          headerLeft: () => <Icon name="menu" size={24}
            color='white'
            onPress={() => navigation.toggleDrawer()} />
        })}
      />

    </AboutNavigator.Navigator>
  )
}

const ReservationNavigator = createStackNavigator()

function ReservationNavigatorScreen() {
  return (
    <ReservationNavigator.Navigator
      initialRouteName='Reservation'
      screenOptions={HeaderOptions}
    >

      <ReservationNavigator.Screen
        name='Reservation'
        component={Reservation}
        options={({ navigation }) => ({
          headerStyle: {
            backgroundColor: "#512DA8"
          },
          headerTitleStyle: {
            color: "#fff"
          },
          headerTintColor: "#fff",
          headerLeft: () => <Icon name="menu" size={24}
            iconStyle={{ color: 'white' }}
            onPress={() => navigation.toggleDrawer()} />
        })}>
      </ReservationNavigator.Screen>

    </ReservationNavigator.Navigator>
  )
}

const FavoriteNavigator = createStackNavigator()

function FavoriteNavigatorScreen() {
  return (
    <FavoriteNavigator.Navigator
      initialRouteName='Favorites'
      screenOptions={HeaderOptions}
    >

      <FavoriteNavigator.Screen
        name='Favorites'
        component={Favorites}
        options={({ navigation }) => ({
          headerStyle: {
            backgroundColor: "#512DA8"
          },
          headerTitleStyle: {
            color: "#fff"
          },
          headerTintColor: "#fff",
          headerLeft: () => <Icon name="menu" size={24}
            iconStyle={{ color: 'white' }}
            onPress={() => navigation.toggleDrawer()} />
        })}>
      </FavoriteNavigator.Screen>

    </FavoriteNavigator.Navigator>
  )
}

const MainNavigator = createDrawerNavigator();

function MainNavigatorDrawer() {
  return (
    <MainNavigator.Navigator
      initialRouteName="Home"
      drawerStyle={{
        backgroundColor: '#D1C4E9'
      }}
      drawerContent={props => <CustomDrawerContentComponent {...props} />}>

      <MainNavigator.Screen name="Home" component={HomeNavigatorScreen} options={{
        drawerIcon: ({ color, focused }) => (
          <Icon
            name='home'
            type='font-awesome'
            size={24}
            color={color}
          />
        )
      }}
      />
      <MainNavigator.Screen name="About" component={AboutNavigatorScreen} options={{
        title: 'About Us',
        drawerIcon: ({ color, focused }) => (
          <Icon
            name='info-circle'
            type='font-awesome'
            size={24}
            color={color}
          />
        )
      }} />
      <MainNavigator.Screen name="Menu" component={MenuNavigatorScreen} options={{
        drawerIcon: ({ color, focused }) => (
          <Icon
            name='list'
            type='font-awesome'
            size={24}
            color={color}
          />
        )
      }} />
      <MainNavigator.Screen name="Contact" component={ContactNavigatorScreen} options={{
        title: 'Contact Us',
        drawerIcon: ({ color, focused }) => (
          <Icon
            name='address-card'
            type='font-awesome'
            size={24}
            color={color}
          />
        )
      }} />

      <MainNavigator.Screen name="Reservation" component={ReservationNavigatorScreen} options={{
        title: 'Reserve Table',
        drawerLabel: 'Reserve Table',
        drawerIcon: ({ color, focused }) => (
          <Icon
            name='cutlery'
            type='font-awesome'
            size={24}
            iconStyle={{ color: color }}
          />
        )
      }} />

      <MainNavigator.Screen name="Favorites" component={FavoriteNavigatorScreen} options={{
        title: 'My Favorites',
        drawerLabel: 'My Favorites',
        drawerIcon: ({ color, focused }) => (
          <Icon
            name='heart'
            type='font-awesome'
            size={24}
            iconStyle={{ color: color }}
          />
        )
      }} />
    </MainNavigator.Navigator>
  );
}

const CustomDrawerContentComponent = (props) => (
  <ScrollView>
    <View style={styles.container} forceInset={{
      top: 'always',
      horizontal: 'never'
    }}>
      <View style={styles.drawerHeader}>
        <View style={{ flex: 1 }}>
          <Image source={require('./images/logo.png')} style={styles
            .drawerImage} />
        </View>
        <View style={{ flex: 2 }}>
          <Text style={styles.drawerHeaderText}>Ristorante Con Fusion</Text>
        </View>
      </View>
      <DrawerItemList {...props} />
    </View>
  </ScrollView>
);

class Main extends Component {

  componentDidMount() { //when the main component is mounted, we will dispatch all these
    this.props.fetchDishes();
    this.props.fetchComments();
    this.props.fetchPromos();
    this.props.fetchLeaders();
  }

  render() {

    return (
      <NavigationContainer>
        <MainNavigatorDrawer />
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerHeader: {
    backgroundColor: '#512DA8',
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row'
  },
  drawerHeaderText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold'
  },
  drawerImage: {
    margin: 10,
    width: 80,
    height: 60
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);