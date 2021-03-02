import { GlobalDto } from "../DtoParams/GlobalDto";
import HttpUtils from "./HttpUtils";
import ApiUrl from "../constants/ApiUrl";
import * as Device from "expo-device";

export default class LogManager {
    public static async Log(logMsg: string) {
        let global = new GlobalDto();
        global.ExceptionInfo = logMsg;
        global.DeviceInfo = Device.brand + " " + Device.modelName;
        HttpUtils.post<GlobalDto>(ApiUrl.Global_LogError, null, JSON.stringify(global), false);
    }
}
