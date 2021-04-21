import React, { Component } from "react";
import { Text, StyleSheet, View, Button, TextInput, KeyboardAvoidingView, TouchableOpacity,Image } from "react-native";
import Modal from "react-native-modal";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

interface iProp {
    modalVisible: boolean;
    title?: string;
    resetState: () => void;
}

export default class PopupModalViolet extends Component<iProp, any> {

    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Modal
                isVisible={this.props.modalVisible}
                animationIn="slideInDown"
                animationInTiming={400}
                animationOut="slideOutUp"
                animationOutTiming={400}
                backdropOpacity={0.5}
                backdropTransitionInTiming={0}
                backdropTransitionOutTiming={0}
            >
                <KeyboardAvoidingView
                    behavior="position" style={{ flex: 1 }}
                    keyboardVerticalOffset={-150}
                >
                    <View style={styles.container}>
                        <View style={[styles.modalHeader, { alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'gainsboro', backgroundColor: '#FFFFFF' }]}>
                            <View style={{ flexDirection:'row'}}>
                                <Image
                                    style={{ paddingTop: 5 , width:30,height:30}}
                                    source={require("../../assets/thumbnail_image_u1797.png")}
                                />
                                <Text style={styles.title}>{this.props.title}</Text>
                            </View>
                            <View style={{ marginRight: 1 }}>
                                <TouchableOpacity
                                    style={{
                                        paddingTop: 5,
                                        paddingRight: 8,
                                        justifyContent: "center",
                                    }}
                                    onPress={() => this.props.resetState()}
                                >
                                    <FontAwesome5 name="times" size={24} color="#ae55e6" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.modalBody}>{this.props.children}</View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 80,
        left: 0,
        right: 0,
        //marginLeft: "5%",
        //marginRight: "5%",
        borderRadius: 10,
        shadowOpacity: 0.3,
        //marginTop: 64,
        //backgroundColor: "red",
    },
    modalHeader: {
        backgroundColor: "#FFF",
        height: 45,
        paddingLeft: 5,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        flexDirection: 'row',
        justifyContent: "space-between",
    },
    modalBody: {
        padding: 10,
        backgroundColor: "white",
        borderColor: "#FFF",
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
    },
    title: {
        paddingLeft: 8,
        paddingTop: 5,
        fontSize: 20,
        textAlign: "center",
        color: "#ae55e6",
        fontWeight: "600"
    },
});
