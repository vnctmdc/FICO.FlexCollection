import React from 'react';
import { View, TouchableOpacity, FlatList, Text, Dimensions, StyleSheet, TextInput } from "react-native";
import Toolbar from "../../components/Toolbar";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";
import { inject, observer } from "mobx-react";
import SMX from "../../constants/SMX";
import GlobalStore from "../../Stores/GlobalStore";
import HttpUtils from "../../Utils/HttpUtils";
import ApiUrl from "../../constants/ApiUrl";
import Utility from "../../Utils/Utility";
import Theme from "../../Themes/Default";
import { ClientMessage } from "../../SharedEntity/SMXException";
import PopupModal from "../../components/PopupModal";
import * as Enums from '../../constants/Enums';
import WorkInEmployeeDto from '../../DtoParams/WorkInEmployeeDto';
import sb_ConfRegion from '../../Entities/sb_ConfRegion';
import sb_ConfArea from '../../Entities/sb_ConfArea';
import sb_ConfRegionEmployee from '../../Entities/sb_ConfRegionEmployee';
import vWorkingCalendarDetail from '../../Entities/EntityViews/vWorkingCalendarDetail';
import PopupModalUpdateNote from '../../components/PopupModalUpdateNote';
import { LinearGradient } from 'expo-linear-gradient';
import DropDownBox from '../../components/DropDownBox';

const { width, height } = Dimensions.get("window");

interface iProps {
    GlobalStore: GlobalStore;
    navigation: any;
}

interface iState {
    PageIndex: number;
    ListvWorkingCalendarDetail?: vWorkingCalendarDetail[];
    ListConfRegion?: sb_ConfRegion[];
    ListConfArea?: sb_ConfArea[];
    ListConfRegionEmployee?: sb_ConfRegionEmployee[];
    showSearch: boolean;
    SelectedRegion?: number;
    SelectedArea?: number;
    SelectedEmployee?: number;
    vWorkingCalendarDetail?: vWorkingCalendarDetail;
}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class WorkInEmployeeSrc extends React.Component<iProps, iState> {
    private onEndReachedCalledDuringMomentumAll = false;
    constructor(props: iProps) {
        super(props);
        this.state = {
            PageIndex: 0,
            ListConfRegion: [],
            ListConfArea: [],
            ListConfRegionEmployee: [],
            showSearch: false,
            vWorkingCalendarDetail: new vWorkingCalendarDetail(),
        };
    }

    async componentDidMount() {
        await this.SetupViewForm();
        await this.LoadData(false);

    }

    async SetupViewForm() {
        try {
            this.props.GlobalStore.ShowLoading();
            var req = new WorkInEmployeeDto();
            req.PageIndex = this.state.PageIndex;

            let res = await HttpUtils.post<WorkInEmployeeDto>(
                ApiUrl.WorkInEmployee_Execute,
                SMX.ApiActionCode.SetupViewForm,
                JSON.stringify(req)
            );

            this.setState({
                ListConfRegion: res!.ListConfRegion!,
            });

            this.props.GlobalStore.HideLoading();
        } catch (ex) {
            this.props.GlobalStore.HideLoading();
            this.props.GlobalStore.Exception = ex;
        }

    }

    async GetListEmpAndAreaByConfRegionID() {
        try {
            this.props.GlobalStore.ShowLoading();
            var req = new WorkInEmployeeDto();
            req.ConfRegionID = this.state.SelectedRegion;

            let res = await HttpUtils.post<WorkInEmployeeDto>(
                ApiUrl.WorkInEmployee_Execute,
                SMX.ApiActionCode.GetListEmpAndAreaByConfRegionID,
                JSON.stringify(req)
            );

            this.setState({
                ListConfRegionEmployee: res!.ListConfRegionEmployee!,
                ListConfArea: res!.ListConfArea!,
            });

            this.props.GlobalStore.HideLoading();
        } catch (ex) {
            this.props.GlobalStore.HideLoading();
            this.props.GlobalStore.Exception = ex;
        }
    }

    async LoadData(isLoadMore: boolean) {
        try {
            this.props.GlobalStore.ShowLoading();
            var req = new WorkInEmployeeDto();
            req.PageIndex = this.state.PageIndex;
            var lstEmp = [];
            lstEmp.unshift(this.state.SelectedEmployee);
            var vDetail = new vWorkingCalendarDetail();
            vDetail.ListEmployeeID = lstEmp;
            vDetail.RegionID = this.state.SelectedRegion;
            vDetail.AreaID = this.state.SelectedArea;

            req.vWorkingCalendarDetail = vDetail;

            let res = await HttpUtils.post<WorkInEmployeeDto>(
                ApiUrl.WorkInEmployee_Execute,
                SMX.ApiActionCode.SearchData,
                JSON.stringify(req)
            );

            this.setState({
                ListvWorkingCalendarDetail: res!.ListvWorkingCalendarDetail!,
                SelectedEmployee: undefined,
                SelectedRegion: undefined,
                SelectedArea: undefined,
                ListConfArea: [],
                ListConfRegionEmployee: [],
            });

            this.props.GlobalStore.HideLoading();
        } catch (ex) {
            this.props.GlobalStore.HideLoading();
            this.props.GlobalStore.Exception = ex;
        }

    }

    renderItem(index: number, item: vWorkingCalendarDetail) {

        return (
            <View
                style={{
                    borderBottomWidth: 1,
                    borderBottomColor: "gainsboro",
                    paddingHorizontal: 8,
                    paddingVertical: 3
                }}
            >
                <View style={styles.Item}>
                    <View style={{ flex: 2, flexDirection: "row" }}>
                        <Text style={{ fontWeight: "600" }}>STT </Text>
                    </View>
                    <View style={{ flex: 3 }}>
                        <Text>{index + 1}</Text>
                    </View>
                </View>
                <View style={styles.Item}>
                    <View style={{ flex: 2, flexDirection: "row" }}>
                        <Text style={{ fontWeight: "600" }}>Chuyên viên </Text>
                    </View>
                    <View style={{ flex: 3 }}>
                        <Text>{item.EmployeeName}</Text>
                    </View>
                </View>
                <View style={styles.Item}>
                    <View style={{ flex: 2, flexDirection: "row" }}>
                        <Text style={{ fontWeight: "600" }}>Tuyến </Text>
                    </View>
                    <View style={{ flex: 3 }}>
                        <Text>{item.AreaName}</Text>
                    </View>
                </View>
                <View style={styles.Item}>
                    <View style={{ flex: 2, flexDirection: "row" }}>
                        <Text style={{ fontWeight: "600" }}>Vị trí </Text>
                    </View>
                    <View style={{ flex: 3 }}>
                        <Text>{item.Location}</Text>
                    </View>
                </View>
                <View style={styles.Item}>
                    <View style={{ flex: 2, flexDirection: "row" }}>
                        <Text style={{ fontWeight: "600" }}>BĐS </Text>
                    </View>
                    <View style={{ flex: 3 }}>
                        <Text>{item.CountHoSoBDS}</Text>
                    </View>
                </View>
                <View style={styles.Item}>
                    <View style={{ flex: 2, flexDirection: "row" }}>
                        <Text style={{ fontWeight: "600" }}>PTVT </Text>
                    </View>
                    <View style={{ flex: 3 }}>
                        <Text>{item.CountHoSoPTVT}</Text>
                    </View>
                </View>
                <View style={styles.Item}>
                    <View style={{ flex: 2, flexDirection: "row" }}>
                        <Text style={{ fontWeight: "600" }}>MMTB </Text>
                    </View>
                    <View style={{ flex: 3 }}>
                        <Text>{item.CountHoSoMMTB}</Text>
                    </View>
                </View>
                <View style={styles.Item}>
                    <View style={{ flex: 2, flexDirection: "row" }}>
                        <Text style={{ fontWeight: "600" }}>Số HĐ đang thực hiện </Text>
                    </View>
                    <View style={{ flex: 3 }}>
                        <Text>{item.CountHSDangThucHien}</Text>
                    </View>
                </View>
                <View style={styles.Item}>
                    <View style={{ flex: 2, flexDirection: "row" }}>
                        <Text style={{ fontWeight: "600" }}>Đang thực hiện/Tổng năng suất </Text>
                    </View>
                    <View style={{ flex: 3 }}>
                        <Text>{item.CountHSDangThucHien + "/" + item.CountTongHS}</Text>
                    </View>
                </View>
            </View>
        );
    }

    showSearch = () => {
        this.setState({ showSearch: !this.state.showSearch });
    };

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <Toolbar Title="Tiến độ cv chuyên viên" navigation={this.props.navigation} HasDrawer={true}>
                    <View style={{ marginLeft: 10 }}>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => {
                                this.setState({ PageIndex: 0 }, async () =>
                                    this.LoadData(false))
                            }}
                        >
                            <AntDesign name="reload1" size={22} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginLeft: 10 }}>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => {
                                this.setState({ showSearch: true })
                            }}
                        >
                            <AntDesign name="search1" size={25} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </Toolbar>

                <PopupModalUpdateNote
                    resetState={this.showSearch}
                    modalVisible={this.state.showSearch}
                    title="Tìm kiếm"
                >
                    <View style={styles.Item}>
                        <View style={{ flex: 2, flexDirection: 'row' }}>
                            <Text >Cụm </Text>
                        </View>
                        <View style={{ flex: 3 }}>
                            <DropDownBox
                                TextField="Name"
                                ValueField="ConfRegionID"
                                DataSource={this.state.ListConfRegion}
                                SelectedValue={this.state.SelectedRegion}
                                OnSelectedItemChanged={(item) => {
                                    this.setState({ SelectedRegion: item.ConfRegionID }, async () => {
                                        await this.GetListEmpAndAreaByConfRegionID();
                                    });
                                }}
                            />
                        </View>
                    </View>
                    <View style={styles.Item}>
                        <View style={{ flex: 2, flexDirection: 'row' }}>
                            <Text>Tuyến </Text>
                        </View>
                        <View style={{ flex: 3 }}>
                            <DropDownBox
                                TextField="Name"
                                ValueField="ConfAreaID"
                                DataSource={this.state.ListConfArea}
                                SelectedValue={this.state.SelectedArea}
                                OnSelectedItemChanged={(item) => {
                                    this.setState({ SelectedArea: item.ConfAreaID });
                                }}
                            />
                        </View>
                    </View>
                    <View style={styles.Item}>
                        <View style={{ flex: 2, flexDirection: 'row' }}>
                            <Text>Tên chuyên viên </Text>
                        </View>
                        <View style={{ flex: 3 }}>
                            <DropDownBox
                                TextField="EmployeeName"
                                ValueField="EmployeeID"
                                DataSource={this.state.ListConfRegionEmployee}
                                SelectedValue={this.state.SelectedEmployee}
                                OnSelectedItemChanged={(item) => {
                                    this.setState({ SelectedEmployee: item.EmployeeID });
                                }}
                            />
                        </View>
                    </View>
                    <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "flex-end" }}>
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({ showSearch: false }, async () => {
                                    await this.LoadData(false);
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
                                    Tìm kiếm
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                width: width / 4,
                                backgroundColor: "#E6E9EE",
                                padding: 10,
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 5,
                                alignSelf: "center",
                                marginLeft: 5,
                            }}
                            onPress={() => {
                                this.setState({ showSearch: false });
                            }}
                        >
                            <Text style={{ color: "#1B2031", fontSize: 15 }}>
                                Bỏ qua
                            </Text>
                        </TouchableOpacity>
                    </View>
                </PopupModalUpdateNote>

                <FlatList
                    data={this.state.ListvWorkingCalendarDetail}
                    renderItem={({ item, index }) => this.renderItem(index, item)}
                    keyExtractor={(item, i) => i.toString()}
                    onMomentumScrollBegin={() => {
                        this.onEndReachedCalledDuringMomentumAll = false;
                    }}
                    onEndReached={() => {
                        if (!this.onEndReachedCalledDuringMomentumAll) {
                            if (this.state.ListvWorkingCalendarDetail.length >= 20) {
                                this.setState({ PageIndex: this.state.PageIndex + 1 }, async () => {
                                    await this.LoadData(true);
                                });
                                this.onEndReachedCalledDuringMomentumAll = true;
                            }
                        }
                    }}
                    onEndReachedThreshold={0.5}
                />
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