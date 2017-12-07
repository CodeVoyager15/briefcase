import React, { Component, PropTypes } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BubbleMenu from './BubbleMenu';


// TODO: Styles for bubble menu
// TODO:  Toggle show/hide bubble menu
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: 'gray',
    alignItems: 'center',
  },
  menu: {
    padding: 15,
    borderRadius: 50,
    justifyContent: 'space-between',
  },
  menuGeneralIcons: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    backgroundColor: '#FFF',
  },
  menuOpenBtn: {
    width: '100%',
    height: 50,
    alignItems: 'center',
  },
});

class Settings extends Component {

  state = {
    show: false,
  }

  _toggleMenuVisibility = () => {
    console.log('visibility!');
    this.setState(({ show }) => ({
      show: !show,
    }));
  }

  render() {
    const { show } = this.state;
    const items = this._renderItems();
    const openBtn = this._renderOpenBtn();

    return (
      <View style={styles.container}>
        <BubbleMenu
          items={items}
          openBtn={openBtn}
          show={show}
          style={styles.menu}
        />
      </View>
    );
  }

  _renderOpenBtn = () => (
    <TouchableOpacity
      onPress={this._toggleMenuVisibility}
      style={styles.menuOpenBtn}
    >
      <Icon
        name="menu"
        size={30}
        color="#fd0014"
      />
    </TouchableOpacity>
  )

  // TODO: Rename and change icons
  _renderItems() {
    const noop = () => {};
    const icons = [
      {
        name: 'hide',
        action: () => console.log('hide'),
      },
      {
        name: 'search',
        action: () => console.log('search'),
      },
      {
        name: 'send',
        action: () => console.log('send'),
      },
    ];

    const items = icons.map(({ name, action }, key) => (
      <TouchableOpacity
        onPress={action}
        key={key}
        style={styles.menuGeneralIcons}
      >
        <Icon
          name={name}
          size={30}
          color="#fd0014"
        />
      </TouchableOpacity>
    ));
    return items;
  }
}

module.exports = Settings;
