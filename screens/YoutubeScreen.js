import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';

import Youtube from '../lib/youtube';

export default class YoutubeScreen extends React.Component {
  static navigationOptions = {
    title: 'Youtube',
  };

  constructor(props) {
    super(props)
    this.state = {
      signIn: false,
    }
  }

  async onClickYoutube() {
      let yt = Youtube.getInstance();
      yt.loginWithGoogle();
  }

  render() {
    return (
        <View style={styles.container}>
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>


            <View style={styles.getStartedContainer}>
                  <Button title="Sign in with Youtube" onPress={() => this.onClickYoutube()} />
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
