import React, {
  Component,
  PropTypes,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black',
  },
  controlText: {
    color: 'white',
  },
  button: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
  },
});

export default class ControlPanel extends Component {

  static propTypes = {
    closeDrawer: PropTypes.func,
  };

  render() {
    const { closeDrawer } = this.props;
    return (
      <ScrollView>
        <Text>Control Panel</Text>
        {/* <TouchableOpacity style={styles.button} onPress={closeDrawer}>
          <Text>Close Drawer</Text>
        </TouchableOpacity> */}
      </ScrollView>
    );
  }
}

