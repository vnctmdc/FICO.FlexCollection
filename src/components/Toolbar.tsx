import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AuthenticationService from "../Utils/AuthenticationService";
import AntDesign from "react-native-vector-icons/AntDesign";

interface iProps {
    Title: string;
    navigation: any;
    HasDrawer?: boolean;
    HasBottomTab?: boolean;
}

export default class Toolbar extends React.Component<iProps, any> {
    renderContent() {
        if (this.props.HasDrawer) {
            return (
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                    }}
                >
                    <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
                        <AntDesign name={"menufold"} size={25} color={"#FFFFFF"} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 19, fontWeight: "600", marginLeft: 10, color: "#FFFFFF" }}>
                        {this.props.Title}
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>{this.props.children}</View>
                </View>
            );
        }
        if (this.props.HasBottomTab) {
            return (
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                    }}
                >
                    <View></View>
                    <Text style={{ fontSize: 19, fontWeight: "600", marginLeft: 10, color: "#FFFFFF" }}>
                        {this.props.Title}
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>{this.props.children}</View>
                </View>
            );
        }
        if (this.props.HasDrawer === undefined && this.props.HasBottomTab === undefined) {
            return (
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                    }}
                >
                    <TouchableOpacity activeOpacity={0.5} onPress={() => this.props.navigation.goBack()}>
                        <AntDesign name={"left"} size={25} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 19, fontWeight: "600", marginLeft: 10, color: "#FFFFFF" }}>
                        {this.props.Title}
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>{this.props.children}</View>
                </View>
            );
        }
    }

    render() {
        return (
            <View
                style={{
                    height: 80,
                    backgroundColor: "#7B35BB",
                    flexDirection: "row",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    paddingBottom: 10,
                    paddingHorizontal: 10,
                    shadowColor: "gray",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.5,
                    shadowRadius: 2,
                    elevation: 5,
                    zIndex: 999999999999999,
                }}
            >
                {/* <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                    {this.props.HasDrawer ? (
                    //         <TouchableOpacity activeOpacity={0.5} onPress={() => this.props.navigation.openDrawer()}>
                    //             <FontAwesome5 name="bars" size={25} />
                    //         </TouchableOpacity>
                    //     ) : (
                    //         <TouchableOpacity activeOpacity={0.5} onPress={() => this.props.navigation.goBack()}>
                    //             <FontAwesome5 name={"arrow-left"} size={25} />
                    //         </TouchableOpacity>
                    //     )}
                </View> */}
                {this.renderContent()}
            </View>
        );
    }
}
