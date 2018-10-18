import React from 'react';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import TwitchScreen from '../screens/TwitchScreen';
import YoutubeScreen from '../screens/YoutubeScreen';
import InstagramScreen from '../screens/InstagramScreen';

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

export default createBottomTabNavigator({
  TwitchStack,
  YoutubeStack,
  InstagramStack,
});
