import React, {Component} from 'react';
import {Text, View, TextInput, ActivityIndicator, Image, ScrollView} from 'react-native';
import {saveAnime, cancelSaveAnime} from './service';
import {registerRightAction, issueToText, getLogger} from '../core/utils';
import styles from '../core/styles';

const log = getLogger('AnimeEdit');
const ANIME_EDIT_ROUTE = 'anime/edit';
const ANIME_NEW_ROUTE = 'anime/new';

export class AnimeEdit extends Component {
  static get routeName() {
    return ANIME_EDIT_ROUTE;
  }

  static get newrouteName(){
    return ANIME_NEW_ROUTE;
  }

  static get route() {
    return {name: ANIME_EDIT_ROUTE, title: 'Anime Edit', rightText: ''};
  }

  static get newroute(){
    return {name: ANIME_NEW_ROUTE, title: 'Anime Edit', rightText: 'Save'}
  }

  constructor(props) {
    log('constructor');
    super(props);
    this.store = this.props.store;
    const nav = this.props.navigator;
    this.navigator = nav;
    const currentRoutes = nav.getCurrentRoutes();
    const currentRoute = currentRoutes[currentRoutes.length - 1];
    console.log(currentRoute.data);
    if (currentRoute.data) {
      this.state = {Anime: {...currentRoute.data}, isSaving: false};
    } else {
      this.state = {Anime: { title: '' }, isSaving: false};
    }
    registerRightAction(nav, this.onSave.bind(this));
  }

  render() {
    log('render');
    const state = this.state;
    let message = issueToText(state.issue);
      return (
        <View style={styles.content}>
          { state.isSaving &&
          <ActivityIndicator animating={true} style={styles.activityIndicator} size="large"/>
          }
          <ScrollView>
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1}}>
              <View style={{elevation: 5, backgroundColor: '#fff'}}>
                <Image style={styles.listItem} source={{uri: `${state.Anime.image}`}}
                    style={{width: 175, height: 250 }} />
              </View>
              <View style={{alignItems: 'center', flex: 1}}>
                <Text>{state.Anime.title}</Text>
                <Text>Episodes: {state.Anime.noEpisodes} {"\n"} Score: {state.Anime.score}</Text>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <View style={{flex: .1}}></View>
                  <Text style={{flex: .8}}> {state.Anime.synopsis.replace(/<(?:.|\n)*?>/gm, '').replace(/&amp;/g,'&').replace(/&gt;/g,/>/g).replace(/&lt;/g, /</g).replace(/&quot;/g,'"')
                  .replace(/&#039;/g, "'").replace(/&rsquo;/g, "'")}
                  </Text>
                  <View style={{flex: .1}}></View>
                </View>
              </View>
              {message && <Text>{message}</Text>}
            </View>
          </ScrollView>
        </View>
      );
  }

  componentDidMount() {
    log('componentDidMount');
    this._isMounted = true;
    const store = this.props.store;
    this.unsubscribe = store.subscribe(() => {
      log('setState');
      const state = this.state;
      const animeState = store.getState().Anime;
      this.setState({...state, issue: animeState.issue});
    });
  }

  componentWillUnmount() {
    log('componentWillUnmount');
    this._isMounted = false;
    this.unsubscribe();
    if (this.state.isLoading) {
      this.store.dispatch(cancelSaveAnime());
    }
  }

  updateAnimeText(text) {
    let newState = {...this.state};
    newState.Anime.title = text;
    this.setState(newState);
  }

  onSave() {
    log('onSave');
    this.store.dispatch(saveAnime(this.state.Anime)).then(() => {
      log('onAnimeSaved');
      if (!this.state.issue) {
        this.navigator.pop();
      }
    });
  }
}
