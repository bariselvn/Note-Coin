import React from 'react';
import { Dimensions, StyleSheet, View, Text, ScrollView, TextInput, Keyboard, Image, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import MenuButton from '../Menu/MenuButton';
import { connect } from 'react-redux';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';
import { NavigationEvents } from 'react-navigation';
import { TouchableOpacityBase } from 'react-native';
const { width } = Dimensions.get('window')
class NotScreen extends React.Component {
  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.notSatinAlma = this.notSatinAlma.bind(this);
    this.notArama = this.notArama.bind(this);
    this.state = {
      KullaniciID: props.KullaniciID,
      NotID: props.NotID,
      KullaniciAdi: props.KullaniciAdi,
      KullaniciSoyadi: props.KullaniciSoyadi,
      Aciklama: props.Aciklama,
      Coin: props.Coin,
      PpYol: props.PpYol,
      arananKelime: '',
      urli: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
      coinHesap: '',
      CoinBakiye: props.CoinBakiye,
      IslemID: '',
      notid: '',
      notlar: [],
      satinAlinanlarID: [],
    }
  };
  notArama() {
    if (this.state.arananKelime != '') {
      fetch("https://notecoinhttpservice20191223091420.azurewebsites.net/api/not/arama/" + this.state.arananKelime).then(res => {
        if (res.ok) {
          res.json()
            .then(data => {
              this.setState({ notlar: data.results });
              console.log('arama Sonucu', data.results)
            })
        }
        else {
          return;
        }
      })
    }
    else {
      fetch("https://notecoinhttpservice20191223091420.azurewebsites.net/api/not/").then(res => {
        if (res.ok) {
          res.json()
            .then(data => {
              this.setState({ notlar: data.results });
              if (this.state.notlar[0].kullanici.PpYol != null) {
                this.setState({ urli: this.state.notlar[0].kullanici.PpYol })
              };
            })
        }
        else {
          return;
        }
      })
    }
  }
  componentDidMount() {
    fetch("https://notecoinhttpservice20191223091420.azurewebsites.net/api/not/").then(res => {
      if (res.ok) {
        res.json()
          .then(data => {
            this.setState({ notlar: data.results });
            if (this.state.notlar[0].kullanici.PpYol != null) {
              this.setState({ urli: this.state.notlar[0].kullanici.PpYol })
            };
          })
      }
      else {
        return;
      }
    })
    fetch("https://notecoinhttpservice20191223091420.azurewebsites.net/api/coinHesap/hesap/" + this.state.KullaniciID).then(res => {
      if (res.ok) {
        res.json()
          .then(data => {
            this.setState({ coinHesap: data.results });
          })
      }
      else {
        return;
      }
    })
    fetch("https://notecoinhttpservice20191223091420.azurewebsites.net/api/satinAlinanlar/satinID/" + this.state.KullaniciID).then(res => {
      if (res.ok) {
        res.json()
          .then(data => {
            this.setState({ satinAlinanlarID: data.results })
          })
      }
      else {
        this.setState({ errormessage: "Satın Alınan Not Bulunumadı." });
        return;
      }
    }
    );

  }
  notSatinAlma(id, coin) {
    let newid = id;
    this.setState({ NotID: newid })
    var durum = false;
    for (let i = 0; i < this.state.satinAlinanlarID.length; i++) {
      if (this.state.satinAlinanlarID[i].satinAlinanlar.NotID != id) {
        console.log('id bulunamadı')
        console.log(this.state.satinAlinanlarID.length)
        if (i == this.state.satinAlinanlarID.length) {
          break;
        }
      }
      else {
        durum = true;
        console.log('id bulundu')
        break;
      }
    }
    if (!durum && this.state.coinHesap >= coin) {
      const notIslem = {
        IslemID: 1,
        NotID: id,
        KullaniciID: this.props.KullaniciID
      }
      console.log({ notIslem });
      fetch('https://notecoinhttpservice20191223091420.azurewebsites.net/api/notIslem/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(notIslem),
      }).then((response) => response.json())
        .then((responseJson) => {
          console.log('response object:', responseJson.results)
        })
        .catch((error) => {
          console.error(error);
        });
      const satinAlinan = {
        NotID: id,
        KullaniciID: this.props.KullaniciID
      }
      console.log({ satinAlinan });
      fetch('https://notecoinhttpservice20191223091420.azurewebsites.net/api/satinAlinanlar/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(satinAlinan),
      }).then((response) => response.json())
        .then((responseJson) => {
          console.log('response object:', responseJson.results)
          if (responseJson != null) { this.props.navigation.navigate('SatinAlinanScreen') }

        })
        .catch((error) => {
          console.error(error);
        });
    }
    else {
      alert('NOT SATIN ALIM İŞLEMİ BAŞARISIZ')
    }
  }
  render() {
    let screenWidth = Dimensions.get('window').width;
    return (
      <View style={styles.container}>
        <NavigationEvents onWillFocus={() => {
          this.componentDidMount();
        }} />
        <MenuButton navigation={this.props.navigation} />
        <View style={{ flex: 0, height: 40, width: screenWidth, backgroundColor: '#3498db', borderRadius: 2, paddingHorizontal: 20, paddingVertical: 10, alignItems: 'center' }}
        >
          <Text style={{ fontSize: 22, color: 'white' }} >
            NOTLAR
              </Text>
        </View>
        <View style={{ flex: 0, height: 35, width: screenWidth, backgroundColor: '#3498db', borderRadius: 2, paddingHorizontal: 20, paddingVertical: 10, alignItems: 'center' }}
        >
          <Text style={{ fontSize: 16, color: 'white' }} >
            COIN SAYINIZ :   {this.state.coinHesap}
          </Text>
        </View>
        <View style={styles.ınput}>
          <Input style={styles.textınput}
            placeholder='SEARCH'
            left={20}
            value={this.state.arananKelime}
            maxLength={200}
            onChangeText={(arananKelime) => this.setState({ arananKelime })}
            leftIcon={
              <TouchableOpacity onPress={this.notArama}>
                <Icon
                  name='search'
                  size={28}
                  color='black'
                />
              </TouchableOpacity>
            } />
        </View>
        <View style={[styles.column, styles.destinations]} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ScrollView
            scrollEnabled
            showsHorizontalScrollIndicator={false}
            decelerationRate={0}
            scrollEventThrottle={16}
            snapToAlignment="center" >
            {this.state.notlar.map((l, i) => (
              <TouchableOpacity activeOpacity={0.8} key={i}  >
                <ImageBackground
                  style={[styles.flex, styles.destination, styles.shadow]}
                  imageStyle={{ borderRadius: 12 }}
                  source={require('../Images/notbg.jpg')} >
                  <View style={[styles.row, { justifyContent: 'space-between' }]}>
                    <View style={[styles.column, { flex: 2, paddingHorizontal: 18 }]}>
                      <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 20 }}>NOTE COIN</Text>
                      <Text style={{ color: '#FFF', fontSize: 18 }}>{l.kullanici.KullaniciAdi} {l.kullanici.KullaniciSoyadi}</Text>
                    </View>
                    <View style={{ flex: 0, justifyContent: 'center', alignItems: 'flex-end' }}>
                      <TouchableOpacity  >
                        <Ionicons name="ios-wallet" size={40} color="#3498db" onPress={() => this.notSatinAlma(l.note.NotID, l.note.Coin)} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={[styles.column, styles.destinationInfo, styles.shadow]}>
                    <Text style={{
                      color: '#3498db',
                      fontSize: 14 * 1.25,
                      fontWeight: '500',
                      paddingBottom: 8, textAlign: 'center'
                    }}
                    > {l.note.Aciklama}</Text>
                  </View>
                  <View style={[styles.column, styles.destinationInfo2, styles.shadow]}>
                    <Text style={{
                      color: '#3498db',

                      fontSize: 16,
                      fontWeight: '500',
                      paddingBottom: 8, textAlign: 'center',
                    }}
                    >{l.note.Coin}-COIN </Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))
            }
          </ScrollView>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
export default connect(mapStateToProps)(NotScreen);