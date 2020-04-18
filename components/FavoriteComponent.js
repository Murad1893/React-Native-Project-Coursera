import React, { Component } from 'react';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { deleteFavorite } from '../redux/ActionCreators';
import Swipeout from 'react-native-swipeout';
import { FlatList, View, Text, Alert } from 'react-native';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    favorites: state.favorites //maintaing the favorites here
  }
}

const mapDispatchToProps = dispatch => ({ //adding the dispatch to props here
  deleteFavorite: (dishId) => dispatch(deleteFavorite(dishId))
})

class Favorites extends Component {

  render() {

    const { navigate } = this.props.navigation;

    //giving an array of option buttons here

    const renderMenuItem = ({ item, index }) => {

      const rightButton = [
        {
          text: 'Delete',
          type: 'delete',
          //we will first popup an alert dialog before deleting
          onPress: () => {
            Alert.alert(
              'Delete Favorite?', //title for the alert dialog
              'Are you sure you wish to delete the favorite dish ' + item.name + '?', //short message to be shown in the dialog box
              [ //this will be the buttons to be shown in the alert dialog
                {
                  text: 'Cancel',
                  onPress: () => console.log(item.name + 'Not Deleted'),
                  style: ' cancel'
                },
                {
                  text: 'OK',
                  onPress: () => this.props.deleteFavorite(item.id) //hence we now call the delete over here
                }
              ],
              { cancelable: false }
            );
          }
        }
      ];

      return (
        //same as the menuComponent
        //now we make use of the swipeout gesture
        <Swipeout right={rightButton} autoClose={true}>
          <Animatable.View animation="fadeInRightBig" duration={2000}>
            <ListItem
              key={index}
              title={item.name}
              subtitle={item.description}
              hideChevron={true}
              onPress={() => navigate('Dishdetail', { dishId: item.id })}
              leftAvatar={{ source: { uri: baseUrl + item.image } }}
            />
          </Animatable.View >
        </Swipeout>
      );
    };

    if (this.props.dishes.isLoading) {
      return (
        <Loading />
      );
    }
    else if (this.props.dishes.errMess) {
      return (
        <View>
          <Text>{this.props.dishes.errMess}</Text>
        </View>
      );
    }
    else {
      return (
        //showing the list of favorite dishes
        <FlatList
          data={this.props.dishes.dishes.filter(dish => this.props.favorites.some(el => el === dish.id))} //we will only fetch those dishes that are in the favorites
          renderItem={renderMenuItem}
          keyExtractor={item => item.id.toString()}
        />
      );
    }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Favorites);