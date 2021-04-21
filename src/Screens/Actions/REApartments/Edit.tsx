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
  ProcessValuation?: ProcessValuation;
  //ProcessValuationDocument?: ProcessValuationDocument;
  ProcessValuationDocument?: ProcessValuationDocument;
  WorkfieldDistance?: string;
  Type?: string;
  Specification?: string;
  Description?: string;
  ProcessValuationEquipment?: ProcessValuationEquipment;
  FontMoney?: number;
  TransformerType?: number;
  ActualArea?: string;
  Advantage?: string;
  DisAdvantage?: string;
  InfactLandAreaCommon?: string;
  LaneWidthMin?: string;
  LaneWidthMax?: string;
  InfactFloorArea?: string;
  InfactFloorAreaREApart?: string;
  LaneWidthMinREApart?: string;
  LaneWidthMaxREApart?: string;
  DistanceToMainStreetApart?: string;
  TypeOfConstruction?: string;
  InformationNote?: string;
  numContructiontype?: number;
  numFontageType?: number;
  numContiguousStreetType?: number;
  numInfactFloorArea?: number;
  // showConfirmEdit: boolean;
  // showConfirmAddNew: boolean;
  showPopUpRoomAddNew: boolean;
  showPopUpRoomEdit: boolean;
  CheckSaveFalse: boolean;
  showPopUpPrivateLandAddNew: boolean;
  showPopUpPrivateLandEdit: boolean;
  ProcessValuationRE?: ProcessValuationRE;
  Show1: boolean;
  ShowFontTypeDetail: boolean;
  Views: any;
  LstBuildingType?: SystemParameter[];
  LstContiguousStreetType?: SystemParameter[];
  LstConstructionType?: SystemParameter[];
  ListProcessValuationREConstruction?: ProcessValuationREConstruction[];
  ListProcessValuationREApartment?: ProcessValuationREApartment[];
  ProcessValuationREConstruction?: ProcessValuationREConstruction;
  ProcessValuationREApartment?: ProcessValuationREApartment;
  tempLstCon?: ProcessValuationREConstruction[];
  tempLstApart?: ProcessValuationREApartment[];
  tempCon?: ProcessValuationREConstruction;
  tempApart?: ProcessValuationREApartment;

  location?: MarkerObject;
}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class ReApartmentsSrc extends Component<iProps, iState> {
  constructor(props: any) {
    super(props);
    this.state = {
      showCustomerInfo: true,
      ProcessValuation: new ProcessValuation(),
      ProcessValuationDocument: new ProcessValuationDocument(),
      ProcessValuationREConstruction: new ProcessValuationREConstruction(),
      ProcessValuationREApartment: new ProcessValuationREApartment(),
      tempCon: new ProcessValuationREConstruction(),
      tempApart: new ProcessValuationREApartment(),
      WorkfieldDistance: "",
      InfactLandAreaCommon: "",
      LaneWidthMin: "",
      LaneWidthMax: "",
      InfactFloorArea: "",
      InfactFloorAreaREApart: "",
      LaneWidthMinREApart: "",
      LaneWidthMaxREApart: "",
      DistanceToMainStreetApart: "",
      Type: "",
      Specification: "",
      Description: "",
      FontMoney: 1,
      numContructiontype: 1,
      numFontageType: 1,
      numContiguousStreetType: 1,
      numInfactFloorArea: 1,
      ActualArea: "300.00",
      Advantage: "Những yếu tố thuận lợi *",
      DisAdvantage: "Những yếu tố không thuận lợi *",
      TypeOfConstruction: "",
      InformationNote: "Lưu ý",
      Show1: false,
      // showConfirmAddNew: false,
      // showConfirmEdit: false,
      ShowFontTypeDetail: true,
      Views: [],
      showPopUpRoomAddNew: false,
      showPopUpRoomEdit: false,
      CheckSaveFalse: false,
      showPopUpPrivateLandAddNew: false,
      showPopUpPrivateLandEdit: false,
      ProcessValuationRE: new ProcessValuationRE(),
      ProcessValuationDocumentID: 1,
    };
  }
  async componentDidMount() {
    await this.LoadData();
    await this.showInfromContiguousFrontage(
      this.state.ProcessValuationRE.FrontageType
    );
    this.getLocationAsync();
  }

  async showInfromContiguousFrontage(item: number) {
    try {
      this.props.GlobalStore.ShowLoading();
      if (
        item == Enums.ProcessValuationREFrontageType.MatNgoHem ||
        item == Enums.ProcessValuationREFrontageType.MatDuongNoiBo
      ) {
        this.setState({
          ShowFontTypeDetail: true,
        });
      } else {
        this.setState({
          ShowFontTypeDetail: false,
        });
      }
      this.props.GlobalStore.HideLoading();
    } catch (ex) {
      this.props.GlobalStore.Exception = ex;
      this.props.GlobalStore.HideLoading();
    }
  }

  //#region LoadData, Save, CheckIn, getLocation
  async LoadData() {
    try {
      this.props.GlobalStore.ShowLoading();
      var req = new ActionMobileDto();
      req.MACode2 = SMX.MortgageAssetCode2.REApartments;
      req.ProcessValuationDocumentID = this.props.route.params.ProcessValuationDocumentID;

      let res = await HttpUtils.post<ActionMobileDto>(
        ApiUrl.Action_Execute,
        SMX.ApiActionCode.LoadData,
        JSON.stringify(req)
      );
      //console.log("KOLCK", res);

      if (res) {
        this.setState({
          ProcessValuationRE: res!.ProcessValuationRE,
          ProcessValuationDocumentID: res!.ProcessValuationDocumentID,
          ProcessValuationDocument: res!.ProcessValuationDocument,
          ProcessValuation: res!.ProcessValuation,
          LstContiguousStreetType: res!.LstContiguousStreetType,
          ListProcessValuationREConstruction: res!
            .ListProcessValuationREConstruction,
          ListProcessValuationREApartment: res!.ListProcessValuationREApartment,
          tempLstCon: res!.ListProcessValuationREConstruction,
          tempLstApart: res!.ListProcessValuationREApartment,
          WorkfieldDistance: res!.ProcessValuationRE.WorkfieldDistance
            ? res!.ProcessValuationRE.WorkfieldDistance + ""
            : "",
          InfactLandAreaCommon: res!.ProcessValuationRE.InfactLandAreaCommon
            ? res!.ProcessValuationRE.InfactLandAreaCommon + ""
            : "",
          LaneWidthMin: res!.ProcessValuationRE.LaneWidthMin
            ? res!.ProcessValuationRE.LaneWidthMin + ""
            : "",
          LaneWidthMax: res!.ProcessValuationRE.LaneWidthMax
            ? res!.ProcessValuationRE.LaneWidthMax + ""
            : "",
        });
      }
      this.showInfromContiguousFrontage(
        this.state.ProcessValuationRE.FrontageType
      );
      this.props.GlobalStore.HideLoading();
    } catch (ex) {
      this.props.GlobalStore.Exception = ex;
      this.props.GlobalStore.HideLoading();
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
        !this.state.InfactLandAreaCommon ||
        this.state.InfactLandAreaCommon == ""
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
        !this.state.ProcessValuationRE.DistanceToMainStreet ||
        Utility.GetDecimalString(
          this.state.ProcessValuationRE.DistanceToMainStreet
        ) == ""
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
      if (
        !this.state.ProcessValuation.Advantage ||
        this.state.ProcessValuation.Advantage == ""
      ) {
        this.props.GlobalStore.HideLoading();
        let message = "[Những yếu tố thuận lợi] Không được để trống";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }
      if (
        !this.state.ProcessValuation.DisAdvantage ||
        this.state.ProcessValuation.DisAdvantage == ""
      ) {
        this.props.GlobalStore.HideLoading();
        let message = "[Những yếu tố không thuận lợi] Không được để trống";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }
      if (this.state.location == undefined || this.state.location == null) {
        this.props.GlobalStore.HideLoading();
        let message =
          "Không lấy được vị trí hiện tại, vui lòng bật Permission để lấy tọa độ";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }
      await this.btn_Save(Enums.SaveType.Completed);
      var req = new ActionMobileDto();
      req.MACode2 = SMX.MortgageAssetCode2.REBuildings;
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
      //console.log("SAD", req);

      let res = await HttpUtils.post<ActionMobileDto>(
        ApiUrl.Action_Execute,
        SMX.ApiActionCode.CheckIn,
        JSON.stringify(req)
      );

      this.props.navigation.navigate("REResidentialImagesSrc", {
        ProcessValuationDocumentID: pvRE.ProcessValuationDocumentID,
        MortgageAssetID: pvRE.MortgageAssetID,
        CustomerName: pvRE.CustomerName,
        InfactAddress: pvRE.InfactAddress,
      });
      this.props.GlobalStore.HideLoading();
    } catch (ex) {
      this.props.GlobalStore.Exception = ex;
      this.props.GlobalStore.HideLoading();
    }
  }

  async btn_Save(saveType: number) {
    //console.log("OKOKOK",save);

    try {
      this.props.GlobalStore.ShowLoading();
      let req = new ActionMobileDto();
      req.MACode2 = SMX.MortgageAssetCode2.REApartments;
      let pvD = this.state.ProcessValuationDocument;
      let pvRE = this.state.ProcessValuationRE;
      let pv = this.state.ProcessValuation;
      //Kiểm tra input khi nhập
      if (saveType == Enums.SaveType.Completed) {
        if (
          !this.state.InfactLandAreaCommon ||
          this.state.InfactLandAreaCommon == ""
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
          !this.state.ProcessValuationRE.DistanceToMainStreet ||
          Utility.GetDecimalString(
            this.state.ProcessValuationRE.DistanceToMainStreet
          ) == ""
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
        if (
          !this.state.ProcessValuation.Advantage ||
          this.state.ProcessValuation.Advantage == ""
        ) {
          this.props.GlobalStore.HideLoading();
          let message = "[Những yếu tố thuận lợi] Không được để trống";
          this.props.GlobalStore.Exception = ClientMessage(message);
          return;
        }
        if (
          !this.state.ProcessValuation.DisAdvantage ||
          this.state.ProcessValuation.DisAdvantage == ""
        ) {
          this.props.GlobalStore.HideLoading();
          let message = "[Những yếu tố không thuận lợi] Không được để trống";
          this.props.GlobalStore.Exception = ClientMessage(message);
          return;
        }
      }
      // if (!this.state.ProcessValuation.WorkfieldOtherInfomation || this.state.ProcessValuation.WorkfieldOtherInfomation == '') {
      //   this.props.GlobalStore.HideLoading();
      //   let message = "[Thông tin lưu ý] Không được để trống";
      //   this.props.GlobalStore.Exception = ClientMessage(message);
      //   return;
      // }

      let numWorkfieldDistance = this.state.WorkfieldDistance;
      let numInfactLandAreaCommon = this.state.InfactLandAreaCommon;
      let numLaneWidthMin = this.state.LaneWidthMin;
      let numLaneWidthMax = this.state.LaneWidthMax;
      let {
        Advantage: numAdvantage,
        DisAdvantage: numDisAdvantage,
      } = this.state.ProcessValuation;
      //console.log("CysMTA", numAdvantage, numDisAdvantage);

      // Đổ dữ liệu vào pvRE
      pvRE.ProcessValuationREID = this.state.ProcessValuationRE.ProcessValuationREID;
      pvRE.ProcessValuationDocumentID = this.state.ProcessValuationRE.ProcessValuationDocumentID;
      pvRE.Version = this.state.ProcessValuationRE.Version;
      pvRE.InfactLandAreaCommon =
        numInfactLandAreaCommon && numInfactLandAreaCommon.length != 0
          ? parseFloat(numInfactLandAreaCommon.split(",").join("."))
          : undefined;
      pvRE.FrontageType = this.state.ProcessValuationRE.FrontageType;
      pvRE.LaneWidthMin =
        numLaneWidthMin && numLaneWidthMin.length != 0
          ? parseFloat(numLaneWidthMin.split(",").join("."))
          : undefined;
      pvRE.LaneWidthMax =
        numLaneWidthMax && numLaneWidthMax.length != 0
          ? parseFloat(numLaneWidthMax.split(",").join("."))
          : undefined;
      pvRE.DistanceToMainStreet = this.state.ProcessValuationRE.DistanceToMainStreet;
      pvRE.ContiguousStreetType = this.state.ProcessValuationRE.ContiguousStreetType;

      // Đổ dữ liệu vào pvD
      pvD.ProcessValuationDocumentID = this.props.route.params.ProcessValuationDocumentID;
      pvD.Version = this.state.ProcessValuationRE.PVDVersion;
      pvD.WorkfieldDistance =
        numWorkfieldDistance && numWorkfieldDistance.length != 0
          ? parseFloat(numWorkfieldDistance.split(",").join("."))
          : undefined;

      //pvD.ItemID = this.props.route.params.ProcessValuationDocumentID;
      // Đổ dữ liệu vào pv
      pv.ProcessValuationID = this.state.ProcessValuationRE.ProcessValuationID;
      pv.Version = this.state.ProcessValuationRE.PVVersion;
      pv.Advantage = this.state.ProcessValuation.Advantage;
      pv.DisAdvantage = this.state.ProcessValuation.DisAdvantage;
      pv.WorkfieldOtherInfomation = this.state.ProcessValuation.WorkfieldOtherInfomation;

      // Đổ dữ liệu vào request
      req.ProcessValuationDocument = pvD;
      req.ProcessValuation = pv;
      req.ProcessValuationRE = pvRE;
      req.SaveType = saveType;
      req.ListProcessValuationREConstruction = this.state.ListProcessValuationREConstruction;
      req.ListProcessValuationREApartment = this.state.ListProcessValuationREApartment;

      //console.log("Hihi", req.ListProcessValuationREApartment);

      let res = await HttpUtils.post<ActionMobileDto>(
        ApiUrl.Action_Execute,
        SMX.ApiActionCode.SaveActions,
        JSON.stringify(req)
      );

      //ProcessValuationDocument: res!.ProcessValuationDocument,

      //console.log("HIHI");

      if (res) {
        // this.setState({
        //     ProcessValuationDocument: res!.ProcessValuationDocument,
        //     ProcessValuationRE: res!.ProcessValuationRE,
        //     ProcessValuation: res!.ProcessValuation,
        //     WorkfieldDistance: Utility.GetDecimalString(res!.ProcessValuationDocument.WorkfieldDistance),
        //     Advantage: res!.ProcessValuationRE.Advantage,
        //     DisAdvantage: res!.ProcessValuationRE.DisAdvantage,
        // });
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

  //#endregion

  //#region LoadList, LoadItem, UpdateItem, DeleteItem
  async AddNewItemRoom() {
    try {
      this.props.GlobalStore.ShowLoading();
      var req = new ActionMobileDto();
      // var pvRE = this.state.ProcessValuationRE;
      // var pvREC = this.state.ProcessValuationREConstruction;
      let lstCon = this.state.ListProcessValuationREConstruction;
      let pvREC = this.state.ProcessValuationREConstruction;
      let resetpvRECon = new ProcessValuationREConstruction();
      // Kiểm tra lỗi nhập liệu
      if (!this.state.InfactFloorArea || this.state.InfactFloorArea == "") {
        this.props.GlobalStore.HideLoading();
        let message = "[Diện tích thực tế] Không được để trống";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }
      let numInfactFloorArea = this.state.InfactFloorArea;
      req.MACode2 = SMX.MortgageAssetCode2.REApartments;
      pvREC.ProcessValuationREID = this.state.ProcessValuationRE.ProcessValuationREID;
      pvREC.InfactFloorArea =
        numInfactFloorArea && numInfactFloorArea.length != 0
          ? parseFloat(numInfactFloorArea.split(",").join("."))
          : undefined;
      pvREC.Description = this.state.ProcessValuationREConstruction.Description;
      // pvREC.ProcessValuationREConstructionID = thiss
      // Đổ dữ liệu vào req
      req.ProcessValuationREConstruction = pvREC;
      req.SaveType = Enums.SaveType.Temporary;

      //console.log(req);

      let res = await HttpUtils.post<ActionMobileDto>(
        ApiUrl.Action_Execute,
        SMX.ApiActionCode.SaveActions,
        JSON.stringify(req)
      );
      await this.getListRoom();
      // this.setState({
      //   ListProcessValuationREConstruction: lstCon,
      // })

      if (res) {
        this.setState({
          ProcessValuationREConstruction: resetpvRECon,
        });
      }

      this.props.GlobalStore.HideLoading();
      let mess = "Thêm mới thành công!";
      this.props.GlobalStore.Exception = ClientMessage(mess);
    } catch (ex) {
      this.props.GlobalStore.HideLoading();
      this.props.GlobalStore.Exception = ex;
    }
  }

  async AddNewItemPrivateLand() {
    try {
      this.props.GlobalStore.ShowLoading();
      var req = new ActionMobileDto();
      // var pvRE = this.state.ProcessValuationRE;
      // var pvREC = this.state.ProcessValuationREConstruction;
      // var lstAparts = this.state.ListProcessValuationREApartment;
      // var pvREC = this.state.ProcessValuationREConstruction;
      let pvREApart = this.state.ProcessValuationREApartment;
      let resetPvREApart = new ProcessValuationREApartment();
      // Kiểm tra lỗi nhập liệu
      if (
        !this.state.InfactFloorAreaREApart ||
        this.state.InfactFloorAreaREApart == ""
      ) {
        this.props.GlobalStore.HideLoading();
        let message = "[Diện tích thực tế] Không được để trống";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }
      if (
        !this.state.ProcessValuationREApartment.FrontageType ||
        Utility.GetDecimalString(
          this.state.ProcessValuationREApartment.FrontageType
        ) == ""
      ) {
        this.props.GlobalStore.HideLoading();
        let message = "[Mặt tiền tiếp giáp] Không được để trống";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }
      if (
        this.state.ProcessValuationREApartment.FrontageType ==
          Enums.ProcessValuationREFrontageType.MatNgoHem ||
        this.state.ProcessValuationREApartment.FrontageType ==
          Enums.ProcessValuationREFrontageType.MatDuongNoiBo
      ) {
        if (
          !this.state.LaneWidthMinREApart ||
          this.state.LaneWidthMinREApart == ""
        ) {
          this.props.GlobalStore.HideLoading();
          let message =
            "[Độ rộng mặt ngõ/hẻm/đường nội bộ nhỏ nhất (m)] Không được để trống";
          this.props.GlobalStore.Exception = ClientMessage(message);
          return;
        }
        if (
          !this.state.LaneWidthMaxREApart ||
          this.state.LaneWidthMaxREApart == ""
        ) {
          this.props.GlobalStore.HideLoading();
          let message =
            "[Độ rộng mặt ngõ/hẻm/đường nội bộ lớn nhất (m)] Không được để trống";
          this.props.GlobalStore.Exception = ClientMessage(message);
          return;
        }
      }
      if (
        !this.state.DistanceToMainStreetApart ||
        this.state.DistanceToMainStreetApart == ""
      ) {
        this.props.GlobalStore.HideLoading();
        let message =
          "[Khoảng cách đến mặt đường chính (m)] Không được để trống";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }
      if (
        !this.state.ProcessValuationREApartment.ConstructionDescription ||
        this.state.ProcessValuationREApartment.ConstructionDescription == ""
      ) {
        this.props.GlobalStore.HideLoading();
        let message = "[Mô tả tài sản trên đất] Không được để trống";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }
      let numInfactFloorAreaREApart = this.state.InfactFloorAreaREApart;
      let numLaneWidthMinREApart = this.state.LaneWidthMinREApart;
      let numLaneWidthMaxREApart = this.state.LaneWidthMaxREApart;
      let numDistanceToMainStreetApart = this.state.DistanceToMainStreetApart;
      //Đổ dữ liệu vào pvREApart
      req.MACode2 = SMX.MortgageAssetCode2.REApartments;
      pvREApart.ProcessValuationREApartmentID = this.state.ProcessValuationREApartment.ProcessValuationREApartmentID;
      pvREApart.ProcessValuationREID = this.state.ProcessValuationREApartment.ProcessValuationREID;
      pvREApart.InfactFloorArea =
        numInfactFloorAreaREApart && numInfactFloorAreaREApart.length != 0
          ? parseFloat(numInfactFloorAreaREApart.split(",").join("."))
          : undefined;
      pvREApart.LaneWidthMin =
        numLaneWidthMinREApart && numLaneWidthMinREApart.length != 0
          ? parseFloat(numLaneWidthMinREApart.split(",").join("."))
          : undefined;
      pvREApart.LaneWidthMax =
        numLaneWidthMaxREApart && numLaneWidthMaxREApart.length != 0
          ? parseFloat(numLaneWidthMaxREApart.split(",").join("."))
          : undefined;
      pvREApart.DistanceToMainStreet =
        numDistanceToMainStreetApart && numDistanceToMainStreetApart.length != 0
          ? parseFloat(numDistanceToMainStreetApart.split(",").join("."))
          : undefined;
      pvREApart.FrontageType = this.state.ProcessValuationREApartment.FrontageType;
      pvREApart.ContiguousStreetType = this.state.ProcessValuationREApartment.ContiguousStreetType;
      pvREApart.ConstructionDescription = this.state.ProcessValuationREApartment.ConstructionDescription;
      pvREApart.ProcessValuationREID = this.state.ProcessValuationRE.ProcessValuationREID;
      // pvREC.ProcessValuationREConstructionID = thiss
      // Đổ dữ liệu vào req
      req.ProcessValuationREApartment = pvREApart;
      req.SaveType = Enums.SaveType.Temporary;

      //console.log(req);

      let res = await HttpUtils.post<ActionMobileDto>(
        ApiUrl.Action_Execute,
        SMX.ApiActionCode.SaveActions,
        JSON.stringify(req)
      );
      this.getListPrivateLand();
      // this.setState({
      //   ListProcessValuationREApartment: lstAparts,
      // })

      if (res) {
        this.setState({
          ProcessValuationREApartment: resetPvREApart,
        });
      }

      this.props.GlobalStore.HideLoading();
      let mess = "Thêm mới thành công!";
      this.props.GlobalStore.Exception = ClientMessage(mess);
    } catch (ex) {
      this.props.GlobalStore.HideLoading();
      this.props.GlobalStore.Exception = ex;
    }
  }
  showPopUpRoomAddNew = () => {
    this.setState({ showPopUpRoomAddNew: !this.state.showPopUpRoomAddNew });
  };
  showPopUpRoomEdit = () => {
    this.setState({ showPopUpRoomEdit: !this.state.showPopUpRoomEdit });
  };

  showPopUpPrivateLandAddNew = () => {
    this.setState({
      showPopUpPrivateLandAddNew: !this.state.showPopUpPrivateLandAddNew,
    });
  };

  showPopUpPrivateLandEdit = () => {
    this.setState({
      showPopUpPrivateLandEdit: !this.state.showPopUpPrivateLandEdit,
    });
  };

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

  async getListRoom() {
    try {
      this.props.GlobalStore.ShowLoading();

      var req = new ActionMobileDto();
      let itempvRE = this.state.ProcessValuationRE;

      req.ProcessValuationRE = itempvRE;
      req.MACode2 = SMX.MortgageAssetCode2.REApartments;
      let res = await HttpUtils.post<ActionMobileDto>(
        ApiUrl.Action_Execute,
        SMX.ApiActionCode.LoadListConstruction,
        JSON.stringify(req)
      );
      //console.log("OIJ", res);

      if (res) {
        this.setState({
          ListProcessValuationREConstruction: res!
            .ListProcessValuationREConstruction,
          showPopUpRoomAddNew: false,
          showPopUpRoomEdit: false,
          showPopUpPrivateLandAddNew: false,
          showPopUpPrivateLandEdit: false,
          // showConfirmAddNew: false,
          // showConfirmEdit: false,
        });
      }

      this.props.GlobalStore.HideLoading();
    } catch (ex) {
      this.props.GlobalStore.Exception = ex;
      this.props.GlobalStore.HideLoading();
    }
  }

  async getListPrivateLand() {
    try {
      this.props.GlobalStore.ShowLoading();
      var req = new ActionMobileDto();
      let itempvRE = this.state.ProcessValuationRE;
      req.ProcessValuationRE = itempvRE;
      req.MACode2 = SMX.MortgageAssetCode2.REApartments;
      let res = await HttpUtils.post<ActionMobileDto>(
        ApiUrl.Action_Execute,
        SMX.ApiActionCode.LoadListApartment,
        JSON.stringify(req)
      );
      //console.log("Danh sách mới", res);

      if (res) {
        this.setState({
          ListProcessValuationREApartment: res!.ListProcessValuationREApartment,
          showPopUpRoomAddNew: false,
          showPopUpRoomEdit: false,
          showPopUpPrivateLandAddNew: false,
          showPopUpPrivateLandEdit: false,
          // showConfirmAddNew: false,
          // showConfirmEdit: false,
        });
      }

      this.props.GlobalStore.HideLoading();
    } catch (ex) {
      this.props.GlobalStore.Exception = ex;
      this.props.GlobalStore.HideLoading();
    }
  }
  async UpdateItemRoom(id) {
    //console.log("So SAD", id);

    try {
      this.props.GlobalStore.ShowLoading();
      var req = new ActionMobileDto();
      // var pvRE = this.state.ProcessValuationRE;
      // var pvREC = this.state.ProcessValuationREConstruction;
      let lstRoom = this.state.ListProcessValuationREConstruction;
      let pvREC = this.state.ProcessValuationREConstruction;
      // Kiểm tra lỗi nhập liệu
      if (!this.state.InfactFloorArea || this.state.InfactFloorArea == "") {
        this.props.GlobalStore.HideLoading();
        let message = "[Diện tích thực tế] Không được để trống";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }
      let numInfactFloorArea = this.state.InfactFloorArea;
      pvREC.ProcessValuationREID = this.state.ProcessValuationRE.ProcessValuationREID;
      pvREC.ProcessValuationREConstructionID = id;
      pvREC.InfactFloorArea =
        numInfactFloorArea && numInfactFloorArea.length != 0
          ? parseFloat(numInfactFloorArea.split(",").join("."))
          : undefined;
      // Đổ dữ liệu vào req
      //console.log("Ok cyss", pvREC.InfactFloorArea);
      req.ProcessValuationREConstruction = pvREC;
      req.MACode2 = SMX.MortgageAssetCode2.REApartments;
      req.SaveType = Enums.SaveType.Temporary;

      //console.log(req);

      let res = await HttpUtils.post<ActionMobileDto>(
        ApiUrl.Action_Execute,
        SMX.ApiActionCode.SaveActions,
        JSON.stringify(req)
      );

      this.getListRoom();
      // this.setState({
      //   ListProcessValuationREConstruction: lstRoom,
      // })

      // if (res) {
      //     this.setState({

      //     });
      // }

      this.props.GlobalStore.HideLoading();
      let mess = "Chỉnh sửa thành công!";
      this.props.GlobalStore.Exception = ClientMessage(mess);
    } catch (ex) {
      this.props.GlobalStore.HideLoading();
      this.props.GlobalStore.Exception = ex;
    }
  }

  async UpdateItemPrivateLand(id) {
    //console.log("So SAD", id);
    //console.log("HIHI",this.state.Pro);
    //console.log("HI b",this.state.ProcessValuationREApartment);
    try {
      this.props.GlobalStore.ShowLoading();
      var req = new ActionMobileDto();
      // var pvRE = this.state.ProcessValuationRE;
      // var pvREC = this.state.ProcessValuationREConstruction;
      //var lstRoom = this.state.ListProcessValuationREConstruction;
      let pvREApart = this.state.ProcessValuationREApartment;
      // Kiểm tra lỗi nhập liệu
      if (
        !this.state.InfactFloorAreaREApart ||
        this.state.InfactFloorAreaREApart == ""
      ) {
        this.props.GlobalStore.HideLoading();
        let message = "[Diện tích thực tế] Không được để trống";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }
      if (
        !this.state.numFontageType ||
        Utility.GetDecimalString(this.state.numFontageType) == ""
      ) {
        this.props.GlobalStore.HideLoading();
        let message = "[Mặt tiền tiếp giáp] Không được để trống";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }
      if (
        pvREApart.FrontageType ==
          Enums.ProcessValuationREFrontageType.MatNgoHem ||
        pvREApart.FrontageType ==
          Enums.ProcessValuationREFrontageType.MatDuongNoiBo
      ) {
        if (
          !this.state.LaneWidthMinREApart ||
          this.state.LaneWidthMinREApart == ""
        ) {
          this.props.GlobalStore.HideLoading();
          let message =
            "[Độ rộng mặt ngõ/hẻm/đường nội bộ nhỏ nhất (m)] Không được để trống";
          this.props.GlobalStore.Exception = ClientMessage(message);
          return;
        }
        if (
          !this.state.LaneWidthMaxREApart ||
          this.state.LaneWidthMaxREApart == ""
        ) {
          this.props.GlobalStore.HideLoading();
          let message =
            "[Độ rộng mặt ngõ/hẻm/đường nội bộ lớn nhất (m)] Không được để trống";
          this.props.GlobalStore.Exception = ClientMessage(message);
          return;
        }
      }
      if (
        !this.state.DistanceToMainStreetApart ||
        this.state.DistanceToMainStreetApart == ""
      ) {
        this.props.GlobalStore.HideLoading();
        let message =
          "[Khoảng cách đến mặt đường chính (m)] Không được để trống";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }
      if (
        !pvREApart.ConstructionDescription ||
        pvREApart.ConstructionDescription == ""
      ) {
        this.props.GlobalStore.HideLoading();
        let message = "[Mô tả tài sản trên đất] Không được để trống";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }
      let numInInfactFloorAreaREApart = this.state.InfactFloorAreaREApart;
      let numLaneWidthMinREApart = this.state.LaneWidthMinREApart;
      let numLaneWidthMaxREApart = this.state.LaneWidthMaxREApart;
      let numDistanceToMainStreetApart = this.state.DistanceToMainStreetApart;
      // Đổ dữ liệu vào pvREApart
      pvREApart.ProcessValuationREID = this.state.ProcessValuationRE.ProcessValuationREID;
      pvREApart.InfactFloorArea =
        numInInfactFloorAreaREApart && numInInfactFloorAreaREApart.length != 0
          ? parseFloat(numInInfactFloorAreaREApart.split(",").join("."))
          : undefined;
      pvREApart.LaneWidthMin =
        numLaneWidthMinREApart && numLaneWidthMinREApart.length != 0
          ? parseFloat(numLaneWidthMinREApart.split(",").join("."))
          : undefined;
      pvREApart.LaneWidthMax =
        numLaneWidthMaxREApart && numLaneWidthMaxREApart.length != 0
          ? parseFloat(numLaneWidthMaxREApart.split(",").join("."))
          : undefined;
      pvREApart.DistanceToMainStreet =
        numDistanceToMainStreetApart && numDistanceToMainStreetApart.length != 0
          ? parseFloat(numDistanceToMainStreetApart.split(",").join("."))
          : undefined;
      // Đổ dữ liệu vào req
      req.ProcessValuationREApartment = pvREApart;
      req.MACode2 = SMX.MortgageAssetCode2.REApartments;
      req.SaveType = Enums.SaveType.Temporary;

      //console.log(req);

      let res = await HttpUtils.post<ActionMobileDto>(
        ApiUrl.Action_Execute,
        SMX.ApiActionCode.SaveActions,
        JSON.stringify(req)
      );

      this.getListPrivateLand();
      // this.setState({
      //   ListProcessValuationREConstruction: lstRoom,
      // })

      // if (res) {
      //     this.setState({

      //     });
      // }

      this.props.GlobalStore.HideLoading();
      let mess = "Chỉnh sửa thành công!";
      this.props.GlobalStore.Exception = ClientMessage(mess);
    } catch (ex) {
      this.props.GlobalStore.HideLoading();
      this.props.GlobalStore.Exception = ex;
    }
  }

  async EditItemContruction(item) {
    //console.log(item);

    let itemCon = new ProcessValuationREConstruction();
    itemCon = item;
    // return (

    // );
  }

  showEditContruction(item) {
    //console.log("CYS", this.state.showPopUpRoomEdit);
    this.setState({
      showPopUpRoomEdit: true,
    });
    return (
      <PopUpModalViolet
        resetState={this.showPopUpRoomEdit}
        modalVisible={this.state.showPopUpRoomEdit}
        title="Công trình xây dựng"
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.ItemKS}>
            <View style={{ flex: 1, marginBottom: 3, flexDirection: "row" }}>
              <Text>
                Diện tích thực tế (m2) <Text style={{ color: "red" }}>*</Text>{" "}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <TextInput
                keyboardType={"numeric"}
                multiline={false}
                maxLength={15}
                value={Utility.GetDecimalString(item.InfactFloorArea)}
                style={[Theme.TextInput]}
                onChangeText={(val) => {
                  item.InfactFloorArea = Utility.ConvertToDecimal(val);
                  this.setState({ ProcessValuationREConstruction: item });
                }}
              />
            </View>
          </View>

          <View style={styles.TextAndDrop}>
            <View style={styles.Item}>
              <View style={{ flex: 2, flexDirection: "row" }}>
                <Text>Mô tả </Text>
                {/* <Text style={{ color: 'red' }}>*</Text> */}
              </View>
            </View>
            <View style={{ flex: 3 }}>
              <TextInput
                multiline={false}
                style={[Theme.TextView, {}]}
                value={item.Description}
                onChangeText={(val) => {
                  item.Description = val;
                  this.setState({ ProcessValuationREConstruction: item });
                }}
              />
            </View>
          </View>
          <View
            style={{
              marginTop: 10,
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.setState({ showPopUpRoomEdit: false }, async () => {
                  await this.UpdateItemRoom(
                    item.ProcessValuationREConstructionID
                  );
                });
              }}
            >
              <LinearGradient
                colors={["#ae55e6", "#ae55e6"]}
                style={{
                  //width: 80,
                  backgroundColor: "#722ED1",
                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 5,
                  alignSelf: "center",
                  marginRight: 5,
                }}
              >
                <Text>OK</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                //width: 80,
                backgroundColor: "#FFFFFF",
                padding: 10,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 5,
                alignSelf: "center",
                marginLeft: 5,
              }}
              onPress={() => {
                this.setState({ showPopUpRoomEdit: false });
              }}
            >
              <Text style={{ color: "#1B2031", fontSize: 15 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </PopUpModalViolet>
    );
  }
  async deleteConDetail(id) {
    try {
      this.props.GlobalStore.ShowLoading();
      //console.log("HIHI", id);

      var req = new ActionMobileDto();
      let itemCon = new ProcessValuationREConstruction();
      itemCon.ProcessValuationREConstructionID = id;
      req.ProcessValuationREConstruction = itemCon;
      //console.log(123, req);

      //Xóa công trình xây dựng
      let res = await HttpUtils.post<ActionMobileDto>(
        ApiUrl.Action_Execute,
        SMX.ApiActionCode.DeleteConstruction,
        JSON.stringify(req)
      );

      //Lấy lại List công trình xây dựng update
      await this.getListRoom();

      this.props.GlobalStore.HideLoading();
    } catch (ex) {
      this.props.GlobalStore.Exception = ex;
      this.props.GlobalStore.HideLoading();
    }
  }
  async deleteApartDetail(id) {
    //console.log("So feel", id);
    try {
      this.props.GlobalStore.ShowLoading();
      //console.log("HIHI", id);
      var req = new ActionMobileDto();
      let itemApart = new ProcessValuationREApartment();
      itemApart.ProcessValuationREApartmentID = id;
      req.ProcessValuationREApartment = itemApart;
      //console.log(123, req);

      //Xóa
      let res = await HttpUtils.post<ActionMobileDto>(
        ApiUrl.Action_Execute,
        SMX.ApiActionCode.DeleteApartment,
        JSON.stringify(req)
      );

      //Lấy lại List công trình xây dựng update
      await this.getListPrivateLand();

      this.props.GlobalStore.HideLoading();
    } catch (ex) {
      this.props.GlobalStore.Exception = ex;
      this.props.GlobalStore.HideLoading();
    }
  }

  async deleteCon(id) {
    Alert.alert(
      "Xóa CTXD",
      "Qúy khách muốn xóa công trình xây dựng này ?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => this.deleteConDetail(id) },
      ],
      { cancelable: false }
    );
  }
  //#endregion

  renderItem(index: number, item: ProcessValuationREConstruction) {
    //console.log("IIIII", item);
    let itemCon = this.state.tempCon;
    let coutLstItem = this.state.ListProcessValuationREConstruction.length;
    return (
      <View style={Theme.ViewContentItemFlatList}>
        <View style={{ flex: 1 }}>
          <View>
            <Text style={Theme.ViewCountItemFlatList}>
              {index + 1}/{coutLstItem}
            </Text>
          </View>
          <View style={{ flexDirection: "row", marginBottom: 2 }}>
            <Text style={{ flex: 1, fontWeight: "bold" }}>
              Diện tích thực tế (m2) :{" "}
            </Text>
            <Text style={{ flex: 1, fontWeight: "600" }}>
              {Utility.GetDecimalStringEdit(item.InfactFloorArea, 2)}
            </Text>
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: "#F0F0F4",
              marginVertical: 8,
            }}
          ></View>
          <View style={{ flexDirection: "row", marginBottom: 2 }}>
            <Text style={{ flex: 1, fontWeight: "bold" }}>Mô tả : </Text>
            <Text style={{ flex: 1, fontWeight: "600" }}>
              {item.Description}
            </Text>
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: "#F0F0F4",
              marginVertical: 8,
            }}
          ></View>
          <View style={{ flex: 2, flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => {
                this.setState(
                  {
                    numContructiontype: item.ConstructionType,
                    InfactFloorArea: Utility.GetDecimalStringVer2(
                      item.InfactFloorArea
                    ),
                    showPopUpRoomEdit: true,
                    tempCon: item,
                  },

                  () => {
                    this.forceUpdate();
                  }
                );
                // this.setState({
                //   showPopUpRoomEdit: true,
                //   tempCon: item,
                // });
                //itemCon = item;
                //this.showEditContruction(item)
              }}
            >
              <LinearGradient
                colors={["#FFFFFF", "#FFFFFF"]}
                style={{
                  //width: 80,
                  backgroundColor: "#722ED1",
                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 5,
                  alignSelf: "center",
                  marginRight: 5,
                }}
              >
                <View style={{ flex: 1, flexDirection: "row" }}>
                  <FontAwesome5 name="edit" size={24} color="#ae55e6" />
                  <Text style={{ color: "#ae55e6" }}> Chỉnh sửa</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ width: width / 2 + 100 }}
              onPress={() => {
                this.deleteConDetail(item.ProcessValuationREConstructionID);
              }}
            >
              <LinearGradient
                colors={["#FFFFFF", "#FFFFFF"]}
                style={{
                  //width: 80,
                  backgroundColor: "#722ED1",
                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 5,
                  alignSelf: "center",
                  marginRight: 5,
                }}
              >
                <View style={{ flex: 1, flexDirection: "row" }}>
                  <FontAwesome5 name="times" size={24} color="#ae55e6" />
                  <Text style={{ color: "#ae55e6" }}> Xóa bỏ</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  renderItemApart(index: number, item: ProcessValuationREApartment) {
    //console.log("IIIII", item);
    let itemApart = this.state.tempApart;
    let coutLstItem = this.state.ListProcessValuationREApartment.length;
    return (
      <View style={Theme.ViewContentItemFlatList}>
        <View style={{ flex: 1 }}>
          <View>
            <Text style={Theme.ViewCountItemFlatList}>
              {index + 1}/{coutLstItem}
            </Text>
          </View>
          <View style={{ flex: 2, flexDirection: "row", marginBottom: 2 }}>
            <Text style={{ flex: 1, fontWeight: "bold" }}>
              Diện tích thực tế (m2) :{" "}
            </Text>
            <Text style={{ flex: 1, fontWeight: "600" }}>
              {Utility.GetDecimalStringEdit(item.InfactFloorArea, 2)}
            </Text>
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: "#F0F0F4",
              marginVertical: 8,
            }}
          ></View>
          <View style={{ flex: 2, flexDirection: "row", marginBottom: 2 }}>
            <Text style={{ flex: 1, fontWeight: "bold" }}>
              Mặt tiền tiếp giáp :{" "}
            </Text>
            <Text style={{ flex: 1, fontWeight: "600" }}>
              {Utility.GetDictionaryValue(
                SMX.ProcessValuationREFrontageType
                  .dicProcessValuationREFrontageType,
                item.FrontageType
              )}
            </Text>
          </View>
          <View style={{ flexDirection: "row", marginBottom: 2 }}></View>
          {item.FrontageType ==
            Enums.ProcessValuationREFrontageType.MatNgoHem ||
          item.FrontageType ==
            Enums.ProcessValuationREFrontageType.MatDuongNoiBo ? (
            <View>
              <View
                style={{
                  height: 1,
                  backgroundColor: "#F0F0F4",
                  marginVertical: 8,
                }}
              ></View>
              <View style={{ flex: 2, flexDirection: "row", marginBottom: 2 }}>
                <Text style={{ flex: 1, fontWeight: "bold" }}>
                  Độ rộng mặt ngõ/hẻm/ đường nội bộ nhỏ nhất (m) * :{" "}
                </Text>
                <Text style={{ flex: 1, fontWeight: "600" }}>
                  {Utility.GetDecimalStringEdit(item.LaneWidthMin, 2)}
                </Text>
              </View>
              <View
                style={{
                  height: 1,
                  backgroundColor: "#F0F0F4",
                  marginVertical: 8,
                }}
              ></View>
              <View style={{ flex: 2, flexDirection: "row", marginBottom: 2 }}>
                <Text style={{ flex: 1, fontWeight: "bold" }}>
                  Độ rộng mặt ngõ/hẻm/ đường nội bộ lớn nhất (m) * :{" "}
                </Text>
                <Text style={{ flex: 1, fontWeight: "600" }}>
                  {Utility.GetDecimalStringEdit(item.LaneWidthMax, 2)}
                </Text>
              </View>
            </View>
          ) : undefined}
          <View
            style={{
              height: 1,
              backgroundColor: "#F0F0F4",
              marginVertical: 8,
            }}
          ></View>
          <View style={{ flex: 2, flexDirection: "row", marginBottom: 2 }}>
            <Text style={{ flex: 1, fontWeight: "bold" }}>
              Khoảng cách đến mặt đường chính *:{" "}
            </Text>
            <Text style={{ flex: 1, fontWeight: "600" }}>
              {Utility.GetDecimalStringEdit(item.DistanceToMainStreet, 2)}
            </Text>
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: "#F0F0F4",
              marginVertical: 8,
            }}
          ></View>
          <View style={{ flex: 2, flexDirection: "row", marginBottom: 2 }}>
            <Text style={{ flex: 1, fontWeight: "bold" }}>
              Loại đường tiếp giáp :{" "}
            </Text>
            <Text style={{ flex: 1, fontWeight: "600" }}>
              {this.state.LstContiguousStreetType ? (
                <Text style={[Theme.TextView, {}]}>
                  {this.state.LstContiguousStreetType.filter(
                    (x) => x.SystemParameterID == item.ContiguousStreetType
                  )[0]
                    ? this.state.LstContiguousStreetType.filter(
                        (x) => x.SystemParameterID == item.ContiguousStreetType
                      )[0].Name
                    : ""}
                </Text>
              ) : undefined}
            </Text>
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: "#F0F0F4",
              marginVertical: 8,
            }}
          ></View>
          <View style={{ flex: 2, flexDirection: "row", marginBottom: 2 }}>
            <Text style={{ flex: 1, fontWeight: "bold" }}>
              Mô tả tài sản trên đất :{" "}
            </Text>
            <Text style={{ flex: 1, fontWeight: "600" }}>
              {/* {
              this.state.LstContiguousStreetType
                ?
                <Text
                  style={[Theme.TextView, {}]}
                >{this.state.LstContiguousStreetType.filter(x => x.SystemParameterID == item.ContiguousStreetType)[0].Name? undefined : ""}</Text>
                : undefined
            } */}
              {item.ConstructionDescription}
            </Text>
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: "#F0F0F4",
              marginVertical: 8,
            }}
          ></View>
          <View style={{ flex: 2, flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => {
                // this.setState({
                //   showPopUpPrivateLandEdit: true,
                //   tempApart: item,
                // });
                //itemCon = item;
                //this.showEditContruction(item)
                this.showInfromContiguousFrontage(item.FrontageType);
                this.setState(
                  {
                    numFontageType: item.FrontageType,
                    numContiguousStreetType: item.ContiguousStreetType,
                    InfactFloorAreaREApart: Utility.GetDecimalStringVer2(
                      item.InfactFloorArea
                    ),
                    LaneWidthMinREApart: Utility.GetDecimalStringVer2(
                      item.LaneWidthMin
                    ),
                    LaneWidthMaxREApart: Utility.GetDecimalStringVer2(
                      item.LaneWidthMax
                    ),
                    DistanceToMainStreetApart: Utility.GetDecimalStringVer2(
                      item.DistanceToMainStreet
                    ),
                    ProcessValuationREApartment: item,
                    showPopUpPrivateLandEdit: true,
                  },
                  () => {
                    this.forceUpdate();
                  }
                );
              }}
            >
              <LinearGradient
                colors={["#FFFFFF", "#FFFFFF"]}
                style={{
                  //width: 80,
                  backgroundColor: "#722ED1",
                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 5,
                  alignSelf: "center",
                  marginRight: 5,
                }}
              >
                <View style={{ flex: 1, flexDirection: "row" }}>
                  <FontAwesome5 name="edit" size={24} color="#ae55e6" />
                  <Text style={{ color: "#ae55e6" }}> Chỉnh sửa</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ width: width / 2 + 100 }}
              onPress={() => {
                this.deleteApartDetail(item.ProcessValuationREApartmentID);
              }}
            >
              <LinearGradient
                colors={["#FFFFFF", "#FFFFFF"]}
                style={{
                  //width: 80,
                  backgroundColor: "#722ED1",
                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 5,
                  alignSelf: "center",
                  marginRight: 5,
                }}
              >
                <View style={{ flex: 1, flexDirection: "row" }}>
                  <FontAwesome5 name="times" size={24} color="#ae55e6" />
                  <Text style={{ color: "#ae55e6" }}> Xóa bỏ</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
  FontTypeDetai(id) {}
  render() {
    let pvRE = this.state.ProcessValuationRE;
    //let pvD = this.state.ProcessValuationDocument;
    let pv = this.state.ProcessValuation;
    let pvREC = this.state.ProcessValuationREConstruction;
    //let pvREApart = this.state.ProcessValuationREApartment;
    return (
      <View style={{ height: height, backgroundColor: "#FFF" }}>
        <Toolbar
          Title="Khảo sát hiện trạng"
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

              <View style={Theme.ViewGeneral}>
                <View style={Theme.ViewTitle}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "bold",
                      color: "#FFFFFF",
                    }}
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
                </View>
                <View style={Theme.ViewTitle}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "bold",
                      color: "#FFFFFF",
                    }}
                  >
                    Mô tả khu nhà
                  </Text>
                </View>
                <View style={Theme.ViewContent}>
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
                        style={[Theme.TextView]}
                        value={this.state.InfactLandAreaCommon}
                        //style={[Theme.TextInput]}
                        onChangeText={(val) => {
                          //pvRE.InfactLandAreaCommon = Utility.ConvertToDecimal(val);
                          this.setState({ InfactLandAreaCommon: val });
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
                        display: this.state.ShowFontTypeDetail
                          ? "flex"
                          : "none",
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
                            Độ rộng mặt ngõ/hẻm/đường nội bộ nhỏ nhất (m)
                          </Text>
                          <Text style={{ color: "red" }}>*</Text>
                        </View>

                        <View style={{ flex: 1 }}>
                          <TextInput
                            keyboardType={"numeric"}
                            multiline={false}
                            maxLength={15}
                            value={this.state.LaneWidthMin}
                            style={[Theme.TextInput]}
                            onChangeText={(val) => {
                              //pvRE.LaneWidthMin = Utility.ConvertToDecimal(val);
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
                            Độ rộng mặt ngõ/hẻm/đường nội bộ lớn nhất (m)
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
                              //pvRE.LaneWidthMax = Utility.ConvertToDecimal(val);
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
                      </View>

                      <View style={{ flex: 1 }}>
                        <TextInput
                          keyboardType={"numeric"}
                          multiline={false}
                          maxLength={15}
                          value={Utility.GetDecimalString(
                            pvRE.DistanceToMainStreet
                          )}
                          style={[Theme.TextInput]}
                          onChangeText={(val) => {
                            pvRE.DistanceToMainStreet = Utility.ConvertToDecimal(
                              val
                            );
                            this.setState({ ProcessValuationRE: pvRE });
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
                      <Text>Loại đường tiếp giáp </Text>
                      <Text style={{ color: "red" }}>*</Text>
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
                </View>
                <View style={Theme.ViewTitle}>
                  <View style={{ flex: 2 }}>
                    <Text
                      style={{
                        fontSize: 15,
                        color: "#FFFFFF",
                        fontWeight: "bold",
                      }}
                    >
                      Mô tả phần căn hộ/ phòng sở hữu{" "}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        justifyContent: "flex-end",
                        alignItems: "flex-end",
                        paddingLeft: 7,
                      }}
                      onPress={() => {
                        (pvREC = new ProcessValuationREConstruction()),
                          this.setState({ showPopUpRoomAddNew: true });
                      }}
                    >
                      <LinearGradient
                        colors={["#ae55e6", "#ae55e6"]}
                        style={{
                          // width: width / 3,
                          // height: 50,
                          backgroundColor: "#007AFF",
                          borderRadius: 5,
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "row",
                        }}
                      >
                        <FontAwesome5
                          name="plus-circle"
                          size={24}
                          color="#FFFFFF"
                        />
                        <Text
                          style={{
                            color: "#FFFFFF",
                            fontSize: 15,
                            marginLeft: 8,
                            fontWeight: "bold",
                          }}
                        >
                          Thêm mới
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
                <PopUpModalViolet
                  resetState={this.showPopUpRoomAddNew}
                  modalVisible={this.state.showPopUpRoomAddNew}
                  title="Mô tả căn hộ/phòng"
                >
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.ItemKS}>
                      <View
                        style={{
                          flex: 1,
                          marginBottom: 3,
                          flexDirection: "row",
                        }}
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
                          value={this.state.InfactFloorArea}
                          style={[Theme.TextInput]}
                          onChangeText={(val) => {
                            //pvREC.InfactFloorArea = Utility.ConvertToDecimal(val);
                            this.setState({ InfactFloorArea: val });
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
                          <Text>Mô tả </Text>
                          {/* <Text style={{ color: 'red' }}>*</Text> */}
                        </View>
                      </View>
                      <View style={{ flex: 3 }}>
                        <TextInput
                          multiline={false}
                          style={[Theme.TextView, {}]}
                          value={pvREC.Description}
                          onChangeText={(val) => {
                            pvREC.Description = val;
                            this.setState({
                              ProcessValuationREConstruction: pvREC,
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
                    ></View>
                    <View
                      style={{
                        flex: 2,
                        marginTop: 10,
                        flexDirection: "row",
                        justifyContent: "flex-end",
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          flex: 1,
                          //width: 80,
                          backgroundColor: "#ae55e6",
                          padding: 10,
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: 5,
                          alignSelf: "center",
                          marginLeft: 15,
                          borderColor: "red",
                          marginRight: 10,
                        }}
                        onPress={() => {
                          this.setState(
                            { showPopUpRoomAddNew: false },
                            async () => {
                              await this.AddNewItemRoom();
                            }
                          );
                        }}
                      >
                        <Text style={{ color: "#f0ffff" }}>OK</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          flex: 1,
                          //width: 80,
                          backgroundColor: "#f2f2f2",
                          padding: 10,
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: 5,
                          alignSelf: "center",
                          marginRight: 15,
                          borderColor: "red",
                        }}
                        onPress={() => {
                          this.setState({ showPopUpRoomAddNew: false });
                        }}
                      >
                        <Text style={{ color: "#797979", fontSize: 15 }}>
                          Cancel
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                </PopUpModalViolet>
                <View style={Theme.ViewContent}>
                  <FlatList
                    horizontal
                    showsVerticalScrollIndicator
                    pagingEnabled
                    bounces={false}
                    showsHorizontalScrollIndicator={false}
                    data={this.state.ListProcessValuationREConstruction}
                    renderItem={({ item, index }) =>
                      this.renderItem(index, item)
                    }
                    keyExtractor={(item, i) => i.toString()}
                  />
                  {/* <Paginator data={this.state.ListProcessValuationREConstruction} /> */}
                </View>
                <PopUpModalViolet
                  resetState={this.showPopUpRoomEdit}
                  modalVisible={this.state.showPopUpRoomEdit}
                  title="Công trình xây dựng"
                >
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.ItemKS}>
                      <View
                        style={{
                          flex: 1,
                          marginBottom: 3,
                          flexDirection: "row",
                        }}
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
                          value={this.state.InfactFloorArea}
                          style={[Theme.TextInput]}
                          onChangeText={(val) => {
                            // let item = this.state.tempCon;
                            // item.InfactFloorArea = Utility.ConvertToDecimal(val);
                            this.setState({ InfactFloorArea: val });
                          }}
                        />
                      </View>
                    </View>
                    <View style={styles.TextAndDrop}>
                      <View style={styles.Item}>
                        <View style={{ flex: 2, flexDirection: "row" }}>
                          <Text>Mô tả </Text>
                          {/* <Text style={{ color: 'red' }}>*</Text> */}
                        </View>
                      </View>
                      <View style={{ flex: 3 }}>
                        <TextInput
                          multiline={false}
                          style={[Theme.TextView, {}]}
                          value={this.state.tempCon.Description}
                          onChangeText={(val) => {
                            let item = this.state.tempCon;
                            item.Description = val;
                            this.setState({
                              ProcessValuationREConstruction: item,
                            });
                          }}
                        />
                      </View>
                    </View>
                    <View
                      style={{
                        flex: 2,
                        marginTop: 10,
                        flexDirection: "row",
                        justifyContent: "flex-end",
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          flex: 1,
                          //width: 80,
                          backgroundColor: "#ae55e6",
                          padding: 10,
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: 5,
                          alignSelf: "center",
                          marginLeft: 15,
                          borderColor: "red",
                          marginRight: 10,
                        }}
                        onPress={() => {
                          this.setState(
                            { showPopUpRoomEdit: false },
                            async () => {
                              await this.UpdateItemRoom(
                                this.state.tempCon
                                  .ProcessValuationREConstructionID
                              );
                            }
                          );
                        }}
                      >
                        <Text style={{ color: "#f0ffff" }}>Update</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          flex: 1,
                          //width: 80,
                          backgroundColor: "#f2f2f2",
                          padding: 10,
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: 5,
                          alignSelf: "center",
                          marginRight: 15,
                          borderColor: "red",
                        }}
                        onPress={() => {
                          this.setState({ showPopUpRoomEdit: false });
                        }}
                      >
                        <Text style={{ color: "#797979", fontSize: 15 }}>
                          Cancel
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                </PopUpModalViolet>

                <View>
                  <View style={Theme.ViewTitle}>
                    <View style={{ flex: 2 }}>
                      <Text
                        style={{
                          fontSize: 15,
                          color: "#FFFFFF",
                          fontWeight: "bold",
                        }}
                      >
                        Mô tả phần đất sử dụng riêng{" "}
                      </Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: "row" }}>
                      <TouchableOpacity
                        style={{
                          flex: 1,
                          justifyContent: "flex-end",
                          alignItems: "flex-end",
                          paddingLeft: 7,
                        }}
                        onPress={() => {
                          this.setState({
                            ProcessValuationREApartment: new ProcessValuationREApartment(),
                            showPopUpPrivateLandAddNew: true,
                          });
                        }}
                      >
                        <LinearGradient
                          colors={["#ae55e6", "#ae55e6"]}
                          style={{
                            // width: width / 3,
                            // height: 50,
                            backgroundColor: "#007AFF",
                            borderRadius: 5,
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "row",
                          }}
                        >
                          <FontAwesome5
                            name="plus-circle"
                            size={24}
                            color="#FFFFFF"
                          />
                          <Text
                            style={{
                              color: "#FFFFFF",
                              fontSize: 15,
                              marginLeft: 8,
                              fontWeight: "bold",
                            }}
                          >
                            Thêm mới
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <PopUpModalViolet
                    resetState={this.showPopUpPrivateLandAddNew}
                    modalVisible={this.state.showPopUpPrivateLandAddNew}
                    title="Mô tả phần đất riêng"
                  >
                    <View
                      style={{
                        height: 1,
                        backgroundColor: "#F0F0F4",
                        marginVertical: 8,
                      }}
                    ></View>
                    <View style={{ flex: 1 }}>
                      <ScrollView>
                        <View style={styles.ItemKS}>
                          <View
                            style={{
                              flex: 1,
                              marginBottom: 3,
                              flexDirection: "row",
                            }}
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
                              value={this.state.InfactFloorAreaREApart}
                              style={[Theme.TextInput]}
                              onChangeText={(val) => {
                                // let item = this.state.ProcessValuationREApartment;
                                // item.InfactFloorArea = Utility.ConvertToDecimal(val);
                                this.setState({ InfactFloorAreaREApart: val });
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
                            style={{
                              flex: 1,
                              marginBottom: 3,
                              flexDirection: "row",
                            }}
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
                              SelectedValue={
                                this.state.ProcessValuationREApartment
                                  .FrontageType
                              }
                              OnSelectedItemChanged={(val) => {
                                let item = this.state
                                  .ProcessValuationREApartment;
                                item.FrontageType = val.Key;
                                this.setState({
                                  ProcessValuationREApartment: item,
                                  ShowFontTypeDetail: false,
                                });
                                this.frontageTypeDetail(val.Key);
                              }}
                            ></DropDownBox>
                          </View>
                        </View>
                        <View>
                          <View
                            style={{
                              height: 1,
                              backgroundColor: "#F0F0F4",
                              marginVertical: 8,
                            }}
                          ></View>
                          <View
                            style={{
                              display: this.state.ShowFontTypeDetail
                                ? "flex"
                                : "none",
                            }}
                          >
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
                                  value={this.state.LaneWidthMinREApart}
                                  style={[Theme.TextInput]}
                                  onChangeText={(val) => {
                                    // let item = this.state.ProcessValuationREApartment;
                                    // item.LaneWidthMin = Utility.ConvertToDecimal(val);
                                    this.setState({ LaneWidthMinREApart: val });
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
                              </View>
                              <View style={{ flex: 1 }}>
                                <TextInput
                                  keyboardType={"numeric"}
                                  multiline={false}
                                  maxLength={15}
                                  value={this.state.LaneWidthMaxREApart}
                                  style={[Theme.TextInput]}
                                  onChangeText={(val) => {
                                    // let item = this.state.ProcessValuationREApartment;
                                    // item.LaneWidthMax = Utility.ConvertToDecimal(val);
                                    this.setState({ LaneWidthMaxREApart: val });
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
                            </View>

                            <View style={{ flex: 1 }}>
                              <TextInput
                                keyboardType={"numeric"}
                                multiline={false}
                                maxLength={15}
                                value={this.state.DistanceToMainStreetApart}
                                style={[Theme.TextInput]}
                                onChangeText={(val) => {
                                  // let item = this.state.ProcessValuationREApartment;
                                  // item.DistanceToMainStreet = Utility.ConvertToDecimal(val);
                                  this.setState({
                                    DistanceToMainStreetApart: val,
                                  });
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
                            style={{
                              flex: 1,
                              marginBottom: 3,
                              flexDirection: "row",
                            }}
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
                              SelectedValue={
                                this.state.ProcessValuationREApartment
                                  .ContiguousStreetType
                              }
                              OnSelectedItemChanged={(val) => {
                                let item = this.state
                                  .ProcessValuationREApartment;
                                item.ContiguousStreetType =
                                  val.SystemParameterID;
                                this.setState({
                                  ProcessValuationREApartment: item,
                                });
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
                          <View style={styles.Item}>
                            <View style={{ flex: 2, flexDirection: "row" }}>
                              <Text>
                                Mô tả tài sản trên đất{" "}
                                <Text style={{ color: "red" }}>*</Text>
                              </Text>
                            </View>
                          </View>
                          <View style={{ flex: 3 }}>
                            <TextInput
                              multiline={false}
                              style={[Theme.TextView, {}]}
                              value={
                                this.state.ProcessValuationREApartment
                                  .ConstructionDescription
                              }
                              onChangeText={(val) => {
                                let item = this.state
                                  .ProcessValuationREApartment;
                                item.ConstructionDescription = val;
                                this.setState({
                                  ProcessValuationREApartment: item,
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
                        ></View>
                        <View
                          style={{
                            flex: 2,
                            marginTop: 10,
                            flexDirection: "row",
                            justifyContent: "flex-end",
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              flex: 1,
                              //width: 80,
                              backgroundColor: "#ae55e6",
                              padding: 10,
                              justifyContent: "center",
                              alignItems: "center",
                              borderRadius: 5,
                              alignSelf: "center",
                              marginLeft: 15,
                              borderColor: "red",
                              marginRight: 10,
                            }}
                            onPress={() => {
                              this.setState(
                                { showPopUpPrivateLandAddNew: false },
                                async () => {
                                  await this.AddNewItemPrivateLand();
                                }
                              );
                            }}
                          >
                            <Text style={{ color: "#f0ffff" }}>OK</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              flex: 1,
                              //width: 80,
                              backgroundColor: "#f2f2f2",
                              padding: 10,
                              justifyContent: "center",
                              alignItems: "center",
                              borderRadius: 5,
                              alignSelf: "center",
                              marginRight: 15,
                              borderColor: "red",
                            }}
                            onPress={() => {
                              this.setState({
                                showPopUpPrivateLandAddNew: false,
                              });
                            }}
                          >
                            <Text style={{ color: "#797979", fontSize: 15 }}>
                              Cancel
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </ScrollView>
                    </View>
                  </PopUpModalViolet>
                  <View style={Theme.ViewContent}>
                    <FlatList
                      horizontal
                      showsVerticalScrollIndicator
                      pagingEnabled
                      bounces={false}
                      showsHorizontalScrollIndicator={false}
                      data={this.state.ListProcessValuationREApartment}
                      renderItem={({ item, index }) =>
                        this.renderItemApart(index, item)
                      }
                      keyExtractor={(item, i) => i.toString()}
                    />
                    {/* <Paginator data={this.state.ListProcessValuationREApartment} /> */}
                  </View>
                  <PopUpModalViolet
                    resetState={this.showPopUpPrivateLandEdit}
                    modalVisible={this.state.showPopUpPrivateLandEdit}
                    title="Phần sử dụng đất riêng"
                  >
                    <KeyboardAvoidingView
                      behavior="height"
                      style={{ paddingHorizontal: 8 }}
                    >
                      <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.ItemKS}>
                          <View
                            style={{
                              flex: 1,
                              marginBottom: 3,
                              flexDirection: "row",
                            }}
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
                              value={this.state.InfactFloorAreaREApart}
                              style={[Theme.TextInput]}
                              onChangeText={(val) => {
                                // let item = this.state.ProcessValuationREApartment;
                                // item.InfactFloorArea = Utility.ConvertToDecimal(val);
                                this.setState({ InfactFloorAreaREApart: val });
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
                            style={{
                              flex: 1,
                              marginBottom: 3,
                              flexDirection: "row",
                            }}
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
                              SelectedValue={this.state.numFontageType}
                              OnSelectedItemChanged={(val) => {
                                // itemApart.FrontageType = val.Key;
                                // this.setState({
                                //   ProcessValuationREApartment: itemApart,
                                //   ShowFontTypeDetail: false,
                                // })
                                let item = this.state
                                  .ProcessValuationREApartment;
                                item.FrontageType = val.Key;
                                this.setState({
                                  numFontageType: val.Key,
                                });
                                this.setState({
                                  tempApart: item,
                                });
                                this.frontageTypeDetail(val.Key);
                              }}
                            ></DropDownBox>
                          </View>
                        </View>
                        <View>
                          <View
                            style={{
                              display: this.state.ShowFontTypeDetail
                                ? "flex"
                                : "none",
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
                                  value={this.state.LaneWidthMinREApart}
                                  style={[Theme.TextInput]}
                                  onChangeText={(val) => {
                                    // let item = this.state.ProcessValuationREApartment;
                                    // item.LaneWidthMin = Utility.ConvertToDecimal(val);
                                    this.setState({ LaneWidthMinREApart: val });
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
                              </View>
                              <View style={{ flex: 1 }}>
                                <TextInput
                                  keyboardType={"numeric"}
                                  multiline={false}
                                  maxLength={15}
                                  value={this.state.LaneWidthMaxREApart}
                                  style={[Theme.TextInput]}
                                  onChangeText={(val) => {
                                    // let item = this.state.ProcessValuationREApartment;
                                    // item.LaneWidthMax = Utility.ConvertToDecimal(val);
                                    this.setState({ LaneWidthMaxREApart: val });
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
                            </View>
                            <View style={{ flex: 1 }}>
                              <TextInput
                                keyboardType={"numeric"}
                                multiline={false}
                                maxLength={15}
                                value={this.state.DistanceToMainStreetApart}
                                style={[Theme.TextInput]}
                                onChangeText={(val) => {
                                  // let item = this.state.ProcessValuationREApartment;
                                  // item.DistanceToMainStreet = Utility.ConvertToDecimal(val);
                                  this.setState({
                                    DistanceToMainStreetApart: val,
                                  });
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
                            style={{
                              flex: 1,
                              marginBottom: 3,
                              flexDirection: "row",
                            }}
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
                              SelectedValue={this.state.numContiguousStreetType}
                              OnSelectedItemChanged={(val) => {
                                let item = this.state
                                  .ProcessValuationREApartment;
                                item.ContiguousStreetType =
                                  val.SystemParameterID;
                                this.setState({
                                  tempApart: item,
                                  numContiguousStreetType:
                                    val.SystemParameterID,
                                });
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
                          <View style={styles.Item}>
                            <View style={{ flex: 2, flexDirection: "row" }}>
                              <Text>
                                Mô tả tài sản trên đất{" "}
                                <Text style={{ color: "red" }}>*</Text>
                              </Text>
                            </View>
                          </View>
                          <View style={{ flex: 3 }}>
                            <TextInput
                              textAlignVertical="top"
                              style={[Theme.TextView, {}]}
                              value={
                                this.state.ProcessValuationREApartment
                                  .ConstructionDescription
                              }
                              onChangeText={(val) => {
                                let item = this.state
                                  .ProcessValuationREApartment;
                                item.ConstructionDescription = val;
                                this.setState({ tempApart: item });
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
                        <View
                          style={{
                            flex: 2,
                            marginTop: 10,
                            flexDirection: "row",
                            justifyContent: "flex-end",
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              flex: 1,
                              //width: 80,
                              backgroundColor: "#ae55e6",
                              padding: 10,
                              justifyContent: "center",
                              alignItems: "center",
                              borderRadius: 5,
                              alignSelf: "center",
                              marginLeft: 15,
                              borderColor: "red",
                              marginRight: 10,
                            }}
                            onPress={() => {
                              this.setState(
                                { showPopUpPrivateLandEdit: false },
                                async () => {
                                  await this.UpdateItemPrivateLand(
                                    this.state.ProcessValuationREApartment
                                      .ProcessValuationREApartmentID
                                  );
                                }
                              );
                            }}
                          >
                            <Text style={{ color: "#f0ffff" }}>Update</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              flex: 1,
                              //width: 80,
                              backgroundColor: "#f2f2f2",
                              padding: 10,
                              justifyContent: "center",
                              alignItems: "center",
                              borderRadius: 5,
                              alignSelf: "center",
                              marginRight: 15,
                              borderColor: "red",
                            }}
                            onPress={() => {
                              this.setState({
                                showPopUpPrivateLandEdit: false,
                              });
                            }}
                          >
                            <Text style={{ color: "#797979", fontSize: 15 }}>
                              Cancel
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </ScrollView>
                    </KeyboardAvoidingView>
                  </PopUpModalViolet>

                  <View style={Theme.ViewTitle}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "bold",
                        color: "#FFFFFF",
                      }}
                    >
                      Những yếu tố thuận lợi và lưu ý
                    </Text>
                  </View>
                </View>
                <View style={Theme.ViewContent}>
                  <View style={styles.TextAndDrop}>
                    <View style={{ marginBottom: 3, flexDirection: "row" }}>
                      <Text>Những yếu tố thuận lợi </Text>
                      <Text style={{ color: "red" }}>*</Text>
                    </View>
                    <View>
                      <TextInput
                        numberOfLines={4}
                        multiline={true}
                        textAlignVertical="top"
                        style={[Theme.TextView, { height: 75 }]}
                        value={pv.Advantage}
                        onChangeText={(val) => {
                          pv.Advantage = val;
                          this.setState({ ProcessValuation: pv });
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
                      <Text>Những yếu tố không thuận lợi </Text>
                      <Text style={{ color: "red" }}>*</Text>
                    </View>
                    <View>
                      <TextInput
                        numberOfLines={4}
                        multiline={true}
                        textAlignVertical="top"
                        style={[Theme.TextView, { height: 75 }]}
                        value={pv.DisAdvantage}
                        onChangeText={(val) => {
                          pv.DisAdvantage = val;
                          this.setState({ ProcessValuation: pv });
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
                        value={pv.WorkfieldOtherInfomation}
                        onChangeText={(val) => {
                          pv.WorkfieldOtherInfomation = val;
                          this.setState({ ProcessValuation: pv });
                        }}
                      />
                    </View>
                  </View>
                </View>
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
