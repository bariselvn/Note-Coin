import React from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  TextInput,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import MenuButton from '../Menu/MenuButton';
import { connect } from 'react-redux';
import { NavigationEvents } from 'react-navigation';
import { KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);
const { width } = Dimensions.get('window')
class HesapGuncellemeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.hesapBilgiGuncelle = this.hesapBilgiGuncelle.bind(this);
    this.state = {
      KullaniciID: props.KullaniciID,
      kullanici: [],
      HesapID: props.HesapID,
      hesap: [],
      IbanNo: props.IbanNo,
      KullaniciAdi: props.KullaniciAdi,
      KullaniciSoyadi: props.KullaniciSoyadi,
      ıban: '',
    }
  };
  hesapBilgiGuncelle() {
    const hesapBilgi = {
      HesapID: this.state.HesapID,
      KullaniciID: this.props.KullaniciID,
      IbanNo: this.state.IbanNo,
    }
    let IbanNoLenght = this.state.IbanNo.length
    if (this.state.IbanNo != '' && this.state.IbanNo != null && IbanNoLenght === 26) {
      fetch('https://notecoinhttpservice20191223091420.azurewebsites.net/api/hesap', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(hesapBilgi),
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
  componentDidMount() {
    fetch("https://notecoinhttpservice20191223091420.azurewebsites.net/api/kullanici/" + this.state.KullaniciID).then(res => {
      if (res.ok) {
        res.json()
          .then(data => {
            this.setState({ kullanici: data.results })
          })
      }
      else {
        this.setState({ errormessage: "Satın Alınan Not Bulunumadı." });
        return;
      }
    }
    );

    fetch("https://notecoinhttpservice20191223091420.azurewebsites.net/api/hesap/hesapID/" + this.state.KullaniciID).then(res => {
      if (res.ok) {
        res.json()
          .then(data => {
            this.setState({ hesap: data.results });
            this.setState({ HesapID: this.state.hesap[0].HesapID });
            this.setState({ ıban: this.state.hesap[0].IbanNo });

            console.log('ıban object:', this.state.IbanNo)
          })
      }
      else {
        return;
      }
    })
  }
  render() {
    let screenWidth = Dimensions.get('window').width;
    let screenHeight = Dimensions.get('window').height;
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <DismissKeyboard>
          <View style={styles.container}>
            <NavigationEvents onWillFocus={() => {
              this.componentDidMount();
            }} />
            <MenuButton navigation={this.props.navigation} />
            <TouchableOpacity style={{ flex: 0, height: 40, width: screenWidth, backgroundColor: '#3498db', borderRadius: 10, paddingHorizontal: 20, paddingVertical: 10, alignItems: 'center' }}>
              <Text style={{ fontSize: 22, color: 'white' }} >
                HESAP GÜNCELLEME
              </Text>
            </TouchableOpacity>
            <View style={[styles.column, styles.destinations]} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <View activeOpacity={0.8} >
                <ImageBackground
                  style={[styles.flex, styles.destination, styles.shadow]} style={{ width: screenWidth, height: screenHeight - 110 }}
                  imageStyle={{ borderRadius: 12 }}
                  source={require('../Images/screenbg.jpg')} >
                  <View style={[styles.row, { justifyContent: 'space-between' }]}>
                    <View style={[styles.column, { flex: 1, paddingHorizontal: 18, alignItems: 'center', marginTop: 30 }]}>
                      <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 20 }}>NOTE COIN</Text>
                      <Text style={{ color: '#FFF', fontSize: 17, marginTop: 10 }}>{this.state.kullanici.KullaniciAdi} {this.state.kullanici.KullaniciSoyadi}</Text>
                    </View>
                  </View>
                  <View style={[styles.column, styles.destinationInfo, styles.shadow]}>
                    <View style={{
                      flex: 0
                      , height: 35
                      , width: 335
                      , backgroundColor: '#3498db'
                      , borderRadius: 10
                      , paddingHorizontal: 20
                      , paddingVertical: 10
                      , marginTop: 30
                      , position: 'relative'
                      , alignItems: 'center'
                    }}>
                      <Text style={{ fontSize: 18, color: 'white' }} >
                        IBAN : {this.state.ıban}
                      </Text>
                    </View>
                    <View style={[styles.ınput]}>

                      <TextInput placeholder="Numaranızı Giriniz"
                        value={this.state.IbanNo}
                        maxLength={26}
                        keyboardType={'number-pad'}
                        onChangeText={(IbanNo) => this.setState({ IbanNo })}
                        style={styles.textınput}></TextInput>
                    </View>
                    <View style={[styles.ınput]}>
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
                        onPress={this.hesapBilgiGuncelle} >
                        <Text style={{ fontSize: 16, color: 'white' }} > GÜNCELLE</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ImageBackground>
              </View>
            </View>
          </View>
        </DismissKeyboard>
      </KeyboardAvoidingView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalImage: {
    bottom: 0,
    marginBottom: 0,
    paddingBottom: 0,
    backgroundColor: '#000000'
  },
  destinations: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 30,
  },
  destinationInfo: {
    position: 'absolute',
    borderRadius: 12,
    bottom: 5,
    left: 20,
    right: 20,
    backgroundColor: '#FFF',
    width: 335,
    height: 420,
  },
  rating: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: 'bold'
  },
  row: {
    flexDirection: 'row'
  },
  flex: {
    flex: 0,
  },
  destination: {
    marginTop: 30,
    paddingHorizontal: 36,
    paddingVertical: 36 * 0.66,
    borderRadius: 12,
  },

  column: {
    flexDirection: 'column'
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  destinationInfo2: {
    position: 'absolute',
    borderRadius: 12,
    bottom: 5,
    left: 210,
    backgroundColor: '#FFF',
    width: 70,
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
    width: 250,
    borderRadius: 10,
    borderColor: '#3498db',
    borderWidth: 2,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    }
  }
});
const mapStateToProps = (state, ownProps) => ({
  KullaniciID: state.reducerUser.kullaniciId,

})
export default connect(mapStateToProps)(HesapGuncellemeScreen);