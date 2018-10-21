import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';

import Pinterest from '../lib/pinterest';

export default class PinterestScreen extends React.Component {
  static navigationOptions = {
    title: 'Pinterest',
  };

  constructor(props) {
    super(props)
    this.state = {
      signIn: false,
    }
  }

  async onClickPinterest() {
      let pinterest = Pinterest.getInstance();
      await pinterest.getUserAccessToken(function(result) {
        console.log(result);
      });
  }

  render() {
    return (
        <View style={styles.container}>
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>


            <View style={styles.getStartedContainer}>
                  <Button title="Sign in with Pinterest" onPress={() => this.onClickPinterest()} />
            </View>


          </ScrollView>


        </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
          flex: 1,
          backgroundColor: '#fff',
    },
    contentContainer: {
        paddingTop: 30,
    },
    getStartedContainer: {
        alignItems: 'center',
        marginHorizontal: 50,
    }
});
