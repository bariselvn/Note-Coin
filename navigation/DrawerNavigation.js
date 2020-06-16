import React from 'react';
import { Dimensions } from 'react-native';
import { createNavigation, createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import HomeScreen from '../Components/Screens/HomeScreen';
import LoginScreen from '../Components/Screens/LoginScreen';
import MenuDrawer from '../Components//Menu/MenuDrawer';
import KayitScreen from '../Components/Screens/KayitScreen';
import NotScreen from '../Components/Screens/NotScreen'
import SatinAlinanScreen from '../Components/Screens/SatinAlinanScreen'
import PaketScreen from '../Components/Screens/PaketScreen'
import NotEklemeScreen from '../Components/Screens/NotEklemeScreen'
import HesapScreen from '../Components/Screens/HesapScreen'
import ProfilScreen from '../Components/Screens/ProfilScreen'
import PGüncellemeScreen from '../Components/Screens/PGüncellemeScreen'
import NotlarimScreen from '../Components/Screens/NotlarimScreen'
import CoinTlScreen from '../Components/Screens/CoinTlScreen'
import HesapGuncellemeScreen from '../Components/Screens/HesapGuncellemeScreen'
const WIDTH = Dimensions.get('window').width;
const DrawerConfig = {

    DrawerWidth: WIDTH * 0.83,
    contentComponent: ({ navigation }) => {
        return (<MenuDrawer navigation={navigation} />)
    }
}
const DrawerNavigation = createDrawerNavigator(

    {
        LoginScreen: {
            screen: LoginScreen
        },
        HomeScreen: {
            screen: HomeScreen
        },

        NotScreen: {
            screen: NotScreen
        },

        KayitScreen: {
            screen: KayitScreen
        },
        HesapScreen: {
            screen: HesapScreen
        },
        PaketScreen: {
            screen: PaketScreen
        },
        SatinAlinanScreen: {
            screen: SatinAlinanScreen
        },
        NotlarimScreen: {
            screen: NotlarimScreen
        },
        CoinTlScreen: {
            screen: CoinTlScreen
        },
        PGüncellemeScreen: {
            screen: PGüncellemeScreen
        },
        ProfilScreen: {
            screen: ProfilScreen
        },
        NotEklemeScreen: {
            screen: NotEklemeScreen
        },
        HesapGuncellemeScreen: {
            screen: HesapGuncellemeScreen
        },
    },
    DrawerConfig
);
export default createAppContainer(DrawerNavigation);

