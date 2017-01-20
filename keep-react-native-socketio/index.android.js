/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, {Component} from 'react';
import {AppRegistry} from 'react-native';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import {animeReducer} from './src/anime';
import {authReducer} from './src/auth';
import {Router} from './src/Router'

const rootReducer = combineReducers({Anime: animeReducer, auth: authReducer});
const store = createStore(rootReducer, applyMiddleware(thunk, createLogger({colors: {}})));
// const store = createStore(rootReducer, applyMiddleware(thunk));

export default class K10 extends Component {
  render() {
    return (
      <Router store={store}/>
    );
  }
}

AppRegistry.registerComponent('K10', () => K10);
