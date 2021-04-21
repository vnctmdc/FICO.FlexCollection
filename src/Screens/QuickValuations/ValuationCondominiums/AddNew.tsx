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
import AntDesign from "react-native-vector-icons/AntDesign";
import GlobalCache from "../../../Caches/GlobalCache";
import QuickValuationDto from "../../../DtoParams/QuickValuationDto";
import SystemParameter from "../../../Entities/SystemParameter";
import { LinearGradient } from "expo-linear-gradient";
import { TextInputMask } from "react-native-masked-text";
import DropDownBox from "../../../components/DropDownBox";
import QuickValuationCondominium from "../../../Entities/QuickValuationCondominium";
import { ClientMessage } from "../../../SharedEntity/SMXException";
import Utility from "../../../Utils/Utility";

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
    MinusNearGarbageRoomYes: boolean;
    MinusOtherYes?: boolean;
    TotalPrice?: string;
    txtOTP?: string;
    QuickValuationCondominium?: QuickValuationCondominium;
    VerifyOTP: boolean;
    ShowResult: boolean;
    ShowCalculate: boolean;

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
            MinusNearGarbageRoomYes: false,
            MinusOtherYes: false,
            TotalPrice: '',
            txtOTP: '',
            QuickValuationCondominium: new QuickValuationCondominium(),
            VerifyOTP: false,
            ShowResult: false,
            ShowCalculate: true
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

    async refreshData() {
        this.setState({
            LstProvince: [],
            ProvinceID: null,
            LstDistrict: [],
            DistrictID: null,
            LstBuilding: [],
            BuildingID: null,
            Area: '',
            MarketUnitPrice: '',
            PlusIsCornerYes: false,
            MinusNearGarbageRoomYes: false,
            MinusOtherYes: false,
            TotalPrice: '',
            txtOTP: '',
            QuickValuationCondominium: new QuickValuationCondominium(),
            VerifyOTP: false,
            ShowResult: false,
            ShowCalculate: true

        });
        await this.SetUpForm();
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
            let item = new QuickValuationCondominium();
            req.ActionCode = SMX.ActionCode.Calculate_Price;

            if (this.state.ProvinceID == undefined) {
                this.props.GlobalStore.HideLoading();
                let message = "[Tỉnh/Thành phố] Không được để trống";
                this.props.GlobalStore.Exception = ClientMessage(message);
                return;
            }
            if (this.state.DistrictID == undefined) {
                this.props.GlobalStore.HideLoading();
                let message = "[Quận/Huyện] Không được để trống";
                this.props.GlobalStore.Exception = ClientMessage(message);
                return;
            }
            if (this.state.BuildingID == undefined) {
                this.props.GlobalStore.HideLoading();
                let message = "[Tên tòa nhà/Dự án/Khu đô thị] Không được để trống";
                this.props.GlobalStore.Exception = ClientMessage(message);
                return;
            }
            if (!this.state.Area || this.state.Area == '') {
                this.props.GlobalStore.HideLoading();
                let message = "[Diện tích] Không được để trống";
                this.props.GlobalStore.Exception = ClientMessage(message);
                return;
            }
            var area = this.state.Area;
            var unitPrice = this.state.MarketUnitPrice;
            item.Province = this.state.ProvinceID;
            item.District = this.state.DistrictID;
            item.Project = this.state.BuildingID;
            item.Area = area && area.length != 0 ? parseInt(area.split(",").join("")) : undefined;
            item.MarketUnitPrice = unitPrice && unitPrice.length != 0 ? parseInt(unitPrice.split(",").join("")) : undefined;
            item.PlusIsCorner = this.state.PlusIsCornerYes;
            item.MinusNearGarbageRoom = this.state.MinusNearGarbageRoomYes;
            item.MinusOther = this.state.MinusOtherYes;

            req.QuickValuationCondominium = item;

            let res = await HttpUtils.post<QuickValuationDto>(
                ApiUrl.QuickValuation_Execute,
                SMX.ApiActionCode.ValuationCondominiums,
                JSON.stringify(req)
            );

            if (res) {
                this.setState({
                    ShowCalculate: false,
                    VerifyOTP: res!.VerifyOTP!,
                    QuickValuationCondominium: res!.QuickValuationCondominium!
                });
            }
            this.props.GlobalStore.HideLoading();
        } catch (ex) {
            this.props.GlobalStore.HideLoading();
            this.props.GlobalStore.Exception = ex;
        }

    }

    async Verify_OTP() {
        try {
            this.props.GlobalStore.ShowLoading();
            let req = new QuickValuationDto();
            req.ActionCode = SMX.ActionCode.Verify_OTP;
            req.OtpCode = this.state.txtOTP;
            req.QuickValuationCondominium = this.state.QuickValuationCondominium;

            let res = await HttpUtils.post<QuickValuationDto>(
                ApiUrl.QuickValuation_Execute,
                SMX.ApiActionCode.ValuationCondominiums,
                JSON.stringify(req)
            );

            if (res) {
                this.setState({
                    ShowCalculate: false,
                    VerifyOTP: false,
                    ShowResult: res!.ShowResult!,
                    QuickValuationCondominium: res!.QuickValuationCondominium!
                });
            }

            this.props.GlobalStore.HideLoading();
        } catch (ex) {
            this.props.GlobalStore.HideLoading();
            this.props.GlobalStore.Exception = ex;
        }
    }

    render() {
        return (
            <View style={{ height: height, backgroundColor: "#FFF" }}>
                <Toolbar Title="Tính giá nhanh Chung cư" navigation={this.props.navigation} HasDrawer={true}>
                    <View style={{ marginLeft: 15 }}>
                        <TouchableOpacity activeOpacity={0.5} onPress={() => {
                            this.refreshData();
                        }}>
                            <AntDesign name="reload1" size={23} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </Toolbar>
                <KeyboardAvoidingView behavior="height" style={{ flex: 1, padding: 10 }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
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
                                    <Text
                                        style={{ color: "#1B2031", marginHorizontal: 7, marginVertical: 10 }}
                                    >
                                        {this.state.QuickValuationCondominium.MarketUnitPrice ? Utility.GetDecimalString(this.state.QuickValuationCondominium.MarketUnitPrice) : ""}
                                    </Text>
                                </View>
                            </View>
                            <View style={[styles.Item, { marginTop: 20, marginBottom: 10 }]}>
                                <Text style={{ fontWeight: '600', fontSize: 18 }}>
                                    II. CÁC YẾU TỐ THUẬN LỢI
                                </Text>
                            </View>
                            <View style={styles.Item}>
                                <View style={{ flex: 3, flexDirection: 'row' }}>
                                    <Text>Căn góc </Text>
                                    <Text style={{ color: 'red' }}>*</Text>
                                </View>
                                <View style={{ flex: 2, flexDirection: "row", alignItems: "center" }}>
                                    <Switch
                                        // trackColor={{ true: "#FF9800", false: "#E0E4E9" }}
                                        // thumbColor={"#FFFFFF"}
                                        value={this.state.PlusIsCornerYes}
                                        onValueChange={(val) => {
                                            this.setState({ PlusIsCornerYes: val });
                                        }}
                                    />
                                    {
                                        this.state.PlusIsCornerYes ? <Text style={{ marginLeft: 3 }}>Có</Text> : <Text style={{ marginLeft: 3 }}>Không</Text>
                                    }
                                </View>
                            </View>
                            <View
                                style={{
                                    height: 1,
                                    backgroundColor: "#F0F0F4",
                                    marginVertical: 8,
                                }}
                            />
                            <View style={[styles.Item, { marginTop: 20, marginBottom: 10 }]}>
                                <Text style={{ fontWeight: '600', fontSize: 18 }}>
                                    III. CÁC YẾU TỐ KHÔNG THUẬN LỢI
                                </Text>
                            </View>
                            <View style={styles.Item}>
                                <View style={{ flex: 3, flexDirection: 'row' }}>
                                    <Text>Gần nhà thu rác </Text>
                                    <Text style={{ color: 'red' }}>*</Text>
                                </View>
                                <View style={{ flex: 2, flexDirection: "row", alignItems: "center" }}>
                                    <Switch
                                        // trackColor={{ true: "#FF9800", false: "#E0E4E9" }}
                                        // thumbColor={"#FFFFFF"}
                                        value={this.state.MinusNearGarbageRoomYes}
                                        onValueChange={(val) => {
                                            this.setState({ MinusNearGarbageRoomYes: val });
                                        }}
                                    />
                                    {
                                        this.state.MinusNearGarbageRoomYes ? <Text style={{ marginLeft: 3 }}>Có</Text> : <Text style={{ marginLeft: 3 }}>Không</Text>
                                    }
                                </View>
                            </View>
                            <View
                                style={{
                                    height: 1,
                                    backgroundColor: "#F0F0F4",
                                    marginVertical: 8,
                                }}
                            />
                            <View style={styles.Item}>
                                <View style={{ flex: 3, flexDirection: 'row' }}>
                                    <Text>Các yếu tố bất lợi khác nếu có </Text>
                                    <Text style={{ color: 'red' }}>*</Text>
                                </View>
                                <View style={{ flex: 2, flexDirection: "row", alignItems: "center" }}>
                                    <Switch
                                        // trackColor={{ true: "#FF9800", false: "#E0E4E9" }}
                                        // thumbColor={"#FFFFFF"}
                                        value={this.state.MinusOtherYes}
                                        onValueChange={(val) => {
                                            this.setState({ MinusOtherYes: val });
                                        }}
                                    />
                                    {
                                        this.state.MinusOtherYes ? <Text style={{ marginLeft: 3 }}>Có</Text> : <Text style={{ marginLeft: 3 }}>Không</Text>
                                    }
                                </View>
                            </View>
                            <View
                                style={{
                                    height: 1,
                                    backgroundColor: "#F0F0F4",
                                    marginVertical: 8,
                                }}
                            />
                            {
                                this.state.ShowResult == true ? (
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
                                                <Text
                                                    style={{ color: "#1B2031", marginHorizontal: 7, marginVertical: 10 }}
                                                >
                                                    {this.state.QuickValuationCondominium.TotalPrice ? Utility.GetDecimalString(this.state.QuickValuationCondominium.TotalPrice) : ""}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                ) : undefined
                            }
                            {
                                this.state.ShowCalculate == true ? (
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
                                this.state.VerifyOTP == true ? (
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
                                                    style={[Theme.TextInput, { borderColor: "red" }]}
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