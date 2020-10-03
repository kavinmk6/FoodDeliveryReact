import React from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import firebase from '../firebase'
import CustomButton from '../components/CustomButton'

export default class OrderHistoryScreen extends React.Component {

    constructor(props) {
        super(props)

        this.state = {}
    }
    
    componentDidMount() {
        this.getOrders()
    }

    getOrders = () => {
        const uid = firebase.auth().currentUser.uid
        let ref = firebase.firestore().collection('orders').where('user.id', '==', uid).where('timestamp', '<', new Date().getTime()).orderBy('timestamp', 'desc')
        ref.get().then((snap) => {
            let orders = []
            snap.docs.forEach(doc => orders.push(doc.data()))
            this.setState({orders: orders})
            console.log(orders.length)
        })
    }

    render() {
        return(
            <View style={{flex: 1}}>
                <FlatList
                    data={this.state.orders}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item}) => (
                        <TouchableOpacity style={styles.style} onPress={() => this.props.navigation.push('OrderHistoryDetail', item)}>
                            <View style={{flexDirection: 'row', margin: 20, justifyContent: 'space-between'}}>
                                <Text style={{fontWeight: 'bold', fontSize: 17}}>{item.order.name}</Text>
                                <Text style={{fontSize: 17}}>${item.total}</Text>
                            </View>
                            <Text style={{fontWeight: 'bold', fontSize: 17, marginLeft: 20}}>Order Placed: <Text style={{fontWeight: 'normal'}}>{new Date(item.timestamp).toDateString() + " " + new Date(item.timestamp).toLocaleString().split(" ")[1]}</Text></Text>
                        </TouchableOpacity>
                    )}
                />
                <CustomButton title='Refresh' onPress={() => this.getOrders()} />
            </View>
        )
    }
}

// https://ethercreative.github.io/react-native-shadow-generator/
const styles = new StyleSheet.create({
    style: {
        height: 110,
        width: '95%',
        borderRadius: 10,
        marginTop: 20,
        alignSelf:'center',
        shadowColor: "#000",
        backgroundColor: 'white',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }
})