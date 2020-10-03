import React from 'react'

import {TouchableOpacity, Text, StyleSheet } from 'react-native'


export default class CustomButton extends React.Component {

    render() {
        return(
            <TouchableOpacity onPress={this.props.onPress} style={styles.mainStyle}>
                <Text style={styles.textStyle}>{typeof(this.props.title) === 'undefined' ? 'Continue' : this.props.title}</Text>
            </TouchableOpacity>
        )
    }

}

const styles = new StyleSheet.create({
    
    mainStyle: {
        height: 47,
        backgroundColor: '#E8015A',
        marginLeft: 16,
        marginRight: 16,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 10,
        justifyContent: 'center'
    },

    textStyle: {
        alignSelf: 'center',
        fontWeight: '500',
        color: 'white',
        fontSize: 17
    }
    
})