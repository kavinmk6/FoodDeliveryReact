import React from 'react'
import * as Google from 'expo-google-app-auth'
import { SafeAreaView, Text, StyleSheet, View, ActivityIndicator ,TouchableOpacity, Keyboard, Alert } from 'react-native'

import CustomInput from '../components/CustomInput'
import CustomButton from '../components/CustomButton'
import firebase from '../firebase'

export default class LoginScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {email: '', password: '', showActivityIndicator: false}
  }

  loginBtnTapped = () => {
    Keyboard.dismiss()
    if(this.state.showActivityIndicator) { return }
    this.setState({showActivityIndicator: true})
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then(result => {
      this.props.navigation.replace('TabScreen')
    }).catch(err => {
        this.setState({showActivityIndicator: false})
        Alert.alert('Login failed', err.message, [ {text: 'OK'}])
    })
  }

  signInWithGoogle = async () => {
    try {
      const result = await Google.logInAsync({
        androidClientId: '666524436869-m3vtu8asmcejdtq90kv1jbl15s5h1uk5.apps.googleusercontent.com',
        iosClientId: '666524436869-oiepm37um4k702q93pd96r0u5dlhfn6a.apps.googleusercontent.com',
        scopes: ['profile', 'email']
      })

      if (result.type === 'success') {
        return result
      } else {
        return {cancelled: true}
      }
    } catch (error) {
      return {error: error.message}
    }
  }

  googleSignInBtnTapped = async () => {
    this.signInWithGoogle().then(result => {
      this.setState({showActivityIndicator: true})
      let credential = firebase.auth.GoogleAuthProvider.credential(result.idToken)
      firebase.auth().signInWithCredential(credential).then(rsl => {
        let user = {id: rsl.user.uid, name: rsl.user.displayName, email: rsl.user.email, number: rsl.user.phoneNumber, img: rsl.user.photoURL}
        this.addUserInFirestore(user)
      })
    }).catch(err => {
      console.log(err)
      this.setState({showActivityIndicator: false})
    })
  }

  addUserInFirestore = (user) => {
    firebase.firestore().collection('users').doc(user.id).set(user).then(() => {
      this.setState({showActivityIndicator: false})
      this.props.navigation.replace('TabScreen')
    })
  }
  
  render() {
    return(
      <SafeAreaView style={{flex: 1}}>
        <Text style={{...styles.textStyle, marginTop: 70}}>Welcome To Food Delivery</Text>

        <View style={{marginTop: '25%'}}>
          <CustomInput placeholder='Email' value={this.state.email} onChangeText={(text) => this.setState({email: text})} onSubmitEditing={this.loginBtnTapped.bind(this)}  />
          <CustomInput placeholder='Password' secure={true} value={this.state.password} onChangeText={(text) => this.setState({password: text})} onSubmitEditing={this.loginBtnTapped.bind(this)}  />
          <CustomButton title='Login' onPress={this.loginBtnTapped.bind(this)} />
          <CustomButton title='Sign in with google' onPress={this.googleSignInBtnTapped.bind(this)} />

          <ActivityIndicator style={{marginTop: '10%'}} size='large' animating={this.state.showActivityIndicator} />
        </View>

        <TouchableOpacity style={styles.signUpTouchStyle} onPress={() => this.props.navigation.navigate('Register')}>
          <Text style={styles.signUpText}>Don't have and account? <Text style={styles.forgotPasswordStyle}>Sign Up</Text></Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }
}

const styles = new StyleSheet.create({
  
  textStyle: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 30,
    paddingLeft: 16,
  },

  forgotPasswordStyle: {
    color: '#E8015A',
    fontSize: 17
  },

  signUpTouchStyle: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center'
  },

  signUpText: {
    fontSize: 17,
    textAlign: 'center'
  }

})