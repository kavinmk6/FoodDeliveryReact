import React from 'react'
import { View, Image, ScrollView, Text } from 'react-native'
import CustomButton from '../components/CustomButton'

export default class OrderDetailScreen extends React.Component {

    render() {
        return(
            <View style={{flex: 1}}>
                <ScrollView style={{marginTop: 20}}>
                    <Image source={{uri: this.props.route.params.img}} style={{width: '80%', height: 250, borderRadius: 10, alignSelf: 'center'}} />
                    <Text style={{fontWeight: 'bold', fontSize: 20, marginTop: 10, alignSelf: 'center'}}>{this.props.route.params.name}</Text>
                    <Text style={{fontWeight: 'bold', fontSize: 20, marginTop: 10, alignSelf: 'center'}}>${this.props.route.params.price}</Text>
                    <Text style={{fontWeight: 'bold', fontSize: 20, margin: 10}}>Description</Text>
                    <Text style={{margin: 10, fontSize: 17}}>{this.props.route.params.description}</Text>
                </ScrollView>
                <CustomButton title='Proceed to order' onPress={this.proceedToOrder.bind(this)} />
            </View>
        )
    }

    proceedToOrder = () => {
        this.props.navigation.push('Receipt', this.props.route.params)
    }
}