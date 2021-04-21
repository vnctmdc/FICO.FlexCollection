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
import Theme from "../../../Themes/Default";
import ApiUrl from "../../../constants/ApiUrl";
import * as Enums from "../../../constants/Enums";
import { WebView } from "react-native-webview";
import Toolbar from "../../../components/Toolbar";
import HttpUtils from "../../../Utils/HttpUtils";
import SMX from "../../../constants/SMX";
import { inject, observer } from "mobx-react";
import GlobalStore from "../../../Stores/GlobalStore";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import GlobalCache from "../../../Caches/GlobalCache";
import DropDownBox from "../../../components/DropDownBox";
import SystemParameter from "../../../Entities/SystemParameter";
import { TextInputMask } from "react-native-masked-text";
import { ClientMessage } from "../../../SharedEntity/SMXException";
import { LinearGradient } from "expo-linear-gradient";
import Utility from "../../../Utils/Utility";
import ProcessValuationDto from "../../../DtoParams/ProcessValuationDto";
import ProcessValuation from "../../../Entities/ProcessValuation";
import ProcessValuationDocument from "../../../Entities/ProcessValuationDocument";
import MarkerObject from "../../../SharedEntity/MarkerObject";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import BatchREDto from "../../../DtoParams/BatchREDto";
import MortgageAssetProductionLineDetail from "../../../Entities/MortgageAssetProductionLineDetail";
import ProcessValuationRE from "../../../Entities/ProcessValuationRE";
import MortgageAsset from "../../../Entities/MortgageAsset";
import adm_Attachment from "../../../Entities/adm_Attachment";
import AttachmentDto from "../../../DtoParams/AttachmentDto";
import ImageViewer from "react-native-image-zoom-viewer";

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
  LstContiguousStreetType?: SystemParameter[];
  ProcessValuationRE?: ProcessValuationRE;
  WorkfieldDistance?: string;
  location?: MarkerObject;
  LstMortgageAsset?: MortgageAsset[];
  SelectedFullScreen: adm_Attachment;
}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class BatchREScr extends Component<iProps, iState> {
  constructor(props: any) {
    super(props);
    this.state = {
      showCustomerInfo: true,
      ProcessValuation: new ProcessValuation(),
      ProcessValuationDocument: new ProcessValuationDocument(),
      ProcessValuationRE: new ProcessValuationRE(),
      WorkfieldDistance: "",
      LstMortgageAsset: [],
      SelectedFullScreen: null,
    };
  }

  async componentDidMount() {
    await this.LoadData();
  }

  async LoadData() {
    try {
      this.props.GlobalStore.ShowLoading();
      var req = new BatchREDto();
      req.ProcessValuationDocumentID = this.props.route.params.ProcessValuationDocumentID;

      let res = await HttpUtils.post<BatchREDto>(
        ApiUrl.BatchRE_Execute,
        SMX.ApiActionCode.SetupDisplay,
        JSON.stringify(req)
      );

      if (res) {
        this.setState({
          ProcessValuationDocument: res!.ProcessValuationDocument!,
          ProcessValuation: res!.ProcessValuation!,
          LstMortgageAsset: res!.LstMortgageAsset!,
          LstContiguousStreetType: res!.LstContiguousStreetType!,
          WorkfieldDistance: res!.ProcessValuationDocument.WorkfieldDistance
            ? res!.ProcessValuationDocument.WorkfieldDistance + ""
            : "",
        });
      }

      this.props.GlobalStore.HideLoading();
    } catch (ex) {
      this.props.GlobalStore.Exception = ex;
      this.props.GlobalStore.HideLoading();
    }
  }

  async btn_Save(saveType: number, showSuccess: boolean) {
    try {
      this.props.GlobalStore.ShowLoading();
      let req = new BatchREDto();
      var pvdOld = this.state.ProcessValuationDocument;
      var pvOld = this.state.ProcessValuation;

      let pvd = new ProcessValuationDocument();
      let pv = new ProcessValuation();

      if (saveType == Enums.SaveType.Completed) {
        if (
          !this.state.WorkfieldDistance ||
          this.state.WorkfieldDistance == ""
        ) {
          this.props.GlobalStore.HideLoading();
          let message = "[Khoảng cách đi thẩm định (km)] Không được để trống";
          this.props.GlobalStore.Exception = ClientMessage(message);
          return;
        }
        if (pvOld.ContiguousStreetType == undefined) {
          this.props.GlobalStore.HideLoading();
          let message = "[Loại đường tiếp giáp] Không được để trống";
          this.props.GlobalStore.Exception = ClientMessage(message);
          return;
        }
        if (!pvOld.DisAdvantage || pvOld.DisAdvantage == "") {
          this.props.GlobalStore.HideLoading();
          let message = "[Những yếu tố không thuận lợi] Không được để trống";
          this.props.GlobalStore.Exception = ClientMessage(message);
          return;
        }
        if (!pvOld.PositionDescription || pvOld.PositionDescription == "") {
          this.props.GlobalStore.HideLoading();
          let message = "[Mô tả vị trí] Không được để trống";
          this.props.GlobalStore.Exception = ClientMessage(message);
          return;
        }
      }

      var workfieldDistance = this.state.WorkfieldDistance;

      pvd.ProcessValuationDocumentID = pvdOld.ProcessValuationDocumentID;
      pvd.MortgageAssetID = pvdOld.MortgageAssetID;
      pvd.WorkfieldDistance =
        workfieldDistance && workfieldDistance.length != 0
          ? parseFloat(workfieldDistance.split(",").join("."))
          : undefined;
      pvd.Version = pvdOld.Version;
      pvd.CustomerName = pvdOld.CustomerName;
      pvd.Status = pvdOld.Status;

      pv.ProcessValuationID = pvOld.ProcessValuationID;
      pv.UsePurposeDetail = pvOld.UsePurposeDetail;
      pv.PositionDescription = pvOld.PositionDescription;
      pv.Version = pvOld.Version;

      req.ProcessValuationDocument = pvd;
      req.ProcessValuation = pv;

      let res = await HttpUtils.post<BatchREDto>(
        ApiUrl.BatchRE_Execute,
        SMX.ApiActionCode.SaveData,
        JSON.stringify(req)
      );

      if (res) {
        this.setState({
          ProcessValuationDocument: res!.ProcessValuationDocument!,
          ProcessValuation: res!.ProcessValuation!,
          WorkfieldDistance:
            res!.ProcessValuationDocument!.WorkfieldDistance + "",
        });
      }

      this.props.GlobalStore.HideLoading();
      if (showSuccess == true) {
        let mess = "Lưu thành công!";
        this.props.GlobalStore.Exception = ClientMessage(mess);
      }
    } catch (ex) {
      this.props.GlobalStore.Exception = ex;
      this.props.GlobalStore.HideLoading();
    }
  }

  async btn_CheckIn() {
    try {
      this.props.GlobalStore.ShowLoading();
      var pvOld = this.state.ProcessValuation;
      if (!this.state.WorkfieldDistance || this.state.WorkfieldDistance == "") {
        this.props.GlobalStore.HideLoading();
        let message = "[Khoảng cách đi thẩm định (km)] Không được để trống";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }
      if (pvOld.ContiguousStreetType == undefined) {
        this.props.GlobalStore.HideLoading();
        let message = "[Loại đường tiếp giáp] Không được để trống";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }
      if (!pvOld.DisAdvantage || pvOld.DisAdvantage == "") {
        this.props.GlobalStore.HideLoading();
        let message = "[Những yếu tố không thuận lợi] Không được để trống";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }
      if (!pvOld.PositionDescription || pvOld.PositionDescription == "") {
        this.props.GlobalStore.HideLoading();
        let message = "[Mô tả vị trí] Không được để trống";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      if (!location && !location.coords) {
        this.props.GlobalStore.HideLoading();
        let message =
          "Không lấy được vị trí hiện tại, vui lòng bật Permission để lấy tọa độ";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }
      await this.btn_Save(Enums.SaveType.Completed, false);

      var req = new BatchREDto();
      var item = this.state.ProcessValuationDocument;
      let pvd = new ProcessValuationDocument();
      let pv = new ProcessValuation();

      pvd.ProcessValuationDocumentID = item.ProcessValuationDocumentID;
      pvd.Status = Enums.ProcessValuationDocument.KhaoSatHienTrang;

      pv.ProcessValuationID = this.state.ProcessValuation.ProcessValuationID;
      pv.CoordinateLat = location.coords.latitude.toString();
      pv.CoordinateLon = location.coords.longitude.toString();
      pv.Coordinate = `${location.coords.latitude.toString()},${location.coords.longitude.toString()}`;

      req.ProcessValuationDocument = pvd;
      req.ProcessValuation = pv;

      await HttpUtils.post<BatchREDto>(
        ApiUrl.BatchRE_Execute,
        SMX.ApiActionCode.SavePositionWorkfield,
        JSON.stringify(req)
      );

      this.props.navigation.navigate("REResidentialImagesSrc", {
        ProcessValuationDocumentID: this.props.route.params
          .ProcessValuationDocumentID,
        MortgageAssetID: item.MortgageAssetID,
        CustomerName: item.CustomerName,
        InfactAddress: this.state.ProcessValuation.InfactAddress,
      });

      this.props.GlobalStore.HideLoading();
      let mess = "Lưu tọa độ thành công!";
      this.props.GlobalStore.Exception = ClientMessage(mess);
    } catch (ex) {
      this.props.GlobalStore.Exception = ex;
      this.props.GlobalStore.HideLoading();
    }
  }

  async btn_Attachment() {
    try {
      this.props.GlobalStore.ShowLoading();
      var req = new BatchREDto();

      await HttpUtils.post<BatchREDto>(
        ApiUrl.BatchRE_Execute,
        SMX.ApiActionCode.UploadAttachment,
        JSON.stringify(req)
      );

      this.props.GlobalStore.HideLoading();
    } catch (ex) {
      this.props.GlobalStore.Exception = ex;
      this.props.GlobalStore.HideLoading();
    }
  }

  async btn_Done() {
    try {
      this.props.GlobalStore.ShowLoading();
      var req = new BatchREDto();
      var item = this.state.ProcessValuationDocument;
      var pvd = new ProcessValuationDocument();

      if (item.MortgageAssetID == undefined || item.MortgageAssetID == null) {
        this.props.GlobalStore.HideLoading();
        let message =
          "Bạn cần thực hiện lưu thông tin tại bước Kiểm tra hồ sơ trước khi Thực hiện khảo sát.";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }

      pvd.ProcessValuationDocumentID = item.ProcessValuationDocumentID;
      pvd.Status = Enums.ProcessValuationDocument.LapBaoCaoDinhGia;
      pvd.MortgageAssetID = item.MortgageAssetID;

      req.ProcessValuationDocument = pvd;

      await HttpUtils.post<BatchREDto>(
        ApiUrl.BatchRE_Execute,
        SMX.ApiActionCode.Done,
        JSON.stringify(req)
      );

      await this.LoadData();

      this.props.GlobalStore.HideLoading();
    } catch (ex) {
      this.props.GlobalStore.Exception = ex;
      this.props.GlobalStore.HideLoading();
    }
  }

  async btn_CheckExistsPVEBatchEquipment(detailID: number) {
    try {
      this.props.GlobalStore.ShowLoading();
      var req = new BatchREDto();
      var maplDetail = new MortgageAssetProductionLineDetail();
      maplDetail.MortgageAssetProductionLineDetailID = detailID;

      //req.MortgageAssetProductionLineDetail = maplDetail;

      let res = await HttpUtils.post<BatchREDto>(
        ApiUrl.BatchRE_Execute,
        SMX.ApiActionCode.CheckExistsPVEBatchEquipment,
        JSON.stringify(req)
      );

      // if (res!.ProcessValuationEquipment != null) {
      //   this.props.navigation.navigate("BatchEquipmentImagesScr", {
      //     ProcessValuationDocumentID: this.state.ProcessValuationDocument
      //       .ProcessValuationDocumentID,
      //     ProcessValuationEquipmentID: res!.ProcessValuationEquipment!
      //       .ProcessValuationEquipmentID,
      //   });
      // }

      this.props.GlobalStore.HideLoading();
    } catch (ex) {
      this.props.GlobalStore.Exception = ex;
      this.props.GlobalStore.HideLoading();
    }
  }

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
    let pv = this.state.ProcessValuation;
    let lstMA = this.state.LstMortgageAsset;
    return (
      <View style={{ height: height, backgroundColor: "#F2F2F2" }}>
        <Toolbar
          Title="Khảo sát hiện trạng - Khảo sát TS"
          navigation={this.props.navigation}
        />
        <KeyboardAvoidingView
          behavior="height"
          style={{ flex: 1, paddingHorizontal: 8 }}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
                marginTop: 10,
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              <TouchableOpacity
                style={{
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                  marginRight: 15,
                }}
                onPress={() => {
                  this.props.navigation.navigate("KhaoSatHienTrangScr", {
                    ProcessValuationDocumentID: pvd.ProcessValuationDocumentID,
                  });
                }}
              >
                <LinearGradient
                  colors={SMX.BtnColor}
                  style={{
                    width: width / 3 - 30,
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
                    style={{
                      fontWeight: "600",
                      color: "#FFFFFF",
                      fontSize: 15,
                      marginLeft: 8,
                    }}
                  >
                    Hồ sơ TS
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ justifyContent: "flex-end", alignItems: "flex-end" }}
                onPress={() => {
                  this.props.navigation.navigate("REResidentialImagesSrc", {
                    ProcessValuationDocumentID: pvd.ProcessValuationDocumentID,
                    MortgageAssetID: pvd.MortgageAssetID,
                    CustomerName: pvd.CustomerName,
                    InfactAddress: pv.InfactAddress,
                  });
                }}
              >
                <LinearGradient
                  colors={SMX.BtnColor}
                  style={{
                    width: width / 3 - 30,
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
                    style={{
                      fontWeight: "600",
                      color: "#FFFFFF",
                      fontSize: 15,
                      marginLeft: 8,
                    }}
                  >
                    Hình ảnh
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
                <View style={styles.Item}>
                  <View
                    style={{ flex: 2, marginBottom: 3, flexDirection: "row" }}
                  >
                    <Text>Tên khách hàng </Text>
                  </View>
                  <View style={{ flex: 3 }}>
                    <Text style={{ fontWeight: "600" }}>
                      {pvd.CustomerName}
                    </Text>
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
                  <View
                    style={{ flex: 2, marginBottom: 3, flexDirection: "row" }}
                  >
                    <Text>Địa chỉ thực tế </Text>
                  </View>
                  <View style={{ flex: 3 }}>
                    <Text style={{ fontWeight: "600" }}>
                      {pv.InfactAddress}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={Theme.ViewGeneral}>
              <View style={Theme.ViewTitle}>
                <Text
                  style={{ fontSize: 15, fontWeight: "600", color: "#FFFFFF" }}
                >
                  II. THÔNG TIN KHẢO SÁT
                </Text>
              </View>
              <View style={Theme.ViewContent}>
                <View style={styles.Item}>
                  <View style={{ flex: 2, flexDirection: "row" }}>
                    <Text>KC đi thẩm định(km) </Text>
                    <Text style={{ color: "red" }}>*</Text>
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
                />

                <View style={styles.Item}>
                  <View
                    style={{ flex: 2, marginBottom: 3, flexDirection: "row" }}
                  >
                    <Text>Loại đường tiếp giáp </Text>
                    <Text style={{ color: "red" }}>*</Text>
                  </View>
                  <View style={{ flex: 3 }}>
                    <DropDownBox
                      TextField="Name"
                      ValueField="SystemParameterID"
                      DataSource={this.state.LstContiguousStreetType}
                      SelectedValue={1}
                      OnSelectedItemChanged={(item) => {
                        pv.ContiguousStreetType = item.SystemParameterID;
                        this.setState({ ProcessValuationRE: pv });
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

                <View style={styles.TextAndDrop}>
                  <View
                    style={{ flex: 2, marginBottom: 3, flexDirection: "row" }}
                  >
                    <Text>Những yếu tố không thuận lợi </Text>
                    <Text style={{ color: "red" }}>*</Text>
                  </View>
                  <View style={{ flex: 3 }}>
                    <TextInput
                      numberOfLines={4}
                      multiline={true}
                      textAlignVertical="top"
                      style={[Theme.TextView, { height: 75 }]}
                      value={pv.DisAdvantage}
                      onChangeText={(val) => {
                        pv.DisAdvantage = val;
                        this.setState({ ProcessValuationRE: pv });
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

                <View style={styles.TextAndDrop}>
                  <View
                    style={{ flex: 2, marginBottom: 3, flexDirection: "row" }}
                  >
                    <Text>Mô tả tài sản trên đất </Text>
                  </View>
                  <View style={{ flex: 3 }}>
                    <TextInput
                      numberOfLines={4}
                      multiline={true}
                      textAlignVertical="top"
                      style={[Theme.TextView, { height: 75 }]}
                      value={pv.OnLandDescription}
                      onChangeText={(val) => {
                        pv.OnLandDescription = val;
                        this.setState({ ProcessValuationRE: pv });
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

                <View style={styles.TextAndDrop}>
                  <View
                    style={{ flex: 2, marginBottom: 3, flexDirection: "row" }}
                  >
                    <Text>Mô tả vị trí </Text>
                    <Text style={{ color: "red" }}>*</Text>
                  </View>
                  <View style={{ flex: 3 }}>
                    <TextInput
                      numberOfLines={4}
                      multiline={true}
                      textAlignVertical="top"
                      style={[Theme.TextView, { height: 75 }]}
                      value={pv.PositionDescription}
                      onChangeText={(val) => {
                        pv.PositionDescription = val;
                        this.setState({ ProcessValuationRE: pv });
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

                <View style={styles.TextAndDrop}>
                  <View
                    style={{ flex: 2, marginBottom: 3, flexDirection: "row" }}
                  >
                    <Text>Thông tin lưu ý </Text>
                  </View>
                  <View style={{ flex: 3 }}>
                    <TextInput
                      numberOfLines={4}
                      multiline={true}
                      textAlignVertical="top"
                      style={[Theme.TextView, { height: 75 }]}
                      value={pv.WorkfieldOtherInfomation}
                      onChangeText={(val) => {
                        pv.WorkfieldOtherInfomation = val;
                        this.setState({ ProcessValuationRE: pv });
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

                <View
                  style={{
                    marginTop: 10,
                    marginBottom: 3,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderBottomWidth: 1,
                    borderBottomColor: "#F0F0F4",
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <FontAwesome5 name="list-ul" size={15} color="#000" />
                    <Text
                      style={{ marginLeft: 5, fontSize: 15, fontWeight: "600" }}
                    >
                      Danh sách lô đất
                    </Text>
                  </View>
                </View>

                <ScrollView
                  style={{
                    height:
                      lstMA.length > 0
                        ? lstMA.length > 1
                          ? 200
                          : 100
                        : undefined,
                  }}
                >
                  {lstMA.map((item, index) => {
                    return (
                      <View key={index.toString()}>
                        <View
                          style={{
                            width: "100%",
                            marginTop: 0,
                            borderBottomWidth: 1,
                            borderColor: "gainsboro",
                            paddingBottom: 0,
                            backgroundColor: "#FFF",
                          }}
                        >
                          <View style={{ padding: 10 }}>
                            <View
                              style={{ flexDirection: "row", marginBottom: 2 }}
                            >
                              <Text style={{ fontWeight: "600" }}>STT: </Text>
                              <Text style={{ fontWeight: "600" }}>
                                {index + 1}
                              </Text>
                            </View>
                            <View
                              style={{ flexDirection: "row", marginBottom: 2 }}
                            >
                              <Text style={{ fontWeight: "600" }}>
                                Số GCN / HĐ:{" "}
                              </Text>
                              <Text
                                style={{ fontWeight: "600", color: "#44AFDD" }}
                              >
                                {item.CertNo}
                              </Text>
                            </View>
                            <View
                              style={{ flexDirection: "row", marginBottom: 2 }}
                            >
                              <Text style={{ fontWeight: "600" }}>
                                Trình trạng pháp lý:{" "}
                              </Text>
                              <Text>{item.LegalStateText}</Text>
                            </View>
                            <View style={styles.Item}>
                              <View
                                style={{
                                  flex: 1.5,
                                  marginBottom: 3,
                                  flexDirection: "row",
                                }}
                              >
                                <Text style={{ fontWeight: "600" }}>
                                  Tài liệu riêng:{" "}
                                </Text>
                              </View>
                              <View style={{ flex: 3.5 }}>
                                {item.Files.map((data, index1) => {
                                  return (
                                    <TouchableOpacity
                                      style={{
                                        borderBottomWidth: 1,
                                        borderBottomColor: "#44AFDD",
                                        marginBottom: 5,
                                      }}
                                      key={index1.toString()}
                                      onPress={() => {
                                        if (!this.checkIsNotImage(data)) {
                                          //this.btn_GetImageByECMID(data);
                                          this.setState({
                                            SelectedFullScreen: data,
                                          });
                                        } else {
                                          this.props.navigation.navigate(
                                            "PDFView",
                                            {
                                              AttachmentID: data.AttachmentID,
                                              ECMItemID: data.ECMItemID,
                                              FileName: data.FileName,
                                              Title:
                                                "Tài liệu riêng của tài sản",
                                            }
                                          );
                                        }
                                      }}
                                    >
                                      <Text style={{ color: "#44AFDD" }}>
                                        {data.DocumentName}
                                      </Text>
                                    </TouchableOpacity>
                                  );
                                })}
                              </View>
                            </View>
                            <TouchableOpacity
                              style={{
                                flexDirection: "row",
                                marginBottom: 2,
                                alignItems: "center",
                              }}
                              onPress={() => {
                                console.log(123, item.MortgageAssetID);

                                this.props.navigation.navigate(
                                  "BatchREImagesScr",
                                  {
                                    STT: index + 1,
                                    CertNo: item.CertNo,
                                    MortgageAssetID: item.MortgageAssetID,
                                    ProcessValuationDocumentID:
                                      pvd.ProcessValuationDocumentID,
                                  }
                                );
                              }}
                            >
                              <FontAwesome5
                                name="camera"
                                size={20}
                                color="#AE55E6"
                              />
                              <Text
                                style={{
                                  marginTop: 2,
                                  fontSize: 15,
                                  fontWeight: "800",
                                  color: "#AE55E6",
                                }}
                              >
                                {"  "}Chụp ảnh
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            </View>

            <View
              style={{
                marginVertical: 15,
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              {pvd.Status == Enums.ProcessValuationDocument.KhaoSatHienTrang ? (
                <>
                  <TouchableOpacity
                    style={{
                      marginLeft: 10,
                      justifyContent: "flex-end",
                      alignItems: "flex-end",
                    }}
                    onPress={() => {
                      this.btn_Attachment();
                    }}
                  >
                    <LinearGradient
                      colors={SMX.BtnColor}
                      style={{
                        width: width / 4 + 48,
                        height: 40,
                        backgroundColor: "#007AFF",
                        borderRadius: 5,
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                      }}
                    >
                      <FontAwesome5
                        name="check-circle"
                        size={18}
                        color="#FFFFFF"
                      />
                      <Text
                        style={{
                          color: "#FFFFFF",
                          fontSize: 15,
                          marginLeft: 8,
                        }}
                      >
                        Tải lên BB KSHT
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      marginLeft: 10,
                      justifyContent: "flex-end",
                      alignItems: "flex-end",
                    }}
                    onPress={() => {
                      this.btn_Done();
                    }}
                  >
                    <LinearGradient
                      colors={SMX.BtnColor}
                      style={{
                        width: width / 4 + 20,
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
                        style={{
                          color: "#FFFFFF",
                          fontSize: 15,
                          marginLeft: 8,
                        }}
                      >
                        Hoàn thành
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </>
              ) : undefined}
              {pvd.Status == Enums.ProcessValuationDocument.KiemTraHoSo ? (
                <>
                  <TouchableOpacity
                    style={{
                      marginLeft: 10,
                      justifyContent: "flex-end",
                      alignItems: "flex-end",
                    }}
                    onPress={() => {
                      this.btn_CheckIn();
                    }}
                  >
                    <LinearGradient
                      colors={SMX.BtnColor}
                      style={{
                        width: width / 2 - 15,
                        height: 40,
                        backgroundColor: "#007AFF",
                        borderRadius: 5,
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                      }}
                    >
                      <FontAwesome5
                        name="check-circle"
                        size={18}
                        color="#FFFFFF"
                      />
                      <Text
                        style={{
                          color: "#FFFFFF",
                          fontSize: 15,
                          marginLeft: 8,
                        }}
                      >
                        Check In & Chụp ảnh
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      marginLeft: 10,
                      justifyContent: "flex-end",
                      alignItems: "flex-end",
                    }}
                    onPress={() => {
                      this.btn_Save(Enums.SaveType.Completed, true);
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
                        style={{
                          color: "#FFFFFF",
                          fontSize: 15,
                          marginLeft: 8,
                        }}
                      >
                        Lưu
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </>
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
    marginTop: 2,
  },
});
