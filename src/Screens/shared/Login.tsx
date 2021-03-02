import React, { Component } from "react";
import {
    Text,
    View,
    Button,
    AsyncStorage,
    Image,
    Switch,
    TextInput,
    StyleSheet,
    KeyboardAvoidingView,
    InteractionManager,
    SafeAreaView,
    Platform,
    ImageBackground,
    Dimensions,
    TouchableOpacity,
    StatusBar,
    Vibration,
} from "react-native";

import LoadingModal from "../../components/LoadingModal";
import CopyRight from "../../common_controls/CopyRight";

import Theme from "../../Themes/Default";
import HttpUtils from "../../Utils/HttpUtils";
import ApiUrl from "../../constants/ApiUrl";
import GlobalCache from "../../Caches/GlobalCache";
import AuthenticationParam from "../../DtoParams/AuthenticationParam";
import { GlobalDto } from "../../DtoParams/GlobalDto";
import GlobalStore from "../../Stores/GlobalStore";
import { inject, observer } from "mobx-react";
import SMX from "../../constants/SMX";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
//@ts-ignore
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";

const { width: viewportWidth, height: viewportHeight } = Dimensions.get("window");
interface iProps {
    GlobalStore?: GlobalStore;
    navigation?: any;
    route?: any;
}

interface iState {
    userName?: string;
    passWord?: string;
    saveLogin?: boolean;
    IsLoading?: boolean;
    expoToken: string;
    notification?: any;
}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class Login extends Component<iProps, iState> {
    constructor(props: iProps) {
        super(props);
        this.state = {
            IsLoading: false,
            expoToken: "",
        };
    }

    async componentDidMount() {
        await this.initApplication();
    }

    async initApplication() {
        // Lấy thông tin đăng nhập từ Local Storage
        try {
            let _userName = await AsyncStorage.getItem("USER_NAME");
            let _passWord = await AsyncStorage.getItem("PASS_WORD");

            // Nếu đã lưu tài khoản thì bật saveLogin
            let _saveLogin: boolean = false;
            if (_userName && _userName !== "" && _passWord && _passWord !== "") {
                _saveLogin = true;
            }
            // Bind thông tin đăng nhập vào State
            this.setState({
                userName: _userName,
                passWord: _passWord,
                saveLogin: _saveLogin,
            });
        } catch (ex) {
            //this.props.GlobalStore!.Exception! = ex;
        }
    }

    async login() {
        try {
            this.setState({
                IsLoading: true, // Bật loading
            });

            let request = new AuthenticationParam();
            request.UserName = this.state.userName;
            request.Password = this.state.passWord;

            if (
                request.UserName === null ||
                request.UserName === "" ||
                request.Password === null ||
                request.Password === ""
            ) {
                throw "Vui lòng cung cấp tên đăng nhập và mật khẩu.";
            }

            // Post thông tin đăng nhập
            let response: any = await HttpUtils.post<AuthenticationParam>(
                ApiUrl.Authentication_Login,
                "Login",
                JSON.stringify(request),
                false
            );

            // Cache token vào global
            GlobalCache.UserToken = response.UserToken;
            GlobalCache.Profile = response.Employee;

            // Nhớ thông tin đăng nhập vào LocalStorage
            await this.rememberLogin();

            // Load cache vào global
            //await this.loadCache();

            this.setState({
                IsLoading: false,
            });

            // Nhảy sang trang home
            this.props.navigation.navigate("Drawers");
        } catch (e) {
            // Tắt loading
            this.setState({
                IsLoading: false,
            });
            this.props.GlobalStore!.Exception! = e;

            //alert(e);
        }
    }

    async rememberLogin() {
        try {
            if (this.state.saveLogin === true) {
                await AsyncStorage.setItem("USER_NAME", this.state.userName);
                await AsyncStorage.setItem("PASS_WORD", this.state.passWord);
            } else {
                await AsyncStorage.removeItem("USER_NAME");
                await AsyncStorage.removeItem("PASS_WORD");
            }
        } catch (e) {
            //this.props.GlobalStore!.Exception! = e;
        }
    }

    render() {
        return (
            <View style={{ flexGrow: 1, backgroundColor: "white" }}>
                <View style={{ marginTop: Platform.OS === "ios" ? 80 : 86 }}></View>
                <View style={styles.body}>
                    <View
                        style={{
                            width: "100%",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Image
                            style={{ height: 80, width: 240, resizeMode: "contain" }}
                            source={require("../../../assets/EC_Logo.png")}
                        />
                    </View>
                    <KeyboardAwareScrollView style={{ flexGrow: 1 }}>
                        <Animatable.View
                            animation="bounceInDown"
                            direction="normal"
                            delay={700}
                            style={{
                                alignItems: "center",
                                borderBottomStartRadius: 18,
                                borderTopStartRadius: 18,
                                borderTopRightRadius: 18,
                                borderBottomRightRadius: 17,
                                padding: 20,
                                marginTop: 40,
                                justifyContent: "space-between",
                            }}
                        >
                            <Text style={{ fontWeight: "bold", fontSize: 22 }}>Đăng nhập</Text>
                            <View
                                style={{ flexDirection: "row", marginHorizontal: 10, marginBottom: 10, marginTop: 30 }}
                            >
                                <View style={styles.icon}>
                                    <AntDesign name="user" size={30} color="FFFFFF" />
                                </View>
                                <TextInput
                                    style={styles.textinput}
                                    placeholder="Tên đăng nhập"
                                    value={this.state.userName}
                                    onChangeText={(val) => {
                                        this.setState({ userName: val });
                                    }}
                                />
                            </View>
                            <View style={{ flexDirection: "row", margin: 10 }}>
                                <View style={styles.icon}>
                                    <AntDesign name="lock" size={30} color="FFFFFF" />
                                </View>
                                <TextInput
                                    style={styles.textinput}
                                    secureTextEntry
                                    placeholder="Mật khẩu"
                                    value={this.state.passWord}
                                    onChangeText={(val) => {
                                        this.setState({ passWord: val });
                                    }}
                                />
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    margin: 10,
                                    paddingTop: 20,
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                    alignSelf: "flex-start",
                                }}
                            >
                                <Switch
                                    value={this.state.saveLogin}
                                    onValueChange={(val) => {
                                        this.setState({ saveLogin: val });
                                    }}
                                />
                                <View style={{ marginLeft: 10 }}>
                                    <Text>Lưu thông tin đăng nhập</Text>
                                </View>
                            </View>
                            <TouchableOpacity

                                onPress={() => {
                                    this.login();
                                }}
                            >
                                <LinearGradient
                                    colors={["#7B35BB", "#5D2E86"]}
                                    style={{
                                        width: viewportWidth - 60,
                                        height: 50,
                                        backgroundColor: "#007AFF",
                                        borderRadius: 5,
                                        justifyContent: "center",
                                        marginTop: 30,
                                        alignItems: "center",
                                    }}
                                >
                                    <Text style={Theme.BtnTextGradient}>Đăng nhập</Text>
                                </LinearGradient>
                                <Text style={{ color: "#FFF", fontSize: 18, textAlign: "center" }}></Text>
                            </TouchableOpacity>
                        </Animatable.View>
                    </KeyboardAwareScrollView>

                    {/* <Animatable.View
                        animation="bounceInDown"
                        direction="normal"
                        delay={500}
                        style={{
                            alignItems: "center",
                            height: "8%",
                        }}
                    >
                        <Text style={{ fontSize: 18, color: "#FFF", textAlign: "center" }}>
                            Copyright © SoftMart 2020
                        </Text>
                    </Animatable.View> */}
                    <LoadingModal Loading={this.state.IsLoading} />
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    body: {
        flexGrow: 1,
        width: viewportWidth,
        height: viewportHeight,
    },
    textinput: {
        width: "80%",
        borderBottomRightRadius: 5,
        borderTopRightRadius: 5,
        padding: 5,
        borderColor: "gainsboro",
        borderTopWidth: Platform.OS === "ios" ? 1 : 1,
        borderBottomWidth: Platform.OS === "ios" ? 1 : 1,
        //borderLeftWidth: Platform.OS === "ios" ? 0.5 : 0,
        borderRightWidth: Platform.OS === "ios" ? 1 : 1,
    },
    icon: {
        borderTopStartRadius: 5,
        borderBottomStartRadius: 5,
        padding: 8,
        borderColor: "gainsboro",
        //borderEndWidth: Platform.OS === "ios" ? 0.5 : 0,
        borderLeftWidth: Platform.OS === "ios" ? 1 : 1,
        borderTopWidth: Platform.OS === "ios" ? 1 : 1,
        borderBottomWidth: Platform.OS === "ios" ? 1 : 1,
    },
});
