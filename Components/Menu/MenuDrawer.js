import React from 'react';
import { Platform, Dimensions, Text, View, StyleSheet, TouchableOpacity, ImageBackground, FlatList } from 'react-native';
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
export default class MenuDrawer extends React.Component {
    navLink(nav, text) {
        return (
            <TouchableOpacity style={{ height: 50 }} onPress={() => this.props.navigation.navigate(nav)}>
                <Text style={styles.link}>{text}</Text>

            </TouchableOpacity>
        )
    }
    render() {
        return (
            <View style={styles.Container}>
                <ImageBackground source={require('../Images/menubg.jpg')} style={styles.topLinks}>
                    <Text style={{ textAlign: 'center', color: 'black', fontSize: 20, marginRight: 95 }}>NOTE COIN</Text>
                </ImageBackground>
                <View style={{ marginTop: 25, marginLeft: 10 }}>
                    {this.navLink('ProfilScreen', 'PROFİL')}
                    {this.navLink('NotScreen', 'NOTLAR')}
                    {this.navLink('NotEklemeScreen', 'NOT EKLE')}
                    {this.navLink('NotlarimScreen', 'NOTLARIM')}
                    {this.navLink('PaketScreen', 'COIN PAKETLERİ')}
                    {this.navLink('CoinTlScreen', 'COIN DÖNÜŞTÜR')}
                    {this.navLink('SatinAlinanScreen', 'SATIN ALDIKLARIM')}

                </View>
            </View>

        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topLinks: {
        height: 100,
        justifyContent: 'center'

    },
    bottomLinks: {
        flex: 1,
    },
    link: {
        flex: 1,
        fontSize: 20,
        margin: 5,
        textAlign: 'left'
    }
})
