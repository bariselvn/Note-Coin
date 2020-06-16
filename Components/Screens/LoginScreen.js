import React from 'react';
import { StyleSheet, View, Text, TextInput, ImageBackground, Dimensions, TouchableOpacityBase } from 'react-native';
import { connect } from 'react-redux'
import { UpdateId } from '../../redux/actions/index';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';
import { TapGestureHandler, State, TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import Svg, { Image, Circle, ClipPath } from 'react-native-svg'
import { Asset } from 'expo-asset';
import { AppLoading } from 'expo';
function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}
const {
  Value,
  event,
  block,
  cond,
  eq,
  set,
  Clock,
  startClock,
  stopClock,
  debug,
  timing,
  clockRunning,
  interpolate,
  Extrapolate,
  concat
} = Animated;

function runTiming(clock, value, dest) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0)
  };
  const config = {
    duration: 1000,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease)
  };
  return block([
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, value),
      set(state.frameTime, 0),
      set(config.toValue, dest),
      startClock(clock)
    ]),
    timing(clock, state, config),
    cond(state.finished, debug('stop clock', stopClock(clock))),
    state.position
  ]);
}
const { width, height } = Dimensions.get('window');
const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);
class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.girisYap = this.girisYap.bind(this);
    this.buttonOpacity = new Value(1);
    this.onStateChange = event([
      {
        nativeEvent: ({ state }) =>
          block([
            cond(
              eq(state, State.END),
              set(this.buttonOpacity, runTiming(new Clock(), 1, 0))
            )
          ])
      }
    ]);
    this.onCloseState = event([
      {
        nativeEvent: ({ state }) =>
          block([
            cond(
              eq(state, State.END),
              set(this.buttonOpacity, runTiming(new Clock(), 0, 1))
            )
          ])
      }
    ]);

    this.buttonY = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [100, 0],
      extrapolate: Extrapolate.CLAMP
    });

    this.bgY = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [height / 3 - 10, 0],
      extrapolate: Extrapolate.CLAMP
    });
    this.textınputZindex = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [1, -1],
      extrapolate: Extrapolate.CLAMP
    });
    this.textınputY = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [0, 100],
      extrapolate: Extrapolate.CLAMP
    });
    this.textInputOpacity = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [1, 0],
      extrapolate: Extrapolate.CLAMP
    });
    this.rotateCross = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [180, 360],
      extrapolate: Extrapolate.CLAMP
    });
    this.state = {
      isReady: false,
      KullaniciID: '',
      Tckn: '',
      kullaniciID: 0,
      sifre: '',
      errormessage: '',
    }
  };
  updateId = (KullaniciID) => {
    UpdateId(KullaniciID);
  }
  async _loadAssetsAsync() {
    const imageAssets = cacheImages([require('../Images/Homebg.jpg')]);
    await Promise.all([...imageAssets]);
  }
  girisYap() {
    fetch("https://notecoinhttpservice20191223091420.azurewebsites.net/api/kullanici/Login/" + this.state.Tckn + "/" + this.state.sifre + "/").then(res => {

      if (res.ok) {
        res.json()
          .then(data => {
            this.updateId(data.results);
            console.log('dataResults', data.results);
            this.setState({ kullaniciID: data.results });
            this.setState({ errormessage: "Giriş Başarılı" });
            console.log(this.state.errormessage);
            this.props.navigation.navigate('NotScreen', { KullaniciID: this.state.kullaniciID })
          })
      }
      else {
        this.setState({ errormessage: "TCKN   veya şifre hatalı." });
        alert('TCKN veya şifre boş veya hatalı !')
        console.log(this.state.errormessage);
        return;
      }
    }
    );
  }
  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this._loadAssetsAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        ></AppLoading>
      )
    }
  };
  render() {
    return (
      <DismissKeyboard>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            justifyContent: 'flex-TOP'
          }}
        >
          <Animated.View
            style={{
              ...StyleSheet.absoluteFill,
              transform: [{ translateY: this.bgY }]
            }}
          >
            <Svg height={height + 50} width={width}>
              <ClipPath id='clip'>
                <Circle r={height + 50} cx={width / 2} />
              </ClipPath>
              <Image
                href={require('../Images/Homebg.jpg')}
                height={height + 50} width={width}
                preserveAspectRatio="xMidYMid slice"
                clipPath="url(#clip)"
              />
            </Svg>
          </Animated.View>
          <View style={{ height: height / 3, justifyContent: 'center' }}>
            <TapGestureHandler onHandlerStateChange={this.onStateChange}>
              <Animated.View
                style={{
                  ...styles.button,
                  opacity: this.buttonOpacity,
                  transform: [{ translateY: this.buttonY }]
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>GİRİŞ YAP</Text>
              </Animated.View>
            </TapGestureHandler>
            <Animated.View
              style={{
                ...styles.button,
                backgroundColor: '#2E71DC',
                opacity: this.buttonOpacity,
                transform: [{ translateY: this.buttonY }]
              }}
            >
              <TouchableOpacity onPress={() => this.props.navigation.navigate('KayitScreen')}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>
                  KAYIT OL
            </Text>
              </TouchableOpacity>
            </Animated.View>
            <Animated.View style={{
              zIndex: this.textınputZindex,
              opacity: this.textInputOpacity,
              transform: [{ translateY: this.textınputY }],
              height: height / 3,
              ...StyleSheet.absoluteFill,
              top: null,
              justifyContent: 'center'
            }}>
              <TapGestureHandler onHandlerStateChange={this.onCloseState}>
                <Animated.View style={styles.closeButton}>
                  <Animated.Text style={{
                    fontSize: 15,
                    transform: [{ rotate: concat(this.rotateCross, 'deg') }]
                  }}
                  > X</Animated.Text>
                </Animated.View>
              </TapGestureHandler>
              <TextInput
                placeholder="TC Kimlik No Giriniz"
                style={styles.textınput}
                maxLength={11}
                value={this.state.Tckn}
                onChangeText={(Tckn) => this.setState({ Tckn })}
                keyboardType={'number-pad'}
                onSubmitEditing={() => this.passwordInput.focus()}
              />
              <TextInput
                placeholder="Şifre Giriniz"
                style={styles.textınput}
                value={this.state.sifre}
                maxLength={6}
                onChangeText={(sifre) => this.setState({ sifre })}
                secureTextEntry={true}
                returnKeyType={'go'}
              />
              <TouchableOpacity onPress={this.girisYap}>
                <Animated.View style={styles.buttonX}>
                  <Text style={{ fontSize: 20, fontWeight: 'bold' }}>GİRİŞ YAP</Text>
                </Animated.View>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </DismissKeyboard>
    );
  };
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
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
    borderWidth: 0.5,
    paddingLeft: 10,
    marginVertical: 5,
    marginHorizontal: 20,
    borderRadius: 25,
    borderColor: 'black',
  },
  closeButton: {
    height: 40, width: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 190,
    left: width / 2 - 20,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: 'black',
    shadowOpacity: 0.2
  },
  button: {
    backgroundColor: 'white',
    height: 70,
    marginHorizontal: 20,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: 'black',
    shadowOpacity: 0.2
  },
  buttonX: {
    backgroundColor: 'white',
    height: 40,
    marginHorizontal: 20,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: 'black',
    shadowOpacity: 0.2
  }
});
const mapStateToProps = (state, ownProps) => ({
  KullaniciID: state.reducerUser.kullaniciId,
})
export default connect(mapStateToProps)(LoginScreen);