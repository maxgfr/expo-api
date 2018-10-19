import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';

import Spotify from '../lib/spotify';

export default class SpotifyScreen extends React.Component {
  static navigationOptions = {
    title: 'Spotify',
  };

  constructor(props) {
    super(props)
    this.state = {
      signIn: false,
    }
  }

  async onClickSpotify() {
      let spotify = Spotify.getInstance();
      await spotify.getUserAccessToken(function(result) {
        console.log(result);
      });
  }

  render() {
    return (
        <View style={styles.container}>
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>


            <View style={styles.getStartedContainer}>
                  <Button title="Sign in with Spotify" onPress={() => this.onClickSpotify()} />
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
