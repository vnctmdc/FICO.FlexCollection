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
import FontAwesome from "react-native-vector-icons/FontAwesome";
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
import ProcessValuationEquipment from "../../../Entities/ProcessValuationEquipment";
import adm_Attachment from "../../../Entities/adm_Attachment";
import AttachmentDto from "../../../DtoParams/AttachmentDto";
import Gallery from "../../../components/Gallery";

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
    ProcessValuationEquipment?: ProcessValuationEquipment;
    ListWorkfieldImage?: adm_Attachment[];

}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class VehicleRoadImagesSrc extends Component<iProps, iState> {
    constructor(props: any) {
        super(props);
        this.state = {
            showCustomerInfo: true,
            ProcessValuation: new ProcessValuation(),
            ProcessValuationDocument: new ProcessValuationDocument(),
            WorkfieldDistance: '',
            ProcessValuationEquipment: new ProcessValuationEquipment(),
            ListWorkfieldImage: []

        };
    }
    async componentDidMount() {
        await this.LoadData();
    }

    async LoadData() {
        try {
            this.props.GlobalStore.ShowLoading();
            var req = new AttachmentDto();
            req.MACode2 = SMX.MortgageAssetCode2.Equipments;
            req.ProcessValuationDocumentID = this.props.route.params.ProcessValuationDocumentID;

            let res = await HttpUtils.post<AttachmentDto>(
                ApiUrl.Attachment_Execute,
                SMX.ApiActionCode.LoadData,
                JSON.stringify(req)
            );

            if (res) {
                this.setState({
                    ProcessValuationEquipment: res!.ProcessValuationEquipment,
                    ListWorkfieldImage: res!.ListWorkfieldImage!
                });
            }

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
        let pvE = this.state.ProcessValuationEquipment;
        return (
            <View style={{ height: height, backgroundColor: "#F6F6FE" }}>
                <Toolbar Title="CC Khảo sát hiện trạng - Hình ảnh" navigation={this.props.navigation} />
                <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={{ paddingHorizontal: 8 }}
                    >
                        <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <TouchableOpacity
                                style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}
                                onPress={() => {
                                    this.props.navigation.navigate("VehicleRoadScr", {
                                        ProcessValuationDocumentID: pvE.ProcessValuationDocumentID
                                    });
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
                                    <Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 8 }}>Khảo sát TS</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}
                                onPress={() => {
                                    this.props.navigation.navigate("DanhsachTSKhaoSatSrc");
                                }}
                            >
                                <LinearGradient
                                    colors={["#FFFFFF", "#FFFFFF"]}
                                    style={{
                                        width: width / 3 - 40,
                                        height: 40,
                                        backgroundColor: "#FFFFFF",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        flexDirection: 'row',
                                        marginLeft: 15,
                                        borderColor: '#ddd',
                                        borderRadius: 5,
                                        borderWidth: 1

                                    }}
                                >
                                    <FontAwesome5 name="times" size={18} color="#000000" />
                                    <Text style={{ color: '#000000', fontSize: 15, marginLeft: 8 }}>Thoát</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>

                        <View style={{ backgroundColor: '#FFFFFF', borderColor: '#7ba6c2', borderRadius: 5, borderWidth: 1, marginVertical: 8, paddingHorizontal: 8, paddingVertical: 12 }}>
                            <View style={{ marginBottom: 3, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <FontAwesome5 name="user-alt" size={15} color="#000" />
                                    <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: "600" }}>
                                        Thông tin khách hàng
                                    </Text>
                                </View>
                                {/* {
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
                                } */}
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
                                                <Text>{pvE.CustomerName}</Text>
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
                                            <View style={{ flex: 2, flexDirection: 'row' }}>
                                                <Text style={{ width: width - 30 }}>Địa chỉ thực tế: {pvE.InfactAddress}</Text>
                                            </View>
                                        </View>
                                    </View>
                                ) : undefined
                            }
                        </View>
                        <View style={{ backgroundColor: '#FFFFFF', borderColor: '#7ba6c2', borderRadius: 5, borderWidth: 1, marginVertical: 8, paddingVertical: 12 }}>
                            <Gallery
                                navigation={this.props.navigation}
                                Images={this.state.ListWorkfieldImage}
                                numberColumn={2}
                                allowEdit={true}
                                allowRemove={true}

                            />
                        </View>

                        <View style={{ marginVertical: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity
                                style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}
                                onPress={() => {
                                    this.props.navigation.goBack();
                                }}
                            >
                                <LinearGradient
                                    colors={["#F07700", "#F07700"]}
                                    style={{
                                        width: width / 3 + 8,
                                        height: 40,
                                        backgroundColor: "#007AFF",
                                        borderRadius: 5,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        flexDirection: 'row',

                                    }}
                                >
                                    <FontAwesome5 name="file-alt" size={15} color="#FFFFFF" />
                                    <Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 8 }}>Tải lên BB KSHT</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}
                                onPress={() => {
                                    this.props.navigation.goBack();
                                }}
                            >
                                <LinearGradient
                                    colors={["#F07700", "#F07700"]}
                                    style={{
                                        width: width / 3 - 20,
                                        height: 40,
                                        backgroundColor: "#007AFF",
                                        borderRadius: 5,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        flexDirection: 'row',

                                    }}
                                >
                                    <FontAwesome name="flag-checkered" size={16} color="#FFFFFF" />
                                    <Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 8 }}>Hoàn thành</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}
                                onPress={() => {
                                    this.props.navigation.goBack();
                                }}
                            >
                                <LinearGradient
                                    colors={["#F07700", "#F07700"]}
                                    style={{
                                        width: width / 3 - 32,
                                        height: 40,
                                        backgroundColor: "#007AFF",
                                        borderRadius: 5,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        flexDirection: 'row',

                                    }}
                                >
                                    <FontAwesome name="file-image-o" size={15} color="#FFFFFF" />
                                    <Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 8 }}>Thêm ảnh</Text>
                                </LinearGradient>
                            </TouchableOpacity>
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