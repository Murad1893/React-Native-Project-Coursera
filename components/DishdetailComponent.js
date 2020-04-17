import React, { Component } from 'react';
import { ScrollView, FlatList, Text, View } from 'react-native';
import { Icon, Card } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite } from '../redux/ActionCreators';

const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    favorites: state.favorites
  }
}

const mapDispatchToProps = dispatch => ({
  postFavorite: (dishId) => dispatch(postFavorite(dishId))
})

function RenderDish(props) {

  const dish = props.dish;

  if (dish != null) {
    return (
      <Card
        featuredTitle={dish.name}
        image={{ uri: baseUrl + dish.image }}>
        <Text style={{ margin: 10 }}>
          {dish.description}
        </Text>
        <Icon
          raised
          reverse
          name={props.favorite ? 'heart' : 'heart-o'} //filling a filled heart if already favourite else only outline shown
          type='font-awesome'
          color='#f50'
          onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}>{/*If not in favorite then it will call the onPress it got from the props */}</Icon>
      </Card>
    );
  }
  else {
    return (<View></View>);
  }
}

function RenderComments(props) {
  const comments = props.comments;
  const renderCommentItem = ({ item, index }) => {
    return (
      <View key={index} style={{ margin: 10 }}>
        <Text style={{ fontSize: 14 }}>{item.comment}</Text>
        <Text style={{ fontSize: 12 }}>{item.rating} Stars</Text>
        <Text style={{ fontSize: 12 }}>{'-- ' + item.author + ', ' + item
          .date} </Text>
      </View>
    );
  };
  return (
    <Card title='Comments' >
      <FlatList
        data={comments}
        renderItem={renderCommentItem}
        keyExtractor={item => item.id.toString()}
      />
    </Card>
  );
}

class Dishdetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      favorites: [] //this will keep track of all favourite dishes
    };
  }

  markFavorite(dishId) {
    this.props.postFavorite(dishId); //now we are not setting the state locally, hence we are generating a post to the server
  }

  render() {
    const dishId = this.props.route.params.dishId;
    return (
      <ScrollView>
        <RenderDish dish={this.props.dishes.dishes[+dishId]}
          favorite={this.props.favorites.some(el => el === dishId)}
          onPress={() => this.markFavorite(dishId)}
        />
        <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
      </ScrollView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);