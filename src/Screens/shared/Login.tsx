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
  Alert,
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
import { Constants } from "expo";
import * as Device from "expo-device";
import * as LocalAuthentication from "expo-local-authentication";
import { ClientMessage } from "../../SharedEntity/SMXException";

const { width: viewportWidth, height: viewportHeight } = Dimensions.get(
  "window"
);
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
  secureTextEntry: boolean;
  compatible?: "";
  deviceName?: string;
  hasTouchIDSupport?: boolean;
  hasFaceIDSupport?: boolean;
}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class Login extends Component<iProps, iState> {
  constructor(props: iProps) {
    super(props);
    this.state = {
      IsLoading: false,
      expoToken: "",
      secureTextEntry: true,
      hasTouchIDSupport: false,
      hasFaceIDSupport: false,
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
        deviceName: Device.deviceName,
      });

      const hasHardwareSupport =
        (await LocalAuthentication.hasHardwareAsync()) &&
        (await LocalAuthentication.isEnrolledAsync());

      if (hasHardwareSupport) {
        if (Platform.OS == 'ios') {
          this.setState({
            hasFaceIDSupport: true,
          });
        }
        this.setState({
          hasTouchIDSupport : !this.state.hasFaceIDSupport
        })
      }
    } catch (ex) {
      console.log(ex);
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
      request.DeviceName = this.state.deviceName;
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
      this.props.navigation.navigate("OTP");
    } catch (e) {
      // Tắt loading
      this.setState({
        IsLoading: false,
      });
      this.props.GlobalStore!.Exception! = e;

      //alert(e);
    }
  }
  async onFaceId() {
    try {
      // Checking if device is compatible
      const isCompatible = await LocalAuthentication.hasHardwareAsync();

      if (!isCompatible) {
        throw new Error("Your device isn't compatible.");
      }

      // Checking if device has biometrics records
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!isEnrolled) {
        throw new Error("Không hỗ trợ sinh trắc học.");
      }

      // Authenticate user
      var checkSuccess = await LocalAuthentication.authenticateAsync();
      if(checkSuccess.success == true)
      {
        this.LoginFinger();
      }
    } catch (error) {
      Alert.alert("An error as occured", error?.message);
    }
  }

  async LoginFinger() {
    try {
      this.setState({
        IsLoading: true, // Bật loading
      });

      let request = new AuthenticationParam();
      request.UserName = this.state.userName;
      request.DeviceName = this.state.deviceName;
      if (request.UserName === null || request.UserName === "") {
        throw "Vui lòng cung cấp tên đăng nhập.";
      }

      // Post thông tin đăng nhập
      let response: any = await HttpUtils.post<AuthenticationParam>(
        ApiUrl.AuthenticationFinger_Login,
        "LoginFinger",
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
      this.props.navigation.navigate("OTP");
    } catch (e) {
      // Tắt loading
      this.setState({
        IsLoading: false,
      });
      this.props.GlobalStore.Exception = e;

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
  checkDeviceForHardware = async () => {
    let compatible = await LocalAuthentication.hasHardwareAsync();
  };
  checkForFingerprints = async () => {
    let fingerprints = await LocalAuthentication.isEnrolledAsync();
  };
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
              <Text style={{ fontWeight: "600", fontSize: 32 }}>Đăng nhập</Text>
              <View
                style={{
                  flexDirection: "row",
                  marginHorizontal: 5,
                  marginBottom: 10,
                  marginTop: 30,
                  borderColor: "#9562DD",
                  borderWidth: 1,
                  borderRadius: 6,
                  height: 50,
                }}
              >
                <View style={[styles.icon, { paddingTop: 15 }]}>
                  <FontAwesome5 name="user" size={20} color="#9562DD" />
                </View>
                <View
                  style={{
                    width: 1,
                    backgroundColor: "#9562DD",
                    marginVertical: 8,
                  }}
                ></View>
                <TextInput
                  style={[styles.textinput, { color: "#000000" }]}
                  placeholder="Tên đăng nhập"
                  value={this.state.userName}
                  onChangeText={(val) => {
                    this.setState({ userName: val });
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  marginHorizontal: 32,
                  marginBottom: 10,
                  marginTop: 10,
                  borderColor: "#9562DD",
                  borderWidth: 1,
                  borderRadius: 6,
                  height: 50,
                }}
              >
                <View style={[styles.icon, { paddingTop: 15 }]}>
                  <FontAwesome5 name="key" size={20} color="#9562DD" />
                </View>
                <View
                  style={{
                    width: 1,
                    backgroundColor: "#9562DD",
                    marginVertical: 8,
                  }}
                ></View>
                <TextInput
                  style={[styles.textinput, { color: "#000000" }]}
                  secureTextEntry={this.state.secureTextEntry}
                  placeholder="Mật khẩu"
                  value={this.state.passWord}
                  onChangeText={(val) => {
                    this.setState({ passWord: val });
                  }}
                />
                <TouchableOpacity
                  style={[styles.icon, { paddingTop: 15 }]}
                  onPress={() =>
                    this.setState({
                      secureTextEntry: !this.state.secureTextEntry,
                    })
                  }
                >
                  {this.state.secureTextEntry ? (
                    <FontAwesome5 name="eye" size={20} color="#FF9800" />
                  ) : (
                    <FontAwesome5 name="eye-slash" size={18} color="#FF9800" />
                  )}
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={{ height: 30, width: 30 }}
                onPress={() => {
                  this.onFaceId();
                }}
              >
                {this.state.hasFaceIDSupport == true ? (
                <ImageBackground
                  source={require("../../../assets/face_id.png")}
                  style={{
                    height: 50,
                    width: 50,
                    opacity: 0.6,
                    position: "absolute",
                  }}
                /> 
                ) : (
                 <ImageBackground
                  source={require("../../../assets/finger_print.png")}
                  style={{
                    height: 50,
                    width: 50,
                    opacity: 0.6,
                    position: "absolute",
                  }}
                />
                )
              }
              </TouchableOpacity>
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
                <Text
                  style={{ color: "#FFF", fontSize: 18, textAlign: "center" }}
                ></Text>
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
    padding: 5,
  },
  icon: {
    borderTopStartRadius: 5,
    borderBottomStartRadius: 5,
    padding: 8,
  },
});
