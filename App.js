// TODO: Cleanup
// TODO: Option to delete photos after upload
import React, { Component } from 'react';
import sleep from 'sleep-promise';
import {
  Platform,
  Text,
  View,
  CameraRoll,
  Button,
  Slider,
  TouchableOpacity,
  Vibration,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import moment from 'moment';
import { RNS3 } from 'react-native-aws3';
import styles from './styles';
import AwsOptions from './secrets';
import Settings from './Settings';

const VIBRATION_DURATION = 10000;
const VIBRATION_PATTERN = [500, 1000, 500];


export default class App extends Component {

  // TODO: Make limit configurable
  state = {
    selectedPhotos: [],
    selectedVideos: [],
    isUploading: false,
    fileLimit: 5,
    filesUploaded: 0,
    filesSkipped: [],
    showProgress: false,
    uploadCompleted: false,
    isModalVisible: false,
    customAwsOptions: {},
  }

  _showModal = () => {
    this.setState({ isModalVisible: true });
  }
  handleCloseModal = () => {
    console.log('custom aws ', this.state.customAwsOptions);
    this.setState({ isModalVisible: false });
  }

  getPhotos = () => {
    return new Promise((resolve, reject) => {
      CameraRoll.getPhotos({
        first: this.state.fileLimit,
        // FIXME: Currently, RN has a bug on android and assetType 'All'
        // does not return Videos. This only happend on Android
        // https://github.com/facebook/react-native/pull/16429
        assetType: 'All',
      })
      .then(r => {
        resolve(r.edges);
      })
      .catch(e => reject(e));
    });
  }

  getVideos = () => {
    return new Promise((resolve, reject) => {
      CameraRoll.getPhotos({
        first: this.state.fileLimit,
        assetType: 'Videos',
      })
      .then(r => {
        resolve(r.edges);
      })
      .catch(e => reject(e));
    });
  }

  fileSkipped = (file) => {
    console.warn('file skipped: ', file);
    this.setState({
      filesSkipped: this.state.filesSkipped.concat(file),
    });
  }

  toggleModal = () => {
    this.setState({ modalVisible: !this.state.modalVisible });
  }

  // TODO: use https://github.com/devfd/react-native-geocoder
  // to tag the location
  getLocation = () => {
    return 'mordor';
    // return new Promise((resolve, reject) => {
    //   geocoder.reverseGeocode(33.7489, -84.3789, (err, data) => {
    //   // do something with data
    //     console.log('resolved loc: ', data);
    //     if (err) reject(err);
    //     resolve(data);
    //   });
    // });
  };

  getFileName = (file) => {
    const { uri } = file.node.image;
    const { type, coordinates } = file.node;
    const name = `${uri.substr(uri.lastIndexOf('/') + 1, uri.length)}`;
    const fileName = coordinates ?
      `${name}@${this.getLocation()}` :
      name;
    const suffix = type.split('/')[1];
    return `${fileName}.${suffix}`;
  }

  upload = async (file) => {
    return new Promise(async (resolve) => {
      const imgURI = file.node.image.uri;
      const fileToUpload = {
        uri: imgURI,
        name: this.getFileName(file),
        type: file.node.type,
      };
      try {
        const folderPrefix = file.folder;
        const prefixedAwsOptions = {
          ...AwsOptions,
          // ...this.state.customAwsOptions, // Uncomment to override
          keyPrefix: AwsOptions.keyPrefix + folderPrefix,
        };
        const response = await RNS3.put(fileToUpload, prefixedAwsOptions);
        if (response.status !== 201) {
          this.fileSkipped({ file, error: response });
          resolve();
        }
        this.setState({
          filesUploaded: ++this.state.filesUploaded,
        });
        resolve();
      } catch (e) {
        this.fileSkipped({ file, error: e });
      } finally {
        resolve();
      }
    });
  }

  getPrefixFolderByDate = (date) => {
    const year = moment.unix(date).format('YYYY');
    const month = moment.unix(date).format('MMMM');
    return `${year}/${month}/`;
  }

  organizeFiles = (files) => {
    const result = files.map(file => {
      const date = file.node.timestamp;
      const prefix = this.getPrefixFolderByDate(date);
      return {
        ...file,
        folder: prefix,
      };
    });
    return result;
  }

  onUploadCompleted = () => {
    Vibration.vibrate(VIBRATION_PATTERN);
    if (this.state.filesSkipped.length) {
      console.log('Files skipped with errors: ', this.state.filesSkipped);
    }
    this.setState({
      isUploading: false,
      selectedPhotos: [],
      uploadCompleted: true,
    });
    console.log('All done! :)');
  }

  uploadPhotos = async () => {
    const photosToUpload = this.organizeFiles(this.state.selectedPhotos);
    await Promise.all(photosToUpload.map(p => this.upload(p)));
    // this.onUploadCompleted();
  }

  uploadVideos = async () => {
    const videosToUpload = this.organizeFiles(this.state.selectedVideos);
    await Promise.all(videosToUpload.map(p => this.upload(p)));
    this.onUploadCompleted();
  }

  handleSelectPhotosClick = async () => {
    const fetchedPhotos = await this.getPhotos();
    this.setState({
      selectedPhotos: fetchedPhotos,
      showProgress: true,
    });
  }

  handleSelectVideosClick = async () => {
    const fetchedVideos = await this.getVideos();
    this.setState({
      selectedVideos: fetchedVideos,
      showProgress: true,
    });
  }

  handleUploadClick = async () => {
    // TODO: UI Feedback improvements
    console.log('uploading media');
    this.setState({ isUploading: true, filesUploaded: 0, filesSkipped: [] });
    await sleep(10);
    await this.uploadPhotos();
    await this.uploadVideos();
  }

  renderUploadProgress() {
    const {
      filesUploaded,
      selectedPhotos,
      selectedVideos,
      uploadCompleted,
      filesSkipped } = this.state;
    let progressText = '';
    if (!uploadCompleted) {
      progressText = filesUploaded ?
      `Files uploaded: ${filesUploaded} / ${selectedPhotos.length + selectedVideos.length}` :
      'Files prepared for upload';
    } else {
      progressText = `${filesUploaded} files uploaded. ${filesSkipped.length} files skipped.`;
    }

    return this.state.showProgress &&
      <Text>
        {progressText}
      </Text>;
  }

  renderSkippedFiles() {
    const { filesSkipped } = this.state;
    return !!filesSkipped.length &&
      (
        <ScrollView>
          filesSkipped.map(info =>
            <Text>
              info.title : info.error
            </Text>
          )
        </ScrollView>
      );
  }

  handleMenuPress =() => {
    console.log('menu pressed');
  }

  photosNumberChange = (value) => {
    this.setState({
      fileLimit: value,
    });
  }

  // const AwsOptions = {
//   keyPrefix: 'uploads/petsbox/',
//   bucket: '*****',
//   region: '******',
//   accessKey: '*************',
//   secretKey: '********************',
//   successActionStatus: 201,
// };
// TODO: Add config menu

  renderSettingsModal() {
    return (
      <View style={{ display: 'flex', marginRight: 'auto', margin: 20 }}>
            <TouchableOpacity onPress={this._showModal}>
              <Icon
                name="menu"
                size={25}
                color="black"
                style={{ marginTop: 40 }}
              />
            </TouchableOpacity>
            <Modal style={styles.settingsModal} isVisible={this.state.isModalVisible}>
              <View >
                <TouchableOpacity
                  onPress={this.handleCloseModal}
                >

                <Icon
                name="settings"
                size={25}
                color="white"
                style={{ alignSelf: 'center' }}
                >
                </Icon>
                <Text style={styles.textMW}> AWS S3 Settings </Text>
                <Text style={styles.textS}> S3 Bucket name </Text>
                <TextInput
                  style={styles.inputTextWhite}
                  onChangeText={(bucket) => this.setState({
                    customAwsOptions: {
                      ...this.state.customAwsOptions,
                      bucket,
                    },
                  })}
                  value={this.state.bucket}
                />

                <Text style={styles.textS}> Region </Text>
                <TextInput
                  style={styles.inputTextWhite}
                  onChangeText={(region) => this.setState({
                    customAwsOptions: {
                      ...this.state.customAwsOptions,
                      region,
                    },
                  })}
                  value={this.state.region}
                />
                <Text style={styles.textS}> Access Key </Text>
                <TextInput
                  style={styles.inputTextWhite}
                  onChangeText={(accessKey) => this.setState({
                    customAwsOptions: {
                      ...this.state.customAwsOptions,
                      accessKey,
                    },
                  })}
                  value={this.state.accessKey}
                />
                <Text style={styles.textS}> Secret Key </Text>
                <TextInput
                  style={styles.inputTextWhite}
                  secureTextEntry={true}
                  onChangeText={(secretKey) => this.setState({
                    customAwsOptions: {
                      ...this.state.customAwsOptions,
                      secretKey,
                    },
                  })}
                  value={this.state.secretKey}
                />

                <View style={styles.selectButton}>
                  <Text style={styles.textS}>Save & Close</Text>
                </View>
                </TouchableOpacity>
              </View>
            </Modal>
          </View>
    );
  }

  render() {
    const { selectedPhotos, selectedVideos, isUploading, fileLimit } = this.state;
    const selectPhotosText = selectedPhotos.length ?
      `${selectedPhotos.length} photos selected` :
      'Select photos';

    const selectVideosText = selectedVideos.length ?
      `${selectedVideos.length} videos selected` :
      'Select videos';

    const uploadText = isUploading ?
      'Uploading to ☁️' :
      'Upload to ☁️';

    const uploadingBtnStyle = isUploading ?
      styles.uploadButtonDisabled :
      styles.uploadButton;


    return (
        <View style={styles.container}>
          {this.renderSettingsModal()}
          <Text style={styles.welcomeLarge}>
            📦
          </Text>

          <Text style={styles.welcome}>
            Welcome to Briefcase!
          </Text>
          <Text style={{ margin: 20 }}>
            Select number of files to upload : {fileLimit}
          </Text>
          <Slider
          maximumValue={2000}
          minimumValue={1}
          step={10}
          onValueChange={this.photosNumberChange}
          onSlidingComplete={this.photosNumberChange}
          style={{ width: 300, height: 50, marginBottom: 60 }}
          />
          <TouchableOpacity
            onPress={this.handleSelectPhotosClick}
            underlayColor="white"
          >
            <View style={styles.selectButton}>
              <Text style={styles.buttonText}>{selectPhotosText}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.handleSelectVideosClick}
            underlayColor="white"
          >
            <View style={styles.selectButton}>
              <Text style={styles.buttonText}>{selectVideosText}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            underlayColor="white"
            disabled={!!isUploading}
            onPress={this.handleUploadClick}
          >
            <View style={uploadingBtnStyle}>
              <Text style={styles.buttonText}>{uploadText}</Text>
            </View>
          </TouchableOpacity>
          {this.renderUploadProgress()}
        </View>
    );
  }
}
