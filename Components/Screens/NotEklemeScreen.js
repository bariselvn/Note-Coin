import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Alert, ScrollView, TextInput, Dimensions, Modal, TouchableHighlight, ImageBackground } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as firebase from 'firebase';
import ApiKeys from '../ApiKey/ApiKeys';
import { Ionicons } from '@expo/vector-icons';
import MenuButton from '../Menu/MenuButton';
import { connect } from 'react-redux';
import { KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);
class NotEklemeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.notAciklamaEkle = this.notAciklamaEkle.bind(this);
    this.galeridenYukle = this.galeridenYukle.bind(this);
    this.notBilgiGuncelle = this.notBilgiGuncelle.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this)
    this.state = {
      image: null,
      loading: true,
      urli: "",
      NotID: props.NotID,
      notid: '',
      gelenid: '',
      imageBrowserOpen: false,
      text: "",
      photos: [],
      Aciklama: '',
      Coin: '',
      NotYol: '',
      modalVisible: false,
    };
    if (!firebase.apps.length) {
      firebase.initializeApp(ApiKeys.FirebaseConfig);
    }
  }
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  imageBrowserCallback = (callback) => {
    callback.then((photos) => {
      console.log(photos)
      this.setState({
        imageBrowserOpen: false,
        photos
      })
    }).catch((e) => console.log(e))
  }
  notBilgiGuncelle() {
    if (this.state.urli != '') {
      const notBilgi = {
        NotID: this.state.gelenid,
        KullaniciID: this.props.KullaniciID,
        NotYol: this.state.urli
      }
      fetch('https://notecoinhttpservice20191223091420.azurewebsites.net/api/not', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(notBilgi),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log('response object:', responseJson)
          if (responseJson != null) { this.setModalVisible(!this.state.modalVisible), this.props.navigation.navigate('NotScreen') }

        })
        .catch((error) => {
          console.error(error);
        });
    }
    else {
      alert('LÜTFEN BİR FOTOĞRAF SEÇİNİZ !')
    }
  }
  galeridenYukle = async () => {
    let result = await ImagePicker.launchImageLibraryAsync();

    if (!result.cancelled) {
      this.uploadImage(result.uri, this.state.gelenid)
        .then(() => {
          console.log("yükleme tamamlandı");
          Alert.alert("Yükleme Tamamlandı");
          this.downloadImage();
        })
        .catch((error) => {
          console.log(error);
          Alert.alert(error);
        });
    }
  }
  uploadImage = async (uri, notid) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    var ref = firebase.storage().ref().child("images/" + notid);
    return ref.put(blob);
  }
  downloadImage = async () => {
    const imageRef = firebase.storage().ref().child("images/" + this.state.gelenid);
    const url = imageRef.getDownloadURL().then((url) => {
      console.log("indirme tamamlandı");
      console.log(url);
      this.setState({
        urli: url,
        loading: false
      })
    }
    )
      .catch((error) => {
        console.log(error);
        Alert.alert(error);
      });
  }
  notAciklamaEkle() {
    if (this.state.Aciklama != '' && this.state.Coin != '') {
      const not = {
        KullaniciID: this.props.KullaniciID,
        Aciklama: this.state.Aciklama,
        Coin: this.state.Coin,
      }
      console.log({ not });
      fetch('https://notecoinhttpservice20191223091420.azurewebsites.net/api/not', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(not),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log('response object:', responseJson.results)
          this.setState({ gelenid: responseJson.results.NotID });
          console.log("id", this.state.gelenid);
          console.log("notıdgelen", responseJson.results.NotID);
          if (responseJson != null) {
            this.setState({ modalVisible: true })
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
    else {
      alert('HATALI VEYA EKSİK BİLGİ GİRDİNİZ!')
    }
  }
  render() {
    const { urli } = this.state;
    let screenWidth = Dimensions.get('window').width;
    let screenHeight = Dimensions.get('window').height;;
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <DismissKeyboard>
          <View style={styles.container}>
            <MenuButton navigation={this.props.navigation} />
            <ImageBackground source={require('../Images/screenbg.jpg')} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ScrollView>
                <View style={{ alignContent: 'center', alignItems: 'center', marginTop: 50, borderRadius: 2, borderColor: '' }}>
                  <Ionicons name="ios-book" size={54} color="white" />
                  <Text style={{ fontSize: 24, color: 'white' }} > Not Yükleme </Text>
                </View>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <View style={styles.ınput}>
                    <TextInput
                      placeholder="Notunuza Açıklama Ekleyiniz"
                      placeholderTextColor='white'
                      value={this.state.Aciklama}
                      maxLength={150}
                      onChangeText={(Aciklama) => this.setState({ Aciklama })}
                      style={styles.textınput}>
                    </TextInput>
                    <TextInput
                      placeholder="Notunuzun Coin Adedini Giriniz"
                      placeholderTextColor='white'
                      value={this.state.Coin}
                      keyboardType={'number-pad'}
                      maxLength={3}
                      onChangeText={(Coin) => this.setState({ Coin })}
                      style={styles.textınput}>
                    </TextInput>
                  </View>
                  <TouchableOpacity
                    style={{
                      marginTop: 25,
                      height: 40,
                      marginBottom: 250,
                      width: 200,
                      backgroundColor: '#3498db',
                      borderRadius: 10,
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      alignItems: 'center'
                    }}
                    onPress={this.notAciklamaEkle} >
                    <Text style={{ fontSize: 16, color: 'white' }} > DEVAM ET</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </ImageBackground>
            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.modalVisible}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
              }}>
              <View style={{ marginTop: 22 }}>
                <View style={{ flex: 0, height: 40, width: screenWidth, backgroundColor: '#3498db', borderRadius: 2, paddingHorizontal: 20, paddingVertical: 10, alignItems: 'center' }}>
                  <Text style={{ fontSize: 22, color: 'white' }} >
                    NOT YÜKLEME 2.ADIM
              </Text>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center' }} >
                  <TouchableOpacity style={styles.uploadArea} onPress={this.galeridenYukle} >
                    <Ionicons name="ios-images" size={54} color="black" />
                    <Text style={{ fontSize: 16 }} > Galeriden Yükle </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      marginTop: 50,
                      height: 40,
                      marginBottom: 250,
                      width: 200,
                      backgroundColor: '#3498db',
                      borderRadius: 10,
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      alignItems: 'center'
                    }}
                    onPress={this.notBilgiGuncelle}
                  >
                    <Text style={{ fontSize: 16, color: 'white' }} > NOTU EKLE</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        </DismissKeyboard>
      </KeyboardAvoidingView>

    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  uploadArea: {
    alignItems: "center",
    backgroundColor: "#3498db",
    width: 160,
    height: 90,
    marginTop: 50,
    padding: 15,
    borderRadius: 25
  },
  ınput: {
    borderRadius: 10,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textınput: {
    height: 40,
    width: 220,
    marginTop: 25,
    borderRadius: 10,
    borderColor: 'white',
    borderWidth: 1,
  },

})
const mapStateToProps = (state, ownProps) => ({
  KullaniciID: state.reducerUser.kullaniciId,
})
export default connect(mapStateToProps)(NotEklemeScreen);