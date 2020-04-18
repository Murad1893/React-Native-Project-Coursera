import React, { Component } from 'react'
import { Text, FlatList, ScrollView } from 'react-native'
import { Card, ListItem } from 'react-native-elements'
import { connect } from 'react-redux'
import { baseUrl } from '../shared/baseUrl'
import { Loading } from './LoadingComponent'
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
  return {
    //we only map the part that is required by this component
    leaders: state.leaders //now no need for this.state in constructor
  }
}

function History(props) {
  return (
    <Card title="Our History">
      <Text style={{ margin: 10 }}>Started in 2010, Ristorante con Fusion quickly established itself as a culinary icon par excellence in Hong Kong. With its unique brand of world fusion cuisine that can be found nowhere else, it enjoys patronage from the A-list clientele in Hong Kong.  Featuring four of the best three-star Michelin chefs in the world, you never know what will arrive on your plate the next time you visit us.
      </Text>
      <Text style={{ margin: 10 }}>The restaurant traces its humble beginnings to The Frying Pan, a successful chain started by our CEO, Mr. Peter Pan, that featured for the first time the world's best cuisines in a pan.
      </Text>
    </Card>
  )
}

function RenderLeaders(props) {
  const renderLeader = ({ item, index }) => {
    return (
      <ListItem
        key={index}
        title={item.name}
        subtitle={item.description}
        hideChevron={true}
        leftAvatar={{ source: { uri: baseUrl + item.image } }}
      />
    );
  };

  return (
    <Card title="Corporate Leadership">
      <FlatList
        data={props.leaders}
        renderItem={renderLeader}
        keyExtractor={item => item.id.toString()}
      />
    </Card>
  );

}

export class About extends Component {

  render() {

    if (this.props.leaders.isLoading) {
      return (
        <ScrollView>
          <History></History>
          <Card title='Corporate Leadership'></Card>
          <Loading></Loading>
        </ScrollView>
      )
    }

    else if (this.props.leaders.errMess) {
      return (
        <ScrollView>
          <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>
            <History />
            <Card
              title='Corporate Leadership'>
              <Text>{this.props.leaders.errMess}</Text>
            </Card>
          </Animatable.View>
        </ScrollView>
      )
    }

    else {
      //leaders contains isloading, and the leaders[] hence we do leaders.leaders
      return (
        <ScrollView>
          <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>
            <History></History>
            <RenderLeaders leaders={this.props.leaders.leaders}></RenderLeaders>
          </Animatable.View>
        </ScrollView >
      )
    }
  }
}

export default connect(mapStateToProps)(About);
