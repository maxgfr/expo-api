import React from 'react';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import TwitchScreen from '../screens/TwitchScreen';
import YoutubeScreen from '../screens/YoutubeScreen';
import InstagramScreen from '../screens/InstagramScreen';
import SpotifyScreen from '../screens/SpotifyScreen';
import PinterestScreen from '../screens/PinterestScreen';

const TwitchStack = createStackNavigator({
  Twitch: TwitchScreen,
});

TwitchStack.navigationOptions = {
  tabBarLabel: 'Twitch',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name='logo-twitch'
    />
  ),
};

const YoutubeStack = createStackNavigator({
  Youtube: YoutubeScreen,
});

YoutubeStack.navigationOptions = {
  tabBarLabel: 'Youtube',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name='logo-youtube'
    />
  ),
};

const InstagramStack = createStackNavigator({
  Instagram: InstagramScreen,
});

InstagramStack.navigationOptions = {
  tabBarLabel: 'Instagram',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name='logo-instagram'
    />
  ),
};

const SpotifyStack = createStackNavigator({
  Spotify: SpotifyScreen,
});

SpotifyStack.navigationOptions = {
  tabBarLabel: 'Spotify',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name='ios-musical-notes'
    />
  ),
};

const PinterestStack = createStackNavigator({
  Pinterest: PinterestScreen,
});

PinterestStack.navigationOptions = {
  tabBarLabel: 'Pinterest',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name='logo-pinterest'
    />
  ),
};

export default createBottomTabNavigator({
  TwitchStack,
  YoutubeStack,
  InstagramStack,
  SpotifyStack,
  PinterestStack
});
