// TODO: Cleanup
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  CameraRoll,
  Button,
} from 'react-native';
import { RNS3 } from 'react-native-aws3';
import AwsOptions from './secrets';

// TODO: import styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  basicButton: {
    textAlign: 'center',
  },
});

// const AwsOptions = {
//   keyPrefix: 'uploads/petsbox/',
//   bucket: '*****',
//   region: '******',
//   accessKey: '*************',
//   secretKey: '********************',
//   successActionStatus: 201,
// };

// TODO: Add config menu
export default class App extends Component {

  // TODO: Make limit configurable
  state = {
    selectedPhotos: [],
    isUploading: false,
    fileLimit: 50,
  }
  getPhotos = () => {
    return new Promise((resolve, reject) => {
      CameraRoll.getPhotos({
        first: this.state.fileLimit,
        assetType: 'All',
      })
      .then(r => {
        resolve(r.edges);
      })
      .catch(e => reject(e));
    });
  }

  toggleModal = () => {
    this.setState({ modalVisible: !this.state.modalVisible });
  }

  upload = async (file) => {
    return new Promise(async (resolve, reject) => {
      const imgURI = file.node.image.uri;
      this.setState({ uploadingFile: imgURI });
      const timeStamp = file.node.timestamp;
      const fileToUpload = {
        uri: imgURI,
        name: `${imgURI.substr(imgURI.lastIndexOf('/') + 1, imgURI.length)}_${timeStamp}`,
        type: file.node.type,
      };
      try {
        const response = await RNS3.put(fileToUpload, AwsOptions);
        if (response.status !== 201) {
          reject(response);
        }
        resolve();
      } catch (e) { reject(e); }
    });
  }

  uploadPhotos = async () => {
    const photosToUpload = this.state.selectedPhotos;
    this.setState({ isUploading: true });
    try {
      await Promise.all(photosToUpload.map(p => this.upload(p)));
      console.log('All done! :)');
    } catch (e) {
      console.log('something went wrong while uploading: ', e);
    } finally {
      this.setState({ isUploading: false, selectedPhotos: [] });
    }
  }

  handleSelectPhotosClick = async () => {
    const fetchedPhotos = await this.getPhotos();
    this.setState({ selectedPhotos: fetchedPhotos });
  }

  handleUploadClick = async () => {
    // TODO: UI Feedback improvements
    this.uploadPhotos();
  }

  renderUploadProgress() {
    return this.state.isUploading &&
      <Text>
        Uploading: {this.state.uploadingFile}
      </Text>;
  }

  render() {
    const selectText = this.state.selectedPhotos.length ?
      `${this.state.selectedPhotos.length} photos selected` :
      'Select photos';

    return (
      <View style={styles.container}>
        <Text style={styles.welcomeLarge}>
         📦
        </Text>
        <Text style={styles.welcome}>
          Welcome to Petsbox!
        </Text>
        <Button
          title={selectText}
          buttonStyle={styles.basicButton}
          onPress={this.handleSelectPhotosClick}
        />
         <Button
          buttonStyle={styles.basicButton}
          color="#841584"
          title="Upload to ☁️"
          onPress={this.handleUploadClick}
          disabled={!this.state.selectedPhotos.length}
        />
        {this.renderUploadProgress()}
      </View>
    );
  }
}
