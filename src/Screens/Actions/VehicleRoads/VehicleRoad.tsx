

import React from "react";
import { View, Text, TouchableOpacity, TextInput, Button, Alert, BackHandler,Image } from "react-native";
import { inject, observer } from "mobx-react";
import GlobalStore from "../../../Stores/GlobalStore";
import Utility from "../../../Utils/Utility";
import SMX from "../../../constants/SMX";
interface iProps {
    navigation: any;
}

@inject(SMX.StoreName.GlobalStore)
@observer
export default class VehicleRoad extends React.Component<iProps,any>{
    constructor(props:iProps)
    {
        super(props);
    }
    render(){
        return(
            <View>
                Khảo sát phương tiện vận tai
            </View>
        )
    }
}