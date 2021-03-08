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
import Utility from "../../../Utils/Utility";
import ProcessValuationDto from "../../../DtoParams/ProcessValuationDto";
import ProcessValuation from "../../../Entities/ProcessValuation";
import ProcessValuationDocument from "../../../Entities/ProcessValuationDocument";

const { width, height } = Dimensions.get("window");

interface iProps {
    navigation: any;
    route: any;
    GlobalStore: GlobalStore;
}
interface iState {
    ProcessValuationDocumentID?: number;
    showCustomerInfo: boolean;
    ProcessValuation?: ProcessValuation;
    ProcessValuationDocument?: ProcessValuationDocument;
    WorkfieldDistance?: string;

}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class BatchEquipmentSrc extends Component<iProps, iState> {
    constructor(props: any) {
        super(props);
        this.state = {
            showCustomerInfo: true,
            ProcessValuation: new ProcessValuation(),
            ProcessValuationDocument: new ProcessValuationDocument(),
            WorkfieldDistance: '',


        };
    }
    async componentDidMount() {
        await this.LoadData();
    }

    async LoadData() {
        try {
            this.props.GlobalStore.ShowLoading();
            var req = new ProcessValuationDto();


            this.props.GlobalStore.HideLoading();
        } catch (ex) {
            this.props.GlobalStore.Exception = ex;
            this.props.GlobalStore.HideLoading();
        }

    }

    async btn_KhaoSatTaiSan() {
        try {
            this.props.GlobalStore.ShowLoading();
            // let res = await HttpUtils.post<QuickValuationDto>(
            //     ApiUrl.QuickValuation_Execute,
            //     SMX.ApiActionCode.SetupViewVehicleForm,
            //     JSON.stringify(new QuickValuationDto())
            // );

            // if (res) {
            //     this.setState({
            //     });
            // }
            this.props.GlobalStore.HideLoading();
        } catch (ex) {
            this.props.GlobalStore.HideLoading();
            this.props.GlobalStore.Exception = ex;
        }
    }

    render() {
        let pvd = this.state.ProcessValuationDocument;
        return (
            <View style={{ height: height, backgroundColor: "#FFF" }}>
                <Toolbar Title="Khảo sát hiện trạng - Khảo sát TS" navigation={this.props.navigation} />
                <KeyboardAvoidingView behavior="height" style={{ flex: 1, paddingHorizontal: 8 }}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={{ marginTop: 10 }}>
                            <TouchableOpacity
                                style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}
                                onPress={() => {
                                    this.btn_KhaoSatTaiSan();
                                }}
                            >
                                <LinearGradient
                                    colors={["#F07700", "#F07700"]}
                                    style={{
                                        width: width / 3,
                                        height: 40,
                                        backgroundColor: "#007AFF",
                                        borderRadius: 5,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        flexDirection: 'row',

                                    }}
                                >
                                    <FontAwesome5 name="file-alt" size={18} color="#FFFFFF" />
                                    <Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 8 }}>Hồ sơ TS</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}
                                onPress={() => {
                                    this.btn_KhaoSatTaiSan();
                                }}
                            >
                                <LinearGradient
                                    colors={["#F07700", "#F07700"]}
                                    style={{
                                        width: width / 3,
                                        height: 40,
                                        backgroundColor: "#007AFF",
                                        borderRadius: 5,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        flexDirection: 'row',

                                    }}
                                >
                                    <FontAwesome5 name="file-alt" size={18} color="#FFFFFF" />
                                    <Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 8 }}>Hình ảnh TS</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>

                        <View style={{ backgroundColor: '#eaf2f6', borderColor: '#7ba6c2', borderWidth: 1, marginTop: 8, paddingHorizontal: 8, paddingVertical: 12 }}>
                            <View style={{ marginBottom: 3, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <FontAwesome5 name="user-alt" size={15} color="#000" />
                                    <Text style={{ marginLeft: 5, fontSize: 15 }}>
                                        Thông tin khách hàng
                                    </Text>
                                </View>
                                {
                                    this.state.showCustomerInfo ? (
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({ showCustomerInfo: false })
                                            }}
                                        >
                                            < FontAwesome5 name="minus-circle" size={25} color="#000" />
                                        </TouchableOpacity>
                                    ) : (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.setState({ showCustomerInfo: true })
                                                }}
                                            >
                                                <FontAwesome5 name="plus-circle" size={25} color="#000" />
                                            </TouchableOpacity>
                                        )
                                }
                            </View>
                            <View
                                style={{
                                    height: 1,
                                    backgroundColor: "#7ba6c2",
                                }}
                            ></View>
                            {
                                this.state.showCustomerInfo ? (
                                    <View style={{ marginTop: 8, marginBottom: 10 }}>
                                        <View style={styles.Item}>
                                            <View style={{ flex: 2, flexDirection: 'row' }}>
                                                <Text >Tên khách hàng: </Text>
                                                <Text>{pvd.CustomerName}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.Item}>
                                            <View style={{ flex: 2, flexDirection: 'row' }}>
                                                <Text style={{ width: width - 30 }}>Địa chỉ thực tế: {pvd.MortgageAssetAddress}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.Item}>
                                            <View style={{ flex: 2, flexDirection: 'row' }}>
                                                <Text >Khoảng cách đi thẩm định (km) </Text>
                                                <Text style={{ color: 'red' }}>*</Text>
                                            </View>
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
                                                value={this.state.WorkfieldDistance}
                                                style={[Theme.TextInput]}
                                                onChangeText={(val) => {
                                                    this.setState({ WorkfieldDistance: val });
                                                }}
                                            />
                                        </View>
                                        <View style={styles.TextAndDrop}>
                                            <View style={{ flex: 2, marginBottom: 3 }}>
                                                <Text >Mẫu báo cáo </Text>
                                            </View>
                                            <View style={{ flex: 3 }}>
                                                {/* <DropDownBox
                                                    TextField="Name"
                                                    ValueField="SystemParameterID"
                                                    DataSource={this.state.LstMortgageAssetCode2}
                                                    SelectedValue={this.state.SelectedMortgageAssetCode2}
                                                    OnSelectedItemChanged={(item) => {
                                                        this.setState({ SelectedMortgageAssetCode2: item.SystemParameterID });
                                                    }}
                                                ></DropDownBox> */}
                                            </View>
                                        </View>
                                    </View>
                                ) : undefined
                            }
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView >
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
        paddingVertical: 8,
    },
    TextAndDrop: {
        marginTop: 10
    }
});