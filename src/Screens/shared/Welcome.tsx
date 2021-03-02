import React, { Component } from "react";
import {
    Text,
    View,
    StyleSheet,
    Image,
    Dimensions,
    Alert,
    ActivityIndicator,
    Linking,
    Platform,
    ImageBackground,
    Easing,
    Vibration,
} from "react-native";
import EnvConfig from "../../Utils/EnvConfig";
import CopyRight from "../../common_controls/CopyRight";
import ApiUrl from "../../constants/ApiUrl";
import HttpUtils from "../../Utils/HttpUtils";
import AppInfomation from "../../Entities/AppInfomation";
import * as Device from "expo-device";
import GlobalCache from "../../Caches/GlobalCache";
import { inject, observer } from "mobx-react";
import SMX from "../../constants/SMX";
import * as Animatable from "react-native-animatable";
import { GlobalDto } from "../../DtoParams/GlobalDto";
import LogManager from "../../Utils/LogManager";

const screen_width = Dimensions.get("window").width;
const { width, height } = Dimensions.get("window");

@inject(SMX.StoreName.GlobalStore)
@observer
export default class Welcome extends Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {};
    }

    async componentDidMount() {
        const { springValue, LogoText } = this.state;
        // Animated.sequence([
        //     Animated.timing(LogoText, {
        //         toValue: 1,
        //         duration: 1500,
        //       })
        // ]).start();

        // Animated.spring(
        //     springValue,{
        //         toValue: 120,
        //         friction:1,
        //         tension:1
        //     }
        // ).start();

        await this.initApplication();
    }

    // Kiểm tra version khi bắt đầu vào ứng dụng
    async initApplication() {
        try {
            console.log("Start init application");

            let request = new GlobalDto();
            request.DeviceInfo = `Model: ${Device.brand}\nDevice: ${
                Device.modelName
            }\nVersion: ${EnvConfig.getVersion()}`;

            let appInfo = await HttpUtils.post<AppInfomation>(
                ApiUrl.Global_GetVersion_Api,
                null,
                JSON.stringify(request),
                false
            );

            // cache api key
            if (Platform.OS == "android") {
                GlobalCache.MapApiKey = appInfo.AndroidGoogleMapKey;
            } else {
                GlobalCache.MapApiKey = appInfo.IosGoogleMapKey;
            }

            if (appInfo.Version != "*") {
                await this.processCheckVersion(appInfo);
            } else {
                setTimeout(() => {
                    this.props.navigation.navigate("SrcLogin");
                }, 3000);
            }
        } catch (ex) {
            this.props.GlobalStore.Exception = ex;
        }
    }

    // Xử lý version lấy được từ server
    async processCheckVersion(data: AppInfomation) {
        const currentVersion = EnvConfig.getVersion();
        if (currentVersion !== data.Version) {
            Alert.alert("THÔNG BÁO", "Ứng dụng đã có bản nâng cấp, vui lòng tải bản mới nhất. " + data.Version, [
                { text: "Đồng ý", onPress: () => this.processUpdate(data) },
            ]);
        } else {
            setTimeout(() => {
                this.props.navigation.navigate("SrcLogin");
            }, 3000);
        }
    }
    async processUpdate(data: AppInfomation) {
        var newPackageUrl: string;

        if (Platform.OS === "ios") {
            newPackageUrl = data.IosAppLink;
        } else {
            newPackageUrl = data.AndroidAppLink;
        }

        // Kiểm tra xem có thể mở được link không
        let allowOpen = await Linking.canOpenURL(newPackageUrl);

        if (allowOpen) {
            Linking.openURL(newPackageUrl);
        } else {
            Alert.alert("LỖI", "Không thể thực hiện tải ứng dụng. Vui lòng liên hệ với bộ phận IT để được hỗ trợ.");
        }
    }
    render() {
        // const spin = this.state.springValue.interpolate({
        //     inputRange: [0, 1],
        //     outputRange: ["0deg", "360deg"],
        // });
        return (
            <ImageBackground style={{ flex: 1 }} source={require("../../../assets/background.png")}>
                <View style={{ flexGrow: 0.35 }}>
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        {/* <Animatable.View
                            animation="fadeInLeftBig"
                            direction="normal"
                            delay={1000}
                            style={{ alignItems: "center", transform: [{ rotate: spin }] }}
                        >
                            <Image
                                style={{ width: "80%", height: 100, resizeMode: "contain" }}
                                source={require("../../../assets/EC_Logo.png")}
                            />
                        </Animatable.View> */}
                    </View>
                    <View style={{ alignItems: "center" }}></View>
                </View>
                <ActivityIndicator
                    animating={true}
                    size={"large"}
                    color={"#568EFF"}
                    style={{
                        position: "absolute",
                        zIndex: 300000,
                        bottom: height / 5,
                        left: width / 2 - 15,
                    }}
                />
            </ImageBackground>
        );
    }
}
const styles = StyleSheet.create({
    body: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
});
