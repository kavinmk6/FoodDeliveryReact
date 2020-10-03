import React from 'react'
import { ScrollView, View, Text, Image } from 'react-native'

export default class OrderHistoryDetailScreen extends React.Component {
    render() {
        return(
            <ScrollView style={{flex: 1}}>
                
                <Image source={{uri: this.props.route.params.order.img}} style={{width: '80%', height: 200, borderRadius: 6, alignSelf: 'center', marginTop: 20}} />

                <View style={{flexDirection: 'row', margin: 20, justifyContent: 'space-between'}}>
                    <Text style={{fontWeight: 'bold', fontSize: 17}}>Name</Text>
                    <Text style={{fontSize: 17}}>{this.props.route.params.order.name}</Text>
                </View>

                <View style={{flexDirection: 'row', margin: 20, justifyContent: 'space-between'}}>
                    <Text style={{fontWeight: 'bold', fontSize: 17}}>SKU</Text>
                    <Text style={{fontSize: 17}}>{this.props.route.params.order.sku}</Text>
                </View>

                <View style={{flexDirection: 'row', margin: 20, justifyContent: 'space-between'}}>
                    <Text style={{fontWeight: 'bold', fontSize: 17}}>Tip</Text>
                    <Text style={{fontSize: 17}}>${this.props.route.params.tip}</Text>
                </View>

                <View style={{flexDirection: 'row', margin: 20, justifyContent: 'space-between'}}>
                    <Text style={{fontWeight: 'bold', fontSize: 17}}>Manual Tip</Text>
                    <Text style={{fontSize: 17}}>${this.props.route.params.manualTip}</Text>
                </View>

                <View style={{flexDirection: 'row', margin: 20, justifyContent: 'space-between'}}>
                    <Text style={{fontWeight: 'bold', fontSize: 17}}>Order placed at</Text>
                    <Text style={{fontSize: 17}}>{new Date(this.props.route.params.timestamp).toDateString() + " " + new Date(this.props.route.params.timestamp).toLocaleString().split(" ")[1]}</Text>
                </View>

                <View style={{flexDirection: 'row', margin: 20, justifyContent: 'space-between'}}>
                    <Text style={{fontWeight: 'bold', fontSize: 17}}>Total</Text>
                    <Text style={{fontSize: 17}}>${this.props.route.params.total}</Text>
                </View>

            </ScrollView>
        )
    }
}