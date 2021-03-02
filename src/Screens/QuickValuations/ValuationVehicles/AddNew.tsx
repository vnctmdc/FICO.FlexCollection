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
import DropDownBox from "../../../components/DropDownBox";
import SystemParameter from "../../../Entities/SystemParameter";
import { TextInputMask } from "react-native-masked-text";
import { ClientMessage } from "../../../SharedEntity/SMXException";
import { LinearGradient } from "expo-linear-gradient";
import QuickValuationVehicle from "../../../Entities/QuickValuationVehicle";

const { width, height } = Dimensions.get("window");

interface iProps {
    navigation: any;
    GlobalStore: GlobalStore;
}

interface iState {
    LstCarType?: SystemParameter[];
    SelectedCarType?: number;
    LstBrand?: SystemParameter[];
    SelectedBrand?: number;
    LstModel?: SystemParameter[];
    SelectedModel?: number;
    ProducedYear?: string;
    TotalPrice?: string;
    txtOTP?: string;
    QuickValuationVehicle?: QuickValuationVehicle;

}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class QuickValuationVehiclesScr extends Component<iProps, iState> {
    constructor(props: any) {
        super(props);
        this.state = {
            LstCarType: [],
            LstBrand: [],
            LstModel: [],
            ProducedYear: '',
            TotalPrice: '',
            txtOTP: '',
            QuickValuationVehicle: new QuickValuationVehicle(),
        };
    }
    async componentDidMount() {
        await this.SetUpForm();
    }

    async SetUpForm() {
        this.props.GlobalStore.ShowLoading();
        let res = await HttpUtils.post<QuickValuationDto>(
            ApiUrl.QuickValuation_Execute,
            SMX.ApiActionCode.SetupViewVehicleForm,
            JSON.stringify(new QuickValuationDto())
        );

        if (res) {
            this.setState({
                LstCarType: res!.LstCarType!,
                LstBrand: res!.LstBrand!
            });
        }

        this.props.GlobalStore.HideLoading();

    }

    async GetModelByBrand() {
        try {
            let req = new QuickValuationDto();
            req.BrandID = this.state.SelectedBrand;

            let res = await HttpUtils.post<QuickValuationDto>(
                ApiUrl.QuickValuation_Execute,
                SMX.ApiActionCode.SetupViewVehicleForm,
                JSON.stringify(req)
            );

            this.setState({
                LstModel: res!.LstModel!,
            });
        } catch (ex) {
            this.props.GlobalStore.Exception = ex;
        }
    }

    async Calculate_Price() {
        try {
            this.props.GlobalStore.ShowLoading();
            let req = new QuickValuationDto();
            let item = new QuickValuationVehicle();
            req.ActionCode = SMX.ActionCode.Calculate_Price;

            if (this.state.SelectedCarType == undefined) {
                this.props.GlobalStore.HideLoading();
                let message = "[Loại xe] Không được để trống";
                this.props.GlobalStore.Exception = ClientMessage(message);
            }
            if (this.state.SelectedBrand == undefined) {
                this.props.GlobalStore.HideLoading();
                let message = "[Hãng sản xuất] Không được để trống";
                this.props.GlobalStore.Exception = ClientMessage(message);
            }
            if (this.state.SelectedModel == undefined) {
                this.props.GlobalStore.HideLoading();
                let message = "[Số loại/Model] Không được để trống";
                this.props.GlobalStore.Exception = ClientMessage(message);
            }
            if (!this.state.ProducedYear || this.state.ProducedYear == '') {
                this.props.GlobalStore.HideLoading();
                let message = "[Năm sản xuất] Không được để trống";
                this.props.GlobalStore.Exception = ClientMessage(message);
                return;
            }

            var producedYear = this.state.ProducedYear;
            item.ProducedYear = producedYear && producedYear.length != 0 ? parseInt(producedYear.split(",").join("")) : undefined;
            item.Brand = this.state.SelectedBrand;
            item.CarType = this.state.SelectedCarType;
            item.Model = this.state.SelectedModel;
            req.QuickValuationVehicle = item;

            let res = await HttpUtils.post<QuickValuationDto>(
                ApiUrl.QuickValuation_Execute,
                SMX.ApiActionCode.ValuationVehicles,
                JSON.stringify(req)
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
            req.OtpCode = this.state.txtOTP;

            let res = await HttpUtils.post<QuickValuationDto>(
                ApiUrl.QuickValuation_Execute,
                SMX.ApiActionCode.ValuationVehicles,
                JSON.stringify(req)
            );


            this.props.GlobalStore.HideLoading();
        } catch (ex) {
            this.props.GlobalStore.HideLoading();
            this.props.GlobalStore.Exception = ex;
        }
    }

    render() {
        return (
            <View style={{ height: height, backgroundColor: "#FFF" }}>
                <Toolbar Title="Tính giá nhanh PTGT Đường bộ" navigation={this.props.navigation} HasDrawer={true} />
                <KeyboardAvoidingView behavior="height" style={{ flex: 1, padding: 10 }}>
                    <ScrollView>
                        <View>
                            <View style={[styles.Item, { marginBottom: 10 }]}>
                                <Text style={{ fontWeight: '600', fontSize: 18 }}>
                                    I. THÔNG TIN CƠ BẢN VỀ PHƯƠNG TIỆN GIAO THÔNG VẬN TẢI ĐƯỜNG BỘ
                                </Text>
                            </View>
                            <View style={styles.Item}>
                                <View style={{ flex: 2, flexDirection: 'row' }}>
                                    <Text >Loại xe </Text>
                                    <Text style={{ color: 'red' }}>*</Text>
                                </View>
                                <View style={{ flex: 3 }}>
                                    <DropDownBox
                                        TextField="Name"
                                        ValueField="SystemParameterID"
                                        DataSource={this.state.LstCarType}
                                        SelectedValue={this.state.SelectedCarType}
                                        OnSelectedItemChanged={(item) => {
                                            this.setState({ SelectedCarType: item.SystemParameterID });
                                        }}
                                    ></DropDownBox>
                                </View>
                            </View>
                            <View style={styles.Item}>
                                <View style={{ flex: 2, flexDirection: 'row' }}>
                                    <Text >Hãng sản xuất </Text>
                                    <Text style={{ color: 'red' }}>*</Text>
                                </View>
                                <View style={{ flex: 3 }}>
                                    <DropDownBox
                                        TextField="Name"
                                        ValueField="SystemParameterID"
                                        DataSource={this.state.LstBrand}
                                        SelectedValue={this.state.SelectedBrand}
                                        OnSelectedItemChanged={(item) => {
                                            this.setState(
                                                { SelectedBrand: item.SystemParameterID },
                                                async () => {
                                                    await this.GetModelByBrand();
                                                }
                                            );
                                        }}
                                    ></DropDownBox>
                                </View>
                            </View>
                            <View style={styles.Item}>
                                <View style={{ flex: 2, flexDirection: 'row' }}>
                                    <Text >Số loại/Model </Text>
                                    <Text style={{ color: 'red' }}>*</Text>
                                </View>
                                <View style={{ flex: 3 }}>
                                    <DropDownBox
                                        TextField="Name"
                                        ValueField="SystemParameterID"
                                        DataSource={this.state.LstModel}
                                        SelectedValue={this.state.SelectedModel}
                                        OnSelectedItemChanged={(item) => {
                                            this.setState({ SelectedModel: item.SystemParameterID });
                                        }}
                                    ></DropDownBox>
                                </View>
                            </View>
                            <View style={styles.Item}>
                                <View style={{ flex: 2, flexDirection: 'row' }}>
                                    <Text >Năm sản xuất </Text>
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
                                        value={this.state.ProducedYear}
                                        style={[Theme.TextInput]}
                                        onChangeText={(val) => {
                                            this.setState({ ProducedYear: val });
                                        }}
                                    />
                                </View>
                            </View>
                            {
                                this.state.TotalPrice ? (
                                    <View>
                                        <View style={[styles.Item, { marginTop: 20 }]}>
                                            <Text style={{ fontWeight: '600', fontSize: 18 }}>
                                                II. GIÁ TƯ VẤN TẠM TÍNH
                                            </Text>
                                        </View>
                                        <View style={styles.Item}>
                                            <View style={{ flex: 2, flexDirection: 'row' }}>
                                                <Text style={{ fontWeight: '600' }}>Đơn giá (đồng) </Text>
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
        paddingVertical: 8,
    },
});