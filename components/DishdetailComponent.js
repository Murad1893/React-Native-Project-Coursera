import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Modal, StyleSheet, Button, Alert, PanResponder, Share } from 'react-native';
import { Rating, Icon, Card, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    favorites: state.favorites
  }
}

const mapDispatchToProps = dispatch => ({
  postFavorite: (dishId) => dispatch(postFavorite(dishId)),
  postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
})

function RenderDish(props) {

  const dish = props.dish;

  let handleViewRef = null;

  //MoveX is the latest screen coordinates of the recently moved touch gesture
  //moveY is the screen coordinates of the recently moved touch
  //dx is the accumulated distance of the gesture since the touch started along the X direction.
  //Dx along the X axis and dy along the Y axis

  //over here we are only recongizing the right to left gesture
  const recognizeDrag = ({ moveX, moveY, dx, dy }) => { //this will recognize that user has performed a drag
    if (dx < -200) //only interested in the right to left gesture (swipe left)
      return true
    else
      return false;
  }

  const recognizeComment = ({ moveX, moveY, dx, dy }) => {
    return (dx > 200) ? true : false;
  };


  const panResponder = PanResponder.create({
    //various callback functions implemented here
    onStartShouldSetPanResponder: (e, gestureState) => { //gesture state contains the info regarding the gesture done
      return true; //this will show that the panResponder will start responding to it
    },
    //will be called when the PanResponder starts recognizing and it has been granted the permission to respond to the pan, just here on the screen
    onPanResponderGrant: () => { handleViewRef.rubberBand(1000).then(endState => console.log(endState.finished ? 'finished' : 'cancelled')); },
    onPanResponderEnd: (e, gestureState) => { //when user lifts finger off the screen
      console.log("pan responder end", gestureState);
      if (recognizeDrag(gestureState)) {
        Alert.alert(
          'Add Favorite',
          'Are you sure you wish to add ' + dish.name + ' to favorite?',
          [
            { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
            { text: 'OK', onPress: () => { props.favorite ? console.log('Already favorite') : props.onPress() } },
          ],
          { cancelable: false }
        );
      }
      else if (recognizeComment(gestureState)) {
        props.toggleModal();
      }
      return true;
    }
  })

  //we will configure to use the share api
  const shareDish = (title, message, url) => {
    //this will allow us to share using any sharing social media
    Share.share({
      title: title,
      message: title + ': ' + message + ' ' + url,
      url: url
    }, {
      dialogTitle: 'Share ' + title
    })
  }

  if (dish != null) {
    return (
      //we must add the panhandlers in order for the gesture to be applied
      //ref indicates that this view will call this function
      <Animatable.View animation="fadeInDown" duration={2000} delay={1000} ref={ref => handleViewRef = ref} {...panResponder.panHandlers}>
        <Card
          featuredTitle={dish.name}
          image={{ uri: baseUrl + dish.image }}>
          <Text style={{ margin: 10 }}>
            {dish.description}
          </Text>
          <View style={styles.iconview}>
            <Icon
              raised
              reverse
              name={props.favorite ? 'heart' : 'heart-o'} //filling a filled heart if already favourite else only outline shown
              type='font-awesome'
              color='#f50'

              onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}>{/*If not in favorite then it will call the onPress it got from the props */}</Icon>
            <Icon
              raised
              reverse
              name={'pencil'} //filling a filled heart if already favourite else only outline shown
              type='font-awesome'
              color='#512DA8'
              onPress={() => props.toggleModal()}
            ></Icon>
            <Icon
              raised
              reverse
              name='share'
              type='font-awesome'
              color='#51D2A8'
              style={styles.cardItem}
              onPress={() => shareDish(dish.name, dish.description, baseUrl + dish.image)} />
          </View>
        </Card>
      </Animatable.View>
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
        <Rating
          imageSize={12}
          readonly
          startingValue={item.rating}
          style={styles.rating}
        />
        <Text style={{ fontSize: 12 }}>{'-- ' + item.author + ', ' + item
          .date} </Text>
      </View>
    );
  };
  return (
    <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
      <Card title='Comments' >
        <FlatList
          data={comments}
          renderItem={renderCommentItem}
          keyExtractor={item => { item.id.toString() }}
        />
      </Card>
    </Animatable.View>
  );
}

class Dishdetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      rating: 1,
      author: '',
      comment: '',
      showModal: false
    };
  }

  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  markFavorite(dishId) {
    this.props.postFavorite(dishId); //now we are not setting the state locally, hence we are generating a post to the server
  }

  handleComment(dishId, rating, author, comment) {
    this.props.postComment(dishId, rating, author, comment)
    this.toggleModal()
  }

  resetForm() {
    this.setState({
      rating: 1,
      author: '',
      comment: '',
      showModal: false
    });
  }

  render() {
    const dishId = this.props.route.params.dishId;
    return (
      <ScrollView>
        <RenderDish dish={this.props.dishes.dishes[+dishId]}
          favorite={this.props.favorites.some(el => el === dishId)}
          onPress={() => this.markFavorite(dishId)}
          toggleModal={() => this.toggleModal()}
        />
        <Modal animationType={"slide"} transparent={false}
          visible={this.state.showModal}
          onDismiss={() => this.toggleModal()}
          onRequestClose={() => this.toggleModal()}>
          <View style={styles.formRow, styles.formRating}>
            <Rating style={styles.formItem}
              type='star'
              ratingCount={5}
              startingValue={1}
              imageSize={30}
              showRating
              onFinishRating={(value) => this.setState({ rating: value })}
            />
          </View>
          <View style={styles.formRow, styles.formInput}>
            <Input
              placeholder='Author'
              leftIcon={{ type: 'font-awesome', name: 'user-o', marginRight: 10 }}
              onChangeText={(name) => this.setState({ author: name })}
            />
          </View>
          <View style={styles.formRow, styles.formInput}>
            <Input
              placeholder='Comment'
              leftIcon={{ type: 'font-awesome', name: 'comment-o', marginRight: 10 }}
              onChangeText={(comment) => this.setState({ comment: comment })}
            />
          </View>
          <View style={styles.formRow, styles.formButton}>
            <Button
              color="#512DA8"
              title="Submit"
              onPress={() => this.handleComment(dishId, this.state.rating, this.state.author, this.state.comment)}
            />
          </View>
          <View style={styles.formRow, styles.formButton}>
            <Button
              color="#6c757d"
              title="Cancel"
              onPress={() => { this.toggleModal(); this.resetForm(); }}
            />
          </View>
        </Modal>
        <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  formRow: {
    flexDirection: 'row',
    margin: 20
  },
  formRating: {
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20
  },
  formInput: {
    justifyContent: 'flex-start',
  },
  formButton: {
    justifyContent: 'flex-end',
    margin: 15
  },
  iconview: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  rating: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);