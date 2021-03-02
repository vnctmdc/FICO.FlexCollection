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
import * as Enums from "../../constants/Enums";
import SMX from "../../constants/SMX";
import { inject, observer } from "mobx-react";
import GlobalStore from "../../Stores/GlobalStore";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import GlobalCache from "../../Caches/GlobalCache";
import QuickValuationDto from "../../DtoParams/QuickValuationDto";
import DropDownBox from "../../components/DropDownBox";
import SystemParameter from "../../Entities/SystemParameter";
import { TextInputMask } from "react-native-masked-text";
import { ClientMessage } from "../../SharedEntity/SMXException";
import { LinearGradient } from "expo-linear-gradient";
import QuickValuationVehicle from "../../Entities/QuickValuationVehicle";
import DateTimePicker from "../../components/DateTimePicker";
import ProcessValuationDto from "../../DtoParams/ProcessValuationDto";
import ProcessValuationDocument from "../../Entities/ProcessValuationDocument";
import ProcessValuation from "../../Entities/ProcessValuation";
import adm_Attachment from "../../Entities/adm_Attachment";
import Utility from "../../Utils/Utility";
import ProcessValuationDocumentContact from "../../Entities/ProcessValuationDocumentContact";

const { width, height } = Dimensions.get("window");

interface iProps {
    navigation: any;
    route: any;
    GlobalStore: GlobalStore;
}

interface iState {
    ProcessValuationDocumentID?: number;
    MACode1: string;
    showCustomerInfo: boolean;
    showDocList: boolean;
    showInfo: boolean;
    Remarks: string;
    VDDeadlineDTG?: Date;
    ProcessValuationDocument?: ProcessValuationDocument;
    ProcessValuation?: ProcessValuation;
    LstMortgageAssetLevel2?: SystemParameter[];
    SelectedMortgageAssetLevel2?: number;
    LstMortgageAssetCode2?: SystemParameter[];
    SelectedMortgageAssetCode2?: number;
    SelectedReason?: number;
    LstAttachment?: adm_Attachment[];
    LstPVDContact?: ProcessValuationDocumentContact[];
    SelectedResult?: number;
    Notes: string;
    WorkfieldPlanDTG?: Date;

}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class KhaoSatHienTrangScr extends Component<iProps, iState> {
    constructor(props: any) {
        super(props);
        this.state = {
            ProcessValuationDocument: new ProcessValuationDocument(),
            MACode1: this.props.route.params.MACode1,
            showCustomerInfo: true,
            showDocList: true,
            showInfo: true,
            Remarks: '',
            LstMortgageAssetLevel2: [],
            LstMortgageAssetCode2: [],
            LstAttachment: [],
            LstPVDContact: [],
            Notes: ''
        };
    }
    async componentDidMount() {
        await this.LoadData();
    }

    async LoadData() {

        this.props.GlobalStore.ShowLoading();
        var req = new ProcessValuationDto();
        req.ProcessValuationDocumentID = this.props.route.params.ProcessValuationDocumentID;
        let res = await HttpUtils.post<ProcessValuationDto>(
            ApiUrl.ProcessValuation_Execute,
            SMX.ApiActionCode.LoadData,
            JSON.stringify(req)
        );

        console.log(1234, res!.ListAttachmentMortgageAsset!);


        if (res) {
            this.setState({
                ProcessValuationDocument: res!.ProcessValuationDocument!,
                ProcessValuation: res!.ProcessValuation!,
                LstMortgageAssetLevel2: res!.ListMortgageAssetLevel2!,
                SelectedMortgageAssetLevel2: res!.ProcessValuation!.MortgageAssetLevel2,
                LstMortgageAssetCode2: res!.ListMortgageAssetCode2!,
                SelectedMortgageAssetCode2: res!.ProcessValuationDocument!.MortgageAssetCode2,
                LstAttachment: res!.ListAttachmentMortgageAsset!,
                LstPVDContact: res!.ListProcessValuationDocumentContact!,
            });
        }

        this.props.GlobalStore.HideLoading();
    }

    async btn_KhaoSatTaiSan() {
        try {
            this.props.GlobalStore.ShowLoading();
            let res = await HttpUtils.post<QuickValuationDto>(
                ApiUrl.QuickValuation_Execute,
                SMX.ApiActionCode.SetupViewVehicleForm,
                JSON.stringify(new QuickValuationDto())
            );

            if (res) {
                this.setState({
                });
            }
            this.props.GlobalStore.HideLoading();
        } catch (ex) {
            this.props.GlobalStore.HideLoading();
            this.props.GlobalStore.Exception = ex;
        }
    }

    async btn_DocumentRequest() {
        try {
            this.props.GlobalStore.ShowLoading();
            let res = await HttpUtils.post<QuickValuationDto>(
                ApiUrl.QuickValuation_Execute,
                SMX.ApiActionCode.SetupViewVehicleForm,
                JSON.stringify(new QuickValuationDto())
            );

            if (res) {
                this.setState({
                });
            }
            this.props.GlobalStore.HideLoading();

        } catch (ex) {
            this.props.GlobalStore.HideLoading();
            this.props.GlobalStore.Exception = ex;
        }
    }

    async btn_Save() {
        try {
            this.props.GlobalStore.ShowLoading();

            this.props.GlobalStore.HideLoading();

        } catch (ex) {
            this.props.GlobalStore.Exception = ex;
            this.props.GlobalStore.HideLoading();
        }
    }

    onDeleteVDDeadlineDate = () => {
        this.setState({ VDDeadlineDTG: undefined });
    };

    render() {
        let pvd = this.state.ProcessValuationDocument;
        return (
            <View style={{ height: height, backgroundColor: "#FFF" }}>
                <Toolbar Title="Khảo sát hiện trạng - Tài sản" navigation={this.props.navigation} />
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
                                    <Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 8 }}>Khảo sát TS</Text>
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
                                                <Text >Loại tài sản cấp 2 </Text>
                                            </View>
                                        </View>
                                        <View style={{ flex: 3 }}>
                                            <DropDownBox
                                                TextField="Name"
                                                ValueField="SystemParameterID"
                                                DataSource={this.state.LstMortgageAssetLevel2}
                                                SelectedValue={this.state.SelectedMortgageAssetLevel2}
                                                OnSelectedItemChanged={(item) => {
                                                    this.setState({ SelectedMortgageAssetLevel2: item.SystemParameterID });
                                                }}
                                            ></DropDownBox>
                                        </View>
                                        <View style={styles.TextAndDrop}>
                                            <View style={{ flex: 2, marginBottom: 3 }}>
                                                <Text >Mẫu báo cáo </Text>
                                            </View>
                                            <View style={{ flex: 3 }}>
                                                <DropDownBox
                                                    TextField="Name"
                                                    ValueField="SystemParameterID"
                                                    DataSource={this.state.LstMortgageAssetCode2}
                                                    SelectedValue={this.state.SelectedMortgageAssetCode2}
                                                    OnSelectedItemChanged={(item) => {
                                                        this.setState({ SelectedMortgageAssetCode2: item.SystemParameterID });
                                                    }}
                                                ></DropDownBox>
                                            </View>
                                        </View>
                                    </View>
                                ) : undefined
                            }
                        </View>

                        <View style={{ backgroundColor: '#eaf2f6', borderColor: '#7ba6c2', borderWidth: 1, marginTop: 15, paddingHorizontal: 8, paddingVertical: 12 }}>
                            <View style={{ marginBottom: 3, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <FontAwesome5 name="file-alt" size={17} color="#000000" />
                                    <Text style={{ marginLeft: 5, fontSize: 15 }}>
                                        Danh sách tài liệu
                                    </Text>
                                </View>
                                {
                                    this.state.showDocList ? (
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({ showDocList: false })
                                            }}
                                        >
                                            < FontAwesome5 name="minus-circle" size={25} color="#000" />
                                        </TouchableOpacity>
                                    ) : (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.setState({ showDocList: true })
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
                                this.state.showDocList ? (
                                    <View style={{ marginTop: 8, marginBottom: 10 }}>
                                        {
                                            this.state.LstAttachment.map((data) => {
                                                return (
                                                    <TouchableOpacity
                                                        style={{
                                                            width: "100%",
                                                            marginTop: 0,
                                                            borderBottomWidth: 1,
                                                            borderColor: "gainsboro",
                                                            paddingBottom: 0,
                                                            backgroundColor: '#FFF'
                                                        }}
                                                    >
                                                        <View style={{ width: width - 95, padding: 10 }}>
                                                            <View style={{ flexDirection: "row", marginBottom: 2 }}>
                                                                <Text style={{ fontWeight: "600" }}>Loại tài liệu: </Text>
                                                                <Text style={{ fontWeight: "600", color: '#005599' }}>
                                                                    {/* {data.RefCode == SMX.DocumentCode.TaiLieuKhac ? (!data.Description  ? data.DocumentName : data.Description ) : data.DocumentName} */}
                                                                    {data.DocumentTypeName}
                                                                </Text>
                                                            </View>
                                                            <View style={{ flexDirection: "row", marginBottom: 2 }}>
                                                                <Text style={{ fontWeight: "600" }}>Mức độ yêu cầu: </Text>
                                                                <Text style={{}}>{Utility.GetDictionaryValue(SMX.MapDocumentRequireStatus.dtcMapDocumentTypeStatus, data.RequireLevel)}</Text>
                                                            </View>
                                                            <View style={{ flexDirection: "row", marginBottom: 2 }}>
                                                                <Text style={{ fontWeight: "600" }}>Ngày đưa lên: </Text>
                                                                <Text style={{}}>{Utility.GetDateMinuteString(data.CreatedDTG)}</Text>
                                                            </View>
                                                            <View style={{ flexDirection: "row", }}>
                                                                <Text style={{ fontWeight: "600" }}>Người đưa lên: </Text>
                                                                <Text style={{ width: width - 100 }}>{data.FullNameCreateBy}</Text>
                                                            </View>
                                                        </View>

                                                    </TouchableOpacity>
                                                )
                                            })
                                        }
                                        <View style={styles.Item}>
                                            <View style={{ flex: 2, flexDirection: 'row' }}>
                                                <Text >Phân loại lý do </Text>
                                                <Text style={{ color: 'red' }}>*</Text>
                                            </View>
                                        </View>
                                        <View style={{ flex: 3 }}>
                                            <DropDownBox
                                                TextField="Value"
                                                ValueField="Key"
                                                DataSource={SMX.ValidateDocumentReason.dicValidateDocumentReason}
                                                SelectedValue={this.state.SelectedReason}
                                                OnSelectedItemChanged={(item) => {
                                                    this.setState({ SelectedReason: item.SystemParameterID });
                                                }}
                                            ></DropDownBox>
                                        </View>
                                        <View style={styles.Item}>
                                            <View style={{ flex: 2, flexDirection: 'row' }}>
                                                <Text >Ghi chú/Lý do không đầy đủ </Text>
                                            </View>
                                        </View>
                                        <View style={{ flex: 3 }}>
                                            <TextInput
                                                multiline={true}
                                                numberOfLines={4}
                                                style={[Theme.TextInput, { height: 100 }]}
                                                value={this.state.Remarks}
                                                onChangeText={(val) => {
                                                    this.setState({ Remarks: val });
                                                }}
                                            />
                                        </View>
                                        <View style={styles.Item}>
                                            <View style={{ flex: 2, flexDirection: 'row' }}>
                                                <Text >Thời hạn bổ xung </Text>
                                            </View>
                                        </View>
                                        <View style={{ flex: 3 }}>
                                            <DateTimePicker
                                                onRemove={this.onDeleteVDDeadlineDate}
                                                SelectedDate={this.state.VDDeadlineDTG}
                                                OnselectedDateChanged={(val) => {
                                                    this.setState({ VDDeadlineDTG: val });
                                                }}
                                            />
                                        </View>
                                    </View>
                                ) : undefined
                            }
                        </View>

                        <View style={{ backgroundColor: '#eaf2f6', borderColor: '#7ba6c2', borderWidth: 1, marginTop: 15, paddingHorizontal: 8, paddingVertical: 12 }}>
                            <View style={{ marginBottom: 3, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <FontAwesome name="calendar" size={15} color="#000" />
                                    <Text style={{ marginLeft: 5, fontSize: 15 }}>
                                        Thông tin khảo sát
                                    </Text>
                                </View>
                                {
                                    this.state.showInfo ? (
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({ showInfo: false })
                                            }}
                                        >
                                            < FontAwesome5 name="minus-circle" size={25} color="#000" />
                                        </TouchableOpacity>
                                    ) : (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.setState({ showInfo: true })
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
                                this.state.showInfo ? (
                                    <View style={{ marginTop: 8, marginBottom: 10 }}>
                                        {
                                            this.state.LstPVDContact.map((data, index) => {
                                                return (
                                                    <TouchableOpacity
                                                        style={{
                                                            width: "100%",
                                                            marginTop: 0,
                                                            borderBottomWidth: 1,
                                                            borderColor: "gainsboro",
                                                            paddingBottom: 0,
                                                            backgroundColor: '#FFF'
                                                        }}
                                                    >
                                                        <View style={{ width: width - 95, padding: 10 }}>
                                                            <View style={{ flexDirection: "row", marginBottom: 2 }}>
                                                                <Text style={{ fontWeight: "600" }}>Lần liên hệ: </Text>
                                                                <Text style={{ fontWeight: "600", color: '#005599' }}>Lần liên hệ thứ {index + 1}</Text>
                                                            </View>
                                                            <View style={{ flexDirection: "row", marginBottom: 2 }}>
                                                                <Text style={{ fontWeight: "600" }}>Thời gian liên hệ: </Text>
                                                                <Text style={{}}>{Utility.GetDateMinuteString(data.ContactDTG)}</Text>
                                                            </View>
                                                            <View style={{ flexDirection: "row", marginBottom: 2 }}>
                                                                <Text style={{ fontWeight: "600" }}>Kết quả: </Text>
                                                                <Text style={{}}>{Utility.GetDictionaryValue(SMX.ProcessValuationDocumentContactType.dicName, data.ContactResult)}</Text>
                                                            </View>

                                                            <View style={{ flexDirection: "row", marginBottom: 2 }}>
                                                                <Text style={{ fontWeight: "600" }}>Ghi chú: </Text>
                                                                <Text style={{ width: width - 100 }}>{data.Notes}</Text>
                                                            </View>
                                                        </View>

                                                    </TouchableOpacity>
                                                )
                                            })
                                        }
                                        <View style={[styles.Item, { marginTop: 5 }]}>
                                            <View style={{ flex: 2, flexDirection: 'row' }}>
                                                <Text style={{ fontWeight: "600" }}>Lần liên hệ </Text>
                                            </View>
                                        </View>
                                        <View style={styles.Item}>
                                            <View style={{ flex: 2, flexDirection: 'row' }}>
                                                <Text style={{ fontWeight: "600" }}>Thời gian liên hệ </Text>
                                            </View>
                                        </View>
                                        <View style={{ flex: 3 }}>
                                            <DateTimePicker
                                                HasTime={true}
                                                onRemove={this.onDeleteVDDeadlineDate}
                                                SelectedDate={this.state.VDDeadlineDTG}
                                                OnselectedDateChanged={(val) => {
                                                    this.setState({ VDDeadlineDTG: val });
                                                }}
                                            />
                                        </View>
                                        <View style={styles.Item}>
                                            <View style={{ flex: 2, flexDirection: 'row' }}>
                                                <Text style={{ fontWeight: "600" }}>Kết quả </Text>
                                            </View>
                                        </View>
                                        <View style={{ flex: 3 }}>
                                            <DropDownBox
                                                TextField="Value"
                                                ValueField="Key"
                                                DataSource={SMX.ProcessValuationDocumentContactType.dicName}
                                                SelectedValue={this.state.SelectedResult}
                                                OnSelectedItemChanged={(item) => {
                                                    this.setState({ SelectedResult: item.SystemParameterID });
                                                }}
                                            ></DropDownBox>
                                        </View>
                                        <View style={styles.Item}>
                                            <View style={{ flex: 2, flexDirection: 'row' }}>
                                                <Text style={{ fontWeight: "600" }}>Lịch khảo sát </Text>
                                            </View>
                                        </View>
                                        <View style={{ flex: 3 }}>
                                            <DateTimePicker
                                                HasTime={true}
                                                onRemove={this.onDeleteVDDeadlineDate}
                                                SelectedDate={this.state.WorkfieldPlanDTG}
                                                OnselectedDateChanged={(val) => {
                                                    this.setState({ WorkfieldPlanDTG: val });
                                                }}
                                            />
                                        </View>
                                        <View style={styles.Item}>
                                            <View style={{ flex: 2, flexDirection: 'row' }}>
                                                <Text style={{ fontWeight: "600" }}>Ghi chú </Text>
                                            </View>
                                        </View>
                                        <View style={{ flex: 3 }}>
                                            <TextInput
                                                multiline={true}
                                                numberOfLines={4}
                                                style={[Theme.TextInput, { height: 100 }]}
                                                value={this.state.Notes}
                                                onChangeText={(val) => {
                                                    this.setState({ Notes: val });
                                                }}
                                            />
                                        </View>
                                    </View>
                                ) : undefined
                            }
                        </View>

                        <View style={{ marginVertical: 15, justifyContent: 'center', flexDirection: 'row' }}>
                            {
                                (pvd.Status == Enums.ProcessValuationDocument.KiemTraHoSo && pvd.ValidateDocumentStatus != Enums.ValidateDocumentStatus.YeuCauBoSungHoSo) ? (
                                    <TouchableOpacity
                                        style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}
                                        onPress={() => {
                                            this.btn_DocumentRequest();
                                        }}
                                    >
                                        <LinearGradient
                                            colors={["#F07700", "#F07700"]}
                                            style={{
                                                width: width / 2 + 25,
                                                height: 40,
                                                backgroundColor: "#007AFF",
                                                borderRadius: 5,
                                                justifyContent: "center",
                                                alignItems: "center",
                                                flexDirection: 'row',

                                            }}
                                        >
                                            <MaterialCommunityIcons name="check-circle" size={20} color="#FFFFFF" />
                                            <Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 8 }}>Yêu cầu bổ sung & trả HS</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                ) : undefined
                            }

                            {
                                (pvd.Status == Enums.ProcessValuationDocument.KiemTraHoSo) ? (
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