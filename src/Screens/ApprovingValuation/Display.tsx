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
    Modal,
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
import ProcessValuationDocument from "../../Entities/ProcessValuationDocument";
import ProcessValuationDocumentDto from "../../DtoParams/ProcessValuationDocumentDto";
import PopupModalUpdateNote from "../../components/PopupModalUpdateNote";
import adm_Attachment from "../../Entities/adm_Attachment";
import AttachmentDto from "../../DtoParams/AttachmentDto";
import ImageViewer from "react-native-image-zoom-viewer";
import ReportGeneratorCommand from "../../Entities/ReportGeneratorCommand";
import Employee from "../../Entities/Employee";

const { width, height } = Dimensions.get("window");

interface iProps {
    navigation: any;
    GlobalStore: GlobalStore;
    route: any;
}

interface iState {
    ProcessValuationDocumentID?: number;
    ProcessValuationDocument?: ProcessValuationDocument;
    showConfirmApprove: boolean;
    showConfirmReject: boolean;
    CommentApprove: string;
    CommentReject: string;
    LstAttachment?: adm_Attachment[];
    SelectedFullScreen: adm_Attachment;
    ReportGeneratorCommand?: ReportGeneratorCommand;
    Attachment?: adm_Attachment;
    showApprovalAuthority: boolean;
    LstEmployee?: Employee[];
    EmployeeID?: number;
}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class BCDGChoDuyetSrc extends Component<iProps, iState> {
    constructor(props: any) {
        super(props);
        this.state = {
            ProcessValuationDocument: new ProcessValuationDocument(),
            showConfirmApprove: false,
            showConfirmReject: false,
            CommentApprove: '',
            CommentReject: '',
            LstAttachment: [],
            SelectedFullScreen: null,
            showApprovalAuthority: false,
            LstEmployee: []
        };
    }
    async componentDidMount() {
        await this.LoadData();
    }

    async LoadData() {
        try {
            this.props.GlobalStore.ShowLoading();
            var req = new ProcessValuationDocumentDto();
            var item = new ReportGeneratorCommand();
            item.RefID = this.props.route.params.ProcessValuationDocumentID;
            item.RefType = 2;
            item.DocumentCode = 'BCDG';

            req.PVDID = this.props.route.params.ProcessValuationDocumentID;
            req.ReportGeneratorCommand = item;

            let res = await HttpUtils.post<ProcessValuationDocumentDto>(
                ApiUrl.ProcessValuationDocument_Execute,
                SMX.ApiActionCode.GetPVDApproving,
                JSON.stringify(req)
            );

            if (res) {
                this.setState({
                    ProcessValuationDocument: res!.ProcessValuationDocument!,
                    LstAttachment: res!.LstAttachment!,
                    Attachment: res!.Attachment!

                });
            }

            this.props.GlobalStore.HideLoading();
        } catch (ex) {
            this.props.GlobalStore.Exception = ex;
            this.props.GlobalStore.HideLoading();
        }

    }

    async onApproval() {
        try {
            this.props.GlobalStore.ShowLoading();
            var req = new ProcessValuationDocumentDto();

            if (!this.state.CommentApprove || this.state.CommentApprove == '') {
                this.props.GlobalStore.HideLoading();
                let message = "[Nội dung] Không được để trống";
                this.props.GlobalStore.Exception = ClientMessage(message);
                return;
            }
            req.CommentApprove = this.state.CommentApprove;
            req.PVDID = this.props.route.params.ProcessValuationDocumentID;

            await HttpUtils.post<ProcessValuationDocumentDto>(
                ApiUrl.ProcessValuationDocument_Execute,
                SMX.ApiActionCode.Approve,
                JSON.stringify(req)
            );

            this.props.GlobalStore.HideLoading();

            let mess = "Phê duyệt thành công!";
            this.props.GlobalStore.Exception = ClientMessage(mess);
            this.props.GlobalStore.ApprovingValuationFilterTrigger();

            this.props.navigation.goBack();
        } catch (ex) {
            this.props.GlobalStore.HideLoading();
            this.props.GlobalStore.Exception = ex;

        }
    }

    async onReject() {
        try {
            this.props.GlobalStore.ShowLoading();
            var req = new ProcessValuationDocumentDto();

            if (!this.state.CommentReject || this.state.CommentReject == '') {
                this.props.GlobalStore.HideLoading();
                let message = "[Nội dung] Không được để trống";
                this.props.GlobalStore.Exception = ClientMessage(message);
                return;
            }
            req.CommentApprove = this.state.CommentReject;
            req.PVDID = this.props.route.params.ProcessValuationDocumentID;

            await HttpUtils.post<ProcessValuationDocumentDto>(
                ApiUrl.ProcessValuationDocument_Execute,
                SMX.ApiActionCode.Reject,
                JSON.stringify(req)
            );

            this.props.GlobalStore.HideLoading();

            let mess = "Từ chối thành công!";
            this.props.GlobalStore.Exception = ClientMessage(mess);
            this.props.GlobalStore.ApprovingValuationFilterTrigger();

            this.props.navigation.goBack();
        } catch (ex) {
            this.props.GlobalStore.HideLoading();
            this.props.GlobalStore.Exception = ex;

        }
    }

    async onGetListEmployee() {
        try {
            this.props.GlobalStore.ShowLoading();
            var req = new ProcessValuationDocumentDto();
            req.PVDID = this.props.route.params.ProcessValuationDocumentID;

            var res = await HttpUtils.post<ProcessValuationDocumentDto>(
                ApiUrl.ProcessValuationDocument_Execute,
                SMX.ApiActionCode.GetListEmployee,
                JSON.stringify(req)
            );

            this.setState({
                LstEmployee: res!.LstEmployee!,
                showApprovalAuthority: res!.showApprovalAuthority
            });

            this.props.GlobalStore.HideLoading();
        } catch (ex) {
            this.props.GlobalStore.HideLoading();
            this.props.GlobalStore.Exception = ex;
        }
    }

    async onApprovalManuallyPVDOK() {
        try {
            this.props.GlobalStore.ShowLoading();
            var req = new ProcessValuationDocumentDto();

            if (!this.state.EmployeeID == undefined || this.state.EmployeeID == null) {
                this.props.GlobalStore.HideLoading();
                let message = "Bạn chưa chọn cán bộ ủy quyền";
                this.props.GlobalStore.Exception = ClientMessage(message);
                return;
            }
            req.EmployeeID = this.state.EmployeeID;
            req.PVDID = this.props.route.params.ProcessValuationDocumentID;

            await HttpUtils.post<ProcessValuationDocumentDto>(
                ApiUrl.ProcessValuationDocument_Execute,
                SMX.ApiActionCode.ApprovalManuallyPVD,
                JSON.stringify(req)
            );

            this.props.GlobalStore.HideLoading();

            let mess = "Thực hiện thành công!";
            this.props.GlobalStore.Exception = ClientMessage(mess);
            this.props.GlobalStore.ApprovingValuationFilterTrigger();

            this.props.navigation.goBack();
        } catch (ex) {
            this.props.GlobalStore.HideLoading();
            this.props.GlobalStore.Exception = ex;

        }
    }

    async btn_GetImageByECMID(image: adm_Attachment) {
        try {
            this.props.GlobalStore.ShowLoading();
            var req = new AttachmentDto();
            req.Attachment = image;
            let res = await HttpUtils.post<AttachmentDto>(
                ApiUrl.Attachment_Execute,
                SMX.ApiActionCode.GetAttachmentByECMID,
                JSON.stringify(req)
            );
            if (res) {
                this.setState({ SelectedFullScreen: res!.Attachment! });
            }

            this.props.GlobalStore.HideLoading();

        } catch (ex) {
            this.props.GlobalStore.Exception = ex;
            this.props.GlobalStore.HideLoading();
        }
    }

    showConfirmApprove = () => {
        this.setState({ showConfirmApprove: !this.state.showConfirmApprove });
    };

    showConfirmReject = () => {
        this.setState({ showConfirmReject: !this.state.showConfirmReject });
    };

    showApprovalAuthority = () => {
        this.setState({ showApprovalAuthority: !this.state.showApprovalAuthority });
    }

    checkIsNotImage(img: adm_Attachment) {
        let result = false;
        if (img.FileName && img.FileName !== null && img.FileName !== "") {
            let ext = img.FileName.split(".");
            if (ext && ext.length > 0 && (ext[1] === "pdf" || ext[1] === "xlsx" || ext[1] === "docx")) {
                result = true;
                return result;
            }
        }

        return false;
    }

    render() {
        let pvd = this.state.ProcessValuationDocument;
        let att = this.state.Attachment;
        return (
            <View style={{ flex: 1, height: height, backgroundColor: "#F6F6FE" }}>
                <Toolbar Title="Phê duyệt BCĐG" navigation={this.props.navigation} />
                <KeyboardAvoidingView behavior="height" style={{ flex: 1, paddingHorizontal: 8 }}>
                    <ScrollView showsVerticalScrollIndicator={false}>

                        <View style={Theme.ViewGeneral}>
                            <View style={Theme.ViewTitle}>
                                <Text style={{ fontSize: 15, fontWeight: "600", color: '#FFFFFF' }}>
                                    I. THÔNG TIN CHUNG
                                </Text>
                            </View>
                            <View style={Theme.ViewContent}>
                                <View style={styles.Item}>
                                    <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text >Tên KH: </Text>
                                        <Text style={{ fontWeight: '600' }}>{pvd.CustomerName}</Text>
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
                                    <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text >Số BCĐG: </Text>
                                        <Text style={{ fontWeight: '600' }}>{pvd.Code}</Text>
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
                                    <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text >Loại TS cấp 1: </Text>
                                        <Text style={{ fontWeight: '600' }}>{pvd.MortgageAssetCode1Name}</Text>
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
                                    <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text >Cán bộ định giá: </Text>
                                        <Text style={{ fontWeight: '600' }}>{pvd.ValuationEmployeeName}</Text>
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
                                    <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text >Chi nhánh: </Text>
                                        <Text style={{ fontWeight: '600' }}>{pvd.ValuationOrganizationName}</Text>
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
                                    <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text >Giá trị định giá: </Text>
                                        <Text>{Utility.GetDecimalString(pvd.TotalValuationAmount)}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={Theme.ViewGeneral}>
                            <View style={Theme.ViewTitle}>
                                <Text style={{ fontSize: 15, fontWeight: "600", color: '#FFFFFF' }}>
                                    II. BÁO CÁO ĐỊNH GIÁ
                                </Text>
                            </View>
                            <View style={Theme.ViewContent}>
                                <View style={styles.Item}>
                                    <View style={{ flex: 3, flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text >Bản PDF BCĐG </Text>
                                    </View>
                                    <TouchableOpacity
                                        style={{ flex: 2, flexDirection: 'row', justifyContent: 'center' }}
                                        activeOpacity={.3}
                                        onPress={() => {
                                            if (att == undefined) {
                                                this.props.GlobalStore.Exception = ClientMessage("Tải file lỗi. Liên hệ với admin để được hỗ trợ");
                                                return;
                                            }
                                            if (att.AttachmentID != undefined || att.AttachmentID != null) {
                                                this.props.navigation.navigate("PDFView", {
                                                    AttachmentID: att.AttachmentID,
                                                    ECMItemID: att.ECMItemID,
                                                    FileName: att.FileName,
                                                });
                                            } else {
                                                this.props.GlobalStore.Exception = ClientMessage("Tải file lỗi. Liên hệ với admin để được hỗ trợ");
                                                return;
                                            }
                                        }}
                                    >
                                        <Text style={{ fontWeight: '400', color: '#3388cc', fontSize: 17 }}>Xem </Text>
                                    </TouchableOpacity>
                                </View>
                                <View
                                    style={{
                                        height: 1,
                                        backgroundColor: "#F0F0F4",
                                        marginVertical: 8,
                                    }}
                                />
                                <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
                                    <TouchableOpacity
                                        style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}
                                        onPress={() => {
                                            this.props.navigation.navigate("PreLiminareQuote", {
                                                ProcessValuationDocumentID: this.props.route.params.ProcessValuationDocumentID,
                                            });
                                        }}
                                    >
                                        <LinearGradient
                                            colors={SMX.BtnColor}
                                            style={{
                                                width: width / 4 - 25,
                                                height: 35,
                                                backgroundColor: "#007AFF",
                                                borderRadius: 5,
                                                justifyContent: "center",
                                                alignItems: "center",
                                                flexDirection: 'row',

                                            }}
                                        >
                                            {/* <FontAwesome5 name="check-circle" size={18} color={"#FFFFFF"} /> */}
                                            <Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 8 }}>Báo giá</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ marginLeft: 10, justifyContent: 'flex-end', alignItems: 'flex-end' }}
                                        onPress={() => {
                                            this.setState({ showConfirmApprove: true });
                                        }}
                                    >
                                        <LinearGradient
                                            colors={SMX.BtnColor}
                                            style={{
                                                width: width / 4 - 10,
                                                height: 35,
                                                backgroundColor: "#007AFF",
                                                borderRadius: 5,
                                                justifyContent: "center",
                                                alignItems: "center",
                                                flexDirection: 'row',

                                            }}
                                        >
                                            {/* <FontAwesome5 name="check-circle" size={18} color={"#FFFFFF"} /> */}
                                            <Text style={{ color: '#FFFFFF', fontSize: 15 }}>Phê duyệt</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ marginLeft: 10, justifyContent: 'flex-end', alignItems: 'flex-end' }}
                                        onPress={() => {
                                            this.setState({ showConfirmReject: true });
                                        }}
                                    >
                                        <LinearGradient
                                            colors={SMX.BtnColor}
                                            style={{
                                                width: width / 4 - 25,
                                                height: 35,
                                                backgroundColor: "#007AFF",
                                                borderRadius: 5,
                                                justifyContent: "center",
                                                alignItems: "center",
                                                flexDirection: 'row',

                                            }}
                                        >
                                            {/* <FontAwesome5 name="times-circle" size={18} color={"#FFFFFF"} /> */}
                                            <Text style={{ color: '#FFFFFF', fontSize: 15 }}>Từ chối</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ marginLeft: 10, justifyContent: 'flex-end', alignItems: 'flex-end' }}
                                        onPress={() => { this.onGetListEmployee(); }}
                                    >
                                        <LinearGradient
                                            colors={SMX.BtnColor}
                                            style={{
                                                width: width / 4 - 20,
                                                height: 35,
                                                backgroundColor: "#007AFF",
                                                borderRadius: 5,
                                                justifyContent: "center",
                                                alignItems: "center",
                                                flexDirection: 'row',

                                            }}
                                        >
                                            {/* <FontAwesome5 name="times-circle" size={18} color={"#FFFFFF"} /> */}
                                            <Text style={{ color: '#FFFFFF', fontSize: 15 }}>Ủy quyền</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <View style={[Theme.ViewGeneral, { marginBottom: 8 }]}>
                            <View style={Theme.ViewTitle}>
                                <Text style={{ fontSize: 15, fontWeight: "600", color: '#FFFFFF' }}>
                                    III. DANH SÁCH TÀI LIỆU
                                </Text>
                            </View>
                            <View style={Theme.ViewContent}>
                                <>
                                    <ScrollView style={{ height: this.state.LstAttachment.length > 0 ? (this.state.LstAttachment.length > 1 ? 200 : 100) : undefined }}>
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
                                                        onPress={() => {
                                                            if (!this.checkIsNotImage(data)) {
                                                                this.btn_GetImageByECMID(data);

                                                                //this.setState({ SelectedFullScreen: data });
                                                            } else {
                                                                this.props.navigation.navigate("PDFView", {
                                                                    AttachmentID: data.AttachmentID,
                                                                    ECMItemID: data.ECMItemID,
                                                                    FileName: data.FileName,
                                                                });
                                                            }
                                                        }}
                                                    >
                                                        <View style={{ width: width - 95, padding: 10 }}>
                                                            <View style={{ flexDirection: "row", marginBottom: 2 }}>
                                                                <Text style={{ fontWeight: "600" }}>Loại tài liệu: </Text>
                                                                <Text style={{ fontWeight: "600", color: '#005599' }}>
                                                                    {data.DocumentTypeName}
                                                                </Text>
                                                            </View>
                                                            <View style={{ flexDirection: "row", marginBottom: 2 }}>
                                                                <Text style={{ fontWeight: "600" }}>Mức độ yêu cầu: </Text>
                                                                <Text style={{}}>{Utility.GetDictionaryValue(SMX.MapDocumentRequireStatus.dtcMapDocumentTypeStatus, data.RequireLevel)}</Text>
                                                            </View>
                                                            <View style={{ flexDirection: "row", marginBottom: 2 }}>
                                                                <Text style={{ fontWeight: "600" }}>Ngày đưa lên: </Text>
                                                                <Text style={{}}>{data.CreatedDTGText}</Text>
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
                                    </ScrollView>
                                </>
                            </View>
                        </View>

                    </ScrollView>
                </KeyboardAvoidingView>

                {
                    this.state.SelectedFullScreen != null ? (
                        <Modal visible={true}>
                            {/* <Image
                            source={{
                                uri: 'data:image/png;base64,' + this.state.SelectedFullScreen.FileContent
                                //uri:                                    
                                //    ApiUrl.Attachment_ImagePreview +
                                //    `?id=${this.state.SelectedFullScreen.AttachmentID}&name=${this.state.SelectedFullScreen.FileName}&ecm=${this.state.SelectedFullScreen.ECMItemID}&size=3`
                            }}
                            style={{ width: width, height: height, resizeMode: "contain" }}
                        /> */}
                            <ImageViewer
                                imageUrls={[
                                    {
                                        url: 'data:image/png;base64,' + this.state.SelectedFullScreen.FileContent
                                    },
                                ]}
                                backgroundColor={"white"}
                                renderIndicator={() => null}
                            />
                            {/* <ImageViewer
                            imageUrls={[
                                {
                                    url: `${ApiUrl.Attachment_ImagePreview}?id=${this.state.SelectedFullScreen.AttachmentID}&ecm=${this.state.SelectedFullScreen.ECMItemID}&name=${this.state.SelectedFullScreen.FileName}&size=0&token=${GlobalCache.UserToken}`,
                                },
                            ]}
                            backgroundColor={"white"}
                            renderIndicator={() => null}
                        /> */}
                            <View
                                style={{
                                    position: "absolute",
                                    zIndex: 999999999,
                                    justifyContent: "space-around",
                                    alignItems: "center",
                                    flexDirection: "row",
                                    marginTop: 30,
                                }}
                            >
                                <TouchableOpacity
                                    //@ts-ignore
                                    style={{
                                        justifyContent: "space-around",
                                        alignItems: "center",
                                        backgroundColor: "#7B35BB",
                                        //backgroundColor: "rgba(0, 0, 0, 0.5)",
                                        height: 40,
                                        marginLeft: 15,
                                        padding: 10,
                                        borderRadius: 50,
                                    }}
                                    onPress={() => this.setState({ SelectedFullScreen: null })}
                                >
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <FontAwesome5 name="arrow-left" size={20} color={"white"} />
                                        <Text style={{ fontWeight: "bold", fontSize: 15, marginLeft: 15, color: "white" }}>
                                            Back
                                    </Text>
                                    </View>
                                </TouchableOpacity>
                                {/* {this.props.allowEdit != null && this.props.allowEdit ? (
                                <TouchableOpacity
                                    //@ts-ignore
                                    style={{
                                        backgroundColor: "#7B35BB",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        height: 40,
                                        marginLeft: 15,
                                        padding: 10,
                                        borderRadius: 50,
                                    }}
                                    onPress={() => this.handleEdit(this.state.SelectedFullScreen)}
                                >
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <FontAwesome5 name="edit" size={20} color={"white"} />
                                        <Text
                                            style={{ fontWeight: "bold", fontSize: 15, marginLeft: 15, color: "white" }}
                                        >
                                            Sửa
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ) : undefined}
                            {this.props.allowRemove != null && this.props.allowRemove ? (
                                <TouchableOpacity
                                    //@ts-ignore
                                    style={{
                                        backgroundColor: "#7B35BB",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        height: 40,
                                        marginLeft: 15,
                                        padding: 10,
                                        borderRadius: 50,
                                    }}
                                    onPress={() => {
                                        this.handleRemove(this.state.SelectedFullScreen);
                                        this.setState({ SelectedFullScreen: null });
                                    }}
                                >
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <FontAwesome5 name="trash" size={20} color={"white"} />
                                        <Text
                                            style={{ fontWeight: "bold", fontSize: 15, marginLeft: 15, color: "white" }}
                                        >
                                            Xóa
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ) : undefined} */}
                            </View>
                        </Modal>
                    ) : undefined
                }

                <PopupModalUpdateNote
                    resetState={this.showConfirmApprove}
                    modalVisible={this.state.showConfirmApprove}
                    title="Phê duyệt"
                >
                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                        <Text >Nội dung </Text>
                        <Text style={{ color: 'red' }}>*</Text>
                    </View>
                    <View style={{}}>
                        <TextInput
                            multiline={true}
                            numberOfLines={4}
                            style={[Theme.TextInput, { height: 100 }]}
                            value={this.state.CommentApprove}
                            onChangeText={(val) => {
                                this.setState({ CommentApprove: val });
                            }}
                        />
                    </View>
                    <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "flex-end" }}>
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({ showConfirmApprove: false }, async () => {
                                    await this.onApproval();
                                });
                            }}
                        >
                            <LinearGradient
                                colors={["#7B35BB", "#5D2E86"]}
                                style={{
                                    width: width / 4,
                                    backgroundColor: "#722ED1",
                                    padding: 10,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: 5,
                                    alignSelf: "center",
                                    marginRight: 5,
                                }}
                            >
                                <Text style={Theme.BtnTextGradient}>
                                    Phê duyệt
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                //width: 80,
                                backgroundColor: "#E6E9EE",
                                padding: 10,
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 5,
                                alignSelf: "center",
                                marginLeft: 5,
                            }}
                            onPress={() => {
                                this.setState({ showConfirmApprove: false });
                            }}
                        >
                            <Text style={{ color: "#1B2031", fontSize: 15 }}>
                                Bỏ qua
                            </Text>
                        </TouchableOpacity>
                    </View>
                </PopupModalUpdateNote>

                <PopupModalUpdateNote
                    resetState={this.showConfirmReject}
                    modalVisible={this.state.showConfirmReject}
                    title="Từ chối phê duyệt"
                >
                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                        <Text >Nội dung </Text>
                        <Text style={{ color: 'red' }}>*</Text>
                    </View>
                    <View style={{}}>
                        <TextInput
                            multiline={true}
                            numberOfLines={4}
                            style={[Theme.TextInput, { height: 100 }]}
                            value={this.state.CommentReject}
                            onChangeText={(val) => {
                                this.setState({ CommentReject: val });
                            }}
                        />
                    </View>
                    <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "flex-end" }}>
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({ showConfirmReject: false }, async () => {
                                    await this.onReject();
                                });
                            }}
                        >
                            <LinearGradient
                                colors={["#7B35BB", "#5D2E86"]}
                                style={{
                                    width: width / 4,
                                    backgroundColor: "#722ED1",
                                    padding: 10,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: 5,
                                    alignSelf: "center",
                                    marginRight: 5,
                                }}
                            >
                                <Text style={Theme.BtnTextGradient}>
                                    Từ chối
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                //width: 80,
                                backgroundColor: "#E6E9EE",
                                padding: 10,
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 5,
                                alignSelf: "center",
                                marginLeft: 5,
                            }}
                            onPress={() => {
                                this.setState({ showConfirmReject: false });
                            }}
                        >
                            <Text style={{ color: "#1B2031", fontSize: 15 }}>
                                Bỏ qua
                            </Text>
                        </TouchableOpacity>
                    </View>
                </PopupModalUpdateNote>

                <PopupModalUpdateNote
                    resetState={this.showApprovalAuthority}
                    modalVisible={this.state.showApprovalAuthority}
                    title="Ủy quyền phê duyệt"
                >
                    <View style={styles.TextAndDrop}>
                        <View
                            style={{ flex: 2, marginBottom: 3, flexDirection: "row" }}
                        >
                            <Text>Người được ủy quyền </Text>
                        </View>
                        <View style={{ flex: 3 }}>
                            <DropDownBox
                                TextField="Name"
                                ValueField="EmployeeID"
                                DataSource={this.state.LstEmployee}
                                SelectedValue={this.state.EmployeeID}
                                OnSelectedItemChanged={(item) => {
                                    this.setState({ EmployeeID: item.EmployeeID });
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
                    />
                    <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "flex-end" }}>
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({ showApprovalAuthority: false }, async () => {
                                    await this.onApprovalManuallyPVDOK();
                                });
                            }}
                        >
                            <LinearGradient
                                colors={["#7B35BB", "#5D2E86"]}
                                style={{
                                    width: width / 5,
                                    backgroundColor: "#722ED1",
                                    padding: 10,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: 5,
                                    alignSelf: "center",
                                    marginRight: 5,
                                }}
                            >
                                <Text style={Theme.BtnTextGradient}>
                                    Lưu
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                width: width / 5,
                                backgroundColor: "#E6E9EE",
                                padding: 10,
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 5,
                                alignSelf: "center",
                                marginLeft: 5,
                            }}
                            onPress={() => {
                                this.setState({ showApprovalAuthority: false });
                            }}
                        >
                            <Text style={{ color: "#1B2031", fontSize: 15 }}>
                                Hủy
                            </Text>
                        </TouchableOpacity>
                    </View>
                </PopupModalUpdateNote>

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
