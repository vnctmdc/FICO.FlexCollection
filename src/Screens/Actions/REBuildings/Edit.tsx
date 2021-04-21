import React, { Component, useRef, useState } from "react";
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
  Animated,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Theme from "../../../Themes/Default";
import ApiUrl from "../../../constants/ApiUrl";
import { WebView } from "react-native-webview";
import Toolbar from "../../../components/Toolbar";
import HttpUtils from "../../../Utils/HttpUtils";
import SMX from "../../../constants/SMX";
import { inject, observer } from "mobx-react";
import GlobalStore from "../../../Stores/GlobalStore";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Gallery from "../../../components/Gallery";
import GalleryImageItem from "../../../components/GalleryImageItem";
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
import adm_Attachment from "../../../Entities/adm_Attachment";
import AttachmentDto from "../../../DtoParams/AttachmentDto";
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
import { number } from "prop-types";
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
  InfactLandAreaPrivate?: string;
  ProcessValuationEquipment?: ProcessValuationEquipment;
  FontMoney?: number;
  TransformerType?: number;
  ActualArea?: string;
  Advantage?: string;
  DisAdvantage?: string;
  DistanceToMainStreet?: string;
  LaneWidthMin?: string;
  LaneWidthMax?: string;
  TypeOfConstruction?: string;
  InformationNote?: string;
  numContructiontype?: number;
  showConfirmAddNew: boolean;
  showConfirmEdit: boolean;
  CheckSaveFalse: boolean;
  ProcessValuationRE?: ProcessValuationRE;
  Show1: boolean;
  ShowFontTypeDetail: boolean;
  Views: any;
  // ListAttachmentImageOutSide?: adm_Attachment[];
  // ListAttachmentImageInSide?: adm_Attachment[];
  // tempImageOutSide?: adm_Attachment[];
  // tempImageInSide?: adm_Attachment[];
  // resetListAttachmentImageOutSide?: adm_Attachment[];
  // resetListAttachmentImageInSide?: adm_Attachment[];
  AttachmentImageOutSide?: adm_Attachment;
  AttachmentImageInSide?: adm_Attachment;
  ResetAttachmentImageOutSide?: adm_Attachment;
  ResetAttachmentImageInSide?: adm_Attachment;
  Attachment?: adm_Attachment;
  LstBuildingType?: SystemParameter[];
  LstContiguousStreetType?: SystemParameter[];
  LstConstructionType?: SystemParameter[];
  ListProcessValuationREConstruction?: ProcessValuationREConstruction[];
  ProcessValuationREConstruction?: ProcessValuationREConstruction;
  ResetProcessValuationREConstruction?: ProcessValuationREConstruction;
  tempPvRECon?: ProcessValuationREConstruction;
  resetPvRECon?: ProcessValuationREConstruction;
  location?: MarkerObject;
}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class ReBuildingsSrc extends Component<iProps, iState> {
  constructor(props: any) {
    super(props);
    this.state = {
      showCustomerInfo: true,
      ProcessValuation: new ProcessValuation(),
      ProcessValuationDocument: new ProcessValuationDocument(),
      ProcessValuationEquipment: new ProcessValuationEquipment(),
      ProcessValuationREConstruction: new ProcessValuationREConstruction(),
      ResetProcessValuationREConstruction: new ProcessValuationREConstruction(),
      tempPvRECon: new ProcessValuationREConstruction(),
      resetPvRECon: new ProcessValuationREConstruction(),
      Attachment: new adm_Attachment(),
      AttachmentImageOutSide: new adm_Attachment(),
      AttachmentImageInSide: new adm_Attachment(),
      // tempImageOutSide: [],
      // tempImageInSide: [],
      WorkfieldDistance: "",
      InfactLandAreaPrivate: "",
      LaneWidthMin: "",
      LaneWidthMax: "",
      DistanceToMainStreet: "",
      Type: "",
      Specification: "",
      Description: "",
      numContructiontype: 1,
      FontMoney: 1,
      ActualArea: "300.00",
      Advantage: "Những yếu tố thuận lợi *",
      DisAdvantage: "Những yếu tố không thuận lợi *",
      TypeOfConstruction: "",
      InformationNote: "Lưu ý",
      Show1: false,
      ShowFontTypeDetail: true,
      Views: [],
      showConfirmAddNew: false,
      showConfirmEdit: false,
      CheckSaveFalse: false,
      ProcessValuationRE: new ProcessValuationRE(),
      ProcessValuationDocumentID: 1,
      // ListAttachmentImageOutSide: [],
      // ListAttachmentImageInSide: [],
      // resetListAttachmentImageOutSide: [],
      // resetListAttachmentImageInSide: [],
      ResetAttachmentImageOutSide: new adm_Attachment(),
      ResetAttachmentImageInSide: new adm_Attachment(),
    };
  }
  async componentDidMount() {
    this.getLocationAsync();
    await this.LoadData();
    this.props.GlobalStore.UpdateImageTrigger = () => {
      this.LoadData();
    };
    await this.showInfromContiguousFrontage();
  }

  async showInfromContiguousFrontage() {
    try {
      this.props.GlobalStore.ShowLoading();
      if (
        this.state.ProcessValuationRE.FrontageType ==
          Enums.ProcessValuationREFrontageType.MatNgoHem ||
        this.state.ProcessValuationRE.FrontageType ==
          Enums.ProcessValuationREFrontageType.MatDuongNoiBo
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
  // async LoadDataImage(id) {
  //   try {
  //     console.log("IFF", id);

  //     this.props.GlobalStore.ShowLoading();
  //     var req = new AttachmentDto();
  //     req.ProcessValuationREConstructionID = id;
  //     let res = await HttpUtils.post<AttachmentDto>(
  //       ApiUrl.Attachment_Execute,
  //       SMX.ApiActionCode.GetListImage,
  //       JSON.stringify(req)
  //     );
  //     console.log("Hihi", res.ListAttachment);
  //     //console.log(res);
  //     if (res) {
  //       this.setState({
  //         ListAttachment: res!.ListAttachment,
  //         // IsHasSoDoQuyHoach: res.IsHasSoDoQuyHoach,
  //         // IsHasSoDoVeTinh: res.IsHasSoDoVeTinh,
  //       });

  //       // this.state.ListAttachment.forEach((element) => {
  //       //   element.RefID = this.props.route.params.MortgageAssetID;
  //       //   element.RefType = 1;
  //       // });
  //     }
  //     this.props.GlobalStore.HideLoading();
  //   } catch (ex) {
  //     console.log("SO SAD", ex);

  //     this.props.GlobalStore.Exception = ex;
  //     this.props.GlobalStore.HideLoading();
  //   }
  // }
  _pickImage = async (idPVRECon: number, RefCode: string) => {
    //console.log("Danh sách ảnh", this.state.tempPvRECon.ListAttachmentImage);
    //console.log("Hihihihi", this.state.AttachmentImageInSide);
    try {
      //@ts-ignore
      //status === "granted";
      // console.log("AAA");
      // let { status } = await Permissions.getAsync(Permissions.CAMERA_ROLL);
      // if (status !== "granted") {
      //   return;
      // }
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        base64: true,
        allowsEditing: true,
      });
      this._handleImagePicked(result, idPVRECon, RefCode);
    } catch (ex) {}
  };
  _handleImagePicked = async (result, idPVRECon, RefCode) => {
    try {
      //console.log("RefCode HI", this.state.tempImageInSide);

      //console.log("IDD", idPVRECon);
      this.props.GlobalStore.ShowLoading();
      var req = new AttachmentDto();
      var att = new adm_Attachment();
      att.RefID = idPVRECon;
      //att.ImageBase64String = result.base64;
      att.FileContent = result.base64;
      att.RefCode = RefCode;
      //Kiểm tra là hình ảnh bên ngoài hay bên trong
      if (
        this.state.AttachmentImageOutSide != null ||
        this.state.AttachmentImageOutSide != undefined
      ) {
        if (RefCode == SMX.WorkfieldImageType.HinhAnh_BenNgoai) {
          let item = this.state.AttachmentImageOutSide;
          att.AttachmentID = item.AttachmentID;
        }
      }
      //console.log("Vẫn vào khi rỗng");
      if (
        this.state.AttachmentImageInSide != null ||
        this.state.AttachmentImageInSide != undefined
      ) {
        if (RefCode == SMX.WorkfieldImageType.HinhAnh_BenTrong) {
          let item = this.state.AttachmentImageInSide;
          att.AttachmentID = item.AttachmentID;
        }
      }
      if (result.uri.toString() != "") {
        let uriArray = result.uri.toString().split("/");
        if (uriArray.length > 0) {
          let filename = uriArray[uriArray.length - 1];
          att.FileName = filename;
          att.DisplayName = filename;

          let fileExternal = filename.split(".")[1];
          att.ContentType = "image/" + fileExternal;
        }
      }
      req.Attachment = att;
      //console.log("giá trị đưa về", req);

      let res = await HttpUtils.post<AttachmentDto>(
        ApiUrl.Attachment_Execute,
        SMX.ApiActionCode.UploadImage,
        JSON.stringify(req)
      );
      //console.log("RES né", res);
      // console.log("Chưa bị xóa", this.state.tempImageOutSide);
      // console.log("Khi xóa", this.state.tempImageOutSide.splice(0, 1));
      // console.log(" Sau khi xóa", this.state.tempImageOutSide);

      //let tempLstAttachment = this.state.ListAttachment;
      if (res) {
        if (RefCode == SMX.WorkfieldImageType.HinhAnh_BenNgoai) {
          // let tempLstAttachment = this.state.resetListAttachmentImageOutSide;
          // tempLstAttachment.unshift(res!.Attachment);
          //this.state.tempImageOutSide.splice(0, 1);
          // this.setState({
          //   tempImageOutSide: undefined,
          // });
          this.setState({
            AttachmentImageOutSide: res!.Attachment,
            // ListAttachmentImageOutSide: tempLstAttachment,
            // tempImageOutSide: tempLstAttachment,
          });
        }
        if (RefCode == SMX.WorkfieldImageType.HinhAnh_BenTrong) {
          // let tempLstAttachment = this.state.resetListAttachmentImageInSide;
          // tempLstAttachment.unshift(res!.Attachment);
          //this.state.tempImageInSide.splice(0);
          // this.setState({
          //   tempImageInSide: undefined,
          // });
          this.setState({
            AttachmentImageInSide: res!.Attachment,
            // ListAttachmentImageInSide: tempLstAttachment,
            // tempImageInSide: tempLstAttachment,
          });
          //console.log("Danh sách ảnh của tempImageInSide");
        }

        //console.log("List tempLstAttachment", tempLstAttachment);
        // this.setState({
        //   ListAttachment
        // })
        //console.log("Anh moi len", res!.Attachment);
      }

      // req.Attachment = this.state.SelectedDefault;
      // att = req.Attachment;
      // att.RefID = this.props.route.params.ProcessValuationDocumentID;
      this.props.GlobalStore.HideLoading();
      if (!result.cancelled) {
      }
      //this.LoadData();
      //await this.LoadDataImage(idPVRECon);
      this.props.GlobalStore.HideLoading();
    } catch (e) {
      // console.log({ uploadResponse });
      // console.log({ uploadResult });
      // console.log({ e });
      // alert("Upload failed, sorry :(");
    } finally {
      this.setState({
        // uploading: false
      });
    }
  };

  async LoadData() {
    try {
      this.props.GlobalStore.ShowLoading();
      var req = new ActionMobileDto();
      req.MACode2 = SMX.MortgageAssetCode2.REBuildings;
      req.ProcessValuationDocumentID = this.props.route.params.ProcessValuationDocumentID;

      let res = await HttpUtils.post<ActionMobileDto>(
        ApiUrl.Action_Execute,
        SMX.ApiActionCode.LoadData,
        JSON.stringify(req)
      );
      //console.log("Hihi", res);
      //console.log("LisCon", res.LstConstructionType);

      if (res) {
        this.setState(
          {
            ProcessValuationRE: res!.ProcessValuationRE,
            ProcessValuationDocumentID: res!.ProcessValuationDocumentID,
            ProcessValuationDocument: res!.ProcessValuationDocument,
            ProcessValuation: res!.ProcessValuation,
            LstBuildingType: res!.LstBuildingType,
            LstContiguousStreetType: res!.LstContiguousStreetType,
            LstConstructionType: res!.LstConstructionType,
            ListProcessValuationREConstruction: res!
              .ListProcessValuationREConstruction,
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
            Advantage: res!.ProcessValuationRE.WorkfieldDistance
              ? res!.ProcessValuationRE.Advantage + ""
              : "",
            DisAdvantage: res!.ProcessValuationRE.WorkfieldDistance
              ? res!.ProcessValuationRE.DisAdvantage + ""
              : "",
            // tempImageOutSide: this.state.resetListAttachmentImageOutSide,
            // tempImageInSide: this.state.resetListAttachmentImageInSide,
            showConfirmAddNew: false,
            showConfirmEdit: false,
          },
          () => {
            this.forceUpdate();
          }
        );
      }
      //console.log("HihiHe", this.state.ListProcessValuationREConstruction);
      //console.log("Hihi ProcessValuationRE", this.state.ProcessValuationRE);

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
        !this.state.ProcessValuationRE.BuildingType ||
        Utility.GetDecimalString(this.state.ProcessValuationRE.BuildingType) ==
          ""
      ) {
        this.props.GlobalStore.HideLoading();
        let message = "[Loại công trình] Không được để trống";
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
      this.props.GlobalStore.HideLoading();
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

  async AddNewItemConstruction() {
    try {
      this.props.GlobalStore.ShowLoading();
      var req = new ActionMobileDto();
      // var pvRE = this.state.ProcessValuationRE;
      // var pvREC = this.state.ProcessValuationREConstruction;
      let lstCon = this.state.ListProcessValuationREConstruction;
      let pvREC = this.state.ProcessValuationREConstruction;
      let resetpvRECon = new ProcessValuationREConstruction();

      //let resetListAttachmentImage = new adm_Attachment[];
      // Kiểm tra lỗi nhập liệu
      // if (
      //   !this.state.ProcessValuationREConstruction.ConstructionType ||
      //   Utility.GetDecimalString(
      //     this.state.ProcessValuationREConstruction.ConstructionType
      //   ) == ""
      // ) {
      //   this.props.GlobalStore.HideLoading();
      //   let message = "[Loại công trình] Không được để trống";
      //   this.props.GlobalStore.Exception = ClientMessage(message);
      //   return;
      // }

      req.MACode2 = SMX.MortgageAssetCode2.REBuildings;
      pvREC.ProcessValuationREID = this.state.ProcessValuationRE.ProcessValuationREID;

      // Đổ dữ liệu vào req
      req.ProcessValuationREConstruction = pvREC;
      req.SaveType = Enums.SaveType.Temporary;

      //console.log(req);

      let res = await HttpUtils.post<ActionMobileDto>(
        ApiUrl.Action_Execute,
        SMX.ApiActionCode.SaveActions,
        JSON.stringify(req)
      );
      //console.log("HihiOKOK", res!.ProcessValuationREConstruction);

      await this.getListContruction();
      // this.setState({
      //     tempPvRECon: res!.ProcessValuationREConstruction,
      // })
      //console.log("Hihi", res!.ProcessValuationREConstruction);

      if (res) {
        this.setState({
          tempPvRECon: res!.ProcessValuationREConstruction,
        });
        //console.log("CYSMTA", this.state.tempPvRECon);

        this.setState({
          showConfirmAddNew: true,
        });
      }
      this.props.GlobalStore.HideLoading();
      // let mess = "Thêm mới CTXD thành công!";
      // this.props.GlobalStore.Exception = ClientMessage(mess);
    } catch (ex) {
      this.props.GlobalStore.HideLoading();
      this.props.GlobalStore.Exception = ex;
    }
  }
  showConfirmAddNew = () => {
    this.setState({ showConfirmAddNew: !this.state.showConfirmAddNew });
  };
  showConfirmEdit = () => {
    this.setState({ showConfirmEdit: !this.state.showConfirmEdit });
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
  // async GetListImageInItem(ProcessValuationREConstructionID: number) {
  //   try {
  //     this.props.GlobalStore.ShowLoading();
  //     var req = new AttachmentDto();
  //     req.ProcessValuationREConstructionID = ProcessValuationREConstructionID;
  //     let res = await HttpUtils.post<AttachmentDto>(
  //       ApiUrl.Attachment_Execute,
  //       SMX.ApiActionCode.GetListImage,
  //       JSON.stringify(req)
  //     );
  //     console.log("Danh sach anh sau khi xoa");

  //     this.props.GlobalStore.HideLoading();
  //   } catch (ex) {
  //     this.props.GlobalStore.Exception = ex;
  //     this.props.GlobalStore.HideLoading();
  //   }
  // }
  async SetRemove(ImageType: string) {
    //console.log("Vao SetRemove");
    await this.getListContruction();
    try {
      this.props.GlobalStore.ShowLoading();
      // if (ImageType === SMX.WorkfieldImageType.HinhAnh_BenNgoai) {
      //   console.log("tempImageOutSide", this.state.tempImageOutSide);
      //   this.setState({
      //     tempImageOutSide: this.state.resetListAttachmentImageOutSide,
      //   });
      // }
      // if (ImageType === SMX.WorkfieldImageType.HinhAnh_BenTrong) {
      //   console.log("tempImageOutSide");
      //   this.setState({
      //     tempImageInSide: this.state.resetListAttachmentImageInSide,
      //   });
      //   console.log("Sau khi xóa: ", this.state.tempImageInSide);
      // }
      this.props.GlobalStore.HideLoading();
    } catch (ex) {
      this.props.GlobalStore.Exception = ex;
      this.props.GlobalStore.HideLoading();
    }
  }
  async btn_Save(saveType: number) {
    try {
      this.props.GlobalStore.ShowLoading();
      let req = new ActionMobileDto();
      req.MACode2 = SMX.MortgageAssetCode2.REBuildings;
      // //console.log(123,this.state.ProcessValuationDocument);
      // //console.log(456,this.state.ProcessValuationRE);
      // //console.log(789, this.state.ProcessValuation);
      let pvD = this.state.ProcessValuationDocument;
      let pvRE = this.state.ProcessValuationRE;
      let pv = this.state.ProcessValuation;
      //Kiểm tra input khi nhập

      // if (!this.state.ProcessValuationDocument.WorkfieldDistance || Utility.GetDecimalString(this.state.ProcessValuationDocument.WorkfieldDistance) == '') {
      //     this.props.GlobalStore.HideLoading();
      //     let message = "[Khoảng cách đi thẩm định (km)] Không được để trống";
      //     this.props.GlobalStore.Exception = ClientMessage(message);
      //     return;
      // }
      if (saveType == Enums.SaveType.Completed) {
        if (
          !this.state.InfactLandAreaPrivate ||
          this.state.InfactLandAreaPrivate == ""
        ) {
          this.props.GlobalStore.HideLoading();
          let message = "[Diện tích thực tế] Không được để trống";
          this.props.GlobalStore.Exception = ClientMessage(message);
          this.setState({
            CheckSaveFalse: true,
          });
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
          this.setState({
            CheckSaveFalse: true,
          });
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
            this.setState({
              CheckSaveFalse: true,
            });
            return;
          }
          if (!this.state.LaneWidthMax || this.state.LaneWidthMax == "") {
            this.props.GlobalStore.HideLoading();
            let message =
              "[Độ rộng mặt ngõ/hẻm/đường nội bộ lớn nhất (m)] Không được để trống";
            this.props.GlobalStore.Exception = ClientMessage(message);
            this.setState({
              CheckSaveFalse: true,
            });
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
          this.setState({
            CheckSaveFalse: true,
          });
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
          this.setState({
            CheckSaveFalse: true,
          });
          return;
        }
        if (!this.state.Advantage || this.state.Advantage == "") {
          this.props.GlobalStore.HideLoading();
          let message = "[Những yếu tố thuận lợi] Không được để trống";
          this.props.GlobalStore.Exception = ClientMessage(message);
          this.setState({
            CheckSaveFalse: true,
          });
          return;
        }
        if (!this.state.DisAdvantage || this.state.DisAdvantage == "") {
          this.props.GlobalStore.HideLoading();
          let message = "[Những yếu tố không thuận lợi] Không được để trống";
          this.props.GlobalStore.Exception = ClientMessage(message);
          this.setState({
            CheckSaveFalse: true,
          });
          return;
        }

        if (
          !this.state.ProcessValuationRE.BuildingType ||
          Utility.GetDecimalString(
            this.state.ProcessValuationRE.BuildingType
          ) == ""
        ) {
          this.props.GlobalStore.HideLoading();
          let message = "[Loại công trình] Không được để trống";
          this.props.GlobalStore.Exception = ClientMessage(message);
          this.setState({
            CheckSaveFalse: true,
          });
          return;
        }
      }

      let stringAdvantage = this.state.Advantage;
      let stringDisAdvantage = this.state.DisAdvantage;
      let numWorkfieldDistance = this.state.WorkfieldDistance;
      let numInfactLandAreaPrivate = this.state.InfactLandAreaPrivate;
      let numLaneWidthMin = this.state.LaneWidthMin;
      let numLaneWidthMax = this.state.LaneWidthMax;
      let numDistanceToMainStreet = this.state.DistanceToMainStreet;
      // Đổ dữ liệu vào pvRE
      pvRE.ProcessValuationREID = this.state.ProcessValuationRE.ProcessValuationREID;
      pvRE.ProcessValuationDocumentID = this.state.ProcessValuationRE.ProcessValuationDocumentID;
      pvRE.Version = this.state.ProcessValuationRE.Version;
      pvRE.FrontageType = this.state.ProcessValuationRE.FrontageType;
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
      //pvRE.DistanceToMainStreet = this.state.ProcessValuationRE.DistanceToMainStreet;
      pvRE.ContiguousStreetType = this.state.ProcessValuationRE.ContiguousStreetType;
      pvRE.BuildingType = this.state.ProcessValuationRE.BuildingType;
      pvRE.InfactLandAreaPrivate =
        numInfactLandAreaPrivate && numInfactLandAreaPrivate.length != 0
          ? parseFloat(numInfactLandAreaPrivate.split(",").join("."))
          : undefined;
      pvRE.ProjectNote = this.state.ProcessValuationRE.ProjectNote;
      pvRE.Description = this.state.ProcessValuationRE.Description;

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
      pv.Advantage = stringAdvantage;
      pv.DisAdvantage = stringDisAdvantage;
      pv.WorkfieldOtherInfomation = this.state.ProcessValuation.WorkfieldOtherInfomation;

      // Đổ dữ liệu vào request
      req.ProcessValuationDocument = pvD;
      req.ProcessValuation = pv;
      req.ProcessValuationRE = pvRE;
      req.SaveType = saveType;
      //console.log("Hihi", req);

      let res = await HttpUtils.post<ActionMobileDto>(
        ApiUrl.Action_Execute,
        SMX.ApiActionCode.SaveActions,
        JSON.stringify(req)
      );

      //ProcessValuationDocument: res!.ProcessValuationDocument,

      //console.log("HIHI");
      this.setState({
        CheckSaveFalse: false,
      });
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
  async getListContruction() {
    //console.log("Vào làm getListContruction");

    try {
      this.props.GlobalStore.ShowLoading();
      var req = new ActionMobileDto();
      let itempvRE = this.state.ProcessValuationRE;
      req.ProcessValuationRE = itempvRE;
      req.MACode2 = SMX.MortgageAssetCode2.REBuildings;
      let res = await HttpUtils.post<ActionMobileDto>(
        ApiUrl.Action_Execute,
        SMX.ApiActionCode.LoadListConstruction,
        JSON.stringify(req)
      );
      // //console.log(
      //   "O trong getListContruction",
      //   res!.ListProcessValuationREConstruction
      // );

      if (res) {
        this.setState({
          ListProcessValuationREConstruction: res!
            .ListProcessValuationREConstruction,
          showConfirmAddNew: false,
          showConfirmEdit: false,
        });
      }

      this.props.GlobalStore.HideLoading();
    } catch (ex) {
      this.props.GlobalStore.Exception = ex;
      this.props.GlobalStore.HideLoading();
    }
  }

  async UpdateItemCon(id) {
    try {
      this.props.GlobalStore.ShowLoading();
      var req = new ActionMobileDto();
      // var pvRE = this.state.ProcessValuationRE;
      // var pvREC = this.state.ProcessValuationREConstruction;
      //var lstCon = this.state.ListProcessValuationREConstruction;
      let pvREC = this.state.tempPvRECon;
      // Kiểm tra lỗi nhập liệu
      if (
        !pvREC.ConstructionType ||
        Utility.GetDecimalString(pvREC.ConstructionType) == ""
      ) {
        this.props.GlobalStore.HideLoading();
        let message = "[Loại công trình] Không được để trống";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }
      //console.log("Nó vẫn chạy tiếp");

      pvREC.ProcessValuationREID = this.state.ProcessValuationRE.ProcessValuationREID;
      pvREC.ProcessValuationREConstructionID = id;
      pvREC.Name = this.state.tempPvRECon.Name;
      pvREC.Description = this.state.tempPvRECon.Description;
      // Đổ dữ liệu vào req
      req.ProcessValuationREConstruction = pvREC;
      req.MACode2 = SMX.MortgageAssetCode2.REBuildings;
      req.SaveType = Enums.SaveType.Temporary;

      ////console.log(req);

      let res = await HttpUtils.post<ActionMobileDto>(
        ApiUrl.Action_Execute,
        SMX.ApiActionCode.SaveActions,
        JSON.stringify(req)
      );

      await this.getListContruction();
      this.setState({
        // ListAttachmentImageOutSide: resetListAttachmentImageOutSide,
        // ListAttachmentImageInSide: resetListAttachmentImageInSide,
      });

      // if (res) {
      //     this.setState({

      //     });
      // }

      this.props.GlobalStore.HideLoading();
      let mess = "Thao tác thành công!";
      this.props.GlobalStore.Exception = ClientMessage(mess);
    } catch (ex) {
      this.props.GlobalStore.Exception = ex;
      this.props.GlobalStore.HideLoading();
    }
  }
  async EditItemContruction(item) {
    ////console.log(item);

    let itemCon = new ProcessValuationREConstruction();
    itemCon = item;
    // return (

    // );
  }
  async deleteConDetail(id) {
    try {
      this.props.GlobalStore.ShowLoading();
      ////console.log("HIHI", id);

      var req = new ActionMobileDto();
      let itemCon = new ProcessValuationREConstruction();
      itemCon.ProcessValuationREConstructionID = id;
      req.ProcessValuationREConstruction = itemCon;
      ////console.log(123, req);

      //Xóa công trình xây dựng
      let res = await HttpUtils.post<ActionMobileDto>(
        ApiUrl.Action_Execute,
        SMX.ApiActionCode.DeleteConstruction,
        JSON.stringify(req)
      );

      //Lấy lại List công trình xây dựng update
      await this.getListContruction();

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
  renderItem(index: number, item: ProcessValuationREConstruction) {
    //console.log("Item con ne", item.ListAttachmentImage);
    //console.log("Du liệu bản ghi", item);

    //console.log(111, this.state.tempPvRECon.ConstructionType);
    //var numContructionType
    // let itemCon = this.state.tempPvRECon;
    // let lstConTemp = this.state.LstConstructionType;
    let coutLstItem = this.state.ListProcessValuationREConstruction.length;
    let numContructionType;
    let tempImgOutSide = this.state.ResetAttachmentImageOutSide;
    let tempImgInSide = this.state.ResetAttachmentImageInSide;
    if (
      item.ListAttachmentImage != undefined ||
      item.ListAttachmentImage != null
    ) {
      tempImgOutSide = item.ListAttachmentImage.filter(
        (x) => x.RefCode == SMX.WorkfieldImageType.HinhAnh_BenNgoai
      )[0]
        ? item.ListAttachmentImage.filter(
            (x) => x.RefCode == SMX.WorkfieldImageType.HinhAnh_BenNgoai
          )[0]
        : undefined;

      tempImgInSide = item.ListAttachmentImage.filter(
        (x) => x.RefCode == SMX.WorkfieldImageType.HinhAnh_BenTrong
      )[0]
        ? item.ListAttachmentImage.filter(
            (x) => x.RefCode == SMX.WorkfieldImageType.HinhAnh_BenTrong
          )[0]
        : undefined;
    }
    // if(tempImgOutSide != null || tempImgOutSide != undefined)
    // {
    //   tempImgOutSide.splice(1,1);
    // }

    // if(tempImgInSide != null || tempImgInSide != undefined)
    // {
    //   tempImgInSide.splice(1,1);
    // }
    //console.log("TEMP anh trong", tempImgInSide);

    //console.log(123, itemCon.ConstructionType);
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
              Loại công trình :{" "}
            </Text>
            <Text style={{ flex: 1, fontWeight: "600" }}>
              {this.state.LstConstructionType ? (
                <Text style={[Theme.TextView, {}]}>
                  {this.state.LstConstructionType.filter(
                    (x) => x.SystemParameterID == item.ConstructionType
                  )[0]
                    ? this.state.LstConstructionType.filter(
                        (x) => x.SystemParameterID == item.ConstructionType
                      )[0].Name
                    : " "}
                </Text>
              ) : undefined}
            </Text>
            {/* <Text>{index+1}/{(this.state.LstConstructionType)}</Text> */}
          </View>
          <View style={{ flex: 2, flexDirection: "row", marginBottom: 2 }}>
            <Text style={{ flex: 1, fontWeight: "bold" }}>
              Chi tiết tên công trình :{" "}
            </Text>
            <Text style={{ flex: 1, fontWeight: "600" }}>{item.Name}</Text>
          </View>
          <View style={{ flex: 2, flexDirection: "row", marginBottom: 2 }}>
            <Text style={{ flex: 1, fontWeight: "bold" }}>
              Mô tả chi tiết :{" "}
            </Text>
            <Text style={{ flex: 1, fontWeight: "600" }}>
              {item.Description}
            </Text>
          </View>
          <View style={{ flex: 2, flexDirection: "row" }}>
            <View style={{ flex: 2, flexDirection: "column" }}>
              {tempImgOutSide != null || tempImgOutSide != undefined ? (
                <GalleryImageItem
                  navigation={this.props.navigation}
                  Images={tempImgOutSide}
                  numberColumn={1}
                  WorkfieldImageType={SMX.WorkfieldImageType.HinhAnh_BenNgoai}
                  allowEdit={false}
                  allowRemove={false}
                />
              ) : (
                <Image
                  style={styles.TinyImage}
                  source={require("../../../../assets/notfound.png")}
                />
              )}
              <Text>Ảnh chụp bên ngoài</Text>
            </View>
            <View style={{ flex: 2, flexDirection: "column" }}>
              {tempImgInSide != null || tempImgInSide != undefined ? (
                <GalleryImageItem
                  navigation={this.props.navigation}
                  Images={tempImgInSide}
                  WorkfieldImageType={SMX.WorkfieldImageType.HinhAnh_BenTrong}
                  numberColumn={1}
                  allowEdit={false}
                  allowRemove={false}
                />
              ) : (
                <Image
                  style={styles.TinyImage}
                  source={require("../../../../assets/notfound.png")}
                />
              )}
              <Text>Ảnh chụp bên trong</Text>
            </View>
          </View>
          <View style={{ flex: 2, flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => {
                //Alert.alert("Hihi", Utility.GetDecimalString(item.ConstructionType))
                // numContructionType = item.ConstructionType,
                // this.setState({
                //     numContructiontype: item.ConstructionType,
                //     showConfirmEdit: true,
                //     tempPvRECon: item,
                // });
                //this.forceUpdate()
                //Alert.alert("HIHI",  Utility.GetDecimalString(numContructionType))
                //itemCon = item;
                //this.showEditContruction(item)
                this.setState(
                  {
                    numContructiontype: item.ConstructionType,
                    // tempImageOutSide: tempImgOutSide,
                    // tempImageInSide: tempImgInSide,
                    AttachmentImageOutSide: tempImgOutSide,
                    AttachmentImageInSide: tempImgInSide,
                    tempPvRECon: item,
                    showConfirmEdit: true,
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
          <View
            style={{
              height: 1,
              backgroundColor: "#F0F0F4",
              marginVertical: 8,
            }}
          ></View>
          {/* <Paginator data={this.state.ListProcessValuationREConstruction} item ={item}/> */}
        </View>
      </View>
    );
  }

  FontTypeDetai(id) {}
  render() {
    let pvRE = this.state.ProcessValuationRE;
    let pvD = this.state.ProcessValuationDocument;
    let pv = this.state.ProcessValuation;
    let pvREC = this.state.ProcessValuationREConstruction;
    // const [currentIndex, setCurrentIndex] = useState(0);
    // const scrollX = useRef(new Animated.Value(0)).current;
    // const viewableItemsChanged = useRef(({ viewableItems}) =>{
    //     setCurrentIndex(viewableItems[0].index);
    // }).current;

    // const viewConfig = useRef({ viewAreaCoveragePercentTheshold: 50}).current;
    // const slidesRef = useRef(null);
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
                  paddingLeft: 110,
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
                    width: width / 3 - 20,
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
                        //pvRE.InfactLandAreaPrivate = Utility.ConvertToDecimal(val);
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
                    <Text>Mặt tiền tiếp giáp (m2) </Text>
                    <Text style={{ color: "red" }}>*</Text>
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
                      <Text>Khoảng cách đến mặt đường chính (m)</Text>
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
                    <Text>Những yếu tố không thuận lợi </Text>
                    <Text style={{ color: "red" }}>*</Text>
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
              </View>

              <View style={Theme.ViewTitle}>
                <Text
                  style={{ fontSize: 15, fontWeight: "bold", color: "#FFFFFF" }}
                >
                  Mô tả chung của tòa nhà
                </Text>
              </View>
              <View style={Theme.ViewContent}>
                <View style={{ flex: 2, flexDirection: "row" }}>
                  <View
                    style={{ flex: 1, marginBottom: 3, flexDirection: "row" }}
                  >
                    <Text> Loại công trình </Text>
                    <Text style={{ color: "red" }}>*</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <DropDownBox
                      TextField="Name"
                      ValueField="SystemParameterID"
                      DataSource={this.state.LstBuildingType}
                      SelectedValue={pvRE.BuildingType}
                      OnSelectedItemChanged={(val) => {
                        pvRE.BuildingType = val.SystemParameterID;
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
                  <View style={{ flexDirection: "row" }}>
                    <Text>Chi tiết tên công trình </Text>
                    {/* <Text style={{ color: 'red' }}>*</Text> */}
                  </View>
                  <View>
                    <TextInput
                      multiline={false}
                      style={[Theme.TextView, {}]}
                      value={pvRE.ProjectNote}
                      onChangeText={(val) => {
                        pvRE.ProjectNote = val;
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
                    <Text>Mô tả chi tiết </Text>
                    {/* <Text style={{ color: 'red' }}>*</Text> */}
                  </View>
                  <View>
                    <TextInput
                      multiline={false}
                      style={[Theme.TextView, {}]}
                      value={pvRE.Description}
                      onChangeText={(val) => {
                        pvRE.Description = val;
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
              </View>
              <View style={Theme.ViewTitle}>
                <View
                  style={{ flex: 2, marginBottom: 3, flexDirection: "column" }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      color: "#FFFFFF",
                      fontWeight: "bold",
                    }}
                  >
                    Mô tả chi tiết theo mục đích sử dụng{" "}
                  </Text>
                </View>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    paddingLeft: 7,
                  }}
                  onPress={() => {
                    // let resetImageOutSide = this.state
                    //   .ResetAttachmentImageOutSide;
                    // let resetImageInSide = this.state
                    //   .ResetAttachmentImageInSide;
                    let reset = this.state.ResetProcessValuationREConstruction;
                    this.setState({
                      tempPvRECon: reset,
                      AttachmentImageOutSide: undefined,
                      AttachmentImageInSide: undefined,
                    });
                    //this.btn_Save(Enums.SaveType.Temporary);
                    this.AddNewItemConstruction();
                    //this.setState({ showConfirmAddNew: true });
                  }}
                >
                  <LinearGradient
                    colors={["#ae55e6", "#ae55e6"]}
                    style={{
                      // width: width / 3 - 3,
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
              <View style={styles.TextAndDrop}>
                <View style={Theme.ViewContent}>
                  <PopUpModalViolet
                    resetState={this.showConfirmAddNew}
                    modalVisible={this.state.showConfirmAddNew}
                    title="Công trình xây dựng"
                  >
                    <ScrollView showsVerticalScrollIndicator={false}>
                      <View style={{ flex: 2, flexDirection: "row" }}>
                        <View
                          style={{
                            flex: 1,
                            marginBottom: 3,
                            flexDirection: "row",
                          }}
                        >
                          <Text>
                            {" "}
                            Loại công trình{" "}
                            <Text style={{ color: "red" }}>*</Text>
                          </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <DropDownBox
                            TextField="Name"
                            ValueField="SystemParameterID"
                            DataSource={this.state.LstConstructionType}
                            SelectedValue={
                              this.state.tempPvRECon.ConstructionType
                            }
                            OnSelectedItemChanged={(val) => {
                              let item = this.state.tempPvRECon;
                              item.ConstructionType = val.SystemParameterID;
                              this.setState({
                                tempPvRECon: item,
                              });
                            }}
                          ></DropDownBox>
                        </View>
                      </View>
                      <View style={styles.TextAndDrop}>
                        <View style={styles.Item}>
                          <View style={{ flex: 2, flexDirection: "row" }}>
                            <Text>Chi tiết tên công trình </Text>
                            {/* <Text style={{ color: 'red' }}>*</Text> */}
                          </View>
                        </View>
                        <View style={{ flex: 3 }}>
                          <TextInput
                            multiline={false}
                            style={[Theme.TextView, {}]}
                            value={this.state.tempPvRECon.Name}
                            onChangeText={(val) => {
                              let item = this.state.tempPvRECon;
                              item.Name = val;
                              this.setState({
                                tempPvRECon: item,
                              });
                            }}
                          />
                        </View>
                      </View>
                      <View style={styles.TextAndDrop}>
                        <View style={styles.Item}>
                          <View style={{ flex: 2, flexDirection: "row" }}>
                            <Text>Mô tả chi tiết </Text>
                            {/* <Text style={{ color: 'red' }}>*</Text> */}
                          </View>
                        </View>
                        <View style={{ flex: 3 }}>
                          <TextInput
                            multiline={false}
                            style={[Theme.TextView, {}]}
                            value={this.state.tempPvRECon.Description}
                            onChangeText={(val) => {
                              let item = this.state.tempPvRECon;
                              item.Description = val;
                              this.setState({
                                tempPvRECon: item,
                              });
                            }}
                          />
                        </View>
                      </View>
                      <View style={styles.ItemDelete}>
                        <View style={{ flex: 2, flexDirection: "row" }}>
                          <View style={{ flex: 2, flexDirection: "column" }}>
                            {this.state.AttachmentImageOutSide != null ||
                            this.state.AttachmentImageOutSide != undefined ? (
                              <GalleryImageItem
                                navigation={this.props.navigation}
                                Images={this.state.AttachmentImageOutSide}
                                numberColumn={1}
                                allowEdit={true}
                                allowRemove={true}
                                WorkfieldImageType={
                                  SMX.WorkfieldImageType.HinhAnh_BenNgoai
                                }
                                setRemove={this.SetRemove}
                              />
                            ) : (
                              <TouchableOpacity
                                onPress={() =>
                                  this._pickImage(
                                    this.state.tempPvRECon
                                      .ProcessValuationREConstructionID,
                                    SMX.WorkfieldImageType.HinhAnh_BenNgoai
                                  )
                                }
                              >
                                <Image
                                  style={styles.TinyImage}
                                  source={require("../../../../assets/notfound.png")}
                                />
                              </TouchableOpacity>
                            )}
                            <Text>Ảnh chụp bên ngoài</Text>
                          </View>
                          <View style={{ flex: 2, flexDirection: "column" }}>
                            {this.state.AttachmentImageInSide != null ||
                            this.state.AttachmentImageInSide != undefined ? (
                              <GalleryImageItem
                                navigation={this.props.navigation}
                                Images={this.state.AttachmentImageInSide}
                                numberColumn={1}
                                allowEdit={true}
                                allowRemove={true}
                                WorkfieldImageType={
                                  SMX.WorkfieldImageType.HinhAnh_BenTrong
                                }
                                setRemove={this.SetRemove}
                              />
                            ) : (
                              <TouchableOpacity
                                onPress={() =>
                                  this._pickImage(
                                    this.state.tempPvRECon
                                      .ProcessValuationREConstructionID,
                                    SMX.WorkfieldImageType.HinhAnh_BenTrong
                                  )
                                }
                              >
                                <Image
                                  style={styles.TinyImage}
                                  source={require("../../../../assets/notfound.png")}
                                />
                              </TouchableOpacity>
                            )}
                            <Text>Ảnh chụp bên trong</Text>
                          </View>
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
                            this.UpdateItemCon(
                              this.state.tempPvRECon
                                .ProcessValuationREConstructionID
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
                            this.getListContruction();
                          }}
                        >
                          <Text style={{ color: "#797979", fontSize: 15 }}>
                            Cancel
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </ScrollView>
                  </PopUpModalViolet>
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
                    // onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                    //     useNativeDriver: false,
                    // })}
                    // onViewableItemsChanged={viewableItemsChanged}
                    // viewabilityConfig={viewConfig}
                    // ref={slidesRef}
                  />
                  {/* <Paginator data = {this.state.ListProcessValuationREConstruction} /> */}
                </View>
                <PopUpModalViolet
                  resetState={this.showConfirmEdit}
                  modalVisible={this.state.showConfirmEdit}
                  title="Công trình xây dựng"
                >
                  {
                    //console.log("Dữ liệu của tempPvRECon", this.state.tempPvRECon)
                    //console.log("Dữ liệu của LstLstConstructionType", this.state.numContructiontype)
                  }
                  <View style={{ flex: 1 }}>
                    <ScrollView>
                      <View style={{ flex: 2, flexDirection: "row" }}>
                        <View
                          style={{
                            flex: 1,
                            marginBottom: 3,
                            flexDirection: "row",
                          }}
                        >
                          <Text>
                            {" "}
                            Loại công trình{" "}
                            <Text style={{ color: "red" }}>*</Text>
                          </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <DropDownBox
                            TextField="Name"
                            ValueField="SystemParameterID"
                            DataSource={this.state.LstConstructionType}
                            SelectedValue={this.state.numContructiontype}
                            OnSelectedItemChanged={(val) => {
                              // let ConType = this.state.numContructiontype;
                              // ConType = val.SystemParameterID;
                              // this.state.tempPvRECon.ConstructionType = val.SystemParameterID;
                              // this.setState({
                              //     tempPvRECon: this.state.tempPvRECon,
                              //     numContructiontype : ConType
                              //  })
                              let tempPvre = this.state.tempPvRECon;
                              tempPvre.ConstructionType = val.SystemParameterID;
                              this.setState({
                                tempPvRECon: tempPvre,
                                numContructiontype: val.SystemParameterID,
                              });
                            }}
                          ></DropDownBox>
                        </View>
                      </View>
                      <View style={styles.TextAndDrop}>
                        <View style={styles.Item}>
                          <View style={{ flex: 2, flexDirection: "row" }}>
                            <Text>Chi tiết tên công trình </Text>
                            {/* <Text style={{ color: 'red' }}>*</Text> */}
                          </View>
                        </View>
                        <View style={{ flex: 3 }}>
                          <TextInput
                            multiline={false}
                            style={[Theme.TextView, {}]}
                            value={this.state.tempPvRECon.Name}
                            onChangeText={(val) => {
                              let item = this.state.tempPvRECon;
                              item.Name = val;
                              this.setState({
                                tempPvRECon: item,
                              });
                            }}
                          />
                        </View>
                      </View>
                      <View style={styles.TextAndDrop}>
                        <View style={styles.Item}>
                          <View style={{ flex: 2, flexDirection: "row" }}>
                            <Text>Mô tả chi tiết </Text>
                            {/* <Text style={{ color: 'red' }}>*</Text> */}
                          </View>
                        </View>
                        <View style={{ flex: 3 }}>
                          <TextInput
                            multiline={false}
                            style={[Theme.TextView, {}]}
                            value={this.state.tempPvRECon.Description}
                            onChangeText={(val) => {
                              let item = this.state.tempPvRECon;
                              item.Description = val;
                              this.setState({
                                tempPvRECon: item,
                              });
                            }}
                          />
                        </View>
                      </View>
                      <View style={styles.ItemDelete}>
                        <View style={{ flex: 2, flexDirection: "row" }}>
                          <View style={{ flex: 2, flexDirection: "column" }}>
                            {this.state.AttachmentImageOutSide != null ||
                            this.state.AttachmentImageOutSide != undefined ? (
                              <GalleryImageItem
                                navigation={this.props.navigation}
                                Images={this.state.AttachmentImageOutSide}
                                numberColumn={1}
                                allowEdit={true}
                                allowRemove={true}
                                WorkfieldImageType={
                                  SMX.WorkfieldImageType.HinhAnh_BenNgoai
                                }
                                setRemove={this.SetRemove}
                              />
                            ) : (
                              <TouchableOpacity
                                onPress={() =>
                                  this._pickImage(
                                    this.state.tempPvRECon
                                      .ProcessValuationREConstructionID,
                                    SMX.WorkfieldImageType.HinhAnh_BenNgoai
                                  )
                                }
                              >
                                <Image
                                  style={styles.TinyImage}
                                  source={require("../../../../assets/notfound.png")}
                                />
                              </TouchableOpacity>
                            )}
                            <Text>Ảnh chụp bên ngoài</Text>
                          </View>
                          <View style={{ flex: 2, flexDirection: "column" }}>
                            {this.state.AttachmentImageInSide != null ||
                            this.state.AttachmentImageInSide != undefined ? (
                              <GalleryImageItem
                                navigation={this.props.navigation}
                                Images={this.state.AttachmentImageInSide}
                                WorkfieldImageType={
                                  SMX.WorkfieldImageType.HinhAnh_BenTrong
                                }
                                numberColumn={1}
                                allowEdit={true}
                                allowRemove={true}
                                setRemove={this.SetRemove}
                              />
                            ) : (
                              <TouchableOpacity
                                onPress={() =>
                                  this._pickImage(
                                    this.state.tempPvRECon
                                      .ProcessValuationREConstructionID,
                                    SMX.WorkfieldImageType.HinhAnh_BenTrong
                                  )
                                }
                              >
                                <Image
                                  style={styles.TinyImage}
                                  source={require("../../../../assets/notfound.png")}
                                />
                              </TouchableOpacity>
                            )}
                            <Text>Ảnh chụp bên trong</Text>
                          </View>
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
                              { showConfirmEdit: false },
                              async () => {
                                await this.UpdateItemCon(
                                  this.state.tempPvRECon
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
                            this.setState({
                              showConfirmEdit: false,
                            }),
                              async () => {
                                await this.getListContruction();
                              };
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
              </View>
              <View style={Theme.ViewTitle}>
                <Text
                  style={{ fontSize: 15, fontWeight: "bold", color: "#FFFFFF" }}
                >
                  Lưu ý
                </Text>
              </View>
              <View style={Theme.ViewContent}>
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
    marginTop: 1,
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
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "#493d8a",
    marginHorizontal: 8,
  },
});
