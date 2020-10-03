import React from 'react'
import { View, Text, Alert } from 'react-native'
import * as Location from 'expo-location';

import CustomButton from '../components/CustomButton'
import firebase from '../firebase'

export default class PickOrderScreen extends React.Component {

    constructor(props) {
        super(props)

        this.totalTime = 20
        this.state = {
            msg: '',
            showBtn: false,
            hasOrder: false,
            totalTime: this.totalTime
        }
        
        this.storeLocation = {lat: 43.6544, lng: -79.3807}
    }

    componentDidMount() {
        this.checkHasOrder((hasOrder) => {
            if (hasOrder) {
                this.askForLocationPermission()
            } else {
                this.setState({text: "You don't has any order right now", showBtn: true})
            }
        })
    }

    checkHasOrder = (completion) => {
        const uid = firebase.auth().currentUser.uid
        let ref = firebase.firestore().collection('orders').where('user.id', '==', uid)
        ref.get().then(snap => completion(snap.docs.length !== 0))
    }

    askForLocationPermission = () => {
        Location.requestPermissionsAsync().then(status => {
            if (status.status !== 'granted') {
                Alert.alert('Location permission required', 'Please give access to the location')
            } else {
                this.startListeningLocationChanage()
            }
        }).catch(err => Alert.alert('Error', err.message))
    }

    startListeningLocationChanage = () => {
        this.setState({msg: 'Checking if you are near store', hasOrder: false, totalTime: this.totalTime})
        Location.watchPositionAsync().then(rsl => {
            Location.getCurrentPositionAsync().then(location => {
                const loc = {lat: location.coords.latitude, lng: location.coords.longitude}
                const rad = this.calcCrow(loc, this.storeLocation)
                if (Math.round(rad) === 0) {
                    rsl.remove()
                    Alert.alert('Order', 'Preparing your order', [
                        {text: 'OK', onPress: () => this.startTimer()}
                    ])
                } else {
                    this.setState({msg: 'You are not near store, Checking ...'})
                }

                console.log(location)
            })
        })
    }

    // https://stackoverflow.com/questions/23115375/determine-if-a-longitude-latitude-co-ordinate-is-inside-a-radius-in-miles-and
    calcCrow = (coords1, coords2) => {
        var R = 0.1; // 0.1 km -> 100 m
        var dLat = this.toRad(coords2.lat-coords1.lat);
        var dLon = this.toRad(coords2.lng-coords1.lng);
        var lat1 = this.toRad(coords1.lat);
        var lat2 = this.toRad(coords2.lat);
        
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c;
        return d;
    }

    toRad = (value) => { return value * Math.PI / 180}

    // https://stackoverflow.com/questions/37096367/how-to-convert-seconds-to-minutes-and-hours-in-javascript/37096923
    secondsToMinutes = (d) => {
        if (this.state.hasOrder === false) { return '' }
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);
    
        var mDisplay = m > 0 ? m + (m == 1 ? " min, " : " sec, ") : "";
        var sDisplay = s > 0 ? s + (s == 1 ? " sec" : " seconds") : "";
        return mDisplay + sDisplay; 
    }

    startTimer = () => {
        this.setState({msg: 'Please wait', hasOrder: true})
        let interval = setInterval(() => {
            if (this.state.totalTime === 0) {
                Alert.alert('Order', 'Please pick your order', [
                    {text: 'OK', onPress: () => this.setState({showBtn: true})}
                ])
                clearInterval(interval)
            }
            this.setState({totalTime: this.state.totalTime - 1})
        }, 1000)
    }

    render() {
        return(
            <View style={{flex: 1, justifyContent: 'center'}}>
                <Text style={{fontSize: 25, fontWeight: 'bold', alignSelf: 'center'}}>{this.state.msg}</Text>
                <Text style={{fontSize: 25, fontWeight: 'bold', alignSelf: 'center'}}>{this.secondsToMinutes(this.state.totalTime)}</Text>

                {
                    this.state.showBtn === false ? null :
                    <View style={{position: 'absolute', bottom: 0, width: '100%'}}>
                        <CustomButton title='Refresh' onPress={() => this.componentDidMount()} />
                    </View>
                }
            </View>
        )
    }
}