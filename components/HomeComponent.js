import React, { Component } from 'react';
import { Card } from 'react-native-elements';
import { connect } from 'react-redux'
import { baseUrl } from '../shared/baseUrl'
import { Loading } from './LoadingComponent';
import { Text, View, Animated, Easing } from 'react-native';

const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    promotions: state.promotions,
    leaders: state.leaders
  }
}

function RenderItem(props) { //this will render the view

  const item = props.item;

  if (props.isLoading) {
    return (
      <Loading />
    );
  }
  else if (props.errMess) {
    return (
      <View>
        <Text>{props.errMess}</Text>
      </View>
    );
  }
  else {
    if (item != null) {
      return (
        <Card
          featuredTitle={item.name}
          featuredSubtitle={item.designation}
          image={{ uri: baseUrl + item.image }}>
          <Text
            style={{ margin: 10 }}>
            {item.description}</Text>
        </Card>
      );
    }
    else {
      return (<View></View>);
    }
  }
}

class Home extends Component {

  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(0);  //in order to store values for the animation api      
  }

  componentDidMount() {
    this.animate() //animate 
  }

  animate() {
    this.animatedValue.setValue(0)
    Animated.timing( //enables us to change this setValue as a function of time
      this.animatedValue,
      {
        toValue: 8,
        duration: 8000,
        easing: Easing.linear //slow start fast end, or linear motion etc. how to change
      }
    ).start(() => this.animate())
  }

  render() {
    //we can perform interpolation of the values using this. 
    //Hence item given xpos1 will move like such
    const xpos1 = this.animatedValue.interpolate({
      inputRange: [0, 1, 3, 5, 8],
      outputRange: [1200, 600, 0, -600, -1200]
    })
    const xpos2 = this.animatedValue.interpolate({
      inputRange: [0, 2, 4, 6, 8],
      outputRange: [1200, 600, 0, -600, -1200]
    })
    const xpos3 = this.animatedValue.interpolate({
      inputRange: [0, 3, 5, 7, 8],
      outputRange: [1200, 600, 0, -600, -1200]
    })

    //we can see that all xpos are changing in a staggered manner hence at xpos = 1 val = 1200 but val for xpos2 is 1200 at 2 and for xpos3 at 3 and so on...

    return (
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
        <Animated.View style={{ width: '100%', transform: [{ translateX: xpos1 }] }}>
          <RenderItem item={this.props.dishes.dishes.filter((dish) => dish.featured)[0]}
            isLoading={this.props.dishes.isLoading}
            erreMess={this.props.dishes.erreMess}
          />
        </Animated.View>
        <Animated.View style={{ width: '100%', transform: [{ translateX: xpos2 }] }}>
          <RenderItem item={this.props.promotions.promotions.filter((promo) => promo.featured)[0]}
            isLoading={this.props.promotions.isLoading}
            erreMess={this.props.promotions.erreMess}
          />
        </Animated.View>
        <Animated.View style={{ width: '100%', transform: [{ translateX: xpos3 }] }}>
          <RenderItem item={this.props.leaders.leaders.filter((leader) => leader.featured)[0]}
            isLoading={this.props.leaders.isLoading}
            erreMess={this.props.leaders.erreMess}
          />
        </Animated.View>
      </View>
    );
  }
}

export default connect(mapStateToProps)(Home);