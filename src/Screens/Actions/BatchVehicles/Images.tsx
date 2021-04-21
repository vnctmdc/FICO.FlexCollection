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
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
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
import ActionDTO from "../../../DtoParams/ProcessValuationDto";
import ProcessValuation from "../../../Entities/ProcessValuation";
import ProcessValuationDocument from "../../../Entities/ProcessValuationDocument";
import ProcessValuationEquipment from "../../../Entities/ProcessValuationEquipment";
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
    ProcessValuationEquipment?: ProcessValuationEquipment;
    WorkfieldDistance?: string;

}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class BatchVehiclesImagesSrc extends Component<iProps, iState> {
    constructor(props: any) {
        super(props);
        this.state = {
            showCustomerInfo: true,
            ProcessValuation: new ProcessValuation(),
            ProcessValuationDocument: new ProcessValuationDocument(),
            ProcessValuationEquipment: new ProcessValuationEquipment(),
            WorkfieldDistance: '',


        };
    }
    async componentDidMount() {
        await this.LoadData();
    }

    async LoadData() {
        try {
            this.props.GlobalStore.ShowLoading();
            var req = new ActionDTO();
            req.MACode2 = SMX.MortgageAssetCode2.Equipments;
            req.ProcessValuationDocumentID = this.props.route.params.ProcessValuationDocumentID;

            let res = await HttpUtils.post<ProcessValuationDto>(
                ApiUrl.ProcessValuation_Execute,
                SMX.ApiActionCode.Actions,
                JSON.stringify(req)
            );
            if (res) {
                this.setState({

                    ProcessValuationEquipment: res!.ProcessValuationEquipment,
                    WorkfieldDistance: res!.ProcessValuationEquipment.WorkfieldDistance + ''
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
        //let pvd = this.state.ProcessValuationDocument;
        let pvE = this.state.ProcessValuationEquipment;
        return (
            <View style={{ height: height, backgroundColor: "#FFF" }}>
                <Toolbar Title="Khảo sát hiện trạng - Khảo sát TS" navigation={this.props.navigation} />
                <KeyboardAvoidingView behavior="height" style={{ flex: 1, paddingHorizontal: 8 }}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <TouchableOpacity
                                style={{ justifyContent: 'flex-end', alignItems: 'flex-end', marginRight: 15 }}
                                onPress={() => {
                                    this.props.navigation.navigate("ReBuildingsSrc", {
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
                                    this.props.navigation.navigate("DanhsachTSKhaoSatSrc", {
                                        ProcessValuationDocumentID: pvE.ProcessValuationDocumentID
                                    });
                                }}
                            >
                                <LinearGradient
                                    colors={["#d3d0c9", "#d3d0c9"]}
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
                                    <FontAwesome5 name="times" size={18} color="#00000" />
                                    <Text style={{ color: '#00000', fontSize: 15, marginLeft: 8 }}>Thoát</Text>
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
                                                <Text>{pvE.CustomerName}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.Item}>
                                            <View style={{ flex: 2, flexDirection: 'row' }}>
                                                <Text style={{ width: width - 30 }}>Địa chỉ trên GCN: {pvE.InfactAddress}</Text>
                                            </View>
                                        </View>

                                    </View>
                                ) : undefined
                            }

                        </View>
                        <View style={{ backgroundColor: '#00000', borderColor: '#7ba6c2', borderWidth: 1, marginTop: 8, paddingHorizontal: 8, paddingVertical: 12 }}>
                            <View style={{ marginLeft: 5, marginBottom: 10, flexDirection: 'row' }}>
                                <FontAwesome5 name="map-marker-alt" size={18} color="#00000" />
                                <Text> Vị trí tài sản</Text>
                            </View>
                            <View
                                style={{
                                    height: 1,
                                    backgroundColor: "#7ba6c2",
                                }}
                            ></View>
                            <View style={{ backgroundColor: '#00000', borderColor: '#7ba6c2', borderWidth: 1, marginTop: 8, paddingHorizontal: 8, paddingVertical: 12 }}>
                                <View style={{ flex: 2, flexDirection: 'row' }}>
                                    <FontAwesome5 name="image" size={18} color="#000000" />
                                    <Text style={{ color: '#000000', fontSize: 15, marginLeft: 8, paddingBottom: 10 }}>Sơ đồ vệ tinh </Text>
                                </View>
                                <View
                                    style={{
                                        height: 1,
                                        backgroundColor: "#7ba6c2",
                                    }}
                                ></View>
                                <View style={{ flex: 2, flexDirection: 'column' }}>
                                    <Image
                                        style={styles.TinyImage}
                                        source={require("../../../../assets/pig.png")}
                                    />
                                    <View style={{ flex: 2, flexDirection: 'row' }}>
                                        <TouchableOpacity
                                            style={{ marginLeft: 10, justifyContent: 'flex-end', alignItems: 'flex-end' }}
                                            onPress={() => {
                                                Alert.alert("Hihi");
                                            }}
                                        >
                                            <Text style={{ color: '#1c8fbb' }}>Tải lên  |</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={{ marginLeft: 10, justifyContent: 'flex-end', alignItems: 'flex-end' }}
                                            onPress={() => {
                                                Alert.alert("HeHe");
                                            }}
                                        >
                                            <Text style={{ color: '#1c8fbb' }}> Xóa</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{ backgroundColor: '#00000', borderColor: '#7ba6c2', borderWidth: 1, marginTop: 8, paddingHorizontal: 8, paddingVertical: 12 }}>
                            <View style={{ backgroundColor: '#00000', borderColor: '#7ba6c2', borderWidth: 1, marginTop: 8, paddingHorizontal: 8, paddingVertical: 12 }}>
                                <View style={{ flex: 2, flexDirection: 'row', paddingBottom: 10 }}>
                                    <FontAwesome5 name="image" size={18} color="#000000" />
                                    <Text style={{ color: '#000000', fontSize: 15, marginLeft: 8 }}>Hình ảnh tổng quan tòa nhà </Text>
                                </View>
                                <View
                                    style={{
                                        height: 1,
                                        backgroundColor: "#7ba6c2",
                                    }}
                                ></View>
                                <View style={{ flex: 2, flexDirection: 'column' }}>
                                    <Image
                                        style={styles.TinyImage}
                                        source={require("../../../../assets/pig.png")}
                                    />
                                    <View style={{ flex: 2, flexDirection: 'row' }}>
                                        <TouchableOpacity
                                            style={{ marginLeft: 10, justifyContent: 'flex-end', alignItems: 'flex-end' }}
                                            onPress={() => {
                                                Alert.alert("Hihi");
                                            }}
                                        >
                                            <Text style={{ color: '#1c8fbb' }}>Tải lên  |</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={{ marginLeft: 10, justifyContent: 'flex-end', alignItems: 'flex-end' }}
                                            onPress={() => {
                                                Alert.alert("HeHe");
                                            }}
                                        >
                                            <Text style={{ color: '#1c8fbb' }}> Xóa</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{ backgroundColor: '#00000', borderColor: '#7ba6c2', borderWidth: 1, marginTop: 8, paddingHorizontal: 8, paddingVertical: 12 }}>
                            <View style={{ backgroundColor: '#00000', borderColor: '#7ba6c2', borderWidth: 1, marginTop: 8, paddingHorizontal: 8, paddingVertical: 12 }}>
                                <View style={{ flex: 2, flexDirection: 'row', paddingBottom: 10 }}>
                                    <FontAwesome5 name="image" size={18} color="#000000" />
                                    <Text style={{ color: '#000000', fontSize: 15, marginLeft: 8 }}>Đường giao thông phía ngoài tòa nhà </Text>
                                </View>
                                <View
                                    style={{
                                        height: 1,
                                        backgroundColor: "#7ba6c2",
                                    }}
                                ></View>
                                <View style={{ flex: 2, flexDirection: 'column' }}>
                                    <Image
                                        style={styles.TinyImage}
                                        source={require("../../../../assets/pig.png")}
                                    />
                                    <View style={{ flex: 2, flexDirection: 'row' }}>
                                        <TouchableOpacity
                                            style={{ marginLeft: 10, justifyContent: 'flex-end', alignItems: 'flex-end' }}
                                            onPress={() => {
                                                Alert.alert("Hihi");
                                            }}
                                        >
                                            <Text style={{ color: '#1c8fbb' }}>Tải lên  |</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={{ marginLeft: 10, justifyContent: 'flex-end', alignItems: 'flex-end' }}
                                            onPress={() => {
                                                Alert.alert("HeHe");
                                            }}
                                        >
                                            <Text style={{ color: '#1c8fbb' }}> Xóa</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{ backgroundColor: '#00000', borderColor: '#7ba6c2', borderWidth: 1, marginTop: 8, paddingHorizontal: 8, paddingVertical: 12 }}>
                            <View style={{ backgroundColor: '#00000', borderColor: '#7ba6c2', borderWidth: 1, marginTop: 8, paddingHorizontal: 8, paddingVertical: 12 }}>
                                <View style={{ flex: 2, flexDirection: 'row', paddingBottom: 10 }}>
                                    <FontAwesome5 name="image" size={18} color="#000000" />
                                    <Text style={{ color: '#000000', fontSize: 15, marginLeft: 8 }}>Hiện trạng </Text>
                                </View>
                                <View
                                    style={{
                                        height: 1,
                                        backgroundColor: "#7ba6c2",
                                    }}
                                ></View>
                                <View style={{ flex: 2, flexDirection: 'column' }}>
                                    <Image
                                        style={styles.TinyImage}
                                        source={require("../../../../assets/pig.png")}
                                    />
                                    <View style={{ flex: 2, flexDirection: 'row' }}>
                                        <TouchableOpacity
                                            style={{ marginLeft: 10, justifyContent: 'flex-end', alignItems: 'flex-end' }}
                                            onPress={() => {
                                                Alert.alert("Hihi");
                                            }}
                                        >
                                            <Text style={{ color: '#1c8fbb' }}>Tải lên  |</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={{ marginLeft: 10, justifyContent: 'flex-end', alignItems: 'flex-end' }}
                                            onPress={() => {
                                                Alert.alert("HeHe");
                                            }}
                                        >
                                            <Text style={{ color: '#1c8fbb' }}> Xóa</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{ backgroundColor: '#00000', borderColor: '#7ba6c2', borderWidth: 1, marginTop: 8, paddingHorizontal: 8, paddingVertical: 12 }}>
                            <View style={{ backgroundColor: '#00000', borderColor: '#7ba6c2', borderWidth: 1, marginTop: 8, paddingHorizontal: 8, paddingVertical: 12 }}>
                                <View style={{ flex: 2, flexDirection: 'row', paddingBottom: 10 }}>
                                    <FontAwesome5 name="image" size={18} color="#000000" />
                                    <Text style={{ color: '#000000', fontSize: 15, marginLeft: 8 }}>Hiện trạng </Text>
                                </View>
                                <View
                                    style={{
                                        height: 1,
                                        backgroundColor: "#7ba6c2",
                                    }}
                                ></View>
                                <View style={{ flex: 2, flexDirection: 'column' }}>
                                    <Image
                                        style={styles.TinyImage}
                                        source={require("../../../../assets/pig.png")}
                                    />
                                    <View style={{ flex: 2, flexDirection: 'row' }}>
                                        <TouchableOpacity
                                            style={{ marginLeft: 10, justifyContent: 'flex-end', alignItems: 'flex-end' }}
                                            onPress={() => {
                                                Alert.alert("Hihi");
                                            }}
                                        >
                                            <Text style={{ color: '#1c8fbb' }}>Tải lên  |</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={{ marginLeft: 10, justifyContent: 'flex-end', alignItems: 'flex-end' }}
                                            onPress={() => {
                                                Alert.alert("HeHe");
                                            }}
                                        >
                                            <Text style={{ color: '#1c8fbb' }}> Xóa</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{ backgroundColor: '#00000', borderColor: '#7ba6c2', borderWidth: 1, marginTop: 8, paddingHorizontal: 8, paddingVertical: 12 }}>
                            <View style={{ marginVertical: 15, justifyContent: 'center', flexDirection: 'row' }}>
                                <TouchableOpacity
                                    style={{ marginLeft: 10, justifyContent: 'flex-end', alignItems: 'flex-end', width: width / 2 - 120 }}
                                    onPress={() => {
                                        Alert.alert("SAY HI");
                                    }}
                                >
                                    <LinearGradient
                                        colors={["#F07700", "#F07700"]}
                                        style={{
                                            width: width / 4 + 15,
                                            height: 40,
                                            backgroundColor: "#007AFF",
                                            borderRadius: 5,
                                            justifyContent: "center",
                                            alignItems: "center",
                                            flexDirection: 'row',

                                        }}
                                    >
                                        <FontAwesome5 name="save" size={18} color="#FFFFFF" />
                                        <Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 8 }}>Thêm ảnh</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>

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
    },
    TinyImage: {
        width: 200,
        height: 200,
    },
});