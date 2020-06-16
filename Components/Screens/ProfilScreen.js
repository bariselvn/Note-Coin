import React from 'react';
import { StyleSheet, Text, View, Image, Button, TouchableOpacity, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import MenuButton from '../Menu/MenuButton';
import { NavigationEvents } from 'react-navigation';
class ProfilScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      urli: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
      photos: [],
      kullanici: [],
      hesap: [],
      Tckn: props.Tckn,
      KullaniciID: props.KullaniciID,
      KullaniciAdi: props.KullaniciAdi,
      KullaniciSoyadi: props.KullaniciSoyadi,
      Bolum: props.Bolum,
      PpYol: props.PpYol
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.hesapKontrol = this.hesapKontrol.bind(this);
  }
  hesapKontrol() {
    if (this.state.hesap != '') {
      this.props.navigation.navigate('HesapGuncellemeScreen');
    }
    else {
      this.props.navigation.navigate('HesapScreen');
    }
  }
  componentDidMount() {
    fetch("https://notecoinhttpservice20191223091420.azurewebsites.net/api/kullanici/" + this.state.KullaniciID).then(res => {
      if (res.ok) {
        res.json()
          .then(data => {
            this.setState({ kullanici: data.results });
            if (this.state.kullanici.PpYol != null && this.state.kullanici.PpYol != '') {
              this.setState({ urli: this.state.kullanici.PpYol })
            };
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
          })
      }
      else {
        return;
      }
    })
  }
  render() {
    const { urli } = this.state;
    let screenWidth = Dimensions.get('window').width;
    let screenHeight = Dimensions.get('window').height;
    return (
      <View style={{ flex: 1 }}>
        <NavigationEvents onWillFocus={() => {
          this.componentDidMount();
        }} />
        <MenuButton navigation={this.props.navigation} />
        <TouchableOpacity style={{ flex: 0, height: 40, width: screenWidth, backgroundColor: '#3498db', paddingHorizontal: 20, paddingVertical: 10, alignItems: 'center' }}>
          <Text style={{ fontSize: 22, color: 'white' }} >
            PROFİL
              </Text>
        </TouchableOpacity>
        <View style={{ flex: 2, alignItems: 'center' }}>
          <TouchableOpacity style={{ height: 100, width: 100, borderRadius: 50, marginTop: 25 }} >
            <View
              style={{ height: 100, width: 100, borderRadius: 50 }}>
              <Image
                style={{ height: 100, width: 100, borderRadius: 50 }}
                source={{ uri: urli }} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 2, backgroundColor: '#3498db' }}>
          <View style={{ flexDirection: 'column', flex: 2 }}>
            <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', marginTop: 10, color: 'white' }}>
              BİLGİLERİM
        </Text>
          </View>
          <View style={{ flexDirection: "row", flex: 2, justifyContent: 'space-around' }}>
            <Text style={{ fontSize: 18, color: 'white' }}>
              İsim: {this.state.kullanici.KullaniciAdi}
            </Text>
            <Text style={{ fontSize: 18, color: 'white' }}>
              Soyisim: {this.state.kullanici.KullaniciSoyadi}
            </Text>
          </View>
          <View style={{ flexDirection: "column", flex: 2, alignItems: 'center' }}>
            <Text style={{ fontSize: 18, color: 'white' }}>
              Bölüm: {this.state.kullanici.Bolum}
            </Text>
          </View>
        </View>
        <View style={{ flex: 3, backgroundColor: 'white', justifyContent: 'space-around', alignItems: 'center' }}>
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
            onPress={() => {
              this.props.navigation.navigate('NotlarimScreen');
            }}>
            <Text style={{ fontSize: 16, color: 'white' }} >NOTLARIM</Text>
          </TouchableOpacity>
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
            onPress={() => {
              this.props.navigation.navigate('SatinAlinanScreen');
            }}>
            <Text style={{ fontSize: 16, color: 'white' }} >SATIN ALDIKLARIM</Text>
          </TouchableOpacity>
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
            onPress={this.hesapKontrol}>
            <Text style={{ fontSize: 16, color: 'white' }} >HESAP GÜNCELLE</Text>
          </TouchableOpacity>
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
            onPress={() => {
              this.props.navigation.navigate('PGüncellemeScreen');
            }}>
            <Text style={{ fontSize: 16, color: 'white' }} >BİLGİLERİMİ DÜZENLE</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({
  KullaniciID: state.reducerUser.kullaniciId,
})
export default connect(mapStateToProps)(ProfilScreen);