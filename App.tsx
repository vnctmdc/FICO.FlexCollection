import "react-native-gesture-handler";

import React, { useState } from "react";
import AppContainer from "./src/Screens/router";
import { MobXProviderContext } from "mobx-react";
import {
    setJSExceptionHandler,
    //setNativeExceptionHandler,
} from "react-native-exception-handler";
import * as Device from "expo-device";
import { AppState, Image, AsyncStorage, View, Text, LogBox } from "react-native";
import { GlobalDto } from "./src/DtoParams/GlobalDto";
import LogManager from "./src/Utils/LogManager";
import GlobalStore from "./src/Stores/GlobalStore";
import ErrorHandler from "./src/components/ErrorHandler";
import LoadingModal from "./src/components/LoadingModal";
import BackgroundTaskRunner from "./src/components/BackgroundTaskRunner";
import * as Location from "expo-location";
import TrackingDTO from "./src/DtoParams/TrackingDTO";
import HttpUtils from "./src/Utils/HttpUtils";
import ApiUrl from "./src/constants/ApiUrl";
import SMX from "./src/constants/SMX";
import LoginActivivty from "./src/Entities/LoginActivivty";

//console.disableYellowBox = true;
LogBox.ignoreAllLogs(true)

const handleError = async (error, isFatal) => {
    if (error) {
        try {
            let content = error.message + ": " + JSON.stringify(error.stack);
            //let request = new GlobalDto();
            //request.DeviceInfo = Device.brand + " " + Device.modelName;
            //request.ExceptionInfo = content;

            LogManager.Log(content);
        } catch (e) {
            console.log(e);
        }
    }
};

setJSExceptionHandler((error, isFatal) => {
    //console.log("setJSExceptionHandler");
    handleError(error, isFatal);
}, true);

// setNativeExceptionHandler(errorString => {
//   //console.log("setNativeExceptionHandler");
//   handleError(errorString, true);
// });

export function Provider({ children, ...propsValue }) {
    const contextValue = React.useContext(MobXProviderContext);
    const [value] = React.useState(() => ({
        ...contextValue,
        ...propsValue,
    }));

    // if (process.env.NODE_ENV !== "production") {
    //     const newValue = { ...value, ...propsValue } // spread in previous value for the context based stores
    //     if (!shallowEqual(value, newValue)) {
    //         throw new Error(
    //             "MobX Provider: The set of provided stores has changed. Please avoid changing stores as the change might not propagate to all children"
    //         )
    //     }
    // }

    return <MobXProviderContext.Provider value={value}>{children}</MobXProviderContext.Provider>;
}

export default class App extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    async componentDidMount() {

    }

    async Tracking() {
        let location = await Location.getCurrentPositionAsync({});
        if (location && location.coords) {
            let reqPosTracking = new TrackingDTO();
            let item = new LoginActivivty();
            item.Latitude = location.coords.latitude.toString();
            item.Longitude = location.coords.longitude.toString();
            item.Coordinates = `${location.coords.latitude.toString()},${location.coords.longitude.toString()}`;

            //console.log(222, item);
            
            reqPosTracking.LoginActivivty = item;

            await HttpUtils.post<TrackingDTO>(
                ApiUrl.PostionTracking_Execute,
                SMX.ApiActionCode.SaveItem,
                JSON.stringify(reqPosTracking)
            );
        }
    }

    render() {
        return (
            <Provider GlobalStore={new GlobalStore()}>
                <AppContainer />
                <ErrorHandler />
                <LoadingModal Loading={false} />
                <View style={{ display: "none" }}>
                    <BackgroundTaskRunner
                        runTime={1000 * 60 * 5}
                        task={() => {
                            console.log("Tracking " + Math.random());
                            this.Tracking();
                        }}
                    />
                </View>
            </Provider>
        );
    }

}

// export default function App() {
//     return (
//         <Provider GlobalStore={new GlobalStore()}>
//             <AppContainer />
//             <ErrorHandler />
//             <LoadingModal Loading={false} />
//             <View style={{ display: "none" }}>
//                     <BackgroundTaskRunner
//                         runTime={1000 * 60 * 5} // 5 phut
//                         task={() => {
//                             console.log("My task " + Math.random());
//                             this.syncCollectionAction();
//                         }}
//                     />
//                     <BackgroundTaskRunner
//                         runTime={1000 * 60} // 1 phut
//                         task={() => {
//                             console.log("Tracking " + Math.random());
//                             this.Tracking();
//                         }}
//                     />
//                 </View>
//         </Provider>
//     );
// }
