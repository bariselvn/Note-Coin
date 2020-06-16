import React from 'react';
import { StyleSheet, View, Text, ImageBackground, TextInput, Dimensions, TouchableOpacity, TouchableHighlight } from 'react-native';
import { KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);
export default class KayitScreen extends React.Component {
  constructor(props) {
    super(props);
    this.musteriEkle = this.musteriEkle.bind(this);
    this.state = {
      text: '',
      KullaniciAdi: '',
      KullaniciSoyad: '',
      TelNo: '',
      Tckn: '',
      Mail: '',
      Sifre: '',
      Bolum: '',
    }
  }
  musteriEkle() {
    console.log('girdim');
    let TcLenght = this.state.Tckn.length
    let telLenght = this.state.TelNo.length
    let sifreLenght = this.state.Sifre.length
    if (this.state.KullaniciAdi != '' && this.state.KullaniciAdi != null && this.state.KullaniciSoyadi != '' && this.state.KullaniciSoyadi != null && this.state.Tckn != '' && TcLenght === 11 && this.state.Mail != '' && this.state.TelNo != '' && telLenght === 11 && this.state.Sifre != '' && sifreLenght >= 6 && this.state.Bolum != '') {
      const kullanici = {
        KullaniciAdi: this.state.KullaniciAdi,
        KullaniciSoyadi: this.state.KullaniciSoyadi,
        Tckn: this.state.Tckn,
        Mail: this.state.Mail,
        TelNo: this.state.TelNo,
        Sifre: this.state.Sifre,
        Bolum: this.state.Bolum
      }
      console.log({ kullanici });

      fetch('https://notecoinhttpservice20191223091420.azurewebsites.net/api/kullanici', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(kullanici),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log('response object:', responseJson.results)
          if (responseJson != null) { this.props.navigation.navigate('LoginScreen') }
        })
        .catch((error) => {
          console.error(error);
        });
    }
    else {
      alert('HATALI VEYA EKSİK BİLGİ GİRDİNİZ')
    }
  }
  render() {
    let screenWidth = Dimensions.get('window').width;
    let screenHeight = Dimensions.get('window').height;
    return (<KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
      <DismissKeyboard>
        <View style={styles.container}>
          <TouchableHighlight style={{ marginLeft: 10 }}
            onPress={() => {
              this.props.navigation.navigate('LoginScreen');
            }}>
            <Ionicons name="ios-arrow-round-back" size={40} color="black" />
          </TouchableHighlight>
          <View style={{ flex: 0, height: 40, width: screenWidth, backgroundColor: '#3498db', borderRadius: 2, paddingHorizontal: 20, paddingVertical: 10, alignItems: 'center' }}>
            <Text style={{ fontSize: 22, color: 'white' }} >
              KAYIT OL
              </Text>
          </View>
          <ImageBackground source={require('../Images/screenbg.jpg')} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={styles.ınput}>
              <ScrollView>
                <TextInput
                  placeholder="Adınızı Giriniz"
                  placeholderTextColor='white'
                  value={this.state.KullaniciAdi}
                  returnKeyType={'next'}
                  onChangeText={(KullaniciAdi) => this.setState({ KullaniciAdi })}
                  style={styles.textınput}>
                </TextInput>
                <TextInput placeholder="Soyadınızı Giriniz"
                  placeholderTextColor='white'
                  value={this.state.KullaniciSoyadi}
                  onChangeText={(KullaniciSoyadi) => this.setState({ KullaniciSoyadi })}
                  style={styles.textınput}>
                </TextInput>
                <TextInput placeholder="Tc nizi giriniz"
                  maxLength={11}
                  keyboardType={'number-pad'}
                  placeholderTextColor='white'
                  value={this.state.Tckn}
                  onChangeText={(Tckn) => this.setState({ Tckn })}
                  style={styles.textınput}>
                </TextInput>
                <TextInput placeholder="Mail Adresinizi Giriniz"
                  value={this.state.Mail}
                  placeholderTextColor='white'
                  onChangeText={(Mail) => this.setState({ Mail })}
                  keybordType={"email-address"}
                  style={styles.textınput}>
                </TextInput>
                <TextInput placeholder="Numaranızı Giriniz"
                  value={this.state.TelNo}
                  placeholderTextColor='white'
                  keyboardType={'number-pad'}
                  maxLength={11}
                  onChangeText={(TelNo) => this.setState({ TelNo })}
                  style={styles.textınput}>
                </TextInput>
                <TextInput placeholder="En Az 6 Haneli Şifrenizi Giriniz"
                  value={this.state.Sifre}
                  placeholderTextColor='white'
                  onChangeText={(Sifre) => this.setState({ Sifre })}
                  maxLength={10}
                  style={styles.textınput}
                  secureTextEntry={true}
                ></TextInput>
                <TextInput placeholder="Bölümünüzü Giriniz"
                  value={this.state.Bolum}
                  placeholderTextColor='white'
                  onChangeText={(Bolum) => this.setState({ Bolum })}
                  style={styles.textınput}>
                </TextInput>
              </ScrollView>
            </View>
            <TouchableOpacity
              style={{
                height: 40,
                width: 200,
                backgroundColor: '#3498db',
                borderRadius: 10,
                paddingHorizontal: 20,
                paddingVertical: 10,
                alignItems: 'center'
              }}
              onPress={this.musteriEkle}>
              <Text style={{ fontSize: 16, color: 'white' }} > KAYIT OL</Text>
            </TouchableOpacity>
          </ImageBackground>
        </View>
      </DismissKeyboard>
    </KeyboardAvoidingView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
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
    color: 'white',
    marginTop: 25,
    borderRadius: 10,
    borderColor: 'white',
    borderWidth: 1,
  },
});