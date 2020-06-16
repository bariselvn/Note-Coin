import React from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import MenuButton from '../Menu/MenuButton';
import { connect } from 'react-redux';
import { NavigationEvents } from 'react-navigation';

const { width } = Dimensions.get('window')
class CoinTlScreen extends React.Component {
  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.coinBilgiGuncelle = this.coinBilgiGuncelle.bind(this);
    this.state = {
      KullaniciID: props.KullaniciID,
      CoinID: '',
      kullanici: [],
      coinHesabim: [],
      errormessage: '',
      TL: '',
      KullaniciAdi: props.KullaniciAdi,
      KullaniciSoyadi: props.KullaniciSoyadi,
      CoinBakiye: ''
    }
  };
  coinBilgiGuncelle() {
    if (this.state.CoinBakiye > 0) {
      const coinHesapBilgi = {
        KullaniciID: this.props.KullaniciID,
        CoinID: this.state.CoinID,
        CoinBakiye: 0,
      }
      fetch('https://notecoinhttpservice20191223091420.azurewebsites.net/api/coinHesap', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(coinHesapBilgi),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log('response object:', responseJson)
          if (responseJson != null) { alert('DÖNÜŞTÜRME İŞLEMİ BAŞARILI'), this.props.navigation.navigate('PaketScreen') }

        })
        .catch((error) => {
          console.error(error);
        });
    }
    else {
      alert('COIN BAKİYENİZ YETERSİZ')
      this.props.navigation.navigate('PaketScreen')
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
    fetch("https://notecoinhttpservice20191223091420.azurewebsites.net/api/coinHesap/hesap/" + this.state.KullaniciID).then(res => {

      if (res.ok) {
        res.json()
          .then(data => {
            this.setState({ CoinBakiye: data.results });
            this.setState({ TL: this.state.CoinBakiye / 10 });
          })
      }
      else {
        return;
      }
    })
    fetch("https://notecoinhttpservice20191223091420.azurewebsites.net/api/coinHesap/chesap/" + this.state.KullaniciID).then(res => {
      if (res.ok) {
        res.json()
          .then(data => {
            this.setState({ CoinID: data.results });
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
      <View style={styles.container}>
        <NavigationEvents onWillFocus={() => {
          this.componentDidMount();
        }} />
        <MenuButton navigation={this.props.navigation} />
        <View style={{ flex: 0, height: 40, width: screenWidth, backgroundColor: '#3498db', borderRadius: 10, paddingHorizontal: 20, paddingVertical: 10, alignItems: 'center' }}>
          <Text style={{ fontSize: 22, color: 'white' }} >
            COİN DÖNÜŞTÜRÜCÜ
              </Text>
        </View>
        <View style={[styles.column, styles.destinations]} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View activeOpacity={0.8} >
            <ImageBackground
              style={[styles.flex, styles.destination, styles.shadow]} style={{ width: screenWidth, height: screenHeight - 140 }}
              imageStyle={{ borderRadius: 12 }}
              source={require('../Images/screenbg.jpg')} >
              <View style={[styles.row, { justifyContent: 'space-between' }]}>
                <View style={[styles.column, { flex: 2, paddingHorizontal: 18, alignItems: 'center' }]}>
                  <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 25, marginTop: 10 }}>NOTE COIN</Text>
                  <Text style={{ color: '#FFF', fontSize: 22, marginTop: 10 }}>{this.state.kullanici.KullaniciAdi} {this.state.kullanici.KullaniciSoyadi}</Text>
                </View>
              </View>
              <View style={[styles.column, styles.destinationInfo, styles.shadow]}>
                <View style={{
                  flex: 0
                  , height: 35
                  , width: screenWidth - 40
                  , backgroundColor: '#3498db'
                  , borderRadius: 10
                  , paddingHorizontal: 20
                  , paddingVertical: 10
                  , marginTop: 30
                  , position: 'relative'
                  , alignItems: 'center'
                }}>
                  <Text style={{ fontSize: 16, color: 'white' }} >
                    COIN SAYINIZ :  {this.state.CoinBakiye}  COIN
              </Text>
                </View>
                <View style={{
                  flex: 0
                  , height: 35
                  , width: screenWidth - 40
                  , backgroundColor: '#3498db'
                  , borderRadius: 10
                  , paddingHorizontal: 20
                  , paddingVertical: 10
                  , marginTop: 30
                  , alignItems: 'center'
                }}>
                  <Text style={{ fontSize: 16, color: 'white' }} >
                    KAZANACAĞINIZ :  {this.state.TL}  TL
              </Text>
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
                    onPress={this.coinBilgiGuncelle} >
                    <Text style={{ fontSize: 16, color: 'white' }} > DÖNÜŞTÜR</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ImageBackground>
          </View>
        </View>
      </View>
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
    width: StyleSheet.screenWidth,
    height: 340,
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
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  textınput: {
    height: 40,
    width: 200,
    marginTop: -40,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 2,
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
    marginTop: 25,
    borderRadius: 10,
    borderColor: 'black',
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
export default connect(mapStateToProps)(CoinTlScreen);