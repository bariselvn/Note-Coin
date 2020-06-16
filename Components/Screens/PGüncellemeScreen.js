import React from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert, ScrollView, Modal, Dimensions, TouchableHighlight } from 'react-native';
import * as firebase from 'firebase';
import * as ImagePicker from 'expo-image-picker';
import ApiKeys from '../ApiKey/ApiKeys';
import { connect } from 'react-redux';
import MenuButton from '../Menu/MenuButton';
import { NavigationEvents } from 'react-navigation';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import * as  Permissions from 'expo-permissions';
const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);
class PGüncellemeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      urli: "xdxd",
      modalVisible: false,
      photos: [],
      imageBrowserOpen: false,
      kullanici: [],
      KullaniciID: props.KullaniciID,
      Tckn: props.Tckn,
      tc: '',
      Mail: props.Mail,
      TelNo: props.TelNo,
      PpYol: props.PpYol,
      KullaniciAdi: props.KullaniciAdi,
      KullaniciSoyadi: props.KullaniciSoyadi,
      Bolum: props.Bolum
    };
    if (!firebase.apps.length) {
      firebase.initializeApp(ApiKeys.FirebaseConfig);
    }
    this.setModalVisible = this.setModalVisible.bind(this);
    this.avatarChange = this.avatarChange.bind(this);
    this.kullaniciBilgiGuncelle = this.kullaniciBilgiGuncelle.bind(this)
    this.alert = this.alert.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this);
  }
  askPermissionsAsync = async () => {
    await Permissions.askAsync(Permissions.CAMERA);
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
  };
  componentDidMount() {
    fetch("https://notecoinhttpservice20191223091420.azurewebsites.net/api/kullanici/" + this.state.KullaniciID).then(res => {
      if (res.ok) {
        res.json()
          .then(data => {
            this.setState({ kullanici: data.results });
            this.setState({ tc: this.state.kullanici.Tckn });
            this.setState({ Mail: this.state.kullanici.Mail });
            this.setState({ TelNo: this.state.kullanici.TelNo });
            this.setState({ Sifre: this.state.kullanici.Sifre });
            this.setState({ Bolum: this.state.kullanici.Bolum });
            if (this.state.kullanici.PpYol != null) {
              this.setState({ urli: this.state.kullanici.PpYol })
            };
          })
      }
      else {
        return;
      }
    })
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
  kameradanYukle = async () => {
    await this.askPermissionsAsync();
    let result = await ImagePicker.launchCameraAsync({
      aspect: [4, 3],
      base64: false,
      quality: 1
    });
    if (!result.cancelled) {
      this.uploadImage(result.uri, this.state.tc)
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
  avatarChange = async () => {
    let result = await ImagePicker.launchImageLibraryAsync();
    if (!result.cancelled) {
      this.uploadImage(result.uri, this.state.tc)
        .then(() => {
          console.log("yükleme tamamlandı");
          Alert.alert("Profil Resminiz Değiştirildi...");
          this.downloadImage();
        })
        .catch((error) => {
          console.log(error);
          Alert.alert(error);
        });
    }
  }
  alert() {
    Alert.alert(
      'Resim Yükleme',
      'Yükleme Şeklinizi Seçiniz!',
      [
        { text: 'Galeriden Yükle', onPress: () => this.avatarChange() },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'Kameradan Yükle', onPress: () => this.kameradanYukle() },
      ],
      { cancelable: false },
    );
  }
  kullaniciBilgiGuncelle() {
    const kullaniciBilgi = {
      KullaniciID: this.props.KullaniciID,
      Mail: this.state.Mail,
      TelNo: this.state.TelNo,
      Sifre: this.state.Sifre,
      Bolum: this.state.Bolum,
      PpYol: this.state.urli
    }
    let telLenght = this.state.TelNo.length
    let sifreLenght = this.state.Sifre.length
    if (this.state.Mail != '' && this.state.TelNo != '' && this.state.Sifre != '' && this.state.Bolum != '' && telLenght === 11 && sifreLenght >= 6) {
      fetch('https://notecoinhttpservice20191223091420.azurewebsites.net/api/kullanici', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(kullaniciBilgi),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log('response object:', responseJson)
          if (responseJson != null) { this.props.navigation.navigate('ProfilScreen') }
        })
        .catch((error) => {
          console.error(error);
        });
    }
    else {
      alert('HATALI VEYA EKSİK BİLGİ GİRDİNİZ !')
    }
  }
  uploadImage = async (uri, imageName) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    var ref = firebase.storage().ref().child("images/" + imageName);
    return ref.put(blob);
  }
  downloadImage = async () => {
    const imageRef = firebase.storage().ref().child("images/" + this.state.tc);
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

  render() {
    const { urli } = this.state;
    let screenWidth = Dimensions.get('window').width;
    let screenHeight = Dimensions.get('window').height;
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
        <DismissKeyboard>
          <View style={{ flex: 1 }}>
            <NavigationEvents onWillFocus={() => {
              this.componentDidMount();
            }} />
            <MenuButton navigation={this.props.navigation} />
            <View style={{ flex: 0, height: 40, width: screenWidth, backgroundColor: '#3498db', borderRadius: 10, paddingHorizontal: 20, paddingVertical: 10, alignItems: 'center' }}>
              <Text style={{ fontSize: 22, color: 'white' }} >
                PROFİL DÜZENLEME
              </Text>
            </View>
            <View style={{ flex: 1, backgroundColor: "white", alignItems: 'center' }}>
              <TouchableOpacity style={{ height: 100, width: 100, borderRadius: 50, }} onPress={this.alert
              }>
                <View
                  style={{ height: 100, width: 100, backgroundColor: '#3498db', borderRadius: 50, marginTop: 25 }}>
                  <Image
                    style={{ height: 100, width: 100, borderRadius: 50 }}
                    source={{ uri: urli }} />
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 16, color: 'white' }} >{this.state.kullanici.KullaniciAdi}</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 2, backgroundColor: '#3498db' }}>
              <ScrollView>
                <View style={{ flexDirection: 'column', flex: 2 }}>
                  <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', marginTop: 10, color: 'white' }}>
                    BİLGİLERİM
                  </Text>
                </View>
                <View style={{ flexDirection: "row", flex: 2, justifyContent: 'space-around' }} style={styles.ınput}>
                  <TextInput placeholder="Mail Adresinizi Giriniz"
                    placeholderTextColor='white'
                    value={this.state.Mail}
                    onChangeText={(Mail) => this.setState({ Mail })}
                    style={styles.textınput}>
                  </TextInput>
                  <TextInput placeholder="Numaranızı Giriniz"
                    placeholderTextColor='white'
                    value={this.state.TelNo}
                    keyboardType={'number-pad'}
                    maxLength={11}
                    onChangeText={(TelNo) => this.setState({ TelNo })}
                    style={styles.textınput}>
                  </TextInput>
                  <TextInput placeholder="Şifrenizi Giriniz"
                    placeholderTextColor='white'
                    value={this.state.Sifre}
                    onChangeText={(Sifre) => this.setState({ Sifre })}
                    maxLength={10}
                    style={styles.textınput}
                    secureTextEntry={true}>
                  </TextInput>
                  <TextInput placeholder="Bölümünüzü Giriniz"
                    placeholderTextColor='white'
                    value={this.state.Bolum}
                    onChangeText={(Bolum) => this.setState({ Bolum })}
                    style={styles.textınput}>
                  </TextInput>
                </View>
              </ScrollView>
            </View>
            <View style={{ flex: 0, backgroundColor: 'white', justifyContent: 'space-around', alignItems: 'center' }}>
              <TouchableOpacity
                style={{
                  height: 40,
                  marginTop: 10,
                  width: 200,
                  backgroundColor: '#3498db',
                  borderRadius: 10,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  alignItems: 'center'
                }}
                onPress={this.kullaniciBilgiGuncelle}>
                <Text style={{ fontSize: 16, color: 'white' }} >Onayla</Text>
              </TouchableOpacity>
            </View>
            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.modalVisible}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
              }}>
              <View style={{ marginTop: 22 }}>
                <View>
                  <TouchableHighlight
                    onPress={() => {
                      this.setModalVisible(!this.state.modalVisible);
                    }}>
                    <Ionicons name="ios-arrow-round-back" size={40} color="black" />
                  </TouchableHighlight>
                </View>
              </View>
            </Modal>
          </View>
        </DismissKeyboard>
      </KeyboardAvoidingView>
    );
  }
}
const styles = StyleSheet.create({
  ınput: {
    borderRadius: 10,
    flex: 1,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textınput: {
    height: 40,
    width: 200,
    marginTop: 25,
    borderRadius: 10,
    borderColor: 'white',
    borderWidth: 1,
    color: 'white'
  },
});
const mapStateToProps = (state, ownProps) => ({
  KullaniciID: state.reducerUser.kullaniciId,
})
export default connect(mapStateToProps)(PGüncellemeScreen);