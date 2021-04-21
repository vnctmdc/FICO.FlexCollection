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
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
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
import ActionMobileDto from "../../../DtoParams/ActionMobileDto";

import ProcessValuation from "../../../Entities/ProcessValuation";
import ProcessValuationDocument from "../../../Entities/ProcessValuationDocument";
import ProcessValuationEquipment from "../../../Entities/ProcessValuationEquipment";
import ProcessValuationREConstruction from "../../../Entities/ProcessValuationREConstruction";
import PopupModalUpdateNote from "../../../components/PopupModalUpdateNote";
import PopUpModalViolet from "../../../components/PopUpModalViolet";
import ProcessValuationRE from "../../../Entities/ProcessValuationRE";
//import Utility from "../../../Utils/Utility";
import MarkerObject from "../../../SharedEntity/MarkerObject";
import * as Location from "expo-location";
import * as Enums from "../../../../src/constants/Enums";
import ProcessValuationREApartment from "../../../Entities/ProcessValuationREApartment";
const { width, height } = Dimensions.get("window");
interface iProps {
  navigation: any;
  route: any;
  GlobalStore: GlobalStore;
}
interface iState {
  ProcessValuationDocumentID?: number;
  showCustomerInfo: boolean;
  showInfo: boolean;
  CheckSaveFalse: boolean;
  ProcessValuationDocument?: ProcessValuationDocument;
  SelectedFrontageType?: number;
  //DistanceToMainStreet?: number;
  ContiguousStreetType?: number;
  InfactLandAreaPrivate?: string;
  LaneWidthMin?: string;
  LaneWidthMax?: string;
  DistanceToMainStreet: string;
  SelectedContiguousStreetType?: number;
  LstContiguousStreetType?: SystemParameter[];
  location?: MarkerObject;
  MortgageAssetID?: number;
  Customer?: string;
  InfactAddress?: string;
  WorkfieldOtherInformation?: string;
}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class REResidentialSrc extends React.Component<iProps, any> {
  constructor(props: iProps) {
    super(props);
    this.state = {
      showCustomerInfo: true,
      showInfo: false,
      CheckSaveFalse: false,
      ProcessValuationDocument: new ProcessValuationDocument(),
      ProcessValuationRE: new ProcessValuationRE(),
      ProcessValuation: new ProcessValuation(),
      WorkfieldDistance: "",
      WorkfieldOtherInformation: "",
      LstContiguousStreetType: [],
      InfactLandAreaPrivate: "",
      LaneWidthMin: "",
      LaneWidthMax: "",
      DistanceToMainStreet: "",
      Advantage: "",
      DisAdvantage: "",
    };
  }
  async componentDidMount() {
    await this.SetupForm();
    await this.LoadData();
  }
  async SetupForm() {
    try {
      var req = new ActionMobileDto();
      req.MACode2 = SMX.MortgageAssetCode2.REResidentials;
      req.ProcessValuationDocumentID = this.props.route.params.ProcessValuationDocumentID;
      let res = await HttpUtils.post<ActionMobileDto>(
        ApiUrl.Action_Execute,
        SMX.ApiActionCode.SetupFormRE,
        JSON.stringify(req)
      );
      if (res)
        this.setState({
          LstContiguousStreetType: res!.LstContiguousStreetType,
        });
    } catch (ex) {
      this.props.GlobalStore.Exception = ex;
      this.props.GlobalStore.HideLoading();
    }
  }
  async LoadData() {
    try {
      this.props.GlobalStore.ShowLoading();
      var req = new ActionMobileDto();
      req.MACode2 = SMX.MortgageAssetCode2.REResidentials;
      req.ProcessValuationDocumentID = this.props.route.params.ProcessValuationDocumentID;

      let res = await HttpUtils.post<ActionMobileDto>(
        ApiUrl.Action_Execute,
        SMX.ApiActionCode.LoadData,
        JSON.stringify(req)
      );
      if (res) {
        this.setState({
          ProcessValuationRE: res!.ProcessValuationRE,
          ProcessValuation: res!.ProcessValuation,
          WorkfieldDistance: res!.ProcessValuationRE.WorkfieldDistance
            ? res!.ProcessValuationRE.WorkfieldDistance + ""
            : "",
          InfactLandAreaPrivate: res!.ProcessValuationRE.InfactLandAreaPrivate
            ? res.ProcessValuationRE.InfactLandAreaPrivate + ""
            : "",
          LaneWidthMin: res!.ProcessValuationRE.LaneWidthMin
            ? res.ProcessValuationRE.LaneWidthMin + ""
            : "",
          LaneWidthMax: res!.ProcessValuationRE.LaneWidthMax
            ? res.ProcessValuationRE.LaneWidthMax + ""
            : "",
          DistanceToMainStreet: res!.ProcessValuationRE.DistanceToMainStreet
            ? res.ProcessValuationRE.DistanceToMainStreet + ""
            : "",
          Advantage: res!.ProcessValuation.Advantage,
          DisAdvantage: res!.ProcessValuation.DisAdvantage,
          WorkfieldOtherInfomation: res!.ProcessValuationRE
            .WorkfieldOtherInfomation,
          SelectedFrontageType: res!.ProcessValuationRE.FrontageType,
        });
      }
      console.log("Hihi ProcessValuationRE", this.state.ProcessValuationRE);

      this.props.GlobalStore.HideLoading();
    } catch (ex) {
      this.props.GlobalStore.Exception = ex;
      this.props.GlobalStore.HideLoading();
    }
  }
  async ShowDistance() {
    if (
      this.state.SelectedFrontageType ==
        Enums.ProcessValuationREFrontageType.MatDuongPho ||
      this.state.SelectedFrontageType ==
        Enums.ProcessValuationREFrontageType.MatDuongNoiBo
    ) {
      this.setState({
        showInfo: true,
      });
    } else {
      this.setState({
        showInfo: false,
      });
    }
  }
  async getLocationAsync() {
    let location = await Location.getCurrentPositionAsync({});
    this.setState({
      location: new MarkerObject(
        1,
        location.coords.latitude,
        location.coords.longitude,
        "Vị trí hiện tại"
      ),
    });
  }
  async btn_CheckIn() {
    try {
      this.props.GlobalStore.ShowLoading();
      if (
        !this.state.InfactLandAreaPrivate ||
        this.state.InfactLandAreaPrivate == ""
      ) {
        this.props.GlobalStore.HideLoading();
        let message = "[Diện tích thực tế] Không được để trống";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }
      if (
        !this.state.ProcessValuationRE.FrontageType ||
        Utility.GetDecimalString(this.state.ProcessValuationRE.FrontageType) ==
          ""
      ) {
        this.props.GlobalStore.HideLoading();
        let message = "[Mặt tiền tiếp giáp] Không được để trống";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }
      if (
        this.state.ProcessValuationRE.FrontageType ==
          Enums.ProcessValuationREFrontageType.MatNgoHem ||
        this.state.ProcessValuationRE.FrontageType ==
          Enums.ProcessValuationREFrontageType.MatDuongNoiBo
      ) {
        if (!this.state.LaneWidthMin || this.state.LaneWidthMin == "") {
          this.props.GlobalStore.HideLoading();
          let message =
            "[Độ rộng mặt ngõ/hẻm/đường nội bộ nhỏ nhất (m)] Không được để trống";
          this.props.GlobalStore.Exception = ClientMessage(message);
          return;
        }
        if (!this.state.LaneWidthMax || this.state.LaneWidthMax == "") {
          this.props.GlobalStore.HideLoading();
          let message =
            "[Độ rộng mặt ngõ/hẻm/đường nội bộ lớn nhất (m)] Không được để trống";
          this.props.GlobalStore.Exception = ClientMessage(message);
          return;
        }
      }
      if (
        !this.state.DistanceToMainStreet ||
        this.state.DistanceToMainStreet == ""
      ) {
        this.props.GlobalStore.HideLoading();
        let message =
          "[Khoảng cách đến mặt đường chính (m)] Không được để trống";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }
      if (
        !this.state.ProcessValuationRE.ContiguousStreetType ||
        Utility.GetDecimalString(
          this.state.ProcessValuationRE.ContiguousStreetType
        ) == ""
      ) {
        this.props.GlobalStore.HideLoading();
        let message = "[Loại đường tiếp giáp] Không được để trống";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }
      if (!this.state.Advantage || this.state.Advantage == "") {
        this.props.GlobalStore.HideLoading();
        let message = "[Những yếu tố thuận lợi] Không được để trống";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }
      if (!this.state.DisAdvantage || this.state.DisAdvantage == "") {
        this.props.GlobalStore.HideLoading();
        let message = "[Những yếu tố không thuận lợi] Không được để trống";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }
      if (
        !this.state.ProcessValuationRE.PositionDescription ||
        this.state.ProcessValuationRE.PositionDescription == ""
      ) {
        this.props.GlobalStore.HideLoading();
        let message = "[Mô tả vị trí] Không được để trống";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }
      await this.getLocationAsync();
      if (this.state.location == undefined || this.state.location == null) {
        this.props.GlobalStore.HideLoading();
        let message =
          "Không lấy được vị trí hiện tại, vui lòng bật Permission để lấy tọa độ";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }
      await this.btn_Save(Enums.SaveType.Completed);
      var req = new ActionMobileDto();
      req.MACode2 = SMX.MortgageAssetCode2.REResidentials;
      req.SaveType = Enums.SaveType.Completed;
      //var item = this.state.ProcessValuationDocument;
      let pvd = new ProcessValuationDocument();
      let pv = this.state.ProcessValuation;
      let pvRE = this.state.ProcessValuationRE;

      // Đổ dữ liệu vào pv
      pv.ProcessValuationID = pvRE.ProcessValuationID;
      pv.CoordinateLat = this.state.location.Latitude.toString();

      pv.CoordinateLon = this.state.location.Longitude.toString();
      pv.Coordinate = `${this.state.location.Latitude.toString()},${this.state.location.Longitude.toString()}`;

      pvd.ProcessValuationDocumentID = this.props.route.params.ProcessValuationDocumentID;
      //pvd.Version = pvRE.PVDVersion;
      pvd.Status = Enums.ProcessValuationDocument.KhaoSatHienTrang;

      req.ProcessValuationDocument = pvd;
      req.ProcessValuation = pv;

      let res = await HttpUtils.post<ActionMobileDto>(
        ApiUrl.Action_Execute,
        SMX.ApiActionCode.CheckIn,
        JSON.stringify(req)
      );
      this.props.GlobalStore.HideLoading();
      this.props.navigation.navigate("REResidentialImagesSrc", {
        ProcessValuationDocumentID: pvRE.ProcessValuationDocumentID,
        MortgageAssetID: pvRE.MortgageAssetID,
        CustomerName: pvRE.CustomerName,
        InfactAddress: pvRE.InfactAddress,
      });
    } catch (ex) {
      this.props.GlobalStore.Exception = ex;
      this.props.GlobalStore.HideLoading();
    }
  }
  frontageTypeDetail(idFrontage) {
    if (
      idFrontage == Enums.ProcessValuationREFrontageType.MatNgoHem ||
      idFrontage == Enums.ProcessValuationREFrontageType.MatDuongNoiBo
    ) {
      this.setState({
        ShowFontTypeDetail: true,
      });
    } else {
      this.setState({
        ShowFontTypeDetail: false,
      });
    }
  }
  async btn_Save(saveType: number) {
    try {
      this.props.GlobalStore.ShowLoading();
      let req = new ActionMobileDto();
      let pvD = this.state.ProcessValuationDocument;
      let pvRE = this.state.ProcessValuationRE;
      let pv = this.state.ProcessValuation;
      //Kiểm tra lỗi nhập liệu
      if (saveType == Enums.SaveType.Completed) {
        if (
          !this.state.InfactLandAreaPrivate ||
          this.state.InfactLandAreaPrivate == ""
        ) {
          this.props.GlobalStore.HideLoading();
          let message = "[Diện tích thực tế] Không được để trống";
          this.props.GlobalStore.Exception = ClientMessage(message);
          return;
        }
        if (
          !this.state.ProcessValuationRE.FrontageType ||
          Utility.GetDecimalString(
            this.state.ProcessValuationRE.FrontageType
          ) == ""
        ) {
          this.props.GlobalStore.HideLoading();
          let message = "[Mặt tiền tiếp giáp] Không được để trống";
          this.props.GlobalStore.Exception = ClientMessage(message);
          return;
        }
        if (
          this.state.ProcessValuationRE.FrontageType ==
            Enums.ProcessValuationREFrontageType.MatNgoHem ||
          this.state.ProcessValuationRE.FrontageType ==
            Enums.ProcessValuationREFrontageType.MatDuongNoiBo
        ) {
          if (!this.state.LaneWidthMin || this.state.LaneWidthMin == "") {
            this.props.GlobalStore.HideLoading();
            let message =
              "[Độ rộng mặt ngõ/hẻm/đường nội bộ nhỏ nhất (m)] Không được để trống";
            this.props.GlobalStore.Exception = ClientMessage(message);
            return;
          }
          if (!this.state.LaneWidthMax || this.state.LaneWidthMax == "") {
            this.props.GlobalStore.HideLoading();
            let message =
              "[Độ rộng mặt ngõ/hẻm/đường nội bộ lớn nhất (m)] Không được để trống";
            this.props.GlobalStore.Exception = ClientMessage(message);
            return;
          }
        }
        if (
          !this.state.DistanceToMainStreet ||
          this.state.DistanceToMainStreet == ""
        ) {
          this.props.GlobalStore.HideLoading();
          let message =
            "[Khoảng cách đến mặt đường chính (m)] Không được để trống";
          this.props.GlobalStore.Exception = ClientMessage(message);
          return;
        }
        if (
          !this.state.ProcessValuationRE.ContiguousStreetType ||
          Utility.GetDecimalString(
            this.state.ProcessValuationRE.ContiguousStreetType
          ) == ""
        ) {
          this.props.GlobalStore.HideLoading();
          let message = "[Loại đường tiếp giáp] Không được để trống";
          this.props.GlobalStore.Exception = ClientMessage(message);
          return;
        }
        if (!this.state.Advantage || this.state.Advantage == "") {
          this.props.GlobalStore.HideLoading();
          let message = "[Những yếu tố thuận lợi] Không được để trống";
          this.props.GlobalStore.Exception = ClientMessage(message);
          return;
        }
        if (!this.state.DisAdvantage || this.state.DisAdvantage == "") {
          this.props.GlobalStore.HideLoading();
          let message = "[Những yếu tố không thuận lợi] Không được để trống";
          this.props.GlobalStore.Exception = ClientMessage(message);
          return;
        }
        if (
          !this.state.ProcessValuationRE.PositionDescription ||
          this.state.ProcessValuationRE.PositionDescription == ""
        ) {
          this.props.GlobalStore.HideLoading();
          let message = "[Mô tả vị trí] Không được để trống";
          this.props.GlobalStore.Exception = ClientMessage(message);
          return;
        }
      }
      var numInfactLandAreaPrivate = this.state.InfactLandAreaPrivate;
      var numLaneWidthMin = this.state.LaneWidthMin;
      var numLaneWidthMax = this.state.LaneWidthMax;
      var numDistanceToMainStreet = this.state.DistanceToMainStreet;
      var stringAdvantage = this.state.Advantage;
      var stringDisAdvantage = this.state.DisAdvantage;
      var numWorkfieldDistance = this.state.WorkfieldDistance;

      // Đổ dữ liệu vào pvRE
      pvRE.ProcessValuationREID = this.state.ProcessValuationRE.ProcessValuationREID;
      pvRE.ProcessValuationDocumentID = this.state.ProcessValuationRE.ProcessValuationDocumentID;
      pvRE.Version = this.state.ProcessValuationRE.Version;
      pvRE.FrontageType = this.state.ProcessValuationRE.FrontageType;
      pvRE.InfactLandAreaPrivate =
        numInfactLandAreaPrivate && numInfactLandAreaPrivate.length != 0
          ? parseFloat(numInfactLandAreaPrivate.split(",").join("."))
          : undefined;
      pvRE.LaneWidthMin =
        numLaneWidthMin && numLaneWidthMin.length != 0
          ? parseFloat(numLaneWidthMin.split(",").join("."))
          : undefined;
      pvRE.LaneWidthMax =
        numLaneWidthMax && numLaneWidthMax.length != 0
          ? parseFloat(numLaneWidthMax.split(",").join("."))
          : undefined;
      pvRE.DistanceToMainStreet =
        numDistanceToMainStreet && numDistanceToMainStreet.length != 0
          ? parseFloat(numDistanceToMainStreet.split(",").join("."))
          : undefined;
      // pvRE.LaneWidthMin = this.state.ProcessValuationRE.LaneWidthMin;
      // pvRE.LaneWidthMax = this.state.ProcessValuationRE.LaneWidthMax;
      // pvRE.DistanceToMainStreet = this.state.ProcessValuationRE.DistanceToMainStreet;
      pvRE.ContiguousStreetType = this.state.ProcessValuationRE.ContiguousStreetType;
      pvRE.PositionDescription =
        this.state.ProcessValuationRE.PositionDescription +
        ";" +
        this.state.ProcessValuationRE.OnLandDescription;
      //pvRE.InfactLandAreaPrivate = this.state.ProcessValuationRE.InfactLandAreaPrivate;
      pvRE.OnLandDescription = this.state.ProcessValuationRE.OnLandDescription;

      // Đổ dữ liệu vào pvD

      pvD.ProcessValuationDocumentID = this.props.route.params.ProcessValuationDocumentID;
      pvD.Version = this.state.ProcessValuationRE.PVDVersion;
      pvD.WorkfieldDistance =
        numWorkfieldDistance && numWorkfieldDistance.length != 0
          ? parseFloat(numWorkfieldDistance.split(",").join("."))
          : undefined;

      // Đổ dữ liệu vào pv

      pv.ProcessValuationID = this.state.ProcessValuationRE.ProcessValuationID;
      pv.Version = this.state.ProcessValuationRE.PVVersion;
      pv.Advantage = stringAdvantage;
      pv.DisAdvantage = stringDisAdvantage;
      pv.WorkfieldOtherInfomation = this.state.WorkfieldOtherInfomation;

      //Đổ dữ liệu cvafo req
      req.MACode2 = SMX.MortgageAssetCode2.REResidentials;
      req.ProcessValuationDocument = pvD;
      req.ProcessValuation = pv;
      req.ProcessValuationRE = pvRE;
      req.SaveType = saveType;
      let res = await HttpUtils.post<ActionMobileDto>(
        ApiUrl.Action_Execute,
        SMX.ApiActionCode.SaveActions,
        JSON.stringify(req)
      );
      if (res) {
        this.setState({
          // ProcessValuationRE: res!.ProcessValuationRE!,
          // ProcessValuation: res!.ProcessValuation,
          // WorkfieldDistance: res!.ProcessValuationRE.WorkfieldDistance + "",
        });
      }
      this.props.GlobalStore.HideLoading();
      if (saveType == Enums.SaveType.Completed) {
        let mess = "Lưu thông tin thành công!";
        this.props.GlobalStore.Exception = ClientMessage(mess);
      }
    } catch (ex) {
      this.props.GlobalStore.Exception = ex;
      this.props.GlobalStore.HideLoading();
    }
  }

  async btn_SaveTemporary(
    pvdID: number,
    maID: number,
    customerName: string,
    address: string
  ) {
    await this.btn_Save(Enums.SaveType.Temporary);
    this.props.navigation.navigate("REResidentialImagesSrc", {
      ProcessValuationDocumentID: pvdID,
      MortgageAssetID: maID,
      CustomerName: customerName,
      InfactAddress: address,
    });
  }

  render() {
    let pvRE = this.state.ProcessValuationRE;
    let pvD = this.state.ProcessValuationDocument;
    let pv = this.state.ProcessValuation;
    let pvREC = this.state.ProcessValuationREConstruction;
    return (
      <View style={{ height: height, backgroundColor: "#FFF" }}>
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
                flex: 3,
                marginTop: 10,
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                  marginRight: 15,
                  paddingLeft: 130,
                }}
                onPress={() => {
                  this.props.navigation.navigate("KhaoSatHienTrangScr", {
                    ProcessValuationDocumentID: pvRE.ProcessValuationDocumentID,
                  });
                }}
              >
                <LinearGradient
                  colors={SMX.BtnColor}
                  style={{
                    width: width / 3 - 10,
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
                    Hồ sơ TS
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                  paddingLeft: 7,
                }}
                onPress={() => {
                  this.btn_SaveTemporary(
                    pvRE.ProcessValuationDocumentID,
                    pvRE.MortgageAssetID,
                    pvRE.CustomerName,
                    pvRE.InfactAddress
                  );
                }}
              >
                <LinearGradient
                  colors={SMX.BtnColor}
                  style={{
                    width: width / 3 - 10,
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
                    Hình ảnh TS
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <View style={Theme.ViewGeneral}>
              <View style={Theme.ViewTitle}>
                <Text
                  style={{ fontSize: 15, fontWeight: "bold", color: "#FFFFFF" }}
                >
                  I. THÔNG TIN KHÁCH HÀNG
                </Text>
              </View>
            </View>
            <View>
              <View style={Theme.ViewContent}>
                <View style={styles.Item}>
                  <View style={{ flex: 5, flexDirection: "row" }}>
                    <Text style={{ flex: 2 }}>Tên KH: </Text>
                    <Text style={{ flex: 3, fontWeight: "600" }}>
                      {pvRE.CustomerName}
                    </Text>
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
                  <View style={{ flex: 5, flexDirection: "row" }}>
                    <Text style={{ flex: 2 }}>Địa chỉ trên GCN: </Text>
                    <Text style={{ flex: 3, fontWeight: "600" }}>
                      {pvRE.InfactAddress}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={Theme.ViewGeneral}>
              <View style={Theme.ViewTitle}>
                <Text
                  style={{ fontSize: 15, fontWeight: "bold", color: "#FFFFFF" }}
                >
                  II. THÔNG TIN KHẢO SÁT
                </Text>
              </View>
              <View style={Theme.ViewContent}>
                <View style={styles.ItemKS}>
                  <View style={{ flex: 1 }}>
                    <Text>Khoảng cách đi thẩm định (km) </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <TextInput
                      keyboardType={"numeric"}
                      multiline={false}
                      maxLength={15}
                      value={this.state.WorkfieldDistance}
                      style={[Theme.TextInput]}
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
                <View style={styles.ItemKS}>
                  <View
                    style={{ flex: 1, marginBottom: 3, flexDirection: "row" }}
                  >
                    <Text>
                      Diện tích thực tế (m2){" "}
                      <Text style={{ color: "red" }}>*</Text>{" "}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <TextInput
                      keyboardType={"numeric"}
                      multiline={false}
                      maxLength={15}
                      value={this.state.InfactLandAreaPrivate}
                      style={[Theme.TextInput]}
                      onChangeText={(val) => {
                        this.setState({ InfactLandAreaPrivate: val });
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
                <View style={styles.ItemKS}>
                  <View
                    style={{ flex: 1, marginBottom: 3, flexDirection: "row" }}
                  >
                    <Text>
                      Mặt tiền tiếp giáp (m2){" "}
                      <Text style={{ color: "red" }}>*</Text>
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <DropDownBox
                      TextField="Value"
                      ValueField="Key"
                      DataSource={
                        SMX.ProcessValuationREFrontageType
                          .dicProcessValuationREFrontageType
                      }
                      SelectedValue={pvRE.FrontageType}
                      OnSelectedItemChanged={(val) => {
                        pvRE.FrontageType = val.Key;
                        this.setState({ ProcessValuationRE: pvRE });
                        this.frontageTypeDetail(val.Key);
                      }}
                    ></DropDownBox>
                  </View>
                </View>
                <View>
                  <View
                    style={{
                      display: this.state.ShowFontTypeDetail ? "flex" : "none",
                    }}
                  >
                    <View
                      style={{
                        height: 1,
                        backgroundColor: "#F0F0F4",
                        marginVertical: 8,
                      }}
                    ></View>
                    <View style={styles.ItemKS}>
                      <View style={{ flex: 1, flexDirection: "row" }}>
                        <Text>
                          Độ rộng mặt ngõ/hẻm/đường nội bộ nhỏ nhất (m){" "}
                          <Text style={{ color: "red" }}>*</Text>
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <TextInput
                          keyboardType={"numeric"}
                          multiline={false}
                          maxLength={15}
                          value={this.state.LaneWidthMin}
                          style={[Theme.TextInput]}
                          onChangeText={(val) => {
                            this.setState({ LaneWidthMin: val });
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
                    <View style={styles.ItemKS}>
                      <View style={{ flex: 1, flexDirection: "row" }}>
                        <Text>
                          Độ rộng mặt ngõ/hẻm/đường nội bộ lớn nhất (m){" "}
                          <Text style={{ color: "red" }}>*</Text>
                        </Text>
                        <Text style={{ color: "red" }}>*</Text>
                      </View>

                      <View style={{ flex: 1 }}>
                        <TextInput
                          keyboardType={"numeric"}
                          multiline={false}
                          maxLength={15}
                          value={this.state.LaneWidthMax}
                          style={[Theme.TextInput]}
                          onChangeText={(val) => {
                            this.setState({ LaneWidthMax: val });
                          }}
                        />
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      height: 1,
                      backgroundColor: "#F0F0F4",
                      marginVertical: 8,
                    }}
                  ></View>
                  <View style={styles.ItemKS}>
                    <View style={{ flex: 1, flexDirection: "row" }}>
                      <Text>
                        Khoảng cách đến mặt đường chính (m){" "}
                        <Text style={{ color: "red" }}>*</Text>
                      </Text>
                      <Text style={{ color: "red" }}>*</Text>
                    </View>

                    <View style={{ flex: 1 }}>
                      <TextInput
                        keyboardType={"numeric"}
                        multiline={false}
                        maxLength={15}
                        value={this.state.DistanceToMainStreet}
                        style={[Theme.TextInput]}
                        onChangeText={(val) => {
                          this.setState({ DistanceToMainStreet: val });
                        }}
                      />
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    height: 1,
                    backgroundColor: "#F0F0F4",
                    marginVertical: 8,
                  }}
                ></View>
                <View style={styles.ItemKS}>
                  <View
                    style={{ flex: 1, marginBottom: 3, flexDirection: "row" }}
                  >
                    <Text>
                      Loại đường tiếp giáp{" "}
                      <Text style={{ color: "red" }}>*</Text>
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <DropDownBox
                      TextField="Name"
                      ValueField="SystemParameterID"
                      DataSource={this.state.LstContiguousStreetType}
                      SelectedValue={pvRE.ContiguousStreetType}
                      OnSelectedItemChanged={(val) => {
                        pvRE.ContiguousStreetType = val.SystemParameterID;
                        this.setState({ ProcessValuationRE: pvRE });
                      }}
                    ></DropDownBox>
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
                  <View style={{ marginBottom: 3, flexDirection: "row" }}>
                    <Text>
                      Những yếu tố thuận lợi{" "}
                      <Text style={{ color: "red" }}>*</Text>
                    </Text>
                  </View>
                  <View>
                    <TextInput
                      numberOfLines={4}
                      multiline={true}
                      textAlignVertical="top"
                      style={[Theme.TextView, { height: 75 }]}
                      value={this.state.Advantage}
                      onChangeText={(val) => {
                        this.setState({ Advantage: val });
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
                  <View style={{ marginBottom: 3, flexDirection: "row" }}>
                    <Text>
                      Những yếu tố không thuận lợi{" "}
                      <Text style={{ color: "red" }}>*</Text>
                    </Text>
                  </View>
                  <View>
                    <TextInput
                      multiline={false}
                      style={[Theme.TextView, {}]}
                      value={this.state.DisAdvantage}
                      onChangeText={(val) => {
                        this.setState({ DisAdvantage: val });
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
                  <View style={{ flexDirection: "row" }}>
                    <Text>Mô tả tài sản trên đất </Text>
                    {/* <Text style={{ color: 'red' }}>*</Text> */}
                  </View>
                  <View>
                    <TextInput
                      multiline={false}
                      style={[Theme.TextView, {}]}
                      value={pvRE.OnLandDescription}
                      onChangeText={(val) => {
                        pvRE.OnLandDescription = val;
                        this.setState({ ProcessValuationRE: pvRE });
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
                  <View style={{ flexDirection: "row" }}>
                    <Text>
                      Mô tả vị trí <Text style={{ color: "red" }}>*</Text>
                    </Text>
                  </View>
                  <View>
                    <TextInput
                      multiline={false}
                      style={[Theme.TextView, {}]}
                      value={pvRE.PositionDescription}
                      onChangeText={(val) => {
                        pvRE.PositionDescription = val;
                        this.setState({ ProcessValuationRE: pvRE });
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
                  <View style={styles.Item}>
                    <View style={{ flex: 2, flexDirection: "row" }}>
                      <Text>Thông tin lưu ý </Text>
                      {/* <Text style={{ color: 'red' }}>*</Text> */}
                    </View>
                  </View>
                  <View style={{ flex: 3 }}>
                    <TextInput
                      multiline={false}
                      style={[Theme.TextView, {}]}
                      value={this.state.WorkfieldOtherInfomation}
                      onChangeText={(val) => {
                        this.setState({ WorkfieldOtherInfomation: val });
                      }}
                    />
                  </View>
                </View>
                <View
                  style={{
                    marginVertical: 15,
                    justifyContent: "center",
                    flexDirection: "row",
                  }}
                ></View>
              </View>
            </View>
            <View
              style={{
                marginVertical: 15,
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              {pvRE.PVDStatus == Enums.ProcessValuationDocument.KiemTraHoSo ? (
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
                      width: width / 4 + 8,
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
                      style={{ color: "#FFFFFF", fontSize: 15, marginLeft: 8 }}
                    >
                      Check In
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              ) : undefined}
              <TouchableOpacity
                style={{
                  marginLeft: 10,
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                }}
                onPress={() => {
                  this.btn_Save(Enums.SaveType.Completed);
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
            </View>
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
  ItemKS: { flex: 2, flexDirection: "row", marginTop: 2 },

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
  ItemDelete: {
    borderWidth: 1,
    borderColor: "#99b4d1",
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 7,
    marginTop: 10,
  },
  TinyImage: {
    flex: 1,
    width: 150,
    height: 150,
  },
});
