import React from 'react'
import { View, Text, Picker, Platform, ActivityIndicator, Alert } from 'react-native'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import CustomButton from '../components/CustomButton'
import firebase from '../firebase'

export default class ReceiptScreen extends React.Component {

    constructor(props) {
        super(props)

        this.state = {selectedTip: '0', tip: 0, manualTip: '0', loading: false}
        this.tax = ((100 * 13) / this.props.route.params.price).toFixed(2)
    }

    render() {
        return(
            <ScrollView style={{flex: 1}}>

                <View style={{flexDirection: 'row', margin: 20, justifyContent: 'space-between'}}>
                    <Text style={{fontWeight: 'bold', fontSize: 17}}>Name</Text>
                    <Text style={{fontSize: 17}}>{this.props.route.params.name}</Text>
                </View>

                <View style={{flexDirection: 'row', margin: 20, justifyContent: 'space-between'}}>
                    <Text style={{fontWeight: 'bold', fontSize: 17}}>SKU</Text>
                    <Text style={{fontSize: 17}}>{this.props.route.params.sku}</Text>
                </View>

                <View style={{flexDirection: 'row', margin: 20, justifyContent: 'space-between'}}>
                    <Text style={{fontWeight: 'bold', fontSize: 17}}>Subtotal</Text>
                    <Text style={{fontSize: 17}}>${this.props.route.params.price}</Text>
                </View>

                <View style={{flexDirection: 'row', margin: 20, justifyContent: 'space-between'}}>
                    <Text style={{fontWeight: 'bold', fontSize: 17}}>13% Tax</Text>
                    <Text style={{fontSize: 17}}>${this.tax}</Text>
                </View>

                <View style={{flexDirection: 'row', margin: 20, justifyContent: 'space-between'}}>
                    <Picker
                    selectedValue={this.state.selectedTip}
                    style={{ width: 135, marginTop: Platform.OS === 'ios' ? -100 : 0}}  
                    onValueChange={(itemValue, itemIndex) => this.setState({selectedTip: itemValue, tip: itemValue === 'others' ? 0.00 : ((100 * itemValue) / this.props.route.params.price).toFixed(2), manualTip: '0'})}>
                        <Picker.Item label='Select Tip' value={0} />
                        <Picker.Item label='10%' value={10} />
                        <Picker.Item label='15%' value={15} />
                        <Picker.Item label="20%" value={20} />
                        <Picker.Item label='Others' value={'others'} />
                    </Picker>
                    <Text style={{fontSize: 17}}>${this.state.tip}</Text>
                </View>
                {
                    this.state.selectedTip === 'others' ?
                    <View style={{flexDirection: 'row', margin: 20, marginTop: Platform.OS === 'ios' ? -70 : 0, justifyContent: 'space-between'}}>
                        <Text style={{fontWeight: 'bold', fontSize: 17}}>Manual Tip</Text>
                        <TextInput
                            placeholder={'Tip amount'}
                            value={this.state.manualTip}
                            onChangeText={(text) => this.setState({manualTip: text})}
                            keyboardType='numeric'
                            style={{fontSize: 17}}
                        />
                    </View> : null
                }
                
                <View style={{flexDirection: 'row', margin: 20, justifyContent: 'space-between'}}>
                    <Text style={{fontWeight: 'bold', fontSize: 17}}>Total</Text>
                    <Text style={{fontSize: 17}}>${this.props.route.params.price + Number(this.tax) + Number(this.state.tip) + Number(this.state.manualTip)}</Text>
                </View>

                <CustomButton title='Make order' onPress={this.makeOrderBtnTapped.bind(this)} />

                <ActivityIndicator style={{marginTop: '10%'}} size='large' animating={this.state.loading} />
            </ScrollView>
        )
    }

    makeOrderBtnTapped = () => {
        this.setState({loading: true})
        const total = this.props.route.params.price + Number(this.tax) + Number(this.state.tip) + Number(this.state.manualTip)
        let order = {tax: this.tax, total: total.toString(), tip: this.state.tip, manualTip: this.state.manualTip, timestamp: new Date().getTime()}

        this.setState({loading: true})
        firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).get().then(snap => {  
            order.user = snap.data()
            order.order = this.props.route.params
            firebase.firestore().collection('orders').doc().set(order).then(() => {
                Alert.alert('Order Added', 'Order has been added', [
                    {text: 'Ok', onPress: () => this.props.navigation.popToTop()}
                ])
                this.setState({loading: false})
            })
        })
    }
}