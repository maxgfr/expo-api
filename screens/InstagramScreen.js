import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';

import Instagram from '../lib/instagram';

export default class InstagramScreen extends React.Component {
  static navigationOptions = {
    title: 'Instagram',
  };

  constructor(props) {
    super(props)
    this.state = {
      signIn: false,
    }
  }

  async onClickInstagram() {
      /*let insta = Instagram.getInstance();
      insta.getUserAccessToken();*/
  }

  render() {
    return (
        <View style={styles.container}>
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>


            <View style={styles.getStartedContainer}>
                  <Button title="Sign in with Instagram" onPress={() => this.onClickInstagram()} />
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
