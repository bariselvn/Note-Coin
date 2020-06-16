import React from 'react';
import {StyleSheet} from 'react-native';
import {Ionicons,FontAwesome5} from '@expo/vector-icons';


export default class MenuButton extends React.Component{
    render(){
        return (
            <Ionicons
             name="md-menu"
             color="#3498db"
             size={32}
             style="styles.menuIcon"
             onPress={()=>this.props.navigation.toggleDrawer()}
            
            />
        )
    }
}
const styles=StyleSheet.create({
 menuIcon:{ 
     zIndex:9,
     position:'absolute',
     top:40,
     left:20,
     

 }
})