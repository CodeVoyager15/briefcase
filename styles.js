
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
    fontSize: 50,
    textAlign: 'center',
    margin: 15,
  },
  textM: {
    fontSize: 30,
    textAlign: 'center',
    margin: 8,
  },
  textMW: {
    fontSize: 30,
    textAlign: 'center',
    margin: 8,
    color: '#40C4FF',
  },
  textS: {
    fontSize: 15,
    textAlign: 'center',
    margin: 4,
    color: 'white',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  inputTextWhite: {
    height: 40,
    borderColor: 'gray',
    color: 'white',
    borderWidth: 1,
  },
  basicButton: {
    textAlign: 'center',
  },
  selectButton: {
    marginBottom: 10,
    marginTop: 10,
    width: 200,
    alignItems: 'center',
    backgroundColor: '#2196F3',
    borderStyle: 'solid',
    borderColor: 'black',
    borderRadius: 35,

  },
  uploadButton: {
    marginBottom: 30,
    width: 200,
    alignItems: 'center',
    backgroundColor: 'purple',
    borderStyle: 'solid',
    borderColor: 'black',
    borderRadius: 35,
  },
  uploadButtonDisabled: {
    marginBottom: 30,
    width: 200,
    alignItems: 'center',
    backgroundColor: 'lightgray',
    borderStyle: 'solid',
    borderColor: 'black',
    borderRadius: 35,
  },
  buttonText: {
    padding: 20,
    color: 'white',
    fontSize: 10,
  },
  settingsModal: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    opacity: 0.7,
    backgroundColor: 'black',
  },
});
