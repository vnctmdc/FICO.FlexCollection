import React, { Component } from "react";
import {
    Text,
    View,
    Alert,
    TouchableOpacity,
    ScrollView,
    Button,
    BackHandler,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Image,
    Dimensions,
    ImageBackground,
    Keyboard,
    StatusBar,
} from "react-native";
import Theme from "../Themes/Default";
import ApiUrl from "../constants/ApiUrl";
import { WebView } from "react-native-webview";
import Toolbar from "../components/Toolbar";
import HttpUtils from "../Utils/HttpUtils";
import SMX from "../constants/SMX";
import { inject, observer } from "mobx-react";
import GlobalStore from "../Stores/GlobalStore";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import GlobalCache from "../Caches/GlobalCache";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import LogManager from "../Utils/LogManager";
import MarkerObject from "../SharedEntity/MarkerObject";

const { width, height } = Dimensions.get("window");

interface iProps {
    navigation: any;
    GlobalStore: GlobalStore;
}

interface iState { }

@inject(SMX.StoreName.GlobalStore)
@observer
export default class Home extends Component<iProps, iState> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    async componentDidMount() {
        await this.getLocationAsync();
        BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);

        Keyboard.addListener("keyboardWillShow", this.onKeyboardShow);
        StatusBar.setBarStyle("dark-content");
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);

        Keyboard.removeListener("keyboardWillShow", this.onKeyboardShow);
        StatusBar.setBarStyle("dark-content");
    }

    onKeyboardShow = () => {
        StatusBar.setBarStyle("dark-content");
    };

    handleBackPress = () => {
        return true;
    };

    async getLocationAsync() {
        try {
            let statusAfter: any = null;
            let { status } = await Permissions.getAsync(Permissions.LOCATION);
            if (status !== "granted") {
                LogManager.Log("Not permission");
                statusAfter = (await Permissions.askAsync(Permissions.LOCATION)).status;
                if (statusAfter !== "granted") {
                    LogManager.Log("Not permission");
                    return;
                }
            }

            let location = await Location.getCurrentPositionAsync({});
            LogManager.Log("Location origin: " + JSON.stringify(location));
            this.setState({
                location: new MarkerObject(1, location.coords.latitude, location.coords.longitude, "Vị trí hiện tại"),
            });
        } catch (ex) {
            LogManager.Log("Get Location Error: " + ex.toString());
        }
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "#ebebfa" }}>
                <Toolbar Title="Định giá tài sản" navigation={this.props.navigation} HasDrawer={true}>
                    <View style={{ marginLeft: 15 }}>
                        <TouchableOpacity activeOpacity={0.5} onPress={() => {
                            this.props.navigation.navigate("ProfilesSrc");
                        }}>
                            <FontAwesome5 name="user" size={23} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </Toolbar>
                {/* <View style={{ marginTop: 80 }}>
                    <WebView                        
                        onLoadStart={this.props.GlobalStore.ShowLoading}
                        onLoadEnd={this.props.GlobalStore.HideLoading}
                        source={{ uri: `${ApiUrl.Home_Chart}?token=${GlobalCache.UserToken}` }}
                    />
                </View> */}
                <ScrollView style={{ marginTop: 10 }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            paddingHorizontal: 10,
                            justifyContent: 'space-between',
                            marginBottom: 10
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                borderColor: "#F0F0F4",
                                borderWidth: 1,
                                borderRadius: 8,
                                paddingHorizontal: 10,
                                //paddingVertical: 15,
                                backgroundColor: "#FFFFFF",
                                justifyContent: "center",
                                width: width / 2 - 20
                            }}
                            onPress={() => {
                                this.props.navigation.navigate("ValuationREs");
                            }}
                        >
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <View>
                                    <Image
                                        style={{
                                            backgroundColor: "gainsboro",
                                            width: width / 2 - 22,
                                            height: 150,
                                        }}
                                        source={require("../../assets/images/real_estate.jpg")}
                                    />
                                </View>
                                <View style={{ marginVertical: 2, alignItems: "center", justifyContent: "center" }}>
                                    <Text style={{ paddingLeft: 8, fontSize: 17 }}>Tính giá nhanh</Text>
                                    <Text style={{ paddingLeft: 8, fontSize: 17 }}>Nhà đất phổ thông</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                borderColor: "#F0F0F4",
                                borderWidth: 1,
                                borderRadius: 8,
                                paddingHorizontal: 10,
                                //paddingVertical: 15,
                                backgroundColor: "#FFFFFF",
                                justifyContent: "center",
                                width: width / 2 - 20
                            }}
                            onPress={() => {
                                this.props.navigation.navigate("ValuationCondominiums");
                            }}
                        >
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <View>
                                    <Image
                                        style={{
                                            backgroundColor: "gainsboro",
                                            width: width / 2 - 22,
                                            height: 150,
                                        }}
                                        source={require("../../assets/images/condominium.jpg")}
                                    />
                                </View>
                                <View style={{ marginVertical: 2, alignItems: "center", justifyContent: "center" }}>
                                    <Text style={{ paddingLeft: 8, fontSize: 17 }}>Tính giá nhanh</Text>
                                    <Text style={{ paddingLeft: 8, fontSize: 17 }}>Chung cư</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            paddingHorizontal: 10,
                            justifyContent: 'space-between',
                            marginBottom: 10
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                borderColor: "#F0F0F4",
                                borderWidth: 1,
                                borderRadius: 8,
                                paddingHorizontal: 10,
                                //paddingVertical: 15,
                                backgroundColor: "#FFFFFF",
                                justifyContent: "center",
                                width: width / 2 - 20
                            }}
                            onPress={() => {
                                this.props.navigation.navigate("ValuationVehicles");
                            }}
                        >
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <View>
                                    <Image
                                        style={{
                                            backgroundColor: "gainsboro",
                                            width: width / 2 - 22,
                                            height: 150,
                                        }}
                                        source={require("../../assets/images/car.jpg")}
                                    />
                                </View>
                                <View style={{ marginVertical: 2, alignItems: "center", justifyContent: "center" }}>
                                    <Text style={{ marginBottom: 20, paddingLeft: 8, fontSize: 17 }}>
                                        Tính giá nhanh Oto
                                        </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                borderColor: "#F0F0F4",
                                borderWidth: 1,
                                borderRadius: 8,
                                paddingHorizontal: 10,
                                //paddingVertical: 15,
                                backgroundColor: "#FFFFFF",
                                justifyContent: "center",
                                width: width / 2 - 20
                            }}
                            onPress={() => {
                                this.props.navigation.navigate("DanhSachTSKhaoSat");
                            }}
                        >
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <View>
                                    <Image
                                        style={{
                                            backgroundColor: "gainsboro",
                                            width: width / 2 - 22,
                                            height: 150,
                                        }}
                                        source={require("../../assets/images/workfield.png")}
                                    />
                                </View>
                                <View style={{ marginVertical: 2, alignItems: "center", justifyContent: "center" }}>
                                    <Text style={{ paddingLeft: 8, fontSize: 17 }}>
                                        Danh sách
                                        </Text>
                                        <Text style={{ paddingLeft: 8, fontSize: 17 }}>TS khảo sát</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            paddingHorizontal: 10,
                            justifyContent: 'space-between',
                            marginBottom: 10
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                borderColor: "#F0F0F4",
                                borderWidth: 1,
                                borderRadius: 8,
                                paddingHorizontal: 10,
                                //paddingVertical: 15,
                                backgroundColor: "#FFFFFF",
                                justifyContent: "center",
                                width: width / 2 - 20
                            }}
                            onPress={() => {
                                this.props.navigation.navigate("DanhsachBCDGChoDuyet");
                            }}
                        >
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <View>
                                    <Image
                                        style={{
                                            backgroundColor: "gainsboro",
                                            width: width / 2 - 22,
                                            height: 150,
                                        }}
                                        source={require("../../assets/images/approval.png")}
                                    />
                                </View>
                                <View style={{ marginVertical: 2, alignItems: "center", justifyContent: "center" }}>
                                    <Text style={{ paddingLeft: 8, fontSize: 17 }}>
                                        Danh sách
                                        </Text>
                                        <Text style={{ paddingLeft: 8, fontSize: 17 }}>BCĐG chờ duyệt</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                borderColor: "#F0F0F4",
                                borderWidth: 1,
                                borderRadius: 8,
                                paddingHorizontal: 10,
                                //paddingVertical: 15,
                                backgroundColor: "#FFFFFF",
                                justifyContent: "center",
                                width: width / 2 - 20
                            }}
                            onPress={() => {
                                this.props.navigation.navigate("DSHoSoDangDinhGia");
                            }}
                        >
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <View>
                                    <Image
                                        style={{
                                            backgroundColor: "gainsboro",
                                            width: width / 2 - 22,
                                            height: 150,
                                        }}
                                        source={require("../../assets/images/valuation.jpg")}
                                    />
                                </View>
                                <View style={{marginVertical: 2, alignItems: "center", justifyContent: "center" }}>
                                    <Text style={{ paddingLeft: 8, fontSize: 17 }}>
                                        Danh sách
                                        </Text>
                                        <Text style={{ paddingLeft: 8, fontSize: 17 }}>hồ sơ đang định giá</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }
}
