import React, { Component } from 'react';
import { FlatList, View, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { deleteFavorite } from '../redux/ActionCreators';
import Swipeout from 'react-native-swipeout';

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
          onPress: () => this.props.deleteFavorite(item.id)
        }
      ];

      return (
        //same as the menuComponent
        //now we make use of the swipeout gesture
        <Swipeout right={rightButton} autoClose={true}>
          <ListItem
            key={index}
            title={item.name}
            subtitle={item.description}
            hideChevron={true}
            onPress={() => navigate('Dishdetail', { dishId: item.id })}
            leftAvatar={{ source: { uri: baseUrl + item.image } }}
          />
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