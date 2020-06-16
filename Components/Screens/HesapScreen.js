import React from 'react';
import MenuButton from '../Menu/MenuButton';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ImageBackground,
  ScrollView,
  TextInput,
  Modal,
  TouchableOpacity,
  TouchableHighlight
} from 'react-native';
import { KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { NavigationEvents } from 'react-navigation';
const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);
class HesapScreen extends React.Component {
  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.hesapEkle = this.hesapEkle.bind(this);
    this.state = {
      KullaniciID: props.KullaniciID,
      IbanNo: '',
      hesap: '',
    }
  }
  componentDidMount() {
    fetch("https://notecoinhttpservice20191223091420.azurewebsites.net/api/hesap/hesapID/" + this.state.KullaniciID).then(res => {

      if (res.ok) {
        res.json()
          .then(data => {
            this.setState({ hesap: data.results });
            console.log(data.results)
          })
      }
      else {
        return;
      }
    })
  }
  hesapEkle() {
    console.log('girdim');
    const hesabim = {
      KullaniciID: this.state.KullaniciID,
      IbanNo: this.state.IbanNo
    }
    console.log({ hesabim });
    if (this.state.hesap == '' && this.state.IbanNo != '') {
      fetch('https://notecoinhttpservice20191223091420.azurewebsites.net/api/hesap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(hesabim),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log('response object:', responseJson.results)
          if (responseJson != null) { this.props.navigation.navigate('PaketScreen') }
        })
        .catch((error) => {
          console.error(error);
        });
    }
    else {
      alert('IBAN NO BOŞ GEÇİLEMEZ')
    }
  }
  render() {
    let screenWidth = Dimensions.get('window').width;
    let screenHeight = Dimensions.get('window').height;
    return (<KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
      <DismissKeyboard>
        <View style={styles.container}>
          <TouchableHighlight style={{ marginLeft: 5 }}
            onPress={() => {
              this.props.navigation.navigate('PaketScreen');
            }}>
            <Ionicons name="ios-arrow-round-back" size={40} color="black" />
          </TouchableHighlight>
          <View style={{ flex: 0, height: 40, width: screenWidth, backgroundColor: '#3498db', borderRadius: 2, paddingHorizontal: 20, paddingVertical: 10, alignItems: 'center' }}>
            <Text style={{ fontSize: 22, color: 'white' }} >
              HESAP EKLE
              </Text>
          </View>
          <ImageBackground source={require('../Images/screenbg.jpg')} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ marginTop: 22 }}>
              <TextInput
                placeholder="IBAN NO Giriniz"
                placeholderTextColor='white'
                maxLength={26}
                value={this.state.IbanNo}
                onChangeText={(IbanNo) => this.setState({ IbanNo })}
                style={styles.textınput}></TextInput>
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
                onPress={this.hesapEkle}
              >
                <Text style={{ fontSize: 16, color: 'white' }} > IBAN EKLE</Text>
              </TouchableOpacity>
            </View>
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

  textınput: {
    height: 40,
    width: 200,
    borderRadius: 10,
    borderColor: 'white',
    borderWidth: 1,
  },
  flex: {
    flex: 0,
  },
});
const mapStateToProps = (state, ownProps) => ({
  KullaniciID: state.reducerUser.kullaniciId,

})
export default connect(mapStateToProps)(HesapScreen);