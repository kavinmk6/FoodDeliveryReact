import React from 'react'
import { SafeAreaView, View, TouchableOpacity, Image, Keyboard, Alert, ActivityIndicator } from 'react-native'

import * as ImagePicker from 'expo-image-picker'

import CustomInput from '../components/CustomInput'
import CustomButton from '../components/CustomButton'
import firebase from '../firebase'

export default class RegisterScreen extends React.Component {

  constructor(props) {
    super(props)

    this.state = {name: '', email: '', number:'',password: '', showLoading: false, image: null}
    this.photoLink = ''
  }

  componentDidMount() {
    this.requestCameraPermission()
  }

  requestCameraPermission = () => {
    ImagePicker.requestCameraPermissionsAsync().then(() => {
      ImagePicker.requestCameraRollPermissionsAsync()
    })
  }

  pickImageOption = () => {
    Alert.alert('Pick image', 'Please pick the option for the image', [
      {text: 'Cancel'},
      {text: 'Library', onPress: () => this.pickImageLibrary()},
      {text: 'Camera', onPress: () => this.pickCameraImage()}
    ])
  }

  pickImageLibrary = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1
      })

      if (!result.cancelled) {
        this.setState({image: result.uri})
      }
    } catch(error) {
      console.log(error)
    }
  }

  pickCameraImage = async () => {
    try  {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1
      })

      if(!result.cancelled) {
        this.setState({image: result.uri})
      }
    }catch(error) {
      console.log(error)
    }
  }

  registerBtnTapped = () => {
    Keyboard.dismiss()
    if (this.state.name.length === 0) {
      Alert.alert('Name required', 'Please enter your name', [ {text: 'OK'}])
    } else if (this.state.email.length === 0) {
      Alert.alert('Email required', 'Please enter your email', [ {text: 'OK'}])
    } else if (this.state.email.includes('@') === false) {
      Alert.alert('Invalid email', 'Please enter valid email', [ {text: 'OK'}])
    } else if (this.state.number.length === 0) {
      Alert.alert('Phone number required', 'Please enter your phone number', [ {text: 'OK'}])
    } else if (isNaN(this.state.number)) {
      Alert.alert('Phone number invalid', 'Please enter valid phone number', [ {text: 'OK'}])
    } else if (this.state.password.length < 7) {
      Alert.alert('Password required', 'Please enter your password, must be 8 characters', [ {text: 'OK'}])
    } else {
      this.setState({showLoading: true})
      this.uploadImage(() => this.registerUser())
    }
  }

  uploadImage = (completion) => {
    if (this.state.image === null) {
      completion()
    } else {
      fetch(this.state.image).then(res => res.blob()).then(blob => {
        const filename = `${new Date().getTime()}_img.jpg`
        let ref = firebase.storage().ref().child('user_images').child(filename)
        ref.put(blob).then(snap => {
          snap.ref.getDownloadURL().then(link => {
            this.photoLink = link
            completion()
          })
        })
      }).catch(err => console.log(err))
    }
  }

  registerUser = () => {
    firebase.auth().createUserWithEmailAndPassword(this.state.email.toLowerCase(), this.state.password).then(result => {
      let user = {id: result.user.uid, name: this.state.name, email: this.state.email.toLowerCase(), img: this.photoLink, number: this.state.number}
      firebase.firestore().collection('users').doc(user.id).set(user).then(() => {
        firebase.auth().signOut()
        .then(() => this.props.navigation.pop())
        .catch(() => this.props.navigation.pop())
      })
    }).catch(err => Alert.alert('Register failed', err.message, [ {text: 'OK'}]) )
  }

  render() {
    return(
      <SafeAreaView style={{flex: 1}}>
        <View style={{marginTop: '10%'}}>
        
        <TouchableOpacity onPress={() => this.pickImageOption()} style={{width: 80, height: 80, borderRadius: 40, borderWidth: 1, borderColor: 'gray', justifyContent: 'center', alignSelf: 'center'}}>
          {this.state.image === null ? <Image source={require('../assets/camera.png')} style={{alignSelf: 'center', width: 24, height: 24}}/> : null}
          {this.state.image === null ? null : <Image source={{uri: this.state.image}} style={{width: 80, height: 80, borderRadius: 40, borderWidth: 1, borderColor: 'gray'}} />}
        </TouchableOpacity>

        <CustomInput 
            placeholder='Name' 
            value={this.state.name} 
            onChangeText={(text) => this.setState({name: text})} 
            onSubmitEditing={this.registerBtnTapped.bind(this)}  />
          
          <CustomInput 
            placeholder='Phone number' 
            value={this.state.number} 
            onChangeText={(text) => this.setState({number: text})} 
            onSubmitEditing={this.registerBtnTapped.bind(this)}  />

          <CustomInput 
            placeholder='Email' 
            value={this.state.email} 
            onChangeText={(text) => this.setState({email: text})} 
            onSubmitEditing={this.registerBtnTapped.bind(this)}  />
          
          <CustomInput 
            placeholder='Password'
            value={this.state.password} 
            secure={true}
            onChangeText={(text) => this.setState({password: text})} 
            onSubmitEditing={this.registerBtnTapped.bind(this)}  />

          <CustomButton title='Register' onPress={this.registerBtnTapped.bind(this)}/>
        </View>

        <ActivityIndicator style={{marginTop: '10%'}} size='large' animating={this.state.showLoading} />
      </SafeAreaView>
    )
  }
}