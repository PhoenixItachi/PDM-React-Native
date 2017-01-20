import React, {Component} from 'react';
import {ListView, Text, View, StatusBar, ActivityIndicator} from 'react-native';
import {AnimeEdit} from './AnimeEdit';
import {AnimeView} from './AnimeView';
import {loadAnimes, cancelLoadAnimes} from './service';
import {registerRightAction, getLogger, issueToText} from '../core/utils';
import styles from '../core/styles';

const log = getLogger('AnimeList');
const Anime_LIST_ROUTE = 'Anime/list';

export class AnimeList extends Component {
  static get routeName() {
    return Anime_LIST_ROUTE;
  }

  static get route() {
    return {name: Anime_LIST_ROUTE, title: 'Anime List', rightText: ''};
  }

  constructor(props) {
    super(props);
    log('constructor');
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
    this.store = this.props.store;
    const animeState = this.store.getState().Anime;
    this.state = {isLoading: animeState.isLoading, dataSource: this.ds.cloneWithRows(animeState.items)};
    registerRightAction(this.props.navigator, this.onNewAnime.bind(this));
  }

  render() {
    log('render');
    console.log("AnimeList - render anime list");
    console.log(this.state.dataSource);
    let message = issueToText(this.state.issue);
    return (
      <View style={styles.content}>
        { this.state.isLoading &&
        <ActivityIndicator animating={true} style={styles.activityIndicator} size="large"/>
        }
        {message && <Text>{message}</Text>}
        <ListView
          dataSource={this.state.dataSource}
          enableEmptySections={true}
          // renderRow={Anime => (<AnimeView Anime={Anime} onPress={(Anime) => this.onAnimePress(Anime)}/>)}/>
          renderRow={Anime => (<AnimeView Anime={Anime} onPress={(Anime) => this.onAnimePress(Anime)}/>)}/>
      </View>
    );
  }

  onNewAnime() {
    log('onNewAnime');
    this.props.navigator.push({...AnimeEdit.route });
  }

  onAnimePress(Anime) {
    log('onAnimePress');
    this.props.navigator.push({...AnimeEdit.route, data: Anime});
  }

  componentDidMount() {
    log('componentDidMount');
    this._isMounted = true;
    const store = this.store;
    this.unsubscribe = store.subscribe(() => {
      log('setState');
      const animeState = store.getState().Anime;
      this.setState({dataSource: this.ds.cloneWithRows(animeState.items), isLoading: animeState.isLoading});
    });
    store.dispatch(loadAnimes());
  }

  componentWillUnmount() {
    log('componentWillUnmount');
    this._isMounted = false;
    this.unsubscribe();
    if (this.state.isLoading) {
      this.store.dispatch(cancelLoadAnimes());
    }
  }
}
