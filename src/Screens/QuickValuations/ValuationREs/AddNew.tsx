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
    Switch,
    TextInput,
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
import DropDownBox from "../../../components/DropDownBox";
import { TextInputMask } from "react-native-masked-text";
import { ClientMessage } from "../../../SharedEntity/SMXException";

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
    LstTown?: SystemParameter[];
    TownID?: number;
    LstStreet?: SystemParameter[];
    StreetID?: number;
    LstSegment?: SystemParameter[];
    SegmentID?: number;
    HouseNumber?: string;
    LandArea?: string;
    GardenArea?: string;
    PlanningArea?: string;
    LandWidthMin?: string;
    LandWidthNearest?: string;
    FrontageWidth?: string;
    DistanceToMainStreet?: string;
    ConstructionInLegalArea?: string;
    ConstructionOutLegalArea?: string;
    BuiltYear?: string;
    //
    PlusNearSchoolYes: boolean;
    PlusNearSchoolNo: boolean;
    PlusMoreFrontageYes: boolean;
    PlusMoreFrontageNo: boolean;
    PlusBusinessYes: boolean;
    PlusBusinessNo: boolean;
    PlusOtherYes: boolean;
    PlusOtherNo: boolean;
    //
    MinusDistortedShapeYes: boolean;
    MinusDistortedShapeNo: boolean;
    MinusNearGraveYes: boolean;
    MinusNearGraveNo: boolean;
    MinusEntryYes: boolean;
    MinusEntryNo: boolean;
    MinusOtherYes: boolean;
    MinusOtherNo: boolean;

    BankUnitPrice?: string;
    TotalPrice?: string;
    txtOTP?: string;
}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class QuickValuationREsScr extends Component<iProps, iState> {
    constructor(props: any) {
        super(props);
        this.state = {
            LstProvince: [],
            LstDistrict: [],
            LstTown: [],
            LstStreet: [],
            HouseNumber: '',
            LandArea: '',
            GardenArea: '',
            PlanningArea: '',
            LandWidthMin: '',
            LandWidthNearest: '',
            FrontageWidth: '',
            DistanceToMainStreet: '',
            ConstructionInLegalArea: '',
            ConstructionOutLegalArea: '',
            BuiltYear: '',
            //
            PlusNearSchoolYes: false,
            PlusNearSchoolNo: true,
            PlusMoreFrontageYes: false,
            PlusMoreFrontageNo: true,
            PlusBusinessYes: false,
            PlusBusinessNo: true,
            PlusOtherYes: false,
            PlusOtherNo: true,
            //
            MinusDistortedShapeYes: false,
            MinusDistortedShapeNo: true,
            MinusNearGraveYes: false,
            MinusNearGraveNo: true,
            MinusEntryYes: false,
            MinusEntryNo: true,
            MinusOtherYes: false,
            MinusOtherNo: true,

            BankUnitPrice: '',
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
            SMX.ApiActionCode.SetupViewREForm,
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
                SMX.ApiActionCode.SetupViewREForm,
                JSON.stringify(req)
            );

            this.setState({
                LstDistrict: res!.LstDistrict!,
            });
        } catch (ex) {
            this.props.GlobalStore.Exception = ex;
        }
    }

    async GetTownAndStreetByDistrict() {
        try {
            let req = new QuickValuationDto();
            req.DistrictID = this.state.DistrictID;

            let res = await HttpUtils.post<QuickValuationDto>(
                ApiUrl.QuickValuation_Execute,
                SMX.ApiActionCode.SetupViewREForm,
                JSON.stringify(req)
            );

            this.setState({
                LstTown: res!.LstTown!,
                LstStreet: res!.LstStreet!
            });
        } catch (ex) {
            this.props.GlobalStore.Exception = ex;
        }
    }

    async GetSegmentByStreet() {
        try {
            let req = new QuickValuationDto();
            req.StreetID = this.state.StreetID;

            let res = await HttpUtils.post<QuickValuationDto>(
                ApiUrl.QuickValuation_Execute,
                SMX.ApiActionCode.SetupViewREForm,
                JSON.stringify(req)
            );

            this.setState({
                LstSegment: res!.LstSegment!,
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
                SMX.ApiActionCode.ValuationREs,
                JSON.stringify(new QuickValuationDto())
            );

            if (res) {
                //this.setState({ Employee: res!.Employee! });
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

            let res = await HttpUtils.post<QuickValuationDto>(
                ApiUrl.QuickValuation_Execute,
                SMX.ApiActionCode.ValuationREs,
                JSON.stringify(new QuickValuationDto())
            );

            if (res) {
                //this.setState({ Employee: res!.Employee! });
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
                <Toolbar Title="Tính giá nhanh Nhà đất phổ thông" navigation={this.props.navigation} HasDrawer={true} />
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

                                    <Text>Tỉnh/Thành phố </Text>
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
                                    <Text>Quận/Huyện </Text>
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
                                                    await this.GetTownAndStreetByDistrict();
                                                }
                                            );
                                        }}
                                    ></DropDownBox>
                                </View>
                            </View>
                            <View style={styles.Item}>
                                <View style={{ flex: 2, flexDirection: 'row' }}>
                                    <Text>Phường/Xã/Thị trấn </Text>
                                    {/* <Text style={{ color: 'red' }}>*</Text> */}
                                </View>
                                <View style={{ flex: 3 }}>
                                    <DropDownBox
                                        TextField="Name"
                                        ValueField="SystemParameterID"
                                        DataSource={this.state.LstTown}
                                        SelectedValue={this.state.TownID}
                                        OnSelectedItemChanged={(item) => {
                                            this.setState({ TownID: item.SystemParameterID });
                                        }}
                                    ></DropDownBox>
                                </View>
                            </View>
                            <View style={styles.Item}>
                                <View style={{ flex: 2, flexDirection: 'row' }}>
                                    <Text>Tên tuyến đường VT1 (mặt đường/phố) theo bảng giá TPBank </Text>
                                    {/* <Text style={{ color: 'red' }}>*</Text> */}
                                </View>
                                <View style={{ flex: 3 }}>
                                    <DropDownBox
                                        TextField="Name"
                                        ValueField="SystemParameterID"
                                        DataSource={this.state.LstStreet}
                                        SelectedValue={this.state.StreetID}
                                        OnSelectedItemChanged={(item) => {
                                            this.setState(
                                                { StreetID: item.SystemParameterID },
                                                async () => {
                                                    await this.GetSegmentByStreet();
                                                }
                                            );
                                        }}
                                    ></DropDownBox>
                                </View>
                            </View>
                            <View style={styles.Item}>
                                <View style={{ flex: 2, flexDirection: 'row' }}>
                                    <Text>Đoạn đường </Text>
                                    <Text style={{ color: 'red' }}>*</Text>
                                </View>
                                <View style={{ flex: 3 }}>
                                    <DropDownBox
                                        TextField="Name"
                                        ValueField="SystemParameterID"
                                        DataSource={this.state.LstSegment}
                                        SelectedValue={this.state.SegmentID}
                                        OnSelectedItemChanged={(item) => {
                                            this.setState({ SegmentID: item.SystemParameterID });
                                        }}
                                    ></DropDownBox>
                                </View>
                            </View>
                            <View style={styles.Item}>
                                <View style={{ flex: 2, flexDirection: 'row' }}>
                                    <Text>Số nhà, ngõ/hẻm/ kiệt </Text>
                                </View>
                                <View style={{ flex: 3 }}>
                                    <TextInput
                                        multiline={false}
                                        style={[Theme.TextView]}
                                        value={this.state.HouseNumber}
                                        onChangeText={(val) => {
                                            this.setState({ HouseNumber: val });
                                        }}
                                    />
                                </View>
                            </View>

                            <View style={styles.Item}>
                                <View style={{ flex: 2, flexDirection: 'row' }}>
                                    <Text>Diện tích đất ở (m2) </Text>
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
                                        value={this.state.LandArea}
                                        style={[Theme.TextInput]}
                                        onChangeText={(val) => {
                                            this.setState({ LandArea: val });
                                        }}
                                    />
                                </View>
                            </View>
                            <View style={styles.Item}>
                                <View style={{ flex: 2, flexDirection: 'row' }}>
                                    <Text>Diện tích đất vườn/ trồng cây lâu năm (m2) </Text>
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
                                        value={this.state.GardenArea}
                                        style={[Theme.TextInput]}
                                        onChangeText={(val) => {
                                            this.setState({ GardenArea: val });
                                        }}
                                    />
                                </View>
                            </View>
                            <View style={styles.Item}>
                                <View style={{ flex: 2, flexDirection: 'row' }}>
                                    <Text>Diện tích đất nằm trong quy hoạch (m2) </Text>
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
                                        value={this.state.PlanningArea}
                                        style={[Theme.TextInput]}
                                        onChangeText={(val) => {
                                            this.setState({ PlanningArea: val });
                                        }}
                                    />
                                </View>
                            </View>
                            <View style={styles.Item}>
                                <View style={{ flex: 2, flexDirection: 'row' }}>
                                    <Text>Độ rộng ngõ nhỏ nhất (trường hợp VT1 xác định = 0) (m) </Text>
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
                                        value={this.state.LandWidthMin}
                                        style={[Theme.TextInput]}
                                        onChangeText={(val) => {
                                            this.setState({ LandWidthMin: val });
                                        }}
                                    />
                                </View>
                            </View>
                            <View style={styles.Item}>
                                <View style={{ flex: 2, flexDirection: 'row' }}>
                                    <Text>Độ rộng ngõ trước mặt (trường hợp VT1 xác định = 0) </Text>
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
                                        value={this.state.LandWidthNearest}
                                        style={[Theme.TextInput]}
                                        onChangeText={(val) => {
                                            this.setState({ LandWidthNearest: val });
                                        }}
                                    />
                                </View>
                            </View>
                            <View style={styles.Item}>
                                <View style={{ flex: 2, flexDirection: 'row' }}>
                                    <Text>Độ rộng mặt tiền của thửa đất (m) </Text>
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
                                        value={this.state.FrontageWidth}
                                        style={[Theme.TextInput]}
                                        onChangeText={(val) => {
                                            this.setState({ FrontageWidth: val });
                                        }}
                                    />
                                </View>
                            </View>
                            <View style={styles.Item}>
                                <View style={{ flex: 2, flexDirection: 'row' }}>
                                    <Text>Khoảng cách tới tuyến đường chính (đường ô tô đi, VT1 nhập = 0) (m) </Text>
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
                                        value={this.state.DistanceToMainStreet}
                                        style={[Theme.TextInput]}
                                        onChangeText={(val) => {
                                            this.setState({ DistanceToMainStreet: val });
                                        }}
                                    />
                                </View>
                            </View>
                            <View style={styles.Item}>
                                <View style={{ flex: 2, flexDirection: 'row' }}>
                                    <Text>Diện tích công trình xây dựng có phép/ được chứng nhận trên GCN (m2) </Text>
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
                                        value={this.state.ConstructionInLegalArea}
                                        style={[Theme.TextInput]}
                                        onChangeText={(val) => {
                                            this.setState({ ConstructionInLegalArea: val });
                                        }}
                                    />
                                </View>
                            </View>
                            <View style={styles.Item}>
                                <View style={{ flex: 2, flexDirection: 'row' }}>
                                    <Text>Diện tích công trình xây dựng không phép/ không được chứng nhận trên GCN (m2) </Text>
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
                                        value={this.state.ConstructionOutLegalArea}
                                        style={[Theme.TextInput]}
                                        onChangeText={(val) => {
                                            this.setState({ ConstructionOutLegalArea: val });
                                        }}
                                    />
                                </View>
                            </View>
                            <View style={styles.Item}>
                                <View style={{ flex: 2, flexDirection: 'row' }}>
                                    <Text>Năm xây dựng </Text>
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
                                        value={this.state.BuiltYear}
                                        style={[Theme.TextInput]}
                                        onChangeText={(val) => {
                                            this.setState({ BuiltYear: val });
                                        }}
                                    />
                                </View>
                            </View>
                            <View style={[styles.Item, { marginTop: 20 }]}>
                                <Text style={{ fontWeight: '600', fontSize: 18 }}>
                                    II. THÔNG TIN BỔ SUNG CỦA BĐS
                                </Text>
                            </View>
                            <View style={[styles.Item, { marginBottom: 10 }]}>
                                <Text style={{ fontWeight: '600', fontSize: 18 }}>
                                    A. Ưu điểm
                                </Text>
                            </View>
                            <View style={styles.ItemNote}>
                                <View style={{ flex: 2, flexDirection: 'row' }}>
                                    <Text>Gần trường học/bênh viện/chợ trong phạm vi 100m </Text>
                                    <Text style={{ color: 'red' }}>*</Text>
                                </View>
                            </View>
                            <View style={{ paddingLeft: width / 3, flexDirection: "row", alignItems: "center", padding: 10 }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Switch
                                        trackColor={{ true: "#FF9800", false: "#E0E4E9" }}
                                        thumbColor={"#FFFFFF"}
                                        value={this.state.PlusNearSchoolYes}
                                        onValueChange={(val) => {
                                            if (val == true) this.setState({ PlusNearSchoolNo: false });
                                            else this.setState({ PlusNearSchoolNo: true });
                                            this.setState({ PlusNearSchoolYes: val });
                                        }}
                                    />
                                    <Text style={{ marginLeft: 3 }}>Có</Text>
                                </View>

                                <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 30 }}>
                                    <Switch
                                        trackColor={{ true: "#FF9800", false: "#E0E4E9" }}
                                        thumbColor={"#FFFFFF"}
                                        value={this.state.PlusNearSchoolNo}
                                        onValueChange={(val) => {
                                            if (val == true) this.setState({ PlusNearSchoolYes: false });
                                            else this.setState({ PlusNearSchoolYes: true });
                                            this.setState({ PlusNearSchoolNo: val });
                                        }}
                                    />
                                    <Text style={{ marginLeft: 3 }}>Không</Text>
                                </View>
                            </View>
                            <View style={styles.ItemNote}>
                                <View style={{ flex: 2, flexDirection: 'row' }}>
                                    <Text>Lô góc/ hai, ba mặt ngõ </Text>
                                    <Text style={{ color: 'red' }}>*</Text>
                                </View>
                            </View>
                            <View style={{ paddingLeft: width / 3, flexDirection: "row", alignItems: "center", padding: 10 }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Switch
                                        trackColor={{ true: "#FF9800", false: "#E0E4E9" }}
                                        thumbColor={"#FFFFFF"}
                                        value={this.state.PlusMoreFrontageYes}
                                        onValueChange={(val) => {
                                            if (val == true) this.setState({ PlusMoreFrontageNo: false });
                                            else this.setState({ PlusMoreFrontageNo: true });
                                            this.setState({ PlusMoreFrontageYes: val });
                                        }}
                                    />
                                    <Text style={{ marginLeft: 3 }}>Có</Text>
                                </View>

                                <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 30 }}>
                                    <Switch
                                        trackColor={{ true: "#FF9800", false: "#E0E4E9" }}
                                        thumbColor={"#FFFFFF"}
                                        value={this.state.PlusMoreFrontageNo}
                                        onValueChange={(val) => {
                                            if (val == true) this.setState({ PlusMoreFrontageYes: false });
                                            else this.setState({ PlusMoreFrontageYes: true });
                                            this.setState({ PlusMoreFrontageNo: val });
                                        }}
                                    />
                                    <Text style={{ marginLeft: 3 }}>Không</Text>
                                </View>
                            </View>
                            <View style={styles.ItemNote}>
                                <View style={{ flex: 2, flexDirection: 'row' }}>
                                    <Text>Mật độ kinh doanh (không bao gồm cho thuê để ở) tại cùng dãy của đường nội bộ/ ngõ hẻm nơi BĐS tọa lạc {'>'} 50% </Text>
                                    <Text style={{ color: 'red' }}>*</Text>
                                </View>
                            </View>
                            <View style={{ paddingLeft: width / 3, flexDirection: "row", alignItems: "center", padding: 10 }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Switch
                                        trackColor={{ true: "#FF9800", false: "#E0E4E9" }}
                                        thumbColor={"#FFFFFF"}
                                        value={this.state.PlusBusinessYes}
                                        onValueChange={(val) => {
                                            if (val == true) this.setState({ PlusBusinessNo: false });
                                            else this.setState({ PlusBusinessNo: true });
                                            this.setState({ PlusBusinessYes: val });
                                        }}
                                    />
                                    <Text style={{ marginLeft: 3 }}>Có</Text>
                                </View>

                                <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 30 }}>
                                    <Switch
                                        trackColor={{ true: "#FF9800", false: "#E0E4E9" }}
                                        thumbColor={"#FFFFFF"}
                                        value={this.state.PlusBusinessNo}
                                        onValueChange={(val) => {
                                            if (val == true) this.setState({ PlusBusinessYes: false });
                                            else this.setState({ PlusBusinessYes: true });
                                            this.setState({ PlusBusinessNo: val });
                                        }}
                                    />
                                    <Text style={{ marginLeft: 3 }}>Không</Text>
                                </View>
                            </View>
                            <View style={styles.ItemNote}>
                                <View style={{ flex: 2, flexDirection: 'row' }}>
                                    <Text>Ưu điểm khác </Text>
                                    <Text style={{ color: 'red' }}>*</Text>
                                </View>
                            </View>
                            <View style={{ paddingLeft: width / 3, flexDirection: "row", alignItems: "center", padding: 10 }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Switch
                                        trackColor={{ true: "#FF9800", false: "#E0E4E9" }}
                                        thumbColor={"#FFFFFF"}
                                        value={this.state.PlusOtherYes}
                                        onValueChange={(val) => {
                                            if (val == true) this.setState({ PlusOtherNo: false });
                                            else this.setState({ PlusOtherNo: true });
                                            this.setState({ PlusOtherYes: val });
                                        }}
                                    />
                                    <Text style={{ marginLeft: 3 }}>Có</Text>
                                </View>

                                <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 30 }}>
                                    <Switch
                                        trackColor={{ true: "#FF9800", false: "#E0E4E9" }}
                                        thumbColor={"#FFFFFF"}
                                        value={this.state.PlusOtherNo}
                                        onValueChange={(val) => {
                                            if (val == true) this.setState({ PlusOtherYes: false });
                                            else this.setState({ PlusOtherYes: true });
                                            this.setState({ PlusOtherNo: val });
                                        }}
                                    />
                                    <Text style={{ marginLeft: 3 }}>Không</Text>
                                </View>
                            </View>
                            <View style={[styles.Item, { marginTop: 20, marginBottom: 10 }]}>
                                <Text style={{ fontWeight: '600', fontSize: 18 }}>
                                    B. Nhược điểm
                                </Text>
                            </View>
                            <View style={styles.ItemNote}>
                                <View style={{ flex: 2, flexDirection: 'row' }}>
                                    <Text>Hình dạng không cân đối, méo, thóp hậu, đa giác, ngõ đâm vào nhà, ngập nước... </Text>
                                    <Text style={{ color: 'red' }}>*</Text>
                                </View>
                            </View>
                            <View style={{ paddingLeft: width / 3, flexDirection: "row", alignItems: "center", padding: 10 }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Switch
                                        trackColor={{ true: "#FF9800", false: "#E0E4E9" }}
                                        thumbColor={"#FFFFFF"}
                                        value={this.state.MinusDistortedShapeYes}
                                        onValueChange={(val) => {
                                            if (val == true) this.setState({ MinusDistortedShapeNo: false });
                                            else this.setState({ MinusDistortedShapeNo: true });
                                            this.setState({ MinusDistortedShapeYes: val });
                                        }}
                                    />
                                    <Text style={{ marginLeft: 3 }}>Có</Text>
                                </View>

                                <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 30 }}>
                                    <Switch
                                        trackColor={{ true: "#FF9800", false: "#E0E4E9" }}
                                        thumbColor={"#FFFFFF"}
                                        value={this.state.MinusDistortedShapeNo}
                                        onValueChange={(val) => {
                                            if (val == true) this.setState({ MinusDistortedShapeYes: false });
                                            else this.setState({ MinusDistortedShapeYes: true });
                                            this.setState({ MinusDistortedShapeNo: val });
                                        }}
                                    />
                                    <Text style={{ marginLeft: 3 }}>Không</Text>
                                </View>
                            </View>
                            <View style={styles.ItemNote}>
                                <View style={{ flex: 2, flexDirection: 'row' }}>
                                    <Text>Nhìn thấy nghĩa trang trong phạm vi 50m </Text>
                                    <Text style={{ color: 'red' }}>*</Text>
                                </View>
                            </View>
                            <View style={{ paddingLeft: width / 3, flexDirection: "row", alignItems: "center", padding: 10 }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Switch
                                        trackColor={{ true: "#FF9800", false: "#E0E4E9" }}
                                        thumbColor={"#FFFFFF"}
                                        value={this.state.MinusNearGraveYes}
                                        onValueChange={(val) => {
                                            if (val == true) this.setState({ MinusNearGraveNo: false });
                                            else this.setState({ MinusNearGraveNo: true });
                                            this.setState({ MinusNearGraveYes: val });
                                        }}
                                    />
                                    <Text style={{ marginLeft: 3 }}>Có</Text>
                                </View>

                                <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 30 }}>
                                    <Switch
                                        trackColor={{ true: "#FF9800", false: "#E0E4E9" }}
                                        thumbColor={"#FFFFFF"}
                                        value={this.state.MinusNearGraveNo}
                                        onValueChange={(val) => {
                                            if (val == true) this.setState({ MinusNearGraveYes: false });
                                            else this.setState({ MinusNearGraveYes: true });
                                            this.setState({ MinusNearGraveNo: val });
                                        }}
                                    />
                                    <Text style={{ marginLeft: 3 }}>Không</Text>
                                </View>
                            </View>
                            <View style={styles.ItemNote}>
                                <View style={{ flex: 2, flexDirection: 'row' }}>
                                    <Text>Có cột điện, cổng làng, trụ điện… ảnh hưởng lối vào tài sản </Text>
                                    <Text style={{ color: 'red' }}>*</Text>
                                </View>
                            </View>
                            <View style={{ paddingLeft: width / 3, flexDirection: "row", alignItems: "center", padding: 10 }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Switch
                                        trackColor={{ true: "#FF9800", false: "#E0E4E9" }}
                                        thumbColor={"#FFFFFF"}
                                        value={this.state.MinusEntryYes}
                                        onValueChange={(val) => {
                                            if (val == true) this.setState({ MinusEntryNo: false });
                                            else this.setState({ MinusEntryNo: true });
                                            this.setState({ MinusEntryYes: val });
                                        }}
                                    />
                                    <Text style={{ marginLeft: 3 }}>Có</Text>
                                </View>

                                <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 30 }}>
                                    <Switch
                                        trackColor={{ true: "#FF9800", false: "#E0E4E9" }}
                                        thumbColor={"#FFFFFF"}
                                        value={this.state.MinusEntryNo}
                                        onValueChange={(val) => {
                                            if (val == true) this.setState({ MinusEntryYes: false });
                                            else this.setState({ MinusEntryYes: true });
                                            this.setState({ MinusEntryNo: val });
                                        }}
                                    />
                                    <Text style={{ marginLeft: 3 }}>Không</Text>
                                </View>
                            </View>
                            <View style={styles.ItemNote}>
                                <View style={{ flex: 2, flexDirection: 'row' }}>
                                    <Text>Nhược điểm khác </Text>
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
                                    </View>
                                ) : undefined
                            }

                            {
                                !this.state.TotalPrice ? (
                                    <View>
                                        <View style={[styles.Item, { marginTop: 20 }]}>
                                            <Text style={{ fontWeight: '600', fontSize: 18 }}>
                                                II. KẾT QUẢ THẨM ĐỊNH GIÁ
                                            </Text>
                                        </View>
                                        <View>
                                            <Text>Đơn giá TPBank quy định (tra cứu theo Bảng giá TPBank từ VT1 đến VT11 tương ứng) (đồng)</Text>
                                        </View>
                                        <View style={{ marginTop: 3, height: 200, borderRadius: 5, borderWidth: 1, borderColor: 'red' }}>

                                        </View>
                                    </View>
                                ) : undefined
                            }

                            {
                                this.state.TotalPrice ? (
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
                                ) : (
                                        < TouchableOpacity
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
                                    )
                            }

                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View >
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