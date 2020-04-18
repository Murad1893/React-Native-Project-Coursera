import React, { Component } from 'react';
import { FlatList, View, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';

const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    favorites: state.favorites //maintaing the favorites here
  }
}

class Favorites extends Component {

  render() {

    const { navigate } = this.props.navigation;

    const renderMenuItem = ({ item, index }) => {

      return (
        //same as the menuComponent
        <ListItem
          key={index}
          title={item.name}
          subtitle={item.description}
          hideChevron={true}
          onPress={() => navigate('Dishdetail', { dishId: item.id })}
          leftAvatar={{ source: { uri: baseUrl + item.image } }}
        />
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


export default connect(mapStateToProps)(Favorites);