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
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import GlobalCache from "../../../Caches/GlobalCache";
import QuickValuationDto from "../../../DtoParams/QuickValuationDto";
import SystemParameter from "../../../Entities/SystemParameter";
import { LinearGradient } from "expo-linear-gradient";
import DropDownBox from "../../../components/DropDownBox";
import { TextInputMask } from "react-native-masked-text";
import { ClientMessage } from "../../../SharedEntity/SMXException";
import QuickValuationRE from "../../../Entities/QuickValuationRE";
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
    PlusMoreFrontageYes: boolean;
    PlusBusinessYes: boolean;
    PlusOtherYes: boolean;
    //
    MinusDistortedShapeYes: boolean;
    MinusNearGraveYes: boolean;
    MinusEntryYes: boolean;
    MinusOtherYes: boolean;

    BankUnitPrice?: string;
    TotalPrice?: string;
    txtOTP?: string;
    QuickValuationRE?: QuickValuationRE;
    VerifyOTP: boolean;
    ShowResult: boolean;
    ShowCalculate: boolean;
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
            PlusMoreFrontageYes: false,
            PlusBusinessYes: false,
            PlusOtherYes: false,
            //
            MinusDistortedShapeYes: false,
            MinusNearGraveYes: false,
            MinusEntryYes: false,
            MinusOtherYes: false,

            BankUnitPrice: '',
            TotalPrice: '',
            txtOTP: '',
            QuickValuationRE: new QuickValuationRE(),
            VerifyOTP: false,
            ShowResult: false,
            ShowCalculate: true,

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

    async refreshData() {
        this.setState({
            LstProvince: [],
            ProvinceID: null,
            LstDistrict: [],
            DistrictID: null,
            LstTown: [],
            TownID: null,
            LstStreet: [],
            StreetID: null,
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
            PlusMoreFrontageYes: false,
            PlusBusinessYes: false,
            PlusOtherYes: false,
            //
            MinusDistortedShapeYes: false,
            MinusNearGraveYes: false,
            MinusEntryYes: false,
            MinusOtherYes: false,

            BankUnitPrice: '',
            TotalPrice: '',
            txtOTP: '',
            QuickValuationRE: new QuickValuationRE(),
            VerifyOTP: false,
            ShowResult: false,
            ShowCalculate: true,

        });
        await this.SetUpForm();
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
            let item = new QuickValuationRE();
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
            if (this.state.StreetID == undefined) {
                this.props.GlobalStore.HideLoading();
                let message = "[Tên tuyến đường VT1 (mặt đường/phố) theo bảng giá TPBank] Không được để trống";
                this.props.GlobalStore.Exception = ClientMessage(message);
                return;
            }
            if (this.state.SegmentID == undefined) {
                this.props.GlobalStore.HideLoading();
                let message = "[Đoạn đường] Không được để trống";
                this.props.GlobalStore.Exception = ClientMessage(message);
                return;
            }
            if (!this.state.LandArea || this.state.LandArea == '') {
                this.props.GlobalStore.HideLoading();
                let message = "[Diện tích đất ở(m2)] Không được để trống";
                this.props.GlobalStore.Exception = ClientMessage(message);
                return;
            }
            if (!this.state.LandWidthMin || this.state.LandWidthMin == '') {
                this.props.GlobalStore.HideLoading();
                let message = "[Độ rộng ngõ nhỏ nhất (trường hợp VT1 xác định = 0) (m)] Không được để trống";
                this.props.GlobalStore.Exception = ClientMessage(message);
                return;
            }
            if (!this.state.BuiltYear || this.state.BuiltYear == '') {
                this.props.GlobalStore.HideLoading();
                let message = "[Năm xây dựng] Không được để trống";
                this.props.GlobalStore.Exception = ClientMessage(message);
                return;
            }
            var landArea = this.state.LandArea;
            var gardenArea = this.state.GardenArea;
            var planningArea = this.state.PlanningArea;
            var landWidthMin = this.state.LandWidthMin;
            var landWidthNearest = this.state.LandWidthNearest;
            var frontageWidth = this.state.FrontageWidth;
            var distanceToMainStreet = this.state.DistanceToMainStreet;
            var constructionInLegalArea = this.state.ConstructionInLegalArea;
            var constructionOutLegalArea = this.state.ConstructionOutLegalArea;
            var builtYear = this.state.BuiltYear;

            item.Province = this.state.ProvinceID;
            item.District = this.state.DistrictID;
            item.Town = this.state.TownID;
            item.Street = this.state.StreetID;
            item.HouseNumber = this.state.HouseNumber;
            item.Segment = this.state.SegmentID;

            item.LandArea = landArea && landArea.length != 0 ? parseInt(landArea.split(",").join("")) : undefined;
            item.GardenArea = gardenArea && gardenArea.length != 0 ? parseInt(gardenArea.split(",").join("")) : undefined;
            item.PlanningArea = planningArea && planningArea.length != 0 ? parseInt(planningArea.split(",").join("")) : undefined;
            item.LandWidthMin = landWidthMin && landWidthMin.length != 0 ? parseInt(landWidthMin.split(",").join("")) : undefined;
            item.LandWidthNearest = landWidthNearest && landWidthNearest.length != 0 ? parseInt(landWidthNearest.split(",").join("")) : undefined;
            item.FrontageWidth = frontageWidth && frontageWidth.length != 0 ? parseInt(frontageWidth.split(",").join("")) : undefined;
            item.DistanceToMainStreet = distanceToMainStreet && distanceToMainStreet.length != 0 ? parseInt(distanceToMainStreet.split(",").join("")) : undefined;

            item.ConstructionInLegalArea = constructionInLegalArea && constructionInLegalArea.length != 0 ? parseInt(constructionInLegalArea.split(",").join("")) : undefined;
            item.ConstructionOutLegalArea = constructionOutLegalArea && constructionOutLegalArea.length != 0 ? parseInt(constructionOutLegalArea.split(",").join("")) : undefined;
            item.BuiltYear = builtYear && builtYear.length != 0 ? parseInt(builtYear.split(",").join("")) : undefined;

            item.PlusNearSchool = this.state.PlusNearSchoolYes;
            item.PlusMoreFrontage = this.state.PlusMoreFrontageYes;
            item.PlusBusiness = this.state.PlusBusinessYes;
            item.PlusOther = this.state.PlusOtherYes;
            item.MinusDistortedShape = this.state.MinusDistortedShapeYes;
            item.MinusNearGrave = this.state.MinusNearGraveYes;
            item.MinusEntry = this.state.MinusEntryYes;
            item.MinusOther = this.state.MinusOtherYes;

            req.QuickValuationRE = item;


            let res = await HttpUtils.post<QuickValuationDto>(
                ApiUrl.QuickValuation_Execute,
                SMX.ApiActionCode.ValuationREs,
                JSON.stringify(req)
            );

            if (res) {
                this.setState({
                    ShowCalculate: false,
                    VerifyOTP: res!.VerifyOTP!,
                    QuickValuationRE: res!.QuickValuationRE!
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
            req.QuickValuationRE = this.state.QuickValuationRE;

            let res = await HttpUtils.post<QuickValuationDto>(
                ApiUrl.QuickValuation_Execute,
                SMX.ApiActionCode.ValuationREs,
                JSON.stringify(req)
            );

            if (res) {
                this.setState({
                    ShowCalculate: false,
                    VerifyOTP: false,
                    ShowResult: res!.ShowResult!,
                    QuickValuationRE: res!.QuickValuationRE!
                });
            }

            this.props.GlobalStore.HideLoading();
        } catch (ex) {
            this.props.GlobalStore.HideLoading();
            this.props.GlobalStore.Exception = ex;
        }
    }

    render() {
        let item = this.state.QuickValuationRE;
        let orderNo = 2;
        return (
            <View style={{ height: height, backgroundColor: "#FFF" }}>
                <Toolbar Title="Tính giá nhanh Nhà đất phổ thông" navigation={this.props.navigation} HasDrawer={true}>
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
                                    <Text style={{ color: 'red' }}>*</Text>
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
                                        style={[Theme.TextView, {}]}
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
                            <View style={{ paddingLeft: width / 2, flexDirection: "row", alignItems: "center", padding: 10 }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Switch
                                        // trackColor={{ true: "#FF9800", false: "#E0E4E9" }}
                                        // thumbColor={"#FFFFFF"}
                                        value={this.state.PlusNearSchoolYes}
                                        onValueChange={(val) => {
                                            this.setState({ PlusNearSchoolYes: val });
                                        }}
                                    />
                                    {
                                        this.state.PlusNearSchoolYes ? <Text style={{ marginLeft: 3 }}>Có</Text> : <Text style={{ marginLeft: 3 }}>Không</Text>
                                    }
                                </View>
                            </View>
                            <View style={styles.ItemNote}>
                                <View style={{ flex: 2, flexDirection: 'row' }}>
                                    <Text>Lô góc/ hai, ba mặt ngõ </Text>
                                    <Text style={{ color: 'red' }}>*</Text>
                                </View>
                            </View>
                            <View style={{ paddingLeft: width / 2, flexDirection: "row", alignItems: "center", padding: 10 }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Switch
                                        // trackColor={{ true: "#FF9800", false: "#E0E4E9" }}
                                        // thumbColor={"#FFFFFF"}
                                        value={this.state.PlusMoreFrontageYes}
                                        onValueChange={(val) => {
                                            this.setState({ PlusMoreFrontageYes: val });
                                        }}
                                    />
                                    {
                                        this.state.PlusMoreFrontageYes ? <Text style={{ marginLeft: 3 }}>Có</Text> : <Text style={{ marginLeft: 3 }}>Không</Text>
                                    }
                                </View>
                            </View>
                            <View style={styles.ItemNote}>
                                <View style={{ flex: 2, flexDirection: 'row' }}>
                                    <Text>Mật độ kinh doanh (không bao gồm cho thuê để ở) tại cùng dãy của đường nội bộ/ ngõ hẻm nơi BĐS tọa lạc {'>'} 50% </Text>
                                    <Text style={{ color: 'red' }}>*</Text>
                                </View>
                            </View>
                            <View style={{ paddingLeft: width / 2, flexDirection: "row", alignItems: "center", padding: 10 }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Switch
                                        // trackColor={{ true: "#FF9800", false: "#E0E4E9" }}
                                        // thumbColor={"#FFFFFF"}
                                        value={this.state.PlusBusinessYes}
                                        onValueChange={(val) => {
                                            this.setState({ PlusBusinessYes: val });
                                        }}
                                    />
                                    {
                                        this.state.PlusBusinessYes ? <Text style={{ marginLeft: 3 }}>Có</Text> : <Text style={{ marginLeft: 3 }}>Không</Text>
                                    }
                                </View>
                            </View>
                            <View style={styles.ItemNote}>
                                <View style={{ flex: 2, flexDirection: 'row' }}>
                                    <Text>Ưu điểm khác </Text>
                                    <Text style={{ color: 'red' }}>*</Text>
                                </View>
                            </View>
                            <View style={{ paddingLeft: width / 2, flexDirection: "row", alignItems: "center", padding: 10 }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Switch
                                        // trackColor={{ true: "#FF9800", false: "#E0E4E9" }}
                                        // thumbColor={"#FFFFFF"}
                                        value={this.state.PlusOtherYes}
                                        onValueChange={(val) => {
                                            this.setState({ PlusOtherYes: val });
                                        }}
                                    />
                                    {
                                        this.state.PlusOtherYes ? <Text style={{ marginLeft: 3 }}>Có</Text> : <Text style={{ marginLeft: 3 }}>Không</Text>
                                    }
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
                            <View style={{ paddingLeft: width / 2, flexDirection: "row", alignItems: "center", padding: 10 }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Switch
                                        // trackColor={{ true: "#FF9800", false: "#E0E4E9" }}
                                        // thumbColor={"#FFFFFF"}
                                        value={this.state.MinusDistortedShapeYes}
                                        onValueChange={(val) => {
                                            this.setState({ MinusDistortedShapeYes: val });
                                        }}
                                    />
                                    {
                                        this.state.MinusDistortedShapeYes ? <Text style={{ marginLeft: 3 }}>Có</Text> : <Text style={{ marginLeft: 3 }}>Không</Text>
                                    }
                                </View>
                            </View>
                            <View style={styles.ItemNote}>
                                <View style={{ flex: 2, flexDirection: 'row' }}>
                                    <Text>Nhìn thấy nghĩa trang trong phạm vi 50m </Text>
                                    <Text style={{ color: 'red' }}>*</Text>
                                </View>
                            </View>
                            <View style={{ paddingLeft: width / 2, flexDirection: "row", alignItems: "center", padding: 10 }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Switch
                                        // trackColor={{ true: "#FF9800", false: "#E0E4E9" }}
                                        // thumbColor={"#FFFFFF"}
                                        value={this.state.MinusNearGraveYes}
                                        onValueChange={(val) => {
                                            this.setState({ MinusNearGraveYes: val });
                                        }}
                                    />
                                    {
                                        this.state.MinusNearGraveYes ? <Text style={{ marginLeft: 3 }}>Có</Text> : <Text style={{ marginLeft: 3 }}>Không</Text>
                                    }
                                </View>
                            </View>
                            <View style={styles.ItemNote}>
                                <View style={{ flex: 2, flexDirection: 'row' }}>
                                    <Text>Có cột điện, cổng làng, trụ điện… ảnh hưởng lối vào tài sản </Text>
                                    <Text style={{ color: 'red' }}>*</Text>
                                </View>
                            </View>
                            <View style={{ paddingLeft: width / 2, flexDirection: "row", alignItems: "center", padding: 10 }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Switch
                                        // trackColor={{ true: "#FF9800", false: "#E0E4E9" }}
                                        // thumbColor={"#FFFFFF"}
                                        value={this.state.MinusEntryYes}
                                        onValueChange={(val) => {
                                            this.setState({ MinusEntryYes: val });
                                        }}
                                    />
                                    {
                                        this.state.MinusEntryYes ? <Text style={{ marginLeft: 3 }}>Có</Text> : <Text style={{ marginLeft: 3 }}>Không</Text>
                                    }
                                </View>
                            </View>
                            <View style={styles.ItemNote}>
                                <View style={{ flex: 2, flexDirection: 'row' }}>
                                    <Text>Nhược điểm khác </Text>
                                    <Text style={{ color: 'red' }}>*</Text>
                                </View>
                            </View>
                            <View style={{ paddingLeft: width / 2, flexDirection: "row", alignItems: "center", padding: 10 }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
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

                            {
                                this.state.ShowResult == true ? (
                                    <View>
                                        <View style={[styles.Item, { marginTop: 20 }]}>
                                            <Text style={{ fontWeight: '600', fontSize: 18 }}>
                                                II. KẾT QUẢ THẨM ĐỊNH GIÁ
                                            </Text>
                                        </View>
                                        <View style={{ marginBottom: 10 }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{}}>Đơn giá TPBank quy định (tra cứu theo Bảng giá TPBank từ VT1 đến VT11 tương ứng) (đồng) </Text>
                                            </View>
                                            <View style={{ marginTop: 3, borderWidth: 1, borderColor: "#acacac", borderRadius: 5 }}>
                                                <Text
                                                    style={{ color: "#1B2031", marginHorizontal: 7, marginVertical: 10 }}
                                                >
                                                    {this.state.QuickValuationRE.BankUnitPrice ? Utility.GetDecimalString(this.state.QuickValuationRE.BankUnitPrice) : ""}
                                                </Text>
                                            </View>
                                        </View>
                                        <View
                                            style={{
                                                width: "100%",
                                                borderBottomWidth: 1,
                                                borderColor: "gainsboro",
                                                backgroundColor: '#eaf2f6'
                                            }}
                                        >
                                            <View style={{ width: width - 95, paddingHorizontal: 10, paddingVertical: 5 }}>
                                                <View style={{ flexDirection: "row", marginBottom: 2 }}>
                                                    <Text style={{ fontWeight: "600" }}>{1}. Đất ở</Text>
                                                </View>
                                                <View style={{ flexDirection: "row", marginBottom: 2 }}>
                                                    <Text style={{ fontWeight: "600" }}>Diện tích (m2): </Text>
                                                    <Text style={{}}>{Utility.GetDecimalString(item.LandArea)}</Text>
                                                </View>
                                                <View style={{ flexDirection: "row", marginBottom: 2 }}>
                                                    <Text style={{ fontWeight: "600" }}>Đơn giá (đ/m2): </Text>
                                                    <Text style={{}}>{Utility.GetDecimalString(item.LandUnitPrice)}</Text>
                                                </View>
                                                <View style={{ flexDirection: "row" }}>
                                                    <Text style={{ fontWeight: "600" }}>Thành tiền (đ): </Text>
                                                    <Text style={{ width: width - 100 }}>{Utility.GetDecimalString(item.LandTotalPrice)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        {
                                            item.GardenArea && item.GardenArea != null ? (
                                                <View
                                                    style={{
                                                        width: "100%",
                                                        borderBottomWidth: 1,
                                                        borderColor: "gainsboro",
                                                        backgroundColor: '#eaf2f6'
                                                    }}
                                                >
                                                    <View style={{ width: width - 95, paddingHorizontal: 10, paddingVertical: 5 }}>
                                                        <View style={{ flexDirection: "row", marginBottom: 2 }}>
                                                            <Text style={{ fontWeight: "600" }}>{orderNo++}. Đất vườn/ trồng cây lâu năm</Text>
                                                        </View>
                                                        <View style={{ flexDirection: "row", marginBottom: 2 }}>
                                                            <Text style={{ fontWeight: "600" }}>Diện tích (m2): </Text>
                                                            <Text style={{}}>{Utility.GetDecimalString(item.GardenArea)}</Text>
                                                        </View>
                                                        <View style={{ flexDirection: "row", marginBottom: 2 }}>
                                                            <Text style={{ fontWeight: "600" }}>Đơn giá (đ/m2): </Text>
                                                            <Text style={{}}>{Utility.GetDecimalString(item.GardenUnitPrice)}</Text>
                                                        </View>
                                                        <View style={{ flexDirection: "row" }}>
                                                            <Text style={{ fontWeight: "600" }}>Thành tiền (đ): </Text>
                                                            <Text style={{ width: width - 100 }}>{Utility.GetDecimalString(item.GardenTotalPrice)}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            ) : undefined
                                        }
                                        {
                                            item.PlanningArea && item.PlanningArea != null ? (
                                                <View
                                                    style={{
                                                        width: "100%",
                                                        borderBottomWidth: 1,
                                                        borderColor: "gainsboro",
                                                        backgroundColor: '#eaf2f6'
                                                    }}
                                                >
                                                    <View style={{ width: width - 95, paddingHorizontal: 10, paddingVertical: 5 }}>
                                                        <View style={{ flexDirection: "row", marginBottom: 2 }}>
                                                            <Text style={{ fontWeight: "600" }}>{orderNo++}. Đất nằm trong quy hoạch</Text>
                                                        </View>
                                                        <View style={{ flexDirection: "row", marginBottom: 2 }}>
                                                            <Text style={{ fontWeight: "600" }}>Diện tích (m2): </Text>
                                                            <Text style={{}}>{Utility.GetDecimalString(item.PlanningArea)}</Text>
                                                        </View>
                                                        <View style={{ flexDirection: "row", marginBottom: 2 }}>
                                                            <Text style={{ fontWeight: "600" }}>Đơn giá (đ/m2): </Text>
                                                            <Text style={{}}>{Utility.GetDecimalString(item.PlanningUnitPrice)}</Text>
                                                        </View>
                                                        <View style={{ flexDirection: "row" }}>
                                                            <Text style={{ fontWeight: "600" }}>Thành tiền (đ): </Text>
                                                            <Text style={{ width: width - 100 }}>{Utility.GetDecimalString(item.PlanningTotalPrice)}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            ) : undefined
                                        }
                                        {
                                            item.ConstructionInLegalArea && item.ConstructionInLegalArea != null ? (
                                                <View
                                                    style={{
                                                        width: "100%",
                                                        borderBottomWidth: 1,
                                                        borderColor: "gainsboro",
                                                        backgroundColor: '#eaf2f6'
                                                    }}
                                                >
                                                    <View style={{ width: width - 95, paddingHorizontal: 10, paddingVertical: 5 }}>
                                                        <View style={{ flexDirection: "row", marginBottom: 2 }}>
                                                            <Text style={{ fontWeight: "600" }}>{orderNo++}. Công trình xây dựng có phép/ được chứng nhận</Text>
                                                        </View>
                                                        <View style={{ flexDirection: "row", marginBottom: 2 }}>
                                                            <Text style={{ fontWeight: "600" }}>Diện tích (m2): </Text>
                                                            <Text style={{}}>{Utility.GetDecimalString(item.ConstructionInLegalArea)}</Text>
                                                        </View>
                                                        <View style={{ flexDirection: "row", marginBottom: 2 }}>
                                                            <Text style={{ fontWeight: "600" }}>Đơn giá (đ/m2): </Text>
                                                            <Text style={{}}>{Utility.GetDecimalString(item.ConstructionInLegalUnitPrice)}</Text>
                                                        </View>
                                                        <View style={{ flexDirection: "row" }}>
                                                            <Text style={{ fontWeight: "600" }}>Thành tiền (đ): </Text>
                                                            <Text style={{ width: width - 100 }}>{Utility.GetDecimalString(item.ConstructionInLegalTotalPrice)}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            ) : undefined
                                        }
                                        {
                                            item.ConstructionOutLegalArea && item.ConstructionOutLegalArea != null ? (
                                                <View
                                                    style={{
                                                        width: "100%",
                                                        borderBottomWidth: 1,
                                                        borderColor: "gainsboro",
                                                        backgroundColor: '#eaf2f6'
                                                    }}
                                                >
                                                    <View style={{ width: width - 95, paddingHorizontal: 10, paddingVertical: 5 }}>
                                                        <View style={{ flexDirection: "row", marginBottom: 2 }}>
                                                            <Text style={{ fontWeight: "600" }}>{orderNo++}. Công trình xây dựng không phép/ không được chứng nhận</Text>
                                                        </View>
                                                        <View style={{ flexDirection: "row", marginBottom: 2 }}>
                                                            <Text style={{ fontWeight: "600" }}>Diện tích (m2): </Text>
                                                            <Text style={{}}>{Utility.GetDecimalString(item.ConstructionOutLegalArea)}</Text>
                                                        </View>
                                                        <View style={{ flexDirection: "row", marginBottom: 2 }}>
                                                            <Text style={{ fontWeight: "600" }}>Đơn giá (đ/m2): </Text>
                                                            <Text style={{}}>{Utility.GetDecimalString(item.ConstructionOutLegalUnitPrice)}</Text>
                                                        </View>
                                                        <View style={{ flexDirection: "row" }}>
                                                            <Text style={{ fontWeight: "600" }}>Thành tiền (đ): </Text>
                                                            <Text style={{ width: width - 100 }}>{Utility.GetDecimalString(item.ConstructionOutLegalTotalPrice)}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            ) : undefined
                                        }

                                        <View
                                            style={{
                                                width: "100%",
                                                marginTop: 0,
                                                borderBottomWidth: 1,
                                                borderColor: "gainsboro",
                                                paddingBottom: 0,
                                                backgroundColor: '#eaf2f6'
                                            }}
                                        >
                                            <View style={{ padding: 10, justifyContent: 'space-between', flexDirection: 'row' }}>
                                                <View style={{ flexDirection: "row", marginBottom: 2, justifyContent: 'space-between' }}>
                                                    <Text style={{ fontWeight: "600" }}>Tổng giá trị BĐS: </Text>
                                                </View>
                                                <View>
                                                    <Text>{Utility.GetDecimalString(item.TotalPrice)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                ) : undefined
                            }

                            {
                                this.state.ShowCalculate == true ? (
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
                                ) : undefined
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