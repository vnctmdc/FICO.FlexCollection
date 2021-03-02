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
    TextInput,
    Switch,
} from "react-native";
import Theme from "../../../Themes/Default";
import ApiUrl from "../../../constants/ApiUrl";
import { WebView } from "react-native-webview";
import Toolbar from "../../../components/Toolbar";
import HttpUtils from "../../../Utils/HttpUtils";
import SMX from "../../../constants/SMX";
import { inject, observer } from "mobx-react";
import GlobalStore from "../../../Stores/GlobalStore";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import GlobalCache from "../../../Caches/GlobalCache";
import QuickValuationDto from "../../../DtoParams/QuickValuationDto";
import SystemParameter from "../../../Entities/SystemParameter";
import { LinearGradient } from "expo-linear-gradient";
import { TextInputMask } from "react-native-masked-text";
import DropDownBox from "../../../components/DropDownBox";

const { width, height } = Dimensions.get("window");

interface iProps {
    navigation: any;
    GlobalStore: GlobalStore;
}

interface iState {
    LstProvince?: SystemParameter[];
    ProvinceID?: number;
    LstDistrict?: SystemParameter[];
    DistrictID?: number;
    LstBuilding?: SystemParameter[];
    BuildingID?: number;
    Area?: string;
    MarketUnitPrice?: string;
    PlusIsCornerYes: boolean;
    PlusIsCornerNo: boolean;
    MinusNearGarbageRoomYes: boolean;
    MinusNearGarbageRoomNo: boolean;
    MinusOtherYes?: boolean;
    MinusOtherNo?: boolean;
    TotalPrice?: string;
    txtOTP?: string;

}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class QuickValuationCondominiumsScr extends Component<iProps, iState> {
    constructor(props: any) {
        super(props);
        this.state = {
            LstProvince: [],
            LstDistrict: [],
            LstBuilding: [],
            Area: '',
            MarketUnitPrice: '',
            PlusIsCornerYes: false,
            PlusIsCornerNo: true,
            MinusNearGarbageRoomYes: false,
            MinusNearGarbageRoomNo: true,
            MinusOtherYes: false,
            MinusOtherNo: true,
            TotalPrice: '',
            txtOTP: ''
        };
    }
    async componentDidMount() {
        await this.SetUpForm();
    }

    async SetUpForm() {
        this.props.GlobalStore.ShowLoading();
        let res = await HttpUtils.post<QuickValuationDto>(
            ApiUrl.QuickValuation_Execute,
            SMX.ApiActionCode.SetupViewCondominiumForm,
            JSON.stringify(new QuickValuationDto())
        );

        if (res) {
            this.setState({
                LstProvince: res!.LstProvince!
            });
        }

        this.props.GlobalStore.HideLoading();

    }

    async GetDistrictByProvince() {
        try {
            let req = new QuickValuationDto();
            req.ProvinceID = this.state.ProvinceID;

            let res = await HttpUtils.post<QuickValuationDto>(
                ApiUrl.QuickValuation_Execute,
                SMX.ApiActionCode.SetupViewCondominiumForm,
                JSON.stringify(req)
            );

            this.setState({
                LstDistrict: res!.LstDistrict!,
            });
        } catch (ex) {
            this.props.GlobalStore.Exception = ex;
        }
    }

    async GetBuildingsByDistrict() {
        try {
            let req = new QuickValuationDto();
            req.DistrictID = this.state.DistrictID;

            let res = await HttpUtils.post<QuickValuationDto>(
                ApiUrl.QuickValuation_Execute,
                SMX.ApiActionCode.SetupViewCondominiumForm,
                JSON.stringify(req)
            );

            this.setState({
                LstBuilding: res!.LstBuilding!,
            });
        } catch (ex) {
            this.props.GlobalStore.Exception = ex;
        }
    }

    async Calculate_Price() {
        try {
            this.props.GlobalStore.ShowLoading();
            let req = new QuickValuationDto();
            req.ActionCode = SMX.ActionCode.Calculate_Price;

            let res = await HttpUtils.post<QuickValuationDto>(
                ApiUrl.QuickValuation_Execute,
                SMX.ApiActionCode.ValuationCondominiums,
                JSON.stringify(new QuickValuationDto())
            );

            if (res) {
                //this.setState({ Employee: res!.Employee! });
            }

            this.props.GlobalStore.HideLoading();
        } catch (ex) {

        }

    }

    async Verify_OTP() {
        try {
            this.props.GlobalStore.ShowLoading();
            let req = new QuickValuationDto();
            req.ActionCode = SMX.ActionCode.Verify_OTP;

            this.props.GlobalStore.HideLoading();
        } catch (ex) {
            this.props.GlobalStore.HideLoading();
            this.props.GlobalStore.Exception = ex;
        }
    }

    render() {
        return (
            <View style={{ height: height, backgroundColor: "#FFF" }}>
                <Toolbar Title="Tính giá nhanh Chung cư" navigation={this.props.navigation} HasDrawer={true} />
                <KeyboardAvoidingView behavior="height" style={{ flex: 1, padding: 10 }}>
                    <ScrollView>
                        <View>
                            <View style={[styles.Item, { marginBottom: 10 }]}>
                                <Text style={{ fontWeight: '600', fontSize: 18 }}>
                                    I. THÔNG TIN CƠ BẢN VỀ BĐS
                                </Text>
                            </View>
                            <View style={styles.Item}>
                                <View style={{ flex: 2, flexDirection: 'row' }}>
                                    <Text >Tỉnh/Thành phố </Text>
                                    <Text style={{ color: 'red' }}>*</Text>
                                </View>
                                <View style={{ flex: 3 }}>
                                    <DropDownBox
                                        TextField="Name"
                                        ValueField="SystemParameterID"
                                        DataSource={this.state.LstProvince}
                                        SelectedValue={this.state.ProvinceID}
                                        OnSelectedItemChanged={(item) => {
                                            this.setState({ ProvinceID: item.SystemParameterID },
                                                async () => {
                                                    await this.GetDistrictByProvince();
                                                });
                                        }}
                                    ></DropDownBox>
                                </View>
                            </View>
                            <View style={styles.Item}>
                                <View style={{ flex: 2, flexDirection: 'row' }}>
                                    <Text >Quận/Huyện </Text>
                                    <Text style={{ color: 'red' }}>*</Text>
                                </View>
                                <View style={{ flex: 3 }}>
                                    <DropDownBox
                                        TextField="Name"
                                        ValueField="SystemParameterID"
                                        DataSource={this.state.LstDistrict}
                                        SelectedValue={this.state.DistrictID}
                                        OnSelectedItemChanged={(item) => {
                                            this.setState(
                                                { DistrictID: item.SystemParameterID },
                                                async () => {
                                                    await this.GetBuildingsByDistrict();
                                                }
                                            );
                                        }}
                                    ></DropDownBox>
                                </View>
                            </View>
                            <View style={styles.Item}>
                                <View style={{ flex: 2, flexDirection: 'row' }}>
                                    <Text >Tên tòa nhà/Dự án/Khu đô thị </Text>
                                    <Text style={{ color: 'red' }}>*</Text>
                                </View>
                                <View style={{ flex: 3 }}>
                                    <DropDownBox
                                        TextField="Name"
                                        ValueField="SystemParameterID"
                                        DataSource={this.state.LstBuilding}
                                        SelectedValue={this.state.BuildingID}
                                        OnSelectedItemChanged={(item) => {
                                            this.setState({ BuildingID: item.SystemParameterID });
                                        }}
                                    ></DropDownBox>
                                </View>
                            </View>
                            <View style={styles.Item}>
                                <View style={{ flex: 2, flexDirection: 'row' }}>
                                    <Text>Diện tích (m2) </Text>
                                    <Text style={{ color: 'red' }}>*</Text>
                                </View>
                                <View style={{ flex: 3 }}>
                                    <TextInputMask
                                        type={"only-numbers"}
                                        options={{
                                            precision: 0,
                                            separator: ".",
                                            delimiter: ",",
                                            unit: "",
                                            suffixUnit: "",
                                        }}
                                        value={this.state.Area}
                                        style={[Theme.TextInput]}
                                        onChangeText={(val) => {
                                            this.setState({ Area: val });
                                        }}
                                    />
                                </View>
                            </View>
                            <View style={styles.Item}>
                                <View style={{ flex: 2, flexDirection: 'row' }}>
                                    <Text style={{ fontWeight: '600' }}>Đơn giá (đồng) </Text>
                                </View>
                                <View style={{ flex: 3, borderWidth: 1, borderColor: "#acacac", borderRadius: 5 }}>
                                    <TextInput
                                        style={{ color: "#1B2031", marginHorizontal: 7, marginVertical: 10 }}
                                        value={this.state.MarketUnitPrice}
                                    />
                                </View>
                            </View>
                            <View style={[styles.Item, { marginTop: 20, marginBottom: 10 }]}>
                                <Text style={{ fontWeight: '600', fontSize: 18 }}>
                                    II. CÁC YẾU TỐ THUẬN LỢI
                                </Text>
                            </View>
                            <View style={styles.ItemNote}>
                                <View style={{ flex: 2, flexDirection: 'row' }}>
                                    <Text>Căn góc </Text>
                                    <Text style={{ color: 'red' }}>*</Text>
                                </View>
                            </View>
                            <View style={{ paddingLeft: width / 3, flexDirection: "row", alignItems: "center", padding: 10 }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Switch
                                        trackColor={{ true: "#FF9800", false: "#E0E4E9" }}
                                        thumbColor={"#FFFFFF"}
                                        value={this.state.PlusIsCornerYes}
                                        onValueChange={(val) => {
                                            if (val == true) this.setState({ PlusIsCornerNo: false });
                                            else this.setState({ PlusIsCornerNo: true });
                                            this.setState({ PlusIsCornerYes: val });
                                        }}
                                    />
                                    <Text style={{ marginLeft: 3 }}>Có</Text>
                                </View>

                                <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 30 }}>
                                    <Switch
                                        trackColor={{ true: "#FF9800", false: "#E0E4E9" }}
                                        thumbColor={"#FFFFFF"}
                                        value={this.state.PlusIsCornerNo}
                                        onValueChange={(val) => {
                                            if (val == true) this.setState({ PlusIsCornerYes: false });
                                            else this.setState({ PlusIsCornerYes: true });
                                            this.setState({ PlusIsCornerNo: val });
                                        }}
                                    />
                                    <Text style={{ marginLeft: 3 }}>Không</Text>
                                </View>
                            </View>

                            <View style={[styles.Item, { marginTop: 20, marginBottom: 10 }]}>
                                <Text style={{ fontWeight: '600', fontSize: 18 }}>
                                    III. CÁC YẾU TỐ KHÔNG THUẬN LỢI
                                </Text>
                            </View>
                            <View style={styles.ItemNote}>
                                <View style={{ flex: 2, flexDirection: 'row' }}>
                                    <Text>Gần nhà thu rác </Text>
                                    <Text style={{ color: 'red' }}>*</Text>
                                </View>
                            </View>
                            <View style={{ paddingLeft: width / 3, flexDirection: "row", alignItems: "center", padding: 10 }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Switch
                                        trackColor={{ true: "#FF9800", false: "#E0E4E9" }}
                                        thumbColor={"#FFFFFF"}
                                        value={this.state.MinusNearGarbageRoomYes}
                                        onValueChange={(val) => {
                                            if (val == true) this.setState({ MinusNearGarbageRoomNo: false });
                                            else this.setState({ MinusNearGarbageRoomNo: true });
                                            this.setState({ MinusNearGarbageRoomYes: val });
                                        }}
                                    />
                                    <Text style={{ marginLeft: 3 }}>Có</Text>
                                </View>

                                <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 30 }}>
                                    <Switch
                                        trackColor={{ true: "#FF9800", false: "#E0E4E9" }}
                                        thumbColor={"#FFFFFF"}
                                        value={this.state.MinusNearGarbageRoomNo}
                                        onValueChange={(val) => {
                                            if (val == true) this.setState({ MinusNearGarbageRoomYes: false });
                                            else this.setState({ MinusNearGarbageRoomYes: true });
                                            this.setState({ MinusNearGarbageRoomNo: val });
                                        }}
                                    />
                                    <Text style={{ marginLeft: 3 }}>Không</Text>
                                </View>
                            </View>
                            <View style={styles.ItemNote}>
                                <View style={{ flex: 2, flexDirection: 'row' }}>
                                    <Text>Các yếu tố bất lợi khác nếu có </Text>
                                    <Text style={{ color: 'red' }}>*</Text>
                                </View>
                            </View>
                            <View style={{ paddingLeft: width / 3, flexDirection: "row", alignItems: "center", padding: 10 }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Switch
                                        trackColor={{ true: "#FF9800", false: "#E0E4E9" }}
                                        thumbColor={"#FFFFFF"}
                                        value={this.state.MinusOtherYes}
                                        onValueChange={(val) => {
                                            if (val == true) this.setState({ MinusOtherNo: false });
                                            else this.setState({ MinusOtherNo: true });
                                            this.setState({ MinusOtherYes: val });
                                        }}
                                    />
                                    <Text style={{ marginLeft: 3 }}>Có</Text>
                                </View>

                                <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 30 }}>
                                    <Switch
                                        trackColor={{ true: "#FF9800", false: "#E0E4E9" }}
                                        thumbColor={"#FFFFFF"}
                                        value={this.state.MinusOtherNo}
                                        onValueChange={(val) => {
                                            if (val == true) this.setState({ MinusOtherYes: false });
                                            else this.setState({ MinusOtherYes: true });
                                            this.setState({ MinusOtherNo: val });
                                        }}
                                    />
                                    <Text style={{ marginLeft: 3 }}>Không</Text>
                                </View>
                            </View>
                            {
                                this.state.TotalPrice ? (
                                    <View>
                                        <View style={[styles.Item, { marginTop: 20 }]}>
                                            <Text style={{ fontWeight: '600', fontSize: 18 }}>
                                                IV. GIÁ TƯ VẤN TẠM TÍNH
                                            </Text>
                                        </View>
                                        <View style={styles.Item}>
                                            <View style={{ flex: 2, flexDirection: 'row' }}>
                                                <Text style={{ fontWeight: '600' }}>Tổng giá (đồng) </Text>
                                            </View>
                                            <View style={{ flex: 3, borderWidth: 1, borderColor: "#acacac", borderRadius: 5 }}>
                                                <TextInput
                                                    style={{ color: "#1B2031", marginHorizontal: 7, marginVertical: 10 }}
                                                    value={this.state.TotalPrice}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                ) : undefined
                            }
                            {
                                !this.state.TotalPrice ? (
                                    <TouchableOpacity
                                        style={{ justifyContent: 'center', alignItems: 'center' }}
                                        onPress={() => {
                                            this.Calculate_Price();
                                        }}
                                    >
                                        <LinearGradient
                                            colors={["#7B35BB", "#5D2E86"]}
                                            style={{
                                                width: width / 3,
                                                height: 50,
                                                backgroundColor: "#007AFF",
                                                borderRadius: 5,
                                                justifyContent: "center",
                                                marginTop: 30,
                                                alignItems: "center",
                                            }}
                                        >
                                            <Text style={Theme.BtnTextGradient}>Tính giá</Text>
                                        </LinearGradient>
                                        <Text style={{ color: "#FFF", fontSize: 18, textAlign: "center" }}></Text>
                                    </TouchableOpacity>
                                ) : undefined
                            }

                            {
                                this.state.TotalPrice ? (
                                    <View>
                                        <View style={[styles.Item, { marginBottom: 10 }]}>
                                            <Text style={{ fontWeight: '600', fontSize: 18 }}>
                                                Xác thực
                                            </Text>
                                        </View>
                                        <View style={styles.Item}>
                                            <View style={{ flex: 2, flexDirection: 'row' }}>
                                                <Text>Mã OTP </Text>
                                                <Text style={{ color: 'red' }}>*</Text>
                                            </View>
                                            <View style={{ flex: 3 }}>
                                                <TextInputMask
                                                    type={"only-numbers"}
                                                    options={{
                                                        precision: 0,
                                                        separator: ".",
                                                        delimiter: ",",
                                                        unit: "",
                                                        suffixUnit: "",
                                                    }}
                                                    value={this.state.txtOTP}
                                                    style={[Theme.TextInput]}
                                                    onChangeText={(val) => {
                                                        this.setState({ txtOTP: val });
                                                    }}
                                                />
                                            </View>
                                        </View>
                                        <TouchableOpacity
                                            style={{ justifyContent: 'center', alignItems: 'center' }}
                                            onPress={() => {
                                                this.Verify_OTP();
                                            }}
                                        >
                                            <LinearGradient
                                                colors={["#7B35BB", "#5D2E86"]}
                                                style={{
                                                    width: width / 3,
                                                    height: 50,
                                                    backgroundColor: "#007AFF",
                                                    borderRadius: 5,
                                                    justifyContent: "center",
                                                    marginTop: 30,
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Text style={Theme.BtnTextGradient}>Xác nhận</Text>
                                            </LinearGradient>
                                            <Text style={{ color: "#FFF", fontSize: 18, textAlign: "center" }}></Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : undefined
                            }

                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    Item: {
        flexDirection: "row",
        paddingVertical: 4,
        alignItems: "center",
        justifyContent: "space-between",
    },
    Item123: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomColor: "gainsboro",
        borderBottomWidth: 1,
    },
    ItemNote: {
        flexDirection: "row",
    },
});