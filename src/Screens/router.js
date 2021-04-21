import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { NavigationContainer, CommonActions } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createSwitchNavigator } from "@react-navigation/compat";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Octicons from "react-native-vector-icons/Octicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { setTopLevelNavigator } from "./NavigationService";

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import {
  DrawerItem,
  DrawerContentScrollView,
  createDrawerNavigator,
} from "@react-navigation/drawer";

import GoBack from "../components/GoBack";
// Shared
import Welcome from "./shared/Welcome";
import SrcLogin from "./shared/Login";
import SrcLogout from "./shared/Logout";
import Home from "./Home";
import OTP from "./shared/OTP";

import AuthenticationService from "../Utils/AuthenticationService";
import Error from "./shared/Error";

//new
import DanhsachTSKhaoSatSrc from "../Screens/DanhSachTSKhaoSat/Default";
import HoSoFilter from "../Screens/DanhSachTSKhaoSat/HoSoFilter";
import DanhsachBCDGChoDuyetSrc from "../Screens/ApprovingValuation/Default";
import BCDGChoDuyetSrc from "../Screens/ApprovingValuation/Display";
import PDFView from "../Screens/ApprovingValuation/PDFView";
import PreLiminareQuote from "../Screens/ApprovingValuation/PreLiminareQuote";
import DSHoSoDangDinhGiaSrc from "../Screens/HoSoDangDinhGia/Default";
import ValuationREsSrc from "../Screens/QuickValuations/ValuationREs/AddNew";
import ValuationCondominiumsSrc from "../Screens/QuickValuations/ValuationCondominiums/AddNew";
import ValuationVehiclesSrc from "../Screens/QuickValuations/ValuationVehicles/AddNew";
import KhaoSatHienTrangScr from "../Screens/DanhSachTSKhaoSat/Edit";
import WorkInEmployeeSrc from "../Screens/WorkInEmployee/Default";

//Actions
import EquipmentScr from "../Screens/Actions/Equipments/Edit";
import EquipmentImagesScr from "../Screens/Actions/Equipments/Images";

//Dây chuyền sản xuất
import BatchEquipmentScr from "../Screens/Actions/BatchEquipments/Edit";
import BatchEquipmentImagesSrc from "../Screens/Actions/BatchEquipments/Images";
//Lô đất ở
import BatchREScr from "../Screens/Actions/BatchREs/Edit";
import BatchREImagesScr from "../Screens/Actions/BatchREs/Images";
//Chung cư
import RECondominiumScr from "../Screens/Actions/RECondominiums/Edit";
import RECondominiumImagesScr from "../Screens/Actions/RECondominiums/Images";
//Đường bộ
import VehicleRoadScr from "../Screens/Actions/VehicleRoads/Edit";
import VehicleRoadImagesScr from "../Screens/Actions/VehicleRoads/Images";
//Đường thủy
import VesselScr from "../Screens/Actions/Vessels/Edit";
import VesselImagesScr from "../Screens/Actions/Vessels/Images";

import REResidentialSrc from "../Screens/Actions/REResidentials/Edit";
import REResidentialImagesSrc from "../Screens/Actions/REResidentials/Images";

//Cao ốc
import ReBuildingsSrc from "../Screens/Actions/REBuildings/Edit";
import ReBuildingImagesSrc from "../Screens/Actions/REBuildings/Images";

//Nhà xưởng
import ReFactoriesSrc from "../Screens/Actions/REFactories/Edit";
import ReFactoriesImagesSrc from "../Screens/Actions/REFactories/Images";

//Dự án
import ReProjectsSrc from "../Screens/Actions/REProjects/Edit";
import ReProjectsImagesSrc from "../Screens/Actions/REProjects/Images";

//Lô phương tiện vận tải
import BatchVehiclesSrc from "../Screens/Actions/BatchVehicles/Edit";
import BatchVehiclesImagesSrc from "../Screens/Actions/BatchVehicles/Images";


//Nhiều hộ nhiều tầng
import ReApartmentsSrc from "../Screens/Actions/REApartments/Edit";
import ReApartmentsImagesSrc from "../Screens/Actions/REApartments/Images";


import ProfilesSrc from "../Screens/Profile/Display";

// ? Default title style
const defaultTitleStyle = {
  headerStyle: {
    backgroundColor: "#2EA8EE",
  },
  headerTintColor: "#fff",
  headerTitleStyle: {
    fontWeight: "bold",
  },
  headerBackTitle: "",
};

const HomeStack = createStackNavigator();
function HomeContainer() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
        component={Home}
        options={({ navigation, route }) => ({
          title: "Trang chủ",
          ...defaultTitleStyle,
          headerShown: false,
          headerLeft: (props) => (
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={{ marginLeft: 15 }}
                onPress={() => navigation.openDrawer()}
              >
                <FontAwesome5 name="bars" size={size} />
              </TouchableOpacity>
            </View>
          ),
        })}
      />
      {/* <HomeStack.Screen
                name="ProfilesSrc"
                component={ProfilesSrc}
                options={({ navigation, route }) => ({
                    title: "Thông tin người đăng nhập",
                    ...defaultTitleStyle,
                    headerShown: false,
                })}
            /> */}
    </HomeStack.Navigator>
  );
}

const withNavStackPreLiminareQuote = (Component) => (
  <Component
    {...this.props}
    name="PreLiminareQuote"
    component={PreLiminareQuote}
    options={({ navigation, route }) => ({
      ...defaultTitleStyle,
      headerShown: false,
    })}
  />
);

const withNavStackPDFView = (Component) => (
  <Component
    {...this.props}
    name="PDFView"
    component={PDFView}
    options={({ navigation, route }) => ({
      ...defaultTitleStyle,
      headerShown: false,
    })}
  />
);

const withNavStackFilter = (Component) => (
  <Component
    {...this.props}
    name="HoSoFilter"
    component={HoSoFilter}
    options={({ navigation, route }) => ({
      ...defaultTitleStyle,
      headerShown: false,
    })}
  />
);

const withNavStackKhaoSatHienTrang = (Component) => (
  <Component
    {...this.props}
    name="KhaoSatHienTrangScr"
    component={KhaoSatHienTrangScr}
    options={({ navigation, route }) => ({
      ...defaultTitleStyle,
      headerShown: false,
    })}
  />
);

const withNavStackEquipments = (Component) => (
  <Component
    {...this.props}
    name="EquipmentScr"
    component={EquipmentScr}
    options={({ navigation, route }) => ({
      ...defaultTitleStyle,
      headerShown: false,
    })}
  />
);

const withNavStackEquipmentImages = (Component) => (
  <Component
    {...this.props}
    name="EquipmentImagesScr"
    component={EquipmentImagesScr}
    options={({ navigation, route }) => ({
      ...defaultTitleStyle,
      headerShown: false,
    })}
  />
);

const withNavStackBatchEquipments = (Component) => (
  <Component
    {...this.props}
    name="BatchEquipmentScr"
    component={BatchEquipmentScr}
    options={({ navigation, route }) => ({
      ...defaultTitleStyle,
      headerShown: false,
    })}
  />
);

const withNavStackBatchEquipmentImages = (Component) => (
  <Component
    {...this.props}
    name="BatchEquipmentImagesSrc"
    component={BatchEquipmentImagesSrc}
    options={({ navigation, route }) => ({
      ...defaultTitleStyle,
      headerShown: false,
    })}
  />
);

const withNavStackBatchREs = (Component) => (
  <Component
    {...this.props}
    name="BatchREScr"
    component={BatchREScr}
    options={({ navigation, route }) => ({
      ...defaultTitleStyle,
      headerShown: false,
    })}
  />
);

const withNavStackBatchREImages = (Component) => (
  <Component
    {...this.props}
    name="BatchREImagesScr"
    component={BatchREImagesScr}
    options={({ navigation, route }) => ({
      ...defaultTitleStyle,
      headerShown: false,
    })}
  />
);

const withNavStackRECondominiums = (Component) => (
  <Component
    {...this.props}
    name="RECondominiumScr"
    component={RECondominiumScr}
    options={({ navigation, route }) => ({
      ...defaultTitleStyle,
      headerShown: false,
    })}
  />
);

const withNavStackRECondominiumImages = (Component) => (
  <Component
    {...this.props}
    name="RECondominiumImagesScr"
    component={RECondominiumImagesScr}
    options={({ navigation, route }) => ({
      ...defaultTitleStyle,
      headerShown: false,
    })}
  />
);

const withNavStackVehicleRoads = (Component) => (
  <Component
    {...this.props}
    name="VehicleRoadScr"
    component={VehicleRoadScr}
    options={({ navigation, route }) => ({
      ...defaultTitleStyle,
      headerShown: false,
    })}
  />
);

const withNavStackVehicleRoadImages = (Component) => (
  <Component
    {...this.props}
    name="VehicleRoadImagesScr"
    component={VehicleRoadImagesScr}
    options={({ navigation, route }) => ({
      ...defaultTitleStyle,
      headerShown: false,
    })}
  />
);

const withNavStackVessels = (Component) => (
  <Component
    {...this.props}
    name="VesselScr"
    component={VesselScr}
    options={({ navigation, route }) => ({
      ...defaultTitleStyle,
      headerShown: false,
    })}
  />
);

const withNavStackVesselImages = (Component) => (
  <Component
    {...this.props}
    name="VesselImagesScr"
    component={VesselImagesScr}
    options={({ navigation, route }) => ({
      ...defaultTitleStyle,
      headerShown: false,
    })}
  />
);

const withNavStackREResidential = (Component) => (
  <Component
    {...this.props}
    name="REResidentialSrc"
    component={REResidentialSrc}
    options={({ navigation, route }) => ({
      ...defaultTitleStyle,
      headerShown: false,
    })}
  />
);

const withNavStackREResidentialImages = (Component) => (
  <Component
    {...this.props}
    name="REResidentialImagesSrc"
    component={REResidentialImagesSrc}
    options={({ navigation, route }) => ({
      ...defaultTitleStyle,
      headerShown: false,
    })}
  />
);

// const withNavStackREFactories = (Component) => (
//   <Component
//     {...this.props}
//     name="ReFactoriesSrc"
//     component={ReFactoriesSrc}
//     options={({ navigation, route }) => ({
//       ...defaultTitleStyle,
//       headerShown: false,
//     })}
//   />
// );

// const withNavStackREFactoriesImages = (Component) => (
//   <Component
//     {...this.props}
//     name="ReFactoriesImagesSrc"
//     component={ReFactoriesImagesSrc}
//     options={({ navigation, route }) => ({
//       ...defaultTitleStyle,
//       headerShown: false,
//     })}
//   />
// );
// const withNavStackReApartments = (Component) => (
//     <Component
//         {...this.props}
//         name="ReApartmentsSrc"
//         component={ReApartmentsSrc}
//         options={({ navigation, route }) => ({
//             ...defaultTitleStyle,
//             headerShown: false,
//         })}
//     />
// );
// const withNavStackReApartmentsImages = (Component) => (
//     <Component
//         {...this.props}
//         name="ReApartmentsImagesSrc"
//         component={ReApartmentsImagesSrc}
//         options={({ navigation, route }) => ({
//             ...defaultTitleStyle,
//             headerShown: false,
//         })}
//     />
// );

const DanhSachTSKhaoSatStack = createStackNavigator();
function DanhSachTSKhaoSatContainer() {
  return (
    <DanhSachTSKhaoSatStack.Navigator>
      <DanhSachTSKhaoSatStack.Screen
        name="DanhsachTSKhaoSatSrc"
        component={DanhsachTSKhaoSatSrc}
        options={({ navigation, route }) => ({
          ...defaultTitleStyle,
          headerShown: false,
        })}
      />
      {withNavStackKhaoSatHienTrang(DanhSachTSKhaoSatStack.Screen)}

      {withNavStackEquipments(DanhSachTSKhaoSatStack.Screen)}
      {withNavStackEquipmentImages(DanhSachTSKhaoSatStack.Screen)}

      {withNavStackBatchEquipments(DanhSachTSKhaoSatStack.Screen)}
      {withNavStackBatchEquipmentImages(DanhSachTSKhaoSatStack.Screen)}

      {withNavStackBatchREs(DanhSachTSKhaoSatStack.Screen)}
      {withNavStackBatchREImages(DanhSachTSKhaoSatStack.Screen)}

      {withNavStackRECondominiums(DanhSachTSKhaoSatStack.Screen)}
      {withNavStackRECondominiumImages(DanhSachTSKhaoSatStack.Screen)}

      {withNavStackVehicleRoads(DanhSachTSKhaoSatStack.Screen)}
      {withNavStackVehicleRoadImages(DanhSachTSKhaoSatStack.Screen)}

      {withNavStackVessels(DanhSachTSKhaoSatStack.Screen)}
      {withNavStackVesselImages(DanhSachTSKhaoSatStack.Screen)}

      {withNavStackREResidential(DanhSachTSKhaoSatStack.Screen)}
      {withNavStackREResidentialImages(DanhSachTSKhaoSatStack.Screen)}

      {withNavStackReBuildings(DanhSachTSKhaoSatStack.Screen)}
      {withNavStackReBuildingImages(DanhSachTSKhaoSatStack.Screen)}

      {withNavStackReFactories(DanhSachTSKhaoSatStack.Screen)}
      {withNavStackReFactoriesImages(DanhSachTSKhaoSatStack.Screen)}

      {withNavStackBatchVehicles(DanhSachTSKhaoSatStack.Screen)}
      {withNavStackBatchVehiclesImages(DanhSachTSKhaoSatStack.Screen)}

      {withNavStackReApartments(DanhSachTSKhaoSatStack.Screen)}
      {withNavStackReApartmentsImages(DanhSachTSKhaoSatStack.Screen)}

      {withNavStackReProjects(DanhSachTSKhaoSatStack.Screen)}
      {withNavStackReProjectsImages(DanhSachTSKhaoSatStack.Screen)}

      {withNavStackFilter(DanhSachTSKhaoSatStack.Screen)}
      {withNavStackPDFView(DanhSachTSKhaoSatStack.Screen)}

    </DanhSachTSKhaoSatStack.Navigator>
  );
}

const WorkInEmployeeStack = createStackNavigator();
function WorkInEmployeeContainer() {
  return (
    <WorkInEmployeeStack.Navigator>
      <WorkInEmployeeStack.Screen
        name="WorkInEmployee"
        component={WorkInEmployeeSrc}
        options={({ navigation, route }) => ({
          ...defaultTitleStyle,
          headerShown: false,
        })}
      />
    </WorkInEmployeeStack.Navigator>
  );
}

const DanhsachBCDGChoDuyetStack = createStackNavigator();
function DanhsachBCDGChoDuyetContainer() {
  return (
    <DanhsachBCDGChoDuyetStack.Navigator>
      <DanhsachBCDGChoDuyetStack.Screen
        name="DanhsachBCDGChoDuyet"
        component={DanhsachBCDGChoDuyetSrc}
        options={({ navigation, route }) => ({
          ...defaultTitleStyle,
          headerShown: false,
        })}
      />
      <DanhsachBCDGChoDuyetStack.Screen
        name="BCDGChoDuyet"
        component={BCDGChoDuyetSrc}
        options={({ navigation, route }) => ({
          ...defaultTitleStyle,
          headerShown: false,
        })}
      />
      {withNavStackFilter(DanhsachBCDGChoDuyetStack.Screen)}
      {withNavStackPDFView(DanhsachBCDGChoDuyetStack.Screen)}
      {withNavStackPreLiminareQuote(DanhsachBCDGChoDuyetStack.Screen)}
    </DanhsachBCDGChoDuyetStack.Navigator>
  );
}

const DSHoSoDangDinhGiaStack = createStackNavigator();
function DSHoSoDangDinhGiaContainer() {
  return (
    <DSHoSoDangDinhGiaStack.Navigator>
      <DSHoSoDangDinhGiaStack.Screen
        name="DSHoSoDangDinhGia"
        component={DSHoSoDangDinhGiaSrc}
        options={({ navigation, route }) => ({
          ...defaultTitleStyle,
          headerShown: false,
        })}
      />
      {withNavStackFilter(DSHoSoDangDinhGiaStack.Screen)}
    </DSHoSoDangDinhGiaStack.Navigator>
  );
}

const ValuationREsStack = createStackNavigator();
function ValuationREsContainer() {
  return (
    <ValuationREsStack.Navigator>
      <ValuationREsStack.Screen
        name="ValuationREs"
        component={ValuationREsSrc}
        options={({ navigation, route }) => ({
          ...defaultTitleStyle,
          headerShown: false,
        })}
      />
    </ValuationREsStack.Navigator>
  );
}

const ValuationCondominiumsStack = createStackNavigator();
function ValuationCondominiumsContainer() {
  return (
    <ValuationCondominiumsStack.Navigator>
      <ValuationCondominiumsStack.Screen
        name="ValuationCondominiums"
        component={ValuationCondominiumsSrc}
        options={({ navigation, route }) => ({
          ...defaultTitleStyle,
          headerShown: false,
        })}
      />
    </ValuationCondominiumsStack.Navigator>
  );
}

const ValuationVehiclesStack = createStackNavigator();
function ValuationVehiclesContainer() {
  return (
    <ValuationVehiclesStack.Navigator>
      <ValuationVehiclesStack.Screen
        name="ValuationVehicles"
        component={ValuationVehiclesSrc}
        options={({ navigation, route }) => ({
          ...defaultTitleStyle,
          headerShown: false,
        })}
      />
    </ValuationVehiclesStack.Navigator>
  );
}
const withNavStackReBuildings = (Component) => (
  <Component
    {...this.props}
    name="ReBuildingsSrc"
    component={ReBuildingsSrc}
    options={({ navigation, route }) => ({
      ...defaultTitleStyle,
      headerShown: false,
    })}
  />
);
const withNavStackReBuildingImages = (Component) => (
  <Component
    {...this.props}
    name="ReBuildingImagesSrc"
    component={ReBuildingImagesSrc}
    options={({ navigation, route }) => ({
      ...defaultTitleStyle,
      headerShown: false,
    })}
  />
);
const withNavStackReFactories = (Component) => (
  <Component
    {...this.props}
    name="ReFactoriesSrc"
    component={ReFactoriesSrc}
    options={({ navigation, route }) => ({
      ...defaultTitleStyle,
      headerShown: false,
    })}
  />
);
const withNavStackReFactoriesImages = (Component) => (
  <Component
    {...this.props}
    name="ReFactoriesImagesSrc"
    component={ReFactoriesImagesSrc}
    options={({ navigation, route }) => ({
      ...defaultTitleStyle,
      headerShown: false,
    })}
  />
);


const withNavStackReProjects = (Component) => (
  <Component
    {...this.props}
    name="ReProjectsSrc"
    component={ReProjectsSrc}
    options={({ navigation, route }) => ({
      ...defaultTitleStyle,
      headerShown: false,
    })}
  />
);
const withNavStackReProjectsImages = (Component) => (
  <Component
    {...this.props}
    name="ReProjectsImagesSrc"
    component={ReProjectsImagesSrc}
    options={({ navigation, route }) => ({
      ...defaultTitleStyle,
      headerShown: false,
    })}
  />
);


const withNavStackBatchVehicles = (Component) => (
  <Component
    {...this.props}
    name="BatchVehiclesSrc"
    component={BatchVehiclesSrc}
    options={({ navigation, route }) => ({
      ...defaultTitleStyle,
      headerShown: false,
    })}
  />
);
const withNavStackBatchVehiclesImages = (Component) => (
  <Component
    {...this.props}
    name="BatchVehiclesImagesSrc"
    component={BatchVehiclesImagesSrc}
    options={({ navigation, route }) => ({
      ...defaultTitleStyle,
      headerShown: false,
    })}
  />
);


const withNavStackReApartments = (Component) => (
  <Component
    {...this.props}
    name="ReApartmentsSrc"
    component={ReApartmentsSrc}
    options={({ navigation, route }) => ({
      ...defaultTitleStyle,
      headerShown: false,
    })}
  />
);
const withNavStackReApartmentsImages = (Component) => (
  <Component
    {...this.props}
    name="ReApartmentsImagesSrc"
    component={ReApartmentsImagesSrc}
    options={({ navigation, route }) => ({
      ...defaultTitleStyle,
      headerShown: false,
    })}
  />
);


const Drawer = createDrawerNavigator();
function DrawerContainer() {
  const [type, setType] = useState(1);

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={({ navigation }) => (
        <View style={{ paddingTop: 27 }}>
          <DrawerItem
            icon={({ color, size }) => (
              <View style={{ width: 27 }}>
                <FontAwesome5
                  name="home"
                  size={size - 3}
                  color={type === 1 ? "#FF9800" : color}
                />
              </View>
            )}
            label="Trang chủ"
            labelStyle={{
              color: type === 1 ? "#FF9800" : "#656566",
              fontSize: 15,
            }}
            onPress={() => {
              setType(1);
              navigation.closeDrawer();
              navigation.navigate("Home");
            }}
          />

          <DrawerItem
            icon={({ color, size }) => (
              <View style={{ width: 27 }}>
                <FontAwesome
                  name="calendar-check-o"
                  size={size - 3}
                  color={type === 2 ? "#FF9800" : color}
                />
              </View>
            )}
            label="Tình trạng công việc"
            labelStyle={{
              color: type === 9 ? "#FF9800" : "#656566",
              fontSize: 15,
            }}
            onPress={() => {
              setType(9);
              navigation.closeDrawer();
              navigation.navigate("WorkInEmployee");
            }}
          />

          <DrawerItem
            icon={({ color, size }) => (
              <View style={{ width: 27 }}>
                <FontAwesome5
                  name="pencil-ruler"
                  size={size - 3}
                  color={type === 2 ? "#FF9800" : color}
                />
              </View>
            )}
            label="DS TS khảo sát"
            labelStyle={{
              color: type === 2 ? "#FF9800" : "#656566",
              fontSize: 15,
            }}
            onPress={() => {
              setType(2);
              navigation.closeDrawer();
              navigation.navigate("DanhSachTSKhaoSat");
            }}
          />

          <DrawerItem
            icon={({ color, size }) => (
              <View style={{ width: 27 }}>
                <FontAwesome5
                  name="folder-open"
                  size={size - 3}
                  color={type === 3 ? "#FF9800" : color}
                />
              </View>
            )}
            label="DS BCĐG chờ duyệt"
            labelStyle={{
              color: type === 3 ? "#FF9800" : "#656566",
              fontSize: 15,
            }}
            onPress={() => {
              setType(3);
              navigation.closeDrawer();
              navigation.navigate("DanhsachBCDGChoDuyet");
            }}
          />

          <DrawerItem
            icon={({ color, size }) => (
              <View style={{ width: 27 }}>
                <FontAwesome5
                  name="folder"
                  size={size - 3}
                  color={type === 4 ? "#FF9800" : color}
                />
              </View>
            )}
            label="DS HS đang ĐG"
            labelStyle={{
              color: type === 4 ? "#FF9800" : "#656566",
              fontSize: 15,
            }}
            onPress={() => {
              setType(4);
              navigation.closeDrawer();
              navigation.navigate("DSHoSoDangDinhGia");
            }}
          />

          <DrawerItem
            icon={({ color, size }) => (
              <View style={{ width: 27 }}>
                <FontAwesome5
                  name="home"
                  size={size - 3}
                  color={type === 5 ? "#FF9800" : color}
                />
              </View>
            )}
            label="TGN Nhà đất PT"
            labelStyle={{
              color: type === 5 ? "#FF9800" : "#656566",
              fontSize: 15,
            }}
            onPress={() => {
              setType(5);
              navigation.closeDrawer();
              navigation.navigate("ValuationREs");
            }}
          />

          <DrawerItem
            icon={({ color, size }) => (
              <View style={{ width: 27 }}>
                <FontAwesome5
                  name="building"
                  size={size - 3}
                  color={type === 6 ? "#FF9800" : color}
                />
              </View>
            )}
            label="TGN Chung cư"
            labelStyle={{
              color: type === 6 ? "#FF9800" : "#656566",
              fontSize: 15,
            }}
            onPress={() => {
              setType(6);
              navigation.closeDrawer();
              navigation.navigate("ValuationCondominiums");
            }}
          />

          <DrawerItem
            icon={({ color, size }) => (
              <View style={{ width: 27 }}>
                <FontAwesome5
                  name="car"
                  size={size - 3}
                  color={type === 7 ? "#FF9800" : color}
                />
              </View>
            )}
            label="TGN PTGTVTĐB"
            labelStyle={{
              color: type === 7 ? "#FF9800" : "#656566",
              fontSize: 15,
            }}
            onPress={() => {
              setType(7);
              navigation.closeDrawer();
              navigation.navigate("ValuationVehicles");
            }}
          />

          <DrawerItem
            icon={({ color, size }) => (
              <View style={{ width: 27 }}>
                <FontAwesome5
                  name="sign-out-alt"
                  size={size - 3}
                  color={type === 8 ? "#FF9800" : color}
                />
              </View>
            )}
            labelStyle={{
              color: type === 8 ? "#FF9800" : "#656566",
              fontSize: 15,
            }}
            label="Đăng xuất"
            onPress={() => {
              setType(8);
              AuthenticationService.SignOut();
              navigation.closeDrawer();
              navigation.navigate("SrcLogin");
            }}
          />
        </View>
      )}
    >
      <Drawer.Screen
        name="Home"
        component={HomeContainer}
        options={{
          drawerLabel: "Trang chủ",
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="WorkInEmployee"
        component={WorkInEmployeeContainer}
        options={{
          drawerLabel: "Tình trạng công việc",
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="DanhSachTSKhaoSat"
        component={DanhSachTSKhaoSatContainer}
        options={{
          drawerLabel: "Danh sách TS Khảo sát",
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="DanhsachBCDGChoDuyet"
        component={DanhsachBCDGChoDuyetContainer}
        options={{
          drawerLabel: "Danh sách BCĐG chờ duyệt",
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="DSHoSoDangDinhGia"
        component={DSHoSoDangDinhGiaContainer}
        options={{
          drawerLabel: "DS hồ sơ đang đinh giá",
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="ValuationREs"
        component={ValuationREsContainer}
        options={{
          drawerLabel: "Tính giá nhanh Nhà đất phổ thông",
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="ValuationCondominiums"
        component={ValuationCondominiumsContainer}
        options={{
          drawerLabel: "Tính giá nhanh Chung cư",
          headerShown: false,
        }}
      />

      <Drawer.Screen
        name="ValuationVehicles"
        component={ValuationVehiclesContainer}
        options={{
          drawerLabel: "Tính giá nhanh PTGTVT Đường bộ",
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  );
}

const Stack = createStackNavigator();
function AppContainer() {
  return (
    <NavigationContainer
      ref={(navigationRef) => setTopLevelNavigator(navigationRef)}
    >
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen
          name="SwitchStack"
          component={SwitchStack}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const SwitchStack = createSwitchNavigator(
  {
    Welcome: Welcome,
    SrcLogin: SrcLogin,
    ProfilesSrc: ProfilesSrc,
    Drawers: DrawerContainer,
    SrcError: Error,
    OTP: OTP,
  },
  {
    initialRouteName: "Welcome",
  }
);

export default AppContainer;
