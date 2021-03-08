import React from "react";
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
import Toolbar from "../../../components/Toolbar";
import HttpUtils from "../../../Utils/HttpUtils";
import { inject, observer } from "mobx-react";
import GlobalStore from "../../../Stores/GlobalStore";
import Utility from "../../../Utils/Utility";
import SMX from "../../../constants/SMX";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import DropDownBox from "../../../components/DropDownBox";
import { LinearGradient } from "expo-linear-gradient";
import ProcessValuationDocument from "../../../Entities/ProcessValuationDocument";
import ProcessValuationRE from "../../../Entities/ProcessValuationRE";
import ApiUrl from "../../../constants/ApiUrl";
import ActionDto from "../../../DtoParams/ActionDto";
import ProcessValuation from "../../../Entities/ProcessValuation";
import SystemParameter from "../../../Entities/SystemParameter";
import { ClientMessage } from "../../../SharedEntity/SMXException";

import Theme from "../../../Themes/Default";
const { width, height } = Dimensions.get("window");
interface iProps {
  navigation: any;
  route: any;
  GlobalStore: GlobalStore;
}
interface iState {
  ProcessValuationDocumentID?: number;
  showCustomerInfo: boolean;
  ProcessValuationDocument?: ProcessValuationDocument;
  FrontageType?: number;
  LaneWidthMin?: number;
  LaneWidthMax?: number;
  DistanceToMainStreet?: number;
  ContiguousStreetType?: number;
  PositionDescription?: string;
  InfactLandAreaPrivate?: number;
  OnLandDescription?: string;
  LstContiguousStreetType?: SystemParameter[];
}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class Edit extends React.Component<iProps, any> {
  constructor(props: iProps) {
    super(props);
    this.state = {
      showCustomerInfo: true,
      ProcessValuationDocument: new ProcessValuationDocument(),
      ProcessValuationRE: new ProcessValuationRE(),
      ProcessValuation: new ProcessValuation(),
      FrontageType: "",
      LaneWidthMin: "",
      LaneWidthMax: "",
      DistanceToMainStreet: "",
      ContiguousStreetType: "",
      PositionDescription: "",
      InfactLandAreaPrivate: "",
      OnLandDescription: "",
      LstContiguousStreetType: [],
    };
  }
  async componentDidMount() {
    await this.LoadData();
  }

  async LoadData() {
    try {
      this.props.GlobalStore.ShowLoading();
      var req = new ActionDto();
      req.MACode2 = SMX.MortgageAssetCode2.Equipments;
      req.ProcessValuationDocumentID = this.props.route.params.ProcessValuationDocumentID;

      let res = await HttpUtils.post<ActionDto>(
        ApiUrl.ProcessValuation_Execute,
        SMX.ApiActionCode.Actions,
        JSON.stringify(req)
      );

      if (res) {
        this.setState({
          ProcessValuationRE: res!.ProcessValuationRE,
          ProcessValuation: res!.ProcessValuation,
          WorkfieldDistance: res!.ProcessValuationRE.WorkfieldDistance + "",
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
      let req = new ActionDto();
      req.MACode2 = SMX.MortgageAssetCode2.REApartments;
      let item = this.state.ProcessValuationRE;
      let pvd = new ProcessValuationDocument();
      let pv = new ProcessValuation();

      if (!this.state.WorkfieldDistance || this.state.WorkfieldDistance == "") {
        this.props.GlobalStore.HideLoading();
        let message = "[Khoảng cách đi thẩm định (km)] Không được để trống";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }
      if (
        !this.state.ProcessValuationEquipment.Type ||
        this.state.ProcessValuationEquipment.Type == ""
      ) {
        this.props.GlobalStore.HideLoading();
        let message = "[Tên máy móc thiết bị] Không được để trống";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }
      if (
        !this.state.ProcessValuationEquipment.Specification ||
        this.state.ProcessValuationEquipment.Specification == ""
      ) {
        this.props.GlobalStore.HideLoading();
        let message = "[Khoảng cách đi thẩm định (km)] Không được để trống";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }
      if (
        !this.state.ProcessValuationEquipment.Description ||
        this.state.ProcessValuationEquipment.Description == ""
      ) {
        this.props.GlobalStore.HideLoading();
        let message = "[Mô tả sơ bộ tài sản] Không được để trống";
        this.props.GlobalStore.Exception = ClientMessage(message);
        return;
      }

      var workfieldDistance = this.state.WorkfieldDistance;
      item.WorkfieldDistance =
        workfieldDistance && workfieldDistance.length != 0
          ? parseFloat(workfieldDistance.split(",").join("."))
          : undefined;

      pvd.ProcessValuationDocumentID = item.ProcessValuationDocumentID;
      pvd.WorkfieldDistance =
        workfieldDistance && workfieldDistance.length != 0
          ? parseFloat(workfieldDistance.split(",").join("."))
          : undefined;
      pvd.Version = item.PVDVersion;

      pv.ProcessValuationID = item.ProcessValuationID;
      pv.Version = item.PVVersion;

      req.ProcessValuationRE = item;
      req.ProcessValuationDocument = pvd;
      req.ProcessValuation = pv;

      let res = await HttpUtils.post<ActionDto>(
        ApiUrl.ProcessValuation_Execute,
        SMX.ApiActionCode.SaveItem,
        JSON.stringify(req)
      );

      if (res) {
        this.setState({
          ProcessValuationRE: res!.ProcessValuationRE!,
          ProcessValuation: res!.ProcessValuation,
          WorkfieldDistance: res!.ProcessValuationRE.WorkfieldDistance + "",
        });
      }

      this.props.GlobalStore.HideLoading();
    } catch (ex) {
      this.props.GlobalStore.Exception = ex;
      this.props.GlobalStore.HideLoading();
    }
  }

  async GetSegmentByStreet() {
    try {
    } catch (ex) {
      this.props.GlobalStore.Exception = ex;
    }
  }
  async CheckIn() {
    try {
    } catch (ex) {}
  }
  async Save() {
    try {
    } catch (ex) {}
  }

  render() {
    let pvRE = this.state.ProcessValuationRE;
    let pv = this.state.ProcessValuation;
    return (
      <View>
        <Toolbar
          Title="Khảo sát hiện trạng - Tài sản"
          navigation={this.props.navigation}
        />
        <KeyboardAvoidingView
          behavior="height"
          style={{ flex: 1, paddingHorizontal: 8 }}
        >
          <View style={{ marginTop: 10, flexDirection: "row" }}>
            <TouchableOpacity
              style={{ justifyContent: "flex-end", alignItems: "flex-end" }}
              onPress={() => {}}
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
                  flexDirection: "row",
                }}
              >
                <FontAwesome5 name="file-alt" size={18} color="#FFFFFF" />
                <Text style={{ color: "#FFFFFF", fontSize: 15, marginLeft: 8 }}>
                  Hồ sơ TS
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ justifyContent: "flex-end", alignItems: "flex-end" }}
              onPress={() => {}}
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
                  flexDirection: "row",
                }}
              >
                <FontAwesome5 name="file-alt" size={18} color="#FFFFFF" />
                <Text style={{ color: "#FFFFFF", fontSize: 15, marginLeft: 8 }}>
                  Hình ảnh TS
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <ScrollView>
            <View
              style={{
                backgroundColor: "#eaf2f6",
                borderColor: "#7ba6c2",
                borderWidth: 1,
                marginTop: 8,
                padding: 8,
              }}
            >
              <View
                style={{
                  marginBottom: 3,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <FontAwesome5 name="user-alt" size={15} color="#000" />
                  <Text style={{ marginLeft: 5, fontSize: 15 }}>
                    Thông tin khách hàng
                  </Text>
                </View>
                {this.state.showCustomerInfo ? (
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ showCustomerInfo: false });
                    }}
                  >
                    <FontAwesome5 name="minus-circle" size={20} color="#000" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ showCustomerInfo: true });
                    }}
                  >
                    <FontAwesome5 name="plus-circle" size={20} color="#000" />
                  </TouchableOpacity>
                )}
              </View>
              <View
                style={{
                  height: 1,
                  backgroundColor: "#7ba6c2",
                }}
              ></View>
              {this.state.showCustomerInfo ? (
                <View style={{ marginTop: 8, marginBottom: 10 }}>
                  <View style={styles.Item}>
                    <View style={{ flex: 2, flexDirection: "row" }}>
                      <Text>Tên khách hàng: </Text>
                    </View>
                  </View>
                  <View style={styles.Item}>
                    <View style={{ flex: 2, flexDirection: "row" }}>
                      <Text>Địa chỉ thực tế: </Text>
                    </View>
                  </View>
                </View>
              ) : undefined}
            </View>

            <View style={styles.Item}>
              <View style={{ flex: 2, flexDirection: "row" }}>
                <Text>Khoảng cách đi thẩm định (km) </Text>
              </View>
              <View
                style={{
                  flex: 3,
                  borderWidth: 1,
                  borderColor: "#acacac",
                  borderRadius: 5,
                }}
              >
                <TextInput
                  style={{
                    color: "#1B2031",
                    marginHorizontal: 7,
                    marginVertical: 10,
                  }}
                  value={this.state.WorkfieldDistance}
                  onChangeText={(val) => {
                      this.setState({ WorkfieldDistance: val });
                  }}
                />
              </View>
            </View>

            <View style={styles.Item}>
              <View style={{ flex: 2, flexDirection: "row" }}>
                <Text>Diện tích thực tế(m2) </Text>
              </View>
              <View
                style={{
                  flex: 3,
                  borderWidth: 1,
                  borderColor: "#acacac",
                  borderRadius: 5,
                }}
              >
                <TextInput
                  multiline={false}
                  style={[Theme.TextView]}
                  value={pvRE.InfactLandAreaPrivate}
                  onChangeText={(val) => {
                    pvRE.InfactLandAreaPrivate = val;
                    this.setState({ ProcessValuationRE: pvRE });
                  }}
                />
              </View>
            </View>

            <View style={styles.Item}>
              <View style={{ flex: 2, flexDirection: "row" }}>
                <Text>Mặt tiếp giáp </Text>
                <Text style={{ color: "red" }}>*</Text>
              </View>
              <View style={{ flex: 3 }}>
                <DropDownBox
                  TextField="Name"
                  ValueField="SystemParameterID"
                  DataSource={
                    SMX.ProcessValuationREFrontageType
                      .dicProcessValuationREFrontageType
                  }
                  SelectedValue={this.state.FrontageType}
                  OnSelectedItemChanged={(item) => {
                    this.setState({ FrontageType: item.SystemParameterID });
                  }}
                ></DropDownBox>
              </View>
            </View>
            <View style={styles.Item}>
              <View style={{ flex: 2, flexDirection: "row" }}>
                <Text>Loại đường tiếp giáp </Text>
                <Text style={{ color: "red" }}>*</Text>
              </View>
              <View style={{ flex: 3 }}>
                <DropDownBox
                  TextField="Name"
                  ValueField="SystemParameterID"
                  DataSource={this.state.LstContiguousStreetType}
                  SelectedValue={this.state.ContiguousStreetType}
                  OnSelectedItemChanged={(item) => {
                    this.setState({
                      ContiguousStreetType: item.SystemParameterID,
                    });
                  }}
                ></DropDownBox>
              </View>
            </View>
            <View style={styles.Item}>
              <View style={{ flex: 2, flexDirection: "row" }}>
                <Text>Những yếu tốt thuận lợi </Text>
              </View>
              <View
                style={{
                  flex: 3,
                  borderWidth: 1,
                  borderColor: "#acacac",
                  borderRadius: 5,
                }}
              >
                <TextInput
                  multiline={false}
                  style={[Theme.TextView]}
                  value={pv.Advantage}
                  onChangeText={(val) => {
                    pv.Advantage = val;
                    this.setState({ ProcessValuation: pv });
                  }}
                />
              </View>
            </View>
            <View style={styles.Item}>
              <View style={{ flex: 2, flexDirection: "row" }}>
                <Text>Những yếu tố không thuận lợi</Text>
              </View>
              <View
                style={{
                  flex: 3,
                  borderWidth: 1,
                  borderColor: "#acacac",
                  borderRadius: 5,
                }}
              >
                <TextInput
                  multiline={false}
                  style={[Theme.TextView]}
                  value={pv.DisAdvantage}
                  onChangeText={(val) => {
                    pv.DisAdvantage = val;
                    this.setState({ ProcessValuation: pv });
                  }}
                />
              </View>
            </View>
            <View style={styles.Item}>
              <View style={{ flex: 2, flexDirection: "row" }}>
                <Text>Mô tả tài sản trên đất</Text>
              </View>
              <View
                style={{
                  flex: 3,
                  borderWidth: 1,
                  borderColor: "#acacac",
                  borderRadius: 5,
                }}
              >
                 <TextInput
                  multiline={false}
                  style={[Theme.TextView]}
                  value={pvRE.OnLandDescription}
                  onChangeText={(val) => {
                    pv.OnLandDescription = val;
                    this.setState({ ProcessValuationRE: pvRE });
                  }}
                />
              </View>
            </View>
            <View style={styles.Item}>
              <View style={{ flex: 2, flexDirection: "row" }}>
                <Text>Mô tả vị trí</Text>
              </View>
              <View
                style={{
                  flex: 3,
                  borderWidth: 1,
                  borderColor: "#acacac",
                  borderRadius: 5,
                }}
              >
                <TextInput
                  multiline={false}
                  style={[Theme.TextView]}
                  value={pvRE.PositionDescription}
                  onChangeText={(val) => {
                    pv.PositionDescription = val;
                    this.setState({ ProcessValuationRE: pvRE });
                  }}
                />
              </View>
            </View>
            <View style={styles.Item}>
              <View style={{ flex: 2, flexDirection: "row" }}>
                <Text>Thông tin lưu ý</Text>
              </View>
              <View
                style={{
                  flex: 3,
                  borderWidth: 1,
                  borderColor: "#acacac",
                  borderRadius: 5,
                }}
              >
                <TextInput
                  multiline={false}
                  style={[Theme.TextView]}
                  value={pvRE.WorkfieldOtherInfomation}
                  onChangeText={(val) => {
                    pv.WorkfieldOtherInfomation = val;
                    this.setState({ ProcessValuationRE: pvRE });
                  }}
                />
              </View>
            </View>
            <View>
              <View style={[styles.Item, { marginBottom: 10 }]}>
                <Text style={{ fontWeight: "600", fontSize: 18 }}>
                  Xác thực
                </Text>
              </View>
              <TouchableOpacity
                style={{ justifyContent: "center", alignItems: "center" }}
                onPress={() => {
                  this.CheckIn();
                }}
              >
                <LinearGradient
                  colors={["#7B35BB", "#5D2E86"]}
                  style={{
                    width: width / 3,
                    height: 50,
                    backgroundColor: "#007AFF",
                    borderRadius: 5,
                    justifyContent: "center",
                    marginTop: 30,
                    alignItems: "center",
                  }}
                >
                  <Text style={Theme.BtnTextGradient}>Check In</Text>
                </LinearGradient>
                <Text
                  style={{ color: "#FFF", fontSize: 18, textAlign: "center" }}
                ></Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ justifyContent: "center", alignItems: "center" }}
                onPress={() => {
                  this.Save();
                }}
              >
                <LinearGradient
                  colors={["#7B35BB", "#5D2E86"]}
                  style={{
                    width: width / 3,
                    height: 50,
                    backgroundColor: "#007AFF",
                    borderRadius: 5,
                    justifyContent: "center",
                    marginTop: 30,
                    alignItems: "center",
                  }}
                >
                  <Text style={Theme.BtnTextGradient}>Lưu</Text>
                </LinearGradient>
                <Text
                  style={{ color: "#FFF", fontSize: 18, textAlign: "center" }}
                ></Text>
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
