import React from 'react'

import {View, TextInput, StyleSheet, Platform } from 'react-native'


export default class CustomInput extends React.Component {

    render() {
        return(
            <View style={styles.mainStyle}>
                <TextInput
                    style={styles.textInputStyle}
                    placeholder={this.props.placeholder}
                    value={this.props.value}
                    onChangeText={this.props.onChangeText}
                    onSubmitEditing={this.props.onSubmitEditing}
                    secureTextEntry={typeof(this.props.secure) === 'undefined' ? false : this.props.secure} />
            </View>
        )
    }

}

const styles = new StyleSheet.create({
    
    mainStyle: {
        height: 47,
        backgroundColor: 'rgb(233, 233, 233)',
        marginLeft: 16,
        marginRight: 16,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 10
    },

    textInputStyle: {
        marginLeft: 16,
        marginRight: 16,
        marginTop: Platform.OS === 'ios' ? 16 : 10
    }
    
})