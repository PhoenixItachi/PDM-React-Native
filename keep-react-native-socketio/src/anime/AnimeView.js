import React, {Component} from 'react';
import {Text, View, StyleSheet, TouchableHighlight, Image} from 'react-native';

export class AnimeView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableHighlight onPress={() => this.props.onPress(this.props.Anime)}>
        <View style={{flexDirection:'row', flexWrap:'wrap'}}>
          <Image style={styles.listItem} source={{uri: `${this.props.Anime.image}`}}
              style={{width: 50, height: 71 }} />
          <Text style={styles.listItem}>{this.props.Anime.title} {"\n"} Episodes: {this.props.Anime.noEpisodes} {"\n"} Score: {this.props.Anime.score}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  listItem: {
    margin: 10,
  }
});
