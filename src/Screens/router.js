import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from "react-native";
import { NavigationContainer, CommonActions } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createSwitchNavigator } from "@react-navigation/compat";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Octicons from "react-native-vector-icons/Octicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { setTopLevelNavigator } from "./NavigationService";

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { DrawerItem, DrawerContentScrollView, createDrawerNavigator } from "@react-navigation/drawer";

import GoBack from "../components/GoBack";
// Shared
import Welcome from "./shared/Welcome";
import SrcLogin from "./shared/Login";
import SrcLogout from "./shared/Logout";
import Home from "./Home";

import AuthenticationService from "../Utils/AuthenticationService";
import Error from "./shared/Error";

//new
import DanhsachTSKhaoSatSrc from "../Screens/DanhSachTSKhaoSat/Default";
import HoSoFilter from "../Screens/DanhSachTSKhaoSat/HoSoFilter";
import DanhsachBCDGChoDuyetSrc from "../Screens/ApprovingValuation/Default";
import BCDGChoDuyetSrc from "../Screens/ApprovingValuation/Display";
import PDFView from "../Screens/ApprovingValuation/PDFView";
import DSHoSoDangDinhGiaSrc from "../Screens/HoSoDangDinhGia/Default";
import ValuationREsSrc from "../Screens/QuickValuations/ValuationREs/AddNew";
import ValuationCondominiumsSrc from "../Screens/QuickValuations/ValuationCondominiums/AddNew";
import ValuationVehiclesSrc from "../Screens/QuickValuations/ValuationVehicles/AddNew";
import KhaoSatHienTrangScr from "../Screens/DanhSachTSKhaoSat/Edit";

//Actions
import EquipmentsSrc from "../Screens/Actions/Equipments/Edit";
import EquipmentImagesSrc from "../Screens/Actions/Equipments/Images";

import BatchEquipmentsSrc from "../Screens/Actions/BatchEquipments/Edit";
import BatchEquipmentsImagesSrc from "../Screens/Actions/BatchEquipments/Images";


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
                            <TouchableOpacity style={{ marginLeft: 15 }} onPress={() => navigation.openDrawer()}>
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
        name="KhaoSatHienTrangSrc"
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
        name="EquipmentsSrc"
        component={EquipmentsSrc}
        options={({ navigation, route }) => ({
            ...defaultTitleStyle,
            headerShown: false,
        })}
    />
);

const withNavStackEquipmentImages = (Component) => (
    <Component
        {...this.props}
        name="EquipmentImagesSrc"
        component={EquipmentImagesSrc}
        options={({ navigation, route }) => ({
            ...defaultTitleStyle,
            headerShown: false,
        })}
    />
);

const withNavStackBatchEquipments = (Component) => (
    <Component
        {...this.props}
        name="BatchEquipmentsSrc"
        component={BatchEquipmentsSrc}
        options={({ navigation, route }) => ({
            ...defaultTitleStyle,
            headerShown: false,
        })}
    />
);

const withNavStackBatchEquipmentsImages = (Component) => (
    <Component
        {...this.props}
        name="BatchEquipmentsImagesSrc"
        component={BatchEquipmentsImagesSrc}
        options={({ navigation, route }) => ({
            ...defaultTitleStyle,
            headerShown: false,
        })}
    />
);

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
            {withNavStackBatchEquipmentsImages(DanhSachTSKhaoSatStack.Screen)}

            {withNavStackFilter(DanhSachTSKhaoSatStack.Screen)}
        </DanhSachTSKhaoSatStack.Navigator>
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
            {withNavStackFilter(DanhSachTSKhaoSatStack.Screen)}
            {withNavStackPDFView(DanhSachTSKhaoSatStack.Screen)}
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
            {withNavStackFilter(DanhSachTSKhaoSatStack.Screen)}
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
                                <FontAwesome5 name="home" size={size - 3} color={type === 1 ? "#FF9800" : color} />
                            </View>
                        )}
                        label="Trang chủ"
                        labelStyle={{ color: type === 1 ? "#FF9800" : "#656566", fontSize: 15 }}
                        onPress={() => {
                            setType(1);
                            navigation.closeDrawer();
                            navigation.navigate("Home");
                        }}
                    />

                    <DrawerItem
                        icon={({ color, size }) => (
                            <View style={{ width: 27 }}>
                                <FontAwesome5 name="users" size={size - 3} color={type === 2 ? "#FF9800" : color} />
                            </View>
                        )}
                        label="Danh sách TS khảo sát"
                        labelStyle={{ color: type === 2 ? "#FF9800" : "#656566", fontSize: 15 }}
                        onPress={() => {
                            setType(2);
                            navigation.closeDrawer();
                            navigation.navigate("DanhSachTSKhaoSat");
                        }}
                    />

                    <DrawerItem
                        icon={({ color, size }) => (
                            <View style={{ width: 27 }}>
                                <FontAwesome5 name="users" size={size - 3} color={type === 3 ? "#FF9800" : color} />
                            </View>
                        )}
                        label="Danh sách BCĐG chờ duyệt"
                        labelStyle={{ color: type === 3 ? "#FF9800" : "#656566", fontSize: 15 }}
                        onPress={() => {
                            setType(3);
                            navigation.closeDrawer();
                            navigation.navigate("DanhsachBCDGChoDuyet");
                        }}
                    />

                    <DrawerItem
                        icon={({ color, size }) => (
                            <View style={{ width: 27 }}>
                                <FontAwesome5 name="users" size={size - 3} color={type === 4 ? "#FF9800" : color} />
                            </View>
                        )}
                        label="Danh sách hồ sơ đang định giá"
                        labelStyle={{ color: type === 4 ? "#FF9800" : "#656566", fontSize: 15 }}
                        onPress={() => {
                            setType(4);
                            navigation.closeDrawer();
                            navigation.navigate("DSHoSoDangDinhGia");
                        }}
                    />

                    <DrawerItem
                        icon={({ color, size }) => (
                            <View style={{ width: 27 }}>
                                <FontAwesome5 name="users" size={size - 3} color={type === 5 ? "#FF9800" : color} />
                            </View>
                        )}
                        label="Tính giá nhanh Nhà đất phổ thông"
                        labelStyle={{ color: type === 5 ? "#FF9800" : "#656566", fontSize: 15 }}
                        onPress={() => {
                            setType(5);
                            navigation.closeDrawer();
                            navigation.navigate("ValuationREs");
                        }}
                    />

                    <DrawerItem
                        icon={({ color, size }) => (
                            <View style={{ width: 27 }}>
                                <FontAwesome5 name="users" size={size - 3} color={type === 6 ? "#FF9800" : color} />
                            </View>
                        )}
                        label="Tính giá nhanh Chung cư"
                        labelStyle={{ color: type === 6 ? "#FF9800" : "#656566", fontSize: 15 }}
                        onPress={() => {
                            setType(6);
                            navigation.closeDrawer();
                            navigation.navigate("ValuationCondominiums");
                        }}
                    />

                    <DrawerItem
                        icon={({ color, size }) => (
                            <View style={{ width: 27 }}>
                                <FontAwesome5 name="users" size={size - 3} color={type === 7 ? "#FF9800" : color} />
                            </View>
                        )}
                        label="Tính giá nhanh PTGTVT Đường bộ"
                        labelStyle={{ color: type === 7 ? "#FF9800" : "#656566", fontSize: 15 }}
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
                        labelStyle={{ color: type === 8 ? "#FF9800" : "#656566", fontSize: 15 }}
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
        <NavigationContainer ref={(navigationRef) => setTopLevelNavigator(navigationRef)}>
            <Stack.Navigator initialRouteName="Welcome">
                <Stack.Screen name="SwitchStack" component={SwitchStack} options={{ headerShown: false }} />
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
    },
    {
        initialRouteName: "Welcome",
    }
);

export default AppContainer;
