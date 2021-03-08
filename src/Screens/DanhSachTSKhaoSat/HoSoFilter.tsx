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
import Theme from "../../Themes/Default";
import ApiUrl from "../../constants/ApiUrl";
import { WebView } from "react-native-webview";
import Toolbar from "../../components/Toolbar";
import HttpUtils from "../../Utils/HttpUtils";
import SMX from "../../constants/SMX";
import { inject, observer } from "mobx-react";
import GlobalStore from "../../Stores/GlobalStore";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import GlobalCache from "../../Caches/GlobalCache";
import QuickValuationDto from "../../DtoParams/QuickValuationDto";
import DropDownBox from "../../components/DropDownBox";
import SystemParameter from "../../Entities/SystemParameter";
import { TextInputMask } from "react-native-masked-text";
import { ClientMessage } from "../../SharedEntity/SMXException";
import { LinearGradient } from "expo-linear-gradient";
import QuickValuationVehicle from "../../Entities/QuickValuationVehicle";
import Utility from "../../Utils/Utility";
import * as Enums from '../../constants/Enums';
import ProcessValuationDocumentDto, { ProcessValuationDocumentFilter } from "../../DtoParams/ProcessValuationDocumentDto";

const { width, height } = Dimensions.get("window");

interface iProps {
    navigation: any;
    GlobalStore: GlobalStore;
    route: any;
}

interface iState {
    ProcessValuationDocumentFilter: ProcessValuationDocumentFilter;
    CustomerName?: string;
    ProvinceID?: number;
    DistrictID?: number;
    TownID?: number;
    LstProvince: SystemParameter[];
    LstDistrict: SystemParameter[];
    LstTown: SystemParameter[];
}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class HoSoFilter extends React.Component<iProps, iState> {
    private _unsubscribe: any;

    constructor(props: iProps) {
        super(props);

        let pvdFilter = new ProcessValuationDocumentFilter();
        pvdFilter.CustomerName = '';
        pvdFilter.Province = null;
        pvdFilter.District = null;
        pvdFilter.Town = null;

        this.state = {
            ProcessValuationDocumentFilter: this.props.GlobalStore.DSFilterValue
                ? this.props.GlobalStore.DSFilterValue
                : pvdFilter,
            LstProvince: [],
            LstDistrict: [],
            LstTown: [],
        };
    }

    async componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener("focus", () => {
            let pvdFilter = new ProcessValuationDocumentFilter();
            pvdFilter.CustomerName = '';
            pvdFilter.CustomerName = '';
            pvdFilter.Province = null;
            pvdFilter.District = null;
            pvdFilter.Town = null;

            this.setState({ ProcessValuationDocumentFilter: pvdFilter }, () => {
                this.props.GlobalStore.DSFilterValue = pvdFilter;
            });
        });

        await this.SetupViewForm();
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    async SetupViewForm() {
        try {
            this.props.GlobalStore.ShowLoading();
            let req = new ProcessValuationDocumentDto();
            let res = await HttpUtils.post<ProcessValuationDocumentDto>(
                ApiUrl.ProcessValuationDocument_Execute,
                SMX.ApiActionCode.SetupViewForm,
                JSON.stringify(req)
            );

            this.setState({
                LstProvince: res.LstProvince,
            });

            this.props.GlobalStore.HideLoading();
        } catch (ex) {
            this.props.GlobalStore.HideLoading();
            this.props.GlobalStore.Exception = ex;
        }
    }

    async SetupDistrict(provinceID: number) {
        try {
            let req = new ProcessValuationDocumentDto();
            req.ProvinceID = provinceID;
            let res = await HttpUtils.post<ProcessValuationDocumentDto>(
                ApiUrl.ProcessValuationDocument_Execute,
                SMX.ApiActionCode.SetupViewForm,
                JSON.stringify(req)
            );

            this.setState({
                LstDistrict: res.LstDistrict,
            });
        } catch (ex) {
            this.props.GlobalStore.Exception = ex;
        }
    }

    async SetupTown(districtID: number) {
        try {
            let req = new ProcessValuationDocumentDto();
            req.DistrictID = districtID;
            let res = await HttpUtils.post<ProcessValuationDocumentDto>(
                ApiUrl.ProcessValuationDocument_Execute,
                SMX.ApiActionCode.SetupViewForm,
                JSON.stringify(req)
            );

            this.setState({
                LstTown: res.LstTown,
            });
        } catch (ex) {
            this.props.GlobalStore.Exception = ex;
        }
    }

    onPVD_Filter() {
        let pvdFilter = this.state.ProcessValuationDocumentFilter;

        this.props.GlobalStore.DSFilterValue = pvdFilter;

        let screen = this.props.route.params.Screen;
        if (screen == Enums.FeatureId.DanhSachTSKhaoSat) {
            this.props.GlobalStore.DanhSachTSKhaoSatFilterTrigger();
        } else if (screen == Enums.FeatureId.ApprovingValuation) {
            this.props.GlobalStore.ApprovingValuationFilterTrigger();
        } else if (screen == Enums.FeatureId.HoSoDangDinhGia) {
            this.props.GlobalStore.HoSoDangDinhGiaFilterTrigger();
        }

        this.props.navigation.goBack();
    }

    render() {
        let pvdFilter = this.state.ProcessValuationDocumentFilter;
        return (
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <Toolbar Title="Tìm kiếm" navigation={this.props.navigation} />

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ flex: 1, padding: 10 }}>
                        <View style={styles.Item}>
                            <View style={{ flex: 2, flexDirection: 'row' }}>
                                <Text style={{ fontWeight: "600" }}>Tên khách hàng </Text>
                            </View>
                            <View style={{ flex: 3 }}>
                                <TextInput
                                    multiline={true}
                                    numberOfLines={1}
                                    style={[Theme.TextInput]}
                                    value={pvdFilter.CustomerName}
                                    onChangeText={(val) => {
                                        pvdFilter.CustomerName = val;
                                        this.setState({ ProcessValuationDocumentFilter: pvdFilter });
                                    }}
                                />
                            </View>
                        </View>
                        <View
                            style={{
                                height: 1,
                                backgroundColor: "gainsboro",
                                marginBottom: 8,
                            }}
                        />
                        <View style={styles.Item}>
                            <View style={{ flex: 2, flexDirection: 'row' }}>
                                <Text >Tỉnh/Thành phố </Text>
                                {/* <Text style={{ color: 'red' }}>*</Text> */}
                            </View>
                            <View style={{ flex: 3 }}>
                                <DropDownBox
                                    TextField="Name"
                                    ValueField="SystemParameterID"
                                    DataSource={this.state.LstProvince}
                                    SelectedValue={pvdFilter.Province}
                                    OnSelectedItemChanged={(item) => {
                                        pvdFilter.Province = item.SystemParameterID;
                                        this.setState(
                                            { ProcessValuationDocumentFilter: pvdFilter },
                                            async () => this.SetupDistrict(item.SystemParameterID)
                                        );
                                    }}
                                ></DropDownBox>
                            </View>
                        </View>
                        <View
                            style={{
                                height: 1,
                                backgroundColor: "gainsboro",
                                marginBottom: 8,
                            }}
                        />
                        <View style={styles.Item}>
                            <View style={{ flex: 2, flexDirection: 'row' }}>
                                <Text >Quận/Huyện </Text>
                                {/* <Text style={{ color: 'red' }}>*</Text> */}
                            </View>
                            <View style={{ flex: 3 }}>
                                <DropDownBox
                                    TextField="Name"
                                    ValueField="SystemParameterID"
                                    DataSource={this.state.LstDistrict}
                                    SelectedValue={pvdFilter.District}
                                    OnSelectedItemChanged={(item) => {
                                        pvdFilter.District = item.SystemParameterID;
                                        this.setState(
                                            { ProcessValuationDocumentFilter: pvdFilter },
                                            async () => this.SetupTown(item.SystemParameterID)
                                        );
                                    }}
                                ></DropDownBox>
                            </View>
                        </View>
                        <View
                            style={{
                                height: 1,
                                backgroundColor: "gainsboro",
                                marginBottom: 8,
                            }}
                        />
                        <View style={styles.Item}>
                            <View style={{ flex: 2, flexDirection: 'row' }}>
                                <Text >Xã/Phường/Thị trấn </Text>
                                {/* <Text style={{ color: 'red' }}>*</Text> */}
                            </View>
                            <View style={{ flex: 3 }}>
                                <DropDownBox
                                    TextField="Name"
                                    ValueField="SystemParameterID"
                                    DataSource={this.state.LstTown}
                                    SelectedValue={pvdFilter.Town}
                                    OnSelectedItemChanged={(item) => {
                                        pvdFilter.Town = item.SystemParameterID;
                                        this.setState({ ProcessValuationDocumentFilter: pvdFilter });
                                    }}
                                ></DropDownBox>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={{ justifyContent: 'center', alignItems: 'center' }}
                            onPress={() => {
                                this.onPVD_Filter();
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
                                <Text style={Theme.BtnTextGradient}>Tìm kiếm</Text>
                            </LinearGradient>
                            <Text style={{ color: "#FFF", fontSize: 18, textAlign: "center" }}></Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

            </View>
        );
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


