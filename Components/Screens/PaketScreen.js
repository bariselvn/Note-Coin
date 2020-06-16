import React from 'react';
import MenuButton from '../Menu/MenuButton';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  TextInput,
  Dimensions,
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
class PaketScreen extends React.Component {
  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.paketSatinAlma = this.paketSatinAlma.bind(this);
    this.state = {
      KullaniciID: props.KullaniciID,
      PaketID: props.KullaniciID,
      PaketAdi: props.PaketAdi,
      CoinSayisi: props.CoinSayisi,
      Fiyat: props.Fiyat,
      IbanNo: '',
      paketler: [],
      hesap: [],
    }
  }
  componentDidMount() {
    fetch("https://notecoinhttpservice20191223091420.azurewebsites.net/api/coinPaket").then(res => {
      if (res.ok) {
        res.json()
          .then(data => {
            this.setState({ paketler: data.results });
          })
      }
      else {
        return;
      }
    })
    fetch("https://notecoinhttpservice20191223091420.azurewebsites.net/api/hesap/hesapID/" + this.state.KullaniciID).then(res => {
      if (res.ok) {
        res.json()
          .then(data => {
            this.setState({ hesap: data.results });
            console.log({ 'hesabım': this.state.hesap })
          })
      }
      else {
        return;
      }
    })
  }
  paketSatinAlma(id) {
    let newid = id;
    this.setState({ PaketID: newid })
    const paketIslem = {
      PaketID: id,
      KullaniciID: this.props.KullaniciID
    }
    if (this.state.hesap != "") {
      fetch('https://notecoinhttpservice20191223091420.azurewebsites.net/api/paketIslem/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(paketIslem),
      }).then((response) => response.json())
        .then((responseJson) => {
          console.log('response object:', responseJson.results)
          alert('Paket Satın alım işlemi tamamlandı')

        })
        .catch((error) => {
          console.error(error);
        });
    }
    else {
      this.props.navigation.navigate('HesapScreen')
    }
  }
  render() {
    let screenWidth = Dimensions.get('window').width;
    let screenHeight = Dimensions.get('window').height;
    return (<KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
      <DismissKeyboard>
        <View style={styles.container}>
          <NavigationEvents onWillFocus={() => {
            this.componentDidMount();
          }} />
          <MenuButton navigation={this.props.navigation} />
          <View style={{ flex: 0, height: 40, width: screenWidth, backgroundColor: '#3498db', borderRadius: 2, paddingHorizontal: 20, paddingVertical: 10, alignItems: 'center' }}>
            <Text style={{ fontSize: 22, color: 'white' }} >
              PAKET YÜKLEME
              </Text>
          </View>
          <ImageBackground source={require('../Images/screenbg.jpg')} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={[styles.column, styles.destinations]} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ScrollView
                scrollEnabled
                showsHorizontalScrollIndicator={false}
                decelerationRate={0}
                scrollEventThrottle={16}
                snapToAlignment="center" >
                {this.state.paketler.map((l, i) => (
                  <TouchableOpacity activeOpacity={0.8} key={i} >
                    <ImageBackground
                      style={[styles.flex, styles.destination, styles.shadow]}
                      imageStyle={{ borderRadius: 12 }}
                      source={require('../Images/paketbg.jpg')} >
                      <View style={[styles.row, { justifyContent: 'space-between' }]}>
                        <View style={[styles.column, { flex: 2, paddingHorizontal: 18 }]}>
                          <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 20 }}>NOTE COIN</Text>
                          <Text style={{ color: '#FFF', fontSize: 18 }}>{l.PaketAdi}</Text>
                        </View>
                        <View style={{ flex: 0, justifyContent: 'center', alignItems: 'flex-end' }}>
                          <TouchableOpacity  >
                            <Ionicons name="ios-wallet" size={40} color="#3498db" onPress={() => this.paketSatinAlma(l.PaketID)} />
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View style={[styles.column, styles.destinationInfo, styles.shadow]}>
                        <Text style={{
                          color: '#3498db',
                          fontSize: 14 * 1.25,
                          fontWeight: '500',
                          paddingBottom: 8, textAlign: 'center',
                        }}
                        > {l.CoinSayisi} COIN</Text>
                      </View>
                      <View style={[styles.column, styles.destinationInfo2, styles.shadow]}>
                        <Text style={{
                          color: '#3498db',

                          fontSize: 16,
                          fontWeight: '500',
                          paddingBottom: 8, textAlign: 'center'
                        }}
                        >{l.Fiyat} TL </Text>
                      </View>
                    </ImageBackground>
                  </TouchableOpacity>
                ))
                }
              </ScrollView>
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
  destinations: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 30,
  },
  destinationInfo: {
    position: 'absolute',
    borderRadius: 12,
    bottom: 5,
    left: 30,
    backgroundColor: '#FFF',
    width: 150,
  },
  textınput: {
    height: 40,
    width: 200,
    marginTop: 25,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 2,
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
    width: 300,
    height: 200,
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
export default connect(mapStateToProps)(PaketScreen);