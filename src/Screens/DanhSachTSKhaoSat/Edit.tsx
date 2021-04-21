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
  Platform,
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
import ImageViewer from "react-native-image-zoom-viewer";
import AttachmentDto from "../../DtoParams/AttachmentDto";

const { width, height } = Dimensions.get("window");

interface iProps {
  navigation: any;
  route: any;
  GlobalStore: GlobalStore;
}

interface iState {
  ProcessValuationDocumentID?: number;
  showCustomerInfo: boolean;
  showDocList: boolean;
  showInfo: boolean;
  ValidateDocumentComment: string;
  ProcessValuationDocument?: ProcessValuationDocument;
  ProcessValuation?: ProcessValuation;
  LstMortgageAssetLevel2?: SystemParameter[];
  SelectedMortgageAssetLevel2?: number;
  LstMortgageAssetCode2?: SystemParameter[];
  SelectedMortgageAssetCode2?: number;
  ValidateDocumentReason?: number;
  LstAttachment?: adm_Attachment[];
  LstPVDContact?: ProcessValuationDocumentContact[];
  SelectedResult?: number;
  ContactDTG?: Date;
  Notes: string;
  WorkfieldPlanDTG?: Date;
  SelectedFullScreen: adm_Attachment;
  ValidateDocumentDeadlineDTG?: Date;
  content?: any;
  MACode2Enable?: boolean;
}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class KhaoSatHienTrangScr extends Component<iProps, iState> {

  constructor(props: any) {
    super(props);
    this.state = {
      ProcessValuationDocument: new ProcessValuationDocument(),
      showCustomerInfo: true,
      showDocList: true,
      showInfo: true,
      ValidateDocumentComment: "",
      LstMortgageAssetLevel2: [],
      LstMortgageAssetCode2: [],
      LstAttachment: [],
      LstPVDContact: [],
      Notes: "",
      SelectedFullScreen: null,
      content: {},
      MACode2Enable: false,
    };
  }

  async componentDidMount() {
    await this.LoadData();
  }

  async LoadData() {
    try {
      this.props.GlobalStore.ShowLoading();
      var req = new ProcessValuationDto();
      req.ProcessValuationDocumentID = this.props.route.params.ProcessValuationDocumentID;
      let res = await HttpUtils.post<ProcessValuationDto>(
        ApiUrl.ProcessValuation_Execute,
        SMX.ApiActionCode.LoadData,
        JSON.stringify(req)
      );

      if (res) {
        this.setState({
          ProcessValuationDocument: res!.ProcessValuationDocument!,
          ProcessValuation: res!.ProcessValuation!,
          LstMortgageAssetLevel2: res!.ListMortgageAssetLevel2!,
          SelectedMortgageAssetLevel2: res!.ProcessValuation!
            .MortgageAssetLevel2,
          LstMortgageAssetCode2: res!.ListMortgageAssetCode2!,
          SelectedMortgageAssetCode2: res!.ProcessValuationDocument!
            .MortgageAssetCode2,
          LstAttachment: res!.ListAttachmentMortgageAsset!,
          LstPVDContact: res!.ListProcessValuationDocumentContact!,
          MACode2Enable: res!.MACode2Enable,
        });
      }

      this.props.GlobalStore.HideLoading();
    } catch (ex) {
      this.props.GlobalStore.Exception = ex;
      this.props.GlobalStore.HideLoading();
    }
  }

  async btn_DocumentRequest() {
    try {
      this.props.GlobalStore.ShowLoading();
      var req = new ProcessValuationDto();
      var pvd = this.state.ProcessValuationDocument;
      var item = new ProcessValuationDocument();
      item.ProcessValuationDocumentID = pvd.ProcessValuationDocumentID;
      item.Version = pvd.Version;
      item.ValuationDocumentDetailID = pvd.ValuationDocumentDetailID;
      item.ValidateDocumentComment = this.state.ValidateDocumentComment;
      item.ValidateDocumentDeadlineDTG = this.state.ValidateDocumentDeadlineDTG;
      item.ValidateDocumentReason = this.state.ValidateDocumentReason;

      req.ProcessValuationDocument = item;

      await HttpUtils.post<ProcessValuationDto>(
        ApiUrl.ProcessValuation_Execute,
        SMX.ApiActionCode.DocumentRequest,
        JSON.stringify(req)
      );

      this.props.GlobalStore.HideLoading();
      let mess = "Yêu cầu trả hồ sơ thành công!";
      this.props.GlobalStore.Exception = ClientMessage(mess);

      this.props.navigation.navigate("DanhsachTSKhaoSatSrc");
    } catch (ex) {
      this.props.GlobalStore.HideLoading();
      this.props.GlobalStore.Exception = ex;
    }
  }

  async btn_Save() {
    try {
      this.props.GlobalStore.ShowLoading();
      var req = new ProcessValuationDto();
      var pvdOld = this.state.ProcessValuationDocument;
      var pvOld = this.state.ProcessValuation;
      var pvdNew = new ProcessValuationDocument();
      var pvNew = new ProcessValuation();
      var contact = new ProcessValuationDocumentContact();

      pvdNew.ProcessValuationDocumentID = pvdOld.ProcessValuationDocumentID;
      pvdNew.Version = pvdOld.Version;
      pvdNew.MortgageAssetID = pvdOld.MortgageAssetID;
      pvdNew.ValuationDocumentDetailID = pvdOld.ValuationDocumentDetailID;
      pvdNew.MortgageAssetCode2 = this.state.SelectedMortgageAssetCode2;
      pvdNew.ValidateDocumentComment = pvdOld.ValidateDocumentComment;
      pvdNew.ValidateDocumentDeadlineDTG = pvdOld.ValidateDocumentDeadlineDTG;
      pvdNew.Status = pvdOld.Status;
      pvdNew.ValidateDocumentStatus = pvdOld.ValidateDocumentStatus;
      pvdNew.ReportType = pvdOld.ReportType;

      pvNew.ProcessValuationID = pvOld.ProcessValuationID;
      pvNew.MortgageAssetCode2 = this.state.SelectedMortgageAssetCode2;
      pvNew.MortgageAssetLevel2 = this.state.SelectedMortgageAssetLevel2;

      contact.ProcessValuationDocumentID = pvdOld.ProcessValuationDocumentID;
      contact.ContactResult = this.state.SelectedResult;
      contact.ContactDTG = Utility.ConvertToUtcDateTimeApi(this.state.ContactDTG);
      contact.WorkfieldPlanDTG = Utility.ConvertToUtcDateTimeApi(this.state.WorkfieldPlanDTG);
      contact.Notes = this.state.Notes;

      req.ProcessValuationDocument = pvdNew;
      req.ProcessValuation = pvNew;
      req.ProcessValuationDocumentContact = contact;

      let res = await HttpUtils.post<ProcessValuationDto>(
        ApiUrl.ProcessValuation_Execute,
        SMX.ApiActionCode.SaveData,
        JSON.stringify(req)
      );

      let processValuationDocumentID = res.ProcessValuationDocument.ProcessValuationDocumentID;

      this.props.GlobalStore.HideLoading();
      let mess = "Lưu thành công!";
      this.props.GlobalStore.Exception = ClientMessage(mess);

      switch (res.MACode2) {
        case Enums.MortgageAssetCode2.BatDongSan_DatO:
          this.props.navigation.navigate("REResidentialSrc", {
            ProcessValuationDocumentID: processValuationDocumentID,
          });
          break;
        case Enums.MortgageAssetCode2.BatDongSan_LoDatO:
          this.props.navigation.navigate("BatchRESrc", {
            ProcessValuationDocumentID: processValuationDocumentID,
          });
          break;
        case Enums.MortgageAssetCode2.BatDongSan_CaoOc:
          this.props.navigation.navigate("ReBuildingsSrc", {
            ProcessValuationDocumentID: processValuationDocumentID,
          });
          break;
        case Enums.MortgageAssetCode2.BatDongSan_ChungCu:
          this.props.navigation.navigate("RECondominiumScr", {
            ProcessValuationDocumentID: processValuationDocumentID,
          });
          break;
        case Enums.MortgageAssetCode2.BatDongSan_DuAn:
          this.props.navigation.navigate("ReProjectsSrc", {
            ProcessValuationDocumentID: processValuationDocumentID,
          });
          break;
        case Enums.MortgageAssetCode2.BatDongSan_NhaXuong:
          this.props.navigation.navigate("ReFactoriesSrc", {
            ProcessValuationDocumentID: processValuationDocumentID,
          });
          break;
        case Enums.MortgageAssetCode2.BatDongSan_NhieuHoNhieuTang:
          this.props.navigation.navigate("ReApartmentsSrc", {
            ProcessValuationDocumentID: processValuationDocumentID,
          });
          break;
        case Enums.MortgageAssetCode2.MMTB_MMTB:
          this.props.navigation.navigate("EquipmentScr", {
            ProcessValuationDocumentID: processValuationDocumentID,
          });
          break;
        case Enums.MortgageAssetCode2.MMTB_DayChuyen:
          this.props.navigation.navigate("BatchEquipmentScr", {
            ProcessValuationDocumentID: processValuationDocumentID,
          });
          break;
        case Enums.MortgageAssetCode2.PTVT_DuongBo:
          this.props.navigation.navigate("VehicleRoadScr", {
            ProcessValuationDocumentID: processValuationDocumentID,
          });
          break;
        case Enums.MortgageAssetCode2.PTVT_DuongThuy:
          this.props.navigation.navigate("VesselScr", {
            ProcessValuationDocumentID: processValuationDocumentID,
          });
          break;
        case Enums.MortgageAssetCode2.PTVT_LoDuongBo:
          this.props.navigation.navigate("BatchVehiclesSrc", {
            ProcessValuationDocumentID: processValuationDocumentID,
          });
          break;
        default:
          this.props.navigation.goBack();
          break;
      }

    } catch (ex) {
      this.props.GlobalStore.Exception = ex;
      this.props.GlobalStore.HideLoading();
    }
  }

  onDeleteValidateDocumentDeadlineDate = () => {
    this.setState({ ValidateDocumentDeadlineDTG: undefined });
  };

  onDeleteContactDate = () => {
    this.setState({ ContactDTG: undefined });
  };

  onDeleteWorkfieldPlanDate = () => {
    this.setState({ WorkfieldPlanDTG: undefined });
  };

  checkIsNotImage(img: adm_Attachment) {
    let result = false;
    if (img.FileName && img.FileName !== null && img.FileName !== "") {
      let ext = img.FileName.split(".");
      if (
        ext &&
        ext.length > 0 &&
        (ext[1] === "pdf" || ext[1] === "xlsx" || ext[1] === "docx")
      ) {
        result = true;
        return result;
      }
    }

    return false;
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

  render() {
    let pvd = this.state.ProcessValuationDocument;
    return (
      <View style={{ flex: 1, backgroundColor: "#F6F6FE" }}>
        <Toolbar
          Title="Khảo sát hiện trạng - Tài sản"
          navigation={this.props.navigation}
        />
        <KeyboardAvoidingView
          behavior="height"
          style={{ flex: 1, paddingHorizontal: 8 }}
        >
          <ScrollView
            contentContainerStyle={
              Platform.OS === "android" ? this.state.content : undefined
            }
            showsVerticalScrollIndicator={false}
          >

            <View style={{ marginTop: 10 }}>
              <TouchableOpacity
                style={{ justifyContent: "flex-end", alignItems: "flex-end" }}
                onPress={() => {

                  switch (pvd.MortgageAssetCode2Code) {
                    case Enums.MortgageAssetCode2.BatDongSan_DatO:
                      this.props.navigation.navigate("REResidentialSrc", {
                        ProcessValuationDocumentID:
                          pvd.ProcessValuationDocumentID,
                      });
                      break;
                    case Enums.MortgageAssetCode2.BatDongSan_LoDatO:
                      this.props.navigation.navigate("BatchREScr", {
                        ProcessValuationDocumentID:
                          pvd.ProcessValuationDocumentID,
                      });
                      break;
                    case Enums.MortgageAssetCode2.BatDongSan_CaoOc:
                      this.props.navigation.navigate("ReBuildingsSrc", {
                        ProcessValuationDocumentID:
                          pvd.ProcessValuationDocumentID,
                      });
                      break;
                    case Enums.MortgageAssetCode2.BatDongSan_DuAn:
                      this.props.navigation.navigate("ReProjectsSrc", {
                        ProcessValuationDocumentID:
                          pvd.ProcessValuationDocumentID,
                      });
                      break;
                    case Enums.MortgageAssetCode2.BatDongSan_ChungCu:
                      this.props.navigation.navigate("RECondominiumScr", {
                        ProcessValuationDocumentID:
                          pvd.ProcessValuationDocumentID,
                      });
                      break;
                    case Enums.MortgageAssetCode2.BatDongSan_DuAn:
                      this.props.navigation.navigate("ReProjectsSrc", {
                        ProcessValuationDocumentID: pvd.ProcessValuationDocumentID
                      });
                      break;
                    case Enums.MortgageAssetCode2.BatDongSan_NhaXuong:
                      this.props.navigation.navigate("ReFactoriesSrc", {
                        ProcessValuationDocumentID:
                          pvd.ProcessValuationDocumentID,
                      });
                      break;
                    case Enums.MortgageAssetCode2.BatDongSan_NhieuHoNhieuTang:
                      this.props.navigation.navigate("ReApartmentsSrc", {
                        ProcessValuationDocumentID:
                          pvd.ProcessValuationDocumentID,
                      });
                      break;
                    case Enums.MortgageAssetCode2.MMTB_MMTB:
                      this.props.navigation.navigate("EquipmentScr", {
                        ProcessValuationDocumentID: pvd.ProcessValuationDocumentID
                      });
                      break;
                    case Enums.MortgageAssetCode2.MMTB_DayChuyen:
                      this.props.navigation.navigate("BatchEquipmentScr", {
                        ProcessValuationDocumentID: pvd.ProcessValuationDocumentID
                      });
                      break;
                    case Enums.MortgageAssetCode2.PTVT_DuongBo:
                      this.props.navigation.navigate("VehicleRoadScr", {
                        ProcessValuationDocumentID:
                          pvd.ProcessValuationDocumentID,
                      });
                      break;
                    case Enums.MortgageAssetCode2.PTVT_DuongThuy:
                      this.props.navigation.navigate("VesselScr", {
                        ProcessValuationDocumentID:
                          pvd.ProcessValuationDocumentID,
                      });
                      break;
                    case Enums.MortgageAssetCode2.PTVT_LoDuongBo:
                      this.props.navigation.navigate("BatchVehiclesSrc", {
                        ProcessValuationDocumentID:
                          pvd.ProcessValuationDocumentID,
                      });
                      break;
                  }
                }}
              >
                <LinearGradient
                  colors={SMX.BtnColor}
                  style={{
                    width: width / 3,
                    height: 40,
                    backgroundColor: "#007AFF",
                    borderRadius: 5,
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <FontAwesome5 name="file-alt" size={18} color="#FFFFFF" />
                  <Text
                    style={{ color: "#FFFFFF", fontSize: 15, marginLeft: 8 }}
                  >
                    Khảo sát TS
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View style={Theme.ViewGeneral}>
              <View style={Theme.ViewTitle}>
                <Text
                  style={{ fontSize: 15, fontWeight: "600", color: "#FFFFFF" }}
                >
                  I. THÔNG TIN KHÁCH HÀNG
                </Text>
              </View>
              <View style={Theme.ViewContent}>
                {this.state.showCustomerInfo ? (
                  <View style={{ marginTop: 8, marginBottom: 10 }}>
                    <View style={styles.Item}>
                      <View style={{ flex: 2, marginBottom: 3, flexDirection: 'row' }}>
                        <Text >Tên khách hàng </Text>
                      </View>
                      <View style={{ flex: 3 }}>
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
                      <View style={{ flex: 2, marginBottom: 3, flexDirection: 'row' }}>
                        <Text >Địa chỉ thực tế </Text>
                      </View>
                      <View style={{ flex: 3 }}>
                        <Text style={{ fontWeight: '600' }}>{pvd.MortgageAssetAddress}</Text>
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
                      <View style={{ flex: 2, flexDirection: "row" }}>
                        <Text>Loại tài sản cấp 2 </Text>
                      </View>
                      <View style={{ flex: 3 }}>
                        <DropDownBox
                          TextField="Name"
                          ValueField="SystemParameterID"
                          DataSource={this.state.LstMortgageAssetLevel2}
                          SelectedValue={this.state.SelectedMortgageAssetLevel2}
                          OnSelectedItemChanged={(item) => {
                            this.setState({
                              SelectedMortgageAssetLevel2:
                                item.SystemParameterID,
                            });
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

                    <View style={styles.Item}>
                      <View style={{ flex: 2 }}>
                        <Text>Mẫu báo cáo </Text>
                      </View>
                      <View style={{ flex: 3 }}>
                        <DropDownBox
                          TextField="Name"
                          ValueField="SystemParameterID"
                          DataSource={this.state.LstMortgageAssetCode2}
                          SelectedValue={this.state.SelectedMortgageAssetCode2}
                          Disable={!this.state.MACode2Enable}
                          OnSelectedItemChanged={(item) => {
                            this.setState({
                              SelectedMortgageAssetCode2:
                                item.SystemParameterID,
                            });
                          }}
                        />
                      </View>
                    </View>
                  </View>
                ) : undefined}
              </View>
            </View>

            <View style={Theme.ViewGeneral}>
              <View style={Theme.ViewTitle}>
                <Text
                  style={{ fontSize: 15, fontWeight: "600", color: "#FFFFFF" }}
                >
                  II. DANH SÁCH TÀI LIỆU
                </Text>
              </View>
              <View
                style={[
                  Theme.ViewContent,
                  {
                    paddingHorizontal: this.state.showDocList ? 0 : 8,
                    paddingVertical: this.state.showDocList ? 0 : 12,
                  },
                ]}
              >
                {this.state.showDocList ? (
                  <>
                    <ScrollView
                      onTouchStart={(ev) => {
                        this.state.LstAttachment.length > 2
                          ? this.setState({ content: { flex: 1 } })
                          : this.setState({ content: {} });
                      }}
                      onMomentumScrollEnd={(e) => {
                        this.setState({ content: {} });
                      }}
                      onScrollEndDrag={(e) => {
                        this.setState({ content: {} });
                      }}
                      style={{
                        height:
                          this.state.LstAttachment.length > 0
                            ? this.state.LstAttachment.length > 1
                              ? 200
                              : 100
                            : undefined,
                      }}
                    >
                      {this.state.LstAttachment.map((data, index) => {
                        return (
                          <TouchableOpacity
                            style={{
                              width: "100%",
                              marginTop: 0,
                              borderBottomWidth: 1,
                              borderColor: "gainsboro",
                              paddingBottom: 0,
                              backgroundColor: "#FFF",
                            }}
                            key={index.toString()}
                            onPress={() => {
                              if (!this.checkIsNotImage(data)) {
                                this.btn_GetImageByECMID(data);

                                //this.setState({ SelectedFullScreen: data });
                              } else {
                                this.props.navigation.navigate("PDFView", {
                                  AttachmentID: data.AttachmentID,
                                  ECMItemID: data.ECMItemID,
                                  FileName: data.FileName,
                                  Title: 'Tài liệu của tài sản'
                                });
                              }
                            }}
                          >
                            <View style={{ width: width - 95, padding: 10 }}>
                              <View
                                style={{
                                  flexDirection: "row",
                                  marginBottom: 2,
                                }}
                              >
                                <Text style={{ fontWeight: "600" }}>
                                  Loại tài liệu:{" "}
                                </Text>
                                <Text
                                  style={{
                                    fontWeight: "600",
                                    color: "#005599",
                                  }}
                                >
                                  {data.DocumentTypeName}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: "row",
                                  marginBottom: 2,
                                }}
                              >
                                <Text style={{ fontWeight: "600" }}>
                                  Mức độ yêu cầu:{" "}
                                </Text>
                                <Text style={{}}>
                                  {Utility.GetDictionaryValue(
                                    SMX.MapDocumentRequireStatus
                                      .dtcMapDocumentTypeStatus,
                                    data.RequireLevel
                                  )}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: "row",
                                  marginBottom: 2,
                                }}
                              >
                                <Text style={{ fontWeight: "600" }}>
                                  Ngày đưa lên:{" "}
                                </Text>
                                <Text style={{}}>
                                  {/* {Utility.GetDateMinuteString(data.CreatedDTG)} */}
                                  {data.CreatedDTGText}
                                </Text>
                              </View>
                              <View style={{ flexDirection: "row" }}>
                                <Text style={{ fontWeight: "600" }}>
                                  Người đưa lên:{" "}
                                </Text>
                                <Text style={{ width: width - 100 }}>
                                  {data.FullNameCreateBy}
                                </Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>

                    <View
                      style={{
                        height: 1,
                        backgroundColor: "#F0F0F4",
                        marginBottom: 8,
                      }}
                    />
                    <View style={{ paddingHorizontal: 8, paddingVertical: 12 }}>
                      <View style={styles.Item}>
                        <View style={{ flex: 2, flexDirection: "row" }}>
                          <Text>Phân loại lý do </Text>
                          <Text style={{ color: "red" }}>*</Text>
                        </View>
                        <View style={{ flex: 3 }}>
                          <DropDownBox
                            TextField="Value"
                            ValueField="Key"
                            DataSource={
                              SMX.ValidateDocumentReason
                                .dicValidateDocumentReason
                            }
                            SelectedValue={this.state.ValidateDocumentReason}
                            OnSelectedItemChanged={(item) => {
                              this.setState({
                                ValidateDocumentReason: item.Key,
                              });
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
                      <View style={styles.Item}>
                        <View style={{ flex: 2, flexDirection: "row" }}>
                          <Text>Thời hạn bổ sung </Text>
                        </View>
                        <View style={{ flex: 3 }}>
                          <DateTimePicker
                            onRemove={this.onDeleteValidateDocumentDeadlineDate}
                            SelectedDate={
                              this.state.ValidateDocumentDeadlineDTG
                            }
                            OnselectedDateChanged={(val) => {
                              this.setState({
                                ValidateDocumentDeadlineDTG: val,
                              });
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
                      <View style={styles.Item}>
                        <View style={{ flex: 2, flexDirection: "row" }}>
                          <Text>Ghi chú/Lý do không đầy đủ </Text>
                        </View>
                      </View>
                      <View style={{ flex: 3 }}>
                        <TextInput
                          multiline={true}
                          numberOfLines={4}
                          textAlignVertical="top"
                          style={[Theme.TextInput, { height: 75 }]}
                          value={this.state.ValidateDocumentComment}
                          onChangeText={(val) => {
                            this.setState({ ValidateDocumentComment: val });
                          }}
                        />
                      </View>
                    </View>
                  </>
                ) : undefined}
              </View>
            </View>

            <View style={Theme.ViewGeneral}>
              <View style={Theme.ViewTitle}>
                <Text
                  style={{ fontSize: 15, fontWeight: "600", color: "#FFFFFF" }}
                >
                  III. THÔNG TIN KHẢO SÁT
                </Text>
              </View>
              <View
                style={[
                  Theme.ViewContent,
                  {
                    paddingHorizontal: this.state.showInfo ? 0 : 8,
                    paddingVertical: this.state.showInfo ? 0 : 12,
                  },
                ]}
              >
                {this.state.showInfo ? (
                  <View style={{ flex: 1 }}>
                    <ScrollView
                      onTouchStart={(ev) => {
                        this.setState({ content: { flex: 1 } });
                      }}
                      onMomentumScrollEnd={(e) => {
                        this.setState({ content: {} });
                      }}
                      onScrollEndDrag={(e) => {
                        this.setState({ content: {} });
                      }}
                      style={{
                        height:
                          this.state.LstPVDContact.length > 0
                            ? this.state.LstPVDContact.length > 1
                              ? 200
                              : 100
                            : undefined,
                      }}
                    >
                      {this.state.LstPVDContact.map((data, index) => {
                        return (
                          <View
                            style={{
                              width: "100%",
                              marginTop: 0,
                              borderBottomWidth: 1,
                              borderColor: "gainsboro",
                              paddingBottom: 0,
                              backgroundColor: "#FFF",
                            }}
                            key={index.toString()}
                          >
                            <View style={{ width: width - 95, padding: 10 }}>
                              <View
                                style={{
                                  flexDirection: "row",
                                  marginBottom: 2,
                                }}
                              >
                                <Text style={{ fontWeight: "600" }}>
                                  Lần liên hệ:{" "}
                                </Text>
                                <Text
                                  style={{
                                    fontWeight: "600",
                                    color: "#005599",
                                  }}
                                >
                                  Lần liên hệ thứ {index + 1}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: "row",
                                  marginBottom: 2,
                                }}
                              >
                                <Text style={{ fontWeight: "600" }}>
                                  Thời gian liên hệ:{" "}
                                </Text>
                                <Text style={{}}>
                                  {/* {Utility.GetDateMinuteString(data.ContactDTG)} */}
                                  {data.ContactDTGText}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: "row",
                                  marginBottom: 2,
                                }}
                              >
                                <Text style={{ fontWeight: "600" }}>
                                  Kết quả:{" "}
                                </Text>
                                <Text style={{}}>
                                  {Utility.GetDictionaryValue(
                                    SMX.ProcessValuationDocumentContactType
                                      .dicName,
                                    data.ContactResult
                                  )}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: "row",
                                  marginBottom: 2,
                                }}
                              >
                                <Text style={{ fontWeight: "600" }}>
                                  Ghi chú:{" "}
                                </Text>
                                <Text style={{ width: width - 100 }}>
                                  {data.Notes}
                                </Text>
                              </View>
                            </View>
                          </View>
                        );
                      })}
                    </ScrollView>
                    <View
                      style={{
                        height: 1,
                        backgroundColor: "#F0F0F4",
                        marginBottom: 8,
                      }}
                    />
                    <View
                      style={{
                        backgroundColor: "#eaf2f6",
                        borderRadius: 5,
                        marginTop: 5,
                        borderWidth: 1,
                        borderColor: "#7ba6c2",
                        padding: 5,
                        marginHorizontal: 8,
                        marginVertical: 12,
                      }}
                    >
                      <View style={styles.Item}>
                        <View style={{ flex: 1.5, flexDirection: "row" }}>
                          <Text style={{ fontWeight: "600" }}>
                            Thời gian liên hệ{" "}
                          </Text>
                        </View>
                        <View style={{ flex: 3.5 }}>
                          <DateTimePicker
                            HasTime={true}
                            onRemove={this.onDeleteContactDate}
                            SelectedDate={this.state.ContactDTG}
                            OnselectedDateChanged={(val) => {
                              this.setState({ ContactDTG: val });
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
                      ></View>
                      <View style={styles.Item}>
                        <View style={{ flex: 1.5, flexDirection: "row" }}>
                          <Text style={{ fontWeight: "600" }}>Kết quả </Text>
                        </View>
                        <View style={{ flex: 3.5 }}>
                          <DropDownBox
                            TextField="Value"
                            ValueField="Key"
                            DataSource={
                              SMX.ProcessValuationDocumentContactType.dicName
                            }
                            SelectedValue={this.state.SelectedResult}
                            OnSelectedItemChanged={(item) => {
                              this.setState({ SelectedResult: item.Key });
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
                      ></View>
                      <View style={styles.Item}>
                        <View style={{ flex: 1.5, flexDirection: "row" }}>
                          <Text style={{ fontWeight: "600" }}>
                            Lịch khảo sát{" "}
                          </Text>
                        </View>
                        <View style={{ flex: 3.5 }}>
                          <DateTimePicker
                            HasTime={true}
                            onRemove={this.onDeleteWorkfieldPlanDate}
                            SelectedDate={this.state.WorkfieldPlanDTG}
                            OnselectedDateChanged={(val) => {
                              this.setState({ WorkfieldPlanDTG: val });
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
                        <View style={{ flex: 1.5, flexDirection: "row" }}>
                          <Text style={{ fontWeight: "600" }}>Ghi chú </Text>
                        </View>
                        <View style={{ flex: 3.5 }}>
                          <TextInput
                            multiline={true}
                            numberOfLines={2}
                            textAlignVertical="top"
                            style={[Theme.TextInput]}
                            value={this.state.Notes}
                            onChangeText={(val) => {
                              this.setState({ Notes: val });
                            }}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                ) : undefined}
              </View>
            </View>

            <View
              style={{
                flex: 1,
                marginVertical: 15,
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              {pvd.Status == Enums.ProcessValuationDocument.KiemTraHoSo &&
                pvd.ValidateDocumentStatus !=
                Enums.ValidateDocumentStatus.YeuCauBoSungHoSo ? (
                <TouchableOpacity
                  style={{ justifyContent: "flex-end", alignItems: "flex-end" }}
                  onPress={() => {
                    this.btn_DocumentRequest();
                  }}
                >
                  <LinearGradient
                    colors={SMX.BtnColor}
                    style={{
                      width: width / 2 + 25,
                      height: 40,
                      backgroundColor: "#007AFF",
                      borderRadius: 5,
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                  >
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={20}
                      color="#FFFFFF"
                    />
                    <Text
                      style={{ color: "#FFFFFF", fontSize: 15, marginLeft: 8 }}
                    >
                      Yêu cầu bổ sung & trả HS
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              ) : undefined}

              {pvd.Status == Enums.ProcessValuationDocument.KiemTraHoSo ? (
                <TouchableOpacity
                  style={{
                    marginLeft: 10,
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                  }}
                  onPress={() => {
                    this.btn_Save();
                  }}
                >
                  <LinearGradient
                    colors={SMX.BtnColor}
                    style={{
                      width: width / 4 - 20,
                      height: 40,
                      backgroundColor: "#007AFF",
                      borderRadius: 5,
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                  >
                    <FontAwesome5 name="save" size={18} color="#FFFFFF" />
                    <Text
                      style={{ color: "#FFFFFF", fontSize: 15, marginLeft: 8 }}
                    >
                      Lưu
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              ) : undefined}
            </View>

            {this.state.SelectedFullScreen != null ? (
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
                      url:
                        "data:image/png;base64," +
                        this.state.SelectedFullScreen.FileContent,
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
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <FontAwesome5
                        name="arrow-left"
                        size={20}
                        color={"white"}
                      />
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontSize: 15,
                          marginLeft: 15,
                          color: "white",
                        }}
                      >
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
            ) : undefined}

          </ScrollView>
        </KeyboardAvoidingView>
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
  TextAndDrop: {
    marginTop: 10,
  },
});
