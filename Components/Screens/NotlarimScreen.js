import React from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  ScrollView,
  Modal,
  Image,
  ImageBackground,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import MenuButton from '../Menu/MenuButton';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { NavigationEvents } from 'react-navigation';
const { width } = Dimensions.get('window')
class NotlarimScreen extends React.Component {
  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);
    this.state = {
      KullaniciID: props.KullaniciID,
      kullanici: [],
      notlarim: [],
      errormessage: '',
      modalVisible: false,
      NotID: props.NotID,
      NotYolu: '',
      urli: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
      KullaniciAdi: props.KullaniciAdi,
      KullaniciSoyadi: props.KullaniciSoyadi,
      Aciklama: props.Aciklama,
      Coin: props.Coin,
      PpYol: props.PpYol
    }
  };
  componentDidMount() {
    fetch("https://notecoinhttpservice20191223091420.azurewebsites.net/api/not/notlarim/" + this.state.KullaniciID).then(res => {
      if (res.ok) {
        res.json()
          .then(data => {
            this.setState({ notlarim: data.results })
          })
      }
      else {
        this.setState({ errormessage: "Satın Alınan Not Bulunumadı." });
        return;
      }
    }
    );
    fetch("https://notecoinhttpservice20191223091420.azurewebsites.net/api/kullanici/" + this.state.KullaniciID).then(res => {
      if (res.ok) {
        res.json()
          .then(data => {
            this.setState({ kullanici: data.results });
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
  render() {
    let screenWidth = Dimensions.get('window').width;
    let screenHeight = Dimensions.get('window').height;
    return (
      <View style={styles.container}>
        <NavigationEvents onWillFocus={() => {
          this.componentDidMount();
        }} />
        <MenuButton navigation={this.props.navigation} />
        <View style={{ flex: 0, height: 40, width: screenWidth, backgroundColor: '#3498db', borderRadius: 2, paddingHorizontal: 20, paddingVertical: 10, alignItems: 'center' }}>
          <Text style={{ fontSize: 22, color: 'white' }} >
            NOTLARIM
              </Text>
        </View>
        <View style={[styles.column, styles.destinations]} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ScrollView
            scrollEnabled
            showsHorizontalScrollIndicator={false}
            decelerationRate={0}
            scrollEventThrottle={16}
            snapToAlignment="center" >
            {this.state.notlarim.map((l, i) => (
              <TouchableOpacity activeOpacity={0.8} key={i} onPress={() => {
                this.setState({ modalVisible: true }), this.setState({ NotYolu: l.NotYol })
              }}>
                <ImageBackground
                  style={[styles.flex, styles.destination, styles.shadow]}
                  imageStyle={{ borderRadius: 12 }}
                  source={require('../Images/notbg.jpg')} >
                  <View style={[styles.row, { justifyContent: 'space-between' }]}>
                    <View style={[styles.column, { flex: 2, paddingHorizontal: 18 }]}>
                      <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 20 }}>NOTE COIN</Text>
                      <Text style={{ color: '#FFF', fontSize: 18 }}>{this.state.kullanici.KullaniciAdi} {this.state.kullanici.KullaniciSoyadi}</Text>
                    </View>
                    <View style={{ flex: 0, justifyContent: 'center', alignItems: 'flex-end' }}>
                    </View>
                  </View>
                  <View style={[styles.column, styles.destinationInfo, styles.shadow]}>
                    <Text style={{
                      color: '#3498db',
                      fontSize: 14 * 1.25,
                      fontWeight: '500',
                      paddingBottom: 8, textAlign: 'center'
                    }}
                    > {l.Aciklama}</Text>
                  </View>
                  <View style={[styles.column, styles.destinationInfo2, styles.shadow]}>
                    <Text style={{
                      color: '#3498db',
                      fontSize: 16,
                      fontWeight: '500',
                      paddingBottom: 8, textAlign: 'center'
                    }}
                    >{l.Coin}-COIN </Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))
            }
          </ScrollView>
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
            <ScrollView
              maximumZoomScale={3}
              minimumZoomScale={1}
              horizontal>
              <Image
                style={{ width: screenWidth, height: screenHeight - 90, marginTop: 30 }}
                source={{ uri: this.state.NotYolu }}>
              </Image>
            </ScrollView>
          </View>
        </Modal>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 21,
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
export default connect(mapStateToProps)(NotlarimScreen);