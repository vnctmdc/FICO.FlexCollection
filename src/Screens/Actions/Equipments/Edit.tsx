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
import * as Enums from '../../../constants/Enums';
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
import ProcessValuationEquipment from "../../../Entities/ProcessValuationEquipment";
import MarkerObject from "../../../SharedEntity/MarkerObject";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

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
    Type?: string;
    Specification?: string;
    Description?: string;
    ProcessValuationEquipment?: ProcessValuationEquipment;
    location?: MarkerObject;
}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class EquipmentsSrc extends Component<iProps, iState> {
    constructor(props: any) {
        super(props);
        this.state = {
            showCustomerInfo: true,
            ProcessValuation: new ProcessValuation(),
            ProcessValuationDocument: new ProcessValuationDocument(),
            ProcessValuationEquipment: new ProcessValuationEquipment(),
            WorkfieldDistance: '',
            Type: '',
            Specification: '',
            Description: '',
        };
    }
    async componentDidMount() {
        await this.LoadData();
        this.getLocationAsync();
    }

    async LoadData() {
        try {
            this.props.GlobalStore.ShowLoading();
            var req = new ProcessValuationDto();
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
                    ProcessValuation: res!.ProcessValuation,
                    WorkfieldDistance: res!.ProcessValuationEquipment.WorkfieldDistance + ''
                });
            }


            this.props.GlobalStore.HideLoading();
        } catch (ex) {
            this.props.GlobalStore.Exception = ex;
            this.props.GlobalStore.HideLoading();
        }

    }

    async btn_Save() {
        try {
            this.props.GlobalStore.ShowLoading();
            let req = new ProcessValuationDto();
            req.MACode2 = SMX.MortgageAssetCode2.Equipments;
            let item = this.state.ProcessValuationEquipment;
            let pvd = new ProcessValuationDocument();
            let pv = new ProcessValuation();

            if (!this.state.WorkfieldDistance || this.state.WorkfieldDistance == '') {
                this.props.GlobalStore.HideLoading();
                let message = "[Khoảng cách đi thẩm định (km)] Không được để trống";
                this.props.GlobalStore.Exception = ClientMessage(message);
                return;
            }
            if (!this.state.ProcessValuationEquipment.Type || this.state.ProcessValuationEquipment.Type == '') {
                this.props.GlobalStore.HideLoading();
                let message = "[Tên máy móc thiết bị] Không được để trống";
                this.props.GlobalStore.Exception = ClientMessage(message);
                return;
            }
            if (!this.state.ProcessValuationEquipment.Specification || this.state.ProcessValuationEquipment.Specification == '') {
                this.props.GlobalStore.HideLoading();
                let message = "[Khoảng cách đi thẩm định (km)] Không được để trống";
                this.props.GlobalStore.Exception = ClientMessage(message);
                return;
            }
            if (!this.state.ProcessValuationEquipment.Description || this.state.ProcessValuationEquipment.Description == '') {
                this.props.GlobalStore.HideLoading();
                let message = "[Mô tả sơ bộ tài sản] Không được để trống";
                this.props.GlobalStore.Exception = ClientMessage(message);
                return;
            }

            var workfieldDistance = this.state.WorkfieldDistance;
            item.WorkfieldDistance = workfieldDistance && workfieldDistance.length != 0 ? parseFloat(workfieldDistance.split(",").join(".")) : undefined;

            pvd.ProcessValuationDocumentID = item.ProcessValuationDocumentID;
            pvd.WorkfieldDistance = workfieldDistance && workfieldDistance.length != 0 ? parseFloat(workfieldDistance.split(",").join(".")) : undefined;
            pvd.Version = item.PVDVersion;

            pv.ProcessValuationID = item.ProcessValuationID;
            pv.Version = item.PVVersion;

            req.ProcessValuationEquipment = item;
            req.ProcessValuationDocument = pvd;
            req.ProcessValuation = pv;


            let res = await HttpUtils.post<ProcessValuationDto>(
                ApiUrl.ProcessValuation_Execute,
                SMX.ApiActionCode.SaveActions,
                JSON.stringify(req)
            );

            if (res) {
                this.setState({
                    ProcessValuationEquipment: res!.ProcessValuationEquipment!,
                    ProcessValuation: res!.ProcessValuation,
                    WorkfieldDistance: res!.ProcessValuationEquipment.WorkfieldDistance + ''
                });
            }

            this.props.GlobalStore.HideLoading();

        } catch (ex) {
            this.props.GlobalStore.Exception = ex;
            this.props.GlobalStore.HideLoading();
        }
    }

    async getLocationAsync() {
        let location = await Location.getCurrentPositionAsync({});
        this.setState({
            location: new MarkerObject(1, location.coords.latitude, location.coords.longitude, "Vị trí hiện tại"),
        });
    }

    async btn_CheckIn() {
        try {
            this.props.GlobalStore.ShowLoading();
            await this.btn_Save();
            var req = new ProcessValuationDto();
            req.MACode2 = SMX.MortgageAssetCode2.Equipments;
            var item = this.state.ProcessValuationDocument;
            let pvd = new ProcessValuationDocument();
            let pv = new ProcessValuation();

            pvd.ProcessValuationDocumentID = item.ProcessValuationDocumentID;
            pvd.Status = Enums.ProcessValuationDocument.KhaoSatHienTrang;

            pv.ProcessValuationID = this.state.ProcessValuation.ProcessValuationID;
            pv.CoordinateLat = this.state.location.Latitude.toString();
            pv.CoordinateLon = this.state.location.Longitude.toString();
            pv.Coordinate = `${this.state.location.Latitude.toString()},${this.state.location.Longitude.toString()}`;

            req.ProcessValuationDocument = pvd;
            req.ProcessValuation = pv;


            let res = await HttpUtils.post<ProcessValuationDto>(
                ApiUrl.ProcessValuation_Execute,
                SMX.ApiActionCode.CheckInActions,
                JSON.stringify(req)
            );

            this.props.GlobalStore.HideLoading();

        } catch (ex) {
            this.props.GlobalStore.Exception = ex;
            this.props.GlobalStore.HideLoading();
        }
    }

    render() {
        let pvE = this.state.ProcessValuationEquipment;
        return (
            <View style={{ height: height, backgroundColor: "#F6F6FE" }}>
                <Toolbar Title="Khảo sát hiện trạng - Khảo sát TS" navigation={this.props.navigation} />
                <KeyboardAvoidingView behavior="height" style={{ flex: 1, paddingHorizontal: 8 }}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <TouchableOpacity
                                style={{ justifyContent: 'flex-end', alignItems: 'flex-end', marginRight: 15 }}
                                onPress={() => {
                                    this.props.navigation.navigate("KhaoSatHienTrangScr", {
                                        ProcessValuationDocumentID: pvE.ProcessValuationDocumentID
                                    });
                                }}
                            >
                                <LinearGradient
                                    colors={["#F07700", "#F07700"]}
                                    style={{
                                        width: width / 3 - 30,
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
                                    this.props.navigation.navigate("EquipmentImagesSrc", {
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
                                    <FontAwesome5 name="image" size={18} color="#FFFFFF" />
                                    <Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 8 }}>Hình ảnh TS</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>

                        <View style={{ backgroundColor: '#FFFFFF', borderColor: '#7ba6c2', borderRadius: 5, borderWidth: 1, marginTop: 8, paddingHorizontal: 8, paddingVertical: 12 }}>
                            <View style={{ marginBottom: 3, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <FontAwesome5 name="user-alt" size={15} color="#000" />
                                    <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: '600' }}>
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
                                        ></View>
                                        <View style={styles.Item}>
                                            <View style={{ flex: 2, flexDirection: 'row' }}>
                                                <Text style={{ width: width - 30 }}>Địa chỉ thực tế: {pvE.InfactAddress}</Text>
                                            </View>
                                        </View>
                                        <View
                                            style={{
                                                height: 1,
                                                backgroundColor: "#F0F0F4",
                                                marginVertical: 8,
                                            }}
                                        ></View>
                                        <View style={styles.Item}>
                                            <View style={{ flex: 2, flexDirection: 'row' }}>
                                                <Text >KC đi thẩm định(km) </Text>
                                                <Text style={{ color: 'red' }}>*</Text>
                                            </View>
                                            <View style={{ flex: 3 }}>
                                                <TextInput
                                                    keyboardType={"numeric"}
                                                    multiline={false}
                                                    style={[Theme.TextView]}
                                                    value={this.state.WorkfieldDistance}
                                                    onChangeText={(val) => {
                                                        this.setState({ WorkfieldDistance: val });
                                                    }}
                                                />
                                            </View>
                                        </View>
                                        <View
                                            style={{
                                                height: 1,
                                                backgroundColor: "#F0F0F4",
                                                marginVertical: 8,
                                            }}
                                        ></View>
                                        <View style={styles.Item}>
                                            <View style={{ flex: 2, marginBottom: 3, flexDirection: 'row' }}>
                                                <Text >Tên máy móc thiết bị </Text>
                                                <Text style={{ color: 'red' }}>*</Text>
                                            </View>
                                            <View style={{ flex: 3 }}>
                                                <TextInput
                                                    multiline={false}
                                                    style={[Theme.TextView]}
                                                    value={pvE.Type}
                                                    onChangeText={(val) => {
                                                        pvE.Type = val;
                                                        this.setState({ ProcessValuationEquipment: pvE });
                                                    }}
                                                />
                                            </View>
                                        </View>
                                        <View
                                            style={{
                                                height: 1,
                                                backgroundColor: "#F0F0F4",
                                                marginVertical: 8,
                                            }}
                                        ></View>

                                        <View style={styles.TextAndDrop}>
                                            <View style={{ flex: 2, marginBottom: 3, flexDirection: 'row' }}>
                                                <Text >Chi tiết mục đích, công năng sử dụng </Text>
                                                <Text style={{ color: 'red' }}>*</Text>
                                            </View>
                                            <View style={{ flex: 3 }}>
                                                <TextInput
                                                    numberOfLines={4}
                                                    multiline={true}
                                                    textAlignVertical='top'
                                                    style={[Theme.TextView, { height: 75 }]}
                                                    value={pvE.Specification}
                                                    onChangeText={(val) => {
                                                        pvE.Specification = val;
                                                        this.setState({ ProcessValuationEquipment: pvE });
                                                    }}
                                                />
                                            </View>
                                        </View>
                                        <View
                                            style={{
                                                height: 1,
                                                backgroundColor: "#F0F0F4",
                                                marginVertical: 8,
                                            }}
                                        ></View>
                                        <View style={styles.TextAndDrop}>
                                            <View style={{ flex: 2, marginBottom: 3, flexDirection: 'row' }}>
                                                <Text >Mô tả sơ bộ tài sản </Text>
                                                <Text style={{ color: 'red' }}>*</Text>
                                            </View>
                                            <View style={{ flex: 3 }}>
                                                <TextInput
                                                    numberOfLines={4}
                                                    multiline={true}
                                                    textAlignVertical='top'
                                                    style={[Theme.TextView, { height: 75 }]}
                                                    value={pvE.Description}
                                                    onChangeText={(val) => {
                                                        pvE.Description = val;
                                                        this.setState({ ProcessValuationEquipment: pvE });
                                                    }}
                                                />
                                            </View>
                                        </View>

                                    </View>
                                ) : undefined
                            }
                        </View>

                        <View style={{ marginVertical: 15, justifyContent: 'center', flexDirection: 'row' }}>
                            {
                                pvE.PVDStatus == Enums.ProcessValuationDocument.KiemTraHoSo ? (
                                    <TouchableOpacity
                                        style={{ marginLeft: 10, justifyContent: 'flex-end', alignItems: 'flex-end' }}
                                        onPress={() => {
                                            this.btn_CheckIn();
                                        }}
                                    >
                                        <LinearGradient
                                            colors={["#F07700", "#F07700"]}
                                            style={{
                                                width: width / 4 + 8,
                                                height: 40,
                                                backgroundColor: "#007AFF",
                                                borderRadius: 5,
                                                justifyContent: "center",
                                                alignItems: "center",
                                                flexDirection: 'row',

                                            }}
                                        >
                                            <FontAwesome5 name="check-circle" size={18} color="#FFFFFF" />
                                            <Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 8 }}>Check In</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                ) : undefined
                            }
                            <TouchableOpacity
                                style={{ marginLeft: 10, justifyContent: 'flex-end', alignItems: 'flex-end' }}
                                onPress={() => {
                                    this.btn_Save();
                                }}
                            >
                                <LinearGradient
                                    colors={["#F07700", "#F07700"]}
                                    style={{
                                        width: width / 4 - 20,
                                        height: 40,
                                        backgroundColor: "#007AFF",
                                        borderRadius: 5,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        flexDirection: 'row',

                                    }}
                                >
                                    <FontAwesome5 name="save" size={18} color="#FFFFFF" />
                                    <Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 8 }}>Lưu</Text>
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