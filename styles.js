
import {
  StyleSheet,
} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  menu: {
    flex: 1,
    margin: 'auto',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 40,
    textAlign: 'center',
    margin: 10,
  },
  welcomeLarge: {
    fontSize: 80,
    textAlign: 'center',
    margin: 15,
  },
  textM: {
    fontSize: 40,
    textAlign: 'center',
    margin: 8,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  basicButton: {
    textAlign: 'center',
  },
  selectButton: {
    marginBottom: 10,
    width: 240,
    alignItems: 'center',
    backgroundColor: '#2196F3',
    borderStyle: 'solid',
    borderColor: 'black',
    borderRadius: 35,
  },
  uploadButton: {
    marginBottom: 30,
    width: 240,
    alignItems: 'center',
    backgroundColor: 'purple',
    borderStyle: 'solid',
    borderColor: 'black',
    borderRadius: 35,
  },
  uploadButtonDisabled: {
    marginBottom: 30,
    width: 240,
    alignItems: 'center',
    backgroundColor: 'lightgray',
    borderStyle: 'solid',
    borderColor: 'black',
    borderRadius: 35,
  },
  buttonText: {
    padding: 20,
    color: 'white',
    fontSize: 22,
  },
});
