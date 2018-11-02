import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';

import Medium from '../lib/medium';

export default class MediumScreen extends React.Component {
  static navigationOptions = {
    title: 'Medium',
  };

  constructor(props) {
    super(props)
    this.state = {
      signIn: false,
    }
  }

  async onClickMedium() {
      let medium = Medium.getInstance();
      await medium.getUserAccessToken(function(result) {
        console.log(result);
      });
  }

  render() {
    return (
        <View style={styles.container}>
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>


            <View style={styles.getStartedContainer}>
                  <Button title="Sign in with Medium" onPress={() => this.onClickMedium()} />
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
