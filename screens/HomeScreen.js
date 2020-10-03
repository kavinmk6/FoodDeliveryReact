import React from 'react'
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native'
import firebase from '../firebase'
import CustomButton from '../components/CustomButton'

export default class HomeScreen extends React.Component {

    constructor(props) {
        super(props)

        this.state = {meals: []}
    }

    componentDidMount() {
        firebase.firestore().collection('meal_kits').get().then(snap => {
            let kits = []
            snap.docs.forEach(doc => { kits.push(doc.data()) })
            this.setState({meals: kits})
        })
    }

    render() {
        return(
            <View style={{flex: 1}}>
                <FlatList 
                data={this.state.meals}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center', marginTop: 20, marginBottom: 20}} onPress={() => this.onMealKitTapped(item)}>
                        <Image source={{uri: item.img}} style={{width: '80%', height: 200, borderRadius: 10}} />
                        <Text style={{fontWeight: 'bold', fontSize: 20, marginTop: 10}}>{item.name}</Text>
                        <Text style={{fontWeight: 'bold', fontSize: 17, marginTop: 10}}>${item.price}</Text>
                    </TouchableOpacity>
                )}
                />
                <CustomButton title='Sign out' onPress={this.signoutBtnTapped.bind(this)} />
            </View>
        )
    }

    onMealKitTapped = (item) => {
        this.props.navigation.push('OrderDetail', item)
    }

    signoutBtnTapped = () => {
        firebase.auth().signOut().then(() => {
            this.props.navigation.navigate('Login')
        })
    }
}