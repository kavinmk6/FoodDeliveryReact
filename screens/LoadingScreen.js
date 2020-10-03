import React from 'react'
import { View, ActivityIndicator } from 'react-native'
import firebase from '../firebase'

export default class LoadingScreen extends React.Component {

    componentDidMount() {
        let unsubscribe = firebase.auth().onAuthStateChanged(user => {
            if(user) {
                this.props.navigation.replace('TabScreen')
            } else {
                this.props.navigation.replace('Login')
            }
            
            unsubscribe()
        })

    }

    render() {
        return(
            <View style={{flex: 1, justifyContent: 'center'}}>
                <ActivityIndicator size='large' animating={true}/>
            </View>
        )
    }
}