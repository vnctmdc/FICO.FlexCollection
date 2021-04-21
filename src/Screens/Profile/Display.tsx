import React from "react";
import {
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Switch,
  Alert,
  ImageBackground,
  Platform,
} from "react-native";
import Toolbar from "../../components/Toolbar";
import Employee from "../../Entities/Employee";
import GlobalStore from "../../Stores/GlobalStore";
import Utility from "../../Utils/Utility";
import HttpUtils from "../../Utils/HttpUtils";
import { ProfileDto } from "../../DtoParams/ProfileDto";
import ApiUrl from "../../constants/ApiUrl";
import SMX from "../../constants/SMX";
import { observer, inject } from "mobx-react";
import { LinearGradient } from "expo-linear-gradient";
import Theme from "../../Themes/Default";
import AuthenticationService from "../../Utils/AuthenticationService";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import * as Device from "expo-device";
import * as LocalAuthentication from "expo-local-authentication";
import { ClientMessage } from "../../SharedEntity/SMXException";
const { height, width } = Dimensions.get("window");
import { Constants } from "expo";

interface iProps {
  navigation: any;
  route: any;
  GlobalStore: GlobalStore;
}
interface iState {
  Employee: Employee;
  CheckFinger: boolean;
  hasTouchIDSupport?: boolean;
  hasFaceIDSupport?: boolean;
}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class ProfilesSrc extends React.Component<iProps, iState> {
  constructor(props: any) {
    super(props);
    this.state = {
      Employee: new Employee(),
      CheckFinger: false,
      hasTouchIDSupport: false,
      hasFaceIDSupport: false,
    };
  }

  async componentDidMount() {
    await this.LoadData();
  }

  async LoadData() {
    this.props.GlobalStore.ShowLoading();
    let res = await HttpUtils.post<ProfileDto>(
      ApiUrl.Profile_Execute,
      SMX.ApiActionCode.GetProfile,
      JSON.stringify(new ProfileDto())
    );

    if (res) {
      this.setState({ Employee: res!.Employee! });
    }
    if (res!.Employee.IsCheckFinger) {
      this.setState({
        CheckFinger: true,
      });
    }

    const hasHardwareSupport =
      (await LocalAuthentication.hasHardwareAsync()) &&
      (await LocalAuthentication.isEnrolledAsync());

    if (hasHardwareSupport) {
      if (Platform.OS == "ios") {
        this.setState({
          hasFaceIDSupport: true,
        });
      }
      this.setState({
        hasTouchIDSupport: !this.state.hasFaceIDSupport,
      });
    }
    this.props.GlobalStore.HideLoading();
  }

  async onFaceId() {
    try {
      // Checking if device is compatible
      const isCompatible = await LocalAuthentication.hasHardwareAsync();

      if (!isCompatible) {
        throw new Error("Thiết bị không hỗ trợ.");
      }

      // Checking if device has biometrics records
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!isEnrolled) {
        throw new Error("No Faces / Fingers found.");
      }

      if (this.state.CheckFinger == true) {
        var checkSuccess = await LocalAuthentication.authenticateAsync();
        if (checkSuccess.success == true) {
          // Authenticate user
          this.props.GlobalStore.ShowLoading();
          let req = new ProfileDto();
          req.IsCheckFinger = this.state.CheckFinger;
          req.DeviceName = Device.deviceName;
          let res = await HttpUtils.post<ProfileDto>(
            ApiUrl.Profile_Execute,
            SMX.ApiActionCode.UpdateFinger,
            JSON.stringify(req)
          );
          this.props.GlobalStore.HideLoading();
          let mess = "Thiết lập sinh trắc học thành công!";
          this.props.GlobalStore.Exception = ClientMessage(mess);
        }
        else{
          this.setState({
            CheckFinger:false
          })
        }
      } else {
        this.props.GlobalStore.ShowLoading();
        let req = new ProfileDto();
        req.IsCheckFinger = this.state.CheckFinger;
        let res = await HttpUtils.post<ProfileDto>(
          ApiUrl.Profile_Execute,
          SMX.ApiActionCode.UpdateFinger,
          JSON.stringify(req)
        );
        this.props.GlobalStore.HideLoading();
        let mess = "Hủy bỏ thiết vấn sinh trắc học thành công!";
        this.props.GlobalStore.Exception = ClientMessage(mess);
      }
    } catch (error) {
      Alert.alert("An error as occured", error?.message);
    }
  }
  render() {
    const { Employee } = this.state;
    return (
      <View style={{ height: height, backgroundColor: "#F6F6FE" }}>
        <Toolbar
          Title="Thông tin người đăng nhập"
          navigation={this.props.navigation}
        />
        <View
          style={{
            paddingTop: 10,
            flex: 1,
            backgroundColor: "#F6F6FE",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          <View
            style={{
              marginVertical: 10,
              marginHorizontal: 10,
              //height: height / 4,
              borderColor: "#F0F0F4",
              borderWidth: 1,
              borderRadius: 8,
              paddingHorizontal: 10,
              paddingVertical: 15,
              backgroundColor: "#FFFFFF",
              justifyContent: "center",
            }}
          >
            <View style={{ paddingTop: 8 }}>
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <View>
                  <Image
                    style={{
                      backgroundColor: "#AE55E6",
                      borderRadius: 50,
                      width: 100,
                      height: 100,
                      //resizeMode: "contain",
                      //overflow:'hidden'
                    }}
                    source={require("../../../assets/avatar.png")}
                  />
                </View>
                <View
                  style={{
                    marginTop: 5,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{ paddingLeft: 8, fontWeight: "bold", fontSize: 30 }}
                  >
                    {Employee.Name}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              marginVertical: 10,
              marginHorizontal: 10,
              borderColor: "#F0F0F4",
              borderWidth: 1,
              borderRadius: 8,
              backgroundColor: "#FFFFFF",
            }}
          >
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 8,
                }}
              >
                <Text>Chức danh</Text>
                <Text style={{ fontWeight: "600" }}>
                  {Employee.Description}
                </Text>
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
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 8,
                }}
              >
                <Text>Ngày sinh</Text>
                <Text style={{ fontWeight: "600" }}>
                  {Utility.GetDateString(Employee.DOB)}
                </Text>
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
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 8,
                }}
              >
                <Text>Số điện thoại</Text>
                <Text style={{ fontWeight: "600" }}>{Employee.Mobile}</Text>
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
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 8,
                }}
              >
                <Text>Email</Text>
                <Text style={{ fontWeight: "600" }}>{Employee.Email}</Text>
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
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 8,
                }}
              >
                <Text>Mô tả</Text>
                <Text style={{ fontWeight: "bold" }}>{Employee.Notes}</Text>
              </View>
            </View>
          </View>
          <View
            style={{
              marginVertical: 10,
              marginHorizontal: 10,
              borderColor: "#F0F0F4",
              borderWidth: 1,
              borderRadius: 8,
              backgroundColor: "#FFFFFF",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                padding: 10,
                justifyContent: "space-between",
              }}
            >
              {this.state.hasFaceIDSupport == true ? (
                <ImageBackground
                  source={require("../../../assets/face_id.png")}
                  style={{
                    height: 22,
                    width: 22,
                    opacity: 0.6,
                  }}
                />
              ) : (
                <FontAwesome5 name="fingerprint" size={22} color="#7B35BB" />
              )}

              <Text style={{ fontSize: 15, marginLeft: 8 ,alignItems:"center",justifyContent:"center"}}>
                Đăng nhập bằng sinh trắc học
              </Text>
              <View
                style={{
                  flex: 2,
                  flexDirection: "row",
                  justifyContent: "flex-end",
                }}
              >
                <Switch
                  trackColor={{ true: "#7B35BB", false: "#E0E4E9" }}
                  thumbColor={"#7B35BB"}
                  value={this.state.CheckFinger}
                  onValueChange={(val) => {
                    this.setState({ CheckFinger: val });
                    this.onFaceId();
                  }}
                />
                {/* {this.state.MinusNearGarbageRoomYes ? (
                  <Text style={{ marginLeft: 3 }}>Có</Text>
                ) : (
                  <Text style={{ marginLeft: 3 }}>Không</Text>
                )} */}
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              AuthenticationService.SignOut();
              //this.props.navigation.closeDrawer();
              this.props.navigation.navigate("SrcLogin");
            }}
          >
            <LinearGradient
              colors={["#7B35BB", "#5D2E86"]}
              style={{
                width: width - 60,
                height: 50,
                backgroundColor: "#007AFF",
                borderRadius: 5,
                justifyContent: "center",
                marginTop: 10,
                alignItems: "center",
              }}
            >
              <Text style={Theme.BtnTextGradient}>Đăng xuất</Text>
            </LinearGradient>
            <Text
              style={{ color: "#FFF", fontSize: 18, textAlign: "center" }}
            ></Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
